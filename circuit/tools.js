/* Circuit Lab - bench tools: multimeter probe, logic scope, live wire voltages,
   slow motion, copy and paste, canvas notes, image and parts-list export, share links. */
let C = null;                       // context handed over by app.js
const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];
const esc = s => String(s ?? "").replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

export const state = {
  probe: false, volts: false, scope: false,
  speed: 1, paused: false,
  channels: [],                     // [{ node, name, color, buf:[[cycles, volts]] }]
};
const COLORS = ["#2E6BE6", "#E63946", "#2E9E5B", "#F08C00", "#7B3FC4", "#20B8A6"];
const SPEEDS = [["1", 1], ["½", 0.5], ["⅕", 0.2], ["1/20", 0.05], ["1/100", 0.01]];

export function initTools(ctx) {
  C = ctx;
  injectToolbar();
  injectScope();
  injectRunControls();
}

/* ================= toolbar ================= */
function injectToolbar() {
  const bar = $(".ctools"); if (!bar) return;
  const i = document.createElement("i");
  const wrap = document.createElement("span");
  wrap.className = "btools";
  wrap.innerHTML = `
    <button data-tool="probe" title="Multimeter: point at a pin or wire while the simulation runs to read its voltage">${C.ic("probe")}</button>
    <button data-tool="volts" title="Colour the wires by voltage while running">${C.ic("volt")}</button>
    <button data-tool="scope" title="Logic scope: watch pins change over time">${C.ic("scope")}</button>
    <i></i>
    <button data-tool="dup" title="Duplicate the selection (Ctrl+D)">${C.ic("copy")}</button>
    <button data-tool="note" title="Add a note to the canvas">${C.ic("note")}</button>
    <button data-act="schem" title="Schematic view: your circuit drawn as a diagram">${C.ic("sch")}</button>
    <button data-tool="export" title="Save a picture, a parts list or a link">${C.ic("share")}</button>`;
  bar.appendChild(i); bar.appendChild(wrap);
  bar.addEventListener("click", e => {
    const b = e.target.closest("[data-tool]"); if (!b) return;
    const k = b.dataset.tool;
    if (k === "probe" || k === "volts" || k === "scope") {
      state[k] = !state[k];
      if (k === "scope") $("#scope").classList.toggle("on", state.scope);
      if (k === "probe" && !state.probe) hideReadout();
      syncToolbar(); C.drawWires();
      if (k === "volts") C.drawWires();
      if (k === "probe" && state.probe) C.toast(C.running ? "Point at any pin or wire to read its voltage. Click one to put it on the scope." : "Start the simulation, then point at a pin to measure it.", "", 3200);
      return;
    }
    if (k === "dup") return duplicateSelection();
    if (k === "note") return addNote();
    if (k === "export") return showExport();
  });
  syncToolbar();
}
export function syncToolbarUI() { syncToolbar(); }
function syncToolbar() { $$("[data-tool]").forEach(b => b.classList.toggle("on", !!state[b.dataset.tool])); }

/* ================= run controls (pause, step, slow motion) ================= */
function injectRunControls() {
  const btn = $("#runbtn"); if (!btn) return;
  const g = document.createElement("div");
  g.className = "runctl";
  g.innerHTML = `
    <button data-rc="pause" title="Pause (Space)">${C.ic("pause")}</button>
    <button data-rc="step" title="Run one short step">${C.ic("step")}</button>
    <span class="spd">${SPEEDS.map(([l, v]) => `<button data-spd="${v}" class="${v === 1 ? "on" : ""}" title="Run at ${l} speed">${l}</button>`).join("")}</span>`;
  btn.parentNode.insertBefore(g, btn);
  g.addEventListener("click", e => {
    const b = e.target.closest("button"); if (!b) return;
    if (b.dataset.spd) { state.speed = +b.dataset.spd; state.paused = false; syncRun(); return; }
    if (b.dataset.rc === "pause") { state.paused = !state.paused; syncRun(); return; }
    if (b.dataset.rc === "step") { state.paused = true; syncRun(); C.stepOnce(); }
  });
  syncRun();
}
export function syncRunUI() { syncRun(); }
function syncRun() {
  $$("[data-spd]").forEach(b => b.classList.toggle("on", +b.dataset.spd === state.speed));
  const p = $('[data-rc="pause"]'); if (p) { p.classList.toggle("on", state.paused); p.innerHTML = C.ic(state.paused ? "play" : "pause"); }
}

