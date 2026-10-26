/* Circuit Lab - editor. Build circuits, write Arduino / ESP32 code, run them in the browser. */
import { PARTS, CATS, CARDS, DEFAULT_PINS, bbGroupOf, defaultPin, SHELF, SHELF_ORDER } from "./parts.js?v=12";
import { Netlist, Sim } from "./sim.js?v=12";
import { BOARDS, loadHex } from "./boards.js?v=12";
import { prepareSketch, BUILTIN_LIBS, EXTRA_LIBS } from "./libs.js?v=12";
import { layoutCircuit } from "./layout.js?v=12";
import { SNIPPETS } from "./snippets.js?v=12";
import { LESSONS, STARTERS, GROUPS } from "./lessons.js?v=12";
import * as T from "./tools.js?v=12";
import { buildSchematic } from "./schematic.js?v=12";
import { initHome, showHome, hideHome, isHome } from "./home.js?v=12";
import { installAutocomplete, applyTheme, currentTheme, toggleTheme, toggleFullscreen, isFullscreen } from "./assist.js?v=12";

const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];
const esc = s => String(s ?? "").replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const KEY = "circuitlab.v2", LIST = "circuitlab.projects.v2", LKEY = "circuitlab.lesson.";
/* Your own work autosaves to KEY. A lesson autosaves to its own slot (LKEY + code), so opening Circuit Lab never brings back a lesson. */
const store = { get(k) { try { return JSON.parse(localStorage.getItem(k)); } catch (e) { return null; } }, set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); return true; } catch (e) { return false; } } };
const BUILD_URL = (() => { try { return localStorage.getItem("circuitlab.buildUrl") || "https://hexi.wokwi.com/build"; } catch (e) { return "https://hexi.wokwi.com/build"; } })();
let penColor = "auto";   /* the colour the next wire is drawn in; "auto" = pick by what the pins are (red 5V, black GND, orange 3V3) */
const WIRE_COLORS = ["#2B2D42", "#E63946", "#F08C00", "#F5B83D", "#2E9E5B", "#20B8A6", "#1F6FD1", "#7B3FC4", "#D6336C", "#8D6E63", "#FFFFFF"];
const ICON = {
  play: '<path d="M7 5l12 7-12 7z"/>', stop: '<rect x="6" y="6" width="12" height="12" rx="1.5"/>', rot: '<path d="M20 11a8 8 0 1 0-2.3 5.7"/><path d="M20 4v7h-7"/>',
  del: '<path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3"/>', x: '<path d="M6 6l12 12M18 6L6 18"/>', warn: '<path d="M12 3l10 18H2z"/><path d="M12 10v5M12 18v.5"/>',
  info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7.5v.5"/>', code: '<path d="M8 7l-5 5 5 5M16 7l5 5-5 5"/>', book: '<path d="M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2zM4 21V5M8 7h7"/>',
  sound: '<path d="M4 9v6h4l5 4V5L8 9z"/><path d="M16 9a4 4 0 0 1 0 6"/>', mute: '<path d="M4 9v6h4l5 4V5L8 9z"/><path d="M17 9l4 6M21 9l-4 6"/>', search: '<circle cx="11" cy="11" r="7"/><path d="M20 20l-4-4"/>',
  chip: '<rect x="6" y="6" width="12" height="12" rx="2"/><path d="M9 2v4M15 2v4M9 18v4M15 18v4M2 9h4M2 15h4M18 9h4M18 15h4"/>', wifi: '<path d="M2 8.5a15 15 0 0 1 20 0M5 12a10 10 0 0 1 14 0M8.5 15.5a5 5 0 0 1 7 0"/><circle cx="12" cy="19" r="1"/>',
  check: '<path d="M5 12l5 5 9-10"/>', arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>', ext: '<path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5"/>', bolt: '<path d="M13 2L5 14h6l-1 8 8-12h-6z"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  sch: '<path d="M3 12h4l2-4 3 8 2-4h7"/><circle cx="3" cy="12" r="1.3"/><circle cx="21" cy="12" r="1.3"/>',
  dl: '<path d="M12 4v11M8 11l4 4 4-4"/><path d="M5 19h14"/>',
  probe: '<path d="M14 3l7 7-3 3-7-7z"/><path d="M11 10L3 18v3h3l8-8"/>', volt: '<path d="M12 3v18M7 7h10M7 12h10M7 17h10"/>',
  scope: '<rect x="2" y="5" width="20" height="14" rx="2"/><path d="M5 14h3l2-6 2 10 2-7h5"/>', copy: '<rect x="9" y="9" width="12" height="12" rx="2"/><path d="M15 9V5a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h4"/>',
  note: '<path d="M5 4h10l4 4v12H5z"/><path d="M15 4v4h4M8 12h8M8 16h5"/>', share: '<circle cx="6" cy="12" r="2.5"/><circle cx="18" cy="6" r="2.5"/><circle cx="18" cy="18" r="2.5"/><path d="M8.2 10.8l7.6-3.6M8.2 13.2l7.6 3.6"/>',
  pause: '<rect x="7" y="5" width="3.5" height="14" rx="1"/><rect x="13.5" y="5" width="3.5" height="14" rx="1"/>', step: '<path d="M6 5l9 7-9 7z"/><rect x="17" y="5" width="2.5" height="14" rx="1"/>',
  image: '<rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="9" cy="10" r="2"/><path d="M4 18l5-5 4 4 3-3 4 4"/>', list: '<path d="M8 6h13M8 12h13M8 18h13M3.5 6h.01M3.5 12h.01M3.5 18h.01"/>',
  save: '<path d="M5 4h11l3 3v13H5z"/><path d="M8 4v5h7V4M8 20v-6h8v6"/>',
  bt: '<path d="M7 7l10 10-5 5V2l5 5L7 17"/>', globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/>', send: '<path d="M4 12l16-8-6 16-3-6z"/>', reload: '<path d="M20 11a8 8 0 1 0-2.3 5.7"/><path d="M20 4v7h-7"/>',
};
const ic = (k, c = "ic") => `<svg class="${c}" viewBox="0 0 24 24">${ICON[k] || ""}</svg>`;

/* ---------- state ---------- */
const CODE_UNO = "void setup() {\n  pinMode(LED_BUILTIN, OUTPUT);\n}\n\nvoid loop() {\n  digitalWrite(LED_BUILTIN, HIGH);\n  delay(500);\n  digitalWrite(LED_BUILTIN, LOW);\n  delay(500);\n}\n";
const CODE_ESP = "// ESP32: use GPIO numbers (2 = D2, the blue on-board LED)\nconst int LED = 2;\n\nvoid setup() {\n  pinMode(LED, OUTPUT);\n  Serial.begin(115200);\n  Serial.println(\"Hello from the ESP32!\");\n}\n\nvoid loop() {\n  digitalWrite(LED, HIGH);\n  delay(500);\n  digitalWrite(LED, LOW);\n  delay(500);\n}\n";
const blank = (board = "uno") => ({ v: 2, name: board === "esp32" ? "My ESP32 circuit" : board === "mega" ? "My Mega circuit" : board === "nano" ? "My Nano circuit" : "My circuit", parts: board ? [{ id: board + "1", type: board, x: 60, y: 230, rot: board === "esp32" ? 90 : 0 }, { id: "bb1", type: "breadboard", x: 30, y: 0, rot: 0 }] : [{ id: "bb1", type: "breadboard", x: 30, y: 0, rot: 0 }], wires: [], code: board === "esp32" ? CODE_ESP : board ? CODE_UNO : "// No board: this circuit runs without code.\n" });
let project = load() || blank();
const rt = {};              // id -> { el, wrap, w, h, state }
let view = { x: 40, y: 20, z: 1 };
let sel = null;             // { kind: 'part'|'wire', id }
let wiring = null;          // { from, pts, mouse }
let hoverPart = null, hoverPin = null;
let ptr = null, ptrDrawn = null;   // cursor in world coords, and where the pins were last drawn
let sim = null, running = false, raf = 0, lastT = 0;
let undoStack = [], redoStack = [], editor;
let muted = false, catFilter = "All";

function load() { const p = store.get(KEY); return p && p.parts && !p.lessonKey ? p : null; }
function save() { project.code = editor ? editor.getValue() : project.code; store.set(project.lessonKey ? LKEY + project.lessonKey : KEY, project); }
const sameWork = (a, b) => JSON.stringify([a.parts, a.wires, a.code]) === JSON.stringify([b.parts, b.wires, b.code]);
function setHash(h) { try { history.replaceState(null, "", location.pathname + location.search + (h ? "#" + h : "")); } catch (e) { } }
function snapshot() { undoStack.push(JSON.stringify(project)); if (undoStack.length > 80) undoStack.shift(); redoStack = []; }
function undo() { if (running || !undoStack.length) return; redoStack.push(JSON.stringify(project)); project = JSON.parse(undoStack.pop()); rebuildAll(true); save(); toast("Undone"); }
function redo() { if (running || !redoStack.length) return; undoStack.push(JSON.stringify(project)); project = JSON.parse(redoStack.pop()); rebuildAll(true); save(); toast("Redone"); }
const uid = t => { let i = 1; while (project.parts.some(p => p.id === t + i)) i++; return t + i; };
function toast(m, kind = "", ms = 2600) { const t = $("#toast"); t.innerHTML = m; t.className = "toast on " + kind; clearTimeout(toast._t); toast._t = setTimeout(() => t.classList.remove("on"), ms); }
const boardPart = () => project.parts.find(p => BOARDS[p.type]);
const boardType = () => { const b = boardPart(); return b ? b.type : null; };
const partLabel = p => p.label || PARTS[p.type].label;

/* ---------- parts on the canvas ---------- */
function applyAttrs(el, attrs) { Object.entries(attrs || {}).forEach(([k, v]) => el.setAttribute(k, v)); }
function makePart(p) {
  const def = PARTS[p.type]; if (!def) return;
  const wrap = document.createElement("div"); wrap.className = "part " + (def.kind || "") + " t-" + p.type; wrap.dataset.id = p.id;
  const el = document.createElement(def.tag);
  applyAttrs(el, Object.assign({}, def.attrs, p.attrs));
  wrap.appendChild(el);
  // ESP32 pin names are printed very small on the real board: make them bigger and bold so they read at normal zoom
  if (p.type === "esp32") requestAnimationFrame(() => { const sr = el.shadowRoot; if (sr && !sr.querySelector("style.cl")) { const st = document.createElement("style"); st.className = "cl"; st.textContent = 'text[font-size="3.72px"]{font-size:4.6px;font-weight:700;letter-spacing:-.15px}'; sr.appendChild(st); } });
  if (p.label) { const lb = document.createElement("span"); lb.className = "plabel"; lb.textContent = p.label; wrap.appendChild(lb); }
  $("#parts").appendChild(wrap);
  p.sim = Object.assign({}, def.sim || {}, p.sim || {});
  const state = { keys: new Set() };
  rt[p.id] = { el, wrap, w: 0, h: 0, state };
  const sw = () => { if (sim) sim.switchChanged(p.id); };
  el.addEventListener("button-press", e => { state.pressed = true; if (p.type === "keypad" && e.detail) state.keys.add((e.detail.row + 1) + "," + (e.detail.column + 1)); sw(); });
  el.addEventListener("button-release", e => { state.pressed = false; if (p.type === "keypad" && e.detail) state.keys.delete((e.detail.row + 1) + "," + (e.detail.column + 1)); sw(); });
  if (p.type === "slideswitch") el.addEventListener("input", () => { state.value = el.value; sw(); });
  if (p.type === "dipswitch") el.addEventListener("switch-change", () => { state.sw = Array.from(el.values || []); sw(); });
  if (p.type === "irremote") el.addEventListener("button-press", e => { if (sim && e.detail && e.detail.irCode != null) { sim.irSend(e.detail.irCode); toast(`Remote: ${esc(e.detail.key)} (0x${e.detail.irCode.toString(16).toUpperCase()})`, "", 1200); } });
  if (p.type === "encoder") {
    const turn = d => { const D = sim && sim.devOf(p.id); if (D && D.turn) D.turn(d); };
    el.addEventListener("rotate-cw", () => turn(1));
    el.addEventListener("rotate-ccw", () => turn(-1));
    el.addEventListener("button-press", () => { const D = sim && sim.devOf(p.id); if (D && D.press) D.press(); });
    el.addEventListener("button-release", () => { const D = sim && sim.devOf(p.id); if (D && D.press) D.press(); });
  }
  el.addEventListener("pininfo-change", () => requestAnimationFrame(() => { measure(p.id); drawWires(); }));
  placePart(p);
  const m = () => { measure(p.id); drawWires(); };
  (el.updateComplete || Promise.resolve()).then(() => requestAnimationFrame(m));
}
function measure(id) {
  const r = rt[id]; if (!r) return;
  r.w = r.el.offsetWidth || r.w; r.h = r.el.offsetHeight || r.h;
  const p = project.parts.find(q => q.id === id); if (p) placePart(p);
}
function placePart(p) {
  const r = rt[p.id]; if (!r) return;
  r.wrap.style.left = p.x + "px"; r.wrap.style.top = p.y + "px";
  r.wrap.style.width = r.w ? r.w + "px" : ""; r.wrap.style.height = r.h ? r.h + "px" : "";
  r.wrap.style.transformOrigin = `${r.w / 2}px ${r.h / 2}px`;
  r.wrap.style.transform = p.rot ? `rotate(${p.rot}deg)` : "";
  r.wrap.classList.toggle("sel", !!(sel && sel.kind === "part" && sel.id === p.id));
  r.wrap.classList.toggle("msel", T.multi.has(p.id));
  const lb = r.wrap.querySelector(".plabel"); if (lb) lb.style.transform = p.rot ? `rotate(${-p.rot}deg)` : "";
}
function pinsWorld(p) {
  const r = rt[p.id]; if (!r || !r.el.pinInfo) return [];
  const cx = r.w / 2, cy = r.h / 2, a = (p.rot || 0) * Math.PI / 180, ca = Math.cos(a), sa = Math.sin(a);
  return r.el.pinInfo.map(q => { const dx = q.x - cx, dy = q.y - cy; return { name: q.name, x: p.x + cx + dx * ca - dy * sa, y: p.y + cy + dx * sa + dy * ca }; });
}
function pinPos(node) { const i = node.indexOf(":"), id = node.slice(0, i), pin = node.slice(i + 1); const p = project.parts.find(q => q.id === id); if (!p) return null; return pinsWorld(p).find(q => q.name === pin) || null; }
function rebuildAll(keepView) {
  stopSim(); $("#parts").innerHTML = ""; Object.keys(rt).forEach(k => delete rt[k]);
  project.parts.forEach(makePart); sel = null; wiring = null;
  $("#pname").value = project.name || "My circuit";
  if (editor && editor.getValue() !== (project.code || "")) editor.setValue(project.code || "");
  updateBoardChip(); drawWires(); showInspector(); renderLessonCard(); renderPhone(); updateEmpty();
  if (!keepView) setTimeout(fit, 120);
}
function updateBoardChip() { const b = boardType(); $("#boardchip").innerHTML = b ? `${ic("chip")}${esc(BOARDS[b].label)}` : `${ic("bolt")}No board`; $("#boardchip").className = "boardchip " + (b || "none"); }
function updateEmpty() { $("#empty").innerHTML = project.parts.length ? "" : `<div><b>Empty canvas</b><p>Drag parts from the left, or open a ready-made circuit.</p><button class="btn primary" data-act="library">${ic("book")}Open the Library</button></div>`; }

