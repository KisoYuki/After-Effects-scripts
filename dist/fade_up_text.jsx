#include 'align_to_rect.jsx';

// refs: http://docs.aenhancers.com/other/textdocument/
var DEFAULT_COMP_SETTINGS = {
  width: 1920,
  height: 1080,
  pixelAspect: 1.0,
  duration: 10,
  frameRate: 29.97,
  bgColor: [0, 0, 0]
};
var TEXT_BG_DURATION = 600;
var DEFAULT_PARAMETERS = {
  fadeSpeed: 815,
  fadeInterval: 4.0,
  sequenceLayers: 0
};
var refComps;

function getCompByName(name) {
  for (var i = 1; i <= app.project.numItems; i++) {
    if (app.project.item(i) instanceof CompItem && app.project.item(i).name == name) {
      return app.project.item(i);
    }
  }

  return null;
}

function getLayerByName(comp, name) {
  for (var i = 1; i <= comp.numLayers; i++) {
    if (comp.layer(i).name == name) {
      return comp.layer(i);
    }
  }

  return null;
}

function getTextLayerBySourceText(comp, value) {
  for (var i = 1; i <= comp.numLayers; i++) {
    if (comp.layer(i) instanceof TextLayer && comp.layer(i).sourceText.value == value) {
      return comp.layer(i);
    }
  }

  return null;
}

function applyFadeToLayer(textLayer) {
  if (textLayer.Text.Animators.numProperties > 0) {
    textLayer.Text.Animators.property("ADBE Text Animator").remove();
  }

  var animator = textLayer.Text.Animators.addProperty("ADBE Text Animator");
  var selector = animator.property("ADBE Text Selectors").addProperty("ADBE Text Selector");
  var opacity = animator.property("ADBE Text Animator Properties").addProperty("ADBE Text Opacity");
  opacity.setValue(0);
  selector.start.expression = 'comp("text settings").layer("fade parameters").effect("speed")("Slider") * (time - this.startTime) / text.sourceText.length';
}

function placeLayerOnBG(layer, vert, horiz) {
  var textBGComp = getCompByName("text BG");
  var textArea = getLayerByName(textBGComp, "text area");
  var metrix = getBoundingBoxMetrix(textArea);
  align(layer, metrix, vert, horiz);
}

function fitCompSettingsToBase(comp) {
  var baseComp = getCompByName("base comp");
  comp.width = baseComp.width;
  comp.height = baseComp.height;
  comp.pixelAspect = baseComp.pixelAspect;
  comp.frameRate = baseComp.frameRate;
}

function setReferenceComps() {
  var baseComp = getCompByName("base comp");

  if (!baseComp) {
    baseComp = app.project.items.addComp("base comp", DEFAULT_COMP_SETTINGS.width, DEFAULT_COMP_SETTINGS.height, DEFAULT_COMP_SETTINGS.pixelAspect, DEFAULT_COMP_SETTINGS.duration, DEFAULT_COMP_SETTINGS.frameRate);
  }

  var textBGComp = getCompByName("text BG");

  if (!textBGComp) {
    textBGComp = baseComp.duplicate();
    textBGComp.name = "text BG";
    var textArea = textBGComp.layers.addShape();
    textArea.name = "text area";
    var shapeProperty = textArea.property('ADBE Root Vectors Group');
    var rectProperty = shapeProperty.addProperty("ADBE Vector Shape - Rect");
    rectProperty.property("size").setValue([DEFAULT_COMP_SETTINGS.width * .95, DEFAULT_COMP_SETTINGS.height / 4]);
    var fillProperty = shapeProperty.addProperty("ADBE Vector Graphic - Fill");
    fillProperty.property("Color").setValue([250, 250, 250, 255]);
    textArea.property("position").setValue([DEFAULT_COMP_SETTINGS.width / 2, DEFAULT_COMP_SETTINGS.height * 5 / 6]);
    textBGComp.duration = TEXT_BG_DURATION;
  } else {
    fitCompSettingsToBase(textBGComp);
  }

  var textSetComp = getCompByName("text settings");

  if (!textSetComp) {
    textSetComp = baseComp.duplicate();
    textSetComp.name = "text settings";
    textSetComp.layers.add(textBGComp);
    var paramsLayer = textSetComp.layers.addNull();
    paramsLayer.name = "fade parameters";
    var speedControl = paramsLayer.property("ADBE Effect Parade").addProperty("ADBE Slider Control");
    speedControl.name = "speed";
    speedControl.property("Slider").setValue(DEFAULT_PARAMETERS.fadeSpeed);
    var intervalControl = paramsLayer.property("ADBE Effect Parade").addProperty("ADBE Slider Control");
    intervalControl.name = "interval";
    intervalControl.property("Slider").setValue(DEFAULT_PARAMETERS.fadeInterval);
    var sequenceLayersControl = paramsLayer.property("ADBE Effect Parade").addProperty("ADBE Checkbox Control");
    sequenceLayersControl.name = "sequence layers";
    sequenceLayersControl.property("Checkbox").setValue(DEFAULT_PARAMETERS.sequenceLayers);
    var sampleTextLayer = textSetComp.layers.addText();
    sampleTextLayer.name = "sample text";
    var textProp = sampleTextLayer.property("sourceText");
    textProp.setValue("Sample Text");
    var textDocument = textProp.value;
    textDocument.fillColor = [0, 0, 0];
    textDocument.fontSize = 60;
    textProp.setValue(textDocument);
    applyFadeToLayer(sampleTextLayer);
    applyFadeToLayer(sampleTextLayer);
    placeLayerOnBG(sampleTextLayer, "middle", "center");
  } else {
    fitCompSettingsToBase(textSetComp);
  }

  return [baseComp, textBGComp, textSetComp];
}

