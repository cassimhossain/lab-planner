/* Circuit Lab - behaviour for the round 3 modules: I2C sensors, one-wire, SD card, GPS, GSM, radio and the TFT. */
const F = 16e6;
const clamp = (x, a, b) => Math.max(a, Math.min(b, x));
const bcd = n => ((Math.floor(n / 10) % 10) << 4) | (n % 10);

/* ---- NMEA sentences, with the checksum a real GPS would send ---- */
function nmea(body) { let c = 0; for (const ch of body) c ^= ch.charCodeAt(0); return "$" + body + "*" + c.toString(16).toUpperCase().padStart(2, "0") + "\r\n"; }
function nmeaFix(S, date) {
  const lat = +S.lat || 0, lon = +S.lon || 0, sats = Math.round(+S.sats || 0), kmh = +S.speed || 0;
  const dm = (v, deg) => { const a = Math.abs(v), d = Math.floor(a), m = (a - d) * 60; return String(d).padStart(deg, "0") + m.toFixed(4).padStart(7, "0"); };
  const hhmmss = String(date.getUTCHours()).padStart(2, "0") + String(date.getUTCMinutes()).padStart(2, "0") + String(date.getUTCSeconds()).padStart(2, "0") + ".00";
  const ddmmyy = String(date.getUTCDate()).padStart(2, "0") + String(date.getUTCMonth() + 1).padStart(2, "0") + String(date.getUTCFullYear() % 100).padStart(2, "0");
  const ns = lat >= 0 ? "N" : "S", ew = lon >= 0 ? "E" : "W", valid = sats >= 4;
  return nmea(`GPRMC,${hhmmss},${valid ? "A" : "V"},${dm(lat, 2)},${ns},${dm(lon, 3)},${ew},${(kmh / 1.852).toFixed(2)},0.00,${ddmmyy},,,${valid ? "A" : "N"}`)
    + nmea(`GPGGA,${hhmmss},${dm(lat, 2)},${ns},${dm(lon, 3)},${ew},${valid ? 1 : 0},${String(sats).padStart(2, "0")},0.9,540.0,M,46.9,M,,`)
    + nmea(`GPGSV,1,1,${String(sats).padStart(2, "0")},01,40,083,42,02,22,228,39,03,68,320,45,04,12,090,30`);
}

