class Card {

  //метод like общий для Постановки и снятия лайка
  like(e, counter, counterContainer) {
    //debugger;
    if (e.target.classList.contains('place-card__like-icon')) { //клик по сердечку
      e.target.classList.toggle('place-card__like-icon_liked');
      counterContainer.textContent = counter;
    }
  }

  //Удаление карточки
  remove(e) {
    //debugger;
    if (e.target.classList.contains('place-card__delete-icon_visible')) {//клик по корзине
      // Надо исправить: вы обращаетесь в классе к переменной  placesList объявленной глобально, так делать нельзя
      //placesList.removeChild(event.target.closest('.place-card'));
      e.target.closest('.place-card').remove();
    }
  }

  create(nameValue, linkValue, countValue, ownerIdValue, cardIdValue) {
    const placeCard = document.createElement("div");
    placeCard.classList.add("place-card");
    placeCard.insertAdjacentHTML('beforeend', `
              <div class="place-card__image">
                <button class="place-card__delete-icon"></button>
              </div>
              <div class="place-card__description">
                <h3 class="place-card__name"></h3>
                <div class="place-card__right-container">
                  <button class="place-card__like-icon"></button>
                  <p class="place-card__count">0</p>
                </div>
              </div>
              
              `);
    placeCard.querySelector(".place-card__name").textContent = nameValue;
    placeCard.querySelector(".place-card__image").style.backgroundImage = `url(${linkValue})`;
    placeCard.querySelector(".place-card__count").textContent = countValue;
    placeCard.setAttribute("cardID", `${cardIdValue}`);
    placeCard.setAttribute("ownerID", `${ownerIdValue}`);
    //placeCard.querySelector(".place-card__delete-icon").classList.add(`${ownerIdValue}`);
    return placeCard;
  }

  addBasketSymbol(element) {
    element.querySelector('.place-card__delete-icon').classList.add('place-card__delete-icon_visible');
  }
}