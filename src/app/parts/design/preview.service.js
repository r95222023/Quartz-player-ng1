(function () {
    'use strict';

    angular
        .module('app.parts.design')
        .run(PreviewService);

    /*@ngInject*/
    function PreviewService($state, $stateParams) {
        window.refreshPreview = function (data) {
            window._previewPageData = data;
            $state.go('previewFrame', $stateParams, {reload: true});
        };
        if(window.parent&&window.parent.initPreviewFrame) window.parent.initPreviewFrame();
    }
})();

