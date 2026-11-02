/* Robotics & AI Curriculum: the slide player and teacher guide.

   rai/deck.html?c=ROB-08            slides
   rai/deck.html?c=ROB-08&tier=advanced
   rai/deck.html?c=ROB-08&view=guide  teacher guide (prints cleanly)

   A lesson is one file, rai/lessons/<code>.js, that sets
   window.RAI_LESSONS[code] = {
     think:      { q, guesses: [3], story: {h, text}, today, art }
     objectives: [{ t, proof }]
     video:      { title, search, mins, watch: [questions] }      // YouTube search, so links never die
     learn:      [{ kicker, title, text, points, boxes: [{h, text|points, color}], note: {l, text},
                    art, cap, reveal: {q, a}, code, only }]
     quiz:       [{ q, options: [], answer, why }]
     real:       [{ art, name, text }]
     game:       { title, big, steps: [], mins }
     builds:     [{ title, kicker, steps: [], code, note: {l, text}, sim, mins, only }]
     test:       { title, intro, cols: [], rows: [[]] }
     levelup:    { choices: [{ t, d }], boss, think: {h, text} }
     debate:     { title, kicker, a: {h, points}, b: {h, points}, note }
     wrap:       { learned: [], exit, home, next }
     guide:      { overview, prep: [], timing: [[mins, phase, what]], steps: [{ phase, title, do: [], say }],
                   misconceptions: [[idea, fix]], trouble: [[problem, fix]], tiers: { starter: [], core: [], advanced: [] },
                   assess: [{ c, e, s, x }], safety: [], answers: [] }
   }
   Any slide part can carry  only: ["starter"]  (or core / advanced) to show at that depth only. */