function readTextFile(textFile) {
  if (textFile.open('r')) {
    var text = "";

    while (!textFile.eof) {
      text += textFile.readln();

      if (!textFile.eof) {
        text += String.fromCharCode(13);
      }
    }

    textFile.close();
  }

  return text;
}

function setScriptComp(scriptComp, text) {
  var textSetComp = refComps[2];
  var paramsLayer = getLayerByName(textSetComp, "fade parameters");
  var sampleTextLayer = getLayerByName(textSetComp, "sample text");
  var effects = paramsLayer.property("ADBE Effect Parade");
  var speed = effects.property("speed").property("Slider").value;
  var interval = effects.property("interval").property("Slider").value;
  var sequenceLayers = effects.property("sequence layers").property("Checkbox").value;
  var currentTime = 0;

  for (var i = 0; i < text.length; i++) {
    var paragraph = text[i];
    var paraLayer = getTextLayerBySourceText(scriptComp, paragraph);

    if (!paraLayer) {
      sampleTextLayer.copyToComp(scriptComp);
      paraLayer = getLayerByName(scriptComp, "sample text");
      paraLayer.sourceText.setValue(paragraph);
    } else {
      applyFadeToLayer(paraLayer);
    }

    paraLayer.name = "paragraph " + i;
    var duration = 100 * paragraph.length / speed + interval;

    if (sequenceLayers == 0) {
      currentTime = paraLayer.startTime;
    }

    paraLayer.startTime = currentTime;
    paraLayer.inPoint = currentTime;
    paraLayer.outPoint = currentTime + duration;
    currentTime += duration;
    placeLayerOnBG(paraLayer);
  }

  if (scriptComp.duration < currentTime) {
    scriptComp.duration = currentTime;
  }
}

function main() {
  var textFiles = File.openDialog("please select text file", "*.txt", true);

  if (textFiles) {
    refComps = setReferenceComps();
    var baseComp = refComps[0];
    var textBGComp = refComps[1];

    for (var i = 0; i < textFiles.length; i++) {
      var textFile = textFiles[i];
      var fileName = textFile.name.substring(0, textFile.name.length - 4);
      fileName = decodeURI(fileName);
      var text = readTextFile(textFile).split(String.fromCharCode(13) + String.fromCharCode(13));
      var scriptComp = getCompByName(fileName);

      if (!scriptComp) {
        scriptComp = baseComp.duplicate();
        scriptComp.name = fileName;
        scriptComp.layers.add(textBGComp);
      } else {
        fitCompSettingsToBase(scriptComp);
      }

      setScriptComp(scriptComp, text);
    }
  }
}

main();