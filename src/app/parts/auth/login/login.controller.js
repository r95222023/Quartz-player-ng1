(function () {
    'use strict';

    angular
        .module('app.parts.auth')
        .controller('LoginController', LoginController);

    /* @ngInject */
    function LoginController($state, $stateParams, $mdMedia, qtSettings, $auth, config) {
        var vm = this;

        vm.email = null;
        vm.pass = null;
        vm.confirm = null;
        vm.createMode = false;

        vm.loginOption = {};
        vm.login = login;
        vm.loginWithProvider = loginWithProvider;
        vm.socialLogins = [{
            provider: 'twitter',
            icon: 'fa fa-twitter',
            color: '#5bc0de',
            url: '#'
        }, {
            provider: 'facebook',
            icon: 'fa fa-facebook',
            color: '#337ab7',
            url: '#'
        }, {
            provider: 'google',
            icon: 'fa fa-google-plus',
            color: '#e05d6f',
            url: '#'
        }, {
            provider: 'github',
            icon: 'fa fa-github-alt',
            color: '#CACACA',
            url: '#'
        }];
        vm.qtSettings = qtSettings;
        // create blank user variable for login form
        vm.user = {
            email: '',
            password: ''
        };

        ////////////////
        function redirect(){
            if($stateParams.siteName&&$stateParams.pageName){
                $state.go($stateParams.stateName||'customPage',$stateParams)
            } else {
                $state.go(config.home);
            }
        }

        function showError(err) {
            vm.err = angular.isObject(err) && err.code ? err.code : err + '';
        }

        function login(email, pass, opt) {
            vm.err = null;
            $auth.signInWithEmailAndPassword(email,pass).then(function(){
                redirect();
            }, showError);
        }

        function loginWithProvider(provider) {
            if ($mdMedia('xs')) {
                var homeUrl = window.location.href.split('#')[0] + '#' + config.defaultUrl;
                vm.loginOption.popup = false;
                vm.loginOption.remember = 'default';
                window.location.href = homeUrl;
                $auth.loginWithProvider(provider, vm.loginOption);
            } else {
                $auth.loginWithProvider(provider, vm.loginOption).catch(showError).then(function(res){
                    redirect();
                    return $auth.checkIfAccountExistOnFb(res.user)
                }).then($auth.createAccount);
            }
        }
    }
})();
