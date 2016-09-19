(function () {
    'use strict';

    angular
        .module('app.parts.articles')
        .controller('ArticleCateManagerController', ArticleCateManagerController);

    /* @ngInject */
    function ArticleCateManagerController(articleProduct) {
        var vm = this;

        articleProduct.managerCtr(vm, 'article');
        articleProduct.cateCtr(vm, 'article');
    }
})();
