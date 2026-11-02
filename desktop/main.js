/* BotBench: the Robotics & AI Club site as a desktop app (Mac and Windows).

   It opens the club's site at its real address, so everything behaves as it
   does in the browser: Study Buddy, the Google Sheet attendance, saved work.
   Every page of the site is answered here, in the app:
   - online, from the live site, so the app always has the latest version
     without being reinstalled;
   - offline (or if the site doesn't answer in time), from the copy of the
     site packed inside the app, so the portal, the lessons, Circuit Lab and
     the offline Code Lab languages keep working with no internet.
   Anything outside the site (the AI, the Sheet, videos) goes to the internet
   as usual and simply waits for a connection.

   On top of the site the app adds what a website can't do: real files
   (File > New, Open, Save, and double-clicking a .circuit file), its own
   Arduino compiler for when there is no internet, and a notice when a newer
   version of the app is out. BotBench Labs keeps Circuit Lab and Code Lab
   both open and switches between them instantly. */
const { app, BaseWindow, BrowserWindow, WebContentsView, net, protocol, shell, Menu, session, dialog, ipcMain } = require("electron");
const path = require("path");
const fs = require("fs");
const os = require("os");
const { execFile } = require("child_process");
const { pathToFileURL } = require("url");

const ORIGIN = "https://cassimhossain.github.io";
const BASE = "/lab-planner/";
/* "full" is the whole site; "circuit" (the Windows build for students) is
   Circuit Lab and Code Lab only */
const MODE = process.env.BOTBENCH_MODE || require("./package.json").labMode || "full";   // BOTBENCH_MODE=circuit tries the Windows build on a Mac
const ROOT = ORIGIN + BASE;
const HOME = MODE === "circuit" ? ROOT + "circuit/" : ROOT;
const NAME = MODE === "circuit" ? "BotBench Labs" : "BotBench";
/* the student build opens Circuit Lab and Code Lab only; the full build, the whole site */
const ALLOWED = MODE === "circuit" ? [ROOT + "circuit/", ROOT + "codelab/"] : [ROOT];
const inApp = to => ALLOWED.some(a => to.startsWith(a));
const labOf = url => (url || "").startsWith(ROOT + "codelab/") ? "codelab" : (url || "").startsWith(ROOT + "circuit/") ? "circuit" : null;
/* saved work lives in a folder named after the app; it keeps the names the
   apps had before they were called BotBench, so nothing saved goes missing */
app.setPath("userData", path.join(app.getPath("appData"), MODE === "circuit" ? "Circuit Lab" : "Robotics Club Lab"));
const LOCAL = app.isPackaged ? path.join(process.resourcesPath, "site") : path.join(__dirname, "site");
const WAIT = 6000;   // how long the live site gets before the packed copy answers
const PRELOAD = path.join(__dirname, "preload.js");

const withTimeout = (p, ms) => Promise.race([p, new Promise((_, no) => setTimeout(() => no(new Error("timeout")), ms))]);

/* the packed copy of one page of the site, or a plain 404 */
function packed(rel) {
  let file = path.normalize(path.join(LOCAL, rel));
  if (!file.startsWith(LOCAL)) return new Response("Not found", { status: 404 });
  try { if (fs.statSync(file).isDirectory()) file = path.join(file, "index.html"); } catch (e) { }
  if (!fs.existsSync(file)) {
    const nf = path.join(LOCAL, "404.html");
    return fs.existsSync(nf) ? net.fetch(pathToFileURL(nf).toString()).then(r => new Response(r.body, { status: 404, headers: r.headers })) : new Response("Not found", { status: 404 });
  }
  return net.fetch(pathToFileURL(file).toString());
}

/* LAB_OFFLINE=1 opens the app as if there were no internet, to check the packed copy */
const FORCE_OFFLINE = process.env.LAB_OFFLINE === "1";

/* everything that isn't the site goes out as it came in, Origin included:
   Study Buddy's server only answers requests from the club's site */
function passOn(req) {
  const headers = new Headers(req.headers);
  if (!headers.has("origin") && req.method !== "GET" && req.method !== "HEAD") headers.set("origin", ORIGIN);
  const init = { method: req.method, headers, bypassCustomProtocolHandlers: true, redirect: "follow" };
  if (req.body && req.method !== "GET" && req.method !== "HEAD") { init.body = req.body; init.duplex = "half"; }
  return net.fetch(req.url, init);
}

