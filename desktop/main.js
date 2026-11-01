/* Robotics & AI Club as a desktop app (Mac and Windows).

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
const { app, BrowserWindow, net, protocol, shell, Menu } = require("electron");
const path = require("path");
const fs = require("fs");
const { pathToFileURL } = require("url");

const ORIGIN = "https://cassimhossain.github.io";
const BASE = "/lab-planner/";
const HOME = ORIGIN + BASE;
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

function open(url) {
  const win = new BrowserWindow({
    width: 1440, height: 920, minWidth: 900, minHeight: 600,
    title: "Robotics & AI Club", backgroundColor: "#0B1220", show: false,
    icon: path.join(__dirname, "icon.png"),
    webPreferences: { contextIsolation: true, sandbox: true },
  });
  win.once("ready-to-show", () => win.show());
  /* pages of the site (Circuit Lab opened in a new tab, for example) open in
     another app window; everything else opens in the normal web browser */
  win.webContents.setWindowOpenHandler(({ url: to }) => {
    if (to.startsWith(HOME)) { open(to); return { action: "deny" }; }
    if (/^https?:|^mailto:/.test(to)) shell.openExternal(to);
    return { action: "deny" };
  });
  win.webContents.on("will-navigate", (e, to) => {
    if (!to.startsWith(HOME) && /^https?:/.test(to)) { e.preventDefault(); shell.openExternal(to); }
  });
  win.loadURL(url);
  return win;
}

if (!app.requestSingleInstanceLock()) app.quit();
else {
  app.on("second-instance", () => { const w = BrowserWindow.getAllWindows()[0]; if (w) { if (w.isMinimized()) w.restore(); w.focus(); } });
  app.whenReady().then(() => {
    protocol.handle("https", answer);
    Menu.setApplicationMenu(Menu.buildFromTemplate([
      ...(process.platform === "darwin" ? [{ role: "appMenu" }] : []),
      { role: "fileMenu" }, { role: "editMenu" },
      { label: "Go", submenu: [
        { label: "Portal", accelerator: "CmdOrCtrl+1", click: (_, w) => w && w.loadURL(HOME) },
        { label: "Circuit Lab", accelerator: "CmdOrCtrl+2", click: (_, w) => w && w.loadURL(HOME + "circuit/?from=portal") },
        { label: "Code Lab", accelerator: "CmdOrCtrl+3", click: (_, w) => w && w.loadURL(HOME + "codelab/?from=portal") },
        { type: "separator" },
        { label: "Back", accelerator: "CmdOrCtrl+[", click: (_, w) => w && w.webContents.navigationHistory.canGoBack() && w.webContents.navigationHistory.goBack() },
        { label: "Forward", accelerator: "CmdOrCtrl+]", click: (_, w) => w && w.webContents.navigationHistory.canGoForward() && w.webContents.navigationHistory.goForward() },
      ] },
      { role: "viewMenu" }, { role: "windowMenu" },
    ]));
    open(HOME);
    app.on("activate", () => { if (!BrowserWindow.getAllWindows().length) open(HOME); });
  });
  app.on("window-all-closed", () => { if (process.platform !== "darwin") app.quit(); });
}
