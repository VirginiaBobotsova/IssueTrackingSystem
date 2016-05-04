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
                    toaster.pop('success', 'Register successful!', null, defaultNotificationTimeout);
                    login(user);

                    //$scope.registerForm.$setPristine();
                   // var loginData = {
                     //   Username: responce.config.data.Email,
                       // Password: responce.config.data.Password
                   // },
                   // authenticationService.login(loginData)
                     //   .then(function() {
                            //$route.reload();

                    },
               function (error) {
                   toaster.pop('error', 'Registration error!', error.data, defaultNotificationTimeout);
              });
        }

        function login(user) {
            authenticationService.login(user)
                .then(function (data) {
                    //identificationService.requestUserProfile();
                    $route.reload();
                    toaster.pop('success', 'Login successful!', null, defaultNotificationTimeout);
                    //$scope.loginForm.$setPristine();
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
                    console.log(data)
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
                    console.log(data.Issues)
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
                            console.log(data)
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
                                    console.log(projects)
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