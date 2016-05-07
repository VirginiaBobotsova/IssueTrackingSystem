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
            'notifyService'];

    function getIssueController(
        $scope,
        $route,
        $routeParams,
        usersService,
        projectsService,
        issuesService,
        notifyService) {
        getIssue();

        $scope.changeIssueStatus = changeIssueStatus;

        function getIssue() {
            issuesService.getIssueById($routeParams.id)
                .then(function (issue) {
                    $scope.availableStatuses = issue.AvailableStatuses
                    usersService.getCurrentUserInfo()
                        .then(function (user) {
                                projectsService.getProjectById(issue.Project.Id)
                                    .then(function (response) {
                                        $scope.projectId = response.data.Id;
                                        $scope.isLead = (response.data.Lead.Id === user.Id);
                                        $scope.isAssignee = (issue.Assignee.Id === user.Id);
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

            $scope.addComment = function (comment) {
                var commentModel = {
                    Text : comment.Text
                };
                issuesService.addComment($routeParams.id, commentModel)
                    .then(function (response) {
                        $route.reload();
                        notifyService.showInfo('The comment is added successfully');
                        $scope.comment = response.data.Text;
                    }, function (error) {
                        notifyService.showError('An error occurred');
                    })
            };
        }

        function changeIssueStatus(issueId, statusId) {
            issuesService.editIssueCurrentStatus(issueId, statusId)
                .then(function (response) {
                    $route.reload();
                    notifyService.showInfo('The issue status is successfully applied');
                }, function (error) {
                    notifyService.showError('An error occurred');
                })
        }
    }
}());

