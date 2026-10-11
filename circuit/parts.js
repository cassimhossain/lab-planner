/* Circuit Lab - part catalogue and custom parts (breadboard, L298N, DC motor, IR sensor, battery).
   Wokwi elements (MIT) supply the other parts. */

const P = 9.6; // 0.1 inch in px

/* ---------- helpers ---------- */
function svgEl(w, h, body) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" style="display:block;overflow:visible">${body}</svg>`;
}
class CustomPart extends HTMLElement {
  constructor() { super(); this._pins = []; }
  get pinInfo() { return this._pins; }
}

/* ---------- breadboard (half size: 30 columns) ---------- */
const BB_COLS = 30, BB_M = 16;
const BB_ROWS = ["j", "i", "h", "g", "f", "e", "d", "c", "b", "a"];
function bbLayout() {
  const pins = [], rows = {};
  const y0 = 12; // top rails
  rows.tn = y0; rows.tp = y0 + P;
  let y = y0 + P * 3.2;
  ["j", "i", "h", "g", "f"].forEach(r => { rows[r] = y; y += P; });
  y += P * 1.2;
  ["e", "d", "c", "b", "a"].forEach(r => { rows[r] = y; y += P; });
  rows.bn = y + P * 1.2; rows.bp = rows.bn + P;
  const H = rows.bp + 12, W = BB_COLS * P + BB_M * 2;
  for (let c = 1; c <= BB_COLS; c++) {
    const x = BB_M + (c - 0.5) * P;
    BB_ROWS.forEach(r => pins.push({ name: c + r, x, y: rows[r] }));
  }
  // rails: 25 holes in groups of 5
  let k = 0;
  for (let c = 1; c <= BB_COLS; c++) {
    if (c % 6 === 0) continue; // gap every 6th position like real boards
    k++;
    const x = BB_M + (c - 0.5) * P;
    ["tn", "tp", "bn", "bp"].forEach(r => pins.push({ name: r + "." + k, x, y: rows[r] }));
  }
  return { pins, rows, W, H };
}
const BB = bbLayout();
class ClBreadboard extends CustomPart {
  connectedCallback() {
    if (this._done) return; this._done = true;
    const { pins, rows, W, H } = BB;
    let s = `<rect x="0" y="0" width="${W}" height="${H}" rx="6" fill="#F4F1EA" stroke="#D8D2C4"/>`;
    s += `<rect x="4" y="${(rows.f + rows.e) / 2 - P * 0.45}" width="${W - 8}" height="${P * 0.9}" fill="#E6E0D3"/>`;
    s += `<line x1="${BB_M}" y1="${rows.tn - 7}" x2="${W - BB_M}" y2="${rows.tn - 7}" stroke="#2F6BDE" stroke-width="1.4"/><line x1="${BB_M}" y1="${rows.tp + 7}" x2="${W - BB_M}" y2="${rows.tp + 7}" stroke="#E63946" stroke-width="1.4"/>`;
    s += `<line x1="${BB_M}" y1="${rows.bn - 7}" x2="${W - BB_M}" y2="${rows.bn - 7}" stroke="#2F6BDE" stroke-width="1.4"/><line x1="${BB_M}" y1="${rows.bp + 7}" x2="${W - BB_M}" y2="${rows.bp + 7}" stroke="#E63946" stroke-width="1.4"/>`;
    s += `<text x="6" y="${rows.tn + 3}" font-size="8" fill="#2F6BDE" font-family="sans-serif">-</text><text x="6" y="${rows.tp + 3}" font-size="8" fill="#E63946" font-family="sans-serif">+</text>`;
    s += `<text x="6" y="${rows.bn + 3}" font-size="8" fill="#2F6BDE" font-family="sans-serif">-</text><text x="6" y="${rows.bp + 3}" font-size="8" fill="#E63946" font-family="sans-serif">+</text>`;
    BB_ROWS.forEach(r => { s += `<text x="${BB_M - 9}" y="${rows[r] + 2.5}" font-size="6.5" fill="#9A927F" font-family="sans-serif">${r}</text>`; });
    for (let c = 1; c <= BB_COLS; c += (c === 1 ? 4 : 5)) s += `<text x="${BB_M + (c - 0.5) * P}" y="${rows.j - 6}" font-size="6" text-anchor="middle" fill="#9A927F" font-family="sans-serif">${c}</text>`;
    pins.forEach(p => { s += `<rect x="${p.x - 2.2}" y="${p.y - 2.2}" width="4.4" height="4.4" rx=".8" fill="#3B3A36"/>`; });
    this.innerHTML = svgEl(W, H, s);
    this._pins = pins.map(p => ({ name: p.name, x: p.x, y: p.y, signals: [] }));
  }
}
/* which breadboard pins are internally connected */
function bbGroups() {
  const g = [];
  for (let c = 1; c <= BB_COLS; c++) { g.push(["a", "b", "c", "d", "e"].map(r => c + r)); g.push(["f", "g", "h", "i", "j"].map(r => c + r)); }
  ["tn", "tp", "bn", "bp"].forEach(r => { const a = []; for (let k = 1; k <= 25; k++) a.push(r + "." + k); g.push(a); });
  return g;
}

