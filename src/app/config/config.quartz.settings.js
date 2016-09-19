window.config=window.config||{};
window.config.quartzSetting=function() {
    'use strict';

    angular
        .module('app')
        .config(settingConfig);

    /* @ngInject */
    function settingConfig(qtSettingsProvider, APP_LANGUAGES, config) {
        var now = new Date();
        // set app name & logo (used in loader, sidemenu, footer, login pages, etc)
        qtSettingsProvider.setName('Dashboard');
        qtSettingsProvider.setCopyright('&copy;' + now.getFullYear() + ' BYH');
        qtSettingsProvider.setLogo('assets/images/logo.png');
        // set current version of app (shown in footer)
        qtSettingsProvider.setVersion('0.11.0');
        qtSettingsProvider.setServerFb(config.serverFb);

        // set default custom settings
        qtSettingsProvider.setCustom({
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
        });

        // setup available languages in quartz
        for (var lang = APP_LANGUAGES.length - 1; lang >= 0; lang--) {
            qtSettingsProvider.addLanguage({
                name: APP_LANGUAGES[lang].name,
                key: APP_LANGUAGES[lang].key
            });
        }
    }
};
//window.config.quartzSetting();
