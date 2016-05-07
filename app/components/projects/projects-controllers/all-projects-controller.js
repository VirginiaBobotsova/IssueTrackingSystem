(function () {
    'use strict';

    angular
        .module('issueTrackingSystem.projects.allProjects', [])
        .controller('AllProjectsController', allProjectsController);

    allProjectsController.$inject = [
        '$scope',
        'projectsService',
        'usersService'];

    function allProjectsController(
        $scope,
        projectsService,
        usersService) {
        $scope.isAdmin = usersService.isAdministrator();

        projectsService.getAllProjects()
            .then(function (projects) {
                $scope.projects = projects.data;
            });
    }
}());
