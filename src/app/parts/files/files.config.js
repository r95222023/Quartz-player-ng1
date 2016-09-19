(function () {
    'use strict';

    angular
        .module('app.parts.analytics')
        .config(moduleConfig);

    /* @ngInject */
    function moduleConfig($translatePartialLoaderProvider, $stateProvider, qtMenuProvider) {
        $stateProvider
            .state('quartz.admin-default-no-scroll.fileManager', {
                data: {
                    layout: {
                        // sideMenuSize: 'hidden',
                        // showToolbar: false,
                        // //toolbarShrink: true,
                        contentClass: 'full-height',
                        innerContentClass:'filemanager-container',
                        footer: false
                    }
                },
                resolve:{
                    fileManager:['$ocLazyLoad','$transitions','injectCSS',function($ocLazyLoad,$transitions,injectCSS){
                        var load = $ocLazyLoad.load({
                            serie:true,
                            files:[
                                'assets/modules/bootstrap/dist/js/bootstrap.min.js',
                                'assets/modules/file-manager/angular-filemanager.min.js',
                                'assets/modules/file-manager/angular-filemanager.config.js'
                            ]
                        });
                        injectCSS.set('bootstrapcss', 'assets/modules/bootswatch/paper/bootstrap.min.css');
                        injectCSS.set('filemanagercss', 'assets/modules/file-manager/angular-filemanager.min.css');

                        var clean =$transitions.onBefore( { to: '**' }, function(trans){
                            injectCSS.remove('bootstrapcss');
                            injectCSS.remove('filemanagercss');
                            clean();
                        });
                        return load;
                    }]
                },
                url: '/admin/:siteName/files',
                params: {
                    siteName: ''
                },
                // set the controller to load for this page
                // controller: 'FileManagerController',
                // controllerAs: 'vm',
                template: '<angular-filemanager></angular-filemanager>'
            });
    }
})();
