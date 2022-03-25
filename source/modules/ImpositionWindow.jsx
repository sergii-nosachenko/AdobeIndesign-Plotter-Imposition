// Налаштування параметрів нової розкладки

function NewImposSettingsWindow() {
	
	var Params = false;
	var VariantsRozkladka = [];
	var IsGetSizeFromFilename = myCustomDoc.IsGetSizeFromFilename;
	var IsSaveFileWithCut = myCustomDoc.IsSaveFileWithCut;
	var IsRoundedCorners = myCustomDoc.IsRoundedCorners;
	var IsZeroBleeds = myCustomDoc.IsZeroBleeds;
	
	var minSpaceBetween;
	
	var isOk = {
		Size: false,
		SpaceBetween: true,
		Variant: false
	}

	// NEWCUSTOMDOCSETTINGS
	// ====================
	var NewCustomDocSettings = new Window("dialog"); 
		NewCustomDocSettings.text = translate('Imposition Template Settings Title'); 
		NewCustomDocSettings.orientation = "column"; 
		NewCustomDocSettings.alignChildren = ["center","top"]; 
		NewCustomDocSettings.spacing = 10; 
		NewCustomDocSettings.margins = 16;
		
	// FIGURESELECTOR
	// ===================
	var FigureSelector = NewCustomDocSettings.add("tabbedpanel", undefined, undefined, {name: "FigureSelector"}); 
		FigureSelector.alignChildren = "fill";
		FigureSelector.margins = 0; 
		FigureSelector.alignment = ["fill","top"]; 
		
	// ---------------CIRCLES-----------------
	// CIRCLESSETTINGS
	// ===============
	var CirclesSettings = FigureSelector.add("tab", undefined, undefined, {name: "CirclesSettings"}); 
		CirclesSettings.text = translate('Circles');
		CirclesSettings.orientation = "column"; 
		CirclesSettings.alignChildren = ["left","top"]; 
		CirclesSettings.spacing = 10; 
		CirclesSettings.margins = 10; 		

	// CIRCLESETTINGSPANEL
	// =============
	var CircleSettingsPanel = CirclesSettings.add("panel", undefined, undefined, {name: "CircleSettingsPanel"}); 
		CircleSettingsPanel.text = translate('Circle Settings Panel Title'); 
		CircleSettingsPanel.orientation = "row"; 
		CircleSettingsPanel.alignChildren = ["left","top"]; 
		CircleSettingsPanel.spacing = 10; 
		CircleSettingsPanel.margins = 10; 
		CircleSettingsPanel.alignment = ["fill","top"]; 

	// CIRCLEDOCPARAMSGROUP
	// ==============
	var CircleDocParamsGroup = CircleSettingsPanel.add("group", undefined, {name: "CircleDocParamsGroup"}); 
		CircleDocParamsGroup.orientation = "column"; 
		CircleDocParamsGroup.alignChildren = ["left","center"]; 
		CircleDocParamsGroup.spacing = 10; 
		CircleDocParamsGroup.margins = [0,10,0,0]; 
		CircleDocParamsGroup.alignment = ["left","fill"]; 
		

	var GetCircleSizeFromFilename = CircleDocParamsGroup.add("checkbox", undefined, undefined, {name: "GetCircleSizeFromFilename"}); 
		GetCircleSizeFromFilename.text = translate('Size From Filename'); 
		GetCircleSizeFromFilename.value = IsGetSizeFromFilename;		
		GetCircleSizeFromFilename.onClick = CircleCheckBoxClick;
		
	var GetCircleSizeFromFilenameDisclaimer = CircleDocParamsGroup.add("statictext", undefined, undefined, {name: "GetCircleSizeFromFilenameDisclaimer", multiline: true}); 
		GetCircleSizeFromFilenameDisclaimer.text = translate('Circle Filename Disclaimer'); 
		GetCircleSizeFromFilenameDisclaimer.enabled = false;
		GetCircleSizeFromFilenameDisclaimer.preferredSize.width = 400;	
		GetCircleSizeFromFilenameDisclaimer.preferredSize.height = 45;	
		
	// CIRCLESIZEGROUP
	// =========				
	var CircleSizeGroup = CircleDocParamsGroup.add("group", undefined, {name: "CircleSizeGroup"}); 
		CircleSizeGroup.orientation = "row"; 
		CircleSizeGroup.alignChildren = ["left","center"]; 
		CircleSizeGroup.spacing = 10; 
		CircleSizeGroup.margins = 0;
		CircleSizeGroup.enabled = !IsGetSizeFromFilename;

	var DiameterLabel = CircleSizeGroup.add("statictext", undefined, undefined, {name: "DiameterLabel"}); 
		DiameterLabel.text = translate('Diameter Label'); 

	var Diameter = CircleSizeGroup.add('edittext {properties: {name: "Diameter"}}'); 
		Diameter.text = myCustomDoc.Diameter; 
		Diameter.preferredSize.width = 100;
		Diameter.helpTip = translate('Diameter Tip');
		Diameter.onChange = totalFieldsCheck;

	var DiameterUnits = CircleSizeGroup.add("statictext", undefined, undefined, {name: "DiameterUnits"}); 
		DiameterUnits.text = translate('Units mm');

	// ---------------RECTANGLES-----------------
	// RECTANGLESSETTINGS
	// ===============
	var RectanglesSettings = FigureSelector.add("tab", undefined, undefined, {name: "RectanglesSettings"}); 
		RectanglesSettings.text = translate('Rectangles');
		RectanglesSettings.orientation = "column"; 
		RectanglesSettings.alignChildren = ["left","top"]; 
		RectanglesSettings.spacing = 10; 
		RectanglesSettings.margins = 10; 		

	// RECTANGLESETTINGSPANEL
	// =============
	var RectangleSettingsPanel = RectanglesSettings.add("panel", undefined, undefined, {name: "RectangleSettingsPanel"}); 
		RectangleSettingsPanel.text = translate('Rectangles Settings Panel Title');
		RectangleSettingsPanel.orientation = "row"; 
		RectangleSettingsPanel.alignChildren = ["left","top"]; 
		RectangleSettingsPanel.spacing = 10; 
		RectangleSettingsPanel.margins = 10; 
		RectangleSettingsPanel.alignment = ["fill","top"]; 

	// RECTANGLEDOCPARAMSGROUP
	// ==============
	var RectangleDocParamsGroup = RectangleSettingsPanel.add("group", undefined, {name: "RectangleDocParamsGroup"}); 
		RectangleDocParamsGroup.orientation = "column"; 
		RectangleDocParamsGroup.alignChildren = ["left","center"]; 
		RectangleDocParamsGroup.spacing = 10; 
		RectangleDocParamsGroup.margins = [0,10,0,0]; 
		RectangleDocParamsGroup.alignment = ["left","fill"]; 
		

	var GetRectangleSizeFromFilename = RectangleDocParamsGroup.add("checkbox", undefined, undefined, {name: "GetRectangleSizeFromFilename"}); 
		GetRectangleSizeFromFilename.text =  translate('Size From Filename');
		GetRectangleSizeFromFilename.value = IsGetSizeFromFilename;		
		GetRectangleSizeFromFilename.onClick = RectangleCheckBoxClick;
		
	var GetRectangleSizeFromFilenameDisclaimer = RectangleDocParamsGroup.add("statictext", undefined, undefined, {name: "GetRectangleSizeFromFilenameDisclaimer", multiline: true}); 
		GetRectangleSizeFromFilenameDisclaimer.text = translate('Rectangles Filename Disclaimer');
		GetRectangleSizeFromFilenameDisclaimer.enabled = false; 
		GetRectangleSizeFromFilenameDisclaimer.preferredSize.width = 400;		
		GetRectangleSizeFromFilenameDisclaimer.preferredSize.height = 60;
		
	// RECTANGLESIZEGROUP
	// =========	
	var RectangleSizeGroup = RectangleDocParamsGroup.add("group", undefined, {name: "RectangleSizeGroup"}); 
		RectangleSizeGroup.orientation = "row"; 
		RectangleSizeGroup.alignChildren = ["left","center"]; 
		RectangleSizeGroup.spacing = 10; 
		RectangleSizeGroup.margins = 0;
		RectangleSizeGroup.enabled = !IsGetSizeFromFilename;

	var WidthLabel = RectangleSizeGroup.add("statictext", undefined, undefined, {name: "WidthLabel"}); 
		WidthLabel.text = translate('Width Label');

	var RectWidth = RectangleSizeGroup.add('edittext {properties: {name: "RectWidth"}}'); 
		RectWidth.text = myCustomDoc.RectWidth; 
		RectWidth.preferredSize.width = 100;
		RectWidth.helpTip = translate('Width Tip');
		RectWidth.onChange = totalFieldsCheck;

	var WidthUnits = RectangleSizeGroup.add("statictext", undefined, undefined, {name: "WidthUnits"}); 
		WidthUnits.text = translate('Units mm');
		
	var HeightLabel = RectangleSizeGroup.add("statictext", undefined, undefined, {name: "HeightLabel"}); 
		HeightLabel.text = translate('Height Label');

	var RectHeight = RectangleSizeGroup.add('edittext {properties: {name: "RectHeight"}}'); 
		RectHeight.text = myCustomDoc.RectHeight; 
		RectHeight.preferredSize.width = 100;
		RectHeight.helpTip = translate('Height Tip');
		RectHeight.onChange = totalFieldsCheck;

	var HeightUnits = RectangleSizeGroup.add("statictext", undefined, undefined, {name: "HeightUnits"}); 
		HeightUnits.text = translate('Units mm');

	// ROUNDCORNERSGROUP
	// =========	
	var RoundCornersGroup = RectangleDocParamsGroup.add("group", undefined, {name: "RoundCornersGroup"}); 
		RoundCornersGroup.orientation = "row"; 
		RoundCornersGroup.alignChildren = ["left","center"]; 
		RoundCornersGroup.spacing = 10; 
		RoundCornersGroup.margins = 0;

	var RoundCorners = RoundCornersGroup.add("checkbox", undefined, undefined, {name: "RoundCorners"}); 
		RoundCorners.text = translate('Round Corners Label');
		RoundCorners.value = IsRoundedCorners;		
		RoundCorners.onClick = RoundCornersCheckBoxClick;
		
	var RoundCornersValueGroup = RoundCornersGroup.add("group", undefined, {name: "RoundCornersValueGroup"}); 
		RoundCornersValueGroup.orientation = "row";
		RoundCornersValueGroup.enabled = IsRoundedCorners;
		
	var RoundCornersValue = RoundCornersValueGroup.add('edittext {properties: {name: "RoundCornersValue"}}'); 
		RoundCornersValue.text = myCustomDoc.RoundCornersValue || 0; 
		RoundCornersValue.preferredSize.width = 100;
		RoundCornersValue.onChange = totalFieldsCheck;

	var CornersUnits = RoundCornersValueGroup.add("statictext", undefined, undefined, {name: "CornersUnits"}); 
		CornersUnits.text = translate('Units mm');
		
	// ---------------MIXED-----------------
	// MIXEDSETTINGS
	// ===============
	var MixedSettings = FigureSelector.add("tab", undefined, undefined, {name: "MixedSettings"}); 
		MixedSettings.text = translate('Mixed');
		MixedSettings.orientation = "column"; 
		MixedSettings.alignChildren = ["left","top"]; 
		MixedSettings.spacing = 10; 
		MixedSettings.margins = 10; 		

	// MIXEDSETTINGSPANEL
	// =============
	var MixedSettingsPanel = MixedSettings.add("panel", undefined, undefined, {name: "MixedSettingsPanel"}); 
		MixedSettingsPanel.text = translate('Mixed Settings Panel Title'); 
		MixedSettingsPanel.orientation = "row"; 
		MixedSettingsPanel.alignChildren = ["left","top"]; 
		MixedSettingsPanel.spacing = 10; 
		MixedSettingsPanel.margins = 10; 
		MixedSettingsPanel.alignment = ["fill","top"]; 

	// MIXEDDOCPARAMSGROUP
	// ==============
	var MixedDocParamsGroup = MixedSettingsPanel.add("group", undefined, {name: "MixedDocParamsGroup"}); 
		MixedDocParamsGroup.orientation = "column"; 
		MixedDocParamsGroup.alignChildren = ["left","center"]; 
		MixedDocParamsGroup.spacing = 10;
		MixedDocParamsGroup.margins = [0,10,0,0]; 
		MixedDocParamsGroup.alignment = ["left","fill"]; 
		

	var GetMixedSizeFromFilename = MixedDocParamsGroup.add("checkbox", undefined, undefined, {name: "GetMixedSizeFromFilename"}); 
		GetMixedSizeFromFilename.text = translate('Size From Filename');
		GetMixedSizeFromFilename.value = true;
		GetMixedSizeFromFilename.enabled = false;
		
	var GetMixedSizeFromFilenameDisclaimer1 = MixedDocParamsGroup.add("statictext", undefined, undefined, {name: "GetMixedSizeFromFilenameDisclaimer1", multiline: true}); 
		GetMixedSizeFromFilenameDisclaimer1.text = translate('Circle Filename Disclaimer'); 
		GetMixedSizeFromFilenameDisclaimer1.enabled = false;
		GetMixedSizeFromFilenameDisclaimer1.preferredSize.width = 400;		
		GetMixedSizeFromFilenameDisclaimer1.preferredSize.height = 45;	
		
	var GetMixedSizeFromFilenameDisclaimer2 = MixedDocParamsGroup.add("statictext", undefined, undefined, {name: "GetMixedSizeFromFilenameDisclaimer2", multiline: true}); 
		GetMixedSizeFromFilenameDisclaimer2.text = translate('Rectangles Filename Disclaimer');
		GetMixedSizeFromFilenameDisclaimer2.enabled = false; 
		GetMixedSizeFromFilenameDisclaimer2.preferredSize.width = 400;		
		GetMixedSizeFromFilenameDisclaimer2.preferredSize.height = 60;		

	// FIGURESELECTOR
	// ==============
	FigureSelector.selection = RectanglesSettings;
	if (!myCustomDoc.Figure || myCustomDoc.Figure == translate('Circles')) {
		FigureSelector.selection = CirclesSettings;
	} else if (myCustomDoc.Figure == translate('Rectangles')) {
		FigureSelector.selection = RectanglesSettings;
	} else {
		FigureSelector.selection = MixedSettings;
	}
	FigureSelector.onChange = totalFieldsCheck;
	
	// SETTINGSPANEL
	// =============
	var SettingsPanel = NewCustomDocSettings.add("panel", undefined, undefined, {name: "SettingsPanel"}); 
		SettingsPanel.text = translate('Plotter Panel Title'); 
		SettingsPanel.orientation = "row"; 
		SettingsPanel.alignChildren = ["left","top"]; 
		SettingsPanel.spacing = 10; 
		SettingsPanel.margins = 10; 
		SettingsPanel.alignment = ["fill","top"]; 	

	// DOCPARAMSGROUP
	// ===============
	var DocParamsGroup = SettingsPanel.add("group", undefined, {name: "DocParamsGroup"}); 
		DocParamsGroup.orientation = "column"; 
		DocParamsGroup.alignChildren = ["left","center"]; 
		DocParamsGroup.spacing = 10; 
		DocParamsGroup.margins = 0; 
		DocParamsGroup.alignment = ["left","fill"]; 

	// CUTTERTYPEGROUP
	// ===============
	var CutterTypeGroup = DocParamsGroup.add("group", undefined, {name: "CutterTypeGroup"}); 
		CutterTypeGroup.orientation = "row"; 
		CutterTypeGroup.alignChildren = ["left","center"]; 
		CutterTypeGroup.spacing = 10; 
		CutterTypeGroup.margins = 0; 

	var CutterTypeLabel = CutterTypeGroup.add("statictext", undefined, undefined, {name: "CutterTypeLabel"}); 
		CutterTypeLabel.text = translate('Cutter Types Label'); 

	var CutterType_array = [];
	for (var i = 0; i < CUTTER_TYPES.length; i++) {
		CutterType_array.push(CUTTER_TYPES[i].text);
	}
	
	var CutterType = CutterTypeGroup.add("dropdownlist", undefined, undefined, {name: "CutterType", items: CutterType_array}); 
	    CutterType.preferredSize.width = 250;
        CutterType.alignment = ["left","fill"];
	if (myCustomDoc.CutterType) {
		CutterType.find(myCustomDoc.CutterType.text).selected = true;
	} else {
		CutterType.selection = APP_PREFERENCES.app.lastPlotter < CutterType_array.length ? APP_PREFERENCES.app.lastPlotter : 0;			
	}
	CutterType.addEventListener('change', CutterTypeChange);

    function CutterTypeChange() {
		if (!CutterType.selection) return;
        totalFieldsCheck();
    }

	// CUTTERTYPEPREFSBTN
	// ==================
	var CytterTypePrefsBtn = CutterTypeGroup.add("button", undefined, undefined, {name: "CytterTypePrefsBtn"}); 
		CytterTypePrefsBtn.enabled = true;
		CytterTypePrefsBtn.text = "⚙";
		CytterTypePrefsBtn.preferredSize.width = 50;
		CytterTypePrefsBtn.onClick = function() {
			var res = CytterTypePrefsDialog(CutterType.selection ? CutterType.selection.index : 0);
			if (res) {
                CutterType.removeEventListener('change', CutterTypeChange);
                CutterType.removeAll();
                for (var i = 0; i < CUTTER_TYPES.length; i++) {
                    CutterType.add('item', CUTTER_TYPES[i].text);
                }
                CutterType.selection = res.index;
                CutterType.addEventListener('change', CutterTypeChange);
                totalFieldsCheck();
			}
		}

	// SPACEBETWEENGROUP
	// =================
	var SpaceBetweenGroup = DocParamsGroup.add("group", undefined, {name: "SpaceBetweenGroup"}); 
		SpaceBetweenGroup.orientation = "row"; 
		SpaceBetweenGroup.alignChildren = ["left","center"]; 
		SpaceBetweenGroup.spacing = 10; 
		SpaceBetweenGroup.margins = 0; 

	var SpaceBetweenLabel = SpaceBetweenGroup.add("statictext", undefined, undefined, {name: "SpaceBetweenLabel"}); 
		SpaceBetweenLabel.text = translate('Space Between Label'); 

	var SpaceBetween = SpaceBetweenGroup.add('edittext {properties: {name: "SpaceBetween"}}'); 
		if (FigureSelector.selection.text == translate('Rectangles')) {
			minSpaceBetween = IsRoundedCorners ? CUTTER_TYPES[CutterType.selection.index].minSpaceBetween : 0;
		} else {
			minSpaceBetween = CutterType.selection ? CUTTER_TYPES[CutterType.selection.index].minSpaceBetween : 0;
		};
		SpaceBetween.text = myCustomDoc.SpaceBetween >= 0 ? myCustomDoc.SpaceBetween : minSpaceBetween;
		SpaceBetween.helpTip = translate('Space Between Tip', {
			min: minSpaceBetween,
			max: CutterType.selection ? CUTTER_TYPES[CutterType.selection.index].maxSpaceBetween : 0
		});
		SpaceBetween.preferredSize.width = 100; 
		SpaceBetween.onChange = totalFieldsCheck;

	var SpaceBetweenUnits = SpaceBetweenGroup.add("statictext", undefined, undefined, {name: "SpaceBetweenUnits"}); 
		SpaceBetweenUnits.text = translate('Units mm'); 
		
	var IsZeroBleedsChk = DocParamsGroup.add("checkbox", undefined, undefined, {name: "IsZeroBleedsChk"}); 
		IsZeroBleedsChk.text = translate('Is Zero Bleeds Chk'); 
		IsZeroBleedsChk.value = IsZeroBleeds;		
		IsZeroBleedsChk.onClick = function() {
			IsZeroBleeds = IsZeroBleedsChk.value;
			checkValidSpaceBetween();
		};		

	var BleedWarningLabel = DocParamsGroup.add("statictext", undefined, undefined, {name: "BleedWarningLabel"}); 
		BleedWarningLabel.enabled = false; 
		Bleeds = IsZeroBleeds ? 0 : CutterType.selection ? CUTTER_TYPES[CutterType.selection.index].minSpaceBetween / 2 : 0;
		BleedWarningLabel.text = translate('Bleed Warning Text', {bleeds: Bleeds});

	// DOCPARAMSGROUP2
	// ===============
	var DocParamsGroup2 = DocParamsGroup.add("group", undefined, {name: "DocParamsGroup2"}); 
		DocParamsGroup2.orientation = "column"; 
		DocParamsGroup2.alignChildren = ["left","center"]; 
		DocParamsGroup2.spacing = 10; 
		DocParamsGroup2.margins = [0,10,0,0]; 
		DocParamsGroup2.alignment = ["left","fill"]; 
		

	var SaveFileWithCut = DocParamsGroup2.add("checkbox", undefined, undefined, {name: "SaveFileWithCut"}); 
		SaveFileWithCut.text = translate('Save File With Cut');
		SaveFileWithCut.value = IsSaveFileWithCut;		
		SaveFileWithCut.onClick = function() {
			IsSaveFileWithCut = SaveFileWithCut.value;
		}; 		

	// VARIANTSPANEL
	// =============
	var VariantsPanel = NewCustomDocSettings.add("panel", undefined, undefined, {name: "VariantsPanel"}); 
		VariantsPanel.text = translate('Variants Panel Title');
		VariantsPanel.orientation = "column"; 
		VariantsPanel.alignChildren = ["left","top"]; 
		VariantsPanel.spacing = 10; 
		VariantsPanel.margins = 10; 
		VariantsPanel.alignment = ["fill","top"]; 

	var Variants = VariantsPanel.add("listbox", undefined, undefined, {name: "Variants"}); 
		Variants.preferredSize.height = 115; 
		Variants.alignment = ["fill","top"];
		Variants.onChange = function() {
			if (Variants.selection) {
				isOk.Variant = true;
				for (var i = 0; i < Variants.items.length; i++) {
					if (Variants.items[i].selected) {
						Params = VariantsRozkladka[i];
						break;
					}
				}
			} else {
				isOk.Variant = false;
			}
			SaveDocBtn.enabled = isOk.Size && isOk.SpaceBetween && isOk.Variant;
		}
		Variants.onDoubleClick = function() {
			if (Variants.selection) {
				isOk.Variant = true;
				for (var i = 0; i < Variants.items.length; i++) {
					if (Variants.items[i].selected) {
						Params = VariantsRozkladka[i];
						break;
					}
				}
				APP_PREFERENCES.app.lastPlotter = CutterType.selection.index;
				savePreferencesJSON(PREFS_FILE);
				myCustomDoc = {
					CutterType: CUTTER_TYPES[APP_PREFERENCES.app.lastPlotter],
					Figure: FigureSelector.selection.text,
					Diameter: +Diameter.text,
					RectWidth: +RectWidth.text,
					RectHeight: +RectHeight.text,
					SpaceBetween: +SpaceBetween.text,
					RoundCornersValue: IsRoundedCorners ? +RoundCornersValue.text : 0,
					Params: Params,
					IsZeroBleeds: IsZeroBleeds,
					IsGetSizeFromFilename: IsGetSizeFromFilename,
					IsSaveFileWithCut: IsSaveFileWithCut,
					IsRoundedCorners: IsRoundedCorners
				};
				if (FigureSelector.selection.text == translate('Circles')) {
					myCustomDoc.title = "\u25CB D=" + myCustomDoc.Diameter + " (" + myCustomDoc.SpaceBetween + ") " + translate('Units mm') + " | " + myCustomDoc.CutterType.text + " | " + myCustomDoc.Params.total + translate('Units pieces');	
				};
				if (FigureSelector.selection.text == translate('Rectangles')) {
					myCustomDoc.title = "\u25A1 " + myCustomDoc.RectWidth + "x" + myCustomDoc.RectHeight + (IsRoundedCorners ? " R=" + myCustomDoc.RoundCornersValue : "") + " (" + myCustomDoc.SpaceBetween + ") " + translate('Units mm') + " | " + myCustomDoc.CutterType.text + " | " + myCustomDoc.Params.total + translate('Units pieces');
				};	
				NewCustomDocSettings.close(1);
				NewCustomDocSettings = null;			
			} else {
				isOk.Variant = false;
			}
		}

	// DOCBTNSGROUP
	// ============
	var DocBtnsGroup = NewCustomDocSettings.add("group", undefined, {name: "DocBtnsGroup"}); 
		DocBtnsGroup.orientation = "row"; 
		DocBtnsGroup.alignChildren = ["right","center"]; 
		DocBtnsGroup.spacing = 10; 
		DocBtnsGroup.margins = 0; 
		DocBtnsGroup.alignment = ["fill","top"]; 

	var CancelDocBtn = DocBtnsGroup.add("button", undefined, undefined, {name: "CancelDocBtn"}); 
		CancelDocBtn.text = translate('Cancel Btn'); 
		CancelDocBtn.alignment = ["right","bottom"]; 
		CancelDocBtn.onClick = function() {
			NewCustomDocSettings.close(0);
			NewCustomDocSettings = null;
		}

	var SaveDocBtn = DocBtnsGroup.add("button", undefined, undefined, {name: "SaveDocBtn"}); 
		SaveDocBtn.text = translate('Save Btn'); 
		SaveDocBtn.enabled = false;  
		SaveDocBtn.onClick = function() {
			APP_PREFERENCES.app.lastPlotter = CutterType.selection.index;
			savePreferencesJSON(PREFS_FILE);
			myCustomDoc = {
				CutterType: CUTTER_TYPES[APP_PREFERENCES.app.lastPlotter],
				Figure: FigureSelector.selection.text,
				Diameter: +Diameter.text,
				RectWidth: +RectWidth.text,
				RectHeight: +RectHeight.text,				
				SpaceBetween: +SpaceBetween.text,
				RoundCornersValue: IsRoundedCorners ? +RoundCornersValue.text : 0,
				IsZeroBleeds: IsZeroBleeds,
				IsGetSizeFromFilename: IsGetSizeFromFilename,
				IsSaveFileWithCut: IsSaveFileWithCut,
				IsRoundedCorners: IsRoundedCorners
			};			
			if (!IsGetSizeFromFilename) {
				myCustomDoc.Params = Params;				
				if (FigureSelector.selection.text == translate('Circles')) {
					myCustomDoc.title = "\u25CB D=" + myCustomDoc.Diameter + " (" + myCustomDoc.SpaceBetween + ") " + translate('Units mm') + " | " + myCustomDoc.CutterType.text + " | " + myCustomDoc.Params.total + translate('Units pieces');	
				};
				if (FigureSelector.selection.text == translate('Rectangles')) {
					myCustomDoc.title = "\u25A1 " + myCustomDoc.RectWidth + "x" + myCustomDoc.RectHeight + (IsRoundedCorners ? " R=" + myCustomDoc.RoundCornersValue : "") + " (" + myCustomDoc.SpaceBetween + ") " + translate('Units mm') + " | " + myCustomDoc.CutterType.text + " | " + myCustomDoc.Params.total + translate('Units pieces');
				};
			} else {
				if (FigureSelector.selection.text == translate('Circles')) {
					myCustomDoc.title = "\u25CB " + translate('As In Files Names') + " | " + myCustomDoc.CutterType.text;
				};
				if (FigureSelector.selection.text == translate('Rectangles')) {
					myCustomDoc.title = "\u25A1 " + translate('As In Files Names') + " | " + myCustomDoc.CutterType.text;
				};
				if (FigureSelector.selection.text == translate('Mixed')) {
					myCustomDoc.title = "\u25CB ? \u25A1 " + translate('As In Files Names') + " | " + myCustomDoc.CutterType.text;
				};				
				myCustomDoc.Params = false;
			}
			NewCustomDocSettings.close(1);
			NewCustomDocSettings = null;			
		};

	function CircleCheckBoxClick() {
		IsGetSizeFromFilename = GetCircleSizeFromFilename.value;
		if (IsGetSizeFromFilename) {
			CircleSizeGroup.enabled = false;
		} else {
			CircleSizeGroup.enabled = true;
		}
		VariantsPanelSwitch();
		totalFieldsCheck();
	}

	function RectangleCheckBoxClick() {
		IsGetSizeFromFilename = GetRectangleSizeFromFilename.value;
		RoundCornersGroup.enabled = !IsGetSizeFromFilename;
		RectangleSizeGroup.enabled = !IsGetSizeFromFilename;
		IsRoundedCorners = !IsGetSizeFromFilename;
		VariantsPanelSwitch();
		totalFieldsCheck();
	}
	
	function RoundCornersCheckBoxClick() {
		IsRoundedCorners = RoundCorners.value;
		RoundCornersValueGroup.enabled = IsRoundedCorners;
		totalFieldsCheck();
	}
	
	function VariantsPanelSwitch() {		
		if (IsGetSizeFromFilename) {
			Variants.removeAll();			
			VariantsPanel.enabled = false;
			isOk.Variant = true;
		} else {
			VariantsPanel.enabled = true;
			isOk.Variant = false;
		}
	}
		
	function checkValidDiameter() {
		IsGetSizeFromFilename = GetCircleSizeFromFilename.value;
		isOk.Size = IsGetSizeFromFilename || (isValidNumber(Diameter.text) && Diameter.text != "0" && Diameter.text != "");
	}
	
	function checkValidSize() {
		RectWidth.text = RectWidth.text.replace(',','.');
		RectHeight.text = RectHeight.text.replace(',','.');
		IsGetSizeFromFilename = GetRectangleSizeFromFilename.value;
		isOk.Size = IsGetSizeFromFilename || (isValidNumber(RectWidth.text) && RectWidth.text != "0" && RectWidth.text != "" && isValidNumber(RectHeight.text) && RectHeight.text != "0" && RectHeight.text != "");
		if (isOk.Size) {
			RoundCornersGroup.enabled = !IsGetSizeFromFilename;
		} else {
			RoundCornersGroup.enabled = false;
		}
	}
	
	function checkMixed() {
		IsGetSizeFromFilename = GetMixedSizeFromFilename.value;
		IsRoundedCorners = false;
		checkValidSpaceBetween();
		isOk.Size = true;
	}	
	
	function checkValidRoundCornersValue() {
		if (!NewCustomDocSettings) return;	
		if (RoundCornersGroup.enabled) {
			RoundCornersValue.text = RoundCornersValue.text.replace(',','.');
			var maxRadius = +RectWidth.text > +RectHeight.text ? +RectHeight.text / 2 : +RectWidth.text / 2;			
			RoundCornersValue.helpTip = translate('Round Corners Value Tip', {max: maxRadius});
			if (RoundCornersValue.text < 0) RoundCornersValue.text = 0;
			if (RoundCornersValue.text > maxRadius) RoundCornersValue.text = maxRadius;
		}
	}
	
	function checkValidSpaceBetween() {	
		if (!NewCustomDocSettings || !CutterType) return;
        if (!CutterType.selection) {
            isOk.SpaceBetween = false;
            return;
        }
		if (FigureSelector.selection.text == translate('Rectangles') || FigureSelector.selection.text == translate('Mixed')) {
			specialText = IsRoundedCorners ? "" : translate('Including 0');
			minSpaceBetween = IsRoundedCorners ? CUTTER_TYPES[CutterType.selection.index].minSpaceBetween : 0;
		} else {
			specialText = "";
            minSpaceBetween = CUTTER_TYPES[CutterType.selection.index].minSpaceBetween;
		};		
		SpaceBetween.text = SpaceBetween.text.replace(',','.');
		if (isValidNumber(SpaceBetween.text) && SpaceBetween.text != "") {
			if (+SpaceBetween.text != minSpaceBetween) {
				if (+SpaceBetween.text < CUTTER_TYPES[CutterType.selection.index].minSpaceBetween) SpaceBetween.text = CUTTER_TYPES[CutterType.selection.index].minSpaceBetween;
				if (+SpaceBetween.text > CUTTER_TYPES[CutterType.selection.index].maxSpaceBetween) SpaceBetween.text = CUTTER_TYPES[CutterType.selection.index].maxSpaceBetween;
			};
		} else {
			SpaceBetween.text = minSpaceBetween;
		};
		isOk.SpaceBetween = true;
		SpaceBetween.helpTip = translate('Space Between Tip', {
				min: CUTTER_TYPES[CutterType.selection.index].minSpaceBetween,
				max: CUTTER_TYPES[CutterType.selection.index].maxSpaceBetween
			}) + specialText; 		
		var Bleeds = IsZeroBleeds ? 0 : CUTTER_TYPES[CutterType.selection.index].minSpaceBetween / 2;
		if (isOk.SpaceBetween) BleedWarningLabel.text = translate('Bleed Warning Text', {bleeds: Bleeds});
	}		
	
	function isValidNumber(cText) {
	  var rg2 = /^(\d+)([\.,]\d+)?$/gm;
	  return rg2.test(cText);
	}

	function totalFieldsCheck(preselected) {
		if (!NewCustomDocSettings) return;
		if (!FigureSelector.selection) return;
		checkValidSpaceBetween();
		if (FigureSelector.selection.text == translate('Circles')) checkValidDiameter();
		if (FigureSelector.selection.text == translate('Rectangles')) checkValidSize();
		if (FigureSelector.selection.text == translate('Mixed')) checkMixed();
		checkValidRoundCornersValue();
		calculateVariants(preselected);
	}
	
	function calculateVariants(preselected) {
		if (FigureSelector.selection.text == translate('Circles')) {
			calculateCircleVariants(preselected);
		};
		if (FigureSelector.selection.text == translate('Rectangles')) {
			calculateRectangleVariants(preselected);
		};
		if (FigureSelector.selection.text == translate('Mixed')) {
			calculateMixedVariants(preselected);
		};
	}
	
	function calculateCircleVariants(preselected) {		
		VariantsPanelSwitch();
		if (!IsGetSizeFromFilename) {
			isOk.Variant = false;
			Variants.removeAll();
			if (preselected || (isOk.Size && isOk.SpaceBetween)) {
				VariantsRozkladka = RozkladkaCircles(Diameter.text, CUTTER_TYPES[CutterType.selection.index], SpaceBetween.text);
				for (var i = 0; i < VariantsRozkladka.length; i++) {
					Variants.add("item", VariantsRozkladka[i].listItem);
				}
			}
			if (preselected) {
				Variants.selection = myCustomDoc.Params.listItem;
				for (var i = 0; i < Variants.items.length; i++) {
					if (Variants.items[i].text == myCustomDoc.Params.listItem) {
						Variants.items[i].selected = true;
						break;
					}
				}			
			}			
		} else {
			Variants.removeAll();			
			Variants.add('item', translate('Optimal Variant'));		
		}
		SaveDocBtn.enabled = isOk.Size && isOk.SpaceBetween && isOk.Variant;
	}	
	
	function calculateRectangleVariants(preselected) {	
		VariantsPanelSwitch();
		if (!IsGetSizeFromFilename) {
			isOk.Variant = false;
			Variants.removeAll();			
			if (preselected || (isOk.Size && isOk.SpaceBetween)) {
				VariantsRozkladka = RozkladkaRectangles(RectWidth.text, RectHeight.text, CUTTER_TYPES[CutterType.selection.index], SpaceBetween.text, SpaceBetween.text > 0);
				for (var i = 0; i < VariantsRozkladka.length; i++) {
					Variants.add("item", VariantsRozkladka[i].listItem);
				}
			}
			if (preselected) {
				Variants.selection = myCustomDoc.Params.listItem;
				for (var i = 0; i < Variants.items.length; i++) {
					if (Variants.items[i].text == myCustomDoc.Params.listItem) {
						Variants.items[i].selected = true;
						break;
					}
				}			
			}			
		} else {
			Variants.removeAll();			
			Variants.add('item', translate('Optimal Variant'));		
		}
		SaveDocBtn.enabled = isOk.Size && isOk.SpaceBetween && isOk.Variant;
	}
	
	function calculateMixedVariants(preselected) {	
		VariantsPanelSwitch();
		Variants.removeAll();			
		Variants.add('item', translate('Optimal Variant'));
		if (CutterType.selection) SaveDocBtn.enabled = true;
	}

	totalFieldsCheck(myCustomDoc.Params);		

	var myResult = NewCustomDocSettings.show();

	NewCustomDocSettings = null;

	return myResult;
	
}
