(function () {
    'use strict';

    angular
        .module('app.parts.products')
        .controller('CateManagerController', CateManagerController);

    /* @ngInject */
    function CateManagerController($mdToast, $mdDialog, $firebase, $firebaseStorage, indexService, snippets, $stateParams, $state, $mdMedia) {
        var vm = this;

        vm.getFiltered = function () {
            $state.go('quartz.admin-default.productManager', {
                orderBy: vm.orderBy,
                startAt: vm.startAt,
                endAt: vm.endAt,
                equalTo: vm.equalTo
            })
        };

        ////categories

        // var productConfigRef = $firebase.ref('products/config@selectedSite');
        vm.getCate = function () {
            // productConfigRef.on('value', function (snap) {
            //     if (snap.val() === null) return;
            //     vm.productConfig = snap.val();
            //     vm.categories = snippets.getFirebaseArrayData(snap.val().categories);
            //     vm.tags = snippets.getFirebaseArrayData(snap.val().tags || []).toString();
            // });
            $firebaseStorage.getWithCache('product-categories').then(function (val) {
                console.log(val);
                vm.categories = val;
            });

        };vm.getCate();

        vm.addCate = function () {
            vm.categories.push(['Category Name', []])
        };

        vm.removeCate = function (ithCate, ithSub) {
            if (ithSub) {
                vm.categories[ithCate][1].splice(ithSub, 1);
            } else {
                vm.categories.splice(ithCate, 1);
            }
        };

        vm.addItem = function (index, value) {
            if (value) {
                var length = vm.categories[index].length;
                vm.categories[index][1].push(value);
                vm.tempItem = {};
            }
        };

        vm.saveCate = function () {
            if(vm.categories) {
                // $firebase.updateCacheable(path, vm.categories);
                $firebaseStorage.update('product-categories', vm.categories);
            }
        };
    }
})();
