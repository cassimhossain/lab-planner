/* Circuit Lab - libraries for the I2C expander, ADC, DAC and servo driver. */
export const L5 = {};
export const DEPS5 = {};
const dep = (f, d) => { DEPS5[f] = d; };

/* ---------- PCF8574 ---------- */
L5["PCF8574.h"] = String.raw`#pragma once
#include <Arduino.h>
#include "cl_hc.h"
class PCF8574 {
  uint8_t _a; uint8_t _shadow = 0xFF;
public:
  PCF8574(uint8_t addr = 0x20) : _a(addr) {}
  PCF8574(uint8_t addr, void *w) : _a(addr) {}
  bool begin(uint8_t initial = 0xFF) { _shadow = initial; bool okk = cl_call(23, 1, 0, 0, _a) != 0; if (okk) cl_call(23, 2, 0, 0, _a, _shadow); return okk; }
  bool isConnected() { return cl_call(23, 1, 0, 0, _a) != 0; }
  void pinMode(uint8_t p, uint8_t m) { if (m != OUTPUT) { _shadow |= (1 << p); cl_call(23, 2, 0, 0, _a, _shadow); } }
  void write8(uint8_t v) { _shadow = v; cl_call(23, 2, 0, 0, _a, v); }
  void write(uint8_t p, uint8_t v) { if (v) _shadow |= (1 << p); else _shadow &= ~(1 << p); cl_call(23, 2, 0, 0, _a, _shadow); }
  void digitalWrite(uint8_t p, uint8_t v) { write(p, v); }
  uint8_t read8() { return (uint8_t)cl_call(23, 3, 0, 0, _a); }
  uint8_t read(uint8_t p) { return (read8() >> p) & 1; }
  uint8_t digitalRead(uint8_t p) { return read(p); }
  void toggle(uint8_t p) { write(p, !read(p)); }
};
`;
dep("PCF8574.h", ["cl_hc.h"]);

/* ---------- MCP23017 ---------- */
L5["Adafruit_MCP23X17.h"] = String.raw`#pragma once
#include <Arduino.h>
#include "cl_hc.h"
class Adafruit_MCP23X17 {
  uint8_t _a = 0x20; uint16_t _shadow = 0;
public:
  bool begin_I2C(uint8_t addr = 0x20, void *w = 0) { _a = addr; return cl_call(24, 1, 0, 0, _a) != 0; }
  bool begin(uint8_t addr = 0x20) { return begin_I2C(addr); }
  void pinMode(uint8_t p, uint8_t m) {}
  void digitalWrite(uint8_t p, uint8_t v) { if (v) _shadow |= (1 << p); else _shadow &= ~(1 << p); cl_call(24, 2, 0, 0, _a, _shadow); }
  uint8_t digitalRead(uint8_t p) { return (uint8_t)((cl_call(24, 3, 0, 0, _a) >> p) & 1); }
  void writeGPIOAB(uint16_t v) { _shadow = v; cl_call(24, 2, 0, 0, _a, v); }
  uint16_t readGPIOAB() { return (uint16_t)cl_call(24, 3, 0, 0, _a); }
  void writeGPIOA(uint8_t v) { _shadow = (_shadow & 0xFF00) | v; cl_call(24, 2, 0, 0, _a, _shadow); }
  void writeGPIOB(uint8_t v) { _shadow = (_shadow & 0x00FF) | ((uint16_t)v << 8); cl_call(24, 2, 0, 0, _a, _shadow); }
  uint8_t readGPIOA() { return (uint8_t)(readGPIOAB() & 0xFF); }
  uint8_t readGPIOB() { return (uint8_t)(readGPIOAB() >> 8); }
};
`;
dep("Adafruit_MCP23X17.h", ["cl_hc.h"]);

