window.config=window.config||{};
window.config.quartzThemes=function() {
    'use strict';

    angular
        .module('app')
        .config(themesConfig);

    /* @ngInject */
    function themesConfig ($mdThemingProvider, qtThemingProvider, qtSkinsProvider) {
        /**
         *  PALETTES
         */
        $mdThemingProvider.definePalette('white', {
            '50': 'ffffff',
            '100': 'ffffff',
            '200': 'ffffff',
            '300': 'ffffff',
            '400': 'ffffff',
            '500': 'ffffff',
            '600': 'ffffff',
            '700': 'ffffff',
            '800': 'ffffff',
            '900': 'ffffff',
            'A100': 'ffffff',
            'A200': 'ffffff',
            'A400': 'ffffff',
            'A700': 'ffffff',
            'contrastDefaultColor': 'dark'
        });

        $mdThemingProvider.definePalette('black', {
            '50': 'e1e1e1',
            '100': 'b6b6b6',
            '200': '8c8c8c',
            '300': '646464',
            '400': '3a3a3a',
            '500': 'e1e1e1',
            '600': 'e1e1e1',
            '700': '232323',
            '800': '1a1a1a',
            '900': '121212',
            'A100': '3a3a3a',
            'A200': 'ffffff',
            'A400': 'ffffff',
            'A700': 'ffffff',
            'contrastDefaultColor': 'light'
        });

        var qtCyanMap = $mdThemingProvider.extendPalette('cyan', {
            'contrastDefaultColor': 'light',
            'contrastLightColors': '500 700 800 900',
            'contrastStrongLightColors': '500 700 800 900'
        });

        // Register the new color palette map with the name qtCyan
        $mdThemingProvider.definePalette('qtCyan', qtCyanMap);

        /**
         *  SKINS
         */

            // CYAN CLOUD SKIN
        qtThemingProvider.theme('cyan')
            .primaryPalette('qtCyan')
            .accentPalette('amber')
            .warnPalette('deep-orange');

        qtThemingProvider.theme('white-cyan')
            .primaryPalette('white')
            .accentPalette('qtCyan', {
                'default': '500'
            })
            .warnPalette('deep-orange');

        qtSkinsProvider.skin('cyan-cloud', 'Cyan Cloud')
            .sidebarTheme('cyan')
            .toolbarTheme('white-cyan')
            .logoTheme('cyan')
            .contentTheme('cyan');

        // RED DWARF SKIN
        qtThemingProvider.theme('red')
            .primaryPalette('red')
            .accentPalette('amber')
            .warnPalette('purple');

        qtThemingProvider.theme('white-red')
            .primaryPalette('white')
            .accentPalette('red', {
                'default': '500'
            })
            .warnPalette('purple');

        qtSkinsProvider.skin('red-dwarf', 'Red Dwarf')
            .sidebarTheme('red')
            .toolbarTheme('white-red')
            .logoTheme('red')
            .contentTheme('red');

        // PLUMB PURPLE SKIN
        qtThemingProvider.theme('purple')
            .primaryPalette('purple')
            .accentPalette('deep-orange')
            .warnPalette('amber');

        qtThemingProvider.theme('white-purple')
            .primaryPalette('white')
            .accentPalette('purple', {
                'default': '400'
            })
            .warnPalette('deep-orange');

        qtSkinsProvider.skin('plumb-purple', 'Plumb Purple')
            .sidebarTheme('purple')
            .toolbarTheme('white-purple')
            .logoTheme('purple')
            .contentTheme('purple');

        // DARK KNIGHT SKIN
        qtThemingProvider.theme('dark')
            .primaryPalette('black', {
                'default': '300',
                'hue-1': '400'
            })
            .accentPalette('amber')
            .warnPalette('deep-orange')
            .backgroundPalette('black')
            .dark();

        $mdThemingProvider.theme('docs-dark', 'default')
            .primaryPalette('yellow')
            .dark();


        qtSkinsProvider.skin('dark-knight', 'Dark Knight')
            .sidebarTheme('dark')
            .toolbarTheme('dark')
            .logoTheme('dark')
            .contentTheme('dark');

        // BATTLESHIP GREY SKIN
        qtThemingProvider.theme('blue-grey')
            .primaryPalette('blue-grey')
            .accentPalette('amber')
            .warnPalette('orange');

        qtThemingProvider.theme('white-blue-grey')
            .primaryPalette('white')
            .accentPalette('blue-grey', {
                'default': '400'
            })
            .warnPalette('orange');

        qtSkinsProvider.skin('battleship-grey', 'Battleship Grey')
            .sidebarTheme('blue-grey')
            .toolbarTheme('white-blue-grey')
            .logoTheme('blue-grey')
            .contentTheme('blue-grey');

        // ZESTY ORANGE SKIN
        qtThemingProvider.theme('orange')
            .primaryPalette('orange' , {
                'default': '800'
            })
            .accentPalette('lime')
            .warnPalette('amber');

        qtThemingProvider.theme('white-orange')
            .primaryPalette('white')
            .accentPalette('orange', {
                'default': '500'
            })
            .warnPalette('lime');

        qtSkinsProvider.skin('zesty-orange', 'Zesty Orange')
            .sidebarTheme('orange')
            .toolbarTheme('white-orange')
            .logoTheme('orange')
            .contentTheme('orange');


        // INDIGO ISLAND SKIN
        qtThemingProvider.theme('indigo')
            .primaryPalette('indigo' , {
                'default': '600'
            })
            .accentPalette('red')
            .warnPalette('lime');

        qtSkinsProvider.skin('indigo-island', 'Indigo Island')
            .sidebarTheme('indigo')
            .toolbarTheme('white-cyan')
            .logoTheme('indigo')
            .contentTheme('indigo');

        // BLUE SKY SKIN
        qtThemingProvider.theme('blue')
            .primaryPalette('blue',{
                "default":'700'
            })
            .accentPalette('red')
            .warnPalette('lime');

        qtSkinsProvider.skin('blue-sky', 'Blue Sky')
            .sidebarTheme('blue')
            .toolbarTheme('white-cyan')
            .logoTheme('blue')
            .contentTheme('indigo');

        // KERMIT GREEN SKIN
        qtThemingProvider.theme('light-green')
            .primaryPalette('light-green' , {
                'default': '400'
            })
            .accentPalette('amber')
            .warnPalette('deep-orange');

        qtThemingProvider.theme('white-light-green')
            .primaryPalette('white')
            .accentPalette('light-green', {
                'default': '400'
            })
            .warnPalette('deep-orange');

        qtSkinsProvider.skin('kermit-green', 'Kermit Green')
            .sidebarTheme('light-green')
            .toolbarTheme('white-light-green')
            .logoTheme('light-green')
            .contentTheme('light-green');


        /**
         *  FOR DEMO PURPOSES ALLOW SKIN TO BE SAVED IN A COOKIE
         *  This overrides any skin set in a call to qtSkinsProvider.setSkin if there is a cookie
         *  REMOVE LINE BELOW FOR PRODUCTION SITE
         */
        qtSkinsProvider.useSkinCookie(true);

        /**
         *  SET DEFAULT SKIN
         */
        qtSkinsProvider.setSkin('blue-sky');
    }
};
//window.config.quartzThemes();
