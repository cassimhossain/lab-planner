/* Circuit Lab - behaviour for the I2C modules that drive or read real nets:
   pin expanders, an ADC, a DAC and the 16-channel servo driver.
   These differ from the sensor table: the sketch writes to them and the wires move. */
const clamp = (x, a, b) => Math.max(a, Math.min(b, x));
const pins8 = n => { const o = []; for (let i = 0; i < n; i++) o.push("P" + i); return o; };
const PINS_23017 = (() => { const o = []; for (let i = 0; i < 8; i++) o.push("A" + i); for (let i = 0; i < 8; i++) o.push("B" + i); return o; })();
const PINS_9685 = (() => { const o = []; for (let i = 0; i < 16; i++) o.push("CH" + i); return o; })();

/* the state each module keeps lives on its device record, so the hypercall and the
   output functions are looking at the same thing */
const st = (sim, part) => { const D = sim.devOf(part.id); return D ? (D.io = D.io || {}) : null; };

export function setupExtra7(sim, D, H) {
  const part = D.part, el = D.el, R = H.R, ok = H.ok;
  const io = D.io = D.io || {};

  switch (part.type) {
    /* ---------------- PCF8574: eight quasi-bidirectional pins ---------------- */
    case "pcf8574": {
      io.out = 0xff;                       // the real chip wakes with every pin high
      pins8(8).forEach((nm, i) => {
        const r = R(nm);
        let busy = false;
        sim.addOutput(r, () => {
          if (!ok()) return null;
          if (!((io.out >> i) & 1)) return 0;                  // a written 0 pulls hard to ground
          /* a written 1 is only a weak pull-up, so a button to ground still wins.
             The guard stops this from asking about a net it is itself driving. */
          if (busy) return null;
          busy = true;
          try { const other = sim.level(r); return (other && other.v < sim.logic / 2) ? null : sim.supply(part); }
          finally { busy = false; }
        });
      });
      io.refresh = () => pins8(8).forEach(nm => sim.netChanged(R(nm)));
      io.read = () => { let b = 0; pins8(8).forEach((nm, i) => { const l = sim.level(R(nm)); if (!l || l.v > sim.logic / 2) b |= (1 << i); }); return b; };
      D.frame = () => { if (el && el.setAttribute) el.setAttribute("sub", "0x" + (io.out & 0xff).toString(16).padStart(2, "0")); };
      return true;
    }

    /* ---------------- MCP23017: sixteen push-pull pins ---------------- */
    case "mcp23017": {
      io.out = 0;
      PINS_23017.forEach((nm, i) => sim.addOutput(R(nm), () => ok() ? (((io.out >> i) & 1) ? sim.supply(part) : 0) : null));
      io.refresh = () => PINS_23017.forEach(nm => sim.netChanged(R(nm)));
      io.read = () => { let b = 0; PINS_23017.forEach((nm, i) => { const l = sim.level(R(nm)); if (l && l.v > sim.logic / 2) b |= (1 << i); }); return b; };
      D.frame = () => { if (el && el.setAttribute) el.setAttribute("sub", "0x" + (io.out & 0xffff).toString(16).padStart(4, "0")); };
      return true;
    }

    /* ---------------- ADS1115: four precise analogue inputs ---------------- */
    case "ads1115": {
      io.gain = 6.144;                     // the Adafruit library's default range
      io.readCh = ch => { const l = sim.level(R("A" + ch)); const v = l ? l.v : 0; return Math.round(clamp(v / io.gain, -1, 1) * 32767); };
      D.frame = () => { };
      return true;
    }

    /* ---------------- MCP4725: a real analogue output ---------------- */
    case "mcp4725": {
      io.val = 0;
      sim.addOutput(R("OUT"), () => ok() ? (io.val / 4095) * sim.supply(part) : null);
      io.refresh = () => sim.netChanged(R("OUT"));
      D.frame = () => { if (el && el.setAttribute) el.setAttribute("sub", ((io.val / 4095) * 5).toFixed(2) + " V"); };
      return true;
    }

    /* ---------------- PCA9685: sixteen PWM channels ---------------- */
    case "pca9685": {
      io.freq = 50; io.off = new Array(16).fill(0);
      PINS_9685.forEach((nm, i) => sim.addOutput(R(nm), () => ok() ? (io.off[i] / 4096) * sim.supply(part) : null));
      io.refresh = i => sim.netChanged(R(PINS_9685[i]));
      /* a servo on a channel is driven straight from the pulse width, because the
         board generates the waveform itself and nothing on the Arduino pins shows it */
      D.frame = () => {
        const us = i => (io.off[i] / 4096) * (1e6 / (io.freq || 50));
        for (let i = 0; i < 16; i++) {
          if (!io.off[i]) continue;
          /* out-of-range pulses are not ignored: a real servo just sits on its end stop */
          const w = us(i); if (w < 300 || w > 3200) continue;
          for (const s of sim.project.parts) {
            if (s.type !== "servo" && s.type !== "servo360") continue;
            if (!sim.net.connected(part.id + ":" + PINS_9685[i], s.id + ":PWM")) continue;
            const sd = sim.devOf(s.id); if (!sd || !sd.el) continue;
            sd.el.angle = clamp((w - 544) / (2400 - 544) * 180, 0, 180);
          }
        }
        if (el && el.setAttribute) el.setAttribute("sub", io.freq + " Hz");
      };
      return true;
    }

    /* ---------------- DFPlayer Mini ---------------- */
    case "dfplayer": {
      io.track = 0; io.vol = 20; io.playing = false;
      D.frame = () => {
        if (!el || !el.setAttribute) return;
        el.setAttribute("sub", !ok() ? "no power" : io.playing ? ("track " + io.track) : "idle");
      };
      return true;
    }
  }
  return false;
}

