/* Circuit Lab - part catalogue, round 3: logic chips, analogue chips and counters.
   Every chip here is a real DIP package drawn by cl-dip, with the manufacturer pin order. */

import "./elements5.js?v=15";

/* truth-table sketch shared by the six gate chips: drive A and B, read Y, print the table */
const gateCode = (name, sym, expr) => `// ${name}: the ${sym} gate, checked against its truth table
// Wire gate 1 only: A -> pin {1A}, B -> pin {1B}, Y -> pin {1Y}
// VCC -> 5V, GND -> GND. Unused inputs should go to GND, never left floating.
const int A = {1A};
const int B = {1B};
const int Y = {1Y};

void setup() {
  pinMode(A, OUTPUT); pinMode(B, OUTPUT); pinMode(Y, INPUT);
  Serial.begin(9600);
  Serial.println("A B | Y   (${sym})");
  for (int a = 0; a <= 1; a++) {
    for (int b = 0; b <= 1; b++) {
      digitalWrite(A, a); digitalWrite(B, b);
      delay(5);                                  // let the chip settle
      int y = digitalRead(Y);
      Serial.print(a); Serial.print(" "); Serial.print(b);
      Serial.print(" | "); Serial.print(y);
      Serial.println(y == (${expr}) ? "   ok" : "   <- unexpected");
    }
  }
  Serial.println("Done. The chip did the logic, not the code.");
}

void loop() {}
`;

const notCode = `// 74HC04: the NOT gate turns a 1 into a 0
// A -> pin {1A}, Y -> pin {1Y}, VCC -> 5V, GND -> GND
const int A = {1A};
const int Y = {1Y};

void setup() {
  pinMode(A, OUTPUT); pinMode(Y, INPUT);
  Serial.begin(9600);
  Serial.println("A | Y   (NOT)");
}

void loop() {
  for (int a = 0; a <= 1; a++) {
    digitalWrite(A, a);
    delay(5);
    Serial.print(a); Serial.print(" | "); Serial.println(digitalRead(Y));
    delay(700);
  }
}
`;

const G14 = "1A,1B,1Y,2A,2B,2Y,GND,3Y,3A,3B,4Y,4A,4B,VCC";          // 7400 / 7408 / 7432 / 7486
const PW = { vcc: ["VCC"], gnd: ["GND"] };

const gate = (label, sym, expr, names, extra = {}) => Object.assign({
  tag: "cl-logic", label, cat: "Basics", kind: "module",
  attrs: { label: label.split(" ")[0], names, sub: sym },
  pw: PW, kit: [label],
  defaults: { "1A": 2, "1B": 3, "1Y": 4 }, defaultsEsp: { "1A": 4, "1B": 5, "1Y": 18 },
  code: gateCode(label, sym, expr),
}, extra);

