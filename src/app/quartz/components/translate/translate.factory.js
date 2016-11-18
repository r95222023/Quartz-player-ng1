(function() {
    'use strict';

    angular
        .module('quartz.components')
        .factory('fbStorageLoader', fbStorageLoader);

    /* @ngInject */
    function fbStorageLoader($firebaseStorage, $http) {
        return function(options){
            return new Promise(function(resolve,reject){
                $firebaseStorage.ref('file-path?path=il8n/'+options.key+'.json').getDownloadURL().then(function(url){
                    $http.get(url).then(function(response){
                        resolve(response.data);
                    },function(response){
                        reject(response);
                    })
                })
            })
        };
    }
})();
