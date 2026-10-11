/* Circuit Lab - netlist + Arduino Uno simulation (avr8js, MIT). */
import {
  CPU, avrInstruction, AVRTimer, timer0Config, timer1Config, timer2Config, AVRIOPort, portBConfig, portCConfig, portDConfig,
  AVRUSART, usart0Config, AVRADC, adcConfig, AVRTWI, twiConfig, AVREEPROM, EEPROMMemoryBackend, eepromConfig, PinState,
} from "../vendor/avr8js.mjs";
import { BB_GROUPS } from "./parts.js";

const F = 16e6;
const US = F / 1e6; // cycles per microsecond

/* ---------- Intel HEX ---------- */
export function loadHex(hex) {
  const flash = new Uint8Array(0x8000);
  for (const line of hex.split("\n")) {
    if (line[0] !== ":") continue;
    const n = parseInt(line.substr(1, 2), 16), addr = parseInt(line.substr(3, 4), 16), type = parseInt(line.substr(7, 2), 16);
    if (type !== 0) continue;
    for (let i = 0; i < n; i++) flash[addr + i] = parseInt(line.substr(9 + i * 2, 2), 16);
  }
  return new Uint16Array(flash.buffer);
}

/* ---------- Uno pin map ---------- */
export const UNO = (() => {
  const m = {};
  for (let i = 0; i <= 7; i++) m[String(i)] = { n: i, port: "D", bit: i };
  for (let i = 8; i <= 13; i++) m[String(i)] = { n: i, port: "B", bit: i - 8 };
  for (let i = 0; i <= 5; i++) m["A" + i] = { n: 14 + i, port: "C", bit: i, adc: i };
  m["A4.2"] = m.A4; m["A5.2"] = m.A5;
  return m;
})();
const UNO_POWER = { "5V": 5, IOREF: 5, VIN: 5, "3.3V": 3.3, "GND.1": 0, "GND.2": 0, "GND.3": 0 };
const PIN_NAME = n => (n < 14 ? "D" + n : "A" + (n - 14));

