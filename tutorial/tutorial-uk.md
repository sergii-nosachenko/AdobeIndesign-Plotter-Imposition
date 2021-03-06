![Project cover](images/cover.jpg?raw=true)

# Інструкція з користування
[![en](https://img.shields.io/badge/language-english-red?style=for-the-badge)](tutorial.md)
[![uk](https://img.shields.io/badge/%D0%BC%D0%BE%D0%B2%D0%B0-%D1%83%D0%BA%D1%80%D0%B0%D1%97%D0%BD%D1%81%D1%8C%D0%BA%D0%B0-yellow?style=for-the-badge)](tutorial-uk.md)

## Зміст

- [Перший запуск](#перший-запуск)
- [Головне вікно](#головне-вікно)
  - [Інтерфейс](#головне-вікно)
  - [Методи розкладки](#методи-розкладки-3)
  - [Список копій кожної сторінки](#список-копій-кожної-сторінки-5)
  - [Формат назви файлу](#формат-назви-файлу-8)
- [Налаштування способу розкладки](#налаштування-способу-розкладки)
  - [Інтерфейс](#налаштування-способу-розкладки)
  - [Налаштування фігур "Кола"](#налаштування-фігур-"кола")
  - [Налаштування фігур "Прямокутники"](#налаштування-фігур-"прямокутники") 
  - [Налаштування фігур "Мікс"](#налаштування-фігур-"мікс")
- [Редактор налаштувань плотерів](#редактор-налаштувань-плотерів)
- [Редактор міток](#редактор-міток)
- [Робота зі скриптом](#робота-зі-скриптом)
  - [Додавання нового плотера](#додавання-нового-плотера)
  - [Приклади розкладок стікерів](#приклади-розкладок-стікерів)
    - [1. Класична розкладка файлів](#1-класична-розкладка-файлів)
    - [2. Розкладка багатосторінкових файлів з розбивкою на окремі файли](#2-розкладка-багатосторінкових-файлів-з-розбивкою-на-окремі-файли)
    - [3. Розміщення всіх макетів рівномірно на 1+ сторінки](#3-розміщення-всіх-макетів-рівномірно-на-1-сторінки)
    - [4. Автоматична розкладка фігур одного типу з параметрами у назвах файлів](#4-автоматична-розкладка-фігур-одного-типу-з-параметрами-у-назвах-файлів)
    - [5. Розкладка з вказанням кількості копій кожної сторінки](#5-розкладка-з-вказанням-кількості-копій-кожної-сторінки)
    - [6. Автоматична розкладка фігур різного типу з параметрами у назвах файлів](#6-автоматична-розкладка-фігур-різного-типу-з-параметрами-у-назвах-файлів)

## Перший запуск

Після успішного встановлення скрипта (цей процес описано [тут](../readme-uk.md)), можна перейти до налаштувань.
Перший запуск супроводжується попереджувальним вікном про відсутність файлу з налаштуваннями `preferences.json`.

![Script Alert](images/settings-not-found-alert-en.png?raw=true)

- `Yes` (`Так`) - скрипт створить порожній файл для збереження налаштувань і відкриється [Головне вікно](#головне-вікно).
- `No` (`Ні`) - скрипт завершиться.

Наявність файлу `preferences.json` є обов'язковою. Якщо у вас є вже збережені налаштування, ви можете скопювати цей файл до теки, що вказана у діалоговому вікні (це тека `Script Panel`, в якій знаходиться скрипт).

[↸ Початок розділу](#перший-запуск) | [↑ Зміст](#зміст)

## Головне вікно

По замовчанню мова головного вікна буде відповідати мові інтерфейсу Adobe InDesign. У випадку, якщо скрипт не підтримує цю мову, буде відображено англійську версію.
На сьогодні скрипт підтримує українську та англійську мови.

### Інтерфейс

![Main Window Initial](images/main-window-initial-uk.png?raw=true)

Вікно складається з трьох основних секцій та нижньої панелі:

#### Секція А: **Вхідні файли**

Дана секція дозволяє вибрати вхідні файл(и) для розкладки.
    
**(1)** Кнопка `Обрати` запускає діалогове вікно вибору файлів. Вибрані файли замінять всі вже наявні в списку (2).
Підтримуються наступні формати файлів: PDF, AI, EPS, TIF. 

**(2)** Список вибраних файлів з розбивкою по сторінкам.

---

#### Секція B: **Налаштування розкладки**

Дана секція керує параметрами обробки файлів під час розкладки.

**(3)** Випадаючий список `Метод розкладки`. [Має три пункти](#методи-розкладки-3).

**(4)** Чекбокс `Залишити багатосторінковість`: Якщо чекбокс активний, то багатосторінкові файли будуть збережені багатосторінковими, як в оригіналі. Інакше кожна сторінка в списку файлів буде збережена як окремий файл.

**(5)** Текстове поле `Список копій кожної сторінки`. Відображається при виборі методу розкладки `Вручну`. [Правила заповнення](#список-копій-кожної-сторінки-5).

---

#### Секція C: **Налаштування експорту**

Дана секція дозволяє налаштувати необхідні параметри плотерів, способк розкладки та збереження результатів.

**(6)** Кнопка `Тека для збереження результатів`. Дає можливість вибрати шлях для збереження результатів розкладки. Обраний шлях відображатиметься в полі (7). Обов'язково для роботи скрипта.

**(7)** Поле `Назва теки`. Відображає шлях до вибраної теки.

**(8)** Текстове поле `Формат назви файлу`. Залежить від обраного в пункті (3) методу розкладки. [Детальніше](#формат-назви-файлу-8).

**(9)** Поле `Спосіб розкладки`. Відображає обраний спосіб розкладки.

**(10)** Кнопка налаштувань плотерів та способу розкладки. Детальніше у розділі [**Налаштування способу розкладки**](#налаштування-способу-розкладки)

**(11)** Випадаючий список `Налаштування для PDF-експорту`. Дозволяє вибрати один з попередньо налаштованих профілів для експорту розкладки у формат PDF. Цей пункт використовує дані, збережені через налаштування експорту Adobe Indesign (або Adobe Acrobat Professional). 

---

**(12)** Випадаючий список вибору мови інтерфейсу. Зміна мови потребує ручного перезапуску скрипта.

**(13)** Кнопка `Відміна`. Завершує роботу скрипта.

**(14)** Кнопка `Розкласти`. Активується, коли встановлено всі необхідні для розкладки налаштування. Запускає роботу скрипта.  

[⇤ Початок статті](#інтерфейс) | [↸ Початок розділу](#головне-вікно) | [↑ Зміст](#зміст)

### Методи розкладки (3)

На [головному вікні](#головне-вікно) у випадаючому списку `Метод розкладки` доступні наступні опції:

- **Кожен вид на окремий лист**: кожна сторінка в розкладці міститиме лише макети одного виду. Якщо чекбокс (4) активний, то багатосторінкові файли будуть збережені багатосторінковими, як в оригіналі.

![Imposition method 1](images/Imposition-methods_1.png?raw=true)

- **Вмістити всі види на 1+ лист**: кожен документ міститиме всі файли з однаковими параметрами фігур (розмір, скругління кутів, роздвижка), що повторюватимуться від 1 разу та більше, дозаповнюючи лист повністю. Кількість листів буде збільшено на стільки, щоб розмістити всі види макетів. Кількість повторень одного макету розраховується автоматично.

![Imposition method 2](images/Imposition-methods_2.png?raw=true)

> *Заповнення сторінки йде зигзагом, починаючи з верхнього лівого кута.*

- **Вручну**: вручну сформований список копій для кожної сторінки або групи сторінок. При виборі цього пункту з'явиться текстове поле `Список копій кожної сторінки` (5).

[⇤ Початок статті](#методи-розкладки-3) | [↸ Початок розділу](#головне-вікно) | [↑ Зміст](#зміст)

### Список копій кожної сторінки (5)

Потрібно вказати кількість копій кожної сторінки через кому (послідовність - згідно списку (2)). Можна задати кількість сторінок підряд у форматі мультиплікатор `x` кількість копій.

Кількість копій буде автоматично збільшено, щоб дозаповнити порожні місця в документі.

*Приклад:*

```
Вибрано 4 файли або сторінки. Необхідна кількість копій:
стор. 1 - 6 копій, 
стор. 2 - 10 копій,
стор. 3 - 10 копій,
стор. 4 - 4 копії

Приклад заповлення поля Вручну:
8,2x10,4

Якщо на листі розміщується 12 макетів, то буде сформовано документ з наступною кількістю копій:
8, 12, 11 та 5 копій = 36 шт
3 сторінки в документі

```

![Imposition method 3A](images/Imposition-methods_3A.png?raw=true)

> *Заповнення сторінки йде зигзагом, починаючи з верхнього лівого кута.*

Якщо потрібно дозаповнити лише конкретні сторінки потрібно поставити знак `+` після кількості копій.

*Приклад:*

```
Вибрано 4 файли або сторінки. Необхідна кількість копій:
стор. 1 - Точно 6 копій, 
стор. 2 - Точно 10 копій,
стор. 3 - 10 копій або більше,
стор. 4 - 4 копії або більше

Приклад заповлення поля Вручну:
6,10,10+,4+

Якщо на листі розміщується 12 макетів, то буде сформовано документ з наступною кількістю копій:
6, 10, 13 та 7 копій = 36 шт
3 сторінки в документі

```

![Imposition method 3B](images/Imposition-methods_3B.png?raw=true)

> *Заповнення сторінки йде зигзагом, починаючи з верхнього лівого кута.*

[⇤ Початок статті](#список-копій-кожної-сторінки-5) | [↸ Початок розділу](#головне-вікно) | [↑ Зміст](#зміст)

### Формат назви файлу (8)

- Якщо обрано `Кожен вид на окремий лист` дозволяє задати **префікс назви файлу**, який буде додано перед оригінальною назвою файлу (опціонально).

    *Приклад:*

    ```
    Назва оригінального файлу: MySticker_logo.pdf
    Формат назви (префікс): #11-2345
    Обрані налаштування розкладки:
      форма - коло діаметром 40 мм,
      роздвижка - 1 мм,    
      аліас плотера - MP,
      аліас формату листа - SRA3

    Збережена назва розкладки:
    #11-2345_MySticker_logo_D=40(1)mm_MP_SRA3.pdf
    ```

- Якщо обрано `Вмістити всі види на 1+ лист` або `Вручну` потребує введення **повної назви файлу**, яяка буде використана для назви файлу (обов'язково). Є можливість використати плейсхолдер %names%, замість якого буде вставлено назву або назви файлів (якщо їх декілька).

    *Приклад:*

    ```
    Назви оригінальних файлів: MySticker_logo.pdf; Another_sticker.pdf
    Формат назви: #11-2345_%names%
    Обрані налаштування розкладки:
      форма - коло діаметром 40 мм,
      роздвижка - 1 мм,    
      аліас плотера - MP,
      аліас формату листа - SRA3

    Збережена назва розкладки:
    #11-2345_MySticker_logo + Another_sticker_D=40(1)mm_MP_SRA3.pdf
    ```

[⇤ Початок статті](#формат-назви-файлу-8) | [↸ Початок розділу](#головне-вікно) | [↑ Зміст](#зміст)

## Налаштування способу розкладки

Це вікно дозволяє налаштувати параметри фігур для поточної розкладки та вибрати ріжучий плотер.

Параметри формату листа, розміри полів, налаштування контуру порізки та міток прив'язані до налаштувань плотера.

### Інтерфейс

![Imposition Preferences Window](images/imposition-preferences-uk.png?raw=true)

Вікно складається з трьох основних секцій та нижньої панелі:

#### Секція А: **Параметри фігур**

Дана секція дозволяє задати параметри фігур, які розкладатимуться на лист.
    
**(1)** Список доступних фігур: [Кола](#налаштування-фігур-"кола"), [Прямокутники](#налаштування-фігур-"прямокутники") та [Мікс](#налаштування-фігур-"мікс").

**(2)** Секція налаштувань параметрів фігури. Наповнення залежить від обраної на панелі (1) фігури. Детальніше у статтях про фігури.

**(3)** Чекбокс `Брати параметри з назв файлів`. Якщо 
пункт активний, то параметри фігур буде взято з назв файлів. Детальніше у статтях про фігури. Якщо пункт вимкнено, то параметри мають бути задані в полях нижче (4).

**(4)** Поля з налаштуваннями фігури. Наповнення залежить від обраної фігури.

---

#### Секція B: **Налаштування розкладки**

Дана секція дозволяє задати параметри розкладки та обрати плотер.
    
**(5)** Випадаючий список `Вибраний плотер`. Дозволяє вибрати налаштування плотеру зі збережених раніше.

**(6)** Кнопка `Налаштування плотерів`. Дозволяє додавати, редагувати та видаляти налаштування плотерів. Відкриває [**Редактор налаштувань плотерів**](#редактор-налаштувань-плотерів).

**(7)** Текстове поле `Роздвижка між контурами`. Задає відстань між контурами порізки. Мінімальне та максимальне значення задаються в налаштуваннях плотера. Окремим значенням є 0 мм, яке доступне лише для прямокутників.

Якщо активний чекбокс `Брати параметри з назв файлів` (3), то даний параметр буде замінено тим, що вказаний у назві файлу.Значення цього поля буде використано за промовчанням у всіх інших випадках.

**(8)** Чекбокс `Без вильотів`. Якщо 
пункт активний, то макети для розкладки будуть вписані у фігури для порізки без вильотів (запас зображення зовні від контуру порізки).

Якщо чекбокс неактивний (за промовчанням), то значення вильоту дорівнюватиме половині мінімальної роздвижки для обраного плотера. Наприклад, якщо у плотера мінімальна роздвижка 1 мм, то вильот зображення завжди складатиме 0.5 мм незалежно від поточної роздвижки.

**(9)** Чекбокс `Зберегти файл з контуром порізки`. Коли цей пункт активний, скрипт згенерує та збереже файл для плотерної порізки у теці з результатами розкладки. Інакше будуть збережені лише файли розкладки.

---

#### Секція C: **Доступні варіанти**

Дана секція дозволяє вибрати одну з можливих схем розкладки.
    
**(10)** Цей список відображається, якщо параметри розкладки коректні. У разі, якщо активний чекбокс `Брати параметри з назв файлів`, цей список не генерується і схема розкладки обирається скриптом автоматично, виходячи з максимальної кількості елементів на листі.

---

**(11)** Кнопка `Відміна`.

**(12)** Кнопка `Зберегти`. Зберігає налаштування розкладки і повертає керування [головному вікну](#головне-вікно).

[↸ Початок розділу](#налаштування-способу-розкладки) | [↑ Зміст](#зміст)

### Налаштування фігур "Кола"

![Circles parameters](images/figure-parameters-circles-uk.png?raw=true)

- Чекбокс `Брати параметри з назв файлів`:
    - **Активний** - параметри кіл буде взято з назв файлів. Назва кожного файла має містити налаштування в квадратних дужках [ ]:

      `[ D={1} ({2}) ]`
      
      `{1}` - діаметр порізки в мм, `{2}` - величина роздвижки між контурами в мм (опціонально)

      *Приклади коректних назв файлів:*

      ```
      MyStickers[D=25].tif
      MyStickers[d=100.5].eps
      MyStickers[D=50(1.5)].ai
      MyStickers [ D=40,5 (1) ].pdf
      ```

      *Приклади некоректних назв файлів:*

      ```
      MyStickers.tif
      MyStickers[25].eps
      MyStickers[D={25}].eps
      MyStickers [D40].ai
      MyStickers[D=40.5 1].pdf
      MyStickers [D=40 ({2})].pdf
      ```

    - **Неактивний** - параметри кіл буде взято з поля `Діаметр кола`. Якщо назва файла містить налаштування в квадратних дужках [ ], то їх буде проігноровано.

- Поле `Діаметр кола` - діаметр кола в мм. Має бути числом > 0. Буде застосовано до всіх макетів.

[⇤ Початок статті](#налаштування-фігур-"кола") | [↸ Початок розділу](#налаштування-способу-розкладки) | [↑ Зміст](#зміст)

### Налаштування фігур "Прямокутники"

![Rectangles parameters](images/figure-parameters-rectangles-uk.png?raw=true)

- Чекбокс `Брати параметри з назв файлів`:
    - **Активний** - параметри прямокутників буде взято з назв файлів. Назва кожного файла має містити налаштування в квадратних дужках [ ]:

      `[ {1}x{2} R={3} ({4}) ]`
      
      `{1}` - ширина порізки в мм, `{2}` - висота порізки в мм, `{3}` - радіус скругління в мм (опціонально), `{4}` - величина роздвижки між контурами в мм (опціонально)

      *Приклади коректних назв файлів:*

      ```
      MyStickers[25x10].tif
      MyStickers[100.5x55].eps
      MyStickers[50x40(1.5)].ai
      MyStickers [50x40 R=2].pdf
      MyStickers [50x40 R=1.5 (1)].pdf
      ```

      *Приклади некоректних назв файлів:*

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

    - **Неактивний** - параметри прямокутників буде взято з полів `Ширина`, `Висота`, `Скругління кутів`. Якщо назва файла містить налаштування в квадратних дужках [ ], то їх буде проігноровано.

- Поле `Ширина` - ширина прямокутника в мм. Має бути числом > 0. Буде застосовано до всіх макетів.

- Поле `Висота` - висота прямокутника в мм. Має бути числом > 0. Буде застосовано до всіх макетів.

- Чекбокс та поле `Скругління кутів` - радіус скругління кутів прямокутника в мм. Якщо активний чекбокс, має бути числом > 0 але не більше половини найменшої зі сторін. Буде застосовано до всіх макетів.

[⇤ Початок статті](#налаштування-фігур-"прямокутники") | [↸ Початок розділу](#налаштування-способу-розкладки) | [↑ Зміст](#зміст)

### Налаштування фігур "Мікс"

![Mixed parameters](images/figure-parameters-mixed-uk.png?raw=true)

- Чекбокс `Брати параметри з назв файлів`:
    - **Активний завжди** - параметри фігур буде взято з назв файлів. Назва кожного файла має містити налаштування в квадратних дужках [ ]. Параметри можуть бути для [кіл](#налаштування-фігур-"кола") або [прямокутників](#налаштування-фігур-"прямокутники").

[⇤ Початок статті](#налаштування-фігур-"мікс") | [↸ Початок розділу](#налаштування-способу-розкладки) | [↑ Зміст](#зміст)

## Редактор налаштувань плотерів

Дане діалогове вікно дозволяє створити, змінити або видалити налаштування плотерів.

### Інтерфейс

![Potter settings](images/plotter-settings-uk.png?raw=true)

Вікно складається з верхньої панелі та чотирьох основних секцій:

**(1)** Список доступних плотерів. Включає особливий пункт `Створити`, який створює новий плотер.

**(2)** Кнопка `Копія` - створює дублікат поточного плотера.

**(3)** Кнопка `Зберегти` - зберігає зміни поточного плотера.

**(4)** Кнопка `Видалити` - видаляє поточний плотер.

**(5)** Кнопка `Закрити` - повертає до попереднього вікна.

**(6)** Текстове поле `Назва плотера`. Обов'язкове поле.

**(7)** Текстове поле `Аліас плотера` - абревіатура (аліас) плотера, буде використана в назвах файлів для ідентифікації оператором при порізці. Обов'язкове поле.

---

#### Секція А: **Параметри аркуша**

Дана секція дозволяє задати параметри листа для розкладки макетів.
    
**(8)** Поле `Ширина` - ширина листа в мм. Число від 50 до 5486 мм.

**(9)** Поле `Висота` - висота листа в мм. Число від 50 до 5486 мм.

**(10)** Поле `Назва формату` - коротка назва формату паперу *(напр. "А4")*. Опціонально.

**(11), (12), (13), (14)** Поля `Поля` - верхнє, праве, нижнє та праве поля листа. Утворюють робочу область на листі, на якій буде відбуватись розкладка макетів. Оптичні мітки мають знаходитись поза межами робочої області на полях.

Значення може бути >= 0, але в сумі не перевищувати ширину та висоту відповідно.

**(15)** Чекбокс `Дозволити зменшення робочої області` - доступний, якщо відсутнє зовнішнє джерело міток (25).
Якщо пункт активний, то мітки буде автоматично переміщено до загальних меж розкладки під час збереження.

![Shrink workarea](images/Shrink-workarea.png?raw=true)

*Увага!* Будь обережні, вибираючи цей пункт, оскільки при невеликому розмірі розкладки можливе накладання міток порізки одна на одну, що може призвести до неможливості їх розпізнавання оптичним сканером ріжучого плотера.

---

#### Секція B: **Параметри контура порізки**

**(16), (17)** Поля `Роздвижка` - мінімальна та максимальна допустимі значення для роздвижки між контурами порізки. Мінімальний параметр автоматично задає значення вильоту для макетів для даного плотера, що дорівнюватиме половині мінімальної роздвижки.

Має бути числом > 0 мм. Значення 0 автоматично доступне для розкладки прямокутників встик.

**(18), (19), (20), (21)** Поля `Колір контура` - значення кольору контура порізки по CMYK. Має бути числом від 0 до 100. 

**(22)** Поле `Товщина лінії` - значення товщини лінії контура порізки в мм. Мінімум 0.1 мм.

**(23)** Поле `Перерізання` (overcut) - значення виходу лінії порізки за зовнішні межі контура при порізці прямокутників встик (роздвижка 0 мм). Для кращого відокремлення стікерів.

**(24)** Випадаючий список `Формат файлу` - формат файлу для збереження конутуру порізки. Доступні варіанти: `PDF`, `AI` та `DXF`. Для збереження у `AI` та `DXF` потрібна наявність встановленого Adobe Illustrator.

---

#### Секція C: **Джерело міток плотера**

**(25)** Чекбокс `Зовнішній файл` - якщо цей пункт активний, то потрібно обов'язково задати шлях до файлу з оптичними мітками, що підходять під даний тип плотера та розмір аркуша. Дозволяється лише односторінковий файл `PDF`.

**(26)** Поле зі шляхом до зовнішнього файлу оптичних міток.

**(27)** Кнопка `Обрати` - дозволяє вибрати файл. Заміняє попередній (26).

---

#### Секція D: **Користувацькі мітки**

**(28)** Список наявних міток.

**(29)** Кнопка `Додати` - дозволяє створити та налаштувати нову мітку. Викликає [Редактор міток](#редактор-міток).

**(30)** Кнопка `Редагувати` - дозволяє налаштувати параметри вибраної мітки. Викликає [Редактор міток](#редактор-міток).

**(31)** Кнопка `Дублювати` - створює копію вибраної мітки з тими ж параметрами.

**(32)** Кнопка `Видалити` - видаляє вибрану мітку.

[↸ Початок розділу](#редактор-налаштувань-плотерів) | [↑ Зміст](#зміст)

## Редактор міток

Дане діалогове вікно дозволяє налаштувати параметри оптичних та інформаційних міток плотера.

### Інтерфейс

![Potter settings](images/marks-editor-uk.png?raw=true)

Вікно складається з верхньої панелі, чотирьох основних секцій та нижньої панелі:

**(1)** Список доступних форм міток. Можливий одна із: `Овал`, `Прямокутник`, `Лінія` або `Текст`.

---

#### Секція A: **Відносне розташування**

Задає положення мітки відносно робочої області

**(2)** Розмір листа, заданий в [налаштуваннях плотера](#редактор-налаштувань-плотерів) (8) (9).

**(3)** Розмір робочої області. Значення вираховується виодячи з розмірів полів листа.

**(4)** Поля листа, задані в [налаштуваннях плотера](#редактор-налаштувань-плотерів) (11) (12) (13) (14).

**(5)** Один з 12 опцій відносного розміщення мітки. Обов'язково для вибору.

![Marks placement and margins](images/Marks-placement-and-margins.png?raw=true)

---

#### Секція B: **Габарити**

Задає розміри мітки або текстового блоку (для форми мітки `Текст`).

**(6), (7)** Поля `Ширина` та `Висота` - задають габарити мітки в мм.

Для міток типу `Лінія` доступна лише `Висота`.

**(8), (9), (10), (11)** Поля `Поля` - верхнє, праве, нижнє та праве поля мітки. Задають зміщення мітки відносно стартової позиції, вибраної в пункті (5).

Значення може бути менше 0.

*Приклад для квадратної мітки зверху зліва з полями [0, 0, 0.5, 0.5]*

![Marks placement example](images/Marks-placement-examples-01.png?raw=true)

*Приклад для овальної мітки зверху по центру з полями [0, 0, -0.5, 0]*

![Marks placement example](images/Marks-placement-examples-02.png?raw=true)

**(12)** Поле `Кут повороту` - задає кут повороту мітки, починаючи з верхньої центральної точки відносно центру мітки. Може біти числом між -360 та 360, де від'ємні кути означають поворот за часовою стрілкою, а додатні - проти часової стрілки.

Для форми мітки `Лінія` кути повороту 0 або 180 означають вертикальну лінію, а 90 або -90 - горизонтальну.

Для форми мітки Текст кут повороту не задається. Натомість можна вказати `Орієнтацію тексту` (26) відносно меж листа.

---

#### Секція C: **Стиль мітки**

**(13), (14), (15), (16)** Поля `Колір заливки` - значення кольору заливки для мітки по CMYK. Має бути числом від 0 до 100. 

Для форми мітки `Лінія` недоступно.

**(17)** Поле `Товщина лінії` - значення товщини лінії мітки. Може бути числом >= 0.

Для форми мітки `Лінія` має бути задане обов'язково.

Для форми мітки `Текст` недоступно.

**(18), (19), (20), (21)** Поля `Колір лінії` - значення кольору лінії для мітки по CMYK. Має бути числом від 0 до 100. Доступно, якщо `Товщина лінії` (17) більша 0.

---

#### Секція D: **Параметри тексту**

Задає додаткові параметри текстового блоку (тільки для форми мітки `Текст`).

**(22)** Випадаючий список `Шрифт` - назва шрифта тексту.

**(23)** Поле `Розмір` - розмір тексту в pt. Мінімальне значення 1.

**(24)** Текстове поле `Шаблон` - текстове наповнення для текстового блоку. Можна використовувати автоматичні заповнювачі зі списку (25).

**(25)** Випадаючий список `Заповнювачі` - доступні для використання заповнювачі тексту. Скрипт автоматично замінить їх на відповідні значення при генерації.

**(26)** Випадаючий список `Орієнтація тексту` - доступні варіанти: `Верх тексту до межі сторінки` та `Верх тексту до рамки макета`. Залежно від розміщення текстового блоку текст буде орієнтовано відповідно до обраного варіанту.

---

**(27)** Випадаючий список `Відображення мітки` - доступні варіанти:

- `Файли порізки та розкладки` - мітка буде додана на файл порізки та файл розкладки одночасно

- `Файли порізки` - мітка буде додана лише на файл порізки

- `Файли розкладки` - мітка буде додана лише на файл розкладки

**(28)** Кнопка `Відміна`.

**(29)** Кнопка `Зберегти` - зберігає мітку в налаштуваннях плотера.

[↸ Початок розділу](#редактор-міток) | [↑ Зміст](#зміст)

## Робота зі скриптом

### Додавання нового плотера

Щоб створити та налаштувати новий плотер, потрібно:
- запустити скрипт;
- на [**Головному вікні**](#головне-вікно) натиснути кнопку налаштувань плотерів та способу розкладки (10);
- у вікні [**Налаштування способу розкладки**](#налаштування-способу-розкладки) натиснути кнопку `Налаштування плотерів` (6);
- відкриється [**Редактор налаштувань плотерів**](#редактор-налаштувань-плотерів).

Якщо у вас відсутні налаштування, то ви почнете відразу зі створення нового профілю.

Якщо у вас вже є створені профілі плотерів, то потрібно вибрати пункт `Створити` у списку доступних плотерів (1).

Для прикладу ми створимо профіль для плотера SummaCut D60R, формат листа SRA3.

![Plotter setup example](images/plotter-setup-example.png?raw=true)

Я не вказав зовнішній файл з мітками, оскільки задав параметри міток вручну. Але ви можете використовувати [завчасно підготовлений файл](examples/marks/SummaCutD60R_SRA3.pdf) з оптичними мітками вашого плотера. Головне, щоб розміри листа та полів співпадали з налаштуваннями обраного плотера.

Файл зі збереженими налаштуваннями [preferences.json](examples/preferences.json), який ви можете використовувати як зразок. Скопіюйте його до теки, в якій знаходиться скрипт. Якщо у вас вже є файл `preferences.json` без налаштувань, то просто замініть його.

Якщо всі необхідні налаштування виконано, потрібно зеберегти плотер. Тепер він доступний для вибору при поточній розкладці і всіх у майбутньому. Ви можете створювати, редагувати, дублювати та видаляти наявні плотери за необхідністю.

Після того, як ми [створили новий плотер](#додавання-нового-плотера), закриваємо вікно редактора.

Тепер профіль "SummaCutD60R (SRA3)" доступний для вибору у вікні [**Налаштування способу розкладки**](#налаштування-способу-розкладки) (5).

[⇤ Початок статті](#додавання-нового-плотера) | [↸ Початок розділу](#робота-зі-скриптом) | [↑ Зміст](#зміст)

### Приклади розкладок стікерів

---

#### **1. Класична розкладка файлів**

  У теці `examples\inputs` підготовлено файл:

  [1. circles_A_1 page.tif](examples/inputs/1.%20circles_A_1%20page.tif)

  Підготуємо розкладку кружечків діаметром 50 мм для плотера "SummaCutD60R (SRA3)":

  - запускаємо скрипт;
  - на [**Головному вікні**](#головне-вікно) натискаємо кнопку `Обрати` (1) і вибираємо файл `1. circles_A_1 page.tif`;
  - тепер вказуємо теку для збереження результатів, натиснувши кнопку `Обрати` (6);
  - додамо префікс до назви файлу, наприклад "#12345" (припустимо, це номер поточного замовлення);
  - налаштуємо `Спосіб розкладки`, натиснувши кнопку (10);
    ![Example 1](images/1-example-settings.png?raw=true)
  - в списку доступних варіантів розкладки потрібно вибрати найбільш оптимальний для даного замовлення варіант по кількості і розташуванню. Як зрозуміти формат відображення варіантів? Розглянемо останній варіант в списку:

    41 @ 370x300 >> 3 ∷ 7⊙ + 2 × 7⊙ ∴ 1 × 6⊙
  
    41 - кількість елементів на листі

    370x300 - розмір робочої області, відносно якої розраховано розкладку

    3 ∷ 7⊙ - 3 рядки по 7 кружечків в табличному вигляді (∷)

    2 × 7⊙ ∴ 1 × 6⊙ - 2 великих рядки по 7 кружечків та 1 малий рядок з 6 кружечків у вигляді сот (∴)
    ![Example 2](images/1-example-variant.png?raw=true)
  - виберемо варіант з 41 елементов на листі, після чого потрібно або натиснути `Зберегти` або двічі натиснути на обраний варіант;
  - вибираємо налаштування для PDF експорту (11);
    ![Example 3](images/1-example-main-window.png?raw=true)
  - запускаємо розкладку, натиснувши `Розкласти` (14).

  Переглянути [результат розкладки](examples/outputs/1/).

[⇤ Початок статті](#приклади-розкладок-стікерів) | [↸ Початок розділу](#робота-зі-скриптом) | [↑ Зміст](#зміст)

---

#### **2. Розкладка багатосторінкових файлів з розбивкою на окремі файли**

  У теці `examples\inputs` підготовлено файл:

  [2. circles_A,B,C,D_4 pages.pdf](examples/inputs/2.%20circles_A%2CB%2CC%2CD_4%20pages.pdf)

  - Підготуємо розкладку кружечків діаметром 70 мм для плотера "SummaCutD60R (SRA3)" аналогічно [попередній розкладці](#1-класична-розкладка-файлів);
  - виберемо варіант розкладки з кількістю 20 шт/лист;
  - але цього разу знімемо чекбокс `Залишити багатосторінковість` для того, щоб скрипт створив окремі файли для кожної сторінки.

  Переглянути [результат розкладки](examples/outputs/2/).

[⇤ Початок статті](#приклади-розкладок-стікерів) | [↸ Початок розділу](#робота-зі-скриптом) | [↑ Зміст](#зміст)

---

#### **3. Розміщення всіх макетів рівномірно на 1+ сторінки**

  У теці `examples\inputs` підготовлено файли:

  [3. circles_A,B_2 pages.pdf](examples/inputs/3.%20circles_A%2CB_2%20pages.pdf)

  [3. circles_C_1 page.pdf](examples/inputs/3.%20circles_C_1%20page.pdf)

  [3. circles_D_1 page.pdf](examples/inputs/3.%20circles_D_1%20page.pdf)

  - Підготуємо розкладку кружечків діаметром 35 мм для плотера "SummaCutD60R (SRA3)";
  - виберемо варіант розкладки з кількістю 86 шт/лист;
  - змінимо метод розкладки на `Вмістити всі види на 1+ лист` для того, щоб рівномірно вмістити всі 4 види макетів на одну розкладку;
  - `Формат назви файлів` має бути вказаний обов'язково. Задамо фінальному файлу нову назву '#12345_Circles_A,B,C,D_combined'.

  Переглянути [результат розкладки](examples/outputs/3/).

[⇤ Початок статті](#приклади-розкладок-стікерів) | [↸ Початок розділу](#робота-зі-скриптом) | [↑ Зміст](#зміст)

---

#### **4. Автоматична розкладка фігур одного типу з параметрами у назвах файлів**

  У теці `examples\inputs` підготовлено файли:

  [4. circles_A,B_2 pages [D=80].pdf](examples/inputs/4.%20circles_A,B_2%20pages%20%5BD=80%5D.pdf)

  [4. circles_C_1 page [D=60 (4)].pdf](examples/inputs/4.%20circles_C_1%20page%20%5BD=60%20(4)%5D.pdf)

  - Підготуємо розкладку кружечків для плотера "SummaCutD60R (SRA3)", але цього разу відмітимо чекбокс `Брати параметри з назв файлів`;
  - варіанти розкладки не відображатимуться, але кнопка `Зберегти` буде активною;
  - решта налаштувань така ж сама, як і в [прикладі 1](#1-класична-розкладка-файлів).

  Переглянути [результат розкладки](examples/outputs/4/).

[⇤ Початок статті](#приклади-розкладок-стікерів) | [↸ Початок розділу](#робота-зі-скриптом) | [↑ Зміст](#зміст)

---

#### **5. Розкладка з вказанням кількості копій кожної сторінки**

  У теці `examples\inputs` підготовлено файл:

  [5. rectangles_A,B,C,D_4 pages.ai](examples/inputs/5.%20rectangles_A%2CB%2CC%2CD_4%20pages.ai)

  - Підготуємо розкладку прямокутників 80x45 мм для плотера "SummaCutD60R (SRA3)";
  - залишимо прямокутники без скругління кутів;
  - цього разу встановимо роздвижку між контурами порізки 0 мм;
  - виберемо перший варіант 24 шт/лист;
  - змінимо метод розкладки на `Вручну` і впишемо наступну кількість копій для кожної сторінки: `2x20,8,10+`;
  - `Формат назви файлів` має бути вказаний обов'язково. Задамо фінальному файлу нову назву '#12345_%names%' з використанням заповнювача %names% (буде замінено на оригінальні назви файлів на розкладці).

  Переглянути [результат розкладки](examples/outputs/5/).

[⇤ Початок статті](#приклади-розкладок-стікерів) | [↸ Початок розділу](#робота-зі-скриптом) | [↑ Зміст](#зміст)
  
---

#### **6. Автоматична розкладка фігур різного типу з параметрами у назвах файлів**

  У теці `examples\inputs` підготовлено файли:

  [6. circles_C_1 page [D=60].pdf](examples/inputs/6.%20circles_C_1%20page%20%5BD%3D60%5D.pdf)

  [6. rectangles_A,B,C_3 pages [100x50 R=5 (2)].pdf](examples/inputs/6.%20rectangles_A%2CB%2CC_3%20pages%20%5B100x50%20R%3D5%5D%20(2).pdf)

  [6. rectangles_D_1 page [90x60 (0)].pdf](examples/inputs/6.%20rectangles_D_1%20page%20%5B90x60%20(0)%5D.pdf)

  - Підготуємо розкладку мікс для плотера "SummaCutD60R (SRA3)";
  - встановимо роздвижку між контурами порізки 5 мм;
  - варіанти розкладки не відображатимуться, але кнопка `Зберегти` буде активною;
  - решта налаштувань така ж сама, як і в [прикладі 1](#1-класична-розкладка-файлів). 

  Переглянути [результат розкладки](examples/outputs/6/).

[⇤ Початок статті](#приклади-розкладок-стікерів) | [↸ Початок розділу](#робота-зі-скриптом) | [↑ Зміст](#зміст)