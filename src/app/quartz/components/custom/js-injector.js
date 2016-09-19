(function () {
    'use strict';
    angular.module('quartz.components')
        .factory("injectJS", JsInjector);

    /* @ngInject */
    function JsInjector($q) {
        var injectJS = {},
            injected = {};
        var createScript = function (id,value) {
            var script = document.createElement('script');
            script.id = id;
            script.type = "text/javascript";
            if (value) {
                script.text = value || '';
            }
            return script;
        };

        injectJS.set = function (id, url) {
            var script;

            if (!injected[id]) {
                injected[id] = $q.defer();
                script = createScript(id);
                script.onload = injected[id].resolve;
                angular.element('head').append(script);
                script.src = url;
            }
            return injected[id].promise;
        };

        injectJS.setDirectly = function (id, value) {
            if (!injected[id]) {
                injected[id] = $q.defer();
                var script = createScript(id, value);
                injected[id].resolve();
                angular.element('head').append(script);
            }
            return injected[id].promise;
        };

        return injectJS;
    }
})();
