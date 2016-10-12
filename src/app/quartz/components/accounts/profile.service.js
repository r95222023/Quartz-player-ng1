(function () {
    'use strict';

    angular
        .module('quartz.components')
        .factory('profile', Profile);

    /*@ngInject*/
    function Profile() {
        function getUser(){
            return _core.util.auth.currentUser;
        }
        function getSiteName(){
            return _core.util.site.siteName
        }

        this.updateProfile = function (basic, otherInfo, listData) {
            var user = getUser(),
                siteName=getSiteName();
            user.updateProfile({displayName: basic.name, photoURL: basic.photoURL}).then(function () {
                //
            });
            if(basic.email) {
                user.updateEmail(basic.email);
            }
            if (typeof otherInfo==='object') {
                _core.util.storage.update('site-user?type=detail&siteName='+siteName+'&userId='+user.uid, otherInfo);
            }
            if (typeof listData==='object'){
                var params='type=list&siteName='+siteName+'&userId='+user.uid;
                _core.util.database.update([
                    'site-user?'+params,
                    'root-user?'+params], listData);
            }
        };
        this.changePassword = function (newPassword) {
            var user = getUser();
            return user.updatePassword(newPassword)
        }
    }
})();

