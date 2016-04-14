(function () {
    angular.module('issueTrackingSystem.users.identity', [])
        .config(['$provide', '$httpProvider', function ($provide, $httpProvider) {
            $provide.factory('identificationInterceptor', ['$q', function ($q) {
                return {
                    request: function (config) {
                        var bearerToken = sessionStorage.getItem('access_token');
                        if (bearerToken) {
                            config.headers['Authorization'] = 'Bearer ' + bearerToken;
                        }

                        return config || $q.when(config);
                    }
                };
            }]);

            $httpProvider.interceptors.push('identificationInterceptor');
        }])
        .factory('identificationService', ['$window',
            '$location',
            'toaster',
            '$http',
            '$q',
            'BASE_URL',
            function ($window, $location, toaster, $http, $q, BASE_URL) {
                var defaultNotificationTimeout = 2000;

                function setCookie(key, value){
                    $window.sessionStorage[key] = value;
                }

                function getCookieData(key){
                    return $window.sessionStorage[key];
                }

                function removeCookie(){
                    $window.sessionStorage.removeItem('access_token');
                    $window.sessionStorage.removeItem('user');
                }

                function userLogged(){
                    return $window.sessionStorage.access_token ? true : false;
                }

                function requireAuthorization(){
                    if(!userLogged()){
                        $location.path('/');
                        toaster.pop('info', 'Please login!', defaultNotificationTimeout);
                        return;
                    }
                }
                function isAdmin(){
                    if(!userLogged()){
                        return false;
                    }
                    var user = getCookieData('user');
                    return JSON.parse(user).isAdmin;
                }
                function requireAdmin(){
                    if(!isAdmin()){
                        $location.path('/');
                        toaster.pop('info', 'Admin privileges required!', defaultNotificationTimeout);
                        return;
                    }
                }
                function getCurrentUser(){
                    var deferred = $q.defer();
                    $http.get(BASE_URL + 'users/me')
                        .then(function (response) {
                            deferred.resolve(response);
                        }, function (error) {
                            deferred.reject(error);
                        });
                    return deferred.promise;
                }

                function getCurrentUserId(){
                    var deferred = $q.defer();
                    if(!existingCookie()){
                        deferred.reject();
                    }
                    if(getCookieData('user')){
                        var id = JSON.parse(getCookieData('user')).Id;
                        deferred.resolve(id);
                    }else{
                        deferred.reject();
                    }
                    return deferred.promise;
                }

                return {
                    setCookie: setCookie,
                    getCookieData : getCookieData,
                    removeCookie : removeCookie,
                    userLogged: userLogged,
                    requireAuthorization: requireAuthorization,
                    isAdmin: isAdmin,
                    requireAdmin: requireAdmin,
                    getCurrentUser : getCurrentUser,
                    getCurrentUserId : getCurrentUserId
                }
            }])
}());
