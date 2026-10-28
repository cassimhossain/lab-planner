/* Circuit Lab - second set of hand-drawn parts (SVG).
   Everything here is drawn for the simulator; pins sit on the 0.1 inch (9.6 px) grid like the rest. */
import { P, KIT, defineEls } from "./elements.js?v=19";
const { CL, txt, pcb, smd, chip, leftHeader, bottomHeader, termBlock, ledDot, mount, moduleBase, modGuts, F, MONO } = KIT;

const DEFS = {};
const def = (tag, cls) => { DEFS[tag] = cls; };

/* ---------- generic sensor / actuator module factory ----------
   names: pin names down the left edge. glyph(W,H): the bit that makes it recognisable.
   live: optional setter name -> function(el, value) that animates the drawing. */
function module(tag, { W, H, names, title, color = "#1F57A8", guts = null, glyph = () => "", leds = true, setters = {}, pinSide = "left" }) {
  class M extends CL {
    render() {
      const m = pinSide === "left" ? moduleBase(W, H, names, title, color) : (() => {
        let s = pcb(0, 0, W, H, color); const hd = bottomHeader(names, W / 2 - (names.length - 1) * P / 2, H);
        if (title) s += txt(W / 2, 12, title, 5.4, "rgba(255,255,255,.8)", 'text-anchor="middle"');
        return { s: s + hd.s, pins: hd.pins };
      })();
      let s = m.s;
      if (guts) s += modGuts(guts[0], guts[1]);
      if (leds) s += ledDot("pwr", leds[0] ?? 40, leds[1] ?? H - 12, "#FF3B3B") + ledDot("sig", (leds[0] ?? 40) + 10, leds[1] ?? H - 12, "#3CFF6B");
      s += glyph(W, H);
      this.draw(W, H, s, m.pins);
    }
    clOff() { this.led("pwr", false); this.led("sig", false); Object.keys(setters).forEach(k => { try { this[k] = setters[k].off; } catch (e) { } }); }
  }
  Object.entries(setters).forEach(([k, cfg]) => { Object.defineProperty(M.prototype, k, { set(v) { cfg.set(this, v); } }); });
  def(tag, M);
  return M;
}
const fade = (sel, max = 1) => ({ off: 0, set: (el, v) => { const n = el.q(sel); if (n) n.setAttribute("opacity", Math.max(0, Math.min(max, v)).toFixed(2)); } });
const setTxt = (sel, fmt = v => String(v)) => ({ off: "", set: (el, v) => { const n = el.q(sel); if (n) n.textContent = fmt(v); } });

/* ---------- TO-92 three-leg sensors on the breadboard (LM35, TMP36, hall, transistor) ---------- */
class ClTo92 extends CL {
  static get observedAttributes() { return ["label", "p1", "p2", "p3", "color"]; }
  render() {
    const g = n => this.getAttribute(n);
    const names = [g("p1") || "1", g("p2") || "2", g("p3") || "3"], body = g("color") || "#1A1A1A";
    const W = P * 2 + 8, H = 34, cx = W / 2;
    let s = `<path d="M${cx - 9} 16 a9 9 0 0 1 18 0 z" fill="${body}"/><rect x="${cx - 9}" y="14" width="18" height="4" fill="${body}"/>`;
    s += `<path d="M${cx - 9} 16 a9 9 0 0 1 18 0" fill="none" stroke="rgba(255,255,255,.18)"/>`;
    s += txt(cx, 11, g("label") || "LM35", 4.6, "#DDD", 'text-anchor="middle" font-weight="700"');
    const pins = names.map((n, i) => { const x = 4 + i * P; s += `<line x1="${x}" y1="17" x2="${x}" y2="${H}" stroke="#B9BEC8" stroke-width="1.5"/>`; return { name: n, x, y: H }; });
    this.draw(W, H, s, pins);
  }
}
def("cl-to92", ClTo92);

