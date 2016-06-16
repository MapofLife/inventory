angular.module('mol.facets', [])
  .directive('molFacets', [function() {
    return {
      restrict: 'E',
      templateUrl: 'static/app/views/mol-facets/partials/mol-facets.html',
      scope: {
        facets: '=',
        choices: '='
      },
      controller: ['$scope', function($scope) {
        $scope.getColumn = function(col) {
          return function(row) {
            return row[col];
          }
        };
        $scope.anyFacetChoice = function(facetChoices) {
          facetChoices = facetChoices || {};
          return Object.keys(facetChoices).reduce(function(prev, curr) {
            return prev + +facetChoices[curr];
          }, 0);
        };
        $scope.anyChoice = function() {
          return Object.keys($scope.choices).reduce(function(prev, curr) {
            return prev + $scope.anyFacetChoice($scope.choices[curr]);
          }, 0);
        };
      }]
    };
  }]);
