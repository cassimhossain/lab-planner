/* Circuit Lab - chips, drivers and multi-digit displays (round 2). */
import { P, KIT, defineEls } from "./elements.js?v=11";
const { CL, txt, pcb, smd, chip, leftHeader, bottomHeader, termBlock, ledDot, mount, moduleBase, modGuts, F, MONO } = KIT;
const DEFS = {};

/* ---------- a real DIP chip: pins 1..n/2 down the left, n..n/2+1 down the right ---------- */
class ClDip extends CL {
  static get observedAttributes() { return ["names", "label", "sub"]; }
  render() {
    const names = (this.getAttribute("names") || "1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16").split(",");
    const n = names.length, half = n / 2, GAP = 3 * P, W = GAP, H = half * P + P;
    const label = this.getAttribute("label") || "74HC595", sub = this.getAttribute("sub") || "";
    let s = `<rect x="2" y="2" width="${W - 4}" height="${H - 4}" rx="2" fill="#1C1C20"/><rect x="3.4" y="3.4" width="${W - 6.8}" height="${H - 6.8}" rx="1.5" fill="none" stroke="rgba(255,255,255,.07)"/>`;
    s += `<path d="M${W / 2 - 5} 2 a5 5 0 0 0 10 0" fill="#111"/><circle cx="8" cy="${H - 8}" r="2" fill="#2E3238"/>`;
    const pins = [];
    for (let i = 0; i < half; i++) {
      const y = P / 2 + P * (i + 0.5);
      s += `<rect x="-3" y="${y - 1}" width="8" height="2" rx=".5" fill="#C9CED8"/>` + txt(7, y + 1.8, names[i], 4.2, "#8E949E");
      pins.push({ name: names[i], x: 0, y });
      const j = n - 1 - i;
      s += `<rect x="${W - 5}" y="${y - 1}" width="8" height="2" rx=".5" fill="#C9CED8"/>` + txt(W - 7, y + 1.8, names[j], 4.2, "#8E949E", 'text-anchor="end"');
      pins.push({ name: names[j], x: W, y });
    }
    s += `<g transform="rotate(-90 ${W / 2} ${H / 2})">` + txt(W / 2, H / 2 - 1, label, 6.6, "#E6E8EC", 'text-anchor="middle" font-weight="700"') + (sub ? txt(W / 2, H / 2 + 6, sub, 4.6, "#8E949E", 'text-anchor="middle"') : "") + `</g>`;
    this.draw(W, H, s, pins);
  }
}
DEFS["cl-dip"] = ClDip;

/* ---------- TO-220 power device (MOSFET, voltage regulator) ---------- */
class ClTo220 extends CL {
  static get observedAttributes() { return ["label", "p1", "p2", "p3"]; }
  render() {
    const g = n => this.getAttribute(n);
    const names = [g("p1") || "G", g("p2") || "D", g("p3") || "S"], W = P * 2 + 12, H = 44, cx = W / 2;
    let s = `<rect x="${cx - 13}" y="8" width="26" height="22" rx="2" fill="#2A2D33"/><rect x="${cx - 13}" y="0" width="26" height="9" rx="1.5" fill="#B9BEC8"/><circle cx="${cx}" cy="4.5" r="2.6" fill="#8E949E"/>`;
    s += txt(cx, 22, g("label") || "IRF520", 4.6, "#D6D9DE", 'text-anchor="middle" font-weight="700"');
    const pins = names.map((n, i) => { const x = cx - P + i * P; s += `<line x1="${x}" y1="29" x2="${x}" y2="${H}" stroke="#B9BEC8" stroke-width="1.8"/>` + txt(x, 37, n, 4.2, "#6B7280", 'text-anchor="middle"'); return { name: n, x, y: H }; });
    this.draw(W, H, s, pins);
  }
}
DEFS["cl-to220"] = ClTo220;

/* ---------- diode ---------- */
class ClDiode extends CL {
  static get observedAttributes() { return ["label"]; }
  render() {
    const W = P * 4, H = 14, y = H / 2;
    let s = `<line x1="0" y1="${y}" x2="${W}" y2="${y}" stroke="#A9AEB8" stroke-width="1.6"/>`;
    s += `<rect x="${W / 2 - 9}" y="${y - 5}" width="18" height="10" rx="1.5" fill="#1F1A14"/><rect x="${W / 2 + 4}" y="${y - 5}" width="3.4" height="10" fill="#D8DCE2"/>`;
    s += txt(W / 2 - 2, y + 2.2, this.getAttribute("label") || "1N4007", 3.6, "#C9A227", 'text-anchor="middle"');
    this.draw(W, H, s, [{ name: "A", x: 0, y }, { name: "K", x: W, y }]);
  }
}
DEFS["cl-diode"] = ClDiode;

