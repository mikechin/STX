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
		otherwise({
			redirectTo: '/scan'
		});
}]);
