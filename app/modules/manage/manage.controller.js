(function (app) {
    app.controller('ManageController', ManageController);
    ManageController.$inject = ['$scope', 'RadiusService', '$rootScope'];

    function ManageController($scope, RadiusService, $rootScope) {
        var manage = this;

        function onSuccessCallback(response) {
            manage.groups = response.data;
            for (var groupIndex in response.data.vXGroups) {
                var item = response.data.vXGroups[groupIndex].name;
                var groupSplits = item.split('_');
                var permission = groupSplits[groupSplits.length - 1];
                var instance = groupSplits.splice(0, 2);
                var subject = groupSplits.splice(0, 2);
                if (permission === 'RO') {
                    manage.groups.vXGroups[groupIndex].permission = 'Read Only';
                } else if (permission === 'RW') {
                    manage.groups.vXGroups[groupIndex].permission = 'Read Write';
                } else {
                    manage.groups.vXGroups[groupIndex].permission = permission;
                }
                manage.groups.vXGroups[groupIndex].instance = instance.join('_');
                manage.groups.vXGroups[groupIndex].subject = subject.join('_');
            }
            console.log(manage.groups);
        }
        RadiusService.getUserGroups(
            $rootScope.loggedInUser.id, 
            onSuccessCallback);
    }

})(angular.module('core.manage.controller', []));
