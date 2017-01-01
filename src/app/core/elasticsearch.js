(function () {
    'use strict';

    window._core = window._core||{};
    window._core.ElasticSearch = ElasticSearch;
    if (typeof define === 'function' && define.amd) {
        define(function () {
            return ElasticSearch;
        });
    } else if (typeof module !== 'undefined' && module != null) {
        module.exports = ElasticSearch
    }

    function ElasticSearch(util) {
        //constructor
        this.util = util;
    }

    ElasticSearch.prototype.query = function (searchData) {  //usually use siteName as index.
        var self = this;
        return new Promise(function (resolve, reject) {
            var cacheId = _core.encoding.md5(searchData),
                paths = self.util.paths,
                refUrl = paths['query-request'] + '/' + cacheId,
                cacheRefUrl = paths['query-cache'] + '/' + searchData.siteName + searchData.type,
                storageRefPath = cacheRefUrl + '/' + cacheId;
            // var getWithCache = function (type, onNoData) {
            //     return function(){
            //         self.util[type].getWithCache(storageRefPath).then(function (res) {
            //             if (!res) {
            //                 if(onNoData){
            //                     onNoData()
            //                 } else {
            //                     request(refUrl, storageRefPath, searchData, resolve, reject);
            //                 }
            //             } else {
            //                 resolve(res.result || res);
            //             }
            //         });
            //     }
            // };
            // getWithCache('storage', getWithCache('database'))();
            function request(refUrl, responseUrl, searchData) {
                return self.util.database.request({
                    paths:[refUrl],
                    data: searchData
                },[responseUrl])
                    .then(function (res) {
                        return _core.encoding.decompress(res[0]).result;
                    });
            }

            self.util.storage.getWithCache(storageRefPath).then(function (res) {
                if (!res) {
                    self.util.database.getWithCache(storageRefPath).then(function (databaseRes) {
                        if (!databaseRes) {
                            request(refUrl, storageRefPath, searchData).then(resolve,reject);
                        } else {
                            resolve(databaseRes.result || databaseRes);
                        }
                    });
                } else {
                    resolve(res.result || res);
                }
            });
        })
    };

    // ElasticSearch.prototype.buildQuery=function(mustArr, mustNotArr, query){
    //     var queryData = {
    //         cache: true,
    //         reuse: 200,
    //         body: {
    //             query: {
    //                 "filtered": {
    //                     "filter": {
    //                         "bool": {}
    //                     }
    //                 }
    //             }
    //         }
    //     };
    //
    //     if (mustArr) queryData.body.query.filtered.filter.bool.must = mustArr;
    //     if (mustNotArr) queryData.body.query.filtered.filter.bool['must_not'] = mustNotArr;
    //     if (query) queryData.body.query.filtered.query = query;
    //     return queryData;
    // };

    ElasticSearch.prototype.pagination = function(index, type, query){
        return new Pagination(this,index, type, query);
    };

    ElasticSearch.prototype.queryList = function(params){
        var searchData = {
            siteName:_core.util.site.siteName,
            type:params.type
        };

        if(params.cate!==undefined) searchData.cate = params.cate;
        if(params.subCate!==undefined) searchData.subCate = params.subCate;
        if(params.tag) searchData.tag = params.tag;
        if(params.queryString) searchData.queryString = params.queryString;
        if(params.query) searchData.query = params.query;

        return new Pagination(this, searchData);
    };

    function Pagination(esClient, searchData) {
        this.esClient = esClient;
        this.searchData = searchData;
        this.cache = {};
    }

    Pagination.prototype.get = function (page, size, sort) {
        var self = this,
            searchData=Object.assign({},this.searchData),
            id = 'p' + page + 'l' + size + 's' + (sort || '');

        page = page || 1;
        searchData.size= size;
        searchData.sort = sort;
        searchData.from = parseInt(page - 1) * parseInt(size);
        self.currentPage = page;
        self.size = size;

        if (!this.cache[id]) {
            this.cache[id] = new Promise(function (resolve, reject) {
                self.esClient.query(searchData).then(resolve).catch(reject)
            });
        }
        return this.cache[id];
    };

    Pagination.prototype.onReorder = function (sort) {
        this.searchData.sort = sort;
        this.get(1, this.size, sort);
    };
})();
