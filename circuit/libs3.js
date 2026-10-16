/* Circuit Lab - libraries for the round 3 modules. API-compatible re-implementations for the simulator. */
export const L3 = {};
export const DEPS3 = {};
const dep = (f, d) => { DEPS3[f] = d; };

/* one helper every sensor shim uses: cl_call(14, op, buffer, len, sensorId, pin) */
L3["cl_sensor.h"] = String.raw`#pragma once
#include <Arduino.h>
#include "cl_hc.h"
static inline bool cl_sensor_begin(int id, int pin = 0) { return cl_call(14, 1, 0, 0, id, pin) != 0; }
static inline int cl_sensor_read(int id, float *out, int n, int pin = 0) { return cl_call(14, 2, out, n * 4, id, pin); }
`;
dep("cl_sensor.h", ["cl_hc.h"]);

/* ---------- BMP280 / BME280 ---------- */
L3["Adafruit_BMP280.h"] = String.raw`#pragma once
#include "cl_sensor.h"
class Adafruit_BMP280 {
public:
  Adafruit_BMP280() {}
  bool begin(uint8_t addr = 0x76, uint8_t id = 0x58) { return cl_sensor_begin(1); }
  void setSampling(...) {}
  float readTemperature() { float v[3]; cl_sensor_read(1, v, 3); return v[0]; }
  float readPressure() { float v[3]; cl_sensor_read(1, v, 3); return v[1]; }
  float readAltitude(float seaLevel = 1013.25) { float v[3]; cl_sensor_read(1, v, 3); return 44330.0 * (1.0 - pow((v[1] / 100.0) / seaLevel, 0.1903)); }
  float getTemperatureCompensation() { return 0; }
  enum { MODE_NORMAL = 3, SAMPLING_X2 = 2, SAMPLING_X16 = 5, FILTER_X16 = 4, STANDBY_MS_500 = 4 };
};
`;
dep("Adafruit_BMP280.h", ["cl_sensor.h"]);

L3["Adafruit_BME280.h"] = String.raw`#pragma once
#include "cl_sensor.h"
class Adafruit_BME280 {
public:
  Adafruit_BME280() {}
  bool begin(uint8_t addr = 0x76) { return cl_sensor_begin(2); }
  float readTemperature() { float v[3]; cl_sensor_read(2, v, 3); return v[0]; }
  float readPressure() { float v[3]; cl_sensor_read(2, v, 3); return v[1]; }
  float readHumidity() { float v[3]; cl_sensor_read(2, v, 3); return v[2]; }
  float readAltitude(float seaLevel = 1013.25) { float v[3]; cl_sensor_read(2, v, 3); return 44330.0 * (1.0 - pow((v[1] / 100.0) / seaLevel, 0.1903)); }
};
`;
dep("Adafruit_BME280.h", ["cl_sensor.h"]);

/* ---------- BH1750 light meter ---------- */
L3["BH1750.h"] = String.raw`#pragma once
#include "cl_sensor.h"
class BH1750 {
public:
  enum Mode { CONTINUOUS_HIGH_RES_MODE = 0x10, CONTINUOUS_LOW_RES_MODE = 0x13, ONE_TIME_HIGH_RES_MODE = 0x20 };
  BH1750(uint8_t addr = 0x23) {}
  bool begin(Mode m = CONTINUOUS_HIGH_RES_MODE, uint8_t a = 0x23, void *w = 0) { return cl_sensor_begin(3); }
  bool configure(Mode m) { return true; }
  float readLightLevel() { float v[1]; if (!cl_sensor_read(3, v, 1)) return -1; return v[0]; }
  bool measurementReady(bool m = false) { return true; }
};
`;
dep("BH1750.h", ["cl_sensor.h"]);