/* ---------- L298N motor driver ---------- */
class ClL298n extends CustomPart {
  connectedCallback() {
    if (this._done) return; this._done = true;
    const W = 150, H = 150;
    let s = `<rect x="0" y="0" width="${W}" height="${H}" rx="6" fill="#C8102E" stroke="#8E0B21"/>`;
    s += `<rect x="45" y="20" width="60" height="70" rx="3" fill="#2B2D42"/>`;
    for (let i = 0; i < 9; i++) s += `<rect x="${48 + i * 6.3}" y="14" width="3.2" height="80" fill="#3E4053"/>`;
    s += `<text x="75" y="60" font-size="10" fill="#fff" text-anchor="middle" font-family="monospace" font-weight="700">L298N</text>`;
    const term = (x, y, n) => { let t = ""; for (let i = 0; i < n; i++) t += `<rect x="${x}" y="${y + i * 14}" width="18" height="13" rx="2" fill="#1F6FD1" stroke="#0E3E80"/><circle cx="${x + 9}" cy="${y + i * 14 + 6.5}" r="3.4" fill="#B9C3D3"/>`; return t; };
    s += term(4, 28, 2) + term(W - 22, 28, 2);
    s += `<rect x="40" y="${H - 22}" width="${3 * 14 + 4}" height="18" rx="2" fill="#1F6FD1" stroke="#0E3E80"/>`;
    for (let i = 0; i < 3; i++) s += `<circle cx="${47 + i * 14}" cy="${H - 13}" r="3.4" fill="#B9C3D3"/>`;
    const hdr = ["ENA", "IN1", "IN2", "IN3", "IN4", "ENB"];
    hdr.forEach((n, i) => { s += `<rect x="${96 + i * 8.6 - 3}" y="${H - 22}" width="6" height="6" fill="#111"/><text x="${96 + i * 8.6}" y="${H - 27}" font-size="5" fill="#fff" text-anchor="middle" font-family="sans-serif" transform="rotate(-90 ${96 + i * 8.6} ${H - 27})">${n}</text>`; });
    s += `<text x="13" y="24" font-size="6" fill="#fff" text-anchor="middle" font-family="sans-serif">MOTOR A</text><text x="${W - 13}" y="24" font-size="6" fill="#fff" text-anchor="middle" font-family="sans-serif">MOTOR B</text>`;
    ["12V", "GND", "5V"].forEach((n, i) => { s += `<text x="${47 + i * 14}" y="${H - 26}" font-size="5.5" fill="#fff" text-anchor="middle" font-family="sans-serif">${n}</text>`; });
    s += `<circle class="pled" cx="128" cy="110" r="3.5" fill="#5A0814"/>`;
    this.innerHTML = svgEl(W, H, s);
    this._pins = [
      { name: "OUT1", x: 13, y: 34.5 }, { name: "OUT2", x: 13, y: 48.5 },
      { name: "OUT3", x: W - 13, y: 34.5 }, { name: "OUT4", x: W - 13, y: 48.5 },
      { name: "12V", x: 47, y: H - 13 }, { name: "GND", x: 61, y: H - 13 }, { name: "5V", x: 75, y: H - 13 },
      ...hdr.map((n, i) => ({ name: n, x: 96 + i * 8.6, y: H - 19 })),
    ].map(p => Object.assign(p, { signals: [] }));
  }
  set powered(v) { const l = this.querySelector(".pled"); if (l) l.setAttribute("fill", v ? "#FF4D6D" : "#5A0814"); }
}

