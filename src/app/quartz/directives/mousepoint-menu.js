//https://github.com/angular/material/issues/3493
(function() {
    'use strict';

    angular
        .module('quartz.directives')
        .directive('mousepointMenu', mousepointMenu)
        .directive('ngContextmenu',contextMenuDirective)

    /* @ngInject */
    function contextMenuDirective( $rootScope,$parse) {
        return {
            restrict: 'A',
            compile: function($element, attr) {
                // We expose the powerful $event object on the scope that provides access to the Window,
                // etc. that isn't protected by the fast paths in $parse.  We explicitly request better
                // checks at the cost of speed since event handler expressions are not executed as
                // frequently as regular change detection.
                var fn = $parse(attr.ngContextmenu, /* interceptorFn */ null, /* expensiveChecks */ true);
                return function ngEventHandler(scope, element) {
                    element.on('contextmenu', function(event) {
                        var callback = function() {
                            fn(scope, {$event:event});
                        };
                        scope.$apply(callback);
                    });
                };
            }
        };
    }


    /* @ngInject */
    function mousepointMenu() {
        return {
            restrict: 'A',
            require: 'mdMenu',
            link: function($scope, $element, $attrs, mdMenuCtrl){
                var MousePointMenuCtrl = mdMenuCtrl;
                var prev = { x: 0, y: 0 }

                $scope.$mdOpenMousepointMenu = function($event){
                    $event.stopPropagation();
                    $event.preventDefault();
                    MousePointMenuCtrl.offsets = function(){
                        var mouse = {
                            x: $event.clientX,
                            y: $event.clientY
                        }
                        var offsets = {
                            left: mouse.x - prev.x,
                            top: mouse.y - prev.y
                        }
                        prev = mouse;

                        return offsets;
                    }
                    MousePointMenuCtrl.open($event);
                };
            }

        };
    }
})();