/* ---------- MLX90614 infrared thermometer ---------- */
L3["Adafruit_MLX90614.h"] = String.raw`#pragma once
#include "cl_sensor.h"
class Adafruit_MLX90614 {
public:
  Adafruit_MLX90614(uint8_t addr = 0x5A) {}
  bool begin(uint8_t addr = 0x5A, void *w = 0) { return cl_sensor_begin(4); }
  double readAmbientTempC() { float v[2]; cl_sensor_read(4, v, 2); return v[0]; }
  double readObjectTempC() { float v[2]; cl_sensor_read(4, v, 2); return v[1]; }
  double readAmbientTempF() { return readAmbientTempC() * 9.0 / 5.0 + 32.0; }
  double readObjectTempF() { return readObjectTempC() * 9.0 / 5.0 + 32.0; }
};
`;
dep("Adafruit_MLX90614.h", ["cl_sensor.h"]);

/* ---------- VL53L0X laser distance ---------- */
L3["VL53L0X.h"] = String.raw`#pragma once
#include "cl_sensor.h"
class VL53L0X {
public:
  bool init(bool io2v8 = true) { return cl_sensor_begin(5); }
  bool begin() { return init(); }
  void setTimeout(uint16_t ms) {}
  bool timeoutOccurred() { return false; }
  void startContinuous(uint32_t period = 0) {}
  void setMeasurementTimingBudget(uint32_t us) {}
  uint16_t readRangeSingleMillimeters() { float v[1]; if (!cl_sensor_read(5, v, 1)) return 8190; return (uint16_t)v[0]; }
  uint16_t readRangeContinuousMillimeters() { return readRangeSingleMillimeters(); }
};
`;
dep("VL53L0X.h", ["cl_sensor.h"]);

/* ---------- ADXL345 accelerometer ---------- */
L3["ADXL345.h"] = String.raw`#pragma once
#include "cl_sensor.h"
class ADXL345 {
public:
  ADXL345(uint8_t addr = 0x53) {}
  bool begin() { return cl_sensor_begin(6); }
  bool powerOn() { return begin(); }
  void setRange(int r) {}
  float getX() { float v[3]; cl_sensor_read(6, v, 3); return v[0]; }
  float getY() { float v[3]; cl_sensor_read(6, v, 3); return v[1]; }
  float getZ() { float v[3]; cl_sensor_read(6, v, 3); return v[2]; }
  void readAccel(float *x, float *y, float *z) { float v[3]; cl_sensor_read(6, v, 3); *x = v[0]; *y = v[1]; *z = v[2]; }
  void readXYZ(int *x, int *y, int *z) { float v[3]; cl_sensor_read(6, v, 3); *x = v[0] * 26; *y = v[1] * 26; *z = v[2] * 26; }
};
`;
dep("ADXL345.h", ["cl_sensor.h"]);

/* ---------- HMC5883L compass ---------- */
L3["HMC5883L.h"] = String.raw`#pragma once
#include "cl_sensor.h"
struct MagnetometerRaw { int XAxis, YAxis, ZAxis; };
struct MagnetometerScaled { float XAxis, YAxis, ZAxis; };
class HMC5883L {
public:
  bool begin() { return cl_sensor_begin(7); }
  int SetScale(float s) { begin(); return 0; }
  int SetMeasurementMode(int m) { return 0; }
  float getHeadingDegrees() { float v[4]; cl_sensor_read(7, v, 4); return v[3]; }
  MagnetometerRaw ReadRawAxis() { float v[4]; cl_sensor_read(7, v, 4); MagnetometerRaw r; r.XAxis = v[0]; r.YAxis = v[1]; r.ZAxis = v[2]; return r; }
  MagnetometerScaled ReadScaledAxis() { float v[4]; cl_sensor_read(7, v, 4); MagnetometerScaled r; r.XAxis = v[0]; r.YAxis = v[1]; r.ZAxis = v[2]; return r; }
};
#define Measurement_Continuous 0
`;
dep("HMC5883L.h", ["cl_sensor.h"]);

