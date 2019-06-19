/**
 * Created by Julius Alvarado on 4/22/2018.
 */

(function () {
    "use strict";

    const app = angular.module('edhubJobsApp');

    app.controller('ApplyToOrgCtrl', [
        'orgJobAppsRslv', '$routeParams', '$location', //'resolvedViewJobOrg',
        ApplyToOrganizationClass
    ]);

    function ApplyToOrganizationClass(orgJobAppsRslv, $routeParams, $location) {
        const vm = this;
        vm.rParams = $routeParams;

        // data model
        vm.applyToOrgDataModel = {
            applicantName: 'Julius Maximus Romulus',
            applicantEmail: 'julius@julius3d.com',
            applicantLinkedin: 'https://linkedin.com/in/juliusalvarado',
            applicantCover: 'Hi ^_^/ \n' +
                ' I\'m Julius Alvarado(:\n' +
                '\n' +
                ' I\'m a Web Developer / Software Engineer / Graphic & UIUX Designer\n' +
                'and an overall Hard Working Focused and Motivated Optimistic Team Player.',
            orgApplyTo: $routeParams.orgName,
            orgId: $routeParams.orgId
        };
        // vm.orgName = orgJobAppsRslv[2].$value;
        orgJobAppsRslv.$loaded().then(function (res) {
            console.log('orgJobAppsRslv firebase res data = ');
            console.log(res);
        }).catch(function(err){
            console.log('There was an error ):');
            console.log(err);
        });

        vm.orgImg = 'images/stanford/stanford.png';

        vm.applyToOrg = function () {
            vm.applyToOrgDataModel.timestamp = firebase.database.ServerValue.TIMESTAMP;
            orgJobAppsRslv.$add(vm.applyToOrgDataModel).then(function (ref) {
                console.log("edhub - The response from firebase: ", ref);
                $location.url('/apply-thanks');
            }).catch(function (err) {
                console.log("There was an error submitting applicant data to organization:");
                console.log(err);
            });
        };
    }
}());