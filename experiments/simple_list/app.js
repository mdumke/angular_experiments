(function () {

'use strict';

angular
  .module('MoviesApp', [])
  .controller('MovieListController', MovieListController)
  .factory('ListService', ListServiceFactory);

MovieListController.$inject = ['ListService'];

function MovieListController (ListService) {
  var movies = this;
  var listService = ListService();

  movies.list = listService.getItems();

  movies.keydown = function (input) {
    if (event.keyIdentifier == 'Enter')
      movies.addMovie();
  }

  movies.addMovie = function () {
    listService.addItem(movies.newMovie);
    movies.newMovie = "";
  }
}

function ListServiceFactory () {
  var factory = function () {
    return new ListService();
  }

  return factory;
}


function ListService () {
  var service = this;

  var items = [];

  service.getItems = function () {
    return items;
  };

  service.addItem = function (itemName) {
    items.push(itemName);
  };
}

})();
