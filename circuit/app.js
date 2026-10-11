/* Circuit Lab - editor. Build circuits, write Arduino code, run it in the browser. */
import { PARTS, CATS } from "./parts.js";
import { Netlist, Sim, loadHex } from "./sim.js";
import { EXAMPLES } from "./examples.js";

const $ = s => document.querySelector(s);
const esc = s => String(s ?? "").replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const KEY = "circuitlab.v1", LIST = "circuitlab.projects.v1";
const BUILD_URL = localStorage.getItem("circuitlab.buildUrl") || "https://hexi.wokwi.com/build";
const WIRE_COLORS = ["#2E9E5B", "#1F6FD1", "#E8590C", "#F5B83D", "#7B3FC4", "#20B8A6", "#E63946", "#2B2D42"];
const ICON = {
  play: '<path d="M7 5l12 7-12 7z"/>', stop: '<rect x="6" y="6" width="12" height="12" rx="1.5"/>', rot: '<path d="M20 11a8 8 0 1 0-2.3 5.7"/><path d="M20 4v7h-7"/>',
  del: '<path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3"/>', plus: '<path d="M12 5v14M5 12h14"/>', fit: '<path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/>',
  zin: '<circle cx="11" cy="11" r="7"/><path d="M20 20l-4-4M8 11h6M11 8v6"/>', zout: '<circle cx="11" cy="11" r="7"/><path d="M20 20l-4-4M8 11h6"/>',
  back: '<path d="M15 5l-7 7 7 7"/>', save: '<path d="M5 4h11l3 3v13H5z"/><path d="M8 4v5h7V4M8 20v-6h8v6"/>', down: '<path d="M12 4v11M7 10l5 5 5-5M5 20h14"/>', up: '<path d="M12 20V9M7 14l5-5 5 5M5 4h14"/>',
  book: '<path d="M5 4h10a4 4 0 0 1 4 4v12H9a4 4 0 0 1-4-4z"/><path d="M5 16a4 4 0 0 1 4-4h10"/>', folder: '<path d="M3 6h7l2 2h9v11H3z"/>', file: '<path d="M6 3h9l4 4v14H6z"/><path d="M14 3v5h5"/>',
  undo: '<path d="M9 14L4 9l5-5"/><path d="M4 9h11a5 5 0 0 1 0 10h-3"/>', sound: '<path d="M4 9v6h4l5 4V5L8 9z"/><path d="M16 9a4 4 0 0 1 0 6"/>', mute: '<path d="M4 9v6h4l5 4V5L8 9z"/><path d="M17 9l4 6M21 9l-4 6"/>',
  x: '<path d="M6 6l12 12M18 6L6 18"/>', search: '<circle cx="11" cy="11" r="7"/><path d="M20 20l-4-4"/>', warn: '<path d="M12 3l10 18H2z"/><path d="M12 10v5M12 18v.5"/>',
};
const ic = (k, c = "ic") => `<svg class="${c}" viewBox="0 0 24 24">${ICON[k] || ""}</svg>`;

/* ---------- state ---------- */
const blankProject = () => ({ v: 1, name: "My circuit", parts: [{ id: "uno1", type: "uno", x: 80, y: 60, rot: 0 }], wires: [], code: "void setup() {\n  pinMode(13, OUTPUT);\n}\n\nvoid loop() {\n  digitalWrite(13, HIGH);\n  delay(500);\n  digitalWrite(13, LOW);\n  delay(500);\n}\n" });
let project = load() || blankProject();
const rt = {};              // id -> { el, wrap, w, h, state }
let view = { x: 40, y: 20, z: 1 };
let sel = null;             // { kind: 'part'|'wire', id }
let wiring = null;          // { from, pts: [[x,y]], mouse:[x,y] }
let hoverPart = null;
let sim = null, running = false, raf = 0, lastT = 0;
let history = [], editor;
let muted = false;

function load() { try { const p = JSON.parse(localStorage.getItem(KEY)); return p && p.parts ? p : null; } catch (e) { return null; } }
function save() { try { localStorage.setItem(KEY, JSON.stringify(project)); } catch (e) { } }
function snapshot() { history.push(JSON.stringify(project)); if (history.length > 60) history.shift(); }
function undo() { if (running || !history.length) return; project = JSON.parse(history.pop()); rebuildAll(); save(); toast("Undone"); }
const uid = t => { let i = 1; while (project.parts.some(p => p.id === t + i)) i++; return t + i; };
function toast(m) { const t = $("#toast"); t.innerHTML = m; t.classList.add("on"); clearTimeout(toast._t); toast._t = setTimeout(() => t.classList.remove("on"), 2200); }

