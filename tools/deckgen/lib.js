/* Slide patterns shared by every deck, so the house order is enforced by
   the code rather than remembered by whoever writes the next one. */

const titleSlide = ({ series, main, accentWords = [], hook, pills, art, fig, note }) => {
  let title = main;
  accentWords.forEach(w => { title = title.replace(w, `<em>${w}</em>`); });
  return {
    bare: true, deco: false,
    blobs: [{ x: -150, y: -170, w: 520, c: "#DCEFEC" }, { x: 640, y: 300, w: 480, c: "#FBEFD4" }],
    raw: `<div style="position:absolute;left:70px;top:150px;width:560px;z-index:4">
      <div class="t-series">${series}</div>
      <h1 class="t-main">${title}</h1>
      <div class="t-hook">${hook}</div>
      <div class="pills" style="margin-top:22px">${pills.map((p, i) =>
        `<span class="pill" style="background:var(--${["orange", "blue", "green", "purple"][i % 4]})">${p}</span>`).join("")}</div>
    </div>
    ${fig ? `<div style="position:absolute;right:48px;top:120px;width:360px;height:230px;z-index:4">${fig}</div>`
          : `<div class="art" style="position:absolute;right:90px;top:150px;width:260px;height:220px;z-index:4">${art}</div>`}
    ${note ? `<div class="note" style="position:absolute;left:70px;bottom:62px;width:600px;z-index:4">
      <svg class="frame fb" preserveAspectRatio="none" viewBox="0 0 100 100"><rect width="100" height="100" rx="1"/></svg>
      <svg class="frame fa" preserveAspectRatio="none" viewBox="0 0 100 100"><rect width="100" height="100" rx="1"/></svg>
      <div class="inner"><b>Did you know?</b><span>${note}</span></div></div>` : ""}`,
  };
};

const divider = ({ part, main, sub, pills, art }) => ({
  bare: true, deco: false,
  blobs: [{ x: 560, y: -170, w: 560, c: "#FAE3CF" }, { x: -180, y: 300, w: 460, c: "#DCE6FB" }],
  raw: `<div style="position:absolute;left:70px;top:208px;width:560px;z-index:4">
    <div class="d-part">${part}</div>
    <h1 class="d-main">${main}</h1>
    <div class="d-sub">${sub}</div>
    ${pills ? `<div class="pills" style="margin-top:22px">${pills.map((p, i) =>
      `<span class="pill" style="background:var(--${["orange", "blue", "green"][i % 3]})">${p}</span>`).join("")}</div>` : ""}
  </div>
  <div class="art" style="position:absolute;right:100px;top:160px;width:250px;height:230px;z-index:4">${art}</div>`,
});

/* objectives + the matching "prove it" slide, written once */
const objectives = (items, keywords) => ({
  tag: "LEARN", kicker: "Learning aims", title: "Today I will learn to...",
  blocks: [{
    t: "html", html: `<div style="display:grid;grid-template-columns:1fr 288px;gap:24px;height:100%">
      <div class="rows">__ROWS__</div>
      <div class="note teal" style="height:fit-content">
        <svg class="frame fb" preserveAspectRatio="none" viewBox="0 0 100 100"><rect width="100" height="100" rx="1"/></svg>
        <svg class="frame fa" preserveAspectRatio="none" viewBox="0 0 100 100"><rect width="100" height="100" rx="1"/></svg>
        <div class="inner"><b>Keywords</b><span>${keywords}</span></div></div></div>`,
    rows: items,
  }],
});

const check = items => ({
  tag: "WRAP UP", kicker: "Check yourself", title: "Can I really do it? Prove it.",
  blocks: [
    { t: "rows", items },
    { t: "stripe", color: "green", l: "Rate yourself:", text: "red = not yet · amber = nearly · green = yes, and I can show someone" },
  ],
});

module.exports = { titleSlide, divider, objectives, check };
