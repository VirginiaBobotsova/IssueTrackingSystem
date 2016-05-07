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
        'toaster'];

    function editProjectController(
        $scope,
        $routeParams,
        $location,
        usersService,
        projectsService,
        toaster) {
        var defaultNotificationTimeout = 2000;

        projectsService.getProjectById($routeParams.id)
            .then(function (project) {
                usersService.getCurrentUserInfo()
                    .then(function (user) {
                        $scope.isAdmin = user.isAdmin;
                        $scope.isLead = (project.data.Lead.Id === user.Id);
                        if(!$scope.isAdmin) {
                            if (!$scope.isLead) {
                                $location.path('/');
                                toaster.pop('error', 'Unauthorized', null, defaultNotificationTimeout);
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
                Name : project.Name,
                Description : project.Description,
                ProjectKey : project.ProjectKey,
                Labels : project.Labels,
                Priorities : project.Priorities,
                LeadId : project.projectLeadId
            };
            projectsService.editProject(projectModel)
                .then(function (success) {
                    toaster.pop('success', 'Project is edited successfully', null, defaultNotificationTimeout);
                    $location.path('/projects/' + success.data.Id);
                }, function (error) {
                    toaster.pop('error', 'Error', null, defaultNotificationTimeout);
                });
        }
    }
}());