/* ---------- DC motor (TT gear motor with wheel) ---------- */
class ClDcMotor extends CustomPart {
  connectedCallback() {
    if (this._done) return; this._done = true;
    const W = 120, H = 90;
    let s = `<rect x="6" y="30" width="70" height="30" rx="5" fill="#F2C230" stroke="#9C7A0E"/><rect x="74" y="36" width="12" height="18" rx="2" fill="#E0E3EA" stroke="#8D93A3"/>`;
    s += `<g class="wheel" style="transform-origin:96px 45px"><circle cx="96" cy="45" r="22" fill="#2B2D42"/><circle cx="96" cy="45" r="15" fill="#F5F7FB"/>`;
    for (let i = 0; i < 6; i++) { const a = i * Math.PI / 3; s += `<line x1="96" y1="45" x2="${96 + 14 * Math.cos(a)}" y2="${45 + 14 * Math.sin(a)}" stroke="#6B7589" stroke-width="2"/>`; }
    s += `<circle cx="96" cy="45" r="4" fill="#E8590C"/></g>`;
    s += `<text x="40" y="49" font-size="9" text-anchor="middle" fill="#5C4500" font-family="sans-serif" font-weight="700">DC MOTOR</text>`;
    s += `<line x1="18" y1="60" x2="18" y2="80" stroke="#E63946" stroke-width="2"/><line x1="34" y1="60" x2="34" y2="80" stroke="#2B2D42" stroke-width="2"/>`;
    s += `<text class="rpm" x="40" y="22" font-size="8" text-anchor="middle" fill="#55596B" font-family="sans-serif"></text>`;
    this.innerHTML = svgEl(W, H, s);
    this._pins = [{ name: "M1", x: 18, y: 82, signals: [] }, { name: "M2", x: 34, y: 82, signals: [] }];
    this._a = 0; this.speed = 0;
  }
  spin(dt) {
    const w = this.querySelector(".wheel"); if (!w) return;
    this._a = (this._a + this.speed * 720 * dt) % 360; w.style.transform = `rotate(${this._a}deg)`;
    const r = this.querySelector(".rpm"); if (r) r.textContent = this.speed ? `${Math.round(Math.abs(this.speed) * 200)} rpm ${this.speed > 0 ? "↻" : "↺"}` : "";
  }
}

/* ---------- IR obstacle sensor ---------- */
class ClIrObstacle extends CustomPart {
  connectedCallback() {
    if (this._done) return; this._done = true;
    const W = 110, H = 44;
    let s = `<rect x="0" y="4" width="84" height="36" rx="4" fill="#1F4E9C" stroke="#123068"/>`;
    s += `<rect x="84" y="9" width="12" height="9" rx="2" fill="#E8EEF8" stroke="#555"/><rect x="84" y="25" width="12" height="9" rx="2" fill="#2B2D42"/>`;
    s += `<circle cx="99" cy="13.5" r="5" fill="#DDE6F5" stroke="#777"/><circle cx="99" cy="29.5" r="5" fill="#111" stroke="#444"/>`;
    s += `<circle class="oled" cx="58" cy="14" r="3" fill="#2E5130"/><circle cx="58" cy="30" r="3" fill="#FF4D4D"/>`;
    s += `<rect x="36" y="18" width="12" height="12" fill="#1659A3"/><circle cx="42" cy="24" r="4" fill="#E8EEF8"/>`;
    ["VCC", "GND", "OUT"].forEach((n, i) => { s += `<rect x="1" y="${10 + i * 10 - 2}" width="6" height="5" fill="#C9A227"/><text x="10" y="${10 + i * 10 + 2}" font-size="6" fill="#fff" font-family="sans-serif">${n}</text>`; });
    s += `<text x="58" y="42" font-size="5.5" fill="#BFD0EC" text-anchor="middle" font-family="sans-serif">IR OBSTACLE</text>`;
    s += `<g class="obs" style="display:none"><rect x="104" y="4" width="6" height="36" fill="#8A5A00"/></g>`;
    this.innerHTML = svgEl(W, H, s);
    this._pins = ["VCC", "GND", "OUT"].map((n, i) => ({ name: n, x: 2, y: 10 + i * 10, signals: [] }));
  }
  set state(v) { const l = this.querySelector(".oled"), o = this.querySelector(".obs"); if (l) l.setAttribute("fill", v ? "#3CFF6B" : "#2E5130"); if (o) o.style.display = v ? "" : "none"; }
}

