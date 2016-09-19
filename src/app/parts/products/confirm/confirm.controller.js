(function () {
    'use strict';

    angular
        .module('app.parts.products')
        .controller('OrderConfirmCtrl', OrderConfirmCtrl);

    /* @ngInject */
    function OrderConfirmCtrl(orderService,sitesService, $scope, ngCart, $mdMedia, $firebase, $sce, $timeout, snippets, $mdDialog, customParams) {
        var vm = this;
        console.log(customParams.get())
        vm.orderSummary=customParams.get().order;
        console.log(vm.orderSummary);
        // $firebase.ref('queue/specs/allpay_reg_temp_order').update({
        //     // in_progress_state:'generating_allpay_check_mac',
        //     start_state:'allpay_reg_temp_order'
        // })

    }
})();
