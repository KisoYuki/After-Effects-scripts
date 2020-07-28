#include "fade_up_text.jsx"
#include "speech.jsx"

// ref: https://sites.google.com/site/ihsuyotomakas/bagutokamemo
// ref: https://sites.google.com/view/youuu4/programming/scriptui
// ref: https://estk.aenhancers.com/4%20-%20User-Interface%20Tools/automatic-layout.html
var defFadeSpeed = 815;
var defInterval = 4;
var defAudioSpeed = 100;
var defAudioPitch = 100;
var currentOS = $.os.toLowerCase().indexOf('mac') >= 0 ? "MAC" : "WINDOWS"; // const voiceNames = ["AquesTalk", "女性1", "女性2", "男性1", "男性2", "ロボット", "中性", "機械", "特殊", "SAPI", "Microsoft Anna - English United States", "Speech Platform", "Microsoft Server Speech Text to Speech Voice ja-JP, Haruka", "AquesTalk2", "aq_defo1.phont", "aq_f1b.phont", "aq_f1c.phont", "aq_huskey.phont", "aq_m3.phont", "aq_m4.phont", "aq_momo1.phont", "aq_rb2.phont", "aq_rm.phont", "aq_robo.phont", "aq_teto1.phont", "aq_yukkuri.phont"]

var checkSoftalk = false;

function makeTextAndAudio(textFiles, checkAudio, audioDir, settings) {
  var paragraphLayers = makeFadeUpText(textFiles, settings.speed, settings.interval, settings.sequenceLayers);

  if (checkAudio) {
    var optionText = makeSoftalkOptionText({
      speed: settings.audioSpeed,
      pitch: settings.audioPitch
    });

    if (settings.audioOpts !== "") {
      optionText += " " + settings.audioOpts;
    }

    addAudio(paragraphLayers, audioDir, optionText); // addAudio(paragraphLayers, audioDir, "")
  }
}

function makeSliderAndText(parent, name, defaultVal, minvalue, maxvalue, isInt) {
  parent.orientation = "row";
  parent.alignChildren = "center"; // parent.alignChildren = ScriptUI.Alignment.BOTTOM

  parent.add("statictext", [0, 0, 40, 10], name); // parent.add("statictext", undefined, name)

  var slider = parent.add("slider", [0, 0, 100, 20], defaultVal, minvalue, maxvalue); // const slider = parent.add("slider", undefined, defaultVal, minvalue, maxvalue)

  var text = parent.add("edittext", [0, 0, 35, 21], defaultVal);

  slider.onChanging = function () {
    if (isInt) {
      text.text = Math.round(slider.value);
    } else {
      text.text = slider.value.toFixed(2);
    }
  };

  text.onChange = function () {
    var num = parseFloat(text.text);

    if (isInt) {
      num = Math.round(num);
    } else {
      num = num.toFixed(2);
    }

    if (isNaN(num)) {
      num = defaultVal;
    }

    num = Math.max(slider.minvalue, num);
    num = Math.min(slider.maxvalue, num);
    slider.value = num;
    text.text = num;
  };

  return slider;
}

function createUI(thisObj) {
  var textFiles;
  var audioDir;
  var palette = thisObj instanceof Panel ? thisObj : new Window("palette", "Fade up text", undefined, {
    resizeable: true
  });
  var fadePanel = palette.add("panel", undefined, "Fade settings");
  fadePanel.orientation = "column";
  fadePanel.alignment = "left";
  fadePanel.alignChildren = "left";
  var fileGroup = fadePanel.add("group");
  var fileText = fileGroup.add("statictext", undefined, "No text files");
  var fileButton = fileGroup.add("button", undefined, "Select text files");

  fileButton.onClick = function () {
    textFiles = File.openDialog("please select text files", "*.txt", true);
    var message;

    if (textFiles.length == 0) {
      message = "please select text files";
    } else if (textFiles.length == 1) {
      message = "1 text file";
    } else {
      message = textFiles.length + " text files";
    }

    fileText.text = message;
  };

  var speedGroup = fadePanel.add("group");
  var speedSlider = makeSliderAndText(speedGroup, "Speed", defFadeSpeed, 10, defFadeSpeed * 2, true);
  var intervalGroup = fadePanel.add("group");
  var intervalSlider = makeSliderAndText(intervalGroup, "Interval", defInterval, 0, defInterval * 3, false);
  var sequanceCheck = fadePanel.add("checkbox", undefined, "Sequence layers");
  sequanceCheck.value = true;
  var audioPanel = palette.add("panel", undefined, "Audio settings");
  audioPanel.orientation = "column";
  audioPanel.alignment = "left";
  audioPanel.alignChildren = "left";
  var audioCheckbox = audioPanel.add("checkbox", undefined, "Make audio");
  var audioSubGroup = audioPanel.add("group");
  audioSubGroup.orientation = "column";
  audioSubGroup.alignChildren = "left";
  var dirGroup = audioSubGroup.add("group");
  var dirText = dirGroup.add("statictext", undefined, "No audio dir");
  var dirButton = dirGroup.add("button", undefined, "Slect audio dir");

  dirButton.onClick = function () {
    audioDir = Folder.selectDialog("please select audio directory").fsName;
    dirText.text = audioDir;
  };

  var audioSpeedGroup = audioSubGroup.add("group");
  var audioSpeedSlider = makeSliderAndText(audioSpeedGroup, "Speed", defAudioSpeed, 1, defAudioSpeed * 3, true);
  var audioPitchGroup = audioSubGroup.add("group");
  var audioPitchSlider = makeSliderAndText(audioPitchGroup, "Pitch", defAudioPitch, 1, defAudioPitch * 3, true);
  var autioOptionsGroup = audioSubGroup.add("group");
  autioOptionsGroup.add("statictext", undefined, "Options");
  var audioOptionsText = autioOptionsGroup.add("edittext", [0, 0, 150, 20]);
  audioSubGroup.enabled = false;
  audioCheckbox.addEventListener("click", function () {
    if (!checkSoftalk) {
      var whereSoftalk;

      if (currentOS === "WINDOWS") {
        whereSoftalk = system.callSystem("where.exe softalk");
      } else {
        whereSoftalk = system.callSystem("command -v softalk");
      }

      if (whereSoftalk.toLowerCase().indexOf("softalk") === -1) {
        alert("couldn't find softalk. please put it on the path");
        audioCheckbox.value = false;
        return;
      } else {
        checkSoftalk = true;
      }
    }

    if (audioCheckbox.value) {
      audioSubGroup.enabled = true;
    } else {
      audioSubGroup.enabled = false;
    }
  });
  var okButton = palette.add("button", undefined, "OK");
  okButton.alignment = "center";

  okButton.onClick = function () {
    var errorMessages = [];

    if (!textFiles) {
      errorMessages.push("Text files are required");
    }

    if (!audioDir && audioCheckbox.value) {
      errorMessages.push("Audio dir is required to make audio");
    }

    if (errorMessages.length > 0) {
      alert(errorMessages.join("\n"));
      return;
    }

    var settings = {
      speed: Math.round(speedSlider.value),
      interval: intervalSlider.value,
      sequenceLayers: sequanceCheck.value,
      audioSpeed: Math.round(audioSpeedSlider.value),
      audioPitch: Math.round(audioPitchSlider.value),
      audioOpts: audioOptionsText.text
    };
    makeTextAndAudio(textFiles, audioCheckbox.value, audioDir, settings);
  };

  return palette;
}

var settingsUI = createUI(this);
settingsUI.show();