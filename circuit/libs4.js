/* Circuit Lab - libraries for the round 4 modules. API-compatible stand-ins for the simulator. */
export const L4 = {};
export const DEPS4 = {};
const dep = (f, d) => { DEPS4[f] = d; };

/* ---------- AHT20 (Adafruit unified sensor style) ---------- */
L4["Adafruit_AHTX0.h"] = String.raw`#pragma once
#include "cl_sensor.h"
#ifndef CL_SENSORS_EVENT
#define CL_SENSORS_EVENT
typedef struct { float temperature; float relative_humidity; } sensors_event_t;
#endif
class Adafruit_AHTX0 {
public:
  bool begin(void *w = 0, uint8_t a = 0x38) { return cl_sensor_begin(11); }
  bool getEvent(sensors_event_t *hum, sensors_event_t *temp) {
    float v[2]; if (!cl_sensor_read(11, v, 2)) return false;
    if (temp) temp->temperature = v[0];
    if (hum) hum->relative_humidity = v[1];
    return true;
  }
};
`;
dep("Adafruit_AHTX0.h", ["cl_sensor.h"]);

/* ---------- SGP30 ---------- */
L4["Adafruit_SGP30.h"] = String.raw`#pragma once
#include "cl_sensor.h"
class Adafruit_SGP30 {
public:
  uint16_t TVOC = 0, eCO2 = 0, rawH2 = 0, rawEthanol = 0;
  bool begin(void *w = 0, bool init = true) { return cl_sensor_begin(12); }
  bool IAQmeasure() { float v[2]; if (!cl_sensor_read(12, v, 2)) return false; eCO2 = (uint16_t)v[0]; TVOC = (uint16_t)v[1]; return true; }
  bool IAQmeasureRaw() { return IAQmeasure(); }
  bool setHumidity(uint32_t h) { return true; }
  void softReset() {}
};
`;
dep("Adafruit_SGP30.h", ["cl_sensor.h"]);

/* ---------- CCS811 ---------- */
L4["Adafruit_CCS811.h"] = String.raw`#pragma once
#include "cl_sensor.h"
class Adafruit_CCS811 {
  uint16_t _co2 = 0, _tvoc = 0;
public:
  bool begin(uint8_t a = 0x5A, void *w = 0) { return cl_sensor_begin(13); }
  bool available() { return true; }
  uint8_t readData() { float v[2]; if (!cl_sensor_read(13, v, 2)) return 1; _co2 = (uint16_t)v[0]; _tvoc = (uint16_t)v[1]; return 0; }
  uint16_t geteCO2() { return _co2; }
  uint16_t getTVOC() { return _tvoc; }
  void setEnvironmentalData(float hum, float temp) {}
  float calculateTemperature() { return 25.0; }
};
`;
dep("Adafruit_CCS811.h", ["cl_sensor.h"]);

/* ---------- SCD40 ---------- */
L4["SensirionI2CScd4x.h"] = String.raw`#pragma once
#include "cl_sensor.h"
class SensirionI2CScd4x {
public:
  template <class T> void begin(T &w) { cl_sensor_begin(22); }
  void begin() { cl_sensor_begin(22); }
  uint16_t startPeriodicMeasurement() { return 0; }
  uint16_t stopPeriodicMeasurement() { return 0; }
  uint16_t getDataReadyFlag(bool &ready) { ready = true; return 0; }
  uint16_t readMeasurement(uint16_t &co2, float &temp, float &hum) {
    float v[3]; if (!cl_sensor_read(22, v, 3)) return 1;
    co2 = (uint16_t)v[0]; temp = v[1]; hum = v[2]; return 0;
  }
};
`;
dep("SensirionI2CScd4x.h", ["cl_sensor.h"]);

/* ---------- MAX30102 ---------- */
L4["MAX30105.h"] = String.raw`#pragma once
#include "cl_sensor.h"
class MAX30105 {
public:
  bool begin(void *w = 0, uint32_t speed = 400000, uint8_t a = 0x57) { return cl_sensor_begin(19); }
  void setup(uint8_t b = 0x1F, uint8_t s = 4, uint8_t m = 3, int sr = 400, int pw = 411, int r = 4096) {}
  float getHeartRate() { float v[2]; if (!cl_sensor_read(19, v, 2)) return 0; return v[0]; }
  float getSpO2() { float v[2]; if (!cl_sensor_read(19, v, 2)) return 0; return v[1]; }
  /* the raw counts a real module gives: a steady glow with the pulse riding on top */
  uint32_t getIR() { float v[2]; cl_sensor_read(19, v, 2); return (uint32_t)(60000 + 1800 * sin(millis() / 1000.0 * (v[0] / 60.0) * 6.2832)); }
  uint32_t getRed() { return getIR() - 4000; }
  void shutDown() {} void wakeUp() {}
};
`;
dep("MAX30105.h", ["cl_sensor.h"]);

/* ---------- AMG8833 thermal camera ---------- */
L4["Adafruit_AMG88xx.h"] = String.raw`#pragma once
#include "cl_sensor.h"
#define AMG88xx_PIXEL_ARRAY_SIZE 64
class Adafruit_AMG88xx {
public:
  bool begin(uint8_t a = 0x69, void *w = 0) { return cl_sensor_begin(20); }
  void readPixels(float *buf, uint8_t size = 64) { cl_sensor_read(20, buf, size); }
  float readThermistor() { float v[64]; cl_sensor_read(20, v, 64); return v[0]; }
};
`;
dep("Adafruit_AMG88xx.h", ["cl_sensor.h"]);

/* ---------- MH-Z19 CO2 ---------- */
L4["MHZ19.h"] = String.raw`#pragma once
#include "cl_sensor.h"
class MHZ19 {
public:
  void begin(Stream &s) { cl_sensor_begin(21); }
  void begin(Stream *s) { cl_sensor_begin(21); }
  void autoCalibration(bool on = true) {}
  void setRange(int r) {}
  int getCO2(bool force = true, bool fresh = false) { float v[2]; if (!cl_sensor_read(21, v, 2)) return -1; return (int)v[0]; }
  int getTemperature(bool force = true, bool fresh = false) { float v[2]; if (!cl_sensor_read(21, v, 2)) return -1; return (int)v[1]; }
  int errorCode = 1;
};
`;
dep("MHZ19.h", ["cl_sensor.h"]);

/* ---------- MAX6675 thermocouple ---------- */
L4["max6675.h"] = String.raw`#pragma once
#include "cl_sensor.h"
class MAX6675 {
  int _cs;
public:
  MAX6675(int sck, int cs, int so) : _cs(cs) { }
  double readCelsius() {
    float v[1];
    if (!cl_sensor_begin(18, _cs)) return NAN;
    if (!cl_sensor_read(18, v, 1, _cs)) return NAN;
    return v[0];
  }
  double readFahrenheit() { double c = readCelsius(); return c * 9.0 / 5.0 + 32.0; }
  double readFarenheit() { return readFahrenheit(); }
};
`;
dep("max6675.h", ["cl_sensor.h"]);
