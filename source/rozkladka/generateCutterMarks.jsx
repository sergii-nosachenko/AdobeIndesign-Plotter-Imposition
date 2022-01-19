// Генерація міток порізки, якщо така опція прописана в налаштуваннях плоттера

function generateCutterMarks(myDocument, myCurrentDoc, MarksLayer, contoursBounds) {
	
	var marksCoordinates = [];
	
	var firstPage = myDocument.pages.firstItem();
	
	try {

        // Обчислюємо координати міток
		
		for (var i = 0, props = myCurrentDoc.CutterType.marksProperties; i < props.length; i++) {
			var side = props[i].position.split("-")[0] || null;
			var alignment = props[i].position.split("-")[1] || null;
            props[i].width = props[i].width || 0;
            props[i].height = props[i].height || 0;
			switch (side) {
				case "left":
					switch (alignment) {
						case "top":
							marksCoordinates.push([
								contoursBounds[0],
								contoursBounds[1] - props[i].margins[1] - props[i].width,
								contoursBounds[0] + props[i].height,
								contoursBounds[1] - props[i].margins[1]
							]);
							break;
						case "middle":
							marksCoordinates.push([
								(contoursBounds[2] + contoursBounds[0]) / 2 - props[i].height / 2,
								contoursBounds[1] - props[i].margins[1] - props[i].width,
								(contoursBounds[2] + contoursBounds[0]) / 2 + props[i].height / 2,
								contoursBounds[1] - props[i].margins[1]
							]);						
							break;
						case "bottom":
							marksCoordinates.push([
								contoursBounds[2] - props[i].height,
								contoursBounds[1] - props[i].margins[1] - props[i].width,
								contoursBounds[2],
								contoursBounds[1] - props[i].margins[1]
							]);					
							break;
						default:
							throw("Помилка при створенні міток для порізки - невідомий параметр вирівнювання для мітки №" + (i + 1) + ": " + alignment);
					};
					break;
				case "right":
					switch (alignment) {
						case "top":
							marksCoordinates.push([
								contoursBounds[0],
								contoursBounds[3] + props[i].margins[3],
								contoursBounds[0] + props[i].height,
								contoursBounds[3] + props[i].margins[3] + props[i].width
							]);
							break;
						case "middle":
							marksCoordinates.push([
								(contoursBounds[2] + contoursBounds[0]) / 2 - props[i].height / 2,
								contoursBounds[3] + props[i].margins[3],
								(contoursBounds[2] + contoursBounds[0]) / 2 + props[i].height / 2,
								contoursBounds[3] + props[i].margins[3] + props[i].width
							]);						
							break;
						case "bottom":
							marksCoordinates.push([
								contoursBounds[2] - props[i].height,
								contoursBounds[3] + props[i].margins[3],
								contoursBounds[2],
								contoursBounds[3] + props[i].margins[3] + props[i].width
							]);					
							break;
						default:
							throw("Помилка при створенні міток для порізки - невідомий параметр вирівнювання для мітки №" + (i + 1) + ": " + alignment);
					};
					break;
				case "top":
					switch (alignment) {
						case "left":
							marksCoordinates.push([
								contoursBounds[0] - props[i].margins[0] - props[i].height,
								contoursBounds[1],
								contoursBounds[0] - props[i].margins[0],
								contoursBounds[1] + props[i].width
							]);
							break;
						case "middle":
							marksCoordinates.push([
								contoursBounds[0] - props[i].margins[0] - props[i].height,
								(contoursBounds[3] + contoursBounds[1]) / 2 - props[i].width / 2,
								contoursBounds[0] - props[i].margins[0],
								(contoursBounds[3] + contoursBounds[1]) / 2 + props[i].width / 2
							]);						
							break;
						case "right":
							marksCoordinates.push([
								contoursBounds[0] - props[i].margins[0] - props[i].height,
								contoursBounds[3] - props[i].width,
								contoursBounds[0] - props[i].margins[0],
								contoursBounds[3]
							]);					
							break;
						default:
							throw("Помилка при створенні міток для порізки - невідомий параметр вирівнювання для мітки №" + (i + 1) + ": " + alignment);
					};
					break;
				case "bottom":
					switch (alignment) {
						case "left":
							marksCoordinates.push([
								contoursBounds[2] + props[i].margins[2],
								contoursBounds[1],
								contoursBounds[2] + props[i].margins[2] + props[i].height,
								contoursBounds[1] + props[i].width
							]);
							break;
						case "middle":
							marksCoordinates.push([
								contoursBounds[2] + props[i].margins[2],
								(contoursBounds[3] + contoursBounds[1]) / 2 - props[i].width / 2,
								contoursBounds[2] + props[i].margins[2] + props[i].height,
								(contoursBounds[3] + contoursBounds[1]) / 2 + props[i].width / 2
							]);						
							break;
						case "right":
							marksCoordinates.push([
								contoursBounds[2] + props[i].margins[2],
								contoursBounds[3] - props[i].width,
								contoursBounds[2] + props[i].margins[2] + props[i].height,
								contoursBounds[3]
							]);					
							break;
						default:
							throw("Помилка при створенні міток для порізки - невідомий параметр вирівнювання для мітки №" + (i + 1) + ": " + alignment);
					};
					break;					
				default:
					throw("Помилка при створенні міток для порізки - невідомий параметр позиції для мітки №" + (i + 1) + ": " + pos);
			}
		}

        // Розміщуємо мітки на листі
		
		for (var i = 0, props = myCurrentDoc.CutterType.marksProperties; i < props.length; i++) {
			
			var markShape = props[i].shape;
			
			switch (markShape) {
				case "oval": 
					firstPage.ovals.add(MarksLayer, LocationOptions.AT_END, {
						'strokeWeight': props[i].strokeWeight,
						'strokeColor': props[i].strokeColor,
						'fillColor': props[i].fillColor,
						'geometricBounds': marksCoordinates[i]
					});	
					break;
				case "rectangle": 
					firstPage.rectangles.add(MarksLayer, LocationOptions.AT_END, {
						'strokeWeight': props[i].strokeWeight,
						'strokeColor': props[i].strokeColor,
						'fillColor': props[i].fillColor,
						'geometricBounds': marksCoordinates[i]
					});	
					break;
				case "line": 

                    switch (props[i].lineDirection) {
                        case "vertical":
                        case "horizontal":
                        case "top-bottom":
                            break;
                        case "bottom-top":
                            var newMarksCoordinates = [
                                marksCoordinates[i][2],
                                marksCoordinates[i][1],
                                marksCoordinates[i][0],
                                marksCoordinates[i][3]
                            ];
                            marksCoordinates[i] = newMarksCoordinates;
                            break;
                        default:
                            throw("Помилка при створенні міток для порізки - невідомий напрямок мітки №" + (i + 1) + ": " + props[i].lineDirection);
                    }

					firstPage.graphicLines.add(MarksLayer, LocationOptions.AT_END, {
						'strokeWeight': props[i].strokeWeight,
						'strokeColor': props[i].strokeColor,
						'fillColor': props[i].fillColor,
						'geometricBounds': marksCoordinates[i]
					});	
					break;                    
				default:
					throw("Помилка при створенні міток для порізки - невідома форма мітки №" + (i + 1) + ": " + markShape);
			}

		}
		
	} catch (err) {
		alert(err);
		exit();
	}
}