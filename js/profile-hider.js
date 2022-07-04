let calendarContent = document.querySelector('.calendar-content');
let profileSideleftMenu = document.querySelector('.employer-profile');
let profileMenuButtonHide = document.querySelector('.employer-profile__button-hide');
profileMenuButtonHide.addEventListener('click', function () {
    profileSideleftMenu.classList.toggle('side-menu-full');
    calendarContent.classList.toggle('side-menu-full');
})