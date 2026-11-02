# Robotics & AI Curriculum (Phase 3): slide brief

**For:** the session that makes the club's presentations.
**Job:** make 60 slide decks (and a teacher guide for each) for the new Robotics & AI Curriculum, in **exactly the same format and hand-drawn style as the existing decks**, and put them into the lab-planner so they appear on the website and in the BotBench app.

---

## 1. Style and format (non-negotiable)

Follow the existing decks: open any of them as the model, especially:
- `Presentations/Foundation/F-00_Welcome_to_Robotics_Slides.pdf`, F-01 Arduino Uno Basics, F-02 ESP32 Basics and F-04 Introduction to Actuators;
- one class deck per group, e.g. LE-07 Plant Water Alarm, JM-06 Fire & Gas Safety Alarm Panel and TL-19 TinyML.

The full written format is in `lab-planner/rai/SLIDE_GUIDE.md` (sections 1–5). In short:

- 16:9, cream paper, soft colour blobs, faint hand-drawn edge doodles.
- Hand-drawn boxes with double wobbly outlines; Caveat handwriting kickers in orange-red; yellow and blue sticky notes in handwriting.
- **All pictures hand-drawn 2D doodles in the house style** (an Arduino drawn as a teal board, components drawn flat with a marker outline). **No emoji, no clip art, no photos or images copied from the internet.** The only exception is the video thumbnail and QR code on the video slide.
- A few colours only, to keep the theme: the category colour plus red, green, blue, purple and amber for boxes.
- Order: Title → LEARN (Let's think · Learning objectives with Proof · Video time with Watch for + QR · Objective slides · Real world · Our machine) → **Part 2 · Make it** divider → MAKE (Class game · Build it kit · Build step 1/2/3 · Test like an engineer · Level up! · optional Think about it) → WRAP UP (Objective check · Show what you know).
- Footer: `Robotics & AI Club · <Category> · Curriculum by Qasim Mushtaq` and `n / total`.

### The four categories (use these instead of age groups)

| Category | Code | Colour | Light |
|---|---|---|---|
| Engineering Foundations | EF | `#E0892B` | `#FDF1E3` |
| Robotics | ROB | `#2E6BE6` | `#E8F0FD` |
| Artificial Intelligence | AI | `#7B3FC4` | `#F1E9FB` |
| Intelligent Systems | IS | `#14967F` | `#E3F6F2` |

The title slide's top line reads `<Category> · <Module>` (e.g. "Robotics · Motors & Motion Control") instead of "Junior Makers · Class 6".

### Three depths, not age groups

Each activity is taught at **Starter** (young or new: play, picture blocks, teacher builds), **Core** (the full lesson) or **Advanced** (more maths, more code, more independence). Write the deck for **Core**. Add a small "Starter" or "Advanced" tag on slides that belong to one depth only (for example picture blocks for Starter, a maths slide for Advanced), so the teacher can skip them.

## 2. Where to put things

| What | Where | Then |
|---|---|---|
| Slides (PDF) | `~/Documents/Robotics Curriculum/Presentations/<Category folder>/<CODE>_<Title_With_Underscores>_Slides.pdf`. Category folders: `Engineering Foundations`, `Robotics`, `Artificial Intelligence`, `Intelligent Systems` (exact spelling). | From `~/Downloads/lab-planner` run `python3 tools/build_library.py`. It copies the PDF to `library/slides/`, makes the cover and banner pictures (needs poppler) and rebuilds `library.js`. The deck then shows on its tile in the Robotics & AI Curriculum page automatically. |
| Video (one per deck, checked) | `lab-planner/videos.js`: add `"<CODE>": [{ id, title, channel, mins }]` exactly like the existing entries. | It appears as "Watch the video" on the activity. |
| Teacher guide (PDF, same style, A4 portrait) | `lab-planner/library/guides/<CODE>_Teacher_Guide.pdf` | Add the code to `window.RAI.guides` at the bottom of `lab-planner/rai/catalog.js`. |
| New kit item names | Use the names in the kit lists below (they match the lab's parts catalogue). Items marked "not in the lab yet" are cheap purchases. | — |
| Finish | From `lab-planner`: `python3 tools/bump_version.py portal`, then commit and push. | The site updates; the BotBench app picks it up on reload. |
| Go live | When all decks are in, set `live: true` in `lab-planner/rai/catalog.js`, bump, commit, push. | The "Robotics & AI Curriculum" menu entry appears. Until then it stays hidden (reachable only at `#rai`). |

The activity list itself (codes, titles, modules, kit, simulators, depths) lives in `lab-planner/rai/catalog.js`. Don't rename codes; if a title changes, change it there too.

## 3. Teacher guide contents

1. At a glance: length, type, grouping and concepts.
2. Overview.
3. Learning outcomes.
4. Three depths: what changes at each.
5. Before the lesson: kit, simulators and a prep checklist.
6. Timing plan: a table that adds up to the lesson length.
7. Step by step, with "Say:" lines.
8. Common misconceptions.
9. Troubleshooting.
10. Rubric: Emerging, Secure and Extending.
11. Answers.
12. Safety.

## 4. Suggested order

Make them module by module so each module can be reviewed:
1. EF-01 to EF-04
2. ROB-05 to ROB-09
3. AI-01 to AI-06
4. IS-01 to IS-04

Then the rest.

## 5. All 60 decks

| Code | Title | Module | Type | Min |
|---|---|---|---|---|
| EF-01 | What Is a Robot? Sense, Think, Act | Electronics for Robots | HS | 60 |
| EF-02 | Voltage, Current and Ohm's Law | Electronics for Robots | HS | 60 |
| EF-03 | Digital, Analog and PWM | Electronics for Robots | HS | 60 |
| EF-04 | Logic Gates: How Robots Decide | Electronics for Robots | S | 60 |
| EF-05 | Transistors and Relays: Switching Big Loads | Electronics for Robots | HS | 60 |
| EF-06 | Powering Robots Safely | Electronics for Robots | H | 60 |
| EF-07 | From Blocks to Code | Programming Robots | S | 60 |
| EF-08 | Functions, Loops and Events | Programming Robots | S | 60 |
| EF-09 | Wireless Control: Bluetooth and Wi-Fi | Programming Robots | HS | 90 |
| EF-10 | Talking Chips: I2C, UART and SPI | Programming Robots | S | 60 |
| EF-11 | CAD for Robots | Design & Make | HS | 90 |
| EF-12 | Design Thinking and the Engineering Notebook | Design & Make | U | 60 |
| ROB-01 | Gears: Trading Speed for Strength | Mechanisms | HS | 60 |
| ROB-02 | Linkages that Walk and Grab | Mechanisms | HS | 60 |
| ROB-03 | Hydraulic Robot Arm | Mechanisms | H | 60 |
| ROB-04 | Gripper Design Challenge | Mechanisms | HS | 90 |
| ROB-05 | Build and Wire a Robot Car | Motors & Motion Control | H | 90 |
| ROB-06 | Servos and Steppers: Moving Precisely | Motors & Motion Control | HS | 60 |
| ROB-07 | Encoders: How Far Did I Go? | Motors & Motion Control | H | 90 |
| ROB-08 | Feedback Control: On-Off versus Proportional | Motors & Motion Control | HS | 90 |
| ROB-09 | PID Tuning Lab | Motors & Motion Control | HS | 90 |
| ROB-10 | Balancing Robot | Motors & Motion Control | HS | 120 |
| ROB-11 | Robot Arms: Joints and Workspace | Robot Arms | HS | 60 |
| ROB-12 | Forward Kinematics | Robot Arms | S | 60 |
| ROB-13 | Inverse Kinematics: Point and Reach | Robot Arms | HS | 90 |
| ROB-14 | Teach-and-Replay Robot Arm | Robot Arms | H | 90 |
| ROB-15 | Algorithms on a Grid | Navigation & Autonomy | US | 60 |
| ROB-16 | Obstacle Avoidance Behaviours | Navigation & Autonomy | HS | 90 |
| ROB-17 | Robot State Machines | Navigation & Autonomy | HS | 60 |
| ROB-18 | Path Planning: BFS and A* | Navigation & Autonomy | S | 60 |
| ROB-19 | Robot Simulation | Navigation & Autonomy | S | 90 |
| ROB-20 | How Drones Fly | Navigation & Autonomy | S | 60 |
| AI-01 | What Is AI? Rules versus Learning | Machine Learning Foundations | US | 60 |
| AI-02 | Training Data: Teach a Computer to See | Machine Learning Foundations | S | 60 |
| AI-03 | Nearest Neighbours: Learning by Comparing | Machine Learning Foundations | S | 60 |
| AI-04 | Decision Trees | Machine Learning Foundations | S | 60 |
| AI-05 | Neural Networks | Machine Learning Foundations | S | 90 |
| AI-06 | Is My AI Any Good? Testing Models | Machine Learning Foundations | S | 60 |
| AI-07 | How Computers See: Convolutional Networks | Seeing, Hearing & Language | S | 90 |
| AI-08 | Sound and Speech Recognition | Seeing, Hearing & Language | S | 60 |
| AI-09 | Language AI: Chatbots and Sentiment | Seeing, Hearing & Language | S | 60 |
| AI-10 | Reinforcement Learning: Learning by Reward | Seeing, Hearing & Language | S | 90 |
| AI-11 | How Large Language Models Work | Generative AI | S | 60 |
| AI-12 | Prompting and Fact-Checking | Generative AI | S | 60 |
| AI-13 | Generative Images and Deepfakes | Generative AI | S | 60 |
| AI-14 | AI Ethics: Fair, Safe and Private | AI & Society | U | 60 |
| AI-15 | AI Careers and the Future of Work | AI & Society | S | 60 |
| IS-01 | Robot Senses Tour | Robot Perception | H | 90 |
| IS-02 | Noisy Sensors and Filters | Robot Perception | HS | 60 |
| IS-03 | Sensor Fusion | Robot Perception | HS | 90 |
| IS-04 | Computer Vision Basics | Robot Perception | S | 60 |
| IS-05 | Scanning Rangefinder and Mapping | Robot Perception | HS | 90 |
| IS-06 | Hand and Pose Control | AI-Powered Robots | HS | 90 |
| IS-07 | Voice-Commanded Robot | AI-Powered Robots | HS | 90 |
| IS-08 | AI Sorting Robot | AI-Powered Robots | HS | 120 |
| IS-09 | Follow-the-Object Robot | AI-Powered Robots | HS | 120 |
| IS-10 | TinyML: AI on a Microcontroller | Connected & Edge Intelligence | HS | 120 |
| IS-11 | Robot Telemetry Dashboard | Connected & Edge Intelligence | HS | 90 |
| IS-12 | Robot Assistant with a Language Model | Connected & Edge Intelligence | HS | 90 |
| IS-13 | Capstone: Design, Build and Pitch an Intelligent Robot | Capstone | HS | 120 |

Type: H hardware · S software · U unplugged · HS / US both.

## 6. Deck by deck

For 14 decks a full draft of the slide content already exists (text, code, games, tests and teacher-guide notes): use it as the content and draw it properly. For the other 46 the brief gives the hook, objectives, depths, kit and simulators; design the slides in the standard order.

## Engineering Foundations · Electronics for Robots

### EF-01 · What Is a Robot? Sense, Think, Act

- **File:** `Presentations/Engineering Foundations/EF-01_What_Is_a_Robot_Sense_Think_Act_Slides.pdf`
- **Type / length:** Hardware + software · 60 min
- **Hook:** A toaster, a washing machine and a Mars rover walk into a lab. Which one is a robot?
- **Key ideas (title-slide tags):** robot definition, input, process, output, sensors and actuators
- **Depths:** Starter: Sorting game with picture cards, then press-the-button robot. Core: Wire and code a sense-think-act gadget in Circuit Lab, then for real. Advanced: Add a second sensor and a decision rule that combines both.
- **Kit per group of 2:** Arduino Uno + USB cable; Push button; LED 5 mm (assorted); Resistor 220 ohm; Passive buzzer; Breadboard (half size); Jumper wires M-M; Laptop
- **Simulators to point to:** Circuit Lab; Wokwi (https://wokwi.com)
- **Draft content written:** use it, improve it, and draw it in the house style.

1. Title · "Did you know?": The word 'robot' comes from a 1920 Czech play. 'Robota' means hard, boring work.
2. Let's think · "A toaster, a washing machine and a Mars rover. Which ones are robots?" · guesses: Only the rover / All of them / It depends on the brain · story box "Not every machine is a robot": A toaster heats for a set time whatever happens. A Mars rover feels the ground, decides where to drive and moves on its own. What makes the difference? · Today: we learn the 3 jobs every robot does, then build a tiny robot brain that senses, thinks and acts.
3. Learning objectives · 1) Sort machines into robots and non-robots (Proof: I can explain my choice using sense, think, act) 2) Build a sense-think-act gadget (Proof: my button (sense) makes the Arduino (think) light and beep (act)) 3) Spot sense, think, act in a real robot (Proof: I labelled the parts of a robot picture)
4. Video time · find a short video: "what is a robot sense think act explained" (about 4 min) · Watch for: What are the three things every robot does? / Name one robot that helps people at work. / What 'senses' did the robots have?
5. Objective 1 · Big idea · **Every robot does three jobs** · [SENSE] Sensors gather information: distance, light, touch, sound, a camera. · [THINK] The controller decides what to do, following a program. · [ACT] Actuators make something happen: motors turn, lights shine, speakers beep.
6. Objective 1 · The robot test · **Robot or not?** · Ask three questions about any machine: · Does it sense the world around it? · Does it decide for itself, using a program? · Does it act to change something? · Three yes answers: it's a robot. A toaster only acts on a timer, so it's not. · Tap-to-reveal: Is an automatic door a robot? → A very simple one! It senses you (motion sensor), its controller decides 'open', and a motor acts. Engineers argue about where the line is, and that's fine.
7. Objective 2 · Our robot brain · **Meet the Arduino** · [Inputs (sense)] Buttons; Light and distance sensors; Knobs · [Outputs (act)] LEDs and buzzers; Motors and servos; Screens · [The program (think)] The code runs in a loop thousands of times a second: / read the sensors → decide → set the outputs.
8. Objective 2 · Our machine · **Press, think, light and beep** · [How it works] The button senses your finger. The Arduino checks: is it pressed? If yes, the LED lights and the buzzer beeps.
9. Deeper · **Autonomy: how much does it decide?** (advanced only) · Robots are not all equally 'smart'. · Remote controlled: a person decides everything (not really a robot) · Automatic: follows fixed rules (a lift) · Autonomous: chooses its own actions to reach a goal (a robot vacuum) · Learning: improves its own rules from experience (with AI)
10. Quick check · Which part of a robot is the 'think' job? · options: The motor / The controller and its program / The battery / The wheels · answer: The controller and its program (The controller runs the program that decides what to do.)
11. Quick check · A distance sensor on a robot car is part of... · options: Sense / Think / Act / None of them · answer: Sense (Sensors gather information about the world.)
12. Real world · Robot vacuum: Senses walls and dirt with bumpers and infrared, decides where to go, drives and sucks. · Factory arm: Senses parts with cameras, decides how to grab them, and welds or packs them all day. · Mars rover: Too far for a joystick: it senses rocks and slopes and plans its own safe path.
13. Part 2 · Make it (divider)
14. Class game · **Robot, robot, what do you do?** · Teacher holds up picture cards of machines (toaster, lift, drone, fan, robot vacuum, calculator...). Students stand up for 'robot', sit down for 'not a robot'. Pick 2 students to explain using SENSE, THINK, ACT. Bonus: act out a robot vacuum. One student is the sensor, one the brain, one the wheels. · Big idea: If a machine can sense, think and act by itself, it's a robot.
15. Build it · Our kit (per group) · tip: Pre-cut the jumper wires and lay out one kit tray per pair. Young groups can build on the breadboard with the teacher checking every wire before plugging in.
16. Objective 2 · Build step 1 · **Build the circuit** · Button: one leg to pin 2, the other to GND. LED long leg → 220 Ω resistor → pin 13; short leg to GND. Buzzer + to pin 8, − to GND. Check every wire with your partner before plugging in the USB.
17. Objective 2 · Build step 2 · **Program the brain** (core/advanced only) · Copy the code into the Arduino IDE or Circuit Lab. Upload and press the button. Change the beep: try 440, 880 and 1200. Point to the line that senses, the line that thinks, and the lines that act. · Code: void setup() { ⏎   pinMode(2, INPUT_PULLUP); // SENSE ⏎   pinMode(13, OUTPUT); ⏎ } ⏎ void loop() { ⏎   bool pressed = digitalRead(2) == LOW; ⏎   if (pressed) {             // THINK ⏎     digitalWrite(13, HIGH);  // ACT ⏎     tone(8, 880); ⏎   } else { ⏎     digitalWrite(13, LOW); ⏎     noTone(8); ⏎   } ⏎ }
18. Objective 2 · Build step 3 · **Snap the picture blocks** (starter only) · Open ArduinoBlocks (or Circuit Lab blocks). Snap the blocks in this order. Press upload and press the button. Change the note: try a high beep and a low beep. · picture blocks: when Arduino starts | forever | if button on pin 2 is pressed | turn ON light (pin 13) | play note 880 on pin 8 | else | turn OFF light | stop the note
19. Objective 2 · Build step 4 · **Make it smarter** (core/advanced only) · Make the light flash 3 times when you press, then stop. Count presses: every 5th press plays a tune. Add a second button: one is 'yes', one is 'no'. · Note "Think": Your code is now making decisions based on history (how many presses). That's the start of a smarter robot!
20. Test like an engineer · **Does every job work?** · columns: Test | What should happen | What happened | Pass? · rows: Press the button Light on, beep / Let go Light off, quiet / Press very fast 5 times Keeps up every time / Unplug the button wire Nothing happens
21. Level up! · Morse code: Make the buzzer beep your name in Morse code when pressed. · Reaction game: Light comes on at a random time; time how fast your partner presses. · Night guard: Swap the button for a light sensor: beep when the lights go off. · Think like an engineer: Your gadget senses, thinks and acts. What sensor and actuator would make it useful in your house? · Boss level: Make a 3-button code lock: the light only turns on for the right order.
22. Objective check · Can I really do it? Prove it. (rate red/amber/green per objective)
23. Show what you know · Robots sense, think and act · Sensors gather information; actuators do things · The controller runs a program in a loop · Not every machine is a robot · I built and coded a sense-think-act gadget · Exit ticket: Name one robot. Tell me its sensor, its brain and its actuator. · At home: Find 3 machines at home. Robot or not? Use sense, think, act to decide. · Next class: EF-02 Voltage, Current and Ohm's Law: why the LED needs that little resistor.

**Teacher-guide draft:** The opening lesson of the whole curriculum. Students build the mental model they'll use in every later activity: sense → think → act, in a loop. The circuit is deliberately simple so the focus stays on the idea, and on careful, checked wiring habits from day one.

- Timing: 8 min Hook (Robot or not? discussion and video); 12 min Learn (Sense, think, act; the robot test; meet the Arduino); 6 min Game (Stand up / sit down robot game); 12 min Build 1 (Wire the circuit (simulate first)); 12 min Build 2 (Upload and change the code); 10 min Build 3 / Level up (Make it smarter); 10 min Wrap (Test table, objective check, exit ticket)
- Prep: Print or display the robot/not-robot picture cards (toaster, lift, drone, fan, robot vacuum, calculator, automatic door, Mars rover); One kit tray per pair; LEDs and resistors pre-sorted; Arduino IDE installed or Circuit Lab open on every laptop; Upload the finished program to a demo board to show at the start
- Misconceptions: "Robots must look like humans" → Most robots are arms, cars, vacuums and drones. Shape doesn't matter; sense-think-act does.; "A remote-control car is a robot" → Only if it decides something itself. If a person makes every choice, it's a machine, not a robot.; "The Arduino 'knows' what to do" → It only follows our program. Change one line and it behaves differently.
- Troubleshooting: LED never lights → LED backwards: long leg goes to the resistor/pin side.; Light is always on → Button wired to 5V instead of GND, or INPUT instead of INPUT_PULLUP.; Upload fails → Wrong board or port in Tools; for CH340 clones install the driver.; Buzzer silent → Active buzzers only need HIGH; for tone() use a passive buzzer, or swap to digitalWrite.
- Depths: starter: Skip the code typing: upload the program for them and let them change only the tone numbers. Act out sense, think, act with three children as the parts. Success: each child presses their button and explains which part 'thinks'. | core: Full lesson with Build 1–3. | advanced: Add the autonomy-levels slide. Challenge: the 3-button code lock (boss level) using a state variable. Discuss where robots stop and AI begins.
- Rubric: Explains what a robot is (emerging: Names a robot; secure: Uses sense, think, act correctly; extending: Discusses levels of autonomy with examples); Builds the circuit (emerging: Works with help; secure: Wired and checked independently; extending: Extends with extra inputs/outputs); Reads and changes code (emerging: Changes a number; secure: Points to sense/think/act lines; extending: Adds new logic (counting, code lock))
- Safety: Wire with the USB unplugged; plug in only after a partner check.; Never connect 5V directly to GND.

### EF-02 · Voltage, Current and Ohm's Law

- **File:** `Presentations/Engineering Foundations/EF-02_Voltage_Current_and_Ohms_Law_Slides.pdf`
- **Type / length:** Hardware + software · 60 min
- **Hook:** Why does an LED burn out in a flash without a tiny resistor?
- **Key ideas (title-slide tags):** voltage, current, resistance, Ohm's law
- **Depths:** Starter: Water-pipe role play and the PhET Ohm's Law sliders. Core: Predict, simulate, then measure with a multimeter. Advanced: Calculate LED resistors for 3.3 V and 5 V boards and check power ratings.
- **Kit per group of 2:** Digital multimeter; Resistor 220 ohm; Resistor 1k ohm; Resistor 10k ohm; LED 5 mm (assorted); 2xAA battery holder + batteries; Breadboard (half size); Jumper wires M-M
- **Simulators to point to:** Ohm's Law; Circuit Construction Kit: DC; Falstad Circuit Simulator
- **Draft content written:** use it, improve it, and draw it in the house style.

1. Title · "Did you know?": An LED connected straight to a 9 V battery can burn out in less than a second.
2. Let's think · "Why does an LED burn out in a flash without a tiny resistor?" · guesses: The battery is too big / The LED is cheap / Nothing slows the current · story box "The pop": Plug an LED straight into a battery and it glows bright for a moment, then goes dark forever. Add a resistor the size of a grain of rice and it glows happily for years. · Today: we meet voltage, current and resistance, predict with V = I × R, then check with a real multimeter.
3. Learning objectives · 1) Describe voltage, current and resistance (Proof: I can explain them with the water-pipe model) 2) Predict current with V = I × R (Proof: my prediction was close to the meter reading) 3) Choose a safe resistor for an LED (Proof: I calculated a resistor and my LED lit safely)
4. Video time · find a short video: "voltage current resistance water analogy explained" (about 6 min) · Watch for: What does voltage push? / What does resistance do to the flow? / Why do LEDs need a resistor?
5. The water model · **Three words, one picture** · [Voltage (V, volts)] The push. Like water pressure from a tank up high. · [Current (I, amps)] The flow. How much charge goes past each second. · [Resistance (R, ohms Ω)] The squeeze. A thin pipe lets less water through.
6. The law · **Ohm's law: V = I × R** · Know two, find the third. · I = V ÷ R: more push or less squeeze → more flow · R = V ÷ I: to limit the flow, choose R · Arduino pins: about 20 mA (0.02 A) is safe · Tap-to-reveal: Same battery, double the resistance. What happens to the current? → It halves. I = V ÷ R, so twice the R means half the I. · Code: I = V / R ⏎ 5 V / 220 Ω  = 0.023 A = 23 mA ⏎ 5 V / 1000 Ω = 0.005 A = 5 mA
7. LED maths · **Choosing the resistor** · An LED 'uses up' about 2 V. The resistor gets the rest. · Resistor voltage = supply − LED voltage · R = (5 − 2) ÷ 0.015 = 200 Ω → pick 220 Ω · Bigger R = dimmer but safer · [Rule of thumb] 5 V board: 220 Ω to 1 kΩ. / 3.3 V board (ESP32): 100 Ω to 470 Ω.
8. Deeper · **Power: why resistors get hot** (advanced only) · Power P = V × I (watts). · A 1/4 W resistor must stay under 0.25 W · A motor's current through a small resistor would burn it · Batteries lose voltage when current is high: internal resistance · Code: P = V × I = 3 V × 0.015 A = 0.045 W  ✓
9. Quick check · Which is the 'push' in a circuit? · options: Current / Voltage / Resistance / The LED · answer: Voltage (Voltage pushes the charge around the circuit.)
10. Quick check · 5 V across 500 Ω. What is the current? · options: 0.01 A / 100 A / 2500 A / 0.1 A · answer: 0.01 A (I = 5 ÷ 500 = 0.01 A = 10 mA.)
11. Real world · Phone chargers: Control voltage and current so the battery charges fast but safely. · House fuses: Break the circuit if the current gets dangerously high. · Robots: Every sensor and LED on a robot needs the right voltage and limited current.
12. Part 2 · Make it (divider)
13. Class game · **Be the circuit** · Students stand in a loop holding a rope (the current). One student is the battery and gently pulls the rope round (voltage). One student squeezes the rope in their hands (resistance). Feel the flow slow down. Squeeze harder: what happens to the speed? · Big idea: Voltage pushes, current flows, resistance squeezes.
14. Build it · Our kit (per group)
15. Build step 1 · **Explore in PhET** · Open Ohm's Law. Raise V: what happens to I? Raise R: what happens to I? Fill in: 'Current goes up when...' Open Circuit Construction Kit DC and build battery + bulb + resistor.
16. Build step 2 · **Predict, then measure** · Build: 2×AA (3 V) → 220 Ω → LED → back to battery. Predict the current: I = (3 − 2) ÷ 220. Set the multimeter to mA and put it in series (break the loop, meter in the gap). Swap to 1 kΩ. Predict, then measure again. Measure the voltage across the LED (meter on V, across the LED).
17. Build step 3 · **Resistor detective** (core/advanced only) · Read the colour bands of three resistors. Check each with the meter on Ω. Which colour code means 220? 1k? 10k?
18. Test like an engineer · **Prediction versus measurement** · columns: Resistor | Predicted current | Measured current | LED brightness · rows: 220 Ω / 1 kΩ / 10 kΩ
19. Level up! · Two LEDs: Put two LEDs in series. Do you need a different resistor? · Parallel: Two resistors side by side: is the total more or less? · Dimmer: Use a potentiometer as a variable resistor. · Think like an engineer: Your prediction and measurement differ a little. Give two reasons why. · Boss level: Work out the smallest safe resistor for a blue LED (3 V) on the ESP32's 3.3 V pin.
20. Objective check · Can I really do it? Prove it. (rate red/amber/green per objective)
21. Show what you know · Voltage pushes, current flows, resistance squeezes · V = I × R · Current is measured in series, voltage across · LEDs need a resistor to limit current · Predict first, then measure · Exit ticket: A 9 V battery and a 2 V LED want 20 mA. Which resistor? Show your working. · At home: Find the label on a phone charger. What voltage and current does it give? · Next class: EF-03 Digital, Analog and PWM: how a robot dims a light.

