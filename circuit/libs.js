/* Circuit Lab - extra Arduino libraries and the ESP32 teaching-mode layer.
   These are small, API-compatible re-implementations written for the simulator (not copies of the originals).
   Devices talk to the simulator through cl_hc.h: the sketch writes the address of a request block to GPIOR1/2 and
   pokes GPIOR0; the simulator answers instantly. */
import { L2, DEPS2 } from "./libs2.js?v=14";
import { L3, DEPS3 } from "./libs3.js?v=14";
import { L4, DEPS4 } from "./libs4.js?v=14";
import { L5, DEPS5 } from "./libs5.js?v=14";
const L = {};

L["cl_hc.h"] = String.raw`#pragma once
#include <Arduino.h>
/* Circuit Lab simulator bridge (not needed on real hardware) */
struct ClCall { uint8_t dev; uint8_t op; uint16_t len; void *ptr; int32_t a; int32_t b; int32_t ret; };
static inline int32_t cl_call(uint8_t dev, uint8_t op, const void *ptr = 0, uint16_t len = 0, int32_t a = 0, int32_t b = 0) {
  volatile ClCall c; c.dev = dev; c.op = op; c.len = len; c.ptr = (void *)ptr; c.a = a; c.b = b; c.ret = 0;
  uint16_t p = (uint16_t)&c;
  GPIOR1 = p & 0xff; GPIOR2 = p >> 8; GPIOR0 = 0xC1;
  return c.ret;
}
static inline bool __cl_true() { return true; }
`;

L["cl_print.h"] = String.raw`#pragma once
#include <Arduino.h>
#include <stdarg.h>
/* printf() for Print objects (Serial.printf on ESP32), with %f support */
static void __cl_vprintf(Print &out, const char *f, va_list ap) {
  char num[24];
  while (*f) {
    if (*f != '%') { out.write(*f++); continue; }
    f++;
    if (*f == '%') { out.write('%'); f++; continue; }
    bool left = false, zero = false, plus = false; int width = 0, prec = -1, lng = 0;
    while (*f == '-' || *f == '0' || *f == '+' || *f == ' ') { if (*f == '-') left = true; if (*f == '0') zero = true; if (*f == '+') plus = true; f++; }
    while (*f >= '0' && *f <= '9') width = width * 10 + (*f++ - '0');
    if (*f == '.') { f++; prec = 0; while (*f >= '0' && *f <= '9') prec = prec * 10 + (*f++ - '0'); }
    while (*f == 'l' || *f == 'h' || *f == 'z') { if (*f == 'l') lng++; f++; }
    char c = *f ? *f++ : 0; const char *s = num; num[0] = 0;
    switch (c) {
      case 'd': case 'i': { long v = lng ? va_arg(ap, long) : va_arg(ap, int); if (plus && v >= 0) { ltoa(v, num + 1, 10); num[0] = '+'; } else ltoa(v, num, 10); break; }
      case 'u': { unsigned long v = lng ? va_arg(ap, unsigned long) : va_arg(ap, unsigned int); ultoa(v, num, 10); break; }
      case 'x': case 'X': { unsigned long v = lng ? va_arg(ap, unsigned long) : va_arg(ap, unsigned int); ultoa(v, num, 16); if (c == 'X') for (char *q = num; *q; q++) *q = toupper(*q); break; }
      case 'c': num[0] = (char)va_arg(ap, int); num[1] = 0; break;
      case 's': s = va_arg(ap, const char *); if (!s) s = "(null)"; break;
      case 'f': case 'F': case 'g': case 'e': { double v = va_arg(ap, double); dtostrf(v, 1, prec < 0 ? 6 : prec, num); if (plus && v >= 0) { memmove(num + 1, num, strlen(num) + 1); num[0] = '+'; } break; }
      case 'p': ultoa((unsigned long)(uint16_t)va_arg(ap, void *), num, 16); break;
      default: num[0] = c; num[1] = 0;
    }
    int n = strlen(s), pad = width > n ? width - n : 0;
    if (!left) { char pc = (zero && c != 's') ? '0' : ' '; if (pc == '0' && (*s == '-' || *s == '+')) { out.write(*s++); n--; } while (pad--) out.write(pc); pad = 0; }
    out.write((const uint8_t *)s, strlen(s));
    if (left) while (pad--) out.write(' ');
  }
}
template <class T> int __cl_printf(T &out, const char *f, ...) { va_list ap; va_start(ap, f); __cl_vprintf(out, f, ap); va_end(ap); return 0; }
template <class T> int __cl_printf(T &out, const __FlashStringHelper *f, ...) { char buf[96]; strncpy_P(buf, (const char *)f, 95); buf[95] = 0; va_list ap; va_start(ap, f); __cl_vprintf(out, buf, ap); va_end(ap); return 0; }
`;

/* ---------- OLED SSD1306 (I2C) ---------- */
L["Adafruit_SSD1306.h"] = String.raw`#pragma once
#include <Arduino.h>
#include <Wire.h>
#include <Adafruit_GFX.h>
#include "cl_hc.h"
#define SSD1306_BLACK 0
#define SSD1306_WHITE 1
#define SSD1306_INVERSE 2
#ifndef NO_ADAFRUIT_SSD1306_COLOR_COMPATIBILITY
#define BLACK SSD1306_BLACK
#define WHITE SSD1306_WHITE
#define INVERSE SSD1306_INVERSE
#endif
#define SSD1306_SWITCHCAPVCC 0x02
#define SSD1306_EXTERNALVCC 0x01
#define SSD1306_DISPLAYOFF 0xAE
#define SSD1306_DISPLAYON 0xAF
class Adafruit_SSD1306 : public Adafruit_GFX {
public:
  Adafruit_SSD1306(uint8_t w, uint8_t h, TwoWire *twi = &Wire, int8_t rst_pin = -1, uint32_t clkDuring = 400000UL, uint32_t clkAfter = 100000UL) : Adafruit_GFX(w, h), buffer(0), i2caddr(0x3C) {}
  Adafruit_SSD1306(uint8_t w, uint8_t h, int8_t mosi, int8_t sclk, int8_t dc, int8_t rst, int8_t cs) : Adafruit_GFX(w, h), buffer(0), i2caddr(0x3C) {}
  ~Adafruit_SSD1306() { if (buffer) free(buffer); }
  bool begin(uint8_t vcs = SSD1306_SWITCHCAPVCC, uint8_t addr = 0, bool reset = true, bool periphBegin = true) {
    if (!buffer && !(buffer = (uint8_t *)malloc(bytes()))) return false;
    clearDisplay(); if (addr) i2caddr = addr;
    return cl_call(1, 1, 0, 0, i2caddr, ((int32_t)WIDTH << 8) | HEIGHT) != 0;
  }
  void display(void) { if (buffer) cl_call(1, 2, buffer, bytes(), WIDTH, HEIGHT); }
  void clearDisplay(void) { if (buffer) memset(buffer, 0, bytes()); }
  void invertDisplay(bool i) { cl_call(1, 3, 0, 0, i, 0); }
  void dim(bool dim) { cl_call(1, 4, 0, 0, dim, 0); }
  void drawPixel(int16_t x, int16_t y, uint16_t color) {
    if (!buffer || x < 0 || y < 0 || x >= width() || y >= height()) return;
    int16_t t;
    switch (getRotation()) {
      case 1: t = x; x = WIDTH - y - 1; y = t; break;
      case 2: x = WIDTH - x - 1; y = HEIGHT - y - 1; break;
      case 3: t = x; x = y; y = HEIGHT - t - 1; break;
    }
    uint8_t *b = &buffer[x + (y / 8) * WIDTH], m = 1 << (y & 7);
    if (color == SSD1306_WHITE) *b |= m; else if (color == SSD1306_BLACK) *b &= ~m; else if (color == SSD1306_INVERSE) *b ^= m;
  }
  bool getPixel(int16_t x, int16_t y) { if (!buffer || x < 0 || y < 0 || x >= WIDTH || y >= HEIGHT) return false; return buffer[x + (y / 8) * WIDTH] & (1 << (y & 7)); }
  uint8_t *getBuffer(void) { return buffer; }
  void ssd1306_command(uint8_t c) { if (c == SSD1306_DISPLAYOFF) cl_call(1, 5, 0, 0, 0, 0); if (c == SSD1306_DISPLAYON) cl_call(1, 5, 0, 0, 1, 0); }
  void startscrollright(uint8_t a, uint8_t b) {}
  void startscrollleft(uint8_t a, uint8_t b) {}
  void startscrolldiagright(uint8_t a, uint8_t b) {}
  void startscrolldiagleft(uint8_t a, uint8_t b) {}
  void stopscroll(void) {}
private:
  uint16_t bytes() { return WIDTH * ((HEIGHT + 7) / 8); }
  uint8_t *buffer; uint8_t i2caddr;
};
`;

