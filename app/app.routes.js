(function () {
	'use strict';
    angular.module('issueTrackingSystem.routes', [
        'ngRoute',
        'ui.bootstrap',
        'issueTrackingSystem.users.usersService',
        'issueTrackingSystem.home',
        'issueTrackingSystem.users',
        'issueTrackingSystem.projects',
        'issueTrackingSystem.issues',
        'issueTrackingSystem.common'])
    .config(function ($routeProvider) {
        $routeProvider
            .when('/', {
                templateUrl: 'app/components/home/homeView.html',
                controller: 'homeController'
            })
            .when('/logout', {
                templateUrl: 'app/components/users/user-project-issue-templates/logout.html',
                controller: 'usersController'
            })
            .when('/profile', {
                templateUrl: 'app/components/users/user-project-issue-templates/edit-profile.html',
                controller: 'usersController'
            })
            .when('/profile/password', {
                templateUrl: 'app/components/users/user-project-issue-templates/change-password.html',
                controller: 'usersController'
            })
            .when('/projects', {
                templateUrl: 'app/components/projects/user-project-issue-templates/all-projects.html',
                controller: 'projectsController'
            })
            .when('/projects/add', {
                templateUrl: 'app/components/projects/user-project-issue-templates/add-project.html',
                controller: 'projectsController'
            })
            .when('/projects/:id', {
                templateUrl: 'app/components/projects/user-project-issue-templates/project.html',
                controller: 'projectsController'
            })
            .when('/projects/:id/edit', {
                templateUrl: 'app/components/projects/user-project-issue-templates/edit-project.html',
                controller: 'projectsController'
            })
            .when('/projects/:id/add-issue', {
                templateUrl: 'app/components/issues/user-project-issue-templates/add-issue-to-project.html',
                controller: 'projectsController'
            })
            .when('/issues/:id', {
                templateUrl: 'app/components/issues/user-project-issue-templates/issue.html',
                controller: 'issuesController'
            })
            .when('/issues/:id/edit', {
                templateUrl: 'app/components/issues/user-project-issue-templates/edit-issue.html',
                controller: 'issuesController'
            })
            .otherwise({
                redirectTo: '/'
            })
    })
}());