**Teacher-guide draft:** Grounds all later electronics in three quantities and one law. Students predict before measuring, which builds the habit of checking reality against theory. Multimeter skills (series for current, across for voltage) are taught explicitly because they're needed throughout the curriculum.

- Timing: 8 min Hook (LED pop demo (teacher only, behind a screen) and video); 12 min Learn (Water model, Ohm's law, LED maths); 6 min Game (Rope circuit); 10 min Build 1 (PhET exploration); 15 min Build 2 (Predict and measure); 10 min Build 3 (Resistor detective); 9 min Wrap (Exit ticket)
- Prep: Multimeters with fresh batteries; check the mA fuse in each; Bags of 220 Ω, 1 kΩ, 10 kΩ resistors and red LEDs; 2×AA holders with batteries; PhET sims work offline from the Simulators page
- Misconceptions: "Current gets 'used up' by the LED" → The same current flows all the way round; energy is transferred, not current.; "Bigger battery = more current always" → Current depends on the resistance too.; "The resistor must go before the LED" → In series it can go on either side; the current is the same everywhere.
- Troubleshooting: Meter reads 0 mA → Meter not in series, wrong socket, or the mA fuse is blown.; LED doesn't light → Backwards: long leg to + side.; Reading jumps → Loose breadboard contact: press components in firmly.
- Depths: starter: Rope game and PhET sliders only; 'more squeeze, less flow'. Light an LED with and without a resistor (resistor always used; the 'pop' is shown in a video). | core: Full lesson. | advanced: Power slide; calculate resistor power ratings. Series and parallel resistor combinations with measurements.
- Rubric: Concepts (emerging: Names V, I, R; secure: Explains with the water model; extending: Explains energy and power); Calculation (emerging: With help; secure: Uses V = I × R correctly; extending: Chooses resistors for different boards and LEDs); Measurement (emerging: Reads a meter with help; secure: Measures I in series and V across; extending: Explains differences from predictions)
- Safety: Never short a battery: it gets hot.; Never measure current across a power source.; The burning-LED demo is teacher-only, eyes protected.

### EF-03 · Digital, Analog and PWM

- **File:** `Presentations/Engineering Foundations/EF-03_Digital_Analog_and_PWM_Slides.pdf`
- **Type / length:** Hardware + software · 60 min
- **Hook:** A switch is on or off. So how does a robot dim a light or slow a motor?
- **Key ideas (title-slide tags):** digital, analog, ADC, PWM, duty cycle
- **Depths:** Starter: Light switch versus dimmer, then turn a knob to dim an LED. Core: Map a potentiometer to LED brightness and plot the values. Advanced: Explain duty cycle on an oscilloscope view and build a fade curve.
- **Kit per group of 2:** Arduino Uno + USB cable; Potentiometer 10k; LED 5 mm (assorted); Resistor 220 ohm; Breadboard (half size); Jumper wires M-M; Laptop
- **Simulators to point to:** Circuit Lab; Wokwi (https://wokwi.com)
- **Draft content written:** use it, improve it, and draw it in the house style.

1. Title · "Did you know?": Your phone screen dims by switching each light on and off hundreds of times a second, too fast to see.
2. Let's think · "A switch is only on or off. So how does a robot dim a light or slow a motor?" · guesses: Lower the voltage / A special chip / Flick it on and off very fast! · story box "The Arduino's secret": An Arduino pin can only give 0 V or 5 V. Nothing in between. Yet robots dim lights and change motor speeds all the time. There's a trick. · Today: we learn digital versus analog, read a knob, and use the PWM trick to dim an LED.
3. Learning objectives · 1) Tell digital from analog signals (Proof: I sorted sensors into digital and analog) 2) Read a knob with analogRead and map it (Proof: my knob gives 0 to 100 on the Serial Monitor) 3) Dim an LED with PWM (Proof: turning the knob smoothly dims my LED)
4. Video time · find a short video: "PWM pulse width modulation explained arduino" (about 5 min) · Watch for: What does 'duty cycle' mean? / Why don't we see the flicker? / What else is controlled with PWM?
5. Two kinds of signal · **Digital or analog?** · [Digital: only two values] ON or OFF, 1 or 0, HIGH or LOW. Buttons, motion sensors, a light switch. · [Analog: any value] Smoothly changing: a dimmer, a volume knob, temperature, light level.
6. Reading analog · **analogRead: 0 to 1023** · The Arduino's ADC turns 0–5 V into a number from 0 to 1023. · 0 V → 0, 2.5 V → about 512, 5 V → 1023 · `map()` rescales: map(value, 0, 1023, 0, 100) → a percentage · Tap-to-reveal: The knob reads 256. Roughly what voltage is on the pin? → 256 is a quarter of 1023, so about a quarter of 5 V: 1.25 V. · Code: int v = analogRead(A0);        // 0..1023 ⏎ int pct = map(v, 0, 1023, 0, 100); ⏎ Serial.println(pct);
7. The trick · **PWM: fast on-off** · Pulse Width Modulation flicks the pin on and off ~500 times a second. · Duty cycle = % of time ON · 25% on → looks dim, 100% on → full bright · `analogWrite(pin, 0..255)` sets the duty cycle · Only pins with ~ (3, 5, 6, 9, 10, 11 on the Uno)
8. Deeper · **Why it works for motors too** (advanced only) · Motors and our eyes are too slow to follow 500 Hz: they 'average' the pulses · Average voltage = duty × 5 V · Servos use a different PWM: the pulse length (1–2 ms) sets the angle · Brightness looks non-linear to our eyes: use a curve (gamma) for smooth fades
9. Quick check · Which is an analog sensor? · options: Push button / PIR motion sensor (on/off) / Light sensor (LDR) on A0 / Limit switch · answer: Light sensor (LDR) on A0 (Its value changes smoothly with the light level.)
10. Quick check · analogWrite(9, 64) gives a duty cycle of about... · options: 25% / 64% / 6% / 100% · answer: 25% (64 out of 255 is about a quarter.)
11. Real world · Dimmable LED lamps: Use PWM to dim without wasting energy as heat. · Computer fans: Speed up when the chip gets hot: PWM again. · Electric cars: Motor controllers use PWM to deliver exactly the right power.
12. Part 2 · Make it (divider)
13. Class game · **Human PWM** · Darken the room. One student holds a torch. Flash it slowly: everyone sees on and off. Flash faster and faster. When does it start to look steady? Now flash 'mostly off' fast. Does it look dimmer? · Big idea: Fast on-off switching looks like 'in between' when it's too quick to see.
14. Build it · Our kit (per group)
15. Build step 1 · **Read the knob** · Potentiometer: outer legs to 5V and GND, middle leg to A0. Print `analogRead(A0)` to the Serial Monitor. Turn slowly from end to end. Write the min and max. Use map() to show 0–100%.
16. Build step 2 · **Dim the LED** · LED + 220 Ω on pin 9 (a ~ pin). Map 0–1023 to 0–255. analogWrite the result. Open the Serial Plotter and turn the knob. · Code: void loop() { ⏎   int v = analogRead(A0); ⏎   int b = map(v, 0, 1023, 0, 255); ⏎   analogWrite(9, b); ⏎   Serial.println(b); ⏎   delay(20); ⏎ }
17. Build step 3 · **Breathing light** (core/advanced only) · Remove the knob. Use a for loop to fade 0 → 255 → 0. Change the delay to change the 'breathing' speed. Advanced: use a sine wave for a natural fade. · Code: for (int b = 0; b <= 255; b++) { analogWrite(9, b); delay(5); } ⏎ for (int b = 255; b >= 0; b--) { analogWrite(9, b); delay(5); }
18. Test like an engineer · **Duty cycle and brightness** · columns: analogWrite value | Duty cycle % | Brightness (1–5) | Measured voltage (average) · rows: 0 0% / 64 / 128 / 255 100%
19. Level up! · Night light: Swap the knob for an LDR: the darker it is, the brighter the LED. · Fan speed: Drive a fan through a transistor with PWM. · Colour mixer: Three knobs control an RGB LED's red, green and blue. · Think like an engineer: Why might a robot use PWM instead of a variable resistor to control its motor speed? · Boss level: Make brightness look evenly spaced to the eye using a gamma curve: b = 255 × (x/255)^2.2.
20. Objective check · Can I really do it? Prove it. (rate red/amber/green per objective)
21. Show what you know · Digital = two values; analog = a range · analogRead gives 0–1023 · map() rescales numbers · PWM fakes in-between by fast switching · analogWrite sets duty cycle 0–255 · Exit ticket: Why can't you see the LED flickering when it's at 50% PWM? · At home: Look at an LED lamp through your phone's slow-motion camera. Can you see it flicker? · Next class: EF-04 Logic Gates: how robots decide.

**Teacher-guide draft:** Introduces the two kinds of signal every robot uses and the PWM trick behind motor speed control. Students should leave able to read any analog sensor and control any PWM output, both used constantly later.

- Timing: 8 min Hook (Dimming question and video); 12 min Learn (Digital/analog, analogRead, PWM); 5 min Game (Human PWM); 12 min Build 1 (Read the knob); 12 min Build 2 (Dim the LED); 10 min Build 3 (Breathing light); 6 min Wrap (Exit ticket)
- Prep: Potentiometers with legs that fit the breadboard; A torch for the human PWM game; Optional: phone slow-motion video of an LED to show flicker
- Misconceptions: "analogWrite gives a real lower voltage" → It switches between 0 and 5 V; the average is lower.; "Any pin can do PWM" → Only pins marked ~.; "analogRead and analogWrite use the same range" → Read is 0–1023 (10-bit), write is 0–255 (8-bit).
- Troubleshooting: Value stuck at 0 or 1023 → Middle leg not on A0, or outer legs not on 5V/GND.; LED just on/off, no dimming → Pin without ~: move to 9.; Values jump around → Loose potentiometer: push it in firmly.
- Depths: starter: Torch game, then a ready-made dimmer: children turn the knob and describe it. | core: Full lesson. | advanced: Servo PWM vs LED PWM; gamma-corrected fades; measure average voltage.
- Rubric: Signals (emerging: Sorts with help; secure: Explains digital vs analog; extending: Explains ADC resolution and duty cycle); Code (emerging: Runs given code; secure: Uses analogRead, map, analogWrite; extending: Writes fades and curves)
- Safety: Unplug USB when rewiring.

### EF-04 · Logic Gates: How Robots Decide

- **File:** `Presentations/Engineering Foundations/EF-04_Logic_Gates_How_Robots_Decide_Slides.pdf`
- **Type / length:** Software · 60 min
- **Hook:** Your robot should stop if the wall is close OR the battery is low. How do chips make that choice?
- **Key ideas (title-slide tags):** Boolean logic, truth tables, if statements
- **Depths:** Starter: Human logic gates game with cards. Core: Build gates in CircuitVerse and fill truth tables. Advanced: Design a half adder and a safety interlock.
- **Kit per group of 2:** Laptop
- **Simulators to point to:** CircuitVerse (https://circuitverse.org/simulator); Circuit Lab
- **Draft content written:** use it, improve it, and draw it in the house style.

1. Title · "Did you know?": A modern processor contains billions of tiny logic gates, each switching billions of times a second.
2. Let's think · "Your robot should stop if the wall is close OR the battery is low. How does a chip make that choice?" · guesses: It thinks about it / A tiny switch decides / Logic gates! · story box "Decisions everywhere": A lift door closes only if no one is in the way AND the button was pressed. A car alarm sounds if a door opens OR the glass breaks. Every 'if' is built from logic. · Today: we learn AND, OR and NOT, build them in a simulator and turn a robot rule into logic and code.
3. Learning objectives · 1) Explain AND, OR and NOT with truth tables (Proof: I filled in all three truth tables) 2) Build gate circuits in a simulator (Proof: my CircuitVerse circuit matches my table) 3) Turn a robot rule into logic and code (Proof: I wrote the same rule as gates and as an if statement)
4. Video time · find a short video: "logic gates AND OR NOT explained for beginners" (about 5 min) · Watch for: What does an AND gate need to output 1? / How is OR different? / What does NOT do?
5. The three gates · **AND, OR, NOT** · [AND] Output 1 only if BOTH inputs are 1. / 'Seatbelt on AND door shut → car can start.' · [OR] Output 1 if EITHER input is 1. / 'Door opens OR glass breaks → alarm.' · [NOT] Flips it: 1 becomes 0, 0 becomes 1. / 'NOT dark → lamp off.'
6. Truth tables · **Every possible case** · [1 and 0] 1 = true, yes, HIGH, 5 V / 0 = false, no, LOW, 0 V · Tap-to-reveal: How many rows does a truth table with 3 inputs need? → 8. Each input doubles the rows: 2 × 2 × 2 = 8. · Code: A B | AND  OR ⏎ 0 0 |  0    0 ⏎ 0 1 |  0    1 ⏎ 1 0 |  0    1 ⏎ 1 1 |  1    1
7. Logic in code · **&&, || and !** · [Same idea, two forms] Hardware gates and if-statements are the same logic. Chips build your if-statements out of gates! · Code: bool wallClose = distance < 15; ⏎ bool batteryLow = volts < 6.5; ⏎ if (wallClose || batteryLow) stop();   // OR ⏎ if (armed && motion) alarm();          // AND ⏎ if (!dark) lampOff();                  // NOT
8. Deeper · **Building maths from logic** (advanced only) · XOR: 1 if inputs are different · Half adder: XOR gives the sum bit, AND gives the carry · Chain adders → a calculator. That's how a CPU adds. · Code: A B | SUM(XOR) CARRY(AND) ⏎ 1 1 |    0        1   → 1+1 = 10 in binary
9. Quick check · An AND gate has inputs 1 and 0. The output is... · options: 1 / 0 / 2 / It depends · answer: 0 (AND needs both inputs to be 1.)
10. Quick check · 'Stop if wall close OR battery low.' The wall isn't close, battery is low. Stop? · options: Yes / No · answer: Yes (OR only needs one input true.)
11. Real world · Lifts: Doors close only if the button is pressed AND nothing blocks the sensor. · Alarms: Any door OR window sensor triggers the siren. · Computers: Billions of gates add, compare and decide inside every chip.
12. Part 2 · Make it (divider)
13. Class game · **Human logic gates** · Two students are inputs: hand up = 1, hand down = 0. A third student is the gate with a card: AND, OR or NOT. The gate stands up (1) or sits (0) by the rule. Chain two gates: the output of one is an input of the next! · Big idea: A gate is a tiny rule that turns inputs into one output.
14. Build it · Our kit (per group)
15. Build step 1 · **Gates in CircuitVerse** · Open the simulator (no account needed to try). Add two Input switches, an AND gate and an Output LED. Flip the switches through all 4 combinations; fill the table. Repeat for OR and NOT.
16. Build step 2 · **A robot rule as gates** · Rule: the robot moves only if the start button is pressed AND NOT (wall close OR battery low). Build it in CircuitVerse with 3 switches. Test all 8 combinations. Which cases let the robot move?
17. Build step 3 · **The same rule in code** (core/advanced only) · Two buttons and a potentiometer in Circuit Lab. Write the rule with &&, || and !. Check it agrees with your gate circuit. · Code: bool go = start && !(wallClose || batteryLow); ⏎ digitalWrite(13, go);
18. Test like an engineer · **Truth table check** · columns: Start | Wall close | Battery low | Robot moves? · rows: 0 0 0 / 1 0 0 / 1 1 0 / 1 0 1 / 1 1 1
19. Level up! · XOR: Build XOR from AND, OR and NOT. · Half adder: Add two binary digits with XOR and AND. · Voting machine: Light turns on if at least 2 of 3 switches are on. · Think like an engineer: Why might engineers prefer a hardware gate to software for an emergency stop? · Boss level: Build a full adder and add two 2-bit numbers.
20. Objective check · Can I really do it? Prove it. (rate red/amber/green per objective)
21. Show what you know · AND needs both, OR needs either, NOT flips · Truth tables list every case · Robot rules are logic · &&, || and ! are gates in code · Gates build all computing · Exit ticket: Write a rule for a smart lamp using AND and NOT. · At home: Find one AND rule and one OR rule in your home (a microwave? a car?). · Next class: EF-05 Transistors and Relays: switching big loads.

**Teacher-guide draft:** Connects Boolean logic in hardware with if-statements in code, so students see decision-making as one idea at two levels. CircuitVerse needs no install and makes the truth tables concrete.

