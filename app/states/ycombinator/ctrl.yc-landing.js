"use strict";

/**
 * Created by Julius Alvarado on 3/4/2019.
 */
(function () {
  "use strict";

  angular.module('edhubJobsApp').controller('YCombinatorLandingCtrl', ['edhubJobPostService', '$location', 'smoothScroll', 'OrgListSer', '$rootScope', LandingClass]);

  function LandingClass(edhubJobPostService, $location, smoothScroll, OrgListSer, $rootScope) {
    var vm = this;
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
        $location.url('/view-job/' + orgInfo.orgId + '/' + orgInfo.orgName);
      }
    };

    vm.scroll2recentJobs = function () {
      var elem = document.getElementById("edhub-recent-jobs-landing-title");
      smoothScroll(elem);
    };

    activate();

    function activate() {
      OrgListSer.ycReadFromOrgFeed(5, 'timestamp').$loaded().then(function (data) {
        vm.orgFeed = data;
      })["catch"](function (error) {
        console.error('edhub - Error: ', error);
      });
    }
  }
})();