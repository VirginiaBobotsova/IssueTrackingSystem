(function () {
    'use strict';
    angular.module('issueTrackingSystem.projects.issuesService', [])
        .factory('issuesService', [
            '$http',
            '$q',
            'BASE_URL',
            function ($http, $q, BASE_URL) {
                function getIssuesByGivenFilter(pageSize, pageNumber, filter) {
                    var deferred = $q.defer();
                    $http.get(BASE_URL + 'issues/?pageSize=' + pageSize + '&pageNumber=' + pageNumber + '&filter=' + filter)
                        .then(function(response) {
                            deferred.resolve(response);
                        }, function(error) {
                            deferred.reject(error);
                        });

                    return deferred.promise;
                }

                function getCurrentUserIssues(pageSize, pageNumber, value) {
                    var deferred = $q.defer();
                    $http.get(BASE_URL + 'issues/me?pageSize=' + pageSize + '&pageNumber=' + pageNumber + '&orderBy=' + value)
                        .then(function(response) {
                            deferred.resolve(response);
                        }, function(error) {
                            deferred.reject(error);
                        });

                    return deferred.promise;
                }

                function getIssueById(id) {
                    var deferred = $q.defer();
                    $http.get(BASE_URL + 'issues/' + id)
                        .then(function (response) {
                            deferred.resolve(response);
                        }, function (error) {
                            deferred.reject(error);
                        });

                    return deferred.promise;
                }

                function addIssue(data) {
                    var deferred = $q.defer();
                    $http.post(BASE_URL + 'issues')
                        .then(function (response) {
                            deferred.resolve(response.data);
                        }, function (error) {
                            deferred.reject(error);
                        });

                    return deferred.promise;
                }

                function editIssue(id, data) {
                    var deferred = $q.defer();
                    $http.put(BASE_URL + 'issues/' + id)
                        .then(function (response) {
                            deferred.resolve(response.data)
                        }, function (error) {
                            deferred.reject(error);
                        });

                    return deferred.promise;
                }

                function editIssueCurrentStatus(id, statusId, data) {
                    var deferred = $q.defer();
                    $http.put(BASE_URL + 'issues/' + id + '/changestatus?statusid=' + statusId)
                        .then(function (response) {
                            deferred.resolve(response.data)
                        }, function (error) {
                            deferred.reject(error);
                        });

                    return deferred.promise;
                }

                return {
                    getIssuesByGivenFilter : getIssuesByGivenFilter,
                    getCurrentUserIssues : getCurrentUserIssues,
                    getIssueById : getIssueById,
                    addIssue : addIssue,
                    editIssue : editIssue,
                    editIssueCurrentStatus : editIssueCurrentStatus
                }
            }])

}());

