(function () {
    'use strict';

    angular
        .module('issueTrackingSystem.projects.editProject', [])
        .controller('EditProjectController', editProject);

    editProject.$inject = [
        '$scope',
        '$routeParams',
        '$location',
        'usersService',
        'projectsService',
        'authenticationService',
        'toaster'];

    function editProject(
        $scope,
        $routeParams,
        $location,
        usersService,
        projectsService,
        authenticationService,
        toaster) {
        var defaultNotificationTimeout = 2000;

        $scope.isAdmin = usersService.isAdministrator();

        projectsService.getProjectById($routeParams.id)
            .then(function (project) {
                if(!$scope.isAdmin){
                    usersService.getCurrentUserInfo()
                        .then(function (user) {
                            console.log(user)
                            console.log(project.data)
                            $scope.isLead = (project.data.Lead.Id === user.Id);
                            if(!$scope.isLead){
                                $location.path('/');
                                toaster.pop('error', 'Unauthorized', null, defaultNotificationTimeout);
                                return;
                            }
                        });
                }
                $scope.project = projectsService.transformPrioritiesAndLabels(project.data);
                $scope.projectCurrentLeadId = project.data.Lead.Id
            });
        usersService.getUsers()
            .then(function (users) {
                console.log(users)
                $scope.users = users;
            });

        $scope.editProject = editProject;

        function editProject(project) {
            project.ProjectKey = $scope.project.ProjectKey;
            project.projectLeadId = $scope.projectCurrentLeadId;
            var projectModel = {
                Name : project.Name,
                Description : project.Description,
                ProjectKey : project.ProjectKey,
                Labels : project.Labels,
                Priorities : project.Priorities,
                LeadId : project.projectLeadId
            };
            projectsService.editProject(projectModel)
                .then(function (success) {
                    console.log(success)
                    toaster.pop('success', 'Project edited successfully', null, defaultNotificationTimeout);
                    $location.path('/projects/' + success.data.Id);
                }, function (error) {
                    toaster.pop('error', 'Error', null, defaultNotificationTimeout);
                });
        }
    }
}());
