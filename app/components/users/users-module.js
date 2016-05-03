(function () {
	'use strict';

    angular
        .module('issueTrackingSystem.users', [
            'ngRoute',
            'issueTrackingSystem.users.allUsers',
            'issueTrackingSystem.users.changePassword',
            'issueTrackingSystem.users.editProfile',
            'issueTrackingSystem.users.logout'])
        .config(config);

    function config($routeProvider) {
        var routeChecks = {
            authenticated: ['$q', 'authenticationService', function($q, authenticationService) {
                if (authenticationService.isAuthenticated()) {
                    return $q.when(true);
                }

                return $q.reject('Unauthorized Access');
            }]
        };

        $routeProvider
            .when('/logout', {
                templateUrl: 'app/components/users/users-templates/logout.html',
                controller: 'LogoutController',
                resolve : routeChecks.authenticated
            })
            //.when('/profile', {
              //  templateUrl: 'app/components/users/users-templates/edit-profile.html',
             //   controller: 'EditProfileController',
               // resolve : routeChecks.authenticated
            //})
            .when('/profile/password', {
                templateUrl: 'app/components/users/users-templates/change-user-password.html',
                controller: 'ChangePasswordController',
                resolve : routeChecks.authenticated
            })
    }
}());
