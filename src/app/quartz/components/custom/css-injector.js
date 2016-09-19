(function () {
    'use strict';
    angular.module('quartz.components')
        .factory("injectCSS", CssInjector);

    /* @ngInject */
    function CssInjector($q, $rootScope,$transitions) {
        var injectCSS = {};

        function regRemover(id){
            var dereg = $transitions.onStart({ to: '**' }, function(trans) {
                injectCSS.remove(id);
                dereg();
            });
        }

        var createLink = function (id, url) {
            var link = document.createElement('link');
            link.id = id;
            link.rel = "stylesheet";
            link.type = "text/css";
            link.href = url;
            return link;
        };
        var createStyle = function (id, val) {
            var style = document.createElement('style');
            style.id = id;
            style.innerHTML = val||'';
            return style;
        };

        var checkLoaded = function (url, deferred, tries) {
            for (var i in document.styleSheets) {
                var href = document.styleSheets[i].href || "";
                if (href.split("/").slice(-1).join() === url) {
                    deferred.resolve();
                    return;
                }
            }
            tries++;
            setTimeout(function () {
                checkLoaded(url, deferred, tries);
            }, 50);
        };

        injectCSS.set = function (id, url, isRemovable) {
            var tries = 0,
                deferred = $q.defer(),
                link;

            if (!angular.element('link#' + id).length) {
                link = createLink(id, url);
                link.onload = deferred.resolve;
                angular.element('head').append(link);
            }
            checkLoaded(url, deferred, tries);
            if(isRemovable){
                regRemover();
                // var listener = $rootScope.$on('$stateChangeStart',
                //     function () {
                //         injectCSS.remove(id);
                //         listener();
                //     });
            }

            return deferred.promise;
        };
        //
        // injectCSS.setFromFirebase = function (id, refUrl) {
        //     var def = $q.defer();
        //     $firebase.ref(refUrl).once('value', function (snap) {
        //         injectCSS.setDirectly(id, snap.val());
        //         def.resolve();
        //     });
        //     return def.promise;
        // };

        injectCSS.setDirectly = function (id, value, isRemovable) {
            if (!angular.element('style#' + id).length) {
                var style = createStyle(id, value);
                angular.element('head').append(style);
            } else {
                angular.element('style#' + id).remove();
                injectCSS.setDirectly(id,value);
            }
            if(isRemovable){
                regRemover();
                // var listener = $rootScope.$on('$stateChangeStart',
                //     function (event, toState, toParams, fromState, fromParams, options) {
                //         injectCSS.remove(id);
                //         listener();
                //     });
            }
        };

        injectCSS.remove = function(id){
            angular.element('#' + id).remove();
        };

        return injectCSS;
    }
})();
