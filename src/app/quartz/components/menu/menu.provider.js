(function () {
    'use strict';

    angular
        .module('quartz.components')
        .provider('qtMenu', menuProvider);


    /* @ngInject */
    function menuProvider() {
        // Provider
        var menu = [],
            groups = {};

        this.addMenu = addMenu;
        this.removeMenu = removeMenu;
        this.addMenuToGroup = addMenuToGroup;
        this.removeMenuFromGroup = removeMenuFromGroup;
        this.addGroup = addGroup;
        this.removeGroup = removeGroup;

        function addMenu(item) {
            //add a divider before the item if the priority of the item is 2.1, 3.1, 4.1...
            if (item.priority > 2 && (item.priority - Math.floor(item.priority)) < 0.11) menu.push({
                type: 'divider',
                priority: Math.floor(item.priority) + 0.1
            });

            menu.push(item);
        }

        function removeMenu(state, params) {
            findAndDestroyMenu(menu, state, params);
        }

        function addMenuToGroup(groupName, item) {
            if (!angular.isArray(groups[groupName])) groups[groupName] = [];
            groups[groupName].push(item);
        }

        function removeMenuFromGroup(groupName, state, params) {
            findAndDestroyMenu(groups[groupName], state, params);
        }

        function addGroup(groupName, params) {
            function iter(item){
                if(item.type==='dropdown'&&angular.isArray(item.children)){
                    angular.forEach(item.children, iter);
                } else if(item.type==='link'){
                    if(item.params) angular.extend(item.params, params);
                }
            }
            if (angular.isArray(groups[groupName])) angular.forEach(groups[groupName], function (item) {
                if(angular.isObject(params)){
                    iter(item);
                }
                addMenu(item);
            })
        }

        function removeGroup(groupName) {
            if (angular.isArray(groups[groupName])) angular.forEach(groups[groupName], function (item) {
                removeMenu(item.name);
            })
        }

        function findAndDestroyMenu(menu, state, params) {
            if (menu instanceof Array) {
                for (var i = 0; i < menu.length; i++) {
                    if (menu[i].state === state && menu[i].params === params || menu[i].name === state) {
                        menu.splice(i, 1);
                    }
                    else if (angular.isDefined(menu[i].children)) {
                        findAndDestroyMenu(menu[i].children, state, params);
                    }
                }
            }
        }

        // Service
        this.$get = function () {
            return {
                menu: menu,
                addMenu: addMenu,
                removeMenu: removeMenu,
                addMenuToGroup:addMenuToGroup,
                removeMenuFromGroup:removeMenuFromGroup,
                addGroup:addGroup,
                removeGroup:removeGroup
            };
        };
    }
})();

