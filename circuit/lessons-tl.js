/* Tech Leaders (ages 15-17) circuits. Pins follow the lesson slides. ESP32 lessons run in teaching mode. */
const OLED_INC = `#include <Wire.h>
#include <Adafruit_GFX.h>
#include <Adafruit_SSD1306.h>
Adafruit_SSD1306 oled(128, 64, &Wire, -1);`;
const DRIVE = `void drive(int left, int right) {           // -255 .. 255
  digitalWrite(IN1, left >= 0);  digitalWrite(IN2, left < 0);
  analogWrite(ENA, constrain(abs(left), 0, 255));
  digitalWrite(IN3, right >= 0); digitalWrite(IN4, right < 0);
  analogWrite(ENB, constrain(abs(right), 0, 255));
}`;
const WIFI = `  WiFi.begin("SchoolLab", "password");
  while (WiFi.status() != WL_CONNECTED) delay(300);`;
export default {
  "TL-01": {
    board: "esp32", title: "Solar-Powered Off-Grid Weather Node", goal: "Every 10 s the node reads temperature, humidity and its battery voltage and posts them to the cloud (ThingSpeak).",
    parts: [{ t: "dht22", pins: { SDA: 4 } }, { t: "voltsensor", pins: { S: 34 }, with: { source: "battery", kind: "18650" } }],
    try: ["Start, then watch Serial and the Network log in the Phone tab.", "Change the DHT22 temperature: the next upload shows it.", "Real nodes deep-sleep for 10 minutes between readings to save the battery."],
    note: "The lesson's 10k + 10k divider (×2) is shown here as a voltage sensor module (×5). Deep sleep would stop the simulation, so this version loops with a delay.",
    code: `// Off-grid weather node
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
  Serial.printf("Upload %d: %.1f C  %.0f %%  %.2f V  -> HTTP %d\\n", bootCount, t, h, vbat, code);
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
`,
  },
  "TL-02": {
    title: "Autonomous Maze Solving Robot", goal: "Three ultrasonic sensors (left, front, right) and a PID wall-follower: keep 12 cm from the left wall, turn at openings, U-turn at dead ends.",
    parts: [{ t: "hcsr04", label: "Left", pins: { TRIG: "A0", ECHO: "A1" } }, { t: "hcsr04", label: "Front", pins: { TRIG: "A2", ECHO: "A3" } }, { t: "hcsr04", label: "Right", pins: { TRIG: 10, ECHO: 11 } }, { t: "l298n", pins: { ENA: 5, IN1: 4, IN2: 7, ENB: 6, IN3: 8, IN4: 12 }, with: { motors: 2, supply: "4xAA" } }],
    try: ["Set Left = 12, Front = 60: the robot drives straight.", "Set Left = 6 (too close): watch the wheels steer away (Serial shows the error).", "Set Front = 8 and Right = 50: it turns right."],
    code: `// Maze solver: left-wall follower with PID
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
${DRIVE}
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
`,
  },
  "TL-03": {
    title: "Pick-and-Place Robotic Arm with Record & Replay", goal: "Four knobs move four servos. REC saves the pose in EEPROM; PLAY repeats every saved pose in order.",
    parts: [{ t: "pot", pin: "A0" }, { t: "pot", pin: "A1" }, { t: "pot", pin: "A2" }, { t: "pot", pin: "A3" }, { t: "button", pin: 2, color: "red" }, { t: "button", pin: 4, color: "green" },
      { t: "servo", label: "Base", pins: { PWM: 3 } }, { t: "servo", label: "Shoulder", pins: { PWM: 5 } }, { t: "servo", label: "Elbow", pins: { PWM: 6 } }, { t: "servo", label: "Gripper", pins: { PWM: 9 } }],
    try: ["Turn the knobs: each servo follows its knob.", "Press REC (red) for 3 different poses, then press PLAY (green).", "Hold both buttons for 2 s to erase."],
    code: `// Robot arm: record and replay
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
`,
  },
  "TL-04": {
    board: "esp32", title: "Fall Detection Wearable for the Elderly", goal: "A state machine watches the MPU6050: a hard impact, then lying still = fall. A 10-second countdown lets the wearer cancel before the alert is sent.",
    parts: [{ t: "mpu6050" }, { t: "buzzer", pin: 25 }, { t: "button", pin: 26 }, { t: "led", color: "red", pin: 2 }],
    try: ["Click the MPU6050: set Accel Z to 20 (impact), then Tilt Y to 9.8 and Z to 0 (lying down).", "Wait: the countdown beeps. Press the button to cancel.", "Let it finish: the alert appears in the Network log."],
    code: `// Fall detection wearable
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
  Serial.printf("Alert sent, HTTP %d\\n", code);
  http.end();
}
void countdown() {
  for (int s = 10; s > 0; s--) {
    Serial.printf("Fall! Alert in %d s (press to cancel)\\n", s);
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
`,
  },
  "TL-05": {
    board: "esp32", title: "ESP-NOW Wireless Sensor Network", goal: "A sensor node reads temperature, light and sound and broadcasts them with ESP-NOW every 2 s. Its OLED shows what it sends.",
    parts: [{ t: "dht22", pins: { SDA: 4 } }, { t: "ldr", pins: { AO: 34 } }, { t: "sound", pins: { AO: 35 } }, { t: "oled" }],
    try: ["Start and open the Phone tab: every packet appears in the Network log.", "Change NODE_ID to 2 or 3 to send light or sound instead.", "Send a packet back from the Phone tab: the node shows it."],
    note: "One board is simulated, so the base station is the Network panel. With two real ESP32s, flash the base code on the second board.",
    code: `// ESP-NOW sensor node
#include <esp_now.h>
#include <WiFi.h>
#include <DHT.h>
${OLED_INC}
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
  Serial.printf("sent #%lu  node %d  value %.1f\\n", (unsigned long)m.seq, m.id, m.value);

  oled.clearDisplay();
  oled.setTextSize(1); oled.setCursor(0, 0); oled.print("NODE "); oled.print(NODE_ID); oled.print("  ESP-NOW");
  oled.setTextSize(2); oled.setCursor(0, 18); oled.print(m.value, 1);
  oled.setTextSize(1); oled.setCursor(0, 40); oled.print("packet #"); oled.print(m.seq);
  oled.setCursor(0, 54); oled.print("in: "); oled.print(lastIn);
  oled.display();
  delay(2000);
}
`,
  },
  "TL-06": {
    board: "esp32", title: "Smart Home Cloud Control Hub", goal: "An ESP32 hub on MQTT: it publishes temperature and motion and obeys commands for 4 relays (fan and light). Rules run at the edge.",
    parts: [{ t: "relay", attrs: { channels: "4" }, sim: { trigger: "LOW" }, pins: { IN1: 16, IN2: 17, IN3: 18, IN4: 19 }, with: { loads: ["fan", "lamp"], supply: "4xAA" } }, { t: "pir", pins: { OUT: 27 } }, { t: "dht22", pins: { SDA: 4 } }],
    try: ["Raise the DHT22 above 30 °C: the fan (relay 1) turns on.", "Wave at the PIR: the light (relay 2) follows motion.", "In the Phone tab publish topic pakturk/team7/cmd/relay/1 with message 1."],
    code: `// Smart home hub (MQTT)
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
`,
  },
  "TL-07": {
    board: "esp32", title: "Smart Parking Occupancy Dashboard", goal: "Three bays, each with an ultrasonic sensor and red/green lights. A JSON API and a live web dashboard show which bays are free.",
    parts: [{ t: "hcsr04", label: "Bay 1", pins: { TRIG: 5, ECHO: 18 } }, { t: "hcsr04", label: "Bay 2", pins: { TRIG: 19, ECHO: 21 } }, { t: "hcsr04", label: "Bay 3", pins: { TRIG: 22, ECHO: 23 } },
      { t: "led", color: "red", pin: 25 }, { t: "led", color: "green", pin: 26 }, { t: "led", color: "red", pin: 32 }, { t: "led", color: "green", pin: 33 }, { t: "led", color: "red", pin: 16 }, { t: "led", color: "green", pin: 17 }],
    try: ["Set Bay 2 to 5 cm (a car): its light turns red after 3 readings.", "Open the Phone tab: the dashboard updates every 2 s.", "Open /status to see the raw JSON."],
    code: `// Smart parking dashboard
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
  String j = "{\\"bays\\":[";
  for (int i = 0; i < 3; i++) {
    if (!occ[i]) freeBays++;
    j += "{\\"id\\":" + String(i + 1) + ",\\"occupied\\":" + (occ[i] ? "true" : "false") + "}";
    if (i < 2) j += ",";
  }
  j += "],\\"free\\":" + String(freeBays) + "}";
  server.send(200, "application/json", j);
}

void setup() {
  for (int i = 0; i < 3; i++) { pinMode(TRIG[i], OUTPUT); pinMode(ECHO[i], INPUT); pinMode(RED_[i], OUTPUT); pinMode(GRN_[i], OUTPUT); }
  Serial.begin(115200);
${WIFI}
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
`,
  },
  "TL-08": {
    board: "esp32", title: "Two-Factor Smart Locker with Intrusion Alerts", goal: "Factor 1: the right RFID card. Factor 2: the PIN on the keypad. Three wrong PINs lock it out; motion while locked triggers an alert.",
    parts: [{ t: "rfid", pins: { SDA: 5, RST: 17 } }, { t: "keypad", pins: { R1: 13, R2: 14, R3: 27, R4: 26, C1: 25, C2: 33, C3: 32, C4: 15 } }, { t: "servo", label: "Lock", pins: { PWM: 4 } }, { t: "pir", pins: { OUT: 34 } }, { t: "buzzer", pin: 16 }, { t: "oled" }],
    try: ["Tap the Blue tag, then type 4 8 2 6 #: the lock opens.", "Tap the White card: refused.", "Type the wrong PIN 3 times: locked out for 60 s."],
    code: `// Two-factor locker: RFID + PIN
#include <SPI.h>
#include <MFRC522.h>
#include <Keypad.h>
#include <ESP32Servo.h>
#include <WiFi.h>
#include <HTTPClient.h>
${OLED_INC}
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
`,
  },
  "TL-09": {
    board: "esp32", title: "Sensor Data Logging & Analysis Pipeline", goal: "Every 2 s the ESP32 prints one CSV line: time, temperature, humidity, light and sound. Save it and analyse it in Python.",
    parts: [{ t: "dht22", pins: { SDA: 4 } }, { t: "ldr", pins: { AO: 34 } }, { t: "sound", pins: { AO: 35 } }],
    try: ["Open Serial: each line is one CSV row.", "Change the sensors while it runs and watch the numbers.", "Turn on Graph to see temperature and light together."],
    code: `// CSV data logger
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
  Serial.printf("%lu,%.1f,%.1f,%d,%d\\n", millis(), t, h, light, hi - lo);
  delay(2000);                         // DHT22 needs >= 2 s
}
`,
  },
  "TL-10": {
    board: "esp32", title: "Machine Learning Rain Predictor", goal: "Collect temperature, humidity and a 'is it raining' label as CSV for training. A first hand-written rule guesses rain.",
    parts: [{ t: "dht22", pins: { SDA: 4 } }, { t: "rain", pins: { DO: 27 } }, { t: "led", color: "blue", pin: 2 }],
    try: ["Open Serial: temp, humidity, wet, prediction.", "Raise humidity above 85 %: the rule predicts rain (blue LED).", "Add rain on the sensor: the label 'wet' becomes 1. Is the rule right?"],
    code: `// Rain data collector + a simple rule
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
  if (!isnan(t) && !isnan(h)) Serial.printf("%.1f,%.1f,%d,%d\\n", t, h, wet, predicted);
  delay(3000);
}
`,
  },
  "TL-12": {
    board: "esp32", title: "Web-Controlled Devices via REST API", goal: "A REST API on the ESP32: GET /api/status returns JSON; POST /api/lamp switches the lamp. A phone page uses the API.",
    parts: [{ t: "relay", pins: { IN: 23 }, with: { load: "lamp", supply: "4xAA" } }, { t: "led", color: "blue", pin: 18 }, { t: "dht22", pins: { SDA: 4 } }],
    try: ["Start, open the Phone tab and tap the buttons.", "Open /api/status in the address bar to see the JSON.", "Add POST /api/led to switch the blue LED."],
    code: `// REST API on an ESP32
#include <WiFi.h>
#include <WebServer.h>
#include <DHT.h>
WebServer server(80);
DHT dht(4, DHT22);
const int RELAY = 23, LED = 18;
bool lamp = false;

void sendStatus() {
  String j = "{\\"lamp\\":" + String(lamp ? "true" : "false") + ",\\"temp\\":" + String(dht.readTemperature(), 1) + ",\\"uptime\\":" + String(millis() / 1000) + "}";
  server.send(200, "application/json", j);
}
void setLamp() {                         // POST /api/lamp  body: on=1
  if (!server.hasArg("on")) { server.send(400, "application/json", "{\\"error\\":\\"missing on\\"}"); return; }
  lamp = server.arg("on") == "1";
  digitalWrite(RELAY, lamp); digitalWrite(LED, lamp);
  sendStatus();
}
void notFound() { server.send(404, "application/json", "{\\"error\\":\\"not found\\"}"); }
void page() {
  server.send(200, "text/html",
    "<html><head><meta name=viewport content='width=device-width'><style>body{font-family:sans-serif;text-align:center;padding:10px}"
    "button{font-size:18px;margin:6px;padding:12px 20px;border:0;border-radius:12px;background:#2E6BE6;color:#fff}</style></head><body>"
    "<h2>Smart Lamp API</h2><p id=s>...</p><button onclick=\\"set(1)\\">ON</button><button onclick=\\"set(0)\\">OFF</button>"
    "<script>function show(d){s.textContent='Lamp '+(d.lamp?'ON':'OFF')+' | '+d.temp+' C | up '+d.uptime+' s'}"
    "function set(v){fetch('/api/lamp',{method:'POST',body:'on='+v}).then(r=>r.json()).then(show)}"
    "fetch('/api/status').then(r=>r.json()).then(show)</script></body></html>");
}

void setup() {
  Serial.begin(115200);  dht.begin();
  pinMode(RELAY, OUTPUT);  pinMode(LED, OUTPUT);
${WIFI}
  Serial.println(WiFi.localIP());          // write this down!
  server.on("/", page);
  server.on("/api/status", HTTP_GET,  sendStatus);
  server.on("/api/lamp",   HTTP_POST, setLamp);
  server.onNotFound(notFound);
  server.begin();
}
void loop() { server.handleClient(); }
`,
  },
  "TL-14": {
    title: "Autonomous Fire-Fighting Robot", goal: "Three flame sensors find the fire, the robot drives to it, then the fan (through a relay) blows it out while the servo sweeps.",
    parts: [{ t: "flame", label: "Left", pins: { AO: "A0" } }, { t: "flame", label: "Centre", pins: { AO: "A1" } }, { t: "flame", label: "Right", pins: { AO: "A2" } }, { t: "servo", pins: { PWM: 3 } },
      { t: "relay", pins: { IN: 4 }, with: { load: "fan", supply: "4xAA" } }, { t: "buzzer", pin: 11 }, { t: "l298n", pins: { ENA: 5, IN1: 7, IN2: 8, ENB: 6, IN3: 9, IN4: 10 }, with: { motors: 2, supply: "4xAA" } }],
    try: ["No flame: the robot spins slowly (SEARCH).", "Give the Left sensor 60 %: it curves left (APPROACH).", "Give the Centre sensor 95 %: it stops and the fan blows (EXTINGUISH)."],
    code: `// Fire-fighting robot
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
`,
  },
  "TL-16": {
    title: "Motion-Controlled Game", goal: "The controller streams x, y, button A and the stick click to a computer game; the game sends back H (hit), P (point) and O (over).",
    parts: [{ t: "joystick", pins: { HORZ: "A0", VERT: "A1", SEL: 2 } }, { t: "button", pin: 3, color: "red" }, { t: "button", pin: 4, color: "blue" }, { t: "led", color: "red", pin: 12 }, { t: "buzzer", pin: 11 }],
    try: ["Open Serial and Graph and move the joystick.", "Send H from the Serial box: LED on and a low buzz.", "Send P: a short high beep for a point."],
    code: `// Game controller with feedback
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
`,
  },
  "TL-19": {
    board: "esp32", title: "TinyML Gesture Recogniser on ESP32", goal: "Stream accelerometer data at 100 Hz for Edge Impulse; until your model is trained, a simple rule spots a 'shake' gesture.",
    parts: [{ t: "mpu6050" }, { t: "led", color: "green", pin: 2 }],
    try: ["Open Serial: ax,ay,az lines at 100 per second.", "Click the MPU6050 and swing Tilt X quickly between -15 and 15: 'shake!' and the LED.", "Replace the rule with your Edge Impulse model on a real ESP32."],
    note: "The trained Edge Impulse library is too big for teaching mode, so this circuit collects data and uses a simple rule.",
    code: `// Gesture data streamer + simple shake rule
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
`,
  },
  "TL-23": {
    board: "esp32", title: "Smart Microgrid Model", goal: "Two INA219 sensors measure solar input and the battery side. When the battery voltage drops, less important loads are paused (homes first, hospital last).",
    parts: [{ t: "ina219", label: "Solar side", attrs: { addr: "0x40" }, sim: { volts: 6.2, load: "Fan (150 mA)" } }, { t: "ina219", label: "Battery side", attrs: { addr: "0x41" }, sim: { volts: 3.8, load: "Servo moving (250 mA)" } },
      { t: "relay", attrs: { channels: "4" }, pins: { IN1: 25, IN2: 26, IN3: 27 }, with: { loads: ["lamp", "lamp", "lamp"], supply: "4xAA" } }],
    try: ["Start and open the Phone tab: the microgrid page.", "Click 'Battery side' and lower the supply voltage to 3.6 V: Homes pause.", "Lower it to 3.2 V: only the Hospital stays on."],
    code: `// Smart microgrid
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
${WIFI}
  Serial.println(WiFi.localIP());
  server.on("/", page); server.begin();
}

void loop() {
  readGrid(); manage(); server.handleClient();
  static unsigned long t = 0;
  if (millis() - t > 1000) { t = millis(); Serial.printf("%.2f W in, %.2f W out, %.2f V\\n", sW, lW, bV); }
}
`,
  },
  "TL-25": {
    title: "Robotic Arm Inverse Kinematics", goal: "Python works out the joint angles; the Arduino receives 'shoulder,elbow' and moves smoothly 1° at a time within safe limits.",
    parts: [{ t: "servo", label: "Shoulder", pins: { PWM: 9 } }, { t: "servo", label: "Elbow", pins: { PWM: 10 } }, { t: "led", color: "green", pin: 13 }],
    try: ["In the Serial box send 45,120 and watch both servos glide.", "Send 200,0: the limits keep it at 170,10.", "Make it slower: change delay(8) to delay(20)."],
    code: `// Two-joint arm: receives angles from Python
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
    int a = Serial.parseInt(), b = Serial.parseInt();   // "a,b\\n"
    if (Serial.read() == '\\n') {
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
`,
  },
  "TL-26": {
    board: "esp32", title: "Robot Swarm: Leader and Follower Cars", goal: "The leader car reads its joystick, drives itself and broadcasts speed and turn 20 times a second with ESP-NOW for the followers.",
    parts: [{ t: "joystick", pins: { HORZ: 34, VERT: 35 } }, { t: "button", pin: 15, color: "red" }, { t: "l298n", pins: { ENA: 14, IN1: 27, IN2: 26, ENB: 25, IN3: 33, IN4: 32 }, with: { motors: 2, supply: "4xAA" } }],
    try: ["Push the joystick up: both wheels drive and packets go out (Phone tab log).", "Press the red E-STOP: speed 0 is broadcast.", "With real cars, flash the follower code on the other ESP32s."],
    code: `// Swarm leader: drive + broadcast
#include <esp_now.h>
#include <WiFi.h>
typedef struct { uint32_t seq; int16_t speed; int16_t turn; bool estop; } Cmd;
Cmd cmd = {0, 0, 0, false};
uint8_t BCAST[] = {0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF};
const int ENA = 14, IN1 = 27, IN2 = 26, ENB = 25, IN3 = 33, IN4 = 32;

${DRIVE}
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
`,
  },
  "TL-27": {
    board: null, title: "3D-Printed Gearbox and Gear Ratios", goal: "The motor drives your printed gearbox. More teeth on the output gear = slower but stronger.",
    parts: [{ t: "battery", attrs: { kind: "4xAA" }, rails: { "+": "switch", "-": "bn" } }, { t: "slideswitch", feed: true }, { t: "dcmotor", label: "Gearbox motor", rails: { M1: "bp", M2: "bn" } }],
    try: ["Start and flip the switch: the motor shows its rpm.", "With a 3:1 gearbox the output turns at one third of that speed.", "Change to 2xAA and compare the rpm."],
  },
  "TL-28": {
    title: "Smart Cane for the Visually Impaired", goal: "The closer an obstacle, the faster the cane vibrates and beeps, so the user can feel the distance.",
    parts: [{ t: "hcsr04", pins: { TRIG: 9, ECHO: 10 } }, { t: "vibe", pins: { IN: 5 } }, { t: "led", color: "red", pin: 13 }, { t: "buzzer", pin: 8 }],
    try: ["Set the distance to 150 cm: slow pulses. 30 cm: fast pulses.", "Under 20 cm it buzzes non-stop.", "Add a quiet mode that only vibrates."],
    code: `// Smart cane
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
`,
  },
};
