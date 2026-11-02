/* Robotics & AI Club teacher-guide generator.

   A guide is a plain JS object (guides/<CODE>.js). This lays it out as an A4
   portrait PDF in the same house style as the slides: the paper, the fonts,
   the hand-drawn boxes and the sticky notes, and writes it where the portal
   looks for it.

   node guide.js guides/EF-10.js          -> library/guides/EF-10_Teacher_Guide.pdf
   node guide.js guides/EF-10.js --png    also a PNG of each page in out/<CODE>-guide/

   The twelve sections are the ones in rai/SLIDE_GUIDE.md, section 5. */

const fs = require("fs");
const path = require("path");
let chromium, viaChrome = false;
try { ({ chromium } = require("playwright")); } catch (e) { ({ chromium } = require("playwright-core")); viaChrome = true; }

const HERE = __dirname;
const ROOT = path.join(HERE, "..", "..");

/* the activity's catalogue entry, so the guide can never disagree with the portal */
global.window = {};
require(path.join(ROOT, "rai", "catalog.js"));
const RAI = global.window.RAI;

const esc = s => String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const md = s => esc(s)
  .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
  .replace(/`(.+?)`/g, "<code>$1</code>");

const TYPE = { H: "Hardware", S: "Software", U: "Unplugged", HS: "Hardware + software", US: "Unplugged + software" };
const CAT = { EF: ["#E0892B", "#FDF1E3"], ROB: ["#2E6BE6", "#E8F0FD"], AI: ["#7B3FC4", "#F1E9FB"], IS: ["#14967F", "#E3F6F2"] };

const FRAME = `<svg class="frame fb" preserveAspectRatio="none" viewBox="0 0 100 100"><rect width="100" height="100" rx="1"/></svg><svg class="frame fa" preserveAspectRatio="none" viewBox="0 0 100 100"><rect width="100" height="100" rx="1"/></svg>`;
const box = (inner, cls = "") => `<div class="box ${cls}">${FRAME}<div class="inner">${inner}</div></div>`;
const note = (label, text, cls = "") => `<div class="note ${cls}">${FRAME}<div class="inner"><b>${esc(label)}</b><span>${md(text)}</span></div></div>`;
const table = (cols, rows, cls = "") => `<table class="tbl ${cls}"><tr>${cols.map(c => `<th>${esc(c)}</th>`).join("")}</tr>${rows.map(r => `<tr>${r.map(c => `<td>${md(c)}</td>`).join("")}</tr>`).join("")}</table>`;
const code = src => `<pre class="code">${esc(src)
  .replace(/(\/\/[^\n]*)/g, '<span class="cm">$1</span>')
  .replace(/\b(void|int|float|long|unsigned|const|if|else|for|while|return|bool|byte|volatile)\b/g, '<span class="kw">$1</span>')}</pre>`;
let secN = 0;
const sec = (title, body, cls = "") => `<section class="sec ${cls}"><h2><span>${++secN}</span>${esc(title)}</h2>${body}</section>`;

