(function () {
    "use strict";
    // when $routeProvider.whenAuthenticated() is called, the path is stored in this list
// to be used by authRequired() in the services below
    var securedStates = [];

//mod.config(function ($urlRouterProvider, config) {
//    // routes which are not in our map are redirected to 'home'
//    $urlRouterProvider.otherwise(config.redirectUrl);
//})

    /**
     * Adds a special `whenAuthenticated` method onto $routeProvider. This special method,
     * when called, waits for auth status to be resolved asynchronously, and then fails/redirects
     * if the user is not properly authenticated.
     *
     * The promise either resolves to the authenticated user object and makes it available to
     * dependency injection (see AuthCtrl), or rejects the promise if user is not logged in,
     * forcing a redirect to the /login page
     */
    angular.module('quartz.components')
        .config(['$stateProvider', function ($stateProvider) {
            $stateProvider.stateAuthenticated = function (name, stateObject) {
                securedStates.push(name);
                stateObject.resolve = stateObject.resolve || {};
                stateObject.resolve.authData = ['$auth', function ($auth) {
                    return $auth.requireAuth();
                }];
                $stateProvider.state(name, stateObject);
                return this;
            }
        }])

    /**
     * Apply some route security. Any route's resolve method can reject the promise with
     * { authRequired: true } to force a redirect. This method enforces that and also watches
     * for changes in auth status which might require us to navigate away from a path
     * that we can no longer view.
     */
        .run(/*@ngInject*/ function ($rootScope,$transitions, $location, $state, $auth, config) {
            $auth.onAuthStateChanged(checkState);

            function checkState(user) {
                if (!user && authStateRequired($state.current.name)) {
                    console.log('check failed', user, $location.path()); //debug
                    $state.go(config.loginRedirectState);
                }
            }

            $transitions.onError({ to: '**' },
                function (trans) {
                    if (trans.error() === "AUTH_REQUIRED") {
                        $state.transitionTo(config.loginRedirectState);
                    }
                });

            function authStateRequired(name) {
                console.log('authRequired?', name, securedStates.indexOf(name)); //debug
                return securedStates.indexOf(name) !== -1;
            }
        }
    );
})();

