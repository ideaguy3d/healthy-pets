/**
 * Created by Julius Alvarado on 5/12/2019.
 */

(function () {
    'use strict';

    angular.module('edhubJobsApp').factory('serGmapLanding', [
        '$firebaseArray', GmapLandingSer
    ]);

    function GmapLandingSer($firebaseArray) {
        let storesPracRef = firebase.database().ref('/storePrac');
        let orgFeedRef = firebase.database().ref('/orgFeed');
        let usersRef = firebase.database().ref('/users');
        let nodeClubs = $firebaseArray(storesPracRef);
        let nodeOrgFeed = $firebaseArray(orgFeedRef);
        let nodeUsers = $firebaseArray(usersRef);

        return {
            nodeClubs: nodeClubs,
            nodeOrgFeed: nodeOrgFeed,
            nodeUsers: nodeUsers
        }
    }
}());