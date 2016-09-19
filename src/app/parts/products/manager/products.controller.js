(function () {
    'use strict';

    angular
        .module('app.parts.products')
        .controller('ProductManagerController', ProductManagerController);

    /* @ngInject */
    function ProductManagerController(articleProduct, $mdToast, $mdDialog, $firebase, $firebaseStorage, indexService, snippets, $stateParams, $state, $mdMedia) {
        var vm = this;

        vm.filters = [
            ['Product Id', 'itemId'],
            ['Name', 'itemName'],
            ['Category', 'category'],
            ['Quantity', 'quantity'],
            ['Price', 'price']
        ];

        articleProduct.cateCtr(vm, 'product');
        articleProduct.managerCtr(vm, 'product');
        //initiate
        vm.paginator.onReorder($stateParams.orderBy || 'itemId');
    }
})();
