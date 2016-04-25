(function () {
	'use strict';

    angular
        .module('issueTrackingSystem.home.homeController', [
            'issueTrackingSystem.users.authentication',
            'issueTrackingSystem.users.usersService',
            'issueTrackingSystem.issues.issuesService',
            'issueTrackingSystem.projects.projectsService',
            'toaster'])
        .controller('HomeController', homeController);

    homeController.$inject = [
        '$scope',
        '$route',
        'authenticationService',
        'issuesService',
        'projectsService',
        'toaster'];

    function homeController(
        $scope,
        $route,
        authenticationService,
        issuesService,
        projectsService,
        toaster) {
        var defaultNotificationTimeout = 2000;

        if(authenticationService.isAuthenticated()){
            $scope.userLogged = authenticationService.isAuthenticated();
            attachUserIssuesAndProjects();
            $scope.attachUserAssignedIssues = attachUserAssignedIssues();
           // $scope.addProjectRedirect = function () {
             //   $location.path('projects/add');
            //};
            //$scope.addIssueRedirect = function () {
              //  $location.path('issues/add');
            //};
        } else {
            $scope.register = register;
            $scope.login = login;
        }

        function register(user, registerForm) {
            authenticationService.register(user)
                .then(function (responce) {
                    $scope.registerForm.$setPristine();
                    var loginData = {
                        Username: responce.config.data.Email,
                        Password: responce.config.data.Password
                    };
                    authenticationService.login(loginData)
                        .then(function() {
                            $route.reload();
                            toaster.pop('success', 'Register successful!', null, defaultNotificationTimeout);
                        });
                }, function (error) {
                    toaster.pop('error', 'Registration error!', error.data, defaultNotificationTimeout);
                })
        }

        function login(user) {
            authenticationService.login(user)
                .then(function (data) {
                    authenticationService.getUserInfo();
                    $route.reload();
                    toaster.pop('success', 'Login successful!', null, defaultNotificationTimeout);
                    $scope.loginForm.$setPristine();
                }, function (error) {
                    toaster.pop('error', 'Login error!', null, defaultNotificationTimeout);
                });
        }

        function attachUserAssignedIssues(pageSize, pageNumber){
            issuesService.getCurrentUserIssues(pageSize, pageNumber)
                .then(function (data) {
                    $scope.totalPages = data.TotalPages;
                    $scope.userIssues = data.Issues;
                }, function (error) {

                });
        }

        function attachUserAffiliatedProjects(){
            issuesService.getCurrentUserIssues(5, 1)
                .then(function (data) {
                    var projects = [];
                    data.Issues.forEach(function (issue) {
                        if(!projects.filter(function (project) {
                                return project.Id === issue.Project.Id;
                            })){
                            projects.push({
                                Id: issue.Project.Id,
                                Name: issue.Project.Name
                            });
                        }
                    });
                    authenticationService.getCurrentUserId()
                        .then(function (data) {
                            projectsService.getUserRelatedProjects(data)
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
    }
}());