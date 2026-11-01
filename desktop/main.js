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
   as usual and simply waits for a connection. */
const { app, BrowserWindow, net, protocol, shell, Menu, session, dialog } = require("electron");
const path = require("path");
const fs = require("fs");
const { pathToFileURL } = require("url");

const ORIGIN = "https://cassimhossain.github.io";
const BASE = "/lab-planner/";
/* "full" is the whole site; "circuit" (the Windows build for students) is
   Circuit Lab only: it opens there and never leaves it */
const MODE = require("./package.json").labMode || "full";
const ROOT = ORIGIN + BASE;
const HOME = MODE === "circuit" ? ROOT + "circuit/" : ROOT;
/* the student build opens Circuit Lab and Code Lab only; the full build, the whole site */
const ALLOWED = MODE === "circuit" ? [ROOT + "circuit/", ROOT + "codelab/"] : [ROOT];
const inApp = to => ALLOWED.some(a => to.startsWith(a));
/* saved work lives in a folder named after the app; it keeps the names the
   apps had before they were called BotBench, so nothing saved goes missing */
app.setPath("userData", path.join(app.getPath("appData"), MODE === "circuit" ? "Circuit Lab" : "Robotics Club Lab"));
const LOCAL = app.isPackaged ? path.join(process.resourcesPath, "site") : path.join(__dirname, "site");
const WAIT = 6000;   // how long the live site gets before the packed copy answers

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
  if (u.origin !== ORIGIN || !(u.pathname + "/").startsWith(BASE)) return FORCE_OFFLINE ? Response.error() : passOn(req);
  const rel = decodeURIComponent(u.pathname.slice(BASE.length) || "index.html");
  if (req.method === "GET" && net.isOnline() && !FORCE_OFFLINE) {
    try {
      const r = await withTimeout(net.fetch(req, { bypassCustomProtocolHandlers: true }), WAIT);
      if (r.status < 500) return r;
    } catch (e) { }
  }
  return packed(rel.endsWith("/") ? rel + "index.html" : rel);
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
      await dialog.showMessageBox(BrowserWindow.fromWebContents(wc), { type: "info", message: "No board found", detail: "Plug the Arduino in with a USB cable (one that carries data, not just charge), then press Upload again.", buttons: ["OK"] });
      return callback("");
    }
    const order = [...arduinos, ...ports.filter(p => !looksArduino(p))].slice(0, 8);
    const { response } = await dialog.showMessageBox(BrowserWindow.fromWebContents(wc), {
      type: "question", message: "Which port is the Arduino on?",
      detail: "Unplug the board and press Upload again to see which one disappears, if you're not sure.",
      buttons: [...order.map(portLabel), "Cancel"], cancelId: order.length, defaultId: 0, noLink: true,
    });
    callback(response < order.length ? order[response].portId : "");
  });
}

function open(url) {
  const win = new BrowserWindow({
    width: 1440, height: 920, minWidth: 900, minHeight: 600,
    title: MODE === "circuit" ? "BotBench Labs" : "BotBench", backgroundColor: "#0B1220", show: false,
    icon: path.join(__dirname, MODE === "circuit" ? "icon-circuit.png" : "icon.png"),
    webPreferences: { contextIsolation: true, sandbox: true },
  });
  win.once("ready-to-show", () => win.show());
  /* pages of the site (Circuit Lab opened in a new tab, for example) open in
     another app window; everything else opens in the normal web browser */
  win.webContents.setWindowOpenHandler(({ url: to }) => {
    if (inApp(to)) { open(to); return { action: "deny" }; }
    if (/^https?:|^mailto:/.test(to)) shell.openExternal(to);
    return { action: "deny" };
  });
  win.webContents.on("will-navigate", (e, to) => {
    if (inApp(to)) return;
    e.preventDefault();
    if (!to.startsWith(ROOT) && /^https?:/.test(to)) shell.openExternal(to);   // other pages of the site stay closed in the student build
  });
  win.loadURL(url);
  return win;
}

if (!app.requestSingleInstanceLock()) app.quit();
else {
  app.on("second-instance", () => { const w = BrowserWindow.getAllWindows()[0]; if (w) { if (w.isMinimized()) w.restore(); w.focus(); } });
  app.whenReady().then(() => {
    protocol.handle("https", answer);
    serialPorts();
    Menu.setApplicationMenu(Menu.buildFromTemplate([
      ...(process.platform === "darwin" ? [{ role: "appMenu" }] : []),
      { role: "fileMenu" }, { role: "editMenu" },
      ...(MODE === "circuit" ? [{ label: "Labs", submenu: [
        { label: "Circuit Lab", accelerator: "CmdOrCtrl+1", click: (_, w) => w && w.loadURL(ROOT + "circuit/") },
        { label: "Code Lab", accelerator: "CmdOrCtrl+2", click: (_, w) => w && w.loadURL(ROOT + "codelab/") },
      ] }] : [{ label: "Go", submenu: [
        { label: "Portal", accelerator: "CmdOrCtrl+1", click: (_, w) => w && w.loadURL(ROOT) },
        { label: "Circuit Lab", accelerator: "CmdOrCtrl+2", click: (_, w) => w && w.loadURL(ROOT + "circuit/?from=portal") },
        { label: "Code Lab", accelerator: "CmdOrCtrl+3", click: (_, w) => w && w.loadURL(ROOT + "codelab/?from=portal") },
        { type: "separator" },
        { label: "Back", accelerator: "CmdOrCtrl+[", click: (_, w) => w && w.webContents.navigationHistory.canGoBack() && w.webContents.navigationHistory.goBack() },
        { label: "Forward", accelerator: "CmdOrCtrl+]", click: (_, w) => w && w.webContents.navigationHistory.canGoForward() && w.webContents.navigationHistory.goForward() },
      ] }]),
      { role: "viewMenu" }, { role: "windowMenu" },
    ]));
    open(HOME);
    app.on("activate", () => { if (!BrowserWindow.getAllWindows().length) open(HOME); });
  });
  app.on("window-all-closed", () => { if (process.platform !== "darwin") app.quit(); });
}
