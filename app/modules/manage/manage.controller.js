(function (app) {
    app.controller('ManageController', ManageController);
    ManageController.$inject = ['$scope', 'RadiusService', '$rootScope', 'esClient', 'sourcesTagQuery',
        'toastr'];

    function ManageController($scope, RadiusService, $rootScope, esClient, sourcesTagQuery, toastr) {
        var manage = this;
        var groupDict = [];
        manage.view = {};
        manage.view.hdfs = true;
        manage.view.hive = true;
        manage.view.kafka = true;
        manage.rowsToDisplay = [];
        manage.view.resource = 'my';
        manage.view.groupDetailPanelVisibility = false;
        manage.handleDetailPanelVisibility = handleDetailPanelVisibility;

        manage.rowsToGetDataFrom = function (index) {
            if (manage.checkbox[index] === true) {
                manage.rowsToDisplay.push(manage.testIndexData[index]);
            }
            if (manage.checkbox[index] === false) {
                manage.rowsToDisplay = manage.rowsToDisplay.filter(function (obj) {
                    return manage.testIndexData[index]._id !== obj._id;
                });
            }
        }

        manage.testIndexData

        manage.getPages = function () {
            var tmp = [];
            for (var i = 1; i < $scope.indexVM.pageCount; i++)
                tmp.push(i);
            return tmp;
        };

        esClient.search(sourcesTagQuery).then(function (resp) {
            _refineFieldTabData(resp);
        }, function (err) {
            console.trace(err.message);
        });
        $scope.$watch('indexVM.loading', function (newVal, oldVal) {
            if (newVal) {
                manage.selectedObject = null;
                manage.selectedRow = null;
            }
        });
        function _refineFieldTabData(resp) {
            if (!$scope.indexVM.results) {
                setTimeout(function () {
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
            content: "modules/manage/includes/tab-hdfs.html",
            active: true
        }, {
                title: "Hive",
                content: "modules/manage/includes/tab-hive.html"
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
                content: "modules/manage/includes/lineage.html"
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

        function createRequestInElasticSearch() {
            esClient.create({
                index: 'requests',
                type: 'requests',
                id: '2',
                body: {
                    title: 'Test 1',
                    tags: ['y', 'z'],
                    published: true,
                    published_at: '2013-01-01',
                    counter: 1
                }
            }, function (error, response) {
                if (error) {
                    toastr.error(error.message);
                } else {
                    toastr.success('Created successfully');
                }
            });
        }

        manage.createRequestInElasticSearch = createRequestInElasticSearch;

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

        function searchNameInAtlasEntities(item) {
            for (var index in manage.atlasEntities) {
                if (manage.atlasEntities[index].id === item) {
                    return manage.atlasEntities[index].name;
                }
            }
        }

        function prepareLineageGraphModel(atlasLineageConnects) {
            manage.lineage = "graph LR";
            var index = 0;
            var separator = '\n';
            var connect = '-->';
            var registeredNodesDict = [];
            for (var item in atlasLineageConnects) {
                var nodeItem = atlasLineageConnects[item];
                var nodeId = registeredNodesDict[item] ? registeredNodesDict[item] : ++index;
                registeredNodesDict[item] = nodeId;

                var nodeName = nodeId + '[fa:fa-' + nodeItem.icon +
                    ' ' + nodeItem.name.substring(0, 30) + ']';


                // Get connections
                for (var connectionIndex in nodeItem.connections) {
                    var nodeItemConnection = nodeItem.connections[connectionIndex];
                    var nodeId = registeredNodesDict[nodeItemConnection.id] ? registeredNodesDict[nodeItemConnection.id] : ++index;
                    registeredNodesDict[nodeItemConnection.id] = nodeId;
                    var connectedNodeName = nodeId + '[fa:fa-' + nodeItem.icon +
                        ' ' + nodeItemConnection.name.substring(0, 30) + ']';

                    manage.lineage += separator + nodeName + connect + connectedNodeName;
                }
            }
            debugger
        }

        function onGetAtlasLineageSuccessCallback(response) {
            var edges = response.data.results.values.edges;
            var vertices = response.data.results.values.vertices;
            manage.atlasLineageConnects = [];
            // Prepare dictionary of connections
            for (var item in edges) {
                var name = searchNameInAtlasEntities(item);
                var icon = 'gear';

                if (name.indexOf('table') !== -1) {
                    icon = 'table';
                }
                manage.atlasLineageConnects[item] = {
                    icon: icon,
                    name: name,
                    connections: []
                };
                // Get connections
                for (var connectionIndex in edges[item]) {
                    var connectionName = searchNameInAtlasEntities(edges[item][connectionIndex]);
                    manage.atlasLineageConnects[item].connections.push({
                        id: edges[item][connectionIndex],
                        name: connectionName
                    });
                }
            }

            // Prepare final lineage graph model
            prepareLineageGraphModel(manage.atlasLineageConnects);
        }

        function onGetAtlasEntitiesSuccessCallback(response) {
            for (var item in response.data) {
                if (response.data[item].name === 'cur_hive_table1') {
                    manage.curHiveTableId = response.data[item].id;
                    manage.atlasEntities = response.data;
                    // Once found, get lineage data
                    RadiusService.getAtlasLineage(manage.curHiveTableId, onGetAtlasLineageSuccessCallback)
                }
            }
        }

        function onSuccessCallback(response) {
            manage.groups = response.data;
            manage.step1Form.steward = $rootScope.loggedInUser ? $rootScope.loggedInUser.name : '';
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
        }

        // Get User groups from user id
        RadiusService.getUserGroups(
            // $rootScope.loggedInUser.id,
            37,
            onSuccessCallback);

        // Get all users
        RadiusService.getAllUsers(onGetAllUsersSuccessCallback)

        // Get lineage
        RadiusService.getAtlasEntities(onGetAtlasEntitiesSuccessCallback)
    }

})(angular.module('core.manage.controller', []));
