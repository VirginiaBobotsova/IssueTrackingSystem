(function () {
    'use strict';

    angular
        .module('issueTrackingSystem.common.notify', [])
        .factory('notifyService', notifyService);

    function notifyService() {
        return {
            showInfo: function(msg) {
                noty({
                    text: msg,
                    type: 'success',
                    layout: 'topCenter',
                    timeout: 5000}
                );
            },
            showError: function(msg) {
                noty({
                    text: msg,
                    type: 'error',
                    layout: 'topCenter',
                    timeout: 5000}
                );
            }
        }
    }
}());
