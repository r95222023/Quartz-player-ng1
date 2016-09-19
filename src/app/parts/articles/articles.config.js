(function () {
    'use strict';

    angular
        .module('app.parts.articles')
        .config(articlesConfig);

    /* @ngInject */
    function articlesConfig($translatePartialLoaderProvider, $stateProvider, qtMenuProvider) {

        $translatePartialLoaderProvider.addPart('app/parts/articles');
        $stateProvider
            .state('quartz.admin-default.articleList', {
                url: '/:siteName/articles/list/?&cate&subCate&queryString&tag',
                params: {
                    siteName: '',
                    cate: '',
                    subCate: '',
                    queryString: '',
                    tag: ''
                },
                templateUrl: 'app/parts/articles/list/list.tmpl.html',
                controller: 'ArticleListController',
                controllerAs: 'vm'
            })
            .state('quartz.admin-default.articleManager', {
                url: '/admin/:siteName/articles/manager/?orderBy&startAt&endAt&equalTo',
                params: {
                    siteName: '',
                    orderBy: '',
                    startAt: '',
                    endAt: '',
                    equalTo: ''
                },
                templateUrl: 'app/parts/articles/manager/articles.tmpl.html',
                controller: 'ArticleManagerController',
                controllerAs: 'vm'
            })
            .state('quartz.admin-default.articleCategoryManager', {
                url: '/admin/:siteName/articles/manager/?orderBy&startAt&endAt&equalTo',
                params: {
                    siteName: '',
                    orderBy: '',
                    startAt: '',
                    endAt: '',
                    equalTo: ''
                },
                templateUrl: 'app/parts/articles/manager/categories.tmpl.html',
                controller: 'ArticleCateManagerController',
                controllerAs: 'vm'
            });
    }
})();
