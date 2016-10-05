(function () {
    'use strict';
    var extra;
    try{
        extra=['app.custom'];
        angular.module('app.custom');
    } catch(e){
        extra=[];
    }
    angular.module('app', [
        'quartz',
        'ngAnimate', 'ngCookies', 'ngSanitize', 'ngMessages',
        'ui.router', 'pascalprecht.translate',
        //'seed-module',
        // uncomment above to activate the example seed module
        // 'app.examples',
        'oc.lazyLoad',
        'app.parts'
    ].concat(extra));



    _core.util = _core.util||new _core.AppUtil();
    var promises = [];
    var mainRef = firebase.database(_core.util.app).ref();
    _core.util.getSitePreload().then(function (res) {

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
