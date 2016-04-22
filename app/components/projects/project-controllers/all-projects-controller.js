(function () {
    'use strict';

    angular
        .module('issueTrackingSystem.projects.allProjects', [])
        .controller('AllProjectsController', getAllProjects);

    getAllProjects.$inject = [
        '$scope',
        'projectsService',
        'identificationService'];

    function getAllProjects(
        $scope,
        projectsService,
        identificationService) {
        projectsService.getAllProjects()
            .then(function (projects) {
                $scope.projects = projects.data;
                $scope.isAdmin = identificationService.isAdministrator();
            });
    }
}());
