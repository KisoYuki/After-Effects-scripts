var _arrayIsArray = function _arrayIsArray(arg) {
  return Object.prototype.toString.call(arg) === '[object Array]';
};

function _createForOfIteratorHelper(o, allowArrayLike) { var it; if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (_arrayIsArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function makeAudio(text, filePath, optionText) {
  var command = "softalk ";

  if (optionText) {
    command += optionText;
  }

  var newText = text.replace(RegExp(String.fromCharCode(13), "g"), "　");
  command += " /R:\"" + filePath + "\" /W:\"" + newText + "\"";
  system.callSystem("cmd.exe /c \"" + command + "\"");
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

function selectAudioFolder() {
  var audioFolder = Folder.selectDialog("please select destination audio folder");
  return audioFolder.fsName;
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

function insertAudioLayer(textLayer, audioFolderName, optionText) {
  var text = String(textLayer.sourceText.value);
  var audioPath = audioFolderName + "\\" + makeFileName(text) + ".wav";
  makeAudio(text, audioPath, optionText);
  var audioFile = new File(audioPath);

  do {} while (!audioFile.exists);

  var importOpts = new ImportOptions(audioFile);
  var importAudio = app.project.importFile(importOpts);
  var audioLayer = comp.layers.add(importAudio);
  audioLayer.startTime = textLayer.startTime;
  audioLayer.inPoint = textLayer.inPoint;
  audioLayer.outPoint = textLayer.outPoint;
}

function main(option) {
  var comp = app.project.activeItem;
  var audioFolderName = Folder.selectDialog("please select destination audio folder").fsName;
  var optionText = makeSoftalkOptionText(option);

  var _iterator = _createForOfIteratorHelper(comp.selectedLayers),
      _step;

  try {
    for (_iterator.s(); !(_step = _iterator.n()).done;) {
      var selectedLayer = _step.value;

      if (selectedLayer instanceof TextLayer) {
        insertAudioLayer(selectedLayer, audioFolderName, optionText);
      }
    }
  } catch (err) {
    _iterator.e(err);
  } finally {
    _iterator.f();
  }
}

main({
  speed: 100,
  pitch: 100,
  voiceName: "woman"
});