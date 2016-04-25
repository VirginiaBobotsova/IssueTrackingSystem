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
        $routeProvider
            .when('/logout', {
                templateUrl: 'app/components/users/users-templates/logout.html',
                controller: 'LogoutController'
            })
            .when('/profile', {
                templateUrl: 'app/components/users/users-templates/edit-profile.html',
                controller: 'EditProfileController'
            })
            .when('/profile/password', {
                templateUrl: 'app/components/users/users-templates/change-password.html',
                controller: 'ChangePasswordController'
            })
            .otherwise({
                redirectTo: '/'
            })
    }
}());