/* ---------- parts on the canvas ---------- */
function makePart(p) {
  const def = PARTS[p.type]; if (!def) return;
  const wrap = document.createElement("div"); wrap.className = "part"; wrap.dataset.id = p.id;
  const el = document.createElement(def.tag);
  Object.entries(Object.assign({}, def.attrs, p.attrs)).forEach(([k, v]) => el.setAttribute(k, v));
  wrap.appendChild(el);
  $("#parts").appendChild(wrap);
  p.sim = Object.assign({}, def.sim || {}, p.sim || {});
  const state = {};
  rt[p.id] = { el, wrap, w: 0, h: 0, state };
  el.addEventListener("button-press", () => { state.pressed = true; if (sim) sim.switchChanged(p.id); });
  el.addEventListener("button-release", () => { state.pressed = false; if (sim) sim.switchChanged(p.id); });
  if (p.type === "slideswitch") el.addEventListener("input", () => { state.value = el.value; if (sim) sim.switchChanged(p.id); });
  el.addEventListener("pininfo-change", () => requestAnimationFrame(() => { measure(p.id); drawWires(); }));
  placePart(p);
  requestAnimationFrame(() => { measure(p.id); drawWires(); });
  setTimeout(() => { measure(p.id); drawWires(); }, 150);
}
function measure(id) {
  const r = rt[id]; if (!r) return;
  const el = r.el; r.w = el.offsetWidth || el.getBoundingClientRect().width / view.z; r.h = el.offsetHeight || el.getBoundingClientRect().height / view.z;
  const p = project.parts.find(q => q.id === id); if (p) placePart(p);
}
function placePart(p) {
  const r = rt[p.id]; if (!r) return;
  r.wrap.style.left = p.x + "px"; r.wrap.style.top = p.y + "px";
  r.wrap.style.transformOrigin = `${r.w / 2}px ${r.h / 2}px`;
  r.wrap.style.transform = p.rot ? `rotate(${p.rot}deg)` : "";
  r.wrap.classList.toggle("sel", !!(sel && sel.kind === "part" && sel.id === p.id));
}
function pinsWorld(p) {
  const r = rt[p.id]; if (!r || !r.el.pinInfo) return [];
  const cx = r.w / 2, cy = r.h / 2, a = (p.rot || 0) * Math.PI / 180, ca = Math.cos(a), sa = Math.sin(a);
  return r.el.pinInfo.map(q => { const dx = q.x - cx, dy = q.y - cy; return { name: q.name, x: p.x + cx + dx * ca - dy * sa, y: p.y + cy + dx * sa + dy * ca }; });
}
function pinPos(node) { const [id, pin] = node.split(":"); const p = project.parts.find(q => q.id === id); if (!p) return null; return pinsWorld(p).find(q => q.name === pin) || null; }
function rebuildAll() {
  stopSim(); $("#parts").innerHTML = ""; Object.keys(rt).forEach(k => delete rt[k]);
  project.parts.forEach(makePart); sel = null; wiring = null;
  $("#pname").value = project.name || "My circuit";
  if (editor) editor.setValue(project.code || "");
  drawWires(); showProps();
}

/* ---------- wires ---------- */
function wireColor(from, to) {
  const n = (from + " " + to).toUpperCase();
  if (/GND|:-|VSS|:K\b/.test(n) && !/5V|VCC/.test(n)) return "#2B2D42";
  if (/5V|VCC|V\+|VDD|12V|:\+/.test(n)) return "#E63946";
  return WIRE_COLORS[project.wires.length % 6];
}
function routePts(a, b, pts) {
  if (pts && pts.length) return [a, ...pts.map(([x, y]) => ({ x, y })), b];
  return [a, { x: b.x, y: a.y }, b];
}
function drawWires() {
  const svg = $("#wires"); let s = "";
  project.wires.forEach((w, i) => {
    const a = pinPos(w.from), b = pinPos(w.to); if (!a || !b) return;
    const d = routePts(a, b, w.pts).map((p, k) => (k ? "L" : "M") + p.x.toFixed(1) + " " + p.y.toFixed(1)).join(" ");
    const on = sel && sel.kind === "wire" && sel.id === i;
    s += `<path class="whit" data-wire="${i}" d="${d}"/><path class="wire ${on ? "on" : ""}" d="${d}" stroke="${w.color || "#2E9E5B"}"/><circle cx="${a.x}" cy="${a.y}" r="2.6" fill="${w.color}"/><circle cx="${b.x}" cy="${b.y}" r="2.6" fill="${w.color}"/>`;
  });
  if (wiring) {
    const a = pinPos(wiring.from), m = wiring.mouse;
    if (a && m) { const pts = [a, ...wiring.pts.map(([x, y]) => ({ x, y })), { x: m[0], y: m[1] }]; s += `<path class="wire ghost" d="${pts.map((p, k) => (k ? "L" : "M") + p.x + " " + p.y).join(" ")}"/>`; }
  }
  svg.innerHTML = s;
  drawPins();
}
function drawPins() {
  const g = $("#pins"); if (running) { g.innerHTML = ""; return; }
  let s = "";
  const show = wiring ? project.parts : project.parts.filter(p => p.id === hoverPart || (sel && sel.kind === "part" && sel.id === p.id));
  const used = new Set(); project.wires.forEach(w => { used.add(w.from); used.add(w.to); });
  show.forEach(p => pinsWorld(p).forEach(q => {
    const node = p.id + ":" + q.name, bb = p.type === "breadboard";
    s += `<circle class="pin ${used.has(node) ? "used" : ""} ${bb ? "bb" : ""}" data-pin="${esc(node)}" cx="${q.x}" cy="${q.y}" r="${bb ? 3.2 : 4.2}"><title>${esc(PARTS[p.type].label)}: ${esc(q.name)}</title></circle>`;
  }));
  g.innerHTML = s;
}

