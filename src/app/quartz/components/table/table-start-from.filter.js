(function() {
    'use strict';

    angular
        .module('quartz.components')
        .filter('startFrom', startFrom);

    function startFrom() {
        return filterFilter;

        ////////////////

        function filterFilter(input, start) {
            start = +start;
            return input.slice(start);
        }
    }

})();