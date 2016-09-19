(function() {
    'use strict';

    angular
        .module('app.plugins.ngcart')
        .run(['$rootScope', 'ngCart','ngCartItem', 'store', function ($rootScope, ngCart, ngCartItem, store) {

            $rootScope.$on('ngCart:change', function(){
                ngCart.$save();
            });

            $rootScope.$on('site:change', function(ev, siteName){
                init(siteName);
            });
            init("main");

            function init(siteName){
                if (angular.isObject(store.get(siteName+'_cart'))) {
                    ngCart.$restore(store.get(siteName+'_cart'));
                } else {
                    ngCart.init();
                }
            }

        }])
        .value('version', '1.0.0');

})();
