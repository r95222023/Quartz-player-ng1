(function() {
    'use strict';

    angular.module('quartz.directives')
        .directive('customWidget', customWidget);


    /* @ngInject */
    function customWidget($firebaseStorage, customService,$compile, injectCSS) {
        return {
            link: link,
            restrict: 'E'
        };

        function link($scope, $element, attrs){
            var name =attrs['name'];
            $firebaseStorage.getWithCache('widget?type=detail&id='+attrs['name'])
                .then(function(val){
                    var html = customService.compileAll(val.content, val.canvas);
                    var e = $compile(html)($scope);
                    $element.replaceWith(e);
                    injectCSS.setDirectly('widget-'+name, val.css);
                });
        }
    }
})();
