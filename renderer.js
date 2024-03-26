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
const formatProposalNumber = proposalNumber => proposalNumber.toString().padStart(3, "0")


const initialize = async () => {
  const proposalNumberButton = document.getElementById('proposal-number')
  const settings = await window.settings.allSettings()
  console.log(settings);
  const defaultFolder = humanizePath(settings.default_folder)
  const proposalIdString = formatProposalNumber(settings.proposal_id)
  defaultOutputPathButton.textContent = defaultFolder
  proposalNumberButton.value = proposalIdString
  document.getElementById('fecha_propuesta').valueAsDate = new Date()
  onHoverChangeText(defaultOutputPathButton, "Cambiar")
  document.getElementById('open-files').addEventListener('click', openCreatedFiles)
  document.getElementById('close-modal').addEventListener('click', closeModal)
  document.getElementById('close-app').addEventListener('click', closeApp)
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

const onHoverChangeValue = (element, hoverText) => {
  const originalValue = element.value;
  element.addEventListener('mouseover', () => {
    const rect = element.getBoundingClientRect();
    const width = rect.width
    const height = rect.height
    element.style.width = width.toString() + "px"
    element.style.height = height.toString() + "px"
    element.value = hoverText;
  });

  element.addEventListener('mouseout', () => {
    element.style.width = ""
    element.style.height = ""
    element.value = originalValue;
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

function changeCorrelativeId() {
  if (this.checkValidity()) {
    console.log("valid");
    const value = this.value
    this.value = formatProposalNumber(value)
  } 
}

async function openCreatedFiles() {
  console.log(this.value);
  console.log(this);
  await window.settings.openPath(this.value)
}

function closeModal() {
  document.getElementById('dialog-demo').close()
  document.querySelector('body').scrollIntoView({ behavior: 'smooth', block: 'start' })
}

function closeApp() {
  window.close()
}

async function createProposal(event) {
  event.preventDefault();
  const formData = Array.from(new FormData(this).entries())
  console.log(formData);
  const response = await window.settings.createProposal(formData)
  if (response) {
    console.log(response);
    this.reset()
    document.getElementById('proposal-number').value = formatProposalNumber(response.proposalId)
    document.getElementById('open-files').value = response.path
    document.getElementById('dialog-demo').showModal()
    
  }
}

function toggleElements() {
  const toggledElements = document.querySelectorAll(".toggle-" + this.id)
  toggledElements.forEach(element => {
    element.querySelectorAll("input").forEach(input => {
      input.toggleAttribute("required")
      input.value = ""
    })
    element.toggleAttribute("hidden")
  })

}

initialize()
defaultOutputPathButton.addEventListener('click', changeOutputPath)
entePublicoCheckbox.addEventListener('click', toggleElements)
document.getElementById('myForm').addEventListener('submit', createProposal);
document.getElementById('proposal-number').addEventListener('change', changeCorrelativeId)