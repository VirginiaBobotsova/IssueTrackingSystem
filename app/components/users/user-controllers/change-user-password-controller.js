(function () {
    'use strict';

    angular
        .module('issueTrackingSystem.users.changePassword', [])
        .controller('ChangePasswordController', changeUserPassword);

    changeUserPassword.$inject = [
            '$scope',
            '$location',
            'usersService',
            'toaster'];

    function changeUserPassword(
        $scope,
        $location,
        usersService,
        toaster) {
        var defaultNotificationTimeout = 2000;

        $scope.editPassword = function (user) {
            usersService.editPassword(user)
                .then(function (success) {
                    toaster.pop('success', 'Successfully changed password', defaultNotificationTimeout);
                    $location.path('/');
                }, function (error) {
                    toaster.pop('error', 'Error', defaultNotificationTimeout)
                });
        };
    }
}());
