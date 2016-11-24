(function () {
'use strict';

angular
  .module('MenuApp')
  .controller('CategoriesController', CategoriesController);

CategoriesController.$inject = ['MenuDataService'];

function CategoriesController (MenuDataService) {
  var categories = this;

  categories.data = undefined;

  MenuDataService
    .getAllCategories()
    .then(function (results) {
      categories.data = results;
    })
    .catch(function () {
      console.log("MenuDataService not working");
    });
}

})();
