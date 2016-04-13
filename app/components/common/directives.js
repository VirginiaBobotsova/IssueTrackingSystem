(function () {
	'use strict';

    angular.module('issueTrackingSystem.common.directives', [])
        .directive('ngRedirectTo', ['$location', function($location) {
            return {
                restrict: 'A',
                link: function (scope, element, attributes) {
                    element.bind('click', function (event) {
                        //assign ng-Redirect-To attribute value to location
                        $location.path(attributes.ngRedirectTo);
                    });
                }
            }
        }]);
}());