/* ---------- water level sensor ---------- */
module("cl-waterlevel", {
  W: 150, H: 74, names: ["VCC", "GND", "AO"], title: "", guts: [28, 6], leds: [32, 30],
  glyph: (W, H) => {
    let s = `<path d="M62 14 C74 14 76 10 86 10" stroke="#E63946" stroke-width="1.5" fill="none"/><path d="M62 24 C74 24 76 28 86 28" stroke="#2B2D42" stroke-width="1.5" fill="none"/>`;
    s += `<rect x="86" y="2" width="58" height="70" rx="3" fill="#1D4E2E"/>`;
    for (let i = 0; i < 10; i++) s += `<rect x="${92 + (i % 2) * 26}" y="${6 + i * 6.5}" width="24" height="3.4" rx="1.4" fill="#D9C46A"/>`;
    s += `<rect class="wl" x="86" y="72" width="58" height="0" fill="#3FA9F5" opacity=".55"/>`;
    s += txt(115, H - 1, "WATER LEVEL", 5, "#5C6B80", 'text-anchor="middle"');
    return s;
  },
  setters: { level: { off: 0, set: (el, v) => { const n = el.q(".wl"); if (!n) return; const h = Math.max(0, Math.min(70, v * 0.7)); n.setAttribute("y", 72 - h); n.setAttribute("height", h); } } },
});

/* ---------- water flow sensor YF-S201 ---------- */
class ClFlow extends CL {
  render() {
    const W = 150, H = 62, hd = leftHeader(["VCC", "GND", "SIG"], H / 2 - P, 14, "#fff");
    let s = pcb(0, 0, 40, H, "#2E3440", 5) + hd.s;
    s += `<rect x="40" y="10" width="96" height="42" rx="8" fill="#B01B2E"/><rect x="34" y="18" width="12" height="26" rx="3" fill="#8E1424"/><rect x="130" y="18" width="18" height="26" rx="3" fill="#8E1424"/>`;
    s += `<circle cx="88" cy="31" r="15" fill="#161A20" opacity=".35"/>`;
    s += `<g class="imp" transform="translate(88 31)">${[0, 60, 120, 180, 240, 300].map(a => `<rect x="-1.6" y="-14" width="3.2" height="12" rx="1.4" fill="#E9EDF3" transform="rotate(${a})"/>`).join("")}<circle r="3" fill="#C9CED8"/></g>`;
    s += txt(88, 58, "YF-S201 FLOW", 5.2, "#FFD9DE", 'text-anchor="middle"');
    this.draw(W, H, s, hd.pins);
    this._a = 0;
  }
  set spin(v) { this._a = (this._a + v) % 360; const g = this.q(".imp"); if (g) g.setAttribute("transform", `translate(88 31) rotate(${this._a.toFixed(1)})`); }
  clOff() { }
}
def("cl-flow", ClFlow);

/* ---------- hall effect module ---------- */
module("cl-hall", {
  W: 104, H: 46, names: ["VCC", "GND", "DO", "AO"], title: "HALL A3144", guts: [34, 6], leds: [52, 30],
  glyph: () => `<path d="M80 14 a8 8 0 0 1 16 0 v12 h-16 z" fill="#1A1A1A"/>` + txt(88, 24, "H", 6, "#CFCFCF", 'text-anchor="middle"') +
    `<g class="mag" opacity="0" transform="translate(100 30)"><rect x="-4" y="-9" width="8" height="9" fill="#E63946"/><rect x="-4" y="0" width="8" height="9" fill="#2B6CB0"/></g>`,
  setters: { magnet: fade(".mag") },
});

/* ---------- capacitive touch TTP223 ---------- */
module("cl-touch", {
  W: 92, H: 44, names: ["VCC", "GND", "SIG"], title: "TTP223", guts: null, leds: [34, 32],
  glyph: () => `${chip(30, 6, 10, 9, "", 4)}<rect x="56" y="6" width="30" height="30" rx="4" fill="#C9A227" opacity=".5"/><rect x="60" y="10" width="22" height="22" rx="3" fill="#E8C95A"/>` +
    `<g class="tap" opacity="0" transform="translate(71 21)"><circle r="12" fill="none" stroke="#fff" stroke-width="1.6" opacity=".8"/><circle r="6" fill="#fff" opacity=".5"/></g>`,
  setters: { touched: fade(".tap") },
});

