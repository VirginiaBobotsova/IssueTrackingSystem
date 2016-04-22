(function () {
	'use strict';
    angular.module('issueTrackingSystem.common', ['ui.bootstrap', 'issueTrackingSystem.common.directives'])
        .controller('commonController', ['$scope', '$log', function ($scope, $log) {
            $scope.status = {
                isopen: false
            };

            $scope.toggled = function(open) {
                $log.log('Dropdown is now: ', open);
            };

            $scope.toggleDropdown = function($event) {
                $event.preventDefault();
                $event.stopPropagation();
                $scope.status.isopen = !$scope.status.isopen;
            };

            $scope.appendToEl = angular.element(document.querySelector('#dropdown-long-content'));
        }])
        .controller('modalController', ['$scope', '$modal', function($scope, $modal) {
            $modal.open({
                templateUrl : 'app/components/projects/user-project-issue-templates/add-project.html',
                windowTemplateUrl: 'app/components/projects/user-project-issue-templates/all-projects.html'})
        }])

}());
