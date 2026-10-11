/* Virtual labs: simulators available in the portal.
   PhET simulations: PhET Interactive Simulations, University of Colorado Boulder, https://phet.colorado.edu (CC BY 4.0). Stored in sims/phet so they work without internet.
   BlocksCAD: https://www.blockscad3d.com (open source, GPL v3). Loaded from the official site, needs internet.
   Circuit Lab: our own Arduino simulator (circuit.html). */
window.SIMS = {
  list: [
    { key: "circuit-lab", name: "Circuit Lab", by: "Robotics & AI Club", kind: "build", href: "circuit.html", offline: false,
      about: "Build Arduino circuits with LEDs, buttons, sensors, servos and motors, write the code and run it.",
      good: "Arduino lessons: blink, traffic lights, sensors, servos, motors", ages: "8+", color: "#2E6BE6" },
    { key: "cck-dc", name: "Circuit Construction Kit: DC", by: "PhET", kind: "phet", src: "sims/phet/circuit-construction-kit-dc_en.html", web: "https://phet.colorado.edu/en/simulations/circuit-construction-kit-dc",
      about: "Batteries, bulbs, switches and resistors. Build series and parallel circuits and measure them with a meter.",
      good: "Series and parallel circuits, open and closed circuits, conductors and insulators", ages: "8+", color: "#F2A31B" },
    { key: "ohms-law", name: "Ohm's Law", by: "PhET", kind: "phet", src: "sims/phet/ohms-law_en.html", web: "https://phet.colorado.edu/en/simulations/ohms-law",
      about: "Change voltage and resistance and watch the current change. See V = I × R come alive.",
      good: "Why LEDs need a resistor, voltage, current and resistance", ages: "11+", color: "#3FA36B" },
    { key: "resistance-wire", name: "Resistance in a Wire", by: "PhET", kind: "phet", src: "sims/phet/resistance-in-a-wire_en.html", web: "https://phet.colorado.edu/en/simulations/resistance-in-a-wire",
      about: "Make a wire longer, thicker or out of a different material and see how its resistance changes.",
      good: "What resistance is, choosing wires", ages: "11+", color: "#8A5CD6" },
    { key: "cck-ac", name: "Circuit Construction Kit: AC", by: "PhET", kind: "phet", src: "sims/phet/circuit-construction-kit-ac_en.html", web: "https://phet.colorado.edu/en/simulations/circuit-construction-kit-ac",
      about: "Add capacitors, inductors and AC sources. Watch charge flow back and forth.",
      good: "Capacitors, timers, AC and DC", ages: "14+", color: "#D9534F" },
    { key: "capacitor", name: "Capacitor Lab: Basics", by: "PhET", kind: "phet", src: "sims/phet/capacitor-lab-basics_en.html", web: "https://phet.colorado.edu/en/simulations/capacitor-lab-basics",
      about: "Charge a capacitor, change the plates and see how much energy it stores.",
      good: "555 timer circuits, storing energy", ages: "14+", color: "#1E9AA8" },
    { key: "faradays-law", name: "Faraday's Law", by: "PhET", kind: "phet", src: "sims/phet/faradays-law_en.html", web: "https://phet.colorado.edu/en/simulations/faradays-law",
      about: "Move a magnet through a coil and light a bulb. The idea behind every generator.",
      good: "Motors and generators, magnets and electricity", ages: "11+", color: "#E0662B" },
    { key: "em-lab", name: "Faraday's Electromagnetic Lab", by: "PhET", kind: "phet", src: "sims/phet/faradays-electromagnetic-lab_en.html", web: "https://phet.colorado.edu/en/simulations/faradays-electromagnetic-lab",
      about: "Electromagnets, transformers and generators in one lab.",
      good: "Electromagnets, motors, relays and solenoids", ages: "12+", color: "#5B6CD9" },
    { key: "blockscad", name: "BlocksCAD", by: "BlocksCAD", kind: "cad", src: "https://www.blockscad3d.com/editor/", web: "https://www.blockscad3d.com", online: true,
      about: "Snap blocks together to make 3D shapes, then export an STL for the 3D printer.",
      good: "3D modelling and printing, name badges, enclosures, grippers, gears", ages: "10+", color: "#6E3FC8" }
  ],
  /* Circuit Lab examples that match a lesson exactly */
  examples: { "F-01": "blink", "LE-02": "button", "LE-04": "traffic", "LE-05": "nightlamp", "LE-06": "thermometer", "LE-08": "pir", "LE-09": "servo", "LE-22": "melody",
    "JM-01": "dimmer", "JM-03": "weather", "JM-04": "ultrasonic", "JM-21": "rainbow", "YI-04": "stepper" },
  /* keyword rules: lesson title or domain -> simulator */
  rules: [
    [/series|parallel|paper circuit|lemon battery|circuit card|conductor|insulator/i, ["cck-dc", "ohms-law"]],
    [/resistor|ohm/i, ["ohms-law", "resistance-wire"]],
    [/555|timer|capacitor/i, ["capacitor", "cck-ac"]],
    [/motor|generator|electromagnet|relay|solenoid|dynamo/i, ["em-lab", "faradays-law"]],
    [/3d|cad|enclosure|gripper|gearbox|badge|mount|printed/i, ["blockscad"]]
  ]
};
window.SIMS.byKey = Object.fromEntries(window.SIMS.list.map(s => [s.key, s]));
/* simulators for one lesson: [{ sim, href, why }] */
window.SIMS.forLesson = function (code, title, domain) {
  const S = window.SIMS, out = [], seen = new Set();
  const add = (k, href, why) => { if (seen.has(k) || !S.byKey[k]) return; seen.add(k); out.push({ sim: S.byKey[k], href, why }); };
  code = String(code || "").replace(/\s*\(.*\)$/, "");
  const ex = S.examples[code]; if (ex) add("circuit-lab", "circuit.html#ex=" + ex, "Ready-made circuit for this lesson");
  const txt = (title || "") + " " + (domain || "");
  S.rules.forEach(([re, ks]) => { if (re.test(txt)) ks.forEach(k => add(k, "sim.html?s=" + k, S.byKey[k].good)); });
  return out;
};
