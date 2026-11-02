/* Teacher guide: ROB-06 Servos and Steppers: Moving Precisely. Built by guide.js. */
module.exports = {
  code: "ROB-06",
  grouping: "Pairs",

  overview: "Students meet the two motors that move precisely. A servo points to an angle and holds it, because a potentiometer inside checks its position (closed loop). A stepper moves in fixed steps it counts but never checks (open loop). They sweep a servo, turn a 28BYJ-48 stepper exactly one revolution, build a servo gauge, then find each motor's limits and choose the right motor for a job.",
  mustLand: "A DC motor controls speed, a servo controls angle, a stepper counts steps. The servo checks itself; the stepper only counts, so it never knows if it skipped.",

  outcomes: [
    "Compare **DC, servo and stepper** motors and say what each is for.",
    "Explain how a **pulse width** (1 to 2 ms) sets a servo angle.",
    "Drive a servo to an angle and a stepper **an exact number of steps**.",
    "Pick the right motor for a job and **justify it**.",
  ],

  depths: {
    starter: "Do the draw-a-square challenge and the Be the stepper game, then build the servo pointer (step 1) and make it show a 'weather' dial: sunny, cloudy, rain at three angles.",
    core: "Full lesson: servo sweep (step 1) and the stepper turning exactly one revolution and back a quarter (step 2), then the servo gauge if time allows.",
    advanced: "Work out degrees per step and prove it with a protractor, add acceleration to the stepper, and try half stepping (4096 steps per turn).",
  },

  kit: [
    "SG90 micro servo with horns (orange signal, red 5V, brown GND)",
    "28BYJ-48 stepper motor + ULN2003 driver board",
    "Arduino Uno + USB cable",
    "A separate 5 V supply for the stepper (USB power bank with a cut USB lead, or a 4×AA pack)",
    "Half-size breadboard and male-female jumper wires",
    "A 10 kΩ potentiometer (for the gauge in step 3), card, tape",
  ],
  sims: [
    "**Circuit Lab**: both the servo and the stepper with ULN2003 run on screen, including step counting.",
    "**Wokwi** (online): ready servo and stepper examples.",
  ],
  prep: [
    "Check the Servo and Stepper libraries are present (both come with the Arduino IDE).",
    "Test every SG90 with the sweep sketch: a stripped servo buzzes and jerks. Keep spares.",
    "Prepare the stepper's own 5 V supply for each pair. The stepper must not run from the Arduino's 5 V pin.",
    "Cut card arrows and print or draw 0 to 100 dials for the gauge.",
    "Clear a space for the Be the stepper game: five students standing in a square.",
  ],

  timing: [
    [4, "Let's think", "Draw a square with eyes shut, then open (slide 2)."],
    [2, "Aims", "The four aims and keywords (slide 3)."],
    [14, "Teach", "Compare the three motors, servo pulses, stepper steps, real examples (slides 4 to 7)."],
    [5, "Be the stepper", "Coils and rotor game, then backwards and half stepping (slide 9)."],
    [5, "Kit and wiring", "Power warning; servo and stepper wiring (slides 10 to 12)."],
    [8, "A servo that points", "Sweep, feel it push back, point to a typed number (slide 13)."],
    [10, "A stepper that counts", "2048 steps, tape mark comes home, then 1024 (slide 14)."],
    [5, "Gauge or limits", "Servo gauge with map(), or two rows of the limits table (slides 15, 16)."],
    [7, "Check and exit ticket", "Self-rating and the cup-to-shelf question (slides 18, 19)."],
  ],

  steps: [
    { phase: "Let's think", mins: 4, slides: "1-2",
      say: ["Close your eyes and draw a 10 cm square. Now open them. Is it square? Now do it again with your eyes open.",
        "A DC motor draws with its eyes shut. A stepper counts its moves. A servo has a tiny eye inside that checks."],
      do: ["Students guess which motor is in a printer, a toy car, a camera gimbal and a robot arm elbow, and write it down."] },
    { phase: "Aims", mins: 2, slides: "3",
      say: ["Today you make one motor point and another count, and you will know which to pick for any machine."] },
    { phase: "Teach", mins: 14, slides: "4-7",
      say: ["A servo reads the width of a pulse sent every 20 ms. 1 ms means 0°, 1.5 ms means 90°, 2 ms means 180°.",
        "Inside the servo a potentiometer reports the real angle; the controller compares it with the pulse. Push the arm and it pushes back. That is closed loop.",
        "A stepper has four coils switched in turn; each switch is one step. The 28BYJ-48 has 32 steps per rotor turn and a 64:1 gearbox, so 2048 steps per output turn.",
        "If a stepper is overloaded it skips a step and nothing tells it. That is open loop. 3D printers use a home switch for this reason."],
      do: ["Slide 4: read the table row by row; ask which row matters for a robot arm.", "Slide 6: work out 360 ÷ 2048 = 0.176° per step on the board."],
      watch: "students saying the servo 'counts' degrees. It measures them with the potentiometer; the stepper is the one that counts." },
    { phase: "Be the stepper", mins: 5, slides: "9",
      say: ["You four are coils. You in the middle are the rotor: point at whoever I light up."],
      do: ["Call 1, 2, 3, 4 faster and faster until the rotor cannot keep up: a skipped step.", "Call 4, 3, 2, 1: it reverses.", "Light two neighbours at once: the rotor points between them (half stepping)."] },
    { phase: "Kit and wiring", mins: 5, slides: "10-12",
      say: ["One SG90 on the Arduino's 5 V is fine. The stepper always takes its own 5 V. Share the ground, never the 5 V."],
      do: ["Servo: orange to pin 9, red to 5V, brown to GND.", "ULN2003: IN1→8, IN2→9, IN3→10, IN4→11; its + and − to the separate 5 V supply; its − also to Arduino GND."],
      watch: "the stepper powered from the Arduino 5V pin. It may work for a moment, then the board resets." },
    { phase: "A servo that points", mins: 8, slides: "13",
      say: ["`arm.write(90)` takes degrees. The library turns them into the right pulse for you."],
      do: ["Upload the sweep; watch 0 to 180 and back.", "Hold the arm gently: feel it push back.", "Extension: read a number from the Serial Monitor with `Serial.parseInt()` and write it to the servo."],
      watch: "anyone twisting a powered servo by hand. That strips the plastic gears; cut the power first." },
    { phase: "A stepper that counts", mins: 10, slides: "14",
      say: ["The pins are wired 8, 9, 10, 11, but the Stepper library wants them in the order 8, 10, 9, 11 for this board. That is not a typo."],
      do: ["Put a tape flag on the shaft.", "Run 2048 steps: the flag comes home. Then 1024: half a turn.", "Keep `setSpeed` at 10 to 15 rev/min."],
      watch: "a motor that hums and vibrates without turning. The pin order in the sketch is wrong, or the supply is too weak." },
    { phase: "Gauge or limits", mins: 5, slides: "15-16",
      say: ["`map()` stretches a sensor's range onto the range your output needs, in one line."],
      do: ["Faster pairs build the gauge with a potentiometer on A0.", "Others try two rows of the limits table and record what happened, including the speed where the stepper first skips."] },
    { phase: "Check and exit ticket", mins: 7, slides: "18-19",
      say: ["Give a reason, not just a name. 'Servo, because it holds an angle under load' scores; 'servo' alone does not."],
      do: ["Self-rate against the proofs.", "Exit ticket: lift a cup to a shelf and hold it there. Which motor, and what happens if you choose wrong?", "Return to the guesses from the start."] },
  ],

  misconceptions: [
    ["A servo can spin round and round.", "A standard SG90 turns only 0 to 180°. (Continuous-rotation servos exist but lose position control.)"],
    ["The voltage sets the servo angle.", "The pulse width sets it: 1 ms to 2 ms, repeated every 20 ms. The supply just powers the motor."],
    ["A stepper knows where it is.", "It only knows how many steps it was told to take. A skipped step is invisible to it."],
    ["Faster stepping is always better.", "A stepper loses torque as it speeds up; too fast and it skips or stalls."],
    ["The Stepper pin order 8, 10, 9, 11 is a mistake.", "It matches how the library energises the coils for this driver. Wired 8, 9, 10, 11, the sketch must list 8, 10, 9, 11."],
  ],

  trouble: [
    ["Servo jitters or buzzes", "It is asked for an angle it cannot reach, something is jammed, or the 5 V is sagging. Try 10 to 170° and check nothing blocks the arm."],
    ["Arduino resets when the servo moves", "Too much current from the 5V pin. Use one servo only, or give servos their own supply with grounds joined."],
    ["Stepper vibrates but does not turn", "Pin order: wired IN1-IN4 to 8, 9, 10, 11, the sketch must say `Stepper(STEPS, 8, 10, 9, 11)`."],
    ["Stepper turns but loses position", "Too fast or overloaded. Lower setSpeed, reduce the load."],
    ["Stepper does nothing; ULN2003 LEDs dark", "No supply to the driver board, or its ground is not joined to the Arduino."],
    ["Tape mark does not return home", "Steps were skipped. Slow down, then re-run 2048 steps."],
  ],

  rubric: [
    ["Comparing motors", "Names the three motors.", "Says what each controls and gives a use for each.", "Explains open vs closed loop and why it matters for a given machine."],
    ["Servo", "Runs the sweep.", "Explains pulse width and points the servo to a chosen angle.", "Builds the gauge with map(), or drives the servo with raw pulses."],
    ["Stepper", "Gets the stepper turning with help.", "Turns exactly one revolution and back a quarter; explains 2048.", "Finds the skip speed, adds acceleration or half stepping, and explains the results."],
  ],

  answers: [
    ["Slide 2: Printer, toy car, camera gimbal, robot arm elbow?", "Printer: stepper. Toy car: DC motor. Gimbal: servo (or brushless with feedback). Arm elbow: servo for small arms; it must hold an angle under load."],
    ["Slide 6: Degrees per step on the 28BYJ-48?", "360 ÷ 2048 = 0.176°. Half stepping gives 4096 steps and 0.088°."],
    ["What does a 1.5 ms pulse mean to a servo?", "Go to the middle, 90°."],
    ["Slide 16: Why does the stepper skip at 30 rev/min?", "Its torque falls as speed rises; at high speed it cannot pull the rotor round before the next coil switches."],
    ["Exit ticket: lift a cup to a shelf and hold it.", "A servo: it holds an angle and pushes back against the load. A DC motor would let the cup drop when power stops changing; a stepper could hold, but would silently lose position if overloaded."],
  ],

  safety: [
    "Low voltage only: 5 V from USB and a separate 5 V supply for the stepper.",
    "Never turn a powered servo by hand: the gears strip.",
    "One servo on the Arduino's 5 V at most; motors with their own supply always share the ground.",
    "The stepper and ULN2003 get warm in use. That is normal; hot enough to hurt is not. Unplug and check the supply.",
  ],
};
