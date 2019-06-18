/**
 * Created by Julius Alvarado on 4/4/2019.
 */

(function(){
    'use strict';

    function PerformanceManagementClass() {
        var vm = this;
        vm.points = 50;
    }

    angular.module('edhubJobsApp').controller('PerformanceManagementCtrl', [
        PerformanceManagementClass
    ]);
}());