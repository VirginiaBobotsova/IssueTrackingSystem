(function () {
    'use strict';

    angular
        .module('issueTrackingSystem.projects.addProject', [])
        .controller('AddProjectController', addProject);

    addProject.$inject = [
        '$scope',
        '$location',
        'usersService',
        'projectsService',
        'authenticationService',
        'toaster'];

    function addProject(
        $scope,
        $location,
        usersService,
        projectsService,
        authenticationService,
        toaster) {
        var defaultNotificationTimeout = 2000;

        $scope.isAdmin = usersService.isAdministrator();

        usersService.getUsers()
            .then(function (users) {
                $scope.users = users;
            });

        $scope.addProject = addProject;

        function addProject(project) {
            project.ProjectKey = $scope.project.Name.match(/\b(\w)/g).join('');
            var projectModel = {
                Name : project.Name,
                Description : project.Description,
                ProjectKey : project.ProjectKey,
                Labels : project.Labels,
                Priorities : project.Priorities,
                LeadId : project.Lead.Id
            };
            projectsService.addProject(projectModel)
                .then(function (response) {
                    $location.path('#/projects/' + response.data.Id);
                    toaster.pop('success', 'Project edited successfully', null, defaultNotificationTimeout);
                }, function (error) {
                    toaster.pop('error', 'Error', null, defaultNotificationTimeout)
                });
        }
    }
}());
