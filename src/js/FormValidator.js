export default class FormValidator {
  constructor(popup) {
    this.form = popup.querySelector(".popup__form_edit");
    this.button = this.form.querySelector("button");
    // this.name = document.querySelector("name");
    // this.job = document.querySelector("job");

    this.form.addEventListener("input", this.setEventListeners.bind(this));
  }

  checkInputValidity(input, error) {
    if (input.validity.valueMissing) {
      return (error.textContent = "Это обязательное поле");
    }

    if (input.validity.tooShort) {
      return (error.textContent = "Должно быть от 2 до 30 символов");
    }

    if (input.validity.tooLong) {
      return (error.textContent = "Должно быть от 2 до 30 символов");
    }

    if (input.validity.typeMismatch) {
      return (error.textContent = "Здесь должна быть ссылка");
    }

    error.textContent = "";
  }

  // setSubmitButtonState - метод, меняющий состояние кнопки .
  setSubmitButtonState(form, button) {
    const name = document.getElementById("name");
    const job = document.getElementById("job");
    const name1 = document.getElementById("name1");
    const job1 = document.getElementById("job1");

    if (
      name.checkValidity() &&
      job.checkValidity() &&
      name1.checkValidity() &&
      job1.checkValidity()
    ) {
      button.removeAttribute("disabled");
      button.classList.remove("button_disabled");
      return;
    }
    if (
      !name.checkValidity() ||
      !job.checkValidity() ||
      !name1.checkValidity() ||
      !job1.checkValidity()
    ) {
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
