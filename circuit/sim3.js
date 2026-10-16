/* Circuit Lab - behaviour for the round 2 parts: chips, drivers and multi-digit displays. */
const F = 16e6, US = F / 1e6;
const clamp = (x, a, b) => Math.max(a, Math.min(b, x));
const SEGN = ["A", "B", "C", "D", "E", "F", "G", "DP"];

/* NEC infrared frame: 9 ms burst, 4.5 ms space, 32 bits, stop bit. The receiver output idles HIGH. */
function necFrame(addr, cmd) {
  const out = [[9000, 0], [4500, 1]];
  const bits = [];
  const push = b => { for (let i = 0; i < 8; i++) bits.push((b >> i) & 1); };
  push(addr); push((~addr) & 255); push(cmd); push((~cmd) & 255);
  bits.forEach(b => { out.push([560, 0]); out.push([b ? 1690 : 560, 1]); });
  out.push([560, 0]); out.push([0, 1]);
  return out;
}

export function setupExtra3(sim, D, H) {
  const part = D.part, el = D.el, S = part.sim || (part.sim = {}), id = part.id;
  const R = H.R, ok = H.ok;
  const lvl = r => { const x = sim.level(r); return x && x.v > sim.logic / 2 ? 1 : 0; };

  switch (part.type) {
    /* ---------------- 74HC595 ---------------- */
    case "sr595": {
      let sr = 0, latch = 0;
      const qr = []; for (let i = 0; i < 8; i++) qr.push(R("Q" + i));
      const oeOff = () => { const x = sim.level(R("OE")); return !!(x && x.v > sim.logic / 2); };
      qr.forEach((r, i) => sim.addOutput(r, () => (ok() && !oeOff()) ? (((latch >> i) & 1) ? sim.supply(part) : 0) : null));
      sim.addOutput(R("Q7S"), () => ok() ? (((sr >> 7) & 1) ? sim.supply(part) : 0) : null);
      sim.watchNet(R("SHCP"), lv => {
        if (!lv || !ok()) return;
        const mr = sim.level(R("MR"));
        if (mr && mr.v < sim.logic / 2) { sr = 0; return; }
        sr = ((sr << 1) | lvl(R("DS"))) & 0xff;
      });
      sim.watchNet(R("STCP"), lv => { if (!lv || !ok()) return; if (latch === sr) return; latch = sr; qr.forEach(r => sim.netChanged(r)); });
      sim.watchNet(R("MR"), lv => { if (!lv) { sr = 0; } });
      return true;
    }

    /* ---------------- multiplexed 4-digit 7-segment ---------------- */
    case "seg4": {
      const nd = +(part.attrs || {}).digits || 4;
      const segR = SEGN.map(n => R(n)), digR = []; for (let i = 1; i <= nd; i++) digR.push(R("D" + i));
      const acc = []; for (let d = 0; d < nd; d++) acc.push(new Array(8).fill(0));
      let lastC = 0, winStart = 0;
      const anode = () => (S.common || "cathode") === "anode";
      /* the state during the slice that just ended, so time is credited to the right digit */
      let prevSeg = new Array(8).fill(0), prevDig = new Array(nd).fill(0);
      const sample = () => {
        const seg = segR.map(r => { const x = sim.level(r); if (!x) return 0; return anode() ? (x.v < sim.logic / 2 ? 1 : 0) : (x.v > sim.logic / 2 ? 1 : 0); });
        const dig = digR.map(r => { const x = sim.level(r); if (!x) return 0; return anode() ? (x.v > sim.logic / 2 ? 1 : 0) : (x.v < sim.logic / 2 ? 1 : 0); });
        return [seg, dig];
      };
      const flush = c => {
        const dt = c - lastC; lastC = c;
        if (dt > 0) for (let d = 0; d < nd; d++) if (prevDig[d]) for (let s = 0; s < 8; s++) if (prevSeg[s]) acc[d][s] += dt;
        [prevSeg, prevDig] = sample();
      };
      const upd = (lv, c) => flush(c);
      segR.concat(digR).forEach(r => sim.watchAny(r, upd));
      D.frame = () => {
        const c = sim.cpu.cycles; flush(c);
        const span = c - winStart; winStart = c; lastC = c;
        if (span <= 0) return;
        el.setFrame(acc.map(a => a.map(x => clamp(x / span * nd, 0, 1))));
        acc.forEach(a => a.fill(0));
      };
      return true;
    }

    /* ---------------- TM1637 (the real two-wire protocol) ---------------- */
    case "tm1637": {
      const clkR = R("CLK"), dioR = R("DIO");
      let pc = 1, pd = 1, bits = 0, nb = 0, inFrame = false, nbyte = 0, cmd = 0, addr = 0, bright = 1, on = true;
      const digits = [0, 0, 0, 0];
      const paint = () => el.setDigits(on && ok() ? digits : [0, 0, 0, 0], bright);
      const byteIn = b => {
        if (nbyte === 0) {                                   // first byte of a frame is the command
          cmd = b;
          if ((b & 0xc0) === 0xc0) addr = b & 7;
          else if ((b & 0xe0) === 0x80) { on = !!(b & 8); bright = ((b & 7) + 1) / 8; paint(); }
        } else if ((cmd & 0xc0) === 0xc0) {                  // data follows an address command
          if (addr < 4) digits[addr] = b;
          addr++; paint();
        }
        nbyte++;
      };
      const edge = () => {
        const c = lvl(clkR), d = lvl(dioR);
        if (c && pc && d !== pd) {                            // start (DIO falls) / stop (DIO rises) while CLK is high
          if (!d) { inFrame = true; bits = 0; nb = 0; nbyte = 0; } else { inFrame = false; nb = 0; }
        } else if (c && !pc && inFrame) {                     // clock rising: 8 data bits then one ACK clock
          if (nb < 8) bits |= d << nb;
          nb++;
          if (nb === 9) { byteIn(bits); bits = 0; nb = 0; }
        }
        pc = c; pd = d;
      };
      sim.watchAny(clkR, edge); sim.watchAny(dioR, edge);
      D.frame = () => { if (!ok()) el.setDigits([0, 0, 0, 0]); };
      return true;
    }

    /* ---------------- MAX7219 chain ---------------- */
    case "max7219x4": {
      const n = +(part.attrs || {}).blocks || 4;
      D.cols = new Array(n * 8).fill(0);
      D.chain = n;
      D.frame = () => { if (!D.dirty) return; D.dirty = false; el.setCols(D.cols); };
      return true;
    }

    /* ---------------- rotary encoder ---------------- */
    case "encoder": {
      /* quadrature: cw goes 11 -> 01 -> 00 -> 10 -> 11 */
      let a = 1, b = 1, queue = [], busy = false;
      const ar = R("CLK"), br = R("DT");
      sim.addOutput(ar, () => ok() ? (a ? sim.supply(part) : 0) : null);
      sim.addOutput(br, () => ok() ? (b ? sim.supply(part) : 0) : null);
      sim.addOutput(R("SW"), () => (sim.rt[id].state.pressed ? 0 : null));
      const step = () => {
        busy = false;
        const dir = queue.shift(); if (dir === undefined) return;
        const seq = dir > 0 ? [[0, 1], [0, 0], [1, 0], [1, 1]] : [[1, 0], [0, 0], [0, 1], [1, 1]];
        let i = 0; busy = true;
        const next = () => {
          if (i >= seq.length) { step(); return; }
          [a, b] = seq[i++]; sim.netChanged(ar); sim.netChanged(br);
          sim.cpu.addClockEvent(next, Math.round(F * 0.004));
        };
        next();
      };
      D.turn = dir => { queue.push(dir); if (!busy) step(); };
      D.press = () => sim.netChanged(R("SW"));
      return true;
    }

    /* ---------------- IR receiver ---------------- */
    case "irrecv": {
      let out = 1, dead = false;
      sim.addOutput(R("DAT"), () => ok() ? (out ? sim.supply(part) : 0) : null);
      D.ir = (addr, cmd) => {
        if (dead || !ok()) return;
        const seq = necFrame(addr, cmd); let i = 0;
        const next = () => {
          if (dead || i >= seq.length) { out = 1; sim.netChanged(R("DAT")); return; }
          const [us, v] = seq[i++]; out = v; sim.netChanged(R("DAT"));
          if (us) sim.cpu.addClockEvent(next, Math.round(us * US)); else next();
        };
        next();
      };
      D.frame = () => { el.led && el.led("pwr", ok()); };
      const old = D.stop; D.stop = () => { dead = true; if (old) old(); };
      return true;
    }
    case "irremote": return true;

    /* ---------------- A4988 ---------------- */
    case "a4988": {
      let s = 0, dead = false;
      const outs = ["1A", "1B", "2A", "2B"].map(R);
      const PAT = [[1, 0, 1, 0], [0, 1, 1, 0], [0, 1, 0, 1], [1, 0, 0, 1]];
      const vmot = () => { const x = sim.level(R("VMOT")); return x ? x.v : 0; };
      const enabled = () => { const e = sim.level(R("EN")); const r = sim.level(R("RST")); return (!e || e.v < sim.logic / 2) && (!r || r.v > sim.logic / 2); };
      outs.forEach((r, i) => sim.addOutput(r, () => (enabled() && vmot() > 2) ? (PAT[((s % 4) + 4) % 4][i] ? vmot() : 0) : null));
      sim.watchNet(R("STEP"), lv => {
        if (!lv || dead || !enabled()) return;
        s += lvl(R("DIR")) ? 1 : -1;
        outs.forEach(r => sim.netChanged(r));
      });
      const old = D.stop; D.stop = () => { dead = true; if (old) old(); };
      return true;
    }

    /* ---------------- discrete parts ---------------- */
    case "npn": case "mosfet": {
      const st = sim.rt[id].state, g = part.type === "npn" ? "B" : "G", e = part.type === "npn" ? "E" : "S";
      const thr = part.type === "npn" ? 0.65 : 2.0;
      const upd = () => {
        const bv = sim.level(R(g)), ev = sim.level(R(e));
        const on = !!(bv && ev && bv.v - ev.v > thr);
        if (part.type === "npn" && bv && bv.src === "pin" && !bv.weak) sim.warnings.add("A transistor base needs a resistor in series (about 1 kΩ), or the pin pushes too much current into it.");
        if (on !== !!st.on) { st.on = on; sim.switchChanged(id); }
      };
      sim.watchNet(R(g), upd); D.frame = upd;
      return true;
    }
    case "diode": {
      sim.addOutput(R("K"), () => { const a = sim.level(R("A")); return a && a.v > 0.7 ? a.v - 0.7 : null; });
      D.frame = () => sim.netChanged(R("K"));
      return true;
    }

    /* ---------------- 555 timer ---------------- */
    case "ne555": {
      let out = 0, dead = false;
      const or = R("OUT");
      sim.addOutput(or, () => { const v = sim.level(R("VCC")); return (v && v.v > 2.5) ? (out ? v.v - 0.5 : 0) : null; });
      sim.addOutput(R("DIS"), () => out ? null : 0);
      /* find the timing parts the student actually wired */
      const ohms = p => +((p.attrs || {}).value || 1000);
      const farads = p => { const t = (p.attrs || {}).value || "100uF"; const n = parseFloat(t); return /nF/i.test(t) ? n * 1e-9 : /uF|µF/i.test(t) ? n * 1e-6 : n * 1e-6; };
      const timing = () => {
        const N = sim.net, vccR = R("VCC"), disR = R("DIS"), thrR = R("THR"), gndR = R("GND");
        let r1 = null, r2 = null, c = null;
        sim.project.parts.filter(p => p.type === "resistor").forEach(p => {
          const x = N.find(p.id + ":1"), y = N.find(p.id + ":2");
          const has = (ra, rb) => (x === ra && y === rb) || (x === rb && y === ra);
          if (has(vccR, disR)) r1 = ohms(p);
          if (has(disR, thrR)) r2 = ohms(p);
        });
        sim.project.parts.filter(p => p.type === "capacitor").forEach(p => {
          const x = N.find(p.id + ":+"), y = N.find(p.id + ":-");
          if ((x === thrR && y === gndR) || (y === thrR && x === gndR)) c = farads(p);
        });
        const wired = r1 != null && r2 != null && c != null;
        return { r1: r1 ?? (+S.r1 || 10000), r2: r2 ?? (+S.r2 || 47000), c: c ?? ((+S.cap || 10) * 1e-6), wired };
      };
      const astable = () => (S.mode || "astable") === "astable" || sim.net.find(R("TRIG")) === sim.net.find(R("THR"));
      const tick = () => {
        if (dead) return;
        const v = sim.level(R("VCC")), rst = sim.level(R("RESET"));
        if (!v || v.v < 2.5 || (rst && rst.v < 1)) { if (out) { out = 0; sim.netChanged(or); } sim.cpu.addClockEvent(tick, Math.round(F * 0.05)); return; }
        const t = timing();
        if (astable()) {
          const hi = 0.693 * (t.r1 + t.r2) * t.c, lo = 0.693 * t.r2 * t.c;
          out ^= 1; sim.netChanged(or);
          D.text = (1.44 / ((t.r1 + 2 * t.r2) * t.c)).toFixed(2) + " Hz" + (t.wired ? "" : " (slider values)");
          sim.cpu.addClockEvent(tick, Math.max(200, Math.round(F * (out ? hi : lo))));
        } else {
          const trig = sim.level(R("TRIG"));
          if (!out && trig && trig.v < v.v / 3) { out = 1; sim.netChanged(or); sim.cpu.addClockEvent(tick, Math.max(200, Math.round(F * 1.1 * t.r1 * t.c))); return; }
          if (out) { out = 0; sim.netChanged(or); }
          sim.cpu.addClockEvent(tick, Math.round(F * 0.002));
        }
      };
      sim.cpu.addClockEvent(tick, Math.round(F * 0.02));
      const old = D.stop; D.stop = () => { dead = true; if (old) old(); };
      return true;
    }
    case "l293d": return true;    // handled by loadDrive
  }
  return false;
}
