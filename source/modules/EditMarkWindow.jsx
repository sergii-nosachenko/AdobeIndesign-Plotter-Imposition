var fontsAll = app.fonts.everyItem().getElements();

function EditMarkWindow(markToEdit) {

    var isOk = {
        position: false,
        size: false
    }

    var newMark;

    // EDITMARK
    // ========
    var EditMark = new Window("dialog"); 
        EditMark.text = translate('Edit Mark Window'); 
        EditMark.orientation = "column"; 
        EditMark.alignChildren = ["center","top"]; 
        EditMark.spacing = 10; 
        EditMark.margins = 16; 

    var Shape_array = [translate('Oval mark'), translate('Rectangle mark'), translate('Line mark'), translate('Text mark')]; 
    var Shape = EditMark.add("dropdownlist", undefined, undefined, {name: "Shape", items: Shape_array}); 
        Shape.selection = 0; 
        Shape.alignment = ["fill","top"]; 
        Shape.onChange = shapeChanged; 

    // SETTINGS
    // ========
    var Settings = EditMark.add("group", undefined, {name: "Settings"}); 
        Settings.orientation = "column"; 
        Settings.alignChildren = ["center","top"]; 
        Settings.spacing = 5; 
        Settings.margins = 0; 
        Settings.alignment = ["fill","top"]; 

    // POSITIONPANEL
    // =============
    var PositionPanel = Settings.add("panel", undefined, undefined, {name: "PositionPanel"}); 
        PositionPanel.text = translate('Position Panel');
        PositionPanel.alignChildren = ["left","top"]; 
        PositionPanel.spacing = 0; 
        PositionPanel.margins = 10; 
        PositionPanel.alignment = ["fill","top"]; 

    // POSITION
    // ========

    var SheetPanel = PositionPanel.add("panel", undefined, undefined, {name: "SheetPanel"}); 
        SheetPanel.text = translate('Sheet');
        SheetPanel.orientation = "column"; 
        SheetPanel.alignChildren = ["center","center"]; 
        SheetPanel.spacing = 10; 
        SheetPanel.margins = 10; 
        SheetPanel.alignment = ["center","fill"]; 

    var Position = SheetPanel.add("group", undefined, {name: "Position"}); 
        Position.orientation = "column"; 
        Position.alignChildren = ["center","top"]; 
        Position.spacing = 0; 
        Position.margins = 0; 
        Position.alignment = ["center","top"];

    // TOPROW
    // ======
    var TopRow = Position.add("group", undefined, {name: "TopRow"}); 
        TopRow.preferredSize.height = 20; 
        TopRow.orientation = "row"; 
        TopRow.alignChildren = ["left","center"]; 
        TopRow.spacing = 20; 
        TopRow.margins = [35,0,0,0]; 
        TopRow.alignment = ["fill","top"]; 

    var TopLeft = TopRow.add("radiobutton", undefined, undefined, {name: "TopLeft"}); 
        TopLeft.preferredSize.width = 30;
        TopLeft.helpTip = translate('TopLeft');
        TopLeft.onClick = positionChanged;

    var TopMiddle = TopRow.add("radiobutton", undefined, undefined, {name: "TopMiddle"}); 
        TopMiddle.preferredSize.width = 30; 
        TopMiddle.helpTip = translate('TopMiddle');
        TopMiddle.onClick = positionChanged;

    var TopRight = TopRow.add("radiobutton", undefined, undefined, {name: "TopRight"}); 
        TopRight.preferredSize.width = 30; 
        TopRight.helpTip = translate('TopRight');
        TopRight.onClick = positionChanged;

    // CENTRALROW
    // ==========
    var CentralRow = Position.add("group", undefined, {name: "CentralRow"}); 
        CentralRow.orientation = "row"; 
        CentralRow.alignChildren = ["left","top"]; 
        CentralRow.spacing = 0; 
        CentralRow.margins = 0; 
        CentralRow.alignment = ["fill","top"]; 

    // LEFTCOL
    // =======
    var LeftCol = CentralRow.add("group", undefined, {name: "LeftCol"}); 
        LeftCol.preferredSize.width = 25; 
        LeftCol.preferredSize.height = 90; 
        LeftCol.orientation = "column"; 
        LeftCol.alignChildren = ["right","center"]; 
        LeftCol.spacing = 12; 
        LeftCol.margins = [0,10,0,0]; 

    var LeftTop = LeftCol.add("radiobutton", undefined, undefined, {name: "LeftTop"}); 
        LeftTop.preferredSize.height = 15; 
        LeftTop.helpTip = translate('LeftTop');
        LeftTop.onClick = positionChanged;

    var LeftMiddle = LeftCol.add("radiobutton", undefined, undefined, {name: "LeftMiddle"}); 
        LeftMiddle.preferredSize.height = 15; 
        LeftMiddle.helpTip = translate('LeftMiddle');
        LeftMiddle.onClick = positionChanged;

    var LeftBottom = LeftCol.add("radiobutton", undefined, undefined, {name: "LeftBottom"}); 
        LeftBottom.preferredSize.height = 15; 
        LeftBottom.helpTip = translate('LeftBottom');
        LeftBottom.onClick = positionChanged;

    // WORKINGFRAME
    // ============
    var WorkingFramePanel = CentralRow.add("panel", undefined, undefined, {name: "WorkingFramePanel"}); 
        WorkingFramePanel.text = translate('Frame');
        WorkingFramePanel.preferredSize.width = 130; 
        WorkingFramePanel.preferredSize.height = 90; 
        WorkingFramePanel.orientation = "column"; 
        WorkingFramePanel.alignChildren = ["center","center"]; 
        WorkingFramePanel.spacing = 10; 
        WorkingFramePanel.margins = 10; 
        WorkingFramePanel.alignment = ["left","fill"]; 

    var SheetMargins = WorkingFramePanel.add("group"); 
        SheetMargins.orientation = "column"; 
        SheetMargins.alignChildren = ["center","center"]; 
        SheetMargins.spacing = 5; 
        SheetMargins.alignment = ["center","center"]; 

    var TopMargin = SheetMargins.add("statictext", undefined, "", {name: "TopMargin"}); 
    var LeftRightMargins = SheetMargins.add("statictext", undefined, "", {name: "LeftRightMargins"}); 
    var BottomMargin = SheetMargins.add("statictext", undefined, "", {name: "BottomMargin"});

    // RIGHTCOL
    // ========
    var RightCol = CentralRow.add("group", undefined, {name: "RightCol"}); 
        RightCol.preferredSize.width = 25; 
        RightCol.preferredSize.height = 90; 
        RightCol.orientation = "column"; 
        RightCol.alignChildren = ["left","center"]; 
        RightCol.spacing = 12; 
        RightCol.margins = [7,10,0,0]; 

    var RightTop = RightCol.add("radiobutton", undefined, undefined, {name: "RightTop"}); 
        RightTop.preferredSize.height = 15; 
        RightTop.helpTip = translate('RightTop');
        RightTop.onClick = positionChanged;

    var RightMiddle = RightCol.add("radiobutton", undefined, undefined, {name: "RightMiddle"}); 
        RightMiddle.preferredSize.height = 15; 
        RightMiddle.helpTip = translate('RightMiddle');
        RightMiddle.onClick = positionChanged;

    var RightBottom = RightCol.add("radiobutton", undefined, undefined, {name: "RightBottom"}); 
        RightBottom.preferredSize.height = 15; 
        RightBottom.helpTip = translate('RightBottom');
        RightBottom.onClick = positionChanged;

    // BOTTOMROW
    // =========
    var BottomRow = Position.add("group", undefined, {name: "BottomRow"}); 
        BottomRow.preferredSize.height = 20; 
        BottomRow.orientation = "row"; 
        BottomRow.alignChildren = ["left","center"]; 
        BottomRow.spacing = 20; 
        BottomRow.margins = [35,5,0,0]; 
        BottomRow.alignment = ["fill","top"]; 

    var BottomLeft = BottomRow.add("radiobutton", undefined, undefined, {name: "BottomLeft"}); 
        BottomLeft.preferredSize.width = 30; 
        BottomLeft.helpTip = translate('BottomLeft');
        BottomLeft.onClick = positionChanged;

    var BottomMiddle = BottomRow.add("radiobutton", undefined, undefined, {name: "BottomMiddle"}); 
        BottomMiddle.preferredSize.width = 30; 
        BottomMiddle.helpTip = translate('BottomMiddle');
        BottomMiddle.onClick = positionChanged;

    var BottomRight = BottomRow.add("radiobutton", undefined, undefined, {name: "BottomRight"}); 
        BottomRight.preferredSize.width = 30; 
        BottomRight.helpTip = translate('BottomRight');
        BottomRight.onClick = positionChanged;

    // SETTINGSROW
    // ===========
    var SettingsRow = Settings.add("group", undefined, {name: "SettingsRow"}); 
        SettingsRow.orientation = "row"; 
        SettingsRow.alignChildren = ["left","fill"]; 
        SettingsRow.spacing = 5; 
        SettingsRow.margins = 0; 
        SettingsRow.alignment = ["fill","top"]; 

    // DIMENSIONSPANEL
    // ===============
    var DimensionsPanel = SettingsRow.add("panel", undefined, undefined, {name: "DimensionsPanel"}); 
        DimensionsPanel.text = translate('Dimensions Panel');
        DimensionsPanel.orientation = "column"; 
        DimensionsPanel.alignChildren = ["left","top"]; 
        DimensionsPanel.spacing = 5; 
        DimensionsPanel.margins = 10; 

    // ROW1
    // ====
    var DimensionsRow = DimensionsPanel.add("group", undefined, {name: "DimensionsRow"}); 
        DimensionsRow.orientation = "row"; 
        DimensionsRow.alignChildren = ["left","center"]; 
        DimensionsRow.spacing = 5; 
        DimensionsRow.margins = 0; 
        DimensionsRow.alignment = ["fill","top"]; 

    var SizeLabel = DimensionsRow.add("statictext", undefined, undefined, {name: "SizeLabel"}); 
        SizeLabel.text = translate('Size Label'); 

    var Width = DimensionsRow.add('edittext {properties: {name: "Width"}}'); 
        Width.helpTip = translate('Width Tip'); 
        Width.text = "0"; 
        Width.preferredSize.width = 40; 
        Width.alignment = ["left","fill"]; 
        Width.onChange = checkObligatoryFields; 

    var XLabel = DimensionsRow.add("statictext", undefined, undefined, {name: "XLabel"}); 
        XLabel.text = "x"; 

    var Height = DimensionsRow.add('edittext {properties: {name: "Height"}}'); 
        Height.helpTip = translate('Height Tip'); 
        Height.text = "0"; 
        Height.preferredSize.width = 40; 
        Height.alignment = ["left","fill"]; 
        Height.onChange = checkObligatoryFields; 

    var MMLabel = DimensionsRow.add("statictext", undefined, undefined, {name: "MMLabel"}); 
        MMLabel.text = translate('Units mm'); 

    // DIMENSIONSPANEL
    // ===============
    var MarginsLabel = DimensionsPanel.add("statictext", undefined, undefined, {name: "MarginsLabel"}); 
        MarginsLabel.text = translate('Margins Label'); 

    // ROW2
    // ====
    var Row2 = DimensionsPanel.add("group", undefined, {name: "Row2"}); 
        Row2.orientation = "row"; 
        Row2.alignChildren = ["left","center"]; 
        Row2.spacing = 5; 
        Row2.margins = 0; 
        Row2.alignment = ["fill","top"]; 

    var MTop = Row2.add('edittext {properties: {name: "MTop"}}'); 
        MTop.helpTip = translate('Margins top tip'); 
        MTop.text = "0"; 
        MTop.preferredSize.width = 40; 
        MTop.alignment = ["left","fill"]; 
        MTop.onChange = checkMargin; 

    var MRight = Row2.add('edittext {properties: {name: "MRight"}}'); 
        MRight.helpTip = translate('Margins right tip'); 
        MRight.text = "0"; 
        MRight.preferredSize.width = 40; 
        MRight.alignment = ["left","fill"]; 
        MRight.onChange = checkMargin; 

    var MBottom = Row2.add('edittext {properties: {name: "MBottom"}}'); 
        MBottom.helpTip = translate('Margins bottom tip'); 
        MBottom.text = "0"; 
        MBottom.preferredSize.width = 40; 
        MBottom.alignment = ["left","fill"]; 
        MBottom.onChange = checkMargin; 

    var MLeft = Row2.add('edittext {properties: {name: "MLeft"}}'); 
        MLeft.helpTip = translate('Margins left tip'); 
        MLeft.text = "0"; 
        MLeft.preferredSize.width = 40; 
        MLeft.alignment = ["left","fill"]; 
        MLeft.onChange = checkMargin; 

    // RotationRow
    // ===========
    var RotationRow = DimensionsPanel.add("group", undefined, {name: "RotationRow"}); 
        RotationRow.orientation = "row"; 
        RotationRow.alignChildren = ["left","center"]; 
        RotationRow.spacing = 5; 
        RotationRow.margins = 0; 
        RotationRow.alignment = ["fill","top"]; 

    var RotationLabel = RotationRow.add("statictext", undefined, undefined, {name: "RotationLabel"}); 
        RotationLabel.text = translate('Rotation Label');

    var Rotation = RotationRow.add('edittext {properties: {name: "Rotation"}}'); 
        Rotation.helpTip = translate('Rotation tip'); 
        Rotation.text = "0"; 
        Rotation.preferredSize.width = 40; 
        Rotation.alignment = ["left","fill"];
        Rotation.onChange = checkRotation;

    var RotationDegree = RotationRow.add("statictext", undefined, undefined, {name: "RotationDegree"}); 
        RotationDegree.text = "\u00b0";

    // STYLEPANEL
    // ==========
    var StylePanel = SettingsRow.add("panel", undefined, undefined, {name: "StylePanel"}); 
        StylePanel.text = translate('Style panel');
        StylePanel.orientation = "column"; 
        StylePanel.alignChildren = ["left","top"]; 
        StylePanel.spacing = 5; 
        StylePanel.margins = 10; 

    var FColorLabel = StylePanel.add("statictext", undefined, undefined, {name: "FColorLabel"}); 
        FColorLabel.text = translate('Fill color label');

    // ROW5
    // ====
    var FColorGroup = StylePanel.add("group", undefined, {name: "FColorGroup"}); 
        FColorGroup.orientation = "row"; 
        FColorGroup.alignChildren = ["left","center"]; 
        FColorGroup.spacing = 5; 
        FColorGroup.margins = 0; 
        FColorGroup.alignment = ["fill","top"]; 

    var FillC = FColorGroup.add('edittext {properties: {name: "FillC"}}'); 
        FillC.helpTip = "Cyan" + '\n' + translate('Contour color tip'); 
        FillC.text = "0"; 
        FillC.preferredSize.width = 40; 
        FillC.alignment = ["left","fill"]; 
        FillC.onChange = checkColor; 

    var FillM = FColorGroup.add('edittext {properties: {name: "FillM"}}'); 
        FillM.helpTip = "Magenta" + '\n' + translate('Contour color tip'); 
        FillM.text = "0"; 
        FillM.preferredSize.width = 40; 
        FillM.alignment = ["left","fill"]; 
        FillM.onChange = checkColor; 

    var FillY = FColorGroup.add('edittext {properties: {name: "FillY"}}'); 
        FillY.helpTip = "Yellow" + '\n' + translate('Contour color tip'); 
        FillY.text = "0"; 
        FillY.preferredSize.width = 40; 
        FillY.alignment = ["left","fill"]; 
        FillY.onChange = checkColor;  

    var FillK = FColorGroup.add('edittext {properties: {name: "FillK"}}'); 
        FillK.helpTip = "Black" + '\n' + translate('Contour color tip'); 
        FillK.text = "0"; 
        FillK.preferredSize.width = 40; 
        FillK.alignment = ["left","fill"]; 
        FillK.onChange = checkColor; 

    // ROW3
    // ====
    var Row3 = StylePanel.add("group", undefined, {name: "Row3"}); 
        Row3.orientation = "row"; 
        Row3.alignChildren = ["left","center"]; 
        Row3.spacing = 5; 
        Row3.margins = 0; 
        Row3.alignment = ["fill","top"]; 

    var StrokeLabel = Row3.add("statictext", undefined, undefined, {name: "StrokeLabel"}); 
        StrokeLabel.text = translate('Stroke weight label');

    var SWeight = Row3.add('edittext {properties: {name: "SWeight"}}'); 
        SWeight.helpTip = translate('Stroke weight tip');
        SWeight.text = "0"; 
        SWeight.preferredSize.width = 40; 
        SWeight.alignment = ["left","fill"]; 
        SWeight.onChange = checkSWeight; 

    var MMLabel1 = Row3.add("statictext", undefined, undefined, {name: "MMLabel1"}); 
        MMLabel1.text = translate('Units mm');

    // STYLEPANEL
    // ==========
    var SColorLabel = StylePanel.add("statictext", undefined, undefined, {name: "SColorLabel"}); 
        SColorLabel.text = translate('Stroke color label');

    // STROKEFILLGROUP
    // ===============
    var StrokeFillGroup = StylePanel.add("group", undefined, {name: "StrokeFillGroup"}); 
        StrokeFillGroup.enabled = false; 
        StrokeFillGroup.orientation = "row"; 
        StrokeFillGroup.alignChildren = ["left","center"]; 
        StrokeFillGroup.spacing = 5; 
        StrokeFillGroup.margins = 0; 
        StrokeFillGroup.alignment = ["fill","top"]; 

    var StrokeC = StrokeFillGroup.add('edittext {properties: {name: "StrokeC"}}'); 
        StrokeC.helpTip = "Cyan" + '\n' + translate('Contour color tip'); 
        StrokeC.text = "0"; 
        StrokeC.preferredSize.width = 40; 
        StrokeC.alignment = ["left","fill"]; 
        StrokeC.onChange = checkColor; 

    var StrokeM = StrokeFillGroup.add('edittext {properties: {name: "StrokeM"}}'); 
        StrokeM.helpTip = "Magenta" + '\n' + translate('Contour color tip'); 
        StrokeM.text = "0"; 
        StrokeM.preferredSize.width = 40; 
        StrokeM.alignment = ["left","fill"]; 
        StrokeM.onChange = checkColor; 

    var StrokeY = StrokeFillGroup.add('edittext {properties: {name: "StrokeY"}}'); 
        StrokeY.helpTip = "Yellow" + '\n' + translate('Contour color tip'); 
        StrokeY.text = "0"; 
        StrokeY.preferredSize.width = 40; 
        StrokeY.alignment = ["left","fill"]; 
        StrokeY.onChange = checkColor; 

    var StrokeK = StrokeFillGroup.add('edittext {properties: {name: "StrokeK"}}'); 
        StrokeK.helpTip = "Black" + '\n' + translate('Contour color tip'); 
        StrokeK.text = "0"; 
        StrokeK.preferredSize.width = 40; 
        StrokeK.alignment = ["left","fill"]; 
        StrokeK.onChange = checkColor; 

    // TEXTPANEL
    // =========
    var TextPanel = EditMark.add("panel", undefined, undefined, {name: "TextPanel"}); 
        TextPanel.enabled = false; 
        TextPanel.text = translate('Text panel');
        TextPanel.orientation = "column"; 
        TextPanel.alignChildren = ["left","top"]; 
        TextPanel.spacing = 5; 
        TextPanel.margins = 10; 
        TextPanel.alignment = ["fill","top"]; 

    // ROW6
    // ====
    var Row2 = TextPanel.add("group", undefined, {name: "Row2"}); 
        Row2.orientation = "row"; 
        Row2.alignChildren = ["left","center"]; 
        Row2.spacing = 5; 
        Row2.margins = 0; 
        Row2.alignment = ["fill","top"];

    var FontName = Row2.add("statictext", undefined, undefined, {name: "FontName"}); 
        FontName.text = translate('Font Name label');

    var FontsList_array = [translate('Not defined')];
    
    if (FontsList_array.length == 1)
        for (var i = 0; i < fontsAll.length; i++) {
            try {
                if (fontsAll[i].isValid &&
                    fontsAll[i].allowPDFEmbedding &&
                    fontsAll[i].status == FontStatus.INSTALLED
                    ) {
                    FontsList_array.push(fontsAll[i].name);
                }
            } catch(e) {
                continue;
            }
        }

    var FontsList = Row2.add("dropdownlist", undefined, undefined, {items: FontsList_array, name: "FontsList"}); 
        FontsList.selection = 0;
        FontsList.preferredSize.width = 180;
        FontsList.alignment = ["left","fill"]; 
        FontsList.onChange = checkObligatoryFields; 

    var FontSizeLabel = Row2.add("statictext", undefined, undefined, {name: "FontSizeLabel"}); 
        FontSizeLabel.text = translate('Size Label'); 

    var FontSize = Row2.add('edittext {properties: {name: "FontSize"}}'); 
        FontSize.helpTip = translate('Font Size tip');
        FontSize.text = "1"; 
        FontSize.preferredSize.width = 40; 
        FontSize.alignment = ["left","fill"]; 
        FontSize.onChange = checkTextSize; 

    var PTLabel = Row2.add("statictext", undefined, undefined, {name: "PTLabel"}); 
        PTLabel.text = "pt";

    var TextTemplateLabel = TextPanel.add("statictext", undefined, undefined, {name: "TextTemplateLabel"}); 
        TextTemplateLabel.text = translate('Template label');

    var TextTemplate = TextPanel.add('edittext {properties: {name: "TextTemplate", multiline: true, scrollable: true}}'); 
        TextTemplate.helpTip = translate('Template tip');
        TextTemplate.alignment = ["fill","top"];
        TextTemplate.onChange = checkObligatoryFields;

    var Placeholders_list = [
        translate('Add placeholder'),
        '%DocumentName%',
        '%DocumentFolder%',
        '%CurrentPage%',
        '%TotalPages%',
        '%PlotterName%',
        '%PlotterAlias%',
        '%ItemContourSize%',
        '%CutLength%',
        '%ContourGap%',
        '%ItemsPerPage%',
        '%ItemsPerDocument%',
        '%SheetSize%',
        '%PaperName%',
        '%CurrentTime%',
        '%CurrentDate%',
        '%UserName%'
    ];

    var Placeholders = TextPanel.add("dropdownlist", undefined, undefined, {items: Placeholders_list, name: "Placeholders"}); 
        Placeholders.selection = 0;
        Placeholders.preferredSize.width = 140;
        Placeholders.alignment = ["left","fill"];
        Placeholders.onChange = function() {
            if (Placeholders.selection && Placeholders.selection.index) {
                TextTemplate.textselection = Placeholders_list[Placeholders.selection.index];
                Placeholders.selection = 0;
            }
        }

    // ROW6
    // ====
    var Row6 = TextPanel.add("group", undefined, {name: "Row6"}); 
        Row6.orientation = "row"; 
        Row6.alignChildren = ["left","center"]; 
        Row6.spacing = 5; 
        Row6.margins = 0; 
        Row6.alignment = ["fill","top"];
        
    var TextOrientationLabel = Row6.add("statictext", undefined, undefined, {name: "TextOrientationLabel"}); 
        TextOrientationLabel.text = translate('Text Orientation Label');
        
    var TextOrientation = Row6.add("dropdownlist", undefined, undefined, {items: [translate('Text to border orientation'), translate('Text to frame orientation')], name: "TextOrientation"}); 
        TextOrientation.selection = 0;
        TextOrientation.preferredSize.width = 210;
        TextOrientation.alignment = ["left","fill"];
        
    // ROW6
    // ====
    var Row7 = EditMark.add("group", undefined, {name: "Row7"}); 
        Row7.orientation = "row"; 
        Row7.alignChildren = ["left","center"]; 
        Row7.spacing = 5; 
        Row7.margins = 0; 
        Row7.alignment = ["fill","top"];
        
    var MarkAppearanceLabel = Row7.add("statictext", undefined, undefined, {name: "MarkAppearanceLabel"}); 
        MarkAppearanceLabel.text = translate('Mark Appearance Label');
        
    var MarkAppearance = Row7.add("dropdownlist", undefined, undefined, {items: [translate("Cut & Print files"), translate("Cut file"), translate("Print file")], name: "MarkAppearance"}); 
        MarkAppearance.selection = 0;
        MarkAppearance.preferredSize.width = 220;
        MarkAppearance.alignment = ["left","fill"];

    // BUTTONSGROUP
    // ============
    var ButtonsGroup = EditMark.add("group", undefined, {name: "ButtonsGroup"}); 
        ButtonsGroup.orientation = "row"; 
        ButtonsGroup.alignChildren = ["right","fill"]; 
        ButtonsGroup.spacing = 10; 
        ButtonsGroup.margins = 0; 
        ButtonsGroup.alignment = ["right","top"]; 

    var Cancel = ButtonsGroup.add("button", undefined, undefined, {name: "Cancel"}); 
        Cancel.text = translate('Cancel Btn'); 
        Cancel.onClick = function() {
            EditMark.close();
        }; 

    var Save = ButtonsGroup.add("button", undefined, undefined, {name: "Save"}); 
        Save.enabled = false; 
        Save.text = translate('Save Btn');
        Save.onClick = saveMark; 

    const positions = [
        {
            value: 'top-left',
            element: TopLeft
        },{
            value: 'top-middle',
            element: TopMiddle
        },{
            value: 'top-right',
            element: TopRight
        },{
            value: 'bottom-left',
            element: BottomLeft
        },{
            value: 'bottom-middle',
            element: BottomMiddle
        },{
            value: 'bottom-right',
            element: BottomRight
        },{
            value: 'left-top',
            element: LeftTop
        },{
            value: 'left-middle',
            element: LeftMiddle
        },{
            value: 'left-bottom',
            element: LeftBottom
        },{
            value: 'right-top',
            element: RightTop
        },{
            value: 'right-middle',
            element: RightMiddle
        },{
            value: 'right-bottom',
            element: RightBottom
        }
    ];

    function positionChanged() {
        const helpTip = this.helpTip;
        for (var i = 0; i < positions.length; i++) {
            if (positions[i].element.helpTip != helpTip) positions[i].element.value = false;
        }
        isOk.position = true;
        checkObligatoryFields();
    }

    function shapeChanged() {
        if (!this.selection) return;
        const shape = this.selection.text;
        switch (shape) {
            case translate('Oval mark'):
            case translate('Rectangle mark'):
                TextPanel.enabled = false;
                Width.enabled = true;
                SWeight.enabled = true;
                FColorGroup.enabled = true;
                Rotation.enabled = true;
                checkSWeight();
                break;
            case translate('Line mark'):
                TextPanel.enabled = false;
                Width.enabled = false;
                SWeight.enabled = true;
                FColorGroup.enabled = false;
                Rotation.enabled = true;
                checkSWeight();
                break;
            case translate('Text mark'):
                TextPanel.enabled = true;
                Width.enabled = true;
                StrokeFillGroup.enabled = false;
                SWeight.enabled = false;
                FColorGroup.enabled = true;
                Rotation.enabled = false;
                checkObligatoryFields();
                break;
        }
    }

    function checkSWeight() {
        if (!this.text) return;
        var _SWeight = this.text.replace(',', '.');
        _SWeight = isValidNumber(_SWeight) ? Number(_SWeight) : 0;
        if (_SWeight <= 0) _SWeight = 0;
        if (_SWeight > 1000) _SWeight = 1000;
        if (_SWeight > 0) {
            StrokeFillGroup.enabled = true;
        } else {
            StrokeFillGroup.enabled = false;
        };
        this.text = _SWeight;
        checkObligatoryFields();
    }

    function checkRotation() {
        if (!this.text) return;
        var _RotationValue = this.text.replace(',', '.');
        _RotationValue = isValidAnyNumber(_RotationValue) ? Number(_RotationValue) : 0;
        if (_RotationValue < -360 || _RotationValue > 360) _RotationValue = 0;
        this.text = _RotationValue;
    }

    function checkColor() {
        if (!this.text) return;
        var _ColorValue = this.text.replace(',', '.');
        _ColorValue = isValidNumber(_ColorValue) ? Number(_ColorValue) : 0;
        if (_ColorValue <= 0) _ColorValue = 0;
        if (_ColorValue > 100) _ColorValue = 100;
        this.text = _ColorValue;
    }

    function checkTextSize() {
        if (!this.text) return;
        var _TextSize = this.text.replace(',', '.');
        _TextSize = isValidNumber(_TextSize) ? Number(_TextSize) : 0;
        if (_TextSize <= 1) _TextSize = 1;
        if (_TextSize > 100) _TextSize = 100;
        this.text = _TextSize;
    }

    function checkObligatoryFields() {
        var _Width = Width.text.replace(',', '.');
        var _Height = Height.text.replace(',', '.');
        _Width = isValidNumber(_Width) ? Number(_Width) : 0;
        _Height = isValidNumber(_Height) ? Number(_Height) : 0;
        if (_Width <= 0) _Width = 0;
        if (_Width > 1000) _Width = 1000;
        if (_Height <= 0) _Height = 0;
        if (_Height > 1000) _Height = 1000;
        isOk.size = _Width != 0 && _Height != 0;
        if (Shape.selection.text == translate('Line mark')) {
            isOk.size = _Height != 0 && +SWeight.text != 0;
        };
        if (Shape.selection.text == translate('Text mark')) {
            isOk.size = isOk.size && TextTemplate.text != "" && FontsList.selection.index;
        };
        Width.text = _Width;
        Height.text = _Height;
        isAllOk();
    }

    function checkMargin() {
        if (!this.text) return;
        var _MarginValue = this.text.replace(',', '.');
        _MarginValue = isValidAnyNumber(_MarginValue) ? Number(_MarginValue) : 0;
        if (_MarginValue > 1000) _MarginValue = 1000;
        if (_MarginValue < -1000) _MarginValue = -1000;
        this.text = _MarginValue;
    }

    function isValidAnyNumber(cText) {
        var rg2 = /^(-?\d+)([\.,]\d+)?$/gm;
        return !isNaN(Number(cText)) && rg2.test(cText);
    }

    function isValidNumber(cText) {
        var rg2 = /^(\d+)([\.,]\d+)?$/gm;
        return !isNaN(Number(cText)) && rg2.test(cText);
    }

    function isAllOk() {
        if (isOk.size && isOk.position) {
            Save.enabled = true;
        } else {
            Save.enabled = false;
        }
    }

    function saveMark() {
        const shape = Shape.selection.text;
        var position;
        newMark = {};
        for (var i = 0; i < positions.length; i++) {
            if (positions[i].element.value) {
                newMark.position = positions[i].value;
                isOk.position = true;
                break;
            }
        };
        newMark.margins = [
            +MTop.text,
            +MRight.text,
            +MBottom.text,
            +MLeft.text,
        ];
        newMark.appearance = MarkAppearance.selection.index;
        switch (shape) {
            case translate('Oval mark'):
            case translate('Rectangle mark'):
                newMark.shape = shape == translate('Oval mark') ? 'oval' : 'rectangle';
                newMark.width = +Width.text;
                newMark.height = +Height.text;
                newMark.rotation = +Rotation.text;
                newMark.fillColor = [
                    +FillC.text,
                    +FillM.text,
                    +FillY.text,
                    +FillK.text,
                ];
                newMark.strokeWeight = +SWeight.text;
                newMark.strokeColor = [
                    +StrokeC.text,
                    +StrokeM.text,
                    +StrokeY.text,
                    +StrokeK.text,
                ];
                break;
            case translate('Line mark'):
                newMark.shape = 'line';
                newMark.width = 0;
                newMark.height = +Height.text;
                newMark.rotation = +Rotation.text;
                newMark.strokeWeight = +SWeight.text;
                newMark.strokeColor = [
                    +StrokeC.text,
                    +StrokeM.text,
                    +StrokeY.text,
                    +StrokeK.text,
                ];
                break;
            case translate('Text mark'):
                newMark.shape = 'text';
                newMark.width = +Width.text;
                newMark.height = +Height.text;
                newMark.fontName = FontsList.selection.text;
                newMark.fontSize = +FontSize.text;
                newMark.template = TextTemplate.text;
                newMark.orientation = TextOrientation.selection.index;
                newMark.fillColor = [
                    +FillC.text,
                    +FillM.text,
                    +FillY.text,
                    +FillK.text,
                ];
                break;
        }
        EditMark.close();
    }

    if (markToEdit) {
        const shape = {
            'oval': translate('Oval mark'),
            'rectangle': translate('Rectangle mark'),
            'line': translate('Line mark'),
            'text': translate('Text mark'),
        };
        if (markToEdit.sheet) SheetPanel.text = markToEdit.sheet[0] + 'x' + markToEdit.sheet[1] + translate('Units mm');
        if (markToEdit.frame) WorkingFramePanel.text = markToEdit.frame[0] + 'x' + markToEdit.frame[1] + translate('Units mm');
        if (markToEdit.frameMargins) {
            TopMargin.text = "\u2191 " + markToEdit.frameMargins[0];
            LeftRightMargins.text = "\u27f5 " + markToEdit.frameMargins[3] + "  " + markToEdit.frameMargins[1] + " \u27f6";
            BottomMargin.text = "\u2193 " + markToEdit.frameMargins[2];
        };      
        if (markToEdit.mark) {
            if (markToEdit.mark.hasOwnProperty('shape')) {
                Shape.selection = Shape_array.indexOf(shape[markToEdit.mark.shape]) || 0;
                shapeChanged.apply(Shape);
            };
            if (markToEdit.mark.hasOwnProperty('position')) {
                for (var i = 0; i < positions.length; i++) {
                    if (positions[i].value == markToEdit.mark.position) {
                        positions[i].element.value = true;
                        isOk.position = true;
                        break;
                    }
                }
            }
            if (markToEdit.mark.hasOwnProperty('width')) Width.text = markToEdit.mark.width;
            if (markToEdit.mark.hasOwnProperty('height')) Height.text = markToEdit.mark.height;
            if (markToEdit.mark.hasOwnProperty('margins')) {
                MTop.text = markToEdit.mark.margins[0];
                MRight.text = markToEdit.mark.margins[1];
                MBottom.text = markToEdit.mark.margins[2];
                MLeft.text = markToEdit.mark.margins[3];
                checkMargin.apply(MTop);
                checkMargin.apply(MRight);
                checkMargin.apply(MBottom);
                checkMargin.apply(MLeft);
            };
            if (markToEdit.mark.hasOwnProperty('rotation')) {
                Rotation.text = markToEdit.mark.rotation;
                checkRotation.apply(Rotation);
            }
            if (markToEdit.mark.hasOwnProperty('fillColor')) {
                FillC.text = markToEdit.mark.fillColor[0];
                FillM.text = markToEdit.mark.fillColor[1];
                FillY.text = markToEdit.mark.fillColor[2];
                FillK.text = markToEdit.mark.fillColor[3];
                checkColor.apply(FillC);
                checkColor.apply(FillM);
                checkColor.apply(FillY);
                checkColor.apply(FillK);
            };
            if (markToEdit.mark.hasOwnProperty('strokeWeight')) {
                SWeight.text = markToEdit.mark.strokeWeight;
                checkSWeight.apply(SWeight);
            };
            if (markToEdit.mark.hasOwnProperty('strokeColor')) {
                StrokeC.text = markToEdit.mark.strokeColor[0];
                StrokeM.text = markToEdit.mark.strokeColor[1];
                StrokeY.text = markToEdit.mark.strokeColor[2];
                StrokeK.text = markToEdit.mark.strokeColor[3];
                checkColor.apply(StrokeC);
                checkColor.apply(StrokeM);
                checkColor.apply(StrokeY);
                checkColor.apply(StrokeK);
            };
            if (markToEdit.mark.hasOwnProperty('fontName')) {
                var fontIndex = FontsList_array.indexOf(markToEdit.mark.fontName);
                if (fontIndex > 0) {
                    FontsList.selection = fontIndex;
                } else {
                    FontsList.selection = 0;
                    Save.enabled = true;
                }
            };
            if (markToEdit.mark.hasOwnProperty('fontSize')) {
                FontSize.text = markToEdit.mark.fontSize;
                checkTextSize.apply(FontSize);
            }
            if (markToEdit.mark.hasOwnProperty('template')) TextTemplate.text = markToEdit.mark.template;
            if (markToEdit.mark.hasOwnProperty('orientation')) TextOrientation.selection = markToEdit.mark.orientation;
            if (markToEdit.mark.hasOwnProperty('appearance')) {
                MarkAppearance.selection = markToEdit.mark.appearance;
            } else {
                MarkAppearance.selection = 0;
                Save.enabled = true;
            }
        };
        checkObligatoryFields();        
    }

    var myResult = EditMark.show();

    EditMark = null;

	return {
        newMark: newMark
    };

}