- Timing: 8 min Hook (Robot decision question and video); 12 min Learn (Gates, truth tables, code); 8 min Game (Human gates); 15 min Build 1 (CircuitVerse); 12 min Build 2 (Robot rule); 10 min Build 3 (Code version); 5 min Wrap (Exit ticket)
- Prep: Check CircuitVerse loads on the network; Print AND/OR/NOT cards for the game; Optional: 74HC08 chips to show a real gate
- Misconceptions: "OR means one or the other but not both" → In logic OR includes both (that's XOR otherwise).; "Logic is only for computers" → Every safety system and appliance uses it.
- Troubleshooting: CircuitVerse output stays off → Wire not connected to the gate's pin: drag until it snaps.; Code always moves → Brackets missing: !(a || b) is not the same as !a || b.
- Depths: starter: Human gates game with AND and OR only; picture-based rules. | core: Full lesson. | advanced: XOR, half and full adders; De Morgan's laws.
- Rubric: Logic (emerging: Knows AND/OR names; secure: Completes truth tables; extending: Simplifies and builds adders); Application (emerging: Follows a given rule; secure: Turns a rule into gates and code; extending: Designs own safety rules)
- Safety: None beyond usual laptop use.

### EF-05 · Transistors and Relays: Switching Big Loads

- **File:** `Presentations/Engineering Foundations/EF-05_Transistors_and_Relays_Switching_Big_Loads_Slides.pdf`
- **Type / length:** Hardware + software · 60 min
- **Hook:** An Arduino pin gives 20 mA. A motor wants 500 mA. How does a tiny pin boss a big motor?
- **Key ideas (title-slide tags):** transistor, relay, current limits, flyback diode
- **Depths:** Starter: Relay clicks a lamp on and off. Core: Transistor switch for a DC motor, simulated then built. Advanced: Measure current with the INA219 and size the transistor.
- **Kit per group of 2:** Arduino Uno + USB cable; Relay module (1-channel); DC hobby motor; 5 V DC fan; Breadboard (half size); Jumper wires M-M; 2N2222 or TIP120 transistor + 1N4007 diode (not in the lab yet)
- **Simulators to point to:** Falstad Circuit Simulator; Circuit Lab
- **Draft content written:** use it, improve it, and draw it in the house style.

1. Title · "Did you know?": The transistor was invented in 1947. Your phone has about 15 billion of them.
2. Let's think · "An Arduino pin gives 20 mA. A motor wants 500 mA. How can a tiny pin boss a big motor?" · guesses: Use a bigger Arduino / Connect the motor directly / Use an electronic switch! · story box "Burnt pins": Plug a motor straight into an Arduino pin and the pin can be damaged for ever. Robots always put a 'muscle' between the brain and the motor. · Today: we use a transistor and a relay as electronic switches so a small signal controls a big load safely.
3. Learning objectives · 1) Explain a transistor as an electronic switch (Proof: I can label base, collector and emitter and say what each does) 2) Drive a motor through a transistor or relay (Proof: my Arduino turns the motor on and off safely) 3) Explain the flyback diode (Proof: I can say why the diode protects the circuit)
4. Video time · find a short video: "transistor as a switch explained arduino motor" (about 6 min) · Watch for: Which leg is the 'control'? / Why can a small current control a big one? / What is a relay inside?
5. Electronic switches · **Two ways to switch big things** · [Transistor] No moving parts. A tiny current into the base lets a big current flow from collector to emitter. Fast and silent. · [Relay] A tiny electromagnet pulls a real metal switch closed. Click! Can switch mains-powered things, but slowly.
6. The transistor · **Base, collector, emitter** · Base: the control. Arduino pin → 1 kΩ resistor → base · Collector: connects to the motor's − side · Emitter: to ground · Base on → current flows through the motor · Tap-to-reveal: Why must the motor battery and the Arduino share GND? → The base current needs a return path. Without a common ground the transistor never sees the Arduino's signal. · Code: Arduino pin 9 ─1kΩ─ Base ⏎  Motor + ─ battery + ⏎  Motor − ─ Collector ⏎  Emitter ─ GND (shared!)
7. Protection · **The flyback diode** · When a motor or relay coil switches off, it kicks back a voltage spike. · The spike can kill the transistor · A diode across the motor (stripe to +) lets the spike circle safely · Relay modules have one built in · Note "Remember": Motor, relay, solenoid, pump: anything with a coil needs a flyback diode.
8. Deeper · **Choosing a transistor** (advanced only) · 2N2222: up to ~0.6 A, small motors · TIP120 (Darlington): up to ~5 A, bigger motors, gets warm · MOSFET (logic-level): best efficiency, cool running · Check the current with the INA219 and pick with a margin
9. Quick check · Which transistor leg does the Arduino connect to (through a resistor)? · options: Collector / Emitter / Base / None · answer: Base (The base is the control input.)
10. Quick check · Why put a diode across a motor? · options: To make it faster / To absorb the voltage spike when it switches off / To change direction / To light up · answer: To absorb the voltage spike when it switches off (Coils kick back a spike that can damage the transistor.)
11. Real world · Car electronics: A tiny computer signal switches big headlights and fans through relays and transistors. · Smart plugs: A relay inside lets a Wi-Fi chip switch a heater or lamp. · Motor drivers: The L298N is four transistors in a chip: an H-bridge.
12. Part 2 · Make it (divider)
13. Class game · **The tap and the pipe** · One student holds a garden hose (the big current). Another, the 'Arduino', can only tap a shoulder (tiny signal). Tap = open the tap; no tap = close it. The Arduino never carries the water itself. That's a transistor! · Big idea: A small effort on the control can open a big flow.
14. Build it · Our kit (per group)
15. Build step 1 · **Simulate the switch** · In Falstad open an NPN switch example (or build: battery, motor/lamp, NPN, base resistor). Toggle the base switch: watch the current dots. Remove the base resistor: what happens to the base current? Add a diode across the coil and switch off: compare the spike.
16. Build step 2 · **Relay clicks a lamp** · Relay module: VCC 5V, GND, IN → pin 7. Lamp (5 V LED lamp) + battery through the relay's COM and NO. Blink pin 7 every second: hear the click. Why do we use NO (normally open) for a lamp? · Code: void loop() { ⏎   digitalWrite(7, HIGH); delay(1000); ⏎   digitalWrite(7, LOW);  delay(1000); ⏎ }
17. Build step 3 · **Transistor drives a motor** (core/advanced only) · Build the motor circuit with 2N2222/TIP120, 1 kΩ base resistor and diode. Separate 4×AA for the motor, GND shared with the Arduino. PWM on pin 9 → speed control! Feel the transistor after 1 minute: warm? · Note "Check twice": Diode stripe goes to the motor + side.
18. Test like an engineer · **Switching tests** · columns: Test | Expected | Result · rows: Pin 7 HIGH Relay clicks, lamp on / PWM 128 on pin 9 Motor half speed / Unplug the shared GND Motor stops / Arduino pin current (meter) Less than 20 mA
19. Level up! · Smart fan: Temperature sensor turns the fan on through the transistor. · Night lamp: LDR + relay switches the lamp at dusk. · MOSFET: Swap in a logic-level MOSFET: is it cooler? · Think like an engineer: When would you choose a relay instead of a transistor? · Boss level: Measure motor current with the INA219 at different PWM values and graph it.
20. Objective check · Can I really do it? Prove it. (rate red/amber/green per objective)
21. Show what you know · Pins can't power motors directly · Transistors: small base current controls a big load · Relays: an electromagnet flips a real switch · Coils need a flyback diode · Grounds must be shared · Exit ticket: Draw a transistor motor circuit and label base, collector, emitter and diode. · At home: Listen for relay clicks at home (washing machine, microwave, car indicators). · Next class: EF-06 Powering Robots Safely.

**Teacher-guide draft:** Teaches the essential interface between controller and power: the electronic switch. Every robot motor, pump and lamp in later lessons depends on this. Emphasise shared grounds and flyback diodes; these two mistakes cause most broken boards.

- Timing: 8 min Hook (Burnt-pin story and video); 12 min Learn (Two switches, transistor legs, flyback); 4 min Game (Tap and pipe); 10 min Build 1 (Falstad simulation); 12 min Build 2 (Relay); 15 min Build 3 (Transistor motor); 9 min Wrap (Exit ticket)
- Prep: 2N2222 or TIP120, 1N4007 diodes, 1 kΩ resistors per pair; Relay modules tested; Separate battery packs for motors; Falstad open on the projector
- Misconceptions: "The transistor makes extra current" → It controls current from the battery; it doesn't create it.; "Any ground is fine" → The Arduino and motor battery must share GND.
- Troubleshooting: Motor never turns → No shared GND, or base resistor too big (use 1 kΩ).; Arduino resets when the motor starts → Motor noise: separate supply, add a 100 µF capacitor across the motor battery.; Transistor very hot → Wrong type for the current: use TIP120 or a MOSFET.
- Depths: starter: Relay module only: 'the Arduino flips a big switch'. Listen to the click. | core: Full lesson. | advanced: MOSFET comparison, current measurement and heat.
- Rubric: Concepts (emerging: Says 'switch'; secure: Explains base/collector/emitter and relay; extending: Chooses parts by current and explains diode physics); Build (emerging: Relay works with help; secure: Transistor motor circuit works; extending: PWM speed with measurements)
- Safety: Never switch mains voltage in class: low-voltage lamps only.; Transistors can get hot: touch carefully.

### EF-06 · Powering Robots Safely

- **File:** `Presentations/Engineering Foundations/EF-06_Powering_Robots_Safely_Slides.pdf`
- **Type / length:** Hardware · 60 min
- **Hook:** Robots die in competitions more from flat batteries and brownouts than from bad code.
- **Key ideas (title-slide tags):** capacity mAh, voltage regulation, brownout, battery safety
- **Depths:** Starter: Battery types show-and-tell and a safe-battery checklist. Core: Set a buck converter and power the robot car from it. Advanced: Log current with the INA219 and predict battery life.
- **Kit per group of 2:** 18650 cell + holder; TP4056 charger module; LM2596 buck converter; Current sensor INA219; Digital multimeter; 4xAA battery pack
- **Simulators to point to:** Circuit Construction Kit: DC
- **Draft content written:** use it, improve it, and draw it in the house style.

1. Title · "Did you know?": Many competition robots lose because the battery voltage dropped and the brain reset mid-run: a 'brownout'.
2. Let's think · "Your robot works on the desk but resets when the motors start. Why?" · guesses: Bad code / Broken motor / The battery can't keep up! · story box "The mystery reset": The robot drives for half a second, then the Arduino restarts. Again. And again. The code is perfect. The problem is power. · Today: we learn to choose batteries, make a steady 5 V with a buck converter, and work out how long a robot will run.
3. Learning objectives · 1) Choose a battery by voltage, capacity and current (Proof: I picked a battery for a robot and explained why) 2) Set a buck converter to a steady 5 V (Proof: my meter shows 5.0 V out) 3) Estimate a robot's run time (Proof: I calculated hours from mAh and current)
4. Video time · find a short video: "battery capacity mAh explained robotics" (about 6 min) · Watch for: What does mAh mean? / Why do lithium batteries need care? / What is a voltage regulator for?
5. Battery numbers · **Volts, mAh and amps** · [Voltage (V)] How hard it pushes. AA = 1.5 V, 18650 = 3.7 V. · [Capacity (mAh)] How much it holds. 2000 mAh = 2000 mA for 1 hour, or 200 mA for 10 hours. · [Max current (A)] How fast it can give it. Motors need lots at once.
6. Steady power · **Regulators and buck converters** · Battery voltage drops as it empties. Electronics want a steady voltage. · Buck converter (LM2596): turns 7–12 V into a steady 5 V efficiently · Set it with the little screw while measuring with a meter · Power motors from the battery, brains from the regulator · Tap-to-reveal: Why not power the motors from the Arduino's 5V pin? → That pin can only give a few hundred mA. Motors can need over an amp when starting: the voltage collapses and the Arduino resets (a brownout).
7. Run time · **How long will it last?** · [Measure, don't guess] The INA219 sensor measures current and voltage. Log it while the robot drives. · Code: hours = capacity (mAh) ÷ current (mA) ⏎ 2000 mAh ÷ 400 mA = 5 hours ⏎ (use 70–80% for real life: about 3.5–4 h)
8. Safety · **Lithium batteries: respect them** · [Do] Charge with a proper charger (TP4056); Store at room temperature; Check for swelling · [Never] Short the terminals; Puncture, crush or heat; Leave charging unattended · Note "If it swells": Stop using it, put it in a metal tin or sand and tell the teacher.
9. Quick check · A robot draws 500 mA from a 2500 mAh battery. Ideal run time? · options: 0.2 h / 5 h / 50 h / 2500 h · answer: 5 h (2500 ÷ 500 = 5 hours (a bit less in practice).)
10. Quick check · A buck converter is used to... · options: Charge the battery / Make a steady lower voltage / Make the motor reverse / Measure current · answer: Make a steady lower voltage (It steps a higher voltage down to a steady one.)
11. Real world · Phones: A charging chip and regulators keep the battery safe and the voltage steady. · Drones: Flight time is all about battery capacity versus motor current. · Mars rovers: Perseverance uses a nuclear power source because sunlight isn't enough.
12. Part 2 · Make it (divider)
13. Class game · **Battery budget** · Each team gets a 'battery' of 2000 points (mAh). Cards list parts with their current: motor 400, Arduino 50, LEDs 20, servo 150... Build a robot from cards. Divide to find run time. Which team's robot runs longest while still doing its job? · Big idea: Every part spends current; capacity is your budget.
14. Build it · Our kit (per group)
15. Build step 1 · **Set the buck converter** · Connect 4×AA (6 V) or a 9 V battery to the LM2596 IN+ and IN−. Meter on OUT+ and OUT− (V). Turn the screw slowly until it reads 5.0 V. Only then connect it to the Arduino's 5V pin. · Note "Careful": Turning the wrong way can give 9 V+ and destroy the board: always set it BEFORE connecting.
16. Build step 2 · **Measure power use** (core/advanced only) · Put the INA219 between battery and robot. Print voltage and current every 100 ms. Run: idle, LEDs on, motors on, motors stalled (briefly). Fill the table and calculate run time. · Code: #include <Adafruit_INA219.h> ⏎ Adafruit_INA219 ina; ⏎ void setup(){ Serial.begin(9600); ina.begin(); } ⏎ void loop(){ ⏎   Serial.print(ina.getBusVoltage_V()); Serial.print(' '); ⏎   Serial.println(ina.getCurrent_mA()); ⏎   delay(100); ⏎ }
17. Build step 3 · **Charge an 18650 safely** · Fit the cell in its holder (check + and −). Connect to the TP4056: B+ and B−. USB in: red light = charging, blue/green = full. Measure the cell: about 4.2 V when full, don't use below 3.0 V.
18. Test like an engineer · **Power budget** · columns: State | Voltage (V) | Current (mA) | Run time from 2000 mAh · rows: Idle / LEDs on / Motors driving / Motors stalled (1 s only)
19. Level up! · Battery gauge: Show battery % on the OLED from the voltage. · Low-battery mode: Slow down and flash an LED when voltage drops. · Solar top-up: Charge the 18650 from the small solar panel. · Think like an engineer: Why does the battery voltage drop more when the motors start? · Boss level: Log a full discharge and graph voltage against time.
20. Objective check · Can I really do it? Prove it. (rate red/amber/green per objective)
21. Show what you know · V, mAh and max current describe a battery · Regulators give a steady voltage · Power motors separately from the brain · Run time ≈ capacity ÷ current · Treat lithium cells with care · Exit ticket: Your robot draws 800 mA. Which battery lasts at least 2 hours? Show your working. · At home: Find the mAh of a phone or power bank at home. How long could it run a 500 mA robot? · Next class: EF-07 From Blocks to Code.

**Teacher-guide draft:** Power is the hidden cause of many robot failures. This lesson builds practical habits: separate motor and logic power, regulate voltage, measure current and handle lithium cells safely.

- Timing: 8 min Hook (Mystery reset story); 12 min Learn (Battery numbers, regulators, run time, safety); 6 min Game (Battery budget); 12 min Build 1 (Set buck converter); 15 min Build 2 (Measure power); 8 min Build 3 (Charge 18650); 9 min Wrap (Exit ticket)
- Prep: LM2596 modules pre-set to minimum; Meters checked; INA219 modules wired to headers; A metal tin with sand for damaged cells
- Misconceptions: "mAh is how strong the battery is" → It's how much it holds; voltage is the push and max current is how fast it can deliver.; "The Arduino 5V pin can power anything" → It's limited to a few hundred mA.
- Troubleshooting: Buck output doesn't change → Multi-turn screw: needs many turns.; INA219 reads 0 → I2C wiring (SDA A4, SCL A5) or library not installed.; TP4056 light never changes → Cell already full or reversed: check polarity.
- Depths: starter: Battery budget card game and run-time maths only. | core: Full lesson. | advanced: Discharge logging, internal resistance from voltage sag.
- Rubric: Battery knowledge (emerging: Names V and mAh; secure: Calculates run time; extending: Explains sag and internal resistance); Practical (emerging: Sets regulator with help; secure: Sets and measures independently; extending: Logs and graphs power data)
- Safety: Lithium cells: teacher-supervised charging only; never unattended.; Check for swelling before every lesson.; No shorting: keep cells in holders.


## Engineering Foundations · Programming Robots

### EF-07 · From Blocks to Code

- **File:** `Presentations/Engineering Foundations/EF-07_From_Blocks_to_Code_Slides.pdf`
- **Type / length:** Software · 60 min
- **Hook:** The same robot program, written three ways. Which one would you trust to drive?
- **Key ideas (title-slide tags):** sequence, loops, blocks vs text, syntax
- **Depths:** Starter: Drive the virtual robot through a course with blocks. Core: Blocks first, then switch to the generated code and change it. Advanced: Write the program in text only, with functions.
- **Kit per group of 2:** Laptop
- **Simulators to point to:** Open Roberta Lab (https://lab.open-roberta.org); VEXcode VR (https://vr.vex.com); Code Lab
- **Draft content written:** use it, improve it, and draw it in the house style.

1. Title · "Did you know?": Professional robot engineers still sketch programs as flowcharts and blocks before writing code.
2. Let's think · "The same robot program written three ways: blocks, Python, C++. Which would you trust to drive?" · guesses: Blocks: easy to read / Typed code: more powerful / They're the same program! · story box "One robot, three languages": Drive forward, turn right, repeat four times: a square. In blocks it's four pieces. In Python it's four lines. In C++ it's a few more. The robot doesn't care; it runs the same steps. · Today: we program a simulated robot with blocks, then read and change the same program as typed code.
3. Learning objectives · 1) Program a simulated robot with blocks (Proof: my robot finishes the course in the simulator) 2) Read the matching typed code (Proof: I can point to the code line for each block) 3) Change a program in typed code (Proof: I edited the code and the robot did something new)
4. Video time · find a short video: "block coding vs text coding explained" (about 4 min) · Watch for: What are blocks good at? / What can text code do that blocks can't? / Do programmers use both?
5. Big idea · **A program is a list of steps** · [Sequence] Steps in order: forward, turn, forward. · [Loop] Repeat steps: do it 4 times. · [Decision] If the sensor sees a wall, turn.
6. Same program · **Blocks and code side by side** · [Blocks] repeat 4 times /   ↳ drive forward 50 cm /   ↳ turn right 90° · Tap-to-reveal: What would change to draw a triangle instead? → Repeat 3 times and turn 120°. The outside angles of any shape add up to 360°. · Code: # Python (Open Roberta / VEXcode) ⏎ for i in range(4): ⏎     drive_forward(50)   # cm ⏎     turn_right(90)      # degrees ⏎  ⏎ // C++ (Arduino) ⏎ for (int i = 0; i < 4; i++) { ⏎   forward(50); ⏎   right(90); ⏎ }
7. Why typed code? · **Blocks are a ramp, not a wall** · [Blocks are great for] Starting fast, no typos; Seeing the structure; Younger learners · [Typed code wins for] Big programs; Precise maths and data; Every real robot and job · Note "Tip": Many tools show both at once. Build in blocks, then peek at the code.
8. Quick check · A 'loop' in a program... · options: Repeats steps / Draws a circle / Stops the robot / Charges the battery · answer: Repeats steps (Loops repeat a set of steps.)
9. Quick check · To draw a hexagon (6 sides), each turn should be... · options: 90° / 60° / 45° / 120° · answer: 60° (360 ÷ 6 = 60°.)
10. Real world · Factory robots: Programmed with teach pendants, flowcharts and code like Python. · Robot vacuums: Loops and decisions: drive, check bumper, turn. · Game characters: The same sequence, loop and decision building blocks.
11. Part 2 · Make it (divider)
12. Class game · **Program the teacher** · The teacher is the robot and does EXACTLY what the class says. Mission: walk to the door and open it. Students call out commands: 'step forward 3', 'turn left'... Watch the robot crash into things when instructions are vague! · Big idea: Computers do exactly what you say, not what you mean.
13. Build it · Our kit (per group)
14. Build step 1 · **Drive a square in blocks** · Open Open Roberta Lab → choose a robot with a simulation (e.g. EV3). Drag blocks: repeat 4 × (drive forward, turn right 90°). Run it in the simulation. Does it make a perfect square? Adjust the numbers.
15. Build step 2 · **Peek at the code** · Open the code view (Python or C++) for your program. Match each block to its line. Change the code (not the blocks): make it a triangle. Run again. Did the blocks change too?
16. Build step 3 · **Sensor challenge** (core/advanced only) · Open VEXcode VR → Wall Maze playground. Use the bumper or distance sensor: drive until a wall, then turn. Reach the exit. Switch to Python and add a counter for the turns.
17. Test like an engineer · **Shapes check** · columns: Shape | Repeat | Turn angle | Worked first time? · rows: Square 4 90° / Triangle / Hexagon / Star (5 points) 5 144°
18. Level up! · Name drawing: Draw your initial with the robot's pen. · Function: Make a 'square(size)' function and draw 3 sizes. · Spiral: Each side 5 cm longer than the last. · Think like an engineer: The simulated square is perfect; the real robot's isn't. Why? · Boss level: Solve the VEXcode maze using the right-hand wall rule in Python only.
19. Objective check · Can I really do it? Prove it. (rate red/amber/green per objective)
20. Show what you know · Programs use sequence, loops and decisions · Blocks and text code can be the same program · Simulators let us test safely · Typed code scales to real robots · Exit ticket: Write the steps (blocks or code) for a robot to draw a triangle. · At home: Write instructions for making a cup of tea for a robot that only does exactly what you say. · Next class: EF-08 Functions, Loops and Events.

