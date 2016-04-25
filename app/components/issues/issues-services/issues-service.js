(function () {
    'use strict';

    angular
        .module('issueTrackingSystem.issues.issuesService', [])
        .factory('issuesService', issuesService);

    issuesService.$inject = [
        '$http',
        '$q',
        'BASE_URL'];

    function issuesService($http, $q, BASE_URL) {
        var defaultPageSize = 3,
            defaultPageNumber = 1;

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
        };

        function authHeader() {
            return {Authorization: sessionStorage['access_token']};
        }

        function getIssuesByGivenFilter(pageSize, pageNumber, filter) {
            pageSize = pageSize || defaultPageSize;
            pageNumber = pageNumber || defaultPageNumber;
            filter = filter || '';
            var deferred = $q.defer();
            $http.get(BASE_URL + 'issues/?pageSize=' + pageSize + '&pageNumber=' + pageNumber + '&filter=' + filter,
                {headers: authHeader()})
                .then(function(response) {
                    deferred.resolve(response.data);
                }, function(error) {
                    deferred.reject(error);
                });

            return deferred.promise;
        }

        function getCurrentUserIssues(pageSize, pageNumber) {
            pageSize = pageSize || defaultPageSize;
            pageNumber = pageNumber || defaultPageNumber;
            var orderBy = orderBy || 'DueDate desc';
            var deferred = $q.defer();
            $http.get(BASE_URL + 'issues/me?pageSize=' + pageSize + '&pageNumber=' + pageNumber + '&orderBy=' + orderBy,
                {headers: authHeader()})
                .then(function(response) {
                    console.log(response)
                    deferred.resolve(response.data);
                }, function(error) {
                    deferred.reject(error);
                });

            return deferred.promise;
        }

        function getIssueById(id) {
            var deferred = $q.defer();
            $http.get(BASE_URL + 'issues/' + id,
                {headers: authHeader()})
                .then(function (response) {
                    deferred.resolve(response.data);
                }, function (error) {
                    deferred.reject(error);
                });

            return deferred.promise;
        }

        function addIssue(data) {
            data = manageLabels(data);
            var deferred = $q.defer();
            $http.post(BASE_URL + 'issues', data,
                {headers: authHeader()})
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
            $http.put(BASE_URL + 'issues/' + id, data,
                {headers: authHeader()})
                .then(function (response) {
                    deferred.resolve(response)
                }, function (error) {
                    deferred.reject(error);
                });

            return deferred.promise;
        }

        function editIssueCurrentStatus(id, statusId) {
            var deferred = $q.defer();
            $http.put(BASE_URL + 'issues/' + id + '/changestatus?statusid=' + statusId,
                {headers: authHeader()})
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
            $http.get(BASE_URL + 'issues/' + id + '/comments',
                {headers: authHeader()})
                .then(function (response) {
                    deferred.resolve(response);
                }, function (error) {
                    deferred.reject(error);
                });
            return deferred.promise;
        }

        function addComment(id, data){
            var deferred = $q.defer();
            $http.post(BASE_URL + 'issues/' + id + '/comments', data,
                {headers: authHeader()})
                .then(function (response) {
                    deferred.resolve(response);
                }, function (error) {
                    deferred.reject(error);
                });
            return deferred.promise;
        }
    }
}());

