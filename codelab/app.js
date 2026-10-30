/* Code Lab - six languages for the Robotics & AI Club.

   Text output: Python (Pyodide, in the browser) and C++ (g++ on an online
   compiler). Picture output: Python turtle (Skulpt, bundled and offline),
   p5.js, Processing and a web page - those three run inside a sandboxed
   frame. The editor, toolbar, examples, saving and font size are shared. */
import { EXAMPLES } from "./examples.js?v=6";
import { runTurtle, stopTurtle, turtleHint, turtleReady, runFrame, stopFrame, docUrl, frameHint } from "./visual.js?v=6";

const $ = s => document.querySelector(s);
const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const store = { get(k) { try { return JSON.parse(localStorage.getItem(k)); } catch (e) { return null; } }, set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { } } };
const KEY = "codelab.v1";
const LANGS = {
  python: { name: "Python", file: "main.py", mode: "python", start: `# Write Python here, then press Run (Ctrl+Enter)
name = input("What is your name? ")
print("Hello,", name)
` },
  cpp: { name: "C++", file: "main.cpp", mode: "text/x-c++src", start: `#include <iostream>
using namespace std;

int main() {
    // Write C++ here, then press Run (Ctrl+Enter)
    cout << "Hello from C++!" << endl;
    return 0;
}
` },
  turtle: {
    name: "Turtle", badge: "tu", file: "drawing.py", mode: "python", kind: "canvas",
    start: `# Turtle graphics. Press Run (Ctrl+Enter) and watch it draw.
import turtle

t = turtle.Turtle()
t.shape("turtle")
t.speed(6)

for side in range(4):
    t.forward(120)
    t.right(90)

turtle.done()
` },
  p5: {
    name: "p5.js", badge: "p5", file: "sketch.js", mode: "javascript", kind: "frame",
    start: `// p5.js. setup() runs once, draw() runs about 60 times a second.
function setup() {
  createCanvas(400, 400);
}

function draw() {
  background(20, 24, 40);
  noStroke();
  fill(46, 107, 230);
  circle(mouseX, mouseY, 60);
}
` },
  processing: {
    name: "Processing", badge: "pr", file: "sketch.pde", mode: "text/x-java", kind: "frame",
    start: `// Processing. Same ideas as p5.js, written in the Java style:
// every variable says what type it is.
void setup() {
  size(400, 400);
}

void draw() {
  background(20, 24, 40);
  noStroke();
  fill(0, 150, 216);
  ellipse(mouseX, mouseY, 60, 60);
}
` },
  web: {
    name: "Web", badge: "web", file: "index.html", mode: "htmlmixed", kind: "frame", web: true,
    files: { html: { name: "index.html", mode: "htmlmixed" }, css: { name: "style.css", mode: "css" }, js: { name: "script.js", mode: "javascript" } },
    start: {
      html: `<!doctype html>
<html>
<head>
  <meta charset="utf-8">
  <title>My page</title>
</head>
<body>
  <h1>Hello!</h1>
  <p>Edit the HTML, the CSS and the JavaScript, then press Run.</p>
  <button id="go">Click me</button>
  <p id="out"></p>
</body>
</html>
`,
      css: `body {
  font-family: system-ui, sans-serif;
  margin: 24px;
  color: #13213C;
}

h1 { color: #2E6BE6; }

button {
  background: #2E6BE6;
  color: #fff;
  border: 0;
  border-radius: 8px;
  padding: 10px 16px;
  font-size: 15px;
}
`,
      js: `let clicks = 0;

document.getElementById("go").addEventListener("click", () => {
  clicks = clicks + 1;
  document.getElementById("out").textContent = "You clicked " + clicks + " times.";
  console.log("click", clicks);
});
`,
    } },
};
const isWeb = l => !!LANGS[l].web;
const kindOf = l => LANGS[l].kind || "term";
const saved = store.get(KEY) || {};
const S = { lang: saved.lang || "python", code: saved.code || {}, stdin: saved.stdin || {}, fs: saved.fs || 15, iow: saved.iow || null, webfile: saved.webfile || "html", live: saved.live || {} };
/* the Web tab is three files, so its slot in S.code is an object */
if (typeof S.code.web !== "object" || S.code.web === null) S.code.web = {};
const webStart = k => LANGS.web.start[k];
const webCode = k => S.code.web[k] ?? webStart(k);
const startOf = l => isWeb(l) ? webCode(S.webfile) : (S.code[l] ?? LANGS[l].start);
const fromHash = location.hash.slice(1);
if (LANGS[fromHash]) S.lang = fromHash;