/* ---------- 4-digit 7-segment display ---------- */
const SEGP = (x, y, k) => {
  // seven segments of one digit, drawn as slim hexagons. k = scale
  const w = 13 * k, h = 11 * k, t = 2.2 * k, g = 1.1 * k;
  const hseg = (sx, sy) => `M${sx + t / 2 + g} ${sy} l${t / 2} ${-t / 2} h${w - t - 2 * g} l${t / 2} ${t / 2} l${-t / 2} ${t / 2} h${-(w - t - 2 * g)} z`;
  const vseg = (sx, sy) => `M${sx} ${sy + t / 2 + g} l${t / 2} ${-t / 2} l${t / 2} ${t / 2} v${h - t - 2 * g} l${-t / 2} ${t / 2} l${-t / 2} ${-t / 2} z`;
  return {
    A: hseg(x, y), B: vseg(x + w - t, y), C: vseg(x + w - t, y + h), D: hseg(x, y + 2 * h), E: vseg(x, y + h), F: vseg(x, y), G: hseg(x, y + h),
    DP: `M${x + w + 2 * k} ${y + 2 * h - 1.5 * k} h${2.6 * k} v${2.6 * k} h${-2.6 * k} z`,
  };
};
class ClSeg4 extends CL {
  static get observedAttributes() { return ["color", "digits"]; }
  render() {
    const N = +(this.getAttribute("digits") || 4), k = 1.5, dw = 20 * k, W = Math.max(N * dw + 16, (N * 2 + 4) * P), H = 46;
    const on = { red: "#FF3B30", green: "#38E07B", blue: "#49B6FF", white: "#F2F6FF" }[this.getAttribute("color") || "red"] || "#FF3B30";
    let s = `<rect x="0" y="0" width="${W}" height="${H}" rx="3" fill="#15161A"/><rect x="4" y="4" width="${W - 8}" height="${H - 16}" rx="2" fill="#0A0B0D"/>`;
    this._on = on; this._paths = [];
    for (let d = 0; d < N; d++) {
      const segs = SEGP(10 + d * dw, 9, k * 0.8);
      s += `<g class="d${d}">` + Object.entries(segs).map(([n, p]) => `<path class="s-${n}" d="${p}" fill="${on}" opacity=".05"/>`).join("") + `</g>`;
    }
    // pins: segments on top, digit commons on the bottom
    const names = ["A", "B", "C", "D", "E", "F", "G", "DP"];
    let pins = [];
    const x0 = (W - (names.length - 1) * P) / 2;
    names.forEach((n, i) => { const x = x0 + i * P; s += `<rect x="${x - 1}" y="-4" width="2" height="8" rx=".5" fill="#D6B656"/>` + txt(x, 10, "", 4); pins.push({ name: n, x, y: 0 }); });
    const x1 = (W - (N - 1) * P) / 2;
    for (let d = 0; d < N; d++) { const x = x1 + d * P; s += `<rect x="${x - 1}" y="${H - 4}" width="2" height="8" rx=".5" fill="#D6B656"/>` + txt(x, H - 6, "D" + (d + 1), 4.2, "#8E949E", 'text-anchor="middle"'); pins.push({ name: "D" + (d + 1), x, y: H }); }
    this.draw(W, H, s, pins);
  }
  /* brightness per digit per segment, 0..1 */
  setFrame(vals) {
    const N = +(this.getAttribute("digits") || 4), names = ["A", "B", "C", "D", "E", "F", "G", "DP"];
    for (let d = 0; d < N; d++) {
      const g = this.q(".d" + d); if (!g) continue;
      names.forEach((n, i) => { const e = g.querySelector(".s-" + n); if (e) e.setAttribute("opacity", (0.05 + 0.95 * Math.min(1, (vals[d] ? vals[d][i] : 0) * 2.2)).toFixed(2)); });
    }
  }
  clOff() { this.setFrame([]); }
}
DEFS["cl-seg4"] = ClSeg4;

