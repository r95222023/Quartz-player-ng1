(function () {
    'use strict';

    angular
        .module('quartz.components')
        .factory('snippets', Snippets);

    /* @ngInject */
    function Snippets() {
        ///////////

        function removeItemFromArray(arr, item) {
            for (var i = arr.length; i--;) {
                if (arr[i] === item) {
                    arr.splice(i, 1);
                }
            }
        }

        function getFirebaseArrayData(data) {
            function toPosInt(key) {
                var n = Number(key);
                return !n % 1 === 0 && n > -1 ? n : false;
            }

            function iterate(data) {
                var arr = [],
                    obj = {},
                    isArray = true;
                angular.forEach(data, function (value, key) {
                    var n = toPosInt(key);
                    if (n !== false) {
                        arr[key] = angular.isObject(value) ? iterate(value) : value;
                    } else {
                        isArray = false;
                        return false;
                    }
                });
                if (isArray === false) angular.forEach(data, function (value, key) {
                    obj[key] = angular.isObject(value) ? iterate(value) : value;
                });
                return isArray ? arr : obj;
            }

            return iterate(data);
        }

        function debounce(func, wait, immediate) {
            var timeout;
            return function () {
                var context = this, args = arguments;
                var later = function () {
                    timeout = null;
                    if (!immediate) func.apply(context, args);
                };
                var callNow = immediate && !timeout;
                clearTimeout(timeout);
                timeout = setTimeout(later, wait);
                if (callNow) func.apply(context, args);
            };
        }

        function rectifyUpdateData(data) {
            var datastring = JSON.stringify(data).replace('undefined', 'null');
            return JSON.parse(datastring);
        }

        function to2dig(num) {
            return num < 10 ? ('0' + num) : (num+'');
        }

        function saveData(data, fileName, type) {
            var a = document.createElement("a"),
                _data=data;
            document.body.appendChild(a);
            a.style = "display: none";
            if(fileName.split('.json')[1]==='') {
                _data = JSON.stringify(data);
            }
            var blob = new Blob([_data], {type: type||"text/plain"}),
                url = window.URL.createObjectURL(blob);
            a.href = url;
            a.download = fileName;
            a.click();
            window.URL.revokeObjectURL(url);
        }

        function downloadURI(uri, name) {
            var link = document.createElement("a");
            if(name) link.download = name;
            link.href = uri;
            link.click();
        }

        //http://stackoverflow.com/questions/6150289/how-to-convert-image-into-base64-string-using-javascript
        function toDataUrl(url, callback) {
            var xhr = new XMLHttpRequest();
            xhr.responseType = 'blob';
            xhr.onload = function() {
                var reader = new FileReader();
                reader.onloadend = function() {
                    callback(reader.result);
                };
                reader.readAsDataURL(xhr.response);
            };
            xhr.open('GET', url);
            xhr.send();
        }

        function iterateFileTree(table, onNode, path) {
            var _path = path||'';
            if (table&&table['_content']) {
                angular.forEach(table['_content'], function (val,key) {
                    if(key!=='__created') iterateFileTree(table[key]||val, onNode, _path+'/'+val.name);
                })
            } else {
                onNode(table, _path)
            }
        }

        return {
            debounce: debounce,
            to2dig: to2dig,
            saveData: saveData,
            downloadURI:downloadURI,
            toDataUrl:toDataUrl,
            getFirebaseArrayData: getFirebaseArrayData,
            removeItemFromArray: removeItemFromArray,
            rectifyUpdateData: rectifyUpdateData,
            iterateFileTree:iterateFileTree
        };
    }
})();