export function setupExtra4(sim, D, H) {
  const part = D.part, el = D.el, S = part.sim || (part.sim = {}), id = part.id;
  const R = H.R, ok = H.ok;

  switch (part.type) {
    /* ---------------- DS3231 / DS1307 real-time clock (a real I2C device) ---------------- */
    case "rtc": {
      let ptr = 0, first = false, written = {};
      const now = () => {
        if ((S.source || "").startsWith("fixed")) { const d = new Date(2026, 0, 1, 9, 0, 0); d.setSeconds(d.getSeconds() + Math.floor(sim.cpu.cycles / F)); return d; }
        return new Date(Date.now() + (+S.offset || 0) * 1000);
      };
      const regs = () => {
        const d = now(), r = new Uint8Array(64);
        r[0] = bcd(d.getSeconds()); r[1] = bcd(d.getMinutes()); r[2] = bcd(d.getHours());
        r[3] = d.getDay() + 1; r[4] = bcd(d.getDate()); r[5] = bcd(d.getMonth() + 1); r[6] = bcd(d.getFullYear() % 100);
        r[0x0e] = 0x1c; r[0x0f] = 0x08;            // DS3231 control / status: oscillator running
        r[0x11] = 26; r[0x12] = 0x40;              // chip temperature 26.25 C
        Object.entries(written).forEach(([k, v]) => { if (+k > 6) r[+k] = v; });
        return r;
      };
      let snap = null;
      sim.i2c[0x68] = {
        ok: () => sim.i2cWired(part) && ok(),
        start: w => { first = w; if (!w) snap = regs(); },
        write: v => { if (first) { ptr = v & 63; first = false; } else { written[ptr] = v; ptr = (ptr + 1) & 63; } },
        read: () => { if (!snap) snap = regs(); const v = snap[ptr]; ptr = (ptr + 1) & 63; return v; },
      };
      D.frame = () => el.led && el.led("pwr", ok());
      return true;
    }

    /* ---------------- DS18B20 one-wire probe ---------------- */
    case "ds18b20":
      D.frame = () => { el.reading = ok() ? (+S.temp || 0).toFixed(1) + " C" : ""; };
      return true;

    /* ---------------- SD card ---------------- */
    case "sdcard":
      D.files = D.files || {};
      return true;

    /* ---------------- GPS: real NMEA down the serial wire ---------------- */
    case "gps": {
      let next = 0;
      D.frame = () => {
        el.led && el.led("fix", ok() && (+S.sats || 0) >= 4 && (performance.now() % 2000) < 1400);
        if (!ok()) return;
        const c = sim.cpu.cycles;
        if (c < next) return;
        next = c + F;                     // one fix a second, like the real module
        const h = (sim.ser || []).find(x => x.part === part);
        if (h) for (const ch of nmeaFix(S, new Date())) h.rx.push(ch.charCodeAt(0));
      };
      return true;
    }

    /* ---------------- GSM module ---------------- */
    case "sim800l":
      D.frame = () => el.led && el.led("net", ok() && (performance.now() % 3000) < 200);
      return true;

    /* ---------------- nRF24 radio ---------------- */
    case "nrf24":
      D.frame = () => { el.active = !!(D.txAt && performance.now() - D.txAt < 400); };
      return true;

    /* ---------------- TFT colour screen ---------------- */
    case "tft": {
      D.ctx = null; D.rot = 0;
      D.getCtx = () => {
        if (D.ctx) return D.ctx;
        const cv = el.canvas; if (!cv) return null;
        D.cw = cv.width; D.ch = cv.height;
        D.ctx = cv.getContext("2d");
        D.ctx.fillStyle = "#000"; D.ctx.fillRect(0, 0, D.cw, D.ch);
        return D.ctx;
      };
      D.frame = () => { if (!ok() && D.ctx) { D.ctx.fillStyle = "#000"; D.ctx.fillRect(0, 0, D.cw, D.ch); D.ctx = null; } };
      return true;
    }
  }
  return false;
}

/* ---------- simulator bridge devices 14 and up ---------- */
const SENSOR = {
  1: { type: "bmp280", vals: S => [+S.temp || 0, (+S.hpa || 1013) * 100, 44330 * (1 - Math.pow((+S.hpa || 1013) / 1013.25, 0.1903))] },
  2: { type: "bme280", vals: S => [+S.temp || 0, (+S.hpa || 1013) * 100, +S.hum || 0] },
  3: { type: "bh1750", vals: S => [+S.lux || 0] },
  4: { type: "mlx90614", vals: S => [+S.ambient || 0, +S.object || 0] },
  5: { type: "vl53l0x", vals: S => [+S.mm || 0] },
  6: { type: "adxl345", vals: S => [+S.ax || 0, +S.ay || 0, S.az == null ? 9.8 : +S.az] },
  7: { type: "compass", vals: S => { const h = (+S.heading || 0) * Math.PI / 180; return [Math.cos(h) * 30, Math.sin(h) * 30, 40, +S.heading || 0]; } },
  8: { type: "sht31", vals: S => [+S.temp || 0, +S.hum || 0] },
  10: { type: "ds18b20", vals: S => [+S.temp || 0], pin: "DQ" },
};

