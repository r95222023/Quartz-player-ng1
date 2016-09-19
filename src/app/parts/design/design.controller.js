(function () {
    'use strict';

    angular
        .module('app.parts.design')
        .controller('PageManagerController', PageManagerController)
        .controller('WidgetManagerController', WidgetManagerController)
        .controller('PageEditorController', PageEditorController)
        .controller('WidgetEditorController', WidgetEditorController)
        .controller('BasicApiController', BasicApiController)
        .controller('CustomPageController', CustomPageController)
        .controller('PreviewFrameController', PreviewFrameController);


    /* @ngInject */
    function PageManagerController($firebase, $firebaseStorage, qtNotificationsService, $state, $stateParams, $mdDialog, $timeout) {
        var vm = this;

        //Todo: 改名 刪除
        vm.actions = [['view', 'GENERAL.VIEW'], ['edit', 'GENERAL.EDIT'], ['setPrivate', 'GENERAL.SETPRIVATE'], ['setPublic', 'GENERAL.SETPUBLIC'], ['delete', 'GENERAL.DELETE']];
        vm.action = function (action, id, name) {
            switch (action) {
                case 'view':
                    $state.go('customPage', {id: id, pageName: name});
                    break;
                case 'edit':
                    $state.go('pageEditor', {id: id, pageName: name});
                    break;
                case 'setPrivate':
                    $firebase.update(['page-property?type=list', 'page-property?type=detail'], {
                        "@all": true
                    }, {property:'private',id:id});
                    break;
                case 'setPublic':
                    $firebase.update(['page-property?type=list', 'page-property?type=detail'], {
                        "@all": null
                    }, {property:'private',id:id});
                    break;
                case 'delete':
                    var confirm = $mdDialog.confirm()
                        .title('Delete this page?')
                        .ariaLabel('Would you like to delete this page?')
                        .ok('Confirm')
                        .cancel('Cancel');

                    $mdDialog.show(confirm).then(function () {
                        $firebase.update(['page?type=list', 'page?type=detail'], {
                            "@all": null
                        },{id:id});
                        $firebaseStorage.remove('page?type=detail&id=' + name);
                    });

                    break;
            }
        };
        vm.paginator = $firebase.pagination('pages?type=list',{}, function(){$timeout(function(){},0)});
        //initiate
        vm.paginator.size = 25;
        vm.paginator.onReorder('name');

        vm.onPaginate = function (page, size) { //to prevent this being overwritten
            vm.paginator.get(page, size)
        };
        vm.onReorder = function (orderBy) {
            vm.paginator.onReorder(orderBy);
        }
    }

    /* @ngInject */
    function WidgetManagerController($firebase, $state, $mdDialog) {
        var vm = this;

        vm.actions = [['edit', 'GENERAL.EDIT'], ['delete', 'GENERAL.DELETE']];
        vm.action = function (action, id, name) {
            console.log(action, id, name);
            switch (action) {
                case 'edit':
                    $state.go('widgetEditor', {id: id, widgetName: name});
                    break;
                case 'delete':
                    var confirm = $mdDialog.confirm()
                        .title('Delete this widget?')
                        .ariaLabel('Would you like to delete this widget?')
                        .ok('Confirm')
                        .cancel('Cancel');

                    $mdDialog.show(confirm).then(function () {
                        $firebase.update(['widget?type=list', 'widget?type=detail'], {
                            "@all": null
                        },{id:id});
                    });

                    break;
            }
        };
        vm.paginator = $firebase.pagination('widgets?type=list');
        //initiate
        vm.paginator.onReorder('name');

        vm.onPaginate = function (page, size) { //to prevent this being overwritten
            vm.paginator.get(page, size)
        };
        vm.onReorder = function (orderBy) {
            vm.paginator.onReorder(orderBy);
        }
    }

    /* @ngInject */
    function PageEditorController(pageData, $mdDialog, customService, $stateParams, $scope, dragulaService, $timeout, siteDesign) {
        var vm = this, frame,frameData = angular.copy(pageData)||{};
        window.initPreviewFrame = function () {
            if(vm.fullPagePreview){
                frame = window.frames['preview-full-frame']
            } else {
                frame = window.frames['preview-frame']
            }
            frame.refreshPreview(frameData, 'init');
        };

        vm.refreshPreview =function(){
            var styleSheets = {},
                reload,
                content = customService.convertBack($scope.containers, 'root', styleSheets),
                css = vm.css || '' + vm.buildCss(styleSheets) || '';
            frameData = angular.extend(frameData,{
                "css": css || '',
                "content": content
            });
            if(vm.canvas) frameData.canvas=vm.canvas;
            if(angular.isArray(vm.sources)) {
                frameData.sources=frameData.sources||[];
                if(JSON.stringify(vm.sources)!==JSON.stringify(frameData.sources)){
                    reload=true;
                    frameData.sources = angular.copy(vm.sources);
                }
            }
            if(vm.js&&vm.js.trim()){
                frameData.js = vm.js.trim();
            }
            if(reload){
                console.log('Reloading preview');
                frame.location.reload(true);
            } else{
                frame.refreshPreview(frameData);
            }
        };

        vm.previewUrl ='#!/preview/'+ $stateParams.siteName+'/'+$stateParams.pageName+'/';
        vm.pageName = $stateParams.pageName || ('New Page-' + (new Date()).getTime());

        vm.previewPanel = false;


        vm.selectedSettingsTab = 1;
        vm.sources = pageData&&pageData.sources || [];
        vm.showSettinsTab = function (ev) {
            $mdDialog.show({
                controller: SettingsCtrl,
                templateUrl: 'app/parts/design/editor-settings-dialog.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose: true
            });
        };

        /* @ngInject */
        function SettingsCtrl($scope, $mdDialog) {
            $scope.vm = vm;
            $scope.hide = function () {
                $mdDialog.hide();
            };
            $scope.cancel = function () {
                $mdDialog.cancel();
            };
            $scope.addSource = function (input) {
                vm.sources.push({src:(input || '').replace(/\s+/g, '')});
            };
            $scope.removeSource = function (index) {
                vm.sources.splice(index, 1);
            };
        }


        var widgetSource = customService.items,
            containerSource = customService.containers;

        var dragula = new Dragula(containerSource, containerSource, widgetSource, {
            scope: $scope,
            dragulaService: dragulaService,
            $timeout: $timeout
        }, {
            onDrop: function () {
                vm.compile();
            }
        });

        $scope.initDragula = dragula.init.bind(dragula);

        siteDesign.ctr(vm, $scope, dragula, 'page', pageData);
        vm.setPreviewScale(0.5);
    }

    /* @ngInject */
    function WidgetEditorController(widgetData, customService, $stateParams, $scope, dragulaService, $timeout, siteDesign) {
        var vm = this;

        vm.widgetName = $stateParams.widgetName || ('New Widget-' + (new Date()).getTime());
        var elementSource = customService.items,
            containerSource = customService.containers;

        var dragula = new Dragula(containerSource, containerSource, elementSource, {
            scope: $scope,
            dragulaService: dragulaService,
            $timeout: $timeout
        }, {
            // maxRoot: 1,
            onDrop: function () {
                vm.compile();
            }
        });
        $scope.initDragula = dragula.init.bind(dragula);
        vm.previewPanel = true;

        siteDesign.ctr(vm, $scope, dragula, 'widget', widgetData);
    }

    /* @ngInject */
    function BasicApiController(articleProduct, $auth, $firebaseStorage, $scope, $mdSidenav,$state, $stateParams) {
        $scope.$mdSidenav = $mdSidenav;
        $scope.$get = $firebaseStorage.get;
        $scope.$getProduct = articleProduct.getProduct;
        $scope.$getArticle = articleProduct.getArticle;
        $scope.$queryList = articleProduct.queryList;
        $scope.$queryProduct = articleProduct.queryProduct;
        $scope.$queryArticle = articleProduct.queryArticle;
        $scope.$getCate = articleProduct.getCate;
        $scope.$getCateCrumbs = articleProduct.getCateCrumbs;
        $scope.$cate = articleProduct.cate;
        $scope.$auth = $auth;
        $scope.$login = function(pageName, state){
            var toParams = {
                pageName: pageName || $stateParams.pageName,
                params: JSON.stringify($stateParams.params)
            };
            if($state.name!=='customPage'){
                toParams.stateName=$state.name;
            }
            $state.go('authentication.login', toParams);
        };
        $scope.params = JSON.parse($stateParams.params || '{}');
        if (!$scope.$go) $scope.$go = function (pageName, params) {
            var _params = {};
            if (angular.isObject(params)) angular.extend(_params, params);
            console.log(params);
            console.log({pageName: pageName, params: JSON.stringify(_params)});
        };
    }

    /* @ngInject */
    function CustomPageController(pageData, qtSettings, $scope, customService, $stateParams, $timeout, $state) {
        var customPage = this;
        // window.parent.setUpPreviewFrame();

        window.previewRefresh = function (data) {
            console.log(data);
        };


        $scope.$go = function (pageName, params) {
            var _params = {};
            if (angular.isObject(params)) angular.extend(_params, params);
            $state.go('customPage', {
                pageName: pageName || $stateParams.pageName,
                params: JSON.stringify(_params)
            });
        };

        angular.extend(customPage, $stateParams);
        customPage.settingsGroups = qtSettings.custom;


        setModelData(pageData, pageData.cssKey);

        function setModelData(val, key) {
            $timeout(function () {
                customPage.pageData = val;
                customPage.html = customService.compileAll(val.content);
                customPage.js = val.js;
                customPage.sources = val.sources;
            }, 0);
        }
    }

    /* @ngInject */
    function PreviewFrameController(qtSettings, $lazyLoad, $scope, customService, $stateParams, $timeout, $state) {
        var customPage = this;

        angular.extend(customPage, $stateParams);
        customPage.settingsGroups = qtSettings.custom;


        window.refreshPreview = function (data, type) {
            switch (type) {
                case 'init':
                    $lazyLoad.load(data, $stateParams.pageName).then(function (pageData) {
                        setModelData(pageData);
                    });
                    break;
                default:
                    setModelData(data);
                    break;
            }
        };
        window.parent.initPreviewFrame();

        function setModelData(val) {
            $timeout(function () {
                customPage.pageData = val;
                customPage.html = customService.compileAll(val.content);
                customPage.js = val.js;
                customPage.sources = val.sources;
            }, 0);
        }
    }

    ////////Classes

    function Dragula(containerSource, subContainerSource, subSubContainerSource, services, options) {
        this.options = options || {};
        this.scope = services.scope;
        this.$timeout = services.$timeout;
        this.dragulaService = services.dragulaService;
        this.containerSource = containerSource;
        this.subContainerSource = subContainerSource;
        this.subSubContainerSource = subSubContainerSource;

        this.scope.containers = {root: []};
        this.scope.containerSource = this.getSource(containerSource);
        this.scope.subContainerSource = this.getSource(subContainerSource);
        this.scope.subSubContainerSource = this.getSource(subSubContainerSource);

        this.steps = {
            index: -1,
            action: '',
            cache: []
        };

        var self = this;
        self.scope.$watch('containers', function () {
            registerStep();
        }, true);

        function registerStep() {
            var index = self.steps['index'],
                action = self.steps['action'],
                lastIndex = self.steps['cache'].length - 1;
            if (action === '') {
                if (index !== lastIndex) {
                    self.steps['cache'].splice(index + 1, lastIndex - index, angular.copy(self.scope.containers));
                } else {
                    self.steps['cache'].push(angular.copy(self.scope.containers));
                }
                self.steps['index'] = self.steps['cache'].length - 1;
                if (self.steps['cache'].length > 20) {
                    self.steps['index']--;
                    self.steps['cache'].shift()
                }
            } else {
                self.steps['action'] = '';
            }
        }

        this.undo = function () {
            if (self.steps['index'] < 1 || self.steps.cache.length < 2) return;
            var resumed = self.steps['cache'][self.steps['index'] - 1];
            if (resumed.root.length < 1) return;
            self.steps['index']--;
            self.steps['action'] = 'undo';
            self.scope.containers = resumed;
        };
        this.redo = function () {
            if (self.steps['index'] === self.steps['cache'].length - 1) return;
            self.steps['index']++;
            var resumed = self.steps['cache'][self.steps['index']];
            self.steps['action'] = 'redo';
            self.scope.containers = resumed;
        }
    }

    Dragula.prototype = {
        init: function () {
            var self = this;

            function onDrop() {
                if (angular.isFunction(self.options.onDrop)) {
                    self.options.onDrop()
                }
            }


            self.dragulaService.options(self.scope, 'drag-container-root', {
                moves: function (el, container, handle) {
                    return handle.classList.contains('root-handle');
                },
                accepts: function (el, target, source, sibling) {
                    return !target.classList.contains('nodrop');
                }
            });
            self.dragulaService.options(self.scope, 'drag-container-lv1', {
                moves: function (el, container, handle) {
                    return handle.classList.contains('lv1-handle');
                },
                accepts: function (el, target, source, sibling) {
                    return !target.classList.contains('nodrop');
                }
            });
            self.dragulaService.options(self.scope, 'drag-container-lv2', {
                moves: function (el, container, handle) {
                    return handle.classList.contains('lv2-handle');
                },
                accepts: function (el, target, source, sibling) {
                    return !target.classList.contains('nodrop');
                }
            });
            self.dragRootOff = self.scope.$on('drag-container-root.drop-model', function (el, target, source) {
                if (self.options.maxRoot && self.scope.containers['root'].length > self.options.maxRoot) self.scope.containers.root.pop();
                self.scope.containerSource = self.getSource(self.containerSource);
                onDrop();
            });
            self.dragLv1Off = self.scope.$on('drag-container-lv1.drop-model', function (el, source, target) {
                if (source.parent().context.className.indexOf('subContainerSource') !== -1 || (target.context.firstElementChild && target.context.firstElementChild.className.indexOf('subContainerSource') !== -1)) {
                    //only happen when user drag a subcontainer from source to the container
                    self.scope.subContainerSource = self.getSource(self.subContainerSource);
                } else if (source.parent()[0] && source.parent()[0]['$$hashKey'] === target[0]['$$hashKey']) {
                    //this happens only when two subcontainers are swapped in the same container
                } else {
                    //this happens only when one subcontainer is moved from one container to another
                    self.resetDragula();
                }
                onDrop();
            });
            self.dragLv2Off = self.scope.$on('drag-container-lv2.drop-model', function (el, target, source) {
                self.scope.subSubContainerSource = self.getSource(self.subSubContainerSource);
                onDrop();
            });
        },
        resetDragula: function () {
            var self = this;
            self.dragulaService.destroy(self.scope, 'drag-container-root');
            self.dragulaService.destroy(self.scope, 'drag-container-lv1');
            self.dragulaService.destroy(self.scope, 'drag-container-lv2');
            self.dragRootOff();
            self.dragLv1Off();
            self.dragLv2Off();
            self.scope.destroyDragula = true;
            self.$timeout(function () {
                self.scope.destroyDragula = false;
            }, 0);
        },
        getSource: function (source) {
            var copy = [],
                self = this;

            angular.forEach(source, function (item) {
                var cid = Math.random().toString();
                self.scope.containers[cid] = [];
                copy.push(angular.extend({}, item, {cid: cid}))
            });
            return copy;
        }
    };
})();
