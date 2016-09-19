(function() {
    'use strict';

    angular
        .module('app.parts.analytics')
        .config(moduleConfig);

    /* @ngInject */
    function moduleConfig($translatePartialLoaderProvider, $stateProvider, qtMenuProvider) {
        $stateProvider
        .state('quartz.admin-default.analytics', {
            data: {
                //toolbarShrink: true,
                footer: false
            },
            url: '/admin/:siteName/analytics',
            params: {
                siteName: ''
            },
            templateUrl: 'app/parts/analytics/analytics.tmpl.html',
            // set the controller to load for this page
            controller: 'AnalyticsController',
            controllerAs: 'vm'
        });
    }
})();