/* ---------- editor ---------- */
const editor = CodeMirror($("#editor"), {
  /* the Web tab keeps three files in S.code.web, so it must never be handed
     to CodeMirror as a value: reloading on that tab used to build the editor
     from an object and throw */
  value: startOf(S.lang), mode: (isWeb(S.lang) ? LANGS.web.files[S.webfile].mode : LANGS[S.lang].mode), theme: "cl", lineNumbers: true, indentUnit: 4, tabSize: 4,
  matchBrackets: true, autoCloseBrackets: true, styleActiveLine: true, viewportMargin: 30,
  extraKeys: { "Ctrl-Enter": () => run(), "Cmd-Enter": () => run(), "Tab": cm => cm.somethingSelected() ? cm.indentSelection("add") : cm.replaceSelection("    "), "Shift-Tab": cm => cm.indentSelection("subtract"), "Ctrl-/": "toggleComment", "Cmd-/": "toggleComment" },
});
let errMark = null;
const clearErr = () => { if (errMark != null) { editor.removeLineClass(errMark, "background", "errline"); editor.removeLineClass(errMark, "gutter", "errline-g"); errMark = null; } };
const markErr = n => { clearErr(); if (!n || n < 1 || n > editor.lineCount()) return; errMark = n - 1; editor.addLineClass(errMark, "background", "errline"); editor.addLineClass(errMark, "gutter", "errline-g"); editor.scrollIntoView({ line: errMark, ch: 0 }, 120); };
editor.on("change", () => { clearErr(); clearTimeout(editor._t); editor._t = setTimeout(save, 300); });
function save() {
  if (isWeb(S.lang)) S.code.web[S.webfile] = editor.getValue();
  else S.code[S.lang] = editor.getValue();
  S.stdin[S.lang] = $("#stdin").value; store.set(KEY, S);
}
const applyFont = () => { document.documentElement.style.setProperty("--fs", S.fs + "px"); editor.refresh(); };
applyFont();
if (S.iow) document.documentElement.style.setProperty("--iow", S.iow + "px");

/* ---------- terminal ---------- */
const term = $("#term");
let atBottom = true;
term.addEventListener("scroll", () => { atBottom = term.scrollHeight - term.scrollTop - term.clientHeight < 30; });
function out(text, cls = "") {
  const last = term.lastElementChild;
  if (last && last.tagName === "SPAN" && last.className === cls && !last.classList.contains("inrow")) last.textContent += text;
  else { const s = document.createElement("span"); if (cls) s.className = cls; s.textContent = text; term.appendChild(s); }
  if (atBottom) term.scrollTop = term.scrollHeight;
}
function outHTML(html) { const d = document.createElement("div"); d.innerHTML = html; while (d.firstChild) term.appendChild(d.firstChild); term.scrollTop = term.scrollHeight; }
function clearTerm() { term.innerHTML = ""; }
const EMPTY = {
  turtle: `<div class="empty"><b>Press Run</b> (or <kbd>Ctrl</kbd>+<kbd>Enter</kbd>) and the turtle draws above.<br><code>import turtle</code>, then <code>t = turtle.Turtle()</code> and commands like <code>t.forward(100)</code> and <code>t.right(90)</code>.<br>Anything you <code>print()</code> shows up here. Works with no internet.</div>`,
  p5: `<div class="empty"><b>Press Run</b> (or <kbd>Ctrl</kbd>+<kbd>Enter</kbd>) to draw the sketch above.<br><code>setup()</code> runs once, <code>draw()</code> runs about 60 times a second.<br>Anything you <code>console.log()</code> shows up here. Works with no internet.</div>`,
  processing: `<div class="empty"><b>Press Run</b> (or <kbd>Ctrl</kbd>+<kbd>Enter</kbd>) to draw the sketch above.<br>This is Processing's Java style: <code>void setup()</code>, <code>size(400, 400)</code>, and a type on every variable.<br>For new work the <b>p5.js</b> tab is the one that is still maintained.</div>`,
  web: `<div class="empty"><b>Press Run</b> (or <kbd>Ctrl</kbd>+<kbd>Enter</kbd>) to see your page above.<br>Three files make one page: <b>index.html</b> is the content, <b>style.css</b> is how it looks, <b>script.js</b> makes it do things.<br>Turn on <b>Live</b> and it updates as you type. <code>console.log()</code> shows up here.</div>`,
};
function emptyTerm() {
  if (EMPTY[S.lang]) { term.innerHTML = EMPTY[S.lang]; return; }
  term.innerHTML = S.lang === "python"
    ? `<div class="empty"><b>Press Run</b> (or <kbd>Ctrl</kbd>+<kbd>Enter</kbd>) to run your Python program. Output appears here.<br>When the program asks for input, type your answer here and press <kbd>Enter</kbd>.<br>numpy, pandas and matplotlib work: plots show up right here.</div>`
    : `<div class="empty"><b>Press Run</b> (or <kbd>Ctrl</kbd>+<kbd>Enter</kbd>) to compile and run your C++ program with g++.<br>If it reads input with <code>cin</code>, type the input in the <b>Input</b> box below first.<br>Needs an internet connection.</div>`;
}
const state = (t, cls = "") => { const r = $("#runstate"); r.textContent = t; r.className = "runstate " + cls; };
const engine = (t, cls = "") => { const e = $("#engine"); e.innerHTML = `<i></i>${esc(t)}`; e.className = "engine " + cls; };
/* the Python worker keeps reporting after the student has switched tabs */
const pyEngine = (t, cls = "") => { if (S.lang === "python") engine(t, cls); };
function toast(m) { const t = $("#toast"); t.innerHTML = m; t.classList.add("on"); clearTimeout(toast._t); toast._t = setTimeout(() => t.classList.remove("on"), 2400); }

