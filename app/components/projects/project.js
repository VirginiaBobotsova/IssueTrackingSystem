(function () {
    'use strict';

	angular
        .module('issueTrackingSystem.projects', [
            'ngRoute',
            'issueTrackingSystem.projects.project',
            'issueTrackingSystem.projects.allProjects',
            'issueTrackingSystem.projects.addProject',
            'issueTrackingSystem.projects.editProject',
            'issueTrackingSystem.projects.addIssueToProject'])
        .config(config);

    function config($routeProvider) {
        $routeProvider
            .when('/projects', {
                templateUrl: 'app/components/projects/project-issue-templates/all-projects.html',
                controller: 'AllProjectsController'
            })
            .when('/projects/add', {
                templateUrl: 'app/components/projects/project-issue-templates/add-project.html',
                controller: 'AddProjectController'
            })
            .when('/projects/:id', {
                templateUrl: 'app/components/projects/project-issue-templates/project.html',
                controller: 'ProjectController'
            })
            .when('/projects/:id/edit', {
                templateUrl: 'app/components/projects/project-issue-templates/edit-project.html',
                controller: 'EditProjectController'
            })
            .when('/projects/:id/add-issue', {
                templateUrl: 'app/components/issues/project-issue-templates/add-issue-to-project.html',
                controller: 'AddIssueToProjectController'
            })
    }
}());
