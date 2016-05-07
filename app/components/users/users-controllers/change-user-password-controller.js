(function () {
    'use strict';

    angular
        .module('issueTrackingSystem.users.changePassword', [])
        .controller('ChangePasswordController', changeUserPasswordController);

    changeUserPasswordController.$inject = [
            '$scope',
            '$location',
            'usersService',
            'notifyService'];

    function changeUserPasswordController(
        $scope,
        $location,
        usersService,
        notifyService) {
        $scope.changePassword = changePassword;

        function changePassword(user) {
            usersService.changePassword(user)
                .then(function (success) {
                    $location.path('/');
                    notifyService.showInfo('The password is successfully changed');
                }, function (error) {
                    notifyService.showError('An error occurred');
                });
        }
    }
}());
