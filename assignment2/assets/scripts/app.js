(function () {

  'use strict';

  angular
    .module('ShoppingListCheckOff', [])
    .controller('ToBuyController', ToBuyController);

  function ToBuyController () {
    var toBuyCtrl = this;

    toBuyCtrl.items = [
      '10 apples', '1 banana', '5 T-shirts',
      '2 trips to Alaska', '7 socks'];
  }

})();
