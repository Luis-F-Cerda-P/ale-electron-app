const defaultPath = document.getElementById('select-folder')
// defaultPath.innerText = `${response}`
const initialize = async () => {
  const userSettings = await window.settings.defaultFolder()
  console.log(userSettings[0]);
}
const func = async () => {
  const response = await window.settings.select()
  console.log(response)
}

defaultPath.addEventListener('click', func)
initialize()