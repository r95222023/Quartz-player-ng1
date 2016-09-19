(function () {
    'use strict';

    angular
        .module('app.parts.design')
        .config(pagesConfig);

    /* @ngInject */
    function pagesConfig($stateProvider, qtMenuProvider, $translatePartialLoaderProvider) {
        $translatePartialLoaderProvider.addPart('app/parts/design');
        $stateProvider
            .state('quartz.admin-default.pageManager', {
                url: '/admin/:siteName/pageManager',
                params: {
                    siteName: ''
                },
                templateUrl: 'app/parts/design/page-manager.tmpl.html',
                controller: 'PageManagerController',
                controllerAs: 'vm'
            })
            .state('quartz.admin-default.widgetManager', {
                url: '/admin/:siteName/widgetManager',
                params: {
                    siteName: ''
                },
                templateUrl: 'app/parts/design/widget-manager.tmpl.html',
                controller: 'WidgetManagerController',
                controllerAs: 'vm'
            })
            .state('pageEditor', {
                resolve: {
                    pageData: ['$firebaseStorage', '$stateParams', function ($firebaseStorage, $stateParams) {
                        return $firebaseStorage.getWithCache('page?type=detail&id=' + $stateParams.pageName);
                    }]
                },
                params: {
                    id: '',
                    pageName: '',
                    params: '',
                    siteName: ''
                },
                url: '/admin/:siteName/pageEditor/?id&pageName&params',
                templateUrl: 'app/parts/design/page-editor.tmpl.html',
                controller: 'PageEditorController',
                controllerAs: 'vm'
            })
            .state('widgetEditor', {
                resolve: {
                    widgetData: ['$lazyLoad', '$stateParams', function ($lazyLoad, $stateParams) {
                        return $lazyLoad.load('widget', $stateParams.widgetName);
                    }]
                },
                params: {
                    id: '',
                    widgetName: '',
                    siteName: ''
                },
                url: '/admin/:siteName/widgetEditor/?id&widgetName',
                templateUrl: 'app/parts/design/widget-editor.tmpl.html',
                controller: 'WidgetEditorController',
                controllerAs: 'vm'
            })
            .state('customPage', {
                url: '/:siteName/:pageName/?id&params&params2&cate&subCate&queryString&tag&devMode',
                params: {
                    siteName: '',
                    id: '',
                    pageName: 'index',
                    params: '',
                    params2: '',
                    cate: '',
                    subCate: '',
                    queryString: '',
                    tag: '',
                    devMode: ''
                },
                resolve: {
                    getSyncTime: _core.syncTime,
                    authData: ['$auth', function ($auth) {
                        return $auth.waitForAuth();
                    }],
                    pageData: ['sitesService', '$lazyLoad', '$stateParams', function (sitesService, $lazyLoad, $stateParams) {
                        return new Promise(function(resolve,reject){
                            sitesService.onReady().then(function () {
                                $lazyLoad.load('page', $stateParams.pageName).then(function (pageData) {
                                    resolve(pageData);
                                });
                            }).catch(reject);
                        });
                    }]
                },
                templateUrl: 'app/parts/design/custom-page.tmpl.html',
                controller: 'CustomPageController',
                controllerAs: 'customPage'
            })
            .state('previewFrame', {
                url: '/preview/:siteName/:pageName/?params',
                params: {
                    siteName: '',
                    pageName: '',
                    params: ''
                },
                templateUrl: 'app/parts/design/custom-page.tmpl.html',
                resolve: {
                    onSiteReady: ['sitesService', function (sitesService) {
                        return sitesService.onReady();
                    }]
                },
                controller: 'PreviewFrameController',
                controllerAs: 'customPage'
            })
    }
})();
