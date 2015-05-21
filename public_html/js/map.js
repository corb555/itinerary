// Google mapping helper functions
/*global google, itinerary, window, online */
"use strict";

var mapPage;
var markers;

function Markers() {
    this.markerList = [];

    Markers.prototype.addMarkers = function (locs)
    {
        //using  array of locations, fire off Google place searches for each location
        var service = new google.maps.places.PlacesService(map);
        var idx;
        //var locs = itinerary.filteredLocations();

        // Iterate through the array of locations, create a search object for each location
        for (idx in locs) {
            // the search request object
            var request = {
                query: locs[idx].name()
            };

            // Search the Google Maps API for location data and run the placesCallback
            // function with the search results after each search.
            service.textSearch(request, placesCallback);
        }
    };

// Sets the map on all markers in the array.
    Markers.prototype.setMarkers = function (map) {
        var i;
        for (i = 0; i < this.markerList.length; i += 1) {
            this.markerList[i].setMap(map);
        }
    };


    Markers.prototype.clearMarker = function (id) {
        this.markerList[id].setMap(null);
    };

// Removes the markers from the map, but keeps them in the array.
    Markers.prototype.clearMarkers = function () {
        this.setMarkers(null);
    };

// Deletes all markers in the array by removing references to them.
    Markers.prototype.deleteMarkers = function ()
    {
        this.clearMarkers();
        this.markerList = [];
    };

    Markers.prototype.newMarker = function (placeData) {
        /*
         reads Google Places search results to create map markers.
         placeData is the object returned from search results containing information
         about a single location.
         */
        var icon;

        // Set marker icon based on location type
        switch (placeData.types[0]) {
            case "locality":
                icon = 'images/blue_MarkerA.png';
                break;
            case "park":
                icon = 'images/green_MarkerA.png';
                break;
            default:
                icon = 'images/yellow_MarkerA.png';
        }

        var bounds = window.mapBounds;            // current boundaries of the map window
        var marker = new google.maps.Marker({
            position: placeData.geometry.location,
            title: placeData.name,
            map: map,
            icon: icon
        });

// Add event handler for when Marker is clicked
        google.maps.event.addListener(marker, 'click', function () {
            handleClick(marker);
        });

        this.markerList.push(marker);
        this.setMarkers(map);                    // Bind (enable) all markers to map
        bounds.extend(new google.maps.LatLng(placeData.geometry.location.lat(), placeData.geometry.location.lng())); // add pin to the map
        map.fitBounds(bounds);              // fit the map to the new marker
        map.setCenter(bounds.getCenter());  // center the map
    };
}

var map;    // declare map variable

function resizeMap() {
    if (online)
        map.fitBounds(window.mapBounds);
}
;


// Create map and add all our locations
function createMap() {
    mapPage = this;
    // called when page is loaded.
    var mapOptions = {
        disableDefaultUI: true,
        mapTypeId: google.maps.MapTypeId.TERRAIN
    };

    if (!online)
        return;

    markers = new Markers();

    if (map !== null)
        markers.deleteMarkers();
    map = null;
    // Make Google Map Object and attach to <div id="map">
    map = new google.maps.Map(document.getElementById('map'), mapOptions);

    // Set the boundaries of the map based on pin locations
    window.mapBounds = new google.maps.LatLngBounds();

    // create markers on the map for each location in locations array
    markers.addMarkers(itinerary.filteredLocations());

    itinerary.dirty = false;   // We've now updated map, so clear dirty flag
}
;

// Got response from place lookup
function placesCallback(results, status) {
    // placesCallback results - If success, create a new map marker for that location.
    if (status === google.maps.places.PlacesServiceStatus.OK) {
        markers.newMarker(results[0]);
    }
}
;

// When marker is clicked, get wikipedia info for this location
function handleClick(marker) {
    getWiki(marker.getTitle());
}

// Look up wikipedia item for this location and pop up window
function getWiki(item) {
    var wikiUrl = "http://en.wikipedia.org/w/api.php?action=opensearch&search=%data%&format=json&placesCallback=wikiCallbackFunction&limit=1&suggest=true&redirects=resolve";

    var newUrl = wikiUrl.replace("%data%", item);

    $.ajax(newUrl, {
        dataType: "jsonp",
        success: function (wikiResponse) {
            if (wikiResponse[2][0])
                alert(item + "\n" + wikiResponse[2][0] + "\n" + wikiResponse[3][0]);
            else
                alert(item + "\n no wikipedia entry");
        },
        error: function (wikiResponse) {
            alert(item + "\n no response from wikipedia");
        }
    });
}
;

// Call the initializeMap() function when the page loads
window.addEventListener('load', createMap);

// listen for window resizing and adjust map bounds
window.addEventListener('resize', resizeMap);

// Some future map functions to add

/*
 function radarSearch(loc) {
 var request = {
 bounds: map.getBounds(),
 keyword: 'best view',
 query: loc
 };
 
 var service = new google.maps.places.PlacesService(map);
 service.radarSearch(request, placesCallback);
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