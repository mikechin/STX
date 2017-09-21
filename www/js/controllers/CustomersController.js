stx.controller('CustomersController', ['$scope', '$http', function($scope, $http) {
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
    edit: false,
    invalid: false,
    add: false
  };

  $scope.search = {
    name: {
      first: '',
      last: ''
    }
  };

  $scope.customerNew = function() {
    $scope.customer.add = true;
    $scope.customer.edit = false;
    $scope.customer.selected = false;
    $scope.customer.search = false;
    $scope.customers = [];
  };

  $scope.customerEdit = function() {
    $scope.customer.zipcode = parseInt($scope.customer.zipcode);

    $scope.customer.add = false;
    $scope.customer.edit = true;
  };

  $scope.customerSearch = function() {
    $scope.customer.add = false;
    $scope.customer.edit = false;

    if($scope.search.name.first === '' || $scope.search.name.last === '') {
      if($scope.search.name.first === '') {
        $scope.customerForm.firstname.$invalid = true;
        $scope.customerForm.firstname.$dirty = true;
      }

      if($scope.search.name.last === '') {
        $scope.customerForm.lastname.$invalid = true;
        $scope.customerForm.lastname.$dirty = true;
      }

      return;
    }

    var url = 'http://stx.localhost:8888/q/customers/' + $scope.search.name.first + '/' + $scope.search.name.last;
    $http({
      method: 'GET',
      url: url,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    }).
    success(function(data, status, headers, config) {
      console.log('success.', data);
      $scope.customers = data.customers;
      $scope.customer.search = true;
    }).
    error(function(data, status, headers, config) {
      console.log('error.');
    });
  };

  $scope.customerSelect = function(i) {
    var customer = $scope.customers[i];

    $scope.customer.id = customer.cusId;
    $scope.customer.name.first = customer.firstname;
    $scope.customer.name.last = customer.lastname;
    $scope.customer.address1 = customer.address1;
    $scope.customer.address2 = customer.address2;
    $scope.customer.city = customer.city;
    $scope.customer.state = customer.state;
    $scope.customer.zipcode = customer.zipcode;
    $scope.customer.phone = customer.phone;
    $scope.customer.photo = customer.photo;
    $scope.customer.comment = customer.comment;
    $scope.customer.warn = customer.warn;
    $scope.customer.danger = customer.danger;
    $scope.customer.search = false;
    $scope.customer.selected = true;

    var url = 'http://stx.localhost:8888/q/checks/customer/' + $scope.customer.id;
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
    var url = 'http://stx.localhost:8888/q/alert/customer/' + $scope.customer.id + '/' + level;
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
