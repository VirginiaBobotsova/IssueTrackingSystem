'use strict';

issueTrackingSystemApp.controller('HomeController',
    ['$scope', 'AclService', 'credentials', function ($scope, credentials) {
        $scope.isLogged = credentials.checkForSessionToken();
        $scope.can = AclService.can;
        $scope.issue = {

        }
    }]);
