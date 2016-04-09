(function () {
	'use strict';
    angular.module('issueTrackingSystem.home', ['issueTrackingSystem.users.authenticationService',
            'issueTrackingSystem.users.credentialsService',
            'toaster'])
        .controller('homeController', [
            '$scope',
            '$route',
            '$timeout',
            '$location',
            'authenticationServise',
            'credentialsService',
            'toaster',
            function ($scope, $route, $timeout, $location, authenticationService, credentialsService, toaster) {
                var defaultNotificationTimeout = 2000;

                $scope.register = register;
                $scope.login = login;
                $scope.rememberMe = false;
                $scope.isLogged = credentialsService.checkForSessionToken();
                $scope.isProjectLeader = authenticationService.isProjectLeader();
                $scope.isAdmin = authenticationService.isAdmin();

                function register(user, registerForm) {
                    authenticationService.registerUser(user)
                        .then(function (data) {
                            credentialsService.saveLoggedUser(user);
                            credentialsService.saveTokenInSessionStorage(data.access_token, data.token_type);
                            $scope.registerForm.$setPristine();
                            toaster.pop('success', 'Register successful!', null, defaultNotificationTimeout);
                            reloadRoute(2000);
                        }, function (error) {
                            toaster.pop('error', 'Registration error!', error.data.message, defaultNotificationTimeout);
                        })
                }

                function login(user, loginForm) {
                    authenticationService.loginUser(user)
                        .then(function (data) {
                            if ($scope.rememberMe) {
                                $scope.$storage = credentialsService.saveTokenInLocalStorage(data.access_token, data.token_type);
                            } else {
                                $scope.$storage = credentialsService.saveTokenInSessionStorage(data.access_token, data.token_type);
                            }

                            authenticationService.getLoggedUserData()
                                .then(function (data) {
                                    credentialsService.saveLoggedUser(data);
                                    toaster.pop('success', 'Login successful!');
                                    $scope.loginForm.$setPristine();
                                    reloadRoute(1000);
                                }, function (error) {
                                    toaster.pop('error', 'Login error!', error.data.message, 1500);
                                    credentialsService.deleteCredentials();
                                    $route.reload();
                                });
                        }, function (error) {
                            toaster.pop('error', 'Login error!', error.error_description, 1500);
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