function CytterTypePrefsDialog(selectedIndex) {

    var ManualMarksList_array = [];

    var lastSelected = 0;

    var isChanged = false;

    var isOk = {
        name: false,
        size: false,
        margins: false,
        spaceBetween: false,
        color: false,
        overcut: false,
        marks: false
    }

    const defaults = {
        CutterNameText: '',
        CutterLabelText: '',
        SheetNameText: '',
        WidthValue: 50,
        HeightValue: 50,
        TopValue: 0,
        RightValue: 0,
        BottomValue: 0,
        LeftValue: 0,
        SBminValue: 0.5,
        SBmaxValue: 0.5,
        CyanValue: 0,
        MagentaValue: 0,
        YellowValue: 0,
        BlackValue: 0,
        LineWidthValue: 0.1,
        OvercutValue: 0,
        FileFormats: 0,
        MarksExternalFileChk: false,
        MarksExternalFilePath: '',
        WorkspaceShrinkChk: false
    }

    var CutterType_array = [translate('Add new')];
	for (var i = 0; i < CUTTER_TYPES.length; i++) {
		CutterType_array.push(CUTTER_TYPES[i].text);
	}

    // CYTTERTYPEPREFSWINDOW
    // =====================
    var CytterTypePrefsWindow = new Window("dialog"); 
        CytterTypePrefsWindow.text = translate('Cytter Prefs Window'); 
        CytterTypePrefsWindow.preferredSize.width = 500; 
        CytterTypePrefsWindow.preferredSize.height = 600; 
        CytterTypePrefsWindow.orientation = "column"; 
        CytterTypePrefsWindow.alignChildren = ["fill","top"]; 
        CytterTypePrefsWindow.spacing = 10; 
        CytterTypePrefsWindow.margins = 15;

        CytterTypePrefsWindow.onShow = CutterTypeListSelected;
        CytterTypePrefsWindow.onClose = function() {
            checkIfNotSaved();
        };

    // CUTTERTYPETOPGROUP
    // ==================
    var CutterTypeTopGroup = CytterTypePrefsWindow.add("group", undefined, {name: "CutterTypeTopGroup"}); 
        CutterTypeTopGroup.orientation = "column"; 
        CutterTypeTopGroup.alignChildren = ["left","center"]; 
        CutterTypeTopGroup.spacing = 10; 
        CutterTypeTopGroup.margins = 0; 

    var CutterTypeList_array = CutterType_array; 
    var CutterTypeList = CutterTypeTopGroup.add("dropdownlist", undefined, undefined, {name: "CutterTypeList", items: CutterTypeList_array}); 
        CutterTypeList.selection = 0; 
        CutterTypeList.preferredSize.width = 300; 
        CutterTypeList.alignment = ["left","fill"]; 
        CutterTypeList.selection = CutterTypeList_array.length > selectedIndex + 1 ? selectedIndex + 1 : 0;
        CutterTypeList.addEventListener('change', CutterTypeListSelected);

    var CutterTypeBtnsGroup = CutterTypeTopGroup.add("group", undefined, {name: "CutterTypeBtnsGroup"}); 
        CutterTypeBtnsGroup.orientation = "row"; 
        CutterTypeBtnsGroup.alignChildren = ["left","center"]; 
        CutterTypeBtnsGroup.spacing = 10; 
        CutterTypeBtnsGroup.margins = 0; 
        CutterTypeBtnsGroup.alignment = ["fill","fill"]; 

    var CopyNewBtn = CutterTypeBtnsGroup.add("button", undefined, undefined, {name: "CopyNewBtn"}); 
        CopyNewBtn.enabled = false;
        CopyNewBtn.text = translate('Duplicate');
        CopyNewBtn.onClick = CopyNewPlotter; 

    var SaveCurrentBtn = CutterTypeBtnsGroup.add("button", undefined, undefined, {name: "SaveCurrentBtn"}); 
        SaveCurrentBtn.enabled = false;
        SaveCurrentBtn.text = translate('Save'); 
        SaveCurrentBtn.onClick = savePlotter;

    var RemoveCurrentBtn = CutterTypeBtnsGroup.add("button", undefined, undefined, {name: "RemoveCurrentBtn"}); 
        RemoveCurrentBtn.enabled = false;
        RemoveCurrentBtn.text = translate('Remove'); 
        RemoveCurrentBtn.onClick = removePlotter; 

    var CloseBtn = CutterTypeBtnsGroup.add("button", undefined, undefined, {name: "CloseBtn"}); 
        CloseBtn.enabled = true;
        CloseBtn.text = translate('Close');
        CloseBtn.alignment = ["right","fill"];
        CloseBtn.onClick = function() {
            CytterTypePrefsWindow.close();
        }; 

    // CYTTERTYPEPREFSWINDOW
    // =====================
    var divider1 = CytterTypePrefsWindow.add("panel", undefined, undefined, {name: "divider1"}); 
        divider1.alignment = "fill"; 

    // NAMEGROUP
    // =========
    var NameGroup = CytterTypePrefsWindow.add("group", undefined, {name: "NameGroup"}); 
        NameGroup.orientation = "row"; 
        NameGroup.alignChildren = ["left","center"]; 
        NameGroup.spacing = 10; 
        NameGroup.margins = 0; 
        NameGroup.alignment = ["fill","top"]; 

    var CutterNameLabel = NameGroup.add("statictext", undefined, undefined, {name: "CutterNameLabel"}); 
        CutterNameLabel.text = translate('Cutter name label'); 

    var CutterNameText = NameGroup.add('edittext {properties: {name: "CutterNameText"}}'); 
        CutterNameText.text = defaults.CutterNameText; 
        CutterNameText.preferredSize.width = 250; 
        CutterNameText.alignment = ["left","fill"]; 
        CutterNameText.onChange = prefsChanged;
        
    var CutterLabelText = NameGroup.add('edittext {properties: {name: "CutterLabelText"}}'); 
        CutterLabelText.text = defaults.CutterLabelText; 
        CutterLabelText.preferredSize.width = 80; 
        CutterLabelText.helpTip = translate('Cutter label tip'); 
        CutterLabelText.alignment = ["left","fill"]; 
        CutterLabelText.onChange = prefsChanged; 

    // DOCUMENTSETTINGSPANEL
    // =====================
    var DocumentSettingsPanel = CytterTypePrefsWindow.add("panel", undefined, undefined, {name: "DocumentSettingsPanel"}); 
        DocumentSettingsPanel.text =  translate('Document settings'); 
        DocumentSettingsPanel.orientation = "column"; 
        DocumentSettingsPanel.alignChildren = ["fill","top"]; 
        DocumentSettingsPanel.spacing = 10; 
        DocumentSettingsPanel.margins = 10; 

    // SHEETGROUP
    // ==========
    var SheetGroup = DocumentSettingsPanel.add("group", undefined, {name: "SheetGroup"}); 
        SheetGroup.orientation = "row"; 
        SheetGroup.alignChildren = ["left","center"]; 
        SheetGroup.spacing = 10; 
        SheetGroup.margins = 0; 
        SheetGroup.alignment = ["fill","top"]; 

    var SheetSizeLabel = SheetGroup.add("statictext", undefined, undefined, {name: "SheetSizeLabel"}); 
        SheetSizeLabel.text = translate('Sheet size');

    var WidthValueLabel = SheetGroup.add("statictext", undefined, undefined, {name: "WidthValueLabel"}); 
        WidthValueLabel.text = translate('Width Label');  

    var WidthValue = SheetGroup.add('edittext {properties: {name: "WidthValue"}}'); 
        WidthValue.helpTip = translate('Sheet width tip'); 
        WidthValue.text = defaults.WidthValue; 
        WidthValue.preferredSize.width = 60; 
        WidthValue.alignment = ["left","fill"]; 
        WidthValue.onChange = prefsChanged;

    var HeightValueLabel = SheetGroup.add("statictext", undefined, undefined, {name: "HeightValueLabel"}); 
        HeightValueLabel.text = translate('Height Label'); 

    var HeightValue = SheetGroup.add('edittext {properties: {name: "HeightValue"}}'); 
        HeightValue.helpTip = translate('Sheet width tip'); 
        HeightValue.text = defaults.HeightValue; 
        HeightValue.preferredSize.width = 60; 
        HeightValue.alignment = ["left","fill"]; 
        HeightValue.onChange = prefsChanged; 

    var SheetNameLabel = SheetGroup.add("statictext", undefined, undefined, {name: "SheetNameLabel"}); 
        SheetNameLabel.text = translate('Paper name'); 

    var SheetNameText = SheetGroup.add('edittext {properties: {name: "SheetNameText"}}'); 
        SheetNameText.helpTip = translate('Paper name tip'); 
        SheetNameText.text = defaults.SheetNameText; 
        SheetNameText.preferredSize.width = 70; 
        SheetNameText.alignment = ["left","fill"];

    // MARGINSGROUP
    // ============
    var MarginsGroup = DocumentSettingsPanel.add("group", undefined, {name: "MarginsGroup"}); 
        MarginsGroup.orientation = "row"; 
        MarginsGroup.alignChildren = ["left","center"]; 
        MarginsGroup.spacing = 10; 
        MarginsGroup.margins = 0; 
        MarginsGroup.alignment = ["fill","top"]; 

    var MarginsLabel = MarginsGroup.add("statictext", undefined, undefined, {name: "MarginsLabel"}); 
        MarginsLabel.text = translate('Margins label');

    var TopLabel = MarginsGroup.add("statictext", undefined, undefined, {name: "TopLabel"}); 
        TopLabel.text = translate('Top label'); 

    var TopValue = MarginsGroup.add('edittext {properties: {name: "TopValue"}}'); 
        TopValue.helpTip = translate('Margin value tip');
        TopValue.text = defaults.TopValue; 
        TopValue.preferredSize.width = 45; 
        TopValue.alignment = ["left","fill"]; 
        TopValue.onChange = prefsChanged; 

    var RightLabel = MarginsGroup.add("statictext", undefined, undefined, {name: "RightLabel"}); 
        RightLabel.text = translate('Right label'); 

    var RightValue = MarginsGroup.add('edittext {properties: {name: "RightValue"}}'); 
        RightValue.helpTip = translate('Margin value tip');
        RightValue.text = defaults.TopValue; 
        RightValue.preferredSize.width = 45; 
        RightValue.alignment = ["left","fill"]; 
        RightValue.onChange = prefsChanged; 

    var BottomLabel = MarginsGroup.add("statictext", undefined, undefined, {name: "BottomLabel"}); 
        BottomLabel.text = translate('Bottom label'); 

    var BottomValue = MarginsGroup.add('edittext {properties: {name: "BottomValue"}}'); 
        BottomValue.helpTip = translate('Margin value tip');
        BottomValue.text = defaults.BottomValue; 
        BottomValue.preferredSize.width = 45; 
        BottomValue.alignment = ["left","fill"]; 
        BottomValue.onChange = prefsChanged; 

    var LeftLabel = MarginsGroup.add("statictext", undefined, undefined, {name: "LeftLabel"}); 
        LeftLabel.text = translate('Left label'); 

    var LeftValue = MarginsGroup.add('edittext {properties: {name: "LeftValue"}}'); 
        LeftValue.helpTip = translate('Margin value tip');
        LeftValue.text = defaults.LeftValue; 
        LeftValue.preferredSize.width = 45; 
        LeftValue.alignment = ["left","fill"]; 
        LeftValue.onChange = prefsChanged;        

    // ROW3
    // ====
    var Row3 = DocumentSettingsPanel.add("group", undefined, {name: "Row3"}); 
        Row3.orientation = "row"; 
        Row3.alignChildren = ["left","center"]; 
        Row3.spacing = 10; 
        Row3.margins = 0; 

    // WorkspaceShrinkChk
    // ==================
    var WorkspaceShrinkChk = Row3.add("checkbox", undefined, undefined, {name: "WorkspaceShrinkChk"}); 
        WorkspaceShrinkChk.text = translate('Workspace Shrink');
        WorkspaceShrinkChk.enabled = defaults.WorkspaceShrinkChk;
        WorkspaceShrinkChk.value = defaults.WorkspaceShrinkChk;
        WorkspaceShrinkChk.onClick = function() {
            CopyNewBtn.enabled = false;
            SaveCurrentBtn.enabled = true;
        };

    // CONTOURSPANELS
    // ==============
    var ContoursPanels = CytterTypePrefsWindow.add("panel", undefined, undefined, {name: "ContoursPanels"}); 
        ContoursPanels.text = translate('Contours panel');
        ContoursPanels.orientation = "column"; 
        ContoursPanels.alignChildren = ["left","top"]; 
        ContoursPanels.spacing = 10; 
        ContoursPanels.margins = 10; 
        ContoursPanels.alignment = ["fill","top"]; 

    // SPACEBETWEENGROUP
    // =================
    var SpaceBetweenGroup = ContoursPanels.add("group", undefined, {name: "SpaceBetweenGroup"}); 
        SpaceBetweenGroup.orientation = "row"; 
        SpaceBetweenGroup.alignChildren = ["left","center"]; 
        SpaceBetweenGroup.spacing = 10; 
        SpaceBetweenGroup.margins = 0; 
        SpaceBetweenGroup.alignment = ["fill","top"]; 

    var SpaceBetweenMinLabel = SpaceBetweenGroup.add("statictext", undefined, undefined, {name: "SpaceBetweenMinLabel"}); 
        SpaceBetweenMinLabel.text = translate('Space between min');

    var SBminValue = SpaceBetweenGroup.add('edittext {properties: {name: "SBminValue"}}'); 
        SBminValue.helpTip = translate('Space between min tip');
        SBminValue.text = defaults.SBminValue; 
        SBminValue.preferredSize.width = 80; 
        SBminValue.alignment = ["left","fill"]; 
        SBminValue.onChange = prefsChanged; 

    var SpaceBetweenMaxLabel = SpaceBetweenGroup.add("statictext", undefined, undefined, {name: "SpaceBetweenMaxLabel"}); 
        SpaceBetweenMaxLabel.text = translate('Space between max');

    var SBmaxValue = SpaceBetweenGroup.add('edittext {properties: {name: "SBmaxValue"}}'); 
        SBmaxValue.helpTip = translate('Space between max tip');
        SBmaxValue.text = defaults.SBmaxValue; 
        SBmaxValue.preferredSize.width = 80; 
        SBmaxValue.alignment = ["left","fill"]; 
        SBmaxValue.onChange = prefsChanged; 

    // CONTOURCOLORGROUP
    // =================
    var ContourColorGroup = ContoursPanels.add("group", undefined, {name: "ContourColorGroup"}); 
        ContourColorGroup.orientation = "row"; 
        ContourColorGroup.alignChildren = ["left","center"]; 
        ContourColorGroup.spacing = 10; 
        ContourColorGroup.margins = 0; 
        ContourColorGroup.alignment = ["fill","top"]; 

    var ColorLabel = ContourColorGroup.add("statictext", undefined, undefined, {name: "ColorLabel"}); 
        ColorLabel.text = translate('Contour color');

    var CyanLabel = ContourColorGroup.add("statictext", undefined, undefined, {name: "CyanLabel"}); 
        CyanLabel.text = "C"; 

    var CyanValue = ContourColorGroup.add('edittext {properties: {name: "CyanValue"}}'); 
        CyanValue.helpTip = translate('Contour color tip');
        CyanValue.text = defaults.CyanValue; 
        CyanValue.preferredSize.width = 60; 
        CyanValue.alignment = ["left","fill"]; 
        CyanValue.onChange = prefsChanged; 

    var MagentaLabel = ContourColorGroup.add("statictext", undefined, undefined, {name: "MagentaLabel"}); 
        MagentaLabel.text = "M"; 

    var MagentaValue = ContourColorGroup.add('edittext {properties: {name: "MagentaValue"}}'); 
        MagentaValue.helpTip = translate('Contour color tip');
        MagentaValue.text = defaults.MagentaValue; 
        MagentaValue.preferredSize.width = 60; 
        MagentaValue.alignment = ["left","fill"]; 
        MagentaValue.onChange = prefsChanged; 

    var YellowLabel = ContourColorGroup.add("statictext", undefined, undefined, {name: "YellowLabel"}); 
        YellowLabel.text = "Y"; 

    var YellowValue = ContourColorGroup.add('edittext {properties: {name: "YellowValue"}}'); 
        YellowValue.helpTip = translate('Contour color tip');
        YellowValue.text = defaults.YellowValue; 
        YellowValue.preferredSize.width = 60; 
        YellowValue.alignment = ["left","fill"]; 
        YellowValue.onChange = prefsChanged; 

    var BlackLabel = ContourColorGroup.add("statictext", undefined, undefined, {name: "BlackLabel"}); 
        BlackLabel.text = "K"; 

    var BlackValue = ContourColorGroup.add('edittext {properties: {name: "BlackValue"}}'); 
        BlackValue.helpTip = translate('Contour color tip');
        BlackValue.text = defaults.BlackValue; 
        BlackValue.preferredSize.width = 60; 
        BlackValue.alignment = ["left","fill"]; 
        BlackValue.onChange = prefsChanged; 

    // ROW1
    // ====
    var Row1 = ContoursPanels.add("group", undefined, {name: "Row1"}); 
        Row1.orientation = "row"; 
        Row1.alignChildren = ["left","center"]; 
        Row1.spacing = 10; 
        Row1.margins = 0;

    // LINEWIDTHGROUP
    // ==============
    var LineWidthGroup = Row1.add("group", undefined, {name: "LineWidthGroup"}); 
        LineWidthGroup.orientation = "row"; 
        LineWidthGroup.alignChildren = ["left","center"]; 
        LineWidthGroup.spacing = 10; 
        LineWidthGroup.margins = 0; 
        LineWidthGroup.alignment = ["left","fill"]; 

    var LineWidthLabel = LineWidthGroup.add("statictext", undefined, undefined, {name: "LineWidthLabel"}); 
        LineWidthLabel.text = translate('Line Width label');

    var LineWidthValue = LineWidthGroup.add('edittext {properties: {name: "LineWidthValue"}}'); 
        LineWidthValue.helpTip = translate('Line Width tip');
        LineWidthValue.text = defaults.LineWidthValue; 
        LineWidthValue.preferredSize.width = 60; 
        LineWidthValue.alignment = ["left","fill"]; 
        LineWidthValue.onChange = prefsChanged; 

    // OVERCUTGROUP
    // ============
    var OvercutGroup = Row1.add("group", undefined, {name: "OvercutGroup"}); 
        OvercutGroup.orientation = "row"; 
        OvercutGroup.alignChildren = ["left","center"]; 
        OvercutGroup.spacing = 10; 
        OvercutGroup.margins = 0; 
        OvercutGroup.alignment = ["left","fill"]; 

    var OvercutLabel = OvercutGroup.add("statictext", undefined, undefined, {name: "OvercutLabel"}); 
        OvercutLabel.text = translate('Overcut label');

    var OvercutValue = OvercutGroup.add('edittext {properties: {name: "OvercutValue"}}'); 
        OvercutValue.helpTip = translate('Overcut value tip');
        OvercutValue.text = defaults.OvercutValue; 
        OvercutValue.preferredSize.width = 60; 
        OvercutValue.alignment = ["left","fill"]; 
        OvercutValue.onChange = prefsChanged;  

    // FILEFORMATGROUP
    // ===============
    var FileFormatGroup = Row1.add("group", undefined, {name: "FileFormatGroup"}); 
        FileFormatGroup.orientation = "row"; 
        FileFormatGroup.alignChildren = ["left","center"]; 
        FileFormatGroup.spacing = 10; 
        FileFormatGroup.margins = 0; 
        FileFormatGroup.alignment = ["left","fill"]; 

    var FileFormatLabel = FileFormatGroup.add("statictext", undefined, undefined, {name: "FileFormatLabel"}); 
        FileFormatLabel.text = translate('File format label');

    var FileFormats_array = ["PDF","AI","DXF"]; 
    var FileFormats = FileFormatGroup.add("dropdownlist", undefined, undefined, {name: "FileFormats", items: FileFormats_array}); 
        FileFormats.selection = defaults.FileFormats; 
        FileFormats.onChange = prefsChanged; 

    // MARKSEXTERNALFILEPANEL
    // ======================
    var MarksExternalFilePanel = CytterTypePrefsWindow.add("panel", undefined, undefined, {name: "MarksExternalFilePanel"}); 
        MarksExternalFilePanel.text = translate('Marks file source panel');
        MarksExternalFilePanel.orientation = "column"; 
        MarksExternalFilePanel.alignChildren = ["left","top"]; 
        MarksExternalFilePanel.spacing = 10; 
        MarksExternalFilePanel.margins = [10,15,10,10]; 

    var MarksExternalFileChk = MarksExternalFilePanel.add("checkbox", undefined, undefined, {name: "MarksExternalFileChk"}); 
        MarksExternalFileChk.text = translate('External file checkbox');
        MarksExternalFileChk.value = defaults.MarksExternalFileChk;
        MarksExternalFileChk.onClick = toggleMarksSource; 

    // ROW2
    // ====
    var Row2 = MarksExternalFilePanel.add("group", undefined, {name: "Row2"}); 
        Row2.orientation = "row"; 
        Row2.alignChildren = ["left","center"]; 
        Row2.spacing = 10; 
        Row2.margins = 0; 

    var MarksExternalFilePath = Row2.add('edittext {properties: {name: "MarksExternalFilePath", readonly: true}}'); 
        MarksExternalFilePath.enabled = false; 
        MarksExternalFilePath.text = defaults.MarksExternalFilePath; 
        MarksExternalFilePath.preferredSize.width = 330; 
        MarksExternalFilePath.alignment = ["left","fill"]; 
        MarksExternalFilePath.onChange = prefsChanged; 

    var MarksFilePickBtn = Row2.add("button", undefined, undefined, {name: "MarksFilePickBtn"}); 
        MarksFilePickBtn.enabled = false; 
        MarksFilePickBtn.text = translate('Choose btn');
        MarksFilePickBtn.onClick = getFile; 

    // MANUALMARKSPANEL
    // ================
    var ManualMarksPanel = CytterTypePrefsWindow.add("panel", undefined, undefined, {name: "ManualMarksPanel"}); 
        ManualMarksPanel.text = translate('Manual marks list panel');
        ManualMarksPanel.preferredSize.height = 170; 
        ManualMarksPanel.orientation = "column"; 
        ManualMarksPanel.alignChildren = ["fill","top"]; 
        ManualMarksPanel.spacing = 10; 
        ManualMarksPanel.margins = 10; 
        ManualMarksPanel.alignment = ["fill","top"]; 

    const columnTitles = [
            translate('Shape col'),
            translate('Position col'),
            translate('Size col'),
            translate('Margins col'),
            translate('Appearance col'),
        ];
    var ManualMarksList = ManualMarksPanel.add("listbox", undefined, undefined, {name: "ManualMarksList", numberOfColumns: 5, columnWidths: [60,80,60,90,100], columnTitles: columnTitles, showHeaders: true}); 
        ManualMarksList.selection = 0; 
        ManualMarksList.preferredSize.height = 120; 
        ManualMarksList.alignment = ["fill","top"];
		ManualMarksList.onChange = function() {
			if (ManualMarksList.selection) {
                CloneMarkBtn.enabled = true;
                RemoveMarkBtn.enabled = true;
                EditMarkBtn.enabled = true;
            } else {
                CloneMarkBtn.enabled = false;
                RemoveMarkBtn.enabled = false;
                EditMarkBtn.enabled = false;
            }
        };
        ManualMarksList.onDoubleClick = function() {
            if (!ManualMarksList.selection) return;
            const index = ManualMarksList.selection.index;
            editMark(ManualMarksList_array[index], index);
        };

    // MANUALMARKSBTNGROUP
    // ===================
    var ManualMarksBtnGroup = ManualMarksPanel.add("group", undefined, {name: "ManualMarksBtnGroup"}); 
        ManualMarksBtnGroup.orientation = "row"; 
        ManualMarksBtnGroup.alignChildren = ["center","bottom"]; 
        ManualMarksBtnGroup.spacing = 10; 
        ManualMarksBtnGroup.margins = 0; 
        ManualMarksBtnGroup.alignment = ["fill","top"]; 

    var AddMarkBtn = ManualMarksBtnGroup.add("button", undefined, undefined, {name: "AddMarkBtn"}); 
        AddMarkBtn.text = translate('Add mark btn'); 
        AddMarkBtn.alignment = ["center","fill"];
        AddMarkBtn.onClick = function() {
            editMark();
        };

    var EditMarkBtn = ManualMarksBtnGroup.add("button", undefined, undefined, {name: "EditMarkBtn"}); 
        EditMarkBtn.enabled = false; 
        EditMarkBtn.text = translate('Edit mark btn');
        EditMarkBtn.alignment = ["center","fill"]; 
        EditMarkBtn.onClick = function() {
            if (!ManualMarksList.selection) {
                CloneMarkBtn.enabled = false; 
                RemoveMarkBtn.enabled = false; 
                EditMarkBtn.enabled = false; 
                return;
            };
            const index = ManualMarksList.selection.index;
            editMark(ManualMarksList_array[index], index);
        };

    var CloneMarkBtn = ManualMarksBtnGroup.add("button", undefined, undefined, {name: "CloneMarkBtn"}); 
        CloneMarkBtn.enabled = false; 
        CloneMarkBtn.text = translate('Clone mark btn');
        CloneMarkBtn.alignment = ["center","fill"]; 
        CloneMarkBtn.onClick = function() {
            if (!ManualMarksList.selection) {
                CloneMarkBtn.enabled = false; 
                RemoveMarkBtn.enabled = false; 
                EditMarkBtn.enabled = false; 
                return;
            };
            const index = ManualMarksList.selection.index;
            ManualMarksList_array.splice(index, 0, ManualMarksList_array[index]);
            fillMarksList({
                marksProperties: ManualMarksList_array
            }, index + 1);
            prefsChanged();
        }; 

    var RemoveMarkBtn = ManualMarksBtnGroup.add("button", undefined, undefined, {name: "RemoveMarkBtn"}); 
        RemoveMarkBtn.enabled = false; 
        RemoveMarkBtn.text = translate('Remove mark btn');
        RemoveMarkBtn.alignment = ["center","fill"]; 
        RemoveMarkBtn.onClick = function() {
            if (!ManualMarksList.selection) {
                CloneMarkBtn.enabled = false; 
                RemoveMarkBtn.enabled = false; 
                EditMarkBtn.enabled = false; 
                return;
            };
            var index = ManualMarksList.selection.index;
            ManualMarksList_array.splice(index, 1);
            index = index < ManualMarksList_array.length ? index : index - 1;
            index = index >= 0 ? index : 0;
            fillMarksList({
                marksProperties: ManualMarksList_array
            }, index);
            prefsChanged();
        }; 

    /*---------------------------
    Функціонал
    -----------------------------*/

    function CutterTypeListSelected() {

        if (CutterTypeList.selection.index == 0) {
            checkIfNotSaved(setDefaults);
        } else {
            checkIfNotSaved();
            isOk = {
                name: false,
                size: false,
                margins: false,
                spaceBetween: false,
                color: false,
                overcut: false,
                marks: false
            };
            const index = CutterTypeList.selection.index - 1;
            const selectedCutter = CUTTER_TYPES[index];
            CutterNameText.text = selectedCutter.text;
            CutterLabelText.text = selectedCutter.label;
            WidthValue.text = selectedCutter.widthSheet;
            HeightValue.text = selectedCutter.heightSheet;
            SheetNameText.text = selectedCutter.paperName;
            TopValue.text = selectedCutter.marginTop;
            RightValue.text = selectedCutter.marginRight;
            BottomValue.text = selectedCutter.marginBottom;
            LeftValue.text = selectedCutter.marginLeft;
            SBminValue.text = selectedCutter.minSpaceBetween;
            SBmaxValue.text = selectedCutter.maxSpaceBetween;
            CyanValue.text = selectedCutter.contourColor[0];
            MagentaValue.text = selectedCutter.contourColor[1];
            YellowValue.text = selectedCutter.contourColor[2];
            BlackValue.text = selectedCutter.contourColor[3];
            OvercutValue.text = selectedCutter.contourOffset;
            LineWidthValue.text = selectedCutter.contourWidth;
            WorkspaceShrinkChk.value = selectedCutter.workspaceShrink;
            FileFormats.find(selectedCutter.plotterCutFormat).selected = true;
            fillMarksList(selectedCutter);
            MarksExternalFileChk.value = selectedCutter.marksFile && selectedCutter.marksFile != "";
            MarksExternalFilePath.text = selectedCutter.marksFile || "";
            toggleMarksSource(true);
            isChanged = false;
            lastSelected = CutterTypeList.selection.index;
            needSave();
            RemoveCurrentBtn.enabled = true;
        }
    }

    function fillMarksList(selectedCutter, index) {
        ManualMarksList.removeAll();
        ManualMarksList_array = [];
        const appearance = [translate("Cut & Print files"), translate("Cut file"), translate("Print file")];
        const shape = {
            'oval': translate('Oval mark'),
            'rectangle': translate('Rectangle mark'),
            'line': translate('Line mark'),
            'text': translate('Text mark'),
        };
        const position = {
            'top-left': translate('TopLeft'),
            'top-middle': translate('TopMiddle'),
            'top-right': translate('TopRight'),
            'bottom-left': translate('BottomLeft'),
            'bottom-middle': translate('BottomMiddle'),
            'bottom-right': translate('BottomRight'),
            'left-top': translate('LeftTop'),
            'left-middle': translate('LeftMiddle'),
            'left-bottom': translate('LeftBottom'),
            'right-top': translate('RightTop'),
            'right-middle': translate('RightMiddle'),
            'right-bottom': translate('RightBottom')
        };
        if (selectedCutter.marksProperties) {
            for (var i = 0; i < selectedCutter.marksProperties.length; i++) {
                var item = ManualMarksList.add('item', shape[selectedCutter.marksProperties[i].shape]);
                ManualMarksList_array.push(selectedCutter.marksProperties[i]);
                item.subItems[0].text = position[selectedCutter.marksProperties[i].position] || translate('Not defined');

                item.subItems[1].text = selectedCutter.marksProperties[i].width ? selectedCutter.marksProperties[i].width : '';
                item.subItems[1].text += item.subItems[1].text != '' ? 'x' : '';
                item.subItems[1].text += selectedCutter.marksProperties[i].height ? selectedCutter.marksProperties[i].height : '--';
                item.subItems[1].text += translate('Units mm');
                item.subItems[1].text += selectedCutter.marksProperties[i].rotation ? ' / ' + selectedCutter.marksProperties[i].rotation + '\u00b0' : '';

                item.subItems[2].text = selectedCutter.marksProperties[i].margins ? selectedCutter.marksProperties[i].margins.join(', ') + translate('Units mm') : "";

                item.subItems[3].text = selectedCutter.marksProperties[i].hasOwnProperty('appearance') ? appearance[selectedCutter.marksProperties[i].appearance] : translate('Not defined');
            }
            WorkspaceShrinkChk.enabled = selectedCutter.marksProperties.length && !MarksExternalFileChk.value;
        } else {
            WorkspaceShrinkChk.enabled = false;
        }
        WorkspaceShrinkChk.value = WorkspaceShrinkChk.enabled ? WorkspaceShrinkChk.value : false;
        index = index || 0;
        ManualMarksList.selection = index;
    }

    function toggleMarksSource(skipCheckAll) {
        if (MarksExternalFileChk.value) {
            MarksFilePickBtn.enabled = true;
            MarksExternalFilePath.enabled = true;
        } else {
            MarksFilePickBtn.enabled = false;
            MarksExternalFilePath.enabled = false;
        }
        WorkspaceShrinkChk.enabled = ManualMarksList.items.length && !MarksExternalFileChk.value;
        WorkspaceShrinkChk.value = WorkspaceShrinkChk.enabled ? WorkspaceShrinkChk.value : false;
        if (!skipCheckAll) prefsChanged();
    }

    function setDefaults() {
        isOk = {
            name: false,
            size: false,
            margins: false,
            spaceBetween: false,
            color: false,
            overcut: false,
            marks: false
        };
        CutterNameText.text = defaults.CutterNameText;
        CutterLabelText.text = defaults.CutterLabelText;
        WidthValue.text = defaults.WidthValue;
        HeightValue.text = defaults.HeightValue;
        SheetNameText.text = defaults.SheetNameText;
        TopValue.text = defaults.TopValue;
        RightValue.text = defaults.RightValue;
        BottomValue.text = defaults.BottomValue;
        LeftValue.text = defaults.LeftValue;
        SBminValue.text = defaults.SBminValue;
        SBmaxValue.text = defaults.SBmaxValue;
        CyanValue.text = defaults.CyanValue;
        MagentaValue.text = defaults.MagentaValue;
        YellowValue.text = defaults.YellowValue;
        BlackValue.text = defaults.BlackValue;
        LineWidthValue.text = defaults.LineWidthValue;
        OvercutValue.text = defaults.OvercutValue;
        FileFormats.selection = defaults.FileFormats;
        MarksExternalFileChk.value = defaults.MarksExternalFileChk;
        MarksExternalFilePath.text = defaults.MarksExternalFilePath;
        WorkspaceShrinkChk.value = defaults.WorkspaceShrinkChk;
        WorkspaceShrinkChk.enabled = defaults.WorkspaceShrinkChk;
        MarksExternalFilePath.enabled = false;
        MarksFilePickBtn.enabled = false;
        ManualMarksList.removeAll();
        ManualMarksList_array = [];
        lastSelected = 0;
        isChanged = true;
        needSave();
        RemoveCurrentBtn.enabled = false;
    }

    function CheckName() {
        if (CutterNameText.text == "" || CutterLabelText.text == "") {
            isOk.name = false;
            return;
        };
        if (CutterLabelText.text.length) CutterLabelText.text = CutterLabelText.text.toUpperCase();
        if (CutterLabelText.text.length > 6) CutterLabelText.text = CutterLabelText.text.slice(0, 6);
        isOk.name = true;
    }

    function CheckMargins() {
        TopValue.text = TopValue.text.replace(',', '.');
        RightValue.text = RightValue.text.replace(',', '.');
        BottomValue.text = BottomValue.text.replace(',', '.');
        LeftValue.text = LeftValue.text.replace(',', '.');
        if (!isValidNumber(TopValue.text) || TopValue.text < 0) TopValue.text = 0;
        if (!isValidNumber(RightValue.text) || RightValue.text < 0) RightValue.text = 0;
        if (!isValidNumber(BottomValue.text) || BottomValue.text < 0) BottomValue.text = 0;
        if (!isValidNumber(LeftValue.text) || LeftValue.text < 0) LeftValue.text = 0;
        if (+TopValue.text + +BottomValue.text >= HeightValue.text) TopValue.text = BottomValue.text = 0;
        if (+RightValue.text + +LeftValue.text >= WidthValue.text) RightValue.text = LeftValue.text = 0;
        isOk.margins = true;
    }

    function CheckSize() {
        WidthValue.text = WidthValue.text.replace(',', '.');
        HeightValue.text = HeightValue.text.replace(',', '.');
        if (!isValidNumber(WidthValue.text) || WidthValue.text < 50) WidthValue.text = 50;
        if (WidthValue.text > 5486) WidthValue.text = 5486;
        if (!isValidNumber(HeightValue.text) || HeightValue.text < 50) HeightValue.text = 50;
        if (HeightValue.text > 5486) HeightValue.text = 5486;
        isOk.size = true;
    }

    function CheckSpaceBetween() {
        SBminValue.text = SBminValue.text.replace(',', '.');
        SBmaxValue.text = SBmaxValue.text.replace(',', '.');
        if (!isValidNumber(SBminValue.text) || SBminValue.text <= 0) SBminValue.text = 0.1;
        if (SBminValue.text > 10) SBminValue.text = 10;
        if (!isValidNumber(SBmaxValue.text) || SBmaxValue.text < SBminValue.text) SBmaxValue.text = SBminValue.text;
        if (SBmaxValue.text > 10) SBmaxValue.text = 10;
        isOk.spaceBetween = true;
    }

    function CheckColor() {
        if (!isValidNumber(CyanValue.text) || CyanValue.text < 0) CyanValue.text = 0;
        if (CyanValue.text > 100) CyanValue.text = 100;
        if (!isValidNumber(MagentaValue.text) || MagentaValue.text < 0) MagentaValue.text = 0;
        if (MagentaValue.text > 100) MagentaValue.text = 100;
        if (!isValidNumber(YellowValue.text) || YellowValue.text < 0) YellowValue.text = 0;
        if (YellowValue.text > 100) YellowValue.text = 100;
        if (!isValidNumber(BlackValue.text) || BlackValue.text < 0) BlackValue.text = 0;
        if (BlackValue.text > 100) BlackValue.text = 100;                        
        isOk.color = true;
    }

    function CheckOvercut() {
        OvercutValue.text = OvercutValue.text.replace(',', '.');
        if (!isValidNumber(OvercutValue.text) || OvercutValue.text < 0) OvercutValue.text = 0;
        if (OvercutValue.text > 10) OvercutValue.text = 10;
        isOk.overcut = true;
    }

    function CheckLineWidth() {
        LineWidthValue.text = LineWidthValue.text.replace(',', '.');
        if (!isValidNumber(LineWidthValue.text) || LineWidthValue.text <= 0) LineWidthValue.text = defaults.LineWidthValue;
        if (LineWidthValue.text > 100) LineWidthValue.text = 100;
    }

    function CheckMarks() {
        if (MarksExternalFileChk.value) {
            if (MarksExternalFilePath.text == "") {
                isOk.marks = false
            } else {
                isOk.marks = true
            }
        } else {
            isOk.marks = true;
        }
    }

    function isValidNumber(cText) {
        var rg2 = /^(\d+)([\.,]\d+)?$/gm;
        return rg2.test(cText);
    }

    function prefsChanged() {
        isChanged = true;
        needSave();
    }

    function needSave() {    
        SaveCurrentBtn.enabled = isAllOk() && isChanged;
        CopyNewBtn.enabled = !isChanged;
    }

    function isAllOk() {
        CheckName();
        CheckMargins();
        CheckSize();
        CheckSpaceBetween();
        CheckColor();
        CheckLineWidth();
        CheckOvercut();
        CheckMarks();
        return isOk.name == true &&
               isOk.size == true &&
               isOk.margins == true &&
               isOk.spaceBetween == true &&
               isOk.color == true &&
               isOk.overcut == true &&
               isOk.marks == true;
    }

    function editMark(mark, index) {
        var res = EditMarkWindow({
            mark: mark,
            sheet: [
                +WidthValue.text,
                +HeightValue.text
            ],
            frame: [
                (WorkspaceShrinkChk.value ? '~' : '') + (+WidthValue.text - (+LeftValue.text + +RightValue.text)),
                +HeightValue.text - (+TopValue.text + +BottomValue.text)
            ],
            frameMargins: [
                +TopValue.text,
                +RightValue.text,
                +BottomValue.text,
                +LeftValue.text
            ]
        });
        if (res && res.newMark) {
            if (index >= 0) {
                ManualMarksList_array[index] = res.newMark;
            } else {
                ManualMarksList_array.push(res.newMark);
                index = ManualMarksList_array.length - 1;
            };
            fillMarksList({
                marksProperties: ManualMarksList_array
            }, index);
            SaveCurrentBtn.enabled = true;
            CopyNewBtn.enabled = false;
        }
    };

	function getFile() {	
		
		const title = translate('Get marks file title');
		var theFile = File.openDialog(title, "*.pdf", false);

		if (theFile != null) {
            const fsName = File.decode(theFile.fsName);				
            var pgCount = getPDFInfo(theFile);
            if (pgCount > 1) {
                alert(translate('One page alert'))
            } else {
                MarksExternalFilePath.text = fsName;
                prefsChanged();
            }
		} else {
            MarksExternalFilePath.text = "";
            prefsChanged();
        }
	}

    function checkIfNotSaved(callback) {
        if (SaveCurrentBtn.enabled) {
            var saveIt = confirm(translate('Confirm save msg'), false, translate('Confirm save title'));
            if (saveIt) {
                savePlotter(callback);
            } else {
                if (callback) callback();
            }
        } else {
            if (callback) callback();
        }
    }

    function CopyNewPlotter() {
        const index = CutterTypeList.selection.index - 1;
        var copied = {};
        for (var key in CUTTER_TYPES[index]) {
            if (CUTTER_TYPES[index].hasOwnProperty(key)) {
                copied[key] = CUTTER_TYPES[index][key];
            }
        }
        copied.text += ' ' + translate('copy');
        CUTTER_TYPES.push(copied);
        CutterTypeList.removeEventListener('change', CutterTypeListSelected);
        CutterTypeList.removeAll();
        CutterTypeList.add('item', translate('Add new'));
        for (var i = 0; i < CUTTER_TYPES.length; i++) {
            CutterTypeList.add('item', CUTTER_TYPES[i].text);
        }
        if (CUTTER_TYPES.length) RemoveCurrentBtn.enabled = true;
        CutterTypeList.selection = CUTTER_TYPES.length;
        CutterTypeList.active = true;
        CutterTypeListSelected();
        CutterTypeList.addEventListener('change', CutterTypeListSelected);
        savePreferencesJSON(PREFS_FILE, APP_PREFERENCES);
    }

    function removePlotter() {
        var deleteIt = confirm(translate('Remove plotter msg', {plotterName: CutterTypeList.selection.text}), true, translate('Remove plotter title'));
        if (deleteIt) {
            var index = CutterTypeList.selection.index - 1;
            if (index == -1) return;
            CUTTER_TYPES.splice(index, 1);
            CutterTypeList.removeEventListener('change', CutterTypeListSelected);
            CutterTypeList.removeAll();
            CutterTypeList.add('item', translate('Add new'));
            for (var i = 0; i < CUTTER_TYPES.length; i++) {
                CutterTypeList.add('item', CUTTER_TYPES[i].text);
            }
            if (CUTTER_TYPES.length) RemoveCurrentBtn.enabled = true;
            CutterTypeList.selection = index;
            CutterTypeList.active = true;
            isChanged = false;
            CutterTypeListSelected();
            CutterTypeList.addEventListener('change', CutterTypeListSelected);
            savePreferencesJSON(PREFS_FILE, APP_PREFERENCES);         
        }
    }

    function savePlotter(callback) {
        var index = lastSelected - 1;
        var selectedCutter;
        for (var i = 0; i < CUTTER_TYPES.length; i++) {
            if (CUTTER_TYPES[i].text == CutterNameText.text && i != index) {
                alert(translate('Error - Another cutter same name', {name: CutterNameText.text}));
                return;
            }
        }
        if (index == -1) {
            CUTTER_TYPES.push({});
            index = CUTTER_TYPES.length - 1;
            lastSelected = CUTTER_TYPES.length;
            CutterTypeList.add('item', CutterNameText.text);
            callback = function() {
                CutterTypeList.selection = index + 1;
            };
        };
        selectedCutter = CUTTER_TYPES[index];
        selectedCutter.text = CutterNameText.text;
        selectedCutter.label = CutterLabelText.text;
        selectedCutter.widthSheet = +WidthValue.text;
        selectedCutter.heightSheet = +HeightValue.text;
        selectedCutter.paperName = SheetNameText.text;
        selectedCutter.marginTop = +TopValue.text;
        selectedCutter.marginRight = +RightValue.text;
        selectedCutter.marginBottom = +BottomValue.text;
        selectedCutter.marginLeft = +LeftValue.text;
        selectedCutter.widthFrame = selectedCutter.widthSheet - (selectedCutter.marginLeft + selectedCutter.marginRight);
        selectedCutter.heightFrame = selectedCutter.heightSheet - (selectedCutter.marginTop + selectedCutter.marginBottom);
        selectedCutter.minSpaceBetween = +SBminValue.text;
        selectedCutter.maxSpaceBetween = +SBmaxValue.text;
        selectedCutter.contourColor = [
            +CyanValue.text,
            +MagentaValue.text,
            +YellowValue.text,
            +BlackValue.text
        ];
        selectedCutter.contourOffset = +OvercutValue.text;
        selectedCutter.contourWidth = +LineWidthValue.text;
        selectedCutter.plotterCutFormat = FileFormats.selection.text;
        selectedCutter.marksProperties = ManualMarksList_array;
        selectedCutter.marksFile = MarksExternalFileChk.value ? MarksExternalFilePath.text : "";
        selectedCutter.workspaceShrink = WorkspaceShrinkChk.value;
        CutterTypeList.items[lastSelected].text = CutterNameText.text;
        isChanged = false;
        needSave();
        savePreferencesJSON(PREFS_FILE, APP_PREFERENCES);
        CloseBtn.active = true;
        if (callback) {
            callback();
        } else {
            CutterTypeListSelected();
        }
    }

    var myResult = CytterTypePrefsWindow.show();

    const index = CutterTypeList.selection.index == 0 ? 0 : CutterTypeList.selection.index - 1;

    CytterTypePrefsWindow = null;

	return {index: index};

}