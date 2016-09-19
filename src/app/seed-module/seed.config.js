(function() {
    'use strict';

    angular
        .module('seed-module')
        .config(moduleConfig);

    /* @ngInject */
    function moduleConfig($translatePartialLoaderProvider, $stateProvider, qtMenuProvider) {
        $translatePartialLoaderProvider.addPart('app/seed-module');

        $stateProvider
        .state('quartz.admin-default.seed-page', {
            url: '/seed-module/seed-page',
            templateUrl: 'app/seed-module/seed-page.tmpl.html',
            // set the controller to load for this page
            controller: 'SeedPageController',
            controllerAs: 'vm'
        });

        qtMenuProvider.addMenu({
            name: 'MENU.SEED.SEED-MODULE',
            icon: 'zmdi zmdi-grade',
            type: 'dropdown',
            priority: 1.1,
            children: [{
                name: 'MENU.SEED.SEED-PAGE',
                state: 'quartz.admin-default.seed-page',
                type: 'link'
            }]
        });
    }
})();