(function() {
    'use strict';

    angular.module('quartz.directives')
        .directive('customWidget', customWidget);


    /* @ngInject */
    function customWidget($firebaseStorage, customService,$compile) {
        return {
            link: link,
            restrict: 'E'
        };

        function link($scope, $element, attrs){
            $firebaseStorage.getWithCache('widget?type=detail&id='+attrs['name'])
                .then(function(val){
                    var html = customService.compileAll(val.content);
                    $element.replaceWith(html);
                    $compile($element.contents())($scope);
                });
        }
    }
})();
