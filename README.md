# Robotics & AI Club

The club's planning platform for Pak-Turk Maarif: plan sessions for each age group, present the slides in class, and print the hardware lists for the lab.
It is plain HTML, CSS and JavaScript. There is no server, no build step and no login.

## Pages

- **Home**: a **Student / Teacher** switch at the top. Students pick their group once and see the next lesson, the one they left half way, and their progress. Teachers see today's session with the parts to pack, then the dashboard for the planning week. It shows the next session with a Present button, the week board, students and parts totals, the pack list, things that need attention (sessions without a day, sessions without slides, backups) and progress for each age group.
- **Curriculum**: coloured tabs for Foundation, Little Explorers, Junior Makers, Young Innovators and Tech Leaders, plus **Plans & documents**. Tap a presentation to open it full screen. Move with the arrow keys or space, by tapping the sides, or by swiping on a phone. Press F for full screen.
- **Hardware**: the same coloured tabs plus **This week**. Each activity is a card with its parts and totals.
- **Age group pages**: activity cards by phase, or the whole track as a **Roadmap**. Filter by topic, level (Starter, Core, Advanced) or a part from the kit. Filters stay in the address, so a filtered page can be shared.
- **Lesson sheet** (tap any activity): slides and video at the top, then the goal, what you need (with **Copy list**), the matching simulator, and any steps, challenge and questions. Students tick **I've finished this lesson**. Teachers plan the session in the **Plan this session** panel: day, age group, move or swap, groups, time and notes.
- **Timetable** and **Print lists**: the week from Monday to Friday, and kit lists per session, per day or for the whole week.
- **Search**: press **Ctrl K** (or **/**) anywhere. It finds activities by code, title, topic, unit, description or any part in the kit (try "servo"), plus presentations, documents, parts and pages, and remembers recent searches.
- **Circuit Lab** (`circuit/`): build Arduino and ESP32 circuits on a canvas, write the sketch and run it in the browser. Ready-made circuits for every lesson, a schematic view, a multimeter and a logic scope. Installable as its own app and works offline; only compiling needs the internet.
- **Code Lab** (`codelab/`): six languages in the browser. Python (Pyodide), C++ (g++ online), Python turtle graphics (Skulpt), p5.js, Processing and web pages (HTML, CSS and JavaScript with a live preview). Every one except Python and C++ runs with no internet.

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

## Study Buddy (for teachers)

The robot button on every page opens **Study Buddy**, a helper students can ask about circuits, code, robots, AI and any club lesson. By default it answers from our own lessons, parts list and the glossary in `buddy/glossary.js`, in the browser, with nothing sent anywhere.

- **What it says:** edit `buddy/system-prompt.txt` (teaching style, safety rules, topics) and `buddy/glossary.js` (definitions). Push, and the change is live.
- **AI answers (optional):** deploy the free Cloudflare Worker in `chatbot-proxy/` (see its README), then set `backend: "worker"` and `workerUrl` in `buddy/config.js`. Check Cloudflare's current free limits first. The Worker limits each tab to 20 questions per 10 minutes and the whole club to 300 a day; when either runs out, or the free AI allowance does, Study Buddy quietly uses its built-in answers instead. The free plan can't create a bill.
- **Privacy:** questions are capped at 600 characters, messages that look like a phone number, email, address or password are blocked before sending, and a student's code is only sent when they press "Explain this error" or "Help with my code". The chat is saved only in that browser (`rac-chat-v1`), with a Clear button.
- **Turn it off:** `enabled: false` in `buddy/config.js` hides it everywhere. To stop only the AI, set `BUDDY_OFF` to `1` in the Worker, or `backend: "local"`.

## Where your data is saved

Your plan is saved **in the browser you use** (local storage, key `rac-lab-planner-v1`), not on GitHub. Use **Settings → Download backup** every Friday. The home page reminds you when a backup is older than a week.

A student's progress (finished lessons, their group, the slide they stopped on, recent searches) and the Student / Teacher choice are kept separately under `rac-progress-v1`, on that device only. The light / dark choice is `rac-theme-v1`. Neither is part of the plan backup.

**Note:** the repository is public, so anyone with the link can open everything in `library/`, including the INTERNAL plans and the requisitions.

## Files

| File | What it is |
|---|---|
| `index.html`, `styles.css`, `app.js` | The site |
| `data.js` | Activities, kits and parts catalog |
| `library.js` | List of presentations and documents (generated) |
| `library/slides`, `library/docs`, `library/thumbs` | Presentation PDFs, documents, cover images |
| `tools/build_library.py` | Syncs `library/` from the Robotics Curriculum folder |
| `circuit/` | Circuit Lab: the circuit editor and simulator |
| `codelab/` | Code Lab: the six-language editor |
| `buddy/` | Study Buddy: settings, glossary, teacher prompt, chat panel |
| `chatbot-proxy/` | Optional free Cloudflare Worker for Study Buddy's AI answers |

Curriculum and platform by Qasim Mushtaq, MS Robotics and AI.