/* ---------- reed switch module ---------- */
module("cl-reed", {
  W: 118, H: 44, names: ["VCC", "GND", "DO"], title: "REED SWITCH", guts: [30, 6], leds: [48, 30],
  glyph: () => `<rect x="70" y="14" width="34" height="13" rx="6.5" fill="#D9E4F5" opacity=".65" stroke="#9AA6BB" stroke-width=".7"/>` +
    `<line x1="64" y1="20.5" x2="78" y2="20.5" stroke="#9BA0AA" stroke-width="1.4"/><line x1="96" y1="20.5" x2="112" y2="20.5" stroke="#9BA0AA" stroke-width="1.4"/>` +
    `<path class="blade" d="M78 20.5 h9 l6 -3" stroke="#6B7280" stroke-width="1.6" fill="none"/>` +
    `<g class="mag" opacity="0" transform="translate(88 38)"><rect x="-9" y="-4" width="9" height="8" fill="#E63946"/><rect x="0" y="-4" width="9" height="8" fill="#2B6CB0"/></g>`,
  setters: {
    magnet: {
      off: 0, set: (el, v) => {
        const m = el.q(".mag"), b = el.q(".blade"); if (m) m.setAttribute("opacity", v ? 1 : 0);
        if (b) b.setAttribute("d", v ? "M78 20.5 h15" : "M78 20.5 h9 l6 -3");
      }
    }
  },
});

/* ---------- knock sensor (piezo) ---------- */
module("cl-knock", {
  W: 104, H: 44, names: ["VCC", "GND", "DO"], title: "KNOCK KY-031", guts: [30, 6], leds: [48, 30],
  glyph: () => `<rect x="72" y="10" width="12" height="22" rx="2" fill="#2E3440"/><circle cx="92" cy="21" r="9" fill="#C9A227"/><circle cx="92" cy="21" r="5.5" fill="#E8C95A"/>` +
    `<g class="hit" opacity="0"><path d="M92 4 l3 6 -5 -1 4 7" stroke="#FFD166" stroke-width="1.6" fill="none"/></g>`,
  setters: { knock: fade(".hit") },
});

/* ---------- vibration switch SW-420 ---------- */
module("cl-vibsw", {
  W: 104, H: 44, names: ["VCC", "GND", "DO"], title: "SW-420 VIBRATION", guts: [30, 6], leds: [48, 30],
  glyph: () => `<rect x="74" y="12" width="10" height="18" rx="2" fill="#2E3440"/><g class="spr" transform="translate(88 21)"><path d="M0 -8 q6 2 0 4 q-6 2 0 4 q6 2 0 4 q-6 2 0 4" stroke="#C9CED8" stroke-width="1.4" fill="none"/></g>`,
  setters: { shake: { off: 0, set: (el, v) => { const g = el.q(".spr"); if (g) g.setAttribute("transform", `translate(${88 + (v ? (Math.random() - .5) * 4 : 0)} 21)`); } } },
});

/* ---------- force sensor (FSR) module ---------- */
module("cl-fsr", {
  W: 148, H: 58, names: ["VCC", "GND", "AO"], title: "", guts: [28, 6], leds: [32, 30],
  glyph: (W, H) => `<path d="M60 16 C72 16 76 14 86 14" stroke="#E63946" stroke-width="1.5" fill="none"/><path d="M60 26 C72 26 76 28 86 28" stroke="#2B2D42" stroke-width="1.5" fill="none"/>` +
    `<rect x="84" y="4" width="60" height="50" rx="4" fill="#3A3F47"/><circle cx="116" cy="29" r="19" fill="#1A1D22"/><circle class="press" cx="116" cy="29" r="0" fill="#FF8A1F" opacity=".7"/>` +
    txt(116, 52, "FSR", 5.2, "#B9BEC8", 'text-anchor="middle"'),
  setters: { force: { off: 0, set: (el, v) => { const n = el.q(".press"); if (n) n.setAttribute("r", (Math.max(0, Math.min(1, v)) * 17).toFixed(1)); } } },
});

