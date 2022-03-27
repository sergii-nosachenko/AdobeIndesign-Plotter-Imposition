// Головне діалогове вікно

function DialogWindow() {
	
	app.scriptPreferences.userInteractionLevel = UserInteractionLevels.interactWithAll;
	app.pdfPlacePreferences.pageNumber = 1;
	app.pdfPlacePreferences.pdfCrop = PDFCrop.CROP_PDF;
	
	var isOk = {
		files: false,
		Imposing: true,
		folder: false,
		filename: true,
		document: false,
		preset: false
	}

	var myPDFExportPresets = [];
    //Get the names of the documents
    for (var myCounter = 0; myCounter < app.pdfExportPresets.length; myCounter++){
        myPDFExportPresets.push(app.pdfExportPresets.item(myCounter).name);
    }

	// MULTIPLEPDFIMPOSING
	// ===================
	var MultiplePDFImposing = new Window("dialog"); 
		MultiplePDFImposing.text = translate('Plugin Title', {version: APP_VERSION}) + ' | © github.com/sergii-nosachenko';
		MultiplePDFImposing.orientation = "column"; 
		MultiplePDFImposing.alignChildren = ["left","top"]; 
		MultiplePDFImposing.spacing = 10; 
		MultiplePDFImposing.margins = 15; 

	// INPUTFILESPANEL
	// ===============
	var InputFilesPanel = MultiplePDFImposing.add("panel", undefined, undefined, {name: "InputFilesPanel"}); 
		InputFilesPanel.text = translate('Input Files Label'); 
		InputFilesPanel.orientation = "column"; 
		InputFilesPanel.alignChildren = ["left","top"]; 
		InputFilesPanel.spacing = 10; 
		InputFilesPanel.margins = 10; 

	// FILESGROUP
	// ==========
	var FilesGroup = InputFilesPanel.add("group", undefined, {name: "FilesGroup"}); 
		FilesGroup.orientation = "column"; 
		FilesGroup.alignChildren = ["left","center"]; 
		FilesGroup.spacing = 10; 
		FilesGroup.margins = 0; 
		FilesGroup.alignment = ["fill","top"]; 

	// CHOOSEFILESGROUP
	// ================
	var ChooseFilesGroup = FilesGroup.add("group", undefined, {name: "ChooseFilesGroup"}); 
		ChooseFilesGroup.orientation = "row"; 
		ChooseFilesGroup.alignChildren = ["left","top"]; 
		ChooseFilesGroup.spacing = 10; 
		ChooseFilesGroup.margins = 0; 
		ChooseFilesGroup.alignment = ["fill","center"]; 

	var ChooseFilesLabel = ChooseFilesGroup.add("statictext", undefined, undefined, {name: "ChooseFilesLabel"}); 
		ChooseFilesLabel.text = translate('Choose Files Label');
		ChooseFilesLabel.alignment = ["left","center"]; 

	var AddFilesBtn = ChooseFilesGroup.add("button", undefined, undefined, {name: "AddFilesBtn"}); 
		AddFilesBtn.text = translate('Select Files Btn');
		AddFilesBtn.onClick = getFiles;

	// FILESNAMESGROUP
	// ===============
	var FilesNameListGroup = FilesGroup.add("group", undefined, {name: "FilesNameListGroup"}); 
		FilesNameListGroup.orientation = "column"; 
		FilesNameListGroup.alignChildren = ["left","center"]; 
		FilesNameListGroup.spacing = 10; 
		FilesNameListGroup.margins = [0,0,0,0];

	var FilesNameList = FilesNameListGroup.add('edittext {properties: {name: "FilesNameList", readonly: true, multiline: true, scrollable: true}}'); 
		FilesNameList.text = translate('Files Name List');
		FilesNameList.preferredSize.width = 550; 
		FilesNameList.preferredSize.height = 100; 

	// IMPOSINGPANEL
	// =============
	var ImposingPanel = MultiplePDFImposing.add("panel", undefined, undefined, {name: "ImposingPanel"}); 
		ImposingPanel.text = translate('Imposing Panel Title');
		ImposingPanel.orientation = "column"; 
		ImposingPanel.alignChildren = ["left","top"]; 
		ImposingPanel.spacing = 10; 
		ImposingPanel.margins = 10; 

	// IMPOSINGGROUP
	// =============
	var ImposingGroup = ImposingPanel.add("group", undefined, {name: "ImposingGroup"}); 
		ImposingGroup.orientation = "column"; 
		ImposingGroup.alignChildren = ["left","center"]; 
		ImposingGroup.spacing = 10; 
		ImposingGroup.margins = 0; 
		ImposingGroup.alignment = ["fill","top"]; 

	// IMPOSINGMETHODGROUP
	// ===================
	var ImposingMethodGroup = ImposingGroup.add("group", undefined, {name: "ImposingMethodGroup"}); 
		ImposingMethodGroup.orientation = "row"; 
		ImposingMethodGroup.alignChildren = ["left","center"]; 
		ImposingMethodGroup.spacing = 10; 
		ImposingMethodGroup.margins = 0; 
		ImposingMethodGroup.alignment = ["fill","center"]; 

	var ImposingMethodLabel = ImposingMethodGroup.add("statictext", undefined, undefined, {name: "ImposingMethodLabel"}); 
		ImposingMethodLabel.text = translate('Imposing Method Label');
		ImposingMethodLabel.alignment = ["left","center"]; 

	var ImposingMethod_array = [
			translate('Imposing Method 1'),
			translate('Imposing Method 2'),
			translate('Imposing Method 3')
		]; 
	var ImposingMethod = ImposingMethodGroup.add("dropdownlist", undefined, undefined, {name: "ImposingMethod", items: ImposingMethod_array}); 
		ImposingMethod.selection = 0;
		ImposingMethod.onChange = function() {
			MY_DOC_SETTINGS.ImposingMethod = ImposingMethod.selection.index;
			ImposingCustom.text = translate('Imposing Method 3 Text');
			MY_DOC_SETTINGS.customItemsCount = "";					
			MY_DOC_SETTINGS.customFileName = "";			
			switch (MY_DOC_SETTINGS.ImposingMethod) {
				case 0:
					isOk.Imposing = true;
					MultipageFileSave.enabled = true;
					PostfixLabel.text = translate('File Name Text Only Prefix Info');
					FileName.text = translate('File Name Text Only Prefix');
					isOk.filename = true; 				
					ImposingCustomGroup.hide();				
					break;
				case 1:
					isOk.Imposing = true;
					MultipageFileSave.enabled = false;
					PostfixLabel.text = translate('File Name Text Full Info');
					FileName.text = translate('File Name Text Full');
					isOk.filename = false;					
					ImposingCustomGroup.hide();				
					break;
				case 2:
					isOk.Imposing = false;
					MultipageFileSave.enabled = false;
					PostfixLabel.text = translate('File Name Text Full Info');
					FileName.text = translate('File Name Text Full');
					isOk.filename = false;			
					ImposingCustomGroup.show();	
					ImposingCustomLabel.text = "- / " + (MY_DOC_SETTINGS.totalPages ? MY_DOC_SETTINGS.totalPages : '-') + ' (!)';
					break;
			}
			totalFieldsCheckMain();
		}
		
	var MultipageFileSave = ImposingMethodGroup.add("checkbox", undefined, undefined, {name: "MultipageFileSave"}); 
		MultipageFileSave.text = translate('Multipage File Save');
		MultipageFileSave.value = MY_DOC_SETTINGS.SaveMultipageFilesAsOneFile; 
		MultipageFileSave.onClick = function() {
			MY_DOC_SETTINGS.SaveMultipageFilesAsOneFile = MultipageFileSave.value;
		};		

	// IMPOSINGCUSTOMGROUP
	// ===================
	var ImposingCustomGroup = ImposingPanel.add("group", undefined, {name: "ImposingCustomGroup"}); 
		ImposingCustomGroup.orientation = "column"; 
		ImposingCustomGroup.alignChildren = ["left","center"]; 
		ImposingCustomGroup.spacing = 10; 
		ImposingCustomGroup.margins = 0; 
		ImposingCustomGroup.alignment = ["fill","top"]; 

	// IMPOSINGGROUP
	// =============
	var ImposingCustom = ImposingCustomGroup.add('edittext {properties: {name: "ImposingCustom", multiline: true, scrollable: true}}'); 
		ImposingCustom.helpTip = translate('Imposing Method 3 Help Tip'); 
		ImposingCustom.text = translate('Imposing Method 3 Text'); 
		ImposingCustom.preferredSize.width = 550;
		ImposingCustom.preferredSize.height = 30;
		ImposingCustom.onActivate = function() {
			if (ImposingCustom.text == translate('Imposing Method 3 Text')) {
				ImposingCustom.text = "";
				MY_DOC_SETTINGS.customItemsCount = "";
			}
		};		
		ImposingCustom.onDeactivate = function() {
			if (ImposingCustom.text == "") {
				ImposingCustom.text = translate('Imposing Method 3 Text'); 
				MY_DOC_SETTINGS.customItemsCount = "";
			}
		};		
		ImposingCustom.onChanging = checkValidImposingCustom;

	var ImposingCustomLabel = ImposingCustomGroup.add("statictext", undefined, undefined, {name: "ImposingCustomLabel"}); 
		ImposingCustomLabel.enabled = false; 
		ImposingCustomLabel.preferredSize.width = 550; 		

	ImposingCustomGroup.hide();		

	// EXPORTSETTINGSTAB
	// =================
	var ExportSettingsTab = MultiplePDFImposing.add("panel", undefined, undefined, {name: "ExportSettingsTab"}); 
		ExportSettingsTab.text = translate('Export Settings Panel Title');
		ExportSettingsTab.orientation = "column"; 
		ExportSettingsTab.alignChildren = ["left","top"]; 
		ExportSettingsTab.spacing = 10; 
		ExportSettingsTab.margins = 10; 

	// FOLDERGROUP
	// ===========
	var FolderGroup = ExportSettingsTab.add("group", undefined, {name: "FolderGroup"}); 
		FolderGroup.preferredSize.width = 450; 
		FolderGroup.orientation = "column"; 
		FolderGroup.alignChildren = ["left","center"]; 
		FolderGroup.spacing = 10; 
		FolderGroup.margins = [0,0,0,0]; 

	// CHOOSEFOLDERGROUP
	// =================
	var ChooseFolderGroup = FolderGroup.add("group", undefined, {name: "ChooseFolderGroup"}); 
		ChooseFolderGroup.orientation = "row"; 
		ChooseFolderGroup.alignChildren = ["left","top"]; 
		ChooseFolderGroup.spacing = 10; 
		ChooseFolderGroup.margins = 0; 
		ChooseFolderGroup.alignment = ["fill","center"]; 

	var ChooseFolderLabel = ChooseFolderGroup.add("statictext", undefined, undefined, {name: "ChooseFolderLabel"}); 
		ChooseFolderLabel.text = translate('Choose Folder Label');
		ChooseFolderLabel.alignment = ["left","center"]; 

	var AddFolderBtn = ChooseFolderGroup.add("button", undefined, undefined, {name: "AddFolderBtn"}); 
		AddFolderBtn.enabled = false;
		AddFolderBtn.text = translate('Add Folder Btn');
		AddFolderBtn.onClick = getFolder;

	// FOLDERGROUP
	// ===========
	var FolderName = FolderGroup.add('edittext {properties: {name: "FolderName", readonly: true}}'); 
		FolderName.text = translate('Folder Name Label');
		FolderName.preferredSize.width = 550;	

	var FileNameLabel = FolderGroup.add("statictext", undefined, undefined, {name: "FileNameLabel"}); 
		FileNameLabel.text = translate('File Name Label');

	// PREFIXGROUP
	// ===========
	var FileNameGroup = FolderGroup.add("group", undefined, {name: "FileNameGroup"}); 
		FileNameGroup.orientation = "column"; 
		FileNameGroup.alignChildren = ["left","center"]; 
		FileNameGroup.spacing = 10; 
		FileNameGroup.margins = 0; 

	var FileName = FileNameGroup.add('edittext {properties: {name: "FileName"}}'); 
		FileName.text = translate('File Name Text Only Prefix');
		FileName.preferredSize.width = 550;
		FileName.onChange = checkValidFileName;
		FileName.onActivate = function() {
			if (FileName.text == translate('File Name Text Only Prefix') || FileName.text == translate('File Name Text Full')) {
				MY_DOC_SETTINGS.customFileName = "";
				FileName.text = "";
			}
		};		
		FileName.onDeactivate = function() {
			if (FileName.text == "") {
				if (ImposingMethod.selection.index == 0) {
					FileName.text = translate('File Name Text Only Prefix'); 					
				} else {
					FileName.text = translate('File Name Text Full');						
				};
				MY_DOC_SETTINGS.customFileName = "";
			};
		};		

	var PostfixLabel = FileNameGroup.add("statictext", undefined, undefined, {name: "PostfixLabel"}); 
		PostfixLabel.enabled = false; 
		PostfixLabel.text = translate('File Name Text Only Prefix Info');
		PostfixLabel.preferredSize.width = 500;

	// DOCUMENTGROUP
	// =============
	var DocumentGroup = MultiplePDFImposing.add("group", undefined, {name: "DocumentGroup"}); 
		DocumentGroup.orientation = "row"; 
		DocumentGroup.alignChildren = ["left","center"]; 
		DocumentGroup.spacing = 10; 
		DocumentGroup.margins = 0; 

	// DOCGROUP1
	// =========
	var DocGroup1 = DocumentGroup.add("group", undefined, {name: "DocGroup1"}); 
		DocGroup1.orientation = "column"; 
		DocGroup1.alignChildren = ["left","center"]; 
		DocGroup1.spacing = 10; 
		DocGroup1.margins = [0,0,0,0]; 

	// DOCGROUP2
	// =========
	var DocGroup2 = DocGroup1.add("group", undefined, {name: "DocGroup2"}); 
		DocGroup2.orientation = "row"; 
		DocGroup2.alignChildren = ["left","center"]; 
		DocGroup2.spacing = 10; 
		DocGroup2.margins = 0; 

	var ImpositionLabel = DocGroup2.add("statictext", undefined, undefined, {name: "ImpositionLabel"}); 
		ImpositionLabel.text = translate('Imposition Label');

	var ImpositionMethod = DocGroup2.add('edittext {properties: {name: "ImpositionMethod", readonly: true}}'); 
		ImpositionMethod.preferredSize.width = 350;
		ImpositionMethod.text = translate('Imposition Not Defined');
		ImpositionMethod.alignment = ["left","center"];
		isOk.document = false;

	var CreateImposBtn = DocGroup2.add("button", undefined, undefined, {name: "CreateImposBtn"}); 
		CreateImposBtn.enabled = true;
		CreateImposBtn.text = "⚙";
		CreateImposBtn.preferredSize.width = 50;
		CreateImposBtn.onClick = function() {
			const res = NewImposSettingsWindow();
			if (res && (MY_DOC_SETTINGS.IsGetSizeFromFilename || MY_DOC_SETTINGS.title != "")) {
				ImpositionMethod.text = MY_DOC_SETTINGS.title;
				isOk.document = true;		
			};
			totalFieldsCheckMain();
		}

	// PRESETGROUP
	// ===========
	var PresetGroup = MultiplePDFImposing.add("group", undefined, {name: "PresetGroup"}); 
		PresetGroup.orientation = "row"; 
		PresetGroup.alignChildren = ["left","center"]; 
		PresetGroup.spacing = 10; 
		PresetGroup.margins = 0; 

	// PRESETGROUP1
	// ============
	var PresetGroup1 = PresetGroup.add("group", undefined, {name: "PresetGroup1"}); 
		PresetGroup1.orientation = "column"; 
		PresetGroup1.alignChildren = ["left","center"]; 
		PresetGroup1.spacing = 10; 
		PresetGroup1.margins = [0,0,0,0]; 

	// PRESETGROUP2
	// ============
	var PresetGroup2 = PresetGroup1.add("group", undefined, {name: "PresetGroup2"}); 
		PresetGroup2.orientation = "row"; 
		PresetGroup2.alignChildren = ["left","center"]; 
		PresetGroup2.spacing = 10; 
		PresetGroup2.margins = 0; 

	var PresetLabel = PresetGroup2.add("statictext", undefined, undefined, {name: "PresetLabel"}); 
		PresetLabel.text = translate('PDF Preset Label');

	var PresetsList = PresetGroup2.add("dropdownlist", undefined, undefined, {name: "PresetsList", items: myPDFExportPresets}); 
		PresetsList.selection = 0; 
		PresetsList.alignment = ["left","center"];
		if (myPDFExportPresets.length > 0) {
			isOk.preset = true;
			MY_DOC_SETTINGS.PDFExportPreset = app.pdfExportPresets.item(0);
		};
		PresetsList.onChange = presetSelection;		

	// BUTTONSGROUP
	// ============
	var ButtonsGroup = MultiplePDFImposing.add("group", undefined, {name: "ButtonsGroup"}); 
		ButtonsGroup.orientation = "row"; 
		ButtonsGroup.alignChildren = ["fill","center"]; 
		ButtonsGroup.spacing = 10; 
		ButtonsGroup.margins = 0; 
		ButtonsGroup.alignment = ["fill","top"];
		
    var Languages_array = [];
    var Languages_keys = [];

	for (var prop in LANG) {
		if (LANG.hasOwnProperty(prop)) {
			Languages_array.push(LANG[prop].title + " (" + LANG[prop].name + ")");
			Languages_keys.push(LANG[prop].name);
		}
	}

    var AppLanguage = ButtonsGroup.add("dropdownlist", undefined, undefined, {name: "AppLanguage", items: Languages_array}); 
        AppLanguage.selection = Languages_keys.indexOf(APP_PREFERENCES.app.lang); 
		AppLanguage.alignment = ["left","fill"];
		AppLanguage.onChange = function() {
			APP_PREFERENCES.app.lang = Languages_keys[AppLanguage.selection.index];
			savePreferencesJSON(PREFS_FILE, APP_PREFERENCES);
			alert(translate('Language change restart'), translate('Language change title'));
		}

	var Cancel = ButtonsGroup.add("button", undefined, undefined, {name: "Cancel"}); 
		Cancel.text = translate('Cancel Btn');
		Cancel.alignment = ["right","fill"];
		Cancel.onClick = function() {
			MultiplePDFImposing.close(0);
			MultiplePDFImposing = null;
		}

	var Start = ButtonsGroup.add("button", undefined, undefined, {name: "Start"}); 
		Start.enabled = false; 
		Start.text = translate('Impose Btn');
		Start.alignment = ["right","fill"];
		Start.justify = "left"; 
		Start.onClick = function () {
			MultiplePDFImposing.close(1);
		}
	

	function getFiles() {
		
		MY_DOC_SETTINGS.okFiles = [];
		FilesNameList.text = "";
		MY_DOC_SETTINGS.totalPages = 0;
		AddFolderBtn.enabled = false;
		isOk.files = false;	
		
		const title = translate('Files Dialog Title');
		var theFiles = File.openDialog(title, "*.pdf;*.ai;*.tif;*.eps", true);

		if (theFiles != null) {
			for (var i = 0; i < theFiles.length; i++) {
				var theFile = theFiles[i];
				var fileName = File.decode(theFile.name);				
				var pgCount = 1;
				if (fileName.indexOf(".tif") == -1 && fileName.indexOf(".eps") == -1) pgCount = getPDFInfo(theFile);
				if (pgCount > 0) {
					for (var page = 1; page <= pgCount; page++) {
						MY_DOC_SETTINGS.totalPages++;
						FilesNameList.text += MY_DOC_SETTINGS.totalPages + ") " + fileName + " (" + translate('Page #', {page: page}) + ")";
						if (page != pgCount) FilesNameList.text += "\n";	
					}
					MY_DOC_SETTINGS.okFiles.push({theFile: theFile, pgCount: pgCount});
					if (i != theFiles.length - 1) FilesNameList.text += "\n";
				}
			}
			AddFolderBtn.enabled = true;
			isOk.files = true;
		};
		
		checkValidImposingCustom();
		totalFieldsCheckMain();
	}	
	
	function checkValidImposingCustom() {
		if (ImposingCustom.text == translate('Imposing Method 3 Text')) {
			isOk.Imposing = true;
			MY_DOC_SETTINGS.customItemsCount = "";
		} else {
			isOk.Imposing = isValidImposingCustom(ImposingCustom.text);
			if (isOk.Imposing) {
				var countCustomPages = 0;
				for (var i = 0, items = ImposingCustom.text.split(','); i < items.length; i++) {
					if (items[i].indexOf('x') != -1) {
						countCustomPages += +items[i].split('x')[0];
					} else {
						countCustomPages++;
					}
				}
				if (countCustomPages != MY_DOC_SETTINGS.totalPages) {
					ImposingCustomLabel.text = countCustomPages + " / " + (MY_DOC_SETTINGS.totalPages ? MY_DOC_SETTINGS.totalPages : '-') + ' (!)';
				} else {
					ImposingCustomLabel.text = countCustomPages + " / " + MY_DOC_SETTINGS.totalPages;
					MY_DOC_SETTINGS.customItemsCount = ImposingCustom.text;
				}
			} else {
				ImposingCustomLabel.text = "- / " + (MY_DOC_SETTINGS.totalPages ? MY_DOC_SETTINGS.totalPages : '-')  + ' (!)';
			}
		}
		totalFieldsCheckMain();	
	}
	
	function isValidImposingCustom(cText) {
	  var rg2 = /^((\d+x)?(\d+\+?,))*((\d+x)?(\d+\+?))$/gm;
	  return rg2.test(cText);
	}	
	
	function getFolder() {
		
		var folder = new Folder(MY_DOC_SETTINGS.okFiles[0].theFile.path);
		
		var outputFolder = folder.selectDlg(translate('Folder Dialog Title'));
		
		MY_DOC_SETTINGS.outputFolder = "";
		FolderName.text = ""; 
		isOk.folder = false;		
		
		if (outputFolder != null && outputFolder.exists) {
			MY_DOC_SETTINGS.outputFolder = Folder.decode(outputFolder.fsName); 
			FolderName.text = MY_DOC_SETTINGS.outputFolder; 
			isOk.folder = true;
		}
		
		totalFieldsCheckMain();
	}
	
	function checkValidFileName() {
		if (ImposingMethod.selection.index == 0) {
			isOk.filename = isValidFileName(FileName.text);
			if (FileName.text == translate('File Name Text Only Prefix') || FileName.text == translate('File Name Text Full')) {
				MY_DOC_SETTINGS.customFileName = "";
			} else if (isOk.filename) {
				MY_DOC_SETTINGS.customFileName = FileName.text;
			} else if (!isOk.filename) alert(translate('File Name Bad Alert'));	
		} else {
			if (FileName.text == "" || FileName.text == translate('File Name Text Full')) {
				isOk.filename = false;
				MY_DOC_SETTINGS.customFileName = "";				
			} else {
				isOk.filename = isValidFileName(FileName.text);
				if (isOk.filename) MY_DOC_SETTINGS.customFileName = FileName.text;
				if (!isOk.filename) alert(translate('File Name Bad Alert'));
			}
		}
		totalFieldsCheckMain();
	}

	function isValidFileName(fname) {
	  var rg1 = /^[^\\\/:\*\?"<>\|]+$/gm;
	  return rg1.test(fname) || fname == "";
	}	
	
	function presetSelection() {
		for (i = 0; i < PresetsList.items.length; i++) {
			if (PresetsList.items[i].selected) MY_DOC_SETTINGS.PDFExportPreset = app.pdfExportPresets.item(i);
		}
		totalFieldsCheckMain();
	}	

	function totalFieldsCheckMain() {
		Start.enabled = isOk.files && isOk.folder && isOk.filename && isOk.document && isOk.preset && isOk.Imposing;
	}
	
	var myResult = MultiplePDFImposing.show();

	if (myResult == true){
		PlacePDF();
	}
	
	MultiplePDFImposing = null;

}