// import React from "react";
class Api {
  constructor(config) {
    this._url = config.url;
    this._headers = config.headers;
  }
  // проверяет есть ли ошибка
  _checkError(res) {
    if (res.ok) {
      return res.json();
    }
    return Promise.reject(`Статус ошибки: ${res.status}`);
  }
  // Загрузка карточек с сервера
  getInitialCards() {
    const token = localStorage.getItem("jwt");
    return fetch(`${this._url}/cards`, {
      method: "GET",
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${token}`,
      },
    }).then((res) => this._checkError(res));
  }
  // добавление карточек на страницу
  postNewCard(data) {
    const token = localStorage.getItem("jwt");
    return fetch(`${this._url}/cards`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    }).then((res) => this._checkError(res));
  }
  // удаление карточек
  deleteCard(cardId) {
    const token = localStorage.getItem("jwt");
    return fetch(`${this._url}/cards/${cardId}`, {
      method: "DELETE",
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${token}`,
      },
    }).then((res) => this._checkError(res));
  }
  // получение данных с сервера
  getInfo() {
    const token = localStorage.getItem("jwt");
    return fetch(`${this._url}/users/me`, {
      method: "GET",
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${token}`,
      },
    }).then((res) => this._checkError(res));
  }
  // изменение данных с сервера
  patchUserInfo(data) {
    const token = localStorage.getItem("jwt");
    return fetch(`${this._url}/users/me`, {
      method: "PATCH",
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    }).then((res) => this._checkError(res));
  }
  // изменение данных аватара
  patchAvatarInfo(data) {
    const token = localStorage.getItem("jwt");
    return fetch(`${this._url}/users/me/avatar`, {
      method: "PATCH",
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    }).then((res) => this._checkError(res));
  }
  // добавление лайка
  getLike(cardId) {
    const token = localStorage.getItem("jwt");
    return fetch(`${this._url}/cards/${cardId}/likes`, {
      method: "PUT",
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${token}`,
      },
    }).then((res) => this._checkError(res));
  }
  // удаление лайка
  deleteLike(cardId) {
    const token = localStorage.getItem("jwt");
    return fetch(`${this._url}/cards/${cardId}/likes`, {
      method: "DELETE",
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${token}`,
      },
    }).then((res) => this._checkError(res));
  }
}
const api = new Api({
  url: "http://localhost:3000",
  //url: 'https://api.back.nomoredomains.club'
});
export default api;
