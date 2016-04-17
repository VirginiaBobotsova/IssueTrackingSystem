(function () {
	'use strict';
    angular.module('issueTrackingSystem.issues', [])
        .controller('issuesController', [
            '$scope',
            '$location',
            '$route',
            '$routeParams',
            'usersService',
            'projectsService',
            'issuesService',
            'authenticationService',
            'toaster',
            function (
                $scope,
                $location,
                $route,
                $routeParams,
                usersService,
                projectsService,
                issuesService,
                authenticationService,
                toaster) {
                var defaultNotificationTimeout = 2000,
                    defaultReloadTimeout = 1000;

                if($location.path().match('\/(?!index\.html)(issues\/[0-9]+\/edit)')){
                    editIssue();
                }

                if($location.path().match('\/(?!index\.html)(issues\/[0-9]+)')){
                    getIssues();
                }

                if($location.path() == '/issues/add'){
                    addIssue();
                }

                function attachProjectPriorities(id) {
                    var project = $scope.projects.filter(function (project) {
                        return project.Id == id;
                    })[0];
                    $scope.issue.Priorities = project.Priorities;
                }

                function changeIssueStatus(issueId, statusId) {
                    issuesService.changeIssueStatus(issueId, statusId)
                        .then(function (response) {
                            toaster.pop('success', 'Successfully applied issue status');
                            reloadRoute(defaultReloadTimeout);
                        }, function (error) {
                            toaster.pop('error', 'Error');
                        })
                }

                function getIssues() {
                    issuesService.getCurrentUserIssues($routeParams.id)
                        .then(function (issue) {
                            authenticationService.getCurrentUserId()
                                .then(function (id) {
                                    projectsService.getProjectById(issue.data.Project.Id)
                                        .then(function (project) {
                                            $scope.isLead = (project.data.Lead.Id === id);
                                            $scope.isAssignee = (issue.data.Assignee.Id === id);
                                        });
                                });
                            $scope.issue = issuesService.transformLabels(issue.data);
                            issuesService.getIssueComments(issue.data.Id)
                                .then(function (comments) {
                                    $scope.issue.Comments = comments.data;
                                }, function (error) {
                                    deferred.reject(error);
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

                function addIssue() {
                    usersService.getUsers()
                        .then(function (users) {
                            $scope.users = users;
                        });
                    projectsService.getAllProjects()
                        .then(function (projects) {
                            $scope.projects = projects.data;
                        });
                    $scope.addIssue = function (issue) {
                        delete issue.Priorities;
                        issue.IssueKey = issue.Title.match(/\b(\w)/g).join('');

                        issuesService.addIssue(issue)
                            .then(function (success) {
                                redirectToHome(defaultReloadTimeout);
                                toaster.pop('success', 'Issue added successfully', defaultNotificationTimeout);
                            }, function (error) {
                                toaster.pop('error', 'Error', defaultNotificationTimeout);
                            });
                    };
                    $scope.attachProjectPriorities = attachProjectPriorities;
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
                                                    redirectToHome(defaultReloadTimeout);
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
                                reloadRoute(defaultReloadTimeout);
                                toaster.pop('success', 'Issue edited successfully');
                            }, function (error) {
                                toaster.pop('error', 'Error', defaultNotificationTimeout);
                            });
                    };
                }

                function reloadRoute(time) {
                    $timeout(function () {
                        $route.reload();
                    }, time);
                }

                function redirectToHome(time) {
                    $timeout(function () {
                        $location.path('/')
                    }, time);
                }
            }])
}());
