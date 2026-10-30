/* Robotics & AI Club Lab Planner
   Plain HTML + CSS + JavaScript. No build step, no server: works on GitHub Pages.
   Your plan is saved in this browser (localStorage). Use Settings to download / load a backup.

   One file on purpose: every part shares the same few variables (the plan S,
   the progress PR, the UI state), and splitting it into modules would change
   the order things load in. Search for a heading below to jump to it.

   Contents (each starts with a line like  ---------- NAME ----------)
     icons                 the line-drawing icon set
     state                 the plan (rac-lab-planner-v1): load, save, sessions, borrowing
     student progress      rac-progress-v1, levels and lesson length
     helpers               escaping, dates, totals
     routing / sidebar     #pages, filters after "?", the menu
     shared bits           status chips, activity cards, page headings
     HOME / STUDENT HOME   teacher dashboard and the student's home
     COMMAND PALETTE       Ctrl K search
     AGE GROUP             track pages, roadmap and filters
     SESSION MODAL         the lesson sheet and "Plan this session"
     SCHEDULER, WEEK       adding sessions, the timetable
     PRINT, HARDWARE LIST  kit lists and one activity's printable list
     KITS, CURRICULUM, HARDWARE, VIRTUAL LABS   the remaining pages
     the robot             loaders
     PDF VIEWER            slides, documents and video
     COPY, TIPS, STUDY BUDDY, NOT FOUND, SETTINGS
     events                every click, change, input and key, in one place */