/* ---------- SHT31 ---------- */
L3["Adafruit_SHT31.h"] = String.raw`#pragma once
#include "cl_sensor.h"
class Adafruit_SHT31 {
public:
  Adafruit_SHT31(void *w = 0) {}
  bool begin(uint8_t addr = 0x44) { return cl_sensor_begin(8); }
  float readTemperature() { float v[2]; cl_sensor_read(8, v, 2); return v[0]; }
  float readHumidity() { float v[2]; cl_sensor_read(8, v, 2); return v[1]; }
  bool readBoth(float *t, float *h) { float v[2]; if (!cl_sensor_read(8, v, 2)) return false; *t = v[0]; *h = v[1]; return true; }
  void heater(bool on) {}
  bool isHeaterEnabled() { return false; }
};
`;
dep("Adafruit_SHT31.h", ["cl_sensor.h"]);

/* ---------- OneWire + DallasTemperature (DS18B20) ---------- */
L3["OneWire.h"] = String.raw`#pragma once
#include <Arduino.h>
class OneWire {
public:
  OneWire(uint8_t pin) : p(pin) {}
  uint8_t pin() const { return p; }
  void reset_search() { done = false; }
  uint8_t reset() { return 1; }
  bool search(uint8_t *addr) { if (done) return false; done = true; const uint8_t a[8] = {0x28,0xAA,0x12,0x34,0x56,0x78,0x90,0x3C}; for (int i = 0; i < 8; i++) addr[i] = a[i]; return true; }
  void select(const uint8_t *a) {} void skip() {} void write(uint8_t b, uint8_t power = 0) {} uint8_t read() { return 0; }
  void write_bytes(const uint8_t *b, uint16_t c, bool p2 = false) {} void read_bytes(uint8_t *b, uint16_t c) {}
  void depower() {}
  static uint8_t crc8(const uint8_t *a, uint8_t len) { return 0; }
private:
  uint8_t p; bool done = false;
};
`;
L3["DallasTemperature.h"] = String.raw`#pragma once
#include <Arduino.h>
#include "OneWire.h"
#include "cl_sensor.h"
#define DEVICE_DISCONNECTED_C -127.0
typedef uint8_t DeviceAddress[8];
class DallasTemperature {
public:
  DallasTemperature(OneWire *w) : wire(w) {}
  void begin() { cl_sensor_begin(10, wire ? wire->pin() : 2); }
  uint8_t getDeviceCount() { return cl_sensor_begin(10, wire ? wire->pin() : 2) ? 1 : 0; }
  bool getAddress(uint8_t *a, uint8_t i) { return wire ? wire->search(a) : false; }
  void setResolution(uint8_t r) {} void setResolution(const uint8_t *a, uint8_t r) {}
  void requestTemperatures() {}
  void setWaitForConversion(bool b) {}
  float getTempCByIndex(uint8_t i) { float v[1]; if (!cl_sensor_read(10, v, 1, wire ? wire->pin() : 2)) return DEVICE_DISCONNECTED_C; return v[0]; }
  float getTempC(const uint8_t *a) { return getTempCByIndex(0); }
  float getTempFByIndex(uint8_t i) { float c = getTempCByIndex(i); return c == DEVICE_DISCONNECTED_C ? c : c * 9.0 / 5.0 + 32.0; }
  static float toFahrenheit(float c) { return c * 9.0 / 5.0 + 32.0; }
private:
  OneWire *wire;
};
`;
dep("DallasTemperature.h", ["OneWire.h", "cl_sensor.h"]);

