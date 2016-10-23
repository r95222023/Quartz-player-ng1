(function() {
    'use strict';

    angular
        .module('app.configs')
        .config(idleConfig);

    /* @ngInject */
    function idleConfig (IdleProvider, KeepaliveProvider,TitleProvider) {
        // configure Idle settings
        TitleProvider.enabled(false);
        IdleProvider.idle(60); // in seconds
        IdleProvider.timeout(10*24*60*60); // in seconds
        //KeepaliveProvider.interval(2); // in seconds
    }
})();
