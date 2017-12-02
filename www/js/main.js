var stx = angular.module('stx', ['ngRoute', 'ngCookies']);

stx.config(['$routeProvider', function($routeProvider) {
	$routeProvider.
		when('/scan', {
			controller: 'ScanController',
			templateUrl: 'views/scan.html'
		}).
		when('/checks', {
			controller: 'ChecksController',
			templateUrl: 'views/checks.html'
		}).
		when('/customers', {
			controller: 'CustomersController',
			templateUrl: 'views/customers.html'
		}).
		when('/issuers', {
			controller: 'IssuersController',
			templateUrl: 'views/issuers.html'
		}).
		when('/reports', {
			controller: 'ReportsController',
			templateUrl: 'views/reports.html'
		}).
		when('/fraud', {
			controller: 'FraudController',
			templateUrl: 'views/fraud.html'
		}).
		otherwise({
			redirectTo: '/scan'
		});
}]);
