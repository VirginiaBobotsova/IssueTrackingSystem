(function () {
    'use strict';

    angular
        .module('issueTrackingSystem.projects.allProjects', [])
        .controller('AllProjectsController', getAllProjects);

    getAllProjects.$inject = [
        '$scope',
        'projectsService',
        'usersService'];

    function getAllProjects(
        $scope,
        projectsService,
        usersService) {
        projectsService.getAllProjects()
            .then(function (projects) {
                $scope.projects = projects.data;
            });
    }
}());
