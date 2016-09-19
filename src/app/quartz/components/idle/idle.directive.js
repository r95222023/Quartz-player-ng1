(function () {
    'use strict';

    angular
        .module('quartz.components')
        .directive('idleCountdown', ['Idle', function(Idle) {
            return {
                restrict: 'A',
                scope: {
                    value: '=idleCountdown'
                },
                link: function($scope) {
                    // Initialize the scope's value to the configured timeout.
                    $scope.value = Idle.getTimeout();

                    $scope.$on('IdleWarn', function(e, countdown) {
                        $scope.$evalAsync(function() {
                            $scope.value = countdown;
                        });
                    });

                    $scope.$on('IdleTimeout', function() {
                        $scope.$evalAsync(function() {
                            $scope.value = 0;
                        });
                    });
                }
            };
        }])
        .directive('title', ['Title', function(Title) {
            return {
                restrict: 'E',
                link: function($scope, $element, $attr) {
                    if (!Title.isEnabled() || $attr.idleDisabled) return;

                    Title.store(true);

                    $scope.$on('IdleStart', function() {
                        Title.original($element[0].innerText);
                    });

                    $scope.$on('IdleWarn', function(e, countdown) {
                        Title.setAsIdle(countdown);
                    });

                    $scope.$on('IdleEnd', function() {
                        Title.restore();
                    });

                    $scope.$on('IdleTimeout', function() {
                        Title.setAsTimedOut();
                    });
                }
            };
        }]);
})();
