# Attendance in a Google Sheet (free)

The portal's Attendance page can keep its register in a Google Sheet you own, so it is the same on every computer and phone, and you can open and edit the register like any spreadsheet. Without this, attendance is saved only in the browser you use.

Student names live only in your Sheet and in the browsers you connect. They are never written into this website's files. The Sheet can only be read or changed with your teacher PIN.

## Set it up (about 10 minutes, once)

1. Open **sheets.google.com** and make a blank spreadsheet. Name it, for example, "Robotics Club attendance".
2. In the Sheet: **Extensions → Apps Script**. Delete what is there, paste the whole of `attendance-sheet/Code.gs` from this repo, and press **Save**.
3. Back in the Sheet, reload the page. A **Club attendance** menu appears. Choose **Club attendance → Set the teacher PIN** and pick a PIN (Google asks you to allow the script the first time: choose your account, then **Advanced → Go to … (unsafe) → Allow**. It is your own script, and that is Google's standard warning for scripts that aren't published).
4. Choose **Club attendance → Set up or tidy the sheet**. The Students, Settings and three group tabs appear.
5. In Apps Script: **Deploy → New deployment → Select type: Web app**.
   - Execute as: **Me**
   - Who has access: **Anyone**

   Press **Deploy** and copy the **Web app URL** (it ends in `/exec`).
   "Anyone" only lets the portal reach the script; without your PIN it shows nothing.
6. On the portal: **Attendance → Google Sheet**, paste the URL, type your PIN and press **Connect**. If this browser already has attendance and the Sheet is empty, it offers to send it to the Sheet.

On any other computer, do step 6 only.

## Using it

- Mark attendance on the portal: it saves to the Sheet straight away. Without internet, it keeps the marks in the browser and sends them next time.
- Or edit the Sheet directly: P or A in a cell, a lesson name, a date. The portal picks up your changes the next time it opens Attendance.
- Add or rename students, or change their group, on the **Students** tab. Change the number of planned classes on the **Settings** tab.
- Don't rename the group tabs or move the hidden ID row and column: the portal uses them to match students and classes.

## If you change Code.gs later

In Apps Script: **Deploy → Manage deployments → ✏️ → Version: New version → Deploy**. The URL stays the same.

## Turning it off

On the portal: **Attendance → Google Sheet → Disconnect**. The register stays in your Sheet, and a copy stays in that browser.
