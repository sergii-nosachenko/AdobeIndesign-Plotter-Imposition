var LANG = LANG || {};
LANG['uk_UA'] = {
    name: 'uk_UA',
    title: 'Українська',
    values: {
        'Plugin Title': 'Розкладка макетів для плотерної порізки | %version% | © Сергій Носаченко',
        'Input Files Label': 'Вхідні файли',
        'Choose Files Label': 'Обери файл або декілька файлів',
        'Select Files Btn': 'Обрати',
        'Files Name List': 'Список файлів та сторінок',
        'Imposing Panel Title': 'Налаштування розкладки',
        'Imposing Method Label': 'Метод розкладки',
        'Imposing Method 1': 'Кожен вид на окремий лист',
        'Imposing Method 2': 'Вмістити всі види на 1+ лист',
        'Imposing Method 3': 'Вручну',
        'Imposing Method 3 Text': 'Список копій кожної сторінки',
        'Imposing Method 3 Help Tip': 'Вкажи кількість копій кожної сторінки через кому (послідовність - згідно списку вище). Можна задати кількість сторінок підряд: перед копіями постав необхідне число та англ.літеру \"x\".\nКількість копій буде автоматично збільшено, щоб дозаповнити порожні місця в документі. Якщо потрібно дозаповнити лише певні сторінки: постав знак \"+\" після кількості копій.',
        'Multipage File Save': 'Залишити багатосторінковість',
        'Export Settings Panel Title': 'Налаштування експорту',
        'Choose Folder Label': 'Тека для збереження результатів',
        'Add Folder Btn': 'Обрати',
        'Folder Name Label': 'Назва теки',
        'File Name Label': 'Формат назви файлів',
        'File Name Text Only Prefix': 'Введи префікс назви (необов\'язково)',
        'File Name Text Only Prefix Info': '+ номер сторінки та назва файлу додаються автоматично',
        'File Name Text Full': 'Введи повну назву файла (обов\'язково)',
        'File Name Text Full Info': 'Можна написати %names% для автоматичної підстановки назв файлів',
        'Imposition Label': 'Спосіб розкладки',
        'Imposition Not Defined': 'Не налаштовано',
        'PDF Preset Label': 'Налаштування для PDF експорту',
        'Add File Name Label': 'Додати назву файла на розкладку',
        'Cancel Btn': 'Відміна',
        'Impose Btn': 'Розкласти',
        'Files Dialog Title': 'Обери один або декілька PDF, AI або TIF файлів',
        'Folder Dialog Title': 'Обери папку для експорту розкладок',
        'File Name Bad Alert': 'Недопустимі символи в назві файлу!',
        'Imposition Template Settings Title': 'Налаштування розкладки',
        'Circles': 'Кола',
        'Circle Settings Panel Title': 'Параметри кола',
        'Circle Filename Disclaimer': 'КОЛА: Назва має містити: _D={1}_, де {1} - діаметр в мм.',
        'Diameter Label': 'Діаметр кола',
        'Diameter Tip': 'Діаметр має бути числом > 0',
        'Rectangles': 'Прямокутники',
        'Rectangles Settings Panel Title': 'Параметри прямокутника',
        'Rectangles Filename Disclaimer': 'ПРЯМОКУТНИКИ: Назва має містити: _{1}x{2} R={3}_, де {1} - ширина в мм, {2} - висота в мм, {3} - радіус скругління в мм. Обов\'язкові лише ширина та висота.',
        'Width Label': 'Ширина',
        'Width Tip': 'Ширина має бути числом > 0',
        'Height Label': 'Висота',
        'Height Tip': 'Висота має бути числом > 0',
        'Round Corners Label': 'Скругління кутів',
        'Round Corners Value Tip': 'Значення радіуса має біти від 0 до %max% мм',
        'Including 0': ', а також 0.',
        'Mixed': 'Мікс',
        'Mixed Settings Panel Title': 'Параметри фігур',
        'Size From Filename': 'Брати параметри з назв файлів, інакше ігнорувати',
        'Units mm': 'мм',
        'Units pieces': 'шт',
        'Plotter Panel Title': 'Налаштування плотера',
        'Cutter Types Label': 'Формат розкладки',
        'Space Between Label': 'Роздвижка між контурами',
        'Space Between Tip': 'Значення роздвижки має бути числом між %min% та %max%',
        'Is Zero Bleeds Chk': 'Без вильотів (не рекомендується)',
        'Bleed Warning Text': 'Вильоти макета мають бути по %bleeds% мм!',
        'Save File With Cut': 'Зберегти файл з контуром порізки',
        'Variants Panel Title': 'Доступні варіанти',
        'Optimal Variant': 'Буде взято найоптимальніший варіант',
        'Save Btn': 'Зберегти',
        'As In Files Names': 'По назві файлів',
        'Circles processing': 'Триває розкладка кружечків ',
        'Rectangles processing': 'Триває розкладка прямокутників ',
        'Creating new document': 'Створюю новий документ...',
        'Processing file': 'Опрацьовую файл %fileCounter% з %totalFilesLength% (сторінка %currentPage% з %pgCount%)',
        'Adding page': 'Додаю сторінку...',
        'Items counter message': 'Елемент %countDone%/%total%',
        'Exporting PDF': 'Експортую PDF...',
        'Background tasks running': 'Тривають фонові операції',
        'Background tasks wait': 'Зачекай завершення експорту файлів',
        'Background tasks message': 'Це може зайняти декілька хвилин...',
        'Error - Failed to export': 'Помилка при експорті в PDF',
        'Skipped files title': 'Наступні файли не було оброблено!',
        'Accept Btn': 'Зрозуміло',
        'Timeleft calculating': ' (обчислюю залишок часу...)',
        'Timeleft message': 'залишилось',
        'hours': 'год',
        'minutes': 'хв',
        'seconds': 'сек',
        'Importing marks': 'Імпортую мітки...',
        'Generating marks': 'Генерую мітки...',
        'Preparing document': 'Підготовка документа',
        'Prepare circular cut': 'Готую розкладку D=%Diameter%мм',
        'Adding elements': 'Додаю елементи...',
        'Exporting cut file': 'Експортую файл порізки...',
        'Prepare rectangular cut': 'Готую розкладку %widthItem%x%heightItem%мм',
        'Language change restart': 'Щоб застосувати зміни перезапусти скрипт вручну',

        'Cytter Prefs Window': 'Редактор налаштувань плотерів',
        'Add new': 'Створити',
        'Save': 'Зберегти',
        'Remove': 'Видалити',
        'Cutter name label': 'Назва плотера',
        'Cutter label tip': 'Коротка обревіатура назви плотера для назви файлів (макс. 6 символів)',
        'Document settings': 'Параметри аркуша',
        'Sheet size': 'Розміри:',
        'Sheet width tip': 'Має бути числом від 50 до 5486 мм',
        'Paper name': 'Назва формату',
        'Paper name tip': 'Наазва формату паперу (опціонально)',
        'Margins label': 'Поля:',
        'Top label': 'Верхнє',
        'Right label': 'Праве',
        'Bottom label': 'Нижнє',
        'Left label': 'Ліве',
        'Margin value tip': 'Має бути числом >= 0 мм',
        'Contours panel': 'Параметри контура порізки',
        'Space between min': 'Роздвижка мін.',
        'Space between max': 'макс.',
        'Space between min tip': 'Має бути числом > 0 мм\n0 включено за замовчанням',
        'Space between max tip': 'Має бути числом >= мін.значення',
        'Contour color': 'Колір контура',
        'Contour color tip': 'Має бути числом від 0 до 100 (%)',
        'Overcut label': 'Перерізання',
        'Overcut value tip': 'Має бути числом >= 0 мм\nПотрібно для порізки в табличному вигляді',
        'File format label': 'Формат файлу',
        'Marks file source panel': 'Джерело міток плотера',
        'External file checkbox': 'Зовнішній файл',
        'Choose btn': 'Обрати',
        'Manual marks list panel': 'Користувацькі мітки',
        'Remove mark btn': 'Прибрати мітку',
        'Edit mark btn': 'Редагувати мітку',
        'Add mark btn': 'Додати мітку',
        'Get marks file title': 'Вибери файл з мітками для плотера',
        'One page alert': 'Дозволено лише односторінкові файли!',
        'Confirm save msg': 'Деякі зміни не збережено. Зберегти зараз?',
        'Confirm save title': 'Зберегти налаштування',
        'Remove plotter msg': 'Ти впевнений щодо видалення наступного плотера: %plotterName%?',
        'Remove plotter title': 'Підтвердження видалення',
        'Shape col': 'Форма',
        'Position col': 'Розташування',
        'Size col': 'Розмір',

        'Error - Unknown size': 'Не вдалося розпізнати розмір',
        'Error - No variants': 'Не знайдено варіантів для розкладки',
        'Error - Too big radius': 'Занадто великий радіус',
        'Error - Creating document': 'Виникла помилка під час створення нового документу для розкладки!',
        'Error - Incorrect params': 'Помилка обробки параметрів для розкладки!',
        'Error - Unknown document failure': 'Сталася невідома помилка під час створення нового документа!',
        'Error - No document': 'Відсутній документ для розміщення міток',
        'Error - No access to marks file': 'Немає доступу до файлу з мітками: ',
        'Error - No working frame data': 'Відсутні дані про розміри робочого поля',
        'Error - Unknown marks error': 'Сталася невідома помилка під час додавання міток!',
        'Error - JSON preferences not found': 'Не знайдено налаштування у ',
        'Error - JSON parse failed': 'Помилка при обробці json-файлу налаштувань плоттерів!',
        'Error - Unknown mark alignment': 'Помилка при створенні міток для порізки - невідомий параметр вирівнювання для мітки №',
        'Error - Unknown mark position': 'Помилка при створенні міток для порізки - невідомий параметр позиції для мітки №',
        'Error - Unknown mark direction': 'Помилка при створенні міток для порізки - невідомий напрямок мітки №',
        'Error - Unknown mark shape': 'Помилка при створенні міток для порізки - невідома форма мітки №',
        'Error - cant create file': 'Неможливо створити/перезаписати файл у ',
    }
};