(function(app) {

	app.controller('AuthController', AuthController);

	AuthController.$inject = ['$scope', 'MattermostService'];

	function AuthController($scope, MattermostService) {
		var auth = this;

		auth.login = function() {
			MattermostService.login(auth.credentials.email, auth.credentials.password);
		}
	}	

})(angular.module('core.auth.controller', ['core.services']));
