(function () {
	'use strict';
    angular.module('issueTrackingSystem.home', [
        'issueTrackingSystem.users.userService',
        'issueTrackingSystem.users.identity',
        'toaster'])
        .controller('homeController', [
            '$scope',
            '$log',
            '$route',
            '$timeout',
            '$location',
            'userService',
            'identity',
            'toaster',
            function ($scope, $log, $route, $timeout, $location, userService, identity, toaster) {
                var defaultNotificationTimeout = 2000,
                    defaultReloadTimeout = 1000;

                identity.getCurrentUser()
                    .then(function(user) {
                        $scope.currentUser = user;
                    });

                $scope.isAuthenticated = identity.isAuthenticated();
                $scope.register = register;
                $scope.login = login;
                $scope.rememberMe = false;

                //$scope.isLogged = $scope.isAuthenticated;
                //$scope.isLogged = credentialsService.checkForSessionToken();
                //$scope.isProjectLeader = userService.isProjectLeader();
                //$scope.isAdmin = userService.isAdmin();

                function register(user, registerForm) {
                    userService.registerUser(user)
                        .then(function (data) {
                            console.log(data);
                            //credentialsService.saveLoggedUser(user);
                            //credentialsService.saveTokenInSessionStorage(data.access_token, data.token_type);
                            $scope.registerForm.$setPristine();
                            toaster.pop('success', 'Register successful!', null, defaultNotificationTimeout);
                            $location.path('/');
                        }, function (error) {
                            toaster.pop('error', 'Registration error!', error.data, defaultNotificationTimeout);
                        })
                }

                function login(user, loginForm) {
                    userService.loginUser(user)
                        .then(function (data) {
                            //if ($scope.rememberMe) {
                                //$scope.$storage = credentialsService.saveTokenInLocalStorage(data.access_token, data.token_type);
                            //} else {
                                //$scope.$storage = credentialsService.saveTokenInSessionStorage(data.access_token, data.token_type);
                            //}

                            userService.getLoggedUserData()
                                .then(function (data) {
                                    //credentialsService.saveLoggedUser(data);
                                    toaster.pop('success', 'Login successful!', defaultNotificationTimeout);
                                    $scope.loginForm.$setPristine();
                                    reloadRoute(defaultReloadTimeout);
                                }, function (error) {
                                    toaster.pop('error', 'Login error!', defaultNotificationTimeout);
                                    //credentialsService.deleteCredentials();
                                    $route.reload();
                                });
                        }, function (error) {
                            toaster.pop('error', 'Login error!', defaultNotificationTimeout);
                        });
                }

                function redirectToHome(time) {
                    $timeout(function () {
                        $location.path('/');
                    }, time);
                }

                function reloadRoute(time) {
                    $timeout(function () {
                        $route.reload();
                    }, time);
                }
            }
        ])
}());