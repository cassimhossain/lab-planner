window.RAI_LESSONS["EF-02"] = {
  fact: "An LED connected straight to a 9 V battery can burn out in less than a second.",
  think: { q: "Why does an LED burn out in a flash without a tiny resistor?", art: "💡💥", cap: "too much current!",
    guesses: ["The battery is too big", "The LED is cheap", "Nothing slows the current"],
    story: { h: "The pop", text: "Plug an LED straight into a battery and it glows bright for a moment, then goes dark forever. Add a resistor the size of a grain of rice and it glows happily for years." },
    today: "we meet **voltage, current and resistance**, predict with **V = I × R**, then check with a real multimeter." },
  objectives: [
    { t: "Describe voltage, current and resistance", proof: "I can explain them with the water-pipe model" },
    { t: "Predict current with V = I × R", proof: "my prediction was close to the meter reading" },
    { t: "Choose a safe resistor for an LED", proof: "I calculated a resistor and my LED lit safely" }
  ],
  video: { title: "Voltage, current and resistance explained", search: "voltage current resistance water analogy explained", mins: 6,
    watch: ["What does voltage push?", "What does resistance do to the flow?", "Why do LEDs need a resistor?"] },
  learn: [
    { kicker: "The water model", title: "Three words, one picture",
      boxes: [{ h: "Voltage (V, volts)", text: "The push. Like water pressure from a tank up high.", color: "blue" }, { h: "Current (I, amps)", text: "The flow. How much charge goes past each second.", color: "green" }, { h: "Resistance (R, ohms Ω)", text: "The squeeze. A thin pipe lets less water through.", color: "red" }],
      art: "🚰", cap: "push · flow · squeeze" },
    { kicker: "The law", title: "Ohm's law: V = I × R",
      text: "Know two, find the third.", points: ["I = V ÷ R: more push or less squeeze → more flow", "R = V ÷ I: to limit the flow, choose R", "Arduino pins: about 20 mA (0.02 A) is safe"],
      code: "I = V / R\n5 V / 220 Ω  = 0.023 A = 23 mA\n5 V / 1000 Ω = 0.005 A = 5 mA",
      reveal: { q: "Same battery, double the resistance. What happens to the current?", a: "It halves. I = V ÷ R, so twice the R means half the I." } },
    { kicker: "LED maths", title: "Choosing the resistor",
      text: "An LED 'uses up' about 2 V. The resistor gets the rest.", points: ["Resistor voltage = supply − LED voltage", "R = (5 − 2) ÷ 0.015 = 200 Ω → pick 220 Ω", "Bigger R = dimmer but safer"],
      side: [{ h: "Rule of thumb", text: "5 V board: 220 Ω to 1 kΩ.\n3.3 V board (ESP32): 100 Ω to 470 Ω.", color: "amber" }], art: "🔴" },
    { kicker: "Deeper", title: "Power: why resistors get hot", only: ["advanced"], text: "Power P = V × I (watts).",
      points: ["A 1/4 W resistor must stay under 0.25 W", "A motor's current through a small resistor would burn it", "Batteries lose voltage when current is high: internal resistance"], code: "P = V × I = 3 V × 0.015 A = 0.045 W  ✓" }
  ],
  quiz: [
    { q: "Which is the 'push' in a circuit?", options: ["Current", "Voltage", "Resistance", "The LED"], answer: 1, why: "Voltage pushes the charge around the circuit." },
    { q: "5 V across 500 Ω. What is the current?", options: ["0.01 A", "100 A", "2500 A", "0.1 A"], answer: 0, why: "I = 5 ÷ 500 = 0.01 A = 10 mA." }
  ],
  real: [{ art: "🔌", name: "Phone chargers", text: "Control voltage and current so the battery charges fast but safely." }, { art: "🏠", name: "House fuses", text: "Break the circuit if the current gets dangerously high." }, { art: "🤖", name: "Robots", text: "Every sensor and LED on a robot needs the right voltage and limited current." }],
  game: { title: "Be the circuit", mins: 6, big: "Voltage pushes, current flows, resistance squeezes.",
    steps: ["Students stand in a loop holding a rope (the current).", "One student is the battery and gently pulls the rope round (voltage).", "One student squeezes the rope in their hands (resistance). Feel the flow slow down.", "Squeeze harder: what happens to the speed?"] },
  simWhy: "**PhET Ohm's Law** shows V = I × R with sliders. **Circuit Construction Kit** lets you build and measure. **Falstad** animates the current flowing.",
  builds: [
    { title: "Explore in PhET", mins: 10, sim: "ohms-law", steps: ["Open Ohm's Law. Raise V: what happens to I?", "Raise R: what happens to I?", "Fill in: 'Current goes up when...'", "Open Circuit Construction Kit DC and build battery + bulb + resistor."] },
    { title: "Predict, then measure", mins: 15, steps: ["Build: 2×AA (3 V) → 220 Ω → LED → back to battery.", "Predict the current: I = (3 − 2) ÷ 220.", "Set the multimeter to mA and put it **in series** (break the loop, meter in the gap).", "Swap to 1 kΩ. Predict, then measure again.", "Measure the voltage across the LED (meter on V, **across** the LED)."],
      side: [{ h: "Meter rules", text: "Current: in series (in the loop).\nVoltage: across (side by side).\nNever measure current across a battery!", color: "red" }] },
    { title: "Resistor detective", only: ["core", "advanced"], mins: 10, steps: ["Read the colour bands of three resistors.", "Check each with the meter on Ω.", "Which colour code means 220? 1k? 10k?"], art: "🟫🟥🟫" }
  ],
  test: { title: "Prediction versus measurement", cols: ["Resistor", "Predicted current", "Measured current", "LED brightness"],
    rows: [["220 Ω", "", "", ""], ["1 kΩ", "", "", ""], ["10 kΩ", "", "", ""]] },
  levelup: { choices: [{ t: "Two LEDs", d: "Put two LEDs in series. Do you need a different resistor?" }, { t: "Parallel", d: "Two resistors side by side: is the total more or less?" }, { t: "Dimmer", d: "Use a potentiometer as a variable resistor." }],
    think: { h: "Think like an engineer", text: "Your prediction and measurement differ a little. Give two reasons why." }, boss: "Work out the smallest safe resistor for a blue LED (3 V) on the ESP32's 3.3 V pin." },
  wrap: { learned: ["Voltage pushes, current flows, resistance squeezes", "V = I × R", "Current is measured in series, voltage across", "LEDs need a resistor to limit current", "Predict first, then measure"],
    exit: "A 9 V battery and a 2 V LED want 20 mA. Which resistor? Show your working.", home: "Find the label on a phone charger. What voltage and current does it give?", next: "**EF-03 Digital, Analog and PWM**: how a robot dims a light." },
  guide: {
    grouping: "Pairs", overview: "Grounds all later electronics in three quantities and one law. Students predict before measuring, which builds the habit of checking reality against theory. Multimeter skills (series for current, across for voltage) are taught explicitly because they're needed throughout the curriculum.",
    prep: ["Multimeters with fresh batteries; check the mA fuse in each", "Bags of 220 Ω, 1 kΩ, 10 kΩ resistors and red LEDs", "2×AA holders with batteries", "PhET sims work offline from the Simulators page"],
    timing: [[8, "Hook", "LED pop demo (teacher only, behind a screen) and video"], [12, "Learn", "Water model, Ohm's law, LED maths"], [6, "Game", "Rope circuit"], [10, "Build 1", "PhET exploration"], [15, "Build 2", "Predict and measure"], [10, "Build 3", "Resistor detective"], [9, "Wrap", "Exit ticket"]],
    steps: [{ phase: "Learn", title: "Push, flow, squeeze", say: "Voltage is the push, current is the flow, resistance is the squeeze.", do: ["Use the rope game to make it physical.", "Work two Ohm's-law examples on the board together."] },
      { phase: "Build", title: "Meter technique", do: ["Demonstrate current measurement on the projector camera: break the loop, meter in the gap.", "Check every pair's meter setting before they power the circuit."] }],
    misconceptions: [["Current gets 'used up' by the LED", "The same current flows all the way round; energy is transferred, not current."], ["Bigger battery = more current always", "Current depends on the resistance too."], ["The resistor must go before the LED", "In series it can go on either side; the current is the same everywhere."]],
    trouble: [["Meter reads 0 mA", "Meter not in series, wrong socket, or the mA fuse is blown."], ["LED doesn't light", "Backwards: long leg to + side."], ["Reading jumps", "Loose breadboard contact: press components in firmly."]],
    tiers: { starter: ["Rope game and PhET sliders only; 'more squeeze, less flow'.", "Light an LED with and without a resistor (resistor always used; the 'pop' is shown in a video)."], core: ["Full lesson."], advanced: ["Power slide; calculate resistor power ratings.", "Series and parallel resistor combinations with measurements."] },
    assess: [{ c: "Concepts", e: "Names V, I, R", s: "Explains with the water model", x: "Explains energy and power" }, { c: "Calculation", e: "With help", s: "Uses V = I × R correctly", x: "Chooses resistors for different boards and LEDs" }, { c: "Measurement", e: "Reads a meter with help", s: "Measures I in series and V across", x: "Explains differences from predictions" }],
    safety: ["Never short a battery: it gets hot.", "Never measure current across a power source.", "The burning-LED demo is teacher-only, eyes protected."] }
};
