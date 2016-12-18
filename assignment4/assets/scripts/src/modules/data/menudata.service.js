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
    var data = {
      "menu_items": [
        {"id":1069,"short_name":"L1","name":"Orange Chicken","description":"chunks of chicken, breaded and deep-fried with sauce containing orange peels; white meat by request: for pint $1 extra, for large $2 extra","price_small":null,"price_large":9.75,"small_portion_name":null,"large_portion_name":null},
        {"id":1070,"short_name":"L2","name":"General Tso's Chicken","description":"chunks of chicken, breaded and deep-fried with sauce and scallions; white meat by request: for pint $1 extra, for large $2 extra","price_small":null,"price_large":9.75,"small_portion_name":null,"large_portion_name":null}],
      "category": {"short_name":"L","name":"Lunch","special_instructions":"Sunday-Friday 11:15am-3:00pm. Served with your choice of rice (Vegetable Fried RIce, Steamed Rice, Brown Rice), AND EITHER soup (Hot \u0026 Sour, Wonton, Vegetable, Egg Drop, Chicken Corn Soup) OR veggie egg roll. $1.00 extra to have both soup and egg roll."}
    }

    var deferred = $q.defer();

    $timeout(function () {
      deferred.resolve(data);
    }, 300);

    return deferred.promise;
  };
}

})();
