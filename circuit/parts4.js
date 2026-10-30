/* Circuit Lab - part catalogue, round 3: I2C, SPI and serial modules. */
import "./elements4.js?v=22";

const v = (k, label, min, max, unit = "", step = 1) => ({ k, label, type: "range", min, max, step, unit, sim: true, live: true });

export const PARTS4 = {
  /* ---------------- real-time clock ---------------- */
  rtc: {
    tag: "wokwi-ds1307", label: "Real-time clock DS3231", cat: "Sensors", kind: "module",
    pw: { vcc: ["5V"], gnd: ["GND"] }, i2c: { sda: "SDA", scl: "SCL", addr: 0x68 },
    sim: { source: "computer clock", offset: 0 },
    props: [{ k: "source", label: "Clock", type: "select", opts: ["computer clock", "fixed: 2026-01-01 09:00"], sim: true, live: true }],
    kit: ["RTC module DS3231"],
    help: "A clock with its own battery, so the time survives a power cut. Talks I2C at address 0x68 and keeps running for years on one coin cell. The DS3231 also reports its own temperature.",
    code: `// Read the time from a DS3231
#include <Wire.h>
#include <RTClib.h>
RTC_DS3231 rtc;

void setup() {
  Serial.begin(9600);
  Wire.begin();
  if (!rtc.begin()) { Serial.println("Clock not found - check SDA and SCL"); while (1) delay(10); }
}

void loop() {
  DateTime now = rtc.now();
  Serial.print(now.year()); Serial.print('-');
  if (now.month() < 10) Serial.print('0'); Serial.print(now.month()); Serial.print('-');
  if (now.day() < 10) Serial.print('0'); Serial.print(now.day()); Serial.print("  ");
  if (now.hour() < 10) Serial.print('0'); Serial.print(now.hour()); Serial.print(':');
  if (now.minute() < 10) Serial.print('0'); Serial.print(now.minute()); Serial.print(':');
  if (now.second() < 10) Serial.print('0'); Serial.println(now.second());
  delay(1000);
}
`,
  },

  /* ---------------- I2C sensors ---------------- */
  bmp280: {
    tag: "cl-i2c", label: "Pressure BMP280", cat: "Sensors", kind: "module",
    attrs: { label: "BMP280", sub: "0x76", pins: "VCC,GND,SCL,SDA", color: "#4A2A82", shape: "chip" },
    pw: { vcc: ["VCC"], gnd: ["GND"] }, i2c: { sda: "SDA", scl: "SCL", addr: 0x76 },
    sim: { temp: 26, hpa: 1008 }, props: [v("temp", "Temperature", -20, 60, " °C"), v("hpa", "Air pressure", 900, 1060, " hPa")],
    kit: ["BMP280 pressure sensor"],
    help: "Measures air pressure accurately enough to tell which floor of a building you are on. Pressure also forecasts weather: falling means rain is coming.",
    code: `// BMP280: temperature, pressure and height above sea level
#include <Wire.h>
#include <Adafruit_BMP280.h>
Adafruit_BMP280 bmp;

void setup() {
  Serial.begin(9600);
  if (!bmp.begin(0x76)) { Serial.println("BMP280 not found"); while (1) delay(10); }
}

void loop() {
  Serial.print(bmp.readTemperature(), 1); Serial.print(" C, ");
  Serial.print(bmp.readPressure() / 100.0, 1); Serial.print(" hPa, ");
  Serial.print(bmp.readAltitude(1013.25), 1); Serial.println(" m");
  delay(1200);
}
`,
  },
  bme280: {
    tag: "cl-i2c", label: "Weather sensor BME280", cat: "Sensors", kind: "module",
    attrs: { label: "BME280", sub: "0x76", pins: "VCC,GND,SCL,SDA", color: "#2A4A82", shape: "chip" },
    pw: { vcc: ["VCC"], gnd: ["GND"] }, i2c: { sda: "SDA", scl: "SCL", addr: 0x76 },
    sim: { temp: 26, hpa: 1008, hum: 55 }, props: [v("temp", "Temperature", -20, 60, " °C"), v("hum", "Humidity", 0, 100, " %"), v("hpa", "Air pressure", 900, 1060, " hPa")],
    kit: ["BME280 weather sensor"],
    help: "Three weather measurements in one chip: temperature, humidity and pressure. More accurate and much faster than a DHT22.",
    code: `// BME280 weather station in one chip
#include <Wire.h>
#include <Adafruit_BME280.h>
Adafruit_BME280 bme;

void setup() {
  Serial.begin(9600);
  if (!bme.begin(0x76)) { Serial.println("BME280 not found"); while (1) delay(10); }
}

void loop() {
  Serial.print(bme.readTemperature(), 1); Serial.print(" C, ");
  Serial.print(bme.readHumidity(), 0); Serial.print(" %, ");
  Serial.print(bme.readPressure() / 100.0, 1); Serial.println(" hPa");
  delay(1500);
}
`,
  },
  bh1750: {
    tag: "cl-i2c", label: "Light meter BH1750", cat: "Sensors", kind: "module",
    attrs: { label: "BH1750", sub: "0x23", pins: "VCC,GND,SCL,SDA,ADDR", color: "#1F6B57", shape: "dome" },
    pw: { vcc: ["VCC"], gnd: ["GND"] }, i2c: { sda: "SDA", scl: "SCL", addr: 0x23 },
    sim: { lux: 300 }, props: [v("lux", "Light", 0, 10000, " lux", 10)],
    kit: ["Light sensor BH1750"],
    help: "Reads light in real lux, unlike an LDR which just gives a voltage. A classroom is about 400 lux, bright daylight 10,000.",
    code: `// BH1750: light level in lux
#include <Wire.h>
#include <BH1750.h>
BH1750 meter;

void setup() {
  Serial.begin(9600);
  Wire.begin();
  meter.begin();
}

void loop() {
  float lux = meter.readLightLevel();
  Serial.print(lux, 0);
  Serial.print(" lux - ");
  if (lux < 50) Serial.println("dark, switch the lights on");
  else if (lux < 500) Serial.println("indoors");
  else Serial.println("bright");
  delay(900);
}
`,
  },
  mlx90614: {
    tag: "cl-i2c", label: "Infrared thermometer MLX90614", cat: "Sensors", kind: "module",
    attrs: { label: "MLX90614", sub: "0x5A", pins: "VCC,GND,SCL,SDA", color: "#7A2A4A", shape: "dome" },
    pw: { vcc: ["VCC"], gnd: ["GND"] }, i2c: { sda: "SDA", scl: "SCL", addr: 0x5a },
    sim: { object: 36.6, ambient: 24 }, props: [v("object", "Object temperature", 0, 120, " °C", 0.1), v("ambient", "Room temperature", 0, 50, " °C", 0.5)],
    kit: ["MLX90614 infrared thermometer"],
    help: "Measures temperature without touching, the way a forehead thermometer does. It reads the infrared glow of whatever it points at.",
    code: `// No-contact thermometer
#include <Wire.h>
#include <Adafruit_MLX90614.h>
Adafruit_MLX90614 mlx;

void setup() {
  Serial.begin(9600);
  mlx.begin();
}

void loop() {
  float obj = mlx.readObjectTempC();
  Serial.print("Object ");
  Serial.print(obj, 1);
  Serial.print(" C, room ");
  Serial.print(mlx.readAmbientTempC(), 1);
  Serial.println(" C");
  if (obj > 37.8) Serial.println("  High temperature!");
  delay(1000);
}
`,
  },
  vl53l0x: {
    tag: "cl-i2c", label: "Laser distance VL53L0X", cat: "Sensors", kind: "module",
    attrs: { label: "VL53L0X", sub: "0x29", pins: "VCC,GND,SCL,SDA,XSH", color: "#2A2A32", shape: "lens" },
    pw: { vcc: ["VCC"], gnd: ["GND"] }, i2c: { sda: "SDA", scl: "SCL", addr: 0x29 },
    sim: { mm: 350 }, props: [v("mm", "Distance", 20, 2000, " mm", 10)],
    kit: ["Laser distance sensor VL53L0X"],
    help: "Times a laser pulse there and back. Accurate to a few millimetres and unbothered by soft or thin objects, unlike ultrasound.",
    code: `// Laser time-of-flight distance
#include <Wire.h>
#include <VL53L0X.h>
VL53L0X sensor;

void setup() {
  Serial.begin(9600);
  Wire.begin();
  sensor.init();
  sensor.setTimeout(500);
}

void loop() {
  int mm = sensor.readRangeSingleMillimeters();
  Serial.print(mm);
  Serial.println(" mm");
  delay(300);
}
`,
  },
  adxl345: {
    tag: "cl-i2c", label: "Accelerometer ADXL345", cat: "Sensors", kind: "module",
    attrs: { label: "ADXL345", sub: "0x53", pins: "VCC,GND,SCL,SDA,CS,INT", color: "#2A4A32", shape: "chip" },
    pw: { vcc: ["VCC"], gnd: ["GND"] }, i2c: { sda: "SDA", scl: "SCL", addr: 0x53 },
    sim: { ax: 0, ay: 0, az: 9.8 }, props: [v("ax", "Tilt X", -20, 20, " m/s²", 0.1), v("ay", "Tilt Y", -20, 20, " m/s²", 0.1), v("az", "Up/down Z", -20, 20, " m/s²", 0.1)],
    kit: ["Accelerometer ADXL345"],
    help: "Feels gravity and movement in three directions. Tilt it and the numbers change: that is how a phone knows which way up it is.",
    code: `// ADXL345: tilt and movement
#include <Wire.h>
#include <ADXL345.h>
ADXL345 accel;

void setup() {
  Serial.begin(9600);
  accel.begin();
}

void loop() {
  float x = accel.getX(), y = accel.getY(), z = accel.getZ();
  Serial.print("x "); Serial.print(x, 2);
  Serial.print("  y "); Serial.print(y, 2);
  Serial.print("  z "); Serial.println(z, 2);
  if (sqrt(x * x + y * y + z * z) > 20) Serial.println("  Shake detected!");
  delay(400);
}
`,
  },
  compass: {
    tag: "cl-i2c", label: "Compass HMC5883L", cat: "Sensors", kind: "module",
    attrs: { label: "HMC5883L", sub: "0x1E", pins: "VCC,GND,SCL,SDA,DRDY", color: "#4A3A82", shape: "chip" },
    pw: { vcc: ["VCC"], gnd: ["GND"] }, i2c: { sda: "SDA", scl: "SCL", addr: 0x1e },
    sim: { heading: 90 }, props: [v("heading", "Direction the board faces", 0, 359, " °")],
    kit: ["Compass HMC5883L"],
    help: "Measures the Earth's magnetic field and works out which way is north. Keep it away from motors and speakers: their magnets confuse it.",
    code: `// Digital compass
#include <Wire.h>
#include <HMC5883L.h>
HMC5883L compass;

const char* NAMES[8] = { "N", "NE", "E", "SE", "S", "SW", "W", "NW" };

void setup() {
  Serial.begin(9600);
  compass.begin();
}

void loop() {
  float deg = compass.getHeadingDegrees();
  int sector = (int)((deg + 22.5) / 45) % 8;
  Serial.print(deg, 0);
  Serial.print(" degrees - ");
  Serial.println(NAMES[sector]);
  delay(500);
}
`,
  },
  sht31: {
    tag: "cl-i2c", label: "Temp & humidity SHT31", cat: "Sensors", kind: "module",
    attrs: { label: "SHT31", sub: "0x44", pins: "VCC,GND,SCL,SDA", color: "#1F57A8", shape: "chip" },
    pw: { vcc: ["VCC"], gnd: ["GND"] }, i2c: { sda: "SDA", scl: "SCL", addr: 0x44 },
    sim: { temp: 26, hum: 55 }, props: [v("temp", "Temperature", -20, 80, " °C", 0.1), v("hum", "Humidity", 0, 100, " %")],
    kit: ["SHT31 temperature and humidity sensor"],
    help: "A laboratory-grade replacement for the DHT22: accurate to 0.2 °C, reads in milliseconds and never misses.",
    code: `// SHT31 temperature and humidity
#include <Wire.h>
#include <Adafruit_SHT31.h>
Adafruit_SHT31 sht;

void setup() {
  Serial.begin(9600);
  if (!sht.begin(0x44)) { Serial.println("SHT31 not found"); while (1) delay(10); }
}

void loop() {
  Serial.print(sht.readTemperature(), 1); Serial.print(" C, ");
  Serial.print(sht.readHumidity(), 1); Serial.println(" %");
  delay(1000);
}
`,
  },

  /* ---------------- one-wire temperature ---------------- */
  ds18b20: {
    tag: "cl-ds18b20", label: "Temperature probe DS18B20", cat: "Sensors", kind: "module",
    pw: { vcc: ["VCC"], gnd: ["GND"] }, sim: { temp: 24 }, props: [v("temp", "Temperature", -40, 110, " °C", 0.1)],
    kit: ["Waterproof temperature probe DS18B20"],
    help: "A waterproof digital thermometer on a single wire. Several probes can share one pin because each has its own serial number. Needs a 4.7 kΩ resistor from the data wire to VCC.",
    defaults: { DQ: 2 }, defaultsEsp: { DQ: 27 },
    code: `// DS18B20 waterproof temperature probe
#include <OneWire.h>
#include <DallasTemperature.h>
OneWire wire({DQ});
DallasTemperature sensors(&wire);

void setup() {
  Serial.begin(9600);
  sensors.begin();
  Serial.print("Probes found: ");
  Serial.println(sensors.getDeviceCount());
}

void loop() {
  sensors.requestTemperatures();
  float c = sensors.getTempCByIndex(0);
  Serial.print(c, 2);
  Serial.println(" C");
  delay(1000);
}
`,
  },

  /* ---------------- storage ---------------- */
  sdcard: {
    tag: "wokwi-microsd-card", label: "SD card module", cat: "Communication", kind: "module",
    pw: { vcc: ["VCC"], gnd: ["GND"] }, kit: ["Micro SD card module", "Micro SD card 8 GB"],
    help: "Saves readings to a file so you can open them in Excel later. Talks SPI; CS can be any pin. The simulator gives you a pretend card you can read back in the same sketch, and shows the files it holds.",
    defaults: { CS: 10 }, defaultsEsp: { CS: 5 },
    code: `// Data logger: write readings to a file on the card
#include <SPI.h>
#include <SD.h>
const int CS = {CS};

void setup() {
  Serial.begin(9600);
  if (!SD.begin(CS)) { Serial.println("Card not found - check CS and power"); while (1) delay(10); }
  Serial.println("Card ready");
  File f = SD.open("log.csv", FILE_WRITE);
  if (f) { f.println("time_s,reading"); f.close(); }
}

void loop() {
  int reading = analogRead(A0);
  File f = SD.open("log.csv", FILE_WRITE);
  if (f) {
    f.print(millis() / 1000); f.print(","); f.println(reading);
    f.close();
    Serial.print("Saved "); Serial.println(reading);
  }
  delay(2000);
}
`,
  },

  /* ---------------- radio and phone ---------------- */
  gps: {
    tag: "cl-gps", label: "GPS module NEO-6M", cat: "Communication", kind: "module",
    pw: { vcc: ["VCC"], gnd: ["GND"] }, sim: { lat: 33.6844, lon: 73.0479, sats: 9, speed: 0 },
    props: [v("lat", "Latitude", -90, 90, " °", 0.0001), v("lon", "Longitude", -180, 180, " °", 0.0001), v("sats", "Satellites", 0, 12), v("speed", "Speed", 0, 120, " km/h")],
    kit: ["GPS module NEO-6M"],
    help: "Listens to satellites and sends your position down a serial wire as plain text. It needs a clear view of the sky, so it will not work indoors.",
    defaults: { TX: 4, RX: 3 }, defaultsEsp: { TX: 16, RX: 17 },
    code: `// GPS: read the position
#include <SoftwareSerial.h>
#include <TinyGPSPlus.h>
SoftwareSerial gpsPort({TX}, {RX});   // module TX -> this pin
TinyGPSPlus gps;

void setup() {
  Serial.begin(9600);
  gpsPort.begin(9600);
  Serial.println("Waiting for satellites...");
}

void loop() {
  while (gpsPort.available()) gps.encode(gpsPort.read());
  if (gps.location.isUpdated()) {
    Serial.print("Lat "); Serial.print(gps.location.lat(), 6);
    Serial.print("  Lon "); Serial.print(gps.location.lng(), 6);
    Serial.print("  satellites "); Serial.println(gps.satellites.value());
  }
}
`,
  },
  sim800l: {
    tag: "cl-sim800", label: "GSM module SIM800L", cat: "Communication", kind: "module",
    pw: { vcc: ["VCC"], gnd: ["GND"] }, kit: ["GSM module SIM800L"],
    help: "A mobile phone without a screen: it can send a text message when your alarm goes off. Messages it sends appear in the Phone panel. Real ones need a SIM and a strong 4 V supply.",
    defaults: { TX: 4, RX: 3 }, defaultsEsp: { TX: 16, RX: 17 },
    code: `// Send a text message when a button is pressed
#include <SoftwareSerial.h>
SoftwareSerial gsm({TX}, {RX});
const char* NUMBER = "+923001234567";

void sendSms(const char* text) {
  gsm.println("AT+CMGF=1");          // plain text mode
  delay(300);
  gsm.print("AT+CMGS=\\""); gsm.print(NUMBER); gsm.println("\\"");
  delay(300);
  gsm.print(text);
  gsm.write(26);                      // Ctrl+Z sends it
  delay(500);
}

void setup() {
  Serial.begin(9600);
  gsm.begin(9600);
  delay(1000);
  gsm.println("AT");
  Serial.println("Sending a message...");
  sendSms("Alarm triggered in the robotics lab!");
}

void loop() {
  while (gsm.available()) Serial.write(gsm.read());
}
`,
  },
  nrf24: {
    tag: "cl-nrf24", label: "Radio nRF24L01", cat: "Communication", kind: "module",
    pw: { vcc: ["VCC"], gnd: ["GND"] }, kit: ["Radio module nRF24L01"],
    help: "A cheap 2.4 GHz radio for talking between two boards, up to about 100 m. Needs 3.3 V, never 5 V. Circuit Lab has one board, so what you send appears in the Phone panel and anything you type there comes back.",
    defaults: { CE: 9, CSN: 10 }, defaultsEsp: { CE: 4, CSN: 5 },
    code: `// nRF24L01: send a message and listen for replies
#include <SPI.h>
#include <RF24.h>
RF24 radio({CE}, {CSN});
const byte ADDRESS[6] = "NODE1";

void setup() {
  Serial.begin(9600);
  radio.begin();
  radio.openWritingPipe(ADDRESS);
  radio.openReadingPipe(1, ADDRESS);
  radio.setPALevel(RF24_PA_LOW);
}

void loop() {
  const char msg[] = "Hello from the lab";
  radio.stopListening();
  radio.write(&msg, sizeof(msg));
  Serial.println("Sent a message");
  radio.startListening();
  delay(1500);
  if (radio.available()) {
    char in[32] = "";
    radio.read(&in, sizeof(in));
    Serial.print("Got back: ");
    Serial.println(in);
  }
}
`,
  },

  /* ---------------- colour screen ---------------- */
  tft: {
    tag: "wokwi-ili9341", label: "TFT colour screen 2.4\"", cat: "Displays", kind: "module",
    pw: { vcc: ["VCC"], gnd: ["GND"] }, kit: ["TFT display 2.4 in ILI9341"],
    help: "A 320×240 colour screen over SPI. Adafruit_GFX draws the shapes and text for you, so the same commands work on the OLED too.",
    defaults: { CS: 10, "D/C": 9, RST: 8 }, defaultsEsp: { CS: 5, "D/C": 4, RST: 2 },
    code: `// Colour screen: shapes and text
#include <SPI.h>
#include <Adafruit_GFX.h>
#include <Adafruit_ILI9341.h>
Adafruit_ILI9341 tft = Adafruit_ILI9341({CS}, {D/C}, {RST});

void setup() {
  Serial.begin(9600);
  tft.begin();
  tft.setRotation(1);
  tft.fillScreen(ILI9341_NAVY);
  tft.setTextColor(ILI9341_WHITE);
  tft.setTextSize(3);
  tft.setCursor(20, 20);
  tft.println("Robotics Club");
  tft.setTextSize(2);
  tft.setTextColor(ILI9341_YELLOW);
  tft.setCursor(20, 70);
  tft.println("Circuit Lab");
  tft.fillRoundRect(20, 110, 120, 60, 8, ILI9341_GREEN);
  tft.fillCircle(220, 140, 40, ILI9341_RED);
  tft.drawLine(20, 200, 300, 200, ILI9341_WHITE);
}

void loop() {
  tft.fillRect(20, 210, 200, 20, ILI9341_NAVY);
  tft.setCursor(20, 210);
  tft.setTextColor(ILI9341_CYAN);
  tft.setTextSize(2);
  tft.print("Up ");
  tft.print(millis() / 1000);
  tft.print("s");
  delay(500);
}
`,
  },
};
