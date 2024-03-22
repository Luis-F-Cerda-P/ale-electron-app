const { app, BrowserWindow, ipcMain, dialog } = require('electron')
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

  if (!app.isPackaged) win.webContents.openDevTools()
  
}

const selectFolder = async () => {
  try {
    const result = await dialog.showOpenDialog({
      properties: ['openDirectory', 'dontAddToRecent'],
      title: "Selecciona la carpeta de destino para las propuestas",
    });

    if (!result.canceled) {
      const folderPath = result.filePaths[0];
      console.log('Selected folder:', folderPath);
      return folderPath;
    }
  } catch (err) {
    console.error(err);
  }
};

app.whenReady().then(() => {
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