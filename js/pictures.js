'use strict';

(function() {
  /* Statuses for xhr loading */
  var ReadyState = {
    'UNSENT': 0,
    'OPENED': 1,
    'HEADERS_RECEIVED': 2,
    'LOADING': 3,
    'DONE': 4
  };
  /* Statuses for xhr loading end */

  /*
  function hideFilters() {
    var filters = document.querySelector('.filters');
    if (!filters.classList.contains('hidden')) {
      filters.classList.add('hidden');
    }
  };
  hideFilters();
  */

  /* Generate from template */
  var PICTURE_SIDE_LENGTH = '182px';
  var REQUEST_FAILURE_TIMEOUT = 10000;

  var picturesContainer = document.querySelector('.pictures');

  function renderPictures(pictures) {

    picturesContainer.classList.remove('picture-load-failure');
    picturesContainer.innerHTML = '';

    var pictureTemplate = document.getElementById('picture-template');
    var picturesFragment = document.createDocumentFragment();

    pictures.forEach(function(picture) {
      var newPictureElement = pictureTemplate.content.children[0].cloneNode(true);

      newPictureElement.querySelector('.picture-comments').textContent = picture['comments'];
      newPictureElement.querySelector('.picture-likes').textContent = picture['likes'];

      picturesFragment.appendChild(newPictureElement);

      if (picture['url']) {
        var newPicture = new Image();

        newPicture.onload = function() {
          var pictureDummy = newPictureElement.querySelector('img');

          newPictureElement.replaceChild(newPicture, pictureDummy);
          newPictureElement.style.height = PICTURE_SIDE_LENGTH;
          newPictureElement.style.width = PICTURE_SIDE_LENGTH;
          newPictureElement.classList.add('picture--load');

          /* И факультативно, т.к. не видно процесса загрузки, добавь принудительный setTimeout при загрузке, например, на 300ms. И что бы картинки появлялись плавно. Изменять им нулевой opacity на 1 css анимацией. */
          window.setTimeout(function() {
            newPictureElement.classList.remove('picture--load');
            newPictureElement.classList.add('picture--ready');
          }, 300);
          /* */
        };

        newPicture.onerror = function() {
          newPictureElement.classList.add('picture-load-failure');
        };

        newPicture.src = picture['url'];
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

    xhr.onreadystatechange = function(evt) {
      var loadedXhr = evt.target;

      switch (loadedXhr.readyState) {
        case ReadyState.OPENED:
        case ReadyState.HEADERS_RECEIVED:
        case ReadyState.LOADING:
          if (!picturesContainer.classList.contains('pictures-loading')) {
            picturesContainer.classList.add('pictures-loading'); // Пока длится загрузка файла, покажите прелоадер, добавив класс .pictures-loading блоку .pictures
          }
          break;
        case ReadyState.DONE:
        default:
          if (loadedXhr.status === 200) {
            var data = loadedXhr.response;
            picturesContainer.classList.remove('pictures-loading'); // Когда загрузка закончится, уберите прелоадер
            return callback(JSON.parse(data));
          }
          if (loadedXhr.status > 400) {
            showLoadFailure(); // Если загрузка закончится неудачно (ошибкой сервера или таймаутом), покажите предупреждение об ошибке, добавив блоку .pictures класс pictures-failure
          }
          break;
      }
    };

    xhr.ontimeout = function() {
      showLoadFailure(); // Если загрузка закончится неудачно (ошибкой сервера или таймаутом), покажите предупреждение об ошибке, добавив блоку .pictures класс pictures-failure
    };
  }

  /* Напишите обработчики событий для фильтров, так, чтобы они сортировали загруженный список фотографий следующим образом:
Популярные — список фотографий, в том виде, в котором он был загружен
Новые — список фотографий, сделанных за последний месяц, отсортированные по убыванию даты (поле date).
Обсуждаемые — отсортированные по убыванию количества комментариев (поле comments) */
  function filterPictures(pictures, filterID) {
    var filteredPictures = pictures.slice(0);

    function imgDateLimit(a) {
      var imgDate = Date.parse(a.date);
      var today = new Date();
      var timeDiff = today - imgDate;
      var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
      console.log(imgDate, timeDiff, diffDays);

      return diffDays < 30;

    }
    switch (filterID) {
      case 'filter-new':
        filteredPictures = filteredPictures.filter(imgDateLimit).sort(function(a, b) {
          if (a.date < b.date || typeof a.date !== 'string') {
            return 1; // если значение нечисловое или а меньше б, элемент идёт в конец. Во всех ост. случаях возвращается -1, а проверку на равенство можно опустить.
          }
          return -1;
        });
        break;
      case 'filter-discussed':
        filteredPictures = filteredPictures.sort(function(a, b) {
          if (typeof a.comments !== 'number') {
            return 1; // если значение нечисловое, элемент идёт в конец. Для ост. случаев действуех схема для числового сравнения.
          }
          return b.comments - a.comments; // Для числового сравнения, вместо строкового, функция сравнения может просто вычитать b из a.
        });
        break;
      default:
        filteredPictures = filteredPictures.sort(function(a, b) {
          if (typeof a.likes !== 'number') {
            return 1; // если значение нечисловое, элемент идёт в конец. Для ост. случаев действуех схема для числового сравнения.
          }
          return b.likes - a.likes; // Для числового сравнения, вместо строкового, функция сравнения может просто вычитать b из a.
        });
        break;
    }

    return filteredPictures;
  }

  /* Напишите обработчики... end */

  function setActiveFilter(filterID) {
    var filteredPictures = filterPictures(pictures, filterID);

    renderPictures(filteredPictures);
  }

  function initFilters() {
    var filterElements = document.querySelectorAll('.filters-radio');

    for (var i = 0; i < filterElements.length; i++) {
      filterElements[i].onclick = function(evt) {
        var clickedFilter = evt.currentTarget;
        setActiveFilter(clickedFilter.id);
      };
    }
  }

  initFilters();

  loadPictures(function(loadedPictures) {
    pictures = loadedPictures;
    setActiveFilter('filter-popular');
  });
  /* Загрузите данные из файла data/pictures.json по XMLHttpRequest end */
})();
