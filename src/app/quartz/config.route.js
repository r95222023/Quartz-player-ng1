(function () {
    'use strict';

    angular
        .module('quartz')
        .config(routeConfig);

    /* @ngInject */
    function routeConfig($stateProvider) {
        $stateProvider
            .state('quartz-no-scroll', {
                abstract: true,
                templateUrl: 'app/quartz/layouts/default/default-no-scroll.tmpl.html',
                controller: 'DefaultLayoutController',
                controllerAs: 'layoutController'
            })
            .state('quartz.admin-default', {
                abstract: true,
                views: {
                    sidebarLeft: {
                        templateUrl: 'app/quartz/components/menu/menu.tmpl.html',
                        controller: 'MenuController',
                        controllerAs: 'vm'
                    },
                    sidebarRight: {
                        templateUrl: 'app/quartz/components/notifications-panel/notifications-panel.tmpl.html',
                        controller: 'NotificationsPanelController',
                        controllerAs: 'vm'
                    },
                    toolbar: {
                        templateUrl: 'app/quartz/components/toolbars/toolbar.tmpl.html',
                        controller: 'DefaultToolbarController',
                        controllerAs: 'vm'
                    },
                    content: {
                        template: '<div id="admin-panel-content-view" class="{{layout.innerContentClass}}" flex ui-view></div>'
                    },
                    belowContent: {
                        template: '<div ui-view="belowContent"></div>'
                    }
                }
            })
            .state('quartz.client-default', {
                abstract: true,
                views: {
                    sidebarLeft: {
                        templateUrl: 'app/quartz/components/menu/menu.tmpl.html',
                        controller: 'MenuController',
                        controllerAs: 'vm'
                    },
                    sidebarRight: {
                        templateUrl: 'app/quartz/components/notifications-panel/notifications-panel.tmpl.html',
                        controller: 'NotificationsPanelController',
                        controllerAs: 'vm'
                    },
                    toolbar: {
                        templateUrl: 'app/quartz/components/toolbars/toolbar.tmpl.html',
                        controller: 'DefaultToolbarController',
                        controllerAs: 'vm'
                    },
                    content: {
                        template: '<div id="admin-panel-content-view" class="{{layout.innerContentClass}}" flex ui-view></div>'
                    },
                    belowContent: {
                        template: '<div ui-view="belowContent"></div>'
                    }
                }
            })
            .state('quartz.admin-default-no-scroll', {
                abstract: true,
                views: {
                    sidebarLeft: {
                        templateUrl: 'app/quartz/components/menu/menu.tmpl.html',
                        controller: 'MenuController',
                        controllerAs: 'vm'
                    },
                    sidebarRight: {
                        templateUrl: 'app/quartz/components/notifications-panel/notifications-panel.tmpl.html',
                        controller: 'NotificationsPanelController',
                        controllerAs: 'vm'
                    },
                    toolbar: {
                        templateUrl: 'app/quartz/components/toolbars/toolbar.tmpl.html',
                        controller: 'DefaultToolbarController',
                        controllerAs: 'vm'
                    },
                    content: {
                        // template: '<div flex ui-view layout="column" class="{{layout.innerContentClass}} overflow-hidden quartz-no-scroll"></div>'
                        template: '<div flex ui-view class="{{layout.innerContentClass}} overflow-hidden quartz-no-scroll layout-fill" style="position:absolute;"></div>'
                    }
                }
            });
    }
})();