**Teacher-guide draft:** Bridges block programming and typed code using free robot simulators, so the move to text feels like 'seeing what the blocks always were'. Works from very young (blocks only) to older students (Python only).

- Timing: 8 min Hook (Three-languages question); 10 min Learn (Sequence, loops, decisions; side-by-side code); 6 min Game (Program the teacher); 12 min Build 1 (Square in blocks); 10 min Build 2 (Peek at the code); 15 min Build 3 (Maze challenge); 9 min Wrap (Exit ticket)
- Prep: Test Open Roberta Lab and VEXcode VR on the network; Clear a path for 'program the teacher'
- Misconceptions: "Blocks are 'not real coding'" → They are the same logic; text is just more flexible.; "Simulation = reality" → Real motors slip and batteries vary: test on hardware too.
- Troubleshooting: Simulator won't load → Try a different browser; VEXcode VR needs WebGL.; Square is wonky → Turn angle or distance numbers; in real robots wheel slip.
- Depths: starter: Program the teacher + blocks only; floor arrows. | core: Full lesson. | advanced: Python only; functions and the maze with counters.
- Rubric: Programming concepts (emerging: Uses sequence; secure: Uses loops and decisions; extending: Uses functions and variables); Blocks to text (emerging: Runs blocks; secure: Maps blocks to code; extending: Writes text code independently)
- Safety: Clear floor space for the teacher-robot game.

### EF-08 · Functions, Loops and Events

- **File:** `Presentations/Engineering Foundations/EF-08_Functions_Loops_and_Events_Slides.pdf`
- **Type / length:** Software · 60 min
- **Hook:** Good robot code reads like a recipe. Bad robot code reads like a phone book.
- **Key ideas (title-slide tags):** functions, loops, events, millis()
- **Depths:** Starter: Robot dance with repeat blocks. Core: Refactor a long robot program into functions. Advanced: Event-driven program with millis() and no delay().
- **Kit per group of 2:** Laptop; Arduino Uno + USB cable
- **Simulators to point to:** Code Lab; Circuit Lab; GearsBot (https://gears.aposteriori.com.sg)
- **Draft content written:** use it, improve it, and draw it in the house style.

1. Title · "Did you know?": The software in a modern car has around 100 million lines of code, organised into thousands of functions.
2. Let's think · "Good robot code reads like a recipe. Bad robot code reads like a phone book. What's the difference?" · guesses: Fewer lines / Better names / Functions and loops! · story box "The 300-line robot": A team's robot code was one long list: forward, delay, turn, delay... 300 lines. When they needed to change the turning speed, they had to edit 40 places. They missed 3. · Today: we turn messy robot code into functions, use loops, and replace delay() with events using millis().
3. Learning objectives · 1) Break a task into functions (Proof: my robot program uses forward(), turnRight() and stopAll()) 2) Use loops instead of repeated lines (Proof: I shortened a program with a loop) 3) Run two things at once with millis() (Proof: my LED blinks while the button still works)
4. Video time · find a short video: "arduino millis instead of delay explained" (about 6 min) · Watch for: What does delay() stop? / How does millis() let two things happen? / Why use functions?
5. Functions · **Name it once, use it everywhere** · [Why?] Shorter, readable code; Fix a bug in one place; Reuse in the next project · Code: void forward(int speed) { ⏎   analogWrite(ENA, speed); analogWrite(ENB, speed); ⏎   digitalWrite(IN1, HIGH); digitalWrite(IN2, LOW); ⏎   digitalWrite(IN3, HIGH); digitalWrite(IN4, LOW); ⏎ } ⏎ // now the main program reads like English: ⏎ forward(150); delay(1000); turnRight(); stopAll();
6. The delay() problem · **A frozen robot can't see** · During `delay(1000)` the Arduino does NOTHING else: no sensors, no buttons. · A robot in delay() can drive into a wall · Solution: check the clock with millis() and act when enough time has passed · Tap-to-reveal: Why does millis() let two jobs run at once? → loop() keeps running very fast; each job checks 'is it my time yet?' and does a tiny bit. Nothing ever waits. · Code: unsigned long last = 0; ⏎ void loop() { ⏎   if (millis() - last >= 500) {   // every 500 ms ⏎     last = millis(); ⏎     toggleLED(); ⏎   } ⏎   checkBumper();                  // runs all the time! ⏎ }
7. Events · **React when something happens** · Polling: keep checking 'is the button pressed?' in loop() · Edge detection: act only when it changes from up to down · Interrupts: the hardware calls your function instantly (encoders, emergency stop)
8. Quick check · What does delay(2000) do? · options: Runs other code for 2 s / Pauses everything for 2 s / Speeds up the loop / Turns off the board · answer: Pauses everything for 2 s (delay blocks everything, which is why we use millis().)
9. Quick check · The main benefit of a function is... · options: It makes the robot faster / Code is written once and reused / It uses less battery / It's required by Arduino · answer: Code is written once and reused (Write once, fix once, reuse everywhere.)
10. Real world · Car software: Thousands of functions run on timers: check brakes every 10 ms, update the dashboard every 100 ms. · Games: A game loop updates characters, reads controls and draws the screen, never waiting. · Robot firmware: Motor control, sensors and radio all run 'at once' using timers and interrupts.
11. Part 2 · Make it (divider)
12. Class game · **The juggling chef** · One student is a chef with 3 tasks: stir every 5 s, flip every 10 s, answer the phone when it 'rings'. Round 1 ('delay chef'): they must wait out each timer, eyes closed. The phone rings and they miss it! Round 2 ('millis chef'): they glance at a clock and switch tasks. Nothing is missed. · Big idea: Don't wait: check the clock and do a little of each job.
13. Build it · Our kit (per group)
14. Build step 1 · **Refactor the robot** · Start from the long 'dance' program given by the teacher. Find repeated chunks. Make forward(), backward(), turnLeft(), turnRight(), stopAll(). Use a for loop for the repeated part. Is your program shorter? Does it still dance the same?
15. Build step 2 · **Blink without delay** · LED on pin 13, button on pin 2. Version A: blink with delay(1000). Press the button: how fast does it respond? Version B: blink with millis(). Press again. Add a second LED blinking at a different speed. · Code: unsigned long t1=0, t2=0; ⏎ void loop(){ ⏎   if (millis()-t1 >= 1000){ t1=millis(); flip(13); } ⏎   if (millis()-t2 >= 300) { t2=millis(); flip(12); } ⏎   if (digitalRead(2)==LOW) tone(8, 880); else noTone(8); ⏎ } ⏎ void flip(int p){ digitalWrite(p, !digitalRead(p)); }
16. Build step 3 · **Debug like a pro** (core/advanced only) · Add Serial.println() at the start of each function. Watch the order in the Serial Monitor. Use the Serial Plotter to graph a sensor while the robot runs.
17. Test like an engineer · **delay() versus millis()** · columns: Version | Button response time | Both LEDs at their own speed? | Notes · rows: delay() / millis()
18. Level up! · Library: Move your motor functions into their own tab (.h file). · State + timer: Robot drives 2 s, turns 1 s, repeat, all with millis(). · Interrupt: attachInterrupt on the button for an emergency stop. · Think like an engineer: Why is a delay() dangerous in a robot that drives near people? · Boss level: Write a tiny scheduler: a list of tasks with periods that loop() runs.
19. Objective check · Can I really do it? Prove it. (rate red/amber/green per objective)
20. Show what you know · Functions make code readable and reusable · Loops replace repeated lines · delay() freezes everything · millis() lets jobs share time · Interrupts react instantly · Exit ticket: Rewrite: `led on; delay(500); led off; delay(500);` using millis(). · At home: Write the 'functions' of your morning routine: wakeUp(), getDressed()... Which ones repeat? · Next class: EF-09 Wireless Control.

**Teacher-guide draft:** Code quality lesson that pays off in every later robot. The biggest practical shift is from delay() to millis(), without which robots can't sense while moving.

- Timing: 8 min Hook (300-line robot story); 12 min Learn (Functions, delay problem, events); 5 min Game (Juggling chef); 15 min Build 1 (Refactor); 15 min Build 2 (Blink without delay); 10 min Build 3 (Debugging); 5 min Wrap (Exit ticket)
- Prep: Write a deliberately long 'robot dance' program to hand out (60+ lines of repeated moves); A clock with a second hand for the juggling chef
- Misconceptions: "millis() makes things happen at the same instant" → It switches between jobs so fast it looks simultaneous.; "Functions make code run faster" → They make it easier to read and fix.
- Troubleshooting: Function 'not declared' → Typo in the name or it's used before it's defined in some editors: put functions above loop().; millis timing drifts → Use last += period instead of last = millis() for exact rhythm.; Variable overflow → Use unsigned long for time variables.
- Depths: starter: Juggling chef and a ready-made two-LED millis sketch: change the speeds. | core: Full lesson. | advanced: Interrupts, headers and a simple scheduler.
- Rubric: Structure (emerging: Uses given functions; secure: Writes own functions and loops; extending: Organises code into modules); Timing (emerging: Uses delay; secure: Uses millis for two tasks; extending: Uses interrupts or a scheduler)
- Safety: None beyond usual electronics care.

### EF-09 · Wireless Control: Bluetooth and Wi-Fi

- **File:** `Presentations/Engineering Foundations/EF-09_Wireless_Control_Bluetooth_and_Wi-Fi_Slides.pdf`
- **Type / length:** Hardware + software · 90 min
- **Hook:** Your phone in your pocket is the best remote control you will ever own.
- **Key ideas (title-slide tags):** Bluetooth, Wi-Fi, web server, HTTP
- **Depths:** Starter: Phone app turns an LED on and off. Core: ESP32 web remote with forward, back, left, right. Advanced: Add a speed slider and live sensor read-back.
- **Kit per group of 2:** ESP32 Dev Board + USB cable; LED 5 mm (assorted); Resistor 220 ohm; Bluetooth module HC-05; Android smartphone; Breadboard (half size); Jumper wires M-M
- **Simulators to point to:** Circuit Lab; Wokwi (https://wokwi.com)
- **Draft content written:** use it, improve it, and draw it in the house style.

1. Title · "Did you know?": The ESP32 has Wi-Fi and Bluetooth built in and costs less than a school lunch.
2. Let's think · "What's the best remote control you'll ever own?" · guesses: A games controller / A TV remote / Your phone! · story box "No wires, no app store": An ESP32 can host its own little website. Open it on any phone, tap a button, and the robot moves. No app to install, no cables. · Today: we compare Bluetooth and Wi-Fi, then make the ESP32 serve a web remote that controls an LED and a motor.
3. Learning objectives · 1) Explain Bluetooth versus Wi-Fi (Proof: I can say which suits a robot remote and why) 2) Host a web page on an ESP32 (Proof: my phone shows the ESP32's page) 3) Control an output from a phone (Proof: tapping a button changes the LED or motor)
4. Video time · find a short video: "ESP32 web server control LED explained" (about 6 min) · Watch for: What is an IP address? / What happens when you tap a button on the page? / Access point versus station mode?
5. Two radios · **Bluetooth or Wi-Fi?** · [Bluetooth] Short range (about 10 m); Pairs one device directly; Low power; Needs an app or Bluetooth terminal · [Wi-Fi] Longer range; Many devices at once; Uses more power; Works with any web browser
6. The web remote · **How a tap moves a robot** · The ESP32 makes its own Wi-Fi network (access point) · Your phone joins it and opens 192.168.4.1 · Each button is a link like /forward · The ESP32 sees /forward and runs forward() · Tap-to-reveal: Why doesn't this need the internet? → The phone talks directly to the ESP32's own network. It's a tiny private website that lives on the robot. · Code: server.on("/on",  [](){ digitalWrite(2, HIGH); page(); }); ⏎ server.on("/off", [](){ digitalWrite(2, LOW);  page(); });
7. Safety first · **Remote robots need a failsafe** · [If the signal drops...] The robot must stop, not keep driving. Stop if no command arrives for 1 second. · Note "Real world": Drones return home and cars brake when they lose their link: same idea.
8. Quick check · To control one robot from one phone with no router and no app, the simplest choice is... · options: ESP32 Wi-Fi access point + web page / Infrared remote / USB cable / SMS · answer: ESP32 Wi-Fi access point + web page (Any phone browser can open the ESP32's page.)
9. Quick check · A failsafe should make the robot... · options: Speed up / Stop when the signal is lost / Turn on its lights / Restart Wi-Fi · answer: Stop when the signal is lost (Stopping is the safe default.)
10. Real world · Smart homes: Lights, plugs and cameras are tiny Wi-Fi web servers. · Drones: Radio links with failsafes that bring the drone home. · Wearables: Bluetooth Low Energy sends heart rate to your phone all day.
11. Part 2 · Make it (divider)
12. Class game · **Packet relay** · The 'phone' writes commands on cards: F, B, L, R, S. 'Wi-Fi' students pass cards to the 'robot' student, who acts them out. Secretly drop a card: the robot must STOP if no card arrives in 3 seconds. · Big idea: Commands are messages; if they stop arriving, the robot must stop.
13. Build it · Our kit (per group)
14. Build step 1 · **ESP32 access point** · Select the ESP32 Dev Module board. Upload the code; open the Serial Monitor at 115200. On your phone join Wi-Fi 'BotBench-01' (use your team number). Open 192.168.4.1. Tap ON and OFF: the LED on GPIO 2 changes. · Code: #include <WiFi.h> ⏎ #include <WebServer.h> ⏎ WebServer server(80); ⏎ void page(){ server.send(200,"text/html", ⏎  "<a href=/on><button>ON</button></a> <a href=/off><button>OFF</button></a>"); } ⏎ void setup(){ ⏎   pinMode(2, OUTPUT); ⏎   WiFi.softAP("BotBench-01", "robots123"); ⏎   server.on("/", page); ⏎   server.on("/on", [](){ digitalWrite(2,HIGH); page(); }); ⏎   server.on("/off",[](){ digitalWrite(2,LOW);  page(); }); ⏎   server.begin(); ⏎ } ⏎ void loop(){ server.handleClient(); }
15. Build step 2 · **Robot remote** (core/advanced only) · Add routes /f, /b, /l, /r and /s that call your motor functions. Make big buttons with CSS so they're easy to tap. Failsafe: store the time of the last command; stop after 1 s of silence. Drive the robot round a course from your phone. · Note "ESP32 pins": Use pins like 26, 27, 14, 12 for the L298N inputs, and power the motors from the battery.
16. Build step 3 · **Bluetooth option** · HC-05 on an Uno: HC-05 TX → pin 10, pin 11 → HC-05 RX through a 1k/2k divider. Use SoftwareSerial and a Bluetooth terminal app. Send F/B/L/R/S letters.
17. Test like an engineer · **Range and failsafe test** · columns: Distance | Command works? | Delay noticed? | Failsafe stops it? · rows: 1 m / 5 m / 10 m (through a wall)
18. Level up! · Speed slider: Add an <input type=range> that sends the speed. · Read back: Show the distance sensor value on the page. · Name it: Each team's ESP32 gets a unique Wi-Fi name and password. · Think like an engineer: What could go wrong if every team used the same Wi-Fi name? · Boss level: Use WebSockets for instant, smooth control without reloading the page.
19. Objective check · Can I really do it? Prove it. (rate red/amber/green per objective)
20. Show what you know · Bluetooth: short-range pairing; Wi-Fi: networks and browsers · An ESP32 can host a web page · Each button is a route that runs code · Remote robots need failsafes · Exit ticket: Write the steps from 'tap a button' to 'the motor turns'. · At home: Find 3 devices at home that use Wi-Fi or Bluetooth. Which ones have a failsafe? · Next class: EF-10 Talking Chips.

**Teacher-guide draft:** Students build a phone-controlled robot with no app, using the ESP32's own access point. The key engineering habit is the communication failsafe.

- Timing: 8 min Hook (Phone remote question); 10 min Learn (Two radios, web remote, failsafe); 5 min Game (Packet relay); 15 min Build 1 (Access point LED); 20 min Build 2 (Robot remote); 10 min Build 3 (Bluetooth option); 7 min Wrap (Range test, exit ticket)
- Prep: ESP32 board package installed in the Arduino IDE; A unique Wi-Fi name per team to avoid clashes; Phones or school tablets, with the school's permission
- Misconceptions: "Wi-Fi means internet" → The ESP32 makes a local network; no internet needed.; "The phone controls the motor directly" → The phone sends a request; the ESP32's code decides what to do.
- Troubleshooting: Upload fails on ESP32 → Hold BOOT as the upload starts; check the board is 'ESP32 Dev Module'.; Phone joins but the page won't load → Turn off mobile data so the phone uses the ESP32 network.; Resets when motors start → Separate motor supply with a shared GND.
- Depths: starter: LED ON/OFF page only: the teacher uploads, children tap. | core: Full lesson. | advanced: WebSockets, speed sliders and sensor read-back.
- Rubric: Communication (emerging: Says 'wireless'; secure: Compares Bluetooth and Wi-Fi; extending: Explains routes, IP addresses and WebSockets); Build (emerging: LED page works; secure: Robot remote with failsafe; extending: Smooth control with feedback)
- Safety: Test remote robots in a clear area at low speed.; A failsafe is required before driving near people.

### EF-10 · Talking Chips: I2C, UART and SPI

- **File:** `Presentations/Engineering Foundations/EF-10_Talking_Chips_I2C_UART_and_SPI_Slides.pdf`
- **Type / length:** Software · 60 min
- **Hook:** A robot is a team of chips chatting. What language do they speak?
- **Key ideas (title-slide tags):** serial, I2C addresses, UART, protocols
- **Depths:** Starter: Pass-the-message game: serial versus parallel. Core: OLED and sensor on one I2C bus, scanned and used. Advanced: Two-board messaging protocol with a checksum.
- **Kit per group of 2:** Arduino Uno + USB cable; OLED 0.96 in I2C; MPU6050 IMU; Breadboard (half size); Jumper wires M-M
- **Simulators to point to:** Circuit Lab; Wokwi (https://wokwi.com)
- **Learning objectives:** 1) Explain serial communication 2) Connect two I2C devices on the same two wires 3) Send data between two boards over UART
- **Slides:** design them in the standard order (section 2), one objective slide or two per objective. No draft yet.


## Engineering Foundations · Design & Make

### EF-11 · CAD for Robots

- **File:** `Presentations/Engineering Foundations/EF-11_CAD_for_Robots_Slides.pdf`
- **Type / length:** Hardware + software · 90 min
- **Hook:** Every robot part you can hold started as a shape on a screen.
- **Key ideas (title-slide tags):** CAD, tolerance, STL, slicing
- **Depths:** Starter: Build a robot face from shapes in Tinkercad. Core: Design a sensor mount that fits the HC-SR04. Advanced: Parametric bracket in BlocksCAD with variables.
- **Kit per group of 2:** Laptop; 3D printer; PLA filament
- **Simulators to point to:** Tinkercad (https://www.tinkercad.com); BlocksCAD
- **Learning objectives:** 1) Model a robot part with basic shapes 2) Design for printing: holes, tolerances and supports 3) Export an STL and print it
- **Slides:** design them in the standard order (section 2), one objective slide or two per objective. No draft yet.

### EF-12 · Design Thinking and the Engineering Notebook

- **File:** `Presentations/Engineering Foundations/EF-12_Design_Thinking_and_the_Engineering_Notebook_Slides.pdf`
- **Type / length:** Unplugged · 60 min
- **Hook:** Great engineers write down what failed. That's the secret.
- **Key ideas (title-slide tags):** design process, requirements, iteration
- **Depths:** Starter: Draw a robot to help a grandparent. Core: Interview a user and write a design brief. Advanced: Decision matrix to choose between three designs.
- **Kit per group of 2:** Card / chart paper; Markers; Printed templates
- **Learning objectives:** 1) Use empathise, define, ideate, prototype, test 2) Keep an engineering notebook entry 3) Turn a user's problem into a design brief
- **Slides:** design them in the standard order (section 2), one objective slide or two per objective. No draft yet.


## Robotics · Mechanisms

### ROB-01 · Gears: Trading Speed for Strength

- **File:** `Presentations/Robotics/ROB-01_Gears_Trading_Speed_for_Strength_Slides.pdf`
- **Type / length:** Hardware + software · 60 min
- **Hook:** Why does a bicycle have gears, and why does a robot arm need them even more?
- **Key ideas (title-slide tags):** gear ratio, torque, speed
- **Depths:** Starter: Spin paper gears and count turns. Core: Gear simulator, then a motor and gears lifting a load. Advanced: Compound gear train with a calculated ratio, 3D printed.
- **Kit per group of 2:** DC hobby motor; 2xAA battery holder + batteries; Cardboard sheet; Split pins (paper fasteners); Plastic gear set (not in the lab yet)
- **Simulators to point to:** Gear Generator (https://geargenerator.com); BlocksCAD
- **Learning objectives:** 1) Explain gear ratio, speed and torque 2) Calculate the output speed of a gear train 3) Choose a gear ratio for a robot task
- **Slides:** design them in the standard order (section 2), one objective slide or two per objective. No draft yet.

### ROB-02 · Linkages that Walk and Grab

