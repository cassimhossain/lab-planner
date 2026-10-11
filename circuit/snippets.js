/* Circuit Lab - Code library: ready-made code to start from. board: "uno" | "esp32" | "any" */
export const SNIPPETS = [
  { cat: "Basics", title: "Blink", board: "any", about: "Turn the built-in LED on and off.", code: `void setup() {
  pinMode(LED_BUILTIN, OUTPUT);
}

void loop() {
  digitalWrite(LED_BUILTIN, HIGH);
  delay(500);
  digitalWrite(LED_BUILTIN, LOW);
  delay(500);
}
` },
  { cat: "Basics", title: "Button controls an LED", board: "uno", about: "INPUT_PULLUP: the button joins the pin to GND, so pressed = LOW.", code: `const int BUTTON = 2;
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
` },
  { cat: "Basics", title: "Toggle with one press", board: "uno", about: "Each press switches the LED on or off (with debounce).", code: `const int BUTTON = 2, LED = 13;
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
` },
  { cat: "Basics", title: "Read an analog sensor", board: "uno", about: "analogRead gives 0-1023. Print it to the Serial monitor.", code: `const int SENSOR = A0;

void setup() {
  Serial.begin(9600);
}

void loop() {
  int value = analogRead(SENSOR);
  Serial.print("Value: ");
  Serial.println(value);
  delay(200);
}
` },
  { cat: "Basics", title: "Fade an LED (PWM)", board: "uno", about: "analogWrite on a ~ pin sets brightness 0-255.", code: `const int LED = 9;   // ~ PWM pin

void setup() {
  pinMode(LED, OUTPUT);
}

void loop() {
  for (int b = 0; b <= 255; b += 5) { analogWrite(LED, b); delay(20); }
  for (int b = 255; b >= 0; b -= 5) { analogWrite(LED, b); delay(20); }
}
` },
  { cat: "Basics", title: "Many LEDs with an array", board: "uno", about: "Loop through a list of pins: a running light.", code: `int leds[] = {8, 9, 10, 11, 12};
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
` },
  { cat: "Logic", title: "Threshold alarm (if / else)", board: "uno", about: "Do something when a reading goes past a limit.", code: `const int SENSOR = A0, LED = 13, BUZZER = 8;
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
` },
  { cat: "Logic", title: "Do two things at once (millis)", board: "any", about: "Blink without delay() so the board can keep reading sensors.", code: `const int LED = 13;
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
` },
  { cat: "Logic", title: "map() and constrain()", board: "any", about: "Turn one range of numbers into another.", code: `void setup() {
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
` },
  { cat: "Logic", title: "State machine (modes)", board: "uno", about: "A button cycles through modes; each mode does something different.", code: `const int BUTTON = 2, LED = 13;
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
` },
  { cat: "Logic", title: "Read commands from Serial", board: "any", about: "Type in the Serial monitor to control the board.", code: `void setup() {
  pinMode(LED_BUILTIN, OUTPUT);
  Serial.begin(9600);
  Serial.println("Type ON or OFF");
}

void loop() {
  if (Serial.available()) {
    String cmd = Serial.readStringUntil('\\n');
    cmd.trim();
    cmd.toUpperCase();
    if (cmd == "ON")  { digitalWrite(LED_BUILTIN, HIGH); Serial.println("LED on"); }
    if (cmd == "OFF") { digitalWrite(LED_BUILTIN, LOW);  Serial.println("LED off"); }
  }
}
` },
  { cat: "Sound", title: "Melody", board: "any", about: "Play notes with tone(pin, frequency, length).", code: `const int BUZZER = 8;
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
` },
  { cat: "Sound", title: "Siren", board: "any", about: "Sweep the pitch up and down.", code: `const int BUZZER = 8;

void setup() {}

void loop() {
  for (int f = 500; f < 1500; f += 20) { tone(BUZZER, f); delay(5); }
  for (int f = 1500; f > 500; f -= 20) { tone(BUZZER, f); delay(5); }
}
` },
  { cat: "Motion", title: "Servo follows a knob", board: "uno", about: "Turn the potentiometer to turn the servo.", code: `#include <Servo.h>
Servo servo;

void setup() {
  servo.attach(9);
}

void loop() {
  int angle = map(analogRead(A0), 0, 1023, 0, 180);
  servo.write(angle);
  delay(15);
}
` },
  { cat: "Motion", title: "Obstacle-avoiding car", board: "uno", about: "HC-SR04 + L298N: drive forward, turn when something is close.", code: `const int TRIG = 12, ECHO = 13;
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
` },
  { cat: "Wi-Fi (ESP32)", title: "Web page that switches an LED", board: "esp32", about: "Open the Phone panel and tap the buttons on the page.", code: `#include <WiFi.h>
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
  Serial.print("\\nOpen http://"); Serial.println(WiFi.localIP());
  server.on("/", [] { server.send(200, "text/html", page()); });
  server.on("/on", [] { digitalWrite(LED, HIGH); server.send(200, "text/html", page()); });
  server.on("/off", [] { digitalWrite(LED, LOW); server.send(200, "text/html", page()); });
  server.begin();
}

void loop() {
  server.handleClient();
}
` },
  { cat: "Wi-Fi (ESP32)", title: "Live sensor web page (JSON)", board: "esp32", about: "The page asks the board for new readings every second with fetch().", code: `#include <WiFi.h>
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
  server.on("/data", [] { server.send(200, "application/json", "{\\"value\\":" + String(analogRead(SENSOR)) + "}"); });
  server.begin();
  Serial.println(WiFi.localIP());
}

void loop() {
  server.handleClient();
}
` },
  { cat: "Wi-Fi (ESP32)", title: "Send data to the cloud (HTTP)", board: "esp32", about: "Post a reading to a web service every 10 seconds (pretend internet).", code: `#include <WiFi.h>
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
` },
  { cat: "Wi-Fi (ESP32)", title: "MQTT publish and subscribe", board: "esp32", about: "Talk to an MQTT broker. Send messages back from the Network panel.", code: `#include <WiFi.h>
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
` },
  { cat: "Wi-Fi (ESP32)", title: "Bluetooth serial", board: "esp32", about: "Send text from the Phone panel's Bluetooth terminal.", code: `#include <BluetoothSerial.h>
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
` },
  { cat: "Wi-Fi (ESP32)", title: "ESP-NOW send", board: "esp32", about: "Send a small message to another ESP32 without a router.", code: `#include <WiFi.h>
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
` },
];
