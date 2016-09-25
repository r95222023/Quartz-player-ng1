(function () {
    'use strict';
    window._core = window._core || {};
    window._core.Loader = Loader;
    if (typeof define === 'function' && define.amd) {
        define(function () {
            return Loader;
        });
    } else if (typeof module !== 'undefined' && module != null) {
        module.exports = Loader
    }

    var COMMONPACKAGES = {
        ngMaterial: {
            v:'1.1.0',
            ngModule:'ngMaterial',
            css: 'https://ajax.googleapis.com/ajax/libs/angular_material/:version/angular-material.min.css',
            js: 'https://ajax.googleapis.com/ajax/libs/angular_material/:version/angular-material.min.js'
        }
    };

    function Loader(util) {
        //constructor
        this.util = util;
    }

    Loader.prototype.loadPackages = function (name, opt, ngModules) {
        var _opt = opt||{};
        var version = _opt.version||COMMONPACKAGES[name].v;
        var loadPromises = [];
        var script = document.createElement('script');
        script.type = "text/javascript";
        if(_opt.js!==false) loadPromises.push(new Promise(function (resolve, reject) {
            script.onload = resolve;
            document.body.appendChild(script);
            script.src = COMMONPACKAGES[name].js.replace(':version', version);
        }));
        var link = document.createElement('link');
        link.rel = "stylesheet";
        link.type = "text/css";
        link.href = COMMONPACKAGES[name].css.replace(':version', version);
        if(_opt.css!==false) loadPromises.push(new Promise(function (resolve, reject) {
            link.onload = resolve;
            document.head.appendChild(link);
        }));

        if(COMMONPACKAGES[name].ngModule) ngModules.push(COMMONPACKAGES[name].ngModule);
        return Promise.all(loadPromises);
    };


    Loader.prototype.getExternalSourceUrls = function (sources, siteName) {
        var self = this,
            promises = [];
        var _sourcesArr = sources || [];
        _sourcesArr.forEach(function (src, index) {
            if (src.search('//') !== -1) {
                promises.push(Promise.resolve(src));
            } else {
                var _path = src.charAt(0) === '/' ? 'file-root-path?path=' + src : 'file-path?path=' + src,
                    promise = self.util.storage.ref(_path, {siteName: siteName || self.util.siteName}).getDownloadURL();
                promises.push(promise);
            }
        });
        return Promise.all(promises);
    };

    Loader.prototype.getExternalSourceFromHtml = function (html) {
        var res = {},
            _html = html + '';

        res.scriptRegEx = /<script[^>]*>[\s\S]*?<\/script>/gm;
        res.cssRegEx = new RegExp('<link[^>]*.css[^>]*>', 'gm');
        res.scriptAttrs = ['src', 'async', 'defer', 'type', 'innerHtml'];
        res.cssAttrs = ['type', 'href', 'rel', 'media'];
        res.sources = [];

        ['script', 'css'].forEach(function (type) {
            res[type] = [];
            (html.match(res[type + 'RegEx']) || []).forEach(function (matchStr, index) {
                res[type][index] = {};
                res[type + 'Attrs'].forEach(function (attr) {
                    res[type][index][attr === 'href' ? 'src' : attr] = (matchStr.match(getAttrRegEx(attr)) || [])[1];
                });
                if (type === 'script') {
                    res[type][index].defer = true;
                }
                // var source=res[type][index].src||res[type][index].href;
                res.sources.push(res[type][index]);
                _html = _html.replace(matchStr, '');
            })
        });


        function getAttrRegEx(attr) {
            var regExStr = (attr === 'innerHtml') ? '>([\\s\\S]*)<' : '<[\\s\\S]*' + attr + '[\\s\\S]*?=[\\s\\S]*?[\'\"]([\\s\\S]*?)[\'\"][\\s\\S]*?>';

            return new RegExp(regExStr);
        }

        return {script: res.script, css: res.css, sources: res.sources, html: _html};
    };
})();
