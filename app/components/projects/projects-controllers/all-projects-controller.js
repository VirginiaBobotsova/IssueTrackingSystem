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
        usersService.getCurrentUserInfo()
            .then(function (data) {
            $scope.isAdmin = data.isAdmin;
        });

        projectsService.getAllProjects()
            .then(function (projects) {
                $scope.projects = projects.data;
            });
    }
}());
