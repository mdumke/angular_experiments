(function () {
  'use strict';

  angular
    .module('TodoApp', [])
    .controller('TodolistController', TodolistController);

  function TodolistController ($scope, $filter) {
    $scope.content = "abc";

    $scope.upcaseContent = function () {
      $scope.content = $filter('uppercase')($scope.content);
    };
  }

})()
