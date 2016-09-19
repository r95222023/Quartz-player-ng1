(function () {
    'use strict';

    angular
        .module('app.parts.products')
        .controller('AllpayCheckoutCtrl', AllpayCheckoutCtrl);

    /* @ngInject */
    function AllpayCheckoutCtrl(orderService, sitesService, $scope, ngCart, $mdMedia, $firebase, $sce, $timeout, snippets, $mdDialog, customParams) {
        var vm = this, prevTotal;
        if (ngCart.getTotalItems() === 0) {
            alert('cart is empty');
            return;
        }
        vm.allpayFormAction = function () {
            var allpayFormAction = vm.stage ? 'https://payment-stage.allpay.com.tw/Cashier/AioCheckOut' : 'https://payment.allpay.com.tw/Cashier/AioCheckOut';

            return $sce.trustAsResourceUrl(allpayFormAction);
        };

        orderService.buildOrder('allpay').then(function (order) {
            vm.order = order;
        });
        function getCheckMacValue() {
            if (!vm.order || vm.order.totalAmount === prevTotal) return;
            var id = firebase.database().ref().push().key;
            $firebase.request({
                    paths: ['queue-task?id=' + id],
                    data: buildRequest(vm.order)
                },
                ['queue-task?id=' + id + '/payment/allpay/CheckMacValue'])
                .then(function (res) {
                    $timeout(function () {
                        vm.order.payment.allpay['CheckMacValue'] = res[0];
                        vm.order['_id'] = res.params['$qid'];
                    }, 0);
                    prevTotal = vm.order.totalAmount + 0;
                    console.log('order mac: ' + res[0]);
                }, function (error) {
                    console.log(error);
                });
        }

        vm.watchForm = function (form) {
            var debounced = snippets.debounce(function () {
                onFormReady(form);
            }, 1000);
            $scope.$watch(angular.bind(this, function () {
                return this.order;
            }), debounced, true)
        };

        function buildRequest(order) {
            var req = {payment: {allpay: {}}};
            angular.extend(req, order);

            if ($mdMedia('xs')) {
                req.payment.allpay.DeviceSource = 'M'
            } else {
                req.payment.allpay.DeviceSource = 'P'
            }
            req.id = order.id || order.payment.allpay.MerchantTradeNo;
            req.siteName = sitesService.siteName;
            req.payment.type = 'allpay';
            req['_state'] = 'allpay_gen_check_mac';
            return snippets.rectifyUpdateData(req);
        }

        function onFormReady(form) {
            //updateTotal();
            if (form && form.$valid && vm.order.acceptTOS) {
                getCheckMacValue();
            }
        }

        vm.submit = function () {
            // $firebase.ref('queue/tasks/' + vm.order['_id'] + '@serverFb').update(vm.order);

            $firebase.queryRef('queue-task?id=' + vm.order['_id']).update(angular.extend({
                "_state": 'allpay_reg_temp_order',
                "siteName": sitesService.siteName
            }, vm.order));
            var e = document.getElementsByName('allpay-checkout');
            e[0].submit();
            //clear cart
            ngCart.empty();
        };
    }
})();