/* ---------- wires ---------- */
function autoColor(from, to) {
  const n = (from + " " + to).toUpperCase();
  if (/GND|:-$|:- |VSS|\.BN|\.TN|:K\b/.test(n) && !/5V|VCC|VIN|3V3|3\.3V/.test(n)) return "#2B2D42";
  if (/3V3|3\.3V/.test(n)) return "#F08C00";
  if (/5V|VCC|VIN|V\+|VDD|12V|:\+|\.BP|\.TP/.test(n)) return "#E63946";
  return ["#2E9E5B", "#1F6FD1", "#7B3FC4", "#E8590C", "#20B8A6", "#D6336C"][project.wires.length % 6];
}
/* Which way a pin faces, "v" (up or down) or "h" (left or right). A header pin
   along the top of a board faces up, so a wire that starts by going sideways
   runs straight across the artwork. This lets the wire leave the way it points. */
function pinDir(node) {
  if (!node) return null;
  const i = node.indexOf(":"), id = node.slice(0, i), pin = node.slice(i + 1);
  const p = project.parts.find(q => q.id === id), r = p && rt[p.id];
  if (!r || !r.el || !r.el.pinInfo) return null;
  if (p.type === "breadboard") return null;   /* holes sit in the middle of the board, so they face nowhere */
  const q = r.el.pinInfo.find(z => z.name === pin); if (!q) return null;
  const w = r.w || 1, h = r.h || 1;
  if (w < 2 || h < 2) return null;
  let vert = Math.abs((q.y - h / 2) / h) >= Math.abs((q.x - w / 2) / w);
  if ((((p.rot || 0) % 180) + 180) % 180 === 90) vert = !vert;
  return vert ? "v" : "h";
}
/* The leg that follows a bend turns the corner: if the wire was running up it
   now runs across, and the very first leg leaves the pin the way the pin faces.
   The preview and the committed wire both use this, so they cannot disagree. */
function legIsVertical() {
  const n = wiring.pts.length;
  if (!n) return pinDir(wiring.from) === "v";
  const a = pinPos(wiring.from), last = wiring.pts[n - 1], prev = n > 1 ? wiring.pts[n - 2] : [a.x, a.y];
  return !(Math.abs(last[0] - prev[0]) < 0.5);   // last leg vertical -> this one is not
}
function bendPts(x, y) {
  const n = wiring.pts.length, a = pinPos(wiring.from);
  const last = n ? wiring.pts[n - 1] : [a.x, a.y];
  const X = Math.round(x), Y = Math.round(y);
  return legIsVertical() ? [[last[0], Y], [X, Y]] : [[X, last[1]], [X, Y]];
}
function routePts(a, b, pts, from, to) {
  if (pts && pts.length) {
    const mid = pts.map(([x, y]) => ({ x, y })), last = mid[mid.length - 1], out = [a, ...mid];
    if (Math.abs(last.x - b.x) > 0.5 && Math.abs(last.y - b.y) > 0.5)
      out.push(pinDir(to) === "v" ? { x: b.x, y: last.y } : { x: last.x, y: b.y });
    out.push(b);
    return out;
  }
  if (Math.abs(a.x - b.x) < 1 || Math.abs(a.y - b.y) < 1) return [a, b];
  const da = pinDir(from), db = pinDir(to);
  if (da && db && da === db) {
    /* both pins face the same way: step out, across, and back in, so neither
       end of the wire runs along its own header */
    const m = da === "v" ? (a.y + b.y) / 2 : (a.x + b.x) / 2;
    return da === "v" ? [a, { x: a.x, y: m }, { x: b.x, y: m }, b] : [a, { x: m, y: a.y }, { x: m, y: b.y }, b];
  }
  const first = da || (db === "v" ? "h" : db === "h" ? "v" : "h");
  return first === "v" ? [a, { x: a.x, y: b.y }, b] : [a, { x: b.x, y: a.y }, b];
}
/* polyline with softly rounded corners */
function roundPath(pts, r = 4) {
  let d = `M${pts[0].x.toFixed(1)} ${pts[0].y.toFixed(1)}`;
  for (let i = 1; i < pts.length - 1; i++) {
    const p = pts[i], a = pts[i - 1], b = pts[i + 1];
    const l1 = Math.hypot(p.x - a.x, p.y - a.y), l2 = Math.hypot(b.x - p.x, b.y - p.y), k = Math.min(r, l1 / 2, l2 / 2);
    if (k < 0.5) { d += ` L${p.x.toFixed(1)} ${p.y.toFixed(1)}`; continue; }
    const s = { x: p.x + (a.x - p.x) * k / l1, y: p.y + (a.y - p.y) * k / l1 }, e = { x: p.x + (b.x - p.x) * k / l2, y: p.y + (b.y - p.y) * k / l2 };
    d += ` L${s.x.toFixed(1)} ${s.y.toFixed(1)} Q${p.x.toFixed(1)} ${p.y.toFixed(1)} ${e.x.toFixed(1)} ${e.y.toFixed(1)}`;
  }
  const l = pts[pts.length - 1]; return d + ` L${l.x.toFixed(1)} ${l.y.toFixed(1)}`;
}
/* ---------- sensing fields: drag an object in front of a sensor (like Tinkercad) ---------- */
// range: how far the sensor sees (cm), px: world units per cm, half: half-angle of the cone (deg)
const FIELDS = {
  hcsr04: { range: 400, px: 0.55, half: 15, obj: "ball", tip: "Drag the ball: distance" },
  pir: { range: 700, px: 0.3, half: 55, obj: "person", tip: "Move the person inside the cone to trigger motion" },
  ir: { range: 30, px: 3.2, half: 18, obj: "box", tip: "Drag the object in front of the sensor" },
  flame: { range: 100, px: 1.6, half: 30, obj: "flame", tip: "Bring the flame closer" },
};
function fieldGeom(p) {
  const r = rt[p.id], pins = pinsWorld(p); if (!r || !pins.length) return null;
  const cx = p.x + r.w / 2, cy = p.y + r.h / 2;
  let mx = 0, my = 0; pins.forEach(q => { mx += q.x; my += q.y; }); mx /= pins.length; my /= pins.length;
  let dx = cx - mx, dy = cy - my; const L = Math.hypot(dx, dy) || 1; dx /= L; dy /= L;
  const rot = (p.rot || 0) % 180 !== 0, w = rot ? r.h : r.w, h = rot ? r.w : r.h;
  const reach = Math.abs(dx) * w / 2 + Math.abs(dy) * h / 2;
  return { ox: cx + dx * reach, oy: cy + dy * reach, dx, dy, ang: Math.atan2(dy, dx) };
}
function fieldState(p) {
  const F = FIELDS[p.type], s = p.sim || (p.sim = {});
  if (s.fd == null) {
    const active = p.type === "hcsr04" ? true : p.type === "ir" ? !!s.obstacle : p.type === "flame" ? +s.flame > 0 : false;
    s.fd = p.type === "hcsr04" ? Math.min(+s.dist || 40, F.range) : p.type === "flame" && active ? F.range * (1 - s.flame / 100) : active ? F.range * 0.5 : F.range * 1.1; s.fa = 0; s.fout = false;
  }
  return s;
}
function applyField(p, moved) {
  const F = FIELDS[p.type], s = fieldState(p), inside = !s.fout && Math.abs(s.fa) <= F.half && s.fd <= F.range;
  if (p.type === "hcsr04") s.dist = inside ? Math.max(2, Math.round(s.fd)) : 400;
  if (p.type === "ir") s.obstacle = inside;
  if (p.type === "flame") s.flame = inside ? Math.round(100 * Math.max(0, 1 - s.fd / F.range)) : 0;
  if (p.type === "pir") { if (!(inside && moved)) return inside; s.motion = true; }
  if (sim) sim.simChanged(p.id);
  return inside;
}
function drawFields() {
  const svg = $("#fields"); if (!svg) return;
  const p = sel && sel.kind === "part" ? project.parts.find(q => q.id === sel.id) : null;
  if (!p || !FIELDS[p.type] || drag) { svg.innerHTML = ""; if (!p) drawFields._for = null; return; }
  const F = FIELDS[p.type], g = fieldGeom(p); if (!g) { svg.innerHTML = ""; return; }
  const s = fieldState(p), R = F.range * F.px, h = F.half * Math.PI / 180;
  if (drawFields._for !== p.id) { drawFields._for = p.id; setTimeout(() => showField(p, g, R + 30), 0); }
  if (p.type === "hcsr04" && !s.fout && Math.abs(s.fa) <= F.half && +s.dist < 400 && Math.abs(s.fd - s.dist) > 1) s.fd = +s.dist;   // follow the slider
  const pt = (a, d) => [g.ox + Math.cos(g.ang + a) * d, g.oy + Math.sin(g.ang + a) * d];
  const [ax, ay] = pt(-h, R), [bx, by] = pt(h, R);
  const inside = !s.fout && Math.abs(s.fa) <= F.half && s.fd <= F.range;
  const fa = s.fa * Math.PI / 180, [px, py] = pt(fa, Math.min(s.fd, F.range * 1.15) * F.px);
  let rings = ""; for (let k = 1; k <= 4; k++) { const rr = R * k / 4, [r1x, r1y] = pt(-h, rr), [r2x, r2y] = pt(h, rr); rings += `<path d="M${r1x} ${r1y} A${rr} ${rr} 0 0 1 ${r2x} ${r2y}" class="fring"/>`; const [tx, ty] = pt(h + 0.06, rr); rings += `<text x="${tx}" y="${ty}" class="ftick">${Math.round(F.range * k / 4)} cm</text>`; }
  const objs = {
    ball: `<circle r="11" fill="url(#fball)" stroke="#9A3412" stroke-width="1.2"/>`,
    person: `<g fill="#1E293B"><circle cy="-15" r="6"/><path d="M-8 14 L-5 -5 Q0 -9 5 -5 L8 14 Z"/></g><circle r="20" fill="none" stroke="rgba(30,41,59,.25)" stroke-dasharray="3 3"/>`,
    box: `<rect x="-10" y="-10" width="20" height="20" rx="3" fill="#8A5A00" stroke="#5C3D00"/>`,
    flame: `<path d="M0 -16 C8 -6 10 2 6 9 C3 14 -3 14 -6 9 C-10 2 -6 -6 0 -16 Z" fill="#FF7A1A"/><path d="M0 -5 C4 0 4 5 2 8 C0 10 -2 10 -3 8 C-4 5 -3 0 0 -5 Z" fill="#FFE066"/>`,
  };
  const val = p.type === "hcsr04" ? (inside ? `${Math.round(s.fd)} cm` : "nothing in range") : p.type === "pir" ? (inside ? "in view: move to trigger" : "out of view") : p.type === "ir" ? (inside ? "object detected" : "nothing in front") : (inside ? `flame ${s.flame}%` : "no flame");
  svg.innerHTML = `<defs><radialGradient id="fball" cx=".35" cy=".35"><stop offset="0" stop-color="#FDBA74"/><stop offset="1" stop-color="#EA580C"/></radialGradient></defs>
    <path d="M${g.ox} ${g.oy} L${ax} ${ay} A${R} ${R} 0 0 1 ${bx} ${by} Z" class="fcone ${inside ? "hit" : ""}"/>${rings}
    ${inside ? `<line x1="${g.ox}" y1="${g.oy}" x2="${px}" y2="${py}" class="fbeam"/>` : ""}
    <g class="fobj" data-fpart="${p.id}" transform="translate(${px} ${py})">${objs[F.obj]}<title>${F.tip}</title></g>
    <g transform="translate(${px} ${py + 26})"><rect x="-48" y="-9" width="96" height="17" rx="8.5" class="fval ${inside ? "hit" : ""}"/><text y="3.5" class="fvalt">${val}</text></g>`;
}
/* pan (and zoom out if needed) so the whole sensing cone is on screen */
function showField(p, g, R) {
  const r = rt[p.id], st = $("#stage").getBoundingClientRect(); if (!r) return;
  const xs = [p.x, p.x + r.w, g.ox + g.dx * R, g.ox + (g.dx - g.dy * 0.5) * R, g.ox + (g.dx + g.dy * 0.5) * R], ys = [p.y, p.y + r.h, g.oy + g.dy * R, g.oy + (g.dy + g.dx * 0.5) * R, g.oy + (g.dy - g.dx * 0.5) * R];
  const x0 = Math.min(...xs), x1 = Math.max(...xs), y0 = Math.min(...ys), y1 = Math.max(...ys), pad = 30;
  const sx0 = x0 * view.z + view.x, sx1 = x1 * view.z + view.x, sy0 = y0 * view.z + view.y, sy1 = y1 * view.z + view.y;
  if (sx0 >= pad && sx1 <= st.width - pad && sy0 >= 60 && sy1 <= st.height - pad) return;
  const z = Math.min(view.z, (st.width - pad * 2) / (x1 - x0), (st.height - 60 - pad) / (y1 - y0));
  animateView({ z, x: st.width / 2 - (x0 + x1) / 2 * z, y: 60 + (st.height - 60 - pad) / 2 - (y0 + y1) / 2 * z }, 320);
}
let fdrag = null;
function fieldPointer(e) {
  const o = e.target.closest(".fobj"); if (!o) return false;
  e.preventDefault(); e.stopPropagation();
  fdrag = { id: o.dataset.fpart, last: 0 }; o.setPointerCapture && o.setPointerCapture(e.pointerId);
  return true;
}
function fieldMove(e) {
  if (!fdrag) return false;
  const p = project.parts.find(q => q.id === fdrag.id); if (!p) { fdrag = null; return false; }
  const F = FIELDS[p.type], g = fieldGeom(p), [wx, wy] = toWorld(e.clientX, e.clientY), s = fieldState(p);
  const dx = wx - g.ox, dy = wy - g.oy, d = Math.hypot(dx, dy) / F.px;
  let a = (Math.atan2(dy, dx) - g.ang) * 180 / Math.PI; a = ((a + 540) % 360) - 180;
  s.fd = Math.min(F.range * 1.15, Math.max(p.type === "hcsr04" ? 2 : 1, d)); s.fa = Math.max(-80, Math.min(80, a)); s.fout = d > F.range * 1.12 || Math.abs(a) > 75;
  applyField(p, true); drawFields();
  if (p.type === "hcsr04") { const r = $('#inspector input[data-prop="dist"]'); if (r) { r.value = s.dist; r.closest("label").querySelector("b").textContent = s.dist + " cm"; } }
  if (p.type === "flame") { const r = $('#inspector input[data-prop="flame"]'); if (r) { r.value = s.flame; r.closest("label").querySelector("b").textContent = s.flame + " %"; } }
  if (p.type === "ir") { const r = $('#inspector input[data-prop="obstacle"]'); if (r) r.checked = !!s.obstacle; }
  return true;
}
function fieldUp() { if (!fdrag) return false; fdrag = null; save(); return true; }

