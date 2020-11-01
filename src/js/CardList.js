export default class CardList {
  constructor(container, card) {
    this.container = container;
    this.card = card;
  }

  addCard(cardElement) {
    this.container.appendChild(cardElement);
  }

  render(array, userID) {
    for (let i = 0; i < 10; i++) {
      const newCard = this.card.create(
        array[i].name,
        array[i].link,
        array[i].likes.length,
        array[i].owner._id,
        array[i]._id,
        array[i].likes
      );

      //проверяю наличие своего лайка
      const isMyLike = array[i].likes.some(function (user) {
        return user._id === userID;
      });
      //Если есть мой лайк, то закрасить сердечко
      if (isMyLike) {
        newCard
          .querySelector(".place-card__like-icon")
          .classList.toggle("place-card__like-icon_liked");
      }
      //Если карта - моя, то сделать корзину видимой
      if (array[i].owner._id === userID) {
        newCard
          .querySelector(".place-card__delete-icon")
          .classList.add("place-card__delete-icon_visible");
      }

      this.container.appendChild(newCard);
    }
  }
}
