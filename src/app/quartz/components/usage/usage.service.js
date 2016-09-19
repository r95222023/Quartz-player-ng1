(function() {
    'use strict';

    angular
        .module('quartz.components')
        .service('$usage', Usage);

    /* @ngInject */
    function Usage() {
        var currentUsage=0;
        window._FBUsg=this;
        this.useBandwidth=function(size){
            if(angular.isNumber(size)){
                currentUsage+=size;
            } else {
                currentUsage+=encodeURI(JSON.stringify(size)).split(/%..|./).length-1;
            }
            console.log('usage:', currentUsage);
        };

    }
})();
