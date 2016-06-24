'use strict';

angular.module('mol.inventory', [
  'ui.router',
  'ui-leaflet',
  'angular-loading-bar',
  'angular.filter',
  'ngResource',
  'ngSanitize',
  'ngAnimate',
  'ui.bootstrap',
  'mol.facets',
  'mol.api',
  'mol.services',
  'mol.loading-indicator',
  'mol.inventory-controllers',
])
.config(['cfpLoadingBarProvider', function(cfpLoadingBarProvider) {
    cfpLoadingBarProvider.includeSpinner = false;
    cfpLoadingBarProvider.includeBar = false;
    //cfpLoadingBarProvider.includeBar = false;
    cfpLoadingBarProvider.latencyThreshold = 500;
  }])
.config(['$httpProvider', '$locationProvider', '$sceDelegateProvider', '$urlRouterProvider', '$stateProvider',
            function($httpProvider, $locationProvider, $sceDelegateProvider, $urlRouterProvider, $stateProvider) {
  $httpProvider.defaults.withCredentials = false;
  $locationProvider.html5Mode(true);
  $sceDelegateProvider.resourceUrlWhitelist([
    'self',
    'http*://localhost**',
    'http*://*mol.org/**',
    'http*://api.mol.org/1.0/inventory/**',
    'http*://api.mol.org/1.0/datasets/**',
    'http*://mapoflife.github.io/**',
  ]);
  $urlRouterProvider.otherwise("/table");
  $stateProvider
    .state(
      'inventory',
      {
         abstract: true,
         templateUrl: 'static/app/views/main.html',
         controller: 'inventoryCtrl',
      }
    )
    .state(
      'inventory.map',
      {
        title: "Dataset Inventory Map",
        views: {
          "" : { templateUrl: "static/app/views/map/main.html"}
        },
        url: '/map'
      }
    )
    .state(
      'inventory.table',
      {
        title: "Dataset Inventory Table",
        views: {
          "" : { templateUrl: "static/app/views/table/main.html"}
        },
        url: '/table'
      }
    )
    .state(
      'inventory.info',
      {
        title: 'Dataset Info',
        views: {
          "": {
            templateUrl: "static/app/views/info/info.html",
            controller: 'molInventoryInfoCtrl'
          }
        },
        url: '/info/{dataset}'
      }
    );
    $locationProvider.html5Mode(true);
}]).factory('MOLApi', ['$http', function($http) {
		return function(service, params, method, canceller, loading) {
			loading = (typeof loading === undefined) ? false : loading;
			return $http({
				method: method || 'GET',
        url: 'https://api.mol.org/1.0/{0}'.format(service),
				params: params,
				withCredentials: false,
				cache: true,
				timeout: canceller ? canceller.promise : undefined,
				ignoreLoadingBar: loading
			});
		};
	}
]);
