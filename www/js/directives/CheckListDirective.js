stx.directive('checkList', ['$q', '$http', function($q, $http) {
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
    }
  };
}]);
