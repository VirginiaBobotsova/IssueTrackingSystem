(function () {
    'use strict';
    angular.module('issueTrackingSystem.projects.issuesService', [])
        .factory('issuesService', [
            '$http',
            '$q',
            'BASE_URL',
            function ($http, $q, BASE_URL) {

                function getIssues() {
                    var deferred = $q.defer();
                    $http.get(BASE_URL + 'issues')
                        .then(function(response) {
                            deferred.resolve(response);
                        }, function(error) {
                            deferred.reject(error);
                        });

                    return deferred.promise;
                }

                function getProjectById(id) {
                    var deferred = $q.defer();
                    $http.get(BASE_URL + 'projects/{id}')
                        .then(function (response) {
                            deferred.resolve(response);
                        }, function (error) {
                            deferred.reject(error);
                        });

                    return deferred.promise;
                }

                function addProject(data) {
                    var deferred = $q.defer();
                    $http.post(BASE_URL + 'projects')
                        .then(function (response) {
                            deferred.resolve(response.data);
                        }, function (error) {
                            deferred.reject(error);
                        });

                    return deferred.promise;
                }

                function editProject(id) {
                    var deferred = $q.defer();
                    $http.put(BASE_URL + 'projects/{id}')
                        .then(function (response) {
                            deferred.resolve(response.data)
                        }, function (error) {
                            deferred.reject(error);
                        });

                    return deferred.promise;
                }

                return {
                    getAllProjects : getAllProjects,
                    getProjectById : getProjectById,
                    addProject : addProject,
                    editProject : editProject
                }
            }])

}());

