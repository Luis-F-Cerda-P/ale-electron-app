const information = document.getElementById('info')
const selectButton = document.getElementById('select-folder')
information.innerText = `This app is using Chrome (v${versions.chrome()}), Node.js (v${versions.node()}), and Electron (v${versions.electron()})`

const func = async () => {
  const response = await window.versions.select()
  console.log(response)
}
selectButton.addEventListener('click', func)

// func()