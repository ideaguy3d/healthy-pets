/**
 * Created by Julius Alvarado on 4/2/2019.
 */

(function () {
    'use strict';

    function TalentAcquisitionClass(OrgListSer) {
        const vm = this;
        vm.message = 'Talent Acquisition';
        vm.curOrganization = 'Y Combinator';
        vm.hideForm = true;
        vm.postedOpportunities = [];
        // data model, it matches the practice ycOrgFeed node schema
        vm.talentInfo = {
            // the 'job description'
            aboutTheOrganization: '',
            name: '',
            orgId: '',
            // the 'job title'
            orgName: '',
            timestamp: 0
        };

        vm.talentSubmit = function () {
            if (vm.hideForm === false) {
                console.log('going to sumbit this talent info:');
                console.log(vm.talentInfo);
                vm.talentInfo.curOrganization = vm.curOrganization;
                OrgListSer.ycCreateNewJob(vm.talentInfo).then(function (res) {
                    console.log('Response for listing organization ' + vm.curOrganization);
                    console.log(res);
                });
                vm.talentInfo = {
                    orgName: '',
                    aboutTheOrganization: ''
                };
            }

            vm.hideForm = !vm.hideForm;
        };

        vm.deleteJob = function (job) {
            // OrgListSer.ycDeleteJobFromOrganization(job);
            vm.postedOpportunities.$remove(job);
        };

        init();
        function init() {
            OrgListSer.ycReadFromOrgFeed(10, 'name').$loaded()
                .then(function (res) {
                    vm.postedOpportunities = res;
                    console.log("The response is");
                    console.log(res);
                });
        }
    }

    angular.module('edhubJobsApp').controller('TalentAcquisitionCtrl', [
        'OrgListSer', TalentAcquisitionClass
    ]);

}());