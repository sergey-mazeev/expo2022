import {mmodal} from './modal';
import {bindModalForm, bindForm} from "./bindForm";
import {PhoneMask} from "./PhoneMask";

const bindItemsSlider = (node) => {
    if (!node) {
        return false;
    }

    const swiper = new Swiper(node, {
        slidesPerView: 1,
        spaceBetween: 0,
        navigation: {
            disabledClass: 'slider__control_disabled',
        },
        breakpoints: {
            480: {
                slidesPerView: 2,
                spaceBetween: 26,
            },
            650: {
                slidesPerView: 3,
                spaceBetween: 26,
            },
            800: {
                slidesPerView: 4,
                spaceBetween: 26,
            },
            1050: {
                slidesPerView: 5,
                spaceBetween: 26,
            },
            1250: {
                slidesPerView: 6,
                spaceBetween: 26,
            },
        },
    });

    swiper.params.navigation.prevEl = swiper.el.parentElement.querySelector('.slider__control_prev');
    swiper.params.navigation.nextEl = swiper.el.parentElement.querySelector('.slider__control_next');
    swiper.navigation.init();
}

const bindCtoSlider = (node) => {
    if (!node) {
        return false;
    }

    const swiper = new Swiper(node, {
        slidesPerView: 1,
        spaceBetween: 0,
        breakpoints: {
            480: {
                slidesPerView: 2,
                spaceBetween: 20,
            },
            650: {
                slidesPerView: 3,
                spaceBetween: 20,
            },
            800: {
                slidesPerView: 4,
                spaceBetween: 20,
            },
            1050: {
                slidesPerView: 5,
                spaceBetween: 20,
            },
        },
    });
}

const bindGallerySlider = (node) => {
    if (!node) {
        return false;
    }

    const swiper = new Swiper(node, {
        slidesPerView: "auto",
        spaceBetween: 26,
        initialSlide: 1,
        navigation: {
            disabledClass: 'slider__control_disabled',
        },
        pagination: {
            el: ".swiper-pagination",
            clickable: true,
        },
    });

    swiper.params.navigation.prevEl = swiper.el.parentElement.querySelector('.slider__control_prev');
    swiper.params.navigation.nextEl = swiper.el.parentElement.querySelector('.slider__control_next');
    swiper.navigation.init();
}

