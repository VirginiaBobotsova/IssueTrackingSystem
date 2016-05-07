(function () {
    'use strict';

    angular
        .module('issueTrackingSystem.projects.addProject', [])
        .controller('AddProjectController', addProjectController);

    addProjectController.$inject = [
        '$scope',
        '$location',
        'usersService',
        'projectsService',
        'notifyService'];

    function addProjectController(
        $scope,
        $location,
        usersService,
        projectsService,
        notifyService) {
        usersService.getCurrentUserInfo()
            .then(function (data) {
            $scope.isAdmin = data.isAdmin;
        });

        usersService.getUsers()
            .then(function (users) {
                $scope.users = users;
            });

        $scope.addProject = addProject;

        function addProject(project) {
            project.ProjectKey = $scope.project.Name.match(/\b(\w)/g).join('');
            var projectModel = {
                Id : project.Id,
                Name : project.Name,
                Description : project.Description,
                ProjectKey : project.ProjectKey,
                Labels : project.Labels,
                Priorities : project.Priorities,
                LeadId : project.Lead.Id
            };
            projectsService.addProject(projectModel)
                .then(function (success) {
                    $location.path('/projects/' + success.data.Id);
                    notifyService.showInfo('The project is added successfully');
                }, function (error) {
                    notifyService.showError('An error occurred');
                });
        }
    }
}());
