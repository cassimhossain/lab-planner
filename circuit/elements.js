/* Circuit Lab - hand-drawn parts (SVG). Wokwi Elements (MIT) supply the boards and many sensors;
   these cover the rest of the club's kit. All pins sit on a 0.1 inch (9.6 px) grid. */
export const P = 9.6;
const F = 'font-family="Inter,Segoe UI,Arial,sans-serif"';
const MONO = 'font-family="JetBrains Mono,Consolas,monospace"';
const svgEl = (w, h, body) => `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" style="display:block;overflow:visible">${body}</svg>`;
const txt = (x, y, s, size = 6, fill = "#fff", extra = "") => `<text x="${x}" y="${y}" font-size="${size}" fill="${fill}" ${F} ${extra}>${s}</text>`;
const hole = (x, y, r = 2.6) => `<circle cx="${x}" cy="${y}" r="${r}" fill="#F4F1EA" stroke="#C9C3B5" stroke-width=".8"/>`;
const pcb = (x, y, w, h, c = "#1F57A8", r = 4) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" fill="${c}"/><rect x="${x + 1.5}" y="${y + 1.5}" width="${w - 3}" height="${h - 3}" rx="${r - 1}" fill="none" stroke="rgba(255,255,255,.12)"/>`;
const smd = (x, y, w = 5, h = 2.6, c = "#2B2B2B") => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx=".4" fill="${c}"/><rect x="${x}" y="${y}" width="1.1" height="${h}" fill="#C9B26B"/><rect x="${x + w - 1.1}" y="${y}" width="1.1" height="${h}" fill="#C9B26B"/>`;
const chip = (x, y, w, h, label = "", n = 4) => { let s = `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="1" fill="#1E1E22"/>`; for (let i = 0; i < n; i++) { const px = x + (i + 0.5) * w / n - 1; s += `<rect x="${px}" y="${y - 2}" width="2" height="2" fill="#B8BCC6"/><rect x="${px}" y="${y + h}" width="2" height="2" fill="#B8BCC6"/>`; } if (label) s += txt(x + w / 2, y + h / 2 + 2, label, 4.5, "#9BA0AA", 'text-anchor="middle"'); return s; };
/* male header on the left edge: pins at x=0, labels inside the board */
function leftHeader(names, y0, labelX = 13, labelColor = "#fff") {
  let s = `<rect x="2" y="${y0 - P / 2}" width="7" height="${names.length * P}" rx="1" fill="#1A1A1A"/>`;
  const pins = names.map((n, i) => { const y = y0 + i * P; s += `<rect x="-3" y="${y - 1}" width="9" height="2" rx=".5" fill="#D6B656"/><rect x="4" y="${y - 1.6}" width="3.2" height="3.2" fill="#C9A227"/>` + txt(labelX, y + 2, n, 5.4, labelColor); return { name: n, x: 0, y }; });
  return { s, pins };
}
function bottomHeader(names, x0, y, labels = true, color = "#fff") {
  let s = `<rect x="${x0 - P / 2}" y="${y - 9}" width="${names.length * P}" height="7" rx="1" fill="#1A1A1A"/>`;
  const pins = names.map((n, i) => { const x = x0 + i * P; s += `<rect x="${x - 1}" y="${y - 6}" width="2" height="9" rx=".5" fill="#D6B656"/>` + (labels ? `<text x="${x}" y="${y - 12}" font-size="5" fill="${color}" ${F} text-anchor="end" transform="rotate(-90 ${x + 1.8} ${y - 12})">${n}</text>` : ""); return { name: n, x, y }; });
  return { s, pins };
}
const termBlock = (x, y, n, c = "#1F6FD1") => { let s = ""; for (let i = 0; i < n; i++) s += `<rect x="${x}" y="${y + i * P - P / 2}" width="12" height="${P}" fill="${c}" stroke="rgba(0,0,0,.35)" stroke-width=".6"/><circle cx="${x + 6}" cy="${y + i * P}" r="3" fill="#C8CED8" stroke="#8E96A3" stroke-width=".6"/><line x1="${x + 4}" y1="${y + i * P}" x2="${x + 8}" y2="${y + i * P}" stroke="#7A8290" stroke-width=".9"/>`; return s; };
const ledDot = (cls, x, y, on = "#FF3B3B", r = 2.2) => `<circle class="${cls}" data-on="${on}" cx="${x}" cy="${y}" r="${r}" fill="#4A1A1A" stroke="rgba(0,0,0,.3)" stroke-width=".4"/>`;
const mount = (x, y) => `<circle cx="${x}" cy="${y}" r="2.8" fill="#E9EDF3" stroke="#B7C0CC" stroke-width=".8"/>`;

class CL extends HTMLElement {
  constructor() { super(); this._pins = []; }
  get pinInfo() { return this._pins; }
  connectedCallback() { if (this._done) return; this._done = true; this.style.display = "inline-block"; this.render(); }
  attributeChangedCallback() { if (this._done) this.render(); }
  draw(w, h, s, pins) { this.innerHTML = svgEl(w, h, s); this._pins = pins.map(p => Object.assign({ signals: [] }, p)); this.dispatchEvent(new CustomEvent("pininfo-change")); }
  q(sel) { return this.querySelector(sel); }
  led(cls, on) { const l = this.q("." + cls); if (l) { l.setAttribute("fill", on ? l.dataset.on : "#4A1A1A"); l.style.filter = on ? `drop-shadow(0 0 2.5px ${l.dataset.on})` : ""; } }
}

/* ---------- breadboard (30 = half size, 60 = full size) ---------- */
const BB_M = 16;
export const BB_ROWS = ["j", "i", "h", "g", "f", "e", "d", "c", "b", "a"];
const _bb = {};
export function bbLayout(cols = 30) {
  cols = +cols || 30; if (_bb[cols]) return _bb[cols];
  const pins = [], rows = {}, y0 = 12;
  rows.tn = y0; rows.tp = y0 + P;
  let y = y0 + P * 3.2;
  ["j", "i", "h", "g", "f"].forEach(r => { rows[r] = y; y += P; });
  y += P * 1.2;
  ["e", "d", "c", "b", "a"].forEach(r => { rows[r] = y; y += P; });
  rows.bn = y + P * 1.2; rows.bp = rows.bn + P;
  const H = rows.bp + 12, W = cols * P + BB_M * 2;
  const colX = c => BB_M + (c - 0.5) * P;
  for (let c = 1; c <= cols; c++) BB_ROWS.forEach(r => pins.push({ name: c + r, x: colX(c), y: rows[r] }));
  const railCol = {}, railOf = {}; let k = 0;
  for (let c = 1; c <= cols; c++) { if (c % 6 === 0) continue; k++; railCol[k] = c; railOf[c] = k; ["tn", "tp", "bn", "bp"].forEach(r => pins.push({ name: r + "." + k, x: colX(c), y: rows[r] })); }
  const groups = [];
  for (let c = 1; c <= cols; c++) { groups.push(["a", "b", "c", "d", "e"].map(r => c + r)); groups.push(["f", "g", "h", "i", "j"].map(r => c + r)); }
  ["tn", "tp", "bn", "bp"].forEach(r => { const a = []; for (let i = 1; i <= k; i++) a.push(r + "." + i); groups.push(a); });
  return (_bb[cols] = { pins, rows, W, H, colX, railCol, railOf, cols, groups, rails: k });
}
export const BB = bbLayout(30);
export const BB_GROUPS = BB.groups;
export function bbGroupOf(pin, cols = 30) { return bbLayout(cols).groups.find(g => g.includes(pin)) || [pin]; }
class ClBreadboard extends CL {
  static get observedAttributes() { return ["cols"]; }
  render() {
    const L = bbLayout(this.getAttribute("cols") || 30), { pins, rows, W, H } = L;
    let s = `<rect x="0" y="0" width="${W}" height="${H}" rx="6" fill="#F6F3EC" stroke="#DCD5C6"/>`;
    s += `<rect x="4" y="${(rows.f + rows.e) / 2 - P * 0.45}" width="${W - 8}" height="${P * 0.9}" rx="2" fill="#E7E1D4"/>`;
    const rail = (yy, c) => `<line x1="${BB_M}" y1="${yy}" x2="${W - BB_M}" y2="${yy}" stroke="${c}" stroke-width="1.4" stroke-linecap="round"/>`;
    s += rail(rows.tn - 7, "#2F6BDE") + rail(rows.tp + 7, "#E63946") + rail(rows.bn - 7, "#2F6BDE") + rail(rows.bp + 7, "#E63946");
    [["tn", "−", "#2F6BDE"], ["tp", "+", "#E63946"], ["bn", "−", "#2F6BDE"], ["bp", "+", "#E63946"]].forEach(([r, t, c]) => { s += txt(5, rows[r] + 3, t, 8, c, 'font-weight="700"') + txt(W - 11, rows[r] + 3, t, 8, c, 'font-weight="700"'); });
    BB_ROWS.forEach(r => { s += txt(BB_M - 10, rows[r] + 2.5, r, 6.5, "#A39B88") + txt(W - BB_M + 4, rows[r] + 2.5, r, 6.5, "#A39B88"); });
    for (let c = 1; c <= L.cols; c += (c === 1 ? 4 : 5)) { s += txt(L.colX(c), rows.j - 6, c, 6, "#A39B88", 'text-anchor="middle"') + txt(L.colX(c), rows.a + 11, c, 6, "#A39B88", 'text-anchor="middle"'); }
    pins.forEach(p => { s += `<rect x="${p.x - 2.2}" y="${p.y - 2.2}" width="4.4" height="4.4" rx=".9" fill="#3B3A36"/>`; });
    s += `<g class="bbhl"></g>`;
    this.draw(W, H, s, pins);
  }
  highlight(names) { const g = this.q(".bbhl"); if (!g) return; g.innerHTML = (names || []).map(n => { const p = this._pins.find(q => q.name === n); return p ? `<rect x="${p.x - 3.6}" y="${p.y - 3.6}" width="7.2" height="7.2" rx="1.6" fill="rgba(34,197,94,.18)" stroke="#22C55E" stroke-width="1.6"/>` : ""; }).join(""); }
}

/* ---------- resistor (span in breadboard holes) ---------- */
const BAND = ["#1B1B1B", "#7B4A21", "#E02A2A", "#F07C1A", "#F2D21B", "#2FA84F", "#2D68D8", "#8A47C9", "#8C8C8C", "#F4F4F4"];
export function resistorBands(ohms) {
  let v = Math.max(1, Math.round(+ohms || 220)), e = 0;
  while (v >= 100) { v = Math.round(v / 10); e++; }
  if (v < 10) { v *= 10; e--; }
  return [Math.floor(v / 10), v % 10, Math.max(0, e)];
}
class ClResistor extends CL {
  static get observedAttributes() { return ["value", "span"]; }
  render() {
    const span = +(this.getAttribute("span") || 4), W = span * P, cy = 5, val = this.getAttribute("value") || "220";
    const bw = Math.min(26, W - 8), bx = (W - bw) / 2, [a, b, m] = resistorBands(val);
    let s = `<line x1="0" y1="${cy}" x2="${W}" y2="${cy}" stroke="#A9AEB8" stroke-width="1.6" stroke-linecap="round"/>`;
    s += `<rect x="${bx}" y="${cy - 4}" width="${bw}" height="8" rx="3.6" fill="#E9CFA0" stroke="#C7A673" stroke-width=".7"/>`;
    [a, b, m].forEach((d, i) => { s += `<rect x="${bx + 4.5 + i * 4.6}" y="${cy - 4}" width="2.4" height="8" fill="${BAND[d]}"/>`; });
    s += `<rect x="${bx + bw - 6}" y="${cy - 4}" width="2.4" height="8" fill="#C9A227"/>`;
    this.draw(W, 10, s, [{ name: "1", x: 0, y: cy }, { name: "2", x: W, y: cy }]);
  }
}

/* ---------- OLED 0.96" I2C (SSD1306) ---------- */
class ClOled extends CL {
  static get observedAttributes() { return ["color"]; }
  render() {
    const W = 104, H = 102;
    let s = pcb(0, 0, W, H, "#1B3F7A", 5) + mount(6, 6) + mount(W - 6, 6) + mount(6, H - 6) + mount(W - 6, H - 6);
    const names = ["GND", "VCC", "SCL", "SDA"], x0 = W / 2 - 1.5 * P;
    s += `<rect x="${x0 - P / 2}" y="2" width="${4 * P}" height="7" rx="1" fill="#1A1A1A"/>`;
    const pins = names.map((n, i) => { const x = x0 + i * P; s += `<rect x="${x - 1}" y="-3" width="2" height="9" rx=".5" fill="#D6B656"/>` + txt(x, 16, n, 4.8, "#fff", 'text-anchor="middle"'); return { name: n, x, y: 0 }; });
    s += `<rect x="4" y="22" width="${W - 8}" height="62" rx="2" fill="#0B0B0D"/><rect x="8" y="26" width="${W - 16}" height="${(W - 16) / 2}" fill="#050506"/>`;
    s += `<foreignObject x="8" y="26" width="${W - 16}" height="${(W - 16) / 2}"><canvas xmlns="http://www.w3.org/1999/xhtml" width="128" height="64" style="width:${W - 16}px;height:${(W - 16) / 2}px;image-rendering:pixelated;display:block"></canvas></foreignObject>`;
    s += txt(W / 2, H - 7, "0.96\" OLED · I2C", 5, "#9DB4DA", 'text-anchor="middle"');
    this.draw(W, H, s, pins);
    this.ctx = this.q("canvas").getContext("2d");
  }
  color() { const c = this.getAttribute("color") || "white"; return c === "blue" ? [64, 200, 255] : c === "yellow" ? [255, 220, 60] : [235, 245, 255]; }
  show(buf, w = 128, h = 64, invert = false, on = true) {
    if (!this.ctx) return;
    const img = this.ctx.createImageData(128, 64), [r, g, b] = this.color(), two = this.getAttribute("color") === "yellowblue";
    for (let y = 0; y < Math.min(64, h); y++) for (let x = 0; x < Math.min(128, w); x++) {
      let bit = buf ? (buf[x + (y >> 3) * w] >> (y & 7)) & 1 : 0; if (invert) bit ^= 1; if (!on) bit = 0;
      const i = (y * 128 + x) * 4;
      if (bit) { const c = two && y < 16 ? [255, 220, 60] : two ? [64, 200, 255] : [r, g, b]; img.data[i] = c[0]; img.data[i + 1] = c[1]; img.data[i + 2] = c[2]; img.data[i + 3] = 255; }
      else { img.data[i] = 5; img.data[i + 1] = 5; img.data[i + 2] = 8; img.data[i + 3] = 255; }
    }
    this.ctx.putImageData(img, 0, 0);
  }
  clear() { this.show(null); }
}

/* ---------- generic analog / digital sensor module (pins on the left) ---------- */
function moduleBase(W, H, names, title, color = "#1F57A8") {
  let s = pcb(0, 0, W, H, color);
  const hd = leftHeader(names, H / 2 - (names.length - 1) * P / 2);
  s += hd.s;
  if (title) s += txt(W - 6, H - 5, title, 5, "rgba(255,255,255,.75)", 'text-anchor="end"');
  return { s, pins: hd.pins };
}
/* trimmer pot + comparator + two indicator LEDs common to cheap sensor modules */
const modGuts = (x, y) => `<rect x="${x}" y="${y}" width="11" height="11" rx="1.5" fill="#2E7DE0" stroke="#164A8A" stroke-width=".6"/><circle cx="${x + 5.5}" cy="${y + 5.5}" r="3.4" fill="#E9EDF3"/><line x1="${x + 3.5}" y1="${y + 5.5}" x2="${x + 7.5}" y2="${y + 5.5}" stroke="#7A8290" stroke-width="1"/>` + chip(x + 15, y + 1, 10, 9, "", 4);

class ClLdr extends CL {
  render() {
    const W = 104, H = 44, m = moduleBase(W, H, ["VCC", "GND", "DO", "AO"], "LDR MODULE");
    let s = m.s + modGuts(36, 7) + ledDot("pwr", 40, 30, "#FF3B3B") + ledDot("sig", 50, 30, "#3CFF6B");
    s += `<g transform="translate(84 22)"><circle r="9" fill="#F1E6C8" stroke="#BFA97A"/><path d="M-6 -3 h3 v6 h3 v-6 h3 v6 h3" stroke="#C0392B" stroke-width="1.3" fill="none"/></g>`;
    s += smd(64, 6) + smd(64, 32);
    this.draw(W, H, s, m.pins);
  }
}
class ClSoil extends CL {
  render() {
    const W = 168, H = 62, m = moduleBase(64, 40, ["VCC", "GND", "DO", "AO"], "", "#1F57A8");
    let s = m.s + modGuts(30, 6) + ledDot("pwr", 34, 30, "#FF3B3B") + ledDot("sig", 44, 30, "#3CFF6B");
    s += `<path d="M64 14 C78 14 80 10 92 10" stroke="#E63946" stroke-width="1.6" fill="none"/><path d="M64 24 C78 24 80 28 92 28" stroke="#2B2D42" stroke-width="1.6" fill="none"/>`;
    s += `<path d="M92 2 h70 v8 h-56 v6 h56 v8 h-56 v6 h56 v8 h-70 z" fill="#C9A227" opacity=".25"/>`;
    s += `<path d="M92 2 h72 a3 3 0 0 1 0 12 h-60 v12 h60 a3 3 0 0 1 0 12 h-72 z" fill="#2A6E3F"/><path d="M104 8 h58 M104 32 h58" stroke="#E8C95A" stroke-width="2.4" stroke-linecap="round"/>`;
    s += txt(124, 22, "SOIL PROBE", 5.2, "#CDE8D3");
    s += `<rect class="soilw" x="100" y="40" width="70" height="22" rx="4" fill="#7A5230" opacity=".9"/><text class="soilt" x="135" y="54" font-size="6.5" fill="#F7E7D2" ${F} text-anchor="middle">dry soil</text>`;
    this.draw(W, H, s, m.pins);
  }
  set moisture(v) { const t = this.q(".soilt"), w = this.q(".soilw"); if (t) t.textContent = v > 60 ? "wet soil" : v > 30 ? "damp soil" : "dry soil"; if (w) w.setAttribute("fill", v > 60 ? "#4C3220" : v > 30 ? "#62412A" : "#9C7148"); }
}
class ClRain extends CL {
  render() {
    const W = 170, H = 70, m = moduleBase(64, 40, ["VCC", "GND", "DO", "AO"], "", "#1F57A8");
    let s = m.s + modGuts(30, 6) + ledDot("pwr", 34, 30, "#FF3B3B") + ledDot("sig", 44, 30, "#3CFF6B");
    s += `<path d="M64 16 C76 16 80 12 92 12" stroke="#E63946" stroke-width="1.4" fill="none"/><path d="M64 24 C76 24 80 22 92 22" stroke="#2B2D42" stroke-width="1.4" fill="none"/>`;
    s += `<rect x="92" y="2" width="76" height="62" rx="3" fill="#1D4E2E"/>`;
    for (let i = 0; i < 7; i++) s += `<path d="M98 ${8 + i * 8} h62" stroke="#D9C46A" stroke-width="2"/>`;
    s += `<path d="M98 8 v48 M160 12 v48" stroke="#D9C46A" stroke-width="2"/>`;
    s += `<g class="drops" opacity="0">${[[110, 20], [130, 34], [148, 22], [120, 48], [142, 50]].map(([x, y]) => `<path d="M${x} ${y - 5} q4 6 0 8 q-4 -2 0 -8z" fill="#7CC7FF"/>`).join("")}</g>`;
    s += txt(130, H - 1, "RAIN SENSOR", 5, "#5C6B80", 'text-anchor="middle"');
    this.draw(W, H, s, m.pins);
  }
  set wet(v) { const d = this.q(".drops"); if (d) d.setAttribute("opacity", Math.min(1, v / 60).toFixed(2)); }
}
class ClGas extends CL {
  static get observedAttributes() { return ["kind"]; }
  render() {
    const W = 112, H = 60, kind = this.getAttribute("kind") || "MQ-2", m = moduleBase(W, H, ["VCC", "GND", "DO", "AO"], kind + " GAS SENSOR");
    let s = m.s + ledDot("pwr", 40, 12, "#FF3B3B") + ledDot("sig", 40, 48, "#3CFF6B") + modGuts(30, 20);
    s += `<g transform="translate(84 30)"><circle r="21" fill="#BFC5CE" stroke="#8E96A3"/><circle r="17" fill="#9AA2AE"/>`;
    for (let i = -14; i <= 14; i += 3.5) s += `<line x1="${i}" y1="${-Math.sqrt(Math.max(0, 289 - i * i))}" x2="${i}" y2="${Math.sqrt(Math.max(0, 289 - i * i))}" stroke="#7D8592" stroke-width=".7"/>`;
    for (let i = -14; i <= 14; i += 3.5) s += `<line y1="${i}" x1="${-Math.sqrt(Math.max(0, 289 - i * i))}" y2="${i}" x2="${Math.sqrt(Math.max(0, 289 - i * i))}" stroke="#7D8592" stroke-width=".7"/>`;
    s += `<circle class="smoke" r="17" fill="#9E9E9E" opacity="0"/></g>`;
    this.draw(W, H, s, m.pins);
  }
  set level(v) { const k = this.q(".smoke"); if (k) k.setAttribute("opacity", Math.min(.75, v / 1000).toFixed(2)); }
}
class ClFlame extends CL {
  render() {
    const W = 104, H = 44, m = moduleBase(W, H, ["VCC", "GND", "DO", "AO"], "FLAME SENSOR");
    let s = m.s + modGuts(36, 7) + ledDot("pwr", 40, 30, "#FF3B3B") + ledDot("sig", 50, 30, "#3CFF6B");
    s += `<rect x="70" y="18" width="10" height="8" fill="#B8BCC6"/><g transform="translate(88 22)"><ellipse rx="8" ry="6" fill="#151515"/><ellipse cx="-2" cy="-2" rx="3" ry="2" fill="#555"/></g>`;
    s += `<g class="flame" opacity="0" transform="translate(100 22)"><path d="M6 -14 C14 -4 12 6 6 10 C0 6 -2 -2 6 -14z" fill="#FF8A1F"/><path d="M6 -6 C10 0 9 6 6 8 C3 6 2 1 6 -6z" fill="#FFE066"/></g>`;
    this.draw(W, H, s, m.pins);
  }
  set flame(v) { const f = this.q(".flame"); if (f) f.setAttribute("opacity", v > 50 ? 1 : v > 15 ? .5 : 0); }
}
class ClSound extends CL {
  render() {
    const W = 104, H = 44, m = moduleBase(W, H, ["VCC", "GND", "DO", "AO"], "SOUND KY-037");
    let s = m.s + modGuts(36, 7) + ledDot("pwr", 40, 30, "#FF3B3B") + ledDot("sig", 50, 30, "#3CFF6B");
    s += `<g transform="translate(86 22)"><circle r="12" fill="#1A1A1A"/><circle r="9.5" fill="#3A3A3A"/><circle r="8" fill="none" stroke="#5A5A5A" stroke-dasharray="1 1.6"/><g class="waves" opacity="0" stroke="#22C55E" fill="none" stroke-width="1.2"><path d="M14 -8 a12 12 0 0 1 0 16"/><path d="M18 -12 a17 17 0 0 1 0 24"/></g></g>`;
    this.draw(W, H, s, m.pins);
  }
  set loud(v) { const w = this.q(".waves"); if (w) w.setAttribute("opacity", Math.min(1, v / 600).toFixed(2)); }
}
class ClIrLine extends CL {
  render() {
    const W = 92, H = 34, m = moduleBase(W, H, ["VCC", "GND", "OUT"], "", "#1F57A8");
    let s = m.s + chip(34, 12, 10, 9, "", 4) + ledDot("pwr", 52, 10, "#FF3B3B") + ledDot("sig", 52, 24, "#3CFF6B");
    s += `<rect x="66" y="6" width="22" height="22" rx="2" fill="#151515"/><circle cx="72" cy="17" r="4.5" fill="#2A2A2A" stroke="#555"/><circle cx="82" cy="17" r="4.5" fill="#D9E2F1" stroke="#777"/>`;
    s += txt(46, 32, "TCRT5000", 4.6, "rgba(255,255,255,.75)");
    s += `<rect class="surf" x="64" y="36" width="28" height="10" rx="2" fill="#F2F2F2" stroke="#BBB"/><text class="surft" x="78" y="43.5" font-size="5.5" text-anchor="middle" fill="#333" ${F}>white</text>`;
    this.draw(W, H + 12, s, m.pins);
  }
  set black(v) { const r = this.q(".surf"), t = this.q(".surft"); if (r) r.setAttribute("fill", v ? "#151515" : "#F2F2F2"); if (t) { t.textContent = v ? "black line" : "white"; t.setAttribute("fill", v ? "#EEE" : "#333"); } }
}
class ClIrObstacle extends CL {
  render() {
    const W = 104, H = 36, m = moduleBase(W, H, ["VCC", "GND", "OUT"], "IR OBSTACLE");
    let s = m.s + modGuts(34, 6) + ledDot("pwr", 56, 28, "#FF3B3B") + ledDot("sig", 66, 28, "#3CFF6B");
    s += `<rect x="78" y="5" width="12" height="9" rx="2" fill="#E8EEF8" stroke="#555" stroke-width=".6"/><rect x="78" y="22" width="12" height="9" rx="2" fill="#1A1A1A"/><circle cx="94" cy="9.5" r="5" fill="#DDE6F5" stroke="#777" stroke-width=".6"/><circle cx="94" cy="26.5" r="5" fill="#111" stroke="#444" stroke-width=".6"/>`;
    s += `<g class="obs" style="display:none"><rect x="104" y="2" width="6" height="32" rx="1" fill="#8A5A00"/></g>`;
    this.draw(W, H, s, m.pins);
  }
  set state(v) { this.led("sig", v); const o = this.q(".obs"); if (o) o.style.display = v ? "" : "none"; }
}
class ClPulse extends CL {
  render() {
    const W = 64, H = 44;
    const hd = leftHeader(["S", "+", "-"], 22 - P);
    let s = `<circle cx="40" cy="22" r="21" fill="#4B2A82"/><rect x="0" y="6" width="22" height="32" rx="3" fill="#4B2A82"/>` + hd.s;
    s += `<g class="heart" transform="translate(42 22)"><path d="M0 7 C-10 0 -9 -8 -4 -8 C-1.5 -8 0 -6 0 -4 C0 -6 1.5 -8 4 -8 C9 -8 10 0 0 7z" fill="#FF4D6D"/></g><circle cx="42" cy="22" r="2.5" fill="#7CF29A"/>`;
    this.draw(W, H, s, hd.pins);
  }
  set beat(v) { const h = this.q(".heart"); if (h) h.setAttribute("transform", `translate(42 22) scale(${v ? 1.25 : 1})`); }
}
class ClVibe extends CL {
  render() {
    const W = 80, H = 36, m = moduleBase(W, H, ["IN", "VCC", "GND"], "VIBRATION");
    let s = m.s + smd(30, 8) + ledDot("sig", 34, 24, "#3CFF6B");
    s += `<g class="coin" transform="translate(60 16)"><circle r="11" fill="#C7CCD4" stroke="#8D95A1"/><circle r="7" fill="#AEB5C0"/><text y="2.5" font-size="5.5" text-anchor="middle" fill="#555" ${F}>~</text></g>`;
    this.draw(W, H, s, m.pins);
  }
  set on(v) { this.led("sig", v); const c = this.q(".coin"); if (c) c.classList.toggle("shake", !!v); }
}
class ClRelay extends CL {
  static get observedAttributes() { return ["channels"]; }
  render() {
    const n = +(this.getAttribute("channels") || 1), W = 120, rowH = 40, H = Math.max(56, n * rowH + 16);
    const names = ["VCC", "GND"].concat(Array.from({ length: n }, (_, i) => n === 1 ? "IN" : "IN" + (i + 1)));
    const m = moduleBase(W, H, names, n === 1 ? "1-CHANNEL RELAY" : n + "-CHANNEL RELAY", "#1C4F96");
    let s = m.s, pins = m.pins.slice();
    for (let i = 0; i < n; i++) {
      const y = 8 + i * rowH, t = n === 1 ? "" : i + 1;
      s += `<rect x="44" y="${y}" width="46" height="30" rx="2" fill="#2B6BD6" stroke="#174A9C"/>` + txt(67, y + 13, "SRD-05VDC", 4.6, "#DCE8FF", 'text-anchor="middle"') + txt(67, y + 21, "10A 250VAC", 4, "#BCD1F5", 'text-anchor="middle"');
      s += ledDot("rl" + i, 36, y + 8, "#FF3B3B") + `<g class="arm${i}"><line x1="92" y1="${y + 15}" x2="102" y2="${y + 10}" stroke="#E2E6EC" stroke-width="1.4"/></g>`;
      const ty = y + 15 - P;
      s += termBlock(W - 13, ty, 3);
      ["NO", "COM", "NC"].forEach((k, j) => { s += txt(W - 16, ty + j * P + 2, k, 4.6, "#fff", 'text-anchor="end"'); pins.push({ name: k + t, x: W, y: ty + j * P }); });
    }
    this.draw(W, H, s, pins);
    this.n = n;
  }
  setCoil(i, on) { this.led("rl" + i, on); const a = this.q(".arm" + i + " line"); if (a) a.setAttribute("y2", +a.getAttribute("y1") + (on ? -11 : 5)); }
}
class ClLamp extends CL {
  render() {
    const W = 64, H = 70, hd = leftHeader(["+", "-"], 52);
    let s = `<rect x="2" y="44" width="40" height="22" rx="3" fill="#2B2D42"/>` + hd.s;
    s += `<g transform="translate(40 26)"><circle class="glow" r="26" fill="#FFD84D" opacity="0"/><path d="M-10 6 C-16 -2 -14 -18 0 -19 C14 -18 16 -2 10 6 L8 14 L-8 14 Z" fill="#F7F3E6" stroke="#C8C1A7"/><path class="fil" d="M-5 6 L-3 -6 L0 2 L3 -6 L5 6" stroke="#9A8E70" stroke-width="1.1" fill="none"/><rect x="-8" y="14" width="16" height="9" rx="1.5" fill="#B9BEC7"/><path d="M-8 17 h16 M-8 20 h16" stroke="#8E95A1"/></g>`;
    s += txt(22, 63, "5V LAMP", 5, "#C9CEDA", 'text-anchor="middle"');
    this.draw(W, H, s, hd.pins);
  }
  set on(v) { const g = this.q(".glow"), f = this.q(".fil"); if (g) g.setAttribute("opacity", (0.55 * Math.min(1, v)).toFixed(2)); if (f) f.setAttribute("stroke", v > .05 ? "#FF9F1C" : "#9A8E70"); }
}
class ClFan extends CL {
  render() {
    const W = 84, H = 70, hd = leftHeader(["+", "-"], 30);
    let s = `<rect x="12" y="0" width="70" height="70" rx="8" fill="#1F1F23"/><circle cx="47" cy="35" r="31" fill="#2C2C32"/>` + hd.s;
    s += `<g class="blades" style="transform-origin:47px 35px">`;
    for (let i = 0; i < 7; i++) s += `<path transform="rotate(${i * 51.4} 47 35)" d="M47 35 C52 22 60 12 66 14 C66 22 58 30 47 35z" fill="#4A4A55"/>`;
    s += `<circle cx="47" cy="35" r="9" fill="#151518"/></g>` + txt(47, 37, "5V", 5.5, "#9CA3AF", 'text-anchor="middle"');
    this.draw(W, H, s, hd.pins); this._a = 0; this.speed = 0;
  }
  spin(dt) { const b = this.q(".blades"); if (!b) return; this._a = (this._a + this.speed * 1400 * dt) % 360; b.style.transform = `rotate(${this._a}deg)`; }
}
class ClPump extends CL {
  render() {
    const W = 96, H = 56, hd = leftHeader(["+", "-"], 22);
    let s = hd.s + `<rect x="14" y="8" width="44" height="30" rx="6" fill="#2B2D42"/><rect x="58" y="14" width="18" height="18" rx="3" fill="#E6E9EF" stroke="#9AA1AD"/><rect x="76" y="20" width="18" height="6" fill="#8AC7F0" opacity=".8"/>` + txt(36, 26, "PUMP", 6, "#C9CEDA", 'text-anchor="middle"');
    s += `<g class="water" opacity="0">${[0, 1, 2].map(i => `<circle cx="${86 + i * 4}" cy="${34 + i * 6}" r="2" fill="#4DB6FF"/>`).join("")}</g>`;
    this.draw(W, H, s, hd.pins);
  }
  set on(v) { const w = this.q(".water"); if (w) w.setAttribute("opacity", v ? 1 : 0); }
}
class ClHc05 extends CL {
  render() {
    const W = 120, H = 66, m = moduleBase(W, H, ["STATE", "RXD", "TXD", "GND", "VCC", "EN"], "HC-05 BLUETOOTH", "#1D5FB8");
    let s = m.s + `<rect x="44" y="10" width="62" height="40" rx="2" fill="#2E8B57"/><rect x="48" y="14" width="30" height="20" rx="1" fill="#1E1E22"/>` + txt(63, 26, "BC417", 4.5, "#888", 'text-anchor="middle"');
    s += `<path d="M84 16 h18 v4 h-14 v4 h14 v4 h-14 v4 h14" stroke="#E8C95A" stroke-width="1.4" fill="none"/>` + ledDot("bt", 36, 56, "#FF3B3B");
    this.draw(W, H, s, m.pins);
  }
}
class ClRfid extends CL {
  render() {
    const W = 150, H = 104, m = moduleBase(W, H, ["SDA", "SCK", "MOSI", "MISO", "IRQ", "GND", "RST", "3.3V"], "RFID-RC522", "#1A4E9E");
    let s = m.s + chip(42, 12, 18, 18, "RC522", 6);
    s += `<rect x="66" y="10" width="76" height="80" rx="6" fill="none" stroke="#E8C95A" stroke-width="2"/><rect x="72" y="16" width="64" height="68" rx="5" fill="none" stroke="#E8C95A" stroke-width="2"/><rect x="78" y="22" width="52" height="56" rx="4" fill="none" stroke="#E8C95A" stroke-width="2"/>`;
    s += ledDot("rf", 44, 90, "#FF3B3B");
    s += `<g class="card" style="display:none" transform="translate(76 20)"><rect width="62" height="40" rx="4" fill="#F7F9FC" stroke="#B9C2D0"/><rect x="6" y="6" width="12" height="9" rx="1.5" fill="#E2C26B"/><text class="cardt" x="31" y="30" font-size="6" text-anchor="middle" fill="#2B3A55" ${MONO}>CARD</text></g>`;
    this.draw(W, H, s, m.pins);
  }
  showCard(label) { const c = this.q(".card"), t = this.q(".cardt"); if (c) c.style.display = label ? "" : "none"; if (t && label) t.textContent = label; }
}
class ClTcs extends CL {
  render() {
    const W = 84, H = 60, m = moduleBase(W, H, ["VIN", "GND", "SCL", "SDA", "LED"], "TCS34725", "#5B2A9B");
    let s = m.s + `<rect x="50" y="20" width="14" height="14" rx="2" fill="#E8E6EF"/><rect x="54" y="24" width="6" height="6" fill="#3B3355"/>` + `<circle class="wl" cx="70" cy="27" r="4" fill="#C9C6D6"/>`;
    s += `<rect class="obj" x="46" y="40" width="34" height="12" rx="3" fill="#E63946"/>`;
    this.draw(W, H, s, m.pins);
  }
  setColor(c, led) { const o = this.q(".obj"), w = this.q(".wl"); if (o) o.setAttribute("fill", c); if (w) { w.setAttribute("fill", led ? "#FFFFFF" : "#C9C6D6"); w.style.filter = led ? "drop-shadow(0 0 3px #fff)" : ""; } }
}
class ClIna219 extends CL {
  render() {
    const W = 96, H = 50, m = moduleBase(W, H, ["VCC", "GND", "SCL", "SDA"], "INA219", "#5B2A9B");
    let s = m.s + chip(40, 16, 12, 10, "", 4) + `<rect x="58" y="16" width="12" height="6" fill="#222"/>` + termBlock(W - 13, 20, 2, "#2A9D5C");
    s += txt(W - 16, 22, "IN+", 4.6, "#fff", 'text-anchor="end"') + txt(W - 16, 31.6, "IN−", 4.6, "#fff", 'text-anchor="end"');
    s += `<text class="ma" x="52" y="42" font-size="6.5" fill="#E9D8FF" ${MONO} text-anchor="middle"></text>`;
    this.draw(W, H, s, m.pins.concat([{ name: "VIN+", x: W, y: 20 }, { name: "VIN-", x: W, y: 20 + P }]));
  }
  set reading(t) { const e = this.q(".ma"); if (e) e.textContent = t; }
}
class ClHx711 extends CL {
  render() {
    const W = 220, H = 70, m = moduleBase(60, 46, ["VCC", "GND", "DT", "SCK"], "HX711", "#1E7A46");
    let s = m.s + chip(30, 14, 18, 14, "", 4);
    s += `<path d="M60 14 C74 14 78 30 92 30" stroke="#E63946" stroke-width="1.3" fill="none"/><path d="M60 20 C74 20 78 33 92 33" stroke="#2B2D42" stroke-width="1.3" fill="none"/><path d="M60 26 C74 26 78 36 92 36" stroke="#F5F5F5" stroke-width="1.3" fill="none"/><path d="M60 32 C74 32 78 39 92 39" stroke="#2E9E5B" stroke-width="1.3" fill="none"/>`;
    s += `<rect x="92" y="28" width="122" height="16" rx="2" fill="#C9CED6" stroke="#9AA1AD"/><circle cx="140" cy="36" r="4" fill="#9AA1AD"/><circle cx="166" cy="36" r="4" fill="#9AA1AD"/>` + txt(153, 54, "LOAD CELL 5 kg", 5.5, "#5C6B80", 'text-anchor="middle"');
    s += `<g class="wt"><rect x="170" y="8" width="36" height="20" rx="3" fill="#F2A541"/><text class="wtt" x="188" y="21" font-size="7" text-anchor="middle" fill="#3B2600" ${F} font-weight="700">0 g</text></g>`;
    this.draw(W, H, s, m.pins);
  }
  set grams(g) { const t = this.q(".wtt"), w = this.q(".wt"); if (t) t.textContent = Math.round(g) + " g"; if (w) w.style.opacity = g > 0 ? 1 : .35; }
}
class ClMax7219 extends CL {
  render() {
    const W = 132, H = 112, m = moduleBase(W, H, ["VCC", "GND", "DIN", "CS", "CLK"], "MAX7219", "#1A4E9E");
    let s = m.s + `<rect x="26" y="6" width="100" height="100" rx="3" fill="#141414"/>`;
    for (let r = 0; r < 8; r++) for (let c = 0; c < 8; c++) s += `<circle class="d${r}_${c}" cx="${33 + c * 12.2}" cy="${13 + r * 12.2}" r="4.6" fill="#3A1616"/>`;
    this.draw(W, H, s, m.pins);
  }
  setRows(rows) { for (let r = 0; r < 8; r++) for (let c = 0; c < 8; c++) { const d = this.q(`.d${r}_${c}`); if (!d) continue; const on = (rows[r] >> (7 - c)) & 1; d.setAttribute("fill", on ? "#FF2D2D" : "#3A1616"); d.style.filter = on ? "drop-shadow(0 0 2px #ff3030)" : ""; } }
}
class ClStepper28 extends CL {
  render() {
    const W = 230, H = 104, m = moduleBase(84, 70, ["IN1", "IN2", "IN3", "IN4", "+", "-"], "ULN2003", "#1E7A46");
    let s = m.s + chip(34, 8, 14, 30, "", 8);
    ["A", "B", "C", "D"].forEach((k, i) => { s += ledDot("c" + i, 60 + i * 0, 12 + i * 10, "#FF3B3B") + txt(66, 14 + i * 10, k, 5, "#fff"); });
    s += `<path d="M84 30 C110 30 112 52 140 52" stroke="#2D68D8" stroke-width="1.5" fill="none"/><path d="M84 34 C110 34 112 55 140 55" stroke="#E36BD3" stroke-width="1.5" fill="none"/><path d="M84 38 C110 38 112 58 140 58" stroke="#F2D21B" stroke-width="1.5" fill="none"/><path d="M84 42 C110 42 112 61 140 61" stroke="#F07C1A" stroke-width="1.5" fill="none"/><path d="M84 46 C110 46 112 64 140 64" stroke="#E02A2A" stroke-width="1.5" fill="none"/>`;
    s += `<g transform="translate(182 54)"><rect x="-46" y="-8" width="92" height="16" rx="7" fill="#B9BEC7"/><circle r="42" fill="#C9CED6" stroke="#9AA1AD"/><circle r="34" fill="#DCE0E6"/><circle cx="0" cy="-14" r="9" fill="#B0B6C0"/><g class="shaft"><circle cx="0" cy="-14" r="4" fill="#E8C95A"/><rect x="-1.3" y="-24" width="2.6" height="10" fill="#C79A2A"/></g>` + txt(0, 20, "28BYJ-48", 6, "#4B5563", 'text-anchor="middle"') + `<text class="deg" x="0" y="29" font-size="6" text-anchor="middle" fill="#4B5563" ${F}></text></g>`;
    this.draw(W, H, s, m.pins);
    this.angle = 0;
  }
  set coils(b) { for (let i = 0; i < 4; i++) this.led("c" + i, (b >> i) & 1); }
  setAngle(a) { const g = this.q(".shaft"), t = this.q(".deg"); if (g) g.setAttribute("transform", `rotate(${a} 0 -14)`); if (t) t.textContent = Math.round(((a % 360) + 360) % 360) + "°"; }
}
class ClMpu extends CL {
  render() {
    const W = 84, H = 82, m = moduleBase(W, H, ["VCC", "GND", "SCL", "SDA", "XDA", "XCL", "AD0", "INT"], "GY-521", "#1A4E9E");
    let s = m.s + `<rect x="44" y="26" width="18" height="18" rx="1.5" fill="#1E1E22"/>` + txt(53, 37, "MPU", 4.5, "#888", 'text-anchor="middle"') + mount(W - 8, 8) + mount(W - 8, H - 8);
    s += `<g transform="translate(53 60)" stroke="#E8EEF8" stroke-width="1" fill="none"><path d="M0 0 h12 M0 0 v-12"/><path d="M12 0 l-3 -2 M12 0 l-3 2 M0 -12 l-2 3 M0 -12 l2 3"/></g>` + txt(67, 62, "X", 5, "#E8EEF8") + txt(50, 46, "Y", 5, "#E8EEF8");
    s += ledDot("pwr", 36, 72, "#3CFF6B");
    this.draw(W, H, s, m.pins);
  }
}
class ClLedStrip extends CL {
  static get observedAttributes() { return ["pixels"]; }
  render() {
    const n = +(this.getAttribute("pixels") || 8), W = 26 + n * 18, H = 30, hd = leftHeader(["5V", "DIN", "GND"], 15 - P);
    let s = `<rect x="10" y="3" width="${W - 10}" height="24" rx="3" fill="#F2F2F2" stroke="#D0D0D0"/>` + hd.s;
    for (let i = 0; i < n; i++) s += `<rect x="${22 + i * 18}" y="9" width="12" height="12" rx="1.5" fill="#FAFAFA" stroke="#C8C8C8"/><circle class="px" data-i="${i}" cx="${28 + i * 18}" cy="15" r="4" fill="#E2E2E2"/>`;
    this.draw(W, H, s, hd.pins);
  }
  setPixel(i, { r, g, b }) { const p = this.querySelectorAll(".px")[i]; if (!p) return; const on = r + g + b > 0.02; p.setAttribute("fill", on ? `rgb(${r * 255 | 0},${g * 255 | 0},${b * 255 | 0})` : "#E2E2E2"); p.style.filter = on ? `drop-shadow(0 0 3px rgb(${r * 255 | 0},${g * 255 | 0},${b * 255 | 0}))` : ""; }
  reset() { this.querySelectorAll(".px").forEach(p => { p.setAttribute("fill", "#E2E2E2"); p.style.filter = ""; }); }
}
class ClSolar extends CL {
  render() {
    const W = 120, H = 80, hd = leftHeader(["+", "-"], 40 - P / 2);
    let s = `<rect x="14" y="2" width="104" height="76" rx="3" fill="#C9CED6"/><rect x="18" y="6" width="96" height="68" fill="#1C2E5C"/>`;
    for (let i = 1; i < 6; i++) s += `<line x1="${18 + i * 16}" y1="6" x2="${18 + i * 16}" y2="74" stroke="#3A5594" stroke-width=".8"/>`;
    for (let j = 1; j < 4; j++) s += `<line x1="18" y1="${6 + j * 17}" x2="114" y2="${6 + j * 17}" stroke="#3A5594" stroke-width=".8"/>`;
    s += `<rect class="sun" x="18" y="6" width="96" height="68" fill="#FFE27A" opacity="0"/>` + hd.s + txt(66, 44, "6V 1W", 7, "#B9C7E8", 'text-anchor="middle"');
    this.draw(W, H, s, hd.pins);
  }
  set light(v) { const k = this.q(".sun"); if (k) k.setAttribute("opacity", (0.35 * v / 100).toFixed(2)); }
}
const BATT = { "9V": { v: 9, label: "9V" }, "4xAA": { v: 6, label: "4 × AA · 6V" }, "2xAA": { v: 3, label: "2 × AA · 3V" }, "18650": { v: 3.7, label: "18650 · 3.7V" }, "coin": { v: 3, label: "CR2032 · 3V" }, "lemon": { v: 2.7, label: "3 lemon cells · 2.7V" } };
class ClBattery extends CL {
  static get observedAttributes() { return ["kind"]; }
  render() {
    const k = this.getAttribute("kind") || "9V";
    const hd = leftHeader(["+", "-"], 14);
    let s, W, H;
    if (k === "9V") { W = 70; H = 92; s = `<rect x="14" y="2" width="52" height="88" rx="5" fill="#2B2D42"/><rect x="14" y="40" width="52" height="50" rx="5" fill="#F5B83D"/>` + txt(40, 30, "9V", 13, "#fff", 'text-anchor="middle" font-weight="800"'); }
    else if (k === "coin") { W = 60; H = 50; s = `<circle cx="36" cy="25" r="23" fill="#C8CED8" stroke="#8E96A3"/><circle cx="36" cy="25" r="17" fill="#D9DEE6"/>` + txt(36, 27, "CR2032", 5.5, "#4B5563", 'text-anchor="middle"'); }
    else if (k === "lemon") { W = 170; H = 70; s = ""; for (let i = 0; i < 3; i++) { const x = 40 + i * 44; s += `<ellipse cx="${x}" cy="34" rx="20" ry="16" fill="#F7D547" stroke="#C9A227"/><ellipse cx="${x - 6}" cy="28" rx="6" ry="3" fill="#FFF3A6" opacity=".7"/><rect x="${x - 10}" y="14" width="3" height="16" fill="#9AA1AD"/><rect x="${x + 7}" y="12" width="5" height="18" rx="1" fill="#C77B30"/>`; if (i < 2) s += `<path d="M${x + 9} 12 C${x + 20} 2 ${x + 30} 2 ${x + 34} 14" stroke="#E63946" stroke-width="1.6" fill="none"/>`; } s += txt(W / 2, 64, BATT.lemon.label, 6, "#5C6B80", 'text-anchor="middle"'); }
    else if (k === "18650") { W = 150; H = 40; s = `<rect x="14" y="4" width="132" height="32" rx="4" fill="#1F1F23"/><rect x="22" y="8" width="116" height="24" rx="10" fill="#2E8BDB"/>` + txt(80, 23, "18650 Li-ion 3.7V", 7, "#fff", 'text-anchor="middle"'); }
    else { const n = k === "4xAA" ? 4 : 2; W = 30 + n * 26; H = 64; s = `<rect x="14" y="2" width="${W - 14}" height="60" rx="4" fill="#1F1F23"/>`; for (let i = 0; i < n; i++) s += `<rect x="${20 + i * 26}" y="8" width="20" height="48" rx="4" fill="#E9B44C"/><rect x="${20 + i * 26}" y="8" width="20" height="14" rx="4" fill="#2B2D42"/>`; s += txt(W / 2 + 7, 62 + 9, BATT[k].label, 6, "#5C6B80", 'text-anchor="middle"'); H = 74; }
    s += hd.s;
    this.draw(W, H, s, hd.pins);
  }
  get volts() { return (BATT[this.getAttribute("kind") || "9V"] || BATT["9V"]).v; }
}
class ClVoltSensor extends CL {
  render() {
    const W = 84, H = 40, m = moduleBase(W, H, ["S", "+", "-"], "0-25V SENSOR", "#B5121B");
    let s = m.s + termBlock(W - 13, 15, 2, "#2A9D5C") + txt(W - 16, 17, "VCC", 4.6, "#fff", 'text-anchor="end"') + txt(W - 16, 26.6, "GND", 4.6, "#fff", 'text-anchor="end"') + smd(34, 10) + smd(34, 24);
    this.draw(W, H, s, m.pins.concat([{ name: "VIN", x: W, y: 15 }, { name: "GIN", x: W, y: 15 + P }]));
  }
}
class ClL298n extends CL {
  render() {
    const W = 140, H = 150;
    let s = pcb(0, 0, W, H, "#C8102E", 6) + mount(W - 7, 7) + mount(W - 7, H - 7);
    s += `<rect x="52" y="34" width="56" height="64" rx="3" fill="#2B2D42"/>`;
    for (let i = 0; i < 8; i++) s += `<rect x="${55 + i * 6.6}" y="28" width="3.2" height="76" fill="#3E4053"/>`;
    s += txt(80, 70, "L298N", 10, "#fff", 'text-anchor="middle" font-weight="700"');
    const left = ["12V", "GND", "5V", "ENA", "IN1", "IN2", "IN3", "IN4", "ENB"], y0 = 20;
    let pins = [];
    s += termBlock(1, y0, 3);
    s += `<rect x="2" y="${y0 + 3 * P - P / 2}" width="7" height="${6 * P}" rx="1" fill="#1A1A1A"/>`;
    left.forEach((n, i) => { const y = y0 + i * P; if (i >= 3) s += `<rect x="-3" y="${y - 1}" width="9" height="2" rx=".5" fill="#D6B656"/><rect x="4" y="${y - 1.6}" width="3.2" height="3.2" fill="#C9A227"/>`; s += txt(16, y + 2, n, 5.4, "#fff"); pins.push({ name: n, x: 0, y }); });
    s += termBlock(W - 13, 26, 2) + termBlock(W - 13, 96, 2);
    s += txt(W - 16, 18, "MOTOR A", 5.5, "#fff", 'text-anchor="end"') + txt(W - 16, 88, "MOTOR B", 5.5, "#fff", 'text-anchor="end"');
    [["OUT1", 26], ["OUT2", 26 + P], ["OUT3", 96], ["OUT4", 96 + P]].forEach(([n, y]) => { s += txt(W - 16, y + 2, n, 4.6, "#FFD7DC", 'text-anchor="end"'); pins.push({ name: n, x: W, y }); });
    s += ledDot("pwr", 30, H - 12, "#FF4D6D", 3) + txt(36, H - 10, "PWR", 5, "#FFD7DC");
    this.draw(W, H, s, pins);
  }
  set powered(v) { this.led("pwr", v); }
}
class ClDcMotor extends CL {
  render() {
    const W = 120, H = 70, hd = leftHeader(["M1", "M2"], 40);
    let s = `<rect x="12" y="24" width="64" height="30" rx="5" fill="#F2C230" stroke="#9C7A0E"/><rect x="74" y="30" width="10" height="18" rx="2" fill="#E0E3EA" stroke="#8D93A3"/>` + hd.s;
    s += `<g class="wheel" style="transform-origin:96px 39px"><circle cx="96" cy="39" r="23" fill="#2B2D42"/><circle cx="96" cy="39" r="16" fill="#F5F7FB"/>`;
    for (let i = 0; i < 6; i++) { const a = i * Math.PI / 3; s += `<line x1="96" y1="39" x2="${96 + 15 * Math.cos(a)}" y2="${39 + 15 * Math.sin(a)}" stroke="#6B7589" stroke-width="2"/>`; }
    s += `<circle cx="96" cy="39" r="4" fill="#E8590C"/></g>` + txt(44, 43, "TT MOTOR", 7, "#5C4500", 'text-anchor="middle" font-weight="700"');
    s += `<text class="rpm" x="44" y="16" font-size="7.5" text-anchor="middle" fill="#55596B" ${F}></text>`;
    this.draw(W, H, s, hd.pins); this._a = 0; this.speed = 0;
  }
  spin(dt) { const w = this.q(".wheel"); if (!w) return; this._a = (this._a + this.speed * 720 * dt) % 360; w.style.transform = `rotate(${this._a}deg)`; const r = this.q(".rpm"); if (r) r.textContent = this.speed ? `${Math.round(Math.abs(this.speed) * 200)} rpm ${this.speed > 0 ? "↻" : "↺"}` : ""; }
}
class ClCapacitor extends CL {
  static get observedAttributes() { return ["value"]; }
  render() {
    const v = this.getAttribute("value") || "100uF";
    let s = `<line x1="0" y1="34" x2="0" y2="22" stroke="#A9AEB8" stroke-width="1.6"/><line x1="${P}" y1="34" x2="${P}" y2="22" stroke="#A9AEB8" stroke-width="1.6"/><rect x="-4" y="0" width="${P + 8}" height="24" rx="4" fill="#1F4FA8"/><rect x="${P}" y="0" width="4" height="24" fill="#B9C7E8" opacity=".7"/>` + txt(P / 2, 15, v.replace("uF", "µ"), 5, "#fff", 'text-anchor="middle"');
    this.draw(P, 34, s, [{ name: "+", x: 0, y: 34 }, { name: "-", x: P, y: 34 }]);
  }
}

const DEFS = {
  "cl-breadboard": ClBreadboard, "cl-resistor": ClResistor, "cl-oled": ClOled, "cl-ldr": ClLdr, "cl-soil": ClSoil, "cl-rain": ClRain, "cl-gas": ClGas,
  "cl-flame": ClFlame, "cl-sound": ClSound, "cl-irline": ClIrLine, "cl-ir-obstacle": ClIrObstacle, "cl-pulse": ClPulse, "cl-vibe": ClVibe, "cl-relay": ClRelay,
  "cl-lamp": ClLamp, "cl-fan": ClFan, "cl-pump": ClPump, "cl-hc05": ClHc05, "cl-rfid": ClRfid, "cl-tcs": ClTcs, "cl-ina219": ClIna219, "cl-hx711": ClHx711,
  "cl-max7219": ClMax7219, "cl-stepper28": ClStepper28, "cl-mpu": ClMpu, "cl-ledstrip": ClLedStrip, "cl-solar": ClSolar, "cl-battery": ClBattery,
  "cl-voltsensor": ClVoltSensor, "cl-l298n": ClL298n, "cl-dcmotor": ClDcMotor, "cl-capacitor": ClCapacitor,
};
Object.entries(DEFS).forEach(([t, c]) => { if (!customElements.get(t)) customElements.define(t, c); });
export { BATT };
