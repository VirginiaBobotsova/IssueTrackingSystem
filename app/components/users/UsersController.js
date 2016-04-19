(function () {
	'use strict';
    angular.module('issueTrackingSystem.users', [])
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

                if($location.path() == '/users'){
                    getAllUsers();
                }

                if($location.path() === '/users/profile/password'){
                    changeUserPassword();
                }

                if($location.path() === '/users/profile'){
                    editUserProfile();
                 }

                if($location.path() === '/logout'){
                    logoutUser();
                }


                //authenticationService.getCurrentUser()
                  //  .then(function(user) {
                    //    $scope.currentUser = user;
                    //});

               // authenticationService.isAdministrator()
                 //   .then(function(data) {
                   //     $scope.isAdmin = data;
                    //});

                function getAllUsers() {
                    usersService.getUsers()
                        .then(function (users) {
                            $scope.users = users;
                        }, function (error) {
                            toaster.pop('error', 'Error', defaultNotificationTimeout)
                        });
                }

                function changeUserPassword() {
                    $scope.editPassword = function (user) {
                        usersService.editPassword(user)
                            .then(function (success) {
                                toaster.pop('success', 'Successfully changed password', defaultNotificationTimeout);
                                redirectToHome(defaultRedirectTimeout);
                            }, function (error) {
                                toaster.pop('error', 'Error', defaultNotificationTimeout)
                            });
                    };
                }

                function editUserProfile() {
                    $scope.editUser = function (user) {
                        usersService.editUser(user)
                            .then(function (response) {
                                toaster.pop('success', '', defaultNotificationTimeout);
                                redirectToHome(defaultRedirectTimeout)
                                  }, function (error) {
                                      toaster.pop('error', 'Error', defaultNotificationTimeout);
                                  });
                          };
                }

                function logoutUser() {
                    authenticationService.logout()
                        .then(function (data) {
                            $scope.sessionStorage.removeItem('access_token');
                            $scope.sessionStorage.removeItem('user');
                            toaster.pop('success', 'Logout successful!', defaultNotificationTimeout);
                            $route.reload();
                        }, function (error) {
                            toaster.pop('error', 'Logout error!', defaultNotificationTimeout);
                            redirectToHome(defaultRedirectTimeout);
                        })
                }

                function redirectToHome(time) {
                    $timeout(function () {
                        $location.path('/');
                    }, time);
                }
            }])
}());
