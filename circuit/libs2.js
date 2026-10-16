/* Circuit Lab - extra Arduino libraries for the parts added in rounds 2 and 3.
   Small API-compatible re-implementations written for the simulator, not copies of the originals. */
export const L2 = {};
export const DEPS2 = {};

/* ---------- TM1637 4-digit display. This one really bit-bangs the two-wire protocol,
     so the simulator decodes exactly what a real chip would see. ---------- */
L2["TM1637Display.h"] = String.raw`#pragma once
#include <Arduino.h>
#define SEG_A 0x01
#define SEG_B 0x02
#define SEG_C 0x04
#define SEG_D 0x08
#define SEG_E 0x10
#define SEG_F 0x20
#define SEG_G 0x40
#define SEG_DP 0x80
static const uint8_t __tm_digits[16] = { 0x3f,0x06,0x5b,0x4f,0x66,0x6d,0x7d,0x07,0x7f,0x6f,0x77,0x7c,0x39,0x5e,0x79,0x71 };
class TM1637Display {
public:
  TM1637Display(uint8_t clk, uint8_t dio, unsigned int delayUs = 100) : c(clk), d(dio), us(delayUs < 5 ? 5 : delayUs), bright(0x0f) {
    pinMode(c, OUTPUT); pinMode(d, OUTPUT); digitalWrite(c, HIGH); digitalWrite(d, HIGH);
  }
  void setBrightness(uint8_t b, bool on = true) { bright = (b & 7) | (on ? 8 : 0); }
  void clear() { uint8_t z[4] = {0,0,0,0}; setSegments(z, 4, 0); }
  void setSegments(const uint8_t segments[], uint8_t length = 4, uint8_t pos = 0) {
    start(); writeByte(0x40); stop();
    start(); writeByte(0xc0 + (pos & 3));
    for (uint8_t i = 0; i < length; i++) writeByte(segments[i]);
    stop();
    start(); writeByte(0x80 | bright); stop();
  }
  void showNumberDec(long num, bool leadingZero = false, uint8_t length = 4, uint8_t pos = 0) { showNumberDecEx(num, 0, leadingZero, length, pos); }
  void showNumberDecEx(long num, uint8_t dots = 0, bool leadingZero = false, uint8_t length = 4, uint8_t pos = 0) {
    uint8_t seg[4]; bool neg = num < 0; if (neg) num = -num;
    for (int8_t i = length - 1; i >= 0; i--) {
      uint8_t digit = num % 10;
      if (num == 0 && !leadingZero && i != length - 1) seg[i] = 0;
      else seg[i] = encodeDigit(digit);
      num /= 10;
    }
    if (neg) seg[0] = SEG_G;
    for (uint8_t i = 0; i < length; i++) if (dots & (0x80 >> i)) seg[i] |= SEG_DP;
    setSegments(seg, length, pos);
  }
  static uint8_t encodeDigit(uint8_t d) { return __tm_digits[d & 0x0f]; }
private:
  void bitDelay() { delayMicroseconds(us); }
  void start() { digitalWrite(d, LOW); bitDelay(); digitalWrite(c, LOW); bitDelay(); }
  void stop() { digitalWrite(d, LOW); bitDelay(); digitalWrite(c, HIGH); bitDelay(); digitalWrite(d, HIGH); bitDelay(); }
  void writeByte(uint8_t b) {
    for (uint8_t i = 0; i < 8; i++) { digitalWrite(c, LOW); bitDelay(); digitalWrite(d, (b & 1) ? HIGH : LOW); bitDelay(); digitalWrite(c, HIGH); bitDelay(); b >>= 1; }
    digitalWrite(c, LOW); digitalWrite(d, HIGH); bitDelay(); digitalWrite(c, HIGH); bitDelay(); digitalWrite(c, LOW); bitDelay();
  }
  uint8_t c, d; unsigned int us; uint8_t bright;
};
`;

/* ---------- IRremote (the parts students use) ---------- */
L2["IRremote.h"] = String.raw`#pragma once
#include <Arduino.h>
#include "cl_hc.h"
#define NEC 1
#define UNKNOWN 0
struct IRData { uint16_t address; uint16_t command; uint8_t protocol; uint8_t flags; uint32_t decodedRawData; };
class ClIrReceiver {
public:
  IRData decodedIRData;
  void begin(uint8_t pin, bool enableLED = false, uint8_t x = 0) { p = pin; cl_call(13, 1, 0, 0, pin, 0); }
  void enableIRIn(uint8_t pin) { begin(pin); }
  bool decode() {
    int32_t v = cl_call(13, 2, 0, 0, p, 0);
    if (v < 0) return false;
    decodedIRData.command = v & 0xff; decodedIRData.address = (v >> 8) & 0xff;
    decodedIRData.protocol = NEC; decodedIRData.flags = 0;
    decodedIRData.decodedRawData = ((uint32_t)decodedIRData.command << 16) | decodedIRData.address;
    last = v & 0xff;
    return true;
  }
  void resume() {}
  void start() {} void stop() {} void restartTimer() {}
  void printIRResultShort(Print *out) { if (out) { out->print(F("Protocol=NEC Address=0x")); out->print(decodedIRData.address, HEX); out->print(F(" Command=0x")); out->println(decodedIRData.command, HEX); } }
  uint8_t last = 0;
private:
  uint8_t p = 2;
};
static ClIrReceiver IrReceiver;
/* the older API some tutorials still use */
struct decode_results { unsigned long value; int decode_type; };
class IRrecv {
public:
  IRrecv(int pin) : p(pin) {}
  void enableIRIn() { cl_call(13, 1, 0, 0, p, 0); }
  void blink13(bool) {}
  bool decode(decode_results *r) {
    int32_t v = cl_call(13, 2, 0, 0, p, 0);
    if (v < 0) return false;
    r->value = (uint32_t)(v & 0xff); r->decode_type = NEC; return true;
  }
  void resume() {}
private:
  int p;
};
`;
DEPS2["IRremote.h"] = ["cl_hc.h"];
DEPS2["TM1637Display.h"] = [];
