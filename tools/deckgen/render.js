/* Robotics & AI Club deck generator.

   A deck is a plain JS array of slide objects. This turns it into HTML and
   prints it to a 16:9 PDF with Playwright, in the club's house style.

   node render.js decks/EF-10.js out/EF-10.pdf [--png] [--banner]
   --banner also writes the deck's portal tile to library/banners/<code>.jpg
*/

const fs = require("fs");
const path = require("path");
/* the full playwright package brings its own browser; playwright-core uses
   the Google Chrome already installed on the machine */
let chromium, viaChrome = false;
try { ({ chromium } = require("playwright")); } catch (e) { ({ chromium } = require("playwright-core")); viaChrome = true; }

const HERE = __dirname;
const ART = require("./art.js");            // the hand-drawn doodle library
const { DIAGRAMS } = require("./diagrams.js"); // hand-drawn explanatory figures
const { CIRCUITS } = require("./circuits.js"); // hand-drawn wiring diagrams

/* ---------- small helpers ---------- */
const esc = s => String(s == null ? "" : s)
  .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
/* **bold** and `code` inside slide text */
const md = s => esc(s)
  .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
  .replace(/`(.+?)`/g, '<code style="font-family:JetBrains Mono,monospace;font-size:.92em">$1</code>');

const COLORS = ["teal", "red", "orange", "blue", "green", "purple", "amber"];
const art = (name, cls = "") => name && ART.svg ? `<span class="art ${cls}">${ART.svg(name)}</span>` : "";

/* a hand-drawn frame: two rough rectangles, which is what makes the
   double wobbly outline in the club's decks */
const FRAME = `<svg class="frame fb" preserveAspectRatio="none" viewBox="0 0 100 100"><rect x="0" y="0" width="100" height="100" rx="1"/></svg>
<svg class="frame fa" preserveAspectRatio="none" viewBox="0 0 100 100"><rect x="0" y="0" width="100" height="100" rx="1"/></svg>`;
const frame = () => FRAME;

