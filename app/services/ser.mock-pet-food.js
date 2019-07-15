"use strict";

(function () {
  'use strict';

  angular.module('edhubJobsApp').factory('MockPetFoodSer', ['$firebaseArray', MockPetFoodSerClass]);

  function MockPetFoodSerClass($firebaseArray) {
    var mockPetFoodRef = firebase.database().ref('pracData/petFood');
    return {
      allPetFood: $firebaseArray(mockPetFoodRef),
      catFood: function catFood() {
        var query = mockPetFoodRef.orderByKey().equalTo('_Cat Food');
        return $firebaseArray(query);
      },
      dogFood: function dogFood() {
        var query = mockPetFoodRef.orderByKey().equalTo('_Dog Food');
        return $firebaseArray(query);
      }
    };
  }
})();