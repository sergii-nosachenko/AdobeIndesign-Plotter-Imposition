/**
	Прорахування параметрів розкладки кружечків.
	@param {string|number} thisDiameter Діаметр кола в мм
	@param {Object} selectedCutter Об'єкт, який посилається на обраний плоттер
	@param {string|number} thisSpaceBetween Відстань між контурами порізки в мм
	@param {boolean} returnBestOnly Якщо true, то функція поверне лише найкращий (= де більша кількість елементів) варіант
	@returns {Array} Список об'єктів, які містять прораховані параметри для розкладки
*/
function RozkladkaCircles(thisDiameter, selectedCutter, thisSpaceBetween, returnBestOnly) {

	var Rozkladka_;
	var VariantsRozkladka = [];
	var Best;
	
	thisDiameter = parseFloat(thisDiameter);
	thisSpaceBetween = parseFloat(thisSpaceBetween);

	// №1 Прорахунок варіанту розкладки "Рівними рядами"
	
	Rozkladka_ = SimpleCirclesRozkladka(selectedCutter.widthFrame, selectedCutter.heightFrame, thisDiameter, thisSpaceBetween);
	if (Rozkladka_.total > 0) {
		Rozkladka_.widthSheet = selectedCutter.widthSheet;
		Rozkladka_.heightSheet = selectedCutter.heightSheet;
		Rozkladka_.method = 1;
		Rozkladka_.listItem = CreateListItem(Rozkladka_);		
		VariantsRozkladka.push(Rozkladka_);
	}
	
	// №2 Прорахунок варіанту розкладки "Перекладом"
	// (лист в заданій орієнтації)
	
	Rozkladka_ = PerekladomCirclesRozkladka(selectedCutter.widthFrame, selectedCutter.heightFrame, thisDiameter, thisSpaceBetween);
	if (Rozkladka_.total > 0) {
		Rozkladka_.widthSheet = selectedCutter.widthSheet;
		Rozkladka_.heightSheet = selectedCutter.heightSheet;
		Rozkladka_.method = 2;		
		Rozkladka_.listItem = CreateListItem(Rozkladka_);
		VariantsRozkladka.push(Rozkladka_);
	}
	
	// (лист повернуто на 90 градусів)
	
	Rozkladka_ = PerekladomCirclesRozkladka(selectedCutter.heightFrame, selectedCutter.widthFrame, thisDiameter, thisSpaceBetween);
	if (Rozkladka_.total > 0) {
		Rozkladka_.widthSheet = selectedCutter.heightSheet;
		Rozkladka_.heightSheet = selectedCutter.widthSheet;
		Rozkladka_.method = 2;		
		Rozkladka_.listItem = CreateListItem(Rozkladka_);		
		VariantsRozkladka.push(Rozkladka_);
		
	}
	
	// №3 Прорахунок варіанту розкладки "Перекладом + рівними рядами"
	// (лист в заданій орієнтації)
	
	Rozkladka_ = PerekladomComplexCirclesRozkladka(selectedCutter.widthFrame, selectedCutter.heightFrame, thisDiameter, thisSpaceBetween);
	if (Rozkladka_.total > 0) {
		Rozkladka_.widthSheet = selectedCutter.widthSheet;
		Rozkladka_.heightSheet = selectedCutter.heightSheet;
		Rozkladka_.method = 3;
		Rozkladka_.listItem = CreateListItem(Rozkladka_);		
		VariantsRozkladka.push(Rozkladka_);
	}
	
	// (лист повернуто на 90 градусів)
	
	Rozkladka_ = PerekladomComplexCirclesRozkladka(selectedCutter.heightFrame, selectedCutter.widthFrame, thisDiameter, thisSpaceBetween);
	if (Rozkladka_.total > 0) {
		Rozkladka_.widthSheet = selectedCutter.heightSheet;
		Rozkladka_.heightSheet = selectedCutter.widthSheet;
		Rozkladka_.method = 3;
		Rozkladka_.listItem = CreateListItem(Rozkladka_);		
		VariantsRozkladka.push(Rozkladka_);
	}	
	
	// Метод "Рівними рядами"

	function SimpleCirclesRozkladka(wF, hF, D, Sb) {
		var Params = {};
		Params.Diameter = D;
		Params.widthFrame = wF;
		Params.heightFrame = hF;
		Params.countXSmall = 0;
		Params.countYSmall = 0;
		Params.overflowSize = 0;
		Params.countXBig = Math.floor((wF + Sb) / (D + Sb));
		Params.countYBigRivni = Math.floor((hF + Sb) / (D + Sb));
		Params.DistanceXCenters = D + Sb;
		Params.DistanceYCenters = D + Sb;
		Params.SpaceBetween = Sb;
		Params.TriangleHypothenuse = Math.sqrt(Math.pow(Params.DistanceXCenters, 2) + Math.pow(Params.DistanceYCenters, 2));
		Params.total = Params.countXBig * Params.countYBigRivni;
		return Params;
	}	
	
	// Метод "Перекладом"

	function PerekladomCirclesRozkladka(wF, hF, D, Sb) {
		var Params = {};
		var count;
		var freeSpace = 0;
		var groupBigSmallHeight, groupBigSmallDistanceY;

		// Вираховуємо кількість кружечків, яка поміщається по ширині (великий ряд)
		Params.countXBig = Math.floor((wF + Sb) / (D + Sb));
		// Гіпотенузою для даного випадку буде відстань між центрами кіл великого і малого рядів (два радіуси + роздвижка)
		Params.TriangleHypothenuse = D + Sb;
		// Відстань між центрами кружчеків великого ряду
		if (Params.countXBig > 1) {
			// Якщо великий ряд має від 2 кружечків, то ділимо ширину на кількість кружечків і залишок ділимо на кількість проміжків
			Params.DistanceXCenters = D + (wF - (Params.countXBig * D)) / (Params.countXBig - 1);
			// Малий ряд на 1 шт менше
			Params.countXSmall = Params.countXBig - 1;
		} else if (Params.countXBig == 1) {
			// Інакше розглядаємо ситуацію, коли великий вміщує 1 кружечок, але його партнер знаходиться частково за межами області порізки
			// Для цього беремо за основу ширину поля порізки і залишок вільного місця, щоб можна було вмістити ще один ряд,
			// який ймовірно буде теж з 1 шт (рідкісний випадок, але можливий - напр. діаметр більший за половину розміря поля порізки)
			Params.DistanceXCenters = (wF - D) * 2;
			// Малий ряд приймаємо як 1 шт
			Params.countXSmall = 1;
		} else {
			Params.countXSmall = 0;
		};
		if (Params.countXBig > 0) {
			// За формуловю висоти рівнобедреного трикутника
			Params.DistanceYCenters = Math.sqrt(Math.pow(Params.TriangleHypothenuse, 2) - Math.pow(Params.DistanceXCenters, 2) / 4);
			// Висота групи з великого та малого рядів
			groupBigSmallHeight = D + Params.DistanceYCenters;
			
			// Вертикальна відстань між центрами двох великих рядів за формулою сторони прямокутного трикутника
			groupBigSmallDistanceY = 2 * Math.sqrt(Math.pow(Params.TriangleHypothenuse, 2) - Math.pow(Params.DistanceXCenters / 2, 2));
			
			Params.overflowSize = D - groupBigSmallDistanceY / 2;
		
			Params.countYBigPerekladom = 0;
			Params.countYSmall = 0;
			count = 0;
			
			freeSpace = hF - D;
			
			if (freeSpace > 0) {
				Params.countYBigPerekladom = 1;
				count = 1;
			};
			
			if (Params.DistanceYCenters > D / 2 + Sb) {
				// Якщо центр крежечків малого ряду виступає вище верхньої лінії великого ряду кружечків
				while (freeSpace >= (D - Params.overflowSize)) {
				  count++;
				  freeSpace = freeSpace - (D - Params.overflowSize);
				  if (count % 2 == 0) {
					Params.countYSmall = +Params.countYSmall + 1;
				  } else {
					Params.countYBigPerekladom = +Params.countYBigPerekladom + 1;
				  }
				}
			} else {
				// Якщо центр крежечків малого ряду знаходиться нижче верхньої лінії великого ряду кружечків
				while (freeSpace >= Params.DistanceYCenters) {
				  count++;
				  if (count % 2 == 0) {
					  if (freeSpace >= Params.DistanceYCenters) {
						  Params.countYSmall = +Params.countYSmall + 1;
						  freeSpace = hF - (Params.countYBigPerekladom * (D + Sb) + Params.DistanceYCenters);
					  }
					  if (freeSpace < Params.overflowSize) break;
				  } else {
					if (freeSpace >= Params.overflowSize) {
					  Params.countYBigPerekladom = +Params.countYBigPerekladom + 1;
					  freeSpace = hF - (Params.countYBigPerekladom * (D + Sb) - Sb);
					};
					if (freeSpace < Params.DistanceYCenters) break;
				  }
				}
			}
		
		} else {
			Params.DistanceXCenters = 0;
			Params.DistanceYCenters = 0;
			Params.countYSmall = 0;
			Params.countYBigPerekladom = 0;
			Params.total = 0;
		}
		
		Params.Diameter = D;
		Params.widthFrame = wF;
		Params.heightFrame = hF;		
		
		Params.total = Params.countYBigPerekladom * Params.countYSmall > 0 ? Params.countXBig * Params.countYBigPerekladom + Params.countXSmall * Params.countYSmall : 0;
		
		return Params;
	}

	// Метод "Перекладом + рівними рядами"
	
	function PerekladomComplexCirclesRozkladka(wF, hF, D, Sb) {
		
		var Params = {};
		
		var total = 0, count, count_Rivni, count_Perekladom;
		var freeSpace;

		var Rozkladka_perekladom, Rozdladka_rivni;
		
		Rozkladka_perekladom = PerekladomCirclesRozkladka(wF, hF, D, Sb);
		
		Params.total = 0;
		
		count = Rozkladka_perekladom.countYBigPerekladom + Rozkladka_perekladom.countYSmall || 0;
		
		while (count > 0) {
			count--;
			
			if (Rozkladka_perekladom.DistanceYCenters > D / 2 + Sb) {
				freeSpace = hF - (count * Rozkladka_perekladom.DistanceYCenters + D);
			} else {
				if (count % 2 == 0) {
					freeSpace = hF - ((count / 2) * (D + Sb) + Rozkladka_perekladom.DistanceYCenters - Sb);
				} else {
					freeSpace = hF - ((parseInt(count / 2) + 1) * (D + Sb) - Sb);
				}
			}			
			
			Rozkladka_perekladom = PerekladomCirclesRozkladka(wF, hF - freeSpace, D, Sb);
			Rozdladka_rivni = SimpleCirclesRozkladka(wF, freeSpace - Sb, D, Sb);
			
			total = Rozkladka_perekladom.total + Rozdladka_rivni.total;
			
			if (total > Params.total && Rozkladka_perekladom.total > 0 && Rozdladka_rivni.total > 0) {
				Params.Diameter = D;
				Params.widthFrame = wF;
				Params.heightFrame = hF;
				Params.TriangleHypothenuse = Rozkladka_perekladom.TriangleHypothenuse;
				Params.DistanceXCenters = Rozkladka_perekladom.DistanceXCenters;
				Params.DistanceYCenters = Rozkladka_perekladom.DistanceYCenters;
				Params.countXBig = Rozkladka_perekladom.countXBig;
				Params.countYBigRivni = Rozdladka_rivni.countYBigRivni;
				Params.countYBigPerekladom = Rozkladka_perekladom.countYBigPerekladom;
				Params.countXSmall = Rozkladka_perekladom.countXSmall;
				Params.countYSmall = Rozkladka_perekladom.countYSmall;
				Params.overflowSize = Rozkladka_perekladom.overflowSize;
				Params.total = total;
			}
			
		}
		
		return Params;
		
	}
	
	// Створюємо читабельний елемент списку для діалогово вікна

	function CreateListItem(variant) {
		var ListItem = variant.widthFrame + "х" + variant.heightFrame + " >> ";
		switch (variant.method) {
			case 1:
				ListItem += variant.countYBigRivni + " \u2237 " + variant.countXBig + "\u2299";
				break;
			case 2:
				ListItem += variant.countYBigPerekladom + " \u00D7 " + variant.countXBig + "\u2299 \u2234 " + variant.countYSmall + " \u00D7 " + variant.countXSmall + "\u2299";
				break;
			case 3:
				ListItem += variant.countYBigRivni + " \u2237 " + variant.countXBig + "\u2299 + " + variant.countYBigPerekladom + " \u00D7 " + variant.countXBig + "\u2299 \u2234 ";
				ListItem += variant.countYSmall + " \u00D7 " + variant.countXSmall + "\u2299";
				break;
		}
		return variant.total + " @ " + ListItem.replace(",", ".");
	}	
	
	if (returnBestOnly) {

		var BestVarint = [];

		for (var i = 0; i < VariantsRozkladka.length; i++) {
			if (i == 0) Best = 0;
			if (i != 0 && VariantsRozkladka[Best].total < VariantsRozkladka[i].total) Best = i;
		}
		
		if (Best >= 0) BestVarint.push(VariantsRozkladka[Best]);
		
		return BestVarint;
		
	}
		
	return VariantsRozkladka;

}