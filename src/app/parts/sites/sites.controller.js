(function () {
    'use strict';

    angular
        .module('app.parts.sites')
        .controller('MySitesController', MySitesController)
        .controller('AllSitesController', AllSitesController)
        .controller('TemplateCtrl', TemplateCtrl);

    /* @ngInject */
    function TemplateCtrl($stateParams, $firebase, $mdDialog, indexService, sitesService) {
        var vm = this;
        vm.actions = [['applyTemplate', 'SITES.APPLYTEMPLATE'], ['info', 'GENERAL.INFO']];
        if ($stateParams.superAdmin) vm.actions = vm.actions.concat([['edit', 'GENERAL.EDIT'], ['delete', 'GENERAL.DELETE']]);


        //TODO: 改成使用elasticsearch版本
        vm.pagination = $firebase.pagination('templates?type=list');
        //initiate
        vm.pagination.get(1, 10, 'siteName');


        vm.onPaginate = function (page, size) { //to prevent this being overwritten
            vm.pagination.get(page, size)
        };
        vm.onReorder = function (orderBy) {
            vm.pagination.onReorder(orderBy);
        };

        vm.search = function (queryString, cate, subCate, tag) {
            var _cate = cate || null,
                _subCate = subCate || null,
                _tag = tag || null,
                filterMust = [],
                query = {body: {}};
            if (parseInt(_cate) % 1 === 0) {
                filterMust.push({"term": {"category": _cate}});
                if (parseInt(_subCate) % 1 === 0) filterMust.push({"term": {"subcategory": _subCate}});
            }
            if (_tag) {
                var tagTerm = {};
                tagTerm['tags_dot_' + tag] = 1;
                filterMust.push({term: tagTerm});
            }
            query.body.query = {
                "filtered": {
                    "filter": {
                        "bool": {
                            "must": filterMust.length ? filterMust : null
                        }
                    }
                }
            };
            if (angular.isString(queryString) && queryString.trim() !== '') {
                var query_string = {
                    "fields": ["itemName", "description"],
                    "query": vm.queryString,
                    "use_dis_max": true
                };
            }
            if (query.body.query && query.body.query.filtered) {
                query.body.query.filtered.query = {
                    query_string: query_string
                };
            } else {
                query.body.query.query_string = query_string;
            }
            vm.paginator = $elasticSearch.pagination('main', 'templates', query);
            vm.paginator.get(1, 10, 'siteName');
        };

        vm.deleteTemplate = function (site) {
            var confirm = $mdDialog.confirm()
                    .title('Delete this template?')
                    // .textContent('Delete the site?')
                    .ariaLabel('Would you like to delete this template?')
                    .ok('Confirm')
                    .cancel('Cancel'),
                siteName = site.siteName;
            $mdDialog.show(confirm).then(function () {
                $firebase.update(['template?type=list', 'template?type=detail'], {'@all': null}, {id: siteName});
                indexService.remove('template', siteName, 'main')
            });
        };

        // vm.getMySites = function () {
        //     if (authData) $firebase.ref('users/detail/' + authData.uid + '/sites').once('value', function (snap) {
        //         vm.mysites = snap.val();
        //     })
        // };
        //
        vm.applyTemplate = function (templateName, siteName) {
            var _siteName = siteName || sitesService.siteName,
                confirm = $mdDialog.confirm()
                    .title('Apply ' + templateName + ' to ' + _siteName + '?')
                    .textContent('All content in ' + _siteName + ' will be overwritten by the template?')
                    .ariaLabel('Would you like to apply this ' + templateName + ' to ' + _siteName + '?')
                    .ok('Confirm')
                    .cancel('Cancel');
            $mdDialog.show(confirm).then(function () {
                sitesService.moveSite(templateName, _siteName);
                // $firebase.ref('templates/detail/' + templateName).once('value', function (snap) {
                //     var val = snap.val();
                //     if(val) $firebase.ref('sites/detail/' + _siteName).set(val);
                // })
            });
        };

        vm.closeDialog = function () {
            $mdDialog.cancel();
        };

        vm.action = function (action, site, ev) {
            switch (action) {
                case 'edit':
                    break;
                case 'info':
                    break;
                case 'delete':
                    deleteTemplate(site);
                    break;
            }
        };
    }

    /* @ngInject */
    function MySitesController($firebase, $timeout, authData, $state, sitesService, qtNotificationsService, $mdDialog) {
        var vm = this;
        if (!authData){return $state.go('authentication.login')}

        vm.newSiteName = '';


        $firebase.queryRef('my-sites?uid=' + authData.uid).on('value', function (snap) {
            $timeout(function () {
                vm.sitesArray = snap.val();
            }, 0);
        });

        vm.showTemplate = function ($event) {
            var parentEl = angular.element(document.body);
            $mdDialog.show({
                parent: parentEl,
                // contentElement: '#template-list',
                templateUrl: 'app/parts/sites/template-dialog.html',
                targetEvent: $event,
                fullscreen: true,
                locals: {
                    site: vm.selectedSite
                },
                controller: 'TemplateCtrl',
                clickOutsideToClose: true,
                controllerAs: 'vm'
            });
        };

        vm.addSite = function () {
            $firebase.queryRef('site?type=list&siteName=' + vm.newSiteName).child('createdTime').once('value', function (snap) {
                if (snap.val() === null) {
                    sitesService.addSite(vm.newSiteName, authData.uid);
                } else {
                    alert('This name has been used!');
                    $timeout(function () {
                        vm.newSiteName = "";
                    }, 0);
                }
            });
        };

        vm.deleteSite = function (site) {
            var confirm = $mdDialog.confirm()
                .title('Delete the site?')
                // .textContent('Delete the site?')
                .ariaLabel('Would you like to delete the site?')
                .ok('Confirm')
                .cancel('Cancel');
            $mdDialog.show(confirm).then(function () {
                sitesService.removeSite(site.siteName, authData.uid);
                //
                // vm.sitesArray.$remove(site).then(function () {
                //     $firebase.update('sites', ['detail/' + site.siteName, 'list/' + site.siteName], {
                //         "@all": null
                //     })
                // });
            });

        };

    }

    /* @ngInject */
    function AllSitesController($firebase, authData, $state, sitesService, qtNotificationsService, $mdDialog, indexService) {
        var vm = this;
        if (!authData) $state.go('authentication.login');


        vm.actions = [['configure', 'SITES.CONFIGURE'], ['page', 'SITES.SHOWPAGE'], ['widget', 'SITES.SHOWWIDGET'], ['user', 'SITES.SHOWUSER'], ['product', 'SITES.SHOWPRODUCT'], ['order', 'SITES.SHOWORDER'], ['setAsTemplate', 'SITES.SETASTEMPLATE'], ['delete', 'GENERAL.DELETE']];
        vm.action = function (action, site, ev) {
            var params = {siteName: site.siteName};
            switch (action) {
                case 'configure':
                    $state.go('quartz.admin-default.site-configure', params);
                    break;
                case 'page':
                    $state.go('quartz.admin-default.pageManager', params);
                    break;
                case 'widget':
                    $state.go('quartz.admin-default.widgetManager', params);
                    break;
                case 'user':
                    $state.go('quartz.admin-default.siteusers', params);
                    break;
                case 'product':
                    $state.go('quartz.admin-default.productManager', params);
                    break;
                case 'order':
                    $state.go('quartz.admin-default.orderHistory', params);
                    break;
                case 'setAsTemplate':
                    setAsTemplate(site);
                    break;
                case 'delete':
                    vm.deleteSite(site);
                    break;
            }
        };
        vm.paginator = $firebase.pagination('sites?type=list');
        //initiate
        vm.paginator.onReorder('name');

        vm.onPaginate = function (page, size) { //to prevent this being overwritten
            vm.paginator.get(page, size)
        };
        vm.onReorder = function (orderBy) {
            vm.paginator.onReorder(orderBy);
        };

        function setAsTemplate(site) {
            var confirm = $mdDialog.confirm()
                    .title('Set this site as template?')
                    // .textContent('Delete this site?')
                    .ariaLabel('Would you like to set this site as template?')
                    .ok('Confirm')
                    .cancel('Cancel'),
                siteName = site.siteName;
            $mdDialog.show(confirm).then(function () {
                // $firebase.ref('sites/list/' + siteName).once('value', function (siteSnap) {
                //     var val = siteSnap.val();
                //     $firebase.ref('templates/list/' + siteName).update(val);
                //     indexService.update('template', siteName, val, 'main');
                // });
                $firebase.queryRef('site?type=list&siteName=' + siteName).once('value', function (siteSnap) {
                    var val = siteSnap.val();
                    $firebase.update('template?type=list&id=' + siteName, val);
                    indexService.update('template', siteName, val, 'main');
                });
            });
        }

        vm.deleteSite = function (site) {
            var confirm = $mdDialog.confirm()
                .title('Delete this site?')
                // .textContent('Delete this site?')
                .ariaLabel('Would you like to delete the site?')
                .ok('Confirm')
                .cancel('Cancel');
            $mdDialog.show(confirm).then(function () {
                sitesService.removeSite(site.siteName, site.author);

                // $firebase.ref('users/detail/' + site.author + '/sites').orderByChild('siteName').equalTo(site.siteName).once('child_added', function (snap) {
                //     snap.ref.set(null);
                // });
                // $firebase.update(['site?type=list', 'site?type=detail'], {
                //     "@all": null
                // },{siteName:site.siteName});
            });

        };

    }
})();
