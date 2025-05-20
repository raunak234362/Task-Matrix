/* eslint-disable prettier/prettier */
/* eslint-disable no-unused-vars */
const { contextBridge, ipcRenderer } = require("electron");
require("@electron-toolkit/preload");

contextBridge.exposeInMainWorld("electron", {
  ipcRenderer: {
    send: (channel, data) => {
      const validChannels = ["show-notification", "install_update"];
      if (validChannels.includes(channel)) {
        ipcRenderer.send(channel, data);
      }
    },
    on: (channel, func) => {
      const validChannels = ["update_available", "update_downloaded"];
      if (validChannels.includes(channel)) {
        ipcRenderer.on(channel, (event, ...args) => func(...args));
      }
    }
  },
  // Optional: cleaner alias if you prefer `electronAPI` pattern
  update: {
    onUpdateAvailable: (callback) => ipcRenderer.on("update_available", callback),
    onUpdateDownloaded: (callback) => ipcRenderer.on("update_downloaded", callback),
    installUpdate: () => ipcRenderer.send("install_update")
  }
});

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
// if (process.contextIsolated) {
//   try {
//     contextBridge.exposeInMainWorld('electron', electronAPI)
//     contextBridge.exposeInMainWorld('api', api)
//   } catch (error) {
//     console.error(error)
//   }
// } else {
//   window.electron = electronAPI
//   window.api = api
// }
