(function () {
	angular.module('ProjectsController', [
        'issueTrackingSystem.users.usersService',
        'issueTrackingSystem.projects.projectsService',
        'issueTrackingSystem.issues.issuesService',
        'issueTrackingSystem.users.authentication',
        'toaster'
    ])
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
                if($location.path().match('\/(?!index\.html)(projects\/[0-9]+\/edit)')){
                    projectsService.getProjectById($routeParams.id)
                        .then(function (project) {
                            if(!$scope.isAdministrator){
                                authenticationService.getUserInfo()
                                    .then(function (id) {
                                        $scope.isLead = (project.data.Lead.Id === id);

                                        if(!$scope.isLead){
                                            $location.path('/');
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
                /**
                 *  Getting project
                 */
                else if($location.path().match('\/(?!index\.html)(projects\/[0-9]+)')){
                    projectsService.getProjectById($routeParams.id)
                        .then(function (project) {
                            authenticationService.getCurrentUser()
                                .then(function (id) {
                                    $scope.isLead = (project.data.Lead.Id === id);

                                    $scope.project = projectsService.transformPrioritiesAndLabels(project.data);
                                    projectsService.getProjectIssues($routeParams.id)
                                        .then(function (projectIssues) {

                                            //user associated issues

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
                /**
                 *  Adding project
                 */
                else if($location.path() == '/projects/add'){
                    usersService.getUsers()
                        .then(function (users) {
                            $scope.users=users;
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
                /**
                 *  Getting all projects
                 */
                else if($location.path() == '/projects'){
                    projectsService.getAllProjects()
                        .then(function (projects) {
                            $scope.projects = projects.data;
                        });
                }
            }
        ]);

}());
