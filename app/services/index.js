(function (app) {

    app.service('MattermostService', MattermostService);

    MattermostService.$inject = ['$http', 'localStorageService', 'toastr'];

    function MattermostService($http, localStorageService, toastr) {
        var API = {
            LOGIN: 'api/v3/users/login',
            INITIAL_LOAD: 'api/v3/users/initial_load'
        };

        var METHODS = {
            POST: 'POST',
            GET: 'GET'
        }
        var JSON = 'application/json';

        this.login = function (email, password) {
            var req = {
                method: METHODS.POST,
                url: API.LOGIN,
                headers: {
                    'Content-Type': JSON
                },
                data: {
                    "login_id": email,
                    "password": password
                }
            }

            $http(req)
                .then(
                function (response) {
                    if (response.headers('Token')) {
                        // Successful login
                        localStorageService.set('token', response.headers('Token'));
                        getTeams();
                    } else {
                        // Error in retrieving token
                        toastr.error('Unable to get token. Contact Admin')
                    }
                },
                function (response) {
                    console.log(response);
                    toastr.error(response.data.message);
                });
        };

        var getTeams = function () {
            var req = {
                method: METHODS.GET,
                url: API.INITIAL_LOAD,
                headers: {
                    'Content-Type': JSON,
                    'Authorization': 'Bearer ' + localStorageService.get('token')
                }
            }

            $http(req)
                .then(
                function (response) {
                    var teams = response.data.teams;
                    for (var index = 0; index < teams.length; index++) {
                        toastr.success(teams[index].display_name);
                    }
                },
                function (response) {
                    console.log(response);
                    toastr.error(response.data.message);
                });
        }
    }

})(angular.module('core.services', []));