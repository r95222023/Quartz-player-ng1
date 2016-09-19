(function() {
    'use strict';

    angular
        .module('app.parts.test')
        .config(moduleConfig);

    /* @ngInject */
    function moduleConfig($stateProvider, qtMenuProvider) {

        $stateProvider
        .state('quartz.admin-default.test', {
            url: '/:siteName/test',
            templateUrl: 'app/parts/test/test.tmpl.html',
            // set the controller to load for this page
            controller: 'TestPageController',
            controllerAs: 'vm'
        });
    }
})();
