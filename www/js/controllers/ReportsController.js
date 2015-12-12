stx.controller('ReportsController', ['$scope', '$http', '$filter', function($scope, $http, $filter) {
	'use strict';

	// **************************************************
	// private.
	//
	//
	// **************************************************
	function initReports() {
		$scope.report = {
			start: null,
			end: null,
			search: false,
			results: []
		};
	}

	// **************************************************
	// public.
	//
	//
	// **************************************************
	$scope.report = {
		start: null,
		end: null,
		search: false,
		results: []
	};

	$scope.generateReport = function() {
		if($scope.report.start === null || $scope.report.end === null) {
			if($scope.report.start === null) {
				$scope.reportForm.start.$invalid = true;
				$scope.reportForm.start.$dirty = true;
			}

			if($scope.report.end === null) {
				$scope.reportForm.end.$invalid = true;
				$scope.reportForm.end.$dirty = true;
			}

			return;
		}
		else if($scope.report.start > $scope.report.end) {
			$scope.reportForm.end.$invalid = true;
			$scope.reportForm.end.$dirty = true;
			return;
		}

		var start = $filter('date')($scope.report.start, 'yyyy-MM-dd 00:00:00');
		var end = $filter('date')($scope.report.end, 'yyyy-MM-dd 23:59:59');

		var url = 'http://stx.localhost:8888/q/report/' + start + '/' + end;
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
			$scope.report.results = data.checks;
			$scope.report.search = true;
		}).
		error(function(data, status, headers, config) {
			console.log('error.');
		});
	};
}]);
