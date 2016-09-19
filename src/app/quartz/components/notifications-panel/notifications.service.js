(function () {
    'use strict';

    angular
        .module('quartz.components')
        .factory('qtNotificationsService', NotificationsService);

    /* @ngInject */
    function NotificationsService($auth, $firebase) {
        var notifications = {},
            ref,
            callback;
        $auth.onAuthStateChanged(function (user) {
            if (!user) {
                notifications = {};
                return;
            }
            if (ref && callback) {
                ref.off('value', callback)
            }
            ref = $firebase.queryRef('notifications?uid='+user.uid);
            callback = function (snap) {
                notifications = snap.val();
            };

            ref.on('value', callback);
        });

        function getNotification() {
            return notifications;
        }

        function addNotification(groupName, notification) {
            if (ref && callback) ref.child(groupName).push(notification);
        }

        function removeNotification(groupName, nid) {
            if (ref && callback) ref.child(groupName).child(nid).remove();
        }

        function getSubTotal() {
            var total = 0;
            angular.forEach(notifications, function (group) {
                angular.forEach(group, function () {
                    total += 1
                })
            });
            return total;
        }

        return {
            getNotification: getNotification,
            addNotification: addNotification,
            removeNotification: removeNotification,
            getSubTotal: getSubTotal
        }
    }
})();
