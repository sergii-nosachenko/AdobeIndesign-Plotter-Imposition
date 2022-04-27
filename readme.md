![Project cover](tutorial/images/cover.jpg?raw=true)

# InDesign Imposition For Plotter Cutting script
[![en](https://img.shields.io/badge/language-english-red?style=for-the-badge)](readme.md)
[![uk](https://img.shields.io/badge/%D0%BC%D0%BE%D0%B2%D0%B0-%D1%83%D0%BA%D1%80%D0%B0%D1%97%D0%BD%D1%81%D1%8C%D0%BA%D0%B0-yellow?style=for-the-badge)](readme-uk.md)

This script allows you to easily imposition a file or group of files for plotter cutting in Adobe InDesign. Cutting ready files for each size are also generated.

## Requirements

* Adobe Indesign >= 14.0
* Adobe Illustrator >= 19.0
* Adobe Bridge >= 9.0 *(for script self-update)*
* Adobe ExtendScript Toolkit >= 4.0.0 *(for script compilation)* [Download](https://github.com/Adobe-CEP/CEP-Resources/tree/master/ExtendScript-Toolkit)

## Installation

All you have to do is copy the following file `Imposition For Plotter Cutting.jsxbin` from the `dist` folder to the working folder of InDesign scripts (example for Windows):

```bash
%APPDATA%\Adobe\InDesign\Version 15.0\en_GB\Scripts\Scripts Panel
```

*Path, version and language pack may differ!*

To quickly find the right folder:

1. Start Adobe InDesign
2. Activate the script bar: `Window> Utilities> Scripts`
3. Select the `Users` folder from the list
4. In the context menu, select `Reveal in Explorer`
5. Explorer window will open, where you need to navigate to the folder `Scripts Panel` and paste script inside

## Instructions

[Open](tutorial/tutorial.md)

## Compile the package into JSBIN format

In order to compile the working file correctly, you need to do the following:

### Option #1 - using the Adobe ExtendScript Toolkit menu

1. Launch the Adobe ExtendScript Toolkit
2. Open the file `source\Imposition For Plotter Cutting.jsx`
3. Select correct target under the tab with the file name - `Adobe InDesign 2020` *(depends on your installed version)*
4. Select the `File > Export As Binary ...` menu item
5. Save the compiled file to the InDesign script working folder

### Option #2 - using batch script (Adobe ExtendScript Toolkit is required be installed)

1. Run the `compile-jsxbin.bat` or` npm run compile` command script (bundled with [Node.js](https://nodejs.org/))
2. Select the file `source\Imposition For Plotter Cutting.jsx`
3. Select a folder to save the compiled script