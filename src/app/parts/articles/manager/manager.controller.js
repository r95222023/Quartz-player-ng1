(function () {
    'use strict';

    angular
        .module('app.parts.articles')
        .controller('ArticleManagerController', ArticleManagerController);

    /* @ngInject */
    function ArticleManagerController(articleProduct, $stateParams) {
        var vm = this;

        vm.filters = [
            ['Article Id', 'id'],
            ['Name', 'name'],
            ['Category', 'category'],
            ['Date', 'createdTime']
        ];

        articleProduct.cateCtr(vm, 'article');
        articleProduct.managerCtr(vm, 'article');
        //initiate
        vm.paginator.onReorder($stateParams.orderBy || 'id');
    }
})();
