![Project cover](images/cover.jpg?raw=true)

# Instructions
[![en](https://img.shields.io/badge/language-english-red?style=for-the-badge)](tutorial.md)
[![uk](https://img.shields.io/badge/%D0%BC%D0%BE%D0%B2%D0%B0-%D1%83%D0%BA%D1%80%D0%B0%D1%97%D0%BD%D1%81%D1%8C%D0%BA%D0%B0-yellow?style=for-the-badge)](tutorial-uk.md)

## Contents

- [First run](#first-run)
- [Main window](#main-window)
  - [Interface](#main-window)
  - [Imposition methods](#imposition-methods-3)
  - [List of copies for all pages](#list-of-copies-for-all-pages-5)
  - [File name template](#file-name-template-8)
- [Imposition parameters](#imposition-parameters)
  - [Interface](#imposition-parameters)
  - [Circle shape settings](#circle-shape-settings)
  - [Rectangular shape settings](#rectangular-shape-settings)
  - [Mixed shape settings](#mixed-shape-settings)
- [Cutters preferences editor](#cutters-preferences-editor)
- [Edit custom mark](#edit-custom-mark)

## First run

After installing (this process is described [here](../readme.md)), you can proceed to the script's setup.
During first run you can see a warning window about an absence of the settings file named `preferences.json`.

![Script Alert](images/settings-not-found-alert-en.png?raw=true)

- `Yes` - script will create an empty file to store the settings and will open [Main Window](#main-window).
- `No` - script will terminate.

File `preferences.json` is required for script to work. If you already have the settings saved to file, you can copy this file to the folder specified in the dialog box (this is the same `Script Panel` folder where the script is located).

[↸ Section start](#first-run) | [↑ Contents](#contents)

## Main window

By default, the main window language will match Adobe InDesign interface language. If the script does not support this language, English will be set.
Script supports Ukrainian and English languages for now.

### Interface

![Main Window Initial](images/main-window-initial-en.png?raw=true)

The window consists of three main sections and a bottom panel:

#### Section A: **Input files**

This section allows you to select the input file(s) for the imposition.
    
**(1)** `Select` button launches the file selection dialog. Selected files will replace all existing ones in the list (2).
The following file formats are supported: PDF, AI, EPS, TIF.

**(2)** List of the selected files is splitted by pages.

---

#### Section B: **Imposition settings**

This section controls the file processing settings during the imposition.

**(3)** Drop-down list `Method`. [Contains three items](#imposition-methods-3).

**(4)** Checkbox `Leave multipage as is`: If the checkbox is active, multipage files will be saved as in the original. Otherwise, each page in the file list will be saved as a separate file.

**(5)** Textbox `List of copies for all pages`. Displays when selected method `Manual by copies`. [List writing rules](#list-of-copies-for-all-pages-5).

---

#### Section C: **Export settings**

This section allows you to configure the necessary parameters for plotters, imposition and saving results.

**(6)** `Destination folder' button. Allows you to select a path for saving the imposition results. The selected path will be displayed in field (7). Is required for script running.

**(7)** `Folder Name` field. Displays the path to the selected folder.

**(8)** Text field `File name template`. Depends on the method selected in field (3). [Details](#file-name-template-8).

**(9)** Field `Imposition parameters`. Displays the selected imposition method.

**(10)** Plotter and imposition settings button. For detailed information, go to [Imposition parameters](#imposition-parameters) section.

**(11)** `PDF export preset` drop-down list. Allows you to select one of the pre-configured profiles to export the imposition results to PDF. This list uses data from Adobe Indesign (or Adobe Acrobat Professional) export settings.

---

**(12)** Interface language selection drop-down. It requires a manual restart of the script.

**(13)** `Cancel` button. Exits the script.

**(14)** `Impose` button. Gets active when all the settings are properly set. Executes the script. 

[⇤ Article start](#interface) | [↸ Section start](#main-window) | [↑ Contents](#contents)

### Imposition methods (3)

The following options are available in the [main window](#main-window) in the `Method` drop-down list:

- **Every page on a separate sheet**: Each page in the imposition will contain only layouts of one kind. If checkbox (4) is active, then multipage files will be saved as in the original.

![Imposition method 1](images/Imposition-methods_1.png?raw=true)

- **Compose all same sizes on 1+ sheets**: each document will contain all files with the same shape parameters (size, fillet value, contours gap value) repeated from 1 time or more, filling the sheet completely. The number of sheets will be increased to fill with all layouts. The number of copies of each layout is calculated automatically.

![Imposition method 2](images/Imposition-methods_2.png?raw=true)

> *The page is filled zigzag style, starting from the upper left corner.*

- **Manual by copies**: Manually generated list of copies for each page or group of pages. When you select this item, the textbox `List of copies for all pages` (5) will appear.

[⇤ Article start](#imposition-methods-3) | [↸ Section start](#main-window) | [↑ Contents](#contents)

### List of copies for all pages (5)

You must specify the number of copies of each page separated by commas (sequence according to file list (2)). You can specify the number of consecutive pages: multiplier `x` number of copies.

The number of copies will be automatically increased to fill in the blanks in the final document.

*Example:*

```
4 files or pages selected. Required number of copies for each:
p.1 - 6 copies,
p.2 - 10 copies,
p.3 - 10 copies,
p.4 - 4 copies

Example of filling the 'Manual by copies' field:
8,2x10,4

If there are 12 items/sheet, a document with the following number of copies will be generated:
8, 12, 11 and 5 copies respectively = 36 pcs
Total 3 pages in the document
```

![Imposition method 3A](images/Imposition-methods_3A.png?raw=true)

> *The page is filled zigzag style, starting from the upper left corner.*

If you only need to fill in only specific pages, you need to put a `+` sign after the number of copies.

*Example:*

```
4 files or pages selected. Required number of copies:
p.1 - exactly 6 copies,
p.2 - exactly 10 copies,
p.3 - 10 copies or more
p.4 - 4 copies or more

Example of filling the 'Manual by copies' field:
6,10,10+,4+

If there are 12 items/sheet, a document with the following number of copies will be generated:
6, 10, 13 and 7 copies respectively = 36 pcs
Total 3 pages in the final document

```

![Imposition method 3B](images/Imposition-methods_3B.png?raw=true)

> *The page is filled zigzag style, starting from the upper left corner.*

[⇤ Article start](#list-of-copies-for-all-pages-5) | [↸ Section start](#main-window) | [↑ Contents](#contents)

### File name template (8)

- If `Each page on a separate sheet` is selected, it allows you to set the **file name prefix**, which will be added before the original file name (optional).

     *Example:*

     ```
     Original file name: MySticker_logo.pdf
     File name template (prefix): #11-2345
     Imposing settings:
       shape - circle with a diameter of 40 mm,
       contours gap - 1 mm,
       plotter alias - MP,
       paper format alias - SRA3

     Saved document name:
     #11-2345_MySticker_logo_D=40(1)mm_MP_SRA3.pdf
     ```

- If you select `Compose all same sizes on 1+ sheets` or ` Manual by copies` you need to enter **full file name**, which will be used as final file name (required). It is possible to use the %names% placeholder, which will be replaced by the file name or names (if there are several in document).

    *Example:*

    ```
    Names of original files: MySticker_logo.pdf; Another_sticker.pdf
    File name template: #11-2345_%names%
    Imposition settings:
      shape - circle with a diameter of 40 mm,
      contours gap - 1 mm,
      plotter alias - MP,
      paper format alias - SRA3

    Saved document name:
    #11-2345_MySticker_logo + Another_sticker_D=40(1)mm_MP_SRA3.pdf
    ```

[⇤ Article start](#file-name-template-8) | [↸ Section start](#main-window) | [↑ Contents](#contents)

## Imposition parameters

This window allows you to adjust the shape parameters for the current imposition, select and configure the cutting plotter.

Sheet settings, margin sizes, cutting outline settings and marks are linked to plotter settings.

### Interface

![Imposition Preferences Window](images/imposition-preferences-en.png?raw=true)

The window consists of three main sections and a bottom panel:

#### Section A: **Shape selection**

This section allows you to set the parameters of the shapes that will be placed on a sheet.
    
**(1)** List of available shapes: [Circles](#circle-shape-settings), [Rectangles](#rectangular-shape-settings) and [Mixed](#mixed-shape-settings).

**(2)** Section with shape parameters. The contents depends on the selected shape (1). Read more in shapes articles.

**(3)** Checkbox `Take parameters from file names`. If
it is checked, the parameters of the shapes will be extracted from the file names. Read more about file names in shapes articles. If this option is disabled, the parameters must be specified in the fields below (4).

**(4)** Fields with shape settings. The contents depends on the chosen shape.

---

#### Section B: **Imposition settings**

This section allows you to set imposition parameters and select a necessary plotter.
    
**(5)** `Selected plotter` drop-down list. Allows you to select plotter settings from previously saved ones.

**(6)** Configure plotter settings button. Allows you to add, edit and delete plotter settings. Opens [Cutters preferences editor](#cutters-preferences-editor).

**(7)** Field `Contours gap`. Sets the distance between cutting contours. The minimum and maximum values are set in the plotter settings. Special value is 0 mm, which is only available for rectangles.

If the `Take parameters from file names` (3) checkbox is checked, this parameter will be replaced by the one specified in the file name. The value of this field will be used by default for all other cases.

**(8)** Checkbox `No bleeds`. If
checkbox is checked, the layouts will be placed in the shape frames without bleeds (layout image outside the cutting contour).

If the checkbox is inactive (by default), the bleeds value will be equal a half the minimum gap value for the selected plotter. For example, if the plotter has a minimum contours gap of 1 mm, the image bleed will always be 0.5 mm regardless of the current gap value.

**(9)** Checkbox `Save file with cut contours`. When this option is checked, the script will generate and save the plotter cut file in the output folder. Otherwise, only the imposition files will be saved.

---

#### Section C: **Available imposition layouts**

This section allows you to select one of the possible layout schemes.
    
**(10)** This list contains available imposition shemes if all the layout settings are correct. If the checkbox `Take parameters from file names` is checked, this list is not generated and the layout scheme will be selected by the script automatically with maximum number of items per page.

---

**(11)** `Cancel` button.

**(12)** `Save` button. Saves imposition settings and returns control to [main window](#main-window).

[↸ Section start](#imposition-parameters) | [↑ Contents](#contents)

### Circle shape settings

![Circles parameters](images/figure-parameters-circles-en.png?raw=true)

- Checkbox `Take parameters from file names`:
    - **Checked** - circle parameters will be extracted from file names. Each file name must contain the settings in square brackets [ ]:

      `[ D={1} ({2}) ]`
      
      `{1}` - cut diameter in mm, `{2}` - contour gap in mm (optional)

      *Correct file names examples:*

      ```
      MyStickers[D=25].tif
      MyStickers[d=100.5].eps
      MyStickers[D=50(1.5)].ai
      MyStickers [ D=40,5 (1) ].pdf
      ```

      *Incorrect file names examples*

      ```
      MyStickers.tif
      MyStickers[25].eps
      MyStickers[D={25}].eps
      MyStickers [D40].ai
      MyStickers[D=40.5 1].pdf
      MyStickers [D=40 ({2})].pdf
      ```

    - **Inactive** - the parameters of the circles will be taken from the field `Diameter`. If the file name contains settings in square brackets [ ], they will be ignored.

- Field `Diameter` - circle diameter in mm. Must be a number > 0. Will be applied to all impositions.

[⇤ Article start](#circle-shape-settings) | [↸ Section start](#imposition-parameters) | [↑ Contents](#contents)

### Rectangular shape settings

![Rectangles parameters](images/figure-parameters-rectangles-en.png?raw=true)

- Checkbox `Take parameters from file names`:
    - **Checked** - rectangle settings will be extracted from file names. Each file name must contain the settings in square brackets [ ]:

      `[ {1}x{2} R={3} ({4}) ]`
      
      `{1}` - cut width in mm, `{2}` - cut height in mm, `{3}` - fillet radius in mm (optional), `{4}` - contour gap in mm (optional)

      *Correct file names examples:*

      ```
      MyStickers[25x10].tif
      MyStickers[100.5x55].eps
      MyStickers[50x40(1.5)].ai
      MyStickers [50x40 R=2].pdf
      MyStickers [50x40 R=1.5 (1)].pdf
      ```

      *Incorrect file names examples*

      ```
      MyStickers.tif
      MyStickers[25].eps
      MyStickers[25x0].eps
      MyStickers[{25}x{30}].eps
      MyStickers [40x50x2].ai
      MyStickers[40.5x30 1].pdf
      MyStickers [50x40 ({1})].pdf
      MyStickers [50x40 (1) R=1.5].pdf
      ```

    - **Inactive** - the parameters of the rectangles will be taken from the fields `Width`,` Height`, `Fillet value`. If the file name contains settings in square brackets [ ], they will be ignored.

- Field `Width` - the width of the rectangle in mm. Must be a number > 0. Will be applied to all impositions.

- Field `Height` - the height of the rectangle in mm. Must be a number > 0. Will be applied to all impositions.

- Checkbox and field `Fillet value` - fillet radius of corners of the rectangle in mm. If the checkbox is active, value must be > 0 but not larger than half of the smallest side. Will be applied to all impositions.

[⇤ Article start](#rectangular-shape-settings) | [↸ Section start](#imposition-parameters) | [↑ Contents](#contents)

### Mixed shape settings

![Mixed parameters](images/figure-parameters-mixed-en.png?raw=true)

- Checkbox `Take parameters from file names`:
    - **Always checked** - the parameters of the shapes will be extracted from the file names. Each file name must contain the settings in square brackets [ ]. Options can be set for [circles](#circle-shape-settings) or for [rectangles](#rectangular-shape-settings).

[⇤ Article start](#mixed-shape-settings) | [↸ Section start](#imposition-parameters) | [↑ Contents](#contents)

## Cutters preferences editor

This dialog allows you to create, change or delete plotter settings.

### Interface

![Potter settings](images/plotter-settings-en.png?raw=true)

ВThe window consists of a top panel and four main sections:

**(1)** List of available plotter settings. Includes a special 'Add new' item that creates a new blank plotter.

**(2)** `Duplicate` button - duplicates the current plotter.

**(3)** `Save` button - saves changes to the current plotter.

**(4)** `Remove` button - deletes the current plotter.

**(5)** `Close` button - returns to the previous window.

**(6)** Text field `Cutter name`. Required field.

**(7)** Text field `Cutter alias` - abbreviation (plotter alias), will be used in file names for operator to identify the destibation cutter. Required field.

---

#### Section A: **Document settings**

This section allows you to set the sheet parameters for the layout.
    
**(8)** Field `Width` - sheet width in mm. Number from 50 to 5486 mm.

**(9)** Field `Height` - sheet height in mm. Number from 50 to 5486 mm.

**(10)** The `Paper name` field is the short name of the paper size *(eg. "A4")*. Optional.

**(11), (12), (13), (14)** Fields `Margins` - top, right, bottom and right margins of the sheet. It describes a work area on the sheet on which the imposition will be occured. Optical marks for cutter should be located outside this work area inside the margins area.

The value can be >= 0, but the axis sum can't exceed the width and height values, respectively.

**(15)** Checkbox `Allow workspace to shrink` is available if there is no external marks source file is set (25).
If the item is checked, the marks will be automatically moved closer to the general art boundaries of the layout before saving.

![Shrink workarea](images/Shrink-workarea.png?raw=true)

*Attention!* Be careful when activating this checkbox, because in case of a small size of artwork bounds it is possible that marks will interfer with each other, which may lead to the impossibility of recognizing them with an optical scanner of cutting plotter.

---

#### Section B: **Contours settings**

**(16), (17)** Fields `Space between` - minimum and maximum allowable values of contour gaps. The minimum value determines the layout bleed value, which will be equal to half the minimum gap value.

Must be a number > 0 mm. A value of 0 is automatically available for rectangle shape imposition.

**(18), (19), (20), (21)** Fields `Contour color` - CMYK color values for cut contour paths. Must be a number from 0 to 100.

**(22)** Field `Line width` - the value of the line thickness of the cutting contour in mm. Minimum is 0.1 mm.

**(23)** Field `Overcut` - the additional outlet of the cutting line beyond the outer boundaries of the shape contour when cutting rectangles with 0 mm gap. Useful for better stickers separation.

**(24)** Drop-down list `File format` - output file format to save the cutting contour. Available options are `PDF`, `AI` and `DXF`. To save `AI` and` DXF` you need to have Adobe Illustrator installed.

---

#### Section C: **Marks file source**

**(25)** Checkbox `Use external file` - if this item is checked, you must specify the path to the file with optical marks that fits the parameters of plotter and sheet size. Only one-page `PDF` file is allowed as source.

**(26)** Field with the path to the external optical marks file.

**(27)** `Choose` button - allows you to pick a file. Replaces the previous one (26).

---

#### Section D: **Manual marks list**

**(28)** List of user defined marks.

**(29)** `Add` button - allows you to create and configure a new mark. Opens [Edit custom mark](#edit-custom-mark) window.

**(30)** `Edit` button - allows you to change the parameters of the selected mark. Opens [Edit custom mark](#edit-custom-mark) window.

**(31)** `Clone` button - creates a copy of the selected mark with the same parameters.

**(32)** `Remove` button - deletes the selected mark.

[↸ Section start](#cutters-preferences-editor) | [↑ Contents](#contents)

## Edit custom mark

This dialog box allows you to adjust the parameters of optical and information marks of the plotter.

### Interface

![Potter settings](images/marks-editor-en.png?raw=true)

The window consists of a top panel, four main sections and a bottom panel:

**(1)** List of available marks forms. Available are `Oval`,`Rectangle`, `Line` or `Text`.

---

#### Section A: **Relative position**

Sets the position of the mark relative to the working area.

**(2)** Sheet size specified in [plotter settings](#cutters-preferences-editor) (8) (9).

**(3)** The size of the working area. The size is calculated based on the size of the sheet margins.

**(4)** Sheet margins specified in [plotter settings](#cutters-preferences-editor) (11) (12) (13) (14).

**(5)** One of the 12 relative mark placement options. Obligatory to select one.

![Marks placement and margins](images/Marks-placement-and-margins.png?raw=true)

---

#### Section B: **Dimensions**

Specifies the size of the mark or text frame (for the `Text` mark).

**(6), (7)** Fields `Width` and` Height` - set the dimensions of the mark in mm.

In case of `Line` mark only `Height` is available.

**(8), (9), (10), (11)** Fields `Margins` - top, right, bottom and right mark margins. Describes the offsets of the mark relative to the starting position selected in `Relative position` section (5).

The value may be less than 0.

*Example for a rectangular mark on the top left side with margins [0, 0, 0.5, 0.5]*

![Marks placement example](images/Marks-placement-examples-01.png?raw=true)

*Example for a oval mark on the top middle side with margins [0, 0, -0.5, 0]*

![Marks placement example](images/Marks-placement-examples-02.png?raw=true)

**(12)** Field `Rotation angle` - sets the rotation angle of the mark, starting from the upper central point relative to the center of the mark's bounds. It can be number from -360 to 360, where negative angles indicate a clockwise rotation and positive angles indicate a counterclockwise rotation.

For the `Line` mark shape, rotation angles of 0 or 180 indicate a vertical line, and 90 or -90 means a horizontal line.

No rotation angle is available for the `Text` mark shape. Instead, you can specify `Orientation` (26) of the letters relative to the sheet borders.

---

#### Section C: **Mark style**

**(13), (14), (15), (16)** The `Fill color` fields - CMYK fill color values for mark. Must be a numbers from 0 to 100.

Not available for `Line`.

**(17)** Field `Stroke weight` - value of mark line thickness. Can be a number >= 0.

For the `Line` mark is required to be set > 0.

Not available for the `Text` mark.

**(18), (19), (20), (21)** The `Stroke color` fields - CMYK outline color values for mark. Must be a number from 0 to 100. Available if `Stroke weight` (17) is greater than 0.

---

#### Section D: **Text settings**

Specifies additional parameters for the text frame (only for the `Text` marks).

**(22)** Drop-down list `Font name` - the name of the font to use.

**(23)** Field `Size` - text size in pt. Minimum value is 1 pt.

**(24)** Text field `Template` - text content for text frame. You can use automatic placeholders from the list below (25).

**(25)** `Placeholders` drop-down list - text placeholders available for insert. The script will automatically replace them with the appropriate values ​​during generation.

**(26)** `Orientation` drop-down list - available options: `Top of text to page border` and `Top of text to layout frame`. Depending on the placement of the text block, the text will be oriented according to the selected option.

---

**(27)** Drop-down list `Mark appearance` - available options:

- `Cut & Print files` - mark will be placed on the cut and printable files at the same time

- `Cut file` - mark will be placed only on the cut file

- `Print file` - mark will be placed only on the printable file

**(28)** `Cancel` button.

**(29)** `Save` button - saves the mark in the plotter settings.

[↸ Section start](#edit-custom-mark) | [↑ Contents](#contents)