(function () {
    'use strict';

    angular
        .module('quartz.components')
        .factory('$auth', Auth)
        .run(run);

    /*@ngInject*/
    function Auth($firebase) {
        var Auth = firebase.auth(_core.util.app);

        var readyPromise = new Promise(function(resolve,reject){
            var unsubscribe = Auth.onAuthStateChanged(function () {
                resolve(Auth.currentUser);
                unsubscribe();
            });
        });

        Auth.waitForAuth = function () {
            return Promise.resolve(Auth.currentUser);
        };

        Auth.requireAuth = function () {
            if (Auth.currentUser) {
                return Promise.resolve(Auth.currentUser)
            } else {
                return Promise.reject()
            }
        };

        Auth.checkIfAccountExistOnFb = function () {
            return _core.util.auth.checkIfAccountExist();
        };

        Auth.createAccount = function (opt) {
            return _core.util.auth.createAccount(opt);
        };

        Auth.loginWithProvider = function (provider, options) {
            return _core.util.auth.loginWithProvider(provider,options);
        };

        Auth.removeUserData = function (authData, extraCallBack) {
            var uid = authData.uid;
            $firebase.update(['user?type=list', 'user/type=detail'], {
                "@all": null
            },{id:uid}).then(function () {
                if (extraCallBack) extraCallBack(authData);
            });
        };

        return Auth;
    }

    /*@ngInject*/
    function run($rootScope, $auth, $firebase) {

        $auth.onAuthStateChanged(function (user) {
            $rootScope.user = user;
            $rootScope.loggedIn = !!user;

            if (user) {
                $firebase.queryRef('user-path?userId='+user.uid+'&path=info').once('value', function (snap) {
                    var userData = {},
                        providerData = user.providerData;
                    userData.info = snap.val()||{};
                    userData.info.name = user.displayName||providerData[0].displayName||firstPartOfEmail(user.email);
                    userData.info.photoURL = user.photoURL||providerData[0].photoURL;
                    $rootScope.user.info=userData.info;
                });

            } else {
                console.log('no user', user);
            }
        });
    }

    function firstPartOfEmail(emailAddress) {
        return emailAddress.substring(0, emailAddress.indexOf("@"));
    }
})();

