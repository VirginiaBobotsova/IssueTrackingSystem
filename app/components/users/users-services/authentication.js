(function () {
    'use strict';

    angular
        .module('issueTrackingSystem.users.authentication', ['ngCookies'])
        .factory('authenticationService', authenticationService);

    authenticationService.$inject = [
        '$window',
        '$http',
        '$cookieStore',
        '$q',
        '$location',
        'identificationService',
        'BASE_URL'];

    function authenticationService($window, $http, $cookieStore, $q, $location, identificationService, BASE_URL) {
        var AUTHENTICATION_COOKIE_KEY = '!__Authentication_Cookie_Key__!';

        return {
            register: register,
            login: login,
            logout: logout,
            isAuthenticated: isAuthenticated,
            isAdministrator: isAdministrator,
            refreshCookie: refreshCookie
        };

        function preserveUserData(data) {
            var accessToken = data.access_token;
            $http.defaults.headers.common.Authorization = 'Bearer ' + accessToken;
            //$cookies.put('AUTHENTICATION_COOKIE_KEY', 'accessToken');
            $cookieStore.put(AUTHENTICATION_COOKIE_KEY, accessToken)
        }

        function register(registerData) {
            var deferred = $q.defer();

            $http.post(BASE_URL + 'api/account/register', registerData)
                .then(function (response) {
                    preserveUserData(response.data);

                    identificationService.requestUserProfile()
                        .then(function () {
                            deferred.resolve(response.data);
                        });
                });

            return deferred.promise;
        }

        function login(loginData) {
            var deferred = $q.defer();

            $http.post(BASE_URL + 'api/token',
                    'grant_type=password&username=' + loginData.username + '&password=' + loginData.password)
                //{headers: {'Content-Type': 'application/x-www-form-urlencoded'}
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
            //$cookieStore.remove(AUTHENTICATION_COOKIE_KEY);
            delete $cookieStore[AUTHENTICATION_COOKIE_KEY];
            //$window.sessionStorage.removeItem('access_token');
            //$window.sessionStorage.removeItem('user');
            delete $http.defaults.headers.common.Authorization;
            identificationService.removeUserProfile();
            console.log(AUTHENTICATION_COOKIE_KEY)
            $location.path('/');
        }

        function isAuthenticated() {
            return !!$cookieStore.get(AUTHENTICATION_COOKIE_KEY);
        }

        function isAdministrator() {
            var userInfo = sessionStorage['userInfo'];
            if (userInfo) {
                var parseUserInfo = JSON.parse(userInfo);
                return parseUserInfo.isAdmin;
            }
        }

        function refreshCookie() {
            if (isAuthenticated()) {
                $http.defaults.headers.common.Authorization = 'Bearer ' + $cookieStore.get(AUTHENTICATION_COOKIE_KEY);
                identificationService.requestUserProfile();
            }
        }
    }
}());