/* ---------- union-find netlist ---------- */
export class Netlist {
  constructor(project, pinsWorld, partState) {
    this.parent = {};
    const nodes = [];
    const add = id => { if (!(id in this.parent)) { this.parent[id] = id; nodes.push(id); } };
    const parts = project.parts;
    const byId = {}; parts.forEach(p => { byId[p.id] = p; });
    const pinMap = {};
    parts.forEach(p => { pinMap[p.id] = pinsWorld(p) || []; pinMap[p.id].forEach(q => add(p.id + ":" + q.name)); });
    this.pins = pinMap;
    const U = (a, b) => { add(a); add(b); const ra = this.find(a), rb = this.find(b); if (ra !== rb) this.parent[ra] = rb; };
    // wires
    project.wires.forEach(w => { if (w.from && w.to) U(w.from, w.to); });
    // internal links
    parts.forEach(p => {
      const id = p.id, st = partState[id] || {};
      if (p.type === "uno") { U(id + ":GND.1", id + ":GND.2"); U(id + ":GND.1", id + ":GND.3"); U(id + ":A4", id + ":A4.2"); U(id + ":A5", id + ":A5.2"); U(id + ":5V", id + ":IOREF"); }
      if (p.type === "button") { U(id + ":1.l", id + ":1.r"); U(id + ":2.l", id + ":2.r"); }
      if (p.type === "seg7") U(id + ":COM.1", id + ":COM.2");
      if (p.type === "breadboard") BB_GROUPS.forEach(g => { for (let i = 1; i < g.length; i++) U(id + ":" + g[0], id + ":" + g[i]); });
    });
    // breadboard insertion: part pins sitting on holes
    const holes = [];
    parts.filter(p => p.type === "breadboard").forEach(b => (pinMap[b.id] || []).forEach(h => holes.push({ id: b.id + ":" + h.name, x: h.x, y: h.y })));
    if (holes.length) {
      const grid = {};
      holes.forEach(h => { const k = Math.round(h.x / 8) + "," + Math.round(h.y / 8); (grid[k] = grid[k] || []).push(h); });
      parts.filter(p => p.type !== "breadboard").forEach(p => (pinMap[p.id] || []).forEach(q => {
        const gx = Math.round(q.x / 8), gy = Math.round(q.y / 8);
        for (let dx = -1; dx <= 1; dx++) for (let dy = -1; dy <= 1; dy++) (grid[(gx + dx) + "," + (gy + dy)] || []).forEach(h => {
          if (Math.abs(h.x - q.x) < 4 && Math.abs(h.y - q.y) < 4) U(p.id + ":" + q.name, h.id);
        });
      }));
    }
    // switches stay out of the union: they open and close while running
    this.sw = {};
    const edge = (pid, a, b, closed) => { const ra = this.find(pid + ":" + a), rb = this.find(pid + ":" + b); if (ra === rb) return; (this.sw[ra] = this.sw[ra] || []).push({ o: rb, closed, pid }); (this.sw[rb] = this.sw[rb] || []).push({ o: ra, closed, pid }); };
    parts.forEach(p => {
      const st = partState[p.id] || (partState[p.id] = {});
      if (p.type === "button") edge(p.id, "1.l", "2.l", () => !!st.pressed);
      if (p.type === "slideswitch") { edge(p.id, "2", "1", () => !st.value); edge(p.id, "2", "3", () => !!st.value); }
    });
    // nets
    this.nets = {};
    nodes.forEach(n => { const r = this.find(n); (this.nets[r] = this.nets[r] || []).push(n); });
    // resistors = weak links between nets
    this.weak = {};
    parts.filter(p => p.type === "resistor").forEach(p => {
      const a = this.find(p.id + ":1"), b = this.find(p.id + ":2");
      if (a === b) return;
      (this.weak[a] = this.weak[a] || []).push(b); (this.weak[b] = this.weak[b] || []).push(a);
    });
    // fixed power and arduino pins per net
    this.power = {}; this.unoPins = {}; this.pinRoot = {};
    const uno = parts.find(p => p.type === "uno");
    this.unoId = uno ? uno.id : null;
    Object.keys(this.nets).forEach(r => {
      this.nets[r].forEach(n => {
        const [pid, pin] = n.split(":"), part = byId[pid];
        if (!part) return;
        if (part.type === "uno") {
          if (pin in UNO_POWER) (this.power[r] = this.power[r] || []).push(UNO_POWER[pin]);
          if (UNO[pin]) { const no = UNO[pin].n; (this.unoPins[r] = this.unoPins[r] || []); if (!this.unoPins[r].includes(no)) this.unoPins[r].push(no); this.pinRoot[no] = r; }
        }
        if (part.type === "battery") (this.power[r] = this.power[r] || []).push(pin === "+" ? 9 : 0);
      });
    });
  }
  find(x) { if (!(x in this.parent)) return x; while (this.parent[x] !== x) { this.parent[x] = this.parent[this.parent[x]]; x = this.parent[x]; } return x; }
  root(pid, pin) { return this.find(pid + ":" + pin); }
  connected(a, b) { return this.find(a) === this.find(b); }
  /* arduino pins on this net or one resistor away */
  drivers(r) { const out = (this.unoPins[r] || []).map(n => ({ n, weak: false })); (this.weak[r] || []).forEach(w => (this.unoPins[w] || []).forEach(n => out.push({ n, weak: true }))); return out; }
}

/* ---------- HD44780 LCD controller ---------- */
class LCDCore {
  constructor(el) { this.el = el; this.reset(); }
  reset() { this.mode8 = true; this.hi = null; this.dd = new Uint8Array(128).fill(32); this.addr = 0; this.inc = true; this.on = true; this.cur = false; this.blk = false; this.cg = false; this.dirty = true; }
  cmd(b) {
    if (b & 0x80) { this.addr = b & 0x7f; this.cg = false; }
    else if (b & 0x40) { this.cg = true; }
    else if (b & 0x20) { this.mode8 = !!(b & 0x10); }
    else if (b & 0x10) { if (!(b & 0x08)) this.addr = (this.addr + ((b & 0x04) ? 1 : -1)) & 0x7f; }
    else if (b & 0x08) { this.on = !!(b & 4); this.cur = !!(b & 2); this.blk = !!(b & 1); }
    else if (b & 0x04) { this.inc = !!(b & 2); }
    else if (b & 0x02) { this.addr = 0; }
    else if (b & 0x01) { this.dd.fill(32); this.addr = 0; this.inc = true; }
    this.dirty = true;
  }
  data(b) { if (this.cg) return; this.dd[this.addr] = b; this.addr = (this.addr + (this.inc ? 1 : -1)) & 0x7f; this.dirty = true; }
  /* one E falling edge. byte = D7..D0 (8-bit) or nibble in D7..D4 */
  strobe(rs, d) {
    if (this.mode8) { rs ? this.data(d) : this.cmd(d); this.hi = null; return; }
    const nib = (d >> 4) & 0xf;
    if (this.hi === null) { this.hi = nib; return; }
    const b = (this.hi << 4) | nib; this.hi = null; rs ? this.data(b) : this.cmd(b);
  }
  render(backlight) {
    if (!this.dirty && this._bl === backlight) return; this.dirty = false; this._bl = backlight;
    const cols = 16, ch = new Uint8Array(32);
    for (let i = 0; i < cols; i++) { ch[i] = this.on ? this.dd[i] : 32; ch[16 + i] = this.on ? this.dd[0x40 + i] : 32; }
    this.el.characters = ch; this.el.backlight = backlight;
    this.el.cursor = this.on && this.cur; this.el.blink = this.on && this.blk;
    this.el.cursorX = this.addr & 0x3f; this.el.cursorY = this.addr >= 0x40 ? 1 : 0;
  }
}

