(function () {
    'use strict';

    angular
        .module('issueTrackingSystem.users.usersService', [])
        .factory('usersService', usersService);

    usersService.$inject = [
            '$q',
            '$http',
            'BASE_URL'];

    function usersService($q, $http, BASE_URL) {
        return {
            getCurrentUserInfo : getCurrentUserInfo,
            getUsers: getUsers,
            editUser: editUser,
            changePassword: changePassword,
            isAdministrator : isAdministrator,
            makeAdministrator : makeAdministrator
        };

        //function authHeader() {
          //  return {Authorization: sessionStorage['access_token']};
        //}

        function getCurrentUserInfo() {
            var deferred = $q.defer();
            $http.get(BASE_URL + 'users/me/')
                .then(function (success) {
                    deferred.resolve(success.data);
                }, function (error) {
                    deferred.reject(error);
                });

            return deferred.promise;
        }

        function getUsers() {
            var deferred = $q.defer();
            $http.get(BASE_URL + 'users')
                //{headers: authHeader()})
                .then(function (response) {
                    deferred.resolve(response.data);
                }, function (error) {
                    deferred.reject(error);
                });
            return deferred.promise;
        }

        function editUser(data) {
            var deferred = $q.defer();
            $http.put(BASE_URL + 'me', data)
                //{headers: authHeader()})
                .then(function (response) {
                    deferred.resolve(response);
                }, function (error) {
                    deferred.reject(error);
                });
            return deferred.promise;
        }

        function changePassword(data) {
            var deferred = $q.defer();
            $http.post(BASE_URL + 'api/account/changePassword', data)
                //{headers: authHeader()})
                .then(function (response) {
                    deferred.resolve(response);
                }, function (error) {
                    deferred.reject(error);
                });

            return deferred.promise;

        }

        function isAdministrator() {
            getCurrentUserInfo().then(function (success) {
                return success.isAdmin;
            })
        }

        function makeAdministrator(userId) {
            getCurrentUserInfo()
                .then(function (currentUser) {
                if (!currentUser.isAdmin) {
                    toaster.pop('error', 'Error');
                    return;
                }

                var deferred = $q.defer();
                var data = 'UserId=' + userId;
                $http.put(BASE_URL + 'users/makeadmin', data)
                    .then(function (success) {
                        deferred.resolve(success);
                    }, function (error) {
                        deferred.reject(error);
                    });

                return deferred.promise;
            }, function (error) {

            });
        }
    }
})();