(function () {
  "use strict";
  const D = window.CLUB_DATA;
  const KEY = "rac-lab-planner-v1";
  const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri"];
  const DAYFULL = { Mon: "Monday", Tue: "Tuesday", Wed: "Wednesday", Thu: "Thursday", Fri: "Friday", "": "No day" };
  /* track colours are CSS tokens (tokens.css), so they follow light and dark mode */
  const PAL = { LE: ["var(--tr-le)", "var(--tr-le-tint)"], JM: ["var(--tr-jm)", "var(--tr-jm-tint)"], YI: ["var(--tr-yi)", "var(--tr-yi-tint)"], TL: ["var(--tr-tl)", "var(--tr-tl-tint)"] };
  D.groups.forEach(g => { if (PAL[g.code]) { g.color = PAL[g.code][0]; g.light = PAL[g.code][1]; } });
  const GROUPS = Object.fromEntries(D.groups.map(g => [g.code, g]));
  const ACTS = D.activities;
  const BYCODE = Object.fromEntries(ACTS.map(a => [a.code, a]));
  const PHASES = ["Foundation", "Phase 1", "Phase 2"];
  /* presentations and documents (library.js, generated from the Robotics Curriculum folder) */
  const LIB = window.LIBRARY || { decks: [], docs: [] };
  const DECK = Object.fromEntries(LIB.decks.map(d => [d.code, d]));
  const VIDS = window.VIDEOS || {};
  const vidOf = id => { const c = String(id).split("@")[0].split(" ")[0]; return (VIDS[c] || [])[0] || null; };
  const LGROUPS = [{ code: "F", name: "Foundation", ages: "All age groups", color: "var(--tr-f)", light: "var(--tr-f-tint)" }].concat(D.groups);
  const LG = Object.fromEntries(LGROUPS.map(g => [g.code, g]));
  const deckOf = id => DECK[String(id).split("@")[0].split(" ")[0]] || null;
  const deckTitle = d => { const a = BYCODE[d.code] || BYCODE[d.code + " (LE)"]; return a ? a.title : d.title; };
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
    loop: '<path d="M17 2l3 3-3 3"/><path d="M4 11V9a4 4 0 0 1 4-4h12"/><path d="M7 22l-3-3 3-3"/><path d="M20 13v2a4 4 0 0 1-4 4H4"/>',
    search: '<circle cx="11" cy="11" r="7"/><path d="M20 20l-4-4"/>',
    cal: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4M8 14h3v3H8z"/>',
    users: '<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20a6.5 6.5 0 0 1 13 0M16 4.5a3.5 3.5 0 0 1 0 7M18 14a6 6 0 0 1 3.5 6"/>',
    parts: '<rect x="4" y="4" width="16" height="16" rx="3"/><path d="M9 4v-2M15 4v-2M9 22v-2M15 22v-2M4 9H2M4 15H2M22 9h-2M22 15h-2"/><rect x="9" y="9" width="6" height="6" rx="1"/>',
    trophy: '<path d="M8 4h8v5a4 4 0 0 1-8 0zM8 6H5a3 3 0 0 0 3 4M16 6h3a3 3 0 0 1-3 4M12 13v4M8 21h8M9 17h6"/>',
    arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
    play: '<path d="M8 5l11 7-11 7z"/>',
    book: '<path d="M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2zM4 21V5M8 7h7"/>',
    file: '<path d="M14 3H6a1 1 0 0 0-1 1v16a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V8zM14 3v5h5M8 13h8M8 17h6"/>',
    sheet: '<rect x="4" y="3" width="16" height="18" rx="2"/><path d="M4 9h16M4 15h16M10 3v18"/>',
    expand: '<path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/>',
    down: '<path d="M12 4v11M7 10l5 5 5-5M5 20h14"/>',
    ext: '<path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5"/>',
    left: '<path d="M15 5l-7 7 7 7"/>',
    right: '<path d="M9 5l7 7-7 7"/>',
    flask: '<path d="M9 3h6M10 3v6L4.5 18.5A1.7 1.7 0 0 0 6 21h12a1.7 1.7 0 0 0 1.5-2.5L14 9V3"/><path d="M7.5 15h9"/>',
    code: '<path d="M8 8l-4 4 4 4M16 8l4 4-4 4M14 5l-4 14"/>',
    chip: '<rect x="6" y="6" width="12" height="12" rx="2"/><path d="M9 2v4M15 2v4M9 18v4M15 18v4M2 9h4M2 15h4M18 9h4M18 15h4"/><circle cx="12" cy="12" r="2"/>',
    bolt: '<path d="M13 2L5 14h6l-1 8 8-12h-6z"/>',
    cube: '<path d="M12 2l9 5v10l-9 5-9-5V7z"/><path d="M3 7l9 5 9-5M12 12v10"/>',
    wifi0: '<path d="M2 8.5a15 15 0 0 1 20 0M5 12a10 10 0 0 1 14 0M8.5 15.5a5 5 0 0 1 7 0"/><circle cx="12" cy="19" r="1"/>',
    map: '<path d="M9 4L3 6v14l6-2 6 2 6-2V4l-6 2z"/><path d="M9 4v14M15 6v14"/>',
    grid: '<rect x="4" y="4" width="7" height="7" rx="1.5"/><rect x="13" y="4" width="7" height="7" rx="1.5"/><rect x="4" y="13" width="7" height="7" rx="1.5"/><rect x="13" y="13" width="7" height="7" rx="1.5"/>',
    bulb: '<path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.2 1 2V16h5v-.1c0-.8.4-1.5 1-2A6 6 0 0 0 12 3z"/>',
    copy: '<rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V5a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h3"/>',
    flag: '<path d="M5 21V4M5 4h11l-2 4 2 4H5"/>',
    list: '<path d="M9 6h11M9 12h11M9 18h11"/><circle cx="4.5" cy="6" r="1"/><circle cx="4.5" cy="12" r="1"/><circle cx="4.5" cy="18" r="1"/>',
    help: '<circle cx="12" cy="12" r="9"/><path d="M9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.6.3-1 .9-1 1.6v.6M12 17h.01"/>',
    target: '<circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="4"/><circle cx="12" cy="12" r=".8"/>',
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
    weekStart: "", sessions: {}, kits: {}, catalog: {}, extra: [], lastBackup: "", saved: null });
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
  /* WEEKLY PLANNING: switched off for now. The club isn't planning weeks in
     the portal, and with no shared database everything would only live in
     one browser anyway. With this false, the timetable, "this week", planning
     buttons and taught/planned counts are hidden; the planner's code, its
     saved data (rac-lab-planner-v1), backups and the #week / #print pages are
     untouched. Set it to true to bring it all back. */
  const WEEK = false;
  const isPlanned = c => peek(c).status === "Next week";
  const isDone = c => peek(c).status === "Done";

  /* ---------- student progress (rac-progress-v1) ----------
     Kept apart from the planner on purpose: the planner key above is the
     teacher's timetable and its backups, and nothing here reads or writes it.
     This key holds what happens on this device - the student/teacher view,
     the student's track, lessons they have finished, the lesson they last
     opened, the slide each deck was left on, recent searches, and which
     first-visit tips were closed. */
  const PKEY = "rac-progress-v1";
  const PR = (() => { const b = { v: 1, role: "", track: "", done: {}, last: "", slide: {}, recent: [], hints: {} };
    try { const x = JSON.parse(localStorage.getItem(PKEY) || "null"); if (x && x.v === 1) return Object.assign(b, x); } catch (e) { } return b; })();
  function savePr() { try { localStorage.setItem(PKEY, JSON.stringify(PR)); } catch (e) { } }
  /* nobody has chosen yet: a browser with planned sessions belongs to a teacher */
  const isStudent = () => (PR.role || (Object.keys(S.sessions).length ? "teacher" : "student")) === "student";
  const finished = c => !!PR.done[baseOf(c)];
  const doneFor = c => (isStudent() ? finished(c) : WEEK && isDone(c));
  /* true wherever the planner's buttons and counts should not appear */
  const noPlan = () => isStudent() || !WEEK;
  /* level and length are read from data the curriculum already has: the phase
     says how far along an activity is, the slide count how long the lesson runs */
  const LEVEL = { Foundation: "Starter", "Phase 1": "Core", "Phase 2": "Advanced" };
  const levelOf = a => LEVEL[phaseOf(a)] || "Core";
  const lengthOf = a => { const d = deckOf(a.code); return !d ? "" : d.pages < 16 ? "Short" : d.pages <= 30 ? "Medium" : "Long"; };
  const lvlChips = a => `<span class="lvl lvl-${levelOf(a).toLowerCase()}">${levelOf(a)}</span>${lengthOf(a) ? `<span class="len">${lengthOf(a)} lesson</span>` : ""}`;

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
  const ROUTES = ["home", "curriculum", "hardware", "LE", "JM", "YI", "TL", "week", "sims", "print", "kits", "settings", "attendance"];
  /* a page can carry filters after a "?", e.g. #JM?topic=AI%20%26%20Data&view=map */
  const route = () => { const r = location.hash.slice(1).split("?")[0]; return /^kit=/.test(r) ? "kitsheet" : ROUTES.includes(r) ? r : r && !/^open=/.test(r) ? "notfound" : "home"; };
  const qp = () => new URLSearchParams(location.hash.split("?")[1] || "");
  function setQp(k, v) {
    const p = qp(); if (v) p.set(k, v); else p.delete(k);
    const str = p.toString(); history.replaceState(null, "", "#" + route() + (str ? "?" + str : "")); render();
  }
  const kitSheetCode = () => decodeURIComponent((location.hash.match(/^#kit=(.+)$/) || [, ""])[1]);
  function renderMenu() {
    const r = route(), nw = planned();
    const item = (k, label, icon, extra = "") => `<a href="#${k}" class="mi ${r === k ? "on" : ""}">${icon}<span>${label}</span>${extra}</a>`;
    const badge = n => (n ? `<em>${n}</em>` : "");
    $("#menu").innerHTML =
      item("home", "Overview", ic("home")) +
      `<div class="mlabel">Curriculum</div>` +
      item("curriculum", "Lesson library", ic("book"), `<em class="soft">${LIB.decks.length}</em>`) +
      D.groups.map(g => item(g.code, g.name, `<i class="gdot" style="background:${g.color}"></i>`, WEEK ? badge(nw.filter(a => a.group === g.code).length) : "")).join("") +
      (isStudent() ? "" : `<div class="mlabel">Teaching</div>` + item("attendance", "Attendance", ic("users")) + (WEEK ? item("week", "Timetable", ic("week"), badge(nw.length)) : "")) +
      `<div class="mlabel">Virtual labs</div>` +
      item("sims", "Simulators", ic("flask"), `<em class="soft">${SIM.list.length}</em>`) +
      `<a href="circuit/" class="mi">${ic("chip")}<span>Circuit Lab</span></a>` +
      `<a href="codelab/" class="mi">${ic("code")}<span>Code Lab</span><em class="soft new">New</em></a>` +
      `<div class="mlabel">Lab &amp; kit</div>` +
      item("hardware", "Hardware", ic("parts")) +
      (isStudent() ? "" : (WEEK ? item("print", "Print kit lists", ic("print")) : "") + item("kits", "Edit kits & parts", ic("box"))) +
      `<div class="mlabel">Setup</div>` +
      item("settings", "Settings & backup", ic("gear"));
    const a = addDays(S.weekStart, 0), b = addDays(S.weekStart, 4);
    if ($("#wkLabel")) $("#wkLabel").textContent = `${fmt(a, { day: "numeric", month: "short" })} to ${fmt(b, { day: "numeric", month: "short" })}`;
  }
  /* A tab switch is synchronous, so a loading overlay could never paint during it.
     What the eye reads as "it responded" is a short transition on the new page. */
  function pageSwap() {
    const a = $("#app"); if (!a) return;
    a.classList.remove("swap"); void a.offsetWidth; a.classList.add("swap");
  }
  function render() {
    renderMenu();
    const r = route(), app = $("#app");
    app.innerHTML = r === "notfound" ? vNotFound() : r === "attendance" ? vAttendance() : r === "kitsheet" ? vKitSheet(kitSheetCode()) : r === "home" ? vHome() : r === "curriculum" ? vCurriculum() : r === "hardware" ? vHardware() : GROUPS[r] ? vGroup(r) : r === "week" ? vWeek() : r === "sims" ? vSims() : r === "print" ? vPrint() : r === "kits" ? vKits() : vSettings();
    document.body.dataset.route = r;
    if (r !== "notfound" && r !== "kitsheet") app.insertAdjacentHTML("afterbegin", hintCard(r));
    /* Circuit Lab reads this to bring the student back where they were */
    try { localStorage.setItem("labplanner.lastRoute", location.hash.slice(1) || "home"); } catch (e) { }
    if (r === "kitsheet") drawKitPics();
  }
  /* index.html#open=CODE (from Circuit Lab) opens that lesson's details */
  function openFromHash() {
    const m = location.hash.match(/^#open=(.+)$/); if (!m) return false;
    const c = decodeURIComponent(m[1]), a = ACTS.find(x => lab(x) === c) || ACTS.find(x => String(x.code).startsWith(c + " "));
    history.replaceState(null, "", location.pathname + location.search + "#" + (a ? a.group : "home"));
    render(); if (a) openModal(a.code); return true;
  }
  /* a new address is a new page: nothing from the last one stays on top of it */
  window.addEventListener("hashchange", () => { closeNav(); if (CMD.open) closePalette(); if (modalCode) { modalCode = null; document.body.classList.remove("modal-open"); } if (openFromHash()) return; render(); pageSwap(); window.scrollTo(0, 0); });
  const shiftWeek = n => { S.weekStart = iso(addDays(S.weekStart, 7 * n)); save(); render(); toast(`Week of ${fmt(addDays(S.weekStart, 0), { day: "numeric", month: "long" })}`); };
  /* the week navigator was removed from the top bar: this portal is a lesson
     library, not a timetable manager. The Timetable page still works on its own. */
  if ($("#wkPrev")) $("#wkPrev").onclick = () => shiftWeek(-1);
  if ($("#wkNext")) $("#wkNext").onclick = () => shiftWeek(1);
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
    const dk = deckOf(a.code);
    const ban = dk && dk.banner ? `<span class="abanner"><img loading="lazy" src="${esc(dk.banner)}" alt=""></span>` : `<span class="abanner none"><span class="aicon">${ic(a.domain)}</span></span>`;
    const stu = isStudent(), foot = stu ? (finished(a.code) ? `<span class="chip green">${ic("check")}Finished</span>` : `<span class="chip ghost">Not started</span>`) : WEEK ? statusChip(a.code) : `<span></span>`;
    return `<button class="acard has-ban ${!stu && isPlanned(a.code) ? "is-planned" : ""} ${doneFor(a.code) ? "is-done" : ""}" data-open="${esc(a.code)}" style="--c:${g.color};--l:${g.light}">
      ${ban}<span class="acard-top"><span class="adomain">${esc(a.domain)}</span>${fromTag(a)}<span class="acode">${deckOf(a.code) ? `<i class="sbadge" title="Has slides">${ic("play")}</i>` : ""}${esc(lab(a))}</span></span>
      <span class="atitle">${esc(a.title)}</span>
      <span class="adom">${[a.cls ? "Class " + a.cls : "", dk ? dk.pages + " slides" : "", vidOf(a.code) ? "video" : ""].filter(Boolean).join(" · ") || "No slides yet"}</span>
      <span class="achips">${lvlChips(a)}</span>
      <span class="afoot">${foot}<span class="aplan">${noPlan() || isPlanned(a.code) || isDone(a.code) ? "Open" : "Plan"} ${ic("arrow")}</span></span>
    </button>`;
  }
  const head = (title, sub, right = "") => `<div class="phead"><div><h1>${title}</h1>${sub ? `<p>${sub}</p>` : ""}</div><div class="phead-r">${right}</div></div>`;
  const empty = (msg, cta = "") => `<div class="empty">${DOODLE}<p>${msg}</p>${cta}</div>`;

  /* ---------- HOME (dashboard) ---------- */
  function weekIssue(nw) {
    const per = {};
    nw.forEach(a => { const d = peek(a.code).day || "X"; kitOf(a.code).forEach(k => { const t = lineTotal(k, a.code); if (!t || !k.n) return; const x = per[k.n] = per[k.n] || {}; x[d] = (x[d] || 0) + t; }); });
    return Object.keys(per).map(n => { const x = per[n], c = catOf(n), dv = DAYS.map(d => x[d] || 0), nd = x.X || 0;
      return { n, cat: c.cat, type: c.type, q: c.type === "Consumable" ? dv.reduce((p, q) => p + q, 0) + nd : Math.max(...dv) + nd }; });
  }
  function todayDay() { if (!S.weekStart) return ""; const diff = Math.round((new Date(iso(new Date()) + "T00:00:00") - new Date(S.weekStart + "T00:00:00")) / 864e5); return diff >= 0 && diff < 5 ? DAYS[diff] : ""; }
  function ring(pct, color, size = 64) {
    const r = 26, c = 2 * Math.PI * r;
    return `<svg class="ring" viewBox="0 0 64 64" width="${size}" height="${size}" aria-hidden="true"><circle cx="32" cy="32" r="${r}" fill="none" stroke="var(--line2)" stroke-width="7"/>
      ${pct > 0 ? "" : "<!--"}<circle cx="32" cy="32" r="${r}" fill="none" stroke="${color}" stroke-width="7" stroke-linecap="round" stroke-dasharray="${(c * pct / 100).toFixed(1)} ${c.toFixed(1)}" transform="rotate(-90 32 32)"/>${pct > 0 ? "" : "-->"}
      <text x="32" y="37" text-anchor="middle" font-size="15" font-weight="800" fill="currentColor">${pct}%</text></svg>`;
  }
  /* the Student / Teacher switch on the home page */
  const roleSwitch = () => { const st = isStudent();
    return `<div class="rolesw" role="group" aria-label="Show the home page for"><button class="${st ? "on" : ""}" data-role="student" aria-pressed="${st}">Student</button><button class="${st ? "" : "on"}" data-role="teacher" aria-pressed="${!st}">Teacher</button></div>`; };

  /* ---------- STUDENT HOME ----------
     What a student needs at a glance: the next lesson, the one they left half
     way, and how far along their track they are. Nothing here touches the
     teacher's plan. */
  function lessonCard(a, label) {
    const g = GROUPS[a.group], dk = deckOf(a.code), sp = dk ? PR.slide[dk.code] || 0 : 0, vv = vidOf(a.code);
    return `<div class="lcard" style="--c:${g.color};--l:${g.light}">
      <button class="lcard-art" data-open="${esc(a.code)}" aria-label="Open ${esc(a.title)}">${dk && dk.banner ? `<img src="${esc(dk.banner)}" alt="">` : `<span class="aicon big">${ic(a.domain)}</span>`}</button>
      <div class="lcard-b"><span class="lcard-k">${label}</span><span class="acode">${esc(lab(a))} · ${esc(a.unit)}</span><h3>${esc(a.title)}</h3>${a.about ? `<p>${esc(a.about)}</p>` : ""}
        <div class="achips">${lvlChips(a)}</div>
        <div class="un-btns"><button class="btn primary" data-open="${esc(a.code)}">${ic("arrow")}Open lesson</button>${dk ? `<button class="btn" data-view="${esc(dk.code)}">${ic("play")}${sp > 1 ? "Slides from " + sp : "Slides"}</button>` : ""}${vv ? `<button class="btn" data-video="${esc(lab(a))}">${ic("play")}Video</button>` : ""}</div></div></div>`;
  }
  function vStudentHome() {
    const now = new Date(), day = fmt(now, { weekday: "long", day: "numeric", month: "long" });
    if (!PR.track || !GROUPS[PR.track]) {
      return `<section class="welcome portal"><div class="wl-txt"><span class="kicker">${day}</span><h1>Welcome to the club!</h1>
          <p>Which group are you in? Pick it once and this page keeps your place.</p></div><div class="wl-btns">${roleSwitch()}</div>${DOODLE}</section>
        <div class="trackpick">${D.groups.map(g => `<button class="tpick" data-track="${g.code}" style="--c:${g.color};--l:${g.light}"><span class="pbadge">${g.code}</span><span class="pt"><b>${esc(g.name)}</b><small>Ages ${esc(g.ages)} · ${ACTS.filter(a => a.group === g.code).length} lessons</small></span>${ic("arrow")}</button>`).join("")}</div>`;
    }
    const g = GROUPS[PR.track], list = ACTS.filter(a => a.group === g.code), n = list.filter(a => finished(a.code)).length, pct = Math.round(100 * n / list.length);
    const next = list.find(a => !finished(a.code)), la = PR.last ? getA(PR.last) : null;
    const cont = la && !finished(la.code) && (!next || lab(la) !== lab(next)) ? la : null;
    const phases = PHASES.map(ph => { const xs = list.filter(a => phaseOf(a) === ph); if (!xs.length) return ""; const d = xs.filter(a => finished(a.code)).length;
      return `<div class="pbarrow"><span>${ph}<small>${LEVEL[ph]}</small></span><span class="bar"><i style="width:${100 * d / xs.length}%"></i></span><b>${d}/${xs.length}</b></div>`; }).join("");
    const sec = (icon, title, sub, link, body, tone = "") => `<section class="sec ${tone}"><div class="sec-h"><span class="sec-ic">${ic(icon)}</span><div><h2>${title}</h2>${sub ? `<p>${sub}</p>` : ""}</div>${link || ""}</div>${body}</section>`;
    return `<section class="welcome portal"><div class="wl-txt"><span class="kicker">${day}</span><h1>Hi, ${esc(g.name)}!</h1>
        <p>${n ? `${plural(n, "lesson")} finished, ${list.length - n} to go.` : "Your first lesson is ready when you are."}</p></div>
        <div class="wl-btns">${roleSwitch()}<button class="btn" data-track="">Change group</button></div>${DOODLE}</section>
      <div class="sgrid" style="--c:${g.color};--l:${g.light}">
        <div class="sgrid-main">${cont ? lessonCard(cont, "Continue where you left off") : ""}${next ? lessonCard(next, cont ? "Then, next up" : "Next up") : `<div class="panel pdone">${ic("trophy")}You have finished every ${esc(g.name)} lesson. Amazing work!</div>`}</div>
        <div class="panel sprog"><div class="panel-h"><h2>Your progress</h2><a href="#${g.code}?view=map">Roadmap ${ic("arrow")}</a></div>
          <div class="sprog-top">${ring(pct, g.color, 84)}<div><b>${n} of ${list.length}</b><small>lessons finished</small></div></div>${phases}
          <p class="muted small">Saved on this device only. Tick “I've finished this lesson” inside a lesson to count it.</p></div>
      </div>
      ${sec("map", "Your path", "The next lessons in order. Finished ones get a tick.", `<a class="sec-link" href="#${g.code}?view=map">See the whole path ${ic("arrow")}</a>`, pathStrip(list), "t-cur")}
      ${sec("flask", "Practise on screen", "Build circuits and write code before you touch the real parts.", `<a class="sec-link" href="#sims">All simulators ${ic("arrow")}</a>`, simTiles(), "t-sim")}`;
  }

  function vHome() {
    if (isStudent()) return vStudentHome();
    const nw = planned(), pairs = nw.reduce((t, a) => t + groupsOf(a.code), 0), today = todayDay();
    const now = new Date(), hr = now.getHours(), hi = hr < 12 ? "Good morning" : hr < 17 ? "Good afternoon" : "Good evening";
    const core = D.groups.flatMap(g => coreOf(g.code)), doneAll = core.filter(a => isDone(a.code)).length, pctAll = Math.round(100 * doneAll / core.length);
    const issue = weekIssue(nw), items = issue.reduce((t, r) => t + r.q, 0);
    const byDay = DAYS.map(d => nw.filter(a => peek(a.code).day === d).length), maxD = Math.max(1, ...byDay);
    const next = (today ? nw.find(a => peek(a.code).day && dayIdx(peek(a.code).day) >= dayIdx(today)) : null) || nw[0];
    const ws = fmt(addDays(S.weekStart, 0), { day: "numeric", month: "long" });

    const kpi = (icon, val, label, sub, href, extra = "", tone = "") => `<a class="kpi ${tone}" href="${href}"><div class="kpi-top"><span class="kpi-ic">${ic(icon)}</span>${extra}</div><b>${val}</b><span class="kpi-l">${label}</span><small>${sub}</small></a>`;
    const bars = `<span class="mini">${byDay.map((n, i) => `<i style="height:${8 + 26 * n / maxD}px" class="${n ? "" : "z"}" title="${DAYS[i]}: ${n}"></i>`).join("")}</span>`;
    const kpis = kpi("cal", nw.length, "Sessions this week", nw.length ? DAYS.map((d, i) => byDay[i] ? `${d} ${byDay[i]}` : "").filter(Boolean).join(" · ") : "Nothing planned yet", "#week", bars, "t-amber") +
      kpi("users", pairs * 2, "Students", `${pairs} groups of 2`, "#week", "", "t-blue") +
      kpi("parts", issue.length, "Parts to pack", `${items} items in total`, "#hardware", "", "t-green") +
      kpi("trophy", doneAll, "Activities done", `of ${core.length} in Phase 1 and 2`, "#curriculum", ring(pctAll, "var(--navy)", 46), "t-navy");

    let upnext;
    if (next) {
      const g = GROUPS[next.group], s = peek(next.code), dk = deckOf(next.code);
      upnext = `<div class="panel upnext" style="--c:${g.color};--l:${g.light}">
        <div class="panel-h"><h2>${today && s.day === today ? "Today" : "Up next"}</h2><a href="#week">Timetable ${ic("arrow")}</a></div>
        <div class="un-body">
          ${dk ? `<button class="un-thumb" data-view="${esc(dk.code)}" aria-label="Open presentation"><img src="${esc(dk.thumb)}" alt=""><span class="dplay">${ic("play")}</span></button>` : `<div class="un-thumb none"><span class="aicon big">${ic(next.domain)}</span><small>No slides yet</small></div>`}
          <div class="un-info"><span class="acode">${esc(lab(next))}</span>${fromTag(next)}<h3>${esc(next.title)}</h3>
            <div class="facts"><span class="fact on">${ic("cal")}${s.day ? DAYFULL[s.day] + " " + dayDate(s.day) : "No day yet"}${s.time ? " · " + esc(s.time) : ""}</span><span class="fact grp"><i class="gdot" style="background:${g.color}"></i>${esc(g.name)}</span><span class="fact">${ic("users")}${groupsOf(next.code)} groups</span></div>
            <div class="un-btns">${dk ? `<button class="btn primary" data-view="${esc(dk.code)}">${ic("play")}Present</button>` : ""}${vidOf(next.code) ? `<button class="btn" data-video="${esc(lab(next))}">${ic("play")}Video</button>` : ""}<button class="btn" data-open="${esc(next.code)}">Details & kit</button>${s.day ? `<a class="btn ghost" href="#print" data-printday="${s.day}">${ic("print")}Print ${s.day} kit</a>` : ""}</div></div>
        </div></div>`;
    } else {
      upnext = `<div class="panel upnext empty-panel"><div class="panel-h"><h2>Up next</h2></div>${empty(`Nothing planned for the week of ${ws} yet.`, `<button class="btn primary" data-palette="plan">${ic("plus")}Plan a session</button>`)}</div>`;
    }

    /* the hardware that session's day needs, so a teacher can pack from here */
    let dayPack = "";
    if (next) {
      const dd = peek(next.code).day, its = dd ? nw.filter(a => peek(a.code).day === dd) : [next], rows = weekIssue(its).sort((x, y) => catIdx(x.cat) - catIdx(y.cat) || x.n.localeCompare(y.n));
      dayPack = `<div class="panel daypack"><div class="panel-h"><h2>Hardware for ${dd ? DAYFULL[dd] : "this session"}</h2>${dd ? `<a href="#print" data-printday="${dd}">Print ${ic("arrow")}</a>` : ""}</div>
        ${rows.length ? `<div class="pack">${rows.slice(0, 9).map(r => `<div><span>${esc(r.n)}<small>${esc(r.cat)}</small></span><b>${r.q}</b></div>`).join("")}</div>${rows.length > 9 ? `<a class="more" href="#print" data-printday="${dd}">+ ${rows.length - 9} more parts</a>` : ""}` : `<p class="muted pad">No parts listed for this session.</p>`}
        <button class="linkbtn navy" data-copyday="${dd || ""}" data-copycode="${esc(next.code)}">${ic("copy")}Copy list</button></div>`;
    }

    const board = `<div class="panel"><div class="panel-h"><h2>This week</h2><span class="muted">${ws}</span></div><div class="board">${DAYS.map(d => {
      const its = nw.filter(a => peek(a.code).day === d);
      return `<div class="bday ${today === d ? "today" : ""}"><div class="bday-h"><b>${d}</b><span>${dayDate(d)}</span>${today === d ? `<em>Today</em>` : ""}</div>
        ${its.map(a => { const g = GROUPS[a.group]; return `<button class="bitem" data-open="${esc(a.code)}" style="--c:${g.color};--l:${g.light}"><span>${esc(lab(a))}${deckOf(a.code) ? ic("play") : ""}</span><b>${esc(a.title)}</b><small>${esc(g.name)}${peek(a.code).time ? " · " + esc(peek(a.code).time) : ""}</small></button>`; }).join("")}
        <button class="badd" data-sched="${d}" aria-label="Add a session on ${DAYFULL[d]}">${ic("plus")}</button></div>`; }).join("")}</div></div>`;

    const groupsHTML = `<div class="panel"><div class="panel-h"><h2>Age groups</h2><a href="#curriculum">Curriculum ${ic("arrow")}</a></div><div class="gcards">${D.groups.map(g => {
      const c = coreOf(g.code), dn = c.filter(a => isDone(a.code)).length, pl = nw.filter(a => a.group === g.code).length, up = nextUp(g.code, 2);
      return `<div class="gc" style="--c:${g.color};--l:${g.light}"><a class="gc-h" href="#${g.code}">${ring(Math.round(100 * dn / c.length), g.color, 54)}<span><b>${esc(g.name)}</b><small>Ages ${esc(g.ages)} · ${dn}/${c.length} done${pl ? ` · <em>${pl} this week</em>` : ""}</small></span>${ic("arrow", "go")}</a>
        <div class="gc-next">${up.map(a => `<button class="nrow" data-open="${esc(a.code)}"><span class="acode">${esc(a.code)}</span><span class="nt">${esc(a.title)}</span><span class="nplan">Plan</span></button>`).join("") || `<span class="muted">All planned or done</span>`}</div></div>`; }).join("")}</div></div>`;

    const top = issue.slice().sort((x, y) => y.q - x.q).slice(0, 8);
    const pack = `<div class="panel"><div class="panel-h"><h2>Pack list</h2><a href="#print">Print ${ic("arrow")}</a></div>
      ${top.length ? `<div class="pack">${top.map(r => `<div><span>${esc(r.n)}<small>${esc(r.cat)}</small></span><b>${r.q}</b></div>`).join("")}</div>
        ${issue.length > top.length ? `<a class="more" href="#print" data-pmode="week">+ ${issue.length - top.length} more parts</a>` : ""}` : `<p class="muted pad">Plan a session and its parts appear here.</p>`}</div>`;

    const att = [];
    const noday = nw.filter(a => !peek(a.code).day);
    if (noday.length) att.push(["warn", `${plural(noday.length, "session")} without a day`, noday.map(a => lab(a)).join(", "), `<button class="lk" data-open="${esc(noday[0].code)}">Fix</button>`]);
    const noslides = nw.filter(a => !deckOf(a.code));
    if (noslides.length) att.push(["info", `No slides yet for ${plural(noslides.length, "session")}`, noslides.map(a => lab(a)).join(", "), `<a class="lk" href="#curriculum">View</a>`]);
    const bk = S.lastBackup ? Math.floor((now - new Date(S.lastBackup)) / 864e5) : -1;
    if (bk < 0 || bk > 7) att.push(["warn", bk < 0 ? "No backup downloaded yet" : `Last backup ${bk} days ago`, "Your plan lives in this browser only.", `<button class="lk" data-act="export">Download</button>`]);
    if (!nw.length && [4, 5, 6].includes(now.getDay())) att.push(["info", "Plan next week", "Friday is kit-request day.", `<button class="lk" data-palette="plan">Plan</button>`]);
    const attention = `<div class="panel"><div class="panel-h"><h2>Needs attention</h2>${att.length ? `<em class="count">${att.length}</em>` : ""}</div>
      ${att.length ? `<div class="att">${att.map(([t, h, d, act]) => `<div class="att-i ${t}"><span class="att-dot"></span><div><b>${h}</b><small>${esc(d)}</small></div>${act}</div>`).join("")}</div>` : `<div class="allgood">${ic("check")}<span>All good. Nothing needs you right now.</span></div>`}</div>`;

    const recent = ALL().filter(a => isDone(a.code)).sort((x, y) => (peek(y.code).date || "").localeCompare(peek(x.code).date || "")).slice(0, 5);
    const done = `<div class="panel"><div class="panel-h"><h2>Recently done</h2><a href="#settings">Log ${ic("arrow")}</a></div>
      ${recent.length ? `<div class="recent">${recent.map(a => `<button data-open="${esc(a.code)}" style="--c:${GROUPS[a.group].color}"><i></i><span><b>${esc(lab(a))}</b> ${esc(a.title)}</span><small>${peek(a.code).date ? fmt(new Date(peek(a.code).date + "T00:00:00"), { day: "numeric", month: "short" }) : ""}</small></button>`).join("")}</div>` : `<p class="muted pad">Mark sessions as done and they show up here.</p>`}</div>`;

    const quick = `<div class="panel quick"><div class="panel-h"><h2>Shortcuts</h2></div><div class="qgrid">
      <a href="#curriculum">${ic("book")}<span>Presentations</span></a><a href="#curriculum" data-libg="DOCS">${ic("file")}<span>Parent docs</span></a>
      <a href="#hardware">${ic("parts")}<span>Hardware</span></a><a href="#print">${ic("print")}<span>Print lists</span></a></div></div>`;

    const sec = (icon, title, sub, link, body, tone = "") => `<section class="sec ${tone}"><div class="sec-h"><span class="sec-ic">${ic(icon)}</span><div><h2>${title}</h2>${sub ? `<p>${sub}</p>` : ""}</div>${link || ""}</div>${body}</section>`;
    const pathCards = D.groups.map(g => {
      const c = coreOf(g.code), dn = c.filter(a => isDone(a.code)).length, pct = Math.round(100 * dn / c.length), up = c.find(a => peek(a.code).status === "Not started");
      const all = ALL().filter(a => a.group === g.code), withDeck = all.filter(a => deckOf(a.code)).length;
      const dk = up ? deckOf(up.code) : null;
      return `<div class="pcard" style="--c:${g.color};--l:${g.light}">
        <a class="pcard-h" href="#${g.code}"><span class="pbadge">${g.code}</span><span class="pt"><b>${esc(g.name)}</b><small>Ages ${esc(g.ages)} · ${withDeck} lessons with slides</small></span>${WEEK ? ring(pct, g.color, 48) : ic("arrow", "go")}</a>
        ${up ? `<button class="pnext" data-open="${esc(up.code)}">${dk && dk.banner ? `<img loading="lazy" src="${esc(dk.banner)}" alt="">` : `<span class="pnone">${ic(up.domain)}</span>`}
          <span class="pnext-t"><small>${WEEK ? "Next lesson" : "First lesson"} · ${esc(lab(up))}</small><b>${esc(up.title)}</b></span></button>` : `<div class="pdone">${ic("check")}All lessons planned or done</div>`}
        <div class="pfoot"><a href="#${g.code}">All ${esc(g.name)} lessons ${ic("arrow")}</a>${dk ? `<button class="lk" data-view="${esc(dk.code)}">${ic("play")}Slides</button>` : ""}</div>
      </div>`; }).join("");

    const attStrip = att.length ? `<div class="att strip">${att.map(([t, h, d, act]) => `<div class="att-i ${t}"><span class="att-dot"></span><div><b>${h}</b><small>${esc(d)}</small></div>${act}</div>`).join("")}</div>` : "";

    const lab3 = `<div class="labgrid">
        <a class="labtile" href="#print"><span class="lt-ic">${ic("print")}</span><b>${issue.length ? plural(issue.length, "part") + " to pack" : "Kit lists"}</b><small>${issue.length ? `${items} items for this week. Print day-wise lists.` : "Plan sessions and the kit list builds itself."}</small></a>
        <a class="labtile" href="#hardware"><span class="lt-ic">${ic("parts")}</span><b>Hardware</b><small>Every part, which lessons use it, and how many you need.</small></a>
        <a class="labtile" href="#kits"><span class="lt-ic">${ic("box")}</span><b>Edit kits &amp; parts</b><small>Change what each lesson needs or add new parts.</small></a>
        <a class="labtile" href="#curriculum" data-libg="DOCS"><span class="lt-ic">${ic("file")}</span><b>Plans &amp; documents</b><small>Curriculum plans, parent brochures and forms.</small></a>
      </div>`;

    if (!WEEK) return `<section class="welcome portal">
        <div class="wl-txt"><span class="kicker">${fmt(now, { weekday: "long", day: "numeric", month: "long" })}</span>
          <h1>${hi}, ${esc((S.name || "").split(" ")[0] || "teacher")}</h1>
          <p>${LIB.decks.length} lessons with slides across 4 age groups · attendance and progress are saved in this browser only</p></div>
        <div class="wl-btns">${roleSwitch()}<a class="btn primary big" href="#attendance">${ic("users")}Take attendance</a><a class="btn big" href="#curriculum">${ic("book")}Lesson library</a></div>
        ${DOODLE}
      </section>
      ${attendanceHome()}
      ${sec("book", "Curriculum", "Four learning pathways. Open any lesson for its slides, video, parts and simulator.", `<a class="sec-link" href="#curriculum">Lesson library ${ic("arrow")}</a>`, `<div class="pgrid">${pathCards}</div>`, "t-cur")}
      ${sec("flask", "Virtual labs", "Try circuits and 3D designs on screen before building them for real.", `<a class="sec-link" href="#sims">All simulators ${ic("arrow")}</a>`, simTiles(), "t-sim")}
      ${sec("parts", "Lab &amp; kit", "Hardware and documents for the lab.", "", lab3.replace(/<a class="labtile" href="#print">[\s\S]*?<\/a>/, `<a class="labtile" href="#attendance"><span class="lt-ic">${ic("users")}</span><b>Attendance</b><small>Mark who came and what you taught. Counts classes for each group.</small></a>`), "t-lab")}`;
    return `<section class="welcome portal">
        <div class="wl-txt"><span class="kicker">${fmt(now, { weekday: "long", day: "numeric", month: "long" })}</span>
          <h1>${hi}, ${esc((S.name || "").split(" ")[0] || "teacher")}</h1>
          <p>${LIB.decks.length} lessons across 4 age groups · ${pctAll}% of the curriculum taught · ${nw.length ? plural(nw.length, "session") + " this week" : "nothing planned this week yet"}</p></div>
        <div class="wl-btns">${roleSwitch()}<a class="btn primary big" href="#curriculum">${ic("book")}Open lesson library</a><a class="btn big" href="circuit/">${ic("chip")}Open Circuit Lab</a></div>
        ${DOODLE}
      </section>
      <div class="todayrow">${upnext}${dayPack}</div>
      ${sec("book", "Curriculum", "Four learning pathways. Pick up where each group left off.", `<a class="sec-link" href="#curriculum">Lesson library ${ic("arrow")}</a>`, `<div class="pgrid">${pathCards}</div>`, "t-cur")}
      ${sec("week", "This week", `Week of ${ws}${nw.length ? " · " + plural(nw.length, "session") + ", " + pairs * 2 + " students" : ""}`, `<a class="sec-link" href="#week">Timetable ${ic("arrow")}</a>`, attStrip + board.replace('<div class="panel"><div class="panel-h"><h2>This week</h2><span class="muted">' + ws + '</span></div>', '<div class="panel flat">'), "t-week")}
      ${sec("flask", "Virtual labs", "Try circuits and 3D designs on screen before building them for real.", `<a class="sec-link" href="#sims">All simulators ${ic("arrow")}</a>`, simTiles(), "t-sim")}
      ${sec("parts", "Lab &amp; kit", "Hardware, kit lists and documents for the lab.", "", lab3, "t-lab")}`;
  }

  /* ---------- COMMAND PALETTE (Ctrl K) ---------- */
  const PAGES = [["home", "Home", "home"], ["attendance", "Attendance", "users"], ["curriculum", "Curriculum", "book"], ["hardware", "Hardware", "parts"], ["week", "Timetable", "week"], ["sims", "Simulators", "flask"], ["print", "Print lists", "print"], ["kits", "Edit kits & parts", "box"], ["settings", "Settings & backup", "gear"]];
  const CMD = { open: false, mode: "all", q: "", i: 0, res: [] };
  function openPalette(mode, q0) { CMD.open = true; CMD.mode = mode || "all"; CMD.q = q0 || ""; CMD.i = 0;
    $("#palette").innerHTML = `<div class="pal-box"><div class="pal-in">${ic("search")}<input id="palQ" autocomplete="off" aria-label="Search" role="combobox" aria-expanded="true" aria-controls="palRes" aria-autocomplete="list" placeholder="${CMD.mode === "plan" ? "Which activity? Type a code or name, e.g. JM-06 or robot" : "Search activities, presentations, documents, pages"}"><kbd>Esc</kbd></div><div class="pal-res" id="palRes" role="listbox" aria-label="Results"></div>
      <div class="pal-foot"><span><kbd>↑</kbd><kbd>↓</kbd> move</span><span><kbd>Enter</kbd> open</span><span><kbd>Ctrl K</kbd> search anywhere</span></div></div>`;
    /* focus at once, not after a delay: letters typed straight after Ctrl K
       used to land on the page behind and go missing */
    document.body.classList.add("pal-open"); const qi = $("#palQ"); qi.value = CMD.q; qi.focus(); palResults(); }
  function closePalette() { CMD.open = false; document.body.classList.remove("pal-open"); $("#palette").innerHTML = ""; }
  function palResults() {
    const q = CMD.q.trim().toLowerCase(), toks = q.split(/\s+/).filter(Boolean), hit = h => toks.every(t => h.includes(t));
    const R = [], sec = (title, arr, n) => { if (arr.length) R.push({ head: title }); arr.slice(0, n).forEach(x => R.push(x)); };
    const act = a => ({ icon: a.domain, title: `${lab(a)} · ${a.title}`, sub: `${GROUPS[a.group].name}${a.from ? " (borrowed)" : ""} · ${isStudent() ? (finished(a.code) ? "Finished" : levelOf(a) + " · " + a.unit) : WEEK ? statusText(a.code) : levelOf(a) + " · " + a.unit}`, color: GROUPS[a.group].color, light: GROUPS[a.group].light, run: () => openModal(a.code), badge: deckOf(a.code) ? "Slides" : "" });
    const deck = d => ({ thumb: d.thumb, title: `${d.code} · ${deckTitle(d)}`, sub: `${LG[d.group].name} · ${d.pages} slides`, color: LG[d.group].color, light: LG[d.group].light, run: () => openDeck(d.code), badge: "Present" });
    const doc = (d, n) => ({ icon: d.type === "pdf" ? "file" : "sheet", title: d.title, sub: d.about, color: "#C98A12", light: "#FFF4DC", run: () => { if (d.type === "pdf") openViewer(d.file, d.title, "doc", "#F5B83D", d.about); else { const l = document.createElement("a"); l.href = d.file; l.download = ""; document.body.appendChild(l); l.click(); l.remove(); } }, badge: d.type === "pdf" ? "PDF" : "Excel" });
    const page = ([k, t, i]) => ({ icon: i, title: t, sub: "Go to page", color: "var(--tr-f)", light: "var(--tr-f-tint)", run: () => { location.hash = "#" + k; } });
    const again = r => ({ icon: "search", title: r, sub: "Search again", color: "var(--tr-f)", light: "var(--tr-f-tint)", run: () => openPalette(CMD.mode, r) });
    /* a part: open Hardware on the age group that uses it most, searching for it */
    const part = n => { const used = ACTS.filter(a => kitOf(a.code).some(k => k.n === n)), by = {};
      used.forEach(a => { by[a.group] = (by[a.group] || 0) + 1; }); const gc = Object.keys(by).sort((x, y) => by[y] - by[x])[0] || "LE";
      return { icon: "parts", title: n, sub: `${catOf(n).cat} · used in ${plural(used.length, "lesson")}`, color: "var(--ok-ink)", light: "var(--ok-bg)", badge: "Part",
        run: () => { UI.hwG = gc; UI.hwPh[gc] = UI.hwPh[gc] || "Foundation"; UI.hwQ = n; if (route() === "hardware") render(); else location.hash = "#hardware"; } }; };
    if (!toks.length) {
      if (CMD.mode !== "plan" && PR.recent.length) sec("Recent searches", PR.recent.map(again), 5);
      if (CMD.mode !== "plan") sec("Jump to", PAGES.filter(x => !(noPlan() && ["week", "print"].includes(x[0])) && !(isStudent() && x[0] === "kits")).map(page).concat(D.groups.map(g => ({ icon: "users", title: g.name, sub: "Ages " + g.ages, color: g.color, light: g.light, run: () => { location.hash = "#" + g.code; } }))), 11);
      if (isStudent() && CMD.mode !== "plan") sec("Next for you", (PR.track ? ACTS.filter(a => a.group === PR.track && !finished(a.code)) : []).map(act), 4);
      else if (WEEK) { sec("Planned this week", planned().map(act), 6); sec("Next to teach", D.groups.flatMap(g => nextUp(g.code, 2)).map(act), 8); }
    } else {
      /* code first, then title, then everything else the activity mentions */
      const score = a => (a.code.toLowerCase().startsWith(q) ? 4 : 0) + (toks.every(t => a.title.toLowerCase().includes(t)) ? 2 : 0);
      const acts = ALL().filter(a => hit(hayOf(a) + " " + GROUPS[a.group].name.toLowerCase())).sort((x, y) => score(y) - score(x));
      sec("Activities", acts.map(act), CMD.mode === "plan" ? 14 : 7);
      if (CMD.mode !== "plan") {
        sec("Presentations", LIB.decks.filter(d => hit((d.code + " " + deckTitle(d) + " " + LG[d.group].name).toLowerCase())).map(deck), 6);
        sec("Documents", LIB.docs.map((d, n) => [d, n]).filter(([d]) => hit((d.title + " " + d.about).toLowerCase())).map(([d, n]) => doc(d, n)), 5);
        sec("Parts", Object.keys(allParts()).filter(n => hit(n.toLowerCase())).sort().map(part), 5);
        sec("Pages", PAGES.filter(p => hit(p[1].toLowerCase())).map(page), 4);
      }
    }
    CMD.res = R.filter(x => !x.head); CMD.i = Math.min(CMD.i, Math.max(0, CMD.res.length - 1));
    const qi = $("#palQ"); if (qi) { if (CMD.res.length) qi.setAttribute("aria-activedescendant", "pal-" + CMD.i); else qi.removeAttribute("aria-activedescendant"); }
    let k = -1;
    $("#palRes").innerHTML = R.length ? R.map(x => x.head ? `<div class="pal-h">${x.head}</div>` : (k++, `<button class="pal-i ${k === CMD.i ? "on" : ""}" role="option" id="pal-${k}" aria-selected="${k === CMD.i}" data-pal="${k}" style="--c:${x.color};--l:${x.light}">
        ${x.thumb ? `<img src="${esc(x.thumb)}" alt="">` : `<span class="pal-ic">${ic(x.icon)}</span>`}<span class="pal-t"><b>${esc(x.title)}</b><small>${esc(x.sub)}</small></span>${x.badge ? `<em>${x.badge}</em>` : ""}${ic("arrow", "pal-go")}</button>`)).join("")
      : `<div class="pal-empty">${DOODLE}<p>Nothing found for “${esc(CMD.q)}”.</p></div>`;
  }
  const statusText = c => { const s = peek(c); return s.status === "Next week" ? (s.day ? "Planned " + DAYFULL[s.day] : "Planned") : s.status === "Not started" ? "Not planned" : s.status; };
  function palMove(n) { if (!CMD.res.length) return; CMD.i = (CMD.i + n + CMD.res.length) % CMD.res.length; document.querySelectorAll(".pal-i").forEach((b, i) => { b.classList.toggle("on", i === CMD.i); b.setAttribute("aria-selected", i === CMD.i); }); $("#palQ").setAttribute("aria-activedescendant", "pal-" + CMD.i); const on = document.querySelector(".pal-i.on"); if (on) on.scrollIntoView({ block: "nearest" }); }
  function palRun(i) {
    const x = CMD.res[i]; if (!x) return; const q = CMD.q.trim();
    if (q && CMD.mode !== "plan") { PR.recent = [q].concat(PR.recent.filter(r => r.toLowerCase() !== q.toLowerCase())).slice(0, 6); savePr(); }
    closePalette(); x.run(); }
  $("#cmdk").onclick = () => openPalette("all");

  /* ---------- AGE GROUP ---------- */
  const UI = { phase: {}, q: {}, hwPh: {}, hwG: "", hwQ: "", libG: "F", libQ: "", pMode: "session", pDay: "ALL", pBreak: true, kitCode: ACTS[0].code, kitGroup: "LE", kitQ: "", catOpen: false, catQ: "" };
  /* what a search box matches: the words on the card, the "about" line, the
     unit and every part in the kit, so "servo" finds the lessons that use one */
  const hayOf = a => (a.code + " " + a.title + " " + a.domain + " " + a.unit + " " + (a.about || "") + " " + kitOf(a.code).map(k => k.n).join(" ")).toLowerCase();
  /* the next few lessons as a row of stops, for the student home */
  function pathStrip(list) {
    const i = Math.max(0, list.findIndex(a => !finished(a.code))), from = Math.max(0, i - 1), xs = list.slice(from, from + 6);
    return `<ol class="rmstrip">${xs.map(a => `<li class="${finished(a.code) ? "done" : ""} ${a === list[i] && !finished(a.code) ? "next" : ""}"><button data-open="${esc(a.code)}" style="--c:${GROUPS[a.group].color}"><span class="rm-dot">${finished(a.code) ? ic("check") : ""}</span><span class="acode">${esc(lab(a))}</span><span class="rm-t">${esc(a.title)}</span></button></li>`).join("")}</ol>`;
  }
  /* the whole track as a path: phase, then unit, then each lesson in order */
  function roadmap(gc, list) {
    const all = ACTS.filter(a => a.group === gc), nextA = all.find(a => !doneFor(a.code));
    return `<div class="roadmap" style="--c:${GROUPS[gc].color};--l:${GROUPS[gc].light}">${PHASES.map(ph => { const xs = list.filter(a => phaseOf(a) === ph); if (!xs.length) return "";
      const units = [...new Set(xs.map(a => a.unit))], d = xs.filter(a => doneFor(a.code)).length;
      return `<section class="rm-phase"><h3 class="rm-ph"><span>${ph}</span><small>${LEVEL[ph]} · ${d} of ${xs.length} done</small></h3>
        <div class="rm-units">${units.map(u => `<div class="rm-unit"><b>${esc(u)}</b><ol class="rm-steps">${xs.filter(a => a.unit === u).map(a =>
          `<li class="${doneFor(a.code) ? "done" : ""} ${a === nextA ? "next" : ""}"><button data-open="${esc(a.code)}"><span class="rm-dot">${doneFor(a.code) ? ic("check") : ""}</span><span class="acode">${esc(lab(a))}</span><span class="rm-t">${esc(a.title)}</span>${a === nextA ? `<em>Next</em>` : ""}</button></li>`).join("")}</ol></div>`).join("")}</div></section>`; }).join("")}</div>`;
  }
  function vGroup(gc) {
    const g = GROUPS[gc], all = ACTS.filter(a => a.group === gc), core = coreOf(gc), borrowed = extras().filter(a => a.group === gc), stu = isStudent();
    const dn = stu ? all.filter(a => finished(a.code)).length : core.filter(a => isDone(a.code)).length, nw = all.concat(borrowed).filter(a => isPlanned(a.code)).length;
    if (!UI.phase[gc]) UI.phase[gc] = PHASES.find(p => all.some(a => phaseOf(a) === p && !doneFor(a.code))) || "Phase 1";
    const ph = UI.phase[gc], q = (UI.q[gc] || "").toLowerCase(), toks = q.split(/\s+/).filter(Boolean);
    const p = qp(), map = p.get("view") === "map", fT = p.get("topic") || "", fP = p.get("part") || "", fL = p.get("level") || "", filt = !!(fT || fP || fL);
    const match = a => (!fT || a.domain === fT) && (!fL || levelOf(a) === fL) && (!fP || kitOf(a.code).some(k => k.n === fP)) && toks.every(t => hayOf(a).includes(t));
    const list = all.filter(a => (q || filt || map) ? match(a) : phaseOf(a) === ph);
    let body = "", lastU = "";
    if (map) body = list.length ? roadmap(gc, list) : "";
    else {
      list.forEach(a => { const u = phaseOf(a) + " · " + a.unit; if (u !== lastU) { if (lastU) body += `</div>`; body += `<h3 class="unit" style="--c:${g.color};--l:${g.light}">${esc(a.unit)}</h3><div class="agrid">`; lastU = u; } body += actCard(a); });
      if (lastU) body += `</div>`;
    }
    const opts = (k, label, vals, cur) => `<label class="fsel"><span>${label}</span><select data-filter="${k}"><option value="">Any</option>${vals.map(v => `<option ${v === cur ? "selected" : ""}>${esc(v)}</option>`).join("")}</select></label>`;
    const topics = [...new Set(all.map(a => a.domain))].sort(), parts = [...new Set(all.flatMap(a => kitOf(a.code).map(k => k.n).filter(Boolean)))].sort();
    return `<section class="gban" style="--c:${g.color};--l:${g.light}">
        <div class="gban-l"><span class="gban-badge">${gc}</span><div><h1>${esc(g.name)}</h1><p>Ages ${esc(g.ages)} · ${all.length} activities</p></div></div>
        ${stu || WEEK ? `<div class="gban-s"><div><b>${dn}</b><span>of ${stu ? all.length : core.length} ${stu ? "finished" : "done"}</span></div>${stu ? "" : `<div><b>${nw}</b><span>planned</span></div>`}</div>` : ""}
        ${DOODLE}</section>
      <div class="gtools">${map || filt ? `<span class="muted">${plural(list.length, "lesson")}${filt ? " match the filters" : " in the path"}</span>` : `<div class="tabs">${PHASES.map(x => `<button class="${!q && ph === x ? "on" : ""}" data-phase="${x}" data-g="${gc}">${x}<em>${all.filter(a => phaseOf(a) === x).length}</em></button>`).join("")}</div>`}
        <label class="search">${ic("search")}<input type="search" data-gq="${gc}" placeholder="Search ${esc(g.name)}: title, topic or part" aria-label="Search ${esc(g.name)}" value="${esc(UI.q[gc] || "")}"></label>
        ${noPlan() ? "" : `<button class="btn borrowbtn" data-pick="${gc}">${ic("plus")}Add from another group</button>`}</div>
      <div class="filters" style="--c:${g.color};--l:${g.light}">
        <div class="viewsw" role="group" aria-label="View"><button class="${map ? "" : "on"}" data-vmode="cards" aria-pressed="${!map}">${ic("grid")}Cards</button><button class="${map ? "on" : ""}" data-vmode="map" aria-pressed="${map}">${ic("map")}Roadmap</button></div>
        ${opts("topic", "Topic", topics, fT)}${opts("level", "Level", ["Starter", "Core", "Advanced"], fL)}${opts("part", "Hardware", parts, fP)}
        ${filt ? `<button class="linkbtn navy" data-clearf>${ic("x")}Clear filters</button>` : ""}</div>
      ${borrowed.length && !map && !filt ? `<h3 class="unit" style="--c:${g.color};--l:${g.light}">From other age groups <small>shared kits, planned for ${esc(g.name)}</small></h3><div class="agrid">${borrowed.map(actCard).join("")}</div>` : ""}
      ${body || empty(filt ? "No lessons match these filters." : "Nothing matches your search.", filt ? `<button class="btn" data-clearf>Clear filters</button>` : "")}`;
  }

  /* ---------- SESSION MODAL ---------- */
  let modalCode = null;
  /* keyboard users land inside the sheet, Tab stays in it, and closing puts
     focus back on whatever opened it */
  let modalReturn = null;
  const focusables = root => [...root.querySelectorAll('a[href], button:not([disabled]), input:not([type="hidden"]), select, textarea, summary, [tabindex]:not([tabindex="-1"])')].filter(el => el.offsetParent !== null);
  function focusSheet() { const m = $("#modal .sheet-m"); if (!m) return; const f = m.querySelector("[data-close], .m-x") || focusables(m)[0]; if (f) f.focus({ preventScroll: true }); }
  /* the page is redrawn when the sheet closes, so the button that opened it
     is found again by its data-open / data-sched / data-pick value */
  function opener(el) {
    if (!el || el === document.body) return null;
    const k = ["open", "sched", "pick"].find(x => el.dataset && el.dataset[x] != null);
    return { el, sel: k ? `[data-${k}="${CSS.escape(el.dataset[k])}"]` : "" };
  }
  function openModal(code) { if (!modalCode) modalReturn = opener(document.activeElement); modalCode = code; UI.swapOpen = false; if (getA(code)) { PR.last = code; savePr(); } renderModal(); document.body.classList.add("modal-open"); focusSheet(); }
  function closeModal() {
    modalCode = null; document.body.classList.remove("modal-open"); render();
    const r = modalReturn; modalReturn = null; if (!r) return;
    const back = document.contains(r.el) ? r.el : r.sel ? $("#app " + r.sel) || $(r.sel) : null;
    if (back) back.focus({ preventScroll: true });
  }
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
    if (String(modalCode).startsWith("sched:")) return renderSched();
    const a = getA(modalCode), g = GROUPS[a.group], s = peek(a.code), kit = kitOf(a.code).filter(k => k.n), gr = groupsOf(a.code), dk = deckOf(a.code), stu = isStudent();
    const sp = dk ? PR.slide[dk.code] || 0 : 0;
    const hero = dk
      ? `<button class="mdeck" data-view="${esc(dk.code)}" aria-label="Open presentation"><img src="${esc(dk.thumb)}" alt=""><span class="dplay">${ic("play")}</span><span class="mdeck-cta">${ic("play")}${sp > 1 ? `Carry on from slide ${sp} of ${dk.pages}` : `Open presentation · ${dk.pages} slides`}</span></button>`
      : `<div class="mdeck none"><span class="aicon big">${ic(a.domain)}</span><span>No presentation for this activity yet</span></div>`;
    const vv = vidOf(a.code);
    const vrow = vv ? `<button class="mvid" data-video="${esc(lab(a))}"><span class="mvid-ic">${ic("play")}</span><span><b>Watch the video</b><small>${esc(vv.title)} · ${esc(vv.channel)} · about ${vv.mins} min</small></span>${ic("arrow")}</button>` : "";
    const sims = SIM.forLesson(lab(a), a.title, a.domain);
    const srow = sims.length ? `<div class="msims"><span class="msims-l">${ic("flask")}Try it on screen</span>${sims.map(x => `<a class="msim" href="${esc(x.href)}" style="--sc:${x.sim.color}" title="${esc(x.why)}">${ic(simIcon(x.sim))}<span><b>${esc(x.sim.name)}</b><small>${esc(x.why)}</small></span></a>`).join("")}</div>` : "";
    const dayTxt = isPlanned(a.code) ? (s.day ? `${DAYFULL[s.day]} ${dayDate(s.day)}` : "Planned, no day yet") : isDone(a.code) ? "Done" : "Not planned yet";
    /* Steps, Challenge and Check yourself appear only for activities that have
       them: the optional "steps", "challenge" and "check" fields (see README). */
    const steps = Array.isArray(a.steps) && a.steps.length ? `<div class="m-sec lsec"><label><span>${ic("list")}Steps</span></label><ol class="lsteps">${a.steps.map(x => `<li>${esc(x)}</li>`).join("")}</ol></div>` : "";
    const chall = a.challenge ? `<div class="m-sec lsec lchall"><label><span>${ic("flag")}Challenge</span></label><p>${esc(a.challenge)}</p></div>` : "";
    const check = Array.isArray(a.check) && a.check.length ? `<div class="m-sec lsec"><label><span>${ic("help")}Check yourself</span></label>${a.check.map(c => `<details class="qa"><summary>${esc(c.q || c)}</summary>${c.a ? `<p>${esc(c.a)}</p>` : ""}</details>`).join("")}</div>` : "";
    const need = stu
      ? kit.map(k => `<div><span>${esc(k.n)}<small>${esc(catOf(k.n).cat)}</small></span><b>${k.b === "class" ? "shared" : "× " + esc(k.q)}</b></div>`).join("")
      : kit.map(k => `<div><span>${esc(k.n)}<small>${esc(catOf(k.n).cat)}${k.b === "class" ? " · per class" : ""}</small></span><b>${lineTotal(k, a.code)}</b></div>`).join("");
    /* the teacher's planning controls, exactly as before, folded under one heading */
    const plan = noPlan() ? "" : `<details class="mplan" open><summary>${ic("cal")}<span>Plan this session</span><small>day, group, time and notes</small></summary><div class="mplan-b">
        <div class="m-sec"><label>Day</label>
          <div class="daypick">${DAYS.map(d => `<button class="${isPlanned(a.code) && s.day === d ? "on" : ""}" data-mday="${d}"><b>${d}</b><span>${dayDate(d)}</span></button>`).join("")}</div>
          ${isPlanned(a.code) ? `<button class="linkbtn" data-unplan>${ic("x")}Remove from this week</button>` : ""}</div>
        ${groupSection(a)}
        <div class="m-row">
          <div class="m-sec"><label>Groups (pairs)</label><div class="stepper"><button data-step="-1" aria-label="Fewer groups">${ic("minus")}</button><b>${gr}</b><button data-step="1" aria-label="More groups">${ic("plus")}</button></div></div>
          <div class="m-sec"><label>Time <i>optional</i></label><input data-mf="time" value="${esc(s.time)}" placeholder="e.g. 2:30 pm" aria-label="Time"></div>
          <div class="m-sec"><label>Section <i>optional</i></label><input data-mf="section" value="${esc(s.section)}" placeholder="e.g. Grade 4 B" aria-label="Section"></div>
        </div>
        <div class="m-sec"><label>Notes <i>optional</i></label><input data-mf="notes" value="${esc(s.notes)}" placeholder="Anything to remember" aria-label="Notes"></div></div></details>`;
    const foot = stu
      ? `<div class="m-status">${finished(a.code) ? `<span class="chip green">${ic("check")}Finished ${fmt(new Date(PR.done[baseOf(a.code)] + "T00:00:00"), { day: "numeric", month: "short" })}</span>` : `<small class="muted">Your progress is saved on this device</small>`}</div>
        <div class="m-acts"><a class="btn kitbtn" href="#kit=${encodeURIComponent(a.code)}" data-close>${ic("print")}Hardware list</a>
          ${finished(a.code) ? `<button class="btn" data-finish>Not finished yet</button>` : `<button class="btn primary" data-finish>${ic("check")}I've finished this lesson</button>`}</div>`
      : !WEEK ? `<div class="m-status"><small class="muted">${esc(levelOf(a))} · ${esc(a.unit)}</small></div>
        <div class="m-acts"><a class="btn kitbtn" href="#kit=${encodeURIComponent(a.code)}" data-close>${ic("print")}Print hardware list</a><button class="btn primary" data-close>Close</button></div>`
      : `<div class="m-status">${statusChip(a.code)}${s.status === "Done" && s.date ? `<small>on ${fmt(new Date(s.date + "T00:00:00"), { day: "numeric", month: "short" })}</small>` : ""}</div>
        <div class="m-acts">
          <a class="btn kitbtn" href="#kit=${encodeURIComponent(a.code)}" data-close>${ic("print")}Print hardware list</a>
          ${s.status === "Done" ? `<button class="btn" data-mstatus="Not started">Undo done</button>` : `<button class="btn" data-mstatus="Done">${ic("check")}Mark as done</button>`}
          <button class="btn primary" data-close>Save</button></div>`;
    $("#modal").innerHTML = `<div class="sheet-m wide" style="--c:${g.color};--l:${g.light}" role="document" aria-label="${esc(lab(a))} ${esc(a.title)}">
      <div class="m-hero">${hero}${vrow}<button class="m-x float" data-close aria-label="Close">${ic("x")}</button></div>
      <div class="m-title">
        <span class="acode">${esc(lab(a))} · ${esc(a.domain)}${a.cls ? " · Class " + a.cls : ""}</span>
        <h2>${esc(a.title)}</h2>
        <div class="facts"><span class="lvl lvl-${levelOf(a).toLowerCase()}">${levelOf(a)}</span>${lengthOf(a) ? `<span class="fact">${lengthOf(a)} lesson</span>` : ""}
          <span class="fact grp"><i class="gdot" style="background:${g.color}"></i>${esc(g.name)}${a.from ? ` (from ${esc(GROUPS[a.from].name)})` : ""}</span>
          ${stu ? (finished(a.code) ? `<span class="fact ok">${ic("check")}Finished</span>` : "") : !WEEK ? "" : `<span class="fact ${isPlanned(a.code) ? "on" : ""}">${ic("cal")}${esc(dayTxt)}${s.time ? " · " + esc(s.time) : ""}</span><span class="fact">${ic("users")}${gr} groups · ${gr * 2} students</span>`}</div>
      </div>
      <div class="m-body">
        ${a.goal || a.about ? `<div class="m-sec lsec lgoal"><label><span>${ic("target")}Goal</span></label><p>${esc(a.goal || a.about)}</p></div>` : ""}
        ${window.BUDDY_CONFIG && window.BUDDY_CONFIG.enabled ? `<button class="askbuddy" data-askbuddy>${ic("bulb")}<span><b>Stuck? Ask Study Buddy</b><small>about ${esc(lab(a))}, its parts or the code</small></span>${ic("arrow")}</button>` : ""}
        <div class="m-sec lsec"><label><span>${ic("parts")}What you need <i>${stu ? "per group of 2" : `for ${gr} groups`}</i></span><span class="lacts"><button class="linkbtn navy" data-copycode="${esc(a.code)}">${ic("copy")}Copy list</button>${stu ? "" : `<a href="#kits" data-editkit="${esc(lab(a))}">Edit kit</a>`}</span></label>
          <div class="mkit">${need || `<p class="muted">No parts listed.</p>`}</div></div>
        ${srow}${steps}${chall}${check}${plan}
      </div>
      <div class="m-foot">${foot}</div></div>`;
  }


  /* ---------- SCHEDULER: click a day, pick group + lesson + options ---------- */
  const TIMES = ["8:00 am", "9:00 am", "10:00 am", "11:00 am", "12:00 pm", "1:30 pm", "2:00 pm", "2:30 pm", "3:00 pm", "3:30 pm", "4:00 pm"];
  const suggestFor = gc => (coreOf(gc).find(a => peek(a.code).status === "Not started") || ACTS.find(a => a.group === gc && peek(a.code).status === "Not started") || {}).code || "";
  function openSched(day, gc) {
    if (!DAYS.includes(day)) day = todayDay() || "Mon";
    const r = (S.routine || []).find(x => x.day === day && (!gc || x.group === gc));
    const g = gc || (r && r.group) || (UI.sch && UI.sch.g) || "LE";
    UI.sch = { day, g, code: suggestFor(g), time: r ? r.time : "", section: r ? r.section : "", groups: r ? r.groups : S.defaultGroups, notes: "", q: "", keep: !!r };
    if (!modalCode) modalReturn = opener(document.activeElement);
    modalCode = "sched:" + day; renderModal(); document.body.classList.add("modal-open"); focusSheet();
  }
  function renderSched() {
    const c = UI.sch, g = GROUPS[c.g], q = c.q.toLowerCase();
    const sugg = suggestFor(c.g);
    const list = ACTS.filter(a => a.group === c.g && !isDone(a.code) && (!q || (a.code + " " + a.title + " " + a.domain).toLowerCase().includes(q)))
      .sort((x, y) => (x.code === sugg ? -1 : y.code === sugg ? 1 : 0));
    const row = a => { const dk = deckOf(a.code), p = isPlanned(a.code), pd = peek(a.code).day;
      return `<button class="srow ${c.code === a.code ? "on" : ""}" data-schcode="${esc(a.code)}" style="--c:${g.color};--l:${g.light}">
        ${dk && dk.banner ? `<img loading="lazy" src="${esc(dk.banner)}" alt="">` : `<span class="snone">${ic(a.domain)}</span>`}
        <span class="st"><span class="acode">${esc(lab(a))}</span>${a.code === sugg ? `<em class="sug">Next in sequence</em>` : ""}${p ? `<em class="pl">Planned ${pd ? DAYFULL[pd] : ""}</em>` : ""}<b>${esc(a.title)}</b><small>${esc(phaseOf(a))}${dk ? " · slides" : ""}${vidOf(a.code) ? " · video" : ""}</small></span>
        <span class="scheck">${ic("check")}</span></button>`; };
    $("#modal").innerHTML = `<div class="sheet-m wide sched" style="--c:${g.color};--l:${g.light}">
      <div class="m-head"><span class="aicon big">${ic("cal")}</span><div class="m-tt"><span class="acode">Timetable · week of ${fmt(addDays(S.weekStart, 0), { day: "numeric", month: "long" })}</span><h2>Add a session</h2><p>Choose the day, the age group and the lesson. Everything else is optional.</p></div><button class="m-x" data-close aria-label="Close">${ic("x")}</button></div>
      <div class="m-body">
        <div class="m-sec"><label>1. Day</label><div class="daypick">${DAYS.map(d => `<button class="${c.day === d ? "on" : ""}" data-schday="${d}"><b>${d}</b><span>${dayDate(d)}</span></button>`).join("")}</div></div>
        <div class="m-sec"><label>2. Age group</label><div class="gpick">${D.groups.map(x => `<button class="${x.code === c.g ? "on" : ""}" data-schg="${x.code}" style="--c:${x.color};--l:${x.light}"><b>${x.code}</b>${esc(x.name)}</button>`).join("")}</div></div>
        <div class="m-sec"><label>3. Lesson <i>the next lesson in sequence is picked for you</i></label>
          <label class="search">${ic("search")}<input type="search" id="schQ" placeholder="Search ${esc(g.name)} lessons" value="${esc(c.q)}"></label>
          <div class="slist">${list.map(row).join("") || `<p class="muted">No lessons match.</p>`}</div></div>
        <div class="m-row">
          <div class="m-sec"><label>Time <i>optional</i></label><input data-sf="time" list="schTimes" value="${esc(c.time)}" placeholder="e.g. 2:30 pm"><datalist id="schTimes">${TIMES.map(t => `<option value="${t}">`).join("")}</datalist></div>
          <div class="m-sec"><label>Class / section <i>optional</i></label><input data-sf="section" value="${esc(c.section)}" placeholder="e.g. Grade 4 B"></div>
          <div class="m-sec"><label>Groups (pairs)</label><div class="stepper"><button data-schstep="-1" aria-label="Fewer groups">${ic("minus")}</button><b>${c.groups}</b><button data-schstep="1" aria-label="More groups">${ic("plus")}</button></div></div>
        </div>
        <div class="m-sec"><label>Notes <i>optional</i></label><input data-sf="notes" value="${esc(c.notes)}" placeholder="Room, helper, anything to remember"></div>
        <label class="tog"><input type="checkbox" id="schKeep" ${c.keep ? "checked" : ""}><span></span>Repeat every week: save ${esc(g.name)} on ${DAYFULL[c.day]}${c.time ? " at " + esc(c.time) : ""} to my weekly routine</label>
      </div>
      <div class="m-foot"><div class="m-status"><small class="muted">${c.code ? esc(lab(getA(c.code))) + " · " + esc(getA(c.code).title) : "Pick a lesson"}</small></div>
        <div class="m-acts"><button class="btn" data-close>Cancel</button><button class="btn primary" data-schsave ${c.code ? "" : "disabled"}>${ic("plus")}Add to ${DAYFULL[c.day]}</button></div></div>
    </div>`;
  }
  function saveSched() {
    const c = UI.sch; if (!c.code) return toast("Pick a lesson first");
    const s = sess(c.code); s.day = c.day; s.time = c.time; s.section = c.section; s.groups = c.groups; if (c.notes) s.notes = c.notes;
    setStatus(c.code, "Next week");
    S.routine = (S.routine || []).filter(x => !(x.day === c.day && x.group === c.g));
    if (c.keep) S.routine.push({ day: c.day, group: c.g, time: c.time, section: c.section, groups: c.groups });
    S.routine.sort((a, b) => dayIdx(a.day) - dayIdx(b.day) || (a.time || "").localeCompare(b.time || ""));
    save(); const a = getA(c.code); closeModal(); toast(`${esc(lab(a))} added to <b>${DAYFULL[c.day]}</b>`);
  }
  function fillRoutine() {
    let n = 0; const taken = new Set();
    (S.routine || []).forEach(r => {
      if (planned().some(a => a.group === r.group && peek(a.code).day === r.day)) return;
      const a = coreOf(r.group).find(x => peek(x.code).status === "Not started" && !taken.has(x.code)); if (!a) return;
      taken.add(a.code); const s = sess(a.code); s.day = r.day; s.time = r.time; s.section = r.section; s.groups = r.groups; setStatus(a.code, "Next week"); n++;
    });
    save(); render(); toast(n ? `Added ${plural(n, "session")} from your weekly routine` : "Routine slots are already filled this week");
  }

  /* ---------- WEEK ---------- */
  function vWeek() {
    const nw = planned(), noday = nw.filter(a => !peek(a.code).day), R = S.routine || [];
    const cols = DAYS.map(d => {
      const items = nw.filter(a => peek(a.code).day === d), slots = R.filter(r => r.day === d && !items.some(a => a.group === r.group));
      return `<div class="wcol ${items.length || slots.length ? "" : "empty"}"><div class="wcol-h"><div><b>${DAYFULL[d]}</b><span>${dayDate(d)}</span></div>${items.length ? `<span class="wcount">${plural(items.length, "session")}</span>` : ""}</div>
        <div class="wlist">${items.map(a => `<button class="wcard" data-open="${esc(a.code)}" style="--c:${GROUPS[a.group].color};--l:${GROUPS[a.group].light}"><span class="acode">${esc(lab(a))}</span>${fromTag(a)}<b>${esc(a.title)}</b><small>${esc(GROUPS[a.group].name)} · ${groupsOf(a.code)} groups${peek(a.code).time ? " · " + esc(peek(a.code).time) : ""}${peek(a.code).section ? " · " + esc(peek(a.code).section) : ""}</small></button>`).join("")}
          ${slots.map(r => `<button class="wslot" data-sched="${d}" data-schgrp="${r.group}" style="--c:${GROUPS[r.group].color};--l:${GROUPS[r.group].light}"><b>${esc(GROUPS[r.group].name)}</b><small>Routine slot${r.time ? " · " + esc(r.time) : ""}. Tap to pick the lesson</small></button>`).join("")}
          <button class="wadd" data-sched="${d}">${ic("plus")}Add session</button></div>
        ${items.length ? `<a class="wprint" href="#print" data-printday="${d}">${ic("print")}Print ${d} kit</a>` : ""}</div>`;
    }).join("");
    const routine = `<div class="routine"><div class="routine-h"><div><b>${ic("loop")}Weekly routine</b><small>${R.length ? "Your regular club slots. Fill a new week in one click." : "Tick “Repeat every week” when you add a session, and it appears here."}</small></div>
        ${R.length ? `<button class="btn primary" data-act="fillroutine">${ic("plus")}Fill this week from routine</button>` : ""}</div>
      ${R.length ? `<div class="rchips">${R.map((r, k) => `<span class="rchip" style="--c:${GROUPS[r.group].color};--l:${GROUPS[r.group].light}"><b>${r.day}</b>${esc(GROUPS[r.group].name)}${r.time ? " · " + esc(r.time) : ""}${r.section ? " · " + esc(r.section) : ""}<button data-unroutine="${k}" aria-label="Remove slot">${ic("x")}</button></span>`).join("")}</div>` : ""}</div>`;
    return head("Timetable", nw.length ? `${plural(nw.length, "session")} planned. Tap a day's + to add a session, or a session to change it.` : "Tap “Add session” under any day to build this week's timetable.", nw.length ? `<button class="btn" data-act="doneweek">${ic("check")}Mark week done</button><a class="btn primary" href="#print">${ic("print")}Print kit lists</a>` : "") +
      (noday.length ? `<div class="warn">${noday.length} planned session${noday.length > 1 ? "s have" : " has"} no day: ${noday.map(a => `<button class="lk" data-open="${esc(a.code)}">${esc(lab(a))}</button>`).join(", ")}</div>` : "") +
      routine + `<div class="wgrid">${cols}</div>`;
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

  /* ---------- ONE ACTIVITY'S HARDWARE LIST ----------
     A print-ready sheet for a single activity, so a teacher or a lab engineer
     can collect the parts without planning a week first. Each row carries the
     part's own picture, the same artwork Circuit Lab draws on the canvas, so
     somebody who does not know the components can still find them. */
  let artLoading = null;
  function loadPartArt() {
    /* Two libraries draw the parts: Wokwi Elements for the boards and common
       components, and Circuit Lab's own elements for everything we added.
       Both are fetched only when a hardware list is opened, never on a normal
       page, because together they are half a megabyte. */
    if (artLoading) return artLoading;
    const script = (src, mod) => new Promise(res => {
      const s = document.createElement("script");
      if (mod) s.type = "module";
      s.src = src; s.onload = () => res(true); s.onerror = () => res(false);
      document.head.appendChild(s);
    });
    artLoading = Promise.all([
      customElements.get("wokwi-led") ? true : script("vendor/wokwi-elements.js?v=16", false),
      customElements.get("cl-resistor") ? true : Promise.all([2, 3, 4, 5].map(n => script(`circuit/elements${n}.js?v=16`, true)))
        .then(() => script("circuit/elements.js?v=16", true)),
    ]).then(r => {
      /* the modules register their elements as they evaluate; give the last of
         them a moment to finish before anything is measured */
      return new Promise(res => setTimeout(() => res(r[0] !== false), 120));
    });
    return artLoading;
  }
  /* craft and consumable items have no electronic artwork: they get a simple drawing */
  const FALLBACK = [
    [/jumper wire|wire/i, '<path d="M6 30c6-14 16 14 22 0s12-10 16-2" stroke="#E8384F" stroke-width="3" fill="none"/><circle cx="6" cy="30" r="3" fill="#2B3A52"/><circle cx="44" cy="28" r="3" fill="#2B3A52"/>'],
    [/laptop|computer/i, '<rect x="9" y="12" width="32" height="21" rx="2" stroke="#2B3A52" stroke-width="2.6" fill="#DCE9FB"/><path d="M5 37h40" stroke="#2B3A52" stroke-width="2.6"/>'],
    [/multimeter/i, '<rect x="12" y="8" width="26" height="32" rx="3" stroke="#2B3A52" stroke-width="2.6" fill="#FDE68A"/><rect x="16" y="12" width="18" height="9" rx="2" fill="#2B3A52"/><circle cx="25" cy="31" r="5" stroke="#2B3A52" stroke-width="2.4" fill="none"/>'],
    [/3d printer/i, '<rect x="8" y="10" width="34" height="30" rx="3" stroke="#2B3A52" stroke-width="2.6" fill="none"/><path d="M14 20h22M22 20v8h6v-8" stroke="#2B3A52" stroke-width="2.4"/>'],
    [/glue|marker|pen/i, '<rect x="20" y="8" width="10" height="26" rx="2" stroke="#2B3A52" stroke-width="2.6" fill="#C7D2FE"/><path d="M22 34l3 7 3-7" stroke="#2B3A52" stroke-width="2.4" fill="none"/>'],
    [/paper|card|sheet|cardboard/i, '<rect x="12" y="8" width="26" height="32" rx="2" stroke="#2B3A52" stroke-width="2.6" fill="#fff"/><path d="M17 16h16M17 22h16M17 28h10" stroke="#9AA3AF" stroke-width="2.2"/>'],
    [/tape|foil/i, '<circle cx="25" cy="24" r="14" stroke="#2B3A52" stroke-width="2.6" fill="#FDE68A"/><circle cx="25" cy="24" r="5" stroke="#2B3A52" stroke-width="2.4" fill="#fff"/>'],
    [/scissor|cutter|knife/i, '<path d="M14 10l20 26M34 10L14 36" stroke="#2B3A52" stroke-width="2.6"/><circle cx="12" cy="39" r="4" stroke="#2B3A52" stroke-width="2.4" fill="none"/><circle cx="38" cy="39" r="4" stroke="#2B3A52" stroke-width="2.4" fill="none"/>'],
    [/lemon|fruit|banana|playdough|candle|cork|coin|nail/i, '<circle cx="25" cy="24" r="13" stroke="#2B3A52" stroke-width="2.6" fill="#FEF3C7"/><path d="M25 11v26" stroke="#CA8A04" stroke-width="2.2"/>'],
    [/phone|smartphone/i, '<rect x="17" y="7" width="16" height="34" rx="3" stroke="#2B3A52" stroke-width="2.6" fill="#DCE9FB"/><path d="M23 37h4" stroke="#2B3A52" stroke-width="2.4"/>'],
    [/battery|power|cell/i, '<rect x="9" y="17" width="30" height="15" rx="3" stroke="#2B3A52" stroke-width="2.6" fill="#DCFCE7"/><rect x="39" y="21" width="4" height="7" rx="1" fill="#2B3A52"/>'],
  ];
  const fallbackArt = n => {
    const f = FALLBACK.find(x => x[0].test(n));
    return `<svg viewBox="0 0 50 48" class="kpsvg">${f ? f[1] : '<rect x="11" y="12" width="28" height="24" rx="3" stroke="#B9C3D2" stroke-width="2.6" fill="#F3F6FB"/><path d="M11 20h28" stroke="#B9C3D2" stroke-width="2.4"/>'}</svg>`;
  };
  /* fill every picture cell once the artwork library is in */
  function drawKitPics() {
    const cells = [...document.querySelectorAll(".kpic[data-kit]")];
    if (!cells.length) return;
    const KP = window.KITPARTS || {};
    const need = cells.filter(c => KP[c.dataset.kit]);
    cells.forEach(c => { if (!KP[c.dataset.kit]) c.innerHTML = fallbackArt(c.dataset.kit); });
    if (!need.length) return;
    loadPartArt().then(ok => {
      need.forEach(c => {
        const p = KP[c.dataset.kit];
        if (!ok || !customElements.get(p.tag)) { c.innerHTML = fallbackArt(c.dataset.kit); return; }
        const el = document.createElement(p.tag);
        Object.entries(p.attrs || {}).forEach(([k, v]) => { if (v != null && v !== false) el.setAttribute(k, v); });
        c.innerHTML = ""; c.appendChild(el);
        const fit = n => {
          const r = el.getBoundingClientRect(), box = c.getBoundingClientRect();
          if ((!r.width || !r.height) && n < 40) return setTimeout(() => fit(n + 1), 60);
          if (!r.width || !r.height) return;
          const s = Math.min((box.width - 4) / r.width, (box.height - 4) / r.height, 1.1);
          el.style.transform = `translate(${(box.width - r.width * s) / 2}px,${(box.height - r.height * s) / 2}px) scale(${s})`;
          el.style.opacity = 1;
        };
        el.style.opacity = 0;
        (el.updateComplete || Promise.resolve()).then(() => requestAnimationFrame(() => fit(0)));
      });
    });
  }
  function vKitSheet(code) {
    const a = BYCODE[code];
    if (!a) return head("Hardware list", "") + empty("That activity was not found.", `<a class="btn primary" href="#curriculum">Back to the lessons</a>`);
    const g = GROUPS[a.group], gr = groupsOf(a.code);
    const kit = kitOf(a.code).filter(k => k.n);
    const rows = kit.slice().sort((p, q) => catIdx(catOf(p.n).cat) - catIdx(catOf(q.n).cat) || p.n.localeCompare(q.n));
    const body = rows.map((k, i) => {
      const c = catOf(k.n);
      return `<tr><td class="c">${i + 1}</td>
        <td class="kpcell"><span class="kpic" data-kit="${esc(k.n)}"></span></td>
        <td><b>${esc(k.n)}</b>${c.spec ? `<small>${esc(c.spec)}</small>` : ""}</td>
        <td>${esc(c.cat)}</td>
        <td class="c">${esc(k.q)}</td>
        <td class="c">${k.b === "class" ? "Per class" : "Per group"}</td>
        <td class="c">${esc(c.type)}</td>
        <td>${esc(k.note || "")}</td>
        <td class="tot">${lineTotal(k, a.code)}</td>
        <td class="box"></td></tr>`;
    }).join("");
    const reuse = rows.filter(k => catOf(k.n).type !== "Consumable").length;
    return `<div class="noprint">${head("Hardware list · " + lab(a), esc(a.title) + " · " + esc(g.name),
        `<a class="btn" href="#${a.group}">${ic("arrow")}Back to ${esc(g.name)}</a><button class="btn" data-copycode="${esc(a.code)}">${ic("copy")}Copy list</button><button class="btn primary big" data-act="print">${ic("print")}Print / Save PDF</button>`)}
      <div class="pbar kbar"><span class="gl">Groups (pairs) in the class</span>
        <div class="stepper"><button data-kstep="-1" aria-label="Fewer groups">${ic("minus")}</button><b>${gr}</b><button data-kstep="1" aria-label="More groups">${ic("plus")}</button></div>
        <span class="muted">The totals follow this number.</span></div></div>
      <div id="printArea"><div class="paper kitpaper">
        <div class="shead"><div><h2>Hardware list</h2>
          <div class="s">${esc(a.title)} · ${esc(lab(a))} · ${esc(g.name)}${a.unit ? " · " + esc(a.unit) : ""}</div>
          <div><b>Groups:</b> ${gr} &nbsp;·&nbsp; <b>Requested by:</b> ${esc(S.name)} &nbsp;·&nbsp; <b>Campus:</b> ${esc(S.campus)}</div></div>
          <div class="who"><div>Issued by (lab):<span></span></div><div>Signature / date:<span></span></div></div></div>
        <table class="kt kpt"><thead><tr><th class="c">#</th><th class="c">Part</th><th>Component</th><th>Category</th>
          <th class="c">Qty</th><th class="c">Basis</th><th class="c">Type</th><th>Notes</th><th class="c">Total</th><th class="c">Issued</th></tr></thead>
          <tbody>${body || `<tr><td colspan="10">No parts listed for this activity.</td></tr>`}</tbody></table>
        <p class="note">${rows.length} line${rows.length === 1 ? "" : "s"} · ${reuse} reusable · ${rows.length - reuse} consumable.
          Totals assume ${gr} group${gr === 1 ? "" : "s"}. Per-class items are counted once.</p>
      </div></div>`;
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
          <div class="kq"><button data-kstep="-1" data-i="${i}" aria-label="One fewer">${ic("minus")}</button><b>${esc(k.q)}</b><button data-kstep="1" data-i="${i}" aria-label="One more">${ic("plus")}</button></div>
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

  /* ---------- CURRICULUM ---------- */
  function deckCard(d) {
    const g = LG[d.group];
    const st = d.group === "F" ? "" : (() => { const s = peek(d.code); return s.status === "Next week" ? `<span class="chip amber">${ic("cal")}${s.day ? DAYFULL[s.day] : "Planned"}</span>` : s.status === "Done" ? `<span class="chip green">${ic("check")}Done</span>` : ""; })();
    return `<button class="deck" data-view="${esc(d.code)}" style="--c:${g.color};--l:${g.light}">
      <span class="dthumb"><img loading="lazy" src="${esc(d.thumb)}" alt=""><span class="dplay">${ic("play")}</span><span class="dpages">${d.pages} slides</span></span>
      <span class="dbody"><span class="dtop"><span class="acode">${esc(d.code)}</span>${st}</span><b>${esc(deckTitle(d))}</b>${vidOf(d.code) ? `<span class="dvid">${ic("play")}Video included</span>` : ""}</span></button>`;
  }
  const DOCKINDS = [["plan", "Curriculum plans", "book"], ["parent", "For parents", "users"], ["sheet", "Planner spreadsheets", "sheet"], ["req", "Requisitions", "box"]];
  function docCard(d, i) {
    const pdf = d.type === "pdf";
    return `<button class="doc" ${pdf ? `data-doc="${i}"` : `data-dl="${i}"`}>
      <span class="docthumb ${pdf ? "" : "xl"}">${pdf ? `<img loading="lazy" src="${esc(d.thumb)}" alt="">` : ic("sheet")}</span>
      <span class="docbody"><b>${esc(d.title)}</b><small>${esc(d.about)}</small><span class="dmeta">${pdf ? `${ic("file")}PDF · ${d.pages} pages` : `${ic("down")}Excel · download`}</span></span></button>`;
  }
  /* coloured age-group tabs, shared by Curriculum and Hardware */
  function gtabs(list, sel, attr) {
    return `<div class="gtabs">${list.map(g => `<button class="gtab ${sel === g.code ? "on" : ""}" ${attr}="${g.code}" style="--c:${g.color};--l:${g.light}">
      ${g.icon ? ic(g.icon) : `<span class="gtab-code">${g.code}</span>`}<span class="gtab-txt"><b>${esc(g.name)}</b><small>${esc(g.sub)}</small></span></button>`).join("")}</div>`;
  }
  const ageSub = g => (g.code === "F" ? "All age groups" : "Ages " + g.ages);
  function vCurriculum() {
    const sel = UI.libG && (LG[UI.libG] || UI.libG === "DOCS") ? UI.libG : (UI.libG = "F"), q = (UI.libQ || "").toLowerCase();
    const tabs = LGROUPS.map(g => ({ code: g.code, name: g.name, color: g.color, light: g.light, sub: `${ageSub(g)} · ${LIB.decks.filter(d => d.group === g.code).length} slides` }))
      .concat([{ code: "DOCS", name: "Plans & documents", color: "#C98A12", light: "#FFF4DC", icon: "book", sub: `${LIB.docs.length} files` }]);
    let body;
    if (sel === "DOCS") {
      body = DOCKINDS.map(([k, t]) => { const list = LIB.docs.map((d, n) => [d, n]).filter(([d]) => d.kind === k && (!q || (d.title + " " + d.about).toLowerCase().includes(q)));
        return list.length ? `<h3 class="unit">${t}</h3><div class="docgrid">${list.map(([d, n]) => docCard(d, n)).join("")}</div>` : ""; }).join("") || empty("Nothing matches your search.");
    } else {
      const g = LG[sel], ds = LIB.decks.filter(d => d.group === sel && (!q || (d.code + " " + deckTitle(d)).toLowerCase().includes(q)));
      const total = sel === "F" ? 4 : ACTS.filter(a => a.group === sel && !/^F-/.test(a.code)).length, have = LIB.decks.filter(d => d.group === sel).length;
      body = `<div class="lhead" style="--c:${g.color};--l:${g.light}"><b>${esc(g.name)}</b><span>${have} of ${total} activities have a presentation</span></div>` +
        (ds.length ? `<div class="dgrid">${ds.map(deckCard).join("")}</div>` : empty(q ? "No presentation matches your search." : "No presentations for this age group yet."));
    }
    return head("Curriculum", "Pick an age group, then tap a presentation to open it full screen.",
        `<label class="search">${ic("search")}<input type="search" id="libQ" placeholder="${sel === "DOCS" ? "Search documents" : "Search presentations"}" value="${esc(UI.libQ || "")}"></label>`) +
      gtabs(tabs, sel, "data-libg") + body;
  }

  /* ---------- HARDWARE ---------- */
  function hwCard(a) {
    const g = GROUPS[a.group], gr = groupsOf(a.code), kit = kitOf(a.code).filter(k => k.n && lineTotal(k, a.code) > 0);
    return `<div class="hwcard" style="--c:${g.color};--l:${g.light}">
      <div class="hwhead"><div><span class="acode">${deckOf(a.code) ? `<i class="sbadge">${ic("play")}</i>` : ""}${esc(lab(a))}</span>${fromTag(a)}<b>${esc(a.title)}</b></div>${WEEK ? statusChip(a.code) : ""}</div>
      <div class="hwsub">${UI.hwG === "WEEK" ? `${esc(g.name)} · ` : ""}${gr} groups · ${plural(kit.length, "part")}</div>
      <div class="hwlist">${kit.map(k => `<div><span>${esc(k.n)}<small>${esc(catOf(k.n).cat)}${k.b === "class" ? " · per class" : ""}</small></span><b>${lineTotal(k, a.code)}</b></div>`).join("") || `<p class="muted">No parts listed.</p>`}</div>
      <div class="hwfoot"><button class="btn" data-open="${esc(a.code)}">${noPlan() || isPlanned(a.code) || isDone(a.code) ? "Open" : "Plan"}</button>${isStudent() ? "" : `<a class="btn ghost" href="#kits" data-editkit="${esc(lab(a))}">Edit kit</a>`}<button class="btn ghost hwcopy" data-copycode="${esc(a.code)}" aria-label="Copy ${esc(lab(a))} parts list" title="Copy list">${ic("copy")}</button></div></div>`;
  }
  /* ---------- VIRTUAL LABS ---------- */
  const SIM = window.SIMS || { list: [], circuits: [], byKey: {}, forLesson: () => [] };
  const simIcon = s => s.kind === "build" ? "chip" : s.kind === "code" ? "code" : s.kind === "cad" ? "cube" : "bolt";
  const simHref = s => s.href || "sim.html?s=" + s.key;
  const simTag = s => s.kind === "build" ? "Needs internet to compile" : s.kind === "code" ? "Python in the browser · C++ online" : s.online ? "Needs internet" : "Works offline";
  function simTiles() {
    const pick = ["circuit-lab", "code-lab", "cck-dc", "blockscad"].map(k => SIM.byKey[k]).filter(Boolean);
    return `<div class="labgrid">${pick.map(s => `<a class="labtile simtile" href="${simHref(s)}" style="--sc:${s.color}"><span class="lt-ic">${ic(simIcon(s))}</span><b>${esc(s.name)}</b><small>${esc(s.about)}</small></a>`).join("")}</div>`;
  }
  function vSims() {
    const byCode = c => ACTS.find(a => lab(a) === c) || ACTS.find(a => String(a.code).startsWith(c + " "));
    const cl = SIM.byKey["circuit-lab"];
    const exChips = (SIM.circuits || []).map(c => { const a = byCode(c), g = a && GROUPS[a.group];
      return `<a class="exchip" href="circuit/#lesson=${c}" style="--c:${g ? g.color : "#2E6BE6"}"><b>${esc(c)}</b>${esc(a ? a.title : c)}</a>`; }).join("");
    const card = s => `<a class="simcard" href="${simHref(s)}" style="--sc:${s.color}">
        <span class="sim-art">${ic(simIcon(s))}<em>${s.kind === "phet" ? "PhET" : s.kind === "cad" ? "3D design" : s.kind === "code" ? "Python · C++" : "Arduino"}</em></span>
        <span class="sim-b"><b>${esc(s.name)}</b><small>${esc(s.about)}</small>
          <span class="sim-good"><i>Good for</i>${esc(s.good)}</span>
          <span class="sim-meta"><span>Ages ${esc(s.ages)}</span><span class="${s.online || s.kind === "build" ? "on" : "off"}">${esc(simTag(s))}</span></span></span></a>`;
    const phet = SIM.list.filter(s => s.kind === "phet"), cad = SIM.list.filter(s => s.kind === "cad"), code = SIM.byKey["code-lab"];
    return `${head("Virtual labs", "Simulators for trying ideas before touching real parts. Each lesson also shows the matching simulator when you open it.")}
      ${cl ? `<section class="sec t-sim"><div class="sec-h"><span class="sec-ic">${ic("chip")}</span><div><h2>Circuit Lab</h2><p>Our Arduino simulator: wire parts on a breadboard, write code, press Run.</p></div><a class="btn primary sec-link" href="circuit/">${ic("play")}Open Circuit Lab</a></div>
        <div class="clhero"><a class="clshot" href="circuit/" aria-label="Open Circuit Lab"><svg class="cl-scene" viewBox="0 0 360 210" aria-hidden="true"><defs><pattern id="clDots" width="12" height="12" patternUnits="userSpaceOnUse"><circle cx="1.5" cy="1.5" r="1.1" fill="rgba(255,255,255,.12)"/></pattern><radialGradient id="clGlow"><stop offset="0" stop-color="#FF5A5A" stop-opacity=".9"/><stop offset="1" stop-color="#FF5A5A" stop-opacity="0"/></radialGradient></defs><rect width="360" height="210" fill="url(#clDots)"/><g transform="translate(22 18)"><rect width="150" height="62" rx="6" fill="#F4F1EA"/><rect y="28" width="150" height="6" fill="#E4DED0"/><g fill="#B9B2A3"><circle cx="12" cy="10" r="1.6"/><circle cx="22" cy="10" r="1.6"/><circle cx="32" cy="10" r="1.6"/><circle cx="42" cy="10" r="1.6"/><circle cx="52" cy="10" r="1.6"/><circle cx="62" cy="10" r="1.6"/><circle cx="72" cy="10" r="1.6"/><circle cx="82" cy="10" r="1.6"/><circle cx="92" cy="10" r="1.6"/><circle cx="102" cy="10" r="1.6"/><circle cx="112" cy="10" r="1.6"/><circle cx="122" cy="10" r="1.6"/><circle cx="132" cy="10" r="1.6"/><circle cx="142" cy="10" r="1.6"/><circle cx="12" cy="20" r="1.6"/><circle cx="22" cy="20" r="1.6"/><circle cx="32" cy="20" r="1.6"/><circle cx="42" cy="20" r="1.6"/><circle cx="52" cy="20" r="1.6"/><circle cx="62" cy="20" r="1.6"/><circle cx="72" cy="20" r="1.6"/><circle cx="82" cy="20" r="1.6"/><circle cx="92" cy="20" r="1.6"/><circle cx="102" cy="20" r="1.6"/><circle cx="112" cy="20" r="1.6"/><circle cx="122" cy="20" r="1.6"/><circle cx="132" cy="20" r="1.6"/><circle cx="142" cy="20" r="1.6"/><circle cx="12" cy="42" r="1.6"/><circle cx="22" cy="42" r="1.6"/><circle cx="32" cy="42" r="1.6"/><circle cx="42" cy="42" r="1.6"/><circle cx="52" cy="42" r="1.6"/><circle cx="62" cy="42" r="1.6"/><circle cx="72" cy="42" r="1.6"/><circle cx="82" cy="42" r="1.6"/><circle cx="92" cy="42" r="1.6"/><circle cx="102" cy="42" r="1.6"/><circle cx="112" cy="42" r="1.6"/><circle cx="122" cy="42" r="1.6"/><circle cx="132" cy="42" r="1.6"/><circle cx="142" cy="42" r="1.6"/><circle cx="12" cy="52" r="1.6"/><circle cx="22" cy="52" r="1.6"/><circle cx="32" cy="52" r="1.6"/><circle cx="42" cy="52" r="1.6"/><circle cx="52" cy="52" r="1.6"/><circle cx="62" cy="52" r="1.6"/><circle cx="72" cy="52" r="1.6"/><circle cx="82" cy="52" r="1.6"/><circle cx="92" cy="52" r="1.6"/><circle cx="102" cy="52" r="1.6"/><circle cx="112" cy="52" r="1.6"/><circle cx="122" cy="52" r="1.6"/><circle cx="132" cy="52" r="1.6"/><circle cx="142" cy="52" r="1.6"/></g><g transform="translate(26 39)"><path d="M0 3h6M24 3h6" stroke="#9AA3AF" stroke-width="1.6"/><rect x="6" width="18" height="6" rx="3" fill="#E8C98A"/><rect x="10" width="2" height="6" fill="#8B4513"/><rect x="14" width="2" height="6" fill="#111"/><rect x="18" width="2" height="6" fill="#8B4513"/></g><g transform="translate(70 4)"><circle class="cl-glow" cx="8" cy="10" r="16" fill="url(#clGlow)"/><path d="M5 18v14M11 18v14" stroke="#9AA3AF" stroke-width="1.6"/><path class="cl-led" d="M1 18v-9a7 7 0 0 1 14 0v9z" fill="#E63946"/><rect x="0" y="16" width="16" height="3" rx="1" fill="#B91C1C"/></g><g transform="translate(108 30)"><rect width="18" height="18" rx="3" fill="#2B2D42"/><circle class="cl-btn" cx="9" cy="9" r="5.5" fill="#16A34A"/></g></g><g transform="translate(206 20)"><path class="cl-wave w1" d="M86 14a26 26 0 0 1 0 34" fill="none" stroke="#7DD3FC" stroke-width="2.4" stroke-linecap="round"/><path class="cl-wave w2" d="M96 6a38 38 0 0 1 0 50" fill="none" stroke="#7DD3FC" stroke-width="2.4" stroke-linecap="round"/><path class="cl-wave w3" d="M106 -2a50 50 0 0 1 0 66" fill="none" stroke="#7DD3FC" stroke-width="2.4" stroke-linecap="round"/><rect width="76" height="62" rx="5" fill="#1F57A8" stroke="#3B82F6" stroke-opacity=".35"/><circle cx="20" cy="31" r="14" fill="#C7CED9"/><circle cx="20" cy="31" r="9" fill="#2F3540"/><circle cx="20" cy="31" r="4" fill="#555"/><circle cx="56" cy="31" r="14" fill="#C7CED9"/><circle cx="56" cy="31" r="9" fill="#2F3540"/><circle cx="56" cy="31" r="4" fill="#555"/><rect x="33" y="8" width="10" height="5" rx="1" fill="#C0C6D1"/></g><g transform="translate(22 108)"><rect width="170" height="88" rx="8" fill="#0C7DA8"/><rect x="1.5" y="1.5" width="167" height="85" rx="7" fill="none" stroke="rgba(255,255,255,.15)"/><rect x="30" y="5" width="132" height="9" rx="1.5" fill="#1F2937"/><g fill="#9CA3AF"><rect x="34" y="7" width="5" height="5"/><rect x="42" y="7" width="5" height="5"/><rect x="50" y="7" width="5" height="5"/><rect x="58" y="7" width="5" height="5"/><rect x="66" y="7" width="5" height="5"/><rect x="74" y="7" width="5" height="5"/><rect x="82" y="7" width="5" height="5"/><rect x="90" y="7" width="5" height="5"/><rect x="98" y="7" width="5" height="5"/><rect x="106" y="7" width="5" height="5"/><rect x="114" y="7" width="5" height="5"/><rect x="122" y="7" width="5" height="5"/><rect x="130" y="7" width="5" height="5"/><rect x="138" y="7" width="5" height="5"/><rect x="146" y="7" width="5" height="5"/><rect x="154" y="7" width="5" height="5"/></g><rect x="-6" y="22" width="26" height="22" rx="2" fill="#C7CDD6"/><rect x="-4" y="58" width="20" height="18" rx="3" fill="#111827"/><rect x="62" y="56" width="84" height="18" rx="2" fill="#1F2937"/><g fill="#D1D5DB"><rect x="66" y="53" width="3" height="3"/><rect x="74" y="53" width="3" height="3"/><rect x="82" y="53" width="3" height="3"/><rect x="90" y="53" width="3" height="3"/><rect x="98" y="53" width="3" height="3"/><rect x="106" y="53" width="3" height="3"/><rect x="114" y="53" width="3" height="3"/><rect x="122" y="53" width="3" height="3"/><rect x="130" y="53" width="3" height="3"/><rect x="138" y="53" width="3" height="3"/></g><circle cx="78" cy="34" r="9" fill="none" stroke="#fff" stroke-width="3.5"/><circle cx="96" cy="34" r="9" fill="none" stroke="#fff" stroke-width="3.5"/><path d="M74 34h8M92 34h8M96 30v8" stroke="#fff" stroke-width="2.4"/><circle class="cl-tx" cx="40" cy="30" r="2.6" fill="#FBBF24"/><circle cx="148" cy="30" r="2.6" fill="#22C55E"/></g><g transform="translate(244 120)"><rect width="72" height="40" rx="5" fill="#374151"/><rect x="-8" y="14" width="88" height="10" rx="2" fill="#4B5563"/><circle cx="22" cy="20" r="11" fill="#E5E7EB"/><g class="cl-horn"><rect x="18" y="-14" width="8" height="38" rx="4" fill="#F9FAFB" stroke="#CBD5E1"/></g><circle cx="22" cy="20" r="3" fill="#94A3B8"/></g><g fill="none" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M82 80 V96 H80 V113" stroke="#F59E0B"/><path class="cl-flow" d="M82 80 V96 H80 V113" stroke="#FEF3C7"/><path d="M140 80 V100 H112 V113" stroke="#22C55E"/><path class="cl-flow f2" d="M140 80 V100 H112 V113" stroke="#DCFCE7"/><path d="M176 113 V100 H230 V82" stroke="#38BDF8"/><path class="cl-flow f3" d="M176 113 V100 H230 V82" stroke="#E0F2FE"/><path d="M168 113 V104 H226 V139 H236" stroke="#EF4444"/><path class="cl-flow f4" d="M168 113 V104 H226 V139 H236" stroke="#FEE2E2"/></g></svg><div class="cl-foot"><span class="cl-chip">Arduino Uno</span><span class="cl-chip esp">ESP32</span><span class="cl-chip">55+ parts</span><span class="cl-go">${ic("arrow")}</span></div></a>
          <div class="clex"><h3>Ready-made circuits for lessons <small class="muted">${(SIM.circuits || []).length} lessons, wired and coded</small></h3><div class="exchips">${exChips}</div></div></div></section>` : ""}
      ${code ? `<section class="sec t-code"><div class="sec-h"><span class="sec-ic">${ic("code")}</span><div><h2>Code Lab</h2><p>Six languages, all in the browser. Python, turtle graphics, p5.js, Processing and web pages run with no internet; C++ compiles with g++ online.</p></div><a class="btn primary sec-link" href="codelab/">${ic("play")}Open Code Lab</a></div>
        <div class="codehero"><a class="codecard" href="codelab/#python" style="--cc:#3776AB"><span class="cc-lg py">Py</span><b>Python 3</b><small>input() waits for typing, friendly error help, numpy, pandas and matplotlib plots. 19 ready-made examples from "Hello" to a perceptron.</small></a>
          <a class="codecard" href="codelab/#cpp" style="--cc:#00599C"><span class="cc-lg cpp">C++</span><b>C++ (g++ 13)</b><small>Real compiler errors with plain-English hints, an Input box for cin, and 13 examples: loops, arrays, vectors, classes, recursion.</small></a>
          <a class="codecard" href="codelab/#turtle" style="--cc:#2E8B57"><span class="cc-lg tu">Tu</span><b>Python turtle</b><small>Drawing with code: forward, right, repeat. Starts instantly and runs with no internet. 9 examples from a square to a spiral.</small></a>
          <a class="codecard" href="codelab/#p5" style="--cc:#ED225D"><span class="cc-lg p5">p5</span><b>p5.js</b><small>Creative coding in JavaScript: setup and draw, mouse and keyboard, animation. 8 examples including a clock and a catching game.</small></a>
          <a class="codecard" href="codelab/#processing" style="--cc:#0096D8"><span class="cc-lg pr">Pr</span><b>Processing</b><small>The same sketches in Processing's Java style, for anyone following the older syllabus. 8 examples that mirror the p5 ones.</small></a>
          <a class="codecard" href="codelab/#web" style="--cc:#E34F26"><span class="cc-lg web">&lt;&gt;</span><b>Web pages</b><small>HTML, CSS and JavaScript in three files with a live preview. 6 examples: a profile page, a counter, a to-do list and a quiz.</small></a></div></section>` : ""}
      <section class="sec t-phet"><div class="sec-h"><span class="sec-ic">${ic("bolt")}</span><div><h2>Electricity explorers</h2><p>PhET simulations from the University of Colorado Boulder. Stored on this site, so they work without internet.</p></div></div>
        <div class="simgrid">${phet.map(card).join("")}</div></section>
      <section class="sec t-cad"><div class="sec-h"><span class="sec-ic">${ic("cube")}</span><div><h2>3D design</h2><p>Model parts with blocks, then export STL files for the 3D printer.</p></div></div>
        <div class="simgrid">${cad.map(card).join("")}</div></section>
      <p class="muted small simcredit">PhET simulations: PhET Interactive Simulations, University of Colorado Boulder, phet.colorado.edu (CC BY 4.0). BlocksCAD: blockscad3d.com (open source, GPL v3). Circuit Lab uses Wokwi Elements and AVR8js (MIT). Code Lab uses Pyodide (MPL 2.0), CodeMirror (MIT) and the Wandbox and Compiler Explorer online compilers.</p>`;
  }

  function vHardware() {
    const nw = planned();
    if (!UI.hwG || (!WEEK && UI.hwG === "WEEK")) UI.hwG = WEEK && nw.length ? "WEEK" : "LE";
    const sel = UI.hwG, q = (UI.hwQ || "").toLowerCase();
    const tabs = (WEEK ? [{ code: "WEEK", name: "This week", color: "#C98A12", light: "#FFF4DC", icon: "cal", sub: plural(nw.length, "session") }] : [])
      .concat(D.groups.map(g => ({ code: g.code, name: g.name, color: g.color, light: g.light, sub: "Ages " + g.ages })));
    let list, sub = "";
    if (sel === "WEEK") list = nw;
    else {
      const all = ACTS.filter(a => a.group === sel).concat(extras().filter(a => a.group === sel));
      const ph = UI.hwPh[sel] || (UI.hwPh[sel] = "Foundation");
      sub = `<div class="tabs">${PHASES.map(p => `<button class="${!q && ph === p ? "on" : ""}" data-hwph="${p}">${p}<em>${all.filter(a => phaseOf(a) === p).length}</em></button>`).join("")}</div>`;
      list = all.filter(a => q ? hayOf(a).includes(q) : phaseOf(a) === ph);
    }
    if (q && sel === "WEEK") list = list.filter(a => hayOf(a).includes(q));
    return head("Hardware", `Parts each activity needs. Totals use each session's number of groups (default ${S.defaultGroups}).`,
        WEEK ? `<a class="btn primary" href="#print">${ic("print")}Print lists</a>` : "") +
      gtabs(tabs, sel, "data-hwg") +
      `<div class="gtools">${sub || "<span></span>"}<label class="search">${ic("search")}<input type="search" id="hwQ" placeholder="Search activities or parts" aria-label="Search activities or parts" value="${esc(UI.hwQ || "")}"></label></div>` +
      (list.length ? `<div class="hwgrid">${list.map(hwCard).join("")}</div>` : empty(sel === "WEEK" ? "Nothing planned this week yet." : "Nothing matches your search.", sel === "WEEK" ? `<a class="btn primary" href="#home">Start planning</a>` : ""));
  }

  /* ---------- the robot, used wherever we have to wait ----------
     The mascot is already drawn in the sidebar, so it is cloned rather than
     duplicated: one logo, one place to change it. */
  let ROBO = "";
  function roboHTML() {
    if (!ROBO) { const r = document.querySelector(".brand .robo"); ROBO = r ? r.outerHTML : ""; }
    return ROBO;
  }
  /* No caption and no progress bar: the robot alone says "working". The
     wrapper spans are what the animation hangs on - rings, orbiting dots,
     the hop and the shadow that shrinks as it leaves the ground. */
  function roboBlock() {
    return `<div class="robobox"><span class="robobot">` +
      `<span class="roboglow"></span>` +
      `<span class="roboorbit"><i></i><i></i><i></i></span>` +
      `<span class="robobody">${roboHTML()}</span>` +
      `<span class="roboshadow"></span>` +
      `</span></div>`;
  }

  const BUSY = { el: null, n: 0, at: 0, t: null };
  function busyEl() {
    if (BUSY.el) return BUSY.el;
    const d = document.createElement("div");
    d.className = "busy"; d.id = "busy"; d.setAttribute("aria-hidden", "true");
    document.body.appendChild(d); BUSY.el = d; return d;
  }
  /* Shown only once the wait is long enough to notice. A robot that flashes for
     80 ms on every click is worse than no robot at all. */
  function busy(label, sub) {
    BUSY.n++;
    const el = busyEl();
    el.innerHTML = roboBlock();
    el.setAttribute("aria-label", (label || "Loading") + (sub ? ". " + sub : ""));
    if (BUSY.n === 1 && !BUSY.t) {
      BUSY.t = setTimeout(() => { BUSY.t = null; if (BUSY.n > 0) { el.classList.add("on"); BUSY.at = Date.now(); } }, 200);
    }
  }
  function idle() {
    BUSY.n = Math.max(0, BUSY.n - 1);
    if (BUSY.n > 0) return;
    if (BUSY.t) { clearTimeout(BUSY.t); BUSY.t = null; return; }   // never became visible
    const el = BUSY.el; if (!el || !el.classList.contains("on")) return;
    /* once it is up, hold it long enough for the animation to play through
       rather than flashing past */
    const left = Math.max(0, 1000 - (Date.now() - BUSY.at));
    setTimeout(() => { if (BUSY.n === 0) el.classList.remove("on"); }, left);
  }

  /* ---------- PDF VIEWER (PDF.js from cdnjs; falls back to the browser's own viewer) ---------- */
  const PDFJS = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/";
  let pdfReady = null;
  function loadPdfJs() {
    if (window.pdfjsLib) return Promise.resolve(window.pdfjsLib);
    return pdfReady || (pdfReady = new Promise((res, rej) => { const sc = document.createElement("script"); sc.src = PDFJS + "pdf.min.js";
      sc.onload = () => { window.pdfjsLib.GlobalWorkerOptions.workerSrc = PDFJS + "pdf.worker.min.js"; res(window.pdfjsLib); };
      sc.onerror = () => { pdfReady = null; rej(new Error("pdf.js")); }; document.head.appendChild(sc); }));
  }
  const V = { doc: null, page: 1, n: 0, mode: "slides", file: "", tok: 0, open: false, deck: "", args: null };
  /* a placeholder the shape of what is coming, so the stage never sits empty */
  const skel = mode => `<div class="vskel ${mode === "slides" ? "slide" : "page"}" aria-label="Loading"><span></span></div>`;
  function vFail(title, msg, file) {
    const st = $("#vStage"); if (!st) return;
    st.innerHTML = `<div class="vfail" role="alert">${ic("wifi0")}<b>${esc(title)}</b><p>${esc(msg)}</p><div class="vbtns"><button class="vb" data-vretry>${ic("loop")}<span>Try again</span></button>${file ? `<a class="vb" href="${esc(file)}" target="_blank" rel="noopener">${ic("ext")}<span>Open the file directly</span></a>` : ""}</div></div>`;
  }
  async function openViewer(file, title, mode, color, sub, vcode, start) {
    Object.assign(V, { doc: null, page: start > 1 ? start : 1, n: 0, mode, file, open: true, deck: mode === "slides" ? vcode || "" : "", args: [file, title, mode, color, sub, vcode, start] });
    const el = $("#viewer"); el.style.setProperty("--c", color || "#F5B83D");
    el.innerHTML = `<div class="vbar"><div class="vt"><b>${esc(title)}</b><span>${esc(sub || "")}<span id="vCount"></span></span></div>
      <div class="vbtns">${mode === "slides" ? `<button class="vb" data-vgo="-1" aria-label="Previous">${ic("left")}</button><button class="vb" data-vgo="1" aria-label="Next">${ic("right")}</button>` : ""}
        ${vcode && vidOf(vcode) ? `<button class="vb wide vred" data-video="${esc(vcode)}">${ic("play")}<span>Video</span></button>` : ""}
        ${mode === "slides" ? `<button class="vb" data-vhelp aria-label="Keyboard shortcuts" title="Keyboard shortcuts (?)">${ic("help")}</button>` : ""}
        <button class="vb wide" data-vfs>${ic("expand")}<span>Full screen</span></button>
        <a class="vb" href="${esc(file)}" download aria-label="Download" title="Download">${ic("down")}</a>
        <a class="vb" href="${esc(file)}" target="_blank" rel="noopener" aria-label="Open in new tab" title="Open in new tab">${ic("ext")}</a>
        <button class="vb close" data-vclose aria-label="Close">${ic("x")}</button></div></div>
      <div class="vstage ${mode === "slides" ? "slides" : "scroll"}" id="vStage">${skel(mode)}</div>
      <div class="vhelp" id="vHelp" hidden><b>Keys</b><span><kbd>→</kbd> <kbd>Space</kbd> next slide</span><span><kbd>←</kbd> previous slide</span><span><kbd>Home</kbd> <kbd>End</kbd> first and last</span><span><kbd>F</kbd> full screen</span><span><kbd>Esc</kbd> close</span><span>On a phone: swipe, or tap the sides</span></div>
      ${mode === "slides" ? `<button class="vzone l" data-vgo="-1" aria-label="Previous slide"></button><button class="vzone r" data-vgo="1" aria-label="Next slide"></button>` : ""}
      <div class="vprog"><i id="vProg"></i></div>`;
    document.body.classList.add("viewer-open");
    if (!navigator.onLine && !window.pdfjsLib) return vFail("You're offline", "Slides need the internet the first time they open. Connect and try again.", file);
    let lib;
    try { lib = await loadPdfJs(); } catch (err) {
      /* the PDF reader could not load (a blocked CDN, say): the browser's own viewer still works */
      if (V.file !== file) return;
      $("#vStage").innerHTML = `<iframe class="vframe" src="${esc(file)}#view=Fit" title="${esc(title)}"></iframe>`; return;
    }
    try {
      const doc = await lib.getDocument(file).promise;
      if (V.file !== file || !V.open) return;
      V.doc = doc; V.n = doc.numPages; if (V.page > V.n) V.page = 1;
      if (mode === "slides") { renderSlide(); if (V.page > 1) toast(`Back at slide <b>${V.page}</b>. Press Home to start again.`); } else renderScroll();
    } catch (err) {
      if (V.file !== file) return;
      vFail(navigator.onLine ? "This file didn't load" : "You're offline", navigator.onLine ? "It may have moved, or the connection dropped half way." : "Connect to the internet and try again.", file);
    }
  }
  function vCounter() { const c = $("#vCount"), p = $("#vProg"); if (c) c.textContent = V.mode === "slides" ? ` · Slide ${V.page} of ${V.n}` : ` · ${V.n} pages`; if (p) p.style.width = (V.mode === "slides" ? 100 * V.page / V.n : 100) + "%"; }
  async function renderSlide() {
    if (!V.doc) return; const tok = ++V.tok, st = $("#vStage"); vCounter();
    const page = await V.doc.getPage(V.page); if (tok !== V.tok) return;
    const W = st.clientWidth - 16, H = st.clientHeight - 16, v1 = page.getViewport({ scale: 1 }), sc = Math.min(W / v1.width, H / v1.height);
    const dpr = Math.min(window.devicePixelRatio || 1, 2), vp = page.getViewport({ scale: sc * dpr }), c = document.createElement("canvas");
    c.width = Math.floor(vp.width); c.height = Math.floor(vp.height); c.style.width = Math.floor(vp.width / dpr) + "px"; c.style.height = Math.floor(vp.height / dpr) + "px";
    await page.render({ canvasContext: c.getContext("2d"), viewport: vp }).promise; if (tok !== V.tok) return;
    st.replaceChildren(c);
  }
  function renderScroll() {
    const st = $("#vStage"); st.innerHTML = ""; vCounter();
    const io = new IntersectionObserver(es => es.forEach(e => { if (!e.isIntersecting || e.target.dataset.done) return; e.target.dataset.done = 1; drawPage(e.target); }), { root: st, rootMargin: "600px 0px" });
    for (let i = 1; i <= V.n; i++) { const d = document.createElement("div"); d.className = "vpage"; d.dataset.p = i; st.appendChild(d); io.observe(d); }
  }
  async function drawPage(box) {
    const page = await V.doc.getPage(+box.dataset.p), w = box.clientWidth, v1 = page.getViewport({ scale: 1 }), dpr = Math.min(window.devicePixelRatio || 1, 2);
    const vp = page.getViewport({ scale: (w / v1.width) * dpr }), c = document.createElement("canvas");
    c.width = Math.floor(vp.width); c.height = Math.floor(vp.height); box.style.aspectRatio = v1.width + " / " + v1.height;
    await page.render({ canvasContext: c.getContext("2d"), viewport: vp }).promise; box.replaceChildren(c);
  }
  function goSlide(n) { if (!V.doc || V.mode !== "slides") return; const p = Math.max(1, Math.min(V.n, n)); if (p !== V.page) { V.page = p; renderSlide(); if (V.deck) { PR.slide[V.deck] = p; savePr(); } } }
  function closeViewer() { V.open = false; V.doc = null; V.tok++; document.body.classList.remove("viewer-open"); $("#viewer").innerHTML = ""; if (document.fullscreenElement) document.exitFullscreen().catch(() => {}); }
  function toggleFs() { const el = $("#viewer"); if (document.fullscreenElement) document.exitFullscreen(); else if (el.requestFullscreen) el.requestFullscreen().catch(() => {}); else if (el.webkitRequestFullscreen) el.webkitRequestFullscreen(); }
  let rsT; const reflow = () => { clearTimeout(rsT); rsT = setTimeout(() => { if (V.open && V.mode === "slides") renderSlide(); }, 120); };
  window.addEventListener("resize", reflow); document.addEventListener("fullscreenchange", reflow);
  function openDeck(code) { const d = DECK[code]; if (!d) return; const g = LG[d.group]; openViewer(d.file, `${d.code} · ${deckTitle(d)}`, "slides", g.color, g.name, d.code, PR.slide[d.code] || 1); }
  function openVideo(code) {
    const v = vidOf(code); if (!v) return;
    const c = String(code).split("@")[0].split(" ")[0], d = DECK[c], g = d ? LG[d.group] : null;
    Object.assign(V, { doc: null, page: 1, n: 0, mode: "video", file: "", open: true }); V.tok++;
    const el = $("#viewer"); el.style.setProperty("--c", g ? g.color : "#E63946");
    el.innerHTML = `<div class="vbar"><div class="vt"><b>${esc(v.title)}</b><span>${esc(v.channel)} · about ${v.mins} minutes${d ? " · for " + esc(c) : ""}</span></div>
      <div class="vbtns">${d ? `<button class="vb wide" data-view="${esc(c)}">${ic("book")}<span>Slides</span></button>` : ""}
        <button class="vb wide" data-vfs>${ic("expand")}<span>Full screen</span></button>
        <a class="vb" href="https://youtu.be/${esc(v.id)}" target="_blank" rel="noopener" aria-label="Open on YouTube" title="Open on YouTube">${ic("ext")}</a>
        <button class="vb close" data-vclose aria-label="Close">${ic("x")}</button></div></div>
      <div class="vstage video" id="vStage">${!navigator.onLine ? "" : `<div class="vvideo"><iframe src="https://www.youtube-nocookie.com/embed/${esc(v.id)}?autoplay=1&rel=0&modestbranding=1" title="${esc(v.title)}" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe></div>`}</div>`;
    document.body.classList.add("viewer-open");
    V.args = ["video", code];
    if (!navigator.onLine) vFail("Videos need the internet", d ? "You can still open the slides, which work once they have been opened online." : "Connect and try again.", "");
  }
  let tx = null;
  document.addEventListener("touchstart", e => { if (V.open && V.mode === "slides") tx = e.touches[0].clientX; }, { passive: true });
  document.addEventListener("touchend", e => { if (tx == null) return; const dx = e.changedTouches[0].clientX - tx; tx = null; if (Math.abs(dx) > 50) goSlide(V.page + (dx < 0 ? 1 : -1)); }, { passive: true });

  /* ---------- COPY A PARTS LIST ----------
     Plain text, ready to paste into WhatsApp or an email to the lab. */
  function copyText(text, what) {
    const done = () => toast(`${what} copied`), fail = () => toast("Couldn't copy here. Select the list and copy it by hand.");
    if (navigator.clipboard && window.isSecureContext) return navigator.clipboard.writeText(text).then(done, fail);
    const t = document.createElement("textarea"); t.value = text; t.style.position = "fixed"; t.style.opacity = "0"; document.body.appendChild(t); t.select();
    try { document.execCommand("copy") ? done() : fail(); } catch (e) { fail(); } t.remove();
  }
  function kitText(code) {
    const a = getA(code), gr = groupsOf(a.code), stu = isStudent();
    return `${lab(a)} · ${a.title} (${GROUPS[a.group].name})\n${stu ? "Per group of 2:" : gr + " groups:"}\n` +
      kitOf(a.code).filter(k => k.n).map(k => `- ${k.n} × ${stu ? (k.b === "class" ? "1 per class" : k.q) : lineTotal(k, a.code)}${k.note ? " (" + k.note + ")" : ""}`).join("\n");
  }
  function dayText(day) {
    const its = planned().filter(a => peek(a.code).day === day), rows = weekIssue(its).sort((x, y) => catIdx(x.cat) - catIdx(y.cat) || x.n.localeCompare(y.n));
    return `Kit for ${DAYFULL[day]} ${dayDate(day)}: ${its.map(a => lab(a)).join(", ")}\n` + rows.map(r => `- ${r.n} × ${r.q}`).join("\n");
  }

  /* ---------- FIRST-VISIT TIPS ----------
     One short card per page, gone for good once closed (rac-progress-v1). */
  const HINTS = {
    homeS: "Open a lesson to see its goal, the parts you need and the slides. Tick “I've finished this lesson” and your progress fills up.",
    homeT: "Take attendance from the button at the top. Switch to Student to see the page the way a student does.",
    attendance: "Import your class list from Excel once. Names stay in this browser only and never go to the website.",
    group: "Switch between Cards and Roadmap, or filter the lessons by topic, level or a part you have on the table.",
    curriculum: "Tap a presentation to show it full screen. Use the arrow keys or swipe; it remembers the slide you stopped on.",
    hardware: "Search for a part, like “servo”, to find every lesson that uses it. The copy button puts a list on your clipboard.",
    week: "Tap “Add session” under a day. Tick “Repeat every week” and next week fills itself in one click.",
    sims: "Every lesson also shows its matching simulator when you open it.",
  };
  function hintCard(r) {
    const k = GROUPS[r] ? "group" : r, t = HINTS[k === "home" ? (isStudent() ? "homeS" : "homeT") : k];
    if (!t || PR.hints[k]) return "";
    return `<div class="hintcard" role="note">${ic("bulb")}<p>${t}</p><button class="hint-x" data-hintx="${k}" aria-label="Close this tip">${ic("x")}</button></div>`;
  }

  /* ---------- ATTENDANCE ----------
     Who came to each club class and what was taught. Kept in this browser
     only, under its own key (rac-attendance-v1), with its own backup file:
     the club's student list is never written into the website's files,
     because the site is public. The class list comes from the Excel sheet
     the club already keeps; only the Name and Class columns are read. */
  const AKEY = "rac-attendance-v1";
  const AGROUPS = [
    { code: "G1", name: "Grade 1–5", total: 8, color: "var(--tr-le)", light: "var(--tr-le-tint)" },
    { code: "G2", name: "Grade 6–8", total: 16, color: "var(--tr-jm)", light: "var(--tr-jm-tint)" },
    { code: "G3", name: "IG · Matric · FSc · A level", total: 16, color: "var(--tr-yi)", light: "var(--tr-yi-tint)" },
  ];
  const AG = Object.fromEntries(AGROUPS.map(g => [g.code, g]));
  const AT = (() => { const b = { v: 1, totals: {}, students: [], classes: [], lastBackup: "" };
    try { const x = JSON.parse(localStorage.getItem(AKEY) || "null"); if (x && x.v === 1) return Object.assign(b, x); } catch (e) { } return b; })();
  function saveAt() { try { localStorage.setItem(AKEY, JSON.stringify(AT)); } catch (e) { toast("Could not save attendance in this browser. Download a backup."); } }
  const atTotal = gc => +AT.totals[gc] || AG[gc].total;
  const uid = () => Math.random().toString(36).slice(2, 10);
  /* the club's three groups, read from the Class column: 1-5, 6-8, and
     everything from 9 up (Matric/SSC, IG, FSc, AS/A level, O level) */
  function groupFromClass(cls) {
    const c = String(cls || "").toUpperCase().replace(/[\s.\-]/g, "");
    if (/^(IG|FSC|FA|ICS|AS|A2|ALEVEL|OLEVEL|SSC|HSSC|MATRIC|GRADE(9|10|11|12))/.test(c)) return "G3";
    const n = parseInt(c.replace(/^(GRADE|CLASS)/, ""), 10);
    return n >= 1 && n <= 5 ? "G1" : n >= 6 && n <= 8 ? "G2" : n >= 9 ? "G3" : "";
  }
  const AUI = { g: "", date: "", topics: [], marks: {}, editing: "", tq: "", newName: "", newCls: "" };
  const todayIso = () => iso(new Date());
  const studentsOf = gc => AT.students.filter(s => s.group === gc).sort((a, b) => a.name.localeCompare(b.name));
  const classesOf = gc => AT.classes.filter(c => c.group === gc).sort((a, b) => a.date.localeCompare(b.date));
  function startDraft(gc, cls) {
    AUI.g = gc; AUI.editing = cls ? cls.id : ""; AUI.date = cls ? cls.date : todayIso(); AUI.topics = cls ? cls.topics.slice() : []; AUI.tq = "";
    AUI.marks = {}; studentsOf(gc).forEach(s => { AUI.marks[s.id] = cls ? (cls.marks[s.id] || "") : "p"; });
  }
  const topicName = c => { const a = BYCODE[c]; return a ? `${lab(a)} · ${a.title}` : c; };

  /* ----- reading the Excel sheet in the browser (an .xlsx is a zip of XML files) ----- */
  async function unzip(buf) {
    const v = new DataView(buf), u8 = new Uint8Array(buf), out = {};
    let e = buf.byteLength - 22; while (e >= 0 && v.getUint32(e, true) !== 0x06054b50) e--;
    if (e < 0) throw new Error("not a zip");
    let p = v.getUint32(e + 16, true); const n = v.getUint16(e + 10, true);
    for (let i = 0; i < n; i++) {
      const method = v.getUint16(p + 10, true), size = v.getUint32(p + 20, true), nl = v.getUint16(p + 28, true), xl = v.getUint16(p + 30, true), cl = v.getUint16(p + 32, true), off = v.getUint32(p + 42, true);
      const name = new TextDecoder().decode(u8.subarray(p + 46, p + 46 + nl));
      const start = off + 30 + v.getUint16(off + 26, true) + v.getUint16(off + 28, true), data = u8.subarray(start, start + size);
      if (/^xl\/(sharedStrings|workbook)\.xml$|^xl\/worksheets\/sheet\d+\.xml$|^xl\/_rels\/workbook\.xml\.rels$/.test(name))
        out[name] = method === 0 ? new TextDecoder().decode(data) : await new Response(new Blob([data]).stream().pipeThrough(new DecompressionStream("deflate-raw"))).text();
      p += 46 + nl + xl + cl;
    }
    return out;
  }
  async function readSheet(file) {
    if (/\.csv$/i.test(file.name)) return (await file.text()).split(/\r?\n/).map(l => l.match(/("([^"]|"")*"|[^,]*)(,|$)/g).slice(0, -1).map(c => c.replace(/,$/, "").replace(/^"|"$/g, "").replace(/""/g, '"')));
    const f = await unzip(await file.arrayBuffer()), X = s => new DOMParser().parseFromString(s, "application/xml");
    const ss = f["xl/sharedStrings.xml"] ? [...X(f["xl/sharedStrings.xml"]).getElementsByTagName("si")].map(si => [...si.getElementsByTagName("t")].map(t => t.textContent).join("")) : [];
    const sheetName = Object.keys(f).filter(k => /worksheets\/sheet\d+\.xml$/.test(k)).sort()[0];
    if (!sheetName) throw new Error("no sheet");
    return [...X(f[sheetName]).getElementsByTagName("row")].map(r => {
      const row = [];
      [...r.getElementsByTagName("c")].forEach(c => {
        const col = c.getAttribute("r").replace(/\d+/g, "").split("").reduce((t, ch) => t * 26 + ch.charCodeAt(0) - 64, 0) - 1;
        const t = c.getAttribute("t"), vEl = c.getElementsByTagName("v")[0];
        row[col] = t === "inlineStr" ? [...c.getElementsByTagName("t")].map(x => x.textContent).join("") : !vEl ? "" : t === "s" ? ss[+vEl.textContent] || "" : vEl.textContent;
      });
      return row;
    });
  }
  async function importStudents(file) {
    let rows; try { rows = await readSheet(file); } catch (e) { return toast("Couldn't read that file. Save it as .xlsx or .csv and try again."); }
    const hi = rows.findIndex(r => r && r.some(c => /^\s*(student\s*)?name\s*$/i.test(c || "")));
    if (hi < 0) return toast("No “Name” column found in that sheet.");
    const head = rows[hi].map(c => String(c || "").trim().toLowerCase()), ni = head.findIndex(h => /^(student\s*)?name$/.test(h)), ci = head.findIndex(h => /^(class|grade|section)/.test(h));
    let added = 0, kept = 0;
    rows.slice(hi + 1).forEach(r => {
      const name = String((r || [])[ni] || "").replace(/\s+/g, " ").trim(), cls = ci >= 0 ? String(r[ci] || "").trim() : "";
      if (!name || /^name$/i.test(name)) return;
      const have = AT.students.find(s => s.name.toLowerCase() === name.toLowerCase() && s.cls.toLowerCase() === cls.toLowerCase());
      if (have) { kept++; return; }
      AT.students.push({ id: uid(), name, cls, group: groupFromClass(cls) }); added++;
    });
    saveAt(); if (AUI.g) startDraft(AUI.g); render();
    const unsure = AT.students.filter(s => !s.group).length;
    toast(`${plural(added, "student")} added${kept ? `, ${kept} already on the list` : ""}${unsure ? `. ${unsure} need a group` : ""}`);
  }

  /* ----- the page ----- */
  function attendanceHome() {
    const n = AT.students.length;
    if (!n) return `<section class="sec t-week"><div class="sec-h"><span class="sec-ic">${ic("users")}</span><div><h2>Attendance</h2><p>Import your class list once, then mark each class in a few taps.</p></div><a class="sec-link" href="#attendance">Set up ${ic("arrow")}</a></div></section>`;
    return `<section class="sec t-week"><div class="sec-h"><span class="sec-ic">${ic("users")}</span><div><h2>Attendance</h2><p>${plural(n, "student")} · saved in this browser only</p></div><a class="sec-link" href="#attendance">Open ${ic("arrow")}</a></div>
      <div class="atgrid">${AGROUPS.map(g => { const cs = classesOf(g.code), last = cs[cs.length - 1], st = studentsOf(g.code).length;
        return `<a class="atcard" href="#attendance" data-atgo="${g.code}" style="--c:${g.color};--l:${g.light}"><span class="atcard-h"><b>${esc(g.name)}</b><small>${plural(st, "student")}</small></span>
          <span class="atcount"><b>${cs.length}</b> of ${atTotal(g.code)} classes</span><span class="bar"><i style="width:${Math.min(100, 100 * cs.length / atTotal(g.code))}%"></i></span>
          <small class="muted">${last ? `Last: ${fmt(new Date(last.date + "T00:00:00"), { day: "numeric", month: "short" })}${last.topics.length ? " · " + esc(topicName(last.topics[0])) : ""}` : "No classes yet"}</small></a>`; }).join("")}</div></section>`;
  }
  function vAttendance() {
    const head0 = head("Attendance", "Mark who came and what you taught. Everything here is saved in this browser only.",
      `<label class="btn file">${ic("down")}Import class list<input type="file" id="atImport" accept=".xlsx,.csv"></label><button class="btn" data-at="export">${ic("sheet")}Register (Excel)</button>`);
    const bk = AT.lastBackup ? Math.floor((Date.now() - new Date(AT.lastBackup)) / 864e5) : -1;
    const backupBar = `<div class="atbackup ${AT.classes.length && (bk < 0 || bk > 7) ? "warn" : ""}">${ic("box")}<span>${AT.classes.length && (bk < 0 || bk > 7) ? `<b>${bk < 0 ? "No attendance backup yet." : `Last backup ${bk} days ago.`}</b> ` : ""}Attendance lives in this browser only. Download a backup each week, and load it on another computer.</span>
      <button class="btn" data-at="backup">Download backup</button><label class="btn file">Load backup<input type="file" id="atRestore" accept=".json,application/json"></label></div>`;
    if (!AT.students.length) return head0 + `<div class="card atempty">${empty("No students yet. Import the club's Excel sheet: only the Name and Class columns are read, and the names stay in this browser.",
      `<label class="btn primary big file">${ic("down")}Import class list (.xlsx)<input type="file" id="atImport2" accept=".xlsx,.csv"></label>`)}
      <form class="atadd" data-atform><input id="atNewName" placeholder="Or add one student: name" aria-label="Student name"><input id="atNewCls" placeholder="Class, e.g. 5A or IG II" aria-label="Class"><button class="btn" type="submit">${ic("plus")}Add</button></form></div>` + backupBar;
    if (!AUI.g || !AG[AUI.g]) startDraft(AT.students.some(s => s.group === "G1") ? "G1" : AT.students.find(s => s.group) ? AT.students.find(s => s.group).group : "G1");
    const g = AG[AUI.g], list = studentsOf(g.code), cs = classesOf(g.code), unsure = AT.students.filter(s => !s.group);
    const tabs = `<div class="gtabs attabs">${AGROUPS.map(x => { const n = classesOf(x.code).length;
      return `<button class="gtab ${x.code === g.code ? "on" : ""}" data-atg="${x.code}" style="--c:${x.color};--l:${x.light}"><span class="gtab-code">${x.code.slice(1)}</span><span class="gtab-txt"><b>${esc(x.name)}</b><small>${n} of ${atTotal(x.code)} classes · ${plural(studentsOf(x.code).length, "student")}</small></span></button>`; }).join("")}</div>`;
    const presentN = list.filter(s => AUI.marks[s.id] === "p").length, num = AUI.editing ? cs.findIndex(c => c.id === AUI.editing) + 1 : cs.length + 1;
    const tq = AUI.tq.toLowerCase();
    const toks = tq.split(/\s+/).filter(Boolean);
    const sugg = toks.length ? ACTS.filter(a => !AUI.topics.includes(a.code) && toks.every(t => hayOf(a).includes(t))).sort((x, y) => (y.code.toLowerCase().startsWith(tq) - x.code.toLowerCase().startsWith(tq)) || (toks.every(t => y.title.toLowerCase().includes(t)) - toks.every(t => x.title.toLowerCase().includes(t)))).slice(0, 8) : [];
    const take = `<div class="card attake" style="--c:${g.color};--l:${g.light}">
      <div class="attake-h"><div><span class="acode">${AUI.editing ? "Editing" : "New class"} · ${esc(g.name)}</span><h2>Class ${num} of ${atTotal(g.code)}</h2>${num > atTotal(g.code) ? `<small class="atover">That's more than the ${atTotal(g.code)} planned classes. It still counts.</small>` : ""}</div>
        <label class="atdate"><span>Date</span><input type="date" id="atDate" value="${esc(AUI.date)}"></label></div>
      <div class="m-sec"><label>Today's topics <i>pick from any age group</i></label>
        <div class="attopics">${AUI.topics.map(c => `<span class="attopic">${esc(topicName(c))}<button data-atuntopic="${esc(c)}" aria-label="Remove ${esc(c)}">${ic("x")}</button></span>`).join("") || `<small class="muted">No topic yet.</small>`}</div>
        <label class="search attq">${ic("search")}<input type="search" id="atTopicQ" placeholder="Search lessons: code, title or topic (e.g. JM-04, servo, traffic)" value="${esc(AUI.tq)}" aria-label="Search lessons to add as a topic" autocomplete="off"></label>
        <div class="atsugg" id="atSugg">${sugg.map(a => `<button class="prow" data-attopic="${esc(a.code)}" style="--c:${GROUPS[a.group].color};--l:${GROUPS[a.group].light}"><span class="acode">${esc(lab(a))}</span><span class="nt">${esc(a.title)}<small>${esc(GROUPS[a.group].name)} · ${esc(a.unit)}</small></span><span class="nplan">Add</span></button>`).join("")}</div></div>
      <div class="m-sec"><label>Students <i>${presentN} present · ${list.length - presentN} absent</i><span class="atall"><button class="linkbtn navy" data-atall="p">All present</button><button class="linkbtn navy" data-atall="a">All absent</button></span></label>
        ${list.length ? `<div class="atlist">${list.map(s => { const m = AUI.marks[s.id];
          return `<div class="atrow"><span class="atname"><b>${esc(s.name)}</b><small>${esc(s.cls)}</small></span><span class="atpa" role="group" aria-label="${esc(s.name)}"><button class="p ${m === "p" ? "on" : ""}" data-atmark="${s.id}" data-v="p" aria-pressed="${m === "p"}">Present</button><button class="a ${m === "a" ? "on" : ""}" data-atmark="${s.id}" data-v="a" aria-pressed="${m === "a"}">Absent</button></span></div>`; }).join("")}</div>`
          : `<p class="muted">No students in this group yet. Import the class list, or set a student's group below.</p>`}</div>
      <div class="m-foot atfoot">${AUI.editing ? `<button class="btn danger" data-at="delclass">Delete this class</button><button class="btn" data-at="cancel">Cancel</button>` : "<span></span>"}<button class="btn primary big" data-at="save" ${list.length ? "" : "disabled"}>${ic("check")}${AUI.editing ? "Save changes" : "Save attendance"}</button></div></div>`;
    const held = cs.length;
    const history = `<div class="card"><div class="panel-h"><h2>Classes so far <small class="muted">${held} of ${atTotal(g.code)}</small></h2>
        <label class="attotal">Planned classes <input type="number" min="1" max="60" id="atTotal" value="${atTotal(g.code)}" aria-label="Planned classes for ${esc(g.name)}"></label></div>
      ${held ? `<div class="athist">${cs.map((c, i) => { const p = Object.values(c.marks).filter(v => v === "p").length, a = Object.values(c.marks).filter(v => v === "a").length;
        return `<button class="athrow ${c.id === AUI.editing ? "on" : ""}" data-atedit="${c.id}"><span class="athn">${i + 1}</span><span class="atht"><b>${fmt(new Date(c.date + "T00:00:00"), { weekday: "short", day: "numeric", month: "short" })}</b><small>${c.topics.map(t => esc(topicName(t))).join(" · ") || "No topic recorded"}</small></span><span class="athc"><em class="ok">${p}</em><em class="no">${a}</em></span></button>`; }).join("")}</div>` : `<p class="muted">No classes recorded for this group yet.</p>`}</div>`;
    const roster = `<div class="card"><div class="panel-h"><h2>Students <small class="muted">${list.length}</small></h2></div>
      ${list.length ? `<table class="kt atroster"><thead><tr><th>Name</th><th>Class</th><th class="c">Attended</th><th class="c">%</th><th>Group</th><th></th></tr></thead><tbody>${list.map(s => {
        const mine = cs.filter(c => c.marks[s.id]), here = mine.filter(c => c.marks[s.id] === "p").length, pct = mine.length ? Math.round(100 * here / mine.length) : null;
        return `<tr><td><b>${esc(s.name)}</b></td><td>${esc(s.cls)}</td><td class="c">${here} / ${mine.length}</td><td class="c ${pct != null && pct < 75 ? "atlow" : ""}">${pct == null ? "–" : pct + "%"}</td>
          <td><select data-atgroup="${s.id}" aria-label="Group for ${esc(s.name)}">${AGROUPS.map(x => `<option value="${x.code}" ${x.code === s.group ? "selected" : ""}>${esc(x.name)}</option>`).join("")}</select></td>
          <td><button class="kdel" data-atdel="${s.id}" aria-label="Remove ${esc(s.name)}">${ic("x")}</button></td></tr>`; }).join("")}</tbody></table>` : ""}
      <form class="atadd" data-atform><input id="atNewName" placeholder="Add a student: name" aria-label="Student name"><input id="atNewCls" placeholder="Class, e.g. 5A or IG II" aria-label="Class"><button class="btn" type="submit">${ic("plus")}Add</button></form></div>`;
    const fix = unsure.length ? `<div class="warn">${plural(unsure.length, "student")} couldn't be placed from their class: ${unsure.map(s => `${esc(s.name)} <select data-atgroup="${s.id}" aria-label="Group for ${esc(s.name)}"><option value="">Pick a group</option>${AGROUPS.map(x => `<option value="${x.code}">${esc(x.name)}</option>`).join("")}</select>`).join(" · ")}</div>` : "";
    return head0 + fix + tabs + `<div class="atlayout"><div>${take}</div><div>${history}${roster}</div></div>` + backupBar;
  }
  function saveClass() {
    const list = studentsOf(AUI.g);
    if (!AUI.date) return toast("Pick the date first");
    const marks = {}; list.forEach(s => { if (AUI.marks[s.id]) marks[s.id] = AUI.marks[s.id]; });
    if (AUI.editing) { const c = AT.classes.find(x => x.id === AUI.editing); if (c) Object.assign(c, { date: AUI.date, topics: AUI.topics.slice(), marks }); }
    else AT.classes.push({ id: uid(), group: AUI.g, date: AUI.date, topics: AUI.topics.slice(), marks });
    saveAt(); const was = !!AUI.editing; startDraft(AUI.g); render();
    toast(was ? "Class updated" : `Saved: class ${classesOf(AUI.g).length} of ${atTotal(AUI.g)} for <b>${esc(AG[AUI.g].name)}</b>`);
  }
  function exportRegister() {
    const rows = [["Group", "Name", "Class"].concat(["Attended", "Classes marked", "%"])];
    AGROUPS.forEach(g => {
      const cs = classesOf(g.code); rows.push([]); rows.push([g.name, "", ""].concat(cs.map((c, i) => `Class ${i + 1} ${c.date}`)));
      rows.push(["", "Topics", ""].concat(cs.map(c => c.topics.map(topicName).join(" / "))));
      studentsOf(g.code).forEach(s => { const mine = cs.filter(c => c.marks[s.id]), here = mine.filter(c => c.marks[s.id] === "p").length;
        rows.push([g.name, s.name, s.cls].concat(cs.map(c => c.marks[s.id] === "p" ? "P" : c.marks[s.id] === "a" ? "A" : ""), [here, mine.length, mine.length ? Math.round(100 * here / mine.length) + "%" : ""])); });
    });
    download(`attendance-register-${iso(new Date())}.csv`, "﻿" + rows.map(r => r.map(v => `"${String(v).replace(/"/g, '""')}"`).join(",")).join("\n"), "text/csv");
  }
  /* attendance has its own events, kept here so the page reads in one place */
  document.addEventListener("click", e => {
    const t = e.target.closest("button, a"); if (!t || !document.body.contains(t)) return; const d = t.dataset;
    if (d.atgo) { AUI.g = d.atgo; startDraft(d.atgo); return; }
    if (route() !== "attendance") return;
    if (d.atg) { startDraft(d.atg); render(); return; }
    if (d.atmark) { AUI.marks[d.atmark] = d.v; render(); return; }
    if (d.atall) { studentsOf(AUI.g).forEach(s => { AUI.marks[s.id] = d.atall; }); render(); return; }
    if (d.attopic) { if (!AUI.topics.includes(d.attopic)) AUI.topics.push(d.attopic); AUI.tq = ""; render(); const q = $("#atTopicQ"); if (q) q.focus(); return; }
    if (d.atuntopic) { AUI.topics = AUI.topics.filter(c => c !== d.atuntopic); render(); return; }
    if (d.atedit) { const c = AT.classes.find(x => x.id === d.atedit); if (c) { startDraft(c.group, c); render(); window.scrollTo({ top: 0, behavior: "smooth" }); } return; }
    if (d.atdel) { const s = AT.students.find(x => x.id === d.atdel); if (s && confirm(`Remove ${s.name} from the list? Their past marks are kept in old classes.`)) { AT.students = AT.students.filter(x => x.id !== d.atdel); saveAt(); render(); } return; }
    switch (d.at) {
      case "save": saveClass(); break;
      case "cancel": startDraft(AUI.g); render(); break;
      case "delclass": if (confirm("Delete this class and its attendance?")) { AT.classes = AT.classes.filter(c => c.id !== AUI.editing); saveAt(); startDraft(AUI.g); render(); toast("Class deleted"); } break;
      case "backup": AT.lastBackup = new Date().toISOString(); saveAt(); download(`attendance-backup-${iso(new Date())}.json`, JSON.stringify(AT, null, 1), "application/json"); render(); break;
      case "export": exportRegister(); break;
    }
  });
  document.addEventListener("submit", e => {
    if (!e.target.matches("[data-atform]")) return; e.preventDefault();
    const name = ($("#atNewName").value || "").trim(), cls = ($("#atNewCls").value || "").trim(); if (!name) return toast("Type the student's name");
    AT.students.push({ id: uid(), name, cls, group: groupFromClass(cls) || AUI.g || "" }); saveAt(); if (AUI.g) startDraft(AUI.g, AUI.editing ? AT.classes.find(c => c.id === AUI.editing) : null); render(); toast(`${esc(name)} added`);
  });
  document.addEventListener("change", e => {
    const t = e.target; if (route() !== "attendance") return;
    if (t.id === "atImport" || t.id === "atImport2") { if (t.files[0]) importStudents(t.files[0]); t.value = ""; return; }
    if (t.id === "atRestore") { const f = t.files[0]; if (!f) return; const r = new FileReader();
      r.onload = () => { try { const x = JSON.parse(r.result); if (x.v !== 1 || !Array.isArray(x.students)) throw 0; if (confirm("Replace the attendance in this browser with this backup?")) { Object.assign(AT, { totals: {}, students: [], classes: [], lastBackup: "" }, x); saveAt(); AUI.g = ""; render(); toast("Attendance backup loaded"); } } catch (er) { toast("That file is not an attendance backup"); } };
      r.readAsText(f); t.value = ""; return; }
    if (t.id === "atDate") { AUI.date = t.value; return; }
    if (t.id === "atTotal") { const n = Math.max(1, Math.min(60, +t.value || AG[AUI.g].total)); AT.totals[AUI.g] = n; saveAt(); render(); return; }
    if (t.dataset.atgroup) { const s = AT.students.find(x => x.id === t.dataset.atgroup); if (s && t.value) { s.group = t.value; saveAt(); startDraft(AUI.g); render(); } return; }
  });
  document.addEventListener("input", e => {
    if (e.target.id !== "atTopicQ") return;
    AUI.tq = e.target.value; const pos = e.target.selectionStart; render();
    const n = $("#atTopicQ"); if (n) { n.focus(); try { n.setSelectionRange(pos, pos); } catch (er) { } }
  });

  /* ---------- STUDY BUDDY ----------
     buddy/buddy.js asks the page where it was opened from, so a question
     asked inside a lesson is answered about that lesson. */
  window.RACBuddy = { context: () => { const a = modalCode && !/^(pick|sched):/.test(modalCode) ? getA(modalCode) : null; return { lesson: a ? a.code : "", route: route() }; } };

  /* ---------- NOT FOUND ---------- */
  function vNotFound() {
    return head("Page not found", "") + empty("That page isn't here. It may have moved, or the link has a typo.",
      `<div class="btnrow nfbtns"><a class="btn primary" href="#home">${ic("home")}Home</a><a class="btn" href="#curriculum">${ic("book")}Lessons</a><a class="btn" href="circuit/">${ic("chip")}Circuit Lab</a><a class="btn" href="codelab/">${ic("code")}Code Lab</a><button class="btn" data-palette="all">${ic("search")}Search</button></div>`);
  }

  /* ---------- SETTINGS ---------- */
  function vSettings() {
    return head("Settings", "Defaults for planning and printing, and backups of your plan.") + `<div class="setgrid">
      <div class="card"><h2>Defaults</h2>
        <label class="field">Groups (pairs) per session<div class="stepper"><button data-gstep="-1" aria-label="Fewer groups">${ic("minus")}</button><b>${S.defaultGroups}</b><button data-gstep="1" aria-label="More groups">${ic("plus")}</button></div></label>
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
    if (e.target.id === "palette") { closePalette(); return; }
    const t = e.target.closest("button, a"); if (!t) { if (e.target.id === "scrim") { closeModal(); closeNav(); } return; }
    const d = t.dataset;
    if (d.pal != null) { palRun(+d.pal); return; }
    if (d.role) { PR.role = d.role; savePr(); render(); toast(d.role === "student" ? "Student view" : "Teacher view"); return; }
    if (d.track != null) { PR.track = d.track; savePr(); render(); window.scrollTo(0, 0); return; }
    if (d.vmode) { setQp("view", d.vmode === "map" ? "map" : ""); return; }
    if ("clearf" in d) { const v = qp().get("view"); history.replaceState(null, "", "#" + route() + (v ? "?view=" + v : "")); render(); return; }
    if (d.hintx) { PR.hints[d.hintx] = 1; savePr(); const h = t.closest(".hintcard"); if (h) h.remove(); return; }
    if (d.copycode) { copyText(d.copyday ? dayText(d.copyday) : kitText(d.copycode), "Parts list"); return; }
    if ("finish" in d) { const c = baseOf(lab(getA(modalCode))); if (PR.done[c]) delete PR.done[c]; else PR.done[c] = iso(new Date()); savePr(); renderModal(); render();
      if (PR.done[c]) toast(`Nice work! <b>${esc(c)}</b> is finished`); return; }
    if ("vretry" in d) { if (V.args && V.args[0] === "video") openVideo(V.args[1]); else if (V.args) openViewer(...V.args); return; }
    if ("askbuddy" in d) { if (window.StudyBuddy) window.StudyBuddy.open(); return; }
    if ("vhelp" in d) { const h = $("#vHelp"); if (h) h.hidden = !h.hidden; return; }
    if (d.palette) { openPalette(d.palette); return; }
    if (d.video) { openVideo(d.video); return; }
    if (d.view) { openDeck(d.view); return; }
    if (d.vgo) { goSlide(V.page + +d.vgo); return; }
    if ("vfs" in d) { toggleFs(); return; }
    if ("vclose" in d) { closeViewer(); return; }
    if (d.doc) { const x = LIB.docs[+d.doc]; openViewer(x.file, x.title, "doc", "#F5B83D", x.about); return; }
    if (d.dl) { const x = LIB.docs[+d.dl], l = document.createElement("a"); l.href = x.file; l.download = ""; document.body.appendChild(l); l.click(); l.remove(); toast("Downloading " + esc(x.title)); return; }
    if (d.libg) { UI.libG = d.libg; UI.libQ = ""; if (t.tagName !== "A") render(); return; }
    if (d.hwg) { UI.hwG = d.hwg; UI.hwQ = ""; render(); return; }
    if (d.hwph) { UI.hwPh[UI.hwG] = d.hwph; UI.hwQ = ""; render(); return; }
    if (d.sched) { openSched(d.sched, d.schgrp); return; }
    if (d.schday) { UI.sch.day = d.schday; renderModal(); return; }
    if (d.schg) { UI.sch.g = d.schg; UI.sch.code = suggestFor(d.schg); UI.sch.q = ""; renderModal(); return; }
    if (d.schcode) { UI.sch.code = d.schcode; renderModal(); return; }
    if (d.schstep) { UI.sch.groups = Math.max(1, Math.min(40, (+UI.sch.groups || S.defaultGroups) + +d.schstep)); renderModal(); return; }
    if ("schsave" in d) { saveSched(); return; }
    if (d.unroutine != null) { S.routine.splice(+d.unroutine, 1); save(); render(); toast("Slot removed from routine"); return; }
    if (d.open) { openModal(d.open); return; }
    if ("close" in d) { closeModal(); return; }
    if (d.mday) { const s = sess(modalCode); s.day = d.mday; setStatus(modalCode, "Next week"); save(); renderModal(); toast(`${esc(lab(getA(modalCode)))} planned for <b>${DAYFULL[d.mday]}</b>`); return; }
    if ("unplan" in d) { setStatus(modalCode, "Not started"); save(); renderModal(); return; }
    if (d.kstep) { const c = kitSheetCode(), s = sess(c); s.groups = Math.max(1, Math.min(40, groupsOf(c) + +d.kstep)); save(); render(); return; }
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
    if (d.pmode) { UI.pMode = d.pmode; if (t.tagName !== "A") render(); return; }
    if (d.pday != null) { UI.pDay = d.pday; render(); return; }
    if (d.kg) { UI.kitGroup = d.kg; UI.kitCode = ACTS.find(a => a.group === d.kg).code; render(); return; }
    if (d.kcode) { UI.kitCode = d.kcode; render(); return; }
    if (d.kstep) { const k = editableKit()[+d.i]; k.q = Math.max(0, (+k.q || 0) + +d.kstep); save(); render(); return; }
    if (d.del != null) { editableKit().splice(+d.del, 1); save(); render(); return; }
    if (d.gstep) { S.defaultGroups = Math.max(1, Math.min(40, S.defaultGroups + +d.gstep)); save(); render(); return; }
    switch (d.act) {
      case "print": window.print(); break;
      case "fillroutine": fillRoutine(); break;
      case "doneweek": { const nw = planned(); if (confirm(`Mark all ${nw.length} sessions as done?`)) { nw.forEach(a => setStatus(a.code, "Done")); save(); render(); toast("Week marked as done"); } break; }
      case "addrow": editableKit().push({ n: "", q: 1, b: "group", note: "" }); save(); render(); { const ins = document.querySelectorAll(".kn"); ins[ins.length - 1].focus(); } break;
      case "resetkit": if (confirm("Go back to the original kit?")) { delete S.kits[UI.kitCode]; save(); render(); } break;
      case "togglecat": UI.catOpen = !UI.catOpen; render(); break;
      case "addpart": { const n = $("#npName").value.trim(); if (!n) return toast("Type a part name first"); S.catalog[n] = { cat: $("#npCat").value, type: $("#npType").value, spec: "" }; save(); render(); toast("Part added"); break; }
      case "export": S.lastBackup = new Date().toISOString(); save(); download(`lab-planner-backup-${iso(new Date())}.json`, JSON.stringify(S, null, 1), "application/json"); break;
      case "csv": { const rows = [["Code", "Age group", "Phase", "Class", "Activity", "Status", "Day", "Date done", "Groups", "Time", "Section", "Notes"]];
        ALL().forEach(a => { const s = peek(a.code); rows.push([lab(a) + (a.from ? " (from " + a.from + ")" : ""), GROUPS[a.group].name, phaseOf(a), a.cls || "", a.title, s.status, s.day, s.date, groupsOf(a.code), s.time, s.section, s.notes]); });
        download(`session-log-${iso(new Date())}.csv`, "﻿" + rows.map(r => r.map(v => `"${String(v).replace(/"/g, '""')}"`).join(",")).join("\n"), "text/csv"); break; }
      case "reset": if (confirm("Delete ALL plans and kit changes in this browser?")) { S = blank(); S.weekStart = nextMonday(); save(); render(); } break;
    }
  });
  document.addEventListener("change", e => {
    const t = e.target, d = t.dataset;
    if (d.filter) { setQp(d.filter, t.value); return; }
    if (d.mf) { sess(modalCode)[d.mf] = t.value.trim(); save(); return; }
    if (d.sf) { UI.sch[d.sf] = t.value.trim(); if (d.sf === "time") renderModal(); return; }
    if (t.id === "schKeep") { UI.sch.keep = t.checked; return; }
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
    if (key === "palQ") { CMD.q = t.value; CMD.i = 0; palResults(); return; }
    if (key === "schQ") { UI.sch.q = t.value; const pos = t.selectionStart; renderModal(); const n = $("#schQ"); if (n) { n.focus(); try { n.setSelectionRange(pos, pos); } catch (er) { } } return; }
    if (key === "pickQ") { UI.pickQ = t.value; const pos = t.selectionStart; renderModal(); const n = $("#pickQ"); if (n) { n.focus(); try { n.setSelectionRange(pos, pos); } catch (er) { } } return; }
    if (!["gq", "kitQ", "catQ", "libQ", "hwQ"].includes(key)) return;
    clearTimeout(qT); qT = setTimeout(() => {
      if (key === "gq") UI.q[t.dataset.gq] = t.value; else if (key === "libQ") UI.libQ = t.value; else if (key === "hwQ") UI.hwQ = t.value; else if (key === "kitQ") UI.kitQ = t.value; else UI.catQ = t.value;
      const pos = t.selectionStart; render(); const n = key === "gq" ? document.querySelector(`[data-gq="${t.dataset.gq}"]`) : document.getElementById(key);
      if (n) { n.focus(); try { n.setSelectionRange(pos, pos); } catch (er) { } }
    }, 200);
  });
  document.addEventListener("keydown", e => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") { e.preventDefault(); if (CMD.open) closePalette(); else openPalette("all"); return; }
    if (CMD.open) {
      if (e.key === "Escape") closePalette(); else if (e.key === "ArrowDown") { e.preventDefault(); palMove(1); } else if (e.key === "ArrowUp") { e.preventDefault(); palMove(-1); } else if (e.key === "Enter") { e.preventDefault(); palRun(CMD.i); }
      return;
    }
    if (e.key === "/" && !V.open && !modalCode && !/INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName)) { e.preventDefault(); openPalette("all"); return; }
    if (V.open) {
      if (e.key === "Escape") { if (!document.fullscreenElement) closeViewer(); return; }
      if (["ArrowRight", "PageDown", " ", "Enter"].includes(e.key)) { e.preventDefault(); goSlide(V.page + 1); }
      else if (["ArrowLeft", "PageUp", "Backspace"].includes(e.key)) { e.preventDefault(); goSlide(V.page - 1); }
      else if (e.key === "Home") goSlide(1); else if (e.key === "End") goSlide(V.n); else if (e.key === "f") toggleFs();
      else if (e.key === "?") { const h = $("#vHelp"); if (h) h.hidden = !h.hidden; }
      return;
    }
    if (e.key === "Escape" && modalCode) closeModal();
    /* Tab and Shift+Tab go round the open sheet or palette rather than out behind it */
    if (e.key === "Tab") {
      const box = CMD.open ? $(".pal-box") : modalCode ? $("#modal .sheet-m") : null; if (!box) return;
      const f = focusables(box); if (!f.length) return;
      const first = f[0], last = f[f.length - 1];
      if (!box.contains(document.activeElement)) { e.preventDefault(); first.focus(); }
      else if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    } });
  /* Ctrl+P from anywhere should still give a usable sheet, so a page with
     nothing printable on it hands over to the Print lists page first. A page
     that already has a #printArea - the kit lists and every activity's
     hardware list - prints itself and must be left alone: redirecting here
     swapped the hardware list out from under the print dialog, which is why
     it came out as the empty "plan some sessions" page. */
  window.addEventListener("beforeprint", () => {
    if (document.getElementById("printArea") || !WEEK) return;
    if (route() !== "print") { location.hash = "#print"; render(); }
  });

  if (!S.weekStart) { S.weekStart = nextMonday(); save(); }
  if (!openFromHash()) render();

  /* Drop the splash once the first page is on screen. It is held for a beat so a
     fast load reads as a greeting rather than a flicker. */
  (function clearBoot() {
    const b = document.getElementById("boot"); if (!b) return;
    const go = () => {
      document.body.classList.add("booted");
      setTimeout(() => b.classList.add("gone"), 420);
    };
    const wait = Math.max(0, 1150 - performance.now());   // one full beat of the robot before the portal takes over
    requestAnimationFrame(() => requestAnimationFrame(() => setTimeout(go, wait)));
  })();
})();
