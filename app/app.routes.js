(function () {
	'use strict';
    angular.module('issueTrackingSystem.routes', [
        'ngRoute',
        'issueTrackingSystem.users.userService',
        'issueTrackingSystem.home',
        'issueTrackingSystem.users',
        'issueTrackingSystem.issues',
        'issueTrackingSystem.common'])
    .config(function ($routeProvider) {
        $routeProvider
            .when('/', {
                templateUrl: 'app/components/home/homeView.html',
                controller: 'homeController'
            })
            .when('/logout', {
                templateUrl: 'app/components/users/logout.html',
                controller: 'usersController'
            })
            .when('/profile', {
                templateUrl: 'app/components/users/edit-profile.html',
                controller: 'usersController'
                //resolve:{
                    //isLogged: function($location, $sessionStorage, $localStorage){
                        //if(!$sessionStorage.authorization && !$localStorage.authorization){
                            //$location.path('/');
                        //}
                    //}
                //}
            })
            .when('/profile/password', {
                templateUrl: 'components/users/templates/change-password.html',
                controller: 'UserController'
                //resolve:{
                    //isLogged: function($location, $sessionStorage, $localStorage){
                        //if(!$sessionStorage.authorization && !$localStorage.authorization){
                           // $location.path('/');
                //        }
                  //  }
                //}
            })
            .otherwise({
                redirectTo: '/'
            })
    })
}());
