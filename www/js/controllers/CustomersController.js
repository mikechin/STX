stx.controller('CustomersController', ['$scope', '$http', 'configuration', function($scope, $http, configuration) {
  'use strict';

  // **************************************************
  // private.
  //
  //
  // **************************************************
  function initCustomer() {
    $scope.customer = {
      id: '',
      name: {
        first: '',
        last: ''
      },
      photo: null,
      search: false,
      selected: false,
      invalid: false,
      add: false
    };
  }

  // **************************************************
  // public.
  //
  //
  // **************************************************
  $scope.customers = [];
  $scope.checks = [];

  $scope.customer = {
    id: '',
    name: {
      first: '',
      last: ''
    },
    photo: null,
    search: false,
    selected: false,
    invalid: false,
    info: false,
  };

  $scope.search = {
    name: {
      first: '',
      last: ''
    }
  };

  $scope.customerNew = function() {
    $scope.customer.info     = true;
    $scope.customer.selected = false;
    $scope.customer.search   = false;
    $scope.customers         = [];
    $scope.checks            = [];

    $scope.$broadcast('customer-add');
  };

  $scope.customerEdit = function() {
    $scope.customer.info     = true;
    $scope.customer.selected = false;
    $scope.customer.search   = false;

    $scope.$broadcast('customer-edit', { data: $scope.customer });
  };

  $scope.$on('customer-updated', function(event, args) {
    $scope.customer = angular.copy(args.data);
  });

  $scope.customerSearch = function() {
    $scope.customer.info = false;

    if($scope.search.name.first === '' && $scope.search.name.last === '') {
      $scope.customerForm.firstname.$invalid = true;
      $scope.customerForm.firstname.$dirty   = true;
      $scope.customerForm.lastname.$invalid  = true;
      $scope.customerForm.lastname.$dirty    = true;

      return;
    }
    else {
      $scope.customerForm.firstname.$invalid = false;
      $scope.customerForm.lastname.$invalid  = false;
    }

    var url = 'http://' + configuration.storage.hostUrl + '/q/customers/name';
    $http({
      method: 'GET',
      url: url,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      params: {
        firstname: $scope.search.name.first,
        lastname:  $scope.search.name.last,
      },
    }).
    success(function(data, status, headers, config) {
      console.log('success.', data);
      $scope.customers       = data.customers;
      $scope.customer.search = true;
    }).
    error(function(data, status, headers, config) {
      console.log('error.');
    });
  };

  $scope.customerSelect = function(i) {
    var customer = $scope.customers[i];

    $scope.customer.id         = customer.cusId;
    $scope.customer.name.first = customer.firstname;
    $scope.customer.name.last  = customer.lastname;
    $scope.customer.address1   = customer.address1;
    $scope.customer.address2   = customer.address2;
    $scope.customer.city       = customer.city;
    $scope.customer.state      = customer.state;
    $scope.customer.zipcode    = parseInt(customer.zipcode);
    $scope.customer.phone      = customer.phone;
    $scope.customer.photo      = customer.photo;
    $scope.customer.notes      = customer.comment;
    $scope.customer.warn       = customer.warn;
    $scope.customer.danger     = customer.danger;
    $scope.customer.search     = false;
    $scope.customer.selected   = true;

    var url = 'http://' + configuration.storage.hostUrl + '/q/checks/customer/' + $scope.customer.id;
    $http({
      method: 'GET',
      url: url,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    }).
    success(function(data, status, headers, config) {
      console.log('success.');
      console.log(data);
      $scope.checks = data.checks;
    }).
    error(function(data, status, headers, config) {
      console.log('error.');
    });
  };

  $scope.reportCustomer = function(level) {
    var url = 'http://' + configuration.storage.hostUrl + '/q/alert/customer/' + $scope.customer.id + '/' + level;
    $http({
      method: 'PUT',
      url: url,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    }).
    success(function(data, status, headers, config) {
      console.log('success.', data);
      if(level === 1) {
        $scope.customer.warn   = true;
        $scope.customer.danger = false;
      }
      else if(level === 2) {
        $scope.customer.warn   = false;
        $scope.customer.danger = true;
      }
      else {
        $scope.customer.warn   = false;
        $scope.customer.danger = false;
      }
    }).
    error(function(data, status, headers, config) {
      console.log('error.');
    });
  };
}]);
