/* Circuit Lab - schematic view.
   The same circuit the student built, drawn the way an engineer would draw it:
   standard symbols, a box for every module and board, ground and supply symbols
   instead of long power wires, and a net label where three or more pins meet.

   Nothing here edits the circuit. It reads the netlist that the simulator already
   builds, so the breadboard disappears and the connections it made stay. */

const esc = s => String(s ?? "").replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const GNDRE = /^(GND|VSS|-|K|C|COM-|0V)$/i;
const PWRRE = /^(VCC|VDD|5V|3V3|3\.3V|VIN|V\+|\+|12V)$/i;

/* ---------- symbols ----------
   Each symbol is drawn around its own centre (0,0). A pin says where its wire
   leaves: l, r, t or b. Pins are matched by name, or by position for the
   two-legged parts whose legs are just called 1 and 2. */
const S = {};
const two = (body, w = 52, h = 24) => names => ({
  w, h, body, pins: { [names[0]]: { x: -w / 2, y: 0, d: "l" }, [names[1]]: { x: w / 2, y: 0, d: "r" } }
});
S.resistor = two('<path d="M-26 0h8l3-7 6 14 6-14 6 14 3-7h8"/>');
S.inductor = two('<path d="M-26 0h6"/><path d="M-20 0a5 5 0 0 1 10 0a5 5 0 0 1 10 0a5 5 0 0 1 10 0"/><path d="M10 0h16"/>');
S.capacitor = two('<path d="M-26 0h22M4 0h22"/><path d="M-4 -11v22M4 -11v22"/>');
S.buzzer = two('<circle cx="0" cy="0" r="11"/><path d="M-26 0h15M11 0h15"/><path d="M-5 -4h10M-5 4h10"/>');
S.led = two('<path d="M-26 0h14M12 0h14"/><path d="M-12 -10v20"/><path d="M12 -10v20L-12 0z"/><path d="M6 -14l7-7M13 -14l7-7M18 -22l3 .5.5 3"/>', 52, 30);
S.diode = two('<path d="M-26 0h14M12 0h14"/><path d="M12 -10v20"/><path d="M12 -10L-12 0l24 10z"/>');
S.zener = two('<path d="M-26 0h14M12 0h14"/><path d="M6 -10h6v20H6"/><path d="M12 -10L-12 0l24 10z"/>');
S.battery = two('<path d="M-26 0h14M12 0h14"/><path d="M-12 -12v24M-4 -6v12M4 -12v24M12 -6v12"/>', 52, 28);
S.lamp = two('<circle cx="0" cy="0" r="11"/><path d="M-26 0h15M11 0h15"/><path d="M-8 -8l16 16M8 -8l-16 16"/>');
S.dcmotor = names => ({ w: 52, h: 28, body: '<circle cx="0" cy="0" r="12"/><text x="0" y="4" class="sg">M</text><path d="M-26 0h14M12 0h14"/>',
  pins: { [names[0]]: { x: -26, y: 0, d: "l" }, [names[1]]: { x: 26, y: 0, d: "r" } } });

/* three-legged parts are named, so they are written out in full */
const NAMED = {
  pot: { w: 54, h: 40, body: '<rect x="-20" y="-10" width="40" height="20" rx="2"/><path d="M-26 0h6M20 0h6M0 -24v10"/><path d="M-5 -16l5 2 5-2z" class="fill"/>',
    pins: { GND: { x: -26, y: 0, d: "l" }, VCC: { x: 26, y: 0, d: "r" }, SIG: { x: 0, y: -24, d: "t" } } },
  npn: { w: 48, h: 44, body: '<circle cx="2" cy="0" r="15"/><path d="M-22 0h12M-10 -11v22"/><path d="M-10 -5l14 -9M-10 5l14 9"/><path d="M4 14l-7-2 2-5" class="fill"/><path d="M4 -22v8M4 22v-8"/>',
    pins: { B: { x: -22, y: 0, d: "l" }, C: { x: 4, y: -22, d: "t" }, E: { x: 4, y: 22, d: "b" } } },
  pnp: { w: 48, h: 44, body: '<circle cx="2" cy="0" r="15"/><path d="M-22 0h12M-10 -11v22"/><path d="M-10 -5l14 -9M-10 5l14 9"/><path d="M-10 5l7 -1-1 5" class="fill"/><path d="M4 -22v8M4 22v-8"/>',
    pins: { B: { x: -22, y: 0, d: "l" }, E: { x: 4, y: -22, d: "t" }, C: { x: 4, y: 22, d: "b" } } },
  mosfet: { w: 48, h: 44, body: '<path d="M-22 0h12"/><path d="M-10 -12v24"/><path d="M-4 -12v7M-4 -3v6M-4 5v7"/><path d="M-4 -9h8v-13M-4 0h8M-4 9h8v13"/><path d="M4 0h-8"/>',
    pins: { G: { x: -22, y: 0, d: "l" }, D: { x: 4, y: -22, d: "t" }, S: { x: 4, y: 22, d: "b" } } },
  slideswitch: { w: 56, h: 34, body: '<path d="M-28 -10h8M28 -10h-8M-28 10h8"/><circle cx="-20" cy="-10" r="2.5" class="fill"/><circle cx="20" cy="-10" r="2.5" class="fill"/><circle cx="-20" cy="10" r="2.5" class="fill"/><path d="M-20 10l34 -16"/>',
    pins: { 1: { x: -28, y: -10, d: "l" }, 2: { x: -28, y: 10, d: "l" }, 3: { x: 28, y: -10, d: "r" } } },
  button: { w: 56, h: 34, body: '<path d="M-28 0h10M28 0h-10"/><circle cx="-18" cy="0" r="2.5" class="fill"/><circle cx="18" cy="0" r="2.5" class="fill"/><path d="M-18 -4h36"/><path d="M0 -4v-9M-7 -13h14"/>',
    pins: { "1.l": { x: -28, y: 0, d: "l" }, "2.l": { x: 28, y: 0, d: "r" } } },
};

