(function () {
    'use strict';

    angular
        .module('app.plugins.articleproduct', [])
        .service('articleProduct', ArticleProduct);
    /* @ngInject */
    function ArticleProduct($transitions, $rootScope, $firebaseStorage, $timeout, $stateParams) {
        var self = this;

        $rootScope.$on('site:change', function () {
            self.reset = true;
        });

        function getParams(stateParams) {
            var _params = JSON.parse((stateParams || {}).params || $stateParams.params || '{"product":{}, "article":{}}');
            return {product: _params.product || {}, article: _params.article || {}};
        }

        var queryListCache = {};
        function queryList(params) {
            var type = (params || {}).type || 'product',
                _params = Object.assign({}, getParams()[type], (params || {})),
                sort = _params.sort || (type === 'product' ? 'itemId' : 'id'),
                id = 't' + type + 'c' + _params.cate + 's' + _params.subCate + 'q' + _params.queryString + 't' + _params.tag + 's' + sort;
            queryListCache[id] = queryListCache[id] || {};

            _params.type = type;
            _params.index = $stateParams.siteName;

            if (queryListCache[id].load === 'loaded' && self.reset !== true) {
                return queryListCache[id];
            } else if (queryListCache[id].load === 'loading') {
                return;
            }
            self.reset = false;
            queryListCache[id].pagination = _core.util.elasticsearch.queryList(_params);
            queryListCache[id].get = function (page, size, sort) {
                queryListCache[id].load = 'loading';
                var getPromise = queryListCache[id].pagination.get(page, size, sort);
                getPromise.then(function (res) {
                    queryListCache[id].load = 'loaded';
                    queryListCache[id].size = size;
                    queryListCache[id].page = page;
                    queryListCache[id].result = {hits: res.hits, total: res.total};
                    $timeout(angular.noop,0)
                });
                return getPromise;
            };
            //init
            queryListCache[id].get( _params.page || 1, _params.size || 5, sort);
        }

        this.queryList = queryList;
        this.queryProduct = function (params) {
            angular.extend(params || {}, {type: 'product'});
            return queryList(params);
        };
        this.queryArticle = function (params) {
            angular.extend(params || {}, {type: 'article'});
            return queryList(params);
        };

        //// categories and tags
        this.cate = {
            article: {}, product: {}
        };
        function getCate(type, isCrumbs) {
            var _type = type || 'product',
                cateRefPath = _type + '-categories';
            if (self.cate[_type].load === 'loaded' && self.reset !== true) {
                return isCrumbs ? self.cate[_type].crumbs : self.cate[_type].categories
            } else if (self.cate[_type].load === 'loading') {
                return
            }
            self.reset = false;

            self.cate[_type].load = 'loading';
            $firebaseStorage.getWithCache(cateRefPath).then(function (val) {
                self.cate[_type].categories = val || [];
                self.cate[_type].load = 'loaded';

                refreshCrumbs(_type, $stateParams);

                // $rootScope.$on('$stateChangeSuccess', refreshCrumbs);
            });

        }

        $transitions.onSuccess({to: '**'}, function (trans) {
            refreshCrumbs('article', trans.params('to'));
            refreshCrumbs('product', trans.params('to'));
        });
        function refreshCrumbs(type, toParams) {
            if (toParams.params) getCateCrumbs(type, getParams(type, toParams)[type]);
        }

        this.getCate = getCate;
        function getCateCrumbs(type, apParams) {
            var res = [],
                toParams = {},
                cate = apParams.cate,
                subCate = apParams.subCate,
                tag = apParams.tag,
                categories = self.cate[type].categories || [];

            toParams[type] = {};
            if (cate % 1 === 0) {
                toParams[type].cate = cate;
                var cateParams = angular.copy(toParams);
                res.push({name: categories[cate][0], params: cateParams});
                if (subCate % 1 === 0) {
                    toParams[type].subCate = subCate;
                    var subParams = angular.copy(toParams);
                    res.push({name: categories[cate][1][subCate], params: subParams});
                }
            } else {
                res.push({name: 'GENERAL.ALLCATE', params: toParams});
            }
            if (tag) {
                toParams[type].tag = tag;
                res.push({name: tag, params: toParams});
            }
            self.cate[type].crumbs = res;
        }
        this.getCateCrumbs = function (type) {
            return getCate(type, true);
        };

        this.getProduct = function (id) {
            var _id = id || getParams().product.id;
            return $firebaseStorage.get('product?type=detail&id=' + _id);
        };
        this.getArticle = function (id) {
            var _id = id || getParams().article.id;
            return $firebaseStorage.get('article?type=detail&id=' + _id);
        };
    }
})();
