(function () {
    'use strict';
    angular.module('issueTrackingSystem.issues.issuesService', [])
        .factory('issuesService', [
            '$http',
            '$q',
            'BASE_URL',
            function ($http, $q, BASE_URL) {
                var defaultPageSize = 3,
                    defaultPageNumber = 1;

                function getIssuesByGivenFilter(pageSize, pageNumber, filter) {
                    pageSize = pageSize || defaultPageSize;
                    pageNumber = pageNumber || defaultPageNumber;
                    filter = filter || '';
                    var deferred = $q.defer();
                    $http.get(BASE_URL + 'issues/?pageSize=' + pageSize + '&pageNumber=' + pageNumber + '&filter=' + filter)
                        .then(function(response) {
                            deferred.resolve(response);
                        }, function(error) {
                            deferred.reject(error);
                        });

                    return deferred.promise;
                }

                function getCurrentUserIssues(pageSize, pageNumber, orderBy) {
                    pageSize = pageSize || defaultPageSize;
                    pageNumber = pageNumber || defaultPageNumber;
                    orderBy = orderBy || 'DueDate desc';
                    var deferred = $q.defer();
                    $http.get(BASE_URL + 'issues/me?pageSize=' + pageSize + '&pageNumber=' + pageNumber + '&orderBy=' + orderBy)
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
                    data = manageLabels(data);
                    var deferred = $q.defer();
                    $http.post(BASE_URL + 'issues', data)
                        .then(function (response) {
                            deferred.resolve(response);
                        }, function (error) {
                            deferred.reject(error);
                        });

                    return deferred.promise;
                }

                function editIssue(id, data) {
                    data = manageLabels(data);
                    var deferred = $q.defer();
                    $http.put(BASE_URL + 'issues/' + id, data)
                        .then(function (response) {
                            deferred.resolve(response)
                        }, function (error) {
                            deferred.reject(error);
                        });

                    return deferred.promise;
                }

                function editIssueCurrentStatus(id, statusId) {
                    var deferred = $q.defer();
                    $http.put(BASE_URL + 'issues/' + id + '/changestatus?statusid=' + statusId)
                        .then(function (response) {
                            deferred.resolve(response)
                        }, function (error) {
                            deferred.reject(error);
                        });

                    return deferred.promise;
                }

                function transformLabels(issue){
                    var labels = '';
                    issue.Labels.forEach(function (label) {
                        if(labels !== ''){
                            labels += ', ' + label.Name;
                        }else{
                            labels = label.Name;
                        }
                    });
                    issue.Labels = labels;

                    return issue;
                }

                function manageLabels(issue){
                    var labels = [];
                    issue.Labels.split(', ').forEach(function (label, key) {
                        labels.push({
                            Id: key,
                            Name: label
                        })
                    });
                    issue.Labels = labels;

                    return issue;
                }

                function getIssueComments(id){
                    var deferred = $q.defer();
                    $http.get(BASE_URL + 'issues/' + id + '/comments')
                        .then(function (response) {
                            deferred.resolve(response);
                        }, function (error) {
                            deferred.reject(error);
                        });
                    return deferred.promise;
                }

                function addComment(id, data){
                    var deferred = $q.defer();

                    $http.post(BASE_URL + 'issues/' + id + '/comments', data)
                        .then(function (response) {
                            deferred.resolve(response);
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
                    editIssueCurrentStatus : editIssueCurrentStatus,
                    transformLabels : transformLabels,
                    manageLabels : manageLabels,
                    getIssueComments : getIssueComments,
                    addComment : addComment
                }
            }]);
}());

