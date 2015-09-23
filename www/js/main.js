var stx = angular.module('stx', ['ngRoute', 'ngCookies']);

stx.config(['$routeProvider', function($routeProvider) {
	$routeProvider.
		when('/scan', {
			controller: 'ScanController',
			templateUrl: 'views/scan.html'
		}).
		when('/customers', {
			controller: 'CustomersController',
			templateUrl: 'views/customers.html'
		}).
		when('/reports', {
			controller: 'ReportsController',
			templateUrl: 'views/reports.html'
		}).
		otherwise({
			redirectTo: '/scan'
		});
}]);
