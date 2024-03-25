const { dialog } = require('electron')
const { shell } = require('electron');
const path = require('node:path');
const fs = require("node:fs")
const { db, getDefaultFolderSetting, setDefaultFolderSetting } = require('../database/main')
const { TemplateHandler } = require('easy-template-x')


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

const createProposal = async (_event, formData) => {
  try {
    // TODO: Make the correlative ID dynamic and configurable. Even pass it to the front end so it's part of the form. On click, it can be modified through a form inside a modal
    const basePath = await getDefaultFolderSetting(); 
    const year = new Date().getFullYear() - 2000;
    const correlative = "025"
    // TODO: validate the formObject in the frontend, then here. Maybe do some of this process in the front process.
    const formObject = Object.fromEntries(formData.filter(el => el[1]).map(el => [el[0], el[1].trim()]))
    let proposalName = `\\P${year}${correlative} - AS - ${formObject.cliente}`

    if (formObject.ano_licitacion) formObject.ano_licitacion = formObject.ano_licitacion.slice(2, 4)
    if (formObject["ente-publico"]) proposalName += ` - ${formObject.tipo_venta} ${formObject.codigo_licitacion}.${formObject.ano_licitacion}` 
    if (formObject.descripcion) proposalName += ` - ${formObject.descripcion}`
    
    // TODO: Get file templates dynamically. Find the files from a database reference => 'Tomate creation' UI
    const folderPath = path.join(basePath, proposalName,);
    const excelTemplateSource = `.\\plantillaExcel.xlsx`
    const excelFileDestination = folderPath + proposalName + ".xlsx";
    const wordTemplateSource = `.\\plantillaWord.docx`
    const wordFileDestination = folderPath + proposalName + ".docx";

    fs.mkdirSync(folderPath);
    fs.copyFileSync(excelTemplateSource, excelFileDestination)
    fs.copyFileSync(wordTemplateSource, wordFileDestination)
    shell.openPath(folderPath);

    return folderPath;
  } catch(err) {
    console.log(err)
  }
}


module.exports = { createProposal, selectFolder }