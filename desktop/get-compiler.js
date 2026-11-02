/* Puts the offline Arduino compiler together for the Windows app, in
   desktop/compiler-src/win (not committed: it is 300 MB of downloads).

   The app compiles Circuit Lab sketches itself when the online compiler can't
   be reached. It carries arduino-cli, the Arduino AVR core (Uno, Mega) and the
   libraries the online compiler offers. All of it is free software from
   downloads.arduino.cc.

   How: arduino-cli installs the core and libraries on this Mac into
   compiler-src/mac (arduino-cli from Homebrew). This script copies that folder
   to compiler-src/win, swaps every program for its Windows build listed in the
   same package index, and adds arduino-cli.exe. The folder layout is what
   arduino-cli expects, so on Windows it finds everything already installed.

   Once, on the Mac (brew install arduino-cli), from compiler-src/mac:
     arduino-cli --config-file arduino-cli.yaml core update-index
     arduino-cli --config-file arduino-cli.yaml core install arduino:avr
     arduino-cli --config-file arduino-cli.yaml lib install Servo "DHT sensor library" ...
   then:  node get-compiler.js */
const fs = require("fs");
const path = require("path");
const { execFileSync } = require("child_process");

const SRC = path.join(__dirname, "compiler-src");
const MAC = path.join(SRC, "mac"), WIN = path.join(SRC, "win"), DL = path.join(SRC, "dl");
const CLI_WIN = "https://downloads.arduino.cc/arduino-cli/arduino-cli_1.5.1_Windows_64bit.zip";

const run = (cmd, args, opts) => execFileSync(cmd, args, Object.assign({ stdio: "inherit" }, opts));
function fetchTo(url, file) {
  if (fs.existsSync(file) && fs.statSync(file).size > 0) return file;
  console.log("  downloading", path.basename(url));
  run("curl", ["-sSL", "--retry", "5", "-o", file, url]);
  return file;
}
/* unpack an archive and return its folder; arduino-cli drops a single top folder the same way */
function unpack(file) {
  const out = file + ".x";
  fs.rmSync(out, { recursive: true, force: true }); fs.mkdirSync(out);
  if (file.endsWith(".zip")) run("unzip", ["-q", file, "-d", out]);
  else run("tar", ["-xf", file, "-C", out]);
  const top = fs.readdirSync(out).filter(n => !n.startsWith("."));
  return top.length === 1 && fs.statSync(path.join(out, top[0])).isDirectory() ? path.join(out, top[0]) : out;
}

if (!fs.existsSync(path.join(MAC, "data", "packages", "arduino", "hardware", "avr"))) {
  console.error("compiler-src/mac has no AVR core yet: see the steps at the top of this file."); process.exit(1);
}
fs.mkdirSync(DL, { recursive: true });
fs.rmSync(WIN, { recursive: true, force: true });
console.log("Copying the Mac set-up");
fs.cpSync(MAC, WIN, { recursive: true, filter: s => !/[\\/](staging|tmp)$/.test(s) });

/* library examples, docs and tests are never compiled */
const LIBS = path.join(WIN, "user", "libraries");
for (const lib of fs.readdirSync(LIBS)) for (const d of ["examples", "docs", "extras", "test", "tests", "ci", ".github"]) fs.rmSync(path.join(LIBS, lib, d), { recursive: true, force: true });

/* every installed tool, replaced by the Windows build of the same version */
const index = JSON.parse(fs.readFileSync(path.join(MAC, "data", "package_index.json")));
for (const pkg of ["arduino", "builtin"]) {
  const dir = path.join(WIN, "data", "packages", pkg, "tools");
  if (!fs.existsSync(dir)) continue;
  for (const name of fs.readdirSync(dir)) for (const ver of fs.readdirSync(path.join(dir, name))) {
    const tool = index.packages.find(p => p.name === pkg).tools.find(t => t.name === name && t.version === ver);
    const sys = tool && (tool.systems.find(s => s.host === "x86_64-mingw32") || tool.systems.find(s => s.host === "i686-mingw32"));
    if (!sys) throw new Error(`no Windows build of ${pkg}:${name}@${ver}`);
    console.log(`${pkg}:${name}@${ver}`);
    const from = unpack(fetchTo(sys.url, path.join(DL, sys.archiveFileName)));
    const to = path.join(dir, name, ver);
    fs.rmSync(to, { recursive: true, force: true });
    fs.cpSync(from, to, { recursive: true });
  }
}

console.log("arduino-cli.exe");
fs.mkdirSync(path.join(WIN, "bin"), { recursive: true });
const cli = unpack(fetchTo(CLI_WIN, path.join(DL, "cli-win-1.5.1.zip")));
fs.copyFileSync(path.join(cli, "arduino-cli.exe"), path.join(WIN, "bin", "arduino-cli.exe"));

const size = d => fs.readdirSync(d, { withFileTypes: true }).reduce((s, f) => s + (f.isDirectory() ? size(path.join(d, f.name)) : fs.statSync(path.join(d, f.name)).size), 0);
console.log(`compiler-src/win ready: ${(size(WIN) / 1048576).toFixed(0)} MB`);
