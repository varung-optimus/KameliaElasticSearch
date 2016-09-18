(function(app){

	app.config(ManageRoute);

	ManageRoute.$inject = ['$stateProvider'];

	function ManageRoute($stateProvider) {
		$stateProvider
			.state('home.manage', {
				url: '/manage',
				templateUrl: './modules/manage/manage.html',
				controller: 'ManageController',
				controllerAs: 'manage'
			});
	}

})(angular.module('core.manage', ['core.manage.controller']));
