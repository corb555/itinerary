/* 
 * Page NAV Bar - display page names, make selected page visible, hide others
 */
/*global ko, resetMap, itinerary */
"use strict";
var nav;
var oldPage;

function Nav() {
    var self = this;
    nav = this;

    // Page menu
    self.pages = ['Map', 'Itinerary', 'Filter'];  // Must match Div tags
    self.chosenPageId = ko.observable();
    self.oldPage = "Map";

    self.goToPage = function (page) {
        location.hash = page;  // Add hash to URL to allow bookmarks,etc

        // Deactivate previous page (except MAP) 
        if (oldPage !== "Map") {
            document.getElementById(oldPage).style.display = "none";
        }

        // activate new page
        if (page !== "Map") {
            document.getElementById(page).style.display = "block";
        }
        else {
            // Repaint map with new itinerary or filter
            // If we're going to the map and the itinerary had changed, then recreate it
            if (oldPage !== "Map" && itinerary.dirty) {
                createMap();
                itinerary.dirty = false;
            }
        }
        self.chosenPageId(page);
        oldPage = page;
    };

    self.init = function () {
        ko.applyBindings(new Nav(), document.getElementById("navBar"));

// Deactivate other pages and activate first Page 
        document.getElementById("Itinerary").style.display = "none";
        document.getElementById("Filter").style.display = "none";

        oldPage = "Itinerary";
        nav.goToPage(nav.pages[0]);
    };

    self.init();
}