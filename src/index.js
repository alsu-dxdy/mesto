import Card from "./js/Card";
import CardList from "./js/CardList";
import Api from "./js/API";

import "./style.css";
import { serverUrl } from './config';

(() => {
  const placesList = document.querySelector(".places-list"); //placesList - родитель кнопки "Лайк" и "Корзина"

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

  const myID = "767ab2acd59351e1d6e3d7fd";// нужна для удаления карточки

  /* -----Слушатели событий----- */

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

})();

