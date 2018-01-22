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

        scope.i.account = args.acct;
        scope.i.routing = args.transit;
      });

      scope.$on('issuer-edit', function(event, args) {
        scope.i    = angular.copy(args.data);
        scope.add  = false;
        scope.edit = true;
      });

      function initI() {
        scope.i = {
          id:      '',
          name:    '',
          notes:   '',
          account: '',
          routing: '',
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
        if(scope.editForm.$invalid) {
          var cont = true;

          if(scope.i.name === '') {
            scope.editForm.name.$invalid = true;
            scope.editForm.name.$dirty = true;
            cont = false;
          }

          if(!cont) {
            return;
          }
        }

        var url = 'http://' + configuration.storage.hostUrl + '/q/issuer/add';
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
        var url = 'http://' + configuration.storage.hostUrl + '/q/issuer/update/' + scope.i.id;
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
