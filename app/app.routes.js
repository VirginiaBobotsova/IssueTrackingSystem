(function () {
	'use strict';
    angular.module('issueTrackingSystem.routes', [
        'ngRoute',
        'issueTrackingSystem.users.usersService',
        'issueTrackingSystem.home',
        'issueTrackingSystem.users',
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
                controller: 'UserController'
            })
            .when('/projects', {
                templateUrl: 'app/components/projects/templates/allProjects.html',
                controller: 'ProjectsController'
            })
            .when('/projects/add', {
                templateUrl: 'app/components/projects/templates/addProject.html',
                controller: 'ProjectsController'
            })
            .when('/projects/:id', {
                templateUrl: 'app/components/projects/templates/project.html',
                controller: 'ProjectsController'
            })
            .when('/projects/:id/edit', {
                templateUrl: 'app/components/projects/templates/editProject.html',
                controller: 'ProjectsController'
            })
            .when('/projects/:id/add-issue', {
                templateUrl: 'app/components/projects/templates/addIssue.html',
                controller: 'ProjectsController'
            })
            .when('/issues/:id', {
                templateUrl: 'app/components/projects/templates/issue.html',
                controller: 'IssuesController'
            })
            .when('/issues/:id/edit', {
                templateUrl: 'app/components/projects/templates/editIssue.html',
                controller: 'IssuesController'
            })
            .otherwise({
                redirectTo: '/'
            })
    })
}());
