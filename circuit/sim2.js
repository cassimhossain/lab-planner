/* Circuit Lab - behaviour for the parts added in parts2.js.
   Called from sim.js: setupExtra(sim, D, H) for every part type sim.js does not handle itself,
   and hcExtra(...) for simulator-bridge device numbers 13 and up. */
const F = 16e6, US = F / 1e6;
const clamp = (x, a, b) => Math.max(a, Math.min(b, x));

/* a square wave on one net, driven by the real clock so interrupt counting works */
function pulseGen(sim, D, root, freq, ok) {
  let hi = 0, dead = false;
  sim.addOutput(root, () => (ok() ? (hi ? sim.supply(D.part) : 0) : null));
  const tick = () => {
    if (dead) return;
    const f = freq();
    if (!(f > 0.05) || !ok()) { hi = 0; sim.netChanged(root); sim.cpu.addClockEvent(tick, Math.round(F * 0.05)); return; }
    hi ^= 1; sim.netChanged(root);
    sim.cpu.addClockEvent(tick, Math.max(200, Math.round(F / (2 * f))));
  };
  sim.cpu.addClockEvent(tick, Math.round(F * 0.01));
  const old = D.stop; D.stop = () => { dead = true; if (old) old(); };
}

/* ---------- temperature maths ---------- */
const ntcVolts = t => { const r = 10000 * Math.exp(3950 * (1 / (t + 273.15) - 1 / 298.15)); return 5 * r / (r + 10000); };

