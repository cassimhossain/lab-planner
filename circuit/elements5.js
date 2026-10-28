/* Circuit Lab - round 3 artwork: bridge rectifier, inductor and a lever limit switch.
   Pins stay on the 0.1 inch (9.6 px) grid like every other part. */
import { P, KIT, defineEls } from "./elements.js?v=19";
const { CL, txt } = KIT;
const DEFS = {};

/* ---------- bridge rectifier: two AC legs in, DC out ---------- */
class ClBridge extends CL {
  static get observedAttributes() { return ["label"]; }
  render() {
    const W = P * 4, H = 34, cx = W / 2;
    let s = `<rect x="${cx - 15}" y="4" width="30" height="20" rx="4" fill="#1B1B1F"/>`;
    s += `<rect x="${cx - 13.5}" y="5.5" width="27" height="17" rx="3" fill="none" stroke="rgba(255,255,255,.08)"/>`;
    s += txt(cx, 12.5, this.getAttribute("label") || "KBP206", 4.2, "#D8DBE2", 'text-anchor="middle" font-weight="700"');
    s += txt(cx, 19.5, "~ ~ + -", 4, "#8E949E", 'text-anchor="middle"');
    const names = ["AC1", "AC2", "+", "-"], x0 = (W - 3 * P) / 2;
    const pins = names.map((n, i) => {
      const x = x0 + i * P;
      s += `<line x1="${x}" y1="23" x2="${x}" y2="${H}" stroke="#B9BEC8" stroke-width="1.6"/>`;
      s += txt(x, 31, n, 3.4, n === "+" ? "#E63946" : n === "-" ? "#2E6BE6" : "#8E949E", 'text-anchor="middle"');
      return { name: n, x, y: H };
    });
    this.draw(W, H, s, pins);
  }
}
DEFS["cl-bridge"] = ClBridge;

/* ---------- inductor: a coil that resists a change in current ---------- */
class ClInductor extends CL {
  static get observedAttributes() { return ["label"]; }
  render() {
    const W = P * 4, H = 16, y = H / 2, r = 4.2, n = 4, span = r * 2 * n, x0 = (W - span) / 2;
    let s = `<line x1="0" y1="${y}" x2="${x0}" y2="${y}" stroke="#A9AEB8" stroke-width="1.6"/>`;
    s += `<line x1="${x0 + span}" y1="${y}" x2="${W}" y2="${y}" stroke="#A9AEB8" stroke-width="1.6"/>`;
    let d = `M${x0} ${y}`;
    for (let i = 0; i < n; i++) d += ` a${r} ${r} 0 0 1 ${r * 2} 0`;
    s += `<path d="${d}" fill="none" stroke="#5B6472" stroke-width="2.1" stroke-linecap="round"/>`;
    s += txt(W / 2, y + 7.4, this.getAttribute("label") || "100 µH", 3.4, "#8E949E", 'text-anchor="middle"');
    this.draw(W, H, s, [{ name: "1", x: 0, y }, { name: "2", x: W, y }]);
  }
}
DEFS["cl-inductor"] = ClInductor;

/* ---------- lever limit switch: COM plus a normally-open and a normally-closed contact ---------- */
class ClLimitSw extends CL {
  static get observedAttributes() { return ["pressed", "label"]; }
  render() {
    const W = P * 4, H = 32, bx = (W - 3 * P) / 2 - 3;
    const on = this.getAttribute("pressed") === "true";
    let s = `<rect x="${bx}" y="10" width="${3 * P + 6}" height="14" rx="2" fill="#23262C"/>`;
    s += `<rect x="${bx + 1.2}" y="11.2" width="${3 * P + 3.6}" height="11.6" rx="1.5" fill="none" stroke="rgba(255,255,255,.07)"/>`;
    /* the lever swings down when the switch is hit */
    s += `<line class="lever" x1="${bx + 2}" y1="9" x2="${bx + 3 * P + 2}" y2="${on ? 8 : 2}" stroke="#C3C8D2" stroke-width="2" stroke-linecap="round"/>`;
    s += `<circle cx="${bx + 2}" cy="9" r="1.8" fill="#8E949E"/>`;
    s += txt(W / 2, 20, this.getAttribute("label") || "limit", 4, "#9AA1AC", 'text-anchor="middle"');
    const names = ["COM", "NO", "NC"], x0 = (W - 2 * P) / 2;
    const pins = names.map((n, i) => {
      const x = x0 + i * P;
      s += `<line x1="${x}" y1="23" x2="${x}" y2="${H}" stroke="#B9BEC8" stroke-width="1.6"/>`;
      s += txt(x, 31, n, 3.2, "#8E949E", 'text-anchor="middle"');
      return { name: n, x, y: H };
    });
    this.draw(W, H, s, pins);
  }
  set pressed(v) { this.setAttribute("pressed", v ? "true" : "false"); }
}
DEFS["cl-limitsw"] = ClLimitSw;

