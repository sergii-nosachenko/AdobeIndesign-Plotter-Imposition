#target indesign
#engine main

/* ----------------------------------------------------------------------

Цей плагін є результатом багаторічного досвіду в поліграфії та створений
з метою спростити життя репрографам, що часто працюють з розкладками
під плотерну порізку.

Автор: Сергій Носаченко
github.com/sergii-nosachenko
2022

---------------------------------------------------------------------- */

const APP_VERSION = "4.0.0a";

// Debug level
// Comment next line for production!
// $.level = 2;

// Допоміжні бібліотеки
//@include "helpers/JSON.jsx"
//@include "helpers/Array.indexOf.polyfill.jsx"
//@include "helpers/Array.fill.polyfill.jsx"
//@include "helpers/Array.reduce.polyfill.jsx"
//@include "helpers/PDFmultipage.jsx"

// Підтримка багатомовності
//@include "languages/uk_UA.jsx"
//@include "languages/en_US.jsx"

// Модулі
//@include "modules/RozkladkaCircles.jsx"
//@include "modules/RozkladkaRectangles.jsx"
//@include "modules/generateCutterMarks.jsx"
//@include "modules/MainWindow.jsx"
//@include "modules/ImpositionWindow.jsx"
//@include "modules/CutterTypesPrefsWindow.jsx"
//@include "modules/EditMarkWindow.jsx"

// Global constants
const PREFS_FILE = File($.fileName).path + "/preferences.json";
var APP_PREFERENCES = parsePreferencesJSON(PREFS_FILE); // preferences.json має бути в папці зі скриптом і містити всі налаштування
const PRINTLayer = "PRINT";
const PLOTTERLayer = "PLOTTER";
const CUTLayer = "CUT";
const TITLELayer = "TITLE";
var CUTTER_TYPES = APP_PREFERENCES.cutters;

APP_PREFERENCES.app = APP_PREFERENCES.app || {};
APP_PREFERENCES.app.lang = APP_PREFERENCES.app.lang ? APP_PREFERENCES.app.lang : ($.locale ? $.locale : 'en_US');
APP_PREFERENCES.app.lastPlotter = APP_PREFERENCES.app.lastPlotter ? APP_PREFERENCES.app.lastPlotter : 0;

