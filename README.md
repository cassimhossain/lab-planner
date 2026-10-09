# Robotics & AI Club: Lab Planner

A small website for planning Robotics & AI Club sessions at Pak-Turk Maarif and printing the hardware list for each day.
It is plain HTML, CSS and JavaScript: no server, no build step, no login.

## What it does

- **Dashboard**: sessions planned this week, a Monday to Friday strip, and the next classes for each age group (tap a day to plan them).
- **Little Explorers / Junior Makers / Young Innovators / Tech Leaders**: one tab per age group. Every activity in a table (Foundation, Phase 1, Phase 2) with status, day, groups, time, section and its kit.
- **This Week**: the timetable. Move a session to another day or remove it.
- **Kit Lists**: printable lists per session, per day (combined) or for the whole week. Filter by day, then Print / Save as PDF.
- **Kits**: edit the parts of any activity and add new parts to the catalog.
- **Settings**: default groups (8), your name for printouts, backup download / load, CSV session log.

Use the arrows at the top right to move between weeks.

## Put it on GitHub Pages

1. On github.com, create a new repository, for example `lab-planner` (Public).
2. Click **Add file → Upload files** and drag in the 5 files in this folder (`index.html`, `styles.css`, `app.js`, `data.js`, `README.md`). Click **Commit changes**.
3. Go to **Settings → Pages**. Under *Build and deployment*, choose **Deploy from a branch**, branch **main**, folder **/ (root)**, then **Save**.
4. After a minute or two the site is live at `https://YOUR-USERNAME.github.io/lab-planner/`.

## Important: where your data is saved

Your plan is saved **in the browser you use** (local storage), not on GitHub.
- Another computer, another browser, or clearing browsing data will show an empty plan.
- Use **Settings → Download backup** every Friday, and **Load backup** on another device.
- The curriculum and original kits live in `data.js`. Your own changes are stored separately, so updating `data.js` never deletes your plan.

## Files

| File | What it is |
|---|---|
| `index.html` | The page |
| `styles.css` | The look and the print layout |
| `app.js` | All the logic |
| `data.js` | Activities, kits and parts catalog (generated from the curriculum plan) |

Curriculum and planner by Qasim Mushtaq, MS Robotics and AI.
