(function () {
  
  'use strict';

  var hideFilters = function () {
    var filters = document.querySelector(".filters");
    if (filters.classList.contains("hidden")) {
      return false;
    } else {
      filters.classList.add('hidden');
      // console.log("hide");
    }
  };
  hideFilters();

  var likes = {

  };

  var comments = {

  };

  var urls = {

  };
  
  var picturesContainer = document.querySelector(".pictures");
  var pictureTemplate = document.getElementById("picture-template");
  
  var picturesFragment = document.createDocumentFragment();		
  
  pictures.forEach(function(picture, i) {
    var newPictureElement = pictureTemplate.content.children[0].cloneNode(true);
    
    /*
      newHotelElement.querySelector('.hotel-stars').classList.add(starsClassName[hotel['stars']]);
      newHotelElement.querySelector('.hotel-name').textContent = hotel['name'];
      newHotelElement.querySelector('.hotel-distance-kilometers').textContent = [hotel['distance'], 'км'].join(' ');
      newHotelElement.querySelector('.hotel-price-value').textContent = hotel['price'];
      newHotelElement.querySelector('.hotel-rating').textContent = hotel['rating'];
      newHotelElement.querySelector('.hotel-rating').classList.add(ratingClassName[Math.floor(hotel['rating'])]);
      */
    
  //  newPictureElement.querySelector('.picture.img').src = picture['url'];        
    newPictureElement.querySelector('.picture-comments').textContent = picture['comments'];
    newPictureElement.querySelector('.picture-likes').textContent = picture['likes'];
    console.log(newPictureElement);
    
    picturesContainer.appendChild(newPictureElement);
   // picturesFragment.appendChild(newPictureElement); 
    
    
    var PICTURE_SIDE_LENGTH = "182px";
    var REQUEST_FAILURE_TIMEOUT = 10000;
    
    if (picture['url']) {
        var newPicture = new Image();
        newPicture.src = picture["url"];

        var imageLoadTimeout = setTimeout(function() {
          newPictureElement.classList.add('picture-load-failure');
        }, REQUEST_FAILURE_TIMEOUT);

        newPicture.onload = function() {
          newPictureElement.style.backgroundImage = 'url(\'' + newPicture.src + '\')';
          newPictureElement.style.backgroundSize = '100% auto';
          
          newPictureElement.style.height = PICTURE_SIDE_LENGTH;
          newPictureElement.style.width = PICTURE_SIDE_LENGTH;
          clearTimeout(imageLoadTimeout);
        };

        newPicture.onerror = function() {
          newPictureElement.classList.add('picture-load-failure');
        };
      }
    
  });
  
  
/*  
var picture = document.createElement("article");
  picture.className = "picture";
  picturesContainer.appendChild(picture);
  */

})();
