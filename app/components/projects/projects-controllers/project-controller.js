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
                        issuesService.getCurrentUserIssues(999, 1)
                            .then(function (data) {
                                data.Issues.filter(function (issie) {
                                    return issie.Project.Id === $routeParams.id
                                });
                                if($scope.isLead || $scope.isAdmin){
                                $scope.projectIssues = data.Issues;
                                }
                            });
                    });
            })
    }
}());
