(function () {
    'use strict';

    angular
        .module('issueTrackingSystem.projects.addIssueToProject', [])
        .controller('AddIssueController', addIssueToProjectController);

    addIssueToProjectController.$inject = [
        '$scope',
        '$routeParams',
        '$location',
        'usersService',
        'projectsService',
        'issuesService',
        'notifyService'];

    function addIssueToProjectController(
        $scope,
        $routeParams,
        $location,
        usersService,
        projectsService,
        issuesService,
        notifyService) {
        usersService.getCurrentUserInfo()
            .then(function (data) {
            $scope.isAdmin = data.isAdmin;
        });

        projectsService.getProjectById($routeParams.id)
            .then(function (project) {
                $scope.currentProject = project.data;

                if(!$scope.isAdmin){
                    usersService.getCurrentUserInfo()
                        .then(function (user) {

                            $scope.isLead = (project.data.Lead.Id === user.Id);
                        });
                    if(!$scope.isLead){
                        $location.path('/');
                        notifyService.showError('Unauthorized');
                        return;
                    }
                }
            });

        projectsService.getAllProjects()
            .then(function(projects) {
                $scope.projects = projects.data;
            });

        usersService.getUsers()
            .then(function (users) {
                $scope.users = users;
            });

        $scope.addIssue = addIssue;
        $scope.setIssueKey = setIssueKey;
        $scope.attachProjectPriorities = attachProjectPriorities;

        function addIssue(issue){
            issue.ProjectId = $scope.currentProject.Id;
            var issueModel = {
                Id : issue.Id,
                Title: issue.Title,
                Description: issue.Description,
                IssueKey : issue.IssueKey,
                DueDate: issue.DueDate,
                ProjectId: issue.ProjectId,
                AssigneeId: issue.Assignee.Id,
                PriorityId: issue.Priority.Id,
                Labels: issue.Labels
            };
            issuesService.addIssue(issueModel)
                .then(function (success) {
                    $location.path('/issues/' + success.data.Id);
                    notifyService.showInfo('The issue is added successfully');
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
                    $scope.issue.Priorities = project.data.Priorities;
                })
        }
    }
}());
