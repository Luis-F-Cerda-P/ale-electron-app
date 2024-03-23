const { app, BrowserWindow, ipcMain } = require('electron')
const { selectFolder } = require('./file-system-features/select-target-folder')
const getPath = (string) => app.getPath(string)
module.exports = { getPath };
const { getDefaultFolderSetting, db } = require('./database/main')
const path = require('node:path')



// console.log(userDataPath);
// console.log(myDocumentsPath);
// const userSettings = () => getAppSettings(db)
//   .then(appSettings => {
//     // Use appSettings here
//     // console.log(appSettings)
//     return appSettings  
//   })
//   .catch(err => {
//     // Handle error
//     console.error('Error fetching app settings:', err);
//   });

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
  ipcMain.handle('get-settings', getDefaultFolderSetting)
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

