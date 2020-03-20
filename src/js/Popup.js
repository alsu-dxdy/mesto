class Popup {
    constructor(popup) {
        this.popup = popup;
        this.popup.querySelector('.popup__close')
            .addEventListener('click', this.close.bind(this));
    }

    open() {
        this.popup.classList.add('popup_is-opened');
    }

    close() {
        this.popup.classList.remove('popup_is-opened');
        //this.popup.querySelector('button').textContent = 'Сохранить';
    }

}
