/* What the site's pages can ask of the app. In a normal browser none of this
   exists, so the pages check for window.BotBench before using it. */
const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("BotBench", {
  app: true,
  /* the app answers Circuit Lab's compile requests itself when offline */
  compilesOffline: true,
  /* BotBench Labs keeps both labs open: switch without reloading */
  showLab: lab => ipcRenderer.send("show-lab", lab),
});
