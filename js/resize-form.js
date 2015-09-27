(function () {

  'use strict';

  var uploadForm = document.forms['upload-select-image'];
  var resizeForm = document.forms['upload-resize'];
  var filterForm = document.forms['upload-filter'];
  var prevButton = resizeForm['resize-prev'];  
  var previewImage = resizeForm.querySelector('.resize-image-preview');

  /* My code */
  var moveX = resizeForm["resize-x"];
  var moveY = resizeForm["resize-y"];
  var sideSize = resizeForm["resize-size"]; // параметр "сторона" в форме
  var resizedImg = filterForm.querySelector('.filter-image-preview'), // here .filter-image-preview is used instead of .resize-image-preview in order to let the script read width and height of the original, not resized image. .resize-image-preview parameters are commented out in CSS for the same reason
    style = window.getComputedStyle(resizedImg),
    previewMaxWidth = style.getPropertyValue('max-width'),
    previewMaxHeight = style.getPropertyValue('max-height');  

  moveX.value = 0;
  moveY.value = 0;
  moveX.min = 0;
  moveY.min = 0;

  var imgWidth; // width of the uploaded image, in px
  var imgHeight; // height of the uploaded image, in px 

  previewImage.onload = function (evt) {
    imgWidth = previewImage.width;
    imgHeight = previewImage.height;
    previewImage.style.maxWidth = previewMaxWidth;
    previewImage.style.maxHeight = previewMaxHeight;

    /* To find min side size if image side < 182 */
    if (imgWidth >= 182 && imgHeight >= 182) {
      sideSize.min = 182; // min side length of the cropped area (based on div.pictures.picture), from css, in px
    } else if (imgWidth < 182 || imgHeight < 182) {
      if (imgWidth > imgHeight) {
        sideSize.min = imgHeight;
      } else {
        sideSize.min = imgWidth;
      }
    }
    /* To find min side size if image side < 182 end */
    
    sideSize.value = sideSize.min;
  };

  /* to find moveX.max */
  moveX.onchange = function (evt) {
    moveX.max = imgWidth - parseInt(sideSize.value, 10);
  };
  /* to find moveX.max end */

  /* to find moveY.max */
  moveY.onchange = function (evt) {
    moveY.max = imgHeight - parseInt(sideSize.value, 10);
  };
  /* to find moveY.max end */

  /* to find sideSize.max */
  sideSize.onchange = function (evt) {
    if (imgHeight > imgWidth) {
      sideSize.max = imgWidth;
    } else {
      sideSize.max = imgHeight;
    }
  };
  /* to find sideSize.max end */

  /* My code end */

  prevButton.onclick = function (evt) {
    evt.preventDefault();

    resizeForm.reset();
    uploadForm.reset();
    resizeForm.classList.add('invisible');
    uploadForm.classList.remove('invisible');
  };

  resizeForm.onsubmit = function (evt) {
    evt.preventDefault();

    filterForm.elements['filter-image-src'] = previewImage.src;
    resizeForm.classList.add('invisible');
    filterForm.classList.remove('invisible');
  };

})();