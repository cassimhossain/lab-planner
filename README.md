# Robotics & AI Club

The club's planning platform for Pak-Turk Maarif: plan sessions for each age group, present the slides in class, and print the hardware lists for the lab.
It is plain HTML, CSS and JavaScript. There is no server, no build step and no login.

## Pages

- **Home**: a **Student / Teacher** switch at the top. Students pick their group once and see the next lesson, the one they left half way, and their progress. Teachers see attendance for each group, the four learning pathways, the virtual labs and the lab pages.
- **Attendance** (teachers): import the club's Excel class list once (only the Name and Class columns are read). **Take attendance** shows the group (with "Class 3 of 16"), the date, a box for the lesson (type it, or pick from the curriculum) and the whole class as tiles: everyone starts present, tap a name to mark them absent, then Save. **Students & history** has the classes so far (open one to change it) and each student's attendance. **Google Sheet** connects a Google Sheet you own as the register, so it is the same on every computer and you can edit it like any spreadsheet; see [attendance-sheet/README.md](attendance-sheet/README.md). Without a sheet, attendance stays in the browser, with a backup file and an Excel export.
- **Curriculum**: coloured tabs for Foundation, Little Explorers, Junior Makers, Young Innovators and Tech Leaders, plus **Plans & documents**. Tap a presentation to open it full screen. Move with the arrow keys or space, by tapping the sides, or by swiping on a phone. Press F for full screen.
- **Hardware**: the same coloured tabs plus **This week**. Each activity is a card with its parts and totals.
- **Age group pages**: activity cards by phase, or the whole track as a **Roadmap**. Filter by topic, level (Starter, Core, Advanced) or a part from the kit. Filters stay in the address, so a filtered page can be shared.
- **Lesson sheet** (tap any activity): slides and video at the top, then the goal, what you need (with **Copy list**), the matching simulator, and any steps, challenge and questions. Students tick **I've finished this lesson**. Teachers plan the session in the **Plan this session** panel: day, age group, move or swap, groups, time and notes.
- **Timetable** and **Print lists**: the week from Monday to Friday, and kit lists per session, per day or for the whole week.
- **Search**: press **Ctrl K** (or **/**) anywhere. It finds activities by code, title, topic, unit, description or any part in the kit (try "servo"), plus presentations, documents, parts and pages, and remembers recent searches.
- **Circuit Lab** (`circuit/`): build Arduino and ESP32 circuits on a canvas, write the sketch and run it in the browser. Ready-made circuits for every lesson, a schematic view, a multimeter and a logic scope. Installable as its own app and works offline; only compiling needs the internet.
- **Code Lab** (`codelab/`): six languages in the browser. Python (Pyodide), C++ (g++ online), Python turtle graphics (Skulpt), p5.js, Processing and web pages (HTML, CSS and JavaScript with a live preview). Every one except Python and C++ runs with no internet.

Three links to share:

| Link | Opens |
|---|---|
| `https://cassimhossain.github.io/lab-planner/` | The whole portal, for teachers |
| `https://cassimhossain.github.io/lab-planner/circuit/` | Circuit Lab on its own: no Portal button, so students stay in the lab |
| `https://cassimhossain.github.io/lab-planner/codelab/` | Code Lab on its own, the same way |

Opened from inside the portal, the labs get their way back (the ← arrow, and the Portal button in Circuit Lab), for the rest of that browser tab. The portal adds `?from=portal` to its lab links for this. The site is public, so this keeps students focused rather than locking anything.

Use the arrows in the top bar to change the planning week.

## Adding new presentations

1. Save the PDF in `Documents/Robotics Curriculum/Presentations/<age group folder>/`, named like `JM-10_Some_Title_Slides.pdf`.
2. In this folder, run:
   ```
   python3 tools/build_library.py
   git add -A
   git commit -m "Add new presentations"
   git push
   ```
`build_library.py` copies new or changed PDFs into `library/`, makes the cover images and rebuilds `library.js`.
Cover images need poppler (`brew install poppler`).

## After changing any file

Browsers keep old copies of the site's files, so every file is loaded with a version number (`?v=38`). After editing, bump them all at once:

```
python3 tools/bump_version.py --dry-run   # see what would change
python3 tools/bump_version.py             # portal, Circuit Lab and Code Lab
python3 tools/bump_version.py portal      # or just one
```

## Adding steps, a challenge or questions to a lesson

The lesson sheet shows three extra sections when an activity in `data.js` has these optional fields. Leave them out and the sections don't appear.

```json
{
  "code": "LE-07",
  "title": "Plant Water Alarm",
  "steps": ["Push the sensor into the soil.", "Wire it to A0 and the buzzer to pin 8.", "Upload the sketch and water the plant."],
  "challenge": "Make the LED blink faster as the soil gets drier.",
  "check": [
    { "q": "Why does dry soil give a different reading?", "a": "Water conducts electricity, so wet soil lets more current through." }
  ]
}
```

`goal` is optional too: when it is missing, the goal is the activity's `about` line.

## Weekly planning (switched off)

The weekly timetable, "this week" panels, print lists and planned/taught counts are hidden for now, because the portal has no shared database and the club isn't planning weeks here. Nothing was deleted: set `const WEEK = true;` near the top of `app.js` to bring it all back. Attendance can already be kept across devices in a Google Sheet (see above); a shared database could later do the same for progress.

## Study Buddy (for teachers)

The robot button on every page opens **Study Buddy**, an AI tutor students can ask about components, wiring, code, errors, robotics and AI. It needs the free AI Worker in `chatbot-proxy/` to answer properly; without it, it falls back to a basic offline helper (the glossary and wiring guides in `buddy/glossary.js`).

- **What it says:** edit `buddy/system-prompt.txt` (teaching style, safety rules, topics) and `buddy/glossary.js` (definitions and the wiring guides for each module). Push, and the change is live.
- **AI answers (recommended):** set up the free Worker in `chatbot-proxy/`, about 10 minutes in the Cloudflare dashboard. It can use Cloudflare's own AI (no key) or Google Gemini's free tier (key kept as a secret in Cloudflare); its README compares them, including Gemini's age terms. Then set `backend: "worker"` and `workerUrl` in `buddy/config.js`. Check Cloudflare's current free limits first. The Worker limits each tab to 20 questions per 10 minutes and the whole club to 300 a day; when either runs out, or the free AI allowance does, Study Buddy quietly uses its built-in answers instead. The free plan can't create a bill.
- **Its knowledge library (like NotebookLM):** `buddy/knowledge.js` is built from the documents in the `knowledge/` folder: the club's knowledge base (`robotics-ai-knowledge-base.md`, every component, activity, wiring, code pattern and troubleshooting step) plus any PDFs, Markdown or text files you add. Add `--with-slides` to the tool to include the slide decks too. With each question, the best-matching passages go to the AI as quiet background, and if neither AI model can be reached, Study Buddy answers from them. Students never see sources mentioned. After adding or editing documents, run `python3 tools/build_knowledge.py` and push (reading PDFs needs a Mac). The site is public, so only add documents that are fine to publish.
- **Answer style:** natural, like a teacher talking (no headings, bold, tables or dash bullets). Change it in `buddy/system-prompt.txt`.
- **Privacy:** questions are capped at 600 characters, messages that look like a phone number, email, address or password are blocked before sending, and a student's code is only sent when they press "Explain this error" or "Help with my code". The chat is saved only in that browser (`rac-chat-v1`), with a Clear button.
- **Turn it off:** `enabled: false` in `buddy/config.js` hides it everywhere. To stop only the AI, set `BUDDY_OFF` to `1` in the Worker, or `backend: "local"`.

## Where your data is saved

Your plan is saved **in the browser you use** (local storage, key `rac-lab-planner-v1`), not on GitHub. Use **Settings → Download backup** every Friday. The home page reminds you when a backup is older than a week.

A student's progress (finished lessons, their group, the slide they stopped on, recent searches) and the Student / Teacher choice are kept separately under `rac-progress-v1`, on that device only. Attendance and the student list are under `rac-attendance-v1` (a copy of the Google Sheet when one is connected; its address and PIN under `rac-attendance-sheet-v1`), with their own **Download backup** on the Attendance page: student names are never written into the website's files. The light / dark choice is `rac-theme-v1`. Neither is part of the plan backup.

**Note:** the repository is public, so anyone with the link can open everything in `library/`, including the INTERNAL plans and the requisitions.

## Files

| File | What it is |
|---|---|
| `index.html`, `styles.css`, `app.js` | The site |
| `data.js` | Activities, kits and parts catalog |
| `library.js` | List of presentations and documents (generated) |
| `library/slides`, `library/docs`, `library/thumbs` | Presentation PDFs, documents, cover images |
| `tools/build_library.py` | Syncs `library/` from the Robotics Curriculum folder |
| `tools/bump_version.py` | Bumps every `?v=` version string together |
| `tools/build_knowledge.py` | Builds Study Buddy's knowledge library from the slides and `knowledge/` PDFs |
| `tokens.css`, `theme.js`, `fonts/` | Shared colours, type and light / dark theme for all three apps |
| `circuit/` | Circuit Lab: the circuit editor and simulator |
| `codelab/` | Code Lab: the six-language editor |
| `buddy/` | Study Buddy: settings, glossary, teacher prompt, chat panel |
| `chatbot-proxy/` | Optional free Cloudflare Worker for Study Buddy's AI answers |

Curriculum and platform by Qasim Mushtaq, MS Robotics and AI.
