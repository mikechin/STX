stx.controller('ReportsController', ['$scope', '$http', function($scope, $http) {
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
	};
}]);
