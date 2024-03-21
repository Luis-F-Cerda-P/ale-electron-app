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
  const selectedPath = dialog.showOpenDialogSync({
    properties: ['openDirectory', 'dontAddToRecent'],
    title: "Selecciona la carpeta de destino para las propuestas",
  })
  // console.log(selectedPath);
  return '1'
}

app.whenReady().then(() => {
  ipcMain.handle('ping', () => 'pong')
  ipcMain.handle('select-folder', selectFolder())
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