(function() {
    'use strict';

    angular
        .module('app.parts.products', [
            'app.plugins.ngcart',
            'app.plugins.stripe',
            'app.plugins.allpay',
            'app.plugins.ngdisqus'
        ]);
})();