async function answer(req) {
  const u = new URL(req.url);
  if (req.url === BUILD) return build(req);
  if (u.origin !== ORIGIN || !(u.pathname + "/").startsWith(BASE)) return FORCE_OFFLINE ? Response.error() : passOn(req);
  const rel = decodeURIComponent(u.pathname.slice(BASE.length) || "index.html");
  if (req.method === "GET" && net.isOnline() && !FORCE_OFFLINE) {
    try {
      /* pages are always checked with the site, so a change shows on the next
         reload instead of after GitHub's 10-minute cache; versioned files
         (?v=NN) still come from the cache */
      const page = /\.html$|\/$/.test(u.pathname) || !/\.[a-z0-9]+$/i.test(u.pathname);
      const fresh = page ? new Request(req, { headers: Object.assign(Object.fromEntries(req.headers), { "cache-control": "no-cache" }) }) : req;
      const r = await withTimeout(net.fetch(fresh, { bypassCustomProtocolHandlers: true }), WAIT);
      if (r.status < 500) return r;
    } catch (e) { }
  }
  return packed(rel.endsWith("/") ? rel + "index.html" : rel);
}

/* ---------- the Arduino compiler ----------
   Circuit Lab sends every sketch to Wokwi's free compiler. The app answers
   that request itself: online it passes it on as usual, and when there is no
   internet (or the service doesn't answer) it compiles with the arduino-cli
   packed inside the app, replying in exactly the same shape, so Circuit Lab
   can't tell the difference. The sketch's own libraries come with the request;
   the standard ones (Servo, Wire, LiquidCrystal...) are in the packed copy. */
const BUILD = "https://hexi.wokwi.com/build";
const COMPILER = app.isPackaged ? path.join(process.resourcesPath, "compiler") : path.join(__dirname, "compiler-src", process.platform === "win32" ? "win" : "mac");
const CLI = (() => {
  const own = path.join(COMPILER, "bin", process.platform === "win32" ? "arduino-cli.exe" : "arduino-cli");
  if (fs.existsSync(own)) return own;
  return ["/opt/homebrew/bin/arduino-cli", "/usr/local/bin/arduino-cli"].find(f => fs.existsSync(f)) || null;   // the Mac test copy uses Homebrew's
})();
const CORS = { "access-control-allow-origin": "*", "access-control-allow-methods": "POST, OPTIONS", "access-control-allow-headers": "content-type" };
async function build(req) {
  if (req.method === "OPTIONS") return new Response(null, { status: 204, headers: CORS });
  const body = await req.text();
  if (!FORCE_OFFLINE && net.isOnline()) {
    try {
      const r = await withTimeout(net.fetch(BUILD, { method: "POST", headers: { "content-type": "application/json", origin: ORIGIN }, body, bypassCustomProtocolHandlers: true }), 15000);
      if (r.ok) return new Response(await r.text(), { status: 200, headers: Object.assign({ "content-type": "application/json" }, CORS) });
    } catch (e) { }
  }
  let job; try { job = JSON.parse(body); } catch (e) { return new Response("bad request", { status: 400, headers: CORS }); }
  return new Response(JSON.stringify(await compileHere(job)), { status: 200, headers: Object.assign({ "content-type": "application/json" }, CORS) });
}
function compileHere({ sketch = "", files = [], board = "uno" }) {
  return new Promise(resolve => {
    if (!CLI || !fs.existsSync(path.join(COMPILER, "data"))) return resolve({ stdout: "", stderr: "This copy of the app has no offline compiler. Connect to the internet to compile.", hex: "", eep: "" });
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), "botbench-")), sk = path.join(dir, "sketch"), out = path.join(dir, "out");
    fs.mkdirSync(sk);
    fs.writeFileSync(path.join(sk, "sketch.ino"), sketch);
    for (const f of files) if (f && /^[\w.\-]+$/.test(f.name || "")) fs.writeFileSync(path.join(sk, f.name), String(f.content || ""));
    const fqbn = board === "mega" ? "arduino:avr:mega:cpu=atmega2560" : "arduino:avr:uno";
    const env = Object.assign({}, process.env, {
      ARDUINO_DIRECTORIES_DATA: path.join(COMPILER, "data"), ARDUINO_DIRECTORIES_USER: path.join(COMPILER, "user"),
      ARDUINO_DIRECTORIES_DOWNLOADS: path.join(os.tmpdir(), "botbench-arduino-dl"),
      ARDUINO_UPDATER_ENABLE_NOTIFICATION: "false", ARDUINO_METRICS_ENABLED: "false",
    });
    /* error lines name the sketch as /sketch/sketch.ino, as the online compiler does, so Circuit Lab can point at
       them. The compiler may spell the temporary folder differently (/private/var on a Mac, a short name on
       Windows), so any path that ends in our botbench-…/sketch folder counts. */
    const clean = s => String(s || "").replace(/[^\s'"]*botbench-[^\\/\s'"]*[\\/]sketch(?=[\\/]|\b)/g, "/sketch").replace(/\/sketch\\/g, "/sketch/");
    const read = f => { try { return fs.readFileSync(path.join(out, f), "utf8"); } catch (e) { return ""; } };
    execFile(CLI, ["compile", "--fqbn", fqbn, "--output-dir", out, "--no-color", sk], { env, cwd: COMPILER, timeout: 180000, maxBuffer: 16 * 1024 * 1024, windowsHide: true }, (err, stdout, stderr) => {
      resolve({ stdout: clean(stdout), stderr: clean(stderr) || (err ? String(err.message) : ""), hex: err ? "" : read("sketch.ino.hex"), eep: err ? "" : read("sketch.ino.eep") });
      fs.rm(dir, { recursive: true, force: true }, () => { });
    });
  });
}

