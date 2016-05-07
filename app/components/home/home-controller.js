(function () {
	'use strict';

    angular
        .module('issueTrackingSystem.home.homeController', [
            'issueTrackingSystem.users.identity',
            'issueTrackingSystem.users.authentication',
            'issueTrackingSystem.users.usersService',
            'issueTrackingSystem.issues.issuesService',
            'issueTrackingSystem.projects.projectsService',
            'ui.bootstrap'])
        .controller('HomeController', homeController);

    homeController.$inject = [
        '$scope',
        '$log',
        '$route',
        'authenticationService',
        'usersService',
        'issuesService',
        'projectsService',
        'notifyService'];

    function homeController(
        $scope,
        $log,
        $route,
        authenticationService,
        usersService,
        issuesService,
        projectsService,
        notifyService) {
        if(authenticationService.isAuthenticated()){
            usersService.getCurrentUserInfo()
                .then(function (data) {
                $scope.isAdmin = data.isAdmin;
            });

            $scope.issuesParams = {
                pageSize : 3,
                pageNumber : 1,
                orderBy : 'DueDate desc'
            };

            attachUserIssuesAndProjects();

            $scope.attachUserAssignedIssues = attachUserAssignedIssues();
        } else {
            $scope.register = register;
            $scope.login = login;
        }

        function register(user, registerForm) {
            authenticationService.register(user)
                .then(function (responce) {
                    login(user);
                },
               function (error) {
                   notifyService.showError('Registration error!');
              });
        }

        function login(user) {
            authenticationService.login(user)
                .then(function (data) {
                    $route.reload();
                    notifyService.showInfo('Welcome to Issue Tracking System!');
                }, function (error) {
                    notifyService.showError('An error occurred, please try again!');
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