/* Circuit Lab - the electrical side of a circuit, solved properly.

   The netlist knows which pins are joined. This works out the voltage on
   every joined group and the current through every part, the way a real
   simulator (SPICE, Tinkercad) does: nodal analysis, solved by Gaussian
   elimination, with LEDs and diodes as switching models that are settled by
   iterating until each one is either on and carrying current or off.

   What it models:
   - resistors at their value, the potentiometer as a real 10 kΩ track
   - LEDs by colour (red ~2.0 V, blue/white ~3.1 V at 20 mA), diodes ~0.7 V
   - batteries with their internal resistance, the board's 5 V and 3.3 V rails
   - output pins (about 25 Ω inside the chip, so an LED with no resistor
     draws far too much, as it would on a real Uno), INPUT_PULLUP (35 kΩ)
   - buttons, switches, relays and transistors as closed or open contacts
   - sensor outputs as sources with a little resistance

   Everything else in the simulator (motors, buzzers, displays) still reads
   the digital levels it always did; LEDs, analog inputs and the warnings
   read from here. */

const RS_LED = 10;                 // series resistance of an LED, ohms
const LED_VF = { red: 1.8, orange: 1.85, yellow: 1.9, green: 1.95, blue: 2.9, white: 2.9 };   // knee, volts
/* internal resistance: a CR2032 sags hard (about 20 mA into an LED), and three
   lemons give well under a milliamp, so their LED only glows faintly */
const BATT_R = { "9V": 2, "4xAA": 0.6, "2xAA": 0.3, "18650": 0.08, coin: 40, lemon: 3000 };
const G_ON = 1e4, G_MIN = 1e-9, G_OFF = 1e-9;

/* "220", "10k", "4.7k", "1M" -> ohms */
export function ohms(t, dflt = 1000) {
  const s = String(t == null ? "" : t).trim(), n = parseFloat(s);
  if (!isFinite(n)) return dflt;
  const m = /([kKmM])/.exec(s.replace(/[0-9.\s]/g, ""));
  return Math.max(0.01, n * (m ? (m[1] === "k" || m[1] === "K" ? 1e3 : 1e6) : 1));
}

export class Analog {
  constructor(sim) {
    this.sim = sim; this.net = sim.net;
    this.v = new Map(); this.led = new Map(); this.pinI = new Map(); this.ledV = new Map();
    this.sig = ""; this.ok = false;
    this.build();
  }

  /* the circuit's parts as elements between nets; values that change while
     running (pins, switches, the pot) are read through functions */
  build() {
    const N = this.net, sim = this.sim, R = (id, pin) => N.root(id, pin);
    const els = this.els = [];              // { a, b, g() } resistors and contacts
    const src = this.src = [];              // { p, n, v(), r } sources
    const dio = this.dio = [];              // { a, c, v0, rs, key, kind }
    const gnd = this.gnd = N.boardId ? R(N.boardId, "GND.1") : null;
    for (const p of sim.project.parts) {
      const id = p.id, at = p.attrs || {}, st = p.sim || {};
      switch (p.type) {
        case "resistor": { const r = ohms(at.value, 220); els.push({ a: R(id, "1"), b: R(id, "2"), g: () => 1 / r }); break; }
        case "inductor": els.push({ a: R(id, "1"), b: R(id, "2"), g: () => 1 }); break;
        case "pot": {
          const total = 10000, f = () => { const el = sim.rt[id] && sim.rt[id].el; if (!el) return 0.5; return Math.min(1, Math.max(0, (el.value - (el.min ?? 0)) / (((el.max ?? 1023) - (el.min ?? 0)) || 1))); };
          els.push({ a: R(id, "VCC"), b: R(id, "SIG"), g: () => 1 / (total * (1 - f()) + 1) });
          els.push({ a: R(id, "SIG"), b: R(id, "GND"), g: () => 1 / (total * f() + 1) });
          break;
        }
        case "led": dio.push({ a: R(id, "A"), c: R(id, "C"), v0: LED_VF[at.color] || 1.8, rs: RS_LED, key: id, kind: "led" }); break;
        case "rgbled": {
          const com = R(id, "COM"), ca = (st.common || "cathode") === "cathode";
          [["R", 1.8], ["G", 2.8], ["B", 2.8]].forEach(([pin, vf]) => dio.push({ a: ca ? R(id, pin) : com, c: ca ? com : R(id, pin), v0: vf, rs: RS_LED, key: id + "|" + pin, kind: "led" }));
          break;
        }
        case "seg7": {
          const com = R(id, "COM.1"), ca = (st.common || "cathode") === "cathode";
          ["A", "B", "C", "D", "E", "F", "G", "DP"].forEach(s => dio.push({ a: ca ? R(id, s) : com, c: ca ? com : R(id, s), v0: 1.8, rs: RS_LED, key: id + "|" + s, kind: "led" }));
          break;
        }
        case "ledbar": for (let i = 1; i <= 10; i++) dio.push({ a: R(id, "A" + i), c: R(id, "C" + i), v0: 1.8, rs: RS_LED, key: id + "|" + i, kind: "led" }); break;
        case "diode": dio.push({ a: R(id, "A"), c: R(id, "K"), v0: 0.65, rs: 0.5, key: id, kind: "diode" }); break;
        case "battery": {
          const k = at.kind || "9V", V = ((sim.batt || {})[k] || { v: 9 }).v;
          src.push({ p: R(id, "+"), n: R(id, "-"), v: () => V, r: BATT_R[k] || 1, what: "battery" });
          break;
        }
      }
    }
    /* the board's own supply rails */
    if (N.boardId && N.board) for (const [pin, V] of Object.entries(N.board.power)) {
      if (!(V > 0)) continue;
      const r = R(N.boardId, pin); if (!r || r === gnd) continue;
      src.push({ p: r, n: gnd, v: () => V, r: V < 4 ? 0.5 : 0.05, what: "rail" });
    }
    /* output pins and pull-ups: re-read every solve */
    this.pins = [];
    if (N.boardId) for (const k of Object.keys(N.pinRoot)) this.pins.push({ n: +k, r: N.pinRoot[k] });
    /* buttons, switches, relays, transistors: contacts that open and close */
    const seen = new Set();
    this.sw = [];
    for (const [a, es] of Object.entries(N.sw)) for (const e of es) {
      const key = a < e.o ? a + "|" + e.o : e.o + "|" + a; if (seen.has(key)) continue; seen.add(key);
      this.sw.push({ a, b: e.o, closed: e.closed });
    }
  }

