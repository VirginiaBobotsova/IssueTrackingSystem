'use strict';

var issueTrackingSystemApp = angular
    .module('issueTrackingSystemApp', ['ngResource', 'ngRoute', 'ngStorage', 'toaster', 'naif.base64'])
    .config(function ($routeProvider) {
        $routeProvider
            .when('/', {
                templateUrl: 'partials/home.html',
                controller: 'HomeController'
            })
            .when('/logout', {
                templateUrl: 'partials/user/logout.html',
                controller: 'LogoutController'
            })
            .when('/profile', {
                templateUrl: 'partials/user/edit-profile.html',
                controller: 'EditProfileController',
                resolve:{
                    isLogged: function($location, $sessionStorage, $localStorage){
                        if(!$sessionStorage.authorization && !$localStorage.authorization){
                            $location.path('/');
                        }
                    }
                }
            })
            .when('/profile/password', {
                templateUrl: 'partials/user/change-password.html',
                controller: 'ChangePasswordController',
                resolve:{
                    isLogged: function($location, $sessionStorage, $localStorage){
                        if(!$sessionStorage.authorization && !$localStorage.authorization){
                            $location.path('/');
                        }
                    }
                }
            })
            .otherwise({
                redirectTo: '/'
            })
    })
    .config(['$httpProvider', function($httpProvider) {
        $httpProvider.interceptors.push(function($q, $location, $sessionStorage, $localStorage) {
            return {
                'responseError': function(rejection){
                    var defer = $q.defer();
                    if(rejection.status == 401){
                        $localStorage.$reset();
                        $sessionStorage.$reset();
                        $location.path('/');
                    }

                    if(rejection.status == 404) {
                        $location.path('/');
                    }

                    defer.reject(rejection);
                    return defer.promise;
                }
            };
        });
    }])
    .constant('baseUrl', '');
