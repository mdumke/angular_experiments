(function () {

  'use strict';

  angular
    .module('LunchCheck', [])
    .controller('LunchCheckController', LunchCheckController);

  LunchCheckController.$inject = ['$scope'];

  function LunchCheckController ($scope) {

    // sets the message accorging to how many food items are on the list
    $scope.updateMessage = function () {
      var numItems = countMenuItems($scope.lunchMenu);

      if (numItems < 1) {
        $scope.message = "Please enter data first";
        $scope.inputModifier = "--invalid";
        $scope.messageModifier = "";
      }
      else if (numItems < 4) {
        $scope.message = "Enjoy!";
        $scope.inputModifier = "--valid";
        $scope.messageModifier = "--accepted";
      }
      else {
        $scope.message = "Too much!";
        $scope.inputModifier = "--valid";
        $scope.messageModifier = "--warning";
      }
    }



    // returns the number of comma-separated words, ignoring empty strings
    var countMenuItems = function (menuString) {
      if (!menuString) return 0;

      return menuString
        .split(',')
        .map(stripWhitespace)
        .filter(nonEmptyString)
        .length;
    }

    // returns true if the given string is not empty
    var nonEmptyString = function (str) {
      return !!str;
    }

    // returns the given string without leading or trailing whitespace
    var stripWhitespace = function (str) {
      return str.trim();
    }

  }

})()
