/* Circuit Lab - netlist + microcontroller simulation (avr8js, MIT). */
import { CPU, avrInstruction, AVRTimer, AVRIOPort, AVRUSART, AVRADC, AVRTWI, AVREEPROM, EEPROMMemoryBackend, PinState } from "../vendor/avr8js.mjs";
import { CARDS, PARTS } from "./parts.js?v=11";
import { bbLayout } from "./elements.js?v=11";
import { BOARDS, ESP_ADC_PINS } from "./boards.js?v=11";
import { BATT } from "./elements.js?v=11";
import { setupExtra, hcExtra } from "./sim2.js?v=11";
import { setupExtra3 } from "./sim3.js?v=11";
import { setupExtra4, hcExtra4 } from "./sim4.js?v=11";
import { setupExtra5 } from "./sim5.js?v=11";
import { setupExtra7, hcExtra7 } from "./sim7.js?v=11";

/* modules that talk over a plain serial port and are driven by their own library shim */
const SERIAL_MODULES = [["mhz19", "MH-Z19"], ["dfplayer", "DFPlayer"]];

const F = 16e6, US = F / 1e6, MS = F / 1e3;
const clamp = (x, a, b) => Math.max(a, Math.min(b, x));

/* ---------- union-find netlist ---------- */
export class Netlist {
  constructor(project, pinsWorld, partState) {
    this.parent = {};
    const nodes = [], add = id => { if (!(id in this.parent)) { this.parent[id] = id; nodes.push(id); } };
    const parts = project.parts, byId = {}; parts.forEach(p => { byId[p.id] = p; });
    this.byId = byId;
    const pinMap = {};
    parts.forEach(p => { pinMap[p.id] = pinsWorld(p) || []; pinMap[p.id].forEach(q => add(p.id + ":" + q.name)); });
    this.pins = pinMap;
    const U = (a, b) => { add(a); add(b); const ra = this.find(a), rb = this.find(b); if (ra !== rb) this.parent[ra] = rb; };
    project.wires.forEach(w => { if (w.from && w.to) U(w.from, w.to); });
    const board = parts.find(p => BOARDS[p.type]);
    this.board = board ? BOARDS[board.type] : null; this.boardId = board ? board.id : null;
    parts.forEach(p => {
      const id = p.id;
      if (BOARDS[p.type]) BOARDS[p.type].joined.forEach(([a, b]) => U(id + ":" + a, id + ":" + b));
      if (p.type === "button") { U(id + ":1.l", id + ":1.r"); U(id + ":2.l", id + ":2.r"); }
      if (p.type === "seg7") U(id + ":COM.1", id + ":COM.2");
      if (p.type === "breadboard") bbLayout((p.attrs || {}).cols || 30).groups.forEach(g => { for (let i = 1; i < g.length; i++) U(id + ":" + g[0], id + ":" + g[i]); });
    });
    // breadboard insertion: a part pin sitting on a hole joins it
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
    // switches: edges that open and close while running
    this.sw = {};
    const edge = (pid, a, b, closed) => { const ra = this.find(pid + ":" + a), rb = this.find(pid + ":" + b); if (ra === rb) return; (this.sw[ra] = this.sw[ra] || []).push({ o: rb, closed, pid }); (this.sw[rb] = this.sw[rb] || []).push({ o: ra, closed, pid }); };
    parts.forEach(p => {
      const st = partState[p.id] || (partState[p.id] = {});
      if (p.type === "button") edge(p.id, "1.l", "2.l", () => !!st.pressed);
      if (p.type === "slideswitch") { edge(p.id, "2", "1", () => !st.value); edge(p.id, "2", "3", () => !!st.value); }
      if (p.type === "keypad") for (let r = 1; r <= 4; r++) for (let c = 1; c <= 4; c++) edge(p.id, "R" + r, "C" + c, () => !!(st.keys && st.keys.has(r + "," + c)));
      if (p.type === "npn") edge(p.id, "C", "E", () => !!st.on);
      if (p.type === "mosfet") edge(p.id, "D", "S", () => !!st.on);
      if (p.type === "pnp") edge(p.id, "E", "C", () => !!st.on);
      if (p.type === "opto") edge(p.id, "C", "E", () => !!st.on);
      if (p.type === "limitsw") { edge(p.id, "COM", "NO", () => !!(p.sim || {}).pressed); edge(p.id, "COM", "NC", () => !(p.sim || {}).pressed); }
      if (p.type === "dipswitch") { st.sw = st.sw || []; for (let i = 1; i <= 8; i++) edge(p.id, i + "a", i + "b", (k => () => !!(st.sw || [])[k])(i - 1)); }
      if (p.type === "relay") { const n = +((p.attrs || {}).channels || 1); st.coil = st.coil || []; for (let i = 0; i < n; i++) { const t = n === 1 ? "" : i + 1; edge(p.id, "COM" + t, "NO" + t, () => !!st.coil[i]); edge(p.id, "COM" + t, "NC" + t, () => !st.coil[i]); } }
    });
    this.nets = {};
    nodes.forEach(n => { const r = this.find(n); (this.nets[r] = this.nets[r] || []).push(n); });
    // resistors = weak links
    this.weak = {};
    parts.filter(p => p.type === "resistor" || p.type === "inductor").forEach(p => {
      const a = this.find(p.id + ":1"), b = this.find(p.id + ":2"); if (a === b) return;
      (this.weak[a] = this.weak[a] || []).push(b); (this.weak[b] = this.weak[b] || []).push(a);
    });
    // power sources and MCU pins per net
    this.power = {}; this.mcuPins = {}; this.pinRoot = {};
    Object.keys(this.nets).forEach(r => this.nets[r].forEach(n => {
      const [pid, pin] = n.split(":"), part = byId[pid]; if (!part) return;
      const B = BOARDS[part.type];
      if (B) {
        if (pin in B.power) (this.power[r] = this.power[r] || []).push(B.power[pin]);
        const bp = B.pins[pin];
        if (bp) { const no = bp.n; (this.mcuPins[r] = this.mcuPins[r] || []); if (!this.mcuPins[r].includes(no)) this.mcuPins[r].push(no); this.pinRoot[no] = r; }
      }
      if (part.type === "battery") { const v = (BATT[(part.attrs || {}).kind || "9V"] || BATT["9V"]).v; (this.power[r] = this.power[r] || []).push(pin === "+" ? v : 0); }
      if (part.type === "solar" && pin === "-") (this.power[r] = this.power[r] || []).push(0);
    }));
  }
  find(x) { if (!(x in this.parent)) return x; while (this.parent[x] !== x) { this.parent[x] = this.parent[this.parent[x]]; x = this.parent[x]; } return x; }
  root(pid, pin) { return this.find(pid + ":" + pin); }
  connected(a, b) { return this.find(a) === this.find(b); }
  drivers(r) { const out = (this.mcuPins[r] || []).map(n => ({ n, weak: false })); (this.weak[r] || []).forEach(w => (this.mcuPins[w] || []).forEach(n => out.push({ n, weak: true }))); return out; }
  /* MCU pin number wired to a part pin (directly or through one resistor) */
  mcuPinOf(pid, pin) { const d = this.drivers(this.root(pid, pin)); return d.length ? d[0].n : null; }
  boardRoot(pin) { return this.boardId ? this.root(this.boardId, pin) : null; }
}

/* ---------- HD44780 LCD controller ---------- */
class LCDCore {
  constructor(el, cols = 16, rows = 2) { this.el = el; this.cols = cols; this.rows = rows; this.reset(); }
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
  strobe(rs, d) {
    if (this.mode8) { rs ? this.data(d) : this.cmd(d); this.hi = null; return; }
    const nib = (d >> 4) & 0xf;
    if (this.hi === null) { this.hi = nib; return; }
    const b = (this.hi << 4) | nib; this.hi = null; rs ? this.data(b) : this.cmd(b);
  }
  render(backlight) {
    if (!this.dirty && this._bl === backlight) return; this.dirty = false; this._bl = backlight;
    const C = this.cols, Rn = this.rows, base = Rn > 2 ? [0x00, 0x40, 0x14, 0x54] : [0x00, 0x40];
    const ch = new Uint8Array(C * Rn);
    for (let r = 0; r < Rn; r++) for (let i = 0; i < C; i++) ch[r * C + i] = this.on ? this.dd[(base[r] + i) & 0x7f] : 32;
    this.el.characters = ch; this.el.backlight = backlight;
    this.el.cursor = this.on && this.cur; this.el.blink = this.on && this.blk;
    let row = 0, col = this.addr;
    for (let r = Rn - 1; r >= 0; r--) if (this.addr >= base[r]) { row = r; col = this.addr - base[r]; break; }
    this.el.cursorX = col; this.el.cursorY = row;
  }
}

