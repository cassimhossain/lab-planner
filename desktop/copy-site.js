/* Packs a copy of the site into desktop/site/ for the app to use offline.
   Run by "npm run mac" and "npm run win"; the folder isn't committed. */
const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const OUT = path.join(__dirname, "site");
/* LAB_MODE=circuit packs only what Circuit Lab, Code Lab and Study Buddy load */
const ONLY = process.env.LAB_MODE === "circuit" ? new Set(["circuit", "codelab", "vendor", "buddy", "fonts", "tokens.css", "theme.js", "logo.svg", "robo.js", "404.html"]) : null;
/* tooling and sources the site itself never loads */
const SKIP = new Set(["desktop", ".git", ".github", ".claude", "tools", "chatbot-proxy", "knowledge", "node_modules", "_config.yml", ".gitignore", ".DS_Store"]);

fs.rmSync(OUT, { recursive: true, force: true });
fs.mkdirSync(OUT);
/* entry by entry: this folder sits inside the site, and Node won't copy a folder into itself */
for (const name of fs.readdirSync(ROOT)) {
  if (SKIP.has(name) || (ONLY && !ONLY.has(name))) continue;
  fs.cpSync(path.join(ROOT, name), path.join(OUT, name), {
    recursive: true,
    filter: src => !src.endsWith(".DS_Store") && !src.includes("__pycache__"),
  });
}
let n = 0, bytes = 0;
(function walk(d) { for (const f of fs.readdirSync(d, { withFileTypes: true })) { const p = path.join(d, f.name); if (f.isDirectory()) walk(p); else { n++; bytes += fs.statSync(p).size; } } })(OUT);
console.log(`Site packed: ${n} files, ${(bytes / 1048576).toFixed(1)} MB`);
