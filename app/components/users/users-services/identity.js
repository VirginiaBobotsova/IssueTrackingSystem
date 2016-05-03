(function () {
    'use strict';

    angular
        .module('issueTrackingSystem.users.identity', [])
        .factory('identificationService', identificationService);

    identificationService.$inject = [
        '$http',
        '$q',
        'BASE_URL'];

    function identificationService($http, $q, BASE_URL) {

        var deferred = $q.defer();

        var currentUser = undefined;

        return {
            getCurrentUser: getCurrentUser,
            removeUserProfile: removeUserProfile,
            requestUserProfile: requestUserProfile
        };

        function getCurrentUser() {
            if (currentUser) {
                return $q.when(currentUser);
            }
            else {
                return deferred.promise;
            }
        }

        function removeUserProfile() {
            currentUser = undefined;
        }

        function requestUserProfile() {
            var userProfileDeferred = $q.defer();

            $http.get(BASE_URL + 'api/account/userInfo')
                .then(function(response) {
                    currentUser = response.data;
                    deferred.resolve(currentUser);
                    userProfileDeferred.resolve();
                });

            return userProfileDeferred.promise;
        }
    }

}());
