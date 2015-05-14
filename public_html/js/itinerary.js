// Overall itinerary for this screen, along with initial state
/*global ko */
"use strict";
var itinerary;


function ItineraryModel() {
    var self = this;
    itinerary = this;
    self.dirty = false;  // Has itinerary been modified?

    self.tripName = ko.observable("Big Sur");

    // Place types
    self.filterTypes = ["Town", "Park", "Hotel", "Museum", "Restaurant", "Gas", "Other"];

    // Locations
    self.locations = ko.observableArray([
        {name: "Big Sur", type: "Park"},
        {name: "Monterey", type: "Town"},
        {name: "Carmel", type: "Town"},
        {name: "Moonstone Beach Park", type: "Beach"}
    ]);

    function FilterItem(id, name, selected) {
        var self = this;
        self.id = ko.observable(id);
        self.Name = ko.observable(name);
        self.Selected = ko.observable(selected);
    }
// LOCATION LIST
// TODO - bypass filter when  new item just added
    self.addLocation = function () {
        var id;
        var loc = {name: " ", type: "Town"};

        self.locations.push(loc);
        self.dirty = true;
    };

    self.removeLocation = function (loc) {
        self.locations.remove(loc);
        self.dirty = true;
    };

// FILTERS
    self.typeFilters = ko.observableArray();
    self.selectedIds = ko.observableArray();

    self.init = function () {
        var id;
        for (id in itinerary.filterTypes) {
            
                self.typeFilters.push(new FilterItem(id, self.filterTypes[id], false));
            //self.typeFilters.Selected(true);
        }
    };

    self.toggleAssociation = function (item) {
        if (item.Selected() === true)
            console.log("dissociate item " + item.id());
        else
            console.log("associate item " + item.id());
        item.Selected(!(item.Selected()));
        self.dirty = true;
        return true;
    };

    // TODO return based on real filter
    self.notFiltered = function (typ) {
        // Walk thru filter list until match, then see if filter is on
        for (id in self.filterTypes) {
            
        }
            
            
            
        if (typ === "Town") {
            return true;
        }
        else {
            return true;
        }
        //return true;
    };

// Filter list
    self.filteredLocations = ko.computed(function () {
        var locs = this.locations(), filt = [];
        var i;

        for (i = 0; i < locs.length; i += 1) {
            // if (self.notFiltered(locs[i].type)) {
            filt.push(locs[i]);
            // }
        }
        return filt;
    }, this);

    self.filter = function (genre) {
        self.currentFilter(genre);
    };
}

ko.applyBindings(new ItineraryModel(), document.getElementById("pages"));
itinerary.init();