(function () {
	'use strict';
    angular.module('issueTrackingSystem.routes', [
        'ngRoute',
        'issueTrackingSystem.users.userService',
        'issueTrackingSystem.home',
        'issueTrackingSystem.users'])
    .config(function ($routeProvider) {
        $routeProvider
            .when('/', {
                templateUrl: 'app/components/home/homeView.html',
                controller: 'homeController'
            })
            .when('/logout', {
                templateUrl: 'components/users/logout.html',
                controller: 'usersController'
            })
            .when('/profile', {
                templateUrl: 'components/users/edit-profile.html',
                controller: 'usersController',
                resolve:{
                    isLogged: function($location, $sessionStorage, $localStorage){
                        if(!$sessionStorage.authorization && !$localStorage.authorization){
                            $location.path('/');
                        }
                    }
                }
            })
            .when('/profile/password', {
                templateUrl: 'components/users/change-password.html',
                controller: 'UserController',
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
}());
