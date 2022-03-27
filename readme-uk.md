# InDesign скрипт для розкладки під плоттери
[![en](https://img.shields.io/badge/language-english-red?style=for-the-badge)](readme.md)
[![uk](https://img.shields.io/badge/%D0%BC%D0%BE%D0%B2%D0%B0-%D1%83%D0%BA%D1%80%D0%B0%D1%97%D0%BD%D1%81%D1%8C%D0%BA%D0%B0-yellow?style=for-the-badge)](readme-uk.md)

Даний скрипт дозволяє легко розкласти файл або групу файлів під плотерну порізку в Adobe InDesign. Також генерується файл з контуром порізки для кожного розміру.

## Вимоги

* Adobe Indesign >=14.0
* Adobe Illustrator >=19.0
* Adobe ExtendScript Toolkit >=4.0.0 *(для компіляції скрипта)* [Завантажити](https://github.com/Adobe-CEP/CEP-Resources/tree/master/ExtendScript-Toolkit)

## Інсталяція

Потрібно лише скопіювати наступний файл `Imposition For Plotter Cutting.jsxbin` з папки `dist` у робочу папку скриптів InDesign (приклад для Windows):

```bash
%APPDATA%\Adobe\InDesign\Version 15.0\en_GB\Scripts\Scripts Panel
```

*Шлях, версія та мовний пакет можуть відрізнятись!*

Щоб швидко знайти правильну папку:

1. Запустіть Adobe InDesign
2. Активуйте панель скриптів: `Window > Utilities > Scripts`
3. В списку виберіть папку `Users`
4. В контекстному меню виберіть пункт `Reveal in Explorer`
5. Відкриється вікно провідника, в якому потрібно перейти в папку `Scripts Panel`

## Інструкція з налаштування та роботи

[Відкрити](tutorial/tutorial-uk.md)

## Компіляція пакету в формат JSBIN

Для того, щоб правильно скомпілювати робочий файл, потрібно виконати наступні дії:

### Варіант №1 - за допомогою меню Adobe ExtendScript Toolkit

1. Запустіть Adobe ExtendScript Toolkit
2. Відкрийте файл `source\Imposition For Plotter Cutting.jsx`
3. У відкритому файлі під вкладкою з назвою файла потрібно вибрати правильний target - `Adobe InDesign 2020` *(версія залежатиме від встановленої)*
4. Виберіть меню `File > Export As Binary...`
5. Збережіть скомпільований файл до робочої папки скриптів InDesign

### Варіант №2 - за допомогою bat-скрипта (Adobe ExtendScript Toolkit має бути встановлений)

1. Запустіть командний скрипт `compile-jsxbin.bat` або `npm run compile` (йде в комплекті з [Node.js](https://nodejs.org/))
2. Виберіть файл `source\Imposition For Plotter Cutting.jsx`
3. Виберіть папку для збереження скомпільованого скрипта