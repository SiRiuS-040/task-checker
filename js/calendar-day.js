import { SCHEDULE__DATA, workCalendarJSON } from './data.js';
import { setHourData, CELLSLEGENG, START_HOUR, END_HOUR, timeStep, DAY_FIELD_COLUMNS, SIDE_DAY_NAME, SIDE_MONTH_NAME } from './calendar-options.js';
import { activatTaskSelectorModal } from './task-selector.js';

document.addEventListener("DOMContentLoaded", function () {
    // Отрисовка главной сетки недельного календаря
    const buildDayCalendarHtml = () => {
        const calendarMaindWrapper = document.querySelector('.calendar__main-wrapper');
        let oldDayCalendar = document.querySelector('.day-calendar');
        if (oldDayCalendar) {
        } else {
            // оболочка дневного календаря
            let dayCalendar = document.createElement('div');

            dayCalendar.className = "day-calendar";
            dayCalendar.classList.add('calendar__grid-wrapper');
            dayCalendar.classList.add('disabled');
            calendarMaindWrapper.append(dayCalendar);

            // легенда дневного календаря
            const calendarDayLegendWrapper = document.createElement('div');
            calendarDayLegendWrapper.className = "grid-wrapper";
            dayCalendar.append(calendarDayLegendWrapper);

            //первый пустой блок
            const legendEmptyFirstBlock = document.createElement('div');
            legendEmptyFirstBlock.className = "empty-block";
            calendarDayLegendWrapper.append(legendEmptyFirstBlock);

            const dayLegendGrid = document.createElement('ul');
            dayLegendGrid.className = "day-calendar__weekdays-list";
            dayLegendGrid.classList.add('day-legend');
            calendarDayLegendWrapper.append(dayLegendGrid);

            const dayLegendItem = document.createElement('li');
            dayLegendItem.className = "week-legend__item";
            dayLegendGrid.append(dayLegendItem);
        };
    };

    buildDayCalendarHtml();

    let calendarWrapper = document.querySelector('.calendar');
    const dayLegendDate = calendarWrapper.querySelector('.calendar-day-title__item-date');
    const dayLegendMonth = calendarWrapper.querySelector('.calendar-day-title__item-month');
    const dayLegendYear = calendarWrapper.querySelector('.calendar-day-title__item-year');

    // дата в разделе задач бокового меню 
    const sideSelectedDate = document.querySelector('.side-section__selected-date-data');
    const sideSelectedMonth = document.querySelector('.side-section__selected-month-data');
    const sideSelectedDay = document.querySelector('.side-section__selected-day-data');
    // ввод даты 

    const inputSelectedDate = document.querySelector('.calendar__menu-input-calendar');
    const buttonSetCurrentDate = calendarWrapper.querySelector('.calendar__control--set-current-date');
    const prevDayButton = calendarWrapper.querySelector('.calendar__control-button--prev');
    const nextDayButton = calendarWrapper.querySelector('.calendar__control-button--next');
    const selectedMonthField = calendarWrapper.querySelector('.calendar-title__current-month');
    const selectedYearField = calendarWrapper.querySelector('.calendar-title__current-year');
    // ФИЛЬТРАЦИЯ
    const sideMenuFilters = document.querySelectorAll('.task-filter__input-checkbox');
    const sideMenuFilterSpecial = document.querySelector('.task-filter__input-checkbox-special');

    // Данные Производств Календаря
    const buttonShowSpecialDates = calendarWrapper.querySelector('.calendar-options__control--special-dates');

    let NEWdataForCellArr = SCHEDULE__DATA;

    localStorage.setItem('scheduleData', JSON.stringify(NEWdataForCellArr));
    // отрисовка сетки дней
    const dayCalendar = document.querySelector('.day-calendar');

    // опции календаря
    let workingHourSelector = document.querySelectorAll('.working-time__item');

    // сетка дневного календаря
    let dayTimeCellDayGridArr = '';

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

    let DAYCOLUMNS = 0;

    //
    const toTimestamp = (strDate) => {
        const dt = Date.parse(strDate);
        return dt / 1000;
    }

    const clearCurrentDate = toTimestamp(new Date());
    const currentDate = Date(clearCurrentDate);
    const currentMonth = new Date().getMonth();

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
        drawDayData(newSelectedDate);
    });

    let newSelectedDate = currentDate;

    // даные для расписания 
    const buildScheduleHtml = (item) => {
        let dayCellScheduleList = item.querySelector('.day-cell-schedule__list');
        if (dayCellScheduleList) {
            item.removeChild(dayCellScheduleList);
        }
        // Список расписания
        dayCellScheduleList = document.createElement('ul');
        dayCellScheduleList.className = "day-cell-schedule__list";
        item.append(dayCellScheduleList);
    };

    const buildScheduleItems = (item, data) => {
        let parent = item.closest('.day-grid__time-cell');
        let dayCellScheduleList = parent.querySelector('.day-cell-schedule__list');
        let cellTimeData = parent.querySelector('.day-grid__cell-date-data');
        let filterCellDate = new Date(cellTimeData.value);
        let cellHours = filterCellDate.getHours();
        let cellMinutes = filterCellDate.getMinutes();
        let newStartTimeDataArr = data.startTime.split(/[- . :]/);
        if (Number(newStartTimeDataArr[0]) < 10) {
            newStartTimeDataArr[0] = String(`0${Number(newStartTimeDataArr[0])}`);
        }
        let newDataStartTime = String(`${newStartTimeDataArr[0]}:${newStartTimeDataArr[1]}`);
        let newEndTimeDataArr = data.endTime.split(/[- . :]/);
        if (cellMinutes == 0) {
            cellMinutes = "00"
        }
        if (cellHours < 10) {
            cellHours = String(`0${cellHours}`);
        }
        let cellTime = String(`${cellHours}:${cellMinutes}`);
        let cellCompare = String(`${cellHours}${cellMinutes}`);
        let dataStartCompare = String(`${newStartTimeDataArr[0]}${newStartTimeDataArr[1]}`);
        let dataEndCompare = String(`${newEndTimeDataArr[0]}${newEndTimeDataArr[1]}`);
        let currentDrawnScheduleWrapperArr = parent.querySelectorAll('.cell-schedule__item-wrapper');
        let columnNumber;
        columnNumber = 0;
        if ((Number(cellCompare) >= Number(dataStartCompare) && Number(cellCompare) < Number(dataEndCompare))) {
            let allDrawnScheduleWrapperArr = document.querySelectorAll('.cell-schedule__item-wrapper');
            // колонка по умолчанию - 1
            columnNumber = currentDrawnScheduleWrapperArr.length + 1;
            let basicLegendIdArr = [];
            if (currentDrawnScheduleWrapperArr.length >= basicLegendIdArr.length) {
                for (let i = 0; i <= currentDrawnScheduleWrapperArr.length; i++) {
                    basicLegendIdArr.push(i + 1)
                }
            };
            let testIdArr = [];
            for (let i = 0; i < currentDrawnScheduleWrapperArr.length; i++) {
                testIdArr.push(currentDrawnScheduleWrapperArr[i].getAttribute('columnid'));
                if ((i + 1) != currentDrawnScheduleWrapperArr[i].getAttribute('columnid')) {
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
            allDrawnScheduleWrapperArr.forEach(item => {
                if (Number(item.getAttribute('taskid')) == Number(data.taskId)) {
                    columnNumber = Number(item.getAttribute('columnid'));
                }
            });
            // корректировка сетки колонок
            if (columnNumber > DAYCOLUMNS) {
                DAYCOLUMNS = columnNumber;
            }
            // отрисовка обоолочки элемента задачи
            let dayCellScheduleWrapper = document.createElement('li');
            dayCellScheduleWrapper.className = "cell-schedule__item-wrapper";
            dayCellScheduleWrapper.classList.add(String(`schedule-item-column--${columnNumber}`));

            // динамические стили для расположения задач в своей колонке
            let columnStyle = String(`
            grid-row-start: 1;
            grid-row-end: 2;
            grid-column-start: ${columnNumber};
            grid-column-end: ${columnNumber + 1};
            `);

            dayCellScheduleWrapper.style.cssText = columnStyle;
            dayCellScheduleWrapper.classList.add(String(`cell-schedule__item-wrapper--${data.type}`));
            dayCellScheduleWrapper.setAttribute('taskid', (String(`${data.taskId}`)))
            dayCellScheduleList.append(dayCellScheduleWrapper);

            let cellScheduleLegendItem = document.createElement('div');
            cellScheduleLegendItem.className = "cell-schedule__legend-item";
            cellScheduleLegendItem.classList.add("schedule-legend-item");
            cellScheduleLegendItem.classList.add(String(`schedule-legend-item--${data.type}`));
            dayCellScheduleWrapper.append(cellScheduleLegendItem);

            // ПРИСВОЕНИЕ columnId задаче
            dayCellScheduleWrapper.setAttribute('columnid', (String(`${columnNumber}`)));
            var cellScheduleItem = document.createElement('div');
            cellScheduleItem.className = "cell-schedule__item";
            cellScheduleItem.classList.add("schedule-item");
            cellScheduleItem.classList.add(String(`schedule-item--${data.type}`));
            cellScheduleItem.setAttribute('id', (String(`${data.taskId}`)))
            dayCellScheduleWrapper.append(cellScheduleItem);
        };

        // заполнения первого поля - заголовка

        if (newDataStartTime == cellTime) {
            let cellScheduleItemIcon = document.createElement('span');
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
    // отрисовка задач
    const drawScheduleItems = () => {
        let scheduleListArr = document.querySelectorAll('.day-cell-schedule__list');
        scheduleListArr.forEach(list => {
            list.innerHTML = '';
        });
        DAYCOLUMNS = 1;
        let dayTimeCellDayGridArr = dayCalendar.querySelectorAll('.day-grid__time-cell');
        dayTimeCellDayGridArr.forEach(cell => {
            let parent = cell.closest('.day-grid__column');
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
            // сортировка по длительности задач
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
            let dayCellScheduleItemArr = dayCalendar.querySelectorAll('.schedule-item');
            dayCellScheduleItemArr.forEach(item => {
                let scheduleItemTitleArr = [];
                let parent = item.closest('.day-cell-schedule__list');
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
        // за пределами всей отрисовки - проверки - чистка пустых списков,  стилизация после полного отображения данных
        scheduleListArr = dayCalendar.querySelectorAll('.day-cell-schedule__list');
        let gridColumnStyle = String(`display: grid;
        grid-template-columns: repeat(${DAYCOLUMNS}, 1fr);`);

        // корректировка  колонок
        let columnCounter = [];
        scheduleListArr.forEach(item => {
            let cellScheduleWrapperArr = item.querySelectorAll('.cell-schedule__item-wrapper');
            columnCounter.push(cellScheduleWrapperArr.length);
        });

        // сортировка по списку
        function compareNumbers(a, b) {
            return b - a;
        };
        columnCounter.sort(compareNumbers);
        DAYCOLUMNS = columnCounter[0];
        scheduleListArr.forEach(item => {
            item.style.cssText = gridColumnStyle;
            // удаление пустых списков
            if (item.firstChild == null) {
                item.remove();
            };
        });
    };

    let MONTH_STROKE = [
        'Январь',
        'Февраль',
        'Март',
        'Апрель',
        'Май',
        'Июнь',
        'Июль',
        'Август',
        'Сентябрь',
        'Октябрь',
        'Ноябрь',
        'Декабрь',
    ];

    let monthNumber = '';
    monthNumber = currentMonth;
    const setPrevDay = (selectedDate) => {
        // чистка выбранных ячеек
        let dayLegenditemArr = dayCalendar.querySelectorAll('.day-legend__item');
        dayLegenditemArr.forEach(cell => {
            cell.classList.remove('current');
        });
        selectedDate = new Date(selectedDate);
        let selectedDay;
        selectedDate.getMonth();
        selectedDay = selectedDate.getDate();
        selectedDate.setDate(selectedDay - 1);
        newSelectedDate = selectedDate;
        // присвоение новой выбранной даты
        let targetDate = new Date(newSelectedDate).getDate();
        let targetMonth = new Date(newSelectedDate).getMonth() + 1;
        let targetYear = new Date(newSelectedDate).getFullYear();
        let targetDay;
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
        return newSelectedDate;
    };

    const setNextDay = (selectedDate) => {
        // чистка выбранных ячеек
        let dayLegenditemArr = dayCalendar.querySelectorAll('.day-legend__item');

        dayLegenditemArr.forEach(cell => {
            // console.log('чистка тек дня ');
            cell.classList.remove('current');
        });
        selectedDate = new Date(selectedDate);
        let selectedDay;
        selectedDate.getMonth();
        selectedDay = selectedDate.getDate();
        selectedDate.setDate(selectedDay + 1);
        newSelectedDate = selectedDate;
        // console.log(newSelectedDate);
        // присвоение новой выбранной даты
        let targetDate = new Date(newSelectedDate).getDate();
        let targetMonth = new Date(newSelectedDate).getMonth() + 1;
        let targetYear = new Date(newSelectedDate).getFullYear();
        let targetDay;

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
        return newSelectedDate;
    };

    // проерка ячейки текущего дня
    const setCheckedSelectedCell = () => {
        let inputSelectedDate = document.querySelector('.calendar__menu-input-calendar');
        let arr = inputSelectedDate.value.split(/[- . :]/);
        let date = new Date(arr[2], arr[1] - 1, arr[0]);
        let selectedTargetMonth = date.getMonth() + 1;
        let selectedTargetYear = date.getFullYear();
        let selectedTargetDay = date.getDate();
        let monthCellDateArr = document.querySelectorAll('.day-grid__cell-date-data');
    };

    const cellAction = (e) => {
    }

    const drawDayHTML = () => {
        // отрисовка сетки
        // враппер 
        let oldDayGridWrapper = document.querySelector('.grid-wrapper--day-grid');
        if (oldDayGridWrapper) {
            // console.log('есть старая сетка календаря - удаляем');
            oldDayGridWrapper.remove();
        };

        let dayGridWrapper = document.createElement('div');
        dayGridWrapper.className = "grid-wrapper";
        dayGridWrapper.classList.add('grid-wrapper--day-grid');
        dayCalendar.append(dayGridWrapper);

        let dayWrapperLegendList = document.createElement('ul');
        dayWrapperLegendList.className = "day-wrapper__time-legend-list";
        dayGridWrapper.append(dayWrapperLegendList);

        // отрисовка таймлайна легенды сетки
        let timeLineLegend = document.createElement('span');
        timeLineLegend.className = "day-wrapper__time-line";
        timeLineLegend.classList.add('day-wrapper__time-line--day-legend');
        dayWrapperLegendList.append(timeLineLegend);

        // сетка день / часы 48 шт
        let dayTimeCellGrid = document.createElement('ul');
        dayTimeCellGrid.className = "day-calendar__weekdays-list";
        dayTimeCellGrid.classList.add('weekdays');
        dayTimeCellGrid.classList.add('day-grid');
        dayGridWrapper.append(dayTimeCellGrid);

        // отрисовка таймлайна сетки
        let timeLine = document.createElement('span');
        timeLine.className = "day-wrapper__time-line";
        timeLine.classList.add('day-wrapper__time-line--day-grid');
        dayTimeCellGrid.append(timeLine);

        // легенда время 
        for (let t = 0; t < CELLSLEGENG; t++) {
            let dayWrapperLegendItem = document.createElement('li');
            dayWrapperLegendItem.className = "day-wrapper__time-legend-item";
            dayWrapperLegendList.append(dayWrapperLegendItem);

            let dayWrapperLegendTimeDesc = document.createElement('p');
            dayWrapperLegendTimeDesc.className = "day-wrapper__time-legend-desc";
            dayWrapperLegendItem.append(dayWrapperLegendTimeDesc);
        };

        // отрисовка столбцов данных дня
        for (let i = 0; i < DAY_FIELD_COLUMNS; i++) {
            let dayGridColumn = document.createElement('ul');
            dayGridColumn.className = "day-grid__column";
            let elID = i + 1;
            dayGridColumn.setAttribute('id', elID)
            dayTimeCellGrid.append(dayGridColumn);

            //отрисовка таймлайна точки дня
            let timeDot = document.createElement('span');
            timeDot.className = "day-grid__time-dot";
            dayGridColumn.append(timeDot);

            for (let t = 0; t < CELLSLEGENG; t++) {
                let dayTimeCellItem = document.createElement('li');
                dayTimeCellItem.className = "day-grid__time-cell";
                dayGridColumn.append(dayTimeCellItem);
                // + поле для данных ячейки
                let dayCellData = document.createElement('input');
                dayCellData.className = "day-grid__cell-date-data";
                dayCellData.setAttribute("disabled", true);
                dayCellData.setAttribute("type", "hidden");
                dayTimeCellItem.append(dayCellData);
            };
        };
    };

    drawDayHTML();

    let drawDayData = (selectedDate) => {
        selectedDate = new Date(selectedDate);
        selectedDate.setHours(0);
        selectedDate.setMinutes(0);
        selectedDate.setSeconds(0);

        let selectedDayDate = selectedDate;
        let selectedMonthData = selectedDate.getMonth();
        let selectedYearData = selectedDate.getFullYear();
        let selectedDay = selectedDayDate.getDay();

        if (selectedDay == 0) {
            selectedDay = 7;
        };
        let dayCellDataArr = dayCalendar.querySelectorAll('.day-grid__cell-date-data');
        let dayWrapperLegendTimeDescArr = dayCalendar.querySelectorAll('.day-wrapper__time-legend-desc');
        let dayGridColumnArr = dayCalendar.querySelectorAll('.day-grid__column');
        //Отрисовка легенды даты дня недели + данные списка расписания дня
        selectedYearField.textContent = selectedYearData;
        selectedMonthField.textContent = MONTH_STROKE[selectedDate.getMonth()];
        dayLegendDate.textContent = selectedDate.getDate();
        dayLegendMonth.textContent = SIDE_MONTH_NAME[selectedDate.getMonth()];
        dayLegendYear.textContent = selectedDate.getFullYear();

        for (let i = 0; i < DAY_FIELD_COLUMNS; i++) {
            dayGridColumnArr[i].setAttribute("value", selectedDate);
            dayCellDataArr = dayGridColumnArr[i].querySelectorAll('.day-grid__cell-date-data');
            // заполнение данных даты ячеки от шага времени
            for (let j = 0; j < CELLSLEGENG; j++) {
                dayCellDataArr[j].setAttribute('value', j)
                selectedDayDate.setHours(START_HOUR);
                let step = j * timeStep;
                selectedDayDate.setMinutes(step);
                dayCellDataArr[j].setAttribute('value', selectedDayDate)
            }
        }
        // отрисовка инфо ячейки
        // отрисовка легенды часов минут
        for (let j = 0; j < CELLSLEGENG; j++) {
            selectedDayDate.setHours(START_HOUR);
            let step = j * timeStep;
            selectedDayDate.setMinutes(step);
            let legendMinutes = selectedDayDate.getMinutes();
            if (legendMinutes == 0) {
                legendMinutes = "00"
            }
            let legendHours = selectedDayDate.getHours();
            if (legendHours < 10) {
                legendHours = String(`0${legendHours}`)
            }
            // заполнение легенды / по шагу времени
            dayWrapperLegendTimeDescArr[j].textContent = String(`${legendHours}:${legendMinutes}`);
        };
        // данные производственного календаря
        let calendarDayTitle = calendarWrapper.querySelector('.calendar-day-title');
        calendarDayTitle.classList.remove('holiday');
        calendarDayTitle.classList.remove('pre-holiday');
        if (buttonShowSpecialDates.classList.contains('active')) {
            let workCalendarData = JSON.parse(workCalendarJSON);
            let holidaysDataArr = workCalendarData.holidays;
            let preHolidaysDataArr = workCalendarData.preholidays;
            holidaysDataArr.forEach(data => {
                let dataArr = data.split(/[- . :]/);
                let holidayYear = dataArr[0];
                let holidayMonth = dataArr[1];
                let holidayDay = dataArr[2];
                if (dayLegendDate.textContent == Number(holidayDay) && selectedMonthData + 1 == Number(holidayMonth) && dayLegendYear.textContent == holidayYear) {
                    calendarDayTitle.classList.add('holiday');
                }
            });
            preHolidaysDataArr.forEach(data => {
                let dataArr = data.split(/[- . :]/);
                let preHolidayYear = dataArr[0];
                let preHolidayMonth = dataArr[1];
                let preHolidayDay = dataArr[2];

                if (dayLegendDate.textContent == Number(preHolidayDay) && selectedMonthData + 1 == Number(preHolidayMonth) && dayLegendYear.textContent == preHolidayYear) {
                    calendarDayTitle.classList.add('pre-holiday');
                }
            });
        };
        drawScheduleItems();
    };

    drawDayData(newSelectedDate);

    prevDayButton.addEventListener('click', function () {
        if (dayCalendar.classList.contains('active')) {
            setPrevDay(newSelectedDate);
            drawDayData(newSelectedDate);
            setCheckedSelectedCell();
            // передача данных дня даты в боковое меню
            setSideDate(inputSelectedDate.value);
            // анимация нового дня
            dayCalendar.classList.add('hidden');
            dayCalendar.classList.add('move-right');
            setTimeout(() => {
                dayCalendar.classList.remove('move-right');
            }, 100);
            setTimeout(() => {
                dayCalendar.classList.remove('hidden');
            }, 200);
        }
    });

    nextDayButton.addEventListener('click', function () {
        if (dayCalendar.classList.contains('active')) {
            setNextDay(newSelectedDate);
            drawDayData(newSelectedDate);
            setCheckedSelectedCell();
            setSideDate(inputSelectedDate.value);
            // анимация нового месяца
            dayCalendar.classList.add('hidden');
            dayCalendar.classList.add('move-left');
            setTimeout(() => {
                dayCalendar.classList.remove('move-left');
            }, 100);
            setTimeout(() => {
                dayCalendar.classList.remove('hidden');
            }, 200);
        };
    });

    buttonSetCurrentDate.addEventListener('click', function () {
        if (dayCalendar.classList.contains('active')) {
            newSelectedDate = currentDate;
            drawDayData(newSelectedDate); // отрисовка данных сетки дня
            setSideDate(inputSelectedDate.value);
        };
    });

    buttonShowSpecialDates.addEventListener('click', function () {
        drawDayData(newSelectedDate);
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
            }
        })
        if (counter == item.length) {
            sideMenuFilterSpecial.checked = true;
        } else if (counter < item.length) {
            sideMenuFilterSpecial.checked = false;
        }
        if (counter == 0) {
            sideMenuFilterSpecial.checked = false;
        }
    };

    sideMenuFilters.forEach(item => {
        item.addEventListener('change', function () {
            NEWdataForCellArr = [];
            sideMenuFilters.forEach(element => {
                if (element.checked) {
                    for (const DATA of SCHEDULE__DATA) {
                        if (DATA.type == element.value) {
                            NEWdataForCellArr.push(DATA);
                        }
                    }
                }
            });
            checkCheckCount();
            drawScheduleItems();
        })
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
        };
    })
    // таймлайн 

    const timeLine = document.querySelectorAll('.day-wrapper__time-line');

    let startTimeLine = () => {
        let timerId = setInterval(() => {
            let timerDate = new Date();
            let timerStartHours = timerDate.getHours();
            let timerStartMinutes = timerDate.getMinutes();
            let timerStartSeconds = timerDate.getSeconds();
            let timeLine = document.querySelectorAll('.day-wrapper__time-line');
            let timeDot = document.querySelectorAll('.day-grid__time-dot');
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

    // клики на ячейки
    let startListenersForCells = () => {
        dayTimeCellDayGridArr = dayCalendar.querySelectorAll('.day-grid__time-cell');
        dayTimeCellDayGridArr.forEach(cell => {
            cell.addEventListener('click', function (e) {
                cellAction(e);
            })
        });

        dayTimeCellDayGridArr.forEach(cell => {
            cell.addEventListener('click', function (e) {
                let cellTaskItemArr = cell.querySelectorAll('.cell-schedule__item');
                taskSelectortaskList.innerHTML = '';

                let taskSelectorCrossTasks = document.createElement('div');
                taskSelectorCrossTasks.className = "task-selector__cross-task-list";
                taskSelectortaskList.append(taskSelectorCrossTasks);

                let cellScheduleList = cell.querySelector('.day-cell-schedule__list');
                e.preventDefault();
                taskSelectorPopup.style.display = 'block';
                // позиционирование справа от курсора
                // taskSelectorPopup.style.left = e.pageX + 30 + 'px';
                // taskSelectorPopup.style.top = e.pageY + 'px';
                // console.log(taskSelectorPopup.clientHeight);
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
                    if (cellTaskItemArr.length >= 8) {
                        taskSelectorPopup.classList.add('task-selector--2-column');
                    }
                    if (cellTaskItemArr.length >= 10) {
                        taskSelectorPopup.classList.add('task-selector--3-column');
                    }
                    activatTaskSelectorModal(taskSelectorPopup, taskSelectorPopupInner, taskSelectorPopupInnerClass, taskSelectorPopupSwipeClose, taskSelectorButtonClose);
                } else {
                }
                // позиционирование попапа в зависимости от контента
                taskSelectorPopup = document.querySelector('.task-selector');
                taskSelectorPopup.style.left = String(`calc(50% - ${taskSelectorPopup.clientWidth}px / 2 + 0px)`);
                taskSelectorPopup.style.top = String(`calc(50% - ${taskSelectorPopup.clientHeight}px / 2 + 0px)`);
            })
        });
    };

    startListenersForCells();

    workingHourSelector.forEach(item => {
        item.addEventListener('change', function () {
            setHourData(item);
            buildDayCalendarHtml();
            drawDayHTML();
            drawDayData(newSelectedDate);
            startListenersForCells();
        })
    });
});


