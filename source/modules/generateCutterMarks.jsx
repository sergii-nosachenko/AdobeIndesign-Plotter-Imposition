/**
  Генерація міток порізки, якщо така опція прописана в налаштуваннях плоттера.
  @param {Object class Document} myDocument Поточний документ Adobe InDesign
  @param {Object} myCurrentDocSettings Параметри та налаштування розкладки, які необхідно опрацювати
  @param {Object class Layer} MarksLayer Шар для розміщення міток
  @param {string} docType Тип документа
*/
function generateCutterMarks(myDocument, myCurrentDocSettings, MarksLayer, docType) {

  if (!myCurrentDocSettings.CutterType.marksProperties) return;

  var marksCoordinates = [];

  var contoursBounds;

  const pages = myDocument.pages.everyItem().getElements();
  const firstPage = myDocument.pages.firstItem();

  const appAnchorPoint = app.changeObjectPreferences.anchorPoint;
  const docAnchorPoint = myDocument.anchoredObjectSettings.anchorPoint;

  app.changeObjectPreferences.anchorPoint = AnchorPoint.CENTER_ANCHOR;
  myDocument.anchoredObjectSettings.anchorPoint = AnchorPoint.CENTER_ANCHOR;

  if (myCurrentDocSettings.CutterType.workspaceShrink && myCurrentDocSettings.CutterType.workspaceShrink === true) {
    contoursBounds = myCurrentDocSettings.Params.contoursBounds;
  } else {
    contoursBounds = [
      firstPage.bounds[0] + myCurrentDocSettings.CutterType.marginTop,
      firstPage.bounds[1] + myCurrentDocSettings.CutterType.marginLeft,
      firstPage.bounds[2] - myCurrentDocSettings.CutterType.marginBottom,
      firstPage.bounds[3] - myCurrentDocSettings.CutterType.marginRight
    ];
  };

  const ItemContourSize = function() {
    switch (MY_DOC_SETTINGS.Figure) {
      case translate('Circles'):
        return 'D=' + MY_DOC_SETTINGS.Diameter;
      case translate('Rectangles'):
        return MY_DOC_SETTINGS.RectWidth + 'x' + MY_DOC_SETTINGS.RectHeight
          + (
            myCurrentDocSettings.IsRoundedCorners
              ? ' R=' + myCurrentDocSettings.RoundedCornersValue
              : ''
          );
      default:
        return '';
    }
  }

  const zeroStart = function(num) {
      return num < 10 ? '0' + num : num;
  }

  const CurrentTime = function() {
    const date = new Date();
    const hours = zeroStart(date.getHours());
    const minutes = zeroStart(date.getMinutes());
    const seconds = zeroStart(date.getSeconds());

    return hours + ':' + minutes + ':' + seconds;
  }

  const CurrentDate = function() {
    const date = new Date();
    const day = zeroStart(date.getDate());
    const month = zeroStart(date.getMonth() + 1);
    const year = zeroStart(date.getFullYear());

    return day + '-' + month + '-' + year;
  }

  var placeholders = {
    'DocumentName': File.decode(myDocument.name),
    'DocumentFolder': Folder.decode(myCurrentDocSettings.outputFolder),
    'CurrentPage': 0,
    'TotalPages': myDocument.pages.count(),
    'PlotterName': myCurrentDocSettings.CutterType.text,
    'PlotterAlias': myCurrentDocSettings.CutterType.label,
    'ItemContourSize': ItemContourSize(),
    'CutLength': myCurrentDocSettings.Params.cutLength,
    'ContourGap': myCurrentDocSettings.SpaceBetween,
    'ItemsPerPage': myCurrentDocSettings.Params.total,
    'ItemsPerDocument': myCurrentDocSettings.Params.total * myDocument.pages.count(),
    'SheetSize': myCurrentDocSettings.CutterType.widthSheet + 'x' + myCurrentDocSettings.CutterType.heightSheet,
    'PaperName': myCurrentDocSettings.CutterType.paperName,
    'CurrentTime': CurrentTime(),
    'CurrentDate': CurrentDate(),
    'UserName': app.userName || ''
  }

  try {

    // Вираховуємо координати всіх міток

    for (var i = 0, props = myCurrentDocSettings.CutterType.marksProperties; i < props.length; i++) {

      var side = props[i].position.split("-")[0] || null;
      var alignment = props[i].position.split("-")[1] || null;
      props[i].width = props[i].width || 0;
      props[i].height = props[i].height || 0;

      // Обчислюємо координати залежно від розміщення відносно розкладки

      var y1 = contoursBounds[0];
      var x1 = contoursBounds[1];
      var y2 = contoursBounds[2];
      var x2 = contoursBounds[3];

      var mt = props[i].margins[0];
      var mr = props[i].margins[1];
      var mb = props[i].margins[2];
      var ml = props[i].margins[3];

      var h = props[i].height;
      var w = props[i].width;

      switch (side) {
        case "left":
          switch (alignment) {
            case "top":
              marksCoordinates.push([
                y1 + mt,
                x1 - mr - w,
                y1 + mt + h,
                x1 - mr
              ]);
              break;
            case "middle":
              marksCoordinates.push([
                (y1 + y2) / 2 - mb + mt - h /2,
                x1 - mr - w,
                (y1 + y2) / 2 - mb + mt + h /2,
                x1 - mr
              ]);
              break;
            case "bottom":
              marksCoordinates.push([
                y2 - mb - h,
                x1 - mr - w,
                y2 - mb,
                x1 - mr
              ]);
              break;
            default:
              throw new Error(translate('Error - Unknown mark alignment', {index: i, alignment: alignment}));
            };
            break;
        case "right":
          switch (alignment) {
            case "top":
              marksCoordinates.push([
                y1 + mt,
                x2 + ml,
                y1 + mt + h,
                x2 + ml + w
              ]);
              break;
            case "middle":
              marksCoordinates.push([
                (y1 + y2) / 2 - mb + mt - h /2,
                x2 + ml,
                (y1 + y2) / 2 - mb + mt + h /2,
                x2 + ml + w
              ]);
              break;
            case "bottom":
              marksCoordinates.push([
                y2 - mb - h,
                x2 + ml,
                y2 - mb,
                x2 + ml + w
              ]);
              break;
            default:
              throw new Error(translate('Error - Unknown mark alignment', {index: i, alignment: alignment}));
            };
            break;
        case "top":
          switch (alignment) {
            case "left":
              marksCoordinates.push([
                y1 - mb - h,
                x1 + ml,
                y1 - mb,
                x1 + ml + w
              ]);
              break;
            case "middle":
              marksCoordinates.push([
                y1 - mb - h,
                (x1 + x2) / 2 - mr + ml - w / 2,
                y1 - mb,
                (x1 + x2) / 2 - mr + ml + w / 2,
              ]);
              break;
            case "right":
              marksCoordinates.push([
                y1 - mb - h,
                x2 - mr - w,
                y1 - mb,
                x2 - mr
              ]);
              break;
            default:
              throw new Error(translate('Error - Unknown mark alignment', {index: i, alignment: alignment}));
            };
            break;
        case "bottom":
          switch (alignment) {
            case "left":
              marksCoordinates.push([
                y2 + mt,
                x1 + ml,
                y2 + mt + h,
                x1 + ml + w
              ]);
              break;
            case "middle":
              marksCoordinates.push([
                y2 + mt,
                (x1 + x2) / 2 - mr + ml - w / 2,
                y2 + mt + h,
                (x1 + x2) / 2 - mr + ml + w / 2,
              ]);
              break;
            case "right":
              marksCoordinates.push([
                y2 + mt,
                x2 - mr - w,
                y2 + mt + h,
                x2 - mr
              ]);
              break;
            default:
              throw new Error(translate('Error - Unknown mark alignment', {index: i, alignment: alignment}));
          };
          break;
        default:
          throw new Error(translate('Error - Unknown mark position', {index: i, pos: pos}));
      }
    }

    // Розміщуємо мітки на листі

    for (var i = 0, props = myCurrentDocSettings.CutterType.marksProperties; i < props.length; i++) {

        // Фільтруємо мітки, які не мають бути відображені на певних документах
        if (docType && props[i].appearance) {
            if (docType == 'CUT' && props[i].appearance != 1) continue;
            if (docType == 'PRINT' && props[i].appearance != 2) continue;
        };

        var markShape = props[i].shape;

        var shapeProperties = {
            'fillColor': 'None',
            'strokeColor': 'None',
            'geometricBounds': marksCoordinates[i]
        };

        var contourColor, fillColor;

        if (props[i].strokeWeight && props[i].strokeWeight > 0) {
            if (!(props[i].strokeColor instanceof Array)) return;
            contourColor = myDocument.colors.itemByName(props[i].strokeColor.join(','));
            if (!contourColor.isValid) contourColor = myDocument.colors.add({
                    "colorValue": props[i].strokeColor,
                    "model": ColorModel.PROCESS,
                    "space": ColorSpace.CMYK,
                    "name": props[i].strokeColor.join(',')
                });
            shapeProperties['strokeWeight'] = props[i].strokeWeight;
            shapeProperties['strokeColor'] = contourColor;
            shapeProperties['strokeType'] = 'Solid';
            shapeProperties['strokeAlignment'] = StrokeAlignment.CENTER_ALIGNMENT;
        }

        if (props[i].rotation && Math.abs(props[i].rotation) <= 360) {
            shapeProperties['rotationAngle'] = props[i].rotation;
        }

        if (props[i].fillColor) {
            if (!(props[i].fillColor instanceof Array)) return;
            fillColor = myDocument.colors.itemByName(props[i].fillColor.join(','));
            if (!fillColor.isValid) fillColor = myDocument.colors.add({
                    "colorValue": props[i].fillColor,
                    "model": ColorModel.PROCESS,
                    "space": ColorSpace.CMYK,
                    "name": props[i].fillColor.join(',')
                });
            shapeProperties['fillColor'] = fillColor;
        }

        for (var k = 0, current = 1; k < pages.length; k++) {
            if (pages[k].isValid) {
                switch (markShape) {
                    case "oval":
                        pages[k].ovals.add(MarksLayer, LocationOptions.AT_BEGINNING, shapeProperties);
                        break;
                    case "rectangle":
                        pages[k].rectangles.add(MarksLayer, LocationOptions.AT_BEGINNING, shapeProperties);
                        break;
                    case "line":
                        pages[k].graphicLines.add(MarksLayer, LocationOptions.AT_BEGINNING, shapeProperties);
                        break;
                    case "text":
                        placeholders.CurrentPage = current;
                        var template = props[i].template;
                        for (var name in placeholders) {
                            if (placeholders.hasOwnProperty(name)) {
                                var regex = new RegExp('%' + name + '%', 'gm');
                                template = template.replace(regex, placeholders[name]);
                            }
                        };

                        var side = props[i].position.split("-")[0] || null;
                        var rotation;

                        switch (side) {
                            case 'top':
                                rotation = props[i].orientation ? 180 : 0;
                                break;
                            case 'bottom':
                                rotation = props[i].orientation ? 0 : 180;
                                break;
                            case 'left':
                                rotation = props[i].orientation ? -90 : 90;
                                break;
                            case 'right':
                                rotation = props[i].orientation ? 90 : -90;
                                break;
                        }

                        var pageText = pages[k].textFrames.add(MarksLayer, LocationOptions.AT_BEGINNING, {
                            'contents': template,
                            'geometricBounds': marksCoordinates[i],
                            'textFramePreferences': {
                                'verticalJustification': props[i].orientation ? VerticalJustification.TOP_ALIGN : VerticalJustification.BOTTOM_ALIGN
                            }
                        });
                        pageText.paragraphs.everyItem().properties = {
                            'justification': Justification.CENTER_ALIGN,
                            'appliedFont': props[i].fontName,
                            'pointSize': props[i].fontSize,
                            'fillColor': fillColor,
                            'fillTint': 100,
                        };
                        if (rotation != 0) {
                            pageText.absoluteRotationAngle = rotation;
                            pageText.geometricBounds = marksCoordinates[i];
                        }
                        break;
                    default:
                        throw new Error(translate('Error - Unknown mark shape', {index: i, markShape: markShape}));
                };
                current++;
            }
        }
    }

    app.changeObjectPreferences.anchorPoint = appAnchorPoint;
    myDocument.anchoredObjectSettings.anchorPoint = docAnchorPoint;

  } catch (err) {
    throw (err);
  }
}