/* ---------- block renderers ---------- */
function block(b) {
  if (typeof b === "string") return `<p>${md(b)}</p>`;
  switch (b.t) {

    case "box": return `<div class="box fill c-${b.color || "blue"}" ${style(b)}>${frame(true)}
      <div class="inner">
        ${b.icon ? bic(b.icon) : ""}${b.h ? `<h3>${md(b.h)}</h3>` : ""}
        ${b.text ? `<p>${md(b.text)}</p>` : ""}
        ${b.points ? `<ul style="margin:4px 0 0 17px">${b.points.map(p => `<li>${md(p)}</li>`).join("")}</ul>` : ""}
        ${b.art ? `<div class="art" style="height:${b.artH || 96}px;margin:8px 0 2px">${ART.svg(b.art)}</div>` : ""}
        ${b.code ? code(b.code) : ""}
      </div></div>`;

    case "note": return `<div class="note ${b.teal ? "teal" : ""}" ${style(b)}>${frame()}
      <div class="inner">${b.l ? `<b>${esc(b.l)}</b>` : ""}<span>${md(b.text)}</span></div></div>`;

    case "rows": return `<div class="rows${b.fill === false ? "" : " fill"}" ${style(b)}>${b.items.map((r, i) => `
      <div class="row c-${r.color || COLORS[(i + 0) % 6]}">${frame()}
        ${r.n !== false ? `<span class="n">${r.n || i + 1}</span>` : ""}
        ${r.icon ? ART.svg(r.icon, "", "ic") : ""}
        <span class="t">${md(r.t)}${r.a ? `<span class="a">${md(r.a)}</span>` : ""}</span>
      </div>`).join("")}</div>`;

    case "table": return `<div class="box fill c-${b.color || "teal"}" style="padding:14px 18px;${b.style || ""}">${frame(true)}
      <div class="inner"><table class="tbl" style="--accent:var(--${b.color || "teal"})">
        ${b.cols ? `<tr>${b.cols.map(c => `<th>${esc(c)}</th>`).join("")}</tr>` : ""}
        ${b.rows.map(r => `<tr class="${r.hl ? "hl" : ""}">${(r.cells || r).map(c => `<td>${md(c)}</td>`).join("")}</tr>`).join("")}
      </table></div></div>`;

    case "pills": return `<div class="pills" ${style(b)}>${b.items.map((p, i) =>
      `<span class="pill" style="background:var(--${p.color || COLORS[i % 6]})">${esc(p.t || p)}</span>`).join("")}</div>`;

    case "art": return `<div class="art" ${style(b)}>${ART.svg(b.name)}</div>`;

    case "fig": {
      const g = DIAGRAMS[b.name];
      if (!g) throw new Error("no diagram called " + b.name);
      return `<figure class="fig-wrap" ${style(b)}>${g()}
        ${b.cap ? `<figcaption>${md(b.cap)}</figcaption>` : ""}</figure>`;
    }

    case "figbox": {
      const g = DIAGRAMS[b.name];
      if (!g) throw new Error("no diagram called " + b.name);
      return `<div class="box fill c-${b.color || "blue"}" ${style(b)}>${frame()}
        <div class="inner">${b.h ? `<h3>${md(b.h)}</h3>` : ""}
          <figure class="fig-wrap">${g()}${b.cap ? `<figcaption>${md(b.cap)}</figcaption>` : ""}</figure>
        </div></div>`;
    }

    case "code": return code(b.text, b.style);

    case "stripe": return `<div class="box fill c-${b.color || "purple"}" ${style(b)}>${frame(true)}
      <div class="inner"><p>${b.l ? `<strong style="color:var(--${b.color || "purple"})">${esc(b.l)}</strong> ` : ""}${md(b.text)}</p></div></div>`;

    case "steps": return `<div class="box fill c-${b.color || "orange"}" ${style(b)}>${frame(true)}
      <div class="inner">${b.h ? `<h3>${md(b.h)}</h3>` : ""}
      <ol style="margin:2px 0 0 19px">${b.items.map(s => `<li style="margin:3px 0">${md(s)}</li>`).join("")}</ol></div></div>`;

    case "circuit": {
      const g = CIRCUITS[b.name];
      if (!g) throw new Error("no circuit called " + b.name);
      return `<div class="box fill c-${b.color || "blue"}" ${style(b)}>${frame()}
        <div class="inner">${b.h ? `<h3>${md(b.h)}</h3>` : ""}
          <figure class="fig-wrap">${g()}${b.cap ? `<figcaption>${md(b.cap)}</figcaption>` : ""}</figure>
        </div></div>`;
    }

    /* the wiring table: every row is one wire, with a swatch of its colour */
    case "conn": {
      const WIRE = { pwr: "#E0414B", gnd: "#262D47", out: "#2E6BE6", in: "#1DA14E", mot: "#7B3FC4", aux: "#E8591F" };
      return `<div class="box fill c-${b.color || "teal"}" style="padding:14px 18px;${b.style || ""}">${frame()}
        <div class="inner">${b.h ? `<h3>${md(b.h)}</h3>` : ""}
        <table class="conn" style="--accent:var(--${b.color || "teal"})">
          <tr><th></th><th>${esc(b.from || "From")}</th><th>${esc(b.to || "To")}</th><th>${esc(b.why || "Carries")}</th></tr>
          ${b.rows.map(r => `<tr>
            <td class="sw"><span style="background:${WIRE[r.w] || WIRE.out}"></span></td>
            <td class="a">${md(r.a)}</td><td class="b">${md(r.b)}</td>
            <td class="c">${md(r.c || "")}</td></tr>`).join("")}
        </table>
        ${b.foot ? `<p class="conn-foot">${md(b.foot)}</p>` : ""}
        </div></div>`;
    }

    case "html": {
      if (b.rows) {
        const rows = b.rows.map((r, i) => `<div class="row c-${r.color || COLORS[i % 6]}">${frame()}
          <span class="n">${i + 1}</span>${r.icon ? ART.svg(r.icon, "", "ic") : ""}
          <span class="t">${md(r.t)}${r.a ? `<span class="a">${md(r.a)}</span>` : ""}</span></div>`).join("");
        return b.html.replace("__ROWS__", rows);
      }
      return b.html;
    }
    default: return "";
  }
}
const style = b => b.style ? `style="${b.style}"` : "";
/* the outline icon at the left of a box, in the box's colour */
const bic = name => `<span class="bic">${ART.svg(name, "", "", "currentColor")}</span>`;

