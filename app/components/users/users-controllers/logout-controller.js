(function () {
    'use strict';

    angular
        .module('issueTrackingSystem.users.logout', [])
        .controller('LogoutController', logoutUser);

    logoutUser.$inject = [
        '$scope',
        '$route',
        '$location',
        'authenticationService',
        'toaster'];

    function logoutUser(
      $scope,
      $route,
      $location,
      authenticationService,
      toaster) {
      var defaultNotificationTimeout = 2000;

      $scope.logout = logout;

      function logout() {
          authenticationService.logout()
          $scope.isAuthenticated = false;
          $route.reload();
          //$location.path('/');
          toaster.pop('success', 'Logout successful!', null, defaultNotificationTimeout);
      }
   }
}());