export function setupExtra(sim, D, H) {
  const part = D.part, el = D.el, sim_ = part.sim || (part.sim = {}), id = part.id;
  const R = H.R, ok = H.ok, dig = H.dig, ana = H.ana, leds = H.leds;
  const S = sim_;
  const live = (pin, fn) => { sim.liveAnalog(R(pin), fn); sim.addOutput(R(pin), () => ok() ? clamp(fn(), 0, 5) : null); };
  const touch = pin => { D.simChanged = () => sim.netChanged(R(pin)); };

  switch (part.type) {
    /* ---------- boards ---------- */
    case "nano": case "mega":
      D.frame = () => { el.led13 = sim.pin[13].duty > 0.3; el.ledPower = true; el.ledTX = sim.txAt && performance.now() - sim.txAt < 60; };
      return true;

    /* ---------- basics ---------- */
    case "dipswitch": return true;      // pure switch: handled by the netlist
    case "slidepot": {
      sim.addOutput(R("SIG"), () => {
        const hi = sim.level(R("VCC")), lo = sim.level(R("GND")); if (!hi || !lo) return null;
        const mn = el.min ?? 0, mx = el.max ?? 100, f = clamp(((el.value ?? mn) - mn) / ((mx - mn) || 1), 0, 1);
        return lo.v + (hi.v - lo.v) * f;
      });
      el.addEventListener("input", () => sim.netChanged(R("SIG")));
      return true;
    }
    case "ledbar": {
      D.frame = () => {
        const vals = [];
        for (let i = 1; i <= 10; i++) vals.push(sim.ledLevel(R("A" + i), R("C" + i), true) > 0.25 ? 1 : 0);
        el.values = vals;
      };
      return true;
    }

    /* ---------- analog temperature ---------- */
    case "lm35": live("OUT", () => (+S.temp || 0) * 0.01); touch("OUT"); return true;
    case "tmp36": live("OUT", () => 0.5 + (+S.temp || 0) * 0.01); touch("OUT"); return true;
    case "thermistor": live("OUT", () => ntcVolts(+S.temp == null ? 25 : +S.temp)); D.frame2 = () => { if ("temperature" in el) el.temperature = +S.temp || 0; }; touch("OUT"); return true;

    /* ---------- analog sensors ---------- */
    case "waterlevel":
      live("AO", () => 5 * clamp((+S.level || 0) * 7, 0, 1023) / 1023);
      D.frame2 = () => { el.level = +S.level || 0; }; touch("AO"); return true;
    case "tds":
      live("AO", () => 5 * clamp((+S.ppm || 0) / 1.2, 0, 1023) / 1023); touch("AO"); return true;
    case "uv":
      live("AO", () => clamp((+S.uv || 0) * 0.1, 0, 5));
      D.frame2 = () => { el.uv = clamp((+S.uv || 0) / 8, 0, 1); }; touch("AO"); return true;
    case "fsr":
      live("AO", () => 5 * clamp((+S.force || 0) / 100, 0, 1) ** 0.7);
      D.frame2 = () => { el.force = clamp((+S.force || 0) / 100, 0, 1); }; touch("AO"); return true;
    case "flex":
      live("AO", () => 5 * clamp(0.2 + (+S.bend || 0) * 0.006, 0, 1));
      D.frame2 = () => { el.bend = +S.bend || 0; }; touch("AO"); return true;
    case "sharpir":
      live("AO", () => clamp(27.86 / clamp(+S.dist || 40, 6, 150) + 0.42, 0, 3.2));
      D.frame2 = () => { el.dist = +S.dist || 40; }; touch("AO"); return true;
    case "acs712":
      live("OUT", () => clamp(2.5 + (+S.amps || 0) * 0.066, 0, 5));
      D.frame = () => { el.led("pwr", ok()); el.reading = (+S.amps || 0).toFixed(2) + " A"; }; touch("OUT"); return true;
    case "mic": {
      let ph = 0;
      live("AO", () => { ph += 0.9; return clamp(2.5 + Math.sin(ph) * (+S.loud || 0) / 1023 * 2.5, 0, 5); });
      D.frame2 = () => { el.loud = clamp((+S.loud || 0) / 600, 0, 1); sim.netChanged(R("AO")); }; touch("AO"); return true;
    }
    case "flow":
      pulseGen(sim, D, R("SIG"), () => (+S.lpm || 0) * 7.5, ok);
      D.frame = dt => { el.spin = (+S.lpm || 0) * dt * 160; }; return true;

    /* ---------- digital contact sensors ---------- */
    case "hall":
      dig("DO", () => !S.magnet); ana("AO", () => (S.magnet ? 0.2 : 0.8));
      leds(() => !!S.magnet); D.frame2 = () => { el.magnet = S.magnet ? 1 : 0; };
      D.simChanged = () => { sim.netChanged(R("DO")); sim.netChanged(R("AO")); }; return true;
    case "touch":
      dig("SIG", () => !!S.touched); D.frame2 = () => { el.touched = S.touched ? 1 : 0; el.led("sig", !!S.touched); el.led("pwr", ok()); };
      D.simChanged = () => sim.netChanged(R("SIG")); return true;
    case "reed":
      dig("DO", () => !S.magnet); leds(() => !!S.magnet); D.frame2 = () => { el.magnet = S.magnet ? 1 : 0; };
      D.simChanged = () => sim.netChanged(R("DO")); return true;
    case "vibsw":
      dig("DO", () => !S.shake); leds(() => !!S.shake); D.frame2 = () => { el.shake = S.shake ? 1 : 0; };
      D.simChanged = () => sim.netChanged(R("DO")); return true;
    case "knock": {
      dig("DO", () => !(S._until > performance.now()));
      D.frame = () => { const on = S._until > performance.now(); if (on !== D._on) { D._on = on; sim.netChanged(R("DO")); } el.knock = on ? 1 : 0; el.led("pwr", ok()); el.led("sig", on); };
      D.simChanged = () => { S._until = performance.now() + 120; sim.netChanged(R("DO")); };
      return true;
    }

    /* ---------- displays ---------- */
    case "lcd2004": { sim.setupLCD(D, R, 20, 4); return true; }
    case "npmatrix": {
      const rows = +(part.attrs || {}).rows || 8, cols = +(part.attrs || {}).cols || 8;
      sim.setupNeoPixel(D, R("DIN"), rows * cols, (i, c) => el.setPixel(Math.floor(i / cols), i % cols, c));
      return true;
    }

    /* ---------- light, sound, motion ---------- */
    case "laser": D.frame = () => { const l = sim.level(R("S")); el.on = ok() && !!(l && l.v > sim.logic / 2); }; return true;
    case "speaker": sim.setupBuzzer(D, R("1"), R("2")); return true;
    case "solenoid": D.frame = () => { el.on = Math.abs(sim.loadDrive(part, "+", "-", false)) > 0.3; }; return true;
    case "servo360": {
      let rise = 0, speed = 0, ang = 0;
      sim.watchNet(R("PWM"), (lv, c) => {
        if (lv) { rise = c; return; }
        if (!rise) return;
        const w = (c - rise) / US;
        if (w > 400 && w < 2700 && sim.powered(id, "V+", "GND")) speed = clamp((w - 1500) / 500, -1, 1);
      });
      D.frame = dt => { if (Math.abs(speed) > 0.04) { ang = (ang + speed * dt * 320 + 360) % 360; el.angle = ang; } };
      return true;
    }

    /* ---------- power ---------- */
    case "buck": {
      const vout = () => clamp(+S.vout == null ? 5 : +S.vout, 0, 12);
      sim.addOutput(R("OUT+"), () => { const a = sim.level(R("IN+")), b = sim.level(R("IN-")); if (!a || !b) return null; const vin = a.v - b.v; return vin < 1 ? 0 : Math.min(vout(), vin - 0.5); });
      sim.addOutput(R("OUT-"), () => { const b = sim.level(R("IN-")); return b ? b.v : null; });
      D.frame = () => { const a = sim.level(R("IN+")), b = sim.level(R("IN-")); const vin = a && b ? a.v - b.v : 0; el.reading = vin < 1 ? "no input" : Math.min(vout(), vin - 0.5).toFixed(1) + " V"; };
      D.simChanged = () => sim.netChanged(R("OUT+"));
      return true;
    }
    case "psu": {
      sim.addOutput(R("+5V"), () => 5); sim.addOutput(R("+3V3"), () => 3.3); sim.addOutput(R("GND"), () => 0);
      D.frame = () => el.led("pwr", true);
      return true;
    }
  }

  /* gas sensors added in parts2 all behave like the MQ-2 */
  if (/^mq\d$/.test(part.type)) {
    ana("AO", () => (80 + (+S.ppm || 0) * 0.82 + (Math.random() - .5) * 6) / 1023);
    dig("DO", () => (+S.ppm || 0) < 400);
    leds(() => (+S.ppm || 0) >= 400);
    D.frame2 = () => { el.level = +S.ppm || 0; };
    D.simChanged = () => { sim.netChanged(R("AO")); sim.netChanged(R("DO")); };
    return true;
  }
  return false;
}

export function hcExtra(sim, dev, op, ptr, len, a, b, d, dv) {
  switch (dev) {
    case 13: {   // infrared receiver
      const p = sim.findPart("irrecv", q => sim.pinWired(q, "DAT", a) && sim.partPowered(q));
      if (op === 1) { if (!p) sim.notes.add(`No IR receiver on pin ${a}: wire its DAT pin there, plus VCC and GND.`); sim.irQueue = []; return p ? 1 : 0; }
      if (!p) return -1;
      if (op === 2) { const q = sim.irQueue || []; return q.length ? q.shift() : -1; }
      if (op === 3) { sim.irQueue = []; return 1; }
      return 0;
    }
  }
  return 0;
}
