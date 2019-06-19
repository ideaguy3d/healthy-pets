(function () {
    'use strict';

    angular.module('edhubJobsApp').factory('MockPetFoodSer', [
        '$firebaseArray', MockPetFoodSerClass
    ]);

    function MockPetFoodSerClass($firebaseArray) {
       const mockPetFoodRef = firebase.database().ref('pracData/petFood');

       return {
           allPetFood: $firebaseArray(mockPetFoodRef)
       }
    }
}());