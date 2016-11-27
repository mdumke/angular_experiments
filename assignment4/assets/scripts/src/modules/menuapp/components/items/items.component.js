(function () {
'use strict';

angular
  .module('MenuApp')
  .component('items', {
    templateUrl: 'assets/scripts/src/modules/menuapp/components/items/items.template.html',
    bindings: {
      data: '<'
    }
  });

})();