/* ---------- view ---------- */
function applyView() { $("#world").style.transform = `translate(${view.x}px, ${view.y}px) scale(${view.z})`; $("#zoomv").textContent = Math.round(view.z * 100) + "%"; }
function toWorld(cx, cy) { const r = $("#stage").getBoundingClientRect(); return [(cx - r.left - view.x) / view.z, (cy - r.top - view.y) / view.z]; }
function zoomAt(f, cx, cy) {
  const r = $("#stage").getBoundingClientRect(); cx = cx ?? r.left + r.width / 2; cy = cy ?? r.top + r.height / 2;
  const [wx, wy] = toWorld(cx, cy); view.z = Math.max(0.3, Math.min(3, view.z * f));
  view.x = cx - r.left - wx * view.z; view.y = cy - r.top - wy * view.z; applyView();
}
function fit() {
  if (!project.parts.length) return;
  let x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9;
  project.parts.forEach(p => { const r = rt[p.id]; x0 = Math.min(x0, p.x); y0 = Math.min(y0, p.y); x1 = Math.max(x1, p.x + (r ? r.w : 50)); y1 = Math.max(y1, p.y + (r ? r.h : 50)); });
  const st = $("#stage").getBoundingClientRect(), pad = 60;
  view.z = Math.max(0.3, Math.min(1.6, Math.min((st.width - pad * 2) / (x1 - x0 || 1), (st.height - pad * 2) / (y1 - y0 || 1))));
  view.x = (st.width - (x1 - x0) * view.z) / 2 - x0 * view.z; view.y = (st.height - (y1 - y0) * view.z) / 2 - y0 * view.z; applyView();
}

/* ---------- palette ---------- */
function renderPalette() {
  const q = ($("#psearch").value || "").toLowerCase();
  $("#plist").innerHTML = CATS.map(c => {
    const items = Object.entries(PARTS).filter(([k, d]) => d.cat === c && (!q || (d.label + " " + k).toLowerCase().includes(q)));
    if (!items.length) return "";
    return `<div class="pcat"><h4>${c}</h4>${items.map(([k, d]) => `<button class="pitem" draggable="true" data-add="${k}" title="${esc(d.help || "")}"><span class="pthumb" data-thumb="${k}"></span><span>${esc(d.label)}</span></button>`).join("")}</div>`;
  }).join("");
  document.querySelectorAll("[data-thumb]").forEach(t => {
    const d = PARTS[t.dataset.thumb], el = document.createElement(d.tag);
    Object.entries(d.attrs || {}).forEach(([k, v]) => el.setAttribute(k, v));
    t.appendChild(el);
    const fit = (n) => { const r = el.getBoundingClientRect(), w = r.width, h = r.height; if ((!w || !h) && n < 20) return setTimeout(() => fit(n + 1), 60); const s = Math.min(38 / (w || 40), 30 / (h || 30), 1); el.style.transform = `translate(${(40 - w * s) / 2}px,${(32 - h * s) / 2}px) scale(${s})`; };
    (el.updateComplete || Promise.resolve()).then(() => requestAnimationFrame(() => fit(0)));
  });
}
function addPart(type, x, y) {
  if (running) return toast("Stop the simulation to edit the circuit");
  const def = PARTS[type];
  if (def.one && project.parts.some(p => p.type === type)) return toast("You already have an " + def.label);
  snapshot();
  if (x == null) { const st = $("#stage").getBoundingClientRect(); [x, y] = toWorld(st.left + st.width / 2 - 40, st.top + st.height / 2 - 40); }
  while (project.parts.some(q => Math.abs(q.x - x) < 12 && Math.abs(q.y - y) < 12)) { x += 36; y += 28; }
  const p = { id: uid(type), type, x: Math.round(x), y: Math.round(y), rot: 0 };
  project.parts.push(p); makePart(p); sel = { kind: "part", id: p.id }; save(); showProps(); drawWires();
}
function deleteSel() {
  if (running || !sel) return;
  snapshot();
  if (sel.kind === "part") {
    const id = sel.id; project.parts = project.parts.filter(p => p.id !== id);
    project.wires = project.wires.filter(w => !w.from.startsWith(id + ":") && !w.to.startsWith(id + ":"));
    rt[id] && rt[id].wrap.remove(); delete rt[id];
  } else project.wires.splice(sel.id, 1);
  sel = null; save(); drawWires(); showProps();
}
function rotateSel() {
  if (running || !sel || sel.kind !== "part") return; snapshot();
  const p = project.parts.find(q => q.id === sel.id); p.rot = ((p.rot || 0) + 90) % 360; placePart(p); save(); drawWires();
}

