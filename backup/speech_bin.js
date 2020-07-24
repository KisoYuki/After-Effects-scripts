const { exec } = require('child_process')
const path = require('path')
const fs = require('fs');

function makeSpeech (text, filePath, optionText) {
  let command = "softalk "
  if (optionText) {
    command += optionText
  }
  const newText = text.replace(RegExp(String.fromCharCode(13), "g"), "　")
  command += ("/R:\"" + filePath + "\" /W:\"" + newText + "\"")
  console.log(command)
  exec(command, (error, stdout, stderr) => {
      if (error) {
          console.log(`error: ${error.message}`);
          return;
      }
      if (stderr) {
          console.log(`stderr: ${stderr}`);
          return;
      }
      if (stdout) {
        console.log(`stdout: ${stdout}`);
      }
  })
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
      optionText += "/" + command + ":" + option[name] + " ";
    }
  }
  return optionText
}

function selectAudioFolder () {
  var audioFolder = Folder.selectDialog("please select destination audio folder");
  return audioFolder.fsName;
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
  const filename_reg = new RegExp('[|&;$%@\"\'<>()+,]', "g")
  const hash = getHash(text)
  // const fileName = text.replace(new_line_reg, "").replace(filename_reg, "").slice(0, 14)
  let fileName = text.replace(filename_reg, "-")
  fileName = fileName.replace(String.fromCharCode(13), "-")
  fileName = fileName.replace("\n", "-").slice(0, 14)
  return fileName + "_" + hash
}

function sleep (milliseconds) {
  return new Promise(resolve => setTimeout(resolve, milliseconds))
}

async function main (option) {
  const optionText = makeSoftalkOptionText(option)
  const settingsData = await fs.promises.readFile("settings.json")
  let { audioDir, textDir } = JSON.parse(settingsData)
  audioDir = path.resolve(audioDir)
  textDir = path.resolve(textDir)
  const textNames = await fs.promises.readdir(textDir)
  let paragraphes = []
  for (const textName of textNames) {
    const textPath = path.join(textDir, textName)
    const text = await fs.promises.readFile(textPath)
    const splited = String(text).split("\n\n")
    paragraphes = paragraphes.concat(splited)
  }
  for (let paragraph of paragraphes) {
    paragraph = paragraph.trim()
    const audioName = makeFileName(paragraph) + ".wav"
    const audioPath = path.join(audioDir, audioName)
    paragraph = paragraph.replace("\n", " ")
    makeSpeech(paragraph, audioPath, optionText)
    // const timer = setTimeout(() => {
    //   watcher.close()
    //   console.error("couldn't make audio", audioPath)
    // }, 100000)
    // const watcher = fs.watch(path.dirname(audioPath), (eventType, filename) => {
    //   if (eventType === 'rename' && filename === audioName) {
    //     clearTimeout(timer)
    //     watcher.close()
    //   }
    // })
    // await watcher
  }
}
// const optionText = makeSoftalkOptionText({speed: 100, pitch: 100, voiceName: "woman"})
// makeSpeech("hello", path.resolve("./audio/test.wav"), optionText)
main({speed: 100, pitch: 100, voiceName: "woman"})
