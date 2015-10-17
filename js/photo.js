/* Создайте модуль js/photo.js, в котором опишите объект типа Photo и сделайте его доступным в глобальной области видимости. */
'use strict';

(function() {
  var IMG_LOAD_TIMEOUT = 300;
  var PICTURE_SIDE_LENGTH = '182px';
  var pictureTemplate = document.getElementById('picture-template');

  /* Конструктор объекта Photo должен принимать на вход аргумент data и сохранять его в приватном свойстве _data. */
  var Photo = function(data) {
    this._data = data;
    // Фиксирование контекста обработчика. При любом вызове this._onClick, объект отеля
    // будет использоваться как контекст (даже при вызове через call и apply).
    this._onClick = this._onClick.bind(this); // this._element = null;
  };

  /* Метод render который занимается отрисовкой элемента фотографии в списке и добавлением ему обработчиков событий.
    Создание DOM-элемента, отрисовка его в переданный контейнер и добавление обработчика события клика. По большей части, не отличается от ранее написанного кода, кроме способа обращения к данным. Теперь они берутся не из аргумента итератора, а хранятся в объекте Photo в свойстве data_. @param  {Element|DocumentFragment} container   */
  Photo.prototype.render = function(container) {
    // var pictureTemplate = document.getElementById('picture-template');
    var newPictureElement = pictureTemplate.content.children[0].cloneNode(true);

    newPictureElement.querySelector('.picture-comments').textContent = this._data['comments'];
    newPictureElement.querySelector('.picture-likes').textContent = this._data['likes'];

    // Добавление в контейнер.
    container.appendChild(newPictureElement);

    if (this._data['url']) {
      var imgLoadTimeout = IMG_LOAD_TIMEOUT;
      var newPicture = new Image();

      newPicture.onload = function() {
        var pictureDummy = newPictureElement.querySelector('img');

        newPictureElement.replaceChild(newPicture, pictureDummy);
        newPictureElement.style.height = PICTURE_SIDE_LENGTH;
        newPictureElement.style.width = PICTURE_SIDE_LENGTH;
        newPictureElement.classList.add('picture--load');

        /* И факультативно, т.к. не видно процесса загрузки, добавь принудительный setTimeout при загрузке, например, на 300ms. И что бы картинки появлялись плавно. Изменять им нулевой opacity на 1 css анимацией. */
        setTimeout(function() {
          newPictureElement.classList.remove('picture--load');
          newPictureElement.classList.add('picture--ready');
        }, imgLoadTimeout);
        /* */
      };

      newPicture.onerror = function() {
        newPictureElement.classList.add('picture-load-failure');
      };

      newPicture.src = this._data['url'];

      IMG_LOAD_TIMEOUT = IMG_LOAD_TIMEOUT + 100;
    }

    this._element = newPictureElement;
    // Обработчик клика по отелю.
    this._element.addEventListener('click', this._onClick);
  };

  /* Метод unrender который убирает элемент из списка и удаляет обработчики событий. */
  Photo.prototype.unrender = function() {
    this._element.parentNode.removeChild(this._element);
    this._element.removeEventListener('click', this._onClick);
    this._element = null;
  };

  /* Обработчик события клика по элементу, который создает кастомное событие типа galleryclick и испускает его на объекте window
  Обработчик события клика по элементу отеля. Проверяет, отсутствует ли у элемента класс hotel-nophoto и если да, то создает кастомное событие showgallery с добавочными данными в свойстве detail, которые указывают на текущий объект отеля. Это используется для передачи фотографий отеля в фотогалерею. */
  Photo.prototype._onClick = function() {
    if (!this._element.classList.contains('picture-load-failure')) {
      var galleryEvent = new CustomEvent('galleryclick', {
        detail: {
          pictureElement: this
        }
      });
      window.dispatchEvent(galleryEvent);
    }
  };

  // Возвращает список фотографий текущего отеля, получив его из объекта data_.
  /* Photo.prototype.getPhotos = function() {
    return this._data.pictures;
  };
  */

  // Экспорт конструктора объекта Photo в глобальную область видимости.
  window.Photo = Photo;
})();
