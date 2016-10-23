(function () {
    'use strict';

    angular
        .module('quartz.components')
        .factory('customService', CustomService);
    /* @ngInject */
    function CustomService() {

        var emptyTags = {
                    area: 1,
                    base: 1,
                    basefont: 1,
                    br: 1,
                    col: 1,
                    frame: 1,
                    hr: 1,
                    img: 1,
                    input: 1,
                    isindex: 1,
                    link: 1,
                    meta: 1,
                    param: 1,
                    embed: 1
                };

        function isEmptyTag(name) {
            if (name.charAt(0) == '?') {
                return true;
            }
            if (name.charAt(0) == '/') {
                name = name.substring(1);
            }
            return !!emptyTags[name];
        }


        // var properties = ['options', 'id', 'name', 'type', 'tag', 'layout', 'class', 'style', 'attrs', 'content', 'ctrl', 'ctrlAs'];

        // function convert(val, target, maxLevel, level) {
        //     var _level = level || 1,
        //         res = [];
        //     angular.forEach(val, function (item) {
        //         var _item = {};
        //         _item.cid = Math.random().toString();
        //         angular.forEach(properties, function (property) {
        //             _item[property] = item[property];
        //         });
        //         if (item.css) _item.css = item.css;
        //         res.push(_item);
        //         if (_level < maxLevel) {
        //             target[_item.cid] = convert(item.divs || [], target, maxLevel, _level + 1);
        //         }
        //     });
        //     if (_level === 1) target['root'] = res;
        //     return res
        // }

        // function convertBack(val, cid, styleSheets) {
        //     var result = [],
        //         _cid = cid || 'root';
        //
        //     angular.forEach(val[_cid], function (item) {
        //         var _item = {};
        //         if (item.css && styleSheets && item.name) styleSheets[item.name] = item.css;
        //         // if(item.type==='custom'||item.type==='row'||item.type==='column') item.type='tag';
        //         angular.forEach(properties, function (property) {
        //             if (item[property]) _item[property] = item[property];
        //         });
        //         if (item.cid) _item.divs = convertBack(val, item.cid, styleSheets);
        //         result.push(_item);
        //     });
        //     return result;
        // }

        function buildLayout(layouts){
            var res='';
            angular.forEach(layouts, function (layout, breakpoint) {
                var _breakpoint = breakpoint === 'all' ? '' : '-' + breakpoint;
                angular.forEach(layout, function (value, key) {
                    if (value === null) return;
                    var _value = '="' + value + '" ',
                        _property = key + _breakpoint;
                    switch (key) {
                        case 'flex':
                            if (value === 'flex') _value = ' ';
                            break;
                        case 'flex-offset':
                            break;
                        case 'flex-order':
                            break;
                        case 'layout':
                            break;
                        case 'layout-align':
                            _value = '="' + value.x + ' ' + value.y + '" ';
                            break;
                        default:
                            _property = value ? _property + ' ' : '';
                            _value = ''; //ex layout-fill:true will get layout-fill
                            break;
                    }
                    res += _property + _value;
                })
            });
            return res;
        }
        //the followings only work properly after getAllTemplates() is resolved, remember to add resolve property of this on the state config file.
        function compileTag(item) {
            item = item || {};
            var content,
                tag = item.tag || 'div',
                singleton = isEmptyTag(tag),
                type=item.type;

            if (item.content) {
                content = item.content;
                if (type === 'text') return content;
            }  else if (type === 'tag') { //tag without content;
                content = '<!--include-->'
            } else {
                content = '';
            }

            var res = '';
            if (item.id) {
                res += 'id="' + item.id + '" '
            }
            if (item.layout) {
                res+=buildLayout(item.layout);
            }


            if (item.class) {
                res += ' class="' + item.class + '"';
            }
            if (item.style) {
                res += ' style="' + item.style + '"';
            }
            if (item.attrs) {
                res += ' ' + item.attrs;
            }
            if (item.ctrl) {
                res += ' ng-controller="' + item.ctrl + ' as ' + (item.ctrlAs || 'vm') + '"';
            }

            if (tag.search('/') !== -1) singleton = true;
            content = "<--tag-- --custom-->" + (singleton ? "" : content + "<--endtag-->");
            content = content.replace('--custom--', res);
            content = content.replace('--tag--', tag);
            content = content.replace('--endtag--', '/' + tag);

            return content
        }

        function compile(containers) {
            var html = '';
            angular.forEach(containers, function (container) {
                var rawContainer = compileTag(container);
                html += rawContainer.replace('<!--include-->', container.divs ? compile(container.divs) : '');
            });
            return html;
        }
        function compileAll(containers, canvas){
            var _canvas=angular.copy(canvas)||{};
            _canvas.content ='<!--include-->';
            _canvas.tag='div';
            _canvas.style =  _canvas.style||'';
            return compileTag(_canvas).replace('<!--include-->', compile(containers))
        }

        return {
            compile: compile,
            compileAll:compileAll,
            compileTag: compileTag
        }
    }
})();
