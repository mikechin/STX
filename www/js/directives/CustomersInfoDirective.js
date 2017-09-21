stx.directive('customersInfo', ['$q', '$http', '$rootScope', 'configuration', function($q, $http, $rootScope, configuration) {
  'use strict';

  return {
    restrict: 'E',
    scope: {
      show:     '=',
      type:     '@'
    },
    templateUrl: 'views/templates/customersInfo.html',
    link: function(scope, elem, attrs) {
      scope.add      = false;
      scope.edit     = false;
      scope.usStates = configuration.usStates;
      scope.c        = null;

      scope.$on('customer-add', function(event, args) {
        initC();
        scope.add  = true;
        scope.edit = false;
      });

      scope.$on('customer-edit', function(event, args) {
        scope.c    = angular.copy(args.data);
        scope.add  = false;
        scope.edit = true;
      });

      function initC() {
        scope.c = {
          name: {
            first: '',
            last: ''
          },
          address1: '',
          address2: '',
          city: '',
          state: '',
          zipcode: '',
          phone: '',
          photo: null
        };

        scope.editForm.firstname.$invalid = false;
        scope.editForm.firstname.$dirty   = false;

        scope.editForm.lastname.$invalid = false;
        scope.editForm.lastname.$dirty   = false;
      }

      // **************************************************
      // private.
      //
      //
      // **************************************************
      function uploadPhoto() {
        var d = $q.defer();

        if(scope.editForm.$invalid) {
          var cont = true;

          if(!scope.c.name.first || scope.c.name.first === '') {
            scope.editForm.firstname.$invalid = true;
            scope.editForm.firstname.$dirty   = true;
            cont = false;
          }

          if(!scope.c.name.last || scope.c.name.last === '') {
            scope.editForm.lastname.$invalid = true;
            scope.editForm.lastname.$dirty   = true;
            cont = false;
          }

          if(!cont) {
            d.reject();
          }
        }

        var upload = $q.defer();
        var ele = document.getElementById('upload-photo');
        if(ele.files.length) {
          var f = ele.files[0];
          var r = new FileReader();

          r.onloadend = function(e) {
            var data = e.target.result;
            scope.c.photo = data;
            upload.resolve();
          };

          r.readAsDataURL(f);
        }
        else {
          upload.resolve();
        }

        $q.all([ upload.promise ]).then(function() {
          console.log('photo uploaded.', scope.c);

          d.resolve();
        });

        return d.promise;
      }

      function updateCustomer(id) {
        scope.c.id       = id;
        scope.c.selected = true;
        scope.c.info     = false;
        $rootScope.$broadcast('customer-updated', { data: scope.c });
      }

      // **************************************************
      // public.
      //
      //
      // **************************************************
      scope.insert = function() {
        uploadPhoto().then(function() {
          var url = 'http://stx.localhost:8888/q/customer/add';
          $http({
            method: 'POST',
            url: url,
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            },
            data: scope.c
          }).
          success(function(data, status, headers, config) {
            console.log('success add.', data);
            updateCustomer(data.cusId);
          }).
          error(function(data, status, headers, config) {
            console.log('error.');
          });
        });
      };

      scope.cancel = function() {
        scope.show = false;
        document.getElementById('upload-photo').value = '';
      };

      scope.update = function() {
        uploadPhoto().then(function() {
          var url = 'http://stx.localhost:8888/q/customer/update/' + scope.c.id;
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
            updateCustomer(data.cusId);
          }).
          error(function(data, status, headers, config) {
            console.log('error.');
          });
        });
      };
    }
  };
}]);
