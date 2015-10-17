/* global Photo: true */
// Gallery: true

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

  // var PICTURE_SIDE_LENGTH = '182px';
  var REQUEST_FAILURE_TIMEOUT = 10000;
  var PAGE_SIZE = 12;
  var IMG_LOAD_TIMEOUT = 300;

  var currentPage = 0; // хранит значение текущей страницы
  var picturesContainer = document.querySelector('.pictures');
  var picturesToRender;
  var filteredPictures;
  // var Gallery = new Gallery();
  var renderedPictures = [];

  /* Перепишите функцию вывода списка фотографий таким образом, чтобы она отрисовывала не все доступные изображения, а постранично:
Каждая страница состоит максимум из 12 фотографий (последняя может содержать меньше).
Сделайте так, чтобы функция могла работать в двух режимах: добавления страницы и перезаписи содержимого контейнера. */
  function renderPictures(itemsToRender, pageNumber, replace) {
    replace = typeof replace !== 'undefined' ? replace : true; // тернарный оператор: условие ? если выполняется : если не выполняется
    pageNumber = pageNumber || 0; // нормализация аргумента
    IMG_LOAD_TIMEOUT = 300;

    // Удаление списка отелей. Пока в массиве renderedHotels есть объекты
    // Hotel, вызывается функция Array.prototype.shift(), которая удаляет
    // первый элемент из массива и возвращает его, и у этого отеля вызывается
    // метод Hotel.prototype.unrender.
    if (replace) {
      var el;
      while ((el = renderedPictures.shift())) {
        el.unrender();
      }
      picturesContainer.classList.remove('picture-load-failure');
    }

    var picturesFragment = document.createDocumentFragment();
    var picturesFrom = pageNumber * PAGE_SIZE;
    var picturesTo = picturesFrom + PAGE_SIZE;
    picturesToRender = picturesToRender.slice(picturesFrom, picturesTo);

    // Отрисовка списка отелей. На каждой итерации цикла создается объект
    // типа Photo с уникальными данными, отрисовывается в предназначенный
    // для него контейнер (picturesFragment) и добавляется в массив picturesFragment.
    picturesToRender.forEach(function(pictureData) {
      var newPictureElement = new Photo(pictureData);
      newPictureElement.render(picturesFragment);
      renderedPictures.push(newPictureElement);
    });

    picturesContainer.appendChild(picturesFragment);
  }

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
  function filterPictures(itemsToRender, filterID) {
    filteredPictures = itemsToRender.slice(0);

    function imgDateLimit(a) {
      var imgDate = Date.parse(a.date);
      var today = new Date();
      var timeDiff = today - imgDate;
      var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));

      return diffDays < 60;
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
   /* default:
      filteredPictures = filteredPictures.sort(function (a, b) {
        if (typeof a.likes !== 'number') {
          return 1; // если значение нечисловое, элемент идёт в конец. Для ост. случаев действуех схема для числового сравнения.
        }
        return b.likes - a.likes; // Для числового сравнения, вместо строкового, функция сравнения может просто вычитать b из a.
      });
      break;
      */
    }

    localStorage.setItem('filterID', filterID);

    return filteredPictures;
  }

  // Вызывает функцию фильтрации на списке отелей с переданным fitlerID и подсвечивает кнопку активного фильтра.
  function setActiveFilter(filterID) {
    filteredPictures = filterPictures(picturesToRender, filterID);
    currentPage = 0;

    renderPictures(filteredPictures, currentPage, true);
    // document.querySelector('.hotel-filter-selected').classList.remove('hotel-filter-selected');
    // document.querySelector('#' + filterID).classList.add('hotel-filter-selected');
  }

    /* После переключения фильтра, должна показываться первая страница (тут-то вам и пригодится режим перезаписи контейнера в функции вывода фотографий).
После переключения фильтра, выбранное значение должно сохраняться в localStorage и использоваться как значение по умолчанию при следующей загрузке. */
  /* Инициализация подписки на клики по кнопкам фильтра.
+   * Используется делегирование событий: события обрабатываются на объекте,
+   * содержащем все фильтры, и в момент наступления события, проверяется,
+   * произошел ли клик по фильтру или нет и если да, то вызывается функция
+   * установки фильтра. */
  function initFilters() {
    var filtersContainer = document.querySelector('.filters');

    filtersContainer.addEventListener('click', function(evt) {
      var clickedFilter = evt.target;
      setActiveFilter(clickedFilter.id);
      /*
      if (doesHaveParent(clickedFilter, 'filters')) {
        setActiveFilter(clickedFilter.id);
      }
    */
    });
  }

  // Проверяет можно ли отрисовать следующую страницу списка
  function isNextPageAvailable() {
    return currentPage < Math.ceil(filteredPictures.length / PAGE_SIZE);
  }

  // Проверяет, находится ли скролл внизу страницы.
  function isAtTheBottom() {
    var GAP = 100;
    return picturesContainer.getBoundingClientRect().bottom - GAP <= window.innerHeight;
  }

  // Испускает на объекте window событие loadneeded если скролл находится внизу cтраницы и существует возможность показать еще одну страницу.
  function checkNextPage() {
    if (isAtTheBottom() && isNextPageAvailable()) {
      window.dispatchEvent(new CustomEvent('loadneeded'));
    }
  }

  /* Оптимизируйте обработчик события scroll с помощью таймаута, который срабатывает каждые 100 миллисекунд и испускает кастомное событие «достижения низа страницы». Переключение страницы из scroll уберите. */
  function initScroll() {
    var scrollTimeout;

    window.addEventListener('loadneeded', function() {
      currentPage++;
      renderPictures(filteredPictures, currentPage, false);
    });

    window.addEventListener('scroll', function() {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(checkNextPage, 100); // throttle - функция вызывается раз в 100 мс
    });
  }

  /**
   * Добавляет обработчик события showgallery, которое испускается объектом window
   * в объекте типа Hotel, если произошел клик по фотографии отеля. При наступлении
   * этого события, показывает фотогалерею и загружает в нее фотографии отеля,
   * полученные через метод getPhotos() у отеля, переданного через объект
   * CustomEvent.prototype.detail.
   */
    /*
  function initGallery() {
    window.addEventListener('showgallery', function (evt) {
      gallery.setPhotos(evt.detail.pictureElement.getPhotos());
      gallery.show();
    });
  }
    */

  initFilters();
  initScroll();
  // initGallery();

  // Загружает список отелей из файла data/hotels.json и отрисовывает его
  // на странице после вызова фильтрации с ID сохраненным в localStorage.
  // Если в localStorage не сохранен ID фильтра, используется значение
  // по умолчанию.
  loadPictures(function(loadedPictures) {
    picturesToRender = loadedPictures;
    setActiveFilter(localStorage.getItem('filterID') || 'filter-popular');
  });

})();