  /* everything that can change between frames, so an unchanged circuit is not solved again */
  signature() {
    const sim = this.sim;
    let s = "";
    for (const P of this.pins) {
      const pin = sim.pin[P.n];
      s += sim.isOut(P.n) ? (this.pinHigh(P.n) ? "H" : "L") : (sim.state(P.n) === sim.PULLUP ? "U" : "z");
    }
    for (const w of this.sw) s += w.closed() ? "1" : "0";
    for (const e of this.els) s += "," + e.g().toPrecision(4);
    for (const [r, fs] of Object.entries(sim.outputs)) for (const f of fs) { if (f._resistive) continue; const x = f(); s += "|" + (x == null ? "-" : (+x).toFixed(3)); }
    return s;
  }
  pinHigh(n) {
    const p = this.sim.pin[n];
    if (p.pwm != null) return p.pwm > 0;     // a PWM pin is solved in its on state; brightness is scaled by the duty
    return p.lv || p.duty > 0.02;
  }

  update(force) {
    try {
      const sig = this.signature();
      if (!force && sig === this.sig && this.ok) return false;
      this.sig = sig; this.solve(); this.ok = true;
      return true;
    } catch (e) { this.ok = false; console.warn("circuit solver:", e); return false; }
  }

  solve() {
    const sim = this.sim, N = this.net, logic = sim.logic;
    /* the stamps: conductances between nets, and Norton sources */
    const G = [], J = [];   // G: [a, b, g], J: [a, b, g, v]  (element a->b with g and an emf v)
    for (const e of this.els) G.push([e.a, e.b, e.g()]);
    for (const w of this.sw) if (w.closed()) G.push([w.a, w.b, G_ON]);
    for (const s of this.src) J.push([s.p, s.n, 1 / s.r, s.v(), s]);
    const gnd = this.gnd;
    const pinSrc = [];
    for (const P of this.pins) {
      if (!gnd) break;
      if (sim.isOut(P.n)) { const s = { pin: P.n }; pinSrc.push(s); J.push([P.r, gnd, 1 / 25, this.pinHigh(P.n) ? logic : 0, s]); }
      else if (sim.state(P.n) === sim.PULLUP) J.push([P.r, gnd, 1 / 35000, logic, null]);
    }
    for (const [r, fs] of Object.entries(sim.outputs)) for (const f of fs) {
      if (f._resistive) continue;
      const x = f(); if (x == null) continue;
      J.push([r, gnd || r, 1 / 50, +x, null]);
      break;
    }
    /* number the nets that matter; the reference is the board's ground, else a battery's minus */
    const ref = gnd || (this.src[0] && this.src[0].n) || (this.dio[0] && this.dio[0].c) || null;
    const idx = new Map(); let n = 0;
    const touch = x => { if (x && x !== ref && !idx.has(x)) idx.set(x, n++); };
    G.forEach(([a, b]) => { touch(a); touch(b); }); J.forEach(([a, b]) => { touch(a); touch(b); }); this.dio.forEach(d => { touch(d.a); touch(d.c); });
    const on = this.dio.map(() => false);
    let V = new Float64Array(n);
    for (let it = 0; it < 40; it++) {
      const A = Array.from({ length: n }, () => new Float64Array(n)), b = new Float64Array(n);
      const stampG = (x, y, g) => {
        const i = idx.get(x), j = idx.get(y);
        if (i != null) A[i][i] += g; if (j != null) A[j][j] += g;
        if (i != null && j != null) { A[i][j] -= g; A[j][i] -= g; }
      };
      const stampJ = (x, y, g, v) => { stampG(x, y, g); const i = idx.get(x), j = idx.get(y); if (i != null) b[i] += g * v; if (j != null) b[j] -= g * v; };
      for (let i = 0; i < n; i++) A[i][i] += G_MIN;
      G.forEach(([x, y, g]) => { if (x !== y) stampG(x, y, g); });
      J.forEach(([x, y, g, v]) => { if (x !== y) stampJ(x, y, g, v); });
      this.dio.forEach((d, k) => { if (d.a === d.c) return; if (on[k]) stampJ(d.a, d.c, 1 / d.rs, d.v0); else stampG(d.a, d.c, G_OFF); });
      V = gauss(A, b);
      const vOf = x => x === ref || x == null ? 0 : V[idx.get(x)] || 0;
      let changed = false;
      this.dio.forEach((d, k) => {
        const vd = vOf(d.a) - vOf(d.c);
        if (!on[k] && vd > d.v0 + 1e-4) { on[k] = true; changed = true; }
        else if (on[k] && (vd - d.v0) / d.rs < -1e-7) { on[k] = false; changed = true; }
      });
      if (!changed) break;
    }
    const vOf = x => x === ref || x == null ? 0 : V[idx.get(x)] || 0;
    this.v = new Map(); idx.forEach((i, x) => this.v.set(x, V[i])); if (ref) this.v.set(ref, 0);
    this.led = new Map(); this.ledV = new Map();
    this.dio.forEach((d, k) => { const vd = vOf(d.a) - vOf(d.c); this.ledV.set(d.key, vd); this.led.set(d.key, on[k] ? Math.max(0, (vd - d.v0) / d.rs) : 0); });
    this.pinI = new Map();
    J.forEach(([x, y, g, v, s]) => { if (s && s.pin != null) this.pinI.set(s.pin, Math.abs(g * (vOf(x) - vOf(y) - v))); });
    /* a battery or rail wired straight across itself */
    this.short = this.src.some(s => Math.abs((vOf(s.p) - vOf(s.n)) - s.v()) > 0.5 * s.v() && s.v() > 1);
  }

