(function() {
    'use strict';

    angular
        .module('quartz.components')
        .directive('qtMenuItem', qtMenuItemDirective);

    /* @ngInject */
    function qtMenuItemDirective() {
        // Usage:
        //
        // Creates:
        //
        var directive = {
            restrict: 'E',
            require: '^qtMenu',
            scope: {
                item: '='
            },
            // replace: true,
            template: '<div ng-include="::qtMenuItem.item.template"></div>',
            controller: qtMenuItemController,
            controllerAs: 'qtMenuItem',
            bindToController: true
        };
        return directive;
    }

    /* @ngInject */
    function qtMenuItemController($scope, $mdSidenav, $state,$transitions, $filter, qtBreadcrumbsService, $timeout) {
        var qtMenuItem = this;
        // load a template for this directive based on the type ( link | dropdown )
        qtMenuItem.item.template = 'app/quartz/components/menu/menu-item-' + qtMenuItem.item.type + '.tmpl.html';

        switch(qtMenuItem.item.type) {
            case 'dropdown':
                // if we have kids reorder them by priority
                qtMenuItem.item.children = $filter('orderBy')(qtMenuItem.item.children, 'priority');
                qtMenuItem.toggleDropdownMenu = toggleDropdownMenu;
                // add a check for open event
                $scope.$on('toggleDropdownMenu', function(event, item, open) {
                    // if this is the item we are looking for
                    if(qtMenuItem.item === item) {
                        qtMenuItem.item.open = open;
                    }
                    else {
                        qtMenuItem.item.open = false;
                    }
                });
                // this event is emitted up the tree to open parent menus
                $scope.$on('openParents', function() {
                    // openParents event so open the parent item
                    qtMenuItem.item.open = true;
                    // also add this to the breadcrumbs
                    qtBreadcrumbsService.addCrumb(qtMenuItem.item);
                });
                break;
            case 'link':
                qtMenuItem.openLink = openLink;

                // on init check if this is current menu
                checkItemActive($state.current.name, $state.params);

                $transitions.onSuccess({ to: '**' }, function(trans) {
                    checkItemActive(trans.to().name, trans.params('to'));
                });
                break;
        }

        function checkItemActive() {
            // first check if the state is the same
            qtMenuItem.item.active = $state.includes(qtMenuItem.item.state, qtMenuItem.item.params);
            // if we are now the active item reset the breadcrumbs and open all parent dropdown items
            if(qtMenuItem.item.active) {
                qtBreadcrumbsService.reset();
                qtBreadcrumbsService.addCrumb(qtMenuItem.item);
                $scope.$emit('openParents');
            }
        }

        function toggleDropdownMenu() {
            $scope.$parent.$parent.$broadcast('toggleDropdownMenu', qtMenuItem.item, !qtMenuItem.item.open);
        }

        function openLink() {
            $timeout(function () {
                $mdSidenav('left').close();
                var params = angular.isUndefined(qtMenuItem.item.params) ? {} : qtMenuItem.item.params;
                $state.go(qtMenuItem.item.state, params);
                qtMenuItem.item.active = true;
            },250);
        }
    }
})();
