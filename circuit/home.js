/* Circuit Lab - the dashboard you land on.

   Opening Circuit Lab used to drop a student straight onto an empty canvas,
   which is a blank page to stare at. This is the front door instead: what you
   were working on, one big way to start something new, and every ready-made
   circuit as a card you can open and run.

   The picture on each card is the real circuit, not an illustration: the same
   part artwork the canvas uses, laid out by the same layout code, with its
   wires. It is drawn only when the card is about to come into view, so the
   page opens instantly however many circuits there are. */

let C = null;                       // context handed over by app.js
const $ = s => document.querySelector(s);
const esc = s => String(s ?? "").replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

let hq = "", hgroup = "All";
let io = null;                      // one observer for every preview on the page

export function initHome(ctx) {
  C = ctx;
  const box = $("#home"); if (!box) return;   /* a page without the dashboard still works */
  box.addEventListener("click", onClick);
  box.addEventListener("input", e => { if (e.target.id === "hq") { hq = e.target.value.trim().toLowerCase(); renderBody(); } });
  render();
}

export function showHome() {
  if (!$("#home") || !C) return;
  document.body.classList.add("athome");
  render();
  window.scrollTo(0, 0);
  const w = $("#home"); if (w) w.scrollTop = 0;
}
export function hideHome() { document.body.classList.remove("athome"); }
export function isHome() { return document.body.classList.contains("athome"); }

/* ---------- what goes on the cards ---------- */
const boardName = b => b === "esp32" ? "ESP32" : b === "nano" ? "Arduino Nano" : b === "mega" ? "Mega 2560" : b === null ? "No board" : "Arduino Uno";

function lessonList() {
  const out = [];
  Object.entries(C.LESSONS).forEach(([k, s]) => out.push({ key: k, code: s.lesson || k, group: k.split("-")[0], title: s.title, goal: s.goal || s.about || "", board: s.board, parts: (s.parts || []).length, spec: s }));
  C.STARTERS.forEach(s => out.push({ key: s.key, code: s.cat || "Starter", group: "EX", title: s.title, goal: s.goal || "", board: s.board, parts: (s.parts || []).length, spec: s }));
  return out;
}
const matches = it => !hq || (it.key + " " + it.code + " " + it.title + " " + it.goal + " " + (it.spec.parts || []).map(p => p.t).join(" ")).toLowerCase().includes(hq);

/* ---------- drawing ---------- */
function render() {
  const box = $("#home"); if (!box) return;
  const d = C.draft();
  box.innerHTML = `
    <div class="hwrap">
      <header class="hhead">
        <div class="htitle">
          <span class="hmark">${C.chip()}</span>
          <div><h1>Circuit Lab</h1><p>Wire it up, write the code, press Start. ${Object.keys(C.LESSONS).length + C.STARTERS.length} ready-made circuits, ${Object.keys(C.PARTS).length} parts, 4 boards.</p></div>
        </div>
        <label class="hsearch">${C.ic("search")}<input id="hq" placeholder="Search circuits, lessons or parts" value="${esc(hq)}" autocomplete="off"></label>
      </header>

      <div class="htop">
        <button class="hnew" data-hnew="uno">
          <span class="hplus">${C.ic("plus")}</span>
          <span class="hnewt"><b>Create a new circuit</b><small>Start from an empty canvas and build your own</small></span>
          <span class="hboards">${["uno", "nano", "mega", "esp32", "none"].map(b => `<em data-hnew="${b}">${esc(b === "none" ? "No board" : boardName(b === "none" ? null : b))}</em>`).join("")}</span>
        </button>
        ${d ? `<button class="hcont" data-hcont="1">
          <span class="hcl">${C.ic("play")}Continue</span>
          <b>${esc(d.name || "My circuit")}</b>
          <small>${d.parts} part${d.parts === 1 ? "" : "s"}${d.board ? " · " + esc(boardName(d.board)) : ""}</small>
          <span class="hprev" data-draft="1"></span>
        </button>` : `<button class="hcont empty" data-hnew="uno"><span class="hcl">${C.ic("chip")}Nothing in progress</span><b>Your circuits appear here</b><small>Anything you build is kept in this browser, even after you close the tab.</small></button>`}
      </div>

      <nav class="hchips" id="hchips">${["All", ...Object.keys(C.GROUPS).filter(g => g !== "F"), "EX", "MINE"].map(g => {
        const label = g === "All" ? "Everything" : g === "EX" ? "Starters" : g === "MINE" ? "My circuits" : g + " · " + C.GROUPS[g].name;
        const col = C.GROUPS[g] ? C.GROUPS[g].color : g === "EX" ? "#0891B2" : "#475569";
        return `<button class="${g === hgroup ? "on" : ""}" data-hg="${g}" style="--c:${col}">${esc(label)}</button>`;
      }).join("")}</nav>

      <div id="hbody"></div>
    </div>`;
  renderBody();
}

