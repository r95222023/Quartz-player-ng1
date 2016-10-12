(function () {
    'use strict';

    angular
        .module('quartz.components')
        .factory('$firebase', FirebaseDatabase);

    /* @ngInject */
    function FirebaseDatabase($timeout, $filter) {
        var $firebase = {
            queryRef: queryRef,
            update: update,
            copy: copy,
            getFileTableFromList: getFileTableFromList,
            pagination: pagination,
            request:request,
            updateCacheable: updateCacheable,
            getValidKey: getValidKey,
            getWithCache: getWithCache
        };

        function queryRef(path, option) {
            var params = {},
                _option = option || {};
            if (_core.util.site.siteName) params.siteName = _core.util.site.siteName;
            if (_option.params) {
                _option.params = Object.assign(params, _option.params);
            } else {
                _option = Object.assign(params, _option);
            }
            return _core.util.database.queryRef(path, _option);
        }

        function update(paths, data, option) {
            var siteName = _core.util.site.siteName ? _core.util.site.siteName : '',
                _option = Object.assign({siteName: siteName}, option),
                _paths = Array.isArray(paths) ? paths : [paths];
            return _core.util.database.update(_paths, data, _option);
        }

        function updateCacheable(path, data) {
            return update(path, {
                compressed: _core.encoding.compress(data),
                editTime: firebase.database.ServerValue.TIMESTAMP
            })
        }

        function copy(srcPath, destPath, removeSrc, opt) {
            return new Promise(function (resolve, reject) {
                var _opt = opt || {},
                    srcRef = queryRef(srcPath, _opt.src);
                srcRef.once('value').then(function (snap) {
                    queryRef(destPath, _opt.dest)[_opt.set === true ? 'set' : 'update'](snap.val())
                        .then(function () {
                            if (removeSrc) {
                                srcRef.set(null).then(resolve)
                            } else {
                                resolve();
                            }
                        });
                }).catch(reject);
            })
        }

        function getFileTableFromList(refUrl, opt) {
            return new Promise(function (resolve, reject) {
                var _opt = opt || {},
                    res = {},
                    ref = queryRef(refUrl, Object.assign(_opt, {params: _opt.params || {}}));
                ref.once('value', function (snap) {
                    snap.forEach(function (childSnap) {
                        var val = childSnap.val(),
                            key = childSnap.key;
                        res[key] = {
                            name: (_opt.fileName ? val[_opt.fileName] : key) + (_opt.fileExtension || '.js'),
                            date: val.editTime,
                            type: 'file'
                        }
                    });
                    resolve(res);
                }).catch(reject);
            });
        }

        function pagination(refUrl, query) {
            var _query=query||{},
                listRef = queryRef(refUrl),
                pagination = new _core.util.database.Pagination(listRef, Object.assign({filter:function(arr, option){
                    return $filter('orderBy')(arr, option.orderBy)
                }},_query), onData);
            pagination.size = 10;
            pagination.page = 1;
            pagination.onReorder = function (orderBy) {
                pagination.get(pagination.page, pagination.size, orderBy);
            };
            function onData(res){
                $timeout(function(){
                    pagination.result.hits = res.hits||[];
                },0)
            }
            return pagination;
        }

        function request(request, response){
            return _core.util.database.request(request,response);
        }

        function getValidKey(key) {
            //TODO
            var res = key, replace = [[/\./g, '^%0'], [/#/g, '^%1'], [/\$/g, '^%2'], [/\[/g, '^%3'], [/\]/g, '^%4']];
            angular.forEach(replace, function (val) {
                res = res.replace(val[0], val[1]);
            });
            // ".", "#", "$", "/", "[", or "]"
            return res;
        }

        function getWithCache(path, option){
            return _core.util.database.getWithCache(path, option);
        }

        return $firebase;
    }
})();
