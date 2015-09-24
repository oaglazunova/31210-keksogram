(function () {
  var uploadForm = document.forms['upload-select-image'];
  var resizeForm = document.forms['upload-resize'];
  var filterForm = document.forms['upload-filter'];

  var previewImage = resizeForm.querySelector('.resize-image-preview');
  var prevButton = resizeForm['resize-prev'];

  prevButton.onclick = function (evt) {
    evt.preventDefault();

    resizeForm.reset();
    uploadForm.reset();
    resizeForm.classList.add('invisible');
    uploadForm.classList.remove('invisible');
  };

  /* My code */
  var moveX = resizeForm["resize-x"];
  var moveY = resizeForm["resize-y"];
  var sideSize = resizeForm["resize-size"];

  moveX.value = 0;
  moveY.value = 0;
 // moveX.min = 0;
//  moveY.min = 0;

 // var img = document.getElementById('resize-image-preview');
  var img = document.getElementById('resize-image-preview');
  var imgWidth; // width of the uploaded image, in px
  var imgHeight; // height of the uploaded image, in px

  /* find img dimensions, minSideSize, sideSize.value, sideSize.max */
  img.onload = function (evt) {
    imgWidth = img.width;
    imgHeight = img.height;

    console.log(imgWidth, imgHeight);

    /* to handle situation when uploaded image is small -  */
    if (imgWidth >= 500 && imgHeight >= 500) {
      sideSize.min = 182; //default min side length of the cropped area (based on div.pictures.picture images), in px
      sideSize.value = 500;
    } else if (imgWidth < 500 || imgHeight < 500) {
      if (imgWidth >= 182 || imgHeight >= 182) {
        sideSize.min = 182;
        sideSize.value = 182;
      } else {
        if (imgWidth > imgHeight) {
          sideSize.min = imgHeight;
          sideSize.value = imgHeight;
        } else {
          sideSize.min = imgWidth;
          sideSize.value = imgWidth;
        }
      }
    }
    /* to handle situation when uploaded image is small end */

    if (imgHeight > imgWidth) {
      sideSize.max = imgWidth;
    } else {
      sideSize.max = imgHeight;
    }

  };
  /* find img dimensions, minSideSize, sideSize.value, sideSize.max end */

  resizeForm.onchange = function (evt) {
    moveX.max = imgWidth - parseInt(sideSize.value, 10);
    moveY.max = imgHeight - parseInt(sideSize.value, 10);
  };

  /* My code end */


  resizeForm.onsubmit = function (evt) {
    evt.preventDefault();
    filterForm.elements['filter-image-src'] = previewImage.src;

    resizeForm.classList.add('invisible');
    filterForm.classList.remove('invisible');
  };



})();