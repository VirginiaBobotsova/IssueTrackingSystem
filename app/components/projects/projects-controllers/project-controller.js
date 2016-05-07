(function () {
	'use strict';

    angular
        .module('issueTrackingSystem.projects.getProject', [])
        .controller('ProjectController', getProjectController);

    getProjectController.$inject = [
        '$scope',
        '$routeParams',
        'projectsService',
        'issuesService',
        'usersService'];

    function getProjectController(
        $scope,
        $routeParams,
        projectsService,
        issuesService,
        usersService) {
        projectsService.getProjectById($routeParams.id)
            .then(function (project) {
                usersService.getCurrentUserInfo()
                    .then(function (user) {
                        $scope.isAdmin = user.isAdmin;
                        $scope.isLead = (project.data.Lead.Id === user.Id);
                        $scope.project = projectsService.transformPrioritiesAndLabels(project.data);
                        if($scope.isLead || $scope.isAdmin) {
                            projectsService.getProjectIssues($routeParams.id)
                                .then(function (data) {
                                    $scope.projectIssues = data;
                                });
                        } else {
                            issuesService.getCurrentUserIssues(999, 1)
                                .then(function (data) {
                                    var projectIssues;
                                    projectIssues = data.Issues.filter(function (issie) {
                                        return issie.Project.Id === project.Id
                                    });
                                    $scope.projectIssues = projectIssues;
                                });
                        }
                    });
            })
    }
}());
