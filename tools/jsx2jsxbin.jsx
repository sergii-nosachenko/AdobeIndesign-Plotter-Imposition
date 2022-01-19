(function () {
    //#target estoolkit#dbg
    //@target estoolkit#dbg
    var _STRINGS = {
        JP: {
            LOAD: "ファイルを開く"
        },
        EN: {
            LOAD: "Load File"
        }
    };
    var LOAD_SUPPORT_EXTENTION = ["JavaScript files:*.jsx;*.js;*.jsxinc", "All files:*.*"];
    var getLocalizedText = function (str) {
        if (app.isoLanguage == "ja_JP") {
            return str.jp;
        }
        else {
            return str.en;
        }
    };
    var folderPath = Folder.desktop;
    var fileName = decodeURIComponent(folderPath.fsName);
    var jsxFile = new File(fileName).openDlg(getLocalizedText({ jp: _STRINGS.JP.LOAD, en: _STRINGS.EN.LOAD }), LOAD_SUPPORT_EXTENTION);
    if (jsxFile == null) {
        return 0;
    }
    jsxFile.open("r");
    var jsxText = jsxFile.read();
    jsxFile.close();
    var jsxbinText = app.compile(jsxText);
    var jsxbinFile = new File(String(jsxFile.parent) + "/" + String(jsxFile.name.split(".")[0]) + ".jsxbin");
    jsxbinFile.open("w");
    jsxbinFile.write(jsxbinText);
    jsxbinFile.close();
}).call(this);
