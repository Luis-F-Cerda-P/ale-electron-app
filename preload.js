const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('settings', {
  select: () => ipcRenderer.invoke('select-folder'),
  all: () => ipcRenderer.invoke('get-settings'),
})