/* ================= multimeter ================= */
export function netVolts(node) {
  const sim = C.sim; if (!sim || !node) return null;
  const i = node.indexOf(":"); if (i < 0) return null;
  try { return sim.volts(sim.net.root(node.slice(0, i), node.slice(i + 1))); } catch (e) { return null; }
}
export function readoutFor(node) {
  const v = netVolts(node), sim = C.sim;
  if (v == null) return `<span class="mv none">not connected</span>`;
  const logic = sim ? sim.logic : 5;
  const lvl = v > logic * 0.6 ? "HIGH" : v < logic * 0.3 ? "LOW" : "between";
  return `<span class="mv ${lvl === "HIGH" ? "hi" : lvl === "LOW" ? "lo" : "mid"}">${v.toFixed(2)} V · ${lvl}</span>`;
}
let readoutNode = null;
export function showReadout(node, x, y) {
  readoutNode = node;
  const el = $("#meter") || (() => { const d = document.createElement("div"); d.id = "meter"; d.className = "meter"; $("#stage").appendChild(d); return d; })();
  el.innerHTML = `<b>${C.pinTitle(node)}</b>${readoutFor(node)}`;
  el.style.left = x + "px"; el.style.top = y + "px"; el.classList.add("on");
}
export function hideReadout() { readoutNode = null; const el = $("#meter"); if (el) el.classList.remove("on"); }
export function refreshReadout() { if (readoutNode) { const el = $("#meter"); if (el) el.innerHTML = `<b>${C.pinTitle(readoutNode)}</b>${readoutFor(readoutNode)}`; } }

/* ================= logic scope ================= */
function injectScope() {
  const box = document.createElement("div");
  box.id = "scope"; box.className = "scope";
  box.innerHTML = `<div class="sch"><b>Logic scope</b><span class="muted" id="scopehint">Turn on the multimeter and click pins to watch them.</span><span id="scopechips" class="chips"></span><div class="grow"></div><button class="cbtn" data-sc="clear">Clear</button><button class="cbtn icon" data-sc="close">✕</button></div><canvas id="scopecv"></canvas>`;
  $("#stage").appendChild(box);
  box.addEventListener("click", e => {
    const b = e.target.closest("[data-sc], [data-ch]"); if (!b) return;
    if (b.dataset.ch != null) { state.channels.splice(+b.dataset.ch, 1); renderChips(); drawScope(); return; }
    if (b.dataset.sc === "clear") { state.channels.forEach(c => c.buf.length = 0); drawScope(); return; }
    if (b.dataset.sc === "close") { state.scope = false; box.classList.remove("on"); syncToolbar(); }
  });
}
export function toggleChannel(node) {
  const i = state.channels.findIndex(c => c.node === node);
  if (i >= 0) { state.channels.splice(i, 1); }
  else {
    if (state.channels.length >= 6) { C.toast("The scope holds six signals. Remove one first."); return; }
    state.channels.push({ node, name: shortName(node), color: COLORS[state.channels.length % COLORS.length], buf: [] });
    state.scope = true; $("#scope").classList.add("on"); syncToolbar();
  }
  renderChips(); drawScope();
}
function shortName(node) {
  const i = node.indexOf(":"), id = node.slice(0, i), pin = node.slice(i + 1);
  const p = C.project.parts.find(q => q.id === id); if (!p) return pin;
  return (C.BOARDS[p.type] ? "" : C.partLabel(p).split(" ")[0] + " ") + pin;
}
function renderChips() {
  const el = $("#scopechips"); if (!el) return;
  el.innerHTML = state.channels.map((c, i) => `<button data-ch="${i}" style="--c:${c.color}" title="Remove">${esc(c.name)}</button>`).join("");
  const h = $("#scopehint"); if (h) h.style.display = state.channels.length ? "none" : "";
}
/* called from the simulation loop: one sample per animation frame is not enough for
   fast signals, so the simulator samples inside its own run loop as well */