/* Circuit Lab's "Upload to board" uses Web Serial. A browser shows its own
   list of ports; Electron leaves that to the app, so this is that list. A
   single Arduino-looking port is picked without asking. Only the club's site
   may use serial ports. */
const ARDUINO_VIDS = [0x2341, 0x2A03, 0x1A86, 0x0403];   // Arduino, Arduino.org, CH340 clones, FTDI
const vid = p => { const s = String(p.vendorId || ""); return /^0x/i.test(s) ? parseInt(s, 16) : parseInt(s, 10); };
const looksArduino = p => ARDUINO_VIDS.includes(vid(p));
function portLabel(p) {
  const v = vid(p), name = p.displayName || p.portName || "Serial port";
  const kind = v === 0x2341 || v === 0x2A03 ? "Arduino" : v === 0x1A86 ? "CH340 (Nano or clone)" : v === 0x0403 ? "FTDI" : "";
  return kind && !name.includes(kind) ? `${name}  (${kind})` : name;
}
const winOf = wc => BrowserWindow.fromWebContents(wc) || (labs && labs.win);
function serialPorts() {
  const ses = session.defaultSession;
  ses.setPermissionCheckHandler((wc, permission, origin) => permission === "serial" ? origin === ORIGIN : true);
  ses.setDevicePermissionHandler(d => d.deviceType === "serial" && d.origin === ORIGIN);
  ses.on("select-serial-port", async (event, list, wc, callback) => {
    event.preventDefault();
    /* Bluetooth and debug ports a student would never mean */
    const ports = list.filter(p => !/bluetooth|debug-console|wlan-debug/i.test(p.portName || ""));
    const arduinos = ports.filter(looksArduino);
    if (arduinos.length === 1) return callback(arduinos[0].portId);
    if (!ports.length) {
      await dialog.showMessageBox(winOf(wc), { type: "info", message: "No board found", detail: "Plug the Arduino in with a USB cable (one that carries data, not just charge), then press Upload again.", buttons: ["OK"] });
      return callback("");
    }
    const order = [...arduinos, ...ports.filter(p => !looksArduino(p))].slice(0, 8);
    const { response } = await dialog.showMessageBox(winOf(wc), {
      type: "question", message: "Which port is the Arduino on?",
      detail: "Unplug the board and press Upload again to see which one disappears, if you're not sure.",
      buttons: [...order.map(portLabel), "Cancel"], cancelId: order.length, defaultId: 0, noLink: true,
    });
    callback(response < order.length ? order[response].portId : "");
  });
}

