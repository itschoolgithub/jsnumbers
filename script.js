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
    // игровое поле
    const gameField = document.querySelector(".game-field");
    // игровые переменные
    let result = 0;
    let timer;
    let nextNumber = 1;

    // инициализация игры
    initialGame();

    function initialGame() {
        // сбрасываем имя
        fieldName.value = "";
        // сбрасываем результат
        result = 0;
        // сбрасывем следующее число
        nextNumber = 1;
        // показываем первый экран
        screen1.style.display = "flex";
        // остальные скрываем
        screen2.style.display = "none";
        screen3.style.display = "none";
    }

    function startGame() {
        let body = {
            size: selectSize.value
        };
        // отправляем запрос
        fetch("https://example.shaklein.dev/game/get-field/", {
            method: "POST",
            body: JSON.stringify(body)
        }).then(function (result) {
            return result.json();
        }).then(function (data) {
            // отрисовать игровое поле
            drawGameField(data.field);
            // показываем второй экран
            screen2.style.display = "flex";
            // остальные скрываем
            screen1.style.display = "none";
            screen3.style.display = "none";
            // запуск таймера
            timer = setInterval(function () {
                result++;
            }, 1000);
        });
    }

    function drawGameField(field) {
        // очистить игровое поле
        gameField.innerHTML = "";
        // удаляем статичный класс размера поля
        gameField.classList.remove("game-field-3");
        // добавляем класс размера поля
        gameField.classList.add("game-field-" + selectSize.value);
        field.forEach(function (row) {
            row.forEach(function (number) {
                let cell = document.createElement("div");
                cell.textContent = number;
                cell.classList.add("game-cell");
                gameField.append(cell);
            });
        });
    }

    function stopGame() {
        // показываем третий экран
        screen3.style.display = "flex";
        // остальные скрываем
        screen1.style.display = "none";
        screen2.style.display = "none";
        // останавливаем таймер
        clearInterval(timer);
        // вывод результатов
        document.querySelector('#result strong').textContent = result;
    }

    buttonStartGame.addEventListener("click", function (event) {
        event.preventDefault();
        startGame();
    });

    buttonRestartGame.addEventListener("click", function (event) {
        event.preventDefault();
        initialGame();
    });

    gameField.addEventListener("click", function (event) {
        // если нажали на элемент с классом
        if (event.target.classList.contains("game-cell")) {
            // если нажали на правильное число
            if (event.target.textContent == nextNumber) {
                // подсветили зеленым
                event.target.classList.add('game-cell-green');
                // нашли все красные клетки
                let incorrect = document.querySelectorAll(".game-cell-red");
                // для всех крассных
                incorrect.forEach(function (cell) {
                    // удаляем красный цвет
                    cell.classList.remove('game-cell-red');
                });
                // если это было последнее число
                if (nextNumber == selectSize.value ** 2) {
                    // останавливаем игру
                    stopGame();
                } else {
                    // иначе ждем следующее число
                    nextNumber++;
                }
            } else {
                // подсвечиваем красным
                event.target.classList.add('game-cell-red');
            }
        }
    })
});