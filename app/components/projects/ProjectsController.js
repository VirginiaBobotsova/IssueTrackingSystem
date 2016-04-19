(function () {
	angular.module('issueTrackingSystem.projects', [])
        .controller('projectsController', ['$scope',
            '$routeParams',
            '$location',
            'usersService',
            'projectsService',
            'issuesService',
            'authenticationService',
            'toaster',
            function (
                $scope,
                $routeParams,
                $location,
                usersService,
                projectsService,
                issuesService,
                authenticationService,
                toaster) {
                var defaultNotificationTimeout = 2000,
                    defaultReloadTimeout = 1000;

                if($location.path().match('\/(?!index\.html)(projects\/[0-9]+)')){
                    getProject();
                }

                if($location.path() == '/projects'){
                    getAllProjects();
                }

                if($location.path() == '/projects/add'){
                    addProject();
                }

                if($location.path().match('\/(?!index\.html)(projects\/[0-9]+\/edit)')){
                    editProject();
                }

                function getProject() {
                    projectsService.getProjectById($routeParams.id)
                        .then(function (project) {
                            authenticationService.getCurrentUserId()
                                .then(function (id) {
                                    $scope.isLead = (project.data.Lead.Id === id);

                                    $scope.project = projectsService.transformPrioritiesAndLabels(project.data);
                                    projectsService.getProjectIssues($routeParams.id)
                                        .then(function (projectIssues) {
                                            $scope.project.issues = projectIssues.filter(function (issue) {
                                                return issue.Assignee.Id === id;
                                            });
                                            if($scope.isLead || $scope.isAdmin){
                                                $scope.project.issues = projectIssues;
                                            }
                                        });

                                });

                        });
                }

                function getAllProjects() {
                    projectsService.getAllProjects()
                        .then(function (projects) {
                            $scope.projects = projects.data;
                        });
                }

                function addProject() {
                    usersService.getUsers()
                        .then(function (users) {
                            $scope.users = users;
                        });
                    $scope.addProject = function (project) {
                        projectsService.addProject(project)
                            .then(function (response) {
                                $location.path('#/projects/' + response.data.Id);
                                toaster.pop('success', 'Project edited successfully');
                            }, function (error) {
                                toaster.pop('error', 'Error')
                            });
                    };
                }

                function editProject() {
                    projectsService.getProjectById($routeParams.id)
                        .then(function (project) {
                            if(!$scope.isAdministrator){
                                authenticationService.getCurrentUserId()
                                    .then(function (id) {
                                        $scope.isLead = (project.data.Lead.Id === id);

                                        if(!$scope.isLead){
                                            redirectToHome(defaultReloadTimeout);
                                            toaster.pop('error', 'Unauthorized');
                                            return;
                                        }
                                    });
                            }
                            $scope.project = projectsService.transformPrioritiesAndLabels(project.data);
                            usersService.getUsers()
                                .then(function (users) {
                                    $scope.users=users;
                                });
                        });
                    $scope.editProject = function (project) {
                        project.LeadId = project.Lead.Id;
                        delete project.Lead;
                        projectsService.editProject(project)
                            .then(function (response) {
                                $location.path('#/projects/' + project.Id);
                                toaster.pop('success', 'Project edited successfully');
                            }, function (error) {

                                toaster.pop('error', 'Error');
                            });
                    };
                }

                function redirectToHome(time) {
                    $timeout(function () {
                        $location.path('/')
                    }, time);
                }
            }
        ]);

}());
