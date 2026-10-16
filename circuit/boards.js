/* Circuit Lab - microcontroller boards.
   Arduino Uno runs on an emulated ATmega328P. The ESP32 DevKit runs in "teaching mode": the sketch is compiled for an
   ATmega2560 with a small compatibility layer (esp32_shim.h) so GPIO numbers, analogRead (12-bit), PWM, Serial and
   pretend Wi-Fi all work. Pins and logic behave like an ESP32; timing-critical radio code does not. */
import {
  timer0Config, timer1Config, timer2Config, usart0Config, adcConfig, twiConfig, spiConfig, eepromConfig,
  portAConfig, portBConfig, portCConfig, portDConfig, portEConfig, portFConfig, portGConfig, portHConfig, portJConfig, portKConfig, portLConfig,
  ADCMuxInputType,
} from "../vendor/avr8js.mjs";

/* ---------- ATmega328P (Uno) ---------- */
const UNO_PORTS = { B: portBConfig, C: portCConfig, D: portDConfig };
const unoPinPort = n => (n < 8 ? ["D", n] : n < 14 ? ["B", n - 8] : n < 20 ? ["C", n - 14] : null);

/* ---------- ATmega2560 (used for ESP32 teaching mode) ---------- */
const MEGA_PORTS = { A: portAConfig, B: portBConfig, C: portCConfig, D: portDConfig, E: portEConfig, F: portFConfig, G: portGConfig, H: portHConfig, J: portJConfig, K: portKConfig, L: portLConfig };
const MEGA_MAP = ("E0 E1 E4 E5 G5 E3 H3 H4 H5 H6 B4 B5 B6 B7 J1 J0 H1 H0 D3 D2 D1 D0 A0 A1 A2 A3 A4 A5 A6 A7 C7 C6 C5 C4 C3 C2 C1 C0 D7 G2 G1 G0 " +
  "L7 L6 L5 L4 L3 L2 L1 L0 B3 B2 B1 B0 F0 F1 F2 F3 F4 F5 F6 F7 K0 K1 K2 K3 K4 K5 K6 K7").split(" ").map(s => [s[0], +s[1]]);
const megaPinPort = n => MEGA_MAP[n] || null;
const megaMux = {}; for (let i = 0; i < 8; i++) { megaMux[i] = { type: ADCMuxInputType.SingleEnded, channel: i }; megaMux[0x20 + i] = { type: ADCMuxInputType.SingleEnded, channel: 8 + i }; }
const MEGA = {
  flash: 0x40000, sram: 0x2100,
  ports: MEGA_PORTS, pinPort: megaPinPort, pins: 70,
  timers: [
    Object.assign({}, timer0Config, { ovfInterrupt: 0x2e, compAInterrupt: 0x2a, compBInterrupt: 0x2c, compPortA: portBConfig.PORT, compPinA: 7, compPortB: portGConfig.PORT, compPinB: 5 }),
    Object.assign({}, timer1Config, { captureInterrupt: 0x20, compAInterrupt: 0x22, compBInterrupt: 0x24, compCInterrupt: 0x26, ovfInterrupt: 0x28, compPortA: portBConfig.PORT, compPinA: 5, compPortB: portBConfig.PORT, compPinB: 6 }),
    Object.assign({}, timer2Config, { compAInterrupt: 0x1a, compBInterrupt: 0x1c, ovfInterrupt: 0x1e, compPortA: portBConfig.PORT, compPinA: 4, compPortB: portHConfig.PORT, compPinB: 6 }),
  ],
  usart: Object.assign({}, usart0Config, { rxCompleteInterrupt: 0x32, dataRegisterEmptyInterrupt: 0x34, txCompleteInterrupt: 0x36 }),
  adc: Object.assign({}, adcConfig, { adcInterrupt: 0x3a, numChannels: 16, muxInputMask: 0x3f, muxChannels: megaMux }),
  twi: Object.assign({}, twiConfig, { twiInterrupt: 0x4e }),
  spi: Object.assign({}, spiConfig, { spiInterrupt: 0x30 }),
  eeprom: Object.assign({}, eepromConfig, { eepromReadyInterrupt: 0x3c }),
  eepromSize: 4096,
};
const M328 = {
  flash: 0x8000, sram: 8192,
  ports: UNO_PORTS, pinPort: unoPinPort, pins: 20,
  timers: [timer0Config, timer1Config, timer2Config],
  usart: usart0Config, adc: adcConfig, twi: twiConfig, spi: spiConfig, eeprom: eepromConfig, eepromSize: 1024,
};


/* ---------- Arduino Nano (same ATmega328P, but A6/A7 are analog-only) ---------- */
const M328N = Object.assign({}, M328, { pins: 22 });
function nanoPins() {
  const m = {};
  for (let i = 0; i <= 13; i++) m[String(i)] = { n: i, label: "D" + i, pwm: [3, 5, 6, 9, 10, 11].includes(i) };
  for (let i = 0; i <= 7; i++) m["A" + i] = { n: 14 + i, adc: i, label: "A" + i };
  m["11.2"] = m["11"]; m["12.2"] = m["12"]; m["13.2"] = m["13"];
  return m;
}
/* ---------- Arduino Mega 2560 ---------- */
function megaPins() {
  const m = {};
  for (let i = 0; i <= 53; i++) m[String(i)] = { n: i, label: "D" + i, pwm: (i >= 2 && i <= 13) || (i >= 44 && i <= 46) };
  for (let i = 0; i <= 15; i++) m["A" + i] = { n: 54 + i, adc: i, label: "A" + i };
  m.SDA = { n: 20, label: "SDA" }; m.SCL = { n: 21, label: "SCL" };
  return m;
}

