console.log('demo - remove /js/vendor/demo.js in production');


window.addEventListener('load', () => {
    for (const modalBtn of document.querySelectorAll('.temp-open-modal')) {
        modalBtn.addEventListener('click', (e) => {
            e.preventDefault();
            document.querySelector(modalBtn.getAttribute('href')).classList.add('modal_opened')
        })
    }

    for (const modalClose of document.querySelectorAll('.modal__close')) {
        modalClose.addEventListener('click', (e) => {
            e.preventDefault();
            document.querySelector('.modal_opened').classList.remove('modal_opened')
        })
    }
})