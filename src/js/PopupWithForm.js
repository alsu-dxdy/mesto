export default class PopupWithForm extends Popup {
  constructor(popup, userInfoContainer) {
    super(popup); //вызываем кон-р родителя
    this.form = popup.querySelector("form");
    this.userInfoContainer = userInfoContainer;
    /*this.form.addEventListener('submit', (event) => {
            event.preventDefault();
            this.userInfoContainer.updateUserInfo(
                this.form.querySelector('.popup__input_type_name').value,
                this.form.querySelector('.popup__input_type_job').value
            );
            this.close();
        });*/
  }
}
