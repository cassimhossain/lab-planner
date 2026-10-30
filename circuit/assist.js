/* Circuit Lab - editor help: Arduino autocomplete, plus the dark and full-screen views.
   The word list is built from the Arduino core, the libraries Circuit Lab ships, and
   whatever the student has already typed, so it suggests their own variable names too. */

const CORE = [
  // structure
  "setup", "loop",
  // digital and analog
  "pinMode", "digitalWrite", "digitalRead", "analogRead", "analogWrite", "analogReference",
  "INPUT", "OUTPUT", "INPUT_PULLUP", "HIGH", "LOW", "LED_BUILTIN",
  "A0", "A1", "A2", "A3", "A4", "A5",
  // time
  "delay", "delayMicroseconds", "millis", "micros",
  // maths
  "map", "constrain", "min", "max", "abs", "round", "pow", "sqrt", "sq", "random", "randomSeed",
  "sin", "cos", "tan", "floor", "ceil",
  // bits and bytes
  "bitRead", "bitWrite", "bitSet", "bitClear", "bit", "lowByte", "highByte",
  // advanced io
  "tone", "noTone", "pulseIn", "shiftOut", "shiftIn", "attachInterrupt", "detachInterrupt",
  "digitalPinToInterrupt", "RISING", "FALLING", "CHANGE",
  // serial
  "Serial.begin", "Serial.print", "Serial.println", "Serial.available", "Serial.read",
  "Serial.readString", "Serial.readStringUntil", "Serial.parseInt", "Serial.parseFloat",
  "Serial.write", "Serial.flush", "Serial.end",
  // types and keywords
  "int", "long", "float", "double", "char", "bool", "boolean", "byte", "word", "void",
  "unsigned", "const", "static", "volatile", "true", "false", "String",
  "if", "else", "for", "while", "do", "switch", "case", "break", "continue", "return", "default",
  "struct", "class", "public", "private", "enum", "sizeof", "#include", "#define",
];

/* the calls students reach for most, per library Circuit Lab ships */
const LIB = {
  "Servo.h": ["Servo", "attach", "write", "writeMicroseconds", "read", "detach"],
  "Wire.h": ["Wire.begin", "Wire.beginTransmission", "Wire.endTransmission", "Wire.write", "Wire.requestFrom", "Wire.read"],
  "SPI.h": ["SPI.begin", "SPI.transfer", "SPI.beginTransaction", "SPI.endTransaction"],
  "EEPROM.h": ["EEPROM.read", "EEPROM.write", "EEPROM.update", "EEPROM.get", "EEPROM.put"],
  "SoftwareSerial.h": ["SoftwareSerial"],
  "DHT.h": ["DHT", "readTemperature", "readHumidity"],
  "Adafruit_NeoPixel.h": ["Adafruit_NeoPixel", "setPixelColor", "Color", "show", "setBrightness", "numPixels", "clear"],
  "LiquidCrystal_I2C.h": ["LiquidCrystal_I2C", "init", "backlight", "setCursor", "print", "clear"],
  "Adafruit_SSD1306.h": ["Adafruit_SSD1306", "display", "clearDisplay", "setTextSize", "setTextColor", "setCursor", "drawRect", "fillRect", "drawCircle"],
  "Keypad.h": ["Keypad", "getKey", "makeKeymap"],
  "Adafruit_PWMServoDriver.h": ["Adafruit_PWMServoDriver", "setPWM", "setPWMFreq", "writeMicroseconds", "setPin"],
  "Adafruit_ADS1X15.h": ["Adafruit_ADS1115", "readADC_SingleEnded", "computeVolts", "setGain"],
  "PCF8574.h": ["PCF8574", "write8", "read8"],
  "Adafruit_MCP23X17.h": ["Adafruit_MCP23X17", "begin_I2C", "writeGPIOAB", "readGPIOAB"],
};

/* words already in the sketch, so a student's own names come back to them */
function wordsIn(text) {
  const out = new Set();
  const re = /[A-Za-z_][A-Za-z0-9_]{2,}/g;
  let m; while ((m = re.exec(text))) out.add(m[0]);
  return out;
}

