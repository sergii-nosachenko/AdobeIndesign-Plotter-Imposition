/*
    Compile jsx file to jsxbin using ExtendScript Toolkit
    v.1.0
*/

//#target estoolkit#dbg
//@target estoolkit#dbg

(function () {
    
   try {
        var jsxFile = File.openDialog('Load JSX File', 'JavaScript files:*.jsx;*.js;*.jsxinc', false);
        
        if (jsxFile == null) {
            return;
        };
    
        jsxFile.open('r');
        var jsText = jsxFile.read();
        jsxFile.close();
    
        var jsxbinText = app.compile(jsText, undefined, jsxFile.parent.absoluteURI);
        
        var folder = new Folder(jsxFile.path);
        var destFolder = folder.selectDlg('Select destination folder');
        
        var jsxbinFilename = String(destFolder.fullName) + '/' + String(jsxFile.name) + 'bin';
        var jsxbinFile = new File(jsxbinFilename);
        jsxbinFile.open('w');
        jsxbinFile.write(jsxbinText);
        jsxbinFile.close();
        alert('Compiled to ' + jsxbinFile.fsName, 'Successfull');
    } catch(err) {
        alert(err, 'Error during script execution', true);
    };
    
}).call(this);
