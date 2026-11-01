/* Robotics & AI Club attendance register.

   Paste this into the Google Sheet's Extensions → Apps Script, then deploy it
   as a web app (see README.md next to this file). The portal's Attendance page
   then reads and writes this Sheet, and you can also edit the Sheet directly.

   The Sheet has:
   - Students: one row per student (Name, Class, Group). Edit names and
     groups here. A row you add by hand gets its ID the next time it syncs.
   - one register tab per group: students down the side, one column per
     class with its date and lesson, P or A in each cell, and the totals.
   - Settings: how many classes each group plans to have.

   Nobody can read or change it without the teacher PIN, which you set from
   the "Club attendance" menu in the Sheet. The PIN is kept in the script's
   properties, never in the website. */

const GROUPS = [
  { code: "G1", name: "Grade 1–5", total: 8 },
  { code: "G2", name: "Grade 6–8", total: 16 },
  { code: "G3", name: "IG · Matric · FSc · A level", total: 16 },
];
const FIRST = 6;   // first class column (F): A ID, B Name, C Class, D Attended, E %
const TOP = 5;     // first student row: 1 class IDs, 2 header, 3 dates, 4 lessons

function onOpen() {
  SpreadsheetApp.getUi().createMenu("Club attendance")
    .addItem("Set the teacher PIN", "setPin")
    .addItem("Set up or tidy the sheet", "setUp")
    .addToUi();
}

function setPin() {
  const ui = SpreadsheetApp.getUi();
  const r = ui.prompt("Teacher PIN", "Choose a PIN of at least 4 characters. You type it once on the portal to connect.", ui.ButtonSet.OK_CANCEL);
  if (r.getSelectedButton() !== ui.Button.OK) return;
  const pin = r.getResponseText().trim();
  if (pin.length < 4) return ui.alert("The PIN needs at least 4 characters.");
  PropertiesService.getScriptProperties().setProperty("PIN", pin);
  ui.alert("PIN saved.");
}

function setUp() {
  writeAll(readAll());
  SpreadsheetApp.getActive().toast("The register is set up.");
}

/* opening the web app address in a browser only says it is running */
function doGet() { return out({ ok: true, app: "club-attendance" }); }

/* the portal sends { pin, changes: [...] } and gets the whole register back */
function doPost(e) {
  let req;
  try { req = JSON.parse(e.postData.contents); } catch (x) { return out({ error: "bad" }); }
  const cache = CacheService.getScriptCache(), fails = +cache.get("fails") || 0;
  if (fails >= 10) return out({ error: "locked" });
  const pin = PropertiesService.getScriptProperties().getProperty("PIN");
  if (!pin) return out({ error: "nopin" });
  if (String(req.pin || "") !== pin) { cache.put("fails", String(fails + 1), 600); return out({ error: "pin" }); }
  const lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    const at = readAll(), changes = Array.isArray(req.changes) ? req.changes : [];
    changes.forEach(c => applyChange(at, c));
    if (changes.length || at.dirty) writeAll(at);
    delete at.dirty;
    return out({ ok: true, at: at, url: SpreadsheetApp.getActive().getUrl() });
  } catch (x) {
    return out({ error: "sheet", detail: String(x.message || x).slice(0, 200) });
  } finally {
    lock.releaseLock();
  }
}

function out(o) { return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON); }

/* the same rules as the portal's applyChange, so both end up identical */
function applyChange(at, c) {
  if (!c || !c.t) return;
  const low = s => String(s || "").toLowerCase();
  if (c.t === "saveClass" && c.cls && byCode(c.cls.group)) {
    const x = c.cls, v = { id: String(x.id), group: x.group, date: String(x.date || ""), lesson: String(x.lesson || ""), marks: x.marks || {} };
    const i = at.classes.findIndex(k => k.id === v.id);
    if (i >= 0) at.classes[i] = v; else at.classes.push(v);
  } else if (c.t === "delClass") at.classes = at.classes.filter(k => k.id !== c.id);
  else if (c.t === "addStudents") (c.students || []).forEach(s => {
    if (!s || !s.name || at.students.some(o => o.id === s.id || (low(o.name) === low(s.name) && low(o.cls) === low(s.cls)))) return;
    at.students.push({ id: String(s.id || uid()), name: String(s.name), cls: String(s.cls || ""), group: byCode(s.group) ? s.group : "" });
  });
  else if (c.t === "updStudent") {
    const s = at.students.find(o => o.id === c.id);
    if (s) ["name", "cls", "group"].forEach(k => { if (c[k] != null) s[k] = String(c[k]); });
  } else if (c.t === "delStudent") at.students = at.students.filter(o => o.id !== c.id);
  else if (c.t === "setTotal" && byCode(c.group)) at.totals[c.group] = Math.max(1, Math.min(60, +c.n || byCode(c.group).total));
  else if (c.t === "replaceAll" && c.at) {
    at.students = c.at.students || []; at.classes = c.at.classes || []; at.totals = c.at.totals || {};
  }
}

