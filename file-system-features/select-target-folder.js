const { dialog } = require('electron')
const fs = require("node:fs")
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

const createProposal = async (event, formData) => {
  try {
    const formObject = Object.fromEntries(formData.filter(el => el[1]).map(el => [el[0], el[1].trim()]))
    if (formObject.ano_licitacion) formObject.ano_licitacion = formObject.ano_licitacion.slice(2, 4)
    const basePath = await getDefaultFolderSetting(); 
    const year = new Date().getFullYear() - 2000;
    const correlative = "025"
    let proposalName = `\\P${year}${correlative} - AS - ${formObject.cliente}`
    if (formObject["ente-publico"]) proposalName += ` - ${formObject.tipo_venta} ${formObject.codigo_licitacion}.${formObject.ano_licitacion}` 
    if (formObject.descripcion) proposalName += ` - ${formObject.descripcion}`
    // proposalName += "\""
    const path = require('path');
    const folderPath = path.join(basePath, proposalName, "\\.");
    console.log(folderPath);
    fs.mkdirSync(folderPath);

    const { shell } = require('electron');
    shell.openPath(folderPath);
    fs.copyFileSync("C:\\Users\\luisc\\Documents\\Programacion\\Alejandra\\ale-electron-app\\plantillaExcel.xlsx", folderPath + proposalName + ".xlsx")
    fs.copyFileSync("C:\\Users\\luisc\\Documents\\Programacion\\Alejandra\\ale-electron-app\\plantillaWord.docx", folderPath + proposalName + ".docx")
    return folderPath;
  } catch(err) {
    console.log(err)
  }
}


module.exports = { createProposal, selectFolder }