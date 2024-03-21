const { app, BrowserWindow, ipcMain } = require('electron')
const { dialog } = require('electron')
const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      preload: path.join(__dirname, 'preload.js')
    }
  })

  win.loadFile('index.html')
}

app.whenReady().then(() => {
  ipcMain.handle('open-file-dialog', (event, arg) => {
    openFileDialog();
  });
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

function openFileDialog() {
  const options = {
    properties: ['openDirectory']
  };

  dialog.showOpenDialog(mainWindow, options).then(result => {
    if (!result.canceled) {
      const folderPath = result.filePaths[0];
      // Here you can record/store the folderPath as needed
      console.log('Selected folder:', folderPath);
    }
  }).catch(err => {
    console.error(err);
  });
}
