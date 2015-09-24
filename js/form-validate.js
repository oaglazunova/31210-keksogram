(function () {

  // "use strict";

  var formResize = document.forms["upload-resize"];
  var moveX = formResize["resize-x"];
  var moveY = formResize["resize-y"];
  var sideSize = formResize["resize-size"];

  moveX.value = 0;
  moveY.value = 0;
  moveX.min = 0;
  moveY.min = 0;

  var img = document.getElementById('resize-image-preview');
  var imgWidth; // width of the uploaded image, in px
  var imgHeight; // height of the uploaded image, in px

  /* find img dimensions, minSideSize, sideSize.value, sideSize.max */
  img.onload = function () {
    imgWidth = img.width;
    imgHeight = img.height;
    
    console.log(imgWidth, imgHeight);

    /* to handle situation if uploaded image is small -  */
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
    /* to handle situation if uploaded image is small end */

    if (imgHeight > imgWidth) {
      sideSize.max = imgWidth;
    } else {
      sideSize.max = imgHeight;
    }

  };
  /* find img dimensions, minSideSize, sideSize.value, sideSize.max end */

  formResize.onchange = function (evt) {
    moveX.max = imgWidth - parseInt(sideSize.value, 10);
    moveY.max = imgHeight - parseInt(sideSize.value, 10);
  };




  /* restore from cookies */
  restoreFormValueFromCookies = function (form) {
    var element;

    for (i = 0; i < form.elements.length; i++) {
      element = form.elements[i];
    
     if (docCookies.hasItem(element.id)) {
        element.checked = docCookies.getItem(element.id);
      }
     
    }
  };
  /* restore from cookies end */

  var formFilter = document.forms["upload-filter"];

  restoreFormValueFromCookies(formFilter); //restore filter type from cookies

  /* save filter type to cookies */
  formFilter.onsubmit = function (evt) {
    evt.preventDefault();
    var element;

    for (i = 0; i < formFilter.elements.length; i++) {
      element = formFilter.elements[i];
      
      if (element.name == "upload-filter" && element.checked == true) {
        docCookies.setItem(element.id, "checked");
        console.log(element.id, "checked");
      }
      else {
        docCookies.setItem(element.id, "", -1);
      }
    }
    formFilter.submit();
  };
  /* save filter type to cookies end */

})();