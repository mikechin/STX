stx.controller('ChecksController', ['$scope', '$http', function($scope, $http) {
	'use strict';

	// **************************************************
	// private.
	//
	//
	// **************************************************
	function init() {
		var url = 'http://stx.localhost:8888/q/checks';
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
			$scope.checks = data.checks;
			if($scope.checks.length > 0) {
				$scope.show = true;
			}
		}).
		error(function(data, status, headers, config) {
			console.log('error.');
		});
	}

	init();

	// **************************************************
	// public.
	//
	//
	// **************************************************
	$scope.checks = [];
	$scope.show   = false;
	$scope.search = {
		number: ''
	};

	$scope.numberSearch = function(number) {
		if(!$scope.search.number || $scope.search.number === '') {
			if($scope.search.number === '') {
				$scope.checkForm.number.$invalid = true;
				$scope.checkForm.number.$dirty = true;
			}

			return;
		}

		var url = 'http://stx.localhost:8888/q/checks/' + $scope.search.number;
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
			$scope.checks = data.checks;
			if($scope.checks.length > 0) {
				$scope.show = true;
			}
		}).
		error(function(data, status, headers, config) {
			console.log('error.');
		});
	};
}]);