function drawWires() {
  const svg = $("#wires"); let s = "";
  project.wires.forEach((w, i) => {
    const a = pinPos(w.from), b = pinPos(w.to); if (!a || !b) return;
    const pts = routePts(a, b, w.pts, w.from, w.to), d = roundPath(pts), on = sel && sel.kind === "wire" && sel.id === i;
    const tint = T.wireTint(w);
    const c = tint || w.color || "#2E9E5B", light = /^#F|#FFF/i.test(c);
    s += `<path class="whit" data-wire="${i}" d="${d}"/><path class="wire-o ${on ? "on" : ""}" d="${d}"/><path class="wire ${light ? "light" : ""}" d="${d}" stroke="${c}"/><circle class="wend" cx="${a.x}" cy="${a.y}" r="2.4" fill="${c}"/><circle class="wend" cx="${b.x}" cy="${b.y}" r="2.4" fill="${c}"/>`;
    if (on && !running) (w.pts || []).forEach(([x, y], k) => { s += `<circle class="whandle" data-wire="${i}" data-pt="${k}" cx="${x}" cy="${y}" r="4"/>`; });
  });
  if (wiring) {
    const a = pinPos(wiring.from), m = wiring.mouse;
    if (a && m) {
      const pts = [a, ...wiring.pts.map(([x, y]) => ({ x, y }))];
      bendPts(m[0], m[1]).forEach(([x, y]) => pts.push({ x, y }));
      const gc = penColor === "auto" ? (hoverPin ? autoColor(wiring.from, hoverPin) : "#94A3B8") : penColor;
      s += `<path class="wire ghost" d="${roundPath(pts)}" stroke="${gc}"/>`;
    }
  }
  svg.innerHTML = s;
  drawPins(); drawFields();
}
function drawPins() {
  const g = $("#pins"); if (running && !T.state.probe) { g.innerHTML = ""; return; }
  let s = "";
  /* Only the pins near the cursor are drawn. Covering every part at once put
     hundreds of dots over the artwork, which is what made the board look muddy,
     and because these are world coordinates they grew with the zoom until they
     swallowed the header. The radius is divided by the zoom so a dot is always
     the same size on screen. */
  const R = 58 / view.z;                                   // how close before a pin appears
  const r0 = 4.2 / view.z, rbb = 3.2 / view.z;
  const px = ptr ? ptr[0] : null, py = ptr ? ptr[1] : null;
  const src = wiring ? wiring.from : null;
  ptrDrawn = ptr ? [px, py] : null;
  const used = new Set(); project.wires.forEach(w => { used.add(w.from); used.add(w.to); });
  project.parts.forEach(p => pinsWorld(p).forEach(q => {
    const node = p.id + ":" + q.name, bb = p.type === "breadboard";
    const near = px != null && Math.hypot(q.x - px, q.y - py) <= R;
    /* the pin the wire started from stays put, so the student can see where they came from */
    if (!near && node !== src && node !== hoverPin) return;
    s += `<circle class="pin ${used.has(node) ? "used" : ""} ${bb ? "bb" : ""} ${hoverPin === node ? "hot" : ""} ${node === src ? "src" : ""}" data-pin="${esc(node)}" cx="${q.x}" cy="${q.y}" r="${bb ? rbb : r0}"/>`;
  }));
  if (sel && sel.kind === "wire" && !running) { const w = project.wires[sel.id]; (w && w.pts || []).forEach(([x, y], k) => { s += `<circle class="whandle" data-wire="${sel.id}" data-pt="${k}" cx="${x}" cy="${y}" r="4.5"/>`; }); }
  g.innerHTML = s;
}
function pinTitle(node) {
  const i = node.indexOf(":"), id = node.slice(0, i), pin = node.slice(i + 1), p = project.parts.find(q => q.id === id); if (!p) return "";
  if (BOARDS[p.type]) { const bp = BOARDS[p.type].pins[pin]; return `${esc(BOARDS[p.type].label)} · <b>${esc(pin.replace(/\.\d$/, ""))}</b>${bp && bp.label && bp.label !== pin ? ` <span>${esc(bp.label)}${bp.pwm ? " · PWM" : ""}${bp.adc != null ? " · analog" : ""}</span>` : ""}`; }
  if (p.type === "breadboard") { if (/^[tb][np]\./.test(pin)) return `Breadboard · <b>${pin[1] === "p" ? "+ rail" : "− rail"}</b>`; return `Breadboard · hole <b>${esc(pin)}</b>`; }
  return `${esc(partLabel(p))} · <b>${esc(pin)}</b>`;
}

/* ---------- schematic view ----------
   The circuit redrawn as a diagram. Read-only on purpose: it is generated from
   the netlist each time it opens, so it can never disagree with what was built. */
let schSVG = "";
function showSchematic() {
  if (!project.parts.length) return toast("Build a circuit first, then open the schematic.");
  const states = {}; project.parts.forEach(q => { states[q.id] = rt[q.id] ? rt[q.id].state : {}; });
  let net; try { net = new Netlist(project, pinsWorld, states); } catch (e) { return toast("Could not read the circuit", "warn"); }
  let out; try { out = buildSchematic({ project, rt, net, PARTS, BOARDS, partLabel, title: project.name || "Circuit" }); }
  catch (e) { console.error(e); return toast("Could not draw the schematic", "warn"); }
  if (!out.svg) return toast("There is nothing to draw yet.");
  schSVG = out.svg;
  let box = $("#schview");
  if (!box) { box = document.createElement("div"); box.id = "schview"; box.className = "schview"; $("#stage").appendChild(box); }
  box.innerHTML = `<header><b>${ic("sch")}Schematic view</b><small>Drawn from your circuit. The breadboard is gone; the connections it made stay.</small><span class="grow"></span>`
    + `<button class="cbtn" data-act="schsvg">${ic("dl")}Download SVG</button><button class="cbtn icon" data-act="schclose" title="Close">${ic("x")}</button></header>`
    + `<div class="schbody">${out.svg}</div>`;
  box.classList.add("on");
}
function downloadSchematic() {
  if (!schSVG) return;
  const a = document.createElement("a"), url = URL.createObjectURL(new Blob([schSVG], { type: "image/svg+xml" }));
  a.href = url; a.download = (project.name || "circuit").replace(/[^\w\- ]+/g, "").trim().replace(/\s+/g, "-") + "-schematic.svg";
  document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(url), 4000);
  toast("Schematic saved as an SVG");
}

/* ---------- view ---------- */
function applyView() { const r = window.devicePixelRatio || 1, sx = Math.round(view.x * r) / r, sy = Math.round(view.y * r) / r; $("#world").style.transform = `translate(${sx}px, ${sy}px) scale(${view.z})`; $("#zoomv").textContent = Math.round(view.z * 100) + "%"; positionInspector(); }
function toWorld(cx, cy) { const r = $("#stage").getBoundingClientRect(); return [(cx - r.left - view.x) / view.z, (cy - r.top - view.y) / view.z]; }
function zoomAt(f, cx, cy) {
  const r = $("#stage").getBoundingClientRect(); cx = cx ?? r.left + r.width / 2; cy = cy ?? r.top + r.height / 2;
  const [wx, wy] = toWorld(cx, cy); view.z = Math.max(0.25, Math.min(4, view.z * f));
  view.x = cx - r.left - wx * view.z; view.y = cy - r.top - wy * view.z; applyView();
}
/* smooth move of the camera (double-click a part to zoom to it, double-click empty space to see everything) */
function animateView(to, ms = 240) {
  const from = Object.assign({}, view), t0 = performance.now();
  cancelAnimationFrame(animateView._r);
  const step = t => { const k = Math.min(1, (t - t0) / ms), e = 1 - Math.pow(1 - k, 3);
    view.x = from.x + (to.x - from.x) * e; view.y = from.y + (to.y - from.y) * e; view.z = from.z + (to.z - from.z) * e; applyView();
    if (k < 1) animateView._r = requestAnimationFrame(step); };
  animateView._r = requestAnimationFrame(step);
}
function zoomToPart(id) {
  const r = rt[id], p = project.parts.find(q => q.id === id); if (!r || !p) return;
  const st = $("#stage").getBoundingClientRect(), rot = (p.rot || 0) % 180 !== 0, w = rot ? r.h : r.w, h = rot ? r.w : r.h, cx = p.x + r.w / 2, cy = p.y + r.h / 2;
  const z = Math.max(0.5, Math.min(3.2, Math.min(st.width * 0.55 / w, st.height * 0.6 / h)));
  animateView({ z, x: st.width / 2 - cx * z, y: st.height / 2 - cy * z });
}
function fitAnimated() { const keep = Object.assign({}, view); fit(); const to = Object.assign({}, view); Object.assign(view, keep); applyView(); animateView(to); }
function bounds() {
  let x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9;
  project.parts.forEach(p => { const r = rt[p.id]; const w = r ? r.w : 50, h = r ? r.h : 50, rot = (p.rot || 0) % 180 !== 0; const vw = rot ? h : w, vh = rot ? w : h, cx = p.x + w / 2, cy = p.y + h / 2; x0 = Math.min(x0, cx - vw / 2); y0 = Math.min(y0, cy - vh / 2); x1 = Math.max(x1, cx + vw / 2); y1 = Math.max(y1, cy + vh / 2); });
  project.wires.forEach(w => (w.pts || []).forEach(([x, y]) => { x0 = Math.min(x0, x); y0 = Math.min(y0, y); x1 = Math.max(x1, x); y1 = Math.max(y1, y); }));
  return { x0, y0, x1, y1 };
}
function fit() {
  if (!project.parts.length) return;
  const b = bounds(), st = $("#stage").getBoundingClientRect(), padL = 40, padT = $("#lessoncard").classList.contains("on") ? 124 : 56, padB = 56;
  view.z = Math.max(0.25, Math.min(1.7, Math.min((st.width - padL * 2) / (b.x1 - b.x0 || 1), (st.height - padT - padB) / (b.y1 - b.y0 || 1))));
  view.x = (st.width - (b.x1 - b.x0) * view.z) / 2 - b.x0 * view.z; view.y = padT + (st.height - padT - padB - (b.y1 - b.y0) * view.z) / 2 - b.y0 * view.z; applyView();
}

/* ---------- component panel ---------- */
function renderCats() { $("#pcats").innerHTML = ["All", ...CATS].map(c => `<button class="${c === catFilter ? "on" : ""}" data-cat="${esc(c)}">${esc(c)}</button>`).join(""); }
function renderPalette() {
  const q = ($("#psearch").value || "").toLowerCase();
  const cats = catFilter === "All" ? CATS : [catFilter];
  $("#plist").innerHTML = cats.map(c => {
    const items = Object.entries(PARTS).filter(([k, d]) => d.cat === c && (!q || (d.label + " " + k + " " + (d.kit || []).join(" ") + " " + (d.help || "")).toLowerCase().includes(q)));
    if (!items.length) return "";
    const tile = ([k, d]) => `<button class="tile" draggable="true" data-add="${k}" title="${esc(d.help || "")}"><span class="tthumb" data-thumb="${k}"></span><span class="tname">${esc(d.label)}</span></button>`;
    const head = catFilter === "All" ? `<h4>${esc(c)}</h4>` : "";
    /* a searching student wants one flat list of hits, not shelves to open */
    const order = SHELF_ORDER[c];
    if (q || !order) return `<div class="tcat">${head}<div class="tgrid">${items.map(tile).join("")}</div></div>`;
    const bins = {};
    items.forEach(it => { const g = SHELF[it[0]] || "More"; (bins[g] = bins[g] || []).push(it); });
    const shelves = order.filter(g => bins[g] && bins[g].length)
      .map(g => `<div class="tshelf"><h5>${esc(g)}</h5><div class="tgrid">${bins[g].map(tile).join("")}</div></div>`).join("");
    return `<div class="tcat">${head}${shelves}</div>`;
  }).join("") || `<p class="muted pad">No parts match “${esc(q)}”.</p>`;
  $$("[data-thumb]").forEach(t => {
    const d = PARTS[t.dataset.thumb], el = document.createElement(d.tag);
    applyAttrs(el, d.attrs); t.appendChild(el);
    const fitThumb = n => { const r = el.getBoundingClientRect(), w = r.width, h = r.height; if ((!w || !h) && n < 25) return setTimeout(() => fitThumb(n + 1), 60); const box = t.getBoundingClientRect(), bw = box.width || 64, bh = box.height || 48; const s = Math.min((bw - 6) / (w || bw), (bh - 6) / (h || bh), 1.8); el.style.transform = `translate(${(bw - w * s) / 2}px,${(bh - h * s) / 2}px) scale(${s})`; el.style.opacity = 1; };
    el.style.opacity = 0; (el.updateComplete || Promise.resolve()).then(() => requestAnimationFrame(() => fitThumb(0)));
  });
}
function addPart(type, x, y) {
  if (running) return toast("Stop the simulation to change the circuit");
  const def = PARTS[type];
  if (def.kind === "board" && boardPart()) return toast(`There is already a ${esc(BOARDS[boardType()].label)}. Delete it first to switch boards.`);
  snapshot();
  if (x == null) { const st = $("#stage").getBoundingClientRect(); [x, y] = toWorld(st.left + st.width / 2 - 40, st.top + st.height / 2 - 40); }
  while (project.parts.some(q => Math.abs(q.x - x) < 14 && Math.abs(q.y - y) < 14)) { x += 36; y += 28; }
  const p = { id: uid(type), type, x: Math.round(x), y: Math.round(y), rot: type === "esp32" ? 90 : 0 };
  project.parts.push(p); makePart(p); sel = { kind: "part", id: p.id };
  if (def.kind === "board") { updateBoardChip(); if (type === "esp32" && /LED_BUILTIN, OUTPUT\);\n}\n\nvoid loop\(\) {\n  digitalWrite\(LED_BUILTIN, HIGH/.test(editor.getValue())) editor.setValue(CODE_ESP); }
  save(); setTimeout(() => { showInspector(); drawWires(); updateEmpty(); }, 60);
}
function allSel() { const ids = new Set(T.multi); if (sel && sel.kind === "part") ids.add(sel.id); return [...ids]; }
function deleteSel() {
  if (running || !sel) return;
  snapshot();
  if (sel.kind === "part") {
    const ids = allSel();
    project.parts = project.parts.filter(p => !ids.includes(p.id));
    project.wires = project.wires.filter(w => !ids.some(id => w.from.startsWith(id + ":") || w.to.startsWith(id + ":")));
    ids.forEach(id => { rt[id] && rt[id].wrap.remove(); delete rt[id]; });
    T.multi.clear();
  } else project.wires.splice(sel.id, 1);
  sel = null; save(); drawWires(); showInspector(); updateBoardChip(); updateEmpty();
}
function rotateSel() {
  if (running || !sel || sel.kind !== "part") return; snapshot();
  allSel().forEach(id => { const p = project.parts.find(q => q.id === id); if (p) { p.rot = ((p.rot || 0) + 90) % 360; placePart(p); } });
  save(); drawWires(); positionInspector();
}

