import { SCHEDULE__DATA, workCalendarJSON } from './data.js';
import { setHourData, CELLSLEGENG, START_HOUR, END_HOUR, timeStep, legendColumns, SIDE_DAY_NAME, SIDE_MONTH_NAME } from './calendar-options.js';
import { activatTaskSelectorModal } from './task-selector.js';

document.addEventListener("DOMContentLoaded", function () {

    // Отрисовка главной сетки недельного календаря
    const buildWeekCalendarHtml = () => {
        const calendarMaindWrapper = document.querySelector('.calendar__main-wrapper');
        let oldWeekCalendar = document.querySelector('.week-calendar');

        if (oldWeekCalendar) {
        } else {
            // оболочка недельного календаря
            let weekCalendar = document.createElement('div');
            weekCalendar.className = "week-calendar";
            weekCalendar.classList.add('calendar__grid-wrapper');
            weekCalendar.classList.add('disabled');
            calendarMaindWrapper.append(weekCalendar);

            // легенда недельного календаря
            const calendarWeekLegenwWrapper = document.createElement('div');
            calendarWeekLegenwWrapper.className = "grid-wrapper";
            weekCalendar.append(calendarWeekLegenwWrapper);

            //первый пустой блок
            const legendEmptyFirstBlock = document.createElement('div');
            legendEmptyFirstBlock.className = "empty-block";
            calendarWeekLegenwWrapper.append(legendEmptyFirstBlock);

            //первый пустой блок
            const weekLegendGrid = document.createElement('ul');
            weekLegendGrid.className = "week-calendar__weekdays-list";
            weekLegendGrid.classList.add('weekdays');
            weekLegendGrid.classList.add('week-legend');
            calendarWeekLegenwWrapper.append(weekLegendGrid);

            // отрисовка легенды недельного календаря
            const DAY_NAME = [
                "Вс",
                "Пн",
                "Вт",
                "Ср",
                "Чт",
                "Пт",
                "Сб",
            ];
            for (let i = 1; i <= 7; i++) {
                let weekLegendItem = document.createElement('li');
                weekLegendItem.className = "week-legend__item";
                if (i < 7) {
                    weekLegendItem.setAttribute('id', i)
                } else {
                    weekLegendItem.setAttribute('id', 0)
                };
                weekLegendGrid.append(weekLegendItem);
                const weekLegendItemDesc = document.createElement('p');
                weekLegendItemDesc.className = "week-legend__item-legend";
                if (i < 7) {
                    weekLegendItemDesc.textContent = DAY_NAME[i];
                } else {
                    weekLegendItemDesc.textContent = DAY_NAME[0];
                };
                weekLegendItem.append(weekLegendItemDesc);
                const weekLegendItemDate = document.createElement('p');
                weekLegendItemDate.className = "week-legend__item-date";
                weekLegendItem.append(weekLegendItemDate);
            };
        };
    };

    buildWeekCalendarHtml();

    let calendarWrapper = document.querySelector('.calendar');
    // боковое меню
    let sideSection = document.querySelector('.calendar__side-section');
    // дата в разделе задач бокового меню 
    const sideSelectedDate = document.querySelector('.side-section__selected-date-data');
    const sideSelectedMonth = document.querySelector('.side-section__selected-month-data');
    const sideSelectedDay = document.querySelector('.side-section__selected-day-data');
    // ввод даты 
    const inputSelectedDate = document.querySelector('.calendar__menu-input-calendar');
    const buttonSetCurrentDate = calendarWrapper.querySelector('.calendar__control--set-current-date');
    const buttonHideWeekdays = calendarWrapper.querySelector('.calendar-options__control--hide-weekdays');
    const buttonShowSpecialDates = calendarWrapper.querySelector('.calendar-options__control--special-dates');
    const prevMonthButton = calendarWrapper.querySelector('.calendar__control-button--prev');
    const nextMonthButton = calendarWrapper.querySelector('.calendar__control-button--next');
    const selectedYearField = calendarWrapper.querySelector('.calendar-title__current-year');

    // ФИЛЬТРАЦИЯ
    const sideMenuFilters = document.querySelectorAll('.task-filter__input-checkbox');
    const sideMenuFilterSpecial = document.querySelector('.task-filter__input-checkbox-special');

    var NEWdataForCellArr = SCHEDULE__DATA;
    localStorage.setItem('scheduleData', JSON.stringify(NEWdataForCellArr));

    // отрисовка недель
    const weekCalendar = document.querySelector('.week-calendar');
    // сетка недельного календаря
    let weekLegendGrid = weekCalendar.querySelector('.week-legend');
    let weekGrid = '';
    let weekTimeCellDayGridArr = '';
    const weekLegendDataArr = weekCalendar.querySelectorAll('.week-legend__item-date');

    // опции календаря
    let workingHourSelector = document.querySelectorAll('.working-time__item');
    const WEEKDAYS = 7;
    //

    const toTimestamp = (strDate) => {
        const dt = Date.parse(strDate);
        return dt / 1000;
    };
    const clearCurrentDate = toTimestamp(new Date());
    const currentDate = Date(clearCurrentDate);
    const currentDayCount = new Date().getDate();
    const currentDay = new Date().getDay();
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();

    // вычисление номера недели
    let getWeek = (today) => {
        today = new Date(today);
        const firstDayOfYear = new Date(today.getFullYear(), 0, 1);
        const pastDaysOfYear = (today - firstDayOfYear) / 86400000;
        let monthNumber = Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
        return monthNumber;
    };
    // Присвоение текущей даты
    const setSideDate = (date) => {
        let arr = date.split(/[- . :]/);
        let fulldate = new Date(arr[2], arr[1] - 1, arr[0]);
        let sideDay = fulldate.getDay();
        sideSelectedDate.textContent = Number(arr[0]);
        sideSelectedMonth.textContent = SIDE_MONTH_NAME[Number(arr[1] - 1)];
        sideSelectedDay.textContent = SIDE_DAY_NAME[sideDay];
    };
    setSideDate(inputSelectedDate.value);

    inputSelectedDate.addEventListener('input', function () {
        let arr = inputSelectedDate.value.split(/[- . :]/);
        let date = new Date(arr[2], arr[1] - 1, arr[0]);
        newSelectedDate = date;
        drawWeekData(newSelectedDate);
        // drawDates(newSelectedDate);
    })

    let newSelectedDate = currentDate;
    // даные для расписания 
    const buildScheduleHtml = (item) => {
        let weekCellScheduleList = item.querySelector('.week-cell-schedule__list');
        let weekCellScheduleLegendList = item.querySelector('.cell-schedule__legend-list');
        if (weekCellScheduleList) {
            item.removeChild(weekCellScheduleList);
        }
        if (weekCellScheduleLegendList) {
            item.removeChild(weekCellScheduleLegendList);
        }
        // Список легенды расписания
        weekCellScheduleLegendList = document.createElement('div');
        weekCellScheduleLegendList.className = "cell-schedule__legend-list";
        item.append(weekCellScheduleLegendList);
        // Список расписания
        weekCellScheduleList = document.createElement('div');
        weekCellScheduleList.className = "week-cell-schedule__list";
        item.append(weekCellScheduleList);
    };

    const buildScheduleItems = (item, data) => {
        let parent = item.closest('.week-grid__time-cell');
        let cellScheduleList = parent.querySelector('.week-cell-schedule__list');
        let cellScheduleLegendList = parent.querySelector('.cell-schedule__legend-list');
        let cellTimeData = parent.querySelector('.week-grid__cell-date-data');
        let filterCellDate = new Date(cellTimeData.value);
        let cellHours = filterCellDate.getHours();
        let cellMinutes = filterCellDate.getMinutes();
        let newStartTimeDataArr = data.startTime.split(/[- . :]/);

        if (Number(newStartTimeDataArr[0]) < 10) {
            newStartTimeDataArr[0] = String(`0${Number(newStartTimeDataArr[0])}`);
        };

        let newDataStartTime = String(`${newStartTimeDataArr[0]}:${newStartTimeDataArr[1]}`);
        let newEndTimeDataArr = data.endTime.split(/[- . :]/);

        if (cellMinutes == 0) {
            cellMinutes = "00"
        };
        if (cellHours < 10) {
            cellHours = String(`0${cellHours}`);
        };

        let cellTime = String(`${cellHours}:${cellMinutes}`);
        let cellCompare = String(`${cellHours}${cellMinutes}`);
        let dataStartCompare = String(`${newStartTimeDataArr[0]}${newStartTimeDataArr[1]}`);
        let dataEndCompare = String(`${newEndTimeDataArr[0]}${newEndTimeDataArr[1]}`);

        // заполнение доп полей поля легенды 
        let currentDrawnScheduleILegendItemArr = parent.querySelectorAll('.schedule-legend-item');
        let columnNumber;
        columnNumber = 0;
        if ((Number(cellCompare) >= Number(dataStartCompare) && Number(cellCompare) < Number(dataEndCompare))) {
            let allDrawnScheduleILegendItemArr = document.querySelectorAll('.schedule-legend-item');
            columnNumber = currentDrawnScheduleILegendItemArr.length + 1;
            // корректировка при отрисованных колонках легенды
            let basicLegendIdArr = [];
            if (currentDrawnScheduleILegendItemArr.length >= basicLegendIdArr.length) {
                for (let i = 0; i <= currentDrawnScheduleILegendItemArr.length; i++) {
                    basicLegendIdArr.push(i + 1)
                }
            };
            let testIdArr = [];
            for (let i = 0; i < currentDrawnScheduleILegendItemArr.length; i++) {
                testIdArr.push(currentDrawnScheduleILegendItemArr[i].getAttribute('columnid'));
                if ((i + 1) != currentDrawnScheduleILegendItemArr[i].getAttribute('columnid')) {
                    columnNumber = i + 1;
                }
            }
            for (let g = 0; g < testIdArr.length; g++) {
                let checkIndex = basicLegendIdArr.indexOf(Number(testIdArr[g]));
                if (checkIndex !== -1) {
                    basicLegendIdArr.splice(checkIndex, 1);
                }
            }
            columnNumber = basicLegendIdArr[0];
            // присвоение номера колонки на основе главной
            allDrawnScheduleILegendItemArr.forEach(item => {
                if (Number(item.getAttribute('taskid')) == Number(data.taskId)) {
                    columnNumber = Number(item.getAttribute('columnid'));
                }
            });
            // отоговый номер  колонки после всех условий
            if (columnNumber > legendColumns) {
                let legendColumns = columnNumber;
            };
            //
            let cellScheduleLegendItem = document.createElement('div');
            cellScheduleLegendItem.className = "cell-schedule__legend-item";
            cellScheduleLegendItem.classList.add("schedule-legend-item");
            cellScheduleLegendItem.classList.add(String(`schedule-legend-column--${columnNumber}`));

            let columnStyle = String(`
            grid-row-start: 1;
            grid-row-end: 2;
            grid-column-start: ${columnNumber};
            grid-column-end: ${columnNumber + 1};`);

            cellScheduleLegendItem.style.cssText = columnStyle;
            cellScheduleLegendItem.classList.add(String(`schedule-legend-item--${data.type}`));

            // ПРИСВОЕНИЕ taskId легенде
            cellScheduleLegendItem.setAttribute('taskid', (String(`${data.taskId}`)))
            cellScheduleLegendList.append(cellScheduleLegendItem);

            // ПРИСВОЕНИЕ columnId легенде
            cellScheduleLegendItem.setAttribute('columnid', (String(`${columnNumber}`)))

            // добавление фонового цвета на список легенды
            cellScheduleLegendList.classList.add(String(`cell-schedule__legend-list--${data.type}`))

            // cellScheduleList.classList.add(String(`week-cell-schedule__list--${data.type}`));
            var cellScheduleItem = document.createElement('div');
            cellScheduleItem.className = "cell-schedule__item";
            cellScheduleItem.classList.add("schedule-item");
            cellScheduleItem.classList.add(String(`schedule-item--${data.type}`));
            cellScheduleItem.setAttribute('id', (String(`${data.taskId}`)))
            cellScheduleList.append(cellScheduleItem);
        };

        // заполнения первого поля - заголовка
        if (newDataStartTime == cellTime) {
            let cellScheduleItemIcon = document.createElement('p');
            cellScheduleItemIcon.className = "schedule-item__type";
            cellScheduleItemIcon.classList.add(String(`schedule-item__type--${data.type}`));
            cellScheduleItem.append(cellScheduleItemIcon);

            let cellScheduleItemTypeTitle = document.createElement('p');
            cellScheduleItemTypeTitle.className = "schedule-item__type-title";
            cellScheduleItemTypeTitle.classList.add(String(`schedule-item__type-title--${data.type}`));
            cellScheduleItemTypeTitle.textContent = data.typeTitle;
            cellScheduleItem.append(cellScheduleItemTypeTitle);

            let cellScheduleItemTimePeriod = document.createElement('p');
            cellScheduleItemTimePeriod.className = "schedule-item__time-period";
            cellScheduleItemTimePeriod.classList.add(String(`schedule-item__time-period--${data.type}`));
            cellScheduleItemTimePeriod.textContent = String(`${data.startTime}-${data.endTime}`);
            cellScheduleItem.append(cellScheduleItemTimePeriod);

            let cellScheduleItemTitle = document.createElement('p');
            cellScheduleItemTitle.className = "schedule-item__title";
            cellScheduleItemTitle.textContent = data.title;
            cellScheduleItem.append(cellScheduleItemTitle);
        };
    };

    const drawScheduleItems = () => {
        let scheduleListArr = document.querySelectorAll('.week-cell-schedule__list');
        scheduleListArr.forEach(list => {
            list.innerHTML = '';
        });
        let scheduleLegendListArr = document.querySelectorAll('.cell-schedule__legend-list');
        scheduleLegendListArr.forEach(list => {
            list.innerHTML = '';
        });
        let weekTimeCellDayGridArr = weekCalendar.querySelectorAll('.week-grid__time-cell');
        weekTimeCellDayGridArr.forEach(cell => {
            let parent = cell.closest('.week-grid__column');
            let itemDate = parent.getAttribute('value');
            let itemNewDate;
            function createNowDate(itemDate) {
                let itemDay = new Date(itemDate).getDate();
                let itemMonth = new Date(itemDate).getMonth() + 1;
                let itemYear = new Date(itemDate).getFullYear();
                if (itemDay < 10) {
                    itemDay = String(`0${itemDay}`)
                }
                if (itemMonth < 10) {
                    itemMonth = String(`0${itemMonth}`)
                }
                return itemNewDate = String(`${itemDay}.${itemMonth}.${itemYear}`);
            };
            createNowDate(itemDate);
            let dataForCellArr = NEWdataForCellArr.filter(data => data.date == itemNewDate);
            // сортировка по длительности задачи
            dataForCellArr.sort(function (a, b) {
                let startA = a.startTime;
                let endA = a.endTime;
                let startB = b.startTime;
                let endB = b.endTime;
                let secondsA = (endA.split(/[:]/)[0] - startA.split(/[:]/)[0]) * 60 * 60 + (endA.split(/[:]/)[1] - startA.split(/[:]/)[1]) * 60;
                let secondsB = (endB.split(/[:]/)[0] - startB.split(/[:]/)[0]) * 60 * 60 + (endB.split(/[:]/)[1] - startB.split(/[:]/)[1]) * 60;
                if (secondsA < secondsB) {
                    return 1;
                }
                if (secondsA > secondsB) {
                    return -1;
                }
                return 0;
            });
            // сортировка по началу
            dataForCellArr.sort(function (a, b) {
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
                // // a должно быть равным b
                return 0;
            });
            buildScheduleHtml(cell);
            dataForCellArr.forEach(dataForCell => {
                buildScheduleItems(cell, dataForCell);
            });
            let weekCellScheduleListFinal = weekCalendar.querySelectorAll('.week-cell-schedule__list');
            weekCellScheduleListFinal.forEach(list => {
                if (list.firstChild == null) {
                    list.remove();
                }
            });
            let weekCellScheduleItemArr = weekCalendar.querySelectorAll('.schedule-item');
            weekCellScheduleItemArr.forEach(item => {
                let parent = item.closest('.week-cell-schedule__list');
                let checkArr = parent.querySelectorAll('.schedule-item');
                // однуляем все пустые поля
                if (item.firstChild == null) {
                    item.style.width = '0px';
                }
                // есть одна задача - блок пустой
                if (checkArr.length == 1 && item.firstChild == null) {
                    item.style.width = '100%';
                }
                if (checkArr.length > 1 && item.firstChild != null) {
                    parent.classList.add('many-tasks');
                }
                // задач больше 1 - последний  блок пустой - обнуляем последний блок
                if (checkArr.length > 1 && checkArr[checkArr.length - 1].firstChild == null) {
                    checkArr[checkArr.length - 1].style.width = '100%';
                }
                // задач  2 - первый  блок пустой - последний блок на всю ширину
                if (checkArr.length == 2 && checkArr[checkArr.length - 2].firstChild == null) {
                    checkArr[checkArr.length - 1].style.width = '100%';
                }
            });


            let checkArr = cell.querySelectorAll('.schedule-item');

            // обнуление фона списка легенд - присвоение цвета последней легенды
            let legendList = cell.querySelector('.cell-schedule__legend-list');
            if (checkArr.length > 0) {
                legendList.className = "";
                legendList.className = "cell-schedule__legend-list";
                let result = checkArr[checkArr.length - 1].classList[checkArr[checkArr.length - 1].classList.length - 1].split(/[-]/);
                legendList.classList.add(String(`cell-schedule__legend-list--${result[3]}`))
            };
            weekCellScheduleItemArr.forEach(item => {
                let scheduleItemTitleArr = [];
                let parent = item.closest('.week-cell-schedule__list');
                let checkArr = parent.querySelectorAll('.schedule-item');

                checkArr.forEach(item => {
                    item.classList.remove('schedule-item--main')
                });

                for (let j = 0; j < checkArr.length; j++) {
                    if (checkArr[j].firstChild != null) {
                        scheduleItemTitleArr.push(checkArr[j])
                    }
                }
                if (scheduleItemTitleArr.length > 0) {
                    scheduleItemTitleArr[scheduleItemTitleArr.length - 1].classList.add('schedule-item--main');
                }
            });
        });

        // за пределами всей отрисовки
        scheduleLegendListArr = document.querySelectorAll('.cell-schedule__legend-list');

        let gridColumnStyle = String(
            `display: grid;
            grid-template-columns: repeat(${legendColumns}, 1fr);`
        );

        scheduleLegendListArr.forEach(item => {
            item.style.cssText = gridColumnStyle;
        });
    };

    const buildSideScheduleHtml = () => {
        let sideScheduleSection = sideSection.querySelector('.side-section__schedule');
        let sideScheduleList = sideSection.querySelector('.side-schedule__list');
        if (sideScheduleList) {
            sideScheduleSection.removeChild(sideScheduleList);
        };
        // Список расписания выбранного дня
        sideScheduleList = document.createElement('div');
        sideScheduleList.className = "side-schedule__list";
        sideScheduleSection.append(sideScheduleList);
    };

    const buildSideScheduleItems = (data) => {
        let sideScheduleList = sideSection.querySelector('.side-schedule__list');
        // Данные и структура расписания
        let sideScheduleItem = document.createElement('div');
        sideScheduleItem.className = "side-schedule__item";

        sideScheduleItem.classList.add("schedule-item");
        sideScheduleItem.classList.add(String(`schedule-item--${data.type}`));
        sideScheduleList.append(sideScheduleItem);

        let cellScheduleItemIcon = document.createElement('span');
        cellScheduleItemIcon.className = "schedule-item__type";
        cellScheduleItemIcon.classList.add(String(`schedule-item__type--${data.type}`));
        sideScheduleItem.append(cellScheduleItemIcon);

        let cellScheduleItemTypeTitle = document.createElement('p');
        cellScheduleItemTypeTitle.className = "schedule-item__type-title";
        cellScheduleItemTypeTitle.classList.add(String(`schedule-item__type-title--${data.type}`));
        cellScheduleItemTypeTitle.textContent = data.typeTitle;
        sideScheduleItem.append(cellScheduleItemTypeTitle);

        let cellScheduleItemTimePeriod = document.createElement('p');
        cellScheduleItemTimePeriod.className = "schedule-item__time-period";
        cellScheduleItemTimePeriod.textContent = String(`${data.startTime}-${data.endTime}`);
        sideScheduleItem.append(cellScheduleItemTimePeriod);

        let cellScheduleItemTitle = document.createElement('p');
        cellScheduleItemTitle.className = "schedule-item__title";
        cellScheduleItemTitle.textContent = data.title;
        sideScheduleItem.append(cellScheduleItemTitle);
    };


    const drawSideScheduleItems = () => {
        let inputSelectedDate = document.querySelector('.calendar__menu-input-calendar');
        let itemDate = inputSelectedDate.value;
        let dataForCellArr = NEWdataForCellArr.filter(data => data.date == itemDate);
        buildSideScheduleHtml();
        dataForCellArr.forEach(dataForCell => {
            buildSideScheduleItems(dataForCell);
        });
    };

    let monthNumber = '';
    monthNumber = currentMonth;

    const setPrevWeek = (selectedDate) => {
        // чистка выбранных ячеек
        let weekLegenditemArr = weekCalendar.querySelectorAll('.week-legend__item');
        weekLegenditemArr.forEach(cell => {
            cell.classList.remove('current');
        });
        selectedDate = new Date(selectedDate);
        let selectedDay;
        selectedDate.getMonth();
        selectedDay = selectedDate.getDate();
        selectedDate.setDate(selectedDay - 7);
        newSelectedDate = selectedDate;
        return newSelectedDate;
    };

    const setNextWeek = (selectedDate) => {
        // чистка выбранных ячеек
        let weekLegenditemArr = weekCalendar.querySelectorAll('.week-legend__item');
        weekLegenditemArr.forEach(cell => {
            cell.classList.remove('current');
        });
        selectedDate = new Date(selectedDate);
        let selectedDay;
        selectedDate.getMonth();
        selectedDay = selectedDate.getDate();
        selectedDate.setDate(selectedDay + 7);
        newSelectedDate = selectedDate;
        return newSelectedDate;
    };

    // проверка ячейки текущего дня
    const setCheckedSelectedCell = () => {
        let inputSelectedDate = document.querySelector('.calendar__menu-input-calendar');
        let arr = inputSelectedDate.value.split(/[- . :]/);
        let date = new Date(arr[2], arr[1] - 1, arr[0]);

        let selectedTargetMonth = date.getMonth() + 1;
        let selectedTargetYear = date.getFullYear();
        let selectedTargetDay = date.getDate();
        let monthCellDateArr = document.querySelectorAll('.month-grid__cell-date-data');
    };

    const cellAction = (e) => {
        let targetCell = e.target;
        let parent = targetCell.closest('.week-grid__column');
        let targetData = parent.getAttribute('value');
        let targetDate = new Date(targetData).getDate();
        let targetMonth = new Date(targetData).getMonth() + 1;
        let targetYear = new Date(targetData).getFullYear();
        let targetDay;
        let selectedTargetData = targetData;
        let selectedTargetDay = new Date(selectedTargetData).getDate();
        let selectedTargetMonth = new Date(selectedTargetData).getMonth() + 1;
        let selectedTargetYear = new Date(selectedTargetData).getFullYear();
        newSelectedDate = new Date(newSelectedDate)
        function createNowDate() {
            if (targetDate < 10) {
                targetDate = String(`0${targetDate}`)
            }
            if (targetMonth < 10) {
                targetMonth = String(`0${targetMonth}`)
            }
            targetDay = String(`${targetDate}.${targetMonth}.${targetYear}`);
        }
        createNowDate();
        inputSelectedDate.value = targetDay;
        drawSideScheduleItems();
        setCheckedSelectedCell();
        setSideDate(inputSelectedDate.value);
    };

    const drawWeekHTML = () => {
        // отрисовка сетки
        // враппер 
        let oldWeekGridWrapper = document.querySelector('.grid-wrapper--week-grid');
        if (oldWeekGridWrapper) {
            oldWeekGridWrapper.remove();
        };
        let weekGridWrapper = document.createElement('div');
        weekGridWrapper.className = "grid-wrapper";
        weekGridWrapper.classList.add('grid-wrapper--week-grid');
        weekCalendar.append(weekGridWrapper);
        let weekWrapperLegendList = document.createElement('ul');
        weekWrapperLegendList.className = "week-wrapper__time-legend-list";
        weekGridWrapper.append(weekWrapperLegendList);
        // отрисовка таймлайна легенды сетки
        let timeLineLegend = document.createElement('span');
        timeLineLegend.className = "week-wrapper__time-line";
        timeLineLegend.classList.add('week-wrapper__time-line--week-legend');
        weekWrapperLegendList.append(timeLineLegend);
        // сетка день / часы 48 шт
        let weekTimeCellGrid = document.createElement('ul');
        weekTimeCellGrid.className = "week-calendar__weekdays-list";
        weekTimeCellGrid.classList.add('weekdays');
        weekTimeCellGrid.classList.add('week-grid');
        weekGridWrapper.append(weekTimeCellGrid);
        // отрисовка таймлайна сетки
        let timeLine = document.createElement('span');
        timeLine.className = "week-wrapper__time-line";
        timeLine.classList.add('week-wrapper__time-line--week-grid');
        weekTimeCellGrid.append(timeLine);
        // легенда время 
        for (let t = 0; t < CELLSLEGENG; t++) {
            let weekWrapperLegendItem = document.createElement('li');
            weekWrapperLegendItem.className = "week-wrapper__time-legend-item";
            weekWrapperLegendList.append(weekWrapperLegendItem);
            let weekWrapperLegendTimeDesc = document.createElement('p');
            weekWrapperLegendTimeDesc.className = "week-wrapper__time-legend-desc";
            weekWrapperLegendItem.append(weekWrapperLegendTimeDesc);
        };
        // отрисовка столбцов данных дня
        for (let i = 0; i < WEEKDAYS; i++) {
            let weekGridColumn = document.createElement('ul');
            weekGridColumn.className = "week-grid__column";
            let elID = i + 1;
            if (elID == 7) {
                elID = 0;
            };
            weekGridColumn.setAttribute('id', elID)
            weekTimeCellGrid.append(weekGridColumn);
            //отрисовка таймлайна точки дня
            let timeDot = document.createElement('span');
            timeDot.className = "week-grid__time-dot";
            weekGridColumn.append(timeDot);
            for (let t = 0; t < CELLSLEGENG; t++) {
                let weekTimeCellItem = document.createElement('li');
                weekTimeCellItem.className = "week-grid__time-cell";
                weekGridColumn.append(weekTimeCellItem);
                // + поле для данных ячейки
                let weekCellData = document.createElement('input');
                weekCellData.className = "week-grid__cell-date-data";
                weekCellData.setAttribute("disabled", true);
                weekCellData.setAttribute("type", "hidden");
                weekTimeCellItem.append(weekCellData);
            };
        };
    };

    drawWeekHTML();

    let drawWeekData = (selectedDate) => {
        selectedDate = new Date(selectedDate);
        selectedDate.setHours(0);
        selectedDate.setMinutes(0);
        selectedDate.setSeconds(0);
        let selectedMonthData = selectedDate.getMonth();
        let selectedYearData = selectedDate.getFullYear();
        let selectedWeekDate = selectedDate;
        let selectedWeekDay = selectedWeekDate.getDay();

        if (selectedWeekDay == 0) {
            selectedWeekDay = 7;
        };

        let selectedWeekDayDate = selectedWeekDate.getDate();
        let firstDayWeek = selectedWeekDayDate - selectedWeekDay;

        let startDate = selectedDate;
        let newCircleDate = 0;
        newCircleDate = startDate;

        let weekLegenditemArr = weekCalendar.querySelectorAll('.week-legend__item');
        let weekCellDataArr = weekCalendar.querySelectorAll('.week-grid__cell-date-data');
        let cellInfoArr = weekCalendar.querySelectorAll('.week-grid__cell-date-info');
        let weekWrapperLegendTimeDescArr = weekCalendar.querySelectorAll('.week-wrapper__time-legend-desc');
        let weekGridColumnArr = weekCalendar.querySelectorAll('.week-grid__column');

        //Отрисовка легенды даты дня недели + данные списка расписания дня
        for (let i = 0; i < WEEKDAYS; i++) {
            weekLegendDataArr[i].textContent = newCircleDate.getDate();
            weekLegendDataArr[i].textContent = newCircleDate;
            firstDayWeek++;
            newCircleDate.setDate(firstDayWeek);
            firstDayWeek = newCircleDate.getDate();
            weekLegendDataArr[i].textContent = selectedWeekDate.getDate();
            weekGridColumnArr[i].setAttribute("value", selectedWeekDate);
            selectedWeekDate.setHours(0);
            selectedWeekDate.setMinutes(0);
            weekLegenditemArr[i].setAttribute("value", selectedWeekDate);
            weekCellDataArr = weekGridColumnArr[i].querySelectorAll('.week-grid__cell-date-data');
            // заполнение данных даты ячеки от шага времени
            for (let j = 0; j < CELLSLEGENG; j++) {
                weekCellDataArr[j].setAttribute('value', j)
                selectedWeekDate.setHours(START_HOUR);
                let step = j * timeStep;
                selectedWeekDate.setMinutes(step);
                weekCellDataArr[j].setAttribute('value', selectedWeekDate)
            };
        };
        // обнуление сброс даты на начало недели
        let currentCountDayWeek = selectedWeekDate.getDate();
        selectedWeekDate.setDate(currentCountDayWeek - 6);
        // отрисовка инфо ячейки
        // отрисовка легенды часов минут
        for (let j = 0; j < CELLSLEGENG; j++) {
            selectedWeekDate.setHours(START_HOUR);
            let step = j * timeStep;
            selectedWeekDate.setMinutes(step);
            let legendMinutes = selectedWeekDate.getMinutes();
            if (legendMinutes == 0) {
                legendMinutes = "00"
            };
            let legendHours = selectedWeekDate.getHours();

            if (legendHours < 10) {
                legendHours = String(`0${legendHours}`)
            };
            // заполнение легенды / по шагу времени
            weekWrapperLegendTimeDescArr[j].textContent = String(`${legendHours}:${legendMinutes}`);
        };
        // выделение сегодняшнего дня
        let selectedWeek = getWeek(selectedDate);
        let currentWeekNumber = getWeek(currentDate);
        weekLegenditemArr.forEach(element => {
            element.classList.remove('current');
            element.classList.remove('holiday');
            element.classList.remove('pre-holiday');
            let elementDate = element.querySelector('.week-legend__item-date');
            let elementId = element.getAttribute('id');
            let itemDateData = element.getAttribute('value');
            let itemFullDate = new Date(itemDateData);
            let itemYear = itemFullDate.getFullYear();
            let itemMonth = itemFullDate.getMonth();
            let itemDate = itemFullDate.getDate();
            if (currentDay == elementId && selectedWeek == currentWeekNumber && selectedMonthData == currentMonth && selectedYearField.textContent == currentYear) {
                element.classList.add('current');
                weekGridColumnArr = weekCalendar.querySelectorAll('.week-grid__column');
                weekGridColumnArr.forEach(column => {
                    column.classList.remove('current');
                    let columnId = column.getAttribute('id');
                    if (elementId == columnId) {
                        column.classList.add('current');
                    };
                });
            };
            // данные производственного календаря
            if (buttonShowSpecialDates.classList.contains('active')) {
                let workCalendarData = JSON.parse(workCalendarJSON);
                let holidaysDataArr = workCalendarData.holidays;
                let preHolidaysDataArr = workCalendarData.preholidays;
                holidaysDataArr.forEach(data => {
                    let dataArr = data.split(/[- . :]/);
                    let holidayYear = dataArr[0];
                    let holidayMonth = dataArr[1];
                    let holidayDay = dataArr[2];
                    if (itemDate == Number(holidayDay) && itemMonth + 1 == Number(holidayMonth) && holidayYear == itemYear) {
                        element.classList.add('holiday');
                    }
                });
                preHolidaysDataArr.forEach(data => {
                    let dataArr = data.split(/[- . :]/);
                    let preHolidayYear = dataArr[0];
                    let preHolidayMonth = dataArr[1];
                    let preHolidayDay = dataArr[2];
                    if (itemDate == Number(preHolidayDay) && itemMonth + 1 == Number(preHolidayMonth) && preHolidayYear == itemYear) {
                        element.classList.add('pre-holiday');
                    };
                });
            };
        });
        // разобрать
        drawScheduleItems();
    };

    drawWeekData(newSelectedDate);

    weekGrid = weekCalendar.querySelector('.week-grid');
    prevMonthButton.addEventListener('click', function () {
        if (weekCalendar.classList.contains('active')) {
            setPrevWeek(newSelectedDate);
            drawWeekData(newSelectedDate);
            setCheckedSelectedCell();
            // анимация нового месяца
            weekCalendar.classList.add('hidden');
            weekCalendar.classList.add('move-right');
            setTimeout(() => {
                weekCalendar.classList.remove('move-right');
            }, 100);
            setTimeout(() => {
                weekCalendar.classList.remove('hidden');
            }, 200);
        };
    });

    nextMonthButton.addEventListener('click', function () {
        if (weekCalendar.classList.contains('active')) {
            setNextWeek(newSelectedDate);
            drawWeekData(newSelectedDate);
            setCheckedSelectedCell();
            // анимация нового месяца
            weekCalendar.classList.add('hidden');
            weekCalendar.classList.add('move-left');
            setTimeout(() => {
                weekCalendar.classList.remove('move-left');
            }, 100);
            setTimeout(() => {
                weekCalendar.classList.remove('hidden');
            }, 200);
        };
    });

    buttonSetCurrentDate.addEventListener('click', function () {
        if (weekCalendar.classList.contains('active')) {
            newSelectedDate = currentDate;
            drawWeekData(newSelectedDate); // отрисовка недели
            setSideDate(inputSelectedDate.value);
        };
    });

    const hideWeekdays = () => {
        weekLegendGrid.classList.toggle('weekdays-hidden');
        weekGrid.classList.toggle('weekdays-hidden');
    };

    buttonHideWeekdays.addEventListener('click', function () {
        hideWeekdays();
    });

    buttonShowSpecialDates.addEventListener('click', function () {
        drawWeekData(newSelectedDate);
    });
    // клики на ячейки
    let evtInput = new Event('input');
    let evtClick = new Event('click');
    // ФИЛЬТРАЦИЯ
    // счетчик выбранных чекбоксов
    let checkCheckCount = function () {
        let counter = 0;
        let item = document.querySelectorAll('.task-filter__input-checkbox');
        item.forEach(elem => {
            if (elem.checked == true) {
                counter++;
            };
        });
        if (counter == item.length) {
            sideMenuFilterSpecial.checked = true;
        } else if (counter < item.length) {
            sideMenuFilterSpecial.checked = false;
        };
        if (counter == 0) {
            sideMenuFilterSpecial.checked = false;
        };
    };
    sideMenuFilters.forEach(item => {
        item.addEventListener('change', function () {
            NEWdataForCellArr = [];
            sideMenuFilters.forEach(element => {
                if (element.checked) {
                    for (const DATA of SCHEDULE__DATA) {
                        if (DATA.type == element.value) {
                            NEWdataForCellArr.push(DATA);
                        };
                    };
                };
            });
            checkCheckCount();
            drawScheduleItems();
        });
    });

    sideMenuFilterSpecial.addEventListener('change', function () {
        if (sideMenuFilterSpecial.checked == true) {
            NEWdataForCellArr = [];
            sideMenuFilters.forEach(element => {
                element.checked = true;
                if (element.checked) {
                    for (const DATA of SCHEDULE__DATA) {
                        if (DATA.type == element.value) {
                            NEWdataForCellArr.push(DATA);
                        }
                    }
                }
            });
            drawScheduleItems();
        } else {
            NEWdataForCellArr = [];
            sideMenuFilters.forEach(element => {
                element.checked = false;
                if (element.checked) {
                    for (const DATA of SCHEDULE__DATA) {
                        if (DATA.type == element.value) {
                            NEWdataForCellArr.push(DATA);
                        }
                    }
                }
            });
            drawScheduleItems();
        }
    });

    // таймлайн 
    let startTimeLine = () => {
        let timerId = setInterval(() => {
            let timerDate = new Date();

            let timerStartHours = timerDate.getHours();
            let timerStartMinutes = timerDate.getMinutes();
            let timerStartSeconds = timerDate.getSeconds();
            let timeLine = document.querySelectorAll('.week-wrapper__time-line');
            let timeDot = document.querySelectorAll('.week-grid__time-dot');
            let currentSeconds = timerStartHours * 60 * 60 + timerStartMinutes * 60 + timerStartSeconds;
            let timeLineTopOffset = currentSeconds / (60 * 60 * 24) * 100;
            let NewTimeLineTopOffset = (currentSeconds - START_HOUR * 60 * 60) / (END_HOUR * 60 * 60 - START_HOUR * 60 * 60) * 100;
            if (NewTimeLineTopOffset >= 100) {
                NewTimeLineTopOffset = 100;
            }
            if (NewTimeLineTopOffset <= 0) {
                NewTimeLineTopOffset = 0;
            }
            if (timerStartMinutes < 10) {
                timerStartMinutes = (`0${timerStartMinutes}`);
            }
            timeLine.forEach(item => {
                item.style.top = String(`${NewTimeLineTopOffset}%`);
            });
            timeDot.forEach(item => {
                item.style.top = String(`${NewTimeLineTopOffset}%`);
            });
            timeLine[0].textContent = String(`${timerStartHours}:${timerStartMinutes}`);
        }, 1000);
    };
    startTimeLine();
    // всплывающие окна 
    const overlay = document.querySelector('.overlay');
    // вспомогательные функциии попапа
    const isEscapeKey = (evt) => evt.key === 'Escape';
    const lWidth = document.querySelector('html').clientWidth;
    let scrollY;
    // переменные выборы задачи
    let taskSelectorPopup = document.querySelector('.task-selector');
    const taskSelectorButtonClose = document.querySelectorAll('.task-selector__modal-close');
    const taskSelectorPopupInner = document.querySelector('.task-selector__inner');
    const taskSelectorPopupInnerClass = '.task-selector__inner';
    const taskSelectorPopupSwipeClose = document.querySelector('.task-selector__swipe-close');
    let taskSelectortaskList = document.querySelector('.task-selector__task-list');
    // функции оции задачи
    // функции выбора задачи
    // отрисовка попапа со списком задач
    const buildWeekTaskSelectorItems = (data) => {
        // Данные и структура расписания

        let taskSelectorCrossTasks = document.querySelector('.task-selector__cross-task-list');

        let sideScheduleItem = document.createElement('div');
        sideScheduleItem.className = "side-schedule__item";
        sideScheduleItem.setAttribute('id', (String(`${data.taskId}`)));

        sideScheduleItem.classList.add("schedule-item");
        sideScheduleItem.classList.add(String(`schedule-item--${data.type}`));
        taskSelectorCrossTasks.append(sideScheduleItem);

        let cellScheduleItemIcon = document.createElement('span');
        cellScheduleItemIcon.className = "schedule-item__type";
        cellScheduleItemIcon.classList.add(String(`schedule-item__type--${data.type}`));
        sideScheduleItem.append(cellScheduleItemIcon);

        let cellScheduleItemTypeTitle = document.createElement('p');
        cellScheduleItemTypeTitle.className = "schedule-item__type-title";
        cellScheduleItemTypeTitle.classList.add(String(`schedule-item__type-title--${data.type}`));
        cellScheduleItemTypeTitle.textContent = data.typeTitle;
        sideScheduleItem.append(cellScheduleItemTypeTitle);

        let cellScheduleItemTimePeriod = document.createElement('p');
        cellScheduleItemTimePeriod.className = "schedule-item__time-period";
        cellScheduleItemTimePeriod.textContent = String(`${data.startTime}-${data.endTime}`);
        sideScheduleItem.append(cellScheduleItemTimePeriod);

        let cellScheduleItemTitle = document.createElement('p');
        cellScheduleItemTitle.className = "schedule-item__title";
        cellScheduleItemTitle.textContent = data.title;
        sideScheduleItem.append(cellScheduleItemTitle);
    };
    let startListenersForCells = () => {
        weekTimeCellDayGridArr = weekCalendar.querySelectorAll('.week-grid__time-cell');
        weekTimeCellDayGridArr.forEach(cell => {
            cell.addEventListener('click', function (e) {
                cellAction(e);
            });
        });
        weekTimeCellDayGridArr.forEach(cell => {
            cell.addEventListener('click', function (e) {
                let cellTaskItemArr = cell.querySelectorAll('.cell-schedule__item');
                taskSelectortaskList.innerHTML = '';
                let taskSelectorCrossTasks = document.createElement('div');
                taskSelectorCrossTasks.className = "task-selector__cross-task-list";
                taskSelectortaskList.append(taskSelectorCrossTasks);
                let cellScheduleList = cell.querySelector('.week-cell-schedule__list');
                e.preventDefault();
                taskSelectorPopup.style.display = 'block';
                // taskSelectorPopup.style.left = e.pageX + 30 + 'px';
                // taskSelectorPopup.style.top = e.pageY + 'px';
                let tasklistDataArr = [];
                if (cellScheduleList) {
                    // отрисовка списка задач
                    let taskItemArr = cellScheduleList.querySelectorAll('.schedule-item');
                    taskItemArr.forEach(item => {
                        let searchId = item.getAttribute('id');
                        let checkIndex = NEWdataForCellArr.findIndex(el => el.taskId === searchId);
                        tasklistDataArr.push(NEWdataForCellArr[checkIndex]);
                    });
                    tasklistDataArr.forEach(dataForCell => {
                        buildWeekTaskSelectorItems(dataForCell);
                    });
                    taskSelectorPopup.classList.remove('task-selector--2-column');
                    taskSelectorPopup.classList.remove('task-selector--3-column');
                    if (cellTaskItemArr.length >= 6) {
                        taskSelectorPopup.classList.add('task-selector--2-column');
                    }
                    if (cellTaskItemArr.length >= 10) {
                        taskSelectorPopup.classList.add('task-selector--3-column');
                    }
                    activatTaskSelectorModal(taskSelectorPopup, taskSelectorPopupInner, taskSelectorPopupInnerClass, taskSelectorPopupSwipeClose, taskSelectorButtonClose);
                } else {
                }
                taskSelectorPopup = document.querySelector('.task-selector');
                if (lWidth > 768) {
                    taskSelectorPopup.style.left = String(`calc(50% - ${taskSelectorPopup.clientWidth}px / 2 + 0px)`);
                    taskSelectorPopup.style.top = String(`calc(50% - ${taskSelectorPopup.clientHeight}px / 2 + 0px)`);
                }
            })
        });
    };

    startListenersForCells();
    
    workingHourSelector.forEach(item => {
        item.addEventListener('change', function () {
            setHourData(item);
            buildWeekCalendarHtml();
            drawWeekHTML();
            drawWeekData(newSelectedDate);
            startListenersForCells();
        });
    });
});


