/* eslint-disable prettier/prettier */
/* eslint-disable no-unused-vars */
import { contextBridge, ipcRenderer, Notification } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

// Custom APIs for renderer
const api = {
  showNotification: (task) => {
    console.log('Received task in preload:', task);
    ipcRenderer.send('show-notification', task);
  },
}
contextBridge.exposeInMainWorld('electron', {
  ipcRenderer: {
    send: (channel, data) => {
      const validChannels = ['show-notification']
      if (validChannels.includes(channel)) {
        ipcRenderer.send(channel, data)
      }
    }
  },
  update: {
    onUpdateAvailable: (callback) => ipcRenderer.on('update-available', callback),
    onUpdateDownloaded: (callback) => ipcRenderer.on('update-downloaded', callback),
    installUpdate: () => ipcRenderer.send('restart_app')
  }
})
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
