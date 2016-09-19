'use strict';

/**
 * @ngdoc function
 * @name AdminController
 * @module qtAngular
 * @kind function
 *
 * @description
 *
 * Handles the admin view
 */
(function() {
    'use strict';

    angular
        .module('quartz.layouts')
        .controller('DefaultLayoutController', DefaultLayoutController);

    /* @ngInject */
    function DefaultLayoutController($scope, $element, $mdSidenav, qtLayout) {
        // we need to use the scope here because otherwise the expression in md-is-locked-open doesnt work
        $scope.layout = qtLayout.layout; //eslint-disable-line
        var vm = this;

        vm.activateHover = activateHover;
        vm.removeHover  = removeHover;
        vm.toggleSidenav = toggleSidenav;

        ////////////////

        function activateHover() {
            if(qtLayout.layout.sideMenuSize === 'icon') {
                $element.find('.admin-sidebar-left').addClass('hover');
            }
        }

        function removeHover () {
            if(qtLayout.layout.sideMenuSize === 'icon') {
                $element.find('.admin-sidebar-left').removeClass('hover');
            }
        }

        function toggleSidenav(navId) {
            $mdSidenav(navId).toggle();
        }
    }
})();
