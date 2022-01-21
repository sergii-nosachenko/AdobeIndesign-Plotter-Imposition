const version = "2.4.0";

// Debug level
// Comment next line for production!
// $.level = 1;

//@include "helpers/JSON.jsx"
//@include "helpers/Array.indexOf.polyfill.jsx"
//@include "helpers/Array.fill.polyfill.jsx"
//@include "helpers/PDFmultipage.jsx"
//@include "rozkladka/RozkladkaCircles.jsx"
//@include "rozkladka/RozkladkaRectangles.jsx"
//@include "rozkladka/generateCutterMarks.jsx"

// Global constants
const PREFERENCES = parsePreferencesJSON(File($.fileName).path + "/preferences.json"); // preferences.json має бути в папці зі скриптом і містити всі налаштування
const PRINTLayer = PREFERENCES.layers.PRINTLayer || "PRINT";
const PLOTTERLayer = PREFERENCES.layers.PLOTTERLayer || "PLOTTER";
const CUTLayer = PREFERENCES.layers.CUTLayer || "CUT";
const TITLELayer = PREFERENCES.layers.TITLELayer || "TITLE";
const CutterTypes = PREFERENCES.cutters;
const PaperNames = new RegExp('(SRA[34]|SRA3 Max\+|A[34]|Ricoh ?X?L)', 'g'); // Список можливих назв форматів паперу regex

// Global variables
var myPDFExportPreset;
var theFiles;
var okFiles = new Array;
var myImposing = "";
var outputFolder;
var myFileName = "";
var myDocument;
var myLayer;
var myImposingMethod = 0;
var myCustomDoc = {
	title: "",
	CutterType: false,
	Figure: "Кола",
	Diameter: 0,
	RectWidth: 0,
	RectHeight: 0,
	SpaceBetween: -1,
	RoundCornersValue: 0,
	Params: false,
	IsZeroBleeds: false,
	IsGetSizeFromFilename: false,
	IsSaveFileWithCut: true,
	IsRoundedCorners: false
};
var AddFileNameTitle = true;
var SaveMultipageFilesAsOneFile = true;
var steps;
var totalPages;