window.addEventListener('load', () => {


    const itemsSliders = document.querySelectorAll('.slider_items .swiper');
    for (const slider of itemsSliders) {
        bindItemsSlider(slider);
    }

    const gallerySliders = document.querySelectorAll('.slider_gallery .swiper');
    for (const slider of gallerySliders) {
        bindGallerySlider(slider);
    }

    const ctoSliders = document.querySelectorAll('.cto__gallery .swiper');
    for (const slider of ctoSliders) {
        bindCtoSlider(slider);
    }


    const frontTabs = (node) => {
        if (!node) {
            return false;
        }

        const checkbox = node.querySelector('.front-tabs__toggle input');

        const toggleTab = (targetIndex) => {
            node.querySelector(`.front-tabs__head-item_active`).classList.remove('front-tabs__head-item_active');
            node.querySelector(`.front-tabs__head-item[data-target="${targetIndex}"]`).classList.add('front-tabs__head-item_active');

            node.querySelector(`.front-tabs__content-item_active`).classList.remove('front-tabs__content-item_active');
            node.querySelector(`.front-tabs__content-item[data-target="${targetIndex}"]`).classList.add('front-tabs__content-item_active');

            checkbox.checked = targetIndex === '2';
        }

        for (const control of node.querySelectorAll('.front-tabs__head-item')) {
            control.addEventListener('click', (e) => {
                e.preventDefault();
                if (control.classList.contains('front-tabs__head-item_active')) {
                    return false;
                }

                toggleTab(control.getAttribute('data-target'));
            })
        }


        checkbox.addEventListener('change', () => {
            if (checkbox.checked) {
                toggleTab("2");
                return true;
            }
            toggleTab("1");
        })
    }
    frontTabs(document.querySelector('.front-tabs'));



    const bindBurger = (node) => {
        if (!node) {
            return false;
        }
        node.addEventListener('click', (e) => {
            e.preventDefault();
            document.querySelector('.header__content-wrapper').classList.toggle('header__content-wrapper_open');
        });
    }
    bindBurger(document.querySelector('.header__burger'));


    const copyElement = (selector, targetParent, mQuery) => {
        const element = document.querySelector(selector);
        const target = document.querySelector(targetParent);

        if (!element || !target) {
            return false;
        }

        const pasteClone = () => {
            if (window.matchMedia(mQuery).matches && !target.innerHTML.trim(' ')) {
                target.append(element.cloneNode(true))
            }
        };

        pasteClone();

        window.addEventListener('resize', pasteClone);

    }

    copyElement('.about-goods__list', '.about-goods__list-mobile', '(max-width: 1100px)');

    const expandBlock = (triggerSelector, targetSelector) => {
        const element = document.querySelector(triggerSelector);
        const target = document.querySelector(targetSelector);

        if (!element || !target) {
            return false;
        }

        element.addEventListener('click', (e) => {
            e.preventDefault();
            element.classList.toggle('m-open');
            target.classList.toggle('m-open');
        })
    }

    expandBlock('.btn_icon-expand', '.about-goods__list-mobile');



    // инициализация кастомных модалок
    const on = (element, eventName, selector, fn) => {
        if (typeof element !== 'undefined' && element) {

            element.addEventListener(eventName, (event) => {

                const possibleTargets = element.querySelectorAll(selector);
                const target = event.target;

                for (let i = 0; i < possibleTargets.length; i += 1) {
                    let el = target;
                    const p = possibleTargets[i];

                    while (el && el !== element) {
                        if (el === p) {
                            return fn.call(p, event);
                        }
                        el = el.parentNode;
                    }
                }
            });
        }

    }

    on(document.body, 'click', '.js-modal', (e) => {
        e.preventDefault();
        mmodal(e.target, bindModalForm);
        e.stopPropagation();
    });

    // привязка форм
    const forms = document.querySelectorAll('.js-form');
    for (const form of forms) {
        bindForm(form);
    }



    const elemInViewport = (elem, full) => {
        const box = elem.getBoundingClientRect(),
        top = box.top,
        left = box.left,
        bottom = box.bottom,
        right  = box.right,
        width = document.documentElement.clientWidth,
        height = document.documentElement.clientHeight,
        maxWidth = full ? right - left : 0,
        maxHeight = full ? bottom - top : 0;

        return Math.min(height, bottom)- Math.max(0,top) >= maxHeight && Math.min(width, right)- Math.max(0, left)>= maxWidth;
    }

    const animateImages = () => {
        const aboutGoodsImg = document.querySelector('.about-goods__img');
        const aboutGoodsItems = document.querySelectorAll('.about-goods__list-item');
        const aboutGoodsSum = document.querySelector('.about-goods__sum');
        const questionBlock = document.querySelector('.questions-block');

        if (!aboutGoodsImg && !questionBlock && !aboutGoodsItems.length && aboutGoodsSum) {
            return false;
        }

        aboutGoodsImg && aboutGoodsImg.classList.add('about-goods__img_hidden');
        aboutGoodsSum && aboutGoodsSum.classList.add('about-goods__sum_hidden');
        for (const item of aboutGoodsItems) {
            item.classList.add('about-goods__list-item_hidden')
        }

        window.addEventListener('scroll', () => {
            if (aboutGoodsImg && elemInViewport(aboutGoodsImg, false)) {
                aboutGoodsImg.classList.remove('about-goods__img_hidden');
            }

            if (questionBlock && elemInViewport(questionBlock, true)) {
                questionBlock.classList.add('questions-block_show-img');
            }

            if (aboutGoodsSum && elemInViewport(aboutGoodsSum, true)) {
                aboutGoodsSum.classList.remove('about-goods__sum_hidden');
            }

            for (const item of aboutGoodsItems) {
                if (elemInViewport(item, true)) {
                    item.classList.remove('about-goods__list-item_hidden');
                }
            }

        })
    }

    animateImages();

})