const byCode = c => GROUPS.find(g => g.code === c);
const uid = () => Math.random().toString(36).slice(2, 10);

/* the club's three groups, read from the Class column, as on the portal */
function groupFromClass(cls) {
  const c = String(cls || "").toUpperCase().replace(/[\s.\-]/g, "");
  if (/^(IG|FSC|FA|ICS|AS|A2|ALEVEL|OLEVEL|SSC|HSSC|MATRIC|GRADE(9|10|11|12))/.test(c)) return "G3";
  const n = parseInt(c.replace(/^(GRADE|CLASS)/, ""), 10);
  return n >= 1 && n <= 5 ? "G1" : n >= 6 && n <= 8 ? "G2" : n >= 9 ? "G3" : "";
}

function tab(name) {
  const ss = SpreadsheetApp.getActive();
  return ss.getSheetByName(name) || ss.insertSheet(name);
}

function isoDate(v) {
  if (v instanceof Date) return Utilities.formatDate(v, SpreadsheetApp.getActive().getSpreadsheetTimeZone(), "yyyy-MM-dd");
  return String(v || "").trim();
}

function mark(v) {
  const s = String(v === true ? "p" : v === false ? "a" : v || "").trim().toLowerCase();
  return /^(p|present|y|yes|1|✓|✔)$/.test(s) ? "p" : /^(a|absent|n|no|0|✗|x)$/.test(s) ? "a" : "";
}

/* ----- the Sheet as the portal's data ----- */
function readAll() {
  const at = { v: 1, students: [], classes: [], totals: {}, dirty: false };

  const set = tab("Settings").getDataRange().getValues();
  set.slice(1).forEach(r => {
    const g = GROUPS.find(x => x.name === String(r[0]).trim() || x.code === String(r[0]).trim());
    if (g && +r[1] > 0) at.totals[g.code] = Math.min(60, Math.round(+r[1]));
  });

  const st = tab("Students").getDataRange().getValues();
  st.slice(1).forEach(r => {
    const name = String(r[1] || "").replace(/\s+/g, " ").trim();
    if (!name) return;
    const cls = String(r[2] || "").trim(), gname = String(r[3] || "").trim();
    const g = GROUPS.find(x => x.name === gname || x.code === gname);
    let id = String(r[0] || "").trim();
    if (!id) { id = uid(); at.dirty = true; }
    at.students.push({ id: id, name: name, cls: cls, group: g ? g.code : groupFromClass(cls) });
  });

  GROUPS.forEach(g => {
    const sh = SpreadsheetApp.getActive().getSheetByName(g.name);
    if (!sh || sh.getLastColumn() < FIRST) return;
    const v = sh.getRange(1, 1, Math.max(sh.getLastRow(), TOP), sh.getLastColumn()).getValues();
    for (let col = FIRST - 1; col < v[0].length; col++) {
      const marks = {};
      for (let row = TOP - 1; row < v.length; row++) {
        const sid = String(v[row][0] || "").trim(), m = mark(v[row][col]);
        if (sid && m) marks[sid] = m;
      }
      const date = isoDate(v[2][col]), lesson = String(v[3][col] || "").trim();
      let id = String(v[0][col] || "").trim();
      if (!date && !lesson && !Object.keys(marks).length) continue;
      if (!id) { id = uid(); at.dirty = true; }
      at.classes.push({ id: id, group: g.code, date: date, lesson: lesson, marks: marks });
    }
  });
  return at;
}

