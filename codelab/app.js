/* Code Lab - Python (Pyodide, in the browser) and C++ (g++ on an online compiler) for the Robotics & AI Club. */
import { EXAMPLES } from "./examples.js?v=1";

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
};
const saved = store.get(KEY) || {};
const S = { lang: saved.lang || "python", code: saved.code || {}, stdin: saved.stdin || {}, fs: saved.fs || 15, iow: saved.iow || null };
const fromHash = location.hash.slice(1);
if (LANGS[fromHash]) S.lang = fromHash;

/* ---------- editor ---------- */
const editor = CodeMirror($("#editor"), {
  value: S.code[S.lang] ?? LANGS[S.lang].start, mode: LANGS[S.lang].mode, theme: "cl", lineNumbers: true, indentUnit: 4, tabSize: 4,
  matchBrackets: true, autoCloseBrackets: true, styleActiveLine: true, viewportMargin: 30,
  extraKeys: { "Ctrl-Enter": () => run(), "Cmd-Enter": () => run(), "Tab": cm => cm.somethingSelected() ? cm.indentSelection("add") : cm.replaceSelection("    "), "Shift-Tab": cm => cm.indentSelection("subtract"), "Ctrl-/": "toggleComment", "Cmd-/": "toggleComment" },
});
let errMark = null;
const clearErr = () => { if (errMark != null) { editor.removeLineClass(errMark, "background", "errline"); editor.removeLineClass(errMark, "gutter", "errline-g"); errMark = null; } };
const markErr = n => { clearErr(); if (!n || n < 1 || n > editor.lineCount()) return; errMark = n - 1; editor.addLineClass(errMark, "background", "errline"); editor.addLineClass(errMark, "gutter", "errline-g"); editor.scrollIntoView({ line: errMark, ch: 0 }, 120); };
editor.on("change", () => { clearErr(); clearTimeout(editor._t); editor._t = setTimeout(save, 300); });
function save() { S.code[S.lang] = editor.getValue(); S.stdin[S.lang] = $("#stdin").value; store.set(KEY, S); }
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
function emptyTerm() {
  term.innerHTML = S.lang === "python"
    ? `<div class="empty"><b>Press Run</b> (or <kbd>Ctrl</kbd>+<kbd>Enter</kbd>) to run your Python program. Output appears here.<br>When the program asks for input, type your answer here and press <kbd>Enter</kbd>.<br>numpy, pandas and matplotlib work: plots show up right here.</div>`
    : `<div class="empty"><b>Press Run</b> (or <kbd>Ctrl</kbd>+<kbd>Enter</kbd>) to compile and run your C++ program with g++.<br>If it reads input with <code>cin</code>, type the input in the <b>Input</b> box below first.<br>Needs an internet connection.</div>`;
}
const state = (t, cls = "") => { const r = $("#runstate"); r.textContent = t; r.className = "runstate " + cls; };
const engine = (t, cls = "") => { const e = $("#engine"); e.innerHTML = `<i></i>${esc(t)}`; e.className = "engine " + cls; };
function toast(m) { const t = $("#toast"); t.innerHTML = m; t.classList.add("on"); clearTimeout(toast._t); toast._t = setTimeout(() => t.classList.remove("on"), 2400); }

