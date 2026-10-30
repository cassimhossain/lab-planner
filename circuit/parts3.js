/* Circuit Lab - part catalogue, round 2: chips, drivers and multi-digit displays. */
import "./elements3.js?v=22";

const v = (k, label, min, max, unit = "", step = 1) => ({ k, label, type: "range", min, max, step, unit, sim: true, live: true });

export const PARTS3 = {
  /* ---------------- shift register ---------------- */
  sr595: {
    tag: "cl-dip", label: "Shift register 74HC595", cat: "Basics", kind: "module",
    attrs: { label: "74HC595", names: "Q1,Q2,Q3,Q4,Q5,Q6,Q7,GND,Q7S,MR,SHCP,STCP,OE,DS,Q0,VCC" },
    pw: { vcc: ["VCC"], gnd: ["GND"] }, kit: ["74HC595 shift register"],
    help: "Turns three pins into eight outputs. Shift the bits in on DS with a clock on SHCP, then pulse STCP to show them. Tie OE to GND and MR to VCC. Chain more chips from Q7S.",
    defaults: { DS: 11, SHCP: 12, STCP: 8 }, defaultsEsp: { DS: 23, SHCP: 18, STCP: 5 },
    code: `// 74HC595: eight LEDs from three pins
const int DATA = {DS};     // DS   (pin 14)
const int CLOCK = {SHCP};  // SHCP (pin 11)
const int LATCH = {STCP};  // STCP (pin 12)

void showByte(byte b) {
  digitalWrite(LATCH, LOW);
  shiftOut(DATA, CLOCK, MSBFIRST, b);
  digitalWrite(LATCH, HIGH);
}

void setup() {
  pinMode(DATA, OUTPUT); pinMode(CLOCK, OUTPUT); pinMode(LATCH, OUTPUT);
  Serial.begin(9600);
}

void loop() {
  for (int i = 0; i < 8; i++) {      // a light that runs along
    showByte(1 << i);
    Serial.println(1 << i, BIN);
    delay(140);
  }
  showByte(0b10101010); delay(400);
  showByte(0b01010101); delay(400);
}
`,
  },

  /* ---------------- displays ---------------- */
  seg4: {
    tag: "cl-seg4", label: "7-segment display (4 digit)", cat: "Displays", kind: "module",
    attrs: { color: "red", digits: "4" }, sim: { common: "cathode" },
    props: [{ k: "color", label: "Colour", type: "select", opts: ["red", "green", "blue", "white"] }, { k: "common", label: "Common pin", type: "select", opts: ["cathode", "anode"], sim: true }],
    kit: ["7-segment display 4-digit"],
    help: "Four digits sharing the same seven segment pins. You light one digit at a time and switch fast enough that the eye sees all four. D1-D4 are the digit commons.",
    defaults: { A: 2, B: 3, C: 4, D: 5, E: 6, F: 7, G: 8, DP: 9, D1: 10, D2: 11, D3: 12, D4: 13 },
    defaultsEsp: { A: 13, B: 12, C: 14, D: 27, E: 26, F: 25, G: 33, DP: 32, D1: 23, D2: 22, D3: 21, D4: 19 },
    code: `// Count seconds on a 4-digit display (multiplexed by hand)
const int SEG[8] = {{A}, {B}, {C}, {D}, {E}, {F}, {G}, {DP}};
const int DIG[4] = {{D1}, {D2}, {D3}, {D4}};
const byte FONT[10] = { 0b0111111, 0b0000110, 0b1011011, 0b1001111, 0b1100110,
                        0b1101101, 0b1111101, 0b0000111, 0b1111111, 0b1101111 };

void showDigit(int place, int value) {
  for (int d = 0; d < 4; d++) digitalWrite(DIG[d], HIGH);   // all digits off
  for (int s = 0; s < 7; s++) digitalWrite(SEG[s], bitRead(FONT[value], s));
  digitalWrite(DIG[place], LOW);                             // this one on
  delay(4);
}

void setup() {
  for (int s = 0; s < 8; s++) pinMode(SEG[s], OUTPUT);
  for (int d = 0; d < 4; d++) { pinMode(DIG[d], OUTPUT); digitalWrite(DIG[d], HIGH); }
}

void loop() {
  int n = (millis() / 1000) % 10000;
  showDigit(0, (n / 1000) % 10);
  showDigit(1, (n / 100) % 10);
  showDigit(2, (n / 10) % 10);
  showDigit(3, n % 10);
}
`,
  },
  tm1637: {
    tag: "cl-tm1637", label: "TM1637 4-digit display", cat: "Displays", kind: "module",
    pw: { vcc: ["VCC"], gnd: ["GND"] }, kit: ["TM1637 4-digit display"],
    help: "The easy four-digit display: two wires, a chip that does the multiplexing for you, and a colon in the middle for clocks.",
    defaults: { CLK: 2, DIO: 3 }, defaultsEsp: { CLK: 18, DIO: 19 },
    code: `// TM1637: a counting clock display
#include <TM1637Display.h>
TM1637Display display({CLK}, {DIO});

void setup() {
  display.setBrightness(5);
  display.showNumberDec(0, true);
}

void loop() {
  int secs = millis() / 1000;
  int mins = secs / 60;
  int shown = (mins % 100) * 100 + (secs % 60);
  display.showNumberDecEx(shown, 0b01000000, true);   // with the colon
  delay(200);
}
`,
  },
  max7219x4: {
    tag: "cl-max7219x4", label: "LED matrix 4-in-1 (32×8)", cat: "Displays", kind: "module",
    attrs: { blocks: "4" }, props: [{ k: "blocks", label: "Blocks", type: "select", opts: ["2", "4", "8"] }],
    pw: { vcc: ["VCC"], gnd: ["GND"] }, kit: ["MAX7219 4-in-1 LED matrix"],
    help: "Four 8×8 matrices chained into one 32×8 display. Perfect for scrolling messages. The first chip in the chain is the one nearest DIN.",
    defaults: { DIN: 12, CLK: 11, CS: 10 }, defaultsEsp: { DIN: 23, CLK: 18, CS: 5 },
    code: `// Scrolling message on a 32x8 matrix
#include <LedControl.h>
const int N = 4;
LedControl lc({DIN}, {CLK}, {CS}, N);

const byte FONT[][5] = {
  {0x7E,0x11,0x11,0x11,0x7E}, {0x7F,0x49,0x49,0x49,0x36}, {0x3E,0x41,0x41,0x41,0x22},  // A B C
  {0x7F,0x41,0x41,0x22,0x1C}, {0x7F,0x49,0x49,0x49,0x41}, {0x7F,0x09,0x09,0x09,0x01},  // D E F
};

void setup() {
  for (int i = 0; i < N; i++) { lc.shutdown(i, false); lc.setIntensity(i, 6); lc.clearDisplay(i); }
  Serial.begin(9600);
  Serial.println("Showing A B C D E F");
}

void loop() {
  for (int letter = 0; letter < 6; letter++) {
    int dev = letter % N;
    lc.clearDisplay(dev);
    for (int c = 0; c < 5; c++) lc.setColumn(dev, c + 1, FONT[letter][c]);
    delay(400);
  }
}
`,
  },

  /* ---------------- input ---------------- */
  encoder: {
    tag: "wokwi-ky-040", label: "Rotary encoder KY-040", cat: "Input", kind: "module",
    pw: { vcc: ["VCC"], gnd: ["GND"] }, kit: ["Rotary encoder KY-040"],
    help: "A knob that turns for ever and clicks. CLK and DT change in a set order, so the code can tell which way you turned. Pressing the knob grounds SW.",
    defaults: { CLK: 2, DT: 3, SW: 4 }, defaultsEsp: { CLK: 27, DT: 26, SW: 25 },
    code: `// Rotary encoder: count up and down, press to reset
const int CLK = {CLK}, DT = {DT}, SW = {SW};
int count = 0;
int lastClk;

void setup() {
  pinMode(CLK, INPUT_PULLUP);
  pinMode(DT, INPUT_PULLUP);
  pinMode(SW, INPUT_PULLUP);
  lastClk = digitalRead(CLK);
  Serial.begin(9600);
  Serial.println("Turn the knob");
}

void loop() {
  int clk = digitalRead(CLK);
  if (clk != lastClk && clk == LOW) {
    if (digitalRead(DT) != clk) count++; else count--;
    Serial.print("Count: ");
    Serial.println(count);
  }
  lastClk = clk;
  if (digitalRead(SW) == LOW) { count = 0; Serial.println("Reset"); delay(250); }
}
`,
  },
  irrecv: {
    tag: "wokwi-ir-receiver", label: "IR receiver", cat: "Communication", kind: "module",
    pw: { vcc: ["VCC"], gnd: ["GND"] }, kit: ["IR receiver TSOP1838", "IR remote control"],
    help: "The little black eye that reads a TV remote. Add the IR remote part from Input and press its buttons while the simulation runs.",
    defaults: { DAT: 2 }, defaultsEsp: { DAT: 27 },
    code: `// Read an infrared remote
#include <IRremote.h>
const int RECV = {DAT};

void setup() {
  Serial.begin(9600);
  IrReceiver.begin(RECV);
  Serial.println("Point the remote and press a button");
}

void loop() {
  if (IrReceiver.decode()) {
    unsigned long code = IrReceiver.decodedIRData.command;
    Serial.print("Button code: 0x");
    Serial.println(code, HEX);
    if (code == 0xA2) Serial.println("  Power");
    if (code == 0x02) Serial.println("  Volume up");
    if (code == 0x98) Serial.println("  Volume down");
    IrReceiver.resume();
  }
}
`,
  },
  irremote: {
    tag: "wokwi-ir-remote", label: "IR remote control", cat: "Input", kind: "module", noWires: true, kit: ["IR remote control"],
    help: "Press its buttons while the simulation runs and the IR receiver in your circuit picks up the code. No wires: it works through the air, like the real thing.",
  },

  /* ---------------- motor drivers ---------------- */
  a4988: {
    tag: "cl-a4988", label: "A4988 stepper driver", cat: "Motion", kind: "module",
    pw: { vcc: ["VDD"], gnd: ["GND"] }, kit: ["A4988 stepper driver"],
    help: "Drives a NEMA 17 from just two pins: a pulse on STEP moves one step, DIR chooses the direction. VMOT takes 12 V, VDD takes 5 V from the board. Wire RST to SLP or it stays asleep.",
    defaults: { STEP: 3, DIR: 2, EN: 4 }, defaultsEsp: { STEP: 26, DIR: 27, EN: 25 },
    code: `// A4988: turn a NEMA 17 one revolution each way
const int STEP_PIN = {STEP};
const int DIR_PIN = {DIR};
const int STEPS_PER_TURN = 200;

void turn(int steps, bool forward) {
  digitalWrite(DIR_PIN, forward ? HIGH : LOW);
  for (int i = 0; i < steps; i++) {
    digitalWrite(STEP_PIN, HIGH);
    delayMicroseconds(800);
    digitalWrite(STEP_PIN, LOW);
    delayMicroseconds(800);
  }
}

void setup() {
  pinMode(STEP_PIN, OUTPUT);
  pinMode(DIR_PIN, OUTPUT);
  Serial.begin(9600);
}

void loop() {
  Serial.println("One turn forward");
  turn(STEPS_PER_TURN, true);
  delay(700);
  Serial.println("One turn back");
  turn(STEPS_PER_TURN, false);
  delay(700);
}
`,
  },
  l293d: {
    tag: "cl-dip", label: "L293D motor driver", cat: "Motion", kind: "module",
    attrs: { label: "L293D", names: "EN1,IN1,OUT1,GND,GND.2,OUT2,IN2,VS,EN2,IN3,OUT3,GND.3,GND.4,OUT4,IN4,VCC" },
    pw: { vcc: ["VCC"], gnd: ["GND"] }, kit: ["L293D motor driver"],
    help: "The chip version of an H-bridge: two motors, about 600 mA each. VCC (pin 16) is 5 V logic, VS (pin 8) is the motor supply. EN1 and EN2 take a PWM signal for speed.",
    defaults: { EN1: 9, IN1: 7, IN2: 8, EN2: 10, IN3: 5, IN4: 6 }, defaultsEsp: { EN1: 14, IN1: 27, IN2: 26, EN2: 32, IN3: 25, IN4: 33 },
    code: `// L293D: one motor forwards, then backwards
const int EN = {EN1}, IN1 = {IN1}, IN2 = {IN2};

void setup() {
  pinMode(EN, OUTPUT); pinMode(IN1, OUTPUT); pinMode(IN2, OUTPUT);
  Serial.begin(9600);
}

void loop() {
  Serial.println("Forwards, half speed");
  digitalWrite(IN1, HIGH); digitalWrite(IN2, LOW); analogWrite(EN, 140);
  delay(2000);
  Serial.println("Stop");
  analogWrite(EN, 0);
  delay(800);
  Serial.println("Backwards, full speed");
  digitalWrite(IN1, LOW); digitalWrite(IN2, HIGH); analogWrite(EN, 255);
  delay(2000);
  analogWrite(EN, 0);
  delay(800);
}
`,
  },

  /* ---------------- discrete parts ---------------- */
  npn: {
    tag: "cl-to92", label: "NPN transistor", cat: "Basics", kind: "bb", bb3: { first: "C", gnd: "E", sig: "B" },
    attrs: { label: "2N2222", p1: "C", p2: "B", p3: "E", color: "#1A1A1A" }, kit: ["NPN transistor 2N2222", "NPN transistor BC547"],
    help: "A switch with no moving parts. A small current into the base (through a 1 kΩ resistor) lets a much bigger one flow from collector to emitter. This is how one pin runs a motor or a lamp. Circuit Lab treats it as an on/off switch, not a real amplifier.",
    defaults: { B: 9 }, defaultsEsp: { B: 27 },
    code: `// Transistor as a switch: run a motor or lamp from one pin
// base through a 1k resistor to this pin, emitter to GND, load between +V and collector
const int BASE = {B};

void setup() {
  pinMode(BASE, OUTPUT);
  Serial.begin(9600);
}

void loop() {
  Serial.println("Load ON");
  digitalWrite(BASE, HIGH);
  delay(1500);
  Serial.println("Load OFF");
  digitalWrite(BASE, LOW);
  delay(1500);
}
`,
  },
  mosfet: {
    tag: "cl-to220", label: "MOSFET (IRF520)", cat: "Basics", kind: "bb", bb3: { first: "G", gnd: "S", sig: "G" },
    attrs: { label: "IRF520", p1: "G", p2: "D", p3: "S" }, kit: ["MOSFET IRF520"],
    help: "A transistor that switches on voltage alone, so it needs almost no current from the pin and can handle several amps. Gate to the pin, source to GND, load between +V and drain. Modelled here as an on/off switch above about 2 V on the gate.",
    defaults: { G: 9 }, defaultsEsp: { G: 27 },
    code: `// MOSFET dimmer: PWM on the gate fades a 12 V LED strip
const int GATE = {G};

void setup() {
  pinMode(GATE, OUTPUT);
  Serial.begin(9600);
}

void loop() {
  for (int b = 0; b <= 255; b += 5) { analogWrite(GATE, b); delay(20); }
  Serial.println("Full brightness");
  for (int b = 255; b >= 0; b -= 5) { analogWrite(GATE, b); delay(20); }
  Serial.println("Off");
  delay(400);
}
`,
  },
  diode: {
    tag: "cl-diode", label: "Diode", cat: "Basics", kind: "bb", bb2: { first: "A" },
    attrs: { label: "1N4007" }, kit: ["Diode 1N4007"],
    help: "A one-way valve for current: it passes from A (anode) to K (cathode, the striped end) and blocks the other way. Put one across a motor or relay coil to soak up the kick when it switches off.",
    code: `// A diode needs no code. Two classic uses:
//  1. across a motor or relay coil (striped end to +) to protect the transistor
//  2. in series with a battery so plugging it in backwards does nothing

void setup() { Serial.begin(9600); }

void loop() {
  Serial.println("The diode is doing its job quietly");
  delay(3000);
}
`,
  },
  ne555: {
    tag: "cl-dip", label: "555 timer", cat: "Basics", kind: "module",
    attrs: { label: "NE555", names: "GND,TRIG,OUT,RESET,CTRL,THR,DIS,VCC" },
    pw: { vcc: ["VCC"], gnd: ["GND"] },
    sim: { mode: "astable", r1: 10000, r2: 47000, cap: 10 },
    props: [
      { k: "mode", label: "Mode", type: "select", opts: ["astable", "monostable"], sim: true },
      v("r1", "R1 if not wired", 1000, 100000, " Ω", 1000), v("r2", "R2 if not wired", 1000, 220000, " Ω", 1000), v("cap", "C if not wired", 0.1, 470, " µF", 0.1),
    ],
    kit: ["NE555 timer IC"], defaults: { OUT: 2 }, defaultsEsp: { OUT: 27 },
    help: "A chip that makes square waves with no microcontroller at all. Astable: R1 from VCC to DIS, R2 from DIS to THR, a capacitor from THR to GND, and TRIG joined to THR. Circuit Lab reads the resistors and capacitor you actually wired and works out the frequency; if it cannot find them it uses the slider values.",
    code: `// The 555 runs on its own. This sketch just measures what it produces.
const int FROM_555 = 2;      // wire the 555's OUT pin here

void setup() {
  pinMode(FROM_555, INPUT);
  Serial.begin(9600);
  Serial.println("Measuring the 555 output...");
}

void loop() {
  unsigned long high = pulseIn(FROM_555, HIGH, 2000000UL);
  unsigned long low = pulseIn(FROM_555, LOW, 2000000UL);
  if (high && low) {
    float hz = 1000000.0 / (high + low);
    Serial.print(hz, 2);
    Serial.print(" Hz, duty ");
    Serial.print(100.0 * high / (high + low), 0);
    Serial.println(" %");
  } else Serial.println("no signal - check the wiring");
  delay(500);
}
`,
  },
};
