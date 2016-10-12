(function () {
    'use strict';

    angular
        .module('quartz.components')
        .service('sitesService', SitesService)
        .run(run);

    /* @ngInject */
    function SitesService($firebase, $firebaseStorage, snippets, $q, indexService, $lazyLoad,$rootScope) {
        var sitesService = {
            setSite:setSite,
            onReady:onReady,
            siteName:'_default_'
        };

        var def = $q.defer();
        function onReady() {
            return def.promise
        }

        function setSite(siteName, toState) {
            console.log("Initializing " + siteName);
            $rootScope.$broadcast('site:change', siteName);
            _core.util.site.changeTitle(siteName);
            sitesService.siteName = siteName;
            sitesService.config = {};
            sitesService.preLoading = true;

            if (toState.name === 'customPage' || toState.name === 'previewFrame') {
                _core.util.site.getSitePreload().then(function(res){
                    var _res = res || {};
                    console.log(res);
                    $lazyLoad.loadSite(_res).then(function () {
                        sitesService.config = _res;
                        if(_res.title) _core.util.site.changeTitle(_res.title);
                        if(_res.favicon) {
                            var src = _res.favicon;
                            if(_res.favicon.search('//')!==-1){
                                _core.util.site.changeFavicon(src);
                            } else {
                                $firebaseStorage.ref('file-path?path='+src,{isJs:false}).getDownloadURL().then(function(url){
                                    _core.util.site.changeFavicon(url);
                                })
                            }
                        }

                        delete sitesService.preLoading;

                        $rootScope.sitesService = sitesService;
                        def.resolve(sitesService);
                    });
                })
            } else {
                def.resolve(sitesService);
            }

        }

        return sitesService;
    }


    /* @ngInject */
    function run($transitions, $state, sitesService) {
        $transitions.onBefore( { to: '**' }, function(trans, $injector) {
            var toState = trans.to(),
                fromState =trans.from(),
                toParams = trans.params('to'),
                abort;
            sitesService.pageName = toParams.pageName;
            var toSiteName = _core.util.site.siteName;

            if (toSiteName&&fromState.name==='') {

                sitesService.setSite(toSiteName, toState);
            } else if(toSiteName!==''&&toSiteName !==_core.util.site.siteName) {
                //location.reload();
            }
            return abort? false: toState
        });
    }
})();
