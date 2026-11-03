/* Circuit Lab - Upload to board: puts the sketch on a real Arduino plugged in
   by USB, the way the Arduino IDE's Upload button does.

   How: the sketch is compiled by the same free service "Start simulation"
   uses, which sends back the program as Intel HEX. The browser's Web Serial
   API (Chrome and Edge, and the desktop app) opens the board's USB port,
   resets the board by toggling DTR/RTS, and talks to the bootloader that
   every Arduino already has:
   - Uno and Nano: Optiboot, STK500 version 1 at 115200 baud. Older Nanos
     (and many clones) have the old bootloader at 57600, tried second.
   - Mega 2560: STK500 version 2 at 115200 baud.
   Every page is written, then read back and compared, so "Done" means the
   board really holds the program. ESP32 isn't here yet: the compiler only
   builds for AVR chips. */
let C = null;                       // context handed over by app.js
const $ = s => document.querySelector(s);
const esc = s => String(s ?? "").replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const sleep = ms => new Promise(r => setTimeout(r, ms));

export const supported = typeof navigator !== "undefined" && "serial" in navigator;

const TARGETS = {
  uno: { label: "Arduino Uno", proto: 1, bauds: [115200], page: 128 },
  nano: { label: "Arduino Nano", proto: 1, bauds: [115200, 57600], page: 128 },
  mega: { label: "Arduino Mega 2560", proto: 2, bauds: [115200], page: 256 },
};
const CHIPS = {
  "1e950f": "ATmega328P", "1e9514": "ATmega328", "1e9801": "ATmega2560", "1e9703": "ATmega1280",
  "1e9406": "ATmega168", "1e940b": "ATmega168P", "1e9587": "ATmega32U4",
};
const WANT = { uno: ["ATmega328P", "ATmega328"], nano: ["ATmega328P", "ATmega328"], mega: ["ATmega2560"] };
/* the space below the bootloader: Optiboot takes 512 bytes, the old Nano
   bootloader 2 KB, the Mega's 8 KB */
const ROOM = { 115200: 32256, 57600: 30720, mega: 253952 };

/* USB ids, to give ports a name a student recognises and to catch the wrong board early */
const ARDUINO_VIDS = [0x2341, 0x2A03];
const MEGA_PIDS = [0x0010, 0x0042, 0x0242, 0x0210];
const UNO_PIDS = [0x0001, 0x0043, 0x0243];
function portName(info) {
  const v = info.usbVendorId, p = info.usbProductId;
  if (ARDUINO_VIDS.includes(v)) return MEGA_PIDS.includes(p) ? "Arduino Mega 2560" : UNO_PIDS.includes(p) ? "Arduino Uno" : "Arduino board";
  if (v === 0x1A86) return "CH340 USB serial (Nano or clone)";
  if (v === 0x0403) return "FTDI USB serial (older Nano)";
  if (v === 0x10C4) return "CP210x USB serial";
  return v ? "USB serial port" : "Serial port";
}

/* ---------- errors a student can act on ---------- */
class Oops extends Error { constructor(title, more) { super(title); this.more = more || ""; } }
const NO_ANSWER = more => new Oops("The board didn't answer.", `${more ? more + " " : ""}Check that:
  <ul><li>the board chosen above is the board that's plugged in;</li>
  <li>the USB cable carries data (some cables only charge: try another);</li>
  <li>nothing is wired to pins 0 and 1 (RX and TX): unplug those wires while you upload.</li></ul>
  Then press Upload again. If it still fails, press the board's reset button just as "Connecting" appears.`);
const BUSY = new Oops("The port is busy.", `Another program has the board open. Close the Arduino IDE's Serial Monitor (or the whole Arduino IDE), any other Circuit Lab tab that's uploading, and anything else talking to the board, then try again. Unplugging the board and plugging it back in also frees it.`);
const NO_PORT = new Oops("No board was picked.", `Plug the Arduino in with a USB cable, press Upload again and pick it from the list. It's often called <b>Arduino Uno</b>, <b>USB Serial</b>, <b>CH340</b>, <b>usbserial</b> or <b>usbmodem</b>.
  If the list is empty: try another cable or USB socket. On Windows, a cheap Nano clone may need the CH340 driver first.`);
