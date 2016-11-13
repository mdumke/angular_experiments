(function () {

'use strict';

var app = angular.module('NarrowItDownApp', []);

/**
 * Define Constants
 */
app.constant('ApiBasePath', 'http://davids-restaurant.herokuapp.com');


/**
 * Define Services
 */
app.service('MenuSearchService', ['$http', 'ApiBasePath', 'MenuFilterService', function ($http, ApiBasePath, MenuFilterService) {
  var service = this;

  service.getMatchedMenuItems = function (searchTerm) {
    return $http({
      method: 'GET',
      url: (ApiBasePath + '/menu_items.json')
    })
    .then(function (result) {
      if (!searchTerm || searchTerm === "") return [];
      return MenuFilterService.filter(result.data.menu_items, searchTerm);
    });
  }
}]);

app.service('MenuFilterService', [function () {
  var service = this;

  service.filter = function (menuItems, searchTerm) {
    return menuItems.filter(function (item) {
      return (item.name.indexOf(searchTerm) !== -1);
    });
  };
}]);


/**
 * Define Directives
 */
app.directive('foundItems', [function () {
  var ddo = {
    templateUrl: 'found_items.html',
    scope: {
      found: '<',
      searching: '<',
      onRemove: '&'
    }
  };

  return ddo;
}]);


/**
 * Define Controllers
 */
app.controller('NarrowItDownController', ['MenuSearchService', function (MenuSearchService) {
  var searchCtrl = this;

  searchCtrl.newSearch = function () {
    searchCtrl.searching = true;

    MenuSearchService
      .getMatchedMenuItems(searchCtrl.searchTerm)
      .then(function (result) {
        searchCtrl.searching = false;
        searchCtrl.found = result;
      });
  }

  searchCtrl.remove = function (index) {
    searchCtrl.found.splice(index, 1);
  }
}]);

})();
