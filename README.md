# Robotics & AI Club: Lab Planner

A small website for planning Robotics & AI Club sessions at Pak-Turk Maarif and printing the hardware list for each day.
It is plain HTML, CSS and JavaScript: no server, no build step, no login.

## What it does

1. **Plan**: all 145 activities (Foundation F-00 to F-03, Phase 1 and Phase 2 for all four age groups, plus the JM-00 Art Bot). Tap a day (M T W T F) on a card to mark it for next week. Set the number of groups (pairs), time and section.
2. **Next week**: the week at a glance, Monday to Friday.
3. **Kit lists**: three printable lists:
   - *Day by day, per session*: one block per session, in the kit format (Code, Category, Component, Qty, Basis, Type, Notes, Total, Packed).
   - *Day by day, combined*: everything needed on each day, added together.
   - *Whole week request*: reusable parts = most needed on one day, consumables = week total.
   Press **Print / Save as PDF** and choose "Save as PDF" in the print dialog.
4. **Kits**: change any activity's kit, add parts, or add brand-new parts to the catalog.
5. **Settings**: default groups (8), your name for the printouts, backup download / load, CSV session log.

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
