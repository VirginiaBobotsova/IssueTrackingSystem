(function () {
    'use strict';

    angular
        .module('issueTrackingSystem.projects.editProject', [])
        .controller('EditProjectController', editProjectController);

    editProjectController.$inject = [
        '$scope',
        '$routeParams',
        '$location',
        'usersService',
        'projectsService',
        'notifyService'];

    function editProjectController(
        $scope,
        $routeParams,
        $location,
        usersService,
        projectsService,
        notifyService) {
        projectsService.getProjectById($routeParams.id)
            .then(function (project) {
                usersService.getCurrentUserInfo()
                    .then(function (user) {
                        $scope.isAdmin = user.isAdmin;
                        $scope.isLead = (project.data.Lead.Id === user.Id);
                        if(!$scope.isAdmin) {
                            if (!$scope.isLead) {
                                $location.path('/');
                                notifyService.showError('Unauthorized');
                                return;
                            }
                        }
                    });

                $scope.project = projectsService.transformPrioritiesAndLabels(project.data);
                $scope.projectCurrentLeadId = project.data.Lead.Id
            });

        usersService.getUsers()
            .then(function (users) {
                $scope.users = users;
            });

        $scope.editProject = editProject;

        function editProject(project) {
            project.ProjectKey = $scope.project.ProjectKey;
            project.projectLeadId = $scope.projectCurrentLeadId;
            var projectModel = {
                Id : project.Id,
                Name : project.Name,
                Description : project.Description,
                ProjectKey : project.ProjectKey,
                Labels : project.Labels,
                Priorities : project.Priorities,
                LeadId : project.projectLeadId
            };
            projectsService.editProject(projectModel)
                .then(function (success) {
                    $location.path('/projects/' + success.data.Id);
                    notifyService.showInfo('Project is edited successfully')
                }, function (error) {
                    notifyService.showError('An error occurred');
                });
        }
    }
}());