export function sampleScope(sim) {
  if (!state.channels.length || !sim) return;
  const c = sim.cpu.cycles;
  state.channels.forEach(ch => {
    const v = netVolts(ch.node);
    const last = ch.buf[ch.buf.length - 1];
    if (last && Math.abs((last[1] ?? -99) - (v ?? -99)) < 0.05 && c - last[0] < 16e6 * 0.02) return;
    ch.buf.push([c, v]);
    while (ch.buf.length > 4000) ch.buf.shift();
  });
}
export function drawScope() {
  const box = $("#scope"); if (!box || !box.classList.contains("on")) return;
  const cv = $("#scopecv"); if (!cv) return;
  const w = cv.width = cv.clientWidth * 2, h = cv.height = cv.clientHeight * 2;
  const g = cv.getContext("2d"); g.clearRect(0, 0, w, h);
  const sim = C.sim;
  if (!state.channels.length || !sim) { g.fillStyle = "#94A3B8"; g.font = "22px sans-serif"; g.fillText(sim ? "Click pins while the multimeter is on to watch them here." : "Start the simulation.", 20, h / 2); return; }
  const now = sim.cpu.cycles, span = 16e6 * 2;          // the last two seconds
  const t0 = now - span, logic = sim.logic;
  const rowH = h / state.channels.length, pad = 10;
  g.strokeStyle = "#E2E8F0"; g.lineWidth = 2;
  for (let i = 1; i < state.channels.length; i++) { const y = i * rowH; g.beginPath(); g.moveTo(0, y); g.lineTo(w, y); g.stroke(); }
  // time grid every 0.5 s
  g.strokeStyle = "#F1F5F9";
  for (let s = 0; s <= 4; s++) { const x = w - s * w / 4; g.beginPath(); g.moveTo(x, 0); g.lineTo(x, h); g.stroke(); }
  state.channels.forEach((ch, i) => {
    const top = i * rowH + pad, bot = (i + 1) * rowH - pad;
    const yOf = v => v == null ? (top + bot) / 2 : bot - Math.max(0, Math.min(1, v / logic)) * (bot - top);
    g.strokeStyle = ch.color; g.lineWidth = 3; g.beginPath();
    let started = false, prevY = null;
    ch.buf.forEach(([c, v]) => {
      const x = (c - t0) / span * w; if (x < -w) return;
      const y = yOf(v);
      if (!started) { g.moveTo(Math.max(0, x), y); started = true; }
      else { g.lineTo(x, prevY); g.lineTo(x, y); }
      prevY = y;
    });
    if (started) g.lineTo(w, prevY);
    g.stroke();
    g.fillStyle = ch.color; g.font = "600 20px 'Atkinson Hyperlegible Next', sans-serif";
    g.fillText(ch.name, 8, top + 18);
    const last = ch.buf[ch.buf.length - 1];
    if (last) { g.fillStyle = "#64748B"; g.font = "18px 'JetBrains Mono', monospace"; g.fillText(last[1] == null ? "—" : last[1].toFixed(2) + " V", w - 110, top + 18); }
  });
}

/* ================= live wire voltages ================= */
export function wireTint(w) {
  if (!state.volts || !C.running) return null;
  const v = netVolts(w.from); if (v == null) return "#C8CED8";
  const logic = C.sim ? C.sim.logic : 5;
  if (v > logic * 0.6) return "#E63946";
  if (v < logic * 0.3) return "#2B6CB0";
  return "#F59E0B";
}

/* ================= selection, copy and paste ================= */
export const multi = new Set();
export function selectedIds() {
  const ids = new Set(multi);
  if (C.sel && C.sel.kind === "part") ids.add(C.sel.id);
  return [...ids];
}
export function clearMulti() { if (multi.size) { multi.clear(); C.project.parts.forEach(C.placePart); } }
export function toggleMulti(id) { multi.has(id) ? multi.delete(id) : multi.add(id); C.project.parts.forEach(C.placePart); }

