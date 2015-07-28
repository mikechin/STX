var stx = angular.module('stx', ['ngRoute', 'ngCookies']);

stx.config(['$routeProvider', function($routeProvider) {
	$routeProvider.
		when('/', {
			templateUrl: 'views/main.html'
		}).
		when('/scan', {
			controller: 'ScanController',
			templateUrl: 'views/scan.html'
		}).
		otherwise({
			redirectTo: '/'
		});
}]);
