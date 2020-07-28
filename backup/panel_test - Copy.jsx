// ref: https://sites.google.com/site/ihsuyotomakas/bagutokamemo
// ref: https://sites.google.com/view/youuu4/programming/scriptui

const defFadeSpeed = 815
const defInterval = 4
const defAudioSpeed = 100
const defAudioPitch = 100

function sliderAndText (slider, text, isInt) {
  const defaultVal = slider.value
  slider.onChanging = function () {
    if (isInt) {
      text.text = Math.round(slider.value)
    } else {
      text.text = slider.value.toFixed(2)
    }
  }
  text.onChange = function () {
    let num = parseFloat(text.text)
    if (isInt) {
      num = Math.round(num)
    } else {
      num = num.toFixed(2)
    }
    if (isNaN(num)) {
      num = defaultVal
    }
    num = Math.max(slider.minvalue, num)
    num = Math.min(slider.maxvalue, num)
    slider.value = num
    text.text = num
  }
}

function createUI (thisObj) {
  const palette = (thisObj instanceof Panel) ? thisObj : new Window(
    "palette", "Fade up text", undefined, {
      resizeable: true
      // alignChildren: ['fill', 'top']
    })
  const fadePanel = palette.add("panel", undefined, "Fade settings")
  fadePanel.orientation = "column"
  fadePanel.alignChildren = "left"
  const fileGroup =  fadePanel.add("group", undefined, "file group")
  const fileText = fileGroup.add("statictext", undefined, "No text files")
  const fileButton = fileGroup.add("button", undefined, "Select files")
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
  const speedGroup = fadePanel.add("group", undefined, "speed group")
  speedGroup.add("statictext", undefined, "Speed")
  const speedSlider = speedGroup.add(
    "slider", undefined, defFadeSpeed, 10, defFadeSpeed * 2)
  const speedText = speedGroup.add("edittext", [0, 0, 35, 20], defFadeSpeed)
  sliderAndText(speedSlider, speedText, true)
  const intervalGroup = fadePanel.add("group", undefined, "interval group")
  intervalGroup.add("statictext", undefined, "Interval time")
  const intervalSlider = intervalGroup.add("slider", undefined, defInterval, 0, defInterval * 3)
  const intervalText = intervalGroup.add("edittext", [0, 0, 35, 20], defInterval)
  sliderAndText(intervalSlider, intervalText, false)
  fadePanel.add("checkbox", undefined, "Sequence layers")

  const audioPanel = palette.add("panel", undefined, "Audio settings")
  audioPanel.orientation = "column"
  audioPanel.alignment = "left"
  audioPanel.alignChildren = "left"
  const audioCheckbox = audioPanel.add("checkbox", undefined, "Make audio")
  const audioSubGroup = audioPanel.add("group", undefined, "audio sub group")
  audioSubGroup.orientation = "column"
  audioSubGroup.alignChildren = "left"
  const dirGroup = audioSubGroup.add("group", undefined, "dir group")
  const dirText = dirGroup.add("statictext", undefined, "No audio dir")
  const dirButton = dirGroup.add("button", undefined, "Slect audio dir")
  const audioSpeedGroup = audioSubGroup.add("group", undefined, "audio speed group")
  audioSpeedGroup.add("statictext", undefined, "Speed")
  const audioSpeedSlider = audioSpeedGroup.add("slider", undefined, defAudioSpeed, 1, defAudioSpeed * 3)
  const audioSpeedText = audioSpeedGroup.add("edittext", [0, 0, 35, 20], defAudioSpeed)
  sliderAndText(audioSpeedSlider, audioSpeedText, true)
  const audioPitchGroup = audioSubGroup.add("group", undefined, "audio speed group")
  audioPitchGroup.add("statictext", undefined, "Pitch")
  const audioPitchSlider = audioPitchGroup.add("slider", undefined, defAudioPitch, 1, defAudioPitch * 3)
  const audioPitchText = audioPitchGroup.add("edittext", [0, 0, 35, 20], defAudioPitch)
  sliderAndText(audioPitchSlider, audioPitchText, true)

  // audioLeft.orientation = "column"
  // audioLeft.alignChildren = 'left';
  // const audioRight = audioSubGroup.add("group", undefined, "audio right group")
  // audioRight.orientation = "column"
  // audioRight.alignChildren = 'left';
  // audioLeft.add("statictext", undefined, "Audio dir")
  // audioRight.add("button", undefined, "Select audio dir")
  // audioLeft.add("statictext", undefined, "Speed")
  // audioRight.add("edittext", undefined, "100")
  // audioLeft.add("statictext", undefined, "pitch")
  // audioRight.add("edittext", undefined, "100")
  // audioSubGroup.enabled = false

  // audioCheckbox.addEventListener("click", () => {
  //   if (audioCheckbox.value) {
  //     audioSubGroup.visible = true
  //     audioSubGroup.enabled = true
  //   } else {
  //     audioSubGroup.enabled = false
  //   }
  // })

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