/* ---------- ADS1115 ---------- */
L5["Adafruit_ADS1X15.h"] = String.raw`#pragma once
#include <Arduino.h>
#include "cl_hc.h"
typedef enum { GAIN_TWOTHIRDS = 0, GAIN_ONE = 1, GAIN_TWO = 2, GAIN_FOUR = 3, GAIN_EIGHT = 4, GAIN_SIXTEEN = 5 } adsGain_t;
class Adafruit_ADS1115 {
  uint8_t _a = 0x48; uint8_t _g = 0;
  static constexpr float RANGE[6] = { 6.144f, 4.096f, 2.048f, 1.024f, 0.512f, 0.256f };
public:
  bool begin(uint8_t addr = 0x48, void *w = 0) { _a = addr; return cl_call(25, 1, 0, 0, _a) != 0; }
  void setGain(adsGain_t g) { _g = (uint8_t)g; cl_call(25, 3, 0, 0, _a, _g); }
  adsGain_t getGain() { return (adsGain_t)_g; }
  int16_t readADC_SingleEnded(uint8_t ch) { return (int16_t)cl_call(25, 2, 0, 0, _a, ch); }
  int16_t readADC_Differential_0_1() { return (int16_t)(readADC_SingleEnded(0) - readADC_SingleEnded(1)); }
  int16_t readADC_Differential_2_3() { return (int16_t)(readADC_SingleEnded(2) - readADC_SingleEnded(3)); }
  float computeVolts(int16_t counts) { return counts * (RANGE[_g] / 32767.0f); }
};
constexpr float Adafruit_ADS1115::RANGE[6];
typedef Adafruit_ADS1115 Adafruit_ADS1015;
`;
dep("Adafruit_ADS1X15.h", ["cl_hc.h"]);

/* ---------- MCP4725 ---------- */
L5["Adafruit_MCP4725.h"] = String.raw`#pragma once
#include <Arduino.h>
#include "cl_hc.h"
class Adafruit_MCP4725 {
  uint8_t _a = 0x60;
public:
  bool begin(uint8_t addr = 0x60, void *w = 0) { _a = addr; return cl_call(26, 1, 0, 0, _a) != 0; }
  void setVoltage(uint16_t out, bool writeEEPROM, uint32_t speed = 100000) { cl_call(26, 2, 0, 0, _a, out); }
};
`;
dep("Adafruit_MCP4725.h", ["cl_hc.h"]);

/* ---------- PCA9685 ---------- */
L5["Adafruit_PWMServoDriver.h"] = String.raw`#pragma once
#include <Arduino.h>
#include "cl_hc.h"
class Adafruit_PWMServoDriver {
  uint8_t _a;
public:
  Adafruit_PWMServoDriver(uint8_t addr = 0x40) : _a(addr) {}
  template <class T> Adafruit_PWMServoDriver(uint8_t addr, T &w) : _a(addr) {}
  bool begin(uint8_t prescale = 0) { return cl_call(27, 1, 0, 0, _a) != 0; }
  void reset() {}
  void sleep() {} void wakeup() {}
  void setOscillatorFrequency(uint32_t f) {}
  void setPWMFreq(float f) { cl_call(27, 3, 0, 0, _a, (int32_t)f); }
  void setPWM(uint8_t ch, uint16_t on, uint16_t off) { cl_call(27, 2, 0, 0, _a, ((int32_t)ch << 16) | (off & 0xFFFF)); }
  void setPin(uint8_t ch, uint16_t val, bool invert = false) { setPWM(ch, 0, invert ? 4095 - val : val); }
  void writeMicroseconds(uint8_t ch, uint16_t us) { cl_call(27, 4, 0, 0, _a, ((int32_t)ch << 16) | (us & 0xFFFF)); }
};
`;
dep("Adafruit_PWMServoDriver.h", ["cl_hc.h"]);

/* ---------- DFPlayer Mini ---------- */
L5["DFRobotDFPlayerMini.h"] = String.raw`#pragma once
#include <Arduino.h>
#include "cl_hc.h"
class DFRobotDFPlayerMini {
public:
  template <class T> bool begin(T &s, bool ack = true, bool reset = true) { return cl_call(28, 1) != 0; }
  void play(int track) { cl_call(28, 2, 0, 0, track); }
  void playMp3Folder(int track) { play(track); }
  void playFolder(int folder, int track) { play(track); }
  void next() { cl_call(28, 3); }
  void previous() { cl_call(28, 4); }
  void pause() { cl_call(28, 5); }
  void start() { cl_call(28, 6); }
  void stop() { cl_call(28, 7); }
  void loop(int track) { cl_call(28, 8, 0, 0, track); }
  void enableLoop() { cl_call(28, 8, 0, 0, 0); }
  void disableLoop() { cl_call(28, 9); }
  void volume(int v) { cl_call(28, 10, 0, 0, v); }
  void volumeUp() { cl_call(28, 11); }
  void volumeDown() { cl_call(28, 12); }
  int readFileCounts() { return cl_call(28, 13); }
  int readCurrentFileNumber() { return cl_call(28, 14); }
  int readVolume() { return cl_call(28, 15); }
  bool available() { return false; }
  uint8_t readType() { return 0; }
  int read() { return 0; }
};
`;
dep("DFRobotDFPlayerMini.h", ["cl_hc.h"]);
