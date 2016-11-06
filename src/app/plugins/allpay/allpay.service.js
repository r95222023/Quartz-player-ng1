(function () {
    'use strict';

    angular
        .module('app.plugins.allpay')
        .provider('$allpay', allpayProvider);

    ////

    function allpayProvider() {
        var isStage = true,
            defaultConfig = {};

        this.isStage = function (value) {
            isStage = !!value;
        };
        this.setParams = function (value) {
            defaultConfig = value;
        };

        function Allpay(defaultConfig, sitesService) {
            this.defaultConfig = defaultConfig;
            this.getSite = function(){
                return sitesService.siteName;
            }
        }

        Allpay.prototype.getPaymentInfo = function (order, opt) {
            var items= order.items||{},
                _opt = opt || {},
                now = _opt.timeStamp? (new Date(_opt.timeStamp)):(new Date()),
                month = to2dig(now.getMonth()+1),
                day = to2dig(now.getDate()),
                hour = to2dig(now.getHours()),
                min = to2dig(now.getMinutes()),
                sec = to2dig(now.getSeconds()),
                date = now.getFullYear() + '/' + month + '/' + day + ' ' + hour + ':' + min + ':' + sec;

            function to2dig(num) {
                return num < 10 ? ('0' + num) : num;
            }

            //for description
            var itemName = '';
            for (var key in items) {
                itemName = itemName + (_opt.namePrefix || '') + items[key].name + (_opt.namePostfix || ' ') + (_opt.pricePrefix || '$') + items[key].price + (_opt.pricePostfix || '') + (_opt.quantityPrefix || '*') + items[key].quantity + (_opt.quantityPostfix || '') + '#'
            }
            itemName = itemName.slice(0, -1);

            var form = angular.extend({}, this.defaultConfig, _opt.paymentParams||{}, {
                ReturnURL:this.defaultConfig.ReturnURL+'?sitename='+this.getSite()+'&uid='+order.clientInfo.uid,
                PaymentInfoURL:this.defaultConfig.PaymentInfoURL+'?sitename='+this.getSite()+'&uid='+order.clientInfo.uid,
                MerchantTradeDate: date,
                TotalAmount: _order.totalAmount||0
            });

            form.MerchantTradeNo = order.id;
            form.ItemName = form.ItemName || itemName || 'required, please set a value';
            return form;
        };


        this.$get = /* @ngInject */ function (sitesService) {
            return new Allpay(defaultConfig, sitesService)
        }
    }

})();
