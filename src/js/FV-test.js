export default class FormValidator {
    constructor(contactData) {
      this.button = this.contactData.querySelector("button");
      this.name =  document.getElementById('Name');
      this.tel =  document.getElementById('PhoneNumber');
  
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
  
      error.textContent = "";
    }
  
    setSubmitButtonState(button) {  
      if (
        this.name.checkValidity() &&
        this.tel.checkValidity() 
        ) {
        button.removeAttribute("disabled");
        return;
      }
      if (
        !this.name.checkValidity() ||
        !this.job.checkValidity()  
      ) {
        button.setAttribute("disabled", true);
        return;
      }
    }
  
    setEventListeners(event) {
      this.checkInputValidity(
        event.target,
        event.target.closest(".input-container").querySelector(".input-error")
      );
      this.setSubmitButtonState(this.button);  
    }
  }