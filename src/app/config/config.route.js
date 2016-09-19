window.config=window.config||{};
window.config.route=function () {
    'use strict';
    angular
        .module('app')
        .config(routeConfig);

    /* @ngInject */
    function routeConfig($stateProvider, $urlRouterProvider, config, $locationProvider) {
        // Setup the apps routes
        $locationProvider.hashPrefix('!');

        // 404 & 500 pages
        $stateProvider
            .state('404', {
                url: '/404',
                templateUrl: '404.tmpl.html',
                controllerAs: 'vm',
                controller: function ($state) {
                    var vm = this;
                    vm.goHome = function () {
                        $state.go(config.home);
                    };
                }
            })

            .state('500', {
                url: '/500',
                templateUrl: '500.tmpl.html',
                controllerAs: 'vm',
                controller: function ($state) {
                    var vm = this;
                    vm.goHome = function () {
                        $state.go(config.home);
                    };
                }
            });


        // set default routes when no path specified
        $urlRouterProvider.when('', config.defaultUrl);
        $urlRouterProvider.when('/', config.defaultUrl);

        // always goto 404 if route not found
        $urlRouterProvider.otherwise('/404');
    }
};
//window.config.route();
