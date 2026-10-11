/* Junior Makers (ages 8-11) circuits. */
const OLED_INC = `#include <Wire.h>
#include <Adafruit_GFX.h>
#include <Adafruit_SSD1306.h>
Adafruit_SSD1306 oled(128, 64, &Wire, -1);`;
const DRIVE = `void drive(int left, int right) {           // -255 .. 255
  digitalWrite(IN1, left > 0);  digitalWrite(IN2, left < 0);  analogWrite(ENA, abs(left));
  digitalWrite(IN3, right > 0); digitalWrite(IN4, right < 0); analogWrite(ENB, abs(right));
}`;
export default {
  "JM-00": {
    board: null, title: "Intro to Robotics + Art Bot", goal: "Batteries, a switch and a motor: flip the switch and the art bot's motor spins its pens.",
    parts: [{ t: "battery", attrs: { kind: "2xAA" }, rails: { "+": "switch", "-": "bn" } }, { t: "slideswitch", feed: true }, { t: "dcmotor", label: "Art bot motor", rails: { M1: "bp", M2: "bn" } }],
    try: ["Press Start, then click the slide switch to turn the motor on and off.", "Swap the motor's two wires: it spins the other way.", "Change the battery to 4xAA: faster."],
  },
  "JM-01": {
    board: null, title: "Series & Parallel Circuit Lab", goal: "Two LEDs in parallel: each has its own path from + to −, so both shine fully and one can fail without the other going out.",
    parts: [{ t: "battery", attrs: { kind: "9V" }, rails: { "+": "switch", "-": "bn" } }, { t: "slideswitch", feed: true }, { t: "led", color: "red", pin: "+" }, { t: "led", color: "green", pin: "+" }],
    try: ["Start and flip the switch: both LEDs light together.", "Delete the green LED: the red one stays on. That is parallel.", "For series circuits and brightness, open Circuit Construction Kit: DC in Virtual labs."],
    note: "Circuit Lab checks which paths are complete. To compare brightness in series and parallel, use the PhET Circuit Construction Kit (Simulators page).",
  },
  "JM-02": {
    title: "Two-Player Reaction Timer with Scoreboard", goal: "Wait for the red light, then press first! The OLED keeps the score. Pressing too early loses the point.",
    parts: [{ t: "button", pin: 2, color: "green" }, { t: "button", pin: 3, color: "blue" }, { t: "led", color: "red", pin: 13 }, { t: "led", color: "green", pin: 12 }, { t: "led", color: "blue", pin: 11 }, { t: "buzzer", pin: 8 }, { t: "oled" }],
    try: ["Start, wait for the red LED, then click a button.", "Click a button before red: that player loses the point.", "Make the game end when someone reaches 5 points."],
    code: `// Two-player reaction timer
${OLED_INC}
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
`,
  },
  "JM-04": {
    title: "Smart Dustbin with Fill-Level Indicator", goal: "Wave a hand near the bin: the lid opens by itself. Green = lid closed, red = lid open.",
    parts: [{ t: "hcsr04", pins: { TRIG: 9, ECHO: 10 } }, { t: "servo", pins: { PWM: 6 } }, { t: "led", color: "green", pin: 12 }, { t: "led", color: "red", pin: 13 }, { t: "buzzer", pin: 8 }],
    try: ["Set the distance below 15 cm: the lid (servo) opens.", "Make the lid stay open for 5 seconds.", "Add a beep when the lid closes."],
    code: `// Smart dustbin
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
`,
  },
  "JM-05": {
    title: "Rain-Sensing Automatic Window", goal: "When rain lands on the sensor, the window (servo) closes and the buzzer warns.",
    parts: [{ t: "rain", pins: { AO: "A0" } }, { t: "servo", pins: { PWM: 9 } }, { t: "led", color: "blue", pin: 13 }, { t: "buzzer", pin: 8 }],
    try: ["Click the rain sensor and add rain: the window closes.", "Dry it again: the window opens.", "Make the window close only in heavy rain."],
    code: `// Rain-sensing window
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
`,
  },
  "JM-06": {
    title: "Fire & Gas Safety Alarm Panel", goal: "Watches for flames and smoke. The OLED shows the readings and the alarm sounds on danger.",
    parts: [{ t: "flame", pins: { DO: 2 } }, { t: "mq2", pins: { AO: "A0" } }, { t: "led", color: "red", pin: 13 }, { t: "buzzer", pin: 8 }, { t: "oled" }],
    try: ["Click the gas sensor and raise the smoke above 400 ppm.", "Click the flame sensor and bring a flame close.", "Show 'SAFE' in big letters when everything is fine."],
    code: `// Fire & gas safety panel
${OLED_INC}
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
`,
  },
  "JM-08": {
    title: "Sun-Tracking Solar Panel", goal: "Two light sensors compare left and right; the servo turns the solar panel towards the brighter side.",
    parts: [{ t: "ldr", label: "Left eye", pins: { AO: "A0" } }, { t: "ldr", label: "Right eye", pins: { AO: "A1" } }, { t: "servo", pins: { PWM: 9 } }, { t: "led", color: "yellow", pin: 13 }],
    try: ["Make the left sensor brighter than the right: the servo turns left.", "Make them equal: the servo stops and the LED lights.", "Change TOLERANCE to make it less jumpy."],
    code: `// Sun-tracking solar panel
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
`,
  },
  "JM-09": {
    title: "Home Burglar Alarm with Secret Code", goal: "The alarm sounds when the PIR sees someone. Press the secret button 3 times quickly to switch it off.",
    parts: [{ t: "pir", pins: { OUT: 2 } }, { t: "button", pin: 3 }, { t: "led", color: "red", pin: 13 }, { t: "led", color: "green", pin: 12 }, { t: "buzzer", pin: 8 }],
    try: ["Wave in front of the PIR: the alarm starts.", "Press the button 3 times within 3 seconds: alarm off (green).", "Change the secret to 4 presses."],
    code: `// Burglar alarm with a secret code
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
`,
  },
  "JM-11": {
    title: "Line Following Robot", goal: "Two IR sensors look at the floor. The robot steers to keep the black line between them.",
    parts: [{ t: "irline", label: "Left sensor", pins: { OUT: 2 } }, { t: "irline", label: "Right sensor", pins: { OUT: 3 } }, { t: "l298n", pins: { ENA: 5, IN1: 7, IN2: 8, ENB: 6, IN3: 9, IN4: 11 }, with: { motors: 2, supply: "4xAA" } }, { t: "buzzer", pin: 4 }],
    try: ["Both sensors on white: both wheels go forward.", "Put the left sensor over black: the robot turns left.", "Make the robot stop and beep when both see black (finish line)."],
    code: `// Line following robot
const int LEFT = 2, RIGHT = 3, BUZZER = 4;
const int ENA = 5, IN1 = 7, IN2 = 8, ENB = 6, IN3 = 9, IN4 = 11;
const int SPEED = 170;

${DRIVE}

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
`,
  },
  "JM-13": {
    title: "Step Counter Fitness Tracker", goal: "The MPU6050 feels each step as a bump in acceleration. The OLED counts steps; the button resets.",
    parts: [{ t: "mpu6050" }, { t: "oled" }, { t: "button", pin: 2 }, { t: "led", color: "green", pin: 13 }, { t: "buzzer", pin: 8 }],
    try: ["Click the MPU6050 and drag Accel Z up past 13 and back down: one step.", "Press the button to reset.", "Make it celebrate (beep) every 10 steps."],
    code: `// Step counter
#include <Adafruit_MPU6050.h>
${OLED_INC}
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
`,
  },
  "JM-15": {
    title: "Pong Game with a Knob Controller", goal: "The knob is a game paddle. The Arduino sends its position to the computer game over Serial.",
    parts: [{ t: "pot", pin: "A0" }, { t: "button", pin: 2 }, { t: "led", color: "green", pin: 13 }, { t: "buzzer", pin: 8 }],
    try: ["Open the Serial tab, then the Graph: turn the knob and watch the paddle line.", "Press the button: it sends SERVE.", "Send H from the Serial box: the board beeps (a hit)."],
    code: `// Pong controller: knob = paddle
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
`,
  },
  "JM-20": {
    title: "Joystick Maze Game", goal: "The joystick sends UP, DOWN, LEFT and RIGHT to a maze game on the computer. The button buzzes.",
    parts: [{ t: "joystick", pins: { HORZ: "A0", VERT: "A1", SEL: 2 } }, { t: "led", color: "blue", pin: 13 }, { t: "buzzer", pin: 8 }],
    try: ["Drag the joystick knob while running and watch Serial.", "Click the joystick button: it beeps.", "Make the LED light whenever the stick is pushed."],
    code: `// Joystick maze controller
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
`,
  },
  "JM-21": {
    title: "NeoPixel Light Show to the Beat", goal: "A sound sensor listens; the LED strip lights up like a music level meter.",
    parts: [{ t: "ledstrip", attrs: { pixels: "16" }, pins: { DIN: 6 } }, { t: "sound", pins: { AO: "A0" } }, { t: "led", color: "white", pin: 13 }],
    try: ["Click the sound sensor and raise the sound level.", "Change the colours from green-to-red into blue-to-purple.", "Make the strip flash white on a very loud sound."],
    code: `// Sound-reactive LED strip
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
`,
  },
  "JM-23": {
    title: "Ultrasonic Theremin: Music in the Air", goal: "Hold the button and move your hand: closer = higher note, like a theremin.",
    parts: [{ t: "hcsr04", pins: { TRIG: 9, ECHO: 10 } }, { t: "button", pin: 2 }, { t: "led", color: "red", pin: 13 }, { t: "buzzer", pin: 8 }],
    try: ["Hold the button and slide the distance up and down.", "Snap notes to a scale so it sounds musical.", "Make the LED brightness follow the pitch."],
    code: `// Ultrasonic theremin
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
`,
  },
  "JM-25": {
    title: "Smart Traffic Junction with Car Counter", goal: "An IR sensor counts passing cars. When 5 cars wait, the light turns green sooner. The OLED shows the count.",
    parts: [{ t: "ir", pins: { OUT: 2 } }, { t: "led", color: "red", pin: 13 }, { t: "led", color: "yellow", pin: 12 }, { t: "led", color: "green", pin: 11 }, { t: "buzzer", pin: 8 }, { t: "oled" }],
    try: ["Turn 'Object in front' on and off to count cars.", "Count 5 cars: the light goes green early.", "Show the total cars today on the OLED."],
    code: `// Smart traffic junction
${OLED_INC}
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
`,
  },
  "JM-26": {
    title: "Smart Kitchen Scale", goal: "A load cell and HX711 weigh things in grams. The button sets zero (tare); the LED warns if it is too heavy.",
    parts: [{ t: "hx711", pins: { DT: 3, SCK: 4 } }, { t: "oled" }, { t: "button", pin: 2 }, { t: "led", color: "red", pin: 13 }, { t: "buzzer", pin: 8 }],
    try: ["Click the load cell and put 250 g on it.", "Press the button (tare), then add 100 g more: the scale shows 100 g.", "Change the overload limit to 2 kg."],
    code: `// Smart kitchen scale
#include <HX711.h>
${OLED_INC}
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
`,
  },
  "JM-27": {
    title: "Arcade Claw Machine", goal: "The joystick swings the arm left and right; the button opens and closes the claw.",
    parts: [{ t: "joystick", pins: { HORZ: "A0", VERT: "A1", SEL: 2 } }, { t: "servo", label: "Arm servo", pins: { PWM: 9 } }, { t: "servo", label: "Claw servo", pins: { PWM: 10 } }, { t: "led", color: "green", pin: 13 }, { t: "buzzer", pin: 8 }],
    try: ["Drag the joystick left and right: the arm servo follows.", "Click the joystick button: the claw opens or closes.", "Add a 30-second game timer with a buzzer at the end."],
    code: `// Arcade claw machine
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
`,
  },
  "JM-32": {
    title: "Cyber Safety Escape Room", goal: "Type the 4-digit code on the keypad. Right code = green light and a happy tune; wrong code = low buzz.",
    parts: [{ t: "keypad", pins: { R1: 9, R2: 8, R3: 7, R4: 6, C1: 5, C2: 4, C3: 3, C4: 2 } }, { t: "led", color: "green", pin: 12 }, { t: "buzzer", pin: 11 }],
    try: ["Click the keypad keys: 4 2 3 1.", "Try a wrong code: low buzz.", "Change the secret to your own 4 digits."],
    code: `// Escape room lock
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
`,
  },
};
