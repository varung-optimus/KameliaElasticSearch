(function (app) {

    app.service('RadiusService', RadiusService);

    RadiusService.$inject = ['$http', 'localStorageService', 'toastr', 
    '$base64', '$rootScope', '$state', '$q'];

    function RadiusService($http, localStorageService, toastr, $base64, $rootScope, $state, $q) {
        var API = {
            LOGIN: '/service/xusers/users/userName/',
            USER_GROUPS: '/service/xusers/{userId}/groups'
        };

        var METHODS = {
            POST: 'POST',
            GET: 'GET'
        }
        var JSON = 'application/json';

        this.login = function (username, password) {
            var auth = $base64.encode("admin:admin");
            var headers = { "Authorization": "Basic " + auth }

            var req = {
                method: METHODS.GET,
                url: API.LOGIN + username,
                headers: headers
            }
            $http(req)
                .then(
                function (response) {
                    $rootScope.isAuthenticated = true;
                    $rootScope.loggedInUser = response.data;
                    console.log(response.data);
                    $state.go('home.home');
                },
                function (response) {
                    console.log(response);
                    toastr.error(response.data.msgDesc);
                });
        };

        this.getUserGroups = function (userId, onSuccessCallback) {
            var deferred = $q.defer();
            var req = {
                method: METHODS.GET,
                url: API.USER_GROUPS.replace('{userId}', userId)
            }
            $http(req)
                .then(
                onSuccessCallback,
                function (response) {
                    console.log(response);
                    toastr.error(response.data.message);
                });
        };
    }

})(angular.module('core.services', []));