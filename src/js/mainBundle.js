import {bindForm} from "./bindForm";

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

const getPlanData = (path) => {
    return fetch(path).then(data => data.json());
}

const closePlanDesc = (removePosition, changeActive) => {
    document.querySelector('.plan__img-description').classList.remove('plan__img-description_open');

    if (removePosition) {
        document.querySelector('.plan__img-description').classList.remove('plan__img-description_left');
        document.querySelector('.plan__img-description').classList.remove('plan__img-description_right');
    }
    if (changeActive) {
        document.querySelector('.plan__list-item-active').classList.remove('plan__list-item-active');
        document.querySelector('.plan-item-highlight').classList.remove('plan-item-highlight');
    }
}

const openPlanDesc = () => {
    document.querySelector('.plan__img-description').classList.add('plan__img-description_open');
}

const handlePlanClick = (link, data) => {
    const id = link.getAttribute('data-item-id');
    const position = link.getAttribute('data-desc-position');
    data.then(({items}) => {
        const item = items[id];

        if (!item) {
            return false;
        }
        const planList = document.querySelector('.plan__list');
        planList.querySelector('.plan__list-item-active')
        && planList.querySelector('.plan__list-item-active').classList.remove('plan__list-item-active');

        const currentActive = document.querySelector('.plan-item-highlight');
        if (currentActive === link) {
            closePlanDesc(true);
            link.classList.remove('plan-item-highlight');
            return true;
        }
        if (currentActive) {
            currentActive.classList.remove('plan-item-highlight');
        }
        planList.querySelector('[data-item-id="' + id + '"]').classList.add('plan__list-item-active')
        link.classList.add('plan-item-highlight');

        const change = fillPlanDescription(item, position);
        if (change) {
            closePlanDesc(false);
            openPlanDesc();
            return true;
        }
        openPlanDesc();
    })
}

const bindPlanClick = (link, data) => {

    link.addEventListener('click', (e) => {
        e.preventDefault();
        handlePlanClick(link, data);
    })
}

const fillPlanDescription = ({link, name, img, text}, position) => {

    const desc = document.querySelector('.plan-desc');
    const imageNode = desc.querySelector('.plan-desc__img-wrapper img');
    const nameNode = desc.querySelector('.plan-desc__name a');
    const textNode = desc.querySelector('.plan-desc__text');

    imageNode.setAttribute('src', img);
    imageNode.setAttribute('alt', name);
    nameNode.setAttribute('href', link)
    nameNode.innerText = name;
    textNode.innerText = text;

    const change = !desc.classList.contains(`plan__img-description_${position}`);
    if (change) {
        desc.classList.remove(`plan__img-description_${position === 'left' ? 'right' : 'left'}`);
        desc.classList.add(`plan__img-description_${position}`);
    }
    return change;
}

const bindPlanListClick = (item, data) => {
    if (!item || !data) {
        return false;
    }

    item.addEventListener('click', () => {
        const id = item.getAttribute('data-item-id');

        if (!id) {
            return false;
        }

        const target = document.querySelector('.plan__img-mask [data-item-id="' + id + '"]');
        if (!target) {
            return false;
        }

        handlePlanClick(target, data);
    })
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

    const planData = getPlanData('/plan-data.json');
    for (const planItem of document.querySelectorAll('.js-plan-item')) {
        bindPlanClick(planItem, planData)
    }

    document.querySelector('.plan-desc__close').addEventListener('click', (e) => {
        e.preventDefault();
        closePlanDesc(true, true);
    })

    for (const planListItem of document.querySelectorAll('.js-plan-list-item')) {
        bindPlanListClick(planListItem, planData);
    }

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

    const forms = document.querySelectorAll('.js-form');
    for (const form of forms) {
        bindForm(form);
    }

})
