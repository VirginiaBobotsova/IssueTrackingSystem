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
        'notifyService'];

    function logoutUser(
      $scope,
      $route,
      $location,
      authenticationService,
      notifyService) {
          $scope.logout = logout;

          function logout() {
              authenticationService.logout();
              $scope.isAuthenticated = false;
              $route.reload();
              //$location.path('/');
              notifyService.showInfo('Logout successful!');
          }
   }
}());