// ждем загрузку страницы
document.addEventListener("DOMContentLoaded", function () {
    // находим элементы экранов
    const screen1 = document.querySelector('#screen1');
    const screen2 = document.querySelector('#screen2');
    const screen3 = document.querySelector('#screen3');
    // находим поля
    const fieldName = document.querySelector('#name');
    const selectSize = document.querySelector('#size');
    const helpNumber = document.querySelector('#helpNumber');
    // находим кнопки
    const buttonStartGame = document.querySelector("#screen1 button");
    const buttonRestartGame = document.querySelector("#screen3 button");
    // история
    const history = document.querySelector('#history');
    const top = document.querySelector('#top');
    // игровое поле
    const gameField = document.querySelector("#game-field");
    const time = document.querySelector("#time");
    const next = document.querySelector("#next");
    // игровые переменные
    let result = 0;
    let timer;
    let helpTimer;
    let nextNumber = 1;

    // инициализация игры
    initialGame();

    function initialGame() {
        // сбрасываем результат
        result = 0;
        time.textContent = result;
        // сбрасывем следующее число
        nextNumber = 1;
        next.textContent = nextNumber;
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
                // увеличиваем прошедшее количество секунд
                result++;
                // отображаем количество секунд
                time.textContent = result;
            }, 1000);
            // если указано время подсказки, то запускаем таймер
            if (helpNumber.value > 0) {
                startHelpTimer();
            }
        });
    }

    function loadHistory() {
        // отправляем запрос
        fetch("https://example.shaklein.dev/game/get-all-results/").then(function (result) {
            return result.json();
        }).then(function (data) {
            let html = "";
            data.results.reverse().forEach(function (game) {
                // добавляем в список
                html += `
                    <li class="list-group-item d-flex justify-content-between align-items-start">
                        <div class="ms-2 me-auto">
                            <div class="fw-bold">${game.name} (${game.size}x${game.size})</div>
                            ${game.datetime}
                        </div>
                        <span class="badge text-bg-primary rounded-pill">${game.result}</span>
                    </li>
                `;
            });
            // вставляем список
            history.innerHTML = html;
        });
    }

    function loadTop() {
        // отправляем запрос
        fetch("https://example.shaklein.dev/game/get-top-results/?size="+selectSize.value).then(function (result) {
            return result.json();
        }).then(function (data) {
            let html = "";
            data.results.forEach(function (game) {
                // добавляем в список
                html += `
                    <li class="list-group-item d-flex justify-content-between align-items-start">
                        <div class="ms-2 me-auto">
                            <div class="fw-bold">${game.name} (${game.size}x${game.size})</div>
                            ${game.datetime}
                        </div>
                        <span class="badge text-bg-primary rounded-pill">${game.result}</span>
                    </li>
                `;
            });
            // вставляем список
            top.innerHTML = html;
        });
    }

    function drawGameField(field) {
        // очистить игровое поле
        gameField.innerHTML = "";
        // удаляем статичный класс размера поля
        gameField.className = "game-field game-field-" + selectSize.value;
        field.forEach(function (row) {
            row.forEach(function (number) {
                let cell = document.createElement("div");
                cell.textContent = number;
                // добавляем data-number с числом, чтобы потом ее проще было найти
                cell.dataset.number = number;
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
        document.querySelector('#result_name strong').textContent = fieldName.value;
        document.querySelector('#result_size strong').textContent = selectSize.value + " x " + selectSize.value;
        document.querySelector('#result strong').textContent = result;
        // отправляем результаты
        sendResult();
    }

    function sendResult() {
        // отправляем запрос
        fetch("https://example.shaklein.dev/game/send-result/", {
            method: "POST",
            body: JSON.stringify({
                name: fieldName.value,
                size: selectSize.value,
                result: result
            })
        }).then(function (result) {
            return result.json();
        }).then(function (data) {
            // загрузить историю
            loadHistory();
            loadTop();
        });
    }

    function startHelpTimer() {
        // останавливаем старый таймер
        clearTimeout(helpTimer);
        // запускаем таймер
        helpTimer = setTimeout(function () {
            // если подошло время, то показываем подсказку
            // находим клетку у которой data-number равен следующему числу
            let nextCell = document.querySelector('[data-number="'+nextNumber+'"]');
            // добавляем ей класс желтого цвета
            nextCell.classList.add("game-cell-yellow");
        }, helpNumber.value * 1000);
    }

    buttonStartGame.addEventListener("click", function (event) {
        event.preventDefault();
        // проверка на имя
        if (!fieldName.value) {
            fieldName.focus();
            return;
        }
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
                    // показываем следующее число
                    next.textContent = nextNumber;
                    // если указано время подсказки, то запускаем таймер
                    if (helpNumber.value > 0) {
                        startHelpTimer();
                    }
                }
            } else {
                // подсвечиваем красным
                event.target.classList.add('game-cell-red');
            }
        }
    })
});