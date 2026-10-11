/* Circuit Lab - automatic layout for ready-made lesson circuits.
   A lesson describes WHAT is connected (an LED on pin 13, a DHT22 on pin 7, an OLED...);
   this file decides WHERE everything goes and draws tidy wires, Tinkercad style:
   breadboard on top, board below, modules in a column on the right, power on the rails. */
import { bbLayout, P } from "./elements.js?v=5";
import { PARTS } from "./parts.js?v=5";
import { BOARDS } from "./boards.js?v=5";

const C = { gnd: "#2B2D42", v5: "#E63946", v33: "#F08C00", sda: "#1F6FD1", scl: "#F5B83D" };
const SIG = ["#2E9E5B", "#1F6FD1", "#7B3FC4", "#E8590C", "#20B8A6", "#D6336C", "#8D6E63", "#5C7CFA", "#F5B83D"];
/* modules that need 5V even on an ESP32 */
const NEEDS5V = new Set(["servo", "hcsr04", "relay", "stepper28", "ledring", "ledstrip", "neopixel", "lcd", "max7219", "pir", "mq2", "mq135", "hc05", "vibe"]);
/* wokwi modules whose pins are on the bottom edge: turn them so the pins face the board */
const ROT90 = new Set(["hcsr04", "dht22", "pir", "joystick", "ledring"]);

export function boardPinName(board, p) {
  if (board === "esp32") { const n = +p; if (n === 36) return "VP"; if (n === 39) return "VN"; if (n === 16) return "RX2"; if (n === 17) return "TX2"; return "D" + n; }
  return String(p);
}

/* rotate a local point about the part centre */
function rotPt(px, py, w, h, rot) {
  const a = (rot || 0) * Math.PI / 180, cx = w / 2, cy = h / 2, dx = px - cx, dy = py - cy;
  return { x: cx + dx * Math.cos(a) - dy * Math.sin(a), y: cy + dx * Math.sin(a) + dy * Math.cos(a) };
}

