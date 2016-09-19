(function () {
    'use strict';

    angular
        .module('app.plugins.analytics');
        // .directive('allpayCheckout', allpayCheckout);

    ////

    /* @ngInject */
    function allpayCheckout($mdMedia, $firebase, $sce, $timeout, $q, snippets, $mdDialog, sitesService) {
        return {
            restrict: 'E',
            scope: {
                buildData:'=',
                direct: '@'
            },
            transclude: true,
            templateUrl: function (element, attrs) {
                if (typeof attrs.templateUrl == 'undefined') {
                    return 'app/plugins/allpay/allpayCheckout.tmpl.html';
                } else {
                    return attrs.templateUrl;
                }
            },
            link: function (scope, element, attrs) {
                //
            }

        };

    }

})();
