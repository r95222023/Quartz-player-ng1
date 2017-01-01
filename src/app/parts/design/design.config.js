(function () {
    'use strict';

    angular
        .module('app.parts.design')
        .config(pagesConfig);

    /* @ngInject */
    function pagesConfig($stateProvider) {
        var customPageURL = (_core.util.site.domain? '/:pageName': '/'+_core.util.site.siteName+'/:pageName')+'/?params&params2';
        $stateProvider
            .state('previewFrame', {
                url: '/preview/:siteName/:pageName/?params',
                views: {
                    'root': {
                        controller: 'PreviewFrameController',
                        controllerAs: 'qa',
                        templateProvider: ['pageData','customService', function (pageData,customService) {
                            if(pageData){
                                return customService.compileAll(pageData.content, pageData.canvas);
                            } else {
                                return ''
                            }
                        }]
                    }
                },
                params: {
                    siteName:'',
                    pageName:'',
                    params: ''
                },
                resolve: {
                    onSiteReady: ['sitesService', function (sitesService) {
                        return sitesService.onReady();
                    }],
                    pageData: ['sitesService', '$lazyLoad', '$stateParams', function (sitesService, $lazyLoad, $stateParams) {
                        return window._previewPageData;
                    }]
                }
            })
            .state('customPage', {
                url: customPageURL,
                views: {
                    'root': {
                        controller: 'CustomPageCtrl',
                        controllerAs: 'qa',
                        templateProvider: ['pageData','customService', function (pageData,customService) {
                            $('body,html').addClass('qa-loading');
                            return customService.compileAll(pageData.content, pageData.canvas);
                        }]
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
            });
    }
})();
