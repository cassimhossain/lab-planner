/* Circuit Lab - part catalogue.
   kind: board | bb (sits on the breadboard) | module (wired with jumper wires)
   pw: power pins { vcc:[...], gnd:[...] } used by the auto-layout and the "is it powered" check
   code: a ready-made example for the part. {PIN:name} is replaced by the board pin it is wired to. */
import "./elements.js?v=6";
import { PARTS2 } from "./parts2.js?v=6";
import { PARTS3 } from "./parts3.js?v=6";
import { PARTS4 } from "./parts4.js?v=6";
export { P as PITCH, BB, BB_GROUPS, bbGroupOf, bbLayout } from "./elements.js?v=6";

const COLORS = ["red", "green", "yellow", "blue", "white", "orange"];
export const CATS = ["Boards", "Basics", "Input", "Sensors", "Displays", "Light & sound", "Motion", "Power", "Communication"];

const v = (k, label, min, max, unit = "", step = 1) => ({ k, label, type: "range", min, max, step, unit, sim: true, live: true });
export const PARTS = {
  /* ---------- boards ---------- */
  uno: { tag: "wokwi-arduino-uno", label: "Arduino Uno", cat: "Boards", kind: "board", one: true, kit: ["Arduino Uno + USB cable"],
    help: "The brain. Pins 0-13 are digital (~ marks PWM), A0-A5 read voltages. 5V and GND power your parts." },
  esp32: { tag: "wokwi-esp32-devkit-v1", label: "ESP32 DevKit", cat: "Boards", kind: "board", one: true, kit: ["ESP32 Dev Board + USB cable"],
    help: "Wi-Fi + Bluetooth board, 3.3V logic. Use GPIO numbers in code (e.g. 2 for D2). Teaching mode: pins, ADC, PWM, Serial work; Wi-Fi, web pages, MQTT and ESP-NOW are simulated in the Phone/Network panel." },

  /* ---------- basics ---------- */
  breadboard: { tag: "cl-breadboard", label: "Breadboard", cat: "Basics", kind: "base", attrs: { cols: "30" }, props: [{ k: "cols", label: "Size", type: "select", opts: ["30", "60"] }], kit: ["Breadboard (half size)"],
    help: "Each short column of 5 holes (a-e, f-j) is joined inside. The long + and − rails run along the edges. Drop a part's legs on holes to connect them." },
  led: { tag: "wokwi-led", label: "LED", cat: "Basics", kind: "bb", attrs: { color: "red" }, props: [{ k: "color", label: "Colour", type: "select", opts: COLORS }], kit: ["LED 5 mm (assorted)"],
    help: "Long leg (A, anode) goes to + through a resistor; short leg (C, cathode) to GND.",
    code: `// Blink an LED
const int LED = {A};

void setup() {
  pinMode(LED, OUTPUT);
}

void loop() {
  digitalWrite(LED, HIGH);
  delay(500);
  digitalWrite(LED, LOW);
  delay(500);
}
` },
  resistor: { tag: "cl-resistor", label: "Resistor", cat: "Basics", kind: "bb", attrs: { value: "220", span: "4" }, props: [{ k: "value", label: "Resistance (Ω)", type: "select", opts: ["100", "220", "330", "1000", "4700", "10000"] }], kit: ["Resistor 220 ohm", "Resistor 10k ohm", "Resistor 1k ohm"],
    help: "Limits current. 220 Ω protects an LED. 10 kΩ is used as a pull-down for buttons." },
  rgbled: { tag: "wokwi-rgb-led", label: "RGB LED", cat: "Basics", kind: "bb", sim: { common: "cathode" }, props: [{ k: "common", label: "Common pin", type: "select", opts: ["cathode", "anode"], sim: true }], kit: ["RGB LED"],
    help: "Three LEDs in one. COM to GND (common cathode). analogWrite on R, G and B mixes any colour.",
    code: `// Mix colours on an RGB LED (use ~ PWM pins)
const int R = {R}, G = {G}, B = {B};

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
` },
  button: { tag: "wokwi-pushbutton-6mm", label: "Push button", cat: "Basics", kind: "bb", attrs: { color: "green" }, props: [{ k: "color", label: "Colour", type: "select", opts: ["red", "green", "blue", "yellow", "white", "black"] }], kit: ["Push button"],
    help: "Legs on the same side are always joined; pressing joins the two sides. Use INPUT_PULLUP and wire the other side to GND: it reads LOW when pressed.",
    code: `// Read a push button (INPUT_PULLUP: LOW = pressed)
const int BUTTON = {1.l};

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
` },
  slideswitch: { tag: "wokwi-slide-switch", label: "Slide switch", cat: "Basics", kind: "bb", kit: ["Slide switch"], help: "The middle pin (2) connects to pin 1 or pin 3." },
  pot: { tag: "wokwi-potentiometer", label: "Potentiometer", cat: "Basics", kind: "bb", attrs: { value: "512" }, pw: { gnd: ["GND"], vcc: ["VCC"] }, kit: ["Potentiometer 10k"],
    help: "Outer legs to 5V and GND, middle leg (SIG) to an analog pin. Turn the knob while the simulation runs.",
    code: `// Read a potentiometer (0-1023)
const int KNOB = {SIG};

void setup() {
  Serial.begin(9600);
}

void loop() {
  int value = analogRead(KNOB);
  Serial.println(value);
  delay(100);
}
` },
  capacitor: { tag: "cl-capacitor", label: "Capacitor", cat: "Basics", kind: "bb", attrs: { value: "100uF" }, props: [{ k: "value", label: "Value", type: "select", opts: ["10nF", "10uF", "100uF"] }], kit: ["Capacitor 100 uF", "Capacitor 10 uF", "Capacitor 10 nF"],
    help: "Stores charge. A 100 µF capacitor across the power of an LED strip smooths sudden current. (Shown for wiring; it has no effect on the simulation.)" },

  /* ---------- input ---------- */
  joystick: { tag: "wokwi-analog-joystick", label: "Joystick", cat: "Input", kind: "module", pw: { vcc: ["VCC"], gnd: ["GND"] }, kit: ["Joystick module"],
    help: "VERT and HORZ to analog pins: about 512 in the middle, higher when pushed up or left. SEL is a button: use INPUT_PULLUP, it reads LOW when pressed.",
    code: `// Read a joystick
const int VX = {HORZ}, VY = {VERT}, SW = {SEL};

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
` },
  keypad: { tag: "wokwi-membrane-keypad", label: "Keypad 4×4", cat: "Input", kind: "module", kit: ["4x4 matrix keypad"],
    help: "Rows R1-R4 and columns C1-C4 go to 8 digital pins. Use the Keypad library. Click the keys while running.",
    code: `// 4x4 keypad
#include <Keypad.h>
const byte ROWS = 4, COLS = 4;
char keys[ROWS][COLS] = {
  {'1','2','3','A'},
  {'4','5','6','B'},
  {'7','8','9','C'},
  {'*','0','#','D'}
};
byte rowPins[ROWS] = {{R1}, {R2}, {R3}, {R4}};
byte colPins[COLS] = {{C1}, {C2}, {C3}, {C4}};
Keypad keypad = Keypad(makeKeymap(keys), rowPins, colPins, ROWS, COLS);

void setup() {
  Serial.begin(9600);
}

void loop() {
  char key = keypad.getKey();
  if (key) Serial.println(key);
}
` },

  /* ---------- sensors ---------- */
  hcsr04: { tag: "wokwi-hc-sr04", label: "Ultrasonic HC-SR04", cat: "Sensors", kind: "module", sim: { dist: 40 }, props: [v("dist", "Distance", 2, 400, " cm")], pw: { vcc: ["VCC"], gnd: ["GND"] }, kit: ["Ultrasonic sensor HC-SR04"],
    help: "TRIG and ECHO to digital pins. Distance (cm) = echo time × 0.0343 ÷ 2.",
    code: `// Measure distance with an HC-SR04
const int TRIG = {TRIG}, ECHO = {ECHO};

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
` },
  ir: { tag: "cl-ir-obstacle", label: "IR obstacle sensor", cat: "Sensors", kind: "module", sim: { obstacle: false }, props: [{ k: "obstacle", label: "Object in front", type: "toggle", text: "Object in front", sim: true, live: true }], pw: { vcc: ["VCC"], gnd: ["GND"] }, kit: ["IR sensor module"],
    help: "OUT goes LOW when something is close in front of the sensor.",
    code: `// IR obstacle sensor (LOW = object)
const int IR = {OUT};

void setup() {
  pinMode(IR, INPUT);
  Serial.begin(9600);
}

void loop() {
  Serial.println(digitalRead(IR) == LOW ? "Object!" : "clear");
  delay(200);
}
` },
  irline: { tag: "cl-irline", label: "IR line sensor", cat: "Sensors", kind: "module", sim: { black: false }, props: [{ k: "black", label: "Black line under sensor", type: "toggle", text: "Over the black line", sim: true, live: true }], pw: { vcc: ["VCC"], gnd: ["GND"] }, kit: ["IR sensor module"],
    help: "TCRT5000 line tracker. OUT is HIGH over a black line and LOW over white.",
    code: `// IR line sensor
const int LINE = {OUT};

void setup() {
  pinMode(LINE, INPUT);
  Serial.begin(9600);
}

void loop() {
  Serial.println(digitalRead(LINE) == HIGH ? "black line" : "white floor");
  delay(200);
}
` },
  ldr: { tag: "cl-ldr", label: "Light sensor (LDR)", cat: "Sensors", kind: "module", sim: { lux: 300, link: "" }, props: [v("lux", "Light", 0, 1000, " lux")], pw: { vcc: ["VCC"], gnd: ["GND"] }, kit: ["LDR module"],
    help: "AO gives a lower number in bright light and a higher number in the dark. DO goes HIGH when it is dark.",
    code: `// Read light level from an LDR module
const int LIGHT = {AO};

void setup() {
  Serial.begin(9600);
}

void loop() {
  int dark = analogRead(LIGHT);   // higher = darker
  Serial.println(dark);
  delay(200);
}
` },
  dht22: { tag: "wokwi-dht22", label: "DHT22 temp & humidity", cat: "Sensors", kind: "module", sim: { temp: 28, hum: 55 }, props: [v("temp", "Temperature", -10, 60, " °C"), v("hum", "Humidity", 0, 100, " %")], pw: { vcc: ["VCC"], gnd: ["GND"] }, kit: ["DHT22 sensor"],
    help: "VCC to 5V, GND, SDA (data) to a digital pin. Use the DHT library.",
    code: `// Temperature and humidity with a DHT22
#include <DHT.h>
DHT dht({SDA}, DHT22);

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
` },
  pir: { tag: "wokwi-pir-motion-sensor", label: "PIR motion sensor", cat: "Sensors", kind: "module", sim: {}, props: [{ k: "motion", label: "Motion", type: "button", text: "Wave in front (5 s)", sim: true, live: true }], pw: { vcc: ["VCC"], gnd: ["GND"] }, kit: ["PIR motion sensor"],
    help: "OUT goes HIGH for a few seconds when it sees movement.",
    code: `// PIR motion sensor
const int PIR = {OUT};

void setup() {
  pinMode(PIR, INPUT);
  Serial.begin(9600);
}

void loop() {
  if (digitalRead(PIR) == HIGH) Serial.println("Motion detected!");
  delay(300);
}
` },
  soil: { tag: "cl-soil", label: "Soil moisture sensor", cat: "Sensors", kind: "module", sim: { moisture: 25 }, props: [v("moisture", "Soil moisture", 0, 100, " %")], pw: { vcc: ["VCC"], gnd: ["GND"] }, kit: ["Soil moisture sensor"],
    help: "AO reads about 1000 in dry soil and about 300 in wet soil. DO goes LOW when wet.",
    code: `// Soil moisture
const int SOIL = {AO};

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
` },
  rain: { tag: "cl-rain", label: "Rain sensor", cat: "Sensors", kind: "module", sim: { wet: 0 }, props: [v("wet", "Rain on the plate", 0, 100, " %")], pw: { vcc: ["VCC"], gnd: ["GND"] }, kit: ["Rain sensor"],
    help: "AO drops as the plate gets wet. DO goes LOW when it rains.",
    code: `// Rain sensor
const int RAIN = {AO};

void setup() {
  Serial.begin(9600);
}

void loop() {
  int v = analogRead(RAIN);            // lower = wetter
  Serial.println(v < 600 ? "Raining!" : "Dry");
  delay(500);
}
` },
  mq2: { tag: "cl-gas", label: "Gas / smoke MQ-2", cat: "Sensors", kind: "module", attrs: { kind: "MQ-2" }, sim: { ppm: 150 }, props: [v("ppm", "Smoke / gas", 0, 1000, " ppm")], pw: { vcc: ["VCC"], gnd: ["GND"] }, kit: ["MQ-2 gas sensor"],
    help: "AO rises with smoke or gas (LPG, propane). DO goes LOW above the trimmer's threshold.",
    code: `// MQ-2 smoke / gas sensor
const int GAS = {AO};

void setup() {
  Serial.begin(9600);
}

void loop() {
  int level = analogRead(GAS);
  Serial.print("Gas level: "); Serial.println(level);
  if (level > 400) Serial.println("  Warning: smoke or gas!");
  delay(500);
}
` },
  mq135: { tag: "cl-gas", label: "Air quality MQ-135", cat: "Sensors", kind: "module", attrs: { kind: "MQ-135" }, sim: { ppm: 120 }, props: [v("ppm", "Pollution (CO₂, smoke)", 0, 1000, " ppm")], pw: { vcc: ["VCC"], gnd: ["GND"] }, kit: ["MQ-135 air quality sensor"],
    help: "AO rises with polluted air (CO₂, ammonia, smoke). Good for air-quality projects.",
    code: `// MQ-135 air quality
const int AIR = {AO};

void setup() {
  Serial.begin(9600);
}

void loop() {
  int q = analogRead(AIR);
  Serial.print("Air quality value: "); Serial.print(q);
  Serial.println(q < 200 ? "  (good)" : q < 450 ? "  (moderate)" : "  (poor)");
  delay(1000);
}
` },
  flame: { tag: "cl-flame", label: "Flame sensor", cat: "Sensors", kind: "module", sim: { flame: 0 }, props: [v("flame", "Flame nearby", 0, 100, " %")], pw: { vcc: ["VCC"], gnd: ["GND"] }, kit: ["Flame sensor"],
    help: "Sees infrared light from a flame. DO goes LOW and AO drops when there is a flame.",
    code: `// Flame sensor
const int FLAME = {DO};

void setup() {
  pinMode(FLAME, INPUT);
  Serial.begin(9600);
}

void loop() {
  Serial.println(digitalRead(FLAME) == LOW ? "FIRE!" : "no flame");
  delay(300);
}
` },
  sound: { tag: "cl-sound", label: "Sound sensor KY-037", cat: "Sensors", kind: "module", sim: { loud: 80 }, props: [v("loud", "Sound level", 0, 1000)], pw: { vcc: ["VCC"], gnd: ["GND"] }, kit: ["Sound sensor KY-037"],
    help: "AO follows the loudness. DO goes HIGH on a loud sound (clap).",
    code: `// Sound sensor
const int MIC = {AO};

void setup() {
  Serial.begin(9600);
}

void loop() {
  Serial.println(analogRead(MIC));
  delay(50);
}
` },
  pulse: { tag: "cl-pulse", label: "Pulse sensor", cat: "Sensors", kind: "module", sim: { bpm: 72 }, props: [v("bpm", "Heart rate", 40, 180, " bpm")], pw: { vcc: ["+"], gnd: ["-"] }, kit: ["Pulse sensor"],
    help: "S gives a wave that peaks with every heartbeat (about 520 at rest, 700+ at a beat).",
    code: `// Pulse sensor: count beats
const int PULSE = {S};
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
` },
  mpu6050: { tag: "cl-mpu", label: "MPU6050 motion", cat: "Sensors", kind: "module", attrs: { ad0: "0" }, sim: { ax: 0, ay: 0, az: 9.8, gx: 0, gy: 0, gz: 0 }, props: [v("ax", "Tilt X (accel)", -20, 20, " m/s²", .1), v("ay", "Tilt Y (accel)", -20, 20, " m/s²", .1), v("az", "Accel Z", -20, 20, " m/s²", .1), v("gz", "Turn rate Z", -250, 250, " °/s")], pw: { vcc: ["VCC"], gnd: ["GND"] }, i2c: { sda: "SDA", scl: "SCL", addr: 0x68 }, kit: ["MPU6050 IMU"],
    help: "Accelerometer + gyroscope on I2C (SDA, SCL). Use Adafruit_MPU6050. Tilt it with the sliders.",
    code: `// MPU6050 accelerometer and gyro
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
` },
  hx711: { tag: "cl-hx711", label: "Load cell + HX711", cat: "Sensors", kind: "module", sim: { grams: 0 }, props: [v("grams", "Weight on the scale", 0, 5000, " g", 10)], pw: { vcc: ["VCC"], gnd: ["GND"] }, kit: ["Load cell 5 kg + HX711"],
    help: "DT and SCK to two digital pins. Use the HX711 library. In Circuit Lab, set_scale(420) gives grams.",
    code: `// Kitchen scale with HX711
#include <HX711.h>
HX711 scale;

void setup() {
  Serial.begin(9600);
  scale.begin({DT}, {SCK});
  scale.set_scale(420.0);   // calibration factor
  scale.tare();             // empty scale = 0 g
}

void loop() {
  Serial.print("Weight: ");
  Serial.print(scale.get_units(5), 0);
  Serial.println(" g");
  delay(500);
}
` },
  tcs34725: { tag: "cl-tcs", label: "Colour sensor TCS34725", cat: "Sensors", kind: "module", sim: { color: "#E63946" }, props: [{ k: "color", label: "Object colour", type: "color", sim: true, live: true }], pw: { vcc: ["VIN"], gnd: ["GND"] }, i2c: { sda: "SDA", scl: "SCL", addr: 0x29 }, kit: ["Colour sensor TCS34725"],
    help: "Reads red, green and blue light on I2C. Use Adafruit_TCS34725.",
    code: `// Colour sensor
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
` },
  ina219: { tag: "cl-ina219", label: "Current sensor INA219", cat: "Sensors", kind: "module", attrs: { addr: "0x40" }, sim: { load: "LED (20 mA)", volts: 5 }, props: [{ k: "addr", label: "I2C address", type: "select", opts: ["0x40", "0x41", "0x44"] }, v("volts", "Supply voltage", 0, 12, " V", 0.05), { k: "load", label: "Gadget being measured", type: "select", opts: ["Nothing (0 mA)", "LED (20 mA)", "Buzzer (30 mA)", "Servo moving (250 mA)", "DC motor (180 mA)", "Fan (150 mA)", "Phone charging (900 mA)"], sim: true, live: true }], pw: { vcc: ["VCC"], gnd: ["GND"] }, i2c: { sda: "SDA", scl: "SCL", addr: 0x40 }, kit: ["Current sensor INA219"],
    help: "Measures voltage, current and power of a gadget on I2C. Use Adafruit_INA219.",
    code: `// Measure power with an INA219
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
` },
  voltsensor: { tag: "cl-voltsensor", label: "Voltage sensor 0-25V", cat: "Sensors", kind: "module", kit: [], help: "Divides the voltage on VCC/GND by 5 so an Arduino can read it on S. volts = analogRead × 5.0 / 1023 × 5.",
    code: `// Battery voltage
const int VS = {S};

void setup() {
  Serial.begin(9600);
}

void loop() {
  float v = analogRead(VS) * 5.0 / 1023.0 * 5.0;
  Serial.print("Battery: "); Serial.print(v, 2); Serial.println(" V");
  delay(1000);
}
` },
  tilt: { tag: "wokwi-tilt-switch", label: "Tilt switch", cat: "Sensors", kind: "module", sim: { tilt: false }, props: [{ k: "tilt", label: "Tilted", type: "toggle", text: "Tilted", sim: true, live: true }], pw: { vcc: ["VCC"], gnd: ["GND"] }, kit: [], help: "OUT goes HIGH when tilted." },

  /* ---------- displays ---------- */
  oled: { tag: "cl-oled", label: "OLED 0.96\" I2C", cat: "Displays", kind: "module", attrs: { color: "white", size: "128x64" }, props: [{ k: "size", label: "Screen size", type: "select", opts: ["128x64", "128x32"] }, { k: "color", label: "Screen colour", type: "select", opts: ["white", "blue", "yellowblue"] }], pw: { vcc: ["VCC"], gnd: ["GND"] }, i2c: { sda: "SDA", scl: "SCL", addr: 0x3c }, kit: ["OLED 0.96 in I2C"],
    help: "128×64 pixel screen on I2C (SDA, SCL). Use Adafruit_SSD1306 at address 0x3C.",
    code: `// OLED display
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
` },
  lcd: { tag: "wokwi-lcd1602", label: "LCD 16×2 I2C", cat: "Displays", kind: "module", attrs: { pins: "i2c" }, pw: { vcc: ["VCC"], gnd: ["GND"] }, i2c: { sda: "SDA", scl: "SCL", addr: 0x27 }, kit: [],
    help: "Two lines of 16 characters on I2C (address 0x27). Use LiquidCrystal_I2C.",
    code: `// 16x2 LCD on I2C
#include <LiquidCrystal_I2C.h>
LiquidCrystal_I2C lcd(0x27, 16, 2);

void setup() {
  lcd.init();
  lcd.backlight();
  lcd.print("Hello, makers!");
}

void loop() {
  lcd.setCursor(0, 1);
  lcd.print("Time: ");
  lcd.print(millis() / 1000);
  lcd.print(" s   ");
  delay(250);
}
` },
  max7219: { tag: "cl-max7219", label: "8×8 LED matrix MAX7219", cat: "Displays", kind: "module", pw: { vcc: ["VCC"], gnd: ["GND"] }, kit: ["MAX7219 8x8 LED matrix"],
    help: "DIN, CS and CLK to three digital pins. Use LedControl: lc.setRow(0, row, pattern).",
    code: `// 8x8 LED matrix smiley
#include <LedControl.h>
LedControl lc({DIN}, {CLK}, {CS}, 1);   // DIN, CLK, CS, number of matrices
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
` },
  seg7: { tag: "wokwi-7segment", label: "7-segment digit", cat: "Displays", kind: "module", sim: { common: "cathode" }, props: [{ k: "common", label: "Common pin", type: "select", opts: ["cathode", "anode"], sim: true }], kit: [], help: "Seven LEDs (A-G) plus DP. COM to GND for common cathode." },

  /* ---------- light & sound ---------- */
  buzzer: { tag: "wokwi-buzzer", label: "Buzzer", cat: "Light & sound", kind: "bb", kit: ["Buzzer", "Passive buzzer"],
    help: "Pin 2 (+) to a digital pin, pin 1 (−) to GND. tone(pin, frequency) plays a note.",
    code: `// Play a melody on a buzzer
const int BUZZER = {2};
int notes[] = {262, 294, 330, 349, 392, 440, 494, 523};

void setup() {}

void loop() {
  for (int i = 0; i < 8; i++) {
    tone(BUZZER, notes[i], 250);
    delay(300);
  }
  delay(1000);
}
` },
  neopixel: { tag: "wokwi-neopixel", label: "NeoPixel (1 LED)", cat: "Light & sound", kind: "module", pw: { vcc: ["VDD"], gnd: ["VSS"] }, kit: [], help: "DIN to a digital pin. Use Adafruit_NeoPixel." },
  ledring: { tag: "wokwi-led-ring", label: "NeoPixel ring", cat: "Light & sound", kind: "module", attrs: { pixels: "12" }, props: [{ k: "pixels", label: "LEDs", type: "select", opts: ["8", "12", "16", "24"] }], pw: { vcc: ["VCC"], gnd: ["GND"] }, kit: ["WS2812B LED ring (12 LEDs)"],
    help: "VCC 5V, GND, DIN to a digital pin. Use Adafruit_NeoPixel.",
    code: `// NeoPixel ring rainbow
#include <Adafruit_NeoPixel.h>
Adafruit_NeoPixel ring(12, {DIN}, NEO_GRB + NEO_KHZ800);

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
` },
  ledstrip: { tag: "cl-ledstrip", label: "NeoPixel LED strip", cat: "Light & sound", kind: "module", attrs: { pixels: "16" }, props: [{ k: "pixels", label: "LEDs", type: "select", opts: ["8", "16", "30"] }], pw: { vcc: ["5V"], gnd: ["GND"] }, kit: ["WS2812B LED strip (1 m, 30 LEDs)"],
    help: "WS2812B strip: 5V, GND, DIN to a digital pin. Use Adafruit_NeoPixel.",
    code: `// LED strip chase
#include <Adafruit_NeoPixel.h>
const int N = 16;
Adafruit_NeoPixel strip(N, {DIN}, NEO_GRB + NEO_KHZ800);

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
` },
  lamp: { tag: "cl-lamp", label: "5V lamp", cat: "Light & sound", kind: "module", kit: ["Low-voltage LED lamp (5 V)"], help: "A lamp that needs more current than a pin gives. Switch it with a relay." },

  /* ---------- motion ---------- */
  servo: { tag: "wokwi-servo", label: "Servo SG90", cat: "Motion", kind: "module", pw: { vcc: ["V+"], gnd: ["GND"] }, kit: ["Servo SG90", "Servo MG995"],
    help: "Brown = GND, red = 5V, orange = signal (PWM pin). Use the Servo library: servo.write(angle).",
    code: `// Sweep a servo
#include <Servo.h>
Servo servo;

void setup() {
  servo.attach({PWM});
}

void loop() {
  for (int a = 0; a <= 180; a += 2) { servo.write(a); delay(15); }
  for (int a = 180; a >= 0; a -= 2) { servo.write(a); delay(15); }
}
` },
  dcmotor: { tag: "cl-dcmotor", label: "DC motor", cat: "Motion", kind: "module", kit: ["DC hobby motor"], help: "Connect to OUT1/OUT2 of an L298N. Arduino pins cannot power a motor directly." },
  l298n: { tag: "cl-l298n", label: "L298N motor driver", cat: "Motion", kind: "module", sim: { ena: false, enb: false }, props: [{ k: "ena", label: "ENA jumper on", type: "toggle", sim: true }, { k: "enb", label: "ENB jumper on", type: "toggle", sim: true }], pw: { gnd: ["GND"] }, kit: ["L298N motor driver", "4WD robot car (assembled, L298N)", "2WD robot chassis kit"],
    help: "IN1/IN2 set motor A's direction, ENA (PWM) its speed. IN3/IN4/ENB for motor B. Power from a battery on 12V, and join GND to the Arduino GND.",
    code: `// Drive two motors with an L298N
const int ENA = {ENA}, IN1 = {IN1}, IN2 = {IN2};
const int ENB = {ENB}, IN3 = {IN3}, IN4 = {IN4};

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
` },
  stepper28: { tag: "cl-stepper28", label: "Stepper 28BYJ-48 + ULN2003", cat: "Motion", kind: "module", pw: { vcc: ["+"], gnd: ["-"] }, kit: ["Stepper 28BYJ-48 + ULN2003"],
    help: "IN1-IN4 to four digital pins. 2048 steps = one turn. Note the pin order in Stepper(): IN1, IN3, IN2, IN4.",
    code: `// 28BYJ-48 stepper: one turn each way
#include <Stepper.h>
Stepper motor(2048, {IN1}, {IN3}, {IN2}, {IN4});   // IN1, IN3, IN2, IN4

void setup() {
  motor.setSpeed(12);   // rpm
}

void loop() {
  motor.step(2048);
  delay(500);
  motor.step(-2048);
  delay(500);
}
` },
  stepper: { tag: "wokwi-stepper-motor", label: "Stepper (NEMA 17)", cat: "Motion", kind: "module", attrs: { size: "17" }, kit: [], help: "Bipolar stepper: drive A+, A-, B+, B- from four pins in sequence. 200 steps per turn." },
  fan: { tag: "cl-fan", label: "5V DC fan", cat: "Motion", kind: "module", kit: ["5 V DC fan"], help: "Needs more current than a pin: switch it with a relay or the L298N." },
  pump: { tag: "cl-pump", label: "Mini water pump", cat: "Motion", kind: "module", kit: ["Mini water pump + tube"], help: "5V pump. Switch it with a relay." },
  vibe: { tag: "cl-vibe", label: "Vibration motor", cat: "Motion", kind: "module", pw: { vcc: ["VCC"], gnd: ["GND"] }, kit: ["Vibration motor module"], help: "IN HIGH = buzz. The module has its own transistor, so a pin can switch it." },
  relay: { tag: "cl-relay", label: "Relay module", cat: "Motion", kind: "module", attrs: { channels: "1" }, sim: { trigger: "HIGH" }, props: [{ k: "channels", label: "Channels", type: "select", opts: ["1", "4"] }, { k: "trigger", label: "Switches on when IN is", type: "select", opts: ["HIGH", "LOW"], sim: true }], pw: { vcc: ["VCC"], gnd: ["GND"] }, kit: ["Relay module (1-channel)", "Relay module (4-channel)"],
    help: "A switch the Arduino controls. IN HIGH closes COM–NO. Put the lamp/fan/pump circuit through COM and NO.",
    code: `// Switch a lamp with a relay
const int RELAY = {IN};

void setup() {
  pinMode(RELAY, OUTPUT);
}

void loop() {
  digitalWrite(RELAY, HIGH);   // lamp on
  delay(2000);
  digitalWrite(RELAY, LOW);    // lamp off
  delay(2000);
}
` },

  /* ---------- power ---------- */
  battery: { tag: "cl-battery", label: "Battery", cat: "Power", kind: "module", attrs: { kind: "9V" }, props: [{ k: "kind", label: "Type", type: "select", opts: ["9V", "4xAA", "2xAA", "18650", "coin", "lemon"] }], kit: ["9V battery + snap", "4xAA battery pack", "18650 cell + holder", "2xAA battery holder + batteries", "Coin cell CR2032"],
    help: "Power for motors, lamps and pumps. Always join its − to the Arduino GND." },
  solar: { tag: "cl-solar", label: "Solar panel 6V", cat: "Power", kind: "module", sim: { sun: 70 }, props: [v("sun", "Sunlight", 0, 100, " %")], kit: ["Small solar panel"],
    help: "Gives up to 6V in full sun. Read it through a voltage sensor (never straight into a pin above 5V)." },

  /* ---------- communication ---------- */
  hc05: { tag: "cl-hc05", label: "Bluetooth HC-05", cat: "Communication", kind: "module", pw: { vcc: ["VCC"], gnd: ["GND"] }, kit: ["Bluetooth module HC-05"],
    help: "TXD → Arduino RX pin, RXD → Arduino TX pin. Use SoftwareSerial. Send messages from the Phone panel while running.",
    code: `// Bluetooth commands from a phone
#include <SoftwareSerial.h>
SoftwareSerial bt({TXD}, {RXD});   // RX, TX (Arduino side)
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
` },
  rfid: { tag: "cl-rfid", label: "RFID reader RC522", cat: "Communication", kind: "module", pw: { vcc: ["3.3V"], gnd: ["GND"] }, kit: ["RFID RC522 + cards"],
    help: "SPI: SDA to pin 10, SCK 13, MOSI 11, MISO 12, RST 9, 3.3V and GND. Use MFRC522. Tap a card from the part panel.",
    code: `// Read RFID card IDs
#include <SPI.h>
#include <MFRC522.h>
MFRC522 rfid({SDA}, {RST});

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
` },
};
/* RFID cards students can tap */
export const CARDS = [{ name: "Blue tag", uid: [0xA3, 0x5F, 0x1C, 0x2B] }, { name: "White card", uid: [0x7E, 0x22, 0x91, 0x04] }, { name: "Unknown card", uid: [0x13, 0x37, 0xBE, 0xEF] }];
/* default pin values for code examples when a pin is not wired yet */

