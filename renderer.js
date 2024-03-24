const defaultOutputPathButton = document.getElementById('select-folder')
const entePublicoCheckbox = document.getElementById('ente-publico')
const apendiceEntePublico = document.getElementById('apendice-ente-publico')
const humanizePath = pathString => {
  const pathComponents = pathString.split("\\",)
  if (pathComponents.length < 4) {
    return pathComponents.join(" > ")
  } else {
    return [
      pathComponents[0],
      "...",
      pathComponents.slice(-2, -1),
      pathComponents.slice(-1)
    ].join(" > ")
  }
}


const initialize = async () => {
  const defaultFolder = humanizePath(await window.settings.all())
  // console.log(defaultFolder);
  defaultOutputPathButton.textContent = defaultFolder

  onHoverChangeText(defaultOutputPathButton, "Cambiar")
}

const onHoverChangeText = (element, hoverText) => {
  const originalText = element.textContent;
  element.addEventListener('mouseover', () => {
    const rect = element.getBoundingClientRect();
    const width = rect.width
    const height = rect.height
    element.style.width = width.toString() + "px"
    element.style.height = height.toString() + "px"
    element.textContent = hoverText;
  });

  element.addEventListener('mouseout', () => {
    element.style.width = ""
    element.style.height = ""
    element.textContent = originalText;
  });
}

const changeOutputPath = async () => {
  const returnedPath = await window.settings.select()
  if (returnedPath) {
    let selectedPath = humanizePath(returnedPath)
    defaultOutputPathButton.innerText = selectedPath
    onHoverChangeText(defaultOutputPathButton, 'Cambiar')
  }
}

function toggleVisibility() {
  const entesPublicos = document.getElementById("toggle-" + this.id)
  entesPublicos.querySelectorAll("input").forEach(input => input.toggleAttribute("required"))
  entesPublicos.toggleAttribute("hidden")
  
}

initialize()
defaultOutputPathButton.addEventListener('click', changeOutputPath)
entePublicoCheckbox.addEventListener('click', toggleVisibility)