/* ---------- SD card ---------- */
L3["SD.h"] = String.raw`#pragma once
#include <Arduino.h>
#include "cl_hc.h"
#define FILE_READ 0
#define FILE_WRITE 1
class File : public Stream {
public:
  File() { name_[0] = 0; }
  File(const char *n, uint8_t m) : mode(m), pos(0) { strncpy(name_, n, 31); name_[31] = 0; opened = true; }
  operator bool() const { return opened; }
  size_t write(uint8_t c) { char b[2] = { (char)c, 0 }; return write((const uint8_t *)b, 1); }
  size_t write(const uint8_t *buf, size_t n) {
    if (!opened) return 0;
    cl_call(15, 5, name_, strlen(name_), cs(), 0);
    return cl_call(15, 4, buf, n, cs(), 0);
  }
  int available() { return size() - pos; }
  int read() { if (!opened) return -1; char b; cl_call(15, 5, name_, strlen(name_), cs(), 0); if (!cl_call(15, 6, &b, 1, cs(), pos)) return -1; pos++; return (uint8_t)b; }
  int peek() { int c = read(); if (c >= 0) pos--; return c; }
  void flush() {}
  uint32_t size() { return cl_call(15, 7, name_, strlen(name_), cs(), 0); }
  uint32_t position() { return pos; }
  bool seek(uint32_t p) { pos = p; return true; }
  void close() { opened = false; }
  const char *name() { return name_; }
  bool isDirectory() { return false; }
  static int cs();
  using Print::write;
private:
  char name_[32]; uint8_t mode = 0; uint32_t pos = 0; bool opened = false;
};
class SDClass {
public:
  bool begin(uint8_t csPin = 10) { cs_ = csPin; return cl_call(15, 1, 0, 0, csPin, 0) != 0; }
  bool exists(const char *n) { return cl_call(15, 2, n, strlen(n), cs_, 0) != 0; }
  File open(const char *n, uint8_t mode = FILE_READ) {
    if (!cl_call(15, 3, n, strlen(n), cs_, mode == FILE_WRITE ? 1 : 0)) return File();
    return File(n, mode);
  }
  File open(const String &n, uint8_t mode = FILE_READ) { return open(n.c_str(), mode); }
  bool remove(const char *n) { return cl_call(15, 8, n, strlen(n), cs_, 0) != 0; }
  bool mkdir(const char *n) { return true; }
  int csPin() { return cs_; }
  uint8_t cs_ = 10;
};
static SDClass SD;
inline int File::cs() { return SD.cs_; }
`;
dep("SD.h", ["cl_hc.h"]);

