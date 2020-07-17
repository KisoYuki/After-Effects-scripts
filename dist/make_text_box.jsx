var comp = app.project.activeItem;
var text_layers = [];
var shape_layers = [];
var margin = 25;
for (var i = 0; i < comp.selectedLayers.length; i++) {
  var selected_layer = comp.selectedLayers[i];
  if (selected_layer instanceof TextLayer) {
    text_layers.push(selected_layer);
  }
}

for (var i = 0; i < comp.numLayers; i++) {
  if (comp.layers[i + 1] instanceof ShapeLayer) {
    shape_layers.push(comp.layers[i + 1]);
  }
}

for (var i = 0; i < text_layers.length; i++) {
  var text_layer = text_layers[i];
  var shape_layer = null;
  for (var j = 0; j < shape_layers.length; j++) {
    if (shape_layers[j].name == "Textbox_" + text_layer.name) {
      shape_layer = shape_layers[j];
      break;
    }
  }
  if (shape_layer === null) {
    shape_layer = comp.layers.addShape();
    shape_layer.name = "Textbox_" + text_layer.name;
    shape_layer.property("Contents").addProperty("ADBE Vector Shape - Rect");
    shape_layer.property("Contents").addProperty("ADBE Vector Graphic - Fill");
  }
  var shape_rect = shape_layer.property("Contents").property("ADBE Vector Shape - Rect");
  var text_source_rect = text_layer.sourceRectAtTime(0, false);
  shape_rect.property("Size").setValue(
    [text_source_rect.width + margin, text_source_rect.height + margin]);
  var text_pos = text_layer.property("Position").value;
  var text_anch = text_layer.property("Anchor Point").value;
  var new_shape_pos = [
    text_source_rect.left + text_pos[0] + text_source_rect.width / 2 - text_anch[0],
    text_source_rect.top + text_pos[1] + text_source_rect.height / 2 - text_anch[1]];

  shape_layer.property("Position").setValue(new_shape_pos);
  shape_layer.parent = text_layer;
  shape_layer.moveAfter(text_layer);
}
