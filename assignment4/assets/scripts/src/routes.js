(function () {
'use strict';

angular
  .module('MenuApp')
  .config(RoutesConfig);

RoutesConfig.$inject = ['$stateProvider', '$urlRouterProvider'];

function RoutesConfig($stateProvider, $urlRouterProvider) {

  /* configure states */
  $stateProvider

  /* home state */
  .state('home', {
    url: '/',
    templateUrl: 'assets/scripts/src/modules/menuapp/menuapp.template.home.html'
  });

  /* configure url-routing */
  $urlRouterProvider.otherwise('/');
}

})();