/* ----- the portal's data written back as a tidy register ----- */
function writeAll(at) {
  const gname = c => (byCode(c) || {}).name || "";

  const set = tab("Settings");
  set.clear();
  set.getRange(1, 1, GROUPS.length + 1, 2).setValues([["Group", "Planned classes"]].concat(GROUPS.map(g => [g.name, at.totals[g.code] || g.total])));
  set.getRange(1, 1, 1, 2).setFontWeight("bold");
  set.autoResizeColumns(1, 2);

  const st = tab("Students"), sorted = at.students.slice().sort((a, b) => (a.group + a.name).localeCompare(b.group + b.name));
  st.clear();
  st.getRange(1, 1, sorted.length + 1, 4).setValues([["ID", "Name", "Class", "Group"]].concat(sorted.map(s => [s.id, s.name, s.cls, gname(s.group)])));
  st.getRange(1, 1, 1, 4).setFontWeight("bold").setBackground("#E8EEF8");
  st.setFrozenRows(1);
  st.hideColumns(1);
  st.getRange(2, 4, Math.max(sorted.length + 200, 1), 1).setDataValidation(
    SpreadsheetApp.newDataValidation().requireValueInList(GROUPS.map(g => g.name), true).setAllowInvalid(false).build());
  st.autoResizeColumns(2, 3);

  GROUPS.forEach(g => {
    const sh = tab(g.name), total = at.totals[g.code] || g.total;
    const kids = at.students.filter(s => s.group === g.code).sort((a, b) => a.name.localeCompare(b.name));
    const cls = at.classes.filter(c => c.group === g.code).sort((a, b) => (a.date + a.id).localeCompare(b.date + b.id));
    const cols = FIRST - 1 + Math.max(cls.length, 1), rows = TOP - 1 + Math.max(kids.length, 1);
    if (sh.getMaxColumns() < cols) sh.insertColumnsAfter(sh.getMaxColumns(), cols - sh.getMaxColumns());
    if (sh.getMaxRows() < rows) sh.insertRowsAfter(sh.getMaxRows(), rows - sh.getMaxRows());
    sh.clear();
    sh.getRange(1, 1, sh.getMaxRows(), sh.getMaxColumns()).clearDataValidations();
    const pad = a => { while (a.length < cols) a.push(""); return a; };
    const v = [
      pad(["ID", "", "", "", ""].concat(cls.map(c => c.id))),
      pad(["", "Name", "Class", "Attended", "%"].concat(cls.map((c, i) => "Class " + (i + 1) + " of " + total))),
      pad(["", "Date", "", "", ""].concat(cls.map(c => c.date))),
      pad(["", "Lesson", "", "", ""].concat(cls.map(c => c.lesson))),
    ];
    kids.forEach((s, i) => {
      const r = TOP + i;
      v.push(pad([s.id, s.name, s.cls,
        '=COUNTIF(F' + r + ':' + r + ',"P")',
        '=IF(COUNTA(F' + r + ':' + r + ')=0,"",D' + r + '/COUNTA(F' + r + ':' + r + '))']
        .concat(cls.map(c => c.marks[s.id] === "p" ? "P" : c.marks[s.id] === "a" ? "A" : ""))));
    });
    if (!kids.length) v.push(pad(["", "No students in this group yet. Add them on the Students tab."]));
    sh.getRange(1, 1, v.length, cols).setValues(v);

    sh.hideRows(1); sh.hideColumns(1);
    sh.setFrozenRows(TOP - 1); sh.setFrozenColumns(FIRST - 1);
    sh.getRange(2, 1, 1, cols).setFontWeight("bold").setBackground("#E8EEF8");
    sh.getRange(3, 2, 2, 1).setFontWeight("bold");
    sh.getRange(3, FIRST, 1, Math.max(cls.length, 1)).setNumberFormat("d mmm yyyy");
    sh.getRange(4, FIRST, 1, Math.max(cls.length, 1)).setWrap(true).setVerticalAlignment("top").setFontSize(9);
    sh.getRange(TOP, 5, Math.max(kids.length, 1), 1).setNumberFormat("0%");
    sh.setColumnWidth(2, 200); sh.setColumnWidths(FIRST, Math.max(cls.length, 1), 110);
    if (kids.length && cls.length) {
      const marks = sh.getRange(TOP, FIRST, kids.length, cls.length);
      marks.setHorizontalAlignment("center").setDataValidation(
        SpreadsheetApp.newDataValidation().requireValueInList(["P", "A"], true).setAllowInvalid(false).build());
      sh.setConditionalFormatRules([
        SpreadsheetApp.newConditionalFormatRule().whenTextEqualTo("P").setBackground("#D6F0DD").setFontColor("#1B6B34").setRanges([marks]).build(),
        SpreadsheetApp.newConditionalFormatRule().whenTextEqualTo("A").setBackground("#F8D9D6").setFontColor("#9B2A1F").setRanges([marks]).build(),
      ]);
    } else sh.setConditionalFormatRules([]);
  });

  const ss = SpreadsheetApp.getActive(), blank = ss.getSheetByName("Sheet1");
  if (blank && ss.getSheets().length > 1 && blank.getLastRow() === 0) ss.deleteSheet(blank);
}
