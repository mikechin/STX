stx.directive('issuersInfo', ['$q', '$http', '$rootScope', 'configuration', function($q, $http, $rootScope, configuration) {
  'use strict';

  return {
    restrict: 'E',
    scope: {
      show: '=',
      type: '@',
    },
    templateUrl: 'views/templates/issuersInfo.html',
    link: function(scope, elem, attrs) {
      scope.add      = false;
      scope.edit     = false;
      scope.usStates = configuration.usStates;
      scope.i        = null;

      scope.$on('issuer-add', function(event, args) {
        initI();
        scope.add  = true;
        scope.edit = false;
      });

      scope.$on('issuer-edit', function(event, args) {
        scope.i    = angular.copy(args.data);
        scope.add  = false;
        scope.edit = true;
      });

      function initI() {
        scope.i = {
          id:   '',
          name: '',
        };

        scope.editForm.name.$invalid = false;
        scope.editForm.name.$dirty = false;
      }

      // **************************************************
      // private.
      //
      //
      // **************************************************
      function updateIssuer(id) {
        scope.i.id       = id;
        scope.i.add      = false;
        scope.i.selected = true;
        scope.i.info     = false;

        $rootScope.$broadcast('issuer-updated', { data: scope.i });
      }

      // **************************************************
      // public.
      //
      //
      // **************************************************
      scope.insert = function() {
        scope.i.account = scope.issuer.acct;
        scope.i.routing = scope.issuer.transit;
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
          updateIssuer(data.issId);
        }).
        error(function(data, status, headers, config) {
          console.log('error.');
        });
      };

      scope.cancel = function() {
        scope.show = false;
      };

      scope.update = function() {
        var url = 'http://stx.localhost:8888/q/issuer/update/' + scope.i.id;
        $http({
          method: 'PUT',
          url: url,
          headers: {
            'Accept':       'application/json',
            'Content-Type': 'application/json'
          },
          data: scope.i
        }).
        success(function(data, status, headers, config) {
          console.log('success update.', data);
          updateIssuer(data.issId);
        }).
        error(function(data, status, headers, config) {
          console.log('error.');
        });
      };
    }
  };
}]);
