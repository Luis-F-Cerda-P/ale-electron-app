const { dialog } = require('electron')


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


module.exports = { selectFolder }