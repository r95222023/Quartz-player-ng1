(function() {
    'use strict';

    angular
        .module('quartz', [
            'ngMaterial',
            'quartz.layouts', 'quartz.components', 'quartz.themes', 'quartz.directives',
            // 'quartz.profiler',
            // uncomment above to activate the speed profiler
            'ui.router'
        ]);
})();
