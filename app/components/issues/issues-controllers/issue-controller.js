(function () {
    'use strict';

    angular
        .module('issueTrackingSystem.issues.getIssue', [])
        .controller('IssueController', getIssueController);

    getIssueController.$inject = [
            '$scope',
            '$route',
            '$routeParams',
            'usersService',
            'projectsService',
            'issuesService',
            'toaster'];

    function getIssueController(
        $scope,
        $route,
        $routeParams,
        usersService,
        projectsService,
        issuesService,
        toaster) {
        var defaultNotificationTimeout = 2000;

        getIssue();

        $scope.changeIssueStatus = changeIssueStatus;

        function getIssue() {
            issuesService.getIssueById($routeParams.id)
                .then(function (issue) {
                    $scope.availableStatuses = issue.AvailableStatuses;
                    console.log(issue)
                    console.log($scope.availableStatuses)
                    usersService.getCurrentUserInfo()
                        .then(function (user) {
                                projectsService.getProjectById(issue.Project.Id)
                                    .then(function (response) {
                                        console.log(response)
                                        $scope.isLead = (response.data.Lead.Id === user.Id);
                                        $scope.isAssignee = (issue.Assignee.Id === user.Id);
                                        $scope.isAdmin = issue.Assignee.isAdmin;
                                    });
                                $scope.issue = issuesService.transformLabels(issue);
                                issuesService.getIssueComments(issue.Id)
                                    .then(function (comments) {
                                        console.log(comments)
                                        $scope.issue.Comments = comments.data;
                                    }, function (error) {
                                        deferred.reject(error);
                                    });
                            })
                });

            $scope.addComment = function (comment) {
                var commentModel = {
                    Text : comment.Text
                };
                issuesService.addComment($routeParams.id, commentModel)
                    .then(function (response) {
                        $route.reload();
                        toaster.pop('success', 'Comment added successfully', null, defaultNotificationTimeout);
                        $scope.comment = response.data.Text;
                    }, function (error) {
                        toaster.pop('error', 'Error', null, defaultNotificationTimeout);
                    })
            };
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