function symbolFor(part, pinNames, label) {
  const t = part.type;
  if (NAMED[t]) return NAMED[t];
  const mk = S[t];
  if (mk && pinNames.length >= 2) return mk(pinNames);
  return boxFor(pinNames, label);
}

/* anything without a standard symbol becomes a labelled box: supply on top,
   ground underneath, the signal pins down the sides. That is how a datasheet
   draws a module, and it keeps a 30-pin board readable. */
function boxFor(names, label) {
  const top = names.filter(n => PWRRE.test(n)), bot = names.filter(n => GNDRE.test(n) && !top.includes(n));
  const rest = names.filter(n => !top.includes(n) && !bot.includes(n));
  const nl = Math.ceil(rest.length / 2), left = rest.slice(0, nl), right = rest.slice(nl);
  const h = Math.max(58, Math.max(left.length, right.length) * 17 + 34);
  const w = Math.max(96, (label || "").length * 7 + 34, (Math.max(top.length, bot.length)) * 34);
  const pins = {}, span = (n, len, size) => -size / 2 + (size * (n + 1)) / (len + 1);
  const inner = h - 26;   /* the top of the box is kept clear for the name */
  left.forEach((n, i) => pins[n] = { x: -w / 2, y: 13 + span(i, left.length, inner - 10), d: "l" });
  right.forEach((n, i) => pins[n] = { x: w / 2, y: 13 + span(i, right.length, inner - 10), d: "r" });
  top.forEach((n, i) => pins[n] = { x: span(i, top.length, w - 16), y: -h / 2, d: "t" });
  bot.forEach((n, i) => pins[n] = { x: span(i, bot.length, w - 16), y: h / 2, d: "b" });
  return { w, h, box: true, body: `<rect x="${-w / 2}" y="${-h / 2}" width="${w}" height="${h}" rx="4"/>`, pins };
}

/* ---------- placement ----------
   Symbols start where the part sits on the canvas, so the diagram matches what
   the student is looking at, then they are pushed apart until nothing overlaps. */
function relax(items) {
  for (let pass = 0; pass < 160; pass++) {
    let moved = false;
    for (let i = 0; i < items.length; i++) for (let j = i + 1; j < items.length; j++) {
      const a = items[i], b = items[j];
      const mx = (a.w + b.w) / 2 + 48, my = (a.h + b.h) / 2 + 44;
      const dx = b.cx - a.cx, dy = b.cy - a.cy;
      const ox = mx - Math.abs(dx), oy = my - Math.abs(dy);
      if (ox <= 0 || oy <= 0) continue;
      moved = true;
      if (ox < oy) { const s = (dx >= 0 ? 1 : -1) * ox / 2; a.cx -= s; b.cx += s; }
      else { const s = (dy >= 0 ? 1 : -1) * oy / 2; a.cy -= s; b.cy += s; }
    }
    if (!moved) break;
  }
}

const STUB = 16;
const endOf = (it, p) => {
  const x = it.cx + p.x, y = it.cy + p.y;
  return { x: x + (p.d === "l" ? -STUB : p.d === "r" ? STUB : 0), y: y + (p.d === "t" ? -STUB : p.d === "b" ? STUB : 0), x0: x, y0: y, d: p.d };
};

