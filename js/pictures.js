(function () {

  'use strict';

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

  var picturesContainer = document.querySelector(".pictures");
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
  /* Generate from template end*/
})();