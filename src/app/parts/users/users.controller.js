(function () {
    'use strict';

    angular
        .module('app.parts.users')
        .controller('AllUsersController', AllUsersController)
        .controller('SiteUsersController', SiteUsersController)
        .controller('AdminsController', AdminsController);

    /* @ngInject */
    function AllUsersController($firebase, qtNotificationsService, $state, $mdDialog, config) {
        var vm = this;
        vm.paginator = $firebase.pagination('users?type=list');
        vm.paginator.onReorder('name');

        usersCtrl(vm);
    }

    /* @ngInject */
    function SiteUsersController($firebase, $stateParams, qtNotificationsService, $state, $mdDialog, config) {
        var vm = this;
        vm.paginator = $firebase.pagination("site-users?type=list");
        vm.paginator.onReorder('name');

        usersCtrl(vm);
    }

    /* @ngInject */
    function AdminsController($firebase, $stateParams, qtNotificationsService, $state, $mdDialog, config) {
        var vm = this;
        vm.paginator = $firebase.pagination("site-users?type=list",{equalTo:true});
        vm.paginator.onReorder('access.read');
        usersCtrl(vm);

        vm.actions =[
            ['allowWrite', 'USERS.ALLOWWRITE']
        ];
    }

    function usersCtrl(vm) {
        vm.filters = [
            ['User Id', ''],
            ['Name', 'info.name']
        ];

        vm.actions =[
            ['setAsAdmin', 'USERS.SETASADMIN']
        ];

        vm.action=function(action,uid){
          switch(action){
              case 'setAsAdmin':
                  alert('todo');
                  // $firebase.ref('users/list/'+uid+'/access/read@selectedSite').set(true);
                  break;
          }
        };


        vm.onPaginate = function (page, size) { //to prevent this being overwritten
            vm.paginator.get(page, size)
        };

        vm.onReorder = function (orderBy) {
            vm.paginator.onReorder(orderBy);
        };

        vm.getFiltered= function () {
            vm.paginator.onReorder({orderBy:vm.orderBy, equalTo:vm.equalTo,startAt:vm.startAt,endAt:vm.endAt});
        };
    }
})();
