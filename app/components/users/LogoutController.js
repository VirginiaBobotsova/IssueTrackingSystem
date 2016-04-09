'use strict';

issueTrackingSystemApp.controller('LogoutController',
    ['$scope', '$location', '$timeout', 'userData', 'credentials', 'toaster', function ($scope, $location, $timeout, userData, credentials, toaster){
        $scope.logoutUser = logoutUser;
        $scope.logoutUser();

        function logoutUser() {
            userData.logout()
                .$promise
                .then(function (data) {
                    credentials.deleteCredentials();
                    toaster.pop('success', 'Logout successful!');
                    redirectToHome(2000);
                }, function (error) {
                    toaster.pop('error', 'Logout error!', error.data.message);
                    redirectToHome(2000);
                })
        }

        function redirectToHome(time) {
            $timeout(function () {
                $location.path('#/');
            }, time);
        }
    }
]);
