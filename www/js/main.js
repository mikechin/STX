var stx = angular.module('stx', ['ngRoute']);

stx.config(['$routeProvider', function($routeProvider) {
	$routeProvider.
		when('/', {
			templateUrl: 'views/main.html'
		}).
		otherwise({
			redirectTo: '/'
		});
}]);