/* ---------- MPU6050 (Adafruit API) ---------- */
L["Adafruit_MPU6050.h"] = String.raw`#pragma once
#include <Arduino.h>
#include <Wire.h>
#include <Adafruit_Sensor.h>
#include "cl_hc.h"
#define MPU6050_I2CADDR_DEFAULT 0x68
#define MPU6050_DEVICE_ID 0x68
typedef enum { MPU6050_RANGE_2_G = 0, MPU6050_RANGE_4_G, MPU6050_RANGE_8_G, MPU6050_RANGE_16_G } mpu6050_accel_range_t;
typedef enum { MPU6050_RANGE_250_DEG = 0, MPU6050_RANGE_500_DEG, MPU6050_RANGE_1000_DEG, MPU6050_RANGE_2000_DEG } mpu6050_gyro_range_t;
typedef enum { MPU6050_BAND_260_HZ = 0, MPU6050_BAND_184_HZ, MPU6050_BAND_94_HZ, MPU6050_BAND_44_HZ, MPU6050_BAND_21_HZ, MPU6050_BAND_10_HZ, MPU6050_BAND_5_HZ } mpu6050_bandwidth_t;
typedef enum { MPU6050_HIGHPASS_DISABLE, MPU6050_HIGHPASS_5_HZ, MPU6050_HIGHPASS_2_5_HZ, MPU6050_HIGHPASS_1_25_HZ, MPU6050_HIGHPASS_0_63_HZ, MPU6050_HIGHPASS_UNUSED, MPU6050_HIGHPASS_HOLD } mpu6050_highpass_t;
typedef enum { MPU6050_CYCLE_1_25_HZ, MPU6050_CYCLE_5_HZ, MPU6050_CYCLE_20_HZ, MPU6050_CYCLE_40_HZ } mpu6050_cycle_rate_t;
class Adafruit_MPU6050 {
public:
  bool begin(uint8_t addr = MPU6050_I2CADDR_DEFAULT, TwoWire *w = &Wire, int32_t id = 0) { a_ = addr; return cl_call(2, 1, 0, 0, addr, 0) != 0; }
  bool getEvent(sensors_event_t *accel, sensors_event_t *gyro, sensors_event_t *temp) {
    float v[7]; memset(v, 0, sizeof v); cl_call(2, 2, v, sizeof v, a_, 0);
    uint32_t t = millis();
    if (accel) { memset(accel, 0, sizeof(sensors_event_t)); accel->version = sizeof(sensors_event_t); accel->type = SENSOR_TYPE_ACCELEROMETER; accel->timestamp = t; accel->acceleration.x = v[0]; accel->acceleration.y = v[1]; accel->acceleration.z = v[2]; }
    if (gyro) { memset(gyro, 0, sizeof(sensors_event_t)); gyro->version = sizeof(sensors_event_t); gyro->type = SENSOR_TYPE_GYROSCOPE; gyro->timestamp = t; gyro->gyro.x = v[3]; gyro->gyro.y = v[4]; gyro->gyro.z = v[5]; }
    if (temp) { memset(temp, 0, sizeof(sensors_event_t)); temp->version = sizeof(sensors_event_t); temp->type = SENSOR_TYPE_AMBIENT_TEMPERATURE; temp->timestamp = t; temp->temperature = v[6]; }
    return true;
  }
  void setAccelerometerRange(mpu6050_accel_range_t r) { ar = r; }
  mpu6050_accel_range_t getAccelerometerRange(void) { return ar; }
  void setGyroRange(mpu6050_gyro_range_t r) { gr = r; }
  mpu6050_gyro_range_t getGyroRange(void) { return gr; }
  void setFilterBandwidth(mpu6050_bandwidth_t b) { bw = b; }
  mpu6050_bandwidth_t getFilterBandwidth(void) { return bw; }
  void setHighPassFilter(mpu6050_highpass_t b) {}
  void setMotionDetectionThreshold(uint8_t t) { thr = t; }
  void setMotionDetectionDuration(uint8_t d) {}
  void setInterruptPinLatch(bool h) {}
  void setInterruptPinPolarity(bool a) {}
  void setMotionInterrupt(bool a) {}
  bool getMotionInterruptStatus(void) { return cl_call(2, 3, 0, 0, a_, thr) != 0; }
  void setCycleRate(mpu6050_cycle_rate_t r) {}
  void enableSleep(bool e) {}
  void enableCycle(bool e) {}
  void reset(void) {}
  uint8_t getSampleRateDivisor(void) { return 0; }
  void setSampleRateDivisor(uint8_t d) {}
private:
  uint8_t a_ = 0x68, thr = 1;
  mpu6050_accel_range_t ar = MPU6050_RANGE_2_G; mpu6050_gyro_range_t gr = MPU6050_RANGE_250_DEG; mpu6050_bandwidth_t bw = MPU6050_BAND_260_HZ;
};
`;

/* ---------- MPU6050 (I2Cdev / Electronic Cats API) ---------- */
L["I2Cdev.h"] = String.raw`#pragma once
#include <Arduino.h>
#include <Wire.h>
`;
L["MPU6050.h"] = String.raw`#pragma once
#include <Arduino.h>
#include <Wire.h>
#include "cl_hc.h"
#define MPU6050_ADDRESS_AD0_LOW 0x68
#define MPU6050_ADDRESS_AD0_HIGH 0x69
#define MPU6050_DEFAULT_ADDRESS 0x68
#define MPU6050_ACCEL_FS_2 0x00
#define MPU6050_ACCEL_FS_4 0x01
#define MPU6050_ACCEL_FS_8 0x02
#define MPU6050_ACCEL_FS_16 0x03
#define MPU6050_GYRO_FS_250 0x00
#define MPU6050_GYRO_FS_500 0x01
#define MPU6050_GYRO_FS_1000 0x02
#define MPU6050_GYRO_FS_2000 0x03
class MPU6050 {
public:
  MPU6050(uint8_t address = MPU6050_DEFAULT_ADDRESS, void *wireObj = 0) : addr(address) {}
  void initialize() { cl_call(2, 1, 0, 0, addr, 0); }
  bool testConnection() { return cl_call(2, 1, 0, 0, addr, 0) != 0; }
  uint8_t getDeviceID() { return 0x34; }
  void setFullScaleAccelRange(uint8_t r) { afs = r & 3; }
  void setFullScaleGyroRange(uint8_t r) { gfs = r & 3; }
  uint8_t getFullScaleAccelRange() { return afs; }
  uint8_t getFullScaleGyroRange() { return gfs; }
  void setDLPFMode(uint8_t m) {}
  void setSleepEnabled(bool e) {}
  void setXAccelOffset(int16_t o) {} void setYAccelOffset(int16_t o) {} void setZAccelOffset(int16_t o) {}
  void setXGyroOffset(int16_t o) {} void setYGyroOffset(int16_t o) {} void setZGyroOffset(int16_t o) {}
  void CalibrateAccel(uint8_t loops = 15) {} void CalibrateGyro(uint8_t loops = 15) {}
  void getMotion6(int16_t *ax, int16_t *ay, int16_t *az, int16_t *gx, int16_t *gy, int16_t *gz) {
    float v[7]; read(v);
    float as = 16384.0 / (1 << afs) / 9.80665, gs = 131.0 / (1 << gfs) * 57.29578;
    *ax = clip(v[0] * as); *ay = clip(v[1] * as); *az = clip(v[2] * as); *gx = clip(v[3] * gs); *gy = clip(v[4] * gs); *gz = clip(v[5] * gs);
  }
  void getAcceleration(int16_t *x, int16_t *y, int16_t *z) { int16_t a, b, c; getMotion6(x, y, z, &a, &b, &c); }
  void getRotation(int16_t *x, int16_t *y, int16_t *z) { int16_t a, b, c; getMotion6(&a, &b, &c, x, y, z); }
  int16_t getAccelerationX() { int16_t x, y, z; getAcceleration(&x, &y, &z); return x; }
  int16_t getAccelerationY() { int16_t x, y, z; getAcceleration(&x, &y, &z); return y; }
  int16_t getAccelerationZ() { int16_t x, y, z; getAcceleration(&x, &y, &z); return z; }
  int16_t getRotationX() { int16_t x, y, z; getRotation(&x, &y, &z); return x; }
  int16_t getRotationY() { int16_t x, y, z; getRotation(&x, &y, &z); return y; }
  int16_t getRotationZ() { int16_t x, y, z; getRotation(&x, &y, &z); return z; }
  int16_t getTemperature() { float v[7]; read(v); return (int16_t)((v[6] - 36.53) * 340.0); }
private:
  void read(float *v) { memset(v, 0, 28); cl_call(2, 2, v, 28, addr, 0); }
  static int16_t clip(float f) { if (f > 32767) return 32767; if (f < -32768) return -32768; return (int16_t)f; }
  uint8_t addr, afs = 0, gfs = 0;
};
`;

/* ---------- HX711 load cell amplifier ---------- */
L["HX711.h"] = String.raw`#pragma once
#include <Arduino.h>
#include "cl_hc.h"
class HX711 {
public:
  void begin(byte dout, byte pd_sck, byte gain = 128) { dt = dout; sck = pd_sck; pinMode(sck, OUTPUT); pinMode(dt, INPUT); cl_call(3, 1, 0, 0, dt, sck); }
  bool is_ready() { return cl_call(3, 1, 0, 0, dt, sck) != 0; }
  void wait_ready(unsigned long d = 0) { delay(10); }
  bool wait_ready_retry(int retries = 3, unsigned long d = 0) { return is_ready(); }
  bool wait_ready_timeout(unsigned long t = 1000, unsigned long d = 0) { return is_ready(); }
  long read() { delay(12); return cl_call(3, 2, 0, 0, dt, sck); }
  long read_average(byte times = 10) { long s = 0; if (!times) times = 1; for (byte i = 0; i < times; i++) s += read(); return s / times; }
  double get_value(byte times = 1) { return read_average(times) - OFFSET; }
  float get_units(byte times = 1) { return get_value(times) / SCALE; }
  void tare(byte times = 10) { set_offset(read_average(times)); }
  void set_scale(float scale = 1.f) { SCALE = scale ? scale : 1.f; }
  float get_scale() { return SCALE; }
  void set_offset(long offset = 0) { OFFSET = offset; }
  long get_offset() { return OFFSET; }
  void set_gain(byte gain = 128) {}
  void power_down() {}
  void power_up() {}
private:
  byte dt = 3, sck = 2; long OFFSET = 0; float SCALE = 1.f;
};
`;

