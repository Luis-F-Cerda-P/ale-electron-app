const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('settings', {
  select: () => ipcRenderer.invoke('select-folder'),
  allSettings: () => ipcRenderer.invoke('get-settings'),
  createProposal: (formData) => ipcRenderer.invoke('create-proposal', formData),
})