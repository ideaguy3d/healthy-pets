/**
 ** Created by Julius Alvarado on 9/4/2017.
 */

(function () {
    'use strict';

    angular.module('edhubJobsApp').controller('LandingCtrl', [
        'edhubJobPostService', '$location', 'smoothScroll', '$rootScope',
        'MockPetFoodSer', LandingClass
    ]);

    function LandingClass(edhubJobPostService, $location, smoothScroll, $rootScope, MockPetFoodSer) {
        const vm = this;

        vm.jobPostBg = "images/chalkboard3dArt1.png";
        vm.showVid = true;
        vm.ycombinatorMessage = "Talent Opportunities at Y Combinator";
        vm.petFood = [
            {   // HARD CODED INDEXES
                prodName: 2, catFlavor: 4, catCurrent:5, subGender: 6,
                subHasDied: 7, subCat: 8, price: 10, prodDes: 14
            }
        ];

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

            vm.petFood.push(MockPetFoodSer.allPetFood);
            vm.petFood[1].shift();
            console.log(vm.petFood);
        }
    }

}());