(function () {
    'use strict';

    angular
        .module('quartz')
        .run(runFunction);

    /* @ngInject */
    function runFunction($rootScope, $window, config) {
        //// add a class to the body if we are on windows
        if ($window.navigator.platform.indexOf('Win') !== -1) {
            $rootScope.bodyClasses = ['os-windows'];
        }

        $rootScope.debug = config.debug;
        if (config.debug) console.log('debug mode');
        
        //idle: moved to Idle service



        //// detect if user is logged in: moved to authentication service
    }
})();
