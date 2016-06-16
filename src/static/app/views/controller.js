var module = angular.module('mol.inventory-controllers', []);

module.controller('inventoryCtrl',
    ['$scope', 'leafletData', '$timeout', '$window', '$http', '$filter', 'MOLApi',
    function($scope, leafletData, $timeout, $window, $http, $filter, MOLApi) {

  $scope.choices = {};

  $scope.map = {
    center: { lat: 0, lng: 0, zoom: 3 },
    events: { map: { enable: ['click'], logic: 'emit' } },
    layers: {
      baselayers: {
        xyz: {
          name: 'OpenStreetMap (XYZ)',
          url: 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
          type: 'xyz'
        }
      }
    }
  };

  $scope.initialize = function() {
    $scope.$watch('choices', function() {
      $scope.inventoryQuery();
    }, true);
    MOLApi('inventory/datasets').then(function(response) {
      $scope.facets = response.data;
    });
  };

  $scope.inventoryQuery = function() {
    var params = Object.keys($scope.choices).map(function (facet) {
      var choices = $scope.choices[facet];
      var params = Object.keys(choices || {}).filter(function(choice) { return choices[choice] }).join(',');
      return params ? facet + '=' + params : '';
    }).filter(function(param) { return param; }).join('&');

    if (!params) {
      $scope.map.layers.overlays = {};
    } else {
      var url = 'http://api.mol.org/1.0/inventory/maps?' + params + '&callback=JSON_CALLBACK';
      $http.jsonp(url).then(function(response) {
       $scope.map.layers.overlays = {
         xyz: {
           name: 'Datasets',
           visible: true,
           url: response.data.tile_url,
           type: 'xyz',
           doRefresh: true
         }
       };
      });
    }
  };

  $scope.initialize();
}]);
