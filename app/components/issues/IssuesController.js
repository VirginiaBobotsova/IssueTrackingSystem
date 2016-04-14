(function () {
	'use strict';
    angular.module('issueTrackingSystem.issues', ['ngTouch', 'ui.grid'])
        .controller('issuesController', ['$scope', 'issuesService', function ($scope) {
            $scope.gridOptions = {
                excludeProperties: '__metadata',
                enableSorting: true,
                columnDefs: [
                    { name:'Title', field: 'title' },
                    { name:'Description', field: 'description' },
                    { name:'Project', field: 'project[0]'},
                    { name:'Due Date', field: 'dueDate()', enableCellEdit:false}
                ],
                data : $scope.load()
            };

            $scope.load = function (pageSize, pageNumber, value) {
                issuesService.getCurrentUserIssues(pageSize, pageNumber, value).then(function (response) {
                    $scope.gridOptions.data = response.data;
                });
            };



            $scope.pagination = {
                pageSize: 5,
                pageNumber: 1,
                totalItems: null,
                getTotalPages: function () {
                    return Math.ceil(this.totalItems / this.pageSize);
                },
                nextPage: function () {
                    if (this.pageNumber < this.getTotalPages()) {
                        this.pageNumber++;
                        $scope.load();
                    }
                },
                previousPage: function () {
                    if (this.pageNumber > 1) {
                        this.pageNumber--;
                        $scope.load();
                    }
                }
            };


        }])
}());
