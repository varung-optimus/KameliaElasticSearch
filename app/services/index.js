(function (app) {

    app.service('RadiusService', RadiusService);

    RadiusService.$inject = ['$http', 'localStorageService', 'toastr',
        '$base64', '$rootScope', '$state', '$q'];

    function RadiusService($http, localStorageService, toastr, $base64, $rootScope, $state, $q) {
        var API = {
            LOGIN: '/service/xusers/users/userName/',
            USER_GROUPS: '/service/xusers/{userId}/groups',
            GROUP_POLICIES: '/service/public/api/policy?groupName={groupName}',
            GROUP_MEMBERS: '/service/xusers/{groupId}/users',
            GROUP: '/service/xusers/groups?name={groupName}',
            ALL_USERS: '/service/xusers/users'
        };

        var ATLAS_API = {
            ALL_ENTITIES: '/api/atlas/v1/entities',
            LINEAGE: '/api/atlas/lineage/{entityId}/inputs/graph'
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

        this.getGroupPolicies = function (groupName, onSuccessCallback) {
            var req = {
                method: METHODS.GET,
                url: API.GROUP_POLICIES.replace('{groupName}', groupName)
            }
            $http(req)
                .then(
                onSuccessCallback,
                function (response) {
                    console.log(response);
                    toastr.error(response.data.message);
                });
        };

        this.getGroup = function (groupName, onSuccessCallback) {
            var req = {
                method: METHODS.GET,
                url: API.GROUP.replace('{groupName}', groupName)
            }
            $http(req)
                .then(
                onSuccessCallback,
                function (response) {
                    console.log(response);
                    toastr.error(response.data.message);
                });
        };

        this.getGroupMembers = function (groupId, onSuccessCallback) {
            var req = {
                method: METHODS.GET,
                url: API.GROUP_MEMBERS.replace('{groupId}', groupId)
            }
            $http(req)
                .then(
                onSuccessCallback,
                function (response) {
                    console.log(response);
                    toastr.error(response.data.message);
                });
        };

        this.getAllUsers = function (onSuccessCallback) {
            var req = {
                method: METHODS.GET,
                url: API.ALL_USERS
            }
            $http(req)
                .then(
                onSuccessCallback,
                function (response) {
                    console.log(response);
                    toastr.error(response.data.message);
                });
        };

        this.getAtlasEntities = function (onSuccessCallback) {
            var auth = $base64.encode("admin:admin");
            var headers = { "Authorization": "Basic " + auth }
            var req = {
                method: METHODS.GET,
                url: ATLAS_API.ALL_ENTITIES,
                headers: headers
            }
            $http(req)
                .then(
                onSuccessCallback,
                function (response) {
                    console.log(response);
                    toastr.error(response.data.message);
                });
        };

        this.getAtlasLineage = function (entityId, onSuccessCallback) {
            var auth = $base64.encode("admin:admin");
            var headers = { "Authorization": "Basic " + auth }
            var req = {
                method: METHODS.GET,
                url: ATLAS_API.LINEAGE.replace('{entityId}', entityId),
                headers: headers
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