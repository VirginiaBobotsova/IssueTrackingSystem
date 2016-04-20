(function () {
    'use strict';

    angular.module('issueTrackingSystem.users.usersService', [])
        .factory('usersService', [
            '$q',
            '$http',
            'BASE_URL',
            function ($q, $http, BASE_URL) {
                function authHeader() {
                    return {Authorization: sessionStorage['access_token']};
                }

                function getUsers(){
                    var deferred = $q.defer();
                    $http.get(BASE_URL + 'users',
                        {headers: authHeader()})
                        .then(function (response) {
                            deferred.resolve(response.data);
                        }, function (error) {
                            deferred.reject(error);
                        });
                    return deferred.promise;
                }
                function editUser(user){
                    var deferred = $q.defer();
                    $http.put(BASE_URL + 'me', user,
                        {headers: authHeader()})
                        .then(function (response) {
                            deferred.resolve(response);
                        }, function (error) {
                            deferred.reject(error);
                        });
                    return deferred.promise;
                }
                function changePassword(user){
                    var deferred = $q.defer();
                    $http.post(BASE_URL + 'api/account/changePassword', user,
                        {headers: authHeader()})
                        .then(function (response) {
                            deferred.resolve(response);
                        }, function (error) {
                            deferred.reject(error);
                        });

                    return deferred.promise;
                }
                return {
                    getUsers: getUsers,
                    editUser: editUser,
                    changePassword: changePassword
                }
            }])
})();