var _arrayIsArray = function _arrayIsArray(arg) {
  return Object.prototype.toString.call(arg) === '[object Array]';
};

function _createForOfIteratorHelper(o, allowArrayLike) { var it; if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (_arrayIsArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

var CURRENT_OS = $.os.toLowerCase().indexOf('mac') >= 0 ? "MAC" : "WINDOWS";
var audioImportTask;
var layerSettings = [];
var scheduleCounter;
var maxCounter;

function makeAudio(text, filePath, optionText) {
  var command = "softalkw /X:1 ";

  if (optionText) {
    command += optionText;
  }

  var newText = text.replace(RegExp(String.fromCharCode(13), "g"), " ");
  command += " /R:\"" + filePath + "\" /W:\"" + newText + "\"";

  if (CURRENT_OS === "WINDOWS") {
    command = "cmd.exe /c \"" + command + "\"";
  }

  system.callSystem(command);
  return true;
}

function makeSoftalkOptionText(option) {
  var nameToCommand = {
    speed: 'S',
    library: 'T',
    pitch: 'L',
    accent: 'K',
    voiceName: 'NM'
  };
  var optionText = '';

  for (var name in nameToCommand) {
    if (option[name]) {
      var command = nameToCommand[name];
      optionText += " /" + command + ":" + option[name];
    }
  }

  return optionText;
}

function getHash(s) {
  var hash = 0;
  var chr = 0;
  if (s.length === 0) return hash;

  for (var i = 0; i < s.length; i++) {
    chr = s.charCodeAt(i);
    hash = (hash << 5) - hash + chr; // hash |= 0; // Convert to 32bit integer

    hash &= 8191;
  }

  return hash;
}

function makeFileName(text) {
  var new_line_reg = new RegExp(String.fromCharCode(13), "g");
  var filename_reg = new RegExp('[|&;$%@\"\'<>()+,]', "g");
  var hash = getHash(text);
  var fileName = text.replace(new_line_reg, "").replace(filename_reg, "").slice(0, 14);
  return fileName + "_" + hash;
}

function importAudio() {
  scheduleCounter += 1;
  var notImportedSettings = [];

  for (var _i = 0, _layerSettings = layerSettings; _i < _layerSettings.length; _i++) {
    var layerSetting = _layerSettings[_i];
    var audioPath = layerSetting.audioPath,
        textLayer = layerSetting.textLayer;
    var audioFile = new File(audioPath);

    if (audioFile.exists) {
      var importOpts = new ImportOptions(audioFile);

      var _importAudio = app.project.importFile(importOpts);

      var audioLayer = textLayer.containingComp.layers.add(_importAudio);
      audioLayer.startTime = textLayer.startTime;
      audioLayer.inPoint = textLayer.inPoint;
      audioLayer.outPoint = textLayer.outPoint;
      audioLayer.moveAfter(textLayer);
    } else {
      notImportedSettings.push(layerSetting);
    }
  }

  if (notImportedSettings.length === 0) {
    app.cancelTask(audioImportTask);
    alert("finished making audio");
  } else if (scheduleCounter > maxCounter) {
    alert("couldn't make audio");
    app.cancelTask(audioImportTask);
  }

  layerSettings = notImportedSettings;
}

function addAudio(textLayers, audioFolderName, optionText) {
  var _iterator = _createForOfIteratorHelper(textLayers),
      _step;

  try {
    for (_iterator.s(); !(_step = _iterator.n()).done;) {
      var textLayer = _step.value;
      var text = String(textLayer.sourceText.value);
      var audioPath = audioFolderName + "\\" + makeFileName(text) + ".wav";
      makeAudio(text, audioPath, optionText);
      layerSettings.push({
        audioPath: audioPath,
        textLayer: textLayer
      });
    }
  } catch (err) {
    _iterator.e(err);
  } finally {
    _iterator.f();
  }

  scheduleCounter = 0;
  maxCounter = textLayers.length * 2;
  audioImportTask = app.scheduleTask('importAudio()', 5000, true);
}

function runSelectedLayers(option) {
  var activeComp = app.project.activeItem;
  var audioFolderName = Folder.selectDialog("please select destination audio folder").fsName;
  var optionText = makeSoftalkOptionText(option);
  addAudio(activeComp.selectedLayers, audioFolderName, optionText);
} // runSelectedLayers({speed: 100, pitch: 100, voiceName: "woman"})