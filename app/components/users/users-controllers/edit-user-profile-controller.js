(function () {
    'use strict';

    angular
        .module('issueTrackingSystem.users.editProfile', [])
        .controller('EditProfileController', editUserProfile);

    editUserProfile.$inject = [
            '$scope',
            '$location',
            'usersService',
            'notifyService'];

    function editUserProfile(
        $scope,
        $location,
        usersService,
        notifyService) {
        $scope.editUser = function (user) {
            usersService.editUser(user)
                .then(function (response) {
                    $location.path('/');
                    notifyService.showInfo('Success');
                }, function (error) {
                    notifyService.showError('An error occurred');
                });
        };
    }
}());