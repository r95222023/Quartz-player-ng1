(function () {
    'use strict';

    angular
        .module('app.parts.users')
        .config(moduleConfig);

    /* @ngInject */
    function moduleConfig($translatePartialLoaderProvider, $stateProvider, qtMenuProvider) {
        $translatePartialLoaderProvider.addPart('app/parts/users');

        $stateProvider
            .state('quartz.admin-default.allusers', {
                url: '/admin/users',
                templateUrl: 'app/parts/users/all-users.tmpl.html',
                // set the controller to load for this page
                controller: 'AllUsersController',
                controllerAs: 'vm'
            })
            .state('quartz.admin-default.siteusers', {
                url: '/admin/:siteName/users',
                params: {
                    siteName: ''
                },
                templateUrl: 'app/parts/users/all-users.tmpl.html',
                // set the controller to load for this page
                controller: 'SiteUsersController',
                controllerAs: 'vm'
            })
            .state('quartz.admin-default.admins', {
                url: '/admin/:siteName/admins',
                params: {
                    siteName: ''
                },
                templateUrl: 'app/parts/users/admins.tmpl.html',
                // set the controller to load for this page
                controller: 'AdminsController',
                controllerAs: 'vm'
            });
    }
})();
