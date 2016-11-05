(function () {

'use strict';

angular
  .module('ShoppingListCheckOff', [])
  .controller('ToBuyController', ToBuyController)
  .controller('AlreadyBoughtController', AlreadyBoughtController)
  .service('ShoppingListCheckOffService', ShoppingListCheckOffService);

// Define ToBuyController
ToBuyController.$inject = ['$scope', 'ShoppingListCheckOffService'];

function ToBuyController ($scope, ShoppingListCheckOffService) {
  $scope.items = ShoppingListCheckOffService.getItemsToBuy();

  $scope.checkOffItem = function (itemID) {
    ShoppingListCheckOffService.checkOffItem(itemID);
  };
};

// Define AlreadyBougthController
AlreadyBoughtController.$inject = ['$scope', 'ShoppingListCheckOffService'];

function AlreadyBoughtController ($scope, ShoppingListCheckOffService) {
  $scope.items = ShoppingListCheckOffService.getItemsBought();
};

// Define ShoppingListCheckOffService
function ShoppingListCheckOffService () {
  var service = this;

  service.itemsToBuy = [
    { name: 'clones of myself', quantity: 2 },
    { name: 'competing firms',  quantity: 4 },
    { name: 'spaceship',        quantity: 1 },
    { name: 'socks',            quantity: 3 },
    { name: 'christmas trees',  quantity: 8 }
  ];

  service.itemsBought = [];

  service.getItemsToBuy = function () {
    return service.itemsToBuy;
  };

  service.getItemsBought = function () {
    return service.itemsBought;
  };

  service.checkOffItem = function (itemID) {
    service.itemsBought.push(service.itemsToBuy[itemID]);
    service.itemsToBuy.splice(itemID, 1);
  };
};

})();
