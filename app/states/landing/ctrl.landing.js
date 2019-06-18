/**
 * Created by Julius Alvarado on 9/4/2017.
 */

(function () {
    "use strict";

    angular.module('edhubJobsApp').controller('LandingCtrl', [
        'edhubJobPostService', '$location', 'smoothScroll', 'eOrgListFact',
        '$rootScope', LandingClass
    ]);

    function LandingClass(edhubJobPostService, $location, smoothScroll, eOrgListFact, $rootScope) {
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
                //-- if user is not authenticated send them to "sign up to apply" view
                //-- sta = Signup To Apply view
                // $location.url('/signup/sta');
                //-- 'apply to job' view:
                //$location.url('/apply/' + orgInfo.orgId + '/' + orgInfo.orgName);

                $location.url('/view-job/'+ orgInfo.orgId + '/' + orgInfo.orgName)
            }
        };

        vm.scroll2recentJobs = function () {
            var elem = document.getElementById("edhub-recent-jobs-landing-title");
            smoothScroll(elem);
        };

        activate();

        function activate() {
            eOrgListFact.readFromOrgFeed(5, 'timestamp').$loaded().then(function (data) {
                vm.orgFeed = data;
            }).catch(function (error) {
                console.error('edhub - Error: ', error);
            });

            /*
                edhubJobPostService.jobPostingsLimitTo(7).$loaded().then(function (res) {
                    vm.jobPostings = res;
                    console.log("edhub - jobPostings res =");
                    console.log(res);
                }).catch(function (error) {
                    console.error('edhub - Error: ', error);
                });
            */
        }
    }

}());