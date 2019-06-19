/**
 * Created by Julius Alvarado on 3/10/2019.
 */

(function () {
    'use strict';
    var yc = '/ycombinator/';

    //-- SERVICES --\\
    // ycAuthSer
    function SerAuthClass($firebaseAuth) {
        var auth = $firebaseAuth();

        return {
            auth: auth
        }
    }

    // ycUsersSer
    function SerUsersClass($firebaseArray, $firebaseObject) {
        var usersRef = firebase.database().ref('/users');
        var connectedRef = firebase.database().ref('.info/connected');
        var users = $firebaseArray(usersRef);

        function getProfile(uid) {
            return $firebaseObject(usersRef.child(uid));
        }

        function getDisplayName(uid) {
            return users.$getRecord(uid).displayName;
        }

        function getGravatar(uid) {
            return '//www.gravatar.com/avatar/' + users.$getRecord(uid).emailHash;
        }

        function setOnline(uid) {
            var connected = $firebaseObject(connectedRef);
            var online = $firebaseArray(usersRef.child(uid + '/online'));

            connected.$watch(function () {
                if (connected.$value === true) {
                    online.$add(true).then(function (connectedRef) {
                        connectedRef.onDisconnect().remove();
                    });
                }
            });
        }

        return {
            getProfile: getProfile,
            getDisplayName: getDisplayName,
            getGravatar: getGravatar,
            setOnline: setOnline,
            all: users
        };
    }

    // ycChannelsSer
    function SerChannelsClass($firebaseArray) {
        var ref = firebase.database().ref('/channels');
        var channels = $firebaseArray(ref);

        return {
            channels: channels
        };
    }

    // ycMessagesSer
    function SerMessagesClass($firebaseArray) {

        var channelMessagesRef = firebase.database().ref('/channelMessages');
        var userMessagesRef = firebase.database().ref('/userMessages');

        function forChannel(channelId) {
            return $firebaseArray(channelMessagesRef.child(channelId));
        }

        function forUsers(uid1, uid2) {
            // essentially, the user who has the lower id will "hold" the conversation w/anyone who
            //has this is just a way to ensure users are pulling from the right path in firebase
            var path = uid1 < uid2 ? (uid1 + '/' + uid2) : (uid2 + '/' + uid1);

            return $firebaseArray(userMessagesRef.child(path));
        }

        return {
            forChannel: forChannel,
            forUsers: forUsers
        };
    }

    //-- CONTROLLERS --\\
    // ycAuthCtrl
    function CtrlAuthClass(ycAuthSer, $location) {
        var authCtrl = this;
        authCtrl.error = '';
        authCtrl.authInfo = 'The auth ctrl is wired up to the view';
        authCtrl.user = {
            email: 'chat@app.com',
            password: 'abc123'
        };

        authCtrl.login = function () {
            ycAuthSer.auth.$signInWithEmailAndPassword(authCtrl.user.email, authCtrl.user.password)
                .then(function (authRes) {
                    $location.url('/ycombinator/channels');
                })
                .catch(function (error) {
                    console.log("__>> ERROR:");
                    console.log(error);
                    authCtrl.error = error;
                });
        };

        authCtrl.register = function () {
            console.log('__>> should invoke YC auth service');
            ycAuthSer.auth.$createUserWithEmailAndPassword(
                authCtrl.user.email, authCtrl.user.password
            ).then(function (userRes) {
                $location.url('/');
                console.log('__>> should sign user up with this info');
                console.log(userRes);
            })
                .catch(function (error) {
                    authCtrl.error = error;
                    console.log('__>> ERROR: ' + error);
                });
        }
    } // END OF: CtrlAuthClass

    // ycProfileCtrl
    function CtrlProfileClass($location, md5, authRsv, profileRsv, $timeout) {
        var profileCtrl = this;
        profileCtrl.updateProfileFeedback = '';

        // this simply returns the username of the profile
        profileCtrl.profile = profileRsv;

        profileCtrl.updateProfile = function () {
            profileCtrl.profile.emailHash = md5.createHash(authRsv.email);
            profileCtrl.profile.$save();
            profileCtrl.updateProfileFeedback = 'Username saved ^_^';
            $timeout(function () {
                profileCtrl.updateProfileFeedback = '';
                $location.url('/ycombinator/channels');
            }, 1000);
        };

    } // END OF: CtrlProfileClass()

    // ycChannelsCtrl
    function CtrlChannelsClass(
        $location, ycAuthSer, ycUsersSer, profileRsv, channelsRsv, ycMessagesSer,
        ycChannelsSer
    ) {
        const channelsCtrl = this;
        channelsCtrl.messages = null;
        channelsCtrl.channelName = null;
        channelsCtrl.toDisplay = {
            createChannel: 'createChannel',
            messages: 'messages'
        };
        channelsCtrl.window = '';
        channelsCtrl.users = ycUsersSer.all;
        channelsCtrl.profile = profileRsv;

        // add online presence
        ycUsersSer.setOnline(channelsCtrl.profile.$id);
        channelsCtrl.channels = channelsRsv;
        channelsCtrl.newChannel = {name: ''};

        channelsCtrl.getDisplayName = ycUsersSer.getDisplayName;
        channelsCtrl.getGravatar = ycUsersSer.getGravatar;

        channelsCtrl.switchChannel = function (window) {
            channelsCtrl.window = window;
        };

        /**
         *  Will get messages for either the rooms' messages or direct messages with
         *  other users
         *
         * @param entityId string - could be either a channelID or a userID
         * @param messagesFor
         */
        channelsCtrl.getMessagesFor = function (entityId, messagesFor) {
            channelsCtrl.window = channelsCtrl.toDisplay.messages;

            if (messagesFor === 'forChannel') {
                channelsCtrl.channelName = ycChannelsSer.channels.$getRecord(entityId).name;

                ycMessagesSer.forChannel(entityId).$loaded().then(function (messages) {
                    channelsCtrl.messages = messages;
                })
            } else if (messagesFor === 'forUsers') {
                // get the other users display name
                channelsCtrl.channelName = ycUsersSer.getDisplayName(entityId);

                // the parameter order I'm passing in could be wrong ???
                ycMessagesSer.forUsers(entityId, channelsCtrl.profile.$id).$loaded()
                    .then(function (messages) {
                        channelsCtrl.messages = messages;
                    });
            }
        };

        channelsCtrl.sendMessage = function () {
            var message = channelsCtrl.message;
            var messageData = {
                uid: channelsCtrl.profile.$id,
                body: message,
                timestamp: firebase.database.ServerValue.TIMESTAMP
            };
            if (message.length > 0) {
                channelsCtrl.messages.$add(messageData).then(function () {
                    channelsCtrl.message = '';
                });
            }
        };

        channelsCtrl.createChannel = function () {
            channelsCtrl.channels.$add(channelsCtrl.newChannel)
                .then(function (ref) {
                    channelsCtrl.newChannel = {
                        name: ''
                    };
                    channelsCtrl.getMessagesFor(ref.key, 'forChannel');
                })
                .catch(function (error) {
                    console.log('__>> ERROR - unable to add a channel, error: ', error);
                });
        };

        channelsCtrl.logout = function () {
            channelsCtrl.profile.online = null;
            channelsCtrl.profile.$save().then(function () {
                ycAuthSer.auth.$signOut().then(function (res) {
                    console.log('__>> Firebase Response from signing out = ', res);
                    $location.url('/ycombinator/home');
                });
            });
        };
    }

    // ycMessagesCtrl
    function CtrlMessagesClass(messagesRsv, channelNameRsv, profileRsv) {
        const messagesCtrl = this;
        const profile = profileRsv;

        messagesCtrl.messages = messagesRsv;
        messagesCtrl.channelName = channelNameRsv;
        messagesCtrl.message = '';

        messagesCtrl.sendMessage = function () {
            const message = messagesCtrl.message;
            const messageData = {
                uid: profile.uid,
                body: message,
                timestamp: firebase.database.ServerValue.TIMESTAMP
            };
            if (message.length > 0) {
                messagesCtrl.messages.$add(messageData).then(function () {
                    messagesCtrl.message = '';
                });
            }
        }
    }

    angular.module('edhubJobsApp')
        // SERVICES
        .factory('ycAuthSer', [
            '$firebaseAuth', SerAuthClass
        ])
        .factory('ycUsersSer', [
            '$firebaseArray', '$firebaseObject', SerUsersClass
        ])
        .factory('ycChannelsSer', [
            '$firebaseArray', SerChannelsClass
        ])
        .factory('ycMessagesSer', [
            '$firebaseArray', SerMessagesClass
        ])
        // CONTROLLERS
        .controller('ycAuthCtrl', [
            'ycAuthSer', '$location', CtrlAuthClass
        ])
        .controller('ycProfileCtrl', [
            '$location', 'md5', 'authRsv', 'profileRsv', '$timeout',
            CtrlProfileClass
        ])
        .controller('ycChannelsCtrl', [
            '$location', 'ycAuthSer', 'ycUsersSer', 'profileRsv', 'channelsRsv',
            'ycMessagesSer', 'ycChannelsSer', CtrlChannelsClass
        ])
        .controller('ycMessagesCtrl', [
            'messagesRsv', 'channelNameRsv', 'profileRsv', CtrlMessagesClass
        ])
    ;
}());