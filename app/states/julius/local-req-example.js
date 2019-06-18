/**
 * Created by Julius Alvarado on 5/16/2019.
 */

function initMap() {
    var localStoreData;
    $http.get('stores.json').then(function (res) {
        localStoreData = res.data;
        console.log("__>> localStoreData = ", localStoreData); //TODO: cache the gmap object

        var map = new google.maps.Map(document.getElementById('prac-one-gmap-container'), {
            zoom: 12,
            // use San Francisco coordinates, -122.413972, 37.776532
            center: {
                lat: 37.776532,
                lng: -122.413972
            },
            styles: mapStyle
        }); //-- do not add any more data to the firebase node:
        //storePrac.$add(localStoreData);

        map.data.addGeoJson(localStoreData);
        map.data.setStyle(function (feature) {
            return {
                icon: {
                    url: "images/icon_".concat(feature.getProperty('category'), ".png"),
                    scaledSize: new google.maps.Size(64, 64)
                }
            };
        });

        var infoWindow = new google.maps.InfoWindow();
        infoWindow.setOptions({
            pixelOffset: new google.maps.Size(0, -30)
        }); // addListener('click',

        map.data.addListener('click', function (event) {
            // properties from the geojson file
            var category = event.feature.getProperty('category');
            var hours = event.feature.getProperty('hours');
            var description = event.feature.getProperty('description');
            var name = event.feature.getProperty('name');
            var phone = event.feature.getProperty('phone'); // gmap geometry

            var position = event.feature.getGeometry().get(); // <img style="float:left; width:70px; margin-top:30px" src="img/logo_${category}.png">

            var content = sanitizeHTML(_templateObject(), name, description, hours, phone);
            infoWindow.setContent(content);
            infoWindow.setPosition(position);
            infoWindow.open(map);
        });

    })["catch"](function (err) {
        console.log("__>> ERROR: ", err);
    });

} // END OF: initMap()