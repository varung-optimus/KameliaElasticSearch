(function(app) {

	app.controller('AuthController', AuthController);

	AuthController.$inject = ['$scope', '$rootScope'];

	function AuthController($scope, $rootScope) {
		var auth = this;

		auth.login = function() {
			$rootScope.isAuthenticated = true;
		}
	}

})(angular.module('core.auth.controller', []));