/* ---------- inspector (next to the selected part) ---------- */
function codeName(n, board) {
  if (n == null) return null;
  if (board === "esp32") return String(n);
  const pins = (BOARDS[board] || BOARDS.uno).pins;
  const hit = Object.keys(pins).find(k => pins[k].n === n && /^A?\d+$/.test(k));
  if (hit) return hit;
  return n < 14 ? String(n) : "A" + (n - 14);
}
function partCode(p) {
  const d = PARTS[p.type]; if (!d.code) return null;
  let net = null; try { const st = {}; project.parts.forEach(q => { st[q.id] = rt[q.id] ? rt[q.id].state : {}; }); net = new Netlist(project, pinsWorld, st); } catch (e) { }
  const b = boardType() || "uno", pinNames = (rt[p.id].el.pinInfo || []).map(q => q.name);
  let missing = [];
  const code = d.code.replace(/\{([A-Za-z0-9.+\-/]+)\}/g, (m, k) => {
    if (!pinNames.includes(k)) return m;
    const n = net ? net.mcuPinOf(p.id, k) : null;
    if (n != null) return codeName(n, b);
    missing.push(k); return String(defaultPin(d, k, b));
  });
  return { code: b === "esp32" ? code.replace(/Serial\.begin\(9600\)/g, "Serial.begin(115200)") : code, missing };
}
function showInspector() {
  const box = $("#inspector"); drawFields();
  $("#partcodebtn").hidden = !(sel && sel.kind === "part" && PARTS[(project.parts.find(q => q.id === sel.id) || {}).type || ""]?.code);
  /* The swatches are always there, like Tinkercad's wire colour: they set the
     colour the next wire is drawn in, and recolour the wire if one is selected. */
  const selw = sel && sel.kind === "wire" ? project.wires[sel.id] : null;
  const swOn = selw ? (selw.color || null) : (penColor === "auto" ? null : penColor);
  $("#wcolors").innerHTML = running ? "" :
    (selw && selw.pts && selw.pts.length ? `<button class="cbtn tiny" data-act="wstraight" title="Remove this wire\u2019s bends">Straighten</button>` : "") +
    `<button class="sw auto ${swOn === null ? "on" : ""}" data-wcolor="auto" title="Automatic: red for 5V, black for GND, orange for 3V3">A</button>` +
    WIRE_COLORS.map(c => `<button class="sw ${swOn === c ? "on" : ""}" data-wcolor="${c}" style="--c:${c}" title="Wire colour"></button>`).join("");
  if (!sel || sel.kind !== "part") { box.classList.remove("on"); box.innerHTML = ""; return; }
  const p = project.parts.find(q => q.id === sel.id); if (!p) { sel = null; return showInspector(); }
  const d = PARTS[p.type];
  const props = (d.props || []).filter(x => running ? (x.live || !x.sim) : true).map(x => {
    const val = x.sim ? (p.sim || {})[x.k] : ((p.attrs || {})[x.k] ?? (d.attrs || {})[x.k]);
    const dis = running && !x.live ? "disabled" : "";
    if (x.type === "select") return `<label class="f"><span>${esc(x.label)}</span><select data-prop="${x.k}" ${dis}>${x.opts.map(o => `<option ${String(o) === String(val) ? "selected" : ""}>${esc(o)}</option>`).join("")}</select></label>`;
    if (x.type === "range") return `<label class="f rng"><span>${esc(x.label)} <b>${esc(val)}${esc(x.unit || "")}</b></span><input type="range" data-prop="${x.k}" min="${x.min}" max="${x.max}" step="${x.step || 1}" value="${val}"></label>`;
    if (x.type === "toggle") return `<label class="f tog"><input type="checkbox" data-prop="${x.k}" ${val ? "checked" : ""}><i></i><span>${esc(x.text || x.label)}</span></label>`;
    if (x.type === "button") return `<button class="btn wide" data-pbtn="${x.k}">${esc(x.text)}</button>`;
    if (x.type === "text") return `<label class="f"><span>${esc(x.label)}</span><textarea class="ptext" data-prop="${x.k}" rows="3" ${dis}>${esc(val)}</textarea></label>`;
    if (x.type === "color") return `<label class="f"><span>${esc(x.label)}</span><span class="colors">${["#E63946", "#F08C00", "#F5D33D", "#2E9E5B", "#1F6FD1", "#7B3FC4", "#FFFFFF", "#2B2D42"].map(c => `<button class="sw ${String(val).toUpperCase() === c ? "on" : ""}" data-pcolor="${c}" style="--c:${c}"></button>`).join("")}</span></label>`;
    return "";
  }).join("");
  const cards = p.type === "rfid" ? `<div class="f"><span>Tap a card on the reader</span><div class="cardrow">${CARDS.map((c, i) => `<button class="btn" data-card="${i}" ${running ? "" : "disabled"}>${esc(c.name)}</button>`).join("")}</div>${running ? "" : `<small class="muted">Start the simulation first.</small>`}</div>` : "";
  const live = running && (d.props || []).some(x => x.live);
  const nsel = allSel().length;
  box.innerHTML = `<div class="ih"><div><b>${esc(partLabel(p))}</b><small>${nsel > 1 ? nsel + " parts selected" : esc(p.id) + (live ? " · change it while running" : "")}</small></div><button class="ix" data-act="deselect" title="Close">${ic("x")}</button></div>
    ${props || cards ? `<div class="ifields">${props}${cards}</div>` : ""}
    ${d.help ? `<p class="ihelp">${esc(d.help)}</p>` : ""}
    <div class="ibtns">${d.code ? `<button class="btn" data-act="partcode">${ic("code")}Example code</button>` : ""}${running ? "" : `<button class="btn" data-act="rotate">${ic("rot")}Rotate</button><button class="btn danger" data-act="delete">${ic("del")}</button>`}</div>`;
  box.classList.add("on");
  positionInspector();
}
function positionInspector() {
  const box = $("#inspector"); if (!box.classList.contains("on") || !sel || sel.kind !== "part") return;
  const r = rt[sel.id]; if (!r) return;
  const pr = r.wrap.getBoundingClientRect(), st = $("#stage").getBoundingClientRect(), bw = box.offsetWidth || 270, bh = box.offsetHeight || 200;
  const L = pr.left - st.left, R = pr.right - st.left, T = pr.top - st.top, B = pr.bottom - st.top, gap = 14, top = 56;
  // try right, left, below, above; never on the side a sensing cone points to
  const fp = project.parts.find(q => q.id === sel.id), fg = fp && FIELDS[fp.type] ? fieldGeom(fp) : null;
  const banned = fg ? (Math.abs(fg.dx) > Math.abs(fg.dy) ? (fg.dx > 0 ? "right" : "left") : (fg.dy > 0 ? "below" : "above")) : "";
  const cands = [["right", R + gap, T], ["left", L - bw - gap, T], ["below", L, B + gap], ["above", L, T - bh - gap]].filter(c => c[0] !== banned);
  const fits = ([, x, y]) => x >= 8 && x + bw <= st.width - 8 && y >= top - 40 && y + bh <= st.height - 8;
  let c = cands.find(c => fits([c[0], c[1], Math.max(top, Math.min(st.height - bh - 10, c[2]))]) && (c[0] === "below" || c[0] === "above" ? true : true));
  let x, y;
  if (c) { x = c[1]; y = c[2]; } else { x = R + gap; y = T; }
  x = Math.max(8, Math.min(st.width - bw - 8, x)); y = Math.max(top, Math.min(st.height - bh - 10, y));
  box.style.left = x + "px"; box.style.top = y + "px";
}

/* ---------- compile + run ---------- */
async function compile(code, board) {
  const prep = prepareSketch(code, board);
  /* The editor itself is cached and runs with no connection, but the sketch is
     compiled by a server. Saying so plainly beats a raw network error. */
  if (navigator.onLine === false) throw new Error("You are offline. The editor works offline, but compiling needs the internet. The desktop version of Circuit Lab has the compiler built in.");
  let res;
  try {
    res = await fetch(BUILD_URL, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ sketch: prep.sketch, files: prep.files, board: BOARDS[board].build }) });
  } catch (e) {
    throw new Error("Could not reach the compiler. Check the connection and try again.");
  }
  if (!res.ok) throw new Error("Build server error " + res.status);
  const r = await res.json(); r.prep = prep; return r;
}
function setOutput(html, err) { const o = $("#buildout"); o.innerHTML = html; o.classList.toggle("err", !!err); }
function errLines(stderr, map) { const out = []; const re = /sketch\.ino:(\d+):(\d+): (error|warning): (.*)/g; let m; while ((m = re.exec(stderr))) out.push({ line: map(+m[1]), col: +m[2], kind: m[3], msg: m[4] }); return out; }
function markErrors(list) {
  for (let i = 0; i < editor.lineCount(); i++) editor.removeLineClass(i, "background", "cm-errline");
  const errs = list.filter(e => e.kind === "error");
  errs.forEach(e => { if (e.line >= 1) editor.addLineClass(e.line - 1, "background", "cm-errline"); });
  if (errs.length && errs[0].line >= 1) editor.scrollIntoView({ line: errs[0].line - 1, ch: 0 }, 80);
}
function friendly(e) {
  let msg = e.msg, tip = "";
  if (/was not declared in this scope/.test(msg)) tip = "Check the spelling and capital letters, or declare it before you use it.";
  else if (/expected ';'/.test(msg)) tip = "A semicolon ; is missing at the end of the line before.";
  else if (/expected '\)'|expected '\}'|expected '\{'/.test(msg)) tip = "A bracket is missing or extra. Count your ( ) and { }.";
  else if (/No such file or directory/.test(msg)) tip = "This library is not available in Circuit Lab. See Help › Libraries.";
  else if (/does not name a type/.test(msg)) tip = "Is a library #include missing at the top, or is a type spelled wrong?";
  else if (/redefinition|previously declared/.test(msg)) tip = "Two things have the same name.";
  else if (/invalid conversion|cannot convert/.test(msg)) tip = "The value is the wrong type here (for example text where a number is needed).";
  return `<div class="emsg"><b>Line ${e.line}</b> ${esc(msg)}${tip ? `<small>${esc(tip)}</small>` : ""}</div>`;
}
/* Compiling takes a second or two every time Start simulation is pressed, so
   the chip comes up over the canvas. It waits 250ms first: a fast compile
   should not make the screen flash. */
let buildT = null;
function buildBusy(on) {
  const box = $("#clbusy"); if (!box) return;
  if (on) { clearTimeout(buildT); buildT = setTimeout(() => box.classList.add("on"), 250); }
  else { clearTimeout(buildT); buildT = null; box.classList.remove("on"); }
}
async function runSim() {
  if (running) return;
  project.code = editor.getValue(); save();
  const btn = $("#runbtn"), board = boardType();
  if (!project.parts.length) return toast("Add some parts first");
  btn.disabled = true; btn.innerHTML = `<span class="spin"></span><span>Compiling…</span>`;
  if (board) buildBusy(true);
  let program, bt = board;
  try {
    if (board) {
      setOutput("Compiling your sketch…");
      const r = await compile(project.code, board);
      const list = errLines(r.stderr || "", r.prep.mapLine);
      if (!r.hex) {
        markErrors(list); tab("code");
        setOutput((list.filter(e => e.kind === "error").map(friendly).join("") || esc(r.stderr || "Compile failed")) + (r.prep.notes || []).map(n => `<div class="emsg"><small>${esc(n)}</small></div>`).join(""), true);
        throw 0;
      }
      markErrors([]);
      const used = /Sketch uses (\d+) bytes \((\d+)%\)/.exec(r.stdout || ""), ram = /Global variables use (\d+) bytes \((\d+)%\)/.exec(r.stdout || "");
      setOutput(`<span class="ok">${ic("check")}Compiled</span> ${used ? `· program ${used[2]}%` : ""} ${ram ? `· memory ${ram[2]}%` : ""}${board === "esp32" ? " · ESP32 teaching mode" : ""}`);
      program = loadHex(r.hex, BOARDS[board].mcu.flash);
    } else { bt = "uno"; program = new Uint16Array(BOARDS.uno.mcu.flash / 2); setOutput("No board: running the circuit without code."); }
    buildBusy(false);
    project.parts.forEach(p => measure(p.id));
    const states = {}; project.parts.forEach(p => { states[p.id] = rt[p.id].state; });
    const net = new Netlist(project, pinsWorld, states);
    if (!net.board) net.board = BOARDS[bt];
    $("#serialout").textContent = ""; plot.reset(); phoneReset();
    sim = new Sim({ project, rt, net, program, onSerial: serialAppend, onWarn: showWarnings, onNet: onNetEvent });
    sim.onSample = T.sampleScope;
    Sim.muted = muted;
    running = true; document.body.classList.add("running");
    btn.innerHTML = `${ic("stop")}<span>Stop simulation</span>`; btn.classList.add("stop"); btn.disabled = false;
    lastT = performance.now(); raf = requestAnimationFrame(loop);
    showInspector(); drawPins(); renderPhone();
  } catch (e) {
    buildBusy(false);
    if (e) { setOutput(`Could not reach the compile service. Check the internet connection.<br><small>${esc(e.message || "")}</small>`, true); console.error(e); }
    btn.disabled = false; btn.innerHTML = `${ic("play")}<span>Start simulation</span>`;
  }
}
function loop(t) {
  if (!running) return;
  const dt = Math.min(0.05, (t - lastT) / 1000); lastT = t;
  const k = T.state.paused ? 0 : T.state.speed;
  try { if (k > 0) sim.run(dt * 1000 * k); sim.frame(dt * (k || 1)); } catch (e) { console.error(e); setOutput("Simulation error: " + esc(e.message), true); stopSim(); return; }
  T.sampleScope(sim); T.drawScope(); T.refreshReadout();
  if (T.state.volts) drawWires();
  const s = sim.cpu.cycles / 16e6;
  $("#clock").innerHTML = `<i></i>${Math.floor(s / 60)}:${(s % 60).toFixed(1).padStart(4, "0")}${T.state.paused ? ` <span>paused</span>` : T.state.speed < 1 ? ` <span>slow motion</span>` : sim.speed < 0.9 ? ` <span>${Math.round(sim.speed * 100)}% speed</span>` : ""}`;
  raf = requestAnimationFrame(loop);
}
function stepOnce() {
  if (!running || !sim) return;
  try { sim.run(8); sim.frame(0.008); } catch (e) { console.error(e); }
  T.sampleScope(sim); T.drawScope(); T.refreshReadout(); if (T.state.volts) drawWires();
}
function stopSim() {
  if (!running) return;
  running = false; cancelAnimationFrame(raf); sim && sim.stop(); sim = null;
  document.body.classList.remove("running");
  const btn = $("#runbtn"); btn.innerHTML = `${ic("play")}<span>Start simulation</span>`; btn.classList.remove("stop");
  project.parts.forEach(p => {
    const el = rt[p.id] && rt[p.id].el; if (!el) return;
    if (p.type === "led") el.value = false; if (p.type === "uno") { el.led13 = false; el.ledPower = false; el.ledTX = false; } if (p.type === "esp32") { el.ledPower = false; el.led1 = false; }
    if (p.type === "rgbled") { el.ledRed = el.ledGreen = el.ledBlue = 0; } if (p.type === "seg7") el.values = [0, 0, 0, 0, 0, 0, 0, 0];
    if (p.type === "buzzer") el.hasSignal = false; if (p.type === "lcd") { el.characters = new Uint8Array(32).fill(32); el.backlight = false; }
    if ((p.type === "ledring" || p.type === "ledstrip") && el.reset) el.reset(); if (p.type === "neopixel") { el.r = el.g = el.b = 0; }
    if (p.type === "dcmotor" || p.type === "fan") { el.speed = 0; el.spin(0); } if (p.type === "oled") el.clear(); if (p.type === "max7219") el.setRows([0, 0, 0, 0, 0, 0, 0, 0]);
    if (p.type === "relay") for (let i = 0; i < 4; i++) el.setCoil && el.setCoil(i, false); if (p.type === "lamp" || p.type === "pump") el.on = 0; if (p.type === "vibe") el.on = false;
    if (el.led) ["pwr", "sig", "bt", "rf"].forEach(k => el.led(k, false));
    if (p.type === "stepper28") el.coils = 0; if (p.type === "rfid") el.showCard("");
    if (p.type === "ledbar") el.values = new Array(10).fill(0);
    if (p.type === "lcd2004") { el.characters = new Uint8Array(80).fill(32); el.backlight = false; }
    if (p.type === "npmatrix" && el.reset) el.reset();
    if (p.type === "nano" || p.type === "mega") { el.led13 = false; el.ledPower = false; el.ledTX = false; }
    if (el.clOff) { try { el.clOff(); } catch (er) { } }
  });
  showWarnings([]); showInspector(); drawPins(); $("#clock").innerHTML = ""; renderPhone();
}
function serialAppend(ch) {
  const o = $("#serialout"); o.textContent += ch; if (o.textContent.length > 30000) o.textContent = o.textContent.slice(-20000);
  o.scrollTop = o.scrollHeight; plot.feed(ch);
  if (!serialAppend.told && ch.trim()) { serialAppend.told = true; if (!$("#t-serial").classList.contains("on")) $("[data-tab=serial]").classList.add("ping"); }
}
function showWarnings(list) {
  const w = $("#warns"), key = list.join("|"); if (w.dataset.k === key) return; w.dataset.k = key;
  w.innerHTML = list.map(t => `<div>${ic("warn")}<span>${esc(t)}</span></div>`).join(""); w.classList.toggle("on", list.length > 0);
}

