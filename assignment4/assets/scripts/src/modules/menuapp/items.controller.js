(function () {
'use strict';

angular
  .module('MenuApp')
  .controller('ItemsController', ItemsController);

ItemsController.$inject = ['data'];

function ItemsController (data) {
  var items = this;

  items.category = data.category;
  items.itemData = data.menu_items;
}

})();