/* ---------- Python ---------- */
const PY = { worker: null, ready: false, sab: null, irq: null, ctl: null, data: null, running: false, waiting: null };
const canWait = () => typeof SharedArrayBuffer !== "undefined" && self.crossOriginIsolated;
function startPython() {
  if (PY.worker) return;
  PY.ready = false; engine("Python loading…");
  PY.worker = new Worker("py-worker.js?v=1");
  if (canWait()) { PY.sab = new SharedArrayBuffer(8 + 65536); PY.ctl = new Int32Array(PY.sab, 0, 2); PY.data = new Uint8Array(PY.sab, 8); PY.irq = new SharedArrayBuffer(1); }
  PY.worker.onmessage = e => onPy(e.data);
  PY.worker.onerror = e => { engine("Python failed to load", "bad"); out("\nPython could not start: " + (e.message || "unknown error") + "\n", "bad"); };
  PY.worker.postMessage({ type: "init", sab: PY.sab, irq: PY.irq });
}
function onPy(m) {
  if (m.type === "status") { if (!PY.ready) engine(m.text); else state(m.text, "busy"); }
  if (m.type === "ready") { PY.ready = true; engine(`Python ${m.python}`, "ok"); if (PY.pending) { const p = PY.pending; PY.pending = null; runPython(p); } }
  if (m.type === "fatal") { engine("Python unavailable", "bad"); out(m.text + "\n", "bad"); setRunning(false); }
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
  row.innerHTML = `<input aria-label="Type your answer and press Enter" autocomplete="off" spellcheck="false">`;
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

/* ---------- run / stop ---------- */
let running = false, needAsked = false;
function setRunning(on) {
  running = on; PY.running = on && S.lang === "python";
  const b = $("#runbtn"); b.classList.toggle("stop", on);
  b.innerHTML = on ? `<svg class="ic" viewBox="0 0 24 24"><rect x="6" y="6" width="12" height="12" rx="2"/></svg><span>Stop</span>` : `<svg class="ic" viewBox="0 0 24 24"><path d="M7 5l12 7-12 7z"/></svg><span>Run</span>`;
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
  setRunning(true); state("Running…", "busy");
  if (S.lang === "python") runPython(code); else runCpp(code);
}
function stop() { if (S.lang === "python") stopPython(); else if (cppAbort) cppAbort.abort(); }

/* ---------- language switch ---------- */
function setLang(l) {
  if (running) stop();
  save(); S.lang = l; store.set(KEY, S);
  document.querySelectorAll(".langs button").forEach(b => b.classList.toggle("on", b.dataset.lang === l));
  editor.setOption("mode", LANGS[l].mode); editor.setValue(S.code[l] ?? LANGS[l].start); editor.clearHistory();
  $("#fname").value = LANGS[l].file; $("#stdin").value = S.stdin[l] || "";
  $("#stdinhelp").textContent = l === "python" ? "Optional. Lines typed here are read first by input(). Leave it empty to type answers while the program runs." : "Type everything the program reads with cin before you press Run, one value or line at a time.";
  emptyTerm(); state("");
  if (l === "python") { startPython(); if (PY.ready) engine("Python ready", "ok"); }
  else engine("g++ 13 · online", "ok");
  history.replaceState(null, "", "#" + l);
}

/* ---------- examples ---------- */
function showExamples() {
  const list = EXAMPLES[S.lang], cats = [...new Set(list.map(x => x.cat))];
  $("#mbox").innerHTML = `<div class="mh"><span class="lg ${S.lang === "python" ? "py" : "cpp"}">${S.lang === "python" ? "Py" : "C++"}</span><h2>${LANGS[S.lang].name} examples</h2><div class="grow"></div><button class="mx" data-act="close" title="Close"><svg class="ic" viewBox="0 0 24 24"><path d="M6 6l12 12M18 6L6 18"/></svg></button></div>
    <div class="mb">${cats.map(c => `<div class="excat">${esc(c)}</div><div class="exgrid">${list.map((x, i) => x.cat !== c ? "" : `<button class="excard" data-ex="${i}"><b>${esc(x.title)}</b><code>${esc(x.code.split("\n").filter(l => l.trim() && !/^#include|^using/.test(l)).slice(0, 2).join("\n"))}</code>${x.input || /input\(|cin/.test(x.code) ? `<em>uses input</em>` : ""}</button>`).join("")}</div>`).join("")}</div>`;
  $("#modal").classList.add("on");
}
function loadExample(i) {
  const x = EXAMPLES[S.lang][i]; if (!x) return;
  editor.setValue(x.code); $("#stdin").value = x.input || ""; save(); closeModal(); emptyTerm(); state("");
  toast(`Opened <b>${esc(x.title)}</b>. Press Run.`); editor.focus();
}
const closeModal = () => $("#modal").classList.remove("on");

/* ---------- files ---------- */
function download() {
  const name = ($("#fname").value || LANGS[S.lang].file).trim();
  const a = document.createElement("a"); a.href = URL.createObjectURL(new Blob([editor.getValue()], { type: "text/plain" })); a.download = name; a.click(); setTimeout(() => URL.revokeObjectURL(a.href), 1000);
}
$("#fileup").addEventListener("change", e => {
  const f = e.target.files[0]; if (!f) return;
  const l = /\.py$/i.test(f.name) ? "python" : /\.(cpp|cc|c|h)$/i.test(f.name) ? "cpp" : S.lang;
  f.text().then(t => { if (l !== S.lang) setLang(l); editor.setValue(t); $("#fname").value = f.name; save(); toast(`Opened <b>${esc(f.name)}</b>`); });
  e.target.value = "";
});
function tidy() {
  if (S.lang === "cpp") { const n = editor.lineCount(); editor.operation(() => { for (let i = 0; i < n; i++) editor.indentLine(i, "smart"); }); }
  else editor.setValue(editor.getValue().replace(/\t/g, "    ").replace(/[ \t]+$/gm, ""));
  toast("Tidied");
}

/* ---------- events ---------- */
document.addEventListener("click", e => {
  const t = e.target.closest("button"); if (!t) { if (e.target.id === "modal") closeModal(); return; }
  if (t.dataset.lang) return setLang(t.dataset.lang);
  if (t.dataset.ex != null) return loadExample(+t.dataset.ex);
  switch (t.dataset.act) {
    case "run": return run();
    case "examples": return showExamples();
    case "close": return closeModal();
    case "new": if (editor.getValue().trim() && editor.getValue() !== LANGS[S.lang].start && !confirm("Start a new program? The current one will be replaced.")) return; editor.setValue(LANGS[S.lang].start); $("#stdin").value = ""; save(); emptyTerm(); return;
    case "download": return download();
    case "upload": return $("#fileup").click();
    case "clear": clearTerm(); state(""); return;
    case "copy": navigator.clipboard && navigator.clipboard.writeText(editor.getValue()).then(() => toast("Code copied")); return;
    case "bigger": S.fs = Math.min(24, S.fs + 1); applyFont(); save(); return;
    case "smaller": S.fs = Math.max(11, S.fs - 1); applyFont(); save(); return;
    case "format": return tidy();
  }
});
document.addEventListener("keydown", e => {
  if ((e.ctrlKey || e.metaKey) && e.key === "Enter") { e.preventDefault(); run(); }
  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "s") { e.preventDefault(); save(); toast("Saved in this browser"); }
  if (e.key === "Escape") closeModal();
});
$("#stdin").addEventListener("input", () => { clearTimeout(save._t); save._t = setTimeout(save, 300); });
term.addEventListener("click", () => { const i = term.querySelector(".inrow input"); if (i) i.focus(); });
const gut = $("#gutter"); let gx = null;
gut.addEventListener("pointerdown", e => { gx = e.clientX; gut.setPointerCapture(e.pointerId); });
gut.addEventListener("pointermove", e => { if (gx === null) return; const w = Math.max(300, Math.min(window.innerWidth - 360, window.innerWidth - e.clientX)); S.iow = w; document.documentElement.style.setProperty("--iow", w + "px"); editor.refresh(); });
gut.addEventListener("pointerup", () => { gx = null; save(); });

setLang(S.lang);
window.CODELAB = { editor, run, setLang, get running() { return running; }, PY, loadExample };