function cloneParts(ids) {
  const set = new Set(ids);
  const parts = C.project.parts.filter(p => set.has(p.id)).map(p => JSON.parse(JSON.stringify(p)));
  const wires = C.project.wires.filter(w => set.has(w.from.split(":")[0]) && set.has(w.to.split(":")[0])).map(w => JSON.parse(JSON.stringify(w)));
  return { parts, wires };
}
let clipboard = null;
export function copySelection() {
  const ids = selectedIds(); if (!ids.length) return C.toast("Select a part first");
  clipboard = cloneParts(ids);
  try { localStorage.setItem("circuitlab.clip", JSON.stringify(clipboard)); } catch (e) { }
  C.toast(`Copied ${clipboard.parts.length} part${clipboard.parts.length === 1 ? "" : "s"}`);
}
export function pasteClipboard(dx = 24, dy = 24) {
  let clip = clipboard;
  if (!clip) { try { clip = JSON.parse(localStorage.getItem("circuitlab.clip")); } catch (e) { } }
  if (!clip || !clip.parts.length) return C.toast("Nothing copied yet");
  C.snapshot();
  const map = {};
  clip.parts.forEach(p => {
    if (C.PARTS[p.type] && C.PARTS[p.type].one && C.project.parts.some(q => q.type === p.type)) return;   // only one board
    const id = C.uid(p.type); map[p.id] = id;
    const q = Object.assign({}, p, { id, x: p.x + dx, y: p.y + dy });
    C.project.parts.push(q);
  });
  clip.wires.forEach(w => {
    const [fa, fp] = splitNode(w.from), [ta, tp] = splitNode(w.to);
    if (!map[fa] || !map[ta]) return;
    C.project.wires.push({ from: map[fa] + ":" + fp, to: map[ta] + ":" + tp, color: w.color, pts: (w.pts || []).map(([x, y]) => [x + dx, y + dy]) });
  });
  C.rebuildAll(true); C.save();
  multi.clear(); Object.values(map).forEach(id => multi.add(id));
  C.setSel(Object.values(map).length ? { kind: "part", id: Object.values(map)[0] } : null);
  C.project.parts.forEach(C.placePart);
  C.toast(`Pasted ${Object.keys(map).length} part${Object.keys(map).length === 1 ? "" : "s"}`);
}
const splitNode = n => { const i = n.indexOf(":"); return [n.slice(0, i), n.slice(i + 1)]; };
export function duplicateSelection() { copySelection(); pasteClipboard(); }

/* ================= notes on the canvas ================= */
export function addNote() {
  C.snapshot();
  const id = C.uid("note");
  const [x, y] = C.centreOfView();
  C.project.parts.push({ id, type: "note", x: Math.round(x), y: Math.round(y), rot: 0, attrs: { text: "Write a note here", color: "yellow" } });
  C.rebuildAll(true); C.save();
  C.setSel({ kind: "part", id }); C.project.parts.forEach(C.placePart); C.showInspector();
  C.toast("Note added. Type into it, or edit it in the panel on the right.");
}

