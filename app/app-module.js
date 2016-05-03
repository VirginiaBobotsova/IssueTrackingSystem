(function () {
    'use strict';

    angular
        .module('issueTrackingSystem', [
            'ngRoute',
            'ngCookies',
            'issueTrackingSystem.users.authentication',
            'issueTrackingSystem.users',
            'issueTrackingSystem.projects',
            'issueTrackingSystem.issues',
            'issueTrackingSystem.common',
            'issueTrackingSystem.home'])
        .config(['$routeProvider', function($routeProvider) {
            $routeProvider.otherwise({redirectTo : '/'})
        }])
        .run(['$rootScope', '$location', 'authenticationService', function($rootScope, $location, authenticationService) {
            $rootScope.$on('$routeChangeError', function(ev, current, previous, rejection) {
                if (rejection == 'Unauthorized Access') {
                    $location.path('/');
                }
            });

            authenticationService.refreshCookie();
        }])
        .constant('BASE_URL', 'http://softuni-issue-tracker.azurewebsites.net/');


}());
