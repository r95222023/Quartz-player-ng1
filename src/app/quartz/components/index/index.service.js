(function () {
    'use strict';

    angular
        .module('quartz.components')
        .service('indexService', IndexService);

    /* @ngInject */
    function IndexService($firebase) {

        ////////////////

        function add(type, id, body, index) {
            return toQueue("add", index || false, type, id, body)
        }

        function update(type, id, body, index) {
            return toQueue("update", index || false, type, id, body)
        }

        function remove(type, id, index) {
            return toQueue("remove", index || false, type, id)
        }

        function toQueue(task, index, type, id, body) {
            if (!index && !_core.util.site.siteName) {
                console.log("Please select a site or enter an index");
                return;
            }

            var obj = {
                "_state":"index"
            };
            obj.index = typeof index==='string' ? index : _core.util.site.siteName;
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
