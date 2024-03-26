const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('settings', {
  select: () => ipcRenderer.invoke('select-folder'),
  openPath: (folderPath) => ipcRenderer.invoke('open-path', folderPath),
  allSettings: () => ipcRenderer.invoke('get-settings'),
  createProposal: (formData) => ipcRenderer.invoke('create-proposal', formData),
})