/* ---------- pages: where links go ---------- */
function guard(wc) {
  /* pages of the site (Circuit Lab opened in a new tab, for example) open in
     another app window; everything else opens in the normal web browser */
  wc.setWindowOpenHandler(({ url: to }) => {
    if (labs && labOf(to)) { showLab(labOf(to)); return { action: "deny" }; }
    if (inApp(to)) { open(to); return { action: "deny" }; }
    if (/^https?:|^mailto:/.test(to)) shell.openExternal(to);
    return { action: "deny" };
  });
  wc.on("will-navigate", (e, to) => {
    /* in BotBench Labs the other lab is already open next door: switch to it */
    if (labs && labOf(to) && labOf(to) !== labOf(wc.getURL())) { e.preventDefault(); showLab(labOf(to)); return; }
    if (inApp(to)) return;
    e.preventDefault();
    if (!to.startsWith(ROOT) && /^https?:/.test(to)) shell.openExternal(to);   // other pages of the site stay closed in the student build
  });
}
const PREFS = { contextIsolation: true, sandbox: true, preload: PRELOAD };

/* BotBench (Mac): one window per page, as before */
function open(url) {
  const win = new BrowserWindow({
    width: 1440, height: 920, minWidth: 900, minHeight: 600,
    title: NAME, backgroundColor: "#0B1220", show: false,
    icon: path.join(__dirname, MODE === "circuit" ? "icon-circuit.png" : "icon.png"),
    webPreferences: PREFS,
  });
  win.once("ready-to-show", () => win.show());
  guard(win.webContents);
  win.loadURL(url);
  return win;
}

/* BotBench Labs (Windows): one window holding both labs. Both stay loaded,
   so switching is instant and nothing is lost: a running simulation, the
   circuit and the code are all still there when you come back. */
let labs = null;
const LABNAME = { circuit: "Circuit Lab", codelab: "Code Lab" };
function openLabs() {
  const win = new BaseWindow({
    width: 1440, height: 920, minWidth: 900, minHeight: 600, title: NAME, backgroundColor: "#0B1220", show: false,
    icon: path.join(__dirname, "icon-circuit.png"),
  });
  const views = {};
  for (const lab of ["circuit", "codelab"]) {
    const v = new WebContentsView({ webPreferences: PREFS });
    v.setBackgroundColor("#0B1220");
    win.contentView.addChildView(v);
    guard(v.webContents);
    v.webContents.loadURL(ROOT + lab + "/");
    views[lab] = v;
  }
  labs = { win, views, current: "circuit" };
  const fit = () => { const [w, h] = win.getContentSize(); for (const v of Object.values(views)) v.setBounds({ x: 0, y: 0, width: w, height: h }); };
  win.on("resize", fit); fit();
  showLab("circuit");
  views.circuit.webContents.once("did-finish-load", () => win.show());
  setTimeout(() => { if (!win.isDestroyed() && !win.isVisible()) win.show(); }, 4000);
  win.on("closed", () => { labs = null; app.quit(); });
}
function showLab(lab) {
  if (!labs || !labs.views[lab]) return null;
  labs.current = lab;
  for (const [k, v] of Object.entries(labs.views)) v.setVisible(k === lab);
  labs.views[lab].webContents.focus();
  retitle();
  return labs.views[lab].webContents;
}
/* the page in front: the lab on show, or the focused window */
function activeWC() {
  if (labs) return labs.views[labs.current].webContents;
  const w = BrowserWindow.getFocusedWindow() || BrowserWindow.getAllWindows()[0];
  return w && w.webContents;
}

/* ---------- real files ----------
   Save and Open drive the labs' own Download and Upload buttons, so a file
   saved here is exactly what the website would download, and the labs need
   nothing special. The app remembers which file each lab is working on, so
   Save writes it again without asking. */
