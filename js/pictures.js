(function () {

  'use strict';

  /* Status for xhr loading */
  var ReadyState = {
    'UNSENT': 0,
    'OPENED': 1,
    'HEADERS_RECEIVED': 2,
    'LOADING': 3,
    'DONE': 4
  };
  /* Status for xhr loading end */

  var hideFilters = function () {
    var filters = document.querySelector(".filters");
    if (filters.classList.contains("hidden")) {
      return false;
    } else {
      filters.classList.add('hidden');
    }
  };
  hideFilters();

  /* Generate from template */
  var PICTURE_SIDE_LENGTH = "182px";
  var REQUEST_FAILURE_TIMEOUT = 10000;

  var picturesContainer = document.querySelector(".pictures");
  var pictures;

  function renderPictures(pictures) {
    picturesContainer.classList.remove('picture-load-failure');
    picturesContainer.innerHTML = '';

    var pictureTemplate = document.getElementById("picture-template");
    var picturesFragment = document.createDocumentFragment();

    pictures.forEach(function (picture) {
      var newPictureElement = pictureTemplate.content.children[0].cloneNode(true);

      newPictureElement.querySelector('.picture-comments').textContent = picture['comments'];
      newPictureElement.querySelector('.picture-likes').textContent = picture['likes'];

      picturesFragment.appendChild(newPictureElement);

      if (picture['url']) {
        var newPicture = new Image();

        newPicture.onload = function () {
          var pictureDummy = newPictureElement.querySelector("img");

          newPictureElement.replaceChild(newPicture, pictureDummy);
          newPictureElement.style.height = PICTURE_SIDE_LENGTH;
          newPictureElement.style.width = PICTURE_SIDE_LENGTH;
        };

        newPicture.onerror = function () {
          newPictureElement.classList.add('picture-load-failure');
        };

        newPicture.src = picture["url"];
      }
    });
    picturesContainer.appendChild(picturesFragment);
  }
  /* Generate from template end*/

  /* Если загрузка закончится неудачно (ошибкой сервера или таймаутом), покажите предупреждение об ошибке, добавив блоку .pictures класс pictures-failure */
  function showLoadFailure() {
    picturesContainer.classList.add('pictures-failure');
  }
  /* */

  /* Загрузите данные из файла data/pictures.json по XMLHttpRequest */

  function loadPictures(callback) {
    var xhr = new XMLHttpRequest();
    xhr.timeout = REQUEST_FAILURE_TIMEOUT;
    xhr.open('get', 'data/pictures.json');
    xhr.send();

    xhr.onreadystatechange = function (evt) {
      var loadedXhr = evt.target;

      switch (loadedXhr.readyState) {
      case ReadyState.OPENED:
      case ReadyState.HEADERS_RECEIVED:
      case ReadyState.LOADING:
        picturesContainer.classList.add('pictures-loading'); //Пока длится загрузка файла, покажите прелоадер, добавив класс .pictures-loading блоку .pictures
        break;

      case ReadyState.DONE:
      default:
        if (loadedXhr.status === 200) {
          var data = loadedXhr.response;
          picturesContainer.classList.remove('pictures-loading'); //Когда загрузка закончится, уберите прелоадер
          callback(JSON.parse(data));
        }

        if (loadedXhr.status > 400) {
          showLoadFailure(); // Если загрузка закончится неудачно (ошибкой сервера или таймаутом), покажите предупреждение об ошибке, добавив блоку .pictures класс pictures-failure
        }
        break;
      }
    };

    xhr.ontimeout = function () {
      showLoadFailure(); // Если загрузка закончится неудачно (ошибкой сервера или таймаутом), покажите предупреждение об ошибке, добавив блоку .pictures класс pictures-failure
    };
  }

  loadPictures(function (loadedPictures) {
    pictures = loadedPictures;
    renderPictures(loadedPictures);
   // setActiveFilter('sort-hotels-default');
  });
  /* Загрузите данные из файла data/pictures.json по XMLHttpRequest end */
})();