/* ---------- serial plotter ---------- */
const plot = {
  buf: "", series: [], on: false,
  reset() { this.buf = ""; this.series = []; this.draw(); },
  feed(ch) { if (ch !== "\n") { this.buf += ch; return; } const nums = (this.buf.match(/-?\d+(\.\d+)?/g) || []).slice(0, 4).map(Number); this.buf = ""; if (!nums.length) return; nums.forEach((v, i) => { (this.series[i] = this.series[i] || []).push(v); if (this.series[i].length > 240) this.series[i].shift(); }); if (this.on) this.draw(); },
  draw() {
    const c = $("#plot"); if (!c || c.hidden) return; const g = c.getContext("2d"), W = c.width = c.clientWidth * 2, H = c.height = 360; g.clearRect(0, 0, W, H);
    const all = this.series.flat(); if (!all.length) { g.fillStyle = "#94A3B8"; g.font = "24px sans-serif"; g.fillText("Numbers printed with Serial.println appear here as a graph", 24, H / 2); return; }
    let lo = Math.min(...all), hi = Math.max(...all); if (hi - lo < 1) { hi += 1; lo -= 1; }
    g.strokeStyle = "#E2E8F0"; g.lineWidth = 2; for (let i = 0; i <= 4; i++) { const y = 20 + i * (H - 40) / 4; g.beginPath(); g.moveTo(60, y); g.lineTo(W - 10, y); g.stroke(); g.fillStyle = "#64748B"; g.font = "20px JetBrains Mono, monospace"; g.fillText(String(+(hi - i * (hi - lo) / 4).toFixed(1)), 4, y + 6); }
    ["#2E6BE6", "#E63946", "#2E9E5B", "#F08C00"].forEach((col, si) => { const s = this.series[si]; if (!s) return; g.strokeStyle = col; g.lineWidth = 3; g.beginPath(); s.forEach((v, i) => { const x = 60 + i * (W - 70) / 239, y = 20 + (hi - v) / (hi - lo) * (H - 40); i ? g.lineTo(x, y) : g.moveTo(x, y); }); g.stroke(); });
  },
};

/* ---------- Phone panel: browser, Bluetooth, network ---------- */
const phone = { url: "/", log: [], bt: [], btName: null, wifi: null, server: false, mqtt: false, espnow: false, page: null, loading: false };
function phoneReset() { Object.assign(phone, { url: "/", log: [], bt: [], btName: null, wifi: null, server: false, mqtt: false, espnow: false, page: null, loading: false }); }
function onNetEvent(e) {
  if (e.kind === "log") phone.log.push({ t: e.t, level: e.level });
  if (e.kind === "wifi") phone.wifi = e.on ? e : null;
  if (e.kind === "server") { phone.server = true; setTimeout(() => { if (running && !phone.page) phoneGo("/"); }, 300); $("#phonetab").classList.add("ping"); }
  if (e.kind === "bt") { phone.btName = e.name; $("#phonetab").classList.add("ping"); }
  if (e.kind === "sms") { phone.bt.push({ from: "board", text: `SMS to ${e.to}:\n${e.text}\n`, done: true }); $("#phonetab").classList.add("ping"); }
  if (e.kind === "btout") { const last = phone.bt[phone.bt.length - 1]; if (last && last.from === "board" && !last.done) { last.text += e.text; if (/\n$/.test(last.text)) last.done = true; } else phone.bt.push({ from: "board", text: e.text, done: /\n$/.test(e.text) }); }
  if (e.kind === "mqtt") phone.mqtt = true;
  if (e.kind === "mqttpub") phone.log.push({ t: `MQTT ${e.topic} ← ${e.msg}`, level: "mqtt" });
  if (e.kind === "espnow") phone.espnow = true;
  if (e.kind === "nowout") phone.log.push({ t: `ESP-NOW sent ${e.n} bytes: ${e.text}`, level: "mqtt" });
  if (phone.log.length > 120) phone.log.splice(0, phone.log.length - 120);
  clearTimeout(onNetEvent._t); onNetEvent._t = setTimeout(renderPhone, 60);
}
const PAGE_HOOK = `<script>(function(){var P=function(m){m.clweb=1;parent.postMessage(m,'*');};
document.addEventListener('click',function(e){var a=e.target.closest&&e.target.closest('a');if(!a)return;var h=a.getAttribute('href');if(!h||h.charAt(0)==='#')return;if(/^https?:/i.test(h)&&!/192\\.168\\./.test(h))return;e.preventDefault();P({nav:h});},true);
document.addEventListener('submit',function(e){e.preventDefault();var f=e.target,q=new URLSearchParams(new FormData(f)).toString(),post=(f.method||'').toLowerCase()==='post';P({nav:(f.getAttribute('action')||'/')+(post?'':'?'+q),post:post?q:null});},true);
var W={};window.addEventListener('message',function(ev){var d=ev.data;if(d&&d.clres&&W[d.clres]){W[d.clres](d);delete W[d.clres];}});
window.fetch=function(u,o){return new Promise(function(res){var id='r'+Math.random();W[id]=function(d){res(new Response(d.body,{status:d.code||200,headers:{'Content-Type':d.type||'text/plain'}}));};P({fetch:String(u),id:id,method:(o&&o.method)||'GET',body:o&&o.body?String(o.body):''});});};
window.XMLHttpRequest=function(){var s=this;s.readyState=0;s.open=function(m,u){s._m=m;s._u=u;};s.setRequestHeader=function(){};s.send=function(b){fetch(s._u,{method:s._m,body:b}).then(function(r){return r.text().then(function(t){s.status=r.status;s.responseText=t;s.response=t;s.readyState=4;s.onreadystatechange&&s.onreadystatechange();s.onload&&s.onload();});});};};
})();<\/script>`;
function normPath(p, base = "/") { if (/^https?:\/\//i.test(p)) { try { const u = new URL(p); return u.pathname + u.search; } catch (e) { return "/"; } } if (p.charAt(0) === "/") return p; const b = base.split("?")[0].replace(/[^/]*$/, ""); return b + p; }
async function phoneGo(path, post = null) {
  if (!sim) return;
  phone.url = normPath(path, phone.url); phone.loading = true; renderPhone();
  const r = await sim.webRequest(post ? "POST" : "GET", phone.url, post || "");
  phone.loading = false;
  if (r.location) { return phoneGo(r.location); }
  phone.page = r; renderPhone();
}
window.addEventListener("message", async ev => {
  const d = ev.data; if (!d || !d.clweb || !sim) return;
  if (d.nav) phoneGo(d.nav, d.post);
  if (d.fetch) { const r = await sim.webRequest(d.method || "GET", normPath(d.fetch, phone.url), d.body || ""); const f = $("#phoneframe"); if (f && f.contentWindow) f.contentWindow.postMessage({ clres: d.id, code: r.code, type: r.type, body: r.body }, "*"); }
});
function renderPhone() {
  const box = $("#t-phone"); if (!box) return;
  const esp = boardType() === "esp32", hasBt = project.parts.some(p => p.type === "hc05") || /BluetoothSerial/.test(project.code || "");
  $("#phonetab").hidden = !(esp || hasBt);
  if ($("#phonetab").hidden && box.classList.contains("on")) tab("code");
  if (!running) { box.dataset.shape = ""; box.innerHTML = `<div class="phint">${ic("info")}<p>${esp ? "Start the simulation. When the ESP32 starts a web server, its page opens here. Bluetooth, MQTT and ESP-NOW messages show here too." : "Start the simulation, then send messages to the Bluetooth module from here."}</p></div>`; return; }
  const p = phone, showBt = hasBt || !!p.btName, showMq = p.mqtt || p.espnow, shape = [esp, showBt, showMq, p.mqtt].join();
  if (box.dataset.shape !== shape) {
    box.dataset.shape = shape;
    box.innerHTML = `<div class="phonewrap">
      ${esp ? `<div class="pstat" id="pstat"></div><div class="device"><div class="addr"><span id="phost"></span><input id="purl"><button class="cbtn icon" data-act="pgo" title="Open">${ic("arrow")}</button><button class="cbtn icon" data-act="preload" title="Reload">${ic("reload")}</button></div><div class="screen" id="pscreen"></div></div>` : ""}
      ${showBt ? `<div class="btbox"><h4>${ic("bt")}Bluetooth terminal <span id="btbadge"></span></h4><div class="btlog" id="btlog"></div>
        <div class="btquick">${["1", "0", "F", "B", "L", "R", "S"].map(k => `<button class="cbtn" data-bt="${k}">${k}</button>`).join("")}</div>
        <div class="serin"><input id="btin" placeholder="Type a message for the board"><button class="cbtn" data-act="btsend">${ic("send")}</button></div></div>` : ""}
      ${showMq ? `<div class="btbox"><h4>${ic("wifi")}${p.mqtt ? "MQTT broker" : "ESP-NOW"}</h4>${p.mqtt ? `<div class="serin"><input id="mqtopic" placeholder="topic" value="club/lamp" style="max-width:40%"><input id="mqmsg" placeholder="message" value="on"><button class="cbtn" data-act="mqsend">${ic("send")}</button></div>` : `<div class="serin"><input id="nowmsg" placeholder="Send a packet to this board"><button class="cbtn" data-act="nowsend">${ic("send")}</button></div>`}</div>` : ""}
      ${esp ? `<div class="netlog"><h4>Network log</h4><div id="plog"></div></div>` : ""}
    </div>`;
  }
  const set = (id, html) => { const e = box.querySelector("#" + id); if (e && e._h !== html) { e.innerHTML = html; e._h = html; } return e; };
  if (esp) {
    const st = box.querySelector("#pstat"); st.className = "pstat" + (p.wifi ? " on" : "");
    set("pstat", `${ic("wifi")}<span>${p.wifi ? `Wi-Fi connected · ${esc(p.wifi.ip)}${p.wifi.ap ? " (hotspot)" : ""}` : "Wi-Fi not connected yet"}</span>`);
    set("phost", `${ic("globe")}http://${esc(p.wifi ? p.wifi.ip : "192.168.1.50")}`);
    const u = box.querySelector("#purl"); if (document.activeElement !== u) u.value = p.url;
    const scr = box.querySelector("#pscreen");
    if (p.page) {
      if (scr._page !== p.page) {
        scr._page = p.page; const page = p.page;
        const html = /html/i.test(page.type) ? page.body : `<pre style="white-space:pre-wrap;font:13px monospace;padding:10px">${esc(page.body)}</pre>`;
        const f = document.createElement("iframe"); f.id = "phoneframe"; f.setAttribute("sandbox", "allow-scripts allow-forms");
        f.srcdoc = /<head[^>]*>/i.test(html) ? html.replace(/<head[^>]*>/i, m => m + PAGE_HOOK) : PAGE_HOOK + html;
        scr.innerHTML = ""; scr._h = null; scr.appendChild(f);
      }
    } else set("pscreen", `<div class="noweb">${p.loading ? `<span class="spin dark"></span>Loading…` : p.server ? "Opening…" : "No web page yet.<br><small>When your code calls <code>server.begin()</code> the page appears here.</small>"}</div>`);
    set("plog", p.log.slice(-40).map(l => `<div class="${l.level}">${esc(l.t)}</div>`).join("") || `<div class="muted">Nothing yet.</div>`);
  }
  if (showBt) {
    set("btbadge", p.btName ? `<span class="badge">${esc(p.btName)} paired</span>` : "");
    const bl = set("btlog", p.bt.map(m => `<div class="${m.from}">${esc(m.text.replace(/\s+$/, ""))}</div>`).join("") || `<div class="muted">Messages from the board show here.</div>`);
    if (bl) bl.scrollTop = bl.scrollHeight;
  }
}

/* ---------- lessons ---------- */
const measureCache = {};
async function measureTypes(list) {
  const box = $("#stagebox");
  await Promise.all(list.map(async ({ type, attrs }) => {
    const k = type + JSON.stringify(attrs || {}); if (measureCache[k]) return;
    const d = PARTS[type], el = document.createElement(d.tag); applyAttrs(el, Object.assign({}, d.attrs, attrs)); box.appendChild(el);
    await (el.updateComplete || Promise.resolve()); await new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)));
    measureCache[k] = { w: el.offsetWidth, h: el.offsetHeight, pins: (el.pinInfo || []).map(q => ({ name: q.name, x: q.x, y: q.y })) };
    el.remove();
  }));
}
async function buildFromSpec(spec) {
  // measure everything the layout might place
  const need = [{ type: "breadboard" }, { type: "breadboard", attrs: { cols: "60" } }, { type: "uno" }, { type: "esp32" }, { type: "nano" }, { type: "mega" }, { type: "battery", attrs: { kind: "4xAA" } }, { type: "battery", attrs: { kind: "9V" } }, { type: "battery", attrs: { kind: "18650" } }, { type: "dcmotor" }, { type: "lamp" }, { type: "fan" }, { type: "pump" }, { type: "solar" }];
  (spec.parts || []).forEach(it => { const d = PARTS[it.t]; if (!d) return; need.push({ type: it.t }); need.push({ type: it.t, attrs: Object.assign({}, d.attrs || {}, it.attrs || {}) }); if (d.with || it.with) need.push({ type: "resistor", attrs: { value: "220" } }); if (it.t === "led") need.push({ type: "led", attrs: { color: it.color || "red" } }); if (it.t === "button") need.push({ type: "button", attrs: { color: it.color || "green" } }); });
  (spec.extra || []).forEach(x => need.push({ type: x.t, attrs: x.attrs }));
  await measureTypes(need);
  const meas = (type, attrs) => { const k = type + JSON.stringify(attrs || {}); if (measureCache[k]) return measureCache[k]; const d = PARTS[type]; const k2 = type + JSON.stringify(Object.assign({}, d.attrs || {}, attrs || {})); return measureCache[k2] || measureCache[type + "{}"]; };
  // resistor spans vary: measure on demand (synchronously computed for cl-resistor)
  const out = layoutCircuit(spec, (type, attrs) => {
    if (type === "resistor") { const span = +((attrs || {}).span || 4); return { w: span * 9.6, h: 10, pins: [{ name: "1", x: 0, y: 5 }, { name: "2", x: span * 9.6, y: 5 }] }; }
    const m = meas(type, attrs); if (!m) throw new Error("not measured: " + type); return m;
  });
  return out;
}
async function openLesson(code, quiet, fresh) {
  const spec = LESSONS[code] || STARTERS.find(s => s.key === code); if (!spec) return toast("No ready-made circuit for " + esc(code));
  stopSim();
  let built;
  if (spec.project) built = JSON.parse(JSON.stringify(spec.project));
  else { try { built = await buildFromSpec(spec); } catch (e) { console.error(e); return toast("Could not build this circuit: " + esc(e.message)); } }
  snapshot();
  project = { v: 2, name: spec.lesson ? `${spec.lesson} ${spec.title}` : spec.title, parts: built.parts, wires: built.wires, code: spec.code || specCode(spec) || (built.board ? CODE_UNO : "// No board: this circuit runs without code.\n"), lesson: spec.lesson ? spec.lesson : null, lessonKey: code };
  // always open the ready-made circuit; earlier changes to this lesson can be brought back from the toast
  const prior = store.get(LKEY + code);
  if (fresh) { try { localStorage.removeItem(LKEY + code); } catch (e) { } }
  rebuildAll(); setHash((LESSONS[code] ? "lesson=" : "ex=") + code);
  restoreable = !fresh && prior && prior.parts && !sameWork(prior, project) ? prior : null;
  if (restoreable) toast(`Opened the ready-made <b>${esc(project.name)}</b>. <button class="tbtn" data-act="restorelesson">Bring back my changes</button>`, "act", 9000);
  else if (!quiet) toast(`Opened <b>${esc(project.name)}</b>. Press Start simulation.`);
  if (spec.lesson) { $("#lessontab").hidden = false; }
}
/* code for a starter that only lists parts: use the first part's example with the spec's pins */
function specCode(spec) {
  const it = (spec.parts || []).find(x => PARTS[x.t] && PARTS[x.t].code); if (!it) return null;
  const pins = Object.assign({}, it.pins || {}); if (it.pin != null) pins.A = pins.SIG = pins["2"] = pins["1.l"] = it.pin;
  return PARTS[it.t].code.replace(/\{([A-Za-z0-9.+\-/]+)\}/g, (m, k) => pins[k] != null ? String(pins[k]) : DEFAULT_PINS[k] != null ? String(DEFAULT_PINS[k]) : m);
}
function currentSpec() { return project.lessonKey ? (LESSONS[project.lessonKey] || STARTERS.find(s => s.key === project.lessonKey)) : null; }
function renderLessonCard() {
  const spec = currentSpec(), card = $("#lessoncard"), lt = $("#t-lesson");
  $("#lessontab").hidden = !spec;
  if (!spec) { card.classList.remove("on"); card.innerHTML = ""; lt.innerHTML = ""; return; }
  const g = GROUPS[(spec.lesson || "").split("-")[0]] || { color: "#2E6BE6", name: "" };
  card.style.setProperty("--g", g.color);
  card.innerHTML = `<span class="lcode">${esc(spec.lesson || "Starter")}</span><div class="lt"><b>${esc(spec.title)}</b><small>${esc(spec.goal || spec.about || "")}</small></div><button class="btn" data-tab="lesson">${ic("check")}Try this</button><button class="ix" data-act="hidecard" title="Hide">${ic("x")}</button>`;
  card.classList.toggle("on", !project.hideCard);
  lt.innerHTML = `<div class="lhead" style="--g:${g.color}"><span class="lcode">${esc(spec.lesson || "Starter")}</span><h3>${esc(spec.title)}</h3>${g.name ? `<small>${esc(g.name)}</small>` : ""}</div>
    ${spec.about ? `<p>${esc(spec.about)}</p>` : ""}
    ${spec.goal ? `<div class="lbox"><b>What it does</b><p>${esc(spec.goal)}</p></div>` : ""}
    ${spec.try && spec.try.length ? `<div class="lbox"><b>Try this</b><ol class="checks">${spec.try.map((t, i) => `<li><label><input type="checkbox" data-try="${i}"><span>${esc(t)}</span></label></li>`).join("")}</ol></div>` : ""}
    ${spec.note ? `<div class="lbox note">${ic("info")}<p>${esc(spec.note)}</p></div>` : ""}
    <div class="lbox"><b>Parts in this circuit</b><div class="pchips">${[...new Set(project.parts.filter(p => p.type !== "breadboard").map(p => PARTS[p.type].label))].map(l => `<span>${esc(l)}</span>`).join("")}</div></div>
    <div class="lbtns"><button class="btn" data-act="resetlesson">${ic("reload")}Reset to the original circuit</button>${spec.lesson ? `<a class="btn" href="../index.html#open=${encodeURIComponent(spec.lesson)}">${ic("book")}Lesson in the portal</a>` : ""}</div>`;
}