- **File:** `Presentations/Robotics/ROB-02_Linkages_that_Walk_and_Grab_Slides.pdf`
- **Type / length:** Hardware + software · 60 min
- **Hook:** With no motors in its legs, how does a Strandbeest walk along a beach?
- **Key ideas (title-slide tags):** linkage, pivot, coupler curve
- **Depths:** Starter: Make a cardboard grabber with split pins. Core: Design a four-bar linkage in MotionGen and build it. Advanced: Trace a coupler curve and design a walking leg.
- **Kit per group of 2:** Cardboard sheet; Split pins (paper fasteners); Ice cream sticks; Glue gun + glue sticks; Servo SG90
- **Simulators to point to:** MotionGen (https://motiongen.io)
- **Learning objectives:** 1) Name four-bar linkage parts 2) Predict a linkage's motion in a simulator 3) Build a cardboard linkage that grabs or walks
- **Slides:** design them in the standard order (section 2), one objective slide or two per objective. No draft yet.

### ROB-03 · Hydraulic Robot Arm

- **File:** `Presentations/Robotics/ROB-03_Hydraulic_Robot_Arm_Slides.pdf`
- **Type / length:** Hardware · 60 min
- **Hook:** Diggers lift tonnes with water, oil and a few pipes. Let's build a small one.
- **Key ideas (title-slide tags):** pressure, hydraulics, pneumatics, force
- **Depths:** Starter: One-syringe lifting arm. Core: Three-joint hydraulic arm that picks up a cup. Advanced: Calculate force from syringe sizes.
- **Kit per group of 2:** Cardboard sheet; Ice cream sticks; Glue gun + glue sticks; Water container; Syringes 10 ml and 20 ml + tubing (not in the lab yet)
- **Learning objectives:** 1) Explain how pressure moves through a fluid 2) Build a syringe-powered arm 3) Compare hydraulic, pneumatic and electric actuators
- **Slides:** design them in the standard order (section 2), one objective slide or two per objective. No draft yet.

### ROB-04 · Gripper Design Challenge

- **File:** `Presentations/Robotics/ROB-04_Gripper_Design_Challenge_Slides.pdf`
- **Type / length:** Hardware + software · 90 min
- **Hook:** Picking up an egg without breaking it is one of the hardest jobs in robotics.
- **Key ideas (title-slide tags):** end effector, grip force, testing
- **Depths:** Starter: Cardboard claw with one servo. Core: Parallel gripper, tested on 5 objects. Advanced: Soft-finger gripper and force-limited closing.
- **Kit per group of 2:** Servo SG90; Arduino Uno + USB cable; Cardboard sheet; Ice cream sticks; Glue gun + glue sticks; Jumper wires M-M
- **Simulators to point to:** Tinkercad (https://www.tinkercad.com); Circuit Lab
- **Learning objectives:** 1) Compare gripper types: claw, parallel, soft, suction 2) Design and build a servo gripper 3) Test grip on fragile and heavy objects
- **Slides:** design them in the standard order (section 2), one objective slide or two per objective. No draft yet.


## Robotics · Motors & Motion Control

### ROB-05 · Build and Wire a Robot Car

- **File:** `Presentations/Robotics/ROB-05_Build_and_Wire_a_Robot_Car_Slides.pdf`
- **Type / length:** Hardware · 90 min
- **Hook:** Two motors, one driver, one brain. Let's make it roll.
- **Key ideas (title-slide tags):** H-bridge, differential drive, motor direction
- **Depths:** Starter: Assemble and drive with ready-made code. Core: Wire and code forward, back, left, right as functions. Advanced: Add speed control and a calibration routine for straight driving.
- **Kit per group of 2:** 2WD robot chassis kit; L298N motor driver; Arduino Uno + USB cable; 4xAA battery pack; Jumper wires M-F; Screwdriver set
- **Simulators to point to:** Circuit Lab; GearsBot (https://gears.aposteriori.com.sg)
- **Learning objectives:** 1) Assemble a 2WD chassis 2) Wire motors through an L298N driver 3) Drive forward, back and turn in code
- **Slides:** design them in the standard order (section 2), one objective slide or two per objective. No draft yet.

### ROB-06 · Servos and Steppers: Moving Precisely

- **File:** `Presentations/Robotics/ROB-06_Servos_and_Steppers_Moving_Precisely_Slides.pdf`
- **Type / length:** Hardware + software · 60 min
- **Hook:** A DC motor spins. A servo points. A stepper counts. Which one draws a perfect circle?
- **Key ideas (title-slide tags):** servo PWM, steps per revolution, open-loop
- **Depths:** Starter: Servo pointer that shows the weather. Core: Servo sweep and stepper turns exactly one revolution. Advanced: Micro-stepping maths and acceleration.
- **Kit per group of 2:** Servo SG90; Stepper 28BYJ-48 + ULN2003; Arduino Uno + USB cable; Breadboard (half size); Jumper wires M-F
- **Simulators to point to:** Circuit Lab; Wokwi (https://wokwi.com)
- **Learning objectives:** 1) Compare DC, servo and stepper motors 2) Control a servo angle and a stepper step count 3) Pick the right motor for a job
- **Slides:** design them in the standard order (section 2), one objective slide or two per objective. No draft yet.

### ROB-07 · Encoders: How Far Did I Go?

- **File:** `Presentations/Robotics/ROB-07_Encoders_How_Far_Did_I_Go_Slides.pdf`
- **Type / length:** Hardware · 90 min
- **Hook:** Robots can't see their own wheels. So how do they know they drove 1 metre?
- **Key ideas (title-slide tags):** encoder, interrupts, odometry, circumference
- **Depths:** Starter: Count wheel turns by hand and with a sensor. Core: Encoder-counted 1 metre drive. Advanced: Speed from ticks per second and odometry for turning.
- **Kit per group of 2:** 2WD robot chassis kit; L298N motor driver; Arduino Uno + USB cable; IR speed sensor (LM393) + encoder discs (not in the lab yet)
- **Simulators to point to:** Circuit Lab; Code Lab
- **Learning objectives:** 1) Explain encoder ticks and wheel circumference 2) Count ticks with an interrupt 3) Drive an exact distance
- **Slides:** design them in the standard order (section 2), one objective slide or two per objective. No draft yet.

### ROB-08 · Feedback Control: On-Off versus Proportional

- **File:** `Presentations/Robotics/ROB-08_Feedback_Control_On-Off_versus_Proportional_Slides.pdf`
- **Type / length:** Hardware + software · 90 min
- **Hook:** Why does one line follower wiggle like a snake and another glide like a train?
- **Key ideas (title-slide tags):** feedback, error, proportional gain
- **Depths:** Starter: Human line follower game, then a simple follower. Core: Bang-bang versus proportional with error plotted. Advanced: Tune Kp on a test track and measure lap times.
- **Kit per group of 2:** 2WD robot chassis kit; L298N motor driver; Arduino Uno + USB cable; IR sensor module; 4xAA battery pack; Tape (paper + double-sided)
- **Simulators to point to:** GearsBot (https://gears.aposteriori.com.sg); Circuit Lab
- **Draft content written:** use it, improve it, and draw it in the house style.

1. Title · "Did you know?": The first feedback controller was a spinning-ball governor on steam engines, over 230 years ago.
2. Let's think · "Why does one line follower wiggle like a snake while another glides like a train?" · guesses: Better motors? / A faster Arduino? / Smarter steering! · story box "Two robots, one track": Both robots have the same motors, the same sensor and the same battery. One zig-zags and is slow. The other glides and wins the race. The only difference is a few lines of code. · Today: we build a line follower, watch it wiggle, then teach it to steer in proportion to how far off the line it is.
3. Learning objectives · 1) Explain open-loop and closed-loop control (Proof: I can name the sensor, the decision and the action in a loop) 2) Build a bang-bang line follower (Proof: my robot follows a curved line all the way round) 3) Upgrade it to proportional steering (Proof: I can show the error number and how it sets the steering)
4. Video time · find a short video: "feedback control loop explained for beginners" (about 6 min) · Watch for: What is the difference between open and closed loop? / Where is the sensor in the loop? / What happens if the controller reacts too strongly?
5. Big idea · **Open loop versus closed loop** · [Open loop: no checking] A toaster runs for 2 minutes whatever the bread looks like. A robot told 'drive 3 seconds' never checks where it ended up. · [Closed loop: measure and correct] Measure → compare with the goal → correct → measure again. Your hand on a hot tap does this without thinking. · Note "Key word": Feedback means the output is measured and fed back to change what happens next.
6. The error · **How far off am I?** · Every controller starts with one number: the error. · error = goal − what I measure · Error 0: perfect. Big error: big problem. · The sign tells the direction: left of the line or right of it. · Tap-to-reveal: The robot should be at 0 but reads +3. Which way should it steer? → Back towards the line, and harder than if it read +1. Bigger error, bigger correction: that's the whole idea of proportional control. · Code: error = target - reading; ⏎ // on the line:      error = 0 ⏎ // drifted left:     error > 0 ⏎ // drifted right:    error < 0
7. Controller 1 · **Bang-bang: full left or full right** · [The rule] If the sensor sees black, turn one way. If it sees white, turn the other way. Only two choices, always at full strength. · [What you'll see] It works!; But it zig-zags across the edge of the line; It is slow on curves and can fly off at speed
8. Controller 2 · **Proportional: steer as much as you're off** · Correction = Kp × error. Small error, gentle turn. Big error, sharp turn. · Kp is the gain: how strongly we react · Kp too small: lazy, drifts off on curves · Kp too big: wobbles like bang-bang again · Just right: smooth and fast · [Two motors, one formula] left speed = base + correction / right speed = base − correction · Note "Engineers say": Tuning Kp is the first job on almost every real robot.
9. Deeper · **Reading a response graph** (advanced only) · Plot the error over time from the Serial Plotter. · Overshoot: it shoots past the line · Oscillation: it keeps swinging side to side · Steady-state error: it settles, but not on the line · These three words describe every control system: drones, ovens, cruise control.
10. Quick check · A robot vacuum drives forward for 5 seconds and turns, without sensors. That is... · options: Closed-loop control / Open-loop control / Proportional control / Artificial intelligence · answer: Open-loop control (Nothing is measured, so nothing is corrected.)
11. Quick check · With proportional control, if the error doubles, the correction... · options: Stays the same / Halves / Doubles / Switches off · answer: Doubles (Correction = Kp × error, so it grows in proportion.)
12. Real world · Cruise control: Measures speed 50 times a second and adjusts the engine so you stay at 100 km/h uphill and down. · Drones: Gyros measure tilt hundreds of times a second; the motors correct before you even see a wobble. · Factory lines: Warehouse robots follow lines and floor codes with exactly this kind of steering.
13. Part 2 · Make it (divider)
14. Class game · **Human line follower** · One student is the robot, eyes closed. One is the sensor, one is the controller. Lay a curved tape line on the floor. Round 1 (bang-bang): the controller may only say 'LEFT!' or 'RIGHT!'. Round 2 (proportional): the controller says 'a tiny bit left', 'more left', 'sharp left'. Time both rounds. Which was faster and smoother? · Big idea: Big corrections for big mistakes, small ones for small mistakes. That's proportional control.
15. Build it · Our kit (per group) · tip: Use a 2 cm black electrical tape line on a white floor or chart paper. Curves gentler than a dinner plate work best at first.
16. Build step 1 · **Wire the sensor** · Mount the IR sensor at the front, 1 cm above the floor, pointing down. VCC to 5V, GND to GND, OUT to pin A0 (or D2 for a digital module). Open the Serial Monitor: print the reading over white and over black. Write down both numbers. The middle between them is your target. · Code: void setup() { ⏎   Serial.begin(9600); ⏎ } ⏎ void loop() { ⏎   int r = analogRead(A0); ⏎   Serial.println(r);   // white ~100, black ~800 ⏎   delay(50); ⏎ } · Note "Tip": A digital IR module only gives 0 or 1, so it can only do bang-bang. Use the analog pin for proportional control.
17. Build step 2 · **Bang-bang follower** · Follow the edge of the line, not the middle. If the reading is above the target (on black): turn right. Otherwise (on white): turn left. Test on the track. Count the wiggles on one lap. · Code: // L298N: ENA=5 IN1=7 IN2=8 | ENB=6 IN3=9 IN4=10 ⏎ void drive(int left, int right) { ⏎   digitalWrite(7, HIGH); digitalWrite(8, LOW); ⏎   digitalWrite(9, HIGH); digitalWrite(10, LOW); ⏎   analogWrite(5, left); analogWrite(6, right); ⏎ } ⏎ const int TARGET = 450; ⏎ void loop() { ⏎   int r = analogRead(A0); ⏎   if (r > TARGET) drive(150, 60);  // right ⏎   else            drive(60, 150);  // left ⏎ } · Note "Remember": Set pins 5–10 as OUTPUT in setup(). drive() is reused in step 3.
18. Build step 3 · **Proportional follower** · Work out `error = TARGET - r`. Set `correction = Kp * error` (start with Kp = 0.3). Left motor = base + correction, right = base − correction. Lap the track. Then try Kp = 0.1 and Kp = 1.0. Open the Serial Plotter and watch the error line. · Code: const int TARGET = 450, BASE = 120; ⏎ float Kp = 0.3; ⏎ void loop() { ⏎   int error = TARGET - analogRead(A0); ⏎   int c = Kp * error; ⏎   drive(constrain(BASE + c, 0, 255), ⏎         constrain(BASE - c, 0, 255)); ⏎   Serial.println(error); ⏎ }
19. Test like an engineer · **Kp tuning table** · columns: Controller | Kp | Lap time (s) | Wiggles | Stayed on line? · rows: Bang-bang – / Proportional 0.1 / Proportional 0.3 / Proportional 1.0
20. Level up! · Speed run: Raise BASE speed and re-tune Kp. What's your fastest clean lap? · Two sensors: Use two IR sensors; error = left − right. · Lost the line: If both sensors see white for 1 second, stop and search. · Smooth start: Ramp BASE up over the first second. · Think like an engineer: Why does the best Kp change when you change speed? · Boss level: Add the D term: correction = Kp·error + Kd·(error − lastError). Does it stop the wobble?
21. Objective check · Can I really do it? Prove it. (rate red/amber/green per objective)
22. Show what you know · Closed loop: measure, compare, correct, repeat · Error = target − reading · Bang-bang works but wiggles · Proportional steering: correction = Kp × error · Tuning Kp trades speed against stability · Exit ticket: Your robot wobbles a lot on the straight. Should you make Kp bigger or smaller? Why? · At home: Spot three feedback loops at home (hint: fridge, kettle, your own hand). · Next class: ROB-09 PID Tuning Lab: adding I and D.

**Teacher-guide draft:** Students meet closed-loop control by experience first (the human line follower), then build two controllers on the same robot and measure the difference. The key idea to land: the size of the correction should depend on the size of the error. Everything later (PID, balancing robots, drones) builds on this.

- Timing: 10 min Hook (Two-robot story and video); 10 min Learn (Open versus closed loop, the error, the two controllers); 6 min Game (Human line follower, two rounds); 10 min Build 1 (Wire and read the IR sensor); 15 min Build 2 (Bang-bang follower on the track); 20 min Build 3 (Proportional follower and the Kp table); 9 min Wrap (Results share, objective check, exit ticket)
- Prep: Lay 2–4 tracks with black tape on white chart paper; one gentle oval and one with a tight curve; Charge or replace car batteries: weak batteries ruin tuning results; Check each car drives straight with the same speed on both motors; Load the three code steps onto the teacher laptop to project; Open GearsBot line-following world on one laptop to demonstrate
- Misconceptions: "A faster Arduino makes a smoother robot" → The loop already runs hundreds of times a second; the rule matters, not the speed.; "Bigger Kp is always better" → Too big reacts to every tiny change and wobbles. Show it on the robot.; "The sensor tells you where the line is" → It only tells you how dark the floor is under it. We turn darkness into an error.
- Troubleshooting: Robot spins in circles → Motor wires swapped or left/right speeds swapped in drive().; Readings barely change between black and white → Sensor too high: move it to about 1 cm from the floor; shade it from sunlight.; Works on the oval, flies off the tight curve → Lower BASE speed or raise Kp a little.; Proportional robot goes the wrong way → Swap the sign: use r − TARGET, or swap + and − on the motors.; Inconsistent results → Batteries are going flat: check with a multimeter.
- Depths: starter: Skip the error maths: give the bang-bang code ready-made and let them change the turn speeds. Run the human line follower twice and talk about 'little turn' versus 'big turn'. Success: the car goes round the oval. | core: Full lesson as written, including the Kp table. | advanced: Add the response-graph slide and Serial Plotter analysis. Two-sensor error and the boss-level D term. Ask for a short write-up: best Kp, why, with the graph.
- Rubric: Explains feedback (emerging: Says the robot 'follows the line'; secure: Names sensor, decision and action in a loop; extending: Explains error sign and gain in their own words); Builds and tests (emerging: Bang-bang works with help; secure: Both controllers work; table filled; extending: Tunes Kp systematically and justifies the choice); Uses data (emerging: Records some times; secure: Compares lap times and wiggles; extending: Reads overshoot and oscillation from the plot)
- Safety: Keep cars on the floor or a low table edge with a barrier.; Batteries out when not testing; never leave AA packs in pockets.

### ROB-09 · PID Tuning Lab

- **File:** `Presentations/Robotics/ROB-09_PID_Tuning_Lab_Slides.pdf`
- **Type / length:** Hardware + software · 90 min
- **Hook:** The same three letters keep drones level, cars at speed and ovens at temperature.
- **Key ideas (title-slide tags):** PID, overshoot, settling time, tuning
- **Depths:** Starter: Balance a ruler on a finger: you are the controller. Core: Tune PID in a simulator, then on a fan or motor speed rig. Advanced: Ziegler-Nichols tuning and anti-windup.
- **Kit per group of 2:** Arduino Uno + USB cable; DC hobby motor; L298N motor driver; IR speed sensor (LM393) + encoder discs (not in the lab yet); Laptop
- **Simulators to point to:** Code Lab; PID Lab
- **Draft content written:** use it, improve it, and draw it in the house style.

1. Title · "Did you know?": A quadcopter's flight controller runs its PID loops about 1,000 times every second.
2. Let's think · "What do a drone, an oven and cruise control have in common?" · guesses: The same battery / The same chip / The same idea: PID! · story box "One idea everywhere": A drone holds level in the wind. An oven holds 180 °C. A car holds 100 km/h uphill. Each one measures, compares and corrects using a recipe called PID. · Today: we learn the three ingredients, P, I and D, tune them in the PID Lab, then tune a real motor.
3. Learning objectives · 1) Explain P, I and D in plain words (Proof: I can say what each one does with a real example) 2) Tune a PID loop using its response graph (Proof: my motor reaches the target with little overshoot) 3) Name overshoot, oscillation and steady-state error (Proof: I pointed them out on a graph)
4. Video time · find a short video: "PID controller explained simply animation" (about 7 min) · Watch for: What does each letter stand for? / What goes wrong with only P? / Why does D stop overshoot?
5. Recap · **Control starts with the error** · error = target − measurement. The controller turns the error into an action (motor power). · Big error → big action · Error crosses zero → we've arrived (or passed it!)
6. The three ingredients · **P, I and D in plain words** · [P · Present] Push in proportion to the error now. Fast, but often stops short or wobbles. · [I · Past] Add up errors over time. If the error won't go away, I slowly pushes harder. · [D · Future] Watch how fast the error is changing. Brake before you overshoot. · Code: output = Kp*error + Ki*sum + Kd*change
7. Reading graphs · **Four shapes to recognise** · [Too slow] Creeps towards the target. P too small. · [Overshoot] Shoots past, then comes back. Needs D (or less P). · [Oscillation] Keeps swinging. P too big, D too small. · [Steady-state error] Settles, but not on target. Needs I. · Note "Tuning recipe": 1) Raise P until it wobbles a little. 2) Add D until the wobble calms. 3) Add a little I to remove the last error.
8. Deeper · **Windup and sample time** (advanced only) · What real engineers worry about: · Integral windup: if the motor is held still, I keeps growing; when released it overshoots massively. Fix: clamp the sum. · Sample time: PID assumes a steady loop speed. Use millis() timing, not delay(). · Derivative kick: a sudden target change spikes D. Use the change in measurement instead of error.
9. Quick check · The motor settles at 50 rpm but the target is 60. Which term fixes this? · options: P / I / D / None · answer: I (I adds up the leftover error and pushes until it's gone.)
10. Quick check · The system shoots past the target and swings back and forth. A good first fix is... · options: More I / More D / Remove the sensor / Raise the target · answer: More D (D reacts to how fast the error changes and brakes the swing.)
11. Real world · Drones: Three PID loops (roll, pitch, yaw) keep a drone level many hundreds of times a second. · 3D printers: PID holds the hot end at exactly 200 °C so the plastic flows evenly. · Robot arms: Every joint motor has a PID loop to reach and hold its angle precisely.
12. Part 2 · Make it (divider)
13. Class game · **Be the controller** · Balance a ruler upright on your fingertip. You are a PID controller! Notice: you move more when it leans more (P). You move faster when it starts falling fast (D). Try with eyes closed for one second: no sensor, no control! · Big idea: P reacts to now, I remembers the past, D predicts the future.
14. Build it · Our kit (per group) · tip: Mount an encoder disc on one motor of a 2WD chassis held off the ground, or use a fan with the IR speed sensor. Spinning freely is easiest to tune first.
15. Build step 1 · **Tune in the PID Lab** · Motor speed: start with P only. Press 'Change the target'. Does it reach it? Add I a little at a time until the error disappears. Switch to Balancing robot. P only: what happens? Add D until it stands still. Press 'Push it!' Record your best values in the table.
16. Build step 2 · **PID on the real motor** · Measure speed from encoder ticks every 100 ms. Start with Kp only. Change the target from 60 to 120 rpm with the Serial Monitor. Watch the Serial Plotter: target and speed. Add Ki, then Kd, following the tuning recipe. · Code: float Kp=1.0, Ki=0.2, Kd=0.05, sum=0, last=0; ⏎ int target = 60;           // rpm ⏎ void loop() { ⏎   float rpm = readRPM();     // from encoder ticks ⏎   float e = target - rpm; ⏎   sum = constrain(sum + e*0.1, -200, 200); ⏎   float d = (e - last) / 0.1;  last = e; ⏎   int pwm = constrain(Kp*e + Ki*sum + Kd*d, 0, 255); ⏎   analogWrite(5, pwm); ⏎   Serial.print(target); Serial.print(' '); ⏎   Serial.println(rpm); ⏎   delay(100); ⏎ } · Note "readRPM()": Counts encoder ticks in an interrupt since last time, then converts: ticks ÷ slots per turn × 600.
17. Build step 3 · **Plot it in Python** (advanced only) · Simulate a motor: speed += 0.1 × (gain × power − speed). Run your PID for 200 steps and store the speeds. Plot target and speed with matplotlib. Measure overshoot (%) and settling time.
18. Test like an engineer · **Tuning log** · columns: Kp | Ki | Kd | Reaches target? | Overshoot | Wobbles? · rows: 1.0 0 0 / 3.0 0 0 / 3.0 0 0.1 / 3.0 0.3 0.1 / (your best)
19. Level up! · Load test: Press a finger lightly on the wheel. Does PID hold the speed? · Two wheels: Run PID on both motors so the robot drives perfectly straight. · Position: Control the wheel's angle instead of its speed. · Think like an engineer: Why might the best values for the bare motor be wrong once the robot is on the floor? · Boss level: Add anti-windup and test by holding the wheel still for 3 seconds, then letting go.
20. Objective check · Can I really do it? Prove it. (rate red/amber/green per objective)
21. Show what you know · PID = Present, Past, Future · P pushes, I fixes leftover error, D brakes · Graphs show overshoot, oscillation and steady-state error · Tune P, then D, then a little I · PID runs drones, ovens, printers and robot arms · Exit ticket: Sketch a response graph with overshoot. Which term would you add to reduce it? · At home: Watch a lift arriving at a floor. Does it slow before stopping? That's control! · Next class: ROB-10 Balancing Robot: PID that keeps a robot upright.

**Teacher-guide draft:** Builds on ROB-08 (proportional control). Students meet the full PID controller first in our PID Lab simulator, where nothing can break and the response graph is instant, then on a real motor with an encoder. The skill to build is reading response graphs and changing one gain at a time.

- Timing: 8 min Hook (Drone/oven/car question and video); 12 min Learn (P, I, D and the four graph shapes); 6 min Game (Ruler balancing); 15 min Build 1 (PID Lab tuning); 20 min Build 2 (Real motor tuning with the plotter); 10 min Test (Tuning log); 9 min Wrap (Objective check, exit ticket)
- Prep: Open rai/sims/pid.html on every laptop (Simulators → PID Lab); Fit IR speed sensors and encoder discs to motors; test tick counting; Charge batteries: speed changes with battery voltage; Have the Serial Plotter demo ready on the teacher laptop
- Misconceptions: "More gain is always better" → Too much P or I causes oscillation; show it in the PID Lab.; "D makes it faster" → D mostly slows and steadies the response; it brakes.; "I is needed everywhere" → Many systems work with PD only; I is for leftover error.
- Troubleshooting: Speed reading jumps around → Too few encoder slots or too short a sample: use 100 ms windows and average.; Motor never starts at low PWM → Motors have a dead zone: add a minimum PWM (e.g. 60) when the output is above 0.; Gains that worked yesterday fail today → Battery voltage changed: retune or use a regulated supply.; Huge overshoot after holding the wheel → Integral windup: clamp the sum (already in the code).
- Depths: starter: Ruler game plus the PID Lab only: 'make the robot stand up' challenge with the sliders. Use words, not letters: push / remember / brake. | core: Full lesson with the real motor. | advanced: Python simulation with measured overshoot and settling time. Windup and derivative-kick discussion; implement both fixes.
- Rubric: Explains PID (emerging: Names the three letters; secure: Explains each term with an example; extending: Explains windup and sampling issues); Tunes systematically (emerging: Random changes; secure: One change at a time, logged; extending: Uses a method and justifies final gains); Reads graphs (emerging: Says 'good' or 'bad'; secure: Names overshoot/oscillation/steady error; extending: Measures them numerically)
- Safety: Keep fingers and hair away from spinning wheels; test with the wheels off the ground.; Disconnect batteries when changing wiring.

### ROB-10 · Balancing Robot

- **File:** `Presentations/Robotics/ROB-10_Balancing_Robot_Slides.pdf`
- **Type / length:** Hardware + software · 120 min
- **Hook:** Segways stay upright by falling forward and catching themselves 100 times a second.
- **Key ideas (title-slide tags):** inverted pendulum, sensor fusion, PID
- **Depths:** Starter: Balance a broom on your hand and spot the pattern. Core: Simulated pendulum, then the real robot with a given PID. Advanced: Tune the robot and add remote steering.
- **Kit per group of 2:** MPU6050 IMU; 2WD robot chassis kit; L298N motor driver; Arduino Uno + USB cable; 18650 cell + holder
- **Simulators to point to:** Code Lab; PID Lab
- **Learning objectives:** 1) Read tilt from the MPU6050 with a complementary filter 2) Balance an inverted pendulum in simulation 3) Build and tune a two-wheel balancing robot
- **Slides:** design them in the standard order (section 2), one objective slide or two per objective. No draft yet.


