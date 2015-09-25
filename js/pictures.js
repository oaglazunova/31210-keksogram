(function () {

  hideFilters = function () {
    var filters = document.getElementById("filters");
    if (filters.classList.contains("hidden")) {
      return false;
    } else {
      filters.classList.add('hidden');
      // console.log("hide");
    }
  }
  hideFilters();

})();