/* ---------- properties panel ---------- */
function showProps() {
  const box = $("#props");
  if (!sel) { box.classList.remove("on"); box.innerHTML = ""; return; }
  if (sel.kind === "wire") {
    const w = project.wires[sel.id]; if (!w) { sel = null; return showProps(); }
    box.innerHTML = `<div class="pr-h"><b>Wire</b><small>${esc(w.from.replace(":", " · "))} → ${esc(w.to.replace(":", " · "))}</small></div>
      <div class="swatches">${["#2B2D42", "#E63946", "#2E9E5B", "#1F6FD1", "#E8590C", "#F5B83D", "#7B3FC4", "#20B8A6", "#FFFFFF"].map(c => `<button data-wcolor="${c}" style="background:${c}" class="${w.color === c ? "on" : ""}"></button>`).join("")}</div>
      <div class="pr-btns"><button class="btn danger" data-act="delete">${ic("del")}Delete wire</button></div>`;
    box.classList.add("on"); return;
  }
  const p = project.parts.find(q => q.id === sel.id); if (!p) { sel = null; return showProps(); }
  const d = PARTS[p.type];
  const props = (d.props || []).filter(x => !running || x.live || !x.sim).map(x => {
    const val = x.sim ? (p.sim || {})[x.k] : ((p.attrs || {})[x.k] ?? (d.attrs || {})[x.k]);
    if (x.type === "select") return `<label class="pr-f"><span>${esc(x.label)}</span><select data-prop="${x.k}" ${running && !x.live ? "disabled" : ""}>${x.opts.map(o => `<option ${String(o) === String(val) ? "selected" : ""}>${o}</option>`).join("")}</select></label>`;
    if (x.type === "range") return `<label class="pr-f"><span>${esc(x.label)} <b>${val}</b></span><input type="range" data-prop="${x.k}" min="${x.min}" max="${x.max}" value="${val}"></label>`;
    if (x.type === "toggle") return `<label class="pr-f tog"><input type="checkbox" data-prop="${x.k}" ${val ? "checked" : ""}><span>${esc(x.text || x.label)}</span></label>`;
    if (x.type === "button") return `<button class="btn" data-pbtn="${x.k}">${esc(x.text)}</button>`;
    return "";
  }).join("");
  box.innerHTML = `<div class="pr-h"><b>${esc(d.label)}</b><small>${esc(p.id)}</small></div>
    ${props ? `<div class="pr-fields">${props}</div>` : ""}
    ${d.help ? `<p class="pr-help">${esc(d.help)}</p>` : ""}
    ${running ? "" : `<div class="pr-btns"><button class="btn" data-act="rotate">${ic("rot")}Rotate</button><button class="btn danger" data-act="delete">${ic("del")}Delete</button></div>`}`;
  box.classList.add("on");
}

