export const mmodal = async (element, callback, callbefore) => {
    if (!element) {
        return false;
    }

    const target = element.getAttribute('href') || element.getAttribute('data-href') || null;

    if (!target) {
        return false;
    }

    if (typeof callbefore === 'function') {
        callbefore();
    }

    const params = getDataParams(element, 'param');

    const modalContent = await getFormHTML(target, params);

    if (modalContent.status === 'success') {
        const modalTitle = element.getAttribute('data-modal-title');
        showModal(modalContent.data, modalTitle, getDataParams(element, 'autoload'));

        if (typeof callback === 'function') {
            callback();
        }
    }
}

const getDataParams = (element, groupName) => {

    if (!groupName) {
        return {};
    }

    const dataset = element.dataset;
    const propertyKeys = Object.keys(dataset)
        .filter(key => key.indexOf(groupName) === 0);

    if (!propertyKeys.length) {
        return {};
    }

    return propertyKeys.reduce((acc, el) => {
        const key = el.replace(groupName, '').toUpperCase();
        return {
            ...acc,
            [key]: dataset[el],
        }
    }, {})

};

const getFormHTML = async (target, params) => {
    try {
        const data = await fetch(target, {
            method: 'POST',
            headers: {
                "Content-type": "application/x-www-form-urlencoded; charset=UTF-8"
            },
            credentials: 'same-origin',
            body: (new URLSearchParams(params)).toString(),
        });
        return await data.json();
    } catch (e) {
        console.log(e);
        return null;
    }
};

const fillFields = (root, values = {}) => {
    for (const selector of Object.keys(values)) {
        const name = `PROPERTY[${selector}]`;
        const targetNode = root.querySelector(`input[name="${name}"], textarea[name="${name}"]`);
        if (targetNode) {
            targetNode.value = values[selector];
        }
    }
};

const focusFirstInput = (root) => {
    const firstInput = root.querySelector('input[type="text"], input[type="tel"], input[type="email"], input[type="number"]');
    if (firstInput) {
        firstInput.focus();
    }
}

const showModal = (content, title, prefilled = {}) => {
    const modalTemplate = document.getElementById('modalTemplate')
        .content
        .querySelector('.modal')
        .cloneNode(true);
    modalTemplate.querySelector('.modal__content').innerHTML = content;

    modalTemplate.querySelector('.modal__title').innerText =
        title
        || (modalTemplate.querySelector('[data-modal-title]') && modalTemplate.querySelector('[data-modal-title]').getAttribute('data-modal-title'))
        || '';
    fillFields(modalTemplate, prefilled);

    document.body.append(modalTemplate)
    setTimeout(() => {
        modalTemplate.classList.add('modal_opened');
        document.body.classList.add('scroll-lock');
    }, 100);
    setTimeout(() => {
        focusFirstInput(modalTemplate);
    }, 150);

    modalTemplate.querySelector('.modal__close').addEventListener('click', (e) => {
        e.preventDefault();
        closeModal();
    });

    modalTemplate.addEventListener('mousedown', (e) => {
        if (e.target === modalTemplate) {
            closeModal();
        }
    });

    document.addEventListener('keyup', escHandler);

}

export const closeModal = () => {
    const modal = document.querySelector('.modal_opened');
    if (!modal) {
        return false;
    }
    modal.classList.remove('modal_opened');
    document.body.classList.remove('scroll-lock');
    document.removeEventListener('keyup', escHandler);
    setTimeout(() => {
        modal.remove()
    }, 375);
}

const escHandler = (e) => {
    if (e.code === 'Escape') {
        closeModal();
    }
}