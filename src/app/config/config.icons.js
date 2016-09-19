window.config=window.config||{};
window.config.icons=function() {
    'use strict';

    angular
        .module('app')
        .config(config);

    /* @ngInject */
    function config($mdIconProvider) {
        $mdIconProvider
            .defaultIconSet('../assets/images/icons/sets/core-icons.svg', 24);
    }
};
//window.config.chartjs();