const UNPLUGGED = new Oops("The board was unplugged (or the connection dropped).", "Plug it back in and press Upload again.");

/* ---------- Intel HEX ---------- */
function parseHex(text) {
  const bytes = new Uint8Array(256 * 1024).fill(0xFF);
  let base = 0, end = 0;
  for (const raw of text.split(/\r?\n/)) {
    const line = raw.trim(); if (!line.startsWith(":")) continue;
    const rec = line.slice(1).match(/../g).map(h => parseInt(h, 16));
    const n = rec[0], addr = (rec[1] << 8) | rec[2], type = rec[3];
    if (type === 0) { const at = base + addr; bytes.set(rec.slice(4, 4 + n), at); end = Math.max(end, at + n); }
    else if (type === 1) break;
    else if (type === 2) base = ((rec[4] << 8) | rec[5]) << 4;
    else if (type === 4) base = ((rec[4] << 8) | rec[5]) << 16;
  }
  return bytes.slice(0, end);
}

/* ---------- the serial line ---------- */
/* Web Serial hands over whatever bytes have arrived; the bootloader protocols
   want "the next n bytes, or give up after so long". This sits between. */
class Line {
  constructor(port) { this.port = port; this.buf = []; this.wake = null; this.err = null; }
  async open(baud) {
    try { await this.port.open({ baudRate: baud, bufferSize: 1024 }); }
    catch (e) {
      if (e.name === "InvalidStateError") { try { await this.port.close(); await this.port.open({ baudRate: baud, bufferSize: 1024 }); } catch (e2) { throw BUSY; } }
      else throw BUSY;
    }
    this.reader = this.port.readable.getReader(); this.writer = this.port.writable.getWriter();
    this.err = null; this.buf = [];
    this.pump();
  }
  async pump() {
    try { for (;;) { const { value, done } = await this.reader.read(); if (done) break; if (value) for (const b of value) this.buf.push(b); if (this.wake) this.wake(); } }
    catch (e) { this.err = e; if (this.wake) this.wake(); }
  }
  async read(n, ms) {
    const end = Date.now() + ms;
    while (this.buf.length < n) {
      if (this.err) throw UNPLUGGED;
      const left = end - Date.now(); if (left <= 0) throw new Error("timeout");
      await new Promise(r => { this.wake = r; setTimeout(r, left); }); this.wake = null;
    }
    return this.buf.splice(0, n);
  }
  drain() { this.buf.length = 0; }
  async write(bytes) { try { await this.writer.write(Uint8Array.from(bytes)); } catch (e) { throw UNPLUGGED; } }
  /* the Arduino's reset is wired to DTR through a capacitor: dropping and
     raising it restarts the board straight into its bootloader */
  async reset() {
    try {
      await this.port.setSignals({ dataTerminalReady: false, requestToSend: false }); await sleep(250);
      await this.port.setSignals({ dataTerminalReady: true, requestToSend: true }); await sleep(60);
    } catch (e) { throw UNPLUGGED; }
    this.drain();
  }
  async close() {
    try { await this.reader.cancel(); } catch (e) { }
    try { this.reader.releaseLock(); } catch (e) { }
    try { this.writer.releaseLock(); } catch (e) { }
    try { await this.port.close(); } catch (e) { }
  }
}

/* ---------- STK500 version 1 (Uno, Nano: Optiboot and the old bootloader) ---------- */
const INSYNC = 0x14, OK = 0x10, EOP = 0x20;
async function v1(L, cmd, want = 0, ms = 600) {
  await L.write([...cmd, EOP]);
  let r;
  try { r = await L.read(1, ms); } catch (e) { if (e instanceof Oops) throw e; throw new Error("no reply"); }
  if (r[0] !== INSYNC) throw new Error("out of sync");
  const data = want ? await L.read(want, ms) : [];
  if ((await L.read(1, ms))[0] !== OK) throw new Error("not OK");
  return data;
}
/* After a reset Optiboot flashes the LED for about 0.4 s before it listens,
   and meanwhile the chip keeps only the first two or three bytes that arrive.
   So it gets one "are you there?" and a long wait: asking again while it is
   deaf leaves half a message in the chip, which it reads as a broken command
   and quits to the old sketch. A second sync then checks both sides agree. */
