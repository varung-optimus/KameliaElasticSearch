(function(app){

	app.config(DashboardRoute);

	DashboardRoute.$inject = ['$stateProvider'];

	function DashboardRoute($stateProvider) {
		$stateProvider
			.state('home.dashboard', {
				url: '/',
				templateUrl: '/modules/dashboard/dashboard.html',
				controller: 'DashboardController',
				controllerAs: 'dashboard'
			});
	}

})(angular.module('core.dashboard', ['core.dashboard.controller', 'core.shared']));
