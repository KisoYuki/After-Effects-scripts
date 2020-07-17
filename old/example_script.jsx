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

var layer = getFirstSelectedLayer(TextLayer);
alert(layer)
