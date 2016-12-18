(function () {
'use strict';

angular
  .module('MenuApp')
  .component('items', {
    templateUrl: 'assets/scripts/src/modules/menuapp/components/items/items.template.html',
    controller: function () {
      this.randomImageId = function () {
        return Math.floor(Math.random() * 5) + 1;
      }
    },
    bindings: {
      data: '<'
    }
  });

})();
