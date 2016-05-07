(function () {
    'use strict';

    angular
        .module('issueTrackingSystem.users.authentication', ['ngCookies'])
        .factory('authenticationService', authenticationService);

    authenticationService.$inject = [
        '$http',
        '$cookieStore',
        '$q',
        'identificationService',
        'BASE_URL'];

    function authenticationService($http, $cookieStore, $q, identificationService, BASE_URL) {
        var AUTHENTICATION_COOKIE_KEY = '!__Authentication_Cookie_Key__!';

        return {
            register: register,
            login: login,
            logout: logout,
            isAuthenticated: isAuthenticated,
            refreshCookie: refreshCookie
        };

        function preserveUserData(data) {
            var accessToken = data.access_token;
            $http.defaults.headers.common.Authorization = 'Bearer ' + accessToken;
            $cookieStore.put(AUTHENTICATION_COOKIE_KEY, accessToken)
        }

        function register(user) {
            var deferred = $q.defer();

            $http.post(BASE_URL + 'api/account/register', user)
                .then(function (response) {
                   deferred.resolve(response.data);
                });

            return deferred.promise;
        }

        function login(user) {
            var deferred = $q.defer();

            $http.post(BASE_URL + 'api/token',
                    'grant_type=password&username=' + user.email + '&password=' + user.password)
                .then(function (response) {
                    preserveUserData(response.data);
                    identificationService.requestUserProfile()
                        .then(function () {
                            deferred.resolve(response.data);

                        });
                });

            return deferred.promise;
        }

        function logout() {
            $cookieStore.remove(AUTHENTICATION_COOKIE_KEY);
            delete $http.defaults.headers.common.Authorization;
            identificationService.removeUserProfile();
        }

        function isAuthenticated() {
            return !!$cookieStore.get(AUTHENTICATION_COOKIE_KEY);
        }

        function refreshCookie() {
            if (isAuthenticated()) {
                $http.defaults.headers.common.Authorization = 'Bearer ' + $cookieStore.get(AUTHENTICATION_COOKIE_KEY);
                identificationService.requestUserProfile();
            }
        }
    }
}());
