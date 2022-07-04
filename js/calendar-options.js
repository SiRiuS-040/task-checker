//установка сетки шага времени
const timeStep = 15; // менять тут шаг
// тест настроект периода
let START_HOUR = "08";
// const START_MINUTES = "00";
let END_HOUR = "16";
//

// не менять
let legendColumns = 4;
const timeStepQ = timeStep / 60;
const DAY_FIELD_COLUMNS = 1;
let CELLSLEGENG = ((Number(END_HOUR) - Number(START_HOUR)) / timeStepQ); // второй вариант - от начального времени до конечного

// вспомогательные описания
const SIDE_DAY_NAME = [
    "воскресенье",
    "понедельник",
    "вторник",
    "среда",
    "четверг",
    "пятница",
    "суббота"
];

const SIDE_MONTH_NAME = [
    "января",
    "февраля",
    "марта",
    "апреля",
    "мая",
    "июня",
    "июля",
    "августа",
    "сентября",
    "октября",
    "ноября",
    "декабря",
];


let startTimeButtonArr = document.querySelectorAll('.working-time__hour-data');

let setHourData = (label) => {

    let parent = label.closest('.working-time');
    let parentlist = parent.querySelector('.working-time__hour-list')
    let labelDataField = label.querySelector('.working-time__data');
    let startTimeField = parent.querySelector('.working-time__hour-data');

    startTimeField.textContent = labelDataField.textContent;
    parentlist.classList.remove('active');

    let startHourData = document.querySelector('.working-time__hour-data--start');
    let endHourData = document.querySelector('.working-time__hour-data--end');

    START_HOUR = startHourData.textContent.split(/[- . :]/)[0];
    END_HOUR = endHourData.textContent.split(/[- . :]/)[0];
    CELLSLEGENG = ((Number(END_HOUR) - Number(START_HOUR)) / timeStepQ);
};


let openCloseMenu = (button) => {

    let workingTimeListArr = document.querySelectorAll('.working-time__hour-list');
    let targetParent = button.closest('.working-time');
    let targetList = targetParent.querySelector('.working-time__hour-list');
    targetList.classList.toggle('active');

    workingTimeListArr.forEach(list => {
        if (list != targetList) {
            list.classList.remove('active');
        };
    });

    let selectorDataArr = targetParent.querySelectorAll('.working-time__item');
    selectorDataArr.forEach(selector => {
        selector.addEventListener('change', function () {
            setHourData(selector);
        });
    });
};

startTimeButtonArr.forEach(button => {
    button.addEventListener('click', function () {
        openCloseMenu(button);
    })
});

export { setHourData, CELLSLEGENG, START_HOUR, END_HOUR, timeStepQ, timeStep, legendColumns, DAY_FIELD_COLUMNS, SIDE_DAY_NAME, SIDE_MONTH_NAME }