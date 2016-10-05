(function () {
    'use strict';

    angular
        .module('app.parts.test')
        .config(moduleConfig);

    /* @ngInject */
    function moduleConfig($stateProvider) {
        $stateProvider
            .state('playertest', {
                url: '/admin/test',
                views: {
                    'root': {
                        templateUrl: 'app/parts/test/test.tmpl.html',
                        // set the controller to load for this page
                        controller: 'TestPageController',
                        controllerAs: 'vm'
                    }
                }
            });
    }
})();
