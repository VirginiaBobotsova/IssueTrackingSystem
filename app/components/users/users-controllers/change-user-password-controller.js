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

        $scope.changePassword = changePassword;

        function changePassword(user) {
            usersService.changePassword(user)
                .then(function (success) {
                    toaster.pop('success', 'Successfully changed password', null, defaultNotificationTimeout);
                    $location.path('/');
                }, function (error) {
                    toaster.pop('error', 'Error', null, defaultNotificationTimeout)
                });
        }
    }
}());
