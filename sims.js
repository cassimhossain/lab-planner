/* Virtual labs: simulators available in the portal.
   PhET simulations: PhET Interactive Simulations, University of Colorado Boulder, https://phet.colorado.edu (CC BY 4.0). Stored in sims/phet so they work without internet.
   BlocksCAD: https://www.blockscad3d.com (open source, GPL v3). Loaded from the official site, needs internet.
   Circuit Lab: our own Arduino simulator (circuit/, installable as an app).
   Code Lab: Python (Pyodide, runs in the browser) and C++ (g++ on the Wandbox online compiler), in codelab/. */
window.SIMS = {
  list: [
    { key: "circuit-lab", name: "Circuit Lab", by: "Robotics & AI Club", kind: "build", href: "circuit/", offline: false,
      about: "Build Arduino circuits with LEDs, buttons, sensors, servos and motors, write the code and run it.",
      good: "Arduino lessons: blink, traffic lights, sensors, servos, motors", ages: "8+", color: "#2E6BE6" },
    { key: "code-lab", name: "Code Lab", by: "Robotics & AI Club", kind: "code", href: "codelab/", offline: false,
      about: "Write and run Python and C++ in the browser. input() waits for typing, errors are explained, and plots show up.",
      good: "Python and C++ practice, algorithms, AI and data projects (numpy, matplotlib)", ages: "10+", color: "#7C3AED" },
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
  /* Lessons with a ready-made circuit and code in Circuit Lab (circuit/#lesson=CODE) */
  circuits: "F-00 F-01 F-02 F-04 JM-00 JM-01 JM-02 JM-03 JM-04 JM-05 JM-06 JM-07 JM-08 JM-09 JM-11 JM-12 JM-13 JM-15 JM-20 JM-21 JM-22 JM-23 JM-25 JM-26 JM-27 JM-32 LE-01 LE-02 LE-03 LE-04 LE-05 LE-06 LE-07 LE-08 LE-09 LE-10 LE-11 LE-12 LE-19 LE-21 LE-22 LE-23 LE-30 LE-32 TL-01 TL-02 TL-03 TL-04 TL-05 TL-06 TL-07 TL-08 TL-09 TL-10 TL-12 TL-14 TL-16 TL-19 TL-23 TL-25 TL-26 TL-27 TL-28 YI-02 YI-03 YI-04 YI-05 YI-06 YI-07 YI-08 YI-09 YI-10 YI-11 YI-18 YI-21 YI-22 YI-23 YI-25 YI-26 YI-27 YI-28 YI-32".split(" "),
  /* keyword rules: lesson title or domain -> simulator */
  rules: [
    [/series|parallel|paper circuit|lemon battery|circuit card|conductor|insulator/i, ["cck-dc", "ohms-law"]],
    [/resistor|ohm/i, ["ohms-law", "resistance-wire"]],
    [/555|timer|capacitor/i, ["capacitor", "cck-ac"]],
    [/motor|generator|electromagnet|relay|solenoid|dynamo/i, ["em-lab", "faradays-law"]],
    [/3d|cad|enclosure|gripper|gearbox|badge|mount|printed/i, ["blockscad"]],
    [/python|c\+\+|coding|programm|algorithm|machine learning|neural|tinyml|\bAI\b|data|game|turtle|chatbot/i, ["code-lab"]]
  ]
};
window.SIMS.byKey = Object.fromEntries(window.SIMS.list.map(s => [s.key, s]));
/* simulators for one lesson: [{ sim, href, why }] */
window.SIMS.forLesson = function (code, title, domain) {
  const S = window.SIMS, out = [], seen = new Set();
  const add = (k, href, why) => { if (seen.has(k) || !S.byKey[k]) return; seen.add(k); out.push({ sim: S.byKey[k], href, why }); };
  code = String(code || "").replace(/\s*\(.*\)$/, "");
  if (S.circuits.includes(code)) add("circuit-lab", "circuit/#lesson=" + code, "Ready-made circuit and code for this lesson");
  const txt = (title || "") + " " + (domain || "");
  S.rules.forEach(([re, ks]) => { if (re.test(txt)) ks.forEach(k => S.byKey[k] && add(k, S.byKey[k].href || "sim.html?s=" + k, S.byKey[k].good)); });
  return out;
};