/* ---------- board definitions ----------
   pins: board pin name -> { n: MCU arduino pin number, adc: ADC channel, label } */
function unoPins() {
  const m = {};
  for (let i = 0; i <= 13; i++) m[String(i)] = { n: i, label: "D" + i, pwm: [3, 5, 6, 9, 10, 11].includes(i) };
  for (let i = 0; i <= 5; i++) m["A" + i] = { n: 14 + i, adc: i, label: "A" + i };
  m["A4.2"] = m.A4; m["A5.2"] = m.A5; // SDA / SCL header
  return m;
}
const ESP_ADC = [36, 39, 34, 35, 32, 33, 25, 26, 27, 14, 12, 13, 15, 2, 4, 0];
function espPins() {
  const m = {};
  [2, 4, 5, 12, 13, 14, 15, 18, 19, 21, 22, 23, 25, 26, 27, 32, 33, 34, 35].forEach(g => { m["D" + g] = { n: g, label: "GPIO" + g, pwm: g < 34 }; });
  m.VP = { n: 36, label: "GPIO36" }; m.VN = { n: 39, label: "GPIO39" };
  m.RX2 = { n: 16, label: "GPIO16" }; m.TX2 = { n: 17, label: "GPIO17" };
  Object.values(m).forEach(p => { const k = ESP_ADC.indexOf(p.n); if (k >= 0) p.adc = k; });
  return m;
}
export const BOARDS = {
  uno: {
    label: "Arduino Uno", mcu: M328, build: "uno", logic: 5,
    pins: unoPins(), power: { "5V": 5, IOREF: 5, VIN: 5, "3.3V": 3.3, "GND.1": 0, "GND.2": 0, "GND.3": 0 },
    joined: [["GND.1", "GND.2"], ["GND.1", "GND.3"], ["A4", "A4.2"], ["A5", "A5.2"], ["5V", "IOREF"]],
    i2c: { sda: "A4", scl: "A5" }, spi: { mosi: "11", miso: "12", sck: "13", ss: "10" }, led: 13,
    vcc: "5V", gnd: "GND.2", gnd2: "GND.1",
  },
  esp32: {
    label: "ESP32 DevKit", mcu: MEGA, build: "mega", logic: 3.3, esp: true,
    pins: espPins(), power: { VIN: 5, "3V3": 3.3, "GND.1": 0, "GND.2": 0 },
    joined: [["GND.1", "GND.2"]],
    i2c: { sda: "D21", scl: "D22" }, spi: { mosi: "D23", miso: "D19", sck: "D18", ss: "D5" }, led: 2,
    vcc: "VIN", gnd: "GND.2", gnd2: "GND.1", v33: "3V3",
  },
  nano: {
    label: "Arduino Nano", mcu: M328N, build: "nano", logic: 5,
    pins: nanoPins(), power: { "5V": 5, "5V.2": 5, VIN: 5, "3.3V": 3.3, AREF: 5, "GND.1": 0, "GND.2": 0, "GND.3": 0 },
    joined: [["GND.1", "GND.2"], ["GND.1", "GND.3"], ["5V", "5V.2"], ["11", "11.2"], ["12", "12.2"], ["13", "13.2"]],
    i2c: { sda: "A4", scl: "A5" }, spi: { mosi: "11", miso: "12", sck: "13", ss: "10" }, led: 13,
    vcc: "5V", gnd: "GND.1", gnd2: "GND.2",
  },
  mega: {
    label: "Arduino Mega 2560", mcu: MEGA, build: "mega", logic: 5,
    pins: megaPins(), power: { "5V": 5, "5V.1": 5, "5V.2": 5, IOREF: 5, VIN: 5, "3.3V": 3.3, "GND.1": 0, "GND.2": 0, "GND.3": 0, "GND.4": 0, "GND.5": 0 },
    joined: [["GND.1", "GND.2"], ["GND.1", "GND.3"], ["GND.1", "GND.4"], ["GND.1", "GND.5"], ["5V", "5V.1"], ["5V", "5V.2"], ["5V", "IOREF"], ["20", "SDA"], ["21", "SCL"]],
    i2c: { sda: "20", scl: "21" }, spi: { mosi: "51", miso: "50", sck: "52", ss: "53" }, led: 13,
    vcc: "5V", gnd: "GND.2", gnd2: "GND.3",
  },
};
export const BOARD_TYPES = Object.keys(BOARDS);
export const isBoard = t => t in BOARDS;
export const ESP_ADC_PINS = ESP_ADC;

/* Intel HEX (handles extended address records for the 256 KB ESP32/Mega image) */
export function loadHex(hex, size) {
  const flash = new Uint8Array(size);
  let base = 0;
  for (const line of hex.split("\n")) {
    if (line[0] !== ":") continue;
    const n = parseInt(line.substr(1, 2), 16), addr = parseInt(line.substr(3, 4), 16), type = parseInt(line.substr(7, 2), 16);
    if (type === 2) { base = parseInt(line.substr(9, 4), 16) << 4; continue; }
    if (type === 4) { base = parseInt(line.substr(9, 4), 16) << 16; continue; }
    if (type !== 0) continue;
    for (let i = 0; i < n; i++) { const a = base + addr + i; if (a < size) flash[a] = parseInt(line.substr(9 + i * 2, 2), 16); }
  }
  return new Uint16Array(flash.buffer);
}