const current = new Map();          // webContents id -> the file it is working on
const saving = new Map();           // webContents id -> { as } while a Save is in flight
const DOCS = () => { const d = path.join(app.getPath("documents"), "BotBench"); try { fs.mkdirSync(d, { recursive: true }); } catch (e) { } return d; };
const CIRCUIT_EXT = [".circuit", ".json"];
const CODE_EXT = ["py", "cpp", "cc", "c", "h", "txt", "js", "pde", "html", "htm", "css"];
function retitle() {
  const wc = activeWC(); if (!wc) return;
  const f = current.get(wc.id), lab = labs ? LABNAME[labs.current] : null;
  const t = [f ? path.basename(f) : null, lab, NAME].filter(Boolean).join(" · ");
  (labs ? labs.win : BrowserWindow.fromWebContents(wc)).setTitle(t);
}
function saveFile(as) {
  const wc = activeWC(); if (!wc || !labOf(wc.getURL())) return;
  saving.set(wc.id, { as });
  wc.executeJavaScript(`(document.querySelector('.top [data-act="download"], [data-act="download"]') || { click() {} }).click()`).catch(() => { });
}
function watchDownloads() {
  session.defaultSession.on("will-download", (e, item, wc) => {
    const ask = wc && saving.get(wc.id);
    if (!ask) return;                                   // any other download: the app asks where to put it
    saving.delete(wc.id);
    const lab = labOf(wc.getURL());
    let name = item.getFilename();
    if (lab === "circuit") name = name.replace(/\.circuit\.json$|\.json$/i, "") + ".circuit";
    const was = current.get(wc.id);
    if (was && !ask.as && path.extname(was).toLowerCase() === path.extname(name).toLowerCase()) item.setSavePath(was);
    else item.setSaveDialogOptions({
      title: ask.as ? "Save a copy as" : "Save",
      defaultPath: path.join(was ? path.dirname(was) : DOCS(), name),
      filters: lab === "circuit" ? [{ name: "Circuit Lab circuit", extensions: ["circuit"] }] : [{ name: "Program", extensions: [path.extname(name).slice(1) || "txt"] }],
    });
    item.once("done", (ev, state) => { if (state === "completed") { current.set(wc.id, item.getSavePath()); app.addRecentDocument(item.getSavePath()); retitle(); } });
  });
}
async function openFile(file) {
  if (!file) {
    const w = labs ? labs.win : BrowserWindow.getFocusedWindow();
    const r = await dialog.showOpenDialog(w, {
      title: "Open", defaultPath: DOCS(), properties: ["openFile"],
      filters: [{ name: "Circuits and programs", extensions: ["circuit", "json", ...CODE_EXT] }, { name: "Circuit Lab circuit", extensions: ["circuit", "json"] }, { name: "Program", extensions: CODE_EXT }],
    });
    if (r.canceled || !r.filePaths.length) return;
    file = r.filePaths[0];
  }
  let text; try { text = fs.readFileSync(file, "utf8"); } catch (e) { return dialog.showErrorBox("Can't open the file", String(e.message)); }
  const lab = CIRCUIT_EXT.includes(path.extname(file).toLowerCase()) ? "circuit" : "codelab";
  let wc;
  if (labs) wc = showLab(lab);
  else {
    wc = activeWC();
    if (!wc || labOf(wc.getURL()) !== lab) { const w = open(ROOT + lab + "/?from=portal"); wc = w.webContents; }
  }
  if (!wc) return;
  if (wc.isLoading()) await new Promise(r => wc.once("did-finish-load", r));
  /* the lab's own Upload input takes the file, as if the student had picked it */
  const name = lab === "circuit" ? path.basename(file).replace(/\.circuit$/i, "") + ".json" : path.basename(file);
  await wc.executeJavaScript(`(async (name, text) => {
    for (let i = 0; i < 60 && !document.getElementById("fileup"); i++) await new Promise(r => setTimeout(r, 200));
    await new Promise(r => setTimeout(r, 600));
    const inp = document.getElementById("fileup"); if (!inp) return false;
    const dt = new DataTransfer(); dt.items.add(new File([text], name)); inp.files = dt.files;
    inp.dispatchEvent(new Event("change", { bubbles: true })); return true;
  })(${JSON.stringify(name)}, ${JSON.stringify(text)})`).catch(() => { });
  current.set(wc.id, file); app.addRecentDocument(file); retitle();
}
function newFile() {
  const wc = activeWC(); if (!wc || !labOf(wc.getURL())) return;
  current.delete(wc.id); retitle();
  wc.executeJavaScript(`(document.querySelector('[data-act="new"]') || { click() {} }).click()`).catch(() => { });
}
/* a .circuit file double-clicked in Explorer arrives on the command line */
const fileArg = argv => argv.slice(1).find(a => /\.(circuit|json)$/i.test(a) && fs.existsSync(a));

