// Главное меню
const pageNavLinks = document.querySelectorAll('.navigation__nav-button');
// анимация главного меню
const navButtons = document.querySelectorAll('.navigation__nav-button');
const navButtonsActive = document.querySelector('.navigation__nav-button--active');
const navButtonSlider = document.querySelector('.navigation__nav-slider');

function showPaidServicesSection(link) {
    pageNavLinks.forEach(function (pageNavLink) {
        const idElement = pageNavLink.id;
        const block = document.querySelector(`.${idElement}`);

        if (link !== pageNavLink) {
            pageNavLink.classList.remove('navigation__nav-button--active');
            block.classList.add('disabled');
        } else {
            pageNavLink.classList.add('navigation__nav-button--active');
            block.classList.remove('disabled');
        }
    })
}
pageNavLinks.forEach(function (pageNavLink) {
    pageNavLink.addEventListener('click', () => showPaidServicesSection(pageNavLink))
});

// анимация главного меню
//передвижение фона 
navButtonSlider.style.width = `${navButtons[0].offsetWidth - 4}px`;
navButtons.forEach(function (navButton) {
    navButton.addEventListener('click', () => {
        navButtonSlider.style.width = `${navButton.offsetWidth - 4}px`;
        navButtonSlider.style.left = `${navButton.offsetLeft + 2}px`;
        navButtonSlider.style.transition = '0.5s all';

    })
})

window.addEventListener('resize', function () {
    navButtons.forEach(function (navButton) {
        if (navButton.classList.contains('navigation__nav-button--active')) {
            navButtonSlider.style.width = `${navButton.offsetWidth - 4}px`;
            navButtonSlider.style.left = `${navButton.offsetLeft + 2}px`;
        }
    })
});
