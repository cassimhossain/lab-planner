/* Robotics & AI Club Lab Planner
   Plain HTML + CSS + JavaScript. No build step, no server: works on GitHub Pages.
   Your plan is saved in this browser (localStorage). Use Settings to download / load a backup. */
(function () {
  "use strict";
  const D = window.CLUB_DATA;
  const KEY = "rac-lab-planner-v1";
  const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri"];
  const DAYFULL = { Mon: "Monday", Tue: "Tuesday", Wed: "Wednesday", Thu: "Thursday", Fri: "Friday", "": "Day not set" };
  const STATUSES = ["Not started", "Next week", "Done", "Postponed", "Cancelled"];
  const PALETTE = { LE: ["#2F8F6A", "#E8F4EE", "Little Explorers"], JM: ["#2F64C6", "#E9F0FC", "Junior Makers"], YI: ["#7350C2", "#F1ECFB", "Young Innovators"], TL: ["#C24B4B", "#FBECEC", "Tech Leaders"] };
  D.groups.forEach(g => { if (PALETTE[g.code]) { g.color = PALETTE[g.code][0]; g.light = PALETTE[g.code][1]; } });
  const GROUPS = Object.fromEntries(D.groups.map(g => [g.code, g]));
  const ACTS = D.activities;
  const BYCODE = Object.fromEntries(ACTS.map(a => [a.code, a]));
  const PHASES = ["Foundation", "Phase 1", "Phase 2"];
  const phaseOf = a => (a.phase === "Intro" ? "Foundation" : a.phase);

  /* ---------------- state ---------------- */
  const blank = () => ({ v: 1, defaultGroups: 8, name: "Qasim Mushtaq", campus: "Pak-Turk Maarif International Schools & Colleges, Chak Shahzad Campus · Robotics Lab",
    weekStart: "", sessions: {}, kits: {}, catalog: {}, saved: null });
  let S = load();
  function load() {
    try { const s = JSON.parse(localStorage.getItem(KEY) || "null"); if (s && s.v === 1) return Object.assign(blank(), s); } catch (e) { /* storage blocked */ }
    return blank();
  }
  function save() {
    S.saved = new Date().toISOString();
    try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) { toast("Could not save in this browser. Download a backup."); }
  }
  const EMPTY = { status: "Not started", day: "", time: "", section: "", groups: "", notes: "", date: "" };
  const sess = code => (S.sessions[code] = S.sessions[code] || Object.assign({}, EMPTY));
  const peek = code => S.sessions[code] || EMPTY;
  const groupsOf = code => { const g = parseInt(peek(code).groups, 10); return g > 0 ? g : S.defaultGroups; };
  const kitOf = code => S.kits[code] || BYCODE[code].kit;
  const catOf = n => S.catalog[n] || D.catalog[n] || { cat: "Other", spec: "", type: "Reusable" };
  const allParts = () => Object.assign({}, D.catalog, S.catalog);

  /* ---------------- helpers ---------------- */
  const $ = s => document.querySelector(s);
  const esc = s => String(s == null ? "" : s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  function toast(msg) { const t = $("#toast"); t.textContent = msg; t.classList.add("show"); clearTimeout(toast.h); toast.h = setTimeout(() => t.classList.remove("show"), 2200); }
  const iso = d => d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
  function nextMonday() { const d = new Date(); const add = ((8 - d.getDay()) % 7) || 7; d.setDate(d.getDate() + add); return iso(d); }
  const addDays = (isoStr, n) => { const d = new Date(isoStr + "T00:00:00"); d.setDate(d.getDate() + n); return d; };
  const fmt = (d, o) => d.toLocaleDateString("en-GB", o);
  const dayDate = day => (S.weekStart && day ? fmt(addDays(S.weekStart, DAYS.indexOf(day)), { day: "2-digit", month: "short" }) : "");
  const longDate = isoStr => (isoStr ? fmt(new Date(isoStr + "T00:00:00"), { weekday: "long", day: "2-digit", month: "short", year: "numeric" }) : "");
  const lineTotal = (k, code) => (k.b === "class" ? +k.q || 0 : (+k.q || 0) * groupsOf(code));
  const dayIdx = d => (d ? DAYS.indexOf(d) : 9);
  const catIdx = c => { const i = D.categories.indexOf(c); return i < 0 ? 99 : i; };
  const planned = () => ACTS.filter(a => peek(a.code).status === "Next week").sort((a, b) => dayIdx(peek(a.code).day) - dayIdx(peek(b.code).day) || ACTS.indexOf(a) - ACTS.indexOf(b));
  const stKey = s => s.split(" ")[0];
  const plural = (n, w) => `${n} ${w}${n === 1 ? "" : "s"}`;
  function setStatus(code, status) {
    const s = sess(code); s.status = status;
    if (status === "Done") s.date = s.date || (s.day && S.weekStart ? iso(addDays(S.weekStart, DAYS.indexOf(s.day))) : iso(new Date()));
    else s.date = "";
    if (status !== "Next week" && status !== "Done") s.day = "";
  }
  function planOn(code, day) {
    const s = sess(code);
    if (s.status === "Next week" && s.day === day) { s.status = "Not started"; s.day = ""; return false; }
    s.day = day; setStatus(code, "Next week"); return true;
  }
  function weekParts(list) { const set = new Set(); list.forEach(a => kitOf(a.code).forEach(k => { if (lineTotal(k, a.code) > 0 && k.n) set.add(k.n); })); return set.size; }

  const ICON = {
    robot: `<svg viewBox="0 0 120 90" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="34" y="26" width="52" height="40" rx="9"/><circle cx="50" cy="44" r="4.5"/><circle cx="70" cy="44" r="4.5"/><path d="M52 57h16M60 26V14"/><circle cx="60" cy="11" r="3.5"/><path d="M34 46h-9M86 46h9M46 66v12M74 66v12M14 20l5 3M106 20l-5 3M10 60h6M104 60h6"/></g></svg>`,
    gear: `<svg viewBox="0 0 60 60" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><circle cx="30" cy="30" r="13"/><circle cx="30" cy="30" r="5"/><path d="M30 10v5M30 45v5M10 30h5M45 30h5M16 16l3.5 3.5M40.5 40.5L44 44M44 16l-3.5 3.5M19.5 40.5L16 44"/></g></svg>`,
    bulb: `<svg viewBox="0 0 60 60" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M30 10a14 14 0 0 1 14 14c0 7-5 10-6 15H22c-1-5-6-8-6-15a14 14 0 0 1 14-14zM24 45h12M26 50h8"/><path d="M8 22h4M48 22h4M14 8l3 3M46 8l-3 3"/></g></svg>`,
    circuit: `<svg viewBox="0 0 160 60" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M4 40h30l6-12 8 24 6-12h22"/><circle cx="82" cy="40" r="5"/><path d="M87 40h20V14h30"/><circle cx="142" cy="14" r="5"/><rect x="100" y="34" width="14" height="12" rx="2"/></g></svg>`
  };

  /* ---------------- routing + nav ---------------- */
  const NAV = [["dashboard", "Dashboard"], ["LE", "Little Explorers"], ["JM", "Junior Makers"], ["YI", "Young Innovators"], ["TL", "Tech Leaders"], ["week", "This Week"], ["print", "Kit Lists"], ["kits", "Kits"], ["settings", "Settings"]];
  const route = () => { const r = location.hash.replace("#", "").split("/")[0]; return NAV.some(n => n[0] === r) ? r : "dashboard"; };
  function renderNav() {
    const r = route(), nw = planned();
    $("#nav").innerHTML = NAV.map(([k, label]) => {
      let badge = "";
      if (GROUPS[k]) { const n = nw.filter(a => a.group === k).length; badge = n ? `<span class="nb">${n}</span>` : ""; }
      if (k === "week" && nw.length) badge = `<span class="nb amber">${nw.length}</span>`;
      const dot = GROUPS[k] ? `<span class="dot" style="background:${GROUPS[k].color}"></span>` : "";
      return `<a href="#${k}" class="navlink ${r === k ? "active" : ""} ${k === "week" ? "sep" : ""}" style="${GROUPS[k] ? `--c:${GROUPS[k].color}` : ""}">${dot}${label}${badge}</a>`;
    }).join("");
    const act = document.querySelector(".navlink.active"); if (act && act.scrollIntoView) act.scrollIntoView({ block: "nearest", inline: "nearest" });
  }
  function renderWeekPick() {
    $("#weekStart").value = S.weekStart;
    const a = addDays(S.weekStart, 0), b = addDays(S.weekStart, 4);
    $("#wkLabel").textContent = `${fmt(a, { day: "numeric", month: "short" })} to ${fmt(b, { day: "numeric", month: "short", year: "numeric" })}`;
  }
  function shiftWeek(n) { S.weekStart = iso(addDays(S.weekStart, 7 * n)); save(); render(); }
  $("#wkPrev").addEventListener("click", () => shiftWeek(-1));
  $("#wkNext").addEventListener("click", () => shiftWeek(1));
  $("#weekStart").addEventListener("change", e => {
    let v = e.target.value; if (!v) return;
    const d = new Date(v + "T00:00:00"); d.setDate(d.getDate() - ((d.getDay() + 6) % 7)); S.weekStart = iso(d); save(); render();
  });
  $(".wk").addEventListener("click", () => { const i = $("#weekStart"); if (i.showPicker) { try { i.showPicker(); } catch (e) { i.focus(); } } else i.focus(); });

  function render() {
    renderNav(); renderWeekPick();
    const r = route(), app = $("#app");
    if (r === "dashboard") app.innerHTML = viewDashboard();
    else if (GROUPS[r]) app.innerHTML = viewGroup(r);
    else if (r === "week") app.innerHTML = viewWeek();
    else if (r === "print") app.innerHTML = viewPrint();
    else if (r === "kits") app.innerHTML = viewKits();
    else if (r === "settings") app.innerHTML = viewSettings();
    app.className = "wrap view-" + r;
  }
  window.addEventListener("hashchange", () => { render(); window.scrollTo({ top: 0 }); });

  const pageHead = (title, sub, right = "", deco = "") => `<div class="pagehead"><div><h1>${title}</h1>${sub ? `<p class="lead">${sub}</p>` : ""}</div><div class="ph-right">${right}${deco ? `<span class="deco">${deco}</span>` : ""}</div></div>`;
  const dayBtns = (code, cls = "") => { const s = peek(code); return `<div class="dayseg ${cls}">${DAYS.map(d => `<button class="dbtn ${s.status === "Next week" && s.day === d ? "on" : ""}" data-plan="${esc(code)}" data-day="${d}" title="Plan for ${DAYFULL[d]}">${d}</button>`).join("")}</div>`; };
  const statusSel = code => { const s = peek(code); return `<select class="stsel s-${stKey(s.status)}" data-status="${esc(code)}" aria-label="Status">${STATUSES.map(x => `<option ${x === s.status ? "selected" : ""}>${x}</option>`).join("")}</select>`; };

  /* ---------------- DASHBOARD ---------------- */
  function viewDashboard() {
    const nw = planned(), core = ACTS.filter(a => a.phase === "Phase 1" || a.phase === "Phase 2");
    const done = core.filter(a => peek(a.code).status === "Done").length;
    const pairs = nw.reduce((t, a) => t + groupsOf(a.code), 0);
    const kpis = [
      ["Sessions planned", nw.length, nw.length ? `${nw.filter(a => !peek(a.code).day).length ? "some need a day" : "all have a day"}` : "pick days below"],
      ["Groups (pairs)", pairs, `about ${pairs * 2} students`],
      ["Different parts", weekParts(nw), "to pack this week"],
      ["Classes done", done, `of ${core.length} in Phase 1 and 2`]];
    const strip = DAYS.map(d => {
      const items = nw.filter(a => peek(a.code).day === d);
      return `<div class="sday"><div class="sday-h"><b>${d}</b><span>${dayDate(d)}</span></div>${items.map(a => `<a class="schip" href="#week" style="--c:${GROUPS[a.group].color}"><b>${esc(a.code)}</b> ${esc(a.title)}</a>`).join("") || `<div class="sfree">Free</div>`}</div>`;
    }).join("");
    const upnext = D.groups.map(g => {
      const list = ACTS.filter(a => a.group === g.code && peek(a.code).status === "Not started").slice(0, 3);
      const all = ACTS.filter(a => a.group === g.code && (a.phase === "Phase 1" || a.phase === "Phase 2"));
      const dn = all.filter(a => peek(a.code).status === "Done").length;
      return `<div class="upcard" style="--c:${g.color};--l:${g.light}">
        <div class="up-h"><a href="#${g.code}"><span class="dot"></span>${esc(g.name)}</a><span class="muted">Ages ${esc(g.ages)}</span></div>
        <div class="bar"><i style="width:${Math.round(100 * dn / all.length)}%"></i></div><div class="tiny muted">${dn} of ${all.length} classes done</div>
        ${list.map(a => `<div class="upitem"><div><span class="code">${esc(a.code)}</span> ${esc(a.title)}</div>${dayBtns(a.code, "sm")}</div>`).join("") || `<div class="muted small">Everything is planned or done.</div>`}
        <a class="more" href="#${g.code}">All ${esc(g.name)} activities →</a></div>`;
    }).join("");
    return pageHead("Dashboard", "Plan the coming week, then print the hardware lists for the lab.",
      `<a class="btn" href="#week">This Week</a><a class="btn primary" href="#print">Print kit lists</a>`, ICON.robot) +
      `<div class="kpis">${kpis.map(([t, v, s]) => `<div class="kpi"><span>${t}</span><b>${v}</b><small>${s}</small></div>`).join("")}</div>
      <div class="section-h"><h2>This week</h2><a href="#week">Open timetable →</a></div>
      <div class="strip">${strip}</div>
      <div class="section-h"><h2>Up next for each age group</h2><span class="muted small">Tap a day to plan it</span></div>
      <div class="upgrid">${upnext}</div>`;
  }

  /* ---------------- AGE GROUP PAGE ---------------- */
  const UI = { phase: {}, q: {}, only: {}, open: new Set(), pMode: "session", pDay: "ALL", pBreak: true, kitCode: ACTS[0].code, kitGroup: "LE", kitQ: "", catOpen: false, catQ: "" };
  function viewGroup(gc) {
    const g = GROUPS[gc], all = ACTS.filter(a => a.group === gc);
    const ph = UI.phase[gc] || "ALL", q = (UI.q[gc] || "").toLowerCase(), only = !!UI.only[gc];
    const core = all.filter(a => a.phase === "Phase 1" || a.phase === "Phase 2");
    const done = core.filter(a => peek(a.code).status === "Done").length, nw = all.filter(a => peek(a.code).status === "Next week").length;
    const list = all.filter(a => (ph === "ALL" || phaseOf(a) === ph) && (!only || peek(a.code).status === "Next week") &&
      (!q || (a.code + " " + a.title + " " + a.domain + " " + kitOf(a.code).map(k => k.n).join(" ")).toLowerCase().includes(q)));
    const tabs = ["ALL"].concat(PHASES).map(p => { const n = p === "ALL" ? all.length : all.filter(a => phaseOf(a) === p).length; return `<button class="subtab ${ph === p ? "on" : ""}" data-phase="${p}" data-g="${gc}">${p === "ALL" ? "All" : p}<span>${n}</span></button>`; }).join("");
    let rows = "", lastUnit = "";
    list.forEach(a => {
      const u = phaseOf(a) + " · " + a.unit;
      if (u !== lastUnit) { rows += `<div class="unitrow">${esc(u)}</div>`; lastUnit = u; }
      rows += rowHTML(a);
    });
    return `<div class="ghead" style="--c:${g.color};--l:${g.light}">
        <div class="gh-l"><span class="gbadge">${gc}</span><div><h1>${esc(g.name)}</h1><p class="lead">Ages ${esc(g.ages)} · ${all.length} activities</p></div></div>
        <div class="gh-stats"><div><b>${done}</b><span>done of ${core.length}</span></div><div><b>${nw}</b><span>next week</span></div><div class="gbar"><div class="bar"><i style="width:${Math.round(100 * done / core.length)}%"></i></div></div></div>
        <span class="deco">${ICON.gear}</span></div>
      <div class="gtools"><div class="subtabs">${tabs}</div><div class="grow"></div>
        <input type="search" class="gsearch" data-g="${gc}" placeholder="Search activity, code or part" value="${esc(UI.q[gc] || "")}">
        <label class="check"><input type="checkbox" class="gonly" data-g="${gc}" ${only ? "checked" : ""}> Next week only</label></div>
      <div class="tbl" style="--c:${g.color};--l:${g.light}">
        <div class="thead"><span>#</span><span>Code</span><span>Activity</span><span>Status</span><span>Day next week</span><span>Groups</span><span>Time</span><span>Section</span><span>Kit</span></div>
        ${rows || `<div class="empty">${ICON.robot}Nothing matches this filter.</div>`}
      </div>`;
  }
  function rowHTML(a) {
    const s = peek(a.code), kit = kitOf(a.code), open = UI.open.has(a.code);
    return `<div class="trow st-${stKey(s.status)} ${open ? "open" : ""}" data-code="${esc(a.code)}">
      <span class="c-num">${a.cls || "·"}</span>
      <span class="c-code"><span class="code">${esc(a.code)}</span></span>
      <span class="c-title"><b>${esc(a.title)}</b><small>${esc(a.domain)}${s.status === "Done" && s.date ? " · done " + esc(fmt(new Date(s.date + "T00:00:00"), { day: "2-digit", month: "short" })) : ""}</small></span>
      <span class="c-st">${statusSel(a.code)}</span>
      <span class="c-day">${dayBtns(a.code)}</span>
      <span class="c-grp"><input type="number" min="1" max="40" data-f="groups" value="${esc(s.groups)}" placeholder="${S.defaultGroups}" aria-label="Groups"></span>
      <span class="c-time"><input data-f="time" value="${esc(s.time)}" placeholder="Time" aria-label="Time"></span>
      <span class="c-sec"><input data-f="section" value="${esc(s.section)}" placeholder="Section" aria-label="Section"></span>
      <span class="c-kit"><button class="kitbtn" data-toggle="${esc(a.code)}">${plural(kit.length, "part")}${S.kits[a.code] ? "*" : ""} <i>${open ? "▴" : "▾"}</i></button></span>
    </div>${open ? kitDetail(a) : ""}`;
  }
  function kitDetail(a) {
    const s = peek(a.code);
    return `<div class="tdetail" data-code="${esc(a.code)}">
      <div class="kchips">${kitOf(a.code).map(k => `<span class="kchip"><b>${esc(k.q)}</b> ${esc(k.n)}<em>${k.b === "class" ? "per class" : "per group"} · ${lineTotal(k, a.code)} total</em></span>`).join("")}</div>
      <div class="td-foot"><input data-f="notes" value="${esc(s.notes)}" placeholder="Notes for this session"><a class="btn sm" href="#kits" data-editkit="${esc(a.code)}">Edit kit</a></div>
      ${a.about ? `<p class="muted small">${esc(a.about)}</p>` : ""}</div>`;
  }
  function refreshRow(code) {
    const el = document.querySelector(`.trow[data-code="${CSS.escape(code)}"]`); if (!el) return render();
    const det = el.nextElementSibling && el.nextElementSibling.classList.contains("tdetail") ? el.nextElementSibling : null;
    const t = document.createElement("div"); t.innerHTML = rowHTML(BYCODE[code]);
    if (det) det.remove(); el.replaceWith(...t.childNodes); renderNav();
  }

  /* ---------------- THIS WEEK ---------------- */
  function viewWeek() {
    const nw = planned();
    const cols = DAYS.map(d => {
      const items = nw.filter(a => peek(a.code).day === d);
      const parts = weekParts(items);
      return `<div class="dcol"><div class="dcol-h"><div><b>${DAYFULL[d]}</b><span>${dayDate(d)}</span></div>${items.length ? `<a class="tiny link" href="#print" data-printday="${d}">${plural(parts, "part")} · print</a>` : ""}</div>
        ${items.map(sessCard).join("") || `<div class="dfree">Free</div>`}</div>`;
    }).join("");
    const noday = nw.filter(a => !peek(a.code).day);
    return pageHead("This Week", nw.length ? `${plural(nw.length, "session")} planned. Move a session with its day menu or remove it with ×.` : "Nothing planned yet. Open an age group and tap a day on each session.",
      `<button class="btn" data-act="clearweek">Clear week</button><button class="btn" data-act="doneweek">Mark week as done</button><a class="btn primary" href="#print">Print kit lists</a>`, ICON.bulb) +
      (noday.length ? `<div class="warnbar">These sessions need a day: ${noday.map(a => `<b>${esc(a.code)}</b>`).join(", ")}</div><div class="nodaygrid">${noday.map(sessCard).join("")}</div>` : "") +
      `<div class="weekgrid">${cols}</div>`;
  }
  function sessCard(a) {
    const g = GROUPS[a.group], s = peek(a.code);
    return `<div class="scard" style="--c:${g.color}">
      <div class="sc-top"><span class="code">${esc(a.code)}</span><button class="x" data-unplan="${esc(a.code)}" title="Remove from this week">×</button></div>
      <div class="sc-title">${esc(a.title)}</div>
      <div class="sc-meta">${esc(g.name)} · ${groupsOf(a.code)} groups${s.time ? " · " + esc(s.time) : ""}${s.section ? " · " + esc(s.section) : ""}</div>
      <select class="mv" data-move="${esc(a.code)}">${["", ...DAYS].map(d => `<option value="${d}" ${s.day === d ? "selected" : ""}>${d ? DAYFULL[d] : "No day"}</option>`).join("")}</select>
    </div>`;
  }

  /* ---------------- KIT LISTS / PRINT ---------------- */
  const MODES = [["session", "Per session"], ["day", "Per day (combined)"], ["week", "Whole week"]];
  const MODEHINT = { session: "Day by day, one block per session in the kit format. Pack one box per session.", day: "Day by day, all sessions on the same day added together. One kit set per day.", week: "One request for the week. Reusable: most needed on one day. Consumables: week total." };
  function viewPrint() {
    const nw = planned();
    const days = DAYS.filter(d => nw.some(a => peek(a.code).day === d)).concat(nw.some(a => !peek(a.code).day) ? [""] : []);
    if (UI.pDay !== "ALL" && !days.includes(UI.pDay)) UI.pDay = "ALL";
    const tools = `<div class="ptools noprint">
        <div class="seg">${MODES.map(([k, t]) => `<button class="${UI.pMode === k ? "on" : ""}" data-pmode="${k}">${t}</button>`).join("")}</div>
        ${UI.pMode !== "week" ? `<div class="seg">${["ALL"].concat(days).map(d => `<button class="${UI.pDay === d ? "on" : ""}" data-pday="${d}">${d === "ALL" ? "All days" : d || "No day"}</button>`).join("")}</div>` : ""}
        <div class="grow"></div>
        ${UI.pMode !== "week" ? `<label class="check"><input type="checkbox" id="pBreak" ${UI.pBreak ? "checked" : ""}> New page per day</label>` : ""}
        <button class="btn primary" data-act="print">Print / Save PDF</button></div>`;
    return `<div class="noprint">${pageHead("Kit Lists", MODEHINT[UI.pMode], "", ICON.circuit)}</div>` + tools + `<div id="printArea">${sheet(nw, days)}</div>`;
  }
  function sheetHead(title) {
    return `<div class="sheethead"><div><h2>${esc(title)}</h2><div class="s">${esc(S.campus)}</div>
      <div><b>Week starting:</b> ${esc(longDate(S.weekStart))} &nbsp;·&nbsp; <b>Requested by:</b> ${esc(S.name)}</div></div>
      <div class="who"><div>Received by (lab):<span class="line"></span></div><div>Signature / date:<span class="line"></span></div></div></div>`;
  }
  const dayLabel = d => (d ? `${DAYFULL[d].toUpperCase()} ${dayDate(d)}` : "DAY NOT SET");
  function sessionsTable(nw) {
    return `<table class="kit sess"><thead><tr><th>Day</th><th>Code</th><th>Activity</th><th>Age group</th><th class="c">Groups</th><th>Time</th><th>Section</th></tr></thead><tbody>` +
      nw.map(a => { const s = peek(a.code), g = GROUPS[a.group]; return `<tr style="--c:${g.color}"><td>${DAYFULL[s.day]} ${dayDate(s.day)}</td><td class="cc">${esc(a.code)}</td><td>${esc(a.title)}</td><td>${esc(g.name)}</td><td class="c">${groupsOf(a.code)}</td><td>${esc(s.time)}</td><td>${esc(s.section)}</td></tr>`; }).join("") + `</tbody></table>`;
  }
  function sheet(nw, days) {
    if (!nw.length) return `<div class="sheet"><div class="empty">${ICON.robot}Nothing planned for this week yet.<br><a href="#dashboard">Plan sessions on the Dashboard or an age group page.</a></div></div>`;
    const showDays = UI.pDay === "ALL" ? days : [UI.pDay];
    let h = `<div class="sheet">`;
    if (UI.pMode === "session") {
      h += sheetHead("Daily Kit Lists");
      const TH = `<thead><tr><th>Code</th><th>Category</th><th>Component</th><th class="c">Qty</th><th class="c">Basis</th><th class="c">Type</th><th>Notes</th><th class="c">Total</th><th class="c">Packed ✓</th></tr></thead>`;
      showDays.forEach((d, i) => {
        h += `<div class="${UI.pBreak && i ? "daybreak" : ""}"><table class="kit">${TH}<tbody><tr class="dayrow"><td colspan="9">${dayLabel(d)}</td></tr>`;
        nw.filter(a => peek(a.code).day === d).forEach(a => {
          const g = GROUPS[a.group], s = peek(a.code);
          h += `<tr class="actrow" style="--c:${g.color};--l:${g.light}"><td class="codecell">${esc(a.code)}</td><td>${esc(g.name)} ${esc(g.ages)}</td><td>${esc(a.title)}</td><td colspan="3"></td><td>${s.time ? esc(s.time) + " · " : ""}${s.section ? esc(s.section) : ""}</td><td class="c">${groupsOf(a.code)} groups</td><td></td></tr>`;
          kitOf(a.code).forEach(k => { if (!k.n) return; const c = catOf(k.n);
            h += `<tr style="--c:${g.color}"><td class="cc">${esc(a.code)}</td><td>${esc(c.cat)}</td><td>${esc(k.n)}</td><td class="c">${esc(k.q)}</td><td class="c">${k.b === "class" ? "Per class" : "Per group"}</td><td class="c">${esc(c.type)}</td><td>${esc(k.note)}</td><td class="tot">${lineTotal(k, a.code)}</td><td class="box"></td></tr>`; });
          h += `<tr class="spacer"><td colspan="9"></td></tr>`;
        });
        h += `</tbody></table></div>`;
      });
    } else if (UI.pMode === "day") {
      h += sheetHead("Hardware by Day");
      const TH = `<thead><tr><th>Category</th><th>Component</th><th class="c">Type</th><th class="c">Qty</th><th>Used in</th><th class="c">Packed ✓</th><th class="c">Returned ✓</th></tr></thead>`;
      showDays.forEach((d, i) => {
        const today = nw.filter(a => peek(a.code).day === d), agg = {};
        today.forEach(a => kitOf(a.code).forEach(k => { const t = lineTotal(k, a.code); if (!t || !k.n) return; const x = agg[k.n] = agg[k.n] || { q: 0, used: [] }; x.q += t; if (!x.used.includes(a.code)) x.used.push(a.code); }));
        const rows = Object.keys(agg).sort((p, q) => catIdx(catOf(p).cat) - catIdx(catOf(q).cat) || p.localeCompare(q));
        h += `<div class="${UI.pBreak && i ? "daybreak" : ""}"><table class="kit">${TH}<tbody><tr class="dayrow"><td colspan="7">${dayLabel(d)} · ${today.map(a => esc(a.code)).join(", ")}</td></tr>` +
          rows.map(n => `<tr><td>${esc(catOf(n).cat)}</td><td>${esc(n)}</td><td class="c">${esc(catOf(n).type)}</td><td class="tot">${agg[n].q}</td><td>${esc(agg[n].used.join(", "))}</td><td class="box"></td><td class="box"></td></tr>`).join("") + `</tbody></table></div>`;
      });
    } else {
      h += sheetHead("Hardware Request for the Week") + sessionsTable(nw) + `<p class="totnote">Reusable parts: the most needed on any one day (plus sessions with no day). Consumables: the whole week's total.</p>`;
      const per = {};
      nw.forEach(a => { const d = peek(a.code).day || "X"; kitOf(a.code).forEach(k => { const t = lineTotal(k, a.code); if (!t || !k.n) return; const x = per[k.n] = per[k.n] || {}; x[d] = (x[d] || 0) + t; }); });
      const rows = Object.keys(per).sort((p, q) => catIdx(catOf(p).cat) - catIdx(catOf(q).cat) || p.localeCompare(q));
      h += `<table class="kit"><thead><tr><th class="c">#</th><th>Category</th><th>Component</th><th class="c">Type</th>${DAYS.map(d => `<th class="c">${d}<br><small>${dayDate(d)}</small></th>`).join("")}<th class="c">No day</th><th class="c">Issue</th><th class="c">Issued ✓</th><th class="c">Returned ✓</th></tr></thead><tbody>` +
        rows.map((n, i) => { const x = per[n], c = catOf(n), dv = DAYS.map(d => x[d] || 0), nd = x.X || 0;
          const issue = c.type === "Consumable" ? dv.reduce((p, q) => p + q, 0) + nd : Math.max(...dv) + nd;
          return `<tr><td class="c">${i + 1}</td><td>${esc(c.cat)}</td><td>${esc(n)}</td><td class="c">${esc(c.type)}</td>${dv.map(v => `<td class="c">${v || ""}</td>`).join("")}<td class="c">${nd || ""}</td><td class="tot">${issue}</td><td class="box"></td><td class="box"></td></tr>`; }).join("") + `</tbody></table>`;
    }
    return h + `</div>`;
  }

  /* ---------------- KITS ---------------- */
  const catOptions = sel => D.categories.map(c => `<option ${c === sel ? "selected" : ""}>${esc(c)}</option>`).join("");
  function viewKits() {
    const q = UI.kitQ.toLowerCase();
    const list = ACTS.filter(a => a.group === UI.kitGroup && (!q || (a.code + " " + a.title).toLowerCase().includes(q)));
    if (!BYCODE[UI.kitCode]) UI.kitCode = ACTS[0].code;
    const left = `<div class="kside">
        <div class="seg full">${D.groups.map(g => `<button class="${UI.kitGroup === g.code ? "on" : ""}" data-kg="${g.code}" style="--c:${g.color}">${g.code}</button>`).join("")}</div>
        <input type="search" id="kitQ" placeholder="Search activities" value="${esc(UI.kitQ)}">
        <div class="klist">${list.map(a => `<button class="kitem ${a.code === UI.kitCode ? "on" : ""}" data-kcode="${esc(a.code)}" style="--c:${GROUPS[a.group].color}"><span class="code">${esc(a.code)}</span><span>${esc(a.title)}</span>${S.kits[a.code] ? `<i class="edot" title="Edited"></i>` : ""}</button>`).join("")}</div></div>`;
    return pageHead("Kits", "Pick an activity on the left. Edit, add or remove parts. Changes save automatically.", "", ICON.gear) +
      `<div class="kitlayout">${left}<div class="kmain"><div class="panel" id="kitEditor">${kitEditor()}</div>${catalogPanel()}</div></div>`;
  }
  function kitEditor() {
    const a = BYCODE[UI.kitCode], g = GROUPS[a.group], kit = kitOf(a.code), parts = allParts();
    return `<div class="kehead" style="--c:${g.color}"><span class="code">${esc(a.code)}</span><h2>${esc(a.title)}</h2>${S.kits[a.code] ? `<span class="pill amber">Edited</span>` : ""}</div>
      ${a.about ? `<p class="muted small">${esc(a.about)}</p>` : ""}
      <datalist id="partsList">${Object.keys(parts).sort().map(n => `<option value="${esc(n)}">`).join("")}</datalist>
      <div class="etable"><table class="edit"><thead><tr><th>Component</th><th>Category</th><th>Type</th><th>Qty</th><th>Basis</th><th>Notes</th><th></th></tr></thead><tbody>
      ${kit.map((k, i) => { const c = catOf(k.n), known = !!parts[k.n]; return `<tr data-i="${i}">
        <td><input list="partsList" data-k="n" value="${esc(k.n)}" placeholder="Part name"></td>
        <td>${known ? esc(c.cat) : `<select data-k="cat">${catOptions(c.cat)}</select>`}</td>
        <td>${known ? esc(c.type) : `<select data-k="type"><option>Reusable</option><option ${c.type === "Consumable" ? "selected" : ""}>Consumable</option></select>`}</td>
        <td class="n"><input type="number" min="0" data-k="q" value="${esc(k.q)}"></td>
        <td><select data-k="b"><option value="group" ${k.b !== "class" ? "selected" : ""}>Per group</option><option value="class" ${k.b === "class" ? "selected" : ""}>Per class</option></select></td>
        <td><input data-k="note" value="${esc(k.note)}"></td>
        <td><button class="x" data-del="${i}" title="Remove">×</button></td></tr>`; }).join("")}
      </tbody></table></div>
      <div class="btns mt"><button class="btn primary" data-act="addrow">+ Add part</button>${S.kits[a.code] ? `<button class="btn" data-act="resetkit">Reset to original</button>` : ""}
        <span class="muted small">Qty is per group of 2 students unless Per class (shared).</span></div>`;
  }
  function catalogPanel() {
    const parts = allParts(), q = UI.catQ.toLowerCase(), by = {};
    Object.keys(parts).filter(n => !q || (n + " " + parts[n].cat + " " + parts[n].spec).toLowerCase().includes(q)).forEach(n => (by[parts[n].cat] = by[parts[n].cat] || []).push(n));
    return `<div class="panel"><div class="panel-h"><h2>Parts catalog <span class="muted small">${Object.keys(parts).length} parts</span></h2><button class="btn sm" data-act="togglecat">${UI.catOpen ? "Hide" : "Show"}</button></div>
      <div class="addpart"><input id="npName" placeholder="New part name"><select id="npCat">${catOptions("Other")}</select><select id="npType"><option>Reusable</option><option>Consumable</option></select><input id="npSpec" placeholder="Spec (optional)"><button class="btn primary" data-act="addpart">Add part</button></div>
      ${UI.catOpen ? `<input type="search" id="catQ" placeholder="Search parts" value="${esc(UI.catQ)}"><div class="catgrid">${Object.keys(by).sort((a, b) => catIdx(a) - catIdx(b)).map(c => `<h5>${esc(c)}</h5>` + by[c].sort().map(n => `<div class="p"><span class="${S.catalog[n] && !D.catalog[n] ? "mine" : ""}" title="${esc(parts[n].spec)}">${esc(n)}</span><span class="t">${esc(parts[n].type)}</span></div>`).join("")).join("")}</div>` : ""}</div>`;
  }
  const editableKit = () => (S.kits[UI.kitCode] = S.kits[UI.kitCode] || JSON.parse(JSON.stringify(BYCODE[UI.kitCode].kit)));

  /* ---------------- SETTINGS ---------------- */
  function viewSettings() {
    return pageHead("Settings", "Defaults, printouts and backups.", "", ICON.bulb) + `<div class="cols2">
      <div class="panel"><h2>Defaults</h2>
        <label class="field">Groups (pairs) per session<input type="number" id="setGroups" min="1" max="40" value="${S.defaultGroups}"></label>
        <label class="field">Requested by (printed on lists)<input id="setName" value="${esc(S.name)}"></label>
        <label class="field">School / lab line<input id="setCampus" value="${esc(S.campus)}"></label></div>
      <div class="panel note"><h2>Your data</h2>
        <p>Your plan is saved <b>in this browser only</b>. Another device, another browser or clearing browsing data will not show it.</p>
        <p>Download a backup every Friday. Use <b>Load backup</b> to move the plan to another device.</p>
        <div class="btns mt"><button class="btn primary" data-act="export">Download backup</button>
          <label class="btn filebtn">Load backup<input type="file" id="fileImport" accept=".json,application/json"></label>
          <button class="btn" data-act="csv">Session log (.csv)</button><button class="btn danger" data-act="reset">Reset everything</button></div>
        <p class="muted small">${S.saved ? "Last saved in this browser: " + esc(new Date(S.saved).toLocaleString("en-GB")) : "Nothing saved yet."}</p></div></div>`;
  }
  function download(name, text, type) { const a = document.createElement("a"); a.href = URL.createObjectURL(new Blob([text], { type })); a.download = name; document.body.appendChild(a); a.click(); setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 500); }

  const keepScroll = fn => { const y = window.scrollY; fn(); window.scrollTo(0, y); };
  /* ---------------- events (one listener per type) ---------------- */
  const app = $("#app");
  app.addEventListener("click", e => {
    const t = e.target.closest("button, a"); if (!t) return;
    const d = t.dataset;
    if (d.plan) { const on = planOn(d.plan, d.day); save(); keepScroll(render); toast(on ? `${d.plan} planned for ${DAYFULL[d.day]}` : `${d.plan} removed from this week`); return; }
    if (d.toggle) { UI.open.has(d.toggle) ? UI.open.delete(d.toggle) : UI.open.add(d.toggle); refreshRow(d.toggle); return; }
    if (d.phase) { UI.phase[d.g] = d.phase; render(); return; }
    if (d.editkit) { UI.kitCode = d.editkit; UI.kitGroup = BYCODE[d.editkit].group; return; }
    if (d.unplan) { const s = sess(d.unplan); s.status = "Not started"; s.day = ""; save(); render(); return; }
    if (d.printday) { UI.pDay = d.printday; UI.pMode = "session"; return; }
    if (d.pmode) { UI.pMode = d.pmode; render(); return; }
    if (d.pday != null) { UI.pDay = d.pday; render(); return; }
    if (d.kg) { UI.kitGroup = d.kg; const first = ACTS.find(a => a.group === d.kg); if (first) UI.kitCode = first.code; render(); return; }
    if (d.kcode) { UI.kitCode = d.kcode; render(); return; }
    if (d.del != null) { editableKit().splice(+d.del, 1); save(); render(); return; }
    switch (d.act) {
      case "print": if (!planned().length) return toast("Plan some sessions first"); window.print(); break;
      case "clearweek": { const nw = planned(); if (!nw.length) return toast("Nothing planned"); if (!confirm(`Remove all ${nw.length} sessions from this week?`)) return; nw.forEach(a => { const s = sess(a.code); s.status = "Not started"; s.day = ""; }); save(); render(); break; }
      case "doneweek": { const nw = planned(); if (!nw.length) return toast("Nothing planned"); if (!confirm(`Mark all ${nw.length} sessions as Done?`)) return; nw.forEach(a => setStatus(a.code, "Done")); save(); render(); toast("Week marked as done"); break; }
      case "addrow": editableKit().push({ n: "", q: 1, b: "group", note: "" }); save(); render(); { const ins = document.querySelectorAll("#kitEditor input[data-k=n]"); ins[ins.length - 1].focus(); } break;
      case "resetkit": if (confirm("Go back to the original kit for " + UI.kitCode + "?")) { delete S.kits[UI.kitCode]; save(); render(); } break;
      case "togglecat": UI.catOpen = !UI.catOpen; render(); break;
      case "addpart": { const n = $("#npName").value.trim(); if (!n) return toast("Type a part name first"); S.catalog[n] = { cat: $("#npCat").value, type: $("#npType").value, spec: $("#npSpec").value.trim() }; save(); render(); toast("Part added: " + n); break; }
      case "export": download(`lab-planner-backup-${iso(new Date())}.json`, JSON.stringify(S, null, 1), "application/json"); break;
      case "csv": { const rows = [["Code", "Age group", "Phase", "Class", "Activity", "Status", "Day", "Date done", "Groups", "Time", "Section", "Notes"]];
        ACTS.forEach(a => { const s = peek(a.code); rows.push([a.code, GROUPS[a.group].name, phaseOf(a), a.cls || "", a.title, s.status, s.day, s.date, groupsOf(a.code), s.time, s.section, s.notes]); });
        download(`session-log-${iso(new Date())}.csv`, "﻿" + rows.map(r => r.map(v => `"${String(v).replace(/"/g, '""')}"`).join(",")).join("\n"), "text/csv"); break; }
      case "reset": if (confirm("Delete ALL plans, kit edits and added parts in this browser? Download a backup first if unsure.")) { S = blank(); S.weekStart = nextMonday(); save(); render(); toast("Everything reset"); } break;
    }
  });
  app.addEventListener("change", e => {
    const t = e.target, d = t.dataset;
    if (d.status) { setStatus(d.status, t.value); save(); keepScroll(render); return; }
    if (d.move != null) { const s = sess(d.move); s.day = t.value; save(); render(); return; }
    if (d.f) { const row = t.closest("[data-code]"); if (!row) return; const code = row.dataset.code; sess(code)[d.f] = t.value.trim(); save(); if (d.f === "groups") keepScroll(render); return; }
    if (t.classList.contains("gonly")) { UI.only[d.g] = t.checked; render(); return; }
    if (t.id === "pBreak") { UI.pBreak = t.checked; render(); return; }
    if (d.k) {
      const tr = t.closest("tr[data-i]"), kit = editableKit(), row = kit[+tr.dataset.i], v = t.value.trim();
      if (d.k === "cat" || d.k === "type") S.catalog[row.n] = Object.assign({ cat: "Other", spec: "", type: "Reusable" }, catOf(row.n), { [d.k]: v });
      else if (d.k === "q") row.q = Math.max(0, parseFloat(v) || 0);
      else row[d.k] = v;
      if (d.k === "n" && v && !allParts()[v]) S.catalog[v] = { cat: "Other", spec: "", type: "Reusable" };
      save(); render(); return;
    }
    if (t.id === "setGroups") { S.defaultGroups = Math.max(1, parseInt(t.value, 10) || 8); save(); toast("Default groups: " + S.defaultGroups); return; }
    if (t.id === "setName") { S.name = t.value.trim(); save(); return; }
    if (t.id === "setCampus") { S.campus = t.value.trim(); save(); return; }
    if (t.id === "fileImport") {
      const f = t.files[0]; if (!f) return; const r = new FileReader();
      r.onload = () => { try { const dd = JSON.parse(r.result); if (dd.v !== 1 || typeof dd.sessions !== "object") throw 0; if (!confirm("Replace the plan in this browser with this backup?")) return; S = Object.assign(blank(), dd); save(); render(); toast("Backup loaded"); } catch (err) { toast("That file is not a planner backup"); } };
      r.readAsText(f);
    }
  });
  let qTimer;
  app.addEventListener("input", e => {
    const t = e.target;
    const rerender = (fn) => { clearTimeout(qTimer); qTimer = setTimeout(() => { fn(); const pos = t.selectionStart; render(); const again = document.getElementById(t.id) || document.querySelector(`.gsearch[data-g="${t.dataset.g}"]`); if (again) { again.focus(); try { again.setSelectionRange(pos, pos); } catch (er) { } } }, 180); };
    if (t.classList.contains("gsearch")) rerender(() => { UI.q[t.dataset.g] = t.value; });
    else if (t.id === "kitQ") rerender(() => { UI.kitQ = t.value; });
    else if (t.id === "catQ") rerender(() => { UI.catQ = t.value; });
  });
  window.addEventListener("beforeprint", () => { if (route() !== "print") { location.hash = "#print"; render(); } });

  /* ---------------- boot ---------------- */
  if (!S.weekStart) { S.weekStart = nextMonday(); save(); }
  render();
})();