export function layoutCircuit(spec, measure) {
  const board = spec.board === undefined ? "uno" : spec.board;
  const B = board ? BOARDS[board] : null;
  const parts = [], wires = [], ids = {};
  const uid = t => { ids[t] = (ids[t] || 0) + 1; return t + ids[t]; };
  const geo = {}; // id -> { x, y, rot, w, h, pins: {name: {x,y}} } world
  const place = (type, x, y, rot = 0, attrs, extra = {}) => {
    const id = extra.id || uid(type), m = measure(type, attrs);
    const pins = {}; m.pins.forEach(q => { const r = rotPt(q.x, q.y, m.w, m.h, rot); pins[q.name] = { x: x + r.x, y: y + r.y, lx: q.x, ly: q.y }; });
    const p = { id, type, x: Math.round(x * 10) / 10, y: Math.round(y * 10) / 10, rot };
    if (attrs) p.attrs = attrs; if (extra.sim) p.sim = extra.sim; if (extra.label) p.label = extra.label;
    parts.push(p);
    const vb = rotPt(0, 0, m.w, m.h, rot), vb2 = rotPt(m.w, m.h, m.w, m.h, rot);
    geo[id] = { x, y, rot, w: m.w, h: m.h, pins, box: { x0: x + Math.min(vb.x, vb2.x), y0: y + Math.min(vb.y, vb2.y), x1: x + Math.max(vb.x, vb2.x), y1: y + Math.max(vb.y, vb2.y) } };
    return id;
  };
  /* place a part so that its pin `pin` lands on world point (tx, ty) */
  const placeAt = (type, pin, tx, ty, rot = 0, attrs, extra) => {
    const m = measure(type, attrs), q = m.pins.find(z => z.name === pin), r = rotPt(q.x, q.y, m.w, m.h, rot);
    return place(type, tx - r.x, ty - r.y, rot, attrs, extra);
  };
  const W = (from, to, color, pts = []) => wires.push({ from, to, color, pts: pts.map(([x, y]) => [Math.round(x * 10) / 10, Math.round(y * 10) / 10]) });
  const pinPos = node => { const [id, pin] = node.split(":"); const g = geo[id]; return g && g.pins[pin]; };

  /* ---------- 1. breadboard footprints ---------- */
  const items = (spec.parts || []).map(x => Object.assign({}, x));
  const bbItems = items.filter(it => PARTS[it.t] && PARTS[it.t].kind === "bb");
  const widthOf = it => ({ led: 3, buzzer: 8, button: 4, pot: 8, rgbled: 5, slideswitch: 4, resistor: 6, capacitor: 3 }[it.t] || 4);
  let need = bbItems.reduce((s, it) => s + widthOf(it), 0) + 2;
  const powered = items.filter(it => PARTS[it.t] && PARTS[it.t].kind === "module" && PARTS[it.t].pw && !it.noPower).length;
  const useBB = bbItems.length > 0 || spec.breadboard || powered >= 2 || items.some(it => it.rails);
  const cols = need > 30 ? 60 : 30, L = bbLayout(cols);
  let bbId = null;
  if (useBB) bbId = place("breadboard", 0, 0, 0, cols === 30 ? undefined : { cols: String(cols) }, { id: "bb1" });
  const hole = (c, r) => pinPos(`${bbId}:${c}${r}`);
  const railName = (r, c) => `${bbId}:${r}.${L.railOf[c]}`;
  const usedRail = new Set();
  const railCol = (c, dir = 1) => { while (!L.railOf[c] || usedRail.has(c)) c += dir; return c; };
  const bbH = useBB ? L.H : 0, bbW = useBB ? L.W : 0;

  /* ---------- 2. board ---------- */
  let boardId = null, bgeo = null;
  const bpin = p => `${boardId}:${boardPinName(board, p)}`;
  // gap-band and other routing requests are collected first, then lanes are assigned
  const reqs = [];
  let colCursor = 2;
  const bbParts = [];
  let switchHole = null;
  for (const it of bbItems) {
    const w = widthOf(it); let c = colCursor + (it.t === "buzzer" || it.t === "pot" ? 3 : 0);
    // the column that goes to GND through the rail must have a rail hole
    if (it.t === "led") { while (c % 6 === 0 || (it.pin === "+" && (c + 1) % 6 === 0)) c++; }
    if (it.t === "button") { while ((c + 2) % 6 === 0) c++; }
    if (it.t === "buzzer" || it.t === "pot") { while (c % 6 === 0 || (c + 2) % 6 === 0) c++; }
    if (it.t === "rgbled") { while ((c + 1) % 6 === 0) c++; }
    if (it.t === "slideswitch") { while ((it.feed ? (c + 1) : c) % 6 === 0 || (!it.feed && (c + 2) % 6 === 0)) c++; }
    bbParts.push({ it, c });
    colCursor = Math.max(colCursor + w, c + (it.t === "buzzer" || it.t === "pot" ? 5 : w));
  }

  let bx = 0, by = 0;
  if (B) {
    const m = measure(board);
    const rot = board === "esp32" ? 90 : 0;
    const vw = rot ? m.h : m.w, vh = rot ? m.w : m.h;
    const left = useBB ? Math.max(4, (bbW - vw) / 2 + (board === "uno" ? 14 : 0)) : 0;
    bx = left - (m.w - vw) / 2; by = 0; // y set later
    boardId = board + "1";
    bgeo = { m, rot, vw, vh, left };
  }

  /* ---------- 3. collect connections ---------- */
  const bbWires = []; // board pin -> hole (top header) etc.
  const sigColor = (() => { let i = 0; return () => SIG[i++ % SIG.length]; })();
  const supply = B ? (board === "esp32" ? "3V3" : "5V") : null;
  const railFeed = useBB && B;
  // breadboard parts
  for (const { it, c } of bbParts) {
    const cA = c, sigPin = it.pin;
    if (it.t === "led") {
      const id = placeAt("led", "A", hole(c + 1, "e").x, hole(c + 1, "e").y, 0, { color: it.color || "red" }, { label: it.label });
      if (it.direct) W(`${bbId}:${c}a`, railName("bn", c), C.gnd);
      else placeAt("resistor", "1", hole(c, "b").x, hole(c, "b").y, 90, { value: String(it.ohms || 220), span: String(((L.rows.bn - L.rows.b) / P).toFixed(2)) });
      usedRail.add(c);
      if (sigPin === "+") { W(`${bbId}:${c + 1}a`, railName("bp", c + 1), C.v5); usedRail.add(c + 1); }
      else if (sigPin != null) reqs.push({ kind: "b2h", from: bpin(sigPin), to: `${bbId}:${c + 1}a`, color: sigColor() });
    } else if (it.t === "buzzer") {
      placeAt("buzzer", "1", hole(c, "e").x, hole(c, "e").y, 0);
      W(`${bbId}:${c}a`, railName("bn", c), C.gnd); usedRail.add(c);
      if (sigPin != null) reqs.push({ kind: "b2h", from: bpin(sigPin), to: `${bbId}:${c + 1}a`, color: sigColor() });
    } else if (it.t === "button") {
      placeAt("button", "2.l", hole(c, "e").x, hole(c, "e").y, 90, { color: it.color || "green" });
      W(`${bbId}:${c + 2}a`, railName("bn", c + 2), C.gnd); usedRail.add(c + 2);
      if (sigPin != null) reqs.push({ kind: "b2h", from: bpin(sigPin), to: `${bbId}:${c}a`, color: sigColor() });
    } else if (it.t === "pot") {
      placeAt("pot", "GND", hole(c, "e").x, hole(c, "e").y, 0);
      W(`${bbId}:${c}a`, railName("bn", c), C.gnd); W(`${bbId}:${c + 2}a`, railName("bp", c + 2), C.v5); usedRail.add(c); usedRail.add(c + 2);
      if (sigPin != null) reqs.push({ kind: "b2h", from: bpin(sigPin), to: `${bbId}:${c + 1}a`, color: sigColor() });
    } else if (it.t === "rgbled") {
      placeAt("rgbled", "R", hole(c, "e").x, hole(c, "e").y, 0);
      placeAt("resistor", "1", hole(c + 1, "b").x, hole(c + 1, "b").y, 90, { value: "220", span: String(((L.rows.bn - L.rows.b) / P).toFixed(2)) });
      usedRail.add(c + 1);
      const pins = it.pins || {};
      [["R", 0], ["G", 2], ["B", 3]].forEach(([k, d]) => { if (pins[k] != null) reqs.push({ kind: "b2h", from: bpin(pins[k]), to: `${bbId}:${c + d}a`, color: k === "R" ? "#E63946" : k === "G" ? "#2E9E5B" : "#1F6FD1" }); });
    } else if (it.t === "slideswitch" && it.feed) {
      placeAt("slideswitch", "1", hole(c, "e").x, hole(c, "e").y, 0);
      W(`${bbId}:${c + 1}a`, railName("bp", c + 1), C.v5); usedRail.add(c + 1);
      switchHole = `${bbId}:${c}a`;
    } else if (it.t === "slideswitch") {
      placeAt("slideswitch", "1", hole(c, "e").x, hole(c, "e").y, 0);
      W(`${bbId}:${c}a`, railName("bn", c), C.gnd); W(`${bbId}:${c + 2}a`, railName("bp", c + 2), C.v5); usedRail.add(c); usedRail.add(c + 2);
      if (sigPin != null) reqs.push({ kind: "b2h", from: bpin(sigPin), to: `${bbId}:${c + 1}a`, color: sigColor() });
    }
  }

  /* modules */
  const mods = items.filter(it => PARTS[it.t] && PARTS[it.t].kind === "module");
  const modInfo = mods.map(it => {
    const d = PARTS[it.t], attrs = Object.assign({}, d.attrs || {}, it.attrs || {});
    const conns = []; // {pin, target:{type:'board'|'rail'|'boardpwr'}, color}
    const pins = it.pins || {};
    Object.entries(pins).forEach(([pn, bp]) => conns.push({ pin: pn, to: bpin(bp), color: pn === "SDA" ? C.sda : pn === "SCL" ? C.scl : sigColor(), boardPin: true }));
    if (d.i2c && B) { const top = board === "uno"; conns.push({ pin: d.i2c.sda, to: `${boardId}:${top ? "A4.2" : B.i2c.sda}`, color: C.sda, boardPin: true }); conns.push({ pin: d.i2c.scl, to: `${boardId}:${top ? "A5.2" : B.i2c.scl}`, color: C.scl, boardPin: true }); }
    if (it.t === "rfid" && B) { const s = B.spi; conns.push({ pin: "SCK", to: `${boardId}:${s.sck}`, color: sigColor(), boardPin: true }, { pin: "MOSI", to: `${boardId}:${s.mosi}`, color: sigColor(), boardPin: true }, { pin: "MISO", to: `${boardId}:${s.miso}`, color: sigColor(), boardPin: true }); }
    // power
    const pw = d.pw || {};
    if (B && !it.noPower) {
      (pw.gnd || []).slice(0, 1).forEach(g => conns.push({ pin: g, rail: "bn", color: C.gnd }));
      (pw.vcc || []).slice(0, 1).forEach(v => {
        if (it.t === "rfid") conns.push({ pin: v, to: `${boardId}:${board === "uno" ? "3.3V" : "3V3"}`, color: C.v33, boardPin: true });
        else if (board === "esp32" && NEEDS5V.has(it.t)) conns.push({ pin: v, to: `${boardId}:VIN`, color: C.v5, boardPin: true });
        else conns.push({ pin: v, rail: "bp", color: supply === "3V3" ? C.v33 : C.v5 });
      });
    }
    if (it.rails) Object.entries(it.rails).forEach(([pn, r]) => {
      if (r === "switch") conns.push({ pin: pn, hole: true, color: C.v5 });
      else conns.push({ pin: pn, rail: r, color: r === "bn" ? C.gnd : C.v5 });
    });
    if (!useBB) conns.forEach(c => { if (c.rail) { c.to = `${boardId}:${c.rail === "bn" ? B.gnd : (supply === "3V3" ? "3V3" : B.vcc)}`; c.boardPin = true; delete c.rail; } });
    return { it, d, attrs, conns };
  });

  /* ---------- 4. geometry: board y, trunks, module column ---------- */
  // measure how many gap lanes we need (rough), then place the board
  const nGapGuess = reqs.length + modInfo.reduce((s, m) => s + m.conns.length, 0);
  const gapH = Math.max(46, 22 + Math.min(nGapGuess, 18) * 5.5);
  if (B) {
    const top = bbH + (useBB ? gapH : 0);
    by = top - (bgeo.m.h - bgeo.vh) / 2;
    place(board, bx, by, bgeo.rot, undefined, { id: boardId });
  }
  const bBox = B ? geo[boardId].box : { x0: 0, y0: 0, x1: 0, y1: 0 };
  const boardTopY = B ? Math.min(...Object.entries(geo[boardId].pins).map(([, p]) => p.y)) : 0;
  const boardBotY = B ? Math.max(...Object.entries(geo[boardId].pins).map(([, p]) => p.y)) : 0;
  const boardMidY = (boardTopY + boardBotY) / 2;
  const nTrunks = modInfo.reduce((s, m) => s + m.conns.length, 0);
  const trunkX0 = Math.max(bbW, bBox.x1) + 16;
  const modX = trunkX0 + nTrunks * 5.5 + 26;

  // order modules: ones wired to the top header first, then the bottom header
  const modTargetY = m => { const ys = m.conns.filter(c => c.boardPin).map(c => (B && geo[boardId] ? (geo[boardId].pins[c.to.split(":")[1]] || { y: boardTopY }).y : 0)); return ys.length ? ys.reduce((a, b) => a + b, 0) / ys.length : 0; };
  const modTargetX = m => { const xs = m.conns.filter(c => c.boardPin).map(c => (geo[boardId] && geo[boardId].pins[c.to.split(":")[1]] || { x: 0 }).x); return xs.length ? xs.reduce((a, b) => a + b, 0) / xs.length : 0; };
  if (B) modInfo.sort((a, b) => (modTargetY(a) > boardMidY) - (modTargetY(b) > boardMidY) || modTargetX(a) - modTargetX(b));

  let my = 0, trunk = 0;
  const attachedRight = []; // extra parts placed to the right of a module (loads, batteries, motors)
  for (const m of modInfo) {
    const rot = ROT90.has(m.it.t) ? 90 : 0;
    const meas = measure(m.it.t, m.attrs);
    const vh = rot ? meas.w : meas.h, vw = rot ? meas.h : meas.w;
    // top-edge pins need room above for their bends
    const topPins = meas.pins.filter(q => q.y < 4).length;
    my += topPins ? 12 + topPins * 5 : 0;
    const x = modX - (meas.w - vw) / 2, y = my - (meas.h - vh) / 2;
    m.id = place(m.it.t, x, y, rot, Object.keys(m.attrs).length ? m.attrs : undefined, { sim: m.it.sim, label: m.it.label });
    m.box = geo[m.id].box;
    my = m.box.y1 + 26;
    // each connection gets its own trunk (x)
    const g = geo[m.id];
    const pinOrder = c => { const p = g.pins[c.pin]; if (!p) return 0; const top = p.ly < 4 && !rot; return top ? -p.x : p.y; };
    m.conns.sort((a, b) => pinOrder(a) - pinOrder(b)).forEach(c => { c.trunk = trunkX0 + (trunk++) * 5.5; });
    if (m.it.with) attachedRight.push(m);
  }

  /* ---------- 5. lanes ---------- */
  const gapTop = bbH + 9, gapLanes = { power: [], bb: [], sig: [] };
  const take = (list, x0, x1) => { // interval colouring: reuse a lane if the span is free
    for (let i = 0; i < list.length; i++) if (list[i].every(([a, b]) => x1 < a - 3 || x0 > b + 3)) { list[i].push([x0, x1]); return i; }
    list.push([[x0, x1]]); return list.length - 1;
  };
  const jobs = [];
  // board -> breadboard
  reqs.forEach(r => { const a = pinPos(r.from), b = pinPos(r.to); if (!a || !b) return; const bottom = a.y > boardMidY; jobs.push({ r, a, b, bottom, group: bottom ? null : "bb", x0: Math.min(a.x, b.x), x1: Math.max(a.x, b.x) }); });
  // modules
  const railUse = { bp: [], bn: [] };
  modInfo.forEach(m => m.conns.forEach(c => {
    const a = geo[m.id].pins[c.pin]; if (!a) return;
    if (c.hole) {
      c.to = switchHole; const hb = pinPos(c.to);
      jobs.push({ m, c, a, b: hb, group: "power", x0: Math.min(hb.x, c.trunk), x1: Math.max(hb.x, c.trunk) });
    } else if (c.rail) {
      const col = railCol(L.cols - 1 - railUse[c.rail].length * 0, -1); usedRail.add(col); railUse[c.rail].push(col);
      const hb = pinPos(railName(c.rail, col)); c.to = railName(c.rail, col);
      jobs.push({ m, c, a, b: hb, group: "power", x0: Math.min(hb.x, c.trunk), x1: Math.max(hb.x, c.trunk) });
    } else {
      const b = pinPos(c.to); if (!b) return;
      const bottom = b.y > boardMidY;
      jobs.push({ m, c, a, b, bottom, group: bottom ? null : "sig", x0: Math.min(b.x, c.trunk), x1: Math.max(b.x, c.trunk) });
    }
  }));
  // assign gap lanes: power on top, then breadboard wires, then module signals
  ["power", "bb", "sig"].forEach(gname => {
    const js = jobs.filter(j => j.group === gname).sort((p, q) => gname === "sig" ? (p.c.trunk - q.c.trunk) : gname === "power" ? (q.b.x - p.b.x) : (p.x0 - q.x0));
    js.forEach(j => { j.lane = take(gapLanes[gname], j.x0, j.x1); });
  });
  const nP = gapLanes.power.length, nB = gapLanes.bb.length, nS = gapLanes.sig.length;
  const laneStep = Math.min(6, (gapH - 22) / Math.max(1, nP + nB + nS));
  const laneY = (g, i) => gapTop + 4 + (g === "power" ? i : g === "bb" ? nP + i : nP + nB + i) * laneStep;
  // bottom band and left channel
  let botLane = 0, leftLane = 0;
  const botY = () => boardBotY + 12 + (botLane++) * 6;
  const leftX = () => -14 - (leftLane++) * 6;

  /* ---------- 6. route ---------- */
  jobs.forEach(j => {
    const a = j.a, b = j.b;
    if (j.r) { // board -> breadboard hole
      if (!j.bottom) { const y = laneY("bb", j.lane); W(j.r.from, j.r.to, j.r.color, Math.abs(a.x - b.x) < 1 ? [] : [[a.x, y], [b.x, y]]); }
      else { const y = botY(), x = leftX(), y2 = gapTop + 2 + (nP + nB + nS) * laneStep + 4 + leftLane * 3; W(j.r.from, j.r.to, j.r.color, [[a.x, y], [x, y], [x, y2], [b.x, y2]]); }
      return;
    }
    const m = j.m, c = j.c, g = geo[m.id], lp = g.pins[c.pin];
    const top = lp.ly < 4 && !g.rot, right = lp.lx > g.w - 3 && !g.rot;
    const stub = top ? [[a.x, a.y - 8 - 5 * m.conns.filter(z => z.trunk < c.trunk).length], [c.trunk, a.y - 8 - 5 * m.conns.filter(z => z.trunk < c.trunk).length]] : [[c.trunk, a.y]];
    if (top) { const yy = a.y - 6 - 4 * (m.conns.length - m.conns.indexOf(c)); stub[0] = [a.x, yy]; stub[1] = [c.trunk, yy]; }
    if (j.group === "power") { const y = laneY("power", j.lane); W(`${m.id}:${c.pin}`, c.to, c.color, [...stub, [c.trunk, y], [b.x, y]]); return; }
    if (!j.bottom) { const y = laneY("sig", j.lane); W(`${m.id}:${c.pin}`, c.to, c.color, [...stub, [c.trunk, y], [b.x, y]]); return; }
    const y = botY(); W(`${m.id}:${c.pin}`, c.to, c.color, [...stub, [c.trunk, y], [b.x, y]]);
  });
  // board power to the breadboard rails, around the left side
  if (railFeed) {
    const gnd = pinPos(`${boardId}:${B.gnd}`), vcc = pinPos(`${boardId}:${supply}`);
    const hg = pinPos(railName("bn", 1)), hv = pinPos(railName("bp", 2 + (L.railOf[2] ? 0 : 1)));
    const yv = botY(), yg = botY(), xv = leftX(), xg = leftX();
    if (gnd.y > boardMidY) W(`${boardId}:${B.gnd}`, railName("bn", 1), C.gnd, [[gnd.x, yg], [xg, yg], [xg, hg.y]]);
    else W(`${boardId}:${B.gnd}`, railName("bn", 1), C.gnd, [[gnd.x, gapTop + 2 + (nP + nB + nS) * laneStep + 6], [hg.x, gapTop + 2 + (nP + nB + nS) * laneStep + 6]]);
    if (vcc.y > boardMidY) W(`${boardId}:${supply}`, railName("bp", 2), supply === "3V3" ? C.v33 : C.v5, [[vcc.x, yv], [xv, yv], [xv, hv.y]]);
    else W(`${boardId}:${supply}`, railName("bp", 2), C.v33, [[vcc.x, gapTop + 2 + (nP + nB + nS) * laneStep + 10], [hv.x, gapTop + 2 + (nP + nB + nS) * laneStep + 10]]);
  }

  /* ---------- 7. attached loads (relay / L298N / sensors with a source) ---------- */
  let ax = modX + 40;
  modInfo.forEach(m => { const bx1 = m.box.x1; if (bx1 + 40 > ax) ax = bx1 + 40; });
  let ay = 0;
  const local = (from, to, color, viaX) => { // simple tidy route between two module pins
    const a = pinPos(from), b = pinPos(to); if (!a || !b) return;
    const x = viaX != null ? viaX : (a.x + b.x) / 2;
    W(from, to, color, Math.abs(a.y - b.y) < 0.5 ? [] : [[x, a.y], [x, b.y]]);
  };
  attachedRight.forEach((m, mi) => {
    const w = m.it.with, g = geo[m.id];
    if (m.it.t === "relay") {
      const n = +(m.attrs.channels || 1), loads = Array.isArray(w.loads) ? w.loads : [w.load || "lamp"];
      const batId = place("battery", ax, Math.max(ay, g.box.y0), 0, { kind: w.supply || "4xAA" });
      let ly = geo[batId].box.y1 + 24;
      const busX = ax - 16;
      loads.forEach((ld, i) => {
        if (!ld) return;
        const t = n === 1 ? "" : i + 1, lid = place(ld, ax + 40, ly, 0);
        ly = geo[lid].box.y1 + 18;
        // battery + -> COM, NO -> load +, load - -> battery -
        local(`${batId}:+`, `${m.id}:COM${t}`, C.v5, busX - 6 - i * 5);
        local(`${m.id}:NO${t}`, `${lid}:+`, "#E8590C", busX + 4 + i * 5);
        const bm = pinPos(`${batId}:-`), lm = pinPos(`${lid}:-`);
        W(`${lid}:-`, `${batId}:-`, C.gnd, [[lm.x - 10 - i * 4, lm.y], [lm.x - 10 - i * 4, lm.y + 14], [ax + 30 + i * 4, lm.y + 14], [ax + 30 + i * 4, bm.y + 3], [bm.x - 5, bm.y + 3]]);
      });
      ay = ly + 20;
    }
    if (m.it.t === "l298n") {
      const mA = place("dcmotor", ax + 10, Math.max(ay, g.box.y0 - 20), 0, undefined, { label: "Left motor" });
      const mB = w.motors === 1 ? null : place("dcmotor", ax + 10, geo[mA].box.y1 + 30, 0, undefined, { label: "Right motor" });
      const bat = place("battery", ax + 10, (mB ? geo[mB].box.y1 : geo[mA].box.y1) + 34, 0, { kind: w.supply || "4xAA" });
      local(`${m.id}:OUT1`, `${mA}:M1`, "#E63946", g.box.x1 + 12); local(`${m.id}:OUT2`, `${mA}:M2`, C.gnd, g.box.x1 + 18);
      if (mB) { local(`${m.id}:OUT3`, `${mB}:M1`, "#E63946", g.box.x1 + 24); local(`${m.id}:OUT4`, `${mB}:M2`, C.gnd, g.box.x1 + 30); }
      // battery to 12V / GND: run along the bottom of the driver
      const bp = pinPos(`${bat}:+`), bn = pinPos(`${bat}:-`), p12 = pinPos(`${m.id}:12V`), pg = pinPos(`${m.id}:GND`);
      const yb = g.box.y1 + 14;
      W(`${bat}:+`, `${m.id}:12V`, C.v5, [[bp.x - 8, bp.y], [bp.x - 8, yb], [p12.x - 30, yb], [p12.x - 30, p12.y]]);
      W(`${bat}:-`, `${m.id}:GND`, C.gnd, [[bn.x - 14, bn.y], [bn.x - 14, yb + 6], [pg.x - 36, yb + 6], [pg.x - 36, pg.y]]);
      ay = geo[bat].box.y1 + 30;
    }
    if (m.it.t === "voltsensor") {
      const src = w.source || "battery", sid = place(src, ax, Math.max(ay, g.box.y0 - 10), 0, src === "battery" ? { kind: w.kind || "18650" } : undefined, { sim: w.sim });
      local(`${sid}:+`, `${m.id}:VIN`, C.v5, g.box.x1 + 14); local(`${sid}:-`, `${m.id}:GIN`, C.gnd, g.box.x1 + 22);
      ay = geo[sid].box.y1 + 24;
    }
  });

  /* ---------- 8. standalone extras (batteries, motors without a driver) ---------- */
  (spec.extra || []).forEach(x => { place(x.t, ax, ay, 0, x.attrs, { sim: x.sim, label: x.label }); ay = geo[parts[parts.length - 1].id].box.y1 + 20; });

  return { parts, wires, board };
}
