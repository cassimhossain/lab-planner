/* Study Buddy: a helper students can ask about electronics, code, robotics,
   AI and the club's own lessons. Loaded on the Portal, Circuit Lab and Code Lab.

   Two ways to answer (buddy/config.js picks):
   - local:  searches our lessons, parts catalog and glossary in the browser.
             No server, no internet, nothing sent anywhere.
   - worker: asks the club's free Cloudflare Worker (chatbot-proxy/), and
             falls back to local whenever the Worker can't answer.

   Only the question (and the lesson code it was asked from) goes to the
   Worker. A student's code or error is sent only when they press "Explain
   this error" or "Help with my code", and those buttons say so.
   The conversation is kept in this browser only, under rac-chat-v1. */
(function () {
  "use strict";
  const CFG = window.BUDDY_CONFIG || {};
  if (!CFG.enabled || window.StudyBuddy) return;
  const ME = document.currentScript;
  const BASE = ME ? ME.src.replace(/buddy\/buddy\.js.*$/, "") : "./";
  const APP = /\/circuit\//.test(location.pathname) ? "circuit" : /\/codelab\//.test(location.pathname) ? "codelab" : "portal";
  const V = "?v=" + (CFG.version || "1");
  const USE_AI = CFG.backend === "worker" && !!CFG.workerUrl;
  const CKEY = "rac-chat-v1", MAXLEN = 600;

  const esc = s => String(s == null ? "" : s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const $ = (s, r = document) => r.querySelector(s);

  /* ---------- saved conversation ---------- */
  const ST = (() => { const b = { v: 1, msgs: [], mode: "simple" };
    try { const x = JSON.parse(localStorage.getItem(CKEY) || "null"); if (x && x.v === 1) return Object.assign(b, x); } catch (e) { } return b; })();
  const persist = () => { ST.msgs = ST.msgs.slice(-50); try { localStorage.setItem(CKEY, JSON.stringify(ST)); } catch (e) { } };
  let session = ""; try { session = sessionStorage.getItem("rac-chat-session") || ""; if (!session) { session = Math.random().toString(36).slice(2, 12); sessionStorage.setItem("rac-chat-session", session); } } catch (e) { session = Math.random().toString(36).slice(2, 12); }

  /* ---------- lesson data, fetched the first time the panel opens ---------- */
  const load = src => new Promise(res => { const s = document.createElement("script"); s.src = src; s.onload = () => res(true); s.onerror = () => res(false); document.head.appendChild(s); });
  let ready = null, IDX = null;
  function ensureData() {
    if (ready) return ready;
    ready = Promise.all([
      window.CLUB_DATA || load(BASE + "data.js" + V), window.LIBRARY || load(BASE + "library.js" + V),
      window.VIDEOS || load(BASE + "videos.js" + V), window.SIMS || load(BASE + "sims.js" + V),
      window.BUDDY_GLOSSARY || load(BASE + "buddy/glossary.js" + V),
    ]).then(buildIndex);
    return ready;
  }
  const norm = s => " " + String(s || "").toLowerCase().replace(/[^a-z0-9²+#.\-\s]/g, " ").replace(/\s+/g, " ").trim() + " ";
  const STOP = new Set("a an the is are am was be to of in on for and or with my me i you it this that what how why do does can could should would which when where who make use using get about please tell explain help need want".split(" "));
  function buildIndex() {
    const D = window.CLUB_DATA || { activities: [], catalog: {} };
    const acts = D.activities.map(a => ({ a, hay: norm([a.code, a.title, a.domain, a.unit, a.about, (a.kit || []).map(k => k.n).join(" ")].join(" ")) }));
    const terms = [];
    (window.BUDDY_GLOSSARY || []).forEach(g => [g.t].concat(g.a || []).forEach(w => terms.push({ w: norm(w).trim(), g })));
    terms.sort((x, y) => y.w.length - x.w.length);
    IDX = { D, acts, terms, parts: Object.keys(D.catalog || {}).map(n => ({ n, w: norm(n).trim() })).sort((x, y) => y.w.length - x.w.length) };
  }

  /* ---------- links back to our own material ---------- */
  const deckOf = c => ((window.LIBRARY || {}).decks || []).find(d => d.code === String(c).split(" ")[0]);
  const vidOf = c => ((window.VIDEOS || {})[String(c).split(" ")[0]] || [])[0];
  const hasCircuit = c => ((window.SIMS || {}).circuits || []).includes(String(c).split(" ")[0]);
  const lessonHref = c => (APP === "portal" ? "" : BASE + "index.html") + "#open=" + encodeURIComponent(c);
  function lessonLinks(a) {
    const c = a.code, d = deckOf(c), v = vidOf(c), out = [`<a href="${lessonHref(c)}">Open ${esc(c)}</a>`];
    if (d) out.push(`<a href="${lessonHref(c)}">Slides (${d.pages})</a>`);
    if (v) out.push(`<a href="https://youtu.be/${esc(v.id)}" target="_blank" rel="noopener">Video</a>`);
    if (hasCircuit(c)) out.push(`<a href="${BASE}circuit/#lesson=${encodeURIComponent(c.split(" ")[0])}">Try it in Circuit Lab</a>`);
    return `<span class="bd-links">${out.join("")}</span>`;
  }
  const lessonLine = a => `<li><b>${esc(a.code)}</b> ${esc(a.title)}${lessonLinks(a)}</li>`;
  function searchLessons(q, n = 3) {
    const toks = norm(q).trim().split(" ").filter(t => t.length > 2 && !STOP.has(t));
    if (!toks.length) return [];
    return IDX.acts.map(x => ({ a: x.a, s: toks.reduce((t, k) => t + (x.hay.includes(" " + k) ? (norm(x.a.title).includes(" " + k) ? 3 : 1) : 0), 0) }))
      .filter(x => x.s > 0).sort((p, q2) => q2.s - p.s)
      /* the Foundation lessons appear once per age group: list each only once */
      .filter((x, i, all) => all.findIndex(y => y.a.code.split(" ")[0] === x.a.code.split(" ")[0]) === i).slice(0, n).map(x => x.a);
  }

  /* ---------- the local helper ---------- */
  const UNSAFE = /\b(weapon|gun|guns|bomb|explosive|explode|detonat|kill|poison|taser|stun ?gun|hack (into|someone|my friend|wifi|a phone|an account)|steal|password crack|crack (a |the )?password|fire ?starter|burn (something|someone))/;
  const PERSONAL = [/\S+@\S+\.\S{2,}/, /(\+?\d[\d\s\-()]{8,}\d)/, /\bmy (home )?address is\b/i, /\bmy password\b/i, /\bi live (at|on)\b/i];
  const COMMON = new Set("data error errors short plug input output high low model train training serial switch button motor motors driver display screen camera feedback control bias ethics solar code list loop delay true false while repeat return function functions condition include".split(" "));
  const HOMEWORK =/\b(homework|assignment|challenge|solve|solution|answer to|do (it|this) for me|write (the|my) code|give me the code|complete code)\b/;
  const ERRS = [
    [/NameError: name '([^']+)' is not defined/, m => `Python doesn't know <code>${esc(m[1])}</code> yet. Check the spelling and capital letters, or create it (give it a value) before the line that uses it.`],
    [/IndentationError|unexpected indent|expected an indented block/, () => "The spaces at the start of a line are off. In Python, the lines inside an <code>if</code>, <code>for</code> or <code>def</code> must all be indented by the same amount (4 spaces)."],
    [/can only concatenate str|must be str, not int/, () => "You're joining text and a number. Turn the number into text with <code>str(n)</code>, or use an f-string: <code>f\"Score: {n}\"</code>."],
    [/unsupported operand type.*'str'|'str' and 'int'/, () => "<code>input()</code> always gives back text. To do maths with it, turn it into a number first: <code>int(input(...))</code> or <code>float(input(...))</code>."],
    [/invalid literal for int\(\)/, () => "<code>int()</code> was given something that isn't a whole number, like a word or a decimal. Check what was typed, or use <code>float()</code> for decimals."],
    [/ZeroDivisionError|division by zero/, () => "The program divided by zero, which maths doesn't allow. Check the number with an <code>if</code> before you divide."],
    [/IndexError/, () => "The program asked for an item that isn't in the list. Lists start counting at 0, so a list of 3 items has positions 0, 1 and 2."],
    [/KeyError/, () => "The program looked up a key that isn't in the dictionary. Check the spelling, or use <code>.get(key)</code>."],
    [/ModuleNotFoundError|No module named/, () => "That library isn't available here. Code Lab has numpy, pandas and matplotlib; check the name's spelling."],
    [/SyntaxError/, () => "Python can't read how something is written. Look at the line it names, and the line before it, for a missing <code>:</code>, bracket or quote mark."],
    [/was not declared in this scope/, () => "C++ doesn't know that name. Check spelling and capitals (<code>Serial</code>, <code>HIGH</code>, <code>OUTPUT</code>), or declare the variable before you use it."],
    [/expected ';'/, () => "A semicolon <code>;</code> is missing at the end of the line before the one it names."],
    [/expected '\)'|expected '\}'|expected '\{'|expected declaration/, () => "A bracket is missing or extra. Count your <code>( )</code> and <code>{ }</code> so every opening one has a closing one."],
    [/does not name a type/, () => "Is an <code>#include</code> missing at the top, or is a type spelled wrong?"],
    [/compiler isn't answering|could not be reached|took more than 20 seconds/i, () => "That isn't a mistake in your code: the online compiler didn't answer. Try again in a minute, or press <b>Run without code</b> to test the wiring."],
  ];
  function explainError(err) {
    if (!err || !err.trim()) return `There's no error on screen right now. Press <b>Run</b> first, then ask me again if something goes wrong.`;
    const hit = ERRS.find(([re]) => re.test(err));
    const line = (/line (\d+)/i.exec(err) || [])[1];
    return `${hit ? hit[1](hit[0].exec(err)) : "Read the first line of the error: it says what went wrong and usually which line. Change one thing at a time and run again."}${line ? `<br><small>Start by looking at line ${esc(line)}.</small>` : ""}`;
  }
  function safetyNotes(q) {
    const n = norm(q);
    return (window.BUDDY_SAFETY || []).filter(s => !s.refuse && s.k.some(k => n.includes(" " + k))).map(s => `<p class="bd-safe">⚠️ ${esc(s.m)}</p>`).join("");
  }
  function answerLocal(q, o) {
    const n = norm(q), c = o.ctx || {};
    if (UNSAFE.test(n)) return `I can't help with that, because it could hurt someone. I'd love to help you build something safe instead: an alarm, a robot arm or a weather station?`;
    const mains = (window.BUDDY_SAFETY || []).find(s => s.refuse && s.k.some(k => n.includes(" " + k)));
    if (mains) return `<p class="bd-safe">⚠️ ${esc(mains.m)}</p>`;
    if (o.action === "error") return explainError(c.error);
    if (o.action === "code") return codeHelp(c);
    // a lesson code, or "this lesson" from inside one
    const code = (/\b(f|le|jm|yi|tl)-\d{2}\b/.exec(n) || [])[0];
    const lessonAsk = code || (/\b(this|the) (lesson|activity|project)\b/.test(n) && c.lesson ? c.lesson : "");
    if (lessonAsk) {
      const a = IDX.D.activities.find(x => x.code.toLowerCase() === String(lessonAsk).toLowerCase()) || IDX.D.activities.find(x => x.code.toLowerCase().startsWith(String(lessonAsk).toLowerCase()));
      if (a) {
        const kit = (a.kit || []).filter(k => k.n).map(k => `<li>${esc(k.n)}${k.b === "class" ? " (one for the class)" : k.q > 1 ? " × " + esc(k.q) : ""}</li>`).join("");
        const want = /\b(need|parts|kit|hardware|materials)\b/.test(n);
        return `<p><b>${esc(a.code)} · ${esc(a.title)}</b>${a.about ? `<br>${esc(a.about)}` : ""}</p>${kit ? `<p>${want ? "You need (per group of 2):" : "Parts for each group:"}</p><ul>${kit}</ul>` : ""}${lessonLinks(a)}`;
      }
    }
    // a glossary word
    /* everyday words such as "if", "for" or "data" only count as a glossary
       question when the student is clearly asking what something is */
    const askWhat = /\b(what|whats|what's|explain|define|meaning|how (does|do|to)|tell me about)\b/.test(n) || n.trim().split(" ").length <= 3;
    const t = IDX.terms.find(x => x.w && n.includes(" " + x.w + " ") && (askWhat || (x.w.length >= 4 && !COMMON.has(x.w))));
    if (t) {
      const g = t.g, again = ST.lastTopic === g.t, hint = o.hint && !again;
      ST.lastTopic = g.t;
      const rel = searchLessons((g.k || []).join(" "), 2);
      if (hint) return `<p><b>Hint:</b> ${esc(g.s)}</p><p>Now try it: how could you use ${esc(g.t.toLowerCase())} in your project? Ask me again if you want the full explanation with an example.</p>`;
      return `<p><b>${esc(g.t)}</b>: ${esc(ST.mode === "deep" ? g.d : g.s)}</p>${g.x ? `<pre><code>${esc(g.x)}</code></pre>` : ""}${ST.mode !== "deep" ? `<p class="bd-more">Switch to <b>Go deeper</b> for more detail.</p>` : ""}${rel.length ? `<p>In our lessons:</p><ul>${rel.map(lessonLine).join("")}</ul>` : ""}${safetyNotes(q)}`;
    }
    // a part from the catalog
    const p = IDX.parts.find(x => x.w.length > 2 && n.includes(" " + x.w));
    if (p) {
      const info = IDX.D.catalog[p.n] || {}, used = IDX.D.activities.filter(a => (a.kit || []).some(k => k.n === p.n));
      return `<p><b>${esc(p.n)}</b>${info.cat ? ` is in <i>${esc(info.cat)}</i>` : ""}${info.spec ? `: ${esc(info.spec)}` : ""}.${info.type ? ` It's ${info.type === "Consumable" ? "used up in a project" : "reusable"}.` : ""}</p>${used.length ? `<p>Used in ${used.length} lesson${used.length === 1 ? "" : "s"}, for example:</p><ul>${used.slice(0, 3).map(lessonLine).join("")}</ul>` : ""}${safetyNotes(q)}`;
    }
    const found = searchLessons(q, 3);
    if (found.length) return `<p>I don't have a short answer for that, but these lessons cover it:</p><ul>${found.map(lessonLine).join("")}</ul>${safetyNotes(q)}`;
    return `<p>I'm not sure about that one. Try asking with a key word, like <i>"what is PWM"</i>, <i>"how does a servo work"</i> or a lesson code such as <i>JM-04</i>. Your teacher is a great person to ask too.</p>`;
  }
  function codeHelp(c) {
    if (!c.code || !c.code.trim()) return "There's no code yet. Write a few lines, then ask me again.";
    const words = IDX.terms.filter(x => x.w.length > 3 && /[a-z]/.test(x.w) && c.code.toLowerCase().includes(x.w.replace(/\(\)$/, ""))).map(x => x.g).filter((g, i, a) => a.indexOf(g) === i).slice(0, 4);
    const tips = c.page === "circuit"
      ? ["Every pin you use is set up with <code>pinMode()</code> in <code>setup()</code>.", "Pin numbers in the code match the pins your wires go to.", "Print values with <code>Serial.println()</code> and open the Serial tab to see them."]
      : ["Run it and read the first error line, if there is one.", "Add <code>print()</code> lines to see what the values really are.", "Change one thing at a time, then run again."];
    return `<p>Here's a checklist for your code:</p><ul>${tips.map(t => `<li>${t}</li>`).join("")}</ul>${words.length ? `<p>Words in your code you can ask me about: ${words.map(g => `<button class="bd-chip" data-bask="What is ${esc(g.t)}?">${esc(g.t)}</button>`).join(" ")}</p>` : ""}`;
  }

  /* ---------- where the panel was opened from ---------- */
  function context() {
    try {
      if (APP === "portal") return Object.assign({ page: "portal" }, window.RACBuddy && window.RACBuddy.context ? window.RACBuddy.context() : {});
      if (APP === "circuit" && window.CL) {
        const p = window.CL.project || {}, ed = window.CL.editor, out = $("#buildout");
        const types = [...new Set((p.parts || []).map(q => q.type))];
        return { page: "circuit", lesson: p.lessonKey || "", parts: types.slice(0, 20).join(", "), code: ed ? ed.getValue() : p.code || "", error: out && out.classList.contains("err") ? out.innerText.slice(0, 1200) : "" };
      }
      if (APP === "codelab" && window.CODELAB) {
        const tab = $(".langs [aria-selected='true']"), errs = [...document.querySelectorAll("#term .err, #term .hintbox")].map(e => e.innerText).join("\n");
        return { page: "codelab", lang: tab ? tab.dataset.lang : "", code: window.CODELAB.editor.getValue(), error: errs.slice(0, 1200) };
      }
    } catch (e) { }
    return { page: APP };
  }

  /* ---------- the AI, through the club's Worker ---------- */
  async function askWorker(q, o, onText) {
    const c = o.ctx || {};
    const ctx = { page: c.page, lesson: c.lesson || "", lang: c.lang || "", parts: c.parts || "" };
    if (o.action) { ctx.code = (c.code || "").slice(0, 4000); ctx.error = (c.error || "").slice(0, 1200); }
    const history = ST.msgs.slice(-9, -1).map(m => ({ role: m.r === "u" ? "user" : "assistant", content: (m.t || (m.h || "").replace(/<[^>]+>/g, " ")).slice(0, 800) }));
    const r = await fetch(CFG.workerUrl, { method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: q, mode: ST.mode, hint: !!o.hint, action: o.action || "", context: ctx, history, session }) });
    if (!r.ok || !r.body) throw Object.assign(new Error("worker " + r.status), { status: r.status });
    const rd = r.body.getReader(), dec = new TextDecoder(); let buf = "", text = "";
    for (;;) {
      const { value, done } = await rd.read(); if (done) break;
      buf += dec.decode(value, { stream: true });
      let i; while ((i = buf.indexOf("\n")) >= 0) {
        const line = buf.slice(0, i).trim(); buf = buf.slice(i + 1);
        if (!line.startsWith("data:")) continue;
        const d = line.slice(5).trim(); if (d === "[DONE]") return text;
        try { const j = JSON.parse(d); if (j.response) { text += j.response; onText(text); } } catch (e) { }
      }
    }
    if (!text) throw new Error("empty");
    return text;
  }
  /* a small, safe subset of Markdown for AI answers: everything is escaped first */
  function md(t) {
    const parts = String(t).split(/```[a-zA-Z+]*\n?/);
    return parts.map((seg, i) => {
      if (i % 2) return `<pre><code>${esc(seg.replace(/\n$/, ""))}</code></pre>`;
      return esc(seg).split(/\n{2,}/).map(p => {
        const lines = p.split("\n");
        if (lines.every(l => /^\s*([-*]|\d+\.)\s+/.test(l) || !l.trim())) return `<ul>${lines.filter(l => l.trim()).map(l => `<li>${l.replace(/^\s*([-*]|\d+\.)\s+/, "")}</li>`).join("")}</ul>`;
        return `<p>${p.replace(/\n/g, "<br>")}</p>`;
      }).join("").replace(/`([^`]+)`/g, "<code>$1</code>").replace(/\*\*([^*]+)\*\*/g, "<b>$1</b>");
    }).join("");
  }

  /* ---------- the panel ---------- */
  const ROBOT = `<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="5" y="8" width="14" height="11" rx="3"/><circle cx="9.5" cy="13" r="1.4"/><circle cx="14.5" cy="13" r="1.4"/><path d="M12 8V5M10 17h4M3 13h2M19 13h2"/><circle cx="12" cy="4" r="1"/></svg>`;
  const ICON = { x: '<path d="M6 6l12 12M18 6L6 18"/>', send: '<path d="M4 12l16-8-6 16-2-7z"/>', trash: '<path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3"/>', copy: '<rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V5a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h3"/>' };
  const ic = n => `<svg viewBox="0 0 24 24" aria-hidden="true">${ICON[n]}</svg>`;
  let fab, panel, log, input, hintOn = false, busy = false, lastFocus = null;
  const STARTERS = {
    portal: ["What is a resistor?", "How does a servo work?", "What is machine learning?", "Why does an LED need a resistor?"],
    circuit: ["Why does my LED need a resistor?", "How do I read a button?", "What is PWM?", "How does the ultrasonic sensor work?"],
    codelab: ["What is a for loop?", "How do I use input()?", "What is a function?", "What is a list?"],
  };
  function build() {
    document.body.classList.add("bd-app-" + APP);
    fab = document.createElement("button");
    fab.className = "bd-fab"; fab.type = "button"; fab.setAttribute("aria-haspopup", "dialog"); fab.setAttribute("aria-expanded", "false");
    fab.innerHTML = `${ROBOT}<span>Study Buddy</span>`; fab.title = "Ask Study Buddy";
    panel = document.createElement("section");
    panel.className = "bd-panel"; panel.hidden = true; panel.setAttribute("role", "dialog"); panel.setAttribute("aria-labelledby", "bdTitle");
    panel.innerHTML = `<header class="bd-h"><span class="bd-av">${ROBOT}</span><div class="bd-tt"><b id="bdTitle">Study Buddy</b><small>${USE_AI ? "AI helper · it can make mistakes" : "Answers from our club lessons"}</small></div>
        <button class="bd-ib" data-bclear title="Clear chat" aria-label="Clear chat">${ic("trash")}</button><button class="bd-ib" data-bclose title="Close" aria-label="Close Study Buddy">${ic("x")}</button></header>
      <div class="bd-mode" role="group" aria-label="How should I explain?"><button data-bmode="simple">Explain like I'm 10</button><button data-bmode="deep">Go deeper</button></div>
      <div class="bd-log" role="log" aria-live="polite" aria-label="Conversation"></div>
      <div class="bd-quick"></div>
      <form class="bd-in"><textarea rows="1" maxlength="${MAXLEN}" placeholder="Ask about circuits, code or a lesson…" aria-label="Your question"></textarea><button type="submit" class="bd-send" aria-label="Send">${ic("send")}</button></form>
      <p class="bd-foot">Saved on this device only. Never share your name, address or phone number.</p>`;
    document.body.append(fab, panel);
    log = $(".bd-log", panel); input = $("textarea", panel);
    fab.addEventListener("click", () => open());
    panel.addEventListener("click", onClick);
    $(".bd-in", panel).addEventListener("submit", e => { e.preventDefault(); send(input.value); });
    input.addEventListener("keydown", e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(input.value); } });
    input.addEventListener("input", () => { input.style.height = "auto"; input.style.height = Math.min(120, input.scrollHeight) + "px"; });
    document.addEventListener("keydown", e => {
      if (panel.hidden) return;
      if (e.key === "Escape") { e.stopPropagation(); close(); return; }
      /* Tab goes round the panel while it is open */
      if (e.key === "Tab") {
        const f = [...panel.querySelectorAll("button:not([disabled]), textarea, a[href]")].filter(el => el.offsetParent !== null);
        if (!f.length) return;
        const first = f[0], last = f[f.length - 1];
        if (!panel.contains(document.activeElement)) { e.preventDefault(); first.focus(); }
        else if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    }, true);
  }
  function syncMode() { panel.querySelectorAll("[data-bmode]").forEach(b => { const on = b.dataset.bmode === ST.mode; b.classList.toggle("on", on); b.setAttribute("aria-pressed", on); }); }
  function quick() {
    const c = context(), q = [];
    if (c.error) q.push(`<button class="bd-chip act" data-bact="error" title="This sends your error and code">Explain this error <small>sends your code</small></button>`);
    if (c.page === "circuit" || c.page === "codelab") q.push(`<button class="bd-chip act" data-bact="code" title="This sends your code">Help with my code <small>sends your code</small></button>`);
    q.push(`<button class="bd-chip ${hintOn ? "on" : ""}" data-bhint aria-pressed="${hintOn}">Give me a hint, not the answer</button>`);
    $(".bd-quick", panel).innerHTML = q.join("");
  }
  function msgHTML(m) {
    if (m.r === "u") return `<div class="bd-m u"><p>${esc(m.t)}</p></div>`;
    const body = m.h != null ? m.h : md(m.t);
    return `<div class="bd-m b ${m.s === "ai" ? "ai" : ""}">${body}${m.note ? `<p class="bd-note">${esc(m.note)}</p>` : ""}</div>`;
  }
  function renderLog() {
    if (!ST.msgs.length) {
      const c = context(), st = STARTERS[APP].slice();
      if (c.lesson) st.unshift(`What do I need for ${String(c.lesson).split(" ")[0]}?`);
      log.innerHTML = `<div class="bd-hello"><span class="bd-av big">${ROBOT}</span><p><b>Hi! I'm Study Buddy.</b> Ask me about circuits, code, robots, AI or any club lesson.</p><div class="bd-starts">${st.slice(0, 4).map(s => `<button class="bd-chip" data-bask="${esc(s)}">${esc(s)}</button>`).join("")}</div></div>`;
      return;
    }
    log.innerHTML = ST.msgs.map(msgHTML).join("");
    addCopy(log); log.scrollTop = log.scrollHeight;
  }
  function addCopy(root) {
    root.querySelectorAll(".bd-m.b pre").forEach(p => { if (p.querySelector(".bd-copy")) return; const b = document.createElement("button"); b.className = "bd-copy"; b.type = "button"; b.dataset.bcopy = ""; b.innerHTML = `${ic("copy")}<span>Copy</span>`; b.setAttribute("aria-label", "Copy this code"); p.appendChild(b); });
  }
  function onClick(e) {
    const t = e.target.closest("button"); if (!t) return;
    const d = t.dataset;
    if ("bclose" in d) return close();
    if ("bclear" in d) { if (ST.msgs.length && !confirm("Clear this chat?")) return; ST.msgs = []; ST.lastTopic = ""; persist(); renderLog(); input.focus(); return; }
    if (d.bmode) { ST.mode = d.bmode; persist(); syncMode(); return; }
    if ("bhint" in d) { hintOn = !hintOn; quick(); return; }
    if (d.bact) return send(d.bact === "error" ? "Explain this error" : "Help with my code", d.bact);
    if (d.bask) return send(d.bask);
    if ("bcopy" in d) { const code = t.parentElement.querySelector("code"); if (code && navigator.clipboard) navigator.clipboard.writeText(code.innerText).then(() => { t.querySelector("span").textContent = "Copied"; setTimeout(() => { t.querySelector("span").textContent = "Copy"; }, 1500); }); }
  }
  async function send(text, action) {
    const q = String(text || "").trim().slice(0, MAXLEN);
    if (!q || busy) return;
    input.value = ""; input.style.height = "auto";
    await ensureData();
    if (PERSONAL.some(re => re.test(q))) {
      ST.msgs.push({ r: "b", h: `<p class="bd-safe">🔒 That looks like personal information (an email, phone number, address or password). Please don't share it here. Ask your question again without it.</p>`, s: "local" });
      persist(); renderLog(); return;
    }
    const ctx = context(), hint = hintOn || HOMEWORK.test(norm(q));
    ST.msgs.push({ r: "u", t: q }); persist(); renderLog();
    busy = true; panel.classList.add("busy");
    const tmp = document.createElement("div"); tmp.className = "bd-m b typing"; tmp.innerHTML = `<span class="bd-dots"><i></i><i></i><i></i></span>`; log.appendChild(tmp); log.scrollTop = log.scrollHeight;
    const o = { ctx, hint, action };
    let msg;
    if (USE_AI && navigator.onLine !== false) {
      try {
        const t = await askWorker(q, o, partial => { tmp.classList.remove("typing"); tmp.innerHTML = md(partial); log.scrollTop = log.scrollHeight; });
        msg = { r: "b", t, s: "ai" };
      } catch (e) {
        msg = { r: "b", h: answerLocal(q, o), s: "local", note: e.status === 429 ? "Study Buddy's AI has answered a lot today, so this answer comes from our lessons." : "The AI helper isn't available right now, so this answer comes from our lessons." };
      }
    } else msg = { r: "b", h: answerLocal(q, o), s: "local" };
    tmp.remove(); ST.msgs.push(msg); persist(); renderLog();
    busy = false; panel.classList.remove("busy"); hintOn = false; quick();
  }
  function open(opts) {
    if (!panel) build();
    lastFocus = document.activeElement;
    panel.hidden = false; fab.setAttribute("aria-expanded", "true"); document.body.classList.add("bd-open");
    syncMode(); quick(); renderLog(); ensureData().then(renderLog);
    setTimeout(() => input.focus(), 30);
    if (opts && opts.ask) send(opts.ask);
  }
  function close() {
    panel.hidden = true; fab.setAttribute("aria-expanded", "false"); document.body.classList.remove("bd-open");
    if (lastFocus && document.contains(lastFocus)) lastFocus.focus(); else fab.focus();
  }

  const start = () => { build(); window.StudyBuddy = { open, close }; };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start); else start();
})();