/* ---------- compile + run ---------- */
async function compile(code) {
  const res = await fetch(BUILD_URL, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ sketch: code, files: [] }) });
  if (!res.ok) throw new Error("Build server error " + res.status);
  return res.json();
}
function setOutput(text, err) { const o = $("#buildout"); o.textContent = text; o.classList.toggle("err", !!err); }
function markErrors(stderr) {
  editor.getAllMarks().forEach(m => m.clear());
  for (let i = 0; i < editor.lineCount(); i++) editor.removeLineClass(i, "background", "cm-errline");
  const re = /sketch\.ino:(\d+):(\d+): error: (.*)/g; let m, first = null;
  while ((m = re.exec(stderr))) { const ln = +m[1] - 1; editor.addLineClass(ln, "background", "cm-errline"); if (first === null) first = ln; }
  if (first !== null) { editor.scrollIntoView({ line: first, ch: 0 }, 80); }
}
function friendlyErrors(stderr) {
  return stderr.split("\n").filter(l => /error:/.test(l)).map(l => {
    const m = l.match(/sketch\.ino:(\d+):\d+: error: (.*)/); if (!m) return l;
    let msg = m[2];
    if (/was not declared in this scope/.test(msg)) msg += "  (check the spelling and capital letters, or declare it first)";
    if (/expected ';'/.test(msg)) msg += "  (a semicolon ; is missing at the end of a line)";
    if (/No such file or directory/.test(msg)) msg += "  (this library is not available in Circuit Lab)";
    return `Line ${m[1]}: ${msg}`;
  }).join("\n") || stderr;
}
async function runSim() {
  if (running) return;
  project.code = editor.getValue(); save();
  if (!project.parts.some(p => p.type === "uno")) return toast("Add an Arduino Uno first");
  const btn = $("#runbtn"); btn.disabled = true; btn.innerHTML = `<span class="spin"></span>Compiling…`;
  setOutput("Compiling your sketch…");
  try {
    const r = await compile(project.code);
    if (!r.hex) { setOutput(friendlyErrors(r.stderr || "Compile failed"), true); markErrors(r.stderr || ""); tab("code"); throw 0; }
    markErrors("");
    setOutput((r.stdout || "").trim().split("\n")[0] || "Compiled.", false);
    project.parts.forEach(p => measure(p.id));
    const states = {}; project.parts.forEach(p => { states[p.id] = rt[p.id].state; });
    const net = new Netlist(project, pinsWorld, states);
    $("#serialout").textContent = "";
    sim = new Sim({ project, rt, net, program: loadHex(r.hex), onSerial: serialAppend, onWarn: showWarnings });
    running = true; document.body.classList.add("running"); sel = sel && sel.kind === "part" ? sel : null;
    btn.innerHTML = `${ic("stop")}Stop`; btn.classList.add("stop"); btn.disabled = false;
    lastT = performance.now(); raf = requestAnimationFrame(loop);
    showProps(); drawPins();
  } catch (e) {
    if (e) setOutput("Could not reach the compile server. Check your internet connection.\n" + (e.message || ""), true);
    btn.disabled = false; btn.innerHTML = `${ic("play")}Run`;
  }
}
function loop(t) {
  if (!running) return;
  const dt = Math.min(0.05, (t - lastT) / 1000); lastT = t;
  sim.run(dt * 1000); sim.frame(dt);
  $("#simspeed").textContent = Math.round(Math.min(1, sim.speed || 1) * 100) + "% speed · " + (sim.cpu.cycles / 16e6).toFixed(1) + " s";
  raf = requestAnimationFrame(loop);
}
function stopSim() {
  if (!running) return;
  running = false; cancelAnimationFrame(raf); sim && sim.stop(); sim = null;
  document.body.classList.remove("running");
  const btn = $("#runbtn"); btn.innerHTML = `${ic("play")}Run`; btn.classList.remove("stop");
  // reset visuals
  project.parts.forEach(p => { const el = rt[p.id] && rt[p.id].el; if (!el) return;
    if (p.type === "led") { el.value = false; } if (p.type === "uno") { el.led13 = false; el.ledPower = false; el.ledTX = false; }
    if (p.type === "rgbled") { el.ledRed = el.ledGreen = el.ledBlue = 0; } if (p.type === "seg7") el.values = [0, 0, 0, 0, 0, 0, 0, 0];
    if (p.type === "buzzer") el.hasSignal = false; if (p.type === "lcd") { el.characters = new Uint8Array(32).fill(32); el.backlight = false; }
    if (p.type === "ledring" && el.reset) el.reset(); if (p.type === "neopixel") { el.r = el.g = el.b = 0; } if (p.type === "dcmotor") { el.speed = 0; el.spin(0); }
  });
  showWarnings([]); showProps(); drawPins(); $("#simspeed").textContent = "";
}
function serialAppend(ch) { const o = $("#serialout"); o.textContent += ch; if (o.textContent.length > 20000) o.textContent = o.textContent.slice(-15000); o.scrollTop = o.scrollHeight; if (!serialAppend.told && ch.trim()) { serialAppend.told = true; $("[data-tab=serial]").classList.add("ping"); } }
function showWarnings(list) { const w = $("#warns"); w.innerHTML = list.map(t => `<div>${ic("warn")}${esc(t)}</div>`).join(""); w.classList.toggle("on", list.length > 0); }

