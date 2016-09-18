(function(app){

	app.config(UnderstandRoute);

	UnderstandRoute.$inject = ['$stateProvider'];

	function UnderstandRoute($stateProvider) {
		$stateProvider
			.state('home.understand', {
				url: '/understand',
				templateUrl: './modules/understand/understand.html',
				controller: 'UnderstandController',
				controllerAs: 'understand'
			});
	}

})(angular.module('core.understand', ['core.understand.controller', 'ngJsTree']));
