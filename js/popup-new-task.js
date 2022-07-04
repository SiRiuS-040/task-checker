import { SCHEDULE__DATA } from './data.js';

// тестовый попап создания задания

let calendarWrapper = document.querySelector('.calendar');
const buttonSetCurrentDate = calendarWrapper.querySelector('.calendar__control--set-current-date');
const overlay = document.querySelector('.overlay');
const newTaskPopup = document.querySelector('.new-schedule-popup');
const newTaskPopupInner = document.querySelector('.new-schedule__inner');
const newTaskPopupInnerClass = '.new-schedule__inner';
const newTaskPopupSwipeClose = document.querySelector('.new-schedule__swipe-close');
const newTaskPopupModalClose = document.querySelectorAll('.new-schedule__modal-close');

let newTaskPopupButtonOpenPopup = document.querySelector('.content-header__button--add-new-task');
let newTaskPopupButtonCancel = document.querySelectorAll('.new-schedule__button-cancel');
let newTaskInputId = document.querySelector('.new-schedule__input--task-id');
let newTaskInputTitle = document.querySelector('.new-schedule__input--title');
let newTaskInputType = document.querySelector('.new-schedule__select-data--type-data');
let newTaskSelectType = document.querySelector('.new-schedule__type-select');
let newTaskSelectTypeOption = document.querySelectorAll('.new-schedule__type-option');
let newTaskInputDate = document.querySelector('.new-schedule__input--date');
let newTaskInputStartTime = document.querySelector('.new-schedule__input--start-time');
let newTaskInputEndTime = document.querySelector('.new-schedule__input--end-time');
let typeTitle;

newTaskInputDate.addEventListener('change', function () {
    let dateArr = newTaskInputDate.value.split(/[-]/)
    newTaskInputDate.textContent = String(`${dateArr[2]}.${dateArr[1]}.${dateArr[0]}`)
});

let newArrTaskData = SCHEDULE__DATA;
let newtaskButton = document.querySelector('.new-schedule__button-create');

const clearInputs = () => {
    newTaskInputId.value = '';
    newTaskInputTitle.value = '';
    newTaskInputDate.textContent = '';
    newTaskInputStartTime.value = '';
    newTaskInputEndTime.value = '';

};

newTaskInputStartTime.addEventListener('change', function () {
    newTaskInputStartTime.value = newTaskInputStartTime.value.replace(/[^\d]/g, '').replace(/\B(?=(?:\d{2})+(?!\d))/g, ':');
    let checkTime = newTaskInputStartTime.value.split(/[:]/);
    if (checkTime[0] > 23) {
        checkTime[0] = 23;
    }
    if (checkTime[1] >= 60) {
        checkTime[1] = 45;
    }
    if (checkTime[1] % 15 == 0) {
        console.log('число кратно 15');
    } else {
        checkTime[1] = Math.round(checkTime[1] / 15) * 15;
        console.log(checkTime[1]);
    }

    if (checkTime[1] == 0) {
        checkTime[1] = '00';
    }

    if (checkTime[1] >= 60) {
        checkTime[1] = 45;
    }

    newTaskInputStartTime.value = String(`${checkTime[0]}:${checkTime[1]}`)
});

newTaskInputEndTime.addEventListener('input', function () {
    newTaskInputEndTime.value = newTaskInputEndTime.value.replace(/[^\d]/g, '').replace(/\B(?=(?:\d{2})+(?!\d))/g, ':');
});

newTaskInputEndTime.addEventListener('change', function () {
    newTaskInputEndTime.value = newTaskInputEndTime.value.replace(/[^\d]/g, '').replace(/\B(?=(?:\d{2})+(?!\d))/g, ':');
    let checkTime = newTaskInputEndTime.value.split(/[:]/);
    if (checkTime[0] > 23) {
        checkTime[0] = 23;
    }
    if (checkTime[1] >= 60) {
        checkTime[1] = 45;
    }
    if (checkTime[1] % 15 == 0) {
        console.log('число кратно 15');
    } else {
        checkTime[1] = Math.round(checkTime[1] / 15) * 15;
        console.log(checkTime[1]);
    }
    if (checkTime[1] == 0) {
        checkTime[1] = '00';
    }
    if (checkTime[1] >= 60) {
        checkTime[1] = 45;
    }
    newTaskInputEndTime.value = String(`${checkTime[0]}:${checkTime[1]}`);
});

