import { SCHEDULE__DATA, workCalendarJSON } from './data.js';
import { CELLSLEGENG, START_HOUR, END_HOUR, timeStep, DAY_FIELD_COLUMNS, SIDE_DAY_NAME, SIDE_MONTH_NAME } from './calendar-options.js';


let allTasksSection = document.querySelector('.all-tasks-section');
let allTasksWrapper = document.querySelector('.day-tasks');
let dayTasksTitle = document.querySelector('.day-tasks-title');
let dataForAlltasks = SCHEDULE__DATA;

let newDateArr = [];
dataForAlltasks.forEach(data => {
    newDateArr.push(data.date);
});

// массив  дат задач
newDateArr.sort(function (a, b) {
    let startAArr = a.split(/[.]/);
    let startBArr = b.split(/[.]/);
    let aFulldate = new Date(startAArr[2], startAArr[1] - 1, startAArr[0]);
    let bFulldate = new Date(startBArr[2], startBArr[1] - 1, startBArr[0]);
    if (aFulldate > bFulldate) {
        return 1;
    };
    if (aFulldate < bFulldate) {
        return -1;
    };
    return 0;
});

// чистый массив дат задач
let clearDateArr = [];

let clearArr = () => {
    for (let i = 0; i < newDateArr.length; i++) {
        if (newDateArr[i] != newDateArr[i - 1])
            clearDateArr.push(newDateArr[i]);
    };
};

clearArr();

//сортировкма главного массива
let newDataForAlltasks = dataForAlltasks.slice();

//сортировкма главного массива по началу задачи
newDataForAlltasks.sort(function (a, b) {
    let startA = a.startTime.split(/[:]/);
    let startB = b.startTime.split(/[:]/);
    let startQA = startA[0] * 60 * 60 + startA[1] * 60;
    let startQB = startB[0] * 60 * 60 + startB[1] * 60;
    if (startQA > startQB) {
        return 1;
    }
    if (startQA < startQB) {
        return -1;
    }
    return 0;
});

//сортировкма главного массива по дате
newDataForAlltasks.sort(function (a, b) {
    let startAArr = a.date.split(/[.]/);
    let startBArr = b.date.split(/[.]/);
    let aFulldate = new Date(startAArr[2], startAArr[1] - 1, startAArr[0]);
    let bFulldate = new Date(startBArr[2], startBArr[1] - 1, startBArr[0]);
    if (aFulldate > bFulldate) {
        return 1;
    };
    if (aFulldate < bFulldate) {
        return -1;
    };
    return 0;
});

// даные для расписания 
const buildAllTaskWrappers = (itemDate) => {
    let itemDateArr = itemDate.split(/[.]/);
    let itemFulldate = new Date(itemDateArr[2], itemDateArr[1] - 1, itemDateArr[0]);

    let allTasksWrapper = document.createElement('div');
    allTasksWrapper.className = "all-tasks-section__wrapper";
    allTasksWrapper.classList.add("day-tasks");
    allTasksSection.append(allTasksWrapper);

    let taskWrapperTitle = document.createElement('p');
    taskWrapperTitle.className = "day-tasks__title-desc";
    taskWrapperTitle.classList.add('day-tasks-title');
    allTasksWrapper.append(taskWrapperTitle);

    let dayTitleDate = document.createElement('span');
    dayTitleDate.className = "day-tasks-title__item-date";
    dayTitleDate.textContent = (String(`${itemFulldate.getDate()} `));
    taskWrapperTitle.append(dayTitleDate);

    let dayTitleMonth = document.createElement('span');
    dayTitleMonth.className = "day-tasks-title__item-month";
    dayTitleMonth.textContent = (String(` ${SIDE_MONTH_NAME[itemFulldate.getMonth()]} `));
    taskWrapperTitle.append(dayTitleMonth);

    let dayTitleYear = document.createElement('span');
    dayTitleYear.className = "day-tasks-title__item-month";
    dayTitleYear.textContent = (String(` ${itemFulldate.getFullYear()},`));
    taskWrapperTitle.append(dayTitleYear);

    let dayTitleDay = document.createElement('span');
    dayTitleDay.className = "day-tasks-title__item-month";
    dayTitleDay.textContent = (String(` ${SIDE_DAY_NAME[itemFulldate.getDay()]} `));
    taskWrapperTitle.append(dayTitleDay);

    let allTasksWrapperList = document.createElement('ul');
    allTasksWrapperList.className = "day-tasks__list";
    allTasksWrapper.append(allTasksWrapperList);

};

