(function () {
    'use strict';

    angular
        .module('issueTrackingSystem.issues.getIssue', [])
        .controller('IssueController', getIssueController);

    getIssueController.$inject = [
            '$scope',
            '$route',
            '$routeParams',
            'projectsService',
            'issuesService',
            'authenticationService',
            'toaster'];

    function getIssueController(
        $scope,
        $route,
        $routeParams,
        projectsService,
        issuesService,
        authenticationService,
        toaster) {
        var defaultNotificationTimeout = 2000;

        getIssue();

        function changeIssueStatus(issueId, statusId) {
            issuesService.changeIssueStatus(issueId, statusId)
                .then(function (response) {
                    toaster.pop('success', 'Successfully applied issue status', defaultNotificationTimeout);
                    $route.reload();
                }, function (error) {
                    toaster.pop('error', 'Error', defaultNotificationTimeout);
                })
        }

        function getIssue() {
            issuesService.getCurrentUserIssues()
                .then(function (data) {
                    authenticationService.getCurrentUserId()
                        .then(function (id) {
                            data.Issues.forEach(function (issue) {
                                projectsService.getProjectById(issue.Project.Id)
                                    .then(function (response) {
                                        $scope.isLead = (response.data.Lead.Id === id);
                                        $scope.isAssignee = (issue.Assignee.Id === id);
                                        $scope.isAdmin = issue.Assignee.isAdmin;
                                    });
                                $scope.issue = issuesService.transformLabels(issue);
                                issuesService.getIssueComments(issue.Id)
                                    .then(function (comments) {
                                        $scope.issue.Comments = comments.data;
                                    }, function (error) {
                                        deferred.reject(error);
                                    });
                            })
                        });

                });

            $scope.addComment = function (comment) {
                issuesService.addComment($routeParams.id, comment)
                    .then(function (response) {
                        toaster.pop('success', 'Comment added successfully', defaultNotificationTimeout);
                        $scope.issue.Comments = response.data;
                    }, function (error) {
                        toaster.pop('error', 'Error', defaultNotificationTimeout);
                    })
            };
            $scope.changeIssueStatus = changeIssueStatus;
        }
    }
}());

