(function () {
    'use strict';

    angular
        .module('issueTrackingSystem.common.modal', ['ui.bootstrap'])
        .controller('modalController', modal);

    modal.$inject = ['$scope', '$modal'];

    function modal($scope, $modal) {
            $modal.open({
                templateUrl : 'app/components/projects/user-project-issues-templates/add-project.html',
                windowTemplateUrl: 'app/components/projects/user-project-issues-templates/all-projects.html'})
    }
}());