async function v1sync(L) {
  for (let i = 0; i < 3; i++) {
    L.drain(); await L.write([0x30, EOP]);
    try {
      const r = await L.read(2, 700);
      if (r[0] !== INSYNC || r[1] !== OK) continue;
      await sleep(50); L.drain(); await L.write([0x30, EOP]);
      const r2 = await L.read(2, 300);
      if (r2[0] === INSYNC && r2[1] === OK) return true;
    } catch (e) { if (e instanceof Oops) throw e; }
  }
  return false;
}
async function v1flash(L, code, page, step) {
  await v1(L, [0x50]);                                   // enter programming mode
  const pages = Math.ceil(code.length / page);
  for (let i = 0; i < pages; i++) {
    const a = i * page, w = a >> 1, d = padded(code, a, page);
    await v1(L, [0x55, w & 0xFF, w >> 8]);               // load (word) address
    await v1(L, [0x64, page >> 8, page & 0xFF, 0x46, ...d], 0, 1500);
    step("write", (i + 1) / pages);
  }
  for (let i = 0; i < pages; i++) {
    const a = i * page, w = a >> 1, d = padded(code, a, page);
    await v1(L, [0x55, w & 0xFF, w >> 8]);
    const back = await v1(L, [0x74, page >> 8, page & 0xFF, 0x46], page, 1500);
    if (!same(back, d)) throw new Oops("The program didn't read back the same as it was written.", "Press Upload again. If it keeps happening, try another USB cable or socket.");
    step("check", (i + 1) / pages);
  }
  await v1(L, [0x51]);                                   // leave programming mode: the sketch starts
}
const v1sig = async L => chipOf(await v1(L, [0x75], 3));

/* ---------- STK500 version 2 (Mega 2560) ---------- */
async function v2(L, body, ms = 800) {
  const seq = L.seq = ((L.seq ?? -1) + 1) & 0xFF;
  const msg = [0x1B, seq, body.length >> 8, body.length & 0xFF, 0x0E, ...body];
  msg.push(msg.reduce((x, b) => x ^ b, 0));
  await L.write(msg);
  const end = Date.now() + ms;
  for (;;) {                                             // skip anything before the start byte
    const left = end - Date.now(); if (left <= 0) throw new Error("no reply");
    let b; try { [b] = await L.read(1, left); } catch (e) { if (e instanceof Oops) throw e; throw new Error("no reply"); }
    if (b === 0x1B) break;
  }
  const [s, hi, lo, tok] = await L.read(4, ms);
  const resp = await L.read((hi << 8) | lo, ms), [ck] = await L.read(1, ms);
  if (tok !== 0x0E || s !== seq || [0x1B, s, hi, lo, tok, ...resp].reduce((x, b) => x ^ b, 0) !== ck) throw new Error("garbled reply");
  if (resp[0] !== body[0] || resp[1] !== 0) throw new Error("command failed");
  return resp;
}
async function v2sync(L) {
  for (let i = 0; i < 8; i++) {
    L.drain();
    try { await v2(L, [0x01], 250); await sleep(30); L.drain(); return true; } catch (e) { if (e instanceof Oops) throw e; }
  }
  return false;
}
async function v2sig(L) {
  const s = [];
  for (let i = 0; i < 3; i++) s.push((await v2(L, [0x1B, 0x04, 0x30, 0x00, i, 0x00]))[2]);
  return chipOf(s);
}
async function v2flash(L, code, page, step) {
  await v2(L, [0x10, 200, 100, 25, 32, 0, 0x53, 3, 0xAC, 0x53, 0, 0]);   // enter programming mode
  const pages = Math.ceil(code.length / page);
  /* the top bit asks the bootloader to use the far half of the 256 KB flash too */
  const load = w => v2(L, [0x06, 0x80 | ((w >> 24) & 0x7F), (w >> 16) & 0xFF, (w >> 8) & 0xFF, w & 0xFF]);
  for (let i = 0; i < pages; i++) {
    const a = i * page, d = padded(code, a, page);
    await load(a >> 1);
    await v2(L, [0x13, page >> 8, page & 0xFF, 0xC1, 10, 0x40, 0x4C, 0x20, 0x00, 0x00, ...d], 2000);
    step("write", (i + 1) / pages);
  }
  for (let i = 0; i < pages; i++) {
    const a = i * page, d = padded(code, a, page);
    await load(a >> 1);
    const r = await v2(L, [0x14, page >> 8, page & 0xFF, 0x20], 2000);
    if (!same(r.slice(2, 2 + page), d)) throw new Oops("The program didn't read back the same as it was written.", "Press Upload again. If it keeps happening, try another USB cable or socket.");
    step("check", (i + 1) / pages);
  }
  await v2(L, [0x11, 1, 1]);                             // leave programming mode: the sketch starts
}

