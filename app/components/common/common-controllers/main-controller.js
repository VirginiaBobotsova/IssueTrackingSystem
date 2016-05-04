(function () {
    'use strict';

    angular
        .module('issueTrackingSystem.common.mainController', [])
        .controller('MainController', MainController);

    MainController.$inject = [
        '$scope',
        'identificationService',
        'usersService'];

    function MainController($scope, identificationService, usersService) {
        identificationService.getCurrentUser()
            .then(function(user) {
                console.log(user)
                $scope.currentUser = user;
                $scope.isAuthenticated = true;
                //$scope.isAdmin = user.isAdmin;
            });
    }
}());
