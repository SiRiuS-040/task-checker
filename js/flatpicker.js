// миникалендарь 


let startFullDate = 0;
let DAYS_OFF_SET = 1; // Перенос на дней включая текущий

// создание календаря
function createCalendar(modeValue, datePeriod) {
    flatpickr.localize(flatpickr.l10ns.ru);
    flatpickr(".calendar__test-picker", {
        inline: true,
        mode: modeValue,
        minDate: "2020-01",
        // maxDate: getEndDate(), // 3 days from now
        altInput: true,
        altFormat: "d.m.Y",
        dateFormat: "d.m.Y",
        monthSelectorType: "static",
        showMonths: 1,
        defaultDate: datePeriod,
        "locale": {
            "firstDayOfWeek": 1 // start week on Monday
        }
    });
};

createCalendar("single", [null]);