export const PARTS5 = {
  /* ---------------- the six logic gate chips ---------------- */
  hc08: gate("74HC08 AND gate", "AND", "(a && b)", G14, {
    help: "Four AND gates in one chip. Y goes high only when both A and B are high. Power VCC to 5 V and GND to ground, and tie any unused input to GND.",
  }),
  hc32: gate("74HC32 OR gate", "OR", "(a || b)", G14, {
    help: "Four OR gates. Y goes high when either input is high. Power VCC to 5 V and GND to ground.",
  }),
  hc00: gate("74HC00 NAND gate", "NAND", "(!(a && b))", G14, {
    help: "Four NAND gates. Y is low only when both inputs are high. NAND is the universal gate: every other gate can be built from NANDs alone.",
  }),
  hc02: gate("74HC02 NOR gate", "NOR", "(!(a || b))", "1Y,1A,1B,2Y,2A,2B,GND,3A,3B,3Y,4A,4B,4Y,VCC", {
    help: "Four NOR gates. Y is high only when both inputs are low. Careful: on this chip the output comes first, so pin 1 is 1Y and not 1A.",
    defaults: { "1A": 2, "1B": 3, "1Y": 4 },
  }),
  hc86: gate("74HC86 XOR gate", "XOR", "(a != b)", G14, {
    help: "Four XOR gates. Y is high when the inputs are different. Two XORs plus an AND make a half adder, which is where binary arithmetic starts.",
  }),
  hc04: {
    tag: "cl-logic", label: "74HC04 NOT gate", cat: "Basics", kind: "module",
    attrs: { label: "74HC04", names: "1A,1Y,2A,2Y,3A,3Y,GND,4Y,4A,5Y,5A,6Y,6A,VCC", sub: "NOT" },
    pw: PW, kit: ["74HC04 hex inverter"],
    help: "Six inverters in one chip. Each Y is the opposite of its A. Useful for making an active-low signal active-high, and for building a ring oscillator.",
    defaults: { "1A": 2, "1Y": 4 }, defaultsEsp: { "1A": 4, "1Y": 18 },
    code: notCode,
  },

  /* ---------------- D flip-flop ---------------- */
  hc74: {
    tag: "cl-dip", label: "74HC74 D flip-flop", cat: "Basics", kind: "module",
    attrs: { label: "74HC74", names: "1CLR,1D,1CLK,1PRE,1Q,1QN,GND,2QN,2Q,2PRE,2CLK,2D,2CLR,VCC", sub: "D-FF" },
    pw: PW, kit: ["74HC74 dual D flip-flop"],
    help: "A one-bit memory. On the rising edge of CLK it copies D to Q and holds it. CLR and PRE are active low, so tie both to VCC unless you are using them. This is the building block of counters and registers.",
    defaults: { "1D": 2, "1CLK": 3, "1Q": 4, "1CLR": 5, "1PRE": 6 },
    defaultsEsp: { "1D": 4, "1CLK": 5, "1Q": 18, "1CLR": 19, "1PRE": 21 },
    code: `// 74HC74: a flip-flop remembers one bit
// D -> {1D}, CLK -> {1CLK}, Q -> {1Q}, CLR -> {1CLR}, PRE -> {1PRE}
const int D = {1D}, CLK = {1CLK}, Q = {1Q}, CLR = {1CLR}, PRE = {1PRE};

void tick() { digitalWrite(CLK, LOW); delay(2); digitalWrite(CLK, HIGH); delay(2); }

void setup() {
  pinMode(D, OUTPUT); pinMode(CLK, OUTPUT); pinMode(Q, INPUT);
  pinMode(CLR, OUTPUT); pinMode(PRE, OUTPUT);
  digitalWrite(CLR, HIGH); digitalWrite(PRE, HIGH);   // both are active low: off
  Serial.begin(9600);
}

void loop() {
  digitalWrite(D, HIGH); tick();
  Serial.print("stored a 1, Q = "); Serial.println(digitalRead(Q));
  digitalWrite(D, LOW);                               // D changes but Q must not
  delay(300);
  Serial.print("D is now 0 but Q is still "); Serial.println(digitalRead(Q));
  tick();
  Serial.print("after the clock, Q = "); Serial.println(digitalRead(Q));
  Serial.println("---");
  delay(900);
}
`,
  },

  /* ---------------- parallel-in serial-out shift register ---------------- */
  hc165: {
    tag: "cl-dip", label: "74HC165 input expander", cat: "Basics", kind: "module",
    attrs: { label: "74HC165", names: "SHLD,CLK,D4,D5,D6,D7,Q7N,GND,Q7,SER,D0,D1,D2,D3,CE,VCC", sub: "PISO" },
    pw: PW, kit: ["74HC165 shift register"],
    help: "The mirror image of the 74HC595: it turns eight inputs into three pins. Pull SHLD low to snapshot D0..D7, then clock the bits out of Q7. Tie CE and SER to GND.",
    defaults: { SHLD: 8, CLK: 12, Q7: 11 }, defaultsEsp: { SHLD: 5, CLK: 18, Q7: 23 },
    code: `// 74HC165: read eight switches with three pins
const int LOAD = {SHLD};   // SH/LD, active low
const int CLOCK = {CLK};
const int DATA = {Q7};

byte readEight() {
  digitalWrite(LOAD, LOW); delayMicroseconds(5);   // snapshot the eight inputs
  digitalWrite(LOAD, HIGH);
  byte b = 0;
  // read first, then clock. shiftIn() clocks first, which would throw D7 away.
  for (int i = 7; i >= 0; i--) {
    if (digitalRead(DATA)) b |= (1 << i);
    digitalWrite(CLOCK, HIGH); delayMicroseconds(2);
    digitalWrite(CLOCK, LOW);
  }
  return b;
}

void setup() {
  pinMode(LOAD, OUTPUT); pinMode(CLOCK, OUTPUT); pinMode(DATA, INPUT);
  digitalWrite(LOAD, HIGH);
  Serial.begin(9600);
}

void loop() {
  byte b = readEight();
  Serial.print("inputs: ");
  for (int i = 7; i >= 0; i--) Serial.print((b >> i) & 1);
  Serial.println();
  delay(400);
}
`,
  },

  /* ---------------- decade counter ---------------- */
  cd4017: {
    tag: "cl-dip", label: "CD4017 decade counter", cat: "Basics", kind: "module",
    attrs: { label: "CD4017", names: "Q5,Q1,Q0,Q2,Q6,Q7,Q3,GND,Q8,Q4,Q9,CO,CE,CLK,MR,VCC", sub: "1-of-10" },
    pw: PW, kit: ["CD4017 decade counter"],
    help: "Counts clock pulses and lights one of ten outputs at a time, Q0 to Q9. Pulse MR to go back to Q0 and tie CE to GND. Ten LEDs on the outputs make a chaser with no code in the loop.",
    defaults: { CLK: 2, MR: 3 }, defaultsEsp: { CLK: 4, MR: 5 },
    code: `// CD4017: the chip walks the light along, the Arduino only ticks
const int CLK = {CLK};
const int RESET = {MR};

void setup() {
  pinMode(CLK, OUTPUT); pinMode(RESET, OUTPUT);
  digitalWrite(RESET, HIGH); delay(5); digitalWrite(RESET, LOW);   // start at Q0
  Serial.begin(9600);
}

void loop() {
  for (int i = 0; i < 10; i++) {
    digitalWrite(CLK, HIGH); delay(2); digitalWrite(CLK, LOW);
    Serial.print("now on Q"); Serial.println(i);
    delay(250);
  }
  digitalWrite(RESET, HIGH); delay(5); digitalWrite(RESET, LOW);
}
`,
  },

  /* ---------------- BCD to seven segment ---------------- */
  cd4511: {
    tag: "cl-dip", label: "CD4511 BCD to 7-seg", cat: "Displays", kind: "module",
    attrs: { label: "CD4511", names: "B,C,LE,BL,LT,D,A,GND,SE,SD,SC,SB,SA,SG,SF,VCC", sub: "decoder" },
    pw: PW, kit: ["CD4511 BCD decoder"],
    help: "Give it a number in binary on A B C D and it drives a seven segment display directly. Tie LE to GND to follow the inputs, and BL and LT to VCC. Four pins instead of seven.",
    defaults: { A: 2, B: 3, C: 4, D: 5 }, defaultsEsp: { A: 4, B: 5, C: 18, D: 19 },
    code: `// CD4511: send a digit in binary, the chip lights the segments
const int PINS[4] = { {A}, {B}, {C}, {D} };   // A is the ones bit

void showDigit(int n) {
  for (int i = 0; i < 4; i++) digitalWrite(PINS[i], (n >> i) & 1);
}

void setup() {
  for (int i = 0; i < 4; i++) pinMode(PINS[i], OUTPUT);
  Serial.begin(9600);
}

void loop() {
  for (int n = 0; n <= 9; n++) {
    showDigit(n);
    Serial.print("showing "); Serial.println(n);
    delay(600);
  }
}
`,
  },

  /* ---------------- analogue multiplexer ---------------- */
  cd4051: {
    tag: "cl-dip", label: "CD4051 analog mux", cat: "Basics", kind: "module",
    attrs: { label: "CD4051", names: "Y4,Y6,Z,Y7,Y5,EN,VEE,GND,S2,S1,S0,Y3,Y0,Y1,Y2,VCC", sub: "8-to-1" },
    pw: PW, kit: ["CD4051 multiplexer"],
    help: "Reads eight analogue inputs through one analogue pin. Pick the channel with the three select pins S0 S1 S2, then read Z. Tie EN and VEE to GND.",
    defaults: { S0: 2, S1: 3, S2: 4, Z: "A0" }, defaultsEsp: { S0: 4, S1: 5, S2: 18, Z: 34 },
    code: `// CD4051: eight sensors, one analogue pin
const int S0 = {S0}, S1 = {S1}, S2 = {S2};
const int Z = {Z};

int readChannel(int ch) {
  digitalWrite(S0, ch & 1); digitalWrite(S1, (ch >> 1) & 1); digitalWrite(S2, (ch >> 2) & 1);
  delayMicroseconds(50);          // let the switch settle before reading
  return analogRead(Z);
}

void setup() {
  pinMode(S0, OUTPUT); pinMode(S1, OUTPUT); pinMode(S2, OUTPUT);
  Serial.begin(9600);
}

void loop() {
  for (int ch = 0; ch < 8; ch++) {
    Serial.print("ch"); Serial.print(ch); Serial.print(" = "); Serial.print(readChannel(ch));
    Serial.print("   ");
  }
  Serial.println();
  delay(500);
}
`,
  },

  /* ---------------- op-amp ---------------- */
  lm358: {
    tag: "cl-dip", label: "LM358 op-amp", cat: "Basics", kind: "module",
    attrs: { label: "LM358", names: "OUT1,IN1N,IN1P,GND,IN2P,IN2N,OUT2,VCC", sub: "op-amp" },
    pw: { vcc: ["VCC"], gnd: ["GND"] }, kit: ["LM358 op-amp"],
    help: "Two op-amps in one chip. Wired as a follower (OUT to IN-) it copies the voltage on IN+ without loading it. With two resistors it multiplies a small signal so the Arduino can read it.",
    props: [{ k: "gain", label: "Gain set by your resistors", type: "range", min: 1, max: 20, step: 1, unit: "x", sim: true, live: true }],
    defaults: { IN1P: "A0", OUT1: "A1" }, defaultsEsp: { IN1P: 34, OUT1: 35 },
    code: `// LM358 as a follower: OUT copies IN+ but can drive a load
const int OUT = {OUT1};

void setup() { Serial.begin(9600); }

void loop() {
  int raw = analogRead(OUT);
  Serial.print("op-amp output: "); Serial.print(raw);
  Serial.print("  = "); Serial.print(raw * 5.0 / 1023.0, 2); Serial.println(" V");
  delay(400);
}
`,
  },

  /* ---------------- comparator ---------------- */
  lm393: {
    tag: "cl-dip", label: "LM393 comparator", cat: "Basics", kind: "module",
    attrs: { label: "LM393", names: "OUT1,IN1N,IN1P,GND,IN2P,IN2N,OUT2,VCC", sub: "compare" },
    pw: { vcc: ["VCC"], gnd: ["GND"] }, kit: ["LM393 comparator", "10k resistor (pull-up)"],
    help: "Compares two voltages and answers with one bit: OUT goes low when IN+ is below IN-. The output is open collector, so it needs a pull-up resistor to VCC. This is the chip inside most sensor modules with a threshold screw.",
    props: [{ k: "ref", label: "Reference on IN-", type: "range", min: 0, max: 5, step: 0.1, unit: "V", sim: true, live: true }],
    defaults: { IN1P: "A0", OUT1: 2 }, defaultsEsp: { IN1P: 34, OUT1: 18 },
    code: `// LM393: a threshold in hardware, no analogRead needed
const int OUT = {OUT1};     // open collector: needs a pull-up to VCC

void setup() {
  pinMode(OUT, INPUT_PULLUP);   // stands in for the 10k pull-up the chip needs
  Serial.begin(9600);
}

void loop() {
  // OUT is low when IN+ sits below the reference on IN-
  Serial.println(digitalRead(OUT) == LOW ? "below the threshold" : "above the threshold");
  delay(300);
}
`,
  },

  /* ---------------- Darlington driver ---------------- */
  uln2003: {
    tag: "cl-dip", label: "ULN2003 driver", cat: "Motion", kind: "module",
    attrs: { label: "ULN2003", names: "IN1,IN2,IN3,IN4,IN5,IN6,IN7,GND,COM,OUT7,OUT6,OUT5,OUT4,OUT3,OUT2,OUT1", sub: "7 ch" },
    pw: { gnd: ["GND"] }, kit: ["ULN2003 driver"],
    help: "Seven switches that each sink far more current than an Arduino pin can. Drive IN and the matching OUT pulls down to ground, so the load goes between OUT and the positive supply. COM carries the built-in flyback diodes for coils.",
    defaults: { IN1: 8, IN2: 9, IN3: 10, IN4: 11 }, defaultsEsp: { IN1: 18, IN2: 19, IN3: 21, IN4: 22 },
    code: `// ULN2003: four channels switching coils or lamps
const int IN[4] = { {IN1}, {IN2}, {IN3}, {IN4} };

void setup() {
  for (int i = 0; i < 4; i++) pinMode(IN[i], OUTPUT);
  Serial.begin(9600);
}

void loop() {
  for (int i = 0; i < 4; i++) {                 // one channel at a time
    for (int j = 0; j < 4; j++) digitalWrite(IN[j], j == i);
    Serial.print("channel "); Serial.println(i + 1);
    delay(300);
  }
}
`,
  },
  /* ---------------- PNP transistor ---------------- */
  pnp: {
    tag: "cl-to92", label: "PNP transistor", cat: "Basics", kind: "bb",
    bb3: { first: "E", vcc: "E", sig: "B" },
    attrs: { label: "2N3906", p1: "E", p2: "B", p3: "C", color: "#17171A" },
    kit: ["PNP transistor 2N3906", "PNP transistor BC557"],
    help: "The mirror image of an NPN. The emitter goes to the positive rail and it switches on when the base is pulled LOW, through a 1k resistor. Handy for switching the positive side of a load. Circuit Lab treats it as an on/off switch.",
    defaults: { B: 9 }, defaultsEsp: { B: 25 },
    code: `// PNP: LOW on the base turns the load ON. That trips people up every time.
const int BASE = {B};   // through a 1k resistor to the base

void setup() {
  pinMode(BASE, OUTPUT);
  digitalWrite(BASE, HIGH);   // HIGH = off for a PNP
  Serial.begin(9600);
}

void loop() {
  digitalWrite(BASE, LOW);  Serial.println("base LOW  -> load on");  delay(900);
  digitalWrite(BASE, HIGH); Serial.println("base HIGH -> load off"); delay(900);
}
`,
  },

  /* ---------------- Zener diode ---------------- */
  zener: {
    tag: "cl-diode", label: "Zener diode 5.1 V", cat: "Power", kind: "bb", bb2: { first: "K" },
    attrs: { label: "1N4733" }, kit: ["Zener diode 1N4733 5.1V"],
    props: [{ k: "vz", label: "Zener voltage", type: "range", min: 2.4, max: 12, step: 0.1, unit: " V", sim: true, live: true }],
    help: "Backwards, a Zener holds its cathode at a fixed voltage. Cathode to the supply through a resistor and anode to ground, and you have a simple reference that clamps anything above the Zener voltage.",
    code: `// Zener clamp: read the voltage it holds, whatever the supply does
void setup() { Serial.begin(9600); }

void loop() {
  int raw = analogRead(A0);                     // A0 on the cathode side
  Serial.print("clamped at ");
  Serial.print(raw * 5.0 / 1023.0, 2);
  Serial.println(" V");
  delay(500);
}
`,
  },

  /* ---------------- optocoupler ---------------- */
  opto: {
    tag: "cl-dip", label: "Optocoupler 4N35", cat: "Communication", kind: "module",
    attrs: { label: "4N35", names: "A,K,NC1,E,C,B", sub: "isolate" },
    kit: ["Optocoupler 4N35", "220 ohm resistor", "10k resistor (pull-up)"],
    help: "Two circuits that talk with light and share no wires at all. Drive the LED side through a 220 ohm resistor on A, and the transistor side switches between C and E. Use it when the other side runs at a different voltage, or when you want to protect the board.",
    defaults: { A: 9, C: 2 }, defaultsEsp: { A: 25, C: 18 },
    code: `// 4N35: the two sides never touch. Light crosses the gap, not current.
const int LED_SIDE = {A};    // through a 220 ohm resistor
const int OUT_SIDE = {C};    // needs a pull-up; the internal one will do

void setup() {
  pinMode(LED_SIDE, OUTPUT);
  pinMode(OUT_SIDE, INPUT_PULLUP);
  Serial.begin(9600);
}

void loop() {
  digitalWrite(LED_SIDE, HIGH); delay(60);
  Serial.print("LED on  -> other side reads "); Serial.println(digitalRead(OUT_SIDE));
  digitalWrite(LED_SIDE, LOW); delay(60);
  Serial.print("LED off -> other side reads "); Serial.println(digitalRead(OUT_SIDE));
  delay(700);
}
`,
  },

  /* ---------------- linear regulator ---------------- */
  lm7805: {
    tag: "cl-to220", label: "7805 regulator", cat: "Power", kind: "bb",
    bb3: { first: "IN", gnd: "GND" },
    attrs: { label: "LM7805", p1: "IN", p2: "GND", p3: "OUT" }, kit: ["LM7805 voltage regulator", "Capacitor 100 uF", "Capacitor 0.1 uF"],
    help: "Takes anything from about 7 V to 20 V in and gives a steady 5 V out. It throws the difference away as heat, so a 12 V input runs warm. A capacitor on each side keeps it stable.",
    code: `// 7805: check the rail it is holding, and prove it needs enough headroom
void setup() { Serial.begin(9600); }

void loop() {
  int raw = analogRead(A0);                      // A0 on the OUT pin
  float v = raw * 5.0 / 1023.0;
  Serial.print("regulated rail: "); Serial.print(v, 2); Serial.println(" V");
  if (v < 4.8) Serial.println("  too low: the input needs about 2 V more than the output");
  delay(600);
}
`,
  },

  /* ---------------- bridge rectifier ---------------- */
  bridge: {
    tag: "cl-bridge", label: "Bridge rectifier", cat: "Power", kind: "module",
    attrs: { label: "KBP206" }, kit: ["Bridge rectifier KBP206"],
    props: [{ k: "vac", label: "AC input", type: "range", min: 0, max: 24, step: 0.5, unit: " V", sim: true, live: true }],
    help: "Four diodes that turn alternating current into one-way current. Either AC leg can be either way round, and the plus and minus pins always come out the same polarity. This is the first block of almost every mains power supply.",
    code: `// Bridge rectifier: the output is one-way whichever way the AC went in
void setup() { Serial.begin(9600); }

void loop() {
  int raw = analogRead(A0);                      // A0 on the + output, through a divider
  Serial.print("rectified output: ");
  Serial.print(raw * 5.0 / 1023.0, 2);
  Serial.println(" V (never negative)");
  delay(500);
}
`,
  },

  /* ---------------- inductor ---------------- */
  inductor: {
    tag: "cl-inductor", label: "Inductor", cat: "Basics", kind: "bb", bb2: { first: "1" },
    attrs: { label: "100 uH" }, kit: ["Inductor 100 uH"],
    help: "A coil that fights any change in the current through it, the way a capacitor fights a change in voltage. Switch it off suddenly and it kicks back hard, which is why coils get a diode across them. It is the heart of a buck converter.",
    code: `// An inductor resists a change in current, so the rise is not instant.
// Switch it through a transistor and watch the current build up.
const int DRIVE = 9;

void setup() { pinMode(DRIVE, OUTPUT); Serial.begin(9600); }

void loop() {
  digitalWrite(DRIVE, HIGH);
  for (int i = 0; i < 6; i++) { Serial.print("building: "); Serial.println(analogRead(A0)); delay(40); }
  digitalWrite(DRIVE, LOW);
  Serial.println("off: the coil kicks back, which is what the diode is for");
  delay(900);
}
`,
  },

  /* ---------------- phototransistor ---------------- */
  phototrans: {
    tag: "cl-to92", label: "Phototransistor", cat: "Sensors", kind: "bb",
    bb3: { first: "C", vcc: "C", sig: "E" },
    attrs: { label: "LTR-4206", p1: "C", p2: "E", p3: "NC", color: "#3A3326" },
    kit: ["Phototransistor LTR-4206", "10k resistor"],
    props: [{ k: "light", label: "Light on the sensor", type: "range", min: 0, max: 100, step: 1, unit: " %", sim: true, live: true }],
    help: "Like an LDR but much faster, which is why it is used for counting and for optical switches rather than for ambient light. Collector to the positive rail, emitter through a 10k resistor to ground, and read the emitter.",
    defaults: { E: "A0" }, defaultsEsp: { E: 34 },
    code: `// Phototransistor: fast enough to count things going past
void setup() { Serial.begin(9600); }

void loop() {
  int raw = analogRead({E});
  Serial.print("light: "); Serial.print(raw);
  Serial.println(raw > 600 ? "  bright" : raw > 200 ? "  dim" : "  dark");
  delay(250);
}
`,
  },

  /* ---------------- limit switch ---------------- */
  limitsw: {
    tag: "cl-limitsw", label: "Limit switch", cat: "Input", kind: "module",
    kit: ["Limit switch (lever microswitch)"],
    sim: { pressed: false },
    props: [{ k: "pressed", label: "Lever pressed", type: "toggle", sim: true, live: true }],
    help: "The switch a robot uses to find out it has reached the end. COM joins NC while the lever is free and jumps to NO when something presses it. Wire COM to ground and NC or NO to a pin set to INPUT_PULLUP.",
    defaults: { NO: 2 }, defaultsEsp: { NO: 18 },
    code: `// Limit switch: an endstop. Press the lever in the inspector while it runs.
const int SW = {NO};        // COM goes to GND

void setup() {
  pinMode(SW, INPUT_PULLUP);   // reads HIGH until the switch closes to ground
  Serial.begin(9600);
}

void loop() {
  if (digitalRead(SW) == LOW) Serial.println("end reached: stop the motor");
  else                        Serial.println("travelling");
  delay(300);
}
`,
  },

  /* ---------------- DRV8825 ---------------- */
  drv8825: {
    tag: "cl-a4988", label: "DRV8825 stepper driver", cat: "Motion", kind: "module",
    pw: { vcc: ["VDD"], gnd: ["GND"] }, kit: ["DRV8825 stepper driver"],
    help: "The A4988's bigger brother: same STEP and DIR pins and the same wiring, but it takes more current and divides a step up to 32 ways. Wire RST to SLP or it stays asleep.",
    defaults: { STEP: 3, DIR: 2, EN: 4 }, defaultsEsp: { STEP: 26, DIR: 27, EN: 25 },
    code: `// DRV8825: one pulse on STEP is one step, DIR picks the direction
const int STEP_PIN = {STEP};
const int DIR_PIN = {DIR};
const int EN_PIN = {EN};

void step(int n, bool forward) {
  digitalWrite(DIR_PIN, forward ? HIGH : LOW);
  for (int i = 0; i < n; i++) {
    digitalWrite(STEP_PIN, HIGH); delayMicroseconds(800);
    digitalWrite(STEP_PIN, LOW);  delayMicroseconds(800);
  }
}

void setup() {
  pinMode(STEP_PIN, OUTPUT); pinMode(DIR_PIN, OUTPUT); pinMode(EN_PIN, OUTPUT);
  digitalWrite(EN_PIN, LOW);         // LOW enables the driver
  Serial.begin(9600);
}

void loop() {
  Serial.println("200 steps forward");  step(200, true);  delay(600);
  Serial.println("200 steps back");     step(200, false); delay(600);
}
`,
  },
};