function padded(code, at, n) { const d = new Array(n).fill(0xFF); for (let i = 0; i < n && at + i < code.length; i++) d[i] = code[at + i]; return d; }
function same(a, b) { if (a.length !== b.length) return false; for (let i = 0; i < a.length; i++) if (a[i] !== b[i]) return false; return true; }
function chipOf(s) { const k = s.map(b => b.toString(16).padStart(2, "0")).join(""); return CHIPS[k] || "an unknown chip (" + k + ")"; }

/* ---------- one upload, start to finish ---------- */
async function flash(port, board, code, step) {
  const t = TARGETS[board], L = new Line(port);
  const info = port.getInfo ? port.getInfo() : {};
  if (ARDUINO_VIDS.includes(info.usbVendorId)) {
    if (board !== "mega" && MEGA_PIDS.includes(info.usbProductId)) throw new Oops(`The board plugged in is an Arduino Mega 2560, but ${t.label} is chosen.`, "Choose Mega 2560 above and press Upload again.");
    if (board === "mega" && UNO_PIDS.includes(info.usbProductId)) throw new Oops("The board plugged in is an Arduino Uno, but Mega 2560 is chosen.", "Choose Uno above and press Upload again.");
  }
  try {
    if (t.proto === 1) {
      for (const baud of t.bauds) {
        step("connect", 0, baud === 57600 ? "Trying the older Nano bootloader…" : "");
        await L.open(baud); await L.reset();
        if (await v1sync(L)) {
          const chip = await v1sig(L);
          if (!WANT[board].includes(chip)) throw wrongChip(chip, board);
          if (code.length > ROOM[baud]) throw tooBig(code.length, ROOM[baud]);
          await v1flash(L, code, t.page, step);
          return;
        }
        await L.close();
      }
      /* nothing answered as an Uno/Nano: is it a Mega? */
      await L.open(115200); await L.reset();
      if (await v2sync(L)) throw new Oops(`This board answers like an Arduino Mega 2560, but ${t.label} is chosen.`, "Choose Mega 2560 above and press Upload again.");
      throw NO_ANSWER(board === "uno" ? "If it's a Nano, choose Nano: some Nanos use a slower bootloader." : "");
    }
    step("connect", 0);
    await L.open(115200); await L.reset();
    if (await v2sync(L)) {
      const chip = await v2sig(L);
      if (!WANT.mega.includes(chip)) throw wrongChip(chip, board);
      if (code.length > ROOM.mega) throw tooBig(code.length, ROOM.mega);
      await v2flash(L, code, t.page, step);
      return;
    }
    /* nothing answered as a Mega: is it an Uno or Nano? */
    for (const baud of [115200, 57600]) {
      await L.close(); await L.open(baud); await L.reset();
      if (await v1sync(L)) throw new Oops(`This board answers like an Arduino ${baud === 57600 ? "Nano" : "Uno or Nano"}, but Mega 2560 is chosen.`, `Choose ${baud === 57600 ? "Nano" : "Uno (or Nano)"} above and press Upload again.`);
    }
    throw NO_ANSWER();
  } catch (e) {
    if (e instanceof Oops) throw e;
    throw NO_ANSWER("It started to answer, then stopped.");
  } finally { await L.close(); }
}
function wrongChip(chip, board) {
  if (chip === "ATmega2560") return new Oops(`This board is an Arduino Mega 2560, but ${TARGETS[board].label} is chosen.`, "Choose Mega 2560 above and press Upload again.");
  if (/ATmega328/.test(chip)) return new Oops("This board is an Uno or Nano, but Mega 2560 is chosen.", "Choose Uno or Nano above and press Upload again.");
  if (/ATmega168/.test(chip)) return new Oops("This board has an older ATmega168 chip.", "Circuit Lab builds programs for the ATmega328P (Uno, Nano) and the Mega 2560. Use the Arduino IDE with the board set to the ATmega168 version.");
  return new Oops(`This board has ${chip}, which Circuit Lab can't upload to.`, "Circuit Lab uploads to the Uno, Nano and Mega 2560. For other boards, download the .ino and use the Arduino IDE.");
}
const tooBig = (n, room) => new Oops("The program is too big for this board.", `It needs ${n.toLocaleString()} bytes and the board has room for ${room.toLocaleString()}. Remove a library or some long text, or use a Mega 2560.`);

