window.RAI_LESSONS["EF-07"] = {
  fact: "Professional robot engineers still sketch programs as flowcharts and blocks before writing code.",
  think: { q: "The same robot program written three ways: blocks, Python, C++. Which would you trust to drive?", art: "laptop line", cap: "same idea, three languages",
    guesses: ["Blocks: easy to read", "Typed code: more powerful", "They're the same program!"],
    story: { h: "One robot, three languages", text: "Drive forward, turn right, repeat four times: a square. In blocks it's four pieces. In Python it's four lines. In C++ it's a few more. The robot doesn't care; it runs the same steps." },
    today: "we program a **simulated robot** with blocks, then read and change the same program as **typed code**." },
  objectives: [{ t: "Program a simulated robot with blocks", proof: "my robot finishes the course in the simulator" }, { t: "Read the matching typed code", proof: "I can point to the code line for each block" }, { t: "Change a program in typed code", proof: "I edited the code and the robot did something new" }],
  video: { title: "Block coding vs text coding", search: "block coding vs text coding explained", mins: 4, watch: ["What are blocks good at?", "What can text code do that blocks can't?", "Do programmers use both?"] },
  learn: [
    { kicker: "Big idea", title: "A program is a list of steps",
      boxes: [{ h: "Sequence", text: "Steps in order: forward, turn, forward.", color: "blue" }, { h: "Loop", text: "Repeat steps: do it 4 times.", color: "green" }, { h: "Decision", text: "If the sensor sees a wall, turn.", color: "purple" }], art: "book" },
    { kicker: "Same program", title: "Blocks and code side by side",
      code: "# Python (Open Roberta / VEXcode)\nfor i in range(4):\n    drive_forward(50)   # cm\n    turn_right(90)      # degrees\n\n// C++ (Arduino)\nfor (int i = 0; i < 4; i++) {\n  forward(50);\n  right(90);\n}",
      side: [{ h: "Blocks", text: "repeat 4 times\n  ↳ drive forward 50 cm\n  ↳ turn right 90°", color: "amber" }],
      reveal: { q: "What would change to draw a triangle instead?", a: "Repeat 3 times and turn 120°. The outside angles of any shape add up to 360°." } },
    { kicker: "Why typed code?", title: "Blocks are a ramp, not a wall",
      boxes: [{ h: "Blocks are great for", points: ["Starting fast, no typos", "Seeing the structure", "Younger learners"], color: "green" }, { h: "Typed code wins for", points: ["Big programs", "Precise maths and data", "Every real robot and job"], color: "blue" }], note: { l: "Tip", text: "Many tools show both at once. Build in blocks, then peek at the code." } }
  ],
  quiz: [{ q: "A 'loop' in a program...", options: ["Repeats steps", "Draws a circle", "Stops the robot", "Charges the battery"], answer: 0, why: "Loops repeat a set of steps." }, { q: "To draw a hexagon (6 sides), each turn should be...", options: ["90°", "60°", "45°", "120°"], answer: 1, why: "360 ÷ 6 = 60°." }],
  real: [{ art: "robotArm", name: "Factory robots", text: "Programmed with teach pendants, flowcharts and code like Python." }, { art: "robot", name: "Robot vacuums", text: "Loops and decisions: drive, check bumper, turn." }, { art: "laptop", name: "Game characters", text: "The same sequence, loop and decision building blocks." }],
  game: { title: "Program the teacher", mins: 6, big: "Computers do exactly what you say, not what you mean.", steps: ["The teacher is the robot and does EXACTLY what the class says.", "Mission: walk to the door and open it.", "Students call out commands: 'step forward 3', 'turn left'...", "Watch the robot crash into things when instructions are vague!"] },
  simWhy: "**Open Roberta Lab** shows blocks and generated code for a simulated robot, no account needed. **VEXcode VR** has 3D challenge worlds in blocks or Python. **Code Lab** runs plain Python.",
  builds: [
    { title: "Drive a square in blocks", mins: 12, sim: "openroberta", steps: ["Open Open Roberta Lab → choose a robot with a simulation (e.g. EV3).", "Drag blocks: repeat 4 × (drive forward, turn right 90°).", "Run it in the simulation.", "Does it make a perfect square? Adjust the numbers."] },
    { title: "Peek at the code", mins: 10, steps: ["Open the code view (Python or C++) for your program.", "Match each block to its line.", "Change the code (not the blocks): make it a triangle.", "Run again. Did the blocks change too?"] },
    { title: "Sensor challenge", mins: 15, sim: "vexvr", steps: ["Open VEXcode VR → Wall Maze playground.", "Use the bumper or distance sensor: drive until a wall, then turn.", "Reach the exit.", "Switch to Python and add a counter for the turns."], only: ["core", "advanced"] }
  ],
  test: { title: "Shapes check", cols: ["Shape", "Repeat", "Turn angle", "Worked first time?"], rows: [["Square", "4", "90°", ""], ["Triangle", "", "", ""], ["Hexagon", "", "", ""], ["Star (5 points)", "5", "144°", ""]] },
  levelup: { choices: [{ t: "Name drawing", d: "Draw your initial with the robot's pen." }, { t: "Function", d: "Make a 'square(size)' function and draw 3 sizes." }, { t: "Spiral", d: "Each side 5 cm longer than the last." }], think: { h: "Think like an engineer", text: "The simulated square is perfect; the real robot's isn't. Why?" }, boss: "Solve the VEXcode maze using the right-hand wall rule in Python only." },
  wrap: { learned: ["Programs use sequence, loops and decisions", "Blocks and text code can be the same program", "Simulators let us test safely", "Typed code scales to real robots"], exit: "Write the steps (blocks or code) for a robot to draw a triangle.", home: "Write instructions for making a cup of tea for a robot that only does exactly what you say.", next: "**EF-08 Functions, Loops and Events**." },
  guide: { grouping: "Pairs", overview: "Bridges block programming and typed code using free robot simulators, so the move to text feels like 'seeing what the blocks always were'. Works from very young (blocks only) to older students (Python only).",
    prep: ["Test Open Roberta Lab and VEXcode VR on the network", "Clear a path for 'program the teacher'"], timing: [[8, "Hook", "Three-languages question"], [10, "Learn", "Sequence, loops, decisions; side-by-side code"], [6, "Game", "Program the teacher"], [12, "Build 1", "Square in blocks"], [10, "Build 2", "Peek at the code"], [15, "Build 3", "Maze challenge"], [9, "Wrap", "Exit ticket"]],
    steps: [{ phase: "Game", title: "Be a literal robot", say: "I will do exactly what you say. Not what you mean.", do: ["Ham it up: walk into walls, turn the wrong way, freeze when instructions are unclear."] }],
    misconceptions: [["Blocks are 'not real coding'", "They are the same logic; text is just more flexible."], ["Simulation = reality", "Real motors slip and batteries vary: test on hardware too."]],
    trouble: [["Simulator won't load", "Try a different browser; VEXcode VR needs WebGL."], ["Square is wonky", "Turn angle or distance numbers; in real robots wheel slip."]],
    tiers: { starter: ["Program the teacher + blocks only; floor arrows."], core: ["Full lesson."], advanced: ["Python only; functions and the maze with counters."] },
    assess: [{ c: "Programming concepts", e: "Uses sequence", s: "Uses loops and decisions", x: "Uses functions and variables" }, { c: "Blocks to text", e: "Runs blocks", s: "Maps blocks to code", x: "Writes text code independently" }],
    safety: ["Clear floor space for the teacher-robot game."] }
};
