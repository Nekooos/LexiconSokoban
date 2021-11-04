let minutesLabel = document.getElementsByClassName("minutes");
let secondsLabel = document.getElementsByClassName("seconds");

let totalSeconds = 0;
let interval;

function startTimer() {
    interval = setInterval(setTime, 1000);
}

function setTime() {
    ++totalSeconds;
    secondsLabel[0].textContent = formatTime(totalSeconds % 60)
    minutesLabel[0].textContent = formatTime(parseInt(totalSeconds / 60))
}

function formatTime(value) {
    return value.toString().length < 2 ? "0" + value : value;
}

function stopTimer() {
    clearInterval(interval);
}

function resetTimer() {
    totalSeconds = 0;
    secondsLabel[0].textContent = "00";
    minutesLabel[0].textContent = "00";
    startTimer();
}