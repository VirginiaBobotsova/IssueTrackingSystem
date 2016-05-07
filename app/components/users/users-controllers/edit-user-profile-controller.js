(function () {
    'use strict';

    angular
        .module('issueTrackingSystem.users.editProfile', [])
        .controller('EditProfileController', editUserProfile);

    editUserProfile.$inject = [
            '$scope',
            '$location',
            'usersService',
            'toaster'];

    function editUserProfile(
        $scope,
        $location,
        usersService,
        toaster) {
        var defaultNotificationTimeout = 2000;

        $scope.editUser = function (user) {
            usersService.editUser(user)
                .then(function (response) {
                    toaster.pop('success', 'Success', null, defaultNotificationTimeout);
                    $location.path('/')
                }, function (error) {
                    toaster.pop('error', 'Error', null, defaultNotificationTimeout);
                });
        };
    }
}());