/* ---------- RC522 RFID reader ---------- */
L["MFRC522.h"] = String.raw`#pragma once
#include <Arduino.h>
#include <SPI.h>
#include "cl_hc.h"
class MFRC522 {
public:
  typedef struct { byte size; byte uidByte[10]; byte sak; } Uid;
  enum PICC_Type : byte { PICC_TYPE_UNKNOWN, PICC_TYPE_ISO_14443_4, PICC_TYPE_ISO_18092, PICC_TYPE_MIFARE_MINI, PICC_TYPE_MIFARE_1K, PICC_TYPE_MIFARE_4K, PICC_TYPE_MIFARE_UL, PICC_TYPE_MIFARE_PLUS, PICC_TYPE_MIFARE_DESFIRE, PICC_TYPE_TNP3XXX, PICC_TYPE_NOT_COMPLETE = 0xff };
  enum StatusCode : byte { STATUS_OK, STATUS_ERROR, STATUS_COLLISION, STATUS_TIMEOUT, STATUS_NO_ROOM, STATUS_INTERNAL_ERROR, STATUS_INVALID, STATUS_CRC_WRONG, STATUS_MIFARE_NACK = 0xff };
  enum PCD_Register : byte { VersionReg = 0x37 << 1 };
  Uid uid;
  MFRC522() : ss(10), rst(9) {}
  MFRC522(byte resetPowerDownPin) : ss(10), rst(resetPowerDownPin) {}
  MFRC522(byte chipSelectPin, byte resetPowerDownPin) : ss(chipSelectPin), rst(resetPowerDownPin) {}
  void PCD_Init() { cl_call(4, 1, 0, 0, ss, rst); }
  void PCD_Init(byte cs, byte r) { ss = cs; rst = r; PCD_Init(); }
  void PCD_Reset() {}
  void PCD_AntennaOn() {}
  void PCD_AntennaOff() {}
  void PCD_SetAntennaGain(byte g) {}
  bool PCD_PerformSelfTest() { return cl_call(4, 1, 0, 0, ss, rst) != 0; }
  byte PCD_ReadRegister(byte reg) { return cl_call(4, 1, 0, 0, ss, rst) ? 0x92 : 0x00; }
  void PCD_DumpVersionToSerial() { Serial.print(F("Firmware Version: 0x")); Serial.print(PCD_ReadRegister(VersionReg), HEX); Serial.println(PCD_ReadRegister(VersionReg) ? F(" = v2.0") : F(" (unknown) - check the wiring")); }
  bool PICC_IsNewCardPresent() { return cl_call(4, 2, 0, 0, ss, rst) != 0; }
  bool PICC_ReadCardSerial() { byte b[5]; if (!cl_call(4, 3, b, 5, ss, rst)) return false; uid.size = 4; for (byte i = 0; i < 4; i++) uid.uidByte[i] = b[i]; uid.sak = b[4]; return true; }
  StatusCode PICC_HaltA() { cl_call(4, 4, 0, 0, ss, rst); return STATUS_OK; }
  void PCD_StopCrypto1() {}
  PICC_Type PICC_GetType(byte sak) { sak &= 0x7F; if (sak == 0x08) return PICC_TYPE_MIFARE_1K; if (sak == 0x00) return PICC_TYPE_MIFARE_UL; return PICC_TYPE_UNKNOWN; }
  static const __FlashStringHelper *PICC_GetTypeName(PICC_Type t) { if (t == PICC_TYPE_MIFARE_1K) return F("MIFARE 1KB"); if (t == PICC_TYPE_MIFARE_UL) return F("MIFARE Ultralight"); return F("Unknown type"); }
  static const __FlashStringHelper *GetStatusCodeName(StatusCode c) { return c == STATUS_OK ? F("Success.") : F("Error."); }
  void PICC_DumpDetailsToSerial(Uid *u) { Serial.print(F("Card UID:")); for (byte i = 0; i < u->size; i++) { Serial.print(u->uidByte[i] < 0x10 ? F(" 0") : F(" ")); Serial.print(u->uidByte[i], HEX); } Serial.println(); }
  void PICC_DumpToSerial(Uid *u) { PICC_DumpDetailsToSerial(u); }
private:
  byte ss, rst;
};
`;

/* ---------- MAX7219 LED matrix ---------- */
L["LedControl.h"] = String.raw`#pragma once
#include <Arduino.h>
#include "cl_hc.h"
class LedControl {
public:
  LedControl(int dataPin, int clkPin, int csPin, int numDevices = 1) : din(dataPin), clk(clkPin), cs(csPin), n(numDevices < 1 ? 1 : numDevices > 8 ? 8 : numDevices) {
    memset(st, 0, sizeof st); pinMode(din, OUTPUT); pinMode(clk, OUTPUT); pinMode(cs, OUTPUT); digitalWrite(cs, HIGH);
    cl_call(5, 1, 0, 0, n, ((int32_t)din << 16) | (clk << 8) | cs);
  }
  int getDeviceCount() { return n; }
  void shutdown(int addr, bool b) { if (ok(addr)) cl_call(5, 4, 0, 0, addr, b); }
  void setScanLimit(int addr, int limit) {}
  void setIntensity(int addr, int intensity) { if (ok(addr)) cl_call(5, 3, 0, 0, addr, intensity); }
  void clearDisplay(int addr) { if (!ok(addr)) return; memset(&st[addr * 8], 0, 8); push(addr); }
  void setLed(int addr, int row, int column, boolean state) {
    if (!ok(addr) || row < 0 || row > 7 || column < 0 || column > 7) return;
    byte v = 0x80 >> column; if (state) st[addr * 8 + row] |= v; else st[addr * 8 + row] &= ~v; push(addr);
  }
  void setRow(int addr, int row, byte value) { if (!ok(addr) || row < 0 || row > 7) return; st[addr * 8 + row] = value; push(addr); }
  void setColumn(int addr, int col, byte value) {
    if (!ok(addr) || col < 0 || col > 7) return;
    for (int row = 0; row < 8; row++) { byte v = 0x80 >> col; if ((value >> (7 - row)) & 1) st[addr * 8 + row] |= v; else st[addr * 8 + row] &= ~v; }
    push(addr);
  }
  void setDigit(int addr, int digit, byte value, boolean dp) {}
  void setChar(int addr, int digit, char value, boolean dp) {}
private:
  bool ok(int a) { return a >= 0 && a < n; }
  void push(int addr) { cl_call(5, 2, &st[addr * 8], 8, addr, ((int32_t)din << 16) | (clk << 8) | cs); }
  int din, clk, cs, n; byte st[64];
};
`;

/* ---------- Stepper (Arduino Stepper API) ---------- */
L["Stepper.h"] = String.raw`#pragma once
#include <Arduino.h>
class Stepper {
public:
  Stepper(int steps, int p1, int p2) : total(steps), wires(2), a(p1), b(p2), c(0), d(0) { init(); }
  Stepper(int steps, int p1, int p2, int p3, int p4) : total(steps), wires(4), a(p1), b(p2), c(p3), d(p4) { init(); }
  void setSpeed(long rpm) { if (rpm < 1) rpm = 1; stepDelay = 60L * 1000L * 1000L / total / rpm; }
  void step(int steps) {
    int left = abs(steps); bool fwd = steps > 0;
    while (left > 0) {
      unsigned long now = micros();
      if (now - last >= stepDelay) {
        last = now;
        if (fwd) { if (++num == total) num = 0; } else { if (num == 0) num = total; num--; }
        left--; out(num % 4);
      }
    }
  }
  int version(void) { return 5; }
private:
  void init() { pinMode(a, OUTPUT); pinMode(b, OUTPUT); if (wires == 4) { pinMode(c, OUTPUT); pinMode(d, OUTPUT); } setSpeed(10); }
  void w(int p, int v) { digitalWrite(p, v); }
  void out(int s) {
    if (wires == 2) { static const byte q[4] = { 1, 3, 2, 0 }; w(a, q[s] >> 1); w(b, q[s] & 1); return; }
    static const byte q[4] = { 0b1010, 0b0110, 0b0101, 0b1001 };
    w(a, (q[s] >> 3) & 1); w(b, (q[s] >> 2) & 1); w(c, (q[s] >> 1) & 1); w(d, q[s] & 1);
  }
  int total, wires, a, b, c, d, num = 0; unsigned long stepDelay = 0, last = 0;
};
`;

/* ---------- INA219 current sensor ---------- */
L["Adafruit_INA219.h"] = String.raw`#pragma once
#include <Arduino.h>
#include <Wire.h>
#include "cl_hc.h"
#define INA219_ADDRESS 0x40
class Adafruit_INA219 {
public:
  Adafruit_INA219(uint8_t addr = INA219_ADDRESS) : a_(addr) {}
  bool begin(TwoWire *w = &Wire) { ok_ = cl_call(7, 1, 0, 0, a_, 0) != 0; return ok_; }
  void setCalibration_32V_2A() {} void setCalibration_32V_1A() {} void setCalibration_16V_400mA() {}
  float getBusVoltage_V() { r(); return v[0]; }
  float getShuntVoltage_mV() { r(); return v[1]; }
  float getCurrent_mA() { r(); return v[2]; }
  float getPower_mW() { r(); return v[3]; }
  void powerSave(bool on) {}
  bool success() { return ok_; }
private:
  void r() { memset(v, 0, sizeof v); cl_call(7, 2, v, sizeof v, a_, 0); }
  uint8_t a_; bool ok_ = false; float v[4];
};
`;

