(function () {
    'use strict';

    angular
        .module('quartz.components')
        .controller('NotificationsPanelController', NotificationsPanelController);

    /* @ngInject */
    function NotificationsPanelController($scope, qtSettings, qtNotificationsService, $firebase, $http, $mdSidenav, $state) {
        var vm = this;
        // sets the current active tab
        vm.close = close;
        vm.removeNotification = qtNotificationsService.removeNotification;
        vm.currentTab = 0;
        vm.notificationGroups = {
            "Twitter": [{
                title: 'Mention from quartz',
                icon: 'fa fa-twitter',
                iconColor: '#55acee',
                date: moment().startOf('hour')
            }, {
                title: 'quartz',
                icon: 'fa fa-twitter',
                iconColor: '#55acee',
                date: moment().startOf('hour')
            }, {
                title: 'quartz',
                icon: 'fa fa-twitter',
                iconColor: '#55acee',
                date: moment().startOf('hour')
            }, {
                title: 'Followed by quartz',
                icon: 'fa fa-twitter',
                iconColor: '#55acee',
                date: moment().startOf('hour')
            }],
            "Server": [{
                title: 'Server Down',
                icon: 'zmdi zmdi-alert-circle',
                iconColor: 'rgb(244, 67, 54)',
                date: moment().startOf('hour')
            }, {
                title: 'Slow Response Time',
                icon: 'zmdi zmdi-alert-triangle',
                iconColor: 'rgb(255, 152, 0)',
                date: moment().startOf('hour')
            }, {
                title: 'Server Down',
                icon: 'zmdi zmdi-alert-circle',
                iconColor: 'rgb(244, 67, 54)',
                date: moment().startOf('hour')
            }],
            "Sales": [{
                title: 'Quartz Admin $21',
                icon: 'zmdi zmdi-shopping-cart',
                iconColor: 'rgb(76, 175, 80)',
                date: moment().startOf('hour')
            }, {
                title: 'Lambda WordPress $60',
                icon: 'zmdi zmdi-shopping-cart',
                iconColor: 'rgb(76, 175, 80)',
                date: moment().startOf('hour')
            }, {
                title: 'Quartz Admin $21',
                icon: 'zmdi zmdi-shopping-cart',
                iconColor: 'rgb(76, 175, 80)',
                date: moment().startOf('hour')
            }, {
                title: 'Quartz Admin $21',
                icon: 'zmdi zmdi-shopping-cart',
                iconColor: 'rgb(76, 175, 80)',
                date: moment().startOf('hour')
            }, {
                title: 'Lambda WordPress $60',
                icon: 'zmdi zmdi-shopping-cart',
                iconColor: 'rgb(76, 175, 80)',
                date: moment().startOf('hour')
            }, {
                title: 'Quartz Admin $21',
                icon: 'zmdi zmdi-shopping-cart',
                iconColor: 'rgb(76, 175, 80)',
                date: moment().startOf('hour')
            }]
        };

        vm.openMail = openMail;

        vm.settingsGroups =  qtSettings.custom;


        vm.statisticsGroups = [{
            name: 'ADMIN.NOTIFICATIONS.USER_STATS',
            stats: [{
                title: 'ADMIN.NOTIFICATIONS.STORAGE_SPACE',
                mdClass: 'md-primary',
                value: 60
            }, {
                title: 'ADMIN.NOTIFICATIONS.BANDWIDTH_USAGAE',
                mdClass: 'md-accent',
                value: 10
            }, {
                title: 'ADMIN.NOTIFICATIONS.MEMORY_USAGAE',
                mdClass: 'md-warn',
                value: 100
            }]
        }, {
            name: 'ADMIN.NOTIFICATIONS.SERVER_STATS',
            stats: [{
                title: 'ADMIN.NOTIFICATIONS.STORAGE_SPACE',
                mdClass: 'md-primary',
                value: 60
            }, {
                title: 'ADMIN.NOTIFICATIONS.BANDWIDTH_USAGAE',
                mdClass: 'md-accent',
                value: 10
            }, {
                title: 'ADMIN.NOTIFICATIONS.MEMORY_USAGAE',
                mdClass: 'md-warn',
                value: 100
            }]
        }];

        ////////////////

        // add an event to switch tabs (used when user clicks a menu item before sidebar opens)
        $scope.$on('qtSwitchNotificationTab', function ($event, tab) {
            vm.currentTab = tab;
        });

        $scope.$watch(qtNotificationsService.getNotification, function () {
            vm.notificationGroups = qtNotificationsService.getNotification();
        });

        function openMail() {
            $state.go('private.admin.toolbar.inbox');
            vm.close();
        }

        function close() {
            $mdSidenav('notifications').close();
        }
    }
})();
