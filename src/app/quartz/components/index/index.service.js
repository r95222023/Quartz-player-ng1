(function () {
    'use strict';

    angular
        .module('quartz.components')
        .service('indexService', IndexService);

    /* @ngInject */
    function IndexService($firebase) {

        ////////////////

        function add(type, id, body) {
            return toQueue("add", type, id, body)
        }

        function update(type, id, body) {
            return toQueue("update", type, id, body)
        }

        function remove(type, id) {
            return toQueue("remove", type, id)
        }

        function toQueue(task, type, id, body) {
            if (!_core.util.site.siteName) {
                console.log("Please select a site");
                return;
            }

            var obj = {
                "_state":"index"
            };
            obj.siteName = _core.util.site.siteName;
            if (angular.isString(task)) obj.task = task;
            if (angular.isString(type)) obj.type = type;
            if (angular.isString(id)) obj.id = id;
            if (body) obj.body = body;

            return $firebase.queryRef("queue-tasks").push(obj);
        }

        return {
            add: add,
            update: update,
            remove: remove
        }
    }
})();