// Выпадающин списки 
let typeSelectorButtonArr = document.querySelectorAll('.new-schedule__select-data');
let setSelectedItem = (label) => {
    let parent = label.closest('.new-schedule__selector-wrapper');
    let parentlist = parent.querySelector('.new-schedule__select-list')
    let labelDataField = label.querySelector('.new-schedule__type-data');
    let labelInput = label.querySelector('.new-schedule__type-radio-input');
    let selectorDataField = parent.querySelector('.new-schedule__select-data');
    selectorDataField.textContent = labelDataField.textContent;
    let typeAttr = labelInput.getAttribute('taskType');
    selectorDataField.setAttribute('taskType', typeAttr)
    parentlist.classList.remove('active');
};

let openCloseMenu = (button) => {
    let newTaskOptionsListArr = document.querySelectorAll('.new-schedule__select-list');
    let targetParent = button.closest('.new-schedule__selector-wrapper');
    let targetList = targetParent.querySelector('.new-schedule__select-list');
    targetList.classList.toggle('active');

    newTaskOptionsListArr.forEach(list => {
        if (list != targetList) {
            list.classList.remove('active');
        };
    });

    let selectorDataArr = targetParent.querySelectorAll('.new-schedule__type-option');
    selectorDataArr.forEach(selector => {

        selector.onchange = () => {
            setSelectedItem(selector);
        };
    });
};

typeSelectorButtonArr.forEach(button => {
    button.addEventListener('click', function () {
        openCloseMenu(button);
    })
});
// выбор задачи
// вспомогательные функциии попапа
const isEscapeKey = (evt) => evt.key === 'Escape';
const lWidth = document.querySelector('html').clientWidth;
let scrollY;

function openNewTaskPopup(modalWindow, modalInner, modalInnerClass, closeSwipeBtn, closeBtn, cancelBtn, createBtn) {
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
        background.classList.remove('overlay--active');
        // closeBtn.forEach(element => {
        //     element.removeEventListener('click', closeModal, { once: true });
        // });
        cancelBtn.forEach(element => {
            element.removeEventListener('click', closeModal, { once: true });
        });
        modalWindow.removeEventListener('swiped-down', closeModalOnInnerSwipe);
        closeSwipeBtn.removeEventListener('swiped-down', closeModal);
        closeSwipeBtn.removeEventListener('click', closeModal);
        //  nextBtn.removeEventListener('click', closeModal);
        setTimeout(() => {
            enableScroll();
            body.style.top = `0px`;
            window.scrollTo(0, scrollY);
        }, 200);
    };

    let getSetTaskData = () => {
        let newTaskTestItem = {};
        newTaskTestItem.taskId = newTaskInputId.value;
        newTaskTestItem.title = newTaskInputTitle.value;
        newTaskTestItem.type = newTaskInputType.getAttribute('taskType');
        newTaskTestItem.typeTitle = newTaskInputType.textContent;
        newTaskTestItem.date = newTaskInputDate.textContent;
        newTaskTestItem.startTime = newTaskInputStartTime.value;
        newTaskTestItem.endTime = newTaskInputEndTime.value;
        newArrTaskData.push(newTaskTestItem);
        clearInputs();
        closeModal();
        buttonSetCurrentDate.click();
    };

    const nextStep = () => {
        modalWindow.classList.remove('active');
        nextBtn.removeEventListener('click', closeModal);
        modalWindow.removeEventListener('swiped-down', closeModalOnInnerSwipe);
        closeSwipeBtn.removeEventListener('swiped-down', closeModal);
        closeSwipeBtn.removeEventListener('click', closeModal);
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
        cancelBtn.forEach(element => {
            element.addEventListener('click', closeModal, { once: true });
        });
        closeBtn.forEach(element => {
            element.addEventListener('click', closeModal, { once: true });
        });
        createBtn.addEventListener('click', getSetTaskData, { once: true });
    };
    startModal();
};

newTaskPopupButtonOpenPopup.addEventListener('click', function () {
    openNewTaskPopup(newTaskPopup, newTaskPopupInner, newTaskPopupInnerClass, newTaskPopupSwipeClose, newTaskPopupModalClose, newTaskPopupButtonCancel, newtaskButton)
});

newTaskInputStartTime.addEventListener('input', function () {
    newTaskInputStartTime.value = newTaskInputStartTime.value.replace(/[^\d]/g, '').replace(/\B(?=(?:\d{2})+(?!\d))/g, ':');
});