## Robotics · Robot Arms

### ROB-11 · Robot Arms: Joints and Workspace

- **File:** `Presentations/Robotics/ROB-11_Robot_Arms_Joints_and_Workspace_Slides.pdf`
- **Type / length:** Hardware + software · 60 min
- **Hook:** Your arm has 7 degrees of freedom. A factory robot has 6. What can't it do that you can?
- **Key ideas (title-slide tags):** degrees of freedom, joints, workspace
- **Depths:** Starter: Find the joints in your own arm. Core: Two-servo arm with two knobs and a reach map. Advanced: Add a base rotation and a gripper (4 DOF).
- **Kit per group of 2:** Servo SG90; Potentiometer 10k; Arduino Uno + USB cable; Cardboard sheet; Ice cream sticks; Glue gun + glue sticks
- **Simulators to point to:** Circuit Lab; Code Lab
- **Learning objectives:** 1) Count degrees of freedom 2) Map the workspace a 2-joint arm can reach 3) Build a 2-servo arm and control it with knobs
- **Slides:** design them in the standard order (section 2), one objective slide or two per objective. No draft yet.

### ROB-12 · Forward Kinematics

- **File:** `Presentations/Robotics/ROB-12_Forward_Kinematics_Slides.pdf`
- **Type / length:** Software · 60 min
- **Hook:** If the shoulder turns 30° and the elbow 45°, where is the hand?
- **Key ideas (title-slide tags):** trigonometry, forward kinematics, coordinates
- **Depths:** Starter: Draw arm poses with a protractor. Core: Python function for the tip position, plotted. Advanced: Animate the arm and draw its whole workspace.
- **Kit per group of 2:** Laptop
- **Simulators to point to:** Code Lab
- **Learning objectives:** 1) Use sine and cosine to find a point on a circle 2) Compute where a 2-link arm's tip is 3) Plot the arm in Python
- **Slides:** design them in the standard order (section 2), one objective slide or two per objective. No draft yet.

### ROB-13 · Inverse Kinematics: Point and Reach

- **File:** `Presentations/Robotics/ROB-13_Inverse_Kinematics_Point_and_Reach_Slides.pdf`
- **Type / length:** Hardware + software · 90 min
- **Hook:** Telling a robot 'touch that cup' means working kinematics backwards.
- **Key ideas (title-slide tags):** inverse kinematics, cosine rule, multiple solutions
- **Depths:** Starter: Reach-the-target game with arm cards. Core: IK in Code Lab, then on the servo arm. Advanced: Straight-line path by solving IK at many points.
- **Kit per group of 2:** Servo SG90; Arduino Uno + USB cable; Cardboard sheet; Laptop
- **Simulators to point to:** Code Lab; Circuit Lab
- **Learning objectives:** 1) Explain forward versus inverse kinematics 2) Solve 2-link IK with the cosine rule 3) Make the servo arm reach a clicked point
- **Slides:** design them in the standard order (section 2), one objective slide or two per objective. No draft yet.

### ROB-14 · Teach-and-Replay Robot Arm

- **File:** `Presentations/Robotics/ROB-14_Teach-and-Replay_Robot_Arm_Slides.pdf`
- **Type / length:** Hardware · 90 min
- **Hook:** Factory robots learn a job by being shown it once. Let's do the same.
- **Key ideas (title-slide tags):** arrays, teach pendant, interpolation
- **Depths:** Starter: Record 3 poses and replay them. Core: Record a pick-and-place routine with a button. Advanced: Smooth replay with interpolation and speed control.
- **Kit per group of 2:** Servo SG90; Potentiometer 10k; Push button; Arduino Uno + USB cable; Breadboard (half size); Jumper wires M-M
- **Simulators to point to:** Circuit Lab
- **Learning objectives:** 1) Record joint angles into an array 2) Replay a recorded motion smoothly 3) Explain how industry programs robots by demonstration
- **Slides:** design them in the standard order (section 2), one objective slide or two per objective. No draft yet.


## Robotics · Navigation & Autonomy

### ROB-15 · Algorithms on a Grid

- **File:** `Presentations/Robotics/ROB-15_Algorithms_on_a_Grid_Slides.pdf`
- **Type / length:** Unplugged + software · 60 min
- **Hook:** Before a robot moves, it plans. Plans are just very clear instructions.
- **Key ideas (title-slide tags):** algorithm, sequence, loop, condition
- **Depths:** Starter: Floor grid game: one child is the robot. Core: Blockly Games Maze levels and a paper maze robot. Advanced: Write the wall-follower rule and prove when it fails.
- **Kit per group of 2:** Printed templates; Tape (paper + double-sided); Laptop
- **Simulators to point to:** Blockly Games (https://blockly.games); Code.org (https://code.org/learn)
- **Learning objectives:** 1) Write step-by-step instructions for a robot on a grid 2) Use loops and conditions to solve mazes 3) Debug a plan that goes wrong
- **Slides:** design them in the standard order (section 2), one objective slide or two per objective. No draft yet.

### ROB-16 · Obstacle Avoidance Behaviours

- **File:** `Presentations/Robotics/ROB-16_Obstacle_Avoidance_Behaviours_Slides.pdf`
- **Type / length:** Hardware + software · 90 min
- **Hook:** A robot vacuum never memorises your house. How does it still clean every room?
- **Key ideas (title-slide tags):** reactive behaviour, scanning, coverage
- **Depths:** Starter: Stop and turn when the wall is close. Core: Scan with a servo and turn to the most open side. Advanced: Coverage test: how much of the floor does each strategy reach?.
- **Kit per group of 2:** 2WD robot chassis kit; L298N motor driver; Ultrasonic sensor HC-SR04; Servo SG90; Arduino Uno + USB cable; 4xAA battery pack
- **Simulators to point to:** GearsBot (https://gears.aposteriori.com.sg); VEXcode VR (https://vr.vex.com); Circuit Lab
- **Learning objectives:** 1) Program an avoid-and-turn behaviour 2) Test it in a simulator, then on the real car 3) Compare random, wall-follow and scanning strategies
- **Slides:** design them in the standard order (section 2), one objective slide or two per objective. No draft yet.

### ROB-17 · Robot State Machines

- **File:** `Presentations/Robotics/ROB-17_Robot_State_Machines_Slides.pdf`
- **Type / length:** Hardware + software · 60 min
- **Hook:** A robot that searches, chases and returns is really three small robots taking turns.
- **Key ideas (title-slide tags):** finite state machine, transitions, behaviour design
- **Depths:** Starter: Traffic light as states, acted out. Core: Search, approach, return robot as a state machine. Advanced: Add timeouts and a failsafe state.
- **Kit per group of 2:** 2WD robot chassis kit; Ultrasonic sensor HC-SR04; IR sensor module; Arduino Uno + USB cable
- **Simulators to point to:** Circuit Lab; GearsBot (https://gears.aposteriori.com.sg)
- **Learning objectives:** 1) Draw a state diagram 2) Code states with switch and transitions 3) Debug by printing the current state
- **Slides:** design them in the standard order (section 2), one objective slide or two per objective. No draft yet.

### ROB-18 · Path Planning: BFS and A*

- **File:** `Presentations/Robotics/ROB-18_Path_Planning_BFS_and_A*_Slides.pdf`
- **Type / length:** Software · 60 min
- **Hook:** Google Maps finds your route in a blink. Robots use the same ideas.
- **Key ideas (title-slide tags):** graph, BFS, A*, heuristic
- **Depths:** Starter: Shortest path race on a paper grid. Core: Visualiser, then BFS in Code Lab. Advanced: A* with a Manhattan heuristic and weighted cells.
- **Kit per group of 2:** Laptop; Printed templates
- **Simulators to point to:** PathFinding Visualiser; Code Lab
- **Learning objectives:** 1) Represent a map as a grid graph 2) Trace breadth-first search and A* by hand 3) Compare them in a visualiser and in Python
- **Slides:** design them in the standard order (section 2), one objective slide or two per objective. No draft yet.

### ROB-19 · Robot Simulation

- **File:** `Presentations/Robotics/ROB-19_Robot_Simulation_Slides.pdf`
- **Type / length:** Software · 90 min
- **Hook:** NASA drives its rovers on a computer thousands of times before Mars.
- **Key ideas (title-slide tags):** simulation, reality gap, testing
- **Depths:** Starter: VEXcode VR challenges with blocks. Core: GearsBot or Open Roberta in Python. Advanced: Webots world with sensors, compared with real data.
- **Kit per group of 2:** Laptop
- **Simulators to point to:** VEXcode VR (https://vr.vex.com); GearsBot (https://gears.aposteriori.com.sg); Open Roberta Lab (https://lab.open-roberta.org); Webots (https://cyberbotics.com)
- **Learning objectives:** 1) Explain why engineers simulate first 2) Program a virtual robot through a challenge course 3) Move the same logic to the real robot
- **Slides:** design them in the standard order (section 2), one objective slide or two per objective. No draft yet.

### ROB-20 · How Drones Fly

- **File:** `Presentations/Robotics/ROB-20_How_Drones_Fly_Slides.pdf`
- **Type / length:** Software · 60 min
- **Hook:** Four propellers, no rudder, no wings. How does a drone turn left?
- **Key ideas (title-slide tags):** thrust, roll, pitch, yaw, stability
- **Depths:** Starter: Paper helicopter and the propeller game. Core: Quadcopter motion explained with a simulator. Advanced: Model one axis with PID in Code Lab.
- **Kit per group of 2:** Laptop; Card / chart paper; Scissors
- **Simulators to point to:** Code Lab; PID Lab
- **Learning objectives:** 1) Explain thrust, roll, pitch and yaw 2) Show how changing propeller speeds steers a quadcopter 3) Explain why drones need fast feedback control
- **Slides:** design them in the standard order (section 2), one objective slide or two per objective. No draft yet.


## Artificial Intelligence · Machine Learning Foundations

### AI-01 · What Is AI? Rules versus Learning

- **File:** `Presentations/Artificial Intelligence/AI-01_What_Is_AI_Rules_versus_Learning_Slides.pdf`
- **Type / length:** Unplugged + software · 60 min
- **Hook:** Write rules to spot a cat. Now write rules for every cat on Earth. Stuck?
- **Key ideas (title-slide tags):** AI, rules, examples, patterns
- **Depths:** Starter: Smart or not smart? sorting game. Core: Human classifier game, then AI for Oceans. Advanced: Write rules for a task, then show where they break.
- **Kit per group of 2:** Printed templates; Laptop
- **Simulators to point to:** AI for Oceans (https://code.org/oceans); Quick, Draw! (https://quickdraw.withgoogle.com)
- **Learning objectives:** 1) Tell rule-based programs from learning systems 2) Find AI in everyday apps 3) Explain that AI learns patterns from examples
- **Slides:** design them in the standard order (section 2), one objective slide or two per objective. No draft yet.

### AI-02 · Training Data: Teach a Computer to See

- **File:** `Presentations/Artificial Intelligence/AI-02_Training_Data_Teach_a_Computer_to_See_Slides.pdf`
- **Type / length:** Software · 60 min
- **Hook:** The computer has never seen a banana. In 10 minutes it will spot one.
- **Key ideas (title-slide tags):** training data, labels, classes, testing
- **Depths:** Starter: Fruit or vegetable with Teachable Machine. Core: Three-class model, tested on new people and lighting. Advanced: Measure accuracy before and after improving the data.
- **Kit per group of 2:** Laptop; Webcam
- **Simulators to point to:** Teachable Machine (https://teachablemachine.withgoogle.com); Machine Learning for Kids (https://machinelearningforkids.co.uk)
- **Draft content written:** use it, improve it, and draw it in the house style.

1. Title · "Did you know?": The photo app on your phone learned to recognise cats from millions of pictures that people had labelled by hand.
2. Let's think · "How can a computer that has never seen a banana learn to spot one?" · guesses: Someone types the rules / It searches the internet / We show it examples! · story box "Try writing the rule": "A banana is yellow and curved." But some are green. Some are brown. Some are straight. Some are in a bowl with lemons. Rules break fast. Examples don't. · Today: we teach a computer to tell objects apart by showing it examples, then we try to trick it.
3. Learning objectives · 1) Collect and label training examples (Proof: my model has at least 3 classes with 30+ pictures each) 2) Train a model and test it fairly (Proof: I tested it on things it never saw while training) 3) Explain why varied examples make better AI (Proof: I can show one mistake and how more data fixed it)
4. Video time · find a short video: "how does machine learning work explained simply" (about 5 min) · Watch for: What does 'training' mean? / Why does the computer need so many examples? / What happens when the examples are all the same?
5. Big idea · **Rules versus learning** · [Normal programming] You write the rules. / IF yellow AND curved THEN banana. · [Machine learning] You give examples with answers (labels). / The computer finds the rules itself. · Note "Key words": Training data = the examples. Label = the right answer for each one. Model = what the computer learns.
6. How it learns · **Classes, examples and a guess** · We make classes: groups with a name, like banana, apple, nothing. · Each class gets lots of example pictures · Training: the computer looks for patterns that separate the classes · Afterwards it gives a confidence for each class: 92% banana, 6% apple, 2% nothing · Tap-to-reveal: Why do we need a 'nothing' class? → Without it the model must pick banana or apple even when you show it your empty hand. A 'nothing' (background) class lets it say 'I see neither'.
7. The secret · **Good data beats a clever computer** · [Bad training data] All photos on the same desk; Always held the same way; Only one person's hand · [Good training data] Different backgrounds and lighting; Turned, near, far, half hidden; Different people holding it · Note "Remember": The model only knows what you show it. If every banana photo has a blue desk behind it, it might learn blue desk, not banana!
8. Deeper · **Training, testing and overfitting** (advanced only) · Keep some pictures out of training. Test on those. · Training accuracy: how well it does on pictures it studied · Test accuracy: how well it does on new pictures (the honest score) · Overfitting: great on training, poor on new data. It memorised instead of learning.
9. Quick check · What is a label in machine learning? · options: A sticker on the laptop / The right answer for an example / The name of the program / A type of camera · answer: The right answer for an example (Each training example comes with its label, like 'banana'.)
10. Quick check · Your model works for you but not for your friend. The best fix is... · options: Train longer with the same pictures / Buy a faster computer / Add training pictures of your friend and others / Delete a class · answer: Add training pictures of your friend and others (More varied examples help the model work for everyone.)
11. Real world · Phone photos: Search your gallery for 'dog' or 'beach': a model trained on labelled photos finds them. · Medical scans: Models trained on thousands of labelled X-rays help doctors spot problems early. · Recycling plants: Cameras sort plastic, paper and metal on fast conveyor belts.
12. Part 2 · Make it (divider)
13. Class game · **Human classifier** · One student is the 'AI' and steps outside. The class picks a secret rule (e.g. 'things with wheels') and shows the AI 6 labelled picture cards: YES or NO. Now show 4 new cards. The AI guesses YES or NO. Count how many were right. Then show 6 more varied examples and test again. Did more examples help? · Big idea: A learner is only as good as its examples. More, varied examples = better guesses.
14. Build it · Our kit (per group) · tip: Use real fruit, school objects or picture cards. Three very different objects are easiest at first; similar ones (orange vs lemon) make a good challenge.
15. Build step 1 · **Collect your examples** · Open Teachable Machine → Image Project → Standard. Rename the classes: e.g. banana, apple, nothing. Hold the webcam button and record 30+ pictures per class. Move the object: turn it, near and far, different hands. For 'nothing', record the empty background and your empty hands. · Note "Tip": Hold the record button and slowly turn the object. You get 30 different pictures in a few seconds.
16. Build step 2 · **Train and test** · Click Train Model. Keep the tab open while it trains. Look at the preview: hold up each object and read the confidence bars. Try to trick it: a different angle, bad lighting, a similar object. Write down every mistake in the test table.
17. Build step 3 · **Fix it with better data** · Pick the worst mistake from your table. Add 15–20 new pictures of exactly that situation. Train again and repeat the same test. Did the score go up? Write the new result.
18. Build step 4 · **Test like a scientist** (advanced only) · Collect 10 test photos per class that are never used for training. Count correct answers before and after improving the data. Work out accuracy = correct ÷ total × 100. Which class is most often confused with which?
19. Test like an engineer · **Trick-the-model table** · columns: What I showed | Model said | Confidence | Right? · rows: Object far away / Object turned upside down / Dim light / My friend holding it / A similar object
20. Level up! · New class: Add a 4th class. Does it confuse the others? · Hands only: Train rock, paper and scissors hand shapes. · Game time: Export the model to Machine Learning for Kids and use it in a Scratch game. · Fair test: Ask 5 people not in your group to test it. Score it. · Think like an engineer: Your model is 100% on your own pictures. Why might that NOT mean it's good? · Boss level: Make the model say 'not sure' when no class is above 70%, and show a message.
21. Think about it · **Your pictures are data** · Questions to ask: Who can see the pictures I record?; Is it OK to train on photos of someone without asking?; What if a model only works for people who look like the ones in the training data? · Our class rules: Ask before recording anyone's face or hands; Teachable Machine runs in the browser: delete projects you don't need; Test on lots of different people before saying it works
22. Objective check · Can I really do it? Prove it. (rate red/amber/green per objective)
23. Show what you know · Machine learning learns from labelled examples · Classes, labels, training and confidence · Varied data makes a model work in more places · Test on new examples, not the ones it trained on · Ask permission before using people's pictures · Exit ticket: Your model thinks every red thing is an apple. What would you do to fix it? · At home: Find two apps at home that recognise pictures or faces. Ask: what examples might they have learned from? · Next class: AI-03 Nearest Neighbours: how a computer compares a new example with old ones.

