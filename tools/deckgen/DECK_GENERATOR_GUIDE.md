# How to make Robotics & AI Club slide decks

This is the recipe for the 126 decks already in `library/slides/`, written
down so the next deck looks like the last one. The generator lives in
`tools/deckgen/`.

```
tools/deckgen/
  theme.css      the house style. Do not fork it per deck.
  render.js      deck object -> HTML -> 16:9 PDF, via Playwright (or
                 playwright-core with the installed Google Chrome)
  lib.js         the title, divider, objectives and check slides
  art.js         54 hand-drawn doodles, shared with the web decks
  diagrams.js    hand-drawn explanatory figures (buses, H-bridges, graphs)
  circuits.js    hand-drawn wiring diagrams, one per build
  fonts/         Baloo 2, Nunito, Patrick Hand (woff2, embedded in the PDF)
  decks/XX-00.js one file per deck
```

The page comes out at 1000.08 × 563.04 pt, which is the size every deck
in `library/slides/` already uses, so a new deck drops straight in beside
the old ones.

Build one deck:

```bash
cd tools/deckgen
node render.js decks/EF-10.js out/EF-10.pdf --png
```

`--png` also drops a PNG per slide in `out/EF-10-png/`, which is how you
check a deck without opening the PDF.

`--banner` also writes the portal tile, `library/banners/<CODE>.jpg`: the
title slide's drawing on the category colour. `build_library.py` leaves
the Robotics & AI banners alone, so this is the only thing that makes them.

Without the full `playwright` package, `npm install --no-save playwright-core`
in this folder is enough: it uses the Google Chrome already installed.

---

## 1. The deck file

```js
module.exports = {
  code:   "EF-10",
  title:  "Talking Chips: I2C, UART and SPI",
  series: "Engineering Foundations",   // prints in the footer
  accent: "teal",                      // chip colour, table rules, title accent
  slides: [ /* ... */ ],
};
```

`accent` is one of `teal red orange blue green purple amber`. Pick by
category, the same way the portal does:

| Category | accent |
|---|---|
| Engineering Foundations (EF) | `orange` |
| Robotics (ROB) | `blue` |
| AI (AI) | `purple` |
| Intelligent Systems (IS) | `teal` |

A single slide can override it with its own `accent`.

## 2. The slide object

```js
{
  kicker: "Objective 2 · I2C",      // small orange handwriting above the title
  title:  "Two wires, many devices",
  tag:    "LEARN",                  // outlined pill, top right
  blocks: [ /* ... */ ],
  bare:   true,                     // no chip, no title block (title + divider slides)
  deco:   false,                    // no edge doodles
  blobs:  [{x,y,w,c}],              // soft background circles
  bodyStyle: "...",                 // inline CSS on the content area
}
```

`tag` is the lesson phase and should be one of `LEARN`, `MAKE`, `TEST`,
`WRAP UP`, or `LEVEL UP`.

## 3. Block types

Every block is `{ t: "<type>", ... }`. Text accepts `**bold**` and
`` `code` ``.

- **box** `{h, icon, text, points[], art, code, color, style}` - the
  white hand-drawn panel with a coloured heading. The workhorse.
- **note** `{l, text, teal}` - the yellow (or pale teal) sticky note, in
  Patrick Hand. Use for a tip, a warning, a "did you know".
- **rows** `{items:[{t, a, icon, color, n}]}` - numbered outlined bars.
  Used for learning aims and for the objective check (where `a` carries
  the "Proof: ..." line). Rows stretch to fill whatever space is left.
- **table** `{cols[], rows[][], color}` - label/value or comparison
  table inside a frame. Coloured headings, dotted row rules, no banding.
- **pills** `{items:[{t,color}]}` - solid rounded tags: duration, group
  size, kit.
