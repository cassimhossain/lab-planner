/* Light, dark, or follow the system - for the Portal, Circuit Lab and Code Lab.
   Loaded as a plain script in <head>, before any stylesheet paints, so a dark
   page never flashes white first. The choice is kept under its own key,
   rac-theme-v1, and is shared by all three apps because they live on one site.
   Circuit Lab's older "circuitlab.theme" choice is honoured until a new one is made. */
(function () {
  "use strict";
  var KEY = "rac-theme-v1", OLD = "circuitlab.theme";
  var mq = window.matchMedia ? window.matchMedia("(prefers-color-scheme: dark)") : null;
  var LABEL = { system: "Theme: follows your device", light: "Theme: light", dark: "Theme: dark" };

  function read() {
    try {
      var v = localStorage.getItem(KEY);
      if (v === "light" || v === "dark" || v === "system") return v;
      var o = localStorage.getItem(OLD);
      if (o === "light" || o === "dark") return o;
    } catch (e) { }
    return "system";
  }
  var mode = read();
  var theme = function () { return mode === "system" ? (mq && mq.matches ? "dark" : "light") : mode; };

  function apply() {
    var r = document.documentElement, t = theme();
    r.setAttribute("data-theme", t);
    r.setAttribute("data-theme-mode", mode);
    var btns = document.querySelectorAll(".theme-btn");
    for (var i = 0; i < btns.length; i++) { btns[i].title = LABEL[mode]; btns[i].setAttribute("aria-label", LABEL[mode] + ". Click to change."); }
    try { document.dispatchEvent(new CustomEvent("rac-theme", { detail: { mode: mode, theme: t } })); } catch (e) { }
  }
  function set(m) {
    mode = m === "light" || m === "dark" ? m : "system";
    try { localStorage.setItem(KEY, mode); } catch (e) { }
    apply();
  }
  /* the button walks system -> light -> dark -> system */
  function cycle() { set(mode === "system" ? "light" : mode === "light" ? "dark" : "system"); return mode; }

  if (mq) {
    var onChange = function () { if (mode === "system") apply(); };
    if (mq.addEventListener) mq.addEventListener("change", onChange); else if (mq.addListener) mq.addListener(onChange);
  }
  /* any .theme-btn on the page works without further wiring */
  document.addEventListener("click", function (e) {
    var b = e.target && e.target.closest ? e.target.closest(".theme-btn") : null;
    if (b) { e.preventDefault(); cycle(); }
  });
  document.addEventListener("DOMContentLoaded", apply);

  window.RACTheme = { get mode() { return mode; }, get theme() { return theme(); }, set: set, cycle: cycle };
  apply();
})();
