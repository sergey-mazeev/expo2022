import {PhoneMask} from "./PhoneMask";
import {closeModal} from "./modal";
import {validate} from "./validate";

export const bindModalForm = () => {
    const modal = document.querySelector('.modal__body');
    if (!modal) {
        return false;
    }
    const modalFormNode =
        modal.querySelector('.js-form') || modal.querySelector('.form_modal');

    if (!modalFormNode) {
        return false;
    }

    bindForm(modalFormNode);
    return true;
}

export const bindForm = (formNode, handler = defaultHandler) => {
    if (!formNode || formNode.tagName.toLowerCase() !== 'form') {
        return false;
    }
    const phoneMasks = bindPhoneMasks(formNode);

    formNode.addEventListener('submit', (e) => {
        e.preventDefault();
        handler(formNode);
    });
}

const serialize = (form) => {
    const serialized = [];
    for (let i = 0; i < form.elements.length; i++) {
        const field = form.elements[i];
        if (!field.name
            || field.disabled
            || field.type === 'file'
            || field.type === 'reset'
            || field.type === 'submit'
            || field.type === 'button') continue;

        if (field.type === 'select-multiple') {
            for (let n = 0; n < field.options.length; n++) {
                if (!field.options[n].selected) continue;
                serialized.push(encodeURIComponent(field.name) + "=" + encodeURIComponent(field.options[n].value));
            }
        } else if ((field.type !== 'checkbox' && field.type !== 'radio') || field.checked) {
            serialized.push(encodeURIComponent(field.name) + "=" + encodeURIComponent(field.value));
        }
    }

    return serialized.join('&');
};

const defaultHandler = (form) => {

    if (!validate(form)) {
        return false;
    }
    form.classList.add('form_loading');
    // отправляем данные
    const body = form.getAttribute("enctype") === "multipart/form-data" ? new FormData(form) : serialize(form);
    const headers = form.getAttribute("enctype") === "multipart/form-data" ? {} : {
        "Content-Type": "application/x-www-form-urlencoded",
        "Accept": 'application/json',
    };
    const options = {
        method: 'POST',
        body,
        headers,
    }
    fetch(form.getAttribute('action'), options)
        .then((answer) => answer.json())
        .then((answer) => {
            const formMessage = document.createElement('div');
            formMessage.classList.add('form__message');
            formMessage.innerHTML = answer.message;
            form.append(formMessage);
            form.classList.remove('form_loading');
            if (answer.status === 'success') {
                if (form.getAttribute('data-success')) {
                    eval(form.getAttribute('data-success'));
                }
                formMessage.classList.add('form__message_success');
                setTimeout(() => {
                    form.reset();
                }, 100);
                setTimeout(() => {
                    closeModal();
                }, 8000);

            } else {
                formMessage.classList.add('form__message_error');
                setTimeout(() => {
                    formMessage.remove();
                }, 8000);
            }
            form.addEventListener('click', () => {
                removeMessage(formMessage);
            })
        })
        .catch((message) => {
            console.warn(message);
            const formMessage = document.createElement('div');
            formMessage.classList.add('form__message');
            formMessage.classList.add('form__message_error');
            formMessage.innerHTML = "Ошибка связи с серверов.<br>Попробуйте ещё раз или свяжитесь с нами по телефону <a href='tel:88005117743'>8 (800) 511-77-43</a>";
            form.append(formMessage);
            form.classList.remove('form_loading');
            setTimeout(() => {
                formMessage.remove();
            }, 10000);
            form.addEventListener('click', () => {
                removeMessage(formMessage);
            })
        });
}

const removeMessage = (messageNode) => {
    messageNode.remove();
}

const bindPhoneMasks = (root) => {
    const telInput = root.querySelectorAll('[type="tel"], .js-input-phone');

    if (!telInput.length) {
        return null;
    }

    return [...telInput].map(node => new PhoneMask(node));
}