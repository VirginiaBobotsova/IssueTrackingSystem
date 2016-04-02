'use strict';

issueTrackingSystemApp.controller('HomeController',
    ['$scope', 'credentials', function ($scope, credentials) {
        $scope.isLogged = credentials.checkForSessionToken();
    }]);
