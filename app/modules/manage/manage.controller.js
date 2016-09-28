(function (app) {
    app.controller('ManageController', ManageController);
    ManageController.$inject = ['$scope', 'RadiusService', '$rootScope', 'esClient', 'sourcesTagQuery'];

    function ManageController($scope, RadiusService, $rootScope, esClient, sourcesTagQuery) {
        var manage = this;
        var groupDict = [];

        manage.view = {};
        manage.view.hdfs = true;
        manage.view.hive = true;
        manage.view.kafka = true;
        manage.view.resource = 'my';
        manage.view.groupDetailPanelVisibility = false;
        manage.handleDetailPanelVisibility = handleDetailPanelVisibility;
        manage.getPages = function() {
            debugger
            var tmp = [];
            for (var i = 1; i < $scope.indexVM.pageCount; i++)
                tmp.push(i);
            return tmp;
        };

        esClient.search(sourcesTagQuery).then(function(resp) {
            _refineFieldTabData(resp);
        }, function(err) {
            console.trace(err.message);
        });
        $scope.$watch('indexVM.loading', function(newVal, oldVal) {
			if (newVal) {
				manage.selectedObject = null;
				manage.selectedRow = null;
			}
		});
        function _refineFieldTabData(resp) {
            if (!$scope.indexVM.results) {
                setTimeout(function() {
                    _refineFieldTabData(resp);
                }, resp, 100);
            } else {
                manage.metadata = $scope.indexVM.results.hits.hits;
                // Create tag dictionary
                manage.testIndexData = resp.hits.hits;
                manage.tagsDict = [];
                for (var index = 0; index < manage.testIndexData.length; index++) {
                    var currentItem = manage.testIndexData[index];
                    manage.tagsDict[index] = currentItem;
                }

                // For each tag in data, get corresponding tag
                for (var index = 0; index < manage.metadata.length; index++) {
                    var currentItem = manage.metadata[index]._source;
                    currentItem.mappedTags = [];
                    for (var tag_index = 0; tag_index < currentItem.tags.length; tag_index++) {
                        var tagItem = manage.tagsDict[currentItem.tags[tag_index].tag_id];
                        currentItem.mappedTags.push(tagItem._source.Name);
                    }
                }
            }
        }
        
        manage.tabs = [{
            title: "HDFS",
            content: "",
            active: true
        }, {
                title: "Hive",
                content: ""
            }, {
                title: "Roles",
                content: "modules/manage/includes/tab-roles.html"
            }, {
                title: "Pipelines",
                content: "modules/manage/includes/tab-pipelines.html"
            }];

        manage.step2tabs = [{
            title: "Metadata",
            content: "",
            active: true
        }, {
                title: "Lineage",
                content: ""
            }, {
                title: "Relations",
                content: ""
            }];

        manage.lineage = "graph LR \n A[fa:fa-building restaurants_inspection]-->B[fa:fa-file-excel-o restaurants_nyc.csv] \n B-.->C[fa:fa-bullseye restaurants_sep_2014_vc.csv] \n D[fa:fa-building nyc_open]-->E[fa:fa-file-excel-o NYPD_Motor_Vehicle_Collisions_2014.csv] \n E-.->C \n F[fa:fa-file-excel-o nyc.csv]-->G[fa:fa-file-excel-o inspections_sub_8.csv] \n G-->H[fa:fa-file-excel-o 8_8.csv] \n H-.->C \n";
        setTimeout(function () {
            manage.lineage = "graph LR \n A[fa:fa-building restaurants_inspection]-->B[fa:fa-file-excel-o restaurants_nyc.csv] \n B-.->C[fa:fa-bullseye restaurants_sep_2014_vc.csv] \n D[fa:fa-building nyc_open]-->E[fa:fa-file-excel-o NYPD_Motor_Vehicle_Collisions_2014.csv] \n E-.->C \n F[fa:fa-file-excel-o nyc.csv]-->G[fa:fa-file-excel-o inspections_sub_8.csv] \n G-->H[fa:fa-file-excel-o 8_8.csv] \n H-.->C \n";

            mermaid.init({
                startOnLoad: true,
                flowchart: {
                    useMaxWidth: false,
                    htmlLabels: true
                }
            }, ".graph-flowchart");
        }, manage, 1000);

        manage.selectedItem = manage.selectedItem || {};

        manage.openEditGraphModal = function (item) {
            manage.selectedItem = item;
            var popup = new Foundation.Reveal($('#edit-tag-modal'));
            popup.open();
        };

        manage.handleTabClick = function () {
            setTimeout(function () {
                manage.redrawGraph();
            }, 1000);
        };

        manage.redrawGraph = function () {
            angular.element(document.querySelector('#graph-flowchart'))
                .empty()
                .removeAttr('data-processed')
                .html(manage.lineage);

            mermaid.init({
                startOnLoad: true,
                flowchart: {
                    useMaxWidth: false,
                    htmlLabels: true
                }
            }, ".graph-flowchart");
        };

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

        function getConsGroupMembersSuccessCallback(response) {
            manage.groups.dataConsumers = response.data.vXUsers;
        }

        function getConsGroupIdSuccessCallback(response) {
            manage.group = response.data.vXGroups[0];
            // Get group members
            RadiusService.getGroupMembers(
                manage.group.id,
                getConsGroupMembersSuccessCallback);
        }

        function getStewGroupMembersSuccessCallback(response) {
            manage.groups.dataStewards = response.data.vXUsers;

            manage.groupNameArr[manage.groupNameArr.length - 1] = 'CONS';
            var temp = manage.groupNameArr.join('_');
            // Initialize Roles with clicked group id
            RadiusService.getGroup(
                temp,
                getConsGroupIdSuccessCallback);
        }

        function getStewGroupIdSuccessCallback(response) {
            manage.group = response.data.vXGroups[0];
            // Get group members
            RadiusService.getGroupMembers(
                manage.group.id,
                getStewGroupMembersSuccessCallback);
        }

        function getEngGroupMembersSuccessCallback(response) {
            manage.groups.dataEngineers = response.data.vXUsers;

            manage.groupNameArr[manage.groupNameArr.length - 1] = 'DEN';
            var temp = manage.groupNameArr.join('_');
            // Initialize Roles with clicked group id
            RadiusService.getGroup(
                temp,
                getStewGroupIdSuccessCallback);
        }

        function getEngGroupIdSuccessCallback(response) {
            manage.group = response.data.vXGroups[0];
            // Get group members
            RadiusService.getGroupMembers(
                manage.group.id,
                getEngGroupMembersSuccessCallback);
        }

        function getGroupMembersSuccessCallback(response) {
            manage.groups.dataScientists = response.data.vXUsers;

            manage.groupNameArr[manage.groupNameArr.length - 1] = 'DST';
            var temp = manage.groupNameArr.join('_');
            // Initialize Roles with clicked group id
            RadiusService.getGroup(
                temp,
                getEngGroupIdSuccessCallback);
        }

        function getGroupIdSuccessCallback(response) {
            manage.group = response.data.vXGroups[0];
            // Get group members
            RadiusService.getGroupMembers(
                manage.group.id,
                getGroupMembersSuccessCallback);
        }

        function handleDetailPanelVisibility(group) {
            manage.view.groupDetailPanelVisibility = !manage.view.groupDetailPanelVisibility;
            manage.groupNameArr = group.groupName.split('_');

            manage.groupNameArr[manage.groupNameArr.length - 1] = 'DSC';
            var temp = manage.groupNameArr.join('_');
            // Initialize Roles with clicked group id
            RadiusService.getGroup(
                temp,
                getGroupIdSuccessCallback);
        }

        function onSuccessCallback(response) {
            manage.groups = response.data;
            manage.step1Form.steward = $rootScope.loggedInUser ? $rootScope.loggedInUser.name : '';
            debugger
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
                var subject = groupSplits.splice(0, 2);

                var permission = groupSplits[groupSplits.length - 1];

                // Domain
                if (domain === 'DLQ') {
                    manage.groups.vXGroups[groupIndex].domain = 'DataLake Quality';
                } else if (domain === 'DLC') {
                    manage.groups.vXGroups[groupIndex].domain = 'DataLake Commerce';
                } else if (domain === 'VVV') {
                    manage.groups.vXGroups[groupIndex].domain = 'DataLab';
                    manage.belongsToVVV = true;
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

        function onGetAllUsersSuccessCallback(resp) {
            manage.step1Form.usersList = resp.data.vXUsers;
            debugger
        }

        // Get User groups from user id
        RadiusService.getUserGroups(
            // $rootScope.loggedInUser.id,
            37,
            onSuccessCallback);

        // Get all users
        RadiusService.getAllUsers(onGetAllUsersSuccessCallback)
    }

})(angular.module('core.manage.controller', []));
