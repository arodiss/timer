var start_blink = false;
var end_blink = false;
var main_timer = false;
var start_time = false;
var total_time = false;
var current_danger = false;


function setProgress(progress) {
    $("#progress-left").css('width', (1 - progress) * 100 + "%");
    $("#progress-spent").css('width', progress * 100 + "%");
}

function setProgressText(seconds_left) {
    var text = "Осталось: ";
    if (seconds_left > 0) {
        if (seconds_left >= 60) {
            var mins = (seconds_left - seconds_left % 60) / 60;
            if (mins > 1) {
                text += mins + " минуты ";
            } else {
                text += " 1 минута "
            }
            seconds_left = Math.round(seconds_left - 60 * mins)
        }
        if (seconds_left > 0) {
            if (seconds_left >= 10 && seconds_left <= 20) {
                text += seconds_left + " секунд";
            } else {
                if (seconds_left % 10 === 1) {
                    text += seconds_left + " секунда";
                }
                if (seconds_left % 10 > 1 && seconds_left % 10 < 5) {
                    text += seconds_left + " секунды";
                }
                if (seconds_left % 10 >= 5 || seconds_left % 10 === 0) {
                    text += seconds_left + " секунд";
                }
            }
        }
    } else {
        text = "Время вышло!";
    }
    $("#progress-words").text(text);
}

function clearBlink() {
    if (start_blink) {
        clearInterval(start_blink)
    }
    if (end_blink) {
        clearInterval(end_blink)
    }
}

function blink(period) {
    clearBlink();
    start_blink = setInterval(
        function () {
            $("#opacity-container").css('opacity', .4)
        },
        period
    );
    setTimeout(
        function () {
            end_blink = setInterval(
                function () {$("#opacity-container").css('opacity', 1)},
                period
            )
        },
        200
    )
}

function setBackgroundColor(color) {
    $("#color-container").css('background', color);
}

function setRemainsColor(color) {
    $("#progress-words").css('color', color);
}

function setNoDanger() {
    if (current_danger !== 0) {
        current_danger = 0;
        clearBlink();
        setBackgroundColor('rgb(255,255,255)');
        setRemainsColor('rgb(30,30,30)');
    }
}

function setLowDanger() {
    if (current_danger !== 1) {
        current_danger = 1;
        clearBlink();
        setBackgroundColor('rgb(255,230,230)');
        setRemainsColor('rgb(60,30,30)');
    }
}

function setMediumDanger() {
    if (current_danger !== 2) {
        current_danger = 2;
        blink(600);
        setBackgroundColor('rgb(255,210,210)');
        setRemainsColor('rgb(90,30,30)');
    }
}

function setHighDanger() {
    if (current_danger !== 3) {
        current_danger = 3;
        blink(400);
        setBackgroundColor('rgb(255,190,190)');
        setRemainsColor('rgb(120,30,30)');
    }
}

function setOvertime() {
    if (current_danger !== -1) {
        current_danger = -1;
        clearBlink();
        setBackgroundColor('rgb(255,140,140)');
        setRemainsColor('rgb(160,30,30)');
    }
}

function setTimer(max_time) {
    total_time = max_time;
    start_time = Date.now() / 1000;
    if (main_timer) {
        clearInterval(main_timer);
    }

    main_timer = setInterval(tick, 40);
}

function tick() {
    var current_time = Date.now() / 1000;
    var passed_time = current_time - start_time;
    var remaining_time = total_time - passed_time;

    if (passed_time >= total_time) {
        setOvertime();
        setProgress(1);
        setProgressText(-1);
    } else {
        var progress = passed_time / total_time;
        setProgress(progress);
        setProgressText(Math.round(remaining_time));
        if (progress < .6) {
            setNoDanger();
        }
        if (.8 > progress && progress >= .6) {
            setLowDanger();
        }
        if (.92 > progress && progress  >= .8) {
            setMediumDanger();
        }
        if (progress >= .92) {
            setHighDanger();
        }
    }
}

$(function () {
    $("#thesis").click(function () {
        setTimer(240);
        $("#title").text("ТЕЗИС");
        $("#subtitle").text("Регламент: 4 минуты");
    });

    $("#question").click(function () {
        setTimer(60);
        $("#title").text("ВОПРОС");
        $("#subtitle").text("Регламент: 1 минута");
    });

    $("#answer").click(function () {
        setTimer(180);
        $("#title").text("ОТВЕТ");
        $("#subtitle").text("Регламент: 3 минуты");
    });

    $("#summary").click(function () {
        setTimer(180);
        $("#title").text("ВЫВОД");
        $("#subtitle").text("Регламент: 3 минуты");
    });
});