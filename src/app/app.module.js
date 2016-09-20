(function() {
    'use strict';
    angular
        .module('app', [
            'quartz',
            'ngAnimate', 'ngCookies', 'ngSanitize', 'ngMessages',
            'ui.router', 'pascalprecht.translate', 'LocalStorageModule', 'angularMoment',
            //'seed-module',
            // uncomment above to activate the example seed module
            // 'app.examples',
            'app.parts'
        ]);

    _core.util=new _core.AppUtil();
    var mainRef = firebase.database(_core.util.app).ref();

    angular.element(document).ready(function() {
        // your Firebase data URL goes here, no trailing slash
        console.log(window.location);
        angular.forEach(window.config,function(config){
            config.apply(null);
        });
        mainRef.child('config').once('value', function (snap) {
            angular.module('app')
                .constant('APP_LANGUAGES', [{
                    name: 'LANGUAGES.CHINESE',
                    key: 'zh'
                },{
                    name: 'LANGUAGES.ENGLISH',
                    key: 'en'
                },{
                    name: 'LANGUAGES.FRENCH',
                    key: 'fr'
                },{
                    name: 'LANGUAGES.PORTUGUESE',
                    key: 'pt'
                }])

                .constant('config', Object.assign({
                    debug: true,
                    shipping: 0,
                    taxRate: 0,
                    serverFb: 'quartz', /*https://quartz.firebaseio.com*/
                    home:'quartzplayertest',
                    defaultUrl:'/admin/test',
                    // where to redirect users if they need to authenticate
                    loginRedirectState:'authentication.login'
                },snap.val()));

            angular.bootstrap(document, ['app']);
        });
    });
})();