/* ---------- flex sensor ---------- */
module("cl-flex", {
  W: 168, H: 54, names: ["VCC", "GND", "AO"], title: "", guts: [28, 6], leds: [32, 30],
  glyph: () => `<path class="strip" d="M62 20 h100" stroke="#2E3440" stroke-width="9" stroke-linecap="round" fill="none"/>` +
    `<path class="strip2" d="M62 20 h100" stroke="#C9A227" stroke-width="2.4" stroke-dasharray="3 3" fill="none"/>` + txt(112, 40, "FLEX SENSOR", 5.2, "#5C6B80", 'text-anchor="middle"'),
  setters: {
    bend: {
      off: 0, set: (el, v) => {
        const d = v <= 0 ? "M62 20 h100" : `M62 20 q50 ${-v * 0.3} 100 ${-v * 0.16}`;
        [".strip", ".strip2"].forEach(s => { const n = el.q(s); if (n) n.setAttribute("d", d); });
      }
    }
  },
});

/* ---------- UV sensor ---------- */
module("cl-uv", {
  W: 100, H: 44, names: ["VCC", "GND", "AO"], title: "UV GUVA-S12SD", guts: [30, 6], leds: [46, 30],
  glyph: () => `<rect x="74" y="13" width="16" height="16" rx="2" fill="#2A2E36"/><circle cx="82" cy="21" r="5" fill="#8E7CC3"/>` +
    `<g class="ray" opacity="0" stroke="#C4B5FD" stroke-width="1.3">${[0, 45, 90, 135, 180, 225, 270, 315].map(a => `<line x1="0" y1="7" x2="0" y2="11" transform="translate(82 21) rotate(${a})"/>`).join("")}</g>`,
  setters: { uv: fade(".ray") },
});

/* ---------- Sharp IR distance sensor ---------- */
class ClSharpIr extends CL {
  render() {
    const W = 170, H = 60, hd = leftHeader(["VCC", "GND", "AO"], H / 2 - P, 14);
    let s = pcb(0, 0, 36, H, "#2E3440", 5) + hd.s;
    s += `<rect x="36" y="8" width="60" height="44" rx="4" fill="#2B2D42"/><circle cx="54" cy="30" r="11" fill="#1A1A1A" stroke="#444"/><circle cx="54" cy="30" r="7" fill="#101418"/>`;
    s += `<circle cx="80" cy="30" r="11" fill="#D9E2F1" stroke="#777"/><circle cx="80" cy="30" r="7" fill="#F2F6FF"/>`;
    s += txt(66, 50, "GP2Y0A21", 5, "#CBD5E1", 'text-anchor="middle"');
    s += `<g class="obj" transform="translate(150 30)"><rect x="-5" y="-16" width="10" height="32" rx="2" fill="#8A5A00"/></g>`;
    s += `<path class="beam" d="M96 24 L150 16 L150 44 L96 36 z" fill="#E63946" opacity=".12"/>`;
    this.draw(W, H, s, hd.pins);
  }
  set dist(v) { const o = this.q(".obj"), b = this.q(".beam"); const x = 104 + Math.max(0, Math.min(80, (v - 10) * 0.75)); if (o) o.setAttribute("transform", `translate(${x} 30)`); if (b) b.setAttribute("d", `M96 24 L${x - 6} ${30 - (x - 96) * .18} L${x - 6} ${30 + (x - 96) * .18} L96 36 z`); }
  clOff() { }
}
def("cl-sharpir", ClSharpIr);

