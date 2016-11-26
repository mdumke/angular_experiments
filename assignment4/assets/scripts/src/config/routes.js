(function () {
'use strict';

angular
  .module('MenuApp')
  .config(RoutesConfig);

RoutesConfig.$inject = ['$stateProvider', '$urlRouterProvider'];

function RoutesConfig ($stateProvider, $urlRouterProvider) {

  /* configure states */
  $stateProvider

  /* home state */
  .state('home', {
    url: '/',
    templateUrl: 'assets/scripts/src/modules/menuapp/home.template.html'
  })

  /* categories state */
  .state('categories', {
    url: '/categories',
    controller: 'CategoriesController as categories',
    templateUrl: 'assets/scripts/src/modules/menuapp/categories.template.html',
    resolve: {
      categoriesData: ['MenuDataService', function (MenuDataService) {
        return MenuDataService.getAllCategories();
      }]
    }
  });

  /* configure url-routing */
  $urlRouterProvider.otherwise('/');
}

})();
