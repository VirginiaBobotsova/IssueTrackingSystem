(function () {
    'use strict';

	angular
        .module('issueTrackingSystem.projects', [
            'ngRoute',
            'issueTrackingSystem.projects.getProject',
            'issueTrackingSystem.projects.allProjects',
            'issueTrackingSystem.projects.addProject',
            'issueTrackingSystem.projects.editProject',
            'issueTrackingSystem.projects.addIssueToProject'])
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
            .when('/projects', {
                templateUrl: 'app/components/projects/projects-templates/all-projects.html',
                controller: 'AllProjectsController'
            })
            .when('/projects/add', {
                templateUrl: 'app/components/projects/projects-templates/add-project.html',
                controller: 'AddProjectController'
            })
            .when('/projects/:id', {
                templateUrl: 'app/components/projects/projects-templates/project.html',
                controller: 'ProjectController'
            })
            .when('/projects/:id/edit', {
                templateUrl: 'app/components/projects/projects-templates/edit-project.html',
                controller: 'EditProjectController'
            })
            .when('/projects/:id/add-issue', {
                templateUrl: 'app/components/projects/projects-templates/add-issue-to-project.html',
                controller: 'AddIssueToProjectController'
            })
            .otherwise({
                redirectTo: '/'
            })
    }
}());