const buildAllTasksItems = (parent, data) => {
    let allTasksWrapperList = parent.querySelector('.day-tasks__list');
    // Данные и структура расписания
    let allTasksScheduleItem = document.createElement('li');
    allTasksScheduleItem.className = "day-tasks__item";
    allTasksScheduleItem.setAttribute('id', (String(`${data.taskId}`)));
    allTasksScheduleItem.classList.add("day-task");
    allTasksScheduleItem.classList.add(String(`day-task--${data.type}`));
    allTasksWrapperList.append(allTasksScheduleItem);

    let allTasksScheduleItemWrapper = document.createElement('div');
    allTasksScheduleItemWrapper.className = "day-task__wrapper";
    allTasksScheduleItem.append(allTasksScheduleItemWrapper);

    let allTasksScheduleItemIcon = document.createElement('span');
    allTasksScheduleItemIcon.className = "day-task__type";
    allTasksScheduleItemIcon.classList.add(String(`day-task__type--${data.type}`));
    allTasksScheduleItemWrapper.append(allTasksScheduleItemIcon);

    let allTasksScheduleItemTypeTitle = document.createElement('p');
    allTasksScheduleItemTypeTitle.className = "day-task__type-title";
    allTasksScheduleItemTypeTitle.classList.add(String(`day-task__type-title--${data.type}`));
    allTasksScheduleItemTypeTitle.textContent = data.typeTitle;
    allTasksScheduleItemWrapper.append(allTasksScheduleItemTypeTitle);

    let allTasksScheduleItemTimePeriod = document.createElement('p');
    allTasksScheduleItemTimePeriod.className = "day-task__time-period";
    allTasksScheduleItemTimePeriod.textContent = String(`${data.startTime}-${data.endTime}`);
    allTasksScheduleItemWrapper.append(allTasksScheduleItemTimePeriod);

    let allTasksScheduleItemTitle = document.createElement('p');
    allTasksScheduleItemTitle.className = "day-task__title";
    allTasksScheduleItemTitle.textContent = data.title;
    allTasksScheduleItemWrapper.append(allTasksScheduleItemTitle);


    let allTasksScheduleItemButtonWrapper = document.createElement('div');
    allTasksScheduleItemButtonWrapper.className = "day-task__button-wrapper";
    allTasksScheduleItem.append(allTasksScheduleItemButtonWrapper);

    let allTasksScheduleItemButtonOptions = document.createElement('button');
    allTasksScheduleItemButtonOptions.className = "day-task__button";
    allTasksScheduleItemButtonOptions.classList.add('day-task__button--options');
    allTasksScheduleItemButtonWrapper.append(allTasksScheduleItemButtonOptions);


    let allTasksScheduleItemButtonRemind = document.createElement('button');
    allTasksScheduleItemButtonRemind.className = "day-task__button";
    allTasksScheduleItemButtonRemind.classList.add('day-task__button--remind');
    allTasksScheduleItemButtonWrapper.append(allTasksScheduleItemButtonRemind);
};

let drawAllTasks = () => {
    allTasksSection.innerHTML = "";
    clearDateArr.forEach(dateItem => {
        buildAllTaskWrappers(dateItem);
    });

    let allTasksWrapperArr = document.querySelectorAll('.all-tasks-section__wrapper');

    for (let i = 0; i <= clearDateArr.length; i++) {
        let parent = allTasksWrapperArr[i];
        let dataArr = newDataForAlltasks.filter(data => data.date == clearDateArr[i]);

        dataArr.forEach(dataForList => {
            buildAllTasksItems(parent, dataForList);
        });
    };
};

drawAllTasks();
