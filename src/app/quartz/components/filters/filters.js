(function () {
    'use strict';
    angular.module('quartz.components')
        .filter('reverse', /*@ngInject*/ function () {
            return function (items) {
                return items.slice().reverse();
            }
        })
        .filter('relativeTime', /*@ngInject*/ function ($translate, $timeout) {
            function calculateDelta(now, date) {
                return Math.round(Math.abs(now - date) / 1000);
            }

            function relativeTime(date, now) {
                var _now = now || new Date();

                if (!(date instanceof Date)) {
                    date = new Date(date);
                }

                var minute = 60,
                    hour = minute * 60,
                    day = hour * 24,
                    week = day * 7,
                    month = day * 30,
                    year = day * 365,
                    delta = calculateDelta(_now, date),
                    phrase, t = 1;

                if (delta > day && delta < week) {
                    date = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0);
                    delta = calculateDelta(_now, date);
                }

                if (delta < 30) {
                    phrase = 'JUST';
                    t = 0;
                } else if (delta < minute) {
                    phrase = 'SECS';
                    t = delta
                } else if (delta < 2 * minute) {
                    phrase = 'MIN';
                } else if (delta < hour) {
                    phrase = 'MINS';
                    t = Math.floor(delta / minute);
                } else if (Math.floor(delta / hour) === 1) {
                    phrase = 'HOUR';
                } else if (delta < day) {
                    phrase = 'HOURS';
                    t = Math.floor(delta / hour);
                } else if (delta < day * 2) {
                    phrase = 'DAY'
                } else if (delta < week) {
                    phrase = 'DAYS';
                    t = Math.floor(delta / day);
                } else if (Math.floor(delta / week) === 1) {
                    phrase = 'WEEK'
                } else if (delta < month) {
                    phrase = 'WEEKS';
                    t = Math.floor(delta / week);
                } else if (Math.floor(delta / month) === 1) {
                    phrase = 'MONTH'
                } else if (delta < year) {
                    phrase = 'MONTHS';
                    t = Math.floor(delta / month);
                } else if (Math.floor(delta / year) === 1) {
                    phrase = 'YEAR'
                } else {
                    phrase = 'YEARS';
                    t = Math.floor(delta / year);
                }
                return [t, 'DATE.' + phrase];
            }

            var isWaiting = {},
                translations = {};

            $relativeTime.$stateful = true;
            function $relativeTime(input) {
                if (!input) return;
                if (translations[input]) {
                    return translations[input];
                } else {
                    if (!isWaiting[input]) {
                        isWaiting[input] = true;
                        var date = new Date(input);

                        _core.syncTime().then(function (getTime) {
                            var res = relativeTime(date, (new Date(getTime()))),
                                refresh = function (trans) {
                                    $timeout(function () {
                                        translations[input] = (trans.split(' ')[1] || !res[0]) ? trans : res[0] + ' ' + trans;
                                        isWaiting[input] = false;
                                        console.log(translations)
                                    }, 0);
                                };

                            $translate(res[1]).then(refresh, refresh);
                        });
                    }
                }

                return translations[input];
            }

            return $relativeTime;
        })
        // .filter('consecutive', /*@ngInject*/ function ($filter) {
        //     return function (items, input, isReverse) {
        //         var _items = items || [];
        //         var result = angular.copy(_items);
        //
        //         if (typeof input === 'object') {
        //             angular.forEach(input, function (value, key) {
        //                 if (!value && value !== '') return;
        //                 if (value === true) {
        //                     result = $filter('filter')(result, key);
        //                 } else {
        //                     result = $filter('filter')(result, value);
        //                 }
        //             });
        //         } else if (typeof input === 'string') {
        //             input = input.trim();
        //             var keyArray = input.split(' ');
        //             for (var i = 0; i < keyArray.length; i++) {
        //                 result = $filter('filter')(result, keyArray[i]);
        //             }
        //             result = input === '' ? _items : result
        //         }
        //         return isReverse ? result.slice().reverse() : result
        //     }
        // })
        // ////see http://jsfiddle.net/nirmalkumar_86/9F89Q/5/
        // .filter('filterMultiple', /*@ngInject*/ function ($filter) {
        //     return function (items, keyObj) {
        //         var filterObj = {
        //             data: items,
        //             filteredData: [],
        //             applyFilter: function (obj, key) {
        //                 var fData = [];
        //                 if (this.filteredData.length == 0)
        //                     this.filteredData = this.data;
        //                 if (obj) {
        //                     var fObj = {};
        //                     if (!angular.isArray(obj)) {
        //                         fObj[key] = obj;
        //                         fData = fData.concat($filter('filter')(this.filteredData, fObj));
        //                     } else if (angular.isArray(obj)) {
        //                         if (obj.length > 0) {
        //                             for (var i = 0; i < obj.length; i++) {
        //                                 if (angular.isDefined(obj[i])) {
        //                                     fObj[key] = obj[i];
        //                                     fData = fData.concat($filter('filter')(this.filteredData, fObj));
        //                                 }
        //                             }
        //
        //                         }
        //                     }
        //                     if (fData.length > 0) {
        //                         this.filteredData = fData;
        //                     }
        //                 }
        //             }
        //         };
        //
        //         if (keyObj) {
        //             angular.forEach(keyObj, function (obj, key) {
        //                 filterObj.applyFilter(obj, key);
        //             });
        //         }
        //
        //         return filterObj.filteredData;
        //     }
        // })
        .filter('unique', /*@ngInject*/ function () {
            return function (input, key) {
                var unique = {};
                var uniqueList = [];
                for (var i = 0; i < input.length; i++) {
                    if (typeof unique[input[i][key]] == "undefined") {
                        unique[input[i][key]] = "";
                        uniqueList.push(input[i]);
                    }
                }
                return uniqueList;
            };
        })
        //see https://github.com/vpegado/angular-percentage-filter
        .filter('percentage', /*@ngInject*/ function ($window) {
            return function (input, decimals, suffix) {
                decimals = angular.isNumber(decimals) ? decimals : 3;
                suffix = suffix || '%';
                if ($window.isNaN(input)) {
                    return '';
                }
                return Math.round(input * Math.pow(10, decimals + 2)) / Math.pow(10, decimals) + suffix
            };
        });
})(angular);
