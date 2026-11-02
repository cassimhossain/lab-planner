window.RAI_LESSONS["ROB-08"] = {
  fact: "The first feedback controller was a spinning-ball governor on steam engines, over 230 years ago.",
  think: { q: "Why does one line follower wiggle like a snake while another glides like a train?", art: "🐍🚆", cap: "same robot, different brain",
    guesses: ["Better motors?", "A faster Arduino?", "Smarter steering!"],
    story: { h: "Two robots, one track", text: "Both robots have the same motors, the same sensor and the same battery. One zig-zags and is slow. The other glides and wins the race. The only difference is a few lines of code." },
    today: "we build a line follower, watch it wiggle, then teach it to steer **in proportion** to how far off the line it is." },
  objectives: [
    { t: "Explain open-loop and closed-loop control", proof: "I can name the sensor, the decision and the action in a loop" },
    { t: "Build a bang-bang line follower", proof: "my robot follows a curved line all the way round" },
    { t: "Upgrade it to proportional steering", proof: "I can show the error number and how it sets the steering" }
  ],
  video: { title: "Feedback loops and control systems explained", search: "feedback control loop explained for beginners", mins: 6,
    watch: ["What is the difference between open and closed loop?", "Where is the sensor in the loop?", "What happens if the controller reacts too strongly?"] },
  learn: [
    { kicker: "Big idea", title: "Open loop versus closed loop",
      boxes: [{ h: "Open loop: no checking", text: "A toaster runs for 2 minutes whatever the bread looks like. A robot told 'drive 3 seconds' never checks where it ended up.", color: "red" },
              { h: "Closed loop: measure and correct", text: "Measure → compare with the goal → correct → measure again. Your hand on a hot tap does this without thinking.", color: "green" }],
      art: "🔁", cap: "sense → decide → act → sense...", note: { l: "Key word", text: "**Feedback** means the output is measured and fed back to change what happens next." } },
    { kicker: "The error", title: "How far off am I?",
      text: "Every controller starts with one number: the **error**.", points: ["error = goal − what I measure", "Error 0: perfect. Big error: big problem.", "The sign tells the direction: left of the line or right of it."],
      code: "error = target - reading;\n// on the line:      error = 0\n// drifted left:     error > 0\n// drifted right:    error < 0",
      reveal: { q: "The robot should be at 0 but reads +3. Which way should it steer?", a: "Back towards the line, and harder than if it read +1. Bigger error, bigger correction: that's the whole idea of proportional control." } },
    { kicker: "Controller 1", title: "Bang-bang: full left or full right",
      boxes: [{ h: "The rule", text: "If the sensor sees black, turn one way. If it sees white, turn the other way. Only two choices, always at full strength.", color: "blue" },
              { h: "What you'll see", points: ["It works!", "But it zig-zags across the edge of the line", "It is slow on curves and can fly off at speed"], color: "amber" }],
      art: "↔️", cap: "like a light switch: on or off" },
    { kicker: "Controller 2", title: "Proportional: steer as much as you're off",
      text: "Correction = **Kp × error**. Small error, gentle turn. Big error, sharp turn.", points: ["**Kp** is the gain: how strongly we react", "Kp too small: lazy, drifts off on curves", "Kp too big: wobbles like bang-bang again", "Just right: smooth and fast"],
      side: [{ h: "Two motors, one formula", text: "left speed = base + correction\nright speed = base − correction", color: "purple" }],
      note: { l: "Engineers say", text: "Tuning Kp is the first job on almost every real robot." } },
    { kicker: "Deeper", title: "Reading a response graph", only: ["advanced"],
      text: "Plot the error over time from the Serial Plotter.", points: ["**Overshoot:** it shoots past the line", "**Oscillation:** it keeps swinging side to side", "**Steady-state error:** it settles, but not on the line", "These three words describe every control system: drones, ovens, cruise control."],
      art: "📈" }
  ],
  quiz: [
    { q: "A robot vacuum drives forward for 5 seconds and turns, without sensors. That is...", options: ["Closed-loop control", "Open-loop control", "Proportional control", "Artificial intelligence"], answer: 1, why: "Nothing is measured, so nothing is corrected." },
    { q: "With proportional control, if the error doubles, the correction...", options: ["Stays the same", "Halves", "Doubles", "Switches off"], answer: 2, why: "Correction = Kp × error, so it grows in proportion." }
  ],
  realTitle: "Feedback is everywhere",
  real: [
    { art: "🚗", name: "Cruise control", text: "Measures speed 50 times a second and adjusts the engine so you stay at 100 km/h uphill and down." },
    { art: "🚁", name: "Drones", text: "Gyros measure tilt hundreds of times a second; the motors correct before you even see a wobble." },
    { art: "🏭", name: "Factory lines", text: "Warehouse robots follow lines and floor codes with exactly this kind of steering." }
  ],
  game: { title: "Human line follower", mins: 6, big: "Big corrections for big mistakes, small ones for small mistakes. That's proportional control.",
    steps: ["One student is the robot, eyes closed. One is the sensor, one is the controller.", "Lay a curved tape line on the floor.", "Round 1 (bang-bang): the controller may only say 'LEFT!' or 'RIGHT!'.", "Round 2 (proportional): the controller says 'a tiny bit left', 'more left', 'sharp left'.", "Time both rounds. Which was faster and smoother?"] },
  kitNote: "Use a 2 cm black electrical tape line on a white floor or chart paper. Curves gentler than a dinner plate work best at first.",
  simWhy: "**GearsBot** has a ready line-following world: try your rule there first. **Circuit Lab** lets you wire the IR sensor and motor driver safely before touching the real car.",
  builds: [
    { title: "Wire the sensor", mins: 10, sim: "circuit-lab", steps: ["Mount the IR sensor at the front, 1 cm above the floor, pointing down.", "VCC to 5V, GND to GND, OUT to pin **A0** (or D2 for a digital module).", "Open the Serial Monitor: print the reading over white and over black.", "Write down both numbers. The middle between them is your **target**."],
      code: "void setup() {\n  Serial.begin(9600);\n}\nvoid loop() {\n  int r = analogRead(A0);\n  Serial.println(r);   // white ~100, black ~800\n  delay(50);\n}", note: { l: "Tip", text: "A digital IR module only gives 0 or 1, so it can only do bang-bang. Use the analog pin for proportional control." } },
    { title: "Bang-bang follower", mins: 15, sim: "gearsbot", steps: ["Follow the **edge** of the line, not the middle.", "If the reading is above the target (on black): turn right.", "Otherwise (on white): turn left.", "Test on the track. Count the wiggles on one lap."],
      code: "// L298N: ENA=5 IN1=7 IN2=8 | ENB=6 IN3=9 IN4=10\nvoid drive(int left, int right) {\n  digitalWrite(7, HIGH); digitalWrite(8, LOW);\n  digitalWrite(9, HIGH); digitalWrite(10, LOW);\n  analogWrite(5, left); analogWrite(6, right);\n}\nconst int TARGET = 450;\nvoid loop() {\n  int r = analogRead(A0);\n  if (r > TARGET) drive(150, 60);  // right\n  else            drive(60, 150);  // left\n}",
      note: { l: "Remember", text: "Set pins 5–10 as OUTPUT in setup(). drive() is reused in step 3." } },
    { title: "Proportional follower", mins: 20, steps: ["Work out `error = TARGET - r`.", "Set `correction = Kp * error` (start with Kp = 0.3).", "Left motor = base + correction, right = base − correction.", "Lap the track. Then try Kp = 0.1 and Kp = 1.0.", "Open the Serial Plotter and watch the error line."],
      code: "const int TARGET = 450, BASE = 120;\nfloat Kp = 0.3;\nvoid loop() {\n  int error = TARGET - analogRead(A0);\n  int c = Kp * error;\n  drive(constrain(BASE + c, 0, 255),\n        constrain(BASE - c, 0, 255));\n  Serial.println(error);\n}" }
  ],
  test: { title: "Kp tuning table", intro: "Run one lap for each setting. Keep the battery and track the same so it's a fair test.",
    cols: ["Controller", "Kp", "Lap time (s)", "Wiggles", "Stayed on line?"],
    rows: [["Bang-bang", "–", "", "", ""], ["Proportional", "0.1", "", "", ""], ["Proportional", "0.3", "", "", ""], ["Proportional", "1.0", "", "", ""]] },
  levelup: { choices: [{ t: "Speed run", d: "Raise BASE speed and re-tune Kp. What's your fastest clean lap?" }, { t: "Two sensors", d: "Use two IR sensors; error = left − right." }, { t: "Lost the line", d: "If both sensors see white for 1 second, stop and search." }, { t: "Smooth start", d: "Ramp BASE up over the first second." }],
    think: { h: "Think like an engineer", text: "Why does the best Kp change when you change speed?" }, boss: "Add the D term: correction = Kp·error + Kd·(error − lastError). Does it stop the wobble?" },
  wrap: { learned: ["Closed loop: measure, compare, correct, repeat", "Error = target − reading", "Bang-bang works but wiggles", "Proportional steering: correction = Kp × error", "Tuning Kp trades speed against stability"],
    exit: "Your robot wobbles a lot on the straight. Should you make Kp bigger or smaller? Why?", home: "Spot three feedback loops at home (hint: fridge, kettle, your own hand).", next: "**ROB-09 PID Tuning Lab**: adding I and D." },
  guide: {
    grouping: "Pairs, one car per pair",
    overview: "Students meet closed-loop control by experience first (the human line follower), then build two controllers on the same robot and measure the difference. The key idea to land: **the size of the correction should depend on the size of the error**. Everything later (PID, balancing robots, drones) builds on this.",
    prep: ["Lay 2–4 tracks with black tape on white chart paper; one gentle oval and one with a tight curve", "Charge or replace car batteries: weak batteries ruin tuning results", "Check each car drives straight with the same speed on both motors", "Load the three code steps onto the teacher laptop to project", "Open GearsBot line-following world on one laptop to demonstrate"],
    timing: [[10, "Hook", "Two-robot story and video"], [10, "Learn", "Open versus closed loop, the error, the two controllers"], [6, "Game", "Human line follower, two rounds"], [10, "Build 1", "Wire and read the IR sensor"], [15, "Build 2", "Bang-bang follower on the track"], [20, "Build 3", "Proportional follower and the Kp table"], [9, "Wrap", "Results share, objective check, exit ticket"]],
    steps: [
      { phase: "Hook", title: "Two robots, one track", say: "Same motors, same sensor. Why would one win easily?", do: ["Show slide 2 and let pairs vote on the three guesses.", "Don't reveal the answer: the game will."] },
      { phase: "Learn", title: "Error is the key number", do: ["Draw the loop on the board: sensor → compare → motors → robot moves → sensor.", "Use the tap-to-reveal question; ask two pairs to explain before revealing.", "Stress the sign of the error: positive means one side, negative the other."] },
      { phase: "Game", title: "Human line follower", do: ["Run round 1 with only LEFT/RIGHT, then round 2 with graded words.", "Time both rounds on the board.", "Link back: graded words = proportional control."] },
      { phase: "Build", title: "From bang-bang to proportional", do: ["Insist every pair records white and black readings before coding.", "After bang-bang, stop the class for 1 minute: 'Count your wiggles.'", "For proportional, give Kp = 0.3 and let them try 0.1 and 1.0 for the table.", "Circulate with the troubleshooting table."] },
      { phase: "Wrap", title: "Share the data", do: ["Collect each pair's best Kp and lap time on the board.", "Ask: why are the best values different for different cars?", "Exit ticket on a sticky note."] }
    ],
    misconceptions: [["A faster Arduino makes a smoother robot", "The loop already runs hundreds of times a second; the **rule** matters, not the speed."], ["Bigger Kp is always better", "Too big reacts to every tiny change and wobbles. Show it on the robot."], ["The sensor tells you where the line is", "It only tells you how dark the floor is under it. We turn darkness into an error."]],
    trouble: [["Robot spins in circles", "Motor wires swapped or left/right speeds swapped in drive()."], ["Readings barely change between black and white", "Sensor too high: move it to about 1 cm from the floor; shade it from sunlight."], ["Works on the oval, flies off the tight curve", "Lower BASE speed or raise Kp a little."], ["Proportional robot goes the wrong way", "Swap the sign: use r − TARGET, or swap + and − on the motors."], ["Inconsistent results", "Batteries are going flat: check with a multimeter."]],
    tiers: {
      starter: ["Skip the error maths: give the bang-bang code ready-made and let them change the turn speeds.", "Run the human line follower twice and talk about 'little turn' versus 'big turn'.", "Success: the car goes round the oval."],
      core: ["Full lesson as written, including the Kp table."],
      advanced: ["Add the response-graph slide and Serial Plotter analysis.", "Two-sensor error and the boss-level D term.", "Ask for a short write-up: best Kp, why, with the graph."] },
    assess: [
      { c: "Explains feedback", e: "Says the robot 'follows the line'", s: "Names sensor, decision and action in a loop", x: "Explains error sign and gain in their own words" },
      { c: "Builds and tests", e: "Bang-bang works with help", s: "Both controllers work; table filled", x: "Tunes Kp systematically and justifies the choice" },
      { c: "Uses data", e: "Records some times", s: "Compares lap times and wiggles", x: "Reads overshoot and oscillation from the plot" }],
    safety: ["Keep cars on the floor or a low table edge with a barrier.", "Batteries out when not testing; never leave AA packs in pockets."]
  }
};