/* ---------- library modal ---------- */
function listProjects() { return store.get(LIST) || {}; }
function saveAs() {
  project.code = editor.getValue(); project.name = $("#pname").value.trim() || "My circuit";
  const all = listProjects(); all[project.name] = Object.assign({}, project, { saved: new Date().toISOString() });
  if (store.set(LIST, all)) toast(`${ic("check")}Saved as <b>${esc(project.name)}</b>`, "ok"); else toast("Could not save (browser storage is full)");
  save();
}
function openModal(html, cls = "") { $("#modal").innerHTML = `<div class="mbox ${cls}">${html}</div>`; document.body.classList.add("mopen"); }
function closeModal() { document.body.classList.remove("mopen"); $("#modal").innerHTML = ""; }
let libTab = "lessons", libGroup = "All", libQ = "";
function showLibrary(t) {
  if (t) libTab = t;
  const tabs = [["lessons", "Lesson circuits"], ["starters", "Starter circuits"], ["mine", "My circuits"]];
  let body = "";
  if (libTab === "lessons") {
    const groups = ["All", ...Object.keys(GROUPS)];
    const list = Object.entries(LESSONS).filter(([k, s]) => (libGroup === "All" || k.startsWith(libGroup)) && (!libQ || (k + " " + s.title + " " + (s.parts || []).map(p => p.t).join(" ")).toLowerCase().includes(libQ)));
    body = `<div class="lfilter"><div class="chips">${groups.map(g => `<button class="${g === libGroup ? "on" : ""}" data-libg="${g}" ${GROUPS[g] ? `style="--c:${GROUPS[g].color}"` : ""}>${g === "All" ? "All groups" : esc(g + " · " + GROUPS[g].name)}</button>`).join("")}</div><label class="search">${ic("search")}<input id="libq" placeholder="Search lessons or parts" value="${esc(libQ)}"></label></div>
      <div class="lgrid">${list.map(([k, s]) => { const g = GROUPS[k.split("-")[0]] || {}; const nparts = (s.parts || []).length; return `<button class="lcard" data-lesson="${esc(k)}" style="--c:${g.color || "#2E6BE6"}"><span class="lcode">${esc(s.lesson || k)}</span><b>${esc(s.title)}</b><small>${esc(s.goal || s.about || "")}</small><span class="lmeta">${s.board === "esp32" ? `<em class="esp">ESP32</em>` : s.board === null ? `<em class="nob">No board</em>` : `<em>Arduino Uno</em>`}${nparts ? `<span>${nparts} parts</span>` : ""}</span></button>`; }).join("") || `<p class="muted">No lessons match.</p>`}</div>`;
  } else if (libTab === "starters") {
    body = `<div class="lgrid">${STARTERS.map(s => `<button class="lcard" data-lesson="${esc(s.key)}" style="--c:#2E6BE6"><span class="lcode">${esc(s.cat || "Starter")}</span><b>${esc(s.title)}</b><small>${esc(s.goal || "")}</small><span class="lmeta">${s.board === "esp32" ? `<em class="esp">ESP32</em>` : `<em>Arduino Uno</em>`}</span></button>`).join("")}</div>`;
  } else {
    const all = listProjects(), names = Object.keys(all).sort((a, b) => (all[b].saved || "").localeCompare(all[a].saved || ""));
    body = `<p class="muted">Saved in this browser. Use Download to keep a copy or share it with a friend.</p><div class="olist">${names.map(n => `<div class="orow"><button data-openp="${esc(n)}"><b>${esc(n)}</b><small>${all[n].parts.length} parts · saved ${new Date(all[n].saved).toLocaleString()}</small></button><button class="lk" data-delp="${esc(n)}">Delete</button></div>`).join("") || `<p class="muted">Nothing saved yet. Press Save to keep a circuit here.</p>`}</div>`;
  }
  openModal(`<div class="mh"><h2>${ic("book")}Library</h2><div class="mtabs">${tabs.map(([k, l]) => `<button class="${k === libTab ? "on" : ""}" data-libtab="${k}">${l}</button>`).join("")}</div><button class="mx" data-close>${ic("x")}</button></div><div class="mbody">${body}</div>`, "wide");
  const q = $("#libq"); if (q) { q.focus(); q.setSelectionRange(q.value.length, q.value.length); }
}
function showNew() {
  openModal(`<div class="mh"><h2>New circuit</h2><button class="mx" data-close>${ic("x")}</button></div><div class="mbody"><div class="newgrid">
    <button class="newcard" data-newb="uno"><span class="nb uno">${ic("chip")}</span><b>Arduino Uno</b><small>Uno + breadboard. Best for most lessons.</small></button>
    <button class="newcard" data-newb="esp32"><span class="nb esp">${ic("wifi")}</span><b>ESP32 DevKit</b><small>Wi-Fi and Bluetooth projects (teaching mode).</small></button>
    <button class="newcard" data-newb="nano"><span class="nb uno">${ic("chip")}</span><b>Arduino Nano</b><small>The same chip, small enough to sit on the breadboard.</small></button>
    <button class="newcard" data-newb="mega"><span class="nb uno">${ic("chip")}</span><b>Arduino Mega 2560</b><small>54 digital pins and 16 analog inputs for big builds.</small></button>
    <button class="newcard" data-newb="none"><span class="nb none">${ic("bolt")}</span><b>Breadboard only</b><small>Batteries, switches and LEDs without code.</small></button>
  </div><p class="muted small">Your current circuit is kept in Undo. Press Save first if you want to keep it in the Library.</p></div>`);
}
function showSnippets() {
  const b = boardType() || "uno", cats = [...new Set(SNIPPETS.map(s => s.cat))];
  openModal(`<div class="mh"><h2>${ic("code")}Code library</h2><button class="mx" data-close>${ic("x")}</button></div><div class="mbody snips">
    ${cats.map(c => `<h4>${esc(c)}</h4><div class="sgrid">${SNIPPETS.map((s, i) => [s, i]).filter(([s]) => s.cat === c).map(([s, i]) => `<div class="scard ${s.board !== "any" && s.board !== b ? "dim" : ""}"><div><b>${esc(s.title)}</b>${s.board === "esp32" ? `<em class="esp">ESP32</em>` : ""}<small>${esc(s.about)}</small></div><pre>${esc(s.code.split("\n").slice(0, 7).join("\n"))}</pre><div class="sbtns"><button class="btn primary" data-snip="${i}" data-mode="replace">Use this code</button><button class="btn" data-snip="${i}" data-mode="insert">Insert at cursor</button></div></div>`).join("")}</div>`).join("")}
  </div>`, "wide");
}
function useCode(code, how) {
  if (how === "insert") { editor.replaceSelection(code); editor.focus(); toast("Inserted"); }
  else { const cur = editor.getValue(); if (cur.trim() && cur !== code && !confirm("Replace the code in the editor? (Undo with Ctrl+Z in the editor.)")) return; editor.setValue(code); toast("Code replaced"); }
  tab("code"); save();
}
function download() {
  project.code = editor.getValue();
  const a = document.createElement("a"); a.href = URL.createObjectURL(new Blob([JSON.stringify(project, null, 1)], { type: "application/json" }));
  a.download = (project.name || "circuit").replace(/[^\w-]+/g, "_") + ".circuit.json"; document.body.appendChild(a); a.click(); setTimeout(() => a.remove(), 300);
}
function downloadIno() {
  const a = document.createElement("a"); a.href = URL.createObjectURL(new Blob([editor.getValue()], { type: "text/plain" }));
  a.download = (project.name || "sketch").replace(/[^\w-]+/g, "_") + ".ino"; document.body.appendChild(a); a.click(); setTimeout(() => a.remove(), 300);
}
function tab(t) {
  $$("[data-tab]").forEach(b => { if (b.closest(".tabs")) b.classList.toggle("on", b.dataset.tab === t); });
  $$(".tpane").forEach(p => p.classList.toggle("on", p.id === "t-" + t));
  if (t === "code") editor.refresh(); if (t === "serial") { $("[data-tab=serial]").classList.remove("ping"); plot.draw(); } if (t === "phone") $("#phonetab").classList.remove("ping");
}
let restoreable = null;
function setProject(p, msg) {
  stopSim(); snapshot(); project = JSON.parse(JSON.stringify(p)); delete project.saved;
  setHash(project.lessonKey ? (LESSONS[project.lessonKey] ? "lesson=" : "ex=") + project.lessonKey : "");
  project.parts.forEach(q => { q.rot = q.rot || 0; });
  rebuildAll(); save(); if (msg) toast(msg);
}

