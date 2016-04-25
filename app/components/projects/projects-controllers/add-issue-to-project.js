(function () {
    'use strict';

    angular
        .module('issueTrackingSystem.projects.addIssueToProject', [])
        .controller('AddIssueController', addIssueToProject);

    addIssueToProject.$inject = [
        '$scope',
        '$location',
        'usersService',
        'projectsService',
        'authenticationService',
        'toaster'];

    function addIssueToProject(
        $scope,
        $location,
        usersService,
        projectsService,
        authenticationService,
        toaster) {
        var defaultNotificationTimeout = 2000;

        addIssue();

        $scope.isAdmin = authenticationService.isAdministrator();

        function attachProjectPriorities(id) {
            var project = $scope.projects.filter(function (project) {
                return project.Id == id;
            })[0];
            $scope.issue.Priorities = project.Priorities;
        }


        function addIssue() {
            usersService.getUsers()
                .then(function (users) {
                    $scope.users = users;
                });
            projectsService.getAllProjects()
                .then(function (projects) {
                    $scope.projects = projects.data;
                });
            $scope.addIssue = function (issue) {
                delete issue.Priorities;
                issue.IssueKey = issue.Title.match(/\b(\w)/g).join('');

                issuesService.addIssue(issue)
                    .then(function (success) {
                        $location.path('/');
                        toaster.pop('success', 'Issue added successfully', defaultNotificationTimeout);
                    }, function (error) {
                        toaster.pop('error', 'Error', defaultNotificationTimeout);
                    });
            };
            $scope.attachProjectPriorities = attachProjectPriorities;
        }
    }
}());
