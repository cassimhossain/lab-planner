/* Robotics & AI Club Lab Planner
   Plain HTML + CSS + JavaScript. No build step, no server: works on GitHub Pages.
   Data you enter is saved in this browser (localStorage). Use Settings & backup to export / import. */
(function () {
  "use strict";
  const D = window.CLUB_DATA;
  const KEY = "rac-lab-planner-v1";
  const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri"];
  const DAYFULL = { Mon: "Monday", Tue: "Tuesday", Wed: "Wednesday", Thu: "Thursday", Fri: "Friday", "": "Day not set" };
  const STATUSES = ["Not started", "Next week", "Done", "Postponed", "Cancelled"];
  const PALETTE = { LE: ["#3E8E68", "#EAF4EE"], JM: ["#3567C4", "#EAF0FB"], YI: ["#7556C0", "#F1EDFA"], TL: ["#C2504F", "#FAEDED"] };
  D.groups.forEach(g => { if (PALETTE[g.code]) { g.color = PALETTE[g.code][0]; g.light = PALETTE[g.code][1]; } });
  const GROUPS = Object.fromEntries(D.groups.map(g => [g.code, g]));
  const ACTS = D.activities;
  const BYCODE = Object.fromEntries(ACTS.map(a => [a.code, a]));

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
    try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) { toast("Could not save in this browser. Download a backup!"); }
    renderLastSaved();
  }
  const sess = code => (S.sessions[code] = S.sessions[code] || { status: "Not started", day: "", time: "", section: "", groups: "", notes: "", date: "" });
  const peek = code => S.sessions[code] || { status: "Not started", day: "", time: "", section: "", groups: "", notes: "", date: "" };
  const groupsOf = code => { const g = parseInt(peek(code).groups, 10); return g > 0 ? g : S.defaultGroups; };
  const kitOf = code => S.kits[code] || BYCODE[code].kit;
  const catOf = n => S.catalog[n] || D.catalog[n] || { cat: "Other", spec: "", type: "Reusable" };
  const allParts = () => Object.assign({}, D.catalog, S.catalog);

  /* ---------------- helpers ---------------- */
  const $ = s => document.querySelector(s);
  const esc = s => String(s == null ? "" : s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  function toast(msg) { const t = $("#toast"); t.textContent = msg; t.classList.add("show"); clearTimeout(toast.h); toast.h = setTimeout(() => t.classList.remove("show"), 2200); }
  function nextMonday() { const d = new Date(); const add = ((8 - d.getDay()) % 7) || 7; d.setDate(d.getDate() + add); return iso(d); }
  function iso(d) { return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0"); }
  function dayDate(day) {
    if (!S.weekStart || !day) return "";
    const i = DAYS.indexOf(day); const d = new Date(S.weekStart + "T00:00:00"); d.setDate(d.getDate() + i);
    return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short" });
  }
  function longDate(isoStr) { if (!isoStr) return ""; return new Date(isoStr + "T00:00:00").toLocaleDateString("en-GB", { weekday: "long", day: "2-digit", month: "short", year: "numeric" }); }
  const lineTotal = (k, code) => (k.b === "class" ? +k.q || 0 : (+k.q || 0) * groupsOf(code));
  const nextWeek = () => ACTS.filter(a => peek(a.code).status === "Next week")
    .sort((a, b) => dayIdx(peek(a.code).day) - dayIdx(peek(b.code).day) || ACTS.indexOf(a) - ACTS.indexOf(b));
  const dayIdx = d => (d ? DAYS.indexOf(d) : 9);
  const catIdx = c => { const i = D.categories.indexOf(c); return i < 0 ? 99 : i; };

  /* ---------------- line doodle for empty states ---------------- */
  const DOODLE = `<svg viewBox="0 0 120 90" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
    <rect x="34" y="26" width="52" height="40" rx="9"/><circle cx="50" cy="44" r="4.5"/><circle cx="70" cy="44" r="4.5"/><path d="M52 57h16M60 26V14"/><circle cx="60" cy="11" r="3.5"/>
    <path d="M34 46h-9M86 46h9M46 66v12M74 66v12M14 20l5 3M106 20l-5 3M10 60h6M104 60h6"/></g></svg>`;

  /* ---------------- tabs ---------------- */
  function show(view) {
    document.querySelectorAll(".tab").forEach(t => t.classList.toggle("active", t.dataset.view === view));
    document.querySelectorAll(".view").forEach(v => v.classList.toggle("active", v.id === "view-" + view));
    ({ plan: renderPlan, week: renderWeek, print: renderPrint, kits: renderKits, backup: renderBackup })[view]();
    try { localStorage.setItem(KEY + "-tab", view); } catch (e) { }
    window.scrollTo({ top: 0 });
  }
  $("#tabs").addEventListener("click", e => { const b = e.target.closest(".tab"); if (b) show(b.dataset.view); });

  /* ---------------- week header ---------------- */
  function renderWeekSum() {
    const n = nextWeek().length;
    const b = $("#weekSum"); b.textContent = n ? `${n} session${n > 1 ? "s" : ""} planned` : "Nothing planned";
    b.classList.toggle("on", n > 0);
  }
  $("#weekStart").addEventListener("change", e => {
    let v = e.target.value;
    if (v) { const d = new Date(v + "T00:00:00"); if (d.getDay() !== 1) { const back = (d.getDay() + 6) % 7; d.setDate(d.getDate() - back); v = iso(d); e.target.value = v; toast("Moved to the Monday of that week"); } }
    S.weekStart = v; save(); refresh();
  });

  /* ---------------- 1. PLAN ---------------- */
  let fGroup = "ALL", fPhase = "ALL";
  function renderChips() {
    $("#groupChips").innerHTML = [`<button class="chip ${fGroup === "ALL" ? "on" : ""}" data-g="ALL">All ages</button>`]
      .concat(D.groups.map(g => `<button class="chip ${fGroup === g.code ? "on" : ""}" data-g="${g.code}" style="--c:${g.color}"><span class="dot"></span>${esc(g.name)}</button>`)).join("");
    $("#phaseChips").innerHTML = ["ALL", "Foundation", "Phase 1", "Phase 2"].map(p => `<button class="chip ${fPhase === p ? "on" : ""}" data-p="${p}">${p === "ALL" ? "All phases" : p}</button>`).join("");
  }
  $("#groupChips").addEventListener("click", e => { const b = e.target.closest(".chip"); if (b) { fGroup = b.dataset.g; renderPlan(); } });
  $("#phaseChips").addEventListener("click", e => { const b = e.target.closest(".chip"); if (b) { fPhase = b.dataset.p; renderPlan(); } });
  $("#search").addEventListener("input", () => renderCards());
  $("#onlyNext").addEventListener("change", () => renderCards());

  function renderProgress() {
    $("#progress").innerHTML = D.groups.map(g => {
      const list = ACTS.filter(a => a.group === g.code && a.phase !== "Foundation" && a.phase !== "Intro");
      const done = list.filter(a => peek(a.code).status === "Done").length;
      const nw = ACTS.filter(a => a.group === g.code && peek(a.code).status === "Next week").length;
      const pct = list.length ? Math.round(100 * done / list.length) : 0;
      return `<div class="prog" style="--c:${g.color}"><div class="prog-top"><h4><span class="dot"></span>${esc(g.name)}</h4><span class="num">${done}<small> / ${list.length}</small></span></div>
        <div class="bar"><i style="width:${pct}%"></i></div><div class="meta">Ages ${esc(g.ages)} · ${nw ? `<b>${nw} next week</b>` : "none next week"}</div></div>`;
    }).join("");
  }
  function cardHTML(a) {
    const g = GROUPS[a.group], s = peek(a.code), st = s.status.split(" ")[0];
    const kit = kitOf(a.code);
    return `<div class="card st-${st}" data-code="${esc(a.code)}" style="--c:${g.color}">
      <div class="row1"><span class="code">${esc(a.code)}</span>
        <select class="status s-${st}" data-f="status">${STATUSES.map(x => `<option ${x === s.status ? "selected" : ""}>${x}</option>`).join("")}</select></div>
      <h4>${esc(a.title)}</h4>
      <div class="meta">${a.cls ? "Class " + a.cls + " · " : ""}${esc(a.domain)}${s.status === "Done" && s.date ? " · done " + esc(new Date(s.date + "T00:00:00").toLocaleDateString("en-GB", { day: "2-digit", month: "short" })) : ""}</div>
      <div class="days">${DAYS.map(d => `<button class="day ${s.day === d && s.status === "Next week" ? "on" : ""}" data-day="${d}" title="${DAYFULL[d]}">${d}</button>`).join("")}</div>
      ${s.status === "Next week" && !s.day ? `<div class="pickday">Pick a day for this session</div>` : ""}
      <div class="fields">
        <label>Groups<input type="number" min="1" max="40" data-f="groups" value="${esc(s.groups)}" placeholder="${S.defaultGroups}"></label>
        <label>Time<input data-f="time" value="${esc(s.time)}" placeholder="2:30 pm"></label>
        <label>Section<input data-f="section" value="${esc(s.section)}" placeholder="Grade 4 B"></label>
      </div>
      <div class="foot2"><a data-kit="${esc(a.code)}">${kit.length} part${kit.length === 1 ? "" : "s"}${S.kits[a.code] ? " · edited" : ""} →</a>
        <input data-f="notes" value="${esc(s.notes)}" placeholder="Notes"></div>
    </div>`;
  }
  function renderCards() {
    const q = $("#search").value.trim().toLowerCase(), only = $("#onlyNext").checked;
    const list = ACTS.filter(a => (fGroup === "ALL" || a.group === fGroup) &&
      (fPhase === "ALL" || (fPhase === "Foundation" ? (a.phase === "Foundation" || a.phase === "Intro") : a.phase === fPhase)) &&
      (!only || peek(a.code).status === "Next week") &&
      (!q || (a.code + " " + a.title + " " + a.domain + " " + kitOf(a.code).map(k => k.n).join(" ")).toLowerCase().includes(q)));
    if (!list.length) { $("#cards").innerHTML = `<div class="empty">${DOODLE}Nothing matches. Try another filter.</div>`; return; }
    let html = "", lastG = "", lastU = "";
    for (const a of list) {
      const g = GROUPS[a.group];
      if (a.group !== lastG) { if (lastG) html += "</div>"; html += `<div class="gh" style="--c:${g.color}"><span class="dot"></span><h2>${esc(g.name)}</h2><span class="ages">Ages ${esc(g.ages)}</span></div>`; lastG = a.group; lastU = ""; html += "<div>"; }
      const u = a.phase + "|" + a.unit;
      if (u !== lastU) { if (lastU) html += "</div>"; html += `<div class="uh">${esc(a.phase === "Intro" ? "Foundation" : a.phase)} · ${esc(a.unit)}</div><div class="cards">`; lastU = u; }
      html += cardHTML(a);
    }
    html += "</div></div>";
    $("#cards").innerHTML = html;
  }
  function renderPlan() { renderChips(); renderProgress(); renderCards(); renderWeekSum(); }

  function updateCard(code) {
    const el = document.querySelector(`.card[data-code="${CSS.escape(code)}"]`);
    if (el) { const t = document.createElement("div"); t.innerHTML = cardHTML(BYCODE[code]); el.replaceWith(t.firstElementChild); }
    renderProgress(); renderWeekSum();
  }
  function setStatus(code, status) {
    const s = sess(code); s.status = status;
    if (status === "Done" && !s.date) s.date = s.day && S.weekStart ? (() => { const d = new Date(S.weekStart + "T00:00:00"); d.setDate(d.getDate() + DAYS.indexOf(s.day)); return iso(d); })() : iso(new Date());
    if (status !== "Done") s.date = "";
  }
  $("#cards").addEventListener("click", e => {
    const card = e.target.closest(".card"); if (!card) return;
    const code = card.dataset.code;
    const dayB = e.target.closest(".day");
    if (dayB) {
      const s = sess(code);
      if (s.day === dayB.dataset.day && s.status === "Next week") { s.day = ""; s.status = "Not started"; }
      else { s.day = dayB.dataset.day; setStatus(code, "Next week"); }
      save(); updateCard(code); return;
    }
    const k = e.target.closest("[data-kit]"); if (k) { kitCode = k.dataset.kit; show("kits"); }
  });
  $("#cards").addEventListener("change", e => {
    const card = e.target.closest(".card"); const f = e.target.dataset.f; if (!card || !f) return;
    const code = card.dataset.code, s = sess(code);
    if (f === "status") { setStatus(code, e.target.value); save(); updateCard(code); return; }
    s[f] = e.target.value.trim(); save();
    if (f === "groups") updateCard(code);
  });

  /* ---------------- 2. WEEK ---------------- */
  function renderWeek() {
    const nw = nextWeek();
    if (!nw.length) { $("#weekGrid").innerHTML = `<div class="empty" style="grid-column:1/-1">${DOODLE}No sessions planned yet. Open <b>Plan</b> and pick a day on each session you will teach.</div>`; return; }
    $("#weekGrid").innerHTML = DAYS.concat([""]).map(d => {
      const items = nw.filter(a => peek(a.code).day === d);
      if (d === "" && !items.length) return "";
      return `<div class="daycol ${d ? "" : "nodate"}"><div class="dh"><h3>${DAYFULL[d]}</h3><span class="date">${d ? dayDate(d) : "pick a day on these cards"}</span></div>
        ${items.map(a => { const g = GROUPS[a.group], s = peek(a.code); return `<div class="mini" style="--c:${g.color}"><b>${esc(a.code)}</b> ${esc(a.title)}<div class="g">${esc(g.name)} · ${groupsOf(a.code)} groups${s.time ? " · " + esc(s.time) : ""}${s.section ? " · " + esc(s.section) : ""}</div></div>`; }).join("") || `<div class="free">Free</div>`}
      </div>`;
    }).join("");
  }
  $("#btnGoPrint").addEventListener("click", () => show("print"));
  $("#btnMarkDone").addEventListener("click", () => {
    const nw = nextWeek(); if (!nw.length) return toast("Nothing marked for next week");
    if (!confirm(`Mark all ${nw.length} sessions as Done?`)) return;
    nw.forEach(a => setStatus(a.code, "Done")); save(); renderWeek(); renderWeekSum(); toast("Week marked as done");
  });
  $("#btnClearWeek").addEventListener("click", () => {
    const nw = nextWeek(); if (!nw.length) return toast("Nothing to clear");
    if (!confirm(`Set all ${nw.length} Next week sessions back to Not started?`)) return;
    nw.forEach(a => { const s = sess(a.code); s.status = "Not started"; s.day = ""; }); save(); renderWeek(); renderWeekSum();
  });

  /* ---------------- 3. PRINT ---------------- */
  let pMode = "session";
  const MODES = [["session", "Per session"], ["day", "Per day (combined)"], ["week", "Whole week"]];
  function renderPrintModes() {
    $("#printModes").innerHTML = MODES.map(([k, t]) => `<button class="chip ${pMode === k ? "on" : ""}" data-m="${k}">${t}</button>`).join("");
    $("#printHint").innerHTML = {
      session: "Day by day, one block per session in the kit format. Pack one box per session.",
      day: "Day by day, all sessions on the same day added together. One kit set per day.",
      week: "One request for the week. Reusable parts: most needed on one day. Consumables: week total."
    }[pMode];
  }
  $("#printModes").addEventListener("click", e => { const b = e.target.closest(".chip"); if (b) { pMode = b.dataset.m; renderPrint(); } });
  $("#pDayBreak").addEventListener("change", () => renderPrint());
  $("#btnPrint").addEventListener("click", () => { if (!nextWeek().length) return toast("Mark some sessions first"); window.print(); });

  function sheetHead(title) {
    return `<div class="sheethead"><div><h2>${esc(title)}</h2><div class="s">${esc(S.campus)}</div>
      <div><b>Week starting:</b> ${S.weekStart ? esc(longDate(S.weekStart)) : "(set the date at the top)"} &nbsp; · &nbsp; <b>Requested by:</b> ${esc(S.name)}</div></div>
      <div class="who"><div>Received by (lab):<span class="line"></span></div><div>Signature / date:<span class="line"></span></div></div></div>`;
  }
  function sessionsTable(nw) {
    return `<table class="kit sessions-tbl"><thead><tr><th>Day</th><th>Code</th><th>Activity</th><th>Age group</th><th class="c">Groups</th><th>Time</th><th>Section</th></tr></thead><tbody>` +
      nw.map(a => { const s = peek(a.code), g = GROUPS[a.group]; return `<tr style="--c:${g.color}"><td>${DAYFULL[s.day]} ${dayDate(s.day)}</td><td class="cc">${esc(a.code)}</td><td>${esc(a.title)}</td><td>${esc(g.name)}</td><td class="c">${groupsOf(a.code)}</td><td>${esc(s.time)}</td><td>${esc(s.section)}</td></tr>`; }).join("") +
      `</tbody></table>`;
  }
  const dayLabel = d => (d ? `${DAYFULL[d].toUpperCase()} ${dayDate(d)}` : "DAY NOT SET (choose a day in Plan sessions)");
  function renderPrint() {
    renderPrintModes();
    const nw = nextWeek(), area = $("#printArea");
    if (!nw.length) { area.innerHTML = `<div class="sheet"><div class="empty">${DOODLE}No sessions planned yet. Pick days in <b>Plan</b> first.</div></div>`; return; }
    const days = DAYS.concat([""]).filter(d => nw.some(a => peek(a.code).day === d));
    const brk = $("#pDayBreak").checked;
    let html = `<div class="sheet">`;
    if (pMode === "session") {
      html += sheetHead("Daily Kit Lists");
      const TH = `<thead><tr><th>Code</th><th>Category</th><th>Component</th><th class="c">Qty</th><th class="c">Basis</th><th class="c">Type</th><th>Notes</th><th class="c">Total</th><th class="c">Packed ✓</th></tr></thead>`;
      days.forEach((d, di) => {
        html += `<div class="${brk && di ? "daybreak" : ""}"><table class="kit">${TH}<tbody><tr class="dayrow"><td colspan="9">${dayLabel(d)}</td></tr>`;
        nw.filter(a => peek(a.code).day === d).forEach(a => {
          const g = GROUPS[a.group], s = peek(a.code);
          html += `<tr class="actrow" style="--c:${g.color};--l:${g.light}"><td class="codecell">${esc(a.code)}</td><td>${esc(g.name)} ${esc(g.ages)}</td><td>${esc(a.title)}</td><td colspan="3"></td><td>Status: Next week (${esc(s.day || "no day")})${s.time ? " · " + esc(s.time) : ""}</td><td class="c">${groupsOf(a.code)} groups</td><td></td></tr>`;
          kitOf(a.code).forEach(k => {
            const c = catOf(k.n);
            html += `<tr style="--c:${g.color}"><td class="cc">${esc(a.code)}</td><td>${esc(c.cat)}</td><td>${esc(k.n)}</td><td class="c">${esc(k.q)}</td><td class="c">${k.b === "class" ? "Per class" : "Per group"}</td><td class="c">${esc(c.type)}</td><td>${esc(k.note)}</td><td class="tot">${lineTotal(k, a.code)}</td><td class="box"></td></tr>`;
          });
          html += `<tr class="spacer"><td colspan="9"></td></tr>`;
        });
        html += `</tbody></table></div>`;
      });
    } else if (pMode === "day") {
      html += sheetHead("Hardware by Day");
      html += sessionsTable(nw) + `<div class="totnote">Totals below add together every session on that day.</div>`;
      const TH = `<thead><tr><th>Category</th><th>Component</th><th class="c">Type</th><th class="c">Qty</th><th>Used in</th><th class="c">Packed ✓</th><th class="c">Returned ✓</th></tr></thead>`;
      days.forEach((d, di) => {
        const agg = {};
        nw.filter(a => peek(a.code).day === d).forEach(a => kitOf(a.code).forEach(k => { const t = lineTotal(k, a.code); if (!t) return; const x = agg[k.n] = agg[k.n] || { q: 0, used: [] }; x.q += t; if (!x.used.includes(a.code)) x.used.push(a.code); }));
        const rows = Object.keys(agg).sort((p, q) => catIdx(catOf(p).cat) - catIdx(catOf(q).cat) || p.localeCompare(q));
        html += `<div class="${brk && di ? "daybreak" : ""}"><table class="kit">${TH}<tbody><tr class="dayrow"><td colspan="7">${dayLabel(d)} · ${nw.filter(a => peek(a.code).day === d).length} session(s)</td></tr>` +
          rows.map(n => `<tr><td>${esc(catOf(n).cat)}</td><td>${esc(n)}</td><td class="c">${esc(catOf(n).type)}</td><td class="tot">${agg[n].q}</td><td>${esc(agg[n].used.join(", "))}</td><td class="box"></td><td class="box"></td></tr>`).join("") +
          `<tr class="spacer"><td colspan="7"></td></tr></tbody></table></div>`;
      });
    } else {
      html += sheetHead("Hardware Request for the Week");
      html += sessionsTable(nw) + `<div class="totnote">Reusable parts: the most needed on any one day (+ sessions with no day). Consumables: the whole week's total.</div>`;
      const per = {};
      nw.forEach(a => { const d = peek(a.code).day || "X"; kitOf(a.code).forEach(k => { const t = lineTotal(k, a.code); if (!t) return; const x = per[k.n] = per[k.n] || {}; x[d] = (x[d] || 0) + t; }); });
      const rows = Object.keys(per).sort((p, q) => catIdx(catOf(p).cat) - catIdx(catOf(q).cat) || p.localeCompare(q));
      html += `<table class="kit"><thead><tr><th>#</th><th>Category</th><th>Component</th><th class="c">Type</th>${DAYS.map(d => `<th class="c">${d}<br><small>${dayDate(d)}</small></th>`).join("")}<th class="c">No day</th><th class="c">Issue qty</th><th class="c">Issued ✓</th><th class="c">Returned ✓</th></tr></thead><tbody>` +
        rows.map((n, i) => {
          const x = per[n], c = catOf(n), dv = DAYS.map(d => x[d] || 0), nd = x.X || 0;
          const issue = c.type === "Consumable" ? dv.reduce((p, q) => p + q, 0) + nd : Math.max(...dv) + nd;
          return `<tr><td class="c">${i + 1}</td><td>${esc(c.cat)}</td><td>${esc(n)}</td><td class="c">${esc(c.type)}</td>${dv.map(v => `<td class="c">${v || ""}</td>`).join("")}<td class="c">${nd || ""}</td><td class="tot">${issue}</td><td class="box"></td><td class="box"></td></tr>`;
        }).join("") + `</tbody></table>`;
    }
    html += `</div>`;
    area.innerHTML = html;
  }

  /* ---------------- 4. KITS ---------------- */
  let kitCode = ACTS[0].code;
  function renderKitPick() {
    $("#kitPick").innerHTML = D.groups.map(g => `<optgroup label="${esc(g.name)} (${esc(g.ages)})">` +
      ACTS.filter(a => a.group === g.code).map(a => `<option value="${esc(a.code)}" ${a.code === kitCode ? "selected" : ""}>${esc(a.code)} · ${esc(a.title)}${S.kits[a.code] ? "  (edited)" : ""}</option>`).join("") + `</optgroup>`).join("");
  }
  $("#kitPick").addEventListener("change", e => { kitCode = e.target.value; renderKitEditor(); });
  function catSelect(sel) { return D.categories.map(c => `<option ${c === sel ? "selected" : ""}>${esc(c)}</option>`).join(""); }
  function renderKitEditor() {
    const a = BYCODE[kitCode], g = GROUPS[a.group], kit = kitOf(kitCode);
    const parts = allParts();
    $("#kitEditor").innerHTML = `<div class="kithead" style="--c:${g.color}"><span class="code">${esc(a.code)}</span><h3>${esc(a.title)}</h3>
        ${S.kits[kitCode] ? `<span class="edited">Edited</span>` : ""}</div>
      ${a.about ? `<div class="muted small">${esc(a.about)}</div>` : ""}
      <datalist id="partsList">${Object.keys(parts).sort().map(n => `<option value="${esc(n)}">`).join("")}</datalist>
      <table class="edit"><thead><tr><th>Component</th><th>Category</th><th>Type</th><th>Qty</th><th>Basis</th><th>Notes</th><th></th></tr></thead><tbody>
      ${kit.map((k, i) => { const c = catOf(k.n), known = !!parts[k.n]; return `<tr data-i="${i}">
        <td><input list="partsList" data-k="n" value="${esc(k.n)}"></td>
        <td>${known ? esc(c.cat) : `<select data-k="cat">${catSelect(c.cat)}</select>`}</td>
        <td>${known ? esc(c.type) : `<select data-k="type"><option>Reusable</option><option ${c.type === "Consumable" ? "selected" : ""}>Consumable</option></select>`}</td>
        <td class="n"><input type="number" min="0" data-k="q" value="${esc(k.q)}"></td>
        <td><select data-k="b"><option value="group" ${k.b !== "class" ? "selected" : ""}>Per group</option><option value="class" ${k.b === "class" ? "selected" : ""}>Per class</option></select></td>
        <td><input data-k="note" value="${esc(k.note)}"></td>
        <td><button class="xbtn" data-del="${i}" title="Remove">×</button></td></tr>`; }).join("")}
      </tbody></table>
      <div class="btns" style="margin-top:10px">
        <button class="btn primary" id="btnAddRow">+ Add part</button>
        ${S.kits[kitCode] ? `<button class="btn " id="btnResetKit">Reset to original</button>` : ""}
        <span class="muted small">Qty is per group of 2 students unless Per class (shared).</span>
      </div>`;
  }
  function editableKit() { if (!S.kits[kitCode]) S.kits[kitCode] = JSON.parse(JSON.stringify(BYCODE[kitCode].kit)); return S.kits[kitCode]; }
  $("#kitEditor").addEventListener("change", e => {
    const tr = e.target.closest("tr[data-i]"), k = e.target.dataset.k; if (!tr || !k) return;
    const kit = editableKit(), row = kit[+tr.dataset.i], v = e.target.value.trim();
    if (k === "cat" || k === "type") { S.catalog[row.n] = Object.assign({ cat: "Other", spec: "", type: "Reusable" }, catOf(row.n), { [k]: v }); }
    else if (k === "q") row.q = Math.max(0, parseFloat(v) || 0);
    else row[k] = v;
    if (k === "n" && v && !allParts()[v]) S.catalog[v] = { cat: "Other", spec: "", type: "Reusable" };
    save(); renderKitEditor(); renderKitPick();
  });
  $("#kitEditor").addEventListener("click", e => {
    if (e.target.dataset.del != null) { editableKit().splice(+e.target.dataset.del, 1); save(); renderKitEditor(); renderKitPick(); }
    if (e.target.id === "btnAddRow") { editableKit().push({ n: "", q: 1, b: "group", note: "" }); save(); renderKitEditor(); renderKitPick(); const ins = document.querySelectorAll("#kitEditor input[data-k=n]"); ins[ins.length - 1].focus(); }
    if (e.target.id === "btnResetKit" && confirm("Go back to the original kit for " + kitCode + "?")) { delete S.kits[kitCode]; save(); renderKitEditor(); renderKitPick(); }
  });
  function renderCatalog() {
    $("#npCat").innerHTML = catSelect("Other");
    const q = $("#catSearch").value.trim().toLowerCase(), parts = allParts();
    const by = {};
    Object.keys(parts).filter(n => !q || (n + " " + parts[n].cat + " " + parts[n].spec).toLowerCase().includes(q)).forEach(n => (by[parts[n].cat] = by[parts[n].cat] || []).push(n));
    $("#catalogList").innerHTML = `<div class="catgrid">` + Object.keys(by).sort((a, b) => catIdx(a) - catIdx(b)).map(c => `<h5>${esc(c)}</h5>` +
      by[c].sort().map(n => `<div class="p"><span class="${S.catalog[n] && !D.catalog[n] ? "mine" : ""}" title="${esc(parts[n].spec)}">${esc(n)}</span><span class="t">${esc(parts[n].type)}</span></div>`).join("")).join("") + `</div>`;
  }
  $("#catSearch").addEventListener("input", renderCatalog);
  $("#btnAddPart").addEventListener("click", () => {
    const n = $("#npName").value.trim(); if (!n) return toast("Type a part name first");
    S.catalog[n] = { cat: $("#npCat").value, type: $("#npType").value, spec: $("#npSpec").value.trim() };
    save(); $("#npName").value = ""; $("#npSpec").value = ""; renderCatalog(); renderKitEditor(); toast("Part added: " + n);
  });
  function renderKits() { renderKitPick(); renderKitEditor(); renderCatalog(); }

  /* ---------------- 5. BACKUP ---------------- */
  function renderLastSaved() { const el = $("#lastSaved"); if (el) el.textContent = S.saved ? "Last saved in this browser: " + new Date(S.saved).toLocaleString("en-GB") : "Nothing saved yet."; }
  function renderBackup() { $("#setGroups").value = S.defaultGroups; $("#setName").value = S.name; $("#setCampus").value = S.campus; renderLastSaved(); }
  $("#setGroups").addEventListener("change", e => { S.defaultGroups = Math.max(1, parseInt(e.target.value, 10) || 8); save(); toast("Default groups: " + S.defaultGroups); });
  $("#setName").addEventListener("change", e => { S.name = e.target.value.trim(); save(); });
  $("#setCampus").addEventListener("change", e => { S.campus = e.target.value.trim(); save(); });
  function download(name, text, type) { const a = document.createElement("a"); a.href = URL.createObjectURL(new Blob([text], { type })); a.download = name; document.body.appendChild(a); a.click(); setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 500); }
  $("#btnExport").addEventListener("click", () => download(`lab-planner-backup-${iso(new Date())}.json`, JSON.stringify(S, null, 1), "application/json"));
  $("#fileImport").addEventListener("change", e => {
    const f = e.target.files[0]; if (!f) return;
    const r = new FileReader();
    r.onload = () => { try { const d = JSON.parse(r.result); if (d.v !== 1 || typeof d.sessions !== "object") throw 0; if (!confirm("Replace the plan in this browser with this backup?")) return; S = Object.assign(blank(), d); save(); refresh(); toast("Backup loaded"); } catch (err) { toast("That file is not a planner backup"); } };
    r.readAsText(f); e.target.value = "";
  });
  $("#btnExportCsv").addEventListener("click", () => {
    const rows = [["Code", "Age group", "Phase", "Class", "Activity", "Status", "Day", "Date done", "Groups", "Time", "Section", "Notes"]];
    ACTS.forEach(a => { const s = peek(a.code); rows.push([a.code, GROUPS[a.group].name, a.phase, a.cls || "", a.title, s.status, s.day, s.date, groupsOf(a.code), s.time, s.section, s.notes]); });
    download(`session-log-${iso(new Date())}.csv`, "﻿" + rows.map(r => r.map(v => `"${String(v).replace(/"/g, '""')}"`).join(",")).join("\n"), "text/csv");
  });
  $("#btnReset").addEventListener("click", () => {
    if (!confirm("Delete ALL sessions, kit edits and added parts in this browser? Download a backup first if unsure.")) return;
    S = blank(); S.weekStart = nextMonday(); save(); refresh(); toast("Everything reset");
  });

  /* ---------------- boot ---------------- */
  function refresh() {
    $("#weekStart").value = S.weekStart;
    const v = document.querySelector(".tab.active").dataset.view; show(v);
  }
  if (!S.weekStart) S.weekStart = nextMonday();
  $("#weekStart").value = S.weekStart;
  let start = "plan"; try { start = localStorage.getItem(KEY + "-tab") || "plan"; } catch (e) { }
  show(["plan", "week", "print", "kits", "backup"].includes(start) ? start : "plan");
  window.addEventListener("beforeprint", () => { if (!document.querySelector("#view-print.active")) { show("print"); } });
})();
