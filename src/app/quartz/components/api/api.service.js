(function () {
    'use strict';

    angular
        .module('quartz.components')
        .factory('apiService', ApiService);

    /* @ngInject */
    function ApiService($firebaseStorage, $timeout, $auth, $state, $stateParams, $injector) {
        var $mdMedia;
        try {
            $mdMedia = $injector.get('$mdMedia');
        } catch (e) {
        }

        //basics
        var queryListCache = {};
        function queryList(type, params) {

            var _params = {};
            if (typeof params === 'string') {
                ['type', 'cate', 'subCate', 'queryString', 'tag', 'sort'].forEach(function (attr) {
                    var match = params.match(new RegExp(attr + '=(.*?);'));
                    if (match) _params[attr] = match[1];
                });
            } else {
                _params = params||{};
            }
            var sort = _params.sort || 'id',
                id = type + 'c' + _params.cate + 's' + _params.subCate + 'q' + _params.queryString + 't' + _params.tag + 's' + sort;
            queryListCache[id] = queryListCache[id] || {};

            _params.type = type;

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
            return queryList('product', params);
        }

        function queryArticle(params) {
            return queryList('article', params);
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
                } else {
                    return cate[_type].categories;
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

        function getSitePreload() {
            var siteName = _core.util.site.siteName;
            if (_core.util.site.cache[siteName]) {
                return _core.util.site.cache[siteName].preload || {};
            } else {
                return {};
            }
        }

        function go(pageName, params) {
            var _params = params || {};
            $state.go('customPage', {
                pageName: pageName || $stateParams.pageName,
                params: angular.isObject(params) ? JSON.stringify(_params) : params
            });
        }

        //auth
        function login(email, pass) {
            return $auth.signInWithEmailAndPassword(email, pass)
        }

        function loginWithProvider(provider, opt) {
            var _opt = opt || {};
            if ($mdMedia && $mdMedia('xs')) {
                var homeUrl = window.location.href.split('#')[0] + '#' + config.defaultUrl;
                _opt.popup = false;
                _opt.remember = 'default';
                window.location.href = homeUrl;
                return $auth.loginWithProvider(provider, _opt);
            } else {
                return $auth.loginWithProvider(provider, _optn).catch(showError).then(function (res) {
                    return $auth.checkIfAccountExistOnFb(res.user)
                }).then($auth.createAccount);
            }
        }

        function logout() {
            return $auth.signOut();
        }

        function user() {
            return $auth.currentUser
        }


        return {
            basics: {
                queryList: queryList,
                queryProduct: queryProduct,
                queryArticle: queryArticle,
                getCate: getCate,
                getProduct: getProduct,
                getArticle: getArticle,
                getSitePreload: getSitePreload,
                go: go
            },
            auth: {
                user: user,
                login: login,
                loginWithProvider: loginWithProvider,
                logout: logout
            }
        };
    }
})();
