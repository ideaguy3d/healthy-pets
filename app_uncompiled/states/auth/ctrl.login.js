/**
 * Created by Julius Alvarado on 9/10/2017.
 */


(function(){
    "use strict";

    angular.module('edhubJobsApp').controller('LoginCtrl', ['$scope', 'edhubAuthService',
        function($scope, edhubAuthService){
            const vm = this;
            vm.email = "";
            vm.pw = "";
            vm.error = "";

            vm.userLogin = function () {
                edhubAuthService.userLogin(vm.email, vm.pw)
                    .then(function (auth) {
                        $scope.ccSetCurrentUser(auth.email);
                    }, function (err) {
                        vm.error = err.message;
                    });
            };
        }
    ]);
}());