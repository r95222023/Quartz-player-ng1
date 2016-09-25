(function() {
    'use strict';

    angular.module('quartz.directives')
        .directive('fsSrc', fsSrc)
        .directive('fsHref', fsHref);


    /* @ngInject */
    function fsSrc($firebaseStorage, $usage) {
        return {
            link: link,
            restrict: 'A'
        };

        function link($scope, $element, attrs){
            if(attrs['fsSrc'].search('//')!==-1) {
                attrs.$set('src', attrs['fsSrc']);
                return;
            }
            $firebaseStorage.ref('file-path?path='+attrs['fsSrc'], {isJs:false}).getMetadata()
                .then(function(meta){
                    attrs.$set('src', meta.downloadURLs);
                    $usage.useBandwidth(meta.size);
                });
        }
    }

    /* @ngInject */
    function fsHref($firebaseStorage, $usage) {
        return {
            link: link,
            restrict: 'A'
        };

        function link($scope, $element, attrs){
            if(attrs['fsHref'].search('//')!==-1) {
                attrs.$set('href', attrs['fsHref']);
                return;
            }
            $firebaseStorage.ref('file-path?path='+attrs['fsHref'], {isJs:false}).getMetadata()
                .then(function(meta){
                    $element.on('click',function(){
                        $usage.useBandwidth(meta.size);
                    });
                    attrs.$set('href', meta.downloadURLs);
                });
        }
    }

})();
