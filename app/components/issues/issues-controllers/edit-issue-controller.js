(function () {
    'use strict';

    angular
        .module('issueTrackingSystem.issues.editIssue', [])
        .controller('EditIssueController', editIssueController);

    editIssueController.$inject = [
        '$scope',
        '$location',
        '$route',
        '$routeParams',
        'usersService',
        'projectsService',
        'issuesService',
        'toaster'];

    function editIssueController(
        $scope,
        $location,
        $route,
        $routeParams,
        usersService,
        projectsService,
        issuesService,
        toaster) {
        var defaultNotificationTimeout = 2000;

        $scope.isAdmin = usersService.isAdministrator();

        issuesService.getIssueById($routeParams.id)
            .then(function (issue) {
                if(!$scope.isAdmin){
                    usersService.getCurrentUserInfo()
                        .then(function (user) {
                            projectsService.getAllProjects()
                                .then(function (projects) {
                                    var currentProject = projects.data.filter(function (project) {
                                        return project.Id === issue.Project.Id
                                    })[0];
                                    $scope.isLead = (currentProject.Lead.Id === user.Id);
                                    if(!$scope.isLead){
                                        toaster.pop('error', 'Unauthorized', null, defaultNotificationTimeout);
                                        $location.path('/');
                                        return;
                                    }

                                    $scope.projects = projects.data;
                                    attachProjectPriorities(issue.Project.Id)
                                });
                        });
                }
                $scope.issue = issuesService.transformLabels(issue.data);
            });

        usersService.getUsers()
            .then(function (users) {
                $scope.users = users;
            });

        $scope.editIssue = editIssue;
        $scope.changeIssueStatus = changeIssueStatus;

        function editIssue(issue) {
            var issueModel = {
                Title: issue.Title,
                Description: issue.Description,
                DueDate: issue.DueDate,
                ProjectId: issue.Project.Id,
                AssigneeId: issue.Assignee.Id,
                PriorityId: issue.Priority.Id,
                Labels: issue.Labels
            };

            issuesService.editIssue(issueModel)
                .then(function (success) {
                    $route.reload();
                    toaster.pop('success', 'Issue edited successfully', null, defaultNotificationTimeout);
                }, function (error) {
                    toaster.pop('error', 'Error', null, defaultNotificationTimeout);
                });
        }

        function attachProjectPriorities(projectId) {
            projectsService.getProjectById(projectId)
                .then(function(project) {
                    $scope.issue.Priorities = project.data.Priorities;
                })
        }

        function changeIssueStatus(issueId, statusId) {
            issuesService.editIssueCurrentStatus(issueId, statusId)
                .then(function (response) {
                    toaster.pop('success', 'Successfully applied issue status', null, defaultNotificationTimeout);
                    $route.reload();
                }, function (error) {
                    toaster.pop('error', 'Error', null, defaultNotificationTimeout);
                })
        }
    }
}());

