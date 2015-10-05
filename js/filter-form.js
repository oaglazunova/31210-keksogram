'use strict';

(function() {
  var uploadForm = document.forms['upload-select-image'];
  var resizeForm = document.forms['upload-resize'];
  var filterForm = document.forms['upload-filter'];

  var previewImage = filterForm.querySelector('.filter-image-preview');
  var prevButton = filterForm['filter-prev'];
  var selectedFilter = filterForm['upload-filter'];

  var filterMap;

  /* restore from cookies */
  var restoreFormValueFromCookies = function(form) {
    var element;
    for (var i = 0; i < form.elements.length; i++) {
      element = form.elements[i];
      if (docCookies.hasItem(element.id)) {
        element.checked = docCookies.getItem(element.id);
        previewImage.className = 'filter-image-preview' + ' ' + filterMap[selectedFilter.value];
      }
    }
  };
  /* restore from cookies end */

  function setFilter() {
    if (!filterMap) {
      filterMap = {
        'none': 'filter-none',
        'chrome': 'filter-chrome',
        'sepia': 'filter-sepia'
      };
    }

    previewImage.className = 'filter-image-preview' + ' ' + filterMap[selectedFilter.value];
  }

  for (var i = 0; i < selectedFilter.length; i++) {
    selectedFilter[i].onchange = function(evt) {
      setFilter();
    };
  }

  prevButton.onclick = function(evt) {
    evt.preventDefault();

    filterForm.reset();
    filterForm.classList.add('invisible');
    resizeForm.classList.remove('invisible');
  };

  filterForm.onsubmit = function(evt) {
    evt.preventDefault();

    /* save filter type to cookies */
    var element;
    for (i = 0; i < filterForm.elements.length; i++) {
      element = filterForm.elements[i];
      if (element.name === 'upload-filter' && element.checked === true) {
        var dateDiff = new Date - new Date('Thu, 22 Jul 1982 15:30:00 GMT');
        var expDate = new Date;

        expDate.setTime(Date.now() + dateDiff);
        docCookies.setItem(element.id, 'checked', expDate);
      } else {
        docCookies.setItem(element.id, '', -1);
      }
    }
    filterForm.submit();
    /* save filter type to cookies end */

    uploadForm.classList.remove('invisible');
    filterForm.classList.add('invisible');
  };

  setFilter();

  restoreFormValueFromCookies(filterForm); //restore filter type from cookies

})();