/* ---------- ACS712 current sensor ---------- */
class ClAcs extends CL {
  render() {
    const W = 126, H = 72, hd = leftHeader(["VCC", "GND", "OUT"], H / 2 - P, 14);
    let s = pcb(0, 0, W, H, "#0E7490", 5) + hd.s + chip(44, 26, 18, 16, "712", 4);
    s += termBlock(W - 26, 22, 2, "#1F6FD1");
    s += txt(W - 32, 16, "LOAD", 5.2, "#CFF4FF", 'text-anchor="end"') + txt(50, 62, "ACS712 30A", 5.4, "#CFF4FF");
    s += ledDot("pwr", 34, 60, "#FF3B3B");
    s += `<text class="rd" x="${W - 34}" y="62" font-size="6.4" fill="#E8FBFF" ${MONO} text-anchor="end">0.00 A</text>`;
    this.draw(W, H, s, hd.pins.concat([{ name: "IP+", x: W - 20, y: 22 }, { name: "IP-", x: W - 20, y: 22 + P }]));
  }
  set reading(v) { const n = this.q(".rd"); if (n) n.textContent = v; }
  clOff() { this.led("pwr", false); this.reading = "0.00 A"; }
}
def("cl-acs712", ClAcs);

/* ---------- laser module KY-008 ---------- */
class ClLaser extends CL {
  render() {
    const W = 120, H = 40, hd = leftHeader(["S", "VCC", "GND"], H / 2 - P, 13);
    let s = pcb(0, 0, 34, H, "#1F57A8", 4) + hd.s;
    s += `<rect x="34" y="12" width="26" height="16" rx="3" fill="#C9CED8"/><rect x="60" y="14" width="10" height="12" rx="2" fill="#9BA0AA"/><circle cx="71" cy="20" r="4" fill="#4A1A1A" class="dot" data-on="#FF2D2D"/>`;
    s += `<rect class="beam" x="74" y="18.6" width="44" height="2.8" rx="1.4" fill="#FF2D2D" opacity="0"/>`;
    s += txt(46, 36, "KY-008", 4.6, "#CFE0FF");
    this.draw(W, H, s, hd.pins);
  }
  set on(v) { this.led("dot", v); const b = this.q(".beam"); if (b) b.setAttribute("opacity", v ? ".85" : "0"); }
  clOff() { this.on = false; }
}
def("cl-laser", ClLaser);

/* ---------- solenoid ---------- */
class ClSolenoid extends CL {
  render() {
    const W = 130, H = 46;
    let s = `<rect x="18" y="10" width="62" height="28" rx="4" fill="#3A3F47"/>`;
    for (let i = 0; i < 9; i++) s += `<line x1="${22 + i * 6.6}" y1="10" x2="${22 + i * 6.6}" y2="38" stroke="#C9A227" stroke-width="2.6"/>`;
    s += `<rect class="rod" x="78" y="20" width="44" height="8" rx="2" fill="#C9CED8"/><rect class="cap" x="118" y="14" width="8" height="20" rx="2" fill="#9BA0AA"/>`;
    s += `<line x1="4" y1="18" x2="18" y2="18" stroke="#E63946" stroke-width="1.6"/><line x1="4" y1="30" x2="18" y2="30" stroke="#2B2D42" stroke-width="1.6"/>`;
    s += txt(49, 44, "SOLENOID 12V", 5, "#5C6B80", 'text-anchor="middle"');
    this.draw(W, H, s, [{ name: "+", x: 4, y: 18 }, { name: "-", x: 4, y: 30 }]);
  }
  set on(v) { const r = this.q(".rod"), c = this.q(".cap"); const d = v ? -14 : 0; if (r) { r.setAttribute("x", 78 + d); r.setAttribute("width", 44); } if (c) c.setAttribute("x", 118 + d); }
  clOff() { this.on = false; }
}
def("cl-solenoid", ClSolenoid);