**Teacher-guide draft:** Students experience the core idea of machine learning: the program learns from labelled examples instead of written rules. The lesson's real lesson is about data quality: students build a model, find where it fails, and fix it with better data, not more code. Works with any age: young students stop after the trick-the-model table; older students compute test accuracy.

- Timing: 8 min Hook (Banana rule-writing challenge and video); 12 min Learn (Rules vs learning, classes, good data); 8 min Game (Human classifier); 12 min Build 1 (Collect examples); 10 min Build 2 (Train and test with the table); 10 min Build 3 (Fix with better data, re-test); 10 min Wrap (Data-ethics talk, objective check, exit ticket)
- Prep: Test Teachable Machine on the school network and webcams the day before; Collect 3 sets of objects per pair (fruit, stationery, toys) or print picture cards; Plan a quiet background area if lighting in the room is poor; Print the trick-the-model table (or use the slide); Check the school policy on recording students; use hands and objects if faces are not allowed
- Misconceptions: "The computer understands what a banana is" → It only learns patterns of pixels that went with the label. Show it a yellow pencil to prove it.; "More training time fixes everything" → Training longer on the same pictures doesn't help with new situations; new varied data does.; "100% in the preview means it works" → Only on what you tested. Test on other people, places and lighting.; "AI is always right" → It always answers, even when it shouldn't. That's why we look at confidence.
- Troubleshooting: Webcam not found → Allow camera access in the browser bar; close other apps using the camera.; Training is very slow → Use fewer pictures (30 per class) or close other tabs; older laptops take 1–2 minutes.; Model always says the same class → One class has far more pictures: balance the numbers.; Works on one laptop, not another → Lighting and camera differ: add pictures from both places.
- Depths: starter: Teacher drives the laptop; children hold objects and shout out the guesses. Two classes only (e.g. teddy vs nothing). Focus on 'it learns from examples' and 'trick it'. | core: Full lesson: three classes, test table, fix with better data. | advanced: Add the held-out test set and accuracy calculation. Discuss overfitting with the training versus test score. Write up which classes get confused and why.
- Rubric: Understands learning from data (emerging: Says the computer 'looks at pictures'; secure: Explains classes, labels and training; extending: Explains why varied data and a test set matter); Builds and tests (emerging: Model trained with help; secure: 3 classes, test table completed; extending: Measures accuracy before/after fixing data); Responsible use (emerging: Follows rules when reminded; secure: Asks permission, explains privacy; extending: Explains how biased data causes unfair AI)
- Safety: Never record faces without permission; hands and objects are enough.; Delete projects at the end unless the class decides to keep them.

### AI-03 · Nearest Neighbours: Learning by Comparing

- **File:** `Presentations/Artificial Intelligence/AI-03_Nearest_Neighbours_Learning_by_Comparing_Slides.pdf`
- **Type / length:** Software · 60 min
- **Hook:** New student: 'Which club should I join?' Ask the 3 students most like them.
- **Key ideas (title-slide tags):** features, distance, k-nearest neighbours
- **Depths:** Starter: Sticker graph of the class, then guess a newcomer. Core: k-NN on sensor readings in Code Lab. Advanced: Distance measures, scaling and accuracy for different k.
- **Kit per group of 2:** Laptop
- **Simulators to point to:** Code Lab
- **Learning objectives:** 1) Plot data with two features 2) Classify a new point by its nearest neighbours 3) Choose k and see what changes
- **Slides:** design them in the standard order (section 2), one objective slide or two per objective. No draft yet.

### AI-04 · Decision Trees

- **File:** `Presentations/Artificial Intelligence/AI-04_Decision_Trees_Slides.pdf`
- **Type / length:** Software · 60 min
- **Hook:** Twenty questions is a decision tree. So is a doctor's checklist.
- **Key ideas (title-slide tags):** decision tree, splits, overfitting
- **Depths:** Starter: Guess Who? with yes/no questions. Core: Hand-built tree on plant data, then in Code Lab. Advanced: Gini impurity and overfitting with depth.
- **Kit per group of 2:** Laptop; Printed templates
- **Simulators to point to:** Code Lab; Machine Learning for Kids (https://machinelearningforkids.co.uk)
- **Learning objectives:** 1) Build a decision tree by hand 2) Pick the question that splits data best 3) Train and read a tree in Python
- **Slides:** design them in the standard order (section 2), one objective slide or two per objective. No draft yet.

### AI-05 · Neural Networks

- **File:** `Presentations/Artificial Intelligence/AI-05_Neural_Networks_Slides.pdf`
- **Type / length:** Software · 90 min
- **Hook:** One fake neuron can add. A million of them can recognise your face.
- **Key ideas (title-slide tags):** neuron, weights, layers, training
- **Depths:** Starter: Human neuron game with weight cards. Core: Perceptron learns AND, then Playground experiments. Advanced: Why XOR needs a hidden layer, with backpropagation sketched.
- **Kit per group of 2:** Laptop
- **Simulators to point to:** TensorFlow Playground; Code Lab
- **Learning objectives:** 1) Explain a neuron: inputs, weights, output 2) Train a perceptron in Code Lab 3) Explore layers and training in TensorFlow Playground
- **Slides:** design them in the standard order (section 2), one objective slide or two per objective. No draft yet.

### AI-06 · Is My AI Any Good? Testing Models

- **File:** `Presentations/Artificial Intelligence/AI-06_Is_My_AI_Any_Good_Testing_Models_Slides.pdf`
- **Type / length:** Software · 60 min
- **Hook:** A model that's 99% accurate can still be useless. How?
- **Key ideas (title-slide tags):** test set, confusion matrix, overfitting, class imbalance
- **Depths:** Starter: Test the class model on surprise examples. Core: Confusion matrix for a Teachable Machine model. Advanced: Precision, recall and why accuracy lies.
- **Kit per group of 2:** Laptop; Webcam
- **Simulators to point to:** Teachable Machine (https://teachablemachine.withgoogle.com); Code Lab
- **Learning objectives:** 1) Split data into training and test sets 2) Read a confusion matrix 3) Spot overfitting and unbalanced data
- **Slides:** design them in the standard order (section 2), one objective slide or two per objective. No draft yet.


## Artificial Intelligence · Seeing, Hearing & Language

### AI-07 · How Computers See: Convolutional Networks

- **File:** `Presentations/Artificial Intelligence/AI-07_How_Computers_See_Convolutional_Networks_Slides.pdf`
- **Type / length:** Software · 90 min
- **Hook:** To a computer a photo is a grid of numbers. How does it find a dog in there?
- **Key ideas (title-slide tags):** pixels, convolution, feature maps, CNN
- **Depths:** Starter: Pixel art: a picture made of numbers. Core: CNN Explainer tour, then Teachable Machine. Advanced: Train a CNN in Colab and inspect its filters.
- **Kit per group of 2:** Laptop
- **Simulators to point to:** CNN Explainer; Teachable Machine (https://teachablemachine.withgoogle.com); Google Colab (https://colab.research.google.com)
- **Learning objectives:** 1) Explain pixels, channels and filters 2) Watch a CNN classify an image layer by layer 3) Train a small image classifier
- **Slides:** design them in the standard order (section 2), one objective slide or two per objective. No draft yet.

### AI-08 · Sound and Speech Recognition

- **File:** `Presentations/Artificial Intelligence/AI-08_Sound_and_Speech_Recognition_Slides.pdf`
- **Type / length:** Software · 60 min
- **Hook:** 'Hey Google' works in a noisy kitchen. How does it hear its name?
- **Key ideas (title-slide tags):** waveform, spectrogram, wake word
- **Depths:** Starter: Clap, whistle, quiet model. Core: Voice command model with 4 words. Advanced: Spectrogram features and false triggers.
- **Kit per group of 2:** Laptop
- **Simulators to point to:** Teachable Machine (https://teachablemachine.withgoogle.com); Code Lab
- **Learning objectives:** 1) Explain sound as waves and spectrograms 2) Train an audio model 3) Explain wake words and privacy
- **Slides:** design them in the standard order (section 2), one objective slide or two per objective. No draft yet.

### AI-09 · Language AI: Chatbots and Sentiment

- **File:** `Presentations/Artificial Intelligence/AI-09_Language_AI_Chatbots_and_Sentiment_Slides.pdf`
- **Type / length:** Software · 60 min
- **Hook:** Can a computer tell if a review is angry, without understanding a single word?
- **Key ideas (title-slide tags):** natural language, sentiment, bag of words
- **Depths:** Starter: Happy or sad sentence sorting. Core: Sentiment classifier in Code Lab from word counts. Advanced: Bag of words versus word order and sarcasm.
- **Kit per group of 2:** Laptop
- **Simulators to point to:** Code Lab; Machine Learning for Kids (https://machinelearningforkids.co.uk)
- **Learning objectives:** 1) Build a keyword chatbot 2) Classify text as positive or negative 3) Explain the limits of word counting
- **Slides:** design them in the standard order (section 2), one objective slide or two per objective. No draft yet.

### AI-10 · Reinforcement Learning: Learning by Reward

- **File:** `Presentations/Artificial Intelligence/AI-10_Reinforcement_Learning_Learning_by_Reward_Slides.pdf`
- **Type / length:** Software · 90 min
- **Hook:** Nobody tells a puppy the rules. It learns from treats. Robots can too.
- **Key ideas (title-slide tags):** agent, reward, Q-learning, exploration
- **Depths:** Starter: Hot and cold treasure game. Core: Grid-world demo, then Q-learning in Code Lab. Advanced: Exploration versus exploitation and reward design.
- **Kit per group of 2:** Laptop
- **Simulators to point to:** REINFORCEjs Grid World (https://cs.stanford.edu/people/karpathy/reinforcejs/gridworld_td.html); Code Lab
- **Learning objectives:** 1) Explain agent, state, action and reward 2) Watch a grid-world agent learn 3) Code a simple Q-learning robot in Code Lab
- **Slides:** design them in the standard order (section 2), one objective slide or two per objective. No draft yet.


## Artificial Intelligence · Generative AI

### AI-11 · How Large Language Models Work

- **File:** `Presentations/Artificial Intelligence/AI-11_How_Large_Language_Models_Work_Slides.pdf`
- **Type / length:** Software · 60 min
- **Hook:** ChatGPT has never been to school. So how does it write essays?
- **Key ideas (title-slide tags):** language model, tokens, probability, temperature
- **Depths:** Starter: Finish-the-sentence game. Core: Word-chain generator in Code Lab. Advanced: Attention explored in Transformer Explainer.
- **Kit per group of 2:** Laptop
- **Simulators to point to:** Code Lab; Transformer Explainer
- **Draft content written:** use it, improve it, and draw it in the house style.

1. Title · "Did you know?": Large language models are trained on so much text that a person reading non-stop would need thousands of years to finish it.
2. Let's think · "ChatGPT has never been to school. So how does it write essays?" · guesses: A person types the answers / It copies from websites / It predicts the next word! · story box "Finish the sentence": "The cat sat on the ___." You said 'mat' without thinking. You've read that pattern many times. A language model does the same thing, billions of times, very fast. · Today: we discover that chatbots work by predicting the next word, and build a tiny text generator ourselves.
3. Learning objectives · 1) Explain next-word prediction (Proof: I can show how a model picks the next word from probabilities) 2) Explain tokens and temperature (Proof: I changed temperature and described what happened) 3) Build a tiny text generator (Proof: my Code Lab program writes new sentences from a text)
4. Video time · find a short video: "how do large language models work simple explanation" (about 7 min) · Watch for: What does the model predict? / Where does its knowledge come from? / Why can it be confidently wrong?
5. Big idea · **A very well-read guesser** · A language model has one job: given some words, guess the next one. Repeat that, and you get sentences, essays, even code. · It learned by reading huge amounts of text · It stores patterns, not a list of facts · It writes one word (token) at a time
6. Probabilities · **Picking the next word** · ["The robot picked up the ..."] box   41% / ball  22% / cup   18% / elephant  0.1% · [Temperature] Low (0.2): always picks the top word. Safe, boring. / High (1.2): picks unlikely words more often. Creative, sometimes nonsense. · Tap-to-reveal: Why does the same question give a different answer each time? → The model samples from the probabilities instead of always taking the top word. Temperature controls how adventurous that sampling is.
7. Tokens · **Words are cut into pieces** · Models don't read whole words. They read tokens: common words, or pieces of rarer ones. · "robot" → 1 token · "unbelievable" → un · believ · able · Numbers and Urdu or Arabic words often take more tokens · Each token becomes a list of numbers the model can compute with · Note "Fun fact": That's why models are sometimes bad at counting letters in a word: they never saw the letters, only tokens!
8. Why it gets things wrong · **Fluent is not the same as true** · [Hallucinations] If the most likely-sounding answer is false, the model may say it anyway, confidently. · [So we...] Check important facts in trusted sources; Ask for sources and verify them; Never paste private information
9. Deeper · **Attention: which words matter?** (advanced only) · Transformers use attention: each word looks at the other words to decide what they mean together. · "The robot dropped the cup because it was heavy": attention links 'it' to 'cup' · Stack many attention layers → rich understanding of context · Explore it live in Transformer Explainer (GPT-2)
10. Quick check · What is the main thing a language model does? · options: Searches Google / Predicts the next token / Looks up a dictionary / Asks a human · answer: Predicts the next token (Everything it writes comes from repeated next-token prediction.)
11. Quick check · Raising the temperature makes answers... · options: More random and creative / Always correct / Shorter / In a different language · answer: More random and creative (Higher temperature picks less likely words more often.)
12. Real world · Chatbots: Study Buddy, ChatGPT and Gemini all generate replies token by token. · Phone keyboards: The word suggestions above your keyboard are a small next-word model. · Translation: Modern translators predict the next word in the other language.
13. Part 2 · Make it (divider)
14. Class game · **Human language model** · Sit in a circle. The teacher says: 'Once upon a time, a robot'. Each student adds ONE word that could come next. Round 2: before choosing, roll a die. On a 6 you must pick a surprising word (high temperature!). Compare the two stories. Which was more sensible? Which was more fun? · Big idea: Each word is chosen from what usually comes next. Different choices give different stories.
15. Build it · Our kit (per group)
16. Build step 1 · **Count what comes next** · Open Code Lab → Python. Paste the code. Put any text you like in `text` (a story, a song, school rules). Run it: `nxt` stores which words follow which. Print `nxt['the']`. What usually follows 'the'? · Code: import random ⏎ text = """the robot saw the ball. the robot ⏎ picked up the ball. the cat saw the robot.""" ⏎ words = text.replace('.', ' .').split() ⏎ nxt = {} ⏎ for a, b in zip(words, words[1:]): ⏎     nxt.setdefault(a, []).append(b) ⏎ print(nxt['the'])
17. Build step 2 · **Generate new sentences** · Add the generator below the first code. Run it several times. Is it the same each time? Give it a much longer text. Does the writing get better? Find one sentence it made that was never in the text. · Code: w = 'the' ⏎ out = [w] ⏎ for i in range(15): ⏎     if w not in nxt: break ⏎     w = random.choice(nxt[w])   # sample! ⏎     out.append(w) ⏎ print(' '.join(out)) · Note "This is a Markov chain": It only looks back ONE word. Real models look back thousands of tokens, and that's the difference.
18. Build step 3 · **Temperature in the real thing** (core/advanced only) · Open Transformer Explainer. Type a sentence start and watch the next-token probabilities. Move temperature low, then high. Describe the change. Find a prompt where the top token is surprising.
19. Test like an engineer · **Generator experiments** · columns: Training text | How long? | Sample sentence it made | Makes sense? (1–5) · rows: 3 sentences short / A whole story long / School rules
20. Level up! · Two-word memory: Use pairs of words as the key: (a, b) → next. Is it better? · Probabilities: Count and print the % for each next word. · Style copy: Train on poems by one poet. Does it 'sound' like them? · Think like an engineer: Our generator never says something that wasn't in its text as a word pair. Why can real LLMs say new things, and also new false things? · Boss level: Add a temperature setting to your generator: at low temperature always pick the most common next word.
21. Think about it · **Using chatbots well** · Great for: Explaining an idea in another way; Brainstorming and getting unstuck; Checking your code's error message · Be careful with: Facts, dates and numbers: check them; Copying answers instead of learning; Personal information: never share it
22. Objective check · Can I really do it? Prove it. (rate red/amber/green per objective)
23. Show what you know · Language models predict the next token · They learned patterns from huge amounts of text · Temperature controls randomness · Fluent is not the same as true: check facts · I built a Markov-chain text generator · Exit ticket: In one sentence: why can a chatbot sound sure and still be wrong? · At home: Type the start of a sentence on a phone keyboard and keep tapping the middle suggestion. Read your 'AI story' to someone. · Next class: AI-12 Prompting and Fact-Checking: getting good, honest answers from AI.

**Teacher-guide draft:** Demystifies chatbots: they are next-token predictors trained on huge text. The circle game and the Markov-chain build give students a concrete, correct mental model, which is the foundation for responsible AI use (fact-checking, privacy) in AI-12. The advanced tier adds tokens and attention through Transformer Explainer.

- Timing: 8 min Hook (Finish-the-sentence and video); 14 min Learn (Next-word guessing, probabilities, tokens, hallucinations); 8 min Game (Human language model); 12 min Build 1 (Count what comes next); 12 min Build 2 (Generate sentences); 10 min Build 3 (Transformer Explainer); 6 min Wrap (Using chatbots well, exit ticket)
- Prep: Test Code Lab Python on the laptops (first run downloads Python once); Prepare 2–3 longer texts students can paste (a public-domain story, school rules); Open Transformer Explainer once to check it loads on the school network (it is large); A die for the circle game
- Misconceptions: "Chatbots look things up on the internet" → Many don't; they generate from patterns learned in training (some can also search, but the writing is still prediction).; "The AI understands like a person" → It models language patterns extremely well; whether that is 'understanding' is debated. It has no experiences or goals of its own.; "If it's written well, it's true" → Fluency comes from patterns; truth needs checking.
- Troubleshooting: KeyError: 'the' → The training text doesn't contain that word in lowercase: use .lower() on the text.; Generator stops early → It reached a word with no followers (the last word): that's what the `break` does.; Transformer Explainer is slow → It downloads a small GPT-2 model; demonstrate on the teacher laptop instead.
- Depths: starter: Circle game plus phone-keyboard story as a whole class. Teacher runs the generator on the projector; students choose the training text. Key message: 'it guesses the next word'. | core: Full lesson as written. | advanced: Attention slide and Transformer Explainer exploration. Two-word memory and temperature implementation. Discuss training data, copyright and bias.
- Rubric: Explains how LLMs work (emerging: 'It knows things'; secure: Explains next-token prediction and training text; extending: Explains tokens, temperature and attention); Programming (emerging: Runs the given code; secure: Changes text and explains output; extending: Extends the model (2-word memory, temperature)); Responsible use (emerging: Repeats the rule; secure: Explains why to fact-check; extending: Discusses hallucination, privacy and bias)
- Safety: Students under 13 should only use AI chat tools the school has approved (Study Buddy).; Never paste personal information into an AI tool.

### AI-12 · Prompting and Fact-Checking

- **File:** `Presentations/Artificial Intelligence/AI-12_Prompting_and_Fact-Checking_Slides.pdf`
- **Type / length:** Software · 60 min
- **Hook:** The AI answered instantly, confidently, and completely wrong.
- **Key ideas (title-slide tags):** prompting, hallucination, verification
- **Depths:** Starter: Teacher-led: good question, bad question. Core: Prompt lab with Study Buddy and a fact-check sheet. Advanced: Compare prompts systematically and score answers.
- **Kit per group of 2:** Laptop
- **Simulators to point to:** Study Buddy
- **Learning objectives:** 1) Write clear prompts with role, task and format 2) Spot hallucinations and check facts 3) Use AI as a study partner, not a copy machine
- **Slides:** design them in the standard order (section 2), one objective slide or two per objective. No draft yet.

### AI-13 · Generative Images and Deepfakes

- **File:** `Presentations/Artificial Intelligence/AI-13_Generative_Images_and_Deepfakes_Slides.pdf`
- **Type / length:** Software · 60 min
- **Hook:** Real photo or AI-made? Most adults guess wrong half the time.
- **Key ideas (title-slide tags):** generative model, deepfake, media literacy
- **Depths:** Starter: Real or AI? picture game. Core: How GANs and diffusion work, with GAN Lab. Advanced: Detection limits and watermarking.
- **Kit per group of 2:** Laptop
- **Simulators to point to:** GAN Lab; Quick, Draw! (https://quickdraw.withgoogle.com)
- **Learning objectives:** 1) Explain how image generators learn from pictures 2) Spot clues of AI-made images 3) Discuss consent and misinformation
- **Slides:** design them in the standard order (section 2), one objective slide or two per objective. No draft yet.


## Artificial Intelligence · AI & Society

### AI-14 · AI Ethics: Fair, Safe and Private

- **File:** `Presentations/Artificial Intelligence/AI-14_AI_Ethics_Fair_Safe_and_Private_Slides.pdf`
- **Type / length:** Unplugged · 60 min
- **Hook:** A self-driving car must choose. Who decides what it chooses?
- **Key ideas (title-slide tags):** bias, fairness, privacy, accountability
- **Depths:** Starter: Fair or unfair? picture stories. Core: Moral Machine debate and a bias hunt. Advanced: Write an AI policy for the school.
- **Kit per group of 2:** Printed templates; Laptop
- **Simulators to point to:** Moral Machine (https://www.moralmachine.net)
- **Learning objectives:** 1) Find bias in a dataset 2) Debate a real AI dilemma 3) Write rules for responsible AI in school
- **Slides:** design them in the standard order (section 2), one objective slide or two per objective. No draft yet.

