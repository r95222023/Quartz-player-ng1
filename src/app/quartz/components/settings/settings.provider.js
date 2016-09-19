(function () {
    'use strict';

    angular
        .module('quartz.components')
        .provider('qtSettings', settingsProvider);

    /* @ngInject */
    function settingsProvider() {
        // Provider
        var settings = {
            languages: [],
            name: '',
            logo: '',
            copyright: '',
            version: '',
            serverFb: '',
            custom: {}
        };

        this.addLanguage = addLanguage;
        this.setLogo = setLogo;
        this.setName = setName;
        this.setCopyright = setCopyright;
        this.setVersion = setVersion;
        this.setCustom = setCustom;
        this.setServerFb = setServerFb;

        function addLanguage(newLanguage) {
            settings.languages.push(newLanguage);
        }

        function setLogo(logo) {
            settings.logo = logo;
        }

        function setName(name) {
            settings.name = name;
        }

        function setCopyright(copy) {
            settings.copyright = copy;
        }

        function setVersion(version) {
            settings.version = version;
        }

        function setCustom(settingsGroups) {
            settings.custom = settingsGroups
        }

        function setServerFb(fbUrl) {
            settings.serverFb = fbUrl;
        }

        // Service
        this.$get = /* @ngInject */ function () {

            return {
                languages: settings.languages,
                name: settings.name,
                copyright: settings.copyright,
                logo: settings.logo,
                version: settings.version,
                defaultSkin: settings.defaultSkin,
                custom: settings.custom,
                setServerFb: setServerFb
            };
        };
    }
})();