/* ---------- the dialog ---------- */
const PKEY = "circuitlab.uploadBoard";
let busy = false, ports = [];

export function initUpload(ctx) {
  C = ctx;
  const btn = $("#flashbtn"), ino = $('[data-act="ino"]');
  if (supported) { if (btn) btn.hidden = false; return; }
  /* Safari, Firefox, phones and iPads have no Web Serial, so the button stays
     hidden and the .ino download says why */
  if (ino) ino.title = "Download .ino for the Arduino IDE (uploading straight to a board needs Chrome or Edge on a computer)";
}

function pickBoard() {
  const b = C.boardType();
  if (b === "esp32") return "esp32";
  if (TARGETS[b]) return b;
  try { const s = localStorage.getItem(PKEY); if (TARGETS[s]) return s; } catch (e) { }
  return "uno";
}

export async function showUpload() {
  if (!supported) return C.toast("Uploading to a board needs Chrome or Edge on a computer. Download the .ino for the Arduino IDE instead.", "", 5000);
  if (busy) { C.openModal(dialogHtml(), "upl"); return show(lastStep.phase, lastStep.f, lastStep.extra); }
  try { ports = await navigator.serial.getPorts(); } catch (e) { ports = []; }
  C.openModal(dialogHtml(), "upl");
  boardChanged();
}

function dialogHtml() {
  const b = pickBoard(), names = {};
  const opts = ports.map((p, i) => {
    let n = portName(p.getInfo()); names[n] = (names[n] || 0) + 1; if (names[n] > 1) n += ` (${names[n]})`;
    return `<option value="${i}">${esc(n)}</option>`;
  }).join("");
  return `<div class="mh"><h2>${C.ic("chip")}Upload to board</h2><button class="mx" data-close aria-label="Close">${C.ic("x")}</button></div>
    <div class="mbody">
      <p class="muted small uplead">Puts your code on a real Arduino plugged in by USB, like the Arduino IDE's Upload button.</p>
      <div class="uprow">
        <label>Board<select id="upboard" ${busy ? "disabled" : ""}>
          <option value="uno"${b === "uno" ? " selected" : ""}>Arduino Uno</option>
          <option value="nano"${b === "nano" ? " selected" : ""}>Arduino Nano</option>
          <option value="mega"${b === "mega" ? " selected" : ""}>Arduino Mega 2560</option>
          <option value="esp32"${b === "esp32" ? " selected" : ""}>ESP32 (not yet)</option>
        </select></label>
        <label>Port<select id="upport" ${busy ? "disabled" : ""}>${opts}<option value="new"${ports.length ? "" : " selected"}>${ports.length ? "Another port…" : "Choose when you press Upload…"}</option></select></label>
      </div>
      <div id="upnote" class="upnote" hidden></div>
      <div class="upprog" id="upprog" hidden><div class="upbar"><i id="upfill"></i></div><div id="upstate" class="upstate" role="status" aria-live="polite"></div></div>
      <div id="upmsg"></div>
      <div class="upbtns"><button class="btn primary" data-act="doflash" id="updo" ${busy ? "disabled" : ""}>${C.ic("arrow")}Upload</button></div>
    </div>`;
}

