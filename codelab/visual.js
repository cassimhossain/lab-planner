/* Code Lab - the four languages whose output is a picture.

   Turtle runs Python on Skulpt, in this page, drawing into a canvas. It is a
   second Python engine on purpose: Skulpt is about a megabyte and is bundled
   here, so turtle lessons start instantly and work with no internet, which
   Pyodide (6-10 MB from a CDN) cannot do.

   p5.js, Processing and Web all run inside a sandboxed iframe. The student's
   code cannot touch Code Lab, its storage or the page around it; console
   output and errors come back by postMessage. Stopping a program is just
   emptying the frame, which is also what makes "Live" re-running safe. */

const V = "?v=6";
const loaded = {};
export function loadScript(src) {
  if (loaded[src]) return loaded[src];
  loaded[src] = new Promise((res, rej) => {
    const s = document.createElement("script");
    s.src = src; s.onload = () => res(true);
    s.onerror = () => { delete loaded[src]; rej(new Error("Could not load " + src)); };
    document.head.appendChild(s);
  });
  return loaded[src];
}

/* ===================== Python turtle, on Skulpt ===================== */

let turtleStop = false;

let turtleLoad = null;
export function turtleReady() {
  /* in order, not in parallel: the standard library bundle extends Sk, so it
     has to run after the engine that defines it */
  if (!turtleLoad) turtleLoad = loadScript("vendor/skulpt.min.js" + V)
    .then(() => loadScript("vendor/skulpt-stdlib.js" + V))
    .catch(e => { turtleLoad = null; throw e; });
  return turtleLoad;
}

/* Skulpt reads its standard library out of a bundle rather than the disk */
function builtinRead(x) {
  const F = window.Sk && Sk.builtinFiles;
  if (!F || F.files[x] === undefined) throw new Error("Python module not found: '" + x + "'");
  return F.files[x];
}

/* turtle.py expects a fixed-size drawing surface; it is cleared on each run */
function resetCanvas(id, w, h) {
  const box = document.getElementById(id); if (!box) return;
  box.innerHTML = "";
  box.style.width = w + "px"; box.style.height = h + "px";
}

/**
 * @param code    the student's Python
 * @param io      { out, err, ask, done } - ask(prompt) returns a promise of a line
 * @param target  id of the div the turtle draws in
 */
export async function runTurtle(code, io, target = "turtlecanvas", size = { w: 560, h: 420 }) {
  await turtleReady();
  turtleStop = false;
  resetCanvas(target, size.w, size.h);

  Sk.configure({
    output: t => io.out(t),
    read: builtinRead,
    __future__: Sk.python3,
    killableWhile: true,
    killableFor: true,
    inputfun: p => io.ask(p == null ? "" : String(p)),
    inputfunTakesPrompt: true,
    execLimit: 30000,          // a runaway loop gives up after 30 seconds
    yieldLimit: 100,
  });
  Sk.TurtleGraphics = Object.assign(Sk.TurtleGraphics || {}, {
    target, width: size.w, height: size.h, animate: true, assets: {},
  });

  try {
    await Sk.misceval.asyncToPromise(() => Sk.importMainWithBody("<stdin>", false, code, true));
    return { ok: true };
  } catch (e) {
    if (turtleStop) return { ok: false, stopped: true };
    return { ok: false, error: skError(e) };
  }
}

export function stopTurtle() {
  turtleStop = true;
  /* every killable loop checks the clock, so moving the deadline into the
     past is what actually stops a running program */
  if (window.Sk) { Sk.execLimit = 1; Sk.execStart = Date.now() - 100000; }
}

/* Skulpt errors carry the line number in .traceback; turn them into the same
   shape the Python and C++ tabs already show. */
function skError(e) {
  const msg = (e && (e.toString ? e.toString() : String(e))) || "Error";
  let line = null;
  try { if (e.traceback && e.traceback.length) line = e.traceback[0].lineno; } catch (x) { }
  if (line == null) { const m = msg.match(/line (\d+)/); if (m) line = +m[1]; }
  return { message: msg.replace(/\s*on line \d+\s*$/, "").trim(), line };
}

