// ждем загрузку страницы
document.addEventListener("DOMContentLoaded", function () {
    // находим элементы экранов
    const screen1 = document.querySelector('#screen1');
    const screen2 = document.querySelector('#screen2');
    const screen3 = document.querySelector('#screen3');
    // находим поля
    const fieldName = document.querySelector('#name');
    const selectSize = document.querySelector('#size');
    // находим кнопки
    const buttonStartGame = document.querySelector("#screen1 button");
    const buttonRestartGame = document.querySelector("#screen3 button");
    // игровые переменные
    let result = 0;
    let timer;

    // инициализация игры
    initialGame();

    function initialGame() {
        // сбрасываем имя
        fieldName.value = "";
        // сбрасываем результат
        result = 0;
        // показываем первый экран
        screen1.style.display = "flex";
        // остальные скрываем
        screen2.style.display = "none";
        screen3.style.display = "none";
    }

    function startGame() {
        // показываем второй экран
        screen2.style.display = "flex";
        // остальные скрываем
        screen1.style.display = "none";
        screen3.style.display = "none";
    }

    function stopGame() {
        // показываем третий экран
        screen3.style.display = "flex";
        // остальные скрываем
        screen1.style.display = "none";
        screen2.style.display = "none";
    }
});