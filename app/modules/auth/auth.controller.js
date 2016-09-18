(function(app) {

	app.controller('AuthController', AuthController);

	AuthController.$inject = ['$scope', 'RadiusService'];

	function AuthController($scope, RadiusService) {
		var auth = this;

		auth.login = function() {
			RadiusService.login(auth.credentials.username, auth.credentials.password);
		}
	}	

})(angular.module('core.auth.controller', ['core.services']));