/* ---------- projects ---------- */
function listProjects() { try { return JSON.parse(localStorage.getItem(LIST)) || {}; } catch (e) { return {}; } }
function saveAs() {
  project.code = editor.getValue(); project.name = $("#pname").value.trim() || "My circuit";
  const all = listProjects(); all[project.name] = Object.assign({}, project, { saved: new Date().toISOString() });
  try { localStorage.setItem(LIST, JSON.stringify(all)); toast("Saved as <b>" + esc(project.name) + "</b>"); } catch (e) { toast("Could not save (browser storage is full)"); }
  save();
}
function openModal(html) { $("#modal").innerHTML = `<div class="mbox">${html}</div>`; document.body.classList.add("mopen"); }
function closeModal() { document.body.classList.remove("mopen"); $("#modal").innerHTML = ""; }
function showExamples() {
  openModal(`<div class="mh"><h2>Example circuits</h2><button class="mx" data-close>${ic("x")}</button></div><p class="muted">Ready-made circuits with code. Open one, press Run, then change it.</p>
    <div class="exgrid">${EXAMPLES.map((e, i) => `<button class="excard" data-ex="${i}"><b>${esc(e.name)}</b><small>${esc(e.about)}</small>${e.lesson ? `<em>${esc(e.lesson)}</em>` : ""}</button>`).join("")}</div>`);
}
function showOpen() {
  const all = listProjects(), names = Object.keys(all).sort((a, b) => (all[b].saved || "").localeCompare(all[a].saved || ""));
  openModal(`<div class="mh"><h2>My circuits</h2><button class="mx" data-close>${ic("x")}</button></div><p class="muted">Saved in this browser. Use Download to keep a copy or share it.</p>
    <div class="olist">${names.map(n => `<div class="orow"><button data-openp="${esc(n)}"><b>${esc(n)}</b><small>${all[n].parts.length} parts · saved ${new Date(all[n].saved).toLocaleString()}</small></button><button class="lk" data-delp="${esc(n)}">Delete</button></div>`).join("") || `<p class="muted">Nothing saved yet. Use Save to keep a circuit here.</p>`}</div>`);
}
function setProject(p, msg) {
  stopSim(); snapshot(); project = JSON.parse(JSON.stringify(p)); delete project.saved;
  project.parts.forEach(q => { if (q.x == null) { q.x = 0; q.y = 0; } q.rot = q.rot || 0; });
  rebuildAll(); save();
  setTimeout(() => { resolveAnchors(); fit(); }, 250);
  if (msg) toast(msg);
}
/* place parts so a chosen pin sits exactly on a target pin (e.g. a breadboard hole) */
function resolveAnchors() {
  let moved = false;
  project.parts.forEach(p => {
    if (!p.anchor) return;
    measure(p.id);
    const target = pinPos(p.anchor.to), mine = pinsWorld(p).find(q => q.name === p.anchor.pin);
    if (!target || !mine) return;
    p.x += target.x - mine.x; p.y += target.y - mine.y; delete p.anchor; placePart(p); moved = true;
  });
  if (moved) { drawWires(); save(); }
}
function download() {
  project.code = editor.getValue();
  const a = document.createElement("a"); a.href = URL.createObjectURL(new Blob([JSON.stringify(project, null, 1)], { type: "application/json" }));
  a.download = (project.name || "circuit").replace(/[^\w-]+/g, "_") + ".circuit.json"; document.body.appendChild(a); a.click(); setTimeout(() => a.remove(), 300);
}
function tab(t) { document.querySelectorAll("[data-tab]").forEach(b => b.classList.toggle("on", b.dataset.tab === t)); document.querySelectorAll(".tpane").forEach(p => p.classList.toggle("on", p.id === "t-" + t)); if (t === "code") editor.refresh(); if (t === "serial") $("[data-tab=serial]").classList.remove("ping"); }

