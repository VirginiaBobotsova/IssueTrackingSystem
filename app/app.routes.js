(function () {
	'use strict';
    angular.module('issueTrackingSystem.routes', [
        'ngRoute',
        'issueTrackingSystem.home',
        'issueTrackingSystem.users',
        'issueTrackingSystem.projects',
        'issueTrackingSystem.issues'])
    .config(function ($routeProvider) {
        $routeProvider
            .when('/', {
                templateUrl: 'components/home/homeView.html',
                controller: 'homeController'
            })
            .when('/logout', {
                templateUrl: 'app/partials/user/logout.html',
                controller: 'LogoutController'
            })
            .when('/profile', {
                templateUrl: 'app/partials/user/edit-profile.html',
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
                templateUrl: 'app/partials/user/change-password.html',
                controller: 'ChangePasswordController',
                resolve:{
                    isLogged: function($location, $sessionStorage, $localStorage){
                        if(!$sessionStorage.authorization && !$localStorage.authorization){
                            $location.path('/');
                        }
                    }
                }
            })
            .when('/projects/:id', {
                templateUrl : 'app/partials/project/project.html',
                controller : 'ProjectDetailsController',
                resolve : {
                    isLogged: function($location, $sessionStorage, $localStorage){
                        if(!$sessionStorage.authorization && !$localStorage.authorization){
                            $location.path('/');
                        }
                    },
                    'acl' : [$q, 'AclService', function ($q, AclService) {
                        if (AclService.can('Project', 'view')) {
                            return true;
                        } else {
                            return $q.reject('Unauthorized');
                        }
                    }]
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

}());