function renderBody() {
  const body = $("#hbody"); if (!body) return;
  if (io) { io.disconnect(); io = null; }

  if (hgroup === "MINE" && !hq) { body.innerHTML = mineSection(); wireObserver(); return; }

  const all = lessonList().filter(matches).filter(it => hgroup === "All" || hgroup === "MINE" || it.group === hgroup);
  if (!all.length) { body.innerHTML = `<p class="hempty">Nothing matches “${esc(hq)}”. Try a part name such as servo, OLED or motor.</p>`; return; }

  const order = [...Object.keys(C.GROUPS).filter(g => g !== "F"), "F", "EX"];
  let out = "";
  if (hq) out = `<section class="hsec"><h2>${all.length} circuit${all.length === 1 ? "" : "s"} matching “${esc(hq)}”</h2><div class="hgrid">${all.map(card).join("")}</div></section>`;
  else order.forEach(g => {
    const list = all.filter(it => it.group === g); if (!list.length) return;
    const meta = C.GROUPS[g] || { name: "Starter circuits", color: "#0891B2" };
    out += `<section class="hsec" style="--c:${meta.color}">
      <h2><span class="hdot"></span>${esc(g === "EX" ? "Starter circuits" : g + " · " + meta.name)}<em>${list.length}</em></h2>
      <div class="hgrid">${list.map(card).join("")}</div></section>`;
  });
  if (hgroup === "All" && !hq) out += mineSection();
  body.innerHTML = out;
  wireObserver();
}

function mineSection() {
  const all = C.listProjects(), names = Object.keys(all).sort((a, b) => (all[b].saved || "").localeCompare(all[a].saved || ""));
  if (!names.length) return `<section class="hsec" style="--c:#475569"><h2><span class="hdot"></span>My circuits</h2><p class="hempty small">Nothing saved yet. Build something and press Save, and it will wait for you here.</p></section>`;
  return `<section class="hsec" style="--c:#475569"><h2><span class="hdot"></span>My circuits<em>${names.length}</em></h2>
    <div class="hgrid">${names.map(n => {
      const p = all[n];
      return `<button class="hcard mine" data-openp="${esc(n)}" style="--c:#475569">
        <span class="hprev" data-saved="${esc(n)}"></span>
        <span class="hinfo"><span class="hcode">Saved</span><b>${esc(n)}</b>
        <small>${p.saved ? "kept " + new Date(p.saved).toLocaleDateString() : ""}</small>
        <span class="hmeta"><em>${esc(boardName((p.parts.find(q => C.BOARDS[q.type]) || {}).type))}</em><span>${p.parts.length} parts</span></span></span></button>`;
    }).join("")}</div></section>`;
}

function card(it) {
  return `<button class="hcard" data-lesson="${esc(it.key)}" style="--c:${(C.GROUPS[it.group] || {}).color || "#0891B2"}">
    <span class="hprev" data-spec="${esc(it.key)}"></span>
    <span class="hinfo">
      <span class="hcode">${esc(it.code)}</span>
      <b>${esc(it.title)}</b>
      <small>${esc(it.goal)}</small>
      <span class="hmeta"><em class="${it.board === "esp32" ? "esp" : it.board === null ? "nob" : ""}">${esc(boardName(it.board))}</em>${it.parts ? `<span>${it.parts} part${it.parts === 1 ? "" : "s"}</span>` : ""}</span>
    </span></button>`;
}

/* ---------- the live miniature on each card ----------
   Only cards about to be seen are drawn, and each is drawn once. */
function wireObserver() {
  const boxes = [...document.querySelectorAll("#home .hprev")];
  if (!boxes.length) return;
  io = new IntersectionObserver((entries, obs) => {
    entries.forEach(en => {
      if (!en.isIntersecting) return;
      obs.unobserve(en.target);
      drawPreview(en.target);
    });
  }, { root: $("#home"), rootMargin: "320px 0px" });
  boxes.forEach(b => io.observe(b));
}

let queue = Promise.resolve();      // one at a time: the layout step is synchronous and not free
function drawPreview(box) {
  if (box.dataset.done) return;
  box.dataset.done = "1";
  queue = queue.then(() => build(box)).catch(() => { box.classList.add("flat"); });
}

