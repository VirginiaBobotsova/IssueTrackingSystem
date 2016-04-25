(function () {
	'use strict';

    angular
        .module('issueTrackingSystem.issues', [
            'ngRoute',
            'issueTrackingSystem.issues.getIssue',
            'issueTrackingSystem.issues.editIssue'])
        .config(config);

    function config($routeProvider) {
        $routeProvider
            .when('/issues/:id', {
                templateUrl: 'app/components/issues/issues-templates/issue.html',
                controller: 'IssuesController'
            })
            .when('/issues/:id/edit', {
                templateUrl: 'app/components/issues/issues-templates/edit-issue.html',
                controller: 'EditIssueController'
            })
            .otherwise({
                redirectTo: '/'
            })
    }
}());
