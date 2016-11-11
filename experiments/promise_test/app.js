var app = angular.module('ListApp', [])

app.controller('ListController', ['ListService', function (ListService) {
  var list = this;

  list.items = ListService.getItems();

  list.addItem = function () {
    promise = ListService.addItem(list.newItem);

    promise
      .then(function () {
        list.newItem = '';
      })
      .catch (function (error) {
        console.log(error);
      })
  };

}]);

app.service('ListService', ['NameCheckingService', '$q', function (NameCheckingService, $q) {
  var service = this;

  service.list = [];

  service.getItems = function () {
    return service.list;
  };

  service.addItem = function (itemName) {
    var deferred = $q.defer();

    var checkingPromise = NameCheckingService.checkName(itemName);

    checkingPromise
      .then(function () {
        service.list.push(itemName);
        deferred.resolve();
      })
      .catch (function (error) {
        deferred.reject(error);
      })

    return deferred.promise;
  };

}]);

app.service('NameCheckingService', ['$timeout', '$q', function ($timeout, $q) {
  var service = this;

  service.checkName = function (name) {
    var deferred = $q.defer();

    $timeout(function () {
      if (name && name.length > 3) {
        deferred.resolve();
      } else {
        deferred.reject("Name is not long enough");
      }
    }, 1000);

    return deferred.promise;
  };
}]);
