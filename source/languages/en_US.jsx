var LANG = LANG || {};
LANG['en_US'] = {
    name: 'en_US',
    title: 'English',
    values: {
        'Plugin Title': 'Imposition for plotter cutting | %version% | © Sergii Nosachenko',
        'Input Files Label': 'Input files',
        'Choose Files Label': 'Select one or more files',
        'Select Files Btn': 'Select',
        'Files Name List': 'List of files and pages',
        'Imposing Panel Title': 'Imposition settings',
        'Imposing Method Label': 'Method',
        'Imposing Method 1': 'Every page on separate sheet',
        'Imposing Method 2': 'Compose all same sizes on 1+ sheets',
        'Imposing Method 3': 'Manual by copies',
        'Imposing Method 3 Text': 'List of copies for all pages',
        'Imposing Method 3 Help Tip': 'Specify the number of copies of each page separated by commas (sequence according to the list above). You can specify the number of pages in a row: before the copies put the required number and the letter \"x\". \nThe number of copies will be automatically increased to fill in the blanks in the document. If you only need to fill in certain pages: put a \"+\" sign after the number of copies.',
        'Multipage File Save': 'Leave multipage files as is',
        'Export Settings Panel Title': 'Export settings',
        'Choose Folder Label': 'Destination folder',
        'Add Folder Btn': 'Choose',
        'Folder Name Label': 'Folder name',
        'File Name Label': 'File name template',
        'File Name Text Only Prefix': 'Add file prefix (non obligatory)',
        'File Name Text Only Prefix Info': '+ page number and source file name will be appended automatically',
        'File Name Text Full': 'Enter full file name (required)',
        'File Name Text Full Info': 'You can youse %names% placeholder for inserting source file name',
        'Imposition Label': 'Imposition parameters',
        'Imposition Not Defined': 'Not set',
        'PDF Preset Label': 'PDF export preset',
        'Add File Name Label': 'Add file name and page counter to sheets',
        'Cancel Btn': 'Cancel',
        'Impose Btn': 'Impose',
        'Files Dialog Title': 'Select one or more PDF, AI or TIF files',
        'Folder Dialog Title': 'Choose folder for export',
        'File Name Bad Alert': 'Invalid characters in filename!',
        'Imposition Template Settings Title': 'Imposition parameters',
        'Circles': 'Circles',
        'Circle Settings Panel Title': 'Circles settings',
        'Circle Filename Disclaimer': 'CIRCLES: File name must contains: _D={1}_, where {1} - diameter in mm.',
        'Diameter Label': 'Diameter',
        'Diameter Tip': 'Diameter must be a number > 0',
        'Rectangles': 'Rectangles',
        'Rectangles Settings Panel Title': 'Rectangles settings',
        'Rectangles Filename Disclaimer': 'RECTANGLES: File name must contains: _{1}x{2} R={3}_, where {1} - width, {2} - height, {3} - fillet radius in mm. Width and height are required.',
        'Width Label': 'Width',
        'Width Tip': 'Width must be a number > 0',
        'Height Label': 'Height',
        'Height Tip': 'Height must be a number > 0',
        'Round Corners Label': 'Fillet value',
        'Round Corners Value Tip': 'Fillet value must be a number from 0 to %max% mm',
        'Including 0': ' as well as 0.',
        'Mixed': 'Mixed',
        'Mixed Settings Panel Title': 'Mixed settings',
        'Size From Filename': 'Take parameters from file names, otherwise ignore',
        'Units mm': 'mm',
        'Units pieces': '',
        'Plotter Panel Title': 'Imposition settings',
        'Cutter Types Label': 'Select plotter',
        'Space Between Label': 'Contours gap',
        'Space Between Tip': 'Gap value must be a number between %min% and %max%',
        'Is Zero Bleeds Chk': 'Zero bleeds (not recommended)',
        'Bleed Warning Text': 'Bleeds must be equal to %bleeds% mm!',
        'Save File With Cut': 'Save file with cut contours',
        'Variants Panel Title': 'Available imposition layouts',
        'Optimal Variant': 'The best option will be taken',
        'Save Btn': 'Save',
        'As In Files Names': 'According to the file names',
        'Circles processing': 'Impositioning of circles ',
        'Rectangles processing': 'Impositioning of rectangles ',
        'Creating new document': 'Creating new document...',
        'Processing file': 'Processing file %fileCounter% of %totalFilesLength% (page %currentPage% of %pgCount%)',
        'Adding page': 'Adding new page...',
        'Items counter message': 'Element %countDone%/%total%',
        'Exporting PDF': 'Exporting PDF...',
        'Background tasks running': 'Background operations are in progress',
        'Background tasks wait': 'Wait for the file export to complete',
        'Background tasks message': 'It may take a few minutes...',
        'Error - Failed to export': 'Error exporting to PDF',
        'Skipped files title': 'The following files have not been processed!',
        'Accept Btn': 'Accept',
        'Timeleft calculating': ' (calculating estimated time...)',
        'Timeleft message': 'it will take',
        'hours': 'hr',
        'minutes': 'min',
        'seconds': 'sec',
        'Importing marks': 'Importing marks...',
        'Generating marks': 'Generating marks...',
        'Preparing document': 'Preparing document',
        'Prepare circular cut': 'Preparing imposition D=%Diameter%mm',
        'Adding elements': 'Adding elements...',
        'Exporting cut file': 'Exporting cut file...',
        'Prepare rectangular cut': 'Preparing imposition %widthItem%x%heightItem%mm',
        'Language change restart': 'To apply changes manually close and open script',
        'Language change title': 'Restart script needed',
        'Confirm create new json': 'Settings not found',

        'Cytter Prefs Window': 'Cutters preferences editor',
        'Add new': 'Add new',
        'Save': 'Save',
        'Remove': 'Remove',
        'Cutter name label': 'Cutter name',
        'Cutter label tip': 'Short abbreviation for contour file name (max 6 chars)',
        'Document settings': 'Document settings',
        'Sheet size': 'Sheet size:',
        'Sheet width tip': 'Must be a number from 50 to 5486 mm',
        'Paper name': 'Paper name',
        'Paper name tip': 'String with paper alias (optional)',
        'Margins label': 'Margins:',
        'Top label': 'Top',
        'Right label': 'Right',
        'Bottom label': 'Bottom',
        'Left label': 'Left',
        'Margin value tip': 'Must be a number >= 0 in mm',
        'Contours panel': 'Contours settings',
        'Space between min': 'Space between min',
        'Space between max': 'max',
        'Space between min tip': 'Must be a number > 0 in mm\n0 is available by default',
        'Space between max tip': 'Must be a number >= min value in mm',
        'Contour color': 'Contour color',
        'Contour color tip': 'Must be a number from 0 to 100 (%)',
        'Overcut label': 'Overcut',
        'Overcut value tip': 'Must be a number >= 0 in mm\nNeeds for table-style cutting',
        'File format label': 'File format',
        'Marks file source panel': 'Marks file source',
        'External file checkbox': 'Use external file',
        'Choose btn': 'Choose',
        'Workspace Shrink': 'Allow workspace to shrink to the size of art bounds',
        'Manual marks list panel': 'Manual marks list',
        'Clone mark btn': 'Clone',
        'Remove mark btn': 'Remove',
        'Edit mark btn': 'Edit',
        'Add mark btn': 'Add',
        'Get marks file title': 'Select marks source file',
        'One page alert': 'Only 1 page allowed for marks source file!',
        'Confirm save msg': 'You have unsaved data. Save it before clear?',
        'Confirm save title': 'Save your plotter data',
        'Remove plotter msg': 'Are you sure to remove plotter %plotterName%?',
        'Remove plotter title': 'Confirm delete',
        'Shape col': 'Shape',
        'Position col': 'Position',
        'Size col': 'Size',
        'Margins col': 'Margins',
        'Appearance col': 'Appearance',
        'Not defined': 'Not defined',

        'Edit Mark Window': 'Edit custom mark', 
        'Oval mark': 'Oval', 
        'Rectangle mark': 'Rectangle', 
        'Line mark': 'Line', 
        'Text mark': 'Text',
        'Cut file': 'Cut file',
        'Print file': 'Print file',
        'Cut & Print files': 'Cut & Print files',

        'Position Panel': 'Relative position',
        'Sheet': 'Sheet',
        'Frame': 'Frame',
        'Dimensions Panel': 'Dimensions',
        'Size Label': 'Size',        
        'Margins Label': 'Margins:',        
        'Margins top tip': 'Mark top margin',        
        'Margins right tip': 'Mark right margin',        
        'Margins bottom tip': 'Mark bottom margin',        
        'Margins left tip': 'Mark left margin',        
        'Rotation Label': 'Rotation angle',        
        'Rotation tip': 'Must be a number from -360 to 360\nThe angle is measured in a counterclockwise direction starting from top point!',        
        'Style panel': 'Mark style',
        'Fill color label': 'Fill color:',
        'Stroke weight label': 'Stroke weight',
        'Stroke weight tip': 'Must be a number >= 0',
        'Stroke color label': 'Stroke color:',
        'Text panel': 'Text settings',
        'Font Name label': 'Font name:',
        'Font Size tip': 'Must be a number > 0',
        'Template label': 'Template:',
        'Template tip': 'You can use placeholders:\n%DocumentName% - document name as it saved\n%DocumentFolder% - document folder path\n%CurrentPage% - current page of a document\n%TotalPages% - total pages in a document\n%PlotterName% - chosen plotter name\n%ItemContourSize% - item cut contour size in mm\n%ContourGap% - cut contour gap value in mm\n%ItemsPerPage% - items per page count\n%ItemsPerDocument% - items per document count\n%SheetSize% - page sheet size WxHmm\n%CurrentTime% - current time in HH:MM:SS format\n%CurrentDate% - current date in DD-MM-YYYY format\n%UserName% - user name set in File > User... menus',
        'Text Orientation Label': 'Orientation:',
        'Text to border orientation': 'Top of text to page border',
        'Text to frame orientation': 'Top of text to layout frame',
        'Mark Appearance Label': 'Mark appearance:',

        'TopLeft': 'Top side, align left',
        'TopMiddle': 'Top side, align middle',
        'TopRight': 'Top side, align right',
        'BottomLeft': 'Bottom side, align left',
        'BottomMiddle': 'Bottom side, align middle',
        'BottomRight': 'Bottom side, align right',
        'LeftTop': 'Left side, align top',
        'LeftMiddle': 'Left side, align middle',
        'LeftBottom': 'Left side, align bottom',
        'RightTop': 'Right side, align top',
        'RightMiddle': 'Right side, align middle',
        'RightBottom': 'Right side, align bottom',

        'Error - Unknown size': 'Could not recognize size',
        'Error - No variants': 'Could not find any imposition layout',
        'Error - Too big radius': 'Radius too large',
        'Error - Creating document': 'An error occurred while creating a new layout document!',
        'Error - Incorrect params': 'Error processing parameters for layout!',
        'Error - Unknown document failure': 'An unknown error occurred while creating a new document!',
        'Error - No document': 'There is no document to place marks',
        'Error - No access to marks file': 'Cannot access marks file: ',
        'Error - No working frame data': 'No data on the size of the workspace',
        'Error - Unknown marks error': 'An unknown error occurred while adding marks!',
        'Error - JSON preferences not found': 'No app settings found in\n%path%\nCreate new instead?',
        'Error - JSON parse failed': 'Error processing plotter settings json file!',
        'Error - Unknown mark alignment': 'Error creating marks for cutting - unknown alignment parameter for mark #%index%: %alignment%',
        'Error - Unknown mark position': 'Error creating marks for cutting - unknown position parameter for mark #%index%: %pos%',
        'Error - Unknown mark direction': 'Error creating marks for cutting - unknown direction for mark #',
        'Error - Unknown mark shape': 'Error creating marks for cutting - unknown shape for mark #%index%: %markShape%',
        'Error - cant create file': 'Cannot create file in path ',
        'Error - Illustrator cannot convert': 'Illustrator can\'t convert contours file to %format%\n%error%',
        'Error - Cannot export file': 'Can\'t export file %filename%. Maybe file is already opened or output folder doesn\'t accessible',
    }
};

LANG['en_GB'] = {
    name: 'en_GB',
    title: 'English',
    values: LANG['en_US'].values
};