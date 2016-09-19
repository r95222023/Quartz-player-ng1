(function () {
    'use strict';

    angular
        .module('quartz.components')
        .directive('qtMenu', qtMenuDirective);

    /* @ngInject */
    function qtMenuDirective($location, $mdTheming, qtTheming) {
        // Usage:
        //
        // Creates:
        //
        var directive = {
            restrict: 'E',
            template: '<md-content><qt-menu-item ng-repeat="item in qtMenuController.menu | orderBy:\'priority\'" item="::item"></qt-menu-item></md-content>',
            scope: {admin: '@', listName: '@'},
            controller: qtMenuController,
            controllerAs: 'qtMenuController',
            link: link
        };
        return directive;

        function link($scope, $element, attrs) {
            var menuColorRGBA;
            if(attrs.backgroundColor){
                menuColorRGBA = attrs.backgroundColor;
            } else {
                $mdTheming($element);
                var $mdTheme = $element.controller('mdTheme'); //eslint-disable-line
                var menuColor = qtTheming.getThemeHue($mdTheme.$mdTheme, 'primary', 'default');
                menuColorRGBA = qtTheming.rgba(menuColor.value);
            }

            $element.parent().css({'background-color': menuColorRGBA});
            $element.children('md-content').css({'background-color': menuColorRGBA});
        }
    }

    /* @ngInject */
    function qtMenuController($scope, qtMenu, $timeout) {
        var qtMenuController = this;
        // get the menu and order it
        if ($scope.admin === '') {
            qtMenuController.menu = qtMenu.menu
        } else {
            // var name = $scope.listName || 'menu';
            // customData.get(name).then(function (val) {
            //     if(!val) return;
            //     $timeout(function () {
            //         qtMenuController.menu = val;
            //     }, 0)
            // });
        }
    }
})();
