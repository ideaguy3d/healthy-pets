/**
 * Created by Julius Alvarado on 4/29/2018.
 */

(function () {
    'use strict';

    angular.module('edhubJobsApp').factory('OrgListSer', [
        '$rootScope', '$firebaseArray', OrgListSerClass
    ]);

    function OrgListSerClass($rootScope, $firebaseArray) {
        const orgListingsRef = firebase.database().ref('orgListings');
        const orgFeedRef = firebase.database().ref('orgFeed');
        const ycOrgFeedRef = firebase.database().ref('ycOrgFeed');
        const orgApplicantsRef = firebase.database().ref('orgApplicants');

        /**
         *
         * @param orgInfo
         * @param orgId
         * @returns {*}
         */
        function listOrg(orgInfo, orgId) {
            return $firebaseArray(orgListingsRef.child(orgId)).$add(orgInfo)
                .then(function (ref) {
                    return ref;
                });
        }

        function postToOrgFeed(orgInfo, orgId) {
            orgInfo.timestamp = firebase.database.ServerValue.TIMESTAMP;
            orgInfo.orgId = orgId;
            return $firebaseArray(orgFeedRef).$add(orgInfo)
                .then(function (refNode) {
                    return refNode;
                });
        }

        function readFromOrgFeed(limit, orderFeedBy) {
            var qOrderLimit = orgFeedRef.orderByChild(orderFeedBy).limitToLast(limit);
            return $firebaseArray(qOrderLimit);
        }

        function getOrgApplicants(edhubUserId) {
            return $firebaseArray(orgApplicantsRef.child(edhubUserId));
        }

        // C - create
        function ycCreateNewJob(jobInfo) {
            return $firebaseArray(ycOrgFeedRef).$add(jobInfo);
        }

        // R - read
        function ycReadFromOrgFeed(limit, orderFeedBy) {
            var qOrderLimit = ycOrgFeedRef.orderByChild(orderFeedBy).limitToLast(limit);
            return $firebaseArray(qOrderLimit);
        }

        // U - update
        function ycUpdateJobPost(jobInfo) {

        }

        // D - delete
        function ycDeleteJobFromOrganization(jobInfo) {
            /*
            //$id: "-Lbtf1tCijkCvklhoReS"
            //$priority: null
            aboutTheOrganization: "Looking for a PHP coder with strong SQL skills to feed the data presentation layer with some data"
            //curOrganization: "Y Combinator"
            name: ""
            orgId: ""
            orgName: "Full Stack Engineer"
            timestamp: 0
            */
            delete jobInfo.$$hashKey;
            //delete jobInfo.$id;
            delete jobInfo.curOrganization;
            //delete jobInfo.$priority;
            console.log('after deleting jobInfo stuff: ', jobInfo);
            $firebaseArray(ycOrgFeedRef).$remove(jobInfo);
        }

        return {
            listOrg: listOrg,
            postToOrgFeed: postToOrgFeed,
            readFromOrgFeed: readFromOrgFeed,
            getOrgApplicants: getOrgApplicants,
            ycReadFromOrgFeed: ycReadFromOrgFeed,
            ycDeleteJobFromOrganization: ycDeleteJobFromOrganization,
            ycCreateNewJob: ycCreateNewJob,
            ycUpdateJobPost: ycUpdateJobPost
        };

    }
}());
