(function () {
    'use strict';

    angular
        .module('quartz.directives')
        .directive('customItem', customItem);

    /* @ngInject */
    function customCtrl($scope, $attrs, $controller) {
        if ($attrs.apiCtrl) {
            $controller($attrs.apiCtrl, {"$scope": $scope});
        }
    }

    /* @ngInject */
    function customItem($compile, $injector, $ocLazyLoad, $lazyLoad, snippets) {
        var linker = function (scope, element, attrs, ctrl) {
            var _ctrl = angular.copy(ctrl),
                status,
                deferedJsLoaded;
            $(element).addClass('ng-hide');
            var fireLoadEvent = snippets.debounce(function(){
                $(element).removeClass('ng-hide');
                $(window).trigger('load');
            },100)

            function loadDeferedJs() {
                if (deferedJsLoaded) return;
                var defered = [];
                angular.forEach(scope.sources, function (val) {
                    if (val.src.search(/.*(\.js$|\.js?)/)!==-1 && val.defer) defered.push(val.src);
                });

                $lazyLoad.getDownloadUrls(defered).then(function (res) {
                    $ocLazyLoad.load({serie: true, files: res}).then(fireLoadEvent).catch(fireLoadEvent);
                });
                deferedJsLoaded = true;
            }

            function injectCustomJs() {
                if (scope.customJs) {
                    var js, customJs = scope.customJs;
                    try {
                        eval("js =" + customJs);
                        if (angular.isFunction(js) || (angular.isArray(js) && angular.isFunction(js[js.length]))) {
                            $injector.invoke(js, ctrl, {"$scope": scope});
                        }
                    } catch (e) {
                        try {
                            eval(customJs);
                        } catch (e) {
                        }
                    }
                }
            }

            function compile() {
                if (status === 'compiling' || !scope.content) return;
                status = 'compiling';
                angular.forEach(ctrl, function (val, key) {
                    delete ctrl[key];
                });
                angular.forEach(_ctrl, function (val, key) {
                    ctrl[key] = val;
                });
                if (angular.isString(scope.content)) {
                    if (attrs.modelAs) scope[attrs.modelAs] = scope.model;
                    element.html(scope.content).show();
                    injectCustomJs();
                    loadDeferedJs();
                    $compile(element.contents())(scope);
                }
                var timeout = setTimeout(function () {
                    status = '';
                    clearTimeout(timeout);
                }, 1000)
            }
            scope.$watch('customJs', compile);
            scope.$watch('content', compile);
        };

        return {
            restrict: "E",
            controller: customCtrl,
            controllerAs: 'vm',
            link: linker,
            scope: {
                content: '=',
                customJs: '=',
                sources: '='
            }
        };
    }

})();