/* ---------- TCS34725 colour sensor ---------- */
L["Adafruit_TCS34725.h"] = String.raw`#pragma once
#include <Arduino.h>
#include <Wire.h>
#include "cl_hc.h"
#define TCS34725_ADDRESS 0x29
#define TCS34725_INTEGRATIONTIME_2_4MS 0xFF
#define TCS34725_INTEGRATIONTIME_24MS 0xF6
#define TCS34725_INTEGRATIONTIME_50MS 0xEB
#define TCS34725_INTEGRATIONTIME_60MS 0xE7
#define TCS34725_INTEGRATIONTIME_101MS 0xD6
#define TCS34725_INTEGRATIONTIME_120MS 0xCE
#define TCS34725_INTEGRATIONTIME_154MS 0xC0
#define TCS34725_INTEGRATIONTIME_180MS 0xB5
#define TCS34725_INTEGRATIONTIME_199MS 0xAD
#define TCS34725_INTEGRATIONTIME_240MS 0x9C
#define TCS34725_INTEGRATIONTIME_300MS 0x83
#define TCS34725_INTEGRATIONTIME_600MS 0x06
#define TCS34725_INTEGRATIONTIME_614MS 0x00
typedef uint8_t tcs34725IntegrationTime_t;
typedef enum { TCS34725_GAIN_1X = 0, TCS34725_GAIN_4X, TCS34725_GAIN_16X, TCS34725_GAIN_60X } tcs34725Gain_t;
class Adafruit_TCS34725 {
public:
  Adafruit_TCS34725(uint8_t it = TCS34725_INTEGRATIONTIME_2_4MS, tcs34725Gain_t g = TCS34725_GAIN_1X) : itime(it), gain(g) {}
  bool begin(uint8_t addr = TCS34725_ADDRESS, TwoWire *w = &Wire) { return cl_call(6, 1, 0, 0, addr, 0) != 0; }
  bool init() { return begin(); }
  void setIntegrationTime(uint8_t it) { itime = it; }
  void setGain(tcs34725Gain_t g) { gain = g; }
  void getRawData(uint16_t *r, uint16_t *g, uint16_t *b, uint16_t *c) {
    uint16_t v[4] = { 0, 0, 0, 0 }; cl_call(6, 2, v, sizeof v, (256 - itime), gain);
    *r = v[0]; *g = v[1]; *b = v[2]; *c = v[3]; delay((256 - itime) * 12 / 5 + 1);
  }
  void getRawDataOneShot(uint16_t *r, uint16_t *g, uint16_t *b, uint16_t *c) { getRawData(r, g, b, c); }
  void getRGB(float *r, float *g, float *b) {
    uint16_t rr, gg, bb, cc; getRawData(&rr, &gg, &bb, &cc);
    if (!cc) { *r = *g = *b = 0; return; }
    *r = (float)rr / cc * 255.0; *g = (float)gg / cc * 255.0; *b = (float)bb / cc * 255.0;
  }
  uint16_t calculateColorTemperature(uint16_t r, uint16_t g, uint16_t b) {
    float X = (-0.14282F * r) + (1.54924F * g) + (-0.95641F * b), Y = (-0.32466F * r) + (1.57837F * g) + (-0.73191F * b), Z = (-0.68202F * r) + (0.77073F * g) + (0.56332F * b);
    float s = X + Y + Z; if (s <= 0) return 0; float xc = X / s, yc = Y / s, n = (xc - 0.3320F) / (0.1858F - yc);
    return (uint16_t)((449.0F * pow(n, 3)) + (3525.0F * pow(n, 2)) + (6823.3F * n) + 5520.33F);
  }
  uint16_t calculateColorTemperature_dn40(uint16_t r, uint16_t g, uint16_t b, uint16_t c) { return calculateColorTemperature(r, g, b); }
  uint16_t calculateLux(uint16_t r, uint16_t g, uint16_t b) { float l = (-0.32466F * r) + (1.57837F * g) + (-0.73191F * b); return l < 0 ? 0 : (uint16_t)l; }
  void setInterrupt(bool i) { cl_call(6, 3, 0, 0, i, 0); }
  void clearInterrupt() {}
  void setIntLimits(uint16_t l, uint16_t h) {}
  void enable() {} void disable() {}
private:
  uint8_t itime; tcs34725Gain_t gain;
};
`;

/* ---------- SoftwareSerial (HC-05 Bluetooth and other serial modules) ---------- */
L["SoftwareSerial.h"] = String.raw`#pragma once
#include <Arduino.h>
#include "cl_hc.h"
/* In Circuit Lab this talks to whatever serial module (for example an HC-05) is wired to the two pins. */
class SoftwareSerial : public Stream {
public:
  SoftwareSerial(uint8_t receivePin, uint8_t transmitPin, bool inverse_logic = false) : rx(receivePin), tx(transmitPin), h(-1) {}
  void begin(long speed) { h = cl_call(10, 1, 0, 0, rx, tx); }
  void end() {}
  bool listen() { return true; }
  bool isListening() { return true; }
  bool overflow() { return false; }
  int peek() { return h < 0 ? -1 : cl_call(10, 5, 0, 0, h, 0); }
  virtual size_t write(uint8_t b) { if (h >= 0) cl_call(10, 2, &b, 1, h, 0); return 1; }
  virtual size_t write(const uint8_t *buf, size_t n) { if (h >= 0) cl_call(10, 2, buf, n, h, 0); return n; }
  virtual int read() { return h < 0 ? -1 : cl_call(10, 4, 0, 0, h, 0); }
  virtual int available() { return h < 0 ? 0 : cl_call(10, 3, 0, 0, h, 0); }
  virtual void flush() {}
  operator bool() { return true; }
  using Print::write;
private:
  uint8_t rx, tx; int h;
};
`;

/* ======================= ESP32 teaching mode ======================= */
L["esp32_shim.h"] = String.raw`#pragma once
/* Circuit Lab ESP32 teaching mode: makes ESP32 Arduino code run on the simulator. */
#include <Arduino.h>
#include "cl_hc.h"
#include "cl_print.h"
#define ESP32 1
#define ARDUINO_ARCH_ESP32 1
#define ARDUINO_ESP32_DEV 1
#define IRAM_ATTR
#define DRAM_ATTR
#define RTC_DATA_ATTR
#define ICACHE_RAM_ATTR
#undef LED_BUILTIN
#define LED_BUILTIN 2
#define BUILTIN_LED 2
#define INPUT_PULLDOWN INPUT
#define A0 36
#define A3 39
#define A4 32
#define A5 33
#define A6 34
#define A7 35
#define A10 4
#define A11 0
#define A12 2
#define A13 15
#define A14 13
#define A15 12
#define A16 14
#define A17 27
#define A18 25
#define A19 26
#define T0 4
#define T1 0
#define T2 2
#define T3 15
#define T4 13
#define T5 12
#define T6 14
#define T7 27
#define T8 33
#define T9 32
#define DAC1 25
#define DAC2 26
#define ADC_0db 0
#define ADC_2_5db 1
#define ADC_6db 2
#define ADC_11db 3
#define ADC_ATTEN_DB_0 0
#define ADC_ATTEN_DB_11 3
#define ADC_ATTEN_DB_12 3
#define portTICK_PERIOD_MS 1
#define portMAX_DELAY 0xFFFFFFFF
#define vTaskDelay(t) delay(t)
#define pdMS_TO_TICKS(ms) (ms)
#define ESP_OK 0
#define ESP_FAIL -1
typedef int esp_err_t;
static uint8_t __cl_adc_bits = 12;
static const uint8_t __cl_adc_gpio[16] = { 36, 39, 34, 35, 32, 33, 25, 26, 27, 14, 12, 13, 15, 2, 4, 0 };
static inline void analogReadResolution(uint8_t b) { __cl_adc_bits = b; }
static inline void analogSetAttenuation(int a) {}
static inline void analogSetPinAttenuation(uint8_t p, int a) {}
static inline void analogSetWidth(uint8_t b) { __cl_adc_bits = b; }
static inline int __cl_analogRead(uint8_t gpio) {
  for (uint8_t k = 0; k < 16; k++) if (__cl_adc_gpio[k] == gpio) {
    long v = (analogRead)(54 + k); int s = __cl_adc_bits;
    if (s > 10) return (v << (s - 10)) | (v >> (20 - s));
    return v >> (10 - s);
  }
  return 0;
}
static inline uint32_t analogReadMilliVolts(uint8_t p) { uint8_t b = __cl_adc_bits; __cl_adc_bits = 12; long v = __cl_analogRead(p); __cl_adc_bits = b; return v * 3300L / 4095L; }
/* PWM (LEDC) */
static uint8_t __cl_ch_pin[16] = { 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255 };
static uint8_t __cl_ch_bits[16] = { 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8 };
static uint8_t __cl_pin_bits[40];
static uint8_t __cl_aw_bits = 8;
static inline void __cl_pwm(uint8_t pin, uint32_t duty, uint8_t bits) { uint32_t mx = (1UL << bits) - 1; if (duty > mx) duty = mx; cl_call(8, 1, 0, 0, pin, (int32_t)(duty * 65535UL / mx)); }
static inline uint32_t ledcSetup(uint8_t ch, uint32_t freq, uint8_t bits) { if (ch < 16) __cl_ch_bits[ch] = bits; return freq; }
static inline void ledcAttachPin(uint8_t pin, uint8_t ch) { if (ch < 16) __cl_ch_pin[ch] = pin; pinMode(pin, OUTPUT); }
static inline bool ledcAttach(uint8_t pin, uint32_t freq, uint8_t bits) { if (pin < 40) __cl_pin_bits[pin] = bits; pinMode(pin, OUTPUT); return true; }
static inline bool ledcAttachChannel(uint8_t pin, uint32_t freq, uint8_t bits, uint8_t ch) { ledcSetup(ch, freq, bits); ledcAttachPin(pin, ch); return true; }
static inline void ledcDetachPin(uint8_t pin) { for (uint8_t c = 0; c < 16; c++) if (__cl_ch_pin[c] == pin) __cl_ch_pin[c] = 255; }
static inline bool ledcDetach(uint8_t pin) { if (pin < 40) __cl_pin_bits[pin] = 0; return true; }
static inline bool ledcWrite(uint8_t x, uint32_t duty) {
  if (x < 40 && __cl_pin_bits[x]) { __cl_pwm(x, duty, __cl_pin_bits[x]); return true; }
  if (x < 16 && __cl_ch_pin[x] != 255) { __cl_pwm(__cl_ch_pin[x], duty, __cl_ch_bits[x]); return true; }
  __cl_pwm(x, duty, 8); return true;
}
static inline uint32_t ledcWriteTone(uint8_t x, uint32_t freq) { uint8_t pin = (x < 16 && __cl_ch_pin[x] != 255) ? __cl_ch_pin[x] : x; if (freq) tone(pin, freq); else noTone(pin); return freq; }
static inline uint32_t ledcWriteNote(uint8_t x, int note, uint8_t oct) { static const uint16_t f[12] = { 262, 277, 294, 311, 330, 349, 370, 392, 415, 440, 466, 494 }; return ledcWriteTone(x, (uint32_t)f[note % 12] << oct >> 4); }
static inline void analogWriteResolution(uint8_t b) { __cl_aw_bits = b; }
static inline void analogWriteResolution(uint8_t pin, uint8_t b) { __cl_aw_bits = b; }
static inline void analogWriteFrequency(uint32_t f) {}
static inline void analogWriteFrequency(uint8_t pin, uint32_t f) {}
static inline void __cl_analogWrite(uint8_t pin, int v) { pinMode(pin, OUTPUT); __cl_pwm(pin, v < 0 ? 0 : v, __cl_aw_bits); }
static inline void dacWrite(uint8_t pin, uint8_t v) { __cl_pwm(pin, v, 8); }
static inline uint16_t touchRead(uint8_t pin) { return (uint16_t)cl_call(12, 2, 0, 0, pin, 0); }
static inline float temperatureRead() { return 46.5; }
static inline int hallRead() { return 18; }
/* interrupts on any pin: checked whenever the sketch calls delay() */
void __cl_attachInterrupt(uint8_t pin, void (*f)(void), int mode);
void __cl_detachInterrupt(uint8_t pin);
/* chip helpers */
struct __ClEsp {
  void restart() { asm volatile("jmp 0"); }
  uint32_t getFreeHeap() { return 214000; }
  uint32_t getHeapSize() { return 327680; }
  uint32_t getChipId() { return 0xA1B2C3; }
  uint64_t getEfuseMac() { return 0xEFCDAB286F24ULL; }
  const char *getChipModel() { return "ESP32-D0WDQ6 (Circuit Lab)"; }
  uint8_t getChipRevision() { return 3; }
  uint8_t getChipCores() { return 2; }
  uint32_t getCpuFreqMHz() { return 240; }
  uint32_t getFlashChipSize() { return 4194304; }
  const char *getSdkVersion() { return "circuit-lab"; }
};
static __ClEsp ESP;
static inline uint32_t esp_random() { return ((uint32_t)random(0x7fff) << 16) ^ random(0x7fff); }
static inline void esp_restart() { ESP.restart(); }
static inline void esp_sleep_enable_timer_wakeup(uint64_t us) {}
static inline void esp_sleep_enable_ext0_wakeup(int pin, int level) {}
static inline void esp_deep_sleep_start() { Serial.println(F("[ESP32] deep sleep (simulation stops here)")); Serial.flush(); while (1) {} }
static inline void esp_deep_sleep(uint64_t us) { esp_deep_sleep_start(); }
static inline void esp_light_sleep_start() {}
static inline int64_t esp_timer_get_time() { return (int64_t)micros(); }
static inline void setCpuFrequencyMhz(uint32_t f) {}
static inline uint32_t getCpuFrequencyMhz() { return 240; }
static inline void disableCore0WDT() {}
static inline void disableCore1WDT() {}
`;
L["esp32_late.h"] = String.raw`#pragma once
/* ESP32 teaching mode: these replace Arduino functions in YOUR sketch only (added after your #include lines). */
#define analogRead(p) __cl_analogRead(p)
#define analogWrite(p, v) __cl_analogWrite(p, v)
#undef digitalPinToInterrupt
#define digitalPinToInterrupt(p) (p)
#define attachInterrupt(n, f, m) __cl_attachInterrupt(n, f, m)
#define detachInterrupt(n) __cl_detachInterrupt(n)
`;
L["esp32_shim.cpp"] = String.raw`#include "esp32_shim.h"
struct __ClInt { uint8_t pin; void (*f)(void); int mode; uint8_t last; };
static __ClInt __cl_ints[8];
static uint8_t __cl_nints = 0;
void __cl_net_poll();
void __cl_attachInterrupt(uint8_t pin, void (*f)(void), int mode) {
  for (uint8_t i = 0; i < __cl_nints; i++) if (__cl_ints[i].pin == pin) { __cl_ints[i].f = f; __cl_ints[i].mode = mode; return; }
  if (__cl_nints < 8) { __cl_ints[__cl_nints].pin = pin; __cl_ints[__cl_nints].f = f; __cl_ints[__cl_nints].mode = mode; __cl_ints[__cl_nints].last = digitalRead(pin); __cl_nints++; }
}
void __cl_detachInterrupt(uint8_t pin) { for (uint8_t i = 0; i < __cl_nints; i++) if (__cl_ints[i].pin == pin) __cl_ints[i].f = 0; }
static bool __cl_in_yield = false;
void yield(void) {
  if (__cl_in_yield) return; __cl_in_yield = true;
  for (uint8_t i = 0; i < __cl_nints; i++) {
    __ClInt &it = __cl_ints[i]; uint8_t v = digitalRead(it.pin);
    if (it.f && v != it.last) { bool fire = it.mode == CHANGE || (it.mode == RISING && v) || (it.mode == FALLING && !v); it.last = v; if (fire) it.f(); }
    it.last = v;
  }
  __cl_net_poll();
  __cl_in_yield = false;
}
__attribute__((weak)) void __cl_net_poll() {}
`;

