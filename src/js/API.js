export default class Api {
  constructor(options) {
    this.options = options;
  }
  _getResponseData(res) {
    if (res.ok) {
      return res.json();
    } else {
      return Promise.reject(`Ошибка: ${res.status}`);
    }
  }

  getInitialCards() {
    return (
      fetch(this.options.baseUrl + `/cards`, {
        method: "GET",
        headers: {
          authorization: this.options.headers.authorization
        }
      })
        /*
        Можно лучше: проверка ответа сервера и преобразование из json
        дублируется во всех методах класса Api, лучше вынести в отдельный метод:
          _getResponseData(res) {
          if (!res.ok) {
            return Promise.reject(`Ошибка: ${res.status}`); 
          }
          return res.json();
          }
        Подчеркивание в начале имени метода говорит о том, что метод является приватным, т.е.
        не используется вне класса Api   
      */
        .then(res => this._getResponseData(res))
    );
  }

  getUserInfo() {
    return fetch(this.options.baseUrl + `/users/me`, {
      method: "GET",
      headers: {
        authorization: this.options.headers.authorization
      }
    }).then(res => this._getResponseData(res));
  }

  sendServerUserInfo(name, job) {
    return fetch(this.options.baseUrl + `/users/me`, {
      method: "PATCH",
      headers: {
        authorization: this.options.headers.authorization,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        name: name,
        about: job
      })
    }).then(res => this._getResponseData(res));
  }

  addCard(name, url) {
    return fetch(this.options.baseUrl + `/cards`, {
      method: "POST",
      headers: {
        authorization: this.options.headers.authorization,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        name: name,
        link: url
      })
    }).then(res => this._getResponseData(res));
  }

  deleteCard(cardId) {
    return fetch(this.options.baseUrl + `/cards/${cardId}`, {
      method: "DELETE",
      headers: {
        authorization: this.options.headers.authorization
      }
    }).then(res => this._getResponseData(res));
  }

  addLike(cardId) {
    return fetch(this.options.baseUrl + `/cards/like/${cardId}`, {
      method: "PUT",
      headers: {
        authorization: this.options.headers.authorization
      }
    }).then(res => this._getResponseData(res));
  }

  removeLike(cardId) {
    return fetch(this.options.baseUrl + `/cards/like/${cardId}`, {
      method: "DELETE",
      headers: {
        authorization: this.options.headers.authorization
      }
    }).then(res => this._getResponseData(res));
  }

  sendServerAvatar(url) {
    return fetch(this.options.baseUrl + `/users/me/avatar`, {
      method: "PATCH",
      headers: {
        authorization: this.options.headers.authorization,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        avatar: url
      })
    }).then(res => this._getResponseData(res));
  }
}
