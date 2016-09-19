(function () {
    'use strict';

    angular
        .module('quartz.components')
        .factory('modelService', modelService);

    /* @ngInject */
    function modelService() {
        return {
            settingsGroups: {
                acc: {
                    name: 'ADMIN.NOTIFICATIONS.ACCOUNT_SETTINGS',
                    settings: {
                        devMode: {
                            title: 'ADMIN.NOTIFICATIONS.DEV_MODE',
                            icon: 'zmdi zmdi-code',
                            enabled: false
                        },
                        showLocation: {
                            title: 'ADMIN.NOTIFICATIONS.SHOW_LOCATION',
                            icon: 'zmdi zmdi-pin',
                            enabled: true
                        },
                        showAvatar: {
                            title: 'ADMIN.NOTIFICATIONS.SHOW_AVATAR',
                            icon: 'zmdi zmdi-face',
                            enabled: false
                        },
                        sendNoti: {
                            title: 'ADMIN.NOTIFICATIONS.SEND_NOTIFICATIONS',
                            icon: 'zmdi zmdi-notifications-active',
                            enabled: true
                        }
                    }
                },
                chat: {
                    name: 'ADMIN.NOTIFICATIONS.CHAT_SETTINGS',
                    settings: {
                        showUserName: {
                            title: 'ADMIN.NOTIFICATIONS.SHOW_USERNAME',
                            icon: 'zmdi zmdi-account',
                            enabled: true
                        },
                        showProfile: {
                            title: 'ADMIN.NOTIFICATIONS.SHOW_PROFILE',
                            icon: 'zmdi zmdi-account-box',
                            enabled: false
                        },
                        allowBackups: {
                            title: 'ADMIN.NOTIFICATIONS.ALLOW_BACKUPS',
                            icon: 'zmdi zmdi-cloud-upload',
                            enabled: true
                        }
                    }
                }
            }
        }
    }
})();
