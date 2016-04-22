(function () {
    'use strict';

    angular
        .module('issueTrackingSystem.users.logout', [])
        .controller('LogoutController', logoutUser);

    logoutUser.$inject = [
            '$scope',
            '$timeout',
            '$location',
            'usersService',
            'identificationService',
            'toaster'];

            function logoutUser(
                $scope,
                $location,
                identificationService,
                toaster) {
                var defaultNotificationTimeout = 2000;

                identificationService.logout()
                    .then(function (data) {
                        $scope.sessionStorage.removeItem('access_token');
                        $scope.sessionStorage.removeItem('user');
                        toaster.pop('success', 'Logout successful!', defaultNotificationTimeout);
                        $route.reload();
                    }, function (error) {
                        toaster.pop('error', 'Logout error!', defaultNotificationTimeout);
                        $location.path('/');
                    });
            }
}());