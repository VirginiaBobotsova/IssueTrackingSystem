(function () {
	'use strict';

    angular
        .module('issueTrackingSystem.projects.project', [])
        .controller('ProjectController', getProject);

    getProject.$inject = [
        '$scope',
        '$routeParams',
        'projectsService',
        'issuesService',
        'identificationService'];

    function getProject(
        $scope,
        $routeParams,
        projectsService,
        issuesService,
        identificationService) {
        projectsService.getProjectById($routeParams.id)
            .then(function (project) {
                identificationService.getCurrentUserId()
                    .then(function (id) {
                        $scope.isLead = (project.data.Lead.Id === id);
                        $scope.project = projectsService.transformPrioritiesAndLabels(project.data);
                        issuesService.getCurrentUserIssues(999, 1)
                            .then(function (data) {
                                var projectIssues = [];
                                data.Issues.filter(function (issie) {
                                    return issie.Project.Id === $routeParams.id
                                });
                                //if($scope.isLead || $scope.isAdmin){
                                $scope.projectIssues = data.Issues;
                                //}
                            });
                    });
            })
    }
}());
