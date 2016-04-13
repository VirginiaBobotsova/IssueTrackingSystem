(function () {
    'use strict';

    angular.module('issueTrackingSystem', ['issueTrackingSystem.routes'])
        .constant('BASE_URL', 'http://softuni-issue-tracker.azurewebsites.net/api/');

}());
