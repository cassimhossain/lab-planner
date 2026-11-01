# Robotics Club Lab: the desktop app

The whole site (portal, lessons, Circuit Lab, Code Lab, Study Buddy, attendance) as an app for Mac and Windows.

- **Online**, every page comes from the live site, so the app is always up to date. Nothing to reinstall when the site changes.
- **Offline**, it uses the copy of the site packed inside the app: the portal, lessons and slides, Circuit Lab (except compiling, which needs the internet), and the Code Lab languages that run offline. Study Buddy's AI, the Google Sheet, C++, Python's first download and videos wait for a connection, as on the website.
- Saved work (the plan, progress, attendance copy, circuits, code) is kept by the app itself, separately from your web browser. Move the plan across with **Settings & backup → Download / Load backup**, and connect attendance to the Google Sheet again (URL and PIN).
- **Go** menu: Portal (Ctrl/Cmd+1), Circuit Lab (2), Code Lab (3), Back and Forward.

## Installing

- **Mac:** open `Robotics-Club-Lab-1.0.0-mac-arm64.dmg` (Apple Silicon: M1 and later) or `…-mac-x64.dmg` (older Intel Macs) and drag the app to Applications. The app isn't signed with a paid Apple developer ID, so the first time macOS may refuse to open it: open **System Settings → Privacy & Security**, scroll down and press **Open Anyway**.
- **Windows:** run `Robotics-Club-Lab-1.0.0-win-x64.exe`. The installer isn't signed, so Windows SmartScreen may say "Windows protected your PC": press **More info → Run anyway**. It adds a desktop and Start menu shortcut, and uninstalls from Settings → Apps.

## Building it again

Needs Node.js (`brew install node` on a Mac). From this folder:

```bash
npm install
npm run mac   # dist/…-mac-arm64.dmg and …-mac-x64.dmg
npm run win   # dist/…-win-x64.exe
npm start     # try it without building
```

Rebuild when you want the offline copy refreshed (online, the app already shows the latest site). Raise `version` in `package.json` first so the new installer has a new name.
