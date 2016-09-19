(function () {
    "use strict";

    var state = 'error',
        url = '/error/:errorId',
        ctrlName = 'errorCtrl',
        templateUrl = 'components/errorHandler/error.html';


    angular.module('quartz.components')
        .controller(ctrlName, /*@ngInject*/ function ($scope, $stateParams) {
            //create your own controller here
            $scope.error = $stateParams
        })
        .config(/*@ngInject*/ function ($stateProvider) {
            $stateProvider.state(state, {
                url: url,
                templateUrl: templateUrl,
                controller: ctrlName,
                resolve: {
                    user: ['$auth', function ($auth) {
                        return $auth.waitForAuth();
                    }]
                }
            });
        })
        .factory('$errorHandler', /*@ngInject*/ function ($state) {

            function openErrorPage(opt) {
                $state.go('error', opt);
                if (!$scope.$$phase) $scope.$apply(); //確保成功轉換頁面
            }

            return function (opt) {
                var _opt = opt || {};
                if (!_opt.type) {
                    return function (error) {
                        console.log(JSON.stringify(error));
                    }
                } else if (_opt.openErrorPage) {
                    openErrorPage(_opt)
                }
            };
        });
})();
