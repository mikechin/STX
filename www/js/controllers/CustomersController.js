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
		edit: false,
		invalid: false
	};

	$scope.customerEdit = function() {
		$scope.editCustomer = {
			id: $scope.customer.id,
			photo: $scope.customer.photo,
			name: {
				first: $scope.customer.name.first,
				last: $scope.customer.name.last
			},
			address1: $scope.customer.address1,
			address2: $scope.customer.address2,
			city: $scope.customer.city,
			state: $scope.customer.state,
			phone: $scope.customer.phone,
			zipcode: parseInt($scope.customer.zipcode)
		};

		$scope.customer.edit = true;
	};

	$scope.customerSearch = function() {
		if($scope.customer.name.first === '' || $scope.customer.name.last === '') {
			if($scope.customer.name.first === '') {
				$scope.customerForm.firstname.$invalid = true;
				$scope.customerForm.firstname.$dirty = true;
			}

			if($scope.customer.name.last === '') {
				$scope.customerForm.lastname.$invalid = true;
				$scope.customerForm.lastname.$dirty = true;
			}

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
