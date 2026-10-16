/* Circuit Lab - part catalogue, round 6: the motor drivers people actually buy now, and sound. */
export const PARTS8 = {
  /* ---------------- TB6612FNG ---------------- */
  tb6612: {
    tag: "cl-i2c", label: "Motor driver TB6612", cat: "Motion", kind: "module",
    attrs: { label: "TB6612", sub: "dual H", color: "#24405C", shape: "chip",
      pins: "VM,VCC,GND,STBY,AIN1,AIN2,PWMA,AO1,AO2,BIN1,BIN2,PWMB,BO1,BO2" },
    pw: { vcc: ["VCC"], gnd: ["GND"] },
    kit: ["TB6612FNG motor driver"],
    help: "The modern replacement for the L298N. It wastes far less of the battery as heat, so the motors actually get the voltage you paid for, and it is much smaller. Remember STBY: tie it high or the chip stays asleep and you will think it is broken.",
    defaults: { PWMA: 5, AIN1: 7, AIN2: 8, STBY: 4, PWMB: 6, BIN1: 9, BIN2: 10 },
    defaultsEsp: { PWMA: 25, AIN1: 26, AIN2: 27, STBY: 14, PWMB: 33, BIN1: 32, BIN2: 13 },
    code: `// TB6612: two motors, far less heat than an L298N
const int PWMA = {PWMA}, AIN1 = {AIN1}, AIN2 = {AIN2};
const int PWMB = {PWMB}, BIN1 = {BIN1}, BIN2 = {BIN2};
const int STBY = {STBY};        // low means the chip sleeps and nothing moves

void motorA(int speed) {        // -255 to 255
  digitalWrite(AIN1, speed >= 0); digitalWrite(AIN2, speed < 0);
  analogWrite(PWMA, abs(speed));
}
void motorB(int speed) {
  digitalWrite(BIN1, speed >= 0); digitalWrite(BIN2, speed < 0);
  analogWrite(PWMB, abs(speed));
}

void setup() {
  int pins[] = { PWMA, AIN1, AIN2, PWMB, BIN1, BIN2, STBY };
  for (int i = 0; i < 7; i++) pinMode(pins[i], OUTPUT);
  digitalWrite(STBY, HIGH);     // wake the driver up
  Serial.begin(9600);
}

void loop() {
  Serial.println("forward");  motorA(200);  motorB(200);  delay(1200);
  Serial.println("spin");     motorA(200);  motorB(-200); delay(1200);
  Serial.println("stop");     motorA(0);    motorB(0);    delay(800);
}
`,
  },

  /* ---------------- DRV8833 ---------------- */
  drv8833: {
    tag: "cl-i2c", label: "Motor driver DRV8833", cat: "Motion", kind: "module",
    attrs: { label: "DRV8833", sub: "dual H", color: "#3A2A52", shape: "chip",
      pins: "VM,GND,SLP,AIN1,AIN2,AOUT1,AOUT2,BIN1,BIN2,BOUT1,BOUT2" },
    pw: { vcc: ["VM"], gnd: ["GND"] },
    kit: ["DRV8833 motor driver"],
    help: "A tiny dual driver for small robots, happy from 2.7 V so it runs straight off two AA cells. It has no separate speed pin: you send the PWM to one input and hold the other low, and swapping which one carries the PWM reverses the motor.",
    defaults: { AIN1: 5, AIN2: 6, BIN1: 9, BIN2: 10, SLP: 4 },
    defaultsEsp: { AIN1: 25, AIN2: 26, BIN1: 32, BIN2: 33, SLP: 14 },
    code: `// DRV8833: the PWM goes on the input pins themselves, not a separate one
const int AIN1 = {AIN1}, AIN2 = {AIN2};
const int BIN1 = {BIN1}, BIN2 = {BIN2};
const int SLP = {SLP};          // hold high to keep the driver awake

void motorA(int speed) {
  if (speed >= 0) { analogWrite(AIN1, speed);      digitalWrite(AIN2, LOW); }
  else            { digitalWrite(AIN1, LOW);       analogWrite(AIN2, -speed); }
}
void motorB(int speed) {
  if (speed >= 0) { analogWrite(BIN1, speed);      digitalWrite(BIN2, LOW); }
  else            { digitalWrite(BIN1, LOW);       analogWrite(BIN2, -speed); }
}

void setup() {
  int pins[] = { AIN1, AIN2, BIN1, BIN2, SLP };
  for (int i = 0; i < 5; i++) pinMode(pins[i], OUTPUT);
  digitalWrite(SLP, HIGH);
  Serial.begin(9600);
}

void loop() {
  Serial.println("both forward"); motorA(220); motorB(220); delay(1200);
  Serial.println("turn");         motorA(220); motorB(-220); delay(1200);
  Serial.println("coast");        motorA(0);   motorB(0);   delay(800);
}
`,
  },

  /* ---------------- DFPlayer Mini ---------------- */
  dfplayer: {
    tag: "cl-i2c", label: "MP3 player DFPlayer", cat: "Light & sound", kind: "module",
    attrs: { label: "DFPlayer", sub: "idle", color: "#1E3A5F", shape: "chip",
      pins: "VCC,GND,RX,TX,SPK1,SPK2,BUSY" },
    pw: { vcc: ["VCC"], gnd: ["GND"] },
    sim: { tracks: 8 },
    props: [{ k: "tracks", label: "Tracks on the card", type: "range", min: 1, max: 30, step: 1, sim: true, live: true }],
    kit: ["DFPlayer Mini MP3 module", "microSD card", "Small speaker 8 ohm", "1k resistor (for RX)"],
    help: "Plays MP3 files from a microSD card and drives a small speaker directly, so a project can talk or play an alarm without the Arduino doing any audio work. Put a 1 kΩ resistor in the RX line: the module is 3.3 V and the noise otherwise makes it skip.",
    defaults: { TX: 10, RX: 11 }, defaultsEsp: { TX: 16, RX: 17 },
    code: `// DFPlayer Mini: the module does the audio, the Arduino just asks
#include <SoftwareSerial.h>
#include <DFRobotDFPlayerMini.h>
SoftwareSerial mp3Serial({TX}, {RX});   // module TX -> this pin, module RX <- this pin
DFRobotDFPlayerMini player;

void setup() {
  Serial.begin(9600);
  mp3Serial.begin(9600);
  if (!player.begin(mp3Serial)) { Serial.println("DFPlayer not found: check wiring, power and the SD card"); while (1) delay(10); }
  player.volume(22);                    // 0 to 30
  Serial.print("tracks on the card: "); Serial.println(player.readFileCounts());
}

void loop() {
  for (int t = 1; t <= 3; t++) {
    Serial.print("playing track "); Serial.println(t);
    player.play(t);
    delay(2000);
  }
  player.pause();
  Serial.println("paused");
  delay(1500);
}
`,
  },
};
