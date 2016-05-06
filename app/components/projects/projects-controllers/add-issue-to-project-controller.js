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
        'identificationService',
        'toaster'];

    function addIssueToProjectController(
        $scope,
        $routeParams,
        $location,
        usersService,
        projectsService,
        issuesService,
        identificationService,
        toaster) {
        var defaultNotificationTimeout = 2000;

        //attachProjectPriorities($routeParams.id);
        $scope.isAdmin = usersService.isAdministrator();

        projectsService.getProjectById($routeParams.id)
            .then(function (project) {
                console.log(project)
                $scope.currentProject = project.data;
                if(!$scope.isAdmin){
                    usersService.getCurrentUserInfo()
                        .then(function (user) {
                            console.log(user)
                            console.log(project.data)
                            $scope.isLead = (project.data.Lead.Id === user.Id);
                            if(!$scope.isLead){
                                $location.path('/');
                                toaster.pop('error', 'Unauthorized', null, defaultNotificationTimeout);
                                return;
                            }
                        });
                }
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

        //$scope.currentProject.Id = $routeParams.id;
        $scope.addIssue = addIssue;
        $scope.setIssueKey = setIssueKey;
        $scope.attachProjectPriorities = attachProjectPriorities;



        function addIssue(issue){
            issue.ProjectId = $scope.currentProject.Id;
            var issueModel = {
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
                    toaster.pop('success', 'Issue added successfully');
                    $location.path('/issues' + success.data.Id);
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
                    console.log(project)
                    $scope.issue.Priorities = project.data.Priorities;
                    console.log($scope.issue.Priorities)
                })
        }
    }
}());
