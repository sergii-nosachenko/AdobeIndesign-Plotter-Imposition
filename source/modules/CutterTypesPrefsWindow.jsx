function CytterTypePrefsDialog(selectedIndex) {

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
        BottpmValue: 0,
        LeftValue: 0,
        SBminValue: 0.5,
        SBmaxValue: 0.5,
        CyanValue: 0,
        MagentaValue: 0,
        YellowValue: 0,
        BlackValue: 0,
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
        CytterTypePrefsWindow.onClose = needSave;

    // CUTTERTYPETOPGROUP
    // ==================
    var CutterTypeTopGroup = CytterTypePrefsWindow.add("group", undefined, {name: "CutterTypeTopGroup"}); 
        CutterTypeTopGroup.orientation = "row"; 
        CutterTypeTopGroup.alignChildren = ["left","center"]; 
        CutterTypeTopGroup.spacing = 10; 
        CutterTypeTopGroup.margins = 0; 

    var CutterTypeList_array = CutterType_array; 
    var CutterTypeList = CutterTypeTopGroup.add("dropdownlist", undefined, undefined, {name: "CutterTypeList", items: CutterTypeList_array}); 
        CutterTypeList.selection = 0; 
        CutterTypeList.preferredSize.width = 220; 
        CutterTypeList.alignment = ["left","fill"]; 
        CutterTypeList.selection = CutterTypeList_array.length > selectedIndex + 1 ? selectedIndex + 1 : 0;
        CutterTypeList.addEventListener('change', CutterTypeListSelected);

    var AddNewBtn = CutterTypeTopGroup.add("button", undefined, undefined, {name: "AddNewBtn"}); 
        AddNewBtn.enabled = true;
        AddNewBtn.text = translate('Add new');
        AddNewBtn.onClick = AddNewPlotter; 

    var SaveCurrentBtn = CutterTypeTopGroup.add("button", undefined, undefined, {name: "SaveCurrentBtn"}); 
        SaveCurrentBtn.enabled = false;
        SaveCurrentBtn.text = translate('Save'); 
        SaveCurrentBtn.onClick = savePlotter;

    var RemoveCurrentBtn = CutterTypeTopGroup.add("button", undefined, undefined, {name: "RemoveCurrentBtn"}); 
        RemoveCurrentBtn.enabled = false;
        RemoveCurrentBtn.text = translate('Remove'); 
        RemoveCurrentBtn.onClick = removePlotter; 

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
        CutterNameText.onChange = isAllOk;
        
    var CutterLabelText = NameGroup.add('edittext {properties: {name: "CutterLabelText"}}'); 
        CutterLabelText.text = defaults.CutterLabelText; 
        CutterLabelText.preferredSize.width = 80; 
        CutterLabelText.helpTip = translate('Cutter label tip'); 
        CutterLabelText.alignment = ["left","fill"]; 
        CutterLabelText.onChange = isAllOk; 

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
        WidthValue.onChange = isAllOk;

    var HeightValueLabel = SheetGroup.add("statictext", undefined, undefined, {name: "HeightValueLabel"}); 
        HeightValueLabel.text = translate('Height Label'); 

    var HeightValue = SheetGroup.add('edittext {properties: {name: "HeightValue"}}'); 
        HeightValue.helpTip = translate('Sheet width tip'); 
        HeightValue.text = defaults.HeightValue; 
        HeightValue.preferredSize.width = 60; 
        HeightValue.alignment = ["left","fill"]; 
        HeightValue.onChange = isAllOk; 

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
        TopValue.onChange = isAllOk; 

    var RightLabel = MarginsGroup.add("statictext", undefined, undefined, {name: "RightLabel"}); 
        RightLabel.text = translate('Right label'); 

    var RightValue = MarginsGroup.add('edittext {properties: {name: "RightValue"}}'); 
        RightValue.helpTip = translate('Margin value tip');
        RightValue.text = defaults.TopValue; 
        RightValue.preferredSize.width = 45; 
        RightValue.alignment = ["left","fill"]; 
        RightValue.onChange = isAllOk; 

    var BottomLabel = MarginsGroup.add("statictext", undefined, undefined, {name: "BottomLabel"}); 
        BottomLabel.text = translate('Bottom label'); 

    var BottomValue = MarginsGroup.add('edittext {properties: {name: "BottomValue"}}'); 
        BottomValue.helpTip = translate('Margin value tip');
        BottomValue.text = defaults.BottomValue; 
        BottomValue.preferredSize.width = 45; 
        BottomValue.alignment = ["left","fill"]; 
        BottomValue.onChange = isAllOk; 

    var LeftLabel = MarginsGroup.add("statictext", undefined, undefined, {name: "LeftLabel"}); 
        LeftLabel.text = translate('Left label'); 

    var LeftValue = MarginsGroup.add('edittext {properties: {name: "LeftValue"}}'); 
        LeftValue.helpTip = translate('Margin value tip');
        LeftValue.text = defaults.LeftValue; 
        LeftValue.preferredSize.width = 45; 
        LeftValue.alignment = ["left","fill"]; 
        LeftValue.onChange = isAllOk; 

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
        SBminValue.onChange = isAllOk; 

    var SpaceBetweenMaxLabel = SpaceBetweenGroup.add("statictext", undefined, undefined, {name: "SpaceBetweenMaxLabel"}); 
        SpaceBetweenMaxLabel.text = translate('Space between max');

    var SBmaxValue = SpaceBetweenGroup.add('edittext {properties: {name: "SBmaxValue"}}'); 
        SBmaxValue.helpTip = translate('Space between max tip');
        SBmaxValue.text = defaults.SBmaxValue; 
        SBmaxValue.preferredSize.width = 80; 
        SBmaxValue.alignment = ["left","fill"]; 
        SBmaxValue.onChange = isAllOk; 

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
        CyanValue.onChange = isAllOk; 

    var MagentaLabel = ContourColorGroup.add("statictext", undefined, undefined, {name: "MagentaLabel"}); 
        MagentaLabel.text = "M"; 

    var MagentaValue = ContourColorGroup.add('edittext {properties: {name: "MagentaValue"}}'); 
        MagentaValue.helpTip = translate('Contour color tip');
        MagentaValue.text = defaults.MagentaValue; 
        MagentaValue.preferredSize.width = 60; 
        MagentaValue.alignment = ["left","fill"]; 
        MagentaValue.onChange = isAllOk; 

    var YellowLabel = ContourColorGroup.add("statictext", undefined, undefined, {name: "YellowLabel"}); 
        YellowLabel.text = "Y"; 

    var YellowValue = ContourColorGroup.add('edittext {properties: {name: "YellowValue"}}'); 
        YellowValue.helpTip = translate('Contour color tip');
        YellowValue.text = defaults.YellowValue; 
        YellowValue.preferredSize.width = 60; 
        YellowValue.alignment = ["left","fill"]; 
        YellowValue.onChange = isAllOk; 

    var BlackLabel = ContourColorGroup.add("statictext", undefined, undefined, {name: "BlackLabel"}); 
        BlackLabel.text = "K"; 

    var BlackValue = ContourColorGroup.add('edittext {properties: {name: "BlackValue"}}'); 
        BlackValue.helpTip = translate('Contour color tip');
        BlackValue.text = defaults.BlackValue; 
        BlackValue.preferredSize.width = 60; 
        BlackValue.alignment = ["left","fill"]; 
        BlackValue.onChange = isAllOk; 

    // ROW1
    // ====
    var Row1 = ContoursPanels.add("group", undefined, {name: "Row1"}); 
        Row1.orientation = "row"; 
        Row1.alignChildren = ["left","center"]; 
        Row1.spacing = 10; 
        Row1.margins = 0; 

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
        OvercutValue.preferredSize.width = 80; 
        OvercutValue.alignment = ["left","fill"]; 
        OvercutValue.onChange = isAllOk;  

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
        MarksExternalFilePath.onChange = isAllOk; 

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
            translate('Margins col')
        ];
    var ManualMarksList = ManualMarksPanel.add("listbox", undefined, undefined, {name: "ManualMarksList", numberOfColumns: 4, columnWidths: [100,100,100,100], columnTitles: columnTitles, showHeaders: true}); 
        ManualMarksList.selection = 0; 
        ManualMarksList.preferredSize.height = 120; 
        ManualMarksList.alignment = ["fill","top"];
		ManualMarksList.onChange = function() {
			if (ManualMarksList.selection) {
                RemoveMarkBtn.enabled = true;
                EditMarkBtn.enabled = true;
            } else {
                RemoveMarkBtn.enabled = false;
                EditMarkBtn.enabled = false;
            }
        }

    // ROW3
    // ====
    var Row3 = ManualMarksPanel.add("group", undefined, {name: "Row3"}); 
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
            SaveCurrentBtn.enabled = true;
        };

    // MANUALMARKSBTNGROUP
    // ===================
    var ManualMarksBtnGroup = ManualMarksPanel.add("group", undefined, {name: "ManualMarksBtnGroup"}); 
        ManualMarksBtnGroup.orientation = "row"; 
        ManualMarksBtnGroup.alignChildren = ["center","bottom"]; 
        ManualMarksBtnGroup.spacing = 10; 
        ManualMarksBtnGroup.margins = 0; 
        ManualMarksBtnGroup.alignment = ["fill","top"]; 

    var RemoveMarkBtn = ManualMarksBtnGroup.add("button", undefined, undefined, {name: "RemoveMarkBtn"}); 
        RemoveMarkBtn.enabled = false; 
        RemoveMarkBtn.text = translate('Remove mark btn');
        RemoveMarkBtn.alignment = ["center","fill"]; 

    var EditMarkBtn = ManualMarksBtnGroup.add("button", undefined, undefined, {name: "EditMarkBtn"}); 
        EditMarkBtn.enabled = false; 
        EditMarkBtn.text = translate('Edit mark btn');
        EditMarkBtn.alignment = ["center","fill"]; 

    var AddMarkBtn = ManualMarksBtnGroup.add("button", undefined, undefined, {name: "AddMarkBtn"}); 
        AddMarkBtn.text = translate('Add mark btn'); 
        AddMarkBtn.alignment = ["center","fill"]; 

    /*---------------------------
    Функціонал
    -----------------------------*/

    function CutterTypeListSelected() {

        if (CutterTypeList.selection.index == 0) {
            AddNewPlotter();
            return;
        }

        needSave();

        isOk = {
            name: false,
            size: false,
            margins: false,
            spaceBetween: false,
            color: false,
            overcut: false,
            marks: false
        };
        SaveCurrentBtn.enabled = false;
        RemoveCurrentBtn.enabled = true;
        AddNewBtn.enabled = true;
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
        WorkspaceShrinkChk.value = selectedCutter.workspaceShrink;
        FileFormats.find(selectedCutter.plotterCutFormat).selected = true;
        fillMarksList(selectedCutter);
        if (selectedCutter.marksGenerate) {
            MarksExternalFileChk.value = false;
            MarksExternalFilePath.text = "";
        } else {
            MarksExternalFileChk.value = true;
            MarksExternalFilePath.text = selectedCutter.marksFile;
        }
        toggleMarksSource(true);
    }

    function fillMarksList(selectedCutter) {
        ManualMarksList.removeAll();
        if (selectedCutter.marksProperties) {
            for (var i = 0; i < selectedCutter.marksProperties.length; i++) {
                var item = ManualMarksList.add('item', selectedCutter.marksProperties[i].shape);
                item.subItems[0].text = selectedCutter.marksProperties[i].position;
                item.subItems[1].text = selectedCutter.marksProperties[i].width + 'x' + selectedCutter.marksProperties[i].height + translate('Units mm');
                item.subItems[2].text = selectedCutter.marksProperties[i].margins ? selectedCutter.marksProperties[i].margins.join(', ') + translate('Units mm') : "";
            }
            WorkspaceShrinkChk.enabled = selectedCutter.marksProperties.length ? true : false;
        } else {
            WorkspaceShrinkChk.enabled = false;
        }
    }

    function toggleMarksSource(skipCheckAll) {
        if (MarksExternalFileChk.value) {
            MarksFilePickBtn.enabled = true;
            MarksExternalFilePath.enabled = true;
        } else {
            MarksFilePickBtn.enabled = false;
            MarksExternalFilePath.enabled = false;
        }
        if (!skipCheckAll) isAllOk();
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
        OvercutValue.text = defaults.OvercutValue;
        FileFormats.selection = defaults.FileFormats;
        MarksExternalFileChk.value = defaults.MarksExternalFileChk;
        MarksExternalFilePath.text = defaults.MarksExternalFilePath;
        WorkspaceShrinkChk.value = defaults.WorkspaceShrinkChk;
        WorkspaceShrinkChk.enabled = defaults.WorkspaceShrinkChk;
        RemoveCurrentBtn.enabled = false;
        MarksExternalFilePath.enabled = false;
        MarksFilePickBtn.enabled = false;
        ManualMarksList.removeAll();
        isAllOk();
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

    function isAllOk() {
        CheckName();
        CheckMargins();
        CheckSize();
        CheckSpaceBetween();
        CheckColor();
        CheckOvercut();
        CheckMarks();
        if (
            isOk.name == true &&
            isOk.size == true &&
            isOk.margins == true &&
            isOk.spaceBetween == true &&
            isOk.color == true &&
            isOk.overcut == true &&
            isOk.marks == true
        ) {
            SaveCurrentBtn.enabled = true;
        } else {
            SaveCurrentBtn.enabled = false;
        }
    }

	function getFile() {	
		
		var askIt = translate('Get marks file title');
		var theFile = File.openDialog(askIt, "*.pdf", false);

		if (theFile != null) {
            const fsName = File.decode(theFile.fsName);				
            var pgCount = getPDFInfo(theFile);
            if (pgCount > 1) {
                alert(translate('One page alert'))
            } else {
                MarksExternalFilePath.text = fsName;
            }
		}
	}	

    function AddNewPlotter() {
        CutterTypeList.selection = 0;
        AddNewBtn.enabled = false;
        needSave();
        setDefaults();
    }

    function needSave() {
        if (SaveCurrentBtn.enabled) {
            var saveIt = confirm(translate('Confirm save msg'), false, translate('Confirm save title'));
            if (saveIt) savePlotter();
        };
    }

    function removePlotter() {
        var deleteIt = confirm(translate('Remove plotter msg', {plotterName: CutterTypeList.selection.text}), true, translate('Remove plotter title'));
        if (deleteIt) {
            SaveCurrentBtn.enabled = false;
            RemoveCurrentBtn.enabled = false;
            const index = CutterTypeList.selection.index - 1;
            if (index == -1) return;
            CUTTER_TYPES.pop(index);
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
            savePreferencesJSON(PREFS_FILE);
        }
    }

    function savePlotter() {
        SaveCurrentBtn.enabled = false;
        AddNewBtn.enabled = true; 
        var index = CutterTypeList.selection.index - 1;
        var selectedCutter;
        if (index == -1) {
            CUTTER_TYPES.push({});
            index = CUTTER_TYPES.length - 1;
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
        if (selectedCutter.widthSheet <= selectedCutter.heightSheet) selectedCutter.pageOrientation = PageOrientation.PORTRAIT.valueOf();
        if (selectedCutter.widthSheet > selectedCutter.heightSheet) selectedCutter.pageOrientation = PageOrientation.LANDSCAPE.valueOf();
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
        selectedCutter.plotterCutFormat = FileFormats.selection.text;
        selectedCutter.marksGenerate = !MarksExternalFileChk.value;
        if (MarksExternalFileChk.value) selectedCutter.marksFile = MarksExternalFilePath.text;
        selectedCutter.workspaceShrink = WorkspaceShrinkChk.value;
        CutterTypeList.removeEventListener('change', CutterTypeListSelected);
        CutterTypeList.removeAll();
        CutterTypeList.add('item', translate('Add new'));
        for (var i = 0; i < CUTTER_TYPES.length; i++) {
            CutterTypeList.add('item', CUTTER_TYPES[i].text);
        }
        CutterTypeList.selection = index + 1;
        CutterTypeList.addEventListener('change', CutterTypeListSelected);
        RemoveCurrentBtn.enabled = true;
        savePreferencesJSON(PREFS_FILE);
    }

    var myResult = CytterTypePrefsWindow.show();

    const index = CutterTypeList.selection.index == 0 ? 0 : CutterTypeList.selection.index - 1;

    CytterTypePrefsWindow = null;

	return {index: index};

}

/*
Code for Import https://scriptui.joonas.me — (Triple click to select): 
{"activeId":46,"items":{"item-0":{"id":0,"type":"Dialog","parentId":false,"style":{"enabled":true,"varName":"CytterTypePrefsWindow","windowType":"Dialog","creationProps":{"su1PanelCoordinates":false,"maximizeButton":false,"minimizeButton":false,"independent":false,"closeButton":true,"borderless":false,"resizeable":false},"text":"Cutters preferences editor","preferredSize":[450,600],"margins":15,"orientation":"column","spacing":10,"alignChildren":["fill","top"]}},"item-1":{"id":1,"type":"DropDownList","parentId":2,"style":{"enabled":true,"varName":"CutterTypeList","text":"DropDownList","listItems":"Summa Cut (300x380mm), Graphtec (300x380mm)","preferredSize":[230,0],"alignment":"fill","selection":0,"helpTip":null}},"item-2":{"id":2,"type":"Group","parentId":0,"style":{"enabled":true,"varName":"CutterTypeTopGroup","preferredSize":[0,0],"margins":0,"orientation":"row","spacing":10,"alignChildren":["left","center"],"alignment":null}},"item-3":{"id":3,"type":"Button","parentId":2,"style":{"enabled":true,"varName":"AddNewBtn","text":"Add new","justify":"center","preferredSize":[0,0],"alignment":null,"helpTip":null}},"item-4":{"id":4,"type":"Divider","parentId":0,"style":{"enabled":true,"varName":null}},"item-5":{"id":5,"type":"Group","parentId":0,"style":{"enabled":true,"varName":"NameGroup","preferredSize":[0,0],"margins":0,"orientation":"row","spacing":10,"alignChildren":["left","center"],"alignment":"fill"}},"item-6":{"id":6,"type":"EditText","parentId":5,"style":{"enabled":true,"varName":"CutterNameText","creationProps":{"noecho":false,"readonly":false,"multiline":false,"scrollable":false,"borderless":false,"enterKeySignalsOnChange":false},"softWrap":false,"text":"New plotter","justify":"left","preferredSize":[300,0],"alignment":"fill","helpTip":null}},"item-7":{"id":7,"type":"StaticText","parentId":5,"style":{"enabled":true,"varName":"CutterNameLabel","creationProps":{"truncate":"none","multiline":false,"scrolling":false},"softWrap":false,"text":"Cutter name","justify":"left","preferredSize":[0,0],"alignment":null,"helpTip":null}},"item-8":{"id":8,"type":"Group","parentId":22,"style":{"enabled":true,"varName":"SheetGroup","preferredSize":[0,0],"margins":0,"orientation":"row","spacing":10,"alignChildren":["left","center"],"alignment":"fill"}},"item-9":{"id":9,"type":"StaticText","parentId":8,"style":{"enabled":true,"varName":"SheetWidthLabel","creationProps":{"truncate":"none","multiline":false,"scrolling":false},"softWrap":false,"text":"Sheet width","justify":"left","preferredSize":[0,0],"alignment":null,"helpTip":null}},"item-10":{"id":10,"type":"EditText","parentId":8,"style":{"enabled":true,"varName":"WidthValue","creationProps":{"noecho":false,"readonly":false,"multiline":false,"scrollable":false,"borderless":false,"enterKeySignalsOnChange":false},"softWrap":false,"text":"210","justify":"left","preferredSize":[80,0],"alignment":"fill","helpTip":"Must be a number > 0 in mm"}},"item-11":{"id":11,"type":"StaticText","parentId":8,"style":{"enabled":true,"varName":"SheetHeightLabel","creationProps":{"truncate":"none","multiline":false,"scrolling":false},"softWrap":false,"text":"Sheet height","justify":"left","preferredSize":[0,0],"alignment":null,"helpTip":null}},"item-12":{"id":12,"type":"EditText","parentId":8,"style":{"enabled":true,"varName":"HeightValue","creationProps":{"noecho":false,"readonly":false,"multiline":false,"scrollable":false,"borderless":false,"enterKeySignalsOnChange":false},"softWrap":false,"text":"297","justify":"left","preferredSize":[80,0],"alignment":"fill","helpTip":"Must be a number > 0 in mm"}},"item-13":{"id":13,"type":"Group","parentId":22,"style":{"enabled":true,"varName":"MarginsGroup","preferredSize":[0,0],"margins":0,"orientation":"row","spacing":10,"alignChildren":["left","center"],"alignment":"fill"}},"item-14":{"id":14,"type":"StaticText","parentId":13,"style":{"enabled":true,"varName":"TopLabel","creationProps":{"truncate":"none","multiline":false,"scrolling":false},"softWrap":false,"text":"Top","justify":"left","preferredSize":[0,0],"alignment":null,"helpTip":null}},"item-15":{"id":15,"type":"EditText","parentId":13,"style":{"enabled":true,"varName":"TopValue","creationProps":{"noecho":false,"readonly":false,"multiline":false,"scrollable":false,"borderless":false,"enterKeySignalsOnChange":false},"softWrap":false,"text":"0","justify":"left","preferredSize":[50,0],"alignment":"fill","helpTip":"Must be a number >= 0 in mm"}},"item-16":{"id":16,"type":"StaticText","parentId":13,"style":{"enabled":true,"varName":"RightLabel","creationProps":{"truncate":"none","multiline":false,"scrolling":false},"softWrap":false,"text":"Right","justify":"left","preferredSize":[0,0],"alignment":null,"helpTip":null}},"item-17":{"id":17,"type":"EditText","parentId":13,"style":{"enabled":true,"varName":"RightValue","creationProps":{"noecho":false,"readonly":false,"multiline":false,"scrollable":false,"borderless":false,"enterKeySignalsOnChange":false},"softWrap":false,"text":"0","justify":"left","preferredSize":[50,0],"alignment":"fill","helpTip":"Must be a number >= 0 in mm"}},"item-18":{"id":18,"type":"StaticText","parentId":13,"style":{"enabled":true,"varName":"BottomLabel","creationProps":{"truncate":"none","multiline":false,"scrolling":false},"softWrap":false,"text":"Bottom","justify":"left","preferredSize":[0,0],"alignment":null,"helpTip":null}},"item-19":{"id":19,"type":"EditText","parentId":13,"style":{"enabled":true,"varName":"BottomValue","creationProps":{"noecho":false,"readonly":false,"multiline":false,"scrollable":false,"borderless":false,"enterKeySignalsOnChange":false},"softWrap":false,"text":"0","justify":"left","preferredSize":[50,0],"alignment":"fill","helpTip":"Must be a number >= 0 in mm"}},"item-20":{"id":20,"type":"StaticText","parentId":13,"style":{"enabled":true,"varName":"LeftLabel","creationProps":{"truncate":"none","multiline":false,"scrolling":false},"softWrap":false,"text":"Left","justify":"left","preferredSize":[0,0],"alignment":null,"helpTip":null}},"item-21":{"id":21,"type":"EditText","parentId":13,"style":{"enabled":true,"varName":"LeftValue","creationProps":{"noecho":false,"readonly":false,"multiline":false,"scrollable":false,"borderless":false,"enterKeySignalsOnChange":false},"softWrap":false,"text":"0","justify":"left","preferredSize":[50,0],"alignment":"fill","helpTip":"Must be a number >= 0 in mm"}},"item-22":{"id":22,"type":"Panel","parentId":0,"style":{"enabled":true,"varName":"DocumentSettingsPanel","creationProps":{"borderStyle":"etched","su1PanelCoordinates":false},"text":"Document settings","preferredSize":[0,0],"margins":10,"orientation":"column","spacing":10,"alignChildren":["fill","top"],"alignment":null}},"item-23":{"id":23,"type":"Panel","parentId":0,"style":{"enabled":true,"varName":"ContoursPanels","creationProps":{"borderStyle":"etched","su1PanelCoordinates":false},"text":"Contours settings","preferredSize":[0,0],"margins":10,"orientation":"column","spacing":10,"alignChildren":["left","top"],"alignment":"fill"}},"item-24":{"id":24,"type":"Group","parentId":23,"style":{"enabled":true,"varName":"SpaceBetweenGroup","preferredSize":[0,0],"margins":0,"orientation":"row","spacing":10,"alignChildren":["left","center"],"alignment":"fill"}},"item-25":{"id":25,"type":"StaticText","parentId":24,"style":{"enabled":true,"varName":"SpaceBetweenMinLabel","creationProps":{"truncate":"none","multiline":false,"scrolling":false},"softWrap":false,"text":"Space between min","justify":"left","preferredSize":[0,0],"alignment":null,"helpTip":null}},"item-26":{"id":26,"type":"EditText","parentId":24,"style":{"enabled":true,"varName":"SBminValue","creationProps":{"noecho":false,"readonly":false,"multiline":false,"scrollable":false,"borderless":false,"enterKeySignalsOnChange":false},"softWrap":false,"text":"0.5","justify":"left","preferredSize":[80,0],"alignment":"fill","helpTip":"Must be a number > 0 in mm\\n0 is available by default"}},"item-27":{"id":27,"type":"StaticText","parentId":24,"style":{"enabled":true,"varName":"SpaceBetweenMaxLabel","creationProps":{"truncate":"none","multiline":false,"scrolling":false},"softWrap":false,"text":"max","justify":"left","preferredSize":[0,0],"alignment":null,"helpTip":null}},"item-28":{"id":28,"type":"EditText","parentId":24,"style":{"enabled":true,"varName":"SBmaxValue","creationProps":{"noecho":false,"readonly":false,"multiline":false,"scrollable":false,"borderless":false,"enterKeySignalsOnChange":false},"softWrap":false,"text":"0.5","justify":"left","preferredSize":[80,0],"alignment":"fill","helpTip":"Must be a number >= min value in mm"}},"item-29":{"id":29,"type":"Group","parentId":45,"style":{"enabled":true,"varName":"OvercutGroup","preferredSize":[0,0],"margins":0,"orientation":"row","spacing":10,"alignChildren":["left","center"],"alignment":"fill"}},"item-30":{"id":30,"type":"StaticText","parentId":29,"style":{"enabled":true,"varName":"OvercutLabel","creationProps":{"truncate":"none","multiline":false,"scrolling":false},"softWrap":false,"text":"Overcut","justify":"left","preferredSize":[0,0],"alignment":null,"helpTip":null}},"item-31":{"id":31,"type":"EditText","parentId":29,"style":{"enabled":true,"varName":"OvercutValue","creationProps":{"noecho":false,"readonly":false,"multiline":false,"scrollable":false,"borderless":false,"enterKeySignalsOnChange":false},"softWrap":false,"text":"0.1","justify":"left","preferredSize":[80,0],"alignment":"fill","helpTip":"Must be a number >= 0 in mm\\nNeeds for table-style cutting"}},"item-32":{"id":32,"type":"Group","parentId":23,"style":{"enabled":true,"varName":"ContourColorGroup","preferredSize":[0,0],"margins":0,"orientation":"row","spacing":10,"alignChildren":["left","center"],"alignment":"fill"}},"item-33":{"id":33,"type":"StaticText","parentId":32,"style":{"enabled":true,"varName":"CyanLabel","creationProps":{"truncate":"none","multiline":false,"scrolling":false},"softWrap":false,"text":"C","justify":"left","preferredSize":[0,0],"alignment":null,"helpTip":null}},"item-34":{"id":34,"type":"EditText","parentId":32,"style":{"enabled":true,"varName":"CyanValue","creationProps":{"noecho":false,"readonly":false,"multiline":false,"scrollable":false,"borderless":false,"enterKeySignalsOnChange":false},"softWrap":false,"text":"0","justify":"left","preferredSize":[50,0],"alignment":"fill","helpTip":"Must be a number from 0 to 100%"}},"item-35":{"id":35,"type":"StaticText","parentId":32,"style":{"enabled":true,"varName":"MagentaLabel","creationProps":{"truncate":"none","multiline":false,"scrolling":false},"softWrap":false,"text":"M","justify":"left","preferredSize":[0,0],"alignment":null,"helpTip":null}},"item-36":{"id":36,"type":"EditText","parentId":32,"style":{"enabled":true,"varName":"MagentaValue","creationProps":{"noecho":false,"readonly":false,"multiline":false,"scrollable":false,"borderless":false,"enterKeySignalsOnChange":false},"softWrap":false,"text":"0","justify":"left","preferredSize":[50,0],"alignment":"fill","helpTip":"Must be a number from 0 to 100%"}},"item-37":{"id":37,"type":"StaticText","parentId":32,"style":{"enabled":true,"varName":"YellowLabel","creationProps":{"truncate":"none","multiline":false,"scrolling":false},"softWrap":false,"text":"Y","justify":"left","preferredSize":[0,0],"alignment":null,"helpTip":null}},"item-38":{"id":38,"type":"EditText","parentId":32,"style":{"enabled":true,"varName":"YellowValue","creationProps":{"noecho":false,"readonly":false,"multiline":false,"scrollable":false,"borderless":false,"enterKeySignalsOnChange":false},"softWrap":false,"text":"0","justify":"left","preferredSize":[50,0],"alignment":"fill","helpTip":"Must be a number from 0 to 100%"}},"item-39":{"id":39,"type":"StaticText","parentId":32,"style":{"enabled":true,"varName":"BlackLabel","creationProps":{"truncate":"none","multiline":false,"scrolling":false},"softWrap":false,"text":"K","justify":"left","preferredSize":[0,0],"alignment":null,"helpTip":null}},"item-40":{"id":40,"type":"EditText","parentId":32,"style":{"enabled":true,"varName":"BlackValue","creationProps":{"noecho":false,"readonly":false,"multiline":false,"scrollable":false,"borderless":false,"enterKeySignalsOnChange":false},"softWrap":false,"text":"0","justify":"left","preferredSize":[50,0],"alignment":"fill","helpTip":"Must be a number from 0 to 100%"}},"item-41":{"id":41,"type":"StaticText","parentId":32,"style":{"enabled":true,"varName":"ColorLabel","creationProps":{"truncate":"none","multiline":false,"scrolling":false},"softWrap":false,"text":"Contour color","justify":"left","preferredSize":[0,0],"alignment":null,"helpTip":null}},"item-42":{"id":42,"type":"Group","parentId":45,"style":{"enabled":true,"varName":"FileFormatGroup","preferredSize":[0,0],"margins":0,"orientation":"row","spacing":10,"alignChildren":["left","center"],"alignment":"fill"}},"item-43":{"id":43,"type":"StaticText","parentId":42,"style":{"enabled":true,"varName":"FileFormatLabel","creationProps":{"truncate":"none","multiline":false,"scrolling":false},"softWrap":false,"text":"File format","justify":"left","preferredSize":[0,0],"alignment":null,"helpTip":null}},"item-44":{"id":44,"type":"DropDownList","parentId":42,"style":{"enabled":true,"varName":"FileFormats","text":"DropDownList","listItems":"PDF,AI,DXF","preferredSize":[0,0],"alignment":null,"selection":0,"helpTip":null}},"item-45":{"id":45,"type":"Group","parentId":23,"style":{"enabled":true,"varName":"Row1","preferredSize":[0,0],"margins":0,"orientation":"row","spacing":10,"alignChildren":["left","center"],"alignment":null}},"item-46":{"id":46,"type":"Panel","parentId":0,"style":{"enabled":true,"varName":"MarksExternalFilePanel","creationProps":{"borderStyle":"etched","su1PanelCoordinates":false},"text":"Marks file source","preferredSize":[0,0],"margins":[15,10,10,10],"orientation":"column","spacing":10,"alignChildren":["left","top"],"alignment":null}},"item-47":{"id":47,"type":"Checkbox","parentId":46,"style":{"enabled":true,"varName":"MarksExternalFileChk","text":"Use external file","preferredSize":[0,0],"alignment":null,"helpTip":null,"checked":false}},"item-48":{"id":48,"type":"EditText","parentId":50,"style":{"enabled":false,"varName":"MarksExternalFilePath","creationProps":{"noecho":false,"readonly":true,"multiline":false,"scrollable":false,"borderless":false,"enterKeySignalsOnChange":false},"softWrap":false,"text":"","justify":"left","preferredSize":[300,0],"alignment":"fill","helpTip":null}},"item-49":{"id":49,"type":"Button","parentId":50,"style":{"enabled":false,"varName":"MarksFilePickBtn","text":"Choose","justify":"center","preferredSize":[0,0],"alignment":null,"helpTip":null}},"item-50":{"id":50,"type":"Group","parentId":46,"style":{"enabled":true,"varName":"Row2","preferredSize":[0,0],"margins":0,"orientation":"row","spacing":10,"alignChildren":["left","center"],"alignment":null}},"item-51":{"id":51,"type":"Panel","parentId":0,"style":{"enabled":true,"varName":"ManualMarksPanel","creationProps":{"borderStyle":"etched","su1PanelCoordinates":false},"text":"Manual marks list","preferredSize":[0,170],"margins":10,"orientation":"column","spacing":10,"alignChildren":["fill","top"],"alignment":"fill"}},"item-52":{"id":52,"type":"ListBox","parentId":51,"style":{"enabled":true,"varName":"ManualMarksList","creationProps":{"multiselect":false,"numberOfColumns":"3","columnWidths":"[125,125,125]","columnTitles":"[\"Shape\", \"Position\", \"Size\"]","showHeaders":true},"listItems":"","preferredSize":[0,120],"alignment":"fill","helpTip":null,"selection":[0]}},"item-53":{"id":53,"type":"Group","parentId":51,"style":{"enabled":true,"varName":"ManualMarksBtnGroup","preferredSize":[0,0],"margins":0,"orientation":"row","spacing":10,"alignChildren":["center","bottom"],"alignment":"fill"}},"item-54":{"id":54,"type":"Button","parentId":53,"style":{"enabled":true,"varName":"AddMarkBtn","text":"Add","justify":"center","preferredSize":[0,0],"alignment":"fill","helpTip":null}},"item-55":{"id":55,"type":"Button","parentId":53,"style":{"enabled":false,"varName":"EditMarkBtn","text":"Edit","justify":"center","preferredSize":[0,0],"alignment":"fill","helpTip":null}},"item-56":{"id":56,"type":"Button","parentId":53,"style":{"enabled":false,"varName":"RemoveMarkBtn","text":"Remove","justify":"center","preferredSize":[0,0],"alignment":"fill","helpTip":null}},"item-57":{"id":57,"type":"Button","parentId":2,"style":{"enabled":false,"varName":"SaveCurrentBtn","text":"Save","justify":"center","preferredSize":[0,0],"alignment":null,"helpTip":null}}},"order":[0,2,1,57,3,4,5,7,6,22,8,9,10,11,12,13,14,15,16,17,18,19,20,21,23,24,25,26,27,28,32,41,33,34,35,36,37,38,39,40,45,29,30,31,42,43,44,46,47,50,48,49,51,52,53,56,55,54],"settings":{"importJSON":true,"indentSize":false,"cepExport":false,"includeCSSJS":true,"showDialog":true,"functionWrapper":false,"afterEffectsDockable":false,"itemReferenceList":"None"}}
*/ 