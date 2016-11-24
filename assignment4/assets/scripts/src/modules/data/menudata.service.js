(function () {
'use strict';

angular
  .module('data')
  .service('MenuDataService', MenuDataService);

MenuDataService.$inject = ['$q', '$timeout'];

function MenuDataService ($q, $timeout) {
  var service = this;

  /* returns a promise to retrieve the categories-json from the server */
  service.getAllCategories = function () {
    var deferred = $q.defer();

    var data = [
      {
        "id":81, "short_name":"L", "name":"Lunch",
        "special_instructions":"Sunday-Friday 11:15am-3:00pm. Served with your choice of rice (Vegetable Fried RIce, Steamed Rice, Brown Rice), AND EITHER soup (Hot \u0026 Sour, Wonton, Vegetable, Egg Drop, Chicken Corn Soup) OR veggie egg roll. $1.00 extra to have both soup and egg roll.","url":"https://davids-restaurant.herokuapp.com/categories/81.json"
      },{
        "id":82,"short_name":"A","name":"Soup","special_instructions":"",
        "url":"https://davids-restaurant.herokuapp.com/categories/82.json"
      }
    ]

    $timeout(function () {
      deferred.resolve(data);
    }, 300);

    return deferred.promise;
  };

  /* returns a promise to retrieve json for the specified category */
  service.getItemsForCategory = function (categoryShortName) {
    // TODO
  };
}

})();
