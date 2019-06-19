(function () {
    'use strict';

    angular.module('edhubJobsApp').directive('landingData', [
        LandingDataDirectiveClass
    ]);

    function LandingDataDirectiveClass() {
        return {
            templateUrl: 'directives/temps/temp.landing-data.html'
        }
    }
}());