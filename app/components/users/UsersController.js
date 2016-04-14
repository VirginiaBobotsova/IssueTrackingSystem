(function () {
	'use strict';
    angular.module('issueTrackingSystem.users', [
        'issueTrackingSystem.users.userService',
        'issueTrackingSystem.users.identity',
        'issueTrackingSystem.users.authentication'])
        .controller('usersController', [
            '$scope',
            '$timeout',
            '$location',
            'userService',
            'identificationService',
            'authenticationService',
            'toaster',
            function (
                $scope,
                $timeout,
                $location,
                userService,
                identificationService,
                authenticationService,
                toaster) {
                var defaultNotificationTimeout = 2000,
                    defaultRedirectTimeout = 1000;

                identificationService.getCurrentUser()
                    .then(function(user) {
                        $scope.currentUser = user;
                    });

                identificationService.isAdmin()
                    .then(function(data) {
                        $scope.isAdmin = data;
                    });

                $scope.changeUserPassword = changeUserPassword;
                $scope.editUserProfile = editUserProfile;
                $scope.logoutUser = logoutUser;

                function changeUserPassword(user, password, changePasswordForm) {
                    userService.changePassword(password)
                        .then(function(data) {
                            $scope.changePasswordForm.$setPristine();
                            toaster.pop('success', 'Password change successful!', data.message, defaultNotificationTimeout);
                            redirectToHome(defaultRedirectTimeout);
                        }, function(error) {
                            toaster.pop('error', 'Change password error!', error.data.message, defaultNotificationTimeout);
                        })
                }

                function editUserProfile(user, editProfileForm) {
                    userService.editUser(user)
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
                        identificationService.removeCookie();
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
