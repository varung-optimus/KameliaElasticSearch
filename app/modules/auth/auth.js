(function(app){

	app.config(AuthRoute);

	AuthRoute.$inject = ['$stateProvider'];

	function AuthRoute($stateProvider) {
		$stateProvider
			.state('home.auth', {
				url: '/login',
				templateUrl: '/modules/auth/auth.html',
				controller: 'AuthController',
				controllerAs: 'auth'
			});
	}

})(angular.module('core.auth', ['core.auth.controller','core.shared']));
