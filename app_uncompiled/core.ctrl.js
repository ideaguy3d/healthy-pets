/**
 * Created by Julius Alvarado on 9/10/2017.
 */

(function () {
    'use strict';

    angular.module('edhubJobsApp').controller('CoreCtrl', [
        '$rootScope', '$scope', '$mdSidenav', '$mdDialog', '$timeout',
        'edhubAuthService', '$location', CoreClass
    ]);

    function CoreClass(
        $rootScope, $scope, $mdSidenav, $mdDialog, $timeout,
        edhubAuthService, $location
    ) {
        $scope.ccCurrentUser = "";
        $scope.coreEdhubHorizontalState = true;
        $scope.ccAuthBoxHidden = false;
        $scope.ccAuthBoxIsOpen = false;
        $scope.ccAuthBoxHover = true;
        $scope.coreEdhubToggleSideNav = coreEdhubToggleSideNav('core-sidenav');
        const enumAuthBox = {
            loginSignup: "Login/Signup",
            logout: "Logout",
            settings: "Settings",
            editProfile: "Edit Profile",
            applications: "Favorite Clubs"
        };

        $scope.ccSetCurrentUser = function (userEmail) {
            $scope.ccCurrentUser = userEmail;
        };

        function coreEdhubToggleSideNav(componentId) {
            console.log("edhub - coreEdhubToggleSideNav() invoked");
            return function () {
                $mdSidenav(componentId).toggle();
            }
        }

        // On opening, add a delayed property which shows tooltips
        // after the speed dial has opened
        // so that they have the proper position; if closing,
        // immediately hide the tooltips
        $scope.$watch('ccAuthBoxIsOpen', function (isOpen) {
            if (isOpen) {
                $timeout(function () {
                    $scope.tooltipVisible = $scope.ccAuthBoxIsOpen;
                }, 400);
            } else {
                $scope.tooltipVisible = $scope.ccAuthBoxIsOpen;
            }
        });

        // for ng-md-icon, This is what is being used.
        $scope.ccItems = [
            {name: _determineAuthState(), icon: "login", direction: "left"},
            {name: enumAuthBox.editProfile, icon: "edit", direction: "left"},
            //{name: enumAuthBox.settings, icon: "settings", direction: "bottom"},
            {name: enumAuthBox.applications, icon: "view_list", direction: "left"}
        ];

        // for md-icon, NOT Currently Being Used!!
        $scope.ccCustomIcons = [
            {name: "Login", icon: "img/icons/twitter.svg", direction: "bottom"},
            {name: "Edit Profile", icon: "img/icons/facebook.svg", direction: "top"},
            {name: "Settings", icon: "img/icons/hangout.svg", direction: "bottom"}
        ];

        $scope.ccAuthBoxAction = function ($event, item) {
            switch (item.name) {
                case enumAuthBox.loginSignup:
                    _loginSignup();
                    break;
                case enumAuthBox.logout:
                    _logout();
                    break;
                case enumAuthBox.settings:
                    _settings();
                    break;
                case enumAuthBox.editProfile:
                    _editProfile();
                    break;
                case enumAuthBox.applications:
                    _orgApplicants();
                    break;
                default:
                    console.error("Something went wront w/the AuthBox actions");
            }
        };

        // as of 12:08pm-4/26/2018, the modal doesn't center correctly :(
        // TODO: eventually get this modal dialog to work because it's really REALLY cool!
        $scope.ccOpenDialog = function ($event, item) {
            // Show the dialog
            $mdDialog.show({
                clickOutsideToClose: true,
                controller: function ($mdDialog) {
                    // Save the clicked item
                    this.item = item;

                    // Setup some handlers
                    this.close = function () {
                        $mdDialog.cancel();
                    };
                    this.submit = function () {
                        $mdDialog.hide();
                    };
                },
                controllerAs: 'modalAuth',
                templateUrl: 'states/auth/modal.auth.html',
                targetEvent: $event
            });
        };

        $rootScope.$on("edhub-event-auth-user", function(e, args){
            $scope.ccItems[0].name = _determineAuthState();
        });

        function _determineAuthState() {
            var authUser = edhubAuthService.getAuthUser();
            return authUser === "" ? enumAuthBox.loginSignup : enumAuthBox.logout;
        }

        function _loginSignup() {
            console.log("in _authAction() !! ^_^");
            $location.path("/signup");
        }

        function _logout() {
            edhubAuthService.logout();
            $location.path("/user-auth-logout/logout-page");
        }

        function _settings() {
            console.log("in _settings() [=");
        }

        function _editProfile() {
            console.log("in _editProfile() ! :)");
            $location.url('/post');
        }

        function _orgApplicants() {
            $location.path('/applications');
        }
    }
}());