function vocabulary(cm) {
  const text = cm.getValue();
  const set = new Set(CORE);
  /* only suggest a library's calls once that library is actually included */
  for (const [header, words] of Object.entries(LIB)) {
    if (text.includes(header)) words.forEach(w => set.add(w));
  }
  wordsIn(text).forEach(w => set.add(w));
  return [...set];
}

export function installAutocomplete(CodeMirror, cm) {
  if (!CodeMirror.showHint) return false;
  CodeMirror.registerHelper("hint", "arduino", function (editor) {
    const cur = editor.getCursor(), line = editor.getLine(cur.line);
    /* take the token back through dots, so "Serial.pr" completes as one word */
    let start = cur.ch;
    while (start && /[\w.#]/.test(line.charAt(start - 1))) start--;
    const word = line.slice(start, cur.ch);
    if (!word || word.length < 2) return null;
    const all = vocabulary(editor);

    const match = (token) => {
      const lower = token.toLowerCase();
      const starts = [], contains = [];
      for (const w of all) {
        if (w === token) continue;
        const lw = w.toLowerCase();
        if (lw.startsWith(lower)) starts.push(w);
        else if (lw.includes(lower)) contains.push(w);
      }
      const by = (a, b) => a.length - b.length || a.localeCompare(b);
      return starts.sort(by).concat(contains.sort(by)).slice(0, 30);
    };

    /* "Serial.pr" matches whole, because the list holds Serial.print. But "pwm.setPW"
       is an object the student named, so fall back to completing after the dot. */
    let list = match(word), from = start;
    if (!list.length) {
      const dot = word.lastIndexOf(".");
      if (dot < 0) return null;
      const tail = word.slice(dot + 1);
      if (tail.length < 2) return null;
      list = match(tail).filter(w => !w.includes("."));
      from = start + dot + 1;
    }
    if (!list.length) return null;
    return { list, from: CodeMirror.Pos(cur.line, from), to: CodeMirror.Pos(cur.line, cur.ch) };
  });

  const show = () => CodeMirror.showHint(cm, CodeMirror.hint.arduino, { completeSingle: false, alignWithWord: true });
  cm.setOption("extraKeys", Object.assign({}, cm.getOption("extraKeys"), {
    "Ctrl-Space": show, "Alt-/": show,
  }));
  /* suggest as they type, but never while they are deleting or starting a new line */
  cm.on("inputRead", (_, change) => {
    if (change.origin !== "+input") return;
    const t = change.text && change.text[0];
    if (!t || !/[A-Za-z_.]/.test(t)) return;
    const cur = cm.getCursor(), line = cm.getLine(cur.line);
    let s = cur.ch; while (s && /[\w.#]/.test(line.charAt(s - 1))) s--;
    if (cur.ch - s < 2) return;
    show();
  });
  return true;
}

/* ---------- dark mode ----------
   The choice lives in ../theme.js (window.RACTheme), shared with the portal and
   Code Lab. Setting the theme it is already in changes nothing, so a page
   that follows the device keeps following it. */
const RT = () => window.RACTheme;
export function currentTheme() {
  return RT() ? RT().theme : (document.documentElement.getAttribute("data-theme") || "light");
}
export function applyTheme(name) {
  const t = name === "dark" ? "dark" : "light";
  if (t === currentTheme()) return;
  if (RT()) RT().set(t); else document.documentElement.setAttribute("data-theme", t);
}
export function toggleTheme() {
  const next = currentTheme() === "dark" ? "light" : "dark";
  applyTheme(next);
  return next;
}

/* ---------- full screen ---------- */
export function isFullscreen() { return !!(document.fullscreenElement || document.webkitFullscreenElement); }
export function toggleFullscreen() {
  const el = document.documentElement;
  if (isFullscreen()) { (document.exitFullscreen || document.webkitExitFullscreen).call(document); return false; }
  const go = el.requestFullscreen || el.webkitRequestFullscreen;
  if (go) go.call(el);
  return true;
}
