(function () {
    'use strict';

    angular
        .module('issueTrackingSystem.projects.editProject', [])
        .controller('EditProjectController', editProject);

    editProject.$inject = [
        '$scope',
        '$routeParams',
        '$location',
        'usersService',
        'projectsService',
        'identificationService',
        'toaster'];

    function editProject(
        $scope,
        $routeParams,
        $location,
        usersService,
        projectsService,
        identificationService,
        toaster) {
        var defaultNotificationTimeout = 2000;

        $scope.isAdmin = identificationService.isAdministrator();

        projectsService.getProjectById($routeParams.id)
            .then(function (project) {
                if(!$scope.isAdmin){
                    identificationService.getCurrentUserId()
                        .then(function (id) {
                            $scope.isLead = (project.data.Lead.Id === id);
                            if(!$scope.isLead){
                                $location.path('/');
                                toaster.pop('error', 'Unauthorized', defaultNotificationTimeout);
                                return;
                            }
                        });
                }
                $scope.project = projectsService.transformPrioritiesAndLabels(project.data);
                usersService.getUsers()
                    .then(function (data) {
                        $scope.users = data.users;
                    });
            });
        $scope.editProject = function (project) {
            $scope.project.Lead = {
                Id : project.Lead.Id,
                availableOptions : $scope.users};
            //delete project.Lead;

            projectsService.editProject(project)
                .then(function (response) {
                    $location.path('#/projects/' + project.Id);
                    toaster.pop('success', 'Project edited successfully', defaultNotificationTimeout);
                }, function (error) {
                    toaster.pop('error', 'Error', defaultNotificationTimeout);
                });
        };
    }
}());