async function build(box) {
  let parts, wires;
  if (box.dataset.saved) {
    const p = C.listProjects()[box.dataset.saved]; if (!p) return;
    parts = p.parts; wires = p.wires || [];
  } else if (box.dataset.draft) {
    const p = C.draftProject(); if (!p) return;
    parts = p.parts; wires = p.wires || [];
  } else {
    const key = box.dataset.spec;
    const spec = C.LESSONS[key] || C.STARTERS.find(s => s.key === key); if (!spec) return;
    const out = await C.buildFromSpec(spec);
    parts = out.parts; wires = out.wires || [];
  }
  if (!parts || !parts.length) { box.classList.add("flat"); return; }

  const stage = document.createElement("div"); stage.className = "hstage";
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg"); svg.setAttribute("class", "hwires");
  stage.appendChild(svg);
  const made = [];
  parts.forEach(p => {
    const d = C.PARTS[p.type]; if (!d || d.kind === "deco") return;
    const el = document.createElement(d.tag);
    const attrs = Object.assign({}, d.attrs || {}, p.attrs || {});
    Object.entries(attrs).forEach(([k, v]) => { if (v != null && v !== false) el.setAttribute(k, v); });
    const w = document.createElement("div");
    w.className = "hpart"; w.style.left = p.x + "px"; w.style.top = p.y + "px";
    if (p.rot) w.style.transform = `rotate(${p.rot}deg)`;
    w.appendChild(el); stage.appendChild(w);
    made.push({ p, el, w });
  });
  if (!made.length) { box.classList.add("flat"); return; }
  box.appendChild(stage);
  await Promise.all(made.map(m => m.el.updateComplete || Promise.resolve()));
  await new Promise(r => requestAnimationFrame(r));

  /* the bounding box of what was actually drawn */
  let x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9;
  made.forEach(m => {
    const r = m.el.getBoundingClientRect();
    m.w1 = r.width || 40; m.h1 = r.height || 40;
    const rot = ((m.p.rot || 0) % 180) !== 0;
    const vw = rot ? m.h1 : m.w1, vh = rot ? m.w1 : m.h1;
    const cx = m.p.x + m.w1 / 2, cy = m.p.y + m.h1 / 2;
    x0 = Math.min(x0, cx - vw / 2); y0 = Math.min(y0, cy - vh / 2);
    x1 = Math.max(x1, cx + vw / 2); y1 = Math.max(y1, cy + vh / 2);
  });

  /* wires, from the real pin positions on the real elements */
  const pos = {};
  made.forEach(m => {
    const info = m.el.pinInfo || []; const cx = m.w1 / 2, cy = m.h1 / 2;
    const a = (m.p.rot || 0) * Math.PI / 180, ca = Math.cos(a), sa = Math.sin(a);
    info.forEach(q => {
      const dx = q.x - cx, dy = q.y - cy;
      pos[m.p.id + ":" + q.name] = { x: m.p.x + cx + dx * ca - dy * sa, y: m.p.y + cy + dx * sa + dy * ca };
    });
  });
  let d = "";
  (wires || []).forEach(w => {
    const a = pos[w.from], b = pos[w.to]; if (!a || !b) return;
    const pts = [a, ...((w.pts || []).map(([x, y]) => ({ x, y }))), b];
    if (pts.length === 2 && Math.abs(a.x - b.x) > 1 && Math.abs(a.y - b.y) > 1) pts.splice(1, 0, { x: b.x, y: a.y });
    d += `<path d="M${pts.map(q => q.x.toFixed(1) + " " + q.y.toFixed(1)).join("L")}" stroke="${esc(w.color || "#2E9E5B")}"/>`;
  });
  svg.innerHTML = d;
  svg.setAttribute("viewBox", `0 0 ${Math.max(1, x1)} ${Math.max(1, y1)}`);
  svg.setAttribute("width", Math.max(1, x1)); svg.setAttribute("height", Math.max(1, y1));

  /* scale the whole thing to sit inside the card */
  const pad = 10, bw = Math.max(1, x1 - x0), bh = Math.max(1, y1 - y0);
  const r = box.getBoundingClientRect();
  const s = Math.min((r.width - pad * 2) / bw, (r.height - pad * 2) / bh, 0.62);
  stage.style.transform = `translate(${(r.width - bw * s) / 2 - x0 * s}px, ${(r.height - bh * s) / 2 - y0 * s}px) scale(${s})`;
  box.classList.add("ready");
}

/* ---------- clicks ---------- */
function onClick(e) {
  const t = e.target.closest("[data-hnew], [data-lesson], [data-openp], [data-hcont], [data-hg]");
  if (!t) return;
  if (t.dataset.hg != null) { hgroup = t.dataset.hg; [...document.querySelectorAll("#hchips button")].forEach(b => b.classList.toggle("on", b === t)); renderBody(); return; }
  if (t.dataset.hcont) { hideHome(); C.resume(); return; }
  if (t.dataset.hnew) { hideHome(); C.newCircuit(t.dataset.hnew === "none" ? null : t.dataset.hnew); return; }
  if (t.dataset.lesson) { hideHome(); C.openLesson(t.dataset.lesson); return; }
  if (t.dataset.openp) { hideHome(); C.openSaved(t.dataset.openp); return; }
}