/* ---------- TinyGPS++ ---------- */
L3["TinyGPSPlus.h"] = String.raw`#pragma once
#include <Arduino.h>
/* A small NMEA parser: the module really does send $GPRMC and $GPGGA sentences. */
class TinyGPSLocation {
public:
  double lat() { updated_ = false; return lat_; } double lng() { updated_ = false; return lng_; }
  bool isValid() { return valid_; } bool isUpdated() { return updated_; }
  double lat_ = 0, lng_ = 0; bool valid_ = false, updated_ = false;
};
class TinyGPSInteger { public: uint32_t value() { return v; } bool isValid() { return valid; } bool isUpdated() { return valid; } uint32_t v = 0; bool valid = false; };
class TinyGPSDecimal { public: double kmph() { return v * 1.852; } double knots() { return v; } double deg() { return v; } double meters() { return v; } bool isValid() { return valid; } bool isUpdated() { return valid; } double v = 0; bool valid = false; };
class TinyGPSTime { public: uint8_t hour() { return h; } uint8_t minute() { return m; } uint8_t second() { return s; } bool isValid() { return valid; } uint8_t h = 0, m = 0, s = 0; bool valid = false; };
class TinyGPSDate { public: uint16_t year() { return y; } uint8_t month() { return mo; } uint8_t day() { return d; } bool isValid() { return valid; } uint16_t y = 0; uint8_t mo = 0, d = 0; bool valid = false; };
class TinyGPSPlus {
public:
  TinyGPSLocation location; TinyGPSInteger satellites; TinyGPSDecimal speed; TinyGPSDecimal altitude; TinyGPSDecimal course;
  TinyGPSTime time; TinyGPSDate date;
  uint32_t charsProcessed() { return chars; }
  uint32_t sentencesWithFix() { return fixes; }
  bool encode(char c) {
    chars++;
    if (c == '$') { n = 0; buf[0] = 0; return false; }
    if (c == '\r' || c == '\n') { if (n > 5) { buf[n] = 0; parse(); return true; } n = 0; return false; }
    if (n < 119) { buf[n++] = c; buf[n] = 0; }
    return false;
  }
  static double distanceBetween(double a1, double o1, double a2, double o2) {
    double dlat = radians(a2 - a1), dlon = radians(o2 - o1);
    double x = sin(dlat / 2) * sin(dlat / 2) + cos(radians(a1)) * cos(radians(a2)) * sin(dlon / 2) * sin(dlon / 2);
    return 6371000.0 * 2 * atan2(sqrt(x), sqrt(1 - x));
  }
private:
  char buf[124]; uint8_t n = 0; uint32_t chars = 0, fixes = 0;
  const char *field(uint8_t idx) {
    static char out[20]; uint8_t f = 0, j = 0; out[0] = 0;
    for (uint8_t i = 0; buf[i]; i++) {
      if (buf[i] == ',') { if (f == idx) { out[j] = 0; return out; } f++; j = 0; continue; }
      if (f == idx && j < 19) { out[j++] = buf[i]; out[j] = 0; }
    }
    return f == idx ? out : "";
  }
  double dm(const char *s, char hemi) {
    double raw = atof(s); if (raw == 0) return 0;
    int deg = (int)(raw / 100); double min = raw - deg * 100;
    double v = deg + min / 60.0;
    return (hemi == 'S' || hemi == 'W') ? -v : v;
  }
  void parse() {
    if (!strncmp(buf, "GPRMC", 5) || !strncmp(buf, "GNRMC", 5)) {
      const char *st = field(2);
      bool ok = st[0] == 'A';
      char la[16], ln[16]; strncpy(la, field(3), 15); la[15] = 0; char ns = field(4)[0];
      strncpy(ln, field(5), 15); ln[15] = 0; char ew = field(6)[0];
      speed.v = atof(field(7)); speed.valid = ok;
      course.v = atof(field(8)); course.valid = ok;
      const char *t = field(1);
      if (strlen(t) >= 6) { time.h = (t[0]-'0')*10+(t[1]-'0'); time.m = (t[2]-'0')*10+(t[3]-'0'); time.s = (t[4]-'0')*10+(t[5]-'0'); time.valid = true; }
      const char *dt = field(9);
      if (strlen(dt) >= 6) { date.d = (dt[0]-'0')*10+(dt[1]-'0'); date.mo = (dt[2]-'0')*10+(dt[3]-'0'); date.y = 2000+(dt[4]-'0')*10+(dt[5]-'0'); date.valid = true; }
      if (ok) { location.lat_ = dm(la, ns); location.lng_ = dm(ln, ew); location.valid_ = true; location.updated_ = true; fixes++; }
    } else if (!strncmp(buf, "GPGGA", 5) || !strncmp(buf, "GNGGA", 5)) {
      satellites.v = atoi(field(7)); satellites.valid = true;
      altitude.v = atof(field(9)); altitude.valid = true;
      char la[16], ln[16]; strncpy(la, field(2), 15); la[15] = 0; char ns = field(3)[0];
      strncpy(ln, field(4), 15); ln[15] = 0; char ew = field(5)[0];
      if (atoi(field(6)) > 0) { location.lat_ = dm(la, ns); location.lng_ = dm(ln, ew); location.valid_ = true; location.updated_ = true; }
    }
  }
};
`;

