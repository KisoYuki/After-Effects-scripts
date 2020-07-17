#include 'align_to_rect.jsx';

var DEFAULT_COMP_SETTINGS = {
  width: 1920, height: 1080, pixelAspect: 1.0,
  duration: 10, frameRate: 29.97, bgColor: [0, 0, 0]}

function readTextFile(text_file) {
  if (text_file.open('r')) {
    var text = "";
    while (!text_file.eof){
      text += text_file.readln();
      if (!text_file.eof) {
        text += String.fromCharCode(13);
      }
    }
    text_file.close();
  }
  return text;
}

function make_fading_up_script(script, comp, fade_up_ffx, base_text_layer) {
  var sum_duration = 0;
  var prev_text_layers = getTextLayers(comp);
  var text_layers = [];
  for (var i = 0; i < script.length; i++) {
    var paragraph = script[i];
    var duration = .17 * paragraph.length;
    var text_layer = null;
    for (var j = 0; j < prev_text_layers.length; j++) {
      if (prev_text_layers[j].sourceText.value == paragraph) {
        text_layer = prev_text_layers[j];
        removeAnimators(text_layer);
        break
      }
    }
    if (text_layer === null) {
      if (base_text_layer) {
        base_text_layer.copyToComp(comp);
        text_layer = comp.layer(1);
      } else {
        text_layer = comp.layers.addText();
      }
    }
    text_layer.selected = true;
    text_layer.sourceText.setValue(paragraph);
    text_layer.applyPreset(fade_up_ffx);
    text_layer.startTime = sum_duration;
    text_layer.inPoint = sum_duration;
    text_layer.outPoint = sum_duration + duration;
    sum_duration += duration;
    text_layers.push(text_layer);
    text_layer.selected = false;
  }
  for (var i = 0; i < text_layers.length; i++) {
    text_layers[text_layers.length - i - 1].moveToBeginning();
  }

  comp.duration = sum_duration;
  return text_layers;
}

function get_comp_settings() {
  var comp = null;
  var settings = {};
  if (app.project.activeItem && app.project.activeItem instanceof CompItem) {
    comp = app.project.activeItem;
  } else {
    for (var i = 0; i < app.project.numItems; i++) {
      var item = app.project.item(i + 1);
      if (item && item instanceof CompItem) {
        comp = item;
        break;
      }
    }
  }

  if (comp) {
    settings['width'] = comp.width;
    settings['height'] = comp.height;
    settings['pixelAspect'] = comp.pixelAspect;
    settings['duration'] = comp.duration;
    settings['frameRate'] = comp.frameRate;
    settings['bgColor'] = comp.bgColor;
  } else {
    settings = DEFAULT_COMP_SETTINGS;
  }
  return settings;
}

function removeAnimators(text_layer) {
  var animators = text_layer.Text.property("Animators");
  for (var i = 0; i < animators.numProperties; i++) {
    var animator = animators.property(i + 1);
    animator.remove();
  }
}

function getCompItems() {
  var comp_items = [];
  for (var i = 0; i < app.project.numItems; i++) {
    var item = app.project.item(i + 1);
    if (item && item instanceof CompItem) {
      comp_items.push(item);
    }
  }
  return comp_items;
}

function getTextLayers(comp) {
  var text_layers = [];
  for (var i = 0; i < comp.numLayers; i++) {
    var item = comp.layer(i + 1);
    if (item && item instanceof TextLayer) {
      text_layers.push(item);
    }
  }
  return text_layers;
}

function getFirstSelectedLayer(layer_class) {
  var comp = app.project.activeItem
  var layer = null;
  for (var i = 0; i < comp.selectedLayers.length; i++) {
    if (layer_class === undefined || comp.selectedLayers[i] instanceof layer_class) {
      layer = comp.selectedLayers[i];
      break
    }
  }
  return layer;
}

var comp;
var text_files = File.openDialog("please select text file", "*.txt", true);

if (text_files) {
  var comp_settings = get_comp_settings();
  var fade_up_ffx = new File('./fade_up.ffx')
  var prev_comp_items = getCompItems();
  var selected_aligns = selectAlignment();
  var shape_layer = getFirstSelectedLayer(ShapeLayer);
  var base_text_layer = getFirstSelectedLayer(TextLayer);
  if (shape_layer) {
    var metrix = getBoundingBoxMetrix(shape_layer);
  } else {
    var metrix = {
      left: 0, top: 0, right: comp_settings.width, bottom: comp_settings.height};
  }

  for (var i = 0; i < text_files.length; i++) {
    var text_file = text_files[i];
    var text_name = text_file.name.substring(0, text_file.name.length - 4)
    text_name = decodeURI(text_name);
    var text = readTextFile(text_file);
    var script = text.split(String.fromCharCode(13) + String.fromCharCode(13));
    var dup_flag = false;
    for (var j = 0; j < prev_comp_items.length; j++) {
      if (prev_comp_items[j].name == text_name) {
        dup_flag = true;
        comp = prev_comp_items[j];
      }
    }
    if (!dup_flag) {
      comp = app.project.items.addComp(
        text_name, comp_settings.width, comp_settings.height,
        comp_settings.pixelAspect, comp_settings.duration,
        comp_settings.frameRate);
    }
    comp.bgColor = comp_settings.bgColor;
    var text_layers = make_fading_up_script(script, comp, fade_up_ffx, base_text_layer);
    alignLayersToRect(text_layers, metrix, selected_aligns);
  }
}
