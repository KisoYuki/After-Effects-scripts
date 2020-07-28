// ref: https://qiita.com/TimeToEdit/items/90f9d8502285327803c0
var thisFile = new File(this); //jsxのファイルを取得
var thisFolderPath = thisFile.path; //jsxのフォルダパスを取得


//~ ~~~~~~~~~~~~~~~Scriot UI ~~~~~~~~~~~~~~~

var winObj = (this instanceof Panel) ? this : new Window('palette', 'Auto Slide Show', undefined, {
  resizeable: true
});

var contentsGrp = winObj.add('group', undefined, 'contentsGrp');
contentsGrp.orientation = 'column';
try {
  var myBannerPath = new File(thisFolderPath + '/youtool_common/Ae_Script_banner.png');
  var banner = contentsGrp.add('image', undefined, myBannerPath);
  banner.alignment = [ScriptUI.Alignment.LEFT, ScriptUI.Alignment.CENTER];
  //~     banner.alignment = [ScriptUI.Alignment.LEFT,ScriptUI.Alignment.CENTER]
} catch (e) {}

var box01 = [0, 0, 60, 20];
var box02 = [0, 0, 70, 20];

var tab = contentsGrp.add('tabbedpanel');
var tabSetting = tab.add('tab', undefined, 'Set');
var tabEdit = tab.add('tab', undefined, 'Edit');
tabSetting.alignChildren = 'left';
var compSettingPnl = tabSetting.add('panel', undefined, 'comp Setting');
var compSettingGrp = compSettingPnl.add('group', undefined, 'compSettingGrp');
compSettingGrp.orientation = 'row';
compSettingGrp.alignment = [ScriptUI.Alignment.LEFT, ScriptUI.Alignment.CENTER];
var compSettingGrpLeft = compSettingGrp.add('group', undefined, 'compSettingGrpLeft');
compSettingGrpLeft.orientation = 'column';
compSettingGrpLeft.alignChildren = 'left';
compSettingGrpLeft.add('statictext', undefined, 'Width:');
compSettingGrpLeft.add('statictext', undefined, 'Height:');
compSettingGrpLeft.add('statictext', undefined, 'PAR:');
compSettingGrpLeft.add('statictext', undefined, 'FrameRate:');

var compSettingGrpRight = compSettingGrp.add('group', undefined, 'compSettingGrpRight');
compSettingGrpRight.orientation = 'column';
compSettingGrpRight.alignChildren = 'left';
var compSettingGrpRightGrp001 = compSettingGrpRight.add('group', undefined, '001');
compSettingGrpRightGrp001.orientation = 'row';
compSettingGrpRightGrp001.add('edittext', box01, '1920');
compSettingGrpRightGrp001.add('statictext', undefined, 'px');
var compSettingGrpRightGrp002 = compSettingGrpRight.add('group', undefined, '002');
compSettingGrpRightGrp002.orientation = 'row';
compSettingGrpRightGrp002.add('edittext', box01, '1080');
compSettingGrpRightGrp002.add('statictext', undefined, 'px');
var compSettingGrpRightGrp003 = compSettingGrpRight.add('group', undefined, '003');
compSettingGrpRightGrp003.add('edittext', box01, '1.0');

var compSettingGrpRightGrp004 = compSettingGrpRight.add('group', undefined, '004');
compSettingGrpRightGrp004.orientation = 'row';
var FRDDL = compSettingGrpRightGrp004.add('dropdownlist', box01);
FRDDL.add('item', '8');
FRDDL.add('item', '12');
FRDDL.add('item', '15');
FRDDL.add('item', '23.976');
FRDDL.add('item', '24');
FRDDL.add('item', '25');
FRDDL.add('item', '29.97');
FRDDL.add('item', '30');
FRDDL.add('item', '50');
FRDDL.add('item', '59.94');
FRDDL.add('item', '60');
FRDDL.add('item', '120');
FRDDL.selection = 7;
compSettingGrpRightGrp004.add('statictext', undefined, 'fps');


var pictureSettingPnl = tabSetting.add('panel', undefined, 'pictureSetting');
var pictureSettingPnlGrp = pictureSettingPnl.add('group', undefined, 'pictureSettingPnlGrp');
pictureSettingPnlGrp.orientation = 'row';
pictureSettingPnlGrp.alignment = [ScriptUI.Alignment.LEFT, ScriptUI.Alignment.CENTER];
var pictureSettingPnlGrpLeft = pictureSettingPnlGrp.add('group', undefined, 'pictureSettingPnlGrpLeft');
pictureSettingPnlGrpLeft.orientation = 'column';
pictureSettingPnlGrpLeft.alignChildren = 'left';
var durEdit = pictureSettingPnlGrpLeft.add('statictext', undefined, 'Duration:');
var zoomEdit = pictureSettingPnlGrpLeft.add('statictext', undefined, 'ZoomSpeed:');
var animationscall = pictureSettingPnlGrpLeft.add('statictext', undefined, 'animation scall:');

var pictureSettingPnlGrpRight = pictureSettingPnlGrp.add('group', undefined, 'pictureSettingPnlGrpRight');
pictureSettingPnlGrpRight.orientation = 'column';
pictureSettingPnlGrpRight.alignChildren = 'left';
var compSettingGrpRightGrp001 = pictureSettingPnlGrpRight.add('group', undefined, 'compSettingGrpRightGrp001');
compSettingGrpRightGrp001.orientation = 'row';
var user_compDuration = compSettingGrpRightGrp001.add('edittext', box02, '00:00:05:00');
var compSettingGrpRightGrp002 = pictureSettingPnlGrpRight.add('group', undefined, 'compSettingGrpRightGrp002');
compSettingGrpRightGrp002.orientation = 'row';
compSettingGrpRightGrp002.add('edittext', box02, '10');
compSettingGrpRightGrp002.add('statictext', undefined, '%/Dur');

