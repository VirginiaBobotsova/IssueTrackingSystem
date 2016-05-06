(function () {
	'use strict';

    angular
        .module('issueTrackingSystem.issues', [
            'ngRoute',
            'issueTrackingSystem.issues.getIssue',
            'issueTrackingSystem.issues.editIssue'])
        .config(config);

    function config($routeProvider) {
        var routeChecks = {
            authenticated: ['$q', 'authenticationService', function($q, authenticationService) {
                if (authenticationService.isAuthenticated()) {
                    return $q.when(true);
                }

                return $q.reject('Unauthorized Access');
            }]
        };
        $routeProvider
            .when('/issues/:id', {
                templateUrl: 'app/components/issues/issues-templates/issue.html',
                controller: 'IssueController',
                resolve : routeChecks.authenticated
            })
            .when('/issues/:id/edit', {
                templateUrl: 'app/components/issues/issues-templates/edit-issue.html',
                controller: 'EditIssueController',
                resolve : routeChecks.authenticated
            })
    }
}());
