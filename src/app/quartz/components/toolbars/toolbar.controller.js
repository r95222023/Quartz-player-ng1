(function () {
    'use strict';

    angular
        .module('quartz.components')
        .controller('DefaultToolbarController', DefaultToolbarController);

    /* @ngInject */
    function DefaultToolbarController($auth, config, $scope, $rootScope, $mdMedia, $translate, $state, $stateParams, $element, $filter, $mdUtil, $mdSidenav, $mdToast, $timeout, ngCart, qtBreadcrumbsService, qtSettings, qtNotificationsService, qtLayout) {
        var vm = this;
        vm.breadcrumbs = qtBreadcrumbsService.breadcrumbs;
        vm.emailNew = false;
        vm.languages = qtSettings.languages;
        vm.logout = logout;
        vm.openSideNav = openSideNav;
        vm.hideMenuButton = hideMenuButton;
        vm.switchLanguage = switchLanguage;
        vm.toggleNotificationsTab = toggleNotificationsTab;
        vm.notificationSubTotal = notificationSubTotal;
        vm.cartSubTotal = cartSubTotal;

        ////////////////

        function logout() {
            if($stateParams.siteName&&$stateParams.pageName){
                $state.go($stateParams.stateName||'customPage',$stateParams);
            } else {
                $state.go(config.home);
            }
            $auth.signOut();
        }

        function openSideNav(navID) {
            $mdUtil.debounce(function () {
                $mdSidenav(navID).toggle();
            }, 300)();
        }

        function switchLanguage(languageCode) {
            $translate.use(languageCode)
                .then(function () {
                    $mdToast.show(
                        $mdToast.simple()
                            .content($filter('translate')('MESSAGES.LANGUAGE_CHANGED'))
                            .position('bottom right')
                            .hideDelay(500)
                    );
                });
        }

        function hideMenuButton() {
            return qtLayout.layout.sideMenuSize !== 'hidden' && $mdMedia('gt-sm');
        }

        function toggleNotificationsTab(tab) {
            $rootScope.$broadcast('qtSwitchNotificationTab', tab);
            vm.openSideNav('notifications');
        }

        function notificationSubTotal() {
            return qtNotificationsService.getSubTotal()
        }

        function cartSubTotal() {
            return ngCart.getTotalItems()
        }

        $scope.$on('newMailNotification', function () {
            vm.emailNew = true;
        });
    }
})();
