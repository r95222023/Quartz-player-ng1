(function () {
    'use strict';
    angular.module('quartz.components')
        .factory("$lazyLoad", LazyLoad);

    /* @ngInject */
    function LazyLoad($ocLazyLoad, $firebaseStorage, injectCSS) {
        function getDownloadUrls(srcArr){
            var promises = [];
            srcArr.forEach(function (src, index) {
                if (src.search('//') === -1) {
                    promises[index] = $firebaseStorage.ref('file-path?path=' + src).getDownloadURL();
                } else {
                    promises[index] = Promise.resolve(src);
                }
            });
            return Promise.all(promises);
        }

        function isCSS(source){
            if(typeof source==='string'){
                return source.match(/\.css$/)!==null;
            } else if(typeof source==='object'){
                var url=source.src||source.href;
                return source.rel==='stylesheet'||url.match(/\.css$/)!==null;
            }
        }

        function isJS(source){
            if(typeof source==='string'){
                return source.match(/\.js/)!==null;
            } else if(typeof source==='object'){
                var url=source.src||source.href;
                return source.type==='text/javascript'||url.match(/\.js$/)!==null;
            }
        }

        function getLazyLoadArgs(sources, pageName) {
            var _sourcesArr = sources || [], jsArr = [], cssArr = [];
            _sourcesArr.forEach(function (val) {
                val.src = val.src||val.href||'';
                if (isCSS(val)) cssArr.push(val.src);
                if (isJS(val)&&!val.defer) jsArr.push(val.src);
            });

            getDownloadUrls(cssArr).then(function(cssUrlArr){
                cssUrlArr.forEach(function(url,index){
                    injectCSS.set('style' + pageName + index, url, true);
                });
            });

            return new Promise(function (resolve, reject) {
                getDownloadUrls(jsArr).then(function(res){

                    resolve({serie: true, files: res});
                }).catch(reject);
            })
        }

        function loadData(val, resolve, pageId) {
            var _val = val || {},
                sources = _val.sources;
            injectCSS.setDirectly('style' + pageId, _val.css, true);

            if (sources) {
                getLazyLoadArgs(sources, pageId).then(function (args) {
                    if (args.files.length) {
                        $ocLazyLoad.load(args).then(function () {
                            resolve(_val);
                            console.log(_val)
                        })
                    } else {
                        resolve(_val);
                    }
                });
            } else {
                resolve(_val);
            }
        }

        function load(type, name) {
            return new Promise(function (resolve, reject) {
                var _name = name,
                    id = _name.replace(/\s+/g, '');

                if (angular.isObject(type)) {
                    loadData(type, resolve, id);
                } else {
                    _core.util.site.loadPage('', name).then(function (val) {
                        loadData(val, resolve, id);
                    });
                }
            })
        }

        function loadSite(data) {
            return new Promise(function(resolve,reject){
                if (data.sources) {
                    getLazyLoadArgs(data.sources, 'selectedSite').then(function (args) {
                        if (args.files.length) {
                            $ocLazyLoad.load(args).then(function () {
                                resolve();
                            })
                        } else {
                            resolve();

                        }
                    });
                } else {
                    resolve();
                }
            })
        }

        return {
            getDownloadUrls:getDownloadUrls,
            load: load,
            loadSite: loadSite
        }
    }
})();