/* ---------- newer version notice ----------
   The site carries botbench.json with the newest installer's version. If it
   is newer than this app, say so once every few days; the button opens the
   download page. Updates to the labs themselves need nothing: they come with
   the live site. */
const newer = (a, b) => { const x = String(a).split(".").map(Number), y = String(b).split(".").map(Number); for (let i = 0; i < 3; i++) { if ((x[i] || 0) !== (y[i] || 0)) return (x[i] || 0) > (y[i] || 0); } return false; };
async function checkForUpdate() {
  if (FORCE_OFFLINE || !net.isOnline()) return;
  try {
    const r = await withTimeout(net.fetch(ROOT + "botbench.json?t=" + Date.now(), { bypassCustomProtocolHandlers: true, cache: "no-store" }), 8000);
    const want = (await r.json())[MODE === "circuit" ? "labs" : "mac"];
    if (!want || !newer(want.version, app.getVersion())) return;
    const seen = path.join(app.getPath("userData"), "update-notice.json");
    let last = {}; try { last = JSON.parse(fs.readFileSync(seen, "utf8")); } catch (e) { }
    if (last.version === want.version && Date.now() - last.at < 3 * 864e5) return;
    fs.writeFileSync(seen, JSON.stringify({ version: want.version, at: Date.now() }));
    const { response } = await dialog.showMessageBox(labs ? labs.win : BrowserWindow.getAllWindows()[0], {
      type: "info", message: `${NAME} ${want.version} is available`, buttons: ["Download", "Later"], defaultId: 0, cancelId: 1,
      detail: `${want.notes || "A newer version of the app is ready."}\n\nYou have ${app.getVersion()}. Your saved work is kept when you install the new one.`,
    });
    if (response === 0 && want.url) shell.openExternal(want.url);
  } catch (e) { }
}

