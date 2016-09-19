(function () {
    'use strict';

    angular
        .module('app.parts.design')
        .controller('SiteSettingOLDCtrl', SiteSettingCtrl);

    /* @ngInject */
    function SiteSettingCtrl($firebase, $firebaseStorage,$mdToast) {
        var vm= this,path='site-config-preload';
        vm.addSource = function (input) {
            var _input = (input || '').replace(/\s+/g, '');
            if(input) vm.sources.push(_input);
        };
        vm.removeSource = function (index) {
            vm.sources.splice(index, 1);
        };
        $firebaseStorage.getWithCache(path).then(function(preload){
            vm.preload = preload||{};
            vm.sources = vm.preload.sources||[];
        });
        vm.update = function(){
            if(vm.sources.length===0) return;
            var data = angular.extend({},vm.preload);
            data.sources= vm.sources;
            // $firebase.updateCacheable(path,data);
            $firebaseStorage.update(path, data);
            $mdToast.show(
                $mdToast.simple()
                    .textContent('Saved!')
                    .hideDelay(3000)
            );
        };
    }
})();