/* ---------- small speaker ---------- */
class ClSpeaker extends CL {
  render() {
    const W = 72, H = 56, cx = 44, cy = 28;
    let s = `<circle cx="${cx}" cy="${cy}" r="26" fill="#2E3440"/><circle cx="${cx}" cy="${cy}" r="21" fill="#1A1D22"/><circle cx="${cx}" cy="${cy}" r="9" fill="#3A3F47"/><circle cx="${cx}" cy="${cy}" r="4" fill="#555B66"/>`;
    s += `<g class="snd" opacity="0" stroke="#22C55E" fill="none" stroke-width="1.4"><path d="M${cx + 28} ${cy - 9} a12 12 0 0 1 0 18"/><path d="M${cx + 33} ${cy - 14} a18 18 0 0 1 0 28"/></g>`;
    s += `<line x1="4" y1="18" x2="18" y2="18" stroke="#E63946" stroke-width="1.6"/><line x1="4" y1="38" x2="18" y2="38" stroke="#2B2D42" stroke-width="1.6"/>`;
    this.draw(W, H, s, [{ name: "1", x: 4, y: 18 }, { name: "2", x: 4, y: 38 }]);
  }
  set hasSignal(v) { const g = this.q(".snd"); if (g) g.setAttribute("opacity", v ? "1" : "0"); }
  clOff() { this.hasSignal = false; }
}
def("cl-speaker", ClSpeaker);

/* ---------- LM2596 buck converter ---------- */
class ClBuck extends CL {
  render() {
    const W = 150, H = 72;
    let s = pcb(0, 0, W, H, "#1F57A8", 5) + mount(8, 8) + mount(W - 8, 8) + mount(8, H - 8) + mount(W - 8, H - 8);
    s += chip(34, 12, 20, 14, "2596", 4);
    s += `<rect x="62" y="10" width="26" height="22" rx="4" fill="#2A2E36"/>` + txt(75, 25, "L", 8, "#C9CED8", 'text-anchor="middle"');
    s += `<rect x="96" y="8" width="16" height="26" rx="3" fill="#2B2D42"/><rect x="116" y="8" width="16" height="26" rx="3" fill="#2B2D42"/>`;
    s += `<rect x="34" y="40" width="16" height="16" rx="2" fill="#2E7DE0"/><circle cx="42" cy="48" r="5" fill="#E9EDF3"/><line x1="39" y1="48" x2="45" y2="48" stroke="#7A8290" stroke-width="1.2"/>`;
    s += termBlock(6, 20, 2, "#1F6FD1") + termBlock(W - 20, 20, 2, "#C0392B");
    s += txt(24, 62, "IN", 6, "#CFE0FF") + txt(W - 24, 62, "OUT", 6, "#FFD9DE", 'text-anchor="end"');
    s += `<text class="rd" x="${W / 2}" y="66" font-size="6.6" fill="#EAF4FF" ${MONO} text-anchor="middle">5.0 V</text>`;
    this.draw(W, H, s, [{ name: "IN+", x: 0, y: 20 }, { name: "IN-", x: 0, y: 20 + P }, { name: "OUT+", x: W, y: 20 }, { name: "OUT-", x: W, y: 20 + P }]);
  }
  set reading(v) { const n = this.q(".rd"); if (n) n.textContent = v; }
  clOff() { }
}
def("cl-buck", ClBuck);

/* ---------- breadboard power supply module ---------- */
class ClPsu extends CL {
  render() {
    const W = 140, H = 58;
    let s = pcb(0, 0, W, H, "#C0392B", 5);
    s += `<rect x="10" y="18" width="22" height="22" rx="3" fill="#2B2D42"/>` + txt(21, 33, "DC", 5.4, "#E8EEF8", 'text-anchor="middle"');
    s += chip(44, 20, 18, 14, "", 4) + `<rect x="70" y="16" width="20" height="22" rx="4" fill="#2A2E36"/>`;
    s += ledDot("pwr", 100, 14, "#3CFF6B");
    s += txt(W / 2, 52, "BREADBOARD POWER 5V / 3.3V", 5, "rgba(255,255,255,.85)", 'text-anchor="middle"');
    const pins = [];
    [["+5V", 0], ["GND", 1], ["+3V3", 2]].forEach(([n, i]) => { const y = 15 + i * P; s += `<rect x="${W - 12}" y="${y - 1}" width="14" height="2" rx="1" fill="#D6B656"/>` + txt(W - 16, y + 2.2, n, 5.6, "#fff", 'text-anchor="end" font-weight="700"'); pins.push({ name: n, x: W, y }); });
    this.draw(W, H, s, pins);
  }
  clOff() { this.led("pwr", false); }
}
def("cl-psu", ClPsu);

