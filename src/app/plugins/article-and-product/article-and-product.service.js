(function () {
    'use strict';

    angular
        .module('app.plugins.articleproduct', [])
        .service('articleProduct', ArticleProduct);
    /* @ngInject */
    function ArticleProduct($firebaseStorage, $timeout) {
        var self = this;

        var queryListCache = {};
        function queryList(type, params) {
            var _params={};
            if(typeof params==='string'){
                ['type','cate','subCate','queryString','tag','sort'].forEach(function(attr){
                    var match=params.match(new RegExp(attr+'=(.*?);'));
                    if(match) _params[attr]= match[1];
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
        // function getCate(type, isCrumbs) {
        //     var _type = type || 'product',
        //         cateRefPath = _type + '-categories';
        //     if (self.cate[_type].load === 'loaded') {
        //         return isCrumbs ? self.cate[_type].crumbs : self.cate[_type].categories
        //     } else if (self.cate[_type].load === 'loading') {
        //         return
        //     }
        //
        //     self.cate[_type].load = 'loading';
        //     $firebaseStorage.getWithCache(cateRefPath).then(function (val) {
        //         self.cate[_type].categories = val || [];
        //         self.cate[_type].load = 'loaded';
        //     });
        //
        // }
        this.getCate= function(type, cateId, subCateId) {
            var _type = type || 'product',
                cateRefPath = _type + '-categories';
            if (self.cate[_type].load === 'loaded') {
                if(angular.isNumber(cateId)&&angular.isNumber(subCateId)){
                    return self.cate[_type].categories[cateId][1][subCateId];
                } else if(angular.isNumber(cateId)&&!angular.isNumber(subCateId)){
                    return self.cate[_type].categories[cateId][0];
                }
            } else if (self.cate[_type].load === 'loading') {
                return
            }

            self.cate[_type].load = 'loading';
            $firebaseStorage.getWithCache(cateRefPath).then(function (val) {
                self.cate[_type].categories = val || [];
                self.cate[_type].load = 'loaded';
            });
        };


        this.getProduct = function (id) {
            return $firebaseStorage.get('product?type=detail&id=' + id);
        };
        this.getArticle = function (id) {
            return $firebaseStorage.get('article?type=detail&id=' + id);
        };
    }
})();