/* ---------- pointer interaction ---------- */
let drag = null;
function onDown(e) {
  if (e.button === 1 || (e.button === 0 && e.target.id === "stage") || (e.button === 0 && (e.target.id === "wires" || e.target.closest("#world") && !e.target.closest(".part, .pin, .whit")))) {
    if (wiring && e.button === 0) { const [x, y] = toWorld(e.clientX, e.clientY); wiring.pts.push([Math.round(x), Math.round(y)]); drawWires(); return; }
    drag = { kind: "pan", sx: e.clientX, sy: e.clientY, vx: view.x, vy: view.y, moved: false };
    return;
  }
  const pin = e.target.closest(".pin");
  if (pin && !running) { e.stopPropagation(); clickPin(pin.dataset.pin); return; }
  const wh = e.target.closest(".whit");
  if (wh && !running) { sel = { kind: "wire", id: +wh.dataset.wire }; drawWires(); showProps(); project.parts.forEach(placePart); return; }
  const part = e.target.closest(".part");
  if (part) {
    const id = part.dataset.id;
    sel = { kind: "part", id }; project.parts.forEach(placePart); showProps(); drawWires();
    if (running) return;
    const p = project.parts.find(q => q.id === id), [wx, wy] = toWorld(e.clientX, e.clientY);
    drag = { kind: "part", id, dx: wx - p.x, dy: wy - p.y, moved: false };
    e.preventDefault();
  }
}
function onMove(e) {
  const [wx, wy] = toWorld(e.clientX, e.clientY);
  if (wiring) { wiring.mouse = [wx, wy]; drawWires(); }
  if (!drag) {
    const part = e.target.closest && e.target.closest(".part"); const id = part ? part.dataset.id : (e.target.closest && e.target.closest(".pin") ? hoverPart : null);
    if (id !== hoverPart && !running) { hoverPart = id; drawPins(); }
    return;
  }
  if (drag.kind === "pan") { view.x = drag.vx + e.clientX - drag.sx; view.y = drag.vy + e.clientY - drag.sy; drag.moved = true; applyView(); return; }
  if (drag.kind === "part") {
    if (!drag.moved) { snapshot(); drag.moved = true; }
    const p = project.parts.find(q => q.id === drag.id), g = 4.8;
    p.x = Math.round((wx - drag.dx) / g) * g; p.y = Math.round((wy - drag.dy) / g) * g; placePart(p); drawWires();
  }
}
function onUp() {
  if (drag && drag.kind === "pan" && !drag.moved && !wiring) { sel = null; project.parts.forEach(placePart); showProps(); drawWires(); }
  if (drag && drag.kind === "part" && drag.moved) save();
  drag = null;
}
function clickPin(node) {
  if (!wiring) { wiring = { from: node, pts: [], mouse: null }; document.body.classList.add("wiring"); drawWires(); return; }
  if (node === wiring.from) { cancelWire(); return; }
  snapshot();
  project.wires.push({ from: wiring.from, to: node, pts: wiring.pts, color: wireColor(wiring.from, node) });
  sel = { kind: "wire", id: project.wires.length - 1 };
  cancelWire(); save(); drawWires(); showProps();
}
function cancelWire() { wiring = null; document.body.classList.remove("wiring"); drawWires(); }

