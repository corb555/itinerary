// Overall itinerary for this screen, along with initial state
/*global ko */
"use strict";
var itinerary;

function ItineraryModel() {
    var self = this;
    itinerary = this;
    self.dirty = false;  // Has itinerary been modified?
    self.tripName = ko.observable("Big Sur");

    // Types of locations
    self.filterTypes = ["Town", "Park", "Hotel", "Beach", "Restaurant", "Gas", "Other"];
    
    function LocationItem(name, type) {
        var self = this;
        self.name = ko.observable(name);
        self.type = ko.observable(type);
    }

    // List of Locations
    /*
    self.locations = ko.observableArray([
        {name: "Big Sur", type: "Park"},
        {name: "Monterey", type: "Town"},
        {name: "Carmel", type: "Town"},
        {name: "Moonstone Beach Park", type: "Beach"}
    ]);*/

self.locations = ko.observableArray();

    self.locs = [
        "Big Sur", 
        "Monterey", 
        "Carmel", 
        "Moonstone Beach Park"
    ];
    
    self.locTypes = [
        "Park",
        "Town",
        "Town",
        "Beach"
    ];

    function FilterItem(id, name, selected) {
        var self = this;
        self.id = ko.observable(id);
        self.Name = ko.observable(name);
        self.Selected = ko.observable(selected);
    }
    
// LOCATION LIST
// TODO - bypass filter when  new item just added
    self.addLocation = function () {
        var loc = new LocationItem("","");

        self.locations.push(loc);
        self.dirty = true;
    };

    self.removeLocation = function (loc) {
        self.locations.remove(loc);
        self.dirty = true;
    };

// FILTERS
    self.typeFilters = ko.observableArray();  // List of filters
    self.selectedIds = ko.observableArray();  // List of selected filters

    self.init = function () {
        var id;
        for (id in itinerary.filterTypes) {
            self.typeFilters.push(new FilterItem(id, self.filterTypes[id], false));
        }
        
        for (id in itinerary.locs) {
            self.locations.push(new LocationItem(self.locs[id], self.locTypes[id])  );
            //console.log(self.locs[id]);
        }
    };

    self.toggleAssociation = function (item) {
        item.Selected(!(item.Selected()));
        self.dirty = true;  // List has changed, will need to repaint in Map
        return true;
    };

    // Return whether this location type is filtered
    self.notFiltered = function (typ) {
        // Find index of type in filter list
        var targetIdx = "";
        targetIdx = self.filterTypes.indexOf(typ) + "";   // Scan for type, convert index to string
        console.log("targ=" + typ );

        // Scan  selectedFilter list to see if target is in list
        var ix; 
        var match = self.selectedIds().indexOf(targetIdx);
        console.log("match=" + match);
        if (match === -1) return(true);
        else
            return(false);
    };

// Function - filteredLocations - returns a list of locations filtered by location type
    self.filteredLocations = ko.computed(function () {
        var locs = this.locations(), filt = [];
        var i;

// go through list of locations, add any that are not filtered
        for (i = 0; i < locs.length; i += 1) {
            if (self.notFiltered(locs[i].type())) {
                filt.push(locs[i]);
                console.log("Filt add:" + locs[i]);
            }
        }
        return filt;
    }, this);

/*
    self.filter = function (genre) {
        self.currentFilter(genre);
    };*/
}

ko.applyBindings(new ItineraryModel(), document.getElementById("pages"));
itinerary.init();