function code(src, extra = "") {
  const h = esc(src)
    .replace(/(\/\/[^\n]*)/g, '<span class="cm">$1</span>')
    .replace(/\b(void|int|float|const|if|else|for|while|return|bool|byte|long|char)\b/g, '<span class="kw">$1</span>')
    .replace(/("[^"]*")/g, '<span class="st">$1</span>');
  return `<div class="code" ${extra ? `style="${extra}"` : ""}>${h}</div>`;
}

/* ---------- slide shell ---------- */
const DECO = [
  { x: 388, y: 24, s: 1.0, d: "star", c: "#E6C76A" },
  { x: 905, y: 70, s: .9, d: "chip", c: "#9FD6D2" },
  { x: 962, y: 282, s: .8, d: "bolt", c: "#F0C98A" },
  { x: 18, y: 168, s: .7, d: "sparkle", c: "#E79AA0" },
  { x: 20, y: 440, s: .9, d: "squiggle", c: "#8FCFC9" },
  { x: 960, y: 430, s: .8, d: "gear", c: "#E7B9BC" },
  { x: 430, y: 520, s: .9, d: "squiggle", c: "#C9BFA8" },
];

function slide(s, i, n, deck) {
  const accent = s.accent || deck.accent || "teal";
  const blobs = (s.blobs || []).map(b =>
    `<span class="blob" style="left:${b.x}px;top:${b.y}px;width:${b.w}px;height:${b.h || b.w}px;background:${b.c}"></span>`).join("");
  const deco = (s.deco === false ? [] : DECO).map(d =>
    `<span class="deco" style="left:${d.x}px;top:${d.y}px;transform:scale(${d.s});color:${d.c}">${ART.svg(d.d, "", "", d.c)}</span>`).join("");

  const head = s.bare ? "" : `<div class="head">
    ${s.kicker ? `<div class="kicker">${esc(s.kicker)}</div>` : ""}
    ${s.title ? `<h1 class="title">${md(s.title)}</h1>` : ""}</div>`;

  return `<section class="slide" style="--accent:var(--${accent})">
    ${blobs}${deco}
    ${s.bare ? "" : `<span class="chip">${esc(deck.code)} · ${esc(deck.title)}</span>`}
    ${s.tag ? `<span class="tag">${esc(s.tag)}</span>` : ""}
    ${head}
    <div class="body" ${s.bodyStyle ? `style="${s.bodyStyle}"` : ""}>${(s.blocks || []).map(block).join("")}</div>
    ${s.raw || ""}
    <div class="foot"><span>Robotics &amp; AI Club · ${esc(deck.series)} · Curriculum by Qasim Mushtaq</span><span class="pg">${i + 1} / ${n}</span></div>
  </section>`;
}

/* ---------- document ---------- */
function html(deck) {
  const n = deck.slides.length;
  return `<!doctype html><html><head><meta charset="utf-8">
<link rel="stylesheet" href="theme.css">
<style>:root{--accent:var(--${deck.accent || "teal"})}</style></head><body>
<svg width="0" height="0" style="position:absolute"><defs>
  <filter id="rough"><feTurbulence type="fractalNoise" baseFrequency="0.032" numOctaves="2" seed="7" result="n"/>
  <feDisplacementMap in="SourceGraphic" in2="n" scale="1.8" xChannelSelector="R" yChannelSelector="G"/></filter>
  <filter id="rai-rough"><feTurbulence type="fractalNoise" baseFrequency="0.028" numOctaves="2" seed="3" result="n"/>
  <feDisplacementMap in="SourceGraphic" in2="n" scale="2.2" xChannelSelector="R" yChannelSelector="G"/></filter>
</defs></svg>
${deck.slides.map((s, i) => slide(s, i, n, deck)).join("\n")
  .replace(/<div class="inner"><h3 ic="([a-z0-9]+)">/g, (m, k) => `<div class="inner">${bic(k)}<h3>`)}
</body></html>`;
}

/* ---------- run ---------- */
(async () => {
  const src = path.resolve(process.argv[2]);
  const out = path.resolve(process.argv[3] || src.replace(/\.js$/, ".pdf"));
  delete require.cache[src];
  const deck = require(src);
  const doc = html(deck);
  const tmp = path.join(HERE, ".deck.html");
  fs.writeFileSync(tmp, doc);

  const b = await chromium.launch(viaChrome ? { channel: "chrome" } : {});
  const p = await (await b.newContext()).newPage();
  await p.goto("file://" + tmp, { waitUntil: "networkidle" });
  await p.evaluate(() => document.fonts.ready);
  await p.waitForTimeout(400);

  /* autofit: nothing is allowed to spill out of the body area. Shrink the
     code blocks first, then lay the slide out in a taller box and scale it
     down, which keeps the margins honest. */
  const spill = await p.evaluate(() => {
    const over = body => {
      const r = body.getBoundingClientRect();
      let o = 0;
      body.querySelectorAll("*").forEach(e => {
        if (e.closest(".frame")) return;
        const b = e.getBoundingClientRect();
        if (b.height && b.bottom > r.bottom + 8) o = Math.max(o, b.bottom - r.bottom);
      });
      return o;
    };
    const left = [];
    document.querySelectorAll(".slide .body").forEach((body, i) => {
      if (over(body) <= 0) return;
      let size = 12.2;
      const codes = body.querySelectorAll(".code");
      while (codes.length && size > 8.6 && over(body) > 0) {
        size -= 0.4;
        codes.forEach(c => { c.style.fontSize = size + "px"; c.style.lineHeight = "1.5"; });
      }
      if (over(body) > 0) {
        const r = body.getBoundingClientRect();
        const w = r.width, h = r.height;
        body.style.right = "auto"; body.style.bottom = "auto";
        body.style.transformOrigin = "top left";
        for (let k = 0.98; k >= 0.6; k -= 0.02) {
          body.style.width = (w / k) + "px";
          body.style.height = (h / k) + "px";
          body.style.transform = "scale(" + k + ")";
          if (over(body) <= 0) break;
        }
      }
      if (over(body) > 0) left.push(i + 1);
    });
    return left;
  });
  if (spill.length) console.log("still overflowing: " + spill.join(", "));
  fs.mkdirSync(path.dirname(out), { recursive: true });
  await p.pdf({ path: out, width: "13.89in", height: "7.82in", scale: 1.33344, printBackground: true, pageRanges: "" });

  /* a PNG of each slide too, for quick checking */
  if (process.argv.includes("--png")) {
    const dir = out.replace(/\.pdf$/, "-png");
    fs.mkdirSync(dir, { recursive: true });
    const els = await p.$$(".slide");
    for (let i = 0; i < els.length; i++) await els[i].screenshot({ path: `${dir}/${String(i + 1).padStart(2, "0")}.png` });
    console.log(`pngs: ${dir}`);
  }
  /* the tile banner for the portal: the title slide's drawing on the
     category colour, 720 x 240 like every other banner in library/banners */
  if (process.argv.includes("--banner")) {
    const fig = await p.$(".slide .t-fig");
    if (fig) {
      /* only the drawing: the slide's paper, blobs and words are hidden */
      await p.evaluate(() => {
        const sl = document.querySelector(".slide"), f = sl.querySelector(".t-fig");
        sl.style.background = "transparent";
        document.documentElement.style.background = document.body.style.background = "transparent";
        [...sl.children].forEach(c => { if (c !== f) c.style.visibility = "hidden"; });
        window.scrollTo(0, 0);   // the slide PNGs leave the page scrolled to the end
      });
      const r = await fig.boundingBox(), pad = 16;
      const png = (await p.screenshot({ omitBackground: true, clip: { x: r.x - pad, y: r.y - pad, width: r.width + 2 * pad, height: r.height + 2 * pad } })).toString("base64");
      const bp = await (await b.newContext({ viewport: { width: 720, height: 240 } })).newPage();
      /* the category's colours, as on its portal cards (rai/catalog.js) */
      const CAT = { EF: ["#FDF1E3", "#E0892B"], ROB: ["#E8F0FD", "#2E6BE6"], AI: ["#F1E9FB", "#7B3FC4"], IS: ["#E3F6F2", "#14967F"] };
      const [light, strong] = CAT[deck.code.split("-")[0]] || ["#FFF9F0", "#8A94A6"];
      await bp.setContent(`<body style="margin:0"><div style="width:720px;height:240px;background:${light};border-bottom:6px solid ${strong};box-sizing:border-box;display:grid;place-items:center">
        <img src="data:image/png;base64,${png}" style="max-width:660px;max-height:222px"></div></body>`);
      const dst = path.join(HERE, "..", "..", "library", "banners", deck.code + ".jpg");
      await bp.screenshot({ path: dst, type: "jpeg", quality: 82 });
      console.log(`banner: ${path.relative(path.join(HERE, "..", ".."), dst)}`);
    }
  }
  await b.close();
  console.log(`${out}  ${deck.slides.length} slides  ${(fs.statSync(out).size / 1024).toFixed(0)} KB`);
})();
