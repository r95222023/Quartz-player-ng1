(function() {
    'use strict';

    angular
        .module('quartz.components')
        .directive('qtLoader',Loader);

    /* @ngInject */
    function Loader ($rootScope) {
        var directive = {
            bindToController: true,
            controller: LoaderController,
            controllerAs: 'vm',
            template: '<div flex class="loader" ng-show="vm.status.active" layout="column" layout-fill layout-align="center center"><div class="loader-inner"><md-progress-circular md-mode="indeterminate"></md-progress-circular></div><h3 class="md-headline">{{vm.appName}}</h3></div>',
            link: link,
            restrict: 'E',
            replace: true,
            scope: {
            }
        };
        return directive;

        function link($scope) {
            var loadingListener = $rootScope.$on('$viewContentLoading', function() {
                $scope.vm.setLoaderActive(true);
            });

            var loadedListener = $rootScope.$on('$viewContentLoaded', function() {
                $scope.vm.setLoaderActive(false);
            });

            $scope.$on('$destroy', removeListeners);

            function removeListeners() {
                loadingListener();
                loadedListener();
            }
        }
    }

    /* @ngInject */
    function LoaderController ($rootScope, qtLoaderService, qtSettings) {
        var vm = this;
        vm.appName         = qtSettings.name;
        vm.status          = qtLoaderService.status;
        vm.setLoaderActive = qtLoaderService.setLoaderActive;
    }
})();