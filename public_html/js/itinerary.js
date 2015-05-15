// Overall itinerary for this screen, along with initial state
/*global ko */

var itinerary;

function ItineraryModel() {
    "use strict";
    var self = this;
    itinerary = this;
    self.dirty = false;  // Has itinerary been modified or filter changed?

    // Observable Location array of observable items (name and type)
    self.locations = ko.observableArray([
        {name: ko.observable("Big Sur"), type: ko.observable("Park")},
        {name: ko.observable("Monterey"), type: ko.observable("Town")},
        {name: ko.observable("Carmel"), type: ko.observable("Town")},
        {name: ko.observable("Moonstone Beach Park"), type: ko.observable("Beach")}
    ]);

// LOCATION LIST

    // Add a new (blank) location
    self.addLocation = function () {
        self.locations.push({name: ko.observable(" "), type: ko.observable(" ")});
        self.dirty = true;
    };

    // Delete location
    self.removeLocation = function (loc) {
        self.locations.remove(loc);
        self.dirty = true;
    };

// FILTERS
    // Types of locations 
    self.filterTypes = ["Town", "Park", "Hotel", "Beach", "Restaurant", "Gas", "Other"];

    function FilterItem(id, name, selected) {
        var self = this;
        self.id = ko.observable(id);
        self.Name = ko.observable(name);
        self.Selected = ko.observable(selected);
    }

    self.typeFilters = ko.observableArray();  // List of filters
    self.selectedIds = ko.observableArray();  // List of selected filters

    self.init = function () {
        var id;

        // Populate observable Filter array
        for (id in itinerary.filterTypes) {
            self.typeFilters.push(new FilterItem(id, self.filterTypes[id], false));
        }
    };

    // User clicked on checkbox, toggle selected
    self.toggleAssociation = function (item) {
        item.Selected(!(item.Selected()));
        self.dirty = true;  // List has changed, will need to repaint in Map
        return true;
    };

    // Return whether this location type is NOT filtered
    self.notFiltered = function (typ) {
        // Find index of type in filter list
        var ix, match, targetIdx = "";
        targetIdx = self.filterTypes.indexOf(typ) + "";   // Scan for type, convert index to string

        // Scan  selectedFilter list to see if target is in list
        match = self.selectedIds().indexOf(targetIdx);
        if (match === -1) {
            return true;
        }
        else {
            return false;
        }
    };

// Function - filteredLocations - returns a list of locations filtered by location type
    self.filteredLocations = ko.computed(function () {
        var filt = [], i;

        // go through list of locations, add any that are not filtered
        for (i = 0; i < this.locations().length; i += 1) {
            if (self.notFiltered(this.locations()[i].type())) {
                filt.push(this.locations()[i]);
                console.log("Filt add:" + this.locations()[i].name());
            }
        }
        return filt;
    }, this);
}

ko.applyBindings(new ItineraryModel(), document.getElementById("pages"));
itinerary.init();