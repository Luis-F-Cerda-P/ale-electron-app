const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('versions', {
  select: () => ipcRenderer.invoke('select-folder'),
  defaultPath: () => ipcRenderer.invoke('get-settings'),
})