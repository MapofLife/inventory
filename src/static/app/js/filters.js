angular.module('mol.inventory')
  .filter('trustUrl', function($sce) {
    return function(url) {
      return $sce.trustAsResourceUrl(url);
    };
  })
  .filter('unsafe', function($sce) {
    return function(str) {
      return $sce.trustAsHtml(str);
    };
  })
  .filter('choiceFilter', function() {
    return function(rows, choices, fields) {
      if (!rows) { return true; }
      return rows.filter(function(row) {
        return row.every(function(column, c) {
          var object = choices[fields[c].value];
          if (!object) { return true; }
          var choice = [];
          for (var property in object) {
            if (object.hasOwnProperty(property) && object[property]) {
              choice.push(property);
            }
          }
          if (!choice.length) { return true; }
          return column.some(function(datum) {
            return choice.some(function(value) { return value === datum.value });
          });
        });
      });
    };
  });
