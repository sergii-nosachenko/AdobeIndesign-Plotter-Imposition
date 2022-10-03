/**
  Прорахування параметрів розкладки прямокутників.
  @param {string|number} thisWidth Ширина в мм
  @param {string|number} thisHeight Висота в мм
  @param {Object} selectedCutter Об'єкт, який посилається на обраний плоттер
  @param {string|number} thisSpaceBetween Відстань між контурами порізки в мм
  @param {boolean} addComplex Якщо true, то функція рахуватиме складні варіанти розкладки (з поворотом макету на 90 градусів)
  @param {boolean} returnBestOnly Якщо true, то функція поверне лише найкращий (= де більша кількість елементів) варіант
  @returns {Array} Список об'єктів, які містять прораховані параметри для розкладки
*/
function RozkladkaRectangles(thisWidth, thisHeight, selectedCutter, thisSpaceBetween, addComplex, returnBestOnly) {

  var Rozkladka_;
  var VariantsRozkladka = [];
  var Best;

  thisWidth = parseFloat(thisWidth);
  thisHeight = parseFloat(thisHeight);
  thisSpaceBetween = parseFloat(thisSpaceBetween);

    // Розкладка виробу різними способами

    // Спосіб №1 - простий (лист портретний: ширина < висота листа)
    Rozkladka_ = SimpleRozkladka(selectedCutter.widthFrame, selectedCutter.heightFrame, thisWidth, thisHeight, thisSpaceBetween);
  if (Rozkladka_.total > 0) {
    Rozkladka_.widthSheet = selectedCutter.widthSheet;
    Rozkladka_.heightSheet = selectedCutter.heightSheet;
    Rozkladka_.method = 1;
    Rozkladka_.listItem = CreateListItem(Rozkladka_);
    VariantsRozkladka.push(Rozkladka_);
  }

    // Спосіб №2 - простий (лист альбомний: ширина > висота листа)
    Rozkladka_ = SimpleRozkladka(selectedCutter.heightFrame, selectedCutter.widthFrame, thisWidth, thisHeight, thisSpaceBetween);
  if (Rozkladka_.total > 0) {
    Rozkladka_.widthSheet = selectedCutter.heightSheet;
    Rozkladka_.heightSheet = selectedCutter.widthSheet;
    Rozkladka_.method = 1;
    Rozkladka_.listItem = CreateListItem(Rozkladka_);
    VariantsRozkladka.push(Rozkladka_);
  }

  if (addComplex) {
    // Спосіб №3 - складний (лист портретний: ширина < висота листа)
    Rozkladka_ = SimpleRozkladka(selectedCutter.widthFrame, selectedCutter.heightFrame, thisWidth, thisHeight, thisSpaceBetween);
    Rozkladka_ = ComplexRozkladka(Rozkladka_, selectedCutter.widthFrame, selectedCutter.heightFrame, thisWidth, thisHeight, thisSpaceBetween)
    if (Rozkladka_.total > 0) {
      Rozkladka_.widthSheet = selectedCutter.widthSheet;
      Rozkladka_.heightSheet = selectedCutter.heightSheet;
      Rozkladka_.method = 2;
      Rozkladka_.listItem = CreateListItem(Rozkladka_);
      VariantsRozkladka.push(Rozkladka_);
    }

    // Спосіб №4 - складний (лист альбомний: ширина > висота листа)
    Rozkladka_ = SimpleRozkladka(selectedCutter.heightFrame, selectedCutter.widthFrame, thisWidth, thisHeight, thisSpaceBetween);
    Rozkladka_ = ComplexRozkladka(Rozkladka_, selectedCutter.heightFrame, selectedCutter.widthFrame, thisWidth, thisHeight, thisSpaceBetween)
    if (Rozkladka_.total > 0) {
      Rozkladka_.widthSheet = selectedCutter.heightSheet;
      Rozkladka_.heightSheet = selectedCutter.widthSheet;
      Rozkladka_.method = 2;
      Rozkladka_.listItem = CreateListItem(Rozkladka_);
      VariantsRozkladka.push(Rozkladka_);
    }
  }

  // Метод розкладки сіткою

  function SimpleRozkladka(wF, hF, wI, hI, Sb) {
    var Params = {};
    Params.widthItem = wI;
    Params.heightItem = hI;
    Params.widthFrame = wF;
    Params.heightFrame = hF;
    Params.countX = Math.floor((wF + Sb) / (wI + Sb));
    Params.countY = Math.floor((hF + Sb) / (hI + Sb));
    Params.countRotatedX = 0;
    Params.countRotatedY = 0;
    Params.SpaceBetween = Sb;
    Params.total = Params.countX * Params.countY;
    return Params;
  }

  // Метод розкладки сіткою з поворотом частини макетів для оптимального заповнення

  function ComplexRozkladka(simpleVar, wF, hF, wI, hI, Sb) {

    var Params = {
      total: 0
    };

    var i = simpleVar.countY;

    while (i > 0) {
      var widthSheetPartial = wF;
      var heightSheetPartial = hF - i * (hI + Sb);
      var countRotatedX = Math.floor((widthSheetPartial + Sb) / (hI + Sb));
      var countRotatedY = Math.floor((heightSheetPartial + Sb) / (wI + Sb));
      if (countRotatedX * countRotatedY > 0) {
        var total = simpleVar.countX * i + countRotatedX * countRotatedY;
        if (total > Params.total) {
          Params.widthItem = wI;
          Params.heightItem = hI;
          Params.widthFrame = wF;
          Params.heightFrame = hF;
          Params.countX = simpleVar.countX;
          Params.countY = i;
          Params.countRotatedX = countRotatedX;
          Params.countRotatedY = countRotatedY;
          Params.SpaceBetween = Sb;
          Params.total = total;
        }
      };
      i--;
    }

    return Params;

  }

  // Створюємо читабельний елемент списку для діалогово вікна

  function CreateListItem(variant) {
    var ListItem = variant.widthFrame + "х" + variant.heightFrame + " >> ";
    switch (variant.method) {
      case 1:
        ListItem += variant.countX + "x" + variant.countY + " [" + variant.widthItem + "x" + variant.heightItem  + "]";
        break;
      case 2:
        if (variant.countX >= variant.countRotatedX) {
          ListItem += variant.countX + "x" + variant.countY + " [" + variant.widthItem + "x" + variant.heightItem  + "] + ";
          ListItem += variant.countRotatedX + "x" + variant.countRotatedY + " [" + variant.heightItem + "x" + variant.widthItem  + "]";
        } else {
          ListItem += variant.countRotatedX + "x" + variant.countRotatedY + " [" + variant.heightItem + "x" + variant.widthItem  + "] + ";
          ListItem += variant.countX + "x" + variant.countY + " [" + variant.widthItem + "x" + variant.heightItem  + "]";
        }
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