L["ESP32Servo.h"] = String.raw`#pragma once
#include <Arduino.h>
#include "cl_hc.h"
#define MIN_PULSE_WIDTH 544
#define MAX_PULSE_WIDTH 2400
#define DEFAULT_PULSE_WIDTH 1500
class Servo {
public:
  int attach(int p) { return attach(p, MIN_PULSE_WIDTH, MAX_PULSE_WIDTH); }
  int attach(int p, int mn, int mx) { pin = p; lo = mn; hi = mx; pinMode(p, OUTPUT); return 1; }
  void detach() { pin = -1; }
  void write(int v) { if (v < 200) { if (v < 0) v = 0; if (v > 180) v = 180; ang = v; writeMicroseconds(map(v, 0, 180, lo, hi)); } else writeMicroseconds(v); }
  void writeMicroseconds(int us) { us_ = us; if (pin >= 0) cl_call(8, 2, 0, 0, pin, us); }
  int read() { return map(us_, lo, hi, 0, 180); }
  int readMicroseconds() { return us_; }
  bool attached() { return pin >= 0; }
  void setPeriodHertz(int hz) {}
private:
  int pin = -1, lo = MIN_PULSE_WIDTH, hi = MAX_PULSE_WIDTH, ang = 90, us_ = 1500;
};
class ESP32PWM { public: static void allocateTimer(int t) {} };
`;