/* example code for parts that had none */
Object.assign(PARTS.slideswitch, { defaults: { "2": 7 }, code: `// Slide switch turns the built-in LED on and off
const int SWITCH = {2};   // middle pin
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
` });
Object.assign(PARTS.tilt, { defaults: { OUT: 4 }, code: `// Tilt alarm: shows when the sensor is tipped over
const int TILT = {OUT};

void setup() {
  pinMode(TILT, INPUT);
  pinMode(LED_BUILTIN, OUTPUT);
  Serial.begin(9600);
}

void loop() {
  bool tilted = digitalRead(TILT) == HIGH;
  digitalWrite(LED_BUILTIN, tilted);
  Serial.println(tilted ? "Tilted!" : "Level");
  delay(250);
}
` });
Object.assign(PARTS.seg7, { defaults: { A: 2, B: 3, C: 4, D: 5, E: 6, F: 7, G: 8, DP: 9 }, code: `// Count 0 to 9 on a common-cathode 7-segment digit
// COM to GND (through the digit), each segment through a 220 ohm resistor
const int SEG[7] = {{A}, {B}, {C}, {D}, {E}, {F}, {G}};   // A B C D E F G
const byte DIGITS[10] = {
  0b1111110, 0b0110000, 0b1101101, 0b1111001, 0b0110011,
  0b1011011, 0b1011111, 0b1110000, 0b1111111, 0b1111011 };

void show(int n) {
  for (int s = 0; s < 7; s++) digitalWrite(SEG[s], bitRead(DIGITS[n], 6 - s));
}

void setup() {
  for (int s = 0; s < 7; s++) pinMode(SEG[s], OUTPUT);
}

void loop() {
  for (int n = 0; n < 10; n++) { show(n); delay(700); }
}
` });
Object.assign(PARTS.neopixel, { defaults: { DIN: 6 }, code: `// One NeoPixel fades through the rainbow
#include <Adafruit_NeoPixel.h>
Adafruit_NeoPixel px(1, {DIN}, NEO_GRB + NEO_KHZ800);

void setup() {
  px.begin();
  px.setBrightness(120);
}

void loop() {
  for (long hue = 0; hue < 65536; hue += 512) {
    px.setPixelColor(0, px.gamma32(px.ColorHSV(hue)));
    px.show();
    delay(10);
  }
}
` });
Object.assign(PARTS.stepper, { defaults: { "A+": 8, "A-": 9, "B+": 10, "B-": 11 }, code: `// Bipolar stepper: one turn forward, one turn back
#include <Stepper.h>
const int STEPS = 200;   // 1.8 degrees per step
Stepper motor(STEPS, {A+}, {A-}, {B+}, {B-});

void setup() {
  motor.setSpeed(30);    // RPM
  Serial.begin(9600);
}

void loop() {
  Serial.println("Forward");
  motor.step(STEPS);
  delay(500);
  Serial.println("Back");
  motor.step(-STEPS);
  delay(500);
}
` });
Object.assign(PARTS.vibe, { defaults: { IN: 5 }, code: `// Vibration motor: short buzzes like a phone
const int MOTOR = {IN};

void buzz(int ms) { digitalWrite(MOTOR, HIGH); delay(ms); digitalWrite(MOTOR, LOW); delay(150); }

void setup() { pinMode(MOTOR, OUTPUT); }

void loop() {
  buzz(200); buzz(200);
  delay(1500);
}
` });

