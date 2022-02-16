SET ToolkitPath="%ProgramFiles(x86)%\Adobe\Adobe ExtendScript Toolkit CC\ExtendScript Toolkit.exe"
rem workaround for Windows7 32 bit:
IF NOT DEFINED ProgramFiles(x86) SET ToolkitPath="%PROGRAMFILES%\Adobe\Adobe ExtendScript Toolkit CC\ExtendScript Toolkit.exe"

%ToolkitPath% -cmd "tools\jsx2jsxbin.jsx"