(function(app){

	app.config(HomeRoute);

	HomeRoute.$inject = ['$stateProvider'];

	function HomeRoute($stateProvider) {
		$stateProvider
			.state('home.home', {
				url: '/home',
				templateUrl: '/modules/home/home.html',
				controller: 'HomeController',
				controllerAs: 'home'
			});
	}

})(angular.module('core.home', ['core.home.controller']));
