var stx = angular.module('stx', ['ngRoute']);

stx.config(['$routeProvider', function($routeProvider) {
	$routeProvider.
		when('/', {
			controller: 'ScanController',
			templateUrl: 'views/main.html'
		}).
		otherwise({
			redirectTo: '/'
		});
}]);
