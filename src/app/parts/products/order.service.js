(function () {
    'use strict';

    angular
        .module('app.parts.products')
        .factory('orderService', OrderService);

    /* @ngInject */
    function OrderService($rootScope, $q, $firebaseStorage, ngCart, $allpay, $stripe, sitesService) {
        var paymentService = {allpay: $allpay, stripe: $stripe};

        function buildOrder(provider, opt) {
            var def = $q.defer();
            _core.syncTime().then(function(getSyncedTime){
                $firebaseStorage.getWithCache('site-config-payment?provider=' + provider + '&privacy=public').then(function (val) {
                    var _opt = (!val) ? angular.extend({}, {paymentParams: val}, opt || {}) : opt || {},
                        now = _opt.timeStamp || (new Date(getSyncedTime()));
                    _opt.id = _opt.id || (sitesService.siteName + now.getTime());
                    _opt.timeStamp = _opt.timeStamp || now;
                    var _order = {
                        id: _opt.id,
                        siteName: sitesService.siteName,
                        clientInfo: {
                            uid: $rootScope.user.uid
                        }
                    };

                    _order.cart = ngCart.toObject();
                    _order.totalAmount = ngCart.totalCost();
                    var payment = {};
                    payment[provider] = paymentService[provider].getPaymentInfo(_order, _opt);
                    angular.extend(_order, {
                        payment: payment
                    });
                    def.resolve(_order);
                });
            });

            return def.promise;
        }

        return {
            buildOrder: buildOrder
        }
    }
})();
