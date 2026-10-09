# Robotics & AI Club: Lab Planner

A small website for planning Robotics & AI Club sessions at Pak-Turk Maarif and printing the hardware list for each day.
It is plain HTML, CSS and JavaScript: no server, no build step, no login.

## What it does

- **Home**: this week at a glance and the next classes to plan for each age group.
- **Little Explorers / Junior Makers / Young Innovators / Tech Leaders**: activity cards by phase. Tap a card, choose a day, set the number of groups. Done.
- **Swap or borrow**: in any session, tap another age group to give the activity to them (same day and time), or use *Swap with another group's session*. On a group page, *Add from another group* borrows any activity. Borrowed activities share the original kit.
- **Timetable**: Monday to Friday. Tap a session to change it, or print one day's kit.
- **Print lists**: per session, per day or whole week. Print or save as PDF for the lab.
- **Kits & parts**: change the parts of any activity, add new parts.
- **Settings**: default groups (8), your name on printouts, backup and session log.

Use the arrows in the sidebar to move between weeks.

## Put it on GitHub Pages

1. On github.com, create a new repository, for example `lab-planner` (Public).
2. Click **Add file → Upload files** and drag in the 5 files in this folder (`index.html`, `styles.css`, `app.js`, `data.js`, `README.md`). Click **Commit changes**.
3. Go to **Settings → Pages**. Under *Build and deployment*, choose **Deploy from a branch**, branch **main**, folder **/ (root)**, then **Save**.
4. After a minute or two the site is live at `https://cassimhossain.github.io/lab-planner/`.

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