/* ---------- boot ---------- */
function boot() {
  renderPalette();
  editor = CodeMirror($("#editor"), { value: project.code || "", mode: "text/x-c++src", lineNumbers: true, matchBrackets: true, autoCloseBrackets: true, indentUnit: 2, tabSize: 2, theme: "cl" });
  editor.on("change", () => { clearTimeout(boot._t); boot._t = setTimeout(() => { project.code = editor.getValue(); save(); }, 400); });
  rebuildAll(); applyView(); setTimeout(fit, 300);

  const stage = $("#stage");
  stage.addEventListener("pointerdown", onDown);
  window.addEventListener("pointermove", onMove);
  window.addEventListener("pointerup", onUp);
  stage.addEventListener("wheel", e => { e.preventDefault(); if (e.ctrlKey || Math.abs(e.deltaY) > 0) zoomAt(e.deltaY < 0 ? 1.1 : 1 / 1.1, e.clientX, e.clientY); }, { passive: false });
  stage.addEventListener("dragover", e => e.preventDefault());
  stage.addEventListener("drop", e => { e.preventDefault(); const t = e.dataTransfer.getData("text/plain"); if (PARTS[t]) { const [x, y] = toWorld(e.clientX, e.clientY); addPart(t, x - 20, y - 20); } });
  $("#plist").addEventListener("dragstart", e => { const b = e.target.closest("[data-add]"); if (b) e.dataTransfer.setData("text/plain", b.dataset.add); });
  $("#psearch").addEventListener("input", renderPalette);
  $("#pname").addEventListener("change", e => { project.name = e.target.value.trim() || "My circuit"; save(); });
  $("#serialin").addEventListener("keydown", e => { if (e.key === "Enter" && sim) { sim.serialIn(e.target.value + "\n"); e.target.value = ""; } });

  document.addEventListener("click", e => {
    const t = e.target.closest("button, [data-close]"); if (!t) { if (e.target.id === "modal") closeModal(); return; }
    const d = t.dataset;
    if (d.add) return addPart(d.add);
    if ("close" in d) return closeModal();
    if (d.tab) return tab(d.tab);
    if (d.ex != null) { closeModal(); return setProject(EXAMPLES[+d.ex], "Opened <b>" + esc(EXAMPLES[+d.ex].name) + "</b>. Press Run."); }
    if (d.openp) { const p = listProjects()[d.openp]; closeModal(); return setProject(p, "Opened <b>" + esc(d.openp) + "</b>"); }
    if (d.delp) { if (!confirm("Delete " + d.delp + "?")) return; const all = listProjects(); delete all[d.delp]; localStorage.setItem(LIST, JSON.stringify(all)); return showOpen(); }
    if (d.wcolor && sel && sel.kind === "wire") { snapshot(); project.wires[sel.id].color = d.wcolor; save(); drawWires(); return showProps(); }
    if (d.pbtn && sel) { const p = project.parts.find(q => q.id === sel.id); p.sim[d.pbtn] = true; if (sim) sim.simChanged(p.id); toast("Motion!"); return; }
    switch (d.act) {
      case "run": return running ? stopSim() : runSim();
      case "delete": return deleteSel();
      case "rotate": return rotateSel();
      case "zin": return zoomAt(1.2);
      case "zout": return zoomAt(1 / 1.2);
      case "fit": return fit();
      case "undo": return undo();
      case "new": if (confirm("Start a new circuit? Unsaved changes to this one will be lost (use Save first).")) setProject(blankProject(), "New circuit"); return;
      case "examples": return showExamples();
      case "open": return showOpen();
      case "save": return saveAs();
      case "download": return download();
      case "upload": return $("#fileup").click();
      case "mute": muted = !muted; Sim.muted = muted; t.innerHTML = ic(muted ? "mute" : "sound"); return;
      case "clearserial": $("#serialout").textContent = ""; return;
    }
  });
  document.addEventListener("input", e => {
    const t = e.target; if (!t.dataset.prop || !sel) return;
    const p = project.parts.find(q => q.id === sel.id), def = PARTS[p.type], x = (def.props || []).find(z => z.k === t.dataset.prop);
    const v = t.type === "checkbox" ? t.checked : t.value;
    if (x.sim) { p.sim[x.k] = t.type === "range" ? +v : v; if (sim) sim.simChanged(p.id); if (t.type === "range") t.previousElementSibling.querySelector("b").textContent = v; save(); return; }
    snapshot(); p.attrs = Object.assign({}, p.attrs, { [x.k]: v }); rt[p.id].el.setAttribute(x.k, v);
    if (x.k === "pixels") { rt[p.id].el.pixels = +v; }
    save(); setTimeout(() => { measure(p.id); drawWires(); }, 60);
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
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "z") { e.preventDefault(); undo(); return; }
    if (e.key === "Escape") { if (document.body.classList.contains("mopen")) closeModal(); else if (wiring) cancelWire(); else { sel = null; project.parts.forEach(placePart); showProps(); drawWires(); } }
    if ((e.key === "Delete" || e.key === "Backspace") && sel) { e.preventDefault(); deleteSel(); }
    if (e.key.toLowerCase() === "r" && sel) rotateSel();
  });
  // resizable code panel
  const gut = $("#gutter"); let gx = null;
  gut.addEventListener("pointerdown", e => { gx = e.clientX; gut.setPointerCapture(e.pointerId); });
  gut.addEventListener("pointermove", e => { if (gx === null) return; const w = Math.max(300, Math.min(window.innerWidth - 500, window.innerWidth - e.clientX)); document.documentElement.style.setProperty("--codew", w + "px"); editor.refresh(); });
  gut.addEventListener("pointerup", () => { gx = null; });
  // open an example from the URL, e.g. circuit.html#ex=blink
  const fromHash = () => { const m = location.hash.match(/ex=([\w-]+)/); if (!m) return; const i = EXAMPLES.findIndex(x => x.key === m[1]); if (i >= 0) { if (running) stopSim(); setProject(EXAMPLES[i], "Opened <b>" + esc(EXAMPLES[i].name) + "</b>. Press Run."); } };
  fromHash(); window.addEventListener("hashchange", fromHash);
  window.CL = { get project() { return project; }, get sim() { return sim; }, rt, pinsWorld, runSim, stopSim, setProject, EXAMPLES };
}
Promise.all(Object.values(PARTS).map(d => customElements.whenDefined(d.tag))).then(boot);