/* canned answers for the pretend internet */
function fakeHttp(url, method, body) {
  const u = url.toLowerCase();
  if (method !== "GET") return { code: 200, body: u.includes("thingspeak") ? "1" : '{"ok":true}' };
  if (u.includes("openweathermap")) return { code: 200, body: '{"weather":[{"main":"Clouds","description":"scattered clouds"}],"main":{"temp":31.4,"feels_like":33.0,"humidity":48,"pressure":1006},"wind":{"speed":3.6},"name":"Islamabad"}' };
  if (u.includes("open-meteo")) return { code: 200, body: '{"current":{"temperature_2m":31.4,"relative_humidity_2m":48,"wind_speed_10m":12.9,"weather_code":2}}' };
  if (u.includes("worldtimeapi") || u.includes("timeapi")) return { code: 200, body: '{"datetime":"2026-10-12T10:30:00+05:00","timezone":"Asia/Karachi","unixtime":1791783000}' };
  if (u.includes("thingspeak")) return { code: 200, body: '{"channel":{"id":1},"feeds":[{"field1":"27.5","field2":"61"}]}' };
  if (u.includes("api.") || u.includes("json")) return { code: 200, body: '{"status":"ok","value":42}' };
  return { code: 200, body: "<html><body><h1>Hello from the internet</h1></body></html>" };
}

