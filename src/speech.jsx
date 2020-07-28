const CURRENT_OS = $.os.toLowerCase().indexOf('mac') >= 0 ? "MAC": "WINDOWS"
var audioImportTask
var layerSettings = []
var scheduleCounter
var maxCounter

function makeAudio (text, filePath, optionText) {
  // let command = "softalkw /X:1 "
  let command = "softalkw /X:1 "
  if (optionText) {
    command += optionText
  }
  const newText = text.replace(RegExp(String.fromCharCode(13), "g"), " ")
  command += (" /R:\"" + filePath + "\" /W:\"" + newText + "\"")
  if (CURRENT_OS === "WINDOWS") {
    command = "cmd.exe /c \"" + command + "\""
    // system.callSystem("cmd.exe /c \"" + command + "\"")
  }
  system.callSystem(command)
  return true
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

function importAudio () {
  scheduleCounter += 1
  const notImportedSettings = []
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
      audioLayer.moveAfter(textLayer)
    } else {
      notImportedSettings.push(layerSetting)
    }
  }
  if (notImportedSettings.length === 0) {
    app.cancelTask(audioImportTask)
    alert("finished making audio")
  } else if (scheduleCounter > maxCounter) {
    alert("couldn't make audio")
    app.cancelTask(audioImportTask)
  }
  layerSettings = notImportedSettings
}

function addAudio (textLayers, audioFolderName, optionText) {
  for (const textLayer of textLayers) {
    const text = String(textLayer.sourceText.value)
    const audioPath = audioFolderName + "\\" + makeFileName(text) + ".wav"
    makeAudio(text, audioPath, optionText)
    layerSettings.push({ audioPath: audioPath, textLayer: textLayer })
  }
  scheduleCounter = 0
  maxCounter = textLayers.length * 2
  audioImportTask = app.scheduleTask('importAudio()', 5000, true)
}

function runSelectedLayers (option) {
  const activeComp = app.project.activeItem
  const audioFolderName = Folder.selectDialog(
    "please select destination audio folder").fsName
  const optionText = makeSoftalkOptionText(option)
  addAudio(activeComp.selectedLayers, audioFolderName, optionText)
}

// runSelectedLayers({speed: 100, pitch: 100, voiceName: "woman"})
