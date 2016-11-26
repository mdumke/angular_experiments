(function () {
'use strict';

angular
  .module('MenuApp')
  .controller('CategoriesController', CategoriesController);

CategoriesController.$inject = ['categoriesData'];

function CategoriesController (categoriesData) {
  this.data = categoriesData;
}

})();
