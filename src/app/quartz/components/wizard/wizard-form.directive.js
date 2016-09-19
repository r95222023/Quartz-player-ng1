(function() {
    'use strict';

    angular
        .module('quartz.components')
        .directive('qtWizardForm', WizardFormProgress);

    /* @ngInject */
    function WizardFormProgress() {
        // Usage:
        //  <div qt-wizard>
        //      <form qt-wizard-form>
        //      </form>
        //  </div>
        //
        var directive = {
            require: ['form', '^qtWizard'],
            link: link,
            restrict: 'A'
        };
        return directive;

        function link(scope, element, attrs, require) {
            var ngFormCtrl = require[0];
            var qtWizardCtrl = require[1];

            // register this form with the parent qtWizard directive
            qtWizardCtrl.registerForm(ngFormCtrl);

            // watch for form input changes and update the wizard progress
            element.on('input', function() {
                qtWizardCtrl.updateProgress();
            });
        }
    }
})();