export function buildSchematic(ctx) {
  const { project, rt, net, PARTS, BOARDS, partLabel, title } = ctx;
  const items = [], warn = [];
  project.parts.forEach(p => {
    if (p.type === "breadboard" || p.type === "note") return;
    const r = rt[p.id]; if (!r || !r.el || !r.el.pinInfo) return;
    const names = r.el.pinInfo.map(q => q.name);
    const label = partLabel(p);
    const sym = symbolFor(p, names, label);
    items.push({ id: p.id, type: p.type, label, sym, w: sym.w, h: sym.h, cx: p.x + r.w / 2, cy: p.y + r.h / 2, board: !!BOARDS[p.type] });
    if (!S[p.type] && !NAMED[p.type] && !BOARDS[p.type] && !sym.box) warn.push(label);
  });
  if (!items.length) return { svg: "", empty: true };
  relax(items);
  const byId = {}; items.forEach(it => byId[it.id] = it);

  /* group every drawn pin by the net it sits on */
  const nets = {};
  items.forEach(it => Object.keys(it.sym.pins).forEach(n => {
    const node = it.id + ":" + n, root = net.find(node);
    (nets[root] = nets[root] || []).push({ it, name: n, node, p: it.sym.pins[n] });
  }));

  /* name a net after the board pin on it, so a wire reads "D13" not "N4" */
  const board = items.find(i => i.board), bdef = board ? BOARDS[board.type] : null;
  let counter = 0;
  const named = [];
  Object.keys(nets).forEach(root => {
    const m = nets[root]; if (m.length < 2) return;
    let name = null, kind = "sig";
    m.forEach(q => {
      const bare = q.name.replace(/\.\d+$/, "");
      if (q.it.board && bdef) { const bp = bdef.pins[q.name] || bdef.pins[bare]; const l = (bp && bp.label) || bare; if (!name || /^(GND|5V|3V3|VIN)$/i.test(l)) name = l; }
      if (GNDRE.test(bare) && (bare.toUpperCase() === "GND" || bare.toUpperCase() === "VSS" || bare === "-")) kind = "gnd";
      else if (PWRRE.test(bare) && kind !== "gnd") { kind = "pwr"; if (!name || /^N/.test(name)) name = bare === "+" ? "V+" : bare; }
    });
    if (name && /^GND$/i.test(name)) kind = "gnd";
    else if (name && /^(5V|3V3|VIN|VCC)$/i.test(name)) kind = "pwr";
    if (!name) name = "N" + (++counter);
    named.push({ root, m, name, kind });
  });

  /* ---------- draw ---------- */
  let g = "";
  const wires = [], labels = [];
  named.forEach(n => {
    if (n.kind === "gnd" || n.kind === "pwr") {
      n.m.forEach(q => {
        const e = endOf(q.it, q.p);
        wires.push(`<path class="sw" d="M${q.it.cx + q.p.x} ${q.it.cy + q.p.y}L${e.x} ${e.y}"/>`);
        labels.push(n.kind === "gnd" ? gndSym(e) : pwrSym(e, n.name));
      });
      return;
    }
    const ends = n.m.map(q => ({ q, e: endOf(q.it, q.p) }));
    ends.forEach(({ q, e }) => wires.push(`<path class="sw" d="M${q.it.cx + q.p.x} ${q.it.cy + q.p.y}L${e.x} ${e.y}"/>`));
    const near = ends.length === 2 && Math.hypot(ends[0].e.x - ends[1].e.x, ends[0].e.y - ends[1].e.y) < 230;
    if (near) {
      const [a, b] = ends;
      wires.push(`<path class="sw" d="${elbow(a.e, b.e)}"/>`);
      const mid = { x: (a.e.x + b.e.x) / 2, y: (a.e.y + b.e.y) / 2 };
      labels.push(`<text class="snl" x="${mid.x}" y="${mid.y - 4}">${esc(n.name)}</text>`);
    } else {
      /* three or more: a label on each stub, which is how a crowded schematic
         avoids a spider's web of crossing lines */
      ends.forEach(({ e }) => labels.push(netTag(e, n.name)));
    }
  });

  items.forEach(it => {
    const cls = "ssym" + (it.sym.box ? " sbox" : "");
    let s = `<g class="${cls}" transform="translate(${it.cx.toFixed(1)} ${it.cy.toFixed(1)})">${it.sym.body}`;
    Object.entries(it.sym.pins).forEach(([n, p]) => {
      s += `<circle class="sp" cx="${p.x}" cy="${p.y}" r="1.8"/>`;
      /* top and bottom pins are the supply and ground ones; their symbol already
         names them, so printing "VCC" inside the box too only adds clutter */
      if (it.sym.box && (p.d === "l" || p.d === "r")) {
        const ax = p.d === "l" ? p.x + 6 : p.d === "r" ? p.x - 6 : p.x, ay = p.d === "t" ? p.y + 11 : p.d === "b" ? p.y - 6 : p.y + 3.2;
        const an = p.d === "l" ? "start" : p.d === "r" ? "end" : "middle";
        s += `<text class="spn" x="${ax}" y="${ay}" text-anchor="${an}">${esc(n.replace(/\.\d+$/, ""))}</text>`;
      }
    });
    s += `<text class="sl" x="0" y="${it.sym.box ? -it.h / 2 + 15 : -it.h / 2 - 9}">${esc(it.label)}</text>`;
    g += s + "</g>";
  });

  let x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9;
  items.forEach(it => { x0 = Math.min(x0, it.cx - it.w / 2 - 54); y0 = Math.min(y0, it.cy - it.h / 2 - 42); x1 = Math.max(x1, it.cx + it.w / 2 + 54); y1 = Math.max(y1, it.cy + it.h / 2 + 54); });
  const pad = 26, W = x1 - x0 + pad * 2, H = y1 - y0 + pad * 2 + 34;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" class="schsvg" viewBox="${(x0 - pad).toFixed(1)} ${(y0 - pad - 34).toFixed(1)} ${W.toFixed(1)} ${H.toFixed(1)}">
  <style>${CSS}</style>
  <text class="stitle" x="${(x0 - pad + 4).toFixed(1)}" y="${(y0 - pad - 12).toFixed(1)}">${esc(title || "Circuit")}</text>
  <g>${wires.join("")}</g>${g}<g>${labels.join("")}</g></svg>`;
  return { svg, warn: [...new Set(warn)] };
}

function elbow(a, b) {
  const vertA = a.d === "t" || a.d === "b";
  if (Math.abs(a.x - b.x) < 1 || Math.abs(a.y - b.y) < 1) return `M${a.x} ${a.y}L${b.x} ${b.y}`;
  return vertA ? `M${a.x} ${a.y}L${a.x} ${b.y}L${b.x} ${b.y}` : `M${a.x} ${a.y}L${b.x} ${a.y}L${b.x} ${b.y}`;
}
function gndSym(e) {
  const dy = e.d === "t" ? -1 : 1, x = e.x, y = e.y;
  const a = y + 8 * dy;
  return `<g class="sgnd"><path d="M${x} ${y}L${x} ${a}"/><path d="M${x - 9} ${a}h18M${x - 5.5} ${a + 4 * dy}h11M${x - 2} ${a + 8 * dy}h4"/></g>`;
}
function pwrSym(e, name) {
  const dy = e.d === "b" ? 1 : -1, x = e.x, y = e.y, a = y + 9 * dy;
  return `<g class="spwr"><path d="M${x} ${y}L${x} ${a}"/><path d="M${x - 8} ${a}h16"/><text class="spl" x="${x}" y="${a + (dy < 0 ? -5 : 13)}">${esc(name)}</text></g>`;
}
function netTag(e, name) {
  const left = e.d === "l";
  const x = e.x, y = e.y;
  return `<g class="stag"><text class="snt" x="${x + (left ? -4 : e.d === "r" ? 4 : 0)}" y="${e.d === "t" ? y - 5 : e.d === "b" ? y + 11 : y + 3.4}" text-anchor="${left ? "end" : e.d === "r" ? "start" : "middle"}">${esc(name)}</text></g>`;
}

const CSS = `
.ssym { fill: none; stroke: #0F1D36; stroke-width: 1.7; stroke-linecap: round; stroke-linejoin: round; }
.ssym .fill { fill: #0F1D36; stroke: none; }
.sp { fill: #0F1D36; stroke: none; }
.sw { fill: none; stroke: #0F1D36; stroke-width: 1.5; stroke-linecap: round; stroke-linejoin: round; }
.sgnd, .spwr { fill: none; stroke: #0F1D36; stroke-width: 1.5; stroke-linecap: round; }
text { font-family: "Plus Jakarta Sans", system-ui, sans-serif; fill: #0F1D36; stroke: none; }
.sl { font-size: 11.5px; font-weight: 700; text-anchor: middle; }
.sl.box { font-size: 11.5px; }
.spn { font-size: 8.5px; fill: #5A6B86; font-weight: 600; }
.snl, .snt, .spl { font-size: 8.5px; font-weight: 700; fill: #2E6BE6; text-anchor: middle; }
.snt { fill: #1F6FD1; }
.spl { fill: #C92A2A; }
.sg { font-size: 12px; font-weight: 700; text-anchor: middle; stroke: none; fill: #0F1D36; }
.stitle { font-size: 15px; font-weight: 800; }
`;