/* ---------- nRF24L01 ---------- */
L3["RF24.h"] = String.raw`#pragma once
#include <Arduino.h>
#include "cl_hc.h"
#define RF24_PA_MIN 0
#define RF24_PA_LOW 1
#define RF24_PA_HIGH 2
#define RF24_PA_MAX 3
#define RF24_250KBPS 0
#define RF24_1MBPS 1
#define RF24_2MBPS 2
class RF24 {
public:
  RF24(uint8_t ce, uint8_t csn) : ce_(ce), csn_(csn) {}
  bool begin() { return cl_call(16, 1, 0, 0, ce_, csn_) != 0; }
  bool isChipConnected() { return cl_call(16, 1, 0, 0, ce_, csn_) != 0; }
  void openWritingPipe(const uint8_t *a) {} void openWritingPipe(uint64_t a) {}
  void openReadingPipe(uint8_t n, const uint8_t *a) {} void openReadingPipe(uint8_t n, uint64_t a) {}
  void setPALevel(uint8_t l, bool b = false) {} void setDataRate(uint8_t r) {} void setChannel(uint8_t c) {}
  void setRetries(uint8_t d, uint8_t c) {} void enableDynamicPayloads() {} void setPayloadSize(uint8_t s) {}
  void startListening() { listening = true; } void stopListening() { listening = false; }
  bool write(const void *buf, uint8_t len) { return cl_call(16, 2, buf, len, ce_, csn_) != 0; }
  bool available() { return cl_call(16, 3, 0, 0, ce_, csn_) != 0; }
  bool available(uint8_t *pipe) { if (pipe) *pipe = 1; return available(); }
  void read(void *buf, uint8_t len) { cl_call(16, 4, buf, len, ce_, csn_); }
  void printDetails() {}
private:
  uint8_t ce_, csn_; bool listening = false;
};
`;
dep("RF24.h", ["cl_hc.h"]);

