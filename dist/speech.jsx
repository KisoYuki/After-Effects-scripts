function makeSpeech(text, filePath, option) {
  var command = "softalk ";

  if (option) {
    command += optionText;
  }

  command += " /R:" + filePath + " /W:" + text;
  system.callSystem("cmd.exe /c \"" + command + " \"");
  return true;
}

function makeSoftalkOptionText(option) {
  var optionText = '';
  var optionNames = ['speed', 'library', 'pitch', 'accent', 'voiceName'];
  var optionCommands = ['S', 'T', 'L', 'K', 'NM'];
  var optionName;
  var optionCommand;

  for (var i = 0; i < optionNames.length; i++) {
    optionName = optionNames[i];
    optionCommand = optionCommands[i];

    if (option[optionName]) {
      optionText += " /" + optionCommand + ":" + option[optionName];
    }
  }

  return optionText;
}

function selectAudioFolder() {
  var audioFolder = Folder.selectDialog("please select destination audio folder");
  return audioFolder.fsName;
} // var audioFolder = selectAudioFolder();
// var dest = audioFolder + "\\test_softalk_8.wav";
// makeSpeech("てすと--", dest)


makeSoftalkOptionText({
  speed: 30,
  pitch: 100,
  voiceName: "woman"
});