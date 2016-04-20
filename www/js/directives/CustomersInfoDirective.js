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

      function init() {
        if(scope.type === 'add') {
          scope.add = true;
        }
        else {
          scope.edit = true;
        }
      }

      init();

      scope.cancel = function() {
        scope.show = false;
      };

      scope.update = function() {
        if(scope.editForm.$invalid) {
          var cont = true;

          if(!scope.customer.name.first || scope.customer.name.first === '') {
            scope.editForm.firstname.$invalid = true;
            scope.editForm.firstname.$dirty = true;
            cont = false;
          }

          if(!scope.customer.name.last || scope.customer.name.last === '') {
            scope.editForm.lastname.$invalid = true;
            scope.editForm.lastname.$dirty = true;
            cont = false;
          }

          if(!cont) {
            return;
          }
        }

        var upload = $q.defer();

        var ele = document.getElementById('upload-photo');
        if(ele.files.length) {
          var f = ele.files[0];
          var r = new FileReader();

          r.onloadend = function(e) {
            var data = e.target.result;
            scope.customer.photo = data;
            upload.resolve();
          };

          r.readAsDataURL(f);
        }
        else {
          upload.resolve();
        }

        $q.all([ upload.promise ]).then(function() {
          console.log('photo uploaded.', scope.customer);

          var url = 'http://stx.localhost:8888/q/customer/update/' + scope.customer.id;
          $http({
            method: 'PUT',
            url: url,
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            },
            data: scope.customer
          }).
          success(function(data, status, headers, config) {
            console.log('success.');
            console.log(data);
          }).
          error(function(data, status, headers, config) {
            console.log('error.');
          });
        });
      };
    }
  };
}]);