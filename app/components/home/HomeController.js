(function () {
	'use strict';
    angular.module('issueTrackingSystem.home', [
        'issueTrackingSystem.users.userService',
        'issueTrackingSystem.users.credentialsService',
        'toaster'])
        .controller('homeController', [
            '$scope',
            '$route',
            '$timeout',
            '$location',
            'userService',
            'credentialsService',
            'toaster',
            function ($scope, $route, $timeout, $location, userService, credentialsService, toaster) {
                var defaultNotificationTimeout = 2000,
                    defaultReloadTimeout = 1000;


                $scope.register = register;
                $scope.login = login;
                $scope.rememberMe = false;
                $scope.isLogged = credentialsService.checkForSessionToken();
                $scope.isProjectLeader = userService.isProjectLeader();
                $scope.isAdmin = userService.isAdmin();

                function register(user, registerForm) {
                    userService.registerUser(user)
                        .then(function (data) {
                            credentialsService.saveLoggedUser(user);
                            credentialsService.saveTokenInSessionStorage(data.access_token, data.token_type);
                            $scope.registerForm.$setPristine();
                            toaster.pop('success', 'Register successful!', null, defaultNotificationTimeout);
                            reloadRoute(defaultReloadTimeout);
                        }, function (error) {
                            toaster.pop('error', 'Registration error!', error.data.message, defaultNotificationTimeout);
                        })
                }

                function login(user, loginForm) {
                    userService.loginUser(user)
                        .then(function (data) {
                            if ($scope.rememberMe) {
                                $scope.$storage = credentialsService.saveTokenInLocalStorage(data.access_token, data.token_type);
                            } else {
                                $scope.$storage = credentialsService.saveTokenInSessionStorage(data.access_token, data.token_type);
                            }

                            userService.getLoggedUserData()
                                .then(function (data) {
                                    credentialsService.saveLoggedUser(data);
                                    toaster.pop('success', 'Login successful!');
                                    $scope.loginForm.$setPristine();
                                    reloadRoute(defaultReloadTimeout);
                                }, function (error) {
                                    toaster.pop('error', 'Login error!', error.data.message, defaultNotificationTimeout);
                                    credentialsService.deleteCredentials();
                                    $route.reload();
                                });
                        }, function (error) {
                            toaster.pop('error', 'Login error!', error.error_description, defaultNotificationTimeout);
                        });
                }


                function reloadRoute(time) {
                    $timeout(function () {
                        $route.reload();
                    }, time);
                }
            }
        ])
}());