(() => {
  const $ = s => document.querySelector(s);
  const esc = s => String(s ?? "").replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  /* light markup in lesson text: **bold** and `code` */
  const md = s => esc(s).replace(/\*\*(.+?)\*\*/g, "<b>$1</b>").replace(/`(.+?)`/g, "<code>$1</code>");
  const q = new URLSearchParams(location.search), code = q.get("c") || "", view = q.get("view") || "slides";
  const TIERS = ["starter", "core", "advanced"], TN = { starter: "Starter", core: "Core", advanced: "Advanced" };
  let tier = TIERS.includes(q.get("tier")) ? q.get("tier") : "core";
  const R = window.RAI, act = R && R.activities.find(a => a.code === code);
  if (!act) { document.body.innerHTML = `<p style="color:#fff;padding:40px;font-size:18px">No activity called ${esc(code)}. <a style="color:#9cf" href="../#rai">Back to the curriculum</a></p>`; return; }
  const cat = R.cats.find(c => c.key === act.code.split("-")[0]), mod = R.modules.find(m => m.key === act.mod);
  document.documentElement.style.setProperty("--c", cat.color); document.documentElement.style.setProperty("--l", cat.light);
  document.title = act.code + " · " + act.title;
  const SIMS = (window.SIMS && window.SIMS.byKey) || {};
  const simLink = k => { const s = SIMS[k]; if (!s) return null;
    const href = s.ext ? s.href : s.href ? (s.href.startsWith("#") ? "../" + s.href : "../" + s.href) : "../sim.html?s=" + k;
    return { s, href }; };

  const s = document.createElement("script");
  s.src = "lessons/" + code + ".js";
  s.onload = () => start(window.RAI_LESSONS && window.RAI_LESSONS[code]);
  s.onerror = () => start(null);
  document.head.appendChild(s);

  const shown = x => !x || !x.only || x.only.includes(tier);

  function start(L) {
    if (view === "guide") return guide(L);
    slides(L);
  }

  /* ================= slides ================= */
  function frame(inner, o = {}) {
    const blobs = o.blobs !== false ? `<i class="blob" style="width:300px;height:300px;right:-90px;top:-110px;background:${cat.light}"></i><i class="blob" style="width:220px;height:220px;left:-80px;bottom:-110px;background:#FFE9B8"></i>` : "";
    frame.n = (frame.n || 0) + 1;
    const edges = o.cls === "divider" || !window.RAI_ART ? "" : RAI_ART.doodles(frame.n);
    return `<div class="slide ${o.cls || ""}">${blobs}${edges}${o.tag ? `<span class="chipt">${esc(act.code)} · ${esc(act.title)}</span><span class="stag">${o.tag}</span>` : ""}
      ${inner}<div class="foot"><span>Robotics &amp; AI Club · ${esc(cat.name)} · Curriculum by Qasim Mushtaq</span><span class="pg"></span></div></div>`;
  }
  const head = (kick, title) => `${kick ? `<div class="kick">${md(kick)}</div>` : ""}<h1 class="st">${md(title)}</h1>`;
  const list = (a, cls = "") => a && a.length ? `<ul class="${cls}">${a.map(x => `<li>${md(x)}</li>`).join("")}</ul>` : "";
  /* pictures are always doodles from rai/art.js, never emoji or downloaded images:
     "arduino servo" draws two doodles side by side; unknown names draw nothing */
  const art = (keys, cap) => { const k = String(keys || "").split(/\s+/).filter(x => window.RAI_ART && RAI_ART.has(x));
    return k.length ? `<div class="art">${k.map(x => RAI_ART.svg(x)).join("")}${cap ? `<small>${md(cap)}</small>` : ""}</div>` : ""; };
  /* a rough-framed scene: doodles with labels, joined by hand-drawn arrows when flow is true */
  const scene = sc => sc ? `<div class="frame scene ${sc.flow ? "flow" : ""}">${sc.items.map((it, i) => `${i && sc.flow ? `<span class="harrow">${RAI_ART.svg("arrow")}</span>` : ""}<figure>${art(it.art)}<figcaption style="color:${({ red: "#E0414B", green: "#2E9E5B", blue: "#2E6BE6", purple: "#7B3FC4", amber: "#D9822B", teal: "#14967F" })[it.color] || "var(--c)"}">${md(it.label)}</figcaption></figure>`).join("")}${sc.caption ? `<p class="scap">${md(sc.caption)}</p>` : ""}</div>` : "";
  /* picture blocks, like ArduinoBlocks / mBlock: [indent, colour, text] */
  const blocks = b => b ? `<div class="frame blocks">${b.map(([n, c, t]) => `<span class="blk ${c}" style="margin-left:${n * 22}px">${md(t)}</span>`).join("")}</div>` : "";
  const note = n => n ? `<div class="note ${n.blue ? "blue" : ""}"><b class="l">${md(n.l || "Did you know?")}</b>${md(n.text)}</div>` : "";
  const box = b => `<div class="box ${b.color || ""}">${b.h ? `<h3>${b.icon && window.RAI_ART && RAI_ART.has(b.icon) ? `<i class="bicon">${RAI_ART.svg(b.icon)}</i>` : ""}${md(b.h)}</h3>` : ""}${b.text ? `<p>${md(b.text)}</p>` : ""}${list(b.points)}${b.steps ? `<ol class="steps">${b.steps.map(x => `<li>${md(x)}</li>`).join("")}</ol>` : ""}</div>`;

  function slides(L) {
    const S = [], add = (html, title) => S.push({ html, title });
    const words = act.title.split(" "), cut = Math.ceil(words.length / 2);
    /* 1 · title */
    add(frame(`<div class="tcol"><div class="body"><div class="grp">${esc(cat.name)} · ${esc(mod.name)}</div>
      <h1 class="${act.title.length > 44 ? "vlong" : act.title.length > 28 ? "long" : ""}"><em>${esc(words.slice(0, cut).join(" "))}</em> ${esc(words.slice(cut).join(" "))}</h1>
      <div class="hook">${md(act.hook)}</div>
      <div class="tags">${act.concepts.slice(0, 4).map(c => `<span>${esc(c)}</span>`).join("")}</div>
      ${L && L.fact ? note({ l: "Did you know?", text: L.fact }) : ""}</div>
      <div class="bigart">${art((L && L.titleArt) || act.art || ({ EF: "chip", ROB: "robot", AI: "brain", IS: "robotCar" })[cat.key])}</div></div>`, { cls: "ttl" }), "Title");
    if (!L) {
      add(frame(`<div class="body">${head("Coming soon", "Slides for this activity are being written")}<div class="cols even"><div class="stack">${box({ h: "What students will do", points: act.outcomes })}</div><div class="stack">${box({ h: "Starter · Core · Advanced", color: "purple", points: TIERS.map(t => `**${TN[t]}:** ${act.tiers[t]}`) })}</div></div></div>`, { tag: "PLAN" }), "Plan");
      return play(S);
    }
    /* 2 · think */
    const T = L.think;
    if (T) add(frame(`<div class="body">${head("Let's think...", T.q)}
      <div class="cols"><div class="stack">${T.story ? box({ h: T.story.h, text: T.story.text, color: "red" }) : ""}
        <div class="guess">${(T.guesses || []).map(g => `<button data-pick>${md(g)}</button>`).join("")}</div>
        ${T.today ? `<div class="today"><b>Today:</b> ${md(T.today)}</div>` : ""}</div>
        ${art(T.art || act.art, T.cap)}</div></div>`, { tag: "LEARN" }), "Let's think");
    /* 3 · objectives */
    if (L.objectives) add(frame(`<div class="body">${head("Learning objectives", "By the end of this activity I can...")}
      <div class="stack">${L.objectives.map((o, i) => `<div class="box ${["blue", "green", "purple", "amber"][i % 4]}"><h3>${i + 1} · ${md(o.t)}</h3><p style="margin:0;color:#5B6578"><b>Proof:</b> ${md(o.proof)}</p></div>`).join("")}</div></div>`, { tag: "LEARN" }), "Objectives");
    /* 4 · video */
    const V = L.video;
    if (V) add(frame(`<div class="body">${head("Watch and think", "Video time!")}
      <div class="cols"><div class="stack">${art("video")}<div class="box red"><h3>${md(V.title)}</h3><p>About ${V.mins || 5} minutes.</p>
        <a class="simbtn" target="_blank" rel="noopener" href="https://www.youtube.com/results?search_query=${encodeURIComponent(V.search)}">▶ Find it on YouTube</a>
        <p style="font-size:13px;color:#5B6578;margin-top:6px">Search: “${esc(V.search)}”. Teacher: check the video before class.</p></div></div>
        <div class="stack"><div class="box amber"><h3>Watch for...</h3><ol class="steps">${V.watch.map(w => `<li>${md(w)}</li>`).join("")}</ol></div></div></div></div>`, { tag: "LEARN" }), "Video");
    /* 5 · ideas */
    const objK = x => x.obj && L.objectives && L.objectives[x.obj - 1] ? `Objective ${x.obj} · ${L.objectives[x.obj - 1].short || L.objectives[x.obj - 1].t}` + (x.kicker ? " · " + x.kicker : "") : x.kicker;
    (L.learn || []).filter(shown).forEach(x => add(frame(`<div class="body">${head(objK(x), x.title)}${scene(x.scene)}
      <div class="cols ${x.layout || ""}"><div class="stack">${x.text ? `<div class="box"><p>${md(x.text)}</p>${list(x.points)}</div>` : ""}${(x.boxes || []).map(box).join("")}
        ${x.code ? `<pre class="code">${esc(x.code)}</pre>` : ""}
        ${x.reveal ? `<div class="box purple reveal"><h3>${md(x.reveal.q)}</h3><span class="tap">Tap to reveal</span><p class="ans">${md(x.reveal.a)}</p></div>` : ""}
        ${blocks(x.blocks)}</div>
        <div class="stack">${art(x.art, x.cap)}${(x.side || []).map(box).join("")}${note(x.note)}</div></div></div>`, { tag: "LEARN" }), x.title));
    /* 6 · quiz */
    (L.quiz || []).filter(shown).forEach((z, i) => add(frame(`<div class="body">${head("Quick check " + (i + 1), z.q)}
      <div class="quiz" data-answer="${z.answer}">${z.options.map((o, j) => `<button data-opt="${j}">${String.fromCharCode(65 + j)} · ${md(o)}</button>`).join("")}</div>
      <div class="why" data-why="${esc(z.why || "")}"></div></div>`, { tag: "LEARN" }), "Quick check"));
    /* 7 · real world */
    if (L.real) add(frame(`<div class="body">${head("Real world", L.realTitle || "Where is this used?")}
      <div class="cols three">${L.real.map((r, i) => `<div class="box ${["blue", "green", "purple"][i % 3]}" style="text-align:center">${art(r.art)}<h3>${md(r.name)}</h3><p style="text-align:left">${md(r.text)}</p></div>`).join("")}</div></div>`, { tag: "LEARN" }), "Real world");
    /* 8 · divider */
    const builds = (L.builds || []).filter(shown);
    const makeList = [L.game && L.game.title, "Our kit", ...builds.map(b => b.title), L.test && L.test.title, "Level up!"].filter(Boolean);
    add(frame(`<div class="body"><div class="kick">Part 2 · Make it</div><h1>Now let's put it to work!</h1>
      <p style="font-size:19px">You know the ideas. Time to play, build and test.</p><ol>${makeList.map(m => `<li>${md(m)}</li>`).join("")}</ol></div>`, { cls: "divider", blobs: false }), "Make it");
    /* 9 · game */
    const G = L.game;
    if (G) add(frame(`<div class="body">${head("Class game", G.title)}
      <div class="cols"><div class="stack"><div class="box"><h3>How to play</h3><ol class="steps">${G.steps.map(x => `<li>${md(x)}</li>`).join("")}</ol></div></div>
        <div class="stack">${note({ l: "Big idea", text: G.big })}${G.mins ? `<button class="tbtn" data-timer="${G.mins}">⏱ Start a ${G.mins}-minute timer</button>` : ""}</div></div></div>`, { tag: "MAKE" }), G.title);
    /* 10 · kit + simulators */
    const sims = act.sims.map(simLink).filter(Boolean);
    add(frame(`<div class="body">${head("Get ready", "Our kit and tools")}
      <div class="cols even"><div class="stack"><div class="box"><h3>Per group of 2</h3>${list(act.kit.map(k => k.replace(/^★/, "") + (k.startsWith("★") ? " (new)" : "")))}</div>${L.kitNote ? note({ l: "Kit tip", text: L.kitNote, blue: true }) : ""}</div>
        <div class="stack"><div class="box purple"><h3>Try it on screen first</h3>${sims.length ? sims.map((x, i) => `<a class="simbtn ${i ? "ghost" : ""}" target="_blank" rel="noopener" href="${esc(x.href)}">${esc(x.s.name)} ↗</a>`).join("") + `<p style="font-size:13.5px;margin-top:8px">${md((L.simWhy) || sims.map(x => `**${x.s.name}:** ${x.s.good}`).join(". "))}</p>` : "<p>No simulator needed: this one is hands-on.</p>"}</div></div></div></div>`, { tag: "MAKE" }), "Kit and tools");
    /* 11 · builds */
    builds.forEach((b, i) => { const sl = b.sim && simLink(b.sim);
      add(frame(`<div class="body">${head((b.obj ? `Objective ${b.obj} · ` : "") + (b.kicker || `Build step ${i + 1} of ${builds.length}`), b.title)}${scene(b.scene)}
      <div class="cols ${b.code ? "" : "even"}"><div class="stack"><div class="box"><ol class="steps">${b.steps.map(x => `<li>${md(x)}</li>`).join("")}</ol></div>
        ${sl ? `<a class="simbtn" target="_blank" rel="noopener" href="${esc(sl.href)}">Open ${esc(sl.s.name)} ↗</a>` : ""}${b.mins ? `<button class="tbtn" data-timer="${b.mins}">⏱ ${b.mins}-minute timer</button>` : ""}</div>
        <div class="stack">${b.code ? `<pre class="code">${esc(b.code)}</pre>` : ""}${blocks(b.blocks)}${(b.side || []).map(box).join("")}${note(b.note)}${art(b.art)}</div></div></div>`, { tag: "MAKE" }), b.title); });
    /* 12 · test */
    const X = L.test;
    if (X) add(frame(`<div class="body">${head("Test like an engineer", X.title)}${X.intro ? `<p style="margin:0 0 10px;font-size:16px">${md(X.intro)}</p>` : ""}
      <table class="tt"><tr>${X.cols.map(c => `<th>${md(c)}</th>`).join("")}</tr>${X.rows.map(r => `<tr>${r.map(c => c === "" ? `<td class="blank">______</td>` : `<td>${md(c)}</td>`).join("")}</tr>`).join("")}</table></div>`, { tag: "MAKE" }), X.title);
    /* 13 · level up */
    const U = L.levelup;
    if (U) add(frame(`<div class="body">${head("Level up!", U.title || "Challenges")}
      <div class="cols"><div class="stack"><div class="box green"><h3>Choose your challenge</h3>${U.choices.map(c => `<p><b>${md(c.t)}:</b> ${md(c.d)}</p>`).join("")}</div></div>
        <div class="stack">${U.think ? box({ h: U.think.h || "Think like an engineer", text: U.think.text, color: "blue" }) : ""}${U.boss ? note({ l: "Boss level", text: U.boss }) : ""}</div></div></div>`, { tag: "MAKE" }), "Level up");
    /* 14 · debate / think about it */
    const D = L.debate;
    if (D) add(frame(`<div class="body">${head(D.kicker || "Think about it", D.title)}
      <div class="cols even"><div class="stack">${box({ h: D.a.h, points: D.a.points, color: "blue" })}</div><div class="stack">${box({ h: D.b.h, points: D.b.points, color: "red" })}${note(D.note)}</div></div></div>`, { tag: "MAKE" }), D.title);
    /* 15 · objective check */
    if (L.objectives) add(frame(`<div class="body">${head("Objective check", "Can I really do it? Prove it.")}
      <div class="cols"><div class="rate">${L.objectives.map((o, i) => `<div><span style="display:block">${i + 1} · ${md(o.t)}</span><span><i style="color:#E0414B" data-rate></i><i style="color:#F2A31B" data-rate></i><i style="color:#2E9E5B" data-rate></i></span></div>`).join("")}</div>
      <div class="stack">${note({ l: "Rate yourself", text: "Red: not yet. Amber: with help. Green: I can explain it to a friend." })}</div></div></div>`, { tag: "WRAP UP" }), "Objective check");
    /* 16 · wrap */
    const W = L.wrap;
    if (W) add(frame(`<div class="body">${head("Show what you know", "What did we learn?")}
      <div class="cols"><div class="stack"><div class="box green"><ul class="ticks">${W.learned.map(x => `<li>${md(x)}</li>`).join("")}</ul></div>
        ${W.exit ? `<div class="box red"><h3>Exit ticket</h3><p>${md(W.exit)}</p></div>` : ""}</div>
        <div class="stack">${W.home ? note({ l: "At home", text: W.home }) : ""}${W.next ? `<div class="box purple"><h3>Next time</h3><p>${md(W.next)}</p></div>` : ""}</div></div></div>`, { tag: "WRAP UP" }), "Wrap up");
    play(S);
  }

  function play(S) {
    let i = Math.max(0, Math.min(S.length - 1, (+sessionStorage.getItem("rai." + code) || 0)));
    document.body.innerHTML = `<div class="top"><a class="tb" href="../#rai" title="Back to the curriculum">←</a>
      <div class="t"><b>${esc(act.code)} · ${esc(act.title)}</b><small>${esc(cat.name)} · <span id="cnt"></span></small></div>
      <select class="tb" id="tier" title="How deep to go">${TIERS.map(t => `<option value="${t}"${t === tier ? " selected" : ""}>${TN[t]}</option>`).join("")}</select>
      <button class="tb" id="prev" aria-label="Previous slide">‹</button><button class="tb" id="next" aria-label="Next slide">›</button>
      <a class="tb" href="?c=${encodeURIComponent(code)}&view=guide">Teacher guide</a>
      <button class="tb" id="fs">Full screen</button><button class="tb" id="pdf" title="Print or save every slide as a PDF">PDF</button></div>
      <div class="stage" id="stage"></div><div class="prog" id="prog"></div><div class="timer" id="timer" title="Click to stop"></div>`;
    const stage = $("#stage");
    const fit = () => { const el = stage.firstElementChild; if (!el) return; const k = Math.min(stage.clientWidth / 980, stage.clientHeight / 560); el.style.transform = `scale(${k})`; };
    const go = n => { i = Math.max(0, Math.min(S.length - 1, n)); stage.innerHTML = S[i].html; stage.querySelector(".pg").textContent = (i + 1) + " / " + S.length;
      $("#cnt").textContent = `Slide ${i + 1} of ${S.length} · ${TN[tier]}`; $("#prog").style.width = (100 * (i + 1) / S.length) + "%"; fit();
      try { sessionStorage.setItem("rai." + code, i); } catch (e) { } rough(stage); };
    $("#prev").onclick = () => go(i - 1); $("#next").onclick = () => go(i + 1);
    $("#tier").onchange = e => { const u = new URL(location.href); u.searchParams.set("tier", e.target.value); location.href = u; };
    $("#fs").onclick = () => document.fullscreenElement ? document.exitFullscreen() : document.documentElement.requestFullscreen().catch(() => { });
    $("#pdf").onclick = () => { document.body.classList.add("printdeck"); stage.innerHTML = S.map((x, n) => x.html.replace('<span class="pg"></span>', `<span class="pg">${n + 1} / ${S.length}</span>`)).join("");
      setTimeout(() => { window.print(); document.body.classList.remove("printdeck"); go(i); }, 300); };
    addEventListener("resize", fit);
    addEventListener("keydown", e => { if (e.target.tagName === "SELECT") return;
      if (["ArrowRight", "PageDown", " "].includes(e.key)) { e.preventDefault(); go(i + 1); }
      if (["ArrowLeft", "PageUp"].includes(e.key)) { e.preventDefault(); go(i - 1); }
      if (e.key === "Home") go(0); if (e.key === "End") go(S.length - 1); if (e.key === "f") $("#fs").click(); });
    let x0 = null; stage.addEventListener("touchstart", e => { x0 = e.touches[0].clientX; }, { passive: true });
    stage.addEventListener("touchend", e => { if (x0 == null) return; const dx = e.changedTouches[0].clientX - x0; if (Math.abs(dx) > 50) go(i + (dx < 0 ? 1 : -1)); x0 = null; });
    /* the interactive parts of slides */
    let tm = null;
    stage.addEventListener("click", e => {
      const p = e.target.closest("[data-pick]"); if (p) { p.parentElement.querySelectorAll("button").forEach(b => b.classList.remove("pick")); p.classList.add("pick"); return; }
      const r = e.target.closest(".reveal"); if (r) { r.classList.add("open"); return; }
      const o = e.target.closest("[data-opt]"); if (o) { const qz = o.closest(".quiz"), ok = +o.dataset.opt === +qz.dataset.answer;
        o.classList.add(ok ? "right" : "wrong"); if (ok) { qz.querySelectorAll("button").forEach(b => b.disabled = true); const w = qz.nextElementSibling; w.innerHTML = "<b>Yes!</b> " + md(w.dataset.why); } else o.disabled = true; return; }
      const rt = e.target.closest("[data-rate]"); if (rt) { rt.parentElement.querySelectorAll("i").forEach(z => z.classList.remove("on")); rt.classList.add("on"); return; }
      const t = e.target.closest("[data-timer]"); if (t) { startTimer(+t.dataset.timer); return; }
    });
    function startTimer(m) { clearInterval(tm); const box = $("#timer"); let left = m * 60; box.className = "timer on";
      const show = () => { box.textContent = `${Math.floor(left / 60)}:${String(left % 60).padStart(2, "0")}`; };
      show(); tm = setInterval(() => { left--; show(); if (left <= 0) { clearInterval(tm); box.textContent = "Time!"; box.classList.add("done"); } }, 1000);
      box.onclick = () => { clearInterval(tm); box.className = "timer"; }; }
    go(i);
  }

  /* hand-drawn outlines: two slightly wobbly rectangles over every box and frame,
     the same on every visit because the wobble is seeded by the box's position */
  function rough(root) {
    root.querySelectorAll(".box, .frame, .today").forEach((el, n) => {
      if (el.querySelector(":scope > svg.rough")) return;
      const w = el.offsetWidth, h = el.offsetHeight; if (!w || !h) return;
      let s = n * 97 + w * 13 + h * 7; const r = () => ((s = (s * 9301 + 49297) % 233280) / 233280 - 0.5) * 5;
      /* each side bows a little in the middle, like a line drawn by hand */
      const side = (x1, y1, x2, y2) => `Q${(x1 + x2) / 2 + r()} ${(y1 + y2) / 2 + r()} ${x2} ${y2}`;
      const path = o => { const p = [[2 + r() + o, 2 + r()], [w - 2 + r(), 2 + r() + o], [w - 2 + r() - o, h - 2 + r()], [2 + r(), h - 2 + r() - o]];
        return `M${p[0][0]} ${p[0][1]} ${side(...p[0], ...p[1])} ${side(...p[1], ...p[2])} ${side(...p[2], ...p[3])} ${side(...p[3], ...p[0])}`; };
      el.insertAdjacentHTML("afterbegin", `<svg class="rough" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" aria-hidden="true"><path d="${path(0)}"/><path d="${path(2.4)}" opacity=".6"/></svg>`);
    });
  }

  /* ================= teacher guide ================= */
  function guide(L) {
    const G = (L && L.guide) || {};
    document.body.className = "guide";
    const typ = { H: "Hardware build", S: "Software / simulator", U: "Unplugged", HS: "Hardware + software", US: "Unplugged + software" }[act.type] || act.type;
    const sims = act.sims.map(simLink).filter(Boolean);
    const tbl = (h, rows) => rows && rows.length ? `<table class="gt"><tr>${h.map(x => `<th>${x}</th>`).join("")}</tr>${rows.map(r => `<tr>${r.map(c => `<td>${md(c)}</td>`).join("")}</tr>`).join("")}</table>` : "";
    document.body.innerHTML = `<div class="top"><a class="tb" href="../#rai">←</a><div class="t"><b>Teacher guide · ${esc(act.code)} · ${esc(act.title)}</b><small>${esc(cat.name)} · ${esc(mod.name)}</small></div>
      <a class="tb hot" href="?c=${encodeURIComponent(code)}">Open slides</a><button class="tb" onclick="print()">Print</button></div>
      <div class="gwrap">
        <div class="kick" style="font:700 24px Caveat;color:var(--c)">${esc(cat.name)} · ${esc(mod.name)}</div>
        <h1>${esc(act.code)} · ${esc(act.title)}</h1><p style="font-size:17px">${md(act.hook)}</p>
        <div class="ggrid"><div>Length<b>${act.mins} min</b></div><div>Type<b>${typ}</b></div><div>Groups<b>${esc(G.grouping || "Pairs")}</b></div><div>Concepts<b style="font-size:13px">${esc(act.concepts.join(", "))}</b></div></div>
        ${G.overview ? `<h2>Overview</h2><p>${md(G.overview)}</p>` : ""}
        <h2>Learning outcomes</h2><ol>${act.outcomes.map(o => `<li>${md(o)}</li>`).join("")}</ol>
        <h2>Three depths: pick one for your class</h2>
        ${TIERS.map(t => `<div class="tier"><b>${TN[t]}: ${md(act.tiers[t])}</b>${G.tiers && G.tiers[t] ? `<ul>${G.tiers[t].map(x => `<li>${md(x)}</li>`).join("")}</ul>` : ""}<a href="?c=${encodeURIComponent(code)}&tier=${t}">Slides at ${TN[t]} depth</a></div>`).join("")}
        <h2>Before the lesson</h2><div class="gcard"><h3>Kit per group of 2</h3><ul>${act.kit.map(k => `<li>${esc(k.replace(/^★/, ""))}${k.startsWith("★") ? " <b>(not in the lab yet: cheap to buy)</b>" : ""}</li>`).join("")}</ul>
          ${sims.length ? `<h3>Simulators and tools</h3><ul>${sims.map(x => `<li><a href="${esc(x.href)}" target="_blank" rel="noopener">${esc(x.s.name)}</a>: ${esc(x.s.about)}</li>`).join("")}</ul>` : ""}
          ${G.prep ? `<h3>Prep checklist</h3><ul>${G.prep.map(x => `<li>☐ ${md(x)}</li>`).join("")}</ul>` : ""}</div>
        ${G.timing ? `<h2>Timing plan</h2>${tbl(["Minutes", "Phase", "What happens"], G.timing.map(r => [String(r[0]), r[1], r[2]]))}` : ""}
        ${G.steps ? `<h2>Step by step</h2>${G.steps.map(st => `<div class="gcard" style="margin:10px 0"><h3>${md(st.phase ? st.phase + " · " : "")}${md(st.title)}</h3>${st.say ? `<div class="say">Say: “${md(st.say)}”</div>` : ""}<ol>${st.do.map(x => `<li>${md(x)}</li>`).join("")}</ol></div>`).join("")}` : ""}
        ${G.misconceptions ? `<h2>Common misconceptions</h2>${tbl(["Students might think...", "Help them see..."], G.misconceptions)}` : ""}
        ${G.trouble ? `<h2>Troubleshooting</h2>${tbl(["Problem", "Fix"], G.trouble)}` : ""}
        ${G.assess ? `<h2>Assessment rubric</h2>${tbl(["Criterion", "Emerging", "Secure", "Extending"], G.assess.map(a => [a.c, a.e, a.s, a.x]))}` : ""}
        ${L && L.quiz ? `<h2>Quick-check answers</h2><ol>${L.quiz.map(z => `<li>${md(z.q)} <b>${md(z.options[z.answer])}</b>${z.why ? `: ${md(z.why)}` : ""}</li>`).join("")}</ol>` : ""}
        ${G.answers ? `<h2>Other answers</h2><ul>${G.answers.map(x => `<li>${md(x)}</li>`).join("")}</ul>` : ""}
        ${G.safety ? `<h2>Safety</h2><ul>${G.safety.map(x => `<li>${md(x)}</li>`).join("")}</ul>` : ""}
        ${!L ? `<h2>Status</h2><p>The full guide for this activity is being written. The outcomes, depths and kit above are final.</p>` : ""}
      </div>`;
  }
})();
