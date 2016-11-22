(function () {

'use strict';

angular
  .module('SubjectsApp', [])
  .controller('ListController', ListController)
  .directive('list', ListDirective);

function ListController () {
  var list = this;

  list.subjects = ['AI', 'Computer Security', 'MEAN Stack', 'Algorithms'];

  list.remove = function (idx) {
    list.subjects.splice(idx, 1);
  }
}

function ListDirective () {
  var ddo = {
    restrict: 'E',
    templateUrl: 'list.html',
    scope: {
      listItems: '<subjects',
      title: '@',
      dremove: '&remove'
    }
  };

  return ddo;
}

})();