function html(g) {
  const a = RAI.activities.find(x => x.code === g.code);
  if (!a) throw new Error("no activity " + g.code + " in rai/catalog.js");
  const cat = RAI.cats.find(c => g.code.startsWith(c.key + "-"));
  const mod = RAI.modules.find(m => m.key === a.mod);
  const [c, l] = CAT[cat.key];
  const total = g.timing.reduce((s, r) => s + r[0], 0);
  if (total !== a.mins) throw new Error(`${g.code}: the timing plan adds up to ${total} min, the lesson is ${a.mins}`);
  secN = 0;

  const glance = `<div class="glance">
    ${[["Length", `${a.mins} minutes`], ["Type", TYPE[a.type] || a.type], ["Grouping", g.grouping], ["Concepts", a.concepts.join(" · ")]]
      .map(([k, v]) => `<div><small>${k}</small><b>${esc(v)}</b></div>`).join("")}</div>`;

  const depths = `<div class="depths">${["starter", "core", "advanced"].map(t => `<div class="depth d-${t}">${FRAME}<div class="inner">
      <span class="lvl">${t[0].toUpperCase() + t.slice(1)}</span><p class="dt">${md(a.tiers[t])}</p><p>${md(g.depths[t])}</p></div></div>`).join("")}</div>`;

  const kit = `<ul class="kit">${g.kit.map(k => `<li>${md(k.replace(/^★/, ""))}${k.startsWith("★") ? ' <i class="star">★ not in the lab yet</i>' : ""}</li>`).join("")}</ul>`;
  const prep = `<ul class="checks">${g.prep.map(p => `<li>${md(p)}</li>`).join("")}</ul>`;

  const steps = g.steps.map(s => `<div class="step">
      <div class="step-h"><b>${esc(s.phase)}</b><span>${s.mins} min${s.slides ? " · slides " + esc(s.slides) : ""}</span></div>
      ${(s.say || []).map(t => `<p class="say"><em>Say:</em> ${md(t)}</p>`).join("")}
      ${s.do && s.do.length ? `<ul class="do">${s.do.map(t => `<li>${md(t)}</li>`).join("")}</ul>` : ""}
      ${s.watch ? `<p class="watch"><em>Look for:</em> ${md(s.watch)}</p>` : ""}
    </div>`).join("");

  const rubric = `<table class="tbl rubric"><tr><th></th><th>Emerging</th><th>Secure</th><th>Extending</th></tr>
    ${g.rubric.map(r => `<tr><td>${md(r[0])}</td><td>${md(r[1])}</td><td>${md(r[2])}</td><td>${md(r[3])}</td></tr>`).join("")}</table>`;

  const answers = g.answers.map(([q, ans]) => `<div class="qa"><p class="q">${md(q)}</p><p class="a">${md(ans)}</p></div>`).join("");

  return `<!doctype html><html><head><meta charset="utf-8"><link rel="stylesheet" href="guide.css">
<style>:root{--c:${c};--l:${l}}</style></head><body>
<svg width="0" height="0" style="position:absolute"><defs><filter id="rough"><feTurbulence type="fractalNoise" baseFrequency="0.032" numOctaves="2" seed="7" result="n"/><feDisplacementMap in="SourceGraphic" in2="n" scale="1.8" xChannelSelector="R" yChannelSelector="G"/></filter></defs></svg>
<header class="cover">
  <div class="chips"><span class="chip">${esc(a.code)}</span><span class="tag">TEACHER GUIDE</span></div>
  <div class="series">${esc(cat.name)} · ${esc(mod.name)}</div>
  <h1>${esc(a.title)}</h1>
  <p class="hook">${esc(a.hook)}</p>
</header>
${sec("At a glance", glance, "keep")}
${sec("Overview", `<p>${md(g.overview)}</p>${note("The one idea that must land", g.mustLand)}`, "keep")}
${sec("Learning outcomes", `<p class="lead">By the end, students can:</p><ol class="outcomes">${g.outcomes.map(o => `<li>${md(o)}</li>`).join("")}</ol>`, "keep")}
${sec("Three depths", `<p class="lead">Pick one for the class. Everyone does the same lesson; only the build target changes.</p>${depths}`, "keep")}
${sec("Before the lesson", `<div class="two">${box(`<h3>Kit, per group of 2</h3>${kit}`)}${box(`<h3>Simulators</h3><ul class="kit">${g.sims.map(s => `<li>${md(s)}</li>`).join("")}</ul>`)}</div>
  ${box(`<h3>Prep checklist</h3>${prep}`, "wide")}`)}
${sec("Timing plan", table(["Min", "Phase", "What happens"], g.timing.map(r => [String(r[0]), r[1], r[2]])) + `<p class="sum">Total: ${total} minutes</p>`, "keep")}
${sec("Step by step", steps, "steps")}
${sec("Common misconceptions", table(["Students may think", "How to help"], g.misconceptions))}
${sec("Troubleshooting", table(["Problem", "Fix"], g.trouble))}
${sec("Assessment rubric", rubric, "keep")}
${sec("Answers", answers)}
${sec("Safety", `<ul class="safety">${g.safety.map(s => `<li>${md(s)}</li>`).join("")}</ul>`, "keep")}
${g.appendix ? sec(g.appendix.title, `<p>${md(g.appendix.text)}</p>${code(g.appendix.code)}`) : ""}
</body></html>`;
}

(async () => {
  const src = path.resolve(process.argv[2]);
  delete require.cache[src];
  const g = require(src);
  const a = RAI.activities.find(x => x.code === g.code);
  const tmp = path.join(HERE, ".guide.html");
  fs.writeFileSync(tmp, html(g));
  const out = path.join(ROOT, "library", "guides", `${g.code}_Teacher_Guide.pdf`);
  fs.mkdirSync(path.dirname(out), { recursive: true });

  const b = await chromium.launch(viaChrome ? { channel: "chrome" } : {});
  const p = await b.newPage();
  await p.goto("file://" + tmp, { waitUntil: "networkidle" });
  await p.evaluate(() => document.fonts.ready);
  await p.pdf({
    path: out, format: "A4", printBackground: true,
    margin: { top: "14mm", bottom: "16mm", left: "14mm", right: "14mm" },
    displayHeaderFooter: true, headerTemplate: "<span></span>",
    footerTemplate: `<div style="width:100%;font:8px Helvetica,Arial,sans-serif;color:#8A94A6;padding:0 14mm;display:flex;justify-content:space-between">
      <span>Robotics &amp; AI Club · Teacher guide · ${esc(g.code)} ${esc(a.title)} · Curriculum by Qasim Mushtaq</span>
      <span><span class="pageNumber"></span> / <span class="totalPages"></span></span></div>`,
  });
  if (process.argv.includes("--png")) {
    const dir = path.join(HERE, "out", g.code + "-guide");
    fs.rmSync(dir, { recursive: true, force: true }); fs.mkdirSync(dir, { recursive: true });
    await p.setViewportSize({ width: 794, height: 1123 });
    await p.screenshot({ path: path.join(dir, "all.png"), fullPage: true });
  }
  await b.close();
  console.log(`${path.relative(ROOT, out)}  ${(fs.statSync(out).size / 1024).toFixed(0)} KB`);
})();
