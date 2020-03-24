//(() => {
import Card from "./js/Card";
import CardList from "./js/CardList";
import Api from "./js/API";
import FormValidator from "./js/FormValidator";
import Popup from "./js/Popup";
import PopupImage from "./js/PopupImage";
import PopupWithForm from "./js/PopupWithForm";
import UserInfo from "./js/UserInfo";

import "./style.css";
import {serverUrl} from './config';

const placesList = document.querySelector(".places-list"); //placesList - родитель кнопки "Лайк" и "Корзина"
const newCardForm = document.querySelector(".popup__form");
const editProfileForm = document.querySelector(".popup__form_edit");
const formAvatar = document.querySelector(".popup__form_avatar");

const userInfoButton = document.querySelector(".user-info__button"); //кнопка + (вызов чистой формы)
const buttonEditProfile = document.querySelector(".button_edit_profile"); //кнопка Edit

const popupImageBig = document.querySelector(".popup_image_big"); // картинка в попапе
const userInfoPhoto = document.querySelector(".user-info__photo"); //круглый аватар

/*Экземпляры классов*/
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
const api = new Api({
  baseUrl: "https://praktikum.tk/cohort8",
  headers: {
    authorization: "24efeac8-6c91-4328-9f60-c8c7ed524d9c",
    "Content-Type": "application/json"
  }
});
//const myID = "767ab2acd59351e1d6e3d7fd";
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

window.addEventListener("load", () => {
  Promise.all([api.getInitialCards(), api.getUserInfo()]).then(
    ([initialCards, userData]) => {
      cardList.render(initialCards, userData._id);
      userInfo.updateUserInfo(userData);
      userInfo.updateUserAvatar(userData);
    }
  );
});

//Добавление новой карточки
newCardForm.addEventListener("submit", function(event) {
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
placesList.addEventListener("click", function(event) {
  //debugger;
  if (
    event.target.classList.contains("place-card__delete-icon_visible") &&
    event.target.closest(".place-card").getAttribute("ownerID") === myID
  ) {
    result = window.confirm("Вы действительно хотите удалить эту карточку?");
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
      //debugger;
      //card.remove();
      card.remove(event);
    }
  }
});

//Постановка и снятие лайка
placesList.addEventListener("click", function(event) {
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
editProfileForm.addEventListener("submit", function(event) {
  event.preventDefault();
  document.querySelector(".popup__button_save").textContent = "Загрузка...";
  //debugger;
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
formAvatar.addEventListener("submit", function(event) {
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
//})();

/*
  Хорошая работа, класс Api создан, он обеспечивает методы для доступа к серверу, сам не меняет страницу
  и возвращает из своих методов промисы с данными. Обработка ошибок располагается там где нужно.

  Можно лучше:
  - все изменения на странице должны происходить, только после того, как
  сервер ответил подтверждением. Если сервер не ответил, или ответил ошибкой, а
  данные на странице сохранятся, то это может ввести пользователя в заблуждение
  Данные пользователя сохраняются и карточка добавляется на страницу после ответа сервера,
  закрытие попапа также лучше делать только после ответа сервера

  - проверка ответа сервера и преобразование из json
  дублируется во всех методах класса Api, лучше вынести в отдельный метод


  Для закрепления полученных знаний советую сделать и оставшуюся часть задания.
  Если у Вас будет свободное время попробуйте переписать работу с сервером
  применив async/await для работы с асинхронными запросами.
  https://learn.javascript.ru/async-await
  https://habr.com/ru/company/ruvds/blog/414373/
  https://www.youtube.com/watch?v=SHiUyM_fFME
  Это часто используется в реальной работе

  Успехов в дальнейшем обучении!
*/
