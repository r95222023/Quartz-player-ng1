(function () {
    'use strict';

    angular
        .module('quartz.components')
        .factory('apiService', ApiService);
    /* @ngInject */
    function ApiService($firebaseStorage, $timeout, $auth, $state, $stateParams) {
        var queryListCache = {};

        function queryList(type, params) {
            var _params = {};
            if (typeof params === 'string') {
                ['type', 'cate', 'subCate', 'queryString', 'tag', 'sort'].forEach(function (attr) {
                    var match = params.match(new RegExp(attr + '=(.*?);'));
                    if (match) _params[attr] = match[1];
                });
            } else {
                _params = params;
            }
            var sort = _params.sort || (type === 'product' ? 'itemId' : 'id'),
                id = type + 'c' + _params.cate + 's' + _params.subCate + 'q' + _params.queryString + 't' + _params.tag + 's' + sort;
            queryListCache[id] = queryListCache[id] || {};

            _params.type = type;
            _params.index = _core.util.site.siteName;

            if (queryListCache[id].load === 'loaded') {
                return queryListCache[id];
            } else if (queryListCache[id].load === 'loading') {
                return;
            }
            queryListCache[id].pagination = _core.util.elasticsearch.queryList(_params);
            queryListCache[id].get = function (page, size, sort) {
                queryListCache[id].load = 'loading';
                var getPromise = queryListCache[id].pagination.get(page, size, sort);
                getPromise.then(function (res) {
                    queryListCache[id].load = 'loaded';
                    queryListCache[id].size = size;
                    queryListCache[id].page = page;
                    queryListCache[id].result = {hits: res.hits, total: res.total};
                    $timeout(angular.noop, 0)
                });
                return getPromise;
            };
            //init
            queryListCache[id].get(_params.page || 1, _params.size || 5, sort);
        }

        function queryProduct(params) {
            angular.extend(params || {}, {type: 'product'});
            return queryList(params);
        }

        function queryArticle(params) {
            angular.extend(params || {}, {type: 'article'});
            return queryList(params);
        }

        //// categories and tags
        var cate = {
            article: {}, product: {}
        };

        function getCate(type, cateId, subCateId) {
            var _type = type || 'product',
                cateRefPath = _type + '-categories';
            if (cate[_type].load === 'loaded') {
                if (angular.isNumber(cateId) && angular.isNumber(subCateId)) {
                    return cate[_type].categories[cateId][1][subCateId];
                } else if (angular.isNumber(cateId) && !angular.isNumber(subCateId)) {
                    return cate[_type].categories[cateId][0];
                }
            } else if (cate[_type].load === 'loading') {
                return
            }

            cate[_type].load = 'loading';
            $firebaseStorage.getWithCache(cateRefPath).then(function (val) {
                cate[_type].categories = val || [];
                cate[_type].load = 'loaded';
            });
        }


        function getProduct(id) {
            return $firebaseStorage.get('product?type=detail&id=' + id);
        }

        function getArticle(id) {
            return $firebaseStorage.get('article?type=detail&id=' + id);
        }

        //auth
        function login(pageName) {
            var toParams = {
                pageName: pageName,
                params: $stateParams
            };
            if ($state.name !== 'customPage') {
                toParams.stateName = $state.name;
            }
            $state.go('customPage.login', toParams);
        }

        return {
            queryList: queryList,
            queryProduct: queryProduct,
            queryArticle: queryArticle,
            getCate: getCate,
            getProduct: getProduct,
            getArticle: getArticle,
            auth: $auth
        };
    }
})();
