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
        'notifyService'];

    function editIssueController(
        $scope,
        $location,
        $route,
        $routeParams,
        usersService,
        projectsService,
        issuesService,
        notifyService) {
        issuesService.getIssueById($routeParams.id)
            .then(function (issue) {
                console.log(issue)
                $scope.issue = issuesService.transformLabels(issue);
                $scope.currentProjectId = issue.Project.Id;
                usersService.getCurrentUserInfo()
                    .then(function (user) {
                        $scope.isAdmin = user.isAdmin;
                        projectsService.getAllProjects()
                            .then(function (projects) {
                                $scope.projects = projects.data;
                                var currentProject = projects.data.filter(function (project) {
                                    return project.Id === issue.Project.Id
                                })[0];

                                console.log(currentProject)
                                console.log($scope.currentProjectId)
                                $scope.isLead = (currentProject.Lead.Id === user.Id);
                                if(!$scope.isAdmin) {
                                    if (!$scope.isLead) {
                                        notifyService.showError('Unauthorized');
                                        $location.path('/');
                                        return;
                                    }
                                }

                                $scope.issue.Priorities = currentProject.Priorities;

                                //attachProjectPriorities(issue.Project.Id)
                            });
                    });


            });

        usersService.getUsers()
            .then(function (users) {
                $scope.users = users;
            });

        $scope.editIssue = editIssue;
        $scope.changeIssueStatus = changeIssueStatus;

        function editIssue(issue) {
            issue.ProjectId = $scope.currentProjectId;
            var issueModel = {
                Id : issue.Id,
                Title: issue.Title,
                Description: issue.Description,
                DueDate: issue.DueDate,
                ProjectId: issue.ProjectId,
                AssigneeId: issue.Assignee.Id,
                PriorityId: issue.Priority.Id,
                Labels: issue.Labels
            };

            issuesService.editIssue(issueModel)
                .then(function (success) {
                    $route.reload();
                    notifyService.showInfo('The issue is edited successfully');
                }, function (error) {
                    notifyService.showError('An error occurred');
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
                    $route.reload();
                    notifyService.showInfo('The issue status is successfully applied');
                }, function (error) {
                    notifyService.showError('An error occurred');
                })
        }
    }
}());

