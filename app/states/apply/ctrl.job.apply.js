/**
 * Created by Julius Alvarado on 4/22/2018.
 */

(function () {
    "use strict";

    const app = angular.module('edhubJobsApp');

    app.controller('ApplyToJobCtrl', ['$routeParams', ApplyToJobCtrlClass]);

    function ApplyToJobCtrlClass($routeParams) {
        const vm = this;
        vm.rParams = $routeParams;
    }
}());