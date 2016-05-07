(function () {
	'use strict';

    angular
        .module('issueTrackingSystem.home.homeController', [
            'issueTrackingSystem.users.identity',
            'issueTrackingSystem.users.authentication',
            'issueTrackingSystem.users.usersService',
            'issueTrackingSystem.issues.issuesService',
            'issueTrackingSystem.projects.projectsService',
            'toaster',
            'ui.bootstrap'])
        .controller('HomeController', homeController);

    homeController.$inject = [
        '$scope',
        '$log',
        '$route',
        'identificationService',
        'authenticationService',
        'usersService',
        'issuesService',
        'projectsService',
        'toaster'];

    function homeController(
        $scope,
        $log,
        $route,
        identificationService,
        authenticationService,
        usersService,
        issuesService,
        projectsService,
        toaster) {
        var defaultNotificationTimeout = 2000;

        if(authenticationService.isAuthenticated()){
            $scope.issuesParams = {
                pageSize : 3,
                pageNumber : 1,
                orderBy : 'DueDate desc'
            };

            attachUserIssuesAndProjects();

            $scope.attachUserAssignedIssues = attachUserAssignedIssues();

            $scope.isAdmin = usersService.isAdministrator();
        } else {
            $scope.register = register;
            $scope.login = login;
        }

        function register(user, registerForm) {
            authenticationService.register(user)
                .then(function (responce) {
                    login(user);
                    toaster.pop('success', 'Register successful!', null, defaultNotificationTimeout);
                },
               function (error) {
                   toaster.pop('error', 'Registration error!', error.data, defaultNotificationTimeout);
              });
        }

        function login(user) {
            authenticationService.login(user)
                .then(function (data) {
                    $route.reload();
                    toaster.pop('success', 'Login successful!', null, defaultNotificationTimeout);
                }, function (error) {
                    toaster.pop('error', 'Login error!', null, defaultNotificationTimeout);
                });
        }

        function attachUserAssignedIssues(){
            issuesService.getCurrentUserIssues(
                $scope.issuesParams.pageSize,
                $scope.issuesParams.pageNumber,
                $scope.issuesParams.orderBy)
                .then(function (data) {
                    $scope.totalIssues = data.TotalCount;
                    $scope.totalPages = data.TotalPages;
                    $scope.currentPage = 1;

                    $scope.setPage = function (pageNumber) {
                        $scope.currentPage = pageNumber;
                    };

                    $scope.pageChanged = function() {
                        $log.log('Page changed to: ' + $scope.currentPage);
                    };

                    $scope.userIssues = data.Issues;
                }, function (error) {

                });
        }

        function attachUserAffiliatedProjects(){
            issuesService.getCurrentUserIssues(
                999,
                $scope.issuesParams.pageNumber,
                $scope.issuesParams.orderBy
            )
                .then(function (data) {
                    var projects = [];
                    data.Issues.forEach(function (issue) {
                        if(!projects.find(function (project) {
                                return project.Id === issue.Project.Id;
                            })){
                            projects.push({
                                Id: issue.Project.Id,
                                Name: issue.Project.Name
                            });
                        }
                    });
                    console.log(projects)
                    usersService.getCurrentUserInfo()
                        .then(function (data) {
                            projectsService.getUserRelatedProjects(data.Id)
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
                                    $scope.userProjects = projects;
                                })
                        });
                });
        }

        function attachUserIssuesAndProjects(){
            attachUserAssignedIssues();
            attachUserAffiliatedProjects();
        }
    }
}());