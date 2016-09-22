(function (app) {
    app.controller('ManageController', ManageController);
    ManageController.$inject = ['$scope', 'RadiusService', '$rootScope'];

    function ManageController($scope, RadiusService, $rootScope) {
        var manage = this;
        var groupDict = [];

        manage.view = {};
        manage.view.hdfs = true;
        manage.view.hive = true;
        manage.view.kafka = true;
        manage.view.resource = 'my';

        function getGroupPoliciesSuccessCallback(response) {
            var groupName = response.config.url.split('?groupName=')[1];
            var groupIndex = groupDict[groupName];
            var policies = response.data.vXPolicies;
            for (var policyId in policies) {
                if (policies[policyId].repositoryType === 'hive') {
                    var resources = policies[policyId].resourceName.replace(/[\*\/]/gi, '').split(',');
                    manage.groups.vXGroups[groupIndex].hive = resources;
                } else if (policies[policyId].repositoryType === 'hdfs') {
                    manage.groups.vXGroups[groupIndex].hdfs = policies[policyId].resourceName;
                }
            }
        }

        function onSuccessCallback(response) {
            manage.groups = response.data;
            for (var groupIndex in response.data.vXGroups) {
                // Fill other details
                var item =
                    response.data.vXGroups[groupIndex].name;
                groupDict[item] = groupIndex;
                // Get Policy for each groupIndex
                RadiusService.getGroupPolicies(
                    item,
                    getGroupPoliciesSuccessCallback);
                var groupSplits = item.split('_');
                var domain = groupSplits.splice(0, 1).join(' ');
                var instance = groupSplits.splice(0, 1);
                var subject = groupSplits.splice(0, 1);

                var permission = groupSplits[groupSplits.length - 1];

                // Domain
                if (domain === 'DLQ') {
                    manage.groups.vXGroups[groupIndex].domain = 'DataLake Quality';
                } else if (domain === 'DLC') {
                    manage.groups.vXGroups[groupIndex].domain = 'DataLake Commerce';
                } else if (domain === 'VVV') {
                    manage.groups.vXGroups[groupIndex].domain = 'DataLab';
                } else {
                    manage.groups.vXGroups[groupIndex].domain = domain;
                }

                // Permission
                if (permission === 'RO') {
                    manage.groups.vXGroups[groupIndex].permission = 'Read Only';
                } else if (permission === 'RW') {
                    manage.groups.vXGroups[groupIndex].permission = 'Read Write';
                } else {
                    manage.groups.vXGroups[groupIndex].permission = permission;
                }
                manage.groups.vXGroups[groupIndex].groupName = item;
                manage.groups.vXGroups[groupIndex].instance = instance.join('_');
                manage.groups.vXGroups[groupIndex].subject = subject.join('_');
            }
            console.log(manage.groups);
        }
        
        // Get User groups from user id
        RadiusService.getUserGroups(
            // $rootScope.loggedInUser.id,
            37,
            onSuccessCallback);
    }

})(angular.module('core.manage.controller', []));
