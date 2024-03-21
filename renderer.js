// const information = document.getElementById('info')
// information.innerText = `This app is using Chrome (v${versions.chrome()}), Node.js (v${versions.node()}), and Electron (v${versions.electron()})`
const { dialog } = require('electron')
const selectFolder = async () => {
  const response = await window.versions.selectFile()
  console.log(response)
} 
const selectFile = document.getElementById('select-folder').addEventListener('click', selectFolder);