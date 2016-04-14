(function () {
	'use strict';
    angular.module('issueTrackingSystem.home', [
        'issueTrackingSystem.users.userService',
        'issueTrackingSystem.users.authentication',
        'issueTrackingSystem.users.identity',
        'toaster'])
        .controller('homeController', [
            '$scope',
            '$log',
            '$route',
            '$timeout',
            '$location',
            'userService',
            'authenticationService',
            'identificationService',
            'toaster',
            function ($scope, $log, $route, $timeout, $location, userService, authenticationService, identificationService, toaster) {
                var defaultNotificationTimeout = 2000,
                    defaultReloadTimeout = 1000;

                identificationService.userLogged()
                    .then(function(data) {
                        $scope.userLogged = data;
                    });

                identificationService.isAdmin()
                    .then(function(data) {
                        $scope.isAdmin = data;
                    });

                if(identificationService.userLogged()){
                    attachUserIssuesAndProjects();
                    $scope.attachUserAssignedIssues = attachUserAssignedIssues();
                    $scope.addProjectRedirect = function () {
                        $location.path('projects/add');
                    };
                    $scope.addIssueRedirect = function () {
                        $location.path('issues/add');
                    };
                }

                $scope.register = register;
                $scope.login = login;
                $scope.rememberMe = false;

                function register(user, registerForm) {
                    authenticationService.registerUser(user)
                        .then(function (data) {
                            identificationService.setCookie(data);
                            $scope.registerForm.$setPristine();
                            authenticationService.login(user)
                                .then(function() {
                                    reloadRoute(defaultReloadTimeout);
                                    toaster.pop('success', 'Register successful!', null, defaultNotificationTimeout);
                                });
                        }, function (error) {
                            toaster.pop('error', 'Registration error!', error.data, defaultNotificationTimeout);
                        })
                }

                function login(user, loginForm) {
                    authenticationService.loginUser(user)
                        .then(function (data) {
                            //if ($scope.rememberMe) {
                                //$scope.$storage = credentialsService.saveTokenInLocalStorage(data.access_token, data.token_type);
                            //} else {
                                //$scope.$storage = credentialsService.saveTokenInSessionStorage(data.access_token, data.token_type);
                            //}

                            identificationService.setCookie('access_token', data.access_token);
                            identificationService.getCurrentUser()
                                .then(function (currentUser) {
                                    var userString = JSON.stringify(currentUser.data);
                                    identificationService.setCookie('user', userString);
                                    reloadRoute(defaultReloadTimeout);
                                    toaster.pop('success', 'Login successful!', defaultNotificationTimeout);
                                    $scope.loginForm.$setPristine();
                                }, function (error) {
                                    toaster.pop('error', 'Login error!', defaultNotificationTimeout);
                                });
                    });
                }

                function attachUserAssignedIssues(pageSize, pageNumber, orderBy){
                    issuesService.getCurrentUserIssues(pageSize, pageNumber, orderBy)
                        .then(function (issues) {
                            $scope.issuePages = issues.data.totalPages;
                            $scope.issues = issues.data.Issues;
                        });
                }

                function attachUserAffiliatedProjects(){
                    issuesService.getCurrentUserIssues(999, 1)
                        .then(function (issues) {
                            var projects = [];
                            issues.data.Issues.forEach(function (issue) {
                                if(!projects.find(function (project) {
                                        return project.Id === issue.Project.Id;
                                    })){
                                    projects.push({
                                        Id: issue.Project.Id,
                                        Name: issue.Project.Name
                                    });
                                }
                            });
                            identificationService.getCurrentUserId()
                                .then(function (id) {
                                    projectsService.getUserRelatedProjects(id)
                                        .then(function (userProjects) {
                                            userProjects.forEach(function (pr) {
                                                if(!projects.find(function (project) {
                                                        return project.Id === pr.Id;
                                                    })){
                                                    projects.push({
                                                        Id: pr.Id,
                                                        Name: pr.Name
                                                    });
                                                }
                                            });
                                            $scope.projects = projects;
                                        })
                                });
                        });
                }

                function attachUserIssuesAndProjects(){
                    attachUserAssignedIssues();
                    attachUserAffiliatedProjects();
                }

                function reloadRoute(time) {
                    $timeout(function () {
                        $route.reload();
                    }, time);
                }
            }
        ])
}());