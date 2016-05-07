(function () {
    'use strict';

    angular
        .module('issueTrackingSystem.common.redirect', [])
        .directive('ngRedirectTo', redirectTo);

    redirectTo.$inject = ['$location'];

    function redirectTo($location) {
        return  {
            restrict: 'A',
            link : link
        };

        function link(scope, element, attributes) {
            element.bind('click', function (event) {
            $location.path(attributes.ngRedirectTo);
            });
        }
    }
}());

