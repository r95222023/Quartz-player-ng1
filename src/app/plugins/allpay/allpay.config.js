(function () {
    'use strict';

    angular
        .module('app.plugins.allpay')
        .config(/* @ngInject */ function ($allpayProvider) {
            $allpayProvider.isStage(true);
            $allpayProvider.setParams({
                MerchantID: '2000132',
                PaymentType: "aio",
                ReturnURL: "http://http://24.14.103.233/allpayReceive",
                PaymentInfoURL: "http://24.14.103.233/allpayPaymentInfo",
                ChoosePayment: "ALL",
                NeedExtraPaidInfo: "Y",
                TradeDesc: "required, please set a value."
            });
        })
})();
