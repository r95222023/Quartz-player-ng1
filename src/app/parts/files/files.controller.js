(function () {
    'use strict';

    angular
        .module('app.parts.files');
    //     .controller('CustomListController', CustomListController)
    //     .controller('I18nController', I18nController);
    //
    // /* @ngInject */
    // function CustomListController($firebase, $firebaseStorage) {
    //     var vm = this,
    //         refPath = 'config/data/lists@selectedSite';
    //     $firebaseStorage.getWithCache(refPath).then(function (val) {
    //         if (!val) return;
    //         vm.lists = JSON.stringify(val);
    //     });
    //
    //     vm.update = function () {
    //         //todo: check if vm.lists is valid
    //         $firebaseStorage.update(refPath, JSON.parse(vm.lists));
    //     }
    // }
})();
