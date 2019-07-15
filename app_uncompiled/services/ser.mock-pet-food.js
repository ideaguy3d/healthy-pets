(function () {
    'use strict';

    angular.module('edhubJobsApp').factory('MockPetFoodSer', [
        '$firebaseArray', MockPetFoodSerClass
    ]);

    function MockPetFoodSerClass($firebaseArray) {
       const mockPetFoodRef = firebase.database().ref('pracData/petFood');

       return {
           allPetFood: $firebaseArray(mockPetFoodRef),
           catFood: function () {
               let query = mockPetFoodRef.orderByKey().equalTo('_Cat Food');
               return $firebaseArray(query);
           },
           dogFood: function () {
               let query = mockPetFoodRef.orderByKey().equalTo('_Dog Food');
               return $firebaseArray(query);
           }
       }
    }
}());