(function () {
	'use strict';

    angular
        .module('issueTrackingSystem.projects.projectsService', [])
        .factory('projectsService', projectsService);

    projectsService.$inject = [
            '$http',
            '$q',
            'BASE_URL'];

    function projectsService($http, $q, BASE_URL) {
        return {
            getAllProjects : getAllProjects,
            getProjectById : getProjectById,
            addProject : addProject,
            editProject : editProject,
            getProjectIssues : getProjectIssues,
            getUserRelatedProjects : getUserRelatedProjects,
            transformPrioritiesAndLabels : transformPrioritiesAndLabels
        };

        //function authHeader() {
          //  return {Authorization: sessionStorage['access_token']};
        //}

        function getAllProjects() {
            var deferred = $q.defer();
            $http.get(BASE_URL + 'projects')
                //{headers: authHeader()})
                .then(function(response) {
                    deferred.resolve(response);
                }, function(error) {
                    deferred.reject(error);
                });

            return deferred.promise;
        }

        function getProjectById(id) {
            var deferred = $q.defer();
            $http.get(BASE_URL + 'projects/' + id)
                //{headers: authHeader()})
                .then(function (response) {
                    deferred.resolve(response);
                    console.log(response)
                }, function (error) {
                    deferred.reject(error);
                });

            return deferred.promise;
        }

        function addProject(data) {
            data = managePrioritiesAndLabels(data);
            data.ProjectKey = data.Name.match(/\b(\w)/g).join('');
            var deferred = $q.defer();
            $http.post(BASE_URL + 'projects', data)
                //{headers: authHeader()})
                .then(function (response) {
                    deferred.resolve(response);
                }, function (error) {
                    deferred.reject(error);
                });

            return deferred.promise;
        }

        function editProject(project) {
            project = managePrioritiesAndLabels(project);
            var deferred = $q.defer();
            $http.put(BASE_URL + 'projects/' + project.Id, project)
                //{headers: authHeader()})
                .then(function (response) {
                    deferred.resolve(response)
                }, function (error) {
                    deferred.reject(error);
                });

            return deferred.promise;
        }

        function getProjectIssues(id) {
            var deferred = $q.defer();
            $http.put(BASE_URL + 'projects/' + id + 'issues')
                //{headers: authHeader()})
                .then(function (response) {
                    deferred.resolve(response.data)
                }, function (error) {
                    deferred.reject(error);
                });

            return deferred.promise;
        }

        function getUserRelatedProjects(userId){
            var deferred = $q.defer();
            getAllProjects()
                .then(function (response) {
                    var own = response.data.filter(function (project) {
                        return project.Lead.Id === userId;
                    });
                    deferred.resolve(own)
                }, function (error){
                    deferred.reject(error);
                });
            return deferred.promise;
        }

        function transformPrioritiesAndLabels(project){
            var labels = '';
            project.Labels.forEach(function (label) {
                if(labels !== ''){
                    labels += ', ' + label.Name;
                }else{
                    labels = label.Name;
                }
            });
            project.Labels = labels;
            var priorities = '';
            project.Priorities.forEach(function (priority) {
                if(priorities !== ''){
                    priorities += ', ' + priority.Name;
                }else{
                    priorities = priority.Name;
                }
            });
            project.Priorities = priorities;
            return project;
        }

        function managePrioritiesAndLabels(project){
            var labels = [];
            project.Labels.split(', ').forEach(function (label, key) {
                labels.push({
                    Id: key,
                    Name: label
                })
            });
            project.Labels = labels;
            var priorities = [];
            project.Priorities.split(', ').forEach(function (priority, key) {
                priorities.push({
                    Id: key,
                    Name: priority
                })
            });
            project.Priorities = priorities;
            return project;
        }
    }
}());
