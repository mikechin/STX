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
	$scope.issuer = {
		id: '',
		name: '',
		account: '',
		search: false
	};

	$scope.issuers = [];

	$scope.cleanInput = function(input) {
		$scope.issuer[input] = '';
		$scope.issuersForm[input].$dirty = false;
	};

	$scope.issuersSearch = function() {
		if(!$scope.issuer.name && !$scope.issuer.account) {
			if(!$scope.issuer.name) {
				$scope.issuersForm.name.$invalid = true;
				$scope.issuersForm.name.$dirty = true;
			}

			if(!$scope.issuer.account) {
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
		if($scope.issuer.name !== '' && $scope.issuer.account !== '') {
			url += $scope.issuer.name + '/' + $scope.issuer.account;
		}
		else if($scope.issuer.name !== '') {
			url += $scope.issuer.name;
		}
		else {
			url += 'acct/' + $scope.issuer.account;
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
			$scope.issuer.search = true;
		}).
		error(function(data, status, headers, config) {
			console.log('error.');
		});
	};
}]);
