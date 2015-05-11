// Overall viewmodel for this screen, along with initial state
/*global ko */
"use strict";
var viewModel;

function FilterItem(id, name) {
    var self = this;
    self.id = ko.observable(id);
    self.Name = ko.observable(name);
    self.Selected = ko.observable(false);
}

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
}

function LocationsViewModel() {
    var self = this;
    viewModel = this;

    self.tripName = ko.observable("Big Sur");

    // Place types
    self.placeTypes = ["Town", "Park", "Hotel", "Museum", "Restaurant", "Gas", "Other"];

    // Locations
    self.locations = ko.observableArray([
        {name: ko.observable('Big Sur'), type: ko.observable('Park'), rating: ko.observable('1')},
        {name: "Monterey", type: "Town", rating: 4},
        {name: "Carmel", type: "Town", rating: 4},
        {name: "Moonstone Beach", type: "Beach", rating: 2}
    ]);

// LOCATION LIST
// TODO - bypass filter when adding new item
    self.addLocation = function () {
        var loc = {name: "  ", type: "Town", rating: 1};
        self.locations.push(loc);
    };

    self.removeLocation = function (loc) {
        self.locations.remove(loc);
    };

// FILTERS
    self.typeFilters = ko.observableArray();
    self.associatedItemIds = ko.observableArray();

    self.init = function () {
        for (var id in viewModel.placeTypes) {
            if (id % 2 === 1)
                self.typeFilters.push(new FilterItem(id, self.placeTypes[id], true));
            else
                self.typeFilters.push(new FilterItem(id, self.placeTypes[id], false));
        }
        ;
    };
    
    self.notFiltered = function (typ) {
        if (typ === "Town") return true;
        else return false;
    };

// Filter list
    self.filteredLocations = ko.computed(function () {
        var locs = this.locations(), filt = [];
        for (var i = 0; i < locs.length; i++) {
            if (self.notFiltered(locs[i].type) )
                filt.push(locs[i]);
        }
        return filt;
    }, this);

    self.filter = function (genre) {
        self.currentFilter(genre);
    };
}
;

ko.applyBindings(new LocationsViewModel(), document.getElementById("pages"));
viewModel.init();