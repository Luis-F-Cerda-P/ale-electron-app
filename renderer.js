const defaultOutputPathButton = document.getElementById('select-folder')
const humanizePath = pathString => pathString.replaceAll("\\", " > ")
const initialize = async () => {
  const defaultFolder = humanizePath(await window.settings.all())
  // console.log(defaultFolder);
  defaultOutputPathButton.textContent = defaultFolder
  
  onHoverChangeText(defaultOutputPathButton, "Cambiar")
}

const onHoverChangeText = (element, hoverText) => {
  const originalText = element.textContent;
  element.addEventListener('mouseover', () => {
    element.textContent = hoverText;
  });

  element.addEventListener('mouseout', () => {
    element.textContent = originalText;
  });
}

const changeOutputPath = async () => {
  const selectedPath = humanizePath(await window.settings.select())
  defaultOutputPathButton.innerText = selectedPath
  onHoverChangeText(defaultOutputPathButton, 'Cambiar')
}

initialize()
defaultOutputPathButton.addEventListener('click', changeOutputPath)