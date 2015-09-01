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
			invalid: false
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
		invalid: false
	};

	$scope.customerSearch = function() {
		if($scope.customer.name.first === '' || $scope.customer.name.last === '') {
			return;
		}

		var url = 'http://stx.localhost:8888/q/customers/' + $scope.customer.name.first + '/' + $scope.customer.name.last;
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
		$scope.customer.photo = customer.photo;
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
}]);
