stx.directive('checkList', ['$q', '$http', 'configuration', function($q, $http, configuration) {
  'use strict';

  return {
    restrict: 'E',
    scope: {
      show:    '=',
      list:    '=',
      options: '='
    },
    templateUrl: 'views/templates/checkList.html',
    link: function(scope, elem, attrs) {
      function init() {
      }

      init();

      // **************************************************
      // private.
      //
      // **************************************************

      // **************************************************
      // public.
      //
      // **************************************************
      scope.delete = function(id, index) {
        $http({
          method: 'DELETE',
          url: 'http://' + configuration.storage.hostUrl + '/q/check/delete/' + id,
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
        }).
        success(function(data, status, headers, config) {
          console.log('success.');
          console.log(data, index);
          scope.list.splice(index, 1);
        }).
        error(function(data, status, headers, config) {
          console.log('error.');
          console.log(data);
        });
      }
    }
  };
}]);