Object.assign(PARTS.rfid, { defaults: Object.assign({ SDA: 10, RST: 9 }, PARTS.rfid.defaults || {}) });
Object.assign(PARTS.hx711, { defaults: Object.assign({ DT: 3, SCK: 2 }, PARTS.hx711.defaults || {}) });
Object.assign(PARTS.max7219, { defaults: Object.assign({ DIN: 12, CLK: 11, CS: 10 }, PARTS.max7219.defaults || {}) });
export const DEFAULT_PINS = { A: 13, R: 9, G: 10, B: 11, "1.l": 2, SIG: "A0", HORZ: "A0", VERT: "A1", SEL: 2, TRIG: 9, ECHO: 10, OUT: 2, AO: "A0", DO: 2, SDA: 2, S: "A0", DT: 3, SCK: 2,
  DIN: 6, CS: 10, CLK: 11, "2": 8, PWM: 9, ENA: 5, IN1: 7, IN2: 8, ENB: 6, IN3: 9, IN4: 11, IN: 7, TXD: 2, RXD: 3, RST: 9, R1: 9, R2: 8, R3: 7, R4: 6, C1: 5, C2: 4, C3: 3, C4: 2 };

/* pins used in example code when a part is not wired yet (ESP32 avoids flash and boot pins) */
export const ESP_DEFAULT_PINS = { A: 2, R: 25, G: 26, B: 27, "1.l": 4, "2": 4, SIG: 34, AO: 34, S: 34, HORZ: 34, VERT: 35, SEL: 27, TRIG: 5, ECHO: 18, OUT: 27, DO: 27,
  SDA: 5, RST: 17, DT: 16, SCK: 4, DIN: 23, CS: 5, CLK: 18, PWM: 13, ENA: 14, IN1: 27, IN2: 26, ENB: 32, IN3: 25, IN4: 33, IN: 26, TXD: 16, RXD: 17,
  R1: 13, R2: 12, R3: 14, R4: 27, C1: 26, C2: 25, C3: 33, C4: 32, "A+": 25, "A-": 26, "B+": 27, "B-": 14 };
Object.assign(PARTS.seg7, { defaultsEsp: { A: 13, B: 12, C: 14, D: 27, E: 26, F: 25, G: 33, DP: 32 } });
Object.assign(PARTS.max7219, { defaultsEsp: { DIN: 23, CLK: 18, CS: 5 } });
Object.assign(PARTS, PARTS2, PARTS3, PARTS4);

export function defaultPin(d, k, board) {
  if (board === "esp32") return (d.defaultsEsp || {})[k] ?? ESP_DEFAULT_PINS[k] ?? 4;
  return (d.defaults || {})[k] ?? DEFAULT_PINS[k] ?? 2;
}