/* Plain-English help for the mistakes a student actually makes with turtle. */
export function turtleHint(msg) {
  const H = [
    [/NameError.*'(\w+)'/, m => `Python does not know <b>${m[1]}</b>. Did you spell it the same way everywhere, and did you write <code>import turtle</code> at the top?`],
    [/ImportError|module not found/i, "Only the modules built into Skulpt work on this tab: <b>turtle</b>, <b>math</b>, <b>random</b>, <b>time</b> and a few others. numpy and pandas live on the <b>Python</b> tab."],
    [/ExternalError.*not a function|has no attribute '(\w+)'/, m => `That turtle command does not exist${m && m[1] ? `: <b>${m[1]}</b>` : ""}. Check the spelling, and remember the brackets, for example <code>t.forward(100)</code>.`],
    [/IndentationError/, "The spaces at the start of the line are wrong. Everything inside a loop or a function needs the same indent, usually four spaces."],
    [/SyntaxError/, "Python could not read that line. A missing bracket or colon on the line before is the usual cause."],
    [/TimeoutError|execution time/i, "The program ran for 30 seconds without finishing, so it was stopped. A <code>while</code> loop with no way out is the usual cause."],
    [/TypeError.*argument/, "That command was given the wrong number of values. <code>t.forward(100)</code> takes one, <code>t.goto(0, 0)</code> takes two."],
  ];
  for (const [re, h] of H) { const m = msg.match(re); if (m) return typeof h === "function" ? h(m) : h; }
  return "";
}

/* ===================== p5.js, Processing and Web ===================== */

/* Captures console output and errors inside the frame and sends them out.
   LINE_OFFSET lets a reported line number be turned back into the line the
   student is looking at in the editor. */
const PRELUDE = `
<script>
(function () {
  var fmt = function (v) {
    if (typeof v === "string") return v;
    if (v instanceof Error) return v.message;
    try { return JSON.stringify(v); } catch (e) { return String(v); }
  };
  var send = function (kind, text, line) {
    try { parent.postMessage({ __codelab: 1, kind: kind, text: text, line: line }, "*"); } catch (e) { }
  };
  ["log", "info", "warn", "error"].forEach(function (k) {
    var orig = console[k];
    console[k] = function () {
      send(k === "info" ? "log" : k, Array.prototype.map.call(arguments, fmt).join(" "));
      try { orig.apply(console, arguments); } catch (e) { }
    };
  });
  window.addEventListener("error", function (e) {
    send("error", e.message || "Something went wrong", e.lineno ? e.lineno - OFFSET : null);
  });
  window.addEventListener("unhandledrejection", function (e) { send("error", String(e.reason)); });
  window.addEventListener("load", function () { send("ready"); });
})();
<\/script>`;

const esc = s => String(s).replace(/<\/(script|style)/gi, "<\\/$1");

/* Build the whole document for one run. Returns { html, offset } where offset
   is the number of lines before the student's first line. */
