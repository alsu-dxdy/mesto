import Card from "./js/Card";
import CardList from "./js/CardList";
import Api from "./js/API";
import FormValidator from "./js/FormValidator";
import Popup from "./js/Popup";
import PopupImage from "./js/PopupImage";
import PopupWithForm from "./js/PopupWithForm";
import UserInfo from "./js/UserInfo";

import "./style.css";
import { serverUrl } from './config';

(() => {
  const placesList = document.querySelector(".places-list"); //placesList - родитель кнопки "Лайк" и "Корзина"
  const newCardForm = document.querySelector(".popup__form");
  const editProfileForm = document.querySelector(".popup__form_edit");
  const formAvatar = document.querySelector(".popup__form_avatar");

  const userInfoButton = document.querySelector(".user-info__button"); //кнопка + (вызов чистой формы)
  const buttonEditProfile = document.querySelector(".button_edit_profile"); //кнопка Edit

  const popupImageBig = document.querySelector(".popup_image_big"); // картинка в попапе
  const userInfoPhoto = document.querySelector(".user-info__photo"); //круглый аватар

  /*Экземпляры классов*/
  const api = new Api({
    baseUrl: `${serverUrl}`,
    headers: {
      authorization: "24efeac8-6c91-4328-9f60-c8c7ed524d9c",
      "Content-Type": "application/json"
    }
  });
  const card = new Card();
  const cardList = new CardList(placesList, card);

  const newCardPopup = new Popup(document.querySelector(".popup")); //popup Новое место
  const popupEditProfile = new Popup(document.querySelector(".popup_edit")); //popup Редактировать профиль
  const popupImage = new PopupImage(
    document.querySelector(".popup_image"),
    popupImageBig
  );
  const popupAvatar = new Popup(document.querySelector(".popup_avatar")); //popup Аватара

  const userInfo = new UserInfo(
    editProfileForm,
    document.querySelector(".user-info__name"),
    document.querySelector(".user-info__job"),
    document.querySelector(".user-info__photo")
  );

  const myID = "767ab2acd59351e1d6e3d7fd";// нужна для удаления карточки
  /*Экземпляры для валидации (слушатели внутри класса FormValidator)*/
  const formValidNewPlace = new FormValidator(document.querySelector(".popup"));
  const formValidEditProfile = new FormValidator(
    document.querySelector(".popup_edit")
  );
  const formValidAvatar = new FormValidator(
    document.querySelector(".popup_avatar")
  );

  /* -----Слушатели событий----- */

  //Открытие попапа Новое место
  userInfoButton.addEventListener("click", () => {
    newCardPopup.open();
  });

  //Открытие попапа Редак-ть профиль
  buttonEditProfile.addEventListener("click", () => {
    popupEditProfile.open();
    userInfo.setUserInfo(); //подгужаем данные из верстки в инпуты
  });

  //Открытие попапа Обновить аватар
  userInfoPhoto.addEventListener("click", () => {
    popupAvatar.open();
  });

  //Открытие попапа с картинкой
  placesList.addEventListener("click", popupImage.open.bind(popupImage));

  // Отображение массива карточек
  window.addEventListener("load", () => {
    Promise.all([api.getInitialCards(), api.getUserInfo()])
      .then(
        ([initialCards, userData]) => {
          cardList.render(initialCards, userData._id);
          userInfo.updateUserInfo(userData);
          userInfo.updateUserAvatar(userData)
        })
      .catch((err) => {
        alert(err.message);
        console.log(err);
      });
  });

  //Добавление новой карточки
  newCardForm.addEventListener("submit", function (event) {
    event.preventDefault();
    document.querySelector(".popup__button").textContent = "Загрузка...";
    api
      .addCard(newCardForm.elements.name.value, newCardForm.elements.link.value)
      .then(data => {
        const cardElement = card.create(
          data.name,
          data.link,
          data.likes.length,
          data.owner._id,
          data._id
        );
        cardList.addCard(cardElement);
        //Для своих карточек делаю символ корзины видимым:
        card.addBasketSymbol(cardElement);
        newCardForm.reset();

        newCardPopup.close();
        newCardForm.querySelector("button").textContent = "+";
      })
      .catch(err => {
        console.log(`Ошибка: ${err}`);
      });
  });

  // Удаление карточки
  placesList.addEventListener("click", function (event) {
    if (
      event.target.classList.contains("place-card__delete-icon_visible") &&
      event.target.closest(".place-card").getAttribute("ownerID") === myID
    ) {
      const result = window.confirm("Вы действительно хотите удалить эту карточку?");
      if (result) {
        const cardId = event.target.closest(".place-card").getAttribute("cardID");
        api
          .deleteCard(`${cardId}`)
          .then(data => {
            console.log(data);
          })
          .catch(err => {
            console.log(`Удаление неуспешно: ${err}`);
          });

        card.remove(event);
      }
    }
  });

  //Постановка и снятие лайка
  placesList.addEventListener("click", function (event) {
    //Если был клик по черному сердечку:
    if (event.target.classList.contains("place-card__like-icon_liked")) {
      const cardId = event.target.closest(".place-card").getAttribute("cardID");
      api
        .removeLike(`${cardId}`)
        .then(data => {
          //event.target.nextElementSibling это div с количеством лайков
          card.like(event, data.likes.length, event.target.nextElementSibling);
        })
        .catch(err => {
          console.log(`Снятие лайка НЕ успешно: ${err}`);
        });
      //Если был клик по бесцветному сердечку:
    } else if (event.target.classList.contains("place-card__like-icon")) {
      const cardId = event.target.closest(".place-card").getAttribute("cardID");
      api
        .addLike(`${cardId}`)
        .then(data => {
          card.like(event, data.likes.length, event.target.nextElementSibling);
        })
        .catch(err => {
          console.log(`Постановка лайка НЕ успешна: ${err}`);
        });
    }
  });

  //Редактирование профиля
  editProfileForm.addEventListener("submit", function (event) {
    event.preventDefault();
    document.querySelector(".popup__button_save").textContent = "Загрузка...";
    api
      .sendServerUserInfo(
        editProfileForm.username.value,
        editProfileForm.job.value
      )
      .then(data => {
        userInfo.updateUserInfo(data);

        editProfileForm.reset();
        popupEditProfile.close();
        editProfileForm.querySelector("button").textContent = "Сохранить";
      })
      .catch(err => {
        console.log(`Ошибка: ${err}`);
      });
  });

  //Обновление аватара пользователя
  formAvatar.addEventListener("submit", function (event) {
    event.preventDefault();
    api
      .sendServerAvatar(formAvatar.elements.avatar.value)
      .then(data => {
        userInfo.updateUserAvatar(data);
        formAvatar.reset();
        popupAvatar.close();
      })
      .catch(err => {
        console.log(`Ошибка: ${err}`);
      });
  });
})();