  volts(r) { return this.ok && this.v.has(r) ? this.v.get(r) : null; }
  current(key) { return this.ok ? this.led.get(key) || 0 : null; }
  vd(key) { return this.ok ? this.ledV.get(key) || 0 : 0; }
}

/* Gaussian elimination with partial pivoting; returns x for A x = b */
function gauss(A, b) {
  const n = b.length;
  for (let c = 0; c < n; c++) {
    let p = c, m = Math.abs(A[c][c]);
    for (let r = c + 1; r < n; r++) { const x = Math.abs(A[r][c]); if (x > m) { m = x; p = r; } }
    if (m < 1e-18) continue;
    if (p !== c) { const t = A[p]; A[p] = A[c]; A[c] = t; const tb = b[p]; b[p] = b[c]; b[c] = tb; }
    const row = A[c], piv = row[c];
    for (let r = c + 1; r < n; r++) {
      const f = A[r][c] / piv; if (!f) continue;
      const rr = A[r];
      for (let k = c; k < n; k++) rr[k] -= f * row[k];
      b[r] -= f * b[c];
    }
  }
  const x = new Float64Array(n);
  for (let r = n - 1; r >= 0; r--) {
    let s = b[r]; const row = A[r];
    for (let k = r + 1; k < n; k++) s -= row[k] * x[k];
    x[r] = Math.abs(row[r]) < 1e-18 ? 0 : s / row[r];
  }
  return x;
}
