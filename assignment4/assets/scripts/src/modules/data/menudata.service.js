(function () {
'use strict';

angular
  .module('data')
  .service('MenuDataService', MenuDataService)
  .constant('ApiBasePath', 'https://davids-restaurant.herokuapp.com');


MenuDataService.$inject = ['$http', 'ApiBasePath', '$q', '$timeout'];

function MenuDataService ($http, ApiBasePath, $q, $timeout) {
  var service = this;

  /* returns a promise to retrieve the categories-json from the server */
  service.getAllCategories = function () {
    return $http({
      method: 'GET',
      url: (ApiBasePath + '/categories.json')
    })
    .then(function (result) {
      return result.data;
    });
  };

  /* returns a promise to retrieve json for the specified category */
  service.getItemsForCategory = function (categoryShortName) {
    return $http({
      method: 'GET',
      url: (ApiBasePath + '/menu_items.json?category=' + categoryShortName)
    })
    .then(function (result) {
      return result.data;
    });
  };
}

})();
