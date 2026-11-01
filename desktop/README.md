# Desktop apps

Two installable apps built from the same code:

- **BotBench** (Mac, for teachers): the whole site: portal, lessons, Circuit Lab, Code Lab, Study Buddy, attendance.
- **BotBench Labs** (Windows, for students): Circuit Lab and Code Lab, each with Study Buddy. It opens in Circuit Lab; the **Labs** menu switches between the two (Ctrl+1, Ctrl+2). It can't reach the portal or the curriculum, and only the two labs' files are packed inside it.

- **Online**, every page comes from the live site, so the app is always up to date. Nothing to reinstall when the site changes.
- **Offline**, it uses the copy of the site packed inside the app: the portal, lessons and slides, Circuit Lab (except compiling, which needs the internet), and the Code Lab languages that run offline. Study Buddy's AI, the Google Sheet, C++, Python's first download and videos wait for a connection, as on the website.
- Saved work (the plan, progress, attendance copy, circuits, code) is kept by the app itself, separately from your web browser. Move the plan across with **Settings & backup → Download / Load backup**, and connect attendance to the Google Sheet again (URL and PIN).
- **Go** menu: Portal (Ctrl/Cmd+1), Circuit Lab (2), Code Lab (3), Back and Forward.

## Installing

- **Mac:** open `BotBench-1.1.0-mac-arm64.dmg` (Apple Silicon: M1 and later) and drag the app to Applications. The app isn't signed with a paid Apple developer ID, so the first time macOS may refuse to open it: open **System Settings → Privacy & Security**, scroll down and press **Open Anyway**.
- **Windows:** run `BotBench-Labs-1.1.0-win-x64.exe`. The installer isn't signed, so Windows SmartScreen may say "Windows protected your PC": press **More info → Run anyway**. It adds a desktop and Start menu shortcut, and uninstalls from Settings → Apps.

## Building it again

Needs Node.js (`brew install node` on a Mac). From this folder, once:

```bash
npm install
```

The build tool's own download of Electron can stall on a slow connection, so download Electron once with curl into `electron-zips/` (`electron-v45.2.1-darwin-arm64.zip` and `electron-v45.2.1-win32-x64.zip` from github.com/electron/electron/releases) and build from there:

```bash
npm run site && npx electron-builder --mac dir --arm64 -c.electronDist=electron-zips   # the Mac app in dist/mac-arm64
npm run win -- -c.electronDist=electron-zips                                           # dist/BotBench-Labs-1.1.0-win-x64.exe
```

The Mac `.dmg` is made from `dist/mac-arm64` with `hdiutil create` (a folder holding the app and a link to /Applications). `LAB_OFFLINE=1` opens a built app as if there were no internet, to check the packed copy.

Rebuild when you want the offline copy refreshed (online, the apps already show the latest site). Raise `version` in `package.json` first so the new installer has a new name.
