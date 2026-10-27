/* Young Innovators (ages 12-14) circuits. Pins follow the lesson slides where the slides have code. */
const OLED_INC = `#include <Wire.h>
#include <Adafruit_GFX.h>
#include <Adafruit_SSD1306.h>
Adafruit_SSD1306 oled(128, 64, &Wire, -1);`;
const CAR = { t: "l298n", pins: { ENA: 5, IN1: 7, IN2: 8, ENB: 6, IN3: 9, IN4: 11 }, with: { motors: 2, supply: "4xAA" } };
const DRIVE = `void drive(int left, int right) {           // -255 .. 255
  digitalWrite(IN1, left > 0);  digitalWrite(IN2, left < 0);  analogWrite(ENA, constrain(abs(left), 0, 255));
  digitalWrite(IN3, right > 0); digitalWrite(IN4, right < 0); analogWrite(ENB, constrain(abs(right), 0, 255));
}`;
const SONAR = `long readCm() {
  digitalWrite(TRIG, LOW);  delayMicroseconds(2);
  digitalWrite(TRIG, HIGH); delayMicroseconds(10);
  digitalWrite(TRIG, LOW);
  long us = pulseIn(ECHO, HIGH, 25000);
  return us == 0 ? 400 : us / 58;          // no echo = far away
}`;
export default {
  "YI-33": {
    title: "Introduction to Actuators", goal: "An ultrasonic sensor measures distance and the servo turns to match it, with green, yellow and red LEDs showing which third of the sweep the arm is in.",
    parts: [{ t: "hcsr04", pins: { TRIG: 9, ECHO: 10 } }, { t: "servo", pins: { PWM: 6 } },
      { t: "led", color: "green", pin: 2 }, { t: "led", color: "yellow", pin: 3 }, { t: "led", color: "red", pin: 4 }],
    try: ["Start the simulation, then drag the ball in front of the sensor and watch the servo follow it.", "Find the distance where the yellow LED hands over to red. Does it match the table on the slides?", "Swap FAR_CM and NEAR_CM in the map() line so the servo turns the other way.", "Only move the servo when the new angle differs from the old one by more than 3 degrees, so it stops twitching."],
    code: `// Distance-controlled servo with a 3-LED angle indicator
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
` },
  "YI-02": {
    title: "Heart Rate Monitoring System", goal: "A pulse sensor gives a wave; each peak is a heartbeat. The OLED draws the wave and shows beats per minute.",
    parts: [{ t: "pulse", pins: { S: "A0" } }, { t: "oled" }, { t: "led", color: "red", pin: 13 }, { t: "buzzer", pin: 8 }],
    try: ["Start and watch the heartbeat wave and BPM.", "Click the pulse sensor and change the heart rate to 120.", "Make the buzzer beep on each beat, like a hospital monitor."],
    code: `// Heart rate monitor
${OLED_INC}
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
`,
  },
  "YI-04": {
    title: "Stepper Motor Drawing Plotter", goal: "Two 28BYJ-48 steppers drive the wheels and a servo lifts the pen: the robot draws a square.",
    parts: [{ t: "stepper28", label: "Left wheel", pins: { IN1: 2, IN2: 3, IN3: 4, IN4: 5 } }, { t: "stepper28", label: "Right wheel", pins: { IN1: 6, IN2: 7, IN3: 8, IN4: 9 } }, { t: "servo", label: "Pen", pins: { PWM: 10 } }, { t: "led", color: "green", pin: 13 }],
    try: ["Start: both steppers turn, then the robot turns 90 degrees.", "Change 80 to 40 for a smaller square.", "Draw a triangle: 3 sides and turn(120)."],
    code: `// Drawing plotter
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
`,
  },
  "YI-05": {
    title: "Obstacle Avoiding Robot with Scanning Sonar", goal: "The car drives until something is close, then the servo 'neck' looks left and right and the car turns to the clearer side.",
    parts: [{ t: "hcsr04", pins: { TRIG: 12, ECHO: 10 } }, { t: "servo", label: "Neck", pins: { PWM: 3 } }, CAR, { t: "buzzer", pin: 4 }],
    try: ["Distance 60 cm: both wheels forward.", "Drop the distance below 25 cm: the robot backs up and the neck looks around.", "Change SAFE to 35 cm."],
    code: `// Obstacle-avoiding robot with a scanning neck
#include <Servo.h>
const int ENA = 5, IN1 = 7, IN2 = 8, ENB = 6, IN3 = 9, IN4 = 11;
const int TRIG = 12, ECHO = 10, BUZZER = 4;
Servo neck;
const int SAFE = 25;       // cm: tune this!
int SPEED = 180;           // 0 to 255

${SONAR}
${DRIVE}

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
`,
  },
  "YI-06": {
    title: "Bluetooth Robot Car with Phone App", goal: "Drive the car from a phone: F, B, L, R, S letters arrive over Bluetooth and control the motors.",
    parts: [{ t: "hc05", pins: { TXD: 2, RXD: 3 } }, { t: "l298n", pins: { ENA: 5, IN1: 7, IN2: 8, ENB: 6, IN3: 9, IN4: 10 }, with: { motors: 2, supply: "4xAA" } }, { t: "buzzer", pin: 11 }],
    try: ["Start, open the Phone tab and tap F, then L, R, B and S.", "Send H for the horn.", "Add a safety stop: if no command arrives for 2 seconds, stop."],
    code: `// Bluetooth car
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
`,
  },
  "YI-07": {
    title: "Gesture-Controlled Robot Arm", goal: "Tilt the MPU6050 and the arm follows: roll turns the base, pitch moves the shoulder, the button opens the gripper.",
    parts: [{ t: "mpu6050" }, { t: "servo", label: "Base", pins: { PWM: 9 } }, { t: "servo", label: "Shoulder", pins: { PWM: 10 } }, { t: "servo", label: "Gripper", pins: { PWM: 11 } }, { t: "button", pin: 2 }],
    try: ["Click the MPU6050 and drag Tilt Y: the base servo turns.", "Drag Tilt X: the shoulder moves.", "Press the button: the gripper opens and closes."],
    code: `// Gesture-controlled robot arm (reads the MPU6050 registers directly)
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
`,
  },
  "YI-08": {
    title: "RFID Smart Door Lock with Access Log", goal: "Tap an RFID card: allowed cards unlock the door (servo) with a green light; unknown cards get a red light and a buzz.",
    parts: [{ t: "rfid", pins: { SDA: 10, RST: 9 } }, { t: "servo", label: "Door bolt", pins: { PWM: 3 } }, { t: "led", color: "green", pin: 4 }, { t: "led", color: "red", pin: 5 }, { t: "buzzer", pin: 8 }, { t: "oled" }],
    try: ["Start, click the RFID reader and tap the Blue tag: welcome Ayesha.", "Tap the Unknown card: refused.", "Add a third person with the White card... it is already Bilal. Remove him!"],
    code: `// RFID door lock with an access log
#include <SPI.h>
#include <MFRC522.h>
#include <Servo.h>
${OLED_INC}
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
`,
  },
  "YI-09": {
    title: "Rechargeable Power Pack for Robots", goal: "A voltage sensor reads the 18650 cell; the OLED shows volts and a battery bar, and it beeps when the battery is low.",
    parts: [{ t: "voltsensor", pins: { S: "A0" }, with: { source: "battery", kind: "18650" } }, { t: "oled" }, { t: "led", color: "red", pin: 13 }, { t: "buzzer", pin: 8 }],
    try: ["Start: the screen shows about 3.7 V.", "Change the battery Type to 4xAA (6 V) and restart.", "Change the low-battery warning to 3.5 V."],
    note: "The lesson uses a 10k + 10k divider (×2). Circuit Lab uses a ready-made voltage sensor module (×5), so the code multiplies by 5.",
    code: `// Power pack monitor
${OLED_INC}
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
`,
  },
  "YI-10": {
    title: "Wireless Doorbell with Visitor Counter", goal: "Press the bell: ding-dong, and the OLED counts visitors.",
    parts: [{ t: "button", pin: 2 }, { t: "buzzer", pin: 8 }, { t: "led", color: "yellow", pin: 13 }, { t: "oled" }],
    try: ["Press the button to ring.", "Show the time of the last visit (seconds since start).", "Make a different tune after 10 visitors."],
    note: "The NRF24L01 radio link between two boards can't be simulated. This circuit is the receiver side: the button stands in for a message arriving.",
    code: `// Doorbell with a visitor counter (receiver side)
${OLED_INC}
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
`,
  },
  "YI-11": {
    board: "esp32", title: "Wi-Fi Automatic Plant Watering System", goal: "The ESP32 waters the plant when the soil is dry and shows soil, temperature and humidity on a phone web page.",
    parts: [{ t: "soil", pins: { AO: 34 } }, { t: "dht22", pins: { SDA: 4 } }, { t: "relay", pins: { IN: 26 }, with: { load: "pump", supply: "4xAA" } }],
    try: ["Make the soil dry (moisture 10%): the pump runs for 3 seconds.", "Open the Phone tab to see the plant page.", "Add a Water now button to the page."],
    code: `// Wi-Fi plant watering
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
`,
  },
  "YI-18": {
    title: "Processing + Arduino: Live Sensor Radar", goal: "A servo sweeps the ultrasonic sensor from 15° to 165° and sends angle,distance pairs for a radar screen.",
    parts: [{ t: "hcsr04", pins: { TRIG: 10, ECHO: 11 } }, { t: "servo", pins: { PWM: 12 } }, { t: "led", color: "red", pin: 13 }, { t: "buzzer", pin: 8 }],
    try: ["Start and watch the Serial tab: angle,distance.", "Set the distance to 15 cm: the LED and buzzer warn of a close object.", "Send the data to the Processing radar sketch on a real board."],
    code: `// Radar: servo sweep + ultrasonic
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
`,
  },
  "YI-21": {
    title: "Python Data Lab: Is Our Classroom Too Hot?", goal: "The Arduino logs temperature and humidity as CSV lines that Python can read and graph.",
    parts: [{ t: "dht22", pins: { SDA: 7 } }, { t: "led", color: "red", pin: 13 }, { t: "buzzer", pin: 8 }],
    try: ["Open Serial and Graph: change the DHT22 temperature and watch the line.", "Copy the CSV lines into a file for Python (pandas).", "Light the LED above 30 °C (too hot to learn!)."],
    code: `// Classroom climate logger (CSV)
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
`,
  },
  "YI-22": {
    title: "Smart Posture Corrector Wearable", goal: "The MPU6050 measures how far you lean. Slouch for 5 seconds and the vibration motor buzzes; the button re-calibrates 'straight'.",
    parts: [{ t: "mpu6050" }, { t: "vibe", pins: { IN: 5 } }, { t: "button", pin: 2 }, { t: "oled" }, { t: "led", color: "yellow", pin: 13 }],
    try: ["Start, then click the MPU6050 and change Tilt Y to lean forward.", "Hold the lean for 5 s: the motor buzzes.", "Press the button to save your new 'straight'."],
    code: `// Posture corrector
#include <Wire.h>
#include <MPU6050.h>
${OLED_INC}
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
`,
  },
  "YI-23": {
    title: "Li-Fi Messenger: Sending Text with Light", goal: "Letters are sent as light flashes (8 bits each). The light sensor reads the flashes back and rebuilds the letter.",
    parts: [{ t: "led", color: "white", pin: 8 }, { t: "ldr", pins: { AO: "A0" }, sim: { link: "led1" } }, { t: "buzzer", pin: 7 }],
    try: ["Type a word in the Serial box and press Send: watch the LED flash and the letters come back.", "Make T smaller (faster) and test if it still works.", "On two real boards, run the sender and the receiver separately."],
    note: "Here one board sends and receives at the same time (a loopback test): the light sensor is pointed at the LED.",
    code: `// Li-Fi loopback: send with light, read it back
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
`,
  },
  "YI-25": {
    title: "Robot Sumo Challenge", goal: "A state machine: SEARCH (spin), ATTACK (charge when the sonar sees the opponent) and ESCAPE (back off at the white ring edge).",
    parts: [{ t: "irline", label: "Edge left", pins: { OUT: 2 } }, { t: "irline", label: "Edge right", pins: { OUT: 3 } }, { t: "hcsr04", pins: { TRIG: 12, ECHO: 10 } }, CAR],
    try: ["No opponent: the robot spins (SEARCH).", "Set the distance to 30 cm: full speed ATTACK.", "Turn off 'Over the black line' on an edge sensor (white edge): ESCAPE."],
    code: `// Robot sumo
const int IRL = 2, IRR = 3, TRIG = 12, ECHO = 10;
const int ENA = 5, IN1 = 7, IN2 = 8, ENB = 6, IN3 = 9, IN4 = 11;
enum State { SEARCH, ATTACK, ESCAPE };
State state = SEARCH;

${DRIVE}
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
`,
  },
  "YI-26": {
    board: null, title: "Walking Linkage Robot", goal: "One motor turns a crank; the linkage turns that spin into walking legs. Here: battery, switch and motor.",
    parts: [{ t: "battery", attrs: { kind: "4xAA" }, rails: { "+": "switch", "-": "bn" } }, { t: "slideswitch", feed: true }, { t: "dcmotor", label: "Crank motor", rails: { M1: "bp", M2: "bn" } }],
    try: ["Start and flip the switch.", "Change to 2xAA: the crank turns slower.", "Count: 4xAA gives about 6 V."],
  },
  "YI-27": {
    title: "Energy Detective: How Much Power Do Gadgets Use?", goal: "An INA219 measures volts and milliamps; the board works out power and energy and shows them on the OLED.",
    parts: [{ t: "ina219" }, { t: "oled" }, { t: "led", color: "green", pin: 13 }, { t: "buzzer", pin: 8 }],
    try: ["Click the INA219 and choose a different gadget.", "Which gadget uses the most power? Rank them.", "Beep when power goes above 1 W."],
    code: `// Energy detective
#include <Adafruit_INA219.h>
${OLED_INC}
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
`,
  },
  "YI-28": {
    title: "Python Control Panel for Arduino", goal: "The Arduino obeys short text commands (L1, L0, S90, R) so a Python app can control it.",
    parts: [{ t: "led", color: "green", pin: 13 }, { t: "servo", pins: { PWM: 9 } }, { t: "ldr", pins: { AO: "A0" } }, { t: "buzzer", pin: 8 }],
    try: ["In the Serial box send L1, then L0.", "Send S45 and S135: the servo moves.", "Send R to read the light sensor. Add B for a beep."],
    code: `// Command panel: Python (or you) sends text commands
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
    String cmd = Serial.readStringUntil('\\n');
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
`,
  },
  "YI-32": {
    title: "Build Your Own Game Controller", goal: "A joystick and two buttons send x,y,A,B 50 times a second for a computer game.",
    parts: [{ t: "joystick", pins: { HORZ: "A0", VERT: "A1" } }, { t: "button", pin: 2, color: "red" }, { t: "button", pin: 3, color: "blue" }, { t: "led", color: "green", pin: 13 }],
    try: ["Open Serial and Graph, then drag the joystick.", "Press A and B: the third and fourth numbers become 1.", "Light the LED while A is pressed."],
    code: `// Game controller
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
`,
  },
};
