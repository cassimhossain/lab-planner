/* Circuit Lab - service worker.

   What it does: keeps a copy of the whole editor (this page, every module,
   the parts library, the lessons, the simulator and the fonts) so the app
   opens instantly and keeps working when the school's connection drops.

   What it cannot do: compile. "Start simulation" sends the sketch to the
   online build service, and nothing cached here can stand in for that. The
   desktop build is the answer for a room with no internet at all.

   Updating: every file is requested with ?v=NN. Bump that version in
   index.html and in VERSION below, and the old cache is thrown away whole on
   the next visit, so a student never runs half an old version. */

const VERSION = "v10";
const CACHE = "circuitlab-" + VERSION;
const V = "?" + VERSION.replace("v", "v=");          // "?v=10", the same string the page uses

const MODULES = ["app", "assist", "boards", "elements", "elements2", "elements3", "elements4", "elements5",
  "layout", "lessons", "lessons-jm", "lessons-le", "lessons-tl", "lessons-yi",
  "libs", "libs2", "libs3", "libs4", "libs5",
  "parts", "parts2", "parts3", "parts4", "parts5", "parts6", "parts7", "parts8",
  "schematic", "sim", "sim2", "sim3", "sim4", "sim5", "sim7", "snippets", "tools"];

/* the fonts, so an offline app does not drop to a system face mid-lesson. The
   woff2 files are named inside this stylesheet, so they are read out of it at
   install time rather than guessed. */
const FONT_CSS = "https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;600&display=swap";

const SHELL = [
  "./", "./index.html", "./circuit.css" + V, "./manifest.webmanifest" + V,
  "./icon-192.png", "./icon-512.png", "./icon-maskable-512.png",
  ...MODULES.map(m => "./" + m + ".js" + V),
  "../vendor/wokwi-elements.js" + V,
  "../vendor/codemirror/codemirror.min.js" + V,
  "../vendor/codemirror/codemirror.css" + V,
  "../vendor/avr8js.mjs",
  "../logo.svg",
  FONT_CSS,
];

self.addEventListener("install", e => {
  e.waitUntil((async () => {
    const c = await caches.open(CACHE);
    /* one at a time: addAll fails the whole install if any single file 404s,
       and a missing icon should not cost the student the offline copy */
    await Promise.all(SHELL.map(u => c.add(new Request(u, { cache: "reload" })).catch(() => {})));
    await precacheFonts(c);
    self.skipWaiting();
  })());
});

async function precacheFonts(c) {
  try {
    const css = await (await fetch(FONT_CSS)).text();
    const urls = [...new Set([...css.matchAll(/url\((https:\/\/fonts\.gstatic\.com[^)]+)\)/g)].map(m => m[1]))];
    await Promise.all(urls.slice(0, 40).map(u => c.add(u).catch(() => {})));
  } catch (e) { /* no fonts cached: the app still works, in a system face */ }
}

self.addEventListener("activate", e => {
  e.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter(k => k.startsWith("circuitlab-") && k !== CACHE).map(k => caches.delete(k)));
    await self.clients.claim();
  })());
});

const FONTS = /^https:\/\/fonts\.(googleapis|gstatic)\.com\//;

self.addEventListener("fetch", e => {
  const req = e.request;
  if (req.method !== "GET") return;                       // the compiler is a POST: never touched
  const url = new URL(req.url);
  const sameOrigin = url.origin === location.origin;
  if (!sameOrigin && !FONTS.test(req.url)) return;        // anything else goes straight to the network

  /* the page itself: fresh when online, cached when not, so a deployed update
     is never hidden behind yesterday's copy */
  if (req.mode === "navigate") {
    e.respondWith((async () => {
      try {
        const net = await fetch(req);
        const c = await caches.open(CACHE); c.put("./index.html", net.clone());
        return net;
      } catch (err) {
        return (await caches.match("./index.html")) || (await caches.match("./")) || Response.error();
      }
    })());
    return;
  }

  /* everything else: cached copy first (these URLs carry a version, so a
     cached one is never out of date), network behind it */
  e.respondWith((async () => {
    const hit = await caches.match(req, { ignoreSearch: false });
    if (hit) return hit;
    try {
      const net = await fetch(req);
      /* an opaque font response has status 0: still worth keeping, the
         browser can use it even though this script cannot read it */
      if (net && (net.status === 200 || net.type === "opaque")) {
        const c = await caches.open(CACHE); c.put(req, net.clone());
      }
      return net;
    } catch (err) {
      const loose = await caches.match(req, { ignoreSearch: true });
      if (loose) return loose;
      throw err;
    }
  })());
});
