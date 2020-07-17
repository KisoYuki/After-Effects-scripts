"use strict";

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
  var optionComamnd;
  var optionNameToCommand = {
    speed: 'S',
    library: 'T',
    pitch: 'L',
    accent: 'K',
    voiceName: 'NM'
  };

  for (var _i = 0, _Object$keys = Object.keys(optionNameToCommand); _i < _Object$keys.length; _i++) {
    var optionName = _Object$keys[_i];
    optionCommand = optionNameToCommand[optionName];
    optionText += " /" + optionCommand + ":" + option[optionName];
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