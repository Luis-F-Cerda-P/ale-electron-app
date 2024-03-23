const defaultPath = document.getElementById('select-folder')
// defaultPath.innerText = `${response}`

const func = async () => {
  const response = await window.versions.select()
  console.log(response)
}

defaultPath.addEventListener('click', func)