(function () {
    'use strict';

    angular
        .module('app.parts.design')
        .config(pagesConfig);

    /* @ngInject */
    function pagesConfig($stateProvider) {
        $stateProvider
            .state('customPage', {
                url: '/:siteName/:pageName/?id&params&params2&cate&subCate&queryString&tag&devMode',
                params: {
                    siteName: '',
                    id: '',
                    pageName: 'index',
                    params: '',
                    params2: '',
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
