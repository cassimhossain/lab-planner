/* Circuit Lab - example circuits. Parts with `anchor` are placed so that one of their pins sits on a breadboard hole. */
const U = (x = 0, y = 160) => ({ id: "uno1", type: "uno", x, y, rot: 0 });
const w = (from, to, color) => ({ from, to, color, pts: [] });
const R = "#E63946", K = "#2B2D42", G = "#2E9E5B", B = "#1F6FD1", O = "#E8590C", Y = "#F5B83D", P = "#7B3FC4";

export const EXAMPLES = [
  {
    key: "blink", name: "Blink", lesson: "F-01 Arduino Uno Basics", about: "The classic first program: the built-in LED on pin 13 blinks.",
    parts: [U(40, 40)], wires: [],
    code: `// Blink: the built-in LED (marked L) is on pin 13
void setup() {
  pinMode(13, OUTPUT);
}

void loop() {
  digitalWrite(13, HIGH);  // LED on
  delay(500);              // wait half a second
  digitalWrite(13, LOW);   // LED off
  delay(500);
}
`,
  },
  {
    key: "traffic", name: "Traffic light", lesson: "LE-04 Traffic Light Controller", about: "Red, yellow and green LEDs on a breadboard, each with a resistor.",
    parts: [U(0, 200), { id: "breadboard1", type: "breadboard", x: 300, y: 10, rot: 0 },
      { id: "led1", type: "led", attrs: { color: "red" }, anchor: { pin: "C", to: "breadboard1:4e" } },
      { id: "led2", type: "led", attrs: { color: "yellow" }, anchor: { pin: "C", to: "breadboard1:10e" } },
      { id: "led3", type: "led", attrs: { color: "green" }, anchor: { pin: "C", to: "breadboard1:16e" } },
      { id: "resistor1", type: "resistor", rot: 90, anchor: { pin: "1", to: "breadboard1:5h" } },
      { id: "resistor2", type: "resistor", rot: 90, anchor: { pin: "1", to: "breadboard1:11h" } },
      { id: "resistor3", type: "resistor", rot: 90, anchor: { pin: "1", to: "breadboard1:17h" } }],
    wires: [w("uno1:13", "breadboard1:5j", R), w("uno1:12", "breadboard1:11j", Y), w("uno1:11", "breadboard1:17j", G),
      w("breadboard1:4a", "breadboard1:bn.4", K), w("breadboard1:10a", "breadboard1:bn.9", K), w("breadboard1:16a", "breadboard1:bn.14", K),
      w("uno1:GND.2", "breadboard1:bn.1", K)],
    code: `// Traffic light: red, then green, then yellow
const int RED = 13, YELLOW = 12, GREEN = 11;

void setup() {
  pinMode(RED, OUTPUT);
  pinMode(YELLOW, OUTPUT);
  pinMode(GREEN, OUTPUT);
}

void loop() {
  digitalWrite(RED, HIGH);   delay(3000);  digitalWrite(RED, LOW);
  digitalWrite(GREEN, HIGH); delay(3000);  digitalWrite(GREEN, LOW);
  digitalWrite(YELLOW, HIGH); delay(1000); digitalWrite(YELLOW, LOW);
}
`,
  },
  {
    key: "button", name: "Button and LED", lesson: "LE-02 Push Button Doorbell", about: "Press the button to light the LED. Uses INPUT_PULLUP, so no extra resistor is needed for the button.",
    parts: [U(0, 140), { id: "button1", type: "button", x: 330, y: 20, rot: 0 }, { id: "led1", type: "led", x: 120, y: 20, rot: 0, attrs: { color: "red" } }, { id: "resistor1", type: "resistor", x: 160, y: 72, rot: 0 }],
    wires: [w("uno1:2", "button1:1.l", G, [[237, 100], [310, 100], [310, 33]]), w("button1:2.r", "uno1:GND.1", K, [[410, 52], [410, 120], [116, 120]]),
      w("uno1:13", "resistor1:1", O, [[125, 78]]), w("resistor1:2", "led1:A", O, [[219, 50], [145, 50]]), w("led1:C", "uno1:GND.1", K, [[135, 110], [116, 110]])],
    code: `// Press the button: the LED turns on
const int BUTTON = 2, LED = 13;

void setup() {
  pinMode(BUTTON, INPUT_PULLUP);  // reads HIGH when not pressed
  pinMode(LED, OUTPUT);
}

void loop() {
  if (digitalRead(BUTTON) == LOW) {   // pressed (connected to GND)
    digitalWrite(LED, HIGH);
  } else {
    digitalWrite(LED, LOW);
  }
}
`,
  },
  {
    key: "dimmer", name: "Potentiometer dimmer", lesson: "JM-01 Series and Parallel Circuits", about: "Turn the knob to change LED brightness with analogRead and analogWrite (PWM).",
    parts: [U(0, 40), { id: "pot1", type: "pot", x: 330, y: 230, rot: 0 }, { id: "led1", type: "led", x: 330, y: 20, rot: 0, attrs: { color: "yellow" } }, { id: "resistor1", type: "resistor", x: 300, y: 110, rot: 90 }],
    wires: [w("uno1:A0", "pot1:SIG", G, [[208, 280], [369, 280]]), w("uno1:5V", "pot1:VCC", R, [[160, 290], [379, 290]]), w("uno1:GND.2", "pot1:GND", K, [[170, 300], [359, 300]]),
      w("uno1:9", "resistor1:1", O, [[163, 30], [329, 30], [329, 110]]), w("resistor1:2", "led1:A", O), w("led1:C", "uno1:GND.1", K, [[345, 5], [116, 5]])],
    code: `// Knob controls brightness
const int LED = 9;   // ~ pins can do PWM

void setup() {
  Serial.begin(9600);
}

void loop() {
  int knob = analogRead(A0);           // 0 .. 1023
  int bright = map(knob, 0, 1023, 0, 255);
  analogWrite(LED, bright);            // 0 .. 255
  Serial.println(knob);
  delay(50);
}
`,
  },
  {
    key: "melody", name: "Buzzer melody", lesson: "LE-22 Button Melody Maker", about: "Play notes with tone(). Turn your sound on.",
    parts: [U(0, 40), { id: "buzzer1", type: "buzzer", x: 330, y: 40, rot: 0 }],
    wires: [w("uno1:8", "buzzer1:2", P, [[173, 20], [367, 20], [367, 40]]), w("buzzer1:1", "uno1:GND.1", K, [[357, 150], [300, 150], [300, 0], [116, 0]])],
    code: `// Twinkle twinkle on a buzzer
const int BUZZER = 8;
int notes[] = {262, 262, 392, 392, 440, 440, 392, 0, 349, 349, 330, 330, 294, 294, 262};

void setup() {}

void loop() {
  for (int i = 0; i < 15; i++) {
    if (notes[i] > 0) tone(BUZZER, notes[i]);
    else noTone(BUZZER);
    delay(350);
    noTone(BUZZER);
    delay(50);
  }
  delay(1000);
}
`,
  },
  {
    key: "servo", name: "Servo sweep", lesson: "LE-09 Waving Robot Arm", about: "A servo motor sweeps from 0° to 180° and back.",
    parts: [U(0, 40), { id: "servo1", type: "servo", x: 340, y: 40, rot: 0 }],
    wires: [w("uno1:9", "servo1:PWM", O, [[163, 0], [320, 0], [320, 109]]), w("uno1:5V", "servo1:V+", R, [[160, 270], [310, 270], [310, 100]]), w("uno1:GND.2", "servo1:GND", K, [[170, 280], [300, 280], [300, 90]])],
    code: `#include <Servo.h>
Servo arm;

void setup() {
  arm.attach(9);
}

void loop() {
  for (int a = 0; a <= 180; a += 2) { arm.write(a); delay(15); }
  for (int a = 180; a >= 0; a -= 2) { arm.write(a); delay(15); }
}
`,
  },
  {
    key: "ultrasonic", name: "Ultrasonic distance", lesson: "JM-04 Smart Dustbin", about: "Measure distance with the HC-SR04. Change the distance in the part panel, read it in the Serial monitor.",
    parts: [U(0, 170), { id: "hcsr041", type: "hcsr04", x: 40, y: 10, rot: 0 }],
    wires: [w("hcsr041:VCC", "uno1:5V", R, [[111, 120], [20, 120], [20, 390], [160, 390]]), w("hcsr041:TRIG", "uno1:3", G, [[121, 130], [227, 130]]), w("hcsr041:ECHO", "uno1:2", B, [[131, 140], [237, 140]]), w("hcsr041:GND", "uno1:GND.1", K, [[141, 150], [116, 150]])],
    code: `// Distance in cm on the Serial monitor
const int TRIG = 3, ECHO = 2;

void setup() {
  Serial.begin(9600);
  pinMode(TRIG, OUTPUT);
  pinMode(ECHO, INPUT);
}

void loop() {
  digitalWrite(TRIG, LOW);  delayMicroseconds(2);
  digitalWrite(TRIG, HIGH); delayMicroseconds(10);
  digitalWrite(TRIG, LOW);
  long t = pulseIn(ECHO, HIGH);
  float cm = t * 0.0343 / 2;
  Serial.print("Distance: ");
  Serial.print(cm);
  Serial.println(" cm");
  delay(500);
}
`,
  },
  {
    key: "nightlamp", name: "Automatic night lamp", lesson: "LE-05 Automatic Night Lamp", about: "The LED turns on when it gets dark. Drag the light slider in the sensor panel.",
    parts: [U(0, 40), { id: "ldr1", type: "ldr", x: 40, y: 300, rot: 0 }, { id: "led1", type: "led", x: 340, y: 20, rot: 0, attrs: { color: "white" } }, { id: "resistor1", type: "resistor", x: 310, y: 110, rot: 90 }],
    wires: [w("ldr1:VCC", "uno1:5V", R, [[230, 316], [230, 280], [160, 280]]), w("ldr1:GND", "uno1:GND.2", K, [[240, 326], [240, 290], [170, 290]]), w("ldr1:AO", "uno1:A0", G, [[260, 346], [260, 270], [208, 270]]),
      w("uno1:7", "resistor1:1", O, [[189, 25], [339, 25], [339, 110]]), w("resistor1:2", "led1:A", O), w("led1:C", "uno1:GND.1", K, [[355, 5], [116, 5]])],
    code: `// Night lamp: LED on when it is dark
const int LED = 7;

void setup() {
  pinMode(LED, OUTPUT);
  Serial.begin(9600);
}

void loop() {
  int light = analogRead(A0);   // high number = dark, low = bright
  Serial.println(light);
  if (light > 600) digitalWrite(LED, HIGH);
  else digitalWrite(LED, LOW);
  delay(200);
}
`,
  },
  {
    key: "weather", name: "Weather station (DHT22 + LCD)", lesson: "JM-03 Mini Weather Station", about: "Temperature and humidity on an I2C LCD. Change the values in the DHT22 panel.",
    parts: [U(0, 200), { id: "dht221", type: "dht22", x: 40, y: 20, rot: 0 }, { id: "lcd1", type: "lcd", x: 330, y: 20, rot: 0, attrs: { pins: "i2c" } }],
    wires: [w("dht221:VCC", "uno1:5V", R, [[55, 170], [20, 170], [20, 430], [160, 430]]), w("dht221:SDA", "uno1:7", G, [[65, 180], [189, 180]]), w("dht221:GND", "uno1:GND.1", K, [[84, 160], [116, 160]]),
      w("lcd1:GND", "uno1:GND.2", K, [[300, 52], [300, 420], [170, 420]]), w("lcd1:VCC", "uno1:5V", R, [[290, 62], [290, 410], [160, 410]]), w("lcd1:SDA", "uno1:A4", B, [[310, 71], [310, 440], [246, 440]]), w("lcd1:SCL", "uno1:A5", Y, [[320, 81], [320, 450], [256, 450]])],
    code: `#include <DHT.h>
#include <LiquidCrystal_I2C.h>

DHT dht(7, DHT22);
LiquidCrystal_I2C lcd(0x27, 16, 2);

void setup() {
  dht.begin();
  lcd.init();
  lcd.backlight();
}

void loop() {
  float t = dht.readTemperature();
  float h = dht.readHumidity();
  lcd.setCursor(0, 0);
  lcd.print("Temp: "); lcd.print(t, 1); lcd.print((char)223); lcd.print("C ");
  lcd.setCursor(0, 1);
  lcd.print("Hum:  "); lcd.print(h, 1); lcd.print(" %  ");
  delay(2000);
}
`,
  },
  {
    key: "rainbow", name: "NeoPixel ring rainbow", lesson: "JM-21 NeoPixel Light Show", about: "A ring of 12 colour LEDs shows a moving rainbow.",
    parts: [U(0, 40), { id: "ledring1", type: "ledring", x: 330, y: 20, rot: 0, attrs: { pixels: "12" } }],
    wires: [w("ledring1:GND", "uno1:GND.1", K, [[386, 200], [300, 200], [300, 0], [116, 0]]), w("ledring1:VCC", "uno1:5V", R, [[396, 260], [160, 260]]), w("ledring1:DIN", "uno1:6", G, [[406, 210], [310, 210], [310, 10], [199, 10]])],
    code: `#include <Adafruit_NeoPixel.h>
Adafruit_NeoPixel ring(12, 6, NEO_GRB + NEO_KHZ800);

void setup() {
  ring.begin();
  ring.setBrightness(80);
}

void loop() {
  for (long hue = 0; hue < 65536; hue += 1024) {
    for (int i = 0; i < 12; i++) {
      ring.setPixelColor(i, ring.ColorHSV(hue + i * 65536L / 12));
    }
    ring.show();
    delay(20);
  }
}
`,
  },
  {
    key: "pir", name: "Motion alarm", lesson: "LE-08 Motion Detector Room Alarm", about: "The PIR sensor sees movement and the buzzer sounds. Click 'Wave in front' in the sensor panel.",
    parts: [U(0, 170), { id: "pir1", type: "pir", x: 40, y: 20, rot: 0 }, { id: "buzzer1", type: "buzzer", x: 330, y: 30, rot: 0 }],
    wires: [w("pir1:VCC", "uno1:5V", R, [[76, 130], [20, 130], [20, 400], [160, 400]]), w("pir1:OUT", "uno1:2", G, [[86, 140], [237, 140]]), w("pir1:GND", "uno1:GND.1", K, [[96, 150], [116, 150]]),
      w("buzzer1:2", "uno1:8", P, [[367, 140], [173, 140]]), w("buzzer1:1", "uno1:GND.1", K, [[357, 150], [140, 150]])],
    code: `// Motion alarm
const int PIR = 2, BUZZER = 8;

void setup() {
  pinMode(PIR, INPUT);
  Serial.begin(9600);
}

void loop() {
  if (digitalRead(PIR) == HIGH) {
    Serial.println("Motion detected!");
    tone(BUZZER, 1000, 200);
    delay(300);
  }
}
`,
  },
  {
    key: "counter", name: "7-segment counter", lesson: "Extra", about: "Count 0 to 9 on a 7-segment display.",
    parts: [U(0, 170), { id: "seg71", type: "seg7", x: 120, y: 20, rot: 0 }],
    wires: [w("seg71:A", "uno1:2", G), w("seg71:B", "uno1:3", G), w("seg71:C", "uno1:4", B), w("seg71:D", "uno1:5", B), w("seg71:E", "uno1:6", O), w("seg71:F", "uno1:7", O), w("seg71:G", "uno1:8", Y), w("seg71:COM.1", "uno1:GND.1", K)],
    code: `// Count 0-9 on a common-cathode 7-segment display
const int seg[7] = {2, 3, 4, 5, 6, 7, 8};   // A B C D E F G
const byte digits[10] = {
  0b0111111, 0b0000110, 0b1011011, 0b1001111, 0b1100110,
  0b1101101, 0b1111101, 0b0000111, 0b1111111, 0b1101111 };

void setup() {
  for (int i = 0; i < 7; i++) pinMode(seg[i], OUTPUT);
}

void loop() {
  for (int n = 0; n < 10; n++) {
    for (int i = 0; i < 7; i++) digitalWrite(seg[i], bitRead(digits[n], i));
    delay(700);
  }
}
`,
  },
  {
    key: "motor", name: "DC motor with L298N", lesson: "Robot car basics", about: "Speed and direction control of a DC motor through an L298N driver.",
    parts: [U(0, 200), { id: "l298n1", type: "l298n", x: 330, y: 40, rot: 0 }, { id: "dcmotor1", type: "dcmotor", x: 160, y: 20, rot: 0 }, { id: "battery1", type: "battery", x: 520, y: 140, rot: 0 }],
    wires: [w("dcmotor1:M1", "l298n1:OUT1", R, [[178, 110], [343, 110], [343, 74]]), w("dcmotor1:M2", "l298n1:OUT2", K, [[194, 120], [320, 120], [320, 88], [343, 88]]),
      w("battery1:+", "l298n1:12V", R, [[538, 120], [377, 120], [377, 177]]), w("battery1:-", "l298n1:GND", K, [[558, 130], [391, 130], [391, 177]]), w("l298n1:GND", "uno1:GND.1", K, [[391, 210], [116, 210]]),
      w("uno1:10", "l298n1:ENA", O, [[154, 195], [426, 195], [426, 171]]), w("uno1:9", "l298n1:IN1", Y, [[163, 190], [434, 190], [434, 171]]), w("uno1:8", "l298n1:IN2", G, [[173, 185], [443, 185], [443, 171]])],
    code: `// Motor forward slow, forward fast, stop, backward
const int ENA = 10, IN1 = 9, IN2 = 8;

void setup() {
  pinMode(ENA, OUTPUT); pinMode(IN1, OUTPUT); pinMode(IN2, OUTPUT);
}

void loop() {
  digitalWrite(IN1, HIGH); digitalWrite(IN2, LOW);
  analogWrite(ENA, 100); delay(2000);   // slow
  analogWrite(ENA, 255); delay(2000);   // fast
  analogWrite(ENA, 0);   delay(1000);   // stop
  digitalWrite(IN1, LOW); digitalWrite(IN2, HIGH);
  analogWrite(ENA, 180); delay(2000);   // backward
}
`,
  },
  {
    key: "thermometer", name: "Hot and cold thermometer", lesson: "LE-06 Hot and Cold Temperature Indicator", about: "Read an NTC temperature sensor: red LED when hot, blue when cold.",
    parts: [U(0, 40), { id: "ntc1", type: "ntc", x: 0, y: 300, rot: 0 }, { id: "led1", type: "led", x: 320, y: 20, attrs: { color: "red" } }, { id: "led2", type: "led", x: 380, y: 20, attrs: { color: "blue" } },
      { id: "resistor1", type: "resistor", x: 290, y: 110, rot: 90 }, { id: "resistor2", type: "resistor", x: 350, y: 110, rot: 90 }],
    wires: [w("ntc1:GND", "uno1:GND.2", K, [[170, 326]]), w("ntc1:VCC", "uno1:5V", R, [[160, 336]]), w("ntc1:OUT", "uno1:A0", G, [[208, 346]]),
      w("uno1:12", "resistor1:1", R, [[135, 25], [319, 25], [319, 110]]), w("resistor1:2", "led1:A", R), w("uno1:11", "resistor2:1", B, [[144, 30], [379, 30], [379, 110]]), w("resistor2:2", "led2:A", B),
      w("led1:C", "uno1:GND.1", K, [[335, 5], [116, 5]]), w("led2:C", "uno1:GND.1", K, [[395, 5], [335, 5]])],
    code: `// Red when hot, blue when cold
const int RED = 12, BLUE = 11;
const float BETA = 3950;

void setup() {
  pinMode(RED, OUTPUT); pinMode(BLUE, OUTPUT);
  Serial.begin(9600);
}

void loop() {
  int a = analogRead(A0);
  float celsius = 1 / (log(1 / (1023.0 / a - 1)) / BETA + 1.0 / 298.15) - 273.15;
  Serial.print(celsius); Serial.println(" C");
  digitalWrite(RED, celsius > 30);
  digitalWrite(BLUE, celsius < 15);
  delay(500);
}
`,
  },
  {
    key: "stepper", name: "Stepper motor", lesson: "YI-04 Stepper Motor Drawing Plotter", about: "Drive a stepper one step at a time with four pins.",
    parts: [U(0, 280), { id: "stepper1", type: "stepper", x: 40, y: 0, rot: 0 }],
    wires: [w("stepper1:A+", "uno1:11", R, [[145, 260], [144, 260]]), w("stepper1:A-", "uno1:10", K, [[135, 250], [154, 250]]), w("stepper1:B+", "uno1:9", G, [[154, 270], [163, 270]]), w("stepper1:B-", "uno1:8", B, [[164, 265], [173, 265]])],
    code: `// Full-step sequence: 200 steps = one turn
const int A1p = 11, A1m = 10, B1p = 9, B1m = 8;
const int seq[4][4] = {{1,0,0,0},{0,0,1,0},{0,1,0,0},{0,0,0,1}};

void setup() {
  pinMode(A1p, OUTPUT); pinMode(A1m, OUTPUT); pinMode(B1p, OUTPUT); pinMode(B1m, OUTPUT);
}

void step(int s) {
  digitalWrite(A1p, seq[s][0]); digitalWrite(A1m, seq[s][1]);
  digitalWrite(B1p, seq[s][2]); digitalWrite(B1m, seq[s][3]);
}

void loop() {
  for (int i = 0; i < 200; i++) { step(i % 4); delay(10); }   // one turn
  delay(1000);
}
`,
  },
];
