(function () {
    'use strict';

    angular
        .module('app.parts.products')
        .controller('ShoppingCartController', ShoppingCartController);

    /* @ngInject */
    function ShoppingCartController(ngCart, orderService) {
        var vm = this;
        angular.extend(vm, ngCart);
        // $scope.cart = ngCart;
        vm.isCartEmpty = function () {
            return ngCart.getTotalItems() !== 0
        };
        // orderService.buildOrder('allpay');
        // orderService.buildOrder('stripe');

        vm.buildStripeOrder = function () {
            return orderService.buildOrder('stripe');
        };
        vm.buildAllpayOrder = function () {
            return orderService.buildOrder('allpay');
        };
    }
})();
