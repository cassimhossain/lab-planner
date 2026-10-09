/* Robotics & AI Club Lab Planner
   Plain HTML + CSS + JavaScript. No build step, no server: works on GitHub Pages.
   Your plan is saved in this browser (localStorage). Use Settings to download / load a backup. */
(function () {
  "use strict";
  const D = window.CLUB_DATA;
  const KEY = "rac-lab-planner-v1";
  const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri"];
  const DAYFULL = { Mon: "Monday", Tue: "Tuesday", Wed: "Wednesday", Thu: "Thursday", Fri: "Friday", "": "No day" };
  const PAL = { LE: ["#1F9D74", "#E6F6F0"], JM: ["#2F6BDE", "#E8EFFD"], YI: ["#7B4DD6", "#F0EAFC"], TL: ["#E0524F", "#FDECEC"] };
  D.groups.forEach(g => { if (PAL[g.code]) { g.color = PAL[g.code][0]; g.light = PAL[g.code][1]; } });
  const GROUPS = Object.fromEntries(D.groups.map(g => [g.code, g]));
  const ACTS = D.activities;
  const BYCODE = Object.fromEntries(ACTS.map(a => [a.code, a]));
  const PHASES = ["Foundation", "Phase 1", "Phase 2"];
  const phaseOf = a => (a.phase === "Intro" ? "Foundation" : a.phase);

  /* ---------- icons (simple line drawings) ---------- */
  const P = {
    home: '<path d="M4 11l8-7 8 7v9a1 1 0 0 1-1 1h-5v-6h-4v6H5a1 1 0 0 1-1-1z"/>',
    week: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/>',
    print: '<path d="M7 9V3h10v6M6 18H4a1 1 0 0 1-1-1v-6a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v6a1 1 0 0 1-1 1h-2"/><rect x="7" y="14" width="10" height="7" rx="1"/>',
    box: '<path d="M3 7l9-4 9 4-9 4zM3 7v10l9 4 9-4V7M12 11v10"/>',
    gear: '<circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M19 5l-2 2M7 17l-2 2"/>',
    check: '<path d="M5 12l5 5 9-10"/>',
    x: '<path d="M6 6l12 12M18 6L6 18"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    minus: '<path d="M5 12h14"/>',
    search: '<circle cx="11" cy="11" r="7"/><path d="M20 20l-4-4"/>',
    cal: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4M8 14h3v3H8z"/>',
    users: '<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20a6.5 6.5 0 0 1 13 0M16 4.5a3.5 3.5 0 0 1 0 7M18 14a6 6 0 0 1 3.5 6"/>',
    parts: '<rect x="4" y="4" width="16" height="16" rx="3"/><path d="M9 4v-2M15 4v-2M9 22v-2M15 22v-2M4 9H2M4 15H2M22 9h-2M22 15h-2"/><rect x="9" y="9" width="6" height="6" rx="1"/>',
    trophy: '<path d="M8 4h8v5a4 4 0 0 1-8 0zM8 6H5a3 3 0 0 0 3 4M16 6h3a3 3 0 0 1-3 4M12 13v4M8 21h8M9 17h6"/>',
    arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
    // domain icons
    "Foundation": '<rect x="6" y="8" width="12" height="10" rx="3"/><circle cx="10" cy="13" r="1.3"/><circle cx="14" cy="13" r="1.3"/><path d="M12 8V4.5"/><circle cx="12" cy="3.5" r="1"/><path d="M6 13H3.5M18 13h2.5"/>',
    "Electronics & Circuits": '<path d="M3 12h4l2-5 3 10 2-5h7"/><circle cx="3" cy="12" r="1"/><circle cx="21" cy="12" r="1"/>',
    "Power & Energy": '<path d="M13 2L5 14h6l-1 8 8-12h-6z"/>',
    "Programming & Logic": '<path d="M8 7l-5 5 5 5M16 7l5 5-5 5M14 4l-4 16"/>',
    "Sensors & Environment": '<path d="M12 3a6 6 0 0 1 6 6c0 5-6 12-6 12S6 14 6 9a6 6 0 0 1 6-6z"/><circle cx="12" cy="9" r="2.2"/>',
    "Security & Safety": '<path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z"/><path d="M9 12l2 2 4-4"/>',
    "Robotics & Actuation": '<circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M19 5l-2 2M7 17l-2 2"/>',
    "Mechanical Design": '<path d="M14 7l3-3 3 3-3 3M17 4L7 14M4 20l3-6 3 3z"/>',
    "IoT & Communication": '<path d="M5 12a10 10 0 0 1 14 0M8.5 15.5a5 5 0 0 1 7 0M2 8.5a15 15 0 0 1 20 0"/><circle cx="12" cy="19" r="1.3"/>',
    "App, Web & Game Development": '<rect x="3" y="4" width="18" height="14" rx="2"/><path d="M8 21h8M12 18v3M7 9h4M7 12h7"/>',
    "AI & Data": '<path d="M9 4a3 3 0 0 0-3 3 3 3 0 0 0-2 5 3 3 0 0 0 2 5 3 3 0 0 0 6 1V5a2 2 0 0 0-3-1zM15 4a3 3 0 0 1 3 3 3 3 0 0 1 2 5 3 3 0 0 1-2 5 3 3 0 0 1-6 1"/>'
  };
  const ic = (n, cls = "") => `<svg class="ic ${cls}" viewBox="0 0 24 24" aria-hidden="true">${P[n] || P["Foundation"]}</svg>`;
  const DOODLE = `<svg class="doodle" viewBox="0 0 220 120" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
    <rect x="70" y="38" width="64" height="50" rx="12"/><circle cx="90" cy="62" r="5.5"/><circle cx="114" cy="62" r="5.5"/><path d="M93 78h18M102 38V22"/><circle cx="102" cy="17" r="4.5"/>
    <path d="M70 64H56M134 64h14M86 88v16M118 88v16"/><path d="M20 30l8 4M196 30l-8 4M14 80h10M196 80h10"/><path d="M160 20a10 10 0 1 1 0 .1M40 96l6-6 6 6-6 6z"/></g></svg>`;

  /* ---------- state ---------- */
  const blank = () => ({ v: 1, defaultGroups: 8, name: "Qasim Mushtaq", campus: "Pak-Turk Maarif International Schools & Colleges, Chak Shahzad Campus · Robotics Lab",
    weekStart: "", sessions: {}, kits: {}, catalog: {}, extra: [], saved: null });
  let S = load();
  function load() { try { const s = JSON.parse(localStorage.getItem(KEY) || "null"); if (s && s.v === 1) { const o = Object.assign(blank(), s); o.extra = Array.isArray(o.extra) ? o.extra : []; return o; } } catch (e) { } return blank(); }
  function save() { S.saved = new Date().toISOString(); try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) { toast("Could not save in this browser. Download a backup."); } }
  const EMPTY = { status: "Not started", day: "", time: "", section: "", groups: "", notes: "", date: "" };
  const sess = c => (S.sessions[c] = S.sessions[c] || Object.assign({}, EMPTY));
  const peek = c => S.sessions[c] || EMPTY;
  const groupsOf = c => { const g = parseInt(peek(c).groups, 10); return g > 0 ? g : S.defaultGroups; };
  /* borrowed activities: "JM-06@YI" = Junior Makers activity JM-06 taught to Young Innovators */
  const baseOf = id => String(id).split("@")[0];
  const virt = id => { const [c, g] = String(id).split("@"), b = BYCODE[c]; if (!b || !GROUPS[g] || g === b.group) return null; return Object.assign({}, b, { code: id, base: c, group: g, from: b.group }); };
  const getA = id => BYCODE[id] || virt(id);
  const idFor = (base, g) => (BYCODE[base].group === g ? base : base + "@" + g);
  const extras = () => (S.extra || []).map(virt).filter(Boolean);
  const ALL = () => ACTS.concat(extras());
  const lab = a => a.base || a.code;
  function borrow(base, g) { const id = idFor(base, g); if (id !== base) { S.extra = S.extra || []; if (!S.extra.includes(id)) S.extra.push(id); } return id; }
  const kitOf = c => S.kits[baseOf(c)] || BYCODE[baseOf(c)].kit;
  const catOf = n => S.catalog[n] || D.catalog[n] || { cat: "Other", spec: "", type: "Reusable" };
  const allParts = () => Object.assign({}, D.catalog, S.catalog);
  const isPlanned = c => peek(c).status === "Next week";
  const isDone = c => peek(c).status === "Done";

  /* ---------- helpers ---------- */
  const $ = s => document.querySelector(s);
  const esc = s => String(s == null ? "" : s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  function toast(msg) { const t = $("#toast"); t.innerHTML = msg; t.classList.add("show"); clearTimeout(toast.h); toast.h = setTimeout(() => t.classList.remove("show"), 2300); }
  const iso = d => d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
  function nextMonday() { const d = new Date(); d.setDate(d.getDate() + (((8 - d.getDay()) % 7) || 7)); return iso(d); }
  const addDays = (s, n) => { const d = new Date(s + "T00:00:00"); d.setDate(d.getDate() + n); return d; };
  const fmt = (d, o) => d.toLocaleDateString("en-GB", o);
  const dayDate = day => (S.weekStart && day ? fmt(addDays(S.weekStart, DAYS.indexOf(day)), { day: "numeric", month: "short" }) : "");
  const longDate = s => (s ? fmt(new Date(s + "T00:00:00"), { weekday: "long", day: "numeric", month: "long", year: "numeric" }) : "");
  const lineTotal = (k, c) => (k.b === "class" ? +k.q || 0 : (+k.q || 0) * groupsOf(c));
  const dayIdx = d => (d ? DAYS.indexOf(d) : 9);
  const catIdx = c => { const i = D.categories.indexOf(c); return i < 0 ? 99 : i; };
  const planned = () => { const all = ALL(); return all.filter(a => isPlanned(a.code)).sort((a, b) => dayIdx(peek(a.code).day) - dayIdx(peek(b.code).day) || all.indexOf(a) - all.indexOf(b)); };
  const fromTag = a => (a.from ? `<span class="ftag">from ${esc(GROUPS[a.from].name)}</span>` : "");
  /* swap: A's activity goes to B's age group and slot, B's activity goes to A's age group and slot */
  const SLOT = ["status", "day", "time", "section", "groups", "notes"];
  function swapSessions(idA, idB) {
    const A = getA(idA), B = getA(idB), sa = Object.assign({}, peek(idA)), sb = Object.assign({}, peek(idB));
    const nA = borrow(lab(A), B.group), nB = borrow(lab(B), A.group);
    [idA, idB].forEach(i => setStatus(i, "Not started"));
    SLOT.forEach(k => { sess(nA)[k] = sb[k]; sess(nB)[k] = sa[k]; });
    [idA, idB].forEach(dropIdle);
    return [nA, nB];
  }
  function dropIdle(id) { const a = getA(id); if (a && a.from && peek(id).status === "Not started") { delete S.sessions[id]; S.extra = (S.extra || []).filter(x => x !== id); } }
  function moveTo(id, g) {
    const s = Object.assign({}, peek(id)), n = borrow(lab(getA(id)), g);
    if (s.status === "Next week") { SLOT.forEach(k => { sess(n)[k] = s[k]; }); setStatus(id, "Not started"); }
    dropIdle(id);
    return n;
  }
  const plural = (n, w) => `${n} ${w}${n === 1 ? "" : "s"}`;
  function setStatus(c, st) {
    const s = sess(c); s.status = st;
    if (st === "Done") s.date = s.date || (s.day && S.weekStart ? iso(addDays(S.weekStart, DAYS.indexOf(s.day))) : iso(new Date())); else s.date = "";
    if (st === "Not started") s.day = "";
  }
  const partsCount = list => { const set = new Set(); list.forEach(a => kitOf(a.code).forEach(k => { if (k.n && lineTotal(k, a.code) > 0) set.add(k.n); })); return set.size; };
  const nextUp = (gc, n) => ACTS.filter(a => a.group === gc && peek(a.code).status === "Not started").slice(0, n);
  const coreOf = gc => ACTS.filter(a => a.group === gc && (a.phase === "Phase 1" || a.phase === "Phase 2"));

  /* ---------- routing / sidebar ---------- */
  const ROUTES = ["home", "LE", "JM", "YI", "TL", "week", "print", "kits", "settings"];
  const route = () => { const r = location.hash.slice(1); return ROUTES.includes(r) ? r : "home"; };
  function renderMenu() {
    const r = route(), nw = planned();
    const item = (k, label, icon, extra = "") => `<a href="#${k}" class="mi ${r === k ? "on" : ""}">${icon}<span>${label}</span>${extra}</a>`;
    const badge = n => (n ? `<em>${n}</em>` : "");
    $("#menu").innerHTML =
      item("home", "Home", ic("home")) +
      `<div class="mlabel">Age groups</div>` +
      D.groups.map(g => item(g.code, g.name, `<i class="gdot" style="background:${g.color}"></i>`, badge(nw.filter(a => a.group === g.code).length))).join("") +
      `<div class="mlabel">This week</div>` +
      item("week", "Timetable", ic("week"), badge(nw.length)) +
      item("print", "Print lists", ic("print")) +
      `<div class="mlabel">Setup</div>` +
      item("kits", "Kits & parts", ic("box")) +
      item("settings", "Settings", ic("gear"));
    const a = addDays(S.weekStart, 0), b = addDays(S.weekStart, 4);
    $("#wkLabel").textContent = `${fmt(a, { day: "numeric", month: "short" })} to ${fmt(b, { day: "numeric", month: "short" })}`;
    $("#mbWeek").textContent = fmt(a, { day: "numeric", month: "short" });
  }
  function render() {
    renderMenu();
    const r = route(), app = $("#app");
    app.innerHTML = r === "home" ? vHome() : GROUPS[r] ? vGroup(r) : r === "week" ? vWeek() : r === "print" ? vPrint() : r === "kits" ? vKits() : vSettings();
    document.body.dataset.route = r;
  }
  window.addEventListener("hashchange", () => { closeNav(); render(); window.scrollTo(0, 0); });
  const shiftWeek = n => { S.weekStart = iso(addDays(S.weekStart, 7 * n)); save(); render(); toast(`Week of ${fmt(addDays(S.weekStart, 0), { day: "numeric", month: "long" })}`); };
  $("#wkPrev").onclick = () => shiftWeek(-1);
  $("#wkNext").onclick = () => shiftWeek(1);
  const closeNav = () => document.body.classList.remove("navopen");
  $("#burger").onclick = () => document.body.classList.toggle("navopen");

  /* ---------- shared bits ---------- */
  function statusChip(c) {
    const s = peek(c);
    if (s.status === "Next week") return `<span class="chip amber">${ic("cal")}${s.day ? DAYFULL[s.day] : "Pick a day"}</span>`;
    if (s.status === "Done") return `<span class="chip green">${ic("check")}Done</span>`;
    if (s.status === "Postponed") return `<span class="chip red">Postponed</span>`;
    if (s.status === "Cancelled") return `<span class="chip grey">Cancelled</span>`;
    return `<span class="chip ghost">Not planned</span>`;
  }
  function actCard(a) {
    const g = GROUPS[a.group], s = peek(a.code);
    return `<button class="acard ${isPlanned(a.code) ? "is-planned" : ""} ${isDone(a.code) ? "is-done" : ""}" data-open="${esc(a.code)}" style="--c:${g.color};--l:${g.light}">
      <span class="acard-top"><span class="aicon">${ic(a.domain)}</span>${fromTag(a)}<span class="acode">${esc(lab(a))}</span></span>
      <span class="atitle">${esc(a.title)}</span>
      <span class="adom">${esc(a.domain)}${a.cls ? " · Class " + a.cls : ""}</span>
      <span class="afoot">${statusChip(a.code)}<span class="aplan">${isPlanned(a.code) || isDone(a.code) ? "Open" : "Plan"} ${ic("arrow")}</span></span>
    </button>`;
  }
  const head = (title, sub, right = "") => `<div class="phead"><div><h1>${title}</h1>${sub ? `<p>${sub}</p>` : ""}</div><div class="phead-r">${right}</div></div>`;
  const empty = (msg, cta = "") => `<div class="empty">${DOODLE}<p>${msg}</p>${cta}</div>`;

  /* ---------- HOME ---------- */
  function vHome() {
    const nw = planned(), pairs = nw.reduce((t, a) => t + groupsOf(a.code), 0);
    const hr = new Date().getHours(), hi = hr < 12 ? "Good morning" : hr < 17 ? "Good afternoon" : "Good evening";
    const strip = DAYS.map(d => {
      const items = nw.filter(a => peek(a.code).day === d);
      return `<div class="hday"><div class="hday-h"><b>${d}</b><span>${dayDate(d)}</span></div>
        ${items.map(a => `<button class="pchip" data-open="${esc(a.code)}" style="--c:${GROUPS[a.group].color};--l:${GROUPS[a.group].light}"><b>${esc(lab(a))}${a.from ? " → " + a.group : ""}</b>${esc(a.title)}</button>`).join("") || `<span class="hfree">Free</span>`}</div>`;
    }).join("");
    const groupsHTML = D.groups.map(g => {
      const core = coreOf(g.code), dn = core.filter(a => isDone(a.code)).length, up = nextUp(g.code, 2);
      return `<div class="gcard" style="--c:${g.color};--l:${g.light}">
        <a class="gcard-h" href="#${g.code}"><span class="gbig">${g.code}</span><span><b>${esc(g.name)}</b><small>Ages ${esc(g.ages)}</small></span>${ic("arrow", "go")}</a>
        <div class="gprog"><div class="bar"><i style="width:${Math.round(100 * dn / core.length)}%"></i></div><span>${dn}/${core.length} done</span></div>
        <div class="gnext">${up.map(a => `<button class="nrow" data-open="${esc(a.code)}"><span class="acode">${esc(a.code)}</span><span class="nt">${esc(a.title)}</span><span class="nplan">Plan</span></button>`).join("") || `<span class="muted">All planned or done</span>`}</div>
      </div>`;
    }).join("");
    return `<section class="hero">
        <div><span class="kicker">${hi}, ${esc((S.name || "").split(" ")[0] || "teacher")}</span><h1>Plan the week of ${fmt(addDays(S.weekStart, 0), { day: "numeric", month: "long" })}</h1>
        <p>Pick an age group, tap an activity, choose a day. The kit lists build themselves.</p>
        <div class="hero-btns"><a class="btn light" href="#week">${ic("week")}Timetable</a><a class="btn accent" href="#print">${ic("print")}Print kit lists</a></div></div>
        ${DOODLE}
      </section>
      <div class="stats">
        <div class="stat">${ic("cal")}<div><b>${nw.length}</b><span>sessions planned</span></div></div>
        <div class="stat">${ic("users")}<div><b>${pairs}</b><span>groups (about ${pairs * 2} students)</span></div></div>
        <div class="stat">${ic("parts")}<div><b>${partsCount(nw)}</b><span>different parts to pack</span></div></div>
      </div>
      <h2 class="sh">This week</h2>
      <div class="hweek">${strip}</div>
      <h2 class="sh">Age groups <small>next classes to plan</small></h2>
      <div class="ggrid">${groupsHTML}</div>`;
  }

  /* ---------- AGE GROUP ---------- */
  const UI = { phase: {}, q: {}, pMode: "session", pDay: "ALL", pBreak: true, kitCode: ACTS[0].code, kitGroup: "LE", kitQ: "", catOpen: false, catQ: "" };
  function vGroup(gc) {
    const g = GROUPS[gc], all = ACTS.filter(a => a.group === gc), core = coreOf(gc), borrowed = extras().filter(a => a.group === gc);
    const dn = core.filter(a => isDone(a.code)).length, nw = all.concat(borrowed).filter(a => isPlanned(a.code)).length;
    if (!UI.phase[gc]) UI.phase[gc] = PHASES.find(p => all.some(a => phaseOf(a) === p && peek(a.code).status === "Not started")) || "Phase 1";
    const ph = UI.phase[gc], q = (UI.q[gc] || "").toLowerCase();
    const list = all.filter(a => q ? (a.code + " " + a.title + " " + a.domain).toLowerCase().includes(q) : phaseOf(a) === ph);
    let body = "", lastU = "";
    list.forEach(a => { const u = phaseOf(a) + " · " + a.unit; if (u !== lastU) { if (lastU) body += `</div>`; body += `<h3 class="unit">${esc(a.unit)}</h3><div class="agrid">`; lastU = u; } body += actCard(a); });
    if (lastU) body += `</div>`;
    return `<section class="gban" style="--c:${g.color};--l:${g.light}">
        <div class="gban-l"><span class="gban-badge">${gc}</span><div><h1>${esc(g.name)}</h1><p>Ages ${esc(g.ages)} · ${all.length} activities</p></div></div>
        <div class="gban-s"><div><b>${dn}</b><span>of ${core.length} done</span></div><div><b>${nw}</b><span>planned</span></div></div>
        ${DOODLE}</section>
      <div class="gtools"><div class="tabs">${PHASES.map(p => `<button class="${!q && ph === p ? "on" : ""}" data-phase="${p}" data-g="${gc}">${p}<em>${all.filter(a => phaseOf(a) === p).length}</em></button>`).join("")}</div>
        <label class="search">${ic("search")}<input type="search" data-gq="${gc}" placeholder="Search ${esc(g.name)}" value="${esc(UI.q[gc] || "")}"></label>
        <button class="btn borrowbtn" data-pick="${gc}">${ic("plus")}Add from another group</button></div>
      ${borrowed.length ? `<h3 class="unit">From other age groups <small>shared kits, planned for ${esc(g.name)}</small></h3><div class="agrid">${borrowed.map(actCard).join("")}</div>` : ""}
      ${body || empty("Nothing matches your search.")}`;
  }

  /* ---------- SESSION MODAL ---------- */
  let modalCode = null;
  function openModal(code) { modalCode = code; UI.swapOpen = false; renderModal(); document.body.classList.add("modal-open"); }
  function closeModal() { modalCode = null; document.body.classList.remove("modal-open"); render(); }
  function renderPicker(gc) {
    const g = GROUPS[gc], others = D.groups.filter(x => x.code !== gc);
    if (!UI.pickG || UI.pickG === gc) UI.pickG = others[0].code;
    const q = (UI.pickQ || "").toLowerCase(), src = GROUPS[UI.pickG];
    const list = ACTS.filter(a => a.group === UI.pickG && (!q || (a.code + " " + a.title + " " + a.domain).toLowerCase().includes(q)));
    $("#modal").innerHTML = `<div class="sheet-m" style="--c:${g.color};--l:${g.light}">
      <div class="m-head"><span class="aicon big">${ic("plus")}</span><div class="m-tt"><span class="acode">Add to ${esc(g.name)}</span><h2>Borrow an activity</h2><p>Pick an activity from another age group. It keeps the same kit.</p></div><button class="m-x" data-close aria-label="Close">${ic("x")}</button></div>
      <div class="m-body">
        <div class="gpick three">${others.map(x => `<button class="${x.code === UI.pickG ? "on" : ""}" data-pickg="${x.code}" style="--c:${x.color};--l:${x.light}"><b>${x.code}</b>${esc(x.name)}</button>`).join("")}</div>
        <label class="search">${ic("search")}<input type="search" id="pickQ" placeholder="Search ${esc(src.name)}" value="${esc(UI.pickQ || "")}"></label>
        <div class="plist">${list.map(a => { const id = idFor(a.code, gc), have = (S.extra || []).includes(id);
          return `<button class="prow" data-borrow="${esc(a.code)}" data-to="${gc}" style="--c:${src.color};--l:${src.light}"><span class="acode">${esc(a.code)}</span><span class="nt">${esc(a.title)}<small>${esc(phaseOf(a))} · ${esc(a.unit)}</small></span><span class="nplan">${have ? "Open" : "Add"}</span></button>`; }).join("") || `<p class="muted">Nothing matches.</p>`}</div>
      </div></div>`;
  }
  function groupSection(a) {
    const s = peek(a.code), here = a.group;
    const others = planned().filter(b => b.group !== here && lab(b) !== lab(a));
    return `<div class="m-sec"><label>Age group</label>
      <div class="gpick">${D.groups.map(x => `<button class="${x.code === here ? "on" : ""}" ${x.code === here ? "disabled" : `data-moveto="${x.code}"`} style="--c:${x.color};--l:${x.light}"><b>${x.code}</b>${esc(x.name)}</button>`).join("")}</div>
      <small class="hint">${isPlanned(a.code) ? `Tap a group to move this session there (same day and time).` : `Tap a group to add this activity to that group's page.`}${a.from ? ` Original group: ${esc(GROUPS[a.from].name)}.` : ""}</small>
      <div class="m-links">${isPlanned(a.code) && others.length ? `<button class="linkbtn" data-swapopen>${ic("arrow")}Swap with another group's session</button>` : ""}
        ${a.from && !isDone(a.code) ? `<button class="linkbtn" data-unborrow>${ic("x")}Remove from ${esc(GROUPS[here].name)}</button>` : ""}</div>
      ${UI.swapOpen ? `<div class="plist">${others.map(b => `<button class="prow" data-swap="${esc(b.code)}" style="--c:${GROUPS[b.group].color};--l:${GROUPS[b.group].light}"><span class="acode">${esc(lab(b))}</span><span class="nt">${esc(b.title)}<small>${esc(GROUPS[b.group].name)} · ${DAYFULL[peek(b.code).day]}</small></span><span class="nplan">Swap</span></button>`).join("")}</div>` : ""}</div>`;
  }
  function renderModal() {
    if (String(modalCode).startsWith("pick:")) return renderPicker(modalCode.slice(5));
    const a = getA(modalCode), g = GROUPS[a.group], s = peek(a.code), kit = kitOf(a.code), gr = groupsOf(a.code);
    $("#modal").innerHTML = `<div class="sheet-m" style="--c:${g.color};--l:${g.light}">
      <div class="m-head"><span class="aicon big">${ic(a.domain)}</span><div class="m-tt"><span class="acode">${esc(lab(a))} · ${esc(g.name)}${a.from ? ` · borrowed from ${esc(GROUPS[a.from].name)}` : ""}</span><h2>${esc(a.title)}</h2><p>${esc(a.domain)}${a.cls ? " · Class " + a.cls : ""}</p></div><button class="m-x" data-close aria-label="Close">${ic("x")}</button></div>
      <div class="m-body">
        <div class="m-sec"><label>Which day next week?</label>
          <div class="daypick">${DAYS.map(d => `<button class="${isPlanned(a.code) && s.day === d ? "on" : ""}" data-mday="${d}"><b>${d}</b><span>${dayDate(d)}</span></button>`).join("")}</div>
          ${isPlanned(a.code) ? `<button class="linkbtn" data-unplan>${ic("x")}Remove from this week</button>` : ""}</div>
        ${groupSection(a)}
        <div class="m-row">
          <div class="m-sec"><label>Groups (pairs)</label><div class="stepper"><button data-step="-1">${ic("minus")}</button><b>${gr}</b><button data-step="1">${ic("plus")}</button></div><small>${gr * 2} students</small></div>
          <div class="m-sec"><label>Time <i>optional</i></label><input data-mf="time" value="${esc(s.time)}" placeholder="e.g. 2:30 pm"></div>
          <div class="m-sec"><label>Section <i>optional</i></label><input data-mf="section" value="${esc(s.section)}" placeholder="e.g. Grade 4 B"></div>
        </div>
        <div class="m-sec"><label>Kit for ${gr} groups <a href="#kits" data-editkit="${esc(lab(a))}">Edit kit</a></label>
          <div class="mkit">${kit.filter(k => k.n).map(k => `<div><span>${esc(k.n)}</span><b>${lineTotal(k, a.code)}</b></div>`).join("")}</div></div>
        <div class="m-sec"><label>Notes <i>optional</i></label><input data-mf="notes" value="${esc(s.notes)}" placeholder="Anything to remember"></div>
      </div>
      <div class="m-foot">
        <div class="m-status">${statusChip(a.code)}${s.status === "Done" && s.date ? `<small>on ${fmt(new Date(s.date + "T00:00:00"), { day: "numeric", month: "short" })}</small>` : ""}</div>
        <div class="m-acts">
          ${s.status === "Done" ? `<button class="btn" data-mstatus="Not started">Undo done</button>` : `<button class="btn" data-mstatus="Done">${ic("check")}Mark as done</button>`}
          <button class="btn primary" data-close>Save</button></div>
      </div></div>`;
  }

  /* ---------- WEEK ---------- */
  function vWeek() {
    const nw = planned(), noday = nw.filter(a => !peek(a.code).day);
    const cols = DAYS.map(d => {
      const items = nw.filter(a => peek(a.code).day === d);
      return `<div class="wcol"><div class="wcol-h"><div><b>${DAYFULL[d]}</b><span>${dayDate(d)}</span></div>${items.length ? `<span class="wcount">${plural(items.length, "session")}</span>` : ""}</div>
        <div class="wlist">${items.map(a => `<button class="wcard" data-open="${esc(a.code)}" style="--c:${GROUPS[a.group].color};--l:${GROUPS[a.group].light}"><span class="acode">${esc(lab(a))}</span>${fromTag(a)}<b>${esc(a.title)}</b><small>${esc(GROUPS[a.group].name)} · ${groupsOf(a.code)} groups${peek(a.code).time ? " · " + esc(peek(a.code).time) : ""}</small></button>`).join("") || `<div class="wfree">Free</div>`}</div>
        ${items.length ? `<a class="wprint" href="#print" data-printday="${d}">${ic("print")}Print ${d} kit</a>` : ""}</div>`;
    }).join("");
    return head("Timetable", nw.length ? `${plural(nw.length, "session")} planned. Tap a session to change it.` : "", nw.length ? `<button class="btn" data-act="doneweek">${ic("check")}Mark week done</button><a class="btn primary" href="#print">${ic("print")}Print lists</a>` : "") +
      (noday.length ? `<div class="warn">${noday.length} planned session${noday.length > 1 ? "s have" : " has"} no day: ${noday.map(a => `<button class="lk" data-open="${esc(a.code)}">${esc(lab(a))}</button>`).join(", ")}</div>` : "") +
      (nw.length ? `<div class="wgrid">${cols}</div>` : empty("Nothing planned for this week yet.", `<a class="btn primary" href="#home">Start planning</a>`));
  }

  /* ---------- PRINT ---------- */
  const MODES = [["session", "Per session", "One box per session, in the kit format", "box"], ["day", "Per day", "Everything for one day added together", "cal"], ["week", "Whole week", "One request for the whole week", "print"]];
  function vPrint() {
    const nw = planned();
    if (!nw.length) return head("Print lists", "") + empty("Plan some sessions first, then come back here to print.", `<a class="btn primary" href="#home">Start planning</a>`);
    const days = DAYS.filter(d => nw.some(a => peek(a.code).day === d)).concat(nw.some(a => !peek(a.code).day) ? [""] : []);
    if (UI.pDay !== "ALL" && !days.includes(UI.pDay)) UI.pDay = "ALL";
    return `<div class="noprint">${head("Print lists", "Choose a list, then print or save it as a PDF for the lab.")}
      <div class="modes">${MODES.map(([k, t, d, i]) => `<button class="mode ${UI.pMode === k ? "on" : ""}" data-pmode="${k}">${ic(i)}<b>${t}</b><span>${d}</span></button>`).join("")}</div>
      <div class="pbar">${UI.pMode !== "week" ? `<div class="tabs">${["ALL"].concat(days).map(d => `<button class="${UI.pDay === d ? "on" : ""}" data-pday="${d}">${d === "ALL" ? "All days" : d ? DAYFULL[d] : "No day"}</button>`).join("")}</div>
        <label class="tog"><input type="checkbox" id="pBreak" ${UI.pBreak ? "checked" : ""}><span></span>New page per day</label>` : "<span></span>"}
        <button class="btn primary big" data-act="print">${ic("print")}Print / Save PDF</button></div></div>
      <div id="printArea">${sheet(nw, days)}</div>`;
  }
  function sheetHead(t) {
    return `<div class="shead"><div><h2>${esc(t)}</h2><div class="s">${esc(S.campus)}</div><div><b>Week starting:</b> ${esc(longDate(S.weekStart))} &nbsp;·&nbsp; <b>Requested by:</b> ${esc(S.name)}</div></div>
      <div class="who"><div>Received by (lab):<span></span></div><div>Signature / date:<span></span></div></div></div>`;
  }
  const dayLabel = d => (d ? `${DAYFULL[d].toUpperCase()} · ${dayDate(d)}` : "NO DAY SET");
  function sheet(nw, days) {
    const show = UI.pDay === "ALL" ? days : [UI.pDay];
    let h = `<div class="paper">`;
    if (UI.pMode === "session") {
      h += sheetHead("Daily Kit Lists");
      const TH = `<thead><tr><th>Code</th><th>Category</th><th>Component</th><th class="c">Qty</th><th class="c">Basis</th><th class="c">Type</th><th>Notes</th><th class="c">Total</th><th class="c">Packed</th></tr></thead>`;
      show.forEach((d, i) => {
        h += `<div class="${UI.pBreak && i ? "pb" : ""}"><table class="kt">${TH}<tbody><tr class="kday"><td colspan="9">${dayLabel(d)}</td></tr>`;
        nw.filter(a => peek(a.code).day === d).forEach(a => {
          const g = GROUPS[a.group], s = peek(a.code);
          h += `<tr class="kact" style="--c:${g.color};--l:${g.light}"><td class="kc">${esc(lab(a))}</td><td>${esc(g.name)}${a.from ? " (from " + a.from + ")" : ""}</td><td>${esc(a.title)}</td><td colspan="3"></td><td>${[s.time, s.section].filter(Boolean).map(esc).join(" · ")}</td><td class="c">${groupsOf(a.code)} groups</td><td></td></tr>`;
          kitOf(a.code).forEach(k => { if (!k.n) return; const c = catOf(k.n);
            h += `<tr style="--c:${g.color}"><td class="kcode">${esc(lab(a))}</td><td>${esc(c.cat)}</td><td>${esc(k.n)}</td><td class="c">${esc(k.q)}</td><td class="c">${k.b === "class" ? "Per class" : "Per group"}</td><td class="c">${esc(c.type)}</td><td>${esc(k.note)}</td><td class="tot">${lineTotal(k, a.code)}</td><td class="box"></td></tr>`; });
          h += `<tr class="gap"><td colspan="9"></td></tr>`;
        });
        h += `</tbody></table></div>`;
      });
    } else if (UI.pMode === "day") {
      h += sheetHead("Hardware by Day");
      const TH = `<thead><tr><th>Category</th><th>Component</th><th class="c">Type</th><th class="c">Qty</th><th>Used in</th><th class="c">Packed</th><th class="c">Returned</th></tr></thead>`;
      show.forEach((d, i) => {
        const today = nw.filter(a => peek(a.code).day === d), agg = {};
        today.forEach(a => kitOf(a.code).forEach(k => { const t = lineTotal(k, a.code); if (!t || !k.n) return; const x = agg[k.n] = agg[k.n] || { q: 0, u: [] }; x.q += t; if (!x.u.includes(lab(a))) x.u.push(lab(a)); }));
        const rows = Object.keys(agg).sort((p, q) => catIdx(catOf(p).cat) - catIdx(catOf(q).cat) || p.localeCompare(q));
        h += `<div class="${UI.pBreak && i ? "pb" : ""}"><table class="kt">${TH}<tbody><tr class="kday"><td colspan="7">${dayLabel(d)} · ${today.map(a => esc(lab(a))).join(", ")}</td></tr>` +
          rows.map(n => `<tr><td>${esc(catOf(n).cat)}</td><td>${esc(n)}</td><td class="c">${esc(catOf(n).type)}</td><td class="tot">${agg[n].q}</td><td>${esc(agg[n].u.join(", "))}</td><td class="box"></td><td class="box"></td></tr>`).join("") + `</tbody></table></div>`;
      });
    } else {
      h += sheetHead("Hardware Request for the Week");
      h += `<table class="kt"><thead><tr><th>Day</th><th>Code</th><th>Activity</th><th>Age group</th><th class="c">Groups</th><th>Time</th><th>Section</th></tr></thead><tbody>` +
        nw.map(a => { const s = peek(a.code), g = GROUPS[a.group]; return `<tr style="--c:${g.color}"><td>${DAYFULL[s.day]} ${dayDate(s.day)}</td><td class="kcode">${esc(lab(a))}</td><td>${esc(a.title)}</td><td>${esc(g.name)}${a.from ? " (from " + a.from + ")" : ""}</td><td class="c">${groupsOf(a.code)}</td><td>${esc(s.time)}</td><td>${esc(s.section)}</td></tr>`; }).join("") + `</tbody></table>
        <p class="note">Reusable parts: the most needed on any one day. Consumables: the whole week's total.</p>`;
      const per = {};
      nw.forEach(a => { const d = peek(a.code).day || "X"; kitOf(a.code).forEach(k => { const t = lineTotal(k, a.code); if (!t || !k.n) return; const x = per[k.n] = per[k.n] || {}; x[d] = (x[d] || 0) + t; }); });
      const rows = Object.keys(per).sort((p, q) => catIdx(catOf(p).cat) - catIdx(catOf(q).cat) || p.localeCompare(q));
      h += `<table class="kt"><thead><tr><th class="c">#</th><th>Category</th><th>Component</th><th class="c">Type</th>${DAYS.map(d => `<th class="c">${d}</th>`).join("")}<th class="c">No day</th><th class="c">Issue</th><th class="c">Issued</th><th class="c">Returned</th></tr></thead><tbody>` +
        rows.map((n, i) => { const x = per[n], c = catOf(n), dv = DAYS.map(d => x[d] || 0), nd = x.X || 0, iss = c.type === "Consumable" ? dv.reduce((p, q) => p + q, 0) + nd : Math.max(...dv) + nd;
          return `<tr><td class="c">${i + 1}</td><td>${esc(c.cat)}</td><td>${esc(n)}</td><td class="c">${esc(c.type)}</td>${dv.map(v => `<td class="c">${v || ""}</td>`).join("")}<td class="c">${nd || ""}</td><td class="tot">${iss}</td><td class="box"></td><td class="box"></td></tr>`; }).join("") + `</tbody></table>`;
    }
    return h + `</div>`;
  }

  /* ---------- KITS ---------- */
  const catOpts = sel => D.categories.map(c => `<option ${c === sel ? "selected" : ""}>${esc(c)}</option>`).join("");
  function vKits() {
    const q = UI.kitQ.toLowerCase(), list = ACTS.filter(a => a.group === UI.kitGroup && (!q || (a.code + " " + a.title).toLowerCase().includes(q)));
    const a = BYCODE[UI.kitCode], g = GROUPS[a.group], kit = kitOf(a.code), parts = allParts();
    const left = `<div class="kside"><div class="tabs full">${D.groups.map(x => `<button class="${UI.kitGroup === x.code ? "on" : ""}" data-kg="${x.code}">${x.code}</button>`).join("")}</div>
      <label class="search">${ic("search")}<input type="search" id="kitQ" placeholder="Search activities" value="${esc(UI.kitQ)}"></label>
      <div class="klist">${list.map(x => `<button class="kitem ${x.code === UI.kitCode ? "on" : ""}" data-kcode="${esc(x.code)}" style="--c:${GROUPS[x.group].color};--l:${GROUPS[x.group].light}"><span class="acode">${esc(x.code)}</span><span class="kt2">${esc(x.title)}</span>${S.kits[x.code] ? `<i class="edot"></i>` : ""}</button>`).join("")}</div></div>`;
    const editor = `<div class="card" style="--c:${g.color};--l:${g.light}">
      <div class="khead"><span class="aicon">${ic(a.domain)}</span><div><span class="acode">${esc(a.code)}</span><h2>${esc(a.title)}</h2></div>${S.kits[a.code] ? `<span class="chip amber">Edited</span>` : ""}</div>
      <datalist id="partsList">${Object.keys(parts).sort().map(n => `<option value="${esc(n)}">`).join("")}</datalist>
      <div class="krows">${kit.map((k, i) => { const c = catOf(k.n), known = !!parts[k.n]; return `<div class="krow" data-i="${i}">
          <div class="kname"><input class="kn" list="partsList" data-k="n" value="${esc(k.n)}" placeholder="Part name"><span class="kmeta">${known ? esc(c.cat) + " · " + esc(c.type) : `<select data-k="cat">${catOpts(c.cat)}</select>`}</span></div>
          <div class="kq"><button data-kstep="-1" data-i="${i}">${ic("minus")}</button><b>${esc(k.q)}</b><button data-kstep="1" data-i="${i}">${ic("plus")}</button></div>
          <select data-k="b"><option value="group" ${k.b !== "class" ? "selected" : ""}>per group</option><option value="class" ${k.b === "class" ? "selected" : ""}>per class</option></select>
          <button class="kdel" data-del="${i}" aria-label="Remove">${ic("x")}</button></div>`; }).join("")}</div>
      <div class="kfoot"><button class="btn primary" data-act="addrow">${ic("plus")}Add part</button>${S.kits[a.code] ? `<button class="btn" data-act="resetkit">Reset to original</button>` : ""}<span class="muted">Quantities are per group of 2 students unless "per class".</span></div></div>`;
    const cat = `<div class="card"><div class="chead"><h2>Parts catalog <small>${Object.keys(parts).length} parts</small></h2><button class="btn" data-act="togglecat">${UI.catOpen ? "Hide" : "Show all"}</button></div>
      <div class="addpart"><input id="npName" placeholder="New part name"><select id="npCat">${catOpts("Other")}</select><select id="npType"><option>Reusable</option><option>Consumable</option></select><button class="btn primary" data-act="addpart">${ic("plus")}Add</button></div>
      ${UI.catOpen ? `<label class="search">${ic("search")}<input type="search" id="catQ" placeholder="Search parts" value="${esc(UI.catQ)}"></label>${catList(parts)}` : ""}</div>`;
    return head("Kits & parts", "Choose an activity, then change its parts. Everything saves automatically.") + `<div class="klayout">${left}<div>${editor}${cat}</div></div>`;
  }
  function catList(parts) {
    const q = UI.catQ.toLowerCase(), by = {};
    Object.keys(parts).filter(n => !q || (n + " " + parts[n].cat).toLowerCase().includes(q)).forEach(n => (by[parts[n].cat] = by[parts[n].cat] || []).push(n));
    return `<div class="catgrid">${Object.keys(by).sort((a, b) => catIdx(a) - catIdx(b)).map(c => `<h5>${esc(c)}</h5>` + by[c].sort().map(n => `<div><span>${esc(n)}</span><small>${esc(parts[n].type)}</small></div>`).join("")).join("")}</div>`;
  }
  const editableKit = () => (S.kits[UI.kitCode] = S.kits[UI.kitCode] || JSON.parse(JSON.stringify(BYCODE[UI.kitCode].kit)));

  /* ---------- SETTINGS ---------- */
  function vSettings() {
    return head("Settings", "Defaults for planning and printing, and backups of your plan.") + `<div class="setgrid">
      <div class="card"><h2>Defaults</h2>
        <label class="field">Groups (pairs) per session<div class="stepper"><button data-gstep="-1">${ic("minus")}</button><b>${S.defaultGroups}</b><button data-gstep="1">${ic("plus")}</button></div></label>
        <label class="field">Your name on printouts<input id="setName" value="${esc(S.name)}"></label>
        <label class="field">School line on printouts<input id="setCampus" value="${esc(S.campus)}"></label></div>
      <div class="card"><h2>Backup</h2>
        <p class="muted">Your plan is saved in <b>this browser only</b>. Download a backup every Friday, and load it on any other computer.</p>
        <div class="btnrow"><button class="btn primary" data-act="export">Download backup</button><label class="btn file">Load backup<input type="file" id="fileImport" accept=".json,application/json"></label><button class="btn" data-act="csv">Session log (Excel)</button></div>
        <p class="muted small">${S.saved ? "Last saved " + esc(new Date(S.saved).toLocaleString("en-GB")) : ""}</p>
        <button class="btn danger" data-act="reset">Reset everything</button></div></div>`;
  }
  function download(name, text, type) { const a = document.createElement("a"); a.href = URL.createObjectURL(new Blob([text], { type })); a.download = name; document.body.appendChild(a); a.click(); setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 500); }

  /* ---------- events ---------- */
  document.addEventListener("click", e => {
    const t = e.target.closest("button, a"); if (!t) { if (e.target.id === "scrim") { closeModal(); closeNav(); } return; }
    const d = t.dataset;
    if (d.open) { openModal(d.open); return; }
    if ("close" in d) { closeModal(); return; }
    if (d.mday) { const s = sess(modalCode); s.day = d.mday; setStatus(modalCode, "Next week"); save(); renderModal(); toast(`${esc(lab(getA(modalCode)))} planned for <b>${DAYFULL[d.mday]}</b>`); return; }
    if ("unplan" in d) { setStatus(modalCode, "Not started"); save(); renderModal(); return; }
    if (d.step) { const s = sess(modalCode); s.groups = Math.max(1, Math.min(40, groupsOf(modalCode) + +d.step)); save(); renderModal(); return; }
    if (d.mstatus) { setStatus(modalCode, d.mstatus); save(); renderModal(); return; }
    if (d.moveto) { const a = getA(modalCode), wasP = isPlanned(a.code), n = moveTo(modalCode, d.moveto); save(); modalCode = n; UI.swapOpen = false; renderModal(); render();
      toast(`${esc(lab(a))} ${wasP ? "moved" : "added"} to <b>${esc(GROUPS[d.moveto].name)}</b>`); return; }
    if ("swapopen" in d) { UI.swapOpen = !UI.swapOpen; renderModal(); return; }
    if (d.swap) { const A = getA(modalCode), B = getA(d.swap), r = swapSessions(modalCode, d.swap); save(); modalCode = r[0]; UI.swapOpen = false; renderModal(); render();
      toast(`Swapped: ${esc(lab(A))} → ${esc(GROUPS[B.group].name)}, ${esc(lab(B))} → ${esc(GROUPS[A.group].name)}`); return; }
    if ("unborrow" in d) { const a = getA(modalCode); delete S.sessions[a.code]; S.extra = (S.extra || []).filter(x => x !== a.code); save(); toast(`${esc(lab(a))} removed from ${esc(GROUPS[a.group].name)}`); closeModal(); return; }
    if (d.pick) { openModal("pick:" + d.pick); return; }
    if (d.pickg) { UI.pickG = d.pickg; UI.pickQ = ""; renderModal(); return; }
    if (d.borrow) { const n = borrow(d.borrow, d.to); save(); render(); openModal(n); return; }
    if (d.editkit) { UI.kitCode = d.editkit; UI.kitGroup = BYCODE[d.editkit].group; document.body.classList.remove("modal-open"); modalCode = null; return; }
    if (d.phase) { UI.phase[d.g] = d.phase; UI.q[d.g] = ""; render(); return; }
    if (d.printday) { UI.pDay = d.printday; UI.pMode = "session"; return; }
    if (d.pmode) { UI.pMode = d.pmode; render(); return; }
    if (d.pday != null) { UI.pDay = d.pday; render(); return; }
    if (d.kg) { UI.kitGroup = d.kg; UI.kitCode = ACTS.find(a => a.group === d.kg).code; render(); return; }
    if (d.kcode) { UI.kitCode = d.kcode; render(); return; }
    if (d.kstep) { const k = editableKit()[+d.i]; k.q = Math.max(0, (+k.q || 0) + +d.kstep); save(); render(); return; }
    if (d.del != null) { editableKit().splice(+d.del, 1); save(); render(); return; }
    if (d.gstep) { S.defaultGroups = Math.max(1, Math.min(40, S.defaultGroups + +d.gstep)); save(); render(); return; }
    switch (d.act) {
      case "print": window.print(); break;
      case "doneweek": { const nw = planned(); if (confirm(`Mark all ${nw.length} sessions as done?`)) { nw.forEach(a => setStatus(a.code, "Done")); save(); render(); toast("Week marked as done"); } break; }
      case "addrow": editableKit().push({ n: "", q: 1, b: "group", note: "" }); save(); render(); { const ins = document.querySelectorAll(".kn"); ins[ins.length - 1].focus(); } break;
      case "resetkit": if (confirm("Go back to the original kit?")) { delete S.kits[UI.kitCode]; save(); render(); } break;
      case "togglecat": UI.catOpen = !UI.catOpen; render(); break;
      case "addpart": { const n = $("#npName").value.trim(); if (!n) return toast("Type a part name first"); S.catalog[n] = { cat: $("#npCat").value, type: $("#npType").value, spec: "" }; save(); render(); toast("Part added"); break; }
      case "export": download(`lab-planner-backup-${iso(new Date())}.json`, JSON.stringify(S, null, 1), "application/json"); break;
      case "csv": { const rows = [["Code", "Age group", "Phase", "Class", "Activity", "Status", "Day", "Date done", "Groups", "Time", "Section", "Notes"]];
        ALL().forEach(a => { const s = peek(a.code); rows.push([lab(a) + (a.from ? " (from " + a.from + ")" : ""), GROUPS[a.group].name, phaseOf(a), a.cls || "", a.title, s.status, s.day, s.date, groupsOf(a.code), s.time, s.section, s.notes]); });
        download(`session-log-${iso(new Date())}.csv`, "﻿" + rows.map(r => r.map(v => `"${String(v).replace(/"/g, '""')}"`).join(",")).join("\n"), "text/csv"); break; }
      case "reset": if (confirm("Delete ALL plans and kit changes in this browser?")) { S = blank(); S.weekStart = nextMonday(); save(); render(); } break;
    }
  });
  document.addEventListener("change", e => {
    const t = e.target, d = t.dataset;
    if (d.mf) { sess(modalCode)[d.mf] = t.value.trim(); save(); return; }
    if (d.k) { const row = editableKit()[+t.closest(".krow").dataset.i], v = t.value.trim();
      if (d.k === "cat") S.catalog[row.n] = Object.assign({ cat: "Other", spec: "", type: "Reusable" }, catOf(row.n), { cat: v }); else row[d.k] = v;
      if (d.k === "n" && v && !allParts()[v]) S.catalog[v] = { cat: "Other", spec: "", type: "Reusable" };
      save(); render(); return; }
    if (t.id === "pBreak") { UI.pBreak = t.checked; render(); return; }
    if (t.id === "setName") { S.name = t.value.trim(); save(); return; }
    if (t.id === "setCampus") { S.campus = t.value.trim(); save(); return; }
    if (t.id === "fileImport") { const f = t.files[0]; if (!f) return; const r = new FileReader();
      r.onload = () => { try { const x = JSON.parse(r.result); if (x.v !== 1 || typeof x.sessions !== "object") throw 0; if (confirm("Replace the plan in this browser with this backup?")) { S = Object.assign(blank(), x); S.extra = Array.isArray(S.extra) ? S.extra : []; save(); render(); toast("Backup loaded"); } } catch (err) { toast("That file is not a planner backup"); } };
      r.readAsText(f); }
  });
  let qT;
  document.addEventListener("input", e => {
    const t = e.target, key = t.dataset.gq ? "gq" : t.id;
    if (key === "pickQ") { UI.pickQ = t.value; const pos = t.selectionStart; renderModal(); const n = $("#pickQ"); if (n) { n.focus(); try { n.setSelectionRange(pos, pos); } catch (er) { } } return; }
    if (!["gq", "kitQ", "catQ"].includes(key)) return;
    clearTimeout(qT); qT = setTimeout(() => {
      if (key === "gq") UI.q[t.dataset.gq] = t.value; else if (key === "kitQ") UI.kitQ = t.value; else UI.catQ = t.value;
      const pos = t.selectionStart; render(); const n = key === "gq" ? document.querySelector(`[data-gq="${t.dataset.gq}"]`) : document.getElementById(key);
      if (n) { n.focus(); try { n.setSelectionRange(pos, pos); } catch (er) { } }
    }, 200);
  });
  document.addEventListener("keydown", e => { if (e.key === "Escape" && modalCode) closeModal(); });
  window.addEventListener("beforeprint", () => { if (route() !== "print") { location.hash = "#print"; render(); } });

  if (!S.weekStart) { S.weekStart = nextMonday(); save(); }
  render();
})();
