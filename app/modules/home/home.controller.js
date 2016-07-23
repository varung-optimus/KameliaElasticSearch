(function(app) {
    app.controller('HomeController', HomeController);

    HomeController.$inject = ['$scope', '$timeout', '$mdSidenav'];

    function HomeController($scope, $timeout, $mdSidenav) {
        var home = this;

        $scope.$watch('indexVM', function(newVal, oldVal) {
			if (newVal) {
                // We have the results from the elastic ui
                $scope.indexVM.pageSize = 1000;
			}
		});
    }

})(angular.module('core.home.controller', []));
