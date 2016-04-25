(function () {
    'use strict';

    angular
        .module('issueTrackingSystem', [
            'ngRoute',
            'ngCookies',
            'issueTrackingSystem.users',
            'issueTrackingSystem.projects',
            'issueTrackingSystem.issues',
            'issueTrackingSystem.common',
            'issueTrackingSystem.home'])
        .config(['$routeProvider', function($routeProvider) {
            $routeProvider.otherwise({redirectTo : '/'})
        }])
        .constant('BASE_URL', 'http://softuni-issue-tracker.azurewebsites.net/');


}());