var compSettingGrpRightGrp003 = pictureSettingPnlGrpRight.add('group', undefined, 'compSettingGrpRightGrp003');
compSettingGrpRightGrp003.orientation = 'row';
var scallAniList = compSettingGrpRightGrp003.add('dropdownlist', undefined);
scallAniList.add('item', 'none');
scallAniList.add('item', 'Up');
scallAniList.add('item', 'Down');
scallAniList.add('item', 'Ramdom');
scallAniList.selection = 3;


var FinalCompSettingPnl = tabSetting.add('panel', undefined, 'FinalCompSettingPnl');
var FinalCompSettingPnlGrp = FinalCompSettingPnl.add('group', undefined, 'FinalCompSettingPnllGrp');
FinalCompSettingPnlGrp.orientation = 'column';
FinalCompSettingPnlGrp.alignChildren = 'left';
var FinalCompSettingPnlGrpGrp001 = FinalCompSettingPnlGrp.add('group', undefined, 'FinalCompSettingPnlGrpGrp001');
var overRap = FinalCompSettingPnlGrpGrp001.add('checkbox', undefined, 'OverLap');
var FinalCompSettingPnlGrpGrp002 = FinalCompSettingPnlGrp.add('group', undefined, 'FinalCompSettingPnlGrpGrp001');
FinalCompSettingPnlGrpGrp002.orientation = 'row';
var FinalCompSettingPnlGrpLeft = FinalCompSettingPnlGrpGrp002.add('group', undefined, 'pictureSettingPnlGrpLeft');
FinalCompSettingPnlGrpLeft.orientation = 'column';
FinalCompSettingPnlGrpLeft.alignChildren = 'left';
var FinalCompSettingPnlGrpLeftGrp001 = FinalCompSettingPnlGrpLeft.add('statictext', undefined, 'Duration:');
var FinalCompSettingPnlGrpLeftGrp002 = FinalCompSettingPnlGrpLeft.add('statictext', undefined, 'Transition:');

var FinalCompSettingPnlGrpRight = FinalCompSettingPnlGrpGrp002.add('group', undefined, 'FinalCompSettingPnlGrpRight');
FinalCompSettingPnlGrpRight.orientation = 'column';
FinalCompSettingPnlGrpRight.alignChildren = 'left';
var FinalCompSettingPnlGrpRightGrp001 = FinalCompSettingPnlGrpRight.add('group');
FinalCompSettingPnlGrpRightGrp001.orientation = 'row';
var FCEditText = FinalCompSettingPnlGrpRightGrp001.add('edittext', box02, '00:00:01:00');

var FinalCompSettingPnlGrpRightGrp002 = FinalCompSettingPnlGrpRight.add('group');
FinalCompSettingPnlGrpRightGrp002.orientation = 'row';
var FCTransitionGrp = FinalCompSettingPnlGrpRightGrp002.add('group');
var FCTiList = FCTransitionGrp.add('dropdownlist', undefined);
var FCTdef = FCTiList.add('item', 'Off');
FCTiList.add('item', 'Dissolve the front layer');
FCTiList.add('item', 'Cross dissolve  front  and back layer');
FCTiList.selection = FCTdef;

FinalCompSettingPnlGrpRight.enabled = false;
FinalCompSettingPnlGrpRight.enabled = false;

var buttonGrp = tabSetting.add('group', undefined, 'buttonGrp');
buttonGrp.orientation = 'row';
buttonGrp.alignment = [ScriptUI.Alignment.RIGHT, ScriptUI.Alignment.CENTER];

//Button
var csvLoadBtn = buttonGrp.add('button', undefined, 'Load CSV');
var executionBtn = buttonGrp.add('button', undefined, 'Execution');

//~ ~~~~~~~~UI setting~~~~~~~~
tabSetting.spacing = 20;
tabSetting.margins = 10;

compSettingGrpLeft.spacing = 18;
compSettingGrpLeft.margins = 0;

pictureSettingPnlGrpLeft.spacing = 18;
pictureSettingPnlGrpLeft.margins = 0;

FinalCompSettingPnlGrpLeft.spacing = 18;
FinalCompSettingPnlGrpLeft.margins = 0;

//~ ~~~~~~~~UI setting~~~~~~~~

winObj.onResizing = winObj.onResize = function () {
  this.layout.resize();
};

if (winObj instanceof Window) {
  winObj.center();
  winObj.show();
} else {
  winObj.layout.layout(true);
  winObj.layout.resize();
}

user_compDuration.onDeactivate = function () {
  var temp = user_compDuration.text;
  var b = currentFormatToTime(temp, Math.ceil(FRDDL.selection.toString()), false);
  var c = timeToCurrentFormat(b, Math.ceil(FRDDL.selection.toString()), false);
  user_compDuration.text = c;
}


FCEditText.onDeactivate = function () {
  var temp = FCEditText.text;
  var b = currentFormatToTime(temp, Math.ceil(FRDDL.selection.toString()), false);
  var c = timeToCurrentFormat(b, Math.ceil(FRDDL.selection.toString()), false);
  FCEditText.text = c;
}


overRap.onClick = function () {
  if (overRap.value) {
    FinalCompSettingPnlGrpRight.enabled = true;
  } else {
    FinalCompSettingPnlGrpRight.enabled = false;
  }
}