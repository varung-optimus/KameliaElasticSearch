(function(app) {

    app.controller('BrowseController', BrowseController);

    BrowseController.$inject = ['$scope', '$timeout', '$mdDialog',
        '$mdMedia', 'esClient', 'euiBrowseTagQuery'
    ];

    function BrowseController($scope, $timeout, $mdDialog, $mdMedia, esClient, euiBrowseTagQuery) {
        var browse = this;
        browse.selectedRow = null; //intentionally we don't want things auto selected ;)
        browse.selectedObject = null;
        browse.selectedFilter = null;
        browse.lineage = "graph LR \n A[fa:fa-building restaurants_inspection]-->B[fa:fa-file-excel-o restaurants_nyc.csv] \n B-.->C[fa:fa-bullseye restaurants_sep_2014_vc.csv] \n D[fa:fa-building nyc_open]-->E[fa:fa-file-excel-o NYPD_Motor_Vehicle_Collisions_2014.csv] \n E-.->C \n F[fa:fa-file-excel-o nyc.csv]-->G[fa:fa-file-excel-o inspections_sub_8.csv] \n G-->H[fa:fa-file-excel-o 8_8.csv] \n H-.->C \n";
        setTimeout(function() {
            browse.lineage = "graph LR \n A[fa:fa-building restaurants_inspection]-->B[fa:fa-file-excel-o restaurants_nyc.csv] \n B-.->C[fa:fa-bullseye restaurants_sep_2014_vc.csv] \n D[fa:fa-building nyc_open]-->E[fa:fa-file-excel-o NYPD_Motor_Vehicle_Collisions_2014.csv] \n E-.->C \n F[fa:fa-file-excel-o nyc.csv]-->G[fa:fa-file-excel-o inspections_sub_8.csv] \n G-->H[fa:fa-file-excel-o 8_8.csv] \n H-.->C \n";

            mermaid.init({
                startOnLoad: true,
                flowchart: {
                    useMaxWidth: false,
                    htmlLabels: true
                }
            }, ".graph-flowchart");
        }, browse, 1000);

        browse.selectedItem = browse.selectedItem || {};
        browse.selectedItem.newTags = [{
            name: 'tag999'
        }, {
            name: 'tag2'
        }];

        browse.openEditGraphModal = function(item) {
            browse.selectedItem = item;
            var popup = new Foundation.Reveal($('#edit-tag-modal'));
            popup.open();
        };

        browse.handleTabClick = function() {
            setTimeout(function() {
                browse.redrawGraph();
            }, 1);
        };

        browse.tabs = [{
            title: "Fields",
            content: "modules/browse/includes/tab-fields.html",
            active: true
        }, {
            title: "Data",
            content: ""
        }, {
            title: "Lineage",
            content: "modules/browse/includes/tab-lineage.html"
        }, {
            title: "Field Tags",
            content: ""
        }, {
            title: "History",
            content: ""
        }];

        browse.editTags = browse.editTags || {};
        browse.editTags.tabs = [{
            title: "Add",
            content: "modules/browse/includes/tagTabs/add.html",
            active: true
        }, {
            title: "Search",
            content: "modules/browse/includes/tagTabs/search.html"
        }];

        browse.cardinalityFilters = [false, false, false, false];
        browse.densityFilters = [false, false, false, false, false];
        browse.dataFieldTypeFilters = [false, false, false, false, false, false];
        browse.tagFilters = [false];

        browse.hideOrClearFilter = function(action, type) {
            var arr = [];
            if (type == 'count')
                arr = browse.cardinalityFilters;
            else if (type == 'perc')
                arr = browse.densityFilters;
            else if (type == 'data_field_type')
                arr = browse.dataFieldTypeFilters;

            if (action == 'clear') {
                for (var i = 0; i < arr.length; i++)
                    arr[i] = false
            } else {
                var chk = false;
                for (var i = 0; i < arr.length; i++)
                    if (arr[i]) {
                        chk = arr[i];
                        break;
                    }
                return chk;
            }
        };

        browse.getPages = function() {
            var tmp = [];
            for (var i = 1; i <= $scope.indexVM.pageCount; i++)
                tmp.push(i);
            return tmp;
        };

        browse.redrawGraph = function() {
            angular.element(document.querySelector('#graph-flowchart'))
                .empty()
                .removeAttr('data-processed')
                .html(browse.lineage);

            mermaid.init({
                startOnLoad: true,
                flowchart: {
                    useMaxWidth: false,
                    htmlLabels: true
                }
            }, ".graph-flowchart");
        };

        $scope.$watch('indexVM.loading', function(newVal, oldVal) {
            if (newVal) {
                browse.selectedObject = null;
                browse.selectedRow = null;
            }
        });

        function _refineFieldTabData(resp) {
            if (!$scope.indexVM.results) {
                setTimeout(function() {
                    _refineFieldTabData(resp);
                }, resp, 100);
            } else {
                browse.metadata = $scope.indexVM.results.hits.hits;
                // Create tag dictionary
                browse.testIndexData = resp.hits.hits;
                browse.tagsDict = [];
                for (var index = 0; index < browse.testIndexData.length; index++) {
                    var currentItem = browse.testIndexData[index];
                    browse.tagsDict[currentItem._id] = currentItem;
                }

                // For each tag in data, get corresponding tag
                for (var index = 0; index < browse.metadata.length; index++) {
                    var currentItem = browse.metadata[index]._source;
                    currentItem.mappedTags = [];
                    for (var tag_index = 0; tag_index < currentItem.tags.length; tag_index++) {
                        var tagItem = browse.tagsDict[currentItem.tags[tag_index].tag_id];
                        currentItem.mappedTags.push(tagItem._source.name);
                    }
                    // browse.metadata[index]._source.mappedTags = currentItem.mappedTags;
                }

            }
        }

        // Make a search request for the mixed content
        esClient.search(euiBrowseTagQuery).then(function(resp) {
            _refineFieldTabData(resp);
        }, function(err) {
            console.trace(err.message);
        });
    }

})(angular.module('core.browse.controller', []));
