(function () {
    'use strict';

    angular
        .module('issueTrackingSystem.projects.addIssueToProject', [])
        .controller('AddIssueController', addIssue);

    addIssue.$inject = [
        '$scope',
        '$routeParams',
        '$location',
        'usersService',
        'projectsService',
        'identificationService',
        'toaster'];

    function addIssue(
        $scope,
        $routeParams,
        $location,
        usersService,
        projectsService,
        identificationService,
        toaster) {
        var defaultNotificationTimeout = 2000;

        $scope.isAdmin = identificationService.isAdministrator();


    }
}());