/* ---------- a logic chip that wears its own gate symbol ----------
   Same DIP body and pin order as cl-dip, but the standard IEEE symbol is printed
   large on the package. Sixteen black rectangles all look alike in the palette;
   an AND shape and an OR shape do not, and the student learns the notation free. */
const GLYPH = {
  AND:  'M2 2 h11 a10 10 0 0 1 0 20 h-11 z',
  OR:   'M1 2 q9 10 0 20 q14 0 21 -10 q-7 -10 -21 -10 z',
  XOR:  'M5 2 q9 10 0 20 q14 0 21 -10 q-7 -10 -21 -10 z',
  NOT:  'M2 2 l18 10 l-18 10 z',
  BUF:  'M2 2 l18 10 l-18 10 z',
};
const GLYPH_W = { AND: 23, OR: 22, XOR: 26, NOT: 20, BUF: 20 };

class ClLogic extends CL {
  static get observedAttributes() { return ["names", "label", "sub"]; }
  render() {
    const names = (this.getAttribute("names") || "1,2,3,4,5,6,7,8,9,10,11,12,13,14").split(",");
    const n = names.length, half = n / 2, W = 3 * P, H = half * P + P;
    const label = this.getAttribute("label") || "74HC08", sub = (this.getAttribute("sub") || "AND").toUpperCase();
    const base = sub.replace(/^N/, "") === "AND" || sub === "NAND" ? "AND"
      : sub === "XOR" ? "XOR" : sub === "NOR" || sub === "OR" ? "OR" : sub === "NOT" ? "NOT" : "BUF";
    const bubble = sub === "NAND" || sub === "NOR" || sub === "NOT";

    let s = `<rect x="2" y="2" width="${W - 4}" height="${H - 4}" rx="2" fill="#1C1C20"/>`;
    s += `<rect x="3.4" y="3.4" width="${W - 6.8}" height="${H - 6.8}" rx="1.5" fill="none" stroke="rgba(255,255,255,.07)"/>`;
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

    /* The symbol is drawn flat, then scaled up and turned a quarter turn. Turned, its
       length runs down the 77 px package and its thickness across the 29 px width, so
       it can be far bigger than it looks on paper, and it still reads in the palette. */
    const K = 1.75, gw = GLYPH_W[base], gh = 24, cx = W / 2, cy = H / 2;
    const bw = (gw + (bubble ? 6 : 0)) * K, bh = gh * K;
    let g = `<path d="${GLYPH[base]}" fill="rgba(127,178,255,.13)" stroke="#8FBEFF" stroke-width="2.1" stroke-linejoin="round"/>`;
    if (base === "XOR") g += `<path d="M1 2 q9 10 0 20" fill="none" stroke="#8FBEFF" stroke-width="2.1"/>`;
    if (bubble) g += `<circle cx="${gw + 2}" cy="12" r="2.8" fill="#1C1C20" stroke="#8FBEFF" stroke-width="1.9"/>`;
    s += `<g transform="rotate(-90 ${cx} ${cy}) translate(${cx - bw / 2} ${cy - bh / 2}) scale(${K})">${g}</g>`;
    s += `<g transform="rotate(-90 ${cx} ${cy})">`
       + txt(cx, cy - 27, label, 5.6, "#E6E8EC", 'text-anchor="middle" font-weight="700"')
       + txt(cx, cy + 31, sub, 6.2, "#8FBEFF", 'text-anchor="middle" font-weight="800"')
       + `</g>`;
    this.draw(W, H, s, pins);
  }
}
DEFS["cl-logic"] = ClLogic;

defineEls(DEFS);
export { DEFS as DEFS5 };
