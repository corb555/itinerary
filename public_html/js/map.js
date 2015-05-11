"use strict";
/*global google, viewModel */

/*
 Google mapping helper functions
 */
var map;    // declares a global map variable
var locations;

function mapRes() {
    map.fitBounds(window.mapBounds);
}

function initializeMap() {
// called when page is loaded.
    var mapOptions = {
        disableDefaultUI: true
    };

    function locationFinder() {
        /*
         locationFinder() returns an array of every location 
         */
        locations = ["big sur", "monterey", "carmel", "point lobos", "julia pfeiffer burns state park"];
    }

    function createMapMarker(placeData) {
        /*
         createMapMarker(placeData) reads Google Places search results to create map pins.
         placeData is the object returned from search results containing information
         about a single location.
         */

        // The next lines save location data from the search result object to local variables
        var lat = placeData.geometry.location.lat();  // latitude from the place service
        var lon = placeData.geometry.location.lng();  // longitude from the place service
        var name = placeData.name;   // name of the place from the place service
        var bounds = window.mapBounds;            // current boundaries of the map window

        // marker is an object with additional data about the pin for a single location
        var marker = new google.maps.Marker({
            map: map,
            position: placeData.geometry.location,
            title: name
        });

        // infoWindows are helper windows that open when you click
        // or hover over a pin on a map. 
        var infoWindow = new google.maps.InfoWindow({
            content: name
        });

        // add pin to the map
        bounds.extend(new google.maps.LatLng(lat, lon));

        // fit the map to the new marker
        map.fitBounds(bounds);

        // center the map
        map.setCenter(bounds.getCenter());
    }

    function callback(results, status) {
        /*
         callback(results, status) makes sure the search returned results for a location.
         If so, it creates a new map marker for that location.
         */
        if (status === google.maps.places.PlacesServiceStatus.OK) {
            createMapMarker(results[0]);
        }
    }

    function pinPoster(locs) {
        /*
         pinPoster(locations) take in the array of locations created by locationFinder()
         and fire off Google place searches for each location
         */
        var service = new google.maps.places.PlacesService(map);
        var place;

        // Iterate through the array of locations, create a search object for each location
        for (place in locs) {
            // the search request object
            var request = {
                query: locs[place]
            };

            // Search the Google Maps API for location data and run the callback
            // function with the search results after each search.
            service.textSearch(request, callback);
        }
    }

    // Make Google Map Object and attach to <div id="Map">
    map = new google.maps.Map(document.getElementById('map'), mapOptions);

    // Set the boundaries of the map based on pin locations
    window.mapBounds = new google.maps.LatLngBounds();

    // locations is an array of location strings returned from locationFinder()
    locationFinder();

    // create pins on the map for each location in locations array
    pinPoster(locations);
}

// Call the initializeMap() function when the page loads
window.addEventListener('load', initializeMap);

// listen for window resizing and adjust map bounds
window.addEventListener('resize', mapRes);

//document.getElementById("pages").addEventListener("transitionend", mapRes);
