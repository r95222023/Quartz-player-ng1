(function () {
    'use strict';

    angular
        .module('app.parts.auth')
        .config(moduleConfig);

    /* @ngInject */
    function moduleConfig($translatePartialLoaderProvider, $stateProvider, qtMenuProvider) {
        $translatePartialLoaderProvider.addPart('app/parts/auth');

        $stateProvider
            .state('authentication', {
                abstract: true,
                templateUrl: 'app/parts/auth/layouts/authentication.tmpl.html'
            })
            .state('authentication.login', {
                url: '/:siteName/login/?pageName&stateName',
                params: {
                    siteName: '',
                    pageName: '',
                    stateName: ''
                },
                templateUrl: 'app/parts/auth/login/login.tmpl.html',
                controller: 'LoginController',
                controllerAs: 'vm'
            })
            .state('authentication.signup', {
                url: '/signup',
                templateUrl: 'app/parts/auth/signup/signup.tmpl.html',
                controller: 'SignupController',
                controllerAs: 'vm'
            })
            .state('authentication.lock', {
                url: '/lock',
                templateUrl: 'app/parts/auth/lock/lock.tmpl.html',
                controller: 'LockController',
                controllerAs: 'vm'
            })
            .state('authentication.forgot', {
                url: '/forgot',
                templateUrl: 'app/parts/auth/forgot/forgot.tmpl.html',
                controller: 'ForgotController',
                controllerAs: 'vm'
            })
            .stateAuthenticated('quartz.admin-default.profile', {
                url: '/:siteName/profile',
                params: {
                    siteName: ''
                },
                templateUrl: 'app/parts/auth/profile/profile.tmpl.html',
                controller: 'ProfileController',
                controllerAs: 'vm',
                resolve:{
                    userData: ['$auth', function ($auth) {
                        return $auth.waitForAuth()
                    }]
                }
            });
    }
})();
