'use strict';

(function () {
  var Key = {
     'ESC': 27,
     'LEFT': 37,
     'RIGHT': 39
   };

  var Gallery = function () {
    this._element = document.body.querySelector('.gallery-overlay');
    this._closeButton = this._element.querySelector('.gallery-overlay-close');
    this._pictureElement = this._element.querySelector('.gallery-overlay-preview');
    this._currentPhoto = 0;
    this._photos = [];
  }

  /**
   * Показывает фотогалерею, убирая у контейнера класс hidden. Затем добавляет
   * обработчики событий и показывает текущую фотографию.
   */
  Gallery.prototype.show = function () {
    this._element.classList.remove('invisible');
    this._closeButton.addEventListener('click', this._onCloseClick);
    this._leftButton.addEventListener('click', this._onLeftButtonClick);
    this._rightButton.addEventListener('click', this._onRightButtonClick);
    document.body.addEventListener('keydown', this._onKeyDown);

    this._showCurrentPhoto();
  };

  /**
   * Убирает фотогалерею и обработчики событий. Очищает служебные свойства.
   */
  Gallery.prototype.hide = function () {
    this._element.classList.add('invisible');
    this._closeButton.removeEventListener('click', this._onCloseClick);
    this._leftButton.removeEventListener('click', this._onLeftButtonClick);
    this._rightButton.removeEventListener('click', this._onRightButtonClick);
    document.body.removeEventListener('keydown', this._onKeyDown);

    this._photos = [];
    this._currentPhoto = 0;
  };

  /**
   * Записывает список фотографий.
   * @param {Array.<string>} photos
   */
  Gallery.prototype.setPhotos = function (photos) {
    this._photos = photos;
  };

  /**
   * Устанавливает номер фотографии, которую нужно показать, предварительно
   * "зажав" его между 0 и количеством фотографий в галерее минус 1 (чтобы нельзя
   * было показать фотографию номер -1 или номер 100 в массиве из четырех
   * фотографий), и показывает ее на странице.
   * @param {number} index
   */
  Gallery.prototype.setCurrentPhoto = function (index) {
    index = clamp(index, 0, this._photos.length - 1);

    if (this._currentPhoto === index) {
      return;
    }

    this._currentPhoto = index;
    this._showCurrentPhoto();
  };

    /**
   * Приватный метод, показывающий текущую фотографию. Убирает предыдущюю
   * отрисованную фотографию, создает объект Image с src указанным
   * в массиве photos_ под индексом currentPhoto_ и после загрузки показывает
   * его на странице.
   * @private
   */
  Gallery.prototype._showCurrentPhoto = function() {
    this._pictureElement.innerHTML = '';

    var imageElement = new Image();
    imageElement.src = this._photos[this._currentPhoto];
    imageElement.onload = function() {
      this._pictureElement.appendChild(imageElement);
    }.bind(this);
  };

  // Экспорт конструктора Gallery в глобальную область видимости.
  window.Gallery = Gallery;

  /*
  var Key = {
     'ESC': 27,
     'LEFT': 37,
     'RIGHT': 39
   };

   var picturesContainer = document.querySelector('.pictures');
   var galleryElement = document.querySelector('.gallery-overlay');
   var closeBtn = galleryElement.querySelector('.gallery-overlay-close');

   function doesHaveParent(element, className) {
     do {
       if (element.classList.contains(className)) {
         return !element.classList.contains('picture-load-failure');
       }
       element = element.parentElement;
     }
     while (element);

     return false;
   }

   function hideGallery() {
     galleryElement.classList.add('invisible');
     closeBtn.removeEventListener('click', closeHandler);
     document.body.removeEventListener('keydown', keyHandler);
   }

   function closeHandler(evt) {
     evt.preventDefault();
     hideGallery();
   }

   function keyHandler(evt) {
     switch (evt.keyCode) {
       case Key.LEFT:
         console.log('show previous photo');
         break;
       case Key.RIGHT:
         console.log('show next photo');
         break;
       case Key.ESC:
         hideGallery();
         break;
       default:
         break;
     }
   }

   function showGallery() {
     galleryElement.classList.remove('invisible');
     closeBtn.addEventListener('click', closeHandler);
     document.body.addEventListener('keydown', keyHandler);
   }

   picturesContainer.addEventListener('click', function(evt) {
     evt.stopPropagation();
     evt.preventDefault();

     if (doesHaveParent(evt.target, 'pictures')) {  // if (evt.target.tagName === 'IMG') {
       showGallery();
     }
   });
   */

})();
