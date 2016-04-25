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
        'authenticationService',
        'toaster'];

    function editIssueController(
        $scope,
        $location,
        $route,
        $routeParams,
        usersService,
        projectsService,
        issuesService,
        authenticationService,
        toaster) {
        var defaultNotificationTimeout = 2000;

        editIssue();

        function attachProjectPriorities(id) {
            var project = $scope.projects.filter(function (project) {
                return project.Id == id;
            })[0];
            $scope.issue.Priorities = project.Priorities;
        }

        function changeIssueStatus(issueId, statusId) {
            issuesService.changeIssueStatus(issueId, statusId)
                .then(function (response) {
                    toaster.pop('success', 'Successfully applied issue status', defaultNotificationTimeout);
                    $route.reload();
                }, function (error) {
                    toaster.pop('error', 'Error', defaultNotificationTimeout);
                })
        }

        function editIssue() {
            issuesService.getIssueById($routeParams.id)
                .then(function (issue) {
                    if(!$scope.isAdmin){
                        authenticationService.getCurrentUserId()
                            .then(function (id) {
                                projectsService.getAllProjects()
                                    .then(function (projects) {
                                        var currentProject = projects.data.filter(function (project) {
                                            return project.Id === issue.data.Project.Id
                                        })[0];
                                        $scope.isLead = (currentProject.Lead.Id === id);
                                        if(!$scope.isLead){
                                            $location.path('/');
                                            toaster.pop('error', 'Unauthorized', defaultNotificationTimeout);
                                            return;
                                        }

                                        $scope.projects = projects.data;
                                        attachProjectPriorities(issue.data.Project.Id);
                                    });
                            });
                    }
                    $scope.issue = issuesService.transformLabels(issue.data);
                    usersService.getUsers()
                        .then(function (users) {
                            $scope.users=users;
                        });

                });

            $scope.changeIssueStatus = changeIssueStatus;
            $scope.editIssue = function (issue) {
                var issueModel = {
                    Id: issue.Id,
                    Title: issue.Title,
                    Description: issue.Description,
                    DueDate: issue.DueDate,
                    AssigneeId: issue.Assignee.Id,
                    PriorityId: issue.Priority.Id,
                    Labels: issue.Labels
                };

                issuesService.editIssue(issueModel)
                    .then(function (success) {
                        $route.reload();
                        toaster.pop('success', 'Issue edited successfully');
                    }, function (error) {
                        toaster.pop('error', 'Error', defaultNotificationTimeout);
                    });
            };
        }
    }
}());