L["WiFi.h"] = String.raw`#pragma once
#include <Arduino.h>
#include <IPAddress.h>
#include <Client.h>
#include <Server.h>
#include "cl_hc.h"
/* Circuit Lab pretend Wi-Fi: connects instantly to a simulated network; web pages open in the Phone panel. */
typedef enum { WL_NO_SHIELD = 255, WL_IDLE_STATUS = 0, WL_NO_SSID_AVAIL = 1, WL_SCAN_COMPLETED = 2, WL_CONNECTED = 3, WL_CONNECT_FAILED = 4, WL_CONNECTION_LOST = 5, WL_DISCONNECTED = 6 } wl_status_t;
typedef enum { WIFI_OFF = 0, WIFI_STA = 1, WIFI_AP = 2, WIFI_AP_STA = 3 } wifi_mode_t;
#define WIFI_MODE_NULL WIFI_OFF
#define WIFI_MODE_STA WIFI_STA
#define WIFI_MODE_AP WIFI_AP
#define WIFI_MODE_APSTA WIFI_AP_STA
#define WIFI_AUTH_OPEN 0
#define WIFI_PS_NONE 0
#define WIFI_POWER_19_5dBm 78
class WiFiClass {
public:
  wl_status_t begin(const char *ssid, const char *pass = 0, int32_t ch = 0, const uint8_t *bssid = 0, bool connect = true) { cl_call(9, 1, ssid, strlen(ssid)); return WL_DISCONNECTED; }
  wl_status_t begin(const String &s, const String &p) { return begin(s.c_str(), p.c_str()); }
  wl_status_t begin() { return begin("Saved network"); }
  wl_status_t status() { return (wl_status_t)cl_call(9, 2); }
  bool isConnected() { return status() == WL_CONNECTED; }
  IPAddress localIP() { return IPAddress(192, 168, 1, 50); }
  IPAddress gatewayIP() { return IPAddress(192, 168, 1, 1); }
  IPAddress subnetMask() { return IPAddress(255, 255, 255, 0); }
  IPAddress dnsIP(uint8_t i = 0) { return IPAddress(8, 8, 8, 8); }
  IPAddress softAPIP() { return IPAddress(192, 168, 4, 1); }
  bool softAP(const char *ssid, const char *pass = 0, int ch = 1, int hidden = 0, int maxc = 4) { cl_call(9, 9, ssid, strlen(ssid)); return true; }
  bool softAPConfig(IPAddress a, IPAddress b, IPAddress c) { return true; }
  uint8_t softAPgetStationNum() { return 1; }
  bool config(IPAddress a, IPAddress b, IPAddress c, IPAddress d = IPAddress(), IPAddress e = IPAddress()) { return true; }
  bool mode(wifi_mode_t m) { mode_ = m; return true; }
  wifi_mode_t getMode() { return mode_; }
  bool disconnect(bool off = false, bool erase = false) { cl_call(9, 10); return true; }
  bool reconnect() { return true; }
  void setAutoReconnect(bool b) {}
  bool setAutoConnect(bool b) { return true; }
  void persistent(bool b) {}
  bool setHostname(const char *h) { return true; }
  const char *getHostname() { return "esp32-circuitlab"; }
  void setSleep(bool s) {}
  bool setTxPower(int p) { return true; }
  String macAddress() { return String("24:6F:28:AB:CD:EF"); }
  uint8_t *macAddress(uint8_t *m) { static const uint8_t d[6] = { 0x24, 0x6F, 0x28, 0xAB, 0xCD, 0xEF }; memcpy(m, d, 6); return m; }
  String softAPmacAddress() { return String("24:6F:28:AB:CD:F0"); }
  String SSID() { return String("CircuitLab-WiFi"); }
  String SSID(uint8_t i) { static const char *n[3] = { "CircuitLab-WiFi", "School-Lab", "Robotics-Club" }; return String(n[i % 3]); }
  int32_t RSSI() { return -52; }
  int32_t RSSI(uint8_t i) { return -45 - 12 * i; }
  uint8_t encryptionType(uint8_t i) { return 3; }
  int32_t channel() { return 6; }
  int32_t channel(uint8_t i) { return 1 + 5 * i; }
  int16_t scanNetworks(bool async = false, bool hidden = false) { return 3; }
  int16_t scanComplete() { return 3; }
  void scanDelete() {}
  int hostByName(const char *h, IPAddress &ip) { ip = IPAddress(93, 184, 216, 34); return 1; }
  void onEvent(void (*cb)(int)) {}
private:
  wifi_mode_t mode_ = WIFI_STA;
};
static WiFiClass WiFi;
/* raw TCP client: used for HTTP requests to the pretend internet */
class WiFiClient : public Client {
public:
  WiFiClient() : id(0) {}
  WiFiClient(int i) : id(i) {}
  int connect(IPAddress ip, uint16_t port) { return 1; }
  int connect(const char *host, uint16_t port) { return 1; }
  size_t write(uint8_t b) { if (id) cl_call(9, 4, &b, 1, id, 0); return 1; }
  size_t write(const uint8_t *buf, size_t n) { if (id) cl_call(9, 4, buf, n, id, 0); return n; }
  int available() { return id ? cl_call(9, 13, 0, 0, id, 0) : 0; }
  int read() { if (!id) return -1; uint8_t b; return cl_call(9, 11, &b, 1, id, 0) == 1 ? b : -1; }
  int read(uint8_t *buf, size_t n) { return id ? cl_call(9, 11, buf, n, id, 0) : 0; }
  int peek() { return id ? cl_call(9, 14, 0, 0, id, 0) : -1; }
  void flush() {}
  void stop() { if (id) cl_call(9, 12, 0, 0, id, 0); id = 0; }
  uint8_t connected() { return id != 0 && cl_call(9, 15, 0, 0, id, 0); }
  operator bool() { return id != 0; }
  IPAddress remoteIP() { return IPAddress(192, 168, 1, 23); }
  void setTimeout(uint32_t t) {}
  using Print::write;
  int id;
};
class WiFiServer : public Server {
public:
  WiFiServer(uint16_t port = 80, uint8_t maxc = 4) {}
  void begin() { cl_call(9, 16); }
  void begin(uint16_t port) { begin(); }
  WiFiClient available() { int id = cl_call(9, 3); return WiFiClient(id > 0 ? id : 0); }
  WiFiClient accept() { return available(); }
  size_t write(uint8_t b) { return 1; }
  void setNoDelay(bool b) {}
  void end() {}
  void stop() {}
  operator bool() { return true; }
  using Print::write;
};
class WiFiUDP : public Stream {
public:
  uint8_t begin(uint16_t port) { return 1; }
  void stop() {}
  int beginPacket(const char *host, uint16_t port) { return 1; }
  int beginPacket(IPAddress ip, uint16_t port) { return 1; }
  int endPacket() { return 1; }
  size_t write(uint8_t b) { return 1; }
  size_t write(const uint8_t *b, size_t n) { return n; }
  int parsePacket() { return 0; }
  int available() { return 0; }
  int read() { return -1; }
  int read(unsigned char *b, size_t n) { return 0; }
  int peek() { return -1; }
  void flush() {}
  IPAddress remoteIP() { return IPAddress(192, 168, 1, 23); }
  uint16_t remotePort() { return 4210; }
  using Print::write;
};
`;
L["WiFiClient.h"] = `#pragma once\n#include "WiFi.h"\n`;
L["WiFiServer.h"] = `#pragma once\n#include "WiFi.h"\n`;
L["WiFiUdp.h"] = `#pragma once\n#include "WiFi.h"\n`;
L["WiFiAP.h"] = `#pragma once\n#include "WiFi.h"\n`;
L["WiFiMulti.h"] = String.raw`#pragma once
#include "WiFi.h"
class WiFiMulti { public: bool addAP(const char *s, const char *p = 0) { if (!first) first = s; return true; } uint8_t run(uint32_t t = 5000) { if (first) WiFi.begin(first); return WiFi.status(); } private: const char *first = 0; };
`;
L["WiFiClientSecure.h"] = String.raw`#pragma once
#include "WiFi.h"
class WiFiClientSecure : public WiFiClient { public: void setInsecure() {} void setCACert(const char *c) {} void setCertificate(const char *c) {} void setPrivateKey(const char *k) {} };
`;
L["ESPmDNS.h"] = String.raw`#pragma once
#include "WiFi.h"
class MDNSResponder { public: bool begin(const char *n) { return true; } void addService(const char *a, const char *b, uint16_t p) {} void end() {} };
static MDNSResponder MDNS;
`;
L["esp_wifi.h"] = String.raw`#pragma once
#include "WiFi.h"
#define WIFI_IF_STA 0
#define WIFI_IF_AP 1
#define WIFI_SECOND_CHAN_NONE 0
typedef int esp_err_t;
static inline esp_err_t esp_wifi_set_channel(uint8_t c, int s) { return 0; }
static inline esp_err_t esp_wifi_get_mac(int ifx, uint8_t *m) { WiFi.macAddress(m); return 0; }
static inline esp_err_t esp_wifi_set_ps(int t) { return 0; }
static inline esp_err_t esp_wifi_set_promiscuous(bool e) { return 0; }
`;
L["WebServer.h"] = String.raw`#pragma once
#include <Arduino.h>
#include "WiFi.h"
/* Circuit Lab web server: requests come from the Phone panel (browser) in the simulator. */
enum HTTPMethod { HTTP_ANY, HTTP_GET, HTTP_HEAD, HTTP_POST, HTTP_PUT, HTTP_PATCH, HTTP_DELETE, HTTP_OPTIONS };
typedef void (*THandlerFunction)(void);
class WebServer {
public:
  WebServer(int port = 80) : n(0), nf(0), sent(false), id(0), nargs(0) {}
  void begin() { cl_call(9, 16); }
  void begin(uint16_t p) { begin(); }
  void close() {}
  void stop() {}
  void on(const String &uri, THandlerFunction h) { on(uri, HTTP_ANY, h); }
  void on(const String &uri, HTTPMethod m, THandlerFunction h) { if (n < 16) { uris[n] = uri; meth[n] = m; hs[n] = h; n++; } }
  void onNotFound(THandlerFunction h) { nf = h; }
  void handleClient() {
    int r = cl_call(9, 3); if (r <= 0) return;
    id = r; sent = false; nargs = 0; char buf[200]; int len = cl_call(9, 11, buf, sizeof(buf) - 1, id, 1); if (len < 0) len = 0; buf[len] = 0;
    char *sp = strchr(buf, ' '); method_ = HTTP_GET; if (!strncmp(buf, "POST", 4)) method_ = HTTP_POST;
    char *path = sp ? sp + 1 : buf; char *end = strchr(path, ' '); if (end) *end = 0;
    char *q = strchr(path, '?'); if (q) { *q = 0; parse(q + 1); }
    char *body = end ? strstr(end + 1, "\r\n\r\n") : 0; if (body && body[4]) parse(body + 4);
    uri_ = path;
    for (int i = 0; i < n; i++) if (uris[i] == uri_ && (meth[i] == HTTP_ANY || meth[i] == method_)) { hs[i](); finish(); return; }
    if (nf) nf(); else send(404, "text/plain", "Not found: " + uri_);
    finish();
  }
  void send(int code, const char *type, const String &content) { send(code, type, content.c_str(), content.length()); }
  void send(int code, const String &type, const String &content) { send(code, type.c_str(), content.c_str(), content.length()); }
  void send(int code, const char *type, const char *content) { send(code, type, content, strlen(content)); }
  void send(int code) { send(code, "text/plain", "", 0); }
  void send_P(int code, PGM_P type, PGM_P content) {
    char t[32]; strncpy_P(t, type, 31); t[31] = 0; head(code, t);
    char chunk[64]; size_t len = strlen_P(content);
    for (size_t i = 0; i < len; i += sizeof chunk) { size_t k = len - i < sizeof chunk ? len - i : sizeof chunk; memcpy_P(chunk, content + i, k); cl_call(9, 4, chunk, k, id, 0); }
    sent = true;
  }
  void send_P(int code, PGM_P type, PGM_P content, size_t len) { send_P(code, type, content); }
  void sendHeader(const String &name, const String &value, bool first = false) { if (name.equalsIgnoreCase("Location")) { String h = "LOCATION:" + value; cl_call(9, 17, h.c_str(), h.length(), id, 0); } }
  void setContentLength(size_t l) {}
  void sendContent(const String &c) { if (!sent) head(200, "text/html"); cl_call(9, 4, c.c_str(), c.length(), id, 0); }
  void sendContent_P(PGM_P c) { if (!sent) head(200, "text/html"); char chunk[64]; size_t len = strlen_P(c); for (size_t i = 0; i < len; i += 64) { size_t k = len - i < 64 ? len - i : 64; memcpy_P(chunk, c + i, k); cl_call(9, 4, chunk, k, id, 0); } }
  String arg(const String &name) { for (int i = 0; i < nargs; i++) if (an[i] == name) return av[i]; return String(); }
  String arg(int i) { return i < nargs ? av[i] : String(); }
  String argName(int i) { return i < nargs ? an[i] : String(); }
  int args() { return nargs; }
  bool hasArg(const String &name) { for (int i = 0; i < nargs; i++) if (an[i] == name) return true; return false; }
  String uri() { return uri_; }
  HTTPMethod method() { return method_; }
  String header(const String &n) { return String(); }
  bool hasHeader(const String &n) { return false; }
  String hostHeader() { return String("192.168.1.50"); }
  WiFiClient client() { return WiFiClient(id); }
  bool authenticate(const char *u, const char *p) { return true; }
  void requestAuthentication() {}
  void enableCORS(bool b = true) {}
private:
  void head(int code, const char *type) { char h[48]; snprintf(h, sizeof h, "%d %s", code, type); cl_call(9, 17, h, strlen(h), id, 0); sent = true; }
  void send(int code, const char *type, const char *c, size_t len) { head(code, type); for (size_t i = 0; i < len; i += 64) cl_call(9, 4, c + i, len - i < 64 ? len - i : 64, id, 0); }
  void finish() { if (!sent) send(200, "text/plain", "", 0); cl_call(9, 12, 0, 0, id, 0); id = 0; }
  static String dec(const String &s) { String o; for (unsigned i = 0; i < s.length(); i++) { char c = s[i]; if (c == '+') o += ' '; else if (c == '%' && i + 2 < s.length()) { char hx[3] = { s[i + 1], s[i + 2], 0 }; o += (char)strtol(hx, 0, 16); i += 2; } else o += c; } return o; }
  void parse(char *q) {
    while (q && *q && nargs < 8) { char *amp = strchr(q, '&'); if (amp) *amp = 0; char *eq = strchr(q, '='); if (eq) { *eq = 0; an[nargs] = dec(q); av[nargs] = dec(eq + 1); } else { an[nargs] = dec(q); av[nargs] = ""; } nargs++; q = amp ? amp + 1 : 0; }
  }
  String uris[16]; HTTPMethod meth[16]; THandlerFunction hs[16]; int n; THandlerFunction nf; bool sent; int id;
  String an[8], av[8]; int nargs; String uri_; HTTPMethod method_;
};
`;
L["HTTPClient.h"] = String.raw`#pragma once
#include <Arduino.h>
#include "WiFi.h"
/* Circuit Lab pretend internet: requests are answered by the simulator and shown in the Network panel. */
#define HTTP_CODE_OK 200
#define HTTP_CODE_MOVED_PERMANENTLY 301
#define HTTP_CODE_NOT_FOUND 404
#define HTTPC_ERROR_CONNECTION_REFUSED -1
class HTTPClient {
public:
  bool begin(const String &url) { u = url; return true; }
  bool begin(WiFiClient &c, const String &url) { u = url; return true; }
  bool begin(const String &host, uint16_t port, const String &path) { u = "http://" + host + path; return true; }
  void addHeader(const String &n, const String &v, bool f = false, bool r = true) {}
  void setTimeout(uint16_t t) {}
  void setConnectTimeout(int32_t t) {}
  void setAuthorization(const char *u, const char *p) {}
  void setFollowRedirects(int f) {}
  int GET() { return req("GET", ""); }
  int POST(const String &p) { return req("POST", p); }
  int POST(uint8_t *p, size_t n) { String s; for (size_t i = 0; i < n; i++) s += (char)p[i]; return req("POST", s); }
  int PUT(const String &p) { return req("PUT", p); }
  int PATCH(const String &p) { return req("PATCH", p); }
  int sendRequest(const char *m, const String &p) { return req(m, p); }
  String getString() {
    String s; char buf[33]; int k;
    while ((k = cl_call(9, 7, buf, 32, 0, 0)) > 0) { buf[k] = 0; s += buf; }
    return s;
  }
  int getSize() { return cl_call(9, 18); }
  void end() {}
  static String errorToString(int e) { return String("connection refused"); }
  bool connected() { return true; }
  WiFiClient &getStream() { static WiFiClient c; return c; }
private:
  int req(const char *m, const String &payload) { String line = String(m) + " " + u + "\n" + payload; return cl_call(9, 6, line.c_str(), line.length()); }
  String u;
};
`;
L["PubSubClient.h"] = String.raw`#pragma once
#include <Arduino.h>
#include "WiFi.h"
/* Circuit Lab pretend MQTT broker: messages appear in the Network panel. */
#define MQTT_CONNECTED 0
#define MQTT_MAX_PACKET_SIZE 256
#define MQTT_CALLBACK_SIGNATURE void (*callback)(char *, uint8_t *, unsigned int)
class PubSubClient {
public:
  PubSubClient() {}
  PubSubClient(Client &c) {}
  PubSubClient &setServer(const char *d, uint16_t p) { return *this; }
  PubSubClient &setServer(IPAddress ip, uint16_t p) { return *this; }
  PubSubClient &setClient(Client &c) { return *this; }
  PubSubClient &setCallback(void (*cb)(char *, uint8_t *, unsigned int)) { callback = cb; return *this; }
  bool setBufferSize(uint16_t s) { return true; }
  PubSubClient &setKeepAlive(uint16_t k) { return *this; }
  bool connect(const char *id) { return con(id); }
  bool connect(const char *id, const char *u, const char *p) { return con(id); }
  bool connect(const char *id, const char *wt, uint8_t wq, bool wr, const char *wm) { return con(id); }
  bool connect(const char *id, const char *u, const char *p, const char *wt, uint8_t wq, bool wr, const char *wm) { return con(id); }
  void disconnect() { c_ = false; }
  bool connected() { return c_; }
  int state() { return c_ ? 0 : -1; }
  bool publish(const char *t, const char *p) { return pub(t, p, false); }
  bool publish(const char *t, const char *p, bool r) { return pub(t, p, r); }
  bool publish(const char *t, const uint8_t *p, unsigned int n) { String s; for (unsigned i = 0; i < n; i++) s += (char)p[i]; return pub(t, s.c_str(), false); }
  bool publish(const char *t, const uint8_t *p, unsigned int n, bool r) { return publish(t, p, n); }
  bool subscribe(const char *t, uint8_t q = 0) { cl_call(9, 21, t, strlen(t)); return true; }
  bool unsubscribe(const char *t) { return true; }
  bool loop() {
    char buf[160]; int k = cl_call(9, 22, buf, sizeof(buf) - 1); if (k <= 0 || !callback) return c_;
    buf[k] = 0; char *sep = strchr(buf, '\n'); if (!sep) return c_; *sep = 0; uint8_t *p = (uint8_t *)(sep + 1);
    callback(buf, p, strlen((char *)p)); return c_;
  }
private:
  bool con(const char *id) { c_ = true; cl_call(9, 19, id, strlen(id)); return true; }
  bool pub(const char *t, const char *p, bool r) { String s = String(t) + "\n" + p; cl_call(9, 20, s.c_str(), s.length()); return c_; }
  bool c_ = false; void (*callback)(char *, uint8_t *, unsigned int) = 0;
};
`;
L["esp_now.h"] = String.raw`#pragma once
#include <Arduino.h>
#include "WiFi.h"
/* Circuit Lab pretend ESP-NOW: packets you send show in the Network panel; the panel can send packets back. */
#define ESP_NOW_ETH_ALEN 6
#define ESP_NOW_MAX_DATA_LEN 250
#define ESP_ERR_ESPNOW_NOT_INIT 0x3069
typedef int esp_err_t;
typedef enum { ESP_NOW_SEND_SUCCESS = 0, ESP_NOW_SEND_FAIL } esp_now_send_status_t;
typedef enum { WIFI_IF_STA_ = 0 } wifi_interface_t;
typedef struct { uint8_t peer_addr[6]; uint8_t lmk[16]; uint8_t channel; int ifidx; bool encrypt; void *priv; } esp_now_peer_info_t;
typedef struct { uint8_t *src_addr; uint8_t *des_addr; void *rx_ctrl; } esp_now_recv_info_t;
typedef void (*esp_now_send_cb_t)(const uint8_t *mac, esp_now_send_status_t status);
typedef void (*esp_now_recv_cb_t)(const uint8_t *mac, const uint8_t *data, int len);
typedef void (*esp_now_recv_cb3_t)(const esp_now_recv_info_t *info, const uint8_t *data, int len);
extern esp_now_send_cb_t __cl_en_send;
extern esp_now_recv_cb_t __cl_en_recv;
extern esp_now_recv_cb3_t __cl_en_recv3;
static inline esp_err_t esp_now_init() { cl_call(9, 23); return 0; }
static inline esp_err_t esp_now_deinit() { return 0; }
static inline esp_err_t esp_now_register_send_cb(esp_now_send_cb_t cb) { __cl_en_send = cb; return 0; }
static inline esp_err_t esp_now_register_recv_cb(esp_now_recv_cb_t cb) { __cl_en_recv = cb; return 0; }
static inline esp_err_t esp_now_register_recv_cb(esp_now_recv_cb3_t cb) { __cl_en_recv3 = cb; return 0; }
static inline esp_err_t esp_now_add_peer(const esp_now_peer_info_t *p) { return 0; }
static inline esp_err_t esp_now_del_peer(const uint8_t *m) { return 0; }
static inline bool esp_now_is_peer_exist(const uint8_t *m) { return true; }
static inline esp_err_t esp_now_send(const uint8_t *mac, const uint8_t *data, size_t len) {
  static const uint8_t bc[6] = { 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF }; if (!mac) mac = bc;
  cl_call(9, 24, data, len, 0, 0);
  if (__cl_en_send) __cl_en_send(mac, ESP_NOW_SEND_SUCCESS);
  return 0;
}
`;
L["esp_now_cl.cpp"] = String.raw`#include "esp_now.h"
esp_now_send_cb_t __cl_en_send = 0;
esp_now_recv_cb_t __cl_en_recv = 0;
esp_now_recv_cb3_t __cl_en_recv3 = 0;
void __cl_net_poll() {
  if (!__cl_en_recv && !__cl_en_recv3) return;
  uint8_t buf[64]; int k = cl_call(9, 25, buf, sizeof buf); if (k <= 0) return;
  static uint8_t mac[6] = { 0x24, 0x6F, 0x28, 0x11, 0x22, 0x33 };
  if (__cl_en_recv) __cl_en_recv(mac, buf, k);
  if (__cl_en_recv3) { esp_now_recv_info_t info; info.src_addr = mac; info.des_addr = mac; info.rx_ctrl = 0; __cl_en_recv3(&info, buf, k); }
}
`;
L["BluetoothSerial.h"] = String.raw`#pragma once
#include <Arduino.h>
#include "cl_hc.h"
/* Circuit Lab: the ESP32's built-in Bluetooth talks to the Phone panel. */
class BluetoothSerial : public Stream {
public:
  bool begin(const String &name = "ESP32", bool master = false) { h = cl_call(10, 1, name.c_str(), name.length(), -1, -1); return true; }
  bool begin(const char *name, bool master = false) { return begin(String(name)); }
  void end() {}
  bool hasClient() { return true; }
  bool connected(int t = 0) { return true; }
  int available() { return h < 0 ? 0 : cl_call(10, 3, 0, 0, h, 0); }
  int read() { return h < 0 ? -1 : cl_call(10, 4, 0, 0, h, 0); }
  int peek() { return h < 0 ? -1 : cl_call(10, 5, 0, 0, h, 0); }
  size_t write(uint8_t b) { if (h >= 0) cl_call(10, 2, &b, 1, h, 0); return 1; }
  size_t write(const uint8_t *b, size_t n) { if (h >= 0) cl_call(10, 2, b, n, h, 0); return n; }
  void flush() {}
  bool setPin(const char *p) { return true; }
  void enableSSP() {}
  using Print::write;
private:
  int h = -1;
};
`;
L["Preferences.h"] = String.raw`#pragma once
#include <Arduino.h>
#include <EEPROM.h>
/* Circuit Lab: Preferences stored in the simulated EEPROM (simple key hash). */
class Preferences {
public:
  bool begin(const char *ns, bool ro = false) { base = (hash(ns) % 16) * 128; return true; }
  void end() {}
  bool clear() { for (int i = 0; i < 128; i++) EEPROM.update(base + i, 0xFF); return true; }
  bool remove(const char *k) { return true; }
  size_t putInt(const char *k, int32_t v) { EEPROM.put(slot(k), v); return 4; }
  size_t putUInt(const char *k, uint32_t v) { EEPROM.put(slot(k), v); return 4; }
  size_t putFloat(const char *k, float v) { EEPROM.put(slot(k), v); return 4; }
  size_t putBool(const char *k, bool v) { EEPROM.put(slot(k), (int32_t)v); return 1; }
  size_t putULong(const char *k, uint32_t v) { return putUInt(k, v); }
  size_t putLong(const char *k, int32_t v) { return putInt(k, v); }
  int32_t getInt(const char *k, int32_t d = 0) { int32_t v; EEPROM.get(slot(k), v); return v == -1 ? d : v; }
  uint32_t getUInt(const char *k, uint32_t d = 0) { uint32_t v; EEPROM.get(slot(k), v); return v == 0xFFFFFFFF ? d : v; }
  uint32_t getULong(const char *k, uint32_t d = 0) { return getUInt(k, d); }
  int32_t getLong(const char *k, int32_t d = 0) { return getInt(k, d); }
  float getFloat(const char *k, float d = 0) { uint32_t raw; EEPROM.get(slot(k), raw); if (raw == 0xFFFFFFFF) return d; float v; EEPROM.get(slot(k), v); return v; }
  bool getBool(const char *k, bool d = false) { int32_t v; EEPROM.get(slot(k), v); return v == -1 ? d : v != 0; }
  bool isKey(const char *k) { uint32_t v; EEPROM.get(slot(k), v); return v != 0xFFFFFFFF; }
private:
  static uint16_t hash(const char *s) { uint16_t h = 5381; while (*s) h = h * 33 + *s++; return h; }
  int slot(const char *k) { return base + (hash(k) % 32) * 4; }
  int base = 0;
};
`;

