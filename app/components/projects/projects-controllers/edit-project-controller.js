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
        'authenticationService',
        'toaster'];

    function editProject(
        $scope,
        $routeParams,
        $location,
        usersService,
        projectsService,
        authenticationService,
        toaster) {
        var defaultNotificationTimeout = 2000;

        $scope.isAdmin = usersService.isAdministrator();

        projectsService.getProjectById($routeParams.id)
            .then(function (project) {
                if(!$scope.isAdmin){
                    usersService.getCurrentUserInfo()
                        .then(function (data) {
                            console.log(data)
                            console.log(project.data)
                            $scope.isLead = (project.data.Lead.Id === data.Id);
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
                        console.log(data)
                        $scope.users = data;
                    });
            });
        $scope.editProject = function (project) {
            projectsService.editProject(project)
                .then(function (response) {
                    console.log(response)
                    $location.path('#/projects/' + project.Id);
                    toaster.pop('success', 'Project edited successfully', null, defaultNotificationTimeout);
                }, function (error) {
                    toaster.pop('error', 'Error', null, defaultNotificationTimeout);
                });
        };
    }
}());
