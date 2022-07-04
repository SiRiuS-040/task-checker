import './menu-switchers.js';
import './calendar.js';
import './calendar-week.js';
import './calendar-day.js';
import './calendar-mini.js';
import './data.js';
import './popup-new-task.js';
import './profile-hider.js';
import './task-selector.js';
// раздел все события
import './all-tasks.js';
// import './test-data.js';
import './cookiemonster.js';

// Header autohide
var doc = document.documentElement;
var w = window;
var prevScroll = w.scrollY || doc.scrollTop;
var curScroll;
var direction = 0;
var prevDirection = 0;
var header = document.querySelector('.fake-header');

var checkScroll = function () {
    curScroll = w.scrollY || doc.scrollTop;
    if (curScroll > prevScroll) {
        //scrolled up
        direction = 2;
    } else if (curScroll < prevScroll) {
        //scrolled down
        direction = 1;
    }

    if (direction !== prevDirection) {
        toggleHeader(direction, curScroll);
    }

    prevScroll = curScroll;
};

var toggleHeader = function (direction, curScroll) {
    if (direction === 2 && curScroll > 55) {
        //replace 52 with the height of your header in px
        header.classList.add('hide');
        $('.search__header').addClass('active')
        prevDirection = direction;
    } else if (direction === 1) {
        header.classList.remove('hide');
        $('.search__header').removeClass('active')
        prevDirection = direction;
    }
};

window.addEventListener('scroll', checkScroll);

