stx.controller('ReportsController', ['$scope', '$http', '$filter', '$window', function($scope, $http, $filter, $window) {
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

		$scope.recent = [];

		$scope.start = null;
		$scope.end = null;
	}

	function getRecentReports() {
		var url = 'http://stx.localhost:8888/q/report/recent';
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
			if(data.status) {
				$scope.recent = data.reports;
			}
			else {
				$scope.recent = [];
			}
		}).
		error(function(data, status, headers, config) {
			console.log('error.');
		});
	}

	initReports();
	getRecentReports();

	function checkDates() {
		if($scope.report.start === null || $scope.report.end === null) {
			if($scope.report.start === null) {
				$scope.reportForm.start.$invalid = true;
				$scope.reportForm.start.$dirty = true;
			}

			if($scope.report.end === null) {
				$scope.reportForm.end.$invalid = true;
				$scope.reportForm.end.$dirty = true;
			}

			return false;
		}
		else if($scope.report.start > $scope.report.end) {
			$scope.reportForm.end.$invalid = true;
			$scope.reportForm.end.$dirty = true;
			return false;
		}

		$scope.start = $filter('date')($scope.report.start, 'yyyy-MM-dd 00:00:00');
		$scope.end = $filter('date')($scope.report.end, 'yyyy-MM-dd 23:59:59');

		return true;
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

	$scope.recent = [];

	$scope.create = function() {
		if(!checkDates()) {
			return;
		}

		var url = 'http://stx.localhost:8888/q/download/' + $scope.start + '/' + $scope.end;
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
			$scope.report.search = false;
			$scope.report.results = [];
			getRecentReports();
		}).
		error(function(data, status, headers, config) {
			console.log('error.');
		});
	};

	$scope.delete = function(id) {
		var url = 'http://stx.localhost:8888/q/report/delete/' + id;
		$http({
			method: 'DELETE',
			url: url,
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			}
		}).
		success(function(data, status, headers, config) {
			console.log('success.');
			getRecentReports();
		}).
		error(function(data, status, headers, config) {
			console.log('error.');
		});
	};

	$scope.generateReport = function() {
		if(!checkDates()) {
			return;
		}

		var url = 'http://stx.localhost:8888/q/report/' + $scope.start + '/' + $scope.end;
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
			$scope.report.search = true;
			if(data.status) {
				$scope.report.results = data.checks;
			}
			else {
				$scope.report.results = [];
			}
		}).
		error(function(data, status, headers, config) {
			console.log('error.');
		});
	};
}]);
