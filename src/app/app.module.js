(function () {
    'use strict';

    angular.module("app.tmpl",[]); //create a module for templateCache
    _core.util = _core.util||new _core.AppUtil();
    _core.util.site.getSitePreload().then(function (res) {
        console.log(res);

        var promises = [];
        var extra=[];

        if(res&&res.preset&&Array.isArray(res.preset.dependencies)){
            extra=res.preset.dependencies;
        }
        // load if following modules exist
        ['app.custom','ngMaterial','md.data.table','angulartics','angulartics.google.analytics'].forEach(function(extraMod){
            try{
                angular.module(extraMod);
                extra.push(extraMod);

            } catch(e){}
        });

        angular.module('app', [
            'quartz',
            'ngAnimate', 'ngCookies', 'ngSanitize', 'ngMessages',
            'ui.router', 'pascalprecht.translate',
            'oc.lazyLoad',
            'app.parts',
            'app.tmpl',
            'app.configs'
        ].concat(extra));

        angular.element(document).ready(function () {
            angular.module('app')
            // .constant('APP_LANGUAGES', [{
            //     name: 'LANGUAGES.CHINESE',
            //     key: 'zh'
            // }, {
            //     name: 'LANGUAGES.ENGLISH',
            //     key: 'en'
            // }, {
            //     name: 'LANGUAGES.FRENCH',
            //     key: 'fr'
            // }, {
            //     name: 'LANGUAGES.PORTUGUESE',
            //     key: 'pt'
            // }])

                .constant('config', {
                    debug: true,
                    shipping: 0,
                    taxRate: 0,
                    serverFb: 'quartz', /*https://quartz.firebaseio.com*/
                    home: 'quartzplayertest',
                    defaultUrl: '/admin/test',
                    // where to redirect users if they need to authenticate
                    loginRedirectState: 'authentication.login'
                });


            Promise.all(promises).then(function(){
                angular.bootstrap(document, ['app']);
            });
        });
    });
})();