- **steps** `{h, items[]}` - a numbered "Do this" list in a box.
- **stripe** `{l, text, color}` - one-line emphasis bar.
- **code** `{text}` - dark navy sketch panel, monospace.
- **art** `{name}` - a doodle from `art.js` on its own.
- **circuit** `{name, h, cap, color}` - a wiring diagram from
  `circuits.js`, in a titled box. Pair it with a **conn** table on the same
  slide: the drawing shows the shape, the table gives the exact pins.
- **conn** `{h, from, to, why, rows[], foot}` - the connection table. Each
  row is one wire: `{ w, a, b, c }` where `w` is the wire colour key
  (`pwr`, `gnd`, `out`, `in`, `mot`, `aux`), `a` is the Arduino side, `b`
  is the module side and `c` says what it carries. The colour dot in the
  first column matches the wire in the drawing, so a student can trace one
  into the other.
- **fig** / **figbox** `{name, h, cap, color}` - a diagram from
  `diagrams.js`, on its own or inside a titled box. Diagrams are drawn at
  roughly 400×230, so give one a column of about 1.25fr beside a column of
  explanation rather than the full slide width, or it floats small in the
  middle.
- **html** `{html}` - raw markup when nothing above fits. Use the
  `.box`, `.note`, `.row`, `.stack`, `.cols c2/c3/c4`, `.split` classes
  so it still matches, and copy the `<svg class="frame">` markup from an
  existing deck for the hand-drawn outline.

  An icon on a box: write the heading as `<h3 ic="chip">` (any name from
  `art.js`, or `icon` on a **box** block). The drawing sits to the left of
  the text as an outline in the box's colour, the way the concept cards in
  the old decks do it. Use it on short concept boxes, not on long ones.

## 4. Slide order

Every deck in the library follows the same arc. Keep it.

1. **Title** - `bare`, series in Patrick Hand, big title with the key words in
   the accent colour, the hook in blue, three pills, a doodle, a
   "did you know" note.
2. **Let's think** - a question before any answer.
3. **Today I will learn to...** - `rows`, one per objective, plus a
   keywords sticky note.
4. - 7. **Teach it** - one idea per slide, each tagged `LEARN`, each
   with a concrete Pakistani example somewhere.
8. **Part 2: Make it** - `bare` divider.
9. - 14. **Build it** - the class game, the kit list, then `Build step
   1 of N`, `2 of N`, `3 of N` with the real sketch beside the
   instructions, then **Test like an engineer**.
15. **Level up** - the extension for whoever finishes early.
16. **Can I really do it? Prove it.** - the objectives again, each with
   a proof the student can show.
17. **Wrap up** - what we learned, what is next.

Aim for 16 to 22 slides. Below 14 the lesson is thin; above 24 it will
not fit a 60 minute class.

## 5. Every build deck needs a wiring slide

Any deck where students wire something gets a **Wiring** slide, placed
after the kit slide and before the first build step. It is always the same
shape: the circuit drawing on the left in a column of about 1.3fr, and the
connection table on the right.

```js
{ tag: "MAKE", kicker: "Wiring", title: "The whole robot, on one page",
  bodyStyle: "display:grid;grid-template-columns:1.3fr 1fr;gap:20px",
  blocks: [
    { t: "circuit", name: "robotCar", color: "green",
      h: "Uno, driver, two motors, one battery", style: "min-height:0" },
    { t: "conn", color: "blue", h: "Connections",
      from: "Arduino Uno", to: "L298N", why: "Carries",
      rows: [
        { w: "out", a: "7", b: "IN1", c: "left motor, direction A" },
        { w: "gnd", a: "GND", b: "GND", c: "the shared reference" },
      ],
      foot: "Battery + to +12V, battery minus to the same GND." },
  ] },
```

A deck with two separate builds, like ROB-06, gets two wiring slides, one
each. Never make students read wiring out of a paragraph.

## 6. Drawing a new circuit