/* ---------- Python ---------- */
const PY = { worker: null, ready: false, sab: null, irq: null, ctl: null, data: null, running: false, waiting: null };
const canWait = () => typeof SharedArrayBuffer !== "undefined" && self.crossOriginIsolated;
function startPython() {
  if (PY.worker) return;
  PY.ready = false; pyEngine("Python loading…");
  PY.worker = new Worker("py-worker.js?v=1");
  if (canWait()) { PY.sab = new SharedArrayBuffer(8 + 65536); PY.ctl = new Int32Array(PY.sab, 0, 2); PY.data = new Uint8Array(PY.sab, 8); PY.irq = new SharedArrayBuffer(1); }
  PY.worker.onmessage = e => onPy(e.data);
  PY.worker.onerror = e => { pyEngine("Python failed to load", "bad"); out("\nPython could not start: " + (e.message || "unknown error") + "\n", "bad"); };
  PY.worker.postMessage({ type: "init", sab: PY.sab, irq: PY.irq });
}
function onPy(m) {
  if (m.type === "status") { if (!PY.ready) pyEngine(m.text); else if (S.lang === "python") state(m.text, "busy"); }
  if (m.type === "ready") { PY.ready = true; pyEngine(`Python ${m.python}`, "ok"); if (PY.pending) { const p = PY.pending; PY.pending = null; runPython(p); } }
  if (m.type === "fatal") { pyEngine("Python unavailable", "bad"); out(m.text + "\n", "bad"); setRunning(false); }
  if (m.type === "out") out(m.text);
  if (m.type === "err") out(m.text, "err");
  if (m.type === "echo") out(m.text, "echo");
  if (m.type === "image") outHTML(`<img alt="plot" src="${m.src}">`);
  if (m.type === "input") askLine();
  if (m.type === "needinput") outHTML(`<span class="hintbox"><b>This program is waiting for input.</b> Type the answers in the <b>Input</b> box below (one per line), then press Run again.</span>`);
  if (m.type === "done") {
    setRunning(false); removeAsk();
    if (m.ok) { out(`\n`, ""); out(`Finished in ${fmtMs(m.ms)}\n`, "sys"); state("Finished", "ok"); }
    else if (/KeyboardInterrupt/.test(m.error)) { out("\nStopped.\n", "sys"); state("Stopped"); }
    else { out("\n" + m.error + "\n", "err"); const h = pyHint(m.error); if (h) outHTML(`<span class="hintbox">${h}</span>`); if (m.line) markErr(m.line); state(m.line ? `Error on line ${m.line}` : "Error", "bad"); }
  }
}
const fmtMs = ms => ms < 1000 ? ms + " ms" : (ms / 1000).toFixed(1) + " s";
function askLine() {
  removeAsk();
  const row = document.createElement("span"); row.className = "inrow";
  row.innerHTML = `<input aria-label="The program is waiting: type your answer and press Enter" autocomplete="off" spellcheck="false"><span class="inhint" aria-hidden="true">type, then ⏎ Enter</span>`;
  term.appendChild(row); term.scrollTop = term.scrollHeight;
  const inp = row.querySelector("input"); inp.focus();
  state("Waiting for your input…", "busy");
  inp.addEventListener("keydown", e => {
    if (e.key !== "Enter") return;
    const text = inp.value, bytes = new TextEncoder().encode(text).slice(0, 65000);
    row.remove(); out(text + "\n", "echo");
    PY.data.set(bytes); Atomics.store(PY.ctl, 1, bytes.length); Atomics.store(PY.ctl, 0, 1); Atomics.notify(PY.ctl, 0);
    state("Running…", "busy");
  });
}
function removeAsk() { term.querySelectorAll(".inrow").forEach(r => r.remove()); }
function runPython(code) {
  if (!PY.ready) { PY.pending = code; startPython(); state("Starting Python…", "busy"); return; }
  if (PY.irq) new Uint8Array(PY.irq)[0] = 0;
  PY.worker.postMessage({ type: "run", code, stdin: $("#stdin").value });
}
function stopPython() {
  if (PY.ctl) { new Uint8Array(PY.irq)[0] = 2; Atomics.store(PY.ctl, 0, 2); Atomics.notify(PY.ctl, 0); setTimeout(() => { if (PY.running) hardStop(); }, 1200); }
  else hardStop();
}
function hardStop() { PY.worker.terminate(); PY.worker = null; PY.ready = false; setRunning(false); removeAsk(); out("\nStopped.\n", "sys"); state("Stopped"); startPython(); }
function pyHint(err) {
  const last = err.trim().split("\n").pop();
  const H = [
    [/IndentationError|TabError/, "Python uses spaces at the start of a line to group code. Check that lines inside <b>if</b>, <b>for</b>, <b>while</b> and <b>def</b> are pushed in by 4 spaces, and lines after them line up again."],
    [/SyntaxError: .*(was never closed|unexpected EOF|'\(' was never closed)/, "A bracket or quote is opened but never closed. Count your <b>( )</b>, <b>[ ]</b> and quotes."],
    [/SyntaxError: expected ':'/, "Lines that start <b>if</b>, <b>elif</b>, <b>else</b>, <b>for</b>, <b>while</b> and <b>def</b> must end with a colon <b>:</b>"],
    [/SyntaxError/, "Python can't read this line. Look for a missing colon, bracket or quote, or a misspelled word."],
    [/NameError: name '(.+?)' is not defined/, m => `Python doesn't know <b>${esc(m[1])}</b>. Check the spelling (capitals matter) and that you created it before using it. Text needs quotes: <b>"${esc(m[1])}"</b>.`],
    [/ValueError: invalid literal for int\(\)/, "<b>int()</b> got something that isn't a whole number. Type digits only, or use <b>float()</b> for decimals."],
    [/ValueError: could not convert string to float/, "<b>float()</b> got something that isn't a number."],
    [/ZeroDivisionError/, "The program divided by zero. Check the number before you divide."],
    [/TypeError: can only concatenate str/, "You can't join text and a number with <b>+</b>. Use <b>str(number)</b>, or a comma in print(), or an f-string: <b>f\"Score: {score}\"</b>."],
    [/TypeError: '(<|>|<=|>=)' not supported between instances of 'str' and 'int'/, "You compared text with a number. Wrap input() in <b>int()</b> to turn the answer into a number."],
    [/IndexError/, "The list doesn't have that position. Lists start at 0, so the last item of a list of 5 is at index 4."],
    [/KeyError: (.+)/, m => `The dictionary has no key ${esc(m[1])}. Check the spelling or use <b>.get()</b>.`],
    [/ModuleNotFoundError: No module named '(.+?)'/, m => `The module <b>${esc(m[1])}</b> isn't available in the browser. numpy, pandas, matplotlib, scipy and scikit-learn are.`],
    [/EOFError/, "The program asked for more input than it got. Add more lines to the Input box, or empty it so you can type while it runs."],
    [/RecursionError/, "A function keeps calling itself without stopping. Check the stopping case."],
  ];
  for (const [re, h] of H) { const m = last.match(re) || err.match(re); if (m) return typeof h === "function" ? h(m) : h; }
  return "";
}