/* ---------- simulator ---------- */
export class Sim {
  constructor({ project, rt, net, program, onSerial, onWarn, onNet }) {
    this.project = project; this.rt = rt; this.net = net; this.onSerial = onSerial; this.onWarn = onWarn || (() => {}); this.onNet = onNet || (() => {});
    const B = this.B = net.board, M = this.M = B.mcu;
    this.logic = B.logic;
    const cpu = this.cpu = new CPU(program, M.sram);
    this.timers = M.timers.map(t => new AVRTimer(cpu, t));
    this.ports = {}; Object.entries(M.ports).forEach(([k, cfg]) => { this.ports[k] = new AVRIOPort(cpu, cfg); });
    this.npins = M.pins;
    this.portPin = {}; for (let n = 0; n < M.pins; n++) { const pp = M.pinPort(n); if (pp) this.portPin[pp[0] + pp[1]] = n; }
    this.usart = new AVRUSART(cpu, M.usart, F);
    this.usart.onByteTransmit = b => { const ch = String.fromCharCode(b); this.onSerial && this.onSerial(ch); this.txAt = performance.now(); if (this.hwBt) this.btOut(this.hwBt, ch); };
    this.rxQueue = [];
    this.adc = new AVRADC(cpu, M.adc);
    this.twi = new AVRTWI(cpu, M.twi, F);
    this.eeprom = new AVREEPROM(cpu, new EEPROMMemoryBackend(M.eepromSize), M.eeprom);
    this.pin = []; for (let i = 0; i < M.pins; i++) this.pin.push({ lv: 0, last: 0, hi: 0, win: 0, duty: 0, pwm: null });
    this.watch = {}; this.nwatch = {}; this.outputs = {}; this.devices = []; this.i2c = {};
    this.warnings = new Set(); this.notes = new Set();
    this.eff = new Array(M.pins).fill(-1);
    this.adcOf = {}; Object.values(B.pins).forEach(p => { if (p.adc != null) this.adcOf[p.n] = p.adc; });
    /* sensors can register an exact value read at the moment the sketch calls analogRead */
    this.liveAdc = {};
    const adcRead = this.adc.onADCRead.bind(this.adc);
    this.adc.onADCRead = inp => { if (inp && inp.channel != null) { const f = this.liveAdc[inp.channel]; if (f) this.adc.channelValues[inp.channel] = f(); } return adcRead(inp); };
    this.net9 = { wifi: null, connectAt: 0, server: false, reqs: [], cur: {}, nextId: 1, http: null, mqttIn: [], nowIn: [], log: [] };
    this.ser = []; // serial module handles
    Object.entries(this.ports).forEach(([name, port]) => {
      port.addListener(v => {
        for (let b = 0; b < 8; b++) {
          const n = this.portPin[name + b]; if (n === undefined) continue;
          const out = this.isOut(n), e = out ? (v >> b) & 1 : ((v >> b) & 1 ? -2 : -1);
          if (e !== this.eff[n]) { const wasOut = this.eff[n] >= 0; this.eff[n] = e; this.pin[n].pwm = null; if (out || wasOut) this.pinChanged(n, out ? e : 0, out); if (!out) this.updateInput(n); }
        }
      });
    });
    cpu.writeHooks[0x3e] = v => { if (v === 0xc1) this.hypercall(); return true; };
    this.setupI2C();
    this.setupDevices();
    this.refreshInputs();
  }
  portOf(n) { const pp = this.M.pinPort(n); return pp; }
  state(n) { const pp = this.portOf(n); return pp ? this.ports[pp[0]].pinState(pp[1]) : PinState.Input; }
  isOut(n) { if (this.pin[n] && this.pin[n].pwm != null) return true; const s = this.state(n); return s === PinState.High || s === PinState.Low; }
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
    let v = null, src = null, lo = false, hi = false;
    const pw = this.net.power[r]; if (pw) for (const x of pw) { v = x; src = "power"; if (x < 1) lo = true; else hi = true; }
    const up = this.net.mcuPins[r];
    if (up) for (const no of up) { if (no === exclude || !this.isOut(no)) continue; const x = this.pin[no].lv ? this.logic : 0; if (src !== "power" || v === null) { v = x; src = "pin"; this._srcPin = no; } if (x < 1) lo = true; else hi = true; }
    const os = this.outputs[r]; if (os) for (const f of os) { const x = f(); if (x === null || x === undefined) continue; if (v === null) { v = x; src = "out"; } if (x < 1) lo = true; else if (x > 2.5) hi = true; }
    if (lo && hi) this.warnings.add("Short circuit: a wire joins + to GND (or HIGH to LOW). Check your wiring.");
    return v === null ? null : { v, src, pin: src === "pin" ? this._srcPin : null };
  }
  level(r, exclude) {
    if (!r) return null;
    const s = this.strong(r, exclude); if (s) return Object.assign(s, { weak: false });
    for (const x of this.group(r)) for (const w of this.net.weak[x] || []) { const s2 = this.strong(w, exclude); if (s2) return Object.assign(s2, { weak: true }); }
    return null;
  }
  volts(r) { const l = this.level(r); return l ? l.v : null; }
  updateInput(n) {
    if (this.isOut(n)) return;
    const r = this.net.pinRoot[n], st = this.state(n);
    const lv = r ? this.level(r, n) : null;
    const v = lv ? lv.v : (st === PinState.InputPullUp ? this.logic : 0);
    const pp = this.portOf(n); if (pp) this.ports[pp[0]].setPin(pp[1], v > this.logic / 2);
    const ch = this.adcOf[n];
    if (ch != null) this.adc.channelValues[ch] = this.B.esp ? clamp(v * 5 / 3.3, 0, 5) : clamp(v, 0, 5);
  }
  refreshInputs() {
    for (let n = 0; n < this.npins; n++) if (this.net.pinRoot[n]) this.updateInput(n);
    this.affects = {};
    Object.keys(this.net.pinRoot).forEach(k => {
      const n = +k, r = this.net.pinRoot[n], set = new Set();
      [r].concat(this.net.weak[r] || []).forEach(x => (this.net.mcuPins[x] || []).forEach(q => { if (q !== n) set.add(q); }));
      this.group(r).forEach(x => (this.net.mcuPins[x] || []).forEach(q => { if (q !== n) set.add(q); }));
      if (set.size) this.affects[n] = [...set];
    });
  }
  netChanged(r) {
    this.group(r).forEach(g => [g].concat(this.net.weak[g] || []).forEach(x => (this.net.mcuPins[x] || []).forEach(q => this.updateInput(q))));
    const w = this.nwatch[this.net.find(r)];
    if (w && !this._inw) { this._inw = 1; try { w.forEach(f => f(null, this.cpu.cycles, false)); } finally { this._inw = 0; } }
  }
  switchChanged(pid) { Object.entries(this.net.sw).forEach(([r, es]) => es.forEach(e => { if (e.pid === pid) { this.netChanged(r); this.netChanged(e.o); } })); }
  addOutput(r, fn) { (this.outputs[r] = this.outputs[r] || []).push(fn); }
  /* exact analog value (volts) sampled when the sketch reads the pin, not once per frame */
  liveAnalog(r, fn) {
    this.net.drivers(r).forEach(x => {
      const ch = this.adcOf[x.n]; if (ch == null) return;
      this.liveAdc[ch] = () => { const v = fn(); return this.B.esp ? clamp(v * 5 / 3.3, 0, 5) : clamp(v, 0, 5); };
    });
  }
  watchNet(r, fn) { const d = this.net.drivers(r); d.forEach(x => (this.watch[x.n] = this.watch[x.n] || []).push(fn)); return d[0]; }
  /* like watchNet, but also fires when a non-board part (a shift register, a motor driver) changes the net */
  watchAny(r, fn) { this.watchNet(r, fn); const k = this.net.find(r); (this.nwatch[k] = this.nwatch[k] || []).push(fn); }
  powered(pid, vccPin, gndPin) {
    const v = this.level(this.net.root(pid, vccPin)), g = this.level(this.net.root(pid, gndPin));
    return !!(v && v.v > 2.5 && g && g.v < 1);
  }
  partPowered(part) {
    const pw = part.pw || (PARTDEF[part.type] || {}).pw; if (!pw) return true;
    const vcc = (pw.vcc || [])[0], gnd = (pw.gnd || [])[0];
    if (vcc && gnd) return this.powered(part.id, vcc, gnd);
    if (gnd) { const g = this.level(this.net.root(part.id, gnd)); return !!(g && g.v < 1); }
    return true;
  }
  i2cWired(part) {
    const B = this.B, N = this.net, d = PARTDEF[part.type] || {}; if (!d.i2c || !N.boardId) return false;
    return N.connected(part.id + ":" + d.i2c.sda, N.boardId + ":" + B.i2c.sda) && N.connected(part.id + ":" + d.i2c.scl, N.boardId + ":" + B.i2c.scl);
  }
  /* ----- I2C (real protocol, used by the LCD backpack) ----- */
  setupI2C() {
    const sim = this;
    this.twi.eventHandler = {
      start() { sim.twi.completeStart(); },
      stop() { sim.i2cDev = null; sim.twi.completeStop(); },
      connectToSlave(addr, write) { const d = sim.i2c[addr]; sim.i2cDev = d && d.ok() ? d : null; if (sim.i2cDev && sim.i2cDev.start) sim.i2cDev.start(write); sim.twi.completeConnect(!!sim.i2cDev); },
      writeByte(v) { if (sim.i2cDev) sim.i2cDev.write(v); sim.twi.completeWrite(!!sim.i2cDev); },
      readByte(ack) { sim.twi.completeRead(sim.i2cDev && sim.i2cDev.read ? sim.i2cDev.read() & 255 : 0xff); },
    };
  }
  /* ----- simulator bridge (cl_hc.h) ----- */
  hypercall() {
    const d = this.cpu.data, base = d[0x4a] | (d[0x4b] << 8), dv = new DataView(d.buffer, d.byteOffset);
    const dev = d[base], op = d[base + 1], len = dv.getUint16(base + 2, true), ptr = dv.getUint16(base + 4, true), a = dv.getInt32(base + 6, true), b = dv.getInt32(base + 10, true);
    let ret = 0;
    try { ret = this.hc(dev, op, ptr, len, a, b, d, dv) | 0; } catch (e) { console.warn(e); }
    dv.setInt32(base + 14, ret, true);
  }
  str(ptr, len) { let s = ""; for (let i = 0; i < len; i++) s += String.fromCharCode(this.cpu.data[ptr + i]); return s; }
  put(ptr, len, bytes) { const n = Math.min(len, bytes.length); for (let i = 0; i < n; i++) this.cpu.data[ptr + i] = bytes[i]; return n; }
  findPart(type, test) { return this.project.parts.find(p => p.type === type && (!test || test(p))); }
  pinWired(part, pin, n) { return this.net.mcuPinOf(part.id, pin) === n; }
  hc(dev, op, ptr, len, a, b, d, dv) {
    const N9 = this.net9;
    switch (dev) {
      case 1: { // OLED
        const p = this.findPart("oled", q => this.i2cWired(q) && this.partPowered(q));
        if (op === 1) { if (!p) this.notes.add("OLED not found: wire SDA and SCL to the board's I2C pins and give it power."); return p ? 1 : 0; }
        if (!p) return 0;
        const D = this.devOf(p.id); if (!D) return 0;
        if (op === 2) { D.buf = d.slice(ptr, ptr + len); D.w = a; D.h = b; D.dirty = true; }
        if (op === 3) { D.inv = !!a; D.dirty = true; }
        if (op === 5) { D.on = !!a; D.dirty = true; }
        return 1;
      }
      case 2: { // MPU6050
        const p = this.findPart("mpu6050", q => this.i2cWired(q) && this.partPowered(q));
        if (op === 1) { if (!p) this.notes.add("MPU6050 not found: wire SDA/SCL to the I2C pins and power it."); return p ? 1 : 0; }
        if (!p) return 0;
        const s = p.sim || {};
        if (op === 2) { const vals = [+s.ax || 0, +s.ay || 0, s.az == null ? 9.8 : +s.az, (+s.gx || 0) * Math.PI / 180, (+s.gy || 0) * Math.PI / 180, (+s.gz || 0) * Math.PI / 180, 26.5]; vals.forEach((x, i) => { if (i * 4 + 4 <= len) dv.setFloat32(ptr + i * 4, x + (Math.random() - .5) * 0.02, true); }); return 1; }
        if (op === 3) { const m = Math.hypot(+s.ax || 0, +s.ay || 0, s.az == null ? 9.8 : +s.az); return Math.abs(m - 9.8) > Math.max(0.5, b * 0.15) ? 1 : 0; }
        return 0;
      }
      case 3: { // HX711
        const p = this.findPart("hx711", q => this.pinWired(q, "DT", a) && this.pinWired(q, "SCK", b) && this.partPowered(q));
        if (!p) { if (op === 1) this.notes.add("HX711 not found on those pins: check DT, SCK and power."); return 0; }
        if (op === 1) return 1;
        if (op === 2) return Math.round(84000 + (+(p.sim || {}).grams || 0) * 420 + (Math.random() - .5) * 120);
        return 0;
      }
      case 4: { // RC522
        const B = this.B, N = this.net;
        const ok = q => this.pinWired(q, "SDA", a) && N.connected(q.id + ":SCK", N.boardId + ":" + B.spi.sck) && N.connected(q.id + ":MOSI", N.boardId + ":" + B.spi.mosi) && N.connected(q.id + ":MISO", N.boardId + ":" + B.spi.miso) && this.partPowered(q);
        const p = this.findPart("rfid", ok);
        if (op === 1) { if (!p) this.notes.add("RFID reader not found: SDA to the SS pin in your code, SCK/MOSI/MISO to the SPI pins, 3.3V and GND."); return p ? 1 : 0; }
        if (!p) return 0;
        const st = this.rt[p.id].state;
        if (op === 2) return st.tap ? 1 : 0;
        if (op === 3) { if (!st.tap) return 0; const c = st.tap; st.tap = null; this.put(ptr, len, c.uid.concat([0x08])); return 1; }
        return 1;
      }
      case 5: { // MAX7219, single 8x8 or a 4-in-1 chain
        const din = (b >> 16) & 255, clk = (b >> 8) & 255, cs = b & 255;
        const wired = q => this.pinWired(q, "DIN", din) && this.pinWired(q, "CLK", clk) && this.pinWired(q, "CS", cs) && this.partPowered(q);
        const chain = this.findPart("max7219x4", wired);
        if (chain) {
          const D = this.devOf(chain.id); if (!D) return 0;
          if (op === 2) { const rows = Array.from(d.slice(ptr, ptr + 8)); for (let c = 0; c < 8; c++) { let v = 0; for (let r = 0; r < 8; r++) if ((rows[r] >> (7 - c)) & 1) v |= 1 << r; D.cols[a * 8 + c] = v; } D.dirty = true; }
          if (op === 4) { for (let c = 0; c < 8; c++) D.cols[a * 8 + c] = b ? 0 : D.cols[a * 8 + c]; D.dirty = true; }
          return 1;
        }
        const p = this.findPart("max7219", wired);
        if (!p) { if (op === 1) this.notes.add("LED matrix not found: check DIN, CLK, CS (same order as in LedControl) and power."); return 0; }
        const D = this.devOf(p.id);
        if (op === 2 && a === 0) { D.rows = Array.from(d.slice(ptr, ptr + 8)); D.dirty = true; }
        if (op === 4 && a === 0) { D.off = !!b; D.dirty = true; }
        return 1;
      }
      case 6: { // TCS34725
        const p = this.findPart("tcs34725", q => this.i2cWired(q) && this.partPowered(q));
        if (op === 1) return p ? 1 : 0;
        if (!p) return 0;
        if (op === 2) {
          const hex = ((p.sim || {}).color || "#808080").replace("#", ""), r = parseInt(hex.substr(0, 2), 16), g = parseInt(hex.substr(2, 2), 16), bl = parseInt(hex.substr(4, 2), 16);
          const k = Math.max(1, a) * [1, 4, 16, 60][b & 3] * 0.09, j = () => 1 + (Math.random() - .5) * 0.03;
          const vals = [r * k * j(), g * k * j() * 0.92, bl * k * j() * 0.85]; vals.push(vals[0] + vals[1] + vals[2] + 30 * k);
          vals.forEach((x, i) => { if (i * 2 + 2 <= len) dv.setUint16(ptr + i * 2, clamp(Math.round(x), 0, 65535), true); });
          return 1;
        }
        if (op === 3) { const D = this.devOf(p.id); D.led = !!a; return 1; }
        return 0;
      }
      case 7: { // INA219
        const p = this.findPart("ina219", q => parseInt((q.attrs || {}).addr || "0x40", 16) === a && this.i2cWired(q) && this.partPowered(q));
        if (op === 1) return p ? 1 : 0;
        if (!p) return 0;
        if (op === 2) { const m = /([\d.]+)\s*mA/.exec((p.sim || {}).load || "") || [0, 0], mA = +m[1] * (1 + (Math.random() - .5) * 0.04), V = (p.sim.volts == null ? 5 : +p.sim.volts) - mA * 0.0002; [V, mA * 0.1, mA, V * mA].forEach((x, i) => { if (i * 4 + 4 <= len) dv.setFloat32(ptr + i * 4, x, true); }); const D = this.devOf(p.id); if (D) D.text = mA.toFixed(0) + " mA"; return 1; }
        return 0;
      }
      case 8: { // ESP32 PWM and servo
        if (op === 1) { const n = a; if (n >= 0 && n < this.npins) { const P = this.pin[n]; P.pwm = clamp(b / 65535, 0, 1); P.lv = P.pwm > 0 ? 1 : 0; P.duty = P.pwm; const r = this.net.pinRoot[n]; if (r) this.netChanged(r); } return 1; }
        if (op === 2) { const r = this.net.pinRoot[a]; this.project.parts.filter(q => q.type === "servo" && this.net.find(q.id + ":PWM") === r).forEach(q => { if (this.powered(q.id, "V+", "GND")) this.rt[q.id].el.angle = clamp((b - 544) / (2400 - 544) * 180, 0, 180); }); return 1; }
        return 0;
      }
      case 9: return this.netCall(op, ptr, len, a, b);
      case 10: { // serial modules
        if (op === 1) {
          let part = null, name = "Bluetooth";
          let kind = "bt";
          if (a >= 0) {
            part = this.findPart("hc05", q => this.pinWired(q, "TXD", a) && this.pinWired(q, "RXD", b) && this.partPowered(q));
            if (part) name = "HC-05";
            if (!part) { part = this.findPart("gps", q => this.pinWired(q, "TX", a) && this.partPowered(q)); if (part) { name = "GPS"; kind = "gps"; } }
            if (!part) { part = this.findPart("sim800l", q => this.pinWired(q, "TX", a) && this.pinWired(q, "RX", b) && this.partPowered(q)); if (part) { name = "SIM800L"; kind = "gsm"; } }
            /* plain serial modules: they answer their own library, so the port only has to find them */
            if (!part) for (const [t, n] of SERIAL_MODULES) {
              const q = this.findPart(t, x => this.pinWired(x, "TX", a) && this.partPowered(x));
              if (q) { part = q; name = n; kind = "ser"; break; }
            }
            if (!part) this.notes.add(`Nothing is wired to pins ${a} (RX) and ${b} (TX) for SoftwareSerial. A module's TX goes to ${a} and its RX to ${b}.`);
          } else name = len ? this.str(ptr, len) : "ESP32";
          this.ser.push({ part, name, kind, rx: [], ok: a < 0 || !!part });
          if (kind !== "gps") this.onNet({ kind: "bt", name, ready: a < 0 || !!part });
          return this.ser.length - 1;
        }
        const h = this.ser[a]; if (!h) return op === 4 || op === 5 ? -1 : 0;
        if (op === 2) { if (h.ok) { if (h.kind === "gsm") this.gsmIn(h, this.str(ptr, len)); else if (h.kind !== "gps") this.btOut(h, this.str(ptr, len)); } return len; }
        if (op === 3) return h.rx.length;
        if (op === 4) return h.rx.length ? h.rx.shift() : -1;
        if (op === 5) return h.rx.length ? h.rx[0] : -1;
        return 0;
      }
      case 12: if (op === 2) return 60; return 0;
      default: return hcExtra7(this, dev, op, ptr, len, a, b, d, dv) || hcExtra4(this, dev, op, ptr, len, a, b, d, dv) || hcExtra(this, dev, op, ptr, len, a, b, d, dv);
    }
    return 0;
  }
  btOut(h, text) { this.onNet({ kind: "btout", name: h.name, text }); }
  /* a pretend SIM800L: answer the AT commands students use and show the text message */
  gsmIn(h, text) {
    h.buf = (h.buf || "") + text;
    const reply = s => { for (const c of s) h.rx.push(c.charCodeAt(0)); };
    if (h.sms != null) {
      const i = h.buf.indexOf("\u001a");
      if (i >= 0) { const body = (h.buf.slice(0, i)).trim(); this.onNet({ kind: "sms", to: h.sms, text: body }); h.sms = null; h.buf = h.buf.slice(i + 1); reply("\r\n+CMGS: 1\r\n\r\nOK\r\n"); }
      return;
    }
    let nl;
    while ((nl = h.buf.search(/[\r\n]/)) >= 0) {
      const line = h.buf.slice(0, nl).trim(); h.buf = h.buf.slice(nl + 1);
      if (!line) continue;
      const up = line.toUpperCase();
      if (up === "AT") reply("\r\nOK\r\n");
      else if (up.startsWith("AT+CMGF")) reply("\r\nOK\r\n");
      else if (up.startsWith("AT+CMGS")) { const m = /"([^"]*)"/.exec(line); h.sms = m ? m[1] : "unknown"; h.buf = ""; reply("\r\n> "); return; }
      else if (up.startsWith("AT+CSQ")) reply("\r\n+CSQ: 21,0\r\n\r\nOK\r\n");
      else if (up.startsWith("AT+CREG")) reply("\r\n+CREG: 0,1\r\n\r\nOK\r\n");
      else if (up.startsWith("AT+COPS")) reply('\r\n+COPS: 0,0,"Simulated Network"\r\n\r\nOK\r\n');
      else reply("\r\nOK\r\n");
    }
  }
  /* phone sends text to a serial module */
  btSend(text) {
    let any = false;
    this.ser.forEach(h => { if (h.ok) { for (const c of text) h.rx.push(c.charCodeAt(0)); any = true; } });
    if (this.hwBt) { this.serialIn(text); any = true; }
    return any;
  }
  netCall(op, ptr, len, a, b) {
    const N = this.net9, cyc = this.cpu.cycles, log = (t, kind = "info") => this.onNet({ kind: "log", t, level: kind });
    switch (op) {
      case 1: N.wifi = this.str(ptr, len); N.connectAt = cyc + 1.2 * F; log(`Connecting to Wi-Fi "${N.wifi}"…`); N.told = false; return 0;
      case 2: if (N.ap) return 3; if (!N.wifi) return 0; if (cyc >= N.connectAt) { if (!N.told) { N.told = true; log(`Connected to "${N.wifi}". IP address 192.168.1.50`, "ok"); this.onNet({ kind: "wifi", on: true, ip: "192.168.1.50" }); } return 3; } return 6;
      case 9: N.ap = this.str(ptr, len); log(`Hotspot "${N.ap}" started. IP address 192.168.4.1`, "ok"); this.onNet({ kind: "wifi", on: true, ip: "192.168.4.1", ap: true }); return 1;
      case 10: N.wifi = null; log("Wi-Fi disconnected"); this.onNet({ kind: "wifi", on: false }); return 1;
      case 16: if (!N.server) { N.server = true; log("Web server started on port 80. Open it in the Phone panel.", "ok"); this.onNet({ kind: "server" }); } return 1;
      case 3: { if (!N.reqs.length) return 0; const r = N.reqs.shift(); r.id = N.nextId++; r.pos = 0; r.out = ""; r.code = 200; r.type = "text/html"; N.cur[r.id] = r; return r.id; }
      case 11: { const r = N.cur[a]; if (!r) return 0; if (b === 1) r.pos = 0; const bytes = []; while (bytes.length < len && r.pos < r.raw.length) bytes.push(r.raw.charCodeAt(r.pos++) & 255); return this.put(ptr, len, bytes); }
      case 13: { const r = N.cur[a]; return r ? r.raw.length - r.pos : 0; }
      case 14: { const r = N.cur[a]; return r && r.pos < r.raw.length ? r.raw.charCodeAt(r.pos) : -1; }
      case 15: { const r = N.cur[a]; return r && !r.done ? 1 : 0; }
      case 4: { const r = N.cur[a]; if (r) r.out += this.str(ptr, len); return len; }
      case 17: { const r = N.cur[a]; if (!r) return 0; const h = this.str(ptr, len); if (h.startsWith("LOCATION:")) r.location = h.slice(9); else { const m = /^(\d+)\s+(.*)$/.exec(h); if (m) { r.code = +m[1]; r.type = m[2]; } } return 1; }
      case 12: {
        const r = N.cur[a]; if (!r) return 0; r.done = true; delete N.cur[a];
        let body = r.out, code = r.code, type = r.type;
        const hm = /^HTTP\/1\.[01]\s+(\d+)[^\r\n]*\r?\n([\s\S]*?)\r?\n\r?\n/.exec(body);
        if (hm) { code = +hm[1]; const ct = /content-type:\s*([^\r\n]+)/i.exec(hm[2]); type = ct ? ct[1] : "text/html"; body = body.slice(hm[0].length); }
        log(`${r.method} ${r.path} → ${code}`, code < 400 ? "ok" : "warn");
        r.resolve({ code, type, body, location: r.location });
        return 1;
      }
      case 6: { const s = this.str(ptr, len), nl = s.indexOf("\n"), [method, url] = (nl < 0 ? s : s.slice(0, nl)).split(" "), payload = nl < 0 ? "" : s.slice(nl + 1); const res = fakeHttp(url || "", method, payload); N.http = { body: res.body, pos: 0 }; log(`HTTP ${method} ${url}${payload ? "  " + payload.slice(0, 80) : ""} → ${res.code}`, "ok"); return res.code; }
      case 7: { const h = N.http; if (!h) return 0; const bytes = []; while (bytes.length < len && h.pos < h.body.length) bytes.push(h.body.charCodeAt(h.pos++) & 255); return this.put(ptr, len, bytes); }
      case 18: return N.http ? N.http.body.length : 0;
      case 19: log(`MQTT connected as "${this.str(ptr, len)}"`, "ok"); this.onNet({ kind: "mqtt" }); return 1;
      case 20: { const s = this.str(ptr, len), i = s.indexOf("\n"); this.onNet({ kind: "mqttpub", topic: s.slice(0, i), msg: s.slice(i + 1) }); return 1; }
      case 21: log(`MQTT subscribed to ${this.str(ptr, len)}`); return 1;
      case 22: { const m = N.mqttIn.shift(); if (!m) return 0; const bytes = Array.from(m.topic + "\n" + m.msg).map(c => c.charCodeAt(0) & 255); return this.put(ptr, len, bytes); }
      case 23: log("ESP-NOW ready", "ok"); this.onNet({ kind: "espnow" }); return 1;
      case 24: { const bytes = Array.from(this.cpu.data.slice(ptr, ptr + len)); const txt = bytes.every(x => x === 0 || (x >= 32 && x < 127)) ? '"' + String.fromCharCode(...bytes.filter(x => x)) + '"' : bytes.map(x => x.toString(16).padStart(2, "0")).join(" "); this.onNet({ kind: "nowout", text: txt, n: len }); return 1; }
      case 25: { const m = N.nowIn.shift(); if (!m) return 0; return this.put(ptr, len, Array.from(m).map(c => c.charCodeAt(0) & 255)); }
    }
    return 0;
  }
  /* the Phone panel asks the board for a web page */
  webRequest(method, path, body = "") {
    const N = this.net9;
    if (!N.server) return Promise.resolve({ code: 0, type: "text/plain", body: "The board has not started a web server yet (server.begin())." });
    return new Promise(resolve => {
      const raw = `${method} ${path} HTTP/1.1\r\nHost: 192.168.1.50\r\nUser-Agent: CircuitLab-Phone\r\n${body ? "Content-Type: application/x-www-form-urlencoded\r\nContent-Length: " + body.length + "\r\n" : ""}\r\n${body}`;
      const r = { method, path, raw, resolve };
      N.reqs.push(r);
      setTimeout(() => { if (!r.done) resolve({ code: 504, type: "text/plain", body: "The board did not answer. Does loop() call server.handleClient() often?" }); }, 4000);
    });
  }
  mqttSend(topic, msg) { this.net9.mqttIn.push({ topic, msg }); }
  /* a button on the on-screen IR remote */
  irSend(cmd, addr = 0) {
    this.lastIr = { cmd, addr, at: this.cpu.cycles };
    (this.irQueue = this.irQueue || []).push(cmd | (addr << 8));
    let any = false;
    this.devices.forEach(D => { if (D.ir) { D.ir(addr, cmd); any = true; } });
    return any;
  }
  nowSend(text) { this.net9.nowIn.push(text); }
  devOf(id) { return this.devices.find(D => D.part.id === id); }

  /* ----- devices ----- */
  setupDevices() {
    const N = this.net, rt = this.rt;
    // hardware serial wired to an HC-05?
    const hb = this.project.parts.find(p => p.type === "hc05" && N.boardId && (N.connected(p.id + ":TXD", N.boardId + ":0") || N.connected(p.id + ":TXD", N.boardId + ":RX0")));
    if (hb) { this.hwBt = { part: hb, name: "HC-05", rx: [], ok: true }; this.onNet({ kind: "bt", name: "HC-05", ready: true }); }
    for (const part of this.project.parts) {
      const id = part.id, el = rt[id] && rt[id].el, sim = part.sim || (part.sim = {}), R = pin => N.root(id, pin);
      if (!el) continue;
      const D = { part, el, frame: null };
      const ok = () => this.partPowered(part);
      const dig = (pin, fn) => this.addOutput(R(pin), () => ok() ? (fn() ? this.supply(part) : 0) : null);
      const ana = (pin, fn) => this.addOutput(R(pin), () => ok() ? clamp(fn(), 0, 1) * this.supply(part) : null);
      const leds = (sigOn) => { D.frame = () => { el.led && el.led("pwr", ok()); el.led && el.led("sig", ok() && sigOn()); }; };
      switch (part.type) {
        case "led": D.frame = () => { const b = this.ledLevel(R("A"), R("C")); el.value = b > 0.02; el.brightness = Math.max(0.15, b); }; break;
        case "rgbled": D.frame = () => {
          const com = R("COM"), ca = (sim.common || "cathode") === "cathode";
          const ch = pin => this.ledLevel(ca ? R(pin) : com, ca ? com : R(pin), true);
          el.ledRed = ch("R"); el.ledGreen = ch("G"); el.ledBlue = ch("B");
        }; break;
        case "seg7": D.frame = () => {
          const com = R("COM.1"), ca = (sim.common || "cathode") === "cathode";
          el.values = ["A", "B", "C", "D", "E", "F", "G", "DP"].map(s => this.ledLevel(ca ? R(s) : com, ca ? com : R(s), true) > 0.3 ? 1 : 0);
        }; break;
        case "buzzer": this.setupBuzzer(D, R("2"), R("1")); break;
        case "pot": {
          this.addOutput(R("SIG"), () => { const hi = this.level(R("VCC")), lo = this.level(R("GND")); if (!hi || !lo) return null; const f = (el.value - (el.min ?? 0)) / (((el.max ?? 1023) - (el.min ?? 0)) || 1); return lo.v + (hi.v - lo.v) * f; });
          el.addEventListener("input", () => this.netChanged(R("SIG")));
          break;
        }
        case "joystick": {
          const okj = () => this.powered(id, "VCC", "GND");
          this.addOutput(R("HORZ"), () => okj() ? this.supply(part) * (0.5 + (el.xValue || 0) * 0.5) : null);
          this.addOutput(R("VERT"), () => okj() ? this.supply(part) * (0.5 + (el.yValue || 0) * 0.5) : null);
          this.addOutput(R("SEL"), () => (el.pressed ? 0 : null));
          const upd = () => { this.netChanged(R("HORZ")); this.netChanged(R("VERT")); this.netChanged(R("SEL")); };
          ["input", "button-press", "button-release"].forEach(e => el.addEventListener(e, upd));
          break;
        }
        case "ldr": D.lux = () => { if (sim.link && this.net.byId[sim.link]) { const L2 = sim.link; const a = this.level(N.root(L2, "A")), c = this.level(N.root(L2, "C")); return a && c && a.v - c.v > 1.5 ? 900 : 15; } return +sim.lux || 0; };
          if (sim.link) { const L2 = sim.link; this.watchNet(N.root(L2, "A"), () => this.netChanged(R("AO"))); }
          ana("AO", () => { const lux = Math.max(0.5, D.lux()); const r = 50e3 * Math.pow(10, 0.7) / Math.pow(lux, 0.7); return r / (r + 10000); }); dig("DO", () => D.lux() < 100); leds(() => D.lux() < 100); D.simChanged = () => { this.netChanged(R("AO")); this.netChanged(R("DO")); }; break;
        case "soil": ana("AO", () => (1023 - (+sim.moisture || 0) * 7.2) / 1023); dig("DO", () => (+sim.moisture || 0) <= 50); leds(() => (+sim.moisture || 0) > 50); D.frame2 = () => { el.moisture = +sim.moisture || 0; }; D.simChanged = () => { this.netChanged(R("AO")); this.netChanged(R("DO")); }; break;
        case "rain": ana("AO", () => (1000 - (+sim.wet || 0) * 8) / 1023); dig("DO", () => (+sim.wet || 0) <= 40); leds(() => (+sim.wet || 0) > 40); D.frame2 = () => { el.wet = +sim.wet || 0; }; D.simChanged = () => { this.netChanged(R("AO")); this.netChanged(R("DO")); }; break;
        case "mq2": case "mq135": ana("AO", () => (80 + (+sim.ppm || 0) * 0.82 + (Math.random() - .5) * 6) / 1023); dig("DO", () => (+sim.ppm || 0) < 400); leds(() => (+sim.ppm || 0) >= 400); D.frame2 = () => { el.level = +sim.ppm || 0; }; D.simChanged = () => { this.netChanged(R("AO")); this.netChanged(R("DO")); }; break;
        case "flame": ana("AO", () => (1000 - (+sim.flame || 0) * 9) / 1023); dig("DO", () => (+sim.flame || 0) <= 40); leds(() => (+sim.flame || 0) > 40); D.frame2 = () => { el.flame = +sim.flame || 0; }; D.simChanged = () => { this.netChanged(R("AO")); this.netChanged(R("DO")); }; break;
        case "sound": { let t = 0; ana("AO", () => { const l = +sim.loud || 0; return clamp((l + Math.sin(t += 1.3) * l * 0.15 + 20) / 1023, 0, 1); }); dig("DO", () => (+sim.loud || 0) > 500); leds(() => (+sim.loud || 0) > 500); D.frame2 = () => { el.loud = +sim.loud || 0; this.netChanged(R("AO")); }; D.simChanged = () => { this.netChanged(R("AO")); this.netChanged(R("DO")); }; break; }
        case "pulse": {
          const wave = () => { const bpm = +sim.bpm || 72, ph = (this.cpu.cycles / F * bpm / 60) % 1; return (512 + (ph < 0.12 ? Math.sin(ph / 0.12 * Math.PI) * 260 : 0) - (ph > 0.12 && ph < 0.2 ? 40 : 0)) / 1023; };
          this.addOutput(R("S"), () => this.powered(id, "+", "-") ? wave() * this.supply(part) : null);
          D.frame = () => { el.beat = wave() > 0.6; this.netChanged(R("S")); }; break;
        }
        case "irline": dig("OUT", () => !!sim.black); leds(() => !!sim.black); D.frame2 = () => { el.black = !!sim.black; }; D.simChanged = () => this.netChanged(R("OUT")); break;
        case "ir": dig("OUT", () => !sim.obstacle); D.frame = () => { el.led("pwr", ok()); el.state = ok() && !!sim.obstacle; }; D.simChanged = () => this.netChanged(R("OUT")); break;
        case "tilt": dig("OUT", () => !!sim.tilt); D.simChanged = () => this.netChanged(R("OUT")); break;
        case "pir": {
          dig("OUT", () => sim._until > performance.now());
          D.frame = () => { const on = sim._until > performance.now(); if (on !== D._on) { D._on = on; this.netChanged(R("OUT")); } };
          D.simChanged = () => { sim._until = performance.now() + 5000; this.netChanged(R("OUT")); };
          break;
        }
        case "hcsr04": this.setupHCSR04(D, R); break;
        case "dht22": case "dht11": this.setupDHT(D, R); break;
        case "servo": {
          let rise = 0;
          this.watchNet(R("PWM"), (lv, c) => { if (lv) rise = c; else if (rise) { const w = (c - rise) / US; if (w > 400 && w < 2700 && this.powered(id, "V+", "GND")) el.angle = clamp((w - 544) / (2400 - 544) * 180, 0, 180); } });
          break;
        }
        case "neopixel": case "ledring": case "ledstrip": this.setupNeoPixel(D, R("DIN"), part.type === "neopixel" ? 1 : (+(part.attrs || {}).pixels || (part.type === "ledring" ? 12 : 16))); break;
        case "lcd": this.setupLCD(D, R); break;
        case "oled": D.on = true; D.frame = () => { if (!D.dirty) return; D.dirty = false; el.show(D.buf, D.w || 128, D.h || 64, D.inv, D.on && ok()); }; break;
        case "max7219": D.frame = () => { if (!D.dirty) return; D.dirty = false; el.setRows(D.off ? [0, 0, 0, 0, 0, 0, 0, 0] : D.rows || [0, 0, 0, 0, 0, 0, 0, 0]); }; break;
        case "hx711": D.frame = () => { el.grams = +sim.grams || 0; }; break;
        case "tcs34725": D.frame = () => { el.setColor(sim.color || "#808080", D.led); }; break;
        case "ina219": D.frame = () => { el.reading = D.text || ""; }; break;
        case "rfid": D.frame = () => { el.led("rf", ok()); el.showCard(rt[id].state.tapShow > performance.now() ? rt[id].state.tapName : ""); }; break;
        case "hc05": D.frame = () => { el.led("bt", ok() && (performance.now() % (this.ser.some(h => h.part === part) || this.hwBt ? 2000 : 300)) < 150); }; break;
        case "mpu6050": {
          D.frame = () => el.led("pwr", ok());
          let ptr = 0, first = false, snap = null;
          const regs = () => { const s2 = part.sim, a = [+s2.ax || 0, +s2.ay || 0, s2.az == null ? 9.8 : +s2.az].map(x => Math.round(x / 9.80665 * 16384)), t = Math.round((26.5 - 36.53) * 340), g = [+s2.gx || 0, +s2.gy || 0, +s2.gz || 0].map(x => Math.round(x * 131)); const r = new Uint8Array(128); const put = (o, v) => { v = clamp(v, -32768, 32767) & 0xffff; r[o] = v >> 8; r[o + 1] = v & 255; }; put(0x3b, a[0]); put(0x3d, a[1]); put(0x3f, a[2]); put(0x41, t); put(0x43, g[0]); put(0x45, g[1]); put(0x47, g[2]); r[0x75] = 0x68; return r; };
          this.i2c[(part.attrs || {}).ad0 === "1" ? 0x69 : 0x68] = { ok: () => this.i2cWired(part) && ok(), start: w => { first = w; if (!w) snap = regs(); }, write: v => { if (first) { ptr = v & 127; first = false; } else ptr = (ptr + 1) & 127; }, read: () => { if (!snap) snap = regs(); const v = snap[ptr]; ptr = (ptr + 1) & 127; return v; } };
          break;
        }
        case "stepper": this.setupStepper(D, R); break;
        case "stepper28": this.setupStepper28(D, R); break;
        case "l298n": D.frame = () => { el.powered = this.l298nPower(id); }; break;
        case "dcmotor": D.frame = dt => { el.speed = this.loadDrive(part, "M1", "M2", true); el.spin(dt); }; break;
        case "fan": D.frame = dt => { el.speed = this.loadDrive(part, "+", "-", true); el.spin(dt); }; break;
        case "pump": D.frame = () => { el.on = Math.abs(this.loadDrive(part, "+", "-", true)) > 0.2; }; break;
        case "lamp": D.frame = () => { el.on = Math.abs(this.loadDrive(part, "+", "-", false)); }; break;
        case "vibe": D.frame = () => { const l = this.level(R("IN")); el.on = ok() && !!(l && l.v > this.logic / 2); }; break;
        case "relay": {
          const n = +((part.attrs || {}).channels || 1), st = rt[id].state; st.coil = st.coil || [];
          const upd = () => { let ch = false; for (let i = 0; i < n; i++) { const l = this.level(R(n === 1 ? "IN" : "IN" + (i + 1))); const hi = !!(l && l.v > (this.logic / 2)), on = ok() && (sim.trigger === "LOW" ? !!l && !hi : hi); if (on !== !!st.coil[i]) { st.coil[i] = on; ch = true; el.setCoil(i, on); } } if (ch) this.switchChanged(id); };
          for (let i = 0; i < n; i++) this.watchNet(R(n === 1 ? "IN" : "IN" + (i + 1)), upd);
          D.frame = upd; break;
        }
        case "solar": this.addOutput(R("+"), () => 6 * (+sim.sun || 0) / 100); D.frame = () => { el.light = +sim.sun || 0; }; D.simChanged = () => this.netChanged(R("+")); break;
        case "voltsensor": this.addOutput(R("S"), () => { const a = this.level(R("VIN")), g = this.level(R("GIN")); if (!a) return null; return Math.max(0, a.v - (g ? g.v : 0)) / 5; }); D.frame = () => this.netChanged(R("S")); break;
        case "uno": D.frame = () => { el.led13 = this.pin[13].duty > 0.3; el.ledPower = true; el.ledTX = this.txAt && performance.now() - this.txAt < 60; }; break;
        case "esp32": D.frame = () => { el.ledPower = true; el.led1 = this.pin[2].duty > 0.3; }; break;
        default: {
          const dig = (pin, fn) => this.addOutput(R(pin), () => ok() ? (fn() ? this.supply(part) : 0) : null);
          const ana = (pin, fn) => this.addOutput(R(pin), () => ok() ? clamp(fn(), 0, 1) * this.supply(part) : null);
          const leds2 = sigOn => { D.frame = () => { el.led && el.led("pwr", ok()); el.led && el.led("sig", ok() && sigOn()); }; };
          const bag = { R, ok, dig, ana, leds: leds2 };
          try { setupExtra7(this, D, bag) || setupExtra5(this, D, bag) || setupExtra3(this, D, bag) || setupExtra4(this, D, bag) || setupExtra(this, D, bag); } catch (e) { console.warn("part setup failed:", part.type, e); }
        }
      }
      this.devices.push(D);
    }
    this.setupI2CLcd();
  }
  supply(part) { const pw = (PARTDEF[part.type] || {}).pw; const v = pw && pw.vcc ? this.level(this.net.root(part.id, pw.vcc[0])) : null; return v ? v.v : this.logic; }
  setupI2CLcd() {}
  /* LED brightness 0..1 from anode/cathode nets */
  ledLevel(ra, rc, quiet) {
    const a = this.level(ra), c = this.level(rc);
    if (!a || !c) return 0;
    if (c.v - a.v > 1.5) { this.warnings.add("An LED looks backwards: the long leg (A) goes to the + side."); return 0; }
    if (a.v - c.v < 1.5) return 0;
    if (!quiet && !a.weak && !c.weak && (a.src === "pin" || c.src === "pin" || a.v >= 5)) this.warnings.add("An LED has no resistor. Real LEDs can burn out: add a 220 Ω resistor.");
    let b = 1;
    if (a.pin != null) b *= this.pin[a.pin].duty;
    if (c.pin != null) b *= 1 - this.pin[c.pin].duty;
    return b;
  }
  setupBuzzer(D, rs, rg) {
    let lastRise = 0, period = 0, lastEdge = 0;
    this.watchNet(rs, (lv, c) => { lastEdge = c; if (lv) { if (lastRise) period = c - lastRise; lastRise = c; } });
    D.frame = () => {
      const c = this.cpu.cycles, g = this.level(rg);
      const toggling = c - lastEdge < F * 0.05 && period > 0;
      const s = this.level(rs);
      let f = 0;
      if (g && g.v < 1) { if (toggling) f = F / period; else if (s && s.v > 2.5) f = 2300; }
      D.el.hasSignal = f > 0;
      this.sound(D, f);
    };
    D.stop = () => this.sound(D, 0);
  }
  sound(D, f) {
    try {
      if (!f) { if (D.osc) D.gain.gain.value = 0; return; }
      if (!Sim.audio) Sim.audio = new (window.AudioContext || window.webkitAudioContext)();
      if (!D.osc) { D.osc = Sim.audio.createOscillator(); D.gain = Sim.audio.createGain(); D.osc.type = "square"; D.osc.connect(D.gain); D.gain.connect(Sim.audio.destination); D.osc.start(); }
      D.osc.frequency.value = clamp(f, 30, 12000); D.gain.gain.value = Sim.muted ? 0 : 0.035;
    } catch (e) { }
  }
  setupHCSR04(D, R) {
    const id = D.part.id, sim = D.part.sim; let rise = 0, echo = 0;
    const er = R("ECHO");
    this.addOutput(er, () => this.powered(id, "VCC", "GND") ? (echo ? this.supply(D.part) : 0) : null);
    this.watchNet(R("TRIG"), (lv, c) => {
      if (lv) { rise = c; return; }
      if (!rise || c - rise < 8 * US || echo || !this.powered(id, "VCC", "GND")) return;
      const d = clamp(+sim.dist || 40, 2, 400), dur = d * 58.3 * US;
      this.cpu.addClockEvent(() => { echo = 1; this.netChanged(er); this.cpu.addClockEvent(() => { echo = 0; this.netChanged(er); }, Math.round(dur)); }, 400 * US);
    });
  }
  setupDHT(D, R) {
    const id = D.part.id, sim = D.part.sim, dr = R("SDA");
    let drive = null, lowAt = 0, busy = false;
    this.addOutput(dr, () => drive === null ? null : drive * this.logic);
    const d0 = this.net.drivers(dr)[0];
    if (!d0) return;
    const n = d0.n;
    (this.watch[n] = this.watch[n] || []).push((lv, c, out) => {
      if (busy) return;
      if (out && !lv) { lowAt = c; return; }
      if (lowAt && !out && c - lowAt > 800 * US && this.powered(id, "VCC", "GND")) { lowAt = 0; this.dhtSend(sim, v => { drive = v; this.netChanged(dr); }, b => { busy = b; }); }
      else if (out && lv) lowAt = 0;
    });
    D.frame = () => { if (!busy && lowAt && !this.isOut(n) && this.cpu.cycles - lowAt > 800 * US && this.powered(id, "VCC", "GND")) { lowAt = 0; this.dhtSend(sim, v => { drive = v; this.netChanged(dr); }, b => { busy = b; }); } };
  }
  dhtSend(sim, set, setBusy) {
    let bytes;
    if (sim.kind === "11") {   // DHT11 sends whole degrees and percent
      bytes = [Math.round(clamp(+sim.hum, 0, 100)), 0, Math.round(clamp(+sim.temp, 0, 60)), 0];
    } else {
      const h = Math.round(clamp(+sim.hum, 0, 100) * 10), t0 = Math.round((+sim.temp) * 10), t = t0 < 0 ? (0x8000 | -t0) : t0;
      bytes = [h >> 8, h & 255, t >> 8, t & 255];
    }
    bytes.push((bytes[0] + bytes[1] + bytes[2] + bytes[3]) & 255);
    const seq = [[30, null], [80, 0], [80, 1]];
    bytes.forEach(B => { for (let i = 7; i >= 0; i--) { seq.push([50, 0]); seq.push([(B >> i) & 1 ? 70 : 26, 1]); } });
    seq.push([50, 0]); seq.push([0, null]);
    setBusy(true);
    let i = 0;
    const run = () => { if (i >= seq.length) { set(null); setBusy(false); return; } const [dt, v] = seq[i++]; set(v); if (dt) this.cpu.addClockEvent(run, Math.round(dt * US)); else run(); };
    run();
  }
  setupNeoPixel(D, rin, count, setter) {
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
      const vis = p => { const m = Math.max(p.r, p.g, p.b) / 255; if (!m) return { r: 0, g: 0, b: 0 }; const k = Math.min(1, 0.35 + 0.65 * Math.sqrt(m)) / m / 255; return { r: p.r * k, g: p.g * k, b: p.b * k }; };
      if (setter) shown.forEach((p, i) => setter(i, vis(p)));
      else if (count === 1) { const v = vis(shown[0]); D.el.r = v.r; D.el.g = v.g; D.el.b = v.b; }
      else shown.forEach((p, i) => D.el.setPixel(i, vis(p)));
    };
  }
  setupLCD(D, R, cols = 16, rows = 2) {
    const core = new LCDCore(D.el, cols, rows), id = D.part.id;
    D.el.characters = new Uint8Array(cols * rows).fill(32);
    if (((D.part.attrs || {}).pins || "i2c") === "i2c") {
      let last = 0, bl = 1;
      const ok = () => this.powered(id, "VCC", "GND") && this.i2cWired(D.part);
      this.i2c[parseInt((D.part.sim || {}).addr || "0x27", 16)] = { ok, write: v => { if ((last & 4) && !(v & 4)) core.strobe(v & 1, v & 0xf0); last = v; bl = (v >> 3) & 1; } };
      D.frame = () => core.render(ok() && !!bl);
    } else {
      const pins = ["D0", "D1", "D2", "D3", "D4", "D5", "D6", "D7"].map(p => R(p)), rs = R("RS");
      const val = r => { const l = this.level(r); return l && l.v > 2 ? 1 : 0; };
      this.watchNet(R("E"), lv => { if (lv) return; let d = 0; pins.forEach((r, i) => { d |= val(r) << i; }); core.strobe(val(rs), d); });
      D.frame = () => core.render(this.powered(id, "VDD", "VSS"));
    }
  }
  setupStepper(D, R) {
    const roots = ["A+", "A-", "B+", "B-"].map(R); let prev = null, angle = 0;
    const upd = () => {
      const l = roots.map(r => { const x = this.level(r); return x && x.v > 2 ? 1 : 0; });
      const ia = l[0] - l[1], ib = l[2] - l[3]; if (!ia && !ib) return;
      const e = Math.atan2(ib, ia) / (Math.PI / 2);
      if (prev !== null) { let d = e - prev; while (d > 2) d -= 4; while (d <= -2) d += 4; angle += d * 1.8; }
      prev = e;
    };
    roots.forEach(r => this.watchAny(r, upd));
    D.frame = () => { upd(); D.el.angle = ((angle % 360) + 360) % 360; D.el.value = Math.round(angle / 1.8) + ""; D.el.units = "steps"; };
  }
  setupStepper28(D, R) {
    const id = D.part.id, roots = ["IN1", "IN2", "IN3", "IN4"].map(R); let prev = null, steps = 0, bitsNow = 0;
    const upd = () => {
      const l = roots.map(r => { const x = this.level(r); return x && x.v > this.logic / 2 ? 1 : 0; });
      bitsNow = l[0] | l[1] << 1 | l[2] << 2 | l[3] << 3;
      if (!this.powered(id, "+", "-")) return;
      let x = 0, y = 0; [0, 1, 2, 3].forEach(i => { if (l[i]) { x += Math.cos(i * Math.PI / 2); y += Math.sin(i * Math.PI / 2); } });
      if (Math.abs(x) < 1e-6 && Math.abs(y) < 1e-6) return;
      const e = Math.atan2(y, x) / (Math.PI / 2);
      if (prev !== null) { let d = e - prev; while (d > 2) d -= 4; while (d <= -2) d += 4; if (Math.abs(d) < 1.6) steps += d; }
      prev = e;
    };
    roots.forEach(r => this.watchAny(r, upd));
    D.frame = () => { upd(); D.el.coils = bitsNow; D.el.setAngle(steps * 360 / 2048); };
  }
  l293dChan(id, ch) {
    const vs = this.level(this.net.root(id, "VS")), g = this.level(this.net.root(id, "GND"));
    if (!(vs && vs.v > 3 && g && g.v < 1)) return 0;
    const [en, i1, i2] = ch === "A" ? ["EN1", "IN1", "IN2"] : ["EN2", "IN3", "IN4"];
    const L = pn => { const x = this.level(this.net.root(id, pn)); return x && x.v > 2 ? 1 : 0; };
    const enR = this.level(this.net.root(id, en));
    const speed = enR ? (enR.pin != null ? this.pin[enR.pin].duty : enR.v > 2 ? 1 : 0) : 0;
    const a = L(i1), b = L(i2);
    return a && !b ? speed : !a && b ? -speed : 0;
  }
  l298nPower(id) { const v = this.level(this.net.root(id, "12V")), g = this.level(this.net.root(id, "GND")); return !!(v && v.v > 4 && g && g.v < 1); }
  l298nChan(id, ch) {
    if (!this.l298nPower(id)) return 0;
    const part = this.net.byId[id], sim = part.sim || {};
    const [en, i1, i2] = ch === "A" ? ["ENA", "IN1", "IN2"] : ["ENB", "IN3", "IN4"];
    const L = p => { const x = this.level(this.net.root(id, p)); return x && x.v > 2 ? 1 : 0; };
    const enR = this.level(this.net.root(id, en));
    const speed = (ch === "A" ? sim.ena : sim.enb) ? 1 : enR ? (enR.pin != null ? this.pin[enR.pin].duty : enR.v > 2 ? 1 : 0) : 0;
    const a = L(i1), b = L(i2);
    return a && !b ? speed : !a && b ? -speed : 0;
  }
  /* TB6612: a speed pin per channel, plus a standby pin that must be high */
  tb6612Chan(id, ch) {
    const N = this.net, lv = p => { const x = this.level(N.root(id, p)); return x && x.v > 2 ? 1 : 0; };
    const vm = this.level(N.root(id, "VM")), g = this.level(N.root(id, "GND"));
    if (!(vm && vm.v > 2.5 && g && g.v < 1)) return 0;
    if (!lv("STBY")) return 0;                                   // asleep: the classic TB6612 mistake
    const [pwm, i1, i2] = ch === "A" ? ["PWMA", "AIN1", "AIN2"] : ["PWMB", "BIN1", "BIN2"];
    const pr = this.level(N.root(id, pwm));
    const speed = pr ? (pr.pin != null ? this.pin[pr.pin].duty : pr.v > 2 ? 1 : 0) : 0;
    const a = lv(i1), b = lv(i2);
    return a && !b ? speed : !a && b ? -speed : 0;
  }
  /* DRV8833: no speed pin. The PWM rides on whichever input is active. */
  drv8833Chan(id, ch) {
    const N = this.net;
    const duty = p => { const x = this.level(N.root(id, p)); if (!x) return 0; return x.pin != null ? this.pin[x.pin].duty : (x.v > 2 ? 1 : 0); };
    const vm = this.level(N.root(id, "VM")), g = this.level(N.root(id, "GND"));
    if (!(vm && vm.v > 2.2 && g && g.v < 1)) return 0;
    const slp = this.level(N.root(id, "SLP"));
    if (slp && slp.v < 2) return 0;                              // SLP low holds it asleep
    const [i1, i2] = ch === "A" ? ["AIN1", "AIN2"] : ["BIN1", "BIN2"];
    const a = duty(i1), b = duty(i2);
    if (a > 0.02 && b <= 0.02) return a;
    if (b > 0.02 && a <= 0.02) return -b;
    return 0;                                                    // both high is a brake, both low a coast
  }
  /* how hard a motor / fan / pump / lamp is driven (-1..1) */
  loadDrive(part, p1, p2, motor) {
    const N = this.net, r1 = N.root(part.id, p1), r2 = N.root(part.id, p2);
    for (const p of this.project.parts.filter(x => x.type === "l293d")) {
      const o = k => N.root(p.id, k), g1 = this.group(r1), g2 = this.group(r2);
      if (g1.includes(o("OUT1")) && g2.includes(o("OUT2"))) return this.l293dChan(p.id, "A");
      if (g1.includes(o("OUT2")) && g2.includes(o("OUT1"))) return -this.l293dChan(p.id, "A");
      if (g1.includes(o("OUT3")) && g2.includes(o("OUT4"))) return this.l293dChan(p.id, "B");
      if (g1.includes(o("OUT4")) && g2.includes(o("OUT3"))) return -this.l293dChan(p.id, "B");
    }
    for (const p of this.project.parts.filter(x => x.type === "tb6612")) {
      const o = k => N.root(p.id, k), g1 = this.group(r1), g2 = this.group(r2);
      if (g1.includes(o("AO1")) && g2.includes(o("AO2"))) return this.tb6612Chan(p.id, "A");
      if (g1.includes(o("AO2")) && g2.includes(o("AO1"))) return -this.tb6612Chan(p.id, "A");
      if (g1.includes(o("BO1")) && g2.includes(o("BO2"))) return this.tb6612Chan(p.id, "B");
      if (g1.includes(o("BO2")) && g2.includes(o("BO1"))) return -this.tb6612Chan(p.id, "B");
    }
    for (const p of this.project.parts.filter(x => x.type === "drv8833")) {
      const o = k => N.root(p.id, k), g1 = this.group(r1), g2 = this.group(r2);
      if (g1.includes(o("AOUT1")) && g2.includes(o("AOUT2"))) return this.drv8833Chan(p.id, "A");
      if (g1.includes(o("AOUT2")) && g2.includes(o("AOUT1"))) return -this.drv8833Chan(p.id, "A");
      if (g1.includes(o("BOUT1")) && g2.includes(o("BOUT2"))) return this.drv8833Chan(p.id, "B");
      if (g1.includes(o("BOUT2")) && g2.includes(o("BOUT1"))) return -this.drv8833Chan(p.id, "B");
    }
    for (const p of this.project.parts.filter(x => x.type === "l298n")) {
      const o = k => N.root(p.id, k), g1 = this.group(r1);
      if (g1.includes(o("OUT1")) && this.group(r2).includes(o("OUT2"))) return this.l298nChan(p.id, "A");
      if (g1.includes(o("OUT2")) && this.group(r2).includes(o("OUT1"))) return -this.l298nChan(p.id, "A");
      if (g1.includes(o("OUT3")) && this.group(r2).includes(o("OUT4"))) return this.l298nChan(p.id, "B");
      if (g1.includes(o("OUT4")) && this.group(r2).includes(o("OUT3"))) return -this.l298nChan(p.id, "B");
    }
    const a = this.level(r1), b = this.level(r2);
    if (!a || !b) return 0;
    if ((a.src === "pin" || b.src === "pin") && Math.abs(a.v - b.v) > 1.5) { this.warnings.add(`The ${motor ? "motor" : "lamp"} is wired straight to a board pin. Pins can't give enough current: use a relay or the L298N.`); return 0; }
    const dv = a.v - b.v;
    return clamp(dv / 5, -1, 1);
  }
  /* ----- run ----- */
  serialIn(text) { for (const ch of text) this.rxQueue.push(ch.charCodeAt(0)); }
  run(ms) {
    const cpu = this.cpu, target = cpu.cycles + Math.round(F * ms / 1000);
    const t0 = performance.now();
    while (cpu.cycles < target) {
      for (let i = 0; i < 2000; i++) { avrInstruction(cpu); cpu.tick(); }
      if (this.onSample) this.onSample(this);
      if (this.rxQueue.length && !this.usart.rxBusy) { if (this.usart.writeByte(this.rxQueue[0])) this.rxQueue.shift(); }
      if (performance.now() - t0 > 40) break;
    }
    this.speed = (cpu.cycles - (target - Math.round(F * ms / 1000))) / (F * ms / 1000);
  }
  frame(dt) {
    const c = this.cpu.cycles;
    for (const p of this.pin) { if (p.pwm != null) { p.duty = p.pwm; continue; } const span = c - p.win; if (p.lv) p.hi += c - p.last; p.duty = span > 0 ? Math.min(1, p.hi / span) : p.lv; p.hi = 0; p.win = c; p.last = c; }
    this.warnings.clear();
    for (const D of this.devices) { if (D.frame) D.frame(dt); if (D.frame2) D.frame2(dt); }
    this.onWarn([...this.warnings, ...this.notes]);
  }
  simChanged(pid) { const D = this.devOf(pid); if (D && D.simChanged) D.simChanged(); }
  stop() { this.devices.forEach(D => { if (D.stop) D.stop(); }); }
}
const PARTDEF = PARTS;
export { CARDS };
