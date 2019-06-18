/**
 * Created by Julius Alvarado on 12/13/2018.
 */

(function (GeoFire) {
    'use strict';

    const app = angular.module('edhubJobsApp');

    app.controller('JuliusCtrl', [
        'edhubJobPostService', '$http', '$location', 'serGmapLanding', JuliusCtrlClass
    ]);

    function JuliusCtrlClass(
        edhubJobPostService, $http, $location, serGmapLanding
    ) {
        const vm = this;
        var latitude;
        var longitude;
        vm.deleteOrg = deleteOrg;
        vm.nodeUsers = serGmapLanding.nodeUsers;
        vm.nodeClubs = serGmapLanding.nodeClubs;

        // Generate a random Firebase location
        var geoFirePracRef = firebase.database().ref().child('mapPrac').push();

        // Create a new GeoFire instance at the random Firebase location
        var geoFire = new GeoFire(geoFirePracRef);

        // Get the current user's location
        getLocation();

        // Style credit: https://snazzymaps.com/style/1/pale-dawn
        const mapStyle1 = [
            {
                "featureType": "administrative",
                "elementType": "all",
                "stylers": [
                    {
                        "visibility": "on"
                    },
                    {
                        "lightness": 33
                    }
                ]
            },
            {
                "featureType": "landscape",
                "elementType": "all",
                "stylers": [
                    {
                        "color": "#f2e5d4"
                    }
                ]
            },
            {
                "featureType": "poi.park",
                "elementType": "geometry",
                "stylers": [
                    {
                        "color": "#c5dac6"
                    }
                ]
            },
            {
                "featureType": "poi.park",
                "elementType": "labels",
                "stylers": [
                    {
                        "visibility": "on"
                    },
                    {
                        "lightness": 20
                    }
                ]
            },
            {
                "featureType": "road",
                "elementType": "all",
                "stylers": [
                    {
                        "lightness": 20
                    }
                ]
            },
            {
                "featureType": "road.highway",
                "elementType": "geometry",
                "stylers": [
                    {
                        "color": "#c5c6c6"
                    }
                ]
            },
            {
                "featureType": "road.arterial",
                "elementType": "geometry",
                "stylers": [
                    {
                        "color": "#e4d7c6"
                    }
                ]
            },
            {
                "featureType": "road.local",
                "elementType": "geometry",
                "stylers": [
                    {
                        "color": "#fbfaf7"
                    }
                ]
            },
            {
                "featureType": "water",
                "elementType": "all",
                "stylers": [
                    {
                        "visibility": "on"
                    },
                    {
                        "color": "#acbcc9"
                    }
                ]
            }
        ];

        const mapStyle = [
            {
                "featureType": "all",
                "elementType": "labels.text.fill",
                "stylers": [
                    {
                        "saturation": 36
                    },
                    {
                        "color": "#000000"
                    },
                    {
                        "lightness": 40
                    }
                ]
            },
            {
                "featureType": "all",
                "elementType": "labels.text.stroke",
                "stylers": [
                    {
                        "visibility": "on"
                    },
                    {
                        "color": "#000000"
                    },
                    {
                        "lightness": 16
                    }
                ]
            },
            {
                "featureType": "all",
                "elementType": "labels.icon",
                "stylers": [
                    {
                        "visibility": "off"
                    }
                ]
            },
            {
                "featureType": "administrative",
                "elementType": "geometry.fill",
                "stylers": [
                    {
                        "color": "#000000"
                    },
                    {
                        "lightness": 20
                    }
                ]
            },
            {
                "featureType": "administrative",
                "elementType": "geometry.stroke",
                "stylers": [
                    {
                        "color": "#000000"
                    },
                    {
                        "lightness": 17
                    },
                    {
                        "weight": 1.2
                    }
                ]
            },
            {
                "featureType": "landscape",
                "elementType": "geometry",
                "stylers": [
                    {
                        "color": "#000000"
                    },
                    {
                        "lightness": 20
                    }
                ]
            },
            {
                "featureType": "poi",
                "elementType": "geometry",
                "stylers": [
                    {
                        "color": "#000000"
                    },
                    {
                        "lightness": 21
                    }
                ]
            },
            {
                "featureType": "road.highway",
                "elementType": "geometry.fill",
                "stylers": [
                    {
                        "color": "#000000"
                    },
                    {
                        "lightness": 17
                    }
                ]
            },
            {
                "featureType": "road.highway",
                "elementType": "geometry.stroke",
                "stylers": [
                    {
                        "color": "#000000"
                    },
                    {
                        "lightness": 29
                    },
                    {
                        "weight": 0.2
                    }
                ]
            },
            {
                "featureType": "road.arterial",
                "elementType": "geometry",
                "stylers": [
                    {
                        "color": "#000000"
                    },
                    {
                        "lightness": 18
                    }
                ]
            },
            {
                "featureType": "road.local",
                "elementType": "geometry",
                "stylers": [
                    {
                        "color": "#000000"
                    },
                    {
                        "lightness": 16
                    }
                ]
            },
            {
                "featureType": "transit",
                "elementType": "geometry",
                "stylers": [
                    {
                        "color": "#000000"
                    },
                    {
                        "lightness": 19
                    }
                ]
            },
            {
                "featureType": "water",
                "elementType": "geometry",
                "stylers": [
                    {
                        "color": "#000000"
                    },
                    {
                        "lightness": 17
                    }
                ]
            }
        ];

        // Escapes HTML characters in a template literal string, to prevent XSS.
        // See https://www.owasp.org/index.php/XSS_%28Cross_Site_Scripting%29_Prevention_Cheat_Sheet#RULE_.231_-_HTML_Escape_Before_Inserting_Untrusted_Data_into_HTML_Element_Content
        function sanitizeHTML(strings) {
            const entities = {'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'};
            let result = strings[0];
            for (let i = 1; i < arguments.length; i++) {
                result += String(arguments[i]).replace(/[&<>'"]/g, (char) => {
                    return entities[char];
                });
                result += strings[i];
            }
            return result;
        }

        /* Callback method from the geolocation API which receives the current user's location */
        function geolocationCallback(location) {
            latitude = location.coords.latitude;
            longitude = location.coords.longitude;
            console.log("Retrieved user's location: [" + latitude + ", " + longitude + "]");

            var username = "Julius";

            geoFire.set(username, [latitude, longitude])
                .then(function () {
                    console.log("Current user " + username + "'s location has been added to GeoFire");

                    // When the user disconnects from Firebase (e.g. closes the app, exits the browser),
                    // remove their GeoFire entry
                    geoFirePracRef.child(username).onDisconnect().remove();

                    var currentUrl = $location.url();

                    console.log("Added handler to remove user " + username + " from GeoFire when you leave this page.");
                    console.log("__>> $location.url() = " + currentUrl);

                    //TODO: refactor each view to have its' own controller rather than use this "gmap router"

                    // gmap _ROUTER...
                    // since both views are using the same controller I have to delegate which gmap function to invoke
                    if (currentUrl === '/') {
                        initMap();
                    } else if (currentUrl === '/events') {
                        myMap();
                    } else {
                        // just go to the home view
                        $location.url('/');
                    }

                })
                .catch(function (error) {
                    log("__>> ERROR adding user " + username + "'s location to GeoFire");
                    console.log("__>> ERROR adding user " + username + "'s location to GeoFire, ERROR:", error);
                });
        }

        /* Handles any errors from trying to get the user's current location */
        var errorHandler = function (error) {
            if (error.code === 1) {
                console.log("Error: PERMISSION_DENIED: User denied access to their location");
            } else if (error.code === 2) {
                console.log("Error: POSITION_UNAVAILABLE: Network is down or positioning satellites cannot be reached");
            } else if (error.code === 3) {
                console.log("Error: TIMEOUT: Calculating the user's location too took long");
            } else {
                console.log("Unexpected error code")
            }
        };

        /* Uses the HTML5 geolocation API to get the current user's location */
        function getLocation() {
            if (typeof navigator !== "undefined" && typeof navigator.geolocation !== "undefined") {
                console.log("Asking user to get their location");
                navigator.geolocation.getCurrentPosition(geolocationCallback, errorHandler);
            } else {
                console.log("Your browser does not support the HTML5 Geolocation API, so this demo will not work.")
            }
        }

        function deleteOrg() {
            // edhubJobPostService.returnAllOrganizations().$remove(1).then(function (res) {
            //     console.log("The item that got deleted = ");
            //     console.log(res);
            // });

            var organizationsList = edhubJobPostService.returnAllOrganizations();
            edhubJobPostService.returnAllOrganizations().$loaded().then(function (res) {
                var organizationItem = organizationsList[1];
                console.log("organizationItem = ", organizationItem);
                organizationsList.$remove(organizationItem);
            });
        }

        /* Logs to the page instead of the console */
        function log(message) {
            var childDiv = document.createElement("div");
            var textNode = document.createTextNode(message);
            childDiv.appendChild(textNode);
            document.getElementById("log").appendChild(childDiv);
        }

        function initMap() {
            let featuresArray;
            let clubs = vm.nodeClubs[0];
            let users = vm.nodeUsers;
            // may want to save these in future
            //delete clubs.$id;
            //delete clubs.$priority;
            //TODO: cache the gmap object
            const map = new google.maps.Map(
                document.getElementById('prac-one-gmap-container'),
                {
                    zoom: 7,
                    // San Francisco = lat: -122.413972, lng:37.776532
                    // London = lat: 51.507351, lng: 0.127758
                    center: {lat: 37.776532, lng: -122.413972 } ,
                    styles: mapStyle
                }
            );

            featuresArray = map.data.addGeoJson(clubs);
            console.log('__>> the features array = ');
            console.log(featuresArray);

            map.data.setStyle(feature => {
                let icon = {
                    url: `images/icon_${feature.getProperty('category')}.png`,
                    scaledSize: new google.maps.Size(64, 64)
                };

                return {
                    icon: icon
                }
            });

            //const apiKey = 'AIzaSyC97txSDaXo4QxSphjx_KqwW748OGwJUz8';
            const infoWindow = new google.maps.InfoWindow();
            infoWindow.setOptions({pixelOffset: new google.maps.Size(0, -30)});

            // addListener('click',
            map.data.addListener('click', event => {
                // properties from the geojson file
                const category = event.feature.getProperty('category');
                const hours = event.feature.getProperty('hours');
                const description = event.feature.getProperty('description');
                const name = event.feature.getProperty('name');
                const phone = event.feature.getProperty('phone');

                // gmap geometry
                const position = event.feature.getGeometry().get();

                // <img style="float:left; width:70px; margin-top:30px" src="img/logo_${category}.png">
                const content = sanitizeHTML`
                     <div>
                        <h2>${name}</h2><p>${description}</p>
                        <a href="#!/club/club-name">View Club Profile</a>
                        <p><b>Open:</b> ${hours}<br/><b>Phone:</b> ${phone}</p>
                     </div>
                `;

                infoWindow.setContent(content);
                infoWindow.setPosition(position);
                infoWindow.open(map);
            });

        } // END OF: initMap()

        //-- Google Maps code:
        function myMap() {
            var mapProp = {
                center: new google.maps.LatLng(latitude, longitude),
                zoom: 15,
                //controlSize: 0,
                //disableDefaultUI: true
            };

            var map = new google.maps.Map(document.getElementById("googleMap"), mapProp);
            var marker = new google.maps.Marker({position: mapProp.center});
            marker.setMap(map);

            console.log('__>> Plamigo map app initialized');
            //console.log(map);
        }
    }

})(window.geofire.GeoFire);