/* Circuit Lab - ready-made circuits for the club's lessons. Generated layouts come from layout.js. */
import LE from "./lessons-le.js?v=19";
import JM from "./lessons-jm.js?v=19";
import YI from "./lessons-yi.js?v=19";
import TL from "./lessons-tl.js?v=19";
export const GROUPS = {
  F: { name: "Foundation", color: "#475569" },
  LE: { name: "Little Explorers", color: "#16A34A" },
  JM: { name: "Junior Makers", color: "#2563EB" },
  YI: { name: "Young Innovators", color: "#7C3AED" },
  TL: { name: "Tech Leaders", color: "#DC2626" },
};
const L = {};
const def = (code, s) => { L[code] = Object.assign({ lesson: code, board: "uno" }, s); };

def("LE-04", {
  title: "Traffic Light Controller", goal: "Red, yellow and green LEDs take turns like a real traffic light, with a beep before red.",
  parts: [{ t: "led", color: "red", pin: 13 }, { t: "led", color: "yellow", pin: 12 }, { t: "led", color: "green", pin: 11 }, { t: "buzzer", pin: 8 }],
  try: ["Press Start and watch the order: green, yellow, red.", "Make the green light last 5 seconds.", "Add a pedestrian beep: tone(8, 1000, 200) every second while red is on."],
  code: `// Traffic light: green -> yellow -> red
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
`,
});
def("LE-07", {
  title: "Plant Water Alarm", goal: "When the soil gets dry the red LED lights and the buzzer beeps. Wet soil = green LED.",
  parts: [{ t: "soil", pins: { AO: "A0" } }, { t: "led", color: "green", pin: 12 }, { t: "led", color: "red", pin: 13 }, { t: "buzzer", pin: 8 }],
  try: ["Click the soil sensor and slide the moisture down below 30%.", "Change the dry level in the code from 30 to 40.", "Make the buzzer beep three short times instead of one long beep."],
  code: `// Plant water alarm
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
`,
});
def("JM-03", {
  title: "Mini Weather Station with OLED Display", goal: "Temperature, humidity and light level on an OLED screen. The LED warns when it is too hot.",
  parts: [{ t: "dht22", pins: { SDA: 7 } }, { t: "ldr", pins: { AO: "A0" } }, { t: "oled" }, { t: "led", color: "red", pin: 13 }, { t: "buzzer", pin: 8 }],
  try: ["Click the DHT22 and change the temperature: the screen updates every 2 seconds.", "Cover the light sensor (light slider to 0): the screen shows 'Dark'.", "Make the red LED come on above 35 °C."],
  code: `// Mini weather station
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
`,
});
def("JM-07", {
  title: "Temperature-Controlled Smart Fan", goal: "The motor (fan) speeds up as it gets hotter. The knob sets the temperature where the fan starts.",
  parts: [{ t: "dht22", pins: { SDA: 7 } }, { t: "pot", pin: "A0" }, { t: "l298n", pins: { ENA: 5, IN1: 3, IN2: 4 }, with: { motors: 1, supply: "4xAA" } }, { t: "oled" }],
  try: ["Raise the DHT22 temperature above the set point: the motor starts.", "Turn the knob to change the set point.", "Make the fan run at full speed above 35 °C."],
  code: `// Smart fan
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
`,
});
def("JM-12", {
  title: "Phone-Controlled RGB Mood Lamp", goal: "Send letters from the phone over Bluetooth to change the lamp colour.",
  parts: [{ t: "hc05", pins: { TXD: 2, RXD: 3 } }, { t: "rgbled", pins: { R: 9, G: 10, B: 11 } }],
  try: ["Start, open the Phone tab and send R, G, B or W.", "Add a new colour: P for purple (255, 0, 255).", "Send a number 0-9 to change the brightness."],
  code: `// Bluetooth RGB mood lamp
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
`,
});
def("JM-22", {
  title: "8x8 LED Matrix Emoji Display", goal: "Show emoji on an 8x8 LED matrix. A button changes the face.",
  parts: [{ t: "max7219", pins: { DIN: 12, CS: 10, CLK: 11 } }, { t: "button", pin: 2 }, { t: "buzzer", pin: 8 }],
  try: ["Press the button to switch between happy and sad.", "Draw your own emoji: change the 1s and 0s.", "Add a third face (surprised)."],
  code: `// Emoji on an 8x8 LED matrix
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
`,
});
def("YI-03", {
  title: "Smart Classroom Energy Saver", goal: "The lamp turns on only when someone is in the room and it is dark.",
  parts: [{ t: "pir", pins: { OUT: 2 } }, { t: "ldr", pins: { AO: "A0" } }, { t: "relay", pins: { IN: 7 }, with: { load: "lamp", supply: "4xAA" } }, { t: "oled" }],
  try: ["Click the PIR and press 'Wave in front'.", "Make the room dark with the light slider: the lamp comes on.", "Keep the lamp on for 10 seconds after the last movement."],
  code: `// Smart classroom energy saver
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
`,
});
[LE, JM, YI, TL].forEach(set => Object.entries(set).forEach(([k, v]) => { if (v) def(k, v); }));
/* keep the lesson order F, LE, JM, YI, TL and numeric */
const ORDER = { F: 0, LE: 1, JM: 2, YI: 3, TL: 4 };
export const LESSONS = Object.fromEntries(Object.entries(L).sort(([a], [b]) => { const [ga, na] = a.split("-"), [gb, nb] = b.split("-"); return (ORDER[ga] - ORDER[gb]) || (+na - +nb); }));
/* lessons whose circuits can't be simulated, and where to go instead */
export const NOT_SIMULATED = {
  "LE-13": "Makey Makey turns fruit into keyboard keys: try it with the real kit and Scratch.",
  "LE-15": "Makey Makey and playdough: use the real kit with Scratch.",
  "LE-24": "A motor used as a generator: see Faraday's Law in Virtual labs.",
  "JM-28": "Wind turbine generator: see Faraday's Law and Faraday's Electromagnetic Lab in Virtual labs.",
  "YI-01": "The 555 timer is analogue: explore capacitors in Capacitor Lab and Circuit Construction Kit: AC.",
  "YI-20": "The ESP32-CAM camera can't be simulated.",
  "TL-18": "The ESP32-CAM camera can't be simulated.",
};
import { SNIPPETS } from "./snippets.js?v=19";
const snip = t => SNIPPETS.find(x => x.title === t).code;
export const STARTERS = [
  { key: "blink", cat: "Basics", title: "Blink", goal: "The classic first program: the on-board LED blinks.", parts: [], board: "uno", code: snip("Blink") },
  { key: "button", cat: "Basics", title: "Button and LED", goal: "Press the button to light the LED.", parts: [{ t: "button", pin: 2 }, { t: "led", color: "red", pin: 13 }], code: snip("Button controls an LED") },
  { key: "fade", cat: "Basics", title: "Fade an LED", goal: "analogWrite makes an LED breathe.", parts: [{ t: "led", color: "blue", pin: 9 }], code: snip("Fade an LED (PWM)") },
  { key: "chaser", cat: "Basics", title: "Running lights", goal: "Five LEDs light one after another.", parts: [8, 9, 10, 11, 12].map((p, i) => ({ t: "led", color: ["red", "orange", "yellow", "green", "blue"][i], pin: p })), code: snip("Many LEDs with an array") },
  { key: "dimmer", cat: "Basics", title: "Knob dimmer", goal: "Turn the knob to change the LED's brightness.", parts: [{ t: "pot", pin: "A0" }, { t: "led", color: "yellow", pin: 9 }], code: `// Knob dimmer\nconst int KNOB = A0, LED = 9;   // ~ pin for PWM\n\nvoid setup() {\n  Serial.begin(9600);\n}\n\nvoid loop() {\n  int k = analogRead(KNOB);\n  analogWrite(LED, map(k, 0, 1023, 0, 255));\n  Serial.println(k);\n  delay(50);\n}\n` },
  { key: "melody", cat: "Sound", title: "Melody", goal: "Play a tune on a buzzer.", parts: [{ t: "buzzer", pin: 8 }], code: snip("Melody") },
  { key: "servo", cat: "Motion", title: "Servo follows a knob", goal: "The servo copies the knob.", parts: [{ t: "pot", pin: "A0" }, { t: "servo", pins: { PWM: 9 } }], code: snip("Servo follows a knob") },
  { key: "ultrasonic", cat: "Sensors", title: "Ultrasonic distance", goal: "Measure distance and print it.", parts: [{ t: "hcsr04", pins: { TRIG: 9, ECHO: 10 } }], code: null },
  { key: "lcd", cat: "Displays", title: "DHT22 on an LCD", goal: "Temperature and humidity on a 16×2 LCD.", parts: [{ t: "dht22", pins: { SDA: 7 } }, { t: "lcd" }], code: `// DHT22 + I2C LCD\n#include <DHT.h>\n#include <LiquidCrystal_I2C.h>\nDHT dht(7, DHT22);\nLiquidCrystal_I2C lcd(0x27, 16, 2);\n\nvoid setup() {\n  dht.begin();\n  lcd.init();\n  lcd.backlight();\n}\n\nvoid loop() {\n  lcd.setCursor(0, 0); lcd.print("Temp: "); lcd.print(dht.readTemperature(), 1); lcd.print((char)223); lcd.print("C ");\n  lcd.setCursor(0, 1); lcd.print("Hum:  "); lcd.print(dht.readHumidity(), 1); lcd.print(" %  ");\n  delay(2000);\n}\n` },
  { key: "oled", cat: "Displays", title: "OLED hello", goal: "Text and a progress bar on the OLED.", parts: [{ t: "oled" }], code: null },
  { key: "car", cat: "Motion", title: "Obstacle-avoiding car", goal: "Drive forward, turn when something is close.", parts: [{ t: "hcsr04", pins: { TRIG: 12, ECHO: 13 } }, { t: "l298n", pins: { ENA: 5, IN1: 7, IN2: 8, ENB: 6, IN3: 9, IN4: 11 }, with: { motors: 2, supply: "4xAA" } }], code: snip("Obstacle-avoiding car") },
  { key: "keypad", cat: "Input", title: "Keypad", goal: "Read keys from a 4×4 keypad.", parts: [{ t: "keypad", pins: { R1: 9, R2: 8, R3: 7, R4: 6, C1: 5, C2: 4, C3: 3, C4: 2 } }], code: null },
  { key: "espweb", cat: "ESP32", board: "esp32", title: "ESP32 web lamp", goal: "Switch an LED from a phone web page.", parts: [{ t: "led", color: "blue", pin: 2 }], code: snip("Web page that switches an LED") },
  { key: "espmqtt", cat: "ESP32", board: "esp32", title: "ESP32 MQTT", goal: "Publish a sensor and obey MQTT commands.", parts: [{ t: "led", color: "green", pin: 2 }, { t: "pot", pin: 34 }], code: snip("MQTT publish and subscribe") },
];
