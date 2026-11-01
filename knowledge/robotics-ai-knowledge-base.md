# Robotics & AI Club - Complete Knowledge Base

**Pak-Turk Maarif International Schools & Colleges · Islamabad Boys Campus, Chak Shahzad**
Curriculum and platform by Qasim Mushtaq, MS Robotics and AI.

This file is written to be the single source an AI tutor reads before answering a student. It covers every activity in the curriculum, every component in the kit, the wiring and working code for every circuit the club builds, the concepts behind them, and how to explain each one to a five-year-old and to a seventeen-year-old.

Everything factual in here is taken from the club's own platform: the activity and kit data in `data.js`, the lesson definitions and sketches in `lessons*.js`, and the part definitions, pin maps and code templates in `parts*.js`. Pin numbers quoted are the pin numbers a student will actually see on screen. Where a detail is not in the platform, such as the physics of a 555 timer or the failure modes of a soil probe, it has been written in and marked as reference knowledge rather than curriculum data.

**Scope at a glance**

- 4 age groups, 145 activities, 33 units, 11 subject domains
- 99 distinct kit items
- 157 components modelled in the Circuit Lab simulator
- 82 activities with a complete, runnable Arduino sketch
- 4 microcontroller boards
- 21 reusable code patterns and 14 starter circuits

**Contents**

1. How an AI agent should use this file
2. The programme
3. The four age bands and how to pitch to each
4. The boards
5. Component reference
6. Activity reference
7. Core concepts
8. Code patterns
9. Starter circuits
10. Troubleshooting playbook
11. Safety
12. Glossary
13. Lookup tables
14. Questions children actually ask

---

## 1. How an AI agent should use this file

You are answering children aged 5 to 17 in a robotics and AI club, and sometimes the teacher. This file is your ground truth. Prefer it over your general knowledge whenever the two differ, because a student is looking at this exact kit, these exact pin numbers and this exact code.

**Work out the age band first.** The answer to "how does the ultrasonic sensor work" is a completely different sentence for a six-year-old and a sixteen-year-old. If the student's age or group is known, use section 3 to pick the register. If it is not known, answer at the Junior Makers level (8 to 11) and offer to go deeper. Never give a five-year-old a formula; never give a sixteen-year-old only a metaphor.

**Ground every answer in a real activity where you can.** If a student asks about servos, the answer is better if it mentions the activity they are likely doing, by code, and what their own kit contains. Activity codes look like `LE-07`, `JM-03`, `YI-20`, `TL-14` and `F-00`. Quote them so the teacher can find the lesson.

**Quote the real numbers.** Pin 9, 220 ohms, 14 milliamps, 0 to 1023, 20 millisecond pulse. Vague answers do not help someone whose circuit is not working. Every number in sections 4 to 9 is either from the platform or checked reference data.

**When a circuit does not work, do not guess.** Go to section 10 and walk the student through the checks in order. The cause is almost always one of six things, and the order in that section is the order of likelihood.

**Respect what the simulator can and cannot do.** Circuit Lab checks logic and wiring, not exact electrical values. It will not show a capacitor's charging curve, it does not model analogue circuits such as the 555 in detail, and compiling a sketch needs an internet connection even though everything else works offline. If an activity is marked as not simulated, say so and point at the real kit.

**Safety is not optional.** Anything involving mains voltage, lithium cells, hot glue, soldering or a flame has a line in section 11. Say it plainly, once, without lecturing.

**If this file does not cover something, say so.** It is better to tell a student "that is not in our kit, but here is the idea" than to invent a pin number. Mark the boundary clearly: curriculum fact, general knowledge, or your own suggestion.

**Tone.** Warm, direct, and never condescending. A child who asks a question deserves a real answer, not a deflection. If a student is frustrated because their project does not work, deal with the circuit first and the encouragement second: solving it is the encouragement.

---

## 2. The programme

The club runs four parallel tracks, one per age band, each built from the same spine: sense, think, act. A five-year-old meets that spine as a cardboard robot with a light that comes on when something gets close. A sixteen-year-old meets it as a classifier running on a microcontroller. The idea does not change; only the depth does.

Activities are coded `GROUP-NN`, for example `JM-03`. Codes beginning `F-` are Foundation activities shared across every age group, written once and re-pitched for each. A code written as `F-00 (LE)` is the Foundation activity as it is delivered to Little Explorers.

| Group | Ages | Activities | Domains covered |
|---|---|---|---|
| **LE** Little Explorers | 5-7 | 36 | Foundation, Electronics & Circuits, Power & Energy, Programming & Logic, Sensors & Environment, Security & Safety, Robotics & Actuation, Mechanical Design, IoT & Communication, App, Web & Game Development, AI & Data |
| **JM** Junior Makers | 8-11 | 37 | Foundation, Robotics & Actuation, Electronics & Circuits, Programming & Logic, Sensors & Environment, Security & Safety, Power & Energy, Mechanical Design, IoT & Communication, App, Web & Game Development, AI & Data |
| **YI** Young Innovators | 12-14 | 36 | Foundation, Electronics & Circuits, Sensors & Environment, Power & Energy, Mechanical Design, Robotics & Actuation, IoT & Communication, Security & Safety, App, Web & Game Development, Programming & Logic, AI & Data |
| **TL** Tech Leaders | 15-17 | 36 | Foundation, Power & Energy, Robotics & Actuation, Mechanical Design, Sensors & Environment, IoT & Communication, Security & Safety, AI & Data, App, Web & Game Development, Programming & Logic, Electronics & Circuits |

**Units in order:**

- **LE:** Foundation & intro → Circuits & Power → Sensing the World → Move & Communicate → Code, Play & AI → Think Like a Computer → Light, Sound & Power → Stories, Pictures & Machines → Smart Helpers & AI
- **JM:** Foundation & intro → Circuits, Code & Sensing → Smart Home & Energy → Security, Design & Robots → Health, Web, Games & AI → Code Studio → Light, Sound & Music Tech → Smart City & Mechanisms → Code, Data & AI
- **YI:** Foundation & intro → Electronics & Mechanisms → Robots & Security → Power & Wireless → Software, AI & Design → Creative Coding → Data & Signals → Robots & Mechanisms → AI & the Web
- **TL:** Foundation & intro → Power, Autonomy & Health → Connected Systems → Data, AI & Web → Security, Robots & Product Design → Vision & Intelligence → Algorithms & Systems → Robots & Control → AI, Data & Product

**Phases.** Foundation activities come first and establish the shared vocabulary. Phase 1 builds single-sensor, single-actuator projects where the whole circuit fits on one breadboard. Phase 2 combines them: more than one input, more than one output, and a decision in between that is worth writing down before it is coded.

**The eleven domains** cut across the age bands. The same domain appears at every level with different content.

- **Foundation** - what a robot is, what a circuit is, the sense-think-act loop
- **Electronics & Circuits** - current, voltage, resistance, breadboards, components
- **Power & Energy** - batteries, cells, generation, efficiency, charging
- **Programming & Logic** - sequence, loops, conditions, variables, functions
- **Sensors & Environment** - measuring the physical world and what the numbers mean
- **Security & Safety** - keypads, RFID, alarms, and the ethics that come with them
- **Robotics & Actuation** - motors, servos, drivers, movement
- **Mechanical Design** - structure, linkages, gears, 3D design and printing
- **IoT & Communication** - Wi-Fi, Bluetooth, MQTT, radio, talking between devices
- **App, Web & Game Development** - HTML, CSS, JavaScript, p5.js, Processing, block coding
- **AI & Data** - data, training, classification, computer vision, and what the machine is not doing

**The platform the students use**

- **The portal** is the planner: activities, kits, printable hardware lists, slides.
- **Circuit Lab** (`circuit/`) is a browser circuit simulator. Students drag parts onto a canvas, wire pin to pin, write an Arduino sketch and run it. It has a schematic view, a multimeter, a logic scope and a slow-motion mode. It installs as its own app and works offline; only compiling a sketch needs the internet.
- **Code Lab** (`codelab/`) is a browser editor with six languages: Python, C++, Python turtle graphics, p5.js, Processing and web pages with a live preview. Everything except Python and C++ runs with no internet.

---

## 3. The four age bands and how to pitch to each

This section governs every other answer in this file. Pick the band, then keep to its vocabulary, its sentence length and its idea of proof.

### LE · Little Explorers, ages 5 to 7

**What they can do.** Follow two or three steps. Recognise patterns. Press, stick, place, colour. Many cannot yet read fluently, so instructions have to be spoken or drawn. Attention runs about ten minutes on one thing.

**What they cannot do yet.** Hold an abstract idea without a physical object in front of them. Think about something invisible. Read a number line reliably. Understand "because" chains longer than one link.

**How to explain anything to them.** Give it a body and a job. Electricity is something that flows like water and needs a complete loop to travel round. A sensor is the robot's ear or eye or nose. A motor is a muscle. Never say "voltage", say "push". Never say "resistance", say "a narrow bit in the pipe". One sentence, then a question back to them.

**What proof looks like.** It lights up. It beeps. It moves. If they cannot see it happen, they will not believe it, and they are right to not believe it.

**Vocabulary to use:** push, loop, wire, light, sound, move, warm, close, far, on, off.
**Vocabulary to avoid:** voltage, current, resistance, analog, digital, variable, function, PWM.

**Typical LE answer shape:** "The robot cannot see you. But it can shout, in a voice too high for your ears, and listen for the echo coming back. If the echo comes back quickly, you are close. Shall we make it beep when you get close?"

### JM · Junior Makers, ages 8 to 11

**What they can do.** Follow a written sequence of six or eight steps. Hold a simple cause-and-effect chain. Count, measure and compare numbers. Debug by swapping one thing at a time, if they are shown how. Read code if it is short and the names mean something.

**What they cannot do yet.** Reason reliably about something they cannot measure. Hold more than one variable in their head at once. Accept a formula as an explanation.

**How to explain anything to them.** Give the mechanism, in order, in plain words, then the number. "The sensor sends out a sound pulse. The pulse bounces off you. The sensor times how long it took. Sound travels about 343 metres every second, so it goes one centimetre in about 29 microseconds, and the pulse made the trip twice, which is why the code divides by 58."

**What proof looks like.** A number on the Serial Monitor that changes when they move their hand. This is the age where the Serial Monitor becomes the most important tool in the room.

**Vocabulary to introduce:** circuit, current, voltage, resistance, input, output, digital, loop, variable, condition, pin.

**Typical JM answer shape:** mechanism in three short sentences, then one real number, then something to try.

### YI · Young Innovators, ages 12 to 14

**What they can do.** Hold an abstract model. Read a datasheet extract. Reason about two or three variables at once. Write and modify code of fifty lines. Form a hypothesis and test it deliberately. Notice when a result does not match a prediction, which is where real engineering starts.

**What they cannot do yet, reliably.** Design a whole system from a blank page without scaffolding. Judge which of several plausible causes is most likely without a procedure.

**How to explain anything to them.** Give the model and the maths together. Use the real terms. Explain why the component is built the way it is, not only what it does. "An H-bridge is four switches arranged so that current can be pushed through the motor in either direction. Close the top-left and bottom-right and it turns one way; close the other pair and it turns the other. Close both on the same side and you have a short circuit across the supply, which is why the driver chip will not let you."

**What proof looks like.** A measurement that matches a prediction, or does not, and an explanation of the gap.

**Vocabulary to introduce:** PWM, duty cycle, pull-up, voltage divider, I2C, SPI, UART, ADC resolution, interrupt, library, class, latency, sampling rate.

**Typical YI answer shape:** the model, the formula, the real number from the kit, and the usual failure mode.

### TL · Tech Leaders, ages 15 to 17

**What they can do.** Work from documentation. Design a system to a specification. Weigh trade-offs. Write and structure a few hundred lines of code. Understand that an answer can be "it depends, and here is what it depends on."

**How to explain anything to them.** Treat them as junior engineers. Give the trade-off, not just the answer. Name the thing properly and say where to read more. Be honest about what the kit cannot do and why.

**What proof looks like.** It works under conditions they chose to test, and they can say why it would fail under others.

**Vocabulary:** anything, correctly used.

**Typical TL answer shape:** direct answer, the constraint that drives it, the alternative they did not ask about, and the failure case.

### The same question, answered four ways

**"Why does my LED need a resistor?"**

- **LE:** "The light is small and the battery pushes hard. The resistor is a narrow bit in the pipe, so only a little electricity gets through and the light does not get hurt."
- **JM:** "An LED does not limit how much current goes through it the way a bulb does. Given the chance it takes far too much and burns out in a second or two. The 220 ohm resistor sets the current to about 14 milliamps, which is a comfortable brightness and safe for the pin."
- **YI:** "An LED is a diode: once it is above its forward voltage, around 2 V for red, its resistance falls away and current rises almost without limit. The current has to be set by something external. (5 V - 2 V) / 220 ohms gives 13.6 mA, inside both the LED's 20 mA rating and the Arduino pin's 20 mA comfortable limit."
- **TL:** "Because the LED's I-V curve is exponential past the knee, so the operating point is set by whatever else is in the loop. The series resistor makes the current predictable and insensitive to the part-to-part spread in forward voltage. If you want precise brightness across many LEDs, a constant-current driver is the better answer, and that is what LED strips use."

---

## 4. The boards

Four boards appear across the curriculum. The Uno is the default; the ESP32 is used wherever an activity needs Wi-Fi, Bluetooth or more pins.

### Arduino Uno (`uno`)

- **Logic level:** 5 V. A HIGH output is 5 V, and an input must not be given more than that.
- **Compiled as:** uno
- **Usable pins in Circuit Lab:** 22
- **Wi-Fi and Bluetooth:** no, not without an extra module.

### ESP32 DevKit (`esp32`)

- **Logic level:** 3.3 V. A HIGH output is 3.3 V, and an input must not be given more than that.
- **Compiled as:** mega
- **Usable pins in Circuit Lab:** 23
- **Wi-Fi and Bluetooth:** yes. In Circuit Lab these talk to a pretend network in the Phone tab, not the real internet.

### Arduino Nano (`nano`)

- **Logic level:** 5 V. A HIGH output is 5 V, and an input must not be given more than that.
- **Compiled as:** nano
- **Usable pins in Circuit Lab:** 25
- **Wi-Fi and Bluetooth:** no, not without an extra module.

### Arduino Mega 2560 (`mega`)

- **Logic level:** 5 V. A HIGH output is 5 V, and an input must not be given more than that.
- **Compiled as:** mega
- **Usable pins in Circuit Lab:** 72
- **Wi-Fi and Bluetooth:** no, not without an extra module.


---

## 5. Component reference

Every item that appears in any activity's kit list, with what it is, how it is wired, the code that drives it, and the activities that use it. Pin numbers are the defaults Circuit Lab uses, so a student following a lesson will see exactly these.

### Boards

#### Arduino Uno + USB cable

**Also called:** Arduino Uno (Circuit Lab part `uno`)

**Used in 62 activities** across Little Explorers, Junior Makers, Young Innovators, Tech Leaders · issued group.

**How it behaves:** The brain. Pins 0-13 are digital (~ marks PWM), A0-A5 read voltages. 5V and GND power your parts.

**Numbers that matter:** ATmega328P at 16 MHz, 32 KB of program memory, 2 KB of RAM. 14 digital pins, 6 of them PWM, and 6 analog inputs reading 0 to 1023. Each pin can source about 20 mA safely, 40 mA absolute maximum, and the whole chip about 200 mA total.

**What usually goes wrong:** Powering a servo or a motor from the 5 V pin and then wondering why the board resets. Connecting a 5 V sensor output to a 3.3 V board. Uploading with the Serial Monitor open on the wrong port.

**Saying it to a child:** The robot's brain. It cannot see or move by itself, but it can read what the sensors tell it and switch things on and off very fast.

**Notes on the kit list:** Pre-wired by teacher; Transmitter + receiver; Sender + receiver

**Appears in:** `F-00 (LE)` Welcome to Robotics (Distance Alarm) · `F-01 (LE)` Arduino Uno Basics · `LE-02` Push-Button Doorbell · `LE-04` Traffic Light Controller · `LE-05` Automatic Night Lamp · `LE-06` Hot & Cold Temperature Indicator · `LE-07` Plant Water Alarm · `LE-08` Motion Detector Room Alarm · `LE-09` Waving Robot Arm · `LE-10` Automatic Railway Crossing Gate · `LE-12` Morse Code Light Messenger · `LE-21` Rainbow LED Ring · `LE-22` Button Melody Maker · `LE-23` Colour Detective Sensor · `LE-32` Countdown Rocket Launch · `F-00 (JM)` Welcome to Robotics (Distance Alarm) · `F-01 (JM)` Arduino Uno Basics · `JM-02` Two-Player Reaction Timer with Scoreboard · and 44 more


#### ESP32 Dev Board + USB cable

**Also called:** ESP32 DevKit (Circuit Lab part `esp32`)

**Used in 18 activities** across Little Explorers, Junior Makers, Young Innovators, Tech Leaders · issued group.

**How it behaves:** Wi-Fi + Bluetooth board, 3.3V logic. Use GPIO numbers in code (e.g. 2 for D2). Teaching mode: pins, ADC, PWM, Serial work; Wi-Fi, web pages, MQTT and ESP-NOW are simulated in the Phone/Network panel.

**Numbers that matter:** Dual core at up to 240 MHz, 520 KB of RAM, Wi-Fi and Bluetooth built in. Logic is 3.3 V, not 5 V. Analog inputs read 0 to 4095, four times the resolution of the Uno.

**What usually goes wrong:** Feeding it 5 V on a GPIO pin, which damages it. Using the ADC2 pins while Wi-Fi is on, which does not work. Assuming the pin numbers printed on one vendor's board match another's.

**Saying it to a child:** Like the Arduino's brain, but faster, and it can talk to Wi-Fi and to your phone on its own.

**Notes on the kit list:** Data cable, not charge-only; 3 nodes + base (can pair groups)

**Appears in:** `F-02 (LE)` ESP32 Basics · `F-02 (JM)` ESP32 Basics · `F-02 (YI)` ESP32 Basics · `YI-11` Wi-Fi Automatic Plant Watering System · `F-02 (TL)` ESP32 Basics · `TL-01` Solar-Powered Off-Grid Weather Node · `TL-04` Fall Detection Wearable for the Elderly · `TL-05` ESP-NOW Wireless Sensor Network · `TL-06` Smart Home Cloud Control Hub · `TL-07` Smart Parking Occupancy Dashboard · `TL-08` Two-Factor Smart Locker with Intrusion Alerts · `TL-09` Sensor Data Logging & Analysis Pipeline · `TL-10` Machine Learning Rain Predictor · `TL-12` Web-Controlled Devices via REST API · `TL-18` Vision-Guided Robot Car · `TL-19` TinyML Gesture Recogniser on ESP32 · `TL-23` Smart Microgrid Model · `TL-26` Robot Swarm: Leader and Follower Cars


### Basics

#### Breadboard (half size)

**Also called:** Breadboard (Circuit Lab part `breadboard`)

**Used in 67 activities** across Little Explorers, Junior Makers, Young Innovators, Tech Leaders · issued group.

**How it behaves:** Each short column of 5 holes (a-e, f-j) is joined inside. The long + and − rails run along the edges. Drop a part's legs on holes to connect them.

The holes are joined in hidden strips: the two long rails down each side run the whole length and carry power, and every short row of five holes in the middle is joined across, with a break down the centre channel so a chip can straddle it.

**Numbers that matter:** A half-size board is 30 rows. It is rated for low voltage and small currents only; a motor's stall current will heat a contact and make it unreliable.

**What usually goes wrong:** Expecting the centre channel to connect across. It does not, deliberately. Also, pushing a stranded wire into a hole, which frays and makes an intermittent joint.

**Saying it to a child:** A board full of secret little wires under the holes. Holes in the same short row are already joined to each other.

**Notes on the kit list:** ESP32 is wide: bridge 2 boards

**Appears in:** `F-00 (LE)` Welcome to Robotics (Distance Alarm) · `F-01 (LE)` Arduino Uno Basics · `F-02 (LE)` ESP32 Basics · `LE-02` Push-Button Doorbell · `LE-04` Traffic Light Controller · `LE-05` Automatic Night Lamp · `LE-06` Hot & Cold Temperature Indicator · `LE-07` Plant Water Alarm · `LE-08` Motion Detector Room Alarm · `LE-09` Waving Robot Arm · `LE-10` Automatic Railway Crossing Gate · `LE-12` Morse Code Light Messenger · `LE-22` Button Melody Maker · `F-00 (JM)` Welcome to Robotics (Distance Alarm) · `F-01 (JM)` Arduino Uno Basics · `F-02 (JM)` ESP32 Basics · `JM-01` Series & Parallel Circuit Lab · `JM-02` Two-Player Reaction Timer with Scoreboard · and 49 more


#### Capacitor 10 nF

**Also called:** Capacitor (Circuit Lab part `capacitor`)

**Used in 1 activity** across Young Innovators · issued group.

**How it behaves:** Stores charge. A 100 µF capacitor across the power of an LED strip smooths sudden current. (Shown for wiring; it has no effect on the simulation.)

**Code that drives it** (written with the default pins above):

```cpp
// A capacitor stores charge. Put one across the power rails and the
// voltage stops dipping when a motor or a servo starts.
// This sketch just watches the supply voltage on A0.
const int RAIL = A0;

void setup() { Serial.begin(9600); }

void loop() {
  float volts = analogRead(RAIL) * 5.0 / 1023.0;
  Serial.print("Rail: ");
  Serial.print(volts, 2);
  Serial.println(" V");
  delay(300);
}
```

**Appears in:** `YI-01` 555 Timer Alarm Siren Circuit


#### Capacitor 10 uF

**Also called:** Capacitor (Circuit Lab part `capacitor`)

**Used in 2 activities** across Young Innovators · issued group.

**How it behaves:** Stores charge. A 100 µF capacitor across the power of an LED strip smooths sudden current. (Shown for wiring; it has no effect on the simulation.)

**Code that drives it** (written with the default pins above):

```cpp
// A capacitor stores charge. Put one across the power rails and the
// voltage stops dipping when a motor or a servo starts.
// This sketch just watches the supply voltage on A0.
const int RAIL = A0;

void setup() { Serial.begin(9600); }

void loop() {
  float volts = analogRead(RAIL) * 5.0 / 1023.0;
  Serial.print("Rail: ");
  Serial.print(volts, 2);
  Serial.println(" V");
  delay(300);
}
```

**Notes on the kit list:** NRF power smoothing

**Appears in:** `YI-01` 555 Timer Alarm Siren Circuit · `YI-10` Wireless Doorbell with Visitor Counter


#### Capacitor 100 uF

**Also called:** Capacitor (Circuit Lab parts: `capacitor`, `lm7805`)

**Used in 2 activities** across Junior Makers, Young Innovators · issued group.

**How it behaves:** Stores charge. A 100 µF capacitor across the power of an LED strip smooths sudden current. (Shown for wiring; it has no effect on the simulation.)

**Code that drives it** (written with the default pins above):

```cpp
// A capacitor stores charge. Put one across the power rails and the
// voltage stops dipping when a motor or a servo starts.
// This sketch just watches the supply voltage on A0.
const int RAIL = A0;

void setup() { Serial.begin(9600); }

void loop() {
  float volts = analogRead(RAIL) * 5.0 / 1023.0;
  Serial.print("Rail: ");
  Serial.print(volts, 2);
  Serial.println(" V");
  delay(300);
}
```

**Notes on the kit list:** Strip power

**Appears in:** `JM-21` NeoPixel Light Show to the Beat · `YI-01` 555 Timer Alarm Siren Circuit


#### LED 5 mm (assorted)

**Also called:** LED (Circuit Lab part `led`)

**Used in 73 activities** across Little Explorers, Junior Makers, Young Innovators, Tech Leaders · issued group.

**How it behaves:** Long leg (A, anode) goes to + through a resistor; short leg (C, cathode) to GND.


| Pin on the part | What it is | Where it goes by default |
|---|---|---|
| `A` | Signal | Arduino pin 13 |

**Numbers that matter:** A red LED drops about 1.8 to 2.2 V; blue and white drop about 3.0 to 3.4 V. With a 5 V supply, a 220 ohm resistor gives roughly 14 mA, which is comfortably inside both the LED's rating and the Arduino pin's 40 mA limit.

**What usually goes wrong:** No resistor at all, which usually works for a few seconds and then does not. Putting the LED in backwards, which simply does nothing and looks like a dead pin. Running more than about eight LEDs straight off one board, which exceeds the total current the chip can source.

**Saying it to a child:** A light that only lets electricity through one way. The long leg is the way in.

**Code that drives it** (written with the default pins above):

```cpp
// Blink an LED
const int LED = 13;

void setup() {
  pinMode(LED, OUTPUT);
}

void loop() {
  digitalWrite(LED, HIGH);
  delay(500);
  digitalWrite(LED, LOW);
  delay(500);
}
```

**Notes on the kit list:** Red; Red works best; Red, yellow, green; Red and blue; Added: every Arduino class; Green, yellow, red; Green, red; 2 sets of R/Y/G; Headlights; Bright white; 3 red, 3 green

**Appears in:** `F-00 (LE)` Welcome to Robotics (Distance Alarm) · `F-01 (LE)` Arduino Uno Basics · `F-02 (LE)` ESP32 Basics · `LE-01` Light-Up Paper Circuit Card · `LE-02` Push-Button Doorbell · `LE-03` Lemon Battery LED Lamp · `LE-04` Traffic Light Controller · `LE-05` Automatic Night Lamp · `LE-06` Hot & Cold Temperature Indicator · `LE-07` Plant Water Alarm · `LE-08` Motion Detector Room Alarm · `LE-09` Waving Robot Arm · `LE-10` Automatic Railway Crossing Gate · `LE-12` Morse Code Light Messenger · `LE-21` Rainbow LED Ring · `LE-22` Button Melody Maker · `LE-23` Colour Detective Sensor · `LE-24` Crank-Powered Light: Be the Power Station · and 55 more


#### Potentiometer 10k

**Also called:** Potentiometer (Circuit Lab part `pot`)

**Used in 12 activities** across Little Explorers, Junior Makers, Young Innovators, Tech Leaders · issued group.

**How it behaves:** Outer legs to 5V and GND, middle leg (SIG) to an analog pin. Turn the knob while the simulation runs.

A resistive track with a wiper that slides along it. The two ends go to 5 V and GND and the wiper gives a voltage somewhere between, which the analog pin reads as 0 to 1023.


| Pin on the part | What it is | Where it goes by default |
|---|---|---|
| `SIG` | Signal | Arduino pin A0 |
| `VCC` | Power in | 5V (or 3V3 on an ESP32) |
| `GND` | Ground | GND |

**What usually goes wrong:** Wiring only two of the three legs, which makes it a plain resistor and gives a reading that does not change.

**Saying it to a child:** A volume knob. Turning it changes how much electricity gets through, and the board reads that as a number.

**Code that drives it** (written with the default pins above):

```cpp
// Read a potentiometer (0-1023)
const int KNOB = A0;

void setup() {
  Serial.begin(9600);
}

void loop() {
  int value = analogRead(KNOB);
  Serial.println(value);
  delay(100);
}
```

**Notes on the kit list:** Analog input demo; ADC demo

**Appears in:** `F-01 (LE)` Arduino Uno Basics · `F-02 (LE)` ESP32 Basics · `F-01 (JM)` Arduino Uno Basics · `F-02 (JM)` ESP32 Basics · `JM-07` Temperature-Controlled Smart Fan · `JM-15` Pong Game with a Knob Controller · `F-01 (YI)` Arduino Uno Basics · `F-02 (YI)` ESP32 Basics · `YI-01` 555 Timer Alarm Siren Circuit · `F-01 (TL)` Arduino Uno Basics · `F-02 (TL)` ESP32 Basics · `TL-03` Pick-and-Place Robotic Arm with Record & Replay


#### Push button

**Used in 21 activities** across Little Explorers, Junior Makers, Young Innovators, Tech Leaders · issued group.

**How it behaves:** Legs on the same side are always joined; pressing joins the two sides. Use INPUT_PULLUP and wire the other side to GND: it reads LOW when pressed.

A four-pin tactile button is really two pairs of legs already joined inside. Across the narrow gap the legs are connected only when pressed; along the long sides they are always connected.


| Pin on the part | What it is | Where it goes by default |
|---|---|---|
| `1.l` | Signal | Arduino pin 2 |

**What usually goes wrong:** Putting the button across the breadboard's centre channel the wrong way round, so the two legs used are the pair that are permanently joined. The circuit then behaves as if the button is always pressed.

**Saying it to a child:** A drawbridge for electricity. Press it and the bridge comes down.

**Code that drives it** (written with the default pins above):

```cpp
// Read a push button (INPUT_PULLUP: LOW = pressed)
const int BUTTON = 2;

void setup() {
  pinMode(BUTTON, INPUT_PULLUP);
  Serial.begin(9600);
}

void loop() {
  if (digitalRead(BUTTON) == LOW) {
    Serial.println("Pressed!");
    delay(200);
  }
}
```

**Notes on the kit list:** INPUT_PULLUP demo; Pre-wired

**Appears in:** `F-01 (LE)` Arduino Uno Basics · `LE-02` Push-Button Doorbell · `LE-09` Waving Robot Arm · `LE-12` Morse Code Light Messenger · `LE-22` Button Melody Maker · `LE-32` Countdown Rocket Launch · `F-01 (JM)` Arduino Uno Basics · `JM-02` Two-Player Reaction Timer with Scoreboard · `JM-09` Home Burglar Alarm with Secret Code · `JM-13` Step Counter Fitness Tracker · `JM-15` Pong Game with a Knob Controller · `JM-23` Ultrasonic Theremin: Music in the Air · `JM-26` Smart Kitchen Scale · `F-01 (YI)` Arduino Uno Basics · `YI-07` Gesture-Controlled Robot Arm · `YI-10` Wireless Doorbell with Visitor Counter · `YI-32` Build Your Own Game Controller · `F-01 (TL)` Arduino Uno Basics · and 3 more


#### Resistor 10k ohm

**Also called:** Resistor (Circuit Lab part `resistor`)

**Used in 25 activities** across Little Explorers, Junior Makers, Young Innovators, Tech Leaders · issued group.

**How it behaves:** Limits current. 220 Ω protects an LED. 10 kΩ is used as a pull-down for buttons.

**Numbers that matter:** Colour bands brown-black-orange-gold. The standard pull-up or pull-down value for a button, and one half of most voltage dividers in this kit.

**What usually goes wrong:** Leaving a button input floating with no pull-up and no INPUT_PULLUP in the code, which gives readings that flicker at random.

**Saying it to a child:** A much narrower pipe than the 220. This one is for telling the board which way a switch is sitting, not for lighting things.

**Code that drives it** (written with the default pins above):

```cpp
// A resistor needs no code, but it decides how bright an LED is.
// Swap the value in the inspector and watch what happens.
const int LED = 9;

void setup() { pinMode(LED, OUTPUT); Serial.begin(9600); }

void loop() {
  for (int b = 0; b <= 255; b += 5) { analogWrite(LED, b); delay(12); }
  for (int b = 255; b >= 0; b -= 5) { analogWrite(LED, b); delay(12); }
  Serial.println("A bigger resistor means less current and a dimmer LED");
}
```

**Notes on the kit list:** HC-05 divider; Voltage divider; Echo divider

**Appears in:** `LE-02` Push-Button Doorbell · `LE-06` Hot & Cold Temperature Indicator · `LE-09` Waving Robot Arm · `LE-12` Morse Code Light Messenger · `LE-22` Button Melody Maker · `LE-32` Countdown Rocket Launch · `JM-02` Two-Player Reaction Timer with Scoreboard · `JM-03` Mini Weather Station with OLED Display · `JM-09` Home Burglar Alarm with Secret Code · `JM-12` Phone-Controlled RGB Mood Lamp · `JM-13` Step Counter Fitness Tracker · `JM-15` Pong Game with a Knob Controller · `JM-23` Ultrasonic Theremin: Music in the Air · `JM-26` Smart Kitchen Scale · `YI-01` 555 Timer Alarm Siren Circuit · `YI-06` Bluetooth Robot Car with Phone App · `YI-09` Rechargeable Power Pack for Robots · `YI-10` Wireless Doorbell with Visitor Counter · and 7 more


#### Resistor 1k ohm

**Also called:** Resistor (Circuit Lab part `resistor`)

**Used in 4 activities** across Junior Makers, Young Innovators, Tech Leaders · issued group.

**How it behaves:** Limits current. 220 Ω protects an LED. 10 kΩ is used as a pull-down for buttons.

**Code that drives it** (written with the default pins above):

```cpp
// A resistor needs no code, but it decides how bright an LED is.
// Swap the value in the inspector and watch what happens.
const int LED = 9;

void setup() { pinMode(LED, OUTPUT); Serial.begin(9600); }

void loop() {
  for (int b = 0; b <= 255; b += 5) { analogWrite(LED, b); delay(12); }
  for (int b = 255; b >= 0; b -= 5) { analogWrite(LED, b); delay(12); }
  Serial.println("A bigger resistor means less current and a dimmer LED");
}
```

**Notes on the kit list:** HC-05 divider; Echo divider

**Appears in:** `JM-12` Phone-Controlled RGB Mood Lamp · `YI-01` 555 Timer Alarm Siren Circuit · `YI-06` Bluetooth Robot Car with Phone App · `TL-07` Smart Parking Occupancy Dashboard


#### Resistor 220 ohm

**Also called:** Resistor (Circuit Lab part `resistor`)

**Used in 70 activities** across Little Explorers, Junior Makers, Young Innovators, Tech Leaders · issued group.

**How it behaves:** Limits current. 220 Ω protects an LED. 10 kΩ is used as a pull-down for buttons.

**Numbers that matter:** Colour bands red-red-brown-gold. In an LED circuit it sets the current: (5 V - 2 V) / 220 = about 14 mA.

**What usually goes wrong:** Treating the resistor as optional, or putting it in the wrong leg. It works in either leg, which surprises students, because the same current flows all the way round.

**Saying it to a child:** A narrow bit in the pipe. It stops so much electricity rushing through that the light burns out.

**Code that drives it** (written with the default pins above):

```cpp
// A resistor needs no code, but it decides how bright an LED is.
// Swap the value in the inspector and watch what happens.
const int LED = 9;

void setup() { pinMode(LED, OUTPUT); Serial.begin(9600); }

void loop() {
  for (int b = 0; b <= 255; b += 5) { analogWrite(LED, b); delay(12); }
  for (int b = 255; b >= 0; b -= 5) { analogWrite(LED, b); delay(12); }
  Serial.println("A bigger resistor means less current and a dimmer LED");
}
```

**Notes on the kit list:** Added: for the LED; Data line

**Appears in:** `F-00 (LE)` Welcome to Robotics (Distance Alarm) · `F-01 (LE)` Arduino Uno Basics · `F-02 (LE)` ESP32 Basics · `LE-02` Push-Button Doorbell · `LE-04` Traffic Light Controller · `LE-05` Automatic Night Lamp · `LE-06` Hot & Cold Temperature Indicator · `LE-07` Plant Water Alarm · `LE-08` Motion Detector Room Alarm · `LE-09` Waving Robot Arm · `LE-10` Automatic Railway Crossing Gate · `LE-12` Morse Code Light Messenger · `LE-21` Rainbow LED Ring · `LE-22` Button Melody Maker · `LE-23` Colour Detective Sensor · `LE-32` Countdown Rocket Launch · `F-00 (JM)` Welcome to Robotics (Distance Alarm) · `F-01 (JM)` Arduino Uno Basics · and 52 more


#### RGB LED

**Used in 2 activities** across Little Explorers, Junior Makers · issued group.

**How it behaves:** Three LEDs in one. COM to GND (common cathode). analogWrite on R, G and B mixes any colour.


| Pin on the part | What it is | Where it goes by default |
|---|---|---|
| `R` | Signal | Arduino pin 9 |
| `G` | Signal | Arduino pin 10 |
| `B` | Signal | Arduino pin 11 |

**Code that drives it** (written with the default pins above):

```cpp
// Mix colours on an RGB LED (use ~ PWM pins)
const int R = 9, G = 10, B = 11;

void colour(int r, int g, int b) {
  analogWrite(R, r); analogWrite(G, g); analogWrite(B, b);
}

void setup() {}

void loop() {
  colour(255, 0, 0);   delay(700);   // red
  colour(0, 255, 0);   delay(700);   // green
  colour(0, 0, 255);   delay(700);   // blue
  colour(255, 120, 0); delay(700);   // orange
  colour(150, 0, 255); delay(700);   // purple
}
```

**Appears in:** `LE-23` Colour Detective Sensor · `JM-12` Phone-Controlled RGB Mood Lamp


#### Slide switch

**Used in 2 activities** across Junior Makers · issued group.

**How it behaves:** The middle pin (2) connects to pin 1 or pin 3.


| Pin on the part | What it is | Where it goes by default |
|---|---|---|
| `2` | Signal | Arduino pin 7 |

**Code that drives it** (written with the default pins above):

```cpp
// Slide switch turns the built-in LED on and off
const int SWITCH = 7;   // middle pin
// pin 1 to 5V, pin 3 to GND: the middle pin follows the slider

void setup() {
  pinMode(SWITCH, INPUT);
  pinMode(LED_BUILTIN, OUTPUT);
  Serial.begin(9600);
}

void loop() {
  bool on = digitalRead(SWITCH) == HIGH;
  digitalWrite(LED_BUILTIN, on);
  Serial.println(on ? "Switch: ON" : "Switch: OFF");
  delay(300);
}
```

**Notes on the kit list:** Optional

**Appears in:** `JM-00` Intro to Robotics + Art Bot · `JM-01` Series & Parallel Circuit Lab


### Logic & chips

#### 555 timer IC

**Used in 1 activity** across Young Innovators · issued group.

An eight-pin chip that makes a square wave, or a single timed pulse, out of two resistors and a capacitor. It predates microcontrollers and is still the clearest way to show that timing can be built from physics rather than code.

The capacitor charges through both resistors and discharges through one. Two comparators inside watch the capacitor's voltage and flip the output at one third and two thirds of the supply. That is the whole trick.

**Numbers that matter:** Astable frequency = 1.44 / ((R1 + 2 x R2) x C). With R1 = 10k, R2 = 47k and C = 1 uF it runs near 13 Hz. Supply 4.5 to 15 V. Output can drive about 200 mA, far more than an Arduino pin.

**What usually goes wrong:** Leaving pin 4 (reset) floating, which gives random behaviour. It must go to the positive rail. Forgetting the 0.01 uF capacitor on pin 5.

**Saying it to a child:** A chip that can count time by filling and emptying a tiny bucket of electricity, over and over.

**Appears in:** `YI-01` 555 Timer Alarm Siren Circuit


### Input

#### 4x4 matrix keypad

**Also called:** Keypad 4×4 (Circuit Lab part `keypad`)

**Used in 2 activities** across Junior Makers, Tech Leaders · issued class / group.

**How it behaves:** Rows R1-R4 and columns C1-C4 go to 8 digital pins. Use the Keypad library. Click the keys while running.


| Pin on the part | What it is | Where it goes by default |
|---|---|---|
| `R1` | Signal | Arduino pin 9 |
| `R2` | Signal | Arduino pin 8 |
| `R3` | Signal | Arduino pin 7 |
| `R4` | Signal | Arduino pin 6 |
| `C1` | Signal | Arduino pin 5 |
| `C2` | Signal | Arduino pin 4 |
| `C3` | Signal | Arduino pin 3 |
| `C4` | Signal | Arduino pin 2 |

**Code that drives it** (written with the default pins above):

```cpp
// 4x4 keypad
#include <Keypad.h>
const byte ROWS = 4, COLS = 4;
char keys[ROWS][COLS] = {
  {'1','2','3','A'},
  {'4','5','6','B'},
  {'7','8','9','C'},
  {'*','0','#','D'}
};
byte rowPins[ROWS] = {9, 8, 7, 6};
byte colPins[COLS] = {5, 4, 3, 2};
Keypad keypad = Keypad(makeKeymap(keys), rowPins, colPins, ROWS, COLS);

void setup() {
  Serial.begin(9600);
}

void loop() {
  char key = keypad.getKey();
  if (key) Serial.println(key);
}
```

**Notes on the kit list:** Optional final lock prop

**Appears in:** `JM-32` Cyber Safety Escape Room · `TL-08` Two-Factor Smart Locker with Intrusion Alerts


#### Joystick module

**Also called:** Joystick (Circuit Lab part `joystick`)

**Used in 4 activities** across Junior Makers, Young Innovators, Tech Leaders · issued group.

**How it behaves:** VERT and HORZ to analog pins: about 512 in the middle, higher when pushed up or left. SEL is a button: use INPUT_PULLUP, it reads LOW when pressed.


| Pin on the part | What it is | Where it goes by default |
|---|---|---|
| `HORZ` | Signal | Arduino pin A0 |
| `VERT` | Signal | Arduino pin A1 |
| `SEL` | Signal | Arduino pin 2 |
| `VCC` | Power in | 5V (or 3V3 on an ESP32) |
| `GND` | Ground | GND |

**Code that drives it** (written with the default pins above):

```cpp
// Read a joystick
const int VX = A0, VY = A1, SW = 2;

void setup() {
  pinMode(SW, INPUT_PULLUP);
  Serial.begin(9600);
}

void loop() {
  Serial.print("X: "); Serial.print(analogRead(VX));
  Serial.print("  Y: "); Serial.print(analogRead(VY));
  Serial.print("  Button: "); Serial.println(digitalRead(SW) == LOW ? "pressed" : "-");
  delay(150);
}
```

**Appears in:** `JM-20` Joystick Maze Game · `JM-27` Arcade Claw Machine · `YI-32` Build Your Own Game Controller · `TL-16` Motion-Controlled Game


### Sensors

#### Colour sensor TCS34725

**Used in 1 activity** across Little Explorers · issued group.

**How it behaves:** Reads red, green and blue light on I2C. Use Adafruit_TCS34725.


| Pin on the part | What it is | Where it goes by default |
|---|---|---|
| `VIN` | Power in | 5V (or 3V3 on an ESP32) |
| `GND` | Ground | GND |
| `SDA` | I2C bus | A4 on an Arduino Uno, GPIO 21 on an ESP32 |
| `SCL` | I2C bus | A5 on an Arduino Uno, GPIO 22 on an ESP32 |

**Code that drives it** (written with the default pins above):

```cpp
// Colour sensor
#include <Wire.h>
#include <Adafruit_TCS34725.h>
Adafruit_TCS34725 tcs(TCS34725_INTEGRATIONTIME_50MS, TCS34725_GAIN_4X);

void setup() {
  Serial.begin(9600);
  if (!tcs.begin()) { Serial.println("Colour sensor not found"); while (1); }
}

void loop() {
  float r, g, b;
  tcs.getRGB(&r, &g, &b);
  Serial.print("R "); Serial.print((int)r);
  Serial.print("  G "); Serial.print((int)g);
  Serial.print("  B "); Serial.println((int)b);
  delay(500);
}
```

**Notes on the kit list:** Pre-wired

**Appears in:** `LE-23` Colour Detective Sensor


#### Current sensor INA219

**Used in 1 activity** across Young Innovators · issued group.

**How it behaves:** Measures voltage, current and power of a gadget on I2C. Use Adafruit_INA219.


| Pin on the part | What it is | Where it goes by default |
|---|---|---|
| `VCC` | Power in | 5V (or 3V3 on an ESP32) |
| `GND` | Ground | GND |
| `SDA` | I2C bus | A4 on an Arduino Uno, GPIO 21 on an ESP32 |
| `SCL` | I2C bus | A5 on an Arduino Uno, GPIO 22 on an ESP32 |

**Code that drives it** (written with the default pins above):

```cpp
// Measure power with an INA219
#include <Wire.h>
#include <Adafruit_INA219.h>
Adafruit_INA219 ina;

void setup() {
  Serial.begin(9600);
  if (!ina.begin()) { Serial.println("INA219 not found"); while (1); }
}

void loop() {
  Serial.print(ina.getBusVoltage_V(), 2); Serial.print(" V   ");
  Serial.print(ina.getCurrent_mA(), 1);   Serial.print(" mA   ");
  Serial.print(ina.getPower_mW(), 0);     Serial.println(" mW");
  delay(1000);
}
```

**Appears in:** `YI-27` Energy Detective: How Much Power Do Gadgets Use?


#### DHT22 sensor

**Also called:** DHT22 temp & humidity (Circuit Lab part `dht22`)

**Used in 11 activities** across Little Explorers, Junior Makers, Young Innovators, Tech Leaders · issued group.

**How it behaves:** VCC to 5V, GND, SDA (data) to a digital pin. Use the DHT library.


| Pin on the part | What it is | Where it goes by default |
|---|---|---|
| `DATA` (marked SDA on some boards) | Single data wire, not I2C | Arduino pin 2 (GPIO 4 on an ESP32) |
| `VCC` | Power in | 5V (or 3V3 on an ESP32) |
| `GND` | Ground | GND |

**Code that drives it** (written with the default pins above):

```cpp
// Temperature and humidity with a DHT22
#include <DHT.h>
DHT dht(2, DHT22);

void setup() {
  Serial.begin(9600);
  dht.begin();
}

void loop() {
  float t = dht.readTemperature();
  float h = dht.readHumidity();
  Serial.print("Temp: "); Serial.print(t, 1); Serial.print(" C   ");
  Serial.print("Humidity: "); Serial.print(h, 1); Serial.println(" %");
  delay(2000);
}
```

**Appears in:** `LE-06` Hot & Cold Temperature Indicator · `JM-03` Mini Weather Station with OLED Display · `JM-07` Temperature-Controlled Smart Fan · `YI-11` Wi-Fi Automatic Plant Watering System · `YI-21` Python Data Lab: Is Our Classroom Too Hot? · `TL-01` Solar-Powered Off-Grid Weather Node · `TL-05` ESP-NOW Wireless Sensor Network · `TL-06` Smart Home Cloud Control Hub · `TL-09` Sensor Data Logging & Analysis Pipeline · `TL-10` Machine Learning Rain Predictor · `TL-12` Web-Controlled Devices via REST API


#### Flame sensor

**Used in 2 activities** across Junior Makers, Tech Leaders · issued group.

**How it behaves:** Sees infrared light from a flame. DO goes LOW and AO drops when there is a flame.


| Pin on the part | What it is | Where it goes by default |
|---|---|---|
| `DO` | Signal | Arduino pin 2 |
| `VCC` | Power in | 5V (or 3V3 on an ESP32) |
| `GND` | Ground | GND |

**Code that drives it** (written with the default pins above):

```cpp
// Flame sensor
const int FLAME = 2;

void setup() {
  pinMode(FLAME, INPUT);
  Serial.begin(9600);
}

void loop() {
  Serial.println(digitalRead(FLAME) == LOW ? "FIRE!" : "no flame");
  delay(300);
}
```

**Appears in:** `JM-06` Fire & Gas Safety Alarm Panel · `TL-14` Autonomous Fire-Fighting Robot


#### IR sensor module

**Also called:** IR obstacle sensor (Circuit Lab parts: `ir`, `irline`)

**Used in 3 activities** across Junior Makers, Young Innovators · issued group.

**How it behaves:** OUT goes LOW when something is close in front of the sensor.


| Pin on the part | What it is | Where it goes by default |
|---|---|---|
| `OUT` | Signal | Arduino pin 2 |
| `VCC` | Power in | 5V (or 3V3 on an ESP32) |
| `GND` | Ground | GND |

**Code that drives it** (written with the default pins above):

```cpp
// IR obstacle sensor (LOW = object)
const int IR = 2;

void setup() {
  pinMode(IR, INPUT);
  Serial.begin(9600);
}

void loop() {
  Serial.println(digitalRead(IR) == LOW ? "Object!" : "clear");
  delay(200);
}
```

**Notes on the kit list:** Edge sensors

**Appears in:** `JM-11` Line Following Robot · `JM-25` Smart Traffic Junction with Car Counter · `YI-25` Robot Sumo Challenge


#### LDR module

**Also called:** Light sensor (LDR) (Circuit Lab part `ldr`)

**Used in 9 activities** across Little Explorers, Junior Makers, Young Innovators, Tech Leaders · issued group.

**How it behaves:** AO gives a lower number in bright light and a higher number in the dark. DO goes HIGH when it is dark.


| Pin on the part | What it is | Where it goes by default |
|---|---|---|
| `AO` | Signal | Arduino pin A0 |
| `VCC` | Power in | 5V (or 3V3 on an ESP32) |
| `GND` | Ground | GND |

**Code that drives it** (written with the default pins above):

```cpp
// Read light level from an LDR module
const int LIGHT = A0;

void setup() {
  Serial.begin(9600);
}

void loop() {
  int dark = analogRead(LIGHT);   // higher = darker
  Serial.println(dark);
  delay(200);
}
```

**Appears in:** `LE-05` Automatic Night Lamp · `JM-03` Mini Weather Station with OLED Display · `JM-08` Sun-Tracking Solar Panel · `YI-03` Smart Classroom Energy Saver · `YI-23` Li-Fi Messenger: Sending Text with Light · `YI-28` Python Control Panel for Arduino · `TL-05` ESP-NOW Wireless Sensor Network · `TL-09` Sensor Data Logging & Analysis Pipeline · `TL-10` Machine Learning Rain Predictor


#### Load cell 5 kg + HX711

**Also called:** Load cell + HX711 (Circuit Lab part `hx711`)

**Used in 1 activity** across Junior Makers · issued group.

**How it behaves:** DT and SCK to two digital pins. Use the HX711 library. In Circuit Lab, set_scale(420) gives grams.


| Pin on the part | What it is | Where it goes by default |
|---|---|---|
| `DT` | Signal | Arduino pin 3 |
| `SCK` | Signal | Arduino pin 2 |
| `VCC` | Power in | 5V (or 3V3 on an ESP32) |
| `GND` | Ground | GND |

**Code that drives it** (written with the default pins above):

```cpp
// Kitchen scale with HX711
#include <HX711.h>
HX711 scale;

void setup() {
  Serial.begin(9600);
  scale.begin(3, 2);
  scale.set_scale(420.0);   // calibration factor
  scale.tare();             // empty scale = 0 g
}

void loop() {
  Serial.print("Weight: ");
  Serial.print(scale.get_units(5), 0);
  Serial.println(" g");
  delay(500);
}
```

**Appears in:** `JM-26` Smart Kitchen Scale


#### MPU6050 IMU

**Also called:** MPU6050 motion (Circuit Lab part `mpu6050`)

**Used in 6 activities** across Junior Makers, Young Innovators, Tech Leaders · issued group.

**How it behaves:** Accelerometer + gyroscope on I2C (SDA, SCL). Use Adafruit_MPU6050. Tilt it with the sliders.


| Pin on the part | What it is | Where it goes by default |
|---|---|---|
| `VCC` | Power in | 5V (or 3V3 on an ESP32) |
| `GND` | Ground | GND |
| `SDA` | I2C bus | A4 on an Arduino Uno, GPIO 21 on an ESP32 |
| `SCL` | I2C bus | A5 on an Arduino Uno, GPIO 22 on an ESP32 |

**Code that drives it** (written with the default pins above):

```cpp
// MPU6050 accelerometer and gyro
#include <Adafruit_MPU6050.h>
#include <Wire.h>
Adafruit_MPU6050 mpu;

void setup() {
  Serial.begin(9600);
  if (!mpu.begin()) { Serial.println("MPU6050 not found - check SDA/SCL"); while (1); }
}

void loop() {
  sensors_event_t a, g, t;
  mpu.getEvent(&a, &g, &t);
  Serial.print("Accel X: "); Serial.print(a.acceleration.x, 1);
  Serial.print("  Y: "); Serial.print(a.acceleration.y, 1);
  Serial.print("  Z: "); Serial.println(a.acceleration.z, 1);
  delay(300);
}
```

**Appears in:** `JM-13` Step Counter Fitness Tracker · `YI-07` Gesture-Controlled Robot Arm · `YI-22` Smart Posture Corrector Wearable · `YI-32` Build Your Own Game Controller · `TL-04` Fall Detection Wearable for the Elderly · `TL-19` TinyML Gesture Recogniser on ESP32


#### MQ-2 gas sensor

**Also called:** Gas / smoke MQ-2 (Circuit Lab part `mq2`)

**Used in 1 activity** across Junior Makers · issued group.

**How it behaves:** AO rises with smoke or gas (LPG, propane). DO goes LOW above the trimmer's threshold.


| Pin on the part | What it is | Where it goes by default |
|---|---|---|
| `AO` | Signal | Arduino pin A0 |
| `VCC` | Power in | 5V (or 3V3 on an ESP32) |
| `GND` | Ground | GND |

**Code that drives it** (written with the default pins above):

```cpp
// MQ-2 smoke / gas sensor
const int GAS = A0;

void setup() {
  Serial.begin(9600);
}

void loop() {
  int level = analogRead(GAS);
  Serial.print("Gas level: "); Serial.println(level);
  if (level > 400) Serial.println("  Warning: smoke or gas!");
  delay(500);
}
```

**Appears in:** `JM-06` Fire & Gas Safety Alarm Panel


#### PIR motion sensor

**Used in 6 activities** across Little Explorers, Junior Makers, Young Innovators, Tech Leaders · issued group.

**How it behaves:** OUT goes HIGH for a few seconds when it sees movement.

It does not see shapes. It watches for a change in the infrared heat falling on two halves of a sensor, so it triggers on something warm moving across its view, not on something warm sitting still.


| Pin on the part | What it is | Where it goes by default |
|---|---|---|
| `OUT` | Signal | Arduino pin 2 |
| `VCC` | Power in | 5V (or 3V3 on an ESP32) |
| `GND` | Ground | GND |

**Numbers that matter:** Needs 30 to 60 seconds to settle after power-up. Range about 7 m, viewing angle about 110 degrees. Two trim pots set sensitivity and how long the output stays high.

**What usually goes wrong:** Testing it in the first minute after switching on and concluding it is broken. Pointing it at a sunny window or a heater.

**Saying it to a child:** It feels body heat moving past, which is why it notices you walking but not a warm cup sitting on the table.

**Code that drives it** (written with the default pins above):

```cpp
// PIR motion sensor
const int PIR = 2;

void setup() {
  pinMode(PIR, INPUT);
  Serial.begin(9600);
}

void loop() {
  if (digitalRead(PIR) == HIGH) Serial.println("Motion detected!");
  delay(300);
}
```

**Appears in:** `LE-08` Motion Detector Room Alarm · `JM-09` Home Burglar Alarm with Secret Code · `YI-03` Smart Classroom Energy Saver · `YI-20` ESP32-CAM Wildlife Camera · `TL-06` Smart Home Cloud Control Hub · `TL-08` Two-Factor Smart Locker with Intrusion Alerts


#### Pulse sensor

**Used in 1 activity** across Young Innovators · issued group.

**How it behaves:** S gives a wave that peaks with every heartbeat (about 520 at rest, 700+ at a beat).


| Pin on the part | What it is | Where it goes by default |
|---|---|---|
| `S` | Signal | Arduino pin A0 |
| `+` | Power in | 5V (or 3V3 on an ESP32) |
| `-` | Ground | GND |

**Code that drives it** (written with the default pins above):

```cpp
// Pulse sensor: count beats
const int PULSE = A0;
int threshold = 600;
bool high = false;
unsigned long lastBeat = 0;

void setup() {
  Serial.begin(9600);
}

void loop() {
  int v = analogRead(PULSE);
  if (v > threshold && !high) {
    high = true;
    unsigned long now = millis();
    if (lastBeat) { Serial.print("BPM: "); Serial.println(60000 / (now - lastBeat)); }
    lastBeat = now;
  }
  if (v < threshold - 50) high = false;
  delay(10);
}
```

**Appears in:** `YI-02` Heart Rate Monitoring System


#### Rain sensor

**Used in 2 activities** across Junior Makers, Tech Leaders · issued group.

**How it behaves:** AO drops as the plate gets wet. DO goes LOW when it rains.


| Pin on the part | What it is | Where it goes by default |
|---|---|---|
| `AO` | Signal | Arduino pin A0 |
| `VCC` | Power in | 5V (or 3V3 on an ESP32) |
| `GND` | Ground | GND |

**Code that drives it** (written with the default pins above):

```cpp
// Rain sensor
const int RAIN = A0;

void setup() {
  Serial.begin(9600);
}

void loop() {
  int v = analogRead(RAIN);            // lower = wetter
  Serial.println(v < 600 ? "Raining!" : "Dry");
  delay(500);
}
```

**Appears in:** `JM-05` Rain-Sensing Automatic Window · `TL-10` Machine Learning Rain Predictor


#### Soil moisture sensor

**Used in 2 activities** across Little Explorers, Young Innovators · issued group.

**How it behaves:** AO reads about 1000 in dry soil and about 300 in wet soil. DO goes LOW when wet.

It measures the resistance between two probes. Water with dissolved salts conducts; dry soil does not. The reading is therefore about how much moisture, but also about how salty the soil is.


| Pin on the part | What it is | Where it goes by default |
|---|---|---|
| `AO` | Signal | Arduino pin A0 |
| `VCC` | Power in | 5V (or 3V3 on an ESP32) |
| `GND` | Ground | GND |

**Numbers that matter:** Dry soil reads near the top of the range and saturated soil near the bottom, so the number falls as it gets wetter, which is the opposite of what students expect.

**What usually goes wrong:** Leaving the cheap resistive probe powered all the time, which corrodes it away in weeks. Powering it from a digital pin and only switching it on to take a reading is the fix. Calibrating in the classroom and expecting the same numbers in a different soil.

**Saying it to a child:** It checks whether the soil is thirsty by seeing how easily electricity can hop between the two prongs. Wet soil lets it through; dry soil does not.

**Code that drives it** (written with the default pins above):

```cpp
// Soil moisture
const int SOIL = A0;

void setup() {
  Serial.begin(9600);
}

void loop() {
  int raw = analogRead(SOIL);              // high = dry
  int percent = map(raw, 1023, 300, 0, 100);
  percent = constrain(percent, 0, 100);
  Serial.print("Moisture: "); Serial.print(percent); Serial.println(" %");
  delay(500);
}
```

**Appears in:** `LE-07` Plant Water Alarm · `YI-11` Wi-Fi Automatic Plant Watering System


#### Sound sensor KY-037

**Used in 3 activities** across Junior Makers, Tech Leaders · issued group.

**How it behaves:** AO follows the loudness. DO goes HIGH on a loud sound (clap).


| Pin on the part | What it is | Where it goes by default |
|---|---|---|
| `AO` | Signal | Arduino pin A0 |
| `VCC` | Power in | 5V (or 3V3 on an ESP32) |
| `GND` | Ground | GND |

**Code that drives it** (written with the default pins above):

```cpp
// Sound sensor
const int MIC = A0;

void setup() {
  Serial.begin(9600);
}

void loop() {
  Serial.println(analogRead(MIC));
  delay(50);
}
```

**Appears in:** `JM-21` NeoPixel Light Show to the Beat · `TL-05` ESP-NOW Wireless Sensor Network · `TL-09` Sensor Data Logging & Analysis Pipeline


#### Ultrasonic sensor HC-SR04

**Also called:** Ultrasonic HC-SR04 (Circuit Lab part `hcsr04`)

**Used in 15 activities** across Little Explorers, Junior Makers, Young Innovators, Tech Leaders · issued group.

**How it behaves:** TRIG and ECHO to digital pins. Distance (cm) = echo time × 0.0343 ÷ 2.


| Pin on the part | What it is | Where it goes by default |
|---|---|---|
| `TRIG` | Signal | Arduino pin 9 |
| `ECHO` | Signal | Arduino pin 10 |
| `VCC` | Power in | 5V (or 3V3 on an ESP32) |
| `GND` | Ground | GND |

**Numbers that matter:** Measures 2 cm to about 400 cm. Sound travels at roughly 343 m/s, which is 29.1 microseconds per centimetre, and the pulse makes the trip twice, hence dividing by 58. Beam angle about 15 degrees.

**What usually goes wrong:** Expecting it to see soft or angled surfaces. Cloth absorbs the pulse and a surface at a slant reflects it away, so both read as nothing there. Also, polling it faster than every 60 ms, so the previous echo is still bouncing around.

**Saying it to a child:** It shouts, too high for you to hear, and times how long the echo takes to come back. Bats do the same thing.

**Code that drives it** (written with the default pins above):

```cpp
// Measure distance with an HC-SR04
const int TRIG = 9, ECHO = 10;

long readCM() {
  digitalWrite(TRIG, LOW);  delayMicroseconds(2);
  digitalWrite(TRIG, HIGH); delayMicroseconds(10);
  digitalWrite(TRIG, LOW);
  long t = pulseIn(ECHO, HIGH, 30000);
  return t * 0.0343 / 2;
}

void setup() {
  pinMode(TRIG, OUTPUT);
  pinMode(ECHO, INPUT);
  Serial.begin(9600);
}

void loop() {
  Serial.print("Distance: ");
  Serial.print(readCM());
  Serial.println(" cm");
  delay(300);
}
```

**Notes on the kit list:** Pre-fitted

**Appears in:** `F-00 (LE)` Welcome to Robotics (Distance Alarm) · `LE-10` Automatic Railway Crossing Gate · `LE-30` Follow-Me Robot Pet · `F-00 (JM)` Welcome to Robotics (Distance Alarm) · `JM-04` Smart Dustbin with Fill-Level Indicator · `JM-23` Ultrasonic Theremin: Music in the Air · `F-00 (YI)` Welcome to Robotics (Distance Alarm) · `YI-05` Obstacle Avoiding Robot with Scanning Sonar · `YI-18` Processing + Arduino: Live Sensor Radar · `YI-25` Robot Sumo Challenge · `F-00 (TL)` Welcome to Robotics (Distance Alarm) · `TL-02` Autonomous Maze Solving Robot · `TL-07` Smart Parking Occupancy Dashboard · `TL-26` Robot Swarm: Leader and Follower Cars · `TL-28` Smart Cane for the Visually Impaired


### Displays

#### MAX7219 8x8 LED matrix

**Also called:** 8×8 LED matrix MAX7219 (Circuit Lab part `max7219`)

**Used in 1 activity** across Junior Makers · issued group.

**How it behaves:** DIN, CS and CLK to three digital pins. Use LedControl: lc.setRow(0, row, pattern).


| Pin on the part | What it is | Where it goes by default |
|---|---|---|
| `DIN` | Signal | Arduino pin 12 |
| `CLK` | Signal | Arduino pin 11 |
| `CS` | Signal | Arduino pin 10 |
| `VCC` | Power in | 5V (or 3V3 on an ESP32) |
| `GND` | Ground | GND |

**Code that drives it** (written with the default pins above):

```cpp
// 8x8 LED matrix smiley
#include <LedControl.h>
LedControl lc(12, 11, 10, 1);   // DIN, CLK, CS, number of matrices
byte smile[8] = {B00111100, B01000010, B10100101, B10000001, B10100101, B10011001, B01000010, B00111100};

void setup() {
  lc.shutdown(0, false);
  lc.setIntensity(0, 6);
  lc.clearDisplay(0);
}

void loop() {
  for (int r = 0; r < 8; r++) lc.setRow(0, r, smile[r]);
  delay(1000);
  lc.clearDisplay(0);
  delay(300);
}
```

**Appears in:** `JM-22` 8x8 LED Matrix Emoji Display


#### OLED 0.96 in I2C

**Also called:** OLED 0.96" I2C (Circuit Lab part `oled`)

**Used in 16 activities** across Junior Makers, Young Innovators, Tech Leaders · issued group.

**How it behaves:** 128×64 pixel screen on I2C (SDA, SCL). Use Adafruit_SSD1306 at address 0x3C.


| Pin on the part | What it is | Where it goes by default |
|---|---|---|
| `VCC` | Power in | 5V (or 3V3 on an ESP32) |
| `GND` | Ground | GND |
| `SDA` | I2C bus | A4 on an Arduino Uno, GPIO 21 on an ESP32 |
| `SCL` | I2C bus | A5 on an Arduino Uno, GPIO 22 on an ESP32 |

**Numbers that matter:** 128 x 64 pixels, white on black, address usually 0x3C and sometimes 0x3D. Talks over I2C on A4 (SDA) and A5 (SCL) on an Uno.

**What usually goes wrong:** The wrong I2C address, which shows as a blank screen with no error. Running an I2C scanner sketch is the quickest way to settle it. Also, the Adafruit library needs about 1 KB of the Uno's 2 KB of RAM for the screen buffer, so a large sketch can run out.

**Saying it to a child:** A tiny screen so your project can tell you what it is thinking, instead of you guessing from a blinking light.

**Code that drives it** (written with the default pins above):

```cpp
// OLED display
#include <Wire.h>
#include <Adafruit_GFX.h>
#include <Adafruit_SSD1306.h>
Adafruit_SSD1306 display(128, 64, &Wire, -1);

void setup() {
  display.begin(SSD1306_SWITCHCAPVCC, 0x3C);
  display.clearDisplay();
  display.setTextColor(SSD1306_WHITE);
  display.setTextSize(2);
  display.setCursor(0, 0);
  display.println("Hello!");
  display.setTextSize(1);
  display.println("Robotics & AI Club");
  display.drawRect(0, 40, 128, 20, SSD1306_WHITE);
  display.display();
}

void loop() {
  display.fillRect(2, 42, (millis() / 50) % 124, 16, SSD1306_WHITE);
  display.display();
  delay(50);
  if ((millis() / 50) % 124 == 0) { display.fillRect(2, 42, 124, 16, SSD1306_BLACK); }
}
```

**Appears in:** `JM-02` Two-Player Reaction Timer with Scoreboard · `JM-03` Mini Weather Station with OLED Display · `JM-06` Fire & Gas Safety Alarm Panel · `JM-07` Temperature-Controlled Smart Fan · `JM-13` Step Counter Fitness Tracker · `JM-25` Smart Traffic Junction with Car Counter · `JM-26` Smart Kitchen Scale · `YI-02` Heart Rate Monitoring System · `YI-03` Smart Classroom Energy Saver · `YI-08` RFID Smart Door Lock with Access Log · `YI-09` Rechargeable Power Pack for Robots · `YI-10` Wireless Doorbell with Visitor Counter · `YI-22` Smart Posture Corrector Wearable · `YI-27` Energy Detective: How Much Power Do Gadgets Use? · `TL-05` ESP-NOW Wireless Sensor Network · `TL-08` Two-Factor Smart Locker with Intrusion Alerts


### Light & sound

#### Buzzer

**Used in 65 activities** across Little Explorers, Junior Makers, Young Innovators, Tech Leaders · issued group.

**How it behaves:** Pin 2 (+) to a digital pin, pin 1 (−) to GND. tone(pin, frequency) plays a note.

An active buzzer has its own oscillator inside: give it power and it makes one fixed note. A passive buzzer needs the board to send it a frequency with tone(), which is how it can play a tune.


| Pin on the part | What it is | Where it goes by default |
|---|---|---|
| `2` | Signal | Arduino pin 8 |

**What usually goes wrong:** Trying to play a melody on an active buzzer and getting one flat beep whatever the code says.

**Saying it to a child:** A tiny speaker that can only really manage beeps.

**Code that drives it** (written with the default pins above):

```cpp
// Play a melody on a buzzer
const int BUZZER = 8;
int notes[] = {262, 294, 330, 349, 392, 440, 494, 523};

void setup() {}

void loop() {
  for (int i = 0; i < 8; i++) {
    tone(BUZZER, notes[i], 250);
    delay(300);
  }
  delay(1000);
}
```

**Notes on the kit list:** Added: every Arduino class

**Appears in:** `F-00 (LE)` Welcome to Robotics (Distance Alarm) · `F-01 (LE)` Arduino Uno Basics · `LE-02` Push-Button Doorbell · `LE-04` Traffic Light Controller · `LE-05` Automatic Night Lamp · `LE-06` Hot & Cold Temperature Indicator · `LE-07` Plant Water Alarm · `LE-08` Motion Detector Room Alarm · `LE-09` Waving Robot Arm · `LE-10` Automatic Railway Crossing Gate · `LE-12` Morse Code Light Messenger · `LE-21` Rainbow LED Ring · `LE-22` Button Melody Maker · `LE-23` Colour Detective Sensor · `LE-32` Countdown Rocket Launch · `F-00 (JM)` Welcome to Robotics (Distance Alarm) · `F-01 (JM)` Arduino Uno Basics · `JM-02` Two-Player Reaction Timer with Scoreboard · and 47 more


#### Low-voltage LED lamp (5 V)

**Also called:** 5V lamp (Circuit Lab part `lamp`)

**Used in 4 activities** across Young Innovators, Tech Leaders · issued group.

**How it behaves:** A lamp that needs more current than a pin gives. Switch it with a relay.

**Code that drives it** (written with the default pins above):

```cpp
// A 5 V lamp needs more current than a pin can give: switch it with a relay.
const int RELAY = 7;

void setup() { pinMode(RELAY, OUTPUT); Serial.begin(9600); }

void loop() {
  Serial.println("Lamp on");
  digitalWrite(RELAY, HIGH);
  delay(2000);
  Serial.println("Lamp off");
  digitalWrite(RELAY, LOW);
  delay(2000);
}
```

**Appears in:** `YI-03` Smart Classroom Energy Saver · `TL-06` Smart Home Cloud Control Hub · `TL-12` Web-Controlled Devices via REST API · `TL-23` Smart Microgrid Model


#### Passive buzzer

**Also called:** Buzzer (Circuit Lab part `buzzer`)

**Used in 2 activities** across Little Explorers, Junior Makers · issued group.

**How it behaves:** Pin 2 (+) to a digital pin, pin 1 (−) to GND. tone(pin, frequency) plays a note.


| Pin on the part | What it is | Where it goes by default |
|---|---|---|
| `2` | Signal | Arduino pin 8 |

**Code that drives it** (written with the default pins above):

```cpp
// Play a melody on a buzzer
const int BUZZER = 8;
int notes[] = {262, 294, 330, 349, 392, 440, 494, 523};

void setup() {}

void loop() {
  for (int i = 0; i < 8; i++) {
    tone(BUZZER, notes[i], 250);
    delay(300);
  }
  delay(1000);
}
```

**Appears in:** `LE-22` Button Melody Maker · `JM-23` Ultrasonic Theremin: Music in the Air


#### WS2812B LED ring (12 LEDs)

**Also called:** NeoPixel ring (Circuit Lab part `ledring`)

**Used in 1 activity** across Little Explorers · issued group.

**How it behaves:** VCC 5V, GND, DIN to a digital pin. Use Adafruit_NeoPixel.


| Pin on the part | What it is | Where it goes by default |
|---|---|---|
| `DIN` | Signal | Arduino pin 6 |
| `VCC` | Power in | 5V (or 3V3 on an ESP32) |
| `GND` | Ground | GND |

**Code that drives it** (written with the default pins above):

```cpp
// NeoPixel ring rainbow
#include <Adafruit_NeoPixel.h>
Adafruit_NeoPixel ring(12, 6, NEO_GRB + NEO_KHZ800);

void setup() {
  ring.begin();
  ring.setBrightness(80);
}

void loop() {
  for (long hue = 0; hue < 65536; hue += 1024) {
    for (int i = 0; i < ring.numPixels(); i++)
      ring.setPixelColor(i, ring.ColorHSV(hue + i * 65536L / ring.numPixels()));
    ring.show();
    delay(20);
  }
}
```

**Notes on the kit list:** Pre-wired

**Appears in:** `LE-21` Rainbow LED Ring


#### WS2812B LED strip (1 m, 30 LEDs)

**Also called:** NeoPixel LED strip (Circuit Lab part `ledstrip`)

**Used in 1 activity** across Junior Makers · issued group.

**How it behaves:** WS2812B strip: 5V, GND, DIN to a digital pin. Use Adafruit_NeoPixel.


| Pin on the part | What it is | Where it goes by default |
|---|---|---|
| `DIN` | Signal | Arduino pin 6 |
| `5V` | Power in | 5V (or 3V3 on an ESP32) |
| `GND` | Ground | GND |

**Code that drives it** (written with the default pins above):

```cpp
// LED strip chase
#include <Adafruit_NeoPixel.h>
const int N = 16;
Adafruit_NeoPixel strip(N, 6, NEO_GRB + NEO_KHZ800);

void setup() {
  strip.begin();
  strip.setBrightness(80);
}

void loop() {
  for (int i = 0; i < N; i++) {
    strip.clear();
    strip.setPixelColor(i, strip.Color(0, 150, 255));
    strip.show();
    delay(60);
  }
}
```

**Appears in:** `JM-21` NeoPixel Light Show to the Beat


### Motion

#### 2WD robot chassis kit

**Also called:** L298N motor driver (Circuit Lab part `l298n`)

**Used in 5 activities** across Junior Makers, Young Innovators, Tech Leaders · issued group.

**How it behaves:** IN1/IN2 set motor A's direction, ENA (PWM) its speed. IN3/IN4/ENB for motor B. Power from a battery on 12V, and join GND to the Arduino GND.


| Pin on the part | What it is | Where it goes by default |
|---|---|---|
| `ENA` | Signal | Arduino pin 5 |
| `IN1` | Signal | Arduino pin 7 |
| `IN2` | Signal | Arduino pin 8 |
| `ENB` | Signal | Arduino pin 6 |
| `IN3` | Signal | Arduino pin 9 |
| `IN4` | Signal | Arduino pin 11 |
| `GND` | Ground | GND |

**Code that drives it** (written with the default pins above):

```cpp
// Drive two motors with an L298N
const int ENA = 5, IN1 = 7, IN2 = 8;
const int ENB = 6, IN3 = 9, IN4 = 11;

void drive(int left, int right) {   // -255 .. 255
  digitalWrite(IN1, left > 0);  digitalWrite(IN2, left < 0);  analogWrite(ENA, abs(left));
  digitalWrite(IN3, right > 0); digitalWrite(IN4, right < 0); analogWrite(ENB, abs(right));
}

void setup() {
  int pins[] = {ENA, IN1, IN2, ENB, IN3, IN4};
  for (int i = 0; i < 6; i++) pinMode(pins[i], OUTPUT);
}

void loop() {
  drive(200, 200);   delay(1500);   // forward
  drive(-200, 200);  delay(700);    // turn left
  drive(-180, -180); delay(1000);   // backward
  drive(0, 0);       delay(1000);   // stop
}
```

**Appears in:** `JM-11` Line Following Robot · `YI-05` Obstacle Avoiding Robot with Scanning Sonar · `YI-06` Bluetooth Robot Car with Phone App · `TL-02` Autonomous Maze Solving Robot · `TL-14` Autonomous Fire-Fighting Robot


#### 4WD robot car (assembled, L298N)

**Also called:** L298N motor driver (Circuit Lab part `l298n`)

**Used in 5 activities** across Little Explorers, Young Innovators, Tech Leaders · issued group.

**How it behaves:** IN1/IN2 set motor A's direction, ENA (PWM) its speed. IN3/IN4/ENB for motor B. Power from a battery on 12V, and join GND to the Arduino GND.


| Pin on the part | What it is | Where it goes by default |
|---|---|---|
| `ENA` | Signal | Arduino pin 5 |
| `IN1` | Signal | Arduino pin 7 |
| `IN2` | Signal | Arduino pin 8 |
| `ENB` | Signal | Arduino pin 6 |
| `IN3` | Signal | Arduino pin 9 |
| `IN4` | Signal | Arduino pin 11 |
| `GND` | Ground | GND |

**Code that drives it** (written with the default pins above):

```cpp
// Drive two motors with an L298N
const int ENA = 5, IN1 = 7, IN2 = 8;
const int ENB = 6, IN3 = 9, IN4 = 11;

void drive(int left, int right) {   // -255 .. 255
  digitalWrite(IN1, left > 0);  digitalWrite(IN2, left < 0);  analogWrite(ENA, abs(left));
  digitalWrite(IN3, right > 0); digitalWrite(IN4, right < 0); analogWrite(ENB, abs(right));
}

void setup() {
  int pins[] = {ENA, IN1, IN2, ENB, IN3, IN4};
  for (int i = 0; i < 6; i++) pinMode(pins[i], OUTPUT);
}

void loop() {
  drive(200, 200);   delay(1500);   // forward
  drive(-200, 200);  delay(700);    // turn left
  drive(-180, -180); delay(1000);   // backward
  drive(0, 0);       delay(1000);   // stop
}
```

**Notes on the kit list:** From Phase 2B requisition; Two groups pair up: leader + follower

**Appears in:** `LE-19` Program the Robot Car Through a Floor Maze · `LE-30` Follow-Me Robot Pet · `YI-25` Robot Sumo Challenge · `TL-18` Vision-Guided Robot Car · `TL-26` Robot Swarm: Leader and Follower Cars


#### 5 V DC fan

**Also called:** 5V DC fan (Circuit Lab part `fan`)

**Used in 3 activities** across Junior Makers, Tech Leaders · issued class / group.

**How it behaves:** Needs more current than a pin: switch it with a relay or the L298N.

**Code that drives it** (written with the default pins above):

```cpp
// A 5 V fan switched by a relay, with a temperature rule
const int RELAY = 7;
const int SENSOR = A0;

void setup() { pinMode(RELAY, OUTPUT); Serial.begin(9600); }

void loop() {
  int raw = analogRead(SENSOR);
  bool hot = raw > 500;
  digitalWrite(RELAY, hot);
  Serial.print(raw);
  Serial.println(hot ? "  fan ON" : "  fan off");
  delay(600);
}
```

**Notes on the kit list:** Or a desk fan as the wind

**Appears in:** `JM-28` Wind Turbine Power Lab · `TL-06` Smart Home Cloud Control Hub · `TL-14` Autonomous Fire-Fighting Robot


#### DC hobby motor

**Also called:** DC motor (Circuit Lab part `dcmotor`)

**Used in 7 activities** across Little Explorers, Junior Makers, Young Innovators, Tech Leaders · issued group.

**How it behaves:** Connect to OUT1/OUT2 of an L298N. Arduino pins cannot power a motor directly.

**Code that drives it** (written with the default pins above):

```cpp
// A DC motor through an L298N: forwards, stop, backwards
const int ENA = 5, IN1 = 7, IN2 = 8;

void setup() {
  pinMode(ENA, OUTPUT); pinMode(IN1, OUTPUT); pinMode(IN2, OUTPUT);
  Serial.begin(9600);
}

void loop() {
  Serial.println("Forwards");
  digitalWrite(IN1, HIGH); digitalWrite(IN2, LOW); analogWrite(ENA, 200);
  delay(2000);
  Serial.println("Stop");
  analogWrite(ENA, 0);
  delay(800);
  Serial.println("Backwards");
  digitalWrite(IN1, LOW); digitalWrite(IN2, HIGH); analogWrite(ENA, 200);
  delay(2000);
  analogWrite(ENA, 0);
  delay(800);
}
```

**Notes on the kit list:** With fan blade; Geared TT motor

**Appears in:** `LE-24` Crank-Powered Light: Be the Power Station · `JM-00` Intro to Robotics + Art Bot · `JM-07` Temperature-Controlled Smart Fan · `JM-28` Wind Turbine Power Lab · `YI-26` Walking Linkage Robot · `YI-27` Energy Detective: How Much Power Do Gadgets Use? · `TL-27` 3D-Printed Gearbox and Gear Ratios


#### L298N motor driver

**Used in 6 activities** across Junior Makers, Young Innovators, Tech Leaders · issued group.

**How it behaves:** IN1/IN2 set motor A's direction, ENA (PWM) its speed. IN3/IN4/ENB for motor B. Power from a battery on 12V, and join GND to the Arduino GND.


| Pin on the part | What it is | Where it goes by default |
|---|---|---|
| `ENA` | Signal | Arduino pin 5 |
| `IN1` | Signal | Arduino pin 7 |
| `IN2` | Signal | Arduino pin 8 |
| `ENB` | Signal | Arduino pin 6 |
| `IN3` | Signal | Arduino pin 9 |
| `IN4` | Signal | Arduino pin 11 |
| `GND` | Ground | GND |

**Code that drives it** (written with the default pins above):

```cpp
// Drive two motors with an L298N
const int ENA = 5, IN1 = 7, IN2 = 8;
const int ENB = 6, IN3 = 9, IN4 = 11;

void drive(int left, int right) {   // -255 .. 255
  digitalWrite(IN1, left > 0);  digitalWrite(IN2, left < 0);  analogWrite(ENA, abs(left));
  digitalWrite(IN3, right > 0); digitalWrite(IN4, right < 0); analogWrite(ENB, abs(right));
}

void setup() {
  int pins[] = {ENA, IN1, IN2, ENB, IN3, IN4};
  for (int i = 0; i < 6; i++) pinMode(pins[i], OUTPUT);
}

void loop() {
  drive(200, 200);   delay(1500);   // forward
  drive(-200, 200);  delay(700);    // turn left
  drive(-180, -180); delay(1000);   // backward
  drive(0, 0);       delay(1000);   // stop
}
```

**Appears in:** `JM-07` Temperature-Controlled Smart Fan · `JM-11` Line Following Robot · `YI-05` Obstacle Avoiding Robot with Scanning Sonar · `YI-06` Bluetooth Robot Car with Phone App · `TL-02` Autonomous Maze Solving Robot · `TL-14` Autonomous Fire-Fighting Robot


#### Mini water pump + tube

**Also called:** Mini water pump (Circuit Lab part `pump`)

**Used in 1 activity** across Young Innovators · issued group.

**How it behaves:** 5V pump. Switch it with a relay.

**Code that drives it** (written with the default pins above):

```cpp
// Water the plant when the soil is dry
const int RELAY = 7;
const int SOIL = A0;

void setup() { pinMode(RELAY, OUTPUT); Serial.begin(9600); }

void loop() {
  int raw = analogRead(SOIL);
  if (raw > 700) {
    Serial.println("Soil is dry - pumping for 3 seconds");
    digitalWrite(RELAY, HIGH);
    delay(3000);
    digitalWrite(RELAY, LOW);
    delay(5000);
  } else {
    Serial.println("Soil is damp enough");
    delay(1500);
  }
}
```

**Appears in:** `YI-11` Wi-Fi Automatic Plant Watering System


#### Relay module (1-channel)

**Also called:** Relay module (Circuit Lab part `relay`)

**Used in 4 activities** across Young Innovators, Tech Leaders · issued group.

**How it behaves:** A switch the Arduino controls. IN HIGH closes COM–NO. Put the lamp/fan/pump circuit through COM and NO.


| Pin on the part | What it is | Where it goes by default |
|---|---|---|
| `IN` | Signal | Arduino pin 7 |
| `VCC` | Power in | 5V (or 3V3 on an ESP32) |
| `GND` | Ground | GND |

**Code that drives it** (written with the default pins above):

```cpp
// Switch a lamp with a relay
const int RELAY = 7;

void setup() {
  pinMode(RELAY, OUTPUT);
}

void loop() {
  digitalWrite(RELAY, HIGH);   // lamp on
  delay(2000);
  digitalWrite(RELAY, LOW);    // lamp off
  delay(2000);
}
```

**Appears in:** `YI-03` Smart Classroom Energy Saver · `YI-11` Wi-Fi Automatic Plant Watering System · `TL-12` Web-Controlled Devices via REST API · `TL-14` Autonomous Fire-Fighting Robot


#### Relay module (4-channel)

**Also called:** Relay module (Circuit Lab part `relay`)

**Used in 2 activities** across Tech Leaders · issued group.

**How it behaves:** A switch the Arduino controls. IN HIGH closes COM–NO. Put the lamp/fan/pump circuit through COM and NO.


| Pin on the part | What it is | Where it goes by default |
|---|---|---|
| `IN` | Signal | Arduino pin 7 |
| `VCC` | Power in | 5V (or 3V3 on an ESP32) |
| `GND` | Ground | GND |

**Code that drives it** (written with the default pins above):

```cpp
// Switch a lamp with a relay
const int RELAY = 7;

void setup() {
  pinMode(RELAY, OUTPUT);
}

void loop() {
  digitalWrite(RELAY, HIGH);   // lamp on
  delay(2000);
  digitalWrite(RELAY, LOW);    // lamp off
  delay(2000);
}
```

**Appears in:** `TL-06` Smart Home Cloud Control Hub · `TL-23` Smart Microgrid Model


#### Servo MG995

**Also called:** Servo SG90 (Circuit Lab part `servo`)

**Used in 2 activities** across Tech Leaders · issued group.

**How it behaves:** Brown = GND, red = 5V, orange = signal (PWM pin). Use the Servo library: servo.write(angle).


| Pin on the part | What it is | Where it goes by default |
|---|---|---|
| `PWM` | Signal | Arduino pin 9 |
| `V+` | Power in | 5V (or 3V3 on an ESP32) |
| `GND` | Ground | GND |

**Code that drives it** (written with the default pins above):

```cpp
// Sweep a servo
#include <Servo.h>
Servo servo;

void setup() {
  servo.attach(9);
}

void loop() {
  for (int a = 0; a <= 180; a += 2) { servo.write(a); delay(15); }
  for (int a = 180; a >= 0; a -= 2) { servo.write(a); delay(15); }
}
```

**Notes on the kit list:** Base and shoulder

**Appears in:** `TL-03` Pick-and-Place Robotic Arm with Record & Replay · `TL-25` Robotic Arm Inverse Kinematics


#### Servo SG90

**Used in 15 activities** across Little Explorers, Junior Makers, Young Innovators, Tech Leaders · issued group.

**How it behaves:** Brown = GND, red = 5V, orange = signal (PWM pin). Use the Servo library: servo.write(angle).


| Pin on the part | What it is | Where it goes by default |
|---|---|---|
| `PWM` | Signal | Arduino pin 9 |
| `V+` | Power in | 5V (or 3V3 on an ESP32) |
| `GND` | Ground | GND |

**Numbers that matter:** Rotates 0 to 180 degrees, not continuously. Stalls at about 650 mA, which is far more than an Arduino pin can give, so it needs its own 5 V supply with the grounds joined. The control signal is a pulse every 20 ms, 1 ms for 0 degrees and 2 ms for 180.

**What usually goes wrong:** Powering it from the Arduino's 5 V pin. One small servo often seems to work, which teaches the wrong lesson, and then two servos brown the board out. Forgetting to join the grounds when using a separate supply, so the signal has no reference and the servo jitters.

**Saying it to a child:** A motor that can be told to point at an exact angle and hold it there, like an arm that stops where you tell it.

**Code that drives it** (written with the default pins above):

```cpp
// Sweep a servo
#include <Servo.h>
Servo servo;

void setup() {
  servo.attach(9);
}

void loop() {
  for (int a = 0; a <= 180; a += 2) { servo.write(a); delay(15); }
  for (int a = 180; a >= 0; a -= 2) { servo.write(a); delay(15); }
}
```

**Notes on the kit list:** Pen lift; Wrist and gripper

**Appears in:** `LE-09` Waving Robot Arm · `LE-10` Automatic Railway Crossing Gate · `JM-04` Smart Dustbin with Fill-Level Indicator · `JM-05` Rain-Sensing Automatic Window · `JM-08` Sun-Tracking Solar Panel · `JM-27` Arcade Claw Machine · `YI-04` Stepper Motor Drawing Plotter · `YI-05` Obstacle Avoiding Robot with Scanning Sonar · `YI-07` Gesture-Controlled Robot Arm · `YI-08` RFID Smart Door Lock with Access Log · `YI-18` Processing + Arduino: Live Sensor Radar · `YI-28` Python Control Panel for Arduino · `TL-03` Pick-and-Place Robotic Arm with Record & Replay · `TL-08` Two-Factor Smart Locker with Intrusion Alerts · `TL-14` Autonomous Fire-Fighting Robot


#### Stepper 28BYJ-48 + ULN2003

**Used in 1 activity** across Young Innovators · issued group.

**How it behaves:** IN1-IN4 to four digital pins. 2048 steps = one turn. Note the pin order in Stepper(): IN1, IN3, IN2, IN4.


| Pin on the part | What it is | Where it goes by default |
|---|---|---|
| `IN1` | Signal | Arduino pin 7 |
| `IN3` | Signal | Arduino pin 9 |
| `IN2` | Signal | Arduino pin 8 |
| `IN4` | Signal | Arduino pin 11 |
| `+` | Power in | 5V (or 3V3 on an ESP32) |
| `-` | Ground | GND |

**Code that drives it** (written with the default pins above):

```cpp
// 28BYJ-48 stepper: one turn each way
#include <Stepper.h>
Stepper motor(2048, 7, 9, 8, 11);   // IN1, IN3, IN2, IN4

void setup() {
  motor.setSpeed(12);   // rpm
}

void loop() {
  motor.step(2048);
  delay(500);
  motor.step(-2048);
  delay(500);
}
```

**Appears in:** `YI-04` Stepper Motor Drawing Plotter


#### Vibration motor module

**Also called:** Vibration motor (Circuit Lab part `vibe`)

**Used in 2 activities** across Young Innovators, Tech Leaders · issued group.

**How it behaves:** IN HIGH = buzz. The module has its own transistor, so a pin can switch it.


| Pin on the part | What it is | Where it goes by default |
|---|---|---|
| `IN` | Signal | Arduino pin 5 |
| `VCC` | Power in | 5V (or 3V3 on an ESP32) |
| `GND` | Ground | GND |

**Code that drives it** (written with the default pins above):

```cpp
// Vibration motor: short buzzes like a phone
const int MOTOR = 5;

void buzz(int ms) { digitalWrite(MOTOR, HIGH); delay(ms); digitalWrite(MOTOR, LOW); delay(150); }

void setup() { pinMode(MOTOR, OUTPUT); }

void loop() {
  buzz(200); buzz(200);
  delay(1500);
}
```

**Appears in:** `YI-22` Smart Posture Corrector Wearable · `TL-28` Smart Cane for the Visually Impaired


### Power

#### 18650 cell + holder

**Also called:** Battery (Circuit Lab part `battery`)

**Used in 4 activities** across Young Innovators, Tech Leaders · issued group.

**How it behaves:** Power for motors, lamps and pumps. Always join its − to the Arduino GND.

**Code that drives it** (written with the default pins above):

```cpp
// A battery needs no code. Wire + to the board's VIN and - to GND.
// This sketch watches the battery through a voltage sensor on A0.
void setup() { Serial.begin(9600); }

void loop() {
  float volts = analogRead(A0) * 5.0 / 1023.0 * 5.0;   // voltage sensor divides by 5
  Serial.print("Battery: ");
  Serial.print(volts, 2);
  Serial.println(" V");
  if (volts < 6.5) Serial.println("  Getting low");
  delay(1500);
}
```

**Notes on the kit list:** Protected cells only; Wearable power; Supervised

**Appears in:** `YI-09` Rechargeable Power Pack for Robots · `TL-01` Solar-Powered Off-Grid Weather Node · `TL-04` Fall Detection Wearable for the Elderly · `TL-23` Smart Microgrid Model


#### 2xAA battery holder + batteries

**Also called:** Battery (Circuit Lab part `battery`)

**Used in 1 activity** across Junior Makers · issued group.

**How it behaves:** Power for motors, lamps and pumps. Always join its − to the Arduino GND.

**Code that drives it** (written with the default pins above):

```cpp
// A battery needs no code. Wire + to the board's VIN and - to GND.
// This sketch watches the battery through a voltage sensor on A0.
void setup() { Serial.begin(9600); }

void loop() {
  float volts = analogRead(A0) * 5.0 / 1023.0 * 5.0;   // voltage sensor divides by 5
  Serial.print("Battery: ");
  Serial.print(volts, 2);
  Serial.println(" V");
  if (volts < 6.5) Serial.println("  Getting low");
  delay(1500);
}
```

**Appears in:** `JM-00` Intro to Robotics + Art Bot


#### 4xAA battery pack

**Also called:** Battery (Circuit Lab part `battery`)

**Used in 15 activities** across Junior Makers, Young Innovators, Tech Leaders · issued group.

**How it behaves:** Power for motors, lamps and pumps. Always join its − to the Arduino GND.

**Code that drives it** (written with the default pins above):

```cpp
// A battery needs no code. Wire + to the board's VIN and - to GND.
// This sketch watches the battery through a voltage sensor on A0.
void setup() { Serial.begin(9600); }

void loop() {
  float volts = analogRead(A0) * 5.0 / 1023.0 * 5.0;   // voltage sensor divides by 5
  Serial.print("Battery: ");
  Serial.print(volts, 2);
  Serial.println(" V");
  if (volts < 6.5) Serial.println("  Getting low");
  delay(1500);
}
```

**Notes on the kit list:** Motor power; Servo power; Pump power

**Appears in:** `JM-07` Temperature-Controlled Smart Fan · `JM-11` Line Following Robot · `YI-04` Stepper Motor Drawing Plotter · `YI-05` Obstacle Avoiding Robot with Scanning Sonar · `YI-06` Bluetooth Robot Car with Phone App · `YI-07` Gesture-Controlled Robot Arm · `YI-11` Wi-Fi Automatic Plant Watering System · `YI-26` Walking Linkage Robot · `YI-27` Energy Detective: How Much Power Do Gadgets Use? · `TL-02` Autonomous Maze Solving Robot · `TL-03` Pick-and-Place Robotic Arm with Record & Replay · `TL-14` Autonomous Fire-Fighting Robot · `TL-25` Robotic Arm Inverse Kinematics · `TL-27` 3D-Printed Gearbox and Gear Ratios · `TL-28` Smart Cane for the Visually Impaired


#### 9V battery + snap

**Also called:** Battery (Circuit Lab part `battery`)

**Used in 2 activities** across Junior Makers, Young Innovators · issued group.

**How it behaves:** Power for motors, lamps and pumps. Always join its − to the Arduino GND.

**Numbers that matter:** Convenient and almost always the wrong choice for a motor. A 9 V battery holds very little energy, around 500 mAh, and sags badly under load.

**What usually goes wrong:** Running a robot from a 9 V battery and blaming the code when it slows down after two minutes.

**Saying it to a child:** It pushes hard but it runs out quickly, so it is fine for a light and poor for a motor.

**Code that drives it** (written with the default pins above):

```cpp
// A battery needs no code. Wire + to the board's VIN and - to GND.
// This sketch watches the battery through a voltage sensor on A0.
void setup() { Serial.begin(9600); }

void loop() {
  float volts = analogRead(A0) * 5.0 / 1023.0 * 5.0;   // voltage sensor divides by 5
  Serial.print("Battery: ");
  Serial.print(volts, 2);
  Serial.println(" V");
  if (volts < 6.5) Serial.println("  Getting low");
  delay(1500);
}
```

**Appears in:** `JM-01` Series & Parallel Circuit Lab · `YI-01` 555 Timer Alarm Siren Circuit


#### Coin cell CR2032

**Also called:** Battery (Circuit Lab part `battery`)

**Used in 2 activities** across Little Explorers · issued group.

**How it behaves:** Power for motors, lamps and pumps. Always join its − to the Arduino GND.

**Code that drives it** (written with the default pins above):

```cpp
// A battery needs no code. Wire + to the board's VIN and - to GND.
// This sketch watches the battery through a voltage sensor on A0.
void setup() { Serial.begin(9600); }

void loop() {
  float volts = analogRead(A0) * 5.0 / 1023.0 * 5.0;   // voltage sensor divides by 5
  Serial.print("Battery: ");
  Serial.print(volts, 2);
  Serial.println(" V");
  if (volts < 6.5) Serial.println("  Getting low");
  delay(1500);
}
```

**Appears in:** `LE-01` Light-Up Paper Circuit Card · `LE-11` Vibrating Brush Robot


#### LM2596 buck converter

**Used in 2 activities** across Young Innovators, Tech Leaders · issued group.

An adjustable step-down regulator. It takes a higher voltage in, say 12 V from a battery pack, and gives a lower one out, say 5 V for the Arduino and servos, without wasting the difference as heat the way a linear regulator does.

It switches the input on and off tens of thousands of times a second and smooths the result with an inductor and a capacitor. The ratio of on-time to off-time sets the output voltage.

**Numbers that matter:** Input 4.5 to 35 V, output 1.25 to 30 V, up to about 2 A without a heatsink. Efficiency is typically 85 to 92 per cent.

**What usually goes wrong:** Wiring it up and powering the project before turning the little trim pot and measuring the output. It does not leave the factory set to 5 V. Set it with a multimeter first, with nothing connected to the output.

**Saying it to a child:** A tap for electricity. The battery pushes hard; this turns the pressure down to what the board can drink.

**Notes on the kit list:** Servo supply

**Appears in:** `YI-09` Rechargeable Power Pack for Robots · `TL-03` Pick-and-Place Robotic Arm with Record & Replay


#### Small solar panel

**Also called:** Solar panel 6V (Circuit Lab part `solar`)

**Used in 3 activities** across Junior Makers, Tech Leaders · issued group.

**How it behaves:** Gives up to 6V in full sun. Read it through a voltage sensor (never straight into a pin above 5V).

**Code that drives it** (written with the default pins above):

```cpp
// Solar panel: watch how much the sun gives you
void setup() { Serial.begin(9600); }

void loop() {
  float volts = analogRead(A0) * 5.0 / 1023.0 * 5.0;
  Serial.print("Panel: ");
  Serial.print(volts, 2);
  Serial.println(" V");
  if (volts > 4.5) Serial.println("  Enough to charge");
  delay(1200);
}
```

**Appears in:** `JM-08` Sun-Tracking Solar Panel · `TL-01` Solar-Powered Off-Grid Weather Node · `TL-23` Smart Microgrid Model


#### TP4056 charger module

**Used in 3 activities** across Young Innovators, Tech Leaders · issued group.

A small board that charges a single lithium cell safely from USB, and in the protected version cuts the cell off if it is drained too far.

**Numbers that matter:** Charges at up to 1 A, cutting off at 4.2 V. The red LED means charging, blue means done. A protected board stops discharge at about 2.4 V.

**What usually goes wrong:** Using the unprotected version with a bare cell, which lets a student flatten the cell below its safe floor and ruin it. Connecting the battery to the OUT pins instead of the B+ and B- pins.

**Saying it to a child:** The bit that fills the battery back up without letting it get too full, because a lithium battery that is overfilled is dangerous.

**Appears in:** `YI-09` Rechargeable Power Pack for Robots · `TL-01` Solar-Powered Off-Grid Weather Node · `TL-23` Smart Microgrid Model


### Communication

#### Bluetooth module HC-05

**Also called:** Bluetooth HC-05 (Circuit Lab part `hc05`)

**Used in 2 activities** across Junior Makers, Young Innovators · issued group.

**How it behaves:** TXD → Arduino RX pin, RXD → Arduino TX pin. Use SoftwareSerial. Send messages from the Phone panel while running.


| Pin on the part | What it is | Where it goes by default |
|---|---|---|
| `TXD` | Signal | Arduino pin 2 |
| `RXD` | Signal | Arduino pin 3 |
| `VCC` | Power in | 5V (or 3V3 on an ESP32) |
| `GND` | Ground | GND |

**Code that drives it** (written with the default pins above):

```cpp
// Bluetooth commands from a phone
#include <SoftwareSerial.h>
SoftwareSerial bt(2, 3);   // RX, TX (Arduino side)
const int LED = 13;

void setup() {
  pinMode(LED, OUTPUT);
  bt.begin(9600);
  Serial.begin(9600);
  bt.println("Send 1 = on, 0 = off");
}

void loop() {
  if (bt.available()) {
    char c = bt.read();
    Serial.print("Phone sent: "); Serial.println(c);
    if (c == '1') { digitalWrite(LED, HIGH); bt.println("LED on"); }
    if (c == '0') { digitalWrite(LED, LOW);  bt.println("LED off"); }
  }
}
```

**Appears in:** `JM-12` Phone-Controlled RGB Mood Lamp · `YI-06` Bluetooth Robot Car with Phone App


#### RFID RC522 + cards

**Also called:** RFID reader RC522 (Circuit Lab part `rfid`)

**Used in 2 activities** across Young Innovators, Tech Leaders · issued group.

**How it behaves:** SPI: SDA to pin 10, SCK 13, MOSI 11, MISO 12, RST 9, 3.3V and GND. Use MFRC522. Tap a card from the part panel.


| Pin on the part | What it is | Where it goes by default |
|---|---|---|
| `SDA` | I2C bus | Arduino pin 10 |
| `RST` | Signal | Arduino pin 9 |
| `3.3V` | Power in | 5V (or 3V3 on an ESP32) |
| `GND` | Ground | GND |

**Code that drives it** (written with the default pins above):

```cpp
// Read RFID card IDs
#include <SPI.h>
#include <MFRC522.h>
MFRC522 rfid(10, 9);

void setup() {
  Serial.begin(9600);
  SPI.begin();
  rfid.PCD_Init();
  Serial.println("Tap a card...");
}

void loop() {
  if (!rfid.PICC_IsNewCardPresent() || !rfid.PICC_ReadCardSerial()) return;
  Serial.print("Card UID:");
  for (byte i = 0; i < rfid.uid.size; i++) { Serial.print(" "); Serial.print(rfid.uid.uidByte[i], HEX); }
  Serial.println();
  rfid.PICC_HaltA();
}
```

**Appears in:** `YI-08` RFID Smart Door Lock with Access Log · `TL-08` Two-Factor Smart Locker with Intrusion Alerts


### Tools & materials

#### 3D printer

**Used in 8 activities** across Little Explorers, Junior Makers, Young Innovators, Tech Leaders · issued class.

Builds a part up in thin layers of melted plastic from a 3D model. In this curriculum it turns a student's own design into a bracket, a gear, an enclosure or a robot chassis.

**Numbers that matter:** PLA prints at about 200 C with a 60 C bed. A typical small part takes 20 to 90 minutes. Layer height 0.2 mm is the usual compromise between speed and finish.

**What usually goes wrong:** A first layer that does not stick, which is nearly always an unlevelled bed or a dirty print surface. Designing a part with overhangs steeper than about 45 degrees without support.

**Saying it to a child:** A hot glue gun that moves by itself, drawing your shape over and over until it stands up.

**Appears in:** `F-03 (LE)` 3D Modelling and Printing · `F-03 (JM)` 3D Modelling and Printing · `JM-10` 3D-Designed Name Badge & Sensor Mount · `F-03 (YI)` 3D Modelling and Printing · `YI-16` 3D-Printed Plant Monitor Enclosure · `F-03 (TL)` 3D Modelling and Printing · `TL-15` Parametric Robot Gripper Design · `TL-27` 3D-Printed Gearbox and Gear Ratios


#### Alligator clip leads

**Used in 3 activities** across Little Explorers, Junior Makers · issued group.

Sprung metal jaws on a wire. They let a student connect to things that have no header pins: a lemon, a nail, a sheet of foil, a drawing in pencil.

**What usually goes wrong:** Clipping two leads so their metal jaws touch, which shorts the supply.

**Appears in:** `LE-03` Lemon Battery LED Lamp · `LE-24` Crank-Powered Light: Be the Power Station · `JM-28` Wind Turbine Power Lab


#### Android smartphone

**Used in 7 activities** across Little Explorers, Junior Makers, Young Innovators, Tech Leaders · issued class / group.

Used as a Bluetooth or Wi-Fi remote for ESP32 projects, and as a camera or sensor source in the app-building activities.

**What usually goes wrong:** Expecting a phone to pair with an HC-05 like a speaker. For serial Bluetooth the student needs a terminal app, not the system pairing screen alone.

**Notes on the kit list:** Wi-Fi / Bluetooth demo

**Appears in:** `F-02 (LE)` ESP32 Basics · `F-02 (JM)` ESP32 Basics · `JM-12` Phone-Controlled RGB Mood Lamp · `F-02 (YI)` ESP32 Basics · `YI-06` Bluetooth Robot Car with Phone App · `YI-12` Plant Monitor Mobile App · `F-02 (TL)` ESP32 Basics


#### Digital multimeter

**Used in 7 activities** across Little Explorers, Junior Makers, Young Innovators, Tech Leaders · issued class / group.

A meter that measures voltage, current and resistance, and tests continuity. It is how a student finds out whether a wire is actually connected and whether a pin is actually at 5 V.

**Numbers that matter:** Set to 20 V DC for Arduino work. Continuity beeps below about 50 ohms. Measuring current means breaking the circuit and putting the meter in series, which is the step most people get wrong.

**What usually goes wrong:** Leaving the meter in the current (A) socket and then measuring voltage. That puts a near short circuit across whatever is being measured and usually blows the meter's fuse.

**Saying it to a child:** A meter is a torch for electricity: you cannot see it, so this tells you whether it is there and how strong it is.

**Notes on the kit list:** Teacher demo

**Appears in:** `LE-24` Crank-Powered Light: Be the Power Station · `JM-01` Series & Parallel Circuit Lab · `JM-08` Sun-Tracking Solar Panel · `JM-28` Wind Turbine Power Lab · `YI-01` 555 Timer Alarm Siren Circuit · `YI-09` Rechargeable Power Pack for Robots · `TL-01` Solar-Powered Off-Grid Weather Node


#### Jumper wires M-F

**Used in 55 activities** across Little Explorers, Junior Makers, Young Innovators, Tech Leaders · issued group.

A pin at one end and a socket at the other. These connect a module with its own header pins to the breadboard or the Arduino.

**Saying it to a child:** This one has a spike at one end and a hole at the other, so it can join two different kinds of connector.

**Notes on the kit list:** Touch-pin demo

**Appears in:** `F-02 (LE)` ESP32 Basics · `LE-05` Automatic Night Lamp · `LE-07` Plant Water Alarm · `LE-08` Motion Detector Room Alarm · `LE-10` Automatic Railway Crossing Gate · `F-02 (JM)` ESP32 Basics · `JM-02` Two-Player Reaction Timer with Scoreboard · `JM-03` Mini Weather Station with OLED Display · `JM-04` Smart Dustbin with Fill-Level Indicator · `JM-05` Rain-Sensing Automatic Window · `JM-06` Fire & Gas Safety Alarm Panel · `JM-07` Temperature-Controlled Smart Fan · `JM-08` Sun-Tracking Solar Panel · `JM-09` Home Burglar Alarm with Secret Code · `JM-11` Line Following Robot · `JM-12` Phone-Controlled RGB Mood Lamp · `JM-13` Step Counter Fitness Tracker · `JM-20` Joystick Maze Game · and 37 more


#### Jumper wires M-M

**Used in 73 activities** across Little Explorers, Junior Makers, Young Innovators, Tech Leaders · issued group.

Pins at both ends. These are for breadboard-to-breadboard and breadboard-to-Arduino-header connections.

**What usually goes wrong:** Reaching for an M-M when the sensor module has pins, which needs an M-F. Half of all wiring frustration in a lesson is the wrong end on the wire.

**Saying it to a child:** The roads the electricity drives along. Both ends of this one are spikes.

**Appears in:** `F-00 (LE)` Welcome to Robotics (Distance Alarm) · `F-01 (LE)` Arduino Uno Basics · `F-02 (LE)` ESP32 Basics · `LE-02` Push-Button Doorbell · `LE-04` Traffic Light Controller · `LE-05` Automatic Night Lamp · `LE-06` Hot & Cold Temperature Indicator · `LE-07` Plant Water Alarm · `LE-08` Motion Detector Room Alarm · `LE-09` Waving Robot Arm · `LE-10` Automatic Railway Crossing Gate · `LE-12` Morse Code Light Messenger · `LE-22` Button Melody Maker · `F-00 (JM)` Welcome to Robotics (Distance Alarm) · `F-01 (JM)` Arduino Uno Basics · `F-02 (JM)` ESP32 Basics · `JM-01` Series & Parallel Circuit Lab · `JM-02` Two-Player Reaction Timer with Scoreboard · and 55 more


#### Laptop

**Used in 126 activities** across Little Explorers, Junior Makers, Young Innovators, Tech Leaders · issued group.

The computer a student writes code on. In this club it is also the machine that runs Circuit Lab and Code Lab in a browser, so a pair can build and test a circuit before touching real parts.

**Numbers that matter:** Any laptop made in the last ten years is enough. Circuit Lab needs about 300 MB of browser memory. Compiling a sketch needs internet; everything else in Circuit Lab works offline once it has been opened.

**What usually goes wrong:** Forgetting that the Arduino IDE needs the USB driver for a clone board (CH340). If the board does not appear under Tools > Port, that driver is almost always why.

**Saying it to a child:** This is where your instructions are written before they are sent to the robot's brain.

**Notes on the kit list:** Tinkercad in the browser

**Appears in:** `F-00 (LE)` Welcome to Robotics (Distance Alarm) · `F-01 (LE)` Arduino Uno Basics · `F-02 (LE)` ESP32 Basics · `F-03 (LE)` 3D Modelling and Printing · `LE-02` Push-Button Doorbell · `LE-04` Traffic Light Controller · `LE-05` Automatic Night Lamp · `LE-06` Hot & Cold Temperature Indicator · `LE-07` Plant Water Alarm · `LE-08` Motion Detector Room Alarm · `LE-09` Waving Robot Arm · `LE-10` Automatic Railway Crossing Gate · `LE-12` Morse Code Light Messenger · `LE-13` Makey Makey Fruit Piano · `LE-15` Catch-the-Fruit Game with Playdough Controller · `LE-18` Code.org Puzzle Quest: Sequences and Loops · `LE-19` Program the Robot Car Through a Floor Maze · `LE-21` Rainbow LED Ring · and 108 more


#### Makey Makey kit

**Used in 2 activities** across Little Explorers · issued group.

A small board that pretends to be a keyboard. Touching a banana closes a circuit through the student's body and the computer receives a key press.

It works by measuring resistance between an input and the EARTH strip. Anything that conducts even slightly, including fruit, playdough and people, completes the loop. The student holds the earth wire, so they become part of the circuit.

**Numbers that matter:** It triggers at resistances up to roughly 20 megohms, which is why damp fruit works and dry plastic does not.

**What usually goes wrong:** Not holding the earth wire. Without it nothing happens, and it looks like the board is broken.

**Saying it to a child:** You become the wire. When you touch the banana, electricity goes through you, and the computer thinks someone pressed a key.

**Appears in:** `LE-13` Makey Makey Fruit Piano · `LE-15` Catch-the-Fruit Game with Playdough Controller


#### PLA filament

**Used in 8 activities** across Little Explorers, Junior Makers, Young Innovators, Tech Leaders · issued class.

The plastic the 3D printer melts. PLA is made from plant starch, prints at a low temperature and does not warp much, which is why schools use it.

**Numbers that matter:** 1.75 mm diameter, printed at 190 to 215 C. One kilogram is roughly 330 metres and prints a great many small parts.

**What usually goes wrong:** Leaving it out in humid air for months. Damp filament hisses and prints rough.

**Notes on the kit list:** 1 spool; 1 spool per term

**Appears in:** `F-03 (LE)` 3D Modelling and Printing · `F-03 (JM)` 3D Modelling and Printing · `JM-10` 3D-Designed Name Badge & Sensor Mount · `F-03 (YI)` 3D Modelling and Printing · `YI-16` 3D-Printed Plant Monitor Enclosure · `F-03 (TL)` 3D Modelling and Printing · `TL-15` Parametric Robot Gripper Design · `TL-27` 3D-Printed Gearbox and Gear Ratios


#### Screwdriver set

**Used in 7 activities** across Little Explorers, Junior Makers, Young Innovators, Tech Leaders · issued class / group.

Small Phillips and flat drivers for terminal blocks, motor mounts and chassis screws.

**What usually goes wrong:** Using a driver that is too small for the screw head and rounding it out.

**Notes on the kit list:** Scraper / print removal

**Appears in:** `F-03 (LE)` 3D Modelling and Printing · `F-03 (JM)` 3D Modelling and Printing · `JM-11` Line Following Robot · `F-03 (YI)` 3D Modelling and Printing · `YI-05` Obstacle Avoiding Robot with Scanning Sonar · `F-03 (TL)` 3D Modelling and Printing · `TL-02` Autonomous Maze Solving Robot


#### Tablet

**Used in 2 activities** across Little Explorers · issued group.

Stands in for a laptop in the younger groups for block coding and for driving a robot over Bluetooth.

**Notes on the kit list:** Or laptop with ScratchJr desktop

**Appears in:** `LE-14` Animated Story App · `LE-20` ScratchJr Dance Party


#### Webcam

**Used in 5 activities** across Little Explorers, Junior Makers, Young Innovators, Tech Leaders · issued group.

A camera that feeds pictures to the laptop. Used in the AI activities for image classification and pose or face detection in the browser.

**Saying it to a child:** The computer's eye. On its own it only sees colours and dots; the AI is what turns those into "that is a cat".

**Notes on the kit list:** Or built-in camera

**Appears in:** `LE-27` Pop the Bubbles with Your Hand · `JM-16` AI Recycling Sorter · `JM-31` AI Emotion Mirror · `YI-31` Sign Language Alphabet Recogniser · `TL-17` Computer Vision with OpenCV: Colour Tracking


### Craft & structure

#### Aluminium foil

**Used in 1 activity** across Little Explorers · issued class.

A cheap conductor for touch pads, switch contacts and shielding in the younger activities.

**Appears in:** `LE-13` Makey Makey Fruit Piano


#### Brush Bot kit

**Used in 1 activity** across Little Explorers · issued group.

A brush head, a coin motor and a cell. The offset weight on the motor makes the whole thing vibrate, and the angled bristles turn that vibration into forward movement.

**Appears in:** `LE-11` Vibrating Brush Robot


#### Candle

**Used in 2 activities** across Junior Makers, Tech Leaders · issued class.

A real flame for the flame-sensor activities, used by the teacher, never left with a student unattended.

**Notes on the kit list:** Teacher only

**Appears in:** `JM-06` Fire & Gas Safety Alarm Panel · `TL-14` Autonomous Fire-Fighting Robot


#### Card / chart paper

**Used in 6 activities** across Little Explorers, Junior Makers · issued group.

Thinner than cardboard: good for templates, faces and folded shapes, not for anything load-bearing.

**Notes on the kit list:** Question tree; Coloured cards; Pet face; Big drawing paper

**Appears in:** `LE-01` Light-Up Paper Circuit Card · `LE-16` Robot Sorting Rules Game · `LE-23` Colour Detective Sensor · `LE-30` Follow-Me Robot Pet · `JM-00` Intro to Robotics + Art Bot · `JM-28` Wind Turbine Power Lab


#### Cardboard sheet

**Used in 15 activities** across Little Explorers, Junior Makers, Young Innovators, Tech Leaders · issued group / class.

The main structural material in the younger groups. Corrugated card is stiff along the flutes and bends across them, which is worth pointing out before a chassis sags.

**Notes on the kit list:** Crank / windmill; Box for bin; Model window; Panel mount; Road model; Scale platform; Frame; Maze walls; Arm structure; Car park model; Arm links (or 3D printed)

**Appears in:** `LE-09` Waving Robot Arm · `LE-24` Crank-Powered Light: Be the Power Station · `LE-28` Cardboard Automaton: Cams and Cranks · `LE-31` Safety Helper Robot Design · `JM-04` Smart Dustbin with Fill-Level Indicator · `JM-05` Rain-Sensing Automatic Window · `JM-08` Sun-Tracking Solar Panel · `JM-25` Smart Traffic Junction with Car Counter · `JM-26` Smart Kitchen Scale · `JM-27` Arcade Claw Machine · `YI-04` Stepper Motor Drawing Plotter · `TL-02` Autonomous Maze Solving Robot · `TL-03` Pick-and-Place Robotic Arm with Record & Replay · `TL-07` Smart Parking Occupancy Dashboard · `TL-25` Robotic Arm Inverse Kinematics


#### Conductive playdough

**Used in 1 activity** across Little Explorers · issued group.

Salt dough conducts electricity; sugar dough does not. Together they let young children build a squishy circuit where the dough is the wire and the resistor at the same time.

**Numbers that matter:** Salt dough is roughly 100 to 1000 ohms through a short fat lump, which is low enough to light an LED straight from a battery pack.

**What usually goes wrong:** Two lumps of salt dough touching each other, which short-circuits the battery and makes the LED go out.

**Saying it to a child:** Squishy wire. Electricity can walk through the salty dough but not through the sweet dough.

**Appears in:** `LE-15` Catch-the-Fruit Game with Playdough Controller


#### Copper coins

**Used in 1 activity** across Little Explorers · issued group.

The positive electrode of the fruit battery. Copper and zinc together are what make the voltage.

**Appears in:** `LE-03` Lemon Battery LED Lamp


#### Copper tape

**Used in 1 activity** across Little Explorers · issued group.

Self-adhesive copper foil used to draw a circuit on paper. The sticky side is often not conductive, so overlapping corners need a fold rather than a flat join.

**Saying it to a child:** A wire you can stick down like sticky tape, so your circuit can live on a page.

**Notes on the kit list:** 30 cm per group

**Appears in:** `LE-01` Light-Up Paper Circuit Card


#### Cork

**Used in 1 activity** across Junior Makers · issued group.

A float, a wheel hub or a stand, depending on the build.

**Notes on the kit list:** Fixed off-centre on the shaft

**Appears in:** `JM-00` Intro to Robotics + Art Bot


#### Fruits (bananas etc.)

**Used in 1 activity** across Little Explorers · issued group.

Conductive enough for the Makey Makey to register a touch, because of the water and salts inside.

**Appears in:** `LE-13` Makey Makey Fruit Piano


#### Galvanized nails

**Used in 1 activity** across Little Explorers · issued group.

Zinc-coated nails. In the fruit battery they are the negative electrode; the zinc is what reacts.

**Appears in:** `LE-03` Lemon Battery LED Lamp


#### Glue gun + glue sticks

**Used in 5 activities** across Little Explorers, Junior Makers, Young Innovators · issued class.

Fast, strong bonding for cardboard, wood and plastic.

**Numbers that matter:** The nozzle reaches about 180 C, which is hot enough for a real burn. Low-temperature guns run near 120 C and are the ones to use with the younger groups.

**What usually goes wrong:** Gluing a component down before testing the circuit. Hot glue is not meant to come off.

**Notes on the kit list:** Teacher only; Teacher help

**Appears in:** `LE-28` Cardboard Automaton: Cams and Cranks · `JM-00` Intro to Robotics + Art Bot · `JM-27` Arcade Claw Machine · `YI-07` Gesture-Controlled Robot Arm · `YI-26` Walking Linkage Robot


#### Googly eyes

**Used in 3 activities** across Little Explorers · issued group.

Pure character. A robot with eyes gets named, and a named robot gets finished.

**Appears in:** `LE-09` Waving Robot Arm · `LE-11` Vibrating Brush Robot · `LE-31` Safety Helper Robot Design


#### Ice cream sticks

**Used in 4 activities** across Little Explorers, Junior Makers, Young Innovators · issued group.

Flat wooden sticks for arms, levers and linkages. Strong along their length, weak across it.

**Notes on the kit list:** Gate arm; Arm structure

**Appears in:** `LE-10` Automatic Railway Crossing Gate · `JM-27` Arcade Claw Machine · `YI-07` Gesture-Controlled Robot Arm · `YI-26` Walking Linkage Robot


#### Lemons

**Used in 1 activity** across Little Explorers · issued group.

The acid in a lemon acts as the electrolyte in a simple cell. The lemon does not store the electricity: the two different metals pushed into it are what make it.

**Numbers that matter:** One lemon cell gives about 0.9 V and only a fraction of a milliamp. Four in series will just light a red LED; none of them will run an Arduino.

**What usually goes wrong:** Expecting one lemon to light an LED. It needs several in series, and the nails must not touch inside the fruit.

**Saying it to a child:** The lemon is not a battery by itself. The battery is the copper and the zinc; the lemon juice is just what lets them talk to each other.

**Appears in:** `LE-03` Lemon Battery LED Lamp


#### Markers

**Used in 10 activities** across Little Explorers, Junior Makers, Young Innovators · issued group.

Labelling and decoration. Also used to mark polarity on a battery holder before a student forgets which side is which.

**Notes on the kit list:** 3-4 washable markers; Or beads

**Appears in:** `LE-01` Light-Up Paper Circuit Card · `LE-09` Waving Robot Arm · `LE-16` Robot Sorting Rules Game · `LE-17` Robot Chef: Unplugged Algorithms · `LE-26` Pixel Messages: Send a Picture with Numbers · `LE-28` Cardboard Automaton: Cams and Cranks · `LE-31` Safety Helper Robot Design · `JM-00` Intro to Robotics + Art Bot · `JM-19` Binary Bracelets & Secret Codes · `YI-04` Stepper Motor Drawing Plotter


#### Plant pot with soil

**Used in 2 activities** across Little Explorers, Young Innovators · issued group.

Holds the plant and the soil moisture probe in the watering activities. Dry soil has a high resistance, wet soil a low one, which is all the sensor measures.

**Appears in:** `LE-07` Plant Water Alarm · `YI-11` Wi-Fi Automatic Plant Watering System


#### Plastic or paper cup

**Used in 1 activity** across Junior Makers · issued group.

A body, a hopper or a sound chamber, depending on the build.

**Notes on the kit list:** Never a real glass

**Appears in:** `JM-00` Intro to Robotics + Art Bot


#### Printed templates

**Used in 13 activities** across Little Explorers, Junior Makers, Young Innovators · issued group.

Cut-out guides supplied with an activity so that younger students spend the lesson building rather than measuring.

**Notes on the kit list:** Morse picture chart; Story planning sheet; Picture cards; Results sheet; Screen sketch sheet

**Appears in:** `LE-12` Morse Code Light Messenger · `LE-14` Animated Story App · `LE-16` Robot Sorting Rules Game · `LE-17` Robot Chef: Unplugged Algorithms · `LE-19` Program the Robot Car Through a Floor Maze · `LE-26` Pixel Messages: Send a Picture with Numbers · `LE-31` Safety Helper Robot Design · `JM-16` AI Recycling Sorter · `JM-19` Binary Bracelets & Secret Codes · `JM-22` 8x8 LED Matrix Emoji Display · `JM-30` Data Detectives: Class Survey Charts · `JM-32` Cyber Safety Escape Room · `YI-12` Plant Monitor Mobile App


#### Split pins (paper fasteners)

**Used in 1 activity** across Young Innovators · issued group.

Make a pivot in cardboard, so a linkage can turn. The cheapest hinge there is.

**Appears in:** `YI-26` Walking Linkage Robot


#### Straws

**Used in 1 activity** across Little Explorers · issued group.

Light rigid tubes for linkages, pneumatic arms and structure in the mechanical activities.

**Appears in:** `LE-28` Cardboard Automaton: Cams and Cranks


#### Tape (paper + double-sided)

**Used in 7 activities** across Little Explorers, Junior Makers, Young Innovators · issued class / group.

Paper tape for temporary holds that need to come apart, double-sided for mounting a board or a sensor to a chassis.

**Notes on the kit list:** Floor grid; Floor maze

**Appears in:** `LE-01` Light-Up Paper Circuit Card · `LE-11` Vibrating Brush Robot · `LE-17` Robot Chef: Unplugged Algorithms · `LE-19` Program the Robot Car Through a Floor Maze · `LE-31` Safety Helper Robot Design · `JM-00` Intro to Robotics + Art Bot · `YI-04` Stepper Motor Drawing Plotter


#### Water container

**Used in 2 activities** across Little Explorers, Young Innovators · issued class / group.

The reservoir the pump draws from in the watering activities. Kept well away from the board and the laptop.

**Appears in:** `LE-07` Plant Water Alarm · `YI-11` Wi-Fi Automatic Plant Watering System


#### Wooden skewers

**Used in 4 activities** across Little Explorers, Junior Makers, Young Innovators, Tech Leaders · issued group.

Axles and pivots. A hole slightly larger than the skewer turns freely; the same size does not.

**Notes on the kit list:** Axles

**Appears in:** `LE-28` Cardboard Automaton: Cams and Cranks · `JM-28` Wind Turbine Power Lab · `YI-26` Walking Linkage Robot · `TL-27` 3D-Printed Gearbox and Gear Ratios


### Everything else

#### ESP32-CAM + programmer

**Used in 2 activities** across Young Innovators, Tech Leaders · issued group.

An ESP32 with a small camera and an SD card slot, used for the camera and simple computer-vision activities. It has no USB socket of its own, so a separate programmer board is used to upload code.

**Numbers that matter:** The OV2640 camera does up to 1600 x 1200. It needs a solid 5 V supply with at least 500 mA; it browns out on a weak USB port. GPIO 0 must be pulled to GND to enter upload mode.

**What usually goes wrong:** Forgetting to remove the GPIO 0 jumper after uploading, so it never runs the sketch. Powering it from the 3.3 V pin, which cannot start the camera.

**Saying it to a child:** A robot's eye with its own little computer attached, small enough to sit in the palm of your hand.

**Notes on the kit list:** From lab stock

**Appears in:** `YI-20` ESP32-CAM Wildlife Camera · `TL-18` Vision-Guided Robot Car


#### NRF24L01 module

**Used in 1 activity** across Young Innovators · issued group.

A 2.4 GHz radio for sending small packets between two boards with no Wi-Fi network in between. Used for robot-to-robot and remote-control activities.

It talks to the Arduino over SPI. Each module has an address, called a pipe; two modules with matching pipes can exchange packets of up to 32 bytes.

**Numbers that matter:** Runs on 3.3 V only, draws short current spikes up to about 100 mA while transmitting, and reaches roughly 30 m indoors with the bare module.

**What usually goes wrong:** Powering it from the Arduino's 3.3 V pin, which cannot supply the current spikes, so the radio works for a second and then locks up. The fix is a 10 uF capacitor across its power pins. Also: 5 V on the power pin destroys it, although the signal pins tolerate 5 V logic.

**Saying it to a child:** A walkie-talkie for two robots. They have to agree on a channel first, or they will not hear each other.

**Appears in:** `YI-10` Wireless Doorbell with Visitor Counter



---

## 6. Activity reference

All 145 activities, in curriculum order, grouped by age band. Where Circuit Lab can simulate the activity, the exact wiring and the working sketch are included: that is the code a student will be looking at.

### LE · Little Explorers (ages 5-7)

36 activities. Foundation: 4 · Phase 1: 16 · Phase 2: 16

#### F-00 (LE) · Welcome to Robotics (Distance Alarm)

**Unit:** Foundation & intro · **Phase:** Foundation · **Domain:** Foundation

**What it does:** Like a car parking sensor: when something comes closer than 20 cm the LED lights and the buzzer sounds.

**Kit for this activity:**

| Part | How many | Issued | Note |
|---|---|---|---|
| Arduino Uno + USB cable | 1 | per group |  |
| Ultrasonic sensor HC-SR04 | 1 | per group |  |
| LED 5 mm (assorted) | 1 | per group | Red |
| Resistor 220 ohm | 1 | per group |  |
| Buzzer | 1 | per group |  |
| Breadboard (half size) | 1 | per group |  |
| Jumper wires M-M | 6 | per group |  |
| Laptop | 1 | per group |  |

**Board:** Arduino Uno

**Wiring (as Circuit Lab builds it):**

- **Ultrasonic HC-SR04**: TRIG → pin 9, ECHO → pin 10
- **LED**: color: red, signal → pin 13
- **Buzzer**: signal → pin 8

**Things to try in the simulator:**

- Click the ultrasonic sensor and move the distance slider below 20 cm.
- Open the Serial tab to see the distance.
- Change ALARM_CM to 40 and test again.

**The sketch:**

```cpp
// Distance Alarm: like a car parking sensor
const int TRIG = 9, ECHO = 10, LED = 13, BUZZ = 8;
int ALARM_CM = 20;                    // <-- change me!

void setup() {
  pinMode(TRIG, OUTPUT);  pinMode(ECHO, INPUT);
  pinMode(LED, OUTPUT);   pinMode(BUZZ, OUTPUT);
  Serial.begin(9600);
}

void loop() {
  digitalWrite(TRIG, HIGH); delayMicroseconds(10);
  digitalWrite(TRIG, LOW);                 // SENSE: send a sound pulse
  long cm = pulseIn(ECHO, HIGH, 30000) / 58;
  Serial.println(cm);                      // see the distance

  if (cm > 0 && cm < ALARM_CM) {           // THINK: too close?
    digitalWrite(LED, HIGH);               // ACT: light on
    digitalWrite(BUZZ, HIGH);              //      and beep
  } else {
    digitalWrite(LED, LOW);
    digitalWrite(BUZZ, LOW);
  }
  delay(100);
}
```


#### F-01 (LE) · Arduino Uno Basics

**Unit:** Foundation & intro · **Phase:** Foundation · **Domain:** Foundation

**What it does:** Output, input and analog in one circuit: the knob sets the blink speed and the button beeps.

**Kit for this activity:**

| Part | How many | Issued | Note |
|---|---|---|---|
| Arduino Uno + USB cable | 1 | per group |  |
| LED 5 mm (assorted) | 2 | per group |  |
| Resistor 220 ohm | 2 | per group |  |
| Push button | 1 | per group | INPUT_PULLUP demo |
| Potentiometer 10k | 1 | per group | Analog input demo |
| Breadboard (half size) | 1 | per group |  |
| Jumper wires M-M | 8 | per group |  |
| Laptop | 1 | per group |  |
| Buzzer | 1 | per group | Added: every Arduino class |

**Board:** Arduino Uno

**Wiring (as Circuit Lab builds it):**

- **LED**: color: green, signal → pin 13
- **Push button**: signal → pin 2
- **Potentiometer**: signal → pin A0
- **Buzzer**: signal → pin 8

**Things to try in the simulator:**

- Turn the knob while it runs: the LED blinks faster or slower.
- Hold the button: the buzzer beeps.
- Open Serial to see the blink time in milliseconds.

**The sketch:**

```cpp
// Arduino Uno basics: OUTPUT, INPUT and ANALOG
const int LED = 13, BUTTON = 2, KNOB = A0, BUZZER = 8;

void setup() {
  pinMode(LED, OUTPUT);              // an output
  pinMode(BUTTON, INPUT_PULLUP);     // an input (pressed = LOW)
  Serial.begin(9600);
}

void loop() {
  int knob = analogRead(KNOB);                 // 0 .. 1023
  int wait = map(knob, 0, 1023, 100, 1000);    // 0.1 .. 1 second
  Serial.print("Blink time: "); Serial.println(wait);

  digitalWrite(LED, HIGH); delay(wait);
  digitalWrite(LED, LOW);  delay(wait);

  if (digitalRead(BUTTON) == LOW) tone(BUZZER, 880, 150);
}
```


#### F-02 (LE) · ESP32 Basics

**Unit:** Foundation & intro · **Phase:** Foundation · **Domain:** Foundation

**What it does:** An ESP32 joins Wi-Fi, reads a knob and serves a web page where a phone switches the LED.

**Kit for this activity:**

| Part | How many | Issued | Note |
|---|---|---|---|
| ESP32 Dev Board + USB cable | 1 | per group | Data cable, not charge-only |
| LED 5 mm (assorted) | 1 | per group |  |
| Resistor 220 ohm | 1 | per group |  |
| Potentiometer 10k | 1 | per group | ADC demo |
| Breadboard (half size) | 2 | per group | ESP32 is wide: bridge 2 boards |
| Jumper wires M-M | 6 | per group |  |
| Jumper wires M-F | 4 | per group | Touch-pin demo |
| Laptop | 1 | per group |  |
| Android smartphone | 1 | per class | Wi-Fi / Bluetooth demo |

**Board:** ESP32 DevKit

**Wiring (as Circuit Lab builds it):**

- **LED**: color: blue, signal → pin 13
- **Potentiometer**: signal → pin 34

**Things to try in the simulator:**

- Start, then open the Phone tab: tap ON and OFF.
- Turn the knob and press Refresh on the page: the number changes (0 to 4095 on an ESP32).
- Change the page title to your own name.

**The sketch:**

```cpp
// ESP32 basics: Wi-Fi + a tiny web page
#include <WiFi.h>
#include <WebServer.h>

const int LED = 13, KNOB = 34;     // GPIO numbers
WebServer server(80);

void page() {
  String h = "<html><head><meta name=viewport content='width=device-width'>"
             "<style>body{font-family:sans-serif;text-align:center}a{display:inline-block;margin:8px;padding:12px 22px;border-radius:12px;background:#2E6BE6;color:#fff;text-decoration:none}</style></head><body>"
             "<h2>My ESP32</h2><p>Knob: <b>" + String(analogRead(KNOB)) + "</b></p>"
             "<p>LED is " + String(digitalRead(LED) ? "ON" : "OFF") + "</p>"
             "<a href='/on'>ON</a><a href='/off'>OFF</a><a href='/'>Refresh</a></body></html>";
  server.send(200, "text/html", h);
}

void setup() {
  pinMode(LED, OUTPUT);
  Serial.begin(115200);
  WiFi.begin("School-Lab", "password");
  while (WiFi.status() != WL_CONNECTED) { delay(300); Serial.print("."); }
  Serial.print("\nMy address: "); Serial.println(WiFi.localIP());
  server.on("/", page);
  server.on("/on", [] { digitalWrite(LED, HIGH); page(); });
  server.on("/off", [] { digitalWrite(LED, LOW); page(); });
  server.begin();
}

void loop() {
  server.handleClient();
}
```


#### F-03 (LE) · 3D Modelling and Printing

**Unit:** Foundation & intro · **Phase:** Foundation · **Domain:** Foundation

**Kit for this activity:**

| Part | How many | Issued | Note |
|---|---|---|---|
| Laptop | 1 | per group | Tinkercad in the browser |
| 3D printer | 1 | per class |  |
| PLA filament | 1 | per class | 1 spool |
| Screwdriver set | 1 | per class | Scraper / print removal |


#### LE-01 · Light-Up Paper Circuit Card

**Unit:** Circuits & Power · **Phase:** Phase 1 · **Domain:** Electronics & Circuits

Every electrical device, from a torch to a phone, works because electricity travels around a complete loop called a circuit.

**What it does:** A coin cell lights an LED: the simplest circuit. Long leg to +, short leg to −.

**Kit for this activity:**

| Part | How many | Issued | Note |
|---|---|---|---|
| Copper tape | 1 | per group | 30 cm per group |
| LED 5 mm (assorted) | 2 | per group |  |
| Coin cell CR2032 | 1 | per group |  |
| Card / chart paper | 2 | per group |  |
| Markers | 1 | per group |  |
| Tape (paper + double-sided) | 1 | per class |  |

**Board:** null

**Wiring (as Circuit Lab builds it):**

- **Battery**: attrs: [object Object], rails: [object Object]
- **LED**: color: red, signal → pin +, direct: true

**Things to try in the simulator:**

- Press Start: the LED lights with no code at all.
- Click the LED, choose another colour, start again.
- Drag the LED's long leg off the + column: the circuit is broken and the light goes out.


#### LE-02 · Push-Button Doorbell

**Unit:** Circuits & Power · **Phase:** Phase 1 · **Domain:** Electronics & Circuits

When a visitor presses a doorbell, the button closes a circuit and a sound plays inside the house.

**What it does:** Press the button: the LED flashes and the buzzer plays ding-dong.

**Kit for this activity:**

| Part | How many | Issued | Note |
|---|---|---|---|
| Arduino Uno + USB cable | 1 | per group | Pre-wired by teacher |
| Push button | 1 | per group |  |
| Buzzer | 1 | per group |  |
| LED 5 mm (assorted) | 1 | per group |  |
| Resistor 220 ohm | 1 | per group |  |
| Resistor 10k ohm | 1 | per group |  |
| Breadboard (half size) | 1 | per group |  |
| Jumper wires M-M | 6 | per group |  |
| Laptop | 1 | per group |  |

**Board:** Arduino Uno

**Wiring (as Circuit Lab builds it):**

- **Push button**: signal → pin 2
- **LED**: color: yellow, signal → pin 13
- **Buzzer**: signal → pin 8

**Things to try in the simulator:**

- Click and hold the button while it runs.
- Make the doorbell play three notes instead of two.
- Make the LED blink twice for each ring.

**The sketch:**

```cpp
// Push-button doorbell: ding-dong!
const int BUTTON = 2, LED = 13, BUZZER = 8;

void setup() {
  pinMode(BUTTON, INPUT_PULLUP);   // pressed = LOW
  pinMode(LED, OUTPUT);
}

void loop() {
  if (digitalRead(BUTTON) == LOW) {
    digitalWrite(LED, HIGH);
    tone(BUZZER, 659, 400); delay(450);   // ding
    tone(BUZZER, 523, 600); delay(650);   // dong
    digitalWrite(LED, LOW);
  }
}
```


#### LE-03 · Lemon Battery LED Lamp

**Unit:** Circuits & Power · **Phase:** Phase 1 · **Domain:** Power & Energy

Batteries store chemical energy and turn it into electricity.

**What it does:** Three lemons with a zinc nail and a copper coin each make about 2.7 volts: enough for a red LED.

**Kit for this activity:**

| Part | How many | Issued | Note |
|---|---|---|---|
| Lemons | 4 | per group |  |
| Galvanized nails | 4 | per group |  |
| Copper coins | 4 | per group |  |
| Alligator clip leads | 5 | per group |  |
| LED 5 mm (assorted) | 1 | per group | Red works best |

**Board:** null

**Wiring (as Circuit Lab builds it):**

- **Battery**: attrs: [object Object], rails: [object Object]
- **LED**: color: red, signal → pin +, direct: true

**Things to try in the simulator:**

- Press Start: the red LED glows.
- Change the battery Type to 2xAA to compare.
- Real lemons give very little current, so the real LED is dim: try it in a dark room.


#### LE-04 · Traffic Light Controller

**Unit:** Circuits & Power · **Phase:** Phase 1 · **Domain:** Programming & Logic

Traffic lights keep cars and people safe by switching colours in a fixed order.

**What it does:** Red, yellow and green LEDs take turns like a real traffic light, with a beep before red.

**Kit for this activity:**

| Part | How many | Issued | Note |
|---|---|---|---|
| Arduino Uno + USB cable | 1 | per group | Pre-wired by teacher |
| LED 5 mm (assorted) | 3 | per group | Red, yellow, green |
| Resistor 220 ohm | 3 | per group |  |
| Buzzer | 1 | per group |  |
| Breadboard (half size) | 1 | per group |  |
| Jumper wires M-M | 8 | per group |  |
| Laptop | 1 | per group |  |

**Board:** Arduino Uno

**Wiring (as Circuit Lab builds it):**

- **LED**: color: red, signal → pin 13
- **LED**: color: yellow, signal → pin 12
- **LED**: color: green, signal → pin 11
- **Buzzer**: signal → pin 8

**Things to try in the simulator:**

- Press Start and watch the order: green, yellow, red.
- Make the green light last 5 seconds.
- Add a pedestrian beep: tone(8, 1000, 200) every second while red is on.

**The sketch:**

```cpp
// Traffic light: green -> yellow -> red
const int RED = 13, YELLOW = 12, GREEN = 11, BUZZER = 8;

void setup() {
  pinMode(RED, OUTPUT);
  pinMode(YELLOW, OUTPUT);
  pinMode(GREEN, OUTPUT);
}

void loop() {
  digitalWrite(GREEN, HIGH);  delay(3000);  digitalWrite(GREEN, LOW);
  digitalWrite(YELLOW, HIGH); tone(BUZZER, 880, 150); delay(1000); digitalWrite(YELLOW, LOW);
  digitalWrite(RED, HIGH);    delay(3000);  digitalWrite(RED, LOW);
}
```


#### LE-05 · Automatic Night Lamp

**Unit:** Sensing the World · **Phase:** Phase 1 · **Domain:** Sensors & Environment

Streetlights across a city switch on by themselves when it gets dark, saving electricity and keeping roads safe.

**What it does:** When it gets dark the lamp (LED) turns on by itself, like a street light.

**Kit for this activity:**

| Part | How many | Issued | Note |
|---|---|---|---|
| Arduino Uno + USB cable | 1 | per group | Pre-wired by teacher |
| LDR module | 1 | per group |  |
| LED 5 mm (assorted) | 2 | per group |  |
| Resistor 220 ohm | 2 | per group |  |
| Breadboard (half size) | 1 | per group |  |
| Jumper wires M-M | 4 | per group |  |
| Jumper wires M-F | 3 | per group |  |
| Laptop | 1 | per group |  |
| Buzzer | 1 | per group | Added: every Arduino class |

**Board:** Arduino Uno

**Wiring (as Circuit Lab builds it):**

- **Light sensor (LDR)**: AO → pin A0
- **LED**: color: white, signal → pin 13
- **Buzzer**: signal → pin 8

**Things to try in the simulator:**

- Click the light sensor and slide the light down to 0 (night).
- Watch the number in the Serial tab: bigger = darker.
- Change DARK to 500 so the lamp turns on earlier.

**The sketch:**

```cpp
// Automatic night lamp
const int LIGHT = A0, LAMP = 13, BUZZER = 8;
int DARK = 700;                 // higher number = darker
bool wasOn = false;

void setup() {
  pinMode(LAMP, OUTPUT);
  Serial.begin(9600);
}

void loop() {
  int dark = analogRead(LIGHT);
  Serial.println(dark);
  bool night = dark > DARK;
  digitalWrite(LAMP, night);
  if (night && !wasOn) tone(BUZZER, 1047, 120);   // little "click" sound
  wasOn = night;
  delay(200);
}
```


#### LE-06 · Hot & Cold Temperature Indicator

**Unit:** Sensing the World · **Phase:** Phase 1 · **Domain:** Sensors & Environment

Thermometers help us decide what to wear, when a child has a fever and when food is safe to eat.

**What it does:** Red LED when it is hot, blue LED when it is cold, and a warning beep if it is very hot.

**Kit for this activity:**

| Part | How many | Issued | Note |
|---|---|---|---|
| Arduino Uno + USB cable | 1 | per group | Pre-wired by teacher |
| DHT22 sensor | 1 | per group |  |
| LED 5 mm (assorted) | 2 | per group | Red and blue |
| Resistor 220 ohm | 2 | per group |  |
| Resistor 10k ohm | 1 | per group |  |
| Breadboard (half size) | 1 | per group |  |
| Jumper wires M-M | 6 | per group |  |
| Laptop | 1 | per group |  |
| Buzzer | 1 | per group | Added: every Arduino class |

**Board:** Arduino Uno

**Wiring (as Circuit Lab builds it):**

- **DHT22 temp & humidity**: SDA → pin 7
- **LED**: color: red, signal → pin 13
- **LED**: color: blue, signal → pin 12
- **Buzzer**: signal → pin 8

**Things to try in the simulator:**

- Click the DHT22 and set 35 °C: red. Set 10 °C: blue.
- Find the temperature where neither LED is on.
- Make it beep above 40 °C only.

**The sketch:**

```cpp
// Hot & cold indicator
#include <DHT.h>
DHT dht(7, DHT22);
const int HOT_LED = 13, COLD_LED = 12, BUZZER = 8;

void setup() {
  pinMode(HOT_LED, OUTPUT);
  pinMode(COLD_LED, OUTPUT);
  dht.begin();
  Serial.begin(9600);
}

void loop() {
  float t = dht.readTemperature();
  Serial.print(t); Serial.println(" C");

  digitalWrite(HOT_LED, t > 30);    // hot
  digitalWrite(COLD_LED, t < 18);   // cold
  if (t > 35) tone(BUZZER, 1500, 200);
  delay(2000);                      // the DHT22 needs 2 seconds
}
```


#### LE-07 · Plant Water Alarm

**Unit:** Sensing the World · **Phase:** Phase 1 · **Domain:** Sensors & Environment

Plants cannot tell us when they are thirsty, but a sensor can.

**What it does:** When the soil gets dry the red LED lights and the buzzer beeps. Wet soil = green LED.

**Kit for this activity:**

| Part | How many | Issued | Note |
|---|---|---|---|
| Arduino Uno + USB cable | 1 | per group | Pre-wired by teacher |
| Soil moisture sensor | 1 | per group |  |
| Buzzer | 1 | per group |  |
| LED 5 mm (assorted) | 1 | per group |  |
| Resistor 220 ohm | 1 | per group |  |
| Plant pot with soil | 1 | per group |  |
| Water container | 1 | per class |  |
| Breadboard (half size) | 1 | per group |  |
| Jumper wires M-M | 4 | per group |  |
| Jumper wires M-F | 3 | per group |  |
| Laptop | 1 | per group |  |

**Board:** Arduino Uno

**Wiring (as Circuit Lab builds it):**

- **Soil moisture sensor**: AO → pin A0
- **LED**: color: green, signal → pin 12
- **LED**: color: red, signal → pin 13
- **Buzzer**: signal → pin 8

**Things to try in the simulator:**

- Click the soil sensor and slide the moisture down below 30%.
- Change the dry level in the code from 30 to 40.
- Make the buzzer beep three short times instead of one long beep.

**The sketch:**

```cpp
// Plant water alarm
const int SOIL = A0, GREEN = 12, RED = 13, BUZZER = 8;

void setup() {
  pinMode(GREEN, OUTPUT);
  pinMode(RED, OUTPUT);
  Serial.begin(9600);
}

void loop() {
  int raw = analogRead(SOIL);                       // high = dry
  int moisture = constrain(map(raw, 1023, 300, 0, 100), 0, 100);
  Serial.print("Moisture: "); Serial.print(moisture); Serial.println(" %");

  if (moisture < 30) {               // thirsty!
    digitalWrite(RED, HIGH); digitalWrite(GREEN, LOW);
    tone(BUZZER, 1200, 300);
  } else {
    digitalWrite(RED, LOW); digitalWrite(GREEN, HIGH);
  }
  delay(1000);
}
```


#### LE-08 · Motion Detector Room Alarm

**Unit:** Sensing the World · **Phase:** Phase 1 · **Domain:** Security & Safety

Security lights and alarms notice when someone moves nearby.

**What it does:** When the PIR sensor sees movement the alarm flashes and sounds a siren.

**Kit for this activity:**

| Part | How many | Issued | Note |
|---|---|---|---|
| Arduino Uno + USB cable | 1 | per group | Pre-wired by teacher |
| PIR motion sensor | 1 | per group |  |
| Buzzer | 1 | per group |  |
| LED 5 mm (assorted) | 1 | per group |  |
| Resistor 220 ohm | 1 | per group |  |
| Breadboard (half size) | 1 | per group |  |
| Jumper wires M-M | 4 | per group |  |
| Jumper wires M-F | 3 | per group |  |
| Laptop | 1 | per group |  |

**Board:** Arduino Uno

**Wiring (as Circuit Lab builds it):**

- **PIR motion sensor**: OUT → pin 2
- **LED**: color: red, signal → pin 13
- **Buzzer**: signal → pin 8

**Things to try in the simulator:**

- Click the PIR sensor and press Wave in front.
- Make the siren last longer.
- Add a quiet mode: only flash, no sound.

**The sketch:**

```cpp
// Motion alarm
const int PIR = 2, LED = 13, BUZZER = 8;

void setup() {
  pinMode(PIR, INPUT);
  pinMode(LED, OUTPUT);
}

void loop() {
  if (digitalRead(PIR) == HIGH) {          // someone moved!
    for (int i = 0; i < 6; i++) {
      digitalWrite(LED, HIGH); tone(BUZZER, 1400); delay(150);
      digitalWrite(LED, LOW);  tone(BUZZER, 900);  delay(150);
    }
    noTone(BUZZER);
  }
}
```


#### LE-09 · Waving Robot Arm

**Unit:** Move & Communicate · **Phase:** Phase 1 · **Domain:** Robotics & Actuation

Robots in airports and hospitals greet people by waving and moving their arms.

**What it does:** Press the button and the servo arm waves hello three times.

**Kit for this activity:**

| Part | How many | Issued | Note |
|---|---|---|---|
| Arduino Uno + USB cable | 1 | per group | Pre-wired by teacher |
| Servo SG90 | 1 | per group |  |
| Push button | 1 | per group |  |
| Resistor 10k ohm | 1 | per group |  |
| Cardboard sheet | 1 | per group |  |
| Markers | 1 | per group |  |
| Googly eyes | 2 | per group |  |
| Breadboard (half size) | 1 | per group |  |
| Jumper wires M-M | 6 | per group |  |
| Laptop | 1 | per group |  |
| LED 5 mm (assorted) | 1 | per group | Added: every Arduino class |
| Resistor 220 ohm | 1 | per group | Added: for the LED |
| Buzzer | 1 | per group | Added: every Arduino class |

**Board:** Arduino Uno

**Wiring (as Circuit Lab builds it):**

- **Servo SG90**: PWM → pin 9
- **Push button**: signal → pin 2
- **LED**: color: green, signal → pin 13
- **Buzzer**: signal → pin 8

**Things to try in the simulator:**

- Press the button and watch the servo arm.
- Make it wave five times.
- Make it wave faster (smaller delay).

**The sketch:**

```cpp
// Waving robot arm
#include <Servo.h>
Servo arm;
const int BUTTON = 2, LED = 13, BUZZER = 8;

void setup() {
  arm.attach(9);
  arm.write(90);                     // arm down
  pinMode(BUTTON, INPUT_PULLUP);
  pinMode(LED, OUTPUT);
}

void loop() {
  if (digitalRead(BUTTON) == LOW) {
    digitalWrite(LED, HIGH);
    tone(BUZZER, 988, 150);
    for (int i = 0; i < 3; i++) {    // wave 3 times
      arm.write(30);  delay(400);
      arm.write(150); delay(400);
    }
    arm.write(90);
    digitalWrite(LED, LOW);
  }
}
```


#### LE-10 · Automatic Railway Crossing Gate

**Unit:** Move & Communicate · **Phase:** Phase 1 · **Domain:** Robotics & Actuation

At a railway crossing, a barrier lowers and a bell rings when a train comes near.

**What it does:** When a train comes close the gate (servo) closes, the red light flashes and the bell rings.

**Kit for this activity:**

| Part | How many | Issued | Note |
|---|---|---|---|
| Arduino Uno + USB cable | 1 | per group | Pre-wired by teacher |
| Ultrasonic sensor HC-SR04 | 1 | per group |  |
| Servo SG90 | 1 | per group |  |
| Buzzer | 1 | per group |  |
| LED 5 mm (assorted) | 2 | per group | Red |
| Resistor 220 ohm | 2 | per group |  |
| Ice cream sticks | 2 | per group | Gate arm |
| Breadboard (half size) | 1 | per group |  |
| Jumper wires M-M | 8 | per group |  |
| Jumper wires M-F | 4 | per group |  |
| Laptop | 1 | per group |  |

**Board:** Arduino Uno

**Wiring (as Circuit Lab builds it):**

- **Ultrasonic HC-SR04**: TRIG → pin 9, ECHO → pin 10
- **Servo SG90**: PWM → pin 6
- **LED**: color: red, signal → pin 13
- **Buzzer**: signal → pin 8

**Things to try in the simulator:**

- Set the distance below 25 cm: the gate goes down.
- Move it away again: the gate opens.
- Make the warning bell ring faster.

**The sketch:**

```cpp
// Railway crossing gate
#include <Servo.h>
Servo gate;
const int TRIG = 9, ECHO = 10, RED = 13, BELL = 8;

long distanceCM() {
  digitalWrite(TRIG, LOW);  delayMicroseconds(2);
  digitalWrite(TRIG, HIGH); delayMicroseconds(10);
  digitalWrite(TRIG, LOW);
  return pulseIn(ECHO, HIGH, 30000) / 58;
}

void setup() {
  pinMode(TRIG, OUTPUT); pinMode(ECHO, INPUT);
  pinMode(RED, OUTPUT);
  gate.attach(6);
  gate.write(90);                    // gate up (open)
}

void loop() {
  long cm = distanceCM();
  if (cm > 0 && cm < 25) {           // train coming!
    gate.write(0);                   // gate down
    digitalWrite(RED, HIGH); tone(BELL, 1200, 150); delay(300);
    digitalWrite(RED, LOW);  delay(300);
  } else {
    gate.write(90);
    digitalWrite(RED, LOW);
    delay(200);
  }
}
```


#### LE-11 · Vibrating Brush Robot

**Unit:** Move & Communicate · **Phase:** Phase 1 · **Domain:** Mechanical Design

Not every robot has wheels.

**What it does:** A coin cell spins a tiny motor with an off-centre weight: the shaking makes the brush bot walk.

**Kit for this activity:**

| Part | How many | Issued | Note |
|---|---|---|---|
| Brush Bot kit | 1 | per group |  |
| Coin cell CR2032 | 1 | per group |  |
| Googly eyes | 2 | per group |  |
| Tape (paper + double-sided) | 1 | per class |  |

**Board:** null

**Wiring (as Circuit Lab builds it):**

- **Battery**: attrs: [object Object], rails: [object Object]
- **DC motor**: label: Vibration motor, rails: [object Object]

**Things to try in the simulator:**

- Press Start: the motor spins.
- Swap the two motor wires: it spins the other way.
- Try a 2xAA battery: faster!


#### LE-12 · Morse Code Light Messenger

**Unit:** Move & Communicate · **Phase:** Phase 1 · **Domain:** IoT & Communication

Before phones, people sent messages across oceans using dots and dashes called Morse code.

**What it does:** The button is a Morse key: short press = dot, long press = dash. On start it sends SOS by itself.

**Kit for this activity:**

| Part | How many | Issued | Note |
|---|---|---|---|
| Arduino Uno + USB cable | 1 | per group | Pre-wired by teacher |
| Push button | 1 | per group |  |
| LED 5 mm (assorted) | 1 | per group |  |
| Buzzer | 1 | per group |  |
| Resistor 220 ohm | 1 | per group |  |
| Resistor 10k ohm | 1 | per group |  |
| Printed templates | 1 | per group | Morse picture chart |
| Breadboard (half size) | 1 | per group |  |
| Jumper wires M-M | 6 | per group |  |
| Laptop | 1 | per group |  |

**Board:** Arduino Uno

**Wiring (as Circuit Lab builds it):**

- **Push button**: signal → pin 2
- **LED**: color: yellow, signal → pin 13
- **Buzzer**: signal → pin 8

**Things to try in the simulator:**

- Watch the SOS at the start: · · ·  − − −  · · ·
- Press and hold the button to send your own dots and dashes.
- Change the code to send your name's first letter.

**The sketch:**

```cpp
// Morse code messenger
const int KEY = 2, LIGHT = 13, BUZZER = 8;
const int DOT = 200;

void beep(int ms) {
  digitalWrite(LIGHT, HIGH); tone(BUZZER, 700);
  delay(ms);
  digitalWrite(LIGHT, LOW); noTone(BUZZER);
  delay(DOT);
}

void setup() {
  pinMode(KEY, INPUT_PULLUP);
  pinMode(LIGHT, OUTPUT);
  for (int i = 0; i < 3; i++) beep(DOT);      // S
  for (int i = 0; i < 3; i++) beep(DOT * 3);  // O
  for (int i = 0; i < 3; i++) beep(DOT);      // S
}

void loop() {
  bool pressed = digitalRead(KEY) == LOW;     // you are the Morse key
  digitalWrite(LIGHT, pressed);
  if (pressed) tone(BUZZER, 700); else noTone(BUZZER);
}
```


#### LE-13 · Makey Makey Fruit Piano

**Unit:** Code, Play & AI · **Phase:** Phase 1 · **Domain:** Programming & Logic

Almost anything that conducts electricity can become a computer key.

**Kit for this activity:**

| Part | How many | Issued | Note |
|---|---|---|---|
| Makey Makey kit | 1 | per group |  |
| Fruits (bananas etc.) | 4 | per group |  |
| Aluminium foil | 1 | per class |  |
| Laptop | 1 | per group |  |

**Not in the simulator:** Makey Makey turns fruit into keyboard keys: try it with the real kit and Scratch.


#### LE-14 · Animated Story App

**Unit:** Code, Play & AI · **Phase:** Phase 1 · **Domain:** App, Web & Game Development

Apps and cartoons are built from small instructions that tell characters what to do.

**Kit for this activity:**

| Part | How many | Issued | Note |
|---|---|---|---|
| Tablet | 1 | per group | Or laptop with ScratchJr desktop |
| Printed templates | 2 | per group | Story planning sheet |


#### LE-15 · Catch-the-Fruit Game with Playdough Controller

**Unit:** Code, Play & AI · **Phase:** Phase 1 · **Domain:** App, Web & Game Development

Game designers create both the game and the controller players hold.

**Kit for this activity:**

| Part | How many | Issued | Note |
|---|---|---|---|
| Makey Makey kit | 1 | per group |  |
| Conductive playdough | 1 | per group |  |
| Laptop | 1 | per group |  |

**Not in the simulator:** Makey Makey and playdough: use the real kit with Scratch.


#### LE-16 · Robot Sorting Rules Game

**Unit:** Code, Play & AI · **Phase:** Phase 1 · **Domain:** AI & Data

Computers and AI sort information by asking simple yes-or-no questions, like a game of twenty questions.

**Kit for this activity:**

| Part | How many | Issued | Note |
|---|---|---|---|
| Printed templates | 20 | per group | Picture cards |
| Card / chart paper | 1 | per group | Question tree |
| Markers | 1 | per group |  |


#### LE-17 · Robot Chef: Unplugged Algorithms

**Unit:** Think Like a Computer · **Phase:** Phase 2 · **Domain:** Programming & Logic

Computers only do exactly what they are told, step by step.

**Kit for this activity:**

| Part | How many | Issued | Note |
|---|---|---|---|
| Printed templates | 1 | per group |  |
| Markers | 1 | per group |  |
| Tape (paper + double-sided) | 1 | per class | Floor grid |


#### LE-18 · Code.org Puzzle Quest: Sequences and Loops

**Unit:** Think Like a Computer · **Phase:** Phase 2 · **Domain:** Programming & Logic

Code.org puzzles turn coding into a game: children drag picture blocks to guide a character to a goal.

**Kit for this activity:**

| Part | How many | Issued | Note |
|---|---|---|---|
| Laptop | 1 | per group |  |


#### LE-19 · Program the Robot Car Through a Floor Maze

**Unit:** Think Like a Computer · **Phase:** Phase 2 · **Domain:** Robotics & Actuation

Delivery robots in warehouses follow programmed routes.

**What it does:** A robot car follows a list of moves: F = forward, L = left, R = right. Write the path through the maze.

**Kit for this activity:**

| Part | How many | Issued | Note |
|---|---|---|---|
| 4WD robot car (assembled, L298N) | 1 | per group | From Phase 2B requisition |
| Laptop | 1 | per group |  |
| Tape (paper + double-sided) | 1 | per class | Floor maze |
| Printed templates | 1 | per group |  |

**Board:** Arduino Uno

**Wiring (as Circuit Lab builds it):**

- **L298N motor driver**: ENA → pin 5, IN1 → pin 7, IN2 → pin 8, ENB → pin 6, IN3 → pin 9, IN4 → pin 11, with: [object Object]
- **Buzzer**: signal → pin 4

**Things to try in the simulator:**

- Start and watch both wheels: forward, then turns.
- Change the path in PATH to "FFLFRF".
- Add a B for backward.

**The sketch:**

```cpp
// Robot car maze program
const int ENA = 5, IN1 = 7, IN2 = 8, ENB = 6, IN3 = 9, IN4 = 11, BUZZER = 4;
String PATH = "FFRFLF";          // <-- your maze path

void drive(int left, int right) {           // -255 .. 255
  digitalWrite(IN1, left > 0);  digitalWrite(IN2, left < 0);  analogWrite(ENA, abs(left));
  digitalWrite(IN3, right > 0); digitalWrite(IN4, right < 0); analogWrite(ENB, abs(right));
}

void setup() {
  int pins[] = {ENA, IN1, IN2, ENB, IN3, IN4};
  for (int i = 0; i < 6; i++) pinMode(pins[i], OUTPUT);
  tone(BUZZER, 880, 200); delay(1000);
  for (unsigned int i = 0; i < PATH.length(); i++) {
    char step = PATH[i];
    if (step == 'F') drive(200, 200);
    if (step == 'B') drive(-200, -200);
    if (step == 'L') drive(-180, 180);
    if (step == 'R') drive(180, -180);
    delay(step == 'F' || step == 'B' ? 1000 : 500);
    drive(0, 0); delay(300);
  }
  tone(BUZZER, 1320, 400);       // finished!
}

void loop() {}
```


#### LE-20 · ScratchJr Dance Party

**Unit:** Think Like a Computer · **Phase:** Phase 2 · **Domain:** App, Web & Game Development

Animators and game designers make characters move to music.

**Kit for this activity:**

| Part | How many | Issued | Note |
|---|---|---|---|
| Tablet | 1 | per group |  |


#### LE-21 · Rainbow LED Ring

**Unit:** Light, Sound & Power · **Phase:** Phase 2 · **Domain:** Electronics & Circuits

Smart lights can show millions of colours using tiny red, green and blue lights.

**What it does:** Twelve colour LEDs make a spinning rainbow. A beep marks every full turn.

**Kit for this activity:**

| Part | How many | Issued | Note |
|---|---|---|---|
| Arduino Uno + USB cable | 1 | per group | Pre-wired by teacher |
| WS2812B LED ring (12 LEDs) | 1 | per group | Pre-wired |
| Laptop | 1 | per group |  |
| LED 5 mm (assorted) | 1 | per group | Added: every Arduino class |
| Resistor 220 ohm | 1 | per group | Added: for the LED |
| Buzzer | 1 | per group | Added: every Arduino class |

**Board:** Arduino Uno

**Wiring (as Circuit Lab builds it):**

- **NeoPixel ring**: DIN → pin 6
- **LED**: color: green, signal → pin 13
- **Buzzer**: signal → pin 8

**Things to try in the simulator:**

- Press Start and enjoy the rainbow.
- Change setBrightness(60) to 150.
- Make the whole ring one colour: ring.fill(ring.Color(0, 0, 255)).

**The sketch:**

```cpp
// Rainbow LED ring
#include <Adafruit_NeoPixel.h>
Adafruit_NeoPixel ring(12, 6, NEO_GRB + NEO_KHZ800);
const int LED = 13, BUZZER = 8;

void setup() {
  ring.begin();
  ring.setBrightness(60);
  pinMode(LED, OUTPUT);
}

void loop() {
  for (long hue = 0; hue < 65536; hue += 1024) {
    for (int i = 0; i < 12; i++)
      ring.setPixelColor(i, ring.ColorHSV(hue + i * 65536L / 12));
    ring.show();
    delay(20);
  }
  tone(BUZZER, 1047, 80);        // one full turn
  digitalWrite(LED, !digitalRead(LED));
}
```


#### LE-22 · Button Melody Maker

**Unit:** Light, Sound & Power · **Phase:** Phase 2 · **Domain:** Electronics & Circuits

Electronic pianos and toys play notes when you press a key.

**What it does:** Each button press plays the next note of a song on the buzzer.

**Kit for this activity:**

| Part | How many | Issued | Note |
|---|---|---|---|
| Arduino Uno + USB cable | 1 | per group | Pre-wired by teacher |
| Push button | 3 | per group |  |
| Passive buzzer | 1 | per group |  |
| Resistor 10k ohm | 3 | per group |  |
| Breadboard (half size) | 1 | per group |  |
| Jumper wires M-M | 8 | per group |  |
| Laptop | 1 | per group |  |
| LED 5 mm (assorted) | 1 | per group | Added: every Arduino class |
| Resistor 220 ohm | 1 | per group | Added: for the LED |
| Buzzer | 1 | per group | Added: every Arduino class |

**Board:** Arduino Uno

**Wiring (as Circuit Lab builds it):**

- **Push button**: signal → pin 2
- **LED**: color: blue, signal → pin 13
- **Buzzer**: signal → pin 8

**Things to try in the simulator:**

- Press the button again and again to play the tune.
- Change the notes to play a different song.
- Light the LED only while a note plays.

**The sketch:**

```cpp
// Button melody maker
const int BUTTON = 2, LED = 13, BUZZER = 8;
int song[] = {262, 262, 392, 392, 440, 440, 392, 349, 349, 330, 330, 294, 294, 262};
const int N = 14;
int next = 0;

void setup() {
  pinMode(BUTTON, INPUT_PULLUP);
  pinMode(LED, OUTPUT);
}

void loop() {
  if (digitalRead(BUTTON) == LOW) {
    digitalWrite(LED, HIGH);
    tone(BUZZER, song[next], 300);
    delay(320);
    digitalWrite(LED, LOW);
    next = (next + 1) % N;                     // next note, then start again
    while (digitalRead(BUTTON) == LOW) {}      // wait for release
  }
}
```


#### LE-23 · Colour Detective Sensor

**Unit:** Light, Sound & Power · **Phase:** Phase 2 · **Domain:** Sensors & Environment

Factories use colour sensors to sort sweets, fruit and recycling.

**What it does:** The colour sensor looks at an object and the RGB LED copies its colour.

**Kit for this activity:**

| Part | How many | Issued | Note |
|---|---|---|---|
| Arduino Uno + USB cable | 1 | per group | Pre-wired by teacher |
| Colour sensor TCS34725 | 1 | per group | Pre-wired |
| RGB LED | 1 | per group |  |
| Resistor 220 ohm | 3 | per group |  |
| Card / chart paper | 1 | per group | Coloured cards |
| LED 5 mm (assorted) | 1 | per group | Added: every Arduino class |
| Buzzer | 1 | per group | Added: every Arduino class |

**Board:** Arduino Uno

**Wiring (as Circuit Lab builds it):**

- **Colour sensor TCS34725**: SDA and SCL (A4 and A5 on an Uno, 21 and 22 on an ESP32), address 41
- **RGB LED**: R → pin 9, G → pin 10, B → pin 11
- **Buzzer**: signal → pin 8

**Things to try in the simulator:**

- Click the colour sensor and pick an object colour.
- Watch the RGB LED change to match.
- Open Serial to see the red, green and blue numbers.

**The sketch:**

```cpp
// Colour detective
#include <Wire.h>
#include <Adafruit_TCS34725.h>
Adafruit_TCS34725 eye(TCS34725_INTEGRATIONTIME_50MS, TCS34725_GAIN_4X);
const int R = 9, G = 10, B = 11, BUZZER = 8;

void setup() {
  Serial.begin(9600);
  if (!eye.begin()) Serial.println("Colour sensor not found");
}

void loop() {
  float r, g, b;
  eye.getRGB(&r, &g, &b);
  analogWrite(R, r); analogWrite(G, g); analogWrite(B, b);
  Serial.print("R "); Serial.print((int)r);
  Serial.print("  G "); Serial.print((int)g);
  Serial.print("  B "); Serial.println((int)b);
  if (r > 150 && g < 80 && b < 80) tone(BUZZER, 1200, 100);   // beep for red things
  delay(400);
}
```


#### LE-24 · Crank-Powered Light: Be the Power Station

**Unit:** Light, Sound & Power · **Phase:** Phase 2 · **Domain:** Power & Energy

Power stations make electricity by spinning a generator.

**Kit for this activity:**

| Part | How many | Issued | Note |
|---|---|---|---|
| DC hobby motor | 1 | per group |  |
| LED 5 mm (assorted) | 2 | per group | Red works best |
| Alligator clip leads | 2 | per group |  |
| Digital multimeter | 1 | per class | Teacher demo |
| Cardboard sheet | 1 | per group | Crank / windmill |

**Not in the simulator:** A motor used as a generator: see Faraday's Law in Virtual labs.


#### LE-25 · My Talking Pet in Scratch

**Unit:** Stories, Pictures & Machines · **Phase:** Phase 2 · **Domain:** App, Web & Game Development

Virtual pets and talking toys respond when you play with them.

**Kit for this activity:**

| Part | How many | Issued | Note |
|---|---|---|---|
| Laptop | 1 | per group |  |


#### LE-26 · Pixel Messages: Send a Picture with Numbers

**Unit:** Stories, Pictures & Machines · **Phase:** Phase 2 · **Domain:** IoT & Communication

Every photo sent on a phone travels as numbers.

**Kit for this activity:**

| Part | How many | Issued | Note |
|---|---|---|---|
| Printed templates | 1 | per group |  |
| Markers | 1 | per group |  |


#### LE-27 · Pop the Bubbles with Your Hand

**Unit:** Stories, Pictures & Machines · **Phase:** Phase 2 · **Domain:** App, Web & Game Development

Some games use a camera so you play by moving your body.

**Kit for this activity:**

| Part | How many | Issued | Note |
|---|---|---|---|
| Laptop | 1 | per group |  |
| Webcam | 1 | per group | Or built-in camera |


#### LE-28 · Cardboard Automaton: Cams and Cranks

**Unit:** Stories, Pictures & Machines · **Phase:** Phase 2 · **Domain:** Mechanical Design

Before electronics, inventors built moving toys using cams: odd-shaped wheels that push things up and down.

**Kit for this activity:**

| Part | How many | Issued | Note |
|---|---|---|---|
| Cardboard sheet | 1 | per group |  |
| Wooden skewers | 3 | per group |  |
| Straws | 2 | per group |  |
| Glue gun + glue sticks | 1 | per class | Teacher only |
| Markers | 1 | per group |  |


#### LE-29 · Teach the Computer Our Sounds

**Unit:** Smart Helpers & AI · **Phase:** Phase 2 · **Domain:** AI & Data

Smart speakers learn to recognise voices and sounds.

**Kit for this activity:**

| Part | How many | Issued | Note |
|---|---|---|---|
| Laptop | 1 | per group |  |


#### LE-30 · Follow-Me Robot Pet

**Unit:** Smart Helpers & AI · **Phase:** Phase 2 · **Domain:** Robotics & Actuation

Robot pets and luggage-carrying robots can follow a person.

**What it does:** The robot pet keeps 20 cm from your hand: too far = drive forward, too close = back up.

**Kit for this activity:**

| Part | How many | Issued | Note |
|---|---|---|---|
| 4WD robot car (assembled, L298N) | 1 | per group | From Phase 2B requisition |
| Ultrasonic sensor HC-SR04 | 1 | per group | Pre-fitted |
| Laptop | 1 | per group |  |
| Card / chart paper | 1 | per group | Pet face |

**Board:** Arduino Uno

**Wiring (as Circuit Lab builds it):**

- **Ultrasonic HC-SR04**: TRIG → pin 12, ECHO → pin 10
- **L298N motor driver**: ENA → pin 5, IN1 → pin 7, IN2 → pin 8, ENB → pin 6, IN3 → pin 9, IN4 → pin 11, with: [object Object]

**Things to try in the simulator:**

- Set the distance to 50 cm: the wheels drive forward.
- Set it to 10 cm: the wheels go backward.
- At about 20 cm the pet stays still. Change the happy distance to 30.

**The sketch:**

```cpp
// Follow-me robot pet
const int TRIG = 12, ECHO = 10;
const int ENA = 5, IN1 = 7, IN2 = 8, ENB = 6, IN3 = 9, IN4 = 11;
const int HAPPY = 20;   // cm

long distanceCM() {
  digitalWrite(TRIG, LOW); delayMicroseconds(2);
  digitalWrite(TRIG, HIGH); delayMicroseconds(10); digitalWrite(TRIG, LOW);
  return pulseIn(ECHO, HIGH, 30000) / 58;
}

void drive(int left, int right) {
  digitalWrite(IN1, left > 0);  digitalWrite(IN2, left < 0);  analogWrite(ENA, abs(left));
  digitalWrite(IN3, right > 0); digitalWrite(IN4, right < 0); analogWrite(ENB, abs(right));
}

void setup() {
  pinMode(TRIG, OUTPUT); pinMode(ECHO, INPUT);
  int pins[] = {ENA, IN1, IN2, ENB, IN3, IN4};
  for (int i = 0; i < 6; i++) pinMode(pins[i], OUTPUT);
  Serial.begin(9600);
}

void loop() {
  long cm = distanceCM();
  Serial.println(cm);
  if (cm > HAPPY + 5 && cm < 100) drive(180, 180);   // follow
  else if (cm > 0 && cm < HAPPY - 5) drive(-160, -160); // back up
  else drive(0, 0);                                     // happy here
  delay(100);
}
```


#### LE-31 · Safety Helper Robot Design

**Unit:** Smart Helpers & AI · **Phase:** Phase 2 · **Domain:** Security & Safety

Engineers design robots to keep people safe, like robots that warn of fire or help older people.

**Kit for this activity:**

| Part | How many | Issued | Note |
|---|---|---|---|
| Cardboard sheet | 1 | per group |  |
| Markers | 1 | per group |  |
| Printed templates | 1 | per group |  |
| Tape (paper + double-sided) | 1 | per class |  |
| Googly eyes | 2 | per group |  |


#### LE-32 · Countdown Rocket Launch

**Unit:** Smart Helpers & AI · **Phase:** Phase 2 · **Domain:** App, Web & Game Development

Space agencies count down before every launch.

**What it does:** Press the button: 3 (red), 2 (yellow), 1 (green)… LIFT OFF with a rocket sound!

**Kit for this activity:**

| Part | How many | Issued | Note |
|---|---|---|---|
| Arduino Uno + USB cable | 1 | per group | Pre-wired by teacher |
| Push button | 1 | per group | Pre-wired |
| LED 5 mm (assorted) | 2 | per group |  |
| Resistor 220 ohm | 2 | per group |  |
| Resistor 10k ohm | 1 | per group |  |
| Laptop | 1 | per group |  |
| Buzzer | 1 | per group | Added: every Arduino class |

**Board:** Arduino Uno

**Wiring (as Circuit Lab builds it):**

- **Push button**: signal → pin 2
- **LED**: color: red, signal → pin 13
- **LED**: color: yellow, signal → pin 12
- **LED**: color: green, signal → pin 11
- **Buzzer**: signal → pin 8

**Things to try in the simulator:**

- Press the button to launch.
- Make the countdown start from 5.
- Make the lift-off sound go higher and higher.

**The sketch:**

```cpp
// Countdown rocket launch
const int BUTTON = 2, RED = 13, YELLOW = 12, GREEN = 11, BUZZER = 8;

void setup() {
  pinMode(BUTTON, INPUT_PULLUP);
  pinMode(RED, OUTPUT); pinMode(YELLOW, OUTPUT); pinMode(GREEN, OUTPUT);
  Serial.begin(9600);
}

void loop() {
  if (digitalRead(BUTTON) == LOW) {
    Serial.println("3"); digitalWrite(RED, HIGH);    tone(BUZZER, 440, 200); delay(1000);
    Serial.println("2"); digitalWrite(YELLOW, HIGH); tone(BUZZER, 440, 200); delay(1000);
    Serial.println("1"); digitalWrite(GREEN, HIGH);  tone(BUZZER, 440, 200); delay(1000);
    Serial.println("LIFT OFF!");
    for (int f = 200; f < 2000; f += 10) { tone(BUZZER, f); delay(5); }
    noTone(BUZZER);
    digitalWrite(RED, LOW); digitalWrite(YELLOW, LOW); digitalWrite(GREEN, LOW);
  }
}
```


### JM · Junior Makers (ages 8-11)

37 activities. Foundation: 4 · Intro: 1 · Phase 1: 16 · Phase 2: 16

#### F-00 (JM) · Welcome to Robotics (Distance Alarm)

**Unit:** Foundation & intro · **Phase:** Foundation · **Domain:** Foundation

**What it does:** Like a car parking sensor: when something comes closer than 20 cm the LED lights and the buzzer sounds.

**Kit for this activity:**

| Part | How many | Issued | Note |
|---|---|---|---|
| Arduino Uno + USB cable | 1 | per group |  |
| Ultrasonic sensor HC-SR04 | 1 | per group |  |
| LED 5 mm (assorted) | 1 | per group | Red |
| Resistor 220 ohm | 1 | per group |  |
| Buzzer | 1 | per group |  |
| Breadboard (half size) | 1 | per group |  |
| Jumper wires M-M | 6 | per group |  |
| Laptop | 1 | per group |  |

**Board:** Arduino Uno

**Wiring (as Circuit Lab builds it):**

- **Ultrasonic HC-SR04**: TRIG → pin 9, ECHO → pin 10
- **LED**: color: red, signal → pin 13
- **Buzzer**: signal → pin 8

**Things to try in the simulator:**

- Click the ultrasonic sensor and move the distance slider below 20 cm.
- Open the Serial tab to see the distance.
- Change ALARM_CM to 40 and test again.

**The sketch:**

```cpp
// Distance Alarm: like a car parking sensor
const int TRIG = 9, ECHO = 10, LED = 13, BUZZ = 8;
int ALARM_CM = 20;                    // <-- change me!

void setup() {
  pinMode(TRIG, OUTPUT);  pinMode(ECHO, INPUT);
  pinMode(LED, OUTPUT);   pinMode(BUZZ, OUTPUT);
  Serial.begin(9600);
}

void loop() {
  digitalWrite(TRIG, HIGH); delayMicroseconds(10);
  digitalWrite(TRIG, LOW);                 // SENSE: send a sound pulse
  long cm = pulseIn(ECHO, HIGH, 30000) / 58;
  Serial.println(cm);                      // see the distance

  if (cm > 0 && cm < ALARM_CM) {           // THINK: too close?
    digitalWrite(LED, HIGH);               // ACT: light on
    digitalWrite(BUZZ, HIGH);              //      and beep
  } else {
    digitalWrite(LED, LOW);
    digitalWrite(BUZZ, LOW);
  }
  delay(100);
}
```


#### F-01 (JM) · Arduino Uno Basics

**Unit:** Foundation & intro · **Phase:** Foundation · **Domain:** Foundation

**What it does:** Output, input and analog in one circuit: the knob sets the blink speed and the button beeps.

**Kit for this activity:**

| Part | How many | Issued | Note |
|---|---|---|---|
| Arduino Uno + USB cable | 1 | per group |  |
| LED 5 mm (assorted) | 2 | per group |  |
| Resistor 220 ohm | 2 | per group |  |
| Push button | 1 | per group | INPUT_PULLUP demo |
| Potentiometer 10k | 1 | per group | Analog input demo |
| Breadboard (half size) | 1 | per group |  |
| Jumper wires M-M | 8 | per group |  |
| Laptop | 1 | per group |  |
| Buzzer | 1 | per group | Added: every Arduino class |

**Board:** Arduino Uno

**Wiring (as Circuit Lab builds it):**

- **LED**: color: green, signal → pin 13
- **Push button**: signal → pin 2
- **Potentiometer**: signal → pin A0
- **Buzzer**: signal → pin 8

**Things to try in the simulator:**

- Turn the knob while it runs: the LED blinks faster or slower.
- Hold the button: the buzzer beeps.
- Open Serial to see the blink time in milliseconds.

**The sketch:**

```cpp
// Arduino Uno basics: OUTPUT, INPUT and ANALOG
const int LED = 13, BUTTON = 2, KNOB = A0, BUZZER = 8;

void setup() {
  pinMode(LED, OUTPUT);              // an output
  pinMode(BUTTON, INPUT_PULLUP);     // an input (pressed = LOW)
  Serial.begin(9600);
}

void loop() {
  int knob = analogRead(KNOB);                 // 0 .. 1023
  int wait = map(knob, 0, 1023, 100, 1000);    // 0.1 .. 1 second
  Serial.print("Blink time: "); Serial.println(wait);

  digitalWrite(LED, HIGH); delay(wait);
  digitalWrite(LED, LOW);  delay(wait);

  if (digitalRead(BUTTON) == LOW) tone(BUZZER, 880, 150);
}
```


#### F-02 (JM) · ESP32 Basics

**Unit:** Foundation & intro · **Phase:** Foundation · **Domain:** Foundation

**What it does:** An ESP32 joins Wi-Fi, reads a knob and serves a web page where a phone switches the LED.

**Kit for this activity:**

| Part | How many | Issued | Note |
|---|---|---|---|
| ESP32 Dev Board + USB cable | 1 | per group | Data cable, not charge-only |
| LED 5 mm (assorted) | 1 | per group |  |
| Resistor 220 ohm | 1 | per group |  |
| Potentiometer 10k | 1 | per group | ADC demo |
| Breadboard (half size) | 2 | per group | ESP32 is wide: bridge 2 boards |
| Jumper wires M-M | 6 | per group |  |
| Jumper wires M-F | 4 | per group | Touch-pin demo |
| Laptop | 1 | per group |  |
| Android smartphone | 1 | per class | Wi-Fi / Bluetooth demo |

**Board:** ESP32 DevKit

**Wiring (as Circuit Lab builds it):**

- **LED**: color: blue, signal → pin 13
- **Potentiometer**: signal → pin 34

**Things to try in the simulator:**

- Start, then open the Phone tab: tap ON and OFF.
- Turn the knob and press Refresh on the page: the number changes (0 to 4095 on an ESP32).
- Change the page title to your own name.

**The sketch:**

```cpp
// ESP32 basics: Wi-Fi + a tiny web page
#include <WiFi.h>
#include <WebServer.h>

const int LED = 13, KNOB = 34;     // GPIO numbers
WebServer server(80);

void page() {
  String h = "<html><head><meta name=viewport content='width=device-width'>"
             "<style>body{font-family:sans-serif;text-align:center}a{display:inline-block;margin:8px;padding:12px 22px;border-radius:12px;background:#2E6BE6;color:#fff;text-decoration:none}</style></head><body>"
             "<h2>My ESP32</h2><p>Knob: <b>" + String(analogRead(KNOB)) + "</b></p>"
             "<p>LED is " + String(digitalRead(LED) ? "ON" : "OFF") + "</p>"
             "<a href='/on'>ON</a><a href='/off'>OFF</a><a href='/'>Refresh</a></body></html>";
  server.send(200, "text/html", h);
}

void setup() {
  pinMode(LED, OUTPUT);
  Serial.begin(115200);
  WiFi.begin("School-Lab", "password");
  while (WiFi.status() != WL_CONNECTED) { delay(300); Serial.print("."); }
  Serial.print("\nMy address: "); Serial.println(WiFi.localIP());
  server.on("/", page);
  server.on("/on", [] { digitalWrite(LED, HIGH); page(); });
  server.on("/off", [] { digitalWrite(LED, LOW); page(); });
  server.begin();
}

void loop() {
  server.handleClient();
}
```


#### F-03 (JM) · 3D Modelling and Printing

**Unit:** Foundation & intro · **Phase:** Foundation · **Domain:** Foundation

**Kit for this activity:**

| Part | How many | Issued | Note |
|---|---|---|---|
| Laptop | 1 | per group | Tinkercad in the browser |
| 3D printer | 1 | per class |  |
| PLA filament | 1 | per class | 1 spool |
| Screwdriver set | 1 | per class | Scraper / print removal |


#### JM-00 · Intro to Robotics + Art Bot

**Unit:** Foundation & intro · **Phase:** Intro · **Domain:** Robotics & Actuation

**What it does:** Batteries, a switch and a motor: flip the switch and the art bot's motor spins its pens.

**Kit for this activity:**

| Part | How many | Issued | Note |
|---|---|---|---|
| Plastic or paper cup | 1 | per group | Never a real glass |
| Markers | 1 | per group | 3-4 washable markers |
| DC hobby motor | 1 | per group |  |
| Cork | 1 | per group | Fixed off-centre on the shaft |
| 2xAA battery holder + batteries | 1 | per group |  |
| Slide switch | 1 | per group | Optional |
| Tape (paper + double-sided) | 1 | per group |  |
| Card / chart paper | 2 | per group | Big drawing paper |
| Glue gun + glue sticks | 1 | per class | Teacher only |

**Board:** null

**Wiring (as Circuit Lab builds it):**

- **Battery**: attrs: [object Object], rails: [object Object]
- **Slide switch**: feed: true
- **DC motor**: label: Art bot motor, rails: [object Object]

**Things to try in the simulator:**

- Press Start, then click the slide switch to turn the motor on and off.
- Swap the motor's two wires: it spins the other way.
- Change the battery to 4xAA: faster.


#### JM-01 · Series & Parallel Circuit Lab

**Unit:** Circuits, Code & Sensing · **Phase:** Phase 1 · **Domain:** Electronics & Circuits

Why do some fairy lights all go out when one bulb breaks, while house lights keep working?

**What it does:** Two LEDs in parallel: each has its own path from + to −, so both shine fully and one can fail without the other going out.

**Kit for this activity:**

| Part | How many | Issued | Note |
|---|---|---|---|
| Breadboard (half size) | 1 | per group |  |
| LED 5 mm (assorted) | 4 | per group |  |
| Resistor 220 ohm | 4 | per group |  |
| Slide switch | 2 | per group |  |
| 9V battery + snap | 1 | per group |  |
| Digital multimeter | 1 | per group |  |
| Jumper wires M-M | 10 | per group |  |
| Laptop | 1 | per group |  |

**Board:** null

**Wiring (as Circuit Lab builds it):**

- **Battery**: attrs: [object Object], rails: [object Object]
- **Slide switch**: feed: true
- **LED**: color: red, signal → pin +
- **LED**: color: green, signal → pin +

**Things to try in the simulator:**

- Start and flip the switch: both LEDs light together.
- Delete the green LED: the red one stays on. That is parallel.
- For series circuits and brightness, open Circuit Construction Kit: DC in Virtual labs.


#### JM-02 · Two-Player Reaction Timer with Scoreboard

**Unit:** Circuits, Code & Sensing · **Phase:** Phase 1 · **Domain:** Programming & Logic

Athletes, pilots and gamers all rely on fast reactions.

**What it does:** Wait for the red light, then press first! The OLED keeps the score. Pressing too early loses the point.

**Kit for this activity:**

| Part | How many | Issued | Note |
|---|---|---|---|
| Arduino Uno + USB cable | 1 | per group |  |
| Push button | 2 | per group |  |
| LED 5 mm (assorted) | 2 | per group |  |
| Resistor 220 ohm | 2 | per group |  |
| Resistor 10k ohm | 2 | per group |  |
| Buzzer | 1 | per group |  |
| OLED 0.96 in I2C | 1 | per group |  |
| Breadboard (half size) | 1 | per group |  |
| Jumper wires M-M | 14 | per group |  |
| Jumper wires M-F | 4 | per group |  |
| Laptop | 1 | per group |  |

**Board:** Arduino Uno

**Wiring (as Circuit Lab builds it):**

- **Push button**: signal → pin 2, color: green
- **Push button**: signal → pin 3, color: blue
- **LED**: color: red, signal → pin 13
- **LED**: color: green, signal → pin 12
- **LED**: color: blue, signal → pin 11
- **Buzzer**: signal → pin 8
- **OLED 0.96" I2C**: SDA and SCL (A4 and A5 on an Uno, 21 and 22 on an ESP32), address 60

**Things to try in the simulator:**

- Start, wait for the red LED, then click a button.
- Click a button before red: that player loses the point.
- Make the game end when someone reaches 5 points.

**The sketch:**

```cpp
// Two-player reaction timer
#include <Wire.h>
#include <Adafruit_GFX.h>
#include <Adafruit_SSD1306.h>
Adafruit_SSD1306 oled(128, 64, &Wire, -1);
const int P1 = 2, P2 = 3, GO = 13, LED1 = 12, LED2 = 11, BUZZER = 8;
int score1 = 0, score2 = 0;

void show(const char* msg) {
  oled.clearDisplay();
  oled.setTextSize(1); oled.setCursor(0, 0); oled.print("REACTION BATTLE");
  oled.setTextSize(2); oled.setCursor(0, 18); oled.print("P1 "); oled.print(score1);
  oled.setCursor(70, 18); oled.print("P2 "); oled.print(score2);
  oled.setTextSize(1); oled.setCursor(0, 48); oled.print(msg);
  oled.display();
}

void setup() {
  pinMode(P1, INPUT_PULLUP); pinMode(P2, INPUT_PULLUP);
  pinMode(GO, OUTPUT); pinMode(LED1, OUTPUT); pinMode(LED2, OUTPUT);
  oled.begin(SSD1306_SWITCHCAPVCC, 0x3C);
  oled.setTextColor(SSD1306_WHITE);
  randomSeed(analogRead(A0));
  show("Get ready...");
}

void loop() {
  digitalWrite(LED1, LOW); digitalWrite(LED2, LOW);
  unsigned long wait = millis() + random(2000, 5000);
  while (millis() < wait) {                       // too early?
    if (digitalRead(P1) == LOW) { score2++; show("P1 too early!"); delay(1500); return; }
    if (digitalRead(P2) == LOW) { score1++; show("P2 too early!"); delay(1500); return; }
  }
  digitalWrite(GO, HIGH); tone(BUZZER, 1000, 100);
  unsigned long start = millis();
  while (true) {
    if (digitalRead(P1) == LOW) { score1++; digitalWrite(LED1, HIGH); break; }
    if (digitalRead(P2) == LOW) { score2++; digitalWrite(LED2, HIGH); break; }
  }
  digitalWrite(GO, LOW);
  char msg[24]; sprintf(msg, "Time: %lu ms", millis() - start);
  show(msg);
  delay(2000);
}
```


#### JM-03 · Mini Weather Station with OLED Display

**Unit:** Circuits, Code & Sensing · **Phase:** Phase 1 · **Domain:** Sensors & Environment

Weather stations help farmers, pilots and families plan their day.

**What it does:** Temperature, humidity and light level on an OLED screen. The LED warns when it is too hot.

**Kit for this activity:**

| Part | How many | Issued | Note |
|---|---|---|---|
| Arduino Uno + USB cable | 1 | per group |  |
| DHT22 sensor | 1 | per group |  |
| LDR module | 1 | per group |  |
| OLED 0.96 in I2C | 1 | per group |  |
| Resistor 10k ohm | 1 | per group |  |
| Breadboard (half size) | 1 | per group |  |
| Jumper wires M-M | 10 | per group |  |
| Jumper wires M-F | 6 | per group |  |
| Laptop | 1 | per group |  |
| LED 5 mm (assorted) | 1 | per group | Added: every Arduino class |
| Resistor 220 ohm | 1 | per group | Added: for the LED |
| Buzzer | 1 | per group | Added: every Arduino class |

**Board:** Arduino Uno

**Wiring (as Circuit Lab builds it):**

- **DHT22 temp & humidity**: SDA → pin 7
- **Light sensor (LDR)**: AO → pin A0
- **OLED 0.96" I2C**: SDA and SCL (A4 and A5 on an Uno, 21 and 22 on an ESP32), address 60
- **LED**: color: red, signal → pin 13
- **Buzzer**: signal → pin 8

**Things to try in the simulator:**

- Click the DHT22 and change the temperature: the screen updates every 2 seconds.
- Cover the light sensor (light slider to 0): the screen shows 'Dark'.
- Make the red LED come on above 35 °C.

**The sketch:**

```cpp
// Mini weather station
#include <Wire.h>
#include <Adafruit_GFX.h>
#include <Adafruit_SSD1306.h>
#include <DHT.h>

Adafruit_SSD1306 oled(128, 64, &Wire, -1);
DHT dht(7, DHT22);
const int LIGHT = A0, LED = 13, BUZZER = 8;

void setup() {
  pinMode(LED, OUTPUT);
  dht.begin();
  oled.begin(SSD1306_SWITCHCAPVCC, 0x3C);
  oled.setTextColor(SSD1306_WHITE);
}

void loop() {
  float t = dht.readTemperature();
  float h = dht.readHumidity();
  int dark = analogRead(LIGHT);

  oled.clearDisplay();
  oled.setTextSize(1); oled.setCursor(0, 0); oled.print("WEATHER STATION");
  oled.setTextSize(2); oled.setCursor(0, 16); oled.print(t, 1); oled.print(" C");
  oled.setCursor(0, 36); oled.print(h, 0); oled.print(" %");
  oled.setTextSize(1); oled.setCursor(0, 56); oled.print(dark > 700 ? "Dark" : "Bright");
  oled.display();

  bool hot = t > 32;
  digitalWrite(LED, hot);
  if (hot) tone(BUZZER, 1500, 100);
  delay(2000);
}
```


#### JM-04 · Smart Dustbin with Fill-Level Indicator

**Unit:** Circuits, Code & Sensing · **Phase:** Phase 1 · **Domain:** Robotics & Actuation

Smart bins in modern cities open without touching and tell cleaners when they are full.

**What it does:** Wave a hand near the bin: the lid opens by itself. Green = lid closed, red = lid open.

**Kit for this activity:**

| Part | How many | Issued | Note |
|---|---|---|---|
| Arduino Uno + USB cable | 1 | per group |  |
| Ultrasonic sensor HC-SR04 | 2 | per group |  |
| Servo SG90 | 1 | per group |  |
| LED 5 mm (assorted) | 3 | per group | Green, yellow, red |
| Resistor 220 ohm | 3 | per group |  |
| Cardboard sheet | 1 | per group | Box for bin |
| Breadboard (half size) | 1 | per group |  |
| Jumper wires M-M | 14 | per group |  |
| Jumper wires M-F | 8 | per group |  |
| Laptop | 1 | per group |  |
| Buzzer | 1 | per group | Added: every Arduino class |

**Board:** Arduino Uno

**Wiring (as Circuit Lab builds it):**

- **Ultrasonic HC-SR04**: TRIG → pin 9, ECHO → pin 10
- **Servo SG90**: PWM → pin 6
- **LED**: color: green, signal → pin 12
- **LED**: color: red, signal → pin 13
- **Buzzer**: signal → pin 8

**Things to try in the simulator:**

- Set the distance below 15 cm: the lid (servo) opens.
- Make the lid stay open for 5 seconds.
- Add a beep when the lid closes.

**The sketch:**

```cpp
// Smart dustbin
#include <Servo.h>
Servo lid;
const int TRIG = 9, ECHO = 10, GREEN = 12, RED = 13, BUZZER = 8;

long distanceCM() {
  digitalWrite(TRIG, LOW); delayMicroseconds(2);
  digitalWrite(TRIG, HIGH); delayMicroseconds(10); digitalWrite(TRIG, LOW);
  return pulseIn(ECHO, HIGH, 30000) / 58;
}

void setup() {
  pinMode(TRIG, OUTPUT); pinMode(ECHO, INPUT);
  pinMode(GREEN, OUTPUT); pinMode(RED, OUTPUT);
  lid.attach(6);
  lid.write(0);                       // closed
  Serial.begin(9600);
}

void loop() {
  long cm = distanceCM();
  Serial.println(cm);
  if (cm > 0 && cm < 15) {            // a hand!
    tone(BUZZER, 1200, 80);
    lid.write(110);                   // open
    digitalWrite(RED, HIGH); digitalWrite(GREEN, LOW);
    delay(3000);
    lid.write(0);                     // close again
  }
  digitalWrite(RED, LOW); digitalWrite(GREEN, HIGH);
  delay(150);
}
```


#### JM-05 · Rain-Sensing Automatic Window

**Unit:** Smart Home & Energy · **Phase:** Phase 1 · **Domain:** Sensors & Environment

Nobody wants rain soaking the room when a window is left open.

**What it does:** When rain lands on the sensor, the window (servo) closes and the buzzer warns.

**Kit for this activity:**

| Part | How many | Issued | Note |
|---|---|---|---|
| Arduino Uno + USB cable | 1 | per group |  |
| Rain sensor | 1 | per group |  |
| Servo SG90 | 1 | per group |  |
| Buzzer | 1 | per group |  |
| LED 5 mm (assorted) | 1 | per group |  |
| Resistor 220 ohm | 1 | per group |  |
| Cardboard sheet | 1 | per group | Model window |
| Breadboard (half size) | 1 | per group |  |
| Jumper wires M-M | 10 | per group |  |
| Jumper wires M-F | 4 | per group |  |
| Laptop | 1 | per group |  |

**Board:** Arduino Uno

**Wiring (as Circuit Lab builds it):**

- **Rain sensor**: AO → pin A0
- **Servo SG90**: PWM → pin 9
- **LED**: color: blue, signal → pin 13
- **Buzzer**: signal → pin 8

**Things to try in the simulator:**

- Click the rain sensor and add rain: the window closes.
- Dry it again: the window opens.
- Make the window close only in heavy rain.

**The sketch:**

```cpp
// Rain-sensing window
#include <Servo.h>
Servo window;
const int RAIN = A0, LED = 13, BUZZER = 8;
bool closed = false;

void setup() {
  window.attach(9);
  window.write(90);                  // open
  pinMode(LED, OUTPUT);
  Serial.begin(9600);
}

void loop() {
  int wet = analogRead(RAIN);        // lower = wetter
  Serial.println(wet);
  if (wet < 600 && !closed) {        // rain started
    tone(BUZZER, 900, 400);
    window.write(0); closed = true;
  }
  if (wet > 800 && closed) {         // dry again
    window.write(90); closed = false;
  }
  digitalWrite(LED, closed);
  delay(300);
}
```


#### JM-06 · Fire & Gas Safety Alarm Panel

**Unit:** Smart Home & Energy · **Phase:** Phase 1 · **Domain:** Security & Safety

Fire and gas leaks are dangerous at home and in factories, so buildings use detectors that warn people early.

**What it does:** Watches for flames and smoke. The OLED shows the readings and the alarm sounds on danger.

**Kit for this activity:**

| Part | How many | Issued | Note |
|---|---|---|---|
| Arduino Uno + USB cable | 1 | per group |  |
| Flame sensor | 1 | per group |  |
| MQ-2 gas sensor | 1 | per group |  |
| Buzzer | 1 | per group |  |
| LED 5 mm (assorted) | 2 | per group | Green, red |
| Resistor 220 ohm | 2 | per group |  |
| OLED 0.96 in I2C | 1 | per group |  |
| Candle | 1 | per class | Teacher only |
| Breadboard (half size) | 1 | per group |  |
| Jumper wires M-M | 12 | per group |  |
| Jumper wires M-F | 8 | per group |  |
| Laptop | 1 | per group |  |

**Board:** Arduino Uno

**Wiring (as Circuit Lab builds it):**

- **Flame sensor**: DO → pin 2
- **Gas / smoke MQ-2**: AO → pin A0
- **LED**: color: red, signal → pin 13
- **Buzzer**: signal → pin 8
- **OLED 0.96" I2C**: SDA and SCL (A4 and A5 on an Uno, 21 and 22 on an ESP32), address 60

**Things to try in the simulator:**

- Click the gas sensor and raise the smoke above 400 ppm.
- Click the flame sensor and bring a flame close.
- Show 'SAFE' in big letters when everything is fine.

**The sketch:**

```cpp
// Fire & gas safety panel
#include <Wire.h>
#include <Adafruit_GFX.h>
#include <Adafruit_SSD1306.h>
Adafruit_SSD1306 oled(128, 64, &Wire, -1);
const int FLAME = 2, GAS = A0, LED = 13, BUZZER = 8;
const int GAS_LIMIT = 400;

void setup() {
  pinMode(FLAME, INPUT);
  pinMode(LED, OUTPUT);
  oled.begin(SSD1306_SWITCHCAPVCC, 0x3C);
  oled.setTextColor(SSD1306_WHITE);
}

void loop() {
  bool fire = digitalRead(FLAME) == LOW;     // LOW = flame seen
  int gas = analogRead(GAS);
  bool danger = fire || gas > GAS_LIMIT;

  oled.clearDisplay();
  oled.setTextSize(1); oled.setCursor(0, 0); oled.print("SAFETY PANEL");
  oled.setCursor(0, 16); oled.print("Flame: "); oled.print(fire ? "YES!" : "no");
  oled.setCursor(0, 28); oled.print("Gas:   "); oled.print(gas);
  oled.setTextSize(2); oled.setCursor(0, 44); oled.print(danger ? "DANGER" : "SAFE");
  oled.display();

  digitalWrite(LED, danger);
  if (danger) { tone(BUZZER, 1800, 200); delay(250); tone(BUZZER, 1200, 200); }
  delay(250);
}
```


#### JM-07 · Temperature-Controlled Smart Fan

**Unit:** Smart Home & Energy · **Phase:** Phase 1 · **Domain:** Robotics & Actuation

Air conditioners and cooling fans decide how fast to run by reading the temperature.

**What it does:** The motor (fan) speeds up as it gets hotter. The knob sets the temperature where the fan starts.

**Kit for this activity:**

| Part | How many | Issued | Note |
|---|---|---|---|
| Arduino Uno + USB cable | 1 | per group |  |
| DHT22 sensor | 1 | per group |  |
| DC hobby motor | 1 | per group | With fan blade |
| L298N motor driver | 1 | per group |  |
| Potentiometer 10k | 1 | per group |  |
| OLED 0.96 in I2C | 1 | per group |  |
| 4xAA battery pack | 1 | per group | Motor power |
| Breadboard (half size) | 1 | per group |  |
| Jumper wires M-M | 12 | per group |  |
| Jumper wires M-F | 8 | per group |  |
| Laptop | 1 | per group |  |
| LED 5 mm (assorted) | 1 | per group | Added: every Arduino class |
| Resistor 220 ohm | 1 | per group | Added: for the LED |
| Buzzer | 1 | per group | Added: every Arduino class |

**Board:** Arduino Uno

**Wiring (as Circuit Lab builds it):**

- **DHT22 temp & humidity**: SDA → pin 7
- **Potentiometer**: signal → pin A0
- **L298N motor driver**: ENA → pin 5, IN1 → pin 3, IN2 → pin 4, with: [object Object]
- **OLED 0.96" I2C**: SDA and SCL (A4 and A5 on an Uno, 21 and 22 on an ESP32), address 60

**Things to try in the simulator:**

- Raise the DHT22 temperature above the set point: the motor starts.
- Turn the knob to change the set point.
- Make the fan run at full speed above 35 °C.

**The sketch:**

```cpp
// Smart fan
#include <Wire.h>
#include <Adafruit_GFX.h>
#include <Adafruit_SSD1306.h>
#include <DHT.h>

Adafruit_SSD1306 oled(128, 64, &Wire, -1);
DHT dht(7, DHT22);
const int KNOB = A0, ENA = 5, IN1 = 3, IN2 = 4;

void setup() {
  pinMode(ENA, OUTPUT); pinMode(IN1, OUTPUT); pinMode(IN2, OUTPUT);
  digitalWrite(IN1, HIGH); digitalWrite(IN2, LOW);     // one direction
  dht.begin();
  oled.begin(SSD1306_SWITCHCAPVCC, 0x3C);
  oled.setTextColor(SSD1306_WHITE);
}

void loop() {
  float t = dht.readTemperature();
  int setPoint = map(analogRead(KNOB), 0, 1023, 20, 40);
  int speed = 0;
  if (t > setPoint) speed = constrain(map(t * 10, setPoint * 10, (setPoint + 8) * 10, 120, 255), 120, 255);
  analogWrite(ENA, speed);

  oled.clearDisplay();
  oled.setTextSize(1); oled.setCursor(0, 0); oled.print("SMART FAN");
  oled.setCursor(0, 16); oled.print("Temp: "); oled.print(t, 1); oled.print(" C");
  oled.setCursor(0, 30); oled.print("Start at: "); oled.print(setPoint); oled.print(" C");
  oled.setCursor(0, 44); oled.print("Fan: "); oled.print(speed * 100 / 255); oled.print(" %");
  oled.display();
  delay(500);
}
```


#### JM-08 · Sun-Tracking Solar Panel

**Unit:** Smart Home & Energy · **Phase:** Phase 1 · **Domain:** Power & Energy

Solar farms produce more electricity when their panels follow the sun across the sky.

**What it does:** Two light sensors compare left and right; the servo turns the solar panel towards the brighter side.

**Kit for this activity:**

| Part | How many | Issued | Note |
|---|---|---|---|
| Arduino Uno + USB cable | 1 | per group |  |
| LDR module | 2 | per group |  |
| Servo SG90 | 1 | per group |  |
| Small solar panel | 1 | per group |  |
| LED 5 mm (assorted) | 1 | per group |  |
| Digital multimeter | 1 | per group |  |
| Cardboard sheet | 1 | per group | Panel mount |
| Breadboard (half size) | 1 | per group |  |
| Jumper wires M-M | 10 | per group |  |
| Jumper wires M-F | 6 | per group |  |
| Laptop | 1 | per group |  |
| Resistor 220 ohm | 1 | per group | Added: for the LED |
| Buzzer | 1 | per group | Added: every Arduino class |

**Board:** Arduino Uno

**Wiring (as Circuit Lab builds it):**

- **Light sensor (LDR)**: label: Left eye, AO → pin A0
- **Light sensor (LDR)**: label: Right eye, AO → pin A1
- **Servo SG90**: PWM → pin 9
- **LED**: color: yellow, signal → pin 13

**Things to try in the simulator:**

- Make the left sensor brighter than the right: the servo turns left.
- Make them equal: the servo stops and the LED lights.
- Change TOLERANCE to make it less jumpy.

**The sketch:**

```cpp
// Sun-tracking solar panel
#include <Servo.h>
Servo panel;
const int LEFT = A0, RIGHT = A1, LED = 13;
const int TOLERANCE = 30;
int angle = 90;

void setup() {
  panel.attach(9);
  panel.write(angle);
  pinMode(LED, OUTPUT);
  Serial.begin(9600);
}

void loop() {
  int l = analogRead(LEFT), r = analogRead(RIGHT);   // higher = darker
  int diff = l - r;
  Serial.print("L "); Serial.print(l); Serial.print("  R "); Serial.println(r);
  if (diff > TOLERANCE && angle < 180) angle++;      // right side is brighter
  if (diff < -TOLERANCE && angle > 0) angle--;       // left side is brighter
  panel.write(angle);
  digitalWrite(LED, abs(diff) <= TOLERANCE);         // facing the sun
  delay(20);
}
```


#### JM-09 · Home Burglar Alarm with Secret Code

**Unit:** Security, Design & Robots · **Phase:** Phase 1 · **Domain:** Security & Safety

Real alarm systems can be switched on and off with a secret code so the family is not woken by their own alarm.

**What it does:** The alarm sounds when the PIR sees someone. Press the secret button 3 times quickly to switch it off.

**Kit for this activity:**

| Part | How many | Issued | Note |
|---|---|---|---|
| Arduino Uno + USB cable | 1 | per group |  |
| PIR motion sensor | 1 | per group |  |
| Push button | 3 | per group |  |
| Resistor 10k ohm | 3 | per group |  |
| Buzzer | 1 | per group |  |
| LED 5 mm (assorted) | 2 | per group | Green, red |
| Resistor 220 ohm | 2 | per group |  |
| Breadboard (half size) | 1 | per group |  |
| Jumper wires M-M | 14 | per group |  |
| Jumper wires M-F | 3 | per group |  |
| Laptop | 1 | per group |  |

**Board:** Arduino Uno

**Wiring (as Circuit Lab builds it):**

- **PIR motion sensor**: OUT → pin 2
- **Push button**: signal → pin 3
- **LED**: color: red, signal → pin 13
- **LED**: color: green, signal → pin 12
- **Buzzer**: signal → pin 8

**Things to try in the simulator:**

- Wave in front of the PIR: the alarm starts.
- Press the button 3 times within 3 seconds: alarm off (green).
- Change the secret to 4 presses.

**The sketch:**

```cpp
// Burglar alarm with a secret code
const int PIR = 2, BUTTON = 3, RED = 13, GREEN = 12, BUZZER = 8;
const int SECRET = 3;            // presses needed
bool alarm = false;
int presses = 0;
unsigned long firstPress = 0;
bool lastBtn = false;

void setup() {
  pinMode(PIR, INPUT); pinMode(BUTTON, INPUT_PULLUP);
  pinMode(RED, OUTPUT); pinMode(GREEN, OUTPUT);
  digitalWrite(GREEN, HIGH);
}

void loop() {
  if (!alarm && digitalRead(PIR) == HIGH) { alarm = true; digitalWrite(GREEN, LOW); }

  bool btn = digitalRead(BUTTON) == LOW;
  if (btn && !lastBtn) {                         // a new press
    if (presses == 0) firstPress = millis();
    presses++;
    delay(30);
  }
  lastBtn = btn;
  if (presses > 0 && millis() - firstPress > 3000) presses = 0;   // too slow
  if (presses >= SECRET) { alarm = false; presses = 0; digitalWrite(GREEN, HIGH); noTone(BUZZER); }

  if (alarm) {
    digitalWrite(RED, (millis() / 200) % 2);
    tone(BUZZER, (millis() / 300) % 2 ? 1500 : 1000);
  } else {
    digitalWrite(RED, LOW); noTone(BUZZER);
  }
}
```


#### JM-10 · 3D-Designed Name Badge & Sensor Mount

**Unit:** Security, Design & Robots · **Phase:** Phase 1 · **Domain:** Mechanical Design

Engineers design parts on computers before making them.

**Kit for this activity:**

| Part | How many | Issued | Note |
|---|---|---|---|
| Laptop | 1 | per group |  |
| 3D printer | 1 | per class |  |
| PLA filament | 1 | per class | 1 spool per term |


#### JM-11 · Line Following Robot

**Unit:** Security, Design & Robots · **Phase:** Phase 1 · **Domain:** Robotics & Actuation

Warehouse and hospital robots follow lines on the floor to deliver goods and medicine.

**What it does:** Two IR sensors look at the floor. The robot steers to keep the black line between them.

**Kit for this activity:**

| Part | How many | Issued | Note |
|---|---|---|---|
| Arduino Uno + USB cable | 1 | per group |  |
| 2WD robot chassis kit | 1 | per group |  |
| IR sensor module | 2 | per group |  |
| L298N motor driver | 1 | per group |  |
| 4xAA battery pack | 1 | per group |  |
| Screwdriver set | 1 | per group |  |
| Jumper wires M-F | 10 | per group |  |
| Jumper wires M-M | 6 | per group |  |
| Laptop | 1 | per group |  |
| LED 5 mm (assorted) | 1 | per group | Added: every Arduino class |
| Resistor 220 ohm | 1 | per group | Added: for the LED |
| Buzzer | 1 | per group | Added: every Arduino class |

**Board:** Arduino Uno

**Wiring (as Circuit Lab builds it):**

- **IR line sensor**: label: Left sensor, OUT → pin 2
- **IR line sensor**: label: Right sensor, OUT → pin 3
- **L298N motor driver**: ENA → pin 5, IN1 → pin 7, IN2 → pin 8, ENB → pin 6, IN3 → pin 9, IN4 → pin 11, with: [object Object]
- **Buzzer**: signal → pin 4

**Things to try in the simulator:**

- Both sensors on white: both wheels go forward.
- Put the left sensor over black: the robot turns left.
- Make the robot stop and beep when both see black (finish line).

**The sketch:**

```cpp
// Line following robot
const int LEFT = 2, RIGHT = 3, BUZZER = 4;
const int ENA = 5, IN1 = 7, IN2 = 8, ENB = 6, IN3 = 9, IN4 = 11;
const int SPEED = 170;

void drive(int left, int right) {           // -255 .. 255
  digitalWrite(IN1, left > 0);  digitalWrite(IN2, left < 0);  analogWrite(ENA, abs(left));
  digitalWrite(IN3, right > 0); digitalWrite(IN4, right < 0); analogWrite(ENB, abs(right));
}

void setup() {
  pinMode(LEFT, INPUT); pinMode(RIGHT, INPUT);
  int pins[] = {ENA, IN1, IN2, ENB, IN3, IN4};
  for (int i = 0; i < 6; i++) pinMode(pins[i], OUTPUT);
}

void loop() {
  bool l = digitalRead(LEFT) == HIGH;     // HIGH = black line
  bool r = digitalRead(RIGHT) == HIGH;
  if (!l && !r) drive(SPEED, SPEED);      // line between the sensors
  else if (l && !r) drive(0, SPEED);      // line on the left: turn left
  else if (!l && r) drive(SPEED, 0);      // line on the right: turn right
  else { drive(0, 0); tone(BUZZER, 1000, 200); delay(500); }   // finish line
}
```


#### JM-12 · Phone-Controlled RGB Mood Lamp

**Unit:** Security, Design & Robots · **Phase:** Phase 1 · **Domain:** IoT & Communication

Smart bulbs at home can change colour from a phone.

**What it does:** Send letters from the phone over Bluetooth to change the lamp colour.

**Kit for this activity:**

| Part | How many | Issued | Note |
|---|---|---|---|
| Arduino Uno + USB cable | 1 | per group |  |
| Bluetooth module HC-05 | 1 | per group |  |
| RGB LED | 1 | per group |  |
| Resistor 220 ohm | 3 | per group |  |
| Resistor 1k ohm | 1 | per group | HC-05 divider |
| Resistor 10k ohm | 1 | per group | HC-05 divider |
| Buzzer | 1 | per group |  |
| Android smartphone | 1 | per group |  |
| Breadboard (half size) | 1 | per group |  |
| Jumper wires M-M | 10 | per group |  |
| Jumper wires M-F | 4 | per group |  |
| Laptop | 1 | per group |  |
| LED 5 mm (assorted) | 1 | per group | Added: every Arduino class |

**Board:** Arduino Uno

**Wiring (as Circuit Lab builds it):**

- **Bluetooth HC-05**: TXD → pin 2, RXD → pin 3
- **RGB LED**: R → pin 9, G → pin 10, B → pin 11

**Things to try in the simulator:**

- Start, open the Phone tab and send R, G, B or W.
- Add a new colour: P for purple (255, 0, 255).
- Send a number 0-9 to change the brightness.

**The sketch:**

```cpp
// Bluetooth RGB mood lamp
#include <SoftwareSerial.h>
SoftwareSerial bt(2, 3);   // RX, TX
const int R = 9, G = 10, B = 11;

void colour(int r, int g, int b) { analogWrite(R, r); analogWrite(G, g); analogWrite(B, b); }

void setup() {
  bt.begin(9600);
  bt.println("Send R, G, B, W or 0 (off)");
}

void loop() {
  if (bt.available()) {
    char c = toupper(bt.read());
    if (c == 'R') colour(255, 0, 0);
    if (c == 'G') colour(0, 255, 0);
    if (c == 'B') colour(0, 0, 255);
    if (c == 'W') colour(255, 255, 255);
    if (c == '0') colour(0, 0, 0);
    if (c > ' ') { bt.print("Lamp: "); bt.println(c); }
  }
}
```


#### JM-13 · Step Counter Fitness Tracker

**Unit:** Health, Web, Games & AI · **Phase:** Phase 1 · **Domain:** Sensors & Environment

Smartwatches count our steps using a tiny motion sensor.

**What it does:** The MPU6050 feels each step as a bump in acceleration. The OLED counts steps; the button resets.

**Kit for this activity:**

| Part | How many | Issued | Note |
|---|---|---|---|
| Arduino Uno + USB cable | 1 | per group |  |
| MPU6050 IMU | 1 | per group |  |
| OLED 0.96 in I2C | 1 | per group |  |
| Push button | 1 | per group |  |
| Resistor 10k ohm | 1 | per group |  |
| Breadboard (half size) | 1 | per group |  |
| Jumper wires M-M | 10 | per group |  |
| Jumper wires M-F | 6 | per group |  |
| Laptop | 1 | per group |  |
| LED 5 mm (assorted) | 1 | per group | Added: every Arduino class |
| Resistor 220 ohm | 1 | per group | Added: for the LED |
| Buzzer | 1 | per group | Added: every Arduino class |

**Board:** Arduino Uno

**Wiring (as Circuit Lab builds it):**

- **MPU6050 motion**: SDA and SCL (A4 and A5 on an Uno, 21 and 22 on an ESP32), address 104
- **OLED 0.96" I2C**: SDA and SCL (A4 and A5 on an Uno, 21 and 22 on an ESP32), address 60
- **Push button**: signal → pin 2
- **LED**: color: green, signal → pin 13
- **Buzzer**: signal → pin 8

**Things to try in the simulator:**

- Click the MPU6050 and drag Accel Z up past 13 and back down: one step.
- Press the button to reset.
- Make it celebrate (beep) every 10 steps.

**The sketch:**

```cpp
// Step counter
#include <Adafruit_MPU6050.h>
#include <Wire.h>
#include <Adafruit_GFX.h>
#include <Adafruit_SSD1306.h>
Adafruit_SSD1306 oled(128, 64, &Wire, -1);
Adafruit_MPU6050 mpu;
const int BUTTON = 2, LED = 13, BUZZER = 8;
int steps = 0;
bool up = false;

void setup() {
  pinMode(BUTTON, INPUT_PULLUP); pinMode(LED, OUTPUT);
  oled.begin(SSD1306_SWITCHCAPVCC, 0x3C);
  oled.setTextColor(SSD1306_WHITE);
  if (!mpu.begin()) { oled.print("No MPU6050"); oled.display(); while (1); }
}

void loop() {
  sensors_event_t a, g, t;
  mpu.getEvent(&a, &g, &t);
  float mag = sqrt(a.acceleration.x * a.acceleration.x + a.acceleration.y * a.acceleration.y + a.acceleration.z * a.acceleration.z);
  if (mag > 12.5 && !up) { up = true; steps++; digitalWrite(LED, HIGH); if (steps % 10 == 0) tone(BUZZER, 1319, 200); }
  if (mag < 10.5 && up)  { up = false; digitalWrite(LED, LOW); }
  if (digitalRead(BUTTON) == LOW) steps = 0;

  oled.clearDisplay();
  oled.setTextSize(1); oled.setCursor(0, 0); oled.print("STEPS");
  oled.setTextSize(3); oled.setCursor(0, 20); oled.print(steps);
  oled.display();
  delay(50);
}
```


#### JM-14 · Weather Report Webpage

**Unit:** Health, Web, Games & AI · **Phase:** Phase 1 · **Domain:** App, Web & Game Development

Every website is written in languages called HTML and CSS.

**Kit for this activity:**

| Part | How many | Issued | Note |
|---|---|---|---|
| Laptop | 1 | per group |  |


#### JM-15 · Pong Game with a Knob Controller

**Unit:** Health, Web, Games & AI · **Phase:** Phase 1 · **Domain:** App, Web & Game Development

Pong was one of the first video games, controlled by a simple knob.

**What it does:** The knob is a game paddle. The Arduino sends its position to the computer game over Serial.

**Kit for this activity:**

| Part | How many | Issued | Note |
|---|---|---|---|
| Arduino Uno + USB cable | 1 | per group |  |
| Potentiometer 10k | 1 | per group |  |
| Push button | 1 | per group |  |
| Resistor 10k ohm | 1 | per group |  |
| Breadboard (half size) | 1 | per group |  |
| Jumper wires M-M | 6 | per group |  |
| Laptop | 1 | per group |  |
| LED 5 mm (assorted) | 1 | per group | Added: every Arduino class |
| Resistor 220 ohm | 1 | per group | Added: for the LED |
| Buzzer | 1 | per group | Added: every Arduino class |

**Board:** Arduino Uno

**Wiring (as Circuit Lab builds it):**

- **Potentiometer**: signal → pin A0
- **Push button**: signal → pin 2
- **LED**: color: green, signal → pin 13
- **Buzzer**: signal → pin 8

**Things to try in the simulator:**

- Open the Serial tab, then the Graph: turn the knob and watch the paddle line.
- Press the button: it sends SERVE.
- Send H from the Serial box: the board beeps (a hit).

**The sketch:**

```cpp
// Pong controller: knob = paddle
const int KNOB = A0, BUTTON = 2, LED = 13, BUZZER = 8;

void setup() {
  pinMode(BUTTON, INPUT_PULLUP);
  pinMode(LED, OUTPUT);
  Serial.begin(9600);
}

void loop() {
  int paddle = map(analogRead(KNOB), 0, 1023, 0, 100);   // 0 = top, 100 = bottom
  Serial.println(paddle);
  if (digitalRead(BUTTON) == LOW) Serial.println("SERVE");
  if (Serial.available()) {                 // messages from the game
    char c = Serial.read();
    if (c == 'H') { tone(BUZZER, 880, 60); digitalWrite(LED, HIGH); }
    if (c == 'M') { tone(BUZZER, 200, 300); digitalWrite(LED, LOW); }
  }
  delay(30);
}
```


#### JM-16 · AI Recycling Sorter

**Unit:** Health, Web, Games & AI · **Phase:** Phase 1 · **Domain:** AI & Data

Recycling plants are starting to use AI cameras to sort plastic, paper and metal.

**Kit for this activity:**

| Part | How many | Issued | Note |
|---|---|---|---|
| Laptop | 1 | per group |  |
| Webcam | 1 | per group | Or built-in camera |
| Printed templates | 1 | per group | Results sheet |


#### JM-17 · Python Turtle Art: Shapes and Patterns

**Unit:** Code Studio · **Phase:** Phase 2 · **Domain:** Programming & Logic

Artists and engineers use code to draw precise patterns.

**Kit for this activity:**

| Part | How many | Issued | Note |
|---|---|---|---|
| Laptop | 1 | per group |  |


#### JM-18 · MakeCode Arcade: My First Platform Game

**Unit:** Code Studio · **Phase:** Phase 2 · **Domain:** App, Web & Game Development

Many famous games are platform games where a character jumps between blocks.

**Kit for this activity:**

| Part | How many | Issued | Note |
|---|---|---|---|
| Laptop | 1 | per group |  |


#### JM-19 · Binary Bracelets & Secret Codes

**Unit:** Code Studio · **Phase:** Phase 2 · **Domain:** IoT & Communication

Computers store every letter as 0s and 1s.

**Kit for this activity:**

| Part | How many | Issued | Note |
|---|---|---|---|
| Printed templates | 1 | per group |  |
| Markers | 1 | per group | Or beads |


#### JM-20 · Joystick Maze Game

**Unit:** Code Studio · **Phase:** Phase 2 · **Domain:** App, Web & Game Development

Game controllers turn your hand movements into numbers.

**What it does:** The joystick sends UP, DOWN, LEFT and RIGHT to a maze game on the computer. The button buzzes.

**Kit for this activity:**

| Part | How many | Issued | Note |
|---|---|---|---|
| Arduino Uno + USB cable | 1 | per group |  |
| Joystick module | 1 | per group |  |
| Jumper wires M-F | 5 | per group |  |
| Laptop | 1 | per group |  |
| LED 5 mm (assorted) | 1 | per group | Added: every Arduino class |
| Resistor 220 ohm | 1 | per group | Added: for the LED |
| Buzzer | 1 | per group | Added: every Arduino class |

**Board:** Arduino Uno

**Wiring (as Circuit Lab builds it):**

- **Joystick**: HORZ → pin A0, VERT → pin A1, SEL → pin 2
- **LED**: color: blue, signal → pin 13
- **Buzzer**: signal → pin 8

**Things to try in the simulator:**

- Drag the joystick knob while running and watch Serial.
- Click the joystick button: it beeps.
- Make the LED light whenever the stick is pushed.

**The sketch:**

```cpp
// Joystick maze controller
const int VX = A0, VY = A1, SW = 2, LED = 13, BUZZER = 8;

void setup() {
  pinMode(SW, INPUT_PULLUP);
  pinMode(LED, OUTPUT);
  Serial.begin(9600);
}

void loop() {
  int x = analogRead(VX), y = analogRead(VY);
  String move = "";
  if (x > 700) move = "LEFT";      // stick left  = high number
  if (x < 300) move = "RIGHT";
  if (y > 700) move = "UP";        // stick up    = high number
  if (y < 300) move = "DOWN";
  if (move != "") Serial.println(move);
  digitalWrite(LED, move != "");
  if (digitalRead(SW) == LOW) { Serial.println("FIRE"); tone(BUZZER, 1000, 80); }
  delay(150);
}
```


#### JM-21 · NeoPixel Light Show to the Beat

**Unit:** Light, Sound & Music Tech · **Phase:** Phase 2 · **Domain:** Electronics & Circuits

Concert lights flash in time with the music.

**What it does:** A sound sensor listens; the LED strip lights up like a music level meter.

**Kit for this activity:**

| Part | How many | Issued | Note |
|---|---|---|---|
| Arduino Uno + USB cable | 1 | per group |  |
| WS2812B LED strip (1 m, 30 LEDs) | 1 | per group |  |
| Sound sensor KY-037 | 1 | per group |  |
| Capacitor 100 uF | 1 | per group | Strip power |
| Resistor 220 ohm | 1 | per group | Data line |
| Breadboard (half size) | 1 | per group |  |
| Jumper wires M-M | 8 | per group |  |
| Laptop | 1 | per group |  |
| LED 5 mm (assorted) | 1 | per group | Added: every Arduino class |
| Buzzer | 1 | per group | Added: every Arduino class |

**Board:** Arduino Uno

**Wiring (as Circuit Lab builds it):**

- **NeoPixel LED strip**: attrs: [object Object], DIN → pin 6
- **Sound sensor KY-037**: AO → pin A0
- **LED**: color: white, signal → pin 13

**Things to try in the simulator:**

- Click the sound sensor and raise the sound level.
- Change the colours from green-to-red into blue-to-purple.
- Make the strip flash white on a very loud sound.

**The sketch:**

```cpp
// Sound-reactive LED strip
#include <Adafruit_NeoPixel.h>
const int N = 16;
Adafruit_NeoPixel strip(N, 6, NEO_GRB + NEO_KHZ800);
const int MIC = A0, LED = 13;

void setup() {
  strip.begin();
  strip.setBrightness(70);
  pinMode(LED, OUTPUT);
}

void loop() {
  int level = analogRead(MIC);                     // 0 .. 1023
  int lit = constrain(map(level, 30, 700, 0, N), 0, N);
  for (int i = 0; i < N; i++) {
    if (i < lit) strip.setPixelColor(i, strip.Color(i * 255 / N, 255 - i * 255 / N, 0));   // green to red
    else strip.setPixelColor(i, 0);
  }
  strip.show();
  digitalWrite(LED, lit > N * 3 / 4);
  delay(40);
}
```


#### JM-22 · 8x8 LED Matrix Emoji Display

**Unit:** Light, Sound & Music Tech · **Phase:** Phase 2 · **Domain:** Electronics & Circuits

Scoreboards and bus signs are made of grids of LEDs.

**What it does:** Show emoji on an 8x8 LED matrix. A button changes the face.

**Kit for this activity:**

| Part | How many | Issued | Note |
|---|---|---|---|
| Arduino Uno + USB cable | 1 | per group |  |
| MAX7219 8x8 LED matrix | 1 | per group |  |
| Printed templates | 1 | per group |  |
| Jumper wires M-F | 5 | per group |  |
| Laptop | 1 | per group |  |
| LED 5 mm (assorted) | 1 | per group | Added: every Arduino class |
| Resistor 220 ohm | 1 | per group | Added: for the LED |
| Buzzer | 1 | per group | Added: every Arduino class |

**Board:** Arduino Uno

**Wiring (as Circuit Lab builds it):**

- **8×8 LED matrix MAX7219**: DIN → pin 12, CS → pin 10, CLK → pin 11
- **Push button**: signal → pin 2
- **Buzzer**: signal → pin 8

**Things to try in the simulator:**

- Press the button to switch between happy and sad.
- Draw your own emoji: change the 1s and 0s.
- Add a third face (surprised).

**The sketch:**

```cpp
// Emoji on an 8x8 LED matrix
#include <LedControl.h>
LedControl lc(12, 11, 10, 1);   // DIN, CLK, CS
const int BUTTON = 2, BUZZER = 8;
byte happy[8] = {B00111100, B01000010, B10100101, B10000001, B10100101, B10011001, B01000010, B00111100};
byte sad[8]   = {B00111100, B01000010, B10100101, B10000001, B10011001, B10100101, B01000010, B00111100};
int face = 0;

void show(byte* img) { for (int r = 0; r < 8; r++) lc.setRow(0, r, img[r]); }

void setup() {
  pinMode(BUTTON, INPUT_PULLUP);
  lc.shutdown(0, false);
  lc.setIntensity(0, 6);
  show(happy);
}

void loop() {
  if (digitalRead(BUTTON) == LOW) {
    face = 1 - face;
    show(face ? sad : happy);
    tone(BUZZER, face ? 300 : 900, 120);
    delay(300);
  }
}
```


#### JM-23 · Ultrasonic Theremin: Music in the Air

**Unit:** Light, Sound & Music Tech · **Phase:** Phase 2 · **Domain:** Sensors & Environment

The theremin is a musical instrument you play without touching it.

**What it does:** Hold the button and move your hand: closer = higher note, like a theremin.

**Kit for this activity:**

| Part | How many | Issued | Note |
|---|---|---|---|
| Arduino Uno + USB cable | 1 | per group |  |
| Ultrasonic sensor HC-SR04 | 1 | per group |  |
| Passive buzzer | 1 | per group |  |
| Push button | 1 | per group |  |
| Resistor 10k ohm | 1 | per group |  |
| Breadboard (half size) | 1 | per group |  |
| Jumper wires M-M | 8 | per group |  |
| Laptop | 1 | per group |  |
| LED 5 mm (assorted) | 1 | per group | Added: every Arduino class |
| Resistor 220 ohm | 1 | per group | Added: for the LED |
| Buzzer | 1 | per group | Added: every Arduino class |

**Board:** Arduino Uno

**Wiring (as Circuit Lab builds it):**

- **Ultrasonic HC-SR04**: TRIG → pin 9, ECHO → pin 10
- **Push button**: signal → pin 2
- **LED**: color: red, signal → pin 13
- **Buzzer**: signal → pin 8

**Things to try in the simulator:**

- Hold the button and slide the distance up and down.
- Snap notes to a scale so it sounds musical.
- Make the LED brightness follow the pitch.

**The sketch:**

```cpp
// Ultrasonic theremin
const int TRIG = 9, ECHO = 10, BUTTON = 2, LED = 13, BUZZER = 8;

long distanceCM() {
  digitalWrite(TRIG, LOW); delayMicroseconds(2);
  digitalWrite(TRIG, HIGH); delayMicroseconds(10); digitalWrite(TRIG, LOW);
  return pulseIn(ECHO, HIGH, 30000) / 58;
}

void setup() {
  pinMode(TRIG, OUTPUT); pinMode(ECHO, INPUT);
  pinMode(BUTTON, INPUT_PULLUP); pinMode(LED, OUTPUT);
}

void loop() {
  long cm = constrain(distanceCM(), 3, 60);
  if (digitalRead(BUTTON) == LOW) {
    int note = map(cm, 3, 60, 1500, 200);     // close = high
    tone(BUZZER, note);
    digitalWrite(LED, HIGH);
  } else {
    noTone(BUZZER);
    digitalWrite(LED, LOW);
  }
  delay(40);
}
```


#### JM-24 · Processing: Interactive Drawing Machine

**Unit:** Light, Sound & Music Tech · **Phase:** Phase 2 · **Domain:** App, Web & Game Development

Processing is a free coding language made for artists and designers.

**Kit for this activity:**

| Part | How many | Issued | Note |
|---|---|---|---|
| Laptop | 1 | per group |  |


#### JM-25 · Smart Traffic Junction with Car Counter

**Unit:** Smart City & Mechanisms · **Phase:** Phase 2 · **Domain:** Sensors & Environment

Smart cities change traffic lights depending on how many cars are waiting.

**What it does:** An IR sensor counts passing cars. When 5 cars wait, the light turns green sooner. The OLED shows the count.

**Kit for this activity:**

| Part | How many | Issued | Note |
|---|---|---|---|
| Arduino Uno + USB cable | 1 | per group |  |
| IR sensor module | 2 | per group |  |
| LED 5 mm (assorted) | 6 | per group | 2 sets of R/Y/G |
| Resistor 220 ohm | 6 | per group |  |
| OLED 0.96 in I2C | 1 | per group |  |
| Cardboard sheet | 1 | per group | Road model |
| Breadboard (half size) | 1 | per group |  |
| Jumper wires M-M | 16 | per group |  |
| Jumper wires M-F | 6 | per group |  |
| Laptop | 1 | per group |  |
| Buzzer | 1 | per group | Added: every Arduino class |

**Board:** Arduino Uno

**Wiring (as Circuit Lab builds it):**

- **IR obstacle sensor**: OUT → pin 2
- **LED**: color: red, signal → pin 13
- **LED**: color: yellow, signal → pin 12
- **LED**: color: green, signal → pin 11
- **Buzzer**: signal → pin 8
- **OLED 0.96" I2C**: SDA and SCL (A4 and A5 on an Uno, 21 and 22 on an ESP32), address 60

**Things to try in the simulator:**

- Turn 'Object in front' on and off to count cars.
- Count 5 cars: the light goes green early.
- Show the total cars today on the OLED.

**The sketch:**

```cpp
// Smart traffic junction
#include <Wire.h>
#include <Adafruit_GFX.h>
#include <Adafruit_SSD1306.h>
Adafruit_SSD1306 oled(128, 64, &Wire, -1);
const int CAR = 2, RED = 13, YELLOW = 12, GREEN = 11, BUZZER = 8;
int waiting = 0, total = 0;
bool lastCar = false;
unsigned long redSince = 0;

void showCount(const char* light) {
  oled.clearDisplay();
  oled.setTextSize(1); oled.setCursor(0, 0); oled.print("JUNCTION  "); oled.print(light);
  oled.setTextSize(2); oled.setCursor(0, 18); oled.print("Wait: "); oled.print(waiting);
  oled.setTextSize(1); oled.setCursor(0, 48); oled.print("Cars today: "); oled.print(total);
  oled.display();
}

void setup() {
  pinMode(CAR, INPUT);
  pinMode(RED, OUTPUT); pinMode(YELLOW, OUTPUT); pinMode(GREEN, OUTPUT);
  oled.begin(SSD1306_SWITCHCAPVCC, 0x3C);
  oled.setTextColor(SSD1306_WHITE);
  digitalWrite(RED, HIGH); redSince = millis();
}

void loop() {
  bool car = digitalRead(CAR) == LOW;          // LOW = car in front
  if (car && !lastCar) { waiting++; total++; tone(BUZZER, 1500, 40); }
  lastCar = car;
  showCount("RED");

  if (waiting >= 5 || millis() - redSince > 10000) {   // time for green
    digitalWrite(RED, LOW); digitalWrite(GREEN, HIGH); showCount("GREEN");
    delay(3000);
    waiting = 0;
    digitalWrite(GREEN, LOW); digitalWrite(YELLOW, HIGH); delay(1000);
    digitalWrite(YELLOW, LOW); digitalWrite(RED, HIGH); redSince = millis();
  }
  delay(50);
}
```


#### JM-26 · Smart Kitchen Scale

**Unit:** Smart City & Mechanisms · **Phase:** Phase 2 · **Domain:** Sensors & Environment

Bakers, shops and post offices weigh things precisely.

**What it does:** A load cell and HX711 weigh things in grams. The button sets zero (tare); the LED warns if it is too heavy.

**Kit for this activity:**

| Part | How many | Issued | Note |
|---|---|---|---|
| Arduino Uno + USB cable | 1 | per group |  |
| Load cell 5 kg + HX711 | 1 | per group |  |
| OLED 0.96 in I2C | 1 | per group |  |
| Push button | 1 | per group |  |
| Resistor 10k ohm | 1 | per group |  |
| Cardboard sheet | 1 | per group | Scale platform |
| Breadboard (half size) | 1 | per group |  |
| Jumper wires M-M | 10 | per group |  |
| Jumper wires M-F | 6 | per group |  |
| Laptop | 1 | per group |  |
| LED 5 mm (assorted) | 1 | per group | Added: every Arduino class |
| Resistor 220 ohm | 1 | per group | Added: for the LED |
| Buzzer | 1 | per group | Added: every Arduino class |

**Board:** Arduino Uno

**Wiring (as Circuit Lab builds it):**

- **Load cell + HX711**: DT → pin 3, SCK → pin 4
- **OLED 0.96" I2C**: SDA and SCL (A4 and A5 on an Uno, 21 and 22 on an ESP32), address 60
- **Push button**: signal → pin 2
- **LED**: color: red, signal → pin 13
- **Buzzer**: signal → pin 8

**Things to try in the simulator:**

- Click the load cell and put 250 g on it.
- Press the button (tare), then add 100 g more: the scale shows 100 g.
- Change the overload limit to 2 kg.

**The sketch:**

```cpp
// Smart kitchen scale
#include <HX711.h>
#include <Wire.h>
#include <Adafruit_GFX.h>
#include <Adafruit_SSD1306.h>
Adafruit_SSD1306 oled(128, 64, &Wire, -1);
HX711 scale;
const int TARE = 2, LED = 13, BUZZER = 8;
const float LIMIT = 4000;          // grams

void setup() {
  pinMode(TARE, INPUT_PULLUP); pinMode(LED, OUTPUT);
  oled.begin(SSD1306_SWITCHCAPVCC, 0x3C);
  oled.setTextColor(SSD1306_WHITE);
  scale.begin(3, 4);
  scale.set_scale(420.0);          // calibration factor
  scale.tare();
}

void loop() {
  if (digitalRead(TARE) == LOW) { scale.tare(); tone(BUZZER, 1000, 80); }
  float g = scale.get_units(3);
  if (abs(g) < 1) g = 0;
  oled.clearDisplay();
  oled.setTextSize(1); oled.setCursor(0, 0); oled.print("KITCHEN SCALE");
  oled.setTextSize(3); oled.setCursor(0, 22); oled.print(g, 0); oled.setTextSize(2); oled.print(" g");
  oled.display();
  bool heavy = g > LIMIT;
  digitalWrite(LED, heavy);
  if (heavy) tone(BUZZER, 2000, 100);
  delay(200);
}
```


#### JM-27 · Arcade Claw Machine

**Unit:** Smart City & Mechanisms · **Phase:** Phase 2 · **Domain:** Robotics & Actuation

Claw machines are robots controlled by a joystick.

**What it does:** The joystick swings the arm left and right; the button opens and closes the claw.

**Kit for this activity:**

| Part | How many | Issued | Note |
|---|---|---|---|
| Arduino Uno + USB cable | 1 | per group |  |
| Servo SG90 | 2 | per group |  |
| Joystick module | 1 | per group |  |
| Ice cream sticks | 10 | per group |  |
| Cardboard sheet | 1 | per group |  |
| Glue gun + glue sticks | 1 | per class | Teacher help |
| Breadboard (half size) | 1 | per group |  |
| Jumper wires M-M | 10 | per group |  |
| Jumper wires M-F | 5 | per group |  |
| Laptop | 1 | per group |  |
| LED 5 mm (assorted) | 1 | per group | Added: every Arduino class |
| Resistor 220 ohm | 1 | per group | Added: for the LED |
| Buzzer | 1 | per group | Added: every Arduino class |

**Board:** Arduino Uno

**Wiring (as Circuit Lab builds it):**

- **Joystick**: HORZ → pin A0, VERT → pin A1, SEL → pin 2
- **Servo SG90**: label: Arm servo, PWM → pin 9
- **Servo SG90**: label: Claw servo, PWM → pin 10
- **LED**: color: green, signal → pin 13
- **Buzzer**: signal → pin 8

**Things to try in the simulator:**

- Drag the joystick left and right: the arm servo follows.
- Click the joystick button: the claw opens or closes.
- Add a 30-second game timer with a buzzer at the end.

**The sketch:**

```cpp
// Arcade claw machine
#include <Servo.h>
Servo arm, claw;
const int VX = A0, SW = 2, LED = 13, BUZZER = 8;
int angle = 90;
bool open = true;

void setup() {
  arm.attach(9); claw.attach(10);
  pinMode(SW, INPUT_PULLUP); pinMode(LED, OUTPUT);
  arm.write(angle); claw.write(80);
}

void loop() {
  int x = analogRead(VX);
  if (x > 650 && angle < 180) angle += 2;   // stick left
  if (x < 350 && angle > 0) angle -= 2;     // stick right
  arm.write(angle);

  if (digitalRead(SW) == LOW) {             // grab / drop
    open = !open;
    claw.write(open ? 80 : 10);
    digitalWrite(LED, !open);
    tone(BUZZER, open ? 600 : 900, 120);
    delay(300);
  }
  delay(20);
}
```


#### JM-28 · Wind Turbine Power Lab

**Unit:** Smart City & Mechanisms · **Phase:** Phase 2 · **Domain:** Power & Energy

Wind farms turn moving air into electricity.

**Kit for this activity:**

| Part | How many | Issued | Note |
|---|---|---|---|
| DC hobby motor | 1 | per group |  |
| Digital multimeter | 1 | per group |  |
| Card / chart paper | 2 | per group |  |
| Wooden skewers | 2 | per group |  |
| 5 V DC fan | 1 | per class | Or a desk fan as the wind |
| Alligator clip leads | 2 | per group |  |

**Not in the simulator:** Wind turbine generator: see Faraday's Law and Faraday's Electromagnetic Lab in Virtual labs.


#### JM-29 · Python Number Guessing Game

**Unit:** Code, Data & AI · **Phase:** Phase 2 · **Domain:** Programming & Logic

Every game needs logic: was the guess too high, too low or just right?

**Kit for this activity:**

| Part | How many | Issued | Note |
|---|---|---|---|
| Laptop | 1 | per group |  |


#### JM-30 · Data Detectives: Class Survey Charts

**Unit:** Code, Data & AI · **Phase:** Phase 2 · **Domain:** AI & Data

Scientists, doctors and businesses make decisions from data.

**Kit for this activity:**

| Part | How many | Issued | Note |
|---|---|---|---|
| Laptop | 1 | per group |  |
| Printed templates | 1 | per group |  |


#### JM-31 · AI Emotion Mirror

**Unit:** Code, Data & AI · **Phase:** Phase 2 · **Domain:** AI & Data

Some apps can recognise faces and expressions.

**Kit for this activity:**

| Part | How many | Issued | Note |
|---|---|---|---|
| Laptop | 1 | per group |  |
| Webcam | 1 | per group | Or built-in camera |


#### JM-32 · Cyber Safety Escape Room

**Unit:** Code, Data & AI · **Phase:** Phase 2 · **Domain:** Security & Safety

Online criminals try to trick people into sharing passwords and personal information.

**What it does:** Type the 4-digit code on the keypad. Right code = green light and a happy tune; wrong code = low buzz.

**Kit for this activity:**

| Part | How many | Issued | Note |
|---|---|---|---|
| Printed templates | 1 | per group |  |
| 4x4 matrix keypad | 1 | per class | Optional final lock prop |

**Board:** Arduino Uno

**Wiring (as Circuit Lab builds it):**

- **Keypad 4×4**: R1 → pin 9, R2 → pin 8, R3 → pin 7, R4 → pin 6, C1 → pin 5, C2 → pin 4, C3 → pin 3, C4 → pin 2
- **LED**: color: green, signal → pin 12
- **Buzzer**: signal → pin 11

**Things to try in the simulator:**

- Click the keypad keys: 4 2 3 1.
- Try a wrong code: low buzz.
- Change the secret to your own 4 digits.

**The sketch:**

```cpp
// Escape room lock
#include <Keypad.h>
char keys[4][4] = {{'1','2','3','A'},{'4','5','6','B'},
                   {'7','8','9','C'},{'*','0','#','D'}};
byte rowPins[4] = {9, 8, 7, 6}, colPins[4] = {5, 4, 3, 2};
Keypad pad = Keypad(makeKeymap(keys), rowPins, colPins, 4, 4);
String secret = "4231", typed = "";   // teacher sets this

void setup() {
  pinMode(12, OUTPUT);
  Serial.begin(9600);
}

void loop() {
  char k = pad.getKey();
  if (k) {
    typed += k;  tone(11, 1500, 40);
    Serial.println(typed);
    if (typed.length() == 4) {
      if (typed == secret) { digitalWrite(12, HIGH); tone(11, 880, 600); Serial.println("OPEN!"); }
      else                 { tone(11, 200, 600); Serial.println("WRONG"); }
      typed = "";
    }
  }
}
```


### YI · Young Innovators (ages 12-14)

36 activities. Foundation: 4 · Phase 1: 16 · Phase 2: 16

#### F-00 (YI) · Welcome to Robotics (Distance Alarm)

**Unit:** Foundation & intro · **Phase:** Foundation · **Domain:** Foundation

**What it does:** Like a car parking sensor: when something comes closer than 20 cm the LED lights and the buzzer sounds.

**Kit for this activity:**

| Part | How many | Issued | Note |
|---|---|---|---|
| Arduino Uno + USB cable | 1 | per group |  |
| Ultrasonic sensor HC-SR04 | 1 | per group |  |
| LED 5 mm (assorted) | 1 | per group | Red |
| Resistor 220 ohm | 1 | per group |  |
| Buzzer | 1 | per group |  |
| Breadboard (half size) | 1 | per group |  |
| Jumper wires M-M | 6 | per group |  |
| Laptop | 1 | per group |  |

**Board:** Arduino Uno

**Wiring (as Circuit Lab builds it):**

- **Ultrasonic HC-SR04**: TRIG → pin 9, ECHO → pin 10
- **LED**: color: red, signal → pin 13
- **Buzzer**: signal → pin 8

**Things to try in the simulator:**

- Click the ultrasonic sensor and move the distance slider below 20 cm.
- Open the Serial tab to see the distance.
- Change ALARM_CM to 40 and test again.

**The sketch:**

```cpp
// Distance Alarm: like a car parking sensor
const int TRIG = 9, ECHO = 10, LED = 13, BUZZ = 8;
int ALARM_CM = 20;                    // <-- change me!

void setup() {
  pinMode(TRIG, OUTPUT);  pinMode(ECHO, INPUT);
  pinMode(LED, OUTPUT);   pinMode(BUZZ, OUTPUT);
  Serial.begin(9600);
}

void loop() {
  digitalWrite(TRIG, HIGH); delayMicroseconds(10);
  digitalWrite(TRIG, LOW);                 // SENSE: send a sound pulse
  long cm = pulseIn(ECHO, HIGH, 30000) / 58;
  Serial.println(cm);                      // see the distance

  if (cm > 0 && cm < ALARM_CM) {           // THINK: too close?
    digitalWrite(LED, HIGH);               // ACT: light on
    digitalWrite(BUZZ, HIGH);              //      and beep
  } else {
    digitalWrite(LED, LOW);
    digitalWrite(BUZZ, LOW);
  }
  delay(100);
}
```


#### F-01 (YI) · Arduino Uno Basics

**Unit:** Foundation & intro · **Phase:** Foundation · **Domain:** Foundation

**What it does:** Output, input and analog in one circuit: the knob sets the blink speed and the button beeps.

**Kit for this activity:**

| Part | How many | Issued | Note |
|---|---|---|---|
| Arduino Uno + USB cable | 1 | per group |  |
| LED 5 mm (assorted) | 2 | per group |  |
| Resistor 220 ohm | 2 | per group |  |
| Push button | 1 | per group | INPUT_PULLUP demo |
| Potentiometer 10k | 1 | per group | Analog input demo |
| Breadboard (half size) | 1 | per group |  |
| Jumper wires M-M | 8 | per group |  |
| Laptop | 1 | per group |  |
| Buzzer | 1 | per group | Added: every Arduino class |

**Board:** Arduino Uno

**Wiring (as Circuit Lab builds it):**

- **LED**: color: green, signal → pin 13
- **Push button**: signal → pin 2
- **Potentiometer**: signal → pin A0
- **Buzzer**: signal → pin 8

**Things to try in the simulator:**

- Turn the knob while it runs: the LED blinks faster or slower.
- Hold the button: the buzzer beeps.
- Open Serial to see the blink time in milliseconds.

**The sketch:**

```cpp
// Arduino Uno basics: OUTPUT, INPUT and ANALOG
const int LED = 13, BUTTON = 2, KNOB = A0, BUZZER = 8;

void setup() {
  pinMode(LED, OUTPUT);              // an output
  pinMode(BUTTON, INPUT_PULLUP);     // an input (pressed = LOW)
  Serial.begin(9600);
}

void loop() {
  int knob = analogRead(KNOB);                 // 0 .. 1023
  int wait = map(knob, 0, 1023, 100, 1000);    // 0.1 .. 1 second
  Serial.print("Blink time: "); Serial.println(wait);

  digitalWrite(LED, HIGH); delay(wait);
  digitalWrite(LED, LOW);  delay(wait);

  if (digitalRead(BUTTON) == LOW) tone(BUZZER, 880, 150);
}
```


#### F-02 (YI) · ESP32 Basics

**Unit:** Foundation & intro · **Phase:** Foundation · **Domain:** Foundation

**What it does:** An ESP32 joins Wi-Fi, reads a knob and serves a web page where a phone switches the LED.

**Kit for this activity:**

| Part | How many | Issued | Note |
|---|---|---|---|
| ESP32 Dev Board + USB cable | 1 | per group | Data cable, not charge-only |
| LED 5 mm (assorted) | 1 | per group |  |
| Resistor 220 ohm | 1 | per group |  |
| Potentiometer 10k | 1 | per group | ADC demo |
| Breadboard (half size) | 2 | per group | ESP32 is wide: bridge 2 boards |
| Jumper wires M-M | 6 | per group |  |
| Jumper wires M-F | 4 | per group | Touch-pin demo |
| Laptop | 1 | per group |  |
| Android smartphone | 1 | per class | Wi-Fi / Bluetooth demo |

**Board:** ESP32 DevKit

**Wiring (as Circuit Lab builds it):**

- **LED**: color: blue, signal → pin 13
- **Potentiometer**: signal → pin 34

**Things to try in the simulator:**

- Start, then open the Phone tab: tap ON and OFF.
- Turn the knob and press Refresh on the page: the number changes (0 to 4095 on an ESP32).
- Change the page title to your own name.

**The sketch:**

```cpp
// ESP32 basics: Wi-Fi + a tiny web page
#include <WiFi.h>
#include <WebServer.h>

const int LED = 13, KNOB = 34;     // GPIO numbers
WebServer server(80);

void page() {
  String h = "<html><head><meta name=viewport content='width=device-width'>"
             "<style>body{font-family:sans-serif;text-align:center}a{display:inline-block;margin:8px;padding:12px 22px;border-radius:12px;background:#2E6BE6;color:#fff;text-decoration:none}</style></head><body>"
             "<h2>My ESP32</h2><p>Knob: <b>" + String(analogRead(KNOB)) + "</b></p>"
             "<p>LED is " + String(digitalRead(LED) ? "ON" : "OFF") + "</p>"
             "<a href='/on'>ON</a><a href='/off'>OFF</a><a href='/'>Refresh</a></body></html>";
  server.send(200, "text/html", h);
}

void setup() {
  pinMode(LED, OUTPUT);
  Serial.begin(115200);
  WiFi.begin("School-Lab", "password");
  while (WiFi.status() != WL_CONNECTED) { delay(300); Serial.print("."); }
  Serial.print("\nMy address: "); Serial.println(WiFi.localIP());
  server.on("/", page);
  server.on("/on", [] { digitalWrite(LED, HIGH); page(); });
  server.on("/off", [] { digitalWrite(LED, LOW); page(); });
  server.begin();
}

void loop() {
  server.handleClient();
}
```


#### F-03 (YI) · 3D Modelling and Printing

**Unit:** Foundation & intro · **Phase:** Foundation · **Domain:** Foundation

**Kit for this activity:**

| Part | How many | Issued | Note |
|---|---|---|---|
| Laptop | 1 | per group | Tinkercad in the browser |
| 3D printer | 1 | per class |  |
| PLA filament | 1 | per class | 1 spool |
| Screwdriver set | 1 | per class | Scraper / print removal |


#### YI-01 · 555 Timer Alarm Siren Circuit

**Unit:** Electronics & Mechanisms · **Phase:** Phase 1 · **Domain:** Electronics & Circuits

Before microcontrollers, engineers built timers and sirens using a small chip called the 555 timer, still found in millions of devices today.

**Kit for this activity:**

| Part | How many | Issued | Note |
|---|---|---|---|
| 555 timer IC | 1 | per group |  |
| Capacitor 10 uF | 1 | per group |  |
| Capacitor 10 nF | 1 | per group |  |
| Capacitor 100 uF | 1 | per group |  |
| Resistor 1k ohm | 2 | per group |  |
| Resistor 10k ohm | 1 | per group |  |
| Resistor 220 ohm | 1 | per group |  |
| Potentiometer 10k | 1 | per group |  |
| Buzzer | 1 | per group |  |
| LED 5 mm (assorted) | 1 | per group |  |
| 9V battery + snap | 1 | per group |  |
| Digital multimeter | 1 | per group |  |
| Breadboard (half size) | 1 | per group |  |
| Jumper wires M-M | 12 | per group |  |

**Not in the simulator:** The 555 timer is analogue: explore capacitors in Capacitor Lab and Circuit Construction Kit: AC.


#### YI-02 · Heart Rate Monitoring System

**Unit:** Electronics & Mechanisms · **Phase:** Phase 1 · **Domain:** Sensors & Environment

Doctors, athletes and smartwatches all track heart rate to spot health problems early.

**What it does:** A pulse sensor gives a wave; each peak is a heartbeat. The OLED draws the wave and shows beats per minute.

**Kit for this activity:**

| Part | How many | Issued | Note |
|---|---|---|---|
| Arduino Uno + USB cable | 1 | per group |  |
| Pulse sensor | 1 | per group |  |
| OLED 0.96 in I2C | 1 | per group |  |
| Buzzer | 1 | per group |  |
| LED 5 mm (assorted) | 1 | per group |  |
| Resistor 220 ohm | 1 | per group |  |
| Breadboard (half size) | 1 | per group |  |
| Jumper wires M-M | 10 | per group |  |
| Jumper wires M-F | 6 | per group |  |
| Laptop | 1 | per group |  |

**Board:** Arduino Uno

**Wiring (as Circuit Lab builds it):**

- **Pulse sensor**: S → pin A0
- **OLED 0.96" I2C**: SDA and SCL (A4 and A5 on an Uno, 21 and 22 on an ESP32), address 60
- **LED**: color: red, signal → pin 13
- **Buzzer**: signal → pin 8

**Things to try in the simulator:**

- Start and watch the heartbeat wave and BPM.
- Click the pulse sensor and change the heart rate to 120.
- Make the buzzer beep on each beat, like a hospital monitor.

**The sketch:**

```cpp
// Heart rate monitor
#include <Wire.h>
#include <Adafruit_GFX.h>
#include <Adafruit_SSD1306.h>
Adafruit_SSD1306 oled(128, 64, &Wire, -1);
const int PULSE = A0, LED = 13, BUZZER = 8;
int threshold = 600;        // tune this!
bool inBeat = false;
unsigned long lastBeat = 0;
int bpm = 0, x = 0;

void setup() {
  pinMode(LED, OUTPUT);
  oled.begin(SSD1306_SWITCHCAPVCC, 0x3C);
  oled.setTextColor(SSD1306_WHITE);
  oled.clearDisplay();
}

void loop() {
  int signal = analogRead(PULSE);
  if (signal > threshold && !inBeat) {
    inBeat = true;
    unsigned long now = millis(), gap = now - lastBeat;
    lastBeat = now;
    if (gap > 300 && gap < 2000) bpm = 60000 / gap;
    digitalWrite(LED, HIGH);
    tone(BUZZER, 1000, 30);
  }
  if (signal < threshold - 20) { inBeat = false; digitalWrite(LED, LOW); }

  int y = map(signal, 400, 800, 63, 20);
  oled.drawPixel(x, constrain(y, 20, 63), SSD1306_WHITE);
  if (++x > 127) { x = 0; oled.clearDisplay(); }
  oled.fillRect(0, 0, 128, 16, SSD1306_BLACK);
  oled.setTextSize(2); oled.setCursor(0, 0);
  oled.print(bpm); oled.print(" BPM");
  oled.display();
  delay(10);
}
```


#### YI-03 · Smart Classroom Energy Saver

**Unit:** Electronics & Mechanisms · **Phase:** Phase 1 · **Domain:** Power & Energy

Schools waste energy when lights stay on in empty or bright rooms.

**What it does:** The lamp turns on only when someone is in the room and it is dark.

**Kit for this activity:**

| Part | How many | Issued | Note |
|---|---|---|---|
| Arduino Uno + USB cable | 1 | per group |  |
| PIR motion sensor | 1 | per group |  |
| LDR module | 1 | per group |  |
| Relay module (1-channel) | 1 | per group |  |
| Low-voltage LED lamp (5 V) | 1 | per group |  |
| OLED 0.96 in I2C | 1 | per group |  |
| Breadboard (half size) | 1 | per group |  |
| Jumper wires M-M | 10 | per group |  |
| Jumper wires M-F | 8 | per group |  |
| Laptop | 1 | per group |  |
| LED 5 mm (assorted) | 1 | per group | Added: every Arduino class |
| Resistor 220 ohm | 1 | per group | Added: for the LED |
| Buzzer | 1 | per group | Added: every Arduino class |

**Board:** Arduino Uno

**Wiring (as Circuit Lab builds it):**

- **PIR motion sensor**: OUT → pin 2
- **Light sensor (LDR)**: AO → pin A0
- **Relay module**: IN → pin 7, with: [object Object]
- **OLED 0.96" I2C**: SDA and SCL (A4 and A5 on an Uno, 21 and 22 on an ESP32), address 60

**Things to try in the simulator:**

- Click the PIR and press 'Wave in front'.
- Make the room dark with the light slider: the lamp comes on.
- Keep the lamp on for 10 seconds after the last movement.

**The sketch:**

```cpp
// Smart classroom energy saver
#include <Wire.h>
#include <Adafruit_GFX.h>
#include <Adafruit_SSD1306.h>
Adafruit_SSD1306 oled(128, 64, &Wire, -1);
const int PIR = 2, LIGHT = A0, RELAY = 7;
unsigned long lastSeen = 0;

void setup() {
  pinMode(PIR, INPUT);
  pinMode(RELAY, OUTPUT);
  oled.begin(SSD1306_SWITCHCAPVCC, 0x3C);
  oled.setTextColor(SSD1306_WHITE);
}

void loop() {
  if (digitalRead(PIR) == HIGH) lastSeen = millis();
  bool someone = millis() - lastSeen < 5000;
  bool dark = analogRead(LIGHT) > 600;
  bool lampOn = someone && dark;
  digitalWrite(RELAY, lampOn);

  oled.clearDisplay();
  oled.setTextSize(1); oled.setCursor(0, 0); oled.print("ENERGY SAVER");
  oled.setCursor(0, 18); oled.print("Room: "); oled.print(someone ? "busy" : "empty");
  oled.setCursor(0, 30); oled.print("Light: "); oled.print(dark ? "dark" : "bright");
  oled.setTextSize(2); oled.setCursor(0, 46); oled.print(lampOn ? "LAMP ON" : "LAMP OFF");
  oled.display();
  delay(200);
}
```


#### YI-04 · Stepper Motor Drawing Plotter

**Unit:** Electronics & Mechanisms · **Phase:** Phase 1 · **Domain:** Mechanical Design

Printers, 3D printers and CNC machines move with stepper motors that turn in tiny exact steps.

**What it does:** Two 28BYJ-48 steppers drive the wheels and a servo lifts the pen: the robot draws a square.

**Kit for this activity:**

| Part | How many | Issued | Note |
|---|---|---|---|
| Arduino Uno + USB cable | 1 | per group |  |
| Stepper 28BYJ-48 + ULN2003 | 2 | per group |  |
| Servo SG90 | 1 | per group | Pen lift |
| Cardboard sheet | 2 | per group | Frame |
| Markers | 1 | per group |  |
| Tape (paper + double-sided) | 1 | per class |  |
| 4xAA battery pack | 1 | per group | Motor power |
| Jumper wires M-F | 12 | per group |  |
| Jumper wires M-M | 6 | per group |  |
| Laptop | 1 | per group |  |
| LED 5 mm (assorted) | 1 | per group | Added: every Arduino class |
| Resistor 220 ohm | 1 | per group | Added: for the LED |
| Buzzer | 1 | per group | Added: every Arduino class |

**Board:** Arduino Uno

**Wiring (as Circuit Lab builds it):**

- **Stepper 28BYJ-48 + ULN2003**: label: Left wheel, IN1 → pin 2, IN2 → pin 3, IN3 → pin 4, IN4 → pin 5
- **Stepper 28BYJ-48 + ULN2003**: label: Right wheel, IN1 → pin 6, IN2 → pin 7, IN3 → pin 8, IN4 → pin 9
- **Servo SG90**: label: Pen, PWM → pin 10
- **LED**: color: green, signal → pin 13

**Things to try in the simulator:**

- Start: both steppers turn, then the robot turns 90 degrees.
- Change 80 to 40 for a smaller square.
- Draw a triangle: 3 sides and turn(120).

**The sketch:**

```cpp
// Drawing plotter
#include <Stepper.h>
#include <Servo.h>
Stepper L(2048, 2, 4, 3, 5), R(2048, 6, 8, 7, 9);   // IN1, IN3, IN2, IN4
Servo pen;
float STEPS_PER_MM  = 10.9;   // calibrate!
float STEPS_PER_DEG = 9.5;    // calibrate!

void drive(float mm) {
  long n = mm * STEPS_PER_MM;
  for (long i = 0; i < n; i++) { L.step(1); R.step(-1); }
}
void turn(float deg) {            // turn on the spot
  long n = deg * STEPS_PER_DEG;
  for (long i = 0; i < n; i++) { L.step(1); R.step(1); }
}
void penDown() { pen.write(40); delay(300); }
void penUp()   { pen.write(90); delay(300); }

void setup() {
  pinMode(13, OUTPUT);
  L.setSpeed(12); R.setSpeed(12); pen.attach(10);
  penDown(); digitalWrite(13, HIGH);
  for (int s = 0; s < 4; s++) { drive(80); turn(90); }
  penUp(); digitalWrite(13, LOW);
}
void loop() {}
```


#### YI-05 · Obstacle Avoiding Robot with Scanning Sonar

**Unit:** Robots & Security · **Phase:** Phase 1 · **Domain:** Robotics & Actuation

Self-driving cars scan their surroundings before choosing a direction.

**What it does:** The car drives until something is close, then the servo 'neck' looks left and right and the car turns to the clearer side.

**Kit for this activity:**

| Part | How many | Issued | Note |
|---|---|---|---|
| Arduino Uno + USB cable | 1 | per group |  |
| 2WD robot chassis kit | 1 | per group |  |
| L298N motor driver | 1 | per group |  |
| Ultrasonic sensor HC-SR04 | 1 | per group |  |
| Servo SG90 | 1 | per group |  |
| 4xAA battery pack | 1 | per group |  |
| Screwdriver set | 1 | per group |  |
| Jumper wires M-F | 10 | per group |  |
| Jumper wires M-M | 8 | per group |  |
| Laptop | 1 | per group |  |
| LED 5 mm (assorted) | 1 | per group | Added: every Arduino class |
| Resistor 220 ohm | 1 | per group | Added: for the LED |
| Buzzer | 1 | per group | Added: every Arduino class |

**Board:** Arduino Uno

**Wiring (as Circuit Lab builds it):**

- **Ultrasonic HC-SR04**: TRIG → pin 12, ECHO → pin 10
- **Servo SG90**: label: Neck, PWM → pin 3
- **L298N motor driver**: ENA → pin 5, IN1 → pin 7, IN2 → pin 8, ENB → pin 6, IN3 → pin 9, IN4 → pin 11, with: [object Object]
- **Buzzer**: signal → pin 4

**Things to try in the simulator:**

- Distance 60 cm: both wheels forward.
- Drop the distance below 25 cm: the robot backs up and the neck looks around.
- Change SAFE to 35 cm.

**The sketch:**

```cpp
// Obstacle-avoiding robot with a scanning neck
#include <Servo.h>
const int ENA = 5, IN1 = 7, IN2 = 8, ENB = 6, IN3 = 9, IN4 = 11;
const int TRIG = 12, ECHO = 10, BUZZER = 4;
Servo neck;
const int SAFE = 25;       // cm: tune this!
int SPEED = 180;           // 0 to 255

long readCm() {
  digitalWrite(TRIG, LOW);  delayMicroseconds(2);
  digitalWrite(TRIG, HIGH); delayMicroseconds(10);
  digitalWrite(TRIG, LOW);
  long us = pulseIn(ECHO, HIGH, 25000);
  return us == 0 ? 400 : us / 58;          // no echo = far away
}
void drive(int left, int right) {           // -255 .. 255
  digitalWrite(IN1, left > 0);  digitalWrite(IN2, left < 0);  analogWrite(ENA, constrain(abs(left), 0, 255));
  digitalWrite(IN3, right > 0); digitalWrite(IN4, right < 0); analogWrite(ENB, constrain(abs(right), 0, 255));
}

int look(int angle) { neck.write(angle); delay(400); return readCm(); }

void setup() {
  int pins[] = {ENA, IN1, IN2, ENB, IN3, IN4, TRIG};
  for (int i = 0; i < 7; i++) pinMode(pins[i], OUTPUT);
  pinMode(ECHO, INPUT);
  neck.attach(3);  neck.write(90);   // face forward
  Serial.begin(9600);
  delay(1000);
}

void loop() {
  long d = readCm();
  Serial.println(d);
  if (d > SAFE) {
    drive(SPEED, SPEED);
  } else {
    tone(BUZZER, 600, 150);
    drive(-SPEED, -SPEED); delay(300); drive(0, 0);   // back off a little
    int left = look(160), right = look(20);
    neck.write(90); delay(300);
    if (left > right && left > SAFE) { drive(-SPEED, SPEED); delay(400); }
    else if (right > SAFE)          { drive(SPEED, -SPEED); delay(400); }
    else                            { drive(SPEED, -SPEED); delay(800); }   // turn around
  }
  delay(50);
}
```


#### YI-06 · Bluetooth Robot Car with Phone App

**Unit:** Robots & Security · **Phase:** Phase 1 · **Domain:** IoT & Communication

Remote-controlled vehicles, from toy cars to drones, send commands wirelessly.

**What it does:** Drive the car from a phone: F, B, L, R, S letters arrive over Bluetooth and control the motors.

**Kit for this activity:**

| Part | How many | Issued | Note |
|---|---|---|---|
| Arduino Uno + USB cable | 1 | per group |  |
| 2WD robot chassis kit | 1 | per group |  |
| L298N motor driver | 1 | per group |  |
| Bluetooth module HC-05 | 1 | per group |  |
| LED 5 mm (assorted) | 2 | per group | Headlights |
| Resistor 220 ohm | 2 | per group |  |
| Resistor 1k ohm | 1 | per group |  |
| Resistor 10k ohm | 1 | per group |  |
| Buzzer | 1 | per group |  |
| 4xAA battery pack | 1 | per group |  |
| Android smartphone | 1 | per group |  |
| Jumper wires M-F | 10 | per group |  |
| Jumper wires M-M | 8 | per group |  |
| Laptop | 1 | per group |  |

**Board:** Arduino Uno

**Wiring (as Circuit Lab builds it):**

- **Bluetooth HC-05**: TXD → pin 2, RXD → pin 3
- **L298N motor driver**: ENA → pin 5, IN1 → pin 7, IN2 → pin 8, ENB → pin 6, IN3 → pin 9, IN4 → pin 10, with: [object Object]
- **Buzzer**: signal → pin 11

**Things to try in the simulator:**

- Start, open the Phone tab and tap F, then L, R, B and S.
- Send H for the horn.
- Add a safety stop: if no command arrives for 2 seconds, stop.

**The sketch:**

```cpp
// Bluetooth car
#include <SoftwareSerial.h>
SoftwareSerial bt(2, 3);                 // RX, TX
const int ENA = 5, IN1 = 7, IN2 = 8, IN3 = 9, IN4 = 10, ENB = 6;
int speed = 180;                         // 0 to 255

void go(int a, int b, int c, int d) {
  digitalWrite(IN1, a); digitalWrite(IN2, b);
  digitalWrite(IN3, c); digitalWrite(IN4, d);
  analogWrite(ENA, speed); analogWrite(ENB, speed);
}

void setup() {
  for (int p = 5; p <= 12; p++) pinMode(p, OUTPUT);
  bt.begin(9600);
  bt.println("Car ready: F B L R S H");
}

void loop() {
  if (bt.available()) {
    char c = bt.read();
    if      (c == 'F') go(1, 0, 1, 0);
    else if (c == 'B') go(0, 1, 0, 1);
    else if (c == 'L') go(0, 1, 1, 0);
    else if (c == 'R') go(1, 0, 0, 1);
    else if (c == 'S') go(0, 0, 0, 0);
    else if (c == 'H') tone(11, 800, 200);   // horn
    if (c > ' ') { bt.print("OK "); bt.println(c); }
  }
}
```


#### YI-07 · Gesture-Controlled Robot Arm

**Unit:** Robots & Security · **Phase:** Phase 1 · **Domain:** Robotics & Actuation

Surgeons and bomb-disposal teams control robot arms from a distance, and some arms follow hand movements.

**What it does:** Tilt the MPU6050 and the arm follows: roll turns the base, pitch moves the shoulder, the button opens the gripper.

**Kit for this activity:**

| Part | How many | Issued | Note |
|---|---|---|---|
| Arduino Uno + USB cable | 1 | per group |  |
| MPU6050 IMU | 1 | per group |  |
| Servo SG90 | 3 | per group |  |
| Push button | 1 | per group |  |
| Ice cream sticks | 10 | per group | Arm structure |
| Glue gun + glue sticks | 1 | per class |  |
| 4xAA battery pack | 1 | per group | Servo power |
| Breadboard (half size) | 1 | per group |  |
| Jumper wires M-M | 12 | per group |  |
| Jumper wires M-F | 6 | per group |  |
| Laptop | 1 | per group |  |
| LED 5 mm (assorted) | 1 | per group | Added: every Arduino class |
| Resistor 220 ohm | 1 | per group | Added: for the LED |
| Buzzer | 1 | per group | Added: every Arduino class |

**Board:** Arduino Uno

**Wiring (as Circuit Lab builds it):**

- **MPU6050 motion**: SDA and SCL (A4 and A5 on an Uno, 21 and 22 on an ESP32), address 104
- **Servo SG90**: label: Base, PWM → pin 9
- **Servo SG90**: label: Shoulder, PWM → pin 10
- **Servo SG90**: label: Gripper, PWM → pin 11
- **Push button**: signal → pin 2

**Things to try in the simulator:**

- Click the MPU6050 and drag Tilt Y: the base servo turns.
- Drag Tilt X: the shoulder moves.
- Press the button: the gripper opens and closes.

**The sketch:**

```cpp
// Gesture-controlled robot arm (reads the MPU6050 registers directly)
#include <Wire.h>
#include <Servo.h>
Servo base, shoulder, grip;
const int MPU = 0x68;           // I2C address
const float A = 0.15;           // smoothing (0.05 to 0.5)
float pitchS = 0, rollS = 0;    // smoothed angles
bool gripOpen = true;

void setup() {
  Wire.begin();
  Wire.beginTransmission(MPU);
  Wire.write(0x6B); Wire.write(0);   // wake the MPU6050 up
  Wire.endTransmission();
  base.attach(9); shoulder.attach(10); grip.attach(11);
  pinMode(2, INPUT_PULLUP);
}

void readTilt(float &pitch, float &roll) {
  Wire.beginTransmission(MPU);
  Wire.write(0x3B);                  // first accelerometer register
  Wire.endTransmission(false);
  Wire.requestFrom(MPU, 6);
  int16_t ax = Wire.read() << 8 | Wire.read();
  int16_t ay = Wire.read() << 8 | Wire.read();
  int16_t az = Wire.read() << 8 | Wire.read();
  pitch = atan2(-ax, sqrt((float)ay * ay + (float)az * az)) * 57.3;
  roll  = atan2(ay, az) * 57.3;
}

void loop() {
  float pitch, roll;
  readTilt(pitch, roll);
  pitchS = A * pitch + (1 - A) * pitchS;     // smooth
  rollS  = A * roll  + (1 - A) * rollS;

  base.write(map(constrain(rollS,  -60, 60), -60, 60, 0, 180));
  shoulder.write(map(constrain(pitchS, -60, 60), -60, 60, 30, 150));

  if (digitalRead(2) == LOW) {               // button pressed
    gripOpen = !gripOpen;
    grip.write(gripOpen ? 90 : 20);
    delay(300);                               // simple debounce
  }
  delay(20);
}
```


#### YI-08 · RFID Smart Door Lock with Access Log

**Unit:** Robots & Security · **Phase:** Phase 1 · **Domain:** Security & Safety

Offices, hotels and schools use RFID cards to decide who can enter.

**What it does:** Tap an RFID card: allowed cards unlock the door (servo) with a green light; unknown cards get a red light and a buzz.

**Kit for this activity:**

| Part | How many | Issued | Note |
|---|---|---|---|
| Arduino Uno + USB cable | 1 | per group |  |
| RFID RC522 + cards | 1 | per group |  |
| Servo SG90 | 1 | per group |  |
| OLED 0.96 in I2C | 1 | per group |  |
| Buzzer | 1 | per group |  |
| LED 5 mm (assorted) | 2 | per group | Green, red |
| Resistor 220 ohm | 2 | per group |  |
| Breadboard (half size) | 1 | per group |  |
| Jumper wires M-M | 10 | per group |  |
| Jumper wires M-F | 10 | per group |  |
| Laptop | 1 | per group |  |

**Board:** Arduino Uno

**Wiring (as Circuit Lab builds it):**

- **RFID reader RC522**: SDA → pin 10, RST → pin 9
- **Servo SG90**: label: Door bolt, PWM → pin 3
- **LED**: color: green, signal → pin 4
- **LED**: color: red, signal → pin 5
- **Buzzer**: signal → pin 8
- **OLED 0.96" I2C**: SDA and SCL (A4 and A5 on an Uno, 21 and 22 on an ESP32), address 60

**Things to try in the simulator:**

- Start, click the RFID reader and tap the Blue tag: welcome Ayesha.
- Tap the Unknown card: refused.
- Add a third person with the White card... it is already Bilal. Remove him!

**The sketch:**

```cpp
// RFID door lock with an access log
#include <SPI.h>
#include <MFRC522.h>
#include <Servo.h>
#include <Wire.h>
#include <Adafruit_GFX.h>
#include <Adafruit_SSD1306.h>
Adafruit_SSD1306 oled(128, 64, &Wire, -1);
MFRC522 rfid(10, 9);              // SS (SDA), RST
Servo bolt;
String allowed[] = {"A3 5F 1C 2B", "7E 22 91 04"};   // YOUR card UIDs
String names[]   = {"Ayesha", "Bilal"};
const int COUNT = 2, GREEN = 4, RED = 5, BUZZER = 8;
int entries = 0;

String readUID() {
  String id = "";
  for (byte i = 0; i < rfid.uid.size; i++) {
    if (rfid.uid.uidByte[i] < 0x10) id += "0";
    id += String(rfid.uid.uidByte[i], HEX);
    if (i < rfid.uid.size - 1) id += " ";
  }
  id.toUpperCase();
  return id;
}

void show(String a, String b) {
  oled.clearDisplay();
  oled.setTextSize(1); oled.setCursor(0, 0); oled.print("DOOR  entries: "); oled.print(entries);
  oled.setTextSize(2); oled.setCursor(0, 20); oled.print(a);
  oled.setTextSize(1); oled.setCursor(0, 46); oled.print(b);
  oled.display();
}

void setup() {
  Serial.begin(9600);
  SPI.begin(); rfid.PCD_Init();
  pinMode(GREEN, OUTPUT); pinMode(RED, OUTPUT);
  bolt.attach(3); bolt.write(0);     // locked
  oled.begin(SSD1306_SWITCHCAPVCC, 0x3C);
  oled.setTextColor(SSD1306_WHITE);
  show("LOCKED", "Tap your card");
}

void loop() {
  if (!rfid.PICC_IsNewCardPresent() || !rfid.PICC_ReadCardSerial()) return;
  String id = readUID();
  rfid.PICC_HaltA();
  int who = -1;
  for (int i = 0; i < COUNT; i++) if (id == allowed[i]) who = i;
  Serial.print(millis() / 1000); Serial.print(" s  "); Serial.print(id);
  if (who >= 0) {
    entries++;
    Serial.print("  OPEN for "); Serial.println(names[who]);
    show("WELCOME", names[who]);
    digitalWrite(GREEN, HIGH); bolt.write(90); tone(BUZZER, 1319, 150);
    delay(3000);
    bolt.write(0); digitalWrite(GREEN, LOW);
  } else {
    Serial.println("  REFUSED");
    show("REFUSED", id);
    digitalWrite(RED, HIGH); tone(BUZZER, 200, 300); delay(400); tone(BUZZER, 200, 300);
    delay(1000); digitalWrite(RED, LOW);
  }
  show("LOCKED", "Tap your card");
}
```


#### YI-09 · Rechargeable Power Pack for Robots

**Unit:** Power & Wireless · **Phase:** Phase 1 · **Domain:** Power & Energy

Every robot and phone needs a safe, rechargeable power source.

**What it does:** A voltage sensor reads the 18650 cell; the OLED shows volts and a battery bar, and it beeps when the battery is low.

**Kit for this activity:**

| Part | How many | Issued | Note |
|---|---|---|---|
| Arduino Uno + USB cable | 1 | per group |  |
| 18650 cell + holder | 1 | per group | Protected cells only |
| TP4056 charger module | 1 | per group |  |
| LM2596 buck converter | 1 | per group |  |
| Digital multimeter | 1 | per group |  |
| OLED 0.96 in I2C | 1 | per group |  |
| Resistor 10k ohm | 2 | per group | Voltage divider |
| Breadboard (half size) | 1 | per group |  |
| Jumper wires M-M | 10 | per group |  |
| Jumper wires M-F | 4 | per group |  |
| Laptop | 1 | per group |  |
| LED 5 mm (assorted) | 1 | per group | Added: every Arduino class |
| Resistor 220 ohm | 1 | per group | Added: for the LED |
| Buzzer | 1 | per group | Added: every Arduino class |

**Board:** Arduino Uno

**Wiring (as Circuit Lab builds it):**

- **Voltage sensor 0-25V**: S → pin A0, with: [object Object]
- **OLED 0.96" I2C**: SDA and SCL (A4 and A5 on an Uno, 21 and 22 on an ESP32), address 60
- **LED**: color: red, signal → pin 13
- **Buzzer**: signal → pin 8

**Things to try in the simulator:**

- Start: the screen shows about 3.7 V.
- Change the battery Type to 4xAA (6 V) and restart.
- Change the low-battery warning to 3.5 V.

**The sketch:**

```cpp
// Power pack monitor
#include <Wire.h>
#include <Adafruit_GFX.h>
#include <Adafruit_SSD1306.h>
Adafruit_SSD1306 oled(128, 64, &Wire, -1);
const int VS = A0, LED = 13, BUZZER = 8;

void setup() {
  pinMode(LED, OUTPUT);
  oled.begin(SSD1306_SWITCHCAPVCC, 0x3C);
  oled.setTextColor(SSD1306_WHITE);
}

void loop() {
  float v = analogRead(VS) * 5.0 / 1023.0 * 5;    // undo the 5:1 divider
  int pct = constrain((v - 3.0) / 1.2 * 100, 0, 100);

  oled.clearDisplay();
  oled.setTextSize(2);
  oled.setCursor(0, 0);  oled.print(v, 2); oled.print(" V");
  oled.setCursor(0, 22); oled.print(pct);  oled.print(" %");
  oled.drawRect(0, 46, 102, 14, SSD1306_WHITE);
  oled.fillRect(1, 47, pct, 12, SSD1306_WHITE);
  oled.display();

  bool low = v < 3.3;
  digitalWrite(LED, low);
  if (low) tone(BUZZER, 1000, 100);   // low battery beep
  delay(1000);
}
```


#### YI-10 · Wireless Doorbell with Visitor Counter

**Unit:** Power & Wireless · **Phase:** Phase 1 · **Domain:** IoT & Communication

Wireless doorbells send a radio message from the front door to a chime inside.

**What it does:** Press the bell: ding-dong, and the OLED counts visitors.

**Kit for this activity:**

| Part | How many | Issued | Note |
|---|---|---|---|
| Arduino Uno + USB cable | 2 | per group | Transmitter + receiver |
| NRF24L01 module | 2 | per group |  |
| Push button | 1 | per group |  |
| Resistor 10k ohm | 1 | per group |  |
| Buzzer | 1 | per group |  |
| OLED 0.96 in I2C | 1 | per group |  |
| Capacitor 10 uF | 2 | per group | NRF power smoothing |
| Breadboard (half size) | 2 | per group |  |
| Jumper wires M-F | 16 | per group |  |
| Jumper wires M-M | 8 | per group |  |
| Laptop | 2 | per group |  |
| LED 5 mm (assorted) | 1 | per group | Added: every Arduino class |
| Resistor 220 ohm | 1 | per group | Added: for the LED |

**Board:** Arduino Uno

**Wiring (as Circuit Lab builds it):**

- **Push button**: signal → pin 2
- **Buzzer**: signal → pin 8
- **LED**: color: yellow, signal → pin 13
- **OLED 0.96" I2C**: SDA and SCL (A4 and A5 on an Uno, 21 and 22 on an ESP32), address 60

**Things to try in the simulator:**

- Press the button to ring.
- Show the time of the last visit (seconds since start).
- Make a different tune after 10 visitors.

**The sketch:**

```cpp
// Doorbell with a visitor counter (receiver side)
#include <Wire.h>
#include <Adafruit_GFX.h>
#include <Adafruit_SSD1306.h>
Adafruit_SSD1306 oled(128, 64, &Wire, -1);
const int BELL = 2, BUZZER = 8, LED = 13;
int visitors = 0;

void showCount() {
  oled.clearDisplay();
  oled.setTextSize(1); oled.setCursor(0, 0); oled.print("VISITORS TODAY");
  oled.setTextSize(4); oled.setCursor(0, 20); oled.print(visitors);
  oled.display();
}

void setup() {
  pinMode(BELL, INPUT_PULLUP); pinMode(LED, OUTPUT);
  oled.begin(SSD1306_SWITCHCAPVCC, 0x3C);
  oled.setTextColor(SSD1306_WHITE);
  showCount();
}

void loop() {
  if (digitalRead(BELL) == LOW) {          // "RING" arrived
    visitors++;
    showCount();
    digitalWrite(LED, HIGH);
    tone(BUZZER, 880, 300); delay(350);
    tone(BUZZER, 660, 400); delay(450);    // ding-dong!
    digitalWrite(LED, LOW);
    delay(500);
  }
}
```


#### YI-11 · Wi-Fi Automatic Plant Watering System

**Unit:** Power & Wireless · **Phase:** Phase 1 · **Domain:** Sensors & Environment

Water is scarce, and smart farms water crops only when the soil needs it.

**What it does:** The ESP32 waters the plant when the soil is dry and shows soil, temperature and humidity on a phone web page.

**Kit for this activity:**

| Part | How many | Issued | Note |
|---|---|---|---|
| ESP32 Dev Board + USB cable | 1 | per group |  |
| Soil moisture sensor | 1 | per group |  |
| DHT22 sensor | 1 | per group |  |
| Relay module (1-channel) | 1 | per group |  |
| Mini water pump + tube | 1 | per group |  |
| 4xAA battery pack | 1 | per group | Pump power |
| Plant pot with soil | 1 | per group |  |
| Water container | 1 | per group |  |
| Breadboard (half size) | 1 | per group |  |
| Jumper wires M-M | 10 | per group |  |
| Jumper wires M-F | 8 | per group |  |
| Laptop | 1 | per group |  |

**Board:** ESP32 DevKit

**Wiring (as Circuit Lab builds it):**

- **Soil moisture sensor**: AO → pin 34
- **DHT22 temp & humidity**: SDA → pin 4
- **Relay module**: IN → pin 26, with: [object Object]

**Things to try in the simulator:**

- Make the soil dry (moisture 10%): the pump runs for 3 seconds.
- Open the Phone tab to see the plant page.
- Add a Water now button to the page.

**The sketch:**

```cpp
// Wi-Fi plant watering
#include <WiFi.h>
#include <WebServer.h>
#include <DHT.h>
#define SOIL  34             // analog pin
#define RELAY 26
DHT dht(4, DHT22);
WebServer server(80);
int DRY = 2800;              // from YOUR calibration (0-4095, higher = drier)
unsigned long lastWater = 0;

void showPage() {
  int soil = analogRead(SOIL);
  String h = "<html><head><meta name=viewport content='width=device-width'><meta http-equiv=refresh content=5>"
             "<style>body{font-family:sans-serif;padding:12px}.c{background:#EEF6EE;border-radius:12px;padding:10px;margin:8px 0}</style></head><body>"
             "<h2>My Plant</h2>"
             "<div class=c>Soil: <b>" + String(soil > DRY ? "DRY" : "OK") + "</b> (" + String(soil) + ")</div>"
             "<div class=c>Temperature: <b>" + String(dht.readTemperature(), 1) + " C</b></div>"
             "<div class=c>Humidity: <b>" + String(dht.readHumidity(), 0) + " %</b></div>"
             "<div class=c>Last watered: " + String((millis() - lastWater) / 1000) + " s ago</div></body></html>";
  server.send(200, "text/html", h);
}

void setup() {
  Serial.begin(115200);
  pinMode(RELAY, OUTPUT);
  dht.begin();
  WiFi.begin("SchoolWiFi", "password");
  while (WiFi.status() != WL_CONNECTED) delay(500);
  Serial.println(WiFi.localIP());   // open this in a browser
  server.on("/", showPage);
  server.begin();
}

void loop() {
  int soil = analogRead(SOIL);
  float hum = dht.readHumidity();
  if (soil > DRY && hum < 80 && millis() - lastWater > 10000) {
    Serial.println("Watering!");
    digitalWrite(RELAY, HIGH); delay(3000);   // water 3 s
    digitalWrite(RELAY, LOW);
    lastWater = millis();
  }
  server.handleClient();
}
```


#### YI-12 · Plant Monitor Mobile App

**Unit:** Power & Wireless · **Phase:** Phase 1 · **Domain:** App, Web & Game Development

Most smart devices come with a phone app.

**Kit for this activity:**

| Part | How many | Issued | Note |
|---|---|---|---|
| Laptop | 1 | per group |  |
| Android smartphone | 1 | per group |  |
| Printed templates | 1 | per group | Screen sketch sheet |


#### YI-13 · Python Maths Quiz Game with Scoreboard

**Unit:** Software, AI & Design · **Phase:** Phase 1 · **Domain:** Programming & Logic

Python is one of the world's most popular programming languages, used from games to AI.

**Kit for this activity:**

| Part | How many | Issued | Note |
|---|---|---|---|
| Laptop | 1 | per group |  |


#### YI-14 · Personal Portfolio Website

**Unit:** Software, AI & Design · **Phase:** Phase 1 · **Domain:** App, Web & Game Development

Engineers show their work to universities and employers through online portfolios.

**Kit for this activity:**

| Part | How many | Issued | Note |
|---|---|---|---|
| Laptop | 1 | per group |  |


#### YI-15 · School Helpdesk Chatbot

**Unit:** Software, AI & Design · **Phase:** Phase 1 · **Domain:** AI & Data

Chatbots answer questions on websites and in apps every day.

**Kit for this activity:**

| Part | How many | Issued | Note |
|---|---|---|---|
| Laptop | 1 | per group |  |


#### YI-16 · 3D-Printed Plant Monitor Enclosure

**Unit:** Software, AI & Design · **Phase:** Phase 1 · **Domain:** Mechanical Design

A real product needs a case that protects its electronics and fits in its environment.

**Kit for this activity:**

| Part | How many | Issued | Note |
|---|---|---|---|
| Laptop | 1 | per group |  |
| 3D printer | 1 | per class |  |
| PLA filament | 1 | per class |  |


#### YI-17 · Processing: Generative Art Poster

**Unit:** Creative Coding · **Phase:** Phase 2 · **Domain:** App, Web & Game Development

Generative artists write code that creates artwork they could never draw by hand.

**Kit for this activity:**

| Part | How many | Issued | Note |
|---|---|---|---|
| Laptop | 1 | per group |  |


#### YI-18 · Processing + Arduino: Live Sensor Radar

**Unit:** Creative Coding · **Phase:** Phase 2 · **Domain:** Programming & Logic

Radar screens draw what sensors detect in real time.

**What it does:** A servo sweeps the ultrasonic sensor from 15° to 165° and sends angle,distance pairs for a radar screen.

**Kit for this activity:**

| Part | How many | Issued | Note |
|---|---|---|---|
| Arduino Uno + USB cable | 1 | per group |  |
| Ultrasonic sensor HC-SR04 | 1 | per group |  |
| Servo SG90 | 1 | per group |  |
| Breadboard (half size) | 1 | per group |  |
| Jumper wires M-M | 6 | per group |  |
| Jumper wires M-F | 4 | per group |  |
| Laptop | 1 | per group |  |
| LED 5 mm (assorted) | 1 | per group | Added: every Arduino class |
| Resistor 220 ohm | 1 | per group | Added: for the LED |
| Buzzer | 1 | per group | Added: every Arduino class |

**Board:** Arduino Uno

**Wiring (as Circuit Lab builds it):**

- **Ultrasonic HC-SR04**: TRIG → pin 10, ECHO → pin 11
- **Servo SG90**: PWM → pin 12
- **LED**: color: red, signal → pin 13
- **Buzzer**: signal → pin 8

**Things to try in the simulator:**

- Start and watch the Serial tab: angle,distance.
- Set the distance to 15 cm: the LED and buzzer warn of a close object.
- Send the data to the Processing radar sketch on a real board.

**The sketch:**

```cpp
// Radar: servo sweep + ultrasonic
#include <Servo.h>
const int TRIG = 10, ECHO = 11, LED = 13, BUZZER = 8;
Servo s;

int readCm() {
  digitalWrite(TRIG, LOW);  delayMicroseconds(2);
  digitalWrite(TRIG, HIGH); delayMicroseconds(10);
  digitalWrite(TRIG, LOW);
  long t = pulseIn(ECHO, HIGH, 30000);   // µs
  return t * 0.0343 / 2;
}

void sendReading(int a) {
  s.write(a); delay(30);
  int d = readCm();
  Serial.print(a); Serial.print(","); Serial.print(d); Serial.print(".");
  bool close = d > 0 && d < 20;
  digitalWrite(LED, close);
  if (close) tone(BUZZER, 1500, 10);
}

void setup() {
  pinMode(TRIG, OUTPUT); pinMode(ECHO, INPUT); pinMode(LED, OUTPUT);
  s.attach(12); Serial.begin(9600);
}

void loop() {
  for (int a = 15; a <= 165; a++) sendReading(a);
  for (int a = 165; a >= 15; a--) sendReading(a);
}
```


#### YI-19 · Python Pygame: Catch the Falling Stars

**Unit:** Creative Coding · **Phase:** Phase 2 · **Domain:** App, Web & Game Development

Python is used to build real games.

**Kit for this activity:**

| Part | How many | Issued | Note |
|---|---|---|---|
| Laptop | 1 | per group |  |


#### YI-20 · ESP32-CAM Wildlife Camera

**Unit:** Creative Coding · **Phase:** Phase 2 · **Domain:** IoT & Communication

Conservationists use hidden 'camera traps' to study wild animals.

**Kit for this activity:**

| Part | How many | Issued | Note |
|---|---|---|---|
| ESP32-CAM + programmer | 1 | per group | From lab stock |
| PIR motion sensor | 1 | per group |  |
| Jumper wires M-F | 6 | per group |  |
| Laptop | 1 | per group |  |

**Not in the simulator:** The ESP32-CAM camera can't be simulated.


#### YI-21 · Python Data Lab: Is Our Classroom Too Hot?

**Unit:** Data & Signals · **Phase:** Phase 2 · **Domain:** AI & Data

Scientists log data over time to answer real questions.

**What it does:** The Arduino logs temperature and humidity as CSV lines that Python can read and graph.

**Kit for this activity:**

| Part | How many | Issued | Note |
|---|---|---|---|
| Arduino Uno + USB cable | 1 | per group |  |
| DHT22 sensor | 1 | per group |  |
| Breadboard (half size) | 1 | per group |  |
| Jumper wires M-M | 4 | per group |  |
| Laptop | 1 | per group |  |
| LED 5 mm (assorted) | 1 | per group | Added: every Arduino class |
| Resistor 220 ohm | 1 | per group | Added: for the LED |
| Buzzer | 1 | per group | Added: every Arduino class |

**Board:** Arduino Uno

**Wiring (as Circuit Lab builds it):**

- **DHT22 temp & humidity**: SDA → pin 7
- **LED**: color: red, signal → pin 13
- **Buzzer**: signal → pin 8

**Things to try in the simulator:**

- Open Serial and Graph: change the DHT22 temperature and watch the line.
- Copy the CSV lines into a file for Python (pandas).
- Light the LED above 30 °C (too hot to learn!).

**The sketch:**

```cpp
// Classroom climate logger (CSV)
#include <DHT.h>
DHT dht(7, DHT22);
const int LED = 13, BUZZER = 8;

void setup() {
  pinMode(LED, OUTPUT);
  Serial.begin(9600);
  dht.begin();
  Serial.println("seconds,temp_c,humidity");   // CSV header
}

void loop() {
  float t = dht.readTemperature(), h = dht.readHumidity();
  Serial.print(millis() / 1000); Serial.print(",");
  Serial.print(t, 1); Serial.print(",");
  Serial.println(h, 1);
  bool hot = t > 30;
  digitalWrite(LED, hot);
  if (hot) tone(BUZZER, 1200, 80);
  delay(2000);
}
```


#### YI-22 · Smart Posture Corrector Wearable

**Unit:** Data & Signals · **Phase:** Phase 2 · **Domain:** Sensors & Environment

Bad posture while studying can cause back pain.

**What it does:** The MPU6050 measures how far you lean. Slouch for 5 seconds and the vibration motor buzzes; the button re-calibrates 'straight'.

**Kit for this activity:**

| Part | How many | Issued | Note |
|---|---|---|---|
| Arduino Uno + USB cable | 1 | per group |  |
| MPU6050 IMU | 1 | per group |  |
| Vibration motor module | 1 | per group |  |
| OLED 0.96 in I2C | 1 | per group |  |
| Jumper wires M-F | 8 | per group |  |
| Laptop | 1 | per group |  |
| LED 5 mm (assorted) | 1 | per group | Added: every Arduino class |
| Resistor 220 ohm | 1 | per group | Added: for the LED |
| Buzzer | 1 | per group | Added: every Arduino class |

**Board:** Arduino Uno

**Wiring (as Circuit Lab builds it):**

- **MPU6050 motion**: SDA and SCL (A4 and A5 on an Uno, 21 and 22 on an ESP32), address 104
- **Vibration motor**: IN → pin 5
- **Push button**: signal → pin 2
- **OLED 0.96" I2C**: SDA and SCL (A4 and A5 on an Uno, 21 and 22 on an ESP32), address 60
- **LED**: color: yellow, signal → pin 13

**Things to try in the simulator:**

- Start, then click the MPU6050 and change Tilt Y to lean forward.
- Hold the lean for 5 s: the motor buzzes.
- Press the button to save your new 'straight'.

**The sketch:**

```cpp
// Posture corrector
#include <Wire.h>
#include <MPU6050.h>
#include <Wire.h>
#include <Adafruit_GFX.h>
#include <Adafruit_SSD1306.h>
Adafruit_SSD1306 oled(128, 64, &Wire, -1);
MPU6050 mpu;
const int VIB = 5, BTN = 2, LED = 13;
float zero = 0;  unsigned long slouchStart = 0;

float tiltDeg() {
  int16_t ax, ay, az;
  mpu.getAcceleration(&ax, &ay, &az);
  return atan2(ay, az) * 180.0 / PI;     // forward/back tilt
}

void calibrate() {
  float sum = 0;
  for (int i = 0; i < 20; i++) { sum += tiltDeg(); delay(50); }
  zero = sum / 20;                       // your 'straight'
  digitalWrite(VIB, HIGH); delay(100); digitalWrite(VIB, LOW);
}

void setup() {
  Wire.begin();
  mpu.initialize();
  pinMode(VIB, OUTPUT); pinMode(BTN, INPUT_PULLUP); pinMode(LED, OUTPUT);
  oled.begin(SSD1306_SWITCHCAPVCC, 0x3C);
  oled.setTextColor(SSD1306_WHITE);
  calibrate();
}

void loop() {
  if (digitalRead(BTN) == LOW) calibrate();
  float lean = tiltDeg() - zero;
  bool bad = abs(lean) > 20;
  if (bad) {
    if (slouchStart == 0) slouchStart = millis();
    if (millis() - slouchStart > 5000) {   // 5 s in a row
      digitalWrite(VIB, HIGH); delay(300); digitalWrite(VIB, LOW);
      slouchStart = millis();
    }
  } else slouchStart = 0;                   // sat up: reset timer
  digitalWrite(LED, bad);

  oled.clearDisplay();
  oled.setTextSize(1); oled.setCursor(0, 0); oled.print("POSTURE");
  oled.setTextSize(2); oled.setCursor(0, 18); oled.print(lean, 0); oled.print(" deg");
  oled.setCursor(0, 42); oled.print(bad ? "SIT UP!" : "Good");
  oled.display();
  delay(100);
}
```


#### YI-23 · Li-Fi Messenger: Sending Text with Light

**Unit:** Data & Signals · **Phase:** Phase 2 · **Domain:** IoT & Communication

Li-Fi sends data with flickering light instead of radio.

**What it does:** Letters are sent as light flashes (8 bits each). The light sensor reads the flashes back and rebuilds the letter.

**Kit for this activity:**

| Part | How many | Issued | Note |
|---|---|---|---|
| Arduino Uno + USB cable | 2 | per group | Sender + receiver |
| LED 5 mm (assorted) | 1 | per group | Bright white |
| LDR module | 1 | per group |  |
| Resistor 220 ohm | 1 | per group |  |
| Breadboard (half size) | 2 | per group |  |
| Jumper wires M-M | 8 | per group |  |
| Laptop | 2 | per group |  |
| Buzzer | 1 | per group | Added: every Arduino class |

**Board:** Arduino Uno

**Wiring (as Circuit Lab builds it):**

- **LED**: color: white, signal → pin 8
- **Light sensor (LDR)**: AO → pin A0, sim: [object Object]
- **Buzzer**: signal → pin 7

**Things to try in the simulator:**

- Type a word in the Serial box and press Send: watch the LED flash and the letters come back.
- Make T smaller (faster) and test if it still works.
- On two real boards, run the sender and the receiver separately.

**The sketch:**

```cpp
// Li-Fi loopback: send with light, read it back
const int LED = 8, BUZZER = 7, T = 50;       // bit time in ms
int TH = 500;                                // light threshold

bool lit() { return analogRead(A0) < TH; }  // LDR module: low = bright

byte sendAndRead(byte b) {
  byte got = 0;
  digitalWrite(LED, HIGH); delay(T);         // start bit
  for (int i = 0; i < 8; i++) {              // 8 data bits, lowest first
    digitalWrite(LED, bitRead(b, i));
    delay(T / 2);
    if (lit()) bitSet(got, i);               // read in the middle of the bit
    delay(T / 2);
  }
  digitalWrite(LED, LOW); delay(2 * T);      // stop / rest
  return got;
}

void setup() {
  pinMode(LED, OUTPUT);
  Serial.begin(9600);
  Serial.println("Type a message and press Send");
}

void loop() {
  if (Serial.available()) {
    char c = Serial.read();
    if (c < ' ') return;
    byte back = sendAndRead(c);
    Serial.print("sent '"); Serial.print(c); Serial.print("'  received '"); Serial.print((char)back); Serial.println("'");
    if (back != (byte)c) tone(BUZZER, 200, 200);
  }
}
```


#### YI-24 · Python Code Breakers: Caesar to Vigenère

**Unit:** Data & Signals · **Phase:** Phase 2 · **Domain:** Security & Safety

Codes have protected secrets for thousands of years.

**Kit for this activity:**

| Part | How many | Issued | Note |
|---|---|---|---|
| Laptop | 1 | per group |  |


#### YI-25 · Robot Sumo Challenge

**Unit:** Robots & Mechanisms · **Phase:** Phase 2 · **Domain:** Robotics & Actuation

Robot sumo is a real competition: robots try to push each other out of a ring.

**What it does:** A state machine: SEARCH (spin), ATTACK (charge when the sonar sees the opponent) and ESCAPE (back off at the white ring edge).

**Kit for this activity:**

| Part | How many | Issued | Note |
|---|---|---|---|
| 4WD robot car (assembled, L298N) | 1 | per group | From Phase 2B requisition |
| Ultrasonic sensor HC-SR04 | 1 | per group |  |
| IR sensor module | 2 | per group | Edge sensors |
| Jumper wires M-F | 10 | per group |  |
| Laptop | 1 | per group |  |

**Board:** Arduino Uno

**Wiring (as Circuit Lab builds it):**

- **IR line sensor**: label: Edge left, OUT → pin 2
- **IR line sensor**: label: Edge right, OUT → pin 3
- **Ultrasonic HC-SR04**: TRIG → pin 12, ECHO → pin 10
- **L298N motor driver**: ENA → pin 5, IN1 → pin 7, IN2 → pin 8, ENB → pin 6, IN3 → pin 9, IN4 → pin 11, with: [object Object]

**Things to try in the simulator:**

- No opponent: the robot spins (SEARCH).
- Set the distance to 30 cm: full speed ATTACK.
- Turn off 'Over the black line' on an edge sensor (white edge): ESCAPE.

**The sketch:**

```cpp
// Robot sumo
const int IRL = 2, IRR = 3, TRIG = 12, ECHO = 10;
const int ENA = 5, IN1 = 7, IN2 = 8, ENB = 6, IN3 = 9, IN4 = 11;
enum State { SEARCH, ATTACK, ESCAPE };
State state = SEARCH;

void drive(int left, int right) {           // -255 .. 255
  digitalWrite(IN1, left > 0);  digitalWrite(IN2, left < 0);  analogWrite(ENA, constrain(abs(left), 0, 255));
  digitalWrite(IN3, right > 0); digitalWrite(IN4, right < 0); analogWrite(ENB, constrain(abs(right), 0, 255));
}
long cm() {
  digitalWrite(TRIG, LOW); delayMicroseconds(2);
  digitalWrite(TRIG, HIGH); delayMicroseconds(10); digitalWrite(TRIG, LOW);
  long us = pulseIn(ECHO, HIGH, 25000);
  return us == 0 ? 400 : us / 58;
}
bool edge() { return digitalRead(IRL) == LOW || digitalRead(IRR) == LOW; }   // LOW = white edge

void setup() {
  pinMode(IRL, INPUT); pinMode(IRR, INPUT);
  pinMode(TRIG, OUTPUT); pinMode(ECHO, INPUT);
  int motorPins[] = {ENA, IN1, IN2, ENB, IN3, IN4};
  for (int i = 0; i < 6; i++) pinMode(motorPins[i], OUTPUT);
  Serial.begin(9600);
  delay(5000);                       // RULE: 5-second start delay
}

void loop() {
  if (edge())            state = ESCAPE;
  else if (cm() < 40)    state = ATTACK;
  else                   state = SEARCH;
  Serial.println(state == ESCAPE ? "ESCAPE" : state == ATTACK ? "ATTACK" : "SEARCH");
  switch (state) {
    case ESCAPE: drive(-220, -220); delay(300); drive(200, -200); delay(250); break;
    case ATTACK: drive(255, 255); break;
    case SEARCH: drive(140, -140); break;
  }
}
```


#### YI-26 · Walking Linkage Robot

**Unit:** Robots & Mechanisms · **Phase:** Phase 2 · **Domain:** Mechanical Design

Engineers copy nature: some robots walk instead of rolling.

**What it does:** One motor turns a crank; the linkage turns that spin into walking legs. Here: battery, switch and motor.

**Kit for this activity:**

| Part | How many | Issued | Note |
|---|---|---|---|
| DC hobby motor | 1 | per group | Geared TT motor |
| 4xAA battery pack | 1 | per group |  |
| Ice cream sticks | 20 | per group |  |
| Split pins (paper fasteners) | 12 | per group |  |
| Wooden skewers | 4 | per group |  |
| Glue gun + glue sticks | 1 | per class |  |

**Board:** null

**Wiring (as Circuit Lab builds it):**

- **Battery**: attrs: [object Object], rails: [object Object]
- **Slide switch**: feed: true
- **DC motor**: label: Crank motor, rails: [object Object]

**Things to try in the simulator:**

- Start and flip the switch.
- Change to 2xAA: the crank turns slower.
- Count: 4xAA gives about 6 V.


#### YI-27 · Energy Detective: How Much Power Do Gadgets Use?

**Unit:** Robots & Mechanisms · **Phase:** Phase 2 · **Domain:** Power & Energy

Electricity bills depend on how much power our devices use.

**What it does:** An INA219 measures volts and milliamps; the board works out power and energy and shows them on the OLED.

**Kit for this activity:**

| Part | How many | Issued | Note |
|---|---|---|---|
| Arduino Uno + USB cable | 1 | per group |  |
| Current sensor INA219 | 1 | per group |  |
| OLED 0.96 in I2C | 1 | per group |  |
| LED 5 mm (assorted) | 2 | per group |  |
| DC hobby motor | 1 | per group |  |
| 4xAA battery pack | 1 | per group |  |
| Breadboard (half size) | 1 | per group |  |
| Jumper wires M-M | 10 | per group |  |
| Laptop | 1 | per group |  |
| Resistor 220 ohm | 1 | per group | Added: for the LED |
| Buzzer | 1 | per group | Added: every Arduino class |

**Board:** Arduino Uno

**Wiring (as Circuit Lab builds it):**

- **Current sensor INA219**: SDA and SCL (A4 and A5 on an Uno, 21 and 22 on an ESP32), address 64
- **OLED 0.96" I2C**: SDA and SCL (A4 and A5 on an Uno, 21 and 22 on an ESP32), address 60
- **LED**: color: green, signal → pin 13
- **Buzzer**: signal → pin 8

**Things to try in the simulator:**

- Click the INA219 and choose a different gadget.
- Which gadget uses the most power? Rank them.
- Beep when power goes above 1 W.

**The sketch:**

```cpp
// Energy detective
#include <Adafruit_INA219.h>
#include <Wire.h>
#include <Adafruit_GFX.h>
#include <Adafruit_SSD1306.h>
Adafruit_SSD1306 oled(128, 64, &Wire, -1);
Adafruit_INA219 ina;
float mWh = 0;                       // energy counter
unsigned long last = 0;

void setup() {
  Serial.begin(9600);
  pinMode(13, OUTPUT);
  oled.begin(SSD1306_SWITCHCAPVCC, 0x3C);
  oled.setTextColor(SSD1306_WHITE);
  if (!ina.begin()) { Serial.println("INA219 not found"); while (1); }
  last = millis();
}

void loop() {
  float V = ina.getBusVoltage_V(), mA = ina.getCurrent_mA(), mW = ina.getPower_mW();
  unsigned long now = millis();
  mWh += mW * (now - last) / 3600000.0;   // power x time
  last = now;

  oled.clearDisplay();
  oled.setTextSize(1); oled.setCursor(0, 0); oled.print("ENERGY DETECTIVE");
  oled.setCursor(0, 14); oled.print(V, 2); oled.print(" V   "); oled.print(mA, 0); oled.print(" mA");
  oled.setTextSize(2); oled.setCursor(0, 28); oled.print(mW, 0); oled.print(" mW");
  oled.setTextSize(1); oled.setCursor(0, 52); oled.print(mWh, 3); oled.print(" mWh");
  oled.display();
  digitalWrite(13, mW > 1000);
  if (mW > 1000) tone(8, 1500, 50);
  Serial.print(mW, 0); Serial.println(" mW");
  delay(500);
}
```


#### YI-28 · Python Control Panel for Arduino

**Unit:** Robots & Mechanisms · **Phase:** Phase 2 · **Domain:** Programming & Logic

Real machines have control panels on a computer screen.

**What it does:** The Arduino obeys short text commands (L1, L0, S90, R) so a Python app can control it.

**Kit for this activity:**

| Part | How many | Issued | Note |
|---|---|---|---|
| Arduino Uno + USB cable | 1 | per group |  |
| LED 5 mm (assorted) | 2 | per group |  |
| Resistor 220 ohm | 2 | per group |  |
| Servo SG90 | 1 | per group |  |
| LDR module | 1 | per group |  |
| Breadboard (half size) | 1 | per group |  |
| Jumper wires M-M | 10 | per group |  |
| Laptop | 1 | per group |  |
| Buzzer | 1 | per group | Added: every Arduino class |

**Board:** Arduino Uno

**Wiring (as Circuit Lab builds it):**

- **LED**: color: green, signal → pin 13
- **Servo SG90**: PWM → pin 9
- **Light sensor (LDR)**: AO → pin A0
- **Buzzer**: signal → pin 8

**Things to try in the simulator:**

- In the Serial box send L1, then L0.
- Send S45 and S135: the servo moves.
- Send R to read the light sensor. Add B for a beep.

**The sketch:**

```cpp
// Command panel: Python (or you) sends text commands
#include <Servo.h>
Servo sv;

void setup() {
  Serial.begin(9600);
  pinMode(13, OUTPUT);
  sv.attach(9);
  Serial.println("Commands: L1 L0 S0-180 R B");
}

void loop() {
  if (Serial.available()) {
    String cmd = Serial.readStringUntil('\n');
    cmd.trim();
    char c = cmd.charAt(0);
    int n = cmd.substring(1).toInt();

    if (c == 'L')      { digitalWrite(13, n == 1); Serial.println("OK"); }
    else if (c == 'S') { sv.write(constrain(n, 0, 180)); Serial.println("OK"); }
    else if (c == 'R') Serial.println(analogRead(A0));
    else if (c == 'B') { tone(8, 1000, 200); Serial.println("OK"); }
    else               Serial.println("ERR");
  }
}
```


#### YI-29 · p5.js: Flappy Voice Game

**Unit:** AI & the Web · **Phase:** Phase 2 · **Domain:** App, Web & Game Development

Some games are controlled by your voice.

**Kit for this activity:**

| Part | How many | Issued | Note |
|---|---|---|---|
| Laptop | 1 | per group |  |


#### YI-30 · Python Weather API Dashboard

**Unit:** AI & the Web · **Phase:** Phase 2 · **Domain:** IoT & Communication

Weather apps fetch data from online services called APIs.

**Kit for this activity:**

| Part | How many | Issued | Note |
|---|---|---|---|
| Laptop | 1 | per group |  |


#### YI-31 · Sign Language Alphabet Recogniser

**Unit:** AI & the Web · **Phase:** Phase 2 · **Domain:** AI & Data

AI can help people communicate.

**Kit for this activity:**

| Part | How many | Issued | Note |
|---|---|---|---|
| Laptop | 1 | per group |  |
| Webcam | 1 | per group | Or built-in camera |


#### YI-32 · Build Your Own Game Controller

**Unit:** AI & the Web · **Phase:** Phase 2 · **Domain:** App, Web & Game Development

Game companies design custom controllers for special games.

**What it does:** A joystick and two buttons send x,y,A,B 50 times a second for a computer game.

**Kit for this activity:**

| Part | How many | Issued | Note |
|---|---|---|---|
| Arduino Uno + USB cable | 1 | per group |  |
| Joystick module | 1 | per group |  |
| Push button | 2 | per group |  |
| Resistor 10k ohm | 2 | per group |  |
| MPU6050 IMU | 1 | per group |  |
| Breadboard (half size) | 1 | per group |  |
| Jumper wires M-M | 10 | per group |  |
| Jumper wires M-F | 9 | per group |  |
| Laptop | 1 | per group |  |
| LED 5 mm (assorted) | 1 | per group | Added: every Arduino class |
| Resistor 220 ohm | 1 | per group | Added: for the LED |
| Buzzer | 1 | per group | Added: every Arduino class |

**Board:** Arduino Uno

**Wiring (as Circuit Lab builds it):**

- **Joystick**: HORZ → pin A0, VERT → pin A1
- **Push button**: signal → pin 2, color: red
- **Push button**: signal → pin 3, color: blue
- **LED**: color: green, signal → pin 13

**Things to try in the simulator:**

- Open Serial and Graph, then drag the joystick.
- Press A and B: the third and fourth numbers become 1.
- Light the LED while A is pressed.

**The sketch:**

```cpp
// Game controller
void setup() {
  Serial.begin(115200);
  pinMode(2, INPUT_PULLUP);       // button A
  pinMode(3, INPUT_PULLUP);       // button B
  pinMode(13, OUTPUT);
}

void loop() {
  Serial.print(analogRead(A0));  Serial.print(',');   // x
  Serial.print(analogRead(A1));  Serial.print(',');   // y
  Serial.print(!digitalRead(2)); Serial.print(',');   // A: 1 = pressed
  Serial.println(!digitalRead(3));                    // B
  digitalWrite(13, !digitalRead(2));
  delay(20);                                          // 50 times a second
}
```


### TL · Tech Leaders (ages 15-17)

36 activities. Foundation: 4 · Phase 1: 16 · Phase 2: 16

#### F-00 (TL) · Welcome to Robotics (Distance Alarm)

**Unit:** Foundation & intro · **Phase:** Foundation · **Domain:** Foundation

**What it does:** Like a car parking sensor: when something comes closer than 20 cm the LED lights and the buzzer sounds.

**Kit for this activity:**

| Part | How many | Issued | Note |
|---|---|---|---|
| Arduino Uno + USB cable | 1 | per group |  |
| Ultrasonic sensor HC-SR04 | 1 | per group |  |
| LED 5 mm (assorted) | 1 | per group | Red |
| Resistor 220 ohm | 1 | per group |  |
| Buzzer | 1 | per group |  |
| Breadboard (half size) | 1 | per group |  |
| Jumper wires M-M | 6 | per group |  |
| Laptop | 1 | per group |  |

**Board:** Arduino Uno

**Wiring (as Circuit Lab builds it):**

- **Ultrasonic HC-SR04**: TRIG → pin 9, ECHO → pin 10
- **LED**: color: red, signal → pin 13
- **Buzzer**: signal → pin 8

**Things to try in the simulator:**

- Click the ultrasonic sensor and move the distance slider below 20 cm.
- Open the Serial tab to see the distance.
- Change ALARM_CM to 40 and test again.

**The sketch:**

```cpp
// Distance Alarm: like a car parking sensor
const int TRIG = 9, ECHO = 10, LED = 13, BUZZ = 8;
int ALARM_CM = 20;                    // <-- change me!

void setup() {
  pinMode(TRIG, OUTPUT);  pinMode(ECHO, INPUT);
  pinMode(LED, OUTPUT);   pinMode(BUZZ, OUTPUT);
  Serial.begin(9600);
}

void loop() {
  digitalWrite(TRIG, HIGH); delayMicroseconds(10);
  digitalWrite(TRIG, LOW);                 // SENSE: send a sound pulse
  long cm = pulseIn(ECHO, HIGH, 30000) / 58;
  Serial.println(cm);                      // see the distance

  if (cm > 0 && cm < ALARM_CM) {           // THINK: too close?
    digitalWrite(LED, HIGH);               // ACT: light on
    digitalWrite(BUZZ, HIGH);              //      and beep
  } else {
    digitalWrite(LED, LOW);
    digitalWrite(BUZZ, LOW);
  }
  delay(100);
}
```


#### F-01 (TL) · Arduino Uno Basics

**Unit:** Foundation & intro · **Phase:** Foundation · **Domain:** Foundation

**What it does:** Output, input and analog in one circuit: the knob sets the blink speed and the button beeps.

**Kit for this activity:**

| Part | How many | Issued | Note |
|---|---|---|---|
| Arduino Uno + USB cable | 1 | per group |  |
| LED 5 mm (assorted) | 2 | per group |  |
| Resistor 220 ohm | 2 | per group |  |
| Push button | 1 | per group | INPUT_PULLUP demo |
| Potentiometer 10k | 1 | per group | Analog input demo |
| Breadboard (half size) | 1 | per group |  |
| Jumper wires M-M | 8 | per group |  |
| Laptop | 1 | per group |  |
| Buzzer | 1 | per group | Added: every Arduino class |

**Board:** Arduino Uno

**Wiring (as Circuit Lab builds it):**

- **LED**: color: green, signal → pin 13
- **Push button**: signal → pin 2
- **Potentiometer**: signal → pin A0
- **Buzzer**: signal → pin 8

**Things to try in the simulator:**

- Turn the knob while it runs: the LED blinks faster or slower.
- Hold the button: the buzzer beeps.
- Open Serial to see the blink time in milliseconds.

**The sketch:**

```cpp
// Arduino Uno basics: OUTPUT, INPUT and ANALOG
const int LED = 13, BUTTON = 2, KNOB = A0, BUZZER = 8;

void setup() {
  pinMode(LED, OUTPUT);              // an output
  pinMode(BUTTON, INPUT_PULLUP);     // an input (pressed = LOW)
  Serial.begin(9600);
}

void loop() {
  int knob = analogRead(KNOB);                 // 0 .. 1023
  int wait = map(knob, 0, 1023, 100, 1000);    // 0.1 .. 1 second
  Serial.print("Blink time: "); Serial.println(wait);

  digitalWrite(LED, HIGH); delay(wait);
  digitalWrite(LED, LOW);  delay(wait);

  if (digitalRead(BUTTON) == LOW) tone(BUZZER, 880, 150);
}
```


#### F-02 (TL) · ESP32 Basics

**Unit:** Foundation & intro · **Phase:** Foundation · **Domain:** Foundation

**What it does:** An ESP32 joins Wi-Fi, reads a knob and serves a web page where a phone switches the LED.

**Kit for this activity:**

| Part | How many | Issued | Note |
|---|---|---|---|
| ESP32 Dev Board + USB cable | 1 | per group | Data cable, not charge-only |
| LED 5 mm (assorted) | 1 | per group |  |
| Resistor 220 ohm | 1 | per group |  |
| Potentiometer 10k | 1 | per group | ADC demo |
| Breadboard (half size) | 2 | per group | ESP32 is wide: bridge 2 boards |
| Jumper wires M-M | 6 | per group |  |
| Jumper wires M-F | 4 | per group | Touch-pin demo |
| Laptop | 1 | per group |  |
| Android smartphone | 1 | per class | Wi-Fi / Bluetooth demo |

**Board:** ESP32 DevKit

**Wiring (as Circuit Lab builds it):**

- **LED**: color: blue, signal → pin 13
- **Potentiometer**: signal → pin 34

**Things to try in the simulator:**

- Start, then open the Phone tab: tap ON and OFF.
- Turn the knob and press Refresh on the page: the number changes (0 to 4095 on an ESP32).
- Change the page title to your own name.

**The sketch:**

```cpp
// ESP32 basics: Wi-Fi + a tiny web page
#include <WiFi.h>
#include <WebServer.h>

const int LED = 13, KNOB = 34;     // GPIO numbers
WebServer server(80);

void page() {
  String h = "<html><head><meta name=viewport content='width=device-width'>"
             "<style>body{font-family:sans-serif;text-align:center}a{display:inline-block;margin:8px;padding:12px 22px;border-radius:12px;background:#2E6BE6;color:#fff;text-decoration:none}</style></head><body>"
             "<h2>My ESP32</h2><p>Knob: <b>" + String(analogRead(KNOB)) + "</b></p>"
             "<p>LED is " + String(digitalRead(LED) ? "ON" : "OFF") + "</p>"
             "<a href='/on'>ON</a><a href='/off'>OFF</a><a href='/'>Refresh</a></body></html>";
  server.send(200, "text/html", h);
}

void setup() {
  pinMode(LED, OUTPUT);
  Serial.begin(115200);
  WiFi.begin("School-Lab", "password");
  while (WiFi.status() != WL_CONNECTED) { delay(300); Serial.print("."); }
  Serial.print("\nMy address: "); Serial.println(WiFi.localIP());
  server.on("/", page);
  server.on("/on", [] { digitalWrite(LED, HIGH); page(); });
  server.on("/off", [] { digitalWrite(LED, LOW); page(); });
  server.begin();
}

void loop() {
  server.handleClient();
}
```


#### F-03 (TL) · 3D Modelling and Printing

**Unit:** Foundation & intro · **Phase:** Foundation · **Domain:** Foundation

**Kit for this activity:**

| Part | How many | Issued | Note |
|---|---|---|---|
| Laptop | 1 | per group | Tinkercad in the browser |
| 3D printer | 1 | per class |  |
| PLA filament | 1 | per class | 1 spool |
| Screwdriver set | 1 | per class | Scraper / print removal |


#### TL-01 · Solar-Powered Off-Grid Weather Node

**Unit:** Power, Autonomy & Health · **Phase:** Phase 1 · **Domain:** Power & Energy

Remote weather stations in deserts and mountains run for months on solar power alone.

**What it does:** Every 10 s the node reads temperature, humidity and its battery voltage and posts them to the cloud (ThingSpeak).

**Kit for this activity:**

| Part | How many | Issued | Note |
|---|---|---|---|
| ESP32 Dev Board + USB cable | 1 | per group |  |
| Small solar panel | 1 | per group |  |
| TP4056 charger module | 1 | per group |  |
| 18650 cell + holder | 1 | per group |  |
| DHT22 sensor | 1 | per group |  |
| Digital multimeter | 1 | per group |  |
| Resistor 10k ohm | 2 | per group | Voltage divider |
| Breadboard (half size) | 1 | per group |  |
| Jumper wires M-M | 10 | per group |  |
| Jumper wires M-F | 4 | per group |  |
| Laptop | 1 | per group |  |

**Board:** ESP32 DevKit

**Wiring (as Circuit Lab builds it):**

- **DHT22 temp & humidity**: SDA → pin 4
- **Voltage sensor 0-25V**: S → pin 34, with: [object Object]

**Things to try in the simulator:**

- Start, then watch Serial and the Network log in the Phone tab.
- Change the DHT22 temperature: the next upload shows it.
- Real nodes deep-sleep for 10 minutes between readings to save the battery.

**The sketch:**

```cpp
// Off-grid weather node
#include <WiFi.h>
#include <HTTPClient.h>
#include <DHT.h>
DHT dht(4, DHT22);
String KEY = "YOUR_WRITE_KEY";
int bootCount = 0;

void sendData(float t, float h, float vbat) {
  HTTPClient http;
  String url = "http://api.thingspeak.com/update?api_key=" + KEY +
               "&field1=" + String(t, 1) + "&field2=" + String(h, 0) + "&field3=" + String(vbat, 2);
  http.begin(url);
  int code = http.GET();
  Serial.printf("Upload %d: %.1f C  %.0f %%  %.2f V  -> HTTP %d\n", bootCount, t, h, vbat, code);
  http.end();
}

void setup() {
  Serial.begin(115200);
  dht.begin();
  WiFi.begin("SchoolWiFi", "password");
  while (WiFi.status() != WL_CONNECTED) delay(300);
}

void loop() {
  bootCount++;
  float t = dht.readTemperature(), h = dht.readHumidity();
  float vbat = analogReadMilliVolts(34) * 5 / 1000.0;   // undo the 5:1 sensor
  sendData(t, h, vbat);
  if (vbat < 3.4) Serial.println("Battery low: sleep longer!");
  delay(10000);            // on the real node: esp_deep_sleep(600e6)
}
```


#### TL-02 · Autonomous Maze Solving Robot

**Unit:** Power, Autonomy & Health · **Phase:** Phase 1 · **Domain:** Robotics & Actuation

Rescue robots must find their way through unknown buildings without a map.

**What it does:** Three ultrasonic sensors (left, front, right) and a PID wall-follower: keep 12 cm from the left wall, turn at openings, U-turn at dead ends.

**Kit for this activity:**

| Part | How many | Issued | Note |
|---|---|---|---|
| Arduino Uno + USB cable | 1 | per group |  |
| 2WD robot chassis kit | 1 | per group |  |
| L298N motor driver | 1 | per group |  |
| Ultrasonic sensor HC-SR04 | 3 | per group |  |
| 4xAA battery pack | 1 | per group |  |
| Screwdriver set | 1 | per group |  |
| Cardboard sheet | 4 | per class | Maze walls |
| Jumper wires M-F | 14 | per group |  |
| Jumper wires M-M | 10 | per group |  |
| Laptop | 1 | per group |  |
| LED 5 mm (assorted) | 1 | per group | Added: every Arduino class |
| Resistor 220 ohm | 1 | per group | Added: for the LED |
| Buzzer | 1 | per group | Added: every Arduino class |

**Board:** Arduino Uno

**Wiring (as Circuit Lab builds it):**

- **Ultrasonic HC-SR04**: label: Left, TRIG → pin A0, ECHO → pin A1
- **Ultrasonic HC-SR04**: label: Front, TRIG → pin A2, ECHO → pin A3
- **Ultrasonic HC-SR04**: label: Right, TRIG → pin 10, ECHO → pin 11
- **L298N motor driver**: ENA → pin 5, IN1 → pin 4, IN2 → pin 7, ENB → pin 6, IN3 → pin 8, IN4 → pin 12, with: [object Object]

**Things to try in the simulator:**

- Set Left = 12, Front = 60: the robot drives straight.
- Set Left = 6 (too close): watch the wheels steer away (Serial shows the error).
- Set Front = 8 and Right = 50: it turns right.

**The sketch:**

```cpp
// Maze solver: left-wall follower with PID
const int ENA = 5, IN1 = 4, IN2 = 7;   // left motor
const int ENB = 6, IN3 = 8, IN4 = 12;  // right motor
const int TL = A0, EL = A1, TF = A2, EF = A3, TR = 10, ER = 11;
float Kp = 4.0, Ki = 0.0, Kd = 1.5;   // start values, then tune
const float TARGET = 12;              // cm from the left wall
const int BASE = 150;
float integral = 0, lastError = 0;

long readCm(int trig, int echo) {
  digitalWrite(trig, LOW);  delayMicroseconds(2);
  digitalWrite(trig, HIGH); delayMicroseconds(10);
  digitalWrite(trig, LOW);
  long us = pulseIn(echo, HIGH, 25000);   // give up after 25 ms
  if (us == 0) return 400;                // no echo = far away
  return us / 58;
}
void drive(int left, int right) {           // -255 .. 255
  digitalWrite(IN1, left >= 0);  digitalWrite(IN2, left < 0);
  analogWrite(ENA, constrain(abs(left), 0, 255));
  digitalWrite(IN3, right >= 0); digitalWrite(IN4, right < 0);
  analogWrite(ENB, constrain(abs(right), 0, 255));
}
void turnLeft()  { drive(-150, 150); delay(350); }
void turnRight() { drive(150, -150); delay(350); }
void uTurn()     { drive(150, -150); delay(700); }

void setup() {
  int outs[] = {ENA, IN1, IN2, ENB, IN3, IN4, TL, TF, TR};
  for (int i = 0; i < 9; i++) pinMode(outs[i], OUTPUT);
  pinMode(EL, INPUT); pinMode(EF, INPUT); pinMode(ER, INPUT);
  Serial.begin(9600);
}

void loop() {
  long L = readCm(TL, EL); delay(10);    // one at a time:
  long F = readCm(TF, EF); delay(10);    // avoids crosstalk
  long R = readCm(TR, ER);

  if (L > 30)      { turnLeft();  return; }   // opening on the left
  if (F < 12) {
    if (R > 30)    { turnRight(); return; }
    uTurn(); return;                          // dead end
  }
  float error = TARGET - L;               // + means too close
  integral = constrain(integral + error, -50, 50);
  float derivative = error - lastError;
  lastError = error;
  float corr = Kp * error + Ki * integral + Kd * derivative;
  drive(BASE + corr, BASE - corr);        // steer away / towards
  Serial.println(error);                  // for the graph
}
```


#### TL-03 · Pick-and-Place Robotic Arm with Record & Replay

**Unit:** Power, Autonomy & Health · **Phase:** Phase 1 · **Domain:** Mechanical Design

Factory robots are taught a task once by an operator and then repeat it thousands of times.

**What it does:** Four knobs move four servos. REC saves the pose in EEPROM; PLAY repeats every saved pose in order.

**Kit for this activity:**

| Part | How many | Issued | Note |
|---|---|---|---|
| Arduino Uno + USB cable | 1 | per group |  |
| Servo MG995 | 2 | per group | Base and shoulder |
| Servo SG90 | 2 | per group | Wrist and gripper |
| Potentiometer 10k | 4 | per group |  |
| Push button | 2 | per group |  |
| Resistor 10k ohm | 2 | per group |  |
| LM2596 buck converter | 1 | per group | Servo supply |
| 4xAA battery pack | 1 | per group |  |
| Cardboard sheet | 2 | per group | Arm structure |
| Breadboard (half size) | 1 | per group |  |
| Jumper wires M-M | 16 | per group |  |
| Jumper wires M-F | 6 | per group |  |
| Laptop | 1 | per group |  |
| LED 5 mm (assorted) | 1 | per group | Added: every Arduino class |
| Resistor 220 ohm | 1 | per group | Added: for the LED |
| Buzzer | 1 | per group | Added: every Arduino class |

**Board:** Arduino Uno

**Wiring (as Circuit Lab builds it):**

- **Potentiometer**: signal → pin A0
- **Potentiometer**: signal → pin A1
- **Potentiometer**: signal → pin A2
- **Potentiometer**: signal → pin A3
- **Push button**: signal → pin 2, color: red
- **Push button**: signal → pin 4, color: green
- **Servo SG90**: label: Base, PWM → pin 3
- **Servo SG90**: label: Shoulder, PWM → pin 5
- **Servo SG90**: label: Elbow, PWM → pin 6
- **Servo SG90**: label: Gripper, PWM → pin 9

**Things to try in the simulator:**

- Turn the knobs: each servo follows its knob.
- Press REC (red) for 3 different poses, then press PLAY (green).
- Hold both buttons for 2 s to erase.

**The sketch:**

```cpp
// Robot arm: record and replay
#include <Servo.h>
#include <EEPROM.h>
Servo joint[4];
const byte SERVO_PIN[4] = {3, 5, 6, 9};
const byte POT_PIN[4]   = {A0, A1, A2, A3};
const byte MIN_A[4] = {0, 30, 0, 20};          // safe limits
const byte MAX_A[4] = {180, 150, 180, 110};    // (gripper!)
const byte REC = 2, PLAY = 4;                  // buttons to GND (pressed = LOW)
byte angle[4];
byte count = 0;                                // poses saved

void readKnobs() {
  for (int i = 0; i < 4; i++) {
    angle[i] = map(analogRead(POT_PIN[i]), 0, 1023, MIN_A[i], MAX_A[i]);
    joint[i].write(angle[i]);
  }
}
void recordPose() {
  if (count >= 50) return;                    // memory full
  for (int i = 0; i < 4; i++) EEPROM.update(1 + count * 4 + i, angle[i]);
  count++;
  EEPROM.update(0, count);
  Serial.print("Saved pose "); Serial.println(count);
  digitalWrite(LED_BUILTIN, HIGH); delay(300); digitalWrite(LED_BUILTIN, LOW);
}
void replay() {
  for (int p = 0; p < count; p++) {
    for (int i = 0; i < 4; i++) joint[i].write(EEPROM.read(1 + p * 4 + i));
    Serial.print("Pose "); Serial.println(p + 1);
    delay(800);
  }
}

void setup() {
  for (int i = 0; i < 4; i++) joint[i].attach(SERVO_PIN[i]);
  pinMode(REC, INPUT_PULLUP); pinMode(PLAY, INPUT_PULLUP);
  pinMode(LED_BUILTIN, OUTPUT);
  Serial.begin(9600);
  count = EEPROM.read(0); if (count > 50) count = 0;
}

void loop() {
  bool rec = digitalRead(REC) == LOW, play = digitalRead(PLAY) == LOW;
  readKnobs();
  if (rec && play) { delay(2000); count = 0; EEPROM.update(0, 0); Serial.println("Erased"); }
  else if (rec)    { recordPose(); delay(400); }
  else if (play)   { replay(); }
  delay(15);
}
```


#### TL-04 · Fall Detection Wearable for the Elderly

**Unit:** Power, Autonomy & Health · **Phase:** Phase 1 · **Domain:** Sensors & Environment

Falls are a leading cause of injury for older people, especially those living alone.

**What it does:** A state machine watches the MPU6050: a hard impact, then lying still = fall. A 10-second countdown lets the wearer cancel before the alert is sent.

**Kit for this activity:**

| Part | How many | Issued | Note |
|---|---|---|---|
| ESP32 Dev Board + USB cable | 1 | per group |  |
| MPU6050 IMU | 1 | per group |  |
| Buzzer | 1 | per group |  |
| Push button | 1 | per group |  |
| Resistor 10k ohm | 1 | per group |  |
| 18650 cell + holder | 1 | per group | Wearable power |
| Breadboard (half size) | 1 | per group |  |
| Jumper wires M-M | 8 | per group |  |
| Jumper wires M-F | 6 | per group |  |
| Laptop | 1 | per group |  |

**Board:** ESP32 DevKit

**Wiring (as Circuit Lab builds it):**

- **MPU6050 motion**: SDA and SCL (A4 and A5 on an Uno, 21 and 22 on an ESP32), address 104
- **Buzzer**: signal → pin 25
- **Push button**: signal → pin 26
- **LED**: color: red, signal → pin 2

**Things to try in the simulator:**

- Click the MPU6050: set Accel Z to 20 (impact), then Tilt Y to 9.8 and Z to 0 (lying down).
- Wait: the countdown beeps. Press the button to cancel.
- Let it finish: the alert appears in the Network log.

**The sketch:**

```cpp
// Fall detection wearable
#include <Adafruit_MPU6050.h>
#include <WiFi.h>
#include <HTTPClient.h>
Adafruit_MPU6050 mpu;
const int BUZZ = 25, BTN = 26, LED = 2;
enum State { NORMAL, IMPACT, ALARM };
State state = NORMAL;
unsigned long tEvent = 0;
float moveSum = 0; int samples = 0;

float readG(float &tilt) {                // returns |a| in g
  sensors_event_t a, g, t;
  mpu.getEvent(&a, &g, &t);
  float x = a.acceleration.x / 9.81, y = a.acceleration.y / 9.81, z = a.acceleration.z / 9.81;
  float mag = sqrt(x * x + y * y + z * z);
  tilt = acos(constrain(z / mag, -1.0, 1.0)) * 180 / PI;   // angle from flat-upright
  return mag;
}
void alert() {
  HTTPClient http;
  http.begin("http://api.callmebot.com/whatsapp.php?text=FALL+DETECTED");
  int code = http.GET();
  Serial.printf("Alert sent, HTTP %d\n", code);
  http.end();
}
void countdown() {
  for (int s = 10; s > 0; s--) {
    Serial.printf("Fall! Alert in %d s (press to cancel)\n", s);
    tone(BUZZ, 2000, 150); digitalWrite(LED, HIGH); delay(250); digitalWrite(LED, LOW);
    for (int i = 0; i < 75; i++) { if (digitalRead(BTN) == LOW) { Serial.println("Cancelled"); state = NORMAL; return; } delay(10); }
  }
  alert(); state = NORMAL;
}

void setup() {
  Serial.begin(115200);
  pinMode(BUZZ, OUTPUT); pinMode(LED, OUTPUT);
  pinMode(BTN, INPUT_PULLUP);            // pressed = LOW
  if (!mpu.begin()) { Serial.println("No MPU6050!"); while (1); }
  mpu.setAccelerometerRange(MPU6050_RANGE_8_G);
  WiFi.begin("SchoolWiFi", "password");
}

void loop() {
  float tilt, g = readG(tilt);
  switch (state) {
    case NORMAL:
      if (g > 1.8) { state = IMPACT; tEvent = millis(); moveSum = 0; samples = 0; Serial.println("Impact!"); }
      break;
    case IMPACT:                                   // watch for 2 s
      if (millis() - tEvent > 1000) { moveSum += fabs(g - 1.0); samples++; }
      if (millis() - tEvent > 2000) {
        bool still = samples > 0 && moveSum / samples < 0.15;
        bool lying = tilt > 60;
        state = (still && lying) ? ALARM : NORMAL;
        if (state == NORMAL) Serial.println("Got up: no alarm");
      }
      break;
    case ALARM: countdown(); break;
  }
  delay(20);
}
```


#### TL-05 · ESP-NOW Wireless Sensor Network

**Unit:** Connected Systems · **Phase:** Phase 1 · **Domain:** IoT & Communication

Smart buildings use many small wireless sensors that report to one central hub.

**What it does:** A sensor node reads temperature, light and sound and broadcasts them with ESP-NOW every 2 s. Its OLED shows what it sends.

**Kit for this activity:**

| Part | How many | Issued | Note |
|---|---|---|---|
| ESP32 Dev Board + USB cable | 4 | per group | 3 nodes + base (can pair groups) |
| DHT22 sensor | 1 | per group |  |
| LDR module | 1 | per group |  |
| Sound sensor KY-037 | 1 | per group |  |
| OLED 0.96 in I2C | 1 | per group |  |
| Breadboard (half size) | 4 | per group |  |
| Jumper wires M-M | 16 | per group |  |
| Jumper wires M-F | 8 | per group |  |
| Laptop | 1 | per group |  |

**Board:** ESP32 DevKit

**Wiring (as Circuit Lab builds it):**

- **DHT22 temp & humidity**: SDA → pin 4
- **Light sensor (LDR)**: AO → pin 34
- **Sound sensor KY-037**: AO → pin 35
- **OLED 0.96" I2C**: SDA and SCL (A4 and A5 on an Uno, 21 and 22 on an ESP32), address 60

**Things to try in the simulator:**

- Start and open the Phone tab: every packet appears in the Network log.
- Change NODE_ID to 2 or 3 to send light or sound instead.
- Send a packet back from the Phone tab: the node shows it.

**The sketch:**

```cpp
// ESP-NOW sensor node
#include <esp_now.h>
#include <WiFi.h>
#include <DHT.h>
#include <Wire.h>
#include <Adafruit_GFX.h>
#include <Adafruit_SSD1306.h>
Adafruit_SSD1306 oled(128, 64, &Wire, -1);
#define NODE_ID 1   // 1 temp, 2 light, 3 sound
uint8_t BASE[] = {0x24, 0x6F, 0x28, 0xA1, 0xB2, 0xC3};
typedef struct { uint8_t id; float value; uint32_t seq; } Msg;
Msg m;
DHT dht(4, DHT22);
String lastIn = "-";

float soundLevel() {          // peak-to-peak over 50 ms
  int lo = 4095, hi = 0; unsigned long t = millis();
  while (millis() - t < 50) { int v = analogRead(35); lo = min(lo, v); hi = max(hi, v); }
  return hi - lo;
}
void onRecv(const uint8_t *mac, const uint8_t *data, int len) {
  lastIn = ""; for (int i = 0; i < len; i++) lastIn += (char)data[i];
}

void setup() {
  Serial.begin(115200);
  dht.begin();
  oled.begin(SSD1306_SWITCHCAPVCC, 0x3C);
  oled.setTextColor(SSD1306_WHITE);
  WiFi.mode(WIFI_STA);
  esp_now_init();
  esp_now_register_recv_cb(onRecv);
  esp_now_peer_info_t p = {};
  memcpy(p.peer_addr, BASE, 6);  // the base's MAC
  esp_now_add_peer(&p);
  m.id = NODE_ID;
}

void loop() {
  if (NODE_ID == 1) m.value = dht.readTemperature();
  if (NODE_ID == 2) m.value = analogRead(34);
  if (NODE_ID == 3) m.value = soundLevel();
  m.seq++;                                  // packet number
  esp_now_send(BASE, (uint8_t*)&m, sizeof(m));
  Serial.printf("sent #%lu  node %d  value %.1f\n", (unsigned long)m.seq, m.id, m.value);

  oled.clearDisplay();
  oled.setTextSize(1); oled.setCursor(0, 0); oled.print("NODE "); oled.print(NODE_ID); oled.print("  ESP-NOW");
  oled.setTextSize(2); oled.setCursor(0, 18); oled.print(m.value, 1);
  oled.setTextSize(1); oled.setCursor(0, 40); oled.print("packet #"); oled.print(m.seq);
  oled.setCursor(0, 54); oled.print("in: "); oled.print(lastIn);
  oled.display();
  delay(2000);
}
```


#### TL-06 · Smart Home Cloud Control Hub

**Unit:** Connected Systems · **Phase:** Phase 1 · **Domain:** IoT & Communication

Smart homes let people control lights and appliances from anywhere and automate them with rules.

**What it does:** An ESP32 hub on MQTT: it publishes temperature and motion and obeys commands for 4 relays (fan and light). Rules run at the edge.

**Kit for this activity:**

| Part | How many | Issued | Note |
|---|---|---|---|
| ESP32 Dev Board + USB cable | 1 | per group |  |
| Relay module (4-channel) | 1 | per group |  |
| PIR motion sensor | 1 | per group |  |
| DHT22 sensor | 1 | per group |  |
| Low-voltage LED lamp (5 V) | 2 | per group |  |
| 5 V DC fan | 1 | per group |  |
| Breadboard (half size) | 1 | per group |  |
| Jumper wires M-M | 10 | per group |  |
| Jumper wires M-F | 12 | per group |  |
| Laptop | 1 | per group |  |

**Board:** ESP32 DevKit

**Wiring (as Circuit Lab builds it):**

- **Relay module**: attrs: [object Object], sim: [object Object], IN1 → pin 16, IN2 → pin 17, IN3 → pin 18, IN4 → pin 19, with: [object Object]
- **PIR motion sensor**: OUT → pin 27
- **DHT22 temp & humidity**: SDA → pin 4

**Things to try in the simulator:**

- Raise the DHT22 above 30 °C: the fan (relay 1) turns on.
- Wave at the PIR: the light (relay 2) follows motion.
- In the Phone tab publish topic pakturk/team7/cmd/relay/1 with message 1.

**The sketch:**

```cpp
// Smart home hub (MQTT)
#include <WiFi.h>
#include <PubSubClient.h>
#include <DHT.h>
#define T "pakturk/team7/"              // UNIQUE prefix!
const int RELAY[4] = {16, 17, 18, 19};  // active LOW
#define PIR 27
WiFiClient net;  PubSubClient mqtt(net);
DHT dht(4, DHT22);
bool manual = false;                    // override flag
unsigned long lastTry = 0, lastPub = 0;

void setRelay(int i, bool on) {
  digitalWrite(RELAY[i], on ? LOW : HIGH);    // LOW = ON
  mqtt.publish((String(T) + "relay/" + i).c_str(), on ? "1" : "0", true);
}
void keepConnected() {
  if (mqtt.connected() || millis() - lastTry < 5000) return;
  lastTry = millis();
  if (WiFi.status() != WL_CONNECTED) { WiFi.reconnect(); return; }
  if (mqtt.connect("hub-team7", T "status", 1, true, "offline")) {
    mqtt.publish(T "status", "online", true);
    mqtt.subscribe(T "cmd/#");
  }
}
void onMessage(char* topic, byte* payload, unsigned int len) {
  String t = topic, msg;
  for (unsigned int i = 0; i < len; i++) msg += (char)payload[i];
  if (t == T "cmd/mode") manual = (msg != "auto");
  for (int i = 0; i < 4; i++) if (t == String(T "cmd/relay/") + i) { manual = true; setRelay(i, msg == "1"); }
}

void setup() {
  Serial.begin(115200);
  for (int i = 0; i < 4; i++) { pinMode(RELAY[i], OUTPUT); digitalWrite(RELAY[i], HIGH); }   // all OFF
  pinMode(PIR, INPUT);
  dht.begin();
  WiFi.begin("SchoolLab", "password");
  mqtt.setServer("broker.hivemq.com", 1883);
  mqtt.setCallback(onMessage);
}

void loop() {
  keepConnected();
  mqtt.loop();
  if (millis() - lastPub < 3000) return;
  lastPub = millis();
  float t = dht.readTemperature();
  bool motion = digitalRead(PIR);
  if (!isnan(t)) mqtt.publish(T "temp", String(t, 1).c_str());
  mqtt.publish(T "motion", motion ? "1" : "0");
  if (!manual) {                        // RULES run here, at the edge
    if (t > 30) setRelay(0, true);      // fan ON above 30
    if (t < 28) setRelay(0, false);     // fan OFF below 28
    setRelay(1, motion);                // light follows motion
  }
}
```


#### TL-07 · Smart Parking Occupancy Dashboard

**Unit:** Connected Systems · **Phase:** Phase 1 · **Domain:** Sensors & Environment

Drivers in busy cities waste time and fuel searching for parking.

**What it does:** Three bays, each with an ultrasonic sensor and red/green lights. A JSON API and a live web dashboard show which bays are free.

**Kit for this activity:**

| Part | How many | Issued | Note |
|---|---|---|---|
| ESP32 Dev Board + USB cable | 1 | per group |  |
| Ultrasonic sensor HC-SR04 | 3 | per group |  |
| LED 5 mm (assorted) | 6 | per group | 3 red, 3 green |
| Resistor 220 ohm | 6 | per group |  |
| Resistor 1k ohm | 3 | per group | Echo divider |
| Resistor 10k ohm | 3 | per group | Echo divider |
| Cardboard sheet | 2 | per group | Car park model |
| Breadboard (half size) | 1 | per group |  |
| Jumper wires M-M | 20 | per group |  |
| Jumper wires M-F | 12 | per group |  |
| Laptop | 1 | per group |  |

**Board:** ESP32 DevKit

**Wiring (as Circuit Lab builds it):**

- **Ultrasonic HC-SR04**: label: Bay 1, TRIG → pin 5, ECHO → pin 18
- **Ultrasonic HC-SR04**: label: Bay 2, TRIG → pin 19, ECHO → pin 21
- **Ultrasonic HC-SR04**: label: Bay 3, TRIG → pin 22, ECHO → pin 23
- **LED**: color: red, signal → pin 25
- **LED**: color: green, signal → pin 26
- **LED**: color: red, signal → pin 32
- **LED**: color: green, signal → pin 33
- **LED**: color: red, signal → pin 16
- **LED**: color: green, signal → pin 17

**Things to try in the simulator:**

- Set Bay 2 to 5 cm (a car): its light turns red after 3 readings.
- Open the Phone tab: the dashboard updates every 2 s.
- Open /status to see the raw JSON.

**The sketch:**

```cpp
// Smart parking dashboard
#include <WiFi.h>
#include <WebServer.h>
const int TRIG[3] = {5, 19, 22},  ECHO[3] = {18, 21, 23};
const int RED_[3] = {25, 32, 16}, GRN_[3] = {26, 33, 17};
const float LIMIT = 9.0;              // cm, from YOUR calibration
bool occ[3];  int agree[3];
unsigned long since[3], usedMs[3];
WebServer server(80);

const char PAGE[] PROGMEM = R"HTML(<html><head><meta name=viewport content='width=device-width'>
<style>body{font-family:sans-serif;padding:10px}.b{display:inline-block;width:28%;margin:1%;padding:14px 0;border-radius:12px;text-align:center;color:#fff;font-weight:700}</style></head>
<body><h2>Parking</h2><div id=bays></div><p id=free></p>
<script>function up(){fetch('/status').then(r=>r.json()).then(d=>{bays.innerHTML=d.bays.map(b=>'<div class=b style=background:'+(b.occupied?'#DC2626':'#16A34A')+'>Bay '+b.id+'<br>'+(b.occupied?'TAKEN':'FREE')+'</div>').join('');free.textContent=d.free+' free';})}up();setInterval(up,2000)</script></body></html>)HTML";

float readCm(int i) {
  digitalWrite(TRIG[i], LOW);  delayMicroseconds(2);
  digitalWrite(TRIG[i], HIGH); delayMicroseconds(10);
  digitalWrite(TRIG[i], LOW);
  long us = pulseIn(ECHO[i], HIGH, 25000);
  return us == 0 ? 999 : us / 58.0;
}
void updateBay(int i) {
  bool now = readCm(i) < LIMIT;
  if (now != occ[i]) agree[i]++; else agree[i] = 0;
  if (agree[i] >= 3) {                       // 3 in a row: believe it
    if (occ[i]) usedMs[i] += millis() - since[i];
    occ[i] = now;  since[i] = millis();  agree[i] = 0;
  }
  digitalWrite(RED_[i], occ[i]);
  digitalWrite(GRN_[i], !occ[i]);
}
void handleStatus() {
  int freeBays = 0;
  String j = "{\"bays\":[";
  for (int i = 0; i < 3; i++) {
    if (!occ[i]) freeBays++;
    j += "{\"id\":" + String(i + 1) + ",\"occupied\":" + (occ[i] ? "true" : "false") + "}";
    if (i < 2) j += ",";
  }
  j += "],\"free\":" + String(freeBays) + "}";
  server.send(200, "application/json", j);
}

void setup() {
  for (int i = 0; i < 3; i++) { pinMode(TRIG[i], OUTPUT); pinMode(ECHO[i], INPUT); pinMode(RED_[i], OUTPUT); pinMode(GRN_[i], OUTPUT); }
  Serial.begin(115200);
  WiFi.begin("SchoolLab", "password");
  while (WiFi.status() != WL_CONNECTED) delay(300);
  Serial.println(WiFi.localIP());
  server.on("/", [] { server.send_P(200, "text/html", PAGE); });
  server.on("/status", handleStatus);
  server.begin();
}

void loop() {
  server.handleClient();
  static unsigned long t = 0;  static int i = 0;
  if (millis() - t > 100) { t = millis(); updateBay(i); i = (i + 1) % 3; }
}
```


#### TL-08 · Two-Factor Smart Locker with Intrusion Alerts

**Unit:** Connected Systems · **Phase:** Phase 1 · **Domain:** Security & Safety

Banks and online accounts use two-factor authentication: something you have plus something you know.

**What it does:** Factor 1: the right RFID card. Factor 2: the PIN on the keypad. Three wrong PINs lock it out; motion while locked triggers an alert.

**Kit for this activity:**

| Part | How many | Issued | Note |
|---|---|---|---|
| ESP32 Dev Board + USB cable | 1 | per group |  |
| RFID RC522 + cards | 1 | per group |  |
| 4x4 matrix keypad | 1 | per group |  |
| Servo SG90 | 1 | per group |  |
| PIR motion sensor | 1 | per group |  |
| Buzzer | 1 | per group |  |
| OLED 0.96 in I2C | 1 | per group |  |
| Breadboard (half size) | 1 | per group |  |
| Jumper wires M-M | 12 | per group |  |
| Jumper wires M-F | 14 | per group |  |
| Laptop | 1 | per group |  |

**Board:** ESP32 DevKit

**Wiring (as Circuit Lab builds it):**

- **RFID reader RC522**: SDA → pin 5, RST → pin 17
- **Keypad 4×4**: R1 → pin 13, R2 → pin 14, R3 → pin 27, R4 → pin 26, C1 → pin 25, C2 → pin 33, C3 → pin 32, C4 → pin 15
- **Servo SG90**: label: Lock, PWM → pin 4
- **PIR motion sensor**: OUT → pin 34
- **Buzzer**: signal → pin 16
- **OLED 0.96" I2C**: SDA and SCL (A4 and A5 on an Uno, 21 and 22 on an ESP32), address 60

**Things to try in the simulator:**

- Tap the Blue tag, then type 4 8 2 6 #: the lock opens.
- Tap the White card: refused.
- Type the wrong PIN 3 times: locked out for 60 s.

**The sketch:**

```cpp
// Two-factor locker: RFID + PIN
#include <SPI.h>
#include <MFRC522.h>
#include <Keypad.h>
#include <ESP32Servo.h>
#include <WiFi.h>
#include <HTTPClient.h>
#include <Wire.h>
#include <Adafruit_GFX.h>
#include <Adafruit_SSD1306.h>
Adafruit_SSD1306 oled(128, 64, &Wire, -1);
#define PIR 34
#define BUZ 16
MFRC522 rfid(5, 17);                         // SS, RST
char keys[4][4] = {{'1','2','3','A'}, {'4','5','6','B'}, {'7','8','9','C'}, {'*','0','#','D'}};
byte rowPins[4] = {13, 14, 27, 26}, colPins[4] = {25, 33, 32, 15};
Keypad pad = Keypad(makeKeymap(keys), rowPins, colPins, 4, 4);
Servo lock;
const String OWNER_UID = "A3 5F 1C 2B";
const String OWNER_PIN = "4826";
enum State { LOCKED, WAIT_PIN, UNLOCKED, LOCKOUT };
State state = LOCKED;
String typed;  int wrong = 0;  unsigned long t0 = 0, lastTamper = 0;

void show(const char* msg) {
  oled.clearDisplay(); oled.setTextSize(1); oled.setCursor(0, 0); oled.print("SMART LOCKER");
  oled.setTextSize(2); oled.setCursor(0, 22); oled.print(msg);
  oled.setTextSize(1); oled.setCursor(0, 52); for (unsigned i = 0; i < typed.length(); i++) oled.print("* ");
  oled.display();
}
void beep(int n) { for (int i = 0; i < n; i++) { tone(BUZ, 400, 120); delay(180); } }
void logEvent(String e) { Serial.println(e); }
void alert(String e) { logEvent("ALERT: " + e); HTTPClient h; h.begin("http://api.callmebot.com/alert?text=" + e); h.GET(); h.end(); }
void go(State s, const char* msg) { state = s; t0 = millis(); typed = ""; show(msg); }
String readCard() {
  if (!rfid.PICC_IsNewCardPresent() || !rfid.PICC_ReadCardSerial()) return "";
  String uid;
  for (byte i = 0; i < rfid.uid.size; i++) { if (rfid.uid.uidByte[i] < 0x10) uid += "0"; uid += String(rfid.uid.uidByte[i], HEX); if (i < rfid.uid.size - 1) uid += " "; }
  uid.toUpperCase(); rfid.PICC_HaltA();
  return uid;
}
void checkTamper() {
  if (state == LOCKED && digitalRead(PIR) == HIGH && millis() - lastTamper > 10000) { lastTamper = millis(); alert("motion at locker"); }
}

void setup() {
  Serial.begin(115200);
  SPI.begin();  rfid.PCD_Init();
  oled.begin(SSD1306_SWITCHCAPVCC, 0x3C); oled.setTextColor(SSD1306_WHITE);
  lock.attach(4);  lock.write(0);            // start LOCKED
  pinMode(PIR, INPUT);  pinMode(BUZ, OUTPUT);
  WiFi.begin("SchoolLab", "password");
  go(LOCKED, "Tap card");
}

void loop() {
  char k = pad.getKey();
  if (state == LOCKED) {
    String uid = readCard();
    if (uid != "") {
      logEvent("card " + uid + (uid == OWNER_UID ? " OK" : " REFUSED"));
      if (uid == OWNER_UID) go(WAIT_PIN, "PIN + #"); else beep(3);
    }
  } else if (state == WAIT_PIN) {
    if (millis() - t0 > 15000) go(LOCKED, "Tap card");      // factor 1 expires
    else if (k >= '0' && k <= '9') { typed += k; show("PIN + #"); }
    else if (k == '#') {
      if (typed == OWNER_PIN) { wrong = 0; lock.write(90); logEvent("OPENED"); go(UNLOCKED, "OPEN"); }
      else if (++wrong >= 3) { alert("3 wrong PINs"); go(LOCKOUT, "WAIT 60s"); }
      else { beep(2); typed = ""; logEvent("wrong PIN"); show("Wrong PIN"); }
    }
  } else if (state == UNLOCKED && millis() - t0 > 5000) {
    lock.write(0); go(LOCKED, "Tap card");                  // auto relock
  } else if (state == LOCKOUT && millis() - t0 > 60000) {
    wrong = 0; go(LOCKED, "Tap card");
  }
  checkTamper();
}
```


#### TL-09 · Sensor Data Logging & Analysis Pipeline

**Unit:** Data, AI & Web · **Phase:** Phase 1 · **Domain:** AI & Data

Scientists and engineers make decisions from data, not guesses.

**What it does:** Every 2 s the ESP32 prints one CSV line: time, temperature, humidity, light and sound. Save it and analyse it in Python.

**Kit for this activity:**

| Part | How many | Issued | Note |
|---|---|---|---|
| ESP32 Dev Board + USB cable | 1 | per group |  |
| DHT22 sensor | 1 | per group |  |
| LDR module | 1 | per group |  |
| Sound sensor KY-037 | 1 | per group |  |
| Breadboard (half size) | 1 | per group |  |
| Jumper wires M-M | 8 | per group |  |
| Jumper wires M-F | 6 | per group |  |
| Laptop | 1 | per group |  |

**Board:** ESP32 DevKit

**Wiring (as Circuit Lab builds it):**

- **DHT22 temp & humidity**: SDA → pin 4
- **Light sensor (LDR)**: AO → pin 34
- **Sound sensor KY-037**: AO → pin 35

**Things to try in the simulator:**

- Open Serial: each line is one CSV row.
- Change the sensors while it runs and watch the numbers.
- Turn on Graph to see temperature and light together.

**The sketch:**

```cpp
// CSV data logger
#include <DHT.h>
DHT dht(4, DHT22);

void setup() {
  Serial.begin(115200);
  dht.begin();
  Serial.println("ms,temp_c,humidity,light,sound");
}

void loop() {
  float t = dht.readTemperature();
  float h = dht.readHumidity();
  int light = analogRead(34);          // 0..4095
  int lo = 4095, hi = 0;               // sound: peak-to-peak
  unsigned long start = millis();
  while (millis() - start < 50) { int v = analogRead(35); lo = min(lo, v); hi = max(hi, v); }
  Serial.printf("%lu,%.1f,%.1f,%d,%d\n", millis(), t, h, light, hi - lo);
  delay(2000);                         // DHT22 needs >= 2 s
}
```


#### TL-10 · Machine Learning Rain Predictor

**Unit:** Data, AI & Web · **Phase:** Phase 1 · **Domain:** AI & Data

Weather forecasters use models trained on past data to predict rain.

**What it does:** Collect temperature, humidity and a 'is it raining' label as CSV for training. A first hand-written rule guesses rain.

**Kit for this activity:**

| Part | How many | Issued | Note |
|---|---|---|---|
| ESP32 Dev Board + USB cable | 1 | per group |  |
| DHT22 sensor | 1 | per group |  |
| LDR module | 1 | per group |  |
| Rain sensor | 1 | per group |  |
| Breadboard (half size) | 1 | per group |  |
| Jumper wires M-M | 8 | per group |  |
| Jumper wires M-F | 6 | per group |  |
| Laptop | 1 | per group |  |

**Board:** ESP32 DevKit

**Wiring (as Circuit Lab builds it):**

- **DHT22 temp & humidity**: SDA → pin 4
- **Rain sensor**: DO → pin 27
- **LED**: color: blue, signal → pin 2

**Things to try in the simulator:**

- Open Serial: temp, humidity, wet, prediction.
- Raise humidity above 85 %: the rule predicts rain (blue LED).
- Add rain on the sensor: the label 'wet' becomes 1. Is the rule right?

**The sketch:**

```cpp
// Rain data collector + a simple rule
#include <DHT.h>
DHT dht(4, DHT22);
const int RAIN_DO = 27, LED = 2;   // rain sensor digital out

void setup() {
  Serial.begin(115200);
  dht.begin();
  pinMode(RAIN_DO, INPUT); pinMode(LED, OUTPUT);
  Serial.println("temp,humidity,wet,predicted");
}

void loop() {
  float t = dht.readTemperature();
  float h = dht.readHumidity();
  int wet = digitalRead(RAIN_DO) == LOW;     // LOW = water on pad
  int predicted = (h > 85 && t < 32);        // first rule: replace with your model
  digitalWrite(LED, predicted);
  if (!isnan(t) && !isnan(h)) Serial.printf("%.1f,%.1f,%d,%d\n", t, h, wet, predicted);
  delay(3000);
}
```


#### TL-11 · AI Fake News Detector

**Unit:** Data, AI & Web · **Phase:** Phase 1 · **Domain:** AI & Data

False news spreads faster than true news online, and platforms use AI to flag it.

**Kit for this activity:**

| Part | How many | Issued | Note |
|---|---|---|---|
| Laptop | 1 | per group |  |


#### TL-12 · Web-Controlled Devices via REST API

**Unit:** Data, AI & Web · **Phase:** Phase 1 · **Domain:** App, Web & Game Development

Behind every smart app is an API that lets programs talk to devices.

**What it does:** A REST API on the ESP32: GET /api/status returns JSON; POST /api/lamp switches the lamp. A phone page uses the API.

**Kit for this activity:**

| Part | How many | Issued | Note |
|---|---|---|---|
| ESP32 Dev Board + USB cable | 1 | per group |  |
| Relay module (1-channel) | 1 | per group |  |
| Low-voltage LED lamp (5 V) | 1 | per group |  |
| LED 5 mm (assorted) | 2 | per group |  |
| Resistor 220 ohm | 2 | per group |  |
| DHT22 sensor | 1 | per group |  |
| Breadboard (half size) | 1 | per group |  |
| Jumper wires M-M | 8 | per group |  |
| Jumper wires M-F | 6 | per group |  |
| Laptop | 1 | per group |  |

**Board:** ESP32 DevKit

**Wiring (as Circuit Lab builds it):**

- **Relay module**: IN → pin 23, with: [object Object]
- **LED**: color: blue, signal → pin 18
- **DHT22 temp & humidity**: SDA → pin 4

**Things to try in the simulator:**

- Start, open the Phone tab and tap the buttons.
- Open /api/status in the address bar to see the JSON.
- Add POST /api/led to switch the blue LED.

**The sketch:**

```cpp
// REST API on an ESP32
#include <WiFi.h>
#include <WebServer.h>
#include <DHT.h>
WebServer server(80);
DHT dht(4, DHT22);
const int RELAY = 23, LED = 18;
bool lamp = false;

void sendStatus() {
  String j = "{\"lamp\":" + String(lamp ? "true" : "false") + ",\"temp\":" + String(dht.readTemperature(), 1) + ",\"uptime\":" + String(millis() / 1000) + "}";
  server.send(200, "application/json", j);
}
void setLamp() {                         // POST /api/lamp  body: on=1
  if (!server.hasArg("on")) { server.send(400, "application/json", "{\"error\":\"missing on\"}"); return; }
  lamp = server.arg("on") == "1";
  digitalWrite(RELAY, lamp); digitalWrite(LED, lamp);
  sendStatus();
}
void notFound() { server.send(404, "application/json", "{\"error\":\"not found\"}"); }
void page() {
  server.send(200, "text/html",
    "<html><head><meta name=viewport content='width=device-width'><style>body{font-family:sans-serif;text-align:center;padding:10px}"
    "button{font-size:18px;margin:6px;padding:12px 20px;border:0;border-radius:12px;background:#2E6BE6;color:#fff}</style></head><body>"
    "<h2>Smart Lamp API</h2><p id=s>...</p><button onclick=\"set(1)\">ON</button><button onclick=\"set(0)\">OFF</button>"
    "<script>function show(d){s.textContent='Lamp '+(d.lamp?'ON':'OFF')+' | '+d.temp+' C | up '+d.uptime+' s'}"
    "function set(v){fetch('/api/lamp',{method:'POST',body:'on='+v}).then(r=>r.json()).then(show)}"
    "fetch('/api/status').then(r=>r.json()).then(show)</script></body></html>");
}

void setup() {
  Serial.begin(115200);  dht.begin();
  pinMode(RELAY, OUTPUT);  pinMode(LED, OUTPUT);
  WiFi.begin("SchoolLab", "password");
  while (WiFi.status() != WL_CONNECTED) delay(300);
  Serial.println(WiFi.localIP());          // write this down!
  server.on("/", page);
  server.on("/api/status", HTTP_GET,  sendStatus);
  server.on("/api/lamp",   HTTP_POST, setLamp);
  server.onNotFound(notFound);
  server.begin();
}
void loop() { server.handleClient(); }
```


#### TL-13 · Securing an IoT Device

**Unit:** Security, Robots & Product Design · **Phase:** Phase 1 · **Domain:** Security & Safety

Millions of smart devices are hacked every year because of weak passwords and unencrypted data.

**Kit for this activity:**

| Part | How many | Issued | Note |
|---|---|---|---|
| Laptop | 1 | per group |  |


#### TL-14 · Autonomous Fire-Fighting Robot

**Unit:** Security, Robots & Product Design · **Phase:** Phase 1 · **Domain:** Robotics & Actuation

Fire-fighting robots enter burning buildings so people do not have to.

**What it does:** Three flame sensors find the fire, the robot drives to it, then the fan (through a relay) blows it out while the servo sweeps.

**Kit for this activity:**

| Part | How many | Issued | Note |
|---|---|---|---|
| Arduino Uno + USB cable | 1 | per group |  |
| 2WD robot chassis kit | 1 | per group |  |
| L298N motor driver | 1 | per group |  |
| Flame sensor | 3 | per group |  |
| Servo SG90 | 1 | per group |  |
| Relay module (1-channel) | 1 | per group |  |
| 5 V DC fan | 1 | per group |  |
| 4xAA battery pack | 1 | per group |  |
| Candle | 1 | per class | Teacher only |
| Jumper wires M-F | 14 | per group |  |
| Jumper wires M-M | 10 | per group |  |
| Laptop | 1 | per group |  |
| LED 5 mm (assorted) | 1 | per group | Added: every Arduino class |
| Resistor 220 ohm | 1 | per group | Added: for the LED |
| Buzzer | 1 | per group | Added: every Arduino class |

**Board:** Arduino Uno

**Wiring (as Circuit Lab builds it):**

- **Flame sensor**: label: Left, AO → pin A0
- **Flame sensor**: label: Centre, AO → pin A1
- **Flame sensor**: label: Right, AO → pin A2
- **Servo SG90**: PWM → pin 3
- **Relay module**: IN → pin 4, with: [object Object]
- **Buzzer**: signal → pin 11
- **L298N motor driver**: ENA → pin 5, IN1 → pin 7, IN2 → pin 8, ENB → pin 6, IN3 → pin 9, IN4 → pin 10, with: [object Object]

**Things to try in the simulator:**

- No flame: the robot spins slowly (SEARCH).
- Give the Left sensor 60 %: it curves left (APPROACH).
- Give the Centre sensor 95 %: it stops and the fan blows (EXTINGUISH).

**The sketch:**

```cpp
// Fire-fighting robot
#include <Servo.h>
Servo sweep;
const int ENA = 5, IN1 = 7, IN2 = 8, IN3 = 9, IN4 = 10, ENB = 6;
const int FAN = 4, BUZ = 11;
const int SEE = 900, CLOSE = 250;      // from YOUR calibration (lower = stronger flame)
enum State { SEARCH, APPROACH, EXTINGUISH };
State state = SEARCH;

void drive(int l, int r) {             // -255 .. 255 per wheel
  digitalWrite(IN1, l > 0);  digitalWrite(IN2, l < 0);  analogWrite(ENA, abs(l));
  digitalWrite(IN3, r > 0);  digitalWrite(IN4, r < 0);  analogWrite(ENB, abs(r));
}

void setup() {
  for (int p = 4; p <= 11; p++) pinMode(p, OUTPUT);
  sweep.attach(3);
  Serial.begin(9600);
}

void loop() {
  int L = analogRead(A0), C = analogRead(A1), R = analogRead(A2);
  int best = min(C, min(L, R));               // smallest = strongest IR
  if (state == SEARCH) {
    drive(110, -110);                         // spin slowly
    if (best < SEE) state = APPROACH;
  } else if (state == APPROACH) {
    if (best > SEE)          state = SEARCH;  // lost it
    else if (C < CLOSE)      { drive(0, 0); state = EXTINGUISH; }
    else if (best == L)      drive(60, 160);  // curve left
    else if (best == R)      drive(160, 60);  // curve right
    else                     drive(150, 150); // straight on
  } else {                                    // EXTINGUISH
    digitalWrite(FAN, HIGH);  tone(BUZ, 1500, 100);
    for (int a = 60; a <= 120; a += 5) { sweep.write(a); delay(40); }
    for (int a = 120; a >= 60; a -= 5) { sweep.write(a); delay(40); }
    if (analogRead(A1) > SEE) { digitalWrite(FAN, LOW); state = SEARCH; }
  }
  Serial.println(state == SEARCH ? "SEARCH" : state == APPROACH ? "APPROACH" : "EXTINGUISH");
}
```


#### TL-15 · Parametric Robot Gripper Design

**Unit:** Security, Robots & Product Design · **Phase:** Phase 1 · **Domain:** Mechanical Design

Engineers use parametric CAD so one design can be resized instantly for different jobs.

**Kit for this activity:**

| Part | How many | Issued | Note |
|---|---|---|---|
| Laptop | 1 | per group |  |
| 3D printer | 1 | per class |  |
| PLA filament | 1 | per class |  |


#### TL-16 · Motion-Controlled Game

**Unit:** Security, Robots & Product Design · **Phase:** Phase 1 · **Domain:** App, Web & Game Development

Game consoles use controllers full of sensors.

**What it does:** The controller streams x, y, button A and the stick click to a computer game; the game sends back H (hit), P (point) and O (over).

**Kit for this activity:**

| Part | How many | Issued | Note |
|---|---|---|---|
| Arduino Uno + USB cable | 1 | per group |  |
| Joystick module | 1 | per group |  |
| Push button | 2 | per group |  |
| Resistor 10k ohm | 2 | per group |  |
| Breadboard (half size) | 1 | per group |  |
| Jumper wires M-M | 8 | per group |  |
| Jumper wires M-F | 5 | per group |  |
| Laptop | 1 | per group |  |
| LED 5 mm (assorted) | 1 | per group | Added: every Arduino class |
| Resistor 220 ohm | 1 | per group | Added: for the LED |
| Buzzer | 1 | per group | Added: every Arduino class |

**Board:** Arduino Uno

**Wiring (as Circuit Lab builds it):**

- **Joystick**: HORZ → pin A0, VERT → pin A1, SEL → pin 2
- **Push button**: signal → pin 3, color: red
- **Push button**: signal → pin 4, color: blue
- **LED**: color: red, signal → pin 12
- **Buzzer**: signal → pin 11

**Things to try in the simulator:**

- Open Serial and Graph and move the joystick.
- Send H from the Serial box: LED on and a low buzz.
- Send P: a short high beep for a point.

**The sketch:**

```cpp
// Game controller with feedback
const int VX = A0, VY = A1, SW = 2, BTN_A = 3, BTN_B = 4;
const int LED = 12, BUZ = 11;

void setup() {
  Serial.begin(115200);
  pinMode(SW, INPUT_PULLUP);
  pinMode(BTN_A, INPUT_PULLUP);  pinMode(BTN_B, INPUT_PULLUP);
  pinMode(LED, OUTPUT);
}

void loop() {
  Serial.print(analogRead(VX));          Serial.print(',');
  Serial.print(analogRead(VY));          Serial.print(',');
  Serial.print(digitalRead(BTN_A) == LOW); Serial.print(',');
  Serial.println(digitalRead(SW) == LOW);   // stick click

  if (Serial.available()) {              // messages from the game
    char c = Serial.read();
    if (c == 'H') { digitalWrite(LED, HIGH); tone(BUZ, 200, 200); }
    if (c == 'P') { tone(BUZ, 1200, 40); }
    if (c == 'O') { digitalWrite(LED, LOW); }
  }
  delay(20);
}
```


#### TL-17 · Computer Vision with OpenCV: Colour Tracking

**Unit:** Vision & Intelligence · **Phase:** Phase 2 · **Domain:** AI & Data

Self-driving cars and factory robots see the world through cameras.

**Kit for this activity:**

| Part | How many | Issued | Note |
|---|---|---|---|
| Laptop | 1 | per group |  |
| Webcam | 1 | per group | Or built-in camera |


#### TL-18 · Vision-Guided Robot Car

**Unit:** Vision & Intelligence · **Phase:** Phase 2 · **Domain:** Robotics & Actuation

Robots can steer by what they see.

**Kit for this activity:**

| Part | How many | Issued | Note |
|---|---|---|---|
| 4WD robot car (assembled, L298N) | 1 | per group | From Phase 2B requisition |
| ESP32-CAM + programmer | 1 | per group | From lab stock |
| ESP32 Dev Board + USB cable | 1 | per group |  |
| Jumper wires M-F | 8 | per group |  |
| Laptop | 1 | per group |  |

**Not in the simulator:** The ESP32-CAM camera can't be simulated.


#### TL-19 · TinyML Gesture Recogniser on ESP32

**Unit:** Vision & Intelligence · **Phase:** Phase 2 · **Domain:** AI & Data

TinyML runs machine learning on tiny chips without the internet.

**What it does:** Stream accelerometer data at 100 Hz for Edge Impulse; until your model is trained, a simple rule spots a 'shake' gesture.

**Kit for this activity:**

| Part | How many | Issued | Note |
|---|---|---|---|
| ESP32 Dev Board + USB cable | 1 | per group |  |
| MPU6050 IMU | 1 | per group |  |
| Breadboard (half size) | 1 | per group |  |
| Jumper wires M-M | 4 | per group |  |
| Laptop | 1 | per group |  |

**Board:** ESP32 DevKit

**Wiring (as Circuit Lab builds it):**

- **MPU6050 motion**: SDA and SCL (A4 and A5 on an Uno, 21 and 22 on an ESP32), address 104
- **LED**: color: green, signal → pin 2

**Things to try in the simulator:**

- Open Serial: ax,ay,az lines at 100 per second.
- Click the MPU6050 and swing Tilt X quickly between -15 and 15: 'shake!' and the LED.
- Replace the rule with your Edge Impulse model on a real ESP32.

**The sketch:**

```cpp
// Gesture data streamer + simple shake rule
#include <Adafruit_MPU6050.h>
#include <Wire.h>
Adafruit_MPU6050 mpu;
const int LED = 2;
float lastX = 0; int swings = 0; unsigned long windowStart = 0;

void setup() {
  Serial.begin(115200);
  Wire.begin(21, 22);
  pinMode(LED, OUTPUT);
  if (!mpu.begin()) { Serial.println("MPU not found"); while (1); }
  mpu.setAccelerometerRange(MPU6050_RANGE_8_G);
}

void loop() {
  static unsigned long next = 0;
  if (millis() < next) return;
  next = millis() + 10;                         // 100 Hz
  sensors_event_t a, g, t;
  mpu.getEvent(&a, &g, &t);
  Serial.print(a.acceleration.x); Serial.print(',');
  Serial.print(a.acceleration.y); Serial.print(',');
  Serial.println(a.acceleration.z);

  float x = a.acceleration.x;                   // count direction changes
  if ((x > 8 && lastX < -8) || (x < -8 && lastX > 8)) swings++;
  if (fabs(x) > 8) lastX = x;
  if (millis() - windowStart > 1500) { windowStart = millis(); swings = 0; }
  if (swings >= 3) { Serial.println("shake!"); digitalWrite(LED, HIGH); swings = 0; }
  if (millis() - windowStart > 700) digitalWrite(LED, LOW);
}
```


#### TL-20 · Processing: Flocking Simulation (Boids)

**Unit:** Vision & Intelligence · **Phase:** Phase 2 · **Domain:** Programming & Logic

Birds and fish move in beautiful flocks with no leader.

**Kit for this activity:**

| Part | How many | Issued | Note |
|---|---|---|---|
| Laptop | 1 | per group |  |


#### TL-21 · Pathfinding Visualiser: BFS and A*

**Unit:** Algorithms & Systems · **Phase:** Phase 2 · **Domain:** Programming & Logic

Map apps and robots find the shortest path around obstacles.

**Kit for this activity:**

| Part | How many | Issued | Note |
|---|---|---|---|
| Laptop | 1 | per group |  |


#### TL-22 · Git & GitHub for Engineering Teams

**Unit:** Algorithms & Systems · **Phase:** Phase 2 · **Domain:** Programming & Logic

Professional engineers never email code to each other: they use version control.

**Kit for this activity:**

| Part | How many | Issued | Note |
|---|---|---|---|
| Laptop | 1 | per group |  |


#### TL-23 · Smart Microgrid Model

**Unit:** Algorithms & Systems · **Phase:** Phase 2 · **Domain:** Power & Energy

Microgrids share solar power between homes and decide which loads to run.

**What it does:** Two INA219 sensors measure solar input and the battery side. When the battery voltage drops, less important loads are paused (homes first, hospital last).

**Kit for this activity:**

| Part | How many | Issued | Note |
|---|---|---|---|
| ESP32 Dev Board + USB cable | 1 | per group |  |
| Small solar panel | 1 | per group |  |
| 18650 cell + holder | 1 | per group | Supervised |
| TP4056 charger module | 1 | per group |  |
| Relay module (4-channel) | 1 | per group |  |
| Low-voltage LED lamp (5 V) | 2 | per group |  |
| Resistor 10k ohm | 2 | per group | Voltage divider |
| Breadboard (half size) | 1 | per group |  |
| Jumper wires M-M | 12 | per group |  |
| Laptop | 1 | per group |  |

**Board:** ESP32 DevKit

**Wiring (as Circuit Lab builds it):**

- **Current sensor INA219**: label: Solar side, attrs: [object Object], sim: [object Object]
- **Current sensor INA219**: label: Battery side, attrs: [object Object], sim: [object Object]
- **Relay module**: attrs: [object Object], IN1 → pin 25, IN2 → pin 26, IN3 → pin 27, with: [object Object]

**Things to try in the simulator:**

- Start and open the Phone tab: the microgrid page.
- Click 'Battery side' and lower the supply voltage to 3.6 V: Homes pause.
- Lower it to 3.2 V: only the Hospital stays on.

**The sketch:**

```cpp
// Smart microgrid
#include <Wire.h>
#include <Adafruit_INA219.h>
#include <WiFi.h>
#include <WebServer.h>
Adafruit_INA219 solar(0x40), load(0x41);
WebServer server(80);
const int LOAD_PIN[3] = {25, 26, 27};        // P1 hospital, P2 school, P3 homes
const char *names[3] = {"Hospital", "School", "Homes"};
bool on[3] = {true, true, true};
float sW, lW, bV;

void manage() {
  // cut thresholds and (higher) reconnect thresholds = hysteresis
  const float cut[3] = {3.30, 3.50, 3.70}, back[3] = {3.50, 3.70, 3.90};
  for (int p = 0; p < 3; p++) {
    if (on[p] && bV < cut[p])   on[p] = false;
    if (!on[p] && bV > back[p]) on[p] = true;
    digitalWrite(LOAD_PIN[p], on[p]);
  }
}
void readGrid() {
  sW = solar.getPower_mW() / 1000.0;
  lW = load.getPower_mW() / 1000.0;
  bV = load.getBusVoltage_V();                // battery side
}
void page() {
  String h = "<meta http-equiv='refresh' content='2'><meta name=viewport content='width=device-width'><body style='font-family:sans-serif'><h2>Microgrid</h2>";
  h += "<p>Solar: " + String(sW, 2) + " W<br>Load: " + String(lW, 2) + " W<br>Battery: " + String(bV, 2) + " V</p>";
  for (int p = 0; p < 3; p++) h += "<p>" + String(names[p]) + ": " + (on[p] ? "<b style=color:green>ON</b>" : "<b style=color:#c00>PAUSED</b>") + "</p>";
  server.send(200, "text/html", h);
}

void setup() {
  Serial.begin(115200); Wire.begin(); solar.begin(); load.begin();
  for (int p = 0; p < 3; p++) pinMode(LOAD_PIN[p], OUTPUT);
  WiFi.begin("SchoolLab", "password");
  while (WiFi.status() != WL_CONNECTED) delay(300);
  Serial.println(WiFi.localIP());
  server.on("/", page); server.begin();
}

void loop() {
  readGrid(); manage(); server.handleClient();
  static unsigned long t = 0;
  if (millis() - t > 1000) { t = millis(); Serial.printf("%.2f W in, %.2f W out, %.2f V\n", sW, lW, bV); }
}
```


#### TL-24 · Noise Pollution Analyser with FFT

**Unit:** Algorithms & Systems · **Phase:** Phase 2 · **Domain:** Sensors & Environment

Noise pollution affects sleep, learning and health.

**Kit for this activity:**

| Part | How many | Issued | Note |
|---|---|---|---|
| Laptop | 1 | per group |  |


#### TL-25 · Robotic Arm Inverse Kinematics

**Unit:** Robots & Control · **Phase:** Phase 2 · **Domain:** Robotics & Actuation

Industrial robot arms calculate joint angles to reach a point.

**What it does:** Python works out the joint angles; the Arduino receives 'shoulder,elbow' and moves smoothly 1° at a time within safe limits.

**Kit for this activity:**

| Part | How many | Issued | Note |
|---|---|---|---|
| Arduino Uno + USB cable | 1 | per group |  |
| Servo MG995 | 2 | per group |  |
| Cardboard sheet | 1 | per group | Arm links (or 3D printed) |
| 4xAA battery pack | 1 | per group | Servo power |
| Breadboard (half size) | 1 | per group |  |
| Jumper wires M-M | 8 | per group |  |
| Laptop | 1 | per group |  |
| LED 5 mm (assorted) | 1 | per group | Added: every Arduino class |
| Resistor 220 ohm | 1 | per group | Added: for the LED |
| Buzzer | 1 | per group | Added: every Arduino class |

**Board:** Arduino Uno

**Wiring (as Circuit Lab builds it):**

- **Servo SG90**: label: Shoulder, PWM → pin 9
- **Servo SG90**: label: Elbow, PWM → pin 10
- **LED**: color: green, signal → pin 13

**Things to try in the simulator:**

- In the Serial box send 45,120 and watch both servos glide.
- Send 200,0: the limits keep it at 170,10.
- Make it slower: change delay(8) to delay(20).

**The sketch:**

```cpp
// Two-joint arm: receives angles from Python
#include <Servo.h>
Servo shoulder, elbow;
int s1 = 90, s2 = 90;

void setup() {
  Serial.begin(115200);
  shoulder.attach(9); elbow.attach(10);
  shoulder.write(s1); elbow.write(s2);
  pinMode(13, OUTPUT);
}

void loop() {
  if (Serial.available()) {
    int a = Serial.parseInt(), b = Serial.parseInt();   // "a,b\n"
    if (Serial.read() == '\n') {
      a = constrain(a, 10, 170); b = constrain(b, 10, 170);   // joint limits
      digitalWrite(13, HIGH);
      while (s1 != a || s2 != b) {                           // smooth: 1 degree steps
        s1 += (a > s1) - (a < s1);
        s2 += (b > s2) - (b < s2);
        shoulder.write(s1); elbow.write(s2);
        delay(8);
      }
      digitalWrite(13, LOW);
      Serial.println("OK");
    }
  }
}
```


#### TL-26 · Robot Swarm: Leader and Follower Cars

**Unit:** Robots & Control · **Phase:** Phase 2 · **Domain:** Robotics & Actuation

Swarms of robots can cooperate on tasks.

**What it does:** The leader car reads its joystick, drives itself and broadcasts speed and turn 20 times a second with ESP-NOW for the followers.

**Kit for this activity:**

| Part | How many | Issued | Note |
|---|---|---|---|
| 4WD robot car (assembled, L298N) | 1 | per group | Two groups pair up: leader + follower |
| ESP32 Dev Board + USB cable | 2 | per group |  |
| Ultrasonic sensor HC-SR04 | 1 | per group |  |
| Jumper wires M-F | 12 | per group |  |
| Laptop | 1 | per group |  |

**Board:** ESP32 DevKit

**Wiring (as Circuit Lab builds it):**

- **Joystick**: HORZ → pin 34, VERT → pin 35
- **Push button**: signal → pin 15, color: red
- **L298N motor driver**: ENA → pin 14, IN1 → pin 27, IN2 → pin 26, ENB → pin 25, IN3 → pin 33, IN4 → pin 32, with: [object Object]

**Things to try in the simulator:**

- Push the joystick up: both wheels drive and packets go out (Phone tab log).
- Press the red E-STOP: speed 0 is broadcast.
- With real cars, flash the follower code on the other ESP32s.

**The sketch:**

```cpp
// Swarm leader: drive + broadcast
#include <esp_now.h>
#include <WiFi.h>
typedef struct { uint32_t seq; int16_t speed; int16_t turn; bool estop; } Cmd;
Cmd cmd = {0, 0, 0, false};
uint8_t BCAST[] = {0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF};
const int ENA = 14, IN1 = 27, IN2 = 26, ENB = 25, IN3 = 33, IN4 = 32;

void drive(int left, int right) {           // -255 .. 255
  digitalWrite(IN1, left >= 0);  digitalWrite(IN2, left < 0);
  analogWrite(ENA, constrain(abs(left), 0, 255));
  digitalWrite(IN3, right >= 0); digitalWrite(IN4, right < 0);
  analogWrite(ENB, constrain(abs(right), 0, 255));
}
void driveSelf(int speed, int turn) { drive(speed + turn, speed - turn); }

void setup() {
  Serial.begin(115200);
  int p[] = {ENA, IN1, IN2, ENB, IN3, IN4};
  for (int i = 0; i < 6; i++) pinMode(p[i], OUTPUT);
  WiFi.mode(WIFI_STA);
  esp_now_init();
  esp_now_peer_info_t peer = {};
  memcpy(peer.peer_addr, BCAST, 6); peer.channel = 0; peer.encrypt = false;
  esp_now_add_peer(&peer);
  pinMode(15, INPUT_PULLUP);                  // big red E-STOP button
}

void loop() {
  int jx = analogRead(34), jy = analogRead(35);   // joystick
  cmd.seq++;
  cmd.speed = map(jy, 0, 4095, -150, 150);
  cmd.turn  = map(jx, 0, 4095, 100, -100);
  if (abs(cmd.speed) < 15) cmd.speed = 0;
  if (abs(cmd.turn) < 15) cmd.turn = 0;
  cmd.estop = (digitalRead(15) == LOW);
  if (cmd.estop) cmd.speed = cmd.turn = 0;
  esp_now_send(BCAST, (uint8_t *)&cmd, sizeof(cmd));
  driveSelf(cmd.speed, cmd.turn);
  delay(50);                                  // 20 messages per second
}
```


#### TL-27 · 3D-Printed Gearbox and Gear Ratios

**Unit:** Robots & Control · **Phase:** Phase 2 · **Domain:** Mechanical Design

Every machine from bicycles to robot arms uses gears to trade speed for force.

**What it does:** The motor drives your printed gearbox. More teeth on the output gear = slower but stronger.

**Kit for this activity:**

| Part | How many | Issued | Note |
|---|---|---|---|
| 3D printer | 1 | per class |  |
| PLA filament | 1 | per class |  |
| DC hobby motor | 1 | per group |  |
| 4xAA battery pack | 1 | per group |  |
| Wooden skewers | 2 | per group | Axles |

**Board:** null

**Wiring (as Circuit Lab builds it):**

- **Battery**: attrs: [object Object], rails: [object Object]
- **Slide switch**: feed: true
- **DC motor**: label: Gearbox motor, rails: [object Object]

**Things to try in the simulator:**

- Start and flip the switch: the motor shows its rpm.
- With a 3:1 gearbox the output turns at one third of that speed.
- Change to 2xAA and compare the rpm.


#### TL-28 · Smart Cane for the Visually Impaired

**Unit:** Robots & Control · **Phase:** Phase 2 · **Domain:** Electronics & Circuits

Assistive technology helps people live independently.

**What it does:** The closer an obstacle, the faster the cane vibrates and beeps, so the user can feel the distance.

**Kit for this activity:**

| Part | How many | Issued | Note |
|---|---|---|---|
| Arduino Uno + USB cable | 1 | per group |  |
| Ultrasonic sensor HC-SR04 | 2 | per group |  |
| Vibration motor module | 1 | per group |  |
| Buzzer | 1 | per group |  |
| 4xAA battery pack | 1 | per group |  |
| Jumper wires M-F | 12 | per group |  |
| Laptop | 1 | per group |  |
| LED 5 mm (assorted) | 1 | per group | Added: every Arduino class |
| Resistor 220 ohm | 1 | per group | Added: for the LED |

**Board:** Arduino Uno

**Wiring (as Circuit Lab builds it):**

- **Ultrasonic HC-SR04**: TRIG → pin 9, ECHO → pin 10
- **Vibration motor**: IN → pin 5
- **LED**: color: red, signal → pin 13
- **Buzzer**: signal → pin 8

**Things to try in the simulator:**

- Set the distance to 150 cm: slow pulses. 30 cm: fast pulses.
- Under 20 cm it buzzes non-stop.
- Add a quiet mode that only vibrates.

**The sketch:**

```cpp
// Smart cane
const int TRIG = 9, ECHO = 10, VIB = 5, LED = 13, BUZZER = 8;

long readCm() {
  digitalWrite(TRIG, LOW); delayMicroseconds(2);
  digitalWrite(TRIG, HIGH); delayMicroseconds(10); digitalWrite(TRIG, LOW);
  long us = pulseIn(ECHO, HIGH, 30000);
  return us == 0 ? 400 : us / 58;
}

void setup() {
  pinMode(TRIG, OUTPUT); pinMode(ECHO, INPUT);
  pinMode(VIB, OUTPUT); pinMode(LED, OUTPUT);
  Serial.begin(9600);
}

void loop() {
  long cm = readCm();
  Serial.println(cm);
  if (cm < 20) {                              // very close: continuous
    digitalWrite(VIB, HIGH); digitalWrite(LED, HIGH); tone(BUZZER, 1500);
    delay(100);
  } else if (cm < 200) {                      // pulse faster when closer
    int gap = map(cm, 20, 200, 80, 800);
    digitalWrite(VIB, HIGH); digitalWrite(LED, HIGH); tone(BUZZER, 1000, 60);
    delay(60);
    digitalWrite(VIB, LOW); digitalWrite(LED, LOW);
    delay(gap);
  } else {
    digitalWrite(VIB, LOW); digitalWrite(LED, LOW); noTone(BUZZER);
    delay(100);
  }
}
```


#### TL-29 · Air Quality Data Science for Pakistan

**Unit:** AI, Data & Product · **Phase:** Phase 2 · **Domain:** AI & Data

Smog affects millions of people in Pakistan every winter.

**Kit for this activity:**

| Part | How many | Issued | Note |
|---|---|---|---|
| Laptop | 1 | per group |  |


#### TL-30 · Neural Network from Scratch

**Unit:** AI, Data & Product · **Phase:** Phase 2 · **Domain:** AI & Data

Behind every AI is a network of simple maths units.

**Kit for this activity:**

| Part | How many | Issued | Note |
|---|---|---|---|
| Laptop | 1 | per group |  |


#### TL-31 · 2D Game Development in Godot

**Unit:** AI, Data & Product · **Phase:** Phase 2 · **Domain:** App, Web & Game Development

Godot is a free professional game engine used by indie studios.

**Kit for this activity:**

| Part | How many | Issued | Note |
|---|---|---|---|
| Laptop | 1 | per group |  |


#### TL-32 · Password Security Lab: Hashing and Attacks

**Unit:** AI, Data & Product · **Phase:** Phase 2 · **Domain:** Security & Safety

Websites never store your real password: they store a hash.

**Kit for this activity:**

| Part | How many | Issued | Note |
|---|---|---|---|
| Laptop | 1 | per group |  |


### Lessons in the simulator with no portal activity

These circuits exist in Circuit Lab and are taught, but they are not listed in the planner's activity data, so they do not appear in kit totals or printed hardware lists. Treat them as real lessons.

#### F-04 · Introduction to Actuators

**What it does:** An ultrasonic sensor measures distance and the servo turns to match it, with green, yellow and red LEDs showing which third of the sweep the arm is in.

**Board:** Arduino Uno

**Wiring (as Circuit Lab builds it):**

- **Ultrasonic HC-SR04**: TRIG → pin 9, ECHO → pin 10
- **Servo SG90**: PWM → pin 6
- **LED**: color: green, signal → pin 2
- **LED**: color: yellow, signal → pin 3
- **LED**: color: red, signal → pin 4

**Things to try in the simulator:**

- Start the simulation, then drag the ball in front of the sensor and watch the servo follow it.
- Find the distance where the yellow LED hands over to red. Does it match the table on the slides?
- Swap FAR_CM and NEAR_CM in the map() line so the servo turns the other way.
- Only move the servo when the new angle differs from the old one by more than 3 degrees, so it stops twitching.

**The sketch:**

```cpp
// Distance-controlled servo with a 3-LED angle indicator
// The nearer the object, the further the servo turns.
#include <Servo.h>

const int TRIG = 9, ECHO = 10, SERVO = 6;
const int GREEN = 2, YELLOW = 3, RED = 4;

// the window we care about, in centimetres
const int NEAR_CM = 10;    // 10 cm or closer  -> servo at 180
const int FAR_CM  = 60;    // 60 cm or further -> servo at 0

Servo arm;

long readDistanceCm() {
  digitalWrite(TRIG, LOW);  delayMicroseconds(2);
  digitalWrite(TRIG, HIGH); delayMicroseconds(10);
  digitalWrite(TRIG, LOW);
  long us = pulseIn(ECHO, HIGH, 30000);   // give up after 30 ms
  if (us == 0) return FAR_CM;             // nothing came back: treat as far
  return us / 58;                         // sound there and back, in cm
}

void setup() {
  Serial.begin(9600);
  pinMode(TRIG, OUTPUT);
  pinMode(ECHO, INPUT);
  pinMode(GREEN, OUTPUT); pinMode(YELLOW, OUTPUT); pinMode(RED, OUTPUT);
  arm.attach(SERVO);
  arm.write(0);
}

void loop() {
  long cm = readDistanceCm();
  cm = constrain(cm, NEAR_CM, FAR_CM);           // keep it inside our window

  // near = big angle, far = small angle
  int angle = map(cm, FAR_CM, NEAR_CM, 0, 180);
  arm.write(angle);

  // one LED for each third of the turn
  digitalWrite(GREEN,  angle <  60);
  digitalWrite(YELLOW, angle >= 60 && angle < 120);
  digitalWrite(RED,    angle >= 120);

  Serial.print(cm); Serial.print(" cm -> "); Serial.print(angle); Serial.println(" deg");
  delay(100);                                     // the servo needs time to move
}
```


---

## 7. Core concepts

Everything the club builds rests on about a dozen ideas. This section is the explanation layer: what the idea is, the numbers that make it concrete, the misconception that has to be cleared, and how to pitch it at each age.

### 7.1 The sense, think, act loop

This is the spine of the whole curriculum and the one idea every student should leave with.

A robot takes in information about the world (**sense**), decides what that information means (**think**), and changes something in the world (**act**). Then it does it again, thousands of times a second. The `loop()` function in every Arduino sketch is literally this.

```cpp
void loop() {
  long cm = readDistance();        // SENSE
  if (cm < 20) {                   // THINK
    digitalWrite(LED, HIGH);       // ACT
  } else {
    digitalWrite(LED, LOW);
  }
}
```

**The misconception to clear:** students think the robot "knows" something. It does not. It has a number, and a rule someone wrote about that number. A distance sensor that reads 15 does not know anything is close; the programmer decided that below 20 counts as close.

- **LE:** "Robots do three things over and over: look, think, do. Look, think, do. Faster than you can blink."
- **JM:** "Every program you write has these three parts. Find the line that senses, the line that decides, and the line that acts."
- **YI:** "The loop rate matters. If your loop takes 500 ms because of a `delay()`, your robot is blind for half a second at a time."
- **TL:** "This is a polling architecture. It is simple and adequate here, but it cannot guarantee response time. Interrupts and state machines are how you fix that, and both appear in Phase 2."

### 7.2 Electricity: what is actually moving

Three quantities, and the relationship between them.

**Voltage (volts, V)** is the push. It is always measured between two points, never at one point, which is why "the voltage at pin 9" always secretly means "between pin 9 and ground".

**Current (amps, A, or milliamps, mA)** is how much is flowing. The same current flows through every part of a simple loop, which surprises students who expect it to be "used up" along the way.

**Resistance (ohms)** is how hard it is to push through.

**Ohm's law: V = I x R.** With the kit's numbers: an LED dropping 2 V on a 5 V supply leaves 3 V across the resistor; 3 V / 220 ohms = 0.0136 A = 13.6 mA.

**Power (watts) = V x I.** A 220 ohm resistor in that circuit dissipates 3 x 0.0136 = 0.04 W, far inside its 0.25 W rating, which is why it does not get warm. A motor stalling at 6 V and 1 A is burning 6 W, which is why it does.

**The two misconceptions that cause the most trouble:**

1. *Current is used up by components.* It is not. In a series loop the current is identical everywhere. What changes is voltage, which drops across each component.
2. *A circuit needs only one wire.* It needs a complete loop. Every single "it does not work" where the ground wire is missing comes from this.

- **LE:** water in a pipe. Push is how hard the pump pushes. The water has to go all the way round and come back.
- **JM:** introduce the three words and Ohm's law as a fact to use, not to derive.
- **YI:** derive it, use it, and measure it with the multimeter to check.
- **TL:** add power dissipation, and the point that real sources have internal resistance, which is why a 9 V battery sags under load.

### 7.3 Digital and analog

A **digital** signal is one of two states: HIGH or LOW, 5 V or 0 V, 1 or 0. `digitalWrite()` and `digitalRead()`.

An **analog** signal is any value in a range. `analogRead()` on an Uno turns 0 to 5 V into a whole number from **0 to 1023** (10 bits). On an ESP32 it is **0 to 4095** (12 bits) over 0 to 3.3 V.

Converting a reading back to volts: `volts = reading * 5.0 / 1023.0`.

**`analogWrite()` is not analog.** This is the single most confusing name in Arduino. It produces **PWM**: a square wave switched on and off very fast, where the fraction of time spent on is the **duty cycle**, written `analogWrite(pin, 0..255)`. An LED at 50 per cent duty looks half as bright because the eye averages it. A motor at 50 per cent duty turns slower because the coil averages it. But the pin is only ever at 5 V or 0 V, never 2.5 V.

On an Uno, PWM works only on pins **3, 5, 6, 9, 10 and 11**, marked with a tilde on the board. A servo on pin 7 will not work and the reason is not obvious.

**The misconception:** that `analogWrite(pin, 128)` puts 2.5 V on the pin. Put a multimeter on it and it will read about 2.5 V, because the meter averages too, which makes this one genuinely hard to see through. The oscilloscope, or Circuit Lab's logic scope, is what settles it.

### 7.4 The microcontroller

A microcontroller is a whole computer on one chip: processor, memory, and pins that connect to the outside world. It runs one program, forever, from the moment it is powered.

Every Arduino sketch has exactly two functions:

- `setup()` runs **once** at power-on or reset. Pin modes and `Serial.begin()` go here.
- `loop()` runs **over and over** for as long as the board has power.

**Numbers worth knowing.** An Uno has 32 KB of program space and 2 KB of RAM. That RAM is the limit students hit first, usually by printing lots of text or using a graphics library. An ESP32 has 520 KB of RAM and runs roughly 15 times faster.

**`delay()` is a trap worth naming early.** `delay(1000)` does not mean "wait a second and carry on". It means "do absolutely nothing for a second", including not reading sensors and not responding to buttons. The fix is the `millis()` pattern in section 8, and it is the single biggest step up in a student's code.

### 7.5 Inputs: reading the world

**Buttons.** A pin that is not connected to anything is *floating*, and reads randomly. It must be tied high or low. The neat way is `pinMode(PIN, INPUT_PULLUP)`, which switches on a resistor inside the chip, wires the button to ground, and makes a press read **LOW**. That inversion catches everybody once.

**Debouncing.** A mechanical switch does not close cleanly; it bounces for a few milliseconds and the board, reading a million times a second, sees several presses. The software fix is in section 8.

**Analog sensors** give a voltage. A potentiometer gives it directly. An LDR or a thermistor changes resistance, so it needs a fixed resistor with it to make a **voltage divider**: `Vout = Vin x R2 / (R1 + R2)`.

**Digital sensor modules** such as PIR and many flame or sound boards do the thinking themselves and give a simple HIGH or LOW. Many have a trim pot that sets the threshold, which is a hardware decision the student should understand they are making.

**Timed sensors** such as the HC-SR04 need the board to send a pulse and measure how long the reply takes.

**Bus sensors** such as the DHT22, the MPU6050 and the OLED talk in a protocol over shared wires. That is section 7.7.

### 7.6 Outputs: changing the world

**LEDs** need a current-limiting resistor. See the four-way answer in section 3.

**Buzzers** come in two kinds and the difference matters: an active buzzer has an oscillator inside and makes one fixed note from plain power; a passive buzzer needs `tone(pin, frequency)` and can play a melody.

**Servos** are told an angle and hold it, using the Servo library. They are the first component where students meet the rule that **actuators need their own power**.

**DC motors** need a driver. An Arduino pin can supply about 20 mA; a small motor wants several hundred. Connecting one directly will at best brown out the board and at worst damage the pin. The L298N or a similar H-bridge sits in between.

**Relays** let a small signal switch something large, with the two sides electrically separate.

**The rule that prevents most hardware damage in this club:** if it moves, heats, or makes a loud noise, it does not run from the Arduino's 5 V pin. Give it its own supply and **join the grounds**. Grounds must be common or the signal has no reference and nothing works.

### 7.7 Making devices talk: the protocols

**Serial / UART.** Two wires, TX and RX, crossed over: one device's TX goes to the other's RX. The two ends must agree a speed, the **baud rate**, usually 9600 or 115200. Garbled characters in the Serial Monitor almost always mean the baud rate in the code and the baud rate in the monitor do not match. The Serial Monitor is the single most useful debugging tool the students have.

**I2C.** Two wires, **SDA** (data) and **SCL** (clock), shared by many devices at once. Each device has an **address**, a number such as 0x3C for the OLED or 0x68 for the MPU6050. Two devices with the same address on the same bus will conflict, and some modules have a solder jumper to change theirs. On an Uno, SDA is A4 and SCL is A5. Needs pull-up resistors, which almost all breakout boards already include.

**SPI.** Four wires, faster than I2C, used by SD cards, the NRF24L01 radio and larger displays. Each device gets its own **CS** (chip select) line, which is how one master talks to several devices.

**Wi-Fi and Bluetooth** are on the ESP32 only. In Circuit Lab these talk to a pretend network in the Phone tab, not the real internet.

**MQTT** is a publish-and-subscribe message pattern used for the IoT activities: a device publishes to a *topic*, and anything subscribed to that topic receives it. It is the model behind most home-automation systems.

### 7.8 Power and energy

**Voltage, capacity and energy are three different things.** A 9 V battery pushes harder than a 1.5 V AA, but holds far less energy. Capacity is in **mAh**: 500 mAh means roughly 500 mA for one hour, or 250 mA for two.

**Series adds voltage, parallel adds capacity.** Four AA cells in series give 6 V at the capacity of one cell. Four in parallel give 1.5 V at four times the capacity.

**Powering an Arduino.** USB gives a regulated 5 V. The barrel jack and the VIN pin accept 7 to 12 V and go through the onboard regulator, which turns the excess into heat. The 5 V pin is an **output**, not an input; feeding it from a battery bypasses the protection.

**Why robots fail after two minutes on a 9 V battery:** it holds about 500 mAh and sags hard under motor load. Four AA cells, or a lithium pack with a buck converter, is the right answer.

**Lithium cells** have their own section in safety. They are the only component in the kit that can start a fire.

**Generation** appears in the energy activities: a motor spun by hand becomes a generator, because a changing magnetic field through a coil induces a voltage. That is Faraday's law, and the fact that a motor and a generator are the same machine run in opposite directions is one of the most satisfying things a student learns all year.

### 7.9 Motion and mechanics

**Torque and speed trade against each other.** Gearing down multiplies torque and divides speed by the same ratio. A robot that cannot climb a ramp usually needs gearing, not a bigger battery.

**Servo, DC motor, stepper, each for a different job.** A servo holds a position. A DC motor spins continuously at a speed you can control but a position you cannot. A stepper moves in exact increments and can be positioned precisely without feedback, which is why 3D printers use them.

**Friction and weight are design variables.** A cardboard chassis that flexes will eat the motor's output. Students discover this by building something that does not work and then bracing it.

**Linkages** turn one kind of motion into another: rotation into a push, a small movement into a large one. Split pins through cardboard are enough to demonstrate every linkage in a mechanism textbook.

**3D design and printing** let a student make the part that does not exist. The design constraints worth teaching: overhangs beyond about 45 degrees need support, holes print slightly undersized, and a part is strongest across its layers and weakest along the join between them.

### 7.10 Programming: the ideas under the syntax

**Sequence** is the default: lines run top to bottom.

**Variables** hold a value. The common types in this kit: `int` for whole numbers, `float` for decimals, `bool` for true or false, `char` for a single character, `String` for text. On an Uno, `int` is 16 bits and overflows past 32767, which is a real bug students hit with `millis()`; use `unsigned long` for times.

**Conditions** choose a path: `if`, `else if`, `else`. The classic error is `=` instead of `==`.

**Loops** repeat: `for` when the number of repeats is known, `while` when it depends on a condition.

**Functions** name a piece of work so it can be reused and so the main loop stays readable. Teaching students to pull `readDistance()` out of the loop is the moment their code starts to look like engineering.

**Arrays** hold many values under one name, indexed from **zero**. Reading past the end of an array on an Arduino does not raise an error; it silently returns nonsense, which makes it one of the hardest bugs at this level.

**The three errors, told apart.** A **compile error** means the code could not be turned into something the board can run; the IDE tells you the line. A **runtime error** means it compiled but does the wrong thing; the Serial Monitor is how you find it. A **logic error** means it does exactly what you wrote and what you wrote was not what you meant; only thinking finds that one.

### 7.11 AI and data

The club teaches AI as something built from data, not something that thinks.

**A model is a function fitted to examples.** Show it enough pictures labelled "cat" and "not cat" and it finds a rule that separates them. The rule is not understanding; it is statistics over pixels.

**Training, validation and inference.** Training is fitting the rule. Validation is checking it on examples it never saw, which is the only honest test. Inference is using it afterwards. A model that scores perfectly on its training data and badly on new data has **overfitted**: it memorised instead of generalising.

**Features.** A model only sees what it is given. A classifier trained on photos of cats taken indoors and dogs taken outdoors may well be a grass detector, and will say "dog" to a cat on a lawn. This example is worth using with every age band above 8.

**Bias comes from the data.** If every photo of a doctor in the training set is a man, the model learns that. This is not a software bug; it is the dataset being an incomplete picture of the world, and the fix is in the data, not the code.

**What the kit can actually do.** Image classification and pose detection run in the browser with a webcam. On a microcontroller, TinyML can run very small models for keyword spotting or gesture recognition. Neither of these is a general intelligence, and students should be able to say why.

**The honest framing for every age:**

- **LE:** "The computer looked at a thousand pictures of cats and found what they have in common. It has never met a cat."
- **JM:** "It does not know what a cat is. It knows what the pixels in cat pictures tend to look like. That is why it can be fooled."
- **YI:** "It is a function with millions of numbers in it, adjusted until it got the training examples right. Ask what data it was trained on and you can usually predict how it will fail."
- **TL:** "Accuracy on a held-out set is the only number worth quoting, and even that hides the distribution it was drawn from. Ask who collected the data, what they left out, and who is affected when it is wrong."

---

## 8. Code patterns

The building blocks that appear again and again. A student who understands these can read most of the sketches in this file.

### Basics

#### Blink

Turn the built-in LED on and off.

```cpp
void setup() {
  pinMode(LED_BUILTIN, OUTPUT);
}

void loop() {
  digitalWrite(LED_BUILTIN, HIGH);
  delay(500);
  digitalWrite(LED_BUILTIN, LOW);
  delay(500);
}
```

#### Button controls an LED

INPUT_PULLUP: the button joins the pin to GND, so pressed = LOW.

```cpp
const int BUTTON = 2;
const int LED = 13;

void setup() {
  pinMode(BUTTON, INPUT_PULLUP);
  pinMode(LED, OUTPUT);
}

void loop() {
  if (digitalRead(BUTTON) == LOW) {
    digitalWrite(LED, HIGH);
  } else {
    digitalWrite(LED, LOW);
  }
}
```

#### Toggle with one press

Each press switches the LED on or off (with debounce).

```cpp
const int BUTTON = 2, LED = 13;
bool ledOn = false;
bool lastPressed = false;

void setup() {
  pinMode(BUTTON, INPUT_PULLUP);
  pinMode(LED, OUTPUT);
}

void loop() {
  bool pressed = digitalRead(BUTTON) == LOW;
  if (pressed && !lastPressed) {      // just pressed
    ledOn = !ledOn;
    digitalWrite(LED, ledOn);
    delay(30);                        // debounce
  }
  lastPressed = pressed;
}
```

#### Read an analog sensor

analogRead gives 0-1023. Print it to the Serial monitor.

```cpp
const int SENSOR = A0;

void setup() {
  Serial.begin(9600);
}

void loop() {
  int value = analogRead(SENSOR);
  Serial.print("Value: ");
  Serial.println(value);
  delay(200);
}
```

#### Fade an LED (PWM)

analogWrite on a ~ pin sets brightness 0-255.

```cpp
const int LED = 9;   // ~ PWM pin

void setup() {
  pinMode(LED, OUTPUT);
}

void loop() {
  for (int b = 0; b <= 255; b += 5) { analogWrite(LED, b); delay(20); }
  for (int b = 255; b >= 0; b -= 5) { analogWrite(LED, b); delay(20); }
}
```

#### Many LEDs with an array

Loop through a list of pins: a running light.

```cpp
int leds[] = {8, 9, 10, 11, 12};
const int N = 5;

void setup() {
  for (int i = 0; i < N; i++) pinMode(leds[i], OUTPUT);
}

void loop() {
  for (int i = 0; i < N; i++) {
    digitalWrite(leds[i], HIGH);
    delay(150);
    digitalWrite(leds[i], LOW);
  }
}
```

### Logic

#### Threshold alarm (if / else)

Do something when a reading goes past a limit.

```cpp
const int SENSOR = A0, LED = 13, BUZZER = 8;
const int LIMIT = 600;

void setup() {
  pinMode(LED, OUTPUT);
  Serial.begin(9600);
}

void loop() {
  int v = analogRead(SENSOR);
  Serial.println(v);
  if (v > LIMIT) {
    digitalWrite(LED, HIGH);
    tone(BUZZER, 1000);
  } else {
    digitalWrite(LED, LOW);
    noTone(BUZZER);
  }
  delay(100);
}
```

#### Do two things at once (millis)

Blink without delay() so the board can keep reading sensors.

```cpp
const int LED = 13;
unsigned long lastBlink = 0;
bool on = false;

void setup() {
  pinMode(LED, OUTPUT);
  Serial.begin(9600);
}

void loop() {
  unsigned long now = millis();
  if (now - lastBlink >= 500) {      // every 500 ms
    lastBlink = now;
    on = !on;
    digitalWrite(LED, on);
  }
  // other work keeps running here
}
```

#### map() and constrain()

Turn one range of numbers into another.

```cpp
void setup() {
  Serial.begin(9600);
}

void loop() {
  int raw = analogRead(A0);                    // 0 .. 1023
  int percent = map(raw, 0, 1023, 0, 100);     // 0 .. 100
  int angle = constrain(map(raw, 0, 1023, 0, 180), 0, 180);
  Serial.print(percent); Serial.print(" %   ");
  Serial.print(angle);   Serial.println(" deg");
  delay(200);
}
```

#### State machine (modes)

A button cycles through modes; each mode does something different.

```cpp
const int BUTTON = 2, LED = 13;
int mode = 0;               // 0 = off, 1 = on, 2 = blink
bool last = false;

void setup() {
  pinMode(BUTTON, INPUT_PULLUP);
  pinMode(LED, OUTPUT);
  Serial.begin(9600);
}

void loop() {
  bool pressed = digitalRead(BUTTON) == LOW;
  if (pressed && !last) { mode = (mode + 1) % 3; Serial.print("Mode "); Serial.println(mode); delay(30); }
  last = pressed;

  if (mode == 0) digitalWrite(LED, LOW);
  if (mode == 1) digitalWrite(LED, HIGH);
  if (mode == 2) digitalWrite(LED, (millis() / 250) % 2);
}
```

#### Read commands from Serial

Type in the Serial monitor to control the board.

```cpp
void setup() {
  pinMode(LED_BUILTIN, OUTPUT);
  Serial.begin(9600);
  Serial.println("Type ON or OFF");
}

void loop() {
  if (Serial.available()) {
    String cmd = Serial.readStringUntil('\n');
    cmd.trim();
    cmd.toUpperCase();
    if (cmd == "ON")  { digitalWrite(LED_BUILTIN, HIGH); Serial.println("LED on"); }
    if (cmd == "OFF") { digitalWrite(LED_BUILTIN, LOW);  Serial.println("LED off"); }
  }
}
```

### Sound

#### Melody

Play notes with tone(pin, frequency, length).

```cpp
const int BUZZER = 8;
int notes[]  = {262, 262, 392, 392, 440, 440, 392, 0, 349, 349, 330, 330, 294, 294, 262};
int beats[]  = {1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 2};

void setup() {}

void loop() {
  for (int i = 0; i < 15; i++) {
    if (notes[i]) tone(BUZZER, notes[i], beats[i] * 250);
    delay(beats[i] * 300);
  }
  delay(1500);
}
```

#### Siren

Sweep the pitch up and down.

```cpp
const int BUZZER = 8;

void setup() {}

void loop() {
  for (int f = 500; f < 1500; f += 20) { tone(BUZZER, f); delay(5); }
  for (int f = 1500; f > 500; f -= 20) { tone(BUZZER, f); delay(5); }
}
```

### Motion

#### Servo follows a knob

Turn the potentiometer to turn the servo.

```cpp
#include <Servo.h>
Servo servo;

void setup() {
  servo.attach(9);
}

void loop() {
  int angle = map(analogRead(A0), 0, 1023, 0, 180);
  servo.write(angle);
  delay(15);
}
```

#### Obstacle-avoiding car

HC-SR04 + L298N: drive forward, turn when something is close.

```cpp
const int TRIG = 12, ECHO = 13;
const int ENA = 5, IN1 = 7, IN2 = 8, ENB = 6, IN3 = 9, IN4 = 11;

long distanceCM() {
  digitalWrite(TRIG, LOW); delayMicroseconds(2);
  digitalWrite(TRIG, HIGH); delayMicroseconds(10); digitalWrite(TRIG, LOW);
  return pulseIn(ECHO, HIGH, 30000) * 0.0343 / 2;
}

void drive(int l, int r) {
  digitalWrite(IN1, l > 0); digitalWrite(IN2, l < 0); analogWrite(ENA, abs(l));
  digitalWrite(IN3, r > 0); digitalWrite(IN4, r < 0); analogWrite(ENB, abs(r));
}

void setup() {
  pinMode(TRIG, OUTPUT); pinMode(ECHO, INPUT);
  int p[] = {ENA, IN1, IN2, ENB, IN3, IN4};
  for (int i = 0; i < 6; i++) pinMode(p[i], OUTPUT);
}

void loop() {
  long d = distanceCM();
  if (d > 0 && d < 20) { drive(-180, 180); delay(400); }   // turn
  else drive(200, 200);                                   // forward
  delay(50);
}
```

### Wi-Fi (ESP32)

#### Web page that switches an LED

Open the Phone panel and tap the buttons on the page.

```cpp
#include <WiFi.h>
#include <WebServer.h>

const int LED = 2;
WebServer server(80);

String page() {
  String s = "<html><head><meta name='viewport' content='width=device-width'>";
  s += "<style>body{font-family:sans-serif;text-align:center}a{display:inline-block;margin:8px;padding:14px 24px;border-radius:12px;background:#2E6BE6;color:#fff;text-decoration:none}</style></head><body>";
  s += "<h2>ESP32 Lamp</h2><p>The LED is <b>" + String(digitalRead(LED) ? "ON" : "OFF") + "</b></p>";
  s += "<a href='/on'>Turn ON</a><a href='/off'>Turn OFF</a></body></html>";
  return s;
}

void setup() {
  pinMode(LED, OUTPUT);
  Serial.begin(115200);
  WiFi.begin("School-Lab", "password");
  while (WiFi.status() != WL_CONNECTED) { delay(300); Serial.print("."); }
  Serial.print("\nOpen http://"); Serial.println(WiFi.localIP());
  server.on("/", [] { server.send(200, "text/html", page()); });
  server.on("/on", [] { digitalWrite(LED, HIGH); server.send(200, "text/html", page()); });
  server.on("/off", [] { digitalWrite(LED, LOW); server.send(200, "text/html", page()); });
  server.begin();
}

void loop() {
  server.handleClient();
}
```

#### Live sensor web page (JSON)

The page asks the board for new readings every second with fetch().

```cpp
#include <WiFi.h>
#include <WebServer.h>

WebServer server(80);
const int SENSOR = 34;

const char PAGE[] PROGMEM = R"HTML(
<html><body style="font-family:sans-serif;text-align:center">
<h2>Live sensor</h2><p style="font-size:48px" id="v">--</p>
<script>
setInterval(() => fetch('/data').then(r => r.json()).then(d => { document.getElementById('v').textContent = d.value; }), 1000);
</script></body></html>
)HTML";

void setup() {
  Serial.begin(115200);
  WiFi.begin("School-Lab", "password");
  while (WiFi.status() != WL_CONNECTED) delay(300);
  server.on("/", [] { server.send_P(200, "text/html", PAGE); });
  server.on("/data", [] { server.send(200, "application/json", "{\"value\":" + String(analogRead(SENSOR)) + "}"); });
  server.begin();
  Serial.println(WiFi.localIP());
}

void loop() {
  server.handleClient();
}
```

#### Send data to the cloud (HTTP)

Post a reading to a web service every 10 seconds (pretend internet).

```cpp
#include <WiFi.h>
#include <HTTPClient.h>

void setup() {
  Serial.begin(115200);
  WiFi.begin("School-Lab", "password");
  while (WiFi.status() != WL_CONNECTED) delay(300);
  Serial.println("Wi-Fi connected");
}

void loop() {
  HTTPClient http;
  int value = analogRead(34);
  http.begin("http://api.thingspeak.com/update?api_key=DEMO&field1=" + String(value));
  int code = http.GET();
  Serial.print("Sent "); Serial.print(value); Serial.print(" -> HTTP "); Serial.println(code);
  http.end();
  delay(10000);
}
```

#### MQTT publish and subscribe

Talk to an MQTT broker. Send messages back from the Network panel.

```cpp
#include <WiFi.h>
#include <PubSubClient.h>

WiFiClient wifi;
PubSubClient mqtt(wifi);
const int LED = 2;

void onMessage(char* topic, byte* data, unsigned int len) {
  String msg; for (unsigned int i = 0; i < len; i++) msg += (char)data[i];
  Serial.print(topic); Serial.print(": "); Serial.println(msg);
  digitalWrite(LED, msg == "on");
}

void setup() {
  pinMode(LED, OUTPUT);
  Serial.begin(115200);
  WiFi.begin("School-Lab", "password");
  while (WiFi.status() != WL_CONNECTED) delay(300);
  mqtt.setServer("broker.hivemq.com", 1883);
  mqtt.setCallback(onMessage);
  mqtt.connect("club-esp32");
  mqtt.subscribe("club/lamp");
}

void loop() {
  mqtt.loop();
  static unsigned long t = 0;
  if (millis() - t > 5000) { t = millis(); mqtt.publish("club/sensor", String(analogRead(34)).c_str()); }
}
```

#### Bluetooth serial

Send text from the Phone panel's Bluetooth terminal.

```cpp
#include <BluetoothSerial.h>
BluetoothSerial bt;
const int LED = 2;

void setup() {
  pinMode(LED, OUTPUT);
  bt.begin("ESP32-Club");
  Serial.begin(115200);
}

void loop() {
  if (bt.available()) {
    char c = bt.read();
    if (c == '1') { digitalWrite(LED, HIGH); bt.println("LED on"); }
    if (c == '0') { digitalWrite(LED, LOW);  bt.println("LED off"); }
  }
}
```

#### ESP-NOW send

Send a small message to another ESP32 without a router.

```cpp
#include <WiFi.h>
#include <esp_now.h>

uint8_t receiver[] = {0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF};   // broadcast
struct Message { int temp; int light; } msg;

void sent(const uint8_t* mac, esp_now_send_status_t s) {
  Serial.println(s == ESP_NOW_SEND_SUCCESS ? "Delivered" : "Failed");
}

void setup() {
  Serial.begin(115200);
  WiFi.mode(WIFI_STA);
  esp_now_init();
  esp_now_register_send_cb(sent);
  esp_now_peer_info_t peer = {};
  memcpy(peer.peer_addr, receiver, 6);
  esp_now_add_peer(&peer);
}

void loop() {
  msg.temp = 25 + random(5);
  msg.light = analogRead(34);
  esp_now_send(receiver, (uint8_t*)&msg, sizeof(msg));
  delay(2000);
}
```


---

## 9. Starter circuits

Fourteen ready-made circuits that are not tied to a lesson. Useful when a student asks "how do I just make X work".

### Blink (`blink`)

The classic first program: the on-board LED blinks.

```cpp
void setup() {
  pinMode(LED_BUILTIN, OUTPUT);
}

void loop() {
  digitalWrite(LED_BUILTIN, HIGH);
  delay(500);
  digitalWrite(LED_BUILTIN, LOW);
  delay(500);
}
```

### Button and LED (`button`)

Press the button to light the LED.

**Parts:** Push button, LED

```cpp
const int BUTTON = 2;
const int LED = 13;

void setup() {
  pinMode(BUTTON, INPUT_PULLUP);
  pinMode(LED, OUTPUT);
}

void loop() {
  if (digitalRead(BUTTON) == LOW) {
    digitalWrite(LED, HIGH);
  } else {
    digitalWrite(LED, LOW);
  }
}
```

### Fade an LED (`fade`)

analogWrite makes an LED breathe.

**Parts:** LED

```cpp
const int LED = 9;   // ~ PWM pin

void setup() {
  pinMode(LED, OUTPUT);
}

void loop() {
  for (int b = 0; b <= 255; b += 5) { analogWrite(LED, b); delay(20); }
  for (int b = 255; b >= 0; b -= 5) { analogWrite(LED, b); delay(20); }
}
```

### Running lights (`chaser`)

Five LEDs light one after another.

**Parts:** LED, LED, LED, LED, LED

```cpp
int leds[] = {8, 9, 10, 11, 12};
const int N = 5;

void setup() {
  for (int i = 0; i < N; i++) pinMode(leds[i], OUTPUT);
}

void loop() {
  for (int i = 0; i < N; i++) {
    digitalWrite(leds[i], HIGH);
    delay(150);
    digitalWrite(leds[i], LOW);
  }
}
```

### Knob dimmer (`dimmer`)

Turn the knob to change the LED's brightness.

**Parts:** Potentiometer, LED

```cpp
// Knob dimmer
const int KNOB = A0, LED = 9;   // ~ pin for PWM

void setup() {
  Serial.begin(9600);
}

void loop() {
  int k = analogRead(KNOB);
  analogWrite(LED, map(k, 0, 1023, 0, 255));
  Serial.println(k);
  delay(50);
}
```

### Melody (`melody`)

Play a tune on a buzzer.

**Parts:** Buzzer

```cpp
const int BUZZER = 8;
int notes[]  = {262, 262, 392, 392, 440, 440, 392, 0, 349, 349, 330, 330, 294, 294, 262};
int beats[]  = {1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 2};

void setup() {}

void loop() {
  for (int i = 0; i < 15; i++) {
    if (notes[i]) tone(BUZZER, notes[i], beats[i] * 250);
    delay(beats[i] * 300);
  }
  delay(1500);
}
```

### Servo follows a knob (`servo`)

The servo copies the knob.

**Parts:** Potentiometer, Servo SG90

```cpp
#include <Servo.h>
Servo servo;

void setup() {
  servo.attach(9);
}

void loop() {
  int angle = map(analogRead(A0), 0, 1023, 0, 180);
  servo.write(angle);
  delay(15);
}
```

### Ultrasonic distance (`ultrasonic`)

Measure distance and print it.

**Parts:** Ultrasonic HC-SR04

### DHT22 on an LCD (`lcd`)

Temperature and humidity on a 16×2 LCD.

**Parts:** DHT22 temp & humidity, LCD 16×2 I2C

```cpp
// DHT22 + I2C LCD
#include <DHT.h>
#include <LiquidCrystal_I2C.h>
DHT dht(7, DHT22);
LiquidCrystal_I2C lcd(0x27, 16, 2);

void setup() {
  dht.begin();
  lcd.init();
  lcd.backlight();
}

void loop() {
  lcd.setCursor(0, 0); lcd.print("Temp: "); lcd.print(dht.readTemperature(), 1); lcd.print((char)223); lcd.print("C ");
  lcd.setCursor(0, 1); lcd.print("Hum:  "); lcd.print(dht.readHumidity(), 1); lcd.print(" %  ");
  delay(2000);
}
```

### OLED hello (`oled`)

Text and a progress bar on the OLED.

**Parts:** OLED 0.96" I2C

### Obstacle-avoiding car (`car`)

Drive forward, turn when something is close.

**Parts:** Ultrasonic HC-SR04, L298N motor driver

```cpp
const int TRIG = 12, ECHO = 13;
const int ENA = 5, IN1 = 7, IN2 = 8, ENB = 6, IN3 = 9, IN4 = 11;

long distanceCM() {
  digitalWrite(TRIG, LOW); delayMicroseconds(2);
  digitalWrite(TRIG, HIGH); delayMicroseconds(10); digitalWrite(TRIG, LOW);
  return pulseIn(ECHO, HIGH, 30000) * 0.0343 / 2;
}

void drive(int l, int r) {
  digitalWrite(IN1, l > 0); digitalWrite(IN2, l < 0); analogWrite(ENA, abs(l));
  digitalWrite(IN3, r > 0); digitalWrite(IN4, r < 0); analogWrite(ENB, abs(r));
}

void setup() {
  pinMode(TRIG, OUTPUT); pinMode(ECHO, INPUT);
  int p[] = {ENA, IN1, IN2, ENB, IN3, IN4};
  for (int i = 0; i < 6; i++) pinMode(p[i], OUTPUT);
}

void loop() {
  long d = distanceCM();
  if (d > 0 && d < 20) { drive(-180, 180); delay(400); }   // turn
  else drive(200, 200);                                   // forward
  delay(50);
}
```

### Keypad (`keypad`)

Read keys from a 4×4 keypad.

**Parts:** Keypad 4×4

### ESP32 web lamp (`espweb`)

Switch an LED from a phone web page.

**Parts:** LED

```cpp
#include <WiFi.h>
#include <WebServer.h>

const int LED = 2;
WebServer server(80);

String page() {
  String s = "<html><head><meta name='viewport' content='width=device-width'>";
  s += "<style>body{font-family:sans-serif;text-align:center}a{display:inline-block;margin:8px;padding:14px 24px;border-radius:12px;background:#2E6BE6;color:#fff;text-decoration:none}</style></head><body>";
  s += "<h2>ESP32 Lamp</h2><p>The LED is <b>" + String(digitalRead(LED) ? "ON" : "OFF") + "</b></p>";
  s += "<a href='/on'>Turn ON</a><a href='/off'>Turn OFF</a></body></html>";
  return s;
}

void setup() {
  pinMode(LED, OUTPUT);
  Serial.begin(115200);
  WiFi.begin("School-Lab", "password");
  while (WiFi.status() != WL_CONNECTED) { delay(300); Serial.print("."); }
  Serial.print("\nOpen http://"); Serial.println(WiFi.localIP());
  server.on("/", [] { server.send(200, "text/html", page()); });
  server.on("/on", [] { digitalWrite(LED, HIGH); server.send(200, "text/html", page()); });
  server.on("/off", [] { digitalWrite(LED, LOW); server.send(200, "text/html", page()); });
  server.begin();
}

void loop() {
  server.handleClient();
}
```

### ESP32 MQTT (`espmqtt`)

Publish a sensor and obey MQTT commands.

**Parts:** LED, Potentiometer

```cpp
#include <WiFi.h>
#include <PubSubClient.h>

WiFiClient wifi;
PubSubClient mqtt(wifi);
const int LED = 2;

void onMessage(char* topic, byte* data, unsigned int len) {
  String msg; for (unsigned int i = 0; i < len; i++) msg += (char)data[i];
  Serial.print(topic); Serial.print(": "); Serial.println(msg);
  digitalWrite(LED, msg == "on");
}

void setup() {
  pinMode(LED, OUTPUT);
  Serial.begin(115200);
  WiFi.begin("School-Lab", "password");
  while (WiFi.status() != WL_CONNECTED) delay(300);
  mqtt.setServer("broker.hivemq.com", 1883);
  mqtt.setCallback(onMessage);
  mqtt.connect("club-esp32");
  mqtt.subscribe("club/lamp");
}

void loop() {
  mqtt.loop();
  static unsigned long t = 0;
  if (millis() - t > 5000) { t = millis(); mqtt.publish("club/sensor", String(analogRead(34)).c_str()); }
}
```


---

## 10. Troubleshooting playbook

When a student says "it does not work", do not guess and do not start with the code. Work the list in order. These are ordered by how often each one is actually the cause in a classroom.

### 10.1 Nothing happens at all

1. **Is it powered?** Is the USB cable in at both ends, and is the board's power LED lit? A surprising number of USB cables are charge-only and carry no data.
2. **Did the sketch actually upload?** Look for "Done uploading". If the IDE says the port is busy, the Serial Monitor is open on it, or the board is not selected under Tools.
3. **Is the right board and port selected?** A clone Uno needs the CH340 driver or it never appears in the port list.
4. **Is the ground connected?** The most common wiring fault in the room. A circuit needs a complete loop. If a module has its own power supply, its ground must still be joined to the board's ground.
5. **Is it on a breadboard row that is actually connected?** The centre channel does not connect across. The power rails run the length of the board but are often broken in the middle on full-size boards.
6. **Is the component the right way round?** LEDs, electrolytic capacitors, diodes, motor driver inputs and most modules care.

### 10.2 The LED does not light

- Backwards. The long leg goes to the positive side.
- No resistor, and it has already burned out. Try a fresh one.
- Wrong pin in the code. The sketch says pin 13 and the wire is in pin 12.
- `pinMode(LED, OUTPUT)` missing from `setup()`.
- The breadboard row is the wrong one by one hole. This happens constantly and is almost invisible.

### 10.3 The sensor reads nonsense, or the same number forever

- **Always the same number:** the pin is probably floating or the wire is in the wrong hole. An analog pin with nothing on it drifts around a value and looks almost plausible.
- **`nan` from a DHT22:** reading it faster than once every two seconds, or no pull-up on the data line.
- **Ultrasonic reads 0 or a huge number:** nothing in range, a soft or angled surface absorbing the pulse, or reading faster than every 60 ms.
- **Soil sensor reads backwards:** it does. Wetter means a lower number, because the probe measures resistance.
- **An analog reading that jumps:** a long unshielded wire, or a motor on the same supply. Averaging ten readings in a row is the usual classroom fix.

### 10.4 The board resets, or behaves randomly when the motor runs

This is nearly always power, and it is worth teaching as a signature rather than a mystery.

- A servo or motor is drawing current from the 5 V pin. Give it its own supply.
- The grounds are not joined between the two supplies.
- The battery is flat enough to sag under load but not flat enough to look dead.
- A motor is generating electrical noise back into the supply. A 0.1 uF capacitor across the motor terminals helps.

### 10.5 The Serial Monitor shows nothing, or garbage

- **Nothing:** `Serial.begin(9600)` missing from `setup()`, or the monitor is on the wrong port.
- **Garbage characters:** the baud rate in the monitor does not match the one in the code. This is the only cause worth checking first.
- **Output stops after a while:** running out of RAM, usually from `String` concatenation in a loop on an Uno.

### 10.6 The code will not compile

Read the **first** error, not the last. Everything after the first is often a consequence of it.

- `expected ';' before ...` means the semicolon is missing at the end of the line **above** the one reported.
- `'x' was not declared in this scope` means a typo, a missing declaration, or using a variable outside the braces it was declared in.
- `no matching function for call to ...` means the right number or type of arguments was not given.
- `... does not name a type` usually means a missing `#include` at the top.
- Missing library: Circuit Lab lists what is available in section 13. If it is not there, it cannot be used in the simulator.

### 10.7 It works in the simulator but not on the real board

This is a good question and deserves a straight answer, because the simulator is deliberately not a perfect model.

- Circuit Lab checks logic and wiring, not exact electrical values. It will happily run a circuit that would brown out in real life.
- Transistors, MOSFETs, diodes and the 555 are behaviour models, not analogue simulations.
- The real world has contact resistance, flat batteries, loose jumper wires and electrical noise. None of those exist on screen.
- On the real board, timing is real. A sketch with a long `delay()` may seem fine in the simulator and feel broken in your hand.

### 10.8 The compile fails with no error, or Circuit Lab says it is offline

Compiling a sketch sends it to an online build service. Everything else in Circuit Lab works without the internet, but this one step does not. If the school connection is down, the circuit can still be built, wired and explored; it just cannot be run.

---

## 11. Safety

Say these once, clearly, at the point they matter. Do not lecture, and do not skip them.

**Mains electricity is never part of a student activity.** Everything in this kit runs from USB or batteries, at 12 V or below. If an activity involves switching a mains appliance through a relay, the mains side is wired by the teacher, with the plug out, and never by a student.

**Lithium cells are the only thing in the kit that can start a fire.** They must not be short-circuited, punctured, charged unattended, or left in a hot car. A cell that is swollen, hot, or smells sweet is disposed of, not used. Charging happens on a hard surface, in sight, through a proper charger module, never from a bench supply directly.

**Hot glue guns reach about 180 C**, which is enough for a real burn, and the glue sticks to skin while it cools. Low-temperature guns at around 120 C are the ones to use with the younger groups. Guns go back on a stand, never face down on the table.

**Soldering**, where it appears, is teacher-supervised: iron on a stand, fume extraction or an open window, eye protection, and a tip temperature not above 350 C.

**The 3D printer nozzle is at about 200 C and the bed at 60 C.** The printer is not opened mid-print and parts come off with the printer off.

**Flames.** The candle used in the flame-sensor activities is lit and held by the teacher, on a heatproof mat, with the rest of the kit well clear.

**Water and electronics.** The plant-watering activities put water near a board. The reservoir stays below the level of the electronics, the pump leads are checked for strain, and laptops are not on the same table.

**Motors and moving parts.** Long hair and loose sleeves are tied back before a motor is powered, and fingers stay out of gear meshes. A robot is tested on the floor or in a tray, not on a desk edge.

**Eye protection** when cutting, drilling, or snipping component legs. A clipped resistor leg travels further than anyone expects.

**Cutting.** Craft knives are teacher-only below Young Innovators, always on a cutting mat, always cutting away from the body.

**Batteries in general.** Do not mix old and new cells, or different chemistries, in the same holder. Remove the batteries before storing a project.

**The rule that covers the rest:** if a student is not sure whether something is safe, the answer is to ask before doing it, and asking is never treated as a silly question.

---

## 12. Glossary

Terms as they are used in this club. Where a child is likely to say something different, that is noted, so an agent can recognise what they mean.

| Term | What it means here | A child might say |
|---|---|---|
| **Actuator** | Anything that makes something happen in the world: motor, servo, buzzer, LED | "the moving bit" |
| **ADC** | Analog-to-digital converter: the circuit that turns a voltage into a number, 0 to 1023 on an Uno | |
| **Analog** | A value anywhere in a range, not just on or off | "in-between" |
| **Anode** | The positive leg of an LED or diode, the long one | "the long leg" |
| **Baud rate** | How fast two devices send serial data, usually 9600 or 115200. Both ends must agree | |
| **Breadboard** | A board with hidden connecting strips, for building without soldering | "the white board with holes" |
| **Cathode** | The negative leg, the short one, with the flat side on an LED | "the short leg" |
| **Compile** | Turning the code you wrote into instructions the chip can run | |
| **Current** | How much electricity is flowing, in amps or milliamps | "how much" |
| **Debounce** | Ignoring the rapid flicker a mechanical switch makes as it closes | |
| **Digital** | One of two states only: HIGH or LOW, on or off | "on or off" |
| **Duty cycle** | The fraction of time a PWM signal spends switched on, 0 to 255 in `analogWrite` | |
| **Firmware** | The program living on the chip itself | |
| **Floating pin** | An input connected to nothing, which reads randomly | |
| **GND / ground** | The common return point every circuit measures against | "the minus" |
| **H-bridge** | Four switches that let current run through a motor either way, so it can reverse | |
| **I2C** | A two-wire bus, SDA and SCL, letting many devices share the same pair | |
| **Input** | A pin the board reads | |
| **Library** | Someone else's code, included so you do not write it again | |
| **LED** | Light-emitting diode: a light that only works one way round | |
| **Logic level** | The voltage that counts as HIGH: 5 V on an Uno, 3.3 V on an ESP32 | |
| **Microcontroller** | A whole small computer on one chip, running one program forever | "the brain" |
| **Ohm's law** | V = I x R | |
| **Output** | A pin the board drives | |
| **Polarity** | Which way round a component has to go | "which way it goes" |
| **Potentiometer** | A knob that acts as an adjustable voltage divider | "the knob" |
| **Pull-up / pull-down** | A resistor that holds an input at a known level when nothing else is driving it | |
| **PWM** | Pulse width modulation: switching on and off fast to fake an in-between level | |
| **Resistance** | How hard it is for current to get through, in ohms | "how narrow" |
| **Resistor** | A component that limits current | |
| **Serial Monitor** | The window that shows what the board prints. The most useful debugging tool in the room | "the text window" |
| **Servo** | A motor that holds a commanded angle | "the arm motor" |
| **Short circuit** | An unintended low-resistance path, usually straight from plus to minus | "a shortcut" |
| **Sketch** | An Arduino program | "the code" |
| **SPI** | A faster four-wire bus with a chip-select line per device | |
| **Stall current** | The current a motor draws when it is prevented from turning. Much higher than running current | |
| **UART / serial** | Two wires, TX and RX, crossed over, at an agreed baud rate | |
| **Variable** | A named box holding a value | |
| **Voltage** | The push, always measured between two points | "the push" |
| **Voltage divider** | Two resistors in series, tapped in the middle to get a smaller voltage | |

**AI terms**

| Term | What it means here |
|---|---|
| **Bias** | A systematic error that comes from the training data not representing the world |
| **Class / label** | The name of a category a model can output, such as "cat" |
| **Dataset** | The collection of examples a model learns from |
| **Feature** | A piece of the input the model actually uses |
| **Inference** | Using a trained model on new input |
| **Model** | The fitted function: the thing that makes a prediction |
| **Overfitting** | Learning the training examples so closely that new ones are handled badly |
| **Training** | Adjusting a model's numbers until it gets the examples right |
| **Validation** | Testing on examples the model never saw. The only honest measure |

---

## 13. Lookup tables

### Every activity, one line each

| Code | Title | Group | Domain | Simulated |
|---|---|---|---|---|
| `F-00 (LE)` | Welcome to Robotics (Distance Alarm) | LE | Foundation | yes |
| `F-01 (LE)` | Arduino Uno Basics | LE | Foundation | yes |
| `F-02 (LE)` | ESP32 Basics | LE | Foundation | yes |
| `F-03 (LE)` | 3D Modelling and Printing | LE | Foundation | no |
| `LE-01` | Light-Up Paper Circuit Card | LE | Electronics & Circuits | yes |
| `LE-02` | Push-Button Doorbell | LE | Electronics & Circuits | yes |
| `LE-03` | Lemon Battery LED Lamp | LE | Power & Energy | yes |
| `LE-04` | Traffic Light Controller | LE | Programming & Logic | yes |
| `LE-05` | Automatic Night Lamp | LE | Sensors & Environment | yes |
| `LE-06` | Hot & Cold Temperature Indicator | LE | Sensors & Environment | yes |
| `LE-07` | Plant Water Alarm | LE | Sensors & Environment | yes |
| `LE-08` | Motion Detector Room Alarm | LE | Security & Safety | yes |
| `LE-09` | Waving Robot Arm | LE | Robotics & Actuation | yes |
| `LE-10` | Automatic Railway Crossing Gate | LE | Robotics & Actuation | yes |
| `LE-11` | Vibrating Brush Robot | LE | Mechanical Design | yes |
| `LE-12` | Morse Code Light Messenger | LE | IoT & Communication | yes |
| `LE-13` | Makey Makey Fruit Piano | LE | Programming & Logic | no |
| `LE-14` | Animated Story App | LE | App, Web & Game Development | no |
| `LE-15` | Catch-the-Fruit Game with Playdough Controller | LE | App, Web & Game Development | no |
| `LE-16` | Robot Sorting Rules Game | LE | AI & Data | no |
| `LE-17` | Robot Chef: Unplugged Algorithms | LE | Programming & Logic | no |
| `LE-18` | Code.org Puzzle Quest: Sequences and Loops | LE | Programming & Logic | no |
| `LE-19` | Program the Robot Car Through a Floor Maze | LE | Robotics & Actuation | yes |
| `LE-20` | ScratchJr Dance Party | LE | App, Web & Game Development | no |
| `LE-21` | Rainbow LED Ring | LE | Electronics & Circuits | yes |
| `LE-22` | Button Melody Maker | LE | Electronics & Circuits | yes |
| `LE-23` | Colour Detective Sensor | LE | Sensors & Environment | yes |
| `LE-24` | Crank-Powered Light: Be the Power Station | LE | Power & Energy | no |
| `LE-25` | My Talking Pet in Scratch | LE | App, Web & Game Development | no |
| `LE-26` | Pixel Messages: Send a Picture with Numbers | LE | IoT & Communication | no |
| `LE-27` | Pop the Bubbles with Your Hand | LE | App, Web & Game Development | no |
| `LE-28` | Cardboard Automaton: Cams and Cranks | LE | Mechanical Design | no |
| `LE-29` | Teach the Computer Our Sounds | LE | AI & Data | no |
| `LE-30` | Follow-Me Robot Pet | LE | Robotics & Actuation | yes |
| `LE-31` | Safety Helper Robot Design | LE | Security & Safety | no |
| `LE-32` | Countdown Rocket Launch | LE | App, Web & Game Development | yes |
| `F-00 (JM)` | Welcome to Robotics (Distance Alarm) | JM | Foundation | yes |
| `F-01 (JM)` | Arduino Uno Basics | JM | Foundation | yes |
| `F-02 (JM)` | ESP32 Basics | JM | Foundation | yes |
| `F-03 (JM)` | 3D Modelling and Printing | JM | Foundation | no |
| `JM-00` | Intro to Robotics + Art Bot | JM | Robotics & Actuation | yes |
| `JM-01` | Series & Parallel Circuit Lab | JM | Electronics & Circuits | yes |
| `JM-02` | Two-Player Reaction Timer with Scoreboard | JM | Programming & Logic | yes |
| `JM-03` | Mini Weather Station with OLED Display | JM | Sensors & Environment | yes |
| `JM-04` | Smart Dustbin with Fill-Level Indicator | JM | Robotics & Actuation | yes |
| `JM-05` | Rain-Sensing Automatic Window | JM | Sensors & Environment | yes |
| `JM-06` | Fire & Gas Safety Alarm Panel | JM | Security & Safety | yes |
| `JM-07` | Temperature-Controlled Smart Fan | JM | Robotics & Actuation | yes |
| `JM-08` | Sun-Tracking Solar Panel | JM | Power & Energy | yes |
| `JM-09` | Home Burglar Alarm with Secret Code | JM | Security & Safety | yes |
| `JM-10` | 3D-Designed Name Badge & Sensor Mount | JM | Mechanical Design | no |
| `JM-11` | Line Following Robot | JM | Robotics & Actuation | yes |
| `JM-12` | Phone-Controlled RGB Mood Lamp | JM | IoT & Communication | yes |
| `JM-13` | Step Counter Fitness Tracker | JM | Sensors & Environment | yes |
| `JM-14` | Weather Report Webpage | JM | App, Web & Game Development | no |
| `JM-15` | Pong Game with a Knob Controller | JM | App, Web & Game Development | yes |
| `JM-16` | AI Recycling Sorter | JM | AI & Data | no |
| `JM-17` | Python Turtle Art: Shapes and Patterns | JM | Programming & Logic | no |
| `JM-18` | MakeCode Arcade: My First Platform Game | JM | App, Web & Game Development | no |
| `JM-19` | Binary Bracelets & Secret Codes | JM | IoT & Communication | no |
| `JM-20` | Joystick Maze Game | JM | App, Web & Game Development | yes |
| `JM-21` | NeoPixel Light Show to the Beat | JM | Electronics & Circuits | yes |
| `JM-22` | 8x8 LED Matrix Emoji Display | JM | Electronics & Circuits | yes |
| `JM-23` | Ultrasonic Theremin: Music in the Air | JM | Sensors & Environment | yes |
| `JM-24` | Processing: Interactive Drawing Machine | JM | App, Web & Game Development | no |
| `JM-25` | Smart Traffic Junction with Car Counter | JM | Sensors & Environment | yes |
| `JM-26` | Smart Kitchen Scale | JM | Sensors & Environment | yes |
| `JM-27` | Arcade Claw Machine | JM | Robotics & Actuation | yes |
| `JM-28` | Wind Turbine Power Lab | JM | Power & Energy | no |
| `JM-29` | Python Number Guessing Game | JM | Programming & Logic | no |
| `JM-30` | Data Detectives: Class Survey Charts | JM | AI & Data | no |
| `JM-31` | AI Emotion Mirror | JM | AI & Data | no |
| `JM-32` | Cyber Safety Escape Room | JM | Security & Safety | yes |
| `F-00 (YI)` | Welcome to Robotics (Distance Alarm) | YI | Foundation | yes |
| `F-01 (YI)` | Arduino Uno Basics | YI | Foundation | yes |
| `F-02 (YI)` | ESP32 Basics | YI | Foundation | yes |
| `F-03 (YI)` | 3D Modelling and Printing | YI | Foundation | no |
| `YI-01` | 555 Timer Alarm Siren Circuit | YI | Electronics & Circuits | no |
| `YI-02` | Heart Rate Monitoring System | YI | Sensors & Environment | yes |
| `YI-03` | Smart Classroom Energy Saver | YI | Power & Energy | yes |
| `YI-04` | Stepper Motor Drawing Plotter | YI | Mechanical Design | yes |
| `YI-05` | Obstacle Avoiding Robot with Scanning Sonar | YI | Robotics & Actuation | yes |
| `YI-06` | Bluetooth Robot Car with Phone App | YI | IoT & Communication | yes |
| `YI-07` | Gesture-Controlled Robot Arm | YI | Robotics & Actuation | yes |
| `YI-08` | RFID Smart Door Lock with Access Log | YI | Security & Safety | yes |
| `YI-09` | Rechargeable Power Pack for Robots | YI | Power & Energy | yes |
| `YI-10` | Wireless Doorbell with Visitor Counter | YI | IoT & Communication | yes |
| `YI-11` | Wi-Fi Automatic Plant Watering System | YI | Sensors & Environment | yes |
| `YI-12` | Plant Monitor Mobile App | YI | App, Web & Game Development | no |
| `YI-13` | Python Maths Quiz Game with Scoreboard | YI | Programming & Logic | no |
| `YI-14` | Personal Portfolio Website | YI | App, Web & Game Development | no |
| `YI-15` | School Helpdesk Chatbot | YI | AI & Data | no |
| `YI-16` | 3D-Printed Plant Monitor Enclosure | YI | Mechanical Design | no |
| `YI-17` | Processing: Generative Art Poster | YI | App, Web & Game Development | no |
| `YI-18` | Processing + Arduino: Live Sensor Radar | YI | Programming & Logic | yes |
| `YI-19` | Python Pygame: Catch the Falling Stars | YI | App, Web & Game Development | no |
| `YI-20` | ESP32-CAM Wildlife Camera | YI | IoT & Communication | no |
| `YI-21` | Python Data Lab: Is Our Classroom Too Hot? | YI | AI & Data | yes |
| `YI-22` | Smart Posture Corrector Wearable | YI | Sensors & Environment | yes |
| `YI-23` | Li-Fi Messenger: Sending Text with Light | YI | IoT & Communication | yes |
| `YI-24` | Python Code Breakers: Caesar to Vigenère | YI | Security & Safety | no |
| `YI-25` | Robot Sumo Challenge | YI | Robotics & Actuation | yes |
| `YI-26` | Walking Linkage Robot | YI | Mechanical Design | yes |
| `YI-27` | Energy Detective: How Much Power Do Gadgets Use? | YI | Power & Energy | yes |
| `YI-28` | Python Control Panel for Arduino | YI | Programming & Logic | yes |
| `YI-29` | p5.js: Flappy Voice Game | YI | App, Web & Game Development | no |
| `YI-30` | Python Weather API Dashboard | YI | IoT & Communication | no |
| `YI-31` | Sign Language Alphabet Recogniser | YI | AI & Data | no |
| `YI-32` | Build Your Own Game Controller | YI | App, Web & Game Development | yes |
| `F-00 (TL)` | Welcome to Robotics (Distance Alarm) | TL | Foundation | yes |
| `F-01 (TL)` | Arduino Uno Basics | TL | Foundation | yes |
| `F-02 (TL)` | ESP32 Basics | TL | Foundation | yes |
| `F-03 (TL)` | 3D Modelling and Printing | TL | Foundation | no |
| `TL-01` | Solar-Powered Off-Grid Weather Node | TL | Power & Energy | yes |
| `TL-02` | Autonomous Maze Solving Robot | TL | Robotics & Actuation | yes |
| `TL-03` | Pick-and-Place Robotic Arm with Record & Replay | TL | Mechanical Design | yes |
| `TL-04` | Fall Detection Wearable for the Elderly | TL | Sensors & Environment | yes |
| `TL-05` | ESP-NOW Wireless Sensor Network | TL | IoT & Communication | yes |
| `TL-06` | Smart Home Cloud Control Hub | TL | IoT & Communication | yes |
| `TL-07` | Smart Parking Occupancy Dashboard | TL | Sensors & Environment | yes |
| `TL-08` | Two-Factor Smart Locker with Intrusion Alerts | TL | Security & Safety | yes |
| `TL-09` | Sensor Data Logging & Analysis Pipeline | TL | AI & Data | yes |
| `TL-10` | Machine Learning Rain Predictor | TL | AI & Data | yes |
| `TL-11` | AI Fake News Detector | TL | AI & Data | no |
| `TL-12` | Web-Controlled Devices via REST API | TL | App, Web & Game Development | yes |
| `TL-13` | Securing an IoT Device | TL | Security & Safety | no |
| `TL-14` | Autonomous Fire-Fighting Robot | TL | Robotics & Actuation | yes |
| `TL-15` | Parametric Robot Gripper Design | TL | Mechanical Design | no |
| `TL-16` | Motion-Controlled Game | TL | App, Web & Game Development | yes |
| `TL-17` | Computer Vision with OpenCV: Colour Tracking | TL | AI & Data | no |
| `TL-18` | Vision-Guided Robot Car | TL | Robotics & Actuation | no |
| `TL-19` | TinyML Gesture Recogniser on ESP32 | TL | AI & Data | yes |
| `TL-20` | Processing: Flocking Simulation (Boids) | TL | Programming & Logic | no |
| `TL-21` | Pathfinding Visualiser: BFS and A* | TL | Programming & Logic | no |
| `TL-22` | Git & GitHub for Engineering Teams | TL | Programming & Logic | no |
| `TL-23` | Smart Microgrid Model | TL | Power & Energy | yes |
| `TL-24` | Noise Pollution Analyser with FFT | TL | Sensors & Environment | no |
| `TL-25` | Robotic Arm Inverse Kinematics | TL | Robotics & Actuation | yes |
| `TL-26` | Robot Swarm: Leader and Follower Cars | TL | Robotics & Actuation | yes |
| `TL-27` | 3D-Printed Gearbox and Gear Ratios | TL | Mechanical Design | yes |
| `TL-28` | Smart Cane for the Visually Impaired | TL | Electronics & Circuits | yes |
| `TL-29` | Air Quality Data Science for Pakistan | TL | AI & Data | no |
| `TL-30` | Neural Network from Scratch | TL | AI & Data | no |
| `TL-31` | 2D Game Development in Godot | TL | App, Web & Game Development | no |
| `TL-32` | Password Security Lab: Hashing and Attacks | TL | Security & Safety | no |

### Every kit item, by how often it is used

| Part | Activities | Age groups |
|---|---|---|
| Laptop | 126 | LE, JM, YI, TL |
| LED 5 mm (assorted) | 73 | LE, JM, YI, TL |
| Jumper wires M-M | 73 | LE, JM, YI, TL |
| Resistor 220 ohm | 70 | LE, JM, YI, TL |
| Breadboard (half size) | 67 | LE, JM, YI, TL |
| Buzzer | 65 | LE, JM, YI, TL |
| Arduino Uno + USB cable | 62 | LE, JM, YI, TL |
| Jumper wires M-F | 55 | LE, JM, YI, TL |
| Resistor 10k ohm | 25 | LE, JM, YI, TL |
| Push button | 21 | LE, JM, YI, TL |
| ESP32 Dev Board + USB cable | 18 | LE, JM, YI, TL |
| OLED 0.96 in I2C | 16 | JM, YI, TL |
| Ultrasonic sensor HC-SR04 | 15 | LE, JM, YI, TL |
| Servo SG90 | 15 | LE, JM, YI, TL |
| Cardboard sheet | 15 | LE, JM, YI, TL |
| 4xAA battery pack | 15 | JM, YI, TL |
| Printed templates | 13 | LE, JM, YI |
| Potentiometer 10k | 12 | LE, JM, YI, TL |
| DHT22 sensor | 11 | LE, JM, YI, TL |
| Markers | 10 | LE, JM, YI |
| LDR module | 9 | LE, JM, YI, TL |
| 3D printer | 8 | LE, JM, YI, TL |
| PLA filament | 8 | LE, JM, YI, TL |
| Android smartphone | 7 | LE, JM, YI, TL |
| Screwdriver set | 7 | LE, JM, YI, TL |
| Tape (paper + double-sided) | 7 | LE, JM, YI |
| DC hobby motor | 7 | LE, JM, YI, TL |
| Digital multimeter | 7 | LE, JM, YI, TL |
| Card / chart paper | 6 | LE, JM |
| PIR motion sensor | 6 | LE, JM, YI, TL |
| L298N motor driver | 6 | JM, YI, TL |
| MPU6050 IMU | 6 | JM, YI, TL |
| 4WD robot car (assembled, L298N) | 5 | LE, YI, TL |
| Webcam | 5 | LE, JM, YI, TL |
| Glue gun + glue sticks | 5 | LE, JM, YI |
| 2WD robot chassis kit | 5 | JM, YI, TL |
| Ice cream sticks | 4 | LE, JM, YI |
| Wooden skewers | 4 | LE, JM, YI, TL |
| Resistor 1k ohm | 4 | JM, YI, TL |
| Joystick module | 4 | JM, YI, TL |
| Relay module (1-channel) | 4 | YI, TL |
| Low-voltage LED lamp (5 V) | 4 | YI, TL |
| 18650 cell + holder | 4 | YI, TL |
| Alligator clip leads | 3 | LE, JM |
| Googly eyes | 3 | LE |
| Small solar panel | 3 | JM, TL |
| IR sensor module | 3 | JM, YI |
| Sound sensor KY-037 | 3 | JM, TL |
| 5 V DC fan | 3 | JM, TL |
| TP4056 charger module | 3 | YI, TL |
| Coin cell CR2032 | 2 | LE |
| Soil moisture sensor | 2 | LE, YI |
| Plant pot with soil | 2 | LE, YI |
| Water container | 2 | LE, YI |
| Makey Makey kit | 2 | LE |
| Tablet | 2 | LE |
| Passive buzzer | 2 | LE, JM |
| RGB LED | 2 | LE, JM |
| Slide switch | 2 | JM |
| 9V battery + snap | 2 | JM, YI |
| Rain sensor | 2 | JM, TL |
| Flame sensor | 2 | JM, TL |
| Candle | 2 | JM, TL |
| Bluetooth module HC-05 | 2 | JM, YI |
| Capacitor 100 uF | 2 | JM, YI |
| 4x4 matrix keypad | 2 | JM, TL |
| Capacitor 10 uF | 2 | YI |
| RFID RC522 + cards | 2 | YI, TL |
| LM2596 buck converter | 2 | YI, TL |
| ESP32-CAM + programmer | 2 | YI, TL |
| Vibration motor module | 2 | YI, TL |
| Servo MG995 | 2 | TL |
| Relay module (4-channel) | 2 | TL |
| Copper tape | 1 | LE |
| Lemons | 1 | LE |
| Galvanized nails | 1 | LE |
| Copper coins | 1 | LE |
| Brush Bot kit | 1 | LE |
| Fruits (bananas etc.) | 1 | LE |
| Aluminium foil | 1 | LE |
| Conductive playdough | 1 | LE |
| WS2812B LED ring (12 LEDs) | 1 | LE |
| Colour sensor TCS34725 | 1 | LE |
| Straws | 1 | LE |
| Plastic or paper cup | 1 | JM |
| Cork | 1 | JM |
| 2xAA battery holder + batteries | 1 | JM |
| MQ-2 gas sensor | 1 | JM |
| WS2812B LED strip (1 m, 30 LEDs) | 1 | JM |
| MAX7219 8x8 LED matrix | 1 | JM |
| Load cell 5 kg + HX711 | 1 | JM |
| 555 timer IC | 1 | YI |
| Capacitor 10 nF | 1 | YI |
| Pulse sensor | 1 | YI |
| Stepper 28BYJ-48 + ULN2003 | 1 | YI |
| NRF24L01 module | 1 | YI |
| Mini water pump + tube | 1 | YI |
| Split pins (paper fasteners) | 1 | YI |
| Current sensor INA219 | 1 | YI |

### Default pin numbers used by Circuit Lab

When a lesson does not say otherwise, these are the pins a part is wired to.

| Pin name on the part | Arduino pin |
|---|---|
| `2` | 8 |
| `A` | 13 |
| `R` | 9 |
| `G` | 10 |
| `B` | 11 |
| `1.l` | 2 |
| `SIG` | A0 |
| `HORZ` | A0 |
| `VERT` | A1 |
| `SEL` | 2 |
| `TRIG` | 9 |
| `ECHO` | 10 |
| `OUT` | 2 |
| `AO` | A0 |
| `DO` | 2 |
| `SDA` | 2 |
| `S` | A0 |
| `DT` | 3 |
| `SCK` | 2 |
| `DIN` | 6 |
| `CS` | 10 |
| `CLK` | 11 |
| `PWM` | 9 |
| `ENA` | 5 |
| `IN1` | 7 |
| `IN2` | 8 |
| `ENB` | 6 |
| `IN3` | 9 |
| `IN4` | 11 |
| `IN` | 7 |
| `TXD` | 2 |
| `RXD` | 3 |
| `RST` | 9 |
| `R1` | 9 |
| `R2` | 8 |
| `R3` | 7 |
| `R4` | 6 |
| `C1` | 5 |
| `C2` | 4 |
| `C3` | 3 |
| `C4` | 2 |

### Arduino libraries available in Circuit Lab

**Built in:** Servo, Wire, SPI, EEPROM, SoftwareSerial, DHT, Adafruit_NeoPixel, FastLED, LiquidCrystal, LiquidCrystal_I2C, Adafruit_GFX, Keypad, MD_Parola, MD_MAX72xx, RTClib, SD, Adafruit_Sensor.

**Added by Circuit Lab:** Adafruit_SSD1306, Adafruit_MPU6050, I2Cdev, MPU6050, HX711, MFRC522, LedControl, Stepper, Adafruit_INA219, Adafruit_TCS34725, SoftwareSerial, esp32_late, ESP32Servo, WiFi, WiFiClient, WiFiServer, WiFiUdp, WiFiAP, WiFiMulti, WiFiClientSecure, ESPmDNS, esp_wifi, WebServer, HTTPClient, PubSubClient, esp_now, BluetoothSerial, Preferences, TM1637Display, IRremote, Adafruit_BMP280, Adafruit_BME280, BH1750, Adafruit_MLX90614, VL53L0X, ADXL345, HMC5883L, Adafruit_SHT31, OneWire, DallasTemperature, SD, TinyGPSPlus, RF24, Adafruit_ILI9341, Adafruit_AHTX0, Adafruit_SGP30, Adafruit_CCS811, SensirionI2CScd4x, MAX30105, Adafruit_AMG88xx, MHZ19, max6675, PCF8574, Adafruit_MCP23X17, Adafruit_ADS1X15, Adafruit_MCP4725, Adafruit_PWMServoDriver, DFRobotDFPlayerMini.


---

## 14. Questions children actually ask

Real questions, with answers pitched at the band most likely to ask them. An agent should adapt the register using section 3.

**"Is the robot alive?"** (LE)
No. It does not eat, grow, or want anything. It follows instructions that a person wrote, very fast, and stops the moment you unplug it. That is what makes it a machine and not an animal.

**"Can the robot think?"** (LE, JM)
It can compare numbers and choose between two things, and that is all "think" means in robotics. It cannot want anything, be bored, or decide to do something nobody asked for. When your program says "if closer than 20, beep", the robot is not worried about you being close. It is comparing two numbers.

**"Why does my LED not light up?"** (all)
Six things, in order: it is in backwards, there is no resistor and it has blown, the wire is one hole out on the breadboard, the pin number in the code is not the pin the wire is in, `pinMode` is missing, or the ground is not connected. Check them in that order and you will find it.

**"Which leg is positive?"** (LE, JM)
The long one. If the legs have been cut, look for the flat edge on the rim of the plastic; that side is negative.

**"Why do I need a resistor?"** (JM, YI)
See the four-way answer in section 3.5. Short version: an LED does not limit its own current, so something else has to.

**"Why does my servo make the Arduino restart?"** (JM, YI)
Because it is pulling more current than the board can give. A small servo can draw 650 mA when it strains; the whole Arduino chip can supply about 200 mA. Give the servo its own batteries and join the two grounds together.

**"What does `delay(1000)` do?"** (JM)
It stops everything for one second. Not just the line below it: the whole program. Your sensor is not read, your button is not noticed. When you want things to happen at the same time, use the `millis()` pattern instead.

**"Why is it 1023 and not 1000?"** (JM, YI)
Because the converter uses 10 bits, and 10 bits can count 1024 different values, from 0 to 1023. Not a round number in our counting, but a very round number in the computer's.

**"Can I break it?"** (all)
Mostly no, and you should experiment freely. The few things that do break it: 5 V into a 3.3 V board, connecting plus straight to minus, powering a motor from the 5 V pin, and putting a chip in backwards. Ask before doing any of those four and everything else is fair game.

**"Why does it work in the simulator but not on the table?"** (JM, YI)
See section 10.7. The short answer is that the simulator checks your logic and your wiring, and the real world also has flat batteries, loose wires and components that get warm.

**"How does the sensor know how far away I am?"** (LE, JM)
It shouts too high for you to hear, and times the echo. Sound travels about 343 metres per second, so if the echo takes 580 microseconds to come back, the sound went 20 cm there and 20 cm back.

**"Is AI going to take my job?"** (YI, TL)
Honest answer: it will change a lot of jobs and remove some. It is very good at tasks that look like patterns in data, and much worse at things needing judgement, physical skill or responsibility for a decision. The useful move is not to guess which way it goes, but to be the person who understands how the thing works, which is what you are doing here.

**"Is AI alive / does it understand me?"** (all)
No. A language model finds patterns in enormous amounts of text. An image classifier finds patterns in pixels. Neither has a body, a memory of yesterday, or anything it wants. It can produce a sentence that sounds like understanding, and that is a genuinely hard thing to tell apart, which is exactly why it is worth learning how it works.

**"Can the AI be wrong?"** (JM, YI)
Often, and confidently. It only knows what was in its training data. Show a classifier trained only on indoor cats a cat sitting on grass and it may well say "dog", because it quietly learned that grass means dog.

**"Why do we build in a simulator instead of with the real parts?"** (all)
Three reasons: nobody waits for a component to be free, nothing gets damaged while you are trying things, and you can make a mistake, see what happens, and undo it. The real parts come out once you know what you are building.

**"Can I take my project home?"** (all)
That is up to the teacher and depends on the kit. What you can always take home is the circuit file and the code: Circuit Lab will download them, and the link carries the whole circuit.

**"What is the hardest part of making a robot?"** (YI, TL)
Not the code, and not the wiring. It is deciding exactly what it should do, in enough detail that it can be written down. Most projects that stall have not been specified, they have only been imagined.

**"Why is my code not working when it looks the same as the example?"** (all)
It almost never is the same. Compare them character by character, or paste both and diff them. Capital letters matter, semicolons matter, and `=` is not `==`.

**"What should I build?"** (all)
Ask what annoys them at home. The best projects in this club have come from "the plants die when we go away", "my brother comes into my room", and "I cannot tell if the gate is open". Then find the nearest activity in section 6 and start from its circuit.
