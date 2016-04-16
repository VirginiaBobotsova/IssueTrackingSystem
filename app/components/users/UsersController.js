(function () {
	'use strict';
    angular.module('issueTrackingSystem.users', [
        'issueTrackingSystem.users.usersService',
        'issueTrackingSystem.users.authentication'])
        .controller('usersController', [
            '$scope',
            '$timeout',
            '$location',
            'usersService',
            'authenticationService',
            'toaster',
            function (
                $scope,
                $timeout,
                $location,
                usersService,
                authenticationService,
                toaster) {
                var defaultNotificationTimeout = 2000,
                    defaultRedirectTimeout = 1000;

                authenticationService.getCurrentUser()
                    .then(function(user) {
                        $scope.currentUser = user;
                    });

                authenticationService.isAdministrator()
                    .then(function(data) {
                        $scope.isAdmin = data;
                    });

                $scope.changeUserPassword = changeUserPassword;
                $scope.editUserProfile = editUserProfile;
                $scope.logoutUser = logoutUser;

                function changeUserPassword(user, password, changePasswordForm) {
                    usersService.changePassword(password)
                        .then(function(data) {
                            $scope.changePasswordForm.$setPristine();
                            toaster.pop('success', 'Password change successful!', data.message, defaultNotificationTimeout);
                            redirectToHome(defaultRedirectTimeout);
                        }, function(error) {
                            toaster.pop('error', 'Change password error!', error.data.message, defaultNotificationTimeout);
                        })
                }

                function editUserProfile(user, editProfileForm) {
                    usersService.editUser(user)
                        .then(function (data) {
                            $scope.editProfileForm.$setPristine();
                            toaster.pop('success', 'Edit successful!', data.message, defaultNotificationTimeout);
                            $scope.editUser.name = user.name;
                            $scope.editUser.email = user.email;
                            redirectToWall($scope.editUser.username, defaultRedirectTimeout)
                        }, function (error) {
                            toaster.pop('error', 'Edit profile error!', error.data.message, defaultNotificationTimeout);
                        })
                }

                function logoutUser() {
                    authenticationService.logout()
                    .then(function (data) {
                        toaster.pop('success', 'Logout successful!', defaultNotificationTimeout);
                        redirectToHome(defaultRedirectTimeout);
                    }, function (error) {
                        toaster.pop('error', 'Logout error!', error.data.message, defaultNotificationTimeout);
                        redirectToHome(defaultRedirectTimeout);
                    })
                }

                function redirectToHome(time) {
                    $timeout(function () {
                        $location.path('/');
                    }, time);
                }

                function redirectToWall(user, time) {
                    $timeout(function () {
                        $location.path('/users/' + user)
                    }, time);
                }
            }
        ])
}());
