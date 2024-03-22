const { app, BrowserWindow, ipcMain } = require('electron')
const { dialog } = require('electron')
const path = require('node:path')

const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  })

  win.loadFile('index.html')
}

const selectFolder = () => {
  const selectedPath = dialog.showOpenDialog({
    properties: ['openDirectory', 'dontAddToRecent'],
    title: "Selecciona la carpeta de destino para las propuestas",
  }).then(result => {
    if (!result.canceled) {
      const folderPath = result.filePaths[0];
      // Here you can record/store the folderPath as needed
      console.log('Selected folder:', folderPath);
      return ('Selected folder:', folderPath);
    }
  }).catch(err => {
    console.error(err);
  });
  // console.log(selectedPath);
  // return '1'
}

app.whenReady().then(() => {
  ipcMain.handle('ping', () => 'pong')
  ipcMain.handle('select-folder', selectFolder)
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