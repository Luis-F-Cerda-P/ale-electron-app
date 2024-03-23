const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('settings', {
  select: () => ipcRenderer.invoke('select-folder'),
  defaultFolder: () => ipcRenderer.invoke('get-settings'),
})