export function buildDoc(kind, payload) {
  const head = `<!doctype html>
<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">`;
  const reset = `<style>html,body{margin:0;padding:0;min-height:100%;background:#fff;font-family:system-ui,-apple-system,"Segoe UI",sans-serif}canvas{display:block}</style>`;

  if (kind === "p5") {
    const pre = `${head}${reset}${PRELUDE}<script src="vendor/p5.min.js${V}"><\/script></head><body><script>\n`;
    return { html: pre + esc(payload.js) + `\n<\/script></body></html>`, offset: countLines(pre) };
  }
  if (kind === "processing") {
    const pre = `${head}${reset}${PRELUDE}<script src="vendor/processing.min.js${V}"><\/script></head><body><canvas id="pjs"></canvas>
<script type="text/processing" data-processing-target="pjs">\n`;
    return { html: pre + esc(payload.pde) + `\n<\/script></body></html>`, offset: countLines(pre) };
  }
  /* Web: the student owns the document. The prelude and their stylesheet go
     into <head> if they wrote one, otherwise in front of everything. */
  let html = payload.html || "";
  const style = payload.css && payload.css.trim() ? `<style>\n${esc(payload.css)}\n</style>` : "";
  const script = payload.js && payload.js.trim() ? `<script>\n${esc(payload.js)}\n<\/script>` : "";
  const inject = PRELUDE + style;
  if (/<head[^>]*>/i.test(html)) html = html.replace(/<head[^>]*>/i, m => m + inject);
  else if (/<html[^>]*>/i.test(html)) html = html.replace(/<html[^>]*>/i, m => m + "<head>" + inject + "</head>");
  else html = inject + html;
  if (script) {
    if (/<\/body>/i.test(html)) html = html.replace(/<\/body>/i, script + "</body>");
    else html += script;
  }
  return { html, offset: 0 };
}

const countLines = s => s.split("\n").length - 1;

let frameEl = null, onMsg = null, lineOffset = 0;

/** Run a program in the frame. `io.log(kind, text, line)` receives output. */
export function runFrame(frame, kind, payload, io) {
  frameEl = frame;
  const { html, offset } = buildDoc(kind, payload);
  lineOffset = offset;
  if (onMsg) window.removeEventListener("message", onMsg);
  onMsg = e => {
    const d = e.data;
    if (!d || d.__codelab !== 1 || e.source !== frame.contentWindow) return;
    if (d.kind === "ready") return io.ready && io.ready();
    io.log(d.kind, d.text, d.line);
  };
  window.addEventListener("message", onMsg);
  frame.srcdoc = html.replace(/OFFSET/g, String(offset));
  return html;
}

export function stopFrame(frame) {
  if (onMsg) { window.removeEventListener("message", onMsg); onMsg = null; }
  if (frame) frame.srcdoc = "<!doctype html><title>Stopped</title>";
}

/** The same document, as a blob URL, for opening in its own tab. */
export function docUrl(kind, payload) {
  const { html, offset } = buildDoc(kind, payload);
  const full = html.replace(/OFFSET/g, String(offset))
    /* a standalone tab needs real paths, not ones relative to Code Lab */
    .replace(/src="vendor\//g, 'src="' + new URL("vendor/", location.href).href);
  return URL.createObjectURL(new Blob([full], { type: "text/html" }));
}

/* Plain-English help for the JavaScript and Processing mistakes students hit. */
export function frameHint(msg, kind) {
  const H = [
    [/(\w+) is not defined/, m => kind === "p5"
      ? `JavaScript does not know <b>${m[1]}</b>. Check the spelling and the capital letters: p5 uses <code>createCanvas</code>, not <code>createcanvas</code>.`
      : `That name does not exist: <b>${m[1]}</b>. Check the spelling, and that you declared it before you used it.`],
    [/is not a function/, "That name exists but it is not a command. A typo in the name, or a variable with the same name as a function, is the usual cause."],
    [/Unexpected (token|end of input|identifier)/, "The browser could not read your code. A missing <code>)</code>, <code>}</code> or <code>;</code> above the reported line is almost always it."],
    [/Cannot read propert(y|ies) of (null|undefined)/, "Something was empty when you used it. If you are reaching for an element on the page, make sure it exists before the script runs."],
    [/createCanvas|p5 was unable/i, "A p5 sketch needs <code>function setup()</code> with <code>createCanvas(width, height)</code> inside it."],
    [/expecting|Syntax error/i, "Processing could not read that line. Check the semicolons and the brackets, and that every variable has a type, for example <code>int x = 10;</code>."],
    [/localStorage|SecurityError/, "Your program runs in a sandbox, so it cannot use storage or cookies. Everything else works normally."],
  ];
  for (const [re, h] of H) { const m = msg.match(re); if (m) return typeof h === "function" ? h(m) : h; }
  return "";
}
