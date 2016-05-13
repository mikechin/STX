stx.directive('customersInfo', ['$q', '$http', 'configuration', function($q, $http, configuration) {
  'use strict';

  return {
    restrict: 'E',
    scope: {
      show: '=',
      customer: '=',
      type: '@'
    },
    templateUrl: 'views/templates/customersInfo.html',
    link: function(scope, elem, attrs) {
      scope.add = false;
      scope.edit = false;
      scope.usStates = configuration.usStates;
      scope.c = null;

      function init() {
        if(scope.type === 'add') {
          initC();
          scope.add = true;
        }
        else {
          scope.edit = true;
        }
      }

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
        scope.editForm.firstname.$dirty = false;

        scope.editForm.lastname.$invalid = false;
        scope.editForm.lastname.$dirty = false;
      }

      init();

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
            scope.editForm.firstname.$dirty = true;
            cont = false;
          }

          if(!scope.c.name.last || scope.c.name.last === '') {
            scope.editForm.lastname.$invalid = true;
            scope.editForm.lastname.$dirty = true;
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

      function updateCustomer() {
        scope.customer = angular.copy(scope.c);
        initC();
      }

      // **************************************************
      // public.
      //
      //
      // **************************************************
      scope.add = function() {
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
            updateCustomer();
            scope.customer.id = data.cusId;
            scope.customer.add = false;
            scope.customer.selected = true;
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
        scope.c = angular.copy(scope.customer);

        uploadPhoto().then(function() {
          var url = 'http://stx.localhost:8888/q/customer/update/' + scope.customer.id;
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
          }).
          error(function(data, status, headers, config) {
            console.log('error.');
          });
        });
      };
    }
  };
}]);