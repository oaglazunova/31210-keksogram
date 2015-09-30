(function () {

  'use strict';

  /* Statuses for xhr loading */
  var ReadyState = {
    'UNSENT': 0,
    'OPENED': 1,
    'HEADERS_RECEIVED': 2,
    'LOADING': 3,
    'DONE': 4
  };
  /* Statuses for xhr loading end */

  var hideFilters = function () {
    var filters = document.querySelector(".filters");
    if (!filters.classList.contains("hidden")) {
      filters.classList.add('hidden');
    }
  };
  //  hideFilters();

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
        if (!picturesContainer.classList.contains("pictures-loading")) {
          picturesContainer.classList.add('pictures-loading'); //Пока длится загрузка файла, покажите прелоадер, добавив класс .pictures-loading блоку .pictures
        }
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

  /* Напишите обработчики событий для фильтров, так, чтобы они сортировали загруженный список фотографий следующим образом:
Популярные — список фотографий, в том виде, в котором он был загружен
Новые — список фотографий, сделанных за последний месяц, отсортированные по убыванию даты (поле date).
Обсуждаемые — отсортированные по убыванию количества комментариев (поле comments) */
  function filterPictures(pictures, filterID) {
    var filteredPictures = pictures.slice(0);

    switch (filterID) {
    case "filter-new":
      filteredPictures = filteredPictures.sort(function (a, b) {
        if (a.date < b.date || (b.date && a.date === 0)) {
          return 1;
        }
        if (a.date > b.date || (a.date && b.date === 0)) {
          return -1;
        }
        if (a.date === b.date) {
          return 0;
        }
      });
      break;
    case "filter-discussed":
      filteredPictures = filteredPictures.sort(function (a, b) {
        if (a.comments < b.comments || (b.comments && a.comments === 0)) {
          return 1;
        }
        if (a.comments > b.comments || (a.comments && b.comments === 0)) {
          return -1;
        }
        if (a.comments === b.comments) {
          return 0;
        }
      });
      break;
    default:
      filteredPictures = filteredPictures.sort(function (a, b) {
        if (a.likes < b.likes || (b.likes && a.likes === 0)) {
          return 1;
        }
        if (a.likes > b.likes || (a.likes && b.likes === 0)) {
          return -1;
        }
        if (a.likes === b.likes) {
          return 0;
        }
      });
      break;
    }

    return filteredPictures;
  }
  /* Напишите обработчики... end */

  function initFilters() {
    var filterElements = document.querySelectorAll(".filters-radio");

    for (var i = 0; i < filterElements.length; i++) {
      filterElements[i].onclick = function (evt) {
        var clickedFilter = evt.currentTarget;
        setActiveFilter(clickedFilter.id);
      }
    }
  }

  function setActiveFilter(filterID) {
    var filteredPictures = filterPictures(pictures, filterID);
    renderPictures(filteredPictures);
  }

  initFilters();

  loadPictures(function (loadedPictures) {
    pictures = loadedPictures;
    setActiveFilter('filter-popular');
  });
  /* Загрузите данные из файла data/pictures.json по XMLHttpRequest end */
})();