/* Code Lab - Python runner (Pyodide, real CPython compiled to WebAssembly, MPL-2.0).
   Runs in a worker so a long loop never freezes the page. input() waits for the student to type:
   the page writes the line into a SharedArrayBuffer and wakes this worker with Atomics.notify. */
const PYODIDE = "https://cdn.jsdelivr.net/pyodide/v0.26.4/full/";
importScripts(PYODIDE + "pyodide.js");

let py = null, ctl = null, data = null, queued = [];
const enc = new TextEncoder(), dec = new TextDecoder();
const post = (type, extra) => postMessage(Object.assign({ type }, extra || {}));

async function boot() {
  post("status", { text: "Loading Python…" });
  py = await loadPyodide({ indexURL: PYODIDE, stdout: s => post("out", { text: s + "\n" }), stderr: s => post("err", { text: s + "\n" }) });
  // unbuffered output so print(..., end="") and input("prompt") show straight away
  py.setStdout({ write: buf => { post("out", { text: dec.decode(buf) }); return buf.length; } });
  py.setStderr({ write: buf => { post("err", { text: dec.decode(buf) }); return buf.length; } });
  py.setStdin({ stdin: readLine, isatty: true });
  py.globals.set("__cl_image", b64 => post("image", { src: "data:image/png;base64," + b64 }));
  await py.runPythonAsync("import sys; sys.setrecursionlimit(3000)");
  post("ready", { version: py.version, python: py.runPython("import sys; sys.version.split()[0]"), interactive: !!ctl });
}

/* one line of input: from the Input box first, then live from the page */
function readLine() {
  if (queued.length) { const l = queued.shift(); post("echo", { text: l + "\n" }); return l + "\n"; }
  if (!ctl) { post("needinput"); return null; }                           // no SharedArrayBuffer: end of input
  Atomics.store(ctl, 0, 0);
  post("input");
  while (Atomics.load(ctl, 0) === 0) Atomics.wait(ctl, 0, 0, 500);
  if (Atomics.load(ctl, 0) === 2) return null;                             // stopped (EOF)
  const n = Atomics.load(ctl, 1);
  return dec.decode(data.slice(0, n)) + "\n";
}

const PRELUDE_PLOT = `
import matplotlib
matplotlib.use("AGG")
import matplotlib.pyplot as _plt, io as _io, base64 as _b64
def _cl_show(*a, **k):
    for n in _plt.get_fignums():
        f = _plt.figure(n); b = _io.BytesIO(); f.savefig(b, format="png", dpi=110, bbox_inches="tight")
        __cl_image(_b64.b64encode(b.getvalue()).decode())
    _plt.close("all")
_plt.show = _cl_show
`;

async function run(code, stdin) {
  queued = stdin ? stdin.replace(/\r/g, "").split("\n") : [];
  if (queued.length && queued[queued.length - 1] === "") queued.pop();
  const t0 = performance.now();
  try {
    await py.loadPackagesFromImports(code, { messageCallback: m => { if (/Loading|Loaded/.test(m)) post("status", { text: m.replace(/ from .*/, "") }); }, errorCallback: () => {} });
    const ns = py.globals.get("dict")(); ns.set("__name__", "__main__"); ns.set("__cl_image", py.globals.get("__cl_image"));
    if (/matplotlib/.test(code)) await py.runPythonAsync(PRELUDE_PLOT, { globals: ns });
    py.runPython(code, { globals: ns, filename: "main.py" });
    if (/matplotlib/.test(code)) py.runPython("_cl_show()", { globals: ns });
    ns.destroy();
    post("done", { ok: true, ms: Math.round(performance.now() - t0) });
  } catch (e) {
    let msg = String(e.message || e);
    // keep only the student's part of the traceback
    const lines = msg.split("\n"), i = lines.findIndex(l => l.includes('File "main.py"'));
    if (i >= 0) msg = "Traceback (most recent call last):\n" + lines.slice(i).join("\n");
    const m = [...msg.matchAll(/File "main\.py", line (\d+)/g)].pop();
    post("done", { ok: false, error: msg.trim(), line: m ? +m[1] : null, ms: Math.round(performance.now() - t0) });
  }
}

onmessage = async e => {
  const d = e.data;
  if (d.type === "init") {
    if (d.sab) { ctl = new Int32Array(d.sab, 0, 2); data = new Uint8Array(d.sab, 8); }
    if (d.irq) { try { /* set after boot */ self._irq = new Uint8Array(d.irq); } catch (er) { } }
    try { await boot(); if (self._irq) py.setInterruptBuffer(self._irq); } catch (er) { post("fatal", { text: "Python could not load. Check the internet connection, then reload the page. (" + er.message + ")" }); }
  }
  if (d.type === "run") { if (self._irq) self._irq[0] = 0; await run(d.code, d.stdin); }
};
