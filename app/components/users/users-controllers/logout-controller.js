(function () {
    'use strict';

    angular
        .module('issueTrackingSystem.users.logout', [])
        .controller('LogoutController', logoutUser);

    logoutUser.$inject = [
            '$window',
            '$location',
            'toaster'];

    function logoutUser(
        $window,
        $location,
        toaster) {
        var defaultNotificationTimeout = 2000;
        $window.sessionStorage.removeItem('access_token');
        $window.sessionStorage.removeItem('user');
            toaster.pop('success', 'Logout successful!', defaultNotificationTimeout);
            $location.path('/');
    }
}());