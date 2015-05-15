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
    self.filterTypes = ["Town", "Park", "Hotel", "Beach", "Restaurant", "Gas", "Other"];

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
        // Find index of type in filter list
        var targetIdx = "";
        targetIdx = self.filterTypes.indexOf(typ) + "";   // Scan for type, convert index to string
        console.log("targ=" + typ );

        // Scan  selectedFilter list to see if target is in list
        var ix; //, tmp1, tmp2;
        //tmp1 = "" + targetIdx;
       // tmp2 = "";
       /*
        for (ix in self.selectedIds()) {
            //tmp1 = targetIdx+"100";
           // tmp2 = (self.selectedIds()[ix])+"100";
            console.log("ix=" + ix + "targ Idx=" + targetIdx + " val=" + self.selectedIds()[ix]);
            
            if (targetIdx === self.selectedIds()[ix]) {
                console.log("MATCH");
                return false;
            }
        } */
        var match = self.selectedIds().indexOf(targetIdx);
        console.log("match=" + match);
        if (match === -1) return(true)
        else
            return(false);

        
        //return true;
    };

// Filter list
    self.filteredLocations = ko.computed(function () {
        var locs = this.locations(), filt = [];
        var i;

        for (i = 0; i < locs.length; i += 1) {
            if (self.notFiltered(locs[i].type)) {
                filt.push(locs[i]);
            }
        }
        return filt;
    }, this);

    self.filter = function (genre) {
        self.currentFilter(genre);
    };
}

ko.applyBindings(new ItineraryModel(), document.getElementById("pages"));
itinerary.init();