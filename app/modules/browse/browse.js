(function(app){

	app.config(BrowseRoute);

	BrowseRoute.$inject = ['$stateProvider'];

	function BrowseRoute($stateProvider) {
		$stateProvider
			.state('home.browse', {
				url: '/browse',
				templateUrl: '/modules/browse/browse.html',
				controller: 'BrowseController',
				controllerAs: 'browse'
			});
	}

})(angular.module('core.browse', ['core.browse.controller', 'mm.foundation', 'chart.js']));
