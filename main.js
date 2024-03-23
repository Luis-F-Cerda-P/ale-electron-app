const { app, BrowserWindow, ipcMain } = require('electron')
const { selectFolder } = require('./file-system-features/select-target-folder')
const { createDbIfNotExists, getAppSettings } = require('./database/main')
// const { createDbIfNotExists } = require('./database/main')
const path = require('node:path')
const userDataPath = app.getPath('userData');
const dbPath = path.join(userDataPath, 'your_database.db');
const db = createDbIfNotExists(dbPath, userDataPath)

const userSettings = () => getAppSettings(db)
  .then(appSettings => {
    // Use appSettings here
    console.log(appSettings)
    return appSettings
  })
  .catch(err => {
    // Handle error
    console.error('Error fetching app settings:', err);
  });

const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  })

  win.loadFile('index.html')

  if (!app.isPackaged) win.webContents.openDevTools()
}

app.whenReady().then(() => {
  ipcMain.handle('select-folder', selectFolder)
  ipcMain.handle('get-settings', userSettings)
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