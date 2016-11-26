(function () {
'use strict';

angular
  .module('MenuApp')
  .component('categories', {
    templateUrl: 'assets/scripts/src/modules/menuapp/components/categories/categorieslist.template.html',
    bindings: {
      data: '<'
    }
  });

})();
