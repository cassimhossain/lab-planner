/* Circuit Lab - second part catalogue (round 1: boards, simple sensors, more displays and loads).
   Same shape as PARTS in parts.js. Merged in by parts.js. */
import "./elements2.js?v=20";

const v = (k, label, min, max, unit = "", step = 1) => ({ k, label, type: "range", min, max, step, unit, sim: true, live: true });
const tog = (k, text) => ({ k, label: text, type: "toggle", text, sim: true, live: true });
const btn = (k, text) => ({ k, label: text, type: "button", text, sim: true, live: true });

/* a standard "VCC / GND / analog out" sensor: one slider, code that prints the reading */
export const PARTS2 = {
  /* ================= boards ================= */
  nano: {
    tag: "wokwi-arduino-nano", label: "Arduino Nano", cat: "Boards", kind: "board", one: true, kit: ["Arduino Nano + USB cable"],
    help: "The same chip as the Uno (ATmega328P) in a breadboard-friendly shape. Pins D0-D13 and A0-A7 (A6 and A7 read voltages only).",
  },
  mega: {
    tag: "wokwi-arduino-mega", label: "Arduino Mega 2560", cat: "Boards", kind: "board", one: true, kit: ["Arduino Mega 2560 + USB cable"],
    help: "A big Uno: 54 digital pins, 16 analog inputs and much more memory. Good when you run out of pins.",
  },

  /* ================= canvas note ================= */
  note: {
    tag: "cl-note", label: "Note", cat: "Basics", kind: "deco", noWires: true,
    attrs: { text: "Write a note here", color: "yellow", w: "170" },
    props: [{ k: "text", label: "Note text", type: "text" }, { k: "color", label: "Colour", type: "select", opts: ["yellow", "blue", "green", "pink", "grey"] }, { k: "w", label: "Width", type: "select", opts: ["120", "170", "240", "320"] }],
    kit: [], help: "A sticky note for labelling a circuit on a worksheet. It is not wired to anything.",
  },

  /* ================= basics ================= */
  dipswitch: {
    tag: "wokwi-dip-switch-8", label: "DIP switch (8)", cat: "Basics", kind: "module", kit: ["DIP switch 8-way"],
    help: "Eight tiny switches in one package. Each one joins its own pair of pins (1a-1b, 2a-2b...). Use INPUT_PULLUP and wire the other side to GND.",
    defaults: { "1a": 2 }, defaultsEsp: { "1a": 27 },
    code: `// Read all eight DIP switches
// one side of each switch to GND, the other to pins 2..9
const int FIRST = {1a};

void setup() {
  for (int i = 0; i < 8; i++) pinMode(FIRST + i, INPUT_PULLUP);
  Serial.begin(9600);
}

void loop() {
  Serial.print("Switches: ");
  for (int i = 0; i < 8; i++) Serial.print(digitalRead(FIRST + i) == LOW ? "1" : "0");
  Serial.println();
  delay(400);
}
`,
  },
  slidepot: {
    tag: "wokwi-slide-potentiometer", label: "Slide potentiometer", cat: "Basics", kind: "module", pw: { vcc: ["VCC"], gnd: ["GND"] }, kit: ["Slide potentiometer"],
    help: "A potentiometer you slide instead of turn. SIG gives 0 V to 5 V.",
    defaults: { SIG: "A0" }, defaultsEsp: { SIG: 34 },
    code: `// Slider sets the brightness of the built-in LED
const int SLIDER = {SIG};

void setup() {
  pinMode(LED_BUILTIN, OUTPUT);
  Serial.begin(9600);
}

void loop() {
  int raw = analogRead(SLIDER);
  analogWrite(LED_BUILTIN, raw / 4);
  Serial.println(raw);
  delay(80);
}
`,
  },
  ledbar: {
    tag: "wokwi-led-bar-graph", label: "LED bar graph (10)", cat: "Light & sound", kind: "module", attrs: { color: "red" },
    props: [{ k: "color", label: "Colour", type: "select", opts: ["red", "green", "yellow", "blue", "orange"] }], kit: ["LED bar graph 10-segment"],
    help: "Ten LEDs in a row. A1-A10 are the anodes (+, each through a 220 Ω resistor), C1-C10 the cathodes (-).",
    defaults: { A1: 2 }, defaultsEsp: { A1: 13 },
    code: `// Fill the bar up and down like a level meter
const int FIRST = {A1};   // A1 on this pin, A2 on the next, and so on
const int N = 10;

void setup() {
  for (int i = 0; i < N; i++) pinMode(FIRST + i, OUTPUT);
}

void loop() {
  for (int lit = 0; lit <= N; lit++) {
    for (int i = 0; i < N; i++) digitalWrite(FIRST + i, i < lit);
    delay(90);
  }
  for (int lit = N; lit >= 0; lit--) {
    for (int i = 0; i < N; i++) digitalWrite(FIRST + i, i < lit);
    delay(90);
  }
}
`,
  },

  /* ================= analog temperature ================= */
  lm35: {
    tag: "cl-to92", label: "LM35 temperature", cat: "Sensors", kind: "bb", bb3: { first: "VCC", vcc: "VCC", gnd: "GND", sig: "OUT" }, attrs: { label: "LM35", p1: "VCC", p2: "OUT", p3: "GND" },
    sim: { temp: 28 }, props: [v("temp", "Temperature", -10, 110, " °C")], pw: { vcc: ["VCC"], gnd: ["GND"] }, kit: ["LM35 temperature sensor"],
    help: "A three-leg sensor that puts out 10 mV per °C. Flat side towards you: left leg +5V, middle OUT, right GND. Nothing to calibrate.",
    defaults: { OUT: "A0" }, defaultsEsp: { OUT: 34 },
    code: `// LM35: 10 mV per degree C
const int SENSOR = {OUT};

void setup() { Serial.begin(9600); }

void loop() {
  int raw = analogRead(SENSOR);
  float volts = raw * 5.0 / 1023.0;
  float c = volts * 100.0;          // 10 mV = 1 degree
  Serial.print("Temperature: ");
  Serial.print(c, 1);
  Serial.println(" C");
  delay(600);
}
`,
  },
  tmp36: {
    tag: "cl-to92", label: "TMP36 temperature", cat: "Sensors", kind: "bb", bb3: { first: "VCC", vcc: "VCC", gnd: "GND", sig: "OUT" }, attrs: { label: "TMP36", p1: "VCC", p2: "OUT", p3: "GND" },
    sim: { temp: 28 }, props: [v("temp", "Temperature", -40, 125, " °C")], pw: { vcc: ["VCC"], gnd: ["GND"] }, kit: ["TMP36 temperature sensor"],
    help: "Like the LM35 but offset by 500 mV, so it also reads below 0 °C. degrees = (volts - 0.5) × 100.",
    defaults: { OUT: "A0" }, defaultsEsp: { OUT: 34 },
    code: `// TMP36: (volts - 0.5) x 100 = degrees C
const int SENSOR = {OUT};

void setup() { Serial.begin(9600); }

void loop() {
  float volts = analogRead(SENSOR) * 5.0 / 1023.0;
  float c = (volts - 0.5) * 100.0;
  Serial.print(c, 1);
  Serial.println(" C");
  delay(600);
}
`,
  },
  thermistor: {
    tag: "wokwi-ntc-temperature-sensor", label: "Thermistor module (NTC)", cat: "Sensors", kind: "module",
    sim: { temp: 25 }, props: [v("temp", "Temperature", -20, 120, " °C")], pw: { vcc: ["VCC"], gnd: ["GND"] }, kit: ["Thermistor NTC 10k", "Thermistor module KY-013"],
    help: "A resistor that changes with heat, on a module with a 10 kΩ divider. The maths below is the Steinhart-Hart equation.",
    defaults: { OUT: "A0" }, defaultsEsp: { OUT: 34 },
    code: `// Thermistor (NTC 10k) with a 10k divider on the module
const int SENSOR = {OUT};
const float BETA = 3950.0;

void setup() { Serial.begin(9600); }

void loop() {
  int raw = analogRead(SENSOR);
  float r = 10000.0 * raw / (1023.0 - raw);              // resistance of the thermistor
  float k = 1.0 / (1.0 / 298.15 + log(r / 10000.0) / BETA);
  Serial.print(k - 273.15, 1);
  Serial.println(" C");
  delay(600);
}
`,
  },

  /* ================= water, air, light ================= */
  waterlevel: {
    tag: "cl-waterlevel", label: "Water level sensor", cat: "Sensors", kind: "module", sim: { level: 30 }, props: [v("level", "Water on the strip", 0, 100, " %")],
    pw: { vcc: ["VCC"], gnd: ["GND"] }, kit: ["Water level sensor"],
    help: "Parallel copper tracks: the more of the strip is wet, the lower its resistance and the higher the reading on AO.",
    defaults: { AO: "A0" }, defaultsEsp: { AO: 34 },
    code: `// Water tank level, as a percentage
const int SENSOR = {AO};

void setup() { Serial.begin(9600); }

void loop() {
  int raw = analogRead(SENSOR);
  int percent = map(raw, 0, 700, 0, 100);
  percent = constrain(percent, 0, 100);
  Serial.print("Tank: ");
  Serial.print(percent);
  Serial.println(" %");
  if (percent < 20) Serial.println("  Low water!");
  delay(700);
}
`,
  },
  flow: {
    tag: "cl-flow", label: "Water flow sensor", cat: "Sensors", kind: "module", sim: { lpm: 6 }, props: [v("lpm", "Flow", 0, 30, " L/min", 0.5)],
    pw: { vcc: ["VCC"], gnd: ["GND"] }, kit: ["Water flow sensor YF-S201"],
    help: "A turbine with a magnet: it sends about 450 pulses per litre. Count the pulses with an interrupt and you get litres per minute.",
    defaults: { SIG: 2 }, defaultsEsp: { SIG: 27 },
    code: `// Water flow meter: count pulses for one second
const int FLOW = {SIG};
volatile unsigned long pulses = 0;

void countPulse() { pulses++; }

void setup() {
  pinMode(FLOW, INPUT_PULLUP);
  attachInterrupt(digitalPinToInterrupt(FLOW), countPulse, FALLING);
  Serial.begin(9600);
}

void loop() {
  pulses = 0;
  delay(1000);
  unsigned long p = pulses;
  float litresPerMin = p / 7.5;      // 450 pulses per litre
  Serial.print(p);
  Serial.print(" pulses -> ");
  Serial.print(litresPerMin, 2);
  Serial.println(" L/min");
}
`,
  },
  tds: {
    tag: "cl-tds", label: "Water quality (TDS)", cat: "Sensors", kind: "module", sim: { ppm: 320 }, props: [v("ppm", "Dissolved solids", 0, 1200, " ppm", 10)],
    pw: { vcc: ["VCC"], gnd: ["GND"] }, kit: ["TDS water quality sensor"],
    help: "Measures how well water conducts, which tells you roughly how much is dissolved in it. Under 300 ppm is good drinking water.",
    defaults: { AO: "A0" }, defaultsEsp: { AO: 34 },
    code: `// Water quality: total dissolved solids in ppm
const int SENSOR = {AO};

void setup() { Serial.begin(9600); }

void loop() {
  int raw = analogRead(SENSOR);
  float ppm = raw * 1.2;
  Serial.print(ppm, 0);
  Serial.print(" ppm - ");
  if (ppm < 300) Serial.println("good");
  else if (ppm < 600) Serial.println("fair");
  else Serial.println("poor");
  delay(900);
}
`,
  },
  mic: {
    tag: "cl-mic", label: "Microphone MAX4466", cat: "Sensors", kind: "module", sim: { loud: 200 }, props: [v("loud", "Loudness", 0, 1000, "", 10)],
    pw: { vcc: ["VCC"], gnd: ["GND"] }, kit: ["Microphone module MAX4466"],
    help: "An amplified microphone. AO rests near the middle of the range and swings up and down with the sound, so measure the swing, not the level.",
    defaults: { AO: "A0" }, defaultsEsp: { AO: 34 },
    code: `// Sound level meter: measure the swing over 50 ms
const int MIC = {AO};

void setup() { Serial.begin(9600); }

void loop() {
  int lo = 1023, hi = 0;
  unsigned long until = millis() + 50;
  while (millis() < until) {
    int x = analogRead(MIC);
    if (x < lo) lo = x;
    if (x > hi) hi = x;
  }
  int swing = hi - lo;
  Serial.print("Level: ");
  Serial.println(swing);
  delay(120);
}
`,
  },
  uv: {
    tag: "cl-uv", label: "UV sensor", cat: "Sensors", kind: "module", sim: { uv: 3 }, props: [v("uv", "UV index", 0, 12, "", 0.1)],
    pw: { vcc: ["VCC"], gnd: ["GND"] }, kit: ["UV sensor GUVA-S12SD"],
    help: "Reads sunburn-causing ultraviolet light. About 0.1 V per UV index step.",
    defaults: { AO: "A0" }, defaultsEsp: { AO: 34 },
    code: `// UV index with a sun-safety message
const int SENSOR = {AO};

void setup() { Serial.begin(9600); }

void loop() {
  float volts = analogRead(SENSOR) * 5.0 / 1023.0;
  float index = volts / 0.1;
  Serial.print("UV index ");
  Serial.print(index, 1);
  Serial.print(" - ");
  if (index < 3) Serial.println("low");
  else if (index < 6) Serial.println("moderate: hat and sunscreen");
  else Serial.println("high: stay in the shade");
  delay(900);
}
`,
  },

  /* ================= switches and contact sensors ================= */
  hall: {
    tag: "cl-hall", label: "Hall effect sensor", cat: "Sensors", kind: "module", sim: { magnet: false },
    props: [tog("magnet", "Magnet nearby")], pw: { vcc: ["VCC"], gnd: ["GND"] }, kit: ["Hall effect sensor A3144"],
    help: "Senses a magnet with no moving parts. DO goes LOW when a magnet is close. Used for speedometers and door sensors.",
    defaults: { DO: 2 }, defaultsEsp: { DO: 27 },
    code: `// Magnet detector
const int HALL = {DO};

void setup() {
  pinMode(HALL, INPUT);
  pinMode(LED_BUILTIN, OUTPUT);
  Serial.begin(9600);
}

void loop() {
  bool magnet = digitalRead(HALL) == LOW;
  digitalWrite(LED_BUILTIN, magnet);
  Serial.println(magnet ? "Magnet!" : "No magnet");
  delay(250);
}
`,
  },
  touch: {
    tag: "cl-touch", label: "Touch sensor TTP223", cat: "Sensors", kind: "module", sim: { touched: false },
    props: [tog("touched", "Finger on the pad")], pw: { vcc: ["VCC"], gnd: ["GND"] }, kit: ["Touch sensor TTP223"],
    help: "A touch pad that works through plastic or glass. SIG goes HIGH while you touch it.",
    defaults: { SIG: 2 }, defaultsEsp: { SIG: 27 },
    code: `// Touch switch: each touch toggles the LED
const int TOUCH = {SIG};
bool lampOn = false;
bool was = false;

void setup() {
  pinMode(TOUCH, INPUT);
  pinMode(LED_BUILTIN, OUTPUT);
  Serial.begin(9600);
}

void loop() {
  bool now = digitalRead(TOUCH) == HIGH;
  if (now && !was) {
    lampOn = !lampOn;
    digitalWrite(LED_BUILTIN, lampOn);
    Serial.println(lampOn ? "Lamp ON" : "Lamp OFF");
  }
  was = now;
  delay(40);
}
`,
  },
  reed: {
    tag: "cl-reed", label: "Reed switch", cat: "Sensors", kind: "module", sim: { magnet: false },
    props: [tog("magnet", "Magnet nearby")], pw: { vcc: ["VCC"], gnd: ["GND"] }, kit: ["Reed switch module"],
    help: "Two metal blades in a glass tube that snap together near a magnet. This is what tells a burglar alarm a window is open.",
    defaults: { DO: 2 }, defaultsEsp: { DO: 27 },
    code: `// Window sensor: magnet on the window, switch on the frame
const int REED = {DO};

void setup() {
  pinMode(REED, INPUT);
  Serial.begin(9600);
}

void loop() {
  bool closed = digitalRead(REED) == LOW;
  Serial.println(closed ? "Window closed" : "WINDOW OPEN");
  delay(400);
}
`,
  },
  knock: {
    tag: "cl-knock", label: "Knock sensor", cat: "Sensors", kind: "module", sim: {},
    props: [btn("knock", "Knock it")], pw: { vcc: ["VCC"], gnd: ["GND"] }, kit: ["Knock sensor KY-031"],
    help: "A piezo disc that gives a short pulse when tapped. DO goes LOW for an instant, so watch for the change rather than the level.",
    defaults: { DO: 2 }, defaultsEsp: { DO: 27 },
    code: `// Count knocks
const int KNOCK = {DO};
int count = 0;
bool was = false;

void setup() {
  pinMode(KNOCK, INPUT);
  Serial.begin(9600);
  Serial.println("Knock on the sensor...");
}

void loop() {
  bool hit = digitalRead(KNOCK) == LOW;
  if (hit && !was) {
    count++;
    Serial.print("Knock ");
    Serial.println(count);
  }
  was = hit;
  delay(20);
}
`,
  },
  vibsw: {
    tag: "cl-vibsw", label: "Vibration switch SW-420", cat: "Sensors", kind: "module", sim: { shake: false },
    props: [tog("shake", "Shaking")], pw: { vcc: ["VCC"], gnd: ["GND"] }, kit: ["Vibration sensor SW-420"],
    help: "A spring that makes contact when shaken. Good for earthquake alarms and anti-theft projects.",
    defaults: { DO: 2 }, defaultsEsp: { DO: 27 },
    code: `// Shake alarm
const int VIB = {DO};

void setup() {
  pinMode(VIB, INPUT);
  pinMode(LED_BUILTIN, OUTPUT);
  Serial.begin(9600);
}

void loop() {
  if (digitalRead(VIB) == LOW) {
    Serial.println("Vibration detected!");
    for (int i = 0; i < 4; i++) { digitalWrite(LED_BUILTIN, HIGH); delay(80); digitalWrite(LED_BUILTIN, LOW); delay(80); }
  }
  delay(50);
}
`,
  },
  fsr: {
    tag: "cl-fsr", label: "Force sensor (FSR)", cat: "Sensors", kind: "module", sim: { force: 30 }, props: [v("force", "Press", 0, 100, " %")],
    pw: { vcc: ["VCC"], gnd: ["GND"] }, kit: ["Force sensitive resistor"],
    help: "A pad whose resistance drops the harder you press. Used in drum pads and smart floors.",
    defaults: { AO: "A0" }, defaultsEsp: { AO: 34 },
    code: `// Pressure pad: light the LED harder the harder you press
const int FORCE = {AO};

void setup() {
  pinMode(LED_BUILTIN, OUTPUT);
  Serial.begin(9600);
}

void loop() {
  int raw = analogRead(FORCE);
  analogWrite(LED_BUILTIN, raw / 4);
  Serial.print("Force: ");
  Serial.println(raw);
  delay(120);
}
`,
  },
  flex: {
    tag: "cl-flex", label: "Flex sensor", cat: "Sensors", kind: "module", sim: { bend: 20 }, props: [v("bend", "Bend", 0, 100, " %")],
    pw: { vcc: ["VCC"], gnd: ["GND"] }, kit: ["Flex sensor"],
    help: "A plastic strip whose resistance rises as it bends. This is how a sensor glove reads finger positions.",
    defaults: { AO: "A0" }, defaultsEsp: { AO: 34 },
    code: `// Bend sensor: drive a servo from a bending finger
#include <Servo.h>
Servo hand;
const int FLEX = {AO};

void setup() {
  hand.attach(9);
  Serial.begin(9600);
}

void loop() {
  int raw = analogRead(FLEX);
  int angle = map(raw, 200, 800, 0, 180);
  angle = constrain(angle, 0, 180);
  hand.write(angle);
  Serial.print("bend ");
  Serial.print(raw);
  Serial.print(" -> ");
  Serial.println(angle);
  delay(80);
}
`,
  },
  sharpir: {
    tag: "cl-sharpir", label: "Sharp IR distance", cat: "Sensors", kind: "module", sim: { dist: 40 }, props: [v("dist", "Distance", 10, 80, " cm")],
    pw: { vcc: ["VCC"], gnd: ["GND"] }, kit: ["Sharp IR distance sensor GP2Y0A21"],
    help: "Measures 10 to 80 cm with infrared light instead of sound, so soft things and cloth still show up. The voltage falls as the object moves away.",
    defaults: { AO: "A0" }, defaultsEsp: { AO: 34 },
    code: `// Sharp GP2Y0A21: distance from voltage
const int SENSOR = {AO};

void setup() { Serial.begin(9600); }

void loop() {
  float volts = analogRead(SENSOR) * 5.0 / 1023.0;
  float cm = 27.86 / (volts - 0.42);        // from the datasheet curve
  if (cm < 10 || cm > 80) Serial.println("out of range");
  else { Serial.print(cm, 1); Serial.println(" cm"); }
  delay(400);
}
`,
  },
  acs712: {
    tag: "cl-acs712", label: "Current sensor ACS712", cat: "Sensors", kind: "module", sim: { amps: 1.5 }, props: [v("amps", "Current through the load", -20, 20, " A", 0.1)],
    pw: { vcc: ["VCC"], gnd: ["GND"] }, kit: ["Current sensor ACS712"],
    help: "Measures current with a magnetic field, so the sensor stays isolated from the load. Resting output is half the supply; 66 mV per amp on the 30 A version.",
    defaults: { OUT: "A0" }, defaultsEsp: { OUT: 34 },
    code: `// ACS712: current in amps (resting at 2.5 V)
const int SENSOR = {OUT};

void setup() { Serial.begin(9600); }

void loop() {
  float volts = analogRead(SENSOR) * 5.0 / 1023.0;
  float amps = (volts - 2.5) / 0.066;       // 66 mV per amp
  Serial.print(amps, 2);
  Serial.println(" A");
  delay(500);
}
`,
  },
  dht11: {
    tag: "wokwi-dht22", label: "DHT11 temp & humidity", cat: "Sensors", kind: "module", attrs: { temperature: "25" },
    sim: { temp: 25, hum: 50, kind: "11" }, props: [v("temp", "Temperature", 0, 50, " °C"), v("hum", "Humidity", 20, 90, " %")],
    pw: { vcc: ["VCC"], gnd: ["GND"] }, kit: ["DHT11 sensor"],
    help: "The cheaper blue cousin of the DHT22: whole degrees only, 0-50 °C, one reading per second. Same single-wire connection.",
    defaults: { SDA: 2 }, defaultsEsp: { SDA: 27 },
    code: `// DHT11 temperature and humidity
#include <DHT.h>
#define DHTPIN {SDA}
DHT dht(DHTPIN, DHT11);

void setup() {
  Serial.begin(9600);
  dht.begin();
}

void loop() {
  float t = dht.readTemperature();
  float h = dht.readHumidity();
  if (isnan(t) || isnan(h)) { Serial.println("No reading"); }
  else {
    Serial.print(t, 0);
    Serial.print(" C, ");
    Serial.print(h, 0);
    Serial.println(" %");
  }
  delay(2000);
}
`,
  },

  /* ================= displays ================= */
  lcd2004: {
    tag: "wokwi-lcd2004", label: "LCD 20×4 I2C", cat: "Displays", kind: "module", attrs: { pins: "i2c" },
    pw: { vcc: ["VCC"], gnd: ["GND"] }, i2c: { sda: "SDA", scl: "SCL", addr: 0x27 }, sim: { addr: "0x27" }, kit: ["LCD 20x4 I2C"],
    help: "Four lines of twenty characters over two wires. Same code as the 16×2, with LiquidCrystal_I2C lcd(0x27, 20, 4).",
    code: `// LCD 20x4 over I2C
#include <Wire.h>
#include <LiquidCrystal_I2C.h>
LiquidCrystal_I2C lcd(0x27, 20, 4);

void setup() {
  lcd.init();
  lcd.backlight();
  lcd.setCursor(0, 0); lcd.print("Robotics & AI Club");
  lcd.setCursor(0, 1); lcd.print("20 by 4 characters");
  lcd.setCursor(0, 2); lcd.print("Line three");
}

void loop() {
  lcd.setCursor(0, 3);
  lcd.print("Running ");
  lcd.print(millis() / 1000);
  lcd.print("s   ");
  delay(500);
}
`,
  },
  npmatrix: {
    tag: "wokwi-neopixel-matrix", label: "NeoPixel matrix 8×8", cat: "Light & sound", kind: "module", attrs: { rows: "8", cols: "8" },
    props: [{ k: "cols", label: "Columns", type: "select", opts: ["8", "16", "32"] }, { k: "rows", label: "Rows", type: "select", opts: ["8", "16"] }],
    pw: { vcc: ["VCC"], gnd: ["GND"] }, kit: ["WS2812B matrix 8x8"],
    help: "64 addressable LEDs on one data wire. Pixel 0 is the top left; the library numbers them along each row.",
    defaults: { DIN: 6 }, defaultsEsp: { DIN: 23 },
    code: `// Draw on an 8x8 NeoPixel matrix
#include <Adafruit_NeoPixel.h>
const int W = 8, H = 8;
Adafruit_NeoPixel px(W * H, {DIN}, NEO_GRB + NEO_KHZ800);

int at(int x, int y) { return y * W + x; }

void setup() {
  px.begin();
  px.setBrightness(90);
}

void loop() {
  // a dot that walks across the matrix
  for (int y = 0; y < H; y++) {
    for (int x = 0; x < W; x++) {
      px.clear();
      px.setPixelColor(at(x, y), px.Color(0, 120, 255));
      px.show();
      delay(45);
    }
  }
}
`,
  },

  /* ================= light and sound ================= */
  laser: {
    tag: "cl-laser", label: "Laser module", cat: "Light & sound", kind: "module", pw: { vcc: ["VCC"], gnd: ["GND"] }, kit: ["Laser module KY-008"],
    help: "A 5 mW red laser diode on a board. S HIGH turns the beam on. Never point a laser at anyone's eyes, even this one.",
    defaults: { S: 2 }, defaultsEsp: { S: 27 },
    code: `// Laser tripwire transmitter: blink the beam
const int LASER = {S};

void setup() {
  pinMode(LASER, OUTPUT);
  Serial.begin(9600);
}

void loop() {
  digitalWrite(LASER, HIGH);
  Serial.println("Beam on");
  delay(1500);
  digitalWrite(LASER, LOW);
  Serial.println("Beam off");
  delay(500);
}
`,
  },
  speaker: {
    tag: "cl-speaker", label: "Speaker 8 Ω", cat: "Light & sound", kind: "module", kit: ["Mini speaker 8 ohm"],
    help: "A real speaker instead of a buzzer: louder and it can play tunes. Put a 100 Ω resistor in series to protect the pin.",
    defaults: { "1": 8 }, defaultsEsp: { "1": 25 },
    code: `// Play a short tune on a speaker
const int SPK = {1};
const int NOTES[] = { 262, 294, 330, 349, 392, 440, 494, 523 };

void setup() { Serial.begin(9600); }

void loop() {
  for (int i = 0; i < 8; i++) {
    tone(SPK, NOTES[i]);
    Serial.println(NOTES[i]);
    delay(250);
  }
  noTone(SPK);
  delay(900);
}
`,
  },

  /* ================= motion ================= */
  solenoid: {
    tag: "cl-solenoid", label: "Solenoid", cat: "Motion", kind: "module", kit: ["Solenoid 12V"],
    help: "An electromagnet that yanks a metal rod in. Door locks and pinball machines use them. It needs far more current than a pin: switch it with a relay or a MOSFET.",
    code: `// Solenoid door lock, switched through a relay on this pin
const int LOCK = 7;

void setup() {
  pinMode(LOCK, OUTPUT);
  Serial.begin(9600);
}

void loop() {
  Serial.println("Unlock");
  digitalWrite(LOCK, HIGH);
  delay(1200);
  Serial.println("Lock");
  digitalWrite(LOCK, LOW);
  delay(3000);
}
`,
  },
  servo360: {
    tag: "wokwi-servo", label: "Servo (continuous 360°)", cat: "Motion", kind: "module", pw: { vcc: ["V+"], gnd: ["GND"] }, kit: ["Continuous rotation servo FS90R"],
    help: "Looks like an SG90 but keeps turning instead of holding an angle. write(90) stops it, below 90 turns one way, above 90 the other. Speed, not position.",
    defaults: { PWM: 9 }, defaultsEsp: { PWM: 13 },
    code: `// Continuous servo: 90 is stop, 0 and 180 are full speed each way
#include <Servo.h>
Servo wheel;

void setup() {
  wheel.attach({PWM});
  Serial.begin(9600);
}

void loop() {
  Serial.println("Forwards");
  wheel.write(180);
  delay(2000);
  Serial.println("Stop");
  wheel.write(90);
  delay(1000);
  Serial.println("Backwards");
  wheel.write(0);
  delay(2000);
  wheel.write(90);
  delay(1000);
}
`,
  },

  /* ================= power ================= */
  buck: {
    tag: "cl-buck", label: "Buck converter LM2596", cat: "Power", kind: "module", sim: { vout: 5 }, props: [v("vout", "Output voltage", 1.5, 11, " V", 0.1)],
    kit: ["Buck converter LM2596"],
    help: "Steps a higher voltage down efficiently, so one 12 V battery can feed a 5 V board. Turn the little screw to set the output, then check it before connecting anything.",
    code: `// Nothing to program: a buck converter is pure power electronics.
// Feed IN+ / IN- from a battery and take 5 V from OUT+ / OUT-.
// Set the output with the inspector slider, then wire OUT+ to the board's 5V pin.

void setup() { Serial.begin(9600); }

void loop() {
  Serial.println("Board is powered through the buck converter");
  delay(2000);
}
`,
  },
  psu: {
    tag: "cl-psu", label: "Breadboard power supply", cat: "Power", kind: "module", kit: ["Breadboard power supply module"],
    help: "Clips onto the end of a breadboard and feeds the rails with a tidy 5 V and 3.3 V from a DC adapter.",
    code: `// A power module needs no code: it just feeds the breadboard rails.
void setup() { Serial.begin(9600); }
void loop() { delay(1000); }
`,
  },
};

