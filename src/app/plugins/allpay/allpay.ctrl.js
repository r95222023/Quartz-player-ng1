(function () {
    'use strict';

    angular
        .module('app.plugins.allpay')
        .provider('AllpayCtrl', AllpayCtrl);

    ////
    /* @ngInject */
    function AllpayCtrl($ngCart, $auth, $firebase, $mdMedia, $timeout, snippets) {
        var vm = this;
        var siteName = _core.util.site.siteName;
        var getCurrentTime;
        var defaultAllpayParams = {
            MerchantID: '2000132',
            PaymentType: "aio",
            ReturnURL: "http://http://24.14.103.233/allpayReceive",
            PaymentInfoURL: "http://24.14.103.233/allpayPaymentInfo",
            ChoosePayment: "ALL",
            NeedExtraPaidInfo: "Y",
            TradeDesc: "required, please set a value."
        };

        vm.order = {
            vendor: {},
            buyer: {},
            shipment: {},
            payment: {}
        };

        function updateOrderData() {
            vm.order.items = {};
            $ngCart.$cart.items.forEach(function (item) {
                vm.order.items[item.getId()] = item.toObject();
            });
            vm.order.vendor.id = siteName;
            vm.order.buyer.id = $auth.currentUser.uid;

            return new Promise(function (resolve, reject) {
                $firebase.ref('site-config-payment?provider=allpay').child('private').once('value', function (snap) {
                    var publicPaymentConf = snap.val();
                    var pricePromise;
                    if (publicPaymentConf && publicPaymentConf.calcPrice) {
                        eval('pricePromise=new Promise(function(resolve,reject){' + publicPaymentConf.calcPrice + '})')
                    } else {
                        var amount = 0;
                        angular.forEach(vm.order.items, function (item) {
                            amount += (item.quantity * item.price);
                        });
                        pricePromise = Promise.resolve(amount);
                    }
                });
                pricePromise.then(function (totalAmount) {
                    vm.order.payment = {
                        provider: 'allpay',
                        totalAmount: totalAmount,
                        allpay: buildAllpayParams()
                    };
                    resolve();
                });
            });
        }

        _core.syncTime().then(function (getTime) {
            getCurrentTime = getTime;
            updateOrderData().then(function () {
                $timeout(angular.noop, 0)
            });
        });

        function buildAllpayParams(opt) {
            var items = vm.order.items || {},
                to2dig = snippets.to2dig,
                _opt = opt || {},
                now = (new Date(getCurrentTime())),
                month = to2dig(now.getUTCMonth() + 1),
                day = to2dig(now.getUTCDate()),
                hour = to2dig(now.getUTCHours()),
                min = to2dig(now.getUTCMinutes()),
                sec = to2dig(now.getUTCSeconds()),
                date = now.getUTCFullYear() + '/' + month + '/' + day + ' ' + hour + ':' + min + ':' + sec;

            //for description
            var itemName = '';
            for (var key in items) {
                itemName = itemName + (_opt.namePrefix || '') + items[key].name + (_opt.namePostfix || ' ') + (_opt.pricePrefix || '$') + items[key].price + (_opt.pricePostfix || '') + (_opt.quantityPrefix || '*') + items[key].quantity + (_opt.quantityPostfix || '') + '#'
            }
            // itemName = itemName.slice(0, -1);

            var paymentParams = Object.assign({}, defaultAllpayParams, _opt.allpayParams, {
                ReturnURL: this.defaultConfig.ReturnURL + '?sitename=' + siteName + '&uid=' + vm.order.buyer.uid,
                PaymentInfoURL: this.defaultConfig.PaymentInfoURL + '?sitename=' + siteName + '&uid=' + vm.order.buyer.uid,
                MerchantTradeDate: date,
                TotalAmount: vm.order.payment.totalAmount || 0
            });

            paymentParams.MerchantTradeNo = order.id;
            paymentParams.ItemName = paymentParams.ItemName || itemName || 'required, please set a value';
            return paymentParams;
        }


        function getCheckMacValue() {
            return new Promise(function (resolve, reject) {
                var taskId = firebase.database().ref().push().key;
                vm.order.id = vm.order.id||taskId;

                updateOrderData().then(function () {
                    $firebase.request(
                        {
                            paths: ['queue-task?id=' + taskId],
                            data: buildRequest(vm.order)
                        },
                        ['queue-task?id=' + taskId + '/payment/allpay/CheckMacValue'])
                        .then(function (res) {
                            vm.order.payment.allpay['CheckMacValue'] = res[0];
                            vm.order.taskId = taskId;

                            console.log('order mac: ' + res[0]);
                            $timeout(angular.noop, 0);
                            resolve(vm.order);
                        }, function (error) {
                            reject(error);
                            console.log(error);
                        });
                });
            });
        }

        function buildRequest(orderData) {
            var req = {payment: {allpay: {}}};
            angular.extend(req, orderData);

            if ($mdMedia('xs')) {
                req.payment.allpay.DeviceSource = 'M'
            } else {
                req.payment.allpay.DeviceSource = 'P'
            }
            req.id = orderData.id || orderData.payment.allpay.MerchantTradeNo;
            req.siteName = sitesService.siteName;
            req.payment.provider = 'allpay';
            req['_state'] = 'allpay_gen_check_mac';
            return snippets.rectifyUpdateData(req);
        }

        vm.showDialog = function ($event) {
            var parentEl = angular.element(document.body);
            $mdDialog.show({
                parent: parentEl,
                targetEvent: $event,
                templateUrl: 'app/plugins/allpay/allpayDialog.tmpl.html',
                controller: DialogController
            });

            /* @ngInject */
            function DialogController($scope, $mdDialog, ngCart) {
                var allpayFormAction = vm.stage ? 'https://payment-stage.allpay.com.tw/Cashier/AioCheckOut' : 'https://payment.allpay.com.tw/Cashier/AioCheckOut';

                $scope.allpayFormAction = $sce.trustAsResourceUrl(allpayFormAction);

                getCheckMacValue().then(function (order) {
                    $scope.data = order;
                });

                $scope.submit = function () {
                    $scope.closeDialog();
                    var e = document.getElementsByName('allpay-checkout');
                    e[0].submit();
                    //clear cart
                    ngCart.empty();
                };
                $scope.closeDialog = function () {
                    // remove data
                    // $firebase.queryRef('queue-task?id=' + data['_id']).child('status').set('canceled');
                    $mdDialog.hide();
                }
            }
        }
    }

})();
