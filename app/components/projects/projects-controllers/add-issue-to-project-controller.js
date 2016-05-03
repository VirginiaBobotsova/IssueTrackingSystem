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
        'identificationService',
        'toaster'];

    function addIssueToProject(
        $scope,
        $location,
        usersService,
        projectsService,
        identificationService,
        toaster) {
        var defaultNotificationTimeout = 2000;

        projectsService.getProject($routeParams.id)
            .then(function (project) {
                $scope.project = project;
            });

        usersService.getUsers()
            .then(function (users) {
                $scope.users = users;
            });

        $scope.addIssue = addIssue;
        $scope.setIssueKey = setIssueKey;
        $scope.attachProjectPriorities = attachProjectPriorities;



        function addIssue(issue){
            issue.ProjectId = $routeParams.id;
            projectsService.addIssueToProject(issue)
                .then(function (success) {
                    $location.path('/issues' + success.data.Id);
                    toaster.pop('success', 'Issue added successfully');
                });
        }

        function setIssueKey(){
            if($scope.issue.Title){
                $scope.issue.IssueKey = $scope.issue.Title.match(/\b(\w)/g).join('');
            }else{
                $scope.issue.IssueKey = '';
            }
        }

        function attachProjectPriorities() {
            var project = $scope.project;
            $scope.issue.Priorities = project.Priorities;
        }
    }
}());