/* ---------- pointer interaction ---------- */
let drag = null;
const PRESS_ONLY = new Set(["button", "slideswitch", "keypad", "dipswitch", "encoder", "irremote"]);
function onDown(e) {
  if (e.target.closest(".insp, .ctools, .zoombar, .lessoncard, .warns, .empty")) return;
  const handle = e.target.closest(".whandle");
  if (handle && !running) { snapshot(); drag = { kind: "handle", wire: +handle.dataset.wire, pt: +handle.dataset.pt }; e.preventDefault(); return; }
  /* Pin dots are only drawn near the cursor now, so a fast click can land before
     the dot exists. Fall back to the nearest pin within a few screen pixels, which
     is what the student was aiming at anyway. */
  let pin = e.target.closest(".pin");
  if (!pin && !e.target.closest(".whit")) {
    const [cx, cy] = toWorld(e.clientX, e.clientY);
    let best = 7 / view.z, node = null;
    project.parts.forEach(q => pinsWorld(q).forEach(z => {
      const d = Math.hypot(z.x - cx, z.y - cy);
      if (d < best) { best = d; node = q.id + ":" + z.name; }
    }));
    if (node) { ptr = [cx, cy]; drawPins(); pin = $(`#pins .pin[data-pin="${CSS.escape(node)}"]`); }
  }
  if (pin && running && T.state.probe) { e.stopPropagation(); T.toggleChannel(pin.dataset.pin); return; }
  if (pin && !running) { e.stopPropagation(); const was = !!wiring; clickPin(pin.dataset.pin); pinDown = !was && wiring ? { sx: e.clientX, sy: e.clientY } : null; return; }
  // while wiring, a click close to a pin finishes on that pin (magnet)
  if (wiring && hoverPin && !running && e.button === 0) { clickPin(hoverPin); return; }
  const wh = e.target.closest(".whit");
  if (wh && running && T.state.probe) { const w = project.wires[+wh.dataset.wire]; if (w) T.toggleChannel(w.from); return; }
  if (wh && !running && !wiring) { sel = { kind: "wire", id: +wh.dataset.wire }; T.multi.clear(); project.parts.forEach(placePart); drawWires(); showInspector(); return; }
  const part = e.target.closest(".part");
  if (part && !wiring) {
    const id = part.dataset.id;
    const isBB = project.parts.find(q => q.id === id).type === "breadboard";
    if (running && PRESS_ONLY.has(project.parts.find(q => q.id === id).type)) return;   // pressing a button just presses it
    if (e.shiftKey && !running) { if (sel && sel.kind === "part" && sel.id !== id) T.multi.add(sel.id); T.toggleMulti(id); sel = { kind: "part", id }; showInspector(); drawWires(); return; }
    if (!(running && sel && sel.id === id)) { if (!T.multi.has(id)) T.multi.clear(); sel = { kind: "part", id }; project.parts.forEach(placePart); showInspector(); drawWires(); }
    if (running) return;
    const p = project.parts.find(q => q.id === id), [wx, wy] = toWorld(e.clientX, e.clientY);
    // moving the breadboard carries the parts plugged into it
    const riders = isBB ? project.parts.filter(q => q.id !== id && PARTS[q.type].kind === "bb" && onBoard(q, p)).map(q => ({ q, dx: q.x - p.x, dy: q.y - p.y })) : [];
    allSel().forEach(oid => { if (oid === id || riders.some(r => r.q.id === oid)) return; const q = project.parts.find(z => z.id === oid); if (q) riders.push({ q, dx: q.x - p.x, dy: q.y - p.y }); });
    drag = { kind: "part", id, dx: wx - p.x, dy: wy - p.y, moved: false, riders, sx: e.clientX, sy: e.clientY };
    e.preventDefault(); return;
  }
  if (wiring && e.button === 0) { const [x, y] = toWorld(e.clientX, e.clientY); wiring.pts.push(...bendPts(x, y)); drawWires(); return; }
  if (e.shiftKey && !running) { const [x, y] = toWorld(e.clientX, e.clientY); drag = { kind: "marquee", x0: x, y0: y, x1: x, y1: y }; return; }
  drag = { kind: "pan", sx: e.clientX, sy: e.clientY, vx: view.x, vy: view.y, moved: false };
}
function onBoard(q, bb) { const r = rt[bb.id]; return r && q.x > bb.x - 30 && q.x < bb.x + r.w + 10 && q.y > bb.y - 60 && q.y < bb.y + r.h + 10; }
function onMove(e) {
  const [wx, wy] = toWorld(e.clientX, e.clientY);
  ptr = [wx, wy];
  /* redraw the pin targets only once the cursor has actually moved a few screen
     pixels, so this costs nothing while the mouse is still */
  if (!running || T.state.probe) {
    if (!ptrDrawn || Math.hypot(wx - ptrDrawn[0], wy - ptrDrawn[1]) * view.z > 5) drawPins();
  }
  let magnet = null;
  if (wiring) {
    // snap to the nearest pin within ~10 screen px
    let best = 10 / view.z;
    project.parts.forEach(p => pinsWorld(p).forEach(q => { const d = Math.hypot(q.x - wx, q.y - wy); if (d < best) { best = d; magnet = { node: p.id + ":" + q.name, x: q.x, y: q.y }; } }));
    if (magnet && magnet.node === wiring.from) magnet = null;
    wiring.mouse = magnet ? [magnet.x, magnet.y] : [wx, wy];
  }
  if (!drag) {
    const pin = e.target.closest && e.target.closest(".pin");
    const node = pin ? pin.dataset.pin : magnet ? magnet.node : null;
    if (node !== hoverPin) {
      hoverPin = node; const tip = $("#tip");
      if (node) { tip.innerHTML = pinTitle(node) + (running && T.state.probe ? " " + T.readoutFor(node) : ""); tip.classList.add("on"); } else tip.classList.remove("on");
      // breadboard: light up the joined holes
      project.parts.filter(p => p.type === "breadboard").forEach(p => { const el = rt[p.id] && rt[p.id].el; if (!el || !el.highlight) return; el.highlight(node && node.startsWith(p.id + ":") ? bbGroupOf(node.split(":")[1], (p.attrs || {}).cols || 30) : null); });
      $$(".pin.hot").forEach(c => c.classList.remove("hot")); if (pin) pin.classList.add("hot");
    }
    if (wiring) drawWires();
    if (node) { const st = $("#stage").getBoundingClientRect(); const tip = $("#tip"); tip.style.left = (e.clientX - st.left + 14) + "px"; tip.style.top = (e.clientY - st.top + 16) + "px"; }
    if (running && T.state.probe) {
      const wh = e.target.closest && e.target.closest(".whit");
      const n = node || (wh ? (project.wires[+wh.dataset.wire] || {}).from : null);
      const st = $("#stage").getBoundingClientRect();
      if (n) T.showReadout(n, e.clientX - st.left + 16, e.clientY - st.top + 18); else T.hideReadout();
    }
    const part = e.target.closest && e.target.closest(".part"); const id = part ? part.dataset.id : (pin ? hoverPart : null);
    if (id !== hoverPart && (!running || T.state.probe)) { hoverPart = id; drawPins(); }
    return;
  }
  if (drag.kind === "pan") { view.x = drag.vx + e.clientX - drag.sx; view.y = drag.vy + e.clientY - drag.sy; drag.moved = true; applyView(); return; }
  if (drag.kind === "marquee") {
    drag.x1 = wx; drag.y1 = wy;
    const b = { x0: Math.min(drag.x0, wx), y0: Math.min(drag.y0, wy), x1: Math.max(drag.x0, wx), y1: Math.max(drag.y0, wy) };
    let box = $("#marq"); if (!box) { box = document.createElement("div"); box.id = "marq"; box.className = "marq"; $("#world").appendChild(box); }
    box.style.left = b.x0 + "px"; box.style.top = b.y0 + "px"; box.style.width = (b.x1 - b.x0) + "px"; box.style.height = (b.y1 - b.y0) + "px";
    T.multi.clear();
    project.parts.forEach(p => { const r = rt[p.id]; if (!r) return; if (p.x + r.w > b.x0 && p.x < b.x1 && p.y + r.h > b.y0 && p.y < b.y1) T.multi.add(p.id); });
    project.parts.forEach(placePart);
    return;
  }
  if (drag.kind === "handle") { const w = project.wires[drag.wire]; w.pts[drag.pt] = [Math.round(wx / 2.4) * 2.4, Math.round(wy / 2.4) * 2.4]; drawWires(); return; }
  if (drag.kind === "part") {
    if (!drag.moved && Math.hypot(e.clientX - drag.sx, e.clientY - drag.sy) < 3) return;
    if (!drag.moved) { snapshot(); drag.moved = true; $("#inspector").classList.add("fade"); }
    const p = project.parts.find(q => q.id === drag.id), g = 4.8;
    const nx = Math.round((wx - drag.dx) / g) * g, ny = Math.round((wy - drag.dy) / g) * g;
    p.x = nx; p.y = ny; placePart(p);
    drag.riders.forEach(r => { r.q.x = nx + r.dx; r.q.y = ny + r.dy; placePart(r.q); });
    drawWires();
  }
}
let pinDown = null, nudgeT = null;
function onUp(e) {
  // press on a pin, drag, release on another pin = one wire
  if (pinDown && wiring && e && Math.hypot(e.clientX - pinDown.sx, e.clientY - pinDown.sy) > 6 && hoverPin && hoverPin !== wiring.from) { pinDown = null; clickPin(hoverPin); return; }
  pinDown = null;
  if (drag && drag.kind === "pan" && !drag.moved && !wiring) { sel = null; T.multi.clear(); project.parts.forEach(placePart); showInspector(); drawWires(); }
  if (drag && drag.kind === "marquee") { const box = $("#marq"); if (box) box.remove(); const ids = [...T.multi]; if (ids.length) { sel = { kind: "part", id: ids[0] }; showInspector(); } toast(ids.length ? `${ids.length} part${ids.length === 1 ? "" : "s"} selected` : "Nothing in the box", "", 1200); }
  if (drag && ((drag.kind === "part" && drag.moved) || drag.kind === "handle")) { save(); $("#inspector").classList.remove("fade"); positionInspector(); }
  drag = null;
}
function clickPin(node) {
  if (!wiring) { wiring = { from: node, pts: [], mouse: null }; document.body.classList.add("wiring"); hint("Click (or drag to) another pin to finish the wire. Click empty space to add a bend. Esc cancels."); drawWires(); return; }
  if (node === wiring.from) { cancelWire(); return; }
  snapshot();
  project.wires.push({ from: wiring.from, to: node, pts: wiring.pts, color: penColor === "auto" ? autoColor(wiring.from, node) : penColor });
  sel = { kind: "wire", id: project.wires.length - 1 };
  cancelWire(); save(); drawWires(); showInspector();
}
function cancelWire() { wiring = null; document.body.classList.remove("wiring"); hint(""); drawWires(); }
function hint(t) { const h = $("#hint"); h.textContent = t; h.classList.toggle("on", !!t); }

/* keep the dark-mode and full-screen buttons showing the state they are actually in */
function syncViewButtons() {
  const dark = currentTheme() === "dark";
  const tb = document.getElementById("themebtn");
  if (tb) tb.title = dark ? "Light mode" : "Dark mode";
  const fb = document.getElementById("fsbtn");
  if (fb) fb.title = isFullscreen() ? "Leave full screen" : "Full screen (good for the projector)";
}
document.addEventListener("fullscreenchange", () => syncViewButtons());

