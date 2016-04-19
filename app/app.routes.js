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
                templateUrl: 'app/components/users/templates/logout.html',
                controller: 'usersController'
            })
            .when('/profile', {
                templateUrl: 'app/components/users/templates/editProfile.html',
                controller: 'usersController'
            })
            .when('/profile/password', {
                templateUrl: 'app/components/users/templates/changePassword.html',
                controller: 'usersController'
            })
            .when('/projects', {
                templateUrl: 'app/components/projects/templates/allProjects.html',
                controller: 'projectsController'
            })
            .when('/projects/add', {
                templateUrl: 'app/components/projects/templates/addProject.html',
                controller: 'projectsController'
            })
            .when('/projects/:id', {
                templateUrl: 'app/components/projects/templates/project.html',
                controller: 'projectsController'
            })
            .when('/projects/:id/edit', {
                templateUrl: 'app/components/projects/templates/editProject.html',
                controller: 'projectsController'
            })
            .when('/projects/:id/add-issue', {
                templateUrl: 'app/components/projects/templates/addIssue.html',
                controller: 'projectsController'
            })
            .when('/issues/:id', {
                templateUrl: 'app/components/issues/templates/issue.html',
                controller: 'issuesController'
            })
            .when('/issues/:id/edit', {
                templateUrl: 'app/components/issues/templates/editIssue.html',
                controller: 'issuesController'
            })
            .otherwise({
                redirectTo: '/'
            })
    })
}());
