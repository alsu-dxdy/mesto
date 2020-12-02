export default class CardList {
  constructor(container, card) {
    this.container = container;
    this.card = card;
  }

  addCard(cardElement) {
    this.container.appendChild(cardElement);
  }

  render(array, userID) {
    const myCards = array.filter(card => card.owner._id === userID);

    for (let i = 0; i < myCards.length; i++) {
      const newCard = this.card.create(
        myCards[i].name,
        myCards[i].link,
        myCards[i].likes.length,
        myCards[i].owner._id,
        myCards[i]._id,
        myCards[i].likes
      );

      //проверяю наличие своего лайка
      const isMyLike = myCards[i].likes.some(function (user) {
        return user._id === userID;
      });
      //Если есть мой лайк, то закрасить сердечко
      if (isMyLike) {
        newCard
          .querySelector(".place-card__like-icon")
          .classList.add("place-card__like-icon_liked");
      }
      //Если карта - моя, то сделать корзину видимой
      if (myCards[i].owner._id === userID) {
        newCard
          .querySelector(".place-card__delete-icon")
          .classList.add("place-card__delete-icon_visible");
      }

      this.container.appendChild(newCard);
    }
  }
}