/* ---------- boot ---------- */
function boot() {
  applyTheme(currentTheme()); syncViewButtons();
  renderCats(); renderPalette();
  $("#liblist").innerHTML = `<b>Built in:</b> ${BUILTIN_LIBS.join(", ")}.<br><b>Added by Circuit Lab:</b> ${EXTRA_LIBS.map(n => n.replace(".h", "")).join(", ")}.`;
  editor = CodeMirror($("#editor"), { value: project.code || "", mode: "text/x-c++src", lineNumbers: true, matchBrackets: true, autoCloseBrackets: true, indentUnit: 2, tabSize: 2, theme: "cl", extraKeys: { "Ctrl-Enter": () => (running ? stopSim() : runSim()), "Cmd-Enter": () => (running ? stopSim() : runSim()), "Ctrl-S": () => saveAs(), "Cmd-S": () => saveAs() } });
  installAutocomplete(CodeMirror, editor);
  editor.on("change", () => { clearTimeout(boot._t); boot._t = setTimeout(() => { project.code = editor.getValue(); save(); renderPhone(); }, 400); });
  T.initTools({
    ic, toast, esc, pinTitle, partLabel, drawWires, placePart, showInspector, rebuildAll, snapshot, save, uid, bounds,
    openModal, closeModal, download, downloadIno, stepOnce, PARTS, BOARDS, rt,
    get project() { return project; }, get sim() { return sim; }, get running() { return running; }, get sel() { return sel; },
    setSel: v => { sel = v; }, centreOfView: () => toWorld(window.innerWidth / 2 - 140, window.innerHeight / 2),
  });
  rebuildAll(); applyView();

  const stage = $("#stage");
  $("#fields").addEventListener("pointerdown", e => { fieldPointer(e); });
  stage.addEventListener("pointerdown", e => { if (fdrag) return; onDown(e); });
  window.addEventListener("pointermove", e => { if (fieldMove(e)) return; onMove(e); });
  window.addEventListener("pointerup", e => { if (fieldUp()) return; onUp(e); });
  // mouse wheel and trackpad pinch zoom; two-finger trackpad scroll pans
  stage.addEventListener("wheel", e => {
    if (e.target.closest(".insp, .lessoncard")) return; e.preventDefault(); cancelAnimationFrame(animateView._r);
    const dy = e.deltaMode === 1 ? e.deltaY * 16 : e.deltaY, dx = e.deltaMode === 1 ? e.deltaX * 16 : e.deltaX;
    const trackpad = !e.ctrlKey && e.deltaMode === 0 && (dx !== 0 || (dy % 1 !== 0) || Math.abs(dy) < 30);
    if (trackpad) { view.x -= dx; view.y -= dy; applyView(); return; }
    zoomAt(Math.exp(-Math.max(-60, Math.min(60, dy)) * (e.ctrlKey ? 0.012 : 0.0022)), e.clientX, e.clientY);
  }, { passive: false });
  stage.addEventListener("dblclick", e => {
    if (e.target.closest(".insp, .lessoncard, .ctools, .zoombar, .warns")) return;
    const part = e.target.closest(".part"); if (part && !running) return zoomToPart(part.dataset.id);
    if (part && running) return; fitAnimated();
  });
  stage.addEventListener("dragover", e => e.preventDefault());
  stage.addEventListener("drop", e => { e.preventDefault(); const t = e.dataTransfer.getData("text/plain"); if (PARTS[t]) { const [x, y] = toWorld(e.clientX, e.clientY); addPart(t, x - 30, y - 30); } });
  $("#plist").addEventListener("dragstart", e => { const b = e.target.closest("[data-add]"); if (b) e.dataTransfer.setData("text/plain", b.dataset.add); });
  $("#psearch").addEventListener("input", renderPalette);
  $("#pname").addEventListener("change", e => { project.name = e.target.value.trim() || "My circuit"; save(); });
  $("#serialin").addEventListener("keydown", e => { if (e.key === "Enter") sendSerial(); });
  window.addEventListener("resize", () => { positionInspector(); plot.draw(); });

  document.addEventListener("keydown", e => { if (e.target.id === "btin" && e.key === "Enter") btSend(); if (e.target.id === "purl" && e.key === "Enter") phoneGo(e.target.value || "/"); if (e.target.id === "libq") return; });
  document.addEventListener("input", e => {
    const t = e.target;
    if (t.id === "libq") { libQ = t.value.toLowerCase(); clearTimeout(boot._q); boot._q = setTimeout(() => showLibrary(), 150); return; }
    if (!t.dataset.prop || !sel) return;
    const p = project.parts.find(q => q.id === sel.id), def = PARTS[p.type], x = (def.props || []).find(z => z.k === t.dataset.prop);
    const v = t.type === "checkbox" ? t.checked : t.value;
    if (x.sim) { p.sim[x.k] = t.type === "range" ? +v : v; if (sim) sim.simChanged(p.id); if (FIELDS[p.type]) { p.sim.fd = null; drawFields(); } if (t.type === "range") t.closest("label").querySelector("b").textContent = v + (x.unit || ""); save(); return; }
    snapshot(); p.attrs = Object.assign({}, p.attrs, { [x.k]: v }); rt[p.id].el.setAttribute(x.k, v);
    if (x.k === "pixels") rt[p.id].el.pixels = +v;
    save(); setTimeout(() => { measure(p.id); drawWires(); positionInspector(); }, 80);
  });
  document.addEventListener("click", e => {
    const t = e.target.closest("button, a[data-act], [data-close], input[data-try]"); if (!t) { if (e.target.id === "modal") closeModal(); return; }
    const d = t.dataset;
    if (d.try != null) return;
    if (d.add) return addPart(d.add);
    if ("close" in d) return closeModal();
    if (d.tab) return tab(d.tab);
    if (d.cat) { catFilter = d.cat; renderCats(); return renderPalette(); }
    if (d.libtab) return showLibrary(d.libtab);
    if (d.libg) { libGroup = d.libg; return showLibrary(); }
    if (d.lesson) { closeModal(); location.hash = (LESSONS[d.lesson] ? "lesson=" : "ex=") + d.lesson; return; }
    if (d.newb) { closeModal(); project.lessonKey = null; return setProject(blank(d.newb === "none" ? null : d.newb), "New circuit"); }
    if (d.openp) { const p = listProjects()[d.openp]; closeModal(); return setProject(p, "Opened <b>" + esc(d.openp) + "</b>"); }
    if (d.delp) { if (!confirm("Delete " + d.delp + "?")) return; const all = listProjects(); delete all[d.delp]; store.set(LIST, all); return showLibrary(); }
    if (d.snip != null) { closeModal(); return useCode(SNIPPETS[+d.snip].code, d.mode); }
    if (d.wcolor) {
      penColor = d.wcolor;
      if (sel && sel.kind === "wire" && project.wires[sel.id]) {
        const w = project.wires[sel.id]; snapshot();
        w.color = d.wcolor === "auto" ? autoColor(w.from, w.to) : d.wcolor;
        save(); drawWires();
      } else if (wiring) drawWires();
      return showInspector();
    }
    if (d.pcolor && sel) { const p = project.parts.find(q => q.id === sel.id); p.sim.color = d.pcolor; if (sim) sim.simChanged(p.id); save(); return showInspector(); }
    if (d.pbtn && sel) { const p = project.parts.find(q => q.id === sel.id); p.sim[d.pbtn] = true; if (sim) sim.simChanged(p.id); toast("Motion!"); return; }
    if (d.card != null && sel && sim) { const st = rt[sel.id].state, c = CARDS[+d.card]; st.tap = c; st.tapName = c.name; st.tapShow = performance.now() + 1600; toast(`Tapped <b>${esc(c.name)}</b>`); return; }
    if (d.bt) { btSend(d.bt); return; }
    if (d.exp) { T.handleExport(d.exp); return; }
    switch (d.act) {
      case "wstraight": {
        if (!sel || sel.kind !== "wire" || !project.wires[sel.id]) return;
        snapshot(); project.wires[sel.id].pts = []; save(); drawWires(); return showInspector();
      }
      case "home": { location.hash = "home"; if (isHome()) return; return showHome(); }
      case "schem": return showSchematic();
      case "schclose": { const v = $("#schview"); if (v) v.classList.remove("on"); return; }
      case "schsvg": return downloadSchematic();
      case "run": return running ? stopSim() : runSim();
      case "delete": return deleteSel();
      case "rotate": return rotateSel();
      case "deselect": sel = null; project.parts.forEach(placePart); drawWires(); return showInspector();
      case "zin": return zoomAt(1.2);
      case "zout": return zoomAt(1 / 1.2);
      case "fit": return fitAnimated();
      case "undo": return undo();
      case "redo": return redo();
      case "new": return showNew();
      case "library": return showLibrary();
      case "save": return saveAs();
      case "download": return download();
      case "upload": return $("#fileup").click();
      case "snippets": return showSnippets();
      case "partcode": { if (!sel || sel.kind !== "part") return; const p = project.parts.find(q => q.id === sel.id); const r = partCode(p); if (!r) return; useCode(r.code, "replace"); if (r.missing.length) toast(`Pins not wired yet (${esc(r.missing.join(", "))}): example pins used.`); return; }
      case "copycode": navigator.clipboard && navigator.clipboard.writeText(editor.getValue()).then(() => toast("Code copied")); return;
      case "ino": return downloadIno();
      case "mute": muted = !muted; Sim.muted = muted; t.innerHTML = ic(muted ? "mute" : "sound"); return;
      case "theme": toggleTheme(); syncViewButtons(); return;
      case "fullscreen": toggleFullscreen(); setTimeout(syncViewButtons, 120); return;
      case "clearserial": $("#serialout").textContent = ""; plot.reset(); return;
      case "sendserial": return sendSerial();
      case "graph": plot.on = !plot.on; $("#plot").hidden = !plot.on; t.classList.toggle("on", plot.on); plot.draw(); return;
      case "pgo": return phoneGo(($("#purl").value || "/"));
      case "preload": return phoneGo(phone.url);
      case "btsend": return btSend();
      case "mqsend": if (sim) { sim.mqttSend($("#mqtopic").value, $("#mqmsg").value); phone.log.push({ t: `MQTT ${$("#mqtopic").value} → ${$("#mqmsg").value}`, level: "mqtt" }); renderPhone(); } return;
      case "nowsend": if (sim) { sim.nowSend($("#nowmsg").value); phone.log.push({ t: `ESP-NOW received: ${$("#nowmsg").value}`, level: "mqtt" }); renderPhone(); } return;
      case "hidecard": project.hideCard = true; save(); $("#lessoncard").classList.remove("on"); return;
      case "resetlesson": if (confirm("Throw away your changes and rebuild the original circuit?")) openLesson(project.lessonKey, false, true); return;
      case "restorelesson": if (restoreable) { const r = restoreable; restoreable = null; setProject(r, "Your changes are back"); } return;
    }
  });
  $("#fileup").addEventListener("change", e => {
    const f = e.target.files[0]; if (!f) return; const r = new FileReader();
    r.onload = () => { try { const p = JSON.parse(r.result); if (!p.parts) throw 0; setProject(p, "Loaded <b>" + esc(p.name || f.name) + "</b>"); } catch (er) { toast("That file is not a Circuit Lab circuit"); } };
    r.readAsText(f); e.target.value = "";
  });
  document.addEventListener("keydown", e => {
    const typing = /INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName) || document.activeElement.closest(".CodeMirror");
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") { e.preventDefault(); running ? stopSim() : runSim(); return; }
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "s") { e.preventDefault(); saveAs(); return; }
    if (typing) return;
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "z") { e.preventDefault(); e.shiftKey ? redo() : undo(); return; }
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "y") { e.preventDefault(); redo(); return; }
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "c") { e.preventDefault(); T.copySelection(); return; }
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "v") { e.preventDefault(); T.pasteClipboard(); return; }
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "d") { e.preventDefault(); T.duplicateSelection(); return; }
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "a") { e.preventDefault(); T.multi.clear(); project.parts.forEach(q => T.multi.add(q.id)); sel = project.parts.length ? { kind: "part", id: project.parts[0].id } : null; project.parts.forEach(placePart); showInspector(); return; }
    if (e.key === " " && running) { e.preventDefault(); T.state.paused = !T.state.paused; T.syncRunUI(); return; }
    if (e.key.toLowerCase() === "m" && running) { T.state.probe = !T.state.probe; T.syncToolbarUI(); drawPins(); if (!T.state.probe) T.hideReadout(); return; }
    if (e.key === "Escape") { if (document.body.classList.contains("mopen")) closeModal(); else if (wiring) cancelWire(); else { sel = null; T.multi.clear(); project.parts.forEach(placePart); showInspector(); drawWires(); } }
    if ((e.key === "Delete" || e.key === "Backspace") && sel) { e.preventDefault(); deleteSel(); }
    if (e.key.toLowerCase() === "r" && sel) rotateSel();
    if (e.key === "0") fitAnimated();
    if (e.key === "=" || e.key === "+") zoomAt(1.25);
    if (e.key === "-" || e.key === "_") zoomAt(1 / 1.25);
    if (e.key.toLowerCase() === "f") sel && sel.kind === "part" ? zoomToPart(sel.id) : fitAnimated();
    if (/^Arrow/.test(e.key) && sel && sel.kind === "part" && !running) {
      e.preventDefault();
      const step = e.shiftKey ? 24 : 4.8;
      const dx = (e.key === "ArrowRight" ? step : e.key === "ArrowLeft" ? -step : 0), dy = (e.key === "ArrowDown" ? step : e.key === "ArrowUp" ? -step : 0);
      if (!nudgeT) snapshot();
      allSel().forEach(id => { const p = project.parts.find(q => q.id === id); if (p) { p.x += dx; p.y += dy; placePart(p); } });
      drawWires(); clearTimeout(nudgeT); nudgeT = setTimeout(() => { nudgeT = null; save(); }, 500);
    }
  });
  // resizable code panel
  const gut = $("#gutter"); let gx = null;
  gut.addEventListener("pointerdown", e => { gx = e.clientX; gut.setPointerCapture(e.pointerId); });
  gut.addEventListener("pointermove", e => { if (gx === null) return; const w = Math.max(320, Math.min(window.innerWidth - 560, window.innerWidth - e.clientX)); document.documentElement.style.setProperty("--sidew", w + "px"); editor.refresh(); positionInspector(); });
  gut.addEventListener("pointerup", () => { gx = null; fit(); });
  // links: #lesson=LE-07, #ex=blink, #new=esp32
  const fromHash = () => {
    const h = decodeURIComponent(location.hash.slice(1)); let m;
    if (!h || h === "home") return showHome();
    hideHome();
    if ((m = h.match(/^lesson=(.+)$/)) && LESSONS[m[1]]) return openLesson(m[1]);
    if ((m = h.match(/^ex=([\w-]+)$/)) && STARTERS.find(s => s.key === m[1])) return openLesson(m[1]);
    if ((m = h.match(/^new=(uno|esp32|nano|mega|none)$/))) return setProject(blank(m[1] === "none" ? null : m[1]), "New circuit");
    if ((m = h.match(/^c=(.+)$/))) { T.openLink(m[1]).then(p => { if (p) { setProject(p, "Opened a shared circuit"); setHash("c=" + m[1]); } else toast("That shared link could not be read"); }); return; }
  };
  initHome({
    ic, PARTS, BOARDS, LESSONS, STARTERS, GROUPS, buildFromSpec, listProjects,
    chip: () => `<svg viewBox="0 0 1024 1024" aria-hidden="true"><path d="M938.666667 384v-85.333333H725.333333V85.333333h-85.333333v213.333334h-85.333333V85.333333h-85.333334v213.333334h-85.333333V85.333333h-85.333333v213.333334H85.333333v85.333333h213.333334v85.333333H85.333333v85.333334h213.333334v85.333333H85.333333v85.333333h213.333334v213.333334h85.333333V725.333333h85.333333v213.333334h85.333334V725.333333h85.333333v213.333334h85.333333V725.333333h213.333334v-85.333333H725.333333v-85.333333h213.333334v-85.333334H725.333333v-85.333333h213.333334z" fill="#FF9800"/><path d="M170.666667 256v512c0 46.933333 38.4 85.333333 85.333333 85.333333h512c46.933333 0 85.333333-38.4 85.333333-85.333333V256c0-46.933333-38.4-85.333333-85.333333-85.333333H256c-46.933333 0-85.333333 38.4-85.333333 85.333333z" fill="#4CAF50"/><path d="M661.333333 661.333333H362.666667c-23.466667 0-42.666667-19.2-42.666667-42.666666V405.333333c0-23.466667 19.2-42.666667 42.666667-42.666666h298.666666c23.466667 0 42.666667 19.2 42.666667 42.666666v213.333334c0 23.466667-19.2 42.666667-42.666667 42.666666z" fill="#37474F"/></svg>`,
    /* what the student was last working on, for the Continue card */
    /* what is open right now, lesson or their own work: that is what Continue
       takes them back to, and the editor already holds it */
    draft: () => project && project.parts && project.parts.length ? { name: project.name, parts: project.parts.length, board: (project.parts.find(q => BOARDS[q.type]) || {}).type } : null,
    draftProject: () => project,
    resume: () => { setHash(project.lessonKey ? (LESSONS[project.lessonKey] ? "lesson=" : "ex=") + project.lessonKey : ""); },
    newCircuit: b => { project.lessonKey = null; setProject(blank(b), "New circuit"); setHash(b ? "new=" + b : ""); },
    openSaved: n => { const p = listProjects()[n]; if (p) setProject(p, "Opened <b>" + esc(n) + "</b>"); setHash(""); },
    openLesson: k => openLesson(k),
  });
  fromHash(); window.addEventListener("hashchange", fromHash);
  /* the chip held the screen while the modules and the parts loaded; it comes
     down once there is a real editor behind it, with one beat of the animation
     guaranteed so it never just blinks */
  {
    const bt = $("#clboot");
    if (bt) {
      const wait = Math.max(0, 1150 - performance.now());
      setTimeout(() => { document.body.classList.add("clready"); setTimeout(() => bt.classList.add("gone"), 420); }, wait);
    }
  }
  window.CL = { get project() { return project; }, get sim() { return sim; }, get editor() { return editor; }, rt, PARTS, DEFAULT_PINS, defaultPin, pinsWorld, pinDir, routePts, runSim, stopSim, setProject, openLesson, LESSONS, STARTERS, buildFromSpec, fit, phoneGo, partCode, zoomToPart, tools: T, setSelPublic: v => { sel = v; project.parts.forEach(placePart); showInspector(); }, get running() { return running; } };
}
function sendSerial() { const i = $("#serialin"); if (!sim || !i.value) return; sim.serialIn(i.value + "\n"); const o = $("#serialout"); o.textContent += "› " + i.value + "\n"; i.value = ""; }
function btSend(text) {
  const i = $("#btin"); const t = text != null ? text : (i ? i.value : ""); if (!t || !sim) return;
  if (!sim.btSend(t + (text != null ? "" : "\n"))) toast("No Bluetooth module is connected in the code yet");
  phone.bt.push({ from: "phone", text: t, done: true }); if (i && text == null) i.value = ""; renderPhone();
}
Promise.all(Object.values(PARTS).map(d => customElements.whenDefined(d.tag))).then(boot);