/* ---------- TM1637 4-digit module ---------- */
class ClTm1637 extends CL {
  render() {
    const k = 1.5, W = 118, H = 52;
    let s = pcb(0, 0, W, H, "#1B2430", 4) + mount(7, 7) + mount(W - 7, 7);
    s += `<rect x="12" y="10" width="94" height="30" rx="2" fill="#0A0B0D"/>`;
    for (let d = 0; d < 4; d++) {
      const segs = SEGP(16 + d * 23 + (d > 1 ? 6 : 0), 13, k * 0.75);
      s += `<g class="d${d}">` + Object.entries(segs).map(([n, p]) => `<path class="s-${n}" d="${p}" fill="#FF3B30" opacity=".05"/>`).join("") + `</g>`;
    }
    s += `<g class="colon" opacity=".05"><circle cx="59" cy="21" r="1.8" fill="#FF3B30"/><circle cx="59" cy="31" r="1.8" fill="#FF3B30"/></g>`;
    const names = ["CLK", "DIO", "VCC", "GND"], x0 = (W - 3 * P) / 2, pins = [];
    names.forEach((n, i) => { const x = x0 + i * P; s += `<rect x="${x - 1}" y="${H - 4}" width="2" height="8" rx=".5" fill="#D6B656"/>` + txt(x, H - 7, n, 4.2, "#9DB4DA", 'text-anchor="middle"'); pins.push({ name: n, x, y: H }); });
    this.draw(W, H, s, pins);
  }
  /* digits: array of 4 segment bitmasks (bit0=A .. bit6=G, bit7=colon on digit 1) */
  setDigits(d, bright = 1) {
    const names = ["A", "B", "C", "D", "E", "F", "G"];
    for (let i = 0; i < 4; i++) {
      const g = this.q(".d" + i); if (!g) continue;
      names.forEach((n, b) => { const e = g.querySelector(".s-" + n); if (e) e.setAttribute("opacity", ((d[i] >> b) & 1 ? 0.15 + 0.85 * bright : 0.05).toFixed(2)); });
    }
    const c = this.q(".colon"); if (c) c.setAttribute("opacity", (d[1] & 0x80) ? (0.15 + 0.85 * bright).toFixed(2) : ".05");
  }
  clOff() { this.setDigits([0, 0, 0, 0]); }
}
DEFS["cl-tm1637"] = ClTm1637;

/* ---------- A4988 stepper driver ---------- */
class ClA4988 extends CL {
  render() {
    const left = ["EN", "MS1", "MS2", "MS3", "RST", "SLP", "STEP", "DIR"], right = ["VMOT", "GND2", "2B", "2A", "1A", "1B", "VDD", "GND"];
    const W = 8 * P, H = 8 * P + P, pins = [];
    let s = pcb(0, 0, W, H, "#1B6B3A", 4);
    s += chip(W / 2 - 11, H / 2 - 11, 22, 22, "A4988", 5) + `<rect x="${W / 2 - 4}" y="10" width="8" height="8" rx="1.5" fill="#2E7DE0"/><circle cx="${W / 2}" cy="14" r="2.6" fill="#E9EDF3"/>`;
    s += smd(10, H - 22, 8, 4) + smd(W - 18, H - 22, 8, 4);
    left.forEach((n, i) => { const y = P + i * P; s += `<rect x="-3" y="${y - 1}" width="8" height="2" rx=".5" fill="#D6B656"/>` + txt(7, y + 1.8, n, 4.4, "#D7F0DF"); pins.push({ name: n, x: 0, y }); });
    right.forEach((n, i) => { const y = P + i * P; s += `<rect x="${W - 5}" y="${y - 1}" width="8" height="2" rx=".5" fill="#D6B656"/>` + txt(W - 7, y + 1.8, n, 4.4, "#D7F0DF", 'text-anchor="end"'); pins.push({ name: n, x: W, y }); });
    this.draw(W, H, s, pins);
  }
}
DEFS["cl-a4988"] = ClA4988;

/* ---------- MAX7219 4-in-1 matrix (32 x 8) ---------- */
class ClMax7219x4 extends CL {
  static get observedAttributes() { return ["blocks"]; }
  render() {
    const N = +(this.getAttribute("blocks") || 4), D = 7, W = N * 8 * D + 16, H = 8 * D + 26, pins = [];
    let s = pcb(0, 0, W, H, "#15161A", 4);
    this._n = N * 8;
    for (let x = 0; x < N * 8; x++) for (let y = 0; y < 8; y++) s += `<circle class="p${x}_${y}" cx="${8 + x * D + D / 2}" cy="${8 + y * D + D / 2}" r="${D * 0.33}" fill="#3A1414"/>`;
    const names = ["VCC", "GND", "DIN", "CS", "CLK"], x0 = 10;
    names.forEach((n, i) => { const x = x0 + i * P; s += `<rect x="${x - 1}" y="${H - 4}" width="2" height="8" rx=".5" fill="#D6B656"/>` + txt(x, H - 7, n, 4.2, "#9DB4DA", 'text-anchor="middle"'); pins.push({ name: n, x, y: H }); });
    this.draw(W, H, s, pins);
  }
  /* cols: array of column bitmasks, bit0 = top row */
  setCols(cols) {
    const N = this._n || 32;
    for (let x = 0; x < N; x++) { const c = cols[x] | 0; for (let y = 0; y < 8; y++) { const e = this.q(`.p${x}_${y}`); if (e) e.setAttribute("fill", (c >> y) & 1 ? "#FF4330" : "#3A1414"); } }
  }
  clOff() { this.setCols([]); }
}
DEFS["cl-max7219x4"] = ClMax7219x4;

defineEls(DEFS);
export { DEFS as DEFS3 };
