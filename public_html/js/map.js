"use strict";
/*global google, itinerary */

/*
 Google mapping helper functions
 */
var map;    // declares a global map variable
var markers = [];
var mapPage;
var loc;

function mapRes() {
    map.fitBounds(window.mapBounds);
}

// Sets the map on all markers in the array.
function setMarkers(map) {
    for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(map);
    }
}

function clearMarker(id) {
        markers[id].setMap(null);
}

// Removes the markers from the map, but keeps them in the array.
function clearMarkers() {
    setMarkers(null);
}

// Deletes all markers in the array by removing references to them.
function deleteMarkers() {
    clearMarkers();
    markers = [];
}

function initializeMap() {
// called when page is loaded.
    var mapOptions = {
        disableDefaultUI: true,
        mapTypeId: google.maps.MapTypeId.TERRAIN
    };
    console.log("InitializeMap Start");
     loc = itinerary.locations();

    // Make Google Map Object and attach to <div id="map">
    map = new google.maps.Map(document.getElementById('map'), mapOptions);
    mapPage = this;

    // Set the boundaries of the map based on pin locations
    window.mapBounds = new google.maps.LatLngBounds();

    // create markers on the map for each location in locations array
    addMarkers();
    console.log("InitializeMap Done");
}

function newMarker(placeData) {
        /*
          reads Google Places search results to create map markers.
         placeData is the object returned from search results containing information
         about a single location.
         */

        // The next lines save location data from the search result object to local variables
        var lat = placeData.geometry.location.lat();  // latitude from the place service
        var lon = placeData.geometry.location.lng();  // longitude from the place service
        var name = placeData.name;   // name of the place from the place service
        var bounds = window.mapBounds;            // current boundaries of the map window
        
            var marker = new google.maps.Marker({
        position: placeData.geometry.location,
        title: name,
        map: map
    });
    
    console.log("newMarker");
    markers.push(marker);

       // addMarker(placeData.geometry.location, name);
        setMarkers(map);   // Bind (enable) all markers to map

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
        console.log("callback");
        if (status === google.maps.places.PlacesServiceStatus.OK) {
            newMarker(results[0]);
        }
    }

function addMarkers() {
        /*
         pinPoster(locations) take in the array of locations created by locationFinder()
         and fire off Google place searches for each location
         */
        var service = new google.maps.places.PlacesService(map);
        var place;

        // Iterate through the array of locations, create a search object for each location
        for (place = 0; place < loc.length; place++) {
            console.log(loc[place].name);
            // the search request object
            var request = {
                query: loc[place].name
            };

            // Search the Google Maps API for location data and run the callback
            // function with the search results after each search.
            service.textSearch(request, callback);
        }
    }
    
function resetMap() {
    deleteMarkers();
    addMarkers();
}


  loc = itinerary.locations();
  
// Call the initializeMap() function when the page loads
window.addEventListener('load', initializeMap);

// listen for window resizing and adjust map bounds
window.addEventListener('resize', mapRes);