export function hcExtra4(sim, dev, op, ptr, len, a, b, d, dv) {
  switch (dev) {
    case 14: {   // I2C and one-wire sensors
      const cfg = SENSOR[a]; if (!cfg) return 0;
      const p = cfg.pin
        ? sim.findPart(cfg.type, q => sim.net.mcuPinOf(q.id, cfg.pin) === b && sim.partPowered(q))
        : sim.findPart(cfg.type, q => sim.i2cWired(q) && sim.partPowered(q));
      if (op === 1) {
        if (!p) sim.notes.add(cfg.pin ? `No ${cfg.type.toUpperCase()} on pin ${b}: check the data wire, the 4.7 kΩ resistor and power.` : `${cfg.type.toUpperCase()} not found: wire SDA and SCL to the board's I2C pins and give it power.`);
        return p ? 1 : 0;
      }
      if (!p) return 0;
      if (op === 2) { const vals = cfg.vals(p.sim || {}); vals.forEach((x, i) => { if (i * 4 + 4 <= len) dv.setFloat32(ptr + i * 4, x + (Math.random() - .5) * 0.004 * (Math.abs(x) || 1), true); }); return vals.length; }
      if (op === 3) return 1;
      return 0;
    }
    case 15: {   // SD card
      const p = sim.findPart("sdcard", q => sim.net.mcuPinOf(q.id, "CS") === a && sim.partPowered(q));
      if (op === 1) { if (!p) sim.notes.add(`No SD card module with CS on pin ${a}: check CS, the SPI pins and power.`); return p ? 1 : 0; }
      if (!p) return 0;
      const D = sim.devOf(p.id); if (!D) return 0;
      D.files = D.files || {};
      const name = () => sim.str(a, 0);
      switch (op) {
        case 2: { const n = sim.str(ptr, len); return D.files[n] != null ? 1 : 0; }                     // exists
        case 3: { const n = sim.str(ptr, len); if (b === 1) D.files[n] = D.files[n] || ""; return D.files[n] != null ? 1 : 0; }  // open (b=1 write)
        case 4: { const s = sim.str(ptr, len); const n = D.openName; if (n == null) return 0; D.files[n] = (D.files[n] || "") + s; D.dirtyFs = true; return len; }  // write
        case 5: { D.openName = sim.str(ptr, len); return 1; }                                            // select the open file
        case 6: { const n = D.openName, f = D.files[n] || ""; const pos = b | 0; const bytes = []; for (let i = pos; i < f.length && bytes.length < len; i++) bytes.push(f.charCodeAt(i) & 255); return sim.put(ptr, len, bytes); }
        case 7: { const n = sim.str(ptr, len); return (D.files[n] || "").length; }                       // size
        case 8: { const n = sim.str(ptr, len); delete D.files[n]; D.dirtyFs = true; return 1; }          // remove
        case 9: { const names = Object.keys(D.files).join("\n"); return sim.put(ptr, len, Array.from(names).map(c => c.charCodeAt(0) & 255)); }
      }
      return 0;
    }
    case 16: {   // nRF24 radio: one board, so the Phone panel is the other end
      const p = sim.findPart("nrf24", q => sim.net.mcuPinOf(q.id, "CSN") === b && sim.partPowered(q));
      if (op === 1) { if (!p) sim.notes.add(`No nRF24L01 with CSN on pin ${b}: check CE, CSN, the SPI pins and 3.3 V power.`); if (p) sim.onNet({ kind: "bt", name: "nRF24 radio", ready: true }); return p ? 1 : 0; }
      if (!p) return 0;
      const D = sim.devOf(p.id);
      if (op === 2) { const bytes = Array.from(sim.cpu.data.slice(ptr, ptr + len)); const txt = String.fromCharCode(...bytes.filter(x => x >= 32 && x < 127)); if (D) D.txAt = performance.now(); sim.onNet({ kind: "btout", name: "nRF24 radio", text: txt + "\n" }); return 1; }
      if (op === 3) return (sim.radioIn || []).length ? 1 : 0;
      if (op === 4) { const m = (sim.radioIn || []).shift(); if (!m) return 0; return sim.put(ptr, len, Array.from(m).map(c => c.charCodeAt(0) & 255).concat([0])); }
      return 0;
    }
    case 17: {   // TFT colour screen
      const p = sim.findPart("tft", q => sim.net.mcuPinOf(q.id, "CS") === (a & 0xff) && sim.partPowered(q));
      if (op === 1) { if (!p) sim.notes.add(`No colour screen with CS on pin ${a & 0xff}: check CS, D/C, the SPI pins and power.`); return p ? 1 : 0; }
      if (!p) return 0;
      const D = sim.devOf(p.id); const ctx = D && D.getCtx && D.getCtx(); if (!ctx) return 0;
      const W = D.cw, Hh = D.ch;
      const col = c => { const r5 = (c >> 11) & 31, g6 = (c >> 5) & 63, b5 = c & 31; return `rgb(${(r5 * 255 / 31) | 0},${(g6 * 255 / 63) | 0},${(b5 * 255 / 31) | 0})`; };
      /* the sketch works in its own rotation; map its coordinates onto the portrait panel */
      const rot = D.rot & 3;
      const pt = (x, y) => rot === 0 ? [x, y] : rot === 1 ? [y, Hh - 1 - x] : rot === 2 ? [W - 1 - x, Hh - 1 - y] : [W - 1 - y, x];
      const rect = (x, y, w, h) => rot === 0 ? [x, y, w, h] : rot === 1 ? [y, Hh - x - w, h, w] : rot === 2 ? [W - x - w, Hh - y - h, w, h] : [W - y - h, x, h, w];
      const args = [];
      for (let i = 0; i * 2 + 2 <= len; i++) args.push(dv.getInt16(ptr + i * 2, true));
      switch (op) {
        case 2: ctx.fillStyle = col(args[0] & 0xffff); ctx.fillRect(0, 0, W, Hh); return 1;
        case 3: { const [x, y, w, h, c] = args; ctx.fillStyle = col(c & 0xffff); ctx.fillRect(...rect(x, y, w, h)); return 1; }
        case 4: { const [x, y, w, h, c] = args; const [rx, ry, rw, rh] = rect(x, y, w, h); ctx.strokeStyle = col(c & 0xffff); ctx.lineWidth = 1; ctx.strokeRect(rx + .5, ry + .5, rw - 1, rh - 1); return 1; }
        case 5: { const [x0, y0, x1, y1, c] = args; ctx.strokeStyle = col(c & 0xffff); ctx.lineWidth = 1; ctx.beginPath(); const [ax, ay] = pt(x0, y0), [bx, by] = pt(x1, y1); ctx.moveTo(ax + .5, ay + .5); ctx.lineTo(bx + .5, by + .5); ctx.stroke(); return 1; }
        case 6: { const [x, y, r, c, fill] = args; const [px, py] = pt(x, y); ctx.beginPath(); ctx.arc(px, py, Math.abs(r), 0, 7); if (fill) { ctx.fillStyle = col(c & 0xffff); ctx.fill(); } else { ctx.strokeStyle = col(c & 0xffff); ctx.lineWidth = 1; ctx.stroke(); } return 1; }
        case 7: {
          const [x, y, size, c, bg] = args, str = sim.str(dv.getUint16(ptr + 10, true), dv.getUint16(ptr + 12, true));
          const w = str.length * 6 * size, h = 8 * size;
          const [rx, ry, rw, rh] = rect(x, y, w, h);
          ctx.save();
          const ang = rot === 1 ? -Math.PI / 2 : rot === 2 ? Math.PI : rot === 3 ? Math.PI / 2 : 0;
          if (bg !== -1) { ctx.fillStyle = col(bg & 0xffff); ctx.fillRect(rx, ry, rw, rh); }
          /* draw at the text's own origin, then spin the canvas to match the rotation */
          const [ox, oy] = rot === 0 ? [rx, ry] : rot === 1 ? [rx, ry + rh] : rot === 2 ? [rx + rw, ry + rh] : [rx + rw, ry];
          ctx.translate(ox, oy); ctx.rotate(ang);
          ctx.font = `${Math.round(7.4 * size)}px "JetBrains Mono", monospace`; ctx.textBaseline = "top";
          ctx.fillStyle = col(c & 0xffff); ctx.fillText(str, 0, 0);
          ctx.restore(); return 1;
        }
        case 8: {
          const [x, y, w, h, r] = args, c = dv.getInt16(ptr + 10, true), fill = dv.getInt16(ptr + 12, true);
          const [rx, ry, rw, rh] = rect(x, y, w, h);
          ctx.beginPath();
          if (ctx.roundRect) ctx.roundRect(rx, ry, rw, rh, Math.abs(r)); else ctx.rect(rx, ry, rw, rh);
          if (fill) { ctx.fillStyle = col(c & 0xffff); ctx.fill(); } else { ctx.strokeStyle = col(c & 0xffff); ctx.lineWidth = 1; ctx.stroke(); }
          return 1;
        }
        case 9: D.rot = args[0] & 3; return 1;
        case 10: { const [x, y, c] = args; const [px, py] = pt(x, y); ctx.fillStyle = col(c & 0xffff); ctx.fillRect(px, py, 1, 1); return 1; }
        case 11: return (rot & 1) ? Hh : W;
        case 12: return (rot & 1) ? W : Hh;
      }
      return 0;
    }
  }
  return 0;
}
