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
		search: false
	};

	$scope.issuers = [];

	$scope.issuersSearch = function() {
		if($scope.issuer.name === '') {
			$scope.issuersForm.name.$invalid = true;
			$scope.issuersForm.name.$dirty = true;

			return;
		}

		var url = 'http://stx.localhost:8888/q/issuers/' + $scope.issuer.name;
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
