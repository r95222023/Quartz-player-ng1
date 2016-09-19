(function() {
    'use strict';

    angular
        .module('app.plugins.ngdisqus')
        .config(/* @ngInject */ function($disqusProvider, $locationProvider){
            $disqusProvider.setShortname('quartzseed');
            //$locationProvider.hashPrefix('!');
            //already did in config.route
        })
})();
