/*global google, itinerary, window */
"use strict";


/*
 Google mapping helper functions
 */
var map;    // declares a global map variable
var markers = [];
var mapPage;
//var loc;

function mapResize() {
    map.fitBounds(window.mapBounds);
}

// Sets the map on all markers in the array.
function setMarkers(map) {
    var i;
    for (i = 0; i < markers.length; i+=1) {
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
mapPage = this;
createMap();
}

function createMap() {
    // called when page is loaded.
    var mapOptions = {
        disableDefaultUI: true,
        mapTypeId: google.maps.MapTypeId.TERRAIN
    };
    console.log("InitializeMap Start");
    //loc = itinerary.locations();

    map = null;
    // Make Google Map Object and attach to <div id="map">
    map = new google.maps.Map(document.getElementById('map'), mapOptions);
    
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

    markers.push(marker);

    // addMarker(placeData.geometry.location, name);
    setMarkers(map);   // Bind (enable) all markers to map

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
        newMarker(results[0]);
    }
}

function addMarkers() {
    /*
     using the array of locations, fire off Google place searches for each location
     */
    var service = new google.maps.places.PlacesService(map);
    var place;
    var loc;

    // Iterate through the array of locations, create a search object for each location
    loc = itinerary.filteredLocations();
    for (place = 0; place < loc.length; place+=1) {
        // the search request object
        var request = {
            query: loc[place].name
        };

        // Search the Google Maps API for location data and run the callback
        // function with the search results after each search.
        service.textSearch(request, callback);
    }
}

function radarSearch(loc) {
  var request = {
    bounds: map.getBounds(),
    keyword: 'best view',
    query: loc
  };
  
  var service = new google.maps.places.PlacesService(map);
  service.radarSearch(request, callback);
}

/*
function resetMap() {
    //deleteMarkers();
    
    // Make Google Map Object and attach to <div id="map">
    map = null;
    map = new google.maps.Map(document.getElementById('map'), mapOptions);

    // Set the boundaries of the map based on pin locations
    window.mapBounds = new google.maps.LatLngBounds();
    addMarkers();
    // TODO - new Markers dont get info boxes
} */

/*
 function point(name, lat, long) {
 this.name = name;
 this.lat = ko.observable(lat);
 this.long = ko.observable(long);
 
 var marker = new google.maps.Marker({
 position: new google.maps.LatLng(lat, long),
 title: name,
 map: map,
 draggable: true
 });
 
 //if you need the position while dragging
 google.maps.event.addListener(marker, 'drag', function () {
 var pos = marker.getPosition();
 this.lat(pos.lat());
 this.long(pos.lng());
 }.bind(this));
 
 //if you just need to update it when the user is filt dragging
 google.maps.event.addListener(marker, 'dragend', function () {
 var pos = marker.getPosition();
 this.lat(pos.lat());
 this.long(pos.lng());
 }.bind(this));
 }*/

//loc = itinerary.locations();

// Call the initializeMap() function when the page loads
window.addEventListener('load', initializeMap);

// listen for window resizing and adjust map bounds
window.addEventListener('resize', mapResize);