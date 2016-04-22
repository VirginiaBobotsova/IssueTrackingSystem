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
        'identificationService',
        'toaster'];

    function addProject(
        $scope,
        $location,
        usersService,
        projectsService,
        identificationService,
        toaster) {
        var defaultNotificationTimeout = 2000;

        $scope.isAdmin = identificationService.isAdministrator();

            usersService.getUsers()
                .then(function (users) {
                    $scope.users = users;
                });
            $scope.addProject = function (project) {
                projectsService.addProject(project)
                    .then(function (response) {
                        $location.path('#/projects/' + response.data.Id);
                        toaster.pop('success', 'Project edited successfully', defaultNotificationTimeout);
                    }, function (error) {
                        toaster.pop('error', 'Error', defaultNotificationTimeout)
                    });
            }
    }
}());
