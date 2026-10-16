/* Circuit Lab - part catalogue, round 4: the newer I2C and SPI sensor modules. */
const v = (k, label, min, max, unit = "", step = 1) => ({ k, label, type: "range", min, max, step, unit, sim: true, live: true });

export const PARTS6 = {
  /* ---------------- AHT20 ---------------- */
  aht20: {
    tag: "cl-i2c", label: "Temp & humidity AHT20", cat: "Sensors", kind: "module",
    attrs: { label: "AHT20", sub: "0x38", pins: "VCC,GND,SCL,SDA", color: "#1F6F54", shape: "chip" },
    pw: { vcc: ["VCC"], gnd: ["GND"] }, i2c: { sda: "SDA", scl: "SCL", addr: 0x38 },
    sim: { temp: 25, hum: 55 }, props: [v("temp", "Temperature", -20, 70, " °C", 0.1), v("hum", "Humidity", 0, 100, " %")],
    kit: ["AHT20 temperature and humidity sensor"],
    help: "The sensor that replaced the DHT11 in most kits. Same two readings but over I2C, so it shares SDA and SCL with everything else instead of needing its own pin.",
    code: `// AHT20: temperature and humidity over I2C
#include <Wire.h>
#include <Adafruit_AHTX0.h>
Adafruit_AHTX0 aht;

void setup() {
  Serial.begin(9600);
  if (!aht.begin()) { Serial.println("AHT20 not found: check SDA, SCL and power"); while (1) delay(10); }
}

void loop() {
  sensors_event_t hum, temp;
  aht.getEvent(&hum, &temp);
  Serial.print(temp.temperature, 1); Serial.print(" C, ");
  Serial.print(hum.relative_humidity, 1); Serial.println(" %");
  delay(1000);
}
`,
  },

  /* ---------------- SGP30 ---------------- */
  sgp30: {
    tag: "cl-i2c", label: "Air quality SGP30", cat: "Sensors", kind: "module",
    attrs: { label: "SGP30", sub: "0x58", pins: "VCC,GND,SCL,SDA", color: "#2F5E8C", shape: "chip" },
    pw: { vcc: ["VCC"], gnd: ["GND"] }, i2c: { sda: "SDA", scl: "SCL", addr: 0x58 },
    sim: { eco2: 420, tvoc: 25 }, props: [v("eco2", "eCO2", 400, 5000, " ppm", 10), v("tvoc", "TVOC", 0, 1200, " ppb", 5)],
    kit: ["SGP30 air quality sensor"],
    help: "Measures the smelly organic gases people and cleaning products give off, and estimates a CO2 figure from them. Good for a classroom air monitor. Note the CO2 reading is an estimate, not a real CO2 measurement.",
    code: `// SGP30: indoor air quality
#include <Wire.h>
#include <Adafruit_SGP30.h>
Adafruit_SGP30 sgp;

void setup() {
  Serial.begin(9600);
  if (!sgp.begin()) { Serial.println("SGP30 not found"); while (1) delay(10); }
}

void loop() {
  if (sgp.IAQmeasure()) {
    Serial.print("eCO2 "); Serial.print(sgp.eCO2); Serial.print(" ppm, TVOC ");
    Serial.print(sgp.TVOC); Serial.println(" ppb");
    if (sgp.eCO2 > 1000) Serial.println("  stuffy: open a window");
  }
  delay(1000);
}
`,
  },

  /* ---------------- CCS811 ---------------- */
  ccs811: {
    tag: "cl-i2c", label: "Air quality CCS811", cat: "Sensors", kind: "module",
    attrs: { label: "CCS811", sub: "0x5A", pins: "VCC,GND,SCL,SDA", color: "#7A3A1E", shape: "chip" },
    pw: { vcc: ["VCC"], gnd: ["GND"] }, i2c: { sda: "SDA", scl: "SCL", addr: 0x5A },
    sim: { eco2: 450, tvoc: 30 }, props: [v("eco2", "eCO2", 400, 8000, " ppm", 10), v("tvoc", "TVOC", 0, 1200, " ppb", 5)],
    kit: ["CCS811 air quality sensor"],
    help: "Another eCO2 and TVOC sensor. It needs about twenty minutes of warm-up before the numbers settle, which is a useful thing for students to discover and design around.",
    code: `// CCS811: eCO2 and TVOC
#include <Wire.h>
#include <Adafruit_CCS811.h>
Adafruit_CCS811 ccs;

void setup() {
  Serial.begin(9600);
  if (!ccs.begin()) { Serial.println("CCS811 not found"); while (1) delay(10); }
}

void loop() {
  if (ccs.available() && !ccs.readData()) {
    Serial.print("eCO2 "); Serial.print(ccs.geteCO2()); Serial.print(" ppm, TVOC ");
    Serial.print(ccs.getTVOC()); Serial.println(" ppb");
  }
  delay(1000);
}
`,
  },

  /* ---------------- SCD40 ---------------- */
  scd40: {
    tag: "cl-i2c", label: "True CO2 SCD40", cat: "Sensors", kind: "module",
    attrs: { label: "SCD40", sub: "0x62", pins: "VCC,GND,SCL,SDA", color: "#1E5B4F", shape: "chip" },
    pw: { vcc: ["VCC"], gnd: ["GND"] }, i2c: { sda: "SDA", scl: "SCL", addr: 0x62 },
    sim: { co2: 600, temp: 24, hum: 50 },
    props: [v("co2", "CO2", 400, 5000, " ppm", 10), v("temp", "Temperature", -10, 60, " °C", 0.1), v("hum", "Humidity", 0, 100, " %")],
    kit: ["SCD40 CO2 sensor"],
    help: "Measures carbon dioxide for real, by shining infrared through the air, rather than guessing it from other gases. This is the one to use if the project claims to measure CO2. It reports temperature and humidity too.",
    code: `// SCD40: real CO2, plus temperature and humidity
#include <Wire.h>
#include <SensirionI2CScd4x.h>
SensirionI2CScd4x scd4x;

void setup() {
  Serial.begin(9600);
  Wire.begin();
  scd4x.begin(Wire);
  scd4x.startPeriodicMeasurement();
}

void loop() {
  uint16_t co2; float t, rh;
  if (scd4x.readMeasurement(co2, t, rh) == 0 && co2 != 0) {
    Serial.print("CO2 "); Serial.print(co2); Serial.print(" ppm, ");
    Serial.print(t, 1); Serial.print(" C, "); Serial.print(rh, 1); Serial.println(" %");
    if (co2 > 1400) Serial.println("  ventilate the room");
  }
  delay(1500);
}
`,
  },

  /* ---------------- MAX30102 ---------------- */
  max30102: {
    tag: "cl-i2c", label: "Heart rate MAX30102", cat: "Sensors", kind: "module",
    attrs: { label: "MAX30102", sub: "0x57", pins: "VCC,GND,SCL,SDA", color: "#8C1F3A", shape: "chip" },
    pw: { vcc: ["VCC"], gnd: ["GND"] }, i2c: { sda: "SDA", scl: "SCL", addr: 0x57 },
    sim: { bpm: 72, spo2: 98 }, props: [v("bpm", "Heart rate", 40, 180, " bpm"), v("spo2", "Blood oxygen", 85, 100, " %")],
    kit: ["MAX30102 pulse oximeter"],
    help: "Shines red and infrared light through a fingertip and works out the pulse and the blood oxygen from how much comes back. A project sensor, not a medical instrument, and worth saying so out loud in a demo.",
    code: `// MAX30102: pulse and blood oxygen from a fingertip
#include <Wire.h>
#include <MAX30105.h>
MAX30105 sensor;

void setup() {
  Serial.begin(9600);
  if (!sensor.begin()) { Serial.println("MAX30102 not found"); while (1) delay(10); }
  sensor.setup();
}

void loop() {
  Serial.print("pulse "); Serial.print(sensor.getHeartRate());
  Serial.print(" bpm, SpO2 "); Serial.print(sensor.getSpO2()); Serial.println(" %");
  Serial.println("  (a project sensor, not a medical one)");
  delay(1000);
}
`,
  },

  /* ---------------- AMG8833 ---------------- */
  amg8833: {
    tag: "cl-i2c", label: "Thermal camera AMG8833", cat: "Sensors", kind: "module",
    attrs: { label: "AMG8833", sub: "0x69", pins: "VCC,GND,SCL,SDA", color: "#5C2E82", shape: "chip" },
    pw: { vcc: ["VCC"], gnd: ["GND"] }, i2c: { sda: "SDA", scl: "SCL", addr: 0x69 },
    sim: { ambient: 22, hot: 34, hx: 4, hy: 4 },
    props: [v("ambient", "Room temperature", 0, 40, " °C", 0.5), v("hot", "Warm spot", 20, 80, " °C", 0.5),
            v("hx", "Warm spot across", 0, 7, ""), v("hy", "Warm spot down", 0, 7, "")],
    kit: ["AMG8833 thermal camera"],
    help: "An eight by eight grid of thermometers that sees heat instead of light. Sixty four readings is a very low resolution picture, but it is enough to find a person in a dark room.",
    code: `// AMG8833: an 8x8 picture made of temperatures
#include <Wire.h>
#include <Adafruit_AMG88xx.h>
Adafruit_AMG88xx amg;
float pixels[64];

void setup() {
  Serial.begin(9600);
  if (!amg.begin()) { Serial.println("AMG8833 not found"); while (1) delay(10); }
}

void loop() {
  amg.readPixels(pixels);
  float hottest = -100; int where = 0;
  for (int i = 0; i < 64; i++) if (pixels[i] > hottest) { hottest = pixels[i]; where = i; }
  for (int y = 0; y < 8; y++) {                 // draw it in characters
    for (int x = 0; x < 8; x++) {
      float t = pixels[y * 8 + x];
      Serial.print(t > hottest - 2 ? "#" : t > hottest - 6 ? "+" : ".");
    }
    Serial.println();
  }
  Serial.print("hottest "); Serial.print(hottest, 1);
  Serial.print(" C at column "); Serial.print(where % 8);
  Serial.print(", row "); Serial.println(where / 8);
  Serial.println("---");
  delay(1200);
}
`,
  },

  /* ---------------- MH-Z19 ---------------- */
  mhz19: {
    tag: "cl-i2c", label: "CO2 sensor MH-Z19", cat: "Sensors", kind: "module",
    attrs: { label: "MH-Z19B", sub: "UART", pins: "VCC,GND,TX,RX", color: "#1C1C20", shape: "chip" },
    pw: { vcc: ["VCC"], gnd: ["GND"] },
    sim: { co2: 700, temp: 25 }, props: [v("co2", "CO2", 400, 5000, " ppm", 10), v("temp", "Temperature", 0, 50, " °C")],
    kit: ["MH-Z19B CO2 sensor"],
    help: "An infrared CO2 sensor that talks over a serial port rather than I2C, so give it two spare pins through SoftwareSerial. It needs 5 V and a few minutes to warm up.",
    defaults: { TX: 10, RX: 11 }, defaultsEsp: { TX: 16, RX: 17 },
    code: `// MH-Z19: CO2 over a serial port
#include <SoftwareSerial.h>
#include <MHZ19.h>
SoftwareSerial co2Serial({TX}, {RX});    // module TX -> this pin, module RX <- this pin
MHZ19 mhz;

void setup() {
  Serial.begin(9600);
  co2Serial.begin(9600);
  mhz.begin(co2Serial);
}

void loop() {
  int co2 = mhz.getCO2();
  Serial.print("CO2 "); Serial.print(co2); Serial.print(" ppm, ");
  Serial.print(mhz.getTemperature()); Serial.println(" C");
  if (co2 > 1200) Serial.println("  air is getting stale");
  delay(2000);
}
`,
  },

  /* ---------------- MAX6675 ---------------- */
  max6675: {
    tag: "cl-i2c", label: "Thermocouple MAX6675", cat: "Sensors", kind: "module",
    attrs: { label: "MAX6675", sub: "SPI", pins: "VCC,GND,SCK,CS,SO", color: "#7A6A1E", shape: "chip" },
    pw: { vcc: ["VCC"], gnd: ["GND"] },
    sim: { temp: 180 }, props: [v("temp", "Probe temperature", 0, 1000, " °C", 1)],
    kit: ["MAX6675 thermocouple amplifier", "K-type thermocouple probe"],
    help: "Reads a K-type thermocouple, so it handles temperatures a normal sensor would be destroyed by: up to about 1000 °C. This is the one for a kiln, a reflow plate or an engine.",
    defaults: { SCK: 13, CS: 10, SO: 12 }, defaultsEsp: { SCK: 18, CS: 5, SO: 19 },
    code: `// MAX6675: temperatures far beyond what a normal sensor survives
#include <max6675.h>
MAX6675 probe({SCK}, {CS}, {SO});

void setup() { Serial.begin(9600); }

void loop() {
  float c = probe.readCelsius();
  Serial.print(c, 1); Serial.print(" C  /  ");
  Serial.print(probe.readFahrenheit(), 1); Serial.println(" F");
  if (c > 300) Serial.println("  hot enough to glow");
  delay(1000);          // the chip needs about 250 ms between reads
}
`,
  },
};
