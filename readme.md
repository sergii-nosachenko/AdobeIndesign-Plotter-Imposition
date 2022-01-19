# Скрипт для розкладки під плоттери

Даний скрипт дозволяє легко розкласти файл або групу файлів під плотерну порізку в Adobe InDesign. Також генерується файл з контуром порізки для кожного розміру.

## Вимоги

* Adobe Indesign >=14.0
* Adobe Illustrator >=19.0

## Інсталяція

### Етап 1

Для початку потрібно скопіювати наступні файли:

```bash
Rozkladka na plotter.jsx
preferences.json
```

у робочу папку скриптів InDesign (для Windows):

```bash
%APPDATA%\Adobe\InDesign\Version 15.0\en_GB\Scripts\Scripts Panel
```

*Версія та мовний пакет можуть відрізнятись!*

### Етап 2

Потрібно модифікувати файл `illustrator-20.0.jsx` *(версія залежить від встановленої)* Adobe Illistrator у наступних папках:

```bash
%CommonProgramFiles%\Adobe\Startup Scripts CC\Illustrator 2020\
%CommonProgramFiles(x86)%\Adobe\Startup Scripts CC\Illustrator 2020\
```

Додайте наступні функції в код `illustrator-20.0.jsx`:

```javascript
/**
  Do the file open and save it to AI 8 version.
  @param  files File or Array of File to be opened.
  @return true if all the files are successfully saved.
*/

illustrator.openIllustratorToConvertAI = function (files) {
	if (BridgeTalk.appName == illustrator.appName) {

        BridgeTalk.bringToFront(illustrator.targetName);

		var fileArray = new Array;
		if (files instanceof File)
			fileArray.push(files);
		else 
			fileArray = files.concat(fileArray);
		
		var reply = {
			success: true
		};

		for (var i = 0; i < fileArray.length; i++) {
            try {
                app.userInteractionLevel = UserInteractionLevel.DONTDISPLAYALERTS;

                var w = new Window("window", "Зачекай, обробляю файл", undefined, {closeButton: false});
                var t = w.add("statictext");
                t.preferredSize = [450, -1];
                t.text = "Конвертую EPS в AI для порізки...";
                w.show();

                app.open(fileArray[i]);

                var saveOpts = new IllustratorSaveOptions();
                saveOpts.compatibility = Compatibility.ILLUSTRATOR8;
                saveOpts.compressed = false;
                saveOpts.pdfCompatible = false;

                var fileName = fileArray[i].fullName.split('.').slice(0, -1).join('.') + ".ai";
                var AI_File = new File(fileName);
                fileArray[i].remove();  

                app.activeDocument.saveAs( AI_File, saveOpts );
                app.activeDocument.close();
                app.userInteractionLevel = UserInteractionLevel.DISPLAYALERTS;

                w.close();
			} catch (err) {
				reply = {
					success: false,
					err: "Error on open(): " + (err.number & 0xFFFF) + ", " + err.description + ", " + fileArray[i].toString()
				};
			}
		}
		indesign15.activate();
		return reply;
	} else {
		// create a BridgeTalk message for Illustrator to invoke open
		var filesString = illustrator.fileArrayToString ( files );

		var btMessage = new BridgeTalk;
		btMessage.target = illustrator.targetName;
		btMessage.body = "illustrator.openIllustratorToConvertAI (" + filesString + ");";
		btMessage.onResult = function(bto) {BridgeTalk.bringToFront(bto.sender);}
		btMessage.send();
	}
}

/**
  Do the file open and save it to DXF.
  @param  files File or Array of File to be opened.
  @return true if all the files are successfully saved.
*/

illustrator.openIllustratorToConvertDXF = function (files) {
	if (BridgeTalk.appName == illustrator.appName) {

		BridgeTalk.bringToFront(illustrator.targetName);

		var fileArray = new Array;
		if (files instanceof File)
			fileArray.push(files);
		else 
			fileArray = files.concat(fileArray);
		
		var reply = {
			success: true
		};

		for (var i = 0; i < fileArray.length; i++) {
			try {
                app.userInteractionLevel = UserInteractionLevel.DONTDISPLAYALERTS;

                var w = new Window("window", "Зачекай, обробляю файл", undefined, {closeButton: false});
                var t = w.add("statictext");
                t.preferredSize = [450, -1];
                t.text = "Конвертую EPS в DXF для порізки...";
                w.show();

                app.open(fileArray[i]);

                var exportOpts = new ExportOptionsAutoCAD();
                exportOpts.exportFileFormat = AutoCADExportFileFormat.DXF;

                var fileName = fileArray[i].fullName.split('.').slice(0, -1).join('.') + ".dxf";
                var DXF_File = new File(fileName);
                fileArray[i].remove();
                for (var i = 0, items = app.activeDocument.pathItems; i < items.length; i++) {
                    if (!(items[i].fillColor instanceof NoColor)) {
                        items[i].strokeColor = items[i].fillColor;
                        items[i].fillColor = new NoColor();		
                    };
                };

                app.activeDocument.exportFile(DXF_File, ExportType.AUTOCAD,exportOpts);
                app.activeDocument.close(SaveOptions.DONOTSAVECHANGES);
                app.userInteractionLevel = UserInteractionLevel.DISPLAYALERTS;

                w.close();
			} catch (err) {
				reply = {
					success: false,
					err: "Error on open(): " + (err.number & 0xFFFF) + ", " + err.description + ", " + fileArray[i].toString()
				};
			}
		}
		indesign15.activate();
		return reply;
	} else {
		// create a BridgeTalk message for Illustrator to invoke open
		var filesString = illustrator.fileArrayToString ( files );

		var btMessage = new BridgeTalk;
		btMessage.target = illustrator.targetName;
		btMessage.body = "illustrator.openIllustratorToConvertDXF (" + filesString + ");";
		btMessage.onResult = function(bto) {BridgeTalk.bringToFront(bto.sender);}
		btMessage.send();
	}
}

```

### Етап 3

Налаштуйте параметри плоттерів у файлі `preferences.json` (детальніше у розділі **Налаштування параметрів плоттерів** нижче).

### Етап 3
Закрийте всі вікна Adobe InDesign та Illistrator.
Запустіть по черзі **спочатку** Illistrator, а потім InDesign.
Це потрібно лише першого разу для правильної реєстрації скриптів. Далі можна запускати лише InDesign, надалі Illustrator запуститься за потреби.