/* gas sensors: same module drawing, different target gas */
const GAS = { mq3: ["MQ-3", "Alcohol MQ-3", "Breath alcohol. Used in breathalysers.", "Alcohol"], mq4: ["MQ-4", "Methane MQ-4", "Natural gas and methane leaks.", "Methane"], mq7: ["MQ-7", "Carbon monoxide MQ-7", "Carbon monoxide, the silent killer from faulty heaters.", "CO"], mq8: ["MQ-8", "Hydrogen MQ-8", "Hydrogen gas.", "Hydrogen"], mq9: ["MQ-9", "CO + gas MQ-9", "Carbon monoxide and flammable gases together.", "CO / gas"] };
Object.entries(GAS).forEach(([k, [kind, label, about, what]]) => {
  PARTS2[k] = {
    tag: "cl-gas", label, cat: "Sensors", kind: "module", attrs: { kind }, sim: { ppm: 120 }, props: [v("ppm", what, 0, 1000, " ppm", 5)],
    pw: { vcc: ["VCC"], gnd: ["GND"] }, kit: [kind + " gas sensor"],
    help: `${about} AO rises with the amount of gas; DO flips when it passes the level set by the little screw. Real MQ sensors need a few minutes to warm up.`,
    defaults: { AO: "A0", DO: 2 }, defaultsEsp: { AO: 34, DO: 27 },
    code: `// ${label}: warn when the gas level climbs
const int SENSOR = {AO};
const int LIMIT = 400;

void setup() {
  pinMode(LED_BUILTIN, OUTPUT);
  Serial.begin(9600);
}

void loop() {
  int raw = analogRead(SENSOR);
  Serial.print("${what}: ");
  Serial.println(raw);
  digitalWrite(LED_BUILTIN, raw > LIMIT);
  if (raw > LIMIT) Serial.println("  WARNING: gas level high");
  delay(700);
}
`,
  };
});

