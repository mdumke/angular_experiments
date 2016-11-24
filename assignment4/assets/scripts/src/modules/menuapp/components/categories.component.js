(function () {
'use strict';

angular
  .module('MenuApp')
  .component('categories', {
    templateUrl: 'assets/scripts/src/modules/menuapp/components/categories.template.html',
    bindings: {
      data: '<'
    }
  });

})();
