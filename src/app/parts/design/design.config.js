(function () {
    'use strict';

    angular
        .module('app.parts.design')
        .config(pagesConfig);

    /* @ngInject */
    function pagesConfig($stateProvider) {
        $stateProvider
            .state('customPage', {
                url: '/'+_core.util.site.siteName+'/:pageName/?id&params&params2&cate&subCate&queryString&tag&devMode',
                params: {
                    // siteName: '',
                    id: '',
                    pageName: 'index',
                    params: '',
                    params2: '',
                    devMode: ''
                },
                views: {
                    'root': {
                        controller: 'CustomPageController',
                        controllerAs: 'customPage',
                        templateProvider: ['pageData', function (pageData) {
                            return pageData.body || '<custom-item id="custom-page" content="customPage.html" api-ctrl="BasicApiController" custom-js="customPage.js" sources="customPage.sources" style="height:100%; width:100%"></custom-item>'
                        }]
                    }
                },
                resolve: {
                    getSyncTime: _core.syncTime,
                    authData: ['$auth', function ($auth) {
                        return $auth.waitForAuth();
                    }],
                    pageData: ['sitesService', '$lazyLoad', '$stateParams', function (sitesService, $lazyLoad, $stateParams) {
                        return new Promise(function (resolve, reject) {
                            sitesService.onReady().then(function () {
                                $lazyLoad.load('page', $stateParams.pageName).then(function (pageData) {
                                    resolve(pageData);
                                });
                            }).catch(reject);
                        });
                    }]
                }
            })
            .state('previewFrame', {
                url: '/preview/:siteName/:pageName/?params',
                views: {
                    'root': {
                        controller: 'PreviewFrameController',
                        controllerAs: 'customPage'
                    }
                },
                params: {
                    siteName: '',
                    pageName: '',
                    params: ''
                },
                resolve: {
                    onSiteReady: ['sitesService', function (sitesService) {
                        return sitesService.onReady();
                    }]
                }
            })
    }
})();