/* ---------- menus ---------- */
const view = (fn) => () => { const wc = activeWC(); if (wc) fn(wc); };
function menu() {
  const fileMenu = { label: "File", submenu: [
    { label: "New", accelerator: "CmdOrCtrl+N", click: newFile },
    { label: "Open…", accelerator: "CmdOrCtrl+O", click: () => openFile() },
    { type: "separator" },
    { label: "Save", accelerator: "CmdOrCtrl+S", click: () => saveFile(false) },
    { label: "Save As…", accelerator: "CmdOrCtrl+Shift+S", click: () => saveFile(true) },
    { type: "separator" },
    { label: "Open the BotBench folder", click: () => shell.openPath(DOCS()) },
    { type: "separator" },
    process.platform === "darwin" ? { role: "close" } : { role: "quit", label: "Exit" },
  ] };
  /* the labs handle their own keys (Ctrl+Z undoes a wire in Circuit Lab), so
     these show the shortcut without taking it over */
  const editMenu = { label: "Edit", submenu: [
    { label: "Undo", accelerator: "CmdOrCtrl+Z", registerAccelerator: false, click: view(wc => wc.undo()) },
    { label: "Redo", accelerator: "CmdOrCtrl+Y", registerAccelerator: false, click: view(wc => wc.redo()) },
    { type: "separator" },
    { label: "Cut", accelerator: "CmdOrCtrl+X", registerAccelerator: false, click: view(wc => wc.cut()) },
    { label: "Copy", accelerator: "CmdOrCtrl+C", registerAccelerator: false, click: view(wc => wc.copy()) },
    { label: "Paste", accelerator: "CmdOrCtrl+V", registerAccelerator: false, click: view(wc => wc.paste()) },
    { label: "Select all", accelerator: "CmdOrCtrl+A", registerAccelerator: false, click: view(wc => wc.selectAll()) },
  ] };
  const zoom = d => view(wc => wc.setZoomLevel(d === 0 ? 0 : wc.getZoomLevel() + d));
  const viewMenu = { label: "View", submenu: [
    { label: "Reload", accelerator: "CmdOrCtrl+R", click: view(wc => wc.reload()) },
    { type: "separator" },
    { label: "Actual size", accelerator: "CmdOrCtrl+0", click: zoom(0) },
    { label: "Zoom in", accelerator: "CmdOrCtrl+=", click: zoom(0.5) },
    { label: "Zoom out", accelerator: "CmdOrCtrl+-", click: zoom(-0.5) },
    { type: "separator" },
    { label: "Full screen", accelerator: process.platform === "darwin" ? "Ctrl+Cmd+F" : "F11", click: () => { const w = labs ? labs.win : BrowserWindow.getFocusedWindow(); if (w) w.setFullScreen(!w.isFullScreen()); } },
    { label: "Developer tools", accelerator: "CmdOrCtrl+Shift+I", click: view(wc => wc.toggleDevTools()) },
  ] };
  const goMenu = MODE === "circuit" ? { label: "Labs", submenu: [
    { label: "Circuit Lab", accelerator: "CmdOrCtrl+1", click: () => showLab("circuit") },
    { label: "Code Lab", accelerator: "CmdOrCtrl+2", click: () => showLab("codelab") },
  ] } : { label: "Go", submenu: [
    { label: "Portal", accelerator: "CmdOrCtrl+1", click: view(wc => wc.loadURL(ROOT)) },
    { label: "Circuit Lab", accelerator: "CmdOrCtrl+2", click: view(wc => wc.loadURL(ROOT + "circuit/?from=portal")) },
    { label: "Code Lab", accelerator: "CmdOrCtrl+3", click: view(wc => wc.loadURL(ROOT + "codelab/?from=portal")) },
    { type: "separator" },
    { label: "Back", accelerator: "CmdOrCtrl+[", click: view(wc => wc.navigationHistory.canGoBack() && wc.navigationHistory.goBack()) },
    { label: "Forward", accelerator: "CmdOrCtrl+]", click: view(wc => wc.navigationHistory.canGoForward() && wc.navigationHistory.goForward()) },
  ] };
  const helpMenu = { label: "Help", submenu: [
    { label: `About ${NAME}`, click: () => dialog.showMessageBox(labs ? labs.win : BrowserWindow.getFocusedWindow(), {
      type: "info", message: `${NAME} ${app.getVersion()}`, buttons: ["OK"],
      detail: `Robotics & AI Club · Qasim Mushtaq\n\nOnline, the labs come from the live site, so they are always up to date. Offline, the copy inside the app is used${CLI ? ", and Arduino sketches are compiled by the app itself" : ""}.\n\nFiles are saved in Documents › BotBench unless you choose somewhere else.`,
    }) },
    { label: "Check for a newer version", click: async () => { try { fs.rmSync(path.join(app.getPath("userData"), "update-notice.json"), { force: true }); } catch (e) { } await checkForUpdate(); } },
  ] };
  Menu.setApplicationMenu(Menu.buildFromTemplate([
    ...(process.platform === "darwin" ? [{ role: "appMenu" }] : []),
    fileMenu, editMenu, viewMenu, goMenu, ...(process.platform === "darwin" ? [{ role: "windowMenu" }] : []), helpMenu,
  ]));
}

if (!app.requestSingleInstanceLock()) app.quit();
else {
  app.on("second-instance", (e, argv) => {
    const w = labs ? labs.win : BrowserWindow.getAllWindows()[0];
    if (w) { if (w.isMinimized()) w.restore(); w.focus(); }
    const f = fileArg(argv); if (f) openFile(f);
  });
  app.on("open-file", (e, f) => { e.preventDefault(); if (app.isReady()) openFile(f); else app.once("ready", () => setTimeout(() => openFile(f), 1500)); });   // macOS
  ipcMain.on("show-lab", (e, lab) => {
    if (lab !== "circuit" && lab !== "codelab") return;
    if (labs) showLab(lab); else e.sender.loadURL(ROOT + lab + "/");
  });
  if (process.env.BOTBENCH_TEST) global.botbench = { saveFile, openFile, newFile, showLab, current, labs: () => labs };   // for the test script only
  app.whenReady().then(() => {
    protocol.handle("https", answer);
    serialPorts();
    watchDownloads();
    menu();
    if (MODE === "circuit") openLabs(); else open(HOME);
    const f = fileArg(process.argv); if (f) setTimeout(() => openFile(f), 1200);
    setTimeout(checkForUpdate, 6000);
    app.on("activate", () => { if (!labs && !BrowserWindow.getAllWindows().length) open(HOME); });
  });
  app.on("window-all-closed", () => { if (process.platform !== "darwin") app.quit(); });
}