//Global RegExp patterns
const BracketsPattern = /\[.*\]/;
const CirclePattern = /\[[^d]*d=(\d+[,.]?\d*)[^\(]*(\((\d+[,.]?\d*)?\))?[^\)]*\]/i; // "[d=10 (0.5)]" => 10, (0.5), 0.5
const RectanglePattern = /\[[^\d]*(\d+[,.]?\d*[xх]\d+[,.]?\d*)[^r\(]*(r\=(\d+[,.]?\d*))?[^\(]*(\((\d+[,.]?\d*)\))?.*\]/i; // "[15x10 r=3.5 (0.5)]" => 15x10, r=3.5, 3.5, (0.5), 0.5

// Global variables
var myPDFExportPreset;
var theFiles;
var okFiles = [];
var myImposing = "";
var outputFolder;
var myFileName = "";
var myDocument;
var myDocumentsProcessing = [];
var myWindow;
var myLayer;
var myImposingMethod = 0;
var myCustomDoc = {
	title: "",
	CutterType: false,
	Figure: translate('Circles'),
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
var SaveMultipageFilesAsOneFile = true;
var steps;
var totalPages;

// Для коректної роботи BridgeTalk функції трансформовано в текстовий тип
const openIllustratorToConvertAI_source = '(function openIllustratorToConvertAI(fileName){var result={success:!1};fileName=eval(fileName);try{var file=File(fileName);if(!file.exists)throw new Error("File not found!");app.userInteractionLevel=UserInteractionLevel.DONTDISPLAYALERTS;var w=new Window("dialog","Processing",void 0,{closeButton:!1}),t=w.add("statictext");t.preferredSize=[450,-1],t.text="Converting EPS to AI cut file...",w.onShow=function(){app.open(file);var e=new IllustratorSaveOptions;e.compatibility=Compatibility.ILLUSTRATOR8,e.compressed=!1,e.pdfCompatible=!1;var t=file.fullName.split(".").slice(0,-1).join(".")+".ai",r=new File(t);try{app.activeDocument.saveAs(r,e),app.activeDocument.close(SaveOptions.DONOTSAVECHANGES),file.remove()}catch(e){throw new Error("Export to AI failed!")}result={success:!0},w.close()};var run=w.show();return app.userInteractionLevel=UserInteractionLevel.DISPLAYALERTS,result.toSource()}catch(e){return result={success:!1,err:e.message},app.userInteractionLevel=UserInteractionLevel.DISPLAYALERTS,result.toSource()}})';
const openIllustratorToConvertDXF_source = '(function openIllustratorToConvertDXF(fileName){var result={success:!1};fileName=eval(fileName);try{var file=File(fileName);if(!file.exists)throw new Error("File not found!");app.userInteractionLevel=UserInteractionLevel.DONTDISPLAYALERTS;var w=new Window("dialog","Processing",void 0,{closeButton:!1}),t=w.add("statictext");t.preferredSize=[450,-1],t.text="Converting EPS to AI cut file...",w.onShow=function(){app.open(file);var e=new ExportOptionsAutoCAD;e.exportFileFormat=AutoCADExportFileFormat.DXF;for(var t=file.fullName.split(".").slice(0,-1).join(".")+".dxf",o=new File(t),r=0,l=app.activeDocument.pathItems;r<l.length;r++)l[r].fillColor instanceof NoColor||(l[r].strokeColor=l[r].fillColor,l[r].fillColor=new NoColor);try{app.activeDocument.exportFile(o,ExportType.AUTOCAD,e),app.activeDocument.close(SaveOptions.DONOTSAVECHANGES),file.remove()}catch(e){throw new Error("Export to DXF failed!")}result={success:!0},w.close()};var run=w.show();return app.userInteractionLevel=UserInteractionLevel.DISPLAYALERTS,result.toSource()}catch(e){return result={success:!1,err:e.message},app.userInteractionLevel=UserInteractionLevel.DISPLAYALERTS,result.toSource()}})';

// Запуск головного діалогового вікна
app.scriptPreferences.enableRedraw = true;
DialogWindow();

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
	var pagesTotalProcessedCounter = 0;
	var myCurrentDoc = {
		CutterType: myCustomDoc.CutterType,
		SpaceBetween: myCustomDoc.SpaceBetween,
		IsZeroBleeds: myCustomDoc.IsZeroBleeds,
		IsSaveFileWithCut: myCustomDoc.IsSaveFileWithCut,
		Params: false
	};

	var badFiles = [];
	var badExport = [];	

	switch (myCustomDoc.Figure) {
		case translate('Circles'):
			if (myCustomDoc.Diameter || myCustomDoc.IsGetSizeFromFilename) {
				if (myCustomDoc.IsGetSizeFromFilename) {
					var okFilesDiameters = {};
					var okDiameters = [];
					var okFilesCurrent;
					var totalOkFilesLength = okFiles.length;
					
					for (var i = 0; i < okFiles.length; i++) {
						var theFile = okFiles[i].theFile;				
						var fileName = File.decode(theFile.name).split('.').slice(0, -1).join('.');
						var diameterMatch = fileName.match(CirclePattern);
						var diameter = diameterMatch ? parseFloat(diameterMatch[1].replace(',', '.')) : 0;
						var spacebetween = diameterMatch && diameterMatch[3] != undefined ? parseFloat(diameterMatch[3].replace(',', '.')) : myCustomDoc.SpaceBetween;
						var key = diameter ? diameter+':'+spacebetween : diameter;
						var files = okFilesDiameters[key] || [];
						files.push(okFiles[i]);
						okFilesDiameters[key] = files;
						if (okDiameters.indexOf(key) < 0) okDiameters.push(key);
					}

					if (okFilesDiameters[0]) {
						// Запам'ятовуємо файли, розмір яких не вдалося розпізнати
						for (var k = 0; k < okFilesDiameters[0].length; k++) {
							badFiles.push({
								theFile: okFilesDiameters[0][k].theFile,
								reason: translate('Error - Unknown size')
							});
						}						
						totalOkFilesLength = totalOkFilesLength - badFiles.length;
					};			
					
					// Перебираємо варіанти
					for (var i = 0; i < okDiameters.length; i++) {
						if (okDiameters[i] !== 0) {
							myCurrentDoc.Diameter = okDiameters[i].split(':')[0];
							var thisSpaceBetween = okDiameters[i].split(':')[1];
							thisSpaceBetween = thisSpaceBetween > myCurrentDoc.CutterType.minSpaceBetween ? thisSpaceBetween : myCurrentDoc.CutterType.minSpaceBetween;
							thisSpaceBetween = thisSpaceBetween > myCurrentDoc.CutterType.maxSpaceBetween ? myCurrentDoc.CutterType.maxSpaceBetween : thisSpaceBetween;
							var thisFileParams = RozkladkaCircles(myCurrentDoc.Diameter, myCurrentDoc.CutterType, thisSpaceBetween, true);			
							if (thisFileParams.length) {
								myCurrentDoc.Params = thisFileParams[0];
								myCurrentDoc.Figure = translate('Circles');
								okFilesCurrent = okFilesDiameters[okDiameters[i]];				
								totalPages = 0;
								for (var j = 0; j < okFilesCurrent.length; j++) {
									totalPages = totalPages + okFilesCurrent[j].pgCount;
								};									
								CreateCustomDocCircles(myCurrentDoc, thisSpaceBetween);
								ProcessCircles(okFilesCurrent, totalOkFilesLength, thisSpaceBetween);				
							} else {
								// Запам'ятовуємо файли, для яких не вдалося розрахувати розкладку
								for (var k = 0; k < okFilesDiameters[okDiameters[i]].length; k++) {
									badFiles.push({
										theFile: okFilesDiameters[okDiameters[i]][k].theFile,
										reason: translate('Error - No variants')
									});
								}
							};					
						}
					}			
				} else {
					myCurrentDoc = myCustomDoc;
					myCurrentDoc.Figure = translate('Circles');
					CreateCustomDocCircles(myCurrentDoc);
					ProcessCircles(okFiles, okFiles.length);
				}
			} else {
				ProcessCircles(okFiles, okFiles.length);
			};		
			break;
		case translate('Rectangles'):		
			if ((myCustomDoc.RectWidth && myCustomDoc.RectHeight) || myCustomDoc.IsGetSizeFromFilename) {
				if (myCustomDoc.IsGetSizeFromFilename) {
					var okFilesSizes = {};
					var okSizes = [];
					var okFilesCurrent;
					var totalOkFilesLength = okFiles.length;
					
					for (var i = 0; i < okFiles.length; i++) {
						var theFile = okFiles[i].theFile;				
						var fileName = File.decode(theFile.name).split('.').slice(0, -1).join('.');
						var sizeMatch = fileName.match(RectanglePattern);
						var size = sizeMatch ? sizeMatch[1].replace(/,/g, '.').replace('х', 'x') : 0;
						var fillet = sizeMatch && sizeMatch[3] != undefined ? parseFloat(sizeMatch[1].replace(',', '.')) : 0;
						var spacebetween = sizeMatch && sizeMatch[5] != undefined ? parseFloat(diameterMatch[5].replace(',', '.')) : myCustomDoc.SpaceBetween;
						var key = size ? size+':'+fillet+':'+spacebetween : size;
						var files = okFilesSizes[key] || [];
						files.push(okFiles[i]);
						okFilesSizes[key] = files;
						if (okSizes.indexOf(key) < 0) okSizes.push(key);
					}

					if (okFilesSizes[0]) {
						// Запам'ятовуємо файли, розмір яких не вдалося розпізнати
						for (var k = 0; k < okFilesSizes[0].length; k++) {
							badFiles.push({
								theFile: okFilesSizes[0][k].theFile,
								reason: translate('Error - Unknown size')
							});
						}
						totalOkFilesLength = totalOkFilesLength - badFiles.length;			
					};	
					
					// Перебираємо варіанти
					for (var i = 0; i < okSizes.length; i++) {
						if (okSizes[i] !== 0) {
							var thisSize = okSizes[i].split(':')[0];
							var thisRadius = okSizes[i].split(':')[1];
							var thisSpaceBetween = okSizes[i].split(':')[2];
							thisSpaceBetween = thisSpaceBetween > myCurrentDoc.CutterType.minSpaceBetween ? thisSpaceBetween : myCurrentDoc.CutterType.minSpaceBetween;
							thisSpaceBetween = thisSpaceBetween > myCurrentDoc.CutterType.maxSpaceBetween ? myCurrentDoc.CutterType.maxSpaceBetween : thisSpaceBetween;
							thisSpaceBetween = thisRadius && thisSpaceBetween ? thisSpaceBetween : myCurrentDoc.CutterType.minSpaceBetween;
							myCurrentDoc.RectWidth = parseFloat(thisSize.split('x')[0]);
							myCurrentDoc.RectHeight = parseFloat(thisSize.split('x')[1]);
							if (!myCurrentDoc.RectWidth || !myCurrentDoc.RectHeight) {
								// Запам'ятовуємо файли, у яких відсутнія ширина або висота
								for (var k = 0; k < okFilesSizes[okSizes[i]].length; k++) {
									badFiles.push({
										theFile: okFilesSizes[okSizes[i]][k].theFile,
										reason: translate('Error - Not correct size')
									});
								}								
								continue;
							}
							if (thisRadius > myCurrentDoc.RectWidth / 2 || thisRadius > myCurrentDoc.RectHeight / 2) {
								// Запам'ятовуємо файли, радіус скругління яких більший від половини розміру
								for (var k = 0; k < okFilesSizes[okSizes[i]].length; k++) {
									badFiles.push({
										theFile: okFilesSizes[okSizes[i]][k].theFile,
										reason: translate('Error - Too big radius')
									});
								}								
								continue;
							}
							var thisFileParams = RozkladkaRectangles(myCurrentDoc.RectWidth, myCurrentDoc.RectHeight, myCurrentDoc.CutterType, thisSpaceBetween, thisSpaceBetween > 0, true);
							if (thisFileParams.length) {
								myCurrentDoc.Params = thisFileParams[0];
								myCurrentDoc.Figure = translate('Rectangles');
								okFilesCurrent = okFilesSizes[okSizes[i]];				
								totalPages = 0;
								for (var j = 0; j < okFilesCurrent.length; j++) {
									totalPages = totalPages + okFilesCurrent[j].pgCount;
								};										
								CreateCustomDocRectangles(myCurrentDoc, thisRadius > 0 ? thisRadius : false, thisRadius > 0 ? thisSpaceBetween : false);
								ProcessRectangles(okFilesCurrent, totalOkFilesLength, thisRadius > 0 ? thisRadius : false, thisRadius > 0 ? thisSpaceBetween : false);				
							} else {
								// Запам'ятовуємо файли, для яких не вдалося розрахувати розкладку
								for (var k = 0; k < okFilesSizes[okSizes[i]].length; k++) {
									badFiles.push({
										theFile: okFilesSizes[okSizes[i]][k].theFile,
										reason: translate('Error - No variants')
									});
								}
							}				
						}
					}			
				} else {
					myCurrentDoc = myCustomDoc;
					myCurrentDoc.Figure = translate('Rectangles');
					CreateCustomDocRectangles(myCurrentDoc);
					ProcessRectangles(okFiles, okFiles.length);
				}
			} else {
				ProcessRectangles(okFiles, okFiles.length);
			};			
			break;
		case translate('Mixed'):
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
				var diameterMatch = fileName.match(CirclePattern);
				var diameter = diameterMatch ? parseFloat(diameterMatch[1].replace(',', '.')) : 0;
				var spacebetween = diameterMatch && diameterMatch[3] != undefined ? parseFloat(diameterMatch[3].replace(',', '.')) : myCustomDoc.SpaceBetween;
				var key = diameter ? diameter+':'+spacebetween : diameter;
				var files = okFilesDiameters[key] || [];
				files.push(okFiles[i]);
				okFilesDiameters[key] = files;
				if (okDiameters.indexOf(key) < 0) okDiameters.push(key);
			}

			// Все, що не розпізнано, як кружечки, передається на аналіз належності до прямокутників
			badDiameterFiles = okFilesDiameters[0];
			
			for (var i = 0; i < badDiameterFiles.length; i++) {
				var theFile = badDiameterFiles[i].theFile;				
				var fileName = File.decode(theFile.name).split('.').slice(0, -1).join('.');
				var sizeMatch = fileName.match(RectanglePattern);
				var size = sizeMatch ? sizeMatch[1].replace(/,/g, '.').replace('х', 'x') : 0;
				var fillet = sizeMatch && sizeMatch[3] != undefined ? parseFloat(sizeMatch[3].replace(',', '.')) : 0;
				var spacebetween = sizeMatch && sizeMatch[5] != undefined ? parseFloat(diameterMatch[5].replace(',', '.')) : myCustomDoc.SpaceBetween;
				var key = size ? size+':'+fillet+':'+spacebetween : size;
				var files = okFilesSizes[key] || [];
				files.push(badDiameterFiles[i]);
				okFilesSizes[key] = files;
				if (okSizes.indexOf(key) < 0) okSizes.push(key);
			}

			if (okFilesSizes[0]) {
				// Запам'ятовуємо файли, розмір яких не вдалося розпізнати
				for (var k = 0; k < okFilesSizes[0].length; k++) {
					badFiles.push({
						theFile: okFilesSizes[0][k].theFile,
						reason: translate('Error - Unknown size')
					});
				}
				totalOkFilesLength = totalOkFilesLength - okFilesSizes[0].length;
			};			
			
			// Перебираємо варіанти кружечків
			for (var i = 0; i < okDiameters.length; i++) {
				if (okDiameters[i] !== 0) {
					myCurrentDoc.Diameter = okDiameters[i].split(':')[0];
					var thisSpaceBetween = okDiameters[i].split(':')[1];
					thisSpaceBetween = thisSpaceBetween > myCurrentDoc.CutterType.minSpaceBetween ? thisSpaceBetween : myCurrentDoc.CutterType.minSpaceBetween;
					thisSpaceBetween = thisSpaceBetween > myCurrentDoc.CutterType.maxSpaceBetween ? myCurrentDoc.CutterType.maxSpaceBetween : thisSpaceBetween;
					var thisFileParams = RozkladkaCircles(myCurrentDoc.Diameter, myCurrentDoc.CutterType, thisSpaceBetween, true);			
					if (thisFileParams.length) {
						myCurrentDoc.Params = thisFileParams[0];
						myCurrentDoc.Figure = translate('Circles');
						okFilesCurrent = okFilesDiameters[okDiameters[i]];				
						totalPages = 0;
						for (var j = 0; j < okFilesCurrent.length; j++) {
							totalPages = totalPages + okFilesCurrent[j].pgCount;
						};							
						CreateCustomDocCircles(myCurrentDoc, thisSpaceBetween);
						ProcessCircles(okFilesCurrent, totalOkFilesLength, thisSpaceBetween);				
					} else {
						// Запам'ятовуємо файли, для яких не вдалося розрахувати розкладку
						for (var k = 0; k < okFilesDiameters[okDiameters[i]].length; k++) {
							badFiles.push({
								theFile: okFilesDiameters[okDiameters[i]][k].theFile,
								reason: translate('Error - No variants')
							});
						}
					};					
				}
			}
			// Перебираємо варіанти прямокутників
			for (var i = 0; i < okSizes.length; i++) {
				if (okSizes[i] !== 0) {
					var thisSize = okSizes[i].split(':')[0];
					var thisRadius = okSizes[i].split(':')[1];
					var thisSpaceBetween = okSizes[i].split(':')[2];
					thisSpaceBetween = thisSpaceBetween > myCurrentDoc.CutterType.minSpaceBetween ? thisSpaceBetween : myCurrentDoc.CutterType.minSpaceBetween;
					thisSpaceBetween = thisSpaceBetween > myCurrentDoc.CutterType.maxSpaceBetween ? myCurrentDoc.CutterType.maxSpaceBetween : thisSpaceBetween;
					thisSpaceBetween = thisRadius && thisSpaceBetween ? thisSpaceBetween : myCurrentDoc.CutterType.minSpaceBetween;
					myCurrentDoc.RectWidth = parseFloat(thisSize.split('x')[0]);
					myCurrentDoc.RectHeight = parseFloat(thisSize.split('x')[1]);
					if (!myCurrentDoc.RectWidth || !myCurrentDoc.RectHeight) {
						// Запам'ятовуємо файли, у яких відсутнія ширина або висота
						for (var k = 0; k < okFilesSizes[okSizes[i]].length; k++) {
							badFiles.push({
								theFile: okFilesSizes[okSizes[i]][k].theFile,
								reason: translate('Error - Not correct size')
							});
						}								
						continue;
					}
					if (thisRadius > myCurrentDoc.RectWidth / 2 || thisRadius > myCurrentDoc.RectHeight / 2) {
						// Запам'ятовуємо файли, радіус скругління яких більший від половини розміру
						for (var k = 0; k < okFilesSizes[okSizes[i]].length; k++) {
							badFiles.push({
								theFile: okFilesSizes[okSizes[i]][k].theFile,
								reason: translate('Error - Too big radius')
							});
						}	
						continue;
					}
					var thisFileParams = RozkladkaRectangles(myCurrentDoc.RectWidth, myCurrentDoc.RectHeight, myCurrentDoc.CutterType, thisSpaceBetween, thisSpaceBetween > 0, true);			
					if (thisFileParams.length) {
						myCurrentDoc.Params = thisFileParams[0];
						myCurrentDoc.Figure = translate('Rectangles');
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
						// Запам'ятовуємо файли, для яких не вдалося розрахувати розкладку
						for (var k = 0; k < okFilesSizes[okSizes[i]].length; k++) {
							badFiles.push({
								theFile: okFilesSizes[okSizes[i]][k].theFile,
								reason: translate('Error - No variants')
							});
						}
					};				
				}
			}			
			break;			
		default:
			break;
	}
	
	function ProcessCircles(okFilesCurrent, totalFilesLength, customSpaceBetween) {

		if (!myCurrentDoc.Params) {
			alert(translate('Error - Creating document'));
			exit();
		} else {
			app.scriptPreferences.userInteractionLevel = UserInteractionLevels.NEVER_INTERACT;
			
			myCurrentDoc.SpaceBetween = customSpaceBetween ? customSpaceBetween : myCurrentDoc.SpaceBetween;
			
			switch (myImposingMethod) {
				case 0: // Кожен вид на окремий лист
					
					var itemsCopies = myCurrentDoc.Params.total || 0;
					
					if (!itemsCopies) {
						alert(translate('Error - Incorrect params'));
						exit();
					}
					
					progress(totalPages * itemsCopies, translate('Circles processing') + (myCurrentDoc && myCurrentDoc.Diameter > 0 ? myCurrentDoc.Diameter + translate('Units mm') : ""));
					
					for (var i = 0; i < okFilesCurrent.length; i++, fileCounter++) {

						progress.details(translate('Creating new document'), false);
						CreateMyDocument(myCurrentDoc);

						myLayer = myDocument.layers.itemByName(PRINTLayer);

						var theFile = File(okFilesCurrent[i].theFile);
						var fileName = File.decode(okFilesCurrent[i].theFile.name).split('.').slice(0, -1).join('.');					
						fileName = fileName.replace(BracketsPattern, '').replace(/^ +| +$/, '');
						myFileName = myFileName.replace(/%names%/g, '');
						var pgCount = okFilesCurrent[i].pgCount;
						
						for (var currentPage = 1, countDone = 0, total = itemsCopies * pgCount; currentPage <= pgCount; currentPage++, pagesTotalProcessedCounter++) {
							
							progress.message(translate('Processing file', {
								fileCounter: fileCounter,
								totalFilesLength: totalFilesLength,
								currentPage: currentPage,
								pgCount: pgCount
							}));

							if (currentPage > 1) {
								if (SaveMultipageFilesAsOneFile) {
									// Додаємо сторінку, якщо вибрано опцію "Зберегти багатосторінковий файл"									
									progress.details(translate('Adding page'), false);
									myDocument.pages.add(LocationOptions.AT_END);
									myDocument.pages.lastItem().marginPreferences.properties = {
										'top': myCurrentDoc.CutterType.marginTop,
										'bottom': myCurrentDoc.CutterType.marginBottom,
										'left': myCurrentDoc.CutterType.marginLeft,
										'right': myCurrentDoc.CutterType.marginRight	
									};
									for (var pi = 0, pageItems = myDocument.layers.itemByName(PLOTTERLayer).allPageItems; pi < pageItems.length; pi++) {
										if (pageItems[pi].isValid && pageItems[pi].parentPage == myDocument.pages.firstItem()) {
											pageItems[pi].duplicate(myDocument.pages.lastItem());
										}
									};
								} else {
									// Створюємо новий документ, якщо не вибрано опцію "Зберегти багатосторінковий файл"		
									progress.details(translate('Creating new document'), false);
									CreateMyDocument(myCurrentDoc);
									myLayer = myDocument.layers.itemByName(PRINTLayer);
								}

							}

							var origin;

							for (var b = 0; b < itemsCopies; b++) {

								countDone++;

								progress.details(translate('Items counter message', {
									countDone: countDone,
									total: total
								}), true);

								if (b == 0) {

									// Перший елемент - плейсхолдер
									origin = myDocument.pages.lastItem().ovals.add(myLayer, LocationOptions.AT_END, {
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
											myCurrentDoc.Params.GeometricBounds[b][0],
											myCurrentDoc.Params.GeometricBounds[b][1],
											myCurrentDoc.Params.GeometricBounds[b][2],
											myCurrentDoc.Params.GeometricBounds[b][3]
										]
									});
									app.pdfPlacePreferences.pageNumber = currentPage;
									origin.place(theFile)[0];
									origin.fit(FitOptions.CONTENT_TO_FRAME);
								} else {
									origin.duplicate([
										myCurrentDoc.Params.GeometricBounds[b][1], // x
										myCurrentDoc.Params.GeometricBounds[b][0]  // y
									]) 
								}

								progress.increment();
							}
							
							// Якщо не вибрано опцію "Зберегти багатосторінковий файл" - зберігаємо лише поточну сторінку
							if (!SaveMultipageFilesAsOneFile) {

								var outputFile = myFileName ? myFileName + "_" : '';
								outputFile += fileName;
								outputFile += pgCount > 1 ? '_page #' + currentPage : "";
								outputFile += "_D=" + myCurrentDoc.Diameter + "(" + myCurrentDoc.SpaceBetween + ")mm";
								outputFile += myCurrentDoc.CutterType.label ? "_" + myCurrentDoc.CutterType.label : '';
								outputFile += myCurrentDoc.CutterType.paperName ? "_" + myCurrentDoc.CutterType.paperName : '';
								outputFile += !myCurrentDoc.CutterType.paperName ? "_" + myCurrentDoc.CutterType.widthSheet + 'x' + myCurrentDoc.CutterType.heightSheet : '';
								myDocument.name = outputFile;
								addMarksToDocument(myCurrentDoc, 'PRINT');

								// Створємо вікно для документа (інакше буде експортовано порожній дркумент!)
								myDocument.windows.add().maximize();
								progress.details(translate('Exporting PDF'), false);								
								try {
									myDocumentsProcessing.push({
										myDocument: myDocument,
										backgroundTask: myDocument.asynchronousExportFile(ExportFormat.pdfType, File(outputFolder + '/' + outputFile + ".pdf"), false, myPDFExportPreset)
									});
								} catch(err) {
									badExport.push({
										myDocument: myDocument,
										reason: translate('Error - Cannot export file', {filename: 'PDF'})
									})
								};
							}
							
						}

						// Якщо вибрано опцію "Зберегти багатосторінковий файл" - зберігаємо багатосторінковий документ
						if (SaveMultipageFilesAsOneFile) {

							var outputFile = myFileName ? myFileName + "_" : "";
							outputFile += fileName;
							outputFile += "_D=" + myCurrentDoc.Diameter + "(" + myCurrentDoc.SpaceBetween + ")mm";
							outputFile += myCurrentDoc.CutterType.label ? "_" + myCurrentDoc.CutterType.label : '';
							outputFile += myCurrentDoc.CutterType.paperName ? "_" + myCurrentDoc.CutterType.paperName : '';
							outputFile += !myCurrentDoc.CutterType.paperName ? "_" + myCurrentDoc.CutterType.widthSheet + 'x' + myCurrentDoc.CutterType.heightSheet : '';
							myDocument.name = outputFile;
							addMarksToDocument(myCurrentDoc, 'PRINT');

							// Створємо вікно для документа (інакше буде експортовано порожній дркумент!)
							myDocument.windows.add().maximize();
							progress.details(translate('Exporting PDF'), false);
							try {
								myDocumentsProcessing.push({
									myDocument: myDocument,
									backgroundTask: myDocument.asynchronousExportFile(ExportFormat.pdfType, File(outputFolder + '/' + outputFile + ".pdf"), false, myPDFExportPreset)
								});
							} catch(err) {
								badExport.push({
									myDocument: myDocument,
									reason: translate('Error - Cannot export file', {filename: 'PDF'})
								})
							};
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
					pagesTotalProcessedCounter = 0;					

					if (!totalFrames) {
						alert(translate('Error - Incorrect params'));
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
					var itemsAddTo = [];
					var itemsMinCount = 0;	
					var itemsCount = 0;						
					
					if (!totalFrames) {
						alert(translate('Error - Incorrect params'));
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
								
					for (var i = pagesTotalProcessedCounter, copiesCounter = 1; i < itemsCopies.length && copiesCounter <= totalPages; i++, copiesCounter++) {
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
			
			progress(itemsCount, translate('Circles processing') + (myCurrentDoc && myCurrentDoc.Diameter > 0 ? myCurrentDoc.Diameter + translate('Units mm') : ""));

			progress.details(translate('Creating new document'), false);
			CreateMyDocument(myCurrentDoc);
			myLayer = myDocument.layers.itemByName(PRINTLayer);

			var fileNames = [];
			
			for (var i = 0, itemIndex = pagesTotalProcessedCounter, countDone = 0, currentPage = 1, lastItem = -1; i < okFilesCurrent.length; i++, fileCounter++) {

				var theFile = File(okFilesCurrent[i].theFile);
				var pgCount = okFilesCurrent[i].pgCount;

				fileNames.push(File.decode(theFile.name).split('.').slice(0, -1).join('.').replace(BracketsPattern, '').replace(/^ +| +$/, ''));

				var origin;				
				
				for (var page = 1; page <= pgCount; page++, itemIndex++, pagesTotalProcessedCounter++) {
					
					progress.message(translate('Processing file', {
								fileCounter: fileCounter,
								totalFilesLength: totalFilesLength,
								currentPage: currentPage,
								pgCount: pgCount
							}));
					
					for (var j = 1, b = lastItem + 1; j <= itemsCopies[itemIndex]; j++, b++) {

						lastItem = b;

						countDone++;

						progress.details(translate('Items counter message', {
									countDone: countDone,
									total: itemsCount
								}), true);

						if (b == 0 || j == 1) {

							// Базовий елемент
							origin = myDocument.pages.lastItem().ovals.add(myLayer, LocationOptions.AT_END, {
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
									myCurrentDoc.Params.GeometricBounds[b][0],
									myCurrentDoc.Params.GeometricBounds[b][1],
									myCurrentDoc.Params.GeometricBounds[b][2],
									myCurrentDoc.Params.GeometricBounds[b][3]
								]
							});
							app.pdfPlacePreferences.pageNumber = page;
							origin.place(theFile)[0];
							origin.fit(FitOptions.CONTENT_TO_FRAME);
						} else {
							origin.duplicate([
								myCurrentDoc.Params.GeometricBounds[b][1], // x
								myCurrentDoc.Params.GeometricBounds[b][0]  // y
							]) 
						}

						progress.increment();

						if ((b == (itemsCount / pagesCount) - 1) && (currentPage != pagesCount)) {
							// Додаємо сторінку
							progress.details(translate('Adding page'), false);
							currentPage++;
							lastItem = -1;
							b = -1;

							myDocument.pages.add(LocationOptions.AT_END);
							myDocument.pages.lastItem().marginPreferences.properties = {
								'top': myCurrentDoc.CutterType.marginTop,
								'bottom': myCurrentDoc.CutterType.marginBottom,
								'left': myCurrentDoc.CutterType.marginLeft,
								'right': myCurrentDoc.CutterType.marginRight	
							};
							for (var pi = 0, pageItems = myDocument.layers.itemByName(PLOTTERLayer).allPageItems; pi < pageItems.length; pi++) {
								if (pageItems[pi].isValid && pageItems[pi].parentPage == myDocument.pages.firstItem()) {
									pageItems[pi].duplicate(myDocument.pages.lastItem());
								}
							};
						}
					}
				}
			}
	
			var outputFile = myFileName
								.replace(BracketsPattern, '')
								.replace(/^ +| +$/, '')
								.replace(/%names%/, fileNames.join(' + '))
								.replace(/%names%/g, '');
			outputFile += "_D=" + myCurrentDoc.Diameter + "(" + myCurrentDoc.SpaceBetween + ")mm";
			outputFile += myCurrentDoc.CutterType.label ? "_" + myCurrentDoc.CutterType.label : '';
			outputFile += myCurrentDoc.CutterType.paperName ? "_" + myCurrentDoc.CutterType.paperName : '';
			outputFile += !myCurrentDoc.CutterType.paperName ? "_" + myCurrentDoc.CutterType.widthSheet + 'x' + myCurrentDoc.CutterType.heightSheet : '';
			myDocument.name = outputFile;
			addMarksToDocument(myCurrentDoc, 'PRINT');

			// Створємо вікно для документа (інакше буде експортовано порожній дркумент!)
			myDocument.windows.add().maximize();			
			progress.details(translate('Exporting PDF'), false);
			try {
				myDocumentsProcessing.push({
					myDocument: myDocument,
					backgroundTask: myDocument.asynchronousExportFile(ExportFormat.pdfType, File(outputFolder + '/' + outputFile + ".pdf"), false, myPDFExportPreset)
				});
			} catch(err) {
				badExport.push({
					myDocument: myDocument,
					reason: translate('Error - Cannot export file', {filename: 'PDF'})
				})
			};	
		}		

		progress.close();		
	}

	function ProcessRectangles(okFilesCurrent, totalFilesLength, customRoundCornersValue, customSpaceBetween) {
		
		myCurrentDoc.RoundCornersValue = customRoundCornersValue ? customRoundCornersValue : myCurrentDoc.RoundCornersValue;
		myCurrentDoc.IsRoundedCorners = customRoundCornersValue ? true : myCurrentDoc.IsRoundedCorners;
		myCurrentDoc.SpaceBetween = customSpaceBetween ? customSpaceBetween : myCurrentDoc.SpaceBetween;

		if (!myCurrentDoc.Params) {
			alert(translate('Error - Creating document'));
			exit();
		} else {
			app.scriptPreferences.userInteractionLevel = UserInteractionLevels.NEVER_INTERACT;		
			
			switch (myImposingMethod) {
				case 0: // Кожен вид на окремий лист
				
					var itemsCopies = myCurrentDoc.Params.total || 0;
					
					if (!itemsCopies) {
						alert(translate('Error - Incorrect params'));
						exit();
					}
					
					progress(totalPages * itemsCopies, translate('Rectangles processing') + (myCurrentDoc && myCurrentDoc.RectWidth > 0 ? myCurrentDoc.RectWidth + "x" + myCurrentDoc.RectHeight + translate('Units mm') : "") + (myCurrentDoc.IsRoundedCorners && myCurrentDoc.RoundCornersValue > 0 ? " R=" + myCurrentDoc.RoundCornersValue + translate('Units mm') : ""));
								
					for (var i = 0; i < okFilesCurrent.length; i++, fileCounter++) {

						progress.details(translate('Creating new document'), false);
						CreateMyDocument(myCurrentDoc);

						myLayer = myDocument.layers.itemByName(PRINTLayer);

						var theFile = File(okFilesCurrent[i].theFile);
						var fileName = File.decode(okFilesCurrent[i].theFile.name).split('.').slice(0, -1).join('.');	
						fileName = fileName.replace(BracketsPattern, '').replace(/^ +| +$/, '');
						myFileName = myFileName.replace(/%names%/g, '');
						var pgCount = okFilesCurrent[i].pgCount;
						
						for (var currentPage = 1, countDone = 0, total = itemsCopies * pgCount; currentPage <= pgCount; currentPage++, pagesTotalProcessedCounter++) {
							
							progress.message(translate('Processing file', {
								fileCounter: fileCounter,
								totalFilesLength: totalFilesLength,
								currentPage: currentPage,
								pgCount: pgCount
							}));

							if (currentPage > 1) {
								if (SaveMultipageFilesAsOneFile) {
									// Додаємо сторінку, якщо вибрано опцію "Зберегти багатосторінковий файл"									
									progress.details(translate('Adding page'), false);	
									myDocument.pages.add(LocationOptions.AT_END);
									myDocument.pages.lastItem().marginPreferences.properties = {
										'top': myCurrentDoc.CutterType.marginTop,
										'bottom': myCurrentDoc.CutterType.marginBottom,
										'left': myCurrentDoc.CutterType.marginLeft,
										'right': myCurrentDoc.CutterType.marginRight	
									};
									for (var pi = 0, pageItems = myDocument.layers.itemByName(PLOTTERLayer).allPageItems; pi < pageItems.length; pi++) {
										if (pageItems[pi].isValid && pageItems[pi].parentPage == myDocument.pages.firstItem()) {
											pageItems[pi].duplicate(myDocument.pages.lastItem());
										}
									};
								} else {
									// Створюємо новий документ, якщо не вибрано опцію "Зберегти багатосторінковий файл"		
									progress.details(translate('Creating new document'), false);
									CreateMyDocument(myCurrentDoc);
									myLayer = myDocument.layers.itemByName(PRINTLayer);
								}
							}

							var origin;
							var newbie;
							var last;

							var refPoint = app.changeObjectPreferences.anchorPoint;
    
    						app.changeObjectPreferences.anchorPoint = AnchorPoint.CENTER_ANCHOR;

							for (var b = 0; b < itemsCopies; b++) {

								countDone++;

								progress.details(translate('Items counter message', {
									countDone: countDone,
									total: total
								}), true);

								if (b == 0 || myCurrentDoc.Params.rotationCompensation[b - 1] != myCurrentDoc.Params.rotationCompensation[b]) {
									// Базовий елемент

									myCurrentDoc.RoundCornersValue = customRoundCornersValue ? customRoundCornersValue : myCurrentDoc.RoundCornersValue;
									myCurrentDoc.IsRoundedCorners = customRoundCornersValue ? true : myCurrentDoc.IsRoundedCorners;							

									var rectProperties = {
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
											myCurrentDoc.Params.GeometricBounds[b][0],
											myCurrentDoc.Params.GeometricBounds[b][1],
											myCurrentDoc.Params.GeometricBounds[b][2],
											myCurrentDoc.Params.GeometricBounds[b][3]
										]
									}

									if (myCurrentDoc.IsRoundedCorners) {
										rectProperties['bottomLeftCornerOption'] = CornerOptions.ROUNDED_CORNER;
										rectProperties['bottomLeftCornerRadius'] = myCurrentDoc.RoundCornersValue || 0;
										rectProperties['bottomRightCornerOption'] = CornerOptions.ROUNDED_CORNER;
										rectProperties['bottomRightCornerRadius'] = myCurrentDoc.RoundCornersValue || 0;
										rectProperties['topLeftCornerOption'] = CornerOptions.ROUNDED_CORNER;
										rectProperties['topLeftCornerRadius'] = myCurrentDoc.RoundCornersValue || 0;
										rectProperties['topRightCornerOption'] = CornerOptions.ROUNDED_CORNER;
										rectProperties['topRightCornerRadius'] = myCurrentDoc.RoundCornersValue || 0;
									}

									origin = newbie = myDocument.pages.lastItem().rectangles.add(myLayer, LocationOptions.AT_END, rectProperties);
									app.pdfPlacePreferences.pageNumber = currentPage;																		
									origin.place(theFile)[0];
									// Компенсація повороту макета
									origin.graphics.everyItem().rotationAngle = myCurrentDoc.Params.rotationCompensation[b];
									origin.fit(FitOptions.CONTENT_TO_FRAME);									
								} else {
									// Створємо дублікат оригінального елементу в нові координати
									newbie = last.duplicate([
										myCurrentDoc.Params.GeometricBounds[b][1], // x
										myCurrentDoc.Params.GeometricBounds[b][0]  // y
									]);
								}

								// Компенсація накладання при роздвижці 0 (застосовується до попереднього)
								if (myCurrentDoc.SpaceBetween == 0) {
									var curBounds;
									if (b != 0 && last) {
										curBounds = last.geometricBounds;
										last.geometricBounds = [
											curBounds[0] + myCurrentDoc.Params.bleedCompensation[b - 1][0],
											curBounds[1] + myCurrentDoc.Params.bleedCompensation[b - 1][1],
											curBounds[2] + myCurrentDoc.Params.bleedCompensation[b - 1][2],
											curBounds[3] + myCurrentDoc.Params.bleedCompensation[b - 1][3]
										];
									} else if (b == itemsCopies - 1) {
										curBounds = newbie.geometricBounds;
										newbie.geometricBounds = [
											curBounds[0] + myCurrentDoc.Params.bleedCompensation[b][0],
											curBounds[1] + myCurrentDoc.Params.bleedCompensation[b][1],
											curBounds[2] + myCurrentDoc.Params.bleedCompensation[b][2],
											curBounds[3] + myCurrentDoc.Params.bleedCompensation[b][3]
										];
									}									
								}

								last = newbie;				

								progress.increment();
							}

							app.changeObjectPreferences.anchorPoint = refPoint;
							
							// Якщо не вибрано опцію "Зберегти багатосторінковий файл" - зберігаємо лише поточну сторінку
							if (!SaveMultipageFilesAsOneFile) {

								var outputFile = myFileName ? myFileName + "_" : "";
								outputFile += fileName;
								outputFile += pgCount > 1 ? '_page #' + currentPage : "";
								outputFile += "_" + myCurrentDoc.RectWidth + "x" + myCurrentDoc.RectHeight;
								outputFile += myCurrentDoc.IsRoundedCorners && myCurrentDoc.RoundCornersValue > 0 ? " R=" + myCurrentDoc.RoundCornersValue + " " : "";
								outputFile += "(" + myCurrentDoc.SpaceBetween + ")mm";
								outputFile += myCurrentDoc.CutterType.label ? "_" + myCurrentDoc.CutterType.label : '';
								outputFile += myCurrentDoc.CutterType.paperName ? "_" + myCurrentDoc.CutterType.paperName : '';
								outputFile += !myCurrentDoc.CutterType.paperName ? "_" + myCurrentDoc.CutterType.widthSheet + 'x' + myCurrentDoc.CutterType.heightSheet : '';
								myDocument.name = outputFile;
								addMarksToDocument(myCurrentDoc, 'PRINT');

								// Створємо вікно для документа (інакше буде експортовано порожній дркумент!)
								myDocument.windows.add().maximize();								
								progress.details(translate('Exporting PDF'), false);
								try {
									myDocumentsProcessing.push({
										myDocument: myDocument,
										backgroundTask: myDocument.asynchronousExportFile(ExportFormat.pdfType, File(outputFolder + '/' + outputFile + ".pdf"), false, myPDFExportPreset)
									});	
								} catch(err) {
									badExport.push({
										myDocument: myDocument,
										reason: translate('Error - Cannot export file', {filename: 'PDF'})
									})
								};						
							}
							
						}

						// Якщо вибрано опцію "Зберегти багатосторінковий файл" - зберігаємо багатосторінковий документ
						if (SaveMultipageFilesAsOneFile) {
							var outputFile = myFileName ? myFileName + "_" : "";
							outputFile += fileName;
							outputFile += "_" + myCurrentDoc.RectWidth + "x" + myCurrentDoc.RectHeight;
							outputFile += myCurrentDoc.IsRoundedCorners && myCurrentDoc.RoundCornersValue > 0 ? " R=" + myCurrentDoc.RoundCornersValue + " " : "";
							outputFile += "(" + myCurrentDoc.SpaceBetween + ")mm";
							outputFile += myCurrentDoc.CutterType.label ? "_" + myCurrentDoc.CutterType.label : '';
							outputFile += myCurrentDoc.CutterType.paperName ? "_" + myCurrentDoc.CutterType.paperName : '';
							outputFile += !myCurrentDoc.CutterType.paperName ? "_" + myCurrentDoc.CutterType.widthSheet + 'x' + myCurrentDoc.CutterType.heightSheet : '';

							myDocument.name = outputFile;
							addMarksToDocument(myCurrentDoc, 'PRINT');

							// Створємо вікно для документа (інакше буде експортовано порожній документ!)
							myDocument.windows.add().maximize();								
							progress.details(translate('Exporting PDF'), false);
							try {
								myDocumentsProcessing.push({
									myDocument: myDocument,
									backgroundTask: myDocument.asynchronousExportFile(ExportFormat.pdfType, File(outputFolder + '/' + outputFile + ".pdf"), false, myPDFExportPreset)
								});
							} catch(err) {
								badExport.push({
									myDocument: myDocument,
									reason: translate('Error - Cannot export file', {filename: 'PDF'})
								})
							};
						}
						
					}	
					
					progress.close();
					
					break;
				case 1:
				    // Вмістити всі види на 1+ лист
		
					var itemsCopies = [];
					var itemsCount = 0;
					var pagesCount = 1;
					var totalFrames = myCurrentDoc.Params.total ? myCurrentDoc.Params.total : 0;
					pagesTotalProcessedCounter = 0;
					
					if (!totalFrames) {
						alert(translate('Error - Incorrect params'));
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
                    var pagesCount = 1;
					var totalFrames = myCurrentDoc.Params.total ? myCurrentDoc.Params.total : 0;
					var itemsAddTo = [];
					var itemsMinCount = 0;	
					var itemsCount = 0;                    
                
					if (!totalFrames) {
						alert(translate('Error - Incorrect params'));
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

					for (var i = pagesTotalProcessedCounter, copiesCounter = 1; i < itemsCopies.length && copiesCounter <= totalPages; i++, copiesCounter++) {
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
			
			progress(itemsCount, translate('Rectangles processing') + (myCurrentDoc && myCurrentDoc.RectWidth > 0 ? myCurrentDoc.RectWidth + "x" + myCurrentDoc.RectHeight + translate('Units mm') : "") + (myCurrentDoc.IsRoundedCorners && myCurrentDoc.RoundCornersValue > 0 ? " R=" + myCurrentDoc.RoundCornersValue + translate('Units mm') : ""));

			progress.details(translate('Creating new document'), false);
			CreateMyDocument(myCurrentDoc);
			myLayer = myDocument.layers.itemByName(PRINTLayer);

			var fileNames = [];

			var origin;
			var newbie;
			var last;

			var refPoint = app.changeObjectPreferences.anchorPoint;
			
			app.changeObjectPreferences.anchorPoint = AnchorPoint.CENTER_ANCHOR;			

			for (var i = 0, itemIndex = pagesTotalProcessedCounter, countDone = 0, currentPage = 1, lastItem = -1; i < okFilesCurrent.length; i++, fileCounter++) {
				// Parse the PDF file and extract needed info
				var theFile = File(okFilesCurrent[i].theFile);
				var pgCount = okFilesCurrent[i].pgCount;

				fileNames.push(File.decode(theFile.name).split('.').slice(0, -1).join('.').replace(BracketsPattern, '').replace(/^ +| +$/, ''));
				
				for (var page = 1; page <= pgCount; page++, itemIndex++, pagesTotalProcessedCounter++) {
					
					progress.message(translate('Processing file', {
								fileCounter: fileCounter,
								totalFilesLength: totalFilesLength,
								currentPage: currentPage,
								pgCount: pgCount
							}));					
						
					for (var j = 1, b = lastItem + 1; j <= itemsCopies[itemIndex]; j++, b++) {

						lastItem = b;

						countDone++;

						progress.details(translate('Items counter message', {
									countDone: countDone,
									total: itemsCount
								}), true);

						if (b == 0 || j == 1 || myCurrentDoc.Params.rotationCompensation[b - 1] != myCurrentDoc.Params.rotationCompensation[b]) {
							// Базовий елемент
							myCurrentDoc.RoundCornersValue = customRoundCornersValue ? customRoundCornersValue : myCurrentDoc.RoundCornersValue;
							myCurrentDoc.IsRoundedCorners = customRoundCornersValue ? true : myCurrentDoc.IsRoundedCorners;							

							var rectProperties = {
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
									myCurrentDoc.Params.GeometricBounds[b][0],
									myCurrentDoc.Params.GeometricBounds[b][1],
									myCurrentDoc.Params.GeometricBounds[b][2],
									myCurrentDoc.Params.GeometricBounds[b][3]
								]
							}

							if (myCurrentDoc.IsRoundedCorners) {
								rectProperties['bottomLeftCornerOption'] = CornerOptions.ROUNDED_CORNER;
								rectProperties['bottomLeftCornerRadius'] = myCurrentDoc.RoundCornersValue || 0;
								rectProperties['bottomRightCornerOption'] = CornerOptions.ROUNDED_CORNER;
								rectProperties['bottomRightCornerRadius'] = myCurrentDoc.RoundCornersValue || 0;
								rectProperties['topLeftCornerOption'] = CornerOptions.ROUNDED_CORNER;
								rectProperties['topLeftCornerRadius'] = myCurrentDoc.RoundCornersValue || 0;
								rectProperties['topRightCornerOption'] = CornerOptions.ROUNDED_CORNER;
								rectProperties['topRightCornerRadius'] = myCurrentDoc.RoundCornersValue || 0;
							}

							origin = newbie = myDocument.pages.lastItem().rectangles.add(myLayer, LocationOptions.AT_END, rectProperties);
							app.pdfPlacePreferences.pageNumber = page;
							origin.place(theFile)[0];
							// Компенсація повороту макета
							origin.graphics.everyItem().rotationAngle = myCurrentDoc.Params.rotationCompensation[b];
							origin.fit(FitOptions.CONTENT_TO_FRAME);									
						} else {
							// Створємо дублікат оригінального елементу в нові координати
							newbie = last.duplicate([
								myCurrentDoc.Params.GeometricBounds[b][1], // x
								myCurrentDoc.Params.GeometricBounds[b][0]  // y
							]);
						}

						// Компенсація накладання при роздвижці 0 (застосовується до попереднього)
						if (myCurrentDoc.SpaceBetween == 0) {
							var curBounds;
							if (b != 0 && last) {
								curBounds = last.geometricBounds;
								last.geometricBounds = [
									curBounds[0] + myCurrentDoc.Params.bleedCompensation[b - 1][0],
									curBounds[1] + myCurrentDoc.Params.bleedCompensation[b - 1][1],
									curBounds[2] + myCurrentDoc.Params.bleedCompensation[b - 1][2],
									curBounds[3] + myCurrentDoc.Params.bleedCompensation[b - 1][3]
								];
							} else if (b == (itemsCount / pagesCount) - 1) {
								curBounds = newbie.geometricBounds;
								newbie.geometricBounds = [
									curBounds[0] + myCurrentDoc.Params.bleedCompensation[b][0],
									curBounds[1] + myCurrentDoc.Params.bleedCompensation[b][1],
									curBounds[2] + myCurrentDoc.Params.bleedCompensation[b][2],
									curBounds[3] + myCurrentDoc.Params.bleedCompensation[b][3]
								];
							}									
						}

						last = newbie;				

						progress.increment();

						if ((b == (itemsCount / pagesCount) - 1) && (currentPage != pagesCount)) {
							// Додаємо сторінку
							progress.details(translate('Adding page'), false);
							currentPage++;
							lastItem = -1;
							b = -1;

							myDocument.pages.add(LocationOptions.AT_END);
							myDocument.pages.lastItem().marginPreferences.properties = {
								'top': myCurrentDoc.CutterType.marginTop,
								'bottom': myCurrentDoc.CutterType.marginBottom,
								'left': myCurrentDoc.CutterType.marginLeft,
								'right': myCurrentDoc.CutterType.marginRight	
							};
							for (var pi = 0, pageItems = myDocument.layers.itemByName(PLOTTERLayer).allPageItems; pi < pageItems.length; pi++) {
								if (pageItems[pi].isValid && pageItems[pi].parentPage == myDocument.pages.firstItem()) {
									pageItems[pi].duplicate(myDocument.pages.lastItem());
								}
							};
						}						

					}
														
				}
			}

			app.changeObjectPreferences.anchorPoint = refPoint;

			var outputFile = myFileName
								.replace(BracketsPattern, '')
								.replace(/^ +| +$/, '')
								.replace(/%names%/, fileNames.join(' + '))
								.replace(/%names%/g, '');	
			outputFile += "_" + myCurrentDoc.RectWidth + "x" + myCurrentDoc.RectHeight;
			outputFile += myCurrentDoc.IsRoundedCorners && myCurrentDoc.RoundCornersValue > 0 ? " R=" + myCurrentDoc.RoundCornersValue + " " : "";
			outputFile += "(" + myCurrentDoc.SpaceBetween + ")mm";
			outputFile += myCurrentDoc.CutterType.label ? "_" + myCurrentDoc.CutterType.label : '';
			outputFile += myCurrentDoc.CutterType.paperName ? "_" + myCurrentDoc.CutterType.paperName : '';
			outputFile += !myCurrentDoc.CutterType.paperName ? "_" + myCurrentDoc.CutterType.widthSheet + 'x' + myCurrentDoc.CutterType.heightSheet : '';

			myDocument.name = outputFile;

			addMarksToDocument(myCurrentDoc, 'PRINT');

			// Створємо вікно для документа (інакше буде експортовано порожній дркумент!)
			myDocument.windows.add().maximize();
			progress.details(translate('Exporting PDF'), false);

			try {
				myDocumentsProcessing.push({
					myDocument: myDocument,
					backgroundTask: myDocument.asynchronousExportFile(ExportFormat.pdfType, File(outputFolder + '/' + outputFile + ".pdf"), false, myPDFExportPreset)
				});
			} catch(err) {
				badExport.push({
					myDocument: myDocument,
					reason: translate('Error - Cannot export file', {filename: 'PDF'})
				})
			};
		}

		progress.close();
	}

	function ProcessedPercentCount() {
		var percentDone = 0;
		for (var i = 0; i < myDocumentsProcessing.length; i++) {
			if (myDocumentsProcessing[i].backgroundTask.status != TaskState.COMPLETED && myDocumentsProcessing[i].backgroundTask.status != TaskState.CANCELLED) {
				percentDone += myDocumentsProcessing[i].backgroundTask.percentDone;
			} else {
				percentDone += 100;
			}
		};
		return percentDone;
	}	

	// Wait all done.

	var totalPercent = myDocumentsProcessing.length * 100;

	progress(totalPercent, translate('Background tasks running'));
	progress.message(translate('Background tasks wait'));
	progress.details(translate('Background tasks message'), false);
	progress.value(ProcessedPercentCount());

	// Очікуємо завершення всіх фонових експортів
	//app.waitForAllTasks();
	while (ProcessedPercentCount() < totalPercent) {
		progress.value(ProcessedPercentCount());
		$.sleep(1000);
	}

	progress.close();	

	for (var i = 0; i < myDocumentsProcessing.length; i++) {

		if (myDocumentsProcessing[i].backgroundTask.alerts.length) {
			badExport.push({
				myDocument: myDocumentsProcessing[i].myDocument,
				reason: translate('Error - Failed to export')
			})
		} else {
			myDocumentsProcessing[i].myDocument.close(SaveOptions.NO);
		}
	};

	// Відновлюємо налаштування
	app.pdfPlacePreferences.pageNumber = 1;
	app.scriptPreferences.userInteractionLevel = UserInteractionLevels.interactWithAll;	
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

	// Повідомляємо про необроблені файли
	if (badFiles.length || badExport.length) {
		// BadFilesListWindow
		// ===================
		var BadFilesListWindow = new Window("dialog"); 
			BadFilesListWindow.text = translate('Skipped files title'); 
			BadFilesListWindow.orientation = "column"; 
			BadFilesListWindow.alignChildren = ["left","top"];
			BadFilesListWindow.preferredSize.width = 720; 			
			BadFilesListWindow.spacing = 10; 
			BadFilesListWindow.margins = 5;

		var FilesGroup = BadFilesListWindow.add("group", undefined, {name: "FilesGroup"}); 
			FilesGroup.orientation = "column"; 
			FilesGroup.alignChildren = ["left","center"]; 
			FilesGroup.spacing = 10; 
			FilesGroup.margins = 0; 
			FilesGroup.alignment = ["fill","top"]; 			

		var FilesNameList = FilesGroup.add('edittext {properties: {name: "FilesNameList", readonly: true, multiline: true, scrollable: true}}'); 
			FilesNameList.preferredSize.width = 700; 
			FilesNameList.preferredSize.height = 100;
			FilesNameList.text = "";
			for (var i = 0; i < badFiles.length; i++) {			
				FilesNameList.text += File.decode(badFiles[i].theFile.name) + " (" + badFiles[i].reason + ")\n";
			}
			for (var i = 0; i < badExport.length; i++) {			
				FilesNameList.text += badExport[i].myDocument.name + " (" + badExport[i].reason + ")\n";
			}						
		var ButtonsGroup = BadFilesListWindow.add("group", undefined, {name: "ButtonsGroup"}); 
			BadFilesListWindow.orientation = "column"; 
			BadFilesListWindow.alignChildren = ["right","center"]; 
			BadFilesListWindow.spacing = 10; 
			BadFilesListWindow.margins = 15; 
			BadFilesListWindow.alignment = ["fill","top"]; 

		var Ok = ButtonsGroup.add("button", undefined, undefined, {name: "Ok"}); 
			Ok.text = translate('Accept Btn');
			Ok.onClick = function() {
				BadFilesListWindow.close(0);
				BadFilesListWindow = null;
			}
			
		BadFilesListWindow.show();
	}	
}

// Вікно відображення прогресу

function progress(steps, title) {

    var bar,
		text,
		window,
		details;
	
	var timer = {
		isActive: false,
		startedAt: null,
		lastActionAt: null,
		prevActionAt: null,
		processingEachTime: [],
		growthRates: [],
		start: function() {
			this.clear();
			this.isActive = true;
			this.startedAt = new Date();
			this.prevActionAt = this.startedAt;
		},
		action: function() {
			this.lastActionAt = new Date();
			this.processingEachTime.push(this.lastActionAt - this.prevActionAt);
			this.prevActionAt = this.lastActionAt;
		},
		clear: function() {
			this.isActive = false;
			this.startedAt = null;
			this.lastActionAt = null;
			this.processingEachTime = [];
			this.growthRates = [];
		},			
		totalSpent: function() {
			if (this.lastActionAt && this.startedAt) return this.lastActionAt - this.startedAt;
			return null;
		},
		timeLeft: function(averageCount, chunkSize) {

			averageCount = averageCount ? parseInt(averageCount) : 30;
			chunkSize = chunkSize ? parseInt(chunkSize) : 100;

			this.growthRate(this.processingEachTime, averageCount, chunkSize);
			const avgRate = this.growthRates.reduce(function(sum, curr) {
				return sum + curr;
			}, 0) / this.growthRates.length || 0;
			const avgTime = this.processingEachTime.slice(-averageCount).reduce(function(sum, curr) {
				return sum + curr;
			}, 0) / averageCount || this.processingEachTime[this.processingEachTime.length - 1];
			if (avgTime && bar) return (bar.maxvalue - bar.value) * avgTime * (1 + avgRate) * (bar.maxvalue / bar.value);
			return null;
		},
		growthRate: function(arr, averageSumCount, partSize) {

			if (partSize < 2 * averageSumCount) return null;
			if (arr.length < partSize) return null;
			
			for (var i = 0, j = arr.length, k = 0; i < j; i += partSize, k++) {
				var temporary = arr.slice(i, i + partSize);				
				if (temporary.length < partSize) continue;				
				if (k <= this.growthRates.length) continue;				
				var first = temporary.reduce(function(sum, curr, index) {
					if (index < averageSumCount) return sum + curr;
					return sum;
				}, 0) / averageSumCount;     
				var last = temporary.reduce(function(sum, curr, index) {
					if (index >= temporary.length - averageSumCount) return sum + curr;
					return sum;
				}, 0) / averageSumCount;
				this.growthRates.push(this.rate(first, last, temporary.length));
			}			
		},
		rate: function(first, last, len) {
			if (!first || !last || !len) return 0;
			return Math.pow(last / first, 1 / len) - 1;
		}
	}

    window = new Window("window", title || "", undefined, {closeButton: false});

    text = window.add("statictext");	
	details = window.add("statictext");

    text.preferredSize = [450, -1]; // 450 pixels wide, default height.	
    details.preferredSize = [450, -1]; // 450 pixels wide, default height.

    if (steps) {

        bar = window.add("progressbar", undefined, 0, steps);

        bar.preferredSize = [450, -1]; // 450 pixels wide, default height.

    }

    progress.close = function () {

        window.close();

    };

    progress.increment = function (val) {
		
		if (bar && bar.value == 0 && !timer.isActive) timer.start();
		
        if (val && val > 0) 
			bar.value += val
		else
			bar.value++;

		timer.action();

    };

    progress.value = function (val) {

		if (val && val > 0) {
		
			if (bar && bar.value == 0 && !timer.isActive) timer.start();
			
			bar.value = val;

			timer.action();
		}

    };

    progress.message = function (message) {

		if (message) text.text = message;
		if (!message) text.text = "";
		
		details.text = "";

    };
	
    progress.details = function (detailsText, showTimeleft, averageCount, chunkSize) {
		
		if (bar && bar.value == 0 && !timer.isActive) timer.start();
		
		if (!detailsText) detailsText = "";
		
		if (showTimeleft) detailsText = detailsText + progress.timeLeftParser(averageCount, chunkSize);		
		
		details.text = detailsText;

    };
	
	progress.timeLeftParser = function (averageCount, chunkSize) {	

		const timeLeft = timer.timeLeft(averageCount, chunkSize);

		var message = translate('Timeleft calculating');
		
		if (!timeLeft) return message;
		
		var milliseconds = Math.floor((timeLeft % 1000) / 100),
			seconds = Math.floor((timeLeft / 1000) % 60),
			minutes = Math.floor((timeLeft / (1000 * 60)) % 60),
			hours = Math.floor((timeLeft / (1000 * 60 * 60)) % 24);

		if (bar.value / bar.maxvalue <= 0.5 && minutes > 0) {
			minutes += (seconds > 30) ? 1 : 0;
			message = " (" + translate('Timeleft message') + " ~" + (hours > 0 ? " " + hours + translate('hours') : "") + (hours <= 0 || minutes > 0 ? " " + minutes + translate('minutes') + ")" : ")");
		} else {
			message = " (" + translate('Timeleft message') + " ~" + (hours > 0 ? " " + hours + translate('hours') : "") + (hours > 0 || minutes > 0 ? " " + minutes + translate('minutes') : "") + " " + seconds + translate('seconds') + ")";
		}

		return message;
		
	}

    window.show();

}

// Створення документу з мітками
function CreateMyDocument(myCurrentDoc) {

	try {
		var Params = myCurrentDoc.Params;

		myDocument = app.documents.add(false);

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
		
		var PlotterLayer = myDocument.layers.add({
			'name': PLOTTERLayer
		});

		var CutLayer = myDocument.layers.add({
			'name': CUTLayer
		});
	} catch(e) {
		alert(e.massage || translate('Error - Unknown document failure'), "Script Alert", true);
		myDocument.windows.add().maximize();
		exit();
	}	
}

function addMarksToDocument(myCurrentDoc, docType) {

	//try {

		if (!myCurrentDoc) throw new Error(translate('Error - No document'));

		var PlotterLayer = myDocument.layers.itemByName(PLOTTERLayer) || myDocument.layers.add({'name': PLOTTERLayer});

		if (myCurrentDoc.CutterType.marksFile && myCurrentDoc.CutterType.marksFile != "") {

			var marksFile = File(myCurrentDoc.CutterType.marksFile);

			if (marksFile.open("r")) {
				marksFile.close();			
				if (progress) progress.details(translate('Importing marks'), false);	

				var pages = myDocument.pages.everyItem().getElements();

				for (var i = 0; i < pages.length; i++) {
					if (!pages[i].isValid) continue;
					var MarksPlacement = pages[i].rectangles.add(PlotterLayer, LocationOptions.AT_BEGINNING, {
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
					MarksPlacement.place(marksFile)[0];			
					app.pdfPlacePreferences.transparentBackground = false;
				}
			} else {
				throw new Error(translate('Error - No access to marks file') + myCurrentDoc.CutterType.marksFile);
			}		
		}
		if (myCurrentDoc.CutterType.marksProperties && myCurrentDoc.CutterType.marksProperties.length) {
			if (progress) progress.details(translate('Generating marks'), false);
			if (!myCurrentDoc.Params.contoursBounds) throw new Error(translate('Error - No working frame data'));
			generateCutterMarks(myDocument, myCurrentDoc, PlotterLayer, docType);
		}
	/*
	} catch(e) {
		alert(e.massage || translate('Error - Unknown marks error'), "Script Alert", true);
		myDocument.windows.add().maximize();
		exit();
	} */
}

// Створення шаблону документа для розкладки кружечків
function CreateCustomDocCircles(myCurrentDoc, customSpaceBetween) {
	
	var Params = myCurrentDoc.Params;
	
	myCurrentDoc.SpaceBetween = customSpaceBetween ? customSpaceBetween : myCurrentDoc.SpaceBetween;
	
	progress(3 + Params.total, translate('Preparing document'));
	progress.message(translate('Prepare circular cut', {Diameter: Params.Diameter}));

	progress.details(translate('Creating new document'), false);
	CreateMyDocument(myCurrentDoc);
	progress.increment();

	var CutLayer = myDocument.layers.itemByName(CUTLayer);
	var firstPage = myDocument.pages.firstItem();		
	
	progress.details(translate('Adding elements'), false);
	
	var documentRotated = Params.widthSheet != myCurrentDoc.CutterType.widthSheet;
	
	var Bleeds = myCurrentDoc.IsZeroBleeds ? 0 : myCurrentDoc.CutterType.minSpaceBetween / 2;

	// Координати фреймів для вставки макетів
	myCurrentDoc.Params.GeometricBounds = [];

	var contourColor = myDocument.colors.add({
			"colorValue": myCurrentDoc.CutterType.contourColor,
			"model": ColorModel.PROCESS,
			"space": ColorSpace.CMYK,
			"name": "CONTOUR"
		});	

	const AddOval = function(thisBounds) {

		var ovalsProperties = {
			'fillColor': 'None',							
			'geometricBounds': thisBounds
		};

		if (myCurrentDoc.IsSaveFileWithCut) {
			ovalsProperties['strokeWeight'] = 0.5;
			ovalsProperties['strokeColor'] = contourColor;
			ovalsProperties['strokeType'] = 'Solid';
			ovalsProperties['strokeAlignment'] = StrokeAlignment.CENTER_ALIGNMENT;
		} else {
			ovalsProperties['strokeWeight'] = 0;
			ovalsProperties['strokeColor'] = 'None';
		}

		firstPage.ovals.add(CutLayer, LocationOptions.AT_END, ovalsProperties);

		// Координати фрейма для вставки макета
		myCurrentDoc.Params.GeometricBounds.push([
			thisBounds[0] - Bleeds,
			thisBounds[1] - Bleeds,
			thisBounds[2] + Bleeds,
			thisBounds[3] + Bleeds
		]);

		progress.increment();
	};

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
						AddOval([
								verticalOffset + Params.DistanceYCenters * i,
								horizontalOffset + Params.DistanceXCenters * j,
								verticalOffset + Params.DistanceYCenters * i + Params.Diameter,
								horizontalOffset + Params.DistanceXCenters * j + Params.Diameter
							]);
					}					
				} else {
					// Even row
					for (var j = 0; j < Params.countXBig; j++) {
						AddOval([
								verticalOffset + Params.DistanceYCenters * i,
								horizontalOffset + Params.DistanceXCenters * j,
								verticalOffset + Params.DistanceYCenters * i + Params.Diameter,
								horizontalOffset + Params.DistanceXCenters * j + Params.Diameter
							]);											
					}					
				};
			}				
			break;
		case 2:
			var totalWidthBig = Params.Diameter + Params.DistanceXCenters * (Params.countXBig - 1);
			var totalWidthSmall = Params.Diameter + Params.DistanceXCenters * (Params.countXSmall - 1);
			if (Params.DistanceYCenters > Params.Diameter / 2 + myCurrentDoc.SpaceBetween) {
				var DistanceYCentersCurrent = Params.DistanceYCenters;
				var totalHeight = Params.Diameter + Params.DistanceYCenters * (Params.countYBigPerekladom + Params.countYSmall - 1);
			} else {
				var DistanceYCentersCurrent = Params.Diameter + myCurrentDoc.SpaceBetween;
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
							if (Params.DistanceYCenters > Params.Diameter / 2 + myCurrentDoc.SpaceBetween) {							
								AddOval([
											verticalOffset + Params.DistanceYCenters * i,
											horizontalOffsetSmall + Params.DistanceXCenters * j,
											verticalOffset + Params.DistanceYCenters * i + Params.Diameter,
											horizontalOffsetSmall + Params.DistanceXCenters * j + Params.Diameter
										]);								
							} else {
								AddOval([
											verticalOffset + Params.DistanceYCenters + DistanceYCentersCurrent * countSmall,
											horizontalOffsetSmall + Params.DistanceXCenters * j,
											verticalOffset + Params.DistanceYCenters + DistanceYCentersCurrent * countSmall + Params.Diameter,
											horizontalOffsetSmall + Params.DistanceXCenters * j + Params.Diameter
										]);									
							}
						}
						countSmall++;					
					} else {
						// Big & even row
						for (var j = 0; j < Params.countXBig; j++) {
							if (Params.DistanceYCenters > Params.Diameter / 2 + myCurrentDoc.SpaceBetween) {
								AddOval([
											verticalOffset + Params.DistanceYCenters * i,
											horizontalOffsetBig + Params.DistanceXCenters * j,
											verticalOffset + Params.DistanceYCenters * i + Params.Diameter,
											horizontalOffsetBig + Params.DistanceXCenters * j + Params.Diameter
										]);														
							} else {
								AddOval([
											verticalOffset + DistanceYCentersCurrent * countBig,
											horizontalOffsetBig + Params.DistanceXCenters * j,
											verticalOffset + DistanceYCentersCurrent * countBig + Params.Diameter,
											horizontalOffsetBig + Params.DistanceXCenters * j + Params.Diameter
										]);			
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
							if (Params.DistanceYCenters > Params.Diameter / 2 + myCurrentDoc.SpaceBetween) {
								AddOval([
											verticalOffsetSmall + Params.DistanceXCenters * j,
											horizontalOffset + DistanceYCentersCurrent * i,
											verticalOffsetSmall + Params.DistanceXCenters * j + Params.Diameter,
											horizontalOffset + DistanceYCentersCurrent * i + Params.Diameter
										]);									
							} else {
								AddOval([
											verticalOffsetSmall + Params.DistanceXCenters * j,
											horizontalOffset + Params.DistanceYCenters + DistanceYCentersCurrent * countSmall,
											verticalOffsetSmall + Params.DistanceXCenters * j + Params.Diameter,
											horizontalOffset + Params.DistanceYCenters + DistanceYCentersCurrent * countSmall + Params.Diameter
										]);
							}
						}
						countSmall++;
					} else {
						// Big row
						for (var j = 0; j < Params.countXBig; j++) {
							if (Params.DistanceYCenters > Params.Diameter / 2 + myCurrentDoc.SpaceBetween) {
								AddOval([
											verticalOffsetBig + Params.DistanceXCenters * j,
											horizontalOffset + DistanceYCentersCurrent * i,
											verticalOffsetBig + Params.DistanceXCenters * j + Params.Diameter,
											horizontalOffset + DistanceYCentersCurrent * i + Params.Diameter
										]);									
							} else {
								AddOval([
										verticalOffsetBig + Params.DistanceXCenters * j,
										horizontalOffset + DistanceYCentersCurrent * countBig,
										verticalOffsetBig + Params.DistanceXCenters * j + Params.Diameter,
										horizontalOffset + DistanceYCentersCurrent * countBig + Params.Diameter
									]);
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
			var DistanceYCentersBigBig = Params.Diameter + myCurrentDoc.SpaceBetween;						
			var countBigSmallRows = Params.countYBigPerekladom + Params.countYSmall - 1;
			if (Params.DistanceYCenters > (Params.Diameter / 2 + myCurrentDoc.SpaceBetween)) {
				var totalHeight = (DistanceYCentersBigBig * Params.countYBigRivni) + (Params.DistanceYCenters * countBigSmallRows) + Params.Diameter;
			} else {
				var DistanceYCentersCurrent = Params.Diameter + myCurrentDoc.SpaceBetween;
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
								AddOval([
											verticalOffset + DistanceYCentersBigBig * i,
											horizontalOffsetBig + Params.DistanceXCenters * j,
											verticalOffset + DistanceYCentersBigBig * i + Params.Diameter,
											horizontalOffsetBig + Params.DistanceXCenters * j + Params.Diameter
										]);
							}
						} else {
							// Even row
							for (var j = 0; j < Params.countXBig; j++) {
								AddOval([
											verticalOffset + DistanceYCentersBigBig * i,
											horizontalOffsetBig + Params.DistanceXCenters * j,
											verticalOffset + DistanceYCentersBigBig * i + Params.Diameter,
											horizontalOffsetBig + Params.DistanceXCenters * j + Params.Diameter
										]);	
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
									if (Params.DistanceYCenters > (Params.Diameter / 2 + myCurrentDoc.SpaceBetween)) {
										AddOval([
													verticalOffset + Params.DistanceYCenters * k,
													horizontalOffsetSmall + Params.DistanceXCenters * j,
													verticalOffset + Params.DistanceYCenters * k + Params.Diameter,
													horizontalOffsetSmall + Params.DistanceXCenters * j + Params.Diameter
												]);	
									} else {
										AddOval([
													verticalOffset + Params.DistanceYCenters + DistanceYCentersCurrent * countSmall,
													horizontalOffsetSmall + Params.DistanceXCenters * j,
													verticalOffset + Params.DistanceYCenters + DistanceYCentersCurrent * countSmall + Params.Diameter,
													horizontalOffsetSmall + Params.DistanceXCenters * j + Params.Diameter
												]);	
									}										
								}
								countSmall++;
								isSmall = !isSmall;				
							} else {
								// Big row
								for (var j = Params.countXBig - 1; j >= 0; j--) {
									if (Params.DistanceYCenters > (Params.Diameter / 2 + myCurrentDoc.SpaceBetween)) {
										AddOval([
													verticalOffset + Params.DistanceYCenters * k,
													horizontalOffsetBig + Params.DistanceXCenters * j,
													verticalOffset + Params.DistanceYCenters * k + Params.Diameter,
													horizontalOffsetBig + Params.DistanceXCenters * j + Params.Diameter
												]);	
									} else {
										AddOval([
													verticalOffset + DistanceYCentersCurrent * countBig,
													horizontalOffsetBig + Params.DistanceXCenters * j,
													verticalOffset + DistanceYCentersCurrent * countBig + Params.Diameter,
													horizontalOffsetBig + Params.DistanceXCenters * j + Params.Diameter
												]);	
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
									if (Params.DistanceYCenters > (Params.Diameter / 2 + myCurrentDoc.SpaceBetween)) {									
										AddOval([
													verticalOffset + Params.DistanceYCenters * k,
													horizontalOffsetSmall + Params.DistanceXCenters * j,
													verticalOffset + Params.DistanceYCenters * k + Params.Diameter,
													horizontalOffsetSmall + Params.DistanceXCenters * j + Params.Diameter
												]);	
									} else {
										AddOval([
													verticalOffset + Params.DistanceYCenters + DistanceYCentersCurrent * countSmall,
													horizontalOffsetSmall + Params.DistanceXCenters * j,
													verticalOffset + Params.DistanceYCenters + DistanceYCentersCurrent * countSmall + Params.Diameter,
													horizontalOffsetSmall + Params.DistanceXCenters * j + Params.Diameter
												]);	
									}										
								}
								countSmall++;
								isSmall = !isSmall;				
							} else {
								// Big row
								for (var j = 0; j < Params.countXBig; j++) {
									if (Params.DistanceYCenters > (Params.Diameter / 2 + myCurrentDoc.SpaceBetween)) {										
										AddOval([
													verticalOffset + Params.DistanceYCenters * k,
													horizontalOffsetBig + Params.DistanceXCenters * j,
													verticalOffset + Params.DistanceYCenters * k + Params.Diameter,
													horizontalOffsetBig + Params.DistanceXCenters * j + Params.Diameter
												]);	
									} else {
										AddOval([
													verticalOffset + DistanceYCentersCurrent * countBig,
													horizontalOffsetBig + Params.DistanceXCenters * j,
													verticalOffset + DistanceYCentersCurrent * countBig + Params.Diameter,
													horizontalOffsetBig + Params.DistanceXCenters * j + Params.Diameter
												]);	
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
								AddOval([
											verticalOffsetBig + Params.DistanceXCenters * j,
											horizontalOffset + DistanceYCentersBigBig * i,
											verticalOffsetBig + Params.DistanceXCenters * j + Params.Diameter,
											horizontalOffset + DistanceYCentersBigBig * i + Params.Diameter
										]);	
							}
						} else {
							// Even row
							for (var j = 0; j < Params.countXBig; j++) {
								AddOval([
											verticalOffsetBig + Params.DistanceXCenters * j,
											horizontalOffset + DistanceYCentersBigBig * i,
											verticalOffsetBig + Params.DistanceXCenters * j + Params.Diameter,
											horizontalOffset + DistanceYCentersBigBig * i + Params.Diameter
										]);	
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
									if (Params.DistanceYCenters > (Params.Diameter / 2 + myCurrentDoc.SpaceBetween)) {
										AddOval([
													verticalOffsetSmall + Params.DistanceXCenters * j,
													horizontalOffset + Params.DistanceYCenters * k,
													verticalOffsetSmall + Params.DistanceXCenters * j + Params.Diameter,
													horizontalOffset + Params.DistanceYCenters * k + Params.Diameter
												]);	
									} else {
										AddOval([
													verticalOffsetSmall + Params.DistanceXCenters * j,
													horizontalOffset + Params.DistanceYCenters + DistanceYCentersCurrent * countSmall,
													verticalOffsetSmall + Params.DistanceXCenters * j + Params.Diameter,
													horizontalOffset + Params.DistanceYCenters + DistanceYCentersCurrent * countSmall + Params.Diameter
												]);	
									}										
								}
								countSmall++;	
								isSmall = !isSmall;				
							} else {
								// Big row
								for (var j = Params.countXBig - 1; j >= 0; j--) {
									if (Params.DistanceYCenters > (Params.Diameter / 2 + myCurrentDoc.SpaceBetween)) {
										AddOval([
													verticalOffsetBig + Params.DistanceXCenters * j,
													horizontalOffset + Params.DistanceYCenters * k,
													verticalOffsetBig + Params.DistanceXCenters * j + Params.Diameter,
													horizontalOffset + Params.DistanceYCenters * k + Params.Diameter
												]);	
									} else {
										AddOval([
													verticalOffsetBig + Params.DistanceXCenters * j,
													horizontalOffset + DistanceYCentersCurrent * countBig,
													verticalOffsetBig + Params.DistanceXCenters * j + Params.Diameter,
													horizontalOffset + DistanceYCentersCurrent * countBig + Params.Diameter
												]);	
									}
								}
								countBig++;
								isSmall = !isSmall;								
							}							
						} else {
							// Even row
							if (isSmall) {
								for (var j = 0; j < Params.countXSmall; j++) {
									if (Params.DistanceYCenters > (Params.Diameter / 2 + myCurrentDoc.SpaceBetween)) {
										AddOval([
													verticalOffsetSmall + Params.DistanceXCenters * j,
													horizontalOffset + Params.DistanceYCenters * k,
													verticalOffsetSmall + Params.DistanceXCenters * j + Params.Diameter,
													horizontalOffset + Params.DistanceYCenters * k + Params.Diameter
												]);	
									} else {
										AddOval([
													verticalOffsetSmall + Params.DistanceXCenters * j,
													horizontalOffset + Params.DistanceYCenters + DistanceYCentersCurrent * countSmall,
													verticalOffsetSmall + Params.DistanceXCenters * j + Params.Diameter,
													horizontalOffset + Params.DistanceYCenters + DistanceYCentersCurrent * countSmall + Params.Diameter
												]);	
									}										
								}
								countSmall++;
								isSmall = !isSmall;				
							} else {
								// Big row
								for (var j = 0; j < Params.countXBig; j++) {
									if (Params.DistanceYCenters > (Params.Diameter / 2 + myCurrentDoc.SpaceBetween)) {
										AddOval([
													verticalOffsetBig + Params.DistanceXCenters * j,
													horizontalOffset + Params.DistanceYCenters * k,
													verticalOffsetBig + Params.DistanceXCenters * j + Params.Diameter,
													horizontalOffset + Params.DistanceYCenters * k + Params.Diameter
												]);	
									} else {
										AddOval([
													verticalOffsetBig + Params.DistanceXCenters * j,
													horizontalOffset + DistanceYCentersCurrent * countBig,
													verticalOffsetBig + Params.DistanceXCenters * j + Params.Diameter,
													horizontalOffset + DistanceYCentersCurrent * countBig + Params.Diameter
												]);	
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
	
	var OvalsGroup = CutLayer.pageItems.count() > 1 ? myDocument.groups.add(CutLayer.pageItems) : CutLayer;
	
	myCurrentDoc.Params.contoursBounds = OvalsGroup.ovals.count() > 1 ? OvalsGroup.geometricBounds : OvalsGroup.ovals.firstItem().geometricBounds;

	Params.cutLength = Math.ceil(Math.PI * Params.Diameter * Params.total);
	
	var outputFile = "D=" + Params.Diameter;
	outputFile += "(" + myCurrentDoc.SpaceBetween + ")mm_";
	outputFile += myCurrentDoc.CutterType.label ? myCurrentDoc.CutterType.label + "_" : "";
	outputFile += myCurrentDoc.CutterType.paperName ? myCurrentDoc.CutterType.paperName + "_" : "";
	outputFile += !myCurrentDoc.CutterType.paperName ? myCurrentDoc.CutterType.widthSheet + "x" + myCurrentDoc.CutterType.heightSheet + "_" : "";
	outputFile += "CUT=" + Params.cutLength + "mm_x" + Params.total;

	myDocument.name = outputFile;

	outputFile = outputFolder + '/' + outputFile;

	addMarksToDocument(myCurrentDoc, 'CUT');
	
	if (myCurrentDoc.IsSaveFileWithCut) {

		// Створємо вікно для документа (інакше буде експортовано порожній дркумент!)
		myDocument.windows.add().maximize();

		progress.details(translate('Exporting cut file'), false);	

		var dontCloseDocument = false;
           
		if (OvalsGroup.ovals.length > 0) {
			if (myCurrentDoc.CutterType.plotterCutFormat == "AI") {
				try {
					var epsFileName = outputFile + '.eps';
					myDocument.exportFile(ExportFormat.epsType, File(epsFileName), false);
					// Виклик Ілюстратора для перезбереження файлу до 8 версії AI

					var bt = new BridgeTalk();
					bt.target = 'illustrator';
					bt.body = openIllustratorToConvertAI_source + "(" + epsFileName.toSource() + ");";
					bt.onError = function(resObj) {
						res = eval(resObj.body);
						alert(translate('Error - Illustrator cannot convert', {
								format: myCurrentDoc.CutterType.plotterCutFormat,
								error: res.err
							}));
						dontCloseDocument = true;
					};
					bt.onResult = function(resObj) {
						res = eval(resObj.body);
						if (res && !res.success) {
							alert(translate('Error - Illustrator cannot convert', {
									format: myCurrentDoc.CutterType.plotterCutFormat,
									error: res.err
								}));
							dontCloseDocument = true;
						};
					};
					bt.send(120);
				} catch(err) {
					alert(translate('Error - Cannot export file', {filename: File.decode(outputFile) + ".eps"}));
					dontCloseDocument = true;
				}				  
			} else if (myCurrentDoc.CutterType.plotterCutFormat == "DXF") {
				try {
					var epsFileName = outputFile + ".eps";
					myDocument.exportFile(ExportFormat.epsType, File(epsFileName), false);

					// Виклик Ілюстратора для перезбереження файлу до формату DXF					
					var bt = new BridgeTalk();
					bt.target = 'illustrator';
					bt.body = openIllustratorToConvertDXF_source + "(" + epsFileName.toSource() + ");";
					bt.onError = function(resObj) {
						res = eval(resObj.body);
						alert(translate('Error - Illustrator cannot convert', {
								format: myCurrentDoc.CutterType.plotterCutFormat,
								error: res.err
							}));
						dontCloseDocument = true;
					};
					bt.onResult = function(resObj) {
						res = eval(resObj.body);
						if (res && !res.success) {
							alert(translate('Error - Illustrator cannot convert', {
									format: myCurrentDoc.CutterType.plotterCutFormat,
									error: res.err
								}));
							dontCloseDocument = true;
						};
					};
					bt.send(120);
				} catch(err) {
					alert(translate('Error - Cannot export file', {filename: File.decode(outputFile) + ".eps"}));
					dontCloseDocument = true;
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
				try {
					myDocument.exportFile(ExportFormat.pdfType, File(outputFile + ".pdf"), false, myPDFExportPreset4Contour);
				} catch(err) {
					alert(translate('Error - Cannot export file', {filename: File.decode(outputFile) + ".pdf"}));
					dontCloseDocument = true;
				};
				myPDFExportPreset4Contour.remove();
			}
		}
	};
	
	progress.increment();
	progress.close();

	// Видаляємо документ (для пришвидшення роботи скрипта)
	if (!dontCloseDocument) myDocument.close(SaveOptions.NO);

}

// Створення шаблону документа для розкладки прямокутників

function CreateCustomDocRectangles(myCurrentDoc, customRoundCornersValue, customSpaceBetween) {
	
	var Params = myCurrentDoc.Params;
	
	myCurrentDoc.SpaceBetween = customSpaceBetween ? customSpaceBetween : myCurrentDoc.SpaceBetween;
	var Bleeds = myCurrentDoc.IsZeroBleeds ? 0 : myCurrentDoc.CutterType.minSpaceBetween / 2;
	myCurrentDoc.RoundCornersValue = customRoundCornersValue ? customRoundCornersValue : myCurrentDoc.RoundCornersValue;
	myCurrentDoc.IsRoundedCorners = customRoundCornersValue ? true : myCurrentDoc.IsRoundedCorners;
	
	const documentRotated = Params.widthSheet != myCurrentDoc.CutterType.widthSheet;
	
	Params.bleedCompensation = [];
	Params.rotationCompensation = [];
	
	progress(3 + Params.total, translate('Preparing document'));

	progress.message(translate('Prepare rectangular cut', {widthItem: Params.widthItem, heightItem: Params.heightItem}) + (myCurrentDoc.IsRoundedCorners && myCurrentDoc.RoundCornersValue > 0 ? " R=" + myCurrentDoc.RoundCornersValue + translate('Units mm') : ""));

	progress.details(translate('Creating new document'), false);
	CreateMyDocument(myCurrentDoc);
	progress.increment();

	var CutLayer = myDocument.layers.itemByName(CUTLayer);
	var firstPage = myDocument.pages.firstItem();	
	
	progress.details(translate('Adding elements'), false);
	
	var totalWidth;
	var totalHeight;
	var horizontalOffset;
	var verticalOffset;	

	var contourColor = myDocument.colors.add({
			"colorValue": myCurrentDoc.CutterType.contourColor,
			"model": ColorModel.PROCESS,
			"space": ColorSpace.CMYK,
			"name": "CONTOUR"
		});	

	// Координати фреймів для вставки макетів
	myCurrentDoc.Params.GeometricBounds = [];

	function AddRectangle(thisBounds, thisRotation, bleedCompensation) {

		var rectProperties = {
			'fillColor': 'None',
			'strokeColor': 'None',						
			'geometricBounds': thisBounds
		};

		if (myCurrentDoc.SpaceBetween > 0) {
			rectProperties['strokeWeight'] = 0.5;
			rectProperties['strokeColor'] = contourColor;
			rectProperties['strokeType'] = 'Solid';
			rectProperties['strokeAlignment'] = StrokeAlignment.CENTER_ALIGNMENT;			
		}

		if (myCurrentDoc.IsRoundedCorners) {
			rectProperties['bottomLeftCornerOption'] = CornerOptions.ROUNDED_CORNER;
			rectProperties['bottomLeftCornerRadius'] = myCurrentDoc.RoundCornersValue || 0;
			rectProperties['bottomRightCornerOption'] = CornerOptions.ROUNDED_CORNER;
			rectProperties['bottomRightCornerRadius'] = myCurrentDoc.RoundCornersValue || 0;
			rectProperties['topLeftCornerOption'] = CornerOptions.ROUNDED_CORNER;
			rectProperties['topLeftCornerRadius'] = myCurrentDoc.RoundCornersValue || 0;
			rectProperties['topRightCornerOption'] = CornerOptions.ROUNDED_CORNER;
			rectProperties['topRightCornerRadius'] = myCurrentDoc.RoundCornersValue || 0;
		}

		firstPage.rectangles.add(CutLayer, LocationOptions.AT_END, rectProperties);			

		// Додаємо в масив компенсацію повороту макета
		Params.rotationCompensation.push(thisRotation);
		// Додаємо в масив компенсацію вильотів при накладанні макетів
		Params.bleedCompensation.push(bleedCompensation);

		// Координати фрейма для вставки макета
		myCurrentDoc.Params.GeometricBounds.push([
			thisBounds[0] - Bleeds,
			thisBounds[1] - Bleeds,
			thisBounds[2] + Bleeds,
			thisBounds[3] + Bleeds
		]);		

		progress.increment();			

	}

	switch (Params.method) {
		case 1:
			if (documentRotated) {
				totalHeight = Params.countX * (Params.widthItem + myCurrentDoc.SpaceBetween) - myCurrentDoc.SpaceBetween;
				totalWidth = Params.countY * (Params.heightItem + myCurrentDoc.SpaceBetween) - myCurrentDoc.SpaceBetween;
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
						var bleedCompensation = [0, 0, 0, 0];

						if (myCurrentDoc.SpaceBetween == 0) {
							var firstRow = count > 0 && count <= Params.countY;
							var lastRow = count > (Params.total - Params.countY) && count <= Params.total;
							var firstCol = itemIndex == 0;
							var lastCol = itemIndex == Params.countY - 1;
							bleedCompensation = [
								firstRow ? 0 : Bleeds,
								firstCol ? 0 : Bleeds,
								lastRow ? 0 : -Bleeds,
								lastCol ? 0 : -Bleeds
							];
						};

						AddRectangle([
										verticalOffset + (Params.widthItem + myCurrentDoc.SpaceBetween) * i,
										horizontalOffset + (Params.heightItem + myCurrentDoc.SpaceBetween) * itemIndex,
										verticalOffset + (Params.widthItem + myCurrentDoc.SpaceBetween) * i + Params.widthItem,
										horizontalOffset + (Params.heightItem + myCurrentDoc.SpaceBetween) * itemIndex + Params.heightItem
									],
									90,
									bleedCompensation);
					}
					isOdd = !isOdd;
				}				
			} else {
				totalWidth = Params.countX * (Params.widthItem + myCurrentDoc.SpaceBetween) - myCurrentDoc.SpaceBetween;
				totalHeight = Params.countY * (Params.heightItem + myCurrentDoc.SpaceBetween) - myCurrentDoc.SpaceBetween;
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
						var bleedCompensation = [0, 0, 0, 0];
						
						// Створюємо масив компенсації вильотів при накладанні макетів
						if (myCurrentDoc.SpaceBetween == 0) {
							var firstRow = count > 0 && count <= Params.countX;
							var lastRow = count > (Params.total - Params.countX) && count <= Params.total;
							var firstCol = itemIndex == 0;
							var lastCol = itemIndex == Params.countX - 1;
							bleedCompensation = [
								firstRow ? 0 : Bleeds,
								firstCol ? 0 : Bleeds,
								lastRow ? 0 : -Bleeds,
								lastCol ? 0 : -Bleeds
							];
						};

						AddRectangle([
										verticalOffset + (Params.heightItem + myCurrentDoc.SpaceBetween) * i,
										horizontalOffset + (Params.widthItem + myCurrentDoc.SpaceBetween) * itemIndex,
										verticalOffset + (Params.heightItem + myCurrentDoc.SpaceBetween) * i + Params.heightItem,
										horizontalOffset + (Params.widthItem + myCurrentDoc.SpaceBetween) * itemIndex + Params.widthItem
									],
									0,
									bleedCompensation);

					}
					isOdd = !isOdd;
				}				
			}
			break;
		case 2:
			
			if (documentRotated) {
				
				totalHeightOriginal = Params.countX * (Params.widthItem + myCurrentDoc.SpaceBetween) - myCurrentDoc.SpaceBetween;
				totalWidthOriginal = Params.countY * (Params.heightItem + myCurrentDoc.SpaceBetween) - myCurrentDoc.SpaceBetween;
				totalHeightRotated = Params.countRotatedX * (Params.heightItem + myCurrentDoc.SpaceBetween) - myCurrentDoc.SpaceBetween;
				totalWidthRotated = Params.countRotatedY * (Params.widthItem + myCurrentDoc.SpaceBetween) - myCurrentDoc.SpaceBetween;
				totalWidth = totalWidthOriginal + myCurrentDoc.SpaceBetween + totalWidthRotated;
				totalHeight = totalHeightOriginal > totalHeightRotated ? totalHeightOriginal : totalHeightRotated;
				horizontalOffset = (Params.heightFrame - totalWidth) / 2 + myCurrentDoc.CutterType.marginLeft;
				verticalOffset = (Params.widthFrame - totalHeight) / 2 + myCurrentDoc.CutterType.marginTop;				

				var isOdd = true;
				// Rows Original
				for (var i = 0; i < Params.countX; i++) {
					// Columns Original
					for (var j = 0; j < Params.countY; j++) {
						
						var itemIndex = isOdd ? j : Params.countY - j - 1;
						var bleedCompensation = [0, 0, 0, 0];
						
						AddRectangle([
										verticalOffset + (Params.widthItem + myCurrentDoc.SpaceBetween) * i,
										horizontalOffset + (Params.heightItem + myCurrentDoc.SpaceBetween) * itemIndex,
										verticalOffset + (Params.widthItem + myCurrentDoc.SpaceBetween) * i + Params.widthItem,
										horizontalOffset + (Params.heightItem + myCurrentDoc.SpaceBetween) * itemIndex + Params.heightItem
									],
									90,
									bleedCompensation);			
					}
					isOdd = !isOdd;
				}
				
				horizontalOffset = horizontalOffset + (Params.heightItem + myCurrentDoc.SpaceBetween) * Params.countY;
				
				// Rows Rotated
				for (var i = 0; i < Params.countRotatedX; i++) {
					// Columns Rotated
					for (var j = 0; j < Params.countRotatedY; j++) {
						
						var itemIndex = isOdd ? j : Params.countRotatedY - j - 1;
						var bleedCompensation = [0, 0, 0, 0];
						
						AddRectangle([
										verticalOffset + (Params.heightItem + myCurrentDoc.SpaceBetween) * i,
										horizontalOffset + (Params.widthItem + myCurrentDoc.SpaceBetween) * itemIndex,
										verticalOffset + (Params.heightItem + myCurrentDoc.SpaceBetween) * i + Params.heightItem,
										horizontalOffset + (Params.widthItem + myCurrentDoc.SpaceBetween) * itemIndex + Params.widthItem
									],
									0,
									bleedCompensation);	
					}
					isOdd = !isOdd;
				}				
			} else {
				totalWidthOriginal = Params.countX * (Params.widthItem + myCurrentDoc.SpaceBetween) - myCurrentDoc.SpaceBetween;
				totalHeightOriginal = Params.countY * (Params.heightItem + myCurrentDoc.SpaceBetween) - myCurrentDoc.SpaceBetween;
				totalWidthRotated = Params.countRotatedX * (Params.heightItem + myCurrentDoc.SpaceBetween) - myCurrentDoc.SpaceBetween;
				totalHeightRotated = Params.countRotatedY * (Params.widthItem + myCurrentDoc.SpaceBetween) - myCurrentDoc.SpaceBetween;
				totalWidth = totalWidthOriginal > totalWidthRotated ? totalWidthOriginal : totalWidthRotated;
				totalHeight = totalHeightOriginal + myCurrentDoc.SpaceBetween + totalHeightRotated;
				horizontalOffset = (Params.widthFrame - totalWidth) / 2 + myCurrentDoc.CutterType.marginLeft;
				verticalOffset = (Params.heightFrame - totalHeight) / 2 + myCurrentDoc.CutterType.marginTop;
				
				var isOdd = true;
				// Rows Original
				for (var i = 0; i < Params.countY; i++) {
					// Columns Original
					for (var j = 0; j < Params.countX; j++) {
						
						var itemIndex = isOdd ? j : Params.countX - j - 1;
						var bleedCompensation = [0, 0, 0, 0];
						
						AddRectangle([
										verticalOffset + (Params.heightItem + myCurrentDoc.SpaceBetween) * i,
										horizontalOffset + (Params.widthItem + myCurrentDoc.SpaceBetween) * itemIndex,
										verticalOffset + (Params.heightItem + myCurrentDoc.SpaceBetween) * i + Params.heightItem,
										horizontalOffset + (Params.widthItem + myCurrentDoc.SpaceBetween) * itemIndex + Params.widthItem
									],
									0,
									bleedCompensation);					
					}
					isOdd = !isOdd;
				}
				
				verticalOffset = verticalOffset + (Params.heightItem + myCurrentDoc.SpaceBetween) * Params.countY;
				
				// Rows Rotated
				for (var i = 0; i < Params.countRotatedY; i++) {
					// Columns Rotated
					for (var j = 0; j < Params.countRotatedX; j++) {
						
						var itemIndex = isOdd ? j : Params.countRotatedX - j - 1;
						var bleedCompensation = [0, 0, 0, 0];
						
						AddRectangle([
										verticalOffset + (Params.widthItem + myCurrentDoc.SpaceBetween) * i,
										horizontalOffset + (Params.heightItem + myCurrentDoc.SpaceBetween) * itemIndex,
										verticalOffset + (Params.widthItem + myCurrentDoc.SpaceBetween) * i + Params.widthItem,
										horizontalOffset + (Params.heightItem + myCurrentDoc.SpaceBetween) * itemIndex + Params.heightItem
									],
									90,
									bleedCompensation);	
					}
					isOdd = !isOdd;
				}
			}

			break;
	}
	
	progress.increment();
	
	var RectGroup = CutLayer.pageItems.count() > 1 ? myDocument.groups.add(CutLayer.pageItems) : CutLayer;

    myCurrentDoc.Params.contoursBounds = RectGroup.rectangles.count() > 1 ? RectGroup.geometricBounds : RectGroup.rectangles.firstItem().geometricBounds;

	if (myCurrentDoc.SpaceBetween > 0) {
		if (myCurrentDoc.IsRoundedCorners) {
			Params.cutLength = Math.ceil(((Params.widthItem + Params.heightItem - 4 * myCurrentDoc.RoundCornersValue) * 2 + 2 * Math.PI * myCurrentDoc.RoundCornersValue) * Params.total);
		} else {
			Params.cutLength = Math.ceil(((Params.widthItem + Params.heightItem) * 2) * Params.total);
		}			
	} else {
		Params.cutLength = Math.ceil((Params.countY + 1) * (totalHeight + 0.7) + (Params.countX + 1) * (totalWidth + 0.7));
	}

	var outputFile = Params.widthItem + "x" + Params.heightItem;
	outputFile += myCurrentDoc.IsRoundedCorners && myCurrentDoc.RoundCornersValue ? " R=" + myCurrentDoc.RoundCornersValue + " " : "";
	outputFile += "(" + myCurrentDoc.SpaceBetween + ")mm_";
	outputFile += myCurrentDoc.CutterType.label ? myCurrentDoc.CutterType.label + "_" : "";
	outputFile += myCurrentDoc.CutterType.paperName ? myCurrentDoc.CutterType.paperName + "_" : "";
	outputFile += !myCurrentDoc.CutterType.paperName ? myCurrentDoc.CutterType.widthSheet + "x" + myCurrentDoc.CutterType.heightSheet + "_" : "";
	outputFile += "CUT=" + Params.cutLength + "mm_x" + Params.total;

	myDocument.name = outputFile;

	outputFile = outputFolder + '/' + outputFile;

	addMarksToDocument(myCurrentDoc, 'CUT');
	
	if (myCurrentDoc.IsSaveFileWithCut) {
		
		var contourOffset = myCurrentDoc.CutterType.contourOffset;
		
		var refPoint = app.changeObjectPreferences.anchorPoint;
		
		app.changeObjectPreferences.anchorPoint = AnchorPoint.CENTER_ANCHOR;	
		
		// Контур порізки задається лініями, якщо макети покладено встик
		if (myCurrentDoc.SpaceBetween == 0) {
			if (documentRotated) {
				
				// Вертикальні лінії різу
				
				var isOdd = Params.countY % 2 == 0 ? true : false;
				
				for (var i = 0; i <= Params.countY; i++) {
					firstPage.graphicLines.add(CutLayer, LocationOptions.AT_END, {
						'geometricBounds': [ // [y1, x1, y2, x2], which give the coordinates of the top-left and bottom-right corners of the bounding box.
							verticalOffset - contourOffset,
							horizontalOffset + (Params.heightItem + myCurrentDoc.SpaceBetween / 2) * i,
							verticalOffset + totalHeight + contourOffset,
							horizontalOffset + (Params.heightItem + myCurrentDoc.SpaceBetween / 2) * i
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
					firstPage.graphicLines.add(CutLayer, LocationOptions.AT_END, {
						'geometricBounds': [ // [y1, x1, y2, x2], which give the coordinates of the top-left and bottom-right corners of the bounding box.
							verticalOffset + (Params.widthItem + myCurrentDoc.SpaceBetween / 2) * i,
							horizontalOffset - contourOffset,
							verticalOffset + (Params.widthItem + myCurrentDoc.SpaceBetween / 2) * i,
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
					
					firstPage.graphicLines.add(CutLayer, LocationOptions.AT_END, {
						'geometricBounds': [ // [y1, x1, y2, x2], which give the coordinates of the top-left and bottom-right corners of the bounding box.
							verticalOffset - contourOffset,
							horizontalOffset + (Params.widthItem + myCurrentDoc.SpaceBetween / 2) * i,
							verticalOffset + totalHeight + contourOffset,
							horizontalOffset + (Params.widthItem + myCurrentDoc.SpaceBetween / 2) * i
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
					
					firstPage.graphicLines.add(CutLayer, LocationOptions.AT_END, {
						'geometricBounds': [ // [y1, x1, y2, x2], which give the coordinates of the top-left and bottom-right corners of the bounding box.
							verticalOffset + (Params.heightItem + myCurrentDoc.SpaceBetween / 2) * i,
							horizontalOffset - contourOffset,
							verticalOffset + (Params.heightItem + myCurrentDoc.SpaceBetween / 2) * i,
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
		
		app.changeObjectPreferences.anchorPoint = refPoint;	

		// Створємо вікно для документа (інакше буде експортовано порожній дркумент!)
		myDocument.windows.add().maximize();
		progress.details(translate('Exporting cut file'), false);	

		var dontCloseDocument = false;
           
		if (RectGroup.rectangles.length > 0) {
			if (myCurrentDoc.CutterType.plotterCutFormat == "AI") {
				try {
					var epsFileName = outputFile + ".eps";
					myDocument.exportFile(ExportFormat.epsType, File(epsFileName), false);

					// Виклик Ілюстратора для перезбереження файлу до 8 версії AI
					var bt = new BridgeTalk();
					bt.target = 'illustrator';
					bt.body = openIllustratorToConvertAI_source + "(" + epsFileName.toSource() + ");";
					bt.onError = function(resObj) {
						res = eval(resObj.body);
						alert(translate('Error - Illustrator cannot convert', {
								format: myCurrentDoc.CutterType.plotterCutFormat,
								error: res.err
							}));
						dontCloseDocument = true;
					};
					bt.onResult = function(resObj) {
						res = eval(resObj.body);
						if (res && !res.success) {
							alert(translate('Error - Illustrator cannot convert', {
									format: myCurrentDoc.CutterType.plotterCutFormat,
									error: res.err
								}));
							dontCloseDocument = true;
						};
					};
					bt.send(120);
				} catch(err) {
					alert(translate('Error - Cannot export file', {filename: File.decode(outputFile) + ".eps"}));
					dontCloseDocument = true;
				}				  
			} else if (myCurrentDoc.CutterType.plotterCutFormat == "DXF") {
				try {
					var epsFileName = outputFile + ".eps";
					myDocument.exportFile(ExportFormat.epsType, File(epsFileName), false);

					// Виклик Ілюстратора для перезбереження файлу до формату DXF					
					var bt = new BridgeTalk();
					bt.target = 'illustrator';
					bt.body = openIllustratorToConvertDXF_source + "(" + epsFileName.toSource() + ");";
					bt.onError = function(resObj) {
						res = eval(resObj.body);
						alert(translate('Error - Illustrator cannot convert', {
								format: myCurrentDoc.CutterType.plotterCutFormat,
								error: res.err
							}));
						dontCloseDocument = true;
					};
					bt.onResult = function(resObj) {
						res = eval(resObj.body);
						if (res && !res.success) {
							alert(translate('Error - Illustrator cannot convert', {
									format: myCurrentDoc.CutterType.plotterCutFormat,
									error: res.err
								}));
							dontCloseDocument = true;
						};
					};
					bt.send(120);
				} catch(err) {
					alert(translate('Error - Cannot export file', {filename: File.decode(outputFile) + ".eps"}));
					dontCloseDocument = true;
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
				try {
					myDocument.exportFile(ExportFormat.pdfType, File(outputFile + ".pdf"), false, myPDFExportPreset4Contour);
				} catch(err) {
					alert(translate('Error - Cannot export file', {filename: File.decode(outputFile) + ".pdf"}));
					dontCloseDocument = true;
				};
				myPDFExportPreset4Contour.remove();
			}
		}
	};
	
	progress.increment();	
	progress.close();

	// Видаляємо документ (для пришвидшення роботи скрипта)
	if (!dontCloseDocument) myDocument.close(SaveOptions.NO);
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
		var createNew = confirm(translate('Error - JSON preferences not found', {path: file.fsName}, true), false, translate('Confirm create new json', null, true));
		if (createNew) {
			APP_PREFERENCES = {
				app: {},
				cutters: []
			};
			savePreferencesJSON(fileName);
			return parsePreferencesJSON(fileName);
		} else {
			exit();
		}
	};
	try {
		var parsedJson = JSON.parse(jsonStuff);
		for (var i = 0, cutters = parsedJson.cutters; i < cutters.length; i++) {
			if (cutters[i].pageOrientation) {
				if (cutters[i].widthSheet <= cutters[i].heightSheet) cutters[i].pageOrientation = PageOrientation.PORTRAIT.valueOf();
				if (cutters[i].widthSheet > cutters[i].heightSheet) cutters[i].pageOrientation = PageOrientation.LANDSCAPE.valueOf();
			}
			cutters[i].widthFrame = cutters[i].widthFrame || cutters[i].widthSheet - (cutters[i].marginLeft + cutters[i].marginRight);
			cutters[i].heightFrame = cutters[i].heightFrame || cutters[i].heightSheet - (cutters[i].marginTop + cutters[i].marginBottom);
		};
		return parsedJson;				
	} catch (err) {
		alert(translate('Error - JSON parse failed', null, true) + "\n\n" + err.message);
		exit();
	}
}

// Читаємо і готуємо файл налаштувань

function savePreferencesJSON(fileName) {
    var JSONFile = new File(fileName);
    writeFile(JSONFile, JSON.stringify(APP_PREFERENCES));
}

// Solution from https://community.adobe.com/t5/after-effects-discussions/create-a-txt-file-in-extendscript/m-p/9645027#M50287

function writeFile(fileObj, fileContent, encoding) {

    encoding = encoding || "utf-8";

    fileObj = (fileObj instanceof File) ? fileObj : new File(fileObj);

    var parentFolder = fileObj.parent;

    if (!parentFolder.exists && !parentFolder.create())

        throw new Error(translate('Error - cant create file') + fileObj.fsName);

    fileObj.encoding = encoding;

    fileObj.open("w");

    fileObj.write(fileContent);

    fileObj.close();

    return fileObj;

}

/**
	Шукаємо переклад значення у мовних константах
	@param {string} value Ключ до значення в об'єкті values, що містить переклад
	@param {Object} replace Об'єкт, який містить пари ключ-значення для заміни в рядку
	@param {boolean} useDefault Якщо true, то функція шукатиме значення в мові за промовчанням
	@returns {String} Фраза-переклад
*/

function translate(value, replace, useDefault) {
	const lang = useDefault ? 'en_US' : APP_PREFERENCES.app.lang;
	if (LANG.hasOwnProperty(lang) && LANG[lang].hasOwnProperty('values') && LANG[lang].values.hasOwnProperty(value)) {
		var translation = LANG[lang].values[value];
		if (replace) {
			for (var key in replace) {
				translation = translation.replace('%' + key + '%', replace[key]);
			}
		}
		return translation;
	} else if (!useDefault) {
		return translate(value, replace, true);
	} else return value;
}

/**
  Do the file open and save it to AI 8 version.
  @param {string} fileName Name of the source file
  @return {Object}
*/

function openIllustratorToConvertAI(fileName) {

	var result = {
		success: false
	};

	fileName = eval(fileName);

    try {

		var file = File(fileName);

		if (!file.exists) {
			throw new Error("File not found!");
		}

        app.userInteractionLevel = UserInteractionLevel.DONTDISPLAYALERTS;

        var w = new Window("dialog", "Processing", undefined, {closeButton: false});
        var t = w.add("statictext");
        t.preferredSize = [450, -1];
        t.text = "Converting EPS to AI cut file...";
        w.onShow = function() {
            
			app.open(file);

            var saveOpts = new IllustratorSaveOptions();
            saveOpts.compatibility = Compatibility.ILLUSTRATOR8;
            saveOpts.compressed = false;
            saveOpts.pdfCompatible = false;

            var AI_fileName = file.fullName.split(".").slice(0, -1).join(".") + ".ai";
            var AI_File = new File(AI_fileName);

			try {
				app.activeDocument.saveAs(AI_File, saveOpts);
				app.activeDocument.close(SaveOptions.DONOTSAVECHANGES);
				file.remove();			
			} catch(err) {
				throw new Error("Export to AI failed!");
			}
			result = {
				success: true
			};
            w.close();
        }
        
		var run = w.show();
        app.userInteractionLevel = UserInteractionLevel.DISPLAYALERTS;
        return result.toSource();
	} catch (err) {
		result = {
			success: false,
			err: err.message
		};
		app.userInteractionLevel = UserInteractionLevel.DISPLAYALERTS;
		return result.toSource();
	}
}

/**
  Do the file open and save it to DXF.
  @param {string} fileName Name of the source file
  @return {Object}
*/

function openIllustratorToConvertDXF(fileName) {

	var result = {
			success: false
		};
	fileName = eval(fileName);

    try {

		var file = File(fileName);

		if (!file.exists) {
			throw new Error("File not found!");
		}

        app.userInteractionLevel = UserInteractionLevel.DONTDISPLAYALERTS;

        var w = new Window("dialog", "Processing", undefined, {closeButton: false});
        var t = w.add("statictext");
        t.preferredSize = [450, -1];
        t.text = "Converting EPS to AI cut file...";
        w.onShow = function() {
            
			app.open(file);

			var exportOpts = new ExportOptionsAutoCAD();
			exportOpts.exportFileFormat = AutoCADExportFileFormat.DXF;

			var DXF_fileName = file.fullName.split('.').slice(0, -1).join('.') + ".dxf";
			var DXF_File = new File(DXF_fileName);
			for (var i = 0, items = app.activeDocument.pathItems; i < items.length; i++) {
				if (!(items[i].fillColor instanceof NoColor)) {
					items[i].strokeColor = items[i].fillColor;
					items[i].fillColor = new NoColor();    
				};
			};

			try {
				app.activeDocument.exportFile(DXF_File, ExportType.AUTOCAD,exportOpts);
				app.activeDocument.close(SaveOptions.DONOTSAVECHANGES);
				file.remove();			
			} catch(err) {
				throw new Error("Export to DXF failed!");
			};
            
			result = {
				success: true
			};
            w.close();

         }
        
		var run = w.show();
		app.userInteractionLevel = UserInteractionLevel.DISPLAYALERTS;
        return result.toSource();
	} catch (err) {
		result = {
			success: false,
			err: err.message
		};
		app.userInteractionLevel = UserInteractionLevel.DISPLAYALERTS;
		return result.toSource();
	}
}