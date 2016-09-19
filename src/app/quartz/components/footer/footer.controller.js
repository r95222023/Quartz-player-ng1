(function() {
    'use strict';

    angular
        .module('quartz.components')
        .controller('FooterController', FooterController);

    /* @ngInject */
    function FooterController(qtSettings, qtLayout) {
        var vm = this;
        vm.name = qtSettings.name;
        vm.copyright = qtSettings.copyright;
        vm.layout = qtLayout.layout;
        vm.version = qtSettings.version;
    }
})();