/* ---------- C++ (Wandbox, with Compiler Explorer as a backup) ---------- */
let cppAbort = null;
async function runCpp(code) {
  const stdin = $("#stdin").value;
  state("Compiling with g++…", "busy");
  out("Compiling…\n", "sys");
  cppAbort = new AbortController(); const tm = setTimeout(() => cppAbort.abort(), 45000); const t0 = performance.now();
  let r = null;
  try { r = await wandbox(code, stdin, cppAbort.signal); }
  catch (e) { if (e.name === "AbortError") { finishCpp(); out("Stopped.\n", "sys"); state("Stopped"); return; } try { r = await godbolt(code, stdin, cppAbort.signal); } catch (e2) { r = null; } }
  clearTimeout(tm); finishCpp();
  term.lastElementChild && term.lastElementChild.textContent === "Compiling…\n" && term.lastElementChild.remove();
  if (!r) { out("Could not reach the online compiler. Check the internet connection and try again.\n", "bad"); state("No connection", "bad"); return; }
  if (r.compileError) {
    out(cleanGcc(r.compileError) + "\n", "err");
    const line = (r.compileError.match(/(?:prog\.cc|example\.cpp|main\.cpp|<source>):(\d+):\d+: error/) || [])[1];
    const h = cppHint(r.compileError); if (h) outHTML(`<span class="hintbox">${h}</span>`);
    if (line) markErr(+line); state(line ? `Error on line ${line}` : "Compile error", "bad"); return;
  }
  if (r.warnings) out(cleanGcc(r.warnings) + "\n", "sys");
  if (r.stdout) out(r.stdout);
  if (r.stderr) out(r.stderr, "err");
  const ms = Math.round(performance.now() - t0);
  if (r.signal) { out(`\nProgram crashed (${r.signal}). ${/SIGSEGV|Segmentation/.test(r.signal) ? "It used memory it shouldn't: check array indexes." : /SIGKILL|Killed/.test(r.signal) ? "It ran too long: check for a loop that never ends." : ""}\n`, "bad"); state("Crashed", "bad"); return; }
  if (r.status && r.status !== "0") { out(`\nProgram ended with code ${r.status}\n`, "sys"); state("Finished (code " + r.status + ")"); }
  else { if (r.stdout && !r.stdout.endsWith("\n")) out("\n"); out(`Finished in ${fmtMs(ms)} (g++ ${r.via})\n`, "sys"); state("Finished", "ok"); }
  if (!stdin.trim() && needsInput(code) && !r.stdout) outHTML(`<span class="hintbox"><b>Did it need input?</b> Type it in the <b>Input</b> box below, then run again.</span>`);
}
function finishCpp() { cppAbort = null; setRunning(false); }
async function wandbox(code, stdin, signal) {
  const res = await fetch("https://wandbox.org/api/compile.json", { method: "POST", signal, headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ code, stdin, compiler: "gcc-13.2.0", "compiler-option-raw": "-std=gnu++17\n-O2\n-Wall", save: false }) });
  if (!res.ok) throw new Error("wandbox " + res.status);
  const j = await res.json();
  const err = j.compiler_error || "", isErr = / error[: ]/.test(err) && !j.program_output && j.status !== "0";
  return { via: "13.2", compileError: isErr ? err : "", warnings: isErr ? "" : err, stdout: j.program_output || "", stderr: j.program_error || "", status: j.status, signal: j.signal || "" };
}
async function godbolt(code, stdin, signal) {
  const res = await fetch("https://godbolt.org/api/compiler/g132/compile", { method: "POST", signal, headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({ source: code, options: { userArguments: "-std=gnu++17 -O2 -Wall", executeParameters: { stdin }, compilerOptions: { executorRequest: true }, filters: { execute: true } } }) });
  if (!res.ok) throw new Error("godbolt " + res.status);
  const j = await res.json(), b = j.buildResult || {}, txt = a => (a || []).map(x => x.text).join("\n").replace(/\x1b\[[0-9;]*m/g, "");
  if (b.code) return { via: "13.2", compileError: txt(b.stderr) };
  return { via: "13.2", warnings: txt(b.stderr), stdout: txt(j.stdout) + (j.stdout && j.stdout.length ? "\n" : ""), stderr: txt(j.stderr), status: String(j.code ?? 0), signal: j.timedOut ? "SIGKILL" : "" };
}
const cleanGcc = s => s.replace(/\x1b\[[0-9;]*m/g, "").replace(/(prog\.cc|example\.cpp|<source>)/g, "main.cpp").replace(/\n{3,}/g, "\n\n").trim();
const needsInput = code => /\bcin\s*>>|scanf\s*\(|getline\s*\(/.test(code);
function cppHint(e) {
  const H = [
    [/expected [^\n]*';'/, "A line is missing a semicolon <b>;</b> at the end. Look at the end of the line just above the one marked."],
    [/'(cout|cin|endl|string|vector)' was not declared|did you mean 'std::/, "Add <b>using namespace std;</b> under the #include lines, or write <b>std::cout</b>."],
    [/'(.+?)' was not declared in this scope/, m => `C++ doesn't know <b>${esc(m[1])}</b>. Check the spelling, declare the variable first (for example <b>int ${esc(m[1])};</b>), or add the missing <b>#include</b>.`],
    [/expected '\}' at end of input/, "A <b>{</b> is never closed. Count your curly brackets."],
    [/expected primary-expression/, "Something is missing in this expression, often a value next to an operator or a bracket."],
    [/invalid conversion|cannot convert/, "The value has the wrong type for where it's used, for example text where a number is expected."],
    [/no match for 'operator/, "That operator doesn't work with these types. Check what you're adding, comparing or printing."],
    [/redeclaration|conflicting declaration/, "This name is declared twice. Remove the second <b>int</b>/<b>string</b> in front of it."],
  ];
  for (const [re, h] of H) { const m = e.match(re); if (m) return typeof h === "function" ? h(m) : h; }
  return "";
}

/* ===================== the stage =====================
   Turtle draws into a div in this page; p5, Processing and Web run inside the
   sandboxed frame. Only one of the two is ever showing. */
const stage = $("#stage"), frame = $("#frame"), turtleWrap = $("#turtlewrap");
function showStage(which) {        /* "turtle" | "frame" | null */
  document.body.classList.toggle("hasstage", !!which);
  stage.hidden = !which;
  turtleWrap.hidden = which !== "turtle";
  frame.hidden = which !== "frame";
  $("#popout").hidden = which !== "frame";
  $("#autorun").hidden = which !== "frame";
}
function stageNote(text) {
  const old = stage.querySelector(".stagenote"); if (old) old.remove();
  if (!text) return;
  const n = document.createElement("div"); n.className = "stagenote"; n.textContent = text;
  stage.appendChild(n);
}

/* ---------- Python turtle, on Skulpt ---------- */
let turtleBusy = false;
function askTurtle(prompt) {
  if (prompt) out(prompt);
  /* lines typed into the Input box are used first, exactly like the Python tab */
  const pending = ($("#stdin").value || "").split("\n").filter(x => x !== "");
  if (askTurtle.i == null) askTurtle.i = 0;
  if (askTurtle.i < pending.length) { const v = pending[askTurtle.i++]; out(v + "\n", "echo"); return Promise.resolve(v); }
  return new Promise(res => {
    removeAsk();
    const row = document.createElement("span"); row.className = "inrow";
    row.innerHTML = `<input aria-label="The program is waiting: type your answer and press Enter" autocomplete="off" spellcheck="false"><span class="inhint" aria-hidden="true">type, then ⏎ Enter</span>`;
    term.appendChild(row); term.scrollTop = term.scrollHeight;
    const inp = row.querySelector("input"); inp.focus();
    state("Waiting for your input…", "busy");
    inp.addEventListener("keydown", e => {
      if (e.key !== "Enter") return;
      const v = inp.value; row.remove(); out(v + "\n", "echo"); state("Running…", "busy"); res(v);
    });
  });
}
async function runTurtleTab(code) {
  turtleBusy = true; askTurtle.i = 0; stageNote("");
  engine("Turtle · offline", "ok");
  const r = await runTurtle(code, { out: t => out(t), ask: askTurtle }, "turtlecanvas", turtleSize());
  turtleBusy = false; setRunning(false); removeAsk();
  if (r.ok) { state("Finished", "ok"); return; }
  if (r.stopped) { out("\nStopped.\n", "sys"); state("Stopped"); stageNote("Stopped"); return; }
  const e = r.error;
  out("\n" + e.message + "\n", "bad");
  if (e.line) { markErr(e.line); out(`Line ${e.line}\n`, "err"); }
  const h = turtleHint(e.message); if (h) outHTML(`<span class="hintbox">${h}</span>`);
  state("Error", "bad");
}
/* the drawing surface is sized to the pane, so it is not a postage stamp on a
   projector or cut off on a laptop */
function turtleSize() {
  const r = stage.getBoundingClientRect();
  const w = Math.max(320, Math.min(900, Math.round(r.width - 24) || 560));
  const h = Math.max(240, Math.min(700, Math.round(r.height - 24) || 420));
  return { w, h };
}

/* ---------- p5.js, Processing and the web page ---------- */
const framePayload = () => {
  if (S.lang === "p5") return { js: editor.getValue() };
  if (S.lang === "processing") return { pde: editor.getValue() };
  save();
  return { html: webCode("html"), css: webCode("css"), js: webCode("js") };
};
function runFrameTab() {
  stageNote("");
  engine(S.lang === "p5" ? "p5.js · offline" : S.lang === "processing" ? "Processing.js · offline" : "Your browser", "ok");
  runFrame(frame, S.lang, framePayload(), {
    ready: () => { setRunning(false); state("Running", "ok"); },
    log: (kind, text, line) => {
      if (kind === "error") {
        out(text + (line ? `  (line ${line})` : "") + "\n", "bad");
        if (line) markErr(line);
        const h = frameHint(text, S.lang); if (h) outHTML(`<span class="hintbox">${h}</span>`);
        state("Error", "bad");
      } else out(text + "\n", kind === "warn" ? "err" : "");
    },
  });
}

/* "Live": re-run as the student types. Only for the frame languages, where a
   run is just replacing the frame's contents. */
let liveT = null;
function liveTick() {
  if (!S.live[S.lang] || kindOf(S.lang) !== "frame") return;
  clearTimeout(liveT);
  liveT = setTimeout(() => { if (!running) { clearTerm(); clearErr(); runFrameTab(); } }, 700);
}
function toggleLive() {
  S.live[S.lang] = !S.live[S.lang]; save();
  $("#autorun").setAttribute("aria-pressed", S.live[S.lang] ? "true" : "false");
  toast(S.live[S.lang] ? "Live: the result updates as you type" : "Live off");
  if (S.live[S.lang]) liveTick();
}
function popout() {
  const url = docUrl(S.lang, framePayload());
  window.open(url, "_blank", "noopener");
  setTimeout(() => URL.revokeObjectURL(url), 20000);
}

/* ---------- run / stop ---------- */
let running = false, needAsked = false;
function setRunning(on) {
  running = on; PY.running = on && S.lang === "python";
  if (on) stageNote("");
  const b = $("#runbtn"); b.classList.toggle("stop", on);
  b.innerHTML = on ? `<svg class="ic" viewBox="0 0 24 24"><rect x="6" y="6" width="12" height="12" rx="2"/></svg><span>Stop</span><kbd>Esc</kbd>` : `<svg class="ic" viewBox="0 0 24 24"><path d="M7 5l12 7-12 7z"/></svg><span>Run</span><kbd>Ctrl ⏎</kbd>`;
  b.title = on ? "Stop (Esc)" : "Run (Ctrl+Enter)";
}
function run() {
  if (running) return stop();
  save(); clearErr(); clearTerm();
  const code = editor.getValue();
  if (S.lang === "cpp" && needsInput(code) && !$("#stdin").value.trim() && !needAsked) {
    needAsked = true;
    outHTML(`<span class="hintbox"><b>This program reads input with cin.</b> Type the input in the <b>Input</b> box below (for example the numbers it asks for), then press Run. Press Run again to run it without input.</span>`);
    $("#stdin").focus(); state("Waiting for input", "busy"); return;
  }
  needAsked = false;
  /* a small header so one run's output is easy to tell from the next */
  outHTML(`<span class="runhead">▶ ${esc(LANGS[S.lang].name)} · ${new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })}</span>`);
  setRunning(true); state("Running…", "busy");
  if (S.lang === "python") runPython(code);
  else if (S.lang === "cpp") runCpp(code);
  else if (S.lang === "turtle") runTurtleTab(code);
  else runFrameTab();
}
function stop() {
  if (S.lang === "python") stopPython();
  else if (S.lang === "cpp") { if (cppAbort) cppAbort.abort(); }
  else if (S.lang === "turtle") { stopTurtle(); }
  else { stopFrame(frame); setRunning(false); state("Stopped"); stageNote("Stopped"); out("\nStopped.\n", "sys"); }
}

/* ---------- language switch ---------- */
function setLang(l) {
  if (running) stop();
  save(); S.lang = l; store.set(KEY, S);
  document.querySelectorAll(".langs button").forEach(b => {
    const on = b.dataset.lang === l;
    b.classList.toggle("on", on); b.setAttribute("aria-selected", on ? "true" : "false");
  });
  const k = kindOf(l);
  /* the Web tab edits three files; everything else edits one */
  $("#webfiles").hidden = !isWeb(l);
  if (isWeb(l)) setWebFile(S.webfile, true);
  else { editor.setOption("mode", LANGS[l].mode); editor.setValue(S.code[l] ?? LANGS[l].start); $("#fname").value = LANGS[l].file; }
  editor.clearHistory();
  $("#stdin").value = S.stdin[l] || "";
  $("#stdinhelp").textContent = l === "python"
    ? "Optional. Lines typed here are read first by input(). Leave it empty to type answers while the program runs."
    : l === "turtle" ? "Optional. Lines typed here are read first by input()."
    : "Type everything the program reads with cin before you press Run, one value or line at a time.";

  /* leaving the Turtle tab clears its canvases: they are large, and leaving
     them in the page made the next tab look like it had already drawn */
  if (k !== "canvas") { const tc = document.getElementById("turtlecanvas"); if (tc) tc.innerHTML = ""; }
  showStage(k === "canvas" ? "turtle" : k === "frame" ? "frame" : null);
  if (k === "frame") { stopFrame(frame); $("#autorun").setAttribute("aria-pressed", S.live[l] ? "true" : "false"); }
  stageNote(k === "term" ? "" : "Press Run to see it here");
  emptyTerm(); state(""); clearErr();

  if (l === "python") { startPython(); if (PY.ready) engine("Python ready", "ok"); }
  else if (l === "cpp") engine("g++ 13 · online", "ok");
  else if (l === "turtle") { engine("Turtle · offline", ""); turtleReady().then(() => engine("Turtle ready · offline", "ok")).catch(() => engine("Turtle failed to load", "bad")); }
  else if (l === "p5") engine("p5.js · offline", "ok");
  else if (l === "processing") engine("Processing.js · offline", "ok");
  else engine("Your browser", "ok");
  history.replaceState(null, "", "#" + l);
}

/* ---------- the three files of a web page ---------- */
function setWebFile(k, force) {
  if (!LANGS.web.files[k]) k = "html";
  if (!force && S.webfile === k) return;
  if (!force) S.code.web[S.webfile] = editor.getValue();
  S.webfile = k; store.set(KEY, S);
  document.querySelectorAll("#webfiles button").forEach(b => {
    const on = b.dataset.file === k;
    b.classList.toggle("on", on); b.setAttribute("aria-selected", on ? "true" : "false");
  });
  editor.setOption("mode", LANGS.web.files[k].mode);
  editor.setValue(webCode(k));
  $("#fname").value = LANGS.web.files[k].name;
  clearErr();
}

/* ---------- examples ---------- */
/* a web example is three files, so its card previews the HTML */
const exSource = x => x.code != null ? x.code : (x.html || x.js || x.css || "");
const exPreview = x => exSource(x).split("\n")
  .filter(l => l.trim() && !/^#include|^using|^<!doctype/i.test(l.trim()))
  .slice(0, 2).join("\n");
const exUsesInput = x => !!x.input || /input\(|cin\s*>>/.test(exSource(x));
function showExamples() {
  const list = EXAMPLES[S.lang], cats = [...new Set(list.map(x => x.cat))];
  if (!list || !list.length) { toast("No examples for this tab yet."); return; }
  const bd = LANGS[S.lang].badge || (S.lang === "python" ? "py" : "cpp");
  const bl = { py: "Py", cpp: "C++", tu: "Tu", p5: "p5", pr: "Pr", web: "&lt;&gt;" }[bd] || bd;
  $("#mbox").innerHTML = `<div class="mh"><span class="lg ${bd}">${bl}</span><h2>${LANGS[S.lang].name} examples</h2><div class="grow"></div><button class="mx" data-act="close" title="Close"><svg class="ic" viewBox="0 0 24 24"><path d="M6 6l12 12M18 6L6 18"/></svg></button></div>
    <div class="mb"><label class="exsearch"><svg class="ic" viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"/><path d="M20 20l-4-4"/></svg><input id="exq" placeholder="Search examples" aria-label="Search examples" autocomplete="off"></label>${cats.map(c => `<div class="excat">${esc(c)}</div><div class="exgrid">${list.map((x, i) => x.cat !== c ? "" : `<button class="excard" data-ex="${i}"><b>${esc(x.title)}</b><code>${esc(exPreview(x))}</code>${exUsesInput(x) ? `<em>uses input</em>` : ""}</button>`).join("")}</div>`).join("")}</div>`;
  $("#modal").classList.add("on");
  /* filter the cards as the student types; a topic with no hits hides too */
  const q = $("#exq"); q.focus();
  q.addEventListener("input", () => {
    const v = q.value.trim().toLowerCase();
    document.querySelectorAll("#mbox .excard").forEach(b => { const x = list[+b.dataset.ex]; b.hidden = !!v && !(x.title + " " + x.cat + " " + exSource(x)).toLowerCase().includes(v); });
    document.querySelectorAll("#mbox .exgrid").forEach(g => { const hide = ![...g.children].some(c => !c.hidden); g.hidden = hide; g.previousElementSibling.hidden = hide; });
  });
}
function loadExample(i) {
  const x = EXAMPLES[S.lang][i]; if (!x) return;
  if (isWeb(S.lang)) {
    /* a web example is three files at once */
    S.code.web = { html: x.html ?? webStart("html"), css: x.css ?? webStart("css"), js: x.js ?? webStart("js") };
    setWebFile("html", true);
  } else editor.setValue(x.code);
  $("#stdin").value = x.input || ""; save(); closeModal(); emptyTerm(); state(""); clearErr();
  if (kindOf(S.lang) !== "term") stageNote("Press Run to see it here");
  toast(`Opened <b>${esc(x.title)}</b>. Press Run.`); editor.focus();
}
const closeModal = () => $("#modal").classList.remove("on");

/* ---------- files ---------- */
function saveBlob(text, name, type = "text/plain") {
  const a = document.createElement("a");
  a.href = URL.createObjectURL(new Blob([text], { type })); a.download = name; a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
}
function download() {
  save();
  if (isWeb(S.lang)) {
    /* one file that opens anywhere beats three the student has to keep together */
    const { html } = buildWebFile();
    saveBlob(html, ($("#fname").value || "page").replace(/\.(css|js)$/, ".html").replace(/^(?!.*\.html?$).*$/, "page.html"), "text/html");
    toast("Saved as one .html file, with the CSS and JavaScript inside it.");
    return;
  }
  saveBlob(editor.getValue(), ($("#fname").value || LANGS[S.lang].file).trim());
}
/* the three files, flattened into one document that works on its own */
function buildWebFile() {
  const css = webCode("css"), js = webCode("js");
  let html = webCode("html");
  const head = `<style>\n${css}\n</style>`;
  const tail = `<script>\n${js}\n<\/script>`;
  if (/<\/head>/i.test(html)) html = html.replace(/<\/head>/i, head + "</head>");
  else html = head + html;
  if (/<\/body>/i.test(html)) html = html.replace(/<\/body>/i, tail + "</body>");
  else html += tail;
  return { html };
}
$("#fileup").addEventListener("change", e => {
  const f = e.target.files[0]; if (!f) return;
  const n = f.name;
  const l = /\.py$/i.test(n) ? (S.lang === "turtle" ? "turtle" : "python")
    : /\.(cpp|cc|c|h)$/i.test(n) ? "cpp"
    : /\.pde$/i.test(n) ? "processing"
    : /\.js$/i.test(n) ? (S.lang === "web" ? "web" : "p5")
    : /\.(html?|css)$/i.test(n) ? "web" : S.lang;
  f.text().then(t => {
    if (l !== S.lang) setLang(l);
    if (isWeb(l)) {
      const k = /\.css$/i.test(n) ? "css" : /\.js$/i.test(n) ? "js" : "html";
      S.code.web[k] = t; setWebFile(k, true);
    } else { editor.setValue(t); $("#fname").value = n; }
    save(); toast(`Opened <b>${esc(n)}</b>`);
  });
  e.target.value = "";
});
function tidy() {
  if (S.lang === "cpp" || S.lang === "processing" || S.lang === "p5" || isWeb(S.lang)) { const n = editor.lineCount(); editor.operation(() => { for (let i = 0; i < n; i++) editor.indentLine(i, "smart"); }); }
  else editor.setValue(editor.getValue().replace(/\t/g, "    ").replace(/[ \t]+$/gm, ""));
  toast("Tidied");
}

/* ---------- events ---------- */
document.addEventListener("click", e => {
  const t = e.target.closest("button"); if (!t) { if (e.target.id === "modal") closeModal(); return; }
  if (t.dataset.lang) return setLang(t.dataset.lang);
  if (t.dataset.file) return setWebFile(t.dataset.file);
  if (t.dataset.ex != null) return loadExample(+t.dataset.ex);
  switch (t.dataset.act) {
    case "run": return run();
    case "examples": return showExamples();
    case "close": return closeModal();
    case "new": {
      const cur = editor.getValue();
      if (cur.trim() && cur !== (isWeb(S.lang) ? webStart(S.webfile) : LANGS[S.lang].start) && !confirm("Start a new program? The current one will be replaced.")) return;
      if (isWeb(S.lang)) { S.code.web = {}; setWebFile("html", true); } else editor.setValue(LANGS[S.lang].start);
      $("#stdin").value = ""; save(); emptyTerm(); clearErr();
      if (kindOf(S.lang) !== "term") { stopFrame(frame); stageNote("Press Run to see it here"); }
      return;
    }
    case "autorun": return toggleLive();
    case "popout": return popout();
    case "download": return download();
    case "upload": return $("#fileup").click();
    case "clear": clearTerm(); clearErr(); emptyTerm(); state(""); return;
    /* reset: stop whatever is running and start the output fresh */
    case "reset": if (running) stop(); clearTerm(); clearErr(); emptyTerm(); state(""); if (kindOf(S.lang) !== "term") { stopFrame(frame); stageNote("Press Run to see it here"); } toast("Reset"); return;
    case "copyout": {
      const txt = [...term.childNodes].filter(n => !(n.classList && (n.classList.contains("empty") || n.classList.contains("inrow")))).map(n => n.textContent).join("").trim();
      if (!txt) return toast("Nothing to copy yet");
      if (navigator.clipboard) navigator.clipboard.writeText(txt).then(() => toast("Output copied"), () => toast("Couldn't copy here"));
      return;
    }
    case "copy": navigator.clipboard && navigator.clipboard.writeText(editor.getValue()).then(() => toast("Code copied")); return;
    case "bigger": S.fs = Math.min(24, S.fs + 1); applyFont(); save(); return;
    case "smaller": S.fs = Math.max(11, S.fs - 1); applyFont(); save(); return;
    case "format": return tidy();
  }
});
document.addEventListener("keydown", e => {
  if ((e.ctrlKey || e.metaKey) && e.key === "Enter") { e.preventDefault(); run(); }
  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "s") { e.preventDefault(); save(); toast("Saved in this browser"); }
  if (e.key === "Escape") { if ($("#modal").classList.contains("on")) closeModal(); else if (running) stop(); }
});
$("#stdin").addEventListener("input", () => { clearTimeout(save._t); save._t = setTimeout(save, 300); });
editor.on("change", () => { clearTimeout(save._q); save._q = setTimeout(save, 400); liveTick(); });
/* the turtle canvas is sized to the pane, so a resize needs a redraw to match */
window.addEventListener("resize", () => { clearTimeout(window._rs); window._rs = setTimeout(() => { if (S.lang === "turtle") stageNote(turtleBusy ? "" : "Press Run to see it here"); }, 250); });
term.addEventListener("click", () => { const i = term.querySelector(".inrow input"); if (i) i.focus(); });
const gut = $("#gutter"); let gx = null;
gut.addEventListener("pointerdown", e => { gx = e.clientX; gut.setPointerCapture(e.pointerId); });
gut.addEventListener("pointermove", e => { if (gx === null) return; const w = Math.max(300, Math.min(window.innerWidth - 360, window.innerWidth - e.clientX)); S.iow = w; document.documentElement.style.setProperty("--iow", w + "px"); editor.refresh(); });
gut.addEventListener("pointerup", () => { gx = null; save(); });

/* The portal links straight to codelab/#python and codelab/#cpp, and the
   browser's Back button moves between tabs the same way. Changing only the
   fragment does not reload the page, so without this the tab never changed. */
window.addEventListener("hashchange", () => {
  const h = location.hash.slice(1);
  if (LANGS[h] && h !== S.lang) setLang(h);
});

setLang(S.lang);
window.CODELAB = { editor, run, setLang, get running() { return running; }, PY, loadExample };
