(function () {
    'use strict';

    angular
        .module('app.parts.sites')
        .config(sitesConfig);

    /* @ngInject */
    function sitesConfig($translatePartialLoaderProvider, $stateProvider, qtMenuProvider) {
        $translatePartialLoaderProvider.addPart('app/parts/sites');

        $stateProvider
            .state('quartz.admin-default.mysites', {
                data: {
                    layout: {
                        sideMenuSize: 'hidden',
                        //toolbarShrink: true,
                        footer: false
                    }
                },
                resolve: {
                    authData: ['$auth', function ($auth) {
                        return $auth.waitForAuth()
                    }]
                },
                url: '/admin/mysites',
                templateUrl: 'app/parts/sites/my-sites.tmpl.html',
                // set the controller to load for this page
                controller: 'MySitesController',
                controllerAs: 'vm'
            })
            .state('quartz.admin-default.allsites', {
                data: {
                    layout: {
                        // sideMenuSize: 'hidden',
                        //toolbarShrink: true,
                        footer: false
                    }
                },
                resolve: {
                    authData: ['$auth', function ($auth) {
                        return $auth.waitForAuth()
                    }]
                },
                url: '/admin/allsites',
                templateUrl: 'app/parts/sites/all-sites.tmpl.html',
                // set the controller to load for this page
                controller: 'AllSitesController',
                controllerAs: 'vm'
            })
            .state('quartz.admin-default.siteSetting-basic', {
                data: {
                    layout: {
                        // sideMenuSize: 'hidden',
                        //toolbarShrink: true,
                        footer: false
                    }
                },
                url: '/admin/:siteName/setting/basic',
                params: {
                    siteName: ''
                },
                templateUrl: 'app/parts/sites/settings/basic.tmpl.html',
                // set the controller to load for this page
                controller: 'SiteSettingCtrl',
                controllerAs: 'vm'
            })
            .state('quartz.admin-default.siteSetting-advance', {
                url: '/admin/:siteName/setting/advance',
                params: {
                    siteName: ''
                },
                resolve: {
                    getSyncTime: _core.syncTime,
                    authData: ['$auth', function ($auth) {
                        return $auth.waitForAuth()
                    }]
                },
                data: {
                    layout: {
                        footer: false
                    }
                },
                templateUrl: 'app/parts/sites/settings/advance.tmpl.html',
                controller: 'SiteSettingCtrl',
                controllerAs: 'vm'
            })

            .state('quartz.admin-default.siteSetting-payment', {
                data: {
                    layout: {
                        // sideMenuSize: 'hidden',
                        //toolbarShrink: true,
                        footer: false
                    }
                },
                url: '/admin/:siteName/payment',
                params: {
                    siteName: ''
                },
                templateUrl: 'app/parts/sites/settings/payment.tmpl.html',
                // set the controller to load for this page
                controller: 'SiteSettingCtrl',
                controllerAs: 'vm'
            })
            .state('quartz.admin-default.template', {
                data: {
                    layout: {
                        // sideMenuSize: 'hidden',
                        //toolbarShrink: true,
                        footer: false
                    }
                },
                url: '/admin/templateMgr',
                templateUrl: 'app/parts/sites/template.tmpl.html',
                // set the controller to load for this page
                controller: 'TemplateCtrl',
                controllerAs: 'vm'
            });
    }
})();
