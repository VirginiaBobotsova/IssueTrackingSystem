(function () {
    'use strict';

    angular
        .module('issueTrackingSystem.projects.allProjects', [])
        .controller('AllProjectsController', getAllProjects);

    getAllProjects.$inject = [
        '$scope',
        'projectsService',
        'authenticationService'];

    function getAllProjects(
        $scope,
        projectsService,
        authenticationService) {
        projectsService.getAllProjects()
            .then(function (projects) {
                $scope.projects = projects.data;
                $scope.isAdmin = authenticationService.isAdministrator();
            });
    }
}());
