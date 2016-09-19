(function () {
    'use strict';

    angular
        .module('app.parts.articles')
        .controller('ArticleListController', ArticleListController);

    /* @ngInject */
    function ArticleListController(articleProduct) {
        var vm = this;

        articleProduct.cateCtr(vm, 'article');
        articleProduct.listCtr(vm, 'article');
    }
})();
