(function () {
    'use strict';

    angular
        .module('issueTrackingSystem.home', [
            'ngRoute',
            'issueTrackingSystem.home.homeController'])
        .config(config);

    function config($routeProvider) {
        $routeProvider
            .when('/', {
                templateUrl: 'app/components/home/home-templates/home.html',
                controller: 'HomeController'
            })
            .otherwise({
                redirectTo: '/'
            })
    }
}());