/* ---------- 9V battery ---------- */
class ClBattery extends CustomPart {
  connectedCallback() {
    if (this._done) return; this._done = true;
    const W = 56, H = 92;
    let s = `<rect x="4" y="14" width="48" height="74" rx="5" fill="#2B2D42"/><rect x="4" y="44" width="48" height="44" rx="5" fill="#F5B83D"/>`;
    s += `<rect x="12" y="6" width="12" height="9" rx="2" fill="#B9C3D3"/><rect x="32" y="6" width="12" height="9" rx="2" fill="#B9C3D3"/>`;
    s += `<text x="28" y="34" font-size="13" fill="#fff" text-anchor="middle" font-family="sans-serif" font-weight="800">9V</text><text x="18" y="5" font-size="8" fill="#E63946" text-anchor="middle" font-family="sans-serif">+</text><text x="38" y="5" font-size="8" fill="#2B2D42" text-anchor="middle" font-family="sans-serif">−</text>`;
    this.innerHTML = svgEl(W, H, s);
    this._pins = [{ name: "+", x: 18, y: 10, signals: [] }, { name: "-", x: 38, y: 10, signals: [] }];
  }
}

customElements.define("cl-breadboard", ClBreadboard);
customElements.define("cl-l298n", ClL298n);
customElements.define("cl-dcmotor", ClDcMotor);
customElements.define("cl-ir-obstacle", ClIrObstacle);
customElements.define("cl-battery", ClBattery);

