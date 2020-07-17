// app.executeCommand(app.findMenuCommandId("Convert to Editable Text"));
var psd_files = File.openDialog("please select psd files", "*.psd", true);
if (psd_files) {
  var importOptions = new ImportOptions();

  for (var i = 0; i < psd_files.length; i++) {
    importOptions.file = psd_files[i];
    importOptions.importAs = ImportAsType.COMP;
    var comp = app.project.importFile(importOptions);
    comp.selected = true;

    // for (var j = 1; j < comp.numLayers + 1; j++) {
    //   var layer = comp.layers[j];
    // }
  }
}
// alert("hello world!");
// alert(app.project.activeItem.name)
// var keys = [];
// var obj = app.project;
// for (var key in obj) {
//   if (obj.hasOwnProperty(key)) {
//     keys.push(key);
//   }
// }
// alert(keys);

function openCompPanel(thisComp)
{
// remember the original work area duration
var duration = thisComp.workAreaDuration;

// temporarily set the work area to 2 frames
// I know, I should use the comp fps to calculate it,
// but I only work in NTSC 30 fps.
// Anything less than 2 frames makes AE barf
thisComp.workAreaDuration = 0.06;

// make a 2 frame ram preview which forces the comp window to open
// I don't know the first and last arguments, and they may not want
// strings, but this works for me. The second argument is a scaling
// factor for the viewport. Use 0.5 for 50%, etc.
thisComp.ramPreviewTest(1.0,1.0,0);

// Play nice and put things back the way they were
thisComp.workAreaDuration = duration;
}

var comp = app.project.item(1);
openCompPanel(comp)
