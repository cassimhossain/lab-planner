/* Foundation + Little Explorers (ages 5-7) circuits. Code stays short and friendly. */
export default {
  "F-04": {
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
  "F-00": {
    title: "Welcome to Robotics: Distance Alarm", goal: "Like a car parking sensor: when something comes closer than 20 cm the LED lights and the buzzer sounds.",
    parts: [{ t: "hcsr04", pins: { TRIG: 9, ECHO: 10 } }, { t: "led", color: "red", pin: 13 }, { t: "buzzer", pin: 8 }],
    try: ["Click the ultrasonic sensor and move the distance slider below 20 cm.", "Open the Serial tab to see the distance.", "Change ALARM_CM to 40 and test again."],
    code: `// Distance Alarm: like a car parking sensor
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
`,
  },
  "F-01": {
    title: "Arduino Uno Basics", goal: "Output, input and analog in one circuit: the knob sets the blink speed and the button beeps.",
    parts: [{ t: "led", color: "green", pin: 13 }, { t: "button", pin: 2 }, { t: "pot", pin: "A0" }, { t: "buzzer", pin: 8 }],
    try: ["Turn the knob while it runs: the LED blinks faster or slower.", "Hold the button: the buzzer beeps.", "Open Serial to see the blink time in milliseconds."],
    code: `// Arduino Uno basics: OUTPUT, INPUT and ANALOG
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
`,
  },
  "F-02": {
    board: "esp32", title: "ESP32 Basics", goal: "An ESP32 joins Wi-Fi, reads a knob and serves a web page where a phone switches the LED.",
    parts: [{ t: "led", color: "blue", pin: 13 }, { t: "pot", pin: 34 }],
    try: ["Start, then open the Phone tab: tap ON and OFF.", "Turn the knob and press Refresh on the page: the number changes (0 to 4095 on an ESP32).", "Change the page title to your own name."],
    code: `// ESP32 basics: Wi-Fi + a tiny web page
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
  Serial.print("\\nMy address: "); Serial.println(WiFi.localIP());
  server.on("/", page);
  server.on("/on", [] { digitalWrite(LED, HIGH); page(); });
  server.on("/off", [] { digitalWrite(LED, LOW); page(); });
  server.begin();
}

void loop() {
  server.handleClient();
}
`,
  },
  "LE-01": {
    board: null, title: "Light-Up Paper Circuit Card", goal: "A coin cell lights an LED: the simplest circuit. Long leg to +, short leg to −.",
    parts: [{ t: "battery", attrs: { kind: "coin" }, rails: { "+": "bp", "-": "bn" } }, { t: "led", color: "red", pin: "+", direct: true }],
    try: ["Press Start: the LED lights with no code at all.", "Click the LED, choose another colour, start again.", "Drag the LED's long leg off the + column: the circuit is broken and the light goes out."],
    note: "A coin cell is weak enough to light an LED without a resistor. With a 9V battery you must add one.",
  },
  "LE-02": {
    title: "Push-Button Doorbell", goal: "Press the button: the LED flashes and the buzzer plays ding-dong.",
    parts: [{ t: "button", pin: 2 }, { t: "led", color: "yellow", pin: 13 }, { t: "buzzer", pin: 8 }],
    try: ["Click and hold the button while it runs.", "Make the doorbell play three notes instead of two.", "Make the LED blink twice for each ring."],
    code: `// Push-button doorbell: ding-dong!
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
`,
  },
  "LE-03": {
    board: null, title: "Lemon Battery LED Lamp", goal: "Three lemons with a zinc nail and a copper coin each make about 2.7 volts: enough for a red LED.",
    parts: [{ t: "battery", attrs: { kind: "lemon" }, rails: { "+": "bp", "-": "bn" } }, { t: "led", color: "red", pin: "+", direct: true }],
    try: ["Press Start: the red LED glows.", "Change the battery Type to 2xAA to compare.", "Real lemons give very little current, so the real LED is dim: try it in a dark room."],
    note: "Circuit Lab shows if the LED gets enough voltage, not how bright a real lemon battery can make it.",
  },
  "LE-04": null,
  "LE-05": {
    title: "Automatic Night Lamp", goal: "When it gets dark the lamp (LED) turns on by itself, like a street light.",
    parts: [{ t: "ldr", pins: { AO: "A0" } }, { t: "led", color: "white", pin: 13 }, { t: "buzzer", pin: 8 }],
    try: ["Click the light sensor and slide the light down to 0 (night).", "Watch the number in the Serial tab: bigger = darker.", "Change DARK to 500 so the lamp turns on earlier."],
    code: `// Automatic night lamp
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
`,
  },
  "LE-06": {
    title: "Hot & Cold Temperature Indicator", goal: "Red LED when it is hot, blue LED when it is cold, and a warning beep if it is very hot.",
    parts: [{ t: "dht22", pins: { SDA: 7 } }, { t: "led", color: "red", pin: 13 }, { t: "led", color: "blue", pin: 12 }, { t: "buzzer", pin: 8 }],
    try: ["Click the DHT22 and set 35 °C: red. Set 10 °C: blue.", "Find the temperature where neither LED is on.", "Make it beep above 40 °C only."],
    code: `// Hot & cold indicator
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
`,
  },
  "LE-08": {
    title: "Motion Detector Room Alarm", goal: "When the PIR sensor sees movement the alarm flashes and sounds a siren.",
    parts: [{ t: "pir", pins: { OUT: 2 } }, { t: "led", color: "red", pin: 13 }, { t: "buzzer", pin: 8 }],
    try: ["Click the PIR sensor and press Wave in front.", "Make the siren last longer.", "Add a quiet mode: only flash, no sound."],
    code: `// Motion alarm
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
`,
  },
  "LE-09": {
    title: "Waving Robot Arm", goal: "Press the button and the servo arm waves hello three times.",
    parts: [{ t: "servo", pins: { PWM: 9 } }, { t: "button", pin: 2 }, { t: "led", color: "green", pin: 13 }, { t: "buzzer", pin: 8 }],
    try: ["Press the button and watch the servo arm.", "Make it wave five times.", "Make it wave faster (smaller delay)."],
    code: `// Waving robot arm
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
`,
  },
  "LE-10": {
    title: "Automatic Railway Crossing Gate", goal: "When a train comes close the gate (servo) closes, the red light flashes and the bell rings.",
    parts: [{ t: "hcsr04", pins: { TRIG: 9, ECHO: 10 } }, { t: "servo", pins: { PWM: 6 } }, { t: "led", color: "red", pin: 13 }, { t: "buzzer", pin: 8 }],
    try: ["Set the distance below 25 cm: the gate goes down.", "Move it away again: the gate opens.", "Make the warning bell ring faster."],
    code: `// Railway crossing gate
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
`,
  },
  "LE-11": {
    board: null, title: "Vibrating Brush Robot", goal: "A coin cell spins a tiny motor with an off-centre weight: the shaking makes the brush bot walk.",
    parts: [{ t: "battery", attrs: { kind: "coin" }, rails: { "+": "bp", "-": "bn" } }, { t: "dcmotor", label: "Vibration motor", rails: { M1: "bp", M2: "bn" } }],
    try: ["Press Start: the motor spins.", "Swap the two motor wires: it spins the other way.", "Try a 2xAA battery: faster!"],
  },
  "LE-12": {
    title: "Morse Code Light Messenger", goal: "The button is a Morse key: short press = dot, long press = dash. On start it sends SOS by itself.",
    parts: [{ t: "button", pin: 2 }, { t: "led", color: "yellow", pin: 13 }, { t: "buzzer", pin: 8 }],
    try: ["Watch the SOS at the start: · · ·  − − −  · · ·", "Press and hold the button to send your own dots and dashes.", "Change the code to send your name's first letter."],
    code: `// Morse code messenger
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
`,
  },
  "LE-19": {
    title: "Program the Robot Car Through a Floor Maze", goal: "A robot car follows a list of moves: F = forward, L = left, R = right. Write the path through the maze.",
    parts: [{ t: "l298n", pins: { ENA: 5, IN1: 7, IN2: 8, ENB: 6, IN3: 9, IN4: 11 }, with: { motors: 2, supply: "4xAA" } }, { t: "buzzer", pin: 4 }],
    try: ["Start and watch both wheels: forward, then turns.", "Change the path in PATH to \"FFLFRF\".", "Add a B for backward."],
    code: `// Robot car maze program
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
`,
  },
  "LE-21": {
    title: "Rainbow LED Ring", goal: "Twelve colour LEDs make a spinning rainbow. A beep marks every full turn.",
    parts: [{ t: "ledring", pins: { DIN: 6 } }, { t: "led", color: "green", pin: 13 }, { t: "buzzer", pin: 8 }],
    try: ["Press Start and enjoy the rainbow.", "Change setBrightness(60) to 150.", "Make the whole ring one colour: ring.fill(ring.Color(0, 0, 255))."],
    code: `// Rainbow LED ring
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
`,
  },
  "LE-22": {
    title: "Button Melody Maker", goal: "Each button press plays the next note of a song on the buzzer.",
    parts: [{ t: "button", pin: 2 }, { t: "led", color: "blue", pin: 13 }, { t: "buzzer", pin: 8 }],
    try: ["Press the button again and again to play the tune.", "Change the notes to play a different song.", "Light the LED only while a note plays."],
    code: `// Button melody maker
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
`,
  },
  "LE-23": {
    title: "Colour Detective Sensor", goal: "The colour sensor looks at an object and the RGB LED copies its colour.",
    parts: [{ t: "tcs34725" }, { t: "rgbled", pins: { R: 9, G: 10, B: 11 } }, { t: "buzzer", pin: 8 }],
    try: ["Click the colour sensor and pick an object colour.", "Watch the RGB LED change to match.", "Open Serial to see the red, green and blue numbers."],
    code: `// Colour detective
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
`,
  },
  "LE-30": {
    title: "Follow-Me Robot Pet", goal: "The robot pet keeps 20 cm from your hand: too far = drive forward, too close = back up.",
    parts: [{ t: "hcsr04", pins: { TRIG: 12, ECHO: 10 } }, { t: "l298n", pins: { ENA: 5, IN1: 7, IN2: 8, ENB: 6, IN3: 9, IN4: 11 }, with: { motors: 2, supply: "4xAA" } }],
    try: ["Set the distance to 50 cm: the wheels drive forward.", "Set it to 10 cm: the wheels go backward.", "At about 20 cm the pet stays still. Change the happy distance to 30."],
    code: `// Follow-me robot pet
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
`,
  },
  "LE-32": {
    title: "Countdown Rocket Launch", goal: "Press the button: 3 (red), 2 (yellow), 1 (green)… LIFT OFF with a rocket sound!",
    parts: [{ t: "button", pin: 2 }, { t: "led", color: "red", pin: 13 }, { t: "led", color: "yellow", pin: 12 }, { t: "led", color: "green", pin: 11 }, { t: "buzzer", pin: 8 }],
    try: ["Press the button to launch.", "Make the countdown start from 5.", "Make the lift-off sound go higher and higher."],
    code: `// Countdown rocket launch
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
`,
  },
};
