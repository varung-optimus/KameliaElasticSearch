(function(app) {
    app.directive('mermaidGraph', mermaidGraphDirective);
    app.directive('leftSidebar', leftSidebarDirective);
    app.directive('rightSidebar', rightSidebarDirective);
    app.directive('dashboardPieChart', dashboardPieChartDirective);
    app.directive('trafficChart', trafficChartDirective);

    // Directive for Mermaid API graph
    function mermaidGraphDirective() {
        return {
            restrict: 'E',
            templateUrl: 'modules/shared/directives/mermaidGraph/mermaidGraph.html',
            scope: {
                mermaid: '=',
                isEditEnabled: '@'
            },
            controller: 'SharedController',
            controllerAs: 'shared',
            bindToController: true
        };
    };

    // Directive for Left sidebar
    function leftSidebarDirective() {
        return {
            restrict: 'E',
            templateUrl: 'modules/shared/directives/leftSidebar/leftSidebar.html',
            controller: 'SharedController',
            controllerAs: 'shared',
            bindToController: true
        };
    };

    // Directive for Right sidebar
    function rightSidebarDirective() {
        return {
            restrict: 'E',
            templateUrl: 'modules/shared/directives/rightSidebar/rightSidebar.html',
            controller: 'SharedController',
            controllerAs: 'shared',
            bindToController: true
        };
    };

    // Directive for Right sidebar
    function dashboardPieChartDirective() {
        return {
            restrict: 'E',
            templateUrl: 'modules/shared/directives/dashboardPieChart/dashboardPieChart.html',
            controller: 'SharedController',
            controllerAs: 'shared',
            bindToController: true
        };
    };


	// Directive for Traffic chart
    function trafficChartDirective() {
        return {
            restrict: 'E',
            templateUrl: 'modules/shared/directives/trafficChart/trafficChart.html',
            controller: 'SharedController',
            controllerAs: 'shared',
            bindToController: true
        };
    };

})(angular.module('core.shared', ['core.shared.controller']));