/* ---------- catalogue ---------- */
const COLORS = ["red", "green", "yellow", "blue", "white", "orange"];
export const CATS = ["Boards", "Basics", "Inputs", "Sensors", "Outputs", "Displays", "Motors", "Power"];
export const PARTS = {
  uno: { tag: "wokwi-arduino-uno", label: "Arduino Uno", cat: "Boards", one: true, help: "The brain. Pins 0-13 digital (~ = PWM), A0-A5 analog, 5V and GND for power." },
  breadboard: { tag: "cl-breadboard", label: "Breadboard", cat: "Basics", help: "Holes in each short column (a-e, f-j) are connected. The long + and - rails run along the edges. Drop a part's legs on holes to connect them." },
  led: { tag: "wokwi-led", label: "LED", cat: "Basics", attrs: { color: "red" }, props: [{ k: "color", label: "Colour", type: "select", opts: COLORS }], help: "Long leg (A, anode) to the pin through a resistor, short leg (C, cathode) to GND." },
  resistor: { tag: "wokwi-resistor", label: "Resistor", cat: "Basics", attrs: { value: "220" }, props: [{ k: "value", label: "Resistance (Ω)", type: "select", opts: ["100", "220", "330", "1000", "4700", "10000"] }], help: "Limits current. 220 Ω for LEDs, 10 kΩ for pull-down resistors." },
  rgbled: { tag: "wokwi-rgb-led", label: "RGB LED", cat: "Basics", attrs: {}, sim: { common: "cathode" }, props: [{ k: "common", label: "Common pin", type: "select", opts: ["cathode", "anode"], sim: true }], help: "Three LEDs in one. COM to GND (common cathode). Use analogWrite on R, G, B." },
  button: { tag: "wokwi-pushbutton", label: "Push button", cat: "Inputs", attrs: { color: "green" }, props: [{ k: "color", label: "Colour", type: "select", opts: ["red", "green", "blue", "yellow", "white", "black"] }], help: "Left and right legs on the same side are always joined. Pressing joins pin 1 to pin 2. Tip: use INPUT_PULLUP and wire the other side to GND." },
  slideswitch: { tag: "wokwi-slide-switch", label: "Slide switch", cat: "Inputs", help: "The middle pin (2) connects to pin 1 or pin 3." },
  pot: { tag: "wokwi-potentiometer", label: "Potentiometer", cat: "Inputs", attrs: { value: "512" }, help: "Outer pins to 5V and GND, middle (SIG) to an analog pin. Turn the knob while running." },
  slidepot: { tag: "wokwi-slide-potentiometer", label: "Slide potentiometer", cat: "Inputs", attrs: { "travel-length": "30" }, help: "Like a potentiometer, but slides." },
  joystick: { tag: "wokwi-analog-joystick", label: "Joystick", cat: "Inputs", help: "VERT and HORZ to analog pins, SEL is a button (reads LOW when pressed, use INPUT_PULLUP)." },
  ldr: { tag: "wokwi-photoresistor-sensor", label: "Light sensor (LDR)", cat: "Sensors", sim: { lux: 300 }, props: [{ k: "lux", label: "Light (lux)", type: "range", min: 0, max: 1000, sim: true, live: true }], help: "AO gives a voltage that goes up as light goes up. DO goes LOW when it is bright." },
  ntc: { tag: "wokwi-ntc-temperature-sensor", label: "Temperature sensor (NTC)", cat: "Sensors", sim: { temp: 25 }, props: [{ k: "temp", label: "Temperature (°C)", type: "range", min: -20, max: 80, sim: true, live: true }], help: "OUT to an analog pin. Formula: °C = 1 / (log(1 / (1023.0 / a - 1)) / 3950 + 1 / 298.15) - 273.15" },
  dht22: { tag: "wokwi-dht22", label: "DHT22 temp & humidity", cat: "Sensors", sim: { temp: 28, hum: 55 }, props: [{ k: "temp", label: "Temperature (°C)", type: "range", min: -10, max: 60, sim: true, live: true }, { k: "hum", label: "Humidity (%)", type: "range", min: 0, max: 100, sim: true, live: true }], help: "VCC 5V, GND, SDA to a digital pin. Use the DHT library: dht.readTemperature()." },
  hcsr04: { tag: "wokwi-hc-sr04", label: "Ultrasonic HC-SR04", cat: "Sensors", sim: { dist: 40 }, props: [{ k: "dist", label: "Distance (cm)", type: "range", min: 2, max: 400, sim: true, live: true }], help: "TRIG and ECHO to digital pins. distance = pulseIn(ECHO, HIGH) * 0.0343 / 2" },
  pir: { tag: "wokwi-pir-motion-sensor", label: "PIR motion sensor", cat: "Sensors", sim: { motion: false }, props: [{ k: "motion", label: "Motion", type: "button", text: "Wave in front (5 s)", sim: true, live: true }], help: "OUT goes HIGH when it sees movement." },
  irobs: { tag: "cl-ir-obstacle", label: "IR obstacle sensor", cat: "Sensors", sim: { obstacle: false }, props: [{ k: "obstacle", label: "Obstacle", type: "toggle", text: "Object in front", sim: true, live: true }], help: "OUT goes LOW when something is in front." },
  buzzer: { tag: "wokwi-buzzer", label: "Buzzer", cat: "Outputs", help: "Pin 2 to a digital pin, pin 1 to GND. Use tone(pin, frequency)." },
  servo: { tag: "wokwi-servo", label: "Servo motor", cat: "Motors", help: "Brown/GND, red/V+ to 5V, orange/PWM to a digital pin. Use the Servo library." },
  neopixel: { tag: "wokwi-neopixel", label: "NeoPixel (1 LED)", cat: "Outputs", help: "DIN to a digital pin. Use Adafruit_NeoPixel." },
  ledring: { tag: "wokwi-led-ring", label: "NeoPixel ring", cat: "Outputs", attrs: { pixels: "12" }, props: [{ k: "pixels", label: "LEDs", type: "select", opts: ["8", "12", "16", "24"] }], help: "VCC 5V, GND, DIN to a digital pin. Use Adafruit_NeoPixel." },
  seg7: { tag: "wokwi-7segment", label: "7-segment display", cat: "Displays", attrs: {}, sim: { common: "cathode" }, props: [{ k: "common", label: "Common pin", type: "select", opts: ["cathode", "anode"], sim: true }], help: "Seven LEDs (A-G) plus DP. COM to GND for common cathode." },
  lcd: { tag: "wokwi-lcd1602", label: "LCD 16x2", cat: "Displays", attrs: { pins: "i2c" }, props: [{ k: "pins", label: "Connection", type: "select", opts: ["i2c", "full"] }], help: "I2C version: SDA to A4, SCL to A5, address 0x27. Use LiquidCrystal_I2C lcd(0x27, 16, 2)." },
  stepper: { tag: "wokwi-stepper-motor", label: "Stepper motor", cat: "Motors", attrs: { size: "17" }, help: "Drive the four coil wires (A+, A-, B+, B-) from four pins in sequence. 200 steps per turn." },
  l298n: { tag: "cl-l298n", label: "L298N motor driver", cat: "Motors", sim: { ena: false, enb: false }, props: [{ k: "ena", label: "ENA jumper on", type: "toggle", sim: true }, { k: "enb", label: "ENB jumper on", type: "toggle", sim: true }], help: "IN1/IN2 set direction of motor A, ENA (PWM) sets speed. Power from 12V (battery) and connect GND to Arduino GND." },
  dcmotor: { tag: "cl-dcmotor", label: "DC motor", cat: "Motors", help: "Connect to OUT1/OUT2 of an L298N. Arduino pins cannot power a motor directly." },
  battery: { tag: "cl-battery", label: "9V battery", cat: "Power", help: "Power for motors through the L298N. Connect - to GND." },
};

export const BB_GROUPS = bbGroups();
export { P as PITCH };