// Запуск головного діалогового вікна
DialogWindow();

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
	
    var myDocumentNames = new Array;
	myDocumentNames.push('Нова розкладка');
    //Get the names of the documents
    for (var myCounter = 0; myCounter < app.documents.length; myCounter++){
        myDocumentNames.push(app.documents.item(myCounter).name);
    }

	var myPDFExportPresets = new Array;
    //Get the names of the documents
    for (var myCounter = 0; myCounter < app.pdfExportPresets.length; myCounter++){
        myPDFExportPresets.push(app.pdfExportPresets.item(myCounter).name);
    }

	// MULTIPLEPDFIMPOSING
	// ===================
	var MultiplePDFImposing = new Window("dialog"); 
		MultiplePDFImposing.text = "Розкладка макетів під плоттер | " + version + " | © Сергій Носаченко"; 
		MultiplePDFImposing.orientation = "column"; 
		MultiplePDFImposing.alignChildren = ["left","top"]; 
		MultiplePDFImposing.spacing = 10; 
		MultiplePDFImposing.margins = 15; 

	// INPUTFILESPANEL
	// ===============
	var InputFilesPanel = MultiplePDFImposing.add("panel", undefined, undefined, {name: "InputFilesPanel"}); 
		InputFilesPanel.text = "Вхідні файли"; 
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
		ChooseFilesLabel.text = "Обери файл або декілька файлів"; 
		ChooseFilesLabel.alignment = ["left","center"]; 

	var AddFilesBtn = ChooseFilesGroup.add("button", undefined, undefined, {name: "AddFilesBtn"}); 
		AddFilesBtn.text = "Обрати";
		AddFilesBtn.onClick = getFiles;

	// FILESNAMESGROUP
	// ===============
	var FilesNameListGroup = FilesGroup.add("group", undefined, {name: "FilesNameListGroup"}); 
		FilesNameListGroup.orientation = "column"; 
		FilesNameListGroup.alignChildren = ["left","center"]; 
		FilesNameListGroup.spacing = 10; 
		FilesNameListGroup.margins = [0,0,0,0];

	var FilesNameList = FilesNameListGroup.add('edittext {properties: {name: "FilesNameList", readonly: true, multiline: true, scrollable: true}}'); 
		FilesNameList.text = "Список файлів та сторінок"; 
		FilesNameList.preferredSize.width = 550; 
		FilesNameList.preferredSize.height = 100; 

	// IMPOSINGPANEL
	// =============
	var ImposingPanel = MultiplePDFImposing.add("panel", undefined, undefined, {name: "ImposingPanel"}); 
		ImposingPanel.text = "Налаштування розкладки"; 
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
		ImposingMethodLabel.text = "Метод розкладки"; 
		ImposingMethodLabel.alignment = ["left","center"]; 

	var ImposingMethod_array = ["Кожен вид на окремий лист","Вмістити всі види на 1+ лист","Вручну"]; 
	var ImposingMethod = ImposingMethodGroup.add("dropdownlist", undefined, undefined, {name: "ImposingMethod", items: ImposingMethod_array}); 
		ImposingMethod.selection = 0;
		ImposingMethod.onChange = function() {
			myImposingMethod = ImposingMethod.selection.index;
			ImposingCustom.text = "Список копій кожної сторінки"; 
			myImposing = "";					
			myFileName = "";			
			switch (myImposingMethod) {
				case 0:
					isOk.Imposing = true;
					MultipageFileSave.enabled = true;
					PostfixLabel.show();
					FileName.text = "Введи префікс назви (необов'язково)";
					isOk.filename = true; 				
					ImposingCustomGroup.hide();				
					break;
				case 1:
					isOk.Imposing = true;
					MultipageFileSave.enabled = false;
					PostfixLabel.hide();
					FileName.text = "Введи повну назву файла (обов'язково)"; 
					isOk.filename = false;					
					ImposingCustomGroup.hide();				
					break;
				case 2:
					isOk.Imposing = false;
					MultipageFileSave.enabled = false;
					PostfixLabel.hide();
					FileName.text = "Введи повну назву файла (обов'язково)"; 
					isOk.filename = false;			
					ImposingCustomGroup.show();	
					ImposingCustomLabel.text = "- / " + (totalPages ? totalPages : '-') + ' (!)';
					break;
			}
			totalFieldsCheckMain();
		}
		
	var MultipageFileSave = ImposingMethodGroup.add("checkbox", undefined, undefined, {name: "MultipageFileSave"}); 
		MultipageFileSave.text = "Залишити багатосторінковість"; 
		MultipageFileSave.value = SaveMultipageFilesAsOneFile; 
		MultipageFileSave.onClick = function() {
			SaveMultipageFilesAsOneFile = MultipageFileSave.value;
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
		ImposingCustom.helpTip = "Вкажи кількість копій кожної сторінки через кому (послідовність - згідно списку вище). Можна задати кількість сторінок підряд: перед копіями постав необхідне число та англ.літеру \"x\".\nКількість копій буде автоматично збільшено, щоб дозаповнити порожні місця в документі. Якщо потрібно дозаповнити лише певні сторінки: постав знак \"+\" після кількості копій."; 
		ImposingCustom.text = "Список копій кожної сторінки"; 
		ImposingCustom.preferredSize.width = 550;
		ImposingCustom.preferredSize.height = 30;
		ImposingCustom.onActivate = function() {
			if (ImposingCustom.text == "Список копій кожної сторінки") {
				ImposingCustom.text = "";
				myImposing = "";
			}
		};		
		ImposingCustom.onDeactivate = function() {
			if (ImposingCustom.text == "") {
				ImposingCustom.text = "Список копій кожної сторінки"; 
				myImposing = "";
			}
		};
		
		//ImposingCustom.onChange = checkValidImposingCustom;
		
		ImposingCustom.onChanging = checkValidImposingCustom;

	var ImposingCustomLabel = ImposingCustomGroup.add("statictext", undefined, undefined, {name: "ImposingCustomLabel"}); 
		ImposingCustomLabel.enabled = false; 
		ImposingCustomLabel.preferredSize.width = 550; 		

	ImposingCustomGroup.hide();		

	// EXPORTSETTINGSTAB
	// =================
	var ExportSettingsTab = MultiplePDFImposing.add("panel", undefined, undefined, {name: "ExportSettingsTab"}); 
		ExportSettingsTab.text = "Налаштування експорту"; 
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
		ChooseFolderLabel.text = "Тека для збереження результатів"; 
		ChooseFolderLabel.alignment = ["left","center"]; 

	var AddFolderBtn = ChooseFolderGroup.add("button", undefined, undefined, {name: "AddFolderBtn"}); 
		AddFolderBtn.enabled = false;
		AddFolderBtn.text = "Обрати";
		AddFolderBtn.onClick = getFolder;

	// FOLDERGROUP
	// ===========
	var FolderName = FolderGroup.add('edittext {properties: {name: "FolderName", readonly: true}}'); 
		FolderName.text = "Назва теки"; 
		FolderName.preferredSize.width = 550;	

	var FileNameLabel = FolderGroup.add("statictext", undefined, undefined, {name: "FileNameLabel"}); 
		FileNameLabel.text = "Формат назви файлів"; 

	// PREFIXGROUP
	// ===========
	var FileNameGroup = FolderGroup.add("group", undefined, {name: "FileNameGroup"}); 
		FileNameGroup.orientation = "column"; 
		FileNameGroup.alignChildren = ["left","center"]; 
		FileNameGroup.spacing = 10; 
		FileNameGroup.margins = 0; 

	var FileName = FileNameGroup.add('edittext {properties: {name: "FileName"}}'); 
		FileName.text = "Введи префікс назви (необов'язково)"; 
		FileName.preferredSize.width = 550;
		FileName.onChange = checkValidFileName;
		FileName.onActivate = function() {
			if (FileName.text == "Введи префікс назви (необов'язково)" || FileName.text == "Введи повну назву файла (обов'язково)") {
				myFileName = "";
				FileName.text = "";
			}
		};		
		FileName.onDeactivate = function() {
			if (FileName.text == "") {
				if (ImposingMethod.selection.index == 0) {
					FileName.text = "Введи префікс назви (необов'язково)"; 					
				} else {
					FileName.text = "Введи повну назву файла (обов'язково)";						
				};
				myFileName = "";
			};
		};		

	var PostfixLabel = FileNameGroup.add("statictext", undefined, undefined, {name: "PostfixLabel"}); 
		PostfixLabel.enabled = false; 
		PostfixLabel.text = "+ номер сторінки та назва файлу додаються автоматично"; 

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

	var DocLabel = DocGroup2.add("statictext", undefined, undefined, {name: "DocLabel"}); 
		DocLabel.text = "Документ для розкладки"; 

	var DocsList = DocGroup2.add("dropdownlist", undefined, undefined, {name: "DocsList", items: myDocumentNames}); 
		DocsList.preferredSize.width = 375;
		DocsList.selection = 0; 
		DocsList.alignment = ["left","center"];
		isOk.document = false;
		myDocument = false;
		myLayer = false;
		DocsList.onChange = documentSelection;	

	var CreateDocBtn = DocGroup2.add("button", undefined, undefined, {name: "CreateDocBtn"}); 
		CreateDocBtn.enabled = true;
		CreateDocBtn.text = "⚙";
		CreateDocBtn.preferredSize.width = 30;
		CreateDocBtn.onClick = function() {
			var res = NewDocSettingsWindow();
			if (res && (myCustomDoc.IsGetSizeFromFilename || myCustomDoc.title != "")) {
				DocsList.items[0].text = myCustomDoc.title;
				isOk.document = true;
				myDocument = false;
				myLayer = false;				
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
		PresetLabel.text = "Налаштування для PDF експорту"; 

	var PresetsList = PresetGroup2.add("dropdownlist", undefined, undefined, {name: "PresetsList", items: myPDFExportPresets}); 
		PresetsList.selection = 0; 
		PresetsList.alignment = ["left","center"];
		if (myPDFExportPresets.length > 0) {
			isOk.preset = true;
			myPDFExportPreset = app.pdfExportPresets.item(0);
		};
		PresetsList.onChange = presetSelection;

	// LABELINGGROUP
	// =============
	var LabelingGroup = MultiplePDFImposing.add("group", undefined, {name: "LabelingGroup"}); 
		LabelingGroup.orientation = "column"; 
		LabelingGroup.alignChildren = ["left","center"]; 
		LabelingGroup.spacing = 10; 
		LabelingGroup.margins = 0; 
		LabelingGroup.alignment = ["fill","top"]; 

	var AddFileNameLabel = LabelingGroup.add("checkbox", undefined, undefined, {name: "AddFileNameLabel"}); 
		AddFileNameLabel.text = "Додати назву файла на розкладку"; 
		AddFileNameLabel.value = AddFileNameTitle; 
		AddFileNameLabel.onClick = function() {
			AddFileNameTitle = AddFileNameLabel.value;
		};		
		

	// BUTTONSGROUP
	// ============
	var ButtonsGroup = MultiplePDFImposing.add("group", undefined, {name: "ButtonsGroup"}); 
		ButtonsGroup.orientation = "row"; 
		ButtonsGroup.alignChildren = ["left","center"]; 
		ButtonsGroup.spacing = 10; 
		ButtonsGroup.margins = 0; 
		ButtonsGroup.alignment = ["right","top"]; 

	var Cancel = ButtonsGroup.add("button", undefined, undefined, {name: "Cancel"}); 
		Cancel.text = "Відміна";
		Cancel.onClick = function() {
			MultiplePDFImposing.close(0);
			MultiplePDFImposing = null;
		}

	var Start = ButtonsGroup.add("button", undefined, undefined, {name: "Start"}); 
		Start.enabled = false; 
		Start.text = "Розкласти"; 
		Start.justify = "left"; 
		Start.onClick = function () {
			MultiplePDFImposing.close(1);
		}
	

	function getFiles() {
		
		theFiles = null;
		FilesNameList.text = "";
		totalPages = 0;
		AddFolderBtn.enabled = false;
		isOk.files = false;	
		steps = 0;		
		
		var askIt = "Обери один або декілька PDF, AI або TIF файлів";
		theFiles = File.openDialog(askIt, "*.pdf;*.ai;*.tif", true);

		if (theFiles != null) {
			for (var i = 0; i < theFiles.length; i++) {
				var theFile = theFiles[i];
				var fileName = File.decode(theFile.name);				
				var pgCount = 1;
				if (fileName.indexOf(".tif") == -1) pgCount = getPDFInfo(theFile);
				if (pgCount > 0) {
					for (var page = 1; page <= pgCount; page++) {
						totalPages++;
						FilesNameList.text += totalPages + ") " + fileName + " (сторінка №" + page + ")";
						if (page != pgCount) FilesNameList.text += "\n";	
					}
					okFiles.push({theFile: theFile, pgCount: pgCount});
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
		if (ImposingCustom.text == "Список копій кожної сторінки") {
			isOk.Imposing = true;
			myImposing = "";
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
				if (countCustomPages != totalPages) {
					ImposingCustomLabel.text = countCustomPages + " / " + (totalPages ? totalPages : '-') + ' (!)';
				} else {
					ImposingCustomLabel.text = countCustomPages + " / " + totalPages;
					myImposing = ImposingCustom.text;
				}
			} else {
				ImposingCustomLabel.text = "- / " + (totalPages ? totalPages : '-')  + ' (!)';
			}
		}
		totalFieldsCheckMain();	
	}
	
	function isValidImposingCustom(cText) {
	  var rg2 = /^((\d+x)?(\d+\+?,))*((\d+x)?(\d+\+?))$/gm;
	  return rg2.test(cText);
	}	
	
	function getFolder() {
		
		var folder = new Folder(okFiles[0].theFile.path);
		
		outputFolder = folder.selectDlg("Обери папку для експорту розкладок");
		
		FolderName.text = ""; 
		isOk.folder = false;		
		
		if (outputFolder != null && outputFolder.exists) {
			FolderName.text = Folder.decode(outputFolder.fullName); 
			isOk.folder = true;
		}
		
		totalFieldsCheckMain();
	}
	
	function checkValidFileName() {
		if (ImposingMethod.selection.index == 0) {
			isOk.filename = isValidFileName(FileName.text);
			if (FileName.text == "Введи префікс назви (необов'язково)" || FileName.text == "Введи повну назву файла (обов'язково)") {
				myFileName = "";
			} else if (isOk.filename) {
				myFileName = FileName.text;
			} else if (!isOk.filename) alert("Недопустимі символи в назві файлу!");	
		} else {
			if (FileName.text == "" || FileName.text == "Введи повну назву файла (обов'язково)") {
				isOk.filename = false;
				myFileName = "";				
			} else {
				isOk.filename = isValidFileName(FileName.text);
				if (isOk.filename) myFileName = FileName.text;
				if (!isOk.filename) alert("Недопустимі символи в назві файлу!");
			}
		}
		totalFieldsCheckMain();
	}

	function isValidFileName(fname) {
	  var rg1 = /^[^\\\/:\*\?"<>\|]+$/gm;
	  return rg1.test(fname) || fname == "";
	}	
	
	function documentSelection() {
		
		for (i = 0; i < DocsList.items.length; i++) {
			if (DocsList.items[i].selected) {
				if (i == 0) {
					if (myCustomDoc.Diameter == 0) {
						myDocument = false;
						myLayer = false;
						isOk.document = false;
					}
					totalFieldsCheckMain();	
					CreateDocBtn.show();
				} else {
					isOk.document = true;				
					myDocument = app.documents.itemByName(DocsList.items[i].text);						
					myLayer = myDocument.layers.itemByName(PRINTLayer);
					CreateDocBtn.hide();
					totalFieldsCheckMain();						
				}
				break;
			}
		}
	}
	
	function presetSelection() {
		for (i = 0; i < PresetsList.items.length; i++) {
			if (PresetsList.items[i].selected) myPDFExportPreset = app.pdfExportPresets.item(i);
		}
		totalFieldsCheckMain();
	}	

	function totalFieldsCheckMain() {
		Start.enabled = isOk.files && isOk.folder && isOk.filename && isOk.document && isOk.preset && isOk.Imposing;
	}
	
	var myResult = MultiplePDFImposing.show();

	if (myResult == true){
		MultiplePDFImposing = null;
		PlacePDF();
	}
	else{
		MultiplePDFImposing = null;
	}	

}

// Налаштування параметрів нової розкладки
function NewDocSettingsWindow() {
	
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
		NewCustomDocSettings.text = "Налаштування розкладки"; 
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
		CirclesSettings.text = "Кола"; 
		CirclesSettings.orientation = "column"; 
		CirclesSettings.alignChildren = ["left","top"]; 
		CirclesSettings.spacing = 10; 
		CirclesSettings.margins = 10; 		

	// CIRCLESETTINGSPANEL
	// =============
	var CircleSettingsPanel = CirclesSettings.add("panel", undefined, undefined, {name: "CircleSettingsPanel"}); 
		CircleSettingsPanel.text = "Параметри кола"; 
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
		GetCircleSizeFromFilename.text = "Брати параметри з назв файлів, інакше ігнорувати."; 
		GetCircleSizeFromFilename.value = IsGetSizeFromFilename;		
		GetCircleSizeFromFilename.onClick = CircleCheckBoxClick;
		
	var GetCircleSizeFromFilenameDisclaimer = CircleDocParamsGroup.add("statictext", undefined, undefined, {name: "GetCircleSizeFromFilenameDisclaimer"}); 
		GetCircleSizeFromFilenameDisclaimer.text = "Назва має містити: _D={1}_, де {1} - діаметр в мм."; 
		GetCircleSizeFromFilenameDisclaimer.enabled = false;		
		
	// CIRCLESIZEGROUP
	// =========				
	var CircleSizeGroup = CircleDocParamsGroup.add("group", undefined, {name: "CircleSizeGroup"}); 
		CircleSizeGroup.orientation = "row"; 
		CircleSizeGroup.alignChildren = ["left","center"]; 
		CircleSizeGroup.spacing = 10; 
		CircleSizeGroup.margins = 0;
		CircleSizeGroup.enabled = !IsGetSizeFromFilename;

	var DiameterLabel = CircleSizeGroup.add("statictext", undefined, undefined, {name: "DiameterLabel"}); 
		DiameterLabel.text = "Діаметр кола"; 

	var Diameter = CircleSizeGroup.add('edittext {properties: {name: "Diameter"}}'); 
		Diameter.text = myCustomDoc.Diameter; 
		Diameter.preferredSize.width = 100;
		Diameter.helpTip = "Діаметр має бути числом > 0"; 
		Diameter.onChange = totalFieldsCheck;

	var DiameterUnits = CircleSizeGroup.add("statictext", undefined, undefined, {name: "DiameterUnits"}); 
		DiameterUnits.text = "мм";

	// ---------------RECTANGLES-----------------
	// RECTANGLESSETTINGS
	// ===============
	var RectanglesSettings = FigureSelector.add("tab", undefined, undefined, {name: "RectanglesSettings"}); 
		RectanglesSettings.text = "Прямокутники"; 
		RectanglesSettings.orientation = "column"; 
		RectanglesSettings.alignChildren = ["left","top"]; 
		RectanglesSettings.spacing = 10; 
		RectanglesSettings.margins = 10; 		

	// RECTANGLESETTINGSPANEL
	// =============
	var RectangleSettingsPanel = RectanglesSettings.add("panel", undefined, undefined, {name: "RectangleSettingsPanel"}); 
		RectangleSettingsPanel.text = "Параметри прямокутника"; 
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
		GetRectangleSizeFromFilename.text = "Брати параметри з назв файлів, інакше ігнорувати."; 
		GetRectangleSizeFromFilename.value = IsGetSizeFromFilename;		
		GetRectangleSizeFromFilename.onClick = RectangleCheckBoxClick;
		
	var GetRectangleSizeFromFilenameDisclaimer = RectangleDocParamsGroup.add("statictext", undefined, undefined, {name: "GetRectangleSizeFromFilenameDisclaimer", multiline: true}); 
		GetRectangleSizeFromFilenameDisclaimer.text = "Назва має містити: _{1}x{2} R={3}_, де {1} - ширина в мм, {2} - висота в мм, {3} - радіус скругління в мм. Обов'язкові лише ширина та висота.";
		GetRectangleSizeFromFilenameDisclaimer.enabled = false; 
		GetRectangleSizeFromFilenameDisclaimer.preferredSize.width = 400;		
		GetRectangleSizeFromFilenameDisclaimer.preferredSize.height = 45;		
		
	// RECTANGLESIZEGROUP
	// =========	
	var RectangleSizeGroup = RectangleDocParamsGroup.add("group", undefined, {name: "RectangleSizeGroup"}); 
		RectangleSizeGroup.orientation = "row"; 
		RectangleSizeGroup.alignChildren = ["left","center"]; 
		RectangleSizeGroup.spacing = 10; 
		RectangleSizeGroup.margins = 0;
		RectangleSizeGroup.enabled = !IsGetSizeFromFilename;

	var WidthLabel = RectangleSizeGroup.add("statictext", undefined, undefined, {name: "WidthLabel"}); 
		WidthLabel.text = "Ширина";

	var RectWidth = RectangleSizeGroup.add('edittext {properties: {name: "RectWidth"}}'); 
		RectWidth.text = myCustomDoc.RectWidth; 
		RectWidth.preferredSize.width = 100;
		RectWidth.helpTip = "Ширина має бути числом > 0"; 
		RectWidth.onChange = totalFieldsCheck;

	var WidthUnits = RectangleSizeGroup.add("statictext", undefined, undefined, {name: "WidthUnits"}); 
		WidthUnits.text = "мм";
		
	var HeightLabel = RectangleSizeGroup.add("statictext", undefined, undefined, {name: "HeightLabel"}); 
		HeightLabel.text = "Висота";

	var RectHeight = RectangleSizeGroup.add('edittext {properties: {name: "RectHeight"}}'); 
		RectHeight.text = myCustomDoc.RectHeight; 
		RectHeight.preferredSize.width = 100;
		RectHeight.helpTip = "Висота має бути числом > 0";
		RectHeight.onChange = totalFieldsCheck;

	var HeightUnits = RectangleSizeGroup.add("statictext", undefined, undefined, {name: "HeightUnits"}); 
		HeightUnits.text = "мм";

	// ROUNDCORNERSGROUP
	// =========	
	var RoundCornersGroup = RectangleDocParamsGroup.add("group", undefined, {name: "RoundCornersGroup"}); 
		RoundCornersGroup.orientation = "row"; 
		RoundCornersGroup.alignChildren = ["left","center"]; 
		RoundCornersGroup.spacing = 10; 
		RoundCornersGroup.margins = 0;

	var RoundCorners = RoundCornersGroup.add("checkbox", undefined, undefined, {name: "RoundCorners"}); 
		RoundCorners.text = "Скругління кутів"; 
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
		CornersUnits.text = "мм";
		
	// ---------------MIXED-----------------
	// MIXEDSETTINGS
	// ===============
	var MixedSettings = FigureSelector.add("tab", undefined, undefined, {name: "MixedSettings"}); 
		MixedSettings.text = "Мікс"; 
		MixedSettings.orientation = "column"; 
		MixedSettings.alignChildren = ["left","top"]; 
		MixedSettings.spacing = 10; 
		MixedSettings.margins = 10; 		

	// MIXEDSETTINGSPANEL
	// =============
	var MixedSettingsPanel = MixedSettings.add("panel", undefined, undefined, {name: "MixedSettingsPanel"}); 
		MixedSettingsPanel.text = "Параметри фігур"; 
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
		GetMixedSizeFromFilename.text = "Брати параметри з назв файлів, інакше ігнорувати."; 
		GetMixedSizeFromFilename.value = true;
		GetMixedSizeFromFilename.enabled = false;
		
	var GetMixedSizeFromFilenameDisclaimer1 = MixedDocParamsGroup.add("statictext", undefined, undefined, {name: "GetMixedSizeFromFilenameDisclaimer1"}); 
		GetMixedSizeFromFilenameDisclaimer1.text = "КОЛА: Назва має містити: _D={1}_, де {1} - діаметр в мм."; 
		GetMixedSizeFromFilenameDisclaimer1.enabled = false;		
		
	var GetMixedSizeFromFilenameDisclaimer2 = MixedDocParamsGroup.add("statictext", undefined, undefined, {name: "GetMixedSizeFromFilenameDisclaimer2", multiline: true}); 
		GetMixedSizeFromFilenameDisclaimer2.text = "ПРЯМОКУТНИКИ: Назва має містити: _{1}x{2} R={3}_, де {1} - ширина в мм, {2} - висота в мм, {3} - радіус скругління в мм. Обов'язкові лише ширина та висота.";
		GetMixedSizeFromFilenameDisclaimer2.enabled = false; 
		GetMixedSizeFromFilenameDisclaimer2.preferredSize.width = 400;		
		GetMixedSizeFromFilenameDisclaimer2.preferredSize.height = 45;		

	// FIGURESELECTOR
	// ==============
	FigureSelector.selection = RectanglesSettings;
	if (!myCustomDoc.Figure || myCustomDoc.Figure == 'Кола') {
		FigureSelector.selection = CirclesSettings;
	} else if (myCustomDoc.Figure == 'Прямокутники') {
		FigureSelector.selection = RectanglesSettings;
	} else {
		FigureSelector.selection = MixedSettings;
	}
	FigureSelector.onChange = totalFieldsCheck;
	
	// SETTINGSPANEL
	// =============
	var SettingsPanel = NewCustomDocSettings.add("panel", undefined, undefined, {name: "SettingsPanel"}); 
		SettingsPanel.text = "Налаштування плоттера"; 
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
		CutterTypeLabel.text = "Формат розкладки"; 

	var CutterType_array = new Array;
	for (var i = 0; i < CutterTypes.length; i++) {
		CutterType_array.push(CutterTypes[i].text);
	}
	
	var CutterType = CutterTypeGroup.add("dropdownlist", undefined, undefined, {name: "CutterType", items: CutterType_array}); 
	if (myCustomDoc.CutterType) {
		CutterType.find(myCustomDoc.CutterType.text).selected = true;
	} else {
		CutterType.selection = 0;			
	}
	CutterType.onChange = totalFieldsCheck;

	// SPACEBETWEENGROUP
	// =================
	var SpaceBetweenGroup = DocParamsGroup.add("group", undefined, {name: "SpaceBetweenGroup"}); 
		SpaceBetweenGroup.orientation = "row"; 
		SpaceBetweenGroup.alignChildren = ["left","center"]; 
		SpaceBetweenGroup.spacing = 10; 
		SpaceBetweenGroup.margins = 0; 

	var SpaceBetweenLabel = SpaceBetweenGroup.add("statictext", undefined, undefined, {name: "SpaceBetweenLabel"}); 
		SpaceBetweenLabel.text = "Роздвижка між контурами"; 

	var SpaceBetween = SpaceBetweenGroup.add('edittext {properties: {name: "SpaceBetween"}}'); 
		if (FigureSelector.selection.text == "Прямокутники") {
			minSpaceBetween = IsRoundedCorners ? CutterTypes[CutterType.selection.index].minSpaceBetween : 0;
		} else {
			minSpaceBetween = CutterTypes[CutterType.selection.index].minSpaceBetween;
		};
		SpaceBetween.text = myCustomDoc.SpaceBetween;
		SpaceBetween.helpTip = "Значення роздвижки має бути числом між " + minSpaceBetween + " та " + CutterTypes[CutterType.selection.index].maxSpaceBetween;
		SpaceBetween.preferredSize.width = 100; 
		SpaceBetween.onChange = totalFieldsCheck;

	var SpaceBetweenUnits = SpaceBetweenGroup.add("statictext", undefined, undefined, {name: "SpaceBetweenUnits"}); 
		SpaceBetweenUnits.text = "мм";
		
	var IsZeroBleedsChk = DocParamsGroup.add("checkbox", undefined, undefined, {name: "IsZeroBleedsChk"}); 
		IsZeroBleedsChk.text = "Без вильотів (не рекомендується)"; 
		IsZeroBleedsChk.value = IsZeroBleeds;		
		IsZeroBleedsChk.onClick = function() {
			IsZeroBleeds = IsZeroBleedsChk.value;
			checkValidSpaceBetween();
		};		

	var BleedWarningLabel = DocParamsGroup.add("statictext", undefined, undefined, {name: "BleedWarningLabel"}); 
		BleedWarningLabel.enabled = false; 
		Bleeds = IsZeroBleeds ? 0 : CutterTypes[CutterType.selection.index].minSpaceBetween / 2;
		BleedWarningLabel.text = "Вильоти макета мають бути по " + Bleeds + " мм!";

	// DOCPARAMSGROUP2
	// ===============
	var DocParamsGroup2 = DocParamsGroup.add("group", undefined, {name: "DocParamsGroup2"}); 
		DocParamsGroup2.orientation = "column"; 
		DocParamsGroup2.alignChildren = ["left","center"]; 
		DocParamsGroup2.spacing = 10; 
		DocParamsGroup2.margins = [0,10,0,0]; 
		DocParamsGroup2.alignment = ["left","fill"]; 
		

	var SaveFileWithCut = DocParamsGroup2.add("checkbox", undefined, undefined, {name: "SaveFileWithCut"}); 
		SaveFileWithCut.text = "Зберегти файл з контуром порізки"; 
		SaveFileWithCut.value = IsSaveFileWithCut;		
		SaveFileWithCut.onClick = function() {
			IsSaveFileWithCut = SaveFileWithCut.value;
		}; 		

	// VARIANTSPANEL
	// =============
	var VariantsPanel = NewCustomDocSettings.add("panel", undefined, undefined, {name: "VariantsPanel"}); 
		VariantsPanel.text = "Доступні варіанти"; 
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
				myCustomDoc = {
					CutterType: CutterTypes[CutterType.selection.index],
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
				if (FigureSelector.selection.text == "Кола") {
					myCustomDoc.title = "\u25CB D=" + myCustomDoc.Diameter + " (" + myCustomDoc.SpaceBetween + ") мм | " + myCustomDoc.CutterType.text + " | " + myCustomDoc.Params.total + " шт";	
				};
				if (FigureSelector.selection.text == "Прямокутники") {
					myCustomDoc.title = "\u25A1 " + myCustomDoc.RectWidth + "x" + myCustomDoc.RectHeight + (IsRoundedCorners ? " R=" + myCustomDoc.RoundCornersValue : "") + " (" + myCustomDoc.SpaceBetween + ") мм | " + myCustomDoc.CutterType.text + " | " + myCustomDoc.Params.total + " шт";
				};	
				NewCustomDocSettings.close(1);				
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
		CancelDocBtn.text = "Відміна"; 
		CancelDocBtn.alignment = ["right","bottom"]; 
		CancelDocBtn.onClick = function() {
			NewCustomDocSettings.close(0);
			NewCustomDocSettings = null;
		}

	var SaveDocBtn = DocBtnsGroup.add("button", undefined, undefined, {name: "SaveDocBtn"}); 
		SaveDocBtn.text = "Зберегти"; 
		SaveDocBtn.enabled = false;  
		SaveDocBtn.onClick = function() {
			myCustomDoc = {
				CutterType: CutterTypes[CutterType.selection.index],
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
				if (FigureSelector.selection.text == "Кола") {
					myCustomDoc.title = "\u25CB D=" + myCustomDoc.Diameter + " (" + myCustomDoc.SpaceBetween + ") мм | " + myCustomDoc.CutterType.text + " | " + myCustomDoc.Params.total + " шт";	
				};
				if (FigureSelector.selection.text == "Прямокутники") {
					myCustomDoc.title = "\u25A1 " + myCustomDoc.RectWidth + "x" + myCustomDoc.RectHeight + (IsRoundedCorners ? " R=" + myCustomDoc.RoundCornersValue : "") + " (" + myCustomDoc.SpaceBetween + ") мм | " + myCustomDoc.CutterType.text + " | " + myCustomDoc.Params.total + " шт";
				};
			} else {
				if (FigureSelector.selection.text == "Кола") {
					myCustomDoc.title = "\u25CB По назві файлів | " + myCustomDoc.CutterType.text;
				};
				if (FigureSelector.selection.text == "Прямокутники") {
					myCustomDoc.title = "\u25A1 По назві файлів | " + myCustomDoc.CutterType.text;
				};
				if (FigureSelector.selection.text == "Мікс") {
					myCustomDoc.title = "\u25CB ? \u25A1 По назві файлів | " + myCustomDoc.CutterType.text;
				};				
				myCustomDoc.Params = false;
			}
			NewCustomDocSettings.close(1);			
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
		if (RoundCornersGroup.enabled) {
			RoundCornersValue.text = RoundCornersValue.text.replace(',','.');
			var maxRadius = +RectWidth.text > +RectHeight.text ? +RectHeight.text / 2 : +RectWidth.text / 2;			
			RoundCornersValue.helpTip = "Значення радіуса має біти від 0 до " + maxRadius + " мм";
			if (RoundCornersValue.text < 0) RoundCornersValue.text = 0;
			if (RoundCornersValue.text > maxRadius) RoundCornersValue.text = maxRadius;
		}
	}
	
	function checkValidSpaceBetween() {	
		if (FigureSelector.selection.text == "Прямокутники" || FigureSelector.selection.text == "Мікс") {
			specialText = IsRoundedCorners ? "" : ", а також 0.";
			minSpaceBetween = IsRoundedCorners ? CutterTypes[CutterType.selection.index].minSpaceBetween : 0;
		} else {
			specialText = "";
			minSpaceBetween = CutterTypes[CutterType.selection.index].minSpaceBetween;
		};		
		SpaceBetween.text = Math.round(SpaceBetween.text.replace(',','.'));
		isOk.SpaceBetween = isValidNumber(SpaceBetween.text) &&
							SpaceBetween.text != "" &&
							((+SpaceBetween.text >= +CutterTypes[CutterType.selection.index].minSpaceBetween && +SpaceBetween.text <= +CutterTypes[CutterType.selection.index].maxSpaceBetween) ||
							(+SpaceBetween.text == +minSpaceBetween));
		SpaceBetween.helpTip = "Значення роздвижки має бути числом між " + CutterTypes[CutterType.selection.index].minSpaceBetween + " та " + CutterTypes[CutterType.selection.index].maxSpaceBetween + specialText; 		
		if (!isOk.SpaceBetween) {
			SpaceBetween.text = SpaceBetween.text > CutterTypes[CutterType.selection.index].maxSpaceBetween ? CutterTypes[CutterType.selection.index].maxSpaceBetween : minSpaceBetween;
			isOk.SpaceBetween = true;
		}
		var Bleeds = IsZeroBleeds ? 0 : CutterTypes[CutterType.selection.index].minSpaceBetween / 2;
		if (isOk.SpaceBetween) BleedWarningLabel.text = "Вильоти макета мають бути по " + Bleeds + " мм!"; 	
	}		
	
	function isValidNumber(cText) {
	  var rg2 = /^(\d+)([\.,]\d+)?$/gm;
	  return rg2.test(cText);
	}

	function totalFieldsCheck(preselected) {	
		if (FigureSelector.selection.text == "Кола") checkValidDiameter();
		if (FigureSelector.selection.text == "Прямокутники") checkValidSize();
		if (FigureSelector.selection.text == "Мікс") checkMixed();
		checkValidSpaceBetween();
		checkValidRoundCornersValue();
		calculateVariants(preselected);
	}
	
	function calculateVariants(preselected) {
		if (FigureSelector.selection.text == "Кола") {
			calculateCircleVariants(preselected);
		};
		if (FigureSelector.selection.text == "Прямокутники") {
			calculateRectangleVariants(preselected);
		};
		if (FigureSelector.selection.text == "Мікс") {
			calculateMixedVariants(preselected);
		};
	}
	
	function calculateCircleVariants(preselected) {		
		VariantsPanelSwitch();
		if (!IsGetSizeFromFilename) {
			isOk.Variant = false;
			Variants.removeAll();
			if (preselected || (isOk.Size && isOk.SpaceBetween)) {
				VariantsRozkladka = RozkladkaCircles(Diameter.text, CutterTypes[CutterType.selection.index], SpaceBetween.text);
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
			Variants.add('item', 'Буде взято найоптимальніший варіант');		
		}
		SaveDocBtn.enabled = isOk.Size && isOk.SpaceBetween && isOk.Variant;
	}	
	
	function calculateRectangleVariants(preselected) {	
		VariantsPanelSwitch();
		if (!IsGetSizeFromFilename) {
			isOk.Variant = false;
			Variants.removeAll();			
			if (preselected || (isOk.Size && isOk.SpaceBetween)) {
				VariantsRozkladka = RozkladkaRectangles(RectWidth.text, RectHeight.text, CutterTypes[CutterType.selection.index], SpaceBetween.text, SpaceBetween.text > 0);
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
			Variants.add('item', 'Буде взято найоптимальніший варіант');		
		}
		SaveDocBtn.enabled = isOk.Size && isOk.SpaceBetween && isOk.Variant;
	}
	
	function calculateMixedVariants(preselected) {	
		VariantsPanelSwitch();
		Variants.removeAll();			
		Variants.add('item', 'Буде взято найоптимальніший варіант');
		SaveDocBtn.enabled = true;
	}

	totalFieldsCheck(myCustomDoc.Params);		

	var myResult = NewCustomDocSettings.show();

	if (myResult == true) {
		NewCustomDocSettings = null;		
	} else {
		NewCustomDocSettings = null;
	}

	return myResult;
	
}

function PlacePDF(){
	
	var lastAppPrefs = {
		preflightOff: app.preflightOptions.preflightOff,
		defaultDisplaySettings: app.displayPerformancePreferences.defaultDisplaySettings,
		liveScreenDrawing: app.liveScreenDrawing,
		pagesThumbnails: app.panels.itemByName('Pages').pagesThumbnails,
		mastersThumbnails: app.panels.itemByName('Pages').mastersThumbnails,
		raster: {},
		transparency: {},
		vector: {}
	}
	
	app.preflightOptions.preflightOff = true;
	app.displayPerformancePreferences.defaultDisplaySettings = ViewDisplaySettings.TYPICAL;
	app.liveScreenDrawing = LiveDrawingOptions.NEVER;
	app.panels.itemByName('Pages').pagesThumbnails = false;
	app.panels.itemByName('Pages').mastersThumbnails = false;
	for (var i = 1; i <= app.displaySettings.count(); i++) {
		if (app.displaySettings.item(i).isValid) {
			if (app.displaySettings.item(i).raster) {
				lastAppPrefs.raster[i] = app.displaySettings.item(i).raster;
				app.displaySettings.item(i).raster = TagRaster.PROXY;			
			}
			if (app.displaySettings.item(i).transparency) {
				lastAppPrefs.transparency[i] = app.displaySettings.item(i).transparency;
				app.displaySettings.item(i).transparency = TagTransparency.LOW_QUALITY;			
			}
			if (app.displaySettings.item(i).vector) {
				lastAppPrefs.vector[i] = app.displaySettings.item(i).vector;
				app.displaySettings.item(i).vector = TagVector.PROXY;			
			}			
		}		
	}	
	
	var fileCounter = 1;
	var myCurrentDoc = {
		CutterType: myCustomDoc.CutterType,
		SpaceBetween: myCustomDoc.SpaceBetween,
		IsZeroBleeds: myCustomDoc.IsZeroBleeds,
		IsSaveFileWithCut: myCustomDoc.IsSaveFileWithCut,
		Params: false
	};

	var badFiles;
	
	switch (myCustomDoc.Figure) {
		case "Кола":
			if (myCustomDoc.Diameter || myCustomDoc.IsGetSizeFromFilename) {
				if (myCustomDoc.IsGetSizeFromFilename) {
					var okFilesDiameters = {};
					var okDiameters = [];
					var okFilesCurrent;
					var totalOkFilesLength = okFiles.length;
					
					for (var i = 0; i < okFiles.length; i++) {
						var theFile = okFiles[i].theFile;				
						var fileName = File.decode(theFile.name).split('.').slice(0, -1).join('.');
						var diameterMatch = fileName.match(/(_d=)(\d+(,\d+)?)/i);
						var diameter = diameterMatch ? +diameterMatch[2] : 0;
						var files = okFilesDiameters[diameter] || [];
						files.push(okFiles[i]);
						okFilesDiameters[diameter] = files;
						if (okDiameters.indexOf(diameter) < 0) okDiameters.push(diameter);
					}

					if (okFilesDiameters[0]) {
						// Запам'ятовуємо файли, діаметр яких не вдалося розпізнати 
						badFiles = okFilesDiameters[0];
						totalOkFilesLength = totalOkFilesLength - badFiles.length;			
					};			
					
					// Перебираємо варіанти
					for (var i = 0; i < okDiameters.length; i++) {
						if (okDiameters[i] !== 0) {
							myCurrentDoc.Diameter = okDiameters[i];
							var thisFileParams = RozkladkaCircles(myCurrentDoc.Diameter, myCurrentDoc.CutterType, myCurrentDoc.SpaceBetween, true);			
							if (thisFileParams.length) {
								myCurrentDoc.Params = thisFileParams[0];
								okFilesCurrent = okFilesDiameters[okDiameters[i]];				
								totalPages = 0;
								for (var j = 0; j < okFilesCurrent.length; j++) {
									totalPages = totalPages + okFilesCurrent[j].pgCount;
								};									
								CreateCustomDocCircles(myCurrentDoc);
								ProcessCircles(okFilesCurrent, totalOkFilesLength);				
							} else {
								badFiles = okFilesSizes[okSizes[i]];
							};					
						}
					}			
				} else {
					myCurrentDoc = myCustomDoc;
					CreateCustomDocCircles(myCurrentDoc);
					ProcessCircles(okFiles, okFiles.length);
				}
			} else {
				ProcessCircles(okFiles, okFiles.length);
			};		
			break;
		case "Прямокутники":		
			if ((myCustomDoc.RectWidth && myCustomDoc.RectHeight) || myCustomDoc.IsGetSizeFromFilename) {
				if (myCustomDoc.IsGetSizeFromFilename) {
					var okFilesSizes = {};
					var okSizes = [];
					var okFilesCurrent;
					var totalOkFilesLength = okFiles.length;
					
					for (var i = 0; i < okFiles.length; i++) {
						var theFile = okFiles[i].theFile;				
						var fileName = File.decode(theFile.name).split('.').slice(0, -1).join('.');
						var sizeMatch = fileName.match(/(_?\d+([\.,]\d+)?)([xх])(\d+([\.,]\d+)?)( ?R=?\d+([\.,]\d+)?)?/i);
						var size = sizeMatch ? sizeMatch[0].replace(/[_ \=]/g, '').replace(/,/g, '.').replace(/r/g, 'R').replace(/х/g, 'x') : 0;
						var files = okFilesSizes[size] || [];
						files.push(okFiles[i]);
						okFilesSizes[size] = files;
						if (okSizes.indexOf(size) < 0) okSizes.push(size);
					}

					if (okFilesSizes[0]) {
						// Запам'ятовуємо файли, розмір яких не вдалося розпізнати 
						badFiles = okFilesSizes[0];
						totalOkFilesLength = totalOkFilesLength - badFiles.length;			
					};	
					
					// Перебираємо варіанти
					for (var i = 0; i < okSizes.length; i++) {
						if (okSizes[i] !== 0) {
							var thisSize = okSizes[i].split('R')[0];
							var thisRadius = okSizes[i].split('R')[1] ? okSizes[i].split('R')[1] : 0;
							var thisSpaceBetween = thisRadius > 0 ? (myCurrentDoc.SpaceBetween > myCurrentDoc.CutterType.minSpaceBetween ? myCurrentDoc.SpaceBetween : myCurrentDoc.CutterType.minSpaceBetween) : myCurrentDoc.SpaceBetween;
							myCurrentDoc.RectWidth = thisSize.split('x')[0];
							myCurrentDoc.RectHeight = thisSize.split('x')[1];
							if (thisRadius > myCurrentDoc.RectWidth / 2 || thisRadius > myCurrentDoc.RectHeight / 2) {
								badFiles = okFilesSizes[okSizes[i]];
								continue;
							} else {
								var thisFileParams = RozkladkaRectangles(myCurrentDoc.RectWidth, myCurrentDoc.RectHeight, myCurrentDoc.CutterType, thisSpaceBetween, thisSpaceBetween > 0, true);
								if (thisFileParams.length) {
									myCurrentDoc.Params = thisFileParams[0];
									okFilesCurrent = okFilesSizes[okSizes[i]];				
									totalPages = 0;
									for (var j = 0; j < okFilesCurrent.length; j++) {
										totalPages = totalPages + okFilesCurrent[j].pgCount;
									};										
									CreateCustomDocRectangles(myCurrentDoc, thisRadius > 0 ? thisRadius : false, thisRadius > 0 ? thisSpaceBetween : false);
									ProcessRectangles(okFilesCurrent, totalOkFilesLength, thisRadius > 0 ? thisRadius : false, thisRadius > 0 ? thisSpaceBetween : false);				
								} else {
									badFiles = okFilesSizes[okSizes[i]];
								};								
							}					
						}
					}			
				} else {
					myCurrentDoc = myCustomDoc;
					CreateCustomDocRectangles(myCurrentDoc);
					ProcessRectangles(okFiles, okFiles.length);
				}
			} else {
				ProcessRectangles(okFiles, okFiles.length);
			};			
			break;
		case "Мікс":
			var okFilesDiameters = {};
			var okDiameters = [];
			var okFilesSizes = {};
			var okSizes = [];
			var badDiameterFiles = [];
			var okFilesCurrent;
			var totalOkFilesLength = okFiles.length;
			
			for (var i = 0; i < okFiles.length; i++) {
				var theFile = okFiles[i].theFile;				
				var fileName = File.decode(theFile.name).split('.').slice(0, -1).join('.');
				var diameterMatch = fileName.match(/(_d=)(\d+(,\d+)?)/i);
				var diameter = diameterMatch ? +diameterMatch[2] : 0;
				var files = okFilesDiameters[diameter] || [];
				files.push(okFiles[i]);
				okFilesDiameters[diameter] = files;
				if (okDiameters.indexOf(diameter) < 0) okDiameters.push(diameter);
			}
			
			if (okFilesDiameters[0]) {
				// Запам'ятовуємо файли, діаметр яких не вдалося розпізнати 
				badDiameterFiles = okFilesDiameters[0];		
			};			
			
			for (var i = 0; i < badDiameterFiles.length; i++) {
				var theFile = badDiameterFiles[i].theFile;				
				var fileName = File.decode(theFile.name).split('.').slice(0, -1).join('.');
				var sizeMatch = fileName.match(/(_?\d+([\.,]\d+)?)([xх])(\d+([\.,]\d+)?)( ?R=?\d+([\.,]\d+)?)?/i);
				var size = sizeMatch ? sizeMatch[0].replace(/[_ \=]/g, '').replace(/,/g, '.').replace(/r/g, 'R').replace(/х/g, 'x') : 0;
				var files = okFilesSizes[size] || [];
				files.push(badDiameterFiles[i]);
				okFilesSizes[size] = files;
				if (okSizes.indexOf(size) < 0) okSizes.push(size);
			}

			if (okFilesSizes[0]) {
				// Запам'ятовуємо файли, розмір яких не вдалося розпізнати 
				badFiles = okFilesSizes[0];
				totalOkFilesLength = totalOkFilesLength - badFiles.length;			
			};			
			
			// Перебираємо варіанти кружечків
			for (var i = 0; i < okDiameters.length; i++) {
				if (okDiameters[i] !== 0) {
					myCurrentDoc.Diameter = okDiameters[i];
					var thisSpaceBetween = myCurrentDoc.SpaceBetween > myCurrentDoc.CutterType.minSpaceBetween ? myCurrentDoc.SpaceBetween : myCurrentDoc.CutterType.minSpaceBetween;
					var thisFileParams = RozkladkaCircles(myCurrentDoc.Diameter, myCurrentDoc.CutterType, thisSpaceBetween, true);			
					if (thisFileParams.length) {
						myCurrentDoc.Params = thisFileParams[0];
						okFilesCurrent = okFilesDiameters[okDiameters[i]];				
						totalPages = 0;
						for (var j = 0; j < okFilesCurrent.length; j++) {
							totalPages = totalPages + okFilesCurrent[j].pgCount;
						};							
						CreateCustomDocCircles(myCurrentDoc, thisSpaceBetween);
						ProcessCircles(okFilesCurrent, totalOkFilesLength, thisSpaceBetween);				
					} else {
						badFiles = okFilesSizes[okSizes[i]];
					};					
				}
			}
			// Перебираємо варіанти прямокутників
			for (var i = 0; i < okSizes.length; i++) {
				if (okSizes[i] !== 0) {
					var thisSize = okSizes[i].split('R')[0];
					var thisRadius = okSizes[i].split('R')[1] ? okSizes[i].split('R')[1] : 0;
					var thisSpaceBetween = thisRadius > 0 ? (myCurrentDoc.SpaceBetween > myCurrentDoc.CutterType.minSpaceBetween ? myCurrentDoc.SpaceBetween : myCurrentDoc.CutterType.minSpaceBetween) : myCurrentDoc.SpaceBetween;
					myCurrentDoc.RectWidth = thisSize.split('x')[0];
					myCurrentDoc.RectHeight = thisSize.split('x')[1];
					if (thisRadius > myCurrentDoc.RectWidth / 2 || thisRadius > myCurrentDoc.RectHeight / 2) {
						badFiles = okFilesSizes[okSizes[i]];
						continue;
					} else {
						var thisFileParams = RozkladkaRectangles(myCurrentDoc.RectWidth, myCurrentDoc.RectHeight, myCurrentDoc.CutterType, thisSpaceBetween, thisSpaceBetween > 0, true);			
						if (thisFileParams.length) {
							myCurrentDoc.Params = thisFileParams[0];
							okFilesCurrent = okFilesSizes[okSizes[i]];				
							totalPages = 0;
							for (var j = 0; j < okFilesCurrent.length; j++) {
								totalPages = totalPages + okFilesCurrent[j].pgCount;
							};								
							myCurrentDoc.RoundCornersValue = thisRadius;
							myCurrentDoc.IsRoundedCorners = thisRadius > 0;
							CreateCustomDocRectangles(myCurrentDoc, thisRadius, thisSpaceBetween);
							ProcessRectangles(okFilesCurrent, totalOkFilesLength, thisRadius, thisSpaceBetween);				
						} else {
							badFiles = okFilesSizes[okSizes[i]];
						};								
					}					
				}
			}			
			break;			
		default:
			badFiles = okFiles;
			break;
	}
	
	function ProcessCircles(okFilesCurrent, totalFilesLength, customSpaceBetween) {
		
		if (myLayer.allPageItems.length == 0) {
			alert("В документі відсутні лінки, до яких можна приєднати сторінки PDF!");
			exit();
		} else {
			app.scriptPreferences.userInteractionLevel = UserInteractionLevels.NEVER_INTERACT;
			
			const SpaceBetween = customSpaceBetween ? customSpaceBetween : myCurrentDoc.SpaceBetween;
			
			switch (myImposingMethod) {
				case 0: // Кожен вид на окремий лист
					
					var itemsCopies = myCurrentDoc.Params.total ? myCurrentDoc.Params.total : 0;
					
					if (!itemsCopies) {
						for (var e = 0; e < myDocument.allPageItems.length; e++) {
							if (myDocument.allPageItems[e].itemLayer == myLayer && myDocument.allPageItems[e] instanceof Oval) itemsCopies++;
						}
					}
					
					if (!itemsCopies) {
						alert('Помилка обробки документа!');
						exit();
					}					
					
					progress(totalPages * itemsCopies, "Триває розкладка кружечків " + (myCurrentDoc && myCurrentDoc.Diameter > 0 ? myCurrentDoc.Diameter + " мм" : ""));
					
					for (var i = 0; i < okFilesCurrent.length; i++, fileCounter++) {
						var docPagesCount = myDocument.pages.count();						
						progress.message("Опрацьовую файл " + fileCounter + " з " + totalFilesLength);
						var theFile = File(okFilesCurrent[i].theFile);
						var fileName = File.decode(okFilesCurrent[i].theFile.name).split('.').slice(0, -1).join('.');					
						fileName = fileName.replace(/(_?d=)(\d+(,\d+)?) ?(мм|mm)?/i, '');
						if (myFileName.match(PaperNames)) {
							myFileName = myFileName.replace(PaperNames, myCurrentDoc.CutterType.paperName);
						} else {
							const fileNumber = myFileName.match(/\#\d+/);
							if (fileNumber) {
								myFileName = myFileName.replace(fileNumber, fileNumber + '_' + myCurrentDoc.CutterType.paperName);
							} else {
								myFileName = myCurrentDoc.CutterType.paperName + '_' + myFileName;
							}						
						}						
						var pgCount = okFilesCurrent[i].pgCount;
						
						
						// Прибираємо всі сторінки, окрім першої
						if (docPagesCount != 1) {
							myDocument.pages.itemByRange(myDocument.pages.item(1), myDocument.pages.lastItem()).remove();
						}
						
						for (var currentPage = 1, countDone = 0, total = itemsCopies * pgCount; currentPage <= pgCount; currentPage++) {
							
							progress.message("Опрацьовую файл " + fileCounter + " з " + totalFilesLength + " (сторінка " + currentPage + " з " + pgCount + ")");
							app.pdfPlacePreferences.pageNumber = currentPage;

							// Додаємо сторінку, якщо вибрано опцію "Зберегти багатосторінковий файл"
							if (currentPage > 1 && SaveMultipageFilesAsOneFile) {
								progress.details("Додаю сторінку...", false);	
								myDocument.pages.lastItem().duplicate(LocationOptions.AT_END);
							}
							
							var hasLinks = (currentPage > 1) || (myDocument.links.count() - (myCurrentDoc.CutterType.marksGenerate ? 0 : 1) == itemsCopies);										
							
							for (var b = 0, current = -1, allItems = myDocument.pages.lastItem().allPageItems; b < allItems.length; b++) {									
								
								if (allItems[b].isValid && allItems[b].itemLayer == myLayer) {
									
									if (hasLinks && allItems[b] instanceof Graphic) {
										// Якщо на сторінці присутні лінки або це вже 2 сторінка (вона 100% буде з лінками) - перелінковуємо
										countDone++;
                                        current++;
										progress.details("Елемент " + countDone + "/" + total, true);	
										
										allItems[b].relink(theFile);

										progress.increment();
										
									} else if (allItems[b] instanceof Oval) {
										// Якщо на сторінці немає лінків - розміщуємо їх
										countDone++;
										current++;                                        
										progress.details("Елемент " + countDone + "/" + total, true);
										
										allItems[b].place(theFile)[0];
										allItems[b].fit(FitOptions.CONTENT_TO_FRAME);
										
										progress.increment();
										
									}

									if (current == itemsCopies - 1) break;
									
								}										
							}
							
							// Якщо не вибрано опцію "Зберегти багатосторінковий файл" - зберігаємо лише поточну сторінку
							if (!SaveMultipageFilesAsOneFile) {
								progress.details("Експортую PDF...", false);								
								var outputFile = myFileName + "_" + fileName + (pgCount > 1 ? '_#' + currentPage : "") + (myCurrentDoc && myCurrentDoc.Diameter > 0 ? "_D=" + myCurrentDoc.Diameter + "(" + SpaceBetween + ")mm_" + myCurrentDoc.CutterType.label : "_" + myDocument.name.replace('.indd', ''));
								addDocTitle(outputFile);
								myDocument.asynchronousExportFile(ExportFormat.pdfType, File(outputFolder + '/' + outputFile + ".pdf"), false, myPDFExportPreset);
							}
							
						}

						// Якщо вибрано опцію "Зберегти багатосторінковий файл" - зберігаємо багатосторінковий документ
						if (SaveMultipageFilesAsOneFile) {
							progress.details("Експортую PDF...", false);							
							var outputFile = myFileName + "_" + fileName + (myCurrentDoc && myCurrentDoc.Diameter > 0 ? "_D=" + myCurrentDoc.Diameter + "(" + SpaceBetween + ")mm_" + myCurrentDoc.CutterType.label : "_" + myDocument.name.replace('.indd', ''));
							addDocTitle(outputFile);
							myDocument.asynchronousExportFile(ExportFormat.pdfType, File(outputFolder + '/' + outputFile + ".pdf"), false, myPDFExportPreset);
						}

					}	
					
					progress.close();
					
					break;
				case 1:
				    // Вмістити всі види на 1+ лист
					var totalFrames = myCurrentDoc.Params.total ? myCurrentDoc.Params.total : 0;
					var itemsCopies = [];
					var itemsCount = 0;
					var pagesCount = 1;
					var docPagesCount = myDocument.pages.count();
					
					// Прибираємо всі сторінки, окрім першої
					if (docPagesCount != 1) {
						myDocument.pages.itemByRange(myDocument.pages.item(1), myDocument.pages.lastItem()).remove();
                        docPagesCount = myDocument.pages.count();
					}					
					
					if (!totalFrames) {
						for (var e = 0; e < myDocument.allPageItems.length; e++) {
							if (myDocument.allPageItems[e].itemLayer == myLayer && myDocument.allPageItems[e] instanceof Oval) totalFrames++;
						}
					}
					if (!totalFrames) {
						alert('Помилка обробки документа!');
						exit();
					}
					
					if (totalPages >= totalFrames) {
						pagesCount = Math.ceil(totalPages/totalFrames);
						itemsCount = pagesCount * totalFrames;
					} else {
						itemsCount = totalFrames;
					}					

					for (var j = 1, i = 0, push = true; j <= itemsCount; j++, i++) {
						if (i == totalPages) {
							i = 0;
							push = false;
						};
						if (push) {
							itemsCopies.push(1);
						} else {
							itemsCopies[i] += 1;
						};
					}
					
					ProcessNUpDocumentCircles(itemsCopies, itemsCount, pagesCount);
					
					break;
				case 2:
					// Вручну
					var itemsCopies = [];
					var totalFrames = myCurrentDoc.Params.total ? myCurrentDoc.Params.total : 0;
					var pagesCount = 1;
					var docPagesCount = myDocument.pages.count();
					var itemsAddTo = [];
					var itemsMinCount = 0;	
					var itemsCount = 0;						
					
					// Прибираємо всі сторінки, окрім першої
					if (docPagesCount != 1) {
						myDocument.pages.itemByRange(myDocument.pages.item(1), myDocument.pages.lastItem()).remove();
                        docPagesCount = myDocument.pages.count();
					}					
					
					if (!totalFrames) {
						for (var e = 0; e < myDocument.allPageItems.length; e++) {
							if (myDocument.allPageItems[e].itemLayer == myLayer && myDocument.allPageItems[e] instanceof Oval) totalFrames++;
						}
					}
					if (!totalFrames) {
						alert('Помилка обробки документа!');
						exit();
					}
					
					for (var i = 0, items = myImposing.split(','); i < items.length; i++) {
						if (items[i].indexOf('x') != -1) {
							var countCustomPages = items[i].split('x')[0];
							for (var j = 0, value = items[i].split('x')[1]; j < +countCustomPages; j++) {
								itemsCopies.push(value);
							}
						} else {
							itemsCopies.push(items[i]);
						}
					}	
								
					for (var i = 0; i < itemsCopies.length; i++) {
						if (itemsCopies[i].indexOf('+') > 0) {
							itemsAddTo.push(i);
							itemsCopies[i] = +itemsCopies[i].replace('+','');
						}
						itemsMinCount += +itemsCopies[i];
					}

					if (itemsMinCount >= totalFrames) {
						pagesCount = Math.ceil(itemsMinCount/totalFrames);
						itemsCount = pagesCount * totalFrames;
					} else {
						itemsCount = totalFrames;
					}
					
					var i = itemsAddTo.length > 0 ? itemsAddTo[0] : 0;
					for (var j = 1; j <= itemsCount - itemsMinCount; j++) {
						if (i == totalPages) {
							i = itemsAddTo.length > 0 ? itemsAddTo[0] : 0;
						};
						itemsCopies[i] = +itemsCopies[i] + 1;
						if (itemsAddTo.length > 0) {
							i = itemsAddTo[itemsAddTo.indexOf(i) + 1] ? itemsAddTo.indexOf(i) + 1 : itemsAddTo[0];
						} else {
							i++;
						}
						
					}
					
					ProcessNUpDocumentCircles(itemsCopies, itemsCount, pagesCount);
					
					break;
			}		
		}
		
		function ProcessNUpDocumentCircles(itemsCopies, itemsCount, pagesCount) {
			
			progress(itemsCount, "Триває розкладка кружечків " + (myCurrentDoc && myCurrentDoc.Diameter > 0 ? myCurrentDoc.Diameter + " мм" : ""));
			
			for (var i = 0, current = -1, itemIndex = 0, countDone = 0, currentPage = 1, lastItem = -1; i < okFilesCurrent.length; i++, fileCounter++) {
				// Parse the PDF file and extract needed info
				var theFile = File(okFilesCurrent[i].theFile);
				var pgCount = okFilesCurrent[i].pgCount;
				
				for (var page = 1; page <= pgCount; page++, itemIndex++) {
					
					progress.message("Опрацьовую файл " + fileCounter + " з " + totalFilesLength + " (сторінка " + page + " з " + pgCount + ")");
					
					for (var j = 1; j <= itemsCopies[itemIndex]; j++) {
						
						var hasLinks = (currentPage > 1) || (myDocument.links.count() - (myCurrentDoc.CutterType.marksGenerate ? 0 : 1) == (itemsCount / pagesCount));						
						
						for (var b = lastItem + 1, allItems = myDocument.pages.lastItem().allPageItems; b < allItems.length; b++) {

                            lastItem = b;
							
							if (allItems[b].isValid && allItems[b].itemLayer == myLayer) {
                                
                                var isValid = false;
								
								if (hasLinks && allItems[b] instanceof Graphic) {
                                        
									// Якщо на сторінці присутні лінки або це вже 2 сторінка (вона 100% буде з лінками) - перелінковуємо
									countDone++;
									current++;                                    
									progress.details("Елемент " + countDone + "/" + itemsCount, true);	
									
                                    app.pdfPlacePreferences.pageNumber = page;
									allItems[b].relink(theFile);
								
									progress.increment();
                                    
                                    isValid = true;
									
								} else if (allItems[b] instanceof Oval) {
									// Якщо на сторінці немає лінків - розміщуємо їх
                                    
									countDone++;
									current++;                                    
									progress.details("Елемент " + countDone + "/" + itemsCount, true);
									
                                    app.pdfPlacePreferences.pageNumber = page;
									allItems[b].place(theFile)[0];                                    
									allItems[b].fit(FitOptions.CONTENT_TO_FRAME);
									
									progress.increment();
                                    
                                    isValid = true;
									
								}

								if ((current == (itemsCount / pagesCount) - 1) && (currentPage != pagesCount)) {
									// Додаємо сторінку
									progress.details("Додаю сторінку...", false);
									currentPage++;
                                    current = -1;
									lastItem = -1;
									myDocument.pages.lastItem().duplicate(LocationOptions.AT_END);
									bleedsCompensated = true;
								}
								
								if (isValid) break;
								
							}										
						}
					}							
				}
			}
			
			progress.details("Експортую PDF...", false);			
			var fileName = myFileName.replace(/(_?d=)(\d+(,\d+)?) ?(мм|mm)?/i, '');
			if (fileName.match(PaperNames)) {
				fileName = fileName.replace(PaperNames, myCurrentDoc.CutterType.paperName);
			} else {
				const fileNumber = fileName.match(/\#\d+/);
				if (fileNumber) {
					fileName = fileName.replace(fileNumber, fileNumber + '_' + myCurrentDoc.CutterType.paperName);
				} else {
					fileName = myCurrentDoc.CutterType.paperName + '_' + fileName;
				}						
			}				
			var outputFile = fileName + (myCurrentDoc && myCurrentDoc.Diameter > 0 ? "_D=" + myCurrentDoc.Diameter + "(" + SpaceBetween + ")mm_" + myCurrentDoc.CutterType.label : "_" + myDocument.name.replace('.indd', ''));
			addDocTitle(outputFile)
			myDocument.asynchronousExportFile(ExportFormat.pdfType, File(outputFolder + '/' + outputFile + ".pdf"), false, myPDFExportPreset);
		}		

		// All done.

		app.pdfPlacePreferences.pageNumber = 1;
		app.scriptPreferences.userInteractionLevel = UserInteractionLevels.interactWithAll;
		
		app.waitForAllTasks();
		
		// var tasks = app.backgroundTasks;
		// var tasksList = "";
		// var thisTask = tasks.firstItem();
		// while (thisTask.isValid) {
			// tasksList = tasksList + thisTask.name + ": " + thisTask.status + " | ";
			// thisTask = tasks.nextItem(thisTask);
		// };
		// if (tasksList != "") alert(tasksList);
		
		progress.close();	
		myDocument.close(SaveOptions.NO);		
	}

	function ProcessRectangles(okFilesCurrent, totalFilesLength, customRoundCornersValue, customSpaceBetween) {
		
		var RoundCornersValue = customRoundCornersValue ? customRoundCornersValue : myCurrentDoc.RoundCornersValue;
		var IsRoundedCorners = customRoundCornersValue ? true : myCurrentDoc.IsRoundedCorners;
		var SpaceBetween = customSpaceBetween ? customSpaceBetween : myCurrentDoc.SpaceBetween;

		if (myLayer.allPageItems.length == 0) {
			alert("В документі відсутні лінки, до яких можна приєднати сторінки PDF!");
			exit();
		} else {
			app.scriptPreferences.userInteractionLevel = UserInteractionLevels.NEVER_INTERACT;
			var bleedsCompensated = false;			
			
			switch (myImposingMethod) {
				case 0: // Кожен вид на окремий лист
				
					var itemsCopies = myCurrentDoc.Params.total ? myCurrentDoc.Params.total : 0;
					
					if (!itemsCopies) {
						for (var e = 0; e < myDocument.allPageItems.length; e++) {
							if (myDocument.allPageItems[e].itemLayer == myLayer && myDocument.allPageItems[e] instanceof Rectangle) itemsCopies++;
						}
					}
					
					if (!itemsCopies) {
						alert('Помилка обробки документа!');
						exit();
					}	
					
					progress(totalPages * itemsCopies, "Триває розкладка прямокутників " + (myCurrentDoc && myCurrentDoc.RectWidth > 0 ? myCurrentDoc.RectWidth + "x" + myCurrentDoc.RectHeight + " мм" : "") + (IsRoundedCorners && RoundCornersValue > 0 ? " R=" + RoundCornersValue + " мм" : ""));
								
					for (var i = 0; i < okFilesCurrent.length; i++, fileCounter++) {
						var docPagesCount = myDocument.pages.count();						
						progress.message("Опрацьовую файл " + fileCounter + " з " + totalFilesLength);
						var theFile = File(okFilesCurrent[i].theFile);
						var fileName = File.decode(okFilesCurrent[i].theFile.name).split('.').slice(0, -1).join('.');	
						fileName = fileName.replace(/(_?\d+([\.,]\d+)?)([xх])(\d+([\.,]\d+)?)( ?R=?\d+([\.,]\d+)?)? ?(мм|mm)?/i, '');
						if (myFileName.match(PaperNames)) {
							myFileName = myFileName.replace(PaperNames, myCurrentDoc.CutterType.paperName);
						} else {
							const fileNumber = myFileName.match(/\#\d+/);
							if (fileNumber) {
								myFileName = myFileName.replace(fileNumber, fileNumber + '_' + myCurrentDoc.CutterType.paperName);
							} else {
								myFileName = myCurrentDoc.CutterType.paperName + '_' + myFileName;
							}						
						}	
						var pgCount = okFilesCurrent[i].pgCount;
						
						// Прибираємо всі сторінки, окрім першої
						if (docPagesCount != 1) {
							myDocument.pages.itemByRange(myDocument.pages.item(1), myDocument.pages.lastItem()).remove();
						}
						
						for (var currentPage = 1, countDone = 0, total = itemsCopies * pgCount; currentPage <= pgCount; currentPage++) {
							
							progress.message("Опрацьовую файл " + fileCounter + " з " + totalFilesLength + " (сторінка " + currentPage + " з " + pgCount + ")");
							app.pdfPlacePreferences.pageNumber = currentPage;

							// Додаємо сторінку, якщо вибрано опцію "Зберегти багатосторінковий файл"
							if (currentPage > 1 && SaveMultipageFilesAsOneFile) {
								progress.details("Додаю сторінку...", false);	
								myDocument.pages.lastItem().duplicate(LocationOptions.AT_END);
							}
							
							var hasLinks = (currentPage > 1) || (myDocument.links.count() - (myCurrentDoc.CutterType.marksGenerate ? 0 : 1) == itemsCopies);										
							
							for (var b = 0, current = -1, allItems = myDocument.pages.lastItem().allPageItems; b < allItems.length; b++) {									
								
								if (allItems[b].isValid && allItems[b].itemLayer == myLayer) {
									
									if (hasLinks && allItems[b] instanceof Graphic) {
										// Якщо на сторінці присутні лінки або це вже 2 сторінка (вона 100% буде з лінками) - перелінковуємо
										countDone++;
                                        current++;
										progress.details("Елемент " + countDone + "/" + total, true);	
										
										allItems[b].relink(theFile);

										progress.increment();
										
									} else if (allItems[b] instanceof Rectangle) {
										// Якщо на сторінці немає лінків - розміщуємо їх
										countDone++;
										current++;                                        
										progress.details("Елемент " + countDone + "/" + total, true);
										
										allItems[b].place(theFile)[0];
										if (!bleedsCompensated || SpaceBetween > 0) allItems[b].fit(FitOptions.CONTENT_TO_FRAME);
										
										// Компенсація повороту макета
										if (myCurrentDoc.Params.rotationCompensation) {
											var index = current < myCurrentDoc.Params.rotationCompensation.length ? current : (current - myCurrentDoc.Params.rotationCompensation.length * Math.floor(current / myCurrentDoc.Params.rotationCompensation.length));
											if (myCurrentDoc.Params.rotationCompensation[index] != 0) {
												allItems[b].graphics.everyItem().rotationAngle = myCurrentDoc.Params.rotationCompensation[index];
												allItems[b].fit(FitOptions.CONTENT_TO_FRAME);
											}
										}										
										
										// Компенсація накладання при роздвижці 0
										if (SpaceBetween == 0 && myCurrentDoc.Params.bleedCompensation && !bleedsCompensated) {
											var index = current < myCurrentDoc.Params.bleedCompensation.length ? current : (current - myCurrentDoc.Params.bleedCompensation.length * Math.floor(current / myCurrentDoc.Params.bleedCompensation.length));
											var curBounds = allItems[b].geometricBounds;
											allItems[b].geometricBounds = [
												curBounds[0] + myCurrentDoc.Params.bleedCompensation[index][0],
												curBounds[1] + myCurrentDoc.Params.bleedCompensation[index][1],
												curBounds[2] + myCurrentDoc.Params.bleedCompensation[index][2],
												curBounds[3] + myCurrentDoc.Params.bleedCompensation[index][3]
											];
										}
										
										progress.increment();
										
									}

									if (current == itemsCopies - 1) break;
									
								}										
							}
							
							bleedsCompensated = true;
							
							// Якщо не вибрано опцію "Зберегти багатосторінковий файл" - зберігаємо лише поточну сторінку
							if (!SaveMultipageFilesAsOneFile) {
								progress.details("Експортую PDF...", false);								
								var outputFile = myFileName + "_" + fileName + (pgCount > 1 ? '_#' + currentPage : "") + (myCurrentDoc && myCurrentDoc.RectWidth > 0 ? "_" + myCurrentDoc.RectWidth + "x" + myCurrentDoc.RectHeight + (IsRoundedCorners && RoundCornersValue > 0 ? " R=" + RoundCornersValue + " " : "") + "(" + SpaceBetween + ")mm_" + myCurrentDoc.CutterType.label : "_" + myDocument.name.replace('.indd', ''));
								addDocTitle(outputFile);
								myDocument.asynchronousExportFile(ExportFormat.pdfType, File(outputFolder + '/' + outputFile + ".pdf"), false, myPDFExportPreset);
							}
							
						}

						// Якщо вибрано опцію "Зберегти багатосторінковий файл" - зберігаємо багатосторінковий документ
						if (SaveMultipageFilesAsOneFile) {
							progress.details("Експортую PDF...", false);							
							var outputFile = myFileName + "_" + fileName + (myCurrentDoc && myCurrentDoc.RectWidth > 0 ? "_" + myCurrentDoc.RectWidth + "x" + myCurrentDoc.RectHeight + (IsRoundedCorners && RoundCornersValue > 0 ? " R=" + RoundCornersValue + " " : "") + "(" + SpaceBetween + ")mm_" + myCurrentDoc.CutterType.label : "_" + myDocument.name.replace('.indd', ''));
							addDocTitle(outputFile);
							
							myDocument.asynchronousExportFile(ExportFormat.pdfType, File(outputFolder + '/' + outputFile + ".pdf"), false, myPDFExportPreset);
						}
						
					}	
					
					progress.close();
					
					break;
				case 1:
				    // Вмістити всі види на 1+ лист
		
					var itemsCopies = [];
					var itemsCount = 0;
					var docPagesCount = myDocument.pages.count();
					var pagesCount = 1;
					var totalFrames = myCurrentDoc.Params.total ? myCurrentDoc.Params.total : 0;
                    
					// Прибираємо всі сторінки, окрім першої
					if (docPagesCount != 1) {
						myDocument.pages.itemByRange(myDocument.pages.item(1), myDocument.pages.lastItem()).remove();
                        docPagesCount = myDocument.pages.count();
					}                    

					if (!totalFrames) {
						for (var e = 0; e < myDocument.allPageItems.length; e++) {
							if (myDocument.allPageItems[e].itemLayer == myLayer && myDocument.allPageItems[e] instanceof Rectangle) totalFrames++;
						}
					}
					
					if (!totalFrames) {
						alert('Помилка обробки документа!');
						exit();
					}
					
					if (totalPages >= totalFrames) {
						pagesCount = Math.ceil(totalPages/totalFrames);
						itemsCount = pagesCount * totalFrames;
					} else {
						itemsCount = totalFrames;
					}					

					for (var j = 1, i = 0, push = true; j <= itemsCount; j++, i++) {
						if (i == totalPages) {
							i = 0;
							push = false;
						};
						if (push) {
							itemsCopies.push(1);
						} else {
							itemsCopies[i] += 1;
						};
					}
					
					ProcessNUpDocumentRectangles(itemsCopies, itemsCount, pagesCount);
					
					break;
				case 2:
					// Вручну
                    var itemsCopies = [];
                    var docPagesCount = myDocument.pages.count();
                    var pagesCount = 1;
					var totalFrames = myCurrentDoc.Params.total ? myCurrentDoc.Params.total : 0;
					var itemsAddTo = [];
					var itemsMinCount = 0;	
					var itemsCount = 0;                    
                      
					// Прибираємо всі сторінки, окрім першої
					if (docPagesCount != 1) {
						myDocument.pages.itemByRange(myDocument.pages.item(1), myDocument.pages.lastItem()).remove();
                        docPagesCount = myDocument.pages.count();
					}                       
                      
					if (!totalFrames) {
						for (var e = 0; e < myDocument.allPageItems.length; e++) {
							if (myDocument.allPageItems[e].itemLayer == myLayer && myDocument.allPageItems[e] instanceof Rectangle) totalFrames++;
						}
					}
                
					if (!totalFrames) {
						alert('Помилка обробки документа!');
						exit();
					}                		
					
					for (var i = 0, items = myImposing.split(','); i < items.length; i++) {
						if (items[i].indexOf('x') != -1) {
							var countCustomPages = items[i].split('x')[0];
							for (var j = 0, value = items[i].split('x')[1]; j < +countCustomPages; j++) {
								itemsCopies.push(value);
							}
						} else {
							itemsCopies.push(items[i]);
						}
					}	

					for (var i = 0; i < itemsCopies.length; i++) {
						if (itemsCopies[i].indexOf('+') > 0) {
							itemsAddTo.push(i);
							itemsCopies[i] = +itemsCopies[i].replace('+','');
						}
						itemsMinCount += +itemsCopies[i];
					}
					
					if (itemsMinCount >= totalFrames) {
						pagesCount = Math.ceil(itemsMinCount/totalFrames);
						itemsCount = pagesCount * totalFrames;
					} else {
						itemsCount = totalFrames;
					}
					
					var i = itemsAddTo.length > 0 ? itemsAddTo[0] : 0;
					for (var j = 1; j <= itemsCount - itemsMinCount; j++) {
						if (i == totalPages) {
							i = itemsAddTo.length > 0 ? itemsAddTo[0] : 0;
						};
						itemsCopies[i] = +itemsCopies[i] + 1;
						if (itemsAddTo.length > 0) {
							i = itemsAddTo[itemsAddTo.indexOf(i) + 1] ? itemsAddTo.indexOf(i) + 1 : itemsAddTo[0];
						} else {
							i++;
						}
						
					}
					
					ProcessNUpDocumentRectangles(itemsCopies, itemsCount, pagesCount);
					
					break;
			}		
		}
		
		function ProcessNUpDocumentRectangles(itemsCopies, itemsCount, pagesCount) {
			
			progress(itemsCount, "Триває розкладка прямокутників " + (myCurrentDoc && myCurrentDoc.RectWidth > 0 ? myCurrentDoc.RectWidth + "x" + myCurrentDoc.RectHeight + " мм" : "") + (IsRoundedCorners && RoundCornersValue > 0 ? " R=" + RoundCornersValue + " мм" : ""));

			for (var i = 0, current = -1, itemIndex = 0, countDone = 0, currentPage = 1, lastItem = -1; i < okFilesCurrent.length; i++, fileCounter++) {
				// Parse the PDF file and extract needed info
				var theFile = File(okFilesCurrent[i].theFile);
				var pgCount = okFilesCurrent[i].pgCount;
				
				for (var page = 1; page <= pgCount; page++, itemIndex++) {
					
					progress.message("Опрацьовую файл " + fileCounter + " з " + totalFilesLength + " (сторінка " + page + " з " + pgCount + ")");
					
					for (var j = 1; j <= itemsCopies[itemIndex]; j++) {
						
						var hasLinks = (currentPage > 1) || (myDocument.links.count() - (myCurrentDoc.CutterType.marksGenerate ? 0 : 1) == (itemsCount / pagesCount));						
						
						for (var b = lastItem + 1, allItems = myDocument.pages.lastItem().allPageItems; b < allItems.length; b++) {

                            lastItem = b;
							
							if (allItems[b].isValid && allItems[b].itemLayer == myLayer) {
                                
                                var isValid = false;
								
								if (hasLinks && allItems[b] instanceof Graphic) {
                                        
									// Якщо на сторінці присутні лінки або це вже 2 сторінка (вона 100% буде з лінками) - перелінковуємо
									countDone++;
									current++;                                    
									progress.details("Елемент " + countDone + "/" + itemsCount, true);	
									
                                    app.pdfPlacePreferences.pageNumber = page;
									allItems[b].relink(theFile);
								
									progress.increment();
                                    
                                    isValid = true;
									
								} else if (allItems[b] instanceof Rectangle) {
									// Якщо на сторінці немає лінків - розміщуємо їх
                                    
									countDone++;
									current++;                                    
									progress.details("Елемент " + countDone + "/" + itemsCount, true);
									
                                    app.pdfPlacePreferences.pageNumber = page;
									allItems[b].place(theFile)[0];
                                    
									if (!bleedsCompensated || SpaceBetween > 0) allItems[b].fit(FitOptions.CONTENT_TO_FRAME);
									
									// Компенсація повороту макета
									if (myCurrentDoc.Params.rotationCompensation) {
										var index = current < myCurrentDoc.Params.rotationCompensation.length ? current : (current - myCurrentDoc.Params.rotationCompensation.length * Math.floor(current / myCurrentDoc.Params.rotationCompensation.length));
										if (myCurrentDoc.Params.rotationCompensation[index] != 0) {
											allItems[b].graphics.everyItem().rotationAngle = myCurrentDoc.Params.rotationCompensation[index];
											allItems[b].fit(FitOptions.CONTENT_TO_FRAME);
										}
									}										
									
									// Компенсація накладання при роздвижці 0
									if (SpaceBetween == 0 && myCurrentDoc.Params.bleedCompensation && !bleedsCompensated) {
										var index = current < myCurrentDoc.Params.bleedCompensation.length ? current : (current - myCurrentDoc.Params.bleedCompensation.length * Math.floor(current / myCurrentDoc.Params.bleedCompensation.length));
										var curBounds = allItems[b].geometricBounds;
										allItems[b].geometricBounds = [
											curBounds[0] + myCurrentDoc.Params.bleedCompensation[index][0],
											curBounds[1] + myCurrentDoc.Params.bleedCompensation[index][1],
											curBounds[2] + myCurrentDoc.Params.bleedCompensation[index][2],
											curBounds[3] + myCurrentDoc.Params.bleedCompensation[index][3]
										];
									}
									
									progress.increment();
                                    
                                    isValid = true;
									
								}

								if ((current == (itemsCount / pagesCount) - 1) && (currentPage != pagesCount)) {
									// Додаємо сторінку
									progress.details("Додаю сторінку...", false);
									currentPage++;
                                    current = -1;
									lastItem = -1;
									myDocument.pages.lastItem().duplicate(LocationOptions.AT_END);
									bleedsCompensated = true;
								}
								
								if (isValid) break;
								
							}										
						}
					}							
				}
			}

			progress.details("Експортую PDF...", false);			
			var fileName = myFileName.replace(/(_?\d+([\.,]\d+)?)([xх])(\d+([\.,]\d+)?)( ?R=?\d+([\.,]\d+)?)? ?(мм|mm)?/i, '');
			if (fileName.match(PaperNames)) {
				fileName = fileName.replace(PaperNames, myCurrentDoc.CutterType.paperName);
			} else {
				const fileNumber = fileName.match(/\#\d+/);
				if (fileNumber) {
					fileName = fileName.replace(fileNumber, fileNumber + '_' + myCurrentDoc.CutterType.paperName);
				} else {
					fileName = myCurrentDoc.CutterType.paperName + '_' + fileName;
				}						
			}				
			var outputFile = fileName + (myCurrentDoc && myCurrentDoc.RectWidth > 0 ? "_" + myCurrentDoc.RectWidth + "x" + myCurrentDoc.RectHeight + (IsRoundedCorners && RoundCornersValue > 0 ? " R=" + RoundCornersValue + " " : "") + "(" + SpaceBetween + ")mm_" + myCurrentDoc.CutterType.label : "_" + myDocument.name.replace('.indd', ''));
			addDocTitle(outputFile);
			myDocument.asynchronousExportFile(ExportFormat.pdfType, File(outputFolder + '/' + outputFile + ".pdf"), false, myPDFExportPreset);
			
		}		

		// All done.

		app.pdfPlacePreferences.pageNumber = 1;
		app.scriptPreferences.userInteractionLevel = UserInteractionLevels.interactWithAll;	
		
		app.waitForAllTasks();
		
		// var tasks = app.backgroundTasks;
		// var tasksList = "";
		// var thisTask = tasks.firstItem();
		// while (thisTask.isValid) {
			// tasksList = tasksList + thisTask.name + ": " + thisTask.status + ", alerts: " + thisTask.alerts.toSource() + " | ";
			// thisTask = tasks.nextItem(thisTask);
		// };
		// if (tasksList != "") alert(tasksList);
		
		progress.close();
		myDocument.close(SaveOptions.NO);
	}

	if (badFiles && badFiles.length) {
		// BadFilesListWindow
		// ===================
		var BadFilesListWindow = new Window("dialog"); 
			BadFilesListWindow.text = "Наступні файли не було оброблено!"; 
			BadFilesListWindow.orientation = "column"; 
			BadFilesListWindow.alignChildren = ["left","top"];
			BadFilesListWindow.preferredSize.width = 420; 			
			BadFilesListWindow.spacing = 10; 
			BadFilesListWindow.margins = 5;

		var FilesGroup = BadFilesListWindow.add("group", undefined, {name: "FilesGroup"}); 
			FilesGroup.orientation = "column"; 
			FilesGroup.alignChildren = ["left","center"]; 
			FilesGroup.spacing = 10; 
			FilesGroup.margins = 0; 
			FilesGroup.alignment = ["fill","top"]; 			

		var FilesNameList = FilesGroup.add('edittext {properties: {name: "FilesNameList", readonly: true, multiline: true, scrollable: true}}'); 
			FilesNameList.preferredSize.width = 400; 
			FilesNameList.preferredSize.height = 100;
			FilesNameList.text = "";
			for (var i = 0; i < badFiles.length; i++) {			
				FilesNameList.text += File.decode(badFiles[i].theFile.name) + "\n";
			}			
		var ButtonsGroup = BadFilesListWindow.add("group", undefined, {name: "ButtonsGroup"}); 
			BadFilesListWindow.orientation = "column"; 
			BadFilesListWindow.alignChildren = ["right","center"]; 
			BadFilesListWindow.spacing = 10; 
			BadFilesListWindow.margins = 15; 
			BadFilesListWindow.alignment = ["fill","top"]; 

		var Ok = ButtonsGroup.add("button", undefined, undefined, {name: "Ok"}); 
			Ok.text = "Зрозуміло";
			Ok.onClick = function() {
				BadFilesListWindow.close(0);
				BadFilesListWindow = null;
			}
			
		BadFilesListWindow.show();
	}
	
	app.preflightOptions.preflightOff = lastAppPrefs.preflightOff;
	app.displayPerformancePreferences.defaultDisplaySettings = lastAppPrefs.defaultDisplaySettings;
	app.liveScreenDrawing = lastAppPrefs.liveScreenDrawing;
	app.panels.itemByName('Pages').pagesThumbnails = lastAppPrefs.pagesThumbnails;
	app.panels.itemByName('Pages').mastersThumbnails = lastAppPrefs.mastersThumbnails;
	for (var i = 1; i <= app.displaySettings.count(); i++) {
		if (app.displaySettings.item(i).isValid) {
			if (app.displaySettings.item(i).raster) app.displaySettings.item(i).raster = lastAppPrefs.raster[i];
			if (app.displaySettings.item(i).transparency) app.displaySettings.item(i).transparency = lastAppPrefs.transparency[i];
			if (app.displaySettings.item(i).vector) app.displaySettings.item(i).vector = lastAppPrefs.vector[i];			
		}
	}		

}

// Додаємо назву документа текстовим блоком

function addDocTitle(title){
	if (!AddFileNameTitle) return false;
	removeDocTitle();
	var position = myDocument.documentPreferences.pageWidth <= myDocument.documentPreferences.pageHeight ? "top" : "left";
	var geometricBounds, rotation;
	if (position == "top") {
		geometricBounds = [
			7, 7, 14, myDocument.documentPreferences.pageWidth - 7
		];
		rotation = 0;
	} else {
		geometricBounds = [
			7, 7, myDocument.documentPreferences.pageHeight - 7, 14
		];
		rotation = 90;
	}
	var TitleLayer = myDocument.layers.add({
		'name': TITLELayer
	});
	for (var i = 0; i < myDocument.pages.length; i++) {
		var thisPage = myDocument.pages[i];
		var pageTitle = thisPage.textFrames.add(TitleLayer, LocationOptions.AT_END, {
			'contents': title + (myDocument.pages.length > 0 ? (" :: Page " + (i + 1) + " of " + myDocument.pages.length) : ""),
			'geometricBounds': geometricBounds,
			'textFramePreferences': {
				'verticalJustification': VerticalJustification.TOP_ALIGN
			}
		});
		pageTitle.paragraphs.firstItem().properties = {
			'justification': Justification.CENTER_ALIGN,
			'appliedFont': 'Tahoma',
			'pointSize': 10,
			'fillColor': 'Black',
			'fillTint': 99.56,			
		};
		if (rotation != 0) {
			pageTitle.absoluteRotationAngle = rotation;
			pageTitle.geometricBounds = geometricBounds;
		}
	}
}

// Прибираємо назву документа текстовим блоком

function removeDocTitle(){
	var TitleLayer = myDocument.layers.itemByName(TITLELayer);
	if (TitleLayer.isValid) TitleLayer.remove();
}

// Вікно відображення прогресу

function progress(steps, title) {

    var bar;

    var text;

    var window;
	
    var details;
	
	var timer = {
		startedAt: new Date(),
		totalSpent: 0,
		timeLeft: 0
	};

    window = new Window("window", title || "", undefined, {closeButton: false});

    text = window.add("statictext");
	
	details = window.add("statictext");

    text.preferredSize = [450, -1]; // 450 pixels wide, default height.
	
    details.preferredSize = [450, -1]; // 450 pixels wide, default height.

    if (steps) {

        bar = window.add("progressbar", undefined, 0, steps);

        bar.preferredSize = [450, -1]; // 450 pixels wide, default height.
		
		timer.startedAt = new Date();
		timer.totalSpent = 0;
		timer.timeLeft = 0;

    }

    progress.close = function () {

        window.close();

    };

    progress.increment = function () {
		
		if (bar.value == 0) timer.startedAt = new Date();		
		
        bar.value++;
		
		timer.totalSpent = new Date() - timer.startedAt;
			
		timer.timeLeft = (bar.maxvalue * timer.totalSpent) / bar.value - timer.totalSpent;			

    };

    progress.message = function (message) {

		if (message) text.text = message;
		if (!message) text.text = "";
		
		details.text = "";

    };
	
    progress.details = function (detailsText, showTimeleft) {
		
		if (bar.value == 0) timer.startedAt = new Date();
		
		if (!detailsText) detailsText = "";
		
		if (showTimeleft) detailsText = detailsText + progress.timeleft();		
		
		details.text = detailsText;

    };
	
	progress.timeleft = function () {		
		
		if (!timer.timeLeft) return "";
		
		var milliseconds = Math.floor((timer.timeLeft % 1000) / 100),
			seconds = Math.floor((timer.timeLeft / 1000) % 60),
			minutes = Math.floor((timer.timeLeft / (1000 * 60)) % 60),
			hours = Math.floor((timer.timeLeft / (1000 * 60 * 60)) % 24);

			hours = (hours < 10) ? "0" + hours : hours;
			minutes = (minutes < 10) ? "0" + minutes : minutes;
			seconds = (seconds < 10) ? "0" + seconds : seconds;

		return " (залишилось ~ " + (hours > 0 ? hours + "год " : "") + (hours > 0 || minutes > 0 ? minutes + "хв " : "") + seconds + "сек)";
		
	}

    window.show();

}

// Створення шаблону документа для розкладки кружечків

function CreateCustomDocCircles(myCurrentDoc, customSpaceBetween) {
	
	var Params = myCurrentDoc.Params;
	
	const SpaceBetween = customSpaceBetween ? customSpaceBetween : myCurrentDoc.SpaceBetween;
	
	progress(4, "Підготовка документа");
	progress.message("Готую розкладку " + Params.Diameter + " мм");
	progress.details("Створюю новий документ...", false);
	myDocument = app.documents.add();
	myDocument.documentPreferences.properties = {
		'pageOrientation': myCurrentDoc.CutterType.pageOrientation,
		'documentBleedTopOffset': 0,
		'slugTopOffset': 0,
		'documentSlugUniformSize': true,
		'facingPages': false,
		'intent': DocumentIntentOptions.PRINT_INTENT,
		'pageHeight': Params.widthSheet,
		'pageWidth': Params.heightSheet,
		'pagesPerDocument': 1
		
	}
	var firstPage = myDocument.pages.firstItem();
	firstPage.marginPreferences.properties = {
		'top': myCurrentDoc.CutterType.marginTop,
		'bottom': myCurrentDoc.CutterType.marginBottom,
		'left': myCurrentDoc.CutterType.marginLeft,
		'right': myCurrentDoc.CutterType.marginRight	
	}
	myLayer = myDocument.layers.firstItem();
	myLayer.name = PRINTLayer;
	
	var MarksLayer = myDocument.layers.add({
		'name': PLOTTERLayer
	});	

	if (myCurrentDoc.CutterType.marksGenerate == false) {
		
		progress.details("Імпортую мітки...", false);	

		var MarksPlacement = firstPage.rectangles.add(MarksLayer, LocationOptions.AT_BEGINNING, {
			'contentType': ContentType.GRAPHIC_TYPE,
			'strokeWeight': 0,
			'strokeColor': 'None',
			'frameFittingOptions': {
				'properties': {
					'fittingAlignment': AnchorPoint.CENTER_ANCHOR,
					'fittingOnEmptyFrame': EmptyFrameFittingOptions.CONTENT_TO_FRAME
				}
			},
			'geometricBounds': [0, 0, myCurrentDoc.CutterType.heightSheet, myCurrentDoc.CutterType.widthSheet]
		});		
		
		app.pdfPlacePreferences.transparentBackground = true;			
		MarksPlacement.place(File(myCurrentDoc.CutterType.marksFile))[0];			
		app.pdfPlacePreferences.transparentBackground = false;	

		progress.increment();
		
	}	
	
	progress.details("Додаю елементи...", false);
	
	var documentRotated = Params.widthSheet != myCurrentDoc.CutterType.widthSheet;
	
	var Bleeds = myCurrentDoc.IsZeroBleeds ? 0 : myCurrentDoc.CutterType.minSpaceBetween / 2;

	switch (Params.method) {
		case 1:
			var totalWidth = Params.Diameter + Params.DistanceXCenters * (Params.countXBig - 1);
			var totalHeight = Params.Diameter + Params.DistanceYCenters * (Params.countYBigRivni - 1);			
			var horizontalOffset = (Params.widthFrame - totalWidth) / 2 + myCurrentDoc.CutterType.marginLeft;
			var verticalOffset = (Params.heightFrame - totalHeight) / 2 + myCurrentDoc.CutterType.marginTop;
			for (var i = 0; i < Params.countYBigRivni; i++) {
				if (i % 2 != 0) {
					// Odd row
					for (var j = Params.countXBig - 1; j >= 0; j--) {
						firstPage.ovals.add(myLayer, LocationOptions.AT_END, {
							'strokeColor': 'None',							
							'fillColor': 'None',							
							'geometricBounds': [
								verticalOffset + Params.DistanceYCenters * i,
								horizontalOffset + Params.DistanceXCenters * j,
								verticalOffset + Params.DistanceYCenters * i + Params.Diameter,
								horizontalOffset + Params.DistanceXCenters * j + Params.Diameter
							]
						});						
					}					
				} else {
					// Even row
					for (var j = 0; j < Params.countXBig; j++) {
						firstPage.ovals.add(myLayer, LocationOptions.AT_END, {
							'strokeColor': 'None',							
							'fillColor': 'None',	
							'geometricBounds': [
								verticalOffset + Params.DistanceYCenters * i,
								horizontalOffset + Params.DistanceXCenters * j,
								verticalOffset + Params.DistanceYCenters * i + Params.Diameter,
								horizontalOffset + Params.DistanceXCenters * j + Params.Diameter
							]
						});						
					}					
				}

			}				
			break;
		case 2:
			var totalWidthBig = Params.Diameter + Params.DistanceXCenters * (Params.countXBig - 1);
			var totalWidthSmall = Params.Diameter + Params.DistanceXCenters * (Params.countXSmall - 1);
			if (Params.DistanceYCenters > Params.Diameter / 2 + SpaceBetween) {
				var DistanceYCentersCurrent = Params.DistanceYCenters;
				var totalHeight = Params.Diameter + Params.DistanceYCenters * (Params.countYBigPerekladom + Params.countYSmall - 1);
			} else {
				var DistanceYCentersCurrent = Params.Diameter + SpaceBetween;
				var totalHeight = DistanceYCentersCurrent * Params.countYBigPerekladom + Params.DistanceYCenters * (Params.countYSmall - Params.countYBigPerekladom + 1);			
			}
			if (!documentRotated) {
				if (Params.countXBig == 1 && Params.countXSmall == 1) {
					// Якщо випадок коли у вели кому та маленькому ряду по 1 шт - це значить, що зміщення у них симетричне відносно полів документа
					var horizontalOffsetBig = myCurrentDoc.CutterType.marginLeft;
					var horizontalOffsetSmall = (Params.widthFrame - totalWidthSmall) + myCurrentDoc.CutterType.marginLeft;					
				} else {
					var horizontalOffsetBig = (Params.widthFrame - totalWidthBig) / 2 + myCurrentDoc.CutterType.marginLeft;
					var horizontalOffsetSmall = (Params.widthFrame - totalWidthSmall) / 2 + myCurrentDoc.CutterType.marginLeft;
				}							
				var verticalOffset = (Params.heightFrame - totalHeight) / 2 + myCurrentDoc.CutterType.marginTop;		
				
				var countSmall = 0;
				var countBig = 0;
				for (var i = 0; i < Params.countYBigPerekladom + Params.countYSmall; i++) {
					// Small & odd row
					if (i % 2 != 0 && countSmall < Params.countYSmall) {
						for (var j = Params.countXSmall - 1; j >= 0; j--) {
							if (Params.DistanceYCenters > Params.Diameter / 2 + SpaceBetween) {
								firstPage.ovals.add(myLayer, LocationOptions.AT_END, {
									'strokeColor': 'None',							
									'fillColor': 'None',	
									'geometricBounds': [
										verticalOffset + Params.DistanceYCenters * i,
										horizontalOffsetSmall + Params.DistanceXCenters * j,
										verticalOffset + Params.DistanceYCenters * i + Params.Diameter,
										horizontalOffsetSmall + Params.DistanceXCenters * j + Params.Diameter
									]
								});									
							} else {
								firstPage.ovals.add(myLayer, LocationOptions.AT_END, {
									'strokeColor': 'None',							
									'fillColor': 'None',	
									'geometricBounds': [
										verticalOffset + Params.DistanceYCenters + DistanceYCentersCurrent * countSmall,
										horizontalOffsetSmall + Params.DistanceXCenters * j,
										verticalOffset + Params.DistanceYCenters + DistanceYCentersCurrent * countSmall + Params.Diameter,
										horizontalOffsetSmall + Params.DistanceXCenters * j + Params.Diameter
									]
								});									
							}					
						}
						countSmall++;					
					} else {
						// Big & even row
						for (var j = 0; j < Params.countXBig; j++) {
							if (Params.DistanceYCenters > Params.Diameter / 2 + SpaceBetween) {
								firstPage.ovals.add(myLayer, LocationOptions.AT_END, {
									'strokeColor': 'None',							
									'fillColor': 'None',	
									'geometricBounds': [
										verticalOffset + Params.DistanceYCenters * i,
										horizontalOffsetBig + Params.DistanceXCenters * j,
										verticalOffset + Params.DistanceYCenters * i + Params.Diameter,
										horizontalOffsetBig + Params.DistanceXCenters * j + Params.Diameter
									]
								});									
							} else {
								firstPage.ovals.add(myLayer, LocationOptions.AT_END, {
									'strokeColor': 'None',							
									'fillColor': 'None',	
									'geometricBounds': [
										verticalOffset + DistanceYCentersCurrent * countBig,
										horizontalOffsetBig + Params.DistanceXCenters * j,
										verticalOffset + DistanceYCentersCurrent * countBig + Params.Diameter,
										horizontalOffsetBig + Params.DistanceXCenters * j + Params.Diameter
									]
								});									
							}					
						}
						countBig++;
					}

				}				
			} else {

				if (Params.countXBig == 1 && Params.countXSmall == 1) {
					// Якщо випадок коли у вели кому та маленькому ряду по 1 шт - це значить, що зміщення у них симетричне відносно полів документа
					var verticalOffsetBig = myCurrentDoc.CutterType.marginTop;
					var verticalOffsetSmall = (Params.widthFrame - totalWidthSmall) + myCurrentDoc.CutterType.marginTop;					
				} else {
					var verticalOffsetBig = (Params.widthFrame - totalWidthBig) / 2 + myCurrentDoc.CutterType.marginTop;
					var verticalOffsetSmall = (Params.widthFrame - totalWidthSmall) / 2 + myCurrentDoc.CutterType.marginTop;
				}			
				var horizontalOffset = (Params.heightFrame - totalHeight) / 2 + myCurrentDoc.CutterType.marginLeft;
				var countSmall = 0;
				var countBig = 0;
				for (var i = 0; i < Params.countYBigPerekladom + Params.countYSmall; i++) {
					// Small row
					if (i % 2 != 0 && countSmall < Params.countYSmall) {
						for (var j = Params.countXSmall - 1; j >= 0 ; j--) {
							if (Params.DistanceYCenters > Params.Diameter / 2 + SpaceBetween) {
								firstPage.ovals.add(myLayer, LocationOptions.AT_END, {
									'strokeColor': 'None',							
									'fillColor': 'None',	
									'geometricBounds': [
										verticalOffsetSmall + Params.DistanceXCenters * j,
										horizontalOffset + DistanceYCentersCurrent * i,
										verticalOffsetSmall + Params.DistanceXCenters * j + Params.Diameter,
										horizontalOffset + DistanceYCentersCurrent * i + Params.Diameter
									]
								});									
							} else {
								firstPage.ovals.add(myLayer, LocationOptions.AT_END, {
									'strokeColor': 'None',							
									'fillColor': 'None',	
									'geometricBounds': [
										verticalOffsetSmall + Params.DistanceXCenters * j,
										horizontalOffset + Params.DistanceYCenters + DistanceYCentersCurrent * countSmall,
										verticalOffsetSmall + Params.DistanceXCenters * j + Params.Diameter,
										horizontalOffset + Params.DistanceYCenters + DistanceYCentersCurrent * countSmall + Params.Diameter
									]
								});									
							}
						}
						countSmall++;					
					} else {
						// Big row
						for (var j = 0; j < Params.countXBig; j++) {
							if (Params.DistanceYCenters > Params.Diameter / 2 + SpaceBetween) {
								firstPage.ovals.add(myLayer, LocationOptions.AT_END, {
									'strokeColor': 'None',							
									'fillColor': 'None',	
									'geometricBounds': [
									verticalOffsetBig + Params.DistanceXCenters * j,
									horizontalOffset + DistanceYCentersCurrent * i,
									verticalOffsetBig + Params.DistanceXCenters * j + Params.Diameter,
									horizontalOffset + DistanceYCentersCurrent * i + Params.Diameter
									]
								});									
							} else {
								firstPage.ovals.add(myLayer, LocationOptions.AT_END, {
									'strokeColor': 'None',							
									'fillColor': 'None',	
									'geometricBounds': [
									verticalOffsetBig + Params.DistanceXCenters * j,
									horizontalOffset + DistanceYCentersCurrent * countBig,
									verticalOffsetBig + Params.DistanceXCenters * j + Params.Diameter,
									horizontalOffset + DistanceYCentersCurrent * countBig + Params.Diameter
									]
								});									
							}					
						}
						countBig++;						
					}
				}
			}	
			break;
		case 3:
			var totalWidthBig = Params.Diameter + Params.DistanceXCenters * (Params.countXBig - 1);
			var totalWidthSmall = Params.Diameter + Params.DistanceXCenters * (Params.countXSmall - 1);
			var DistanceYCentersBigBig = Params.Diameter + SpaceBetween;						
			var countBigSmallRows = Params.countYBigPerekladom + Params.countYSmall - 1;
			if (Params.DistanceYCenters > (Params.Diameter / 2 + SpaceBetween)) {
				var totalHeight = (DistanceYCentersBigBig * Params.countYBigRivni) + (Params.DistanceYCenters * countBigSmallRows) + Params.Diameter;
			} else {
				var DistanceYCentersCurrent = Params.Diameter + SpaceBetween;
				var totalHeight = (DistanceYCentersBigBig * Params.countYBigRivni) + DistanceYCentersCurrent * Params.countYBigPerekladom + Params.DistanceYCenters * (Params.countYSmall - Params.countYBigPerekladom + 1);
			}		

			if (!documentRotated) {
				var horizontalOffsetBig = (Params.widthFrame - totalWidthBig) / 2 + myCurrentDoc.CutterType.marginLeft;
				var horizontalOffsetSmall = (Params.widthFrame - totalWidthSmall) / 2 + myCurrentDoc.CutterType.marginLeft;	
				var verticalOffset = (Params.heightFrame - totalHeight) / 2 + myCurrentDoc.CutterType.marginTop;
				var isSmall = true;
				var k = 0;
				var countSmall = 0;
				var countBig = 0;			
				for (var i = 0; i < Params.countYBigRivni + Params.countYBigPerekladom + Params.countYSmall; i++) {
					// Перші ряди тільки великі
					if (i <= Params.countYBigRivni) {
						if (i % 2 != 0) {
							// Odd row
							for (var j = Params.countXBig - 1; j >= 0; j--) {
								firstPage.ovals.add(myLayer, LocationOptions.AT_END, {
									'strokeColor': 'None',							
									'fillColor': 'None',	
									'geometricBounds': [
										verticalOffset + DistanceYCentersBigBig * i,
										horizontalOffsetBig + Params.DistanceXCenters * j,
										verticalOffset + DistanceYCentersBigBig * i + Params.Diameter,
										horizontalOffsetBig + Params.DistanceXCenters * j + Params.Diameter
									]
								});						
							}
						} else {
							// Even row
							for (var j = 0; j < Params.countXBig; j++) {
								firstPage.ovals.add(myLayer, LocationOptions.AT_END, {
									'strokeColor': 'None',							
									'fillColor': 'None',	
									'geometricBounds': [
										verticalOffset + DistanceYCentersBigBig * i,
										horizontalOffsetBig + Params.DistanceXCenters * j,
										verticalOffset + DistanceYCentersBigBig * i + Params.Diameter,
										horizontalOffsetBig + Params.DistanceXCenters * j + Params.Diameter
									]
								});						
							}
							countBig++;
						}
					} else {
						// Обнуляємо позицію вертикального зміщення, оскільки нові ряди будуть опиратись на цю величину
						if (i == Params.countYBigRivni + 1) verticalOffset = verticalOffset + DistanceYCentersBigBig * (i - 1);
						// Запускаємо новий лічильник для вкладених кружечків
						k++;
						if (i % 2 != 0) {
							// Odd row
							// Small row
							if (isSmall) {
								for (var j = Params.countXSmall - 1; j >= 0; j--) {
									if (Params.DistanceYCenters > (Params.Diameter / 2 + SpaceBetween)) {
										firstPage.ovals.add(myLayer, LocationOptions.AT_END, {
											'strokeColor': 'None',							
											'fillColor': 'None',	
											'geometricBounds': [
												verticalOffset + Params.DistanceYCenters * k,
												horizontalOffsetSmall + Params.DistanceXCenters * j,
												verticalOffset + Params.DistanceYCenters * k + Params.Diameter,
												horizontalOffsetSmall + Params.DistanceXCenters * j + Params.Diameter
											]
										});
									} else {
										firstPage.ovals.add(myLayer, LocationOptions.AT_END, {
											'strokeColor': 'None',							
											'fillColor': 'None',	
											'geometricBounds': [
												verticalOffset + Params.DistanceYCenters + DistanceYCentersCurrent * countSmall,
												horizontalOffsetSmall + Params.DistanceXCenters * j,
												verticalOffset + Params.DistanceYCenters + DistanceYCentersCurrent * countSmall + Params.Diameter,
												horizontalOffsetSmall + Params.DistanceXCenters * j + Params.Diameter
											]
										});	
									}										
								}
								countSmall++;
								isSmall = !isSmall;				
							} else {
								// Big row
								for (var j = Params.countXBig - 1; j >= 0; j--) {
									if (Params.DistanceYCenters > (Params.Diameter / 2 + SpaceBetween)) {
										firstPage.ovals.add(myLayer, LocationOptions.AT_END, {
											'strokeColor': 'None',							
											'fillColor': 'None',	
											'geometricBounds': [
												verticalOffset + Params.DistanceYCenters * k,
												horizontalOffsetBig + Params.DistanceXCenters * j,
												verticalOffset + Params.DistanceYCenters * k + Params.Diameter,
												horizontalOffsetBig + Params.DistanceXCenters * j + Params.Diameter
											]
										});
									} else {
										firstPage.ovals.add(myLayer, LocationOptions.AT_END, {
											'strokeColor': 'None',							
											'fillColor': 'None',	
											'geometricBounds': [
												verticalOffset + DistanceYCentersCurrent * countBig,
												horizontalOffsetBig + Params.DistanceXCenters * j,
												verticalOffset + DistanceYCentersCurrent * countBig + Params.Diameter,
												horizontalOffsetBig + Params.DistanceXCenters * j + Params.Diameter
											]
										});	
									}
								}
								countBig++;
								isSmall = !isSmall;								
							}							
						} else {
							// Even row
							// Small row
							if (isSmall) {
								for (var j = 0; j < Params.countXSmall; j++) {
									if (Params.DistanceYCenters > (Params.Diameter / 2 + SpaceBetween)) {									
										firstPage.ovals.add(myLayer, LocationOptions.AT_END, {
											'strokeColor': 'None',							
											'fillColor': 'None',	
											'geometricBounds': [
												verticalOffset + Params.DistanceYCenters * k,
												horizontalOffsetSmall + Params.DistanceXCenters * j,
												verticalOffset + Params.DistanceYCenters * k + Params.Diameter,
												horizontalOffsetSmall + Params.DistanceXCenters * j + Params.Diameter
											]
										});	
									} else {
										firstPage.ovals.add(myLayer, LocationOptions.AT_END, {
											'strokeColor': 'None',							
											'fillColor': 'None',	
											'geometricBounds': [
												verticalOffset + Params.DistanceYCenters + DistanceYCentersCurrent * countSmall,
												horizontalOffsetSmall + Params.DistanceXCenters * j,
												verticalOffset + Params.DistanceYCenters + DistanceYCentersCurrent * countSmall + Params.Diameter,
												horizontalOffsetSmall + Params.DistanceXCenters * j + Params.Diameter
											]
										});	
									}										
								}
								countSmall++;
								isSmall = !isSmall;				
							} else {
								// Big row
								for (var j = 0; j < Params.countXBig; j++) {
									if (Params.DistanceYCenters > (Params.Diameter / 2 + SpaceBetween)) {										
										firstPage.ovals.add(myLayer, LocationOptions.AT_END, {
											'strokeColor': 'None',							
											'fillColor': 'None',	
											'geometricBounds': [
												verticalOffset + Params.DistanceYCenters * k,
												horizontalOffsetBig + Params.DistanceXCenters * j,
												verticalOffset + Params.DistanceYCenters * k + Params.Diameter,
												horizontalOffsetBig + Params.DistanceXCenters * j + Params.Diameter
											]
										});
									} else {
										firstPage.ovals.add(myLayer, LocationOptions.AT_END, {
											'strokeColor': 'None',							
											'fillColor': 'None',	
											'geometricBounds': [
												verticalOffset + DistanceYCentersCurrent * countBig,
												horizontalOffsetBig + Params.DistanceXCenters * j,
												verticalOffset + DistanceYCentersCurrent * countBig + Params.Diameter,
												horizontalOffsetBig + Params.DistanceXCenters * j + Params.Diameter
											]
										});	
									}
								}
								countBig++
								isSmall = !isSmall;								
							}							
						}
					}
				}				
			} else {
				var verticalOffsetBig = (Params.widthFrame - totalWidthBig) / 2 + myCurrentDoc.CutterType.marginTop;
				var verticalOffsetSmall = (Params.widthFrame - totalWidthSmall) / 2 + myCurrentDoc.CutterType.marginTop;				
				var horizontalOffset = (Params.heightFrame - totalHeight) / 2 + myCurrentDoc.CutterType.marginLeft;
				var isSmall = true;
				var countSmall = 0;
				var countBig = 0;				
				var k = 0;				
				for (var i = 0; i < Params.countYBigRivni + Params.countYBigPerekladom + Params.countYSmall; i++) {
					// Перші ряди тільки великі
					if (i <= Params.countYBigRivni) {
						if (i % 2 != 0) {
							// Odd row
							for (var j = Params.countXBig - 1; j >= 0; j--) {
								firstPage.ovals.add(myLayer, LocationOptions.AT_END, {
									'strokeColor': 'None',							
									'fillColor': 'None',	
									'geometricBounds': [
										verticalOffsetBig + Params.DistanceXCenters * j,
										horizontalOffset + DistanceYCentersBigBig * i,
										verticalOffsetBig + Params.DistanceXCenters * j + Params.Diameter,
										horizontalOffset + DistanceYCentersBigBig * i + Params.Diameter
									]
								});						
							}
						} else {
							// Even row
							for (var j = 0; j < Params.countXBig; j++) {
								firstPage.ovals.add(myLayer, LocationOptions.AT_END, {
									'strokeColor': 'None',							
									'fillColor': 'None',	
									'geometricBounds': [
										verticalOffsetBig + Params.DistanceXCenters * j,
										horizontalOffset + DistanceYCentersBigBig * i,
										verticalOffsetBig + Params.DistanceXCenters * j + Params.Diameter,
										horizontalOffset + DistanceYCentersBigBig * i + Params.Diameter
									]
								});						
							}
							countBig++;
						}
					} else {
						// Обнуляємо позицію вертикального зміщення, оскільки нові ряди будуть опиратись на цю величину
						if (i == Params.countYBigRivni + 1) horizontalOffset = horizontalOffset + DistanceYCentersBigBig * (i - 1);							
						// Запускаємо новий лічильник для вкладених кружечків
						k++;
						if (i % 2 != 0) {
							// Odd row
							// Small row
							if (isSmall) {
								for (var j = Params.countXSmall - 1; j >= 0; j--) {
									if (Params.DistanceYCenters > (Params.Diameter / 2 + SpaceBetween)) {
										firstPage.ovals.add(myLayer, LocationOptions.AT_END, {
											'strokeColor': 'None',							
											'fillColor': 'None',	
											'geometricBounds': [
												verticalOffsetSmall + Params.DistanceXCenters * j,
												horizontalOffset + Params.DistanceYCenters * k,
												verticalOffsetSmall + Params.DistanceXCenters * j + Params.Diameter,
												horizontalOffset + Params.DistanceYCenters * k + Params.Diameter
											]
										});
									} else {
										firstPage.ovals.add(myLayer, LocationOptions.AT_END, {
											'strokeColor': 'None',							
											'fillColor': 'None',	
											'geometricBounds': [
												verticalOffsetSmall + Params.DistanceXCenters * j,
												horizontalOffset + Params.DistanceYCenters + DistanceYCentersCurrent * countSmall,
												verticalOffsetSmall + Params.DistanceXCenters * j + Params.Diameter,
												horizontalOffset + Params.DistanceYCenters + DistanceYCentersCurrent * countSmall + Params.Diameter
											]
										});	
									}										
								}
								countSmall++;	
								isSmall = !isSmall;				
							} else {
								// Big row
								for (var j = Params.countXBig - 1; j >= 0; j--) {
									if (Params.DistanceYCenters > (Params.Diameter / 2 + SpaceBetween)) {
										firstPage.ovals.add(myLayer, LocationOptions.AT_END, {
											'strokeColor': 'None',							
											'fillColor': 'None',	
											'geometricBounds': [
												verticalOffsetBig + Params.DistanceXCenters * j,
												horizontalOffset + Params.DistanceYCenters * k,
												verticalOffsetBig + Params.DistanceXCenters * j + Params.Diameter,
												horizontalOffset + Params.DistanceYCenters * k + Params.Diameter
											]
										});
									} else {
										firstPage.ovals.add(myLayer, LocationOptions.AT_END, {
											'strokeColor': 'None',							
											'fillColor': 'None',	
											'geometricBounds': [
												verticalOffsetBig + Params.DistanceXCenters * j,
												horizontalOffset + DistanceYCentersCurrent * countBig,
												verticalOffsetBig + Params.DistanceXCenters * j + Params.Diameter,
												horizontalOffset + DistanceYCentersCurrent * countBig + Params.Diameter
											]
										});
									}
								}
								countBig++;
								isSmall = !isSmall;								
							}							
						} else {
							// Even row
							if (isSmall) {
								for (var j = 0; j < Params.countXSmall; j++) {
									if (Params.DistanceYCenters > (Params.Diameter / 2 + SpaceBetween)) {
										firstPage.ovals.add(myLayer, LocationOptions.AT_END, {
											'strokeColor': 'None',							
											'fillColor': 'None',	
											'geometricBounds': [
												verticalOffsetSmall + Params.DistanceXCenters * j,
												horizontalOffset + Params.DistanceYCenters * k,
												verticalOffsetSmall + Params.DistanceXCenters * j + Params.Diameter,
												horizontalOffset + Params.DistanceYCenters * k + Params.Diameter
											]
										});	
									} else {
										firstPage.ovals.add(myLayer, LocationOptions.AT_END, {
											'strokeColor': 'None',							
											'fillColor': 'None',	
											'geometricBounds': [
												verticalOffsetSmall + Params.DistanceXCenters * j,
												horizontalOffset + Params.DistanceYCenters + DistanceYCentersCurrent * countSmall,
												verticalOffsetSmall + Params.DistanceXCenters * j + Params.Diameter,
												horizontalOffset + Params.DistanceYCenters + DistanceYCentersCurrent * countSmall + Params.Diameter
											]
										});
									}										
								}
								countSmall++;
								isSmall = !isSmall;				
							} else {
								// Big row
								for (var j = 0; j < Params.countXBig; j++) {
									if (Params.DistanceYCenters > (Params.Diameter / 2 + SpaceBetween)) {
										firstPage.ovals.add(myLayer, LocationOptions.AT_END, {
											'strokeColor': 'None',							
											'fillColor': 'None',	
											'geometricBounds': [
												verticalOffsetBig + Params.DistanceXCenters * j,
												horizontalOffset + Params.DistanceYCenters * k,
												verticalOffsetBig + Params.DistanceXCenters * j + Params.Diameter,
												horizontalOffset + Params.DistanceYCenters * k + Params.Diameter
											]
										});
									} else {
										firstPage.ovals.add(myLayer, LocationOptions.AT_END, {
											'strokeColor': 'None',							
											'fillColor': 'None',	
											'geometricBounds': [
												verticalOffsetBig + Params.DistanceXCenters * j,
												horizontalOffset + DistanceYCentersCurrent * countBig,
												verticalOffsetBig + Params.DistanceXCenters * j + Params.Diameter,
												horizontalOffset + DistanceYCentersCurrent * countBig + Params.Diameter
											]
										});	
									}										
								}
								countBig++;	
								isSmall = !isSmall;								
							}							
						}
					}
				}	
			}			
			break;
	}
	
	progress.increment();
	
	var OvalsGroup = myDocument.layers.itemByName("PRINT").pageItems.count() > 1 ? myDocument.groups.add(myDocument.layers.itemByName(PRINTLayer).pageItems) : myDocument.layers.itemByName(PRINTLayer);
	
	var contoursBounds = OvalsGroup.rectangles.count() > 1 ? OvalsGroup.geometricBounds : OvalsGroup.ovals.firstItem().geometricBounds;			
	
	if (myCurrentDoc.CutterType.marksGenerate == true) {
		
		progress.details("Генерую мітки...", false);
		
		generateCutterMarks(myDocument, myCurrentDoc, MarksLayer, contoursBounds);

		progress.increment();			
	};	
	
	if (myCurrentDoc.IsSaveFileWithCut) {
		
		var contourColor = myDocument.colors.add({
				"colorValue": myCurrentDoc.CutterType.contourColor,
				"model": ColorModel.PROCESS,
				"space": ColorSpace.CMYK,
				"name": "CONTOUR"
			});
		
		OvalsGroup.ovals.everyItem().properties = {
			'strokeWeight': 1,
			'strokeColor': contourColor,
			'strokeType': 'Solid',
			'strokeAlignment': StrokeAlignment.CENTER_ALIGNMENT
		};
		
		progress.details("Експортую файл порізки...", false);	
		
		var cutLength = Math.ceil(Math.PI * Params.Diameter * Params.total);
		
		var outputFile = outputFolder + '/' + 'D=' + Params.Diameter + "(" + SpaceBetween + ")mm_"  + myCurrentDoc.CutterType.label + "_" + myCurrentDoc.CutterType.paperName + "_CUT=" + cutLength + "mm_" + Params.total + " sht";
           
		if (OvalsGroup.ovals.length > 0) {
			if (myCurrentDoc.CutterType.plotterCutFormat == "AI") {
				myDocument.exportFile(ExportFormat.epsType, File(outputFile + ".eps"), false);
                  // Виклик Ілюстратора для перезбереження файлу до 8 версії AI
                  var res = illustrator.openIllustratorToConvertAI(File(outputFile + ".eps"));
                  if (res) {
						if (!res.success) alert(res.err);
				  }
				  
			} else if (myCurrentDoc.CutterType.plotterCutFormat == "DXF") {
				myDocument.exportFile(ExportFormat.epsType, File(outputFile + ".eps"), false);
                  // Виклик Ілюстратора для перезбереження файлу до формату DXF
				  var res = illustrator.openIllustratorToConvertDXF(File(outputFile + ".eps"));
                  if (res) {
						if (!res.success) alert(res.err);
				  }
				  
			} else {
				
				const myPDFExportPreset4Contour = myPDFExportPreset.duplicate();
				myPDFExportPreset4Contour.properties = {
					'standardsCompliance': PDFXStandards.NONE,
					'interactiveElementsOption': InteractiveElementsOptions.DO_NOT_INCLUDE,
					'includeICCProfiles': ICCProfiles.INCLUDE_NONE,
					'includeStructure': false,
					'includeBookmarks': false,
					'exportLayers': false,
					'generateThumbnails': false,
					'optimizePDF': false,
					'pdfColorSpace': PDFColorSpace.CMYK
				};				
				myDocument.asynchronousExportFile(ExportFormat.pdfType, File(outputFile + ".pdf"), false, myPDFExportPreset4Contour);	
				myPDFExportPreset4Contour.remove();
                docReady = true;
			}
		}		
	};
	
	progress.increment();
	
	progress.details("Закінчую підготовку...", false);
	
	for (var i = 0; i < OvalsGroup.ovals.length; i++) {
		var newBounds = [
			OvalsGroup.ovals[i].geometricBounds[0] - Bleeds,
			OvalsGroup.ovals[i].geometricBounds[1] - Bleeds,
			OvalsGroup.ovals[i].geometricBounds[2] + Bleeds,
			OvalsGroup.ovals[i].geometricBounds[3] + Bleeds
		];
		OvalsGroup.ovals[i].properties = {
			'contentType': ContentType.GRAPHIC_TYPE,			
			'strokeWeight': 0,
			'strokeColor': 'None',
			'frameFittingOptions': {
				'properties': {
					'fittingAlignment': AnchorPoint.CENTER_ANCHOR,
					'fittingOnEmptyFrame': EmptyFrameFittingOptions.CONTENT_TO_FRAME
				}
			},			
			'geometricBounds': [
				newBounds[0],
				newBounds[1],
				newBounds[2],
				newBounds[3]
			]
		}

	}
	
	progress.increment();
	progress.close();
}

// Створення шаблону документа для розкладки прямокутників

function CreateCustomDocRectangles(myCurrentDoc, customRoundCornersValue, customSpaceBetween) {
	
	var Params = myCurrentDoc.Params;
	
	var SpaceBetween = customSpaceBetween ? customSpaceBetween : myCurrentDoc.SpaceBetween;
	var Bleeds = myCurrentDoc.IsZeroBleeds ? 0 : myCurrentDoc.CutterType.minSpaceBetween / 2;
	var RoundCornersValue = customRoundCornersValue ? customRoundCornersValue : myCurrentDoc.RoundCornersValue;
	var IsRoundedCorners = customRoundCornersValue ? true : myCurrentDoc.IsRoundedCorners;
	
	const documentRotated = Params.widthSheet != myCurrentDoc.CutterType.widthSheet;
	
	Params.bleedCompensation = [];
	Params.rotationCompensation = [];
	
	progress(4, "Підготовка документа");
	progress.message("Готую розкладку " + Params.widthItem + "x" + Params.heightItem + " мм");
	progress.details("Створюю новий документ...", false);
	myDocument = app.documents.add();
	myDocument.documentPreferences.properties = {
		'pageOrientation': myCurrentDoc.CutterType.pageOrientation,
		'documentBleedTopOffset': 0,
		'slugTopOffset': 0,
		'documentSlugUniformSize': true,
		'facingPages': false,
		'intent': DocumentIntentOptions.PRINT_INTENT,
		'pageHeight': myCurrentDoc.CutterType.heightSheet,
		'pageWidth': myCurrentDoc.CutterType.widthSheet,
		'pagesPerDocument': 1
		
	}
	var firstPage = myDocument.pages.firstItem();
	firstPage.marginPreferences.properties = {
		'top': myCurrentDoc.CutterType.marginTop,
		'bottom': myCurrentDoc.CutterType.marginBottom,
		'left': myCurrentDoc.CutterType.marginLeft,
		'right': myCurrentDoc.CutterType.marginRight	
	}
	myLayer = myDocument.layers.firstItem();
	myLayer.name = PRINTLayer;
	
	var MarksLayer = myDocument.layers.add({
		'name': PLOTTERLayer
	});	
	
	if (myCurrentDoc.CutterType.marksGenerate == false) {
		
		progress.details("Імпортую мітки...", false);
		
		
		var MarksPlacement = firstPage.rectangles.add(MarksLayer, LocationOptions.AT_BEGINNING, {
			'contentType': ContentType.GRAPHIC_TYPE,
			'strokeWeight': 0,
			'strokeColor': 'None',
			'frameFittingOptions': {
				'properties': {
					'fittingAlignment': AnchorPoint.CENTER_ANCHOR,
					'fittingOnEmptyFrame': EmptyFrameFittingOptions.CONTENT_TO_FRAME
				}
			},
			'geometricBounds': [0, 0, myCurrentDoc.CutterType.heightSheet, myCurrentDoc.CutterType.widthSheet]
		});			
		
		app.pdfPlacePreferences.transparentBackground = true;
		
		MarksPlacement.place(File(myCurrentDoc.CutterType.marksFile))[0];
		
		app.activeWindow.transformReferencePoint = AnchorPoint.CENTER_ANCHOR;
		
		app.pdfPlacePreferences.transparentBackground = false;
		
		progress.increment();		
	};
	
	progress.details("Додаю елементи...", false);
	
	var totalWidth;
	var totalHeight;
	var horizontalOffset;
	var verticalOffset;	

	switch (Params.method) {
		case 1:
			if (documentRotated) {
				totalHeight = Params.countX * (Params.widthItem + SpaceBetween) - SpaceBetween;
				totalWidth = Params.countY * (Params.heightItem + SpaceBetween) - SpaceBetween;
				horizontalOffset = (Params.heightFrame - totalWidth) / 2 + myCurrentDoc.CutterType.marginLeft;
				verticalOffset = (Params.widthFrame - totalHeight) / 2 + myCurrentDoc.CutterType.marginTop;	
				var count = 0;
				var isOdd = true;
				
				// Rows
				for (var i = 0; i < Params.countX; i++) {
					// Columns
					for (var j = 0; j < Params.countY; j++) {
						count++;
						
						var itemIndex = isOdd ? j : Params.countY - j - 1;
						
						firstPage.rectangles.add(myLayer, LocationOptions.AT_END, {
							'strokeColor': 'None',
							'fillColor': 'None',
							'geometricBounds': [
								verticalOffset + (Params.widthItem + SpaceBetween) * i,
								horizontalOffset + (Params.heightItem + SpaceBetween) * itemIndex,
								verticalOffset + (Params.widthItem + SpaceBetween) * i + Params.widthItem,
								horizontalOffset + (Params.heightItem + SpaceBetween) * itemIndex + Params.heightItem
							]
						});
						// Створюємо масив компенсації повороту макетів
						Params.rotationCompensation.push(90);
						
						// Створюємо масив компенсації вильотів при накладанні макетів
						if (SpaceBetween == 0) {
							var firstRow = count > 0 && count <= Params.countY;
							var lastRow = count > (Params.total - Params.countY) && count <= Params.total;
							var firstCol = itemIndex == 0;
							var lastCol = itemIndex == Params.countY - 1;
							Params.bleedCompensation.push([
								firstRow ? 0 : Bleeds,
								firstCol ? 0 : Bleeds,
								lastRow ? 0 : -Bleeds,
								lastCol ? 0 : -Bleeds
							]);
						}
					}
					isOdd = !isOdd;
				}				
			} else {
				totalWidth = Params.countX * (Params.widthItem + SpaceBetween) - SpaceBetween;
				totalHeight = Params.countY * (Params.heightItem + SpaceBetween) - SpaceBetween;
				horizontalOffset = (Params.widthFrame - totalWidth) / 2 + myCurrentDoc.CutterType.marginLeft;
				verticalOffset = (Params.heightFrame - totalHeight) / 2 + myCurrentDoc.CutterType.marginTop;
				var count = 0;
				var isOdd = true;				
				// Rows
				for (var i = 0; i < Params.countY; i++) {
					// Columns
					for (var j = 0; j < Params.countX; j++) {
						count++;
						
						var itemIndex = isOdd ? j : Params.countX - j - 1;
						
						firstPage.rectangles.add(myLayer, LocationOptions.AT_END, {
							'strokeColor': 'None',
							'fillColor': 'None',
							'geometricBounds': [
								verticalOffset + (Params.heightItem + SpaceBetween) * i,
								horizontalOffset + (Params.widthItem + SpaceBetween) * itemIndex,
								verticalOffset + (Params.heightItem + SpaceBetween) * i + Params.heightItem,
								horizontalOffset + (Params.widthItem + SpaceBetween) * itemIndex + Params.widthItem
							]
						});
						
						// Створюємо масив компенсації повороту макетів
						Params.rotationCompensation.push(0);
						
						// Створюємо масив компенсації вильотів при накладанні макетів
						if (SpaceBetween == 0) {
							var firstRow = count > 0 && count <= Params.countX;
							var lastRow = count > (Params.total - Params.countX) && count <= Params.total;
							var firstCol = itemIndex == 0;
							var lastCol = itemIndex == Params.countX - 1;
							Params.bleedCompensation.push([
								firstRow ? 0 : Bleeds,
								firstCol ? 0 : Bleeds,
								lastRow ? 0 : -Bleeds,
								lastCol ? 0 : -Bleeds
							]);
						}
					}
					isOdd = !isOdd;
				}				
			}
			break;
		case 2:
			
			if (documentRotated) {
				
				totalHeightOriginal = Params.countX * (Params.widthItem + SpaceBetween) - SpaceBetween;
				totalWidthOriginal = Params.countY * (Params.heightItem + SpaceBetween) - SpaceBetween;
				totalHeightRotated = Params.countRotatedX * (Params.heightItem + SpaceBetween) - SpaceBetween;
				totalWidthRotated = Params.countRotatedY * (Params.widthItem + SpaceBetween) - SpaceBetween;
				totalWidth = totalWidthOriginal + SpaceBetween + totalWidthRotated;
				totalHeight = totalHeightOriginal > totalHeightRotated ? totalHeightOriginal : totalHeightRotated;
				horizontalOffset = (Params.heightFrame - totalWidth) / 2 + myCurrentDoc.CutterType.marginLeft;
				verticalOffset = (Params.widthFrame - totalHeight) / 2 + myCurrentDoc.CutterType.marginTop;				

				var isOdd = true;
				// Rows Original
				for (var i = 0; i < Params.countX; i++) {
					// Columns Original
					for (var j = 0; j < Params.countY; j++) {
						
						var itemIndex = isOdd ? j : Params.countY - j - 1;
						
						firstPage.rectangles.add(myLayer, LocationOptions.AT_END, {
							'strokeColor': 'None',
							'fillColor': 'None',
							'geometricBounds': [
								verticalOffset + (Params.widthItem + SpaceBetween) * i,
								horizontalOffset + (Params.heightItem + SpaceBetween) * itemIndex,
								verticalOffset + (Params.widthItem + SpaceBetween) * i + Params.widthItem,
								horizontalOffset + (Params.heightItem + SpaceBetween) * itemIndex + Params.heightItem
							]
						});
						// Створюємо масив компенсації повороту макетів
						Params.rotationCompensation.push(90);				
					}
					isOdd = !isOdd;
				}
				
				horizontalOffset = horizontalOffset + (Params.heightItem + SpaceBetween) * Params.countY;
				
				// Rows Rotated
				for (var i = 0; i < Params.countRotatedX; i++) {
					// Columns Rotated
					for (var j = 0; j < Params.countRotatedY; j++) {
						
						var itemIndex = isOdd ? j : Params.countRotatedY - j - 1;
						
						firstPage.rectangles.add(myLayer, LocationOptions.AT_END, {
							'strokeColor': 'None',
							'fillColor': 'None',
							'geometricBounds': [
								verticalOffset + (Params.heightItem + SpaceBetween) * i,
								horizontalOffset + (Params.widthItem + SpaceBetween) * itemIndex,
								verticalOffset + (Params.heightItem + SpaceBetween) * i + Params.heightItem,
								horizontalOffset + (Params.widthItem + SpaceBetween) * itemIndex + Params.widthItem
							]
						});
						// Створюємо масив компенсації повороту макетів
						Params.rotationCompensation.push(0);
					}
					isOdd = !isOdd;
				}				
			} else {
				totalWidthOriginal = Params.countX * (Params.widthItem + SpaceBetween) - SpaceBetween;
				totalHeightOriginal = Params.countY * (Params.heightItem + SpaceBetween) - SpaceBetween;
				totalWidthRotated = Params.countRotatedX * (Params.heightItem + SpaceBetween) - SpaceBetween;
				totalHeightRotated = Params.countRotatedY * (Params.widthItem + SpaceBetween) - SpaceBetween;
				totalWidth = totalWidthOriginal > totalWidthRotated ? totalWidthOriginal : totalWidthRotated;
				totalHeight = totalHeightOriginal + SpaceBetween + totalHeightRotated;
				horizontalOffset = (Params.widthFrame - totalWidth) / 2 + myCurrentDoc.CutterType.marginLeft;
				verticalOffset = (Params.heightFrame - totalHeight) / 2 + myCurrentDoc.CutterType.marginTop;
				
				var isOdd = true;
				// Rows Original
				for (var i = 0; i < Params.countY; i++) {
					// Columns Original
					for (var j = 0; j < Params.countX; j++) {
						
						var itemIndex = isOdd ? j : Params.countX - j - 1;
						
						firstPage.rectangles.add(myLayer, LocationOptions.AT_END, {
							'strokeColor': 'None',
							'fillColor': 'None',
							'geometricBounds': [
								verticalOffset + (Params.heightItem + SpaceBetween) * i,
								horizontalOffset + (Params.widthItem + SpaceBetween) * itemIndex,
								verticalOffset + (Params.heightItem + SpaceBetween) * i + Params.heightItem,
								horizontalOffset + (Params.widthItem + SpaceBetween) * itemIndex + Params.widthItem
							]
						});
						// Створюємо масив компенсації повороту макетів
						Params.rotationCompensation.push(0);				
					}
					isOdd = !isOdd;
				}
				
				verticalOffset = verticalOffset + (Params.heightItem + SpaceBetween) * Params.countY;
				
				// Rows Rotated
				for (var i = 0; i < Params.countRotatedY; i++) {
					// Columns Rotated
					for (var j = 0; j < Params.countRotatedX; j++) {
						
						var itemIndex = isOdd ? j : Params.countRotatedX - j - 1;
						
						firstPage.rectangles.add(myLayer, LocationOptions.AT_END, {
							'strokeColor': 'None',
							'fillColor': 'None',
							'geometricBounds': [
								verticalOffset + (Params.widthItem + SpaceBetween) * i,
								horizontalOffset + (Params.heightItem + SpaceBetween) * itemIndex,
								verticalOffset + (Params.widthItem + SpaceBetween) * i + Params.widthItem,
								horizontalOffset + (Params.heightItem + SpaceBetween) * itemIndex + Params.heightItem
							]
						});
						// Створюємо масив компенсації повороту макетів
						Params.rotationCompensation.push(90);
					}
					isOdd = !isOdd;
				}
			}

			break;
	}
	
	progress.increment();
	
	var RectGroup = myDocument.layers.itemByName(PRINTLayer).pageItems.count() > 1 ? myDocument.groups.add(myDocument.layers.itemByName(PRINTLayer).pageItems) : myDocument.layers.itemByName(PRINTLayer);

    var contoursBounds = RectGroup.rectangles.count() > 1 ? RectGroup.geometricBounds : RectGroup.rectangles.firstItem().geometricBounds;
	
	if (IsRoundedCorners) {
		RectGroup.rectangles.everyItem().properties = {
			'bottomLeftCornerOption': CornerOptions.ROUNDED_CORNER,
			'bottomLeftCornerRadius': RoundCornersValue || 0,
			'bottomRightCornerOption': CornerOptions.ROUNDED_CORNER,
			'bottomRightCornerRadius': RoundCornersValue || 0,	
			'topLeftCornerOption': CornerOptions.ROUNDED_CORNER,
			'topLeftCornerRadius': RoundCornersValue || 0,
			'topRightCornerOption': CornerOptions.ROUNDED_CORNER,
			'topRightCornerRadius': RoundCornersValue || 0				
		};
	}

	if (myCurrentDoc.CutterType.marksGenerate == true) {
		
		progress.details("Генерую мітки...", false);
		
		generateCutterMarks(myDocument, myCurrentDoc, MarksLayer, contoursBounds);

		progress.increment();			
	};
	
	if (myCurrentDoc.IsSaveFileWithCut) {
		
		var contourOffset = myCurrentDoc.CutterType.contourOffset;
		
		var refPoint = app.activeDocument.layoutWindows[0].transformReferencePoint;
		
		app.activeDocument.layoutWindows[0].transformReferencePoint = AnchorPoint.CENTER_ANCHOR;
		
		var contourColor = myDocument.colors.add({
				"colorValue": myCurrentDoc.CutterType.contourColor,
				"model": ColorModel.PROCESS,
				"space": ColorSpace.CMYK,
				"name": "CONTOUR"
			});		
		
		if (SpaceBetween > 0) {
			RectGroup.rectangles.everyItem().properties = {
				'strokeWeight': 1,
				'strokeColor': contourColor,
				'strokeType': 'Solid',
				'strokeAlignment': StrokeAlignment.CENTER_ALIGNMENT
			};			
		} else {
			if (documentRotated) {
				
				// Вертикальні лінії різу
				
				var isOdd = Params.countY % 2 == 0 ? true : false;
				
				for (var i = 0; i <= Params.countY; i++) {
					firstPage.graphicLines.add(MarksLayer, LocationOptions.AT_END, {
						'geometricBounds': [ // [y1, x1, y2, x2], which give the coordinates of the top-left and bottom-right corners of the bounding box.
							verticalOffset - contourOffset,
							horizontalOffset + (Params.heightItem + SpaceBetween / 2) * i,
							verticalOffset + totalHeight + contourOffset,
							horizontalOffset + (Params.heightItem + SpaceBetween / 2) * i
						],
						'strokeWeight': 1,
						'strokeColor': contourColor,
						'strokeType': 'Solid',
						'strokeAlignment': StrokeAlignment.CENTER_ALIGNMENT,
						'rotationAngle': isOdd ? 0 : 180
					})
					isOdd = !isOdd;					
				}
				
				// Горизонтальні лінії різу
					
				isOdd = Params.countX % 2 == 0 ? false : true;
				
				for (var i = 0; i <= Params.countX; i++) {
					firstPage.graphicLines.add(MarksLayer, LocationOptions.AT_END, {
						'geometricBounds': [ // [y1, x1, y2, x2], which give the coordinates of the top-left and bottom-right corners of the bounding box.
							verticalOffset + (Params.widthItem + SpaceBetween / 2) * i,
							horizontalOffset - contourOffset,
							verticalOffset + (Params.widthItem + SpaceBetween / 2) * i,
							horizontalOffset + totalWidth + contourOffset
						],
						'strokeWeight': 1,
						'strokeColor': contourColor,
						'strokeType': 'Solid',
						'strokeAlignment': StrokeAlignment.CENTER_ALIGNMENT,
						'rotationAngle': isOdd ? 0 : 180
					})
					isOdd = !isOdd;					
				}	
				
			} else {
				
				// Вертикальні лінії різу
				
				var isOdd = Params.countX % 2 == 0 ? true : false;
				
				for (var i = 0; i <= Params.countX; i++) {
					
					firstPage.graphicLines.add(MarksLayer, LocationOptions.AT_END, {
						'geometricBounds': [ // [y1, x1, y2, x2], which give the coordinates of the top-left and bottom-right corners of the bounding box.
							verticalOffset - contourOffset,
							horizontalOffset + (Params.widthItem + SpaceBetween / 2) * i,
							verticalOffset + totalHeight + contourOffset,
							horizontalOffset + (Params.widthItem + SpaceBetween / 2) * i
						],
						'strokeWeight': 1,
						'strokeColor': contourColor,
						'strokeType': 'Solid',
						'strokeAlignment': StrokeAlignment.CENTER_ALIGNMENT,
						'rotationAngle': isOdd ? 0 : 180
					})
					isOdd = !isOdd;					
				}				
				
				// Горизонтальні лінії різу
				
				isOdd = Params.countY % 2 == 0 ? false : true;
				
				for (var i = 0; i <= Params.countY; i++) {				
					
					firstPage.graphicLines.add(MarksLayer, LocationOptions.AT_END, {
						'geometricBounds': [ // [y1, x1, y2, x2], which give the coordinates of the top-left and bottom-right corners of the bounding box.
							verticalOffset + (Params.heightItem + SpaceBetween / 2) * i,
							horizontalOffset - contourOffset,
							verticalOffset + (Params.heightItem + SpaceBetween / 2) * i,
							horizontalOffset + totalWidth + contourOffset
						],
						'strokeWeight': 1,
						'strokeColor': contourColor,
						'strokeType': 'Solid',
						'strokeAlignment': StrokeAlignment.CENTER_ALIGNMENT,
						'rotationAngle': isOdd ? 0 : 180
					})
					isOdd = !isOdd;
				}	
			}
		};
		
		app.activeDocument.layoutWindows[0].transformReferencePoint = refPoint;	
		
		progress.details("Експортую файл порізки...", false);	
		
		var cutLength;
		
		if (SpaceBetween > 0) {
			if (IsRoundedCorners) {
				cutLength = Math.ceil(((Params.widthItem + Params.heightItem - 4 * RoundCornersValue) * 2 + 2 * Math.PI * RoundCornersValue) * Params.total);
			} else {
				cutLength = Math.ceil(((Params.widthItem + Params.heightItem) * 2) * Params.total);
			}			
		} else {
			cutLength = Math.ceil((Params.countY + 1) * (totalHeight + 0.7) + (Params.countX + 1) * (totalWidth + 0.7));
		}
		
		var outputFile = outputFolder + '/' + Params.widthItem + "x" + Params.heightItem + (IsRoundedCorners && RoundCornersValue > 0 ? " R=" + RoundCornersValue + " " : "") + "(" + SpaceBetween + ")mm_"  + myCurrentDoc.CutterType.label + "_" + myCurrentDoc.CutterType.paperName + "_CUT=" + cutLength + "mm_" + Params.total + " sht";
           
		if (RectGroup.rectangles.length > 0) {
			if (myCurrentDoc.CutterType.plotterCutFormat == "AI") {
				myDocument.exportFile(ExportFormat.epsType, File(outputFile + ".eps"), false);
                  // Виклик Ілюстратора для перезбереження файлу до 8 версії AI
                  var res = illustrator.openIllustratorToConvertAI(File(outputFile + ".eps"));
                  if (res) {
						if (!res.success) alert(res.err);
				  }
			} else if (myCurrentDoc.CutterType.plotterCutFormat == "DXF") {
				myDocument.exportFile(ExportFormat.epsType, File(outputFile + ".eps"), false);
                  // Виклик Ілюстратора для перезбереження файлу до формату DXF
                  var res = illustrator.openIllustratorToConvertDXF(File(outputFile + ".eps"));
                  if (res) {
						if (!res.success) alert(res.err);
				  }
			} else {
				const myPDFExportPreset4Contour = myPDFExportPreset.duplicate();
				myPDFExportPreset4Contour.properties = {
					'standardsCompliance': PDFXStandards.NONE,
					'interactiveElementsOption': InteractiveElementsOptions.DO_NOT_INCLUDE,
					'includeICCProfiles': ICCProfiles.INCLUDE_NONE,
					'includeStructure': false,
					'includeBookmarks': false,
					'exportLayers': false,
					'generateThumbnails': false,
					'optimizePDF': false,
					'pdfColorSpace': PDFColorSpace.CMYK
				};
				myDocument.asynchronousExportFile(ExportFormat.pdfType, File(outputFile + ".pdf"), false, myPDFExportPreset4Contour);	
				myPDFExportPreset4Contour.remove();
                docReady = true;
			}
		}		
	};
	
	progress.increment();
	
	progress.details("Закінчую підготовку...", false);	
	
	if (SpaceBetween == 0) firstPage.graphicLines.everyItem().remove();
	
	for (var i = 0, Rectangles = RectGroup.rectangles; i < Rectangles.length; i++) {
		var newBounds = [
			Rectangles[i].geometricBounds[0] - Bleeds,
			Rectangles[i].geometricBounds[1] - Bleeds,
			Rectangles[i].geometricBounds[2] + Bleeds,
			Rectangles[i].geometricBounds[3] + Bleeds
		];
		Rectangles[i].properties = {
			'contentType': ContentType.GRAPHIC_TYPE,			
			'strokeWeight': 0,
			'strokeColor': 'None',
			'frameFittingOptions': {
				'properties': {
					'fittingAlignment': AnchorPoint.CENTER_ANCHOR,
					'fittingOnEmptyFrame': EmptyFrameFittingOptions.CONTENT_TO_FRAME
				}
			},			
			'geometricBounds': [
				newBounds[0],
				newBounds[1],
				newBounds[2],
				newBounds[3]
			]
		}
	}
	
	progress.increment();
	progress.close();
}

// Читаємо і готуємо файл налаштувань

function parsePreferencesJSON(fileName) {
    var currentLine;
    var jsonStuff = [];
	var file = File(fileName);
    file.open("r");
	while(!file.eof) {
			currentLine = file.readln();
			jsonStuff.push(currentLine);
		}
	file.close();
	jsonStuff = jsonStuff.join("");
	if (jsonStuff == "") {
		alert("Не знайдено налаштування у " + file.absoluteURI);
		exit();
	} else {
		try {
			var parsedJson = JSON.parse(jsonStuff);
			for (var i = 0, cutters = parsedJson.cutters; i < cutters.length; i++) {
				if (cutters[i].widthSheet <= cutters[i].heightSheet) cutters[i].pageOrientation = PageOrientation.PORTRAIT;
				if (cutters[i].widthSheet > cutters[i].heightSheet) cutters[i].pageOrientation = PageOrientation.LANDSCAPE;
				cutters[i].widthFrame = cutters[i].widthSheet - (cutters[i].marginLeft + cutters[i].marginRight);
				cutters[i].heightFrame = cutters[i].heightSheet - (cutters[i].marginTop + cutters[i].marginBottom);
			};
			return parsedJson;				
		} catch (err) {
			alert("Помилка при обробці json-файлу налаштувань плоттерів!\n\n" + err.message);
			exit();
		}
	
	}
}