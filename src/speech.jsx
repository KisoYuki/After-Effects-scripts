var audioImportTask
var layerSettings = []
function makeAudio (text, filePath, optionText) {
  let command = "softalk "
  if (optionText) {
    command += optionText
  }
  const newText = text.replace(RegExp(String.fromCharCode(13), "g"), "　")
  command += (" /R:\"" + filePath + "\" /W:\"" + newText + "\"")
  system.callSystem("cmd.exe /c \"" + command + "\"");
  return true;
}

function makeSoftalkOptionText (option) {
  const nameToCommand = {
    speed: 'S',
    library: 'T',
    pitch: 'L',
    accent: 'K',
    voiceName: 'NM'
  }
  let optionText = ''
  for (const name in nameToCommand) {
    if (option[name]) {
      const command = nameToCommand[name]
      optionText += " /" + command + ":" + option[name];
    }
  }
  return optionText
}

function getHash (s) {
  let hash = 0
  let chr = 0
  if (s.length === 0) return hash;
  for (let i = 0; i < s.length; i++) {
    chr   = s.charCodeAt(i)
    hash  = ((hash << 5) - hash) + chr
    // hash |= 0; // Convert to 32bit integer
    hash &= 8191;
  }
  return hash
}

function makeFileName (text) {
  const new_line_reg = new RegExp(String.fromCharCode(13), "g")
  const filename_reg = new RegExp('[|&;$%@\"\'<>()+,]', "g")
  const hash = getHash(text)
  const fileName = text.replace(new_line_reg, "").replace(filename_reg, "").slice(0, 14)
  return fileName + "_" + hash
}

function isEmpty(obj) {
  for(var prop in obj) {
    if(obj.hasOwnProperty(prop)) {
      return false;
    }
  }
  return JSON.stringify(obj) === JSON.stringify({});
}


function importAudio () {
  const importedLayers = []
  for (const layerSetting of layerSettings) {
    const { audioPath, textLayer } = layerSetting
    const audioFile = new File(audioPath)
    if (audioFile.exists) {
      const importOpts = new ImportOptions(audioFile)
      const importAudio = app.project.importFile(importOpts)
      const audioLayer = textLayer.containingComp.layers.add(importAudio)
      audioLayer.startTime = textLayer.startTime
      audioLayer.inPoint = textLayer.inPoint
      audioLayer.outPoint = textLayer.outPoint
      importedLayers.push(textLayer)
    }
  }
  for (const importedLayer of importedLayers) {
    delete audioPathToAttr[importedLayer]
  }
  if (isEmpty(audioPathToAttr)) {
    app.cancelTask(audioImportTask)
  }
}

function addAudio (textLayers, audioFolderName, option) {
  const optionText = makeSoftalkOptionText(option)
  for (const textLayer of textLayers) {
    const text = String(textLayer.sourceText.value)
    const audioPath = audioFolderName + "\\" + makeFileName(text) + ".wav"
    makeAudio(text, audioPath, optionText)
    layerSettings.push({ audioPath: audioPath, textLayer: textLayer })
  }
  audioImportTask = app.scheduleTask('importAudio()', 3000, true)
}

function main (option) {
  const activeComp = app.project.activeItem
  const audioFolderName = Folder.selectDialog(
    "please select destination audio folder").fsName
  addAudio(activeComp.selectedLayers, audioFolderName, option)
}

main({speed: 100, pitch: 100, voiceName: "woman"})
