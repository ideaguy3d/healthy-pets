/**
 ** Created by Julius Alvarado on 9/4/2017.
 */

(function () {
    'use strict';

    angular.module('edhubJobsApp').controller('LandingCtrl', [
        'edhubJobPostService', '$location', 'smoothScroll',
        '$rootScope', LandingClass
    ]);

    function LandingClass(edhubJobPostService, $location, smoothScroll, $rootScope) {

        const vm = this;

        vm.jobPostBg = "images/chalkboard3dArt1.png";
        vm.showVid = true;
        vm.ycombinatorMessage = "Talent Opportunities at Y Combinator";

        vm.apply2job = function (organizationName, postId) {
            $location.url('/apply/' + postId + '/' + organizationName);
        };

        vm.apply2org = function (orgInfo) {
            if ($rootScope.rootEdhubAuthUser) {
                $location.url('/apply/' + orgInfo.orgId + '/' + orgInfo.orgName);
            } else {
                $location.url('/view-job/' + orgInfo.orgId + '/' + orgInfo.orgName)
            }
        };

        vm.scroll2recentJobs = function () {
            var elem = document.getElementById("edhub-recent-jobs-landing-title");
            smoothScroll(elem);
        };

        activate();

        function activate() {
            console.log("__>> Wired up and ready to rock and roll.");
        }
    }

}());