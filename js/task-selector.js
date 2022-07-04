import { SCHEDULE__DATA } from './data.js';
import { SIDE_MONTH_NAME } from './calendar-options.js';

var NEWdataForCellArr = SCHEDULE__DATA;

// переменные активация опции задачи
// всплывающие окна 

const overlay = document.querySelector('.overlay');
// вспомогательные функциии попапа
const isEscapeKey = (evt) => evt.key === 'Escape';
const lWidth = document.querySelector('html').clientWidth;
let scrollY;
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

const drawTaskOptionsContent = (item) => {
    let searchId = item.getAttribute('id');
    let checkIndex = NEWdataForCellArr.findIndex(el => el.taskId === searchId);
    let arr = NEWdataForCellArr[checkIndex].date.split(/[- . :]/);
    taskOptionsContentTimePeriod.textContent = String(`${Number(arr[0])} ${SIDE_MONTH_NAME[Number(arr[1] - 1)]} с ${NEWdataForCellArr[checkIndex].startTime} — ${NEWdataForCellArr[checkIndex].endTime}`);
    taskOptionsContentType.textContent = NEWdataForCellArr[checkIndex].typeTitle;
    taskOptionsContentVacancy.textContent = NEWdataForCellArr[checkIndex].title;
    taskOptionsContentResume.textContent = NEWdataForCellArr[checkIndex].title;
};
// функции выбора задачи
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
        background.classList.remove('overlay--active');
        closeBtn.forEach(element => {
            element.removeEventListener('click', closeModal, { once: true });
        });
        modalWindow.removeEventListener('swiped-down', closeModalOnInnerSwipe);
        closeSwipeBtn.removeEventListener('swiped-down', closeModal);
        closeSwipeBtn.removeEventListener('click', closeModal);
        //  nextBtn.removeEventListener('click', closeModal);
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
            // closeModal();
        }
    }
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
        }, { once: true });
        // скролл по модальному окну
        modalWindow.addEventListener('swiped-down', closeModalOnInnerSwipe, { once: true });
        // скролл по зоне закрытия модального окна
        closeSwipeBtn.addEventListener('swiped-down', closeModal, { once: true });
        // нажатие на зону закрытия модального окна
        closeSwipeBtn.addEventListener('click', closeModal, { once: true });
        document.addEventListener('keydown', onKeydown, { once: true });
        // cancelBtn.forEach(element => {
        //     element.addEventListener('click', closeModal, { once: true });
        // });
        closeBtn.forEach(element => {
            element.addEventListener('click', closeModal, { once: true });
        });
        taskOptionsPopupButtonClose.forEach(element => {
            element.addEventListener('click', closeModal);
        });
        taskOptionsPopupButtonGoback.addEventListener('click', openAgain);
        selectableItems.forEach(item => {
            item.onclick = () => {
                nextStep();
                drawTaskOptionsContent(item);
                openTaskOptions(taskOptionsPopup, taskOptionsPopupInner, taskOptionsPopupInnerClass, taskOptionsPopupSwipeClose, taskOptionsPopupButtonClose, taskOptionsPopupChangeBtn, taskOptionsPopupRemindBtn, taskOptionsPopupButtonGoback);
            };
        });
    }
    startModal();
};

export { activatTaskSelectorModal }