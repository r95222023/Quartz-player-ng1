(function() {
    'use strict';

    angular
        .module('quartz.components')
        .controller('MenuController', MenuController);

    /* @ngInject */
    function MenuController(sitesService, qtLayout) {
        var vm = this;
        vm.layout = qtLayout.layout;
        vm.siteSettings = sitesService;
        vm.toggleIconMenu = toggleIconMenu;

        ////////////
        function toggleIconMenu() {
            var menu = vm.layout.sideMenuSize === 'icon' ? 'full' : 'icon';
            qtLayout.setOption('sideMenuSize', menu);
        }
    }
})();
