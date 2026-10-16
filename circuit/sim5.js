/* Circuit Lab - behaviour for the round 3 parts: logic chips, counters and analogue chips.
   Logic outputs use watchAny so one chip can feed another: a NAND into a NOT really does invert. */
const clamp = (x, a, b) => Math.max(a, Math.min(b, x));

/* four two-input gates in the 7400 pin order; the last name in each row is the output */
const G4 = [["1A", "1B", "1Y"], ["2A", "2B", "2Y"], ["3A", "3B", "3Y"], ["4A", "4B", "4Y"]];
const G6 = [["1A", "1Y"], ["2A", "2Y"], ["3A", "3Y"], ["4A", "4Y"], ["5A", "5Y"], ["6A", "6Y"]];

const LOGIC = {
  hc08: { g: G4, op: a => a[0] && a[1] },
  hc32: { g: G4, op: a => a[0] || a[1] },
  hc00: { g: G4, op: a => !(a[0] && a[1]) },
  hc02: { g: G4, op: a => !(a[0] || a[1]) },
  hc86: { g: G4, op: a => a[0] !== a[1] },
  hc04: { g: G6, op: a => !a[0] },
};

/* CD4511: BCD in, seven segments out. Anything above 9 blanks the display, like the real chip. */
const SEG = [0x3F, 0x06, 0x5B, 0x4F, 0x66, 0x6D, 0x7D, 0x07, 0x7F, 0x6F, 0, 0, 0, 0, 0, 0];
const SEGPIN = ["SA", "SB", "SC", "SD", "SE", "SF", "SG"];

