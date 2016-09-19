(function () {
    'use strict';

    angular
        .module('quartz.components')
        .service('sitesService', SitesService)
        .run(run);

    /* @ngInject */
    function SitesService($rootScope, $firebase, $firebaseStorage, snippets, $q, indexService) {
        function rectifySiteName(siteName) {
            return siteName.trim().replace(".", "_")
        }


        function addSite(newSiteName, uid) {
            var _newSiteName = rectifySiteName(newSiteName);
            $firebase.queryRef('my-sites?uid='+uid).push({
                siteName: _newSiteName,
                createdTime: firebase.database.ServerValue.TIMESTAMP
            }).then(function () {
                $firebase.update(['site?type=detail', 'site?type=list'], {
                    //"toDetail@0": "test",
                    //"toList@1": "test",
                    "author@1": uid,
                    "siteName@1": _newSiteName,
                    "createdTime": firebase.database.ServerValue.TIMESTAMP
                },{siteName:_newSiteName});
                indexService.add("record", "created", {siteName: _newSiteName}, _newSiteName);
            });
        }

        function moveSite(from, to, removeOrigin) {
            var def = $q.defer(),
                self=this,
                fromRootPath = 'sites/detail/' + from + '/',
                toRootPath = 'sites/detail/' + (to||self.siteName) + '/',
                _to=to||self.siteName,
                typeArr = ['products', 'articles', 'pages', 'widgets'],
                fileNameOpt = {products: 'itemId', articles: 'id'},
                typePromises = {};
            angular.forEach(typeArr, function (type) {
                typePromises[type] = $firebase.getFileTableFromList(type + '?type=list&siteName='+from, {fileName: fileNameOpt[type] || 'name'})
            });
            typePromises.files = $firebase.queryRef('files?siteName='+from).once('value');

            $q.all(typePromises).then(function (typeContent) {
                var copyPromises = [],
                    onNode = function (table, path) {
                        copyPromises.push($firebaseStorage.copy(fromRootPath + path, toRootPath + path))
                    };
                //articles, products, widgets, pages
                console.log(typeContent);
                angular.forEach(typeArr, function (type) {
                    snippets.iterateFileTree({'_content': typeContent[type]}, onNode, type + '/detail');
                    copyPromises.push($firebase.copy(type + '?type=list&siteName='+from, type + '?type=list&siteName='+_to));
                    copyPromises.push($firebase.copy(type + '?type=config&siteName='+from, type + '?type=config&siteName='+_to));
                });
                //files
                snippets.iterateFileTree(typeContent.files.val(), onNode, 'files');
                copyPromises.push($firebase.copy('files?siteName='+from, 'files?siteName='+_to));
                //config
                copyPromises.push($firebaseStorage.copy(fromRootPath + 'config/preload', toRootPath + 'config/preload'));
                $q.all(copyPromises).then(def.resolve);
            });
            return def.promise;
        }

        function removeSite(siteName, uid) {
            $firebase.queryRef('my-sites?uid='+uid).orderByChild('siteName').equalTo(siteName).once('child_added', function (snap) {
                snap.ref.set(null);
            });
            $firebase.update(['site?type=detail', 'site?type=list'], {
                "@all": null
            },{siteName:siteName});
            indexService.remove(false, false, siteName);
        }

        var title='TBD';
        this.setTitle = function(newTitle){
            document.title = newTitle
        };

        this.siteName = 'default';
        this.addSite=addSite;
        this.moveSite=moveSite;
        this.removeSite=removeSite;
    }


    /* @ngInject */
    function run($q, $window, $lazyLoad, config, $rootScope,$transitions, $state, qtMenu, sitesService, $firebaseStorage) {

        function setSite(siteName, toState, reset) {
            _core.util.setSiteName(siteName);
            if (sitesService.siteName !== siteName || reset) {

                console.log("Initializing " + siteName);
                $rootScope.$broadcast('site:change', siteName);
                sitesService.setTitle(siteName);

                sitesService.siteName = siteName;
                sitesService.config = {};
                sitesService.preLoading = true;

                var def = $q.defer();
                sitesService.onReady = function () {
                    return def.promise
                };
                if (toState.name === 'customPage' || toState.name === 'previewFrame') {
                    if (sitesService.config && sitesService.config.sources) {
                        console.log('reloading');
                        $window.location.reload();
                    }
                    getPreload(def);
                } else {
                    def.resolve(sitesService);
                }
            }

        }

        function getPreload(def) {
            $firebaseStorage.getWithCache('site-config-preload').then(function (res) {
                var _res = res || {};
                $lazyLoad.loadSite(_res).then(function () {
                    sitesService.config = _res;
                    if(_res.title) _core.siteUtil.changeTitle(_res.title);
                    if(_res.favicon) {
                        var src = _res.favicon;
                        if(_res.favicon.search('://')!==-1){
                            _core.siteUtil.changeFavicon(src);
                        } else {
                            $firebaseStorage.ref('file-path?path='+src,{isJs:false}).getDownloadURL().then(function(url){
                                _core.siteUtil.changeFavicon(url);
                            })
                        }
                    }

                    delete sitesService.preLoading;

                    $rootScope.sitesService = sitesService;
                    def.resolve(sitesService);
                });
            });
        }

        function isDashboard(state) {
            var name = state.name;
            return name !== '' && (name.search('.admin') !== -1 || name === 'pageEditor' || name === 'widgetEditor');
        }

        function isCustomPage(state) {
            return state.name.search('customPage') !== -1;
        }

        if (!config.standAlone) {
            $transitions.onBefore( { to: '**' }, function(trans, $injector) {
                var toState = trans.to(),
                    fromState = trans.from(),
                    toParams = trans.params('to');
                if (toParams.siteName) {
                    setSite(toParams.siteName, toState);
                } else if (toParams.siteName === '' && _core.util.siteName) {
                    $state.go(toState.name, Object.assign(toParams, {siteName: _core.util.siteName}));
                }
                /*else if (toParams.siteName === '' && !$firebase.databases.selectedSite&&$auth.currentUser) {
                 redirect('quartz.admin-default.mysites');
                 }*/


                //from dashboard to selected page
                if (isDashboard(fromState) && isCustomPage(toState)) {
                    setSite(toParams.siteName, toState, true);
                }
                //from selected page to dashboard
                else if (isCustomPage(fromState) && isDashboard(toState)) {
                    console.log('reloading');

                    $window.location.reload();
                }

                sitesService.pageName = toParams.pageName;

                if (_core.util.siteName) {
                    var siteName = _core.util.siteName;

                    qtMenu.removeGroup("siteSelected");
                    qtMenu.addGroup("siteSelected", {siteName: siteName});
                }
            });
        } else {
            qtMenu.addGroup("siteSelected");
        }
    }
})();
