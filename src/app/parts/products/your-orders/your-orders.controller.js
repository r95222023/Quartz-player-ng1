(function () {
    'use strict';

    angular
        .module('app.parts.products')
        .controller('YourOrdersController', YourOrdersController);

    /* @ngInject */
    function YourOrdersController($stateParams, authData, $firebase, $state) {
        var vm = this;
        vm.filters = [
            ['Order Id', 'id'],
            ['Client Id', 'clientInfo.uid'],
            ['Payment type', 'payment.type'],
            ['Status', 'status'],
            ['Total amount', 'totalAmount']
        ];
        vm.orderSelected = [];

        vm.getFiltered= function () {
            $state.go('quartz.admin-default.orderHistory', {orderBy:vm.orderBy, startAt:vm.startAt,endAt:vm.endAt, siteName: $stateParams.siteName})
        };


        vm.paginator = $firebase.pagination('user-orders?type=list&userId='+authData.uid, $stateParams);
        //initiate
        vm.paginator.onReorder($stateParams.orderBy||'id');

        vm.onPaginate = function (page, size) { //to prevent this being overwritten
            vm.paginator.get(page,size)
        };
        vm.onReorder = function (sort) {
            vm.paginator.onReorder(sort);
        };
    }
})();
