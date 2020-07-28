// ref: https://sites.google.com/site/ihsuyotomakas/bagutokamemo
// ref: https://sites.google.com/view/youuu4/programming/scriptui

const defFadeSpeed = 815

function sayHello () {
  alert("hello!")
  Window.find("palette" , "My Tools").close()
}

function createUI (thisObj) {
  const palette = (thisObj instanceof Panel) ? thisObj : new Window(
    "palette", "Fade up text", undefined, {
      resizeable: true
      // alignChildren: ['fill', 'top']
    })
  const fadePanel = palette.add("panel", undefined, "Fade settings")
  fadePanel.alignment = "left"
  const fadeGroup = fadePanel.add("group", undefined, "fade setting group")
  fadeGroup.alignment = [ScriptUI.Alignment.LEFT, ScriptUI.Alignment.CENTER]
  const fadeLeft = fadeGroup.add("group", undefined, "fade left group")
  fadeLeft.resizeable = true
  fadeLeft.orientation = "column"
  fadeLeft.alignChildren = 'left';
  const fadeRight = fadeGroup.add("group", undefined, "fade right group")
  fadeRight.orientation = "column"
  fadeRight.alignChildren = 'left';
  const fileText = fadeLeft.add("statictext", undefined, "No text files")
  const fileButton = fadeRight.add("button", undefined, "Select files")
  fileButton.onClick = function () {
    const textFiles = File.openDialog("please select text files", "*.txt", true)
    let message
    if (textFiles.length == 0) {
      message = "please select text files"
    } else if (textFiles.length == 1) {
      message = "1 text file"
    } else {
      message = textFiles.length + " text files"
    }
    fileText.text = message
  }

  fadeLeft.add("statictext", undefined, "Speed")
  // fadeRight.add("edittext", undefined, "815")
  const speedGroup = fadeRight.add("group", undefined, "speed group")
  const speedSlider = speedGroup.add(
    "slider", undefined, defFadeSpeed, 10, defFadeSpeed * 2)
  const speedText = speedGroup.add("edittext", [0, 0, 35, 20], defFadeSpeed)
  speedSlider.onChanging = function () {
    speedText.text = Math.round(speedSlider.value)
  }
  speedText.onChange = function () {
    let num = Math.round(parseInt(speedText.text))
    if (isNaN(num)) {
      num = defFadeSpeed
    }
    num = Math.max(10, num)
    num = Math.min(defFadeSpeed * 2, num)
    speedSlider.value = num
    speedText.text = num
  }
  fadeLeft.add("statictext", undefined, "Interval time")
  fadeRight.add("edittext", undefined, "4.0")
  fadeLeft.add("checkbox", undefined, "Sequence layers")
  fadeRight.add("statictext", undefined, "")

  const audioPanel = palette.add("panel", undefined, "Audio settings")
  audioPanel.alignment = "left"
  const audioGroup = audioPanel.add("group", undefined, "audio setting group")
  audioGroup.orientation = "column"
  audioGroup.alignChildren = "left"
  const audioCheckbox = audioGroup.add("checkbox", undefined, "Make audio")
  const audioSubGroup = audioGroup.add("group", undefined, "audio sub group")
  audioSubGroup.alignment = [ScriptUI.Alignment.LEFT, ScriptUI.Alignment.CENTER]
  const audioLeft = audioSubGroup.add("group", undefined, "audio left group")
  audioLeft.orientation = "column"
  audioLeft.alignChildren = 'left';
  const audioRight = audioSubGroup.add("group", undefined, "audio right group")
  audioRight.orientation = "column"
  audioRight.alignChildren = 'left';
  audioLeft.add("statictext", undefined, "Audio dir")
  audioRight.add("button", undefined, "Select audio dir")
  audioLeft.add("statictext", undefined, "Speed")
  audioRight.add("edittext", undefined, "100")
  audioLeft.add("statictext", undefined, "pitch")
  audioRight.add("edittext", undefined, "100")
  audioSubGroup.enabled = false

  audioCheckbox.addEventListener("click", () => {
    if (audioCheckbox.value) {
      audioSubGroup.visible = true
      audioSubGroup.enabled = true
    } else {
      audioSubGroup.enabled = false
    }
  })

  // palette.add("statictext", [0, 0, 100, 20], "world")

  // const contentToAttr = {
  //   textLabel: {contentType: "statictext", text: "Text file:"},
  //   textBtn: {contentType: "button", text: "Text file:"},
  //   textLabel: {contentType: "statictext", text: "Text file:"},
  // }
  // const palette = (thisObj instanceof Panel) ? thisObj : new Window(
  //   "palette", "Fade up text", [300, 300, 600, 600])
  // fileLabel = palette.add("statictext", [10, 10, 280, 50], "Text file:")
  // fileLabel = palette.add("statictext", [10, 10, 280, 40], "Text file:")
  // fileLabel.justify = "center"
  // const fileBtn = palette.add("button", [10, 50, 280, 80], "Select text files")
  // palette.add("statictext", [10, 90, 140, 120], "Speed:")
  // const speedText = palette.add("edittext", [150, 90, 280, 120], "100")
  // const btn = palette.add("button", [10, 100, 40, 50], "Select text files")
  // btn.addEventListener("mousedown", selectTextFiles)
  // btn.addEventListener("click", selectTextFiles)
  // fileLabel = palette.add("statictext", [10, 50, 300, 300], "yes");

  // var value = w.add ('edittext {text: 0, characters: 3, justify: "center", active: true}');
  // var slider = w.add ('slider {minvalue: -50, maxvalue: 50, value: 50}');
  // slider.onChanging = function () {value.text = slider.value - 50}
  // value.onChanging = function () {slider.value = Number (value.text) + 50}
  // w.show();

  // palette.add("checkbox", [10, 40, 60, 100], "login");
  return palette;
}

var myToolsPanel = createUI(this);
myToolsPanel.show();
