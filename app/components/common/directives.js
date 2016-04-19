(function () {
    'use strict';

    angular.module('issueTrackingSystem.common.directives', [])
        .directive('ngRedirectTo', ['$location', function($location) {

                return function ( scope, element, attrs ) {
                    var path;

                    attrs.$observe( 'ngRedirectTo', function (val) {
                        path = val;
                    });

                    element.bind( 'click', function () {
                        scope.$apply( function () {
                            $location.path( path );
                        });
                    });
                }


            //return {
              //  restrict: 'A',
                //link: function (scope, element, attributes) {
                  //  element.bind('click', function (event) {
                    //    //assign ng-Redirect-To attribute value to location
                      //  $location.path(attributes.ngRedirectTo);
                    //});
                //}
           // }
        }]);
}());