/* ---------- electret microphone module ---------- */
module("cl-mic", {
  W: 100, H: 44, names: ["VCC", "GND", "AO"], title: "MIC MAX4466", guts: null, leds: [34, 32],
  glyph: () => chip(30, 6, 10, 9, "", 4) + `<circle cx="74" cy="21" r="13" fill="#2A2E36"/><circle cx="74" cy="21" r="10" fill="#1A1D22"/><circle cx="74" cy="17" r="2.6" fill="#3A3F47"/>` +
    `<g class="wv" opacity="0" stroke="#22C55E" fill="none" stroke-width="1.3"><path d="M89 13 a10 10 0 0 1 0 16"/><path d="M93 9 a15 15 0 0 1 0 24"/></g>`,
  setters: { loud: fade(".wv") },
});

/* ---------- TDS / water quality probe ---------- */
module("cl-tds", {
  W: 158, H: 66, names: ["VCC", "GND", "AO"], title: "", guts: [26, 6], leds: [30, 30],
  glyph: (W, H) => `<path d="M58 16 C70 16 74 12 84 12" stroke="#E63946" stroke-width="1.5" fill="none"/><path d="M58 26 C70 26 74 26 84 26" stroke="#2B2D42" stroke-width="1.5" fill="none"/>` +
    `<rect x="84" y="4" width="10" height="44" rx="2" fill="#B9BEC8"/><rect x="100" y="4" width="10" height="44" rx="2" fill="#B9BEC8"/>` +
    `<rect x="78" y="34" width="76" height="30" rx="3" fill="#3FA9F5" opacity=".35"/><path d="M78 36 q10 -4 19 0 t19 0 t19 0 t19 0" stroke="#3FA9F5" fill="none" stroke-width="1.4"/>` +
    txt(130, 52, "TDS", 6.4, "#1F57A8", 'text-anchor="middle" font-weight="700"'),
  setters: { ppm: setTxt(".rd") },
});

/* ---------- SW: DIP switch is a wokwi element; nothing to draw ---------- */

/* ---------- a sticky note you can put on the canvas ---------- */
class ClNote extends CL {
  static get observedAttributes() { return ["text", "color", "w"]; }
  render() {
    const PAL = { yellow: ["#FFF3B0", "#E7CE5A", "#4A3B00"], blue: ["#D8EAFE", "#8FBDE8", "#13335C"], green: ["#D9F5E3", "#86CFA6", "#0C3A22"], pink: ["#FFE0EC", "#E79BB8", "#5A1030"], grey: ["#EEF1F6", "#B9C2CE", "#2B3443"] };
    const [bg, edge, ink] = PAL[this.getAttribute("color") || "yellow"] || PAL.yellow;
    const text = this.getAttribute("text") || "Note";
    const W = Math.max(90, +(this.getAttribute("w") || 0) || 170);
    const lines = [];
    text.split("\n").forEach(para => {
      let line = "";
      para.split(" ").forEach(word => {
        const t = line ? line + " " + word : word;
        if (t.length * 5.1 > W - 18 && line) { lines.push(line); line = word; } else line = t;
      });
      lines.push(line);
    });
    const H = Math.max(44, 20 + lines.length * 12);
    let s = `<path d="M0 3a3 3 0 0 1 3-3h${W - 15}l12 12v${H - 15}a3 3 0 0 1-3 3H3a3 3 0 0 1-3-3z" fill="${bg}" stroke="${edge}" stroke-width="1"/>`;
    s += `<path d="M${W - 12} 0l12 12h-12z" fill="${edge}" opacity=".55"/>`;
    lines.forEach((l, i) => { s += txt(10, 20 + i * 12, l.replace(/&/g, "&amp;").replace(/</g, "&lt;"), 9, ink, 'font-weight="600"'); });
    this.draw(W, H, s, []);
  }
}
def("cl-note", ClNote);

defineEls(DEFS);
export { DEFS as DEFS2 };
