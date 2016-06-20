angular.module('mol.facets', [])
  .directive('molFacets', [function() {
    return {
      restrict: 'E',
      templateUrl: 'static/app/views/mol-facets/partials/mol-facets.html',
      scope: {
        facets: '=',
        choices: '='
      },
      link: function(scope) {
        scope.$watch('facets', scope.updateValuesToLabels);
        scope.$watch('choices', scope.updateBadges, true);
      },
      controller: ['$scope', function($scope) {
        $scope.badges = [];
        $scope.getColumn = function(col) {
          return function(row) {
            return row[col];
          }
        };
        $scope.updateValuesToLabels = function() {
          if (!$scope.facets) { return; }
          $scope.values2labels = {};
          $scope.facets.fields.forEach(function(field, f) {
            if (field.facet) {
              $scope.values2labels[field.value] = {};
              $scope.facets.rows.forEach(function(row) {
                row[f].forEach(function(item) {
                  $scope.values2labels[field.value][item.value] = item.title;
                });
              });
            }
          });
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
        $scope.badges4facet = function(facetValue) {
          return Object.keys($scope.choices[facetValue]).filter(function(choice) {
              return $scope.choices[facetValue][choice];
          }).reduce(function(prev, curr) {
              prev.push({
                facet: facetValue,
                value: curr,
                title: $scope.values2labels[facetValue][curr]
              });
              return prev;
            }, []);
        };
        $scope.updateBadges = function() {
          if (!$scope.values2labels) { $scope.badges = []; }
          $scope.badges = Object.keys($scope.choices).reduce(function(prev, curr) {
            return prev.concat($scope.badges4facet(curr));
          }, []);
        };
      }]
    };
  }]);
