(function () {
    'use strict';
    angular.module('app', [
        'quartz',
        'ngAnimate', 'ngCookies', 'ngSanitize', 'ngMessages',
        'ui.router', 'pascalprecht.translate', 'LocalStorageModule', 'angularMoment',
        //'seed-module',
        // uncomment above to activate the example seed module
        // 'app.examples',

        'oc.lazyLoad',
        'app.parts',
        'app.load'
    ]);



    _core.util = new _core.AppUtil();
    var promises = [];
    var mainRef = firebase.database(_core.util.app).ref();
    _core.util.getSitePreload().then(function (res) {
        var extraModules=[];
        if (res&&res.commonPackages) {
            for (var key in res.commonPackages) {
                promises.push(_core.util.loader.loadPackages(key, res.commonPackages[key], extraModules));
            }
        }
        angular.module('app.load',extraModules||[]);
        // promises.push(_core.util.loader.loadPackages('ngMaterial', {version: '1.1.0'},extraModules));
        angular.element(document).ready(function () {
            // your Firebase data URL goes here, no trailing slash
            console.log(window.location);
            angular.forEach(window.config, function (config) {
                config.apply(null);
            });

            mainRef.child('config').once('value', function (snap) {
                angular.module('app')
                    .constant('APP_LANGUAGES', [{
                        name: 'LANGUAGES.CHINESE',
                        key: 'zh'
                    }, {
                        name: 'LANGUAGES.ENGLISH',
                        key: 'en'
                    }, {
                        name: 'LANGUAGES.FRENCH',
                        key: 'fr'
                    }, {
                        name: 'LANGUAGES.PORTUGUESE',
                        key: 'pt'
                    }])

                    .constant('config', Object.assign({
                        debug: true,
                        shipping: 0,
                        taxRate: 0,
                        serverFb: 'quartz', /*https://quartz.firebaseio.com*/
                        home: 'quartzplayertest',
                        defaultUrl: '/admin/test',
                        // where to redirect users if they need to authenticate
                        loginRedirectState: 'authentication.login'
                    }, snap.val()));


                Promise.all(promises).then(function(){
                    angular.bootstrap(document, ['app']);
                });
            });
        });
    });



})();