/* ---------- hypercall side: devices 23 to 28 ---------- */
const findI2c = (sim, type, addr) => sim.findPart(type, q =>
  (((q.attrs || {}).addr == null) || true) && sim.i2cWired(q) && sim.partPowered(q));

export function hcExtra7(sim, dev, op, ptr, len, a, b, d, dv) {
  const grab = (type, label) => {
    const p = findI2c(sim, type, a);
    if (!p && op === 1) sim.notes.add(`${label} not found: wire SDA and SCL to the board's I2C pins and give it power.`);
    return p;
  };
  switch (dev) {
    case 23: {   // PCF8574
      const p = grab("pcf8574", "PCF8574"); if (!p) return 0;
      const io = st(sim, p); if (!io) return 0;
      if (op === 1) return 1;
      if (op === 2) { io.out = b & 0xff; if (io.refresh) io.refresh(); return 1; }
      if (op === 3) return io.read ? io.read() : 0;
      return 0;
    }
    case 24: {   // MCP23017
      const p = grab("mcp23017", "MCP23017"); if (!p) return 0;
      const io = st(sim, p); if (!io) return 0;
      if (op === 1) return 1;
      if (op === 2) { io.out = b & 0xffff; if (io.refresh) io.refresh(); return 1; }
      if (op === 3) return io.read ? io.read() : 0;
      return 0;
    }
    case 25: {   // ADS1115
      const p = grab("ads1115", "ADS1115"); if (!p) return 0;
      const io = st(sim, p); if (!io) return 0;
      if (op === 1) return 1;
      if (op === 2) return io.readCh ? io.readCh(b & 3) : 0;
      if (op === 3) { io.gain = [6.144, 4.096, 2.048, 1.024, 0.512, 0.256][b] || 6.144; return 1; }
      return 0;
    }
    case 26: {   // MCP4725
      const p = grab("mcp4725", "MCP4725"); if (!p) return 0;
      const io = st(sim, p); if (!io) return 0;
      if (op === 1) return 1;
      if (op === 2) { io.val = clamp(b | 0, 0, 4095); if (io.refresh) io.refresh(); return 1; }
      return 0;
    }
    case 27: {   // PCA9685
      const p = grab("pca9685", "PCA9685"); if (!p) return 0;
      const io = st(sim, p); if (!io) return 0;
      if (op === 1) return 1;
      if (op === 2) { const ch = (b >> 16) & 0x1f, off = b & 0xffff; if (ch < 16) { io.off[ch] = clamp(off, 0, 4096); if (io.refresh) io.refresh(ch); } return 1; }
      if (op === 3) { io.freq = clamp(b | 0, 24, 1600); return 1; }
      if (op === 4) { const ch = (b >> 16) & 0x1f, us = b & 0xffff; if (ch < 16) { io.off[ch] = Math.round(us * 4096 / (1e6 / (io.freq || 50))); if (io.refresh) io.refresh(ch); } return 1; }
      return 0;
    }
    case 28: {   // DFPlayer Mini
      const p = sim.findPart("dfplayer", q => sim.partPowered(q));
      if (op === 1) { if (!p) sim.notes.add("No DFPlayer found: give the module 5 V and GND and wire its TX and RX."); return p ? 1 : 0; }
      if (!p) return 0;
      const io = st(sim, p); if (!io) return 0;
      const tracks = Math.max(1, +(p.sim || {}).tracks || 8);
      switch (op) {
        case 2: io.track = clamp(a | 0, 1, tracks); io.playing = true; return 1;        // play(n)
        case 3: io.track = (io.track % tracks) + 1; io.playing = true; return 1;        // next
        case 4: io.track = io.track <= 1 ? tracks : io.track - 1; io.playing = true; return 1;
        case 5: io.playing = false; return 1;                                            // pause
        case 6: io.playing = true; return 1;                                             // start
        case 7: io.playing = false; io.track = 0; return 1;                              // stop
        case 8: if (a) io.track = clamp(a | 0, 1, tracks); io.playing = true; io.loop = true; return 1;
        case 9: io.loop = false; return 1;
        case 10: io.vol = clamp(a | 0, 0, 30); return 1;
        case 11: io.vol = clamp(io.vol + 1, 0, 30); return 1;
        case 12: io.vol = clamp(io.vol - 1, 0, 30); return 1;
        case 13: return tracks;
        case 14: return io.track;
        case 15: return io.vol;
      }
      return 0;
    }
  }
  return 0;
}
