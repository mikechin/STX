stx.directive('issuersInfo', ['$q', '$http', 'configuration', function($q, $http, configuration) {
  'use strict';

  return {
    restrict: 'E',
    scope: {
      show:   '=',
      issuer: '=',
      type:   '@'
    },
    templateUrl: 'views/templates/issuersInfo.html',
    link: function(scope, elem, attrs) {
      scope.add      = false;
      scope.edit     = false;
      scope.usStates = configuration.usStates;
      scope.i        = null;

      function init() {
        if(scope.type === 'add') {
          initI();
          scope.add = true;
          scope.edit = false;
        }

        if(scope.type === 'edit') {
          scope.i = scope.issuer;
          scope.add = false;
          scope.edit = true;
        }
      }

      function initI() {
        scope.i = {
          id:      '',
          name:    '',
        };

        scope.editForm.name.$invalid = false;
        scope.editForm.name.$dirty = false;
      }

      init();

      // **************************************************
      // private.
      //
      //
      // **************************************************
      function updateIssuer() {
        scope.issuer = angular.copy(scope.i);
        initI();
      }

      // **************************************************
      // public.
      //
      //
      // **************************************************
      scope.insert = function() {
        scope.i.account = scope.issuer.acct;
        scope.i.routing = scope.issuer.transit;
        console.log('s', scope.i);
        var url = 'http://stx.localhost:8888/q/issuer/add';
        $http({
          method: 'POST',
          url: url,
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
          data: scope.i,
        }).
        success(function(data, status, headers, config) {
          console.log('success add.', data);
          updateIssuer();
          scope.issuer.id = data.issId;
          scope.issuer.add = false;
          scope.issuer.selected = true;
        }).
        error(function(data, status, headers, config) {
          console.log('error.');
        });
      };

      scope.cancel = function() {
        scope.show = false;
      };

      scope.update = function() {
        var url = 'http://stx.localhost:8888/q/issuer/update/' + scope.issuer.id;
        $http({
          method: 'PUT',
          url: url,
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          data: scope.c
        }).
        success(function(data, status, headers, config) {
          console.log('success update.', data);
          updateIssuer();
          scope.issuer.edit = false;
        }).
        error(function(data, status, headers, config) {
          console.log('error.');
        });
      };
    }
  };
}]);
