(function() {
    'use strict';

    angular
        .module('quartz.directives')
        .directive('paletteBackground', paletteBackground);

    /* @ngInject */
    function paletteBackground(qtTheming) {
        // Usage:
        // ```html
        // <div palette-background="green:500">Coloured content</div>
        // ```
        //
        // Creates:
        //
        var directive = {
            bindToController: true,
            link: link,
            restrict: 'A'
        };
        return directive;

        function link($scope, $element, attrs) {
            var splitColor = attrs.paletteBackground.split(':');
            var color = qtTheming.getPaletteColor(splitColor[0], splitColor[1]);

            if(angular.isDefined(color)) {
                $element.css({
                    'background-color': qtTheming.rgba(color.value),
                    'border-color': qtTheming.rgba(color.value),
                    'color': qtTheming.rgba(color.contrast)
                });
            }
        }
    }
})();