/* library name -> files that must travel with it */
const DEPS = {
  "Adafruit_SSD1306.h": ["cl_hc.h"], "Adafruit_MPU6050.h": ["cl_hc.h"], "MPU6050.h": ["cl_hc.h"], "I2Cdev.h": [], "HX711.h": ["cl_hc.h"], "MFRC522.h": ["cl_hc.h"],
  "LedControl.h": ["cl_hc.h"], "Stepper.h": [], "Adafruit_INA219.h": ["cl_hc.h"], "Adafruit_TCS34725.h": ["cl_hc.h"], "SoftwareSerial.h": ["cl_hc.h"],
  "esp32_shim.h": ["cl_hc.h", "cl_print.h", "esp32_shim.cpp", "esp32_late.h"], "esp32_late.h": [], "ESP32Servo.h": ["cl_hc.h"], "WiFi.h": ["cl_hc.h"], "WiFiClient.h": ["WiFi.h"], "WiFiServer.h": ["WiFi.h"],
  "WiFiUdp.h": ["WiFi.h"], "WiFiAP.h": ["WiFi.h"], "WiFiMulti.h": ["WiFi.h"], "WiFiClientSecure.h": ["WiFi.h"], "ESPmDNS.h": ["WiFi.h"], "esp_wifi.h": ["WiFi.h"],
  "WebServer.h": ["WiFi.h"], "HTTPClient.h": ["WiFi.h"], "PubSubClient.h": ["WiFi.h"], "esp_now.h": ["WiFi.h", "esp_now_cl.cpp"], "BluetoothSerial.h": ["cl_hc.h"],
  "Preferences.h": [], "cl_print.h": [], "cl_hc.h": [], "esp32_shim.cpp": ["esp32_shim.h"], "esp_now_cl.cpp": ["esp_now.h"],
};
/* libraries students may include that only exist in ESP32 mode */
Object.assign(L, L2, L3, L4, L5);
Object.assign(DEPS, DEPS2, DEPS3, DEPS4, DEPS5);
const ESP_ONLY = new Set(["esp32_shim.h", "ESP32Servo.h", "WiFi.h", "WiFiClient.h", "WiFiServer.h", "WiFiUdp.h", "WiFiAP.h", "WiFiMulti.h", "WiFiClientSecure.h", "ESPmDNS.h", "esp_wifi.h", "WebServer.h", "HTTPClient.h", "PubSubClient.h", "esp_now.h", "BluetoothSerial.h", "Preferences.h"]);

