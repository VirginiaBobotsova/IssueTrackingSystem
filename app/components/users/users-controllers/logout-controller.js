(function () {
    'use strict';

    angular
        .module('issueTrackingSystem.users.logout', [])
        .controller('LogoutController', logoutUser);

    logoutUser.$inject = [
        '$scope',
        '$location',
        'authenticationService',
        'toaster'];

    function logoutUser(
        $scope,
        $location,
        authenticationService,
        toaster) {
        var defaultNotificationTimeout = 2000;

        $scope.logout = logout;

        function logout() {
        authenticationService.logout()
            .then(function(success) {
                $location.path('/');
                toaster.pop('success', 'Logout successful!', defaultNotificationTimeout);
            });
        }
    }
}());