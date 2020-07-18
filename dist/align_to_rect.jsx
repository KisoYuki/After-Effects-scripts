var dig_bounds = [0, 0, 300, 150];

function centerBounds(refBounds, y, width, height) {
  refWidth = refBounds[2] - refBounds[0];
  y = refBounds[1] + y;
  difWidth = (refWidth - width) / 2;
  return [difWidth, y, difWidth + width, y + height];
}

function createDialog(title, message) {
  var dig = new Window('dialog', title, dig_bounds);
  dig.sText = dig.add('statictext', centerBounds(dig_bounds, 20, 200, 30), message);
  dig.sText.justify = 'center';
  dig.btn = dig.add('button', centerBounds(dig_bounds, 100, 150, 40), "OK!", {
    name: "ok"
  });
  dig.center();
  return dig;
}

function getBoundingBoxMetrix(shape_layer) {
  var rect = shape_layer.sourceRectAtTime(0, false);
  var pos = shape_layer.property("Position").value;
  var left = pos[0] + rect.left;
  var top = pos[1] + rect.top;
  var right = left + rect.width;
  var bottom = top + rect.height;
  return {
    left: left,
    top: top,
    right: right,
    bottom: bottom
  };
}

function align(target_layer, metrix, vert, horiz) {
  var rect = target_layer.sourceRectAtTime(0, false);
  target_layer.property("Anchor Point").setValue([rect.left + rect.width / 2, rect.top + rect.height / 2]);
  var pos = target_layer.property("Position").value;
  var x = pos[0];
  var y = pos[1];

  if (vert == 'middle') {
    y = metrix.top + (metrix.bottom - metrix.top) / 2;
  } else if (vert == 'top') {
    y = metrix.top + rect.height / 2;
  } else if (vert == 'bottom') {
    y = metrix.bottom - rect.height / 2;
  }

  if (horiz == 'center') {
    x = metrix.left + (metrix.right - metrix.left) / 2;
  } else if (horiz == 'left') {
    x = metrix.left + rect.width / 2;
  } else if (horiz == 'right') {
    x = metrix.right - rect.width / 2;
  }

  target_layer.property("Position").setValue([x, y]);
}

function selectAlignment() {
  var vertDig = createDialog("Select vertical alignments", "Vertical align by..");
  vertDig.dropdown = vertDig.add('dropdownlist', centerBounds(dig_bounds, 50, 220, 30), ['top', 'middle', 'bottom']);
  vertDig.dropdown.selection = 1;
  vertDig.show();
  var horDig = createDialog("Select horizontal alignments", "Horizontal align by..");
  horDig.dropdown = horDig.add('dropdownlist', centerBounds(dig_bounds, 50, 220, 30), ['left', 'center', 'right']);
  horDig.dropdown.selection = 1;
  horDig.show();
  return [vertDig.dropdown.selection.toString(), horDig.dropdown.selection.toString()];
}

function alignLayersToRect(layers, metrix, selected_aligns) {
  for (var i = 0; i < layers.length; i++) {
    var layer = layers[i];

    if (layer === shape_layer) {
      continue;
    }

    align(layer, metrix, selected_aligns[0], selected_aligns[1]);
  }
}