/* libraries the online compiler already has (used by the code library and error help) */
export const BUILTIN_LIBS = ["Servo", "Wire", "SPI", "EEPROM", "SoftwareSerial", "DHT", "Adafruit_NeoPixel", "FastLED", "LiquidCrystal", "LiquidCrystal_I2C", "Adafruit_GFX", "Keypad", "MD_Parola", "MD_MAX72xx", "RTClib", "SD", "Adafruit_Sensor"];
export const EXTRA_LIBS = Object.keys(L).filter(k => k.endsWith(".h") && !k.startsWith("cl_") && k !== "esp32_shim.h");

/* Prepare a sketch for the compiler: attach our libraries, and for the ESP32 add the compatibility layer.
   Returns { sketch, files, lineOffset } - lineOffset is subtracted from compiler error line numbers. */
export function prepareSketch(code, board) {
  const esp = board === "esp32";
  const need = new Set();
  const add = f => { if (need.has(f) || !L[f]) return; need.add(f); (DEPS[f] || []).forEach(add); };
  let src = code;
  const notes = [];
  src = src.replace(/^(\s*#\s*include\s*)[<"]([^>"]+)[>"]/gm, (m, pre, name) => {
    let n = name.trim();
    if (esp && n === "Servo.h") n = "ESP32Servo.h";
    if (esp && (n === "ESPAsyncWebServer.h" || n === "AsyncTCP.h")) { notes.push("ESPAsyncWebServer is not available in Circuit Lab. Use WebServer.h instead."); return m; }
    if (L[n] && (esp || !ESP_ONLY.has(n))) { add(n); return `${pre}"${n}"`; }
    if (!esp && ESP_ONLY.has(n)) notes.push(`${n} is an ESP32 library. Switch the board to ESP32 DevKit (or remove it).`);
    return m;
  });
  if (/\.\s*printf\s*\(/.test(src)) { src = src.replace(/\b([A-Za-z_]\w*)\s*\.\s*printf\s*\(/g, "__cl_printf($1, "); add("cl_print.h"); }
  let prefix = "";
  if (esp) {
    add("esp32_shim.h");
    src = src.replace(/\b(Serial\d?)\s*\.\s*begin\s*\(\s*([^,()]+?)\s*,[^;]*?\)\s*;/g, "$1.begin($2);");
    src = src.replace(/\bWire\s*\.\s*begin\s*\(\s*[^,()]+\s*,\s*[^,()]+\s*(,[^()]*)?\)/g, "Wire.begin()");
    src = src.replace(/\bEEPROM\s*\.\s*begin\s*\([^)]*\)/g, "__cl_true()").replace(/\bEEPROM\s*\.\s*commit\s*\(\s*\)/g, "__cl_true()").replace(/\bEEPROM\s*\.\s*end\s*\(\s*\)/g, "__cl_true()");
    prefix = '#include "esp32_shim.h"\n';
  }
  if (need.has("cl_print.h") && !esp) prefix = '#include "cl_print.h"\n' + prefix;
  let lateAt = -1;
  if (esp) {   // the ESP32 replacements go after the sketch's own #include lines
    const lines = src.split("\n"); let last = -1;
    lines.forEach((l, i) => { if (/^\s*#\s*include/.test(l)) last = i; });
    lines.splice(last + 1, 0, '#include "esp32_late.h"'); lateAt = last + 1; src = lines.join("\n");
  }
  const files = [...need].map(name => ({ name, content: L[name] }));
  const top = prefix ? prefix.split("\n").length - 1 : 0;
  /* compiler line -> line in the student's code */
  const mapLine = n => { let k = n - top; if (lateAt >= 0 && k > lateAt + 1) k--; return k; };
  return { sketch: prefix + src, files, lineOffset: top, mapLine, notes };
}
export const LIB_SOURCES = L;
