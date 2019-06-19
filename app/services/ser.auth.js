/**
 * Created by Julius Alvarado on 9/5/2017.
 */

(function () {
    "use strict";

    angular.module('edhubJobsApp').factory('edhubAuthService', [
        '$firebaseAuth', '$rootScope', '$firebaseObject', '$location', '$q',
        EdhubAuthClass
    ]);

    function EdhubAuthClass($firebaseAuth, $rootScope, $firebaseObject, $location, $q) {
        $rootScope.rootEdhubAuthUser = "";
        const orgRef = firebase.database().ref('organizations');
        const auth = $firebaseAuth();
        let authApi = {};
        let facebookProvider = new firebase.auth.FacebookAuthProvider();

        auth.$onAuthStateChanged(function (authUser) {
            if (authUser) {
                var authUserRef = orgRef.child(authUser.uid);
                $rootScope.rootEdhubAuthUser = $firebaseObject(authUserRef);
                console.log("__>> The Auth User =");
                console.log($rootScope.rootEdhubAuthUser);
                $rootScope.$broadcast("edhub-event-auth-user", {
                    haveAuthUser: true
                });
            } else {
                $rootScope.rootEdhubAuthUser = "";
                $rootScope.$broadcast("edhub-event-auth-user", {
                    haveAuthUser: false
                });
                console.log("There is no longer an Auth User");
                console.log($rootScope.rootEdhubAuthUser);
            }
        });

        authApi = {
            login: function (user, info) {
                auth.$signInWithEmailAndPassword(user.email, user.password)
                    .then(function (authUser) {
                        // console.log("edhub - user successfully signed in");
                        // console.log(authUser);
                        if (!!info.path) {
                            $location.path('/' + info.path);
                        } else {
                            $location.path('/');
                        }
                    })
                    .catch(function (error) {
                        console.error("edhub - There was an error =");
                        console.log(error.message);
                        $rootScope.rootAuthError = error.message;
                    });
            },
            logout: function () {
                return auth.$signOut();
            },
            requireAuth: function () {
                return auth.requireSignIn();
            },
            signup: function (user, info) {
                // give 'info a default value if nothing got passed in
                info = !!info ? info : {};
                console.log("edhub - signup user = ", user);
                auth.$createUserWithEmailAndPassword(user.email, user.password)
                    .then(function (regUser) {
                        orgRef.child(regUser.uid).set({
                            date: firebase.database.ServerValue.TIMESTAMP,
                            regUser: regUser.uid,
                            orgName: !!user.orgName ? user.orgName : 'blank',
                            email: user.email,
                            repName: !!user.name ? user.name : 'blank'
                        });
                        $rootScope.rootMessage = "Thanks for registering " + user.name;
                        if (info.listOrg) {
                            console.log("broadcasting 'edhub-list-unauth-org-signup'");
                            $rootScope.$broadcast("edhub-list-unauth-org-signup", {
                                orgId: regUser.uid
                            });
                        }

                        authApi.login(user, info);
                    })
                    .catch(function (error) {
                        console.error("edhub - There was an error =");
                        console.log(error.message);
                        $rootScope.rootAuthError = error.message;
                        return null;
                    });
            },
            getAuthUser: function () {
                return $rootScope.rootEdhubAuthUser;
            },
            facebookSignin: function () {
                firebase.auth().signInWithPopup(facebookProvider)
                    .then(function (res) {
                        let token = res.credential.accessToken;
                        let user = res.user;
                        $scope.$apply(function(){
                            $rootScope.rootEdhubAuthUser = user.email;
                        });


                        // log on success results
                        console.log('__>> SUCCESS - Facebook login ');
                        //console.log(token);
                        console.log(user);
                        console.log(user.email);
                    })
                    .catch(function (error) {
                        let errorCode = error.code;
                        let errorMessage = error.message;
                        let email = error.email;
                        let credential = error.credential;

                        // log error results :(
                        console.log('__>> ERROR - There were Facebook Auth');
                        console.log(errorCode);
                        console.log(errorMessage);
                        console.log(email);
                        console.log(credential);
                    });
            }
        };

        // return $firebaseAuth(), we are returning it in as an obj because one of the
        // properties is doing a sort of recursive call
        return authApi;
    }
}());