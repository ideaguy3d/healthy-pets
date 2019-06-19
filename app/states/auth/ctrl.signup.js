/**
 * Created by Julius Alvarado on 9/5/2017.
 */

(function () {
    "use strict";

    angular.module('edhubJobsApp').controller('SignupCtrl', ['edhubAuthService', '$scope',
        function (edhubAuthService, $scope) {
            const vm = this;
            vm.email = "";
            vm.pw = "";
            vm.error = "";

            vm.userSignup = function () {
                edhubAuthService.userSignup(vm.email, vm.pw)
                    .then(function (auth) {
                        edhubAuthService.userLogin(vm.email, vm.pw).then(function () {
                            console.log("jha - auth = ");
                            console.log(auth);
                            $scope.ccSetCurrentUser(auth.email);
                        }, function(err){
                            vm.error = err.message;
                        });
                    }, function (err) {
                        vm.error = err.message;
                    });
            }
        }
    ]);
}());