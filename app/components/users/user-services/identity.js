(function () {
    'use strict';

    angular
        .module('issueTrackingSystem.users.identity', [])
        .factory('identificationService', identificationService);

    identificationService.$inject = [
            '$http',
            '$q',
            'BASE_URL'];

    function identificationService($http, $q, BASE_URL) {
        return {
            login: login,
            register: register,
            getUserInfo: getUserInfo,
            isAuthenticated: isAuthenticated,
            isAdministrator: isAdministrator,
            getAllUsers: getAllUsers,
            getCurrentUserId: getCurrentUserId,
            logout : logout
        };

        function authHeader() {
            return {Authorization: sessionStorage['access_token']};
        }

        function login(loginData) {
            var deferred = $q.defer();

            $http.post(BASE_URL + 'api/token',
                'grant_type=password&username=' + loginData.username + '&password=' + loginData.password,
                {headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            }).then(function (response) {
                sessionStorage['access_token'] = 'Bearer ' + response.data.access_token;
                deferred.resolve(response);
            }, function (error) {
                deferred.reject(error)
            });

            return deferred.promise;
        }

        function register(registerData) {
            var deferred = $q.defer();

            $http.post(BASE_URL + 'api/account/register', registerData)
                .then(function (response) {
                    deferred.resolve(response);
                }, function (error) {
                    deferred.reject(error);
                });

            return deferred.promise;
        }

        function isAuthenticated() {
            return sessionStorage['access_token'];
        }

        function getUserInfo() {
            $http.get(BASE_URL + 'users/me', {
                headers: authHeader()
            }).then(function (response) {
                sessionStorage['userInfo'] = JSON.stringify(response.data);
            }, function (error) {
                console.log(error);
            });
        }

        function isAdministrator() {
            var userInfo = sessionStorage['userInfo'];
            if (userInfo) {
                var parseUserInfo = JSON.parse(userInfo);
                return parseUserInfo.isAdmin;
            }
        }

        function getAllUsers() {
            var deferred = $q.defer();

            $http.get(BASE_URL + 'users',
                {headers: authHeader()})
                .then(function (users) {
                deferred.resolve(users.data);
            }, function (error) {
                deferred.reject(error);
            });

            return deferred.promise;
        }

        function getCurrentUserId() {
            var deferred = $q.defer();
            var userInfo = sessionStorage['userInfo'];
            if (userInfo) {
                var id = JSON.parse(userInfo).Id;
                deferred.resolve(id);
            }else{
                deferred.reject();
            }
            return deferred.promise;
        }

        function logout(){
            var deferred = $q.defer();
            $http.post(BASE_URL + 'api/account/logout',
                {headers: authHeader()})
                .then(function (response) {
                    deferred.resolve(response.data);
                }, function (error) {
                    deferred.reject(error);
                });
            return deferred.promise;
        }
    }
})();
