const { app, BrowserWindow, ipcMain } = require('electron')
const { selectFolder, createProposal } = require('./file-system-features/select-target-folder')
const { getDefaultFolderSetting } = require('./database/main')
const path = require('node:path')

const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    icon: path.join(__dirname, 'tomato_16822.ico'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  })

  win.loadFile('index.html')

  if (!app.isPackaged) win.webContents.openDevTools()
}

app.whenReady().then(() => {
  ipcMain.handle('select-folder', selectFolder)
  ipcMain.handle('get-settings', getDefaultFolderSetting)
  ipcMain.handle('create-proposal', createProposal)
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

