(function () {
    'use strict';

    angular
        .module('app.parts.design')
        .controller('BasicApiController', BasicApiController)
        // .controller('CustomPageController', CustomPageController)
        .controller('CustomPageCtrl', CustomPageCtrl)
        .controller('PreviewFrameController', PreviewFrameCtrl);

    /* @ngInject */
    function BasicApiController(apiService, $injector, $auth, $firebaseStorage, $scope, $state, $stateParams) {
        angular.forEach(apiService, function (method, methodName) {
            $scope[methodName] = method
        });
        $scope.$service = function (name) {
            return $injector.get(name);
        };
        console.log($scope);
        $scope.test = function () {
            console.log('test1');
        };

        //
        // $scope.$get = $firebaseStorage.get;
        // $scope.$getProduct = articleProduct.getProduct;
        // $scope.$getArticle = articleProduct.getArticle;
        // $scope.$queryList = articleProduct.queryList;
        // $scope.$queryProduct = articleProduct.queryProduct;
        // $scope.$queryArticle = articleProduct.queryArticle;
        // $scope.$getCate = articleProduct.getCate;
        // $scope.$cate = articleProduct.cate;
        // $scope.$auth = $auth;
        // $scope.$login = function (pageName, state) {
        //     var toParams = {
        //         pageName: pageName || $stateParams.pageName,
        //         params: JSON.stringify($stateParams.params)
        //     };
        //     if ($state.name !== 'customPage') {
        //         toParams.stateName = $state.name;
        //     }
        //     $state.go('authentication.login', toParams);
        // };
        // $scope.params = JSON.parse($stateParams.params || '{}');
        // if (!$scope.$go) $scope.$go = function (pageName, params) {
        //     var _params = {};
        //     if (angular.isObject(params)) angular.extend(_params, params);
        //     console.log(params);
        //     console.log({pageName: pageName, params: JSON.stringify(_params)});
        // };
    }


    /* @ngInject */
    function CustomPageCtrl(pageData, apiService, $scope, $injector, customService, $stateParams, $timeout, $state, $ocLazyLoad, $lazyLoad, snippets) {
        var qa = this;
        angular.forEach(apiService, function (method, methodName) {
            qa[methodName] = method
        });
        qa.$service = function (name) {
            return $injector.get(name);
        };


        loadDeferedJs($lazyLoad, $ocLazyLoad, snippets, pageData.sources);
        injectCustomJs($injector, pageData.customJs);
        // $scope.$go = function (pageName, params) {
        //     var _params = {};
        //     if (angular.isObject(params)) angular.extend(_params, params);
        //     $state.go('customPage', {
        //         pageName: pageName || $stateParams.pageName,
        //         params: JSON.stringify(_params)
        //     });
        // };

        // angular.extend(customPage, $stateParams);
    }

    /* @ngInject */
    function PreviewFrameCtrl($lazyLoad, apiService, $injector, snippets,$ocLazyLoad,  $scope, customService, $stateParams, $timeout, $state) {
        var qa = this;
        angular.forEach(apiService, function (method, methodName) {
            qa[methodName] = method
        });
        qa.$service = function (name) {
            return $injector.get(name);
        };
        var pageData = window._previewPageData;
        console.log($stateParams);
        loadDeferedJs($lazyLoad, $ocLazyLoad, snippets, pageData.sources);
        injectCustomJs($injector, pageData.customJs);

    }


    function loadDeferedJs($lazyLoad, $ocLazyLoad, snippets, sources) {
        var defered = [];
        angular.forEach(sources, function (val) {
            if (val.src.search(/.*(\.js$|\.js?)/) !== -1 && val.defer) defered.push(val.src);
        });

        var fireLoadEvent = snippets.debounce(function () {
            // $(element).removeClass('ng-hide');
            $(window).trigger('load');
            $('body,html').removeClass('qa-loading');
        }, 100);

        $lazyLoad.getDownloadUrls(defered).then(function (res) {
            $ocLazyLoad.load({serie: true, files: res}).then(fireLoadEvent).catch(fireLoadEvent);
        });
    }

    function injectCustomJs($injector, customJs) {
        if (customJs) {
            var js;
            if (customJs.search('\/*@ngController*\/') !== -1) {
                try {
                    eval("js =" + customJs);
                    if (angular.isFunction(js) || (angular.isArray(js) && angular.isFunction(js[js.length]))) {
                        $injector.invoke(js, ctrl, {"$scope": $scope});
                    }
                } catch (e) {
                }
            } else {
                try {
                    eval(customJs);
                } catch (e) {
                }
            }
        }
    }
})();
