angular.module('FileManagerApp').config(['fileManagerConfigProvider', '$translatePartialLoaderProvider', function (config,$translatePartialLoaderProvider) {
    var defaults = config.$get();
    $translatePartialLoaderProvider.addPart('assets/modules/file-manager');

    config.set({
        appName: 'angular-filemanager',
        pickCallback: function(item) {
            var msg = 'Picked %s "%s" for external use'
                .replace('%s', item.type)
                .replace('%s', item.fullPath());
            window.alert(msg);
        },
        listUrl: 'http://localhost:5000/list',
        downloadFileUrl: 'http://localhost:5000/download',
        uploadUrl: 'http://localhost:5000/upload',
        removeUrl: 'http://localhost:5000/remove',
        createFolderUrl: 'http://localhost:5000/createFolder',
        renameUrl: 'http://localhost:5000/rename',
        copyUrl: 'http://localhost:5000/copy',

        allowedActions: angular.extend(defaults.allowedActions, {
            pickFiles: false,
            pickFolders: false
        })
    });
}]);
