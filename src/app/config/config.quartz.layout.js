window.config=window.config||{};
window.config.quartzLayout=function() {
    'use strict';

    angular
        .module('app')
        .config(config);

    /* @ngInject */
    function config(qtLayoutProvider) {
        qtLayoutProvider.setDefaultOption('toolbarSize', 'default');

        qtLayoutProvider.setDefaultOption('toolbarShrink', false);

        qtLayoutProvider.setDefaultOption('toolbarClass', '');

        qtLayoutProvider.setDefaultOption('contentClass', '');

        qtLayoutProvider.setDefaultOption('sideMenuSize', 'full');

        qtLayoutProvider.setDefaultOption('showToolbar', true);

        qtLayoutProvider.setDefaultOption('footer', true);
    }
};
//window.config.quartzLayout();
