(function(app) {

    app.controller('UnderstandController', UnderstandController);

    UnderstandController.$inject = ['$scope', '$timeout', 'esClient', 'euiTagQuery', 'euiSaveQuery'];

    function UnderstandController($scope, $timeout, esClient, euiTagQuery, euiSaveQuery) {
        var understand = this;
        // This is used for internal purpose as jstree was not allowing
        // any meta data to be stored
        // We are using this to keep extra info like min, max, desc etc.
        understand._newTags = [];
        understand.selectedNodeId = null;
        understand.maxId = 0;

        understand.tabs = [{
            title: "Info",
            content: "modules/understand/includes/tab-info.html",
            active: true
        }, {
            title: "History",
            content: "modules/understand/includes/tab-history.html"
        }];

        understand.saveNewNode = function() {
            // TODO: Save it on the cluster
            var saveQuery = euiSaveQuery;
            euiSaveQuery.id = parseInt(understand.maxId) + 1;
            // Get node data and set it
            euiSaveQuery.parent = understand.selectedNode.parent;
            euiSaveQuery.body.name = understand.nodeItemSelected.title;
            euiSaveQuery.body.description = understand.nodeItemSelected.desc;
            euiSaveQuery.body.tagging_rule = understand.nodeItemSelected.rule;
            euiSaveQuery.body.min_length = understand.nodeItemSelected.min;
            euiSaveQuery.body.max_length = understand.nodeItemSelected.max;

            esClient.create(euiSaveQuery).then(function(resp) {
                // Recreate tree
                // understand.treeConfig.version = understand.treeConfig.version + 1;
                esClient.search(euiTagQuery).then(function(resp) {
                    contextualMenuSample(resp.hits.hits);
                    understand.treeConfig.version = understand.treeConfig.version + 1;
                }, function(err) {
                    console.trace(err.message);
                });
            }, function(err) {
                console.trace(err.message);
            });
        };

        understand.selectNodeCB = function(node, selected, ev) {
            $scope.$apply(function() {
                understand.nodeItemSelected = {};
                understand.isNodeSelected = true;
                understand.selectedNode = selected.node;

                if (selected.event && selected.node.data && understand._newTags.indexOf(selected.node.id) === -1) {
                    understand.nodeItemSelected.title = selected.node.text;
                    understand.nodeItemSelected.desc = selected.node.data.desc;
                    understand.nodeItemSelected.rule = selected.node.data.taggingRule;
                    understand.nodeItemSelected.min = selected.node.data.min;
                    understand.nodeItemSelected.max = selected.node.data.max;
                    understand.isNewNode = false;
                } else {
                    // It is a new unsaved node
                    var tree = angular.element(document.querySelector("#tagTree")).jstree(true);
                    var newNode = tree.get_node(selected.node.id, 'true');
                    understand.isNewNode = true;
                    understand.nodeItemSelected.title = selected.node.text;
                }
            });
        };

        function contextualMenuSample(esData) {
            var data = [];
            for (var index = 0; index < esData.length; index++) {
                var parent = '#';
                if (esData[index]._parent) {
                    parent = esData[index]._parent;
                }
                data.push({
                    id: esData[index]._id,
                    parent: parent,
                    text: esData[index]._source.name,
                    state: {
                        opened: true
                    },
                    data: {
                        // Custom data
                        "desc": esData[index]._source.description,
                        "taggingRule": esData[index]._source.tagging_rule,
                        "min": esData[index]._source.min_length,
                        "max": esData[index]._source.max_length
                    }
                });
                if (parseInt(understand.maxId) < parseInt(esData[index]._id)) {
                    understand.maxId = esData[index]._id;
                }
            }
            understand.treeData = data;
            understand.treeConfig = {
                version: 1,
                core: {
                    multiple: false,
                    animation: true,
                    error: function(error) {
                        $log.error('treeCtrl: error from js tree - ' + angular.toJson(error));
                    },
                    check_callback: true,
                    worker: true
                },
                "contextmenu": {
                    "items": function($node) {
                        var tree = angular.element(document.querySelector("#tagTree")).jstree(true);
                        return {
                            "Create": {
                                "separator_before": true,
                                "separator_after": true,
                                "label": "Create",
                                "action": function(obj) {
                                    $node = tree.create_node($node);
                                    understand._newTags[$node] = tree.get_node($node, 'true');
                                    // newNode.data.isNewNode = true;
                                    tree.select_node($node);
                                    tree.deselect_all();
                                    // $scope.$apply(function() {
                                    //     understand.isNewNode = true;
                                    // });
                                    // tree.edit($node);
                                }
                            }
                        };
                    }
                },
                types: {
                    default: {
                        icon: 'fa fa-folder icon-state-warning icon-lg'
                    },
                    file: {
                        icon: 'fa fa-file icon-state-warning icon-lg'
                    }
                },
                version: 1,
                plugins: ["contextmenu", "dnd", "state", "types"]
            };
        }

        understand.createNodeCB = function(e, item) {
            $scope.$apply(function() {
                understand.isNodeSelected = true;
                // understand.sele
            });
        };

        // We need to give some time for the page to load after the controller
        // Make request through esclient to get data from Elastic search
        esClient.search(euiTagQuery).then(function(resp) {
            contextualMenuSample(resp.hits.hits);
        }, function(err) {
            console.trace(err.message);
        });

        function stopBubble($event) {
            // Prevent bubbling to showItem.
            // On recent browsers, only $event.stopPropagation() is needed
            if ($event.stopPropagation) {
                $event.stopPropagation();
            }
            if ($event.preventDefault) {
                $event.preventDefault();
            }

            $event.cancelBubble = true;
            $event.returnValue = false;
        }
    }

})(angular.module('core.understand.controller', []));
