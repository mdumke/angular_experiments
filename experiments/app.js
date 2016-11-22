(function () {

'use strict';

angular
  .module('TestApp', ['ui.router'])
  .config(RouterConfig);


RouterConfig.$inject = ['$stateProvider', '$urlRouterProvider'];

function RouterConfig($stateProvider, $urlRouterProvider) {
  $stateProvider
    .state('tab1', {
      url: '/tab1',
      template: 'content 1'
    })
    .state('tab2', {
      url: '/tab2',
      template: 'content 2'
    });

  $urlRouterProvider.otherwise('/tab1');
}

})();
