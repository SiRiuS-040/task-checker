import { SCHEDULE__DATA, workCalendarJSON } from './data.js';

document.addEventListener("DOMContentLoaded", function () {
    let calendarWrapper = document.querySelector('.calendar');
    let calendarMain = document.querySelector('.calendar__main-wrapper');
    let calendarMini = document.querySelector('.mini-calendar');
    let calendarGrid = document.querySelector('.mini-calendar');
    let monthDayGrid = calendarMini.querySelector('.month__day-grid');
    let monthCellArr = calendarMini.querySelectorAll('.month-grid__day-cell');
    let monthCellDateArr = calendarMini.querySelectorAll('.month-grid__cell-date-data');
    let monthCellDayArr = calendarMini.querySelectorAll('.month-grid__cell-day-number');
    let weekTitleList = calendarMini.querySelector('.weekdays__list');
    let weekTitleArr = calendarMini.querySelectorAll('.weekdays__item');

    // боковое меню
    let sideSection = document.querySelector('.calendar__side-section');
    // дата в разделе задач бокового меню 
    const sideSelectedDate = document.querySelector('.side-section__selected-date-data');
    const sideSelectedMonth = document.querySelector('.side-section__selected-month-data');
    const sideSelectedDay = document.querySelector('.side-section__selected-day-data');
    // ввод даты 
    const inputSelectedDate = document.querySelector('.calendar__menu-input-calendar');
    // Управление месяцами
    const mainCalendarTitleData = calendarMain.querySelector('.calendar-title__data');
    const selectedMonthFieldMain = calendarMain.querySelector('.calendar-title__current-month');
    const selectedYearFieldMain = calendarMain.querySelector('.calendar-title__current-year');
    const buttonSetCurrentDate = calendarMain.querySelector('.calendar__control--set-current-date');
    const prevMonthButtonMain = calendarMain.querySelector('.calendar__control-button--prev');
    const nextMonthButtonMain = calendarMain.querySelector('.calendar__control-button--next');
    const buttonShowSpecialDates = calendarWrapper.querySelector('.calendar-options__control--special-dates');
    const miniCalendarTitleData = calendarMini.querySelector('.mini-calendar__title-data');
    const prevMonthButton = calendarMini.querySelector('.mini-calendar__control-button--prev');
    const nextMonthButton = calendarMini.querySelector('.mini-calendar__control-button--next');
    const selectedMonthField = calendarMini.querySelector('.mini-calendar-title__current-month');
    const selectedYearField = calendarMini.querySelector('.mini-calendar-title__current-year');

    // ФИЛЬТРАЦИЯ
    const sideMenuFilters = document.querySelectorAll('.task-filter__input-checkbox');
    const sideMenuFilterSpecial = document.querySelector('.task-filter__input-checkbox-special');
    // отрисовка сетки дней
    const dayCalendar = document.querySelector('.day-calendar');

    let NEWdataForCellArr = SCHEDULE__DATA;
    const toTimestamp = (strDate) => {
        const dt = Date.parse(strDate);
        return dt / 1000;
    };

    const clearCurrentDate = toTimestamp(new Date());
    const currentDate = Date(clearCurrentDate);
    const currentDayCount = new Date().getDate();
    const currentDay = new Date().getDay();
    const currentYear = new Date().getFullYear();

    // присвоение тек даты
    let startDay = new Date().getDate();
    let startMonth = new Date().getMonth() + 1;
    let startYear = new Date().getFullYear();
    let startInputDate;

    function createStartInputDate() {
        if (startDay < 10) {
            startDay = String(`0${startDay}`)
        }
        if (startMonth < 10) {
            startMonth = String(`0${startMonth}`)
        }
        startInputDate = String(`${startDay}.${startMonth}.${startYear}`);
    };

    createStartInputDate();
    inputSelectedDate.value = startInputDate;

    // Присвоение текущей даты
    const setSideDate = (date) => {
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
        let arr = date.split(/[- . :]/);
        let fulldate = new Date(arr[2], arr[1] - 1, arr[0]);
        let sideDay = fulldate.getDay();
        sideSelectedDate.textContent = Number(arr[0]);
        sideSelectedMonth.textContent = SIDE_MONTH_NAME[Number(arr[1] - 1)];
        sideSelectedDay.textContent = SIDE_DAY_NAME[sideDay];
    };

    setSideDate(inputSelectedDate.value);

    //
    buttonSetCurrentDate.addEventListener('click', function () {
        monthCellDayArr.forEach(item => {
            item.classList.remove('selected-day');
        });

        monthCellArr.forEach(item => {
            item.classList.remove('selected-week');
            item.classList.remove('grid-week');
        });
        inputSelectedDate.value = startInputDate;
        newSelectedDate = currentDate;
        drawDates(newSelectedDate);
        setSideDate(inputSelectedDate.value);
    })

    // newSelectedDate = date; // подстановка даты
    let newSelectedDate = currentDate;
    const currentMonth = new Date().getMonth();
    // вычисление номера недели

    let getWeek = (today) => {
        today = new Date(today);
        const firstDayOfYear = new Date(today.getFullYear(), 0, 1);
        const pastDaysOfYear = (today - firstDayOfYear) / 86400000;
        let weekNumber = Math.floor(((pastDaysOfYear + firstDayOfYear.getDay() - 1) / 7));
        if (weekNumber == 0) {
            weekNumber = 52;
        }
        return weekNumber;
    };

    // даные для расписания 
    const buildScheduleHtml = (item) => {
        let parent = item.closest('.month-grid__day-cell');
        let cellScheduleList = parent.querySelector('.cell-schedule__list');

        if (cellScheduleList) {
            parent.removeChild(cellScheduleList);
        }
        // Список расписания
        cellScheduleList = document.createElement('div');
        cellScheduleList.className = "cell-schedule__list";
        item.append(cellScheduleList);
    };
    const buildScheduleItems = (item, data) => {
        let parent = item.closest('.month-grid__day-cell');
        let cellScheduleList = parent.querySelector('.cell-schedule__list');
        // Данные и структура расписания
        let cellScheduleItem = document.createElement('span');
        cellScheduleItem.className = "cell-schedule__item";
        cellScheduleItem.classList.add("schedule-item");
        cellScheduleItem.classList.add(String(`schedule-item--${data.type}`));
        cellScheduleList.append(cellScheduleItem);
    };

    const drawScheduleItems = () => {
        let monthCellArr = calendarMini.querySelectorAll('.month-grid__day-cell');
        monthCellArr.forEach(cell => {
            let parent = cell.closest('.month-grid__day-cell');
            let monthCellDate = parent.querySelector('.month-grid__cell-date-data');
            let itemDate = monthCellDate.textContent;
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
            buildScheduleHtml(cell);
            dataForCellArr.forEach(dataForCell => {
                buildScheduleItems(cell, dataForCell);
            });
        });
    };
    // отрисовка бокового меню 
    const buildSideScheduleHtml = () => {
        let sideScheduleSection = sideSection.querySelector('.side-section__schedule');
        let sideScheduleList = sideSection.querySelector('.side-schedule__list');
        if (sideScheduleList) {
            sideScheduleSection.removeChild(sideScheduleList);
        }
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

    const setPrevMonth = (selectedDate) => {
        // убираем метки с выбранного дня
        monthCellDayArr.forEach(item => {
            item.classList.remove('selected-day');
        });
        selectedDate = new Date(selectedDate);
        let selectedMonth;
        selectedDate.getMonth();
        selectedMonth = selectedDate.getMonth();
        selectedDate.setMonth(selectedMonth - 1);
        newSelectedDate = selectedDate;
        return newSelectedDate;
    };

    const setNextMonth = (selectedDate) => {
        // убираем метки с выбранного дня
        monthCellDayArr.forEach(item => {
            item.classList.remove('selected-day');
        });
        selectedDate = new Date(selectedDate);
        let selectedMonth;
        selectedDate.getMonth();
        selectedMonth = selectedDate.getMonth();
        selectedDate.setMonth(selectedMonth + 1);
        newSelectedDate = selectedDate;
        return newSelectedDate;
    };

    let drawDates = (selectedDate) => {
        selectedDate = new Date(selectedDate);
        selectedDate.setHours(0);
        selectedDate.setMinutes(0);
        selectedDate.setSeconds(0);
        let selectedMonthData = selectedDate.getMonth();
        let selectedYearData = selectedDate.getFullYear();

        // закраска недели
        let currentWeekNumber = getWeek(currentDate); // номер текущей недели
        let gridWeekNumber = getWeek(mainCalendarTitleData.value); // номер текущей недели
        let selectedWeekDate = selectedDate;
        let selectedWeekDay = selectedWeekDate.getDay();

        if (selectedWeekDay == 0) {
            selectedWeekDay = 7;
        }
        let selectedWeekDayDate = selectedWeekDate.getDate();
        let firstDayWeek = selectedWeekDayDate - selectedWeekDay + 1;
        let lastDayWeek = firstDayWeek + 6;
        miniCalendarTitleData.value = selectedDate;
        let startDate = selectedDate;
        let newCircleDate = 0;
        newCircleDate = startDate;
        newCircleDate.setDate(1);
        let dayID = newCircleDate.getDay();
        if (dayID == 0) {
            newCircleDate.setDate(1 - 7 + 1);
        } else {
            newCircleDate.setDate(1 - dayID + 1);
        }
        let firstCellDate = newCircleDate.getDate();
        for (let i = 0; i < monthCellDayArr.length; i++) {
            monthCellDayArr[i].textContent = newCircleDate.getDate();
            monthCellDateArr[i].textContent = newCircleDate;
            firstCellDate++;
            newCircleDate.setDate(firstCellDate);
            firstCellDate = newCircleDate.getDate();
        }

        selectedMonthField.textContent = MONTH_STROKE[(parseInt(selectedMonthData))];
        selectedYearField.textContent = selectedYearData;

        monthCellArr.forEach(element => {
            let cellDate = element.querySelector('.month-grid__cell-date-data');
            let cellDay = element.querySelector('.month-grid__cell-day-number');

            let parent = element.closest('.month-grid__day-cell');
            let monthCellDay = parent.querySelector('.month-grid__cell-day-number');

            element.classList.remove('selected-week');
            cellDay.classList.remove('selected-day');
            element.classList.remove('grid-week');
            element.classList.remove('current-week');
            element.classList.remove('current-day');
            cellDay.classList.remove('current-day');
            cellDay.classList.remove('current-month');
            cellDay.classList.remove('holiday');
            cellDay.classList.remove('pre-holiday');

            let checkDate = new Date(cellDate.textContent);
            let cellWeekNumber = getWeek(checkDate);
            let weekCalendar = document.querySelector('.week-calendar');

            if (weekCalendar.classList.contains('active')) {
                if (cellWeekNumber == gridWeekNumber && checkDate.getFullYear() == currentYear) {
                    element.classList.add('grid-week');
                };
                if (cellWeekNumber == currentWeekNumber && checkDate.getFullYear() == currentYear) {
                    element.classList.add('current-week');
                };
            };

            if (currentDayCount == cellDay.textContent && checkDate.getMonth() == currentMonth && checkDate.getFullYear() == currentYear) {
                element.classList.add('current-day');
                cellDay.classList.add('current-day');
            };
            if ((checkDate.getMonth() == selectedMonthData && checkDate.getFullYear() == selectedYearData)) {
                cellDay.classList.add('current-month');
            };

            if (buttonShowSpecialDates.classList.contains('active')) {
                // данные производственного календаря
                let workCalendarData = JSON.parse(workCalendarJSON);
                let holidaysDataArr = workCalendarData.holidays;
                let preHolidaysDataArr = workCalendarData.preholidays;
                holidaysDataArr.forEach(data => {
                    let dataArr = data.split(/[- . :]/);
                    let holidayYear = dataArr[0];
                    let holidayMonth = dataArr[1];
                    let holidayDay = dataArr[2];
                    if (cellDay.textContent == Number(holidayDay) && checkDate.getMonth() + 1 == Number(holidayMonth) && holidayYear == checkDate.getFullYear()) {
                        cellDay.classList.add('holiday');
                    }
                });
                preHolidaysDataArr.forEach(data => {
                    let dataArr = data.split(/[- . :]/);
                    let preHolidayYear = dataArr[0];
                    let preHolidayMonth = dataArr[1];
                    let preHolidayDay = dataArr[2];
                    if (cellDay.textContent == Number(preHolidayDay) && checkDate.getMonth() + 1 == Number(preHolidayMonth) && preHolidayYear == checkDate.getFullYear()) {
                        cellDay.classList.add('pre-holiday');
                    }
                });
            };
        });
        weekTitleArr.forEach(element => {
            let weekLegend = element.querySelector('.weekdays__item-legnd');
            weekLegend.classList.remove('current');
            if (currentDay == element.getAttribute('id') && selectedMonthData == currentMonth && selectedYearField.textContent == currentYear) {
                weekLegend.classList.add('current');
            }
        });
        drawScheduleItems();
    };

    drawDates(newSelectedDate);
    const setCheckedSelectedCell = () => {
        let inputSelectedDate = document.querySelector('.calendar__menu-input-calendar');
        if (inputSelectedDate.value != startInputDate) {
            let arr = inputSelectedDate.value.split(/[- . :]/);
            let date = new Date(arr[2], arr[1] - 1, arr[0]);
            let selectedTargetMonth = date.getMonth() + 1;
            let selectedTargetYear = date.getFullYear();
            let selectedTargetDay = date.getDate();
            let targetWeekNumber = getWeek(date);
            let monthCellDateArr = document.querySelectorAll('.month-grid__cell-date-data');

            monthCellDateArr.forEach(item => {
                let parent = item.closest('.month-grid__day-cell');
                let monthCellDay = parent.querySelector('.month-grid__cell-day-number');
                if (selectedTargetMonth == (new Date(item.textContent).getMonth() + 1) && selectedTargetYear === (new Date(item.textContent).getFullYear()) && selectedTargetDay === (new Date(item.textContent).getDate())) {
                    parent.classList.add('selected-day');
                    monthCellDay.classList.add('selected-day');
                };
                // отрисовка выбранной недели 
                let cellDate = parent.querySelector('.month-grid__cell-date-data');
                let checkDate = new Date(cellDate.textContent);
                let checkYear = checkDate.getFullYear();
                let cellWeekNumber = getWeek(checkDate);

                if (cellWeekNumber == targetWeekNumber && selectedTargetYear == checkYear) {
                    parent.classList.add('selected-week');
                };
            });
        };
    };

    prevMonthButton.addEventListener('click', function () {
        calendarMain = document.querySelector('.main-calendar');
        let weekCalendar = document.querySelector('.week-calendar');
        if (calendarMain.classList.contains('active')) {
        }
        if (weekCalendar.classList.contains('active')) {
        }
        setPrevMonth(newSelectedDate);
        drawDates(newSelectedDate);
        setCheckedSelectedCell();
        // анимация нового месяца
        calendarGrid.classList.add('hidden');
        calendarGrid.classList.add('move-right');
        setTimeout(() => {
            calendarGrid.classList.remove('move-right');
            // calendarGrid.classList.remove('hidden');
        }, 100);
        setTimeout(() => {
            calendarGrid.classList.remove('hidden');
            // calendarGrid.classList.remove('move-right');
        }, 200);
    });

    nextMonthButton.addEventListener('click', function () {
        calendarMain = document.querySelector('.main-calendar');
        let weekCalendar = document.querySelector('.week-calendar');
        if (calendarMain.classList.contains('active')) {
        }
        if (weekCalendar.classList.contains('active')) {
        }
        setNextMonth(newSelectedDate);
        drawDates(newSelectedDate);
        setCheckedSelectedCell();
        // анимация нового месяца
        calendarGrid.classList.add('hidden');
        calendarGrid.classList.add('move-left');
        setTimeout(() => {
            calendarGrid.classList.remove('move-left');
        }, 100);

        setTimeout(() => {
            calendarGrid.classList.remove('hidden');
            // calendarGrid.classList.remove('move-left');
        }, 200);
    })



    prevMonthButtonMain.addEventListener('click', function () {
        calendarMain = document.querySelector('.main-calendar');
        let weekCalendar = document.querySelector('.week-calendar');
        if (calendarMain.classList.contains('active')) {
            miniCalendarTitleData.value = mainCalendarTitleData.value;
            newSelectedDate = mainCalendarTitleData.value;
            newSelectedDate = new Date(newSelectedDate);
            let switchMonth = newSelectedDate.getMonth();
            newSelectedDate.setMonth(switchMonth + 1);
            prevMonthButton.dispatchEvent(evtClick);

            setCheckedSelectedCell();
            drawDates(newSelectedDate);
        }
        if (weekCalendar.classList.contains('active')) {
            miniCalendarTitleData.value = mainCalendarTitleData.value;
            newSelectedDate = mainCalendarTitleData.value;
            newSelectedDate = new Date(newSelectedDate);
            let switchWeek = newSelectedDate.getDate();
            newSelectedDate.setDate(switchWeek - 7);
            mainCalendarTitleData.value = newSelectedDate;
            drawDates(newSelectedDate);
            setCheckedSelectedCell();
            selectedMonthFieldMain.textContent = selectedMonthField.textContent;
            selectedYearFieldMain.textContent = selectedYearField.textContent;
        };
        if (dayCalendar.classList.contains('active')) {
            miniCalendarTitleData.value = mainCalendarTitleData.value;
            newSelectedDate = mainCalendarTitleData.value;
            newSelectedDate = new Date(newSelectedDate);
            let switchDay = newSelectedDate.getDate();
            newSelectedDate.setDate(switchDay - 1);
            mainCalendarTitleData.value = newSelectedDate;
            drawDates(newSelectedDate);
            setCheckedSelectedCell();
        };
    });
    nextMonthButtonMain.addEventListener('click', function () {
        calendarMain = document.querySelector('.main-calendar');
        let weekCalendar = document.querySelector('.week-calendar');

        if (calendarMain.classList.contains('active')) {
            miniCalendarTitleData.value = mainCalendarTitleData.value;
            newSelectedDate = mainCalendarTitleData.value;
            newSelectedDate = new Date(newSelectedDate);
            let switchMonth = newSelectedDate.getMonth();
            newSelectedDate.setMonth(switchMonth - 1);
            nextMonthButton.dispatchEvent(evtClick);
            drawDates(newSelectedDate);
            setCheckedSelectedCell();
        }

        if (weekCalendar.classList.contains('active')) {
            miniCalendarTitleData.value = mainCalendarTitleData.value;
            newSelectedDate = mainCalendarTitleData.value;
            newSelectedDate = new Date(newSelectedDate);
            let switchWeek = newSelectedDate.getDate();
            newSelectedDate.setDate(switchWeek + 7);
            mainCalendarTitleData.value = newSelectedDate;
            drawDates(newSelectedDate);
            setCheckedSelectedCell();
            selectedMonthFieldMain.textContent = selectedMonthField.textContent;
            selectedYearFieldMain.textContent = selectedYearField.textContent;
        };

        if (dayCalendar.classList.contains('active')) {
            miniCalendarTitleData.value = mainCalendarTitleData.value;
            newSelectedDate = mainCalendarTitleData.value;
            newSelectedDate = new Date(newSelectedDate);
            let switchDay = newSelectedDate.getDate();
            newSelectedDate.setDate(switchDay + 1);
            mainCalendarTitleData.value = newSelectedDate;
            drawDates(newSelectedDate);
            setCheckedSelectedCell();
        }
    })

    // клики на ячейки
    let evtInput = new Event('input');
    let evtClick = new Event('click');

    buttonShowSpecialDates.addEventListener('click', function () {
        drawDates(newSelectedDate);
    });


    const cellAction = (e) => {
        let targetCell = e.target;
        let parent = targetCell.closest('.month-grid__day-cell');
        let monthCellDay = parent.querySelector('.month-grid__cell-day-number');
        let monthCellDate = parent.querySelector('.month-grid__cell-date-data');
        let targetDate = new Date(monthCellDate.textContent).getDate();
        let targetMonth = new Date(monthCellDate.textContent).getMonth() + 1;
        let targetYear = new Date(monthCellDate.textContent).getFullYear();
        let targetDay;
        let selectedTargetData = monthCellDate.textContent;
        let selectedTargetDay = new Date(selectedTargetData).getDate();
        let selectedTargetMonth = new Date(selectedTargetData).getMonth() + 1;
        let selectedTargetYear = new Date(selectedTargetData).getFullYear();
        newSelectedDate = new Date(newSelectedDate)

        // закраска недели
        let selectedWeekDate = new Date(selectedTargetData);
        let selectedWeekDay = selectedWeekDate.getDay();
        if (selectedWeekDay == 0) {
            selectedWeekDay = 7;
        }

        let selectedWeekDayDate = selectedWeekDate.getDate();
        let firstDayWeek = selectedWeekDayDate - selectedWeekDay + 1;
        let targetWeekNumber = getWeek(selectedTargetData);

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
        inputSelectedDate.dispatchEvent(evtInput);

        if ((selectedTargetYear == newSelectedDate.getFullYear()) && ((selectedTargetMonth - 1) < newSelectedDate.getMonth())) {
            prevMonthButton.dispatchEvent(evtClick);
        } else if ((selectedTargetYear < newSelectedDate.getFullYear()) && ((selectedTargetMonth - 1) > newSelectedDate.getMonth())) {
            prevMonthButton.dispatchEvent(evtClick);
        } else if ((selectedTargetYear == newSelectedDate.getFullYear()) && ((selectedTargetMonth - 1) > newSelectedDate.getMonth())) {
            nextMonthButton.dispatchEvent(evtClick);
        } else if ((selectedTargetYear > newSelectedDate.getFullYear()) && ((selectedTargetMonth - 1) < newSelectedDate.getMonth())) {
            nextMonthButton.dispatchEvent(evtClick);
        } else {
            monthCellDay.classList.add('selected-day');
        }
        // закраска выбранной недели
        monthCellArr.forEach(element => {
            let cellDate = element.querySelector('.month-grid__cell-date-data');
            let cellDay = element.querySelector('.month-grid__cell-day-number');
            let parent = element.closest('.month-grid__day-cell');
            let monthCellDay = parent.querySelector('.month-grid__cell-day-number');
            element.classList.remove('selected-week');
            element.classList.remove('grid-week');
            let checkDate = new Date(cellDate.textContent);
            let checkYear = checkDate.getFullYear();
            let cellWeekNumber = getWeek(checkDate);
            if (cellWeekNumber == targetWeekNumber && selectedTargetYear == checkYear) {
                element.classList.add('selected-week');
            }
        });

        monthCellDateArr.forEach(item => {
            let parent = item.closest('.month-grid__day-cell');
            let monthCellDay = parent.querySelector('.month-grid__cell-day-number');
            if (selectedTargetMonth == (new Date(item.textContent).getMonth() + 1) && selectedTargetYear === (new Date(item.textContent).getFullYear()) && selectedTargetDay === (new Date(item.textContent).getDate())) {
                monthCellDay.classList.add('selected-day');
            }
        });

        drawSideScheduleItems();
        setCheckedSelectedCell();
        setSideDate(inputSelectedDate.value);
    };

    // Фильтрация
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
            drawScheduleItems();
            drawSideScheduleItems();
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
            drawSideScheduleItems();
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
            drawSideScheduleItems();
        }
    })

    monthCellArr.forEach(cell => {
        cell.addEventListener('click', function (e) {
            let monthCellArr = document.querySelectorAll('.month-grid__day-cell');
            let monthCellDayArr = document.querySelectorAll('.month-grid__cell-day-number');
            monthCellArr.forEach(cell => {
                cell.classList.remove('selected-day');
            });
            monthCellDayArr.forEach(item => {
                item.classList.remove('selected-day');
            });
            cellAction(e);
        })
    });
});