export function boardChanged() {
  const sel = $("#upboard"); if (!sel) return;
  const esp = sel.value === "esp32", note = $("#upnote"), go = $("#updo");
  note.hidden = !esp;
  note.innerHTML = esp ? `<b>ESP32 upload isn't supported yet.</b> Circuit Lab's compiler only builds for Arduino (AVR) boards. For now, press the download button on the Code tab to get the .ino and upload it with the Arduino IDE.` : "";
  if (go && !busy) go.disabled = esp;
  if (!esp) try { localStorage.setItem(PKEY, sel.value); } catch (e) { }
}

const PHASES = { compile: "Compiling your sketch…", connect: "Connecting to the board…", write: "Uploading", check: "Checking" };
let lastStep = { phase: "", f: 0, extra: "" };
function show(phase, f = 0, extra = "") {
  lastStep = { phase, f, extra };
  const box = $("#upprog"); if (!box) return;
  box.hidden = false;
  const pct = phase === "write" ? f * 70 : phase === "check" ? 70 + f * 30 : phase === "done" ? 100 : 0;
  const fill = $("#upfill");
  fill.style.width = pct + "%"; fill.parentElement.classList.toggle("wait", phase === "compile" || phase === "connect");
  const text = phase === "done" ? "Done: the program is on the board and running." :
    (extra || PHASES[phase] || "") + (phase === "write" || phase === "check" ? ` ${Math.round(pct)}%` : "");
  /* the start-up robot keeps the student company while it works */
  $("#upstate").innerHTML = phase !== "done" && window.Robo ? window.Robo.html("s", esc(text)) : esc(text);
}
function fail(title, more) {
  const m = $("#upmsg");
  if (m) m.innerHTML = `<div class="uperr"><b>${esc(title)}</b>${more ? `<div>${more}</div>` : ""}</div>`;
  else C.toast(esc(title), "", 5000);
  const box = $("#upprog"); if (box) box.hidden = true;
}

export async function doFlash() {
  if (busy) return;
  const board = $("#upboard").value, choice = $("#upport").value;
  if (!TARGETS[board]) return;
  $("#upmsg").innerHTML = "";
  /* the port is asked for first: the browser only shows its chooser straight
     after a click, and compiling can take longer than that */
  let port = ports[+choice];
  if (choice === "new" || !port) {
    try { port = await navigator.serial.requestPort(); }
    catch (e) { return fail(NO_PORT.message, NO_PORT.more); }
  }
  busy = true; lock(true);
  try {
    show("compile");
    const hex = await C.buildHex(board);
    const code = parseHex(hex);
    await flash(port, board, code, show);
    show("done");
    if (!$("#upprog")) C.toast(`${C.ic("check")}Uploaded to the ${esc(TARGETS[board].label)}`, "ok", 4000);
  } catch (e) {
    if (e instanceof Oops) fail(e.message, e.more);
    else if (e && e.service) fail(e.offline ? "You're offline." : "The compiler isn't answering.", esc(e.message) + " Your code is safe: try again in a moment.");
    else if (e && e.codeErr) fail("Your code has errors, so nothing was uploaded.", "The Code tab shows where they are. Fix them and press Upload again.");
    else { console.error(e); fail("Something went wrong while uploading.", esc(e && e.message || "")); }
  } finally {
    busy = false; lock(false);
    try { ports = await navigator.serial.getPorts(); } catch (e) { }
  }
}
function lock(on) {
  ["#upboard", "#upport", "#updo"].forEach(s => { const el = $(s); if (el) el.disabled = on; });
  if (!on) boardChanged();
  if (on && lastStep.phase) show(lastStep.phase, lastStep.f, lastStep.extra);
}
