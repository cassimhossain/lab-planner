window.RAI_LESSONS["ROB-09"] = {
  fact: "A quadcopter's flight controller runs its PID loops about 1,000 times every second.",
  think: { q: "What do a drone, an oven and cruise control have in common?", art: "🚁🔥🚗", cap: "the same 3 letters inside",
    guesses: ["The same battery", "The same chip", "The same idea: PID!"],
    story: { h: "One idea everywhere", text: "A drone holds level in the wind. An oven holds 180 °C. A car holds 100 km/h uphill. Each one measures, compares and corrects using a recipe called PID." },
    today: "we learn the three ingredients, **P**, **I** and **D**, tune them in the PID Lab, then tune a real motor." },
  objectives: [
    { t: "Explain P, I and D in plain words", proof: "I can say what each one does with a real example" },
    { t: "Tune a PID loop using its response graph", proof: "my motor reaches the target with little overshoot" },
    { t: "Name overshoot, oscillation and steady-state error", proof: "I pointed them out on a graph" }
  ],
  video: { title: "PID control explained simply", search: "PID controller explained simply animation", mins: 7,
    watch: ["What does each letter stand for?", "What goes wrong with only P?", "Why does D stop overshoot?"] },
  learn: [
    { kicker: "Recap", title: "Control starts with the error",
      text: "error = target − measurement. The controller turns the error into an action (motor power).", points: ["Big error → big action", "Error crosses zero → we've arrived (or passed it!)"],
      art: "🎯", cap: "how far from the goal?" },
    { kicker: "The three ingredients", title: "P, I and D in plain words",
      boxes: [{ h: "P · Present", text: "Push in proportion to the error now. Fast, but often stops short or wobbles.", color: "blue" },
              { h: "I · Past", text: "Add up errors over time. If the error won't go away, I slowly pushes harder.", color: "amber" },
              { h: "D · Future", text: "Watch how fast the error is changing. Brake before you overshoot.", color: "green" }],
      code: "output = Kp*error + Ki*sum + Kd*change" },
    { kicker: "Reading graphs", title: "Four shapes to recognise",
      boxes: [{ h: "Too slow", text: "Creeps towards the target. P too small.", color: "blue" }, { h: "Overshoot", text: "Shoots past, then comes back. Needs D (or less P).", color: "red" },
              { h: "Oscillation", text: "Keeps swinging. P too big, D too small.", color: "amber" }, { h: "Steady-state error", text: "Settles, but not on target. Needs I.", color: "purple" }],
      note: { l: "Tuning recipe", text: "1) Raise P until it wobbles a little. 2) Add D until the wobble calms. 3) Add a little I to remove the last error." } },
    { kicker: "Deeper", title: "Windup and sample time", only: ["advanced"],
      points: ["**Integral windup:** if the motor is held still, I keeps growing; when released it overshoots massively. Fix: clamp the sum.", "**Sample time:** PID assumes a steady loop speed. Use millis() timing, not delay().", "**Derivative kick:** a sudden target change spikes D. Use the change in measurement instead of error."], text: "What real engineers worry about:" }
  ],
  quiz: [
    { q: "The motor settles at 50 rpm but the target is 60. Which term fixes this?", options: ["P", "I", "D", "None"], answer: 1, why: "I adds up the leftover error and pushes until it's gone." },
    { q: "The system shoots past the target and swings back and forth. A good first fix is...", options: ["More I", "More D", "Remove the sensor", "Raise the target"], answer: 1, why: "D reacts to how fast the error changes and brakes the swing." }
  ],
  real: [
    { art: "🚁", name: "Drones", text: "Three PID loops (roll, pitch, yaw) keep a drone level many hundreds of times a second." },
    { art: "🌡️", name: "3D printers", text: "PID holds the hot end at exactly 200 °C so the plastic flows evenly." },
    { art: "🤖", name: "Robot arms", text: "Every joint motor has a PID loop to reach and hold its angle precisely." }
  ],
  game: { title: "Be the controller", mins: 6, big: "P reacts to now, I remembers the past, D predicts the future.",
    steps: ["Balance a ruler upright on your fingertip. You are a PID controller!", "Notice: you move more when it leans more (P).", "You move faster when it starts falling fast (D).", "Try with eyes closed for one second: no sensor, no control!"] },
  kitNote: "Mount an encoder disc on one motor of a 2WD chassis held off the ground, or use a fan with the IR speed sensor. Spinning freely is easiest to tune first.",
  simWhy: "The **PID Lab** shows the response graph live while you move the sliders. **Code Lab** runs the same controller in Python to plot a response.",
  builds: [
    { title: "Tune in the PID Lab", mins: 15, sim: "pid-sim", steps: ["Motor speed: start with P only. Press 'Change the target'. Does it reach it?", "Add I a little at a time until the error disappears.", "Switch to Balancing robot. P only: what happens?", "Add D until it stands still. Press 'Push it!'", "Record your best values in the table."], art: "🎛️" },
    { title: "PID on the real motor", mins: 20, steps: ["Measure speed from encoder ticks every 100 ms.", "Start with Kp only. Change the target from 60 to 120 rpm with the Serial Monitor.", "Watch the Serial Plotter: target and speed.", "Add Ki, then Kd, following the tuning recipe."],
      code: "float Kp=1.0, Ki=0.2, Kd=0.05, sum=0, last=0;\nint target = 60;           // rpm\nvoid loop() {\n  float rpm = readRPM();     // from encoder ticks\n  float e = target - rpm;\n  sum = constrain(sum + e*0.1, -200, 200);\n  float d = (e - last) / 0.1;  last = e;\n  int pwm = constrain(Kp*e + Ki*sum + Kd*d, 0, 255);\n  analogWrite(5, pwm);\n  Serial.print(target); Serial.print(' ');\n  Serial.println(rpm);\n  delay(100);\n}", note: { l: "readRPM()", text: "Counts encoder ticks in an interrupt since last time, then converts: ticks ÷ slots per turn × 600." } },
    { title: "Plot it in Python", only: ["advanced"], mins: 15, sim: "code-lab", steps: ["Simulate a motor: speed += 0.1 × (gain × power − speed).", "Run your PID for 200 steps and store the speeds.", "Plot target and speed with matplotlib.", "Measure overshoot (%) and settling time."] }
  ],
  test: { title: "Tuning log", intro: "Change one value at a time. Describe the graph in words.",
    cols: ["Kp", "Ki", "Kd", "Reaches target?", "Overshoot", "Wobbles?"],
    rows: [["1.0", "0", "0", "", "", ""], ["3.0", "0", "0", "", "", ""], ["3.0", "0", "0.1", "", "", ""], ["3.0", "0.3", "0.1", "", "", ""], ["(your best)", "", "", "", "", ""]] },
  levelup: { choices: [{ t: "Load test", d: "Press a finger lightly on the wheel. Does PID hold the speed?" }, { t: "Two wheels", d: "Run PID on both motors so the robot drives perfectly straight." }, { t: "Position", d: "Control the wheel's angle instead of its speed." }],
    think: { h: "Think like an engineer", text: "Why might the best values for the bare motor be wrong once the robot is on the floor?" }, boss: "Add anti-windup and test by holding the wheel still for 3 seconds, then letting go." },
  wrap: { learned: ["PID = Present, Past, Future", "P pushes, I fixes leftover error, D brakes", "Graphs show overshoot, oscillation and steady-state error", "Tune P, then D, then a little I", "PID runs drones, ovens, printers and robot arms"],
    exit: "Sketch a response graph with overshoot. Which term would you add to reduce it?", home: "Watch a lift arriving at a floor. Does it slow before stopping? That's control!", next: "**ROB-10 Balancing Robot**: PID that keeps a robot upright." },
  guide: {
    grouping: "Pairs",
    overview: "Builds on ROB-08 (proportional control). Students meet the full PID controller first in our PID Lab simulator, where nothing can break and the response graph is instant, then on a real motor with an encoder. The skill to build is **reading response graphs** and changing one gain at a time.",
    prep: ["Open rai/sims/pid.html on every laptop (Simulators → PID Lab)", "Fit IR speed sensors and encoder discs to motors; test tick counting", "Charge batteries: speed changes with battery voltage", "Have the Serial Plotter demo ready on the teacher laptop"],
    timing: [[8, "Hook", "Drone/oven/car question and video"], [12, "Learn", "P, I, D and the four graph shapes"], [6, "Game", "Ruler balancing"], [15, "Build 1", "PID Lab tuning"], [20, "Build 2", "Real motor tuning with the plotter"], [10, "Test", "Tuning log"], [9, "Wrap", "Objective check, exit ticket"]],
    steps: [
      { phase: "Learn", title: "Present, past, future", say: "P is what's happening now, I is your memory, D is your prediction.", do: ["Draw each graph shape on the board and ask which term fixes it.", "Quiz slides: pairs answer on mini whiteboards first."] },
      { phase: "Build 1", title: "PID Lab", do: ["Everyone starts with P only on Motor speed and sees the steady-state error.", "Challenge: lowest average error on the Balancing robot after a push."] },
      { phase: "Build 2", title: "Real motor", do: ["One change at a time, recorded in the log.", "Stop the class when someone gets a clean step response and project it."] }
    ],
    misconceptions: [["More gain is always better", "Too much P or I causes oscillation; show it in the PID Lab."], ["D makes it faster", "D mostly slows and steadies the response; it brakes."], ["I is needed everywhere", "Many systems work with PD only; I is for leftover error."]],
    trouble: [["Speed reading jumps around", "Too few encoder slots or too short a sample: use 100 ms windows and average."], ["Motor never starts at low PWM", "Motors have a dead zone: add a minimum PWM (e.g. 60) when the output is above 0."], ["Gains that worked yesterday fail today", "Battery voltage changed: retune or use a regulated supply."], ["Huge overshoot after holding the wheel", "Integral windup: clamp the sum (already in the code)."]],
    tiers: {
      starter: ["Ruler game plus the PID Lab only: 'make the robot stand up' challenge with the sliders.", "Use words, not letters: push / remember / brake."],
      core: ["Full lesson with the real motor."],
      advanced: ["Python simulation with measured overshoot and settling time.", "Windup and derivative-kick discussion; implement both fixes."] },
    assess: [
      { c: "Explains PID", e: "Names the three letters", s: "Explains each term with an example", x: "Explains windup and sampling issues" },
      { c: "Tunes systematically", e: "Random changes", s: "One change at a time, logged", x: "Uses a method and justifies final gains" },
      { c: "Reads graphs", e: "Says 'good' or 'bad'", s: "Names overshoot/oscillation/steady error", x: "Measures them numerically" }],
    safety: ["Keep fingers and hair away from spinning wheels; test with the wheels off the ground.", "Disconnect batteries when changing wiring."]
  }
};
