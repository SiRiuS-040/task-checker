import { SCHEDULE__DATA, workCalendarJSON } from './data.js';

document.addEventListener("DOMContentLoaded", function () {
    // Отрисовка главной сетки
    const buildMainCalendarHtml = () => {
        const calendarMaindWrapper = document.querySelector('.calendar__main-wrapper');
        const calendarGridWrapper = document.createElement('div');

        calendarGridWrapper.className = "main-calendar";
        calendarGridWrapper.classList.add('calendar__grid-wrapper');
        calendarGridWrapper.classList.add('active');
        calendarMaindWrapper.append(calendarGridWrapper);

        const calendarMaindWeekCell = document.createElement('ul');
        calendarMaindWeekCell.className = "main-calendar__weekdays-list";
        calendarMaindWeekCell.classList.add('weekdays');
        calendarGridWrapper.append(calendarMaindWeekCell);

        // отрисовка легенды дней
        const DAY_NAME = [
            "Пн",
            "Вт",
            "Ср",
            "Чт",
            "Пт",
            "Сб",
            "Вс"
        ]

        for (let i = 0; i < 7; i++) {
            const calendarMaindWeekItem = document.createElement('li');
            calendarMaindWeekItem.className = "weekdays__item";
            calendarMaindWeekCell.append(calendarMaindWeekItem);
            const calendarMaindWeekItemLegend = document.createElement('span');
            calendarMaindWeekItemLegend.className = "weekdays__item-legend";
            calendarMaindWeekItemLegend.setAttribute('id', i + 1)
            if (i == 6) {
                calendarMaindWeekItemLegend.setAttribute('id', 0)
            }
            calendarMaindWeekItemLegend.textContent = DAY_NAME[i];
            calendarMaindWeekItem.append(calendarMaindWeekItemLegend);
        }
        // отрисовка сетки всех дней
        const calendarMaindMonthGrid = document.createElement('ul');
        calendarMaindMonthGrid.className = "main-calendar__month-grid";
        calendarMaindMonthGrid.classList.add('month-grid');
        calendarGridWrapper.append(calendarMaindMonthGrid);

        for (let i = 0; i < 42; i++) {
            const calendarMainDayCellItem = document.createElement('li');
            calendarMainDayCellItem.className = "month-grid__day-cell";
            calendarMaindMonthGrid.append(calendarMainDayCellItem);
            const calendarMainDayCellData = document.createElement('input');
            calendarMainDayCellData.className = "month-grid__cell-date-data";
            calendarMainDayCellData.setAttribute("type", "text");
            calendarMainDayCellData.setAttribute("disabled", true);
            calendarMainDayCellItem.append(calendarMainDayCellData);
            const calendarMainDayCellDayNumber = document.createElement('p');
            calendarMainDayCellDayNumber.className = "month-grid__cell-day-number";
            calendarMainDayCellItem.append(calendarMainDayCellDayNumber);
        }
    }
    buildMainCalendarHtml();

    let calendarContent = document.querySelector('.calendar-content');
    let profileSideleftMenu = document.querySelector('.employer-profile');

    let calendarWrapper = document.querySelector('.calendar');
    let calendarTitle = calendarWrapper.querySelector('.calendar-title');
    let calendarDayTitle = calendarWrapper.querySelector('.calendar-day-title');
    let calendarMain = document.querySelector('.main-calendar');
    let monthDayGrid = calendarMain.querySelector('.month-grid');
    let monthCellArr = calendarMain.querySelectorAll('.month-grid__day-cell');
    let monthCellDateArr = calendarMain.querySelectorAll('.month-grid__cell-date-data');
    let monthCellDayArr = calendarMain.querySelectorAll('.month-grid__cell-day-number');
    let weekTitleList = calendarMain.querySelector('.weekdays');
    let weekTitleArr = calendarMain.querySelectorAll('.weekdays__item');

    // боковое меню
    let sideSection = document.querySelector('.calendar__side-section');
    let sideScheduleSection = sideSection.querySelector('.side-section__schedule');
    let calendarMini = document.querySelector('.calendar__mini-calendar-wrapper');
    // дата в разделе задач бокового меню 
    const sideSelectedDate = document.querySelector('.side-section__selected-date-data');
    const sideSelectedMonth = document.querySelector('.side-section__selected-month-data');
    const sideSelectedDay = document.querySelector('.side-section__selected-day-data');
    // ввод даты 
    const mainCalendarTitleData = calendarWrapper.querySelector('.calendar-title__data');
    const inputSelectedDate = document.querySelector('.calendar__menu-input-calendar');
    const buttonSetCurrentDate = calendarWrapper.querySelector('.calendar__control--set-current-date');
    // опции 
    const calendarOverlay = calendarWrapper.querySelector('.calendar__overlay');
    const calendarOptionsButtonClose = calendarWrapper.querySelector('.calendar-options__button-close');
    const workingTimeListArr = document.querySelectorAll('.working-time__hour-list');
    const buttonGridoptions = calendarWrapper.querySelector('.grid-control__button-show-options');
    const gridOptionsList = calendarWrapper.querySelector('.grid-control__list');
    const gridControlButtonArr = calendarWrapper.querySelectorAll('.grid-control__button');
    const calendarOptionsButton = calendarWrapper.querySelector('.calendar-options__button--show-options');
    const calendarOptionWrapper = calendarWrapper.querySelector('.calendar-options__wrapper');
    const buttonHideWeekdays = calendarWrapper.querySelector('.calendar-options__control--hide-weekdays');  // заменить
    const buttonShowSpecialDates = calendarWrapper.querySelector('.calendar-options__control--special-dates');  // заменить
    let newTaskPopupButtonOpenPopup = document.querySelector('.content-header__button--add-new-task');
    let fullScreenToggleButton = document.querySelector('.content-header__button--full-screen');
    const buttonHideSideMenu = document.querySelector('.calendar__control--show-side-menu');
    const prevMonthButton = calendarWrapper.querySelector('.calendar__control-button--prev');
    const nextMonthButton = calendarWrapper.querySelector('.calendar__control-button--next');
    const selectedMonthField = calendarWrapper.querySelector('.calendar-title__current-month');
    const selectedYearField = calendarWrapper.querySelector('.calendar-title__current-year');

    // имитация действия для dispatchevent 
    let evtInput = new Event('input');
    let evtClick = new Event('click');
    // ФИЛЬТРАЦИЯ
    const sideMenuFilters = document.querySelectorAll('.task-filter__input-checkbox');
    const sideMenuFilterSpecial = document.querySelector('.task-filter__input-checkbox-special');
    // отрисовка сетки дней
    let dayCalendar = document.querySelector('.day-calendar');

    // для даты бокового меню
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

    // тестовые данные задач
    let NEWdataForCellArr = SCHEDULE__DATA;

    const toTimestamp = (strDate) => {
        const dt = Date.parse(strDate);
        return dt / 1000;
    }

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
        console.log(today);
        console.log(monthNumber);
        return monthNumber;
    }

    // присвоение тек даты
    let startDay = new Date().getDate();
    let startDayDay = new Date().getDay();
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
    }

    createStartInputDate();
    inputSelectedDate.value = startInputDate;

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
        drawDates(newSelectedDate);
    });

    let newSelectedDate = currentDate;

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
    }

    const buildScheduleItems = (item, data) => {

        let parent = item.closest('.month-grid__day-cell');
        let cellScheduleList = parent.querySelector('.cell-schedule__list');
        // Данные и структура расписания
        let cellScheduleItem = document.createElement('div');
        cellScheduleItem.className = "cell-schedule__item";
        cellScheduleItem.setAttribute('id', (String(`${data.taskId}`)));

        cellScheduleItem.classList.add("schedule-item");
        cellScheduleItem.classList.add(String(`schedule-item--${data.type}`));
        cellScheduleList.append(cellScheduleItem);

        let cellScheduleItemIcon = document.createElement('span');
        cellScheduleItemIcon.className = "schedule-item__type";
        cellScheduleItemIcon.classList.add(String(`schedule-item__type--${data.type}`));
        cellScheduleItem.append(cellScheduleItemIcon);

        let cellScheduleItemTitle = document.createElement('p');
        cellScheduleItemTitle.className = "schedule-item__title";
        cellScheduleItemTitle.textContent = data.title;
        cellScheduleItem.append(cellScheduleItemTitle);

        let cellScheduleItemTimePeriod = document.createElement('p');
        cellScheduleItemTimePeriod.className = "schedule-item__time-period";
        cellScheduleItemTimePeriod.textContent = String(`${data.startTime}-${data.endTime}`);
        cellScheduleItem.append(cellScheduleItemTimePeriod);
    }

    const drawScheduleItems = () => {
        let monthCellArr = calendarMain.querySelectorAll('.month-grid__day-cell');
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
            // отрисовка уведомления скрытых задач 
            let showMoreWrapper = cell.querySelector('.cell-schedule__hidden-tasks');
            if (showMoreWrapper) {
                showMoreWrapper.remove();
            }
            const drawMoretasks = (counter) => {
                if (showMoreWrapper) {
                    showMoreWrapper.remove();
                }
                showMoreWrapper = document.createElement('p');
                showMoreWrapper.className = "cell-schedule__hidden-tasks";
                showMoreWrapper.textContent = 'Ещё ';
                cell.append(showMoreWrapper);
                let showMoreCounterData = document.createElement('span');
                showMoreCounterData.className = "cell-schedule__hidden-tasks-counter-data";
                showMoreCounterData.textContent = counter - 2;
                showMoreWrapper.append(showMoreCounterData);
            }
            let cellTaskItem = cell.querySelectorAll('.cell-schedule__item');
            if (cellTaskItem.length >= 3) {
                drawMoretasks(cellTaskItem.length);
            }
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
    }

    const buildSideScheduleItems = (data) => {
        let sideScheduleList = sideSection.querySelector('.side-schedule__list');
        // Данные и структура расписания
        let sideScheduleItem = document.createElement('div');
        sideScheduleItem.className = "side-schedule__item";
        sideScheduleItem.setAttribute('id', (String(`${data.taskId}`)));

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

        let monthCellArr = calendarMain.querySelectorAll('.month-grid__day-cell');
        let monthCellDayArr = calendarMain.querySelectorAll('.month-grid__cell-day-number');
        monthCellArr.forEach(cell => {
            cell.classList.remove('selected-day');
        });
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
        let monthCellArr = calendarMain.querySelectorAll('.month-grid__day-cell');
        let monthCellDayArr = calendarMain.querySelectorAll('.month-grid__cell-day-number');
        monthCellArr.forEach(cell => {
            cell.classList.remove('selected-day');
        });
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
        mainCalendarTitleData.value = selectedDate;
        let startDate = selectedDate;
        let newCircleDate = 0;
        newCircleDate = startDate;
        newCircleDate.setDate(1);
        newCircleDate.setHours(0);
        newCircleDate.setMinutes(0);
        newCircleDate.setSeconds(0);
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

        monthCellArr.forEach(cell => {
            let cellDate = cell.querySelector('.month-grid__cell-date-data');
            let cellDay = cell.querySelector('.month-grid__cell-day-number');
            cell.classList.remove('current-day');
            cellDay.classList.remove('current-day');
            cellDay.classList.remove('current-month');

            cellDay.classList.remove('holiday');
            cellDay.classList.remove('pre-holiday');
            let checkDate = new Date(cellDate.textContent);
            if (currentDayCount == cellDay.textContent && checkDate.getMonth() == currentMonth && checkDate.getFullYear() == currentYear) {
                cell.classList.add('current-day');
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
            let weekLegend = element.querySelector('.weekdays__item-legend');
            weekLegend.classList.remove('current');
            if (currentDay == weekLegend.getAttribute('id') && selectedMonthData == currentMonth && selectedYearField.textContent == currentYear) {
                weekLegend.classList.add('current');
            }
        });

        drawScheduleItems();
        drawSideScheduleItems();
    }

    drawDates(newSelectedDate);

    // проерка ячейки текущего дня
    const setCheckedSelectedCell = () => {
        let inputSelectedDate = document.querySelector('.calendar__menu-input-calendar');
        let arr = inputSelectedDate.value.split(/[- . :]/);
        let date = new Date(arr[2], arr[1] - 1, arr[0]);
        let selectedTargetMonth = date.getMonth() + 1;
        let selectedTargetYear = date.getFullYear();
        let selectedTargetDay = date.getDate();
        let monthCellDateArr = document.querySelectorAll('.month-grid__cell-date-data');

        monthCellDateArr.forEach(item => {
            let parent = item.closest('.month-grid__day-cell');
            let monthCellDay = parent.querySelector('.month-grid__cell-day-number');
            if (selectedTargetMonth == (new Date(item.textContent).getMonth() + 1) && selectedTargetYear === (new Date(item.textContent).getFullYear()) && selectedTargetDay === (new Date(item.textContent).getDate())) {
                parent.classList.add('selected-day');
                monthCellDay.classList.add('selected-day');
            };
        });
    };

    prevMonthButton.addEventListener('click', function () {
        calendarMain = document.querySelector('.main-calendar');
        let weekCalendar = document.querySelector('.week-calendar');
        if (calendarMain.classList.contains('active')) {
            setPrevMonth(newSelectedDate);
            drawDates(newSelectedDate);
            setCheckedSelectedCell();
            // анимация нового месяца
            calendarMain.classList.add('hidden');
            calendarMain.classList.add('move-right');
            setTimeout(() => {
                calendarMain.classList.remove('move-right');
            }, 100);
            setTimeout(() => {
                calendarMain.classList.remove('hidden');
            }, 200);
        }
        if (weekCalendar.classList.contains('active')) {
        }
    });

    nextMonthButton.addEventListener('click', function () {
        calendarMain = document.querySelector('.main-calendar');
        let weekCalendar = document.querySelector('.week-calendar');
        if (calendarMain.classList.contains('active')) {
            setNextMonth(newSelectedDate);
            drawDates(newSelectedDate);
            setCheckedSelectedCell();
            // анимация нового месяца
            calendarMain.classList.add('hidden');
            calendarMain.classList.add('move-left');
            setTimeout(() => {
                calendarMain.classList.remove('move-left');
            }, 100);
            setTimeout(() => {
                calendarMain.classList.remove('hidden');
            }, 200);
        }
        if (weekCalendar.classList.contains('active')) {
        }
    })
    buttonSetCurrentDate.addEventListener('click', function () {
        monthCellArr.forEach(cell => {
            cell.classList.remove('selected-day');
        });
        monthCellDayArr.forEach(item => {
            item.classList.remove('selected-day');
        });
        inputSelectedDate.value = startInputDate;
        newSelectedDate = currentDate;
        drawDates(newSelectedDate);
        drawSideScheduleItems();
        setSideDate(inputSelectedDate.value);
    })

    // 
    // выбор задачи
    function openGridMenu(modalWindow) {
        let html = document.querySelector('html'),
            body = document.querySelector('body'),
            background = document.querySelector('.overlay');
        // заблокировать скролл
        let disableScroll = function () {
            html.style.height = 'calc(100vh - 1px)';
            body.style.height = 'calc(100vh - 1px)';
            body.style.width = 'calc(100vw)';
            body.style.position = 'fixed';
            body.style.overflow = 'hidden';
            if (lWidth < 1140) {
            }
        }
        // разблокировать скролл
        let enableScroll = function () {
            html.style.height = 'auto';
            body.style.height = 'auto';
            body.style.overflow = 'hidden auto';
            body.style.position = 'static';
        }
        // открытие модального окна
        const openModal = () => {
            scrollY = window.scrollY;
            body.style.top = `-${scrollY}px`;
            body.style.height = `calc(${scrollY}px - 1px + 100vh)`;
            background.classList.add('overlay--active');
            modalWindow.classList.add('active');
            disableScroll();
        }
        // закрытие модального окна
        const closeModal = () => {
            buttonGridoptions.classList.remove('active');
            modalWindow.classList.remove('active');
            background.classList.remove('overlay--active');
            gridControlButtonArr.forEach(item => {
                item.onclick = '';
            });
            setTimeout(() => {
                enableScroll();
                body.style.top = `0px`;
                window.scrollTo(0, scrollY);
            }, 200);
        }
        const onKeydown = (evt) => {
            if (isEscapeKey(evt)) {
                closeModal();
            }
        };
        const startModal = () => {
            buttonGridoptions.classList.add('active');
            openModal();
            // Закрытие окна 
            // нажатие на фон
            background.addEventListener('click', (e) => {
                if (e.target == background) {
                    closeModal();
                }
            }, { once: true });

            document.addEventListener('keydown', onKeydown, { once: true });
            gridControlButtonArr.forEach(item => {
                item.onclick = () => {
                    closeModal();
                };
            });
        }
        startModal();
    };

    buttonGridoptions.addEventListener('click', function () {
        openGridMenu(gridOptionsList);
    })

    const setGridOptButton = () => {
        gridControlButtonArr.forEach(button => {
            if (button.classList.contains('active')) {
                buttonGridoptions.textContent = button.textContent;
            }
        });
    }
    setGridOptButton();
    function showGridSections(gridTrigger) {
        gridControlButtonArr.forEach(function (button) {
            const idElement = button.id;
            const block = document.querySelector(`.${idElement}`);

            if (gridTrigger !== button) {
                button.classList.remove('active');
                block.classList.add('disabled');
                block.classList.remove('active');
            } else {
                button.classList.add('active');
                buttonGridoptions.textContent = button.textContent;
                block.classList.remove('disabled');
                block.classList.add('active');
            }
        });
        gridOptionsList.classList.remove('active');
        buttonGridoptions.classList.remove('active');
        // смена заголовка 
        dayCalendar = document.querySelector('.day-calendar');
        if (dayCalendar.classList.contains('active')) {
            calendarTitle.classList.remove('active');
            calendarDayTitle.classList.add('active');
            // остается выбранная дата
        } else {
            calendarTitle.classList.add('active');
            calendarDayTitle.classList.remove('active');
        }

        // сброс на текущую дату при пеерключении календаря (кроме дневного)
        if (dayCalendar.classList.contains('active')) {
            // остается выбранная дата
        } else {
            buttonSetCurrentDate.dispatchEvent(evtClick);
        }
    };


    calendarOptionsButton.addEventListener('click', function () {
        if (calendarOptionWrapper.classList.contains('active')) {
            calendarOptionWrapper.classList.remove('active');
            calendarOverlay.classList.remove('active');
        } else {
            calendarOptionWrapper.classList.add('active');
            calendarOverlay.classList.add('active');
        }
        calendarOverlay.addEventListener('click', function () {
            calendarOverlay.classList.remove('active');
            calendarOptionWrapper.classList.remove('active');
            sideSection.classList.remove('active-options');

            workingTimeListArr.forEach(element => {
                element.classList.remove('active');
            });
        })
        calendarOptionsButtonClose.addEventListener('click', function () {
            calendarOverlay.classList.remove('active');
            calendarOptionWrapper.classList.remove('active');
            sideSection.classList.remove('active-options');
            workingTimeListArr.forEach(element => {
                element.classList.remove('active');
            });
        })
        if (calendarOptionWrapper.classList.contains('active')) {
            sideSection.classList.add('active-options');
            calendarOverlay.classList.add('active');
        } else {
            sideSection.classList.remove('active-options');
            calendarOverlay.classList.remove('active');
        }
    })


    gridControlButtonArr.forEach(function (button) {
        button.addEventListener('click', () => showGridSections(button))
    });

    const hideWeekdays = () => {
        weekTitleList.classList.toggle('weekdays-hidden');
        monthDayGrid.classList.toggle('weekdays-hidden');
        buttonHideWeekdays.classList.toggle('active');
    };

    buttonHideWeekdays.addEventListener('click', function () {
        hideWeekdays();
    });

    buttonShowSpecialDates.addEventListener('click', function () {
        buttonShowSpecialDates.classList.toggle('active');
        drawDates(newSelectedDate);
    });

    buttonHideSideMenu.addEventListener('click', function () {
        buttonHideSideMenu.classList.toggle('minimized');
        sideSection.classList.toggle('minimized');
        calendarMini.classList.toggle('minimized');
        sideScheduleSection.classList.toggle('minimized');
        newTaskPopupButtonOpenPopup.classList.toggle('minimized');

        if (newTaskPopupButtonOpenPopup.classList.contains('minimized')) {
            newTaskPopupButtonOpenPopup.textContent = "+";
        } else {
            newTaskPopupButtonOpenPopup.textContent = "+ Новое событие";
        }
    });

    fullScreenToggleButton.addEventListener('click', function () {
        calendarContent.classList.toggle('fullscreen-active');
        fullScreenToggleButton.classList.toggle('fullscreen-active');
        if (calendarContent.classList.contains('fullscreen-active')) {
            profileSideleftMenu.classList.add('fullscreen-active');
        } else {
            profileSideleftMenu.classList.remove('fullscreen-active');
        }
    })

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
        monthCellDateArr.forEach(item => {
            let parent = item.closest('.month-grid__day-cell');
            let monthCellDay = parent.querySelector('.month-grid__cell-day-number');
            if (selectedTargetMonth == (new Date(item.textContent).getMonth() + 1) && selectedTargetYear === (new Date(item.textContent).getFullYear()) && selectedTargetDay === (new Date(item.textContent).getDate())) {
                monthCellDay.classList.add('selected-day');
                parent.classList.add('selected-day');
            }
        });
        drawSideScheduleItems();
        setCheckedSelectedCell();
        setSideDate(inputSelectedDate.value);
    }
    // ФИЛЬТРАЦИЯ
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
    });

    // всплывающие окна 
    const overlay = document.querySelector('.overlay');
    // вспомогательные функциии попапа выбора задачи
    const isEscapeKey = (evt) => evt.key === 'Escape';

    let lWidth = document.querySelector('html').clientWidth;
    let scrollY;
    // переменные активация опции задачи
    const taskOptionsPopup = document.querySelector('.task-options');
    const taskOptionsPopupInner = document.querySelector('.task-options__inner');
    const taskOptionsPopupInnerClass = '.task-options__inner';
    const taskOptionsPopupSwipeClose = document.querySelector('.task-options__swipe-close');
    const taskOptionsPopupButtonClose = document.querySelectorAll('.task-options__modal-close');
    const taskOptionsPopupButtonGoback = document.querySelector('.task-options__button-gaback');
    const taskOptionsPopupChangeBtn = document.querySelector('.task-options__button--change');
    const taskOptionsPopupRemindBtn = document.querySelector('.task-options__button--remind');
    // переменные выборы задачи
    let taskSelectorPopup = document.querySelector('.task-selector');
    const taskSelectorButtonClose = document.querySelectorAll('.task-selector__modal-close');
    const taskSelectorPopupInner = document.querySelector('.task-selector__inner');
    const taskSelectorPopupInnerClass = '.task-selector__inner';
    const taskSelectorPopupSwipeClose = document.querySelector('.task-selector__swipe-close');
    let taskSelectortaskList = document.querySelector('.task-selector__task-list');
    // функции оции задачи
    function openTaskOptions(modalWindow, modalInner, modalInnerClass, closeSwipeBtn, closeBtn, changeBtn, remindBtn, gobackBtn) {
        let html = document.querySelector('html'),
            body = document.querySelector('body'),
            background = document.querySelector('.overlay');
        // заблокировать скролл
        let disableScroll = function () {
            html.style.height = 'calc(100vh - 1px)';
            body.style.height = 'calc(100vh - 1px)';
            body.style.width = 'calc(100vw)';
            body.style.position = 'fixed';
            body.style.overflow = 'hidden';
            if (lWidth < 1140) {
            }
        }
        // разблокировать скролл
        let enableScroll = function () {
            html.style.height = 'auto';
            body.style.height = 'auto';
            body.style.overflow = 'hidden auto';
            body.style.position = 'static';
        }
        // открытие модального окна
        const openModal = () => {
            scrollY = window.scrollY;
            body.style.top = `-${scrollY}px`;
            body.style.height = `calc(${scrollY}px - 1px + 100vh)`;
            background.classList.add('overlay--active');
            modalWindow.classList.add('active');
            disableScroll();
        }
        // закрытие модального окна
        const closeModal = () => {
            modalWindow.classList.remove('active');
            modalWindow.classList.remove('task-selector-active');
            background.classList.remove('overlay--active');
            modalWindow.removeEventListener('swiped-down', closeModalOnInnerSwipe);
            closeSwipeBtn.removeEventListener('swiped-down', closeModal);
            closeSwipeBtn.removeEventListener('click', closeModal);
            gobackBtn.removeEventListener('click', closeModal, { once: true });
            closeBtn.forEach(element => {
                element.removeEventListener('click', closeModal, { once: true });
            });
            changeBtn.removeEventListener('click', closeModal, { once: true });
            remindBtn.removeEventListener('click', closeModal, { once: true });
            setTimeout(() => {
                enableScroll();
                body.style.top = `0px`;
                window.scrollTo(0, scrollY);
            }, 200);
        };
        const goback = () => {
            closeModal();
            scrollY = window.scrollY;
            body.style.top = `-${scrollY}px`;
            body.style.height = `calc(${scrollY}px - 1px + 100vh)`;
            background.classList.add('overlay--active');
        }
        const closeModalOnInnerSwipe = (e) => {
            let target = e.target
            if (target.closest(modalInnerClass) && modalWindow.offsetHeight < modalInner.scrollHeight) {
                e.stopPropagation();
            } else {
                closeModal();
            }
        }
        const onKeydown = (evt) => {
            if (isEscapeKey(evt)) {
                closeModal();
            }
        };
        const startModal = () => {
            if (taskSelectorPopup.classList.contains('active')) {
                console.log('попап активен');
                modalWindow.classList.add('task-selector-active');
            }
            openModal();
            // Закрытие окна 
            // нажатие на фон
            background.addEventListener('click', (e) => {
                if (e.target == background) {
                    closeModal();
                }
            }, { once: true });
            // скролл по модальному окну
            modalWindow.addEventListener('swiped-down', closeModalOnInnerSwipe, { once: true });
            // скролл по зоне закрытия модального окна
            closeSwipeBtn.addEventListener('swiped-down', closeModal, { once: true });
            // нажатие на зону закрытия модального окна
            closeSwipeBtn.addEventListener('click', closeModal, { once: true });
            closeBtn.forEach(element => {
                element.addEventListener('click', closeModal, { once: true });
            });
            gobackBtn.addEventListener('click', goback, { once: true });
            document.addEventListener('keydown', onKeydown, { once: true });
            // управление опциями попапа
            changeBtn.addEventListener('click', closeModal, { once: true });  // вставить свою функцию
            remindBtn.addEventListener('click', closeModal, { once: true }); // вставить свою функцию
        }
        startModal();
    };
    // контент опции задачи
    const taskOptionsContentType = document.querySelector('.task-options__type-title');
    const taskOptionsContentTimePeriod = document.querySelector('.task-options__time-period');
    const taskOptionsContentVacancy = document.querySelector('.task-options__vacancy-title');
    const taskOptionsContentResume = document.querySelector('.task-options__resume-title');
    // Заполнение контента попапа опции задачи
    const drawTaskOptionsContent = (item) => {
        let searchId = item.getAttribute('id');
        let checkIndex = NEWdataForCellArr.findIndex(el => el.taskId === searchId);
        let arr = NEWdataForCellArr[checkIndex].date.split(/[- . :]/);
        taskOptionsContentTimePeriod.textContent = String(`${Number(arr[0])} ${SIDE_MONTH_NAME[Number(arr[1] - 1)]} с ${NEWdataForCellArr[checkIndex].startTime} — ${NEWdataForCellArr[checkIndex].endTime}`);
        taskOptionsContentType.textContent = NEWdataForCellArr[checkIndex].typeTitle;
        taskOptionsContentVacancy.textContent = NEWdataForCellArr[checkIndex].title;
        taskOptionsContentResume.textContent = NEWdataForCellArr[checkIndex].title;
    };
    // функции открытие попапа выбора задач
    function activatTaskSelectorModal(modalWindow, modalInner, modalInnerClass, closeSwipeBtn, closeBtn) {
        let selectableItems = taskSelectortaskList.querySelectorAll('.schedule-item');
        let html = document.querySelector('html'),
            body = document.querySelector('body'),
            background = document.querySelector('.overlay');
        // заблокировать скролл
        let disableScroll = function () {
            html.style.height = 'calc(100vh - 1px)';
            body.style.height = 'calc(100vh - 1px)';
            body.style.width = 'calc(100vw)';
            body.style.position = 'fixed';
            body.style.overflow = 'hidden';
            if (lWidth < 1140) {
            }
        }
        // разблокировать скролл
        let enableScroll = function () {
            html.style.height = 'auto';
            body.style.height = 'auto';
            body.style.overflow = 'hidden auto';
            body.style.position = 'static';
        }
        // открытие модального окна
        const openModal = () => {
            scrollY = window.scrollY;
            body.style.top = `-${scrollY}px`;
            body.style.height = `calc(${scrollY}px - 1px + 100vh)`;
            background.classList.add('overlay--active');
            modalWindow.classList.add('active');
            disableScroll();
        }
        // закрытие модального окна
        const closeModal = () => {
            modalWindow.classList.remove('active');
            modalWindow.classList.remove('active-hidden');
            taskOptionsPopupButtonClose.forEach(element => {
                element.removeEventListener('click', closeModal);
            });
            taskOptionsPopupButtonGoback.removeEventListener('click', openAgain);
            background.classList.remove('overlay--active');
            closeBtn.forEach(element => {
                element.removeEventListener('click', closeModal, { once: true });
            });
            modalWindow.removeEventListener('swiped-down', closeModalOnInnerSwipe);
            closeSwipeBtn.removeEventListener('swiped-down', closeModal);
            closeSwipeBtn.removeEventListener('click', closeModal);
            selectableItems.forEach(item => {
                item.onclick = '';
            });
            setTimeout(() => {
                enableScroll();
                body.style.top = `0px`;
                window.scrollTo(0, scrollY);
            }, 200);
        }
        const nextStep = () => {
            modalWindow.classList.add('active-hidden');
        };
        const openAgain = () => {
            background.classList.add('overlay--active');
            modalWindow.classList.remove('active-hidden');
        };
        const closeModalOnInnerSwipe = (e) => {
            let target = e.target
            if (target.closest(modalInnerClass) && modalWindow.offsetHeight < modalInner.scrollHeight) {
                e.stopPropagation();
            } else {
                closeModal();
            }
        };
        const onKeydown = (evt) => {
            if (isEscapeKey(evt)) {
                closeModal();
            }
        };
        const startModal = () => {
            openModal();
            // Закрытие окна 
            // нажатие на фон
            background.addEventListener('click', (e) => {
                if (e.target == background) {
                    closeModal();
                }
            });
            // скролл по модальному окну
            modalWindow.addEventListener('swiped-down', closeModalOnInnerSwipe);
            // скролл по зоне закрытия модального окна
            closeSwipeBtn.addEventListener('swiped-down', closeModal);
            // нажатие на зону закрытия модального окна
            closeSwipeBtn.addEventListener('click', closeModal);
            document.addEventListener('keydown', onKeydown);
            // cancelBtn.forEach(element => {
            //     element.addEventListener('click', closeModal, { once: true });
            // });
            closeBtn.forEach(element => {
                element.addEventListener('click', closeModal);
            });
            taskOptionsPopupButtonClose.forEach(element => {
                element.addEventListener('click', closeModal);
            });
            taskOptionsPopupButtonGoback.addEventListener('click', openAgain);
            selectableItems.forEach(item => {
                item.onclick = () => {
                    nextStep();
                    drawTaskOptionsContent(item);
                    openTaskOptions(taskOptionsPopup, taskOptionsPopupInner, taskOptionsPopupInnerClass, taskOptionsPopupSwipeClose, taskOptionsPopupButtonClose, taskOptionsPopupChangeBtn, taskOptionsPopupRemindBtn, taskOptionsPopupButtonGoback)
                    console.log('клик по задаче из меню');
                };
            });
        }
        // вставить прокладку тут
        startModal();
    };
    // проверки и отрисовки дополнительных действий
    // отрисовка выбранного дня
    monthCellArr.forEach(cell => {
        cell.addEventListener('click', function (e) {
            let cellTaskItemArr = cell.querySelectorAll('.cell-schedule__item');
            let cellTaskItem = cell.querySelector('.cell-schedule__item');
            let monthCellArr = document.querySelectorAll('.month-grid__day-cell');
            let monthCellDayArr = document.querySelectorAll('.month-grid__cell-day-number');
            monthCellArr.forEach(cell => {
                cell.classList.remove('selected-day');
            });
            monthCellDayArr.forEach(item => {
                item.classList.remove('selected-day');
            });
            cellAction(e);
            //
            let target = e.target;
            let parentItemTarget = target.closest('.schedule-item');
            if (parentItemTarget) {
                if (parentItemTarget.classList.contains('schedule-item')) {
                    let parentlist = parentItemTarget.closest('.cell-schedule__list');
                    let itemCounterArr = parentlist.querySelectorAll('.schedule-item');
                    let parentCell = parentItemTarget.closest('.month-grid__day-cell');
                    // отрисовка меню списка задач
                    // 2 и меньше задач - запус опции единственной задачи
                    if (itemCounterArr.length <= 2) {
                        let tasklistDataArr = [];
                        let searchId = parentItemTarget.getAttribute('id');
                        let checkIndex = NEWdataForCellArr.findIndex(el => el.taskId === searchId);
                        tasklistDataArr.push(NEWdataForCellArr[checkIndex]);
                        drawTaskOptionsContent(parentItemTarget);
                        openTaskOptions(taskOptionsPopup, taskOptionsPopupInner, taskOptionsPopupInnerClass, taskOptionsPopupSwipeClose, taskOptionsPopupButtonClose, taskOptionsPopupChangeBtn, taskOptionsPopupRemindBtn, taskOptionsPopupButtonGoback);
                    }
                    if (itemCounterArr.length > 2) {
                        taskSelectortaskList.innerHTML = '';
                        let cellScheduleList = parentCell.querySelector('.cell-schedule__list');
                        let sideScheduleList = sideSection.querySelector('.side-schedule__list');
                        e.preventDefault();
                        // taskSelectorPopup.style.display = 'block';
                        // taskSelectorPopup.style.left = e.pageX + 30 + 'px';
                        // taskSelectorPopup.style.top = e.pageY + 'px';
                        if (cellScheduleList) {
                            taskSelectorPopup.classList.remove('task-selector--2-column');
                            taskSelectorPopup.classList.remove('task-selector--3-column');
                            let cellScheduleListClone = sideScheduleList.cloneNode(true)
                            taskSelectortaskList.append(cellScheduleListClone);
                            if (itemCounterArr.length >= 8) {
                                taskSelectorPopup.classList.add('task-selector--2-column');
                            }
                            if (itemCounterArr.length >= 10) {
                                taskSelectorPopup.classList.add('task-selector--3-column');
                            }
                            activatTaskSelectorModal(taskSelectorPopup, taskSelectorPopupInner, taskSelectorPopupInnerClass, taskSelectorPopupSwipeClose, taskSelectorButtonClose);
                        }
                        taskSelectorPopup = document.querySelector('.task-selector');
                        if (lWidth > 768) {
                            taskSelectorPopup.style.left = String(`calc(50% - ${taskSelectorPopup.clientWidth}px / 2 + 0px)`);
                            taskSelectorPopup.style.top = String(`calc(50% - ${taskSelectorPopup.clientHeight}px / 2 + 0px)`);
                        }
                    }
                    itemCounterArr.forEach(cellItem => {
                        cellItem.addEventListener('click', function (e) {
                        });
                    });
                };
            };
        });
    });
});
