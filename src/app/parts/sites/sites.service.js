// (function() {
//     'use strict';
//
//     angular
//         .module('app.parts.sites')
//         .service('sitesService', SitesService);
//
//     /* @ngInject */
//     function SitesService($firebase, $firebaseStorage,snippets, $q, indexService){
//
//         function rectifySiteName(siteName){
//             return siteName.trim().replace(".","_")
//         }
//
//
//         function addSite(newSiteName, uid){
//             var _newSiteName = rectifySiteName(newSiteName);
//             $firebase.ref('users/detail/'+uid+'/sites').push({
//                 siteName: _newSiteName,
//                 createdTime: firebase.database.ServerValue.TIMESTAMP
//             }).then(function(){
//                 $firebase.update('sites', ['detail/' + _newSiteName, 'list/' + _newSiteName], {
//                     //"toDetail@0": "test",
//                     //"toList@1": "test",
//                     "author@1": uid,
//                     "siteName@1": _newSiteName,
//                     "createdTime": firebase.database.ServerValue.TIMESTAMP
//                 });
//                 indexService.add("record","created", {siteName:_newSiteName}, _newSiteName);
//             });
//         }
//
//         function moveSite(from, to, removeOrigin){
//             var def=$q.defer(),
//                 fromRootPath = 'sites/detail/'+from+'/',
//                 toRootPath='sites/detail/'+to+'/',
//                 typeArr = ['products', 'articles', 'pages', 'widgets'],
//                 fileNameOpt={products:'itemId',articles:'id'},
//                 typePromises = {};
//             angular.forEach(typeArr, function (type) {
//                 typePromises[type] = $firebase.getFileTableFromList(fromRootPath+type + '/list', {fileName:fileNameOpt[type]||'name'})
//             });
//             typePromises.files = $firebase.ref(fromRootPath+'files').once('value');
//             $q.all(typePromises).then(function (typeContent) {
//                 var copyPromises = [],
//                     onNode = function (table, path) {
//                         copyPromises.push($firebaseStorage.copy(fromRootPath+path, toRootPath+path))
//                     };
//                 //articles, products, widgets, pages
//                 angular.forEach(typeArr, function (type) {
//                     snippets.iterateFileTree({'_content': typeContent[type]}, onNode, type + '/detail');
//                     copyPromises.push($firebase.copy(fromRootPath+type + '/list', toRootPath+type+'/list'));
//                 });
//                 //files
//                 snippets.iterateFileTree(typeContent.files.val(), onNode,'files');
//                 copyPromises.push($firebase.copy(fromRootPath+'files', toRootPath+'files'));
//                 //config
//                 copyPromises.push($firebaseStorage.copy(fromRootPath+'config/preload.js', toRootPath+'config/preload.js'));
//                 $q.all(copyPromises).then(def.resolve);
//             });
//             return def.promise;
//         }
//
//         function removeSite(siteName, uid){
//             $firebase.ref('users/detail/' + uid + '/sites').orderByChild('siteName').equalTo(siteName).once('child_added', function (snap) {
//                 snap.ref.set(null);
//             });
//             $firebase.update('sites', ['detail/' + siteName, 'list/' + siteName], {
//                 "@all": null
//             });
//             indexService.remove(false, false, siteName);
//         }
//
//         return {
//             addSite:addSite,
//             removeSite:removeSite
//         }
//     }
// })();
