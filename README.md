# Robotics & AI Club

The club's planning platform for Pak-Turk Maarif: plan sessions for each age group, present the slides in class, and print the hardware lists for the lab.
It is plain HTML, CSS and JavaScript. There is no server, no build step and no login.

## Pages

- **Home**: dashboard for the planning week. It shows the next session with a Present button, the week board, students and parts totals, the pack list, things that need attention (sessions without a day, sessions without slides, backups) and progress for each age group.
- **Curriculum**: coloured tabs for Foundation, Little Explorers, Junior Makers, Young Innovators and Tech Leaders, plus **Plans & documents**. Tap a presentation to open it full screen. Move with the arrow keys or space, by tapping the sides, or by swiping on a phone. Press F for full screen.
- **Hardware**: the same coloured tabs plus **This week**. Each activity is a card with its parts and totals.
- **Age group pages**: activity cards by phase. Tap one to plan it.
- **Session sheet** (tap any session or activity): the presentation is at the top, then the day, the age group and the hardware list. You can also move or swap the session to another age group from here.
- **Timetable** and **Print lists**: the week from Monday to Friday, and kit lists per session, per day or for the whole week.
- **Search**: press **Ctrl K** (or **/**) anywhere to find any activity, presentation, document or page.

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

## Where your data is saved

Your plan is saved **in the browser you use** (local storage), not on GitHub. Use **Settings → Download backup** every Friday. The home page reminds you when a backup is older than a week.

**Note:** the repository is public, so anyone with the link can open everything in `library/`, including the INTERNAL plans and the requisitions.

## Files

| File | What it is |
|---|---|
| `index.html`, `styles.css`, `app.js` | The site |
| `data.js` | Activities, kits and parts catalog |
| `library.js` | List of presentations and documents (generated) |
| `library/slides`, `library/docs`, `library/thumbs` | Presentation PDFs, documents, cover images |
| `tools/build_library.py` | Syncs `library/` from the Robotics Curriculum folder |

Curriculum and platform by Qasim Mushtaq, MS Robotics and AI.
