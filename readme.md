# Скрипт для розкладки під плоттери

Даний скрипт дозволяє легко розкласти файл або групу файлів під плотерну порізку в Adobe InDesign. Також генерується файл з контуром порізки для кожного розміру.

## Вимоги

* Adobe Indesign >=14.0
* Adobe Illustrator >=19.0
* Adobe ExtendScript Toolkit >=4.0.0 *(для компіляції скрипта)*

## Інсталяція

### Етап 1

Для початку потрібно скопіювати наступні файли з папки `dist`:

```bash
Rozkladka na plotter.jsx
preferences.jsbin
```

у робочу папку скриптів InDesign (приклад для Windows):

```bash
%APPDATA%\Adobe\InDesign\Version 15.0\en_GB\Scripts\Scripts Panel
```

*Шлях, версія та мовний пакет можуть відрізнятись!*

Щоб швидко знайти правильну папку:

1. Запустіть Adobe InDesign
2. Активуйте панель скриптів: `Window > Utilities > Scripts`
3. В списку виберіть папку `Users`
4. В контекстному меню виберіть пункт `Reveal in Explorer`
5. Відкриється вікно провідника, в якому потрібно перейти в папку `Scripts Panel`

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

**Важливо: потрібно саме додати, а не заміняти наявний код! Видалення стандартних функцій може викликати проблеми в роботі пакету Adobe**

### Етап 3

Налаштуйте параметри плоттерів у файлі `preferences.json` (детальніше у розділі **Налаштування параметрів плоттерів** нижче).

### Етап 4
Закрийте всі вікна Adobe InDesign та Illistrator.
Запустіть по черзі **спочатку** Illistrator, а потім InDesign.
Це потрібно лише першого разу для правильної реєстрації скриптів. Далі можна запускати лише InDesign, надалі Illustrator запуститься за потреби.

## Налаштування параметрів плоттерів

Налаштування плоттерів знаходяться у файлі `preferences.json`.
Структура файлу наступна:

```javascript
{
  // Службові назви для шарів (опціонально)  
  // Дані налаштування потрібні лише тоді, якщо розкладка буде в документ, підготовлений вручну (він має бути підготовлений і відкритий завчасно)
  "layers": {
    // Шар для розміщення розкладки макетів
    "PRINTLayer": "PRINT",
    // Шар для розміщення міток
    "PLOTTERLayer": "PLOTTER",
    // Шар для розміщення контурів порізки
    "CUTLayer": "CUT",
    // Шар для розміщення назви файлу
    "TITLELayer": "TITLE"
  },
  // Масив параметрів для плоттерів
  "cutters": [
    {
      // Назва плоттера для відображення в меню
      "text": "", 
      // Мітка плоттера (буде розміщена в назві файлу)
      "label": "",
      // Назва формату паперу (буде розміщена в назві файлу)            
      "paperName": "",
      // Ширина листа в мм
      "widthSheet": 0,
      // Висота листа в мм
      "heightSheet": 0,
      // Службовий відступ від лівого краю листа (там не будуть розміщуватись макети при розкладці)
      "marginLeft": 0,
      // Службовий відступ від правого краю листа (там не будуть розміщуватись макети при розкладці)
      "marginRight": 0,
      // Службовий відступ від верхнього краю листа (там не будуть розміщуватись макети при розкладці)
      "marginTop": 0,  
      // Службовий відступ від нижнього краю листа (там не будуть розміщуватись макети при розкладці)
      "marginBottom": 0,
      // Мінімальний дозволений відступ в мм між контурами (АЛЕ! 0 мм буде доступним автоматично для прямокутників без скругління)
      "minSpaceBetween": 0,
      // Максимальний дозволений відступ в мм між контурами
      "maxSpaceBetween": 0,
      // Колір ліній порізки, масив значень від 0 до 100 в палітрі [C,M,Y,K] або стандартний колір з палітри InDesign, напр. "Black", "None"
      "contourColor": [0, 0, 0, 0],
      // Додатковий вихід лінії за межі контуру в мм (для порізки встик, щоб плоттер дорізав лінію в кінці)
      "contourOffset": 0.0,
      // Формат файлу зі згенерованим контуром порізки (залежить від моделі плоттера)
      // Доступні формати: "PDF", "AI" або "DXF"
      "plotterCutFormat": "",      
      // Якщо false - скрипт шукатиме файл з міткам порізки в параметрі "marksFile", якщо true - братиме дані з параметру "marksProperties"
      "marksGenerate": false,
      // Шлях до файлу з мітками порізки для цього формату та плоттеру (якщо "marksGenerate": false)
      "marksFile": "//path/to/marks/marks.pdf",
      // Масив налаштувань для кожної мітки (якщо "marksGenerate": true)
      "marksProperties": [
        {
          // Розміщення мітки відносно робочої області (обмежена службовими відступами)
          // Може бути одним із:
          // "left-top", "left-middle", "left-bottom" (на лівій службовій зоні зверху, по центру або знизу)
          // "right-top", "right-middle", "right-bottom" (на правій службовій зоні зверху, по центру або знизу)
          // "top-left", "top-middle", "top-right" (на верхній службовій зоні зліва, по центру або справа)
          // "bottom-left", "bottom-middle", "bottom-right" (на нижній службовій зоні зліва, по центру або справа)
          "position": "",
          // Форма мітки
          // Може бути одним із:
          // "oval" - овал/коло
          // "rectangle" - прямокутник
          // "line" - лінія
          "shape": "",
          // Товщина лінії обводки
          "strokeWeight": 0,
          // Колір лінії обводки по [C, M, Y, K] або стандартне значення, напр. "Black", "None"
          "strokeColor": [],
          // Колір заливки по [C, M, Y, K] або стандартне значення, напр. "Black", "None"
          "fillColor": [],
          // Ширина в мм
          "width": 0,
          // Висота в мм
          "height": 0,
          // Масив відступів в мм [зверху, справа, знизу, зліва]
          "margins": [0, 0, 0, 0],
          // Напрям лінії (лише для "shape": "line")
          // Може бути:
          // "vertical" - для вертикальної лінії (параметр "width" буде проігноровано)
          // "horizontal" - для горизонтальної лінії (параметр "height" буде проігноровано)
          // "top-bottom" - для діагональної лінії з лівого верхнього в правий нижній кут прямокутника з параметрами "width" та "height"
          // "bottom-top" - для діагональної лінії з лівого нижнього в правий верхній кут прямокутника з параметрами "width" та "height"
          "lineDirection": ""
        }      
      ]
    }      
  ]
}
```

## Компіляція пакету в формат JSBIN

Для того, щоб правильно скомпілювати робочий файл, потрібно виконати наступні дії:

1. Запустіть Adobe ExtendScript Toolkit
2. Відкрийте файл `source\Rozkladka na plotter.jsx`
3. У відкритому файлі під вкладкою з назвою файла потрібно вибрати правильний target - `Adobe InDesign 2020` *(версія залежатиме від встановленої)*
4. Виберіть меню `File > Export As Binary...`
5. Збережіть скомпільований файл до робочої папки скриптів InDesign