Components come from `comp(x, y, w, name, sub, colour, { left, right })`.
It reserves a header band for the name, lays the pins out below it at a
fixed 20 px pitch, and hands back the exact coordinate of every port as
`L[i]` and `R[i]`. Wires are then drawn from those coordinates, never from
numbers typed in by hand, which is what stops a label landing on a title
when a component changes size. A `null` entry in a pin list leaves a gap,
which is how the power pins are kept clear of the signal pins.

- Route with `wire([...points], colour)` for a path you control, or
  `elbow(a, b, x, colour)` to go horizontal, vertical, horizontal between
  two ports at different heights. **There are no diagonal wires in these
  drawings.**
- Colour says what the wire carries: red 5V, black GND, blue a signal the
  Arduino sends, green one it reads, purple switched motor power, orange a
  second clock or supply. The `conn` table uses the same keys, so the two
  always agree.
- A filled `dot()` means joined. Wires crossing without one are not
  joined. Say this to the class once; it is the convention on every real
  schematic they will ever see.
- Keep the whole drawing inside 560 x 300 and at least 20 units from the
  edge. `comp()` can grow downward, so check the bottom of the tallest
  component rather than assuming.

## 7. Drawing a new diagram

`diagrams.js` builds everything from five helpers: `box`, `line`, `poly`,
`arrow`, `tx` (labels) and `hand` (Patrick Hand annotations). Every figure is
wrapped by `S(w, h, body)`, which applies the `#rai-rough` filter, so it
comes out looking drawn rather than plotted.

Rules that keep them readable:

- Keep labels at least 20 units inside the edge. The rough filter pushes
  strokes outward and the viewport will clip a descender.
- Annotate with `hand()`, not more boxes. One handwritten line explaining
  *why* is worth three more rectangles.
- Colour means something: red for the thing that breaks, green for the
  working path, muted grey for axes and reference lines.
- A diagram should survive being printed in black and white. Do not let
  colour alone carry the meaning.

## 8. House rules

- The footer is fixed: `Robotics & AI Club · <series> · Curriculum by
  Qasim Mushtaq`, with `n / total` on the right. `render.js` writes it.
- No em dashes anywhere in slide text.
- Every build slide carries code the student can actually type. No
  pseudocode, no `// your code here`.
- Every concept gets a local example: Metro fare machines, a kiryana
  shop scale, Jinnah Avenue LED boards, load shedding, a UPS.
- Doodles sit in the same seven places on every slide. Do not move them
  per slide; that is what makes the decks feel like one set.
- Nothing is allowed to spill past the content area. `render.js` runs an
  autofit pass that shrinks code blocks and then the whole slide, and
  prints `still overflowing: <slide numbers>` if it loses. If you see
  that line, cut words rather than shrink further.

## 9. After the PDF is built

1. Build it with `--banner`, then put it at
   `Documents/Robotics Curriculum/Presentations/<Category>/<CODE>_<Title>_Slides.pdf`
2. `python3 tools/build_library.py`
3. Add the video links to `videos.js`
4. Write the teacher guide into `library/guides/` and register it in
   `window.RAI.guides` in `rai/catalog.js`
5. `python3 tools/bump_version.py portal`
6. Commit

## 10. Knowledge first

These are teaching decks, not summary decks. A slide that only lists what
is coming is a wasted slide. Every LEARN slide should leave the student
knowing something they did not know, and most of them should carry a
number, a diagram or a worked example:

- Say why, not just what. "An Arduino pin gives 20 mA and a motor wants
  250 mA" beats "you need a motor driver".
- Put the real figures in. Addresses, baud rates, step counts, currents,
  tick counts. Students remember numbers they have used.
- Include the failure. What it looks like when it goes wrong is usually
  more memorable than what it looks like when it works, and the
  troubleshooting table on the TEST slide is where that lives.
- Build the lesson so each objective gets one or two slides of teaching
  before the build steps ask for it.
- Draw it rather than describe it. A bus, a bridge, a response curve or a
  wiring run is clearer as a picture, and a picture beside a table of exact
  pins is clearer than either on its own.
