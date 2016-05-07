(function () {
    'use strict';

    angular
        .module('issueTrackingSystem.common.mainController', [])
        .controller('MainController', MainController);

    MainController.$inject = [
        '$scope',
        'identificationService'];

    function MainController($scope, identificationService) {
        identificationService.getCurrentUser()
            .then(function(user) {
                $scope.currentUser = user;
                $scope.isAuthenticated = true;
            });
    }
}());
