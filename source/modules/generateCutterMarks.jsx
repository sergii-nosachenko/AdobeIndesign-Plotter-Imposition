/**
	Генерація міток порізки, якщо така опція прописана в налаштуваннях плоттера.
	@param {Object} myDocument Поточний документ Adobe InDesign
	@param {Object} myCurrentDoc Параметри та налаштування розкладки, які необхідно опрацювати
	@param {string} MarksLayer Назва шару для розміщення міток
	@param {string} docType Тип документа
*/
function generateCutterMarks(myDocument, myCurrentDoc, MarksLayer, docType) {

    if (!myCurrentDoc.CutterType.marksProperties) return;

    var marksCoordinates = [];

    var contoursBounds;

    var firstPage = myDocument.pages.firstItem();

    var anchorPoint = app.changeObjectPreferences.anchorPoint;
    
    app.changeObjectPreferences.anchorPoint = AnchorPoint.CENTER_ANCHOR;
    
    if (myCurrentDoc.CutterType.workspaceShrink && myCurrentDoc.CutterType.workspaceShrink === true) {
        contoursBounds = myCurrentDoc.Params.contoursBounds;
    } else {
        contoursBounds = [
            firstPage.bounds[0] + myCurrentDoc.CutterType.marginTop,
            firstPage.bounds[1] + myCurrentDoc.CutterType.marginLeft,
            firstPage.bounds[2] - myCurrentDoc.CutterType.marginBottom,
            firstPage.bounds[3] - myCurrentDoc.CutterType.marginRight
        ];
    }

    //try {

        // Вираховуємо координати всіх міток

        $.writeln('-------------------------------');
        $.writeln(myCurrentDoc.CutterType.marksProperties.toSource());
        $.writeln('-------------------------------');

        for (var i = 0, props = myCurrentDoc.CutterType.marksProperties; i < props.length; i++) {

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

        for (var i = 0, props = myCurrentDoc.CutterType.marksProperties; i < props.length; i++) {

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

            if (props[i].strokeWeight && props[i].strokeWeight > 0) {
                if (!(props[i].strokeColor instanceof Array)) return;
                var contourColor = myDocument.colors.itemByName(props[i].strokeColor.join(','));
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
                var fillColor = myDocument.colors.itemByName(props[i].fillColor.join(','));
                if (!fillColor.isValid) fillColor = myDocument.colors.add({
                        "colorValue": props[i].fillColor,
                        "model": ColorModel.PROCESS,
                        "space": ColorSpace.CMYK,
                        "name": props[i].fillColor.join(',')
                    });
                shapeProperties['fillColor'] = fillColor;		
            }

            $.writeln('shapeProperties: ', shapeProperties.toSource());

            switch (markShape) {
                case "oval":
                    firstPage.ovals.add(MarksLayer, LocationOptions.AT_END, shapeProperties);
                    break;
                case "rectangle":
                    firstPage.rectangles.add(MarksLayer, LocationOptions.AT_END, shapeProperties);
                    break;
                case "line":
                    firstPage.graphicLines.add(MarksLayer, LocationOptions.AT_END, shapeProperties);
                    break;
                case "text":
                    firstPage.graphicLines.add(MarksLayer, LocationOptions.AT_END, shapeProperties);
                    break;
                default:
                    throw new Error(translate('Error - Unknown mark shape', {index: i, markShape: markShape}));
            }

        }

        app.changeObjectPreferences.anchorPoint = anchorPoint;
/*
    } catch (err) {
        throw (err);
    }*/
}