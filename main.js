const { app, BrowserWindow, ipcMain } = require('electron')
if (require('electron-squirrel-startup')) app.quit();
const { selectFolder, createProposal, openPath } = require('./file-system-features/select-target-folder')
const { getAppSettings, setCorrelativeIdSetting } = require('./database/main')
const path = require('node:path')

const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    autoHideMenuBar: true,
    icon: path.join(__dirname, 'tomato_16822.ico'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  })

  win.loadFile('index.html')

  if (!app.isPackaged) win.webContents.openDevTools()
  if (!app.isPackaged) win.setFullScreen(true)
}

app.whenReady().then(() => {
  ipcMain.handle('select-folder', selectFolder)
  ipcMain.handle('get-settings', getAppSettings)
  ipcMain.handle('create-proposal', createProposal)
  ipcMain.handle('open-path', openPath)
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

