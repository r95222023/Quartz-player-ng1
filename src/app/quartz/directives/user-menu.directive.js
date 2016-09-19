(function() {
    'use strict';

    angular
        .module('quartz.directives')
        .directive('userMenu', userMenu);

    /* @ngInject */
    function userMenu() {
        return {
            restrict: "E",
            templateUrl:'app/quartz/directives/templates/user-menu.tmpl.html',
            controller:'DefaultToolbarController',
            controllerAs:'userMenu'
        };
    }

})();
