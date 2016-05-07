(function () {
	'use strict';

    angular
        .module('issueTrackingSystem.users.allUsers', [])
        .controller('AllUsersController', getAllUsersController);

    getAllUsersController.$inject = [
        '$scope',
        'usersService',
        'notifyService'];

    function getAllUsersController(
        $scope,
        usersService,
        notifyService) {
        usersService.getUsers()
            .then(function (users) {
                $scope.users = users;
            }, function (error) {
                notifyService.showError('An error occurred')
            });
    }
}());
