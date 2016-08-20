(function (app) {
    'use strict';

    app.controller('AppController', AppController);
    app.service('esClient', function (esFactory) {
        return esFactory({
            host: 'http://41.106.2.2:9200'
        });
    });
    app.config(RouteConfig);
    app.config(Routes);
    app.config(function ($mdIconProvider) {
        $mdIconProvider
            .iconSet('social', 'img/icons/sets/social-icons.svg', 24)
            .defaultIconSet('img/icons/sets/core-icons.svg', 24);
    });
    app.config(function ($mdThemingProvider) {
        $mdThemingProvider.theme('default')
            .primaryPalette('amber', {
                'default': '400', // by default use shade 400 from the pink palette for primary intentions
                'hue-1': '300', // use shade 100 for the <code>md-hue-1</code> class
                'hue-2': '500', // use shade 600 for the <code>md-hue-2</code> class
                'hue-3': '600' // use shade A100 for the <code>md-hue-3</code> class
            })
            // If you specify less than all of the keys, it will inherit from the
            // default shades
            .accentPalette('purple', {
                'default': '200' // use shade 200 for default, and keep all other shades the same
            });
    });
    AppController.$inject = ['$rootScope'];
    RouteConfig.$inject = ['$urlRouterProvider'];
    Routes.$inject = ['$stateProvider'];

    function AppController($rootScope) {
        var app = this;
    }

    function RouteConfig($urlRouterProvider) {
        $urlRouterProvider.otherwise('/login');
    }

    function Routes($stateProvider) {
        $stateProvider
            .state('home', {
                abstract: true,
                template: '<ui-view></ui-view>',
                controller: 'AppController',
                controllerAs: 'app'
            });
    }

})(angular.module('core', [
    'ui.router',
    'core.shared',
    'core.auth',
    'core.home',
    'core.dashboard',
    'core.manage',
    'core.browse',
    'core.services',
    'core.filters',
    'core.constants',
    'elasticui',
    'ngMaterial',
    'elasticsearch'
]));
