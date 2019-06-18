/**
 * Created by Julius Alvarado on 4/4/2019.
 */

(function(){
    'use strict';

    function LearningManagementClass () {
        var vm = this;
        vm.message = 'Create courses or quick tutorials.'
    }

    angular.module('edhubJobsApp')
        .controller('LearningManagementCtrl', [
            LearningManagementClass
        ]);
}());