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
  async function processFormData(formData) {
    const twoDigitYear = new Date().getFullYear() - 2000;

    const formObject = Object.fromEntries(formData.filter(el => el[1]).map(el => [el[0], el[1].trim()]))

    const [inicialesTipoVenta, tipo_venta] = formObject.tipo_venta.split(" - ")

    const correlative = parseInt(formObject.proposal_number) + 1
    const internalId = `P${twoDigitYear}${formObject.proposal_number}`
    const isLicitation = !!formObject.ente_publico
    const fecha_a_usar = isLicitation ? formObject.fecha_licitacion : formObject.fecha_propuesta
    const fecha_final = humanizeDateString(fecha_a_usar)
    const idLicitation = `${formObject.codigo_licitacion}.${fecha_final.slice(-4)}`
    const idLicitationFile = `${formObject.codigo_licitacion}/${fecha_final.slice(-4)}`
    const cliente = formObject.cliente
    const cliente1Present = !!formObject.cliente1
    const cliente1 = formObject.cliente1
    const cliente2Present = !!formObject.cliente2
    const cliente2 = formObject.cliente2


    let proposalName = `${internalId} - AS - ${cliente} - ${inicialesTipoVenta}`;
    if (isLicitation) proposalName += ` ${idLicitation}`
    if (formObject.descripcion) proposalName += ` - ${formObject.descripcion}`

    const data = {
      correlative,
      internalId,
      isLicitation,
      idLicitation,
      idLicitationFile,
      fecha_final,
      cliente,
      cliente1Present,
      cliente1,
      cliente2Present,
      cliente2,
      tipo_venta,
      proposalName,
    }

    return data
  }

  async function createFolder(proposalName) {
    const basePath = await getDefaultFolderSetting();
    const folderPath = path.join(basePath, proposalName);
    console.log("folderPath");
    console.log(folderPath);
    fs.mkdirSync(folderPath);

    return folderPath
  }

  async function createFiles(proposalName, folderPath) {
    const excelTemplateSource = path.join(__dirname,"..","plantillaExcel.xlsx")
    // console.log("excelTemplateSource:");
    // console.log(excelTemplateSource);
    const excelFileDestination = path.join(folderPath, proposalName + ".xlsx")
    // console.log("excelFileDestination:");
    // console.log(excelFileDestination);
    const wordTemplateSource = path.join(__dirname,"..","plantillaWord.docx")
    // console.log("wordTemplateSource:");
    // console.log(wordTemplateSource);
    const wordFileDestination = path.join(folderPath, proposalName + ".docx")
    // console.log("wordFileDestination:");
    // console.log(wordFileDestination);

    fs.copyFileSync(excelTemplateSource, excelFileDestination)
    fs.copyFileSync(wordTemplateSource, wordFileDestination)

    return wordFileDestination;
  }

  async function replaceDataOnFiles(wordFilePath, data) {
    const newWordFile = fs.readFileSync(wordFilePath);
    const replacementData = data
    const handler = new TemplateHandler();
    const doc = await handler.process(newWordFile, replacementData)
    fs.writeFileSync(wordFilePath, doc)
  }

  try {
    const data = await processFormData(formData)
    const proposalName = data.proposalName;
    const proposalFolder = await createFolder(proposalName)
    await setCorrelativeIdSetting(data.correlative)
    const wordFilePath = await createFiles(proposalName, proposalFolder)
    await replaceDataOnFiles(wordFilePath, data)
    // TODO: validate the formObject in the frontend, then here. Maybe do some of this process in the front process.
    // const internalId = `P${twoDigitYear}${correlative}`
    // let proposalName = `\\${internalId} - AS - ${formObject.cliente}`
    // let fechaLicitacion;
    // let anoLicitacionCorto;
    // let anoLicitacionLargo;
    // if (formObject.fecha_licitacion) {
    //   fechaLicitacion = humanizeDateString(formObject.fecha_licitacion)
    //   anoLicitacionCorto = fechaLicitacion.slice(-2)
    //   anoLicitacionLargo = fechaLicitacion.slice(-4)
    // }
    // if (formObject.ente_publico) proposalName += ` - ${inicialesTipoVenta} ${formObject.codigo_licitacion}.${anoLicitacionCorto}`
    // if (formObject.descripcion) proposalName += ` - ${formObject.descripcion}`

    // TODO: Get file templates dynamically. Find the files from a database reference => 'Tomate creation' UI
    const response = {
      path: proposalFolder,
      proposalId: data.correlative,
    }

    return response;
  } catch (error) {
    console.log(error)
    return error.message
  }
}


module.exports = { createProposal, selectFolder, openPath }