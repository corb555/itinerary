// Google mapping helper functions
/*global google, itinerary, window */
"use strict";

var map;    // declare global map variable
var markers = [];
var mapPage;

function mapResize() {
    map.fitBounds(window.mapBounds);
}

// Sets the map on all markers in the array.
function setMarkers(map) {
    var i;
    for (i = 0; i < markers.length; i += 1) {
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

    if (map !== null)
        deleteMarkers();
    map = null;
    // Make Google Map Object and attach to <div id="map">
    map = new google.maps.Map(document.getElementById('map'), mapOptions);

    // Set the boundaries of the map based on pin locations
    window.mapBounds = new google.maps.LatLngBounds();

    // create markers on the map for each location in locations array
    addMarkers();
}

function handleClick(marker) {
    getWiki(marker.getTitle() );
}

function getWiki(item) {
            var wikiUrl = "http://en.wikipedia.org/w/api.php?action=opensearch&search=%data%&format=json&callback=wikiCallbackFunction";

            var newUrl =  wikiUrl.replace("%data%", item) ;
            console.log (newUrl);

            $.ajax(newUrl, {
                dataType: "jsonp",
                success: function( wikiResponse ) {
                    alert( wikiResponse[2][0] );
                }
            });
            
            };

function newMarker(placeData) {
    /*
     reads Google Places search results to create map markers.
     placeData is the object returned from search results containing information
     about a single location.
     */

    var bounds = window.mapBounds;            // current boundaries of the map window
    var marker = new google.maps.Marker({
        position: placeData.geometry.location,
        title: placeData.name,
        map: map
    });

// Add event handler for when Marker is clicked
  google.maps.event.addListener(marker, 'click', function() {
    handleClick(marker);
  });

    markers.push(marker);
    setMarkers(map);                    // Bind (enable) all markers to map
    bounds.extend(new google.maps.LatLng(placeData.geometry.location.lat(), placeData.geometry.location.lng())); // add pin to the map
    map.fitBounds(bounds);              // fit the map to the new marker
    map.setCenter(bounds.getCenter());  // center the map
}


function callback(results, status) {
    // callback results - If success, create a new map marker for that location.
    if (status === google.maps.places.PlacesServiceStatus.OK) {
        newMarker(results[0]);
    }
}

function addMarkers() {
    //using  array of locations, fire off Google place searches for each location
    var service = new google.maps.places.PlacesService(map);
    var place;

    // Iterate through the array of locations, create a search object for each location
    for (place in itinerary.filteredLocations()) {
        // the search request object
        var request = {
            query: itinerary.filteredLocations()[place].name()
        };

        // Search the Google Maps API for location data and run the callback
        // function with the search results after each search.
        service.textSearch(request, callback);
    }
}

// Some future map functions to add

/*
 function radarSearch(loc) {
 var request = {
 bounds: map.getBounds(),
 keyword: 'best view',
 query: loc
 };
 
 var service = new google.maps.places.PlacesService(map);
 service.radarSearch(request, callback);
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


// Call the initializeMap() function when the page loads
window.addEventListener('load', initializeMap);

// listen for window resizing and adjust map bounds
window.addEventListener('resize', mapResize);