(function () {
	'use strict';
    angular.module('issueTrackingSystem.users.authenticationService', ['issueTrackingSystem.users.credentialsService'])
        .factory('authenticationService', [
            '$http',
            '$q',
            'BASE_URL',
            'credentialsService',
            function($http, $q, BASE_URL, credentialsService) {

                function registerUser(user) {
                    var deferred = $q.defer();

                    $http.post(BASE_URL + 'Users/Register', user)
                        .then(function(response) {
                            deferred.resolve(response.data);
                        }, function(error) {

                        });

                    return deferred.promise;
                }

                function loginUser(user) {
                    var deferred = $q.defer();

                    $http.post(BASE_URL + 'Users/Login', user)
                        .then(function(response) {
                            console.log(response.data);
                            deferred.resolve(response.data);
                        }, function() {

                        });

                    return deferred.promise;
                }

                function logout() {

                }

                function getLoggedUserData() {

                }

                function isAdmin() {
                    var currentUser = credentialsService.getLoggedUser();
                    return (currentUser != undefined) && (currentUser.isAdmin);
                }

                function isProjectLeader() {
                    var currentUser = credentialsService.getLoggedUser();
                    return (currentUser != undefined) && (currentUser.isProjectLeader);
                }

                return {
                    registerUser: registerUser,
                    loginUser: loginUser,
                    logout: logout,
                    isAdmin : isAdmin,
                    isProjectLeader : isProjectLeader
                }
            }]);
}());
