stx.controller('IssuersController', ['$scope', '$http', function($scope, $http) {
	'use strict';

	// **************************************************
	// private.
	//
	//
	// **************************************************

	// **************************************************
	// public.
	//
	//
	// **************************************************
	$scope.search = {
		name: '',
		account: '',
		search: false
	};

	$scope.issuer = {
		id: '',
		name: '',
		account: '',
		selected: false
	};

	$scope.issuers = [];

	$scope.cleanInput = function(input) {
		$scope.search[input] = '';
		$scope.issuersForm[input].$dirty = false;
	};

	$scope.issuersSearch = function() {
		if(!$scope.search.name && !$scope.search.account) {
			if(!$scope.search.name) {
				$scope.issuersForm.name.$invalid = true;
				$scope.issuersForm.name.$dirty = true;
			}

			if(!$scope.search.account) {
				$scope.issuersForm.account.$invalid = true;
				$scope.issuersForm.account.$dirty = true;
			}

			return;
		}
		else {
			$scope.issuersForm.name.$dirty = false;
			$scope.issuersForm.account.$dirty = false;
		}

		var url = 'http://stx.localhost:8888/q/issuers/';
		if($scope.search.name !== '' && $scope.search.account !== '') {
			url += $scope.search.name + '/' + $scope.search.account;
		}
		else if($scope.search.name !== '') {
			url += $scope.search.name;
		}
		else {
			url += 'acct/' + $scope.search.account;
		}

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
			$scope.issuers = data.issuers;
			$scope.search.search = true;
		}).
		error(function(data, status, headers, config) {
			console.log('error.');
		});
	};

	$scope.issuerSelect = function(i) {
		var issuer = $scope.issuers[i];

		$scope.issuer.id       = issuer.issId;
		$scope.issuer.name     = issuer.name;
		$scope.issuer.address1 = issuer.address1;
		$scope.issuer.address2 = issuer.address2;
		$scope.issuer.city     = issuer.city;
		$scope.issuer.state    = issuer.state;
		$scope.issuer.zipcode  = issuer.zipcode;
		$scope.issuer.warn     = issuer.warn;
		$scope.issuer.danger   = issuer.danger;
		$scope.search.search   = false;
		$scope.issuer.selected = true;

		var url = 'http://stx.localhost:8888/q/checks/issuer/' + $scope.issuer.id;
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
			$scope.checks = data.checks;
		}).
		error(function(data, status, headers, config) {
			console.log('error.');
		});
	};

	$scope.reportIssuer = function(level) {
		var url = 'http://stx.localhost:8888/q/alert/issuer/' + $scope.issuer.id + '/' + level;
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
				$scope.issuer.warn   = true;
				$scope.issuer.danger = false;
			}
			else if(level === 2) {
				$scope.issuer.warn   = false;
				$scope.issuer.danger = true;
			}
			else {
				$scope.issuer.warn   = false;
				$scope.issuer.danger = false;
			}
		}).
		error(function(data, status, headers, config) {
			console.log('error.');
		});
	};
}]);
