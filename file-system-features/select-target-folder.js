const { dialog, shell } = require('electron')
const path = require('node:path');
const fs = require("node:fs")
const { db, getDefaultFolderSetting, setDefaultFolderSetting, setCorrelativeIdSetting } = require('../database/main')
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

const openPath = async (_event, folderPath) => {
  try {
    console.log(folderPath);
    shell.openPath(folderPath);
  } catch (error) {
    console.error(error)
    return error
  }
}


const humanizeDateString = (dateString) => {
  const dateObject = new Date(dateString + "T00:00:00");
  const options = {
    day: "numeric",
    month: "long",
    year: "numeric"
  }
  const localeFormat = new Intl.DateTimeFormat("es-ES", options);
  const humanDateString = localeFormat.format(dateObject);

  return humanDateString
}

const createProposal = async (_event, formData) => {
  function processFormData(formData) {
    
  }
  // TODO: Split this process into subprocesses (processFormObject, createFolder, copyTemplates, replaceDataInTemplates)
  try {
    // TODO: Make the correlative ID dynamic and configurable. Even pass it to the front end so it's part of the form. On click, it can be modified through a form inside a modal
    const basePath = await getDefaultFolderSetting();
    const twoDigitYear = new Date().getFullYear() - 2000;
    
    // TODO: validate the formObject in the frontend, then here. Maybe do some of this process in the front process.
    const formObject = Object.fromEntries(formData.filter(el => el[1]).map(el => [el[0], el[1].trim()]))
    const [inicialesTipoVenta, tipoVenta] = formObject.tipo_venta.split(" - ")
    const correlative = formObject["proposal-number"]
    const valueForDatabase =  parseInt(correlative)+1
    await setCorrelativeIdSetting(valueForDatabase)
    const internalId = `P${twoDigitYear}${correlative}`
    
    
    let proposalName = `\\${internalId} - AS - ${formObject.cliente}`
    let fechaLicitacion;
    let anoLicitacionCorto;
    let anoLicitacionLargo;
    
    if (formObject.fecha_licitacion) {
      fechaLicitacion = humanizeDateString(formObject.fecha_licitacion)
      anoLicitacionCorto = fechaLicitacion.slice(-2)
      anoLicitacionLargo = fechaLicitacion.slice(-4)
    }
    if (formObject["ente-publico"]) proposalName += ` - ${inicialesTipoVenta} ${formObject.codigo_licitacion}.${anoLicitacionCorto}`
    if (formObject.descripcion) proposalName += ` - ${formObject.descripcion}`

    // TODO: Get file templates dynamically. Find the files from a database reference => 'Tomate creation' UI
    const folderPath = path.join(basePath, proposalName,);
    const excelTemplateSource = `${__dirname}\\..\\plantillaExcel.xlsx`
    const excelFileDestination = folderPath + proposalName + ".xlsx";
    const wordTemplateSource = `${__dirname}\\..\\plantillaWord 2.docx`
    const wordFileDestination = folderPath + proposalName + ".docx";

    fs.mkdirSync(folderPath);
    fs.copyFileSync(excelTemplateSource, excelFileDestination)
    fs.copyFileSync(wordTemplateSource, wordFileDestination)

    const newWordFile = fs.readFileSync(wordFileDestination); 
    const replacementData = {
      "cliente": formObject.cliente,
      "fecha_licitacion": fechaLicitacion,
      "internal_id": internalId,
      "ano_licitacion_largo": anoLicitacionLargo,
      "tipo_venta": tipoVenta,
    }
    const handler = new TemplateHandler(); 
    const doc = await handler.process(newWordFile, replacementData)
    fs.writeFileSync(wordFileDestination, doc)
    
    const response = {
      path: folderPath,
      proposalId: valueForDatabase
    }

    return response;
  } catch (error) {
    console.log(error)
    return error.message
  }
}


module.exports = { createProposal, selectFolder, openPath }