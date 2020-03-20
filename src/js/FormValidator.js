class FormValidator {
    constructor(popup) {
        //debugger;
        this.form = popup.querySelector('form');
        this.button = this.form.querySelector('button');
        this.form.addEventListener('input', this.setEventListeners.bind(this));
    }


    // checkInputValidity —  валидация поля.
    checkInputValidity(input, error) {
        //debugger;

        if (input.validity.valueMissing) {
            return error.textContent = 'Это обязательное поле';
        }

        if (input.validity.tooShort) {
            return error.textContent = 'Должно быть от 2 до 30 символов';
        }

        if (input.validity.tooLong) {
            return error.textContent = 'Должно быть от 2 до 30 символов';
        }

        if (input.validity.typeMismatch) {
            return error.textContent = 'Здесь должна быть ссылка';
        }

        error.textContent = '';
    }

    // setSubmitButtonState - метод, меняющий состояние кнопки сабмита. 
    setSubmitButtonState(form, button) {

        if (form.checkValidity()) {
            button.removeAttribute('disabled');
            button.classList.remove('button_disabled');
            return;
        }
        if (!form.checkValidity()) {
            button.setAttribute('disabled', true);
            button.classList.add('button_disabled');
            return;
        }
    }

    setEventListeners(event) {
        //debugger;
        this.checkInputValidity(event.target, event.target.closest('div').querySelector('.input__error'));
        this.setSubmitButtonState(this.form, this.button);
    }

}