export function setupExtra5(sim, D, H) {
  const part = D.part, el = D.el, S = part.sim || (part.sim = {}), id = part.id;
  const R = H.R, ok = H.ok;
  const hi = r => { const x = sim.level(r); return !!(x && x.v > sim.logic / 2); };
  const volts = r => { const x = sim.level(r); return x ? x.v : 0; };

  /* ---------------- the six gate chips ---------------- */
  const L = LOGIC[part.type];
  if (L) {
    for (const row of L.g) {
      const ins = row.slice(0, -1).map(R), out = R(row[row.length - 1]);
      sim.addOutput(out, () => ok() ? (L.op(ins.map(hi)) ? sim.supply(part) : 0) : null);
      /* watchAny, not watchNet: an input fed by another chip must still retrigger this one */
      ins.forEach(ir => sim.watchAny(ir, () => sim.netChanged(out)));
    }
    D.frame = () => { };
    return true;
  }

  switch (part.type) {
    /* ---------------- 74HC74 dual D flip-flop ---------------- */
    case "hc74": {
      for (const n of ["1", "2"]) {
        const d = R(n + "D"), clk = R(n + "CLK"), clr = R(n + "CLR"), pre = R(n + "PRE");
        const q = R(n + "Q"), qn = R(n + "QN");
        const st = { v: 0 };
        sim.addOutput(q, () => ok() ? (st.v ? sim.supply(part) : 0) : null);
        sim.addOutput(qn, () => ok() ? (st.v ? 0 : sim.supply(part)) : null);
        const settle = () => { sim.netChanged(q); sim.netChanged(qn); };
        /* CLR and PRE are active low and beat the clock, exactly as the datasheet says */
        const async = () => {
          if (!hi(clr)) { if (st.v !== 0) { st.v = 0; settle(); } return true; }
          if (!hi(pre)) { if (st.v !== 1) { st.v = 1; settle(); } return true; }
          return false;
        };
        sim.watchAny(clk, lv => { if (!lv || !ok() || async()) return; const nv = hi(d) ? 1 : 0; if (nv !== st.v) { st.v = nv; settle(); } });
        sim.watchAny(clr, () => async());
        sim.watchAny(pre, () => async());
      }
      return true;
    }

    /* ---------------- 74HC165 parallel-in serial-out ---------------- */
    case "hc165": {
      const dr = []; for (let i = 0; i < 8; i++) dr.push(R("D" + i));
      const shld = R("SHLD"), clk = R("CLK"), q7 = R("Q7"), q7n = R("Q7N"), ce = R("CE"), ser = R("SER");
      let sr = 0;
      sim.addOutput(q7, () => ok() ? (((sr >> 7) & 1) ? sim.supply(part) : 0) : null);
      sim.addOutput(q7n, () => ok() ? (((sr >> 7) & 1) ? 0 : sim.supply(part)) : null);
      const settle = () => { sim.netChanged(q7); sim.netChanged(q7n); };
      const load = () => { let b = 0; for (let i = 0; i < 8; i++) if (hi(dr[i])) b |= (1 << i); sr = b; settle(); };
      sim.watchAny(shld, lv => { if (!ok()) return; if (!lv) load(); });        // low loads the inputs
      sim.watchAny(clk, lv => {
        if (!lv || !ok()) return;
        if (!hi(shld)) return;                                                  // held in load, no shifting
        if (hi(ce)) return;                                                     // clock inhibited
        sr = ((sr << 1) | (hi(ser) ? 1 : 0)) & 0xff; settle();   // SER fills the vacated bit
      });
      return true;
    }

    /* ---------------- CD4017 decade counter ---------------- */
    case "cd4017": {
      const qr = []; for (let i = 0; i < 10; i++) qr.push(R("Q" + i));
      const clk = R("CLK"), mr = R("MR"), ce = R("CE"), co = R("CO");
      let n = 0;
      qr.forEach((r, i) => sim.addOutput(r, () => ok() ? (n === i ? sim.supply(part) : 0) : null));
      sim.addOutput(co, () => ok() ? (n < 5 ? sim.supply(part) : 0) : null);
      const settle = () => { qr.forEach(r => sim.netChanged(r)); sim.netChanged(co); };
      sim.watchAny(clk, lv => { if (!lv || !ok() || hi(mr) || hi(ce)) return; n = (n + 1) % 10; settle(); });
      sim.watchAny(mr, lv => { if (lv && n !== 0) { n = 0; settle(); } });       // reset is active high here
      S.step = () => n;
      D.frame = () => { if (el && el.setAttribute) el.setAttribute("sub", "Q" + n); };
      return true;
    }

    /* ---------------- CD4511 BCD to seven segment ---------------- */
    case "cd4511": {
      const abcd = ["A", "B", "C", "D"].map(R);
      const le = R("LE"), bl = R("BL"), lt = R("LT");
      const sp = SEGPIN.map(R);
      let latched = 0;
      const value = () => { let v = 0; abcd.forEach((r, i) => { if (hi(r)) v |= (1 << i); }); return v; };
      const segs = () => {
        if (!hi(lt)) return 0x7F;                       // lamp test: everything on
        if (!hi(bl)) return 0;                          // blank
        return SEG[hi(le) ? latched : value()];
      };
      sp.forEach((r, i) => sim.addOutput(r, () => ok() ? (((segs() >> i) & 1) ? sim.supply(part) : 0) : null));
      const settle = () => sp.forEach(r => sim.netChanged(r));
      abcd.forEach(r => sim.watchAny(r, () => { if (!hi(le)) latched = value(); settle(); }));
      [le, bl, lt].forEach(r => sim.watchAny(r, settle));
      D.frame = () => { if (el && el.setAttribute) el.setAttribute("sub", hi(bl) ? String(value() < 10 ? value() : "-") : "off"); };
      return true;
    }

    /* ---------------- CD4051 eight-channel analogue switch ---------------- */
    case "cd4051": {
      const yr = []; for (let i = 0; i < 8; i++) yr.push(R("Y" + i));
      const sr = ["S0", "S1", "S2"].map(R), z = R("Z"), en = R("EN");
      const chan = () => (hi(sr[0]) ? 1 : 0) | (hi(sr[1]) ? 2 : 0) | (hi(sr[2]) ? 4 : 0);
      /* Z carries whatever is on the selected channel; EN high disconnects it */
      sim.addOutput(z, () => { if (!ok() || hi(en)) return null; const x = sim.level(yr[chan()]); return x ? x.v : null; });
      sr.forEach(r => sim.watchAny(r, () => sim.netChanged(z)));
      sim.watchAny(en, () => sim.netChanged(z));
      yr.forEach(r => sim.watchAny(r, () => sim.netChanged(z)));
      D.frame = () => { sim.netChanged(z); if (el && el.setAttribute) el.setAttribute("sub", "ch" + chan()); };
      return true;
    }

    /* ---------------- LM358 op-amp ---------------- */
    case "lm358": {
      const gain = () => clamp(+S.gain || 1, 1, 20);
      for (const n of ["1", "2"]) {
        const ip = R("IN" + n + "P"), out = R("OUT" + n);
        /* a follower copies IN+; with the gain slider it stands in for a two-resistor amplifier.
           It cannot swing past the supply, which is the lesson students need. */
        sim.addOutput(out, () => { if (!ok()) return null; const x = sim.level(ip); if (!x) return null; return clamp(x.v * gain(), 0, sim.supply(part)); });
        sim.watchAny(ip, () => sim.netChanged(out));
      }
      D.frame = () => { sim.netChanged(R("OUT1")); sim.netChanged(R("OUT2")); };
      D.simChanged = () => { sim.netChanged(R("OUT1")); sim.netChanged(R("OUT2")); };
      return true;
    }

    /* ---------------- LM393 comparator ---------------- */
    case "lm393": {
      const ref = () => (S.ref == null ? 2.5 : +S.ref);
      for (const n of ["1", "2"]) {
        const ip = R("IN" + n + "P"), inn = R("IN" + n + "N"), out = R("OUT" + n);
        /* open collector: it pulls low or lets go, so the circuit needs a pull-up resistor */
        sim.addOutput(out, () => {
          if (!ok()) return null;
          const p = sim.level(ip); if (!p) return null;
          const m = sim.level(inn), mv = m ? m.v : ref();
          return p.v < mv ? 0 : null;
        });
        sim.watchAny(ip, () => sim.netChanged(out));
        sim.watchAny(inn, () => sim.netChanged(out));
      }
      D.frame = () => { sim.netChanged(R("OUT1")); sim.netChanged(R("OUT2")); };
      D.simChanged = () => { sim.netChanged(R("OUT1")); sim.netChanged(R("OUT2")); };
      return true;
    }

    /* ---------------- PNP transistor ---------------- */
    case "pnp": {
      const st = sim.rt[id].state;
      const upd = () => {
        const bv = sim.level(R("B")), ev = sim.level(R("E"));
        /* a PNP conducts when the base sits about 0.65 V BELOW the emitter: low turns it on */
        const on = !!(bv && ev && ev.v - bv.v > 0.65);
        if (bv && bv.src === "pin" && !bv.weak) sim.warnings.add("A transistor base needs a resistor in series (about 1 kΩ), or the pin pushes too much current into it.");
        if (on !== !!st.on) { st.on = on; sim.switchChanged(id); }
      };
      sim.watchAny(R("B"), upd); D.frame = upd;
      return true;
    }

    /* ---------------- Zener diode ---------------- */
    case "zener": {
      const vz = () => clamp(S.vz == null ? 5.1 : +S.vz, 2.4, 12);
      /* in reverse breakdown the cathode sits one Zener voltage above the anode, and no higher */
      sim.addOutput(R("K"), () => { const a = sim.level(R("A")); if (!a) return null; return a.v + vz(); });
      D.frame = () => sim.netChanged(R("K"));
      D.simChanged = () => sim.netChanged(R("K"));
      return true;
    }

    /* ---------------- optocoupler ---------------- */
    case "opto": {
      const st = sim.rt[id].state;
      const upd = () => {
        const a = sim.level(R("A")), k = sim.level(R("K"));
        /* the internal LED lights when current runs A to K; then the transistor side closes */
        const lit = !!(a && a.v - (k ? k.v : 0) > 1.1);
        if (lit !== !!st.on) { st.on = lit; sim.switchChanged(id); }
        if (el && el.setAttribute) el.setAttribute("sub", lit ? "on" : "isolate");
      };
      sim.watchAny(R("A"), upd); sim.watchAny(R("K"), upd); D.frame = upd;
      return true;
    }

    /* ---------------- 7805 linear regulator ---------------- */
    case "lm7805": {
      sim.addOutput(R("OUT"), () => {
        const i = sim.level(R("IN")); if (!i) return null;
        /* it needs roughly 2 V of headroom; below that the output just follows the input down */
        if (i.v >= 7) return 5;
        return Math.max(0, i.v - 2);
      });
      D.frame = () => sim.netChanged(R("OUT"));
      return true;
    }

    /* ---------------- bridge rectifier ---------------- */
    case "bridge": {
      const vac = () => clamp(+S.vac || 0, 0, 24);
      /* whichever way the AC legs sit, + comes out positive: two diode drops below the peak */
      sim.addOutput(R("+"), () => Math.max(0, vac() - 1.4));
      sim.addOutput(R("-"), () => 0);
      D.frame = () => { sim.netChanged(R("+")); sim.netChanged(R("-")); };
      D.simChanged = () => { sim.netChanged(R("+")); sim.netChanged(R("-")); };
      return true;
    }

    /* ---------------- phototransistor ---------------- */
    case "phototrans": {
      const lit = () => clamp((+S.light || 0) / 100, 0, 1);
      /* collector to the rail, emitter through a resistor: the emitter rises with the light */
      sim.addOutput(R("E"), () => { const c = sim.level(R("C")); if (!c) return null; return c.v * lit(); });
      D.frame = () => sim.netChanged(R("E"));
      D.simChanged = () => sim.netChanged(R("E"));
      return true;
    }

    /* ---------------- limit switch (contacts live in the netlist) ---------------- */
    case "limitsw": {
      D.frame = () => { if (el && el.setAttribute) el.setAttribute("pressed", S.pressed ? "true" : "false"); };
      D.simChanged = () => { sim.switchChanged(id); if (el && el.setAttribute) el.setAttribute("pressed", S.pressed ? "true" : "false"); };
      return true;
    }

    /* ---------------- ULN2003 Darlington array ---------------- */
    case "uln2003": {
      for (let i = 1; i <= 7; i++) {
        const inp = R("IN" + i), out = R("OUT" + i);
        /* each channel sinks to ground when driven, and floats when not: the load hangs off the positive rail */
        sim.addOutput(out, () => (ok() && hi(inp)) ? 0 : null);
        sim.watchAny(inp, () => sim.netChanged(out));
      }
      D.frame = () => { };
      return true;
    }
  }
  return false;
}