### AI-15 · AI Careers and the Future of Work

- **File:** `Presentations/Artificial Intelligence/AI-15_AI_Careers_and_the_Future_of_Work_Slides.pdf`
- **Type / length:** Software · 60 min
- **Hook:** Half the jobs you'll do haven't been invented yet. Which ones will AI create?
- **Key ideas (title-slide tags):** automation, careers, skills
- **Depths:** Starter: Robot helpers in the town picture. Core: Job task sorting and a careers gallery walk. Advanced: Research and present a robotics or AI career.
- **Kit per group of 2:** Printed templates; Laptop
- **Learning objectives:** 1) Name AI and robotics jobs 2) Map tasks AI does well and badly 3) Plan a learning path for a chosen career
- **Slides:** design them in the standard order (section 2), one objective slide or two per objective. No draft yet.


## Intelligent Systems · Robot Perception

### IS-01 · Robot Senses Tour

- **File:** `Presentations/Intelligent Systems/IS-01_Robot_Senses_Tour_Slides.pdf`
- **Type / length:** Hardware · 90 min
- **Hook:** Robots have senses you don't: echoes, infrared and an inner ear that never gets dizzy.
- **Key ideas (title-slide tags):** sensors, range, resolution
- **Depths:** Starter: Sensor stations with picture cards. Core: Stations with readings logged and compared. Advanced: Range, resolution and noise measured for each.
- **Kit per group of 2:** Arduino Uno + USB cable; Ultrasonic sensor HC-SR04; LDR module; IR sensor module; PIR motion sensor; MPU6050 IMU; Sound sensor KY-037
- **Simulators to point to:** Circuit Lab
- **Learning objectives:** 1) Test six robot sensors at stations 2) Match sensors to animal senses 3) Pick sensors for a robot design
- **Slides:** design them in the standard order (section 2), one objective slide or two per objective. No draft yet.

### IS-02 · Noisy Sensors and Filters

- **File:** `Presentations/Intelligent Systems/IS-02_Noisy_Sensors_and_Filters_Slides.pdf`
- **Type / length:** Hardware + software · 60 min
- **Hook:** The sensor says the wall jumped 30 cm in a millisecond. It didn't.
- **Key ideas (title-slide tags):** noise, moving average, median filter
- **Depths:** Starter: Wobbly drawing game: what is the real line?. Core: Moving average on ultrasonic data, plotted. Advanced: Exponential filter and the delay it adds.
- **Kit per group of 2:** Arduino Uno + USB cable; Ultrasonic sensor HC-SR04; Laptop
- **Simulators to point to:** Circuit Lab; Code Lab
- **Learning objectives:** 1) Plot noisy sensor data 2) Smooth it with a moving average 3) Reject outliers with a median filter
- **Slides:** design them in the standard order (section 2), one objective slide or two per objective. No draft yet.

### IS-03 · Sensor Fusion

- **File:** `Presentations/Intelligent Systems/IS-03_Sensor_Fusion_Slides.pdf`
- **Type / length:** Hardware + software · 90 min
- **Hook:** Your eyes and ears agree, so you trust them. Robots do the same with sensors.
- **Key ideas (title-slide tags):** sensor fusion, complementary filter, confidence
- **Depths:** Starter: Blindfold game: one sense versus two. Core: Ultrasonic plus IR fusion rule. Advanced: Complementary filter for MPU6050 tilt.
- **Kit per group of 2:** Arduino Uno + USB cable; Ultrasonic sensor HC-SR04; IR sensor module; MPU6050 IMU
- **Simulators to point to:** Circuit Lab; Code Lab
- **Learning objectives:** 1) Explain why one sensor is not enough 2) Combine IR and ultrasonic for a better distance 3) Fuse gyro and accelerometer for tilt
- **Slides:** design them in the standard order (section 2), one objective slide or two per objective. No draft yet.

### IS-04 · Computer Vision Basics

- **File:** `Presentations/Intelligent Systems/IS-04_Computer_Vision_Basics_Slides.pdf`
- **Type / length:** Software · 60 min
- **Hook:** Find the red ball in this photo. Now explain how you did it, in numbers.
- **Key ideas (title-slide tags):** pixels, RGB, threshold, centroid
- **Depths:** Starter: Colour hunt with a webcam. Core: Colour threshold and centre point in p5.js. Advanced: HSV versus RGB and lighting robustness.
- **Kit per group of 2:** Laptop; Webcam
- **Simulators to point to:** Code Lab
- **Learning objectives:** 1) Explain pixels and RGB 2) Threshold an image to find a colour 3) Find an object's centre
- **Slides:** design them in the standard order (section 2), one objective slide or two per objective. No draft yet.

### IS-05 · Scanning Rangefinder and Mapping

- **File:** `Presentations/Intelligent Systems/IS-05_Scanning_Rangefinder_and_Mapping_Slides.pdf`
- **Type / length:** Hardware + software · 90 min
- **Hook:** Self-driving cars spin a laser to draw the world around them. Build a slow version.
- **Key ideas (title-slide tags):** polar coordinates, mapping, occupancy grid
- **Depths:** Starter: Sonar radar screen. Core: Polar to x, y map in Code Lab or Processing. Advanced: Occupancy grid from several robot positions.
- **Kit per group of 2:** Servo SG90; Ultrasonic sensor HC-SR04; Arduino Uno + USB cable; Laptop
- **Simulators to point to:** Circuit Lab; Code Lab
- **Learning objectives:** 1) Scan with a servo-mounted ultrasonic sensor 2) Turn angles and distances into x, y points 3) Draw a room map from scans
- **Slides:** design them in the standard order (section 2), one objective slide or two per objective. No draft yet.


## Intelligent Systems · AI-Powered Robots

### IS-06 · Hand and Pose Control

- **File:** `Presentations/Intelligent Systems/IS-06_Hand_and_Pose_Control_Slides.pdf`
- **Type / length:** Hardware + software · 90 min
- **Hook:** Wave your hand and the robot follows. No buttons, no joystick.
- **Key ideas (title-slide tags):** pose estimation, landmarks, control mapping
- **Depths:** Starter: Hand-raise controls an LED. Core: Hand position steers a servo arm. Advanced: Gesture vocabulary with confidence thresholds.
- **Kit per group of 2:** Laptop; Webcam; Arduino Uno + USB cable; Servo SG90
- **Simulators to point to:** MediaPipe Studio (https://mediapipe-studio.webapps.google.com); PictoBlox (https://pictoblox.ai)
- **Learning objectives:** 1) Use a pose or hand-tracking model 2) Turn landmarks into commands 3) Send commands to an Arduino
- **Slides:** design them in the standard order (section 2), one objective slide or two per objective. No draft yet.

### IS-07 · Voice-Commanded Robot

- **File:** `Presentations/Intelligent Systems/IS-07_Voice-Commanded_Robot_Slides.pdf`
- **Type / length:** Hardware + software · 90 min
- **Hook:** 'Forward!' and the robot moves. Let's build our own voice assistant for robots.
- **Key ideas (title-slide tags):** speech commands, failsafe, latency
- **Depths:** Starter: Clap commands a light. Core: Four-word voice model drives the car. Advanced: Confirmation words and a stop-word failsafe.
- **Kit per group of 2:** Laptop; Arduino Uno + USB cable; Bluetooth module HC-05; 4WD robot car (assembled, L298N)
- **Simulators to point to:** Teachable Machine (https://teachablemachine.withgoogle.com); PictoBlox (https://pictoblox.ai)
- **Learning objectives:** 1) Train or use a speech model for commands 2) Map words to robot actions 3) Handle mistakes safely
- **Slides:** design them in the standard order (section 2), one objective slide or two per objective. No draft yet.

### IS-08 · AI Sorting Robot

- **File:** `Presentations/Intelligent Systems/IS-08_AI_Sorting_Robot_Slides.pdf`
- **Type / length:** Hardware + software · 120 min
- **Hook:** Recycling plants use cameras and air jets to sort rubbish at lightning speed.
- **Key ideas (title-slide tags):** classification, actuation, confidence
- **Depths:** Starter: Sort two colours with a sensor. Core: Camera model sorts 3 items with a servo flap. Advanced: Confidence threshold, 'unsure' bin and a speed test.
- **Kit per group of 2:** Laptop; Webcam; Arduino Uno + USB cable; Servo SG90; Cardboard sheet; Colour sensor TCS34725
- **Simulators to point to:** Teachable Machine (https://teachablemachine.withgoogle.com); PictoBlox (https://pictoblox.ai)
- **Draft content written:** use it, improve it, and draw it in the house style.

1. Title · "Did you know?": Modern recycling plants use cameras and blasts of air to sort up to 1,000 items a minute.
2. Let's think · "How could a robot tell a bottle from a can, and push each into the right bin?" · guesses: Weigh them / Colour sensor / Camera + AI! · story box "A mountain of rubbish": Pakistan's cities produce tens of thousands of tonnes of waste every day. Sorting it by hand is slow, dirty and dangerous. Robots that can see are starting to help. · Today: we join AI (a model that recognises items) to robotics (a servo that sorts them) to make a working sorting machine.
3. Learning objectives · 1) Train a model to recognise 3 items (Proof: the model names each item with high confidence) 2) Link the model's answer to a servo sorter (Proof: the flap moves to the right bin for each item) 3) Measure how well the sorter works (Proof: I filled the accuracy and speed table)
4. Video time · find a short video: "AI recycling sorting robot how it works" (about 5 min) · Watch for: How does the robot see the rubbish? / How does it move items into the right place? / What mistakes can it make?
5. Big idea · **An intelligent system has three parts** · [Perception (AI)] A camera and a trained model answer: what is this? · [Decision] Rules turn the answer into a choice: bottle → left bin. · [Action (robotics)] A servo moves a flap to push the item.
6. Not sure? · **Confidence decides safely** · The model gives a confidence for each class. A good sorter only acts when it's sure. · Confidence ≥ 80%: sort it · Below 80%: put it in the 'check' bin for a human · Wrong sorting costs more than slow sorting · Tap-to-reveal: Why not just always pick the class with the highest confidence? → With 40% bottle / 35% can / 25% paper the model is basically guessing. Sending it to a 'check' bin avoids a costly mistake. Real factories do exactly this.
7. Connecting AI to hardware · **From prediction to movement** · [PictoBlox does both] Its Machine Learning extension runs the image model on the laptop and its Arduino blocks move the servo over USB. · Note "Engineer tip": Wait for the flap to finish moving before checking the next item. · Code: when model says 'bottle' (and sure) ⏎     set servo to 30°   # left bin ⏎ when model says 'can' ⏎     set servo to 90°   # middle bin ⏎ when model says 'paper' ⏎     set servo to 150°  # right bin ⏎ otherwise ⏎     set servo to 90° and wait
8. Quick check · The model says 45% can, 40% bottle. A careful sorter should... · options: Sort it as a can / Sort it as a bottle / Send it to the 'check' bin / Switch off · answer: Send it to the 'check' bin (Neither answer is confident, so a human should check.)
9. Quick check · Which part of the sorter is the AI? · options: The servo / The image model / The cardboard bins / The USB cable · answer: The image model (The model does the perception; the servo is robotics.)
10. Real world · Recycling plants: Cameras + AI spot materials on fast belts; air jets push each item to its line. · Fruit packing: Machines grade apples by colour, size and bruises, hundreds per minute. · Warehouses: Robots read labels and sort parcels into delivery routes.
11. Part 2 · Make it (divider)
12. Class game · **Human sorting line** · Three students: the Camera (eyes open), the Brain (holds the rule card), the Arm (points to the bin). The Camera may only say what it sees in 3 words; the Brain decides the bin; the Arm moves. Feed 10 picture cards quickly. Count mistakes and time. Add a 'not sure' rule and run again. · Big idea: A sorting system = perception + decision + action. Each part must be fast and reliable.
13. Build it · Our kit (per group) · tip: Use 3 clean, safe items: a plastic bottle, a can and scrunched paper. Make three bins from a cardboard box and a servo flap at the front.
14. Build step 1 · **Train the eyes** · In PictoBlox: Machine Learning Environment → Image Classifier. Classes: bottle, can, paper, empty. Record 40 pictures per class at the sorting spot, items turned different ways. Train and test each item 5 times.
15. Build step 2 · **Build the sorter** · Glue a servo horn to a cardboard flap at the front of the bins. Servo: brown → GND, red → 5V, orange → pin 9. Test angles 30°, 90°, 150° with a short program. Mark the three positions on the box.
16. Build step 3 · **Connect brain to arm** · Add the Arduino Uno extension and connect over USB. Forever: analyse the image from the camera. If 'bottle' and confidence > 0.8 → servo 30°, wait 1 s, servo 90°. Same for can (90°, push) and paper (150°). Otherwise: show 'Not sure!' and keep the flap closed. · Note "Tip": Run the model only every half second. It gives the servo time and stops the flap from flickering.
17. Test like an engineer · **Sorting accuracy and speed** · columns: Item | Correct | Wrong bin | Not sure | Time for 10 items · rows: Bottle / Can / Paper / Mixed (your choice)
18. Level up! · Belt: Use a stepper to roll a cardboard belt and sort items as they arrive. · Counter: Count each type and show totals on the OLED. · New material: Add glass (a picture card) as a 4th class. · Faster: Lower the delay. When does accuracy drop? · Think like an engineer: Your sorter is 90% accurate. Is that good enough for a factory sorting 1,000 items a minute? How many mistakes is that? · Boss level: Log every decision with its confidence to a file and find which item is most often confused.
19. Think about it · **Robots and jobs** · Robots should sort waste: Sorting by hand is dirty and dangerous; More recycling helps the environment; Machines work day and night · But think about...: People who earn a living sorting waste; Who fixes and trains the robots?; Could robots and people work together?
20. Objective check · Can I really do it? Prove it. (rate red/amber/green per objective)
21. Show what you know · An intelligent system = perception + decision + action · A trained model can be the 'eyes' of a robot · Confidence thresholds make AI safer · Measure accuracy and speed honestly · Automation changes jobs; plan it fairly · Exit ticket: Draw your sorter and label the AI part, the decision part and the robot part. · At home: At home, sort one day's rubbish into 3 types. What was hard to decide? · Next class: IS-09 Follow-the-Object Robot: vision that steers a moving robot.

**Teacher-guide draft:** A capstone-style integration lesson that connects a trained image model to a physical actuator. The engineering lessons are confidence thresholds, timing between sensing and acting, and measuring a system, not just showing it works once. Plan for 2 sessions with younger or less experienced groups.

- Timing: 8 min Hook (Waste story and video); 10 min Learn (Three parts, confidence, prediction to movement); 6 min Game (Human sorting line); 15 min Build 1 (Train the model); 15 min Build 2 (Build the sorter); 15 min Build 3 (Connect model and servo); 15 min Test (Accuracy and speed table); 16 min Wrap (Debate, objective check, exit ticket)
- Prep: Install PictoBlox on lab laptops and test the Arduino extension and camera; Prepare 3 sets of safe items per team (rinsed bottles and cans, paper balls); Cardboard boxes and craft knives cut in advance by the teacher; Upload a servo-sweep test sketch to check every servo works; Optional: a printed 3-bin template
- Misconceptions: "The servo 'sees' the item" → The servo only moves. The model sees; the code connects them.; "If it worked once it works" → Systems must be measured many times; one success proves little.; "Higher confidence threshold is always better" → Too high and nothing gets sorted. It's a trade-off.
- Troubleshooting: Flap twitches all the time → No 'empty' class, or the model runs too often: add a wait and the empty class.; Servo jitters or Arduino resets → Servo draws too much current: power it from a separate 5V supply with shared GND.; PictoBlox can't find the board → Upload PictoBlox firmware in 'Upload mode', then switch to 'Stage mode'.; Model confuses bottle and can → Add pictures of both at the sorting spot, under classroom lighting.
- Depths: starter: Replace the camera model with the colour sensor: red card left, blue card right. Teacher builds the bins; children feed items and count. Focus on 'eyes, brain, hand'. | core: Full lesson as written over one long or two short sessions. | advanced: Add a conveyor belt with the stepper. Log decisions and confidences; compute a confusion matrix. Write a one-page system report with accuracy and throughput.
- Rubric: System thinking (emerging: Names camera and servo; secure: Explains perception, decision, action; extending: Explains trade-offs (threshold, speed, accuracy)); Integration (emerging: Parts work separately; secure: Model drives the servo correctly; extending: Robust: empty class, timing, threshold, logging); Evaluation (emerging: Shows it working; secure: Completes the accuracy table; extending: Analyses errors and proposes data fixes)
- Safety: Only clean, dry, non-sharp items. No glass.; Teacher cuts cardboard with craft knives.; Fingers clear of the moving flap.

### IS-09 · Follow-the-Object Robot

- **File:** `Presentations/Intelligent Systems/IS-09_Follow-the-Object_Robot_Slides.pdf`
- **Type / length:** Hardware + software · 120 min
- **Hook:** A camera on wheels that chases a ball. Simple idea, real engineering.
- **Key ideas (title-slide tags):** visual servoing, proportional control
- **Depths:** Starter: ESP32-CAM colour tracker on a desk. Core: Robot car turns to follow a coloured ball. Advanced: Distance from object size and smooth speed control.
- **Kit per group of 2:** ESP32-CAM + programmer; 2WD robot chassis kit; L298N motor driver; 18650 cell + holder
- **Simulators to point to:** Code Lab
- **Learning objectives:** 1) Find an object in the camera image 2) Steer by the object's position 3) Tune the reaction with proportional control
- **Slides:** design them in the standard order (section 2), one objective slide or two per objective. No draft yet.


## Intelligent Systems · Connected & Edge Intelligence

### IS-10 · TinyML: AI on a Microcontroller

- **File:** `Presentations/Intelligent Systems/IS-10_TinyML_AI_on_a_Microcontroller_Slides.pdf`
- **Type / length:** Hardware + software · 120 min
- **Hook:** A smartwatch detects a fall with no internet. The AI lives on the chip.
- **Key ideas (title-slide tags):** TinyML, edge AI, quantisation
- **Depths:** Starter: Gesture game and a demo model. Core: Two-gesture model deployed to the ESP32. Advanced: Anomaly detection and on-device timing.
- **Kit per group of 2:** ESP32 Dev Board + USB cable; MPU6050 IMU; Jumper wires M-F; Laptop
- **Simulators to point to:** Edge Impulse (https://edgeimpulse.com)
- **Learning objectives:** 1) Collect motion data from the MPU6050 2) Train a tiny model in Edge Impulse 3) Run it on the ESP32
- **Slides:** design them in the standard order (section 2), one objective slide or two per objective. No draft yet.

### IS-11 · Robot Telemetry Dashboard

- **File:** `Presentations/Intelligent Systems/IS-11_Robot_Telemetry_Dashboard_Slides.pdf`
- **Type / length:** Hardware + software · 90 min
- **Hook:** Mission control sees every rover reading live. Build your own mission control.
- **Key ideas (title-slide tags):** telemetry, MQTT, dashboards, alerts
- **Depths:** Starter: Live number on a phone page. Core: ESP32 web dashboard with live graphs. Advanced: MQTT with several robots and alert rules.
- **Kit per group of 2:** ESP32 Dev Board + USB cable; DHT22 sensor; Ultrasonic sensor HC-SR04; Laptop
- **Simulators to point to:** Wokwi (https://wokwi.com)
- **Learning objectives:** 1) Send sensor data over Wi-Fi 2) Show live graphs on a dashboard 3) Raise alerts when values go wrong
- **Slides:** design them in the standard order (section 2), one objective slide or two per objective. No draft yet.

### IS-12 · Robot Assistant with a Language Model

- **File:** `Presentations/Intelligent Systems/IS-12_Robot_Assistant_with_a_Language_Model_Slides.pdf`
- **Type / length:** Hardware + software · 90 min
- **Hook:** Say 'make the room cosy' and the robot works out what that means.
- **Key ideas (title-slide tags):** AI agent, tools, guardrails
- **Depths:** Starter: Teacher demo: talk to the light. Core: Language model picks from a fixed command list. Advanced: Agent with tool calls, logging and a safety filter.
- **Kit per group of 2:** ESP32 Dev Board + USB cable; WS2812B LED ring (12 LEDs); Servo SG90; Laptop
- **Simulators to point to:** Study Buddy; Code Lab
- **Learning objectives:** 1) Explain AI agents and tools 2) Turn natural language into safe robot commands 3) Add guardrails so the robot never does unsafe things
- **Slides:** design them in the standard order (section 2), one objective slide or two per objective. No draft yet.


## Intelligent Systems · Capstone

### IS-13 · Capstone: Design, Build and Pitch an Intelligent Robot

- **File:** `Presentations/Intelligent Systems/IS-13_Capstone_Design_Build_and_Pitch_an_Intelligent_Robot_Slides.pdf`
- **Type / length:** Hardware + software · 120 min
- **Hook:** Find a real problem at school or home. Build the robot that fixes it.
- **Key ideas (title-slide tags):** project management, integration, communication
- **Depths:** Starter: Class robot for a school job, built together. Core: Team project over several sessions with a demo day. Advanced: Competition-style project with test data and a technical report.
- **Kit per group of 2:** Arduino Uno + USB cable; ESP32 Dev Board + USB cable; 2WD robot chassis kit; Laptop
- **Simulators to point to:** Circuit Lab; Code Lab; Tinkercad (https://www.tinkercad.com)
- **Learning objectives:** 1) Plan a project with a design brief and timeline 2) Build and test a robot that senses, decides and acts 3) Pitch it with a demo, data and a poster
- **Slides:** design them in the standard order (section 2), one objective slide or two per objective. No draft yet.
