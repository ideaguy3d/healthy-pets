/**
 * Created by Julius Alvarado on 5/9/2019.
 */

(function(){
    'use strict';

    angular.module('edhubJobsApp').controller('ClubProfileCtrl', [
        '$rootScope', ClubProfileCtrlClass
    ]);

    function ClubProfileCtrlClass ($rootScope) {
        let vm = this;
        vm.info = 'ClubProfileCtrl wired up to view ^_^';
        vm.bgImage = {
            'background-position': 'center center',
            'background-image': 'url(images/club.jpg)'
        }
    }

}());