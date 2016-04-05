'use strict';

var issueTrackingSystemApp = angular
    .module('issueTrackingSystemApp', ['ngResource', 'ngRoute', 'ngStorage', 'toaster', 'naif.base64', 'ng-acl'])
    .run(['AclService', function (AclService) {
        AclService.addRole('user');
        AclService.addRole('projectLeader', 'user');
        AclService.addRole('admin', 'projectLeader');

        AclService.addResource('Issue');
        AclService.addResource('IssueStatus');
        AclService.addResource('Project');

        //Users can view the assigned issues to them and has privileges to change the status of the issue.
        AclService.allow('user', 'Issue', 'view', function (role, resource) {
            return resource.assignee === role.id;
        });
        AclService.allow('user', 'IssueStatus', 'edit', function (role, resource) {
            return resource.assignee === role.id;
        });

        //The project leader can edit the project, add new issues to it and change the status of the current ones.
        AclService.allow('projectLeader', 'Project', 'view', function (role, resource) {
            return resource.assignee === role.id;
        });
        AclService.allow('projectLeader', 'Project', 'edit', function (role, resource) {
            return resource.leader
        });
        AclService.allow('projectLeader', 'Issue', 'create', function (role, resource) {
            return
        });
        AclService.allow('projectLeader', 'IssueStatus', 'edit', function (role, resource) {
            return resource.assignee === role.id;
        });

        //The administrator has full access to all actions that available for Issue and Project
        AclService.allow('admin', 'Issue');
        AclService.allow('admin', 'Project');

        //Let's assume that you have some user object that implements AclRoleInterface. This is optional feature.
        var user = {
            id: 1,
            name: 'Duck',
            getRoles: function () {
                return ['user'];
            }
        };
        AclService.setUserIdentity(user);
    }])
    .config(function ($routeProvider) {
        $routeProvider
            .when('/', {
                templateUrl: 'app/partials/home.html',
                controller: 'HomeController',
                resolve : {
                    'acl' : [$q, 'AclService', function ($q, AclService) {
                        if (AclService.can('Issue', 'view')) {
                           return true;
                        } else {
                            return $q.reject('Unauthorized');
                        }
                    }]
                }
            })
            .when('/logout', {
                templateUrl: 'app/partials/user/logout.html',
                controller: 'LogoutController'
            })
            .when('/profile', {
                templateUrl: 'app/partials/user/edit-profile.html',
                controller: 'EditProfileController',
                resolve:{
                    isLogged: function($location, $sessionStorage, $localStorage){
                        if(!$sessionStorage.authorization && !$localStorage.authorization){
                            $location.path('/');
                        }
                    }
                }
            })
            .when('/profile/password', {
                templateUrl: 'app/partials/user/change-password.html',
                controller: 'ChangePasswordController',
                resolve:{
                    isLogged: function($location, $sessionStorage, $localStorage){
                        if(!$sessionStorage.authorization && !$localStorage.authorization){
                            $location.path('/');
                        }
                    }
                }
            })
            .when('/projects/:id', {
                templateUrl : 'app/partials/project/project.html',
                controller : 'ProjectDetailsController',
                resolve : {
                    isLogged: function($location, $sessionStorage, $localStorage){
                        if(!$sessionStorage.authorization && !$localStorage.authorization){
                            $location.path('/');
                        }
                    },
                    'acl' : [$q, 'AclService', function ($q, AclService) {
                        if (AclService.can('Project', 'view')) {
                            return true;
                        } else {
                            return $q.reject('Unauthorized');
                        }
                    }]
                }
            })
            .otherwise({
                redirectTo: '/'
            })
    })
    .config(['$httpProvider', function($httpProvider) {
        $httpProvider.interceptors.push(function($q, $location, $sessionStorage, $localStorage) {
            return {
                'responseError': function(rejection){
                    var defer = $q.defer();
                    if(rejection.status == 401){
                        $localStorage.$reset();
                        $sessionStorage.$reset();
                        $location.path('/');
                    }

                    if(rejection.status == 404) {
                        $location.path('/');
                    }

                    defer.reject(rejection);
                    return defer.promise;
                }
            };
        });
    }])
    .constant('baseUrl', '');
