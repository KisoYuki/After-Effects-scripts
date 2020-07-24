var _jsonStringify = function () {
  var cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
      escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
      gap,
      indent,
      meta = {
    '\b': '\\b',
    '\t': '\\t',
    '\n': '\\n',
    '\f': '\\f',
    '\r': '\\r',
    '"': '\\"',
    '\\': '\\\\'
  },
      rep;

  function quote(string) {
    escapable.lastIndex = 0;
    return escapable.test(string) ? '"' + string.replace(escapable, function (a) {
      var c = meta[a];
      return typeof c === 'string' ? c : "\\u" + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
    }) + '"' : '"' + string + '"';
  }

  function str(key, holder) {
    var i,
        k,
        v,
        length,
        mind = gap,
        partial,
        value = holder[key];

    if (value && typeof value === 'object' && typeof value.toJSON === 'function') {
      value = value.toJSON(key);
    }

    if (typeof rep === 'function') {
      value = rep.call(holder, key, value);
    }

    switch (typeof value) {
      case 'string':
        return quote(value);

      case 'number':
        return isFinite(value) ? String(value) : 'null';

      case 'boolean':
      case 'null':
        return String(value);

      case 'object':
        if (!value) return 'null';
        gap += indent;
        partial = [];

        if (Object.prototype.toString.apply(value) === '[object Array]') {
          length = value.length;

          for (i = 0; i < length; i += 1) {
            partial[i] = str(i, value) || 'null';
          }

          v = partial.length === 0 ? '[]' : (gap ? '[\n' + gap + partial.join(',\n' + gap) + '\n' + mind + ']' : '[' + partial.join(',') + ']');
          gap = mind;
          return v;
        }

        if (rep && typeof rep === 'object') {
          length = rep.length;

          for (i = 0; i < length; i += 1) {
            k = rep[i];

            if (typeof k === 'string') {
              v = str(k, value);

              if (v) {
                partial.push(quote(k) + (gap ? ': ' : ':') + v);
              }
            }
          }
        } else {
          for (k in value) {
            if (Object.prototype.hasOwnProperty.call(value, k)) {
              v = str(k, value);

              if (v) {
                partial.push(quote(k) + (gap ? ': ' : ':') + v);
              }
            }
          }
        }

        v = partial.length === 0 ? '{}' : (gap ? '{\n' + gap + partial.join(',\n' + gap) + '\n' + mind + '}' : '{' + partial.join(',') + '}');
        gap = mind;
        return v;
    }
  }

  return function (value, replacer, space) {
    var i;
    gap = '';
    indent = '';

    if (typeof space === 'number') {
      for (i = 0; i < space; i += 1) {
        indent += ' ';
      }
    } else if (typeof space === 'string') {
      indent = space;
    }

    rep = replacer;

    if (replacer && typeof replacer !== 'function' && (typeof replacer !== 'object' || typeof replacer.length !== 'number')) {
      throw new Error('JSON.stringify');
    }

    return str('', {
      '': value
    });
  };
}();

var _arrayIsArray = function _arrayIsArray(arg) {
  return Object.prototype.toString.call(arg) === '[object Array]';
};

function _createForOfIteratorHelper(o, allowArrayLike) { var it; if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (_arrayIsArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

var audioImportTask;
var layerSettings = [];

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

function isEmpty(obj) {
  for (var prop in obj) {
    if (obj.hasOwnProperty(prop)) {
      return false;
    }
  }

  return _jsonStringify(obj) === _jsonStringify({});
}

function importAudio() {
  var importedLayers = [];

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
      importedLayers.push(textLayer);
    }
  }

  for (var _i2 = 0, _importedLayers = importedLayers; _i2 < _importedLayers.length; _i2++) {
    var importedLayer = _importedLayers[_i2];
    delete audioPathToAttr[importedLayer];
  }

  if (isEmpty(audioPathToAttr)) {
    app.cancelTask(audioImportTask);
  }
}

function addAudio(textLayers, audioFolderName, option) {
  var optionText = makeSoftalkOptionText(option);

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

  audioImportTask = app.scheduleTask('importAudio()', 3000, true);
}

function main(option) {
  var activeComp = app.project.activeItem;
  var audioFolderName = Folder.selectDialog("please select destination audio folder").fsName;
  addAudio(activeComp.selectedLayers, audioFolderName, option);
}

main({
  speed: 100,
  pitch: 100,
  voiceName: "woman"
});