/* ---------- simulator ---------- */
export class Sim {
  constructor({ project, rt, net, program, onSerial, onWarn }) {
    this.project = project; this.rt = rt; this.net = net; this.onSerial = onSerial; this.onWarn = onWarn || (() => {});
    const cpu = this.cpu = new CPU(program);
    this.timers = [new AVRTimer(cpu, timer0Config), new AVRTimer(cpu, timer1Config), new AVRTimer(cpu, timer2Config)];
    this.ports = { B: new AVRIOPort(cpu, portBConfig), C: new AVRIOPort(cpu, portCConfig), D: new AVRIOPort(cpu, portDConfig) };
    this.usart = new AVRUSART(cpu, usart0Config, F);
    this.usart.onByteTransmit = b => { this.onSerial && this.onSerial(String.fromCharCode(b)); this.txAt = performance.now(); };
    this.rxQueue = [];
    this.adc = new AVRADC(cpu, adcConfig);
    this.twi = new AVRTWI(cpu, twiConfig, F);
    this.eeprom = new AVREEPROM(cpu, new EEPROMMemoryBackend(1024), eepromConfig);
    this.pin = []; for (let i = 0; i < 20; i++) this.pin.push({ lv: 0, last: 0, hi: 0, win: 0, duty: 0 });
    this.watch = {}; // arduino pin -> [fn(level, cycles)]
    this.outputs = {}; // net root -> [fn() -> voltage|null]
    this.devices = []; this.i2c = {};
    this.warnings = new Set();
    this.eff = new Array(20).fill(-1);
    Object.entries(this.ports).forEach(([name, port]) => {
      port.addListener(v => {
        for (let b = 0; b < 8; b++) {
          const n = this.pinNo(name, b); if (n > 19) continue;
          const out = this.isOut(n), e = out ? (v >> b) & 1 : ((v >> b) & 1 ? -2 : -1);
          if (e !== this.eff[n]) { const wasOut = this.eff[n] >= 0; this.eff[n] = e; if (out || wasOut) this.pinChanged(n, out ? e : 0, out); if (!out) this.updateInput(n); }
        }
      });
    });
    this.setupI2C();
    this.setupDevices();
    this.refreshInputs();
  }
  pinNo(port, bit) { return port === "D" ? bit : port === "B" ? (bit < 6 ? 8 + bit : 99) : (bit < 6 ? 14 + bit : 99); }
  portOf(n) { return n < 8 ? ["D", n] : n < 14 ? ["B", n - 8] : ["C", n - 14]; }
  state(n) { const [p, b] = this.portOf(n); return this.ports[p].pinState(b); }
  isOut(n) { const s = this.state(n); return s === PinState.High || s === PinState.Low; }
  pinChanged(n, level, out) {
    const p = this.pin[n], c = this.cpu.cycles;
    if (p.lv) p.hi += c - p.last;
    p.lv = level; p.last = c;
    const ws = this.watch[n]; if (ws) for (const f of ws) f(level, c, out);
    const aff = this.affects && this.affects[n]; if (aff) aff.forEach(q => this.updateInput(q));
  }
  /* ----- levels ----- */
  group(r) {
    const sw = this.net.sw; if (!sw[r]) return [r];
    const seen = new Set([r]), st = [r];
    while (st.length) { const x = st.pop(); for (const e of sw[x] || []) if (!seen.has(e.o) && e.closed()) { seen.add(e.o); st.push(e.o); } }
    return [...seen];
  }
  strong(r, exclude) {
    const g = this.group(r);
    if (g.length === 1) return this.strong1(r, exclude);
    let best = null; for (const x of g) { const s = this.strong1(x, exclude); if (s && (!best || s.src === "power" || (s.src === "pin" && best.src === "out"))) best = s; }
    return best;
  }
  strong1(r, exclude) {
    let v = null, src = null, n = 0, lo = false, hi = false;
    const pw = this.net.power[r]; if (pw) for (const x of pw) { v = x; src = "power"; n++; if (x < 1) lo = true; else hi = true; }
    const up = this.net.unoPins[r]; if (up) for (const no of up) { if (no === exclude || !this.isOut(no)) continue; const x = this.pin[no].lv ? 5 : 0; if (src !== "power" || v === null) { v = x; src = "pin"; this._srcPin = no; } n++; if (x < 1) lo = true; else hi = true; }
    const os = this.outputs[r]; if (os) for (const f of os) { const x = f(); if (x === null || x === undefined) continue; if (v === null) { v = x; src = "out"; } n++; if (x < 1) lo = true; else if (x > 2.5) hi = true; }
    if (lo && hi) this.warnings.add("Short circuit: a wire joins HIGH (5V) to LOW (GND). Check your wiring.");
    return v === null ? null : { v, src, pin: src === "pin" ? this._srcPin : null };
  }
  level(r, exclude) {
    const s = this.strong(r, exclude); if (s) return Object.assign(s, { weak: false });
    for (const x of this.group(r)) for (const w of this.net.weak[x] || []) { const s2 = this.strong(w, exclude); if (s2) return Object.assign(s2, { weak: true }); }
    return null;
  }
  updateInput(n) {
    if (this.isOut(n)) return;
    const r = this.net.pinRoot[n], st = this.state(n);
    const lv = r ? this.level(r, n) : null;
    let v = lv ? lv.v : (st === PinState.InputPullUp ? 5 : 0);
    const [p, b] = this.portOf(n);
    this.ports[p].setPin(b, v > 2.5);
    if (n >= 14) this.adc.channelValues[n - 14] = v;
  }
  refreshInputs() {
    for (let n = 0; n < 20; n++) this.updateInput(n);
    // which input pins are affected by each pin's output
    this.affects = {};
    for (let n = 0; n < 20; n++) {
      const r = this.net.pinRoot[n]; if (!r) continue;
      const set = new Set();
      [r].concat(this.net.weak[r] || []).forEach(x => (this.net.unoPins[x] || []).forEach(q => { if (q !== n) set.add(q); }));
      if (set.size) this.affects[n] = [...set];
    }
  }
  netChanged(r) { this.group(r).forEach(g => [g].concat(this.net.weak[g] || []).forEach(x => (this.net.unoPins[x] || []).forEach(q => this.updateInput(q)))); }
  switchChanged(pid) { Object.entries(this.net.sw).forEach(([r, es]) => es.forEach(e => { if (e.pid === pid) { this.netChanged(r); this.netChanged(e.o); } })); }
  addOutput(r, fn) { (this.outputs[r] = this.outputs[r] || []).push(fn); }
  watchNet(r, fn) { this.net.drivers(r).forEach(d => (this.watch[d.n] = this.watch[d.n] || []).push(fn)); return this.net.drivers(r)[0]; }
  powered(pid, vccPin, gndPin) {
    const v = this.level(this.net.root(pid, vccPin)), g = this.level(this.net.root(pid, gndPin));
    return !!(v && v.v > 2.5 && g && g.v < 1);
  }
  /* ----- I2C ----- */
  setupI2C() {
    const sim = this;
    this.twi.eventHandler = {
      start() { sim.twi.completeStart(); },
      stop() { sim.i2cDev = null; sim.twi.completeStop(); },
      connectToSlave(addr, write) { const d = sim.i2c[addr]; sim.i2cDev = d && d.ok() ? d : null; sim.twi.completeConnect(!!sim.i2cDev); },
      writeByte(v) { if (sim.i2cDev) sim.i2cDev.write(v); sim.twi.completeWrite(!!sim.i2cDev); },
      readByte() { sim.twi.completeRead(0xff); },
    };
  }
  /* ----- devices ----- */
  setupDevices() {
    const N = this.net, rt = this.rt;
    for (const part of this.project.parts) {
      const id = part.id, el = rt[id] && rt[id].el, sim = part.sim || {}, R = pin => N.root(id, pin);
      if (!el) continue;
      const D = { part, el, frame: null };
      switch (part.type) {
        case "led": D.frame = () => this.ledFrame(D, R("A"), R("C"), (b) => { el.value = b > 0.02; el.brightness = Math.max(0.15, b); }); break;
        case "rgbled": D.frame = () => {
          const com = R("COM"), ca = (sim.common || "cathode") === "cathode";
          const ch = pin => this.ledLevel(ca ? R(pin) : com, ca ? com : R(pin));
          el.ledRed = ch("R"); el.ledGreen = ch("G"); el.ledBlue = ch("B");
        }; break;
        case "seg7": D.frame = () => {
          const com = R("COM.1"), ca = (sim.common || "cathode") === "cathode";
          el.values = ["A", "B", "C", "D", "E", "F", "G", "DP"].map(s => this.ledLevel(ca ? R(s) : com, ca ? com : R(s), true) > 0.3 ? 1 : 0);
        }; break;
        case "button": case "slideswitch": break;
        case "buzzer": this.setupBuzzer(D, R("2"), R("1")); break;
        case "pot": case "slidepot": {
          const sig = part.type === "pot" ? "SIG" : "SIG", vcc = "VCC", gnd = "GND";
          this.addOutput(R(sig), () => {
            const hi = this.level(R(vcc)), lo = this.level(R(gnd)); if (!hi || !lo) return null;
            const min = el.min ?? 0, max = el.max ?? 100, f = (el.value - min) / ((max - min) || 1);
            return lo.v + (hi.v - lo.v) * f;
          });
          el.addEventListener("input", () => this.netChanged(R(sig)));
          break;
        }
        case "joystick": {
          const ok = () => this.powered(id, "VCC", "GND");
          this.addOutput(R("HORZ"), () => ok() ? 2.5 + (el.xValue || 0) * 2.5 : null);
          this.addOutput(R("VERT"), () => ok() ? 2.5 + (el.yValue || 0) * 2.5 : null);
          this.addOutput(R("SEL"), () => (el.pressed ? 0 : null));
          const upd = () => { this.netChanged(R("HORZ")); this.netChanged(R("VERT")); this.netChanged(R("SEL")); };
          ["input", "button-press", "button-release"].forEach(e => el.addEventListener(e, upd));
          break;
        }
        case "ldr": {
          const ok = () => this.powered(id, "VCC", "GND");
          const volts = () => { const lux = Math.max(0.01, +sim.lux || 0); const r = 50e3 * Math.pow(10, 0.7) / Math.pow(lux, 0.7); return r / (2000 + r / 5); };
          this.addOutput(R("AO"), () => ok() ? volts() : null);
          this.addOutput(R("DO"), () => ok() ? ((+sim.lux || 0) < 100 ? 5 : 0) : null);
          D.frame = () => { el.ledPower = ok(); el.ledDO = ok() && (+sim.lux || 0) >= 100; };
          D.simChanged = () => { this.netChanged(R("AO")); this.netChanged(R("DO")); };
          break;
        }
        case "ntc": {
          const ok = () => this.powered(id, "VCC", "GND");
          this.addOutput(R("OUT"), () => { if (!ok()) return null; const T = (+sim.temp) + 273.15, r = 10000 * Math.exp(3950 * (1 / T - 1 / 298.15)); return 5 * r / (r + 10000); });
          D.simChanged = () => this.netChanged(R("OUT"));
          break;
        }
        case "pir": {
          const ok = () => this.powered(id, "VCC", "GND");
          this.addOutput(R("OUT"), () => ok() ? (sim._until > performance.now() ? 5 : 0) : null);
          D.frame = () => { const on = sim._until > performance.now(); if (on !== D._on) { D._on = on; this.netChanged(R("OUT")); } };
          D.simChanged = () => { sim._until = performance.now() + 5000; this.netChanged(R("OUT")); };
          break;
        }
        case "irobs": {
          const ok = () => this.powered(id, "VCC", "GND");
          this.addOutput(R("OUT"), () => ok() ? (sim.obstacle ? 0 : 5) : null);
          D.frame = () => { el.state = ok() && !!sim.obstacle; };
          D.simChanged = () => this.netChanged(R("OUT"));
          break;
        }
        case "hcsr04": this.setupHCSR04(D, R); break;
        case "dht22": this.setupDHT(D, R); break;
        case "servo": {
          let rise = 0;
          this.watchNet(R("PWM"), (lv, c) => {
            if (lv) rise = c; else if (rise) { const w = (c - rise) / US; if (w > 400 && w < 2700 && this.powered(id, "V+", "GND")) el.angle = Math.max(0, Math.min(180, (w - 544) / (2400 - 544) * 180)); }
          });
          break;
        }
        case "neopixel": case "ledring": this.setupNeoPixel(D, R("DIN"), part.type === "ledring" ? (+(part.attrs || {}).pixels || 12) : 1); break;
        case "lcd": this.setupLCD(D, R); break;
        case "stepper": this.setupStepper(D, R); break;
        case "l298n": D.frame = () => { el.powered = this.l298nPower(id); }; break;
        case "dcmotor": D.frame = (dt) => { el.speed = this.motorSpeed(id); el.spin(dt); }; break;
        case "uno": D.frame = () => { el.led13 = this.pin[13].duty > 0.3; el.ledPower = true; el.ledTX = this.txAt && performance.now() - this.txAt < 60; }; break;
      }
      this.devices.push(D);
    }
  }
  /* LED brightness from anode/cathode nets */
  ledLevel(ra, rc, quiet) {
    const a = this.level(ra), c = this.level(rc);
    if (!a || !c) return 0;
    if (c.v - a.v > 1.5) { if (!this._backTold) this.warnings.add("An LED looks backwards: the long leg (A) goes to the + side."); return 0; }
    if (a.v - c.v < 1.5) return 0;
    if (!quiet && !a.weak && !c.weak && (a.src === "pin" || c.src === "pin" || a.v >= 5)) this.warnings.add("An LED has no resistor. Real LEDs can burn out: add a 220 Ω resistor.");
    let b = 1;
    if (a.pin != null) b *= this.pin[a.pin].duty;
    if (c.pin != null) b *= 1 - this.pin[c.pin].duty;
    return b;
  }
  ledFrame(D, ra, rc, set) { set(this.ledLevel(ra, rc)); }
  setupBuzzer(D, rs, rg) {
    let lastRise = 0, period = 0, lastEdge = 0;
    this.watchNet(rs, (lv, c) => { lastEdge = c; if (lv) { if (lastRise) period = c - lastRise; lastRise = c; } });
    D.frame = () => {
      const c = this.cpu.cycles, g = this.level(rg);
      const toggling = c - lastEdge < F * 0.05 && period > 0;
      const s = this.level(rs);
      let f = 0;
      if (g && g.v < 1) { if (toggling) f = F / period; else if (s && s.v > 2.5) f = 1000; }
      D.el.hasSignal = f > 0;
      this.sound(D, f);
    };
    D.stop = () => this.sound(D, 0);
  }
  sound(D, f) {
    try {
      if (!f) { if (D.osc) { D.gain.gain.value = 0; } return; }
      if (!Sim.audio) Sim.audio = new (window.AudioContext || window.webkitAudioContext)();
      if (!D.osc) { D.osc = Sim.audio.createOscillator(); D.gain = Sim.audio.createGain(); D.osc.type = "square"; D.osc.connect(D.gain); D.gain.connect(Sim.audio.destination); D.osc.start(); }
      D.osc.frequency.value = Math.min(12000, Math.max(30, f)); D.gain.gain.value = Sim.muted ? 0 : 0.04;
    } catch (e) { }
  }
  setupHCSR04(D, R) {
    const id = D.part.id, sim = D.part.sim; let rise = 0, echo = 0;
    const er = R("ECHO");
    this.addOutput(er, () => this.powered(id, "VCC", "GND") ? (echo ? 5 : 0) : null);
    this.watchNet(R("TRIG"), (lv, c) => {
      if (lv) { rise = c; return; }
      if (!rise || c - rise < 8 * US || echo || !this.powered(id, "VCC", "GND")) return;
      const d = Math.max(2, Math.min(400, +sim.dist || 40)), dur = d * 58.3 * US;
      this.cpu.addClockEvent(() => { echo = 1; this.netChanged(er); this.cpu.addClockEvent(() => { echo = 0; this.netChanged(er); }, Math.round(dur)); }, 400 * US);
    });
  }
  setupDHT(D, R) {
    const id = D.part.id, sim = D.part.sim, dr = R("SDA");
    let drive = null, lowAt = 0, busy = false;
    this.addOutput(dr, () => drive);
    const d0 = this.net.drivers(dr)[0];
    if (!d0) return;
    const n = d0.n;
    (this.watch[n] = this.watch[n] || []).push((lv, c, out) => {
      if (busy) return;
      if (out && !lv) { lowAt = c; return; }
      if (lowAt && !out && c - lowAt > 800 * US && this.powered(id, "VCC", "GND")) { lowAt = 0; this.dhtSend(sim, v => { drive = v; this.netChanged(dr); }, b => { busy = b; }); }
      else if (out && lv) lowAt = 0;
    });
    // DDR changes do not change the port value; poll the low->input transition too
    D.frame = () => { if (!busy && lowAt && !this.isOut(n) && this.cpu.cycles - lowAt > 800 * US && this.powered(id, "VCC", "GND")) { lowAt = 0; this.dhtSend(sim, v => { drive = v; this.netChanged(dr); }, b => { busy = b; }); } };
  }
  dhtSend(sim, set, setBusy) {
    const h = Math.round(Math.max(0, Math.min(100, +sim.hum)) * 10), t0 = Math.round((+sim.temp) * 10), t = t0 < 0 ? (0x8000 | -t0) : t0;
    const bytes = [h >> 8, h & 255, t >> 8, t & 255]; bytes.push((bytes[0] + bytes[1] + bytes[2] + bytes[3]) & 255);
    const seq = [[30, null], [80, 0], [80, null]];
    bytes.forEach(B => { for (let i = 7; i >= 0; i--) { seq.push([50, 0]); seq.push([(B >> i) & 1 ? 70 : 26, null]); } });
    seq.push([50, 0]); seq.push([0, null]);
    setBusy(true);
    let i = 0;
    // each entry: [microseconds, level] - apply the level, hold it for that long
    const run = () => { if (i >= seq.length) { set(null); setBusy(false); return; } const [dt, v] = seq[i++]; set(v); if (dt) this.cpu.addClockEvent(run, Math.round(dt * US)); else run(); };
    run();
  }
  setupNeoPixel(D, rin, count) {
    const buf = new Array(count).fill(null).map(() => ({ r: 0, g: 0, b: 0 }));
    const shown = buf.map(x => Object.assign({}, x));
    let rise = 0, fall = 0, bits = 0, nb = 0, idx = 0;
    this.watchNet(rin, (lv, c) => {
      if (lv) { if (fall && c - fall > 50 * US) { idx = 0; nb = 0; bits = 0; for (let i = 0; i < count; i++) Object.assign(shown[i], buf[i]); D.dirty = true; } rise = c; return; }
      fall = c; if (!rise) return;
      bits = (bits << 1) | (c - rise > 9 ? 1 : 0); nb++;
      if (nb === 24) { if (idx < count) buf[idx] = { g: (bits >> 16) & 255, r: (bits >> 8) & 255, b: bits & 255 }; idx++; nb = 0; bits = 0; }
    });
    D.frame = () => {
      if (fall && this.cpu.cycles - fall > 50 * US && idx) { for (let i = 0; i < count; i++) Object.assign(shown[i], buf[i]); idx = 0; nb = 0; D.dirty = true; }
      if (!D.dirty) return; D.dirty = false;
      // real LEDs look bright even at low values, so boost what we show (perceived brightness)
      const vis = p => { const m = Math.max(p.r, p.g, p.b) / 255; if (!m) return { r: 0, g: 0, b: 0 }; const k = Math.min(1, 0.35 + 0.65 * Math.sqrt(m)) / m / 255; return { r: p.r * k, g: p.g * k, b: p.b * k }; };
      if (count === 1) { const v = vis(shown[0]); D.el.r = v.r; D.el.g = v.g; D.el.b = v.b; }
      else shown.forEach((p, i) => D.el.setPixel(i, vis(p)));
    };
  }
  setupLCD(D, R) {
    const core = new LCDCore(D.el), id = D.part.id;
    D.el.characters = new Uint8Array(32).fill(32);
    if (((D.part.attrs || {}).pins || "i2c") === "i2c") {
      let last = 0, bl = 1;
      const ok = () => this.powered(id, "VCC", "GND") && this.net.unoId && this.net.connected(id + ":SDA", this.net.unoId + ":A4") && this.net.connected(id + ":SCL", this.net.unoId + ":A5");
      const dev = { ok, write: v => { if ((last & 4) && !(v & 4)) core.strobe(v & 1, v & 0xf0); last = v; bl = (v >> 3) & 1; } };
      const addr = parseInt((D.part.sim || {}).addr || "0x27", 16);
      this.i2c[addr] = dev;
      D.frame = () => core.render(ok() && !!bl);
    } else {
      const pins = ["D0", "D1", "D2", "D3", "D4", "D5", "D6", "D7"].map(p => R(p)), rs = R("RS");
      const val = r => { const l = this.level(r); return l && l.v > 2.5 ? 1 : 0; };
      this.watchNet(R("E"), (lv) => { if (lv) return; let d = 0; pins.forEach((r, i) => { d |= val(r) << i; }); core.strobe(val(rs), d); });
      D.frame = () => { const pw = this.powered(id, "VDD", "VSS"), bl = this.level(R("A")), k = this.level(R("K")); core.render(pw && !!(bl && bl.v > 2.5 && k && k.v < 1) || pw); };
    }
  }
  setupStepper(D, R) {
    const names = ["A+", "A-", "B+", "B-"], roots = names.map(R);
    let prev = null, angle = 0;
    const upd = () => {
      const l = roots.map(r => { const x = this.level(r); return x && x.v > 2.5 ? 1 : 0; });
      const ia = l[0] - l[1], ib = l[2] - l[3];
      if (!ia && !ib) return;
      const e = Math.atan2(ib, ia) / (Math.PI / 2); // quarter turns of the electrical cycle
      if (prev !== null) { let d = e - prev; while (d > 2) d -= 4; while (d <= -2) d += 4; angle += d * 1.8; }
      prev = e;
    };
    roots.forEach(r => this.watchNet(r, upd));
    D.frame = () => { D.el.angle = ((angle % 360) + 360) % 360; D.el.value = Math.round(angle / 1.8) + ""; D.el.units = "steps"; };
  }
  l298nPower(id) { const v = this.level(this.net.root(id, "12V")), g = this.level(this.net.root(id, "GND")); return !!(v && v.v > 4 && g && g.v < 1); }
  l298nChan(id, ch) {
    if (!this.l298nPower(id)) return 0;
    const part = this.project.parts.find(p => p.id === id), sim = part.sim || {};
    const [en, i1, i2] = ch === "A" ? ["ENA", "IN1", "IN2"] : ["ENB", "IN3", "IN4"];
    const L = p => { const x = this.level(this.net.root(id, p)); return x && x.v > 2.5 ? 1 : 0; };
    const enR = this.level(this.net.root(id, en));
    const speed = (ch === "A" ? sim.ena : sim.enb) ? 1 : enR ? (enR.pin != null ? this.pin[enR.pin].duty : enR.v > 2.5 ? 1 : 0) : 0;
    const a = L(i1), b = L(i2);
    return a && !b ? speed : !a && b ? -speed : 0;
  }
  motorSpeed(id) {
    const N = this.net, r1 = N.root(id, "M1"), r2 = N.root(id, "M2");
    for (const p of this.project.parts.filter(x => x.type === "l298n")) {
      const o = k => N.root(p.id, k);
      if (r1 === o("OUT1") && r2 === o("OUT2")) return this.l298nChan(p.id, "A");
      if (r1 === o("OUT2") && r2 === o("OUT1")) return -this.l298nChan(p.id, "A");
      if (r1 === o("OUT3") && r2 === o("OUT4")) return this.l298nChan(p.id, "B");
      if (r1 === o("OUT4") && r2 === o("OUT3")) return -this.l298nChan(p.id, "B");
    }
    const a = this.level(r1), b = this.level(r2);
    if (a && b && Math.abs(a.v - b.v) > 2) { this.warnings.add("A motor is wired straight to Arduino pins. Real pins can't power a motor: use an L298N driver."); return 0; }
    return 0;
  }
  /* ----- run ----- */
  serialIn(text) { for (const ch of text) this.rxQueue.push(ch.charCodeAt(0)); }
  run(ms) {
    const cpu = this.cpu, target = cpu.cycles + Math.round(F * ms / 1000);
    const t0 = performance.now();
    while (cpu.cycles < target) {
      for (let i = 0; i < 2000; i++) { avrInstruction(cpu); cpu.tick(); }
      if (this.rxQueue.length && !this.usart.rxBusy) { if (this.usart.writeByte(this.rxQueue[0])) this.rxQueue.shift(); }
      if (performance.now() - t0 > 40) break; // keep the page responsive
    }
    this.speed = (cpu.cycles - (target - Math.round(F * ms / 1000))) / (F * ms / 1000);
  }
  frame(dt) {
    const c = this.cpu.cycles;
    for (const p of this.pin) { const span = c - p.win; if (p.lv) p.hi += c - p.last; p.duty = span > 0 ? Math.min(1, p.hi / span) : p.lv; p.hi = 0; p.win = c; p.last = c; }
    this.warnings.clear();
    for (const D of this.devices) if (D.frame) D.frame(dt);
    this.onWarn([...this.warnings]);
  }
  simChanged(pid) { const D = this.devices.find(d => d.part.id === pid); if (D && D.simChanged) D.simChanged(); }
  stop() { this.devices.forEach(D => { if (D.stop) D.stop(); }); }
  pinsReport() { return this.pin.map((p, n) => ({ n: PIN_NAME(n), out: this.isOut(n), lv: p.lv })); }
}
