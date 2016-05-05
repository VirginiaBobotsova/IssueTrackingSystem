(function () {
    'use strict';

    angular
        .module('issueTrackingSystem.projects.addIssueToProject', [])
        .controller('AddIssueController', addIssueToProject);

    addIssueToProject.$inject = [
        '$scope',
        '$routeParams',
        '$location',
        'usersService',
        'projectsService',
        'issuesService',
        'identificationService',
        'toaster'];

    function addIssueToProject(
        $scope,
        $routeParams,
        $location,
        usersService,
        projectsService,
        issuesService,
        identificationService,
        toaster) {
        var defaultNotificationTimeout = 2000;

        projectsService.getProjectById($routeParams.id)
            .then(function (project) {
                console.log(project)
                $scope.project = project.data;
            });

        projectsService.getAllProjects()
            .then(function(projects) {
                console.log(projects.data)
                $scope.projects = projects.data;
            });

        usersService.getUsers()
            .then(function (users) {
                $scope.users = users;
            });

        $scope.selectedProjectId = $routeParams.id;
        $scope.addIssue = addIssue;
        $scope.setIssueKey = setIssueKey;
        $scope.attachProjectPriorities = attachProjectPriorities;



        function addIssue(issue){
            //issue.Project.Id = $scope.selectedProjectId;
            issuesService.addIssue(issue)
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

        function attachProjectPriorities(projectId) {
            projectsService.getProjectById(projectId)
                .then(function(project) {
                    $scope.issue.Priorities = project.Priorities;
                })
        }
    }
}());