/* ---------- ILI9341 colour screen ---------- */
L3["Adafruit_ILI9341.h"] = String.raw`#pragma once
#include <Arduino.h>
#include "cl_hc.h"
#define ILI9341_BLACK 0x0000
#define ILI9341_NAVY 0x000F
#define ILI9341_DARKGREEN 0x03E0
#define ILI9341_DARKCYAN 0x03EF
#define ILI9341_MAROON 0x7800
#define ILI9341_PURPLE 0x780F
#define ILI9341_OLIVE 0x7BE0
#define ILI9341_LIGHTGREY 0xC618
#define ILI9341_DARKGREY 0x7BEF
#define ILI9341_BLUE 0x001F
#define ILI9341_GREEN 0x07E0
#define ILI9341_CYAN 0x07FF
#define ILI9341_RED 0xF800
#define ILI9341_MAGENTA 0xF81F
#define ILI9341_YELLOW 0xFFE0
#define ILI9341_WHITE 0xFFFF
#define ILI9341_ORANGE 0xFD20
#define ILI9341_PINK 0xFC18
struct ClTftArgs { int16_t a, b, c, d, e; uint16_t f, g; };
class Adafruit_ILI9341 : public Print {
public:
  Adafruit_ILI9341(int8_t cs, int8_t dc, int8_t rst = -1) : cs_(cs), dc_(dc) {}
  void begin(uint32_t freq = 0) { cl_call(17, 1, 0, 0, cs_, 0); }
  void setRotation(uint8_t r) { rot = r & 3; send(9, r & 3, 0, 0, 0, 0); }
  uint8_t getRotation() { return rot; }
  int16_t width() { return cl_call(17, 11, 0, 0, cs_, 0); }
  int16_t height() { return cl_call(17, 12, 0, 0, cs_, 0); }
  void fillScreen(uint16_t c) { cursorX = cursorY = 0; send(2, c, 0, 0, 0, 0); }
  void fillRect(int16_t x, int16_t y, int16_t w, int16_t h, uint16_t c) { send(3, x, y, w, h, c); }
  void drawRect(int16_t x, int16_t y, int16_t w, int16_t h, uint16_t c) { send(4, x, y, w, h, c); }
  void drawLine(int16_t x0, int16_t y0, int16_t x1, int16_t y1, uint16_t c) { send(5, x0, y0, x1, y1, c); }
  void drawFastHLine(int16_t x, int16_t y, int16_t w, uint16_t c) { send(3, x, y, w, 1, c); }
  void drawFastVLine(int16_t x, int16_t y, int16_t h, uint16_t c) { send(3, x, y, 1, h, c); }
  void drawCircle(int16_t x, int16_t y, int16_t r, uint16_t c) { send(6, x, y, r, c, 0); }
  void fillCircle(int16_t x, int16_t y, int16_t r, uint16_t c) { send(6, x, y, r, c, 1); }
  void drawRoundRect(int16_t x, int16_t y, int16_t w, int16_t h, int16_t r, uint16_t c) { send2(8, x, y, w, h, r, c, 0); }
  void fillRoundRect(int16_t x, int16_t y, int16_t w, int16_t h, int16_t r, uint16_t c) { send2(8, x, y, w, h, r, c, 1); }
  void drawPixel(int16_t x, int16_t y, uint16_t c) { send(10, x, y, c, 0, 0); }
  void drawTriangle(int16_t x0,int16_t y0,int16_t x1,int16_t y1,int16_t x2,int16_t y2,uint16_t c){ drawLine(x0,y0,x1,y1,c); drawLine(x1,y1,x2,y2,c); drawLine(x2,y2,x0,y0,c); }
  void fillTriangle(int16_t x0,int16_t y0,int16_t x1,int16_t y1,int16_t x2,int16_t y2,uint16_t c){ drawTriangle(x0,y0,x1,y1,x2,y2,c); }
  void setCursor(int16_t x, int16_t y) { cursorX = x; cursorY = y; }
  int16_t getCursorX() { return cursorX; } int16_t getCursorY() { return cursorY; }
  void setTextColor(uint16_t c) { fg = c; trans = true; }
  void setTextColor(uint16_t c, uint16_t b) { fg = c; bg = b; trans = false; }
  void setTextSize(uint8_t s) { size = s < 1 ? 1 : s; }
  void setTextWrap(bool w) {}
  void invertDisplay(bool i) {}
  size_t write(uint8_t ch) {
    if (ch == '\n') { cursorY += 8 * size; cursorX = 0; n = 0; line[0] = 0; return 1; }
    if (ch == '\r') return 1;
    if (n < 30) line[n++] = ch;
    line[n] = 0;
    flushText();
    return 1;
  }
  using Print::write;
private:
  void flushText() {
    ClTftArgs t; t.a = cursorX; t.b = cursorY; t.c = size; t.d = fg; t.e = trans ? -1 : (int16_t)bg;
    t.f = (uint16_t)(uintptr_t)line; t.g = n;
    cl_call(17, 7, &t, sizeof t, cs_, 0);
  }
  void send(uint8_t op, int16_t a, int16_t b, int16_t c, int16_t d, int16_t e) {
    ClTftArgs t; t.a = a; t.b = b; t.c = c; t.d = d; t.e = e; t.f = 0; t.g = 0;
    cl_call(17, op, &t, sizeof t, cs_, 0);
    if (op != 7) { n = 0; line[0] = 0; }
  }
  void send2(uint8_t op, int16_t a, int16_t b, int16_t c, int16_t d, int16_t e, int16_t f, int16_t g) {
    ClTftArgs t; t.a = a; t.b = b; t.c = c; t.d = d; t.e = e; t.f = (uint16_t)f; t.g = (uint16_t)g;
    cl_call(17, op, &t, sizeof t, cs_, 0);
  }
  int8_t cs_, dc_; uint8_t rot = 0, size = 1, n = 0;
  int16_t cursorX = 0, cursorY = 0; uint16_t fg = 0xFFFF, bg = 0x0000; bool trans = true;
  char line[32];
};
`;
dep("Adafruit_ILI9341.h", ["cl_hc.h"]);
