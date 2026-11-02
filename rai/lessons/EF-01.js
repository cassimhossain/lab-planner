window.RAI_LESSONS["EF-01"] = {
  fact: "The word 'robot' comes from a 1920 Czech play. 'Robota' means hard, boring work.",
  think: { q: "A toaster, a washing machine and a Mars rover. Which ones are robots?", art: "robotCar", cap: "robot or not?",
    guesses: ["Only the rover", "All of them", "It depends on the brain"],
    story: { h: "Not every machine is a robot", text: "A toaster heats for a set time whatever happens. A Mars rover feels the ground, decides where to drive and moves on its own. What makes the difference?" },
    today: "we learn the 3 jobs every robot does, then build a tiny robot brain that **senses, thinks and acts**." },
  objectives: [
    { t: "Sort machines into robots and non-robots", short: "Robot or not", proof: "I can explain my choice using sense, think, act" },
    { t: "Build a sense-think-act gadget", short: "Build a robot brain", proof: "my button (sense) makes the Arduino (think) light and beep (act)" },
    { t: "Spot sense, think, act in a real robot", short: "Robots at work", proof: "I labelled the parts of a robot picture" }
  ],
  video: { title: "What is a robot? Robots explained for kids", search: "what is a robot sense think act explained", mins: 4,
    watch: ["What are the three things every robot does?", "Name one robot that helps people at work.", "What 'senses' did the robots have?"] },
  learn: [
    { obj: 1, kicker: "Big idea", title: "Every robot does three jobs",
      scene: { flow: true, items: [{ art: "eye", label: "SENSE", color: "blue" }, { art: "brain", label: "THINK", color: "purple" }, { art: "servo", label: "ACT", color: "green" }] },
      layout: "row",
      boxes: [{ h: "SENSE", text: "**Sensors** gather information: distance, light, touch, sound, a camera.", color: "blue" },
              { h: "THINK", text: "The **controller** decides what to do, following a program.", color: "purple" },
              { h: "ACT", text: "**Actuators** make something happen: motors turn, lights shine, speakers beep.", color: "green" }] },
    { obj: 1, kicker: "The robot test", title: "Robot or not?", art: "robot",
      text: "Ask three questions about any machine:", points: ["Does it **sense** the world around it?", "Does it **decide** for itself, using a program?", "Does it **act** to change something?", "Three yes answers: it's a robot. A toaster only acts on a timer, so it's not."],
      reveal: { q: "Is an automatic door a robot?", a: "A very simple one! It senses you (motion sensor), its controller decides 'open', and a motor acts. Engineers argue about where the line is, and that's fine." } },
    { obj: 2, kicker: "Our robot brain", title: "Meet the Arduino",
      boxes: [{ h: "Inputs (sense)", points: ["Buttons", "Light and distance sensors", "Knobs"], color: "blue" }, { h: "Outputs (act)", points: ["LEDs and buzzers", "Motors and servos", "Screens"], color: "green" }],
      side: [{ h: "The program (think)", text: "The code runs in a loop thousands of times a second:\nread the sensors → decide → set the outputs.", color: "purple" }],
      art: "arduino" },
    { obj: 2, kicker: "Our machine", title: "Press, think, light and beep",
      scene: { flow: true, items: [{ art: "button", label: "you press", color: "red" }, { art: "arduino", label: "Arduino thinks", color: "teal" }, { art: "led bulb", label: "light + beep", color: "amber" }],
        caption: "**Teacher:** for Starter groups the circuit is pre-wired; children plug in the USB and snap the picture blocks." },
      boxes: [{ h: "How it works", text: "The **button** senses your finger. The **Arduino** checks: is it pressed? If yes, the **LED** lights and the **buzzer** beeps.", color: "purple" }] },
    { kicker: "Deeper", title: "Autonomy: how much does it decide?", only: ["advanced"],
      points: ["**Remote controlled:** a person decides everything (not really a robot)", "**Automatic:** follows fixed rules (a lift)", "**Autonomous:** chooses its own actions to reach a goal (a robot vacuum)", "**Learning:** improves its own rules from experience (with AI)"], text: "Robots are not all equally 'smart'.",
      art: "wifi" }
  ],
  quiz: [
    { q: "Which part of a robot is the 'think' job?", options: ["The motor", "The controller and its program", "The battery", "The wheels"], answer: 1, why: "The controller runs the program that decides what to do." },
    { q: "A distance sensor on a robot car is part of...", options: ["Sense", "Think", "Act", "None of them"], answer: 0, why: "Sensors gather information about the world." }
  ],
  realTitle: "Robots at work",
  real: [
    { art: "robot", name: "Robot vacuum", text: "Senses walls and dirt with bumpers and infrared, decides where to go, drives and sucks." },
    { art: "robotArm", name: "Factory arm", text: "Senses parts with cameras, decides how to grab them, and welds or packs them all day." },
    { art: "robotCar", name: "Mars rover", text: "Too far for a joystick: it senses rocks and slopes and plans its own safe path." }
  ],
  game: { title: "Robot, robot, what do you do?", mins: 6, big: "If a machine can sense, think and act by itself, it's a robot.",
    steps: ["Teacher holds up picture cards of machines (toaster, lift, drone, fan, robot vacuum, calculator...).", "Students stand up for 'robot', sit down for 'not a robot'.", "Pick 2 students to explain using SENSE, THINK, ACT.", "Bonus: act out a robot vacuum. One student is the sensor, one the brain, one the wheels."] },
  kitNote: "Pre-cut the jumper wires and lay out one kit tray per pair. Young groups can build on the breadboard with the teacher checking every wire before plugging in.",
  simWhy: "Build it in **Circuit Lab** first: it can't break and you can test the code instantly. **Wokwi** is a good second option at home.",
  builds: [
    { obj: 2, title: "Build the circuit", mins: 12, sim: "circuit-lab",
      scene: { items: [{ art: "button", label: "pin 2 + GND", color: "red" }, { art: "arduino", label: "Arduino Uno", color: "teal" }, { art: "led", label: "pin 13 + 220 Ω", color: "amber" }] }, steps: ["Button: one leg to **pin 2**, the other to **GND**.", "LED long leg → 220 Ω resistor → **pin 13**; short leg to GND.", "Buzzer + to **pin 8**, − to GND.", "Check every wire with your partner before plugging in the USB."],
      side: [{ h: "Which job is each part?", text: "Button = SENSE\nArduino = THINK\nLED and buzzer = ACT", color: "purple" }] },
    { obj: 2, title: "Program the brain", mins: 12, only: ["core", "advanced"], steps: ["Copy the code into the Arduino IDE or Circuit Lab.", "Upload and press the button.", "Change the beep: try 440, 880 and 1200.", "Point to the line that senses, the line that thinks, and the lines that act."],
      code: "void setup() {\n  pinMode(2, INPUT_PULLUP); // SENSE\n  pinMode(13, OUTPUT);\n}\nvoid loop() {\n  bool pressed = digitalRead(2) == LOW;\n  if (pressed) {             // THINK\n    digitalWrite(13, HIGH);  // ACT\n    tone(8, 880);\n  } else {\n    digitalWrite(13, LOW);\n    noTone(8);\n  }\n}" },
    { obj: 2, kicker: "Time to build!", title: "Snap the picture blocks", mins: 12, only: ["starter"],
      steps: ["Open ArduinoBlocks (or Circuit Lab blocks).", "Snap the blocks in this order.", "Press upload and press the button.", "Change the note: try a high beep and a low beep."],
      blocks: [[0, "amber", "when Arduino starts"], [0, "amber", "forever"], [1, "purple", "if button on pin 2 is pressed"], [2, "red", "turn ON light (pin 13)"], [2, "dark", "play note 880 on pin 8"], [1, "purple", "else"], [2, "grey", "turn OFF light"], [2, "grey", "stop the note"]],
      side: [{ h: "Read it like a story", text: "Check the button.\n**IF** it's pressed: light and beep!\n**ELSE:** be quiet.\nCheck again.", color: "purple" }] },
    { obj: 2, title: "Make it smarter", mins: 10, steps: ["Make the light flash 3 times when you press, then stop.", "Count presses: every 5th press plays a tune.", "Add a second button: one is 'yes', one is 'no'."], only: ["core", "advanced"],
      note: { l: "Think", text: "Your code is now making decisions based on history (how many presses). That's the start of a smarter robot!" } }
  ],
  test: { title: "Does every job work?", cols: ["Test", "What should happen", "What happened", "Pass?"],
    rows: [["Press the button", "Light on, beep", "", ""], ["Let go", "Light off, quiet", "", ""], ["Press very fast 5 times", "Keeps up every time", "", ""], ["Unplug the button wire", "Nothing happens", "", ""]] },
  levelup: { choices: [{ t: "Morse code", d: "Make the buzzer beep your name in Morse code when pressed." }, { t: "Reaction game", d: "Light comes on at a random time; time how fast your partner presses." }, { t: "Night guard", d: "Swap the button for a light sensor: beep when the lights go off." }],
    think: { h: "Think like an engineer", text: "Your gadget senses, thinks and acts. What sensor and actuator would make it useful in your house?" }, boss: "Make a 3-button code lock: the light only turns on for the right order." },
  wrap: { learned: ["Robots sense, think and act", "Sensors gather information; actuators do things", "The controller runs a program in a loop", "Not every machine is a robot", "I built and coded a sense-think-act gadget"],
    exit: "Name one robot. Tell me its sensor, its brain and its actuator.", home: "Find 3 machines at home. Robot or not? Use sense, think, act to decide.", next: "**EF-02 Voltage, Current and Ohm's Law**: why the LED needs that little resistor." },
  guide: {
    grouping: "Pairs with one kit",
    overview: "The opening lesson of the whole curriculum. Students build the mental model they'll use in every later activity: **sense → think → act, in a loop**. The circuit is deliberately simple so the focus stays on the idea, and on careful, checked wiring habits from day one.",
    prep: ["Print or display the robot/not-robot picture cards (toaster, lift, drone, fan, robot vacuum, calculator, automatic door, Mars rover)", "One kit tray per pair; LEDs and resistors pre-sorted", "Arduino IDE installed or Circuit Lab open on every laptop", "Upload the finished program to a demo board to show at the start"],
    timing: [[8, "Hook", "Robot or not? discussion and video"], [12, "Learn", "Sense, think, act; the robot test; meet the Arduino"], [6, "Game", "Stand up / sit down robot game"], [12, "Build 1", "Wire the circuit (simulate first)"], [12, "Build 2", "Upload and change the code"], [10, "Build 3 / Level up", "Make it smarter"], [10, "Wrap", "Test table, objective check, exit ticket"]],
    steps: [
      { phase: "Hook", title: "Robot or not?", say: "Hands up if you think a toaster is a robot. Why?", do: ["Let pairs vote on the three guesses.", "Keep the disagreements going; the robot test will settle them."] },
      { phase: "Learn", title: "The three jobs", do: ["Draw SENSE → THINK → ACT with a loop arrow back to SENSE.", "Use the automatic door reveal: there is no perfect line, and that's a good discussion."] },
      { phase: "Build", title: "Wire, check, upload", do: ["Model the 'partner check' habit: one wires, the other checks each wire against the slide.", "After upload, ask each pair to point at the SENSE, THINK and ACT lines in the code.", "Early finishers go to Make it smarter or Level up."] },
      { phase: "Wrap", title: "Exit ticket", do: ["Each student names a robot with its sensor, brain and actuator on a sticky note.", "Collect the best examples for a class wall display."] }
    ],
    misconceptions: [["Robots must look like humans", "Most robots are arms, cars, vacuums and drones. Shape doesn't matter; sense-think-act does."], ["A remote-control car is a robot", "Only if it decides something itself. If a person makes every choice, it's a machine, not a robot."], ["The Arduino 'knows' what to do", "It only follows our program. Change one line and it behaves differently."]],
    trouble: [["LED never lights", "LED backwards: long leg goes to the resistor/pin side."], ["Light is always on", "Button wired to 5V instead of GND, or INPUT instead of INPUT_PULLUP."], ["Upload fails", "Wrong board or port in Tools; for CH340 clones install the driver."], ["Buzzer silent", "Active buzzers only need HIGH; for tone() use a passive buzzer, or swap to digitalWrite."]],
    tiers: {
      starter: ["Skip the code typing: upload the program for them and let them change only the tone numbers.", "Act out sense, think, act with three children as the parts.", "Success: each child presses their button and explains which part 'thinks'."],
      core: ["Full lesson with Build 1–3."],
      advanced: ["Add the autonomy-levels slide.", "Challenge: the 3-button code lock (boss level) using a state variable.", "Discuss where robots stop and AI begins."] },
    assess: [
      { c: "Explains what a robot is", e: "Names a robot", s: "Uses sense, think, act correctly", x: "Discusses levels of autonomy with examples" },
      { c: "Builds the circuit", e: "Works with help", s: "Wired and checked independently", x: "Extends with extra inputs/outputs" },
      { c: "Reads and changes code", e: "Changes a number", s: "Points to sense/think/act lines", x: "Adds new logic (counting, code lock)" }],
    safety: ["Wire with the USB unplugged; plug in only after a partner check.", "Never connect 5V directly to GND."]
  }
};
