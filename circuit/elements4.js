/* Circuit Lab - I2C / SPI / serial breakout boards (round 3). */
import { P, KIT, defineEls } from "./elements.js?v=10";
const { CL, txt, pcb, smd, chip, leftHeader, bottomHeader, termBlock, ledDot, mount, moduleBase, modGuts, F, MONO } = KIT;
const DEFS = {};

/* ---------- generic little I2C breakout: VCC GND SCL SDA down the left ---------- */
class ClI2c extends CL {
  static get observedAttributes() { return ["label", "sub", "pins", "color", "shape"]; }
  render() {
    const names = (this.getAttribute("pins") || "VCC,GND,SCL,SDA").split(",");
    const label = this.getAttribute("label") || "SENSOR", sub = this.getAttribute("sub") || "";
    const color = this.getAttribute("color") || "#1F57A8", shape = this.getAttribute("shape") || "chip";
    const W = 96, H = Math.max(48, names.length * P + 14);
    const m = moduleBase(W, H, names, "", color);
    let s = m.s;
    const cx = W - 30, cy = H / 2;
    if (shape === "chip") s += chip(cx - 9, cy - 8, 18, 16, "", 5) + smd(cx + 14, cy - 10) + smd(cx + 14, cy + 6);
    else if (shape === "dome") s += `<circle cx="${cx}" cy="${cy}" r="11" fill="#2A2E36"/><circle cx="${cx}" cy="${cy}" r="7" fill="#C8CED8" opacity=".9"/>`;
    else if (shape === "lens") s += `<rect x="${cx - 13}" y="${cy - 9}" width="26" height="18" rx="3" fill="#1A1D22"/><circle cx="${cx - 6}" cy="${cy}" r="5" fill="#2E3440" stroke="#555"/><circle cx="${cx + 6}" cy="${cy}" r="5" fill="#3A4454" stroke="#667"/>`;
    else if (shape === "eye") s += `<circle cx="${cx}" cy="${cy}" r="11" fill="#141821"/><circle cx="${cx}" cy="${cy}" r="6" fill="#2B6CB0" opacity=".8"/><circle cx="${cx - 2}" cy="${cy - 2}" r="2" fill="#9ECBFF"/>`;
    s += txt(W - 6, 12, label, 5.6, "#fff", 'text-anchor="end" font-weight="700"');
    if (sub) s += txt(W - 6, H - 6, sub, 4.8, "rgba(255,255,255,.7)", 'text-anchor="end"');
    s += ledDot("pwr", 32, H - 10, "#FF3B3B", 1.8);
    this.draw(W, H, s, m.pins);
  }
  clOff() { this.led("pwr", false); }
}
DEFS["cl-i2c"] = ClI2c;

/* ---------- DS18B20 waterproof probe ---------- */
class ClDs18b20 extends CL {
  render() {
    const W = 170, H = 40, hd = leftHeader(["VCC", "DQ", "GND"], H / 2 - P, 13);
    let s = pcb(0, 0, 34, H, "#1F57A8", 4) + hd.s;
    s += `<path d="M34 14 C50 14 54 12 70 12" stroke="#E63946" stroke-width="1.6" fill="none"/><path d="M34 20 C50 20 54 20 70 20" stroke="#F5B83D" stroke-width="1.6" fill="none"/><path d="M34 26 C50 26 54 28 70 28" stroke="#2B2D42" stroke-width="1.6" fill="none"/>`;
    s += `<rect x="70" y="14" width="68" height="12" rx="6" fill="#B9BEC8"/><rect x="134" y="13" width="30" height="14" rx="7" fill="#9BA3AF"/><circle cx="162" cy="20" r="6" fill="#8A929E"/>`;
    s += txt(100, 36, "DS18B20 PROBE", 5, "#5C6B80", 'text-anchor="middle"');
    s += `<text class="rd" x="100" y="11" font-size="6" fill="#2B6CB0" ${MONO} text-anchor="middle"></text>`;
    this.draw(W, H, s, hd.pins);
  }
  set reading(v) { const n = this.q(".rd"); if (n) n.textContent = v; }
  clOff() { this.reading = ""; }
}
DEFS["cl-ds18b20"] = ClDs18b20;

/* ---------- GPS module ---------- */
class ClGps extends CL {
  render() {
    const W = 140, H = 96, hd = leftHeader(["VCC", "RX", "TX", "GND"], 28, 13);
    let s = pcb(0, 0, W, H, "#15365E", 5) + hd.s + mount(W - 8, 8) + mount(W - 8, H - 8);
    s += chip(40, 16, 20, 18, "u-blox", 5) + smd(40, 42) + smd(54, 42);
    s += `<rect x="72" y="20" width="54" height="54" rx="3" fill="#C8CED8" stroke="#8E96A3"/><rect x="76" y="24" width="46" height="46" rx="2" fill="#E6EAF0"/>`;
    s += `<path d="M84 60 l15 -26 l15 26 z" fill="#B9C2CE"/>`;
    s += ledDot("fix", 36, 74, "#3CFF6B");
    s += txt(60, 90, "NEO-6M GPS", 5.4, "#9DB4DA");
    this.draw(W, H, s, hd.pins);
  }
  clOff() { this.led("fix", false); }
}
DEFS["cl-gps"] = ClGps;

/* ---------- SIM800L GSM module ---------- */
class ClSim800 extends CL {
  render() {
    const W = 120, H = 84, hd = leftHeader(["VCC", "RST", "RX", "TX", "GND"], 20, 13);
    let s = pcb(0, 0, W, H, "#1E3A5F", 5) + hd.s;
    s += chip(44, 22, 34, 30, "SIM800L", 6);
    s += `<rect x="86" y="10" width="28" height="18" rx="2" fill="#2A2E36"/>` + txt(100, 22, "SIM", 5, "#C9CED8", 'text-anchor="middle"');
    s += `<rect x="86" y="58" width="28" height="8" rx="2" fill="#C9A227"/>` + txt(100, 76, "ANT", 4.6, "#9DB4DA", 'text-anchor="middle"');
    s += ledDot("net", 40, 62, "#3CFF6B");
    this.draw(W, H, s, hd.pins);
  }
  clOff() { this.led("net", false); }
}
DEFS["cl-sim800"] = ClSim800;

/* ---------- nRF24L01 radio ---------- */
class ClNrf24 extends CL {
  render() {
    const names = ["GND", "VCC", "CE", "CSN", "SCK", "MOSI", "MISO", "IRQ"];
    const W = 104, H = 88, hd = leftHeader(names, 12, 13);
    let s = pcb(0, 0, W, H, "#1B2430", 4) + hd.s;
    s += chip(46, 30, 20, 20, "nRF24", 5) + smd(46, 56) + smd(60, 56);
    s += `<path class="ant" d="M72 16 h20 v12 h-16 v10 h16" stroke="#C9A227" stroke-width="2.4" fill="none"/>`;
    s += `<g class="tx" opacity="0" stroke="#49B6FF" fill="none" stroke-width="1.3"><path d="M92 50 a10 10 0 0 1 0 14"/><path d="M96 46 a15 15 0 0 1 0 22"/></g>`;
    s += txt(W - 6, H - 5, "nRF24L01", 5, "rgba(255,255,255,.7)", 'text-anchor="end"');
    this.draw(W, H, s, hd.pins);
  }
  set active(v) { const g = this.q(".tx"); if (g) g.setAttribute("opacity", v ? "1" : "0"); }
  clOff() { this.active = false; }
}
DEFS["cl-nrf24"] = ClNrf24;

defineEls(DEFS);
export { DEFS as DEFS4 };
