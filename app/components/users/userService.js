(function () {
	'use strict';
    angular.module('issueTrackingSystem.users.userService', [])
        .factory('userService', [
            '$http',
            '$q',
            'BASE_URL',
            function($resource, $http, $q, BASE_URL, credentialsService) {

                function registerUser(user) {
                    var deferred = $q.defer();

                    $http.post(BASE_URL + 'Account/Register', user)
                        .then(function (response) {
                            deferred.resolve(response.data);
                        }, function (error) {

                        });

                    return deferred.promise;
                }

                function loginUser(user) {
                    var deferred = $q.defer();

                    $http.post(BASE_URL + 'Account/Login', user)
                        .then(function(response) {
                            console.log(response.data);
                            deferred.resolve(response.data);
                        }, function() {

                        });

                    return deferred.promise;
                }

                function logout() {
                    //var authorization = credentialsService.getAuthorization();
                    var deferred = $q.defer();
                    $http.post(BASE_URL + 'users/Logout')
                        .then(function(responce) {
                            deferred.resolve(responce);
                        }, function (error) {
                            deferred.reject(error);
                        });

                    return deferred.promise;
                }

                function getLoggedUserData() {
                    //var authorization = credentialsService.getAuthorization();
                    var deferred = $q.defer();
                    $http.get(BASE_URL + 'me')
                        .then(function (response) {
                            deferred.resolve(response)
                        }, function(error) {
                            deferred.reject(error);
                        });

                    return deferred.promise;
                }

                function changePassword(password) {
                    //var authorization = credentialsService.getAuthorization();
                    var deferred = $q.defer();
                    $http.put(BASE_URL + 'me/ChangePassword', password)
                        .then(function(responce) {
                            deferred.resolve(responce.data);
                        }, function(error) {
                            deferred.reject(error);
                        });

                    return deferred.promise;
                }

                function editUser(user) {
                    //var authorization = credentialsService.getAuthorization();
                    var deferred = $q.defer();
                    $http.put(BASE_URL + 'me', user)
                        .then(function (responce) {
                            deferred.resolve(responce.data);
                        }, function(error) {
                            deferred.reject(error);
                        });

                    return deferred.promise;
                }

                //function isAdmin() {
                    //var currentUser = credentialsService.getLoggedUser();
                    //return (currentUser != undefined) && (currentUser.isAdmin);
                //}

                //function isProjectLeader() {
                   // var currentUser = credentialsService.getLoggedUser();
                   // return (currentUser != undefined) && (currentUser.isProjectLeader);
                //}

                return {
                    registerUser: registerUser,
                    loginUser: loginUser,
                    logout: logout,
                    //isAdmin : isAdmin,
                    //isProjectLeader : isProjectLeader,
                    changePassword : changePassword,
                    editUser : editUser,
                    getLoggedUserData : getLoggedUserData
                }
            }]);
}());
