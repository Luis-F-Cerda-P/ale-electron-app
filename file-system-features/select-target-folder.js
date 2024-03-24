const { dialog } = require('electron')
const { db, getDefaultFolderSetting, setDefaultFolderSetting } = require('../database/main')


const selectFolder = async () => {
  try {
    const currentPath = await getDefaultFolderSetting();
    const result = await dialog.showOpenDialog({
      properties: ['openDirectory', 'dontAddToRecent'],
      title: "Selecciona la carpeta de destino para las propuestas",
      defaultPath: currentPath,
    });

    if (!result.canceled) {
      const folderPath = result.filePaths[0];
      console.log('Selected folder:', folderPath);
      await setDefaultFolderSetting(folderPath); 
      return folderPath;
    }
  } catch (err) {
    console.error(err);
  }
};


module.exports = { selectFolder }