/* ================= export ================= */
function partsList() {
  const count = {};
  C.project.parts.forEach(p => {
    if (p.type === "note") return;
    const d = C.PARTS[p.type]; if (!d) return;
    const name = (d.kit && d.kit[0]) || d.label;
    count[name] = (count[name] || 0) + 1;
  });
  return Object.entries(count).sort((a, b) => a[0].localeCompare(b[0]));
}
function wiringTable() {
  return C.project.wires.map(w => {
    const [fa, fp] = splitNode(w.from), [ta, tp] = splitNode(w.to);
    const pa = C.project.parts.find(q => q.id === fa), pb = C.project.parts.find(q => q.id === ta);
    return [pa ? C.partLabel(pa) : fa, fp, pb ? C.partLabel(pb) : ta, tp];
  });
}
function csvCell(s) { return /[",\n]/.test(s) ? '"' + String(s).replace(/"/g, '""') + '"' : String(s); }
export function downloadBom(kind) {
  const name = (C.project.name || "circuit").replace(/[^\w-]+/g, "_");
  let text, ext, mime;
  if (kind === "csv") {
    text = "Section,A,B,C,D\n"
      + partsList().map(([n, c]) => ["Parts", n, c, "", ""].map(csvCell).join(",")).join("\n")
      + "\n" + wiringTable().map(r => ["Wiring", ...r].map(csvCell).join(",")).join("\n") + "\n";
    ext = "csv"; mime = "text/csv";
  } else {
    text = `# ${C.project.name || "Circuit"}\n\n## Parts you need\n\n`
      + partsList().map(([n, c]) => `- ${c} × ${n}`).join("\n")
      + `\n\n## Wiring\n\n| From | Pin | To | Pin |\n| --- | --- | --- | --- |\n`
      + wiringTable().map(r => `| ${r[0]} | ${r[1]} | ${r[2]} | ${r[3]} |`).join("\n") + "\n";
    ext = "md"; mime = "text/markdown";
  }
  dl(new Blob([text], { type: mime }), `${name}_parts_and_wiring.${ext}`);
}
function dl(blob, filename) {
  const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = filename;
  document.body.appendChild(a); a.click(); setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 400);
}

/* a picture of the circuit: every part is drawn from its own SVG, so the result is sharp */
async function renderImage(scale = 2) {
  const b = C.bounds(), pad = 24;
  const W = Math.max(40, b.x1 - b.x0 + pad * 2), H = Math.max(40, b.y1 - b.y0 + pad * 2);
  const cv = document.createElement("canvas"); cv.width = Math.round(W * scale); cv.height = Math.round(H * scale);
  const g = cv.getContext("2d");
  g.fillStyle = "#FFFFFF"; g.fillRect(0, 0, cv.width, cv.height);
  g.scale(scale, scale); g.translate(-b.x0 + pad, -b.y0 + pad);
  const load = src => new Promise(res => { const im = new Image(); im.onload = () => res(im); im.onerror = () => res(null); im.src = src; });
  for (const p of C.project.parts) {
    const r = C.rt[p.id]; if (!r) continue;
    const root = r.el.shadowRoot || r.el;
    /* some elements hold several SVGs (an icon plus the part): take the biggest one */
    const svgs = [...root.querySelectorAll("svg")].filter(x => !x.closest("svg") || x.closest("svg") === x);
    let svg = null, best = -1;
    svgs.forEach(x => { const b2 = x.getBoundingClientRect(), area = b2.width * b2.height; if (area > best) { best = area; svg = x; } });
    if (!svg) continue;
    let styles = [...root.querySelectorAll("style")].map(s => s.textContent).join("\n");
    /* lit elements keep their CSS in adoptedStyleSheets, not in <style> tags */
    try { (root.adoptedStyleSheets || []).forEach(sh => { styles += "\n" + [...sh.cssRules].map(r => r.cssText).join("\n"); }); } catch (e) { }
    const clone = svg.cloneNode(true);
    clone.setAttribute("xmlns", "http://www.w3.org/2000/svg");
    clone.setAttribute("width", r.w || svg.clientWidth || 100);
    clone.setAttribute("height", r.h || svg.clientHeight || 100);
    if (styles) { const st = document.createElementNS("http://www.w3.org/2000/svg", "style"); st.textContent = styles; clone.insertBefore(st, clone.firstChild); }
    const src = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(new XMLSerializer().serializeToString(clone));
    const im = await load(src); if (!im) continue;
    g.save();
    g.translate(p.x + (r.w || 0) / 2, p.y + (r.h || 0) / 2);
    if (p.rot) g.rotate(p.rot * Math.PI / 180);
    g.drawImage(im, -(r.w || im.width) / 2, -(r.h || im.height) / 2, r.w || im.width, r.h || im.height);
    g.restore();
  }
  const wires = $("#wires").cloneNode(true);
  wires.setAttribute("xmlns", "http://www.w3.org/2000/svg");
  wires.setAttribute("width", W); wires.setAttribute("height", H);
  wires.setAttribute("viewBox", `${b.x0 - pad} ${b.y0 - pad} ${W} ${H}`);
  const wst = document.createElementNS("http://www.w3.org/2000/svg", "style");
  wst.textContent = `.wire{fill:none;stroke-width:3.4;stroke-linecap:round;stroke-linejoin:round}.wire-o{fill:none;stroke:rgba(15,29,54,.18);stroke-width:5.2;stroke-linecap:round;stroke-linejoin:round}.whit,.whandle,.ghost{display:none}.wend{stroke:rgba(0,0,0,.25);stroke-width:.6}`;
  wires.insertBefore(wst, wires.firstChild);
  const wim = await load("data:image/svg+xml;charset=utf-8," + encodeURIComponent(new XMLSerializer().serializeToString(wires)));
  if (wim) { g.save(); g.translate(b.x0 - pad, b.y0 - pad); g.drawImage(wim, 0, 0, W, H); g.restore(); }
  return cv;
}
export async function downloadPng() {
  C.toast("Drawing the picture…");
  try {
    const cv = await renderImage(2);
    cv.toBlob(bl => { if (!bl) return C.toast("Could not make the picture"); dl(bl, (C.project.name || "circuit").replace(/[^\w-]+/g, "_") + ".png"); C.toast("Picture saved"); }, "image/png");
  } catch (e) { console.error(e); C.toast("Could not make the picture"); }
}

/* ================= share link ================= */
const b64u = buf => btoa(String.fromCharCode(...new Uint8Array(buf))).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
const unb64u = s => { s = s.replace(/-/g, "+").replace(/_/g, "/"); const bin = atob(s); const a = new Uint8Array(bin.length); for (let i = 0; i < bin.length; i++) a[i] = bin.charCodeAt(i); return a; };
export async function makeLink() {
  const p = Object.assign({}, C.project); delete p.saved;
  const json = JSON.stringify(p);
  let data;
  if (typeof CompressionStream === "function") {
    const cs = new CompressionStream("deflate-raw");
    const stream = new Blob([json]).stream().pipeThrough(cs);
    data = "z" + b64u(await new Response(stream).arrayBuffer());
  } else data = "p" + b64u(new TextEncoder().encode(json));
  return location.origin + location.pathname + "#c=" + data;
}
export async function openLink(data) {
  try {
    const kind = data[0], raw = unb64u(data.slice(1));
    let json;
    if (kind === "z") {
      const ds = new DecompressionStream("deflate-raw");
      json = await new Response(new Blob([raw]).stream().pipeThrough(ds)).text();
    } else json = new TextDecoder().decode(raw);
    const p = JSON.parse(json); if (!p.parts) throw 0;
    return p;
  } catch (e) { return null; }
}

/* ================= export dialog ================= */
function showExport() {
  C.openModal(`<div class="mh"><h2>${C.ic("share")}Save or share</h2><button class="mx" data-close>${C.ic("x")}</button></div>
    <div class="mbody expgrid">
      <button class="newcard" data-exp="png"><span class="nb uno">${C.ic("image")}</span><b>Picture (PNG)</b><small>A sharp image of the circuit for a worksheet or a report.</small></button>
      <button class="newcard" data-exp="md"><span class="nb none">${C.ic("list")}</span><b>Parts list and wiring</b><small>Markdown you can paste into a lesson plan.</small></button>
      <button class="newcard" data-exp="csv"><span class="nb none">${C.ic("list")}</span><b>Parts list (CSV)</b><small>Opens in Excel, good for ordering kit.</small></button>
      <button class="newcard" data-exp="json"><span class="nb esp">${C.ic("save")}</span><b>Circuit file</b><small>A .json file students can open in Circuit Lab.</small></button>
      <button class="newcard" data-exp="link"><span class="nb esp">${C.ic("share")}</span><b>Share link</b><small>The whole circuit packed into a web address.</small></button>
      <button class="newcard" data-exp="ino"><span class="nb uno">${C.ic("code")}</span><b>Arduino sketch</b><small>A .ino file for the real Arduino IDE.</small></button>
    </div><div id="linkout" class="linkout"></div>`, "wide");
}
export async function handleExport(kind) {
  if (kind === "png") { C.closeModal(); return downloadPng(); }
  if (kind === "md" || kind === "csv") { C.closeModal(); return downloadBom(kind); }
  if (kind === "json") { C.closeModal(); return C.download(); }
  if (kind === "ino") { C.closeModal(); return C.downloadIno(); }
  if (kind === "link") {
    const url = await makeLink();
    const out = $("#linkout");
    if (out) {
      out.innerHTML = `<label>Share this link</label><div class="linkrow"><input id="sharelink" readonly value="${esc(url)}"><button class="btn primary" data-exp="copylink">Copy</button></div><p class="muted small">${url.length > 8000 ? "This circuit is big, so the link is long. Some chat apps cut long links: the circuit file is safer." : "Anyone who opens it gets this exact circuit and code."}</p>`;
      const i = $("#sharelink"); i.focus(); i.select();
    }
    return;
  }
  if (kind === "copylink") {
    const i = $("#sharelink"); if (!i) return;
    i.select(); try { await navigator.clipboard.writeText(i.value); C.toast("Link copied"); } catch (e) { document.execCommand("copy"); C.toast("Link copied"); }
  }
}
