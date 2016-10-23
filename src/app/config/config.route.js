(function () {
    'use strict';
    angular
        .module('app.configs')
        .config(routeConfig);

    /* @ngInject */
    function routeConfig($stateProvider, $urlRouterProvider, $locationProvider) {
        // Setup the apps routes
        $locationProvider.hashPrefix('!');
        // 404 & 500 pages
        $stateProvider
            .state('404', {
                url: '/404',
                views: {
                    'root': {
                        templateUrl: '404.tmpl.html',
                        controller: ErrorPageController,
                        controllerAs: 'vm'
                    }
                }
            })
            .state('500', {
                url: '/500',
                views: {
                    'root': {
                        templateUrl: '500.tmpl.html',
                        controller: ErrorPageController,
                        controllerAs: 'vm'
                    }
                }
            });

        /* @ngInject */
        function ErrorPageController($state) {
            var vm = this;

            vm.goHome = goHome;

            /////////

            function goHome() {
                $state.go('mdDashboard.dashboard-analytics');
            }
        }


        // set default routes when no path specified
        // $urlRouterProvider.when('', config.defaultUrl);
        // $urlRouterProvider.when('/', config.defaultUrl);

        // always goto 404 if route not found
        // $urlRouterProvider.otherwise('/404');
        //see http://stackoverflow.com/questions/31190180/angular-1-4-1-ui-router-10-digest-iterations-when-state-go-called-on-statec

        $urlRouterProvider.otherwise(function ($injector) {
            var $state = $injector.get('$state'),
                $transitions = $injector.get('$transitions');
            setTimeout(function(){
                $state.go('404');
            },1000);
        });
        window.addEventListener("hashchange",function(event){
            var errorRegEx = /.*?\/\/.*?(\/#!\/|\/)404$/;
            if(event.oldURL.match(errorRegEx)&&!event.newURL.match(errorRegEx)){
                location.reload();
            }
        });
    }
})();
