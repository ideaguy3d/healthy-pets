angular.module('edhubJobsApp', [
    'firebase', 'angular-md5', 'ngRoute', 'ngMaterial', 'ngMdIcons', 'smoothScroll', 'ngAnimate'
]).config(['$routeProvider', '$locationProvider',
    function ($routeProvider) {
        $routeProvider
        //-- Google Maps app
            .when('/', {
                templateUrl: 'states/julius/view.map-render.html',
                controller: 'JuliusCtrl',
                controllerAs: 'cJulius',
                resolve: {}
            })
            .when('/events', {
                templateUrl: 'states/julius/view.julius2.html',
                controller: 'JuliusCtrl',
                controllerAs: 'cJulius',
                resolve: {}
            })
            .when('/club/:name', {
                templateUrl: 'states/club-profile/view.club-profile.html',
                controller: 'ClubProfileCtrl',
                controllerAs: 'cClubProfile'
            })
            .when('/post', {
                templateUrl: 'states/post/view.post.html',
                controller: 'PostCtrl',
                controllerAs: 'postJobCtrl'
            })

            /*******************************************
             Other UI States to serve as reference code
             ******************************************/
            // Y Combinator states
            .when('/ycombinator/positions', {
                templateUrl: 'states/ycombinator/view.yc-landing.html',
                controller: 'YCombinatorLandingCtrl',
                controllerAs: 'landingCtrl'
            })
            .when('/ycombinator/home', {
                templateUrl: 'states/ycombinator/chat/view.yc-home.html',
                controller: 'YCombinatorLandingCtrl',
                controllerAs: 'landingCtrl',
                resolve: {
                    // the user does not have to be authenticated
                    requireNoAuth: function ($location, ycAuthSer) {
                        ycAuthSer.auth.$requireSignIn()
                            .then(function (authUser) {
                                // if the user is already logged in send them to the channels state
                                $location.url('/ycombinator/channels');
                            })
                            .catch(function (error) {
                                var errorMessage = '__>> ERROR - error while going to UI state home';
                                console.log(errorMessage, error);
                                return errorMessage;
                            });
                    }
                }
            })
            .when('/ycombinator/chat', {
                templateUrl: 'states/ycombinator/chat/view.yc-chat.html',
                controller: 'ycAuthCtrl',
                controllerAs: 'cycAuth',
                resolve: {
                    // the user does not have to be authenticated
                    requireNoAuth: function ($location, ycAuthSer) {
                        ycAuthSer.auth.$requireSignIn()
                            .then(function (authUser) {
                                // if the user is already logged in send them to the channels state
                                $location.url('/ycombinator/channels');
                            })
                            .catch(function (error) {
                                var errorMessage = '__>> ERROR - error while going to UI state home';
                                console.log(errorMessage, error);
                                return errorMessage;
                            });
                    }
                }
            })
            .when('/ycombinator/chat/register', {
                templateUrl: 'states/ycombinator/chat/view.yc-register.html',
                controller: 'ycAuthCtrl',
                controllerAs: 'cycAuth',
                resolve: {
                    // no authenticated user should go to login/signup view
                    requireNoAuthRsv: function (ycAuthSer, $location) {
                        return ycAuthSer.auth.$requireSignIn()
                            .then(function (authUser) {
                                console.log('__>> INFO - user is already logged in, authUser: ', authUser);
                                $location.url('/ycombinator/channels');
                            })
                            // the user is not authenticated
                            .catch(function (error) {
                                console.log('__>> ERROR = ', error);
                                return 'ERROR = ' + error;
                            });
                    }
                }
            })
            .when('/ycombinator/chat/login', {
                templateUrl: 'states/ycombinator/chat/view.yc-login.html',
                controller: 'ycAuthCtrl',
                controllerAs: 'cycAuth',
                resolve: {
                    // no authenticated user should go to login/signup view
                    requireNoAuthRslv: function (ycAuthSer, $location) {
                        return ycAuthSer.auth.$requireSignIn()
                            .then(function (res) {
                                console.log('__>> INFO - user is already logged in, authUser: ', authUser);
                                $location.url('/ycombinator/channels');
                            })
                            .catch(function (error) {
                                console.log('__>> ERROR = ', error);
                                return 'ERROR = ' + error;
                            });
                    }
                }
            })
            .when('/ycombinator/profile', {
                templateUrl: 'states/ycombinator/chat/view.profile.html',
                controller: 'ycProfileCtrl',
                controllerAs: 'cycProfile',
                resolve: {
                    authRsv: function ($location, ycUsersSer, ycAuthSer) {
                        // .$requireSignIn() will have an on success cb if there is an authenticated user
                        return ycAuthSer.auth.$requireSignIn().catch(function (error) {
                            console.log('__>> ERROR - tried to go to profile ui state without being authenticated, err = ', error);
                            $location.url('/ycombinator/home');
                        });
                    },
                    profileRsv: function (ycUsersSer, ycAuthSer) {
                        return ycAuthSer.auth.$requireSignIn().then(function (authUserObj) {
                            // CRITICAL ! CRITICAL !! CRITICAL !!! This is where to put $loaded()
                            return ycUsersSer.getProfile(authUserObj.uid).$loaded();
                        });
                    }
                }
            })
            .when('/ycombinator/channels', {
                templateUrl: 'states/ycombinator/chat/view.channels.html',
                controller: 'ycChannelsCtrl',
                controllerAs: 'cycChannels',
                resolve: {
                    channelsRsv: function (ycChannelsSer) {
                        return ycChannelsSer.channels.$loaded()
                            .catch(function (error) {
                                console.log('__>> ERROR - There was an error fetching the channels, error: ' + error);
                            });
                    },
                    profileRsv: function ($location, ycAuthSer, ycUsersSer) {
                        return ycAuthSer.auth.$requireSignIn()
                            .then(function (authUser) {
                                return ycUsersSer.getProfile(authUser.uid).$loaded()
                                    .then(function (profile) {
                                        if (profile.displayName) {
                                            return profile;
                                        } else {
                                            $location.url('/ycombinator/profile');
                                        }
                                    })
                                    .catch(function (error) {
                                        console.log('__>> ERROR - Unable to get the users profile, error: ', error);
                                    });
                            })
                            .catch(function (error) {
                                console.log('__>> ERROR - The user is not signed in, error: ', error);
                                $location.url('/ycombinator/home');
                            });
                    }
                }
            })
            .when('/ycombinator/rooms/:channelId/messages', {
                templateUrl: 'states/ycombinator/chat/view.messages.html',
                controller: 'ycMessagesCtrl',
                controllerAs: 'cycMessages',
                resolve: {
                    messagesRsv: function ($route, ycMessagesSer) {
                        return ycMessagesSer.forChannel($route.current.params.channelId).$loaded();
                    },
                    channelNameRsv: function ($route, ycChannelsSer) {
                        // we're not using $loaded() here... Hmmm. I wonder why.
                        return '#' + ycChannelsSer.channels.$loaded().$getRecord($route.current.params.channelId).name;
                    },
                    profileRsv: function ($location, ycAuthSer, ycUsersSer) {
                        return ycAuthSer.auth.$requireSignIn(
                            // on success callback
                            function (authUser) {
                                return ycUsersSer.getProfile(authUser.uid).$loaded().then(function (profile) {
                                    var displayName = profile.displayName;
                                    if (displayName) {
                                        return displayName;
                                    } else {
                                        $location.url('/ycombinator/profile');
                                    }
                                }).catch(function (error) {
                                    console.log('__>> ERROR - unable to get the users profile info, error: ', error);
                                });
                            },
                            // on error callback
                            function (error) {
                                console.log('__>> The user is not authenticated, error: ', error);
                                $location.url('/ycombinator/home');
                            }
                        );
                    }
                }
            })

            // The rest of the Edhub states
            .when('/landing', {
                templateUrl: 'states/landing/view.landing.html',
                controller: 'LandingCtrl',
                controllerAs: 'landingCtrl'
            })
            .when('/signup', {
                templateUrl: 'states/auth/view.tab.join.html',
                controller: 'AuthCtrl',
                controllerAs: 'signup',
                resolve: {
                    unauthApplyRslv: function ($route) {
                        // sta = Signup To Apply
                        return $route.current.params.status === "sta"
                            ? "Hi ^_^/ Please signup/login before applying"
                            : null;
                    }
                }
            })
            .when('/signup2', {
                templateUrl: 'states/auth/view.signup.html',
                controller: 'AuthCtrl',
                controllerAs: 'signup',
                resolve: {
                    unauthApplyRslv: function ($route) {
                        // sta = Signup To Apply
                        return $route.current.params.status === "sta"
                            ? "Hi ^_^/ Please signup/login before applying"
                            : null;
                    }
                }
            })
            .when('/signup/:status', {
                templateUrl: 'states/auth/view.signup.html',
                controller: 'AuthCtrl',
                controllerAs: 'signup',
                resolve: {
                    unauthApplyRslv: function ($route) {
                        // sta = Signup To Apply
                        return $route.current.params.status === "sta"
                            ? "Hi ^_^/ Please signup/login before applying"
                            : null;
                    }
                }
            })
            .when('/login', {
                templateUrl: 'states/auth/view.login.html',
                controller: 'AuthCtrl',
                controllerAs: 'login',
                resolve: {
                    unauthApplyRslv: function ($route) {
                        // sta = Signup To Apply
                        return $route.current.params.status === "sta"
                            ? "Hi ^_^/ Please signup/login before applying"
                            : null;
                    }
                }
            })
            .when('/user-auth-logout/logout-page', {
                templateUrl: 'states/auth/view.logout.html'
            })
            .when('/profile/:user', {
                templateUrl: 'states/auth/view.profile.html'
            })
            .when('/apply', {
                templateUrl: 'states/apply/view.apply.html',
                controller: 'ApplyToJobCtrl',
                controllerAs: 'applyToJobCtrl'
            })
            .when('/apply/:orgId/:orgName', {
                templateUrl: 'states/apply/view.apply.org.html',
                controller: 'ApplyToOrgCtrl',
                controllerAs: 'applyToOrgCtrl',
                resolve: {
                    orgJobAppsRslv: function ($route, edhubJobPostService) {
                        return edhubJobPostService.forOrg($route.current.params.orgId).$loaded();
                    }
                }
            })
            .when('/apply-thanks', {
                templateUrl: 'states/apply/view.thanks.html'
            })
            .when('/apply-job/:orgName/:jobId', {
                templateUrl: 'states/apply/view.apply.job-org.html',
                controller: 'ApplyToJobCtrl',
                controllerAs: 'applyToJobCtrl'
            })
            .when('/applications', {
                templateUrl: 'states/org-apps/view.org-apps.html',
                controller: 'OrgApplicantsCtrl',
                controllerAs: 'orgApps' // cOrgApplicants
            })
            .when('/lab916', {
                templateUrl: '/states/lab916/view.landing.html'
            })
            .when('/uit1', {
                templateUrl: 'ui-prac/uit1.html',
                controller: 'uiPracCtrl',
                controllerAs: 'ui'
            })
            .when('/view-job/:orgId/:orgName', {
                templateUrl: 'states/apply/view.view-job.html',
                controller: 'ApplyToOrgCtrl',
                controllerAs: 'cApplyToOrg',
                resolve: {
                    orgJobAppsRslv: function ($route, edhubJobPostService) {
                        console.log('__>> JA - Will return .getOrganization()');
                        return edhubJobPostService.getOrganization($route.current.params.orgId).$loaded();
                    }
                }
            })

            // Talent Acquisition states
            .when('/talent-acquisition', {
                templateUrl: 'states/talent-acquisition/view.talent-acquisition.html',
                controller: 'TalentAcquisitionCtrl',
                controllerAs: 'cTalentAcquisition'
            })
            // Performance Management states
            .when('/performance-management', {
                templateUrl: 'states/performance-management/view.performance-management.html',
                // PerformanceManagementCtrl
                controller: 'PerformanceManagementCtrl',
                controllerAs: 'cPM',
                resolve: {}
            })
            // Learning Management states
            .when('/learning-management', {
                templateUrl: 'states/learning-management/view.learning-management.html',
                controller: 'LearningManagementCtrl',
                controllerAs: 'cLM',
                resolve: {}
            })
            // go to base url
            .otherwise('/');

        // Initialize Firebase
        const config = {
            apiKey: "AIzaSyCmP0EGaJXE92fU4AwLSSeP4Y8TOc2u_xU",
            authDomain: "maps1-408.firebaseapp.com",
            databaseURL: "https://maps1-408.firebaseio.com",
            projectId: "maps1-408",
            storageBucket: "maps1-408.appspot.com",
            messagingSenderId: "1070748410942"
        };
        firebase.initializeApp(config);
    }
]);