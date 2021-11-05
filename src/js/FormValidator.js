export default class FormValidator {
  constructor(popup) {
    this.form = popup.querySelector(".popup__form_edit");
    this.button = this.form.querySelector("button");
    console.log(
      "🚀 ~ file: FormValidator.js ~ line 5 ~ FormValidator ~ constructor ~ this.button",
      this.button
    );
    this.form.addEventListener("input", this.setEventListeners.bind(this));
  }

  // checkInputValidity —  валидация поля.
  checkInputValidity(input, error) {
    if (input.validity.valueMissing) {
      this.button.setAttribute("disabled", true);
      this.button.classList.add("button_disabled");
      return (error.textContent = "Это обязательное поле");
    }

    if (input.validity.tooShort) {
      this.button.setAttribute("disabled", true);
      this.button.classList.add("button_disabled");
      return (error.textContent = "Должно быть от 2 до 30 символов");
    }

    if (input.validity.tooLong) {
      return (error.textContent = "Должно быть от 2 до 30 символов");
    }

    if (input.validity.typeMismatch) {
      return (error.textContent = "Здесь должна быть ссылка");
    }

    this.button.removeAttribute("disabled");
    this.button.classList.remove("button_disabled");
    error.textContent = "";
  }

  // setSubmitButtonState - метод, меняющий состояние кнопки сабмита.
  setSubmitButtonState(form, button) {
    if (form.checkValidity()) {
      button.removeAttribute("disabled");
      button.classList.remove("button_disabled");
      return;
    }
    if (!form.checkValidity()) {
      button.setAttribute("disabled", true);
      button.classList.add("button_disabled");
      return;
    }
  }

  setEventListeners(event) {
    this.checkInputValidity(
      event.target,
      event.target.closest(".input-container").querySelector(".input__error")
    );
    this.setSubmitButtonState(this.form, this.button);
  }
}
