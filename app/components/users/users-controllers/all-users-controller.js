(function () {
	'use strict';

    angular
        .module('issueTrackingSystem.users.allUsers', [])
        .controller('AllUsersController', getAllUsers);

    getAllUsers.$inject = [
        '$scope',
        'usersService',
        'toaster'];

    function getAllUsers(
        $scope,
        usersService,
        toaster) {
        var defaultNotificationTimeout = 2000;

        usersService.getUsers()
            .then(function (users) {
                $scope.users = users;
            }, function (error) {
                toaster.pop('error', 'Error', null, defaultNotificationTimeout)
            });
    }
}());
