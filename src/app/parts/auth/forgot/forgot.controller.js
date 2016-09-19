(function() {
    'use strict';

    angular
        .module('app.parts.auth')
        .controller('ForgotController', ForgotController);

    /* @ngInject */
    function ForgotController($state, $mdToast, $filter, qtSettings, $auth) {
        var vm = this;
        vm.qtSettings = qtSettings;
        vm.email = '';
        vm.user = {
            email: ''
        };
        vm.resetClick = resetClick;

        ////////////////

        function resetClick() {

            $auth.$resetPassword({email:vm.email})
                .then(success, error);

            function success() {
                $mdToast.show(
                    $mdToast.simple()
                        .content($filter('translate')('FORGOT.MESSAGES.RESET_SENT') + ' ' + vm.email)
                        .position('bottom right')
                        .action($filter('translate')('FORGOT.MESSAGES.LOGIN_NOW'))
                        .highlightAction(true)
                        .hideDelay(0)
                ).then(function() {
                        $state.go('authentication.login');
                    });
            }

            function error(error) {
                $mdToast.show(
                    $mdToast.simple()
                        .content($filter('translate')('FORGOT.MESSAGES.NO_RESET') + ' ' + vm.email)
                        .position('bottom right')
                        .hideDelay(5000)
                );
            }
        }
    }
})();
