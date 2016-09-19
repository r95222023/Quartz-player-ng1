(function () {
    'use strict';

    angular
        .module('app.plugins.analytics')
        .factory('analysisService', AnalysisService);

    ////
    /* @ngInject */
    function AnalysisService($filter, $q, $firebase, snippets) {
        var to2dig = snippets.to2dig;
        var DAY = 24 * 60 * 60 * 1000;
        var PERIODS = {
            day: 7 * DAY,
            week: 7 * 7 * DAY,
            month: 7 * 30 * DAY
        };

        function getLast(type, refUrl) {
            var ref = $firebase.queryRef(refUrl).child(type);
            _core.syncTime().then(function (getTime) {
                var nowTime = getTime();
                getRecordSince(ref, type).then(function (res) {
                    var now = new Date();
                    now.setUTCDate(now.getUTCDate());
                    var table = getChartLable(now);
                    var datasets = getChartDatasets(res);
                })
            });
        }

        function getBeginning(nowTime, type) {
            var now = new Date(nowTime);
            switch (type) {
                case 'week':
                    return getMonday(now);
                    break;
                case 'day':
                    return now.setUTCHours(0);
                    break;
                case 'month':
                    return now.setUTCDate(1);
                    break;
            }
        }

        function getMonday(d) {
            var day = d.getDay(),
                diff = d.getDate() - day + (day == 0 ? -6 : 1); // adjust when day is sunday
            return (new Date(d.setDate(diff))).getTime();
        }

        function getChartDatasets(data, lable) {
            var hits = data.hits || {},
                res = {};
            lable.forEach(function (dateKey, index) {
                var hit = hits[dateKey] || {};
                for (var key in hit) {
                    res[key] = res[key] || [];
                    res[key][index] = hit[key];
                }
            });
            return res;
        }

        function getChartLable(now, type, size) {
            var lable = [],
                unit;
            if (type === 'month') {
                var nowDate = new Date(now);
                var month = nowDate.getUTCMonth(),
                    year = nowDate.getUTCFullYear();

                for (var j = 0; j < size; j++) {
                    var currentMonth = month - j,
                        currentYear = year - 2000 + Math.floor(currentMonth / 12);
                    if (currentMonth < 0) {
                        lable[size - j - 1] = getDateKey('month', '', to2dig(currentMonth % 12 + 12), currentYear);
                    } else {
                        lable[size - j - 1] = getDateKey('month', '', to2dig(currentMonth % 12), currentYear);
                    }
                }
                return lable;
            }

            switch (type) {
                case 'day':
                    unit = DAY;
                    break;
                case 'week':
                    unit = 7 * DAY;
                    break;
            }
            nowDate = new Date(now);
            var nowTime =nowDate.getTime();

            for (var i = 0; i < size; i++) {
                lable[i] = getKey(type, nowTime-(size-i-1) * DAY);
            }
        }

        function getRecordSince(recordRef, periodType) {
            var now = new Date();

            var to = now.setUTCDate(now.getUTCDate()) - DAY;
            var from = to - PERIODS[periodType];
            return getRecordInPeriod(recordRef, from, to, periodType);
        }

        function getRecordInPeriod(recordRef, from, to, periodType) {
            return new Promise(function (resolve, reject) {
                recordRef.orderByKey().startAt(getDateKey(from, periodType)).endAt(getDateKey(to, periodType)).once('value').then(function (periodSnap) {
                    var res = Object.assign({
                        hits: periodSnap.val(),
                        type: periodType,
                        from: from,
                        to: to
                    }, getAccumulatedData(periodSnap));
                    resolve(res);
                }).catch(reject);
            });
        }

        function getAccumulatedData(snap) {
            var res = {};
            snap.forEach(function (itemSnap) {
                itemSnap.forEach(function (propSnap) {
                    res[propSnap.key] = res[propSnap.key] ? res[propSnap.key] + propSnap.val() : propSnap.val();
                })
            });
            return res;
        }

        function getKey(periodType, time) {
            var _date = time ? new Date(time) : new Date(),
                year = _date.getUTCFullYear() - 2000,
                month = to2dig(_date.getUTCMonth() + 1),
                date = to2dig(_date.getUTCDate());

            return getDateKey(periodType, date, month, year);
        }

        function getDateKey(periodType, date, month, year) {
            switch (periodType) {
                case 'season':
                    key = year + '' + month;
                    break;
                case 'month':
                    key = year + '' + month;
                    break;
                default:
                    key = year + '' + month + '' + date;
                    break;
            }
            return parseInt(key).toString(36);
        }

        /////

        // function getKey(time) {
        //     var _date = time ? new Date(time) : new Date(),
        //         year = to2dig(_date.getUTCFullYear() - 2000),
        //         month = to2dig(_date.getUTCMonth() + 1),
        //         date = to2dig(_date.getUTCDate()),
        //         key = year + '' + month + '' + date;
        //
        //     return parseInt(key).toString(36);
        // }

        function getData(path, startAt, endAt, opt) {
            var def = $q.defer(),
                ref = $firebase.queryRef(path).orderByKey();

            function resolve(snap) {
                def.resolve(snap.val());
            }

            ref = ref.startAt(getKey(startAt));
            if (endAt) ref = ref.endAt(getKey(endAt));
            ref.once('value', resolve);
            return def.promise;
        }

        function label(key, opt) {
            var time = parseInt(key, 36) + '',
                year = time.substring(0, 2),
                month = time.substring(2, 4),
                date = time.substring(4);
            if (opt.monthOnly) {
                if (date !== '01') {
                    return '';
                } else {
                    return year + '/' + month;
                }
            }
            return year + '/' + month + '/' + date;
        }


        function toChartJS(val, opt) {
            var returnObj = {labels: []},
                _opt = opt || {};
            for (var key in val) {

                returnObj.labels.push(label(key, _opt));
                if (angular.isArray(_opt.items)) {
                    angular.forEach(_opt.items, function (itemName) {
                        returnObj[itemName] = returnObj[itemName] || {};
                        angular.forEach(val[key][itemName] || val[key], function (count, countName) {
                            returnObj[itemName][countName] = returnObj[itemName][countName] || [];
                            returnObj[itemName][countName].push(count);
                        });
                    });
                } else {
                    angular.forEach(val[key] || val[key], function (count, countName) {
                        returnObj[countName] = returnObj[countName] || [];
                        returnObj[countName].push(count);
                    });
                }
            }
            return returnObj;
        }

        function toArray(rawData) {
            var items = {},
                itemsArr = [];
            angular.forEach(rawData, function (val, key) {
                angular.forEach(val, function (countVal, itemName) {
                    if (angular.isObject(countVal)) {
                        angular.forEach(countVal, function (count, property) {
                            items[itemName] = items[itemName] || {};
                            items[itemName][property] = items[itemName][property] ? items[itemName][property] + count : count;
                        })
                    } else {
                        items[itemName] = items[itemName] ? items[itemName] + countVal : countVal;
                    }
                });
            });

            angular.forEach(items, function (val, itemName) {
                var item = {name: itemName};
                if (angular.isObject(val)) {
                    angular.extend(item, val);
                } else {
                    item.count = val;
                }
                itemsArr.push(item);
            });
            return itemsArr;
        }


        function getAnalysis(path, start, end, opt) {
            var def = $q.defer();
            getData(path, start, end, opt).then(function (rawData) {
                def.resolve({
                    getChartData: function (opt) {
                        return toChartJS(rawData, opt)
                    },
                    getRankedArr: function (property, reverse) {
                        return $filter('orderBy')(toArray(rawData), property, reverse === undefined ? true : reverse)
                    }
                });


            });
            return def.promise;
        }

        //
        // function getTopN(rootRefUrl, start, end, opt) {
        //
        //     getData(rootRefUrl, start, end, opt).then(function (rawData) {
        //         var def = $q.defer(),
        //             items = {},
        //             arr = [];
        //         angular.forEach(rawData, function (val, key) {
        //             angular.forEach(val, function (countVal, itemName) {
        //                 if (angular.isObject(countVal)) {
        //                     angular.forEach(countVal, function (count, property) {
        //                         items[itemName] = items[itemName] || {};
        //                         items[itemName][property] = items[itemName][property] ? items[itemName][property] + count : count;
        //                     })
        //                 } else {
        //                     items[itemName] = items[itemName] ? items[itemName] + countVal : countVal;
        //                 }
        //             });
        //         });
        //
        //         angular.forEach(items, function (val, itemName) {
        //             var item = {name: itemName};
        //             if (angular.isObject(val)) {
        //                 angular.extend(item, val);
        //             } else {
        //                 item.count = val;
        //             }
        //             arr.push(item);
        //         });
        //
        //         def.resolve(function (property, reverse) {
        //             return $filter('orderBy')(arr, property, reverse===undefined? true:reverse)
        //         });
        //     });
        //     return def.promise;
        // }


        function getDataInDays(path, days, opt) {
            var def = $q.defer();
            _core.syncTime().then(function (getTime) {
                var nowTime = getTime();
                getAnalysis(path, nowTime - days * 24 * 60 * 60 * 1000, nowTime, opt).then(def.resolve);
            });
            return def.promise;
        }

        function record(path, itemName, eventArr) {
            _core.syncTime().then(function (getTime) {
                var key = getKey(getTime()),
                    _itemName = itemName ? '/' + itemName : '';
                $firebase.queryRef('site-path?path=' + path + '/' + key + _itemName).transaction(function (val) {
                    var _val = val || {};

                    angular.forEach(eventArr, function (eventName) {
                        _val[eventName] = _val[eventName] ? _val[eventName] + 1 : 1;
                    });

                    return _val;
                });
            })
        }


        return {
            getAnalysis: getAnalysis,
            getDataInDays: getDataInDays,
            record: record
        }
    }

})();
