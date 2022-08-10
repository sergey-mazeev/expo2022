export const validate = (form) => {
    // пока проверяем только заполненность маски телефона, остальное проверяется стандартной html5 валидацией

    const telInputs = form.querySelectorAll('input[type="tel"], .js-input-phone');
    for (const telInput of telInputs) {
        telInput.addEventListener('input', () => {
            telInput.setCustomValidity('');
        })
        if (telInput.phonemask.validate()) {
            telInput.setCustomValidity('');
            telInput.validity.valid = true;
            continue;
        }
        telInput.setCustomValidity('Неверно заполнен номер');
        telInput.validity.valid = false;
        telInput.reportValidity();
        telInput.focus();

        return false;
    }

    return true;
}