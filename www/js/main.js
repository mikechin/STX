var stx = angular.module('stx', ['ngRoute']);

stx.config(['$routeProvider', function($routeProvider) {
	$routeProvider.
		when('/', {
			templateUrl: 'views/main.html'
		}).
		when('/scan', {
			templateUrl: 'views/scan.html'
		}).
		otherwise({
			redirectTo: '/'
		});
}]);
