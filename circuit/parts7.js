/* Circuit Lab - part catalogue, round 5: the I2C boards that add pins, precision or servos. */
const P8 = (() => { const o = ["VCC", "GND", "SCL", "SDA"]; for (let i = 0; i < 8; i++) o.push("P" + i); return o.join(","); })();
const P23017 = (() => { const o = ["VCC", "GND", "SCL", "SDA"]; for (let i = 0; i < 8; i++) o.push("A" + i); for (let i = 0; i < 8; i++) o.push("B" + i); return o.join(","); })();
const P9685 = (() => { const o = ["VCC", "GND", "SCL", "SDA", "V+"]; for (let i = 0; i < 16; i++) o.push("CH" + i); return o.join(","); })();

export const PARTS7 = {
  /* ---------------- PCF8574 ---------------- */
  pcf8574: {
    tag: "cl-i2c", label: "Pin expander PCF8574", cat: "Logic & chips", kind: "module",
    attrs: { label: "PCF8574", sub: "0x20", pins: P8, color: "#2B4C7E", shape: "chip" },
    pw: { vcc: ["VCC"], gnd: ["GND"] }, i2c: { sda: "SDA", scl: "SCL", addr: 0x20 },
    kit: ["PCF8574 I2C pin expander"],
    help: "Eight more pins for the price of the two I2C wires, and you can hang eight of these on the same bus. Writing a 0 pulls a pin hard to ground; writing a 1 is only a weak pull-up, so a button can still pull that pin low and be read.",
    code: `// PCF8574: eight extra pins over two wires
#include <Wire.h>
#include <PCF8574.h>
PCF8574 expander(0x20);

void setup() {
  Serial.begin(9600);
  if (!expander.begin()) { Serial.println("PCF8574 not found: check SDA, SCL and power"); while (1) delay(10); }
  for (int i = 0; i < 8; i++) expander.pinMode(i, OUTPUT);
}

void loop() {
  for (int i = 0; i < 8; i++) {           // a light running along the expander
    expander.write8(1 << i);
    Serial.print("P"); Serial.print(i); Serial.println(" high");
    delay(200);
  }
  expander.write8(0x00); delay(300);
  expander.write8(0xFF); delay(300);
}
`,
  },

  /* ---------------- MCP23017 ---------------- */
  mcp23017: {
    tag: "cl-i2c", label: "Pin expander MCP23017", cat: "Logic & chips", kind: "module",
    attrs: { label: "MCP23017", sub: "0x20", pins: P23017, color: "#1F4F6B", shape: "chip" },
    pw: { vcc: ["VCC"], gnd: ["GND"] }, i2c: { sda: "SDA", scl: "SCL", addr: 0x20 },
    kit: ["MCP23017 I2C pin expander"],
    help: "Sixteen more pins over I2C, in two banks of eight called A and B. Unlike the PCF8574 these are proper push-pull outputs that drive high as hard as they drive low. The usual choice when one board has to run a lot of LEDs or buttons.",
    code: `// MCP23017: sixteen extra pins, A0-A7 and B0-B7
#include <Wire.h>
#include <Adafruit_MCP23X17.h>
Adafruit_MCP23X17 mcp;

void setup() {
  Serial.begin(9600);
  if (!mcp.begin_I2C(0x20)) { Serial.println("MCP23017 not found"); while (1) delay(10); }
  for (int i = 0; i < 16; i++) mcp.pinMode(i, OUTPUT);
}

void loop() {
  for (int i = 0; i < 16; i++) {
    mcp.writeGPIOAB(1 << i);
    Serial.print("pin "); Serial.print(i < 8 ? "A" : "B"); Serial.println(i % 8);
    delay(150);
  }
  mcp.writeGPIOAB(0xFFFF); delay(400);
  mcp.writeGPIOAB(0x0000); delay(400);
}
`,
  },

  /* ---------------- ADS1115 ---------------- */
  ads1115: {
    tag: "cl-i2c", label: "Precise ADC ADS1115", cat: "Sensors", kind: "module",
    attrs: { label: "ADS1115", sub: "0x48", pins: "VCC,GND,SCL,SDA,A0,A1,A2,A3", color: "#4B3A82", shape: "chip" },
    pw: { vcc: ["VCC"], gnd: ["GND"] }, i2c: { sda: "SDA", scl: "SCL", addr: 0x48 },
    kit: ["ADS1115 16-bit ADC"],
    help: "The Arduino's own analogue input splits 5 V into 1024 steps. This one splits it into about 32000, on four channels, and can measure voltages smaller than the Arduino can see at all. Essential for load cells, pH probes and battery monitoring.",
    code: `// ADS1115: analogue readings far finer than analogRead
#include <Wire.h>
#include <Adafruit_ADS1X15.h>
Adafruit_ADS1115 ads;

void setup() {
  Serial.begin(9600);
  if (!ads.begin()) { Serial.println("ADS1115 not found"); while (1) delay(10); }
}

void loop() {
  for (int ch = 0; ch < 4; ch++) {
    int16_t raw = ads.readADC_SingleEnded(ch);
    Serial.print("A"); Serial.print(ch); Serial.print(": ");
    Serial.print(raw); Serial.print(" = ");
    Serial.print(ads.computeVolts(raw), 4); Serial.print(" V   ");
  }
  Serial.println();
  delay(600);
}
`,
  },

  /* ---------------- MCP4725 ---------------- */
  mcp4725: {
    tag: "cl-i2c", label: "Analog out MCP4725", cat: "Logic & chips", kind: "module",
    attrs: { label: "MCP4725", sub: "0x60", pins: "VCC,GND,SCL,SDA,OUT", color: "#6B4F1E", shape: "chip" },
    pw: { vcc: ["VCC"], gnd: ["GND"] }, i2c: { sda: "SDA", scl: "SCL", addr: 0x60 },
    kit: ["MCP4725 DAC"],
    help: "analogWrite only switches a pin on and off quickly; this chip puts out a real steady voltage anywhere between 0 V and the supply, in 4096 steps. Use it to make a waveform, set a reference, or control something that expects a true analogue level.",
    code: `// MCP4725: a real analogue voltage, not a PWM impression of one
#include <Wire.h>
#include <Adafruit_MCP4725.h>
Adafruit_MCP4725 dac;

void setup() {
  Serial.begin(9600);
  dac.begin(0x60);
}

void loop() {
  for (int v = 0; v <= 4095; v += 512) {      // a staircase from 0 V to the supply
    dac.setVoltage(v, false);
    Serial.print("DAC "); Serial.print(v);
    Serial.print("  = "); Serial.print(v * 5.0 / 4095.0, 2); Serial.println(" V");
    delay(400);
  }
}
`,
  },

  /* ---------------- PCA9685 ---------------- */
  pca9685: {
    tag: "cl-i2c", label: "Servo driver PCA9685", cat: "Motion", kind: "module",
    attrs: { label: "PCA9685", sub: "50 Hz", pins: P9685, color: "#1E6B4F", shape: "chip" },
    pw: { vcc: ["VCC"], gnd: ["GND"] }, i2c: { sda: "SDA", scl: "SCL", addr: 0x40 },
    kit: ["PCA9685 16-channel servo driver", "External 5V supply for the servos"],
    help: "Runs sixteen servos from the two I2C wires, and generates the pulses itself so the Arduino is free to do other things. Feed the servos from V+ with their own supply, never from the board's 5 V pin, or the brownouts will drive you mad. Chain boards for 32 and more.",
    code: `// PCA9685: sixteen servos from two wires. The board makes the pulses, not the Arduino.
#include <Wire.h>
#include <Adafruit_PWMServoDriver.h>
Adafruit_PWMServoDriver pwm = Adafruit_PWMServoDriver(0x40);

// At 50 Hz the period is 20 ms, so one count out of 4096 is 4.88 us.
const int SERVO_MIN = 102;   // 102 x 4.88 us = 0.5 ms
const int SERVO_MAX = 512;   // 512 x 4.88 us = 2.5 ms

int angleToCount(int deg) { return map(deg, 0, 180, SERVO_MIN, SERVO_MAX); }

void setup() {
  Serial.begin(9600);
  pwm.begin();
  pwm.setPWMFreq(50);        // servos want 50 Hz
}

void loop() {
  for (int deg = 0; deg <= 180; deg += 30) {
    pwm.setPWM(0, 0, angleToCount(deg));      // channel 0
    pwm.setPWM(1, 0, angleToCount(180 - deg));// channel 1 goes the other way
    Serial.print("channel 0 -> "); Serial.print(deg);
    Serial.print(" deg, channel 1 -> "); Serial.println(180 - deg);
    delay(500);
  }
}
`,
  },
};
