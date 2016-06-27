var module = angular.module('mol.inventory-controllers', []);

module.controller('inventoryCtrl',
    ['$scope', 'leafletData', '$timeout', '$window', '$http', '$filter', 'MOLApi',
    function($scope, leafletData, $timeout, $window, $http, $filter, MOLApi) {

  $scope.model = {
      choices: undefined,
      facets: undefined
  };

  $scope.initialize = function() {
    MOLApi('inventory/datasets').then(function(response) {
      $scope.model.facets = response.data;
    });
  };


  $scope.getValue = function(row, columnName) {
    var index = $scope.facets.fields.reduce(function(prev, curr, i) {
      return curr.value == columnName ? i : prev;
    }, -1);
    return row[index].map(function(item) { return item.value; }).join(' ');
  };

  $scope.sortColumn = 0;
  $scope.reverse = false;

  $scope.toggleSort = function(i) {
    if (i == $scope.sortColumn) {
      $scope.reverse = ! $scope.reverse;
    } else {
      $scope.sortColumn = i;
      $scope.reverse = false;
    }
  };

  $scope.columnValue = function(row) {
    return row[$scope.sortColumn].map(function(v) { return v.title; }).join(' ');
  };

  $scope.initialize();
}]);