/* example code for the passive parts that had none */
const PASSIVE = {
  resistor: `// A resistor needs no code, but it decides how bright an LED is.
// Swap the value in the inspector and watch what happens.
const int LED = 9;

void setup() { pinMode(LED, OUTPUT); Serial.begin(9600); }

void loop() {
  for (int b = 0; b <= 255; b += 5) { analogWrite(LED, b); delay(12); }
  for (int b = 255; b >= 0; b -= 5) { analogWrite(LED, b); delay(12); }
  Serial.println("A bigger resistor means less current and a dimmer LED");
}
`,
  capacitor: `// A capacitor stores charge. Put one across the power rails and the
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
`,
  lamp: `// A 5 V lamp needs more current than a pin can give: switch it with a relay.
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
`,
  dcmotor: `// A DC motor through an L298N: forwards, stop, backwards
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
`,
  fan: `// A 5 V fan switched by a relay, with a temperature rule
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
`,
  pump: `// Water the plant when the soil is dry
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
`,
  battery: `// A battery needs no code. Wire + to the board's VIN and - to GND.
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
`,
  solar: `// Solar panel: watch how much the sun gives you
void setup() { Serial.begin(9600); }

void loop() {
  float volts = analogRead(A0) * 5.0 / 1023.0 * 5.0;
  Serial.print("Panel: ");
  Serial.print(volts, 2);
  Serial.println(" V");
  if (volts > 4.5) Serial.println("  Enough to charge");
  delay(1200);
}
`,
};
Object.entries(PASSIVE).forEach(([k, code]) => { PARTS2[k] = Object.assign({